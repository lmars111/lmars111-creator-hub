import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'
import type { Prisma } from '@prisma/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

function mapStripeStatusToUnified(stripeStatus: string): 'PENDING' | 'PROCESSING' | 'VERIFIED' | 'REJECTED' {
  switch (stripeStatus) {
    case 'requires_input':
    case 'processing':
      return 'PROCESSING'
    case 'verified':
      return 'VERIFIED'
    case 'canceled':
    case 'requires_input':
      return 'REJECTED'
    default:
      return 'PENDING'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'KYC status check not available. Stripe not configured.' },
        { status: 503 }
      )
    }

    // Get verification session from Stripe
    const verificationSession = await stripe.identity.verificationSessions.retrieve(sessionId)
    
    // Map Stripe status to unified status
    const unifiedStatus = mapStripeStatusToUnified(verificationSession.status)

    // Find KYC verification record
    const kycVerification = await prisma.kycVerification.findFirst({
      where: {
        referenceId: sessionId,
        provider: 'STRIPE_IDENTITY',
      },
      include: {
        creator: true,
      },
    })

    if (!kycVerification) {
      return NextResponse.json(
        { error: 'Verification session not found' },
        { status: 404 }
      )
    }

    // Update verification status if changed
    if (kycVerification.status !== unifiedStatus) {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Update KYC verification
        await tx.kycVerification.update({
          where: { id: kycVerification.id },
          data: { status: unifiedStatus },
        })

        // Update creator KYC status
        await tx.creator.update({
          where: { id: kycVerification.creatorId },
          data: { kycStatus: unifiedStatus },
        })

        // If verified, update onboarding step
        if (unifiedStatus === 'VERIFIED') {
          await tx.creator.update({
            where: { id: kycVerification.creatorId },
            data: { onboardingStep: 'PROFILE' },
          })
        }
      })
    }

    return NextResponse.json({
      success: true,
      status: unifiedStatus,
      stripeStatus: verificationSession.status,
      lastError: verificationSession.last_error?.reason || null,
    })

  } catch (error) {
    console.error('KYC status check error:', error)
    
    if (error instanceof Error && error.message.includes('No such')) {
      return NextResponse.json(
        { error: 'Verification session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}