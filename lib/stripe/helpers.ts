import { config } from '@/lib/config'

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

export interface CheckoutSessionOptions {
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export async function createSubscriptionCheckoutSession(
  creatorId: string,
  tierId: string,
  fanUserId: string,
  options: CheckoutSessionOptions
) {
  if (!stripe || !prisma) {
    throw new Error('Stripe or Prisma not available')
  }

  // Get subscription tier
  const tier = await prisma.subscriptionTier.findUnique({
    where: { id: tierId },
    include: { creator: true },
  })

  if (!tier) {
    throw new Error('Subscription tier not found')
  }

  if (tier.creatorId !== creatorId) {
    throw new Error('Tier does not belong to creator')
  }

  if (!tier.creator.stripeAccountId) {
    throw new Error('Creator has not completed Stripe onboarding')
  }

  // Get or create Stripe customer
  const customer = await getOrCreateStripeCustomer(fanUserId)

  // Calculate application fee (30% platform fee)
  const applicationFeeAmount = Math.round(tier.priceCents * 0.3)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tier.creator.displayName} - ${tier.name}`,
            description: tier.benefits.join(', '),
          },
          unit_amount: tier.priceCents,
          recurring: {
            interval: tier.interval as 'month' | 'year',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    customer: customer.id,
    subscription_data: {
      application_fee_percent: 30, // 30% platform fee
      transfer_data: {
        destination: tier.creator.stripeAccountId,
      },
      metadata: {
        creatorId,
        tierId,
        fanId: fanUserId,
        type: 'subscription',
        ...options.metadata,
      },
    },
    metadata: {
      creatorId,
      tierId,
      fanId: fanUserId,
      type: 'subscription',
      ...options.metadata,
    },
  })

  return session
}

export async function createTipCheckoutSession(
  creatorId: string,
  fanUserId: string,
  amountCents: number,
  options: CheckoutSessionOptions
) {
  if (!stripe || !prisma) {
    throw new Error('Stripe or Prisma not available')
  }

  // Get creator
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
  })

  if (!creator) {
    throw new Error('Creator not found')
  }

  if (!creator.stripeAccountId) {
    throw new Error('Creator has not completed Stripe onboarding')
  }

  // Get or create Stripe customer
  const customer = await getOrCreateStripeCustomer(fanUserId)

  // Calculate application fee (30% platform fee)
  const applicationFeeAmount = Math.round(amountCents * 0.3)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Tip for ${creator.displayName}`,
            description: 'Show your support with a tip!',
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    customer: customer.id,
    payment_intent_data: {
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: creator.stripeAccountId,
      },
      metadata: {
        creatorId,
        fanId: fanUserId,
        amountCents: amountCents.toString(),
        type: 'tip',
        ...options.metadata,
      },
    },
    metadata: {
      creatorId,
      fanId: fanUserId,
      amountCents: amountCents.toString(),
      type: 'tip',
      ...options.metadata,
    },
  })

  return session
}

export async function createPPVCheckoutSession(
  contentId: string,
  fanUserId: string,
  options: CheckoutSessionOptions
) {
  if (!stripe || !prisma) {
    throw new Error('Stripe or Prisma not available')
  }

  // Get content
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: { creator: true },
  })

  if (!content) {
    throw new Error('Content not found')
  }

  if (content.visibility !== 'PPV' || !content.priceCents) {
    throw new Error('Content is not pay-per-view')
  }

  if (!content.creator.stripeAccountId) {
    throw new Error('Creator has not completed Stripe onboarding')
  }

  // Check if user already purchased this content
  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      fanId: fanUserId,
      contentId,
    },
  })

  if (existingPurchase) {
    throw new Error('Content already purchased')
  }

  // Get or create Stripe customer
  const customer = await getOrCreateStripeCustomer(fanUserId)

  // Calculate application fee (30% platform fee)
  const applicationFeeAmount = Math.round(content.priceCents * 0.3)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: content.title,
            description: content.description || 'Exclusive content',
          },
          unit_amount: content.priceCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    customer: customer.id,
    payment_intent_data: {
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: content.creator.stripeAccountId,
      },
      metadata: {
        creatorId: content.creatorId,
        fanId: fanUserId,
        contentId,
        amountCents: content.priceCents.toString(),
        type: 'content_purchase',
        ...options.metadata,
      },
    },
    metadata: {
      creatorId: content.creatorId,
      fanId: fanUserId,
      contentId,
      amountCents: content.priceCents.toString(),
      type: 'content_purchase',
      ...options.metadata,
    },
  })

  return session
}

export async function getOrCreateStripeCustomer(userId: string) {
  if (!stripe || !prisma) {
    throw new Error('Stripe or Prisma not available')
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Check if user already has a Stripe customer ID stored
  // This would typically be in a user field, but for MVP we'll create each time
  // In production, you'd want to store customer IDs in the database

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: {
      userId: user.id,
    },
  })

  return customer
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  if (!stripe) {
    throw new Error('Stripe not available')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not available')
  }

  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  if (!stripe) {
    throw new Error('Stripe not available')
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
  })

  return updatedSubscription
}

export function calculateFees(amountCents: number) {
  const platformFeePercentage = 0.3 // 30%
  const stripeFeeFixed = 30 // $0.30
  const stripeFeePercentage = 0.029 // 2.9%

  const stripeFee = Math.round(amountCents * stripeFeePercentage + stripeFeeFixed)
  const platformFee = Math.round(amountCents * platformFeePercentage)
  const creatorEarnings = amountCents - platformFee - stripeFee

  return {
    amountCents,
    stripeFee,
    platformFee,
    creatorEarnings,
    platformFeePercentage,
  }
}