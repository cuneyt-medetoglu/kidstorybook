# Prompt Optimization Guide

**Tarih:** 18 Ocak 2026  
**Versiyon:** v1.1.0  
**Amaç:** Token attention dilution ve kalite kaybını önlemek için prompt sistemini optimize etme

---

## Problem

**Mevcut Prompt:** 10,003 karakter (~1,500 kelime)  
**Optimal Prompt:** 100-400 karakter (15-60 kelime)  
**Sorun:** 25-30x daha uzun idealden

### Token Attention Sorunları

1. **Token Attention Dilution:** Uzun prompt'larda önemli bilgiler kaybolur
2. **Early Token Bias:** İlk token'lar daha etkili, sondakiler görmezden gelinir
3. **Negative Prompt Overuse:** Fazla negative prompt kaliteyi düşürür
4. **Tekrarlar:** Aynı bilgiler farklı yerlerde tekrar ediyor

### Araştırma Bulguları

- OpenAI dokümantasyonu: Prompt limiti 32,000 karakter (GPT-image-1.5)
- Best practice: 15-60 kelime optimal (100-400 karakter)
- Uzun prompt'lar: Token attention dilution, kalite kaybı, çelişki riski
- Referans görsel testi: Sadece yüz gözüken referans ile de parmak hataları oldu → Sorun prompt yapısında

---

## Uygulanan Optimizasyonlar

### 1. Anatomical Directives (500 → 120 karakter, %76 azalma)

**Öncesi:**
```
[ANATOMY_RULES]
HANDS: exactly 5 fingers per hand (thumb, index, middle, ring, pinky), clearly separated with visible gaps, natural relaxed pose
HANDS_POSITION: hands at sides or in simple poses, NOT holding objects or other hands, clearly visible
BODY: 2 arms, 2 legs, correct proportions for age
FACE: symmetrical features (2 eyes, 1 nose, 1 mouth), clean skin
[/ANATOMY_RULES]
```

**Sonrası:**
```
[ANATOMY] 5 fingers each hand separated, arms at sides, 2 arms 2 legs, symmetrical face (2 eyes 1 nose 1 mouth) [/ANATOMY]
```

**Dosya:** [`lib/prompts/image/v1.0.0/negative.ts`](lib/prompts/image/v1.0.0/negative.ts)

---

### 2. Safe Hand Poses (150 → 40 karakter, %73 azalma)

**Öncesi:**
```
[SAFE_POSES]
Preferred hand poses: hands resting naturally at sides, one hand raised in greeting wave, hands behind back, arms spread wide in joy, hands on hips
[/SAFE_POSES]
```

**Sonrası:**
```typescript
getSafeHandPoses() returns: ['hands at sides', 'simple wave', 'behind back']
```

**Dosya:** [`lib/prompts/image/v1.0.0/negative.ts`](lib/prompts/image/v1.0.0/negative.ts)

---

### 3. Style Directives (1,500 → 200 karakter, %87 azalma)

**Öncesi (örnek - 3D Animation):**
```
STYLE-SPECIFIC DIRECTIVES FOR 3D ANIMATION (PIXAR STYLE): Pixar-style 3D animation (like Toy Story, Finding Nemo, Inside Out), cartoonish and stylized (NOT photorealistic), rounded shapes, exaggerated features, vibrant saturated colors, soft shadows, realistic textures, children's animated movie aesthetic, Pixar animation quality and visual style
```

**Sonrası:**
```
Pixar-style 3D, rounded shapes, vibrant colors, soft shadows
```

**Dosya:** [`lib/prompts/image/v1.0.0/scene.ts`](lib/prompts/image/v1.0.0/scene.ts:560-584)

---

### 4. Character Prompt (800 → 300 karakter, %63 azalma)

**Öncesi:** Çok detaylı - face shape, eye shape, hair texture, build, height, expression, clothing details

**Sonrası:**
```typescript
// Format: "[age]yo [gender], [hair], [eyes], [skin], [unique features], [clothing]"
// Example: "5yo girl, short blonde hair, blue eyes, fair skin, dimples, casual outdoor"
```

**Dosya:** [`lib/prompts/image/v1.0.0/character.ts`](lib/prompts/image/v1.0.0/character.ts:176-203)

---

### 5. Multiple Characters (1,500 → 500 karakter, %67 azalma)

**Değişiklikler:**
- "CRITICAL", "IMPORTANT" kelimelerini %80 azaltıldı
- Adult/child ayrımı tek satıra indirildi
- Reference image matching instruction basitleştirildi
- Her karakter için sadece temel özellikler

**Dosya:** [`lib/prompts/image/v1.0.0/character.ts`](lib/prompts/image/v1.0.0/character.ts:208-256)

---

### 6. Scene Elements (3,000 → 800 karakter, %73 azalma)

**Kısaltılan:**
- **Environment templates:** 3 seviye (general/detailed/cinematic) → sadece cinematic, detaylar azaltıldı
- **Cinematic elements:** 50 satır → 5 satır
- **Composition rules:** 28 satır → 7 satır
- **Lighting descriptions:** 19 satır → 5 satır
- **Weather descriptions:** Verbose → Minimal
- **Mood descriptions:** Verbose → Minimal
- **Age-appropriate rules:** 5 madde/yaş → 3 madde/yaş
- **Theme clothing:** Uzun açıklamalar → 1-2 kelime

**Dosya:** [`lib/prompts/image/v1.0.0/scene.ts`](lib/prompts/image/v1.0.0/scene.ts)

---

### 7. Cover Directives (1,200 → 300 karakter, %75 azalma)

**Öncesi:** 27 satır, çok tekrarlı

**Sonrası:**
```
COVER: Reference for all pages. Match reference photos exactly (hair/eyes/skin/features). All [N] characters prominent. Professional, print-ready. Adults have adult proportions.
```

**Dosya:** [`lib/prompts/image/v1.0.0/scene.ts`](lib/prompts/image/v1.0.0/scene.ts)

---

### 8. Scene Diversity (800 → 200 karakter, %75 azalma)

**Öncesi:** 40 satır, her element için ayrı direktif

**Sonrası:**
```
DIVERSITY: Change location (was: X), perspective (was: Y), composition (was: Z)
```

**Dosya:** [`lib/prompts/image/v1.0.0/scene.ts`](lib/prompts/image/v1.0.0/scene.ts)

---

### 9. Negative Prompts (9 madde → 3 madde, %67 azalma)

**Öncesi:**
```typescript
['deformed', 'malformed', 'bad anatomy', 'extra limbs', 'missing limbs', 'holding hands', 'hands together']
```

**Sonrası:**
```typescript
['deformed', 'extra limbs', 'holding hands']
```

**Dosya:** [`lib/prompts/image/v1.0.0/negative.ts`](lib/prompts/image/v1.0.0/negative.ts)

---

## Optimizasyon Özeti

| Bölüm | Öncesi | Sonrası | Azaltma |
|-------|--------|---------|---------|
| Anatomical | 500 | 120 | %76 |
| Safe Poses | 150 | 40 | %73 |
| Style Directives | 1,500 | 200 | %87 |
| Character | 800 | 300 | %63 |
| Multiple Chars | 1,500 | 500 | %67 |
| Scene Elements | 3,000 | 800 | %73 |
| Cover | 1,200 | 300 | %75 |
| Diversity | 800 | 200 | %75 |
| Negative | 290 | 100 | %66 |
| **TOPLAM** | **~10,000** | **~3,000** | **~70%** |

---

## Beklenen Faydalar

### 1. Token Attention İyileştirmesi
- Önemli bilgiler (anatomical, style) başta kalıyor
- Token dilution azalıyor
- Model daha iyi odaklanıyor

### 2. Kalite İyileştirmesi
- Çelişki riski azalıyor
- Daha tutarlı çıktılar
- Negative prompt overuse'den kaynaklanan kalite kaybı önleniyor

### 3. Maliyet Optimizasyonu
- Daha az token = daha düşük maliyet
- Daha hızlı yanıt süreleri

### 4. Bakım Kolaylığı
- Daha okunabilir kod
- Daha az tekrar
- Daha kolay güncelleme

---

## Versiyonlama

| Dosya | Önceki | Yeni | Tarih |
|-------|--------|------|-------|
| negative.ts | v1.0.5 | v1.1.0 | 18 Ocak 2026 |
| scene.ts | v1.0.2 | v1.1.0 | 18 Ocak 2026 |
| character.ts | v1.0.6 | v1.1.0 | 18 Ocak 2026 |

---

## Test Senaryoları

### Test 1: Prompt Length Impact
- **10,000 karakter (eski):** Token dilution, kalite kaybı
- **3,000 karakter (yeni):** Optimal token kullanımı, iyileşmiş kalite

### Test 2: Character Consistency
- Karakter tutarlılığını karşılaştır
- Cover reference etkisini ölç

### Test 3: Anatomical Accuracy
- El/parmak hata oranını karşılaştır
- Anatomik doğruluk skorunu ölç

---

## Kullanım

Tüm optimizasyonlar otomatik olarak devreye girer:

```typescript
// Tüm API'lerde otomatik kullanım
import { generateFullPagePrompt } from '@/lib/prompts/image/v1.0.0/scene'
import { getAnatomicalCorrectnessDirectives } from '@/lib/prompts/image/v1.0.0/negative'
import { buildCharacterPrompt } from '@/lib/prompts/image/v1.0.0/character'

// Version kontrolü
import { VERSION as negativeVersion } from '@/lib/prompts/image/v1.0.0/negative'
console.log('Negative prompts version:', negativeVersion.version) // v1.1.0
```

---

## Sıra 13 Sonrası – GPT Trace Takip Aksiyonları (8 Şubat 2026)

**Kaynak:** Trace `kidstorybook-trace-2026-02-08T13-48-30.json` incelemesi + kod karşılaştırması. Detay ve güncel tablo: `docs/analysis/PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md` §14.

| Sıra | Aksiyon | Not |
|------|---------|-----|
| 14 | Sayfa prompt’unda Türkçe metin (FOREGROUND) | characterAction için İngilizce (sceneContext/sceneDescription); page.text fallback kaldırılmalı veya en son. |
| 15 | Çelişkili stil ifadeleri | Tek stil profili; "vibrant saturated" / "controlled saturation" ve "soft" / "high contrast dramatic" aynı prompt’ta olmamalı. |
| 16 | Story JSON validation + kelime sayısı | REQUIRED alanlar (characterIds, suggestedOutfits, characterExpressions) validation/retry; sayfa metni word-count kontrolü. |
| 17 | A12 (model) | input_fidelity: high zaten kullanılıyor. **gpt-image-1.5 kullanılmaya devam;** gpt-image-1’e geçilmez. |

| 18 | Allow relighting | Prompt'a "reference = identity only; do NOT copy lighting/background; allow relighting." ekle. Magical tarzı sahneye özel ışık için; düşük risk. |

**Madde 5 (Allow relighting):** Plana eklendi (Sıra 19). Kodda interior sayfa prompt’una eklendi (scene.ts v1.20.0). Açıklama aşağıda “Relighting nedir?”.  
**Madde 7 (Prompt linter):** Planda yok (gerek yok). Açıklama aşağıda referans için duruyor.

### Relighting nedir? (Madde 5 – Magicalchildrensbook tarzına yardım eder mi?)

**“Allow relighting” ne işe yarar?** Referanstaki (master) ışığı ve havayı kopyalamayıp, **her sayfanın kendi sahnesine göre** ışık/atmosfer uygulanmasına izin vermek. Yani: Referans = sadece kimlik (yüz, saç, kıyafet). Işık ve renk tonu = sayfa prompt’undaki gibi (örn. golden hour, soft cinematic, gün batımı).

**Magicalchildrensbook benzeri görsellerle ilişkisi:** Örnek görsellerde (kamp, orman, göl batımı) gördüğün gibi: sıcak, **kontrollü doygunluk**, yumuşak ışık, filmic ton – her sahnenin kendi ışığı var (gündüz orman, kamp ateşi, göl batımı). Master görsel ise genelde **nötr stüdyo ışığı** ile üretiliyor. “Allow relighting” dersek model, master’daki bu nötr ışığı her sayfaya taşımak zorunda kalmaz; sayfa prompt’undaki “soft cinematic”, “golden hour”, “warm” gibi ifadeler sayfaya özel ışık ve magical tarzı tonu getirebilir. **Yani evet – doğru renk/ışık kelimeleriyle birlikte kullanıldığında magicalchildrensbook benzeri, sahneye özel sıcak/filmic görseller üretmeye yardımcı olur.**

**Tek başına yeterli mi?** Hayır. Renk/ton için ayrıca çelişkilerin temizlenmesi (Madde 15: “vibrant saturated” vs “controlled saturation”) ve istersen tek bir “FILMIC_WARM” stil profili gerekir. Relighting, bu tarzı **sayfa bazında** uygulayabilmemiz için gerekli talimatlardan biri.

**Plana eklendi (Sıra 18):** Prompt’a “Use reference for face/hair/outfit only; do NOT copy lighting/background; allow relighting.” (Sıra 18 – Sıra 13 sonrası yapılacaklar listesinde).

### shotPlan nedir? (A5 – sayfa görseli kompozisyonu)

**shotPlan ne demek?** Her sayfa görseli için **kamera ve sahne ayarlarının kısa tarifi**: çekim türü (geniş açı mı, yakın plan mı), objektif (24mm mi 35mm mi), kamera açısı (göz hizası, alttan, üstten), karakterin kadrajdaki yeri (sol üçte bir, sağ alt), günün saati (sabah, golden hour, gece), mood (merak, heyecan, sakin). Yani film/dizi çekerken yönetmenin "bu sahne şöyle çekilsin" dediği teknik kararların metin hali.

**Neden var?** Story LLM hikayeyi yazarken sahne de kuruyor. Bu sahnenin **görsel olarak nasıl kadrajlanacağı** (geniş açı, golden hour, sol üçte bir) yapılandırılmış alanlarla (shotType, lens, cameraAngle, placement, timeOfDay, mood) verilirse, sayfa image prompt'u daha tutarlı olur. shotPlan bu alanları sağlar; kod bunu "SHOT PLAN: …" satırında kullanır.

**Akış:** Story JSON'da her sayfa için isteğe bağlı `shotPlan` objesi. LLM doldurursa image pipeline bu değerleri kullanır; doldurmazsa kod mevcut mantıkla kendi değerlerini üretir (geriye dönük uyumlu).

**Özet:** shotPlan = sayfa görseli için "nasıl çekilsin?" bilgisi (kamera, ışık, yerleşim, mood). A5 ile story çıktısına eklendi; artık sayfa başına **zorunlu** (LLM her sayfada doldurur). Eski story verisinde shotPlan yoksa kod fallback kullanır (aşağıda).

**shotPlan yoksa fallback tam olarak ne?** LLM shotPlan döndürmezse veya alan boşsa, görsel prompt’taki **SHOT PLAN** satırı tamamen **koddan türetilir**:

| Alan | Fallback kaynağı |
|------|-------------------|
| **shotType** | Kapak ise "wide establishing"; sayfa ise focusPoint'e göre (environment → "wide establishing", yoksa "wide shot"). books/route’ta focusPoint şu an hep "balanced" → "wide shot". |
| **lens** | focusPoint === 'environment' ise "24-28mm", değilse "35mm". |
| **cameraAngle** | `getCameraAngleDirectives(pageNumber, previousScenes)` — sayfa numarasına göre dönen liste: "wide shot", "medium shot", "low-angle view (child's perspective)", "eye-level" vb. Sayfa 1’de bir değer, 2’de başka, böylece sayfalar arası çeşitlilik. |
| **placement** | `getShotPlanPlacementLabel(pageNumber, previousScenes)` — sayfa index’ine göre sırayla "left third", "right third", "lower third", "left with leading lines", "right balanced", "off-center" döner. |
| **timeOfDay** | sceneInput.timeOfDay varsa o, yoksa "day". books/route’ta timeOfDay set edilmiyor → hep "day". |
| **mood** | sceneInput.mood — books/route’ta temadan: adventure→exciting, fantasy→mysterious, space→inspiring, sports→exciting, diğer→happy. |

Yani fallback = **sabit kurallar**: sayfa numarası + tema + focusPoint ile tekrarlanabilir bir SHOT PLAN. LLM shotPlan verirse sahneye özel (örn. "golden hour", "left third") değerler kullanılır; vermezse bu varsayılanlar kullanılır. Eski kitaplar veya API’den shotPlan gelmeyen durumlar için bu fallback devreye girer.

### Prompt linter nedir? (Madde 7 – basit açıklama)

**En kısa hali:** Yazım denetimi gibi, ama **prompt metni** için. Aynı prompt’ta birbirine zıt talimatlar var mı diye bakar.

**Örnek:** Prompt’ta hem “çok canlı, doygun renkler” hem “kontrollü, pastel doygunluk” yazıyorsa model hangisine uyacağını şaşırır; sonuç “ortası” bir şey olur. Linter bu tür çiftleri (örn. “vibrant saturated” + “controlled saturation”, “soft” + “dramatic shadows”) tespit edip “bu ikisi aynı anda olmasın” diye uyarır veya raporlar.

**Pratikte ne yapılır?** İstersen küçük bir script: `generateFullPagePrompt` çıktısında bu kelime çiftlerini arar; çakışma varsa uyarı verir. İstersen sadece release öncesi manuel checklist: “Sayfa prompt’unda çelişen stil cümlesi var mı?” Şu an plana eklenmedi; ileride prompt’ları topluca gözden geçirirken “çelişen kelimeler var mı?” diye bakmak da yeterli olabilir.

---

## İlgili Dosyalar

- [`lib/prompts/image/v1.0.0/negative.ts`](lib/prompts/image/v1.0.0/negative.ts) - Anatomical + negative prompts
- [`lib/prompts/image/v1.0.0/scene.ts`](lib/prompts/image/v1.0.0/scene.ts) - Scene generation
- [`lib/prompts/image/v1.0.0/character.ts`](lib/prompts/image/v1.0.0/character.ts) - Character generation
- Plan: `prompt_refactor_&_optimization_610ce0c4.plan.md`

---

## Referanslar

- OpenAI API Documentation: https://platform.openai.com/docs/api-reference/images
- Best Practices Research: 15-60 kelime optimal prompt uzunluğu
- Token Attention Research: Early tokens daha etkili
- User Test: Referans görsel (sadece yüz) testi - sorun prompt yapısında

---

## Sonuç

Prompt sistemi %70 oranında optimize edildi. Token attention dilution azaltıldı, gereksiz tekrarlar kaldırıldı, verbose açıklamalar sadeleştirildi. Beklenen fayda: Daha tutarlı görseller, daha az anatomik hata, daha iyi token kullanımı.

**Not:** Gerçek kullanım verilerine göre iterasyon gerekebilir. Test sonuçları ile iyileştirme devam edecek.
