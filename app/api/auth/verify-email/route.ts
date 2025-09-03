import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyEmailSchema } from '@/lib/validators'
import type { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = verifyEmailSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { email, code } = validationResult.data

    // Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: code,
        expires: {
          gt: new Date(), // Token must not be expired
        },
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { creator: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user and creator in a transaction
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Mark user as verified and active
      await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          status: 'ACTIVE',
        },
      })

      // Update creator onboarding step
      if (user.creator) {
        await tx.creator.update({
          where: { id: user.creator.id },
          data: {
            onboardingStep: 'KYC',
          },
        })
      }

      // Delete all verification tokens for this email
      await tx.verificationToken.deleteMany({
        where: { identifier: email },
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'EMAIL_VERIFIED',
          target: 'User',
          metadata: { email },
        },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. You can now proceed to KYC verification.',
    })

  } catch (error) {
    console.error('Email verification error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}