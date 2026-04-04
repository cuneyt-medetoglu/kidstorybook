# Story Generation Prompt — özet (kodla senkron)

**Tek kaynak (metin + şema):** `lib/prompts/story/base.ts`  
**Kod sürümü:** `VERSION.version` (export) — bu dosyada sabit numara tutulmaz; güncel değer için koda bakın.

**API / worker kullanımı:** `app/api/books/route.ts` (senkron create book), `app/api/ai/generate-story/route.ts`, `lib/book-generation/image-pipeline.ts` (async kitap — story worker), `app/api/admin/debug/step-runner/route.ts` (debug).

| Alan | Değer |
|------|--------|
| **messages[0]** | `buildStorySystemPrompt(language)` — sabit kurallar (dil, güvenlik, DO NOT DESCRIBE, sinematik imagePrompt, kapak film afişi, ifade rehberi) |
| **messages[1]** | `generateStoryPrompt(input)` — bu kitaba özel user içeriği |
| **response_format** | `json_schema` → `buildStoryResponseSchema()` (`strict: false` — dinamik UUID anahtarları) |
| **model** | Varsayılan `DEFAULT_STORY_MODEL` → `lib/ai/story-generation-config.ts` (ör. `gpt-4.1`); istekle override edilebilir |
| **temperature** | `0.8` |
| **max_completion_tokens** | `STORY_GENERATION_MAX_OUTPUT_TOKENS` (`story-generation-config.ts`) |

**Okuma bandı / kelime:** `lib/config/reading-age-brackets.ts` — `readingAgeBracket` + `getReadingAgeBracketConfig()`; prompt’ta `wordsPerPageMin` / `wordsPerPageMax` bu kaynaktan.

**Story sonrası doğrulama / repair:** `lib/ai/story-response-validator.ts` — normalize, `findRepairableFields`, isteğe bağlı repair; **Faz 1.2** sahne çeşitliliği uyarıları ve gerekirse `sceneMap` repair.

---

## User mesajı bölüm sırası (`generateStoryPrompt`)

Aşağıdaki sıra `base.ts` içindeki `sections` dizisi ile aynıdır. **LANGUAGE** ve **SAFETY** uzun metinleri user’da yok; `buildStorySystemPrompt` içindedir.

1. **`# CHARACTER` / `# CHARACTERS`** — `buildCharacterSection` + `buildCharacterDescription` (Step 1 saç/göz veya analiz; kıyafet story metninde üretilmez, `suggestedOutfits` + master)
2. **`# STORY REQUIREMENTS`** — tema, **reading age band** (`rac.id`), karakter yaşı, sayfa sayısı, kelime bandı (`wordsPerPageRangeString`), dil, illustration style
3. **`# STORY SEED`** — yalnızca `customRequests` doluysa
4. **`# SUPPORTING ENTITIES` + `# SUGGESTED OUTFITS`** — `buildSupportingEntitiesSection`: en fazla **2** entity; **pet/character** `supportingEntities` içine **konmaz**; İngilizce name/description
5. **`# AGE-APPROPRIATE GUIDELINES`** — `readingCfg` alanları
6. **`# STORY STRUCTURE`** + **`# ONE STORY, STEP BY STEP`** + **`# SCENE MAP`** — kapak ayrı; sayfa 1 vs kapak; venue tutarlılığı; `sceneMap` planı (İngilizce alanlar)
7. **`# THEME`** — kısa; sabit tema şablon listesi yok
8. **`# VISUAL DIVERSITY`** — ardışık poz/aksiyon tekrarı yok; ardışık dominant fiil (sit/stand/walk/look/watch) yok; checklist ritmi yasak; imagePrompt/sceneDescription uzunluk hedefleri
9. **`# WRITING STYLE`** — `wordsPerPageRangeString` + örnek cümle
10. **`# ILLUSTRATION`** — sinematik katmanlar (system’deki CINEMATIC IMAGE DIRECTION); aktif fiil+nesne; **STAGING (gaze)** — `sceneDescription` içinde bakış hedefi cümlesi
11. **`# OUTPUT FORMAT`** — özet kısıtlar; tam liste şemada
12. **`# VERIFICATION CHECKLIST`**
13. Kapanış: `Generate the story now in valid JSON format with EXACTLY N pages.`

**`defaultClothing`:** `StoryGenerationInput` ve bazı route’larda (`generate-story`) doldurulur; `generateStoryPrompt` içinde **şu an destructure edilir fakat prompt metnine yazılmaz** (kullanılmayan alan — kıyafet `suggestedOutfits` + master ile yönetilir). İleride karakter bloğuna bağlanırsa `base.ts` tek doğruluk kaynağıdır.

---

## Story STRUCTURE, sceneMap ve anlatı yayı

Kapak ayrımı, venue tutarlılığı, adım adım sayfa akışı ve `sceneMap` (location, timeOfDay, setting) kurallarının tam metni **`generateStoryPrompt` içindeki ilgili bölümlerde** ve `buildStorySystemPrompt` içindeki genel prensiplerde yer alır. Anlatının giriş → gelişme → kapanış yayını bu yapı üzerinden zorunlu kılınır.

---

## JSON şema — zorunlu üst alanlar (`buildStoryResponseSchema`)

`required`: `title`, `coverDescription`, `coverImagePrompt`, `sceneMap`, `pages`, `supportingEntities`, `suggestedOutfits`, `metadata`

**Not:** `coverSetting` şemada **zorunlu değil**; kapak ortamı zinciri `resolveCoverEnvironment` içinde `coverImagePrompt` → `coverDescription` → `coverSetting` → türetme (`image-pipeline.ts`).

**`pages[]` öğesi (şema):** `pageNumber`, `text`, `imagePrompt`, `sceneDescription`, `environmentDescription`, `cameraDistance`, `characterIds`, `characterExpressions`, `shotPlan` — **`sceneContext` alanı yok** (eski changelog’daki isim; güncel şemada kullanılmıyor).

---

## System mesajı (özet)

Tam metin: `buildStorySystemPrompt()` — başlıca bloklar: **LANGUAGE**, **STORY PRINCIPLES**, **CONTENT RULES (DO NOT DESCRIBE)**, **SAFETY**, **CINEMATIC IMAGE DIRECTION**, **CHARACTER EXPRESSIONS**, **COVER IMAGE (coverImagePrompt)**.

---

## İlgili dokümanlar

- `docs/analysis/STORY_GENERATION_DEV_ROADMAP.md` — story A/B/C ve tarihçe  
- `docs/analysis/IMAGE_QUALITY_IMPROVEMENT_PLAN.md` — görsel kalite fazları  
- `.cursor/rules` içindeki prompt yöneticisi kuralı (varsa)
