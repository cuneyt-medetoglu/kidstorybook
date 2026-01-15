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
    'Added facial skin quality controls - blemishes, moles, marks (15 Ocak 2026)',
    'Added logical/pose error prevention - body rotation, orientation consistency (15 Ocak 2026)',
    'Enhanced anatomical correctness directives with skin quality and pose consistency (15 Ocak 2026)',
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
 * Comprehensive anatomical negative prompts
 * Critical for preventing common AI errors (extra fingers, wrong limb count, etc.)
 */
export const ANATOMICAL_NEGATIVE = [
  // Hand/Finger Errors (CRITICAL - most common AI mistake)
  'extra fingers', 'more than 5 fingers', '6 fingers', '7 fingers', '8 fingers', '9 fingers', '10 fingers',
  'missing fingers', 'less than 5 fingers', '4 fingers', '3 fingers', '2 fingers', '1 finger',
  'deformed fingers', 'wrong finger count', 'incorrect number of fingers',
  'fingers fused together', 'fingers missing joints', 'fingers without knuckles',
  'fingers too long', 'fingers too short', 'weird fingers', 'alien fingers',
  'floating fingers', 'disconnected fingers', 'finger growing from wrong place',
  
  // Hand/Arm Errors
  'extra hands', 'three hands', 'four hands', 'multiple hands', 'too many hands',
  'missing hands', 'no hands', 'invisible hands', 'hands disappearing',
  'wrong hand position', 'impossible hand angle', 'broken wrist', 'twisted wrist',
  'hand growing from wrong place', 'hand attached incorrectly', 'hand on head',
  'deformed hands', 'malformed hands', 'weird hands', 'ugly hands',
  'extra arms', 'three arms', 'four arms', 'too many arms', 'multiple arms',
  'missing arms', 'no arms', 'invisible arms', 'one arm',
  'arms growing from head', 'arms in wrong position', 'arms from stomach',
  'deformed arms', 'twisted arms', 'broken arms', 'impossible arm position',
  
  // Foot/Leg Errors
  'extra feet', 'three feet', 'four feet', 'too many feet', 'multiple feet',
  'missing feet', 'no feet', 'invisible feet', 'one foot',
  'wrong number of toes', 'extra toes', 'missing toes', '6 toes', '7 toes',
  'deformed feet', 'feet facing wrong direction', 'backwards feet',
  'feet on backwards', 'twisted feet', 'broken ankles',
  'extra legs', 'three legs', 'four legs', 'too many legs', 'multiple legs',
  'missing legs', 'no legs', 'one leg', 'invisible legs',
  'legs in wrong position', 'legs from chest', 'legs from head',
  'deformed legs', 'twisted legs', 'broken legs', 'impossible leg position',
  
  // Body Proportion Errors
  'wrong proportions', 'bad proportions', 'incorrect proportions',
  'head too large', 'head too small', 'giant head', 'tiny head', 'oversized head',
  'body too long', 'body too short', 'elongated body', 'compressed body',
  'limbs too long', 'limbs too short', 'giant limbs', 'tiny limbs',
  'incorrect body proportions', 'deformed body', 'malformed body',
  'extra limbs', 'missing limbs', 'limbs in wrong places',
  'body parts growing from wrong places', 'misplaced body parts',
  
  // Face Errors
  'extra eyes', 'three eyes', 'four eyes', 'wrong number of eyes', 'too many eyes',
  'missing eyes', 'no eyes', 'one eye', 'eyes in wrong place',
  'asymmetric eyes', 'uneven eyes', 'different sized eyes',
  'eyes too far apart', 'eyes too close together', 'floating eyes',
  'extra nose', 'two noses', 'missing nose', 'no nose', 'nose in wrong place',
  'extra mouth', 'two mouths', 'missing mouth', 'no mouth', 'mouth in wrong place',
  'face distorted', 'face deformed', 'face misaligned', 'asymmetric face',
  'melted face', 'stretched face', 'squished face', 'weird face',
  'extra ears', 'missing ears', 'ears in wrong position',
  
  // Face Skin Quality (NEW: 15 Ocak 2026 - Quality Improvement)
  'blemishes', 'acne', 'pimples', 'moles', 'marks on face', 'spots on face',
  'marks between eyebrows', 'mark between eyes', 'blemish on forehead',
  'skin imperfections', 'facial marks', 'facial blemishes', 'skin marks',
  'unclean skin', 'blemished skin', 'marked skin',
  
  // General Anatomical Issues
  'bad anatomy', 'anatomically incorrect', 'anatomy mistakes', 'anatomy errors',
  'human anatomy errors', 'wrong anatomy', 'impossible anatomy',
  'physical impossibilities', 'impossible poses', 'physics-defying',
  'body parts in wrong positions', 'impossible body structure',
  'mutated', 'mutation', 'mutant', 'deformed', 'malformed',
  'extra body parts', 'missing body parts', 'duplicate body parts',
  'fused limbs', 'merged fingers', 'conjoined',
  'skeleton wrong', 'bones wrong', 'joints wrong', 'no joints',
  
  // Logical/Pose Errors (NEW: 15 Ocak 2026 - Quality Improvement)
  'impossible body rotation', 'body facing wrong direction', 'contradictory body position',
  'upper body twisted incorrectly', 'body rotation error', 'torso facing wrong way',
  'body orientation mismatch', 'body direction contradiction', 'inconsistent body pose',
  'arms/hands in impossible position', 'body physics error', 'unnatural body twist',
  'logically inconsistent pose', 'body parts pointing wrong direction',
  'character facing wrong way for action', 'body alignment error',
  'contradictory movement direction', 'physically impossible body position',
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
  
  // Remove duplicates and join
  const uniqueNegatives = [...new Set(negatives)]
  
  return uniqueNegatives.join(', ')
}

/**
 * Get anatomical correctness directives for POSITIVE prompt
 * These are instructions to add to the positive prompt, not negative
 */
export function getAnatomicalCorrectnessDirectives(): string {
  return [
    'ANATOMICAL CORRECTNESS (CRITICAL):',
    'character must have exactly 5 fingers on each hand (no more, no less)',
    'character must have exactly 2 hands, 2 arms, 2 feet, 2 legs',
    'all body parts must be anatomically correct and properly proportioned',
    'hands, feet, and limbs must be in natural, possible positions',
    'face features must be symmetrical and correctly placed',
    'proper human anatomy, realistic body structure',
    'correct finger count, correct limb count, correct facial features',
    'clean, clear skin without blemishes, marks, moles, or spots on face',
    'body orientation and pose must be logically consistent',
    'character\'s body direction must match movement direction',
    'upper body and lower body must face the same direction (unless explicitly turning)',
    'arms and hands must align with body orientation naturally',
    'no contradictory body positions or impossible rotations'
  ].join(', ')
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
  ANATOMICAL_NEGATIVE,
  getNegativePrompt,
  getContentSafetyFilter,
  getAnatomicalCorrectnessDirectives,
}

