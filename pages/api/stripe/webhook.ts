import { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { withSentryApiHandler, reportError } from '@/lib/sentry'
import { analytics } from '@/lib/analytics'

// Disable body parser for webhook
export const config = {
  api: {
    bodyParser: false,
  },
}

// In-memory idempotency store (use Redis in production)
const processedWebhooks = new Set<string>()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const buf = await buffer(req)
    const signature = req.headers['stripe-signature'] as string

    if (!signature) {
      throw new Error('Missing Stripe signature')
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Stripe webhook secret not configured')
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`)
    }

    // Idempotency check
    const eventKey = `${event.id}_${event.type}`
    if (processedWebhooks.has(eventKey)) {
      console.log(`Webhook ${event.id} already processed, skipping`)
      return res.status(200).json({ received: true, status: 'already_processed' })
    }

    console.log(`Processing webhook: ${event.type} (${event.id})`)

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event)
        break
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event)
        break
        
      case 'account.updated':
        await handleAccountUpdated(event)
        break
        
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event)
        break
        
      default:
        console.log(`Unhandled event type: ${event.type}`)
        break
    }

    // Mark as processed
    processedWebhooks.add(eventKey)
    
    // Track successful webhook processing
    analytics.stripeWebhookSuccess({
      webhookType: event.type,
      eventId: event.id,
    })

    res.status(200).json({ 
      received: true, 
      eventType: event.type,
      eventId: event.id 
    })
  } catch (error) {
    // Track failed webhook processing
    analytics.stripeWebhookFail({
      webhookType: req.body?.type || 'unknown',
      eventId: req.body?.id,
      error: (error as Error).message,
    })

    reportError(error as Error, {
      endpoint: '/api/stripe/webhook',
      method: req.method,
      headers: req.headers,
    })

    console.error('Webhook processing failed:', error)
    res.status(400).json({
      error: 'Webhook processing failed',
      message: (error as Error).message,
    })
  }
}

async function handlePaymentSuccess(event: any) {
  const paymentIntent = event.data.object
  const metadata = paymentIntent.metadata

  console.log(`Payment succeeded: ${paymentIntent.id}`, metadata)

  // In production, create purchase record in database
  const purchase = {
    id: `purchase_${Date.now()}`,
    userId: metadata.userId || 'anonymous',
    creatorId: metadata.creatorId,
    contentId: metadata.contentId,
    amount: paymentIntent.amount / 100, // Convert from cents
    platformFee: parseFloat(metadata.platformFee || '0'),
    creatorEarnings: parseFloat(metadata.creatorEarnings || '0'),
    stripePaymentId: paymentIntent.id,
    status: 'completed',
    type: metadata.type || 'content_unlock',
    processedAt: new Date(),
  }

  console.log('Purchase recorded:', purchase)

  // Track successful unlock
  if (metadata.type === 'content_unlock') {
    analytics.unlockSuccess({
      contentId: metadata.contentId,
      userId: metadata.userId,
      method: 'payment',
      amount: purchase.amount,
    })
  }
}

async function handlePaymentFailed(event: any) {
  const paymentIntent = event.data.object
  console.log(`Payment failed: ${paymentIntent.id}`, paymentIntent.last_payment_error)
  
  // In production, update purchase record status to 'failed'
  // Send notification to user about payment failure
}

async function handleAccountUpdated(event: any) {
  const account = event.data.object
  console.log(`Account updated: ${account.id}`, {
    charges_enabled: account.charges_enabled,
    payouts_enabled: account.payouts_enabled,
  })
  
  // In production, update creator's Stripe account status in database
}

async function handleCheckoutCompleted(event: any) {
  const session = event.data.object
  console.log(`Checkout completed: ${session.id}`, session.metadata)
  
  // Additional processing after checkout completion if needed
}

export default withSentryApiHandler(handler)