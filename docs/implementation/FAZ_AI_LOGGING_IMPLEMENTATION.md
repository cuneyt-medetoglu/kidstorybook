# AI Request Logging — Implementasyon Takibi

**Başlangıç:** 2026-02-28  
**Kaynak Analiz:** `docs/analysis/AI_REQUEST_LOGGING_ANALYSIS.md`

---

## Genel Mimari: Wrapper Pattern

Route'lara log kodu yazmak yerine OpenAI çağrılarını saran wrapper fonksiyonlar kullanılır.

```
Route → lib/ai/chat.ts    → openai.chat.completions.create() → ai_requests DB (otomatik)
Route → lib/ai/images.ts  → fetch /v1/images/*               → ai_requests DB (otomatik)
lib/tts/generate.ts       → Google TTS                        → ai_requests DB (otomatik)
```

**Avantaj:** Her route minimal değişir (sadece import + logContext parametresi).  
**Kural:** Loglama hatası hiçbir zaman ana işlemi durdurmamalı (`void` + `try/catch`).

---

## FAZ 1 — Altyapı (Şu An)

### Yapılacaklar
- [ ] `migrations/020_ai_requests.sql` — Tablo ve indeksler
- [ ] `lib/db/ai-requests.ts` — DB insert fonksiyonu (`insertAIRequest`)
- [ ] `lib/ai/chat.ts` — Chat completions wrapper (`chatWithLog`)
- [ ] `lib/ai/images.ts` — Image gen/edit wrapper (`imageGenerateWithLog`, `imageEditWithLog`)

### Entegrasyon (Faz 1 kapsamında)
- [ ] `app/api/ai/generate-story/route.ts` → `chatWithLog` kullan
- [ ] `app/api/characters/analyze/route.ts` → `chatWithLog` kullan

### Faz 1 Test Kontrol
- [ ] Migration çalıştır: `psql -f migrations/020_ai_requests.sql`
- [ ] Karakter oluştur → `ai_requests` tablosunda `character_analysis` kaydı var mı?
- [ ] Hikaye oluştur → `ai_requests` tablosunda `story_generation` kaydı var mı?
- [ ] Hata durumunda loglama kitabı durduruyor mu? (hayır olmalı)

---

## FAZ 2 — Tam Entegrasyon

### Yapılacaklar
- [ ] `app/api/ai/generate-cover/route.ts` → `imageGenerateWithLog` / `imageEditWithLog`
- [ ] `app/api/ai/generate-images/route.ts` → image wrapperları
- [ ] `app/api/ai/edit-image/route.ts` → `imageEditWithLog`
- [ ] `app/api/books/route.ts` → tüm image çağrılarını wrapper ile değiştir
- [ ] `lib/tts/generate.ts` → TTS loglama ekle

### Faz 2 Test Kontrol
- [ ] Tam kitap oluştur → `SELECT operation_type, cost_usd FROM ai_requests WHERE book_id = '<id>';`
- [ ] Sonuçlar: story_generation, image_master, image_entity, image_cover, image_page, tts kayıtları görünmeli
- [ ] Bir kitabın toplam maliyeti: `SELECT SUM(cost_usd) FROM ai_requests WHERE book_id = '<id>';`

---

## FAZ 3 — Admin Dashboard

### Yapılacaklar
- [ ] `app/api/admin/ai-costs/route.ts` — Maliyet raporu API endpoint'leri
  - GET `/api/admin/ai-costs/summary` — Günlük/aylık özet
  - GET `/api/admin/ai-costs/by-user` — Kullanıcı bazlı
  - GET `/api/admin/ai-costs/by-book?bookId=...` — Kitap bazlı
- [ ] `app/admin/ai-costs/page.tsx` — Admin Dashboard UI
  - Genel bakış kartları (toplam harcama, istek sayısı, hata oranı)
  - Operasyon dağılımı (story / image / tts pie chart)
  - Kullanıcı bazlı tablo
  - Hata raporu

---

## Dosya Listesi

| Dosya | Faz | Durum |
|-------|-----|-------|
| `migrations/020_ai_requests.sql` | 1 | ✅ Tamamlandı (2026-02-28) |
| `lib/db/ai-requests.ts` | 1 | ✅ Tamamlandı (2026-02-28) |
| `lib/ai/chat.ts` | 1 | ✅ Tamamlandı (2026-02-28) |
| `lib/ai/images.ts` | 1 | ✅ Tamamlandı (2026-02-28) |
| `app/api/ai/generate-story/route.ts` | 1 | ✅ Tamamlandı (2026-02-28) |
| `app/api/characters/analyze/route.ts` | 1 | ✅ Tamamlandı (2026-02-28) |
| `app/api/ai/generate-cover/route.ts` | 2 | ✅ Tamamlandı (2026-02-28) |
| `app/api/ai/generate-images/route.ts` | 2 | ✅ Tamamlandı (2026-02-28) |
| `app/api/ai/edit-image/route.ts` | 2 | ✅ Tamamlandı (2026-02-28) |
| `app/api/books/route.ts` | 2 | ✅ Tamamlandı (2026-02-28) — story + master + entity helper'ları |
| `lib/tts/generate.ts` | 2 | ✅ Tamamlandı (2026-02-28) |
| `app/api/admin/ai-costs/route.ts` | 3 | ⬜ Bekliyor |
| `app/admin/ai-costs/page.tsx` | 3 | ⬜ Bekliyor |

---

## Maliyet Hesaplama Sabitleri

```typescript
// Chat (token bazlı)
GPT_4O_MINI:  { input: 0.15,  output: 0.60  }  // USD / 1M token
GPT_4O:       { input: 2.50,  output: 10.00 }
O1_MINI:      { input: 1.10,  output: 4.40  }

// Image (görsel başına sabit)
GPT_IMAGE_1_5_LOW:    0.011   // USD / görsel (1024x1536)
GPT_IMAGE_1_5_MEDIUM: 0.040
GPT_IMAGE_1_5_HIGH:   0.070

// TTS (karakter bazlı)
GEMINI_FLASH_TTS: 0.40 / 1_000_000  // USD / karakter
```

## Operation Type Enum

```typescript
type OperationType =
  | 'story_generation'
  | 'image_cover'
  | 'image_page'
  | 'image_master'
  | 'image_entity'
  | 'image_edit'
  | 'character_analysis'
  | 'tts'
```
