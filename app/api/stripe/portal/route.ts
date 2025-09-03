import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { createBillingPortalSession } from '@/lib/stripe/helpers'
import { config } from '@/lib/config'

// Force Node.js runtime for Stripe API
export const runtime = 'nodejs'

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
    if (!config.stripe.enabled) {
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

    const body = await request.json()
    const { returnUrl } = body

    // Get user's active subscription to find Stripe customer ID
    const subscription = await prisma.subscription.findFirst({
      where: {
        fanId: session.user.id,
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Create billing portal session
    const portalSession = await createBillingPortalSession(
      subscription.stripeCustomerId,
      returnUrl || `${config.app.url}/fan/subscriptions`
    )

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    )
  }
}