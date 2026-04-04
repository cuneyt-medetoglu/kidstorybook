# Story ve Image AI Akışı – Ne Gönderiyoruz, Ne Dönüyor?

**Tarih:** 1 Şubat 2026  
**Amaç:** Story ve image için AI’a ne gönderildiği ve ne döndüğünü tek dokümanda toplamak; inceleme ve hata ayıklama için referans.

---

## 1. Hata Çözümü (Test Sonrası)

### Gördüğünüz hata

```
Page 1 is missing required "clothing" field - clothing must match story setting (e.g. space → astronaut suit)
```

**Sebep:** v1.6.0 ile story artık `clothing` alanı üretmiyor (single source of truth = master). Buna rağmen `app/api/books/route.ts` içinde sayfa bazlı **clothing zorunluluğu** kontrolü hâlâ vardı; AI da artık `clothing` dönmediği için validasyon hata veriyordu.

**Yapılan düzeltmeler:**

| Yer | Değişiklik |
|-----|------------|
| **Story validation** | Sayfa bazlı "clothing required" kontrolü **kaldırıldı**. |
| **Story response log** | `sceneContext` / `sceneDescription` (sayfa keys) loglanıyor. |
| **Master illustration** | `storyData?.pages?.[0]?.clothing` artık **gönderilmiyor**; parametre `undefined` (kıyafet sadece fotoğraftan). |
| **Cover / sayfa clothing** | Story’den clothing alanı kullanılmıyor; sadece `match_reference` (master varsa) veya `undefined`. |

Bu değişikliklerle tekrar test edebilirsiniz; story cevabında `clothing` olmasa da akış devam eder.

---

## 2. Story: AI’a Ne Gönderiyoruz?

**API:** OpenAI Chat Completions  
**Endpoint:** `openai.chat.completions.create()`  
**Kod yeri:** `app/api/books/route.ts` (satır ~627)

### Request yapısı

| Alan | Değer |
|------|--------|
| **model** | `storyModel` (örn. `gpt-4o-mini`) – `appConfig` veya env’den |
| **messages** | 2 mesaj: 1 system, 1 user |
| **response_format** | `{ type: 'json_object' }` |
| **temperature** | `0.8` |
| **max_tokens** | `4000` |

### System message (sabit metin)

- “You are a professional children's book author…”
- v1.7.0: Dil tek cümle. “The story MUST be written entirely in **{languageName}** ONLY…”

### User message (prompt)

- **İçerik:** `storyPrompt` (tek string).
- **Üretim:** `generateStoryPrompt(...)` – `lib/prompts/story/base.ts`.

**generateStoryPrompt’a verilen input (özet):**

- `characterName`, `characterAge`, `characterGender`
- **`readingAgeBracket`** (`0-1` | `1-3` | `3-5` | `6+`) — kelime bandı ve yaş uygunluğu için tek kaynak: `reading-age-brackets.ts`
- `theme`, `illustrationStyle`, `customRequests`, `pageCount`
- `referencePhotoAnalysis` (opsiyonel)
- `language`
- `characters` (birden fazla karakter varsa)
- `hairColor`, `eyeColor` (Step 1’den)
- **`defaultClothing`** (opsiyonel) — `generate-story` route’u master’dan doldurur; `generateStoryPrompt` şu an bu alanı **prompt metnine yazmaz** (yalnızca destructure). Kıyafet tutarlılığı `suggestedOutfits` + görsel master ile yönetilir.

**Prompt’un bölümleri (özet):**

- **v3.x (system + user):** `messages[0]` = `buildStorySystemPrompt(language)` (dil, güvenlik, DO NOT DESCRIBE, sinematik görsel kuralları, kapak/ifade rehberi). `messages[1]` = `generateStoryPrompt(input)` — bölüm sırası ve tam metin `lib/prompts/story/base.ts`. Özet indeks: `docs/prompts/STORY_PROMPT_TEMPLATE.md`.
- **Anlatı yayı:** STORY STRUCTURE + SCENE MAP içinde giriş → gelişme → kapanış zorunludur. Özet: `docs/prompts/STORY_PROMPT_TEMPLATE.md` → “Story STRUCTURE, sceneMap ve anlatı yayı”.
- **Opsiyonel önceden üretilmiş hikaye (Debug):** `POST /api/books` body'de **`story_data`** (geçerli `pages[]` içeren nesne) gönderilirse hikaye üretimi atlanır; bu veri doğrudan kullanılır (masters → kapak → sayfa görselleri aynı akışla). Debug panelinde "Sadece Hikaye" sonrası "Bu hikayeden kitap oluştur" bu yöntemi kullanır.

**İnceleme için:**  
Konsolda “[Create Book]” log’larına bakabilirsiniz. Tam prompt metnini görmek için `route.ts` içinde geçici olarak `console.log('[Create Book] STORY PROMPT (first 2000 chars):', storyPrompt.slice(0, 2000))` ekleyebilirsiniz.

---

## 3. Story: AI’dan Ne Dönüyor?

**Kaynak:** `completion.choices[0].message.content`  
**İşlem:** `JSON.parse(storyContent)` → `generatedStoryData`

### Beklenen response yapısı (v1.6.0)

```json
{
  "title": "string",
  "pages": [
    {
      "pageNumber": 1,
      "text": "string (hikaye metni)",
      "imagePrompt": "string (detaylı görsel prompt)",
      "sceneDescription": "string (sahne betimi)",
      "characterIds": ["character-id-1", "..."],
      "sceneContext": "string (opsiyonel; konum/zaman/aksiyon özeti, görsel detay yok)"
    }
  ],
  "supportingEntities": [
    { "id": "...", "type": "animal" | "object", "name": "...", "description": "...", "appearsOnPages": [2,3,...] }
  ],
  "metadata": {
    "ageGroup": "string",
    "theme": "string",
    "educationalThemes": ["..."],
    "safetyChecked": true
  }
}
```

**Not:** v1.6.0’da artık **`clothing` alanı yok**; validasyon da buna göre kaldırıldı.

**Route’ta yapılan kontroller:**

- `title`, `pages`, `pages` array
- Her sayfada `characterIds` (zorunlu)
- Sayfa sayısı = istenen `pageCount` (trim veya hata)

**İnceleme için:**  
Başarılı story sonrası konsolda STORY RESPONSE özeti görünür; `storyData.pages` için `sceneContext` / `sceneDescription` log’ları eklenmiş durumda; isterseniz `console.log('[Create Book] STORY RESPONSE:', JSON.stringify(storyData, null, 2).slice(0, 3000))` ile tam cevabı da yazdırabilirsiniz.

---

## 4. Image (Kapak): AI’a Ne Gönderiyoruz?

## 3.1 Kapak ve master – sıra ve mantık

**Akış sırası (route.ts):**

1. **Story** → AI'dan `title`, `pages[]`, `supportingEntities[]` gelir.
2. **Master karakter görselleri** → Her karakter için (referans foto + tema kıyafeti) tek bir "master" görsel üretilir. Kıyafet burada belli olur: tema ile uyumlu (adventure → outdoor gear, space → astronaut, vb.). `themeClothingForMaster` ile belirlenir; story'den clothing alınmaz.
3. **Master entity görselleri** → `supportingEntities` (tavşan, top vb.) için master görsel üretilir; referans foto yok, sadece `entity.description` ile.
4. **Kapak** → Kitap başlığı + hikaye özeti/customRequests ile kapak sahnesi betimlenir; referans olarak **karakter master'ları** (ve varsa entity master'ları) kullanılır. Yani kapak, master'lar üretildikten sonra çizilir; kıyafet zaten master'da sabit.
5. **Sayfa görselleri** → Her sayfa için `sceneDescription` / `imagePrompt` + **master referansları** ile görsel üretilir; kıyafet "match reference" (master'a uy).

**Özet:** Kıyafet ve karakter görünümü **master adımında** (story'den hemen sonra) belli oluyor; kapak ve sayfalar bu master'lara referans veriyor.

---

## 4. Image (Kapak): AI'a Ne Gönderiyoruz?

**İki yol:**

- **Referans görsel varsa:** `/v1/images/edits`
- **Yoksa:** `/v1/images/generations`

### 4.1 Edits API (referans ile)

**Endpoint:** `POST https://api.openai.com/v1/images/edits`  
**Body:** `FormData` (multipart)

| Alan | Açıklama |
|------|----------|
| **model** | `imageModel` (örn. dall-e veya gpt-image) |
| **prompt** | `textPrompt` = `generateFullPagePrompt(characterPrompt, coverSceneInput, illustrationStyle, ageGroup, …)` |
| **size** | `imageSize` |
| **quality** | `imageQuality` |
| **image[]** | Referans görsel blob’ları (karakter fotoğrafları / master) |

**Prompt’u kim üretir:**  
`generateFullPagePrompt` → `lib/prompts/image/scene.ts` (character prompt + sahne input’u birleştirir).

### 4.2 Generations API (referans yok)

**Endpoint:** `POST https://api.openai.com/v1/images/generations`  
**Body:** JSON

```json
{
  "model": "string",
  "prompt": "textPrompt (aynı generateFullPagePrompt çıktısı)",
  "n": 1,
  "size": "string"
}
```

---

## 5. Image (Kapak): AI’dan Ne Dönüyor?

**Response:** JSON

```json
{
  "data": [
    { "url": "https://..." }
    // veya
    { "b64_json": "base64..." }
  ]
}
```

**Kullanım:** Kapak URL’i = `data[0].url` veya (b64 ise) decode edilip storage’a yüklenir; sonra `generatedCoverImageUrl` / `book.cover_image_url` olarak saklanır.

---

## 6. Image (Sayfa): AI’a Ne Gönderiyoruz?

**Mantık:** Kapakla aynı – referans varsa **edits**, yoksa **generations**.

**Prompt:**  
`fullPrompt = generateFullPagePrompt(characterPrompt, sceneInput, illustrationStyle, ageGroup, …)`

**sceneInput’a girenler (özet):**

- `pageNumber`, `sceneDescription`, `theme`, `mood`, `characterAction`, `focusPoint`
- **v1.6.0:** `clothing` sadece `match_reference` (master varsa) veya yok; story’den clothing alınmıyor.

**Referans görsel:**  
İlgili sayfadaki karakter(ler) için master illustration URL’leri; gerekirse blob’a çevrilip `image[]` ile gönderilir.

---

## 7. Image (Sayfa): AI’dan Ne Dönüyor?

Kapakla aynı yapı:

- `data[0].url` veya `data[0].b64_json`
- Sayfa görseli sırayla üretilir; URL/b64 sonradan storage’a yüklenip `images_data` içine yazılır.

---

## 8. Özet Tablo

| Aşama | Gönderilen | Dönen |
|--------|------------|--------|
| **Story** | Chat: system + user (`storyPrompt`), `response_format: json_object` | JSON: `title`, `pages[]` (text, imagePrompt, sceneDescription, characterIds, sceneContext?), `supportingEntities[]`, `metadata` |
| **Kapak image** | Edits: FormData (model, prompt, size, quality, image[]) **veya** Generations: JSON (model, prompt, n, size) | `data[0].url` veya `data[0].b64_json` |
| **Sayfa image** | Aynı (her sayfa için ayrı prompt + referans) | Aynı (her sayfa için bir URL/b64) |

---

## 9. İnceleme İpuçları

1. **Story prompt’u:**  
   Geçici `console.log('STORY PROMPT:', storyPrompt.slice(0, 2500))` ile ilk 2500 karakteri inceleyebilirsiniz.

2. **Story response:**  
   `console.log('STORY RESPONSE:', JSON.stringify(storyData, null, 2))` ile tam JSON’u görebilirsiniz.

3. **Image prompt (kapak/sayfa):**  
   Zaten “[Create Book] 📝 Prompt length: …” log’u var; tam metin için `generateFullPagePrompt` çıktısını bir kez `console.log` ile yazdırabilirsiniz.

4. **Image response:**  
   Hata durumunda “[Create Book] ❌ … API error” ve “Error Response:” ile dönen body log’lanıyor; başarıda `data[0].url` veya `b64_json` kullanılıyor.

Bu doküman, test sonrası gördüğünüz hataların çözümü ve “neyi gönderip ne aldığımız” akışını incelemek için tek referans olarak kullanılabilir.
