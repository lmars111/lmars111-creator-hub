import { NextApiRequest, NextApiResponse } from 'next'
import { stripe, calculateFees } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { withSentryApiHandler, reportError } from '@/lib/sentry'
import { analytics } from '@/lib/analytics'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { postId, userId } = req.body

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' })
    }

    // Mock post data for demo (in production, fetch from database)
    const mockPost = {
      id: postId,
      creatorId: 'creator_jess',
      title: 'Exclusive Behind-the-Scenes Content',
      price: 15,
      isLocked: true
    }

    if (!mockPost) {
      return res.status(404).json({ error: 'Post not found' })
    }

    if (!mockPost.isLocked) {
      return res.status(400).json({ error: 'Post is not locked' })
    }

    const amount = mockPost.price
    const fees = calculateFees(amount)

    // Track unlock attempt
    analytics.unlockAttempt({
      contentId: postId,
      userId,
      method: 'payment',
      amount,
    })

    if (!stripe) {
      return res.status(503).json({ 
        success: false,
        error: 'Payment processing unavailable',
        message: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.',
        fees,
        post: mockPost
      })
    }

    // Create Stripe checkout session for post unlock
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Unlock: ${mockPost.title}`,
              description: 'Access exclusive creator content',
              images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/jess?unlocked=${postId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/jess?canceled=true`,
      customer_email: userId ? 'fan@example.com' : undefined,
      metadata: {
        type: 'post_unlock',
        postId,
        creatorId: mockPost.creatorId,
        userId: userId || 'anonymous',
        platformFee: fees.platformFee.toString(),
        creatorEarnings: fees.creatorEarnings.toString(),
      },
      payment_intent_data: {
        application_fee_amount: Math.round(fees.platformFee * 100),
        transfer_data: {
          destination: 'acct_demo_creator',
        },
        metadata: {
          type: 'post_unlock',
          postId,
          creatorId: mockPost.creatorId,
        },
      },
    })

    console.log(`Created checkout session ${session.id} for post ${postId}:`, {
      amount: fees.amount,
      platformFee: fees.platformFee,
      creatorEarnings: fees.creatorEarnings,
    })

    res.status(200).json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      fees,
      post: mockPost,
      message: 'Stripe checkout session created successfully'
    })
  } catch (error) {
    reportError(error as Error, {
      endpoint: '/api/posts/unlock',
      method: req.method,
      body: req.body,
    })

    console.error('Post unlock error:', error)

    // Return demo response even on error for development
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
      message: `Demo Mode: ${errorMessage}. In production, this would redirect to Stripe checkout.`,
      fees: calculateFees(15), // Default price for demo
    })
  }
}

export default withSentryApiHandler(handler)