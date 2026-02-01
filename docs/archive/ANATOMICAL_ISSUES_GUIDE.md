# 🖐️ Anatomik Sorunlar ve Parmak Hataları - GPT Çözüm Kılavuzu

**KidStoryBook Platform - Anatomik Sorun Çözüm Dokümantasyonu**

**Version:** 1.0.1  
**Release Date:** 16 Ocak 2026  
**Last Update:** 16 Ocak 2026 (Hand-Holding Ban)  
**Status:** 🔴 Active Issue  
**Author:** @prompt-manager  
**Related:** `docs/prompts/IMAGE_PROMPT_TEMPLATE.md`, `lib/prompts/image/negative.ts`

---

## 📋 Genel Bakış

Bu doküman, **GPT-image-1.5** modeli ile görüntü oluştururken yaşanan anatomik sorunları (özellikle parmak ve el hataları) çözmek için hazırlanmıştır. Mevcut prompt sistemi ve implementasyon detaylarını içerir.

### Sorun Tanımı

- ❌ **Parmak Hataları:** Ekstra parmak, eksik parmak, deforme parmaklar
- ❌ **El Anatomisi:** Yanlış parmak pozisyonları, imkansız açılar
- ❌ **El Ele Tutuşma:** Karakterler el ele tutuşurken parmak hataları, el deformasyonları (NEW: 16 Ocak 2026 - YASAK)
- ❌ **Genel Anatomik Sorunlar:** Ekstra uzuvlar, yanlış oranlar, simetri sorunları

### Mevcut Durum

**Model:** `gpt-image-1.5`  
**API Endpoint:** `/v1/images/edits` (reference images ile) ve `/v1/images/generations`  
**Size:** `1024x1536` (portrait)  
**Quality:** `low`  
**Input Fidelity:** `high` (anatomik detayları korumak için)

---

## 📁 İlgili Dosyalar

### 1. Prompt Template Dosyaları

- **`docs/prompts/IMAGE_PROMPT_TEMPLATE_v1.0.0.md`** - Ana görüntü prompt template'i
  - Anatomik doğruluk direktifleri (satır 386-408, 483-500)
  - Version history ve best practices

- **`lib/prompts/image/v1.0.0/scene.ts`** - Scene prompt generation
  - `generateFullPagePrompt()` fonksiyonu (satır 577-747)
  - `getAnatomicalCorrectnessDirectives()` çağrısı (satır 602)
  - Anatomi-first approach (prompt sıralaması)

- **`lib/prompts/image/v1.0.0/negative.ts`** - Negative prompts ve anatomik direktifler
  - `getAnatomicalCorrectnessDirectives()` (satır 352-374)
  - `ANATOMICAL_NEGATIVE` (satır 279-284)
  - Version: v1.0.3 (16 Ocak 2026 - minimalize edilmiş negative prompts)

### 2. API Implementation

- **`app/api/books/route.ts`** - Görüntü oluşturma API endpoint
  - GPT-image API çağrıları (satır 1100-1400)
  - FormData hazırlama (satır 1197-1217)
  - `input_fidelity: 'high'` kullanımı (satır 1202)

---

## 🔍 Mevcut Implementasyon Detayları

### 1. Anatomik Doğruluk Direktifleri (Pozitif Prompt)

**Dosya:** `lib/prompts/image/v1.0.0/negative.ts` (satır 352-374)

```typescript
export function getAnatomicalCorrectnessDirectives(): string {
  return [
    'CRITICAL ANATOMICAL RULES (STRICTLY ENFORCE):',
    '',
    '### HANDS AND FINGERS:',
    'each hand shows exactly 5 separate fingers: thumb, index finger, middle finger, ring finger, pinky finger',
    'fingers are clearly separated with visible gaps between each finger',
    'thumb is correctly positioned on the side of the hand, opposable to other fingers',
    'all finger joints (knuckles) are clearly visible: 3 joints per finger, 2 joints per thumb',
    'each fingertip shows a fingernail',
    'fingers bend naturally at the knuckle joints, gently curved, not stiff or straight',
    'palms are visible with natural skin texture and palm lines',
    'wrists connect naturally to arms at correct angle',
    'hands are in natural, relaxed poses - no impossible angles or twisted positions',
    'CRITICAL: Characters must NOT hold hands - hands must be separate and independent',
    'CRITICAL: NO hand-holding, NO holding hands together, NO hands clasped together',
    'CRITICAL: Each character\'s hands must be clearly visible and separate from other characters\' hands',
    'CRITICAL: Hands should be in individual poses - one hand can be raised, one can be at side, but NOT holding another character\'s hand',
    '',
    '### BODY ANATOMY:',
    'exactly 2 hands, 2 arms, 2 legs, 2 feet - no more, no less',
    'all body parts proportioned correctly for age',
    'face features symmetrical: 2 eyes, 1 nose, 1 mouth, 2 ears',
    'clean skin without marks, blemishes, or spots on face',
    'body orientation consistent - upper and lower body face same direction',
  ].join('\n')
}
```

**Kullanım Yeri:** `lib/prompts/image/v1.0.0/scene.ts` (satır 601-604)

```typescript
// 1. EN BAŞA: ANATOMICAL CORRECTNESS (CRITICAL)
const anatomicalDirectives = getAnatomicalCorrectnessDirectives()
promptParts.push(anatomicalDirectives)
promptParts.push('') // Empty line for separation
```

**Not:** Anatomi direktifleri **prompt'un en başına** ekleniyor (research-backed: anatomy-first approach = %30 iyileştirme).

### 2. Anatomik Negative Prompts (Minimalize Edilmiş)

**Dosya:** `lib/prompts/image/v1.0.0/negative.ts` (satır 279-284)

```typescript
/**
 * Minimalized anatomical negative prompts
 * UPDATED: 16 Ocak 2026 - Spesifik hata terimlerini kaldırıldı, sadece genel terimler
 * REASON: Spesifik terimler (e.g., "6 fingers") token attention problemi yaratıyor
 * - Model'i priming yapıyor (bahsettiğimiz hatayı yaratıyor)
 * - Pozitif direktiflerle çakışıyor
 * STRATEGY: Genel, pozitifle çakışmayan terimler kullan
 */
export const ANATOMICAL_NEGATIVE = [
  // Sadece genel, açıkça kötü durumlar (pozitifle çakışmayan)
  'deformed', 'malformed', 'mutated',
  'bad anatomy', 'anatomically incorrect',
  'extra limbs', 'missing limbs', // Genel, spesifik sayılar yok
  // NEW: El ele tutuşma yasağı (16 Ocak 2026)
  'holding hands', 'hand in hand', 'hands clasped together', 'hands together',
  'interlocked hands', 'hands joined', 'hand-holding',
]
```

**Strateji:** Spesifik terimler (örn: "6 fingers") token attention problemi yaratıyor ve model'i priming yapıyor. Bu yüzden sadece genel, pozitif direktiflerle çakışmayan terimler kullanılıyor.

### 3. API Ayarları

**Dosya:** `app/api/books/route.ts` (satır 1197-1202)

```typescript
const formData = new FormData()
formData.append('model', imageModel) // 'gpt-image-1.5'
formData.append('prompt', fullPrompt) // Anatomik direktifleri içerir
formData.append('size', imageSize) // '1024x1536'
formData.append('quality', imageQuality) // 'low'
formData.append('input_fidelity', 'high') // Anatomik detayları koru
```

**Önemli:** `input_fidelity: 'high'` ayarı anatomik detayları korumak için kullanılıyor.

---

## 🎯 GPT'ye Sorulacak Prompt

Aşağıdaki prompt'u GPT-4 veya GPT-4o ile kullanarak anatomik sorunlar için optimize edilmiş çözümler alabilirsiniz:

```
Sen bir AI görüntü oluşturma uzmanısın ve özellikle çocuk kitabı illüstrasyonları için anatomik doğruluk konusunda uzmanlaşmışsın.

## Sorun

gpt-image-1.5 modeli ile çocuk karakterleri için görüntü oluştururken şu anatomik sorunlar yaşanıyor:

1. **Parmak Hataları:**
   - Ekstra parmak (6, 7 parmak)
   - Eksik parmak (3, 4 parmak)
   - Deforme veya yanlış şekilli parmaklar
   - Parmakların birbirine yapışması
   - Parmakların doğal olmayan pozisyonları

2. **El Anatomisi:**
   - Başparmağın yanlış pozisyonu
   - Eklemlerin (knuckles) görünmemesi veya yanlış görünmesi
   - Avuç içi detaylarının eksikliği
   - El-bilek bağlantısının doğal olmaması

3. **Genel Anatomik Sorunlar:**
   - Ekstra uzuvlar (3 kol, 3 bacak)
   - Eksik uzuvlar
   - Yanlış vücut oranları
   - Yüz simetrisi sorunları

## Mevcut Çözüm

Mevcut prompt sistemi şu şekilde:

### Pozitif Direktifler (Prompt'un En Başına Ekleniyor):
```
CRITICAL ANATOMICAL RULES (STRICTLY ENFORCE):

### HANDS AND FINGERS:
each hand shows exactly 5 separate fingers: thumb, index finger, middle finger, ring finger, pinky finger
fingers are clearly separated with visible gaps between each finger
thumb is correctly positioned on the side of the hand, opposable to other fingers
all finger joints (knuckles) are clearly visible: 3 joints per finger, 2 joints per thumb
each fingertip shows a fingernail
fingers bend naturally at the knuckle joints, gently curved, not stiff or straight
palms are visible with natural skin texture and palm lines
wrists connect naturally to arms at correct angle
hands are in natural, relaxed poses - no impossible angles or twisted positions

### BODY ANATOMY:
exactly 2 hands, 2 arms, 2 legs, 2 feet - no more, no less
all body parts proportioned correctly for age
face features symmetrical: 2 eyes, 1 nose, 1 mouth, 2 ears
clean skin without marks, blemishes, or spots on face
body orientation consistent - upper and lower body face same direction
```

### Negative Prompts (Minimalize Edilmiş):
```
deformed, malformed, mutated, bad anatomy, anatomically incorrect, extra limbs, missing limbs
```

**Not:** Spesifik hata terimleri (örn: "6 fingers", "extra fingers") kullanılmıyor çünkü token attention problemi yaratıyor ve model'i priming yapıyor.

### API Ayarları:
- Model: gpt-image-1.5
- Size: 1024x1536 (portrait)
- Quality: low
- Input Fidelity: high (anatomik detayları korumak için)
- Reference Images: Multiple reference images (character photos + cover image)

## İstenen Yardım

Lütfen şu konularda öneriler sun:

1. **Prompt Optimizasyonu:**
   - Mevcut anatomik direktifleri nasıl iyileştirebiliriz?
   - Yeni direktifler eklemeli miyiz?
   - Prompt sıralaması doğru mu? (anatomy-first approach)
   - Direktiflerin formülasyonu en etkili şekilde mi?

2. **Negative Prompt Stratejisi:**
   - Minimalize edilmiş negative prompts doğru yaklaşım mı?
   - Spesifik hata terimlerini kullanmalı mıyız yoksa kullanmamalı mıyız?
   - Farklı bir negative prompt stratejisi önerir misiniz?

3. **Teknik Çözümler:**
   - API parametrelerinde değişiklik yapmalı mıyız?
   - input_fidelity: 'high' yeterli mi?
   - Quality ayarını 'low' yerine 'high' yapmalı mıyız? (daha uzun süre + daha yüksek maliyet)
   - Reference image kullanımını nasıl optimize edebiliriz?

4. **Alternatif Yaklaşımlar:**
   - Post-processing çözümleri (örneğin AI ile parmak düzeltme)?
   - İki aşamalı generation (önce karakter, sonra parmaklar detaylı)?
   - Farklı prompt stratejileri (hands-visible poses, hands-in-pocket poses)?

5. **Best Practices:**
   - Çocuk kitabı illüstrasyonları için özel anatomik kuralar var mı?
   - Yaşa göre anatomik varyasyonlar (3 yaş çocuk vs 8 yaş çocuk)?
   - Farklı illustration stilleri için (3D Animation, Watercolor, etc.) farklı direktifler gerekli mi?

6. **Sorun Teşhisi:**
   - Bu sorunlar genel bir gpt-image-1.5 problemi mi yoksa prompt optimizasyonu ile çözülebilir mi?
   - Başka AI görüntü modellerinde benzer sorunlar var mı ve nasıl çözülmüş?

## Ek Bilgiler

- **Kullanım Senaryosu:** Çocukların kendi fotoğraflarıyla kişiselleştirilmiş çocuk kitabı illüstrasyonları
- **Karakter Yaşları:** 3-12 yaş arası çocuklar
- **Illustration Stilleri:** 3D Animation, Watercolor, Comic Book, Kawaii, Geometric, Block World, Clay Animation, Collage, Sticker Art
- **Öncelik:** Parmak/el anatomisi sorunları en kritik (görüntü kalitesini ciddi şekilde etkiliyor)

Lütfen detaylı, uygulanabilir ve araştırmaya dayalı öneriler sun. Teşekkürler!
```

---

## 📊 Mevcut Prompt Yapısı (Tam Detay)

### Full Page Prompt Generation Flow

1. **Anatomical Directives** (EN BAŞTA)
   - `getAnatomicalCorrectnessDirectives()` çağrısı
   - Structured format, newline separation
   - Explicit instructions

2. **Illustration Style** (UPPERCASE emphasis)
   - Style description + "illustration, cinematic quality"

3. **Layered Composition**
   - FOREGROUND/MIDGROUND/BACKGROUND system

4. **Character Prompts**
   - Character description with consistency emphasis

5. **Scene Elements**
   - Environment, lighting, mood, atmosphere

6. **Quality Directives**
   - Professional, print-ready, age-appropriate

### Prompt Token Usage

**Önemli Not:** GPT-image-1.5 ilk token'lara daha fazla önem veriyor. Bu yüzden anatomik direktifler prompt'un en başına ekleniyor.

**Token Attention Problemi:** Spesifik hata terimleri (örn: "6 fingers", "extra fingers") model'i priming yapıyor ve bahsedilen hatayı yaratabiliyor. Bu yüzden negative prompts minimalize edilmiş.

---

## 🔬 Test Senaryoları

### Senaryo 1: Basit El Poses (Öncelikli)

**Amaç:** Ellerin görünür olduğu ama karmaşık olmayan pozlar

**Test Görüntüleri:**
- Karakter el sallıyor
- Karakter bir nesneyi tutuyor (top, kitap, vb.)
- Karakter ellerini cebinde

**Beklenen Sonuç:**
- Her el 5 parmak
- Parmaklar net ayrılmış
- Doğal pozlar

### Senaryo 2: Karmaşık El Poses

**Amaç:** Ellerin karmaşık pozisyonlarda olduğu görüntüler

**Test Görüntüleri:**
- Karakter iki eliyle bir nesneyi tutuyor
- Karakter ellerini göğsünde birleştirmiş
- Karakter tırmanıyor (eller görünür)

**Beklenen Sonuç:**
- Yine de 5 parmak (her el)
- Doğal pozlar

### Senaryo 3: Eller Görünmez (Öneri)

**Amaç:** Eller görünmediğinde anatomik sorunlar olmamalı

**Test Görüntüleri:**
- Karakter ellerini arkada birleştirmiş (görünmez)
- Karakter ellerini cebinde
- Karakter kollarını kavuşturmuş

**Beklenen Sonuç:**
- Anatomik sorun yok
- Diğer anatomik özellikler doğru (kol, bacak, vb.)

---

## 📈 İyileştirme Önerileri (GPT'den Alınan Öneriler İçin Alan)

Bu bölüm GPT'den alınan öneriler ile doldurulacak:

### 1. Prompt Optimizasyonu Önerileri
- [ ] ...

### 2. Negative Prompt Stratejisi Önerileri
- [ ] ...

### 3. Teknik Çözüm Önerileri
- [ ] ...

### 4. Alternatif Yaklaşım Önerileri
- [ ] ...

### 5. Best Practice Önerileri
- [ ] ...

### 6. Sorun Teşhisi Sonuçları
- [ ] ...

---

## 🔄 Versiyon Geçmişi

### v1.0.0 (16 Ocak 2026)
- ✅ İlk doküman oluşturuldu
- ✅ Mevcut implementasyon detayları eklendi
- ✅ GPT'ye sorulacak prompt hazırlandı
- ✅ Test senaryoları tanımlandı

---

## 📚 Referanslar

- **AI Research:** Hand/finger anatomy in AI image generation (2026 best practices)
- **Token Attention:** GPT-image-1.5 ilk token'lara daha fazla önem veriyor
- **Priming Effect:** Spesifik hata terimleri model'i priming yapıyor

---

## 🔗 İlgili Dokümanlar

- `docs/prompts/IMAGE_PROMPT_TEMPLATE.md` - Ana görüntü prompt template
- `lib/prompts/image/v1.0.0/negative.ts` - Negative prompts implementasyonu
- `lib/prompts/image/v1.0.0/scene.ts` - Scene prompt generation

---

**Son Güncelleme:** 16 Ocak 2026  
**Yöneten:** @prompt-manager agent  
**Durum:** 🔴 Active Issue - GPT'den öneriler bekleniyor
