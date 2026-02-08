# GPT Trace Cevapları – Agent Yorumu ve Aksiyon Planı

**Tarih:** 7 Şubat 2026  
**Kaynak:** GPT’nin dört maddeye verdiği cevaplar (prompt + API + veri yapısı).

Önce GPT’nin önerilerini bizim stack ve önceliklerimize göre yorumluyorum; sonra uygulanabilir aksiyon planı var. **Önce bu dokümanı tartışalım, onayladıktan sonra koda geçelim.**

---

## 1) El / parmak anatomisi – Agent yorumu

| GPT önerisi | Uygulanabilir mi? | Yorum |
|-------------|-------------------|--------|
| **Pozitif prompt:** "each hand has exactly five distinct fingers, clearly separated, normal human hand anatomy", "well-formed hands, properly proportioned fingers" | ✅ Evet | Mevcut `[ANATOMY] 5 fingers each hand separated...` kısa; GPT’nin ifadesi daha açıklayıcı. Ekleyebiliriz; çok uzun olursa tek cümle seçip kullanırız. |
| **Negatif prompt:** "no extra or missing fingers, no fused or deformed fingers", "extra fingers" (6 parmak demeden) | ✅ Evet | Şu an negatifte sadece "deformed", "extra limbs", "holding hands" var. "extra fingers", "missing fingers", "fused fingers" eklemek mantıklı; GPT de "6 fingers" yerine "extra fingers" diyor (priming riski aynı görüş). |
| ControlNet / el iskeleti | ❌ Hayır | Biz OpenAI GPT Image 1.5 (edits/generations) kullanıyoruz; Stable Diffusion / ControlNet yok. Bu öneriyi atlıyoruz. |
| Inpainting ile el düzeltme | ⏸️ İleride | API’mizde şu an yok; ileride el-only crop + yeniden üretim düşünülebilir. |
| Birden fazla varyasyon üret, en iyisini seç | ⏸️ Opsiyonel | Maliyet 2–4x artar; şimdilik prompt iyileştirmesiyle yetinelim, gerekirse sonra ekleriz. |
| MediaPipe ile el kontrolü + retry | ⏸️ İleride | İlginç ama: görsel API’den gelen çıktıyı analiz etmek, parmak sayma, retry döngüsü ek iş. Önce prompt değişikliklerini deneyelim; kalite hâlâ yetersizse bu mimari adımı düşünürüz. |
| Anatomi bileşenlerini config’te tutma | ✅ Zaten var | `lib/prompts/image/negative.ts` ve scene.ts’te zaten yapılandırılmış; sadece metinleri güncelleyeceğiz. |

**Özet:** Hemen yapılacak: pozitif ve negatif prompt’a el/parmak ifadelerini eklemek (GPT’nin verdiği cümlelerin sadeleştirilmiş hali). ControlNet/inpainting/multi-variant/MediaPipe’ı şimdilik atlıyoruz veya “ileride” bırakıyoruz.

---

## 2) Sayfa görsel tekrarı (kompozisyon / hareket çeşitliliği) – Agent yorumu

| GPT önerisi | Uygulanabilir mi? | Yorum |
|-------------|-------------------|--------|
| **LLM prompt:** "Her sayfa farklı poz/eylem", "Arka arkaya iki sayfada benzer poz TEKRARLANMAMALI", "ortam ve zaman değişmeli" | ✅ Evet | Şu an "Each page = different scene", "Vary location, time of day, perspective, composition, action" var ama “arka arkaya benzer poz yasak” kadar net değil. LLM prompt’una açık tekrar yasağı ve örnek (koşma → oturma, zıplama → etrafa bakma) ekleyebiliriz. |
| **Görsel prompt:** "[VARIETY] This scene's composition and pose are distinct from the previous page", "NOT the same pose as other pages" | ✅ Evet | Zaten `getSceneDiversityDirectives(lastScene)` ile "DIVERSITY: Change location (was: X), perspective (was: Y)" veriyoruz. Buna ek olarak sabit bir cümle ekleyebiliriz: "This scene's composition and character pose must be clearly different from the previous page." |
| Önceki sayfanın anahtar kelimelerini negatif vermek | ⚠️ Dikkatli | "not standing in forest like previous page" gibi ifadeler yanlış çağrışım yaratabilir. Önce sabit [VARIETY] cümlesi ve LLM çeşitliliğini güçlendirmek yeterli olabilir; negatif önceki-sayfa kelimelerini sonra deneriz. |
| **Veri:** lastScene = {pose, camera, location}, benzerlik yüksekse çeşitlilik iste | ✅ Kısmen var | `SceneDiversityAnalysis` ve `previousScenes` zaten kullanılıyor. İstersek lastScene’i daha yapılandırılmış tutup (pose, camera, location) karşılaştırma ve “benzerse uyarı” ekleyebiliriz; bu ikinci aşama (önce prompt güçlendirmesi). |

**Özet:** Hemen: LLM’de “arka arkaya benzer poz/eylem tekrarlanmasın” + örnekler; görsel prompt’a “[VARIETY] … distinct from previous page” benzeri net cümle. İleride: lastScene karşılaştırma ve otomatik çeşitlilik uyarısı.

---

## 3) customRequests boşken zayıf kalite – Agent yorumu

| GPT önerisi | Uygulanabilir mi? | Yorum |
|-------------|-------------------|--------|
| **Prompt:** "Eğer Special Requests yoksa, yaş ve temaya uygun zenginleştir", "No special request provided – please enhance with unique twist or educational element" | ✅ Evet | Basit ve etkili. customRequests boşken prompt’ta "None" yerine veya ek olarak bu talimatı koyarız. |
| **API:** customRequests == "" iken tema+yaş tablosundan varsayılan metin enjekte et | ✅ Evet | Backend’de boşsa bir `getDefaultSpecialRequest(theme, ageGroup)` ile sabit metin döndürüp prompt’a yazarız. Ek LLM çağrısı yapmaya gerek yok; basit tablo/object yeterli. |
| **Veri:** defaultSuggestions[theme][ageGroup], genişletilebilir yapı | ✅ Evet | Başta kod içi object (theme → metin veya theme+ageGroup → metin); ileride DB’ye taşınabilir. storyMetadata.defaultIdeaUsed gibi bayrak opsiyonel (analytics için). |

**Özet:** Üçü de uygulanabilir: (1) Prompt’ta “boşsa zenginleştir” talimatı, (2) Boşken varsayılan metin enjekte et (tablo/config), (3) defaultSuggestions yapısı (kod içi, ileride DB).

---

## 4) Yaşa göre metin hacmi (kelime sayısı) – Agent yorumu

| GPT önerisi | Uygulanabilir mi? | Yorum |
|-------------|-------------------|--------|
| **Hedefler:** toddler 10–20, preschool 30–40, early-elem 50–70, elementary 80–100, pre-teen 120–150 | ✅ Ayar gerekir | Sen “en küçük ~3x, en büyük 150–180” demiştin. GPT 120–150 diyor pre-teen için; 150–180’e çekebiliriz. Öneri: toddler 30–45, preschool 45–65, early-elementary 70–95, elementary 95–125, pre-teen 130–180 (senin hedefinle uyumlu). |
| **LLM prompt:** "Target words per page: X–Y", "CRITICAL: Each page's text must be at least X words" | ✅ Evet | Şu an "Target words per page: ${wordTarget}" var; "CRITICAL: Each page text must be at least [min] words" ekleyip wordTarget’ı yukarıdaki aralıklara güncelleyeceğiz. |
| **Post-process:** Sayfa başı kelime say, alt sınırın çok altındaysa repair (LLM’e “bu sayfayı X kelimeye genişlet”) veya wordCountWarning | ✅ Evet | Mevcut story validator + repair yapısına benzer: JSON’da pages[].text kelime sayılır, min’in epey altındaysa (örn. min 30, sayfa 8 kelime) o sayfa için repair prompt’u ile LLM’i tekrar çağırıp sadece o sayfayı uzatırız; veya en azından storyMetadata.wordCountWarning = true döneriz. Otomatik repair tercih edilebilir (kullanıcıya sayfa dolu görünsün). |

**Özet:** Kelime hedeflerini yükseltip prompt’a net “CRITICAL: at least X words” ekliyoruz; sonrasında post-process ile kelime sayımı + isteğe bağlı repair veya uyarı ekliyoruz.

---

## Aksiyon planı (tartış sonrası uygulama)

Aşağıdaki sırayla yapılabilir. Onayladığın maddeleri “uygula” diyerek koda geçebiliriz.

### A) El / parmak (prompt)

| # | Yapılacak | Dosya / yer |
|---|-----------|-------------|
| A1 | Pozitif anatomi: Mevcut `getAnatomicalCorrectnessDirectives()` çıktısına “each hand exactly five distinct fingers, clearly separated, normal hand anatomy” veya “well-formed hands, properly proportioned fingers” ekle (tek cümle, token tasarrufu için kısaltılabilir). | `lib/prompts/image/negative.ts` (getAnatomicalCorrectnessDirectives) veya scene.ts’te anatomi kısmı |
| A2 | Negatif: ANATOMICAL_NEGATIVE listesine "extra fingers", "missing fingers", "fused fingers" ekle ("no" prefix’siz, sadece terim). | `lib/prompts/image/negative.ts` |

### B) Sayfa çeşitliliği (prompt)

| # | Yapılacak | Dosya / yer |
|---|-----------|-------------|
| B1 | LLM: "VISUAL DIVERSITY" veya "STORY STRUCTURE" bölümüne: Arka arkaya iki sayfada aynı veya çok benzer poz/eylem kullanılmamalı; her sayfada farklı hareket/kompozisyon (ör. biri koşuyorsa sonraki oturuyor veya bakıyor). İstersen örnek cümle: "Do NOT repeat the same pose or action on consecutive pages; vary pose and composition (e.g. one page running, next page sitting or looking around)." | `lib/prompts/story/base.ts` (buildVisualDiversitySection veya buildStoryStructureSection) |
| B2 | Görsel: generateFullPagePrompt içinde buildSceneDiversitySection’a ek olarak sabit bir cümle: "This scene's composition and character pose must be clearly different from the previous page." (previousScenes varken eklenir.) | `lib/prompts/image/scene.ts` (buildSceneDiversitySection veya generateFullPagePrompt) |

### C) customRequests boşken

| # | Yapılacak | Dosya / yer |
|---|-----------|-------------|
| C1 | Prompt: customRequests boşken "Special Requests: None" yerine (veya ek olarak) şu talimat: "No special request was provided. Enhance the story with age- and theme-appropriate details (e.g. a small magical twist, an educational moment, or a memorable character moment)." | `lib/prompts/story/base.ts` (buildStoryRequirementsSection) |
| C2 | Backend: customRequests boş veya whitespace ise `getDefaultSpecialRequest(theme, ageGroup)` ile varsayılan metin al; bunu prompt’un Special Requests kısmına yaz. Başta tema bazlı (ve isteğe yaş bazlı) basit bir object (defaultSuggestions). | Yeni: `lib/prompts/story/default-requests.ts` veya config; çağrı: `app/api/ai/generate-story/route.ts` ve `app/api/books/route.ts` (story oluşturulurken) |

### D) Yaşa göre kelime sayısı

| # | Yapılacak | Dosya / yer |
|---|-----------|-------------|
| D1 | Kelime hedeflerini güncelle: toddler 30–45, preschool 45–65, early-elementary 70–95, elementary 95–125, pre-teen 130–180. | `lib/prompts/story/base.ts` (getWordCountRange) |
| D2 | LLM prompt’ta "Target words per page" satırına ek: "CRITICAL: Each page's text must be at least [min] words for this age group." (min = getWordCountRange’ten gelen aralığın sol değeri.) | `lib/prompts/story/base.ts` (buildStoryRequirementsSection veya buildWritingStyleSection) |
| D3 | Post-process (opsiyonel ama önerilen): Story JSON döndükten sonra her sayfa için pages[i].text kelime sayısını hesapla; yaş grubuna göre min’in belirgin altında kalan sayfalar varsa (örn. min 30, sayfa &lt; 15 kelime) ya (a) o sayfalar için repair prompt’u ile LLM’i tekrar çağırıp sadece o sayfanın metnini genişlet, ya da (b) en azından response’a wordCountWarning veya shortPages listesi ekle. | `app/api/ai/generate-story/route.ts` (validator/repair sonrası) ve/veya `app/api/books/route.ts` (story alındıktan sonra) |

---

## Özet tablo

| Konu | Hemen uygula | İleride / opsiyonel |
|------|----------------|---------------------|
| 1) Parmak | A1, A2 (prompt) | MediaPipe, inpainting, multi-variant |
| 2) Tekrar | B1, B2 (LLM + görsel prompt) | lastScene karşılaştırma, otomatik uyarı |
| 3) customRequests | C1, C2 (prompt + varsayılan metin) | defaultSuggestions DB’ye taşıma, defaultIdeaUsed analytics |
| 4) Kelime | D1, D2, D3 (hedef + CRITICAL + post-process) | Kelime repair’i zorunlu mu opsiyonel mi senin tercihin |

---

Tartışmak istediğin satır veya maddeyi söyle; değiştiririz. Onayladığında “uygula” dersen A1–A2, B1–B2, C1–C2, D1–D2–D3’ü sırayla koda uygularım.

---

## Uygulama Durumu (7 Şubat 2026)

| Madde | Durum |
|-------|--------|
| **A1, A2** (El/parmak) | Yapıldı. Pozitif: getAnatomicalCorrectnessDirectives güncellendi; negatif: extra/missing/fused fingers eklendi. |
| **B1** (Story çeşitlilik) | Yapıldı. buildVisualDiversitySection: ardışık sayfada aynı poz/eylem tekrarlanmasın talimatı eklendi. |
| **C1, C2** (customRequests) | Roadmap eklendi: 3.5.29 DO, Bekliyor (PHASE_3_BACKEND_AI.md). |
| **D1, D2, D3** (Kelime) | Yapıldı. getWordCountRange/getWordCountMin; CRITICAL satır; generate-story kelime repair pass. |
