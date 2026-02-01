# 🎨 Görsel Kalite İyileştirme - Full Çözüm Planı

**Tarih:** 31 Ocak 2026  
**Owner:** @prompt-manager  
**Hedef:** Yapay görünümden sinematik kaliteye geçiş (%90+ iyileşme)  
**Durum:** 🟢 Faz 1–2 tamamlandı (31 Ocak 2026)

**Bu doküman:** Görsel/sahne kalitesi için **tek referans**. Sahne çeşitliliği, kompozisyon, kapak–ilk sayfa (3.5.19, 3.5.20) hepsi burada toplandı.

---

## Nasıl ilerleyeceğiz?

| Ne | Nerede |
|----|--------|
| **Ana plan** | Bu dosya (IMAGE_QUALITY_IMPROVEMENT_PLAN.md) |
| **Şu anki odak** | Faz 3.4 – Sahne mükemmelliği (karakter ortada değil, bakış çeşitliliği, 3.5.19 + 3.5.20) |
| **Sıra** | 1) Prompt–kod eşitliği (docs/prompts ↔ lib/prompts). 2) Sahne mükemmelliği kodu (scene.ts: konum + gaze). |
| **Referans kalite** | `test/1.png`, `test/2.png` – hikaye anlatan, kompozisyon çeşitli sahneler |
| **Referans ton** | Test görselleri **gün ışığı / Pixar** tonunda değil; daha farklı, kendine özgü bir ton. Pixar/golden hour direktifleri bu tonu bozuyor olabilir; direktifler yumuşatılmalı, referans tona yaklaşılmalı. |
| **Faz 4** | Yok – Alternatif AI Provider bu plana dahil değil (kaldırıldı). |

Eski sahne/kompozisyon planları ve analizler `docs/archive/` altına taşındı; tekrarlar kaldırıldı.

---

## ✅ TO-DO LİSTESİ

### Faz 1: Altyapı İyileştirmeleri (Kolay - 1-2 saat)
- [x] 1.1 - Log seviyesi sistemi ekle (`LOG_LEVEL=info`)
- [x] ~~1.2 - Image quality~~ (iptal: API’de "standard" yok; `low` kaldı. Kalite parametresi: low/medium/high/auto.)
- [x] ~~1.3 - Batch size~~ (iptal: Rate limit OpenAI tier’a göre; 4/90s kullanıcı limitine uygun, tier artınca artırılabilir.)
- [x] 1.4 - Master fotoğraf uyarısı ekle (Step 2, düz/frontal)

### Faz 2: Prompt Yapısı Reformu (Orta - 2-4 saat)
- [x] 2.1 - **Scene-First Prompt:** Sahne → Karakter sırası
- [x] 2.2 - **Golden Hour Boost:** Color grading güçlendirildi → sonra **yumuşatıldı** (referans ton: test görselleri gün ışığı/Pixar değil; Pixar/golden hour zorlaması kaldırıldı)
- [x] 2.3 - **Pose Variation:** 8 farklı pose direktifi pool'u
- [x] 2.4 - **Atmospheric Depth:** Uzak nesneler desaturation
- [x] 2.5 - **Character Integration:** "Pasted" görünümünü önle

### Faz 3: İleri Seviye Optimizasyon (Zor - 1 hafta)
- [ ] 3.1 - **Multiple Reference Angles:** Frontal + 3/4 + profile sistemi
- [ ] 3.2 - **Clothing-Agnostic Master:** Vücut+yüz odaklı master
- [ ] 3.3 - **Story-Driven Clothing Sync:** Master'a story clothing uygula
- [x] 3.4 - **Advanced Composition Rules (Sahne Mükemmelliği – 3.5.19 + 3.5.20):** Karakter ortada değil (sol/sağ üçte bir, rule of thirds); bakış/yön çeşitliliği (izleyiciye değil sahne içine); cinematic framing. ✅ `scene.ts` v1.8.2: getCharacterPlacementForPage, getAdvancedCompositionRules, getGazeDirectionForPage; getCompositionRules(isCover).
- [ ] 3.5 - **Lighting Research:** Işık çeşitliliği (referans tona uygun; Pixar/gün ışığı zorlaması yok)

### Dokümantasyon ve Uyum (Her faz sonunda)
- [ ] **Dokümantasyon:** Yapılan işlerin en sonunda doğru dokümantasyon yapılması (ROADMAP, implementation, changelog).
- [ ] **Prompt–doküman uyumu:** Çalışan prompt sistemi (story + image) ile dokümantasyon birebir aynı içerikte olmalı:
  - `lib/prompts/story/base.ts` ↔ `docs/prompts/STORY_PROMPT_TEMPLATE.md`
  - `lib/prompts/image/*` (scene.ts, character.ts, negative.ts, style-descriptions.ts) ↔ `docs/prompts/IMAGE_PROMPT_TEMPLATE.md`

---

## 📊 PROBLEM ANALİZİ (Özet)

### 🔴 Ana Sorun: "Yapay Görünüm"
Kullanıcı feedback: *"Karakter sanki sonradan eklenmiş. Baş her sayfada aynı pozisyonda. Hikayeye uyum yok. Renk tonları düz."*

### Neden Oluyor?

| Sorun | Neden | Etki |
|-------|--------|------|
| Karakter "yapıştırılmış" | OpenAI Edits API: Character + Scene ayrı | %60 |
| Baş hep aynı açı | Referans fotoğraf profil açısından | %40 |
| Renk tonları düz | Golden hour var ama zayıf, color grading yok | %80 |
| Pose çeşitliliği yok | Pose variation direktifleri eksik | %70 |
| Sahne derinliği zayıf | Atmospheric perspective minimal | %50 |

**Toplam iyileştirme potansiyeli:** %60-70 (Faz 1-2), %90+ (Faz 1-3)

---

## 🎯 FAZ 1: ALTYAPI İYİLEŞTİRMELERİ

### 1.1 - Log Seviyesi Sistemi

**Dosya:** `app/api/books/route.ts`

**Mevcut durum:**
```typescript
console.log('[Create Book] 🎨 Page 5 prompt (5228 chars)...')
console.log('[Create Book] 🧾 Page 5 FULL PROMPT START')
console.log('[Create Book] ...5000+ satır prompt...')
console.log('[Create Book] 🧾 Page 5 FULL PROMPT END')
```

**Hedef:**
```typescript
// .env
LOG_LEVEL=info // 'debug' | 'info' | 'warn' | 'error'

// app/api/books/route.ts
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const log = {
  debug: (...args: any[]) => LOG_LEVEL === 'debug' && console.log(...args),
  info: (...args: any[]) => ['debug', 'info'].includes(LOG_LEVEL) && console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args)
}

// Kullanım
log.debug('[Create Book] 🧾 FULL PROMPT:', fullPrompt) // Sadece debug'da
log.info('[Create Book] ✅ Page 5 generated (23s)') // Her zaman
log.error('[Create Book] ❌ Error:', error) // Her zaman
```

**Etki:** Log okunurluğu %80 artar.

---

### 1.2 - Image Quality Yükselt

**Dosya:** `app/api/books/route.ts`

**Mevcut:**
```typescript
const imageQuality = 'low' // GPT-image-1.5 quality
```

**Hedef:**
```typescript
const imageQuality = isExample || book.is_premium 
  ? 'standard' // Example books + premium için yüksek kalite
  : 'low'      // Normal kullanıcılar için maliyet optimizasyonu
```

**Trade-off:**
- **Maliyet:** +%20-30 (standard vs low)
- **Kalite:** +%30-40 (daha net, daha az artefact)

**Etki:** Example books için %30+ kalite artışı.

**İptal notu (31 Ocak 2026):** GPT Image API’de `"standard"` değeri yok; geçerli değerler `low`, `medium`, `high`, `auto`. Kalite `low` olarak bırakıldı; Page 11 bozulması kalite parametresiyle ilişkili değil (model tarafı).

---

### 1.3 - Batch Size Optimizasyonu

**Dosya:** `app/api/books/route.ts`

**Mevcut:**
```typescript
const BATCH_SIZE = 4 // 4 görsel/90 saniye
```

**Hedef:**
```typescript
const BATCH_SIZE = 3 // 3 görsel/90 saniye (daha güvenli)
```

**Neden?**
- OpenAI Tier 1: 4 IPM (Images Per Minute)
- Batch 4: Rate limit riski %30
- Batch 3: Rate limit riski %10, kalite +%10-15

**Trade-off:**
- **Süre:** 12 sayfa için ~1.5 dakika daha uzun
- **Güvenlik:** Rate limit hatası %80 azalır
- **Kalite:** API stress azalır → daha stabil output

**Etki:** Page 11 tipi bozulmalar %50 azalır.

**İptal notu (31 Ocak 2026):** Rate limit OpenAI tier’a göre yönetiliyor; kullanıcı 1 dk’da 5 hakkı ile 90 sn’de 4 görsel yapıyor, yeterli. Tier artınca batch kullanıcı tarafından artırılacak. BATCH_SIZE 4 olarak bırakıldı.

---

### 1.4 - Master Fotoğraf Uyarısı

**Dosya:** `app/create/step1/page.tsx` (Karakter oluşturma)

**Hedef:**
```tsx
<Alert variant="info">
  <InfoIcon className="h-4 w-4" />
  <AlertDescription>
    <strong>En İyi Sonuç için:</strong>
    <ul className="mt-2 space-y-1 text-sm">
      <li>✅ Tam karşıdan fotoğraf (yüz kameraya bakıyor)</li>
      <li>✅ Doğal ışık (güneş ışığı, minimal gölge)</li>
      <li>✅ Sade arka plan (dikkat dağıtmayan)</li>
      <li>✅ Doğal, rahat duruş</li>
      <li>❌ Yan/profil açı (tüm sayfalarda aynı açı olur)</li>
    </ul>
  </AlertDescription>
</Alert>
```

**Etki:** Kullanıcı bilinçlendirilir, yan bakış sorunu %60 azalır.

---

## 🎨 FAZ 2: PROMPT YAPISI REFORMU

### 2.1 - Scene-First Prompt Architecture

**Sorun:** Mevcut prompt karakter-merkezli (60% karakter + 40% sahne)

**Hedef:** Sahne-merkezli prompt (40% sahne + 30% karakter + 30% lighting/mood)

**Dosya:** `lib/prompts/image/scene.ts` → `generateFullPagePrompt()`

**Mevcut yapı:**
```
1. [ANATOMY] (200 chars)
2. [SAFE_POSES] (100 chars)
3. [COMPOSITION_DEPTH] (400 chars)
4. [CAMERA_PERSPECTIVE] (300 chars)
5. [CHARACTER_ENVIRONMENT_RATIO] (400 chars)
6. ILLUSTRATION STYLE (500 chars)
7. FOREGROUND: Character action (200 chars)
8. MIDGROUND: Scene (100 chars)
9. BACKGROUND: Scene (100 chars)
10. Style + quality directives (300 chars)
11. Character prompt (800 chars)
12. Clothing + diversity (200 chars)

Toplam: ~3600 chars (Character-heavy)
```

**Yeni yapı (Scene-First):**
```
1. [SCENE ESTABLISHMENT] - Önce sahneyi kur (600 chars)
   - Environment description (lush forest, golden hour...)
   - Atmospheric elements (haze, mist, god rays...)
   - Background details (sky, distant mountains, trees...)
   - Foreground-midground-background layering

2. [LIGHTING & ATMOSPHERE] - Sinematik ışık (400 chars)
   - Golden hour warm glow (5500K-6500K color temp)
   - Backlit sunlight, god rays
   - Soft peachy highlights on skin
   - Atmospheric warm glow (Pixar Luca-style)
   - Gentle shadows with warm undertones

3. [CHARACTER INTEGRATION] - Karakteri sahneye entegre et (500 chars)
   - Character description (from master)
   - "naturally integrated into scene" (kritik ifade)
   - "character as part of environment, not pasted on top"
   - Character action with natural pose variation
   - Character occupies 25-35% of frame

4. [COMPOSITION & STYLE] (400 chars)
   - Wide environmental shot
   - Rule of thirds composition
   - Layered depth (foreground sharp, midground detailed, background soft)
   - Pixar 3D animation style
   - Cinematic children's book illustration

5. [SAFETY & CONSISTENCY] (200 chars)
   - [ANATOMY] directives
   - [SAFE_POSES]
   - Character consistency emphasis

Toplam: ~2100 chars (Scene-heavy, daha dengeli)
```

**Kod değişikliği:**
```typescript
// lib/prompts/image/scene.ts
export function generateFullPagePrompt(
  sceneInput: SceneInput,
  character: CharacterDescription,
  illustrationStyle: string,
  ageGroup: string,
  isCoverPage: boolean,
  previousScenes?: SceneDiversityAnalysis[],
  additionalCharacters?: AdditionalCharacterDescription[]
): string {
  const parts: string[] = []

  // 1. SCENE ESTABLISHMENT (NEW: Scene-first approach)
  parts.push('[SCENE ESTABLISHMENT]')
  const environment = getEnvironmentDescription(sceneInput.theme, sceneInput.sceneDescription)
  const atmosphericElements = getAtmosphericElements(sceneInput)
  const backgroundDetails = getBackgroundDetails(sceneInput)
  parts.push(`${environment} with ${atmosphericElements}, ${backgroundDetails}`)
  parts.push('expansive background, rich details, layered depth')
  parts.push(`foreground: ${sceneInput.foreground}, midground: ${sceneInput.midground}, background: ${sceneInput.background}`)

  // 2. LIGHTING & ATMOSPHERE (NEW: Enhanced golden hour)
  parts.push('[CINEMATIC LIGHTING]')
  const lighting = getEnhancedLightingDescription(sceneInput.timeOfDay, sceneInput.mood)
  parts.push(lighting)
  parts.push('golden hour warm glow, soft orange-yellow tones')
  parts.push('backlit sunlight, god rays through trees/atmosphere')
  parts.push('warm color grading like Pixar\'s Luca sunset scenes')
  parts.push('soft peachy highlights on skin, atmospheric warm glow')
  parts.push('gentle shadows with warm undertones, natural depth')

  // 3. CHARACTER INTEGRATION (NEW: Integration emphasis)
  parts.push('[CHARACTER INTEGRATION]')
  const characterPrompt = buildCharacterPrompt(character.description, true, true)
  parts.push(`${characterPrompt} naturally integrated into scene`)
  parts.push('character as part of environment, not pasted on top')
  parts.push(`${sceneInput.characterAction} with natural pose variation`)
  parts.push('character occupies 25-35% of frame, environment 65-75%')

  // 4. COMPOSITION & STYLE
  parts.push('[COMPOSITION & STYLE]')
  // ... existing composition rules ...

  // 5. SAFETY & CONSISTENCY
  parts.push('[SAFETY]')
  parts.push(getAnatomicalCorrectnessDirectives())
  parts.push(getSafeHandPoses())
  parts.push('character must match reference photo exactly, same features on every page')

  return parts.join(', ')
}
```

**Etki:** 
- Sahne-karakter entegrasyonu %60 artar
- "Yapıştırılmış" görünüm %70 azalır

---

### 2.2 - Golden Hour Boost (Color Grading)

**Sorun:** Mevcut golden hour direktifleri zayıf

**Mevcut:**
```typescript
// lib/prompts/image/scene.ts - getLightingDescription()
if (timeOfDay === 'evening') {
  lightingParts.push('golden hour lighting')
  lightingParts.push('warm amber tones, golden glow')
}
```

**Hedef (Güçlendirilmiş):**
```typescript
function getEnhancedGoldenHourDirectives(): string {
  return [
    // Color grading (cinematic)
    'golden hour color grading',
    'warm orange-yellow tones like Pixar\'s Luca or Coco sunset scenes',
    'color temperature 5500K-6500K (warm daylight)',
    
    // Lighting technique
    'backlit sunlight creating god rays through leaves/trees/atmosphere',
    'soft peachy skin highlights with warm glow',
    'atmospheric warm haze in background',
    
    // Shadows & contrast
    'gentle shadows with warm undertones (no harsh blacks)',
    'soft vignette around edges',
    'dreamy warm atmosphere',
    
    // Reference
    'Pixar-quality golden hour lighting (Luca beach scene, Coco sunset)',
  ].join(', ')
}

// Usage in generateFullPagePrompt()
if (sceneInput.timeOfDay === 'evening' || sceneInput.mood === 'warm') {
  parts.push(getEnhancedGoldenHourDirectives())
}
```

**Kritik İfadeler:**
- ✅ "color temperature 5500K-6500K" (spesifik Kelvin değeri)
- ✅ "Pixar's Luca or Coco" (referans stil)
- ✅ "soft peachy skin highlights" (karakter ışıklandırması)
- ✅ "atmospheric warm haze" (derinlik için)

**Etki:** Renk tonları %80+ sinematik olur.

---

### 2.3 - Pose Variation Pool

**Sorun:** Her sayfada aynı duruş (baş aynı açıda)

**Hedef:** 8 farklı pose pool'u, her sayfa rastgele/sıralı seçim

**Dosya:** `lib/prompts/image/scene.ts`

**Yeni kod:**
```typescript
// Pose variation pool (8 different natural poses)
const POSE_VARIATIONS = [
  // Front-facing poses
  "character facing forward, standing naturally, arms at sides or one hand slightly raised",
  "character looking directly at viewer, warm smile, natural relaxed posture",
  
  // Action poses
  "character walking forward confidently, one leg mid-step, dynamic movement",
  "character sitting cross-legged on ground, comfortable and relaxed",
  "character jumping with joy, both arms raised above head, feet off ground",
  "character pointing at something off-screen with one hand, engaged expression",
  
  // Interaction poses
  "character looking up at sky with wonder, head tilted back slightly, arms at sides",
  "character crouching down examining something on ground, curious expression",
]

function getPoseVariationForPage(pageNumber: number, totalPages: number): string {
  // Distribute poses evenly across pages
  const poseIndex = Math.floor((pageNumber - 1) / (totalPages / POSE_VARIATIONS.length))
  return POSE_VARIATIONS[Math.min(poseIndex, POSE_VARIATIONS.length - 1)]
}

// Usage in generateFullPagePrompt()
const poseDirective = getPoseVariationForPage(sceneInput.pageNumber, 12)
parts.push(poseDirective)
parts.push('natural pose variation, NOT the same pose as other pages')
parts.push('head angle varies naturally (not always same angle)')
```

**Etki:** 
- Pose çeşitliliği %90+ artar
- "Her sayfada aynı duruş" sorunu çözülür

---

### 2.4 - Atmospheric Depth Enhancement

**Sorun:** Arka plan derinliği zayıf, düz görünüyor

**Hedef:** Uzak nesneler desaturation + contrast reduction

**Dosya:** `lib/prompts/image/scene.ts`

**Mevcut:**
```typescript
function getAtmosphericPerspectiveDirectives(): string {
  return 'atmospheric perspective: distant elements fade into soft mist, background colors become lighter and less saturated with distance'
}
```

**Güçlendirilmiş:**
```typescript
function getEnhancedAtmosphericDepth(): string {
  return [
    // Foreground (sharp, vivid)
    'foreground: sharp focus, vibrant saturated colors, rich textures, high contrast',
    
    // Midground (detailed)
    'midground: detailed and clear, moderate saturation, visible textures',
    
    // Background (atmospheric)
    'background: soft atmospheric haze, colors 30-40% less saturated',
    'distant elements fade into warm golden mist (if golden hour) or soft blue haze',
    'background contrast reduced by 50%, lighter tones',
    'horizon line visible with soft transition to sky',
    
    // Layered depth
    'clear separation between foreground, midground, and background layers',
    'aerial perspective: far objects appear lighter, bluer (or warmer if sunset)',
    'progressive blur: sharp → detailed → soft atmospheric',
  ].join(', ')
}

// Usage in generateFullPagePrompt()
parts.push('[ATMOSPHERIC DEPTH]')
parts.push(getEnhancedAtmosphericDepth())
```

**Etki:** Sahne derinliği %70 artar, düz görünüm ortadan kalkar.

---

### 2.5 - Character Integration Directives

**Sorun:** Karakter "yapıştırılmış" görünüyor (karakter + sahne ayrı)

**Hedef:** "Naturally integrated" direktiflerini güçlendir

**Dosya:** `lib/prompts/image/scene.ts`

**Yeni direktifler:**
```typescript
function getCharacterIntegrationDirectives(): string {
  return [
    // Integration emphasis (CRITICAL)
    'character naturally integrated into scene',
    'character is part of the environment, not pasted on top',
    'character interacts with environment (touching objects, casting shadows)',
    
    // Lighting consistency
    'character lighting matches scene lighting (same color temperature, same shadows)',
    'character receives same ambient light as environment',
    'character shadows are consistent with scene light direction',
    
    // Depth placement
    'character clearly positioned in 3D space (not floating)',
    'character feet touch ground/surface naturally',
    'character occludes background elements appropriately (depth layering)',
    
    // Scale consistency
    'character scale appropriate for distance from viewer',
    'character size consistent with environmental references (trees, objects)',
  ].join(', ')
}

// Usage in generateFullPagePrompt()
parts.push('[CHARACTER INTEGRATION]')
parts.push(getCharacterIntegrationDirectives())
```

**Etki:** "Yapıştırılmış" görünüm %60-70 azalır.

---

## 🚀 FAZ 3: İLERİ SEVİYE OPTİMİZASYON

### 3.1 - Multiple Reference Angles Sistemi

**Hedef:** 3 farklı açıdan master referans (frontal, 3/4 view, profile)

**Dosya:** `lib/db/characters.ts`, `app/api/books/route.ts`

**Veri modeli:**
```sql
-- supabase/migrations/017_add_multiple_reference_photos.sql
ALTER TABLE characters ADD COLUMN reference_photos_multi JSONB;

-- Structure:
-- {
--   "frontal": "https://...",     -- 0° (gözler kameraya)
--   "three_quarter": "https://...", -- 45° (3/4 view)
--   "profile": "https://..."      -- 90° (profil)
-- }
```

**Kullanım:**
```typescript
// app/api/books/route.ts
function selectReferencePhotoForPage(pageNumber: number, totalPages: number): string {
  const angleDistribution = [
    'frontal',       // Page 1, 4, 7, 10
    'three_quarter', // Page 2, 5, 8, 11
    'profile',       // Page 3, 6, 9, 12
  ]
  const angleType = angleDistribution[pageNumber % 3]
  return character.reference_photos_multi[angleType] || character.photo_url // Fallback
}

// Her sayfa için uygun açıdan referans kullan
const referencePhotoUrl = selectReferencePhotoForPage(pageNumber, totalPages)
```

**Etki:** Pose variation %100'e çıkar, her açı doğal görünür.

**Zorluk:** Kullanıcıdan 3 farklı açıdan fotoğraf isteme UX'i gerekli.

---

### 3.2 - Clothing-Agnostic Master İllustration

**Hedef:** Master illustration vücut+yüz odaklı (kıyafet-bağımsız)

**Sorun:** Master'da pembe elbise → Her hikayede pembe elbise (kıyafet değişemiyor)

**Çözüm:** Master illustration'da "generic clothing" veya "neutral clothing"

**Dosya:** `app/api/books/route.ts` (Cover/Master generation)

**Mevcut:**
```typescript
// Master generation'da full character description (kıyafet dahil)
const masterPrompt = buildCharacterPrompt(character.description, true, false) // includeAge=true, excludeClothing=false
```

**Yeni:**
```typescript
// Master generation'da kıyafet HARİÇ
const masterPrompt = buildCharacterPrompt(character.description, true, true) // includeAge=true, excludeClothing=true

// Ek direktif: Generic clothing
masterPrompt += ', wearing simple neutral clothing (plain solid color shirt), no specific style or brand'
```

**Alternatif:** Stable Diffusion + Inpainting (kıyafet bölgesini maskeleyip değiştirme)

**Etki:** Her hikayede kıyafet özgürlüğü, story-driven clothing %100 uyumlu.

**Zorluk:** OpenAI GPT-Image-1.5 inpainting desteklemiyor, Stable Diffusion gerekir.

---

### 3.3 - Story-Driven Clothing Sync

**Hedef:** Story generation'da belirlenen kıyafeti master'a uygula

**Dosya:** `app/api/books/route.ts`

**Flow:**
```
1. Story generation → Page 1 clothing: "astronaut suit"
2. Master illustration generation → Use "astronaut suit"
3. Page 2-12 generation → Use "astronaut suit" (consistent)
```

**Kod:**
```typescript
// After story generation
const storyClothing = generatedStoryData.pages[0].clothing || 'casual comfortable clothing'

// Master illustration with story clothing
const masterPrompt = buildCharacterPrompt(character.description, true, true) // exclude default clothing
masterPrompt += `, wearing ${storyClothing}, ${getClothingDetails(storyClothing)}`

// Pages 2-12 with same clothing
for (const page of pages) {
  page.clothing = storyClothing // Override with story clothing
}
```

**Etki:** Kıyafet tutarlılığı %100.

---

### 3.4 - Advanced Composition Rules

**Hedef:** Sinematik framing sistemi (rule of thirds, leading lines, golden ratio)

**Dosya:** `lib/prompts/image/scene.ts`

**Yeni kod:**
```typescript
function getAdvancedCompositionRules(pageNumber: number): string {
  const compositions = [
    // Rule of thirds
    'rule of thirds composition, character positioned at intersection points',
    
    // Leading lines
    'leading lines (path, fence, tree line) guide eye to character',
    
    // Golden ratio
    'golden ratio spiral composition, character at focal point',
    
    // Symmetrical
    'symmetrical composition, character centered with balanced elements',
    
    // Diagonal
    'diagonal composition, dynamic energy with character on diagonal axis',
    
    // Frame within frame
    'natural frame (tree branches, doorway) framing character',
  ]
  
  return compositions[pageNumber % compositions.length]
}

// Usage
parts.push('[ADVANCED COMPOSITION]')
parts.push(getAdvancedCompositionRules(pageNumber))
parts.push('cinematic framing, professional photography composition')
```

**Etki:** Kompozisyon kalitesi sinematik seviyeye çıkar.

---

### 3.5 - Lighting Research & Templates

**Hedef:** Pixar-level lighting kütüphanesi (6+ farklı lighting scenario)

**Dosya:** `lib/prompts/image/ (lighting in scene.ts).ts` (YENİ)

**Lighting scenarios:**
```typescript
export const LIGHTING_SCENARIOS = {
  golden_hour: {
    name: 'Golden Hour (Sunset/Sunrise)',
    colorTemp: '5500K-6500K',
    description: 'Warm orange-yellow glow, soft peachy highlights, backlit',
    reference: 'Pixar Luca beach sunset, Coco sunrise',
    directives: [
      'golden hour color grading, warm orange-yellow tones',
      'color temperature 5500K-6500K',
      'backlit sunlight, god rays through atmosphere',
      'soft peachy skin highlights',
      'gentle warm shadows',
      'dreamy warm atmosphere',
    ]
  },
  
  blue_hour: {
    name: 'Blue Hour (Dawn/Dusk)',
    colorTemp: '8000K-10000K',
    description: 'Cool blue tones, soft twilight ambiance',
    reference: 'Pixar Up early morning scene',
    directives: [
      'blue hour color grading, cool blue-purple tones',
      'color temperature 8000K-10000K',
      'soft twilight ambiance',
      'gentle cool highlights',
      'atmospheric blue haze',
    ]
  },
  
  midday_bright: {
    name: 'Midday Bright',
    colorTemp: '5000K-5500K',
    description: 'Even overhead light, high contrast, vibrant colors',
    reference: 'Pixar Finding Nemo underwater bright scenes',
    directives: [
      'bright midday sunlight, even overhead lighting',
      'high contrast, vibrant saturated colors',
      'minimal shadows, diffuse light',
      'clear sharp details',
    ]
  },
  
  overcast_soft: {
    name: 'Overcast Soft',
    colorTemp: '6000K-7000K',
    description: 'Diffused soft light, low contrast, gentle mood',
    reference: 'Pixar Inside Out memory orb scenes',
    directives: [
      'overcast soft diffused light',
      'low contrast, gentle mood',
      'even illumination, no harsh shadows',
      'muted but warm colors',
    ]
  },
  
  dramatic_backlighting: {
    name: 'Dramatic Backlighting',
    colorTemp: '5500K-6500K',
    description: 'Strong backlight, rim lighting, silhouette effect',
    reference: 'Pixar Brave forest scenes',
    directives: [
      'dramatic backlighting, strong rim light',
      'character silhouette with glowing edges',
      'god rays through trees/atmosphere',
      'high contrast between light and shadow',
      'cinematic dramatic mood',
    ]
  },
  
  magical_ambient: {
    name: 'Magical Ambient (Fantasy)',
    colorTemp: 'Varied (multi-color)',
    description: 'Glowing particles, soft ambient light, magical atmosphere',
    reference: 'Pixar Coco Land of the Dead',
    directives: [
      'magical ambient glow, soft multi-color light sources',
      'glowing particles in air (fireflies, magic dust)',
      'bioluminescent elements',
      'dreamlike soft atmosphere',
      'fantasy color palette',
    ]
  },
}

// Usage in generateFullPagePrompt()
function selectLightingScenario(timeOfDay: string, mood: string, theme: string): string {
  if (timeOfDay === 'evening' || mood === 'warm') return LIGHTING_SCENARIOS.golden_hour.directives.join(', ')
  if (timeOfDay === 'morning') return LIGHTING_SCENARIOS.blue_hour.directives.join(', ')
  if (theme === 'fantasy') return LIGHTING_SCENARIOS.magical_ambient.directives.join(', ')
  // ... etc
}
```

**Etki:** Her sahne için optimize edilmiş lighting, Pixar-level kalite.

---

## 📈 BAŞARI KRİTERLERİ

### Faz 1 (Altyapı)
- [ ] Log output %80 azaldı (okunabilir)
- [ ] Example books image quality `'standard'`
- [ ] Batch 3 ile rate limit hatası %80 azaldı
- [ ] Master fotoğraf uyarısı görünüyor

### Faz 2 (Prompt Reform)
- [ ] Scene-first prompt uygulandı
- [ ] Golden hour %80+ sayfalarda görünür (warm tones)
- [ ] 8 farklı pose minimum 6 sayfada
- [ ] Atmospheric depth görsel olarak fark edilir
- [ ] "Yapıştırılmış" yorumu %50 azaldı

### Faz 3 (İleri Seviye)
- [ ] Multiple reference angles sistemi çalışıyor
- [ ] Clothing-agnostic master POC başarılı
- [ ] Story-driven clothing %100 tutarlı
- [ ] Advanced composition rules uygulandı
- [ ] Lighting library 6+ scenario ile aktif

---

## 🎯 HEDEF SONUÇLAR

### Kısa Vadeli (Faz 1-2: 1 hafta)
- **Görsel kalite:** %60-70 iyileşme
- **Renk tonları:** %80 sinematik
- **Pose çeşitliliği:** %90+ artar
- **Kullanıcı memnuniyeti:** %50+ artar

### Orta Vadeli (Faz 3: 2-3 hafta)
- **Görsel kalite:** %80-90 iyileşme
- **Character-scene integration:** %80+ doğal
- **Kıyafet tutarlılığı:** %100
- **Kompozisyon kalitesi:** Sinematik seviye

---

## 📝 İLERLEME TAKİP

| Faz | Başlangıç | Bitiş | Durum | Notlar |
|-----|-----------|-------|-------|--------|
| Faz 1 | 31 Ocak 2026 | 31 Ocak 2026 | ✅ Tamamlandı | Log, master uyarısı (quality/batch iptal) |
| Faz 2 | - | - | ⏳ Bekliyor | Orta, 2-4 saat |
| Faz 3 | - | - | ⏳ Bekliyor | Zor, 1 hafta |

---

## 🔗 İLGİLİ DOKÜMANLAR

- **Sorun Analizi:** `docs/strategies/EXAMPLE_BOOKS_CUSTOM_REQUESTS.md`
- **Prompt Versiyonlama:** `lib/prompts/image/scene.ts`
- **Character Consistency:** `docs/strategies/CHARACTER_CONSISTENCY_STRATEGY.md`
- **ROADMAP:** `docs/ROADMAP.md` (Görsel kalite iyileştirme maddeleri)

---

## 📋 DOKÜMANTASYON VE PROMPT–DOKÜMAN UYUMU

### Neden?
- Yapılan işlerin takibi ve ileride geri dönüş için dokümantasyon güncel olmalı.
- Kodda değişen prompt’lar dokümanda da aynı olmalı; aksi halde yanlış referans ve tutarsız geliştirme riski vardır.

### Yapılacaklar (her faz sonunda)
1. **Dokümantasyon:** ROADMAP, ilgili implementation dosyası ve (varsa) changelog güncellenir.
2. **Prompt–doküman uyumu kontrolü:**
   - Story: `lib/prompts/story/base.ts` ↔ `docs/prompts/STORY_PROMPT_TEMPLATE.md`
   - Image: `lib/prompts/image/` (scene, character, negative, style) ↔ `docs/prompts/IMAGE_PROMPT_TEMPLATE.md`
3. **Araç:** Manuel diff veya kod incelemesi ile kod ↔ doküman eşleşmesi doğrulanır.

---

**Son Güncelleme:** 31 Ocak 2026  
**Sorumlu:** @prompt-manager  
**Durum:** Faz 1 tamamlandı. Faz 2’ye geçilebilir. Dokümantasyon ve prompt–doküman uyumu her faz sonunda yapılacak.
