# Kapak: "Orman Yolu + Çiçekler" Tekrarı – Kök Neden Analizi

**Tarih:** 8 Şubat 2026  
**Sorun:** Adventure + herhangi bir yaş seçildiğinde, hikaye buz/uzay/deniz olsa bile kapak hep orman yolu + sağda solda çiçekler gibi çıkıyor.  
**Trace:** `kidstorybook-trace-2026-02-08T19-49-47.json` (Buzlarla Kayıp Macera – buz/glacier hikayesi).  
**Terminal:** `locations path, yol` kapak için loglanıyor; Arya kitabında `locations forest, ev`.

---

## 1. Kök Nedenler (kod + trace)

### 1.1 Tema şablonu – BACKGROUND’a sabit “forest, wildflowers”

**Dosya:** `lib/prompts/image/scene.ts`

- `getEnvironmentDescription(theme, sceneDesc, useFullSceneDesc)`:
  - Kapak için `generateFullPagePrompt` içinde `useFullSceneDesc = !isCover` → kapakta **false**.
  - `useFullSceneDesc === false` iken **sceneDesc kullanılmıyor**, tema şablonu kullanılıyor:
    - `ENVIRONMENT_TEMPLATES['adventure']` = `['lush forest, dappled sunlight, wildflowers', 'mountain path, colorful wildflowers, distant peaks']`
  - Yani **her adventure kapağında** `environment = "lush forest, dappled sunlight, wildflowers" + "expansive sky visible" + ...` sabit geliyor.

- Bu `environment`, `generateLayeredComposition(..., environment, midgroundOverride)` ile **BACKGROUND** satırına yazılıyor:
  - `BACKGROUND: lush forest, dappled sunlight, wildflowers, providing depth and atmosphere...`

**Sonuç:** Hikaye buzda/uzayda/denizde geçse bile kapak prompt’unda BACKGROUND hep “lush forest, dappled sunlight, wildflowers” olduğu için model orman + çiçek çiziyor.

---

### 1.2 Kapak “locations” = sayfalardan çıkan “path” / “yol”

**Dosya:** `app/api/books/route.ts` (kapak sahne metni)

- Kapak açıklaması oluşturulurken tüm sayfalardan `extractSceneElements(desc, text)` ile **location** çıkarılıyor.
- `extractSceneElements` (`scene.ts`): `sceneDescription` + `text` içinde **ilk bulunan** location anahtar kelimesini döndürüyor:
  - Liste: `'path', 'yol', 'forest', 'orman', 'clearing', 'trail', ...` (içinde **glacier/ice yok**).
- Buzlarla Kayıp Macera’da sayfa 3: `sceneContext: "glowing path, daytime, character discovering"` → **"path"** eşleşiyor.
- Türkçe metinde “yol” geçiyorsa **"yol"** da ekleniyor (başka sayfada çıkabiliyor).
- Route’ta: `locations.add(extracted.location)` → `locationList = "path, yol"` (veya benzeri).
- Kapak metni: `Evoke the full journey: path, yol. Key story moments...` şeklinde ekleniyor.

**Sonuç:** Buz hikayesinde bile “path, yol” kapak prompt’una giriyor; tema şablonu (forest, wildflowers) ile birleşince “çiçekli orman yolu” kompozisyonu güçleniyor.

---

### 1.3 COMPOSITION’da “leading lines (path, trail)”

**Dosya:** `lib/prompts/image/scene.ts`

- `getCharacterPlacementForPage`: `'character on left, leading lines (path or trail) guide eye'`.
- `getAdvancedCompositionRules`: `'leading lines (path, fence, tree line) guide eye to character'`.
- `getCompositionRules` içinde: `'leading lines (path, trail)'`.

Bunlar sayfa prompt’unda; kapakta doğrudan aynı bloklar yok ama **kapak da aynı scene.ts pipeline’ından geçtiği** ve BACKGROUND’da “path”/“forest”/“wildflowers” varken model “path” kompozisyonuna kayabiliyor.

---

### 1.4 Özet tablo

| Kaynak | Ne yazıyor / ne yapıyor | Etki |
|--------|--------------------------|------|
| `ENVIRONMENT_TEMPLATES['adventure']` | "lush forest, dappled sunlight, wildflowers" / "mountain path, colorful wildflowers" | Kapak BACKGROUND’u hep orman + çiçek |
| `getEnvironmentDescription(..., useFullSceneDesc=false)` | Kapakta sceneDesc kullanılmıyor, tema şablonu kullanılıyor | Hikaye sahnesi (buz, uzay vb.) kapak ortamına yansımıyor |
| `extractSceneElements` | Sadece sabit liste (path, yol, forest, orman…); glacier/ice yok | Buz hikayesinde “path”/“yol” çıkıyor, “glacier” çıkmıyor |
| Route: `Evoke the full journey: ${locationList}` | "path, yol" kapak metnine ekleniyor | Path kompozisyonu vurgulanıyor |
| Route: "Vibrant, warm colors" | Kapak açıklamasında sabit | Sıcak/çiçekli palete kayma |

---

## 2. Trace ile Doğrulama

- **Buzlarla Kayıp Macera** (trace 19-49-47):
  - Story: glacier, ice, frozen, silver fox.
  - Terminal: `Story-based cover: locations path, yol` → path/yol, sayfalardan.
  - Kapak prompt’unda BACKGROUND tema şablonundan: forest, wildflowers.
- **Arya’nın Macerası** (terminal 19-41):
  - `locations forest, ev` → orman + ev.

İki farklı hikayede bile “path” veya “forest” kapak locations’a giriyor; bir de BACKGROUND’da adventure şablonu hep aynı olduğu için görüntü hep benzer kalıyor.

---

## 3. Önerilen Düzeltmeler

### 3.1 (Yüksek etki) Kapak için environment = hikayeye göre, tema şablonu değil

- **Hedef:** Kapak BACKGROUND’u, hikayenin gerçek mekânına göre oluşsun (buz, orman, uzay, deniz vb.).
- **Yöntem (seçenekler):**
  - **A)** `getEnvironmentDescription`: Kapak için (`useFullSceneDesc === false`) bile, `sceneDesc`’ten kısa bir ortam özeti türet (örn. ilk 100–150 karakter veya anahtar kelimeler: glacier, ice, space, ocean, forest). Bu özeti environment olarak kullan; özet çıkarılamazsa tema şablonuna düş.
  - **B)** Route’ta kapak için ayrı bir “cover environment” string’i üret (customRequests veya sayfa sceneContext’lerinden “glacier”, “ice”, “forest”, “space” vb. çıkar); bunu sceneInput’a yeni bir alan (örn. `coverEnvironment`) ile ver. `generateFullPagePrompt` / `getEnvironmentDescription` kapakta bu alan varsa onu kullansın.
- **Sonuç:** Buz hikayesinde BACKGROUND “glacier, ice cave, frozen landscape” gibi bir şey olur; orman hikayesinde “forest, clearing” kalabilir.

### 3.2 (Yüksek etki) Location çıkarımını hikaye ortamına göre genişlet

- **Dosya:** `lib/prompts/image/scene.ts` – `extractSceneElements` içindeki `locationKeywords`.
- **Ekle:** `glacier`, `ice`, `buz`, `uzay`, `space`, `ocean`, `deniz`, `cave`, `mağara`, `snow`, `kar` vb. hikaye ortamını yansıtan kelimeler.
- **Mantık:** Öncelik sırası düşünülebilir: önce “glacier/ice/snow” gibi güçlü ortam kelimeleri, yoksa “path/forest” gibi genel kelimeler. Böylece Buzlarla için “path” değil “glacier”/“ice” çıkar.

### 3.3 (Orta etki) “Evoke the full journey” cümlesini ortama göre yaz

- **Dosya:** `app/api/books/route.ts`
- **Şu an:** `Evoke the full journey: ${locationList}.` → locationList sadece extractSceneElements’tan (path, yol, forest…).
- **Öneri:** locationList’i genişlettikten sonra kullanmak veya “journey” cümlesini doğrudan hikaye özetinden (customRequests) türetmek: “Evoke the full journey: [glacier and ice cave / forest and clearing / …].” Böylece path/yol her zaman öne çıkmaz.

### 3.4 (Düşük / isteğe bağlı) Tema şablonlarını çeşitlendir

- `ENVIRONMENT_TEMPLATES['adventure']`: İkinci şablon zaten “mountain path, colorful wildflowers”. Adventure’ı “genel macera” gibi düşünüp, sadece tema şablonuna düşüldüğünde bile “forest” dışı seçenekler eklenebilir (örn. “rocky trail”, “open sky and distant mountains”) ki tek tip orman+çiçek kalmasın. Asıl çözüm 3.1 olmalı; bu sadece fallback çeşitliliği için.

---

## 4. Uygulama Planı ve Süreç

**Karar:** Kapak düzeltmesi **Sıra 14** olarak plana alındı; **Trace aksiyonlarından (eski 14–18) önce** yapılacak. Gerekçe: Kapak hikayeden bağımsız; sayfalar gibi story'den bilgi almalı. Sabit şablondan almamalı. Bu iş bağımsız ve kullanıcıya doğrudan fayda sağlıyor.

**Süreçteki yeri:** `docs/analysis/PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md` Bölüm 14 tablosunda **Sıra 14 – Kapak ortamı hikayeden**. Sonrasında Sıra 15–19 (Türkçe FOREGROUND, çelişkili stil, validation, A12 notu, allow relighting).

### Adımlar (uygulama sırası)

| Adım | Ne yapılacak | Dosya / not |
|------|----------------|-------------|
| 1 | Kapak için environment hikayeden türet; tema şablonunu kapakta kullanma (veya sadece fallback). | 3.1: getEnvironmentDescription kapakta sceneDesc/coverEnvironment kullanacak; route'ta coverEnvironment veya sceneDesc özeti sceneInput'a verilecek. scene.ts, route.ts |
| 2 | extractSceneElements location listesine glacier, ice, buz, space, ocean, snow, kar, cave, mağara ekle; güçlü ortam kelimelerine öncelik ver. | 3.2: scene.ts – locationKeywords genişletme + öncelik mantığı |
| 3 | (İsteğe bağlı) Evoke the full journey cümlesini genişletilmiş locationList veya hikaye özetine göre yaz. | 3.3: route.ts |
| 4 | Smoke test: Buz / orman / (veya uzay) temalı birer kitap; kapak hikaye ortamına uyuyor mu kontrol. | — |

**Test:** Kapak düzeltmesi (Sıra 14) tamamlandıktan sonra kısa smoke test (farklı ortamlarda birer kapak) yeterli. Sonrasında Sıra 15'e geçilir.

---

## 5. Sıra 14–19 ile İlişki

- Bu analiz, **Bölüm 14 (Trace takip)** ve **“tekrarlayan arka planlar”** (PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md, Bilinen konular) ile doğrudan ilgili.
- Yapılacaklar: 4. tablodaki adımlar (3.1, 3.2, istenirse 3.3) uygulanır; smoke test ile kapağın hikayeye göre değiştiği doğrulanır.

---

## 6. Kod referansları özet

- `lib/prompts/image/scene.ts`: `ENVIRONMENT_TEMPLATES`, `getEnvironmentDescription`, `extractSceneElements` (locationKeywords), `generateLayeredComposition` (BACKGROUND).
- `app/api/books/route.ts`: Kapak `coverSceneDescription`, `locations`/`locationList`, `Evoke the full journey`, `deriveCoverEnvironmentFromStory` (Sıra 14 geçici – Plan A sonrası kaldırılabilir).

---

## 7. Plan A: Story API'de coverSetting (ek LLM çağrısı yok)

**Amaç:** Kapak arka planını hardcoded kalıplara değil, hikayeyi yazan LLM'in ürettiği tek cümlelik ortam tarifine bağlamak. Doğum günü partisi, korsan gemisi, buzul, uzay vb. her konu için tek çağrıda çözüm; ek API çağrısı yok.

**Karar:** Plan A tercih edildi (ek çağrı yapmamak için). Aşağıdaki maddeler uygulandığında `deriveCoverEnvironmentFromStory` (keyword eşlemesi) kaldırılıp yerine story çıktısındaki `coverSetting` kullanılacak.

### Yapılacaklar (maddeler)

| Madde | Ne yapılacak | Dosya / not |
|-------|----------------|-------------|
| **A.1** | Story JSON şemasına üst seviye alan ekle: `coverSetting` (string, İngilizce, tek cümle). Örnek: `"glacier and ice cave, frozen landscape"`, `"birthday party room with balloons and cake"`, `"lush forest clearing with wildflowers"`. | `lib/prompts/story/base.ts`: OUTPUT FORMAT (JSON) örnek objesine `"coverSetting": "English, one sentence: setting/background only for book cover image (no characters). Cinematic. Example: 'glacier and ice cave' or 'birthday party room with balloons'"` ekle. |
| **A.2** | Story prompt’ta LLM’e talimat ver: Hikayenin geçtiği ana mekânı kapak görseli için tek cümleyle (İngilizce, sadece ortam, karakter yok) tarif etsin; `coverSetting` alanına yazsın. | `lib/prompts/story/base.ts`: OUTPUT FORMAT açıklamasına ve/veya ILLUSTRATION / CRITICAL REMINDERS bölümüne “coverSetting: one sentence, English, setting/background only for cover (e.g. glacier and ice cave, birthday party room with balloons). No character description.” ekle. |
| **A.3** | VERIFICATION CHECKLIST’e coverSetting zorunluluğu ekle (veya “REQUIRED” ifadesi). | `lib/prompts/story/base.ts`: buildVerificationChecklistSection içinde “coverSetting REQUIRED: one sentence English, setting only for cover image.” |
| **A.4** | Tip tanımı: Story çıktı tipinde (types veya interface) `coverSetting?: string` ekle; API/route’ta buna göre oku. | Proje içinde story response tipi nerede tanımlıysa (örn. `types/`, `lib/` veya route içi) `coverSetting` alanı eklenmeli. |
| **A.5** | route.ts: Kapak ortamı için önce `storyData.coverSetting` kullan; varsa `coverEnvironment = storyData.coverSetting`, yoksa fallback olarak mevcut `deriveCoverEnvironmentFromStory` (veya tema şablonu). | `app/api/books/route.ts`: `coverEnvironment = storyData?.coverSetting?.trim() || deriveCoverEnvironmentFromStory(...)`; böylece eski kitaplar / eksik alan için fallback korunur. |
| **A.6** | (İsteğe bağlı) Plan A sonrası: `deriveCoverEnvironmentFromStory` fonksiyonunu kaldır veya sadece `coverSetting` yoksa kullanılacak fallback olarak bırak. | `app/api/books/route.ts`: Uzun vadede sadece fallback olarak tutulabilir; yeni story’lerde coverSetting dolu olacak. |
| **A.7** | Doküman–kod eşitlemesi: Story şablon dokümanında (STORY_PROMPT_TEMPLATE.md) OUTPUT FORMAT ve coverSetting açıklaması güncellenmeli. | ✅ `docs/prompts/STORY_PROMPT_TEMPLATE.md`: coverSetting alanı, VERIFICATION CHECKLIST, Beklenen JSON çıktısı ve Not bölümü güncellendi (v2.4.0). |
| **A.8** | Smoke test: Farklı konularda (buz, doğum günü partisi, orman, uzay) kitap üret; kapak arka planının hikayeye uyduğunu ve coverSetting’in kullanıldığını doğrula. | Log’da `storyData.coverSetting` veya `Cover environment from story: …` ile kontrol. |

**Özet sıra:** A.1 → A.2 → A.3 → A.4 → A.5 (sonra smoke test A.8); A.6 ve A.7 uygun zamanda. İlerleme kararı bu maddelere göre verilebilir.
