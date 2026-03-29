# Story generation — geliştirme yol haritası

**Son güncelleme:** 29 Mart 2026 — A/B/C çekirdek tamam; **B genişletmesi:** `strict: false` kaynaklı sapmalar için **normalleştirme katmanı** (`cameraDistance`, `supportingEntities.type`, `metadata.ageGroup` / `safetyChecked` / `educationalThemes`, `shotPlan` boş alanlar, `characterIds` tek string, `appearsOnPages`) — `lib/ai/story-camera-distance.ts`, `lib/ai/story-response-normalize-fields.ts`, `prepareStoryResponseForUse` içinde `normalizeStoryShape`. **D1–D4** checklist tamamlandı; **master** tarafında evcil + tam `getStyleDescription` (`image-pipeline.ts`). **Debug:** `StepRunnerPanel` request/response JSON **tek tık kopyala**.  
**Tek odak (bu dosya):** `story_generation` metin/JSON + bu dosyadaki **D** özeti (görsel zincir girişleri).  
**Ayrıntılı görsel adımlar:** `IMAGE_PIPELINE_ROADMAP` yoksa buradaki D + sıradaki faz bölümü yeter; ileride `docs/analysis/IMAGE_PIPELINE_ROADMAP.md` açılabilir.

**Kod:** `lib/prompts/story/base.ts` (`generateStoryPrompt`) · API: `app/api/books/route.ts`, `app/api/ai/generate-story/route.ts`, debug: `app/api/admin/debug/step-runner/route.ts`  
**Prompt özeti (kodla senkron):** `docs/prompts/STORY_PROMPT_TEMPLATE.md` · **İş akışı:** `.cursor/rules/prompt-manager.mdc`

### Development’a başlarken sıra (öneri)

| Harf | Ne | Ne zaman |
|------|-----|----------|
| **A** | Request (prompt + API parametreleri) | Story girdi tarafı — **tamam** |
| **B** | Response (JSON şema, parse, pipeline uyumu) | Validator + repair — **tamam (çekirdek)** |
| **C** | Merkezi model config (`lib/ai/openai-models.ts`) | **Tamam** |
| **D** | Görsel pipeline (master → entity → kapak → sayfa pikseli) | **Çekirdek maddeler tamam** — sıradaki: **Entity master / kapak / sayfa** doğrulama ve kalite (aşağı “Sıradaki faz”) |

Harf sırası = önerilen ürün sırası: önce story (A/B), sonra modeller (C), sonra piksel adımları (D).

### Ne zaman test? (kısa)

| Durum | Ne yap |
|--------|--------|
| **Her A maddesi mümkünse** | Küçük kontrol: `request.json` mantıklı mı, bir story çalıştırıldı mı, bariz kırılma var mı? (zorunlu: her satır değil; riskli değişikliklerde evet) |
| **A paketi tamam (A1–A7 bitti)** | **Tam test:** örnek `request.json` + `response.json` kaydet; aşağıdaki “hızlı sorular” + gerekirse senin onayın → **sonra B’ye geç** |
| **B maddeleri** | Şema / parse değiştikçe her seferinde JSON geçerli mi, pipeline kırılmıyor mu? **B paketi bitince** tekrar uçtan uca story_generation dene |
| **C (model config)** | Deploy / env sonrası: varsayılan model beklediğin gibi gidiyor mu (log veya tek istek)? |

Pratik kural: **A bütünü bitmeden B’ye geçme** demek istemiyorsan — **A1–A7 tamam → tam test → B1** sırası yeterli. A ve B bazen iç içe olacak (ör. `json_schema` hem A hem B); o zaman “A ana hatları bitti” saydığın noktada tam test yap.

---

## Nasıl çalışacağız (ortak ilke)

- Kitap üretiminde **birçok adım** var; her adımı **ayrı ayrı** ele alıp bitirip doğrulayacağız.
- **Küçük, izlenebilir işler:** Mümkünse tek seferde tek tema değişsin; sonra `request.json` / `response.json` ile kontrol edelim.
- **Onay:** Sen “bu adım tamam” deyince sonraki maddeye geçeriz; gerekirse bu adıma sonra döneriz.
- Amaç: sorun çıkınca **hangi değişikliğin** etkisi olduğu kaybolmasın.

---

## Pipeline’da bu adım

```
story_generation (A/B, bu doküman) → görsel pipeline (D: master / entity / kapak / sayfa pikseli)
```

Story adımı çıktısı, sonraki adımlara **metin + JSON brief** verir.

### From-example (Examples → müşteri kitabı) — konu dışı kısa not

Örnek kitaptan klon oluştururken (`POST /api/books` + `fromExampleId`) hikâye **yeniden üretilmez**; `story_data` kopyalanır. **29.03.2026** itibarıyla: karakter adları **başlık + tüm ilgili string alanlar** (sayfa metni, `imagePrompt`, `sceneDescription`, kapak brief’leri, `sceneMap`, `supportingEntities` vb.) üzerinde eşlenir; **UUID eşlemesi** `pages[].characterIds`, `characterExpressions`, `suggestedOutfits` için yapılır. Yeni kitapta **`source_example_book_id`** kolonu dolar; **`generation_metadata.sourceExampleStoryMetadata`** örnek kitabın hikâye üretimi denetim özetiyle dolar (model, prompt sürümü, token/repair özeti). Kod: `app/api/books/route.ts` (from-example bloğu).

---

## A) Request — kısa analiz

- **System** çok kısa; **user** içinde sabit kurallar + kitap verisi birlikte → ayrılmalı (system = sabit kurallar, user = o kitaba özel veri).
- **`response_format`:** `json_object` → **`json_schema` + `strict: true`** (şema kodda/API’de tanımlanır).
- **`max_tokens`:** Üst sınır çıktıyı kesebilir; strateji: kaldırma veya yeterli üst sınır.
- **Prompt şişmesi:** Aynı kural birkaç kez; `json_schema` ile prompt’tan OUTPUT/CHECKLIST tekrarı azaltılabilir.
- **Parametreler:** `temperature` 0.8 şimdilik uygun sayıldı.
- **Kalite notu (bugünkü gözlem):** Sorun ana olarak `messages[].content` uzunluğu değil; daha çok **instruction noise**, checklist-benzeri hikaye akışı ve response tarafında eksik/gevşek doğrulamadan kaynaklanıyor.

### Chat Completions `messages` ve uzun `content`

- OpenAI **Chat Completions** API’sinde `messages[].content` alanı **tek string** olması **beklenen ve dokümantasyona uygun** davranıştır. Yapısal çıktı **`response_format`** (ör. `json_schema`) ile ayrı katmanda taşınır; şema ile aynı bilgiyi `content` içinde tekrar bölmek zorunlu değildir.
- Profesyonel pratik: Sistem mesajı = sabit kurallar; kullanıcı mesajı = bu kitaba özel veri (genelde uzun tek blok). İsterseniz ileride `input` / çok parçalı içerik modellerine geçiş ayrı değerlendirilir.

### Okuma yaşı bantları → kelime hedefleri (ürün + prompt tek kaynak)

- **Step 1:** UI’da **Yaş** etiketiyle **liste (select)** seçimi: `0-1`, `1-3`, `3-5`, `6+` — `wizard.step1.readingAgeBracket` (+ `representativeAge` için `step1.age`).
- **Step 3:** Yaş grubu **tekrar sorulmaz**; yalnızca tema + dil. Eski taslaklarda kalmış `step3.ageGroup` (0-2 / 3-5 / 6-9) varsa `lib/wizard/reading-age-from-wizard.ts` ile yeni bantlara eşlenir; özet ekranı (Step 6) metni **Step 1** bandından üretilir.
- **Tek config:** `lib/config/reading-age-brackets.ts` — bant başına `wordsPerPageMin` / `wordsPerPageMax`, kelime/cümle/karmaşıklık metinleri, `representativeAge`, `metadataAgeGroup`.
- **Akış:** `step1.readingAgeBracket` → `POST /api/characters` → `character.description.readingAgeBracket` → `generateStoryPrompt({ readingAgeBracket })`. Bant yoksa `character.age` → `inferReadingAgeBracketFromNumericAge`.
- **Debug:** `StepRunnerPanel` isteğe `readingAgeBracket` ekler (wizard `step1`); `step-runner` önce istek gövdesindekini, yoksa karakter açıklamasındakini kullanır.

---

## A) Request — yapılacaklar (checklist)

Sırayla ilerle; her madde sonrası mümkünse test + kısa değerlendirme.

| # | İş | Not |
|---|-----|-----|
| ~~A1~~ ✅ | System / user içerik ayrımını uygula | `buildStorySystemPrompt(language)` export; safety, language, DO NOT DESCRIBE, expressions, cover → system |
| ~~A2~~ ✅ | `json_schema` + `strict: false` ile çıktıyı kilitle | `buildStoryResponseSchema()` export; 4 caller güncellendi; dynamic UUID keys → strict: false |
| ~~A3~~ ✅ | `max_tokens` kaldırıldı | 4 caller temizlendi |
| ~~A4~~ ✅ | Prompt tekrar / CRITICAL şişmesini temizle | buildThemeSpecificSection + buildIllustrationSection sadeleşti |
| ~~A5~~ ✅ | Sayfa `imagePrompt` için sinematik direktif ekle | LIGHTING → DEPTH → COLOR → COMP → ATMO — system prompt'ta |
| ~~A6~~ ✅ | Kapak `coverImagePrompt` talimatını güncelle | Film afişi / zirve / tüm karakter — system prompt'ta |
| ~~A7~~ ✅ | `sceneMap` alanını şema + prompt ile tanımla | Schema + buildStoryStructureSection (plan-first) + VERIFICATION CHECKLIST — görsel çeşitlilik garantisi |

### A paketi kapanış notu

- `max_tokens` → **`max_completion_tokens`** geçişi yapıldı (Chat Completions güncel öneri).
- Story varsayılanları (`DEFAULT_STORY_MODEL`, promptVersion, output token limiti) tek kaynakta toplandı: `lib/ai/story-generation-config.ts`
- Prompt tarafında hikayenin **itinerary/checklist** gibi akmasını azaltmak için sebep-sonuç akışı ve picture-book tonu güçlendirildi.
- `supportingEntities` için tekrar eden / merkezi nesneler (örn. oyuncak ayı, top, harita) açık zorunluluk haline getirildi.
- Son durum: **A tamamlandı**. Bundan sonra request tarafında ancak kaliteye doğrudan etkisi olan küçük rötuşlar yapılır; ana odak **B**.

**Test dosyaları:** `createBook-analysis/story-generation/request.json` · `response.json`

---

## B) Response — kısa analiz

- Çıktı **geçerli JSON** ve **tüm zorunlu alanlar** dolu olmalı (`finish_reason: stop`).
- Yeni veya sıkılaştırılmış alanlar: örn. `sceneMap`, güçlendirilmiş `imagePrompt` / `coverImagePrompt` metinleri.
- Parse / pipeline (`lib/book-generation/…`) yeni alanlarla uyumlu olmalı.
- Bugünkü gerçek kalite açığı: model bazen sahne/sayfa JSON’unu doldursa bile **supportingEntities**, `sceneMap` ve kapak alanlarında gevşek davranabiliyor; bu yüzden runtime’da otomatik doğrulama + hedefli onarım gerekli.

---

## B) Response — yapılacaklar (checklist)

| # | İş | Not |
|---|-----|-----|
| ~~B1~~ ✅ | Story JSON şemasını `json_schema` ile kodla hizala | `lib/prompts/types.ts` güncellendi; response shape schema ile hizalandı |
| ~~B2~~ ✅ | `sceneMap` eklenecekse şema + parse + doğrulama | Ortak validator/repair katmanı ile `sceneMap` sayfa numarası + alan kontrolü eklendi |
| ~~B3~~ ✅ | Örnek çıktıda `imagePrompt` / `coverImagePrompt` kalitesini kontrol et | Sorun uzunluk değil; hikaye akışı + entity boşluğu bulundu, prompt buna göre sıkılaştırıldı |
| ~~B4~~ ✅ (çekirdek) | Pipeline’da story parse kullanan yerleri gözden geçir | **Yapıldı:** `generate-story`, `books`, `step-runner`, `image-pipeline` → `lib/ai/story-response-validator.ts` (normalize + repair + assert). **İsteğe bağlı ileri adım:** entity/master veya görsel adımlarında ek “kalite guard” (ayrı madde; zorunlu değil). |

### B’de şu an neredeyiz?

- Yeni ortak katman: `lib/ai/story-response-validator.ts`
- Kullanıldığı yerler:
  - `app/api/ai/generate-story/route.ts`
  - `app/api/books/route.ts`
  - `app/api/admin/debug/step-runner/route.ts`
  - `lib/book-generation/image-pipeline.ts`
- Bu katman:
  - story JSON’u **normalizeStoryShape** ile zenginleştirir: `pages[].cameraDistance`, `shotPlan`, `characterIds`, `supportingEntities[].type` / `appearsOnPages`, `metadata` (`ageGroup`, `safetyChecked`, `educationalThemes`, `theme` trim) — ayrıntı: `story-camera-distance.ts`, `story-response-normalize-fields.ts`
  - `coverDescription`, `coverImagePrompt`, `sceneMap`, `supportingEntities`, `suggestedOutfits` eksik/bozuksa hedefli repair ister
  - sonrasında zorunlu alanları runtime’da sert doğrular (`metadata.ageGroup` bilinen beş değerden biri olmalı)
- Pratik sonuç: model bazen güzel bir hikaye dönse bile response gevşek kaldığında pipeline’a “yarım iyi” JSON sızması azalır.

### Story repair akışı (kısa)

```
[1] Chat Completions → ham story JSON (choices[0].message.content)
[2] prepareStoryResponseForUse → eksik/bozuk alan var mı?
[3] Varsa en fazla 1 ek çağrı (STORY_RESPONSE_MAX_REPAIR_CALLS = 1) → sadece o alanları doldurur; pages[].text değişmez
[4] assert → geçerli değilse hata (sonsuz döngü yok; ikinci repair turu yok)
```

**supportingEntities + repair:** Alan yok/bozuk, **boş dizi** veya listede **geçersiz kayıt** varsa hedefli repair tetiklenir (kalite: model destekleyici nesneleri doldurur). Sadece “alan tamamen eksik” değil; boş `[]` de bir repair turuna girer.

**Not:** Ham yanıtta `usage` token sayar; OpenAI **USD tutarı** göndermez — maliyet `lib/pricing/openai-usage-cost` veya route’taki tahmini `formatStoryCost` ile hesaplanır.

---

## Her küçük paket sonrası hızlı sorular

1. JSON parse ve şema uyumu tamam mı?  
2. `request` token / okunabilirlik iyileşti mi?  
3. Sayfa görselleri için brief’ler (imagePrompt) öncekinden daha “sahneli” mi?  
4. Kapak metni açılışta mı kaldı, zirve/vaat mı?

---

## C) Merkezi model yapılandırması (tek kaynak)

**Gerekçe:** `gpt-4.1-mini` vb. string’ler `route.ts`, worker, pipeline içinde **dağınık**; varsayılanı değiştirmek zor ve hata riski yüksek. **Tek export** (veya tek config objesi) + isteğe bağlı **env override** mantıklı.

**Önemli ayrım:** Kitapta iki tür “model” var: **Chat Completions** (metin / JSON hikâye) ve **Images API** (kapak/sayfa **pikseli** — `gpt-image-*`). Bunlar aynı isimlendirme değildir.

### Önerilen varsayılanlar (ürün kararı — uygulama koduna yansıtılacak)

| Bağlam | Varsayılan (öneri) | Tür |
|--------|-------------------|-----|
| Normal kitap — **story generation** (chat) | `gpt-4.1-mini` | Chat |
| **Examples** / hazır hikâye içeriği (yüksek kalite, ayrı akış) | `gpt-4o` | Chat |
| Kapak / sayfa **görsel piksel** üretimi (şu an kod: `image-pipeline`) | `gpt-image-1.5` | Images API — chat değil |
| **TTS** | (OpenAI yok) | Şu an **Google Cloud TTS** — `lib/tts/generate.ts`. İleride OpenAI ses API’si eklenirse bu tabloya yazılır. |

**Not:** “Kapak / sayfa için 4.1 mini” genelde **hikâye ve görsel brief** (chat) içindir; **piksel** için kodda ayrı **Images** modeli (`gpt-image-1.5` vb.) kullanılır.  
Examples / hazır içerik stratejisi: `docs/analysis/READY_STORIES_AND_IDEAS_PIPELINE.md`.

### Yapılacaklar (checklist)

| # | İş | Durum |
|---|-----|-------|
| ~~C1~~ ✅ | `lib/ai/openai-models.ts` oluşturuldu — story, vision, character analysis, image modelleri tek kaynakta | `DEFAULT_IMAGE_MODEL`, `DEFAULT_VISION_MODEL`, `DEFAULT_CHARACTER_ANALYSIS_MODEL`, re-export story sabitleri |
| ~~C2~~ ✅ | Tüm tüketicilerde hardcoded string kaldırıldı | `books/route.ts`, `image-pipeline.ts`, `book-generation.worker.ts`, `characters/analyze`, `generate-images`, `edit-image`, `create-free-cover`, `StepRunnerPanel`, `step6/page.tsx` |
| C3 | İsteğe bağlı: env override (`OPENAI_STORY_MODEL`, `OPENAI_IMAGE_MODEL` vb.) | Zorunlu değil; ihtiyaç doğarsa ekle |
| ~~C4~~ ✅ | `ALLOWED_STORY_MODELS` tek kaynaktan; debug UI dinamik liste | `StepRunnerPanel` ve `step6/page.tsx` import ediyor |

**C — onaylı kapanış (çekirdek):** C1, C2, C4 üretimde tamam ve dokümanda **onaylı** sayılır. C3 bilinçli şekilde açık bırakıldı (isteğe bağlı). **Tek kaynak:** `lib/ai/openai-models.ts` · `tsc --noEmit` temiz.

---

## D) Görsel pipeline — checklist özeti

**Akış:** Story JSON sonrası — **master** (karakter), **entity master** (`supportingEntities`), **kapak**, **sayfa** görselleri (Images API). Story alanları (`imagePrompt`, `sceneDescription`, `environmentDescription`, `coverImagePrompt`, `sceneMap`, …) burada birleştirilir veya tüketilir.

**Kod (giriş):** `lib/book-generation/image-pipeline.ts` · `lib/prompts/image/scene.ts`, `character.ts`, `style-descriptions.ts` · `app/api/books/route.ts` (master/entity yardımcıları)

**sceneMap / shotPlan / “uzun” sahne metni (şu anki durum):**

- **`sceneMap[]`:** Sayfa başına **kısa** plan (location, timeOfDay, setting). **D1 (29.03.2026):** İç sayfada `generateFullPagePrompt` öncesinde `SceneInput.storyScenePlanAnchor` + gerektiğinde `timeOfDay` (`shotPlan` yoksa); `characterAction` artık uzun `imagePrompt` ile iki kez doldurulmuyor — `lib/book-generation/page-scene-contract.ts`.
- **`shotPlan` (sayfa):** Opsiyonel **kompozisyon ipuçları**; kodda `generate-images` / `books` akışından `scene` girdisine **aktarılıyor** (`buildShotPlanBlock` vb.). Derin kullanım ve varsayılanlar D ile genişletilebilir.
- **`pages[].imagePrompt` (ve ilgili sahne alanları):** Sayfa başına **uzun** görsel brief — piksel üretiminde doğrudan ana malzeme; kısa `sceneMap` satırı bunun yerine geçmez, **tamamlayıcı** katman (plan vs detaylı sahne tarifi).

**Bu dokümanda kalmaz:** D ilerledikçe istenirse `docs/analysis/IMAGE_PIPELINE_ROADMAP.md` gibi ayrı kısa dosya açılabilir; burada sadece faz özeti.

### D) — yapılacaklar (checklist)

| # | İş | Not |
|---|-----|-----|
| ~~D1~~ ✅ | Story çıktısı → iç sayfa prompt zinciri | **Tamam (29.03.2026):** `page-scene-contract` — `buildPrimaryVisualBrief` / `buildCharacterActionForPage`; `sceneMap` → `storyScenePlanAnchor` + `timeOfDay` yedek; `scene.ts` PRIORITY + tek satır plan. Kapak ayrı dal (önceki davranış). |
| ~~D2~~ ✅ | `supportingEntities` → master üretim | **Tamam (29.03.2026):** `lib/book-generation/supporting-entities.ts` — `normalizeAppearsOnPages` / `entityAppearsOnPage` (1…N sayfa, geçersiz numara elenir); `buildSupportingEntityMasterPrompt` (English-only + isim + açıklama). `generateSupportingEntityMaster` tek kaynak (`image-pipeline`); `books/route` içindeki kopya kaldırıldı. |
| ~~D3~~ ✅ | Stil (`illustrationStyle`) tutarlılığı | **Tamam (29.03.2026):** `style-descriptions.ts` — `usesCinematicImageLayers`, grafik düz profilde `getGlobalArtDirection` + `getCinematicPack` (grafik tutarlılık paketi) + `getStyleQualityPhrase`; `scene.ts` — `buildStyleDirectives`, `getCinematicElements` / `getCinematicNaturalDirectives` dalları; `supporting-entities.ts` — `getCinematicPack(illustrationStyle)`, `[RENDER]` etiketi. |
| ~~D4~~ ✅ | Uçtan uca doğrulama | **Otomasyon:** `npm run d4:smoke` — kamera mesafesi + pet brief + stil assert’leri. **Master (evcil + stil):** `getStyleDescription` tüm master dallarında; `buildPetCharacterBrief`; evcil prompt style-first. **Story validator (aynı dönem):** enum sapmalarında 500 önleme — normalleştirme + prompt sıkılaştırma (`base.ts` cameraDistance, metadata, supportingEntities.type, shotPlan). **Debug UI:** Step-Runner’da request/response JSON panoya kopyala. **Manuel örnek:** `createBook-analysis/master-illustrations/` + `story-generation/`. |

**D başlangıç kriteri:** `createBook-analysis/story-generation/request.json` + `response.json` ile story adımı onaylandıysa D1’e geç.

---

### Sıradaki büyük konu (D checklist sonrası)

Step-Runner sırası: **Story → Master Illustrations → Entity Masters → Cover → Page Images**. D tablosunda **D2** entity üretim kodunu (`supporting-entities.ts`, `generateSupportingEntityMaster`, `image-pipeline`) kapsıyor; **sıradaki ürün/QA odağı** pratikte şu:

| Sıra | Konu | Ne yapılacak (kısa) |
|------|------|---------------------|
| **1** | **Entity Masters** (`image_entity`) | `supportingEntities.length > 0` olan bir hikâyeyle Step-Runner’da adımı çalıştır; çıkan görsellerin **master karakter + comic_book (veya seçilen stil)** ile uyumu; `buildSupportingEntityMasterPrompt` + `getStyleDescription` / `[RENDER]` yeterli mi, gerekirse entity-only stil satırı güçlendirme. |
| **2** | **Cover** (`image_cover`) | Kapak prompt birleşimi, `coverImagePrompt` / master referansları; regresyon (özellikle çok karakter + tema). |
| **3** | **Page Images** (`image_page`) | Tam sayfa veya `targetPageNumber`; `generateFullPagePrompt` + D1/D3 zinciri; maliyet/süre notu. |

**Not:** Hikâyede `supportingEntities: []` ise Entity adımı “0 entity” ile geçer; anlamlı test için hikâyede en az bir destek varlığı (ör. oyuncak, nesne) olan bir seed veya repair sonrası dolu liste gerekir.

---

## Eski dosya isimleri (geri link)

Aşağıdakiler kısa yönlendirme olarak kaldı:  
`CINEMATIC_VISUALS_PROMPT_IMPROVEMENT.md` · `CINEMATIC_VISUALS_FAZ1_ANALYSIS.md` · `CINEMATIC_IMAGEPROMPT_DIRECTIVE.md` → hepsi bu dosyaya işaret eder.
