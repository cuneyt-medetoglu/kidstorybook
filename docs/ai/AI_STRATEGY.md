# 🤖 AI Stratejisi ve Prompt Engineering
# HeroKidStory Platform

**Doküman Versiyonu:** 1.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Planlama Aşaması

---

## 1. AI Kullanım Alanları

### 1.1 Hikaye Metni Üretimi (Story Generation)
- 24 sayfalık kişiselleştirilmiş hikaye
- Yaş grubuna uygun dil ve kelime seçimi
- Seçilen temaya uygun içerik

### 1.2 Görsel Üretimi (Image Generation)
- Karakterin her sayfada tutarlı görünümü
- Seçilen illustration style'a uygun
- Hikaye akışına uygun sahneler

### 1.3 Kitap Başlığı Önerisi
- Hikayeye uygun yaratıcı başlıklar

---

## 2. Hikaye Üretimi - Prompt Stratejisi

### 2.1 Kullanıcıdan Alınacak Parametreler

```typescript
interface StoryParams {
  // Karakter Bilgileri
  characters: {
    name: string;              // "Elif" - Kullanıcı girdisi
    age: number;               // 5 - Kullanıcı girdisi
    gender: "boy" | "girl";    // "girl" - Kullanıcı girdisi
    role: "main" | "side";     // "main"
    
    // Kullanıcı Girdileri
    hairColor: string;         // "Kahverengi" - Kullanıcı seçimi
    eyeColor: string;          // "Yeşil" - Kullanıcı seçimi
    features: string[];        // ["gözlüklü", "çilli"] - Kullanıcı seçimi
    
    // Referans Görsel
    referencePhotoUrl: string; // Yüklenen çocuk fotoğrafı (referans)
    
    // AI Analiz Sonuçları (Fotoğraftan)
    aiAnalysis: {
      hairLength: "short" | "medium" | "long";  // AI analizi
      hairStyle: "straight" | "wavy" | "curly" | "braided" | "ponytail";  // AI analizi
      hairTexture: string;     // AI analizi
      faceShape: string;       // AI analizi
      eyeShape: string;        // AI analizi
      skinTone: string;        // AI analizi
      bodyProportions: string; // AI analizi
      clothing?: string;       // AI analizi (varsa)
    };
    
    // Birleştirilmiş Tanım (Prompt için)
    fullDescription: string;   // Tüm bilgiler birleştirilmiş: "5-year-old girl with long brown curly hair, green eyes, wearing glasses..."
  }[];
  
  // Pet/Oyuncak (opsiyonel)
  pet?: {
    type: "dog" | "cat" | "rabbit" | "other";
    name: string;
    photoUrl?: string;
  };
  
  plushie?: {
    description: string;       // "kahverengi ayıcık"
    name: string;              // "Honey"
    photoUrl?: string;
  };
  
  // Hikaye Ayarları
  theme: string;               // "adventure", "fairy_tale", "educational"
  subtheme: string;            // "dinosaurs", "space", "underwater"
  ageGroup: "0-2" | "3-5" | "6-9";
  language: "tr" | "en";
  
  // Özel İstekler
  customRequests?: string;     // "Kitapta dinozorlar olsun, parkta top oynasınlar"
  
  // Stil ve Format
  illustrationStyle: string;   // "watercolor", "3d", "cartoon"
  font: string;                // "bubblegum-sans"
  
  // Kitap Detayları
  title?: string;              // Kullanıcı girerse, yoksa AI önerir
  foreword?: string;           // Kişisel önsöz (opsiyonel)
}
```

### 2.2 Master Prompt Template

```markdown
You are a professional children's book author specializing in personalized stories.

# Task
Create a magical, engaging 24-page children's story.

# Story Details
- **Main Character:** [NAME], [AGE] years old, [GENDER]
  - Physical features: [HAIR_COLOR] hair, [EYE_COLOR] eyes, [OTHER_FEATURES]
- **Side Characters:** [LIST OTHER CHARACTERS]
- **Pet/Companion:** [PET_NAME], a [PET_TYPE]
- **Theme:** [THEME] - [SUBTHEME]
- **Age Group:** [AGE_GROUP]
- **Language:** [LANGUAGE]

# Special Requests
[CUSTOM_REQUESTS]

# Story Requirements
1. Total length: 24 pages
2. Language complexity: Age-appropriate for [AGE_GROUP]
3. Tone: Warm, encouraging, magical
4. Structure:
   - Pages 1-2: Introduction and setting
   - Pages 3-20: Adventure and challenges
   - Pages 21-23: Resolution and lessons learned
   - Page 24: Happy ending and closing
5. Include positive values: friendship, courage, curiosity, kindness

# Format
Return the story as a JSON object:
{
  "title": "Suggested book title",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Story text for this page (50-80 words)",
      "imagePrompt": "Detailed prompt for AI image generation"
    },
    // ... 24 pages total
  ],
  "moral": "The story's main lesson"
}

# Important Notes
- Use the character's name frequently
- Keep language simple and rhythmic
- Each page should have 50-80 words max
- Image prompts should be detailed and specify the illustration style: [ILLUSTRATION_STYLE]
- Maintain character consistency across all image prompts
- Include the pet/plushie in relevant scenes

Now create the story!
```

### 2.3 Yaş Grubuna Göre Dil Ayarlaması

#### 0-2 Yaş:
- Çok basit kelimeler
- Tekrarlayan cümleler
- Sesli ifadeler (pat pat pat, hop hop hop)
- 20-30 kelime per sayfa
- Ritmik ve şarkı gibi

#### 3-5 Yaş:
- Basit ama çeşitli kelimeler
- Kısa cümleler
- Aksiyon ve duygular
- 40-60 kelime per sayfa
- Eğlenceli ve hareketli

#### 6-9 Yaş:
- Daha karmaşık kelime hazinesi
- Uzun cümleler
- Diyaloglar
- Daha detaylı hikaye
- 60-100 kelime per sayfa
- Macera ve problem çözme

### 2.4 Tema Bazlı Prompt Varyasyonları

#### Macera Teması:
```
The story should be adventurous with exciting challenges, mysterious places, and brave actions. Include elements of exploration and discovery.
```

#### Peri Masalı Teması:
```
The story should have magical elements, talking animals, enchanted objects, and a touch of wonder. Include fantasy creatures and magical transformations.
```

#### Eğitici Tema (Sayılar):
```
The story should naturally incorporate counting from 1 to 10. Make learning fun through the adventure. Each number should be discovered or collected in the story.
```

---

## 3. Görsel Üretimi - Prompt Stratejisi

### 3.1 Karakter Tutarlılığı İçin Yaklaşım

#### Adım 1: Karakter Referans Görseli Oluştur

Kullanıcı fotoğrafı yüklediğinde, önce bir "karakter referans görseli" üret:

```
Create a character illustration in [STYLE] style:
- A [AGE]-year-old [GENDER] child
- Name: [NAME]
- Physical features: [HAIR_COLOR] hair in [HAIRSTYLE], [EYE_COLOR] eyes
- Wearing [OUTFIT]
- Additional features: [GLASSES/FRECKLES/ETC]
- [ILLUSTRATION_STYLE] art style
- Clean, simple background
- Full body, front-facing view
- Warm, friendly expression
- Suitable for children's book illustration

Style specifics for [watercolor/3d/cartoon/etc]: [STYLE_SPECIFIC_DETAILS]
```

#### Adım 2: Her Sayfa İçin Görsel Prompt

```
[ILLUSTRATION_STYLE] children's book illustration:

**Scene:** [SCENE_DESCRIPTION from story]

**Character:** 
- [NAME], a [AGE]-year-old [GENDER] child
- Appearance: [HAIR_COLOR] [HAIRSTYLE] hair, [EYE_COLOR] eyes, [OTHER_FEATURES]
- Wearing: [OUTFIT]
- Expression: [EMOTION]
- Action: [WHAT_THEY_ARE_DOING]

**Setting:** [LOCATION and ENVIRONMENT]

**Additional elements:**
- [PET/PLUSHIE if present]
- [OTHER_CHARACTERS if present]
- [PROPS and OBJECTS]

**Art direction:**
- Style: [ILLUSTRATION_STYLE]
- Mood: [MOOD - warm/exciting/mysterious/etc]
- Colors: [COLOR_PALETTE]
- Composition: [PERSPECTIVE and FRAMING]
- Lighting: [SOFT/BRIGHT/DRAMATIC]

**Technical requirements:**
- High quality, print-ready
- No text in image
- Safe for children
- Positive and uplifting imagery
```

### 3.2 Illustration Style Prompts

#### Watercolor Style:
```
Style: Soft watercolor painting, gentle brushstrokes, pastel colors, dreamy atmosphere, hand-painted feel, paper texture visible, artistic and whimsical
```

#### 3D Animation Style:
```
Style: Pixar-style 3D animation, smooth renders, vibrant colors, glossy surfaces, dramatic lighting, cinematic composition, modern and polished
```

#### Cartoon Style:
```
Style: Classic 2D cartoon illustration, bold outlines, flat colors, expressive features, playful and energetic, reminiscent of modern children's books
```

#### Realistic Style:
```
Style: Realistic digital painting, detailed textures, natural lighting, photographic quality but slightly stylized, warm tones, professional illustration
```

#### Minimalist Style:
```
Style: Simple shapes, limited color palette (3-4 colors), clean lines, geometric forms, modern and clean, Scandinavian design influence
```

#### Vintage Storybook:
```
Style: Classic vintage children's book illustration, soft colors, slightly faded look, nostalgic feel, pen and ink with watercolor wash, storybook charm
```

---

## 4. AI Model Seçimi ve Stratejisi

### 4.1 Hikaye Metni İçin

**Birincil:** GPT-4o (OpenAI)
- Hızlı (2-3 saniye)
- Yüksek kalite
- JSON output desteği
- Çok dilli

**Yedek:** Claude 3.5 Sonnet
- GPT-4o sorun olursa
- Benzer kalite

**Maliyet:** ~$0.03-0.05 per hikaye

### 4.2 Görsel İçin

**MVP Aşaması:** DALL-E 3
- Kolay entegrasyon (OpenAI SDK)
- İyi kalite
- Maliyet: $0.04-0.08 per görsel

**İyileştirme Aşaması:** 
- **Midjourney** (consistent character için)
- **Stable Diffusion + LoRA** (custom character training)

### 4.3 Hybrid Yaklaşım (İlk 6 Ay)

```
IF user orders book:
  1. Generate story with GPT-4o (otomatik)
  2. Generate character reference image with DALL-E 3 (otomatik)
  3. MANUEL REVIEW: İnsan kontrolü (kalite ve tutarlılık)
  4. Sayfaların %50'sini DALL-E 3 ile üret
  5. %50'sini manuel düzenle/iyileştir
  6. Son kontrol
  7. PDF oluştur ve gönder

AFTER 6 months:
  - Daha otomatik, %80-90 otomasyonla
  - Sadece kalite kontrol
```

---

## 5. Prompt Örnekleri

### 5.1 Örnek Hikaye Promptu (Türkçe - 5 yaş)

```
You are a professional children's book author specializing in personalized stories.

# Task
Create a magical, engaging 24-page children's story.

# Story Details
- **Main Character:** Elif, 5 years old, girl
  - Physical features: Kahverengi uzun saçlı, yeşil gözlü, gözlüklü
- **Side Character:** Mert (kardeşi), 3 years old, boy
- **Pet:** Pamuk, a white rabbit
- **Theme:** Adventure - Dinosaurs
- **Age Group:** 3-5 years
- **Language:** Turkish

# Special Requests
"Kitapta dinozorlar olsun, Elif ve Mert parkta dinozor yumurtası bulsunlar, yumurtadan dinozor çıksın ve onunla oyun oynasınlar"

# Story Requirements
1. Total length: 24 pages
2. Language complexity: Age-appropriate for 3-5 years (simple Turkish)
3. Tone: Warm, encouraging, magical
4. Structure:
   - Pages 1-2: Introduction - Elif and Mert go to the park
   - Pages 3-20: Adventure - Finding egg, hatching, playing with baby dinosaur
   - Pages 21-23: Resolution - Returning baby dino to mama
   - Page 24: Happy ending and friendship
5. Include positive values: friendship, courage, caring for others

# Format
Return the story as a JSON object with Turkish text:
{
  "title": "Elif ve Dinozor Yumurtası",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Güneşli bir sabahta Elif ve kardeşi Mert parka gitmek için hazırlanıyorlar...",
      "imagePrompt": "Watercolor illustration: A 5-year-old Turkish girl named Elif with long brown hair, green eyes, glasses, wearing a pink dress, and her 3-year-old brother Mert with short brown hair, walking happily toward a park. A white rabbit named Pamuk hops beside them. Sunny morning, colorful park in background."
    }
    // ... 24 pages
  ],
  "moral": "Dostluk ve paylaşmak güzeldir"
}

Now create the story!
```

### 5.2 Örnek Görsel Promptu

**Sayfa 8 - Dinozor Yumurtasından Çıkıyor:**

```
Watercolor children's book illustration:

**Scene:** A giant mysterious egg cracks open in a park clearing

**Character:** 
- Elif, a 5-year-old Turkish girl
- Appearance: Long brown hair, green eyes, wearing round glasses, pink dress
- Expression: Amazed and excited, eyes wide open
- Action: Sitting on the ground, looking at the cracking egg

**Character 2:**
- Mert, a 3-year-old Turkish boy
- Appearance: Short brown hair, wearing blue overalls
- Expression: Curious, pointing at the egg
- Action: Standing next to Elif

**Additional elements:**
- Pamuk, a fluffy white rabbit sitting beside them
- A large cracking egg with mystical glow
- Tiny cute baby dinosaur (green, friendly looking) peeking out
- Park setting with trees and flowers

**Art direction:**
- Style: Soft watercolor painting with gentle brushstrokes
- Mood: Magical, wonder-filled, warm
- Colors: Pastel palette - soft pinks, greens, blues, golden sunlight
- Composition: Close-up view, children in foreground, egg center stage
- Lighting: Soft morning light with magical glow from egg

**Technical requirements:**
- High quality, print-ready (1024x1024 minimum)
- No text in image
- Safe for children, friendly and non-scary
- Positive and uplifting imagery
```

---

## 6. Karakter Tutarlılığı Teknikleri

### Teknik 1: Seed Values (DALL-E 3 desteklemiyor, SD için)
```python
# Stable Diffusion için
seed = hash(character_id)  # Aynı karakter için aynı seed
```

### Teknik 2: Detaylı Karakter Tanımı
Her promptta aynı tanım:
```
Elif: 5-year-old Turkish girl, long brown hair in ponytail, green eyes behind round glasses, pink dress with white flowers, friendly smile, curious expression
```

### Teknik 3: Reference Image (Gelecek)
```python
# Midjourney veya gelişmiş SD ile
image_prompt = base_prompt + " --cref " + character_reference_url
```

### Teknik 4: LoRA Training (Gelecek - Otomasyonlu)
```python
# Kullanıcının yüklediği fotoğraflarla
train_lora(
    images=[uploaded_photo_1, uploaded_photo_2],
    character_name="elif_user123",
    training_steps=500
)

# Sonra her görselde bu LoRA'yı kullan
```

---

## 7. Kalite Kontrol ve İyileştirme

### 7.1 Hikaye Kalite Kriterleri
- [ ] Dil yaş grubuna uygun mu?
- [ ] Hikayede tutarlılık var mı?
- [ ] Pozitif mesajlar içeriyor mu?
- [ ] Karakter adları doğru kullanılmış mı?
- [ ] Özel istekler hikayeye dahil edilmiş mi?
- [ ] 24 sayfa dolu mu?

### 7.2 Görsel Kalite Kriterleri
- [ ] Karakter her sayfada benzer görünüyor mu?
- [ ] İllustration style tutarlı mı?
- [ ] Görsel hikaye ile uyumlu mu?
- [ ] Çocuklar için güvenli mi? (korkutucu değil)
- [ ] Print kalitesi yeterli mi? (çözünürlük)

### 7.3 Otomatik Validation

```typescript
async function validateStory(story: Story): Promise<ValidationResult> {
  const checks = {
    pageCount: story.pages.length === 24,
    characterNameUsage: story.pages.every(p => p.text.includes(story.characterName)),
    wordCountPerPage: story.pages.every(p => {
      const words = p.text.split(' ').length;
      return words >= 30 && words <= 100;
    }),
    imagePromptsProvided: story.pages.every(p => p.imagePrompt.length > 50),
  };
  
  return checks;
}
```

---

## 8. Maliyet Optimizasyonu

### 8.1 Hikaye Üretimi Maliyeti
- GPT-4o: ~$0.035 per hikaye
- Cache kullanımı: System prompt'u cache'le → %50 tasarruf

### 8.2 Görsel Üretimi Maliyeti

**Senaryo 1: Full DALL-E 3**
- 12 görsel × $0.08 = $0.96 per kitap

**Senaryo 2: Hybrid (DALL-E + Manuel)**
- 6 görsel × $0.08 = $0.48 per kitap
- + Manuel editing zamanı

**Senaryo 3: Stable Diffusion (Gelecek)**
- 12 görsel × $0.01 = $0.12 per kitap
- + LoRA training: $0.50 per kitap (one-time)

### 8.3 Toplam AI Maliyeti Per Kitap

| Aşama | DALL-E 3 | SD + LoRA |
|-------|----------|-----------|
| Hikaye | $0.035 | $0.035 |
| Görseller | $0.96 | $0.62 |
| **TOPLAM** | **$0.995** | **$0.655** |

**Hedef Maliyet:** < $1.00 per kitap (AI)

---

## 9. İyileştirme ve A/B Test Stratejisi

### 9.1 Test Edilecek Varyasyonlar

**Hikaye Tonu:**
- Varyasyon A: Daha heyecanlı, macera dolu
- Varyasyon B: Daha sakin, eğitici

**Görsel Stiller:**
- En çok tercih edilen stil hangisi?
- Kullanıcı geri bildirimleri

**Prompt İyileştirme:**
- Hangi promptlar daha tutarlı karakterler üretiyor?
- Hangi açıklamalar daha iyi sonuç veriyor?

### 9.2 Metrikler

- **Hikaye Kalitesi:** Kullanıcı puanlaması (1-5)
- **Görsel Tutarlılığı:** Manuel değerlendirme (1-5)
- **Üretim Süresi:** Saniye
- **Maliyet:** $ per kitap
- **Revizyon Oranı:** % kaç kitap revizyona gidiyor

---

## 10. API Entegrasyonu - Kod Örnekleri

### 10.1 Hikaye Üretimi

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateStory(params: StoryParams): Promise<Story> {
  const prompt = buildStoryPrompt(params);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'You are a professional children\'s book author...'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,  // Yaratıcılık için
  });
  
  const story = JSON.parse(response.choices[0].message.content);
  return story;
}
```

### 10.2 Görsel Üretimi

```typescript
async function generateImage(
  imagePrompt: string,
  style: IllustrationStyle
): Promise<string> {
  const fullPrompt = `${imagePrompt}\n\nStyle: ${getStyleDescription(style)}`;
  
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: fullPrompt,
    size: '1024x1024',
    quality: 'hd',
    n: 1,
  });
  
  const imageUrl = response.data[0].url;
  
  // Download and save to S3
  const s3Url = await uploadToS3(imageUrl);
  
  return s3Url;
}
```

### 10.3 Full Pipeline

```typescript
async function createBook(params: StoryParams): Promise<Book> {
  // 1. Generate story
  const story = await generateStory(params);
  
  // 2. Generate character reference
  const characterRef = await generateCharacterReference(params);
  
  // 3. Generate images for each page
  const imagePromises = story.pages.map(page =>
    generateImage(page.imagePrompt, params.illustrationStyle)
  );
  const images = await Promise.all(imagePromises);
  
  // 4. Combine story + images
  const book = {
    ...story,
    pages: story.pages.map((page, i) => ({
      ...page,
      imageUrl: images[i],
    })),
  };
  
  // 5. Generate PDF
  const pdfUrl = await generatePDF(book);
  
  // 6. Save to database
  await saveBook(book, pdfUrl);
  
  return book;
}
```

---

## 11. Gelecek İyileştirmeler

### 11.1 Faz 2 (3-6 Ay Sonra)
- [ ] Midjourney API entegrasyonu (consistent character)
- [ ] Kullanıcının görsel düzenleme yapabilmesi
- [ ] Alternatif görsel üretme ("Bu görseli yeniden oluştur")
- [ ] Hikaye alternatif sonları

### 11.2 Faz 3 (6-12 Ay Sonra)
- [ ] Stable Diffusion + LoRA (otomatik training)
- [ ] Multi-modal AI (sesli hikaye)
- [ ] AI ile interaktif hikaye düzenleme
- [ ] Gelişmiş karakter editörü

---

**Son Güncelleme:** 21 Aralık 2025  
**Güncelleyen:** Proje Ekibi

