/**
 * Type definitions for prompt system
 */

// ============================================================================
// Version Management
// ============================================================================

export interface PromptVersion {
  version: string // Semantic versioning (e.g., "1.0.0")
  releaseDate: Date
  status: 'active' | 'deprecated' | 'experimental'
  changelog: string[]
  author: string
  migrationNotes?: string
}

// ============================================================================
// Story Generation
// ============================================================================

export interface StoryGenerationInput {
  characterName: string
  characterAge: number
  characterGender: 'boy' | 'girl' | 'other'
  theme: string
  illustrationStyle: string
  customRequests?: string
  referencePhotoAnalysis?: CharacterAnalysis // Optional: kept for backward compatibility, but not required
  language?: 'en' | 'tr' | 'de' | 'fr' | 'es' | 'zh' | 'pt' | 'ru'
  pageCount?: number // Debug: Optional page count override (3-20)
  // Step 1 data (preferred, no AI Analysis needed)
  hairColor?: string
  eyeColor?: string
  specialFeatures?: string[]
  // NEW: Multiple characters support
  characters?: Array<{
    id: string
    name: string // Ana karakter için Step 1'den, diğerleri için tip adı
    type: {
      group: string
      value: string
      displayName: string
    }
    characterId?: string // API'den gelen karakter ID'si
  }>
}

export interface StoryGenerationOutput {
  title: string
  pages: StoryPage[]
  totalPages: number
  metadata: {
    ageGroup: string
    readingTime: number
    educationalThemes: string[]
    safetyChecked: boolean
  }
}

export interface StoryPage {
  pageNumber: number
  text: string
  imagePrompt: string
  sceneDescription: string
  characterIds: string[] // NEW: Which character(s) appear on this page (character IDs) - REQUIRED
  /** Story-driven clothing per page (e.g. astronaut suit, swimwear). Plan: Kapak/Close-up/Kıyafet. */
  clothing?: string
}

export interface AgeGroupRules {
  minAge: number
  maxAge: number
  complexity: 'very-simple' | 'simple' | 'moderate' | 'advanced'
  vocabulary: 'basic' | 'intermediate' | 'advanced'
  sentenceLength: 'short' | 'medium' | 'long'
  themes: string[]
  avoidThemes: string[]
  educationalFocus: string[]
}

export interface ThemeConfig {
  name: string
  category: 'adventure' | 'fantasy' | 'educational' | 'daily-life' | 'animals'
  mood: 'exciting' | 'calm' | 'funny' | 'mysterious' | 'inspiring'
  setting: string
  commonElements: string[]
  avoidElements: string[]
  colorPalette: string[]
}

export interface SafetyRules {
  mustInclude: string[]
  mustAvoid: string[]
  contentFlags: string[]
  parentalGuidance: boolean
}

// ============================================================================
// Image Generation
// ============================================================================

export interface ImageGenerationInput {
  prompt: string
  characterDescription: string
  sceneDescription: string
  illustrationStyle: string
  referencePhotoUrl?: string
  pageNumber: number
  previousImages?: string[] // For consistency
}

export interface ImageGenerationOutput {
  imageUrl: string
  revisedPrompt: string
  metadata: {
    model: string
    size: string
    quality: string
    safetyChecked: boolean
  }
}

export interface CharacterDescription {
  // Physical features
  age: number
  gender: string
  skinTone: string
  hairColor: string
  hairStyle: string
  hairLength: string
  eyeColor: string
  eyeShape: string
  faceShape: string
  height: string
  build: string
  
  // Clothing (typical)
  clothingStyle: string
  clothingColors: string[]
  
  // Unique features
  uniqueFeatures: string[]
  
  // Expression and personality
  typicalExpression: string
  personalityTraits: string[]
}

export interface CharacterAnalysis {
  // From reference photo analysis
  detectedFeatures: {
    age: number
    gender: string
    skinTone: string
    hairColor: string
    hairStyle: string
    eyeColor: string
    faceShape: string
  }
  // Combined with user input
  finalDescription: CharacterDescription
  confidence: number
}

export interface StyleConfig {
  name: string
  basePrompt: string
  artisticStyle: string
  medium: string // watercolor, digital, oil painting, etc.
  lighting: string
  colorScheme: string
  detailLevel: 'low' | 'medium' | 'high'
  mood: string
}

export interface NegativePrompt {
  general: string[]
  ageSpecific: {
    [key: string]: string[]
  }
  styleSpecific: {
    [key: string]: string[]
  }
}

// ============================================================================
// Feedback and Learning
// ============================================================================

export interface PromptFeedback {
  id: string
  bookId: string
  userId: string
  promptType: 'story' | 'image' | 'cover'
  promptVersion: string
  feedbackType: 'content' | 'quality' | 'consistency' | 'safety' | 'other'
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
  specific: {
    tooScary?: boolean
    inappropriate?: boolean
    inconsistent?: boolean
    tooSimple?: boolean
    tooComplex?: boolean
    perfect?: boolean
  }
  actionTaken?: string
  createdAt: Date
}

export interface PromptPerformance {
  version: string
  totalGenerations: number
  successRate: number
  averageRating: number
  averageTokens: number
  averageCost: number
  averageTime: number
  feedbackCount: number
  issueCount: number
  lastUpdated: Date
}

// ============================================================================
// A/B Testing
// ============================================================================

export interface ABTest {
  testId: string
  name: string
  description: string
  promptType: 'story' | 'image' | 'cover'
  startDate: Date
  endDate: Date
  status: 'draft' | 'active' | 'completed' | 'paused'
  variants: ABTestVariant[]
  successMetric: string
  results?: ABTestResults
}

export interface ABTestVariant {
  name: string
  version: string
  trafficPercentage: number
  description: string
}

export interface ABTestResults {
  winner?: string
  statistics: {
    [variantName: string]: {
      sampleSize: number
      successRate: number
      averageRating: number
      averageCost: number
      confidence: number
    }
  }
  conclusion: string
  nextSteps: string
}

// ============================================================================
// Template System
// ============================================================================

export interface PromptTemplate {
  version: PromptVersion
  type: 'story' | 'image' | 'cover'
  baseTemplate: string
  variables: TemplateVariable[]
  rules: TemplateRule[]
  examples: TemplateExample[]
}

export interface TemplateVariable {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum'
  required: boolean
  default?: any
  description: string
  validation?: string
}

export interface TemplateRule {
  condition: string
  action: string
  priority: number
}

export interface TemplateExample {
  input: any
  output: string
  description: string
  rating?: number
}

