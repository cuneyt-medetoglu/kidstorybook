# Hikaye + Görsel Kalite Aksiyon Planı

**Tarih:** 7 Şubat 2026  
**Kaynak:** GPT yorumları (cevaplar) + agent değerlendirmesi  
**Durum:** Onay bekliyor — maddeleri okuyup onayladıktan sonra uygulanacak.

---

## GPT Cevapları Özeti

| Soru | GPT cevabı (kısa) |
|------|-------------------|
| 1) Cover vs pages | Mevcut mantık (cover ayrı, pages = interior only) temiz. "Cover is generated separately; pages = EXACTLY N interior" yeterli. pageType şimdilik ekleme. |
| 2) CHARACTER MAPPING | Hem liste (id \| name \| age \| gender) hem map: `CHARACTER_ID_MAP: { "uuid": "Arya" }`. Structured outputs’ta enum ile ID kısıtlaması mümkün. |
| 3) Yaş/kelime | Yaş bandına göre targetWordsPerPage + sentencesPerPage. "3–5 kelime/cümle" mikro kuralını kaldır; "kısa cümle, basit fiiller, tekrar" gibi doğal kurallar. |
| 4) imagePrompt ışık/kompozisyon | Tam uyumlu. imagePrompt’ta lighting/color grade/camera serbest, appearance yasak. İsteğe outfitKey referans. |
| 5) Tek aşama edits | Yeterli. İki aşama (background→character) şart değil; kalite sorunu olursa "sigorta" olarak düşünülebilir. |
| 6) Structured Outputs | response_format: json_schema + strict destekleniyor. Validator yine olsun; semantik hatalar için. |

**GPT’nin ek iki önerisi:**  
- Entity master prompt’larına da global art direction (3D film look, grade, lighting) ekleyin.  
- Hikaye JSON’unda globalArtDirection + shotPlan standart alan olsun; buildFullPagePrompt daha deterministik olur.

---

## Agent (benim) kararlarım

- **Cover / pageType:** GPT ile aynı — pageType eklemiyoruz; prompt’ta “cover ayrı, pages = interior only” netleştiriyoruz.
- **CHARACTER MAPPING:** Liste + map ikisini de ekliyoruz; UUID’leri generate-story’de prompt’a enjekte edeceğiz.
- **Yaş/kelime:** Yaş bandı tablosu (toddler 10–25, 3–4 yaş 25–45 vb.) prompt’a tek hedef sistemi olarak; çelişen cümleleri kaldırıyoruz.
- **imagePrompt kuralları:** Metin = görsel yok. imagePrompt/sceneDescription = appearance yasak, ışık/kompozisyon/atmosfer serbest. outfitKey başta opsiyonel (zaten suggestedOutfits ID ile var).
- **Structured Outputs:** Araştırıp uygulayacağız; önce validator + repair pass ile ilerleyebiliriz, schema hazır olunca API’ye geçeriz.
- **globalArtDirection + shotPlan:** Önce görsel pipeline’da (generateFullPagePrompt / buildCoverPrompt) sabit “cinematic” + sayfa bazlı shotType/cameraAngle ekleyerek hızlı kazanım; istenirse ileride LLM çıktısına metadata.globalArtDirection ve pages[].shotPlan alanları eklenebilir.
- **Entity master stil:** Entity master prompt’larına aynı illustrationStyle + kısa “cinematic/consistent lighting” cümlesi ekliyoruz.
- **“Kocaman karakter” sorunu:** Prompt’ta zaten “character 25–35% of frame” var; model uygulamıyor olabilir. Layout kısıtlarını güçlendirip shotPlan (wide/medium, camera angle) ile “wide shot, character on left third” gibi net talimat veriyoruz; böylece sinematik / ortaya odaklanan kompozisyon artar.

---

## Yapılacaklar (madde madde)

### 1. Hikaye prompt’u (lib/prompts/story/base.ts)

| # | Yapılacak | Öncelik | Not |
|---|-----------|--------|-----|
| 1.1 | Cover netliği: “Cover is generated separately. Do not include cover in pages. pages[] = interior pages only. EXACTLY N items.” (N = pageCount) | Yüksek | ✅ buildStoryStructureSection güncellendi. |
| 1.2 | CHARACTER MAPPING: Prompt’a (A) liste: `id: <uuid> \| name: Arya` ve (B) map: `CHARACTER_ID_MAP`. generate-story’de characters dizisi (gerçek UUID) veriliyor. | Yüksek | ✅ base.ts liste + CHARACTER_ID_MAP; route’da charactersForPrompt. |
| 1.3 | Yaş/kelime: Tek hedef sistemi. Yaş bandı: toddler 10–25, preschool 25–45, early-elementary 45–70, elementary 70–90. Doğal kurallar. | Yüksek | ✅ getWordCountRange, getSentenceLength güncellendi. |
| 1.4 | Görsel detay kuralı: (a) pages[].text = görsel yok. (b) imagePrompt/sceneDescription = appearance yasak; ışık, kompozisyon, atmosfer serbest. | Yüksek | ✅ buildThemeSpecificSection iki maddeli yapıldı. |
| 1.5 | Örnek JSON: suggestedOutfits placeholder düzeltmesi. | Orta | ✅ CHARACTER_ID_MAP referansı eklendi. |
| 1.6 | Dil kuralı: systemMessage’da “Sadece pages[].text hedef dilde; imagePrompt/sceneDescription İngilizce” daralt. | Orta | ✅ generate-story systemMessage güncellendi. |

### 2. Hikaye çıktısı (JSON) ve backend

| # | Yapılacak | Öncelik | Not |
|---|-----------|--------|-----|
| 2.1 | Validator: supportingEntities ve suggestedOutfits varlık kontrolü. Eksikse repair pass — “Sadece bu alanları üret, mevcut JSON’a ekle”. | Yüksek | ✅ generate-story’de validator + tek LLM repair pass eklendi. |
| 2.2 | OpenAI Structured Outputs: response_format json_schema + strict araştır ve (mümkünse) uygula; required alanların dönmesini garanti altına al. | Orta | GPT: mümkün. Önce validator, sonra schema. |
| 2.3 | metadata.safetyChecked: Prompt’ta veya validator’da kontrol. | Düşük | İsteğe bağlı. |

### 3. Görsel pipeline (master / kapak / sayfa)

| # | Yapılacak | Öncelik | Not |
|---|-----------|--------|-----|
| 3.1 | Layout / kompozisyon: Prompt’ta “character 25–35% frame”, “left/right third”, “wide shot” netleştir; getCharacterEnvironmentRatio / getCompositionRules / getAdvancedCompositionRules güçlendir. Hedef: karakter kocaman değil, sinematik ortam. | Yüksek | “Kocaman karakter” şikayeti. |
| 3.2 | Art direction: generateFullPagePrompt ve buildCoverPrompt’a globalArtDirection benzeri sabit blok (color grade, lighting, composition) + sayfa bazlı shotType/cameraAngle/timeOfDay (shotPlan) ekle. LLM’den almadan önce sabit değerlerle dene. | Orta | GPT: globalArtDirection + shotPlan. Agent: önce pipeline’da sabit. |
| 3.3 | Entity master stil: Entity master prompt’larına illustrationStyle + “consistent lighting and style with rest of book (e.g. 3D animation, warm cinematic grade)” ekle. | Orta | GPT: entity’ler farklı estetiğe kaymasın. |
| 3.4 | (İsteğe bağlı) İleride: LLM çıktısında metadata.globalArtDirection ve pages[].shotPlan; iki aşamalı background→character denemesi. | Düşük | Şimdilik yok. |

### 4. Dokümantasyon ve takip

| # | Yapılacak | Öncelik |
|---|-----------|--------|
| 4.1 | Prompt versiyonu (base.ts VERSION/changelog) güncellenince 1.1–1.6 maddelerini işle. | - |
| 4.2 | Bu plan onaylandıktan sonra uygulama sırası: 1.x → 2.1 (validator) → 3.1, 3.2, 3.3. | - |

---

## Onay

Bu planı okuyup uygun gördüğün maddeleri onaylayabilirsin; değiştirmek veya ertelemek istediğin varsa madde numarasıyla yaz. Onaydan sonra sırayla kod/prompt değişikliklerine geçilacak.

---

## GPT’ye gönderilecek ek konu (illustrationStyle + sinematik)

Aşağıdaki metin, GPT’ye ayrı bir mesaj olarak gönderilebilir (3 ve 4. madde için):

- **illustrationStyle:** Hangi stiller var, nasıl kullanılıyor (story + master + sayfa), GPT’den öneri iste.
- **Sinematik / karakter odaklı:** Bizim çıktılar “kocaman karakter, zayıf animasyon havası”; paylaştığın örnekler daha sinematik ve ortaya odaklı — sebep ve çözüm ne?

Metin **`docs/archive/2026-02/analysis/GPT_ILLUSTRATION_AND_CINEMATIC_MESSAGE.md`** dosyasında; kopyala-yapıştır ile GPT’ye gönderilebilir.

---

## Ek: Sinematik kalite checklist (GPT önerileri – uygulama durumu)

*(Eski GPT_SINEMATIK_KALITE_ONERILERI.md içeriği burada birleştirildi.)*

### Style + sinematik

| # | Öneri | Durum |
|---|--------|--------|
| A2 | CINEMATIC_PACK (key light, fill, rim, volumetric, color grade, layered depth) | ✅ getCinematicPack() – style-descriptions.ts, scene.ts |
| A3 | SHOTPLAN_PACK (shotType, cameraAngle, lens, subjectDistance, timeOfDay, mood) | ⬜ Önce sabit; ileride LLM |
| A4 | Identity lock: “do not change scale/framing”, “Identity match does NOT imply close-up” | ✅ scene.ts |
| A5 | NEGATIVE_PACK: flat lighting, centered character, character filling frame | ✅ COMPOSITION_NEGATIVE – negative.ts |
| B1 | 3d_animation/clay için: global illumination, soft shadows, subsurface scattering | ⬜ getStyleSpecificDirectives genişletilebilir |
| C1 | Entity master’lara STYLE_CORE + CINEMATIC_PACK | ✅ books/route.ts |
| D1 | LLM’den globalArtDirection + pages[].shotPlan | ⬜ İleride |

### “Kocaman karakter” – nedenler (GPT)

- Reference master kadrajı yakın → model scale’i büyük taşıyor.
- “Match face/outfit” metinde çok baskın → portreye kayıyor.
- Shot dili eksik (wide + lens / subject distance net değil).
- Kompozisyon talimatı prompt’ta geç geliyor.
- Tek çağrıda çok fazla istek → model “büyük karakter”e kaçıyor.

### “Kocaman karakter” – çözümler (uygulama durumu)

| # | Öneri | Durum |
|---|--------|--------|
| 2B | Kompozisyon en başta: SHOTPLAN + LAYOUT + ENVIRONMENT + IDENTITY LOCK | ✅ Identity cümlesi; tam sıra değişikliği opsiyonel |
| 2C | Negative: close-up, centered, character filling frame | ✅ COMPOSITION_NEGATIVE |
| 2D | ShotPlan film dili: shotType, lens (24mm), cameraDistance (far), characterScale (≤35%) | ⬜ buildShotPlanAndLayoutSection veya composition güçlendir |
| 2E | “Ortam önce” vurgusu | Kısmen Scene-First; artırılabilir |
| 2A/2F | WIDE/MEDIUM/CLOSE master seti; background plate kütüphanesi | ⬜ İleride |
