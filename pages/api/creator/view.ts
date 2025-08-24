import { NextApiRequest, NextApiResponse } from 'next'
import { withSentryApiHandler, reportError } from '../../../lib/sentry'
import { analytics } from '../../../lib/analytics'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { creatorId, userId } = req.body

    if (!creatorId) {
      return res.status(400).json({ error: 'creatorId is required' })
    }

    // Simulate creator profile view logic
    const creator = {
      id: creatorId,
      name: `Creator ${creatorId}`,
      verified: true,
    }

    // Track analytics event
    analytics.viewCreator({
      creatorId,
      creatorName: creator.name,
      userId: userId || undefined,
    })

    res.status(200).json({
      success: true,
      creator,
      message: 'Creator view tracked successfully',
    })
  } catch (error) {
    reportError(error as Error, {
      endpoint: '/api/creator/view',
      method: req.method,
      body: req.body,
    })

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process creator view',
    })
  }
}

export default withSentryApiHandler(handler)