import Stripe from 'stripe'

// Gracefully handle missing Stripe configuration
let stripe: Stripe | null = null

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  } else {
    console.warn('STRIPE_SECRET_KEY not set. Stripe functionality will be disabled.')
  }
} catch (error) {
  console.warn('Failed to initialize Stripe:', error)
}

export { stripe }

// Platform fee percentage (20%)
export const PLATFORM_FEE_PERCENTAGE = 0.20

export function calculateFees(amount: number) {
  const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE)
  const creatorEarnings = amount - platformFee
  
  return {
    amount,
    platformFee,
    creatorEarnings,
  }
}

export async function createCheckoutSession({
  creatorId,
  contentId,
  amount,
  metadata = {},
}: {
  creatorId: string
  contentId: string  
  amount: number
  metadata?: Record<string, string>
}) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }

  const fees = calculateFees(amount)
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Unlock Creator Content',
            description: 'Access exclusive creator content',
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/${creatorId}/chat?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/${creatorId}/chat?canceled=true`,
    metadata: {
      creatorId,
      contentId,
      platformFee: fees.platformFee.toString(),
      creatorEarnings: fees.creatorEarnings.toString(),
      ...metadata,
    },
  })

  return session
}