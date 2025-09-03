import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { config } from '@/lib/config'

// Force Node.js runtime for Stripe API
export const runtime = 'nodejs'

// Initialize Stripe conditionally
let stripe: any = null
try {
  if (config.stripe.enabled) {
    const Stripe = require('stripe')
    stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  }
} catch (error) {
  console.warn('Stripe not available during build')
}

// Initialize Prisma conditionally
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a creator or can become one
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { creator: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // If user already has a creator profile with Stripe account
    if (user.creator?.stripeAccountId) {
      return NextResponse.json(
        { error: 'Creator already has Stripe account' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { returnUrl, refreshUrl } = body

    // Create or update creator profile
    let creator = user.creator
    if (!creator) {
      // Update user role to CREATOR and create creator profile
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'CREATOR' },
      })

      creator = await prisma.creator.create({
        data: {
          userId: user.id,
          handle: user.email!.split('@')[0], // Default handle from email
          displayName: user.name || 'Creator',
          bio: '',
          kycStatus: 'PENDING',
        },
      })
    }

    // Create Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // Default to US, could be made configurable
      email: user.email!,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      individual: {
        email: user.email!,
        first_name: user.name?.split(' ')[0] || 'Creator',
        last_name: user.name?.split(' ').slice(1).join(' ') || '',
      },
      business_profile: {
        mcc: '7392', // Management, consulting, and public relations services
        product_description: 'Creator content and services',
        support_email: user.email!,
      },
    })

    // Save Stripe account ID to creator
    await prisma.creator.update({
      where: { id: creator.id },
      data: { stripeAccountId: account.id },
    })

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refreshUrl || `${config.app.url}/creator/onboard/refresh`,
      return_url: returnUrl || `${config.app.url}/creator/dashboard`,
      type: 'account_onboarding',
    })

    // Log audit event
    await prisma.auditLog.create({
      data: {
        actorUserId: user.id,
        action: 'stripe_connect_onboarding_started',
        target: `creator:${creator.id}`,
        metadata: { stripeAccountId: account.id },
      },
    })

    return NextResponse.json({
      success: true,
      url: accountLink.url,
      accountId: account.id,
    })
  } catch (error) {
    console.error('Stripe Connect onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to create onboarding link' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 503 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const creator = await prisma.creator.findUnique({
      where: { userId: session.user.id },
    })

    if (!creator?.stripeAccountId) {
      return NextResponse.json(
        { error: 'No Stripe account found' },
        { status: 404 }
      )
    }

    // Get account status from Stripe
    const account = await stripe.accounts.retrieve(creator.stripeAccountId)

    // Update KYC status based on Stripe verification
    const kycStatus = account.details_submitted && account.charges_enabled
      ? 'VERIFIED'
      : account.requirements?.disabled_reason
      ? 'REJECTED'
      : 'PENDING'

    await prisma.creator.update({
      where: { id: creator.id },
      data: { kycStatus },
    })

    return NextResponse.json({
      accountId: creator.stripeAccountId,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      kycStatus,
      requirements: account.requirements,
    })
  } catch (error) {
    console.error('Stripe Connect status error:', error)
    return NextResponse.json(
      { error: 'Failed to get account status' },
      { status: 500 }
    )
  }
}