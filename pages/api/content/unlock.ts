import { NextApiRequest, NextApiResponse } from 'next'
import { withSentryApiHandler, reportError } from '../../../lib/sentry'
import { analytics } from '../../../lib/analytics'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { contentId, userId, method = 'payment' } = req.body

    if (!contentId) {
      return res.status(400).json({ error: 'contentId is required' })
    }

    // Track unlock attempt
    analytics.unlockAttempt({
      contentId,
      userId: userId || undefined,
      method,
    })

    // Simulate content unlock logic
    const unlockSuccess = Math.random() > 0.3 // 70% success rate for demo

    if (unlockSuccess) {
      // Track successful unlock
      analytics.unlockSuccess({
        contentId,
        userId: userId || undefined,
        method,
      })

      res.status(200).json({
        success: true,
        contentId,
        message: 'Content unlocked successfully',
        unlockedAt: new Date().toISOString(),
      })
    } else {
      // Simulate payment failure
      throw new Error('Payment processing failed')
    }
  } catch (error) {
    reportError(error as Error, {
      endpoint: '/api/content/unlock',
      method: req.method,
      body: req.body,
    })

    res.status(400).json({
      error: 'Unlock failed',
      message: 'Failed to unlock content',
    })
  }
}

export default withSentryApiHandler(handler)