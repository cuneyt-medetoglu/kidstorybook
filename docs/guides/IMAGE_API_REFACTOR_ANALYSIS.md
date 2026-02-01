# Image Generation API Refactor Analizi

**Tarih:** 24 Ocak 2026  
**Dosya:** `lib/prompts/image/scene.ts`  
**Durum:** ✅ Uygulandı (v1.7.0 - 24 Ocak 2026)

---

## Mevcut Durum Analizi

### Dosya Boyutları

| Dosya | Satır Sayısı | Durum |
|-------|--------------|-------|
| `scene.ts` | 1125 | Ana prompt fonksiyonları |
| `character.ts` | 588 | Karakter prompt fonksiyonları |
| `negative.ts` | 390 | Negative prompt'lar |
| `style-descriptions.ts` | 78 | Style açıklamaları |
| **TOPLAM** | **2181** | - |

### Ana Fonksiyonlar

#### `generateFullPagePrompt()` (satır 703-850, ~150 satır)
- **Yapı:** `promptParts` array kullanıyor (iyi - Story API'den farklı)
- **Helper fonksiyonlar:** Zaten birçok helper fonksiyon var:
  - `getDepthOfFieldDirectives()`
  - `getAtmosphericPerspectiveDirectives()`
  - `getCameraAngleDirectives()`
  - `getCharacterEnvironmentRatio()`
  - `getCompositionRules()`
  - `getAgeAppropriateSceneRules()`
  - `getCinematicElements()`
  - `getLightingDescription()`
  - `getEnvironmentDescription()`
  - `getStyleDescription()`
  - `generateLayeredComposition()`
  - `generateScenePrompt()`

#### `generateScenePrompt()` (satır 94-159, ~65 satır)
- **Yapı:** `parts` array kullanıyor (iyi)
- **Helper fonksiyonlar:** Zaten modüler

---

## İyileştirme Gereken Alanlar

### 1. Inline Direktifler (Modülerleştirme İhtiyacı)

#### Cover Directives (satır 793-801, 8 satır inline)
```typescript
if (isCover) {
  const charCount = additionalCharactersCount + 1
  promptParts.push(`COVER: Reference for all pages. Match reference photos exactly (hair/eyes/skin/features). All ${charCount} characters prominent. Professional, print-ready. Adults have adult proportions.`)
  promptParts.push('Cover = poster for the entire book; suggest key locations, theme, and journey in one image.')
  promptParts.push('Epic wide or panoramic composition; character(s) as guides into the world, environment shows the world of the story.')
  promptParts.push('Eye-catching, poster-like, movie-poster quality. Reserve clear space for title at top.')
  promptParts.push('Dramatic lighting (e.g. golden hour, sun rays through clouds) where it fits the theme.')
  promptParts.push('Cover: epic wide; character max 30-35% of frame; environment-dominant.')
  promptParts.push('Cover composition and camera must be distinctly different from the first interior page.')
}
```

**Öneri:** `buildCoverDirectives(additionalCharactersCount: number): string[]` fonksiyonu

#### First Interior Page Directives (satır 811-815, 4 satır inline)
```typescript
if (sceneInput.pageNumber === 1 && !isCover) {
  promptParts.push('FIRST INTERIOR PAGE: Must be distinctly different from the book cover. Use a different camera angle (e.g. cover = medium/portrait, page 1 = wide or low-angle), different composition (e.g. rule of thirds, character off-center), and/or expanded scene detail. Do not repeat the same framing as the cover.')
  promptParts.push('Character smaller in frame, NOT centered; use rule of thirds or leading lines (e.g. path).')
  const charNote = additionalCharactersCount > 0 ? `All ${additionalCharactersCount + 1} characters prominent` : 'Character integrated into scene'
  promptParts.push(`Book interior illustration (flat, standalone, NOT 3D mockup). ${charNote}. No text/writing.`)
}
```

**Öneri:** `buildFirstInteriorPageDirectives(additionalCharactersCount: number): string[]` fonksiyonu

#### Clothing Directives (satır 832-841, 9 satır inline - 3 durum)
```typescript
const themeClothing = getThemeAppropriateClothing(sceneInput.theme)
const clothingDesc = sceneInput.clothing?.trim() || themeClothing
if (isCover) {
  promptParts.push(`Clothing: ${clothingDesc} (reference for all pages). No formal wear. Match story/scene.`)
} else if (useCoverReference) {
  promptParts.push('Clothing: Match cover exactly. No formal wear.')
} else {
  promptParts.push(`Clothing: ${clothingDesc}. No formal wear. Match story/scene.`)
}
```

**Öneri:** `buildClothingDirectives(clothing: string | undefined, theme: string, isCover: boolean, useCoverReference: boolean): string` fonksiyonu

#### Multiple Characters Directives (satır 785-789, 4 satır inline)
```typescript
if (additionalCharactersCount > 0) {
  const totalCharacters = additionalCharactersCount + 1
  promptParts.push(`${totalCharacters} characters in the scene: main character and ${additionalCharactersCount} companion(s)`)
  promptParts.push(`all ${totalCharacters} characters should be visible and clearly identifiable`)
  promptParts.push('group composition, balanced arrangement of characters')
}
```

**Öneri:** `buildMultipleCharactersDirectives(additionalCharactersCount: number): string[]` fonksiyonu

#### Cover Reference Consistency (satır 805-808, 3 satır inline)
```typescript
if (useCoverReference) {
  const charNote = additionalCharactersCount > 0 ? `All ${additionalCharactersCount + 1} characters` : 'Character'
  promptParts.push(`${charNote} match cover image exactly (hair/eyes/skin/features). Only clothing/pose vary.`)
}
```

**Öneri:** `buildCoverReferenceConsistencyDirectives(additionalCharactersCount: number): string` fonksiyonu

### 2. Tekrar Eden Direktifler

#### Character Consistency (3 farklı yerde)
1. **generateScenePrompt (satır 111):** `"consistent character design, same character as previous pages"`
2. **generateScenePrompt (satır 156):** `"character must match reference photo exactly, same features on every page"`
3. **generateFullPagePrompt (satır 820):** `"Illustration style (NOT photorealistic). Match reference features."`

**Öneri:** `buildCharacterConsistencyDirectives(): string[]` fonksiyonu - tüm character consistency direktiflerini birleştir

#### Style Directives (2 farklı yerde)
1. **generateScenePrompt (satır 103):** `${styleDesc} illustration, cinematic quality`
2. **generateFullPagePrompt (satır 777):** `ILLUSTRATION STYLE: ${styleDesc}`
3. **generateFullPagePrompt (satır 820):** `Illustration style (NOT photorealistic). Match reference features.`

**Öneri:** `buildStyleDirectives(illustrationStyle: string): string[]` fonksiyonu - tüm style direktiflerini birleştir

---

## Refactor Önerisi

### Faz 1: Inline Direktifleri Modülerleştir (Düşük Risk)

**Hedef:** `generateFullPagePrompt` içindeki inline direktifleri ayrı builder fonksiyonlarına taşı.

**Fonksiyonlar:**
1. `buildCoverDirectives(additionalCharactersCount: number): string[]`
2. `buildFirstInteriorPageDirectives(additionalCharactersCount: number): string[]`
3. `buildClothingDirectives(clothing: string | undefined, theme: string, isCover: boolean, useCoverReference: boolean): string`
4. `buildMultipleCharactersDirectives(additionalCharactersCount: number): string[]`
5. `buildCoverReferenceConsistencyDirectives(additionalCharactersCount: number): string`

**Fayda:**
- `generateFullPagePrompt` daha okunabilir olur (~150 satır → ~100 satır)
- Direktifler tek yerden yönetilir
- Test edilebilirlik artar

**Risk:** Düşük (sadece refactor, logic aynı)

### Faz 2: Tekrar Eden Direktifleri Birleştir (Düşük Risk)

**Hedef:** Character consistency ve style direktiflerini tek fonksiyonlarda birleştir.

**Fonksiyonlar:**
1. `buildCharacterConsistencyDirectives(): string[]` - Tüm character consistency direktiflerini birleştir
2. `buildStyleDirectives(illustrationStyle: string): string[]` - Tüm style direktiflerini birleştir

**Fayda:**
- Tutarlılık sağlanır
- Güncelleme kolaylaşır (tek yerden)

**Risk:** Düşük (sadece birleştirme, logic aynı)

### Faz 3: Prompt Bölümlerini Daha İyi Organize Et (Opsiyonel - Orta Risk)

**Hedef:** `generateFullPagePrompt` içindeki bölümleri daha net organize et.

**Bölümler:**
1. Anatomical & Safety (mevcut)
2. Composition & Depth (mevcut)
3. Lighting & Atmosphere (mevcut)
4. Camera & Perspective (mevcut)
5. Character-Environment Ratio (mevcut)
6. Style (mevcut)
7. Layered Composition (mevcut)
8. Scene Prompt (mevcut)
9. Age Rules (mevcut)
10. **Cover Directives** (yeni - builder fonksiyonu)
11. **First Interior Page Directives** (yeni - builder fonksiyonu)
12. **Multiple Characters Directives** (yeni - builder fonksiyonu)
13. **Character Consistency** (yeni - birleştirilmiş)
14. **Style Directives** (yeni - birleştirilmiş)
15. **Clothing Directives** (yeni - builder fonksiyonu)
16. Scene Diversity (mevcut)
17. No Text (mevcut)

**Fayda:**
- Daha net organizasyon
- Her bölüm bağımsız test edilebilir

**Risk:** Orta (yapı değişiyor, ama içerik aynı)

---

## Story API Refactor ile Karşılaştırma

| Özellik | Story API | Image API |
|---------|-----------|-----------|
| Ana fonksiyon boyutu | 700+ satır template literal | 150 satır promptParts array |
| Helper fonksiyonlar | Az (sadece getAgeGroup, getThemeConfig, vb.) | Çok (getDepthOfFieldDirectives, getCameraAngleDirectives, vb.) |
| Inline direktifler | Çok (clothing, reminders, vb.) | Orta (cover, first interior, clothing, multiple characters) |
| Tekrar eden direktifler | Çok (clothing 7 yerde) | Orta (character consistency 3 yerde, style 3 yerde) |
| Modülerleştirme ihtiyacı | Yüksek | Orta-Düşük |

**Sonuç:** Image API zaten Story API'den daha modüler. Ama yine de bazı iyileştirmeler yapılabilir.

---

## Öncelik Değerlendirmesi

### Yüksek Öncelik (Şimdi yapılabilir)
- ✅ **Faz 1: Inline Direktifleri Modülerleştir** - Düşük risk, hızlı kazanım
  - Cover directives → `buildCoverDirectives()`
  - First interior page directives → `buildFirstInteriorPageDirectives()`
  - Clothing directives → `buildClothingDirectives()`
  - Multiple characters directives → `buildMultipleCharactersDirectives()`
  - Cover reference consistency → `buildCoverReferenceConsistencyDirectives()`

### Orta Öncelik (Sonra yapılabilir)
- ⏳ **Faz 2: Tekrar Eden Direktifleri Birleştir** - Düşük risk, tutarlılık kazanımı
  - Character consistency → `buildCharacterConsistencyDirectives()`
  - Style directives → `buildStyleDirectives()`

### Düşük Öncelik (İleride - Opsiyonel)
- ⏸️ **Faz 3: Prompt Bölümlerini Daha İyi Organize Et** - Orta risk, organizasyon iyileştirmesi

---

## Risk Analizi

### Faz 1: Inline Direktifleri Modülerleştir
- **Risk:** Düşük
- **Neden:** Sadece refactor, logic aynı, prompt içeriği aynı
- **Test:** Image generation test et (cover, page 1, normal page)

### Faz 2: Tekrar Eden Direktifleri Birleştir
- **Risk:** Düşük
- **Neden:** Sadece birleştirme, logic aynı
- **Test:** Image generation test et, prompt çıktısını karşılaştır

### Faz 3: Prompt Bölümlerini Daha İyi Organize Et
- **Risk:** Orta
- **Neden:** Yapı değişiyor, ama içerik aynı olmalı
- **Test:** Image generation test et, prompt çıktısını karşılaştır, görsel kalitesi kontrol et

---

## Uygulama Stratejisi

### Önerilen Yaklaşım: Kademeli Refactor

1. **Faz 1'i uygula** (Inline direktifleri modülerleştir)
   - Düşük risk, hızlı kazanım
   - `generateFullPagePrompt` daha okunabilir olur
   - Test: Image generation (cover, page 1, normal page)

2. **Faz 2'yi değerlendir** (Tekrar eden direktifleri birleştir)
   - Düşük risk, tutarlılık kazanımı
   - Test: Image generation, prompt çıktısı karşılaştırma

3. **Faz 3'ü atla veya sonraya bırak** (Prompt bölümlerini organize et)
   - Orta risk, mevcut yapı zaten iyi çalışıyor
   - Gerekirse daha sonra yapılabilir

---

## Sonuç ve Öneri

### Mevcut Durum
- ✅ Image API zaten Story API'den daha modüler
- ✅ Birçok helper fonksiyon mevcut
- ⚠️ Bazı inline direktifler var (cover, first interior, clothing, multiple characters)
- ⚠️ Bazı tekrar eden direktifler var (character consistency, style)

### Refactor İhtiyacı
- **Kritiklik:** Orta-Düşük (Story API'ye göre daha az kritik)
- **Öncelik:** Faz 1 yapılabilir, Faz 2 opsiyonel, Faz 3 gerekli değil

### Öneri
1. **Faz 1'i uygula** - Inline direktifleri modülerleştir (düşük risk, hızlı kazanım)
2. **Faz 2'yi değerlendir** - Tekrar eden direktifleri birleştir (düşük risk, tutarlılık)
3. **Faz 3'ü atla** - Mevcut yapı yeterince iyi, gerekli değil

**Not:** Story API refactor'ı tamamlandıktan sonra, benzer yaklaşımı Image API'ye de uygulayabiliriz. Ama Image API zaten daha modüler olduğu için, refactor daha az kritik.

---

**Son Güncelleme:** 24 Ocak 2026 (Story API Refactor tamamlandıktan sonra analiz)

---

## ✅ Uygulama Detayları

### Tamamlanma Tarihi: 24 Ocak 2026
### Versiyon: v1.7.0

### Faz 1: Inline Direktifleri Modülerleştir ✅
- ✅ `buildCoverDirectives(additionalCharactersCount: number): string[]` - Oluşturuldu ve kullanıldı
- ✅ `buildFirstInteriorPageDirectives(additionalCharactersCount: number): string[]` - Oluşturuldu ve kullanıldı
- ✅ `buildClothingDirectives(clothing, theme, isCover, useCoverReference): string` - Oluşturuldu ve kullanıldı
- ✅ `buildMultipleCharactersDirectives(additionalCharactersCount: number): string[]` - Oluşturuldu ve kullanıldı
- ✅ `buildCoverReferenceConsistencyDirectives(additionalCharactersCount: number): string` - Oluşturuldu ve kullanıldı
- ✅ `generateFullPagePrompt` içindeki inline kodlar bu fonksiyonlarla değiştirildi

### Faz 2: Tekrar Eden Direktifleri Birleştir ✅
- ✅ `buildCharacterConsistencyDirectives(): string[]` - Oluşturuldu ve kullanıldı
  - `generateScenePrompt` içinde kullanıldı (2 direktif)
  - `generateFullPagePrompt` içinde kullanıldı (1 direktif)
- ✅ `buildStyleDirectives(illustrationStyle: string): string[]` - Oluşturuldu ve kullanıldı
  - `generateScenePrompt` içinde kullanıldı (1 direktif)
  - `generateFullPagePrompt` içinde kullanıldı (2 direktif)

### Faz 3: Prompt Bölümlerini Organize Et ✅
- ✅ 12 Section Builder Fonksiyonu oluşturuldu:
  1. `buildAnatomicalAndSafetySection(ageGroup: string): string[]`
  2. `buildCompositionAndDepthSection(pageNumber, focusPoint): string[]`
  3. `buildLightingAndAtmosphereSection(timeOfDay, mood): string[]`
  4. `buildCameraAndPerspectiveSection(pageNumber, focusPoint, previousScenes): string[]`
  5. `buildCharacterEnvironmentRatioSection(): string[]`
  6. `buildStyleSection(illustrationStyle: string): string[]`
  7. `buildSceneContentSection(scenePrompt, layeredComp, ageRules): string[]`
  8. `buildSpecialPageDirectives(pageNumber, isCover, useCoverReference, additionalCharactersCount, sceneInput): string[]`
  9. `buildCharacterConsistencySection(illustrationStyle: string): string[]`
  10. `buildSceneDiversitySection(isCover, previousScenes): string[]`
  11. `buildClothingSection(clothing, theme, isCover, useCoverReference): string[]`
  12. `buildFinalDirectives(): string[]`
- ✅ `generateFullPagePrompt` refactor edildi - builder fonksiyonlarıyla yeniden yapılandırıldı
- ✅ Prompt sırası korundu (mevcut prompt çıktısı aynı kaldı)

### Versiyon Güncelleme ✅
- ✅ `VERSION.version`: `1.6.0` → `1.7.0`
- ✅ `VERSION.releaseDate`: `new Date('2026-01-24')`
- ✅ `VERSION.changelog`: 4 yeni entry eklendi (v1.7.0 genel, Faz 1, Faz 2, Faz 3)

### Dokümantasyon Güncellemeleri ✅
- ✅ `docs/prompts/IMAGE_PROMPT_TEMPLATE.md`: Image refactor dokümante edildi
- ✅ `docs/guides/IMAGE_API_REFACTOR_ANALYSIS.md`: Durum "Uygulandı" olarak güncellendi, uygulama detayları eklendi

### Sonuç
- ✅ Tüm 3 faz başarıyla uygulandı
- ✅ Prompt çıktısı aynı kaldı (sadece organizasyon değişti)
- ✅ Kod daha modüler, okunabilir ve bakımı kolay hale geldi
- ✅ Her bölüm bağımsız test edilebilir
