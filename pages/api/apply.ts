import { NextApiRequest, NextApiResponse } from 'next'
import { withSentryApiHandler, reportError } from '@/lib/sentry'

interface ApplicationData {
  name: string
  email: string
  description: string
  socialMedia?: string
  experience: string
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, description, socialMedia, experience }: ApplicationData = req.body

    // Validate required fields
    if (!name || !email || !description || !experience) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, description, and experience are required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      })
    }

    // Validate experience level
    const validExperience = ['beginner', 'intermediate', 'advanced']
    if (!validExperience.includes(experience)) {
      return res.status(400).json({
        error: 'Invalid experience level',
        message: 'Experience must be beginner, intermediate, or advanced'
      })
    }

    // Create application record
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const application = {
      id: applicationId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      description: description.trim(),
      socialMedia: socialMedia?.trim() || null,
      experience,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      notes: null,
    }

    // In production, save to database
    console.log('New creator application:', application)

    // Log successful submission
    console.log(`Application ${applicationId} submitted successfully for ${email}`)

    res.status(201).json({
      success: true,
      applicationId,
      message: 'Application submitted successfully',
      nextSteps: 'You will receive an email confirmation shortly. Our team will review your application within 3-5 business days.',
    })
  } catch (error) {
    reportError(error as Error, {
      endpoint: '/api/apply',
      method: req.method,
      body: req.body,
    })

    console.error('Application submission error:', error)
    
    res.status(500).json({
      error: 'Application submission failed',
      message: 'An error occurred while processing your application. Please try again later.',
    })
  }
}

export default withSentryApiHandler(handler)