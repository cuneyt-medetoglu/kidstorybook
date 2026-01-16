# 🎨 Sahne Çeşitliliği İyileştirmesi Planı

**Tarih:** 16 Ocak 2026  
**Durum:** 📋 Planlama Aşaması - Onay Bekleniyor  
**Öncelik:** Yüksek  
**Etkilenen Sistemler:** Story Generation, Image Generation, Prompt Templates

---

## 📊 Mevcut Durum Analizi

### Sorun
Kapak ve sayfa görselleri neredeyse aynı sahneyi gösteriyor. Özellikle:
- Kapak ve Page 1, Page 2 görselleri çok benzer
- Scene descriptions çok kısa (74, 74, 68 karakter)
- Her sayfa için farklı sahne detayları yok
- Visual diversity yetersiz

### Terminal Loglarından Tespit Edilenler
```
Page 1 scene description length: 74
Page 2 scene description length: 74  
Page 3 scene description length: 68
```

**Sorun:** Scene descriptions çok kısa ve generic. Her sayfa için farklı sahne detayları yok.

---

## 🎯 Hedef

Her sayfa için **farklı, zengin ve detaylı sahneler** oluşturmak:
- ✅ Farklı perspektifler (geniş açı, yakın plan, kuş bakışı)
- ✅ Farklı kompozisyonlar (karakter odaklı, çevre odaklı, dengeli)
- ✅ Farklı zaman dilimleri (sabah, öğle, akşam, gece)
- ✅ Farklı hava durumları (güneşli, bulutlu, yağmurlu, karlı)
- ✅ Farklı lokasyonlar (ev, dışarı, orman, park, vb.)
- ✅ Farklı duygusal tonlar (mutlu, heyecanlı, sakin, meraklı)
- ✅ Farklı kamera açıları ve kompozisyonlar

---

## 🔍 Kök Neden Analizi

### 1. Story Generation Prompt'unda Eksiklikler
**Mevcut Durum:**
- Story structure'da sadece genel yapı var: "Page 2: Introduction, Pages 3-7: Adventure"
- Scene diversity için explicit directive yok
- Her sayfa için farklı sahne detayları istenmiyor
- Image prompt'lar çok generic: "Detailed illustration prompt with character consistency"

**Eksik Olanlar:**
- Scene progression directives
- Visual diversity requirements
- Perspective/camera angle variety
- Time of day progression
- Location changes
- Composition variety

### 2. Image Prompt Generation'da Eksiklikler
**Mevcut Durum:**
- `generateFullPagePrompt()` fonksiyonu scene description'ı direkt kullanıyor
- Scene diversity için özel logic yok
- Her sayfa için farklı perspective/composition yok
- Time of day, weather, location extraction yok

**Eksik Olanlar:**
- Scene diversity analysis
- Perspective variety logic
- Composition variety logic
- Time/location extraction from story

### 3. Story Template'de Eksiklikler
**Mevcut Durum:**
- Story structure çok genel
- Her sayfa için özel gereksinimler yok
- Scene diversity için directive yok

**Eksik Olanlar:**
- Per-page scene requirements
- Visual diversity directives
- Scene progression guidelines

---

## 💡 Çözüm Önerileri

### Çözüm 1: Story Generation Prompt'una Scene Diversity Directives Ekle

#### 1.1 Story Structure'ı Detaylandır
**Mevcut:**
```
- Page 2: Introduction and story beginning
- Pages 3-7: Adventure and challenges
- Pages 8-9: Resolution and lessons learned
- Page 10: Happy ending and closing
```

**Yeni:**
```
- Page 1 (Cover): Professional book cover illustration - main character prominently featured, theme elements, visually striking
- Page 2: Introduction scene - different location/setting from cover, different time of day or weather, different composition (e.g., wide shot if cover is close-up)
- Pages 3-5: Adventure begins - each page should have DIFFERENT scenes:
  * Page 3: Discovery scene (different location, different perspective - e.g., close-up if previous was wide)
  * Page 4: Action scene (different location, different composition - e.g., dynamic angle)
  * Page 5: Exploration scene (different location, different time of day - e.g., afternoon if previous was morning)
- Pages 6-8: Challenge and problem-solving - each page should have DIFFERENT scenes:
  * Page 6: Problem introduction (different location, different mood)
  * Page 7: Attempt to solve (different location, different perspective)
  * Page 8: Creative solution (different location, different composition)
- Pages 9-10: Resolution and ending - each page should have DIFFERENT scenes:
  * Page 9: Resolution scene (different location, different time of day - e.g., evening)
  * Page 10: Happy ending (different location, different composition - e.g., wide shot with all characters)
```

#### 1.2 Visual Diversity Directives Ekle
**Yeni Bölüm:**
```
# CRITICAL - VISUAL DIVERSITY REQUIREMENTS (MANDATORY)

**EACH PAGE MUST HAVE A UNIQUE, DISTINCT SCENE - NO REPEATING SCENES:**

1. **Location Variety:**
   - Each page should be in a DIFFERENT location or show a DIFFERENT part of the same location
   - Examples: Page 2 (home), Page 3 (forest entrance), Page 4 (deep forest), Page 5 (clearing), Page 6 (mountain), Page 7 (cave), Page 8 (river), Page 9 (summit), Page 10 (returning home)
   - DO NOT repeat the same location on consecutive pages

2. **Time of Day Variety:**
   - Vary time of day across pages to show story progression
   - Examples: Page 2 (morning), Page 3 (late morning), Page 4 (noon), Page 5 (afternoon), Page 6 (late afternoon), Page 7 (evening), Page 8 (sunset), Page 9 (dusk), Page 10 (night or next morning)
   - DO NOT use the same time of day for multiple consecutive pages

3. **Weather/Atmosphere Variety:**
   - Vary weather or atmospheric conditions when appropriate
   - Examples: Page 2 (sunny), Page 3 (partly cloudy), Page 4 (windy), Page 5 (sunny), Page 6 (cloudy), Page 7 (light rain), Page 8 (clearing), Page 9 (sunny), Page 10 (beautiful weather)
   - DO NOT repeat the same weather for multiple consecutive pages

4. **Perspective/Camera Angle Variety:**
   - Vary camera angles and perspectives for visual interest
   - Examples: Page 2 (wide shot), Page 3 (medium shot), Page 4 (close-up), Page 5 (bird's eye view), Page 6 (low angle), Page 7 (eye level), Page 8 (high angle), Page 9 (medium shot), Page 10 (wide shot)
   - DO NOT use the same perspective for multiple consecutive pages

5. **Composition Variety:**
   - Vary composition and framing
   - Examples: Page 2 (character centered), Page 3 (character left, environment right), Page 4 (character right, action left), Page 5 (balanced composition), Page 6 (character small, environment large), Page 7 (character large, environment small), Page 8 (diagonal composition), Page 9 (symmetrical), Page 10 (group composition)
   - DO NOT repeat the same composition for multiple consecutive pages

6. **Action/Mood Variety:**
   - Vary character actions and emotional tones
   - Examples: Page 2 (calm introduction), Page 3 (excited discovery), Page 4 (active exploration), Page 5 (curious investigation), Page 6 (determined problem-solving), Page 7 (creative thinking), Page 8 (joyful solution), Page 9 (proud resolution), Page 10 (happy celebration)
   - DO NOT repeat the same action/mood for multiple consecutive pages

**CRITICAL CHECKLIST FOR EACH PAGE:**
Before finalizing each page's imagePrompt, verify:
- [ ] Location is DIFFERENT from previous page
- [ ] Time of day is DIFFERENT from previous page (or clearly progressing)
- [ ] Weather/atmosphere is DIFFERENT from previous page (or clearly changing)
- [ ] Perspective/camera angle is DIFFERENT from previous page
- [ ] Composition is DIFFERENT from previous page
- [ ] Action/mood is DIFFERENT from previous page
- [ ] Scene description is DETAILED (at least 150-200 characters, not just 70-80)
```

#### 1.3 Image Prompt Requirements'ı Güçlendir
**Mevcut:**
```
"imagePrompt": "Detailed ${illustrationStyle} illustration prompt with character consistency"
```

**Yeni:**
```
"imagePrompt": "DETAILED ${illustrationStyle} illustration prompt (MUST be 200+ characters) with:
- SPECIFIC location description (e.g., 'in a sunny forest clearing with tall oak trees, wildflowers, and a babbling brook')
- SPECIFIC time of day (e.g., 'late afternoon with golden sunlight filtering through leaves')
- SPECIFIC weather/atmosphere (e.g., 'partly cloudy sky with gentle breeze')
- SPECIFIC perspective/camera angle (e.g., 'medium shot from eye level, character in foreground')
- SPECIFIC composition (e.g., 'character on left side, environment on right, balanced framing')
- SPECIFIC character action and pose (e.g., 'character kneeling, examining something on the ground with curious expression')
- SPECIFIC environmental details (e.g., 'fallen leaves, mushrooms, small insects, dappled sunlight')
- Character consistency (same character as previous pages)
- Theme elements (${theme} - ${subtheme})
- Mood: ${mood}
- CRITICAL: This scene MUST be DIFFERENT from previous pages - different location, different time, different composition"
```

#### 1.4 Scene Description Requirements'ı Güçlendir
**Mevcut:**
```
"sceneDescription": "What's happening in this scene"
```

**Yeni:**
```
"sceneDescription": "DETAILED scene description (MUST be 150+ characters) including:
- SPECIFIC location (where exactly is this happening?)
- SPECIFIC time of day (morning/afternoon/evening/night)
- SPECIFIC weather/atmosphere (sunny/cloudy/rainy/snowy/windy)
- SPECIFIC character action (what is the character doing exactly?)
- SPECIFIC environmental details (what objects, animals, plants, or features are visible?)
- SPECIFIC emotional tone (how does the character feel? what's the mood?)
- CRITICAL: This scene MUST be DIFFERENT from previous pages"
```

### Çözüm 2: Image Generation'da Scene Diversity Logic Ekle

#### 2.1 Scene Diversity Analysis Fonksiyonu
**Yeni Fonksiyon:**
```typescript
interface SceneDiversityAnalysis {
  location: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' | 'unknown'
  weather: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy' | 'unknown'
  perspective: 'wide' | 'medium' | 'close-up' | 'bird-eye' | 'low-angle' | 'high-angle' | 'eye-level'
  composition: 'centered' | 'left' | 'right' | 'balanced' | 'diagonal' | 'symmetrical' | 'group'
  mood: string
  action: string
}

function analyzeSceneDiversity(
  sceneDescription: string,
  pageNumber: number,
  previousScenes: SceneDiversityAnalysis[]
): SceneDiversityAnalysis {
  // Extract location, time, weather, perspective, composition from scene description
  // Ensure diversity from previous scenes
  // Return analysis
}
```

#### 2.2 Perspective Variety Logic
**Yeni Fonksiyon:**
```typescript
function getPerspectiveForPage(
  pageNumber: number,
  totalPages: number,
  previousPerspectives: string[]
): string {
  // Rotate through perspectives: wide, medium, close-up, bird-eye, low-angle, high-angle, eye-level
  // Ensure no consecutive pages have same perspective
  // Return appropriate perspective
}
```

#### 2.3 Composition Variety Logic
**Yeni Fonksiyon:**
```typescript
function getCompositionForPage(
  pageNumber: number,
  totalPages: number,
  previousCompositions: string[]
): string {
  // Rotate through compositions: centered, left, right, balanced, diagonal, symmetrical, group
  // Ensure no consecutive pages have same composition
  // Return appropriate composition
}
```

#### 2.4 Time/Location Extraction
**Yeni Fonksiyon:**
```typescript
function extractTimeAndLocation(
  sceneDescription: string,
  storyText: string
): { timeOfDay?: string; location?: string; weather?: string } {
  // Extract time of day from keywords: morning, afternoon, evening, night, sunrise, sunset
  // Extract location from keywords: home, forest, park, mountain, beach, etc.
  // Extract weather from keywords: sunny, cloudy, rainy, snowy, windy
  // Return extracted values
}
```

### Çözüm 3: generateFullPagePrompt() Fonksiyonunu Güncelle

#### 3.1 Scene Diversity Directives Ekle
**Mevcut:**
```typescript
export function generateFullPagePrompt(
  characterPrompt: string,
  scene: SceneInput,
  illustrationStyle: string,
  ageGroup: string,
  additionalCharactersCount: number = 0,
  isCover: boolean = false,
  useCoverReference: boolean = false
): string
```

**Yeni:**
```typescript
export function generateFullPagePrompt(
  characterPrompt: string,
  scene: SceneInput,
  illustrationStyle: string,
  ageGroup: string,
  additionalCharactersCount: number = 0,
  isCover: boolean = false,
  useCoverReference: boolean = false,
  previousScenes?: SceneDiversityAnalysis[] // NEW: For diversity tracking
): string
```

#### 3.2 Scene Diversity Prompt Bölümü Ekle
**Yeni Bölüm:**
```typescript
// SCENE DIVERSITY REQUIREMENTS (NEW)
if (!isCover && previousScenes && previousScenes.length > 0) {
  const lastScene = previousScenes[previousScenes.length - 1]
  
  promptParts.push('')
  promptParts.push('CRITICAL - SCENE DIVERSITY REQUIREMENTS:')
  promptParts.push('This scene MUST be VISUALLY DISTINCT from previous pages:')
  
  if (lastScene.location) {
    promptParts.push(`- Location: MUST be DIFFERENT from previous page (previous: ${lastScene.location})`)
  }
  if (lastScene.timeOfDay && lastScene.timeOfDay !== 'unknown') {
    promptParts.push(`- Time of day: MUST be DIFFERENT or PROGRESSING from previous page (previous: ${lastScene.timeOfDay})`)
  }
  if (lastScene.weather && lastScene.weather !== 'unknown') {
    promptParts.push(`- Weather: MUST be DIFFERENT or CHANGING from previous page (previous: ${lastScene.weather})`)
  }
  if (lastScene.perspective) {
    promptParts.push(`- Perspective: MUST be DIFFERENT from previous page (previous: ${lastScene.perspective})`)
  }
  if (lastScene.composition) {
    promptParts.push(`- Composition: MUST be DIFFERENT from previous page (previous: ${lastScene.composition})`)
  }
  
  promptParts.push('')
  promptParts.push('ENSURE VISUAL VARIETY:')
  promptParts.push('- Use different camera angles (wide shot, close-up, bird-eye, low-angle, etc.)')
  promptParts.push('- Use different compositions (character left, right, centered, balanced, etc.)')
  promptParts.push('- Show different parts of the environment or different locations')
  promptParts.push('- Vary time of day to show story progression')
  promptParts.push('- Vary weather/atmosphere when appropriate')
  promptParts.push('- Show different character actions and poses')
}
```

---

## 📋 Implementasyon Adımları

### Faz 1: Story Generation Prompt Güncellemeleri (Yüksek Öncelik)
1. ✅ Story structure'ı detaylandır (her sayfa için özel gereksinimler)
2. ✅ Visual diversity directives ekle
3. ✅ Image prompt requirements'ı güçlendir
4. ✅ Scene description requirements'ı güçlendir
5. ✅ Story template dokümantasyonunu güncelle

**Dosyalar:**
- `lib/prompts/story/v1.0.0/base.ts`
- `docs/prompts/STORY_PROMPT_TEMPLATE_v1.0.0.md`

### Faz 2: Image Generation Scene Diversity Logic (Orta Öncelik)
1. ✅ Scene diversity analysis fonksiyonu ekle
2. ✅ Perspective variety logic ekle
3. ✅ Composition variety logic ekle
4. ✅ Time/location extraction fonksiyonu ekle
5. ✅ `generateFullPagePrompt()` fonksiyonunu güncelle

**Dosyalar:**
- `lib/prompts/image/v1.0.0/scene.ts`
- `app/api/books/route.ts` (scene diversity tracking)

### Faz 3: Testing ve İyileştirme (Düşük Öncelik)
1. ✅ Test kitap oluştur (farklı temalar, farklı yaş grupları)
2. ✅ Scene diversity analizi yap (her sayfa farklı mı?)
3. ✅ Kullanıcı feedback'i topla
4. ✅ Gerekirse prompt'ları fine-tune et

---

## 🎯 Beklenen Sonuçlar

### Öncesi
- Kapak ve Page 1, Page 2 görselleri neredeyse aynı
- Scene descriptions çok kısa (70-80 karakter)
- Her sayfa için farklı sahne detayları yok
- Visual diversity yetersiz

### Sonrası (Beklenen)
- ✅ Her sayfa için farklı, zengin ve detaylı sahneler
- ✅ Scene descriptions detaylı (150-200+ karakter)
- ✅ Farklı perspektifler, kompozisyonlar, zaman dilimleri
- ✅ Visual diversity artmış (%80-90+ farklılık)
- ✅ Story progression görsel olarak net

---

## 📊 Metrikler

### Başarı Kriterleri
1. **Scene Description Length:** Ortalama 150+ karakter (şu an 70-80)
2. **Location Variety:** Her sayfa farklı lokasyon veya lokasyonun farklı kısmı
3. **Time of Day Variety:** En az 3-4 farklı zaman dilimi (sabah, öğle, akşam, gece)
4. **Perspective Variety:** En az 5-6 farklı perspektif (geniş, orta, yakın, kuş bakışı, alçak açı, yüksek açı)
5. **Composition Variety:** En az 5-6 farklı kompozisyon (merkez, sol, sağ, dengeli, diyagonal, simetrik)
6. **Visual Similarity:** Kapak ve sayfalar arası görsel benzerlik %30'dan az (şu an %70-80)

---

## ⚠️ Riskler ve Önlemler

### Risk 1: Story Generation Çok Karmaşık Olabilir
**Risk:** Çok fazla directive story generation'ı zorlaştırabilir, AI karışabilir.

**Önlem:**
- Directives'i aşamalı olarak ekle
- Test ederek fine-tune et
- Gerekirse bazı directives'i optional yap

### Risk 2: Scene Diversity Logic Çok Kısıtlayıcı Olabilir
**Risk:** Her sayfa için farklılık zorunluluğu story flow'u bozabilir.

**Önlem:**
- Diversity logic'i "suggestive" yap, "mandatory" değil
- Story flow'u önceliklendir
- Gerekirse bazı sayfalar için exception'lar ekle

### Risk 3: Image Generation Süresi Artabilir
**Risk:** Daha detaylı prompt'lar image generation süresini artırabilir.

**Önlem:**
- Prompt length'i optimize et
- Gereksiz tekrarları kaldır
- Test ederek süre optimizasyonu yap

---

## 📝 Dokümantasyon Güncellemeleri

### Güncellenecek Dosyalar
1. ✅ `docs/prompts/STORY_PROMPT_TEMPLATE_v1.0.0.md` - Visual diversity bölümü eklenecek
2. ✅ `docs/prompts/CHANGELOG.md` - v1.0.2 versiyonu eklenecek
3. ✅ `docs/prompts/IMAGE_PROMPT_TEMPLATE_v1.0.0.md` - Scene diversity bölümü eklenecek
4. ✅ `docs/ROADMAP.md` - Yeni task eklenecek

---

## ✅ Onay ve Başlangıç

**Plan Durumu:** 📋 Hazır - Onay Bekleniyor

**Önerilen Başlangıç Sırası:**
1. Faz 1: Story Generation Prompt Güncellemeleri (En yüksek etki)
2. Faz 2: Image Generation Scene Diversity Logic (Destekleyici)
3. Faz 3: Testing ve İyileştirme (Doğrulama)

**Tahmini Süre:**
- Faz 1: 2-3 saat
- Faz 2: 2-3 saat
- Faz 3: 1-2 saat
- **Toplam: 5-8 saat**

---

**Son Güncelleme:** 16 Ocak 2026  
**Hazırlayan:** @prompt-manager  
**Onay:** ⏳ Bekleniyor
