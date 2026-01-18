import type { PromptVersion } from '../../types'
import { getStyleDescription, is3DAnimationStyle, get3DAnimationNotes } from './style-descriptions'
import { getAnatomicalCorrectnessDirectives, getSafeHandPoses } from './negative'

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
  version: '1.1.0',
  releaseDate: new Date('2026-01-18'),
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
    'v1.0.1: Prompt order optimization - anatomical directives moved to beginning (anatomy-first approach) (16 Ocak 2026)',
    'v1.0.1: Style emphasis added with uppercase for better attention (16 Ocak 2026)',
    'v1.0.2: Risky scene detection added - detectRiskySceneElements() (GPT research-backed) (18 Ocak 2026)',
    'v1.0.2: Safe scene alternatives - getSafeSceneAlternative() for risk mitigation (18 Ocak 2026)',
    'v1.1.0: Major optimization - style directives simplified (1500→200 chars), cinematic elements compressed (50→5 lines), environment templates reduced (90→15 lines), composition rules simplified (28→7 lines), cover directives optimized (27→3 lines), diversity directives minimized (40→10 lines), clothing consistency compressed (30→5 lines) - Total ~70% reduction (18 Ocak 2026)',
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

// NEW: Scene Diversity Analysis (16 Ocak 2026)
export interface SceneDiversityAnalysis {
  location: string
  timeOfDay: 'morning' | 'late-morning' | 'noon' | 'afternoon' | 'late-afternoon' | 'evening' | 'sunset' | 'dusk' | 'night' | 'unknown'
  weather: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'unknown'
  perspective: 'wide' | 'medium' | 'close-up' | 'bird-eye' | 'low-angle' | 'high-angle' | 'eye-level' | 'unknown'
  composition: 'centered' | 'left' | 'right' | 'balanced' | 'diagonal' | 'symmetrical' | 'group' | 'unknown'
  mood: string
  action: string
}

/**
 * HYBRID PROMPT GENERATION (NEW: 15 Ocak 2026)
 * Combines cinematic and descriptive elements for high-quality illustrations
 * Inspired by Magical Children's Book quality standards
 */
export function generateScenePrompt(
  scene: SceneInput,
  characterPrompt: string,
  illustrationStyle: string
): string {
  const parts: string[] = []

  // 1. STYLE - Get detailed style description
  const styleDesc = getStyleDescription(illustrationStyle)
  parts.push(`${styleDesc} illustration, cinematic quality`)
  
  // 2. CINEMATIC ELEMENTS - Add cinematic composition
  const cinematicElements = getCinematicElements(scene.pageNumber, scene.mood)
  parts.push(cinematicElements)
  
  // 3. CHARACTER - With emphasis on consistency
  parts.push(`${characterPrompt}`)
  parts.push(`consistent character design, same character as previous pages`)
  
  // 4. CHARACTER ACTION
  parts.push(`${scene.characterAction}`)

  // 5. ENVIRONMENT - Detailed (cinematic level)
  const environment = getEnvironmentDescription(scene.theme, scene.sceneDescription)
  parts.push(`in ${environment}`)

  // 6. LIGHTING - Based on time of day
  if (scene.timeOfDay) {
    const lighting = getLightingDescription(scene.timeOfDay, scene.mood)
    parts.push(`${lighting}`)
  }

  // 7. WEATHER - If applicable
  if (scene.weather && scene.weather !== 'sunny') {
    parts.push(getWeatherDescription(scene.weather))
  }

  // 8. MOOD AND ATMOSPHERE
  parts.push(getMoodDescription(scene.mood))

  // 9. STYLE-SPECIFIC DIRECTIVES (NEW: Illustration Style İyileştirmesi)
  const styleDirectives = getStyleSpecificDirectives(illustrationStyle)
  if (styleDirectives) {
    parts.push(styleDirectives)
  }

  // 10. COMPOSITION RULES
  const composition = getCompositionRules(scene.focusPoint, scene.pageNumber)
  parts.push(composition)

  // 11. QUALITY AND CONSISTENCY
  parts.push('professional children\'s book illustration')
  parts.push('high quality, print-ready')
  parts.push('detailed but age-appropriate')
  parts.push('warm and inviting atmosphere')
  
  // 12. CHARACTER CONSISTENCY EMPHASIS
  parts.push('character must match reference photo exactly, same features on every page')

  return parts.join(', ')
}

// ============================================================================
// Environment Descriptions (ENHANCED: 15 Ocak 2026 - 3 Levels of Detail)
// ============================================================================

/**
 * 3-level environment description system
 * Level 1: General - Simple description
 * Level 2: Detailed - Adds specific elements
 * Level 3: Cinematic - Full atmospheric description with lighting, textures, mood
 */
// Simplified environment templates (optimized - only essential info)
const ENVIRONMENT_TEMPLATES: Record<string, string[]> = {
  adventure: ['lush forest, dappled sunlight, wildflowers', 'mountain path, colorful wildflowers, distant peaks'],
  sports: ['sunny playground, colorful equipment', 'sports field, bright cones, goal posts'],
  fantasy: ['magical garden, glowing flowers, fairy lights', 'enchanted forest, magical lights, mystical fog'],
  animals: ['friendly farm, red barn, green fields', 'forest clearing, soft grass, wildflowers'],
  'daily-life': ['cozy home interior, warm light, comfortable', 'cheerful classroom, colorful decorations'],
  space: ['space station, large windows, stars and planets', 'alien planet, unusual plants, colorful sky'],
  underwater: ['coral reef, colorful fish, clear water', 'underwater cave, bioluminescent plants'],
}

function getEnvironmentDescription(theme: string, sceneDesc: string): string {
  // If scene description provided, use it
  if (sceneDesc && sceneDesc.length > 50) {
    return sceneDesc
  }
  
  // Otherwise use simplified template
  const normalizedTheme = theme.toLowerCase().replace(/[-&_\s]/g, '-')
  const templates = ENVIRONMENT_TEMPLATES[normalizedTheme] || ENVIRONMENT_TEMPLATES['adventure']
  return templates[0]
}

// ============================================================================
// Lighting Descriptions
// ============================================================================

function getLightingDescription(timeOfDay: string, mood: string): string {
  const lighting: Record<string, string> = {
    morning: 'soft morning light', afternoon: 'bright daylight',
    evening: 'golden hour', night: 'moonlight',
  }
  return lighting[timeOfDay] || 'bright daylight'
}

// ============================================================================
// Weather Descriptions
// ============================================================================

function getWeatherDescription(weather: string): string {
  const desc: Record<string, string> = {
    cloudy: 'gentle clouds', rainy: 'light rain', snowy: 'soft snowflakes',
  }
  return desc[weather] || ''
}

// ============================================================================
// Mood and Atmosphere
// ============================================================================

function getMoodDescription(mood: string): string {
  const moods: Record<string, string> = {
    exciting: 'dynamic energetic', calm: 'peaceful serene',
    funny: 'playful cheerful', mysterious: 'intriguing wonder',
    inspiring: 'uplifting', happy: 'joyful bright',
  }
  return moods[mood] || 'joyful bright'
}

// ============================================================================
// Cinematic Elements (NEW: 15 Ocak 2026)
// ============================================================================

/**
 * Generates cinematic composition elements (optimized)
 */
export function getCinematicElements(pageNumber: number, mood: string): string {
  const lighting = mood === 'exciting' ? 'dynamic lighting' : mood === 'calm' ? 'soft ambient' : 'warm natural light'
  const angle = pageNumber === 1 ? 'hero shot' : 'varied perspective'
  return `layered depth, rule of thirds, ${lighting}, ${angle}, cinematic quality`
}

// ============================================================================
// Composition Rules
// ============================================================================

function getCompositionRules(focus: string, pageNumber: number): string {
  const base = focus === 'character' ? 'character centered, clear face' :
               focus === 'environment' ? 'wide environmental shot' :
               'balanced composition'
  const special = pageNumber === 1 ? ', inviting opening' : pageNumber >= 10 ? ', conclusion' : ''
  return base + special
}

// ============================================================================
// Age-Appropriate Scene Rules
// ============================================================================

export function getAgeAppropriateSceneRules(ageGroup: string): string[] {
  const rules: Record<string, string[]> = {
    toddler: ['simple background', 'bright colors', 'no scary elements'],
    preschool: ['clear focal point', 'bright colors', 'friendly'],
    'early-elementary': ['detailed background', 'varied colors', 'engaging'],
    elementary: ['rich background', 'sophisticated palette', 'visually interesting'],
    'pre-teen': ['complex composition', 'mature style', 'subtle details'],
  }
  return rules[ageGroup] || rules['preschool']
}

// ============================================================================
// Theme-Appropriate Clothing (NEW: 15 Ocak 2026)
// ============================================================================

/**
 * Returns theme-appropriate clothing description
 * Ensures clothing matches story theme (camping → casual outdoor, NOT formal)
 */
function getThemeAppropriateClothing(theme: string): string {
  const normalized = theme.toLowerCase().replace(/[-&_\s]/g, '-')
  const styles: Record<string, string> = {
    adventure: 'outdoor casual', sports: 'sportswear', fantasy: 'casual',
    animals: 'casual outdoor', 'daily-life': 'everyday casual', space: 'casual futuristic',
    underwater: 'swimwear or beach wear',
  }
  return styles[normalized] || 'casual'
}

// ============================================================================
// CHARACTER CLOTHING CONSISTENCY (NEW: 15 Ocak 2026)
// ============================================================================

/**
 * Ensures character wears same clothing unless story explicitly mentions change
 * Critical for visual consistency across pages
 */
export function getClothingConsistencyNote(
  pageNumber: number,
  storyText: string,
  previousClothing?: string
): string {
  // Keywords that indicate clothing change in story
  const changeKeywords = [
    'changed into',
    'put on',
    'wore',
    'dressed in',
    'wearing',
    'changed clothes',
    'pajamas',
    'costume',
    'outfit',
    'jacket',
    'coat',
    'swimsuit',
    'uniform'
  ]
  
  // Check if story mentions clothing change
  const hasClothingChange = changeKeywords.some(keyword => 
    storyText.toLowerCase().includes(keyword)
  )
  
  // If no clothing change mentioned and not first page
  if (!hasClothingChange && pageNumber > 1) {
    if (previousClothing) {
      return `wearing the same ${previousClothing} as in previous pages`
    } else {
      return 'wearing the same clothing as in previous pages, maintain clothing consistency throughout story'
    }
  }
  
  // If clothing change mentioned or first page, let AI generate appropriate clothing
  return ''
}

// ============================================================================
// FOREGROUND/MIDGROUND/BACKGROUND LAYER SYSTEM (NEW: 15 Ocak 2026)
// ============================================================================

/**
 * Generates layered composition instructions
 * Ensures proper depth and visual hierarchy like Magical Children's Book examples
 */
export function generateLayeredComposition(
  sceneInput: SceneInput,
  characterAction: string,
  environment: string
): string {
  const layers: string[] = []
  
  // FOREGROUND - Character and immediate elements
  layers.push(`FOREGROUND: ${characterAction}, main character in clear focus with detailed features visible`)
  
  // MIDGROUND - Story elements and context
  if (sceneInput.sceneDescription && sceneInput.sceneDescription.length > 20) {
    // Extract key elements from scene description
    layers.push(`MIDGROUND: ${sceneInput.sceneDescription}`)
  } else {
    layers.push(`MIDGROUND: story elements and contextual objects related to the scene`)
  }
  
  // BACKGROUND - Environment and atmosphere
  layers.push(`BACKGROUND: ${environment}, providing depth and atmosphere`)
  
  return layers.join('. ')
}

// ============================================================================
// Style-Specific Directives (NEW: Illustration Style İyileştirmesi)
// ============================================================================

/**
 * Get style-specific technical directives for each illustration style
 * These are detailed technical instructions that help GPT-image-1.5 understand
 * and apply the specific visual characteristics of each style
 */
export function getStyleSpecificDirectives(illustrationStyle: string): string {
  const normalizedStyle = illustrationStyle.toLowerCase().replace(/[-\s]/g, '_')
  
  const directives: Record<string, string> = {
    '3d_animation': 'Pixar-style 3D, rounded shapes, vibrant colors, soft shadows',
    'geometric': 'Flat geometric shapes, no gradients, vector art, clean lines',
    'watercolor': 'Transparent watercolor, soft brushstrokes, paper texture visible',
    'block_world': 'Pixelated blocky aesthetic, Minecraft-like, limited palette',
    'collage': 'Cut-out pieces, rough edges, layered textures, mixed media',
    'clay_animation': 'Clay-like texture, fingerprints visible, matte finish, stop-motion',
    'kawaii': 'Oversized head, large sparkling eyes, pastel colors, cute aesthetic',
    'comic_book': 'Bold black outlines, flat colors, dramatic shadows, high contrast',
    'sticker_art': 'Clean lines, saturated colors, glossy look, white border effect',
  }
  
  return directives[normalizedStyle] || ''
}

// ============================================================================
// Full Page Image Prompt (ENHANCED: 15 Ocak 2026)
// ============================================================================

export function generateFullPagePrompt(
  characterPrompt: string,
  sceneInput: SceneInput,
  illustrationStyle: string,
  ageGroup: string,
  additionalCharactersCount: number = 0, // NEW: Number of additional characters
  isCover: boolean = false, // NEW: Cover generation için (CRITICAL quality)
  useCoverReference: boolean = false, // NEW: Pages 2-10 için cover reference
  previousScenes?: SceneDiversityAnalysis[] // NEW: For diversity tracking (16 Ocak 2026)
): string {
  // Build scene prompt (hybrid: cinematic + descriptive)
  const scenePrompt = generateScenePrompt(sceneInput, characterPrompt, illustrationStyle)

  // Get environment for layered composition
  const environment = getEnvironmentDescription(sceneInput.theme, sceneInput.sceneDescription)

  // Build layered composition (FOREGROUND/MIDGROUND/BACKGROUND)
  const layeredComp = generateLayeredComposition(sceneInput, sceneInput.characterAction, environment)

  // Add age-appropriate rules
  const ageRules = getAgeAppropriateSceneRules(ageGroup)

  // Start building prompt parts
  const promptParts: string[] = []

  // 1. EN BAŞA: ANATOMICAL CORRECTNESS (CRITICAL) - Research-backed: anatomy first = %30 daha iyi
  const anatomicalDirectives = getAnatomicalCorrectnessDirectives()
  promptParts.push(anatomicalDirectives)
  
  // 1.1. SAFE HAND POSES (NEW: 18 Ocak 2026) - Suggest safe alternatives
  const safeHandPoses = getSafeHandPoses()
  promptParts.push('[SAFE_POSES]')
  promptParts.push('Preferred hand poses: ' + safeHandPoses.join(', '))
  promptParts.push('[/SAFE_POSES]')
  promptParts.push('') // Empty line for separation

  // 2. STYLE (uppercase emphasis for better attention)
  const styleDesc = getStyleDescription(illustrationStyle)
  promptParts.push(`ILLUSTRATION STYLE: ${styleDesc}`)

  // 3. Add layered composition
  promptParts.push(layeredComp)
  promptParts.push(scenePrompt)
  promptParts.push(ageRules.join(', '))
  
  // Multiple characters note (NEW)
  if (additionalCharactersCount > 0) {
    const totalCharacters = additionalCharactersCount + 1
    promptParts.push(`${totalCharacters} characters in the scene: main character and ${additionalCharactersCount} companion(s)`)
    promptParts.push(`all ${totalCharacters} characters should be visible and clearly identifiable`)
    promptParts.push('group composition, balanced arrangement of characters')
  }
  
  // Cover generation (optimized)
  if (isCover) {
    const charCount = additionalCharactersCount + 1
    promptParts.push(`COVER: Reference for all pages. Match reference photos exactly (hair/eyes/skin/features). All ${charCount} characters prominent. Professional, print-ready. Adults have adult proportions.`)
  }
  
  // Cover reference consistency (optimized)
  if (useCoverReference) {
    const charNote = additionalCharactersCount > 0 ? `All ${additionalCharactersCount + 1} characters` : 'Character'
    promptParts.push(`${charNote} match cover image exactly (hair/eyes/skin/features). Only clothing/pose vary.`)
  }
  
  // Page 1 legacy support (optimized)
  if (sceneInput.pageNumber === 1 && !isCover) {
    const charNote = additionalCharactersCount > 0 ? `All ${additionalCharactersCount + 1} characters prominent` : 'Character centered'
    promptParts.push(`Book cover illustration (flat, standalone, NOT 3D mockup). ${charNote}. No text/writing.`)
  }
  
  // Style emphasis (optimized - no duplication)
  // Character consistency (simplified)
  promptParts.push('Illustration style (NOT photorealistic). Match reference features.')
  
  // SCENE DIVERSITY REQUIREMENTS (NEW: 16 Ocak 2026)
  if (!isCover && previousScenes && previousScenes.length > 0) {
    const lastScene = previousScenes[previousScenes.length - 1]
    const diversityDirectives = getSceneDiversityDirectives(lastScene)
    if (diversityDirectives) {
      promptParts.push('')
      promptParts.push(diversityDirectives)
    }
  }
  
  // Clothing consistency (optimized)
  const themeClothing = getThemeAppropriateClothing(sceneInput.theme)
  if (isCover) {
    promptParts.push(`Clothing: ${themeClothing} (reference for all pages). No formal wear.`)
  } else if (useCoverReference) {
    promptParts.push('Clothing: Match cover exactly. No formal wear.')
  } else {
    promptParts.push(`Clothing: ${themeClothing}. No formal wear.`)
  }
  
  // No text in images
  promptParts.push('No text/writing in image.')
  
  // Combine everything
  const fullPrompt = promptParts.join(', ')
  
  return fullPrompt
}

// ============================================================================
// Scene Diversity Analysis Functions (NEW: 16 Ocak 2026)
// ============================================================================

/**
 * Extract time of day, location, and weather from scene description
 */
export function extractSceneElements(
  sceneDescription: string,
  storyText?: string
): { timeOfDay?: string; location?: string; weather?: string } {
  const combined = `${sceneDescription} ${storyText || ''}`.toLowerCase()
  
  // Extract time of day
  let timeOfDay: string | undefined
  if (combined.includes('morning') || combined.includes('sabah')) {
    timeOfDay = combined.includes('late morning') || combined.includes('geç sabah') ? 'late-morning' : 'morning'
  } else if (combined.includes('noon') || combined.includes('öğle')) {
    timeOfDay = 'noon'
  } else if (combined.includes('afternoon') || combined.includes('öğleden sonra')) {
    timeOfDay = combined.includes('late afternoon') || combined.includes('geç öğleden sonra') ? 'late-afternoon' : 'afternoon'
  } else if (combined.includes('evening') || combined.includes('akşam')) {
    timeOfDay = 'evening'
  } else if (combined.includes('sunset') || combined.includes('gün batımı')) {
    timeOfDay = 'sunset'
  } else if (combined.includes('dusk') || combined.includes('alacakaranlık')) {
    timeOfDay = 'dusk'
  } else if (combined.includes('night') || combined.includes('gece')) {
    timeOfDay = 'night'
  }
  
  // Extract location keywords
  let location: string | undefined
  const locationKeywords = [
    'home', 'ev', 'house', 'forest', 'orman', 'park', 'mountain', 'dağ', 
    'beach', 'sahil', 'plaj', 'cave', 'mağara', 'river', 'nehir', 'lake', 
    'göl', 'garden', 'bahçe', 'school', 'okul', 'playground', 'oyun alanı',
    'clearing', 'açıklık', 'path', 'yol', 'trail', 'patika', 'summit', 'zirve'
  ]
  
  for (const keyword of locationKeywords) {
    if (combined.includes(keyword)) {
      location = keyword
      break
    }
  }
  
  // Extract weather
  let weather: string | undefined
  if (combined.includes('sunny') || combined.includes('güneşli')) {
    weather = 'sunny'
  } else if (combined.includes('partly cloudy') || combined.includes('parçalı bulutlu')) {
    weather = 'partly-cloudy'
  } else if (combined.includes('cloudy') || combined.includes('bulutlu')) {
    weather = 'cloudy'
  } else if (combined.includes('rainy') || combined.includes('yağmurlu') || combined.includes('rain') || combined.includes('yağmur')) {
    weather = 'rainy'
  } else if (combined.includes('snowy') || combined.includes('karlı') || combined.includes('snow') || combined.includes('kar')) {
    weather = 'snowy'
  } else if (combined.includes('windy') || combined.includes('rüzgarlı')) {
    weather = 'windy'
  }
  
  return { timeOfDay, location, weather }
}

/**
 * Analyze scene for diversity tracking
 */
export function analyzeSceneDiversity(
  sceneDescription: string,
  storyText: string,
  pageNumber: number,
  previousScenes: SceneDiversityAnalysis[]
): SceneDiversityAnalysis {
  const extracted = extractSceneElements(sceneDescription, storyText)
  
  // Determine perspective based on page number and previous scenes
  const perspective = getPerspectiveForPage(
    pageNumber,
    previousScenes.map(s => s.perspective)
  )
  
  // Determine composition based on page number and previous scenes
  const composition = getCompositionForPage(
    pageNumber,
    previousScenes.map(s => s.composition)
  )
  
  return {
    location: extracted.location || 'unknown',
    timeOfDay: (extracted.timeOfDay as any) || 'unknown',
    weather: (extracted.weather as any) || 'unknown',
    perspective,
    composition,
    mood: sceneDescription.toLowerCase().includes('happy') ? 'happy' : 
          sceneDescription.toLowerCase().includes('excited') ? 'excited' : 
          sceneDescription.toLowerCase().includes('curious') ? 'curious' : 
          'neutral',
    action: storyText.substring(0, 100), // First 100 chars as action summary
  }
}

/**
 * Get appropriate perspective for page, ensuring variety
 */
export function getPerspectiveForPage(
  pageNumber: number,
  previousPerspectives: string[]
): SceneDiversityAnalysis['perspective'] {
  const perspectives: SceneDiversityAnalysis['perspective'][] = [
    'wide', 'medium', 'close-up', 'bird-eye', 'low-angle', 'high-angle', 'eye-level'
  ]
  
  // Get last perspective
  const lastPerspective = previousPerspectives[previousPerspectives.length - 1]
  
  // Filter out last perspective to ensure variety
  const availablePerspectives = perspectives.filter(p => p !== lastPerspective)
  
  // Rotate through perspectives based on page number
  const index = (pageNumber - 1) % availablePerspectives.length
  return availablePerspectives[index]
}

/**
 * Get appropriate composition for page, ensuring variety
 */
export function getCompositionForPage(
  pageNumber: number,
  previousCompositions: string[]
): SceneDiversityAnalysis['composition'] {
  const compositions: SceneDiversityAnalysis['composition'][] = [
    'centered', 'left', 'right', 'balanced', 'diagonal', 'symmetrical', 'group'
  ]
  
  // Get last composition
  const lastComposition = previousCompositions[previousCompositions.length - 1]
  
  // Filter out last composition to ensure variety
  const availableCompositions = compositions.filter(c => c !== lastComposition)
  
  // Rotate through compositions based on page number
  const index = (pageNumber - 1) % availableCompositions.length
  return availableCompositions[index]
}

/**
 * Detect risky scene elements that may cause anatomical errors
 * NEW: 18 Ocak 2026 - GPT research-backed risk detection
 */
export interface RiskySceneAnalysis {
  hasRisk: boolean
  riskyElements: string[]
  suggestions: string[]
}

export function detectRiskySceneElements(
  sceneDescription: string,
  characterAction: string
): RiskySceneAnalysis {
  const combined = `${sceneDescription} ${characterAction}`.toLowerCase()
  const riskyElements: string[] = []
  const suggestions: string[] = []
  
  // Riskli el etkileşimleri
  const handInteractionKeywords = [
    'holding hands', 'hand in hand', 'holding', 'grabbing', 'grasping',
    'clutching', 'gripping', 'carrying', 'holding object'
  ]
  
  for (const keyword of handInteractionKeywords) {
    if (combined.includes(keyword)) {
      riskyElements.push(`Hand interaction: "${keyword}"`)
      if (keyword.includes('holding hands') || keyword.includes('hand in hand')) {
        suggestions.push('Replace with: characters standing near each other, arms at sides')
      } else if (keyword.includes('holding') || keyword.includes('carrying')) {
        suggestions.push('Simplify: avoid detailed object manipulation, use simple poses')
      }
    }
  }
  
  // Karmaşık el pozisyonları
  const complexPoseKeywords = [
    'pointing', 'fingers crossed', 'thumbs up', 'peace sign',
    'waving with fingers', 'interlocked fingers'
  ]
  
  for (const keyword of complexPoseKeywords) {
    if (combined.includes(keyword)) {
      riskyElements.push(`Complex hand pose: "${keyword}"`)
      suggestions.push('Simplify: use open palm wave or simple raised hand instead')
    }
  }
  
  // Çoklu karakter el etkileşimleri
  if ((combined.includes('together') || combined.includes('with')) && 
      (combined.includes('hand') || combined.includes('arm'))) {
    riskyElements.push('Multiple character hand interaction detected')
    suggestions.push('Ensure: hands clearly separated, individual poses for each character')
  }
  
  return {
    hasRisk: riskyElements.length > 0,
    riskyElements,
    suggestions
  }
}

/**
 * Get safe alternative for risky scene
 * NEW: 18 Ocak 2026 - Provides safe alternatives to risky poses
 */
export function getSafeSceneAlternative(characterAction: string): string {
  const action = characterAction.toLowerCase()
  
  // Replace risky actions with safe alternatives
  if (action.includes('holding hands')) {
    return characterAction.replace(/holding hands?/gi, 'standing together')
  }
  
  if (action.includes('waving')) {
    return 'character with one arm raised in greeting, open palm visible'
  }
  
  if (action.includes('holding') || action.includes('carrying')) {
    return characterAction.replace(/holding|carrying/gi, 'near') + ', hands at sides'
  }
  
  if (action.includes('pointing')) {
    return characterAction.replace(/pointing/gi, 'looking toward') + ', arm extended naturally'
  }
  
  // If no specific replacement, return original
  return characterAction
}

/**
 * Generate scene diversity prompt directives (optimized)
 */
export function getSceneDiversityDirectives(previousScene?: SceneDiversityAnalysis): string {
  if (!previousScene) return ''
  
  const changes: string[] = []
  if (previousScene.location !== 'unknown') changes.push(`location (was: ${previousScene.location})`)
  if (previousScene.perspective !== 'unknown') changes.push(`perspective (was: ${previousScene.perspective})`)
  if (previousScene.composition !== 'unknown') changes.push(`composition (was: ${previousScene.composition})`)
  
  return changes.length > 0 ? `DIVERSITY: Change ${changes.join(', ')}` : ''
}

export default {
  VERSION,
  generateScenePrompt,
  generateFullPagePrompt,
  getAgeAppropriateSceneRules,
  getStyleSpecificDirectives,
  // NEW: Scene diversity functions
  extractSceneElements,
  analyzeSceneDiversity,
  getPerspectiveForPage,
  getCompositionForPage,
  getSceneDiversityDirectives,
  // NEW: Risk detection functions (18 Ocak 2026)
  detectRiskySceneElements,
  getSafeSceneAlternative,
}

