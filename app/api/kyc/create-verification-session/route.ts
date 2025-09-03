import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/prisma'
import { kycSessionSchema } from '@/lib/validators'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    // Get session (placeholder for now - in production would check for authenticated creator)
    const session = await getServerSession(authOptions)
    
    // For now, we'll use a placeholder creator ID if no session
    // In production, this would require authentication
    let creatorId = 'placeholder-creator-id'
    
    if (session?.user?.creatorId) {
      creatorId = session.user.creatorId
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = kycSessionSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { return_url } = validationResult.data

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'KYC verification not available. Stripe not configured.' },
        { status: 503 }
      )
    }

    // Create Stripe Identity verification session
    const verificationSession = await stripe.identity.verificationSessions.create({
      type: 'document',
      metadata: {
        creator_id: creatorId,
      },
      options: {
        document: {
          require_id_number: true,
          require_live_capture: true,
          require_matching_selfie: true,
        },
      },
      return_url: return_url || `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/creator/profile`,
    })

    // Store verification session in database
    await prisma.kycVerification.create({
      data: {
        creatorId,
        status: 'PENDING',
        provider: 'STRIPE_IDENTITY',
        referenceId: verificationSession.id,
      },
    })

    // Update creator status to indicate KYC is in progress
    await prisma.creator.update({
      where: { id: creatorId },
      data: {
        kycStatus: 'PENDING',
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: verificationSession.id,
      client_secret: verificationSession.client_secret,
      url: verificationSession.url,
    })

  } catch (error) {
    console.error('KYC session creation error:', error)
    
    if (error instanceof Error && error.message.includes('No such')) {
      return NextResponse.json(
        { error: 'Creator not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}