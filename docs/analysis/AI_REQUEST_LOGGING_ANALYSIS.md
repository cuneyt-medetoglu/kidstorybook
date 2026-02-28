# AI İstek/Yanıt Loglama Analizi

**Tarih:** 2026-02-28  
**Konu:** Kitap oluşturma sürecindeki AI isteklerinin DB'de detaylı saklanması

---

## 1. Mevcut Durum

| Alan | Mevcut Durum |
|------|-------------|
| Story maliyet hesabı | ✅ Hesaplanıyor ama DB'ye yazılmıyor |
| Image maliyet takibi | ❌ Yok |
| `generation_metadata` | ⚠️ Kitap bazında sadece model/token/süre |
| Karakter analizi takibi | ❌ Yok |
| TTS takibi | ❌ Yok |
| Hata loglama | ❌ Sadece console.log |

---

## 2. Loglanacak İstek Tipleri

### 2.1 Story Generation (Chat Completions)
- **Model:** `gpt-4o-mini`, `gpt-4o`, `o1-mini`
- **Fiyat:** Token bazlı (input/output ayrı)
- **Log edilecekler:** model, input_tokens, output_tokens, temperature, max_tokens, cost_usd, süre

### 2.2 Image Generation / Editing (Images API)
- **Model:** `gpt-image-1.5`
- **Fiyat:** Görsel başına sabit ($0.011 low / $0.04 medium / $0.07 high — 1024x1536)
- **Log edilecekler:** size, quality, referans görsel sayısı, cost_usd, süre
- **Alt tipler:** cover, page_image, master_illustration, entity_illustration, image_edit

### 2.3 Character Analysis (Vision API)
- **Model:** `gpt-4o-mini` (görsel + metin)
- **Fiyat:** Token bazlı (görsel token'ları dahil)
- **Log edilecekler:** input_tokens (görsel dahil), output_tokens, cost_usd, süre

### 2.4 TTS Generation (Google Gemini)
- **Provider:** Google
- **Fiyat:** Karakter bazlı
- **Log edilecekler:** model, karakter sayısı, dil, cost_usd, süre

---

## 3. Önerilen Tablo: `ai_requests`

```sql
CREATE TABLE ai_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL,
  book_id           UUID REFERENCES books(id) ON DELETE SET NULL,
  character_id      UUID REFERENCES characters(id) ON DELETE SET NULL,

  -- İstek tipi ve sağlayıcı
  operation_type    VARCHAR(50) NOT NULL,
  -- Değerler: story_generation | image_cover | image_page | image_master |
  --           image_entity | image_edit | character_analysis | tts

  provider          VARCHAR(20) NOT NULL DEFAULT 'openai',
  -- Değerler: openai | google

  model             VARCHAR(50) NOT NULL,
  prompt_version    VARCHAR(20),             -- lib/prompts'tan gelen version
  page_index        SMALLINT,               -- Sayfa görseli için sayfa numarası

  -- Durum
  status            VARCHAR(10) NOT NULL DEFAULT 'success',
  -- Değerler: success | error | partial
  error_message     TEXT,

  -- Maliyet ve kullanım
  input_tokens      INTEGER,
  output_tokens     INTEGER,
  image_count       SMALLINT DEFAULT 1,      -- Image işlemleri için
  char_count        INTEGER,                 -- TTS için karakter sayısı
  cost_usd          NUMERIC(10, 6),

  -- Süre
  duration_ms       INTEGER,

  -- Esnek metadata (fazladan bilgi için)
  request_meta      JSONB,
  -- Örnek: {"size":"1024x1536","quality":"low","ref_image_count":2,"temperature":0.8}

  response_meta     JSONB,
  -- Örnek: {"finish_reason":"stop","cached_tokens":0}

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- İndeksler
CREATE INDEX idx_ai_requests_book_id    ON ai_requests(book_id);
CREATE INDEX idx_ai_requests_user_id    ON ai_requests(user_id);
CREATE INDEX idx_ai_requests_created_at ON ai_requests(created_at DESC);
CREATE INDEX idx_ai_requests_op_type    ON ai_requests(operation_type);
```

---

## 4. Örnek Kayıtlar

### Story Generation
```json
{
  "operation_type": "story_generation",
  "model": "gpt-4o-mini",
  "prompt_version": "v2.5.0",
  "input_tokens": 1240,
  "output_tokens": 2100,
  "cost_usd": 0.001446,
  "duration_ms": 3800,
  "status": "success",
  "request_meta": { "temperature": 0.8, "max_tokens": 4000, "language": "tr" }
}
```

### Cover Image Generation
```json
{
  "operation_type": "image_cover",
  "model": "gpt-image-1.5",
  "prompt_version": "v1.17.0",
  "image_count": 1,
  "cost_usd": 0.011000,
  "duration_ms": 12500,
  "status": "success",
  "request_meta": { "size": "1024x1536", "quality": "low", "ref_image_count": 2 }
}
```

### Page Image (Hata durumu)
```json
{
  "operation_type": "image_page",
  "page_index": 3,
  "model": "gpt-image-1.5",
  "status": "error",
  "error_message": "content_policy_violation",
  "duration_ms": 8200,
  "request_meta": { "size": "1024x1536", "quality": "low" }
}
```

### TTS
```json
{
  "operation_type": "tts",
  "provider": "google",
  "model": "gemini-2.5-flash-preview-tts",
  "char_count": 450,
  "cost_usd": 0.000180,
  "duration_ms": 2100,
  "status": "success",
  "request_meta": { "language": "tr", "voice": "Kore" }
}
```

---

## 5. Maliyet Hesaplama Referansı

| Operasyon | Model | Birim | Fiyat (USD) |
|-----------|-------|-------|-------------|
| Story | gpt-4o-mini | 1M input token | $0.15 |
| Story | gpt-4o-mini | 1M output token | $0.60 |
| Story | gpt-4o | 1M input token | $2.50 |
| Story | gpt-4o | 1M output token | $10.00 |
| Image | gpt-image-1.5 low | görsel | $0.011 |
| Image | gpt-image-1.5 medium | görsel | $0.040 |
| Image | gpt-image-1.5 high | görsel | $0.070 |
| TTS | Gemini Flash | 1M karakter | $0.40 |

---

## 6. Entegrasyon Noktaları

```
app/api/books/route.ts           → image_cover, image_page, image_master, image_entity
app/api/ai/generate-story/       → story_generation  ← mevcut calcCost() buraya taşınır
app/api/ai/generate-images/      → image_page, image_master
app/api/ai/generate-cover/       → image_cover
app/api/ai/edit-image/           → image_edit
app/api/characters/analyze/      → character_analysis
lib/tts/generate.ts              → tts
```

**Önerilen yardımcı fonksiyon:** `lib/ai-logger.ts`
- `logAIRequest(data: AIRequestLog): Promise<void>`
- Her AI çağrısından sonra try/catch içinde çağrılır → loglama hatası kitabı durdurmamalı

---

## 7. Kullanım Alanları

- **Admin panel:** Kullanıcı bazlı/kitap bazlı maliyet raporu
- **Hata analizi:** Hangi operasyonda, hangi sayfada hata oluyor?
- **Optimizasyon:** Model değişikliğinin maliyete etkisi
- **Bütçe limiti:** Kullanıcı başına aylık harcama kontrolü
- **Prompt performansı:** Versiyon bazlı token/maliyet karşılaştırması

### Admin Dashboard (Sonraki Faz)

`ai_requests` tablosu ilerleyen dönemde yapılacak Admin Dashboard'un temel veri kaynağı olacak:

| Bölüm | Gösterilecek Bilgi |
|-------|-------------------|
| Genel Bakış | Günlük/aylık toplam harcama (USD), istek sayısı, başarı/hata oranı |
| Kullanıcı Bazlı | Her kullanıcının ne kadar maliyet oluşturduğu |
| Kitap Bazlı | Tek bir kitabın toplam maliyeti (story + tüm görseller + TTS) |
| Operasyon Dağılımı | Image vs Story vs TTS maliyet kırılımı (pie chart) |
| Hata Raporu | En sık hata veren operasyon/sayfa bilgisi |
| Prompt Performansı | Versiyon bazlı ortalama token/maliyet karşılaştırması |

> **Not:** Dashboard UI tasarımı ve API endpoint'leri ayrı bir iş olarak planlanacak. Şu an altyapı (tablo + logger) kurulmaktadır.

---

## 8. Uygulama Önceliği

| Adım | Kapsam | Eisenhower |
|------|--------|-----------|
| Migration + tablo oluşturma | `ai_requests` tablosu | 🔴 DO |
| `lib/ai-logger.ts` yardımcı | Log fonksiyonu | 🔴 DO |
| Story generation entegrasyonu | Mevcut calcCost() taşı + log | 🔴 DO |
| Image generation entegrasyonu | books/route.ts'teki tüm image çağrıları | 🟡 PLAN |
| Character analysis + TTS | Ayrı route'lar | 🟡 PLAN |
| Admin maliyet raporu UI | Dashboard | 🟡 PLAN |
