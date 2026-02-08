/**
 * Application Configuration
 * Environment-based configuration for development and production
 */

import logger from "./logger"

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// App Configuration
export const appConfig = {
  // Environment
  env: {
    isDevelopment,
    isProduction,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // App URLs
  urls: {
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
    apiUrl: process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api`
      : 'http://localhost:3001/api',
  },

  // Supabase (legacy / optional - app uses PostgreSQL + NextAuth + S3)
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // AI Providers
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      enabled: !!process.env.OPENAI_API_KEY,
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY || '',
      enabled: !!process.env.GROQ_API_KEY,
    },
    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY || '',
      enabled: !!process.env.GOOGLE_AI_API_KEY,
    },
  },

  // Payment Providers
  payments: {
    stripe: {
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      enabled: !!process.env.STRIPE_SECRET_KEY,
    },
    iyzico: {
      apiKey: process.env.IYZICO_API_KEY || '',
      secretKey: process.env.IYZICO_SECRET_KEY || '',
      enabled: !!process.env.IYZICO_API_KEY && !!process.env.IYZICO_SECRET_KEY,
    },
  },

  // Feature Flags
  features: {
    // Development-only / debug features (see docs/strategies/DEBUG_AND_FEATURE_FLAGS_ANALYSIS.md)
    dev: {
      testSupabasePage: isDevelopment,
      debugMode: isDevelopment,
      verboseLogging: isDevelopment,
      /** Server: allow skipping payment for create book (DEBUG_SKIP_PAYMENT or admin+flag in API). Do not set in production. */
      skipPaymentForCreateBook: isDevelopment || process.env.DEBUG_SKIP_PAYMENT === 'true',
      /** Server: allow showing admin dashboard. Do not set in production except for admins. */
      showAdminDashboard: isDevelopment || process.env.SHOW_ADMIN_DASHBOARD === 'true',
      /** Server: show debug quality buttons (Step 6) for admins to test story/masters/cover/page individually. */
      showDebugQualityButtons: isDevelopment || process.env.SHOW_DEBUG_QUALITY_BUTTONS === 'true',
    },
    // Production features
    production: {
      analytics: isProduction,
      errorTracking: isProduction,
      performanceMonitoring: isProduction,
    },
  },
} as const

// Validation
export function validateConfig() {
  const errors: string[] = []

  // Required in production (Supabase no longer required - using PostgreSQL + NextAuth + S3)
  if (isProduction) {
    if (appConfig.urls.appUrl === 'http://localhost:3001') {
      errors.push('NEXT_PUBLIC_APP_URL must be set to production URL')
    }
  }

  if (errors.length > 0) {
    logger.error('❌ Configuration errors:')
    errors.forEach((error) => logger.error(`  - ${error}`))
    // Log only in production; do not throw so `next build` can complete without NEXT_PUBLIC_APP_URL
    if (isProduction) {
      logger.warn('Fix the above config before production deploy. Build continues.')
    }
  }

  return errors.length === 0
}

// Validate on module load in production (log errors only; no throw so build succeeds)
if (isProduction) {
  validateConfig()
}

export default appConfig

