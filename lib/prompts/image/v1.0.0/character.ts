import type { CharacterDescription, CharacterAnalysis, PromptVersion } from '../../types'

/**
 * Character Analysis and Consistency System - Version 1.0.0
 * 
 * This system ensures character consistency:
 * 1. Across all pages in a single book
 * 2. Across all books for the same user
 * 3. From reference photo to generated images
 * 
 * Flow:
 * 1. User uploads photo → Analyze once → Save as "Master Character"
 * 2. User creates Book 1 → Use Master Character
 * 3. User creates Book 2 → Use same Master Character
 * 4. User creates Book 3 → Use same Master Character
 */

export const VERSION: PromptVersion = {
  version: '1.0.4',
  releaseDate: new Date('2026-01-16'),
  status: 'active',
  changelog: [
    'Initial release',
    'Photo analysis integration',
    'Master character concept',
    'Multi-book consistency',
    'Detailed feature extraction',
    'Added child descriptions for multi-character prompts',
    'Support multiple reference images for cover edits',
    'Enhanced multi-character prompt with reference image matching (16 Ocak 2026)',
    'Individual eye color preservation for each character (16 Ocak 2026)',
    'v1.0.4: Hands descriptor added to buildCharacterPrompt - contextual anchoring for anatomical accuracy (16 Ocak 2026)',
  ],
  author: '@prompt-manager',
}

// ============================================================================
// Character Analysis from Photo
// ============================================================================

/**
 * Analyzes reference photo to create detailed character description
 * This runs ONCE when user uploads photo
 * Result is saved as "Master Character" in database
 */
export function generateCharacterAnalysisPrompt(
  photoDescription: string,
  userInputs: {
    name: string
    age: number
    gender: string
    additionalDetails?: string
  }
): string {
  const prompt = `
You are an expert character designer for children's book illustrations. Analyze this reference photo and create a DETAILED character description that will be used consistently across multiple books.

# REFERENCE PHOTO ANALYSIS
${photoDescription}

# USER PROVIDED INFO
- Name: ${userInputs.name}
- Age: ${userInputs.age} years old
- Gender: ${userInputs.gender}
${userInputs.additionalDetails ? `- Additional: ${userInputs.additionalDetails}` : ''}

# YOUR TASK
Create a detailed character description that an illustrator could use to draw this character consistently. Be specific and detailed.

# REQUIRED DETAILS

## FACE AND HEAD
1. Face Shape: (round, oval, heart-shaped, square, etc.)
2. Skin Tone: (very specific - pale, fair, light, medium, tan, brown, dark brown, etc.)
3. Eye Color: (exact color - blue, green, brown, hazel, grey, etc.)
4. Eye Shape: (round, almond, wide-set, close-set, etc.)
5. Eyebrow Style: (thick, thin, arched, straight, etc.)
6. Nose: (small, button, average, wide, etc.)
7. Mouth: (small, wide, full lips, thin lips, etc.)
8. Cheeks: (full, dimpled, rosy, etc.)

## HAIR
1. Color: (exact shade - blonde, light brown, dark brown, black, red, etc.)
2. Style: (straight, wavy, curly, kinky, braided, ponytail, etc.)
3. Length: (very short, short, shoulder-length, long, very long)
4. Texture: (fine, thick, coarse, silky, etc.)
5. Bangs: (yes/no, style if yes)

## BODY
1. Height for age: (short, average, tall for their age)
2. Build: (slim, average, sturdy, athletic, etc.)
3. Posture: (confident, shy, energetic, etc.)

## UNIQUE FEATURES
List any distinctive features:
- Freckles? (location, density)
- Glasses? (style, color)
- Birthmarks or beauty marks?
- Gap in teeth?
- Dimples?
- Any other distinguishing features

## TYPICAL EXPRESSION
- Usual facial expression (smiling, serious, curious, playful, etc.)
- Personality that shows in face (cheerful, thoughtful, adventurous, etc.)

## CLOTHING STYLE (for illustrations)
Based on age and photo:
- Typical clothing style (casual, sporty, dressy, etc.)
- Preferred colors
- Common clothing items

# OUTPUT FORMAT (JSON)
Return a valid JSON object:
{
  "characterId": "unique-id",
  "name": "${userInputs.name}",
  "age": ${userInputs.age},
  "gender": "${userInputs.gender}",
  "physicalFeatures": {
    "faceShape": "...",
    "skinTone": "...",
    "eyeColor": "...",
    "eyeShape": "...",
    "eyebrowStyle": "...",
    "nose": "...",
    "mouth": "...",
    "cheeks": "..."
  },
  "hair": {
    "color": "...",
    "style": "...",
    "length": "...",
    "texture": "...",
    "hasBangs": true/false,
    "bangsStyle": "..."
  },
  "body": {
    "heightForAge": "...",
    "build": "...",
    "posture": "..."
  },
  "uniqueFeatures": [
    "feature 1",
    "feature 2"
  ],
  "expression": {
    "typical": "...",
    "personality": "..."
  },
  "clothingStyle": {
    "style": "...",
    "colors": ["color1", "color2"],
    "commonItems": ["item1", "item2"]
  },
  "illustrationNotes": "Additional notes for illustrators to maintain consistency",
  "confidence": 0.95
}

IMPORTANT: Be extremely detailed. This description will be used for ALL future books this user creates.
`

  return prompt.trim()
}

// ============================================================================
// Character Description for Image Generation
// ============================================================================

/**
 * Converts master character description to image prompt
 * This is used for EVERY image generation
 */
export function buildCharacterPrompt(character: CharacterDescription): string {
  const parts: string[] = []

  // Name and basics
  parts.push(`${character.age}-year-old ${character.gender} named ${character.name || 'child'}`)

  // Face
  parts.push(`with ${character.faceShape} face shape`)
  parts.push(`${character.skinTone} skin`)
  parts.push(`${character.eyeColor} ${character.eyeShape} eyes`)
  
  // Hair - VERY DETAILED
  const hairDesc = [
    character.hairColor,
    character.hairLength,
    character.hairStyle,
    character.hairTexture,
  ].filter(Boolean).join(' ')
  parts.push(`${hairDesc} hair`)

  // Unique features
  if (character.uniqueFeatures && character.uniqueFeatures.length > 0) {
    parts.push(character.uniqueFeatures.join(', '))
  }

  // NEW: Hands descriptor (intrinsic to character) - Contextual anchoring for anatomical accuracy
  parts.push('anatomically correct hands with 5 distinct fingers, natural skin texture')

  // Build and posture
  parts.push(`${character.height} height`)
  parts.push(`${character.build} build`)

  // Expression
  parts.push(`with ${character.typicalExpression} expression`)

  // Clothing (for this specific scene)
  if (character.clothingStyle) {
    parts.push(`wearing ${character.clothingStyle} in ${character.clothingColors?.join(' and ') || 'bright colors'}`)
  }

  return parts.join(', ')
}

/**
 * Build prompt for multiple characters
 * Main character (with reference image) + additional characters (text description only)
 * ENHANCED: 16 Ocak 2026 - Referans görsel eşleştirme iyileştirmesi
 */
export function buildMultipleCharactersPrompt(
  mainCharacter: CharacterDescription,
  additionalCharacters?: Array<{
    type: { group: string; value: string; displayName: string }
    description?: CharacterDescription
  }>
): string {
  const parts: string[] = []

  // CRITICAL: Multiple Reference Images Instruction (NEW: 16 Ocak 2026)
  parts.push(`CRITICAL INSTRUCTION FOR MULTIPLE CHARACTERS WITH REFERENCE IMAGES:`)
  parts.push(`You are provided with ${additionalCharacters ? additionalCharacters.length + 1 : 1} reference image(s).`)
  parts.push(`Each reference image corresponds to one character below, in order (image 1 → character 1, image 2 → character 2, etc.).`)
  parts.push(`You MUST match each character's text description with its corresponding reference image.`)
  parts.push(`Pay close attention to EACH character's eye color, hair color, age, and unique features as specified.`)
  parts.push(`Do NOT mix features between characters - each character must maintain their individual characteristics.`)
  parts.push(`\n`)

  // Main character (reference image 1 available)
  parts.push(`CHARACTER 1 (MAIN - Reference Image 1):`)
  parts.push(buildCharacterPrompt(mainCharacter))

  // Additional characters (reference images 2, 3, ... available)
  if (additionalCharacters && additionalCharacters.length > 0) {
    parts.push(`\n`)
    
    additionalCharacters.forEach((char, index) => {
      const charParts: string[] = []
      const charNumber = index + 2
      
      // Add reference image indicator
      charParts.push(`CHARACTER ${charNumber} (Reference Image ${charNumber}):`)
      
      if (char.type.group === "Child") {
        // NEW: Child character description (detailed, like main character but without reference image)
        if (char.description) {
          // Use full character description for Child
          charParts.push(buildCharacterPrompt(char.description))
          // CRITICAL: Emphasize individual eye color for this character
          charParts.push(`(IMPORTANT: This character has ${char.description.eyeColor} eyes, NOT the same eye color as Character 1)`)
        } else {
          // Fallback if no description available
          charParts.push(`a child named ${char.type.displayName || 'child'}`)
        }
      } else if (char.type.group === "Pets") {
        // Pet description
        charParts.push(`a ${char.type.value.toLowerCase()}`)
        
        if (char.description) {
          if (char.description.hairColor) charParts.push(`with ${char.description.hairColor} fur`)
          if (char.description.eyeColor) charParts.push(`${char.description.eyeColor} eyes`)
          charParts.push(`friendly and playful expression`)
        } else {
          charParts.push(`friendly and cute appearance`)
        }
      } else if (char.type.group === "Family Members") {
        // Family member description
        charParts.push(`${char.type.value.toLowerCase()}`)
        
        if (char.description) {
          if (char.description.age) charParts.push(`${char.description.age} years old`)
          if (char.description.hairColor) charParts.push(`with ${char.description.hairColor} hair`)
          if (char.description.eyeColor) charParts.push(`${char.description.eyeColor} eyes`)
          charParts.push(`warm and caring expression`)
        } else {
          // Default descriptions
          if (char.type.value === "Mom" || char.type.value === "Dad") {
            charParts.push(`adult, warm and loving`)
          } else if (char.type.value === "Grandma" || char.type.value === "Grandpa") {
            charParts.push(`elderly, kind and gentle`)
          } else {
            charParts.push(`family member, friendly`)
          }
        }
      } else {
        // Other
        charParts.push(`${char.type.displayName}`)
        if (char.description) {
          if (char.description.hairColor) charParts.push(`with ${char.description.hairColor} hair`)
          if (char.description.eyeColor) charParts.push(`${char.description.eyeColor} eyes`)
        }
      }
      
      parts.push(charParts.join(' '))
    })
  }

  return parts.join('\n')
}

/**
 * Enhanced character prompt with style consistency
 */
export function buildDetailedCharacterPrompt(
  character: CharacterDescription,
  illustrationStyle: string,
  scene?: string,
  additionalCharacters?: Array<{
    type: { group: string; value: string; displayName: string }
    description?: CharacterDescription
  }>
): string {
  // Build character prompt (single or multiple)
  const baseCharacter = additionalCharacters && additionalCharacters.length > 0
    ? buildMultipleCharactersPrompt(character, additionalCharacters)
    : buildCharacterPrompt(character)
  
  let prompt = `${illustrationStyle} illustration of ${baseCharacter}`
  
  if (scene) {
    prompt += `, ${scene}`
  }

  // Add consistency keywords
  prompt += `, consistent character design, same character as previous pages`
  
  // Additional characters note
  if (additionalCharacters && additionalCharacters.length > 0) {
    prompt += `, all ${additionalCharacters.length + 1} characters visible in the scene`
  }
  
  // Style-specific enhancements
  if (illustrationStyle.includes('watercolor')) {
    prompt += `, soft watercolor style, gentle colors, painterly texture`
  } else if (illustrationStyle.includes('digital')) {
    prompt += `, vibrant digital art, clean lines, professional children's book illustration`
  } else if (illustrationStyle.includes('cartoon')) {
    prompt += `, charming cartoon style, expressive features, kid-friendly`
  }

  return prompt
}

// ============================================================================
// Character Consistency Keywords
// ============================================================================

/**
 * DALL-E 3 specific keywords for character consistency
 */
export const CONSISTENCY_KEYWORDS = {
  // Use these in every prompt for the same character
  sameCharacter: [
    'same character as before',
    'consistent character design',
    'identical character appearance',
    'maintaining character features',
  ],
  
  // Emphasize key features
  keyFeatures: (character: CharacterDescription) => [
    `always with ${character.hairColor} ${character.hairStyle} hair`,
    `always ${character.eyeColor} eyes`,
    `always ${character.skinTone} skin tone`,
    character.uniqueFeatures?.[0] && `always with ${character.uniqueFeatures[0]}`,
  ].filter(Boolean),
  
  // Style consistency
  styleConsistency: (style: string) => [
    `${style} illustration style throughout`,
    `consistent artistic style`,
    `same illustration technique`,
  ],
}

// ============================================================================
// Character Library Management
// ============================================================================

/**
 * Character entity for database
 */
export interface MasterCharacter {
  id: string
  userId: string
  name: string
  age: number
  gender: string
  referencePhotoUrl?: string
  description: CharacterDescription
  createdAt: Date
  updatedAt: Date
  usedInBooks: string[] // Array of book IDs
  isDefault: boolean // User's primary character
}

/**
 * Helper to format character for database storage
 */
export function formatCharacterForStorage(
  analysis: CharacterAnalysis,
  userId: string,
  photoUrl?: string
): MasterCharacter {
  return {
    id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    name: analysis.finalDescription.name || 'Character',
    age: analysis.finalDescription.age,
    gender: analysis.finalDescription.gender,
    referencePhotoUrl: photoUrl,
    description: analysis.finalDescription,
    createdAt: new Date(),
    updatedAt: new Date(),
    usedInBooks: [],
    isDefault: true, // First character is default
  }
}

/**
 * Helper to retrieve character for book generation
 */
export function getCharacterForBookGeneration(character: MasterCharacter) {
  return {
    characterId: character.id,
    characterDescription: character.description,
    promptBuilder: (style: string, scene: string) => 
      buildDetailedCharacterPrompt(character.description, style, scene),
  }
}

// ============================================================================
// Multi-Book Consistency Strategy
// ============================================================================

/**
 * Strategy for maintaining character across multiple books
 */
export const MULTI_BOOK_STRATEGY = {
  // On first book creation
  firstBook: {
    analyze: true, // Analyze reference photo
    save: true, // Save as master character
    useReferencePhoto: true, // Include reference in DALL-E prompt
  },
  
  // On subsequent books
  subsequentBooks: {
    analyze: false, // Don't re-analyze
    useSaved: true, // Use saved master character
    useReferencePhoto: true, // Still include reference for consistency
    emphasizeConsistency: true, // Extra consistency keywords
  },
  
  // When user wants to update character
  characterUpdate: {
    confirm: true, // Confirm with user
    affectAllBooks: false, // Only new books use updated version
    keepHistory: true, // Keep old version for existing books
    version: '+1', // Increment character version
  },
}

/**
 * Generate consistency prompt for subsequent books
 */
export function generateSubsequentBookPrompt(
  masterCharacter: MasterCharacter,
  previousBookImages: string[]
): string {
  const basePrompt = buildDetailedCharacterPrompt(
    masterCharacter.description,
    'children\'s book illustration'
  )
  
  let consistencyNote = `
CRITICAL: This is the ${masterCharacter.usedInBooks.length + 1}th book with this character.
The character MUST look EXACTLY the same as in previous ${masterCharacter.usedInBooks.length} books.

CHARACTER IDENTITY (NEVER CHANGE):
${basePrompt}

CONSISTENCY REQUIREMENTS:
- Same face shape, features, and proportions
- Same hair color, style, and length
- Same skin tone
- Same eye color and shape
- Same unique features (${masterCharacter.description.uniqueFeatures?.join(', ')})
- Only clothing and poses can vary
`

  if (previousBookImages.length > 0) {
    consistencyNote += `\n\nREFERENCE IMAGES FROM PREVIOUS BOOKS:\n`
    consistencyNote += `Use these as visual reference for character consistency.\n`
    // In actual implementation, we'd pass these as separate reference images to DALL-E
  }

  return consistencyNote
}

export default {
  VERSION,
  generateCharacterAnalysisPrompt,
  buildCharacterPrompt,
  buildDetailedCharacterPrompt,
  CONSISTENCY_KEYWORDS,
  MULTI_BOOK_STRATEGY,
  formatCharacterForStorage,
  getCharacterForBookGeneration,
  generateSubsequentBookPrompt,
}

