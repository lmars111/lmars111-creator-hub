import { NextApiRequest, NextApiResponse } from 'next'
import { withSentryApiHandler, reportError } from '../../../lib/sentry'
import { analytics } from '../../../lib/analytics'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { creatorId, userId, message } = req.body

    if (!creatorId) {
      return res.status(400).json({ error: 'creatorId is required' })
    }

    if (!message) {
      return res.status(400).json({ error: 'message is required' })
    }

    // Simulate chat initiation logic
    const chatSession = {
      id: `chat_${Date.now()}`,
      creatorId,
      userId,
      status: 'active',
      createdAt: new Date().toISOString(),
    }

    // Track analytics event
    analytics.startChat({
      creatorId,
      userId: userId || undefined,
    })

    res.status(200).json({
      success: true,
      chatSession,
      message: 'Chat started successfully',
    })
  } catch (error) {
    reportError(error as Error, {
      endpoint: '/api/chat/start',
      method: req.method,
      body: req.body,
    })

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to start chat',
    })
  }
}

export default withSentryApiHandler(handler)