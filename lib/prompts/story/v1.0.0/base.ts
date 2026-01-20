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
  version: '1.1.0',
  releaseDate: new Date('2026-01-25'),
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
    'v1.0.1: Enhanced additional characters section with detailed appearance descriptions (age, hair color, eye color, features) and explicit character name usage directive (16 Ocak 2026)',
    'v1.0.2: Visual safety guidelines added - avoid risky hand interactions for better anatomical accuracy (GPT research-backed) (18 Ocak 2026)',
    'v1.0.3: Character mapping per page - Story generation now returns characterIds array for each page, replacing unreliable text-based character detection (18 Ocak 2026)',
    'v1.1.0: Enhanced writing quality improvements (25 Ocak 2026)',
    'v1.1.0: Added getExampleText() - age-group specific example texts with dialogue and sensory details (25 Ocak 2026)',
    'v1.1.0: Enhanced "show, don\'t tell" examples - detailed BAD and GOOD examples with full sensory details (25 Ocak 2026)',
    'v1.1.0: Enhanced sensory details emphasis - visual, auditory, tactile, olfactory, gustatory details (25 Ocak 2026)',
    'v1.1.0: Enhanced pacing control - strong hook early, shorter scenes, predictable patterns, scene-by-scene breakdown (25 Ocak 2026)',
    'v1.1.0: Enhanced illustration guidelines - sensory details visualization (25 Ocak 2026)',
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
      const charName = char.name || char.type.displayName
      const charNumber = index + 2
      
      if (char.type.group === "Pets") {
        characterDesc += `\n${charNumber}. ${charName} (a ${char.type.value.toLowerCase()})`
        // Add appearance details if available
        if (char.description) {
          if (char.description.hairColor) characterDesc += ` with ${char.description.hairColor} fur`
          if (char.description.eyeColor) characterDesc += `, ${char.description.eyeColor} eyes`
          if (char.description.uniqueFeatures && char.description.uniqueFeatures.length > 0) {
            characterDesc += `, ${char.description.uniqueFeatures.join(', ')}`
          }
        }
        characterDesc += ` - A friendly and playful companion`
      } else if (char.type.group === "Toys") {
        characterDesc += `\n${charNumber}. ${charName} (a ${char.type.value.toLowerCase()})`
        // Add appearance details if available
        if (char.description) {
          if (char.description.hairColor) characterDesc += `, ${char.description.hairColor} color`
          if (char.description.eyeColor) characterDesc += `, ${char.description.eyeColor} details`
          if (char.description.uniqueFeatures && char.description.uniqueFeatures.length > 0) {
            characterDesc += `, ${char.description.uniqueFeatures.join(', ')}`
          }
        }
        characterDesc += ` - A beloved and special toy`
      } else if (char.type.group === "Family Members") {
        // NEW: Detailed family member description
        characterDesc += `\n${charNumber}. ${charName} (${characterName}'s ${char.type.value.toLowerCase()})`
        // Add appearance details if available
        if (char.description) {
          if (char.description.age) characterDesc += `, ${char.description.age} years old`
          if (char.description.hairColor) characterDesc += `, ${char.description.hairColor} hair`
          if (char.description.eyeColor) characterDesc += `, ${char.description.eyeColor} eyes`
          if (char.description.uniqueFeatures && char.description.uniqueFeatures.length > 0) {
            characterDesc += `, ${char.description.uniqueFeatures.join(', ')}`
          }
        }
        characterDesc += ` - A warm and caring family member`
      } else {
        // Other
        characterDesc += `\n${charNumber}. ${charName}`
        // Add appearance details if available
        if (char.description) {
          if (char.description.hairColor) characterDesc += ` with ${char.description.hairColor} hair`
          if (char.description.eyeColor) characterDesc += `, ${char.description.eyeColor} eyes`
          if (char.description.uniqueFeatures && char.description.uniqueFeatures.length > 0) {
            characterDesc += `, ${char.description.uniqueFeatures.join(', ')}`
          }
        }
      }
    })
    
    characterDesc += `\n\n**CRITICAL - CHARACTER USAGE REQUIREMENTS (MANDATORY - NO EXCEPTIONS):**`
    characterDesc += `\n- ALL ${characters.length} characters MUST appear in the story`
    characterDesc += `- The main character is ${characterName}`
    characterDesc += `- Use ALL character names (${characters.map(c => c.name || c.type.displayName).join(', ')}) throughout the story, not generic terms like "friends" or "companions"`
    
    // Character distribution requirements (NEW: 25 Ocak 2026)
    const familyMembers = characters.filter(c => c.type?.group === "Family Members")
    if (familyMembers.length > 0) {
      characterDesc += `\n\n**FAMILY MEMBERS USAGE (MANDATORY):**`
      characterDesc += `\n- Family Members (${familyMembers.map(c => c.name || c.type.displayName).join(', ')}) MUST appear in multiple pages`
      characterDesc += `\n- Each Family Member should appear in at least ${Math.max(3, Math.floor(getPageCount(ageGroup, pageCount) * 0.4))} pages`
      characterDesc += `\n- DO NOT exclude any Family Member from the story - ALL must be included`
    }
    
    characterDesc += `\n\n**CHARACTER DISTRIBUTION REQUIREMENTS:**`
    characterDesc += `\n- ALL ${characters.length} characters should appear throughout the story`
    characterDesc += `\n- Each character should appear in at least ${Math.max(2, Math.floor(getPageCount(ageGroup, pageCount) * 0.3))} pages`
    characterDesc += `\n- Main character (${characterName}) will appear in most/all pages`
    if (characters.length > 2) {
      characterDesc += `\n- Pages 2-${Math.floor(getPageCount(ageGroup, pageCount) * 0.6)} should feature at least 2 characters`
      characterDesc += `\n- Pages ${Math.floor(getPageCount(ageGroup, pageCount) * 0.6) + 1}-${getPageCount(ageGroup, pageCount)} should feature all ${characters.length} characters when possible`
    }
    characterDesc += `\n- Distribute characters evenly - do not favor some characters over others`
    
    // CHARACTER MAPPING for JSON response
    characterDesc += `\n\nCHARACTER MAPPING (CRITICAL - for JSON response):\n`
    characters.forEach((char, index) => {
      characterDesc += `- Character ${index + 1}: ID="${char.id}", Name="${char.name || char.type.displayName}"\n`
    })
    
    characterDesc += `\n**CRITICAL - REQUIRED FIELD:** When returning the JSON, for EACH page, you MUST include a "characterIds" array indicating which characters appear on that page using their IDs from the mapping above.`
    characterDesc += `\n- "characterIds" is a REQUIRED field - do NOT omit it`
    characterDesc += `\n- Use the exact character IDs from the mapping above`
    characterDesc += `\n- Example: If page 2 features both ${characterName} and ${characters[1].name || characters[1].type.displayName}, set "characterIds": ["${characters[0].id}", "${characters[1].id}"]`
    characterDesc += `\n- **CRITICAL:** ALL ${characters.length} characters must appear in the story - check each page's characterIds to ensure ALL characters are included across all pages`
    characterDesc += `\n- **VERIFICATION:** Before returning JSON, verify that ALL character IDs (${characters.map(c => c.id).join(', ')}) appear in at least one page's characterIds array`
    characterDesc += `\n- **DO NOT** exclude any character - ALL ${characters.length} characters must be used in the story`
  } else if (characters && characters.length === 1) {
    // Single character - still include characterIds for consistency
    characterDesc += `\n\nCHARACTER MAPPING (CRITICAL - for JSON response):\n`
    characterDesc += `- Character 1: ID="${characters[0].id}", Name="${characters[0].name || characters[0].type.displayName}"\n`
    characterDesc += `\n**CRITICAL - REQUIRED FIELD:** When returning the JSON, for EACH page, you MUST include "characterIds": ["${characters[0].id}"]`
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

# STORY STRUCTURE - DETAILED PAGE-BY-PAGE REQUIREMENTS (NEW: 16 Ocak 2026)

**CRITICAL:** Each page MUST have a UNIQUE, DISTINCT scene. NO REPEATING SCENES or SIMILAR COMPOSITIONS.

**PACING CONTROL (NEW: 25 Ocak 2026):**
- **Strong hook early:** First 2 sentences must grab attention and create interest
- **Shorter scenes:** Each page should be a complete mini-scene, not dragging on
- **Predictable patterns:** For younger ages, use repetition and patterns (e.g., "First they tried X, then Y, then Z")
- **Scene-by-scene breakdown:** Each page should have clear beginning, middle, and end
- **Pacing variety:** Mix fast-paced action scenes with slower, contemplative moments
- **Page transitions:** Smooth transitions between pages, but each page should feel complete

## Page-by-Page Structure:

**Page 1 (Cover):**
- Professional book cover illustration
- Main character prominently featured with ${characters && characters.length > 1 ? 'all companions' : 'theme elements'}
- Visually striking, colorful, professional
- Different from all subsequent pages (unique composition)

**Page 2 (Introduction):**
- Introduction scene - DIFFERENT location/setting from cover
- DIFFERENT time of day or weather from cover
- DIFFERENT composition (e.g., wide shot if cover is close-up)
- Introduce ${characterName} and setting

**Pages 3-5 (Adventure Begins):**
Each page MUST have DIFFERENT scenes:
- **Page 3 (Discovery):** New location, different perspective (e.g., close-up if previous was wide), ${characterName} discovers something interesting
- **Page 4 (Action):** Different location, different composition (e.g., dynamic angle), active exploration or action scene
- **Page 5 (Exploration):** Different location, different time of day (e.g., afternoon if previous was morning), deeper exploration

**Pages 6-8 (Challenge & Problem-Solving):**
Each page MUST have DIFFERENT scenes:
- **Page 6 (Problem):** Different location, different mood, introduce age-appropriate challenge
- **Page 7 (Attempt):** Different location, different perspective, ${characterName} attempts to solve the problem
- **Page 8 (Solution):** Different location, different composition, creative solution emerges

**Pages 9-10 (Resolution & Ending):**
Each page MUST have DIFFERENT scenes:
- **Page 9 (Resolution):** Different location, different time of day (e.g., evening), problem resolved with valuable lesson
- **Page 10 (Happy Ending):** Different location, different composition (e.g., wide shot with ${characters && characters.length > 1 ? 'all characters' : 'full scene'}), return home or celebration

**LOCATION VARIETY REQUIREMENT:**
- Each page should be in a DIFFERENT location OR show a DIFFERENT part of the same location
- Example progression: home → forest entrance → deep forest → clearing → mountain → cave → river → summit → returning home → home (celebration)
- DO NOT repeat the same location on consecutive pages

**TIME PROGRESSION REQUIREMENT:**
- Vary time of day across pages to show story progression
- Example progression: morning → late morning → noon → afternoon → late afternoon → evening → sunset → dusk → night or next morning
- DO NOT use the same time of day for multiple consecutive pages

# THEME-SPECIFIC ELEMENTS
Setting: ${themeConfig.setting}
Include: ${themeConfig.commonElements.join(', ')}
Mood: ${themeConfig.mood}, warm, inviting
Educational Focus: ${getEducationalFocus(ageGroup, theme)}
Clothing Style: ${themeConfig.clothingStyle || 'age-appropriate casual clothing'}

CRITICAL - CHARACTER CLOTHING: Character must wear ${themeConfig.clothingStyle || 'age-appropriate casual clothing'} throughout the story. DO NOT use formal wear (suits, ties, dress shoes) unless the story explicitly requires it (e.g., "going to a wedding"). Clothing must be appropriate for the theme and setting (e.g., camping → outdoor/casual clothes, NOT formal wear).

# CRITICAL - VISUAL DIVERSITY REQUIREMENTS (MANDATORY - NEW: 16 Ocak 2026)

**EACH PAGE MUST HAVE A UNIQUE, DISTINCT SCENE - NO REPEATING SCENES:**

## 1. Location Variety (MANDATORY):
- Each page should be in a DIFFERENT location or show a DIFFERENT part of the same location
- Examples: Page 2 (home), Page 3 (forest entrance), Page 4 (deep forest), Page 5 (clearing), Page 6 (mountain), Page 7 (cave), Page 8 (river), Page 9 (summit), Page 10 (returning home)
- **DO NOT repeat the same location on consecutive pages**

## 2. Time of Day Variety (MANDATORY):
- Vary time of day across pages to show story progression
- Examples: Page 2 (morning), Page 3 (late morning), Page 4 (noon), Page 5 (afternoon), Page 6 (late afternoon), Page 7 (evening), Page 8 (sunset), Page 9 (dusk), Page 10 (night or next morning)
- **DO NOT use the same time of day for multiple consecutive pages**

## 3. Weather/Atmosphere Variety:
- Vary weather or atmospheric conditions when appropriate for the story
- Examples: sunny → partly cloudy → windy → sunny → cloudy → light rain → clearing → beautiful weather
- Use weather changes to enhance mood and story progression

## 4. Perspective/Camera Angle Variety (MANDATORY):
- Vary camera angles and perspectives for visual interest
- Options: wide shot, medium shot, close-up, bird's eye view, low angle, high angle, eye level
- Examples: Page 2 (wide shot), Page 3 (medium shot), Page 4 (close-up), Page 5 (bird's eye view), Page 6 (low angle)
- **DO NOT use the same perspective for multiple consecutive pages**

## 5. Composition Variety (MANDATORY):
- Vary composition and framing for visual diversity
- Options: character centered, character left (environment right), character right (action left), balanced, diagonal, symmetrical, group composition
- Examples: Page 2 (character centered), Page 3 (character left), Page 4 (diagonal composition), Page 5 (balanced)
- **DO NOT repeat the same composition for multiple consecutive pages**

## 6. Action/Mood Variety (MANDATORY):
- Vary character actions and emotional tones across pages
- Examples: calm introduction → excited discovery → active exploration → curious investigation → determined problem-solving → creative thinking → joyful solution → proud resolution → happy celebration
- **DO NOT repeat the same action/mood for multiple consecutive pages**

## CRITICAL CHECKLIST FOR EACH PAGE:
Before finalizing each page's imagePrompt, verify ALL of these:
- ✓ Location is DIFFERENT from previous page (or different part of same location)
- ✓ Time of day is DIFFERENT from previous page (or clearly progressing)
- ✓ Weather/atmosphere is DIFFERENT from previous page (or clearly changing) - if appropriate
- ✓ Perspective/camera angle is DIFFERENT from previous page
- ✓ Composition is DIFFERENT from previous page
- ✓ Action/mood is DIFFERENT from previous page
- ✓ Scene description is DETAILED (at least 150-200 characters, NOT just 70-80)
- ✓ Image prompt is DETAILED (at least 200+ characters with specific visual elements)

# WRITING STYLE REQUIREMENTS (CRITICAL - NEW: 15 Ocak 2026)

**TEXT LENGTH REQUIREMENT:** Each page MUST be approximately ${getWordCount(ageGroup)} words (AVERAGE). This means detailed, rich text - NOT short, simple sentences.

1. **Include dialogue between characters** (use quotation marks)
   - Characters should talk to each other naturally
   - Include character actions with dialogue (e.g., "Look!" ${characterName} said, pointing)
   - Use dialogue to show personality and emotions
   - Balance dialogue with descriptive narration
   - **Dialogue adds length and richness - use it!**
   
2. **Describe emotions and feelings with sensory details**
   - Show character's internal thoughts and emotional responses
   - Use ALL sensory details (what they see, hear, feel, smell, taste)
   - **Visual:** What they see - colors, lighting, textures, shapes, movements
   - **Auditory:** What they hear - sounds, music, nature sounds, voices, silence
   - **Tactile:** What they feel - textures, temperature, wind, surfaces, objects
   - **Olfactory:** What they smell - flowers, food, nature scents, fresh air
   - **Gustatory:** What they taste (if applicable) - food, drinks, fresh air
   - Example: "${characterName} felt proud and warm, even as the evening air grew cooler. The golden sunset painted everything in orange and pink. ${characterName} could hear birds singing and smell the sweet scent of wildflowers. The soft grass felt ticklish under ${characterName}'s feet."
   - **Detailed emotions with sensory details add word count - be descriptive!**
   
3. **Use descriptive language for atmosphere and setting**
   - Paint a vivid picture with words
   - Describe lighting, colors, textures, sounds
   - Create immersive scenes
   - Example: "As the sun began to set, the sky turned orange and pink and purple, painting everything with magical colors"
   - **Atmospheric descriptions are essential for reaching ${getWordCount(ageGroup)} words**
   
4. **Show, don't just tell**
   
   **BAD (TOO SHORT - DO NOT DO THIS):**
   "${characterName} went to the forest. She saw trash. She cleaned it."
   - Only 3 sentences, ~15 words - TOO SHORT!
   - No dialogue, no sensory details, no atmosphere
   - Just tells what happened, doesn't show it
   - Boring and flat
   
   **GOOD (${getWordCount(ageGroup)} words - DO THIS):**
   "As ${characterName} walked along the forest path, the morning sun filtered through the tall trees, creating dappled patterns on the ground. 'What's that?' ${characterName} asked, stopping to look at something colorful on the path. ${characterName} could hear birds chirping overhead and smell the fresh, earthy scent of the forest. The air felt cool and refreshing. ${characterName} bent down and picked up a piece of colorful paper. 'This doesn't belong here,' ${characterName} said thoughtfully. ${characterName} looked around and saw more trash scattered nearby. 'I should clean this up,' ${characterName} decided, feeling determined. With a smile, ${characterName} began collecting the trash, feeling proud to help the forest."
   - Multiple sentences with dialogue
   - Sensory details: see (sun, trees, patterns), hear (birds), smell (forest), feel (cool air)
   - Shows emotions and thoughts
   - Creates atmosphere and immersion
   - **IMPORTANT:** All examples in this prompt are in English for instruction purposes, but YOUR story text MUST be written entirely in ${getLanguageName(language)}
   
5. **Page structure** (each page should include ALL of these to reach ${getWordCount(ageGroup)} words):
   - Opening description (setting the scene atmospherically - 2-3 sentences)
   - Character action or dialogue (2-3 sentences with dialogue)
   - Emotional response or internal thought (1-2 sentences)
   - Transition or scene continuation (1-2 sentences)
   - **Total: 6-10 sentences per page = ${getWordCount(ageGroup)} words**
   
6. **Example of quality writing structure (${getWordCount(ageGroup)} words):**
   
   Here's how I like it - example text for ${ageGroup} age group (${getLanguageName(language)}):
   
   ${getExampleText(ageGroup, characterName, language, characters)}
   
   **CRITICAL:** All text in your story MUST be in ${getLanguageName(language)} - the example above is in ${getLanguageName(language)} to show you the style. Write your story in the same language, with the same level of detail, dialogue, and sensory richness.

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
6. **Sensory details visualization (NEW: 25 Ocak 2026):** Include visual elements that represent the sensory details from the story text:
   - Visual: Show the colors, lighting, textures mentioned in the text
   - Auditory: Show elements that suggest sounds (birds, rustling leaves, flowing water)
   - Tactile: Show textures and surfaces that characters interact with
   - Olfactory: Show flowers, food, or nature elements that suggest scents

# VISUAL SAFETY GUIDELINES (CRITICAL - NEW: 18 Ocak 2026)
**To avoid anatomical errors in generated images, follow these guidelines:**

## AVOID RISKY HAND INTERACTIONS:
- **DO NOT** have characters holding hands
- **DO NOT** have characters holding detailed objects (books, toys, tools)
- **DO NOT** have complex hand gestures (pointing with fingers, thumbs up, peace signs)
- **DO NOT** have hands overlapping between characters
- **DO NOT** have detailed hand-to-object interactions

## PREFER SAFE HAND POSES:
- **DO** keep hands at sides in natural relaxed poses
- **DO** use simple raised hand for waving (open palm)
- **DO** use arms spread wide for joy/excitement
- **DO** use hands behind back
- **DO** use hands on hips
- **DO** describe hands as "in natural relaxed pose" without specifics

## SAFE CHARACTER INTERACTIONS:
- Characters can stand together, but keep hands separate
- Characters can talk to each other, but avoid hand contact
- If story requires "giving" something, describe it verbally without showing detailed hand interaction
- Focus on character facial expressions and body language rather than complex hand poses

**EXAMPLE - BAD (Risky):** "${characterName} and ${characters && characters.length > 1 ? characters[1].name || characters[1].type.displayName : 'friend'} holding hands, walking together through the forest"
**EXAMPLE - GOOD (Safe):** "${characterName} and ${characters && characters.length > 1 ? characters[1].name || characters[1].type.displayName : 'friend'} walking together through the forest, hands at their sides, smiling at each other"

**REMEMBER:** Simple, clear poses = better anatomical accuracy. Complex hand interactions = higher error rate.

# OUTPUT FORMAT (JSON)
Return a valid JSON object with this exact structure:
{
  "title": "Story title",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page text (CRITICAL: Must be ${getWordCount(ageGroup)} words - this is the AVERAGE, write detailed text with dialogue and descriptions)",
      "imagePrompt": "DETAILED ${illustrationStyle} illustration prompt (MUST be 200+ characters) with:
        - SPECIFIC location description (e.g., 'in a sunny forest clearing with tall oak trees, wildflowers, and a babbling brook')
        - SPECIFIC time of day (e.g., 'late afternoon with golden sunlight filtering through leaves')
        - SPECIFIC weather/atmosphere (e.g., 'partly cloudy sky with gentle breeze')
        - SPECIFIC perspective/camera angle (e.g., 'medium shot from eye level, character in foreground')
        - SPECIFIC composition (e.g., 'character on left side, environment on right, balanced framing')
        - SPECIFIC character action and pose (e.g., 'character kneeling, examining something on the ground with curious expression')
        - SPECIFIC environmental details (e.g., 'fallen leaves, mushrooms, small insects, dappled sunlight')
        - Character consistency (same character as previous pages)
        - Theme elements (${theme})
        - Mood: ${themeConfig.mood}
        - CRITICAL: This scene MUST be DIFFERENT from previous pages - different location, different time, different composition, different perspective",
      "sceneDescription": "DETAILED scene description (MUST be 150+ characters) including:
        - SPECIFIC location (where exactly is this happening? e.g., 'deep in the enchanted forest, near a sparkling stream')
        - SPECIFIC time of day (morning/late morning/noon/afternoon/late afternoon/evening/sunset/dusk/night)
        - SPECIFIC weather/atmosphere (sunny/partly cloudy/cloudy/windy/light rain/snowy - if appropriate)
        - SPECIFIC character action (what is the character doing exactly? e.g., 'kneeling down to examine colorful mushrooms')
        - SPECIFIC environmental details (what objects, animals, plants, or features are visible? e.g., 'tall oak trees, wildflowers, butterflies, moss-covered rocks')
        - SPECIFIC emotional tone (how does the character feel? what's the mood? e.g., 'curious and excited, with a sense of wonder')
        - CRITICAL: This scene MUST be DIFFERENT from previous pages",
      "characterIds": ["character-id-1", "character-id-2"] // REQUIRED: Which characters appear on this page (use IDs from CHARACTER MAPPING)
      // CRITICAL: ALL ${characters.length} characters (${characters.map(c => c.id).join(', ')}) must appear across all pages
      // Main character (${characterName}) will appear in most pages
      // Family Members (${characters.filter(c => c.type?.group === "Family Members").map(c => c.name || c.type.displayName).join(', ')}) must appear in multiple pages
      // Example with all 3 characters: "characterIds": ["${characters[0].id}", "${characters[1].id}", "${characters[2]?.id || ''}"]
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

CRITICAL: The "characterIds" field is REQUIRED for each page. You MUST include it for every page using the character IDs from the CHARACTER MAPPING section.

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

## SAFETY & AGE-APPROPRIATE ACTIONS (CRITICAL - NEW: 25 Ocak 2026):
- **AVOID ambiguous actions that could trigger safety filters:**
  - DO NOT use "dans etmek" (dancing) for adult characters in certain contexts - use "hareket etmek" (moving), "neşeli şarkılar söylemek" (singing happy songs), "coşkuyla eğlenmek" (joyfully celebrating) instead
  - DO NOT use "sarılmak" (hugging) in ways that could be misinterpreted - use "kucaklaşmak" (embracing), "sevecen bir şekilde yaklaşmak" (approaching warmly) instead
  - DO NOT use physical interactions that could be ambiguous - keep all interactions clearly family-friendly and age-appropriate
- **PREFER clear, innocent actions:**
  - "el ele tutuşmak" (holding hands), "birlikte yürümek" (walking together), "birlikte oynamak" (playing together)
  - "gülmek" (laughing), "gülümsemek" (smiling), "neşelenmek" (being cheerful)
  - "şarkı söylemek" (singing), "müzik dinlemek" (listening to music), "şarkı mırıldanmak" (humming songs)
- **ALWAYS ensure actions are clearly innocent and family-safe**
- If unsure about an action, use a safer alternative that conveys the same positive emotion

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
  // Updated word counts (25 Ocak 2026): All values are AVERAGES, doubled from previous version
  // User request: Increase word counts by 2x for richer story content
  const counts: Record<string, string> = {
    toddler: '70-90',           // avg 80 words (doubled from 35-45)
    preschool: '100-140',        // avg 120 words (doubled from 50-70)
    'early-elementary': '160-200', // avg 180 words (doubled from 80-100)
    elementary: '220-260',       // avg 240 words (doubled from 110-130)
    'pre-teen': '220-260',       // avg 240 words (doubled from 110-130)
  }
  return counts[ageGroup] || '160-200'
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

/**
 * Get example text for age group (NEW: 25 Ocak 2026)
 * Provides concrete examples with dialogue, sensory details, and atmosphere
 */
function getExampleText(
  ageGroup: string,
  characterName: string,
  language: string,
  characters?: Array<{ name?: string; type: { displayName: string } }>
): string {
  // Note: Examples are in English for instruction, but the actual story should be in the specified language
  // The function returns English examples as templates - the model should write in the target language
  
  const companionName = characters && characters.length > 1 
    ? (characters[1].name || characters[1].type.displayName)
    : 'companion'
  
  const examples: Record<string, string> = {
    toddler: `"Look!" ${characterName} said, pointing at the colorful flowers. The sun felt warm on ${characterName}'s face. ${characterName} smiled and touched the soft petals. "Pretty!" ${characterName} giggled. The flowers smelled sweet like honey.`,
    
    preschool: `"Wow!" ${characterName} said, looking at the big tree. The leaves rustled in the gentle breeze. ${characterName} could hear birds singing high above. "I want to climb it!" ${characterName} said excitedly. The bark felt rough under ${characterName}'s small hands.`,
    
    'early-elementary': `As ${characterName} walked through the forest, the morning sun filtered through the tall trees. "This is amazing!" ${characterName} whispered to ${companionName}. The air smelled fresh and earthy, like rain and pine needles. ${characterName} could hear the crunch of leaves underfoot and the distant call of a bird. "I feel so happy here," ${characterName} said, feeling the warm sunlight on ${characterName}'s face.`,
    
    elementary: `The golden afternoon light painted everything in warm colors as ${characterName} and ${companionName} explored the meadow. "Do you hear that?" ${characterName} asked, stopping to listen. The gentle hum of bees mixed with the rustle of tall grass in the breeze. ${characterName} took a deep breath, smelling wildflowers and fresh earth. "This is the best day ever!" ${characterName} said, feeling the soft grass tickle ${characterName}'s bare feet. The sky above was a brilliant blue with fluffy white clouds.`,
    
    'pre-teen': `As the sun began to set, casting long shadows across the path, ${characterName} felt a sense of wonder. "Look at those colors," ${characterName} said to ${companionName}, pointing at the sky painted in orange, pink, and purple. The evening air was cool against ${characterName}'s skin, and ${characterName} could hear the distant sound of crickets beginning their nightly song. "I'll never forget this moment," ${characterName} thought, feeling grateful and peaceful. The world seemed to slow down, and everything felt perfect.`,
  }
  
  return examples[ageGroup] || examples['early-elementary']
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

