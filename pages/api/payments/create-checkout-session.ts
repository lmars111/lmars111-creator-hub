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
    const { creatorId, contentId, userId, amount } = req.body

    if (!creatorId || !contentId || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: creatorId, contentId, amount' 
      })
    }

    if (amount < 0.50 || amount > 1000) {
      return res.status(400).json({ 
        error: 'Amount must be between $0.50 and $1000' 
      })
    }

    // Calculate platform fees (20%)
    const fees = calculateFees(amount)

    // Track unlock attempt
    analytics.unlockAttempt({
      contentId,
      userId,
      method: 'payment',
      amount,
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Unlock Creator Content',
              description: 'Access exclusive creator content',
              images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/${creatorId}/chat?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/c/${creatorId}/chat?canceled=true`,
      customer_email: userId ? 'fan@example.com' : undefined, // In production, get from user data
      metadata: {
        creatorId,
        contentId,
        userId: userId || 'anonymous',
        platformFee: fees.platformFee.toString(),
        creatorEarnings: fees.creatorEarnings.toString(),
        type: 'content_unlock',
      },
      payment_intent_data: {
        application_fee_amount: Math.round(fees.platformFee * 100), // Platform fee in cents
        transfer_data: {
          destination: 'acct_demo_creator', // In production, get creator's Stripe account ID
        },
        metadata: {
          creatorId,
          contentId,
          type: 'content_unlock',
        },
      },
    })

    // Log checkout session creation
    console.log(`Created checkout session ${session.id} for content ${contentId}:`, {
      amount: fees.amount,
      platformFee: fees.platformFee,
      creatorEarnings: fees.creatorEarnings,
    })

    res.status(200).json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      fees,
      message: 'Checkout session created successfully',
    })
  } catch (error) {
    reportError(error as Error, {
      endpoint: '/api/payments/create-checkout-session',
      method: req.method,
      body: req.body,
    })

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: errorMessage,
    })
  }
}

export default withSentryApiHandler(handler)