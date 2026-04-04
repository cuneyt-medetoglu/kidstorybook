# Master illustration (`image_master`) — request sözleşmesi (M1)

**Son güncelleme:** 3 Şubat 2026 — M3 gözlemlenebilirlik (DB + Step-Runner) eklendi.  
**Kod kaynağı (tek giriş):** `generateMasterCharacterIllustration` → `lib/book-generation/image-pipeline.ts`  
**HTTP:** `POST https://api.openai.com/v1/images/edits` (`imageEditWithLog`, `lib/ai/images.ts`)  
**Arşiv örnekleri + regresyon profili P1:** Bu dosyanın **§9** (repo kökünde ayrı klasör tutulmaz; örnek JSON’lar **Admin Step-Runner** `aiLog` / panoya kopyala ile üretilir).

Bu doküman yalnızca **karakter master** (çocuk / evcil) içindir; **entity master** (`image_entity`, generations) burada değildir.

---

## 1) İstek gövdesi (multipart FormData)

| Alan | Zorunlu | Değer (kaynak) |
|------|---------|----------------|
| `model` | Evet | `DEFAULT_IMAGE_MODEL` → `gpt-image-1.5` (`lib/ai/openai-models.ts`) |
| `prompt` | Evet | Aşağıdaki **Çocuk** veya **Evcil** dalına göre üretilen metin (tek string) |
| `size` | Evet | `DEFAULT_IMAGE_SIZE` → `1024x1536` |
| `quality` | Evet | `DEFAULT_IMAGE_QUALITY` → `low` |
| `input_fidelity` | Evet | Sabit string: `high` |
| `image[]` | Evet | Tek dosya: referans fotoğraf (`characterPhoto` URL veya S3’ten indirilen buffer); dosya adı `character.{png|jpg|webp}` |

**Step-Runner / log:** `formDataToDebugRecord` ile `image[]` dosya meta olarak (isim, mime, boyut) görünür; ham piksel loga basılmaz. Örnek şekil: Step-Runner **Master Illustrations** adımından dışa aktarılan sanitize `request` JSON’u (alan adları §1 ile aynı olmalı).

---

## 2) Prompt — ortak girdiler

| Veri | Nereden gelir | Ne için |
|------|----------------|---------|
| Stil metni | `getStyleDescription(illustrationStyle)` | `style-descriptions.ts` — anahtar kelime yerine tam stil DNA’sı |
| Referans görsel | `characterPhoto` (fetch veya S3) | Edits API girdisi; yüz/vücut veya evcil için ırk/renk eşlemesi |
| Cinsiyet | `characterGender` veya `characterDescription.gender` | Çocuk dalında `buildCharacterPrompt` içinde |

---

## 3) Dal A — Çocuk (Child) — `characterType.group !== 'Pets'`

**Kimlik metni:** `buildCharacterPrompt(fixedDescription, includeAge, true)` — üçüncü argüman `true` = **kıyafet hariç** (`excludeClothing`), böylece fotoğraftaki kıyafet master’a sabitlenmez.

**Kıyafet (hikâye):** `storyClothing` (story JSON `suggestedOutfits[characterId]` veya pipeline’ın geçirdiği string) doluysa prompt’a eklenir:  
`Character wearing exactly: {storyClothing}.`

**`masterPrompt` blok sırası (sabit şablon):**

1. `[ANATOMY] … [/ANATOMY]` — el/yüz anatomisi kısa kurallar  
2. `[STYLE] {styleDirective} [/STYLE]`  
3. `[EXPRESSION] … [/EXPRESSION]` — nötr / hafif gülümseme  
4. Cümle: tam boy, ayaklar görünsün, nötr poz + **`{characterPrompt}`** + **`{outfitPart}`** + düz arka plan + referansla yüz/vücut eşleşmesi

**Moderation retry:** İlk istek `moderation_blocked` / `safety_violations` ise **`softMasterPrompt`** ile ikinci edits çağrısı — daha kısa ANATOMY yok, ifade/yumuşak dil.

---

## 4) Dal B — Evcil (Pet) — `characterType.group === 'Pets'`

**İnsan `buildCharacterPrompt` kullanılmaz** (ten, cinsiyet etiketi vb. karışmasın).

**Kimlik metni:** `buildPetCharacterBrief(characterDescription, animalKind)` — `hairColor`→tüy, `eyeColor`, `hairLength`, `build` vb. türe uygun alanlar.

**`masterPrompt` özeti:** `[STYLE] … [/STYLE]` önde; “tamamen illüstrasyon stili, fotoğraf değil”; tüy/ırk için referans; dört pati görünsün; düz arka plan.

**Soft retry:** Yine `softMasterPrompt` — daha kısa “friendly {animalKind}” tonu.

---

## 5) Yanıt (response)

| Alan | Beklenti |
|------|-----------|
| `data[0].b64_json` | Base64 PNG; yoksa hata |
| `usage` | Maliyet hesabı için (`imageCostUsdFromUsage` → `lib/pricing/openai-usage-cost.ts`) |

**Sonrası:** Base64 → S3 `books/.../masters/master_{characterId}_{timestamp}.png` → public URL döner.

---

## 6) Loglama

- `operationType`: `image_master`  
- `ImageLogContext`: `model`, `quality`, `size`, `refImageCount: 1`, `characterId`, isteğe bağlı `bookId`, `stepRunnerTrace`

---

## 7) Gözlemlenebilirlik (M3)

**Kod:** `imageEditWithLog` (`lib/ai/images.ts`) başarılı yanıtta:

| Nereye | Ne yazılır |
|--------|------------|
| `ai_requests.cost_usd` | `imageCostUsdFromUsage(model, result.usage, { kind: 'edit' })` — token tabanlı tahmini USD |
| `ai_requests.response_meta` | JSON: `{ "usage": <OpenAI Images usage nesnesi veya null> }` |
| `ai_requests.request_meta` | `size`, `quality`, `refImageCount` (varsa) |

**Step-Runner:** `aiLog` içinde `image_master POST /v1/images/edits` satırının `response.body` alanında API’nin döndürdüğü tam JSON (içinde `usage`); `b64_json` sanitize ile kısaltılır, **usage sayıları korunur**. UI’da bu girişin altında “OpenAI usage” özeti gösterilir.

**Not:** API bazen `usage` döndürmeyebilir; o zaman `cost_usd` 0 olabilir — bu veri eksikliği, kod hatası değil.

**Veritabanı doğrulama (opsiyonel):** `operation_type = 'image_master'` ve `status = 'success'` satırlarında `cost_usd` / `response_meta->'usage'` kontrolü.

---

## 8) Onay kontrol listesi

**M1**

- [ ] Step-Runner’dan veya logdan alınan örnek `request` özeti §1 tablosu ile uyumlu.  
- [ ] Çocuk örneğinde prompt sırası §3 ile uyumlu; kıyafet yalnızca `storyClothing` / `outfitPart` ile geliyor.  
- [ ] Evcil örneğinde `buildPetCharacterBrief` + stil önde; ANATOMY bloğu yok.  
- [ ] `input_fidelity` = `high` (M4’te ürün kararına kadar sabit).

**M3**

- [ ] Bir master çalıştırdıktan sonra Step-Runner `aiLog`’da ilgili girişte **OpenAI usage** satırı görünüyor.  
- [ ] Aynı istek için `ai_requests` satırında `cost_usd` ve `response_meta.usage` tutarlı (ortamında DB erişimi varsa).

**İlgili:** [`IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md`](./IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md) §2 · [`STORY_GENERATION_DEV_ROADMAP.md`](./STORY_GENERATION_DEV_ROADMAP.md) Master fazları · Arşiv disiplini §9 (bu dosya).

---

## 9) Arşiv örnekleri — dosya adlandırma ve regresyon **P1**

**Amaç:** `POST /v1/images/edits` karakter master çağrılarının (sanitize) istek/yanıt kayıtlarını takım içinde saklamak veya PR eki olarak kullanmak. **Repo’da sabit klasör zorunlu değil**; kaynak: Admin **Step-Runner** → ilgili adım → `aiLog` / JSON panoya kopyala.

### Dosya adlandırma (öneri)

| Parça | Anlamı |
|-------|--------|
| `{n}_` | Sıra numarası (aynı oturumda üretim sırası) |
| `request` / `response` | İstek özeti mi, yanıt özeti mi |
| `image-master` | Genel / ilk HTTP şekil örneği (Step-Runner `formData` özeti) |
| `master-character-{isim}` | Belirli karaktere ait özet (çocuk veya evcil) |

**Not:** Tam HTTP `multipart` burada JSON özetidir; `image[]` dosyası meta olarak (`_type: file`, mime, boyut) tutulur, ham piksel yok.

### Regresyon profili **P1** (önerilen minimum set)

Kitap veya Step-Runner ile **aynı senaryoda** şunları doğrula:

| # | Ne | Beklenti |
|---|-----|----------|
| 1 | **Stil** | `illustrationStyle`: `3d_animation` (veya üründe sabitlenen bir stil) |
| 2 | **Çocuk master** | En az bir child master isteği; prompt’ta `[ANATOMY]`, `[STYLE]`, `[EXPRESSION]`, `Character wearing exactly:` (story kıyafeti) |
| 3 | **Evcil master** | En az bir pet isteği; prompt’ta `[STYLE]` önde, tür + `buildPetCharacterBrief` alanları, dört pati |

**Ne zaman yenile:** `generateMasterCharacterIllustration` veya stil metni değişince P1’i tekrar çalıştırıp örnekleri güncelle.
