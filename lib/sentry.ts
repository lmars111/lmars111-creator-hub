// Graceful error tracking for CreatorChat Hub
// Mock Sentry implementation for development purposes

interface SentryScope {
  setTag(key: string, value: string): void
  setContext(key: string, context: any): void
  setUser(user: any): void
}

class ErrorTracker {
  private initialized = false
  private disabled = false

  constructor() {
    this.init()
  }

  private init() {
    try {
      const dsn = process.env.SENTRY_DSN

      if (!dsn) {
        console.warn('Sentry DSN not found. Error tracking will be disabled.')
        this.disabled = true
        return
      }

      // In production, initialize Sentry here
      console.log('Error tracking initialized (mock mode)')
      this.initialized = true
    } catch (error) {
      console.warn('Failed to initialize error tracking:', error)
      this.disabled = true
    }
  }

  captureException(error: Error, scope?: any) {
    if (this.disabled || !this.initialized) {
      console.error('Error (tracking disabled):', error)
      return
    }

    // In production, this would send to Sentry
    console.error('Error captured:', error.message, error.stack)
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' | 'debug' = 'info') {
    if (this.disabled || !this.initialized) {
      console.log(`Message (tracking disabled) [${level}]:`, message)
      return
    }

    // In production, this would send to Sentry
    console.log(`Message captured [${level}]:`, message)
  }

  withScope(callback: (scope: any) => void) {
    if (this.disabled || !this.initialized) {
      return
    }

    const mockScope = {
      setTag: (key: string, value: string) => console.log(`Tag: ${key}=${value}`),
      setContext: (key: string, context: any) => console.log(`Context: ${key}=`, context),
      setUser: (user: any) => console.log('User:', user),
    }

    try {
      callback(mockScope)
    } catch (err) {
      console.error('Failed to execute with scope:', err)
    }
  }

  setUser(user: any) {
    if (this.disabled || !this.initialized) {
      return
    }
    console.log('User set:', user)
  }

  setTag(key: string, value: string) {
    if (this.disabled || !this.initialized) {
      return
    }
    console.log(`Tag: ${key}=${value}`)
  }

  setContext(key: string, context: any) {
    if (this.disabled || !this.initialized) {
      return
    }
    console.log(`Context: ${key}=`, context)
  }
}

// Create singleton instance
export const sentry = new ErrorTracker()

// API error handler wrapper
export const withSentryApiHandler = (handler: any) => {
  return async (req: any, res: any) => {
    try {
      return await handler(req, res)
    } catch (error) {
      // Capture API errors with context
      sentry.withScope((scope) => {
        scope.setTag('component', 'api')
        scope.setContext('request', {
          url: req.url,
          method: req.method,
          headers: req.headers,
          query: req.query,
        })
        sentry.captureException(error as Error)
      })

      // Re-throw the error to maintain normal error handling
      throw error
    }
  }
}

// Error boundary for React components
export const captureComponentError = (error: Error, errorInfo: any) => {
  sentry.withScope((scope) => {
    scope.setTag('component', 'react')
    scope.setContext('errorInfo', errorInfo)
    sentry.captureException(error)
  })
}

// Manual error reporting
export const reportError = (error: Error | string, context?: any) => {
  if (typeof error === 'string') {
    sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context)
      }
      sentry.captureMessage(error, 'error')
    })
  } else {
    sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional', context)
      }
      sentry.captureException(error)
    })
  }
}

export default sentry