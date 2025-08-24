import posthog from 'posthog-js'

interface AnalyticsEventData {
  [key: string]: any
}

interface ViewCreatorData extends AnalyticsEventData {
  creatorId: string
  creatorName?: string
}

interface StartChatData extends AnalyticsEventData {
  creatorId: string
  userId?: string
}

interface UnlockAttemptData extends AnalyticsEventData {
  contentId: string
  userId?: string
  method: string
}

interface UnlockSuccessData extends AnalyticsEventData {
  contentId: string
  userId?: string
  method: string
}

interface StripeWebhookData extends AnalyticsEventData {
  webhookType: string
  eventId?: string
  customerId?: string
}

class Analytics {
  private initialized = false
  private disabled = false

  constructor() {
    this.init()
  }

  private init() {
    try {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

      if (!posthogKey) {
        console.warn('PostHog key not found. Analytics will be disabled.')
        this.disabled = true
        return
      }

      if (typeof window !== 'undefined') {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          // Disable automatic pageview capture since we'll handle it manually
          capture_pageview: false,
          // Enable debug mode in development
          debug: process.env.NODE_ENV === 'development',
        })
        this.initialized = true
      }
    } catch (error) {
      console.warn('Failed to initialize PostHog analytics:', error)
      this.disabled = true
    }
  }

  private track(eventName: string, properties: AnalyticsEventData = {}) {
    if (this.disabled || !this.initialized) {
      return
    }

    try {
      posthog.capture(eventName, properties)
    } catch (error) {
      console.warn(`Failed to track event ${eventName}:`, error)
    }
  }

  /**
   * Track when a user views a creator's profile or content
   */
  viewCreator(data: ViewCreatorData) {
    this.track('ViewCreator', data)
  }

  /**
   * Track when a user starts a chat with a creator
   */
  startChat(data: StartChatData) {
    this.track('StartChat', data)
  }

  /**
   * Track when a user attempts to unlock content
   */
  unlockAttempt(data: UnlockAttemptData) {
    this.track('UnlockAttempt', data)
  }

  /**
   * Track when a user successfully unlocks content
   */
  unlockSuccess(data: UnlockSuccessData) {
    this.track('UnlockSuccess', data)
  }

  /**
   * Track successful Stripe webhook processing
   */
  stripeWebhookSuccess(data: StripeWebhookData) {
    this.track('StripeWebhookOK', data)
  }

  /**
   * Track failed Stripe webhook processing
   */
  stripeWebhookFail(data: StripeWebhookData & { error?: string }) {
    this.track('StripeWebhookFail', data)
  }

  /**
   * Identify a user for tracking
   */
  identify(userId: string, properties?: AnalyticsEventData) {
    if (this.disabled || !this.initialized) {
      return
    }

    try {
      posthog.identify(userId, properties)
    } catch (error) {
      console.warn('Failed to identify user:', error)
    }
  }

  /**
   * Reset user identification (e.g., on logout)
   */
  reset() {
    if (this.disabled || !this.initialized) {
      return
    }

    try {
      posthog.reset()
    } catch (error) {
      console.warn('Failed to reset analytics:', error)
    }
  }

  /**
   * Track page views manually
   */
  pageView() {
    if (this.disabled || !this.initialized) {
      return
    }

    try {
      posthog.capture('$pageview')
    } catch (error) {
      console.warn('Failed to track page view:', error)
    }
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Export types for consumers
export type {
  ViewCreatorData,
  StartChatData,
  UnlockAttemptData,
  UnlockSuccessData,
  StripeWebhookData,
  AnalyticsEventData,
}