# 🎨 Görsel Üretimi Prompt Template
# KidStoryBook Platform

**Doküman Versiyonu:** 1.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Template - POC için

---

## Önemli Not

**Bu prompt'un en kritik görevi:** Yüklenen çocuk fotoğrafındaki çocuğa **mümkün olduğunca benzeyen** karakterler üretmek.

**Karakter Tutarlılığı:** Her sayfada aynı çocuk görünmeli. Bu, projenin en zor ve en önemli kısmı.

---

## Prompt Template Yapısı

### 1. Karakter Analizi (Fotoğraftan)

**Giriş:** Çocuk fotoğrafı

**Çıktı:** Karakter tanımı
```json
{
  "age": 5,
  "gender": "girl",
  "hairColor": "brown",
  "hairStyle": "long, straight",
  "eyeColor": "green",
  "skinTone": "light",
  "features": ["glasses", "freckles"],
  "typicalClothing": "pink dress with flowers"
}
```

**Not:** Bu analiz manuel yapılabilir veya AI vision model ile otomatikleştirilebilir.

---

### 2. Görsel Prompt Template (Her Sayfa İçin)

#### Template Yapısı:

```
[ILLUSTRATION_STYLE] children's book illustration:

**Character Description:**
- Name: [CHARACTER_NAME]
- Age: [AGE] years old
- Gender: [GENDER]
- Appearance: [DETAILED_APPEARANCE]
- Reference Photo: [PHOTO_DESCRIPTION or "based on uploaded photo"]

**Scene:**
[SCENE_DESCRIPTION from story]

**Character in Scene:**
- Expression: [EMOTION]
- Action: [WHAT_THEY_ARE_DOING]
- Clothing: [OUTFIT]
- Position: [WHERE_IN_SCENE]

**Setting:**
[LOCATION and ENVIRONMENT]

**Additional Elements:**
[OTHER_CHARACTERS, PETS, OBJECTS]

**Art Direction:**
- Style: [ILLUSTRATION_STYLE_DETAILS]
- Mood: [MOOD]
- Colors: [COLOR_PALETTE]
- Composition: [PERSPECTIVE]
- Lighting: [LIGHTING]

**Technical Requirements:**
- High quality, print-ready
- No text in image
- Safe for children
- Positive and uplifting
- Character consistency: Must match reference photo appearance
```

---

## Detaylı Prompt Örnekleri

### Örnek 1: Watercolor Style

```
Watercolor children's book illustration:

**Character Description:**
- Name: Elif
- Age: 5 years old
- Gender: Girl
- Appearance: Long brown straight hair, green eyes behind round glasses, light skin tone, small freckles on cheeks, friendly smile
- Reference Photo: Based on uploaded photo of a 5-year-old Turkish girl with brown hair and green eyes wearing glasses

**Scene:**
Elif discovers a mysterious glowing egg in the park

**Character in Scene:**
- Expression: Amazed and curious, eyes wide open, mouth slightly open in wonder
- Action: Sitting on the ground, leaning forward, reaching out with one hand toward the egg
- Clothing: Pink dress with white flower patterns, white socks, brown shoes
- Position: Center foreground, looking at the egg

**Setting:**
A sunny park clearing with green grass, colorful flowers (pink, yellow, blue), tall trees in the background, soft morning sunlight filtering through leaves

**Additional Elements:**
- A large mysterious egg (about 30cm tall) with a soft golden glow, small cracks appearing on the surface
- White fluffy rabbit (Pamuk) sitting beside Elif, looking curious
- A few butterflies floating around

**Art Direction:**
- Style: Soft watercolor painting with gentle brushstrokes, hand-painted feel, paper texture visible, artistic and whimsical, pastel color palette
- Mood: Magical, wonder-filled, warm, enchanting
- Colors: Soft pastels - light pink, mint green, sky blue, golden yellow, cream white
- Composition: Close-up view, Elif and egg in center, rule of thirds, eye-level perspective
- Lighting: Soft morning light with magical golden glow from the egg, gentle shadows

**Technical Requirements:**
- High quality, print-ready (1024x1024 minimum, 300 DPI for print)
- No text, numbers, or letters in image
- Safe for children (no scary elements, friendly and positive)
- Character must closely match the uploaded photo: brown hair, green eyes, glasses, similar facial features
- Consistent character appearance across all pages
```

---

### Örnek 2: 3D Animation Style

```
3D animation style children's book illustration:

**Character Description:**
- Name: Elif
- Age: 5 years old
- Gender: Girl
- Appearance: Long brown hair in ponytail, green eyes behind round glasses, light skin, cheerful expression
- Reference Photo: Based on uploaded photo - must maintain exact facial features, hair color, and eye color

**Scene:**
Elif and her brother Mert play with a friendly baby dinosaur in the park

**Character in Scene:**
- Expression: Joyful, laughing, happy smile
- Action: Running and playing, holding hands with baby dinosaur, jumping
- Clothing: Pink dress with white flowers, matching pink hairband
- Position: Left side of scene, in motion

**Setting:**
Bright sunny park with 3D rendered grass, trees, and playground equipment, blue sky with white clouds

**Additional Elements:**
- Small green friendly baby dinosaur (T-Rex style but cute and non-scary) playing with children
- Mert (3-year-old boy) on the right side
- Playground equipment in background (swing, slide)

**Art Direction:**
- Style: Pixar-style 3D animation, smooth renders, vibrant colors, glossy surfaces, cinematic quality
- Mood: Energetic, fun, playful, exciting
- Colors: Bright and vibrant - vivid pink, emerald green, sky blue, sunny yellow
- Composition: Wide shot, action-oriented, dynamic angles
- Lighting: Bright daylight, soft shadows, rim lighting on characters

**Technical Requirements:**
- High quality, print-ready (1024x1024 minimum)
- No text in image
- Safe for children
- Character must match uploaded photo: same brown hair, green eyes, glasses, facial structure
- 3D rendered style but maintaining character likeness
```

---

## Illustration Style Detayları

### Watercolor Style
```
Style: Soft watercolor painting, gentle brushstrokes, pastel colors, dreamy atmosphere, hand-painted feel, paper texture visible, artistic and whimsical, soft edges, flowing colors
```

### 3D Animation Style
```
Style: Pixar-style 3D animation, smooth renders, vibrant colors, glossy surfaces, dramatic lighting, cinematic composition, modern and polished, rounded forms, expressive features
```

### Cartoon Style
```
Style: Classic 2D cartoon illustration, bold outlines, flat colors, expressive features, playful and energetic, reminiscent of modern children's books, simple shapes, bright colors
```

### Realistic Style
```
Style: Realistic digital painting, detailed textures, natural lighting, photographic quality but slightly stylized, warm tones, professional illustration, lifelike but friendly
```

### Minimalist Style
```
Style: Simple shapes, limited color palette (3-4 colors), clean lines, geometric forms, modern and clean, Scandinavian design influence, flat design, negative space
```

### Vintage Storybook
```
Style: Classic vintage children's book illustration, soft colors, slightly faded look, nostalgic feel, pen and ink with watercolor wash, storybook charm, traditional techniques
```

---

## Karakter Tutarlılığı İçin Kritik Noktalar

### 1. Her Prompt'ta Aynı Karakter Tanımı

**Kullan:**
```
- Name: [SAME_NAME]
- Age: [SAME_AGE]
- Appearance: [EXACT_SAME_DESCRIPTION]
- Reference Photo: [SAME_REFERENCE]
```

**Değiştirme:**
- Sadece expression, action, clothing (context'e göre)

### 2. Fotoğraf Referansı

**DALL-E 3 için:**
- Fotoğrafı direkt gönderemezsin (URL olarak)
- Ama fotoğrafı detaylı tarif etmelisin
- "Based on uploaded photo" ifadesini kullan

**Midjourney için (gelecek):**
- `--cref [photo_url]` parametresi ile direkt referans verebilirsin

**Stable Diffusion için (gelecek):**
- LoRA training ile custom model oluşturabilirsin

### 3. Detaylı Fiziksel Özellikler

**Mutlaka Belirt:**
- Saç rengi (exact: "dark brown", not just "brown")
- Saç stili (exact: "long straight hair", "curly bob", vb.)
- Göz rengi (exact: "bright green", "hazel", vb.)
- Yüz şekli (round, oval, square)
- Özel özellikler (glasses, freckles, dimples, vb.)
- Ten rengi (light, medium, dark - specific tone)

### 4. Tutarlı Kıyafet (Opsiyonel)

**İlk sayfalarda:**
- Kıyafeti belirle: "pink dress with white flowers"

**Sonraki sayfalarda:**
- Aynı kıyafeti kullan (veya benzer renk paleti)
- Bu karakter tanımlamayı kolaylaştırır

---

## Prompt Oluşturma Script İçin Yapı

### Input Parametreleri:

```typescript
interface ImagePromptParams {
  // Karakter
  characterName: string;
  characterAge: number;
  characterGender: "boy" | "girl";
  characterAppearance: {
    hairColor: string;
    hairStyle: string;
    eyeColor: string;
    skinTone: string;
    features: string[]; // ["glasses", "freckles"]
  };
  photoDescription: string; // Fotoğraftan çıkarılan detaylı açıklama
  
  // Hikaye
  sceneDescription: string; // Hikayeden gelen sahne açıklaması
  characterEmotion: string; // "happy", "curious", "excited"
  characterAction: string; // "running", "sitting", "pointing"
  setting: string; // "park", "forest", "beach"
  
  // Stil
  illustrationStyle: string; // "watercolor", "3d", "cartoon"
  mood: string; // "magical", "adventurous", "calm"
  
  // Diğer
  otherCharacters?: string[]; // ["Mert (brother)", "Pamuk (rabbit)"]
  objects?: string[]; // ["dinosaur egg", "butterfly"]
}
```

### Output:

```typescript
interface ImagePrompt {
  fullPrompt: string; // Tam prompt metni
  styleDetails: string; // Style-specific detaylar
  characterDescription: string; // Karakter tanımı
}
```

---

## Test ve İyileştirme

### Test Senaryoları:

1. **Aynı karakter, farklı sahneler**
   - 10 farklı sahne
   - Karakter %70+ benzer görünmeli

2. **Farklı illustration style'lar**
   - Aynı karakter, farklı stiller
   - Karakter tanınabilir olmalı

3. **Farklı açılar ve pozisyonlar**
   - Front, side, back view
   - Karakter tutarlı olmalı

### İyileştirme Noktaları:

- Prompt'ta eksik detaylar
- Karakter tanımı yeterince spesifik değil
- Style ile karakter uyumsuzluğu
- Reference photo açıklaması yetersiz

---

## Sonraki Adımlar

1. Bu template'i POC script'ine entegre et
2. Test görselleri üret
3. Karakter tutarlılığını değerlendir
4. Prompt'u iyileştir
5. Final template'i belirle

---

**Son Güncelleme:** 21 Aralık 2025  
**Kritik Not:** Bu prompt'un başarısı, karakter tutarlılığına bağlı. Her test sonrası prompt'u iyileştir.

