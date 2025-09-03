import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { 
  getSignedUploadUrl, 
  generateUploadKey, 
  validateFileType, 
  validateFileSize,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  ALLOWED_AUDIO_TYPES,
  MAX_FILE_SIZE_MB
} from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { filename, contentType, contentLength, uploadType } = body

    if (!filename || !contentType || !uploadType) {
      return NextResponse.json({ 
        error: 'Missing required fields: filename, contentType, uploadType' 
      }, { status: 400 })
    }

    // Validate upload type
    const validTypes = ['avatar', 'cover', 'content', 'post']
    if (!validTypes.includes(uploadType)) {
      return NextResponse.json({ 
        error: 'Invalid upload type. Must be: avatar, cover, content, or post' 
      }, { status: 400 })
    }

    // Validate file type
    let allowedTypes: string[] = []
    let maxSize = 0

    switch (uploadType) {
      case 'avatar':
        allowedTypes = ALLOWED_IMAGE_TYPES
        maxSize = MAX_FILE_SIZE_MB.AVATAR
        break
      case 'cover':
        allowedTypes = ALLOWED_IMAGE_TYPES
        maxSize = MAX_FILE_SIZE_MB.COVER
        break
      case 'content':
        allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_AUDIO_TYPES]
        if (contentType.startsWith('video/')) {
          maxSize = MAX_FILE_SIZE_MB.VIDEO
        } else if (contentType.startsWith('audio/')) {
          maxSize = MAX_FILE_SIZE_MB.AUDIO
        } else {
          maxSize = MAX_FILE_SIZE_MB.IMAGE
        }
        break
      case 'post':
        allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
        if (contentType.startsWith('video/')) {
          maxSize = MAX_FILE_SIZE_MB.VIDEO
        } else {
          maxSize = MAX_FILE_SIZE_MB.IMAGE
        }
        break
    }

    if (!validateFileType(contentType, allowedTypes)) {
      return NextResponse.json({ 
        error: `File type ${contentType} not allowed for ${uploadType}` 
      }, { status: 400 })
    }

    if (contentLength && !validateFileSize(contentLength, maxSize)) {
      return NextResponse.json({ 
        error: `File size exceeds ${maxSize}MB limit` 
      }, { status: 400 })
    }

    // Generate unique key for the file
    const key = generateUploadKey(session.user.id, filename, uploadType as any)

    // Get signed URL
    const uploadData = await getSignedUploadUrl({
      key,
      contentType,
      contentLength,
      expiresIn: 300, // 5 minutes
    })

    return NextResponse.json({
      success: true,
      data: uploadData,
    })

  } catch (error) {
    console.error('Upload sign error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate upload URL' 
    }, { status: 500 })
  }
}