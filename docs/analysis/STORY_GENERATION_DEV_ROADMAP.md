# Story generation — geliştirme yol haritası

**Son güncelleme:** 3 Şubat 2026 — A/B/C çekirdek + D1–D4 tamam; story **v3.0.8** (entity max 2). **Master M1–M3 tamam** (sözleşme, arşiv, usage/DB + Step-Runner usage satırı). **Sıradaki:** Master **M4** (ürün kararları: `input_fidelity`, retry tablosu). Analiz: [`IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md`](./IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md).  
**Görsel kalite / prompt / kapak–sayfa iyileştirme fazları (ayrı plan, 2026):** [`IMAGE_QUALITY_IMPROVEMENT_PLAN.md`](./IMAGE_QUALITY_IMPROVEMENT_PLAN.md) — bu dosyanın yerine geçmez; story A/B/C/D ile görsel fazları birlikte kullanılır.  
**Tek odak (bu dosya):** `story_generation` metin/JSON + bu dosyadaki **D** özeti (görsel zincir girişleri).  
**Story request/response referans:** Admin **Step-Runner** story adımı (`aiLog`, JSON panoya kopyala) + bu dokümandaki A/B/C — tekrar derin analiz önceliği düşük.  
**Master / entity / sonraki görsel adımlar (analiz + aksiyon planı):** [`docs/analysis/IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md`](./IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md) — **master illustration** (edits, çoklu karakter), **entity master** (generations, metin-only), planlı incelemeler: **kapak**, **sayfa görselleri**, **TTS**.

**Kod:** `lib/prompts/story/base.ts` (`generateStoryPrompt`) · API: `app/api/books/route.ts`, `app/api/ai/generate-story/route.ts`, debug: `app/api/admin/debug/step-runner/route.ts`  
**Prompt özeti (kodla senkron):** `docs/prompts/STORY_PROMPT_TEMPLATE.md` · **İş akışı:** `.cursor/rules/prompt-manager.mdc`

### Development’a başlarken sıra (öneri)

| Harf | Ne | Ne zaman |
|------|-----|----------|
| **A** | Request (prompt + API parametreleri) | Story girdi tarafı — **tamam** |
| **B** | Response (JSON şema, parse, pipeline uyumu) | Validator + repair — **tamam (çekirdek)** |
| **C** | Merkezi model config (`lib/ai/openai-models.ts`) | **Tamam** |
| **D** | Görsel pipeline (master → entity → kapak → sayfa pikseli) | **Çekirdek tamam.** Master kalite fazları **M1–M2** bitti; **M3–M4** ve tablo sırasındaki diğer görsel adımlar aşağıda |

Harf sırası = önerilen ürün sırası: önce story (A/B), sonra modeller (C), sonra piksel adımları (D).

### Ne zaman test? (kısa)

| Durum | Ne yap |
|--------|--------|
| **Her A maddesi mümkünse** | Küçük kontrol: Step-Runner story isteği/yanıtı mantıklı mı, bir story çalıştırıldı mı, bariz kırılma var mı? (zorunlu: her satır değil; riskli değişikliklerde evet) |
| **A paketi tamam (A1–A7 bitti)** | **Tam test:** örnek story request/response’u Step-Runner logundan veya panodan kaydet; aşağıdaki “hızlı sorular” + gerekirse senin onayın → **sonra B’ye geç** |
| **B maddeleri** | Şema / parse değiştikçe her seferinde JSON geçerli mi, pipeline kırılmıyor mu? **B paketi bitince** tekrar uçtan uca story_generation dene |
| **C (model config)** | Deploy / env sonrası: varsayılan model beklediğin gibi gidiyor mu (log veya tek istek)? |

Pratik kural: **A bütünü bitmeden B’ye geçme** demek istemiyorsan — **A1–A7 tamam → tam test → B1** sırası yeterli. A ve B bazen iç içe olacak (ör. `json_schema` hem A hem B); o zaman “A ana hatları bitti” saydığın noktada tam test yap.

---

## Nasıl çalışacağız (ortak ilke)

- Kitap üretiminde **birçok adım** var; her adımı **ayrı ayrı** ele alıp bitirip doğrulayacağız.
- **Küçük, izlenebilir işler:** Mümkünse tek seferde tek tema değişsin; sonra Step-Runner ile story istek/yanıt özetiyle kontrol edelim.
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
- `supportingEntities`: v3.0.7 ile `minItems: 1` kaldırıldı; entity sayısını hikaye içeriği belirler (tipik 1–5). Story seed objeleri entity ipucu olarak prompt'a eklendi. Repair akıllı: seed varsa + entities boşsa → repair tetiklenir.
- Son durum: **A tamamlandı**. Bundan sonra request tarafında ancak kaliteye doğrudan etkisi olan küçük rötuşlar yapılır; ana odak **B**.

**Test kaydı:** Story için örnek istek/yanıt — Admin **Step-Runner** story adımı + `aiLog` (veya `npm run d4:smoke`).

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

**supportingEntities + repair (v3.0.7):** `minItems: 1` sabit kısıtı **kaldırıldı** — entity sayısını hikaye içeriği belirler (prompt: "typically 1–5"). Repair tetiklenme kuralı: alan yok/bozuk veya listede geçersiz kayıt varsa → repair. Ayrıca `supportingEntities` **boş dizi** + **customRequests (story seed) mevcut** ise → repair tetiklenir (seed objeleri entity adayı olarak repair prompt'una verilir). Seed yoksa ve entities boşsa artık hard hata yok — model o hikaye için entity gerekmediğine karar vermiş demektir.

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

**Ayrıntılı request/response analizi ve kalıcı iyileştirme aksiyonları:** [`IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md`](./IMAGE_STEPS_REQUEST_RESPONSE_ANALYSIS.md) — bu roadmap’teki D özetiyle birlikte okunur.

### D) — yapılacaklar (checklist)

| # | İş | Not |
|---|-----|-----|
| ~~D1~~ ✅ | Story çıktısı → iç sayfa prompt zinciri | **Tamam (29.03.2026):** `page-scene-contract` — `buildPrimaryVisualBrief` / `buildCharacterActionForPage`; `sceneMap` → `storyScenePlanAnchor` + `timeOfDay` yedek; `scene.ts` PRIORITY + tek satır plan. Kapak ayrı dal (önceki davranış). |
| ~~D2~~ ✅ | `supportingEntities` → master üretim | **Tamam (29.03.2026):** `lib/book-generation/supporting-entities.ts` — `normalizeAppearsOnPages` / `entityAppearsOnPage` (1…N sayfa, geçersiz numara elenir); `buildSupportingEntityMasterPrompt` (English-only + isim + açıklama). `generateSupportingEntityMaster` tek kaynak (`image-pipeline`); `books/route` içindeki kopya kaldırıldı. |
| ~~D3~~ ✅ | Stil (`illustrationStyle`) tutarlılığı | **Tamam (29.03.2026):** `style-descriptions.ts` — `usesCinematicImageLayers`, grafik düz profilde `getGlobalArtDirection` + `getCinematicPack` (grafik tutarlılık paketi) + `getStyleQualityPhrase`; `scene.ts` — `buildStyleDirectives`, `getCinematicElements` / `getCinematicNaturalDirectives` dalları; `supporting-entities.ts` — `getCinematicPack(illustrationStyle)`, `[RENDER]` etiketi. |
| ~~D4~~ ✅ | Uçtan uca doğrulama | **Otomasyon:** `npm run d4:smoke` — kamera mesafesi + pet brief + stil assert’leri. **Master (evcil + stil):** `getStyleDescription` tüm master dallarında; `buildPetCharacterBrief`; evcil prompt style-first. **Story validator (aynı dönem):** enum sapmalarında 500 önleme — normalleştirme + prompt sıkılaştırma (`base.ts` cameraDistance, metadata, supportingEntities.type, shotPlan). **Debug UI:** Step-Runner’da request/response JSON panoya kopyala. **Manuel örnek:** Step-Runner master + story adımlarından dışa aktarılan özetler. |

**D başlangıç kriteri:** Story adımı Step-Runner veya eşdeğer akışta onaylandıysa D1’e geç.

---

### Sıradaki ana konu (şimdi): Master illustrations (`image_master`)

**Pipeline sırası (hatırlatma):** Story → **Master** → Entity → Cover → Sayfa → TTS. Şu an **Master** sırası.

**Amaç:** Edits API (`/v1/images/edits`) ile üretilen karakter master’ında request/response ve **çocuk / evcil** dalları için net sözleşme, izlenebilirlik ve küçük regresyon profili — story adımındaki disipline yaklaşmak.

| Faz | Kapsam | Dev “hazır” sayılır | Senin testin (nasıl / sonuç) |
|-----|--------|----------------------|------------------------------|
| **M1 — Sözleşme** | [`MASTER_ILLUSTRATION_CONTRACT.md`](./MASTER_ILLUSTRATION_CONTRACT.md) — FormData alanları, Child vs Pet dalları, kaynak tabloları. `IMAGE_STEPS` §2 bu dosyaya link verir. | ✅ Doküman yazıldı (3 Şubat 2026). Sen: metni oku ve onayla. | **Manuel:** Step-Runner master `request` özeti ile sözleşme §1 eşle; checklist §7–§8. |
| **M2 — Arşiv + profil** | [`MASTER_ILLUSTRATION_CONTRACT.md`](./MASTER_ILLUSTRATION_CONTRACT.md) **§9** — dosya adı kuralı, **regresyon profili P1** (1 çocuk + 1 pet + `3d_animation`). | ✅ Bu dosyada (§9). Sen: P1 tablosunu onayla. | **Manuel:** Step-Runner **Master Illustrations**; örnekleri §9 adlandırma kuralına göre sakla; P1 satırlarıyla prompt/görsel kontrolü. |
| **M3 — Gözlemlenebilirlik** | Zaten: `imageEditWithLog` → `cost_usd` + `response_meta.usage` (`lib/ai/images.ts`). Ek: Step-Runner’da `usage` özeti satırı; [`MASTER_ILLUSTRATION_CONTRACT.md`](./MASTER_ILLUSTRATION_CONTRACT.md) §7. | ✅ Doküman + UI özeti (3 Şubat 2026). | **Manuel:** Master adımı çalıştır → `aiLog`’da yeşil **OpenAI usage**; istenirse DB `ai_requests` doğrula. |
| **M4 — Kararlar** | `input_fidelity` (şu an `high`) için stil veya env ile ürün kararı dokümante; moderation sonrası **soft** prompt yeniden deneme dışında hangi hatalarda retry / kullanıcı mesajı — kısa tablo. | Karar metni bu dosyada veya `IMAGE_STEPS`’te referanslı. | **Manuel:** Tabloyu oku; canlıda bir hata senaryosu yoksa “karar onaylandı” yeter. |

**Onay akışı:** M1 → sen onayla → M2 → … Her faz bitince bir sonrakine geçilir; paralel iki faz önerilmez.

**Story tarafı (regresyon):** Hikaye JSON için mevcut otomasyon: `npm run d4:smoke` — Master fazlarından bağımsız, kitap öncesi hızlı kontrol.

---

### Sonraki ana konular (sıra — henüz başlatılmadı)

Aynı mantıkla (fazlar + test + onay) sırayla ele alınacak; detay şablonu Master bittikten sonra bu bölüme 1 satır + link ile eklenebilir.

| Sıra | Konu | API / not |
|------|------|-----------|
| 2 | Entity masters | `image_entity`, generations |
| 3 | Cover | `image_cover` |
| 4 | Page images | `image_page` |
| 5 | TTS | `lib/tts/generate.ts` |

**Not (v3.0.8):** `supportingEntities` **en fazla 2** (maliyet). 0–2 entity ile Entity adımı çalışır.

---

## Eski dosya isimleri (geri link)

Aşağıdakiler kısa yönlendirme olarak kaldı:  
`CINEMATIC_VISUALS_PROMPT_IMPROVEMENT.md` · `CINEMATIC_VISUALS_FAZ1_ANALYSIS.md` · `CINEMATIC_IMAGEPROMPT_DIRECTIVE.md` → hepsi bu dosyaya işaret eder.
