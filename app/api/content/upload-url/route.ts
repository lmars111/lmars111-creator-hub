import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getSignedUploadUrl, generateUploadKey, validateFileType, validateFileSize } from '@/lib/storage'

// Force Node.js runtime for S3 API
export const runtime = 'nodejs'

const ALLOWED_CONTENT_TYPES = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'text/plain',
]

const MAX_FILE_SIZE_MB = 100 // 100MB limit

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only creators can upload content
    if (session.user.role !== 'CREATOR') {
      return NextResponse.json(
        { error: 'Only creators can upload content' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { filename, contentType, fileSize } = body

    // Validate input
    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'Filename and content type are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!validateFileType(contentType, ALLOWED_CONTENT_TYPES)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // Validate file size if provided
    if (fileSize && !validateFileSize(fileSize, MAX_FILE_SIZE_MB)) {
      return NextResponse.json(
        { error: `File size must be less than ${MAX_FILE_SIZE_MB}MB` },
        { status: 400 }
      )
    }

    // Generate upload key
    const uploadKey = generateUploadKey(session.user.id, filename, 'content')

    // Get presigned upload URL
    const uploadData = await getSignedUploadUrl({
      key: uploadKey,
      contentType,
      contentLength: fileSize,
      expiresIn: 300, // 5 minutes
    })

    return NextResponse.json({
      uploadUrl: uploadData.signedUrl,
      key: uploadData.key,
      publicUrl: uploadData.publicUrl,
      expiresIn: 300,
    })
  } catch (error) {
    console.error('Upload URL generation error:', error)
    
    if (error instanceof Error && error.message.includes('AWS credentials not configured')) {
      return NextResponse.json(
        { error: 'File upload not configured' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      allowedTypes: ALLOWED_CONTENT_TYPES,
      maxFileSizeMB: MAX_FILE_SIZE_MB,
      expiresIn: 300,
    })
  } catch (error) {
    console.error('Upload info error:', error)
    return NextResponse.json(
      { error: 'Failed to get upload info' },
      { status: 500 }
    )
  }
}