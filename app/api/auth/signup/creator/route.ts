import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'
import { signupSchema, generateHandleFromEmail } from '@/lib/validators'
import { rateLimitSignup } from '@/lib/rate-limit'
import type { Prisma } from '@prisma/client'

function getClientIP(request: NextRequest): string {
  // Check for forwarded IP addresses
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  // Check for real IP
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // Fallback to connection IP (may not be available in all environments)
  return request.ip || 'unknown'
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    
    // Rate limiting
    const rateLimitResult = rateLimitSignup(request)
    if (!rateLimitResult.allowed) {
      // Still record the attempt even if rate limited
      await prisma.signUpAttempt.create({
        data: { ip, success: false }
      })
      
      return NextResponse.json(
        {
          error: 'Too many signup attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      await prisma.signUpAttempt.create({
        data: { ip, email: body.email, success: false }
      })
      
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { email, password, isAdult } = validationResult.data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      await prisma.signUpAttempt.create({
        data: { ip, email, success: false }
      })
      
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Generate unique handle
    let baseHandle = generateHandleFromEmail(email)
    let handle = baseHandle
    let suffix = 1
    
    while (await prisma.creator.findUnique({ where: { handle } })) {
      handle = `${baseHandle}${suffix}`
      suffix++
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user and creator in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          isAdult,
          role: 'CREATOR',
          status: 'PENDING_VERIFICATION',
        }
      })

      // Create creator profile
      const creator = await tx.creator.create({
        data: {
          userId: user.id,
          handle,
          displayName: handle, // Default to handle
          onboardingStep: 'EMAIL_VERIFICATION',
        }
      })

      // Create verification token
      await tx.verificationToken.create({
        data: {
          identifier: email,
          token: otp,
          expires: otpExpires,
        }
      })

      // Record successful signup attempt
      await tx.signUpAttempt.create({
        data: { ip, email, success: true }
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          actorUserId: user.id,
          action: 'SIGNUP_ATTEMPT',
          target: 'User',
          metadata: { ip, email, role: 'CREATOR' },
        }
      })

      return { user, creator }
    })

    // Send verification email
    try {
      await sendVerificationEmail(email, otp)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail the signup if email fails - user can request resend
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification code.',
      userId: result.user.id,
    })

  } catch (error) {
    console.error('Signup error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}