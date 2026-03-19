# AI maliyet takibi (`cost_usd`) ve kullanım verisi

**Amaç:** Admin panelde kitap başına gösterilen tutarlar, **uydurma sabit “görsel başına $”** ile değil; mümkün olduğunca **API yanıtındaki kullanım ölçüleri** + **resmi birim fiyat tabloları** ile hesaplanır.

**Fatura değil:** Bu rakamlar OpenAI / Google Cloud **fatura PDF’i değildir**; tahminî tutarlar ve fiyat tablosu güncellenince güncellenmelidir.

---

## Veri akışı

| Kaynak | API’den gelen | `cost_usd` nasıl üretilir? |
|--------|----------------|-----------------------------|
| **Chat** (`lib/ai/chat.ts`): `chatWithLog` | `completion.usage` (prompt_tokens, completion_tokens, cached_tokens vb.) | `lib/pricing/openai-usage-cost.ts` → `chatCostUsdFromUsage` |
| **Görseller** (`lib/ai/images.ts`): `imageEditWithLog` / `imageGenerateWithLog` | JSON yanıtındaki `usage` (text/image token ayrımı) | `imageCostUsdFromUsage` (model: `gpt-image-1.5` vb.) |
| **TTS** (`lib/tts/generate.ts`): `generateTts` | USD yok; metin + üretilen MP3 buffer | `lib/pricing/google-gemini-tts-cost.ts` → `geminiTtsCostUsdEstimate` (Google [Gemini-TTS fiyatlandırması](https://cloud.google.com/text-to-speech/pricing); ses süresi buffer’dan kabaca tahmin) |

**DB:** `ai_requests` satırı; `cost_usd` yanına ek olarak `response_meta` içinde OpenAI `usage` (veya TTS’te kısa açıklama) saklanabilir.

---

## Fiyat sabitleri nerede?

- **`lib/pricing/openai-usage-cost.ts`** — OpenAI [API Pricing](https://openai.com/api/pricing) ile uyumlu token başına oranlar (metin modelleri + gpt-image ailesi).
- **`lib/pricing/google-gemini-tts-cost.ts`** — Gemini-TTS input/output token oranları + süre tahmini.

Fiyat değişince **yalnızca bu dosyalar** güncellenir.

---

## Yerel worker: `npm run worker` vs `npm run worker:dev`

| Komut | Ne yapar? |
|-------|-----------|
| `npm run worker` | `tsx worker.ts` — tek süreç, doğrudan `console.log` çıktısı (genelde en okunaklı log). |
| `npm run worker:dev` | `tsx watch worker.ts` — dosya değişince **yeniden başlatır**; izleme süreci + alt süreç. Windows/Git Bash/Cursor’da bazen çıktı **tam aktarılmaz**, buffer/alt süreç yüzünden “log görünmüyor” hissi oluşabilir. |

**Öneri:** Log takibi için `npm run worker`; kod değişikliğinde sürekli yenileme için `npm run worker:dev`. İkisi de aynı `worker.ts`/`env.worker` yolunu kullanır.

---

## İlgili kod

- `worker.ts`, `env.worker.ts` — `.env` + `.env.local` (Next ile uyumlu Redis/DB).
- `lib/queue/workers/book-generation.worker.ts` — BullMQ işleyici.
- `lib/utils/cost-usd.ts` — `parseCostUsd`: PostgreSQL `NUMERIC` → JS sayısı (admin listesi; maliyet hesabı değil).

---

## İlgili doküman

- `docs/implementation/FAZ_AI_LOGGING_IMPLEMENTATION.md` — `ai_requests` ve wrapper mimarisi.
