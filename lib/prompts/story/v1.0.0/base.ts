import type { StoryGenerationInput, StoryGenerationOutput, PromptVersion } from '../../types'

/**
 * Story Generation Prompt - Version 1.0.0
 * 
 * Initial version focused on:
 * - Age-appropriate content
 * - Safety (no scary/inappropriate content)
 * - Educational value
 * - Clear structure for AI
 * - Detailed image prompts
 */

export const VERSION: PromptVersion = {
  version: '1.0.0',
  releaseDate: new Date('2026-01-10'),
  status: 'active',
  changelog: [
    'Initial release',
    'Age-appropriate content rules',
    'Safety filters implemented',
    'Educational themes integrated',
    'Image prompt generation included',
    '8 language support added (tr, en, de, fr, es, zh, pt, ru) - 24 Ocak 2026',
    'Strong language enforcement directives added - 24 Ocak 2026',
    'Language mixing prevention (no English words in non-English stories) - 24 Ocak 2026',
    'Final language check mechanism added - 24 Ocak 2026',
  ],
  author: '@prompt-manager',
}

export function generateStoryPrompt(input: StoryGenerationInput): string {
  const {
    characterName,
    characterAge,
    characterGender,
    theme,
    illustrationStyle,
    customRequests,
    pageCount, // Debug: Optional page count override
    referencePhotoAnalysis, // Optional: kept for backward compatibility, but not required
    language = 'en',
    // New: Direct character features from Step 1 (optional)
    hairColor,
    eyeColor,
    specialFeatures,
    // NEW: Multiple characters support
    characters,
  } = input

  // Get age-appropriate rules
  const ageGroup = getAgeGroup(characterAge)
  const safetyRules = getSafetyRules(ageGroup)
  const themeConfig = getThemeConfig(theme)

  // Build character description (use Step 1 data if available, otherwise use analysis)
  let characterDesc = buildCharacterDescription(
    characterName,
    characterAge,
    characterGender,
    referencePhotoAnalysis, // Optional: for backward compatibility
    { hairColor, eyeColor, specialFeatures } // Step 1 data
  )

  // Add additional characters if present
  if (characters && characters.length > 1) {
    characterDesc += `\n\nADDITIONAL CHARACTERS:\n`
    
    characters.slice(1).forEach((char, index) => {
      characterDesc += `\n${index + 2}. ${char.type.displayName} (${char.type.group})`
      
      if (char.type.group === "Pets") {
        characterDesc += ` - A friendly ${char.type.value.toLowerCase()}`
        if (char.type.displayName !== char.type.value) {
          characterDesc += ` (${char.type.displayName})`
        }
      } else if (char.type.group === "Family Members") {
        characterDesc += ` - ${characterName}'s ${char.type.value.toLowerCase()}`
        if (char.type.displayName !== char.type.value) {
          characterDesc += ` (${char.type.displayName})`
        }
      } else {
        // Other
        characterDesc += ` - ${char.name || char.type.displayName}`
      }
    })
    
    characterDesc += `\n\n**IMPORTANT:** All ${characters.length} characters should appear in the story. The main character is ${characterName}.`
  }

  // Main prompt
  const prompt = `
You are a professional children's book author. Create a magical, age-appropriate story.

# CHARACTER${characters && characters.length > 1 ? 'S' : ''}
${characterDesc}

# STORY REQUIREMENTS
- Theme: ${themeConfig.name} (${themeConfig.mood} mood)
- Target Age: ${characterAge} years old (${ageGroup} age group)
- Story Length: EXACTLY ${getPageCount(ageGroup, pageCount)} pages (CRITICAL: You MUST return exactly ${getPageCount(ageGroup, pageCount)} pages, no more, no less)
- Language: ${getLanguageName(language)}
- Illustration Style: ${illustrationStyle}
- Special Requests: ${customRequests || 'None'}

# CRITICAL - LANGUAGE REQUIREMENT (MANDATORY - NO EXCEPTIONS)
**YOU MUST WRITE THE ENTIRE STORY IN ${getLanguageName(language).toUpperCase()} ONLY.**

- **ONLY use ${getLanguageName(language)} words and sentences**
- **DO NOT use ANY English words, phrases, or sentences**
- **DO NOT mix languages - use ${getLanguageName(language)} exclusively**
- **Every single word in the story text MUST be in ${getLanguageName(language)}**
- **Character names can remain as provided, but all dialogue and narration MUST be in ${getLanguageName(language)}**
- **If you use any English words, the story will be REJECTED**

**Examples of what is FORBIDDEN:**
- Using English words like "hello", "yes", "no", "okay", "good", "bad", "happy", "sad" in a ${getLanguageName(language)} story
- Mixing languages: "Merhaba hello" or "Güzel good"
- Using English phrases or expressions

**Examples of what is CORRECT:**
- If language is Turkish: Use ONLY Turkish words like "merhaba", "evet", "hayır", "güzel", "mutlu", "üzgün"
- If language is German: Use ONLY German words like "hallo", "ja", "nein", "schön", "glücklich", "traurig"
- If language is French: Use ONLY French words like "bonjour", "oui", "non", "beau", "heureux", "triste"
- If language is Spanish: Use ONLY Spanish words like "hola", "sí", "no", "hermoso", "feliz", "triste"
- If language is Chinese: Use ONLY Chinese characters and words
- If language is Portuguese: Use ONLY Portuguese words like "olá", "sim", "não", "bonito", "feliz", "triste"
- If language is Russian: Use ONLY Russian words like "привет", "да", "нет", "красивый", "счастливый", "грустный"

**VERIFICATION:** Before returning the JSON, check EVERY word in EVERY page text. If you find ANY English word, replace it with the ${getLanguageName(language)} equivalent.

# AGE-APPROPRIATE GUIDELINES
- Vocabulary: ${getVocabularyLevel(ageGroup)}
- Sentence Length: ${getSentenceLength(ageGroup)}
- Complexity: ${getComplexityLevel(ageGroup)}
- Reading Time: ${getReadingTime(ageGroup)} minutes per page

# STORY STRUCTURE
1. Opening: Introduce ${characterName}${characters && characters.length > 1 ? ` and ${characters.length - 1} other character(s)` : ''} and the setting (1 page)
2. Adventure Begins: ${characterName} discovers something interesting${characters && characters.length > 1 ? ' (with companions)' : ''} (2-3 pages)
3. Challenge: A small, age-appropriate problem to solve (2-3 pages)
4. Resolution: ${characterName} overcomes the challenge with creativity/kindness/courage${characters && characters.length > 1 ? ', with help from companions' : ''} (1-2 pages)
5. Happy Ending: Return home with a valuable lesson learned (1 page)

# THEME-SPECIFIC ELEMENTS
Setting: ${themeConfig.setting}
Include: ${themeConfig.commonElements.join(', ')}
Mood: ${themeConfig.mood}, warm, inviting
Educational Focus: ${getEducationalFocus(ageGroup, theme)}
Clothing Style: ${themeConfig.clothingStyle || 'age-appropriate casual clothing'}

CRITICAL - CHARACTER CLOTHING: Character must wear ${themeConfig.clothingStyle || 'age-appropriate casual clothing'} throughout the story. DO NOT use formal wear (suits, ties, dress shoes) unless the story explicitly requires it (e.g., "going to a wedding"). Clothing must be appropriate for the theme and setting (e.g., camping → outdoor/casual clothes, NOT formal wear).

# WRITING STYLE REQUIREMENTS (CRITICAL - NEW: 15 Ocak 2026)

**TEXT LENGTH REQUIREMENT:** Each page MUST be approximately ${getWordCount(ageGroup)} words (AVERAGE). This means detailed, rich text - NOT short, simple sentences.

1. **Include dialogue between characters** (use quotation marks)
   - Characters should talk to each other naturally
   - Include character actions with dialogue (e.g., "Look!" ${characterName} said, pointing)
   - Use dialogue to show personality and emotions
   - Balance dialogue with descriptive narration
   - **Dialogue adds length and richness - use it!**
   
2. **Describe emotions and feelings**
   - Show character's internal thoughts and emotional responses
   - Use sensory details (what they see, hear, feel)
   - Example: "${characterName} felt proud and warm, even as the evening air grew cooler"
   - **Detailed emotions add word count - be descriptive!**
   
3. **Use descriptive language for atmosphere and setting**
   - Paint a vivid picture with words
   - Describe lighting, colors, textures, sounds
   - Create immersive scenes
   - Example: "As the sun began to set, the sky turned orange and pink and purple, painting everything with magical colors"
   - **Atmospheric descriptions are essential for reaching ${getWordCount(ageGroup)} words**
   
4. **Show, don't just tell**
   - **BAD (TOO SHORT):** "${characterName} went to the forest. She saw trash. She cleaned it." (3 sentences, ~15 words - TOO SHORT!)
   - **GOOD (${getWordCount(ageGroup)} words):** Write detailed, descriptive text with dialogue and atmosphere in ${getLanguageName(language)} ONLY
   - **IMPORTANT:** All examples in this prompt are in English for instruction purposes, but YOUR story text MUST be written entirely in ${getLanguageName(language)}
   
5. **Page structure** (each page should include ALL of these to reach ${getWordCount(ageGroup)} words):
   - Opening description (setting the scene atmospherically - 2-3 sentences)
   - Character action or dialogue (2-3 sentences with dialogue)
   - Emotional response or internal thought (1-2 sentences)
   - Transition or scene continuation (1-2 sentences)
   - **Total: 6-10 sentences per page = ${getWordCount(ageGroup)} words**
   
6. **Example of quality writing structure (${getWordCount(ageGroup)} words):**
   - Write detailed, descriptive text with dialogue and atmosphere
   - Include character emotions, sensory details, and dialogue
   - **CRITICAL:** All text in your story MUST be in ${getLanguageName(language)} - the examples above are in English only for instruction purposes

# SAFETY RULES (CRITICAL - MUST FOLLOW)
## MUST INCLUDE:
${safetyRules.mustInclude.map(rule => `- ${rule}`).join('\n')}

## ABSOLUTELY AVOID:
${safetyRules.mustAvoid.map(rule => `- ${rule}`).join('\n')}

# ILLUSTRATION GUIDELINES
For each page, provide:
1. Scene description (what's happening)
2. Detailed image prompt for ${illustrationStyle} illustration
3. Character appearance (consistent across all pages)
4. Setting details (colors, lighting, mood)
5. Composition (what's in focus, perspective)

# OUTPUT FORMAT (JSON)
Return a valid JSON object with this exact structure:
{
  "title": "Story title",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page text (CRITICAL: Must be ${getWordCount(ageGroup)} words - this is the AVERAGE, write detailed text with dialogue and descriptions)",
      "imagePrompt": "Detailed ${illustrationStyle} illustration prompt with character consistency",
      "sceneDescription": "What's happening in this scene"
    }
    // ... continue for EXACTLY ${getPageCount(ageGroup, pageCount)} pages total
  ],
  "metadata": {
    "ageGroup": "${ageGroup}",
    "theme": "${theme}",
    "educationalThemes": ["theme1", "theme2"],
    "safetyChecked": true
  }
}

CRITICAL: The "pages" array MUST contain EXACTLY ${getPageCount(ageGroup, pageCount)} items. Count them carefully before returning.

# CRITICAL REMINDERS

## TEXT LENGTH (VERY IMPORTANT):
- **Each page text MUST be approximately ${getWordCount(ageGroup)} words (AVERAGE)**
- **DO NOT write short, simple sentences like "Lisa went to forest. She saw trash. She cleaned it."**
- **INSTEAD, write detailed, rich text with:**
  - Dialogue between characters (use quotation marks)
  - Atmospheric descriptions (setting the scene)
  - Character emotions and feelings
  - Sensory details (what they see, hear, feel)
  - Multiple sentences per page (NOT just 2-3 sentences)
- **Example of GOOD text structure (${getWordCount(ageGroup)} words):**
  Write detailed, descriptive text with dialogue, emotions, and sensory details - ALL in ${getLanguageName(language)}
- **Example of BAD text (TOO SHORT - DO NOT DO THIS):**
  Short, simple sentences without detail
- **CRITICAL REMINDER:** All examples in this prompt are in English for instruction, but YOUR story MUST be written entirely in ${getLanguageName(language)}. Do NOT copy English words from examples.
- **Target: ${getWordCount(ageGroup)} words per page - write DETAILED, DESCRIPTIVE text with dialogue and atmosphere**

## CHARACTER & STORY:
- Character must look EXACTLY the same in every image prompt
- ${characterName} is the hero and main character in EVERY scene
- Character must wear ${themeConfig.clothingStyle || 'theme-appropriate casual clothing'} (NOT formal wear like suits, ties, dress shoes)
- Keep it positive, fun, and inspiring
- Age-appropriate vocabulary and concepts
- NO scary, violent, or inappropriate content
- Include subtle educational value
- Make it engaging and memorable
- **MOST IMPORTANT: You MUST return EXACTLY ${getPageCount(ageGroup, pageCount)} pages in the "pages" array. Count them before returning!**

## LANGUAGE COMPLIANCE (CRITICAL - FINAL CHECK):
Before submitting your response, perform this final check:
1. Read EVERY word in EVERY page's "text" field
2. If you find ANY English word (like "hello", "yes", "good", "happy", "sad", "beautiful", "amazing", etc.), REPLACE it immediately with the ${getLanguageName(language)} equivalent
3. Ensure ALL dialogue is in ${getLanguageName(language)}
4. Ensure ALL narration is in ${getLanguageName(language)}
5. The ONLY exception: Character name "${characterName}" can remain as is
6. If you cannot write a word in ${getLanguageName(language)}, use a ${getLanguageName(language)} synonym instead - NEVER use English

**REMEMBER: A single English word in a ${getLanguageName(language)} story is a CRITICAL ERROR. Check every word before returning.**

Generate the story now in valid JSON format with EXACTLY ${getPageCount(ageGroup, pageCount)} pages.
`

  return prompt.trim()
}

// ============================================================================
// Helper Functions
// ============================================================================

function getAgeGroup(age: number): string {
  if (age <= 3) return 'toddler'
  if (age <= 5) return 'preschool'
  if (age <= 7) return 'early-elementary'
  if (age <= 9) return 'elementary'
  return 'pre-teen'
}

function getPageCount(ageGroup: string, override?: number): number {
  // Debug: Allow page count override (2-20)
  if (override !== undefined && override >= 2 && override <= 20) {
    return override
  }
  
  // Fixed to 10 pages for all age groups (user request: 10 Ocak 2026)
  return 10
  
  // Previous logic (commented out for reference):
  // const counts: Record<string, number> = {
  //   toddler: 6,
  //   preschool: 8,
  //   'early-elementary': 10,
  //   elementary: 12,
  //   'pre-teen': 14,
  // }
  // return counts[ageGroup] || 10
}

function getVocabularyLevel(ageGroup: string): string {
  const levels: Record<string, string> = {
    toddler: 'very simple, common words only',
    preschool: 'simple words, basic concepts',
    'early-elementary': 'simple to moderate words, some new vocabulary',
    elementary: 'moderate vocabulary, age-appropriate challenges',
    'pre-teen': 'rich vocabulary, complex concepts',
  }
  return levels[ageGroup] || 'age-appropriate'
}

function getSentenceLength(ageGroup: string): string {
  const lengths: Record<string, string> = {
    toddler: 'very short (3-5 words)',
    preschool: 'short (5-8 words)',
    'early-elementary': 'short to medium (8-12 words)',
    elementary: 'medium (10-15 words)',
    'pre-teen': 'medium to long (12-20 words)',
  }
  return lengths[ageGroup] || 'age-appropriate'
}

function getComplexityLevel(ageGroup: string): string {
  const levels: Record<string, string> = {
    toddler: 'very simple, repetitive, predictable',
    preschool: 'simple with gentle surprises',
    'early-elementary': 'moderate with clear cause-effect',
    elementary: 'moderate complexity with problem-solving',
    'pre-teen': 'more complex with deeper themes',
  }
  return levels[ageGroup] || 'age-appropriate'
}

function getWordCount(ageGroup: string): string {
  // Updated word counts (15 Ocak 2026): All values are AVERAGES, not fixed
  // Designed to match quality examples (Magical Children's Book)
  const counts: Record<string, string> = {
    toddler: '35-45',           // avg 40 words
    preschool: '50-70',          // avg 60 words
    'early-elementary': '80-100', // avg 90 words
    elementary: '110-130',       // avg 120 words (max 120)
    'pre-teen': '110-130',       // avg 120 words (max 120)
  }
  return counts[ageGroup] || '80-100'
}

function getReadingTime(ageGroup: string): number {
  const times: Record<string, number> = {
    toddler: 1,
    preschool: 2,
    'early-elementary': 3,
    elementary: 4,
    'pre-teen': 5,
  }
  return times[ageGroup] || 3
}

function getSafetyRules(ageGroup: string) {
  return {
    mustInclude: [
      'Positive, uplifting message',
      'Age-appropriate problem-solving',
      'Kindness, friendship, or courage themes',
      'Safe, supportive environment',
      'Happy or hopeful ending',
    ],
    mustAvoid: [
      'Violence, fighting, weapons',
      'Scary monsters, ghosts, or nightmares',
      'Death, injury, or harm to characters',
      'Abandonment or separation anxiety',
      'Adult themes or situations',
      'Negative stereotypes',
      'Commercialism or brand names',
      'Dark, frightening imagery',
      'Hopeless or sad endings',
    ],
  }
}

function getThemeConfig(theme: string) {
  const t = (theme || '').toString().trim().toLowerCase()
  const normalizedTheme =
    t === 'sports&activities' || t === 'sports_activities' || t === 'sports-activities'
      ? 'sports'
      : t

  const configs: Record<string, any> = {
    adventure: {
      name: 'Adventure',
      mood: 'exciting',
      setting: 'outdoor exploration (forest, mountain, beach)',
      commonElements: ['discovery', 'nature', 'exploration', 'teamwork'],
      clothingStyle: 'comfortable outdoor clothing appropriate for adventure (casual pants/shorts, t-shirts, sneakers, outdoor gear)',
    },
    sports: {
      name: 'Sports & Activities',
      mood: 'exciting',
      setting: 'playground, sports field, or indoor activity space',
      commonElements: ['movement', 'teamwork', 'practice', 'friendly competition', 'having fun'],
      clothingStyle: 'sportswear (athletic clothes, sports shoes, comfortable activewear)',
    },
    fantasy: {
      name: 'Fantasy',
      mood: 'magical',
      setting: 'magical world or enchanted place',
      commonElements: ['magic', 'wonder', 'imagination', 'friendly creatures'],
      clothingStyle: 'fantasy-appropriate clothing (adventure-style casual, magical themes, not formal)',
    },
    animals: {
      name: 'Animals',
      mood: 'fun',
      setting: 'farm, zoo, or natural habitat',
      commonElements: ['animal friends', 'nature', 'care', 'learning'],
      clothingStyle: 'casual comfortable clothing appropriate for nature/outdoors (jeans, t-shirts, casual shoes)',
    },
    'daily-life': {
      name: 'Daily Life',
      mood: 'relatable',
      setting: 'home, school, or neighborhood',
      commonElements: ['family', 'friends', 'everyday activities', 'growth'],
      clothingStyle: 'everyday casual clothing (normal kids clothes, casual outfits)',
    },
    space: {
      name: 'Space',
      mood: 'inspiring',
      setting: 'space, planets, or stars',
      commonElements: ['exploration', 'discovery', 'wonder', 'science'],
      clothingStyle: 'space/exploration-appropriate clothing (casual futuristic style, comfortable adventure clothes)',
    },
    underwater: {
      name: 'Underwater',
      mood: 'mysterious',
      setting: 'ocean, sea, or underwater world',
      commonElements: ['sea creatures', 'exploration', 'discovery', 'beauty'],
      clothingStyle: 'swimwear or beach-appropriate clothing (swimsuit, beach clothes, casual summer wear)',
    },
  }
  
  return configs[normalizedTheme] || configs['adventure']
}

function getEducationalFocus(ageGroup: string, theme: string): string {
  const t = (theme || '').toString().trim().toLowerCase()
  const normalizedTheme =
    t === 'sports&activities' || t === 'sports_activities' || t === 'sports-activities'
      ? 'sports'
      : t

  const focuses: Record<string, string[]> = {
    toddler: ['colors', 'shapes', 'counting', 'emotions'],
    preschool: ['sharing', 'kindness', 'curiosity', 'basic concepts'],
    'early-elementary': ['problem-solving', 'creativity', 'friendship', 'courage'],
    elementary: ['perseverance', 'teamwork', 'responsibility', 'empathy'],
    'pre-teen': ['self-confidence', 'resilience', 'critical thinking', 'ethics'],
  }
  
  const themeFocuses: Record<string, string> = {
    adventure: 'courage and exploration',
    sports: 'movement, teamwork, and healthy habits',
    fantasy: 'imagination and creativity',
    animals: 'empathy and care for animals',
    'daily-life': 'social-emotional skills',
    space: 'curiosity and science',
    underwater: 'environmental awareness',
  }
  
  const ageFocus = focuses[ageGroup] || focuses['elementary']
  const themeFocus = themeFocuses[normalizedTheme] || 'general growth'
  
  return `${themeFocus}, ${ageFocus.join(', ')}`
}

function buildCharacterDescription(
  name: string,
  age: number,
  gender: string,
  analysis?: any, // Optional: kept for backward compatibility
  step1Data?: { hairColor?: string; eyeColor?: string; specialFeatures?: string[] } // Step 1 data (preferred)
): string {
  let desc = `Name: ${name}\nAge: ${age} years old\nGender: ${gender}`
  
  // Prefer Step 1 data if available (simpler, no AI Analysis needed)
  if (step1Data && (step1Data.hairColor || step1Data.eyeColor || step1Data.specialFeatures?.length)) {
    desc += `\n\nPHYSICAL APPEARANCE (use in every image):`
    
    // Default reasonable values for missing data
    const skinTone = 'fair' // Default, can be adjusted by user later if needed
    const hairStyle = 'natural' // Default
    const hairLength = age <= 3 ? 'short' : age <= 7 ? 'medium' : 'long' // Age-based default
    const eyeShape = 'round' // Default for children
    const faceShape = 'round' // Default for children
    
    desc += `\n- Skin tone: ${skinTone}`
    
    if (step1Data.hairColor) {
      desc += `\n- Hair: ${step1Data.hairColor} ${hairStyle} ${hairLength} hair`
    } else {
      desc += `\n- Hair: natural ${hairStyle} ${hairLength} hair`
    }
    
    if (step1Data.eyeColor) {
      desc += `\n- Eyes: ${step1Data.eyeColor} ${eyeShape} eyes`
    } else {
      desc += `\n- Eyes: brown ${eyeShape} eyes` // Default
    }
    
    desc += `\n- Face: ${faceShape} face shape`
    desc += `\n- Build: average height, normal build for age`
    desc += `\n- Clothing style: casual in various colors`
    
    if (step1Data.specialFeatures && step1Data.specialFeatures.length > 0) {
      desc += `\n- Unique features: ${step1Data.specialFeatures.join(', ')}`
    }
    
    desc += `\n\nPERSONALITY:`
    desc += `\n- Expression: happy, cheerful`
    desc += `\n- Traits: curious, friendly, adventurous`
    
    return desc
  }
  
  // Fallback: Use analysis data if available (backward compatibility)
  if (analysis?.finalDescription) {
    const char = analysis.finalDescription
    desc += `\n\nPHYSICAL APPEARANCE (use in every image):`
    
    if (char.skinTone) desc += `\n- Skin tone: ${char.skinTone}`
    if (char.hairColor && char.hairStyle && char.hairLength) {
      desc += `\n- Hair: ${char.hairColor} ${char.hairStyle} ${char.hairLength} hair`
    } else if (char.hairColor) {
      desc += `\n- Hair: ${char.hairColor}`
    }
    if (char.eyeColor && char.eyeShape) {
      desc += `\n- Eyes: ${char.eyeColor} ${char.eyeShape} eyes`
    } else if (char.eyeColor) {
      desc += `\n- Eyes: ${char.eyeColor}`
    }
    if (char.faceShape) desc += `\n- Face: ${char.faceShape} face shape`
    if (char.height && char.build) {
      desc += `\n- Build: ${char.height}, ${char.build}`
    }
    
    if (char.clothingStyle) {
      const colors = Array.isArray(char.clothingColors) && char.clothingColors.length > 0
        ? char.clothingColors.join(' and ')
        : 'various colors'
      desc += `\n- Clothing style: ${char.clothingStyle} in ${colors}`
    }
    
    if (char.uniqueFeatures && Array.isArray(char.uniqueFeatures) && char.uniqueFeatures.length > 0) {
      desc += `\n- Unique features: ${char.uniqueFeatures.join(', ')}`
    }
    
    if (char.typicalExpression || (char.personalityTraits && Array.isArray(char.personalityTraits))) {
      desc += `\n\nPERSONALITY:`
      if (char.typicalExpression) desc += `\n- Expression: ${char.typicalExpression}`
      if (char.personalityTraits && Array.isArray(char.personalityTraits) && char.personalityTraits.length > 0) {
        desc += `\n- Traits: ${char.personalityTraits.join(', ')}`
      }
    }
  } else if (analysis?.detectedFeatures) {
    // Fallback: Use detectedFeatures if finalDescription is not available
    const features = analysis.detectedFeatures
    desc += `\n\nPHYSICAL APPEARANCE (from photo analysis):`
    if (features.hairColor) desc += `\n- Hair: ${features.hairColor}`
    if (features.eyeColor) desc += `\n- Eyes: ${features.eyeColor}`
    if (features.faceShape) desc += `\n- Face: ${features.faceShape}`
    if (features.skinTone) desc += `\n- Skin tone: ${features.skinTone}`
  } else {
    // Default description if no data available
    desc += `\n\nPHYSICAL APPEARANCE (use in every image):`
    desc += `\n- Skin tone: fair`
    desc += `\n- Hair: natural hair`
    desc += `\n- Eyes: brown round eyes`
    desc += `\n- Face: round face shape`
    desc += `\n- Build: average height, normal build for age`
    desc += `\n- Clothing style: casual in various colors`
    desc += `\n\nPERSONALITY:`
    desc += `\n- Expression: happy, cheerful`
    desc += `\n- Traits: curious, friendly, adventurous`
  }
  
  return desc
}

// ============================================================================
// Language Helper Functions
// ============================================================================

function getLanguageName(language: string = 'en'): string {
  const languageMap: Record<string, string> = {
    'en': 'English',
    'tr': 'Turkish',
    'de': 'German',
    'fr': 'French',
    'es': 'Spanish',
    'zh': 'Chinese (Mandarin)',
    'pt': 'Portuguese',
    'ru': 'Russian',
  }
  return languageMap[language] || 'English'
}

export default {
  VERSION,
  generateStoryPrompt,
}

