import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

// Force Node.js runtime for S3 API
export const runtime = 'nodejs'

// Initialize Prisma conditionally
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

// Initialize S3 client conditionally
let getSignedUrl: any = null
let GetObjectCommand: any = null
let s3Client: any = null

try {
  const AWS = require('@aws-sdk/client-s3')
  const { getSignedUrl: getSignedUrlFn } = require('@aws-sdk/s3-request-presigner')
  const { config } = require('@/lib/config')
  
  if (config.s3.enabled) {
    GetObjectCommand = AWS.GetObjectCommand
    getSignedUrl = getSignedUrlFn
    s3Client = new AWS.S3Client({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId!,
        secretAccessKey: config.s3.secretAccessKey!,
      },
    })
  }
} catch (error) {
  console.warn('S3 not available during build')
}

interface ContentAccessParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: ContentAccessParams
) {
  try {
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

    const { id: contentId } = params

    // Get content details
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: {
        creator: true,
      },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Check access permissions based on visibility
    let hasAccess = false
    const userId = session.user.id

    switch (content.visibility) {
      case 'FREE':
        hasAccess = true
        break

      case 'SUBSCRIBER':
        // Check if user has active subscription to this creator
        const subscription = await prisma.subscription.findFirst({
          where: {
            fanId: userId,
            creatorId: content.creatorId,
            status: 'ACTIVE',
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
        })
        hasAccess = !!subscription
        break

      case 'PPV':
        // Check if user has purchased this specific content
        const purchase = await prisma.purchase.findFirst({
          where: {
            fanId: userId,
            contentId: contentId,
          },
        })
        hasAccess = !!purchase
        break

      default:
        hasAccess = false
    }

    // Creator always has access to their own content
    if (content.creatorId === session.user.creatorId) {
      hasAccess = true
    }

    if (!hasAccess) {
      return NextResponse.json(
        { 
          error: 'Access denied',
          visibility: content.visibility,
          priceCents: content.priceCents,
        },
        { status: 403 }
      )
    }

    // Generate signed URL for content access
    if (!content.mediaKey || !s3Client || !getSignedUrl || !GetObjectCommand) {
      return NextResponse.json(
        { error: 'Content not available' },
        { status: 503 }
      )
    }

    const { config } = require('@/lib/config')
    const command = new GetObjectCommand({
      Bucket: config.s3.bucket,
      Key: content.mediaKey,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { 
      expiresIn: 3600, // 1 hour
    })

    // Log content access for analytics
    await prisma.auditLog.create({
      data: {
        actorUserId: userId,
        action: 'content_accessed',
        target: `content:${contentId}`,
        metadata: {
          contentTitle: content.title,
          creatorId: content.creatorId,
          visibility: content.visibility,
        },
      },
    })

    return NextResponse.json({
      accessUrl: signedUrl,
      content: {
        id: content.id,
        title: content.title,
        description: content.description,
        mediaType: content.mediaType,
        createdAt: content.createdAt,
        creator: {
          id: content.creator.id,
          displayName: content.creator.displayName,
          handle: content.creator.handle,
        },
      },
      expiresIn: 3600,
    })
  } catch (error) {
    console.error('Content access error:', error)
    return NextResponse.json(
      { error: 'Failed to check content access' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: ContentAccessParams
) {
  try {
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

    const { id: contentId } = params

    // Create a content access request/purchase intent
    // This could be used to trigger purchase flow for PPV content
    const content = await prisma.content.findUnique({
      where: { id: contentId },
    })

    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    if (content.visibility === 'PPV' && content.priceCents) {
      // Check if already purchased
      const existingPurchase = await prisma.purchase.findFirst({
        where: {
          fanId: session.user.id,
          contentId: contentId,
        },
      })

      if (existingPurchase) {
        return NextResponse.json(
          { message: 'Content already purchased' },
          { status: 200 }
        )
      }

      return NextResponse.json({
        requiresPurchase: true,
        priceCents: content.priceCents,
        contentId: contentId,
        purchaseUrl: `/api/stripe/checkout/content/${contentId}`,
      })
    }

    return NextResponse.json({
      requiresPurchase: false,
    })
  } catch (error) {
    console.error('Content access request error:', error)
    return NextResponse.json(
      { error: 'Failed to process access request' },
      { status: 500 }
    )
  }
}