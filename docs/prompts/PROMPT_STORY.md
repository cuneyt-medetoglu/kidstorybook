# 📖 Hikaye İçeriği Üretimi Prompt Template
# KidStoryBook Platform

**Doküman Versiyonu:** 1.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Template - POC için

**AI Model:** GPT-4o (OpenAI) - Önerilen  
**Alternatif:** GPT-4 Turbo (daha hızlı, biraz daha ucuz)

---

## Prompt Template Yapısı

### Ana Template:

```
You are a professional children's book author specializing in personalized stories for young children.

# Task
Create a magical, engaging [PAGE_COUNT]-page children's story.

# Character Information
- **Main Character:** [CHARACTER_NAME], [AGE] years old, [GENDER]
  - Physical features: [HAIR_COLOR] hair, [EYE_COLOR] eyes, [OTHER_FEATURES]
  - Personality: [PERSONALITY_TRAITS] (if provided)
  - Photo reference: [PHOTO_DESCRIPTION]

# Additional Characters (if any)
[CHARACTER_LIST]

# Pet/Companion (if any)
[PET_INFO]

# Story Settings
- **Theme:** [THEME] - [SUBTHEME]
- **Age Group:** [AGE_GROUP]
- **Language:** [LANGUAGE]
- **Special Requests:** [CUSTOM_REQUESTS]

# Story Requirements
1. Total length: [PAGE_COUNT] pages
2. Language complexity: Age-appropriate for [AGE_GROUP]
3. Tone: [TONE] (warm, encouraging, magical, adventurous, etc.)
4. Structure:
   - Pages 1-2: Introduction and setting
   - Pages 3-[MIDDLE]: Adventure and challenges
   - Pages [MIDDLE+1]-[END-1]: Resolution and lessons learned
   - Page [END]: Happy ending and closing
5. Include positive values: [VALUES] (friendship, courage, curiosity, kindness, etc.)

# Format
Return the story as a JSON object:
{
  "title": "Suggested book title in [LANGUAGE]",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Story text for this page ([WORD_COUNT] words)",
      "imagePrompt": "Detailed prompt for AI image generation for this page"
    },
    // ... [PAGE_COUNT] pages total
  ],
  "moral": "The story's main lesson in [LANGUAGE]"
}

# Important Notes
- Use the character's name frequently throughout the story
- Keep language simple and rhythmic for [AGE_GROUP]
- Each page should have [WORD_COUNT] words max
- Image prompts should be detailed and specify the illustration style: [ILLUSTRATION_STYLE]
- Maintain character consistency across all image prompts
- Include the pet/companion in relevant scenes
- Make the story engaging and age-appropriate
- Ensure the story flows naturally from page to page

Now create the story!
```

---

## Yaş Grubuna Göre Ayarlamalar

### 0-2 Yaş Grubu

**Dil Özellikleri:**
- Çok basit kelimeler
- Tekrarlayan cümleler
- Sesli ifadeler (pat pat pat, hop hop hop)
- 20-30 kelime per sayfa
- Ritmik ve şarkı gibi

**Örnek Prompt Eklemeleri:**
```
- Use very simple words that toddlers can understand
- Include repetitive phrases and sounds (like "pat pat pat", "hop hop hop")
- Keep sentences very short (3-5 words max)
- Use onomatopoeia (sound words)
- Make it rhythmic, like a song or nursery rhyme
- Each page: 20-30 words maximum
```

**Örnek Sayfa:**
```
"Elif sees a big ball.
Bounce, bounce, bounce!
The ball is red and round.
Bounce, bounce, bounce!"
```

---

### 3-5 Yaş Grubu

**Dil Özellikleri:**
- Basit ama çeşitli kelimeler
- Kısa cümleler
- Aksiyon ve duygular
- 40-60 kelime per sayfa
- Eğlenceli ve hareketli

**Örnek Prompt Eklemeleri:**
```
- Use simple but varied vocabulary
- Keep sentences short (5-8 words)
- Include action words and emotions
- Make it fun and energetic
- Include dialogue between characters
- Each page: 40-60 words maximum
```

**Örnek Sayfa:**
```
"Elif and Mert walked to the park. The sun was shining brightly.
'Look!' said Elif, pointing. 'What's that?'
They saw something glowing behind the big oak tree."
```

---

### 6-9 Yaş Grubu

**Dil Özellikleri:**
- Daha karmaşık kelime hazinesi
- Uzun cümleler
- Diyaloglar
- Daha detaylı hikaye
- 60-100 kelime per sayfa
- Macera ve problem çözme

**Örnek Prompt Eklemeleri:**
```
- Use more complex vocabulary appropriate for early readers
- Include longer sentences (8-12 words)
- Add dialogue and character interactions
- Include problem-solving elements
- Make it adventurous with challenges
- Each page: 60-100 words maximum
```

**Örnek Sayfa:**
```
"Elif couldn't believe her eyes. The egg was much larger than she expected, and it was glowing with a soft golden light. She carefully approached it, her heart beating with excitement and a little bit of fear.
'Should we touch it?' Mert asked, staying close to his sister.
'I think we should be careful,' Elif replied, but her curiosity was too strong to resist."
```

---

## Tema Bazlı Prompt Varyasyonları

### Macera Teması

```
The story should be adventurous with exciting challenges, mysterious places, and brave actions. Include elements of exploration and discovery. The main character should face obstacles and overcome them with courage and creativity.
```

### Peri Masalı Teması

```
The story should have magical elements, talking animals, enchanted objects, and a touch of wonder. Include fantasy creatures and magical transformations. Make it feel like a classic fairy tale but personalized.
```

### Eğitici Tema (Sayılar)

```
The story should naturally incorporate counting from 1 to 10. Make learning fun through the adventure. Each number should be discovered or collected in the story. The numbers should appear organically, not forced.
```

### Eğitici Tema (Alfabe)

```
The story should naturally incorporate letters of the alphabet. Each page can focus on a different letter, or letters can appear throughout the story. Make learning fun and engaging.
```

### Doğa ve Hayvanlar

```
The story should focus on nature, animals, and the environment. Include educational elements about animals, plants, or natural phenomena. Promote appreciation for nature and wildlife.
```

---

## Detaylı Prompt Örneği (Türkçe - 5 Yaş)

```
You are a professional children's book author specializing in personalized stories for young children.

# Task
Create a magical, engaging 10-page children's story.

# Character Information
- **Main Character:** Elif, 5 years old, girl
  - Physical features: Long brown straight hair, green eyes, wears round glasses, light skin tone, small freckles
  - Personality: Curious, brave, kind, loves adventures
  - Photo reference: Based on uploaded photo of a 5-year-old Turkish girl with brown hair and green eyes wearing glasses

# Additional Characters
- Mert, 3 years old, boy (Elif's younger brother)
  - Physical features: Short brown hair, blue eyes, light skin
  - Personality: Playful, follows his sister

# Pet/Companion
- Pamuk, a white fluffy rabbit
  - Elif's pet rabbit who often joins adventures

# Story Settings
- **Theme:** Adventure - Dinosaurs
- **Age Group:** 3-5 years
- **Language:** Turkish
- **Special Requests:** "Elif and Mert should find a dinosaur egg in the park. The egg should hatch and a friendly baby dinosaur should come out. They should play together and then help the baby dinosaur find its mother."

# Story Requirements
1. Total length: 10 pages
2. Language complexity: Age-appropriate for 3-5 years (simple Turkish, short sentences)
3. Tone: Warm, encouraging, magical, adventurous
4. Structure:
   - Pages 1-2: Introduction - Elif and Mert go to the park
   - Pages 3-7: Adventure - Finding the egg, hatching, playing with baby dinosaur
   - Pages 8-9: Resolution - Finding the mother dinosaur, saying goodbye
   - Page 10: Happy ending - Elif and Mert return home with happy memories
5. Include positive values: Friendship, courage, caring for others, helping those in need

# Format
Return the story as a JSON object:
{
  "title": "Elif ve Dinozor Yumurtası",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Güneşli bir sabahta Elif ve kardeşi Mert parka gitmek için hazırlanıyorlardı. Elif pembe elbiseli, gözlüklü ve çok heyecanlıydı. Mert de mavi tişörtlü ve ablasını takip ediyordu.",
      "imagePrompt": "Watercolor illustration: A 5-year-old Turkish girl named Elif with long brown hair, green eyes, round glasses, wearing a pink dress with white flowers, and her 3-year-old brother Mert with short brown hair, blue eyes, wearing a blue t-shirt, walking happily toward a colorful park. A white fluffy rabbit named Pamuk hops beside them. Sunny morning, bright colors, soft watercolor style."
    },
    {
      "pageNumber": 2,
      "text": "Parka vardıklarında Elif çok güzel çiçekler gördü. 'Bak Mert!' dedi. 'Ne kadar güzel çiçekler var!' Mert de çiçeklere bakıp gülümsedi. Pamuk da çimenlerde zıplıyordu.",
      "imagePrompt": "Watercolor illustration: Elif (5 years old, brown hair, green eyes, glasses, pink dress) and Mert (3 years old, brown hair, blue eyes, blue t-shirt) in a park surrounded by colorful flowers (pink, yellow, blue). Elif is pointing at the flowers with excitement. Pamuk the white rabbit is hopping in the green grass. Soft watercolor style, warm colors, sunny day."
    }
    // ... 8 more pages
  ],
  "moral": "Dostluk ve yardımseverlik çok önemlidir. Yeni arkadaşlar edinmek ve onlara yardım etmek harika bir şeydir."
}

# Important Notes
- Use "Elif" and "Mert" frequently throughout the story
- Keep language simple and rhythmic for 3-5 year olds
- Each page should have 40-60 words max
- Image prompts should be detailed and specify: watercolor illustration style
- Maintain character consistency: Elif always has brown hair, green eyes, glasses, pink dress
- Include Pamuk the rabbit in relevant scenes
- Make the story engaging and age-appropriate
- Ensure the story flows naturally from page to page
- Use Turkish language throughout
- Make it magical and fun

Now create the story!
```

---

## JSON Çıktı Formatı

### Beklenen JSON Yapısı:

```json
{
  "title": "Kitap Başlığı",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Sayfa metni burada...",
      "imagePrompt": "Bu sayfa için detaylı görsel prompt..."
    },
    {
      "pageNumber": 2,
      "text": "İkinci sayfa metni...",
      "imagePrompt": "İkinci sayfa görsel prompt..."
    }
    // ... diğer sayfalar
  ],
  "moral": "Hikayenin ana mesajı"
}
```

### Validasyon Kuralları:

- `title`: String, 5-50 karakter
- `pages`: Array, tam olarak [PAGE_COUNT] eleman
- Her `page`:
  - `pageNumber`: Number, 1'den başlayarak sıralı
  - `text`: String, [WORD_COUNT] kelime limitinde
  - `imagePrompt`: String, minimum 100 karakter
- `moral`: String, 10-100 karakter

---

## Prompt Oluşturma Script İçin Yapı

### Input Parametreleri:

```typescript
interface StoryPromptParams {
  // Karakter
  characterName: string;
  characterAge: number;
  characterGender: "boy" | "girl";
  characterAppearance: {
    hairColor: string;
    eyeColor: string;
    features: string[];
  };
  photoDescription: string;
  
  // Diğer karakterler
  otherCharacters?: {
    name: string;
    age: number;
    gender: "boy" | "girl";
    relationship: string; // "brother", "sister", "friend"
  }[];
  
  // Pet/Companion
  pet?: {
    type: string;
    name: string;
  };
  
  // Hikaye
  theme: string;
  subtheme: string;
  ageGroup: "0-2" | "3-5" | "6-9";
  language: "tr" | "en";
  customRequests?: string;
  
  // Format
  pageCount: number; // POC için 10
  illustrationStyle: string;
  
  // Ayarlar
  tone?: string; // "warm", "adventurous", "magical"
  values?: string[]; // ["friendship", "courage"]
}
```

### Output:

```typescript
interface StoryOutput {
  title: string;
  pages: {
    pageNumber: number;
    text: string;
    imagePrompt: string;
  }[];
  moral: string;
}
```

---

## Test Senaryoları

### Senaryo 1: Basit Macera
- 1 karakter
- Macera teması
- 3-5 yaş
- Türkçe

### Senaryo 2: Çoklu Karakter
- 2 karakter (kardeşler)
- Pet var
- Peri masalı teması
- 3-5 yaş
- Türkçe

### Senaryo 3: Eğitici
- 1 karakter
- Sayılar teması
- 0-2 yaş
- Türkçe

---

## İyileştirme Noktaları

### Prompt İyileştirmeleri:
- Daha spesifik karakter tanımları
- Daha detaylı sahne açıklamaları
- Yaş grubuna daha uygun dil seviyesi
- Daha iyi hikaye akışı

### Çıktı İyileştirmeleri:
- Image prompt'ların daha detaylı olması
- Metin ve görsel uyumunun artması
- Karakter isminin daha sık kullanılması
- Özel isteklerin daha iyi entegre edilmesi

---

## Sonraki Adımlar

1. Bu template'i POC script'ine entegre et
2. Test hikayeleri üret
3. Kaliteyi değerlendir
4. Prompt'u iyileştir
5. Final template'i belirle

---

**Son Güncelleme:** 21 Aralık 2025  
**Kritik Not:** Bu prompt'un başarısı, yaş grubuna uygun, akıcı ve eğlenceli hikayeler üretmesine bağlı.

