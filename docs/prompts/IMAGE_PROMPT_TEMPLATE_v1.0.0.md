# 🎨 Image Generation Prompt Template v1.0.0

**KidStoryBook Platform - Image Generation Prompts**

**Version:** 1.0.0  
**Release Date:** 15 Ocak 2026  
**Status:** ✅ Active  
**Author:** @prompt-manager  
**Based on:** POC analysis and quality improvements

---

## 📋 Overview

Bu template, **gpt-image-1.5** (default) / **1024x1024** / **quality: low** ayarları için optimize edilmiş görsel üretim prompt'larını içerir. POC'deki detaylı prompt yapısından ilham alınarak oluşturulmuştur ve karakter tutarlılığına özel vurgu yapar.

**Production Defaults (15 Ocak 2026):**
- Model: `gpt-image-1.5`
- Size: `1024x1024`
- Quality: `low`
- Rate Limit: 5 images per 90 seconds (Tier 1: 5 IPM)

**Kritik Hedef:** Yüklenen çocuk fotoğrafındaki çocuğa mümkün olduğunca benzeyen karakterler üretmek.

---

## 🎯 Core Principles

1. **Karakter Tutarlılığı:** Her sayfada aynı çocuk görünmeli
2. **Detaylı Talimatlar:** Prompt ne kadar detaylı olursa, sonuç o kadar iyi olur
3. **Stil Tutarlılığı:** Tüm görseller aynı illustration style'da olmalı
4. **Yaş Uygunluğu:** Age-appropriate scenes ve content
5. **Kalite:** Print-ready, professional children's book illustrations

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
- **Special features** (glasses, freckles, dimples, etc.)
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
     * Same special features (glasses, freckles, dimples, etc.)
     * Same body proportions
   - Only clothing and position can change
   - **Pay special attention to hair length - this is a common mistake. If the photo shows short hair, the illustration must show short hair. If long, show long.**

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

## 🎨 Illustration Style Descriptions

### 3D Animation Style
```
3D Animation - Pixar/DreamWorks-style 3D animation, cartoonish and stylized (NOT photorealistic), vibrant saturated colors, rounded shapes, exaggerated features, children's animated movie aesthetic

CRITICAL FOR 3D ANIMATION STYLE: The illustration must be cartoonish and stylized like Pixar/DreamWorks animated movies - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, and a playful animated movie aesthetic. The character should look like a 3D animated cartoon character from a children's movie, not a real photograph or realistic 3D render.
```

### Watercolor Style
```
Watercolor - Soft, translucent appearance, visible brushstrokes, blended edges, muted flowing colors, hand-painted illustration feel
```

### Picture-Book Style
```
Picture-Book - Warm, slightly textured, inviting children's picture book illustration, soft glow, stylized but clear details
```

### Gouache Style
```
Gouache - Opaque, vibrant colors, matte finish, distinct visible brushstrokes, rich saturated colors, illustration style
```

### Geometric Style
```
Geometric - Simplified geometric shapes, flat colors, sharp distinct edges, modern and stylized illustration style
```

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

---

## 🔗 Related Documents

- `STORY_PROMPT_TEMPLATE_v1.0.0.md` - Hikaye üretimi için prompt template
- `docs/reports/IMAGE_QUALITY_ANALYSIS.md` - Kalite analizi raporu
- `poc/server.js` - POC implementasyonu (referans)

---

**Son Güncelleme:** 15 Ocak 2026  
**Yöneten:** @prompt-manager agent  
**Not:** Bu template sürekli geliştirilmektedir. Feedback'lere göre güncellenecektir.

