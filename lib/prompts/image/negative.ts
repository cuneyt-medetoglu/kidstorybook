import type { PromptVersion } from '../types'

/**
 * Negative Prompts - Version 1.0.0
 * 
 * What to AVOID in image generation
 * Critical for child safety and quality
 */

export const VERSION: PromptVersion = {
  version: '1.3.0',
  releaseDate: new Date('2026-02-08'),
  status: 'active',
  changelog: [
    'Initial release',
    'Safety-focused negative prompts',
    'Age-specific restrictions',
    'Quality control filters',
    'Added facial skin quality controls - blemishes, moles, marks (15 Ocak 2026)',
    'Added logical/pose error prevention - body rotation, orientation consistency (15 Ocak 2026)',
    'Enhanced anatomical correctness directives with skin quality and pose consistency (15 Ocak 2026)',
    'Enhanced hand/finger anatomy directives with detailed instructions (16 Ocak 2026)',
    'Added comprehensive hand/finger negative prompts from AI research (16 Ocak 2026)',
    'v1.0.3: Anatomical directives detaylandırıldı - structured format, newline separation, explicit instructions (16 Ocak 2026)',
    'v1.0.3: ANATOMICAL_NEGATIVE minimalize edildi - %90 azaltma, token attention problemi çözüldü (16 Ocak 2026)',
    'v1.0.4: El ele tutuşma yasağı eklendi - hands must be separate, NO hand-holding (16 Ocak 2026)',
    'v1.0.5: Yapılandırılmış format uygulandı - [ANATOMY_RULES] tag-based structure (GPT research-backed) (18 Ocak 2026)',
    'v1.0.5: ANATOMICAL_NEGATIVE daha da sadeleştirildi - tekrarlar kaldırıldı (18 Ocak 2026)',
    'v1.0.5: getSafeHandPoses() eklendi - güvenli el pozisyonları listesi (18 Ocak 2026)',
    'v1.1.0: Prompt optimization - anatomical directives ultra-simplified (500→120 chars), safe poses minimized (150→40 chars), ANATOMICAL_NEGATIVE reduced to 3 items (18 Ocak 2026)',
    'v1.2.0: El/parmak – getAnatomicalCorrectnessDirectives: five distinct fingers, well-formed hands, properly proportioned. ANATOMICAL_NEGATIVE: extra fingers, missing fingers, fused fingers (7 Şubat 2026)',
    'v1.3.0: [A11] Parmak stratejisi – getDefaultHandStrategy(): hands at sides, relaxed, partially out of frame, no hand gestures, not holding objects. getHandDirectivesWhenVisible(): five fingers + avoid (PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md, 8 Şubat 2026)',
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
// Composition Negative Prompts (GPT sinematik kalite – "kocaman karakter" kırma)
// 7 Şubat 2026: close-up/centered/filling frame ile karakterin frame'i doldurması azaltılır
// ============================================================================

export const COMPOSITION_NEGATIVE = [
  'close-up portrait',
  'centered subject',
  'character filling frame',
  'big head',
  'cropped feet',
  'selfie angle',
  'poster composition',
  'no zoom-in',
  'no tight framing',
]

// ============================================================================
// Style-Specific Negative Prompts (UPDATED: Illustration Style İyileştirmesi)
// ============================================================================

export const STYLE_NEGATIVE: Record<string, string[]> = {
  // 3D Animation (Pixar Style)
  '3d_animation': [
    'photorealistic', 'realistic photography', '2D flat illustration',
    'hand-drawn sketch', 'watercolor', 'comic book style',
    'realistic textures', 'photographic quality',
  ],
  '3d': [
    'photorealistic', 'realistic photography', '2D flat illustration',
    'hand-drawn sketch', 'watercolor', 'comic book style',
    'realistic textures', 'photographic quality',
  ],
  
  // Geometric
  'geometric': [
    'organic shapes', 'curved edges', 'gradients', 'detailed textures',
    'realistic shading', 'watercolor', 'soft edges', 'rounded forms',
    'natural shapes', 'complex details',
  ],
  
  // Watercolor
  'watercolor': [
    'opaque colors', 'sharp edges', 'digital looking', 'harsh lines',
    'gouache style', 'matte finish', 'solid color blocks',
    'no transparency', 'flat colors',
  ],
  
  // Block World
  'block_world': [
    'smooth surfaces', 'organic shapes', 'realistic textures', 'gradients',
    'detailed shading', 'curved edges', 'natural forms', 'soft edges',
    'watercolor', 'photorealistic',
  ],
  'block-world': [
    'smooth surfaces', 'organic shapes', 'realistic textures', 'gradients',
    'detailed shading', 'curved edges', 'natural forms', 'soft edges',
    'watercolor', 'photorealistic',
  ],
  
  // Collage
  'collage': [
    'smooth edges', 'digital illustration', 'flat design', 'no layers',
    'seamless blending', 'perfect edges', 'clean cutouts',
    'no texture', 'uniform appearance',
  ],
  
  // Clay Animation
  'clay_animation': [
    'smooth surfaces', 'digital looking', 'sharp edges', 'realistic textures',
    'glossy finish', 'perfect surfaces', 'no imperfections',
    'clean appearance', 'photorealistic',
  ],
  'clay-animation': [
    'smooth surfaces', 'digital looking', 'sharp edges', 'realistic textures',
    'glossy finish', 'perfect surfaces', 'no imperfections',
    'clean appearance', 'photorealistic',
  ],
  
  // Kawaii
  'kawaii': [
    'realistic proportions', 'small eyes', 'harsh shadows', 'dark colors',
    'angular shapes', 'anime style', 'realistic features',
    'normal head size', 'serious expression',
  ],
  
  // Comic Book
  'comic_book': [
    'soft gradients', 'subtle shadows', 'realistic shading', 'photographic style',
    'watercolor', 'smooth edges', 'detailed textures',
    'realistic proportions', 'soft lighting',
  ],
  'comic-book': [
    'soft gradients', 'subtle shadows', 'realistic shading', 'photographic style',
    'watercolor', 'smooth edges', 'detailed textures',
    'realistic proportions', 'soft lighting',
  ],
  
  // Sticker Art
  'sticker_art': [
    'soft edges', 'watercolor', 'realistic shading', 'matte finish',
    'organic shapes', 'textured surfaces', 'hand-drawn look',
    'rough edges', 'natural appearance',
  ],
  'sticker-art': [
    'soft edges', 'watercolor', 'realistic shading', 'matte finish',
    'organic shapes', 'textured surfaces', 'hand-drawn look',
    'rough edges', 'natural appearance',
  ],
  
  // Legacy support (deprecated styles - kept for backward compatibility)
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
// ANATOMICAL ERROR PREVENTION (ENHANCED: 15 Ocak 2026)
// ============================================================================

/**
 * Minimalized anatomical negative prompts
 * UPDATED: 18 Ocak 2026 - Sadeleştirilmiş, tekrarlar kaldırıldı
 * REASON: Spesifik terimler (e.g., "6 fingers") token attention problemi yaratıyor
 * - Model'i priming yapıyor (bahsettiğimiz hatayı yaratıyor)
 * - Pozitif direktiflerle çakışıyor
 * STRATEGY: Minimal, genel terimler - pozitif direktiflere odaklan
 */
export const ANATOMICAL_NEGATIVE = [
  'deformed', 'extra limbs', 'holding hands',
  'extra fingers', 'missing fingers', 'fused fingers',
]

// ============================================================================
// Character-Specific Negative Prompts
// ============================================================================

export const CHARACTER_NEGATIVE = [
  // Avoid character inconsistency
  'different character', 'another child',
  'multiple versions of same character',
  'inconsistent appearance',
  
  // Avoid bad character rendering (merged with anatomical)
  'distorted face', 'weird face', 'ugly face',
  'bad eyes', 'asymmetric eyes', 'crossed eyes',
  
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
  
  // Add ANATOMICAL negatives (NEW: 15 Ocak 2026 - CRITICAL)
  negatives.push(...ANATOMICAL_NEGATIVE)
  
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
  
  // Add composition negatives (sinematik kalite – avoid "kocaman karakter")
  negatives.push(...COMPOSITION_NEGATIVE)
  
  // Remove duplicates and join
  const uniqueNegatives = [...new Set(negatives)]
  
  return uniqueNegatives.join(', ')
}

/**
 * Get anatomical correctness directives for POSITIVE prompt
 * These are instructions to add to the positive prompt, not negative
 * UPDATED: 18 Ocak 2026 - Yapılandırılmış format (AI research-backed)
 * Research shows: Structured format + 2+ specific anatomy terms = 74% success rate (vs 31% without)
 * Simplified to avoid token attention issues
 */
export function getAnatomicalCorrectnessDirectives(): string {
  return '[ANATOMY] Each hand has exactly five distinct fingers, clearly separated; well-formed hands, properly proportioned fingers. Arms at sides, 2 arms 2 legs, symmetrical face (2 eyes 1 nose 1 mouth). [/ANATOMY]'
}

/**
 * Get safe hand poses that avoid anatomical errors
 * Research shows: Simple, clear poses reduce error rate by ~30%
 */
export function getSafeHandPoses(): string[] {
  return ['hands at sides', 'simple wave', 'behind back']
}

// ============================================================================
// [A11] Parmak stratejisi (PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md, 8 Şubat 2026)
// ============================================================================

/**
 * Default hand strategy: de-emphasize hands to reduce finger errors.
 * "Hands at sides, relaxed, partially out of frame, no hand gestures, not holding objects."
 */
export function getDefaultHandStrategy(): string {
  return 'Hands at sides, relaxed, partially out of frame, no hand gestures, not holding objects.'
}

/**
 * When hands must be visible in scene: explicit five-finger + avoid list.
 * Use only when story/scene requires hands visible (e.g. waving, holding object).
 */
export function getHandDirectivesWhenVisible(): string {
  return 'Exactly five fingers per hand, visible gaps, natural joints, no extra digits, no fused fingers. Avoid: extra fingers, six fingers, malformed hands.'
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
  COMPOSITION_NEGATIVE,
  STYLE_NEGATIVE,
  THEME_NEGATIVE,
  CHARACTER_NEGATIVE,
  ANATOMICAL_NEGATIVE,
  getNegativePrompt,
  getContentSafetyFilter,
  getAnatomicalCorrectnessDirectives,
  getSafeHandPoses,
  getDefaultHandStrategy,
  getHandDirectivesWhenVisible,
}

