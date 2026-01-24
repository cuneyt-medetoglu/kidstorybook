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
  version: '1.7.0',
  releaseDate: new Date('2026-01-24'),
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
    'v1.2.0: Major enhancement - composition and depth improvements (25 Ocak 2026)',
    'v1.2.0: Added getDepthOfFieldDirectives() - camera parameters, focus planes, bokeh effects (25 Ocak 2026)',
    'v1.2.0: Added getAtmosphericPerspectiveDirectives() - color desaturation, contrast reduction, haze (25 Ocak 2026)',
    'v1.2.0: Added getCameraAngleDirectives() - perspective diversity, child\'s viewpoint (25 Ocak 2026)',
    'v1.2.0: Added getCharacterEnvironmentRatio() - 30-40% character, 60-70% environment balance (25 Ocak 2026)',
    'v1.2.0: Enhanced getCinematicElements() - specific lighting techniques (golden hour, backlighting, god rays) (25 Ocak 2026)',
    'v1.2.0: Enhanced generateLayeredComposition() - depth of field and atmospheric perspective (25 Ocak 2026)',
    'v1.2.0: Enhanced getCompositionRules() - camera angle variety and character-environment ratio (25 Ocak 2026)',
    'v1.2.0: Enhanced getLightingDescription() - specific lighting techniques, color temperatures, atmospheric particles (25 Ocak 2026)',
    'v1.2.0: Enhanced getEnvironmentDescription() - background details, sky, distant elements (25 Ocak 2026)',
    'v1.2.0: Enhanced generateFullPagePrompt() - new directives integrated, prompt structure reorganized (25 Ocak 2026)',
    'v1.3.0: DoF balanced/environment - sharp detailed background, blur removed; layered composition - net ortam; getCharacterEnvironmentRatio - ortam netliği (24 Ocak 2026)',
    'v1.3.0: Cover vs first interior page differentiation - distinct camera/composition (3.5.20) (24 Ocak 2026)',
    'v1.4.0: Character ratio 25-35%, max 35%, wider shot, character smaller; getCharacterEnvironmentRatio and getCompositionRules (24 Ocak 2026)',
    'v1.4.0: Cover poster for entire book, epic wide, dramatic lighting, character max 30-35%, environment-dominant (24 Ocak 2026)',
    'v1.5.0: Age-agnostic scene rules - getAgeAppropriateSceneRules returns rich background for all ages (24 Ocak 2026)',
    'v1.5.0: First interior page - "Character centered" removed; "Character smaller in frame, NOT centered; rule of thirds or leading lines" (24 Ocak 2026)',
    'v1.5.0: Cover prompt softening - "standing prominently/looking at viewer" → "integrated into environment as guide"; "prominently displayed" → "integrated into scene" (24 Ocak 2026)',
    'v1.6.0: Cover focusPoint → balanced (plan: Kapak/Close-up/Kıyafet); no "character centered" on cover (24 Ocak 2026)',
    'v1.6.0: Close-up removed from getCameraAngleDirectives and getPerspectiveForPage – "character 25–35%" alignment (24 Ocak 2026)',
    'v1.6.0: Story-driven clothing – SceneInput.clothing; generateFullPagePrompt uses story clothing when present, else theme (24 Ocak 2026)',
    'v1.7.0: Image API Refactor - Modülerleştirme (3 Faz) (24 Ocak 2026)',
    'v1.7.0: Faz 1 - Inline direktifleri modülerleştir (buildCoverDirectives, buildFirstInteriorPageDirectives, buildClothingDirectives, buildMultipleCharactersDirectives, buildCoverReferenceConsistencyDirectives)',
    'v1.7.0: Faz 2 - Tekrar eden direktifleri birleştir (buildCharacterConsistencyDirectives, buildStyleDirectives)',
    'v1.7.0: Faz 3 - Prompt bölümlerini organize et (12 builder fonksiyonu, generateFullPagePrompt refactor)',
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
  /** Story-driven clothing (e.g. astronaut suit, swimwear). Plan: Kapak/Close-up/Kıyafet. */
  clothing?: string
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

  // 1. STYLE - v1.7.0: Using buildStyleDirectives (first directive only for scene prompt)
  const styleDirectives = buildStyleDirectives(illustrationStyle)
  parts.push(styleDirectives[0]) // First style directive: `${styleDesc} illustration, cinematic quality`
  
  // 2. CINEMATIC ELEMENTS - Add cinematic composition
  const cinematicElements = getCinematicElements(scene.pageNumber, scene.mood, scene.timeOfDay)
  parts.push(cinematicElements)
  
  // 3. CHARACTER - With emphasis on consistency - v1.7.0: Using buildCharacterConsistencyDirectives
  parts.push(`${characterPrompt}`)
  parts.push(buildCharacterConsistencyDirectives()[0]) // First consistency directive
  
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
  const styleSpecificDirectives = getStyleSpecificDirectives(illustrationStyle)
  if (styleSpecificDirectives) {
    parts.push(styleSpecificDirectives)
  }

  // 10. COMPOSITION RULES
  // Note: previousScenes not available in generateScenePrompt, will be handled in generateFullPagePrompt
  // Composition rules are now handled in generateFullPagePrompt with full context
  // Keeping basic composition here for backward compatibility
  const baseComposition = scene.focusPoint === 'character' ? 'character centered, clear face' :
                         scene.focusPoint === 'environment' ? 'wide environmental shot' :
                         'balanced composition'
  parts.push(baseComposition)

  // 11. QUALITY AND CONSISTENCY
  parts.push('professional children\'s book illustration')
  parts.push('high quality, print-ready')
  parts.push('detailed but age-appropriate')
  parts.push('warm and inviting atmosphere')
  
  // 12. CHARACTER CONSISTENCY EMPHASIS - v1.7.0: Using buildCharacterConsistencyDirectives
  parts.push(buildCharacterConsistencyDirectives()[1]) // Second consistency directive

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
  const envParts: string[] = []
  
  // If scene description provided, use it as base
  if (sceneDesc && sceneDesc.length > 50) {
    envParts.push(sceneDesc)
  } else {
    // Otherwise use simplified template
    const normalizedTheme = theme.toLowerCase().replace(/[-&_\s]/g, '-')
    const templates = ENVIRONMENT_TEMPLATES[normalizedTheme] || ENVIRONMENT_TEMPLATES['adventure']
    envParts.push(templates[0])
  }
  
  // Enhanced background details
  envParts.push('expansive sky visible')
  envParts.push('dramatic clouds or clear sky')
  envParts.push('distant mountains or horizon line')
  envParts.push('atmospheric perspective in background')
  
  // Atmospheric elements
  envParts.push('atmospheric haze in distance')
  envParts.push('background elements fade into soft mist')
  
  return envParts.join(', ')
}

// ============================================================================
// Lighting Descriptions
// ============================================================================

function getLightingDescription(timeOfDay: string, mood: string): string {
  const lightingParts: string[] = []
  
  // Base lighting based on time of day
  if (timeOfDay === 'morning') {
    lightingParts.push('soft morning light')
    lightingParts.push('gentle backlighting')
    lightingParts.push('warm diffused light')
  } else if (timeOfDay === 'afternoon') {
    lightingParts.push('bright daylight')
    lightingParts.push('even, diffuse overhead light')
  } else if (timeOfDay === 'evening') {
    lightingParts.push('golden hour lighting')
    lightingParts.push('warm amber tones, golden glow')
    lightingParts.push('backlighting with rim light')
    lightingParts.push('volumetric god rays through atmosphere')
  } else if (timeOfDay === 'night') {
    lightingParts.push('moonlight')
    lightingParts.push('cool ambient light')
    lightingParts.push('dramatic contrast between light and shadow')
  } else {
    lightingParts.push('bright daylight')
  }
  
  // Light direction
  if (timeOfDay === 'evening' || timeOfDay === 'morning') {
    lightingParts.push('light from behind (backlighting)')
  } else if (timeOfDay === 'afternoon') {
    lightingParts.push('top lighting, even distribution')
  }
  
  // Light quality
  if (mood === 'exciting') {
    lightingParts.push('dramatic hard light with strong shadows')
  } else if (mood === 'calm') {
    lightingParts.push('soft diffused light, gentle shadows')
  }
  
  // Color temperature
  if (timeOfDay === 'evening') {
    lightingParts.push('warm amber tones, honeyed light')
  } else if (timeOfDay === 'morning') {
    lightingParts.push('warm golden tones')
  }
  
  // Atmospheric particles for god rays
  if (timeOfDay === 'evening' || timeOfDay === 'morning') {
    lightingParts.push('atmospheric haze, dust particles floating in air')
    lightingParts.push('volumetric light shafts')
  }
  
  return lightingParts.join(', ')
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
 * Generates cinematic composition elements (ENHANCED: 25 Ocak 2026)
 * Based on 2026 best practices: specific lighting techniques, golden hour, backlighting, god rays
 */
export function getCinematicElements(
  pageNumber: number,
  mood: string,
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night'
): string {
  const elements: string[] = []
  
  // Lighting based on time of day and mood
  if (timeOfDay === 'evening' || timeOfDay === 'sunset') {
    elements.push('golden hour lighting')
    elements.push('warm amber tones, golden glow')
    elements.push('backlighting with rim light around character')
    elements.push('volumetric god rays through atmosphere')
  } else if (timeOfDay === 'morning') {
    elements.push('soft morning light')
    elements.push('gentle backlighting')
    elements.push('warm diffused light')
  } else if (timeOfDay === 'night') {
    elements.push('moonlight')
    elements.push('cool ambient light')
    elements.push('dramatic contrast between light and shadow')
  } else {
    // Afternoon or default
    if (mood === 'exciting') {
      elements.push('dynamic lighting with dramatic shadows')
    } else if (mood === 'calm') {
      elements.push('soft ambient light, even diffusion')
    } else {
      elements.push('warm natural light')
    }
  }
  
  // Source → Obstacle → Medium structure for realistic light effects
  if (timeOfDay === 'morning' || timeOfDay === 'evening') {
    elements.push('sunlight through trees into morning mist (source → obstacle → medium)')
  }
  
  // Composition elements
  elements.push('layered depth')
  elements.push('rule of thirds composition')
  
  // Camera angle
  const angle = pageNumber === 1 ? 'hero shot' : 'varied perspective'
  elements.push(angle)
  
  elements.push('cinematic quality')
  
  return elements.join(', ')
}

// ============================================================================
// Composition Rules
// ============================================================================

function getCompositionRules(
  focus: string,
  pageNumber: number,
  previousScenes?: SceneDiversityAnalysis[]
): string {
  const rules: string[] = []
  
  // Base composition
  if (focus === 'character') {
    rules.push('character centered, clear face')
  } else if (focus === 'environment') {
    rules.push('wide environmental shot')
  } else {
    rules.push('balanced composition')
  }
  
  // Camera angle variety
  const cameraAngle = getCameraAngleDirectives(pageNumber, previousScenes)
  rules.push(cameraAngle)
  
  // Composition techniques
  const compositions = ['rule of thirds', 'leading lines (path, trail)', 'symmetrical', 'diagonal composition']
  const lastComposition = previousScenes?.[previousScenes.length - 1]?.composition
  if (lastComposition && lastComposition !== 'unknown') {
    // Avoid repeating same composition
    const availableCompositions = compositions.filter(c => {
      if (lastComposition === 'balanced' && c.includes('balanced')) return false
      if (lastComposition === 'symmetrical' && c.includes('symmetrical')) return false
      if (lastComposition === 'diagonal' && c.includes('diagonal')) return false
      return true
    })
    if (availableCompositions.length > 0) {
      const index = (pageNumber - 1) % availableCompositions.length
      rules.push(availableCompositions[index])
    }
  } else {
    const index = (pageNumber - 1) % compositions.length
    rules.push(compositions[index])
  }
  
  // Character-environment ratio
  rules.push('character 25-35% of frame, environment 65-75%')
  
  // Page-specific
  if (pageNumber === 1) {
    rules.push('inviting opening')
  } else if (pageNumber >= 10) {
    rules.push('conclusion')
  }
  
  return rules.join(', ')
}

// ============================================================================
// Age-Appropriate Scene Rules (v1.5.0: age-agnostic for images)
// ============================================================================

/**
 * Returns scene rules for image prompts.
 * v1.5.0: Age-agnostic – all ages use same "rich environment" rules (elementary-like).
 * Removes "simple background" / "clear focal point" that made character dominant.
 */
export function getAgeAppropriateSceneRules(_ageGroup: string): string[] {
  return [
    'rich background',
    'detailed environment',
    'visually interesting',
    'bright colors',
    'no scary elements',
  ]
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
// Depth of Field Directives (NEW: 25 Ocak 2026)
// ============================================================================

/**
 * Generates depth of field directives for cinematic composition
 * Based on 2026 best practices: camera parameters, focus planes, bokeh effects
 */
export function getDepthOfFieldDirectives(pageNumber: number, focusPoint: string): string {
  const directives: string[] = []
  
  // Camera parameters based on focus point
  if (focusPoint === 'character') {
    // Shallow DoF for cover only (portrait style); background softened but readable
    directives.push('50mm prime lens, f/1.4 aperture')
    directives.push('shallow depth of field')
    directives.push('sharp focus on character\'s eyes and face')
    directives.push('background with subtle atmospheric haze, environment still readable')
    directives.push('foreground elements may have slight blur for depth')
    directives.push('middle ground in sharp detail')
    directives.push('background elements fade into atmospheric haze')
  } else if (focusPoint === 'environment') {
    // Deep focus for environmental shots
    directives.push('24mm wide-angle lens, f/11 aperture')
    directives.push('deep focus throughout frame')
    directives.push('foreground, midground, and background all in sharp detail')
    directives.push('background sharp and detailed, rich environment')
    directives.push('distant background elements fade into atmospheric haze')
  } else {
    // Balanced: deep/medium DoF, sharp detailed background (no blur)
    directives.push('35mm lens, f/5.6 aperture')
    directives.push('deep focus throughout frame')
    directives.push('foreground, midground, and background all in sharp detail')
    directives.push('background sharp and detailed, rich environment')
    directives.push('character in sharp focus, environment sharp and detailed')
    directives.push('distant background elements fade into atmospheric haze')
  }
  
  // Page-specific variations
  if (pageNumber === 1) {
    directives.push('hero shot with dramatic depth separation')
  } else {
    directives.push('varied depth of field for visual interest')
  }
  
  // Focus plane: balanced/environment – explicit no-blur
  if (focusPoint !== 'character') {
    directives.push('no background blur, environment in sharp detail')
  }
  
  return directives.join(', ')
}

// ============================================================================
// Atmospheric Perspective Directives (NEW: 25 Ocak 2026)
// ============================================================================

/**
 * Generates atmospheric perspective directives for depth
 * Based on 2026 best practices: color desaturation, contrast reduction, haze
 */
export function getAtmosphericPerspectiveDirectives(): string {
  return [
    'atmospheric perspective: distant elements fade into soft mist',
    'background colors become lighter and less saturated with distance',
    'background contrast decreases gradually',
    'foreground sharp and detailed, midground moderately detailed, background atmospheric',
    'atmospheric haze in distant background',
    'horizon line visible with soft transition to sky'
  ].join(', ')
}

// ============================================================================
// Camera Angle Directives (NEW: 25 Ocak 2026)
// ============================================================================

/**
 * Generates camera angle directives for visual variety
 * Based on 2026 best practices: perspective diversity, child's viewpoint
 */
export function getCameraAngleDirectives(
  pageNumber: number,
  previousScenes?: SceneDiversityAnalysis[]
): string {
  // v1.6.0: close-up removed – contradicts "character 25–35%" (plan: Kapak/Close-up/Kıyafet)
  const angles: string[] = [
    'wide shot',
    'medium shot',
    'low-angle view (child\'s perspective)',
    'high-angle view',
    'eye-level view',
    'bird\'s-eye view'
  ]
  
  // Get previous perspectives to avoid repetition
  const previousPerspectives = previousScenes?.map(s => s.perspective) || []
  const lastPerspective = previousPerspectives[previousPerspectives.length - 1]
  
  // Filter out last perspective for variety
  const availableAngles = angles.filter(angle => {
    if (!lastPerspective || lastPerspective === 'unknown') return true
    // Map perspective to angle keywords
    if (lastPerspective === 'wide' && angle.includes('wide')) return false
    if (lastPerspective === 'medium' && angle.includes('medium')) return false
    if (lastPerspective === 'close-up' && angle.includes('close-up')) return false
    if (lastPerspective === 'low-angle' && angle.includes('low-angle')) return false
    if (lastPerspective === 'high-angle' && angle.includes('high-angle')) return false
    if (lastPerspective === 'eye-level' && angle.includes('eye-level')) return false
    if (lastPerspective === 'bird-eye' && angle.includes('bird')) return false
    return true
  })
  
  // Rotate through available angles
  const index = (pageNumber - 1) % availableAngles.length
  const selectedAngle = availableAngles[index] || angles[0]
  
  // Add child's perspective emphasis for children's books
  if (selectedAngle.includes('low-angle')) {
    return `${selectedAngle}, child's eye level, immersive perspective`
  }
  
  return selectedAngle
}

// ============================================================================
// Character-Environment Ratio Directives (NEW: 25 Ocak 2026)
// ============================================================================

/**
 * Generates character-environment ratio directives for balanced composition
 * Based on 2026 best practices: 25-35% character, 65-75% environment (v1.4.0)
 */
export function getCharacterEnvironmentRatio(): string {
  return [
    'character occupies 25-35% of frame, environment 65-75%',
    'character must NOT exceed 35% of frame',
    'wider shot, character smaller in frame',
    'character must not occupy more than half the frame',
    'wide environmental context, character integrated into scene',
    'expansive background with sky, trees, landscape visible',
    'character not dominating frame, balanced with surroundings',
    'environment sharp and detailed, not blurred',
    'environment provides depth and atmosphere, character is part of the scene'
  ].join(', ')
}

// ============================================================================
// FOREGROUND/MIDGROUND/BACKGROUND LAYER SYSTEM (NEW: 15 Ocak 2026)
// ============================================================================

/**
 * Generates layered composition instructions (ENHANCED: 25 Ocak 2026)
 * Ensures proper depth and visual hierarchy with depth of field and atmospheric perspective
 */
export function generateLayeredComposition(
  sceneInput: SceneInput,
  characterAction: string,
  environment: string
): string {
  const layers: string[] = []
  
  // FOREGROUND - Character and immediate elements with depth of field
  layers.push(`FOREGROUND: ${characterAction}, main character in sharp focus with detailed features visible`)
  layers.push('foreground elements may have slight blur (foreground bokeh) for depth')
  
  // MIDGROUND - Story elements and context
  if (sceneInput.sceneDescription && sceneInput.sceneDescription.length > 20) {
    // Extract key elements from scene description
    layers.push(`MIDGROUND: ${sceneInput.sceneDescription}, in sharp detail`)
  } else {
    layers.push(`MIDGROUND: story elements and contextual objects related to the scene, in sharp detail`)
  }
  
  // BACKGROUND - Environment and atmosphere; sharp detail, rich environment
  layers.push(`BACKGROUND: ${environment}, providing depth and atmosphere`)
  layers.push('midground and near background in sharp detail, rich environment')
  layers.push('distant background elements fade into soft mist with atmospheric perspective')
  layers.push('background colors become lighter and less saturated with distance')
  
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
// Builder Functions for Prompt Sections (v1.7.0: Refactor - Modülerleştirme)
// ============================================================================

/**
 * Build cover directives for book cover generation
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildCoverDirectives(additionalCharactersCount: number): string[] {
  const charCount = additionalCharactersCount + 1
  return [
    `COVER: Reference for all pages. Match reference photos exactly (hair/eyes/skin/features). All ${charCount} characters prominent. Professional, print-ready. Adults have adult proportions.`,
    'Cover = poster for the entire book; suggest key locations, theme, and journey in one image.',
    'Epic wide or panoramic composition; character(s) as guides into the world, environment shows the world of the story.',
    'Eye-catching, poster-like, movie-poster quality. Reserve clear space for title at top.',
    'Dramatic lighting (e.g. golden hour, sun rays through clouds) where it fits the theme.',
    'Cover: epic wide; character max 30-35% of frame; environment-dominant.',
    'Cover composition and camera must be distinctly different from the first interior page.'
  ]
}

/**
 * Build first interior page directives
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildFirstInteriorPageDirectives(additionalCharactersCount: number): string[] {
  const charNote = additionalCharactersCount > 0 ? `All ${additionalCharactersCount + 1} characters prominent` : 'Character integrated into scene'
  return [
    'FIRST INTERIOR PAGE: Must be distinctly different from the book cover. Use a different camera angle (e.g. cover = medium/portrait, page 1 = wide or low-angle), different composition (e.g. rule of thirds, character off-center), and/or expanded scene detail. Do not repeat the same framing as the cover.',
    'Character smaller in frame, NOT centered; use rule of thirds or leading lines (e.g. path).',
    `Book interior illustration (flat, standalone, NOT 3D mockup). ${charNote}. No text/writing.`
  ]
}

/**
 * Build clothing directives based on context
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildClothingDirectives(
  clothing: string | undefined,
  theme: string,
  isCover: boolean,
  useCoverReference: boolean
): string {
  const themeClothing = getThemeAppropriateClothing(theme)
  const clothingDesc = clothing?.trim() || themeClothing
  
  if (isCover) {
    return `Clothing: ${clothingDesc} (reference for all pages). No formal wear. Match story/scene.`
  } else if (useCoverReference) {
    return 'Clothing: Match cover exactly. No formal wear.'
  } else {
    return `Clothing: ${clothingDesc}. No formal wear. Match story/scene.`
  }
}

/**
 * Build multiple characters directives
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildMultipleCharactersDirectives(additionalCharactersCount: number): string[] {
  const totalCharacters = additionalCharactersCount + 1
  return [
    `${totalCharacters} characters in the scene: main character and ${additionalCharactersCount} companion(s)`,
    `all ${totalCharacters} characters should be visible and clearly identifiable`,
    'group composition, balanced arrangement of characters'
  ]
}

/**
 * Build cover reference consistency directives
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildCoverReferenceConsistencyDirectives(additionalCharactersCount: number): string {
  const charNote = additionalCharactersCount > 0 ? `All ${additionalCharactersCount + 1} characters` : 'Character'
  return `${charNote} match cover image exactly (hair/eyes/skin/features). Only clothing/pose vary.`
}

/**
 * Build character consistency directives
 * v1.7.0: Consolidates all character consistency directives from multiple locations
 */
function buildCharacterConsistencyDirectives(): string[] {
  return [
    'consistent character design, same character as previous pages',
    'character must match reference photo exactly, same features on every page',
    'Illustration style (NOT photorealistic). Match reference features.'
  ]
}

/**
 * Build style directives
 * v1.7.0: Consolidates all style directives from multiple locations
 */
function buildStyleDirectives(illustrationStyle: string): string[] {
  const styleDesc = getStyleDescription(illustrationStyle)
  return [
    `${styleDesc} illustration, cinematic quality`,
    `ILLUSTRATION STYLE: ${styleDesc}`,
    'Illustration style (NOT photorealistic). Match reference features.'
  ]
}

// ============================================================================
// Section Builder Functions (v1.7.0: Faz 3 - Prompt Bölümlerini Organize Et)
// ============================================================================

/**
 * Build anatomical and safety section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildAnatomicalAndSafetySection(ageGroup: string): string[] {
  const parts: string[] = []
  
  // Anatomical correctness
  const anatomicalDirectives = getAnatomicalCorrectnessDirectives()
  parts.push(anatomicalDirectives)
  
  // Safe hand poses
  const safeHandPoses = getSafeHandPoses()
  parts.push('[SAFE_POSES]')
  parts.push('Preferred hand poses: ' + safeHandPoses.join(', '))
  parts.push('[/SAFE_POSES]')
  parts.push('') // Empty line for separation
  
  return parts
}

/**
 * Build composition and depth section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildCompositionAndDepthSection(pageNumber: number, focusPoint: string): string[] {
  const parts: string[] = []
  
  const depthOfField = getDepthOfFieldDirectives(pageNumber, focusPoint)
  parts.push('[COMPOSITION_DEPTH]')
  parts.push(depthOfField)
  const atmosphericPerspective = getAtmosphericPerspectiveDirectives()
  parts.push(atmosphericPerspective)
  parts.push('[/COMPOSITION_DEPTH]')
  parts.push('') // Empty line for separation
  
  return parts
}

/**
 * Build lighting and atmosphere section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildLightingAndAtmosphereSection(timeOfDay: string | undefined, mood: string): string[] {
  const parts: string[] = []
  
  if (timeOfDay) {
    const enhancedLighting = getLightingDescription(timeOfDay, mood)
    parts.push('[LIGHTING_ATMOSPHERE]')
    parts.push(enhancedLighting)
    parts.push('[/LIGHTING_ATMOSPHERE]')
    parts.push('') // Empty line for separation
  }
  
  return parts
}

/**
 * Build camera and perspective section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildCameraAndPerspectiveSection(
  pageNumber: number,
  focusPoint: string,
  previousScenes?: SceneDiversityAnalysis[]
): string[] {
  const parts: string[] = []
  
  const cameraAngle = getCameraAngleDirectives(pageNumber, previousScenes)
  parts.push('[CAMERA_PERSPECTIVE]')
  parts.push(cameraAngle)
  const compositionRules = getCompositionRules(focusPoint, pageNumber, previousScenes)
  parts.push(compositionRules)
  parts.push('[/CAMERA_PERSPECTIVE]')
  parts.push('') // Empty line for separation
  
  return parts
}

/**
 * Build character-environment ratio section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildCharacterEnvironmentRatioSection(): string[] {
  const parts: string[] = []
  
  const characterRatio = getCharacterEnvironmentRatio()
  parts.push('[CHARACTER_ENVIRONMENT_RATIO]')
  parts.push(characterRatio)
  parts.push('[/CHARACTER_ENVIRONMENT_RATIO]')
  parts.push('') // Empty line for separation
  
  return parts
}

/**
 * Build style section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildStyleSection(illustrationStyle: string): string[] {
  const parts: string[] = []
  
  const styleDirectives = buildStyleDirectives(illustrationStyle)
  parts.push(styleDirectives[1]) // Second style directive: `ILLUSTRATION STYLE: ${styleDesc}`
  
  return parts
}

/**
 * Build scene content section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildSceneContentSection(scenePrompt: string, layeredComp: string, ageRules: string[]): string[] {
  const parts: string[] = []
  
  parts.push(layeredComp)
  parts.push(scenePrompt)
  parts.push(ageRules.join(', '))
  
  return parts
}

/**
 * Build special page directives section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildSpecialPageDirectives(
  pageNumber: number,
  isCover: boolean,
  useCoverReference: boolean,
  additionalCharactersCount: number,
  sceneInput: SceneInput
): string[] {
  const parts: string[] = []
  
  // Multiple characters note
  if (additionalCharactersCount > 0) {
    parts.push(...buildMultipleCharactersDirectives(additionalCharactersCount))
  }
  
  // Cover generation
  if (isCover) {
    parts.push(...buildCoverDirectives(additionalCharactersCount))
  }
  
  // Cover reference consistency
  if (useCoverReference) {
    parts.push(buildCoverReferenceConsistencyDirectives(additionalCharactersCount))
  }
  
  // First interior page
  if (sceneInput.pageNumber === 1 && !isCover) {
    parts.push(...buildFirstInteriorPageDirectives(additionalCharactersCount))
  }
  
  return parts
}

/**
 * Build character consistency section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildCharacterConsistencySection(illustrationStyle: string): string[] {
  const parts: string[] = []
  
  const styleDirectives = buildStyleDirectives(illustrationStyle)
  parts.push(styleDirectives[2]) // Third style directive
  const charConsistency = buildCharacterConsistencyDirectives()
  parts.push(charConsistency[2]) // Third consistency directive
  
  return parts
}

/**
 * Build scene diversity section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildSceneDiversitySection(isCover: boolean, previousScenes?: SceneDiversityAnalysis[]): string[] {
  const parts: string[] = []
  
  if (!isCover && previousScenes && previousScenes.length > 0) {
    const lastScene = previousScenes[previousScenes.length - 1]
    const diversityDirectives = getSceneDiversityDirectives(lastScene)
    if (diversityDirectives) {
      parts.push('')
      parts.push(diversityDirectives)
    }
  }
  
  return parts
}

/**
 * Build clothing section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildClothingSection(
  clothing: string | undefined,
  theme: string,
  isCover: boolean,
  useCoverReference: boolean
): string[] {
  const parts: string[] = []
  
  parts.push(buildClothingDirectives(clothing, theme, isCover, useCoverReference))
  
  return parts
}

/**
 * Build final directives section
 * v1.7.0: Extracted from generateFullPagePrompt for modularity
 */
function buildFinalDirectives(): string[] {
  return ['No text/writing in image.']
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

  // Start building prompt parts - v1.7.0: Using section builder functions
  const promptParts: string[] = []

  // 1. Anatomical & Safety Section
  promptParts.push(...buildAnatomicalAndSafetySection(ageGroup))

  // 2. Composition & Depth Section
  promptParts.push(...buildCompositionAndDepthSection(sceneInput.pageNumber, sceneInput.focusPoint))

  // 3. Lighting & Atmosphere Section
  promptParts.push(...buildLightingAndAtmosphereSection(sceneInput.timeOfDay, sceneInput.mood))

  // 4. Camera & Perspective Section
  promptParts.push(...buildCameraAndPerspectiveSection(sceneInput.pageNumber, sceneInput.focusPoint, previousScenes))

  // 5. Character-Environment Ratio Section
  promptParts.push(...buildCharacterEnvironmentRatioSection())

  // 6. Style Section
  promptParts.push(...buildStyleSection(illustrationStyle))

  // 7. Scene Content Section
  promptParts.push(...buildSceneContentSection(scenePrompt, layeredComp, ageRules))

  // 8. Special Page Directives Section
  promptParts.push(...buildSpecialPageDirectives(
    sceneInput.pageNumber,
    isCover,
    useCoverReference,
    additionalCharactersCount,
    sceneInput
  ))

  // 9. Character Consistency Section
  promptParts.push(...buildCharacterConsistencySection(illustrationStyle))

  // 10. Scene Diversity Section
  promptParts.push(...buildSceneDiversitySection(isCover, previousScenes))

  // 11. Clothing Section
  promptParts.push(...buildClothingSection(sceneInput.clothing, sceneInput.theme, isCover, useCoverReference))

  // 12. Final Directives Section
  promptParts.push(...buildFinalDirectives())
  
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
  // v1.6.0: close-up removed – contradicts "character 25–35%" (plan: Kapak/Close-up/Kıyafet)
  const perspectives: SceneDiversityAnalysis['perspective'][] = [
    'wide', 'medium', 'bird-eye', 'low-angle', 'high-angle', 'eye-level'
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
  // NEW: Composition and depth functions (25 Ocak 2026)
  getDepthOfFieldDirectives,
  getAtmosphericPerspectiveDirectives,
  getCameraAngleDirectives,
  getCharacterEnvironmentRatio,
}

