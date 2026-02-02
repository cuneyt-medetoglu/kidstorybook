# Kapak Boş + Karakter Odaklı Görsel Sorunları – Analiz

**Tarih:** 24 Ocak 2026  
**Bağlam:** Arya'nın Macerası testi (3 sayfa, toddler, comic_book, fairy_tale); referans uygulama ile karşılaştırma.  
**Şu an:** Analiz tamamlandı; **Analiz tabanlı plan (Faz 1–5)** uygulandı (v1.5.0). ROADMAP 3.5.24 (tüm kitap fail) sadece madde olarak eklendi; implementasyon daha sonra.

---

## 1. Kapak fotoğrafı neden boş? (sexual / moderation_blocked)

### Log’da görülen hata

```
[Retry] ❌ Cover edits API failed with permanent error (400) - not retrying
"message": "Your request was rejected by the safety system. ... safety_violations=[sexual]."
"code": "moderation_blocked"
```

Kapak **oluşturulmaya çalışıldı** ama OpenAI **güvenlik moderasyonu** isteği reddetti. Sebep olarak `safety_violations=[sexual]` verildi.

### Neden bu durum oluştu?

- **False positive:** İçerik masum (1 yaş kız çocuğu, masal temalı kapak, master illüstrasyon referans). Gerçekten uygunsuz bir şey yok.
- **Olası tetikleyiciler:**
  - Referans görsel: Master illüstrasyon (çocuk yüzü/vücut) + “standing prominently in the center”, “looking at the viewer” gibi ifadeler.
  - Çocuk + “character centered, clear face” + bazı sahne betimlemeleri birlikte moderasyon modelinde yanlış alarm üretmiş olabilir.
- **Sonuç:** Kapak **hiç üretilmedi** → DB’de `cover_image_url` yok → UI’da kapak alanı boş. Kitap “completed” çünkü sayfa görselleri başarıyla üretilip kaydedildi; sadece kapak adımı hata verdi.

### Böyle içerik üretmiyoruz

Biz **cinsel veya uygunsuz içerik üretmiyoruz**. Kapak ve sayfa prompt'ları masal, çocuk, ortam odaklı. Hata **moderasyon false positive**; üretilen içerik masum.

### Retry davranışı (mevcut vs öneri)

**Mevcut kod (`app/api/books/route.ts`):**
- `isPermanentError(400)` → **true** → 400 **hiç retry edilmiyor**.
- `retryFetch` sadece **retryable** (502, 503, 504, 429) hatalarda tekrar deniyor.
- Kapak edits API 400 + `moderation_blocked` alınca **direkt fail**; 1 kez bile yeniden deneme yok.

**Uygulandı (v1.5.0 – 24 Ocak 2026):**
- `isModerationBlockedError()` eklendi; 400 + `moderation_blocked` / `safety_violations` tespiti.
- Cover edits API: 400 + moderation alındığında **1 kez retry** (FormData yeniden oluşturulup ikinci fetch). Yine 400 → throw.

### Diğer seçenekler (önceden not edildi)

1. **Kapak için edits yerine generations:** Referans kullanmadan `/v1/images/generations` ile denemek (karakter tutarlılığı düşer ama moderasyon tetiklenmesi farklı olabilir).
2. **Prompt yumuşatma:** “Standing prominently”, “looking at the viewer” gibi ifadeleri azaltıp daha nötr, sahne odaklı anlatım kullanmak.
3. **OpenAI’ye geri bildirim:** Request ID (`req_36e1ab9bb8f54bbfbaf8584597c19586`) ile [help.openai.com](https://help.openai.com) üzerinden “false positive” bildirimi yapmak.
4. **Kapak hatasında fallback:** Kapak API hata verirse, ilk iç sayfa görselini geçici kapak olarak kullanmak (mevcut akışta yok).

---

## 2. Görseller neden “sadece karakter odaklı” / arka plan az?

### Gözlem

- Sayfalar büyük oranda **karakter + çok az arka plan**; referans uygulamadaki gibi **alan derinliği, zengin çevre** yok.
- Karakter hâlâ sayfanın **~%40–50+** alanını kaplıyor; hedef **%25–35**.

### Olası nedenler (analiz)

| Neden | Açıklama |
|-------|----------|
| **1. Yaş grubu (toddler)** | `getAgeAppropriateSceneRules('toddler')` → **"simple background"**. Bu direktif ortamı **sade ve minimal** tutmaya iter; “zengin, detaylı çevre” ile çelişir. Referansta gördüğümüz derinlik/çevre için “simple” yerine “rich/detailed background” gerekir. |
| **2. “Character centered”** | İlk iç sayfa için tek karakterde **“Character centered”** açıkça söyleniyor. “character 25–35%”, “character off-center” ile **çelişir**; model merkezde büyük karakter çizmeye meyillidir. |
| **3. Kapak / sayfa 1 focusPoint** | Kapak `focusPoint: 'character'` → **“character centered, clear face”** + shallow DoF. Karakteri öne çıkarır; ortam ikincil kalır. (Kapak bu testte hata verdi ama mantık aynı.) |
| **4. Referans (master) yapısı** | Master illüstrasyon **portre** (yüz/üst beden, yakın plan). Edits API’ye referans olarak gidiyor. Model, referanstaki **çerçeveleyi ve ölçeği** koruma eğiliminde; sahne içinde de karakteri **büyük ve merkezde** tutabiliyor. |
| **5. FOREGROUND vurgusu** | Katmanlı yapıda **FOREGROUND** her zaman karakter aksiyonu + “main character in sharp focus”. Önce karakter, sonra ortam deniyor; model **önceliği karaktere** verip onu büyük çizebilir. |
| **6. Çocuk kitabı klişesi** | Çocuk kitabı illüstrasyonlarında **büyük, sevimli karakter** yaygın. Model bu kalıbı güçlü öğrenmiş olabilir; prompt’taki “25–35%” tek başına yeterince etkili olmuyor. |
| **7. “Wider shot” vs “clear face”** | Hem “wider shot, character smaller” hem “clear face” istiyoruz. Model **yüzü net göstermek** için karakteri büyük çizme eğiliminde; ikisi gerilim yaratıyor. |

### Yaş seçimi ile ilişki

**Evet, ilişkili olabilir.**  

- **Toddler:** “simple background” → ortam minimal.  
- **Preschool:** “clear focal point” → odak yine karakterde.  
- **early-elementary / elementary:** “detailed background”, “rich background” → ortam daha detaylı.

Toddler/preschool seçildiğinde **yaş kuralları** doğrudan **daha az çevre, daha çok karakter** üretmeye katkı ediyor. Referanstaki gibi **alan derinliği + zengin çevre** için yaş kurallarının **güncellenmesi** (ör. toddler’da “simple” → “clear but detailed environment”) veya ratio/kompozisyon kurallarının **yaştan bağımsız** güçlendirilmesi gerekir.

---

## 2.1 9 yaş testi – yaş kısıtlarını kaldırma (analiz)

### Gözlem

- **9 yaş** ile test: Sonuçlar **daha iyi**; özellikle **sayfa 2 "tam istediğim gibi"**.
- **1 yaş** ile önceki testler: Karakter daha baskın, çevre daha zayıf.

### Yaş → görsel kurallar (bizim kod)

| Yaş | ageGroup | Görsel kurallar (`getAgeAppropriateSceneRules`) |
|-----|----------|--------------------------------------------------|
| 1–3 | toddler | `simple background`, bright colors, no scary elements |
| 4–5 | preschool | `clear focal point`, bright colors, friendly |
| 6–7 | early-elementary | `detailed background`, varied colors, engaging |
| **8–9** | **elementary** | **`rich background`, sophisticated palette, visually interesting** |
| 10+ | pre-teen | complex composition, mature style, subtle details |

- Bu kurallar **doğrudan image prompt'a** ekleniyor (`scene.ts` → `ageRules.join(', ')` → `generateFullPagePrompt`).
- Kapak ve **tüm sayfa** görsellerinde kullanılıyor; `ageGroup` = `storyData.metadata?.ageGroup` (veya cover-only'da preschool).

**"Karakteri büyük yap" diye açık bir kural yok.** Etki **dolaylı**: toddler → "simple background" → ortam sade → karakter dominant; elementary (9 yaş) → "rich background" → ortam zengin → karakter-çevre dengesi daha iyi.

### Kaldırma önerisi (analiz – implementation yok)

- **Yaşa göre farklılığı kaldır:** 1 yaş da 9 yaş da **aynı** görsel kurallarla çizilsin.
- Hepsi **9 yaş (elementary) gibi** görünsün: `rich background`, `detailed` / `visually interesting` vb.
- Yani `getAgeAppropriateSceneRules` ya **yaştan bağımsız** tek set döndürsün (ör. hep elementary), ya da **görsel** tarafında ageGroup kullanımı kaldırılıp sabit "zengin çevre" kuralları kullanılsın.
- **Negative prompt** (`AGE_SPECIFIC_NEGATIVE`): Sadece **edit-image** akışında kullanılıyor; **kitap oluşturma** (cover + sayfalar) akışında **yok**. Yani "character büyük / simple background" etkisi **sadece** `getAgeAppropriateSceneRules` ve onun prompt'a eklenmesinden geliyor.

### Sonuç

- **Evet, sorun büyük oranda bizim kodda.** Yaş bazlı görsel kurallar (özellikle "simple background", "clear focal point") karakteri öne çıkarıp çevreyi zayıflatıyor.
- **9 yaş** kuralları (elementary) daha iyi sonuç veriyor; **yaş kısıtlarını kaldırıp** tüm yaşlar için aynı "zengin çevre" kurallarının kullanılması analiz önerisi.

---

## 2.2 ChatGPT vs proje – karakter oranı

- **ChatGPT** test prompt'larında **yaş kuralı yok** (simple background, clear focal point vb. yok).
- Sonuç: **Karakter daha az yer kaplıyor**, çevre daha zengin.
- **Projede** yaş kuralları var → toddler/preschool'da "simple background" / "clear focal point" → karakter daha büyük, çevre daha az.

Bu fark, **yaş kurallarının** karakter oranına etkisini doğruluyor; sorun **bizim kodda** (yaşa göre farklı görsel direktifler).

---

## 3. Özet tablo

| Konu | Durum | Olası neden |
|------|--------|-------------|
| **Kapak boş** | API 400, `moderation_blocked`, `safety_violations=[sexual]` | False positive; referans + prompt. **Uygulandı (v1.5.0):** moderation 1 retry. |
| **Kapak "sanatsal değil"** | 2 sayfa test: portrait hissi, ~%60–70 karakter | Kapak **"character centered, clear face"** ile **"epic wide", "environment-dominant"** çelişiyor. **Uygulandı (v1.6.0):** cover focusPoint → balanced. |
| **Karakter çok büyük** | ~%40–50+; hedef %25–35 | **Yaş kuralları**, "character centered", referans portre. **Uygulandı (v1.5.0):** age-agnostic rich background. |
| **Sayfa 2 karakter öne çıkmış** | 2 sayfa test: Sayfa 2 ~%40–50 | **Close-up** perspektifi kullanılıyor; "character 25–35%" ile çelişiyor. **Uygulandı (v1.6.0):** close-up kaldırıldı. |
| **Sayfa 1 "harika"** | 2 sayfa test: tam istediği gibi | **Balanced**, **NOT centered**, **wide shot**, **rule of thirds**, rich environment, deep focus. Bu kombinasyon **korunsun**. |
| **Çevre / derinlik zayıf** | Az arka plan, "sayfa sadece karakter" hissi | Yaş kuralları, karakter odaklı direktifler. |
| **ChatGPT'de karakter daha az** | AI denemelerinde oran iyi | ChatGPT prompt'unda **yaş kuralı yok**; projede var. **Sorun bizim kodda.** |
---

## 4. Sonraki adım: ChatGPT ile test prompt’ları

Bu analiz doğrultusunda **ChatGPT üzerinde denenecek** kapak ve sayfa 1 prompt’ları ayrı bir belgede hazırlandı:

- **[CHATGPT_IMAGE_TEST_PROMPTS.md](./CHATGPT_IMAGE_TEST_PROMPTS.md)**  
  - Kapak ve sayfa 1 için **sabit test prompt’ları**.  
  - Sen **master karakter görselini** ChatGPT’ye ekleyeceksin; prompt’lar **çevre/derinlik/oran** odaklı, **yaş kuralı yok**.  
  - İstediğin sonucu alana kadar bu prompt’larla deneme yap; onay verdiğinde projeye uyarlayacağız.

**Şu an:** Analiz aşamasındayız; **development yapılmıyor**. Bu analizlere göre **plan** sonra hazırlanacak.

---

## 5. 2 sayfa test (Uzay Macerası) – geri bildirim analizi (24 Ocak 2026)

**Test:** 2 sayfa, Arya, space, 3d_animation, toddler. Kapak + Sayfa 1 + Sayfa 2 üretildi.

### 5.1 Kullanıcı geri bildirimi

| Görsel | Geri bildirim |
|--------|----------------|
| **Kapak** | "Sanatsal bir havası yok. Kapak fotoğrafına çok özen göstermeliyiz. Şu anki hali çok güzel değil." |
| **Sayfa 1** | "Harika, tam istediğim gibi. Bunun olması için ne yaptık mesela?" |
| **Sayfa 2** | "Yine karakter çok öne çıkarılmış." |

### 5.2 Kapak – "Sanatsal havası yok / çok güzel değil"

**Gözlem (log + görsel açıklama):**

- Kapakta karakter **~%60–70** çerçeveyi kaplıyor; hedef **max %30–35**.
- "Character centered", "looking at the viewer", "waving" hissi; **karakter portresi** gibi, **film posteri / epik sahne** değil.
- "Reserve clear space for title at top" olsa da karakter başı üstte; başlık alanı net değil.
- Prompt’ta **"epic wide"**, **"character max 30–35%"**, **"environment-dominant"** var ama çıktı bununla uyuşmuyor.

**Neden?**

- Kapak için **`focusPoint: 'character'`** kullanılıyor (`books` route).
- **`getCompositionRules('character')`** → **"character centered, clear face"** ekliyor.
- **Çelişki:** Aynı prompt’ta hem "character centered, clear face" hem "character max 30–35%", "environment-dominant", "epic wide" var. Model **"character centered"**e daha çok uyuyor; sonuç portrait odaklı, sanatsal / poster hissi zayıf.

**Ne yapabiliriz?**

1. **Kapakta "character centered" kaldır.** Kapak için `getCompositionRules` içinde özel dal: `focus === 'character'` **ve** kapak ise → **"epic wide, character off-center, rule of thirds, character max 30–35%, environment-dominant"** kullan; **"character centered, clear face"** kullanma.
2. **Alternatif:** Kapak `focusPoint`’i **`'balanced'`** yap. Böylece "balanced composition" gelir, "character centered" gelmez. COVER bloğu zaten "epic wide", "character max 30–35%" diyor; tutarlı olur.
3. **"Sanatsal" his için:** "Storytelling composition", "cinematic poster", "character as part of the world, not a portrait" gibi net direktifler eklenebilir; öncelik "character centered"ın kaldırılması.

### 5.3 Sayfa 1 – "Harika, tam istediğim gibi"

**Bunun için ne yaptık?**

- **`focusPoint: 'balanced'`** → **"balanced composition"** (character centered yok).
- **İlk iç sayfa bloğu (v1.5.0):** "Character smaller in frame, **NOT centered**; use **rule of thirds** or **leading lines** (e.g. path)." / "Character **integrated into scene**."
- **Kamera açısı:** `getCameraAngleDirectives(1, [])` → **wide shot** (önceki sayfa yok, ilk açı "wide").
- **Yaş kuralları (v1.5.0):** Hep **rich background, detailed environment, visually interesting** (toddler olsa da).
- **Deep focus**, "environment sharp and detailed", "character 25–35%", "wider shot, character smaller".

**Sonuç:** Wide shot + balanced + **NOT centered** + rule of thirds + rich environment + deep focus → karakter ~%25–30, çevre baskın, derinlik var. Bu kombinasyon **Sayfa 1’i "tam istediğim gibi"** yapan şey.

### 5.4 Sayfa 2 – "Karakter çok öne çıkarılmış"

**Gözlem (log + görsel):**

- Sayfa 2’de karakter **~%40–50**; yine hedefin üstünde.
- **Scene analysis:** `perspective: 'close-up'`, `composition: 'right'`.
- **Prompt’ta:** `[CAMERA_PERSPECTIVE]` içinde **"close-up, balanced composition, close-up, leading lines…"** geçiyor.

**Neden?**

- **`getPerspectiveForPage`** sayfa 2 için **`close-up`** seçiyor (önceki sayfa `wide`; rotasyonla `close-up` geliyor).
- **`getCameraAngleDirectives`** de **"close-up"** veriyor.
- **Close-up** doğal olarak karakteri büyük gösterir; **"character 25–35%"**, **"wider shot, character smaller"** ile **çelişiyor**. Model close-up’a uyunca karakter yine öne çıkıyor.

**Ne yapabiliriz?**

1. **İç sayfalarda "close-up"ı kullanma.** `getCameraAngleDirectives` içindeki açı listesinden **close-up’ı çıkar** (veya iç sayfalar için ayrı liste kullan, close-up yok). Böylece hep wide / medium / low-angle / high-angle / eye-level / bird’s-eye gibi açılar kalır; "character 25–35%" ile uyumlu olur.
2. **İsteğe bağlı:** `getPerspectiveForPage` içinde de **close-up’ı** perspective listesinden çıkar; hem sahne çeşitliliği hem kamera açıları "close-up" içermesin.

### 5.5 Özet – yapılacaklar

| Konu | Sorun | Öneri | Durum |
|------|--------|--------|--------|
| **Kapak** | "Character centered, clear face" + "epic wide" çelişkisi; portrait hissi, sanatsal hava zayıf | Kapakta "character centered" **kaldır**; kapak `focusPoint` → **balanced**. | **Uygulandı (v1.6.0):** cover focusPoint → balanced. |
| **Sayfa 1** | — | Mevcut ayarlar **aynen korunsun** (balanced, NOT centered, wide, rule of thirds, rich environment). | Korundu. |
| **Sayfa 2+** | **Close-up** → karakter büyük, "character 25–35%" ile çelişiyor | İç sayfalarda **close-up’ı kaldır** (kamera açıları + perspective listesinden). | **Uygulandı (v1.6.0):** getCameraAngleDirectives, getPerspectiveForPage. |

**Story-driven clothing (Plan: Kapak/Close-up/Kıyafet):** Kıyafet hikaye ile uyumlu olsun (uzay → uzay elbisesi, su altı → mayo). **Uygulandı (v1.6.0 / Story v1.3.0):** StoryPage.clothing, SceneInput.clothing, story prompt + JSON `clothing` per page, books route clothing akışı, generateFullPagePrompt story clothing kullanımı.

---

## Referanslar

- `app/api/books/route.ts` – kapak/sayfa akışı, edits API, **retry:** `isRetryableError`, `isPermanentError`, `retryFetch`.
- `lib/prompts/image/v1.0.0/scene.ts` – `getCompositionRules`, **`getAgeAppropriateSceneRules`** (yaş → görsel kurallar), `getCharacterEnvironmentRatio`, COVER / sayfa 1 blokları.
- `lib/prompts/story/v1.0.0/base.ts` – `getAgeGroup` (yaş → toddler / preschool / elementary vb.).
- `lib/prompts/image/v1.0.0/negative.ts` – `AGE_SPECIFIC_NEGATIVE` (sadece **edit-image**’da kullanılıyor; kitap oluşturmada yok).
- [SCENE_AND_COVER_IMPROVEMENT_README.md](./SCENE_AND_COVER_IMPROVEMENT_README.md) – genel sahne/kapak iyileştirme notları.
