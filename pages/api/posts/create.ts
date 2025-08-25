import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { withSentryApiHandler, reportError } from '@/lib/sentry'
import { analytics } from '@/lib/analytics'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { 
      creatorId, 
      title, 
      content, 
      mediaUrl, 
      thumbnailUrl, 
      blurredUrl, 
      price 
    } = req.body

    if (!creatorId || !title || !price) {
      return res.status(400).json({ 
        error: 'Missing required fields: creatorId, title, price' 
      })
    }

    // Validate price
    const numPrice = Number(price)
    if (isNaN(numPrice) || numPrice < 1 || numPrice > 1000) {
      return res.status(400).json({ 
        error: 'Price must be between $1 and $1000' 
      })
    }

    // In production, verify creator ownership
    // For demo, we'll check if creator exists
    if (creatorId !== 'creator_jess') {
      return res.status(404).json({ error: 'Creator not found' })
    }

    // Create post (mock for demo - in production would save to database)
    const post = {
      id: `post_${Date.now()}`,
      creatorId,
      title,
      content: content || null,
      mediaUrl: mediaUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      blurredUrl: blurredUrl || null,
      price: numPrice,
      isLocked: true,
      viewCount: 0,
      unlockCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Track post creation
    analytics.postCreated({
      creatorId,
      postId: post.id,
      price: numPrice,
      hasMedia: !!mediaUrl,
      contentLength: content?.length || 0
    })

    console.log('Created post:', post)

    res.status(201).json({
      success: true,
      post,
      message: 'Post created successfully'
    })
  } catch (error) {
    reportError(error as Error, {
      endpoint: '/api/posts/create',
      method: req.method,
      body: req.body,
    })

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    res.status(500).json({
      error: 'Failed to create post',
      message: errorMessage,
    })
  }
}

export default withSentryApiHandler(handler)