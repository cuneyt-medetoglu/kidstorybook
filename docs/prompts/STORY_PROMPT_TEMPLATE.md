# Story Generation Prompt Template

**Tek kaynak:** `lib/prompts/story/base.ts`  
**Versiyon (kod):** 2.1.0  
Bu doküman, koddaki prompt yapısının okunabilir şablonudur. Kod değişirse doküman da güncellenmelidir; **base.ts = gerçek kaynak**.

**v2.1.0 (7 Şubat 2026):** Görsel çeşitlilik (ardışık sayfada aynı poz/eylem yok), sayfa başı kelime hedefleri artırıldı (toddler 30–45 … pre-teen 130–180), CRITICAL min kelime; generate-story’de kısa sayfa repair.

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
- Story Length: EXACTLY [getPageCount(ageGroup, pageCount)] pages (CRITICAL: You MUST return exactly N pages, no more, no less)
- Language: [getLanguageName(language)]
- Illustration Style: [illustrationStyle]
- Special Requests: [customRequests || 'None']
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
- Page "text" only: story narrative in [langName].
- imagePrompt, sceneDescription, sceneContext: English only.
Before returning: verify "text" in [langName]; verify imagePrompt, sceneDescription, sceneContext in English.
```

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
- **Cover:** One page for the book cover. Like a movie poster: main character + essence of the whole story. Professional, striking.
- **Interior pages:** Each page = one scene from the story (location, moment, action). No repeating scenes; vary location, time, composition. Same approach for page 1 and all other interior pages.
- Vary locations and time of day across pages so the story feels like a progression.
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
Each page = different scene. Vary location, time of day, perspective, composition, action. Page 1 (first interior) must differ from the cover (different moment or angle). Scene description and imagePrompt: detailed (150+ and 200+ chars).
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
      }
    }
  ],
  "supportingEntities": [ { "id": "entity-id", "type": "animal"|"object", "name": "Name", "description": "Visual for master", "appearsOnPages": [2,3] } ],
  "suggestedOutfits": { "[characterId1]": "one line English outfit", "[characterId2]": "one line English outfit" },
  "metadata": { "ageGroup": "[ageGroup]", "theme": "[theme]", "educationalThemes": [], "safetyChecked": true }
}
Pages array: EXACTLY [getPageCount(ageGroup, pageCount)] items. characterIds REQUIRED per page. characterExpressions REQUIRED per page: object with one key per character ID appearing on that page; value = short English visual description of that character's facial expression (eyes, eyebrows, mouth; e.g. 'eyes wide with surprise' NOT just 'surprised'). suggestedOutfits REQUIRED: one key per character ID, value = one line English outfit (used for master).
```

**Not:** Sayfa çıktısında **clothing** alanı yok. **characterExpressions** (sayfa bazlı, karakter bazlı görsel ifade tarifi) story’den gelir; image pipeline’da [CHARACTER_EXPRESSIONS] bloğunda kullanılır. Master sadece kimlik referansıdır; poz, ifade ve sahne story çıktısından gelir. **suggestedOutfits** (object: karakter ID → tek satır İngilizce kıyafet) story’den gelir; her karakterin master’ında "Character wearing exactly" olarak kullanılır. 
---

### 13. CRITICAL REMINDERS

**Kod:** `buildCriticalRemindersSection(ageGroup, characterName, themeConfig, pageCount, language)`

```
# CRITICAL REMINDERS
- Return EXACTLY [getPageCount(ageGroup, pageCount)] pages. characterIds REQUIRED per page.
- [characterName] = main character in every scene. Positive, age-appropriate, no scary/violent content.
- Before returning: verify page "text" is in [langName]; verify imagePrompt, sceneDescription, sceneContext are in English; verify characterExpressions has one entry per character ID in that page's characterIds (each value = visual facial description in English); verify suggestedOutfits has one entry per character ID from CHARACTER MAPPING.
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
| `getPageCount(ageGroup, override)` | Varsayılan 10; override 2–20 arası kabul |
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
- **pages[]:** pageNumber, text, imagePrompt, sceneDescription, **characterIds**, **sceneContext**, **characterExpressions** (clothing yok; characterExpressions = sayfa bazlı, karakter bazlı görsel ifade: char ID → eyes/eyebrows/mouth, İngilizce)  
- **supportingEntities[]:** id, type (animal|object), name, description, appearsOnPages  
- **suggestedOutfits:** object (karakter ID → kıyafet). Her CHARACTER MAPPING’teki karakter için bir anahtar: değer = tek satır İngilizce kıyafet. Master’lar oluşturulmadan önce her karakterin ne giyeceği belli olur.  
- **metadata:** ageGroup, theme, educationalThemes, safetyChecked  

---

## Bilinen konular / İyileştirme alanları

- **Tekrarlayan arka planlar:** Custom request girilmeden de görsellerde sık tekrar eden sahne (yol, etrafında çiçekler, arkada ev) gözlemlenebilir. Hikaye modeli rastgele hikaye üretiyor; görsel pipeline'da sahne çeşitliliği (location/time/atmosphere) story çıktısına daha sıkı bağlanabilir ve “avoid generic road+flowers+house unless story specifies” gibi direktifler değerlendirilebilir. Story tarafında VISUAL DIVERSITY ve tema bazlı setting zaten vurgulanıyor; görsel prompt'ta sahne betimlemesinin story'den birebir kullanılması ve tekrarlayan şablonların azaltılması iyileştirme alanıdır.

---

**Kod:** `lib/prompts/story/base.ts`  
**Log:** Konsolda `[Create Book] 📤 STORY REQUEST (raw):` sonrası tam request ham JSON.
