# 📖 Story Generation Prompt Template v1.0.0

**KidStoryBook Platform - Story Generation Prompts**

**Version:** 1.0.3  
**Release Date:** 15 Ocak 2026  
**Last Update:** 18 Ocak 2026 (Character Mapping Per Page)  
**Status:** ✅ Active  
**Author:** @prompt-manager  
**Based on:** POC analysis and quality improvements

---

## 📋 Overview

Bu template, **GPT-4o** ve diğer GPT modelleri için optimize edilmiş hikaye üretim prompt'larını içerir. POC'deki detaylı prompt yapısından ilham alınarak oluşturulmuştur ve yaş grubuna uygun dil seviyesine özel vurgu yapar.

**Kritik Hedef:** Yaş grubuna uygun, eğlenceli ve eğitici değer taşıyan çocuk hikayeleri üretmek.

---

## 🎯 Core Principles

1. **Yaş Uygunluğu:** Dil seviyesi ve içerik yaş grubuna uygun olmalı
2. **Eğitici Değer:** Pozitif değerler (dostluk, cesaret, merak, nezaket) içermeli
3. **Eğlenceli:** Çocukları cezbedecek maceralı ve eğlenceli olmalı
4. **Kişiselleştirilmiş:** Ana karakter çocuğun fotoğrafından çıkarılan özelliklere uygun olmalı
5. **Görsel Uyumu:** Her sayfa için detaylı görsel prompt'ları içermeli

---

## 📝 Template Structure

### Base Template

```markdown
You are a professional children's book author. You write personalized children's stories.

# TASK
Create a magical and engaging 10-page children's story.

# CHARACTER INFORMATION
- **Main Character:** [CHARACTER_NAME], [AGE] years old, [GENDER]
  - Physical features (for story text): [CHARACTER_FEATURES_STORY_LANGUAGE]
  - Physical features (for image prompts - MUST be in English): [CHARACTER_FEATURES_ENGLISH]
  - Photo reference: The child in the uploaded photo

ADDITIONAL CHARACTERS:
[IF MULTIPLE CHARACTERS EXIST]
2. [CHARACTER_2_NAME] ([CHARACTER_NAME]'s [CHARACTER_2_TYPE]) - [AGE] years old, [HAIR_COLOR] hair, [EYE_COLOR] eyes, [SPECIAL_FEATURES] - A warm and caring family member
3. [CHARACTER_3_NAME] ([CHARACTER_NAME]'s [CHARACTER_3_TYPE]) - [AGE] years old, [HAIR_COLOR] hair, [EYE_COLOR] eyes - A warm and caring family member
[END IF]

**IMPORTANT:** All [TOTAL_CHARACTER_COUNT] characters should appear in the story. The main character is [CHARACTER_NAME]. Use the character names ([CHARACTER_NAMES_LIST]) throughout the story, not generic terms like "friends" or "companions".

# STORY SETTINGS
- **Theme:** [THEME] - [SUBTHEME]
- **Age Group:** [AGE_GROUP] years
- **Story Language:** [STORY_LANGUAGE] (IMPORTANT: Write the story text in [STORY_LANGUAGE], but keep all instructions and image prompts in English)
- **Special Requests:** [CUSTOM_REQUESTS] (If provided, incorporate these requests into the story content and theme. If not provided, use 'None')

# STORY REQUIREMENTS
1. Total length: 10 pages
2. Language complexity: Age-appropriate for [AGE_GROUP] age group
3. Tone: Warm, encouraging, magical, adventurous
4. Structure:
   - **Page 1: BOOK COVER** (CRITICAL: This must be designed as a book cover page)
     * Should include the book title prominently
     * Main character should be featured prominently and attractively
     * Should represent the theme and adventure
     * Should be visually striking and professional
     * Text can be minimal (title + subtitle or brief introduction)
   - Page 2: Introduction and story beginning
   - Pages 3-7: Adventure and challenges
   - Pages 8-9: Resolution and lessons learned
   - Page 10: Happy ending and closing
5. Positive values: Friendship, courage, curiosity, kindness

# FORMAT
Return as JSON:
{
  "title": "Book title in [STORY_LANGUAGE]",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page 1 text in [STORY_LANGUAGE] - This is the BOOK COVER page. Can be minimal (just title) or include a brief introduction ([WORD_COUNT_MIN]-[WORD_COUNT_MAX] words)",
      "imagePrompt": "BOOK COVER ILLUSTRATION (NOT a book mockup): Professional children's book cover illustration as a FLAT, STANDALONE ILLUSTRATION (NOT a 3D book object, NOT a book on a shelf, NOT a photograph of a physical book). The main character ([CHARACTER_NAME]), a [AGE]-year-old [GENDER] with [CHARACTER_FEATURES_ENGLISH], should be prominently featured in the center or foreground. CRITICAL: Match the exact hair length, style, and texture from the uploaded photo - if the photo shows short hair, show short hair; if long, show long; match the exact curl pattern and texture. IMPORTANT: The character should RESEMBLE the child in the photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering. The character should look like a stylized illustration that captures the child's features (hair color, eye color, face shape, etc.) but in the chosen illustration style. It should be clearly an illustration, not a photograph. Include elements representing the theme ([THEME] - [SUBTHEME]). CRITICAL: NO TEXT, NO WRITING, NO LETTERS, NO WORDS, NO TITLES in the image - text will be added separately as a separate layer. Use [ILLUSTRATION_STYLE_DESCRIPTION] style. [3D_ANIMATION_SPECIAL_NOTES_IF_APPLICABLE] Make it visually striking, colorful, and appealing to children. The cover should look professional and print-ready. DO NOT create a book mockup or 3D book object - create a flat illustration. CRITICAL: This image description must be entirely in English - no Turkish words allowed.",
      "characterIds": ["character-id-1", "character-id-2"] // REQUIRED: Which characters appear on this page (use IDs from CHARACTER MAPPING)
    },
    {
      "pageNumber": 2,
      "text": "Page 2 text in [STORY_LANGUAGE] ([WORD_COUNT_MIN]-[WORD_COUNT_MAX] words) - Story introduction",
      "imagePrompt": "Detailed visual description for this page as an ILLUSTRATION (NOT a photograph). The character ([CHARACTER_NAME]) has [CHARACTER_FEATURES_ENGLISH]. CRITICAL: Match the exact hair length, style, and texture from the uploaded photo - if the photo shows short hair, show short hair; if long, show long; match the exact curl pattern and texture. IMPORTANT: The character should RESEMBLE the child in the photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering. The character should look like a stylized illustration that captures the child's features but in the chosen illustration style. It should be clearly an illustration, not a photograph. Theme: [THEME] - [SUBTHEME]. Style: [ILLUSTRATION_STYLE_DESCRIPTION]. [3D_ANIMATION_SPECIAL_NOTES_IF_APPLICABLE] CRITICAL: This image description must be entirely in English - no Turkish words allowed.",
      "characterIds": ["character-id-1", "character-id-2"] // REQUIRED: Which characters appear on this page (use IDs from CHARACTER MAPPING)
    }
    // ... pages 3-10 follow the same pattern
  ],
  "moral": "The story's main message in [STORY_LANGUAGE]"
}

# IMPORTANT NOTES
- **Page 1 is the BOOK COVER**: Must be designed as a professional book cover with the main character prominently featured, theme elements. **CRITICAL: NO TEXT, NO WRITING, NO LETTERS, NO WORDS, NO TITLES in the image - text will be added separately as a separate layer**
- Use the character's name ([CHARACTER_NAME]) frequently in the story text
- Write story text in [STORY_LANGUAGE], but image prompts must be in English
- Simple and rhythmic language appropriate for [AGE_GROUP] age group
- Page 1 can have minimal text (just title or brief intro), pages 2-10 should have [WORD_COUNT_MIN]-[WORD_COUNT_MAX] words each
- Make visual descriptions detailed and specify [ILLUSTRATION_STYLE_DESCRIPTION] style (in English)
- Maintain character consistency across all pages
- Make the story age-appropriate and engaging

Now create the story!
```

---

## 👶 Age Group Specific Requirements

**IMPORTANT UPDATE (15 Ocak 2026):** Word counts are now AVERAGES, not fixed values. AI can vary within the range.

### 0-2 Years (Toddler)
- **Word Count:** 35-45 words per page (AVERAGE: 40 - can vary within range)
- **Language:** Very simple words, repetitive phrases
- **Structure:** Short sentences (3-5 words max)
- **Features:** Onomatopoeia (sound words), rhythmic like a song, simple dialogue
- **Example:** "Elif sees a big ball. Bounce, bounce, bounce! The ball is red and round. 'Ball!' Elif said happily. Bounce, bounce, bounce! Elif and the ball play together."

### 3-5 Years (Preschool)
- **Word Count:** 50-70 words per page (AVERAGE: 60 - can vary within range)
- **Language:** Simple but varied vocabulary
- **Structure:** Short sentences (5-8 words), include dialogue
- **Features:** Action words, emotions, dialogue, descriptive language, fun and energetic
- **NEW:** Emphasis on dialogue and atmospheric description
- **Example:** "Elif and Mert walked to the park. The sun was shining brightly, warming their faces. 'Look!' said Elif, pointing excitedly. 'What's that?' Behind the big oak tree, they saw something glowing softly. Elif felt curious and a little bit excited. 'Should we go see?' Mert nodded with a big smile."

### 6-9 Years (Early Elementary)
- **Word Count:** 80-100 words per page (AVERAGE: 90 - can vary within range)
- **Language:** More complex vocabulary appropriate for early readers
- **Structure:** Longer sentences (8-12 words), rich dialogue
- **Features:** Dialogue, character interactions, problem-solving, adventure with challenges, detailed descriptions
- **NEW:** Strong emphasis on atmosphere, emotions, and "show don't tell"
- **Example:** "Elif couldn't believe her eyes. The egg was much larger than she expected, glowing with soft golden light that seemed to pulse gently. She carefully approached it, her heart beating with excitement and a little bit of fear. The air around the egg felt warm and tingly. 'Should we touch it?' Mert asked, staying close to his sister. Elif reached out slowly, her fingers trembling slightly. 'I think... I think it wants us to,' she whispered."

### 10+ Years (Elementary)
- **Word Count:** 110-130 words per page (AVERAGE: 120 - MAXIMUM 120 words)
- **Language:** Rich vocabulary, complex concepts
- **Structure:** Varied sentence lengths, sophisticated dialogue
- **Features:** Complex problem-solving, deeper emotional exploration, detailed world-building
- **Example:** Extended narratives with multiple paragraphs, dialogue exchanges, and detailed sensory descriptions

---

## ✍️ Writing Style Requirements (NEW: 15 Ocak 2026)

**Critical for quality improvement - matching Magical Children's Book examples**

### 1. Include Dialogue
- Characters should talk to each other naturally
- Use quotation marks for speech
- Include character actions with dialogue
- Example: `"Look!" Lisa said, pointing excitedly at the sky`

### 2. Describe Emotions and Feelings
- Show character's internal thoughts
- Use sensory details (what they see, hear, feel, smell)
- Example: `Lisa felt proud and warm, even as the evening air grew cooler`

### 3. Use Descriptive Language for Atmosphere
- Paint vivid pictures with words
- Describe lighting, colors, textures, sounds
- Create immersive scenes
- Example: `As the sun began to set, the sky turned orange and pink and purple, painting everything with magical colors`

### 4. Show, Don't Just Tell
- **Instead of:** "Lisa went to the forest"
- **Write:** "As Lisa stepped into the forest, sunlight filtered through the leaves, creating dancing shadows on the path ahead"

### 5. Page Structure Template
Each page should include:
1. **Opening description** - Set the scene atmospherically
2. **Character action or dialogue** - What's happening
3. **Emotional response** - How character feels
4. **Transition or continuation** - Move story forward

**Example Structure:**
```
[Atmospheric description]. [Character action]. "[Dialogue]," [Character name] said [with action]. [Emotional response]. [Scene continuation with sensory details].
```

**Full Example (3-5 years, ~60 words):**
```
As Lisa stepped into the forest, sunlight filtered through the tall trees, creating a magical atmosphere. She noticed something that made her stop. "Oh no," Lisa said softly, her smile fading. Scattered among the beautiful flowers were candy wrappers and plastic bottles. Her heart sank. "Someone left trash here. The flowers look sad." She knelt down to look closer, wanting to help.
```

---

## 🎭 Theme Variations

### Adventure Theme
```
The story should be adventurous with exciting challenges, mysterious places, and brave actions. Include elements of exploration and discovery. The main character should face obstacles and overcome them with courage and creativity.
```

### Fairy Tale Theme
```
The story should have magical elements, talking animals, enchanted objects, and a touch of wonder. Include fantasy creatures and magical transformations. Make it feel like a classic fairy tale but personalized.
```

### Educational Theme (Numbers)
```
The story should naturally incorporate counting from 1 to 10. Make learning fun through the adventure. Each number should be discovered or collected in the story. The numbers should appear organically, not forced.
```

### Educational Theme (Alphabet)
```
The story should naturally incorporate letters of the alphabet. Each page can focus on a different letter, or letters can appear throughout the story. Make learning fun and engaging.
```

### Nature and Animals Theme
```
The story should focus on nature, animals, and the environment. Include educational elements about animals, plants, or natural phenomena. Promote appreciation for nature and wildlife.
```

---

## 🔧 Implementation Notes

### Language Handling
- **Story Text:** Kullanıcı dil seçimine göre (Türkçe/İngilizce)
- **Image Prompts:** HER ZAMAN İngilizce (AI daha iyi anlıyor)
- **Instructions:** Her zaman İngilizce

### Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `[CHARACTER_NAME]` | Çocuğun adı | "Arya" |
| `[AGE]` | Çocuğun yaşı | 3 |
| `[GENDER]` | Cinsiyet | "girl" / "boy" |
| `[CHARACTER_FEATURES_STORY_LANGUAGE]` | Hikaye dilinde karakter özellikleri | "kahverengi saç, ela gözler" (TR) / "brown hair, hazel eyes" (EN) |
| `[CHARACTER_FEATURES_ENGLISH]` | İngilizce karakter özellikleri | "brown hair, hazel eyes" |
| `[THEME]` | Tema | "Adventure" |
| `[SUBTHEME]` | Alt tema | "treasure hunt" |
| `[AGE_GROUP]` | Yaş grubu | "0-2" / "3-5" / "6-9" |
| `[STORY_LANGUAGE]` | Hikaye dili | "Turkish" / "English" |
| `[CUSTOM_REQUESTS]` | Özel istekler | "Arya should find a treasure map" / "None" |
| `[ILLUSTRATION_STYLE_DESCRIPTION]` | Detaylı stil açıklaması | "3D Animation - Pixar/DreamWorks..." |
| `[WORD_COUNT_MIN]` | Minimum kelime sayısı | 20 / 40 / 60 |
| `[WORD_COUNT_MAX]` | Maximum kelime sayısı | 30 / 60 / 100 |

---

## ✅ Best Practices

1. **Yaş grubuna uygun dil seviyesi kullan**
2. **Karakter ismini sıkça kullan** (hikayede)
3. **Pozitif değerler ekle** (dostluk, cesaret, merak, nezaket)
4. **Görsel prompt'ları detaylı yaz** (her sayfa için)
5. **Image prompt'lar HER ZAMAN İngilizce** (story text kullanıcı dilinde olabilir)
6. **Karakter tutarlılığını koru** (her sayfada aynı özellikler)
7. **Kitap kapağı için özel talimatlar** (Page 1)

---

## 📊 Version History

### v1.0.0 (15 Ocak 2026)
- ✅ Initial release
- ✅ POC'deki detaylı prompt yapısından ilham alındı
- ✅ Yaş grubuna özel gereksinimler
- ✅ Tema varyasyonları
- ✅ Çok dilli destek (story text için)
- ✅ Detaylı görsel prompt'ları her sayfa için

### v1.0.1 (16 Ocak 2026 - Multiple Characters Support)
- ✅ **Enhanced Additional Characters Section** - Detailed appearance descriptions (age, hair color, eye color, features)
- ✅ **Character Name Usage Directive** - Explicit instruction to use character names (Zeynep, Cüneyt) instead of generic terms like "friends" or "companions"
- ✅ **Pets Support** - Fur color, eye color, special features for pets
- ✅ **Family Members Support** - Age, hair color, eye color, special features for family members
- ✅ **Other Characters Support** - Hair color, eye color, special features for other character types
- 🎯 **Goal:** Story uses specific character names and detailed descriptions, not generic terms

---

## 🔗 Related Documents

- `IMAGE_PROMPT_TEMPLATE_v1.0.0.md` - Görsel üretimi için prompt template
- `docs/reports/IMAGE_QUALITY_ANALYSIS.md` - Kalite analizi raporu
- `poc/server.js` - POC implementasyonu (referans)

---

## 📝 Example Output Structure

```json
{
  "title": "Arya's Lost Treasure Adventure",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Arya's Lost Treasure Adventure - A big adventure is beginning for a child!",
      "imagePrompt": "BOOK COVER ILLUSTRATION (NOT a book mockup): Professional children's book cover illustration as a FLAT, STANDALONE ILLUSTRATION...",
      "characterIds": ["7c9860ee-98bd-4f72-a95e-a20278a4c44f"]
    },
    {
      "pageNumber": 2,
      "text": "Arya was a curious little girl. She loved adventures and treasure hunts...",
      "imagePrompt": "Detailed visual description for this page as an ILLUSTRATION...",
      "characterIds": ["7c9860ee-98bd-4f72-a95e-a20278a4c44f"]
    }
    // ... pages 3-10
  ],
  "moral": "Friendship and courage are very important. Helping others and making new friends is wonderful."
}
```

---

**Son Güncelleme:** 16 Ocak 2026  
**Yöneten:** @prompt-manager agent  
**Not:** Bu template sürekli geliştirilmektedir. Feedback'lere göre güncellenecektir.

