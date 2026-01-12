import type { PromptVersion } from '../../types'
import { getStyleDescription, is3DAnimationStyle, get3DAnimationNotes } from './style-descriptions'

/**
 * Scene Generation Prompts - Version 1.0.0
 * 
 * Creates detailed scene descriptions for each page
 * Works in conjunction with character prompts
 * 
 * Updated: 15 Ocak 2026
 * - Enhanced with POC's detailed prompt structure
 * - Added character consistency emphasis
 * - Added book cover special instructions
 * - Added 3D Animation style special notes
 */

export const VERSION: PromptVersion = {
  version: '1.0.0',
  releaseDate: new Date('2026-01-10'),
  status: 'active',
  changelog: [
    'Initial release',
    'Scene composition rules',
    'Age-appropriate scenes',
    'Theme-based environments',
    'Enhanced with POC detailed prompt structure (15 Ocak 2026)',
    'Added character consistency emphasis',
    'Added book cover special instructions',
    'Added 3D Animation style special notes',
  ],
  author: '@prompt-manager',
}

// ============================================================================
// Scene Generation
// ============================================================================

export interface SceneInput {
  pageNumber: number
  sceneDescription: string // From story generation
  theme: string
  mood: string
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
  weather?: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  characterAction: string // What character is doing
  focusPoint: 'character' | 'environment' | 'balanced'
}

export function generateScenePrompt(
  scene: SceneInput,
  characterPrompt: string,
  illustrationStyle: string
): string {
  const parts: string[] = []

  // Get detailed style description (POC style - enhanced)
  const styleDesc = getStyleDescription(illustrationStyle)
  
  // Start with detailed illustration style description
  parts.push(`${styleDesc} illustration`)
  
  // Character with emphasis on consistency (POC style)
  parts.push(`${characterPrompt}`)
  parts.push(`consistent character design, same character as previous pages`)
  
  // Character action
  parts.push(`${scene.characterAction}`)

  // Environment based on theme
  const environment = getEnvironmentDescription(scene.theme, scene.sceneDescription)
  parts.push(`in ${environment}`)

  // Lighting based on time of day
  if (scene.timeOfDay) {
    const lighting = getLightingDescription(scene.timeOfDay, scene.mood)
    parts.push(`${lighting}`)
  }

  // Weather effects
  if (scene.weather && scene.weather !== 'sunny') {
    parts.push(getWeatherDescription(scene.weather))
  }

  // Mood and atmosphere
  parts.push(getMoodDescription(scene.mood))

  // Composition rules
  const composition = getCompositionRules(scene.focusPoint, scene.pageNumber)
  parts.push(composition)

  // Quality and style consistency (enhanced)
  parts.push('professional children\'s book illustration')
  parts.push('high quality, print-ready')
  parts.push('detailed but age-appropriate')
  parts.push('warm and inviting atmosphere')
  
  // Character consistency emphasis (POC style)
  parts.push('character must match reference photo exactly, same features on every page')

  return parts.join(', ')
}

// ============================================================================
// Environment Descriptions
// ============================================================================

function getEnvironmentDescription(theme: string, sceneDesc: string): string {
  const t = (theme || '').toString().trim().toLowerCase()
  const normalizedTheme =
    t === 'sports&activities' || t === 'sports_activities' || t === 'sports-activities'
      ? 'sports'
      : t

  const environments: Record<string, string[]> = {
    adventure: [
      'lush forest with tall trees and dappled sunlight',
      'mountain path with colorful wildflowers',
      'beach with gentle waves and smooth sand',
      'meadow with butterflies and blooming flowers',
    ],
    sports: [
      'sunny playground with colorful equipment and soft grass',
      'sports field with friendly kids and bright cones',
      'indoor gym with soft mats and fun activity stations',
      'park path with a playful obstacle course',
    ],
    fantasy: [
      'magical garden with glowing flowers',
      'enchanted forest with sparkling lights',
      'whimsical castle courtyard',
      'mystical clearing with floating lights',
    ],
    animals: [
      'friendly farm with red barn and green fields',
      'zoo with natural habitats',
      'forest clearing where animals gather',
      'cozy animal home with natural decorations',
    ],
    'daily-life': [
      'warm and cozy home interior',
      'cheerful classroom with colorful decorations',
      'friendly neighborhood street',
      'inviting playground',
    ],
    space: [
      'colorful space station with large windows',
      'alien planet with unique plants and crystals',
      'inside spaceship with control panels',
      'space landscape with multiple moons',
    ],
    underwater: [
      'vibrant coral reef with colorful fish',
      'underwater cave with bioluminescent plants',
      'ocean floor with interesting rocks and seaweed',
      'sunlit shallow water with sand and shells',
    ],
  }

  const normalizedThemeEnvs = environments[normalizedTheme] || environments['adventure']
  
  // Try to match scene description to appropriate environment
  // Or use the scene description directly if detailed
  if (sceneDesc && sceneDesc.length > 20) {
    return sceneDesc
  }
  
  // Otherwise pick appropriate environment
  return normalizedThemeEnvs[0]
}

// ============================================================================
// Lighting Descriptions
// ============================================================================

function getLightingDescription(timeOfDay: string, mood: string): string {
  const lighting: Record<string, string> = {
    morning: 'soft morning light, golden sunrise glow, fresh and bright',
    afternoon: 'bright daylight, clear and vibrant, full illumination',
    evening: 'warm evening light, golden hour glow, soft shadows',
    night: 'gentle moonlight, starry sky, magical nighttime glow',
  }

  let light = lighting[timeOfDay] || lighting['afternoon']

  // Adjust based on mood
  if (mood === 'mysterious' || mood === 'calm') {
    light += ', soft diffused lighting'
  } else if (mood === 'exciting' || mood === 'adventurous') {
    light += ', dynamic lighting'
  }

  return light
}

// ============================================================================
// Weather Descriptions
// ============================================================================

function getWeatherDescription(weather: string): string {
  const descriptions: Record<string, string> = {
    cloudy: 'gentle clouds in sky, soft diffused light',
    rainy: 'light rain with puddles, rainbow in distance, not scary',
    snowy: 'soft falling snowflakes, winter wonderland, cozy atmosphere',
  }
  return descriptions[weather] || ''
}

// ============================================================================
// Mood and Atmosphere
// ============================================================================

function getMoodDescription(mood: string): string {
  const moods: Record<string, string> = {
    exciting: 'dynamic and energetic atmosphere, sense of adventure',
    calm: 'peaceful and serene atmosphere, gentle and soothing',
    funny: 'playful and cheerful atmosphere, lighthearted mood',
    mysterious: 'intriguing atmosphere with sense of wonder, not scary',
    inspiring: 'uplifting atmosphere, sense of possibility',
    happy: 'joyful and bright atmosphere, positive energy',
  }
  return moods[mood] || moods['happy']
}

// ============================================================================
// Composition Rules
// ============================================================================

function getCompositionRules(focus: string, pageNumber: number): string {
  const rules: string[] = []

  if (focus === 'character') {
    rules.push('character in center focus')
    rules.push('clear view of character\'s face and expression')
    rules.push('environment provides context but doesn\'t overwhelm')
  } else if (focus === 'environment') {
    rules.push('wide environmental shot')
    rules.push('character visible but environment is prominent')
    rules.push('establishing shot feeling')
  } else {
    rules.push('balanced composition')
    rules.push('character and environment equally important')
    rules.push('harmonious scene')
  }

  // First and last pages often need special treatment
  if (pageNumber === 1) {
    rules.push('inviting opening illustration')
    rules.push('draws viewer into the story')
  } else if (pageNumber >= 10) {
    rules.push('satisfying conclusion feeling')
    rules.push('sense of completion')
  }

  return rules.join(', ')
}

// ============================================================================
// Age-Appropriate Scene Rules
// ============================================================================

export function getAgeAppropriateSceneRules(ageGroup: string): string[] {
  const rules: Record<string, string[]> = {
    toddler: [
      'very simple background',
      'few elements to avoid confusion',
      'bright primary colors',
      'large clear shapes',
      'no scary or complex elements',
    ],
    preschool: [
      'simple but detailed background',
      'clear focal point',
      'bright cheerful colors',
      'recognizable elements',
      'friendly and inviting',
    ],
    'early-elementary': [
      'moderately detailed background',
      'interesting elements to discover',
      'varied color palette',
      'clear story telling',
      'engaging but not overwhelming',
    ],
    elementary: [
      'detailed and rich background',
      'multiple elements and layers',
      'sophisticated color palette',
      'depth and perspective',
      'visually interesting',
    ],
    'pre-teen': [
      'highly detailed background',
      'complex composition',
      'mature artistic style',
      'subtle details to discover',
      'sophisticated visual storytelling',
    ],
  }

  return rules[ageGroup] || rules['preschool']
}

// ============================================================================
// Full Page Image Prompt
// ============================================================================

export function generateFullPagePrompt(
  characterPrompt: string,
  sceneInput: SceneInput,
  illustrationStyle: string,
  ageGroup: string
): string {
  // Build scene prompt (enhanced with POC style)
  const scenePrompt = generateScenePrompt(sceneInput, characterPrompt, illustrationStyle)
  
  // Add age-appropriate rules
  const ageRules = getAgeAppropriateSceneRules(ageGroup)
  
  // Start building prompt parts
  const promptParts: string[] = []
  promptParts.push(scenePrompt)
  promptParts.push(ageRules.join(', '))
  
  // Special instructions for Page 1 (Book Cover) - POC style
  if (sceneInput.pageNumber === 1) {
    promptParts.push('BOOK COVER ILLUSTRATION (NOT a book mockup, NOT a 3D book object, NOT a book on a shelf)')
    promptParts.push('FLAT, STANDALONE ILLUSTRATION that can be used as a book cover')
    promptParts.push('main character prominently featured in center or foreground')
    promptParts.push('visually striking, colorful, and appealing to children')
    promptParts.push('professional and print-ready')
    promptParts.push('NO TEXT, NO WRITING, NO LETTERS, NO WORDS in the image - text will be added separately as a separate layer')
  }
  
  // 3D Animation style special notes (POC style)
  if (is3DAnimationStyle(illustrationStyle)) {
    promptParts.push(get3DAnimationNotes())
  }
  
  // Additional character consistency emphasis (POC style)
  promptParts.push('character must RESEMBLE the child in the reference photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering')
  promptParts.push('character should look like a stylized illustration that captures the child\'s features but in the chosen illustration style')
  promptParts.push('clearly an illustration, not a photograph')
  
  // CRITICAL: No text in images - text will be added separately as a separate layer
  promptParts.push('NO TEXT, NO WRITING, NO LETTERS, NO WORDS, NO TITLES in the image - text will be added separately as a separate layer')
  
  // Combine everything
  const fullPrompt = promptParts.join(', ')
  
  return fullPrompt
}

export default {
  VERSION,
  generateScenePrompt,
  generateFullPagePrompt,
  getAgeAppropriateSceneRules,
}

