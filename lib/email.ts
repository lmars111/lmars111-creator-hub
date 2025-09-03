import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = 'CreatorChat Hub <noreply@creatorhub.com>',
}: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured, email not sent')
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const emailData: any = {
      from,
      to,
      subject,
    }

    if (html) {
      emailData.html = html
    }
    if (text) {
      emailData.text = text
    }

    const result = await resend.emails.send(emailData)

    return { success: true, data: result }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">Welcome to CreatorChat Hub!</h1>
      <p>Hi ${userName},</p>
      <p>Welcome to CreatorChat Hub - the platform where you can connect with your favorite creators through personalized chat experiences.</p>
      
      <h2>Get Started:</h2>
      <ul>
        <li>Browse and discover amazing creators</li>
        <li>Start conversations with AI-powered chat</li>
        <li>Unlock exclusive content and experiences</li>
        <li>Build meaningful connections</li>
      </ul>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/discover" 
           style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Start Exploring
        </a>
      </p>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br>The CreatorChat Hub Team</p>
    </div>
  `

  return await sendEmail({
    to: userEmail,
    subject: 'Welcome to CreatorChat Hub! 🎉',
    html,
  })
}

export async function sendCreatorWelcomeEmail(userEmail: string, userName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">Welcome to CreatorChat Hub Creator Program!</h1>
      <p>Hi ${userName},</p>
      <p>Congratulations! You've successfully joined CreatorChat Hub as a creator. You're now part of a community that's redefining creator-fan interactions.</p>
      
      <h2>Next Steps:</h2>
      <ol>
        <li>Complete your creator onboarding</li>
        <li>Set up your Stripe Connect account for payments</li>
        <li>Customize your AI chat personality</li>
        <li>Create your first content</li>
        <li>Start engaging with your fans</li>
      </ol>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard" 
           style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Go to Creator Dashboard
        </a>
      </p>
      
      <p>Our support team is here to help you succeed. Don't hesitate to reach out if you need assistance.</p>
      <p>Best regards,<br>The CreatorChat Hub Team</p>
    </div>
  `

  return await sendEmail({
    to: userEmail,
    subject: 'Welcome to the Creator Program! 🚀',
    html,
  })
}

export async function sendOnboardingReminderEmail(userEmail: string, userName: string, step: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">Complete Your Creator Setup</h1>
      <p>Hi ${userName},</p>
      <p>We noticed you haven't finished setting up your creator profile yet. You're currently on step: <strong>${step}</strong>.</p>
      
      <p>Completing your setup will allow you to:</p>
      <ul>
        <li>Start earning from your content</li>
        <li>Connect with fans through AI-powered chat</li>
        <li>Build your community on CreatorChat Hub</li>
      </ul>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding/creator" 
           style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Continue Setup
        </a>
      </p>
      
      <p>Questions? We're here to help!</p>
      <p>Best regards,<br>The CreatorChat Hub Team</p>
    </div>
  `

  return await sendEmail({
    to: userEmail,
    subject: 'Complete your creator setup - You\'re almost there!',
    html,
  })
}

export async function sendPaymentConfirmationEmail(
  userEmail: string, 
  userName: string, 
  amount: number, 
  creatorName: string,
  contentType: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7c3aed;">Payment Confirmation</h1>
      <p>Hi ${userName},</p>
      <p>Thank you for your purchase! Your payment has been processed successfully.</p>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Purchase Details:</h3>
        <p><strong>Creator:</strong> ${creatorName}</p>
        <p><strong>Content Type:</strong> ${contentType}</p>
        <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      
      <p>You can now access your purchased content and continue your conversation.</p>
      
      <p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/fan/purchases" 
           style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Purchase History
        </a>
      </p>
      
      <p>Thank you for supporting creators on CreatorChat Hub!</p>
      <p>Best regards,<br>The CreatorChat Hub Team</p>
    </div>
  `

  return await sendEmail({
    to: userEmail,
    subject: `Payment Confirmation - $${amount.toFixed(2)} to ${creatorName}`,
    html,
  })
}