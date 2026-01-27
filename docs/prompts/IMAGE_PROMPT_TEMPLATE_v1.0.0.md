# 🎨 Image Generation Prompt Template v1.0.0

**KidStoryBook Platform - Image Generation Prompts**

**Version:** 1.0.10  
**Release Date:** 15 Ocak 2026  
**Last Update:** 24 Ocak 2026 (Scene v1.7.0: Image API Refactor - Modülerleştirme, 3 fazlı refactor tamamlandı)  
**Status:** ✅ Active  
**Author:** @prompt-manager  
**Based on:** POC analysis and quality improvements

---

## 📋 Overview

Bu template, **gpt-image-1.5** (default) / **1024x1536** (portrait) / **quality: low** ayarları için optimize edilmiş görsel üretim prompt'larını içerir. POC'deki detaylı prompt yapısından ilham alınarak oluşturulmuştur ve karakter tutarlılığına özel vurgu yapar.

**Production Defaults (15 Ocak 2026):**
- Model: `gpt-image-1.5`
- Size: `1024x1536` (portrait orientation)
- Quality: `low`
- Rate Limit: 5 images per 90 seconds (Tier 1: 5 IPM)

**Kritik Hedef:** Yüklenen çocuk fotoğrafındaki çocuğa mümkün olduğunca benzeyen karakterler üretmek.

**NEW (16 Ocak 2026): Cover-as-Reference Yaklaşımı**
- Cover (Page 1) oluşturulduktan sonra, tüm sayfalarda (Pages 2-10) hem orijinal fotoğraflar hem de cover görseli referans olarak kullanılıyor
- Cover kalitesi KRİTİK - tüm sayfalarda referans olarak kullanılacak
- Cover'da TÜM karakterler (main + additional) görünmeli
- Hedef: %80-90+ karakter tutarlılığı (önceki %60-70'den iyileştirme)

---

## 🎯 Core Principles

1. **Karakter Tutarlılığı:** Her sayfada aynı çocuk görünmeli
2. **Detaylı Talimatlar:** Prompt ne kadar detaylı olursa, sonuç o kadar iyi olur
3. **Stil Tutarlılığı:** Tüm görseller aynı illustration style'da olmalı
4. **Yaş Uygunluğu:** Age-appropriate scenes ve content
5. **Kalite:** Print-ready, professional children's book illustrations
6. **Cover-as-Reference (NEW):** Cover tüm sayfalarda referans olarak kullanılır

---

## 🎯 Cover-as-Reference Yaklaşımı (NEW: 16 Ocak 2026)

### Sorun
- Her sayfa için referans fotoğraf gönderiliyor, ama GPT-image-1.5 her seferinde fotoğrafı yeniden yorumluyor
- Sonuç: Karakterler birbirine yakın ama %100 aynı değil (%60-70 tutarlılık)

### Çözüm
Cover (Page 1) oluşturulduktan sonra, tüm sayfalarda (Pages 2-10) hem orijinal fotoğraflar hem de cover görseli referans olarak kullanılıyor.

### Workflow

#### Page 1 (Cover) Generation
```
Reference Images: [photo1.jpg, photo2.jpg, ...] (All character photos)
Prompt: 
- CRITICAL COVER QUALITY REQUIREMENTS
- This cover will be used as reference for ALL subsequent pages
- ALL characters must be prominently featured
- Each character must match their reference photo EXACTLY
- Professional, print-ready, high-quality illustration
```

#### Pages 2-10 Generation
```
Reference Images: [photo1.jpg, photo2.jpg, ..., cover.png] (Photos + Cover)
Prompt:
- CRITICAL COVER REFERENCE CONSISTENCY
- ALL characters must look EXACTLY like in cover image
- Match ALL features from cover (hair, eyes, face, skin tone)
- Only clothing and pose can change
```

### Beklenen İyileşme

| Metrik | Öncesi | Sonrası (Beklenen) |
|--------|--------|-------------------|
| Karakter Tutarlılığı | %60-70 | %80-90 |
| Saç Uzunluğu/Stili | %50-60 | %85-95 |
| Göz Rengi | %70-80 | %90-95 |
| Yüz Özellikleri | %60-70 | %80-90 |

### Cover Kalitesi - KRİTİK ÖNEM

Cover kalitesi **EXTREMELY IMPORTANT** çünkü:
1. Tüm sayfalarda (2-10) referans olarak kullanılacak
2. Cover'daki karakter görünümü tüm kitap boyunca devam edecek
3. Cover'da hata varsa, tüm sayfalarda tekrar edecek

**Cover için özel gereksinimler:**
- TÜM karakterler (main + additional) cover'da görünmeli
- Her karakter referans fotoğrafına EXACTLY benzemeli
- Saç rengi, uzunluğu, stili, dokusu, göz rengi, yüz özellikleri, ten rengi PRECISELY match etmeli
- **CRITICAL (NEW: v1.0.7):** Adult karakterler (Mom, Dad, etc.) için ADULT body proportions, ADULT facial features, ADULT height - NOT childlike features
- **CRITICAL (NEW: v1.0.7):** Age-appropriate physical characteristics - children look like children, adults look like adults
- Professional, print-ready, high-quality illustration
- Balanced group composition (çoklu karakter için)

### Cover vs First Interior Page (Scene v1.3.0 – 24 Ocak 2026)

**Amaç (3.5.20):** Kapak ile ilk iç sayfa (page 1) görselleri **açıkça farklı** olmalı.

- **Cover:** Composition ve kamera, first interior page’den **belirgin şekilde farklı** olmalı.
- **Page 1 (first interior):** Kapaktan **farklı** kamera açısı (örn. kapak = medium/portrait, sayfa 1 = wide veya low-angle), farklı kompozisyon (örn. rule of thirds, karakter off-center) ve/veya genişletilmiş sahne detayı. Aynı çerçeveyi **tekrarlama**.

### Cover Poster & Epic Wide (Scene v1.4.0 – 24 Ocak 2026)

**Amaç:** Kapak = "tüm kitabı anlatan" poster; epic wide, göz alıcı, dramatic lighting.

- **Cover = poster for the entire book;** suggest key locations, theme, and journey in one image.
- **Epic wide or panoramic** composition; character(s) as **guides into the world**, environment shows **the world of the story**.
- **Eye-catching, poster-like, movie-poster quality.** Reserve clear space for title at top.
- **Dramatic lighting** (e.g. golden hour, sun rays through clouds) where it fits the theme.
- **Cover:** epic wide; character **max 30–35%** of frame; **environment-dominant**.
- **Story-based cover (books route):** When `storyData` exists (full-book), unique locations from pages are extracted (`extractSceneElements`); "Evoke the full journey: [locations]. Key story moments and world of the story in one image." is injected into cover scene description.

### Age-Agnostic Scene Rules (Scene v1.5.0 – 24 Ocak 2026)

**Amaç:** 1 yaş da 9 yaş da **aynı** görsel kurallarla çizilsin; "simple background" / "clear focal point" kaldırılsın.

- **getAgeAppropriateSceneRules():** Yaştan bağımsız tek set: `rich background`, `detailed environment`, `visually interesting`, `bright colors`, `no scary elements` (elementary benzeri).

### First Interior – Character NOT Centered (Scene v1.5.0 – 24 Ocak 2026)

- **"Character centered" kaldırıldı.** "Character smaller in frame, NOT centered; use rule of thirds or leading lines (e.g. path)." eklendi.
- Tek karakter: "Character integrated into scene".

### Cover Prompt Softening (Scene v1.5.0 – 24 Ocak 2026)

- **characterAction:** "standing prominently in the center, looking at the viewer" → "character integrated into environment as guide into the world; sense of wonder and adventure".
- **Cover scene description:** "prominently displayed in the center" → "should be integrated into the scene" (moderation false positive riski azaltma).

### Moderation 400 → 1 Retry (books route v1.5.0)

- Cover edits API: 400 + `moderation_blocked` / `safety_violations` alındığında **1 kez** retry; FormData yeniden oluşturulup ikinci fetch. Yine 400 → throw.

---

## 📝 Template Structure

### Base Template

```markdown
You are a professional children's book author and illustrator. You create personalized children's books.

# TASK
Analyze the child's photo provided below and create PAGE [PAGE_NUMBER] for a children's book where this child is the hero.

# PHOTO ANALYSIS
Please carefully analyze the uploaded child's photo with EXTREME ATTENTION TO DETAIL:
- Estimate the child's age (approximately)
- Determine gender
- **Hair color, length, and style** (CRITICAL: Match the exact hair length, texture, and style from the photo - short, medium, long, curly, straight, wavy, etc.)
- **Eye color** (exact shade)
- **Skin tone** (exact shade)
- **Facial features** (face shape, nose, mouth, cheeks)
- **Unique features from image analysis** (e.g. glasses, freckles, dimples — AI extracts from reference photo)
- **Clothing** (if visible, exact colors and style)
- **Body proportions** (head size relative to body, etc.)
- **General appearance and characteristic features**

**IMPORTANT:** Pay special attention to hair length and style - this is often where AI makes mistakes. If the child has short hair in the photo, the illustration must show short hair. If long, show long. Match the exact hair texture and style.

Perform this analysis and extract the character description. Use this character description CONSISTENTLY throughout every page of the book.

# BOOK INFORMATION
- **Number of Pages:** 10 pages
- **Story Language:** [LANGUAGE] (IMPORTANT: The story text in the JSON output should be in [LANGUAGE], but all instructions and image descriptions must be in English)
- **Age Group:** Appropriate for [AGE_GROUP] age group
- **Theme:** [THEME] - [SUBTHEME]
- **Illustration Style:** [ILLUSTRATION_STYLE_DESCRIPTION]
- **Tone:** Warm, encouraging, magical, adventurous

# STORY CONTENT

**Title:** [TITLE]

**Pages:**

[PAGES_WITH_TEXT_AND_IMAGE_DESCRIPTIONS]

**Main Message:** [MORAL]

# VISUAL REQUIREMENTS

Create an illustration for each page:

**SPECIAL NOTE FOR PAGE 1 (BOOK COVER):**
- Page 1 MUST be designed as a professional book cover **ILLUSTRATION** (NOT a book mockup, NOT a 3D book object, NOT a book on a shelf)
- This should be a **FLAT ILLUSTRATION** that can be used as a book cover, not a photograph of a physical book
- The main character ([CHARACTER_NAME]) should be prominently featured in the center or foreground
- Character physical features: [CHARACTER_FEATURES_ENGLISH]
- **CRITICAL: Match the exact hair length, style, and texture from the uploaded photo** - if the photo shows short hair, the illustration must show short hair; if long, show long; match the exact curl pattern, texture, and style
- **IMPORTANT: The character should RESEMBLE the child in the photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering. The character should look like a stylized illustration that captures the child's features (hair color, eye color, face shape, etc.) but in the chosen illustration style. It should be clearly an illustration, not a photograph.**
- Include elements representing the theme ([THEME] - [SUBTHEME])
- Make it visually striking, colorful, and appealing to children
- The cover should look professional and print-ready
- **CRITICAL: NO TEXT, NO WRITING, NO LETTERS, NO WORDS, NO TITLES in the image - text will be added separately as a separate layer**
- Use [ILLUSTRATION_STYLE_DESCRIPTION] style
[3D_ANIMATION_SPECIAL_NOTES_IF_APPLICABLE]
- **DO NOT create a book mockup, 3D book object, or book on a shelf - create a flat, standalone illustration**
- **CRITICAL: All image descriptions must be in English only. Do not use Turkish words in image descriptions.**

**For Pages 2-10 (Interior Pages):**

1. **Character Consistency (VERY IMPORTANT):**
   - The SAME child should appear on every page
   - Features from the photo must be preserved EXACTLY:
     * **Same hair color, length, style, and texture** (CRITICAL: Match the exact hair length from the photo - short, medium, or long. Match the exact texture - straight, wavy, curly, etc.)
     * Same eye color (exact shade)
     * Same skin tone (exact shade)
     * Same facial features (face shape, nose, mouth, cheeks)
     * Same unique features from reference (e.g. glasses, freckles, dimples — from image analysis)
     * Same body proportions
   - Only clothing and position can change
   - **Pay special attention to hair length - this is a common mistake. If the photo shows short hair, the illustration must show short hair. If long, show long.**

   [IF MULTIPLE CHARACTERS EXIST]
   - **CRITICAL INSTRUCTION FOR MULTIPLE CHARACTERS WITH REFERENCE IMAGES:**
     * You are provided with [TOTAL_CHARACTER_COUNT] reference image(s).
     * Each reference image corresponds to one character below, in order (image 1 → character 1, image 2 → character 2, etc.).
     * You MUST match each character's text description with its corresponding reference image.
     * Pay close attention to EACH character's eye color, hair color, age, and unique features as specified.
     * Do NOT mix features between characters - each character must maintain their individual characteristics.
   
   - **Additional Characters:** Each additional character must maintain their unique appearance:
     * **CHARACTER 2 (Reference Image 2):** [CHARACTER_2_NAME] ([CHARACTER_2_TYPE]) - [AGE] years old, [HAIR_COLOR] [HAIR_LENGTH] [HAIR_STYLE] [HAIR_TEXTURE] hair, [EYE_COLOR] eyes - (IMPORTANT: This character has [EYE_COLOR] eyes, NOT the same eye color as Character 1) - (IMPORTANT: This is [CHARACTER_2_NAME], a specific person with unique appearance, NOT a generic [CHARACTER_2_TYPE]) - (CRITICAL: Hair style and length must match reference photo EXACTLY - [HAIR_LENGTH] [HAIR_STYLE]) - (CRITICAL: If [AGE] >= 18, this is an ADULT, NOT a child - must have adult body proportions, adult facial features, adult height) - (CRITICAL: If [AGE] >= 18, adult facial features (mature face, NOT childlike), adult body proportions (NOT child proportions))
     * **CHARACTER 3 (Reference Image 3):** [CHARACTER_3_NAME] ([CHARACTER_3_TYPE]) - [AGE] years old, [HAIR_COLOR] [HAIR_LENGTH] [HAIR_STYLE] [HAIR_TEXTURE] hair, [EYE_COLOR] eyes - (IMPORTANT: This character has [EYE_COLOR] eyes, NOT the same eye color as Character 1) - (IMPORTANT: This is [CHARACTER_3_NAME], a specific person with unique appearance, NOT a generic [CHARACTER_3_TYPE]) - (CRITICAL: Hair style and length must match reference photo EXACTLY - [HAIR_LENGTH] [HAIR_STYLE]) - (CRITICAL: If [AGE] >= 18, this is an ADULT, NOT a child - must have adult body proportions, adult facial features, adult height) - (CRITICAL: If [AGE] >= 18, adult facial features (mature face, NOT childlike), adult body proportions (NOT child proportions))
     * **For Pets:** [PET_NAME] (a [PET_TYPE]) - [FUR_COLOR] fur, [EYE_COLOR] eyes - friendly and playful expression
     * **CRITICAL:** Each character must maintain their individual characteristics. Do NOT mix features between characters.
     * **CRITICAL:** Match each character's text description with its corresponding reference image (image 1 → character 1, image 2 → character 2, etc.)
     * **CRITICAL (NEW: v1.0.7):** Hair style, length, and texture details are now included for better consistency
     * **CRITICAL (NEW: v1.0.7):** Adult characters (Mom, Dad, etc.) must have ADULT body proportions, ADULT facial features, ADULT height - NOT childlike features
   [END IF]

2. **Illustration Style:**
   - [ILLUSTRATION_STYLE_DESCRIPTION]
   [3D_ANIMATION_SPECIAL_NOTES_IF_APPLICABLE]

3. **Visual Content:**
   - The illustration must accurately represent the page text
   - The child should be at the center of the illustration
   - The scene should match the story
   - Safe and positive for children

4. **Technical:**
   - High quality, print-ready
   - **CRITICAL: NO TEXT, NO WRITING, NO LETTERS, NO WORDS, NO TITLES in the image - text will be added separately as a separate layer**
   - Child-appropriate content
   - Positive and uplifting

# OUTPUT FORMAT

Provide output in the following JSON format:

{
  "title": "[TITLE]",
  "characterName": "[CHARACTER_NAME]",
  "characterAge": [AGE],
  "characterDescription": "Detailed character description extracted from photo",
  "pages": [
    {
      "pageNumber": [NUMBER],
      "text": "[PAGE_TEXT]",
      "imageDescription": "[IMAGE_PROMPT]"
    }
  ],
  "moral": "[MORAL]"
}

# IMPORTANT NOTES

1. **Page 1 is the BOOK COVER ILLUSTRATION**: This is critical! Page 1 must be designed as a professional book cover **ILLUSTRATION** (NOT a book mockup, NOT a 3D book object, NOT a book on a shelf). It should be a **FLAT, STANDALONE ILLUSTRATION** that can be used as a book cover. The main character should be prominently featured, theme elements included. **CRITICAL: NO TEXT, NO WRITING, NO LETTERS, NO WORDS, NO TITLES in the image - text will be added separately as a separate layer.**

2. **Character Consistency:** This is the most critical point. The same child should appear on every page. Preserve ALL features from the photo on every page, especially:
   - **Hair length, style, and texture** (match exactly - short, medium, or long; straight, wavy, or curly)
   - Eye color (exact shade)
   - Skin tone (exact shade)
   - Facial features
   - Body proportions

3. **Age Appropriateness:** The story and language should be appropriate for [AGE_GROUP] age group.

4. **Safety:** All content must be safe and positive for children. No scary, violent, or inappropriate content.

5. **Quality:** Each page must be high quality in both text and visuals.

Now analyze the uploaded photo and create PAGE [PAGE_NUMBER].
```

---

## 🎨 Illustration Style Descriptions (UPDATED: v1.0.1 - 15 Ocak 2026)

**Toplam Stil Sayısı:** 9 stil (yakın stiller kaldırıldı, en farklı olanlar kaldı)

### 1. 3D Animation (Pixar Style)
```
3D Animation (Pixar Style) - Pixar-style 3D animation (like Toy Story, Finding Nemo, Inside Out), 
cartoonish and stylized (NOT photorealistic), vibrant saturated colors, rounded shapes, 
exaggerated features, soft shadows, realistic textures, children's animated movie aesthetic, 
Pixar animation quality

CRITICAL FOR 3D ANIMATION (PIXAR STYLE): The illustration must be cartoonish and stylized like 
Pixar animated movies (Toy Story, Finding Nemo, Inside Out) - NOT photorealistic, NOT realistic 
photography. Use rounded shapes, exaggerated features, bright saturated colors, soft shadows, 
realistic textures, and a playful animated movie aesthetic. The character should look like a 3D 
animated cartoon character from a Pixar children's movie, not a real photograph or realistic 3D 
render. Pixar animation quality and visual style.
```

### 2. Geometric Style
```
Geometric - Simplified geometric shapes (circles, squares, triangles), flat colors with no gradients, 
sharp distinct edges, minimal detail, modern stylized, grid-based alignment (8px grid), clean lines, 
illustration style
```

### 3. Watercolor Style
```
Watercolor - Transparent watercolor technique, visible soft brushstrokes, colors blend and bleed at 
edges, paper texture visible through paint, luminous glowing finish, wet-on-wet color mixing, soft 
flowing edges, warm inviting atmosphere, hand-painted illustration feel
```

### 4. Comic Book Style
```
Comic Book - Bold thick black outlines around all elements, flat color fills with no gradients, 
dramatic angular shadows with sharp edges, high contrast between light and dark, halftone dot 
texture for shadows, simplified graphic style, dynamic poses, comic book style illustration
```

### 5. Block World Style
```
Block World - Pixelated/blocky aesthetic, visible blocks/cubes, Minecraft-like construction, 
characters and environment built from geometric blocks, sharp edges, limited color palette, 
isometric or orthographic perspective, illustration style
```

### 6. Clay Animation Style
```
Clay Animation - Clay-like appearance, visible fingerprints and tool marks, soft organic texture, 
matte finish, slightly lumpy surfaces, hand-molded look, soft rounded shadows, stop-motion 
aesthetic, illustration
```

### 7. Kawaii Style
```
Kawaii - Oversized head (1:2 or 1:3 head-to-body ratio), large sparkling eyes with star highlights, 
tiny dot-like nose, small mouth, soft rounded cheeks, pastel color palette (baby pink, sky blue, 
mint green, lavender), blush marks on cheeks, decorative hearts/stars/sparkles, exaggerated 
cuteness, illustration
```

### 8. Collage Style
```
Collage - Cut-out pieces with visible rough edges, distinct layers with varied textures, torn edges 
showing paper texture, mixed media feel, visible shadows between layers, vibrant colors, 
handcrafted appearance, illustration
```

### 9. Sticker Art Style
```
Sticker Art - Clean bold uniform lines, bright highly saturated colors, glossy graphic look with 
specular highlights, white border effect (like real sticker), simple cell shading, flat fills with 
minimal gradients, polished graphic appearance, sticker-like illustration
```

**Kaldırılan Stiller (Yakın Olanlar):**
- `Gouache` → Watercolor'a çok yakın (ikisi de suluboya benzeri, fark çok ince)
- `Soft Anime` → Kawaii'ye çok yakın (ikisi de büyük gözler, sevimli, pastel renkler)
- `Picture-Book` → Watercolor'a yakın (picture-book genelde watercolor kullanır, "warm inviting" özelliği Watercolor'a eklendi)

### Kawaii Style
```
Kawaii - Exaggerated cuteness, large sparkling eyes, simplified rounded features, bright cheerful colors, illustration
```

### Comic Book Style
```
Comic Book - Bold outlines, relatively flat colors, strong dramatic shadows, comic book style illustration
```

---

## 🔧 Implementation Notes

### Character Features Translation
- **Story Text:** Türkçe/İngilizce (kullanıcı dil seçimine göre)
- **Image Prompts:** HER ZAMAN İngilizce (AI daha iyi anlıyor)

### Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `[CHARACTER_NAME]` | Çocuğun adı | "Arya" |
| `[AGE]` | Çocuğun yaşı | 3 |
| `[CHARACTER_FEATURES_ENGLISH]` | İngilizce karakter özellikleri | "brown hair, hazel eyes" |
| `[THEME]` | Tema (İngilizce) | "Adventure" |
| `[SUBTHEME]` | Alt tema | "treasure hunt" |
| `[ILLUSTRATION_STYLE_DESCRIPTION]` | Detaylı stil açıklaması | "3D Animation - Pixar/DreamWorks..." |
| `[AGE_GROUP]` | Yaş grubu | "3-5" |
| `[LANGUAGE]` | Hikaye dili | "Turkish" / "English" |
| `[TITLE]` | Kitap başlığı | "Arya's Lost Treasure Adventure" |
| `[MORAL]` | Hikayenin mesajı | "Friendship and courage..." |
| `[PAGES_WITH_TEXT_AND_IMAGE_DESCRIPTIONS]` | Sayfa metinleri ve görsel açıklamaları | Her sayfa için text + imagePrompt |

---

## ✅ Best Practices

1. **Her zaman İngilizce kullan** (image prompts için)
2. **Karakter özelliklerini detaylı belirt** (saç rengi, uzunluk, stil, göz rengi, vb.)
3. **Hair length'a özel dikkat** (en yaygın hata)
4. **3D Animation stil için özel notlar ekle** (photorealistic olmamalı)
5. **Kitap kapağı için özel talimatlar** (flat illustration, book mockup değil)
6. **Karakter tutarlılığını her sayfada vurgula**
7. **NEW (15 Ocak 2026): Cinematic elements ekle** (lighting, depth, composition)
8. **NEW: Foreground/Midground/Background layer sistemi kullan**
9. **NEW: Kıyafet tutarlılığını belirt** (hikayede değişim yoksa aynı kıyafet)
10. **NEW: Anatomik doğruluk direktifleri ekle** (5 parmak, doğru limb sayısı)

---

## 📊 Version History

### v1.0.0 (15 Ocak 2026)
- ✅ Initial release
- ✅ POC'deki detaylı prompt yapısından ilham alındı
- ✅ Karakter tutarlılığına özel vurgu
- ✅ 3D Animation stil için özel notlar
- ✅ Kitap kapağı için özel talimatlar
- ✅ Yaş grubu kuralları
- ✅ Çok dilli destek (story text için)

### v1.0.1 (15 Ocak 2026 - Kalite İyileştirmeleri)
- ✅ **Cinematic composition elements** - Lighting, depth of field, camera angles
- ✅ **3-level environment descriptions** - General, Detailed, Cinematic
- ✅ **Hybrid prompt system** - Cinematic + Descriptive combination
- ✅ **Foreground/Midground/Background layers** - Proper depth hierarchy
- ✅ **Clothing consistency system** - Maintain same outfit unless story changes it
- ✅ **Anatomical error prevention** - Comprehensive negative prompts for hands, fingers, limbs
- ✅ **Anatomical correctness directives** - Positive prompts for proper anatomy (5 fingers, 2 hands, etc.)
- 🎯 **Goal:** Match quality of Magical Children's Book examples

### v1.0.5 (16 Ocak 2026 - Multiple Reference Images & Enhanced Character Descriptions)
- ✅ **Multiple Reference Images Support** - All characters' reference images sent to API (image[] format)
- ✅ **CRITICAL INSTRUCTION for Multiple Characters** - Reference image matching directives
- ✅ **Enhanced Family Member Descriptions** - Age, hair color, eye color, unique features (from AI image analysis)
- ✅ **Individual Character Emphasis** - Eye color preservation, specific person not generic
- ✅ **Character Name Usage** - Explicit character names (Zeynep, Cüneyt) instead of generic terms
- ✅ **Enhanced Fallback Descriptions** - Better descriptions when character.description is null
- 🎯 **Goal:** All characters in pages match their reference images (not just cover)

### v1.7.0 (24 Ocak 2026 - Image API Refactor - Modülerleştirme)
- ✅ **Faz 1: Inline Direktifleri Modülerleştir** - 5 builder fonksiyonu (buildCoverDirectives, buildFirstInteriorPageDirectives, buildClothingDirectives, buildMultipleCharactersDirectives, buildCoverReferenceConsistencyDirectives)
- ✅ **Faz 2: Tekrar Eden Direktifleri Birleştir** - buildCharacterConsistencyDirectives, buildStyleDirectives
- ✅ **Faz 3: Prompt Bölümlerini Organize Et** - 12 section builder fonksiyonu, generateFullPagePrompt refactor
- ✅ **Kod Organizasyonu** - Daha modüler, okunabilir ve bakımı kolay yapı
- ✅ **Test Edilebilirlik** - Her bölüm bağımsız test edilebilir
- 🎯 **Goal:** Kod kalitesi ve bakım kolaylığı artırıldı, prompt çıktısı aynı kaldı (sadece organizasyon değişti)

---

## 🎬 Cinematic Quality Enhancements (NEW: 15 Ocak 2026)

### Cinematic Composition Elements

Her image prompt şimdi cinematic kalite elementleri içerir:

1. **Depth & Layers** (Scene v1.3.0 / v1.4.0: sharp environment, character ratio)
   - Clear foreground, midground, background separation
   - **Character ratio (v1.4.0):** **25–35% character, 65–75% environment**; character must NOT exceed 35% of frame; wider shot, character smaller in frame; character must not occupy more than half the frame.
   - **Balanced/environment:** Deep focus; foreground, midground, background **all in sharp detail**; **no background blur**. Environment sharp and detailed, rich.
   - **Cover (character focus):** Shallow DoF; background with subtle atmospheric haze, environment still readable.
   - Atmospheric perspective: distant elements fade into soft mist; near/mid sharp.
   - Sense of three-dimensional space

2. **Composition**
   - Rule of thirds
   - Balanced visual weight
   - Dynamic framing

3. **Lighting** (mood-based)
   - Exciting: Dynamic lighting with highlights and shadows
   - Calm: Soft ambient lighting
   - Mysterious: Atmospheric lighting with soft glow

4. **Camera Angle**
   - Page 1: Hero shot, medium-wide angle
   - Other pages: Varied perspective for visual interest

### Foreground/Midground/Background System (Scene v1.3.0)

**Template Structure:**
```
FOREGROUND: [Character action], main character in sharp focus with detailed features visible.
MIDGROUND: [Story elements], in sharp detail.
BACKGROUND: [Environment], providing depth and atmosphere. Midground and near background in sharp detail; distant elements fade into soft mist with atmospheric perspective.
```

**Example:**
```
FOREGROUND: Lisa kneeling on forest path, looking concerned at trash, wearing floral dress and glasses.
MIDGROUND: Scattered trash items (candy wrappers, plastic bottles) among wildflowers (daisies, violets).
BACKGROUND: Tall oak and pine trees with dappled sunlight filtering through leaves, creating soft shadows, gentle breeze rustling canopy.
```

### 3-Level Environment Descriptions

Her tema için 3 seviye detay:

**Level 1 - General:** `lush forest`

**Level 2 - Detailed:** `lush forest with tall oak and pine trees, dappled sunlight filtering through leaves`

**Level 3 - Cinematic (KULLANILAN):** `lush forest with tall oak and pine trees, dappled sunlight filtering through leaves creating dancing shadows on the mossy ground, wildflowers (daisies, violets, buttercups) dotting the forest floor, gentle breeze rustling the canopy, birds chirping in the distance`

### Clothing Consistency

**Kural:** Hikayede kıyafet değişikliği belirtilmediyse, karakter tüm sayfalarda aynı kıyafeti giyer.

**Prompt directive:**
```
CHARACTER CLOTHING CONSISTENCY: If the story does NOT mention clothing change, character must wear the SAME clothing as previous pages. Only change clothing if story specifically mentions it (e.g., "changed into pajamas", "put on jacket"). Maintain exact same outfit (colors, style, details) throughout story unless explicitly changed in narrative.
```

### Anatomical Correctness

**Negative Prompts (100+ items):**
- Hand/Finger errors: extra fingers, missing fingers, deformed fingers
- Hand/Arm errors: extra hands, missing hands, wrong position
- Foot/Leg errors: extra feet, missing toes, wrong position
- Body proportion errors: wrong proportions, extra limbs
- Face errors: extra eyes, missing features

**Positive Directives:**
```
ANATOMICAL CORRECTNESS (CRITICAL):
- Character must have exactly 5 fingers on each hand (no more, no less)
- Character must have exactly 2 hands, 2 arms, 2 feet, 2 legs
- All body parts must be anatomically correct and properly proportioned
- Hands, feet, and limbs must be in natural, possible positions
- Face features must be symmetrical and correctly placed
```

---

## 🔗 Related Documents

- `STORY_PROMPT_TEMPLATE_v1.0.0.md` - Hikaye üretimi için prompt template
- `docs/reports/IMAGE_QUALITY_ANALYSIS.md` - Kalite analizi raporu
- `poc/server.js` - POC implementasyonu (referans)

---

**Son Güncelleme:** 24 Ocak 2026 (Scene v1.7.0 - Image API Refactor)  
**Yöneten:** @prompt-manager agent  
**Not:** Bu template sürekli geliştirilmektedir. Feedback'lere göre güncellenecektir.

