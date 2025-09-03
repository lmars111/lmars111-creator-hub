/**
 * Centralized configuration with runtime assertions for required environment variables
 */

// Required environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
} as const

// Optional environment variables with defaults
export const config = {
  // Database
  database: {
    url: requiredEnvVars.DATABASE_URL!,
  },

  // NextAuth
  auth: {
    url: requiredEnvVars.NEXTAUTH_URL!,
    secret: requiredEnvVars.NEXTAUTH_SECRET!,
  },

  // Email (optional)
  email: {
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT ? Number(process.env.EMAIL_SERVER_PORT) : undefined,
      user: process.env.EMAIL_SERVER_USER,
      password: process.env.EMAIL_SERVER_PASSWORD,
    },
    from: process.env.EMAIL_FROM,
    enabled: !!(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_FROM),
  },

  // Google OAuth (optional)
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    connectClientId: process.env.STRIPE_CONNECT_CLIENT_ID,
    enabled: !!process.env.STRIPE_SECRET_KEY,
  },

  // AWS S3
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    enabled: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET),
  },

  // AI Providers
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      enabled: !!process.env.OPENAI_API_KEY,
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      enabled: !!process.env.ANTHROPIC_API_KEY,
    },
  },

  // Vector Store (optional)
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    enabled: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
  },

  // Rate Limiting (optional)
  upstash: {
    redisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
    redisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    enabled: !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
  },

  // Analytics (optional)
  posthog: {
    apiKey: process.env.POSTHOG_API_KEY,
    enabled: !!process.env.POSTHOG_API_KEY,
  },

  // Error Tracking (optional)
  sentry: {
    dsn: process.env.SENTRY_DSN,
    enabled: !!process.env.SENTRY_DSN,
  },

  // App Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
} as const

// Runtime assertions for required variables
export function validateConfig() {
  const missing: string[] = []
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    )
  }
}

// Feature flags based on available environment variables
export const features = {
  email: config.email.enabled,
  googleAuth: config.google.enabled,
  stripe: config.stripe.enabled,
  s3Upload: config.s3.enabled,
  openaiChat: config.ai.openai.enabled,
  anthropicChat: config.ai.anthropic.enabled,
  vectorMemory: config.supabase.enabled,
  rateLimit: config.upstash.enabled,
  analytics: config.posthog.enabled,
  errorTracking: config.sentry.enabled,
} as const

// Helper to check if a feature is enabled
export function isFeatureEnabled(feature: keyof typeof features): boolean {
  return features[feature]
}

// Export individual configs for convenience
export const { database, auth, email, google, stripe, s3, ai, supabase, upstash, posthog, sentry, app } = config