# Story API Refactor Önerileri

**Tarih:** 24 Ocak 2026  
**Dosya:** `lib/prompts/story/v1.0.0/base.ts` (959 satır)  
**Durum:** ✅ Uygulandı (v1.4.0 - 24 Ocak 2026)

---

## Mevcut Durum Analizi

### Güçlü Yönler
- ✅ Yardımcı fonksiyonlar iyi organize edilmiş (`getAgeGroup`, `getThemeConfig`, `getSafetyRules`, vb.)
- ✅ Type safety mevcut (`StoryGenerationInput`, `StoryGenerationOutput`)
- ✅ Versioning sistemi var
- ✅ Dokümantasyon (CHANGELOG, VERSION_STATUS)

### İyileştirme Gereken Alanlar

#### 1. **Prompt String Çok Uzun (700+ satır template literal)**
- **Sorun:** `generateStoryPrompt` içinde tek bir büyük template literal (satır 180-880)
- **Etki:** Okunabilirlik düşük, bakım zor, test etmek zor
- **Öneri:** Prompt'u modüler bölümlere ayır:
  ```typescript
  function buildCharacterSection(...) { ... }
  function buildStoryRequirementsSection(...) { ... }
  function buildClothingSection(...) { ... }
  function buildOutputFormatSection(...) { ... }
  // Ana fonksiyon:
  const prompt = [
    buildCharacterSection(...),
    buildStoryRequirementsSection(...),
    buildClothingSection(...),
    buildOutputFormatSection(...),
  ].join('\n\n')
  ```

#### 2. **Clothing Direktifleri Dağınık**
- **Sorun:** Clothing direktifleri 3-4 farklı yerde tekrar ediyor:
  - `getThemeConfig` (satır 757)
  - `CRITICAL - CHARACTER CLOTHING` (satır 285)
  - JSON şeması (satır 484)
  - CRITICAL REMINDERS (satır 527)
- **Etki:** Tutarsızlık riski, güncelleme zor
- **Öneri:** Clothing direktiflerini tek bir fonksiyona topla:
  ```typescript
  function getClothingDirectives(theme: string, themeConfig: any): {
    criticalSection: string
    jsonSchemaExample: string
    reminders: string
    fewShotExamples: string
  }
  ```

#### 3. **Theme-Specific Logic Dağınık**
- **Sorun:** Tema bazlı mantık `getThemeConfig` ve prompt içinde dağınık
- **Etki:** Yeni tema eklemek zor
- **Öneri:** Tema bazlı direktifleri `getThemeConfig`'e entegre et:
  ```typescript
  function getThemeConfig(theme: string) {
    return {
      ...baseConfig,
      clothingExamples: {
        correct: ['child-sized astronaut suit with helmet', ...],
        wrong: ['casual clothes', 'mavi ve kırmızı rahat giysiler']
      },
      clothingDirectives: '...',
    }
  }
  ```

#### 4. **Few-Shot Examples Hardcoded**
- **Sorun:** Few-shot examples prompt içinde hardcoded (satır 287-292)
- **Etki:** Tema değiştiğinde manuel güncelleme gerekiyor
- **Öneri:** Few-shot examples'ı dinamik hale getir:
  ```typescript
  function getClothingFewShotExamples(theme: string): string {
    const examples = {
      space: {
        correct: ['child-sized astronaut suit with helmet', 'space exploration outfit'],
        wrong: ['casual clothes', 'mavi ve kırmızı rahat giysiler']
      },
      // ...
    }
    return formatFewShotExamples(examples[theme])
  }
  ```

#### 5. **Test Edilebilirlik Düşük**
- **Sorun:** Tek bir büyük prompt string'i test etmek zor
- **Etki:** Değişikliklerin etkisini ölçmek zor
- **Öneri:** Prompt bölümlerini ayrı test edilebilir fonksiyonlara ayır

---

## Önerilen Refactor Planı

### Faz 1: Clothing Direktiflerini Modülerleştir (Düşük Risk)
1. `getClothingDirectives(theme, themeConfig)` fonksiyonu oluştur
2. Tüm clothing direktiflerini bu fonksiyona taşı
3. Prompt'ta bu fonksiyonu kullan

**Fayda:** Clothing direktiflerini tek yerden yönet, tutarlılık sağla  
**Risk:** Düşük (sadece refactor, logic değişmiyor)

### Faz 2: Prompt'u Bölümlere Ayır (Orta Risk)
1. Prompt bölümlerini ayrı fonksiyonlara ayır:
   - `buildCharacterSection()`
   - `buildStoryRequirementsSection()`
   - `buildClothingSection()`
   - `buildOutputFormatSection()`
   - `buildCriticalRemindersSection()`
2. Ana fonksiyon bu bölümleri birleştirsin

**Fayda:** Okunabilirlik, bakım kolaylığı, test edilebilirlik  
**Risk:** Orta (prompt yapısı değişiyor ama mantık aynı)

### Faz 3: Theme-Specific Logic'i Merkezileştir (Orta Risk)
1. `getThemeConfig`'e clothing examples ve direktifleri ekle
2. Tema bazlı mantığı tek yerde topla
3. Prompt'ta `getThemeConfig` çıktısını kullan

**Fayda:** Yeni tema eklemek kolay, tutarlılık  
**Risk:** Orta (yapı değişiyor)

---

## Öncelik Sırası

1. **Yüksek Öncelik (Şimdi):** Clothing direktiflerini güçlendir ✅ (Tamamlandı - v1.3.2)
2. **Orta Öncelik (Sonra):** Faz 1 - Clothing direktiflerini modülerleştir
3. **Düşük Öncelik (İleride):** Faz 2-3 - Prompt'u modülerleştir

---

## Notlar

- **Mevcut yapı çalışıyor** - refactor zorunlu değil
- **Refactor riski:** Orta (prompt yapısı değişiyor, test gerekli)
- **Önerilen yaklaşım:** Kademeli refactor (Faz 1 → Faz 2 → Faz 3)
- **Test stratejisi:** Her fazdan sonra story generation test et, çıktı kalitesini karşılaştır

---

**Son Güncelleme:** 24 Ocak 2026 (v1.4.0 - Story API Refactor tamamlandı)

---

## ✅ Uygulama Detayları (v1.4.0 - 24 Ocak 2026)

### Faz 1: Clothing Direktiflerini Modülerleştir ✅
- ✅ `getClothingDirectives()` fonksiyonu oluşturuldu - tüm clothing direktiflerini tek yerden yönetiyor
- ✅ `getClothingFewShotExamples()` helper fonksiyonu oluşturuldu - tema bazlı few-shot examples
- ✅ Prompt içinde 7 farklı yerdeki clothing direktifleri yeni fonksiyonlarla değiştirildi:
  - CRITICAL - CHARACTER CLOTHING bölümü
  - JSON şeması imagePrompt içinde
  - JSON şeması sceneDescription içinde
  - JSON şeması clothing field örneği
  - CRITICAL reminders
  - CHARACTER & STORY clothing kısmı

### Faz 2: Prompt'u Bölümlere Ayır ✅
- ✅ 11 builder fonksiyonu oluşturuldu:
  - `buildCharacterSection()`
  - `buildStoryRequirementsSection()`
  - `buildLanguageSection()`
  - `buildAgeAppropriateSection()`
  - `buildStoryStructureSection()`
  - `buildThemeSpecificSection()`
  - `buildVisualDiversitySection()`
  - `buildWritingStyleSection()`
  - `buildSafetySection()`
  - `buildIllustrationSection()`
  - `buildOutputFormatSection()`
  - `buildCriticalRemindersSection()`
- ✅ `generateStoryPrompt()` fonksiyonu güncellendi - 700+ satırlık template literal yerine modüler bölümler kullanılıyor
- ✅ Prompt içeriği aynı kaldı, sadece organizasyon değişti

### Faz 3: Theme-Specific Logic'i Merkezileştir ✅
- ✅ `getThemeConfig()` fonksiyonuna `clothingExamples` eklendi (7 tema: adventure, sports, fantasy, animals, daily-life, space, underwater)
- ✅ `getClothingFewShotExamples()` fonksiyonu güncellendi - artık `themeConfig.clothingExamples` kullanıyor (hardcoded değil)
- ✅ Yeni tema eklemek artık çok kolay - sadece `getThemeConfig`'e ekle

**Sonuç:**
- ✅ Kod daha modüler ve bakımı kolay
- ✅ Her bölüm bağımsız test edilebilir
- ✅ Clothing direktifleri tek yerden yönetiliyor
- ✅ Theme-specific logic merkezileştirildi
- ✅ Prompt içeriği korundu, sadece organizasyon iyileştirildi
