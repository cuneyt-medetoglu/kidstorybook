# 🎯 Final Prompt Template (Birleştirilmiş)
# KidStoryBook Platform

**Doküman Versiyonu:** 1.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Template - POC için

**AI Model:** GPT-4 Vision (OpenAI) veya Gemini Vision (Google)  
**Not:** Çocuk fotoğrafı analizi AI tarafından yapılacak, biz sadece fotoğrafı göndereceğiz.

---

## Amaç

**Görsel Prompt** ve **Hikaye İçeriği Prompt** çıktılarını birleştirerek, **tek bir AI çağrısı** ile tüm kitap sayfalarını (metin + görsel) oluşturmak.

---

## Birleştirme Stratejisi

### Adım 1: İki Prompt Çıktısını Al

**1.1 Görsel Prompt Çıktıları:**
```json
{
  "page1": {
    "imagePrompt": "Watercolor illustration: Elif (5 years old, brown hair, green eyes, glasses, pink dress)...",
    "imageUrl": "https://..." // Üretilmiş görsel URL'i
  },
  "page2": {
    "imagePrompt": "...",
    "imageUrl": "https://..."
  }
  // ... 10 sayfa
}
```

**1.2 Hikaye İçeriği Çıktısı:**
```json
{
  "title": "Elif ve Dinozor Yumurtası",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Güneşli bir sabahta Elif ve kardeşi Mert...",
      "imagePrompt": "Watercolor illustration: ..."
    }
    // ... 10 sayfa
  ],
  "moral": "Dostluk ve yardımseverlik..."
}
```

---

### Adım 2: Final Prompt Oluştur

**Template:**

```
You are an AI assistant that creates complete children's book pages by combining story text with matching illustrations.

# Task
Create [PAGE_COUNT] complete book pages, each with:
1. Story text (already provided)
2. Matching illustration (based on provided image prompt and reference photo)

# Reference Photo
[CHARACTER_PHOTO_URL or DESCRIPTION]
This is the main character. All illustrations must show this exact child.

# Story Information
- Title: [TITLE]
- Main Character: [CHARACTER_NAME], [AGE] years old
- Theme: [THEME]
- Illustration Style: [ILLUSTRATION_STYLE]
- Language: [LANGUAGE]

# Pages to Create

[FOR EACH PAGE:]

**Page [NUMBER]:**
- Text: "[PAGE_TEXT]"
- Image Prompt: "[IMAGE_PROMPT]"
- Reference Image (if available): [PAGE_IMAGE_URL]

Create this page with:
1. The exact text provided
2. An illustration that:
   - Matches the image prompt exactly
   - Shows the character from the reference photo
   - Is consistent with the illustration style
   - Matches the story text content
   - Is safe and appropriate for children

[/FOR EACH PAGE]

# Output Format
Return a JSON object:
{
  "title": "[TITLE]",
  "pages": [
    {
      "pageNumber": 1,
      "text": "[EXACT_TEXT_FROM_STORY]",
      "imageUrl": "[GENERATED_IMAGE_URL]",
      "imagePrompt": "[FINAL_IMAGE_PROMPT_USED]"
    }
    // ... all pages
  ]
}

# Critical Requirements
1. Character consistency: Every page must show the SAME child from the reference photo
2. Style consistency: All illustrations must match the [ILLUSTRATION_STYLE] style
3. Text-image match: Each illustration must accurately represent the story text
4. Quality: High resolution, print-ready, children-appropriate
5. Safety: No scary, violent, or inappropriate content

Now create all [PAGE_COUNT] pages!
```

---

## Detaylı Final Prompt Örneği

```
You are an AI assistant that creates complete children's book pages by combining story text with matching illustrations.

# Task
Create 10 complete book pages, each with:
1. Story text (already provided)
2. Matching illustration (based on provided image prompt and reference photo)

# Reference Photo
[UPLOADED_CHARACTER_PHOTO_URL]
This is Elif, a 5-year-old Turkish girl with long brown hair, green eyes, and round glasses. All illustrations must show this exact child with these exact features.

# Story Information
- Title: Elif ve Dinozor Yumurtası
- Main Character: Elif, 5 years old, girl
- Theme: Adventure - Dinosaurs
- Illustration Style: Watercolor
- Language: Turkish

# Pages to Create

**Page 1:**
- Text: "Güneşli bir sabahta Elif ve kardeşi Mert parka gitmek için hazırlanıyorlardı. Elif pembe elbiseli, gözlüklü ve çok heyecanlıydı. Mert de mavi tişörtlü ve ablasını takip ediyordu."
- Image Prompt: "Watercolor illustration: A 5-year-old Turkish girl named Elif with long brown hair, green eyes, round glasses, wearing a pink dress with white flowers, and her 3-year-old brother Mert with short brown hair, blue eyes, wearing a blue t-shirt, walking happily toward a colorful park. A white fluffy rabbit named Pamuk hops beside them. Sunny morning, bright colors, soft watercolor style."
- Reference Image: [CHARACTER_PHOTO_URL]

Create this page with:
1. The exact text provided
2. An illustration that:
   - Matches the image prompt exactly
   - Shows Elif exactly as she appears in the reference photo (brown hair, green eyes, glasses, similar facial features)
   - Is in watercolor style
   - Shows the scene described in the text
   - Is safe and appropriate for children

**Page 2:**
- Text: "Parka vardıklarında Elif çok güzel çiçekler gördü. 'Bak Mert!' dedi. 'Ne kadar güzel çiçekler var!' Mert de çiçeklere bakıp gülümsedi. Pamuk da çimenlerde zıplıyordu."
- Image Prompt: "Watercolor illustration: Elif (5 years old, brown hair, green eyes, glasses, pink dress) and Mert (3 years old, brown hair, blue eyes, blue t-shirt) in a park surrounded by colorful flowers (pink, yellow, blue). Elif is pointing at the flowers with excitement. Pamuk the white rabbit is hopping in the green grass. Soft watercolor style, warm colors, sunny day."
- Reference Image: [CHARACTER_PHOTO_URL]

[... Pages 3-10 with same format ...]

# Output Format
Return a JSON object:
{
  "title": "Elif ve Dinozor Yumurtası",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Güneşli bir sabahta Elif ve kardeşi Mert parka gitmek için hazırlanıyorlardı. Elif pembe elbiseli, gözlüklü ve çok heyecanlıydı. Mert de mavi tişörtlü ve ablasını takip ediyordu.",
      "imageUrl": "[GENERATED_IMAGE_URL]",
      "imagePrompt": "[FINAL_IMAGE_PROMPT_USED]"
    }
    // ... all 10 pages
  ]
}

# Critical Requirements
1. Character consistency: Every page must show Elif exactly as she appears in the reference photo:
   - Long brown straight hair
   - Green eyes
   - Round glasses
   - Similar facial features
   - Light skin tone
   - Small freckles
2. Style consistency: All illustrations must be in soft watercolor style with gentle brushstrokes and pastel colors
3. Text-image match: Each illustration must accurately represent the story text on that page
4. Quality: High resolution (1024x1024 minimum), print-ready (300 DPI), children-appropriate
5. Safety: No scary, violent, or inappropriate content. Friendly, positive, uplifting imagery only.

Now create all 10 pages!
```

---

## Birleştirme Script Yapısı

### Input:

```typescript
interface FinalPromptInput {
  // Görsel prompt çıktıları
  imagePrompts: {
    pageNumber: number;
    imagePrompt: string;
    imageUrl?: string; // Eğer önceden üretildiyse
  }[];
  
  // Hikaye içeriği çıktısı
  story: {
    title: string;
    pages: {
      pageNumber: number;
      text: string;
      imagePrompt: string; // Hikaye prompt'undan gelen
    }[];
    moral: string;
  };
  
  // Karakter bilgileri
  character: {
    name: string;
    age: number;
    photoUrl: string;
    appearance: string;
  };
  
  // Stil bilgileri
  illustrationStyle: string;
  theme: string;
  language: string;
}
```

### Output:

```typescript
interface FinalBookOutput {
  title: string;
  pages: {
    pageNumber: number;
    text: string;
    imageUrl: string; // Final üretilmiş görsel
    imagePrompt: string; // Kullanılan final prompt
  }[];
  moral: string;
}
```

---

## Final Prompt Oluşturma Fonksiyonu

```typescript
function createFinalPrompt(input: FinalPromptInput): string {
  let prompt = `You are an AI assistant that creates complete children's book pages.

# Task
Create ${input.story.pages.length} complete book pages.

# Reference Photo
${input.character.photoUrl}
This is ${input.character.name}, a ${input.character.age}-year-old child. 
${input.character.appearance}
All illustrations must show this exact child.

# Story Information
- Title: ${input.story.title}
- Main Character: ${input.character.name}, ${input.character.age} years old
- Theme: ${input.theme}
- Illustration Style: ${input.illustrationStyle}
- Language: ${input.language}

# Pages to Create

`;

  // Her sayfa için prompt ekle
  input.story.pages.forEach((page, index) => {
    const imagePrompt = input.imagePrompts.find(
      ip => ip.pageNumber === page.pageNumber
    )?.imagePrompt || page.imagePrompt;
    
    prompt += `**Page ${page.pageNumber}:**
- Text: "${page.text}"
- Image Prompt: "${imagePrompt}"
- Reference Image: ${input.character.photoUrl}

Create this page with the exact text and a matching illustration.
The illustration must show ${input.character.name} exactly as in the reference photo.

`;
  });

  prompt += `# Output Format
Return JSON with all pages including imageUrl for each.

# Critical Requirements
1. Character consistency: Every page must show ${input.character.name} exactly as in the reference photo
2. Style: All illustrations in ${input.illustrationStyle} style
3. Text-image match: Each illustration must match the story text
4. Quality: High resolution, print-ready, children-appropriate

Now create all ${input.story.pages.length} pages!`;

  return prompt;
}
```

---

## Kullanım Senaryosu

### Senaryo: POC için 10 Sayfalık Kitap

1. **Kullanıcı girişleri al:**
   - Fotoğraf yükle
   - Karakter bilgileri gir
   - Tema, stil seç

2. **Görsel prompt'ları oluştur:**
   - `PROMPT_IMAGE.md` template'ini kullan
   - Her sayfa için görsel prompt üret
   - (Opsiyonel) İlk görselleri üret ve test et

3. **Hikaye içeriğini oluştur:**
   - `PROMPT_STORY.md` template'ini kullan
   - GPT-4o ile hikaye üret
   - JSON çıktısını al

4. **Final prompt'u oluştur:**
   - `PROMPT_FINAL.md` template'ini kullan
   - İki çıktıyı birleştir
   - Final prompt'u hazırla

5. **Final AI çağrısı:**
   - Final prompt + çocuk fotoğrafı
   - AI: Tüm sayfaları üret
   - JSON çıktısı: Metin + görsel URL'leri

6. **Sonuç:**
   - 10 sayfalık kitap
   - Her sayfada metin + görsel
   - Karakter tutarlılığı test edilmiş

---

## Test ve Validasyon

### Test Kriterleri:

1. **Karakter Tutarlılığı:**
   - Her sayfada aynı çocuk görünmeli
   - Fotoğraftaki özellikler korunmalı

2. **Metin-Görsel Uyumu:**
   - Görsel, metni doğru yansıtmalı
   - Sahne uyumlu olmalı

3. **Stil Tutarlılığı:**
   - Tüm görseller aynı stil olmalı
   - Illustration style doğru uygulanmalı

4. **Kalite:**
   - Yüksek çözünürlük
   - Print-ready
   - Çocuklar için uygun

---

## İyileştirme Noktaları

### Prompt İyileştirmeleri:
- Daha spesifik karakter referansı
- Daha detaylı stil talimatları
- Daha iyi metin-görsel eşleştirme

### Script İyileştirmeleri:
- Otomatik prompt birleştirme
- Hata kontrolü
- Validasyon

---

## Sonraki Adımlar

1. Bu template'i POC script'ine entegre et
2. Test kitabı oluştur
3. Kaliteyi değerlendir
4. Prompt'u iyileştir
5. Final template'i belirle

---

**Son Güncelleme:** 21 Aralık 2025  
**Kritik Not:** Bu final prompt, tüm sistemin başarısını belirleyen en önemli adım. Karakter tutarlılığı ve kalite burada test edilir.

