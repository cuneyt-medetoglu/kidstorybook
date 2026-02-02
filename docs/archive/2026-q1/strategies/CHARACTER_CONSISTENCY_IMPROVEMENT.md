# Character Consistency Improvement Strategy
esi
**Tarih:** 10 Ocak 2026
**Status:** ✅ Implemented (GPT-image API)

---

## 🎯 Hedef

Kullanıcının yüklediği **tek bir fotoğraftan** tüm hikaye sayfaları ve kapak için **tutarlı karakter görselleri** oluşturmak.

---

## ✅ Mevcut Çözüm: GPT-image API

### Yaklaşım

**GPT-image API** (gpt-image-1.5, gpt-image-1, gpt-image-1-mini) kullanarak **multimodal image generation**:

1. **Referans fotoğraf** → GPT-image API (direkt input)
2. **Text prompt** → Character description + scene description
3. **Multimodal generation** → Reference image + Text → Generated image

### Avantajlar

1. ✅ Referans fotoğraf **direkt modele** gönderiliyor
2. ✅ Multimodal input (image + text) → **daha iyi character consistency**
3. ✅ 3 model seçeneği (quality vs speed vs cost)
4. ✅ OpenAI'nin en yeni görsel AI teknolojisi

### Model Seçenekleri

| Model | Quality | Speed | Cost | Use Case |
|-------|---------|-------|------|----------|
| **gpt-image-1.5** | Best | Slow | High | Final cover, premium books |
| **gpt-image-1** | Good | Medium | Medium | Standard books, pages |
| **gpt-image-1-mini** | OK | Fast | Low | Preview, draft, testing |

---

## 📊 Implementation Details

### API Endpoint

```typescript
// POST https://api.openai.com/v1/images/edits
// Content-Type: multipart/form-data

const formData = new FormData()
formData.append('model', 'gpt-image-1') // or gpt-image-1.5, gpt-image-1-mini
formData.append('prompt', 'Watercolor illustration of a 5-year-old girl with...')
formData.append('size', '1024x1024') // 1024x1024, 1024x1792, 1792x1024
formData.append('image', blob, 'reference.png') // Reference photo as Blob

// Base64 → Blob conversion (from data URL):
const base64Data = referenceImageUrl.split(',')[1]
const mimeType = referenceImageUrl.split(';')[0].split(':')[1]
const binaryStr = atob(base64Data)
const bytes = new Uint8Array(binaryStr.length)
for (let i = 0; i < binaryStr.length; i++) {
  bytes[i] = binaryStr.charCodeAt(i)
}
const blob = new Blob([bytes], { type: mimeType })
```

**Notlar:**
- Endpoint: `/v1/images/edits` (FormData ile multimodal input)
- Reference image: Base64 data URL → Blob conversion yapılıyor
- ⚠️ **Organization verification gerekli** (OpenAI organizasyon doğrulaması yapılmalı)

### Response Format

```json
{
  "data": [
    {
      "url": "https://oaidalleapiprodscus...", // Generated image URL
      "revised_prompt": "Watercolor illustration of..." // Revised prompt (if any)
    }
  ]
}
```

---

## 🔄 Master Character Concept (Unchanged)

**Fikir:** Kullanıcının yüklediği fotoğraftan **tek sefer** AI ile detaylı analiz yapıp, bu analizi **tüm sayfalar için** kullanmak.

### Workflow

1. **Photo Upload** → User uploads 1 photo
2. **AI Analysis** → OpenAI Vision API → Detailed character description
3. **Master Character** → Store in database (`characters.description`)
4. **Image Generation** → Use Master Character + Reference Photo + GPT-image API

### Database Schema

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(20),
  reference_photo_url TEXT, -- ✅ Reference photo (base64 or storage URL)
  description JSONB NOT NULL, -- ✅ Master Character Description
  -- {
  --   age, gender, skinTone, hairColor, hairStyle, eyeColor, faceShape,
  --   uniqueFeatures, height, build, clothingStyle, typicalExpression, etc.
  -- }
  ...
);
```

---

## 🚀 Next Steps

### Short Term (Completed)

- [x] GPT-image API entegrasyonu (REST API)
- [x] Model selection UI (gpt-image-1.5, gpt-image-1, gpt-image-1-mini)
- [x] Reference photo support (multimodal input)
- [x] Supabase Storage integration
- [x] Test & debug

### Medium Term

- [ ] **Character consistency test** - Benzerlik değerlendirmesi
- [ ] **Cost optimization** - Model selection strategy
- [ ] **Quality comparison** - gpt-image-1.5 vs 1 vs mini
- [ ] **A/B testing** - User feedback

### Long Term

- [ ] **Multi-attempt generation** - En iyi 3'ü seç
- [ ] **Feedback loop** - Kullanıcı "bu iyi/kötü" derse öğren
- [ ] **Custom fine-tuning** - Kendi modelimiz (çok pahalı, uzun vadeli)

---

## 📝 Notes

### GPT-image API Status

- ✅ **API Endpoint:** `/v1/images/edits` (REST API ile FormData kullanılıyor)
- ✅ **Multimodal Support:** Text + Image input (FormData ile)
- ✅ **Model Options:** gpt-image-1.5, gpt-image-1, gpt-image-1-mini
- ✅ **Size Options:** 1024x1024, 1024x1792, 1792x1024
- ✅ **Base64 Support:** Data URL'ler Blob'a convert ediliyor
- ⚠️ **Organization Verification:** OpenAI organizasyon doğrulaması gerekli
- ⏳ **SDK Support:** OpenAI SDK'da henüz yok (REST API kullanıyoruz)

### Technical Constraints

1. **Base64 Size Limit:** Max 20MB for data URLs (resize if needed)
2. **Image Format:** JPEG, PNG, GIF, WEBP supported
3. **Generation Time:** 10-30 seconds depending on model
4. **Rate Limits:** TBD (OpenAI account limits)

---

## 🎨 Prompt Strategy

### Cover Generation Prompt

```
Watercolor Dreams illustration of {age}-year-old {gender} named {characterName},
with {faceShape} face shape, {skinTone} skin, {eyeColor} {eyeShape} eyes,
{hairColor} {hairLength} {hairStyle} {hairTexture} hair, {uniqueFeatures},
{height} height, {build} build, with {typicalExpression} expression,
wearing {clothingStyle} in {clothingColors},
{coverScene}, consistent character design, same character as reference photo
```

### Page Generation Prompt

```
{illustrationStyle} illustration of {characterName} ({characterDescription}),
{pageImagePrompt}, consistent character design, same character as previous pages
```

---

## ✅ Success Criteria

1. ✅ **API Integration:** GPT-image API çalışıyor
2. ⏳ **Character Similarity:** Generated character looks like reference photo (>70% user satisfaction)
3. ⏳ **Consistency:** All pages show same character (>80% user satisfaction)
4. ⏳ **Quality:** High-quality illustrations (>80% user satisfaction)
5. ⏳ **Speed:** Cover generation < 30 seconds
6. ⏳ **Cost:** Reasonable pricing ($0.02-$0.19 per image depending on model)

---

**Last Updated:** 15 Ocak 2026
**Next Review:** After organization verification and character consistency test

## ⚠️ Current Status (15 Ocak 2026)

### Completed ✅
- GPT-image API entegrasyonu (`/v1/images/edits` endpoint)
- Model selection UI (gpt-image-1.5, gpt-image-1, gpt-image-1-mini)
- Size selection UI (1024x1024, 1024x1792, 1792x1024)
- Reference image support (FormData ile Blob olarak)
- Base64 → Blob conversion (data URL support)
- Supabase Storage integration
- Test & debug endpoints

### Pending ⏳
- **Organization Verification** - OpenAI organizasyon doğrulaması yapılacak (kullanıcı tarafından)
- Character consistency test - Benzerlik değerlendirmesi
- Create Book flow - Debug testlerinden sonra aktif edilecek

### Technical Notes
- Endpoint: `/v1/images/edits` (NOT `/v1/responses`)
- Format: `multipart/form-data` (NOT JSON)
- Reference image: Blob olarak gönderiliyor (NOT base64 string)
- Size parameter: Supported (1024x1024, 1024x1792, 1792x1024)
- Response format: NOT supported (removed from request)
