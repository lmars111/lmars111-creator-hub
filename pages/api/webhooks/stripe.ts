import { NextApiRequest, NextApiResponse } from 'next'
import { withSentryApiHandler, reportError } from '../../../lib/sentry'
import { analytics } from '../../../lib/analytics'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type, data } = req.body

    // Validate webhook signature (simplified for demo)
    const signature = req.headers['stripe-signature']
    if (!signature) {
      throw new Error('Missing Stripe signature')
    }

    // Simulate webhook processing
    const webhookData = {
      id: data?.id || `evt_${Date.now()}`,
      type: type || 'payment_intent.succeeded',
      customerId: data?.customer || undefined,
    }

    // Simulate processing logic
    if (type === 'payment_intent.succeeded') {
      // Process successful payment
      console.log('Processing successful payment:', webhookData)
    } else if (type === 'customer.subscription.created') {
      // Process new subscription
      console.log('Processing new subscription:', webhookData)
    }

    // Track successful webhook processing
    analytics.stripeWebhookSuccess({
      webhookType: type,
      eventId: webhookData.id,
      customerId: webhookData.customerId,
    })

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
    })
  } catch (error) {
    // Track failed webhook processing
    analytics.stripeWebhookFail({
      webhookType: req.body?.type || 'unknown',
      eventId: req.body?.data?.id || undefined,
      error: (error as Error).message,
    })

    reportError(error as Error, {
      endpoint: '/api/webhooks/stripe',
      method: req.method,
      headers: req.headers,
      body: req.body,
    })

    res.status(400).json({
      error: 'Webhook processing failed',
      message: (error as Error).message,
    })
  }
}

export default withSentryApiHandler(handler)