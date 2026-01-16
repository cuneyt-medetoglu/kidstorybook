import type { PromptVersion } from '../../types'
import { getStyleDescription, is3DAnimationStyle, get3DAnimationNotes } from './style-descriptions'
import { getAnatomicalCorrectnessDirectives } from './negative'

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
  version: '1.0.1',
  releaseDate: new Date('2026-01-16'),
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
interface EnvironmentVariants {
  general: string
  detailed: string
  cinematic: string
}

const ENVIRONMENT_TEMPLATES: Record<string, EnvironmentVariants[]> = {
  adventure: [
    {
      general: 'lush forest',
      detailed: 'lush forest with tall oak and pine trees, dappled sunlight filtering through leaves',
      cinematic: 'lush forest with tall oak and pine trees, dappled sunlight filtering through leaves creating dancing shadows on the mossy ground, wildflowers (daisies, violets, buttercups) dotting the forest floor, gentle breeze rustling the canopy, birds chirping in the distance'
    },
    {
      general: 'mountain path',
      detailed: 'winding mountain path with colorful wildflowers and distant peaks',
      cinematic: 'winding mountain path lined with purple lupines and yellow wildflowers, dramatic mountain peaks visible in the distance against blue sky, scattered rocks and pine trees framing the path, clear mountain air, sense of adventure and exploration'
    },
    {
      general: 'sunny beach',
      detailed: 'sunny beach with gentle waves, smooth sand, and seashells',
      cinematic: 'sunny beach with turquoise gentle waves lapping at smooth golden sand, scattered colorful seashells and smooth pebbles, palm trees swaying in ocean breeze, fluffy white clouds in bright blue sky, warm sunlight creating sparkles on water'
    },
  ],
  sports: [
    {
      general: 'sunny playground',
      detailed: 'sunny playground with colorful equipment, soft grass, and happy atmosphere',
      cinematic: 'sunny playground with red and blue play structures, bright yellow slides, soft green grass, children\'s laughter in the air, colorful flags or banners waving, clear blue sky with puffy clouds, warm afternoon sunlight'
    },
    {
      general: 'sports field',
      detailed: 'sports field with bright cones, goal posts, and friends playing',
      cinematic: 'sports field with vibrant orange cones marking boundaries, white goal posts against green grass, other children playing in background, clear field markings, sunny day with soft shadows, energetic and active atmosphere'
    },
  ],
  fantasy: [
    {
      general: 'magical garden',
      detailed: 'magical garden with glowing flowers, sparkling lights, and enchanted atmosphere',
      cinematic: 'magical garden with luminescent flowers in purple, blue, and pink hues, soft golden fairy lights floating in the air, mystical mist near the ground, ancient stone archways covered in flowering vines, magical atmosphere with gentle glow, sense of wonder and enchantment'
    },
    {
      general: 'enchanted forest',
      detailed: 'enchanted forest with sparkling lights, unusual plants, and magical creatures',
      cinematic: 'enchanted forest with towering trees wrapped in glowing vines, bioluminescent mushrooms dotting the forest floor, soft magical lights dancing between branches, unusual colorful flowers that seem to glow, mystical fog creating depth, fairy-tale atmosphere'
    },
  ],
  animals: [
    {
      general: 'friendly farm',
      detailed: 'friendly farm with red barn, green fields, and happy animals',
      cinematic: 'friendly farm with classic red barn and white fence, rolling green fields with grazing animals, hay bales scattered around, blue sky with fluffy clouds, golden sunlight warming the scene, peaceful rural atmosphere, wildflowers along fence line'
    },
    {
      general: 'forest clearing',
      detailed: 'forest clearing where animals gather, surrounded by trees and nature',
      cinematic: 'peaceful forest clearing with soft grass and colorful wildflowers, surrounded by tall trees forming natural circle, dappled sunlight creating warm spots on ground, small stream or pond reflecting sky, birds in trees, butterflies fluttering, serene natural sanctuary'
    },
  ],
  'daily-life': [
    {
      general: 'cozy home interior',
      detailed: 'warm and cozy home interior with comfortable furniture and homey details',
      cinematic: 'warm and inviting home interior with soft couch, colorful throw pillows, family photos on walls, potted plants on windowsill, warm natural light streaming through curtains, wooden floor with colorful rug, cozy and safe atmosphere'
    },
    {
      general: 'cheerful classroom',
      detailed: 'bright classroom with colorful decorations, learning materials, and student artwork',
      cinematic: 'cheerful classroom with alphabet posters on walls, colorful student artwork displays, bright educational materials, wooden desks and chairs, large windows with sunlight, bookshelf filled with colorful books, globe and teaching aids, welcoming learning environment'
    },
  ],
  space: [
    {
      general: 'space station',
      detailed: 'colorful space station with large windows showing stars and planets',
      cinematic: 'futuristic space station interior with large curved windows revealing spectacular star field and colorful planets, control panels with blinking lights, metallic surfaces reflecting soft blue and purple lights, sense of wonder and exploration, Earth or moon visible in distance'
    },
    {
      general: 'alien planet',
      detailed: 'alien planet with unique plants, strange rocks, and colorful sky',
      cinematic: 'alien planet landscape with unusual crystalline plants in purple and teal colors, strange rock formations, twin moons in colorful sky with pink and orange hues, bioluminescent vegetation, sense of discovery and wonder, safe but exotic atmosphere'
    },
  ],
  underwater: [
    {
      general: 'coral reef',
      detailed: 'vibrant coral reef with colorful fish, swaying plants, and clear water',
      cinematic: 'vibrant coral reef in pink, orange, and purple colors, schools of tropical fish (yellow, blue, striped) swimming gracefully, sea anemones swaying gently, seaweed dancing in current, sun rays penetrating crystal clear blue water creating light patterns, peaceful underwater paradise'
    },
    {
      general: 'underwater cave',
      detailed: 'underwater cave with bioluminescent plants, interesting rocks, and gentle light',
      cinematic: 'mysterious underwater cave with bioluminescent plants glowing soft blue and green, smooth rocks covered in colorful algae, shafts of sunlight penetrating from above creating magical light beams, small friendly fish swimming by, sense of peaceful exploration and discovery'
    },
  ],
}

function getEnvironmentDescription(theme: string, sceneDesc: string): string {
  const t = (theme || '').toString().trim().toLowerCase()
  const normalizedTheme =
    t === 'sports&activities' || t === 'sports_activities' || t === 'sports-activities'
      ? 'sports'
      : t

  // If scene description is detailed enough, use it
  if (sceneDesc && sceneDesc.length > 50) {
    return sceneDesc
  }
  
  // Get environment templates for theme
  const themeTemplates = ENVIRONMENT_TEMPLATES[normalizedTheme] || ENVIRONMENT_TEMPLATES['adventure']
  const template = themeTemplates[0] // Use first variant (can be randomized later)
  
  // Return CINEMATIC level for best quality (matching Magical Children's Book examples)
  return template.cinematic
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
// Cinematic Elements (NEW: 15 Ocak 2026)
// ============================================================================

/**
 * Generates cinematic composition elements for high-quality illustrations
 * Inspired by Magical Children's Book quality standards
 */
export function getCinematicElements(pageNumber: number, mood: string): string {
  const elements: string[] = []
  
  // Depth and layers
  elements.push('clear foreground, midground, and background layers')
  elements.push('depth of field with atmospheric perspective')
  elements.push('sense of three-dimensional space')
  
  // Composition
  elements.push('rule of thirds composition')
  elements.push('balanced visual weight')
  elements.push('dynamic framing')
  
  // Lighting (mood-based)
  if (mood === 'exciting' || mood === 'adventurous') {
    elements.push('dynamic lighting with highlights and shadows')
    elements.push('dramatic light rays or sun beams')
  } else if (mood === 'calm' || mood === 'peaceful') {
    elements.push('soft ambient lighting')
    elements.push('gentle diffused light')
  } else if (mood === 'mysterious') {
    elements.push('atmospheric lighting with soft glow')
    elements.push('subtle light sources creating mood')
  } else {
    elements.push('warm natural lighting')
    elements.push('soft shadows for depth')
  }
  
  // Camera angle
  if (pageNumber === 1) {
    elements.push('hero shot, medium-wide angle showing character prominently')
  } else {
    elements.push('varied perspective for visual interest')
    elements.push('camera angle that enhances the story moment')
  }
  
  // Cinematic quality
  elements.push('cinematic quality composition')
  elements.push('professional children\'s book illustration aesthetic')
  
  return elements.join(', ')
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
// Theme-Appropriate Clothing (NEW: 15 Ocak 2026)
// ============================================================================

/**
 * Returns theme-appropriate clothing description
 * Ensures clothing matches story theme (camping → casual outdoor, NOT formal)
 */
function getThemeAppropriateClothing(theme: string): string {
  const t = (theme || '').toString().trim().toLowerCase()
  const normalizedTheme =
    t === 'sports&activities' || t === 'sports_activities' || t === 'sports-activities'
      ? 'sports'
      : t

  const clothingStyles: Record<string, string> = {
    adventure: 'comfortable outdoor clothing (casual pants/shorts, t-shirts, sneakers, outdoor gear)',
    sports: 'sportswear (athletic clothes, sports shoes, comfortable activewear)',
    fantasy: 'fantasy-appropriate casual clothing (adventure-style, not formal)',
    animals: 'casual comfortable clothing for nature/outdoors (jeans, t-shirts, casual shoes)',
    'daily-life': 'everyday casual clothing (normal kids clothes, casual outfits)',
    space: 'space/exploration-appropriate clothing (casual futuristic style, comfortable adventure clothes)',
    underwater: 'swimwear or beach-appropriate clothing (swimsuit, beach clothes, casual summer wear)',
  }

  return clothingStyles[normalizedTheme] || 'age-appropriate casual clothing'
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
    '3d_animation': 'STYLE-SPECIFIC DIRECTIVES FOR 3D ANIMATION (PIXAR STYLE): Pixar-style 3D animation (like Toy Story, Finding Nemo, Inside Out), cartoonish and stylized (NOT photorealistic), rounded shapes, exaggerated features, vibrant saturated colors, soft shadows, realistic textures, children\'s animated movie aesthetic, Pixar animation quality and visual style',
    
    'geometric': 'STYLE-SPECIFIC DIRECTIVES FOR GEOMETRIC: Simplified geometric shapes (circles, squares, triangles), flat colors with no gradients, sharp distinct edges, minimal detail, modern stylized, grid-based alignment, clean lines, illustration style',
    
    'watercolor': 'STYLE-SPECIFIC DIRECTIVES FOR WATERCOLOR: Transparent watercolor technique, visible soft brushstrokes, colors blend and bleed at edges, paper texture visible through paint, luminous glowing finish, wet-on-wet color mixing, soft flowing edges, warm inviting atmosphere',
    
    'block_world': 'STYLE-SPECIFIC DIRECTIVES FOR BLOCK WORLD: Pixelated/blocky aesthetic, visible blocks/cubes, Minecraft-like construction, characters and environment built from geometric blocks, sharp edges, limited color palette, isometric or orthographic perspective',
    
    'collage': 'STYLE-SPECIFIC DIRECTIVES FOR COLLAGE: Cut-out pieces with visible rough edges, distinct layers with varied textures, torn edges showing paper texture, mixed media feel, visible shadows between layers, vibrant colors, handcrafted appearance',
    
    'clay_animation': 'STYLE-SPECIFIC DIRECTIVES FOR CLAY ANIMATION: Clay-like appearance, visible fingerprints and tool marks, soft organic texture, matte finish, slightly lumpy surfaces, hand-molded look, soft rounded shadows, stop-motion aesthetic',
    
    'kawaii': 'STYLE-SPECIFIC DIRECTIVES FOR KAWAII: Character must have oversized head (1:2 or 1:3 head-to-body ratio), large sparkling eyes with star highlights, tiny dot-like nose, small mouth, soft rounded cheeks, pastel color palette (baby pink, sky blue, mint green, lavender), blush marks on cheeks, decorative hearts/stars/sparkles, exaggerated cuteness',
    
    'comic_book': 'STYLE-SPECIFIC DIRECTIVES FOR COMIC BOOK: Bold thick black outlines around all elements, flat color fills with no gradients, dramatic angular shadows with sharp edges, high contrast between light and dark, halftone dot texture for shadows, simplified graphic style, dynamic poses',
    
    'sticker_art': 'STYLE-SPECIFIC DIRECTIVES FOR STICKER ART: Clean bold uniform lines, bright highly saturated colors, glossy graphic look with specular highlights, white border effect (like real sticker), simple cell shading, flat fills with minimal gradients, polished graphic appearance',
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
  useCoverReference: boolean = false // NEW: Pages 2-10 için cover reference
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
  
  // ============================================================================
  // COVER GENERATION - CRITICAL QUALITY REQUIREMENTS
  // ============================================================================
  if (isCover) {
    promptParts.push('') // Empty line for emphasis
    promptParts.push('CRITICAL COVER QUALITY REQUIREMENTS:')
    promptParts.push('This cover will be used as reference for ALL subsequent pages (pages 2-10)')
    promptParts.push('Cover quality is EXTREMELY IMPORTANT - it determines character consistency across entire book')
    promptParts.push('')
    promptParts.push('ALL CHARACTERS MUST BE PROMINENTLY FEATURED IN COVER:')
    promptParts.push('Each character must match their reference photo EXACTLY:')
    promptParts.push('- Hair color, style, length, and texture must match reference photo PRECISELY')
    promptParts.push('- Eye color must match reference photo EXACTLY')
    promptParts.push('- Facial features must match reference photo EXACTLY')
    promptParts.push('- Skin tone must match reference photo EXACTLY')
    promptParts.push('- Body proportions must match reference photo EXACTLY')
    promptParts.push('')
    promptParts.push('COVER COMPOSITION:')
    if (additionalCharactersCount > 0) {
      promptParts.push(`ALL ${additionalCharactersCount + 1} characters must be visible and prominently featured`)
      promptParts.push('Group composition with balanced arrangement of all characters')
      promptParts.push('Each character must be clearly identifiable and match their reference photo')
    } else {
      promptParts.push('Main character must be prominently featured and clearly identifiable')
    }
    promptParts.push('Professional, print-ready, high-quality illustration')
    promptParts.push('This cover image will be the reference for ALL pages 2-10')
    promptParts.push('')
  }
  
  // ============================================================================
  // COVER REFERENCE CONSISTENCY (Pages 2-10)
  // ============================================================================
  if (useCoverReference) {
    promptParts.push('') // Empty line for emphasis
    promptParts.push('CRITICAL COVER REFERENCE CONSISTENCY:')
    promptParts.push('ALL characters must look EXACTLY like in cover image (last reference image)')
    promptParts.push('The cover image shows how ALL characters should appear throughout the book')
    promptParts.push('')
    promptParts.push('Match ALL features from cover for EACH character:')
    promptParts.push('- Main character: Match cover image exactly (hair style, length, color, eye color, facial features, skin tone)')
    if (additionalCharactersCount > 0) {
      promptParts.push(`- Additional characters (${additionalCharactersCount}): Each must match their appearance in cover image exactly`)
    }
    promptParts.push('- Only clothing and pose can change - ALL character features MUST stay identical to cover')
    promptParts.push('')
    promptParts.push('CRITICAL: Cover image shows ALL characters - use it as primary reference for character consistency')
    promptParts.push('')
  }
  
  // Special instructions for Page 1 (Book Cover) - Legacy support
  if (sceneInput.pageNumber === 1 && !isCover) {
    promptParts.push('BOOK COVER ILLUSTRATION (NOT a book mockup, NOT a 3D book object, NOT a book on a shelf)')
    promptParts.push('FLAT, STANDALONE ILLUSTRATION that can be used as a book cover')
    
    if (additionalCharactersCount > 0) {
      promptParts.push(`all ${additionalCharactersCount + 1} characters prominently featured`)
    } else {
      promptParts.push('main character prominently featured in center or foreground')
    }
    promptParts.push('visually striking, colorful, and appealing to children')
    promptParts.push('professional and print-ready')
    promptParts.push('NO TEXT, NO WRITING, NO LETTERS, NO WORDS in the image - text will be added separately as a separate layer')
  }
  
  // STYLE-SPECIFIC DIRECTIVES (NEW: Illustration Style İyileştirmesi - Güçlü Vurgu)
  const styleDirectives = getStyleSpecificDirectives(illustrationStyle)
  if (styleDirectives) {
    // Stil direktiflerini ortada tekrar vurgula (zaten generateScenePrompt içinde var ama burada da ekle)
    promptParts.push(styleDirectives)
  }
  
  // 3D Animation style special notes
  if (is3DAnimationStyle(illustrationStyle)) {
    promptParts.push(get3DAnimationNotes())
  }
  
  // Additional character consistency emphasis
  promptParts.push('character must RESEMBLE the child in the reference photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering')
  promptParts.push('character should look like a stylized illustration that captures the child\'s features but in the chosen illustration style')
  promptParts.push('clearly an illustration, not a photograph')
  
  // CLOTHING CONSISTENCY & THEME APPROPRIATENESS (ENHANCED: 15 Ocak 2026, 16 Ocak 2026)
  const themeClothingStyle = getThemeAppropriateClothing(sceneInput.theme)
  if (isCover) {
    // Cover: Use theme-appropriate clothing - THIS WILL BE USED AS REFERENCE FOR ALL PAGES
    promptParts.push(`CHARACTER CLOTHING (COVER - CRITICAL): Character must wear ${themeClothingStyle} - appropriate for ${sceneInput.theme} theme`)
    promptParts.push('CRITICAL: The clothing shown in this cover will be used as reference for ALL subsequent pages (pages 2-10)')
    promptParts.push('CRITICAL: Maintain exact same outfit (colors, style, details) throughout the entire book')
    promptParts.push('DO NOT use formal wear (suits, ties, dress shoes, formal dresses) unless explicitly required by story')
    promptParts.push('Clothing must match the theme and setting (e.g., camping → casual outdoor clothes, sports → sportswear)')
  } else if (useCoverReference) {
    // Pages 2-10: Use EXACT SAME clothing as cover (cover reference shows the clothing)
    promptParts.push(`CHARACTER CLOTHING CONSISTENCY (CRITICAL): Character must wear the EXACT SAME clothing as shown in cover image (last reference image)`)
    promptParts.push('CRITICAL: Match cover clothing EXACTLY - same colors, same style, same details')
    promptParts.push('CRITICAL: Cover image shows the clothing that must be used throughout the entire book')
    promptParts.push('ONLY change clothing if story text EXPLICITLY mentions a change (e.g., "changed into pajamas", "put on jacket")')
    promptParts.push('If story does NOT mention clothing change, use EXACT SAME outfit as cover')
    promptParts.push('DO NOT use formal wear - keep clothing theme-appropriate and casual')
  } else if (sceneInput.pageNumber === 1) {
    // First page (legacy - not cover): Use theme-appropriate clothing
    promptParts.push(`CHARACTER CLOTHING: Character must wear ${themeClothingStyle} - appropriate for ${sceneInput.theme} theme`)
    promptParts.push('DO NOT use formal wear (suits, ties, dress shoes, formal dresses) unless explicitly required by story')
    promptParts.push('Clothing must match the theme and setting (e.g., camping → casual outdoor clothes, sports → sportswear)')
  } else {
    // Subsequent pages (legacy - no cover reference): Maintain consistency AND theme-appropriateness
    promptParts.push(`CHARACTER CLOTHING CONSISTENCY: Character must wear the SAME clothing as previous pages, maintaining ${themeClothingStyle}`)
    promptParts.push('Only change clothing if story specifically mentions it (e.g., "changed into pajamas", "put on jacket")')
    promptParts.push('Maintain exact same outfit (colors, style, details) throughout story unless explicitly changed in narrative')
    promptParts.push('DO NOT use formal wear - keep clothing theme-appropriate and casual')
  }
  
  // ANATOMICAL CORRECTNESS - Already added at the beginning of the prompt for maximum emphasis
  // (Previously was here at the end - moved to line ~598 for research-backed prompt order optimization)
  
  // CRITICAL: No text in images
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
  getStyleSpecificDirectives,
}

