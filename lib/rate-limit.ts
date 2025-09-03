import { NextRequest } from 'next/server'

// In-memory rate limiting (use Redis in production)
const rateLimits = new Map<string, { count: number; resetTime: number }>()

export interface RateLimitOptions {
  limit: number // requests per window
  windowMs: number // window size in milliseconds
  identifier?: string // custom identifier, defaults to IP
}

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const { limit, windowMs, identifier } = options
  const key = identifier || getClientIdentifier(request)
  const now = Date.now()

  // Clean up expired entries
  cleanupExpired(now)

  const record = rateLimits.get(key)
  
  if (!record || now > record.resetTime) {
    // Create new or reset expired record
    rateLimits.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    }
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000),
    }
  }

  // Increment count
  record.count++
  
  return {
    allowed: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  }
}

export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const remoteAddr = request.headers.get('x-vercel-forwarded-for')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  if (remoteAddr) {
    return remoteAddr
  }
  
  // Fallback to a default identifier
  return 'unknown'
}

function cleanupExpired(now: number) {
  for (const [key, record] of rateLimits.entries()) {
    if (now > record.resetTime) {
      rateLimits.delete(key)
    }
  }
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  AUTH: {
    limit: 5, // 5 attempts
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  CHAT: {
    limit: 60, // 60 messages
    windowMs: 60 * 1000, // 1 minute
  },
  UPLOAD: {
    limit: 20, // 20 uploads
    windowMs: 60 * 1000, // 1 minute
  },
  API_GENERAL: {
    limit: 100, // 100 requests
    windowMs: 60 * 1000, // 1 minute
  },
  WEBHOOK: {
    limit: 1000, // 1000 webhooks
    windowMs: 60 * 1000, // 1 minute
  },
} as const

// Utility function to create rate limit middleware
export function createRateLimitMiddleware(options: RateLimitOptions) {
  return (request: NextRequest) => {
    return rateLimit(request, options)
  }
}

// Rate limit for authenticated endpoints
export function rateLimitAuth(request: NextRequest, userId?: string) {
  return rateLimit(request, {
    ...RATE_LIMITS.AUTH,
    identifier: userId ? `auth_${userId}` : undefined,
  })
}

// Rate limit for chat endpoints
export function rateLimitChat(request: NextRequest, userId: string) {
  return rateLimit(request, {
    ...RATE_LIMITS.CHAT,
    identifier: `chat_${userId}`,
  })
}

// Rate limit for upload endpoints
export function rateLimitUpload(request: NextRequest, userId: string) {
  return rateLimit(request, {
    ...RATE_LIMITS.UPLOAD,
    identifier: `upload_${userId}`,
  })
}

// Rate limit for general API endpoints
export function rateLimitApi(request: NextRequest) {
  return rateLimit(request, RATE_LIMITS.API_GENERAL)
}

// Rate limit for webhook endpoints
export function rateLimitWebhook(request: NextRequest) {
  return rateLimit(request, RATE_LIMITS.WEBHOOK)
}