// Mock Sentry implementation for graceful fallback
interface SentryScope {
  setTag(key: string, value: string): void
  setContext(key: string, context: any): void
  setUser(user: any): void
}

interface SentryEvent {
  message?: string
  level?: 'error' | 'warning' | 'info' | 'debug'
  tags?: Record<string, string>
  extra?: Record<string, any>
  user?: any
}

class MockSentry {
  private initialized = false
  private disabled = false

  init(config: { dsn: string; [key: string]: any }) {
    try {
      if (!config.dsn) {
        console.warn('Sentry DSN not found. Error tracking will be disabled.')
        this.disabled = true
        return
      }
      
      // In a real implementation, this would initialize the actual Sentry SDK
      console.log('Sentry initialized with DSN:', config.dsn.substring(0, 20) + '...')
      this.initialized = true
    } catch (error) {
      console.warn('Failed to initialize Sentry:', error)
      this.disabled = true
    }
  }

  captureException(error: Error, scope?: any) {
    if (this.disabled || !this.initialized) {
      console.error('Error (Sentry disabled):', error)
      return
    }

    // In a real implementation, this would send to Sentry
    console.error('Sentry: Captured exception:', error.message, {
      stack: error.stack,
      scope
    })
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' | 'debug' = 'info') {
    if (this.disabled || !this.initialized) {
      console.log(`Message (Sentry disabled) [${level}]:`, message)
      return
    }

    // In a real implementation, this would send to Sentry
    console.log(`Sentry: Captured message [${level}]:`, message)
  }

  withScope(callback: (scope: SentryScope) => void) {
    if (this.disabled || !this.initialized) {
      return
    }

    const mockScope: SentryScope = {
      setTag: (key: string, value: string) => {
        console.log(`Sentry scope tag: ${key}=${value}`)
      },
      setContext: (key: string, context: any) => {
        console.log(`Sentry scope context: ${key}=`, context)
      },
      setUser: (user: any) => {
        console.log('Sentry scope user:', user)
      }
    }

    callback(mockScope)
  }

  setUser(user: any) {
    if (this.disabled || !this.initialized) {
      return
    }
    console.log('Sentry: Set user:', user)
  }

  setTag(key: string, value: string) {
    if (this.disabled || !this.initialized) {
      return
    }
    console.log(`Sentry: Set tag ${key}=${value}`)
  }

  setContext(key: string, context: any) {
    if (this.disabled || !this.initialized) {
      return
    }
    console.log(`Sentry: Set context ${key}=`, context)
  }
}

// Create a singleton instance
const sentry = new MockSentry()

// Initialize Sentry with environment configuration
const initSentry = () => {
  const dsn = process.env.SENTRY_DSN

  sentry.init({
    dsn: dsn || '',
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.NODE_ENV === 'development',
    // Add any other Sentry configuration options
  })
}

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

// Initialize on import
if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'test') {
  initSentry()
}

export { sentry }
export default sentry