import type { PromptVersion } from '../../types'

/**
 * Negative Prompts - Version 1.0.0
 * 
 * What to AVOID in image generation
 * Critical for child safety and quality
 */

export const VERSION: PromptVersion = {
  version: '1.0.0',
  releaseDate: new Date('2026-01-10'),
  status: 'active',
  changelog: [
    'Initial release',
    'Safety-focused negative prompts',
    'Age-specific restrictions',
    'Quality control filters',
  ],
  author: '@prompt-manager',
}

// ============================================================================
// Universal Negative Prompts (ALL AGES)
// ============================================================================

export const UNIVERSAL_NEGATIVE = [
  // Safety - Violence and Danger
  'violence', 'fighting', 'weapons', 'guns', 'swords', 'blood',
  'injury', 'wounds', 'pain', 'crying in pain',
  
  // Safety - Scary Content
  'scary', 'frightening', 'terrifying', 'nightmare',
  'monsters', 'ghosts', 'zombies', 'demons',
  'dark shadows', 'horror', 'creepy',
  
  // Safety - Inappropriate
  'inappropriate', 'adult content', 'suggestive',
  
  // Safety - Negative Emotions
  'sad', 'crying', 'distressed', 'scared expression',
  'angry', 'mean', 'bullying',
  
  // Safety - Dangerous Situations
  'fire', 'falling', 'drowning', 'danger',
  'accident', 'emergency',
  
  // Quality - Technical Issues
  'blurry', 'low quality', 'pixelated', 'distorted',
  'deformed', 'disfigured', 'mutated',
  'extra limbs', 'missing limbs', 'bad anatomy',
  'bad proportions', 'poorly drawn',
  
  // Quality - Style Issues
  'ugly', 'grotesque', 'weird', 'strange',
  'amateur', 'sketch', 'unfinished',
  
  // Consistency Issues
  'multiple characters of same person',
  'inconsistent character',
  'different character',
  
  // Unwanted Elements
  'text', 'watermark', 'signature', 'logo',
  'frame', 'border',
  
  // Inappropriate Themes
  'death', 'dying', 'dead animals',
  'smoking', 'alcohol', 'drugs',
  
  // Negative Stereotypes
  'stereotypes', 'caricature', 'mockery',
]

// ============================================================================
// Age-Specific Negative Prompts
// ============================================================================

export const AGE_SPECIFIC_NEGATIVE: Record<string, string[]> = {
  toddler: [
    ...UNIVERSAL_NEGATIVE,
    'complex', 'complicated', 'confusing',
    'too many details', 'cluttered',
    'dark colors', 'muted colors',
    'shadows', 'darkness',
    'any animal showing teeth',
    'loud', 'chaotic',
  ],
  
  preschool: [
    ...UNIVERSAL_NEGATIVE,
    'overly complex', 'too detailed',
    'dark themes', 'somber mood',
    'scary animals', 'predators',
  ],
  
  'early-elementary': [
    ...UNIVERSAL_NEGATIVE,
    'overly mature', 'adult themes',
    'intense', 'too dramatic',
  ],
  
  elementary: [
    ...UNIVERSAL_NEGATIVE,
    'too mature', 'inappropriate for children',
  ],
  
  'pre-teen': [
    ...UNIVERSAL_NEGATIVE,
    'childish', 'too simple',
  ],
}

// ============================================================================
// Style-Specific Negative Prompts
// ============================================================================

export const STYLE_NEGATIVE: Record<string, string[]> = {
  watercolor: [
    'harsh lines', 'digital looking', 'plastic',
    'overly saturated', 'neon colors',
  ],
  
  digital: [
    'overly realistic', 'photographic',
    'artificial', 'computer generated look',
  ],
  
  cartoon: [
    'realistic', 'photorealistic',
    'serious', 'formal',
  ],
  
  'hand-drawn': [
    'digital', 'computer generated',
    'perfect lines', 'too clean',
  ],
}

// ============================================================================
// Theme-Specific Negative Prompts
// ============================================================================

export const THEME_NEGATIVE: Record<string, string[]> = {
  adventure: [
    'dangerous', 'extreme', 'risky',
    'cliffs', 'high places', 'deep water',
  ],
  
  fantasy: [
    'dark fantasy', 'gothic', 'evil',
    'scary creatures', 'dark magic',
  ],
  
  animals: [
    'predators hunting', 'animals fighting',
    'wild animals attacking', 'dangerous animals',
  ],
  
  'daily-life': [
    'boring', 'mundane', 'dull',
    'conflict', 'problems', 'stress',
  ],
  
  space: [
    'aliens attacking', 'space danger',
    'scary alien', 'dark space',
  ],
  
  underwater: [
    'sharks', 'dangerous fish', 'deep dark water',
    'drowning', 'underwater danger',
  ],
}

// ============================================================================
// Character-Specific Negative Prompts
// ============================================================================

export const CHARACTER_NEGATIVE = [
  // Avoid character inconsistency
  'different character', 'another child',
  'multiple versions of same character',
  'inconsistent appearance',
  
  // Avoid bad character rendering
  'distorted face', 'weird face', 'ugly face',
  'bad eyes', 'asymmetric eyes', 'crossed eyes',
  'bad hands', 'extra fingers', 'missing fingers',
  'deformed body', 'wrong proportions',
  
  // Avoid inappropriate character elements
  'revealing clothing', 'inappropriate outfit',
  'adult clothing on child',
]

// ============================================================================
// Helper Functions
// ============================================================================

export function getNegativePrompt(
  ageGroup: string,
  illustrationStyle: string,
  theme: string
): string {
  const negatives: string[] = []
  
  // Add universal negatives
  negatives.push(...UNIVERSAL_NEGATIVE)
  
  // Add age-specific negatives
  if (AGE_SPECIFIC_NEGATIVE[ageGroup]) {
    negatives.push(...AGE_SPECIFIC_NEGATIVE[ageGroup])
  }
  
  // Add style-specific negatives
  if (STYLE_NEGATIVE[illustrationStyle]) {
    negatives.push(...STYLE_NEGATIVE[illustrationStyle])
  }
  
  // Add theme-specific negatives
  if (THEME_NEGATIVE[theme]) {
    negatives.push(...THEME_NEGATIVE[theme])
  }
  
  // Add character negatives
  negatives.push(...CHARACTER_NEGATIVE)
  
  // Remove duplicates and join
  const uniqueNegatives = [...new Set(negatives)]
  
  return uniqueNegatives.join(', ')
}

export function getContentSafetyFilter(): string[] {
  return [
    'violence', 'scary', 'frightening', 'horror',
    'weapons', 'blood', 'injury', 'danger',
    'monsters', 'ghosts', 'demons', 'evil',
    'inappropriate', 'adult content',
    'death', 'dying', 'smoking', 'alcohol', 'drugs',
  ]
}

export default {
  VERSION,
  UNIVERSAL_NEGATIVE,
  AGE_SPECIFIC_NEGATIVE,
  STYLE_NEGATIVE,
  THEME_NEGATIVE,
  CHARACTER_NEGATIVE,
  getNegativePrompt,
  getContentSafetyFilter,
}

