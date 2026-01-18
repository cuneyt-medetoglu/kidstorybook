# Anatomical Prompt Improvements Guide

**Tarih:** 18 Ocak 2026  
**Amaç:** GPT araştırmasına dayalı olarak parmak/el anatomik hatalarını azaltmak için prompt sistemini iyileştirme

---

## 🎯 Sorun

GPT-image-1.5 modeli ile oluşturulan görsellerde parmak ve el anatomisinde hatalar yaşanıyordu:
- Fazladan parmaklar (6 parmak)
- Bitişik parmaklar
- Anatomik orantısızlıklar
- El ele tutuşma gibi karmaşık pozlarda artan hata oranı

## 📚 GPT Araştırma Bulguları

1. **Pozitif Direktifler Daha Etkili**: En az 2 spesifik anatomi terimi kullanımı başarı oranını %31'den %74'e çıkarıyor
2. **Negatif Terimler Sorun Yaratıyor**: "6 fingers" gibi spesifik negatif terimler token attention problemi yaratıyor (priming)
3. **Yapılandırılmış Format Etkili**: JSON benzeri bölümlere ayrılmış istemler daha tutarlı sonuç veriyor
4. **Karmaşık Sahneler Risk Taşıyor**: Çoklu karakter etkileşimleri, el ele tutuşma, nesne tutma gibi durumlar hata oranını artırıyor

---

## ✅ Uygulanan İyileştirmeler

### 1. Yapılandırılmış Anatomik Direktif Formatı

**Dosya:** `lib/prompts/image/v1.0.0/negative.ts`

**Öncesi (Düz string):**
```typescript
'CRITICAL ANATOMICAL RULES (STRICTLY ENFORCE):, ### HANDS AND FINGERS:, each hand shows exactly 5 separate fingers...'
```

**Sonrası (Yapılandırılmış format):**
```typescript
'[ANATOMY_RULES]
HANDS: exactly 5 fingers per hand (thumb, index, middle, ring, pinky), clearly separated with visible gaps, natural relaxed pose
HANDS_POSITION: hands at sides or in simple poses, NOT holding objects or other hands, clearly visible
BODY: 2 arms, 2 legs, correct proportions for age
FACE: symmetrical features (2 eyes, 1 nose, 1 mouth), clean skin
[/ANATOMY_RULES]'
```

**Değişiklikler:**
- Aşırı detaylı parmak açıklamaları kaldırıldı (eklem sayısı, tırnak detayı)
- "CRITICAL" kelimesinin aşırı tekrarı azaltıldı
- Tag-based yapı eklendi ([ANATOMY_RULES])
- Daha basit, net direktifler

---

### 2. Güvenli El Pozisyonları Sistemi

**Dosya:** `lib/prompts/image/v1.0.0/negative.ts`

**Yeni Fonksiyon:**
```typescript
export function getSafeHandPoses(): string[] {
  return [
    'hands resting naturally at sides',
    'one hand raised in greeting wave',
    'hands behind back',
    'arms spread wide in joy',
    'hands on hips',
  ]
}
```

**Kullanım:** Scene prompt'larında güvenli alternatifler önermek için

---

### 3. Negatif Prompt Sadeleştirme

**Dosya:** `lib/prompts/image/v1.0.0/negative.ts`

**Öncesi:**
```typescript
'holding hands', 'hand in hand', 'hands clasped together', 'hands together',
'interlocked hands', 'hands joined', 'hand-holding', // 7 tekrar!
```

**Sonrası:**
```typescript
'holding hands', 'hands together', // 2 terim yeterli
```

**Neden:** Token bütçesi optimizasyonu ve tekrar azaltma

---

### 4. Riskli Sahne Tespiti

**Dosya:** `lib/prompts/image/v1.0.0/scene.ts`

**Yeni Fonksiyonlar:**

```typescript
// Riskli sahne elemanlarını tespit et
export function detectRiskySceneElements(
  sceneDescription: string,
  characterAction: string
): RiskySceneAnalysis

// Güvenli alternatif öner
export function getSafeSceneAlternative(characterAction: string): string
```

**Tespit Edilen Riskli Durumlar:**
- El ele tutuşma
- Nesne tutma (detaylı)
- Karmaşık el pozisyonları (pointing, thumbs up, vb.)
- Çoklu karakter el etkileşimleri

**Önerilen Alternatifler:**
- "holding hands" → "standing together, hands at sides"
- "holding book" → "near book, hands at sides"
- "pointing" → "looking toward, arm extended naturally"

---

### 5. Scene Prompt Güncellemesi

**Dosya:** `lib/prompts/image/v1.0.0/scene.ts`

**Değişiklik:** `generateFullPagePrompt()` fonksiyonuna safe poses eklendi

```typescript
// 1.1. SAFE HAND POSES (NEW: 18 Ocak 2026)
const safeHandPoses = getSafeHandPoses()
promptParts.push('[SAFE_POSES]')
promptParts.push('Preferred hand poses: ' + safeHandPoses.join(', '))
promptParts.push('[/SAFE_POSES]')
```

---

### 6. Character Prompt Sadeleştirmesi

**Dosya:** `lib/prompts/image/v1.0.0/character.ts`

**Öncesi:**
```typescript
parts.push('anatomically correct hands with 5 distinct fingers, natural skin texture')
```

**Sonrası:**
```typescript
parts.push('hands with 5 fingers each, in natural relaxed pose')
```

**Neden:** Basit, net direktifler daha etkili (araştırma bulgularına göre)

---

### 7. Hikaye Oluşturmada Görsel Güvenlik

**Dosya:** `lib/prompts/story/v1.0.0/base.ts`

**Yeni Bölüm:** "VISUAL SAFETY GUIDELINES"

```markdown
## AVOID RISKY HAND INTERACTIONS:
- DO NOT have characters holding hands
- DO NOT have characters holding detailed objects
- DO NOT have complex hand gestures
- DO NOT have hands overlapping between characters

## PREFER SAFE HAND POSES:
- DO keep hands at sides in natural relaxed poses
- DO use simple raised hand for waving
- DO use arms spread wide for joy/excitement
```

**Amaç:** Hikaye yazarken görsel açıdan güvenli sahneler oluşturmak

---

## 📊 Beklenen İyileştirmeler

- **Anatomik hata oranında %30-40 azalma** (araştırma bulgularına göre)
- **Daha tutarlı el/parmak oluşturma**
- **Riskli sahnelerin proaktif önlenmesi**
- **Token kullanımında optimizasyon** (tekrar azaltma)

---

## 🔍 Test Senaryoları

### Test 1: Basit Karakter Pozu
- **Öncesi:** "Character standing with hands"
- **Sonrası:** "[ANATOMY_RULES] ... [SAFE_POSES] ... Character standing, hands resting naturally at sides"
- **Beklenen:** 5 parmak, doğru anatomi

### Test 2: Çoklu Karakter
- **Öncesi:** "Two characters holding hands"
- **Sonrası:** Risk tespiti → "Two characters standing together, hands at their sides"
- **Beklenen:** Her karakterin eli ayrı, doğru anatomi

### Test 3: Karmaşık Poz
- **Öncesi:** "Character pointing at something"
- **Sonrası:** "Character looking toward something, arm extended naturally"
- **Beklenen:** Basit poz, daha az hata riski

---

## 📝 Versiyonlama

| Dosya | Önceki Versiyon | Yeni Versiyon | Tarih |
|-------|-----------------|---------------|-------|
| negative.ts | 1.0.4 | 1.0.5 | 18 Ocak 2026 |
| scene.ts | 1.0.1 | 1.0.2 | 18 Ocak 2026 |
| character.ts | 1.0.5 | 1.0.6 | 18 Ocak 2026 |
| base.ts (story) | 1.0.1 | 1.0.2 | 18 Ocak 2026 |

---

## 🚀 Kullanım

### API'lerde Otomatik Kullanım

Tüm değişiklikler mevcut API'lerde otomatik olarak kullanılacak:

1. **Kitap Oluşturma** (`/api/books`)
   - `generateStoryPrompt()` → Görsel güvenlik direktifleri
   - `generateFullPagePrompt()` → Yapılandırılmış format + safe poses

2. **Görsel Oluşturma** (`/api/ai/generate-images`)
   - `getAnatomicalCorrectnessDirectives()` → Yapılandırılmış format
   - `getSafeHandPoses()` → Güvenli alternatifler

3. **Görsel Düzenleme** (`/api/ai/edit-image`)
   - `getAnatomicalCorrectnessDirectives()` → Yapılandırılmış format

### Manuel Kullanım (İsteğe Bağlı)

```typescript
import { detectRiskySceneElements, getSafeSceneAlternative } from '@/lib/prompts/image/v1.0.0/scene'

// Riskli sahne kontrolü
const sceneAnalysis = detectRiskySceneElements(
  "forest scene",
  "characters holding hands"
)

if (sceneAnalysis.hasRisk) {
  console.log('Risk detected:', sceneAnalysis.riskyElements)
  console.log('Suggestions:', sceneAnalysis.suggestions)
  
  // Güvenli alternatif al
  const safeAction = getSafeSceneAlternative("characters holding hands")
  console.log('Safe alternative:', safeAction)
  // Output: "characters standing together, hands at sides"
}
```

---

## 🔗 İlgili Dosyalar

- `gpt-arastirma.txt` - GPT araştırma notları (kaynak)
- `docs/archive/ANATOMICAL_ISSUES_GUIDE.md` - Önceki anatomik sorunlar rehberi
- `lib/prompts/image/v1.0.0/negative.ts` - Anatomik direktifler
- `lib/prompts/image/v1.0.0/scene.ts` - Sahne prompt'ları
- `lib/prompts/image/v1.0.0/character.ts` - Karakter prompt'ları
- `lib/prompts/story/v1.0.0/base.ts` - Hikaye oluşturma

---

## 📚 Referanslar

- GPT-4 Vision araştırması (gpt-arastirma.txt)
- OpenAI DALL-E 3 teknik raporu
- Reddit community feedback
- Kullanıcı gözlemleri (16 Ocak 2026)

---

## 🎓 Öğrenilen Dersler

1. **Basit ≠ Zayıf**: Basit, net direktifler aşırı detaylı açıklamalardan daha etkili
2. **Pozitif > Negatif**: "5 parmak" demek, "6 parmak değil" demekten daha iyi
3. **Yapılandırılmış Format**: Tag-based format modelin dikkati çekmede daha etkili
4. **Proaktif Risk Yönetimi**: Riskli durumları baştan önlemek düzeltmekten daha kolay
5. **Token Bütçesi**: Her kelime değerli, tekrarlardan kaçın

---

## ✨ Sonuç

Bu iyileştirmeler, GPT araştırmasına dayalı olarak anatomik hata oranını azaltmak için bilimsel bir yaklaşım sunuyor. Yapılandırılmış format, sadeleştirilmiş direktifler ve proaktif risk yönetimi ile daha kaliteli görseller elde etmeyi hedefliyoruz.

**Not:** İyileştirmelerin etkinliğini gerçek kullanım verileriyle izleyip gerekirse iterasyon yapmak önemlidir.
