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
    referencePhotoAnalysis,
    language = 'en',
  } = input

  // Get age-appropriate rules
  const ageGroup = getAgeGroup(characterAge)
  const safetyRules = getSafetyRules(ageGroup)
  const themeConfig = getThemeConfig(theme)

  // Build character description
  const characterDesc = buildCharacterDescription(
    characterName,
    characterAge,
    characterGender,
    referencePhotoAnalysis
  )

  // Main prompt
  const prompt = `
You are a professional children's book author. Create a magical, age-appropriate story.

# CHARACTER
${characterDesc}

# STORY REQUIREMENTS
- Theme: ${themeConfig.name} (${themeConfig.mood} mood)
- Target Age: ${characterAge} years old (${ageGroup} age group)
- Story Length: ${getPageCount(ageGroup)} pages
- Language: ${language === 'tr' ? 'Turkish' : 'English'}
- Illustration Style: ${illustrationStyle}

# AGE-APPROPRIATE GUIDELINES
- Vocabulary: ${getVocabularyLevel(ageGroup)}
- Sentence Length: ${getSentenceLength(ageGroup)}
- Complexity: ${getComplexityLevel(ageGroup)}
- Reading Time: ${getReadingTime(ageGroup)} minutes per page

# STORY STRUCTURE
1. Opening: Introduce ${characterName} and the setting (1 page)
2. Adventure Begins: ${characterName} discovers something interesting (2-3 pages)
3. Challenge: A small, age-appropriate problem to solve (2-3 pages)
4. Resolution: ${characterName} overcomes the challenge with creativity/kindness/courage (1-2 pages)
5. Happy Ending: Return home with a valuable lesson learned (1 page)

# THEME-SPECIFIC ELEMENTS
Setting: ${themeConfig.setting}
Include: ${themeConfig.commonElements.join(', ')}
Mood: ${themeConfig.mood}, warm, inviting
Educational Focus: ${getEducationalFocus(ageGroup, theme)}

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

${customRequests ? `\n# CUSTOM REQUESTS\n${customRequests}\n` : ''}

# OUTPUT FORMAT (JSON)
Return a valid JSON object with this exact structure:
{
  "title": "Story title",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page text (age-appropriate, ${getWordCount(ageGroup)} words)",
      "imagePrompt": "Detailed ${illustrationStyle} illustration prompt with character consistency",
      "sceneDescription": "What's happening in this scene"
    }
  ],
  "metadata": {
    "ageGroup": "${ageGroup}",
    "theme": "${theme}",
    "educationalThemes": ["theme1", "theme2"],
    "safetyChecked": true
  }
}

# CRITICAL REMINDERS
- Character must look EXACTLY the same in every image prompt
- ${characterName} is the hero and main character in EVERY scene
- Keep it positive, fun, and inspiring
- Age-appropriate vocabulary and concepts
- NO scary, violent, or inappropriate content
- Include subtle educational value
- Make it engaging and memorable

Generate the story now in valid JSON format.
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

function getPageCount(ageGroup: string): number {
  const counts: Record<string, number> = {
    toddler: 6,
    preschool: 8,
    'early-elementary': 10,
    elementary: 12,
    'pre-teen': 14,
  }
  return counts[ageGroup] || 10
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
  const counts: Record<string, string> = {
    toddler: '20-40',
    preschool: '40-80',
    'early-elementary': '80-120',
    elementary: '120-180',
    'pre-teen': '180-250',
  }
  return counts[ageGroup] || '100-150'
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
  const configs: Record<string, any> = {
    adventure: {
      name: 'Adventure',
      mood: 'exciting',
      setting: 'outdoor exploration (forest, mountain, beach)',
      commonElements: ['discovery', 'nature', 'exploration', 'teamwork'],
    },
    fantasy: {
      name: 'Fantasy',
      mood: 'magical',
      setting: 'magical world or enchanted place',
      commonElements: ['magic', 'wonder', 'imagination', 'friendly creatures'],
    },
    animals: {
      name: 'Animals',
      mood: 'fun',
      setting: 'farm, zoo, or natural habitat',
      commonElements: ['animal friends', 'nature', 'care', 'learning'],
    },
    'daily-life': {
      name: 'Daily Life',
      mood: 'relatable',
      setting: 'home, school, or neighborhood',
      commonElements: ['family', 'friends', 'everyday activities', 'growth'],
    },
    space: {
      name: 'Space',
      mood: 'inspiring',
      setting: 'space, planets, or stars',
      commonElements: ['exploration', 'discovery', 'wonder', 'science'],
    },
    underwater: {
      name: 'Underwater',
      mood: 'mysterious',
      setting: 'ocean, sea, or underwater world',
      commonElements: ['sea creatures', 'exploration', 'discovery', 'beauty'],
    },
  }
  
  return configs[theme] || configs['adventure']
}

function getEducationalFocus(ageGroup: string, theme: string): string {
  const focuses: Record<string, string[]> = {
    toddler: ['colors', 'shapes', 'counting', 'emotions'],
    preschool: ['sharing', 'kindness', 'curiosity', 'basic concepts'],
    'early-elementary': ['problem-solving', 'creativity', 'friendship', 'courage'],
    elementary: ['perseverance', 'teamwork', 'responsibility', 'empathy'],
    'pre-teen': ['self-confidence', 'resilience', 'critical thinking', 'ethics'],
  }
  
  const themeFocuses: Record<string, string> = {
    adventure: 'courage and exploration',
    fantasy: 'imagination and creativity',
    animals: 'empathy and care for animals',
    'daily-life': 'social-emotional skills',
    space: 'curiosity and science',
    underwater: 'environmental awareness',
  }
  
  const ageFocus = focuses[ageGroup] || focuses['elementary']
  const themeFocus = themeFocuses[theme] || 'general growth'
  
  return `${themeFocus}, ${ageFocus.join(', ')}`
}

function buildCharacterDescription(
  name: string,
  age: number,
  gender: string,
  analysis?: any
): string {
  let desc = `Name: ${name}\nAge: ${age} years old\nGender: ${gender}`
  
  if (analysis?.finalDescription) {
    const char = analysis.finalDescription
    desc += `\n\nPHYSICAL APPEARANCE (use in every image):`
    desc += `\n- Skin tone: ${char.skinTone}`
    desc += `\n- Hair: ${char.hairColor} ${char.hairStyle} ${char.hairLength} hair`
    desc += `\n- Eyes: ${char.eyeColor} ${char.eyeShape} eyes`
    desc += `\n- Face: ${char.faceShape} face shape`
    desc += `\n- Build: ${char.height}, ${char.build}`
    desc += `\n- Clothing style: ${char.clothingStyle} in ${char.clothingColors.join(' and ')}`
    
    if (char.uniqueFeatures?.length > 0) {
      desc += `\n- Unique features: ${char.uniqueFeatures.join(', ')}`
    }
    
    desc += `\n\nPERSONALITY:`
    desc += `\n- Expression: ${char.typicalExpression}`
    desc += `\n- Traits: ${char.personalityTraits.join(', ')}`
  }
  
  return desc
}

export default {
  VERSION,
  generateStoryPrompt,
}

