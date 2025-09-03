import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { config } from '@/lib/config'

// Force Node.js runtime for Stripe API
export const runtime = 'nodejs'

// Initialize Stripe conditionally
let stripe: any = null
try {
  if (config.stripe.enabled) {
    const Stripe = require('stripe')
    stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2023-10-16',
    })
  }
} catch (error) {
  console.warn('Stripe not available during build')
}

// Initialize Prisma conditionally
let prisma: any = null
try {
  const { prisma: prismaClient } = require('@/lib/prisma')
  prisma = prismaClient
} catch (error) {
  console.warn('Prisma not available during build')
}

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !config.stripe.webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe webhook not configured' },
        { status: 503 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No Stripe signature found' },
        { status: 400 }
      )
    }

    let event: any
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripe.webhookSecret
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Check if we've already processed this event
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId: event.id },
    })

    if (existingEvent?.processedAt) {
      console.log(`Event ${event.id} already processed`)
      return NextResponse.json({ received: true })
    }

    // Store the webhook event
    await prisma.webhookEvent.upsert({
      where: { eventId: event.id },
      update: {},
      create: {
        provider: 'STRIPE',
        eventId: event.id,
        payload: event,
      },
    })

    // Process the event
    try {
      await processStripeEvent(event)
      
      // Mark as processed
      await prisma.webhookEvent.update({
        where: { eventId: event.id },
        data: { processedAt: new Date() },
      })
    } catch (error) {
      console.error(`Error processing event ${event.id}:`, error)
      // Don't mark as processed so we can retry
      return NextResponse.json(
        { error: 'Failed to process event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook failed' },
      { status: 500 }
    )
  }
}

async function processStripeEvent(event: any) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object)
      break
    
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object)
      break
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object)
      break
    
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object)
      break
    
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object)
      break
    
    case 'account.updated':
      await handleAccountUpdated(event.data.object)
      break
    
    case 'payout.created':
    case 'payout.paid':
    case 'payout.failed':
      await handlePayoutEvent(event.data.object, event.type)
      break
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  const { metadata, customer, subscription, payment_intent } = session

  if (metadata?.type === 'subscription') {
    // Handle subscription checkout
    const { creatorId, tierId, fanId } = metadata
    
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        fanId,
        creatorId,
        tierId,
      },
    })

    if (!existingSubscription) {
      await prisma.subscription.create({
        data: {
          fanId,
          creatorId,
          tierId,
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription,
          status: 'ACTIVE',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Will be updated by subscription webhook
        },
      })
    }
  } else if (metadata?.type === 'tip') {
    // Handle tip payment
    const { creatorId, fanId, amountCents } = metadata
    
    await prisma.tip.create({
      data: {
        fanId,
        creatorId,
        amountCents: parseInt(amountCents),
        stripePaymentIntentId: payment_intent,
      },
    })

    // Create notification for creator
    await prisma.notification.create({
      data: {
        userId: creatorId,
        type: 'tip_received',
        payload: {
          fanId,
          amountCents: parseInt(amountCents),
          paymentIntentId: payment_intent,
        },
      },
    })
  } else if (metadata?.type === 'content_purchase') {
    // Handle content purchase
    const { creatorId, fanId, contentId, amountCents } = metadata
    
    await prisma.purchase.create({
      data: {
        fanId,
        contentId,
        creatorId,
        amountCents: parseInt(amountCents),
        stripePaymentIntentId: payment_intent,
      },
    })

    // Create notification for creator
    await prisma.notification.create({
      data: {
        userId: creatorId,
        type: 'content_purchased',
        payload: {
          fanId,
          contentId,
          amountCents: parseInt(amountCents),
        },
      },
    })
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (dbSubscription) {
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: subscription.status.toUpperCase(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    })
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (dbSubscription) {
    await prisma.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: 'CANCELED',
      },
    })

    // Create notification for creator
    await prisma.notification.create({
      data: {
        userId: dbSubscription.creatorId,
        type: 'subscription_canceled',
        payload: {
          fanId: dbSubscription.fanId,
          tierId: dbSubscription.tierId,
        },
      },
    })
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  // Update payment status if it exists
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: { status: 'COMPLETED' },
  })

  // Also update tips
  await prisma.tip.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {}, // Just to trigger any hooks if needed
  })

  // Also update purchases  
  await prisma.purchase.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: {}, // Just to trigger any hooks if needed
  })
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  // Update payment status if it exists
  await prisma.payment.updateMany({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: { status: 'FAILED' },
  })
}

async function handleAccountUpdated(account: any) {
  // Update creator KYC status based on account verification
  const creator = await prisma.creator.findFirst({
    where: { stripeAccountId: account.id },
  })

  if (creator) {
    const kycStatus = account.details_submitted && account.charges_enabled
      ? 'VERIFIED'
      : account.requirements?.disabled_reason
      ? 'REJECTED'
      : 'PENDING'

    await prisma.creator.update({
      where: { id: creator.id },
      data: { kycStatus },
    })

    // Create KYC verification record
    await prisma.kycVerification.create({
      data: {
        creatorId: creator.id,
        status: kycStatus,
        provider: 'STRIPE_IDENTITY',
        referenceId: account.id,
      },
    })
  }
}

async function handlePayoutEvent(payout: any, eventType: string) {
  // Log payout events for audit trail
  const creator = await prisma.creator.findFirst({
    where: { stripeAccountId: payout.destination },
  })

  if (creator) {
    await prisma.auditLog.create({
      data: {
        actorUserId: creator.userId,
        action: `payout_${eventType.split('.')[1]}`, // payout_created, payout_paid, payout_failed
        target: `creator:${creator.id}`,
        metadata: {
          payoutId: payout.id,
          amount: payout.amount,
          currency: payout.currency,
          status: payout.status,
        },
      },
    })
  }
}