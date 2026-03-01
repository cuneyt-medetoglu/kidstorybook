# Story Generation Prompt Template

**Tek kaynak:** `lib/prompts/story/base.ts`  
**Versiyon (kod):** 2.6.0  
Bu doküman, koddaki prompt yapısının okunabilir şablonudur. Kod değişirse doküman da güncellenmelidir; **base.ts = gerçek kaynak**.

**v2.2.0 (8 Şubat 2026):** Tüm doğrulama maddeleri tek blokta: `# VERIFICATION CHECKLIST`. LANGUAGE'dan "Before returning..." kaldırıldı; OUTPUT FORMAT kuyruğu "see # VERIFICATION CHECKLIST below" ile kısaltıldı.  
**v2.3.0 (8 Şubat 2026):** shotPlan sayfa başına **zorunlu**; OUTPUT FORMAT ve VERIFICATION CHECKLIST güncellendi.  
**v2.4.0 (8 Şubat 2026):** **coverSetting** üst seviye alan eklendi (REQUIRED): kapak görseli için tek cümle İngilizce ortam tarifi (karakter yok). Plan A – COVER_PATH_FLOWERS_ANALYSIS.md §7.  
**v2.5.0 (8 Şubat 2026):** **Story JSON validation (Sıra 17):** route.ts story cevabında suggestedOutfits ve characterExpressions REQUIRED; eksikse retry. Kelime sayısı kontrolü ve kısa sayfa repair pass.  
**v2.6.0 (1 Mart 2026):** **ONE STORY, STEP BY STEP** — Hikaye tek bir konudan (örn. bir kamp günü) başlayıp doğal adımlarla sonuna gelir; her sayfa = sıradaki adım. STORY STRUCTURE'a kamp örneği eklendi (uyanma → hazırlık → yola çıkma → çadır kurma → keşif → aktivite → uyku). STORY SEED: yazar fikri hikayenin başlangıcı; aynı hikaye adım adım sonuna kadar devam eder. journeyMap / sabit lokasyon kuralları kaldırıldı. VERIFICATION: each page = one step; imagePrompt describes that step.
**v2.6.1 (1 Mart 2026):** **Custom tema:** `theme === "custom"` seçildiğinde `getThemeConfig("custom")` kullanılır; hikaye yönü tamamen STORY SEED (customRequests) ile belirlenir. Step 5’te Custom tema seçiliyse customRequests zorunludur (min 10 karakter). Educational + Space birleşik tema “Learning & Discovery” olarak güncellendi.
(v2.5.0: Story JSON validation, suggestedOutfits/characterExpressions REQUIRED, kısa sayfa repair. v2.4.0: coverSetting. v2.3.0: shotPlan. v2.2.0: VERIFICATION CHECKLIST tek blok. v2.1.0: Görsel çeşitlilik, kelime hedefi, kısa sayfa repair.)

---

## İstek yapısı (API’ye ne gidiyor?)

**Kaynak:** `app/api/books/route.ts` → `openai.chat.completions.create()`

| Alan | Değer |
|------|--------|
| **model** | `storyModel` (örn. gpt-4o-mini) |
| **messages** | 2 mesaj: 1 system, 1 user |
| **response_format** | `{ type: 'json_object' }` |
| **temperature** | 0.8 |
| **max_tokens** | 8000 |

**Parametre kısa açıklamaları:**
- **temperature (0.8):** Modelin yanıt çeşitliliği. 0’a yakın = daha tekrarlı/öngörülebilir, 1’e yakın = daha yaratıcı/çeşitli. 0.8 hikaye için makul bir denge.
- **max_tokens (8000):** Yanıtın maksimum uzunluğu (token). 12+ sayfa JSON için güvenli; limitin üzerinde kalması sorun değil, azaltırsan yanıt kesilebilir.
- **2 mesaj (system + user):** API yapısı: system = rol/sabit talimatlar (“Sen çocuk kitabı yazarısın”), user = tek seferlik istek (karakter, tema, sayfa sayısı). Model böyle ayırmayı destekliyor; system mesajı bağlam olarak kalıyor.

### System message (sabit)

Kod: `route.ts` içinde `storyRequestBody.messages[0].content`

```
You are a professional children's book author. Create engaging, age-appropriate stories with detailed image prompts. Return exactly the requested number of pages. Write the entire story in [LANGUAGE_NAME] only; do not use words from other languages.
```

- `[LANGUAGE_NAME]`: `getLanguageName(language)` (Turkish, English, German, …).

### User message (prompt)

Kod: `generateStoryPrompt(input)` → `lib/prompts/story/base.ts`  
Çıktı: aşağıdaki bölümler `\n\n` ile birleştirilir. **Açılış cümlesi yok** (system’de zaten var).

---

## User prompt bölümleri (sıra = base.ts’deki sıra)

Aşağıdaki her blok, `base.ts` içindeki ilgili builder fonksiyonunun ürettiği metnin birebir şablonudur. `[PARANTEZ]` içindekiler dinamik değerlerdir (input veya helper’dan gelir).

---

### 1. CHARACTER(S)

**Kod:** `buildCharacterSection(characterDesc, characters)`  
**Başlık:** `# CHARACTER` veya `# CHARACTERS` (birden fazla karakter varsa).

**characterDesc** = `buildCharacterDescription(name, age, gender, referencePhotoAnalysis, { hairColor, eyeColor })` çıktısı:

**Step 1 verisi varsa (hairColor veya eyeColor):** Sadece Hair ve Eyes; cilt/yüz/build referans görselden (görsel üretimde kullanılır).
```
Name: [CHARACTER_NAME]
Age: [AGE] years old
Gender: [GENDER]

PHYSICAL APPEARANCE (use in every image – only what we have; rest from reference):
- Hair: [hairColor veya "natural"] natural [short|medium|long] hair
- Eyes: [eyeColor veya "brown"] round eyes
```
(Kıyafet yok – master’dan. Skin/face/build yok – referans görselden.)

**Analiz varsa:** `analysis.finalDescription` veya `detectedFeatures` ile tam görünüm eklenir. **Yoksa:** sadece Hair + Eyes (minimal fallback). **PERSONALITY ve Clothing yok**.

**Build (vücut/boy):** Görsel tutarlılık için kullanılırdı; artık sadece referans/analiz varsa ekleniyor, yoksa referans görselden çıkarılıyor.

**Birden fazla karakter varsa** `characterDesc` sonrası eklenir:
- ADDITIONAL CHARACTERS: 2. [Name] (a pet / [CHARACTER_NAME]'s family member / …) + görünüm detayları
- CRITICAL - CHARACTER USAGE REQUIREMENTS, FAMILY MEMBERS USAGE (varsa), CHARACTER DISTRIBUTION REQUIREMENTS
- CHARACTER MAPPING (CRITICAL - for JSON response): Character 1: ID="[uuid]", Name="[name]" …
- **CRITICAL - REQUIRED FIELD:** Her sayfa için `characterIds` array zorunlu; mapping’teki ID’leri kullan.

**Tek karakter:** CHARACTER MAPPING + "For EACH page you MUST include characterIds: [id]".

---

### 2. STORY REQUIREMENTS

**Kod:** `buildStoryRequirementsSection(themeConfig, characterAge, ageGroup, pageCount, language, illustrationStyle, customRequests)`

```
# STORY REQUIREMENTS
- Theme: [themeConfig.name] ([themeConfig.mood] mood)
- Target Age: [characterAge] years old ([ageGroup] age group)
- Story Length: EXACTLY [getPageCount(ageGroup, pageCount)] pages (CRITICAL: You MUST return exactly N interior pages, no more, no less. Cover is generated separately.)
- Target words per page: [getWordCountRange(ageGroup)] (short sentences, simple verbs, repetition where appropriate).
- Language: [getLanguageName(language)]
- Illustration Style: [illustrationStyle]
```

**Not:** customRequests varsa bir sonraki bölüm `# STORY SEED` olarak eklenir (aşağıda).

---

### 2b. STORY SEED (customRequests varsa)

**Kod:** `buildStorySeedSection(customRequests, pageCount, ageGroup)`  
**Koşul:** Sadece `customRequests?.trim()` doluysa eklenir (sections içinde `...(customRequests?.trim() ? [buildStorySeedSection(...)] : [])`).

```
# STORY SEED
The author gave this idea for the story. Use it as the starting point.
- It describes how the story begins (e.g. who, where, what situation). Use that for the opening (pages 1–2).
- Then continue the same story step by step for the rest of [n] pages — the next natural events, one per page, until you reach a clear ending.
- Do not copy the text word for word; use it as the beginning and grow the story from there.

"[customRequests]"
```

---

### 3. SUPPORTING ENTITIES (Master-For-All-Entities)

**Kod:** `buildSupportingEntitiesSection(theme)`

```
# SUPPORTING ENTITIES (Master-For-All-Entities)
Identify ALL animals and important objects that appear in the story; each gets a master illustration.
- Include: any animals and key objects that the story needs. Exclude: background-only elements (e.g. trees, rocks), character clothing.
- Rules: unique name+id per entity; visual description for master; same name throughout; list appearsOnPages.
- JSON: include "supportingEntities" array with id, type (animal|object), name, description, appearsOnPages. Verify all story entities are listed.
```

---

### 4. LANGUAGE

**Kod:** `buildLanguageSection(language)`

- **Sadece sayfa "text":** Kitapta görünecek hikaye metni [getLanguageName(language)] (örn. Türkçe).
- **imagePrompt, sceneDescription, sceneContext:** Her zaman **İngilizce**. Görsel API'leri için kullanılır.

```
# LANGUAGE
- **Page "text" only:** Write the story narrative (the "text" field for each page) in [langName] only. This is what appears in the book. Do not use words from other languages in "text".
- **imagePrompt, sceneDescription, sceneContext:** Always in English only. These fields are used for image generation APIs and must be in English.
```
(Doğrulama maddeleri artık sadece `# VERIFICATION CHECKLIST` içinde; LANGUAGE'da "Before returning" yok.)

---

### 5. AGE-APPROPRIATE GUIDELINES

**Kod:** `buildAgeAppropriateSection(ageGroup)`

```
# AGE-APPROPRIATE GUIDELINES
- Vocabulary: [getVocabularyLevel(ageGroup)]
- Sentence Length: [getSentenceLength(ageGroup)]
- Complexity: [getComplexityLevel(ageGroup)]
- Reading Time: [getReadingTime(ageGroup)] minutes per page
```

---

### 6. STORY STRUCTURE

**Kod:** `buildStoryStructureSection(characterName, ageGroup, pageCount, characters)`

```
# STORY STRUCTURE
- **Cover:** Cover is generated separately; do NOT include cover in pages. pages[] = interior pages only.
- **pages[]:** EXACTLY [getPageCount] items (interior pages only). No cover in this array.
- **Page 1 (first interior):** Must differ from the cover (different moment, angle, or setting).
- **Narrative arc:** One clear story from beginning to end. First 1–2 pages set the situation; middle pages are the main events (things that happen, step by step); last 1–2 pages bring a clear resolution. The last page should feel like an ending.

# ONE STORY, STEP BY STEP
- Tell ONE story (e.g. a camping day, a birthday, a discovery in the garden). Each page = the next natural step in that story.
- Example for a camping story: waking up at home → preparing / packing → going to the campsite → setting up the tent → exploring → something small happens (e.g. finding a trail, seeing an animal) → an activity (e.g. picking up litter, playing) → evening in the tent → falling asleep. Each page is one step; no repeating the same step.
- If the story seed describes how the story starts, use it for the opening (pages 1–2). Then continue with the natural next steps of that same story — do not stretch one moment across many pages.
- Each page's imagePrompt and sceneDescription should spell out that step clearly (where we are, what is happening), so each illustration is different.
```

---

### 7. THEME + DO NOT DESCRIBE VISUAL DETAILS

**Kod:** `buildThemeSpecificSection(themeConfig, ageGroup, theme)`

```
# THEME
Use a setting, mood, and educational focus that fit the theme "[themeConfig.name]" and target age. Do not list fixed examples; derive them from the story you create.

**Eski sabitler (Setting/Mood/Include/Educational focus):** Tema bazlı sabit metinler kaldırıldı; her adventure aynı "outdoor exploration, exciting..." alıyordu. Artık AI tema ve yaşa uygun setting/mood/odak üretiyor.

# DO NOT DESCRIBE VISUAL DETAILS
Story = narrative only. Visual details (appearance, clothing, object colors) = master illustration system. Do not describe character looks or clothing in text/imagePrompt/sceneContext. Focus on actions, emotions, location, time of day, plot. sceneContext = short location/time/action only (e.g. "forest clearing, morning, character approaching").
```

---

### 8. VISUAL DIVERSITY

**Kod:** `buildVisualDiversitySection()`

```
# VISUAL DIVERSITY
Each page = different scene. Vary location, time of day, perspective, composition, and character action/pose.
- Do NOT repeat the same pose or action on consecutive pages. Each page must have a distinctly different character action or pose (e.g. one page running, next page sitting or looking around).
- Scene description and imagePrompt: detailed (150+ and 200+ chars).
```

---

### 9. WRITING STYLE

**Kod:** `buildWritingStyleSection(ageGroup, language, characterName, characters)`

```
# WRITING STYLE
Each page: ~[getWordCount(ageGroup)] words. Include dialogue, sensory details (see, hear, feel), atmosphere. Show, don't just tell. Structure: opening + action/dialogue + emotion + transition. Example ([getLanguageName(language)]): [getExampleText(ageGroup, characterName, language, characters)]
```

---

### 10. SAFETY RULES

**Kod:** `buildSafetySection(ageGroup)` → `getSafetyRules(ageGroup)`

```
# SAFETY RULES (CRITICAL - MUST FOLLOW)
## MUST INCLUDE:
- Positive, uplifting message
- Age-appropriate problem-solving
- Kindness, friendship, or courage themes
- Safe, supportive environment
- Happy or hopeful ending

## ABSOLUTELY AVOID:
- Violence, fighting, weapons
- Scary monsters, ghosts, or nightmares
- Death, injury, or harm to characters
- Abandonment or separation anxiety
- Adult themes or situations
- Negative stereotypes
- Commercialism or brand names
- Dark, frightening imagery
- Hopeless or sad endings
```

---

### 11. ILLUSTRATION

**Kod:** `buildIllustrationSection(illustrationStyle, characterName, characters)`

```
# ILLUSTRATION
Per page: scene description + detailed image prompt ([illustrationStyle]). Visual safety: avoid holding hands, detailed hand objects, complex gestures. Prefer hands at sides, simple poses.
For each page, describe EACH character's facial expression separately in the characterExpressions object. Use specific visual details of eyes, eyebrows, and mouth—NOT just emotion words. Vary expressions by character and scene (e.g. one surprised, another calm). No fixed list; derive from the narrative.
```

---

### 12. OUTPUT FORMAT (JSON)

**Kod:** `buildOutputFormatSection(ageGroup, pageCount, illustrationStyle, theme, themeConfig, characters, characterName)`

```
# OUTPUT FORMAT (JSON)
Return a valid JSON object:
{
  "title": "Story title",
  "coverSetting": "English, one sentence: setting/background only for the book cover image (no characters). Cinematic. Examples: 'glacier and ice cave, frozen landscape' or 'birthday party room with balloons and cake' or 'lush forest clearing with wildflowers'",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page text (~[getWordCount(ageGroup)] words, dialogue + descriptions)",
      "imagePrompt": "Detailed [illustrationStyle] prompt (200+ chars): location, time of day, composition, character action. No appearance/clothing (master). Each page = distinct scene.",
      "sceneDescription": "Detailed scene (150+ chars): location, time, action, mood. No appearance/clothing.",
      "characterIds": ["id-from-CHARACTER-MAPPING"],
      "sceneContext": "Short location/time/action only, e.g. 'forest clearing, morning, character approaching ball'",
      "characterExpressions": {
        "character-id-1": "Visual description of THIS character's facial expression (eyes, eyebrows, mouth). Example: eyes wide with surprise, eyebrows raised, mouth slightly open",
        "character-id-2": "… (one entry per character ID in characterIds for this page)"
      },
      "shotPlan": { "shotType": "wide establishing", "lens": "24-28mm", "cameraAngle": "eye-level", "placement": "left third", "timeOfDay": "golden hour", "mood": "wonder" }
    }
  ],
  "supportingEntities": [ { "id": "entity-id", "type": "animal"|"object", "name": "Name", "description": "Visual for master", "appearsOnPages": [2,3] } ],
  "suggestedOutfits": { "[characterId1]": "one line English outfit", "[characterId2]": "one line English outfit" },
  "metadata": { "ageGroup": "[ageGroup]", "theme": "[theme]", "educationalThemes": [], "safetyChecked": true }
}
coverSetting REQUIRED: one sentence in English describing only the setting/background for the book cover (e.g. glacier and ice cave, birthday party room with balloons, lush forest). No character description. Used for cover image generation.
shotPlan REQUIRED per page (shotType, lens, cameraAngle, placement, timeOfDay, mood) — English only; used for image composition. Vary per page for visual diversity.
Required fields and checks: see # VERIFICATION CHECKLIST below.
```

**Not:** Sayfa çıktısında **clothing** alanı yok. **coverSetting** (v2.4.0, Plan A): üst seviye, **zorunlu**; kapak görseli için tek cümle İngilizce ortam tarifi (sadece mekân, karakter yok). Örn. glacier and ice cave, birthday party room with balloons. Kapak BACKGROUND'unda kullanılır; yoksa route'ta keyword fallback. **shotPlan** (shotType, lens, cameraAngle, placement, timeOfDay, mood) sayfa başına **zorunlu**; görsel pipeline'da SHOT PLAN bloğunda kullanılır (yoksa kod fallback üretir; bkz. PROMPT_OPTIMIZATION_GUIDE.md "shotPlan yoksa fallback"). **characterExpressions** (sayfa bazlı, karakter bazlı görsel ifade tarifi) story’den gelir; image pipeline’da [CHARACTER_EXPRESSIONS] bloğunda kullanılır. Master sadece kimlik referansıdır; poz, ifade ve sahne story çıktısından gelir. **suggestedOutfits** (object: karakter ID → tek satır İngilizce kıyafet) story’den gelir; her karakterin master’ında "Character wearing exactly" olarak kullanılır. 
---

### 13. VERIFICATION CHECKLIST

**Kod:** `buildVerificationChecklistSection(ageGroup, characterName, themeConfig, pageCount, language)`

Tüm doğrulama maddeleri tek blokta (A3); LANGUAGE veya OUTPUT FORMAT içinde tekrarlanmaz.

```
# VERIFICATION CHECKLIST (before returning JSON)
- Return EXACTLY [n] pages. characterIds REQUIRED per page (use IDs from CHARACTER MAPPING).
- coverSetting REQUIRED: one sentence, English, setting/background only for the book cover image (e.g. glacier and ice cave, birthday party room with balloons). No character description.
- suggestedOutfits REQUIRED: one key per character ID from CHARACTER MAPPING, value = one line English outfit (used for master illustration).
- characterExpressions REQUIRED per page: one key per character ID in that page's characterIds; value = short English visual description (eyes, eyebrows, mouth)—not just an emotion word.
- Verify every page "text" is in [langName]; verify imagePrompt, sceneDescription, sceneContext are in English.
- shotPlan REQUIRED per page: include shotType, lens, cameraAngle, placement, timeOfDay, mood (English only; vary per page for visual diversity).
- Each page = one step in the story. imagePrompt should describe that step clearly (what is happening, where) so each illustration is different.
- [characterName] = main character in every scene. Positive, age-appropriate, no scary/violent content.
```

---

### 14. Kapanış satırı

**Kod:** sections array’in son elemanı

```
Generate the story now in valid JSON format with EXACTLY [getPageCount(ageGroup, pageCount)] pages.
```

---

## Dinamik değerler (base.ts helper’ları)

| Helper | Kullanım |
|--------|----------|
| `getAgeGroup(age)` | toddler | preschool | early-elementary | elementary | pre-teen |
| `getPageCount(ageGroup, override)` | Varsayılan 12; override 2–20 arası kabul |
| `getLanguageName(language)` | en→English, tr→Turkish, de, fr, es, zh, pt, ru |
| `getVocabularyLevel(ageGroup)` | Örn. "very simple, common words only" |
| `getSentenceLength(ageGroup)` | Örn. "very short (3-5 words)" |
| `getComplexityLevel(ageGroup)` | Örn. "very simple, repetitive, predictable" |
| `getWordCount(ageGroup)` | Örn. "70-90" (toddler), "100-140" (preschool), … |
| `getReadingTime(ageGroup)` | 1–5 dakika |
| `getSafetyRules(ageGroup)` | mustInclude / mustAvoid listesi (sabit) |
| `getThemeConfig(theme)` | name, mood, setting, commonElements, … |
| `getEducationalFocus(ageGroup, theme)` | Tema + yaş odak metni |
| `getExampleText(ageGroup, characterName, language, characters)` | Yaş grubuna göre örnek paragraf |

---

## Beklenen JSON çıktısı

- **title:** string  
- **coverSetting:** string (v2.4.0, REQUIRED). Kapak görseli için tek cümle İngilizce ortam tarifi; sadece mekân (karakter yok). Örn. "glacier and ice cave, frozen landscape", "birthday party room with balloons and cake". Kapak BACKGROUND’unda kullanılır.  
- **pages[]:** pageNumber, text, imagePrompt, sceneDescription, **characterIds**, **sceneContext**, **characterExpressions** (clothing yok; characterExpressions = sayfa bazlı, karakter bazlı görsel ifade: char ID → eyes/eyebrows/mouth, İngilizce)  
- **supportingEntities[]:** id, type (animal|object), name, description, appearsOnPages  
- **suggestedOutfits:** object (karakter ID → kıyafet). Her CHARACTER MAPPING’teki karakter için bir anahtar: değer = tek satır İngilizce kıyafet. Master’lar oluşturulmadan önce her karakterin ne giyeceği belli olur.  
- **metadata:** ageGroup, theme, educationalThemes, safetyChecked  

---

## Bilinen konular / İyileştirme alanları

- **Tekrarlayan arka planlar:** Story artık ONE STORY, STEP BY STEP ile tek konu (örn. kamp günü) ve her sayfa sıradaki adım olacak şekilde yönlendiriliyor; tek sahnenin çok sayfaya yayılması azaltıldı. Görsel pipeline sahne betimlemesini story çıktısından kullanıyor; çeşitlilik hikaye adımlarına bağlı.

---

**Kod:** `lib/prompts/story/base.ts`  
**Log:** Konsolda `[Create Book] 📤 STORY REQUEST (raw):` sonrası tam request ham JSON.
