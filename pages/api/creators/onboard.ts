import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { withSentryApiHandler, reportError } from '@/lib/sentry'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!stripe) {
      return res.status(503).json({ 
        error: 'Creator onboarding unavailable',
        message: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.'
      })
    }

    const { creatorId, returnUrl } = req.body

    if (!creatorId) {
      return res.status(400).json({ error: 'Creator ID is required' })
    }

    // In production, get creator from database
    // For demo, use mock creator data
    if (creatorId !== 'creator_jess') {
      return res.status(404).json({ error: 'Creator not found' })
    }

    // Create Stripe Connect Express account for AU
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'AU', // Australia as specified
      email: 'jess@creatorhub.com',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      individual: {
        first_name: 'Jess',
        last_name: 'Williams',
        email: 'jess@creatorhub.com',
      },
      business_profile: {
        mcc: '7392', // Management, consulting, and public relations services
        product_description: 'Creator content and chat services',
        support_email: 'jess@creatorhub.com',
      },
    })

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/onboard/refresh`,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard`,
      type: 'account_onboarding',
    })

    // In production, save account ID to database
    console.log(`Created Stripe account ${account.id} for creator ${creatorId}`)

    res.status(200).json({
      success: true,
      accountId: account.id,
      onboardingUrl: accountLink.url,
      message: 'Stripe Connect account created successfully',
    })
  } catch (error) {
    reportError(error as Error, {
      endpoint: '/api/creators/onboard',
      method: req.method,
      body: req.body,
    })

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    res.status(500).json({
      error: 'Failed to create Stripe account',
      message: errorMessage,
    })
  }
}

export default withSentryApiHandler(handler)