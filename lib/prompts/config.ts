/**
 * Prompt Configuration and Version Management
 * 
 * This file controls which prompt versions are active in production,
 * A/B test configurations, and feature flags.
 */

export const PROMPT_CONFIG = {
  // Active versions in production
  activeVersions: {
    story: 'v1.4.0',
    image: 'v1.8.0',
    cover: 'v1.8.0',
  },

  // A/B Testing (if enabled, will split traffic)
  abTests: {
    story: {
      enabled: false,
      testId: 'story-length-test-001',
      variants: [
        { name: 'control', version: 'v1.4.0', traffic: 50 },
        { name: 'treatment', version: 'v1.1.0', traffic: 50 },
      ],
    },
    image: {
      enabled: false,
      testId: null,
      variants: [],
    },
  },

  // Feature flags
  features: {
    // Enable advanced character consistency (uses more tokens)
    advancedCharacterConsistency: false,
    
    // Enable educational elements in stories
    educationalContent: true,
    
    // Enable strict safety filters
    strictSafetyFilters: true,
    
    // Enable reference photo analysis
    referencePhotoAnalysis: true,
    
    // Enable multi-language support
    multiLanguage: false,
  },

  // Safety settings
  safety: {
    // Content moderation level (1-5, 5 is strictest)
    moderationLevel: 5,
    
    // Auto-reject if confidence below threshold
    confidenceThreshold: 0.8,
    
    // Manual review required for certain themes
    manualReviewRequired: ['scary', 'fantasy-dark', 'adventure-intense'],
  },

  // Performance settings
  performance: {
    // Max tokens for story generation
    maxStoryTokens: 4000,
    
    // Max tokens for image prompt
    maxImagePromptTokens: 500,
    
    // Timeout for generation (ms)
    generationTimeout: 60000,
    
    // Retry attempts on failure
    retryAttempts: 2,
  },

  // [A9] Layout-safe master: karakter frame yüksekliğinin %min–%max’i (testte çok küçük kalırsa büyütmek için artır)
  masterLayout: {
    characterScaleMin: 25,
    characterScaleMax: 30,
  },

  // Cost optimization
  cost: {
    // Use cheaper models for drafts
    useCheaperForDrafts: false,
    
    // Batch image generation
    batchImageGeneration: true,
    
    // Cache character descriptions
    cacheCharacterDescriptions: true,
  },
} as const

export type PromptConfig = typeof PROMPT_CONFIG

