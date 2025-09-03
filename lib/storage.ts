import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize S3 client with AWS credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET || 'creator-hub-uploads'
export const AWS_CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN

interface SignedUploadUrlOptions {
  key: string
  contentType: string
  contentLength?: number
  expiresIn?: number
}

export async function getSignedUploadUrl({
  key,
  contentType,
  contentLength,
  expiresIn = 300, // 5 minutes
}: SignedUploadUrlOptions) {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured')
  }

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ...(contentLength && { ContentLength: contentLength }),
  })

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })
  
  return {
    signedUrl,
    key,
    publicUrl: AWS_CLOUDFRONT_DOMAIN 
      ? `${AWS_CLOUDFRONT_DOMAIN}/${key}`
      : `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
  }
}

export function generateUploadKey(userId: string, filename: string, type: 'avatar' | 'cover' | 'content' | 'post') {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = filename.split('.').pop()
  
  return `${type}/${userId}/${timestamp}-${randomString}.${extension}`
}

export function validateFileType(contentType: string, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      return contentType.startsWith(type.slice(0, -1))
    }
    return contentType === type
  })
}

export function validateFileSize(size: number, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return size <= maxSizeBytes
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
]

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/mov',
  'video/avi',
]

export const ALLOWED_AUDIO_TYPES = [
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/m4a',
]

export const MAX_FILE_SIZE_MB = {
  AVATAR: 5,
  COVER: 10,
  IMAGE: 25,
  VIDEO: 100,
  AUDIO: 50,
}