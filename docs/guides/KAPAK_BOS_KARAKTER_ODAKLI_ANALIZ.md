# Kapak Boş + Karakter Odaklı Görsel Sorunları – Analiz

**Tarih:** 24 Ocak 2026  
**Bağlam:** Arya'nın Macerası testi (3 sayfa, toddler, comic_book, fairy_tale); referans uygulama ile karşılaştırma.  
**Şu an:** Sadece **analiz**. Development yapılmıyor; plan bu analizlere göre sonra hazırlanacak.

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

**Öneri (analiz – implementation yok):**
- `moderation_blocked` / `safety_violations` (**400**) alındığında **1 kez retry** yap.
- Aynı 400 yine gelirse **fail**; kullanıcı kitabı yeniden oluşturabilir.
- Gerekçe: False positive sık değil; bazen ağ/modeller geçici farklı cevap verebiliyor. 1 retry, gereksiz yere kapak kaybını azaltır.

Bu değişiklik için `isPermanentError` veya retry mantığında **400 + moderation_blocked** istisna olarak ele alınmalı; sadece bu durumda 1 retry, sonra permanent sayılmalı.

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
| **Kapak boş** | API 400, `moderation_blocked`, `safety_violations=[sexual]` | False positive; referans + prompt. **Retry:** 400 şu an permanent → retry yok; öneri: moderation_blocked için **1 retry**. |
| **Karakter çok büyük** | ~%40–50+; hedef %25–35 | **Yaş kuralları** (simple background, clear focal point), "character centered", referans portre, FOREGROUND vurgusu. **9 yaş testi** daha iyi → yaş kısıtları kaldırma önerisi. |
| **Çevre / derinlik zayıf** | Az arka plan, "sayfa sadece karakter" hissi | Aynı maddeler; özellikle **yaş kuralları** (simple background) ve karakter odaklı direktifler. |
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

## Referanslar

- `app/api/books/route.ts` – kapak/sayfa akışı, edits API, **retry:** `isRetryableError`, `isPermanentError`, `retryFetch`.
- `lib/prompts/image/v1.0.0/scene.ts` – `getCompositionRules`, **`getAgeAppropriateSceneRules`** (yaş → görsel kurallar), `getCharacterEnvironmentRatio`, COVER / sayfa 1 blokları.
- `lib/prompts/story/v1.0.0/base.ts` – `getAgeGroup` (yaş → toddler / preschool / elementary vb.).
- `lib/prompts/image/v1.0.0/negative.ts` – `AGE_SPECIFIC_NEGATIVE` (sadece **edit-image**’da kullanılıyor; kitap oluşturmada yok).
- [SCENE_AND_COVER_IMPROVEMENT_README.md](./SCENE_AND_COVER_IMPROVEMENT_README.md) – genel sahne/kapak iyileştirme notları.
