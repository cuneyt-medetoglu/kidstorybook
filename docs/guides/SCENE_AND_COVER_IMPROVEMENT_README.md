# Sahne Kompozisyonu, Kapak–İlk Sayfa Benzerliği ve Görsel Kalite İyileştirmesi

**Tarih:** 24 Ocak 2026  
**Durum:** Analiz tamamlandı · Geliştirme öncesi planlama  
**Format:** README (analiz, ilerleme, denemeler tek dokümanda)

---

## 📋 İçindekiler

1. [Hedef ve ROADMAP Bağlamı](#hedef-ve-roadmap-bağlamı)
2. [Problem Tanımı](#problem-tanımı)
3. [Durum Analizi](#durum-analizi)
4. [Soru–Cevap Araştırması](#sorucevap-araştırması)
5. [Kök Neden Analizi: Prompt mu, Model mi?](#kök-neden-analizi-prompt-mu-model-mi)
6. [İstenen vs Mevcut Karşılaştırma](#istenen-vs-mevcut-karşılaştırma)
7. [İlerleme ve Denemeler](#ilerleme-ve-denemeler)
8. [Kapak ve Oran – Sonraki İyileştirme Analizleri](#kapak-ve-oran--sonraki-iyileştirme-analizleri)
9. [Sonraki Adımlar](#sonraki-adımlar)
10. [Referanslar](#referanslar)

---

## Hedef ve ROADMAP Bağlamı

### Amaç

- **Hedef:** İstenen örnekteki gibi **sahne detayları zengin**, **karakter–ortam dengesi iyi**, “gerçek bir fotoğraf gibi” his veren görseller üretmek.
- **Öncelik:** Önce **genel görsel iyileştirme** (sahne/derinlik/kompozisyon), sonra **kapak–ilk sayfa benzerliği** düzeltmesi.

### İlgili ROADMAP Maddeleri

| ID | Başlık | Öncelik | Not |
|----|--------|---------|-----|
| **3.5.19** | Görsel Kompozisyon İyileştirmesi | — | Sahne ve derinlik kompozisyon eklendi; daha da geliştirilebilir. **Önce bu konuya bakılacak.** |
| **3.5.20** | Kapak ve İlk Sayfa Benzerliği Düzeltmesi | 🔴 YÜKSEK | Kapak ile 1.–2. sayfa çok benzer; farklı kompozisyon, sayfa çeşitliliği gerekli. |

**Sıra:** Önce 3.5.19 (genel görsel/sahne iyileştirmesi) → sonra 3.5.20 (kapak–ilk sayfa farklılaştırma).

---

## Problem Tanımı

### Kullanıcı Gözlemi

- **Mevcut görseller:** Karakterler sahnenin **çok büyük bölümünü** kaplıyor; arka plan ve ortam **ikincil** kalıyor.
- **İstenen örnek:** Sahneler daha **güzel**, **gerçek bir fotoğraf gibi**; karakter ortamla **entegre**, ortam da **detaylı ve anlamlı**.

### Özet

| | Bizim örnekler | İstenen örnek |
|--|----------------|----------------|
| **Odak** | Neredeyse sadece karakter | Karakter + ortam birlikte |
| **Ortam** | Zayıf, bulanık veya basit | Detaylı, derinlikli, “fotoğraf gibi” |
| **Kompozisyon** | Karakter önde, sahne arkada | Karakter sahneye yerleşmiş, denge iyi |

### Paylaşılan Görsel Örnekleri (Özet)

- **Problemli:** Baba–kız pasta; kız orman yolu; kız çiçek tarlası → karakter büyük, arka plan sönük.
- **İstenen:** Çocuk + tırtıl bahçe/ormanda → karakter daha küçük, çevre (bitkiler, ışık, yapraklar) zengin.
- **Referans kitap (kamp):** Araba içi aile; dere kenarı çadır; çadır içi; orman yolu çöp toplama; kamp ateşi; yıldızlara bakma → karakter–ortam dengesi iyi, arka plan detaylı.

---

## Durum Analizi

### 1. Mevcut Görsel (Image) Prompt Yapısı

**Dosya:** `lib/prompts/image/v1.0.0/scene.ts` (v1.2.0)

- **Anatomical directives** (en başta)
- **Composition & depth:** `getDepthOfFieldDirectives`, `getAtmosphericPerspectiveDirectives`
- **Lighting & atmosphere:** `getLightingDescription` (timeOfDay, mood)
- **Camera & perspective:** `getCameraAngleDirectives`, `getCompositionRules`
- **Character–environment ratio:** `getCharacterEnvironmentRatio` → **“character 30–40%, environment 60–70%”**
- **Style**, **layered composition** (foreground/midground/background), **scene prompt**, **age rules**, **cover/consistency**, **clothing**, **no text**

**focusPoint kullanımı:**

- **Sayfa 1:** `character` → “character centered, clear face” + **shallow DoF** (background softly out-of-focus, bokeh).
- **Son sayfa:** `balanced`.
- **Diğer sayfalar:** `balanced`.
- **Kapak:** `character` (aynı mantık).

**DoF (Depth of Field):**

- `character`: 50mm f/1.4, shallow DoF, **arka plan yumuşak bokeh**.
- `balanced`: 35mm f/4, medium DoF, **karakter net, arka plan yumuşak blur**.
- `environment`: 24mm f/11, deep focus, ön–orta–arka plan net.

### 2. Hikaye (Story) Üretimi

- **Books route** (`POST /api/books`): Varsayılan **`gpt-3.5-turbo`** (`storyModel` parametresi ile değiştirilebilir).
- **Generate-story API** (`POST /api/ai/generate-story`): **`gpt-4o`** sabit.
- Create Book akışı **books route** üzerinden çalışıyor → fiilen **3.5-turbo** kullanılıyor (değiştirilmezse).

**Story prompt:**

- `sceneDescription` (150+ karakter), `imagePrompt` (200+ karakter) isteniyor.
- Lokasyon, zaman, hava, perspektif, kompozisyon, ortam detayları talep ediliyor.
- “Show, don’t tell”, duyusal detaylar, örnek metinler mevcut.

### 3. Görsel Üretimi

- **Model:** `gpt-image-1.5` (sabit).
- **Boyut:** `1024x1536` (portrait).
- **Kalite:** `low`.
- **Referans:** Karakter(ler) referans fotoğraf(ları) + isteğe göre kapak; Cover-as-Reference yaklaşımı.

### 4. Tespit Edilen Çelişkiler

1. **Oran vs DoF:** “Character 30–40%, environment 60–70%” diyoruz ama `character` ve `balanced` için **arka planı blur** istiyoruz. İstenen örnekte arka plan **net ve detaylı**.
2. **Sayfa 1 + kapak:** İkisi de `focusPoint: character` → benzer kompozisyon (kapak–ilk sayfa benzerliği).
3. **Referans görsel:** Karakter odaklı girdi, modeli karakteri büyük ve önde çizmeye teşvik ediyor olabilir.

---

## Soru–Cevap Araştırması

### 1) Bu işin sebebi yeterince iyi prompt veremiyor olmamız olabilir mi?

**Kısmen evet.**

- **Var olanlar:** Oran (30–40 / 60–70), katmanlı kompozisyon, ışık, kamera, atmosferik perspektif direktifleri.
- **Eksikler / çelişkiler:**
  - DoF ile “detaylı arka plan” aynı anda istenmiyor; pratikte **blur** öne çıkıyor.
  - “Character centered, clear face” özellikle sayfa 1 ve kapakta **karakteri büyütüyor**.
  - Ortamın **net ve fotoğraf benzeri** olması prompt’ta yeterince vurgulanmıyor; “illustration style (NOT photorealistic)” ile de çelişebilir.

**Öneri:** Prompt’u güncelle: **derinlikli net ortam** + **karakter–ortam dengesi** daha açık olsun; DoF ve “character centered” kullanımını gözden geçir (en azından sayfa 1 ve kapak için).

---

### 2) Kullandığımız hikaye ve görsel için GPT-3.5-turbo ile ilgili bir konu olabilir mi? 4o veya farklı bir şey kullansak bu şikâyetler geçer mi?

**Evet, ilgili olabilir.**

- **Create Book** akışında hikaye **`gpt-3.5-turbo`** ile üretiliyor.
- **`gpt-4o`**:
  - Daha zengin ve tutarlı `sceneDescription` / `imagePrompt` üretebilir.
  - Lokasyon, ışık, nesneler, duyusal detaylar konusunda daha iyi olabilir.
- Görsel **doğrudan** GPT-3.5/4o ile üretilmiyor; **gpt-image-1.5** kullanılıyor. Ancak **girdi kalitesi** (story → scene/image prompt) görsel kaliteyi etkiliyor. Daha iyi story/prompt → daha iyi görsel potansiyeli.

**Öneri:** Story tarafında **`gpt-4o`** (veya 4o-mini) denemek mantıklı. En azından A/B test ile 3.5-turbo vs 4o karşılaştırılabilir.

---

### 3) GPT-3.5-turbo yerine önerdiğin bir şey olursa, maliyeti ne oranda artar?

**Kabaca (token başına):**

| Model | Input ($/1M token) | Output ($/1M token) | Input (3.5’e göre) | Output (3.5’e göre) |
|-------|---------------------|----------------------|---------------------|----------------------|
| **gpt-3.5-turbo** | ~$0.50 | ~$1.50 | 1x | 1x |
| **gpt-4o** | ~$2.50 | ~$10.00 | ~5x | ~6.7x |
| **gpt-4o-mini** | Daha düşük | Daha düşük | 3.5 ile 4o arası | 3.5 ile 4o arası |

- **Story başına** token sayısı aynı kabul edilirse, 4o’ya geçiş **roughly 5–7x** maliyet artışı getirir (story üretimi için).
- Görsel maliyeti (gpt-image-1.5) değişmez; sadece **story model** değişir.

**Öneri:** Maliyet hassas ise önce **prompt iyileştirmesi**; ardından **4o-mini** veya **4o** ile kısa süreli test, sonra karar.

---

## Kök Neden Analizi: Prompt mu, Model mi?

### Özet Tablo

| Faktör | Etki | Açıklama |
|--------|------|----------|
| **Prompt** | **Yüksek** | Oran direktifleri var; fakat DoF “blur” ve “character centered” ile çelişiyor. Net, detaylı ortam yeterince vurgulanmıyor. |
| **Story model (3.5 vs 4o)** | **Orta** | 3.5-turbo daha zayıf scene/image prompt üretebilir; 4o ile daha zengin sahneler mümkün. |
| **Image model (gpt-image-1.5)** | **Orta** | Sabit; referans görsel + “character first” prompt’lar karakteri öne çıkarıyor olabilir. Model değiştirmeden önce prompt ve story iyileştirmesi yapılmalı. |

### Sonuç

- **Asıl kaldıraç:** **Prompt** (kompozisyon, DoF, oran, ortam netliği, sayfa 1/kapak farklılaştırma).
- **Destekleyici:** **Story model** (4o/4o-mini) → daha iyi sahne açıklamaları.
- **Şu an odak:** Model değişikliğinden önce **prompt ve akış** (focusPoint, DoF, kapak–sayfa 1 ayrımı) iyileştirilmeli.

---

## İstenen vs Mevcut Karşılaştırma

### İstenen Örnek Özellikleri

- Karakter **küçük–orta** boyutta; çerçevenin **tamamını** doldurmuyor.
- **Ortam net ve detaylı:** bitkiler, ışık, gölgeler, su, çiçekler, yapraklar.
- **Derinlik:** ön–orta–arka plan ayrımı belirgin; “fotoğraf gibi” his.
- Karakter **sahneye yerleşmiş**; sahne sadece dekor değil, **anlamlı bir dünya**.

### Mevcut Prompt’un Karşılığı

- **Oran:** 30–40 / 60–70 → **hedef doğru**, ama uygulamada yetersiz kalıyor.
- **DoF:** Character/balanced için **blur** → istenen **net, detaylı ortam** ile **çelişiyor**.
- **Sayfa 1 & kapak:** İkisi de `character` → **çok benzer** (3.5.20 konusu).
- **“Illustration, NOT photorealistic”** → “gerçek fotoğraf gibi” hedefi ile **çelişebilir**; en azından **ortam detayı** açısından netleştirilmeli.

---

## Uygulama Planı (Faz 1–2–3)

**lib/prompts ve docs/prompts:** Tüm iyileştirmelerde bu klasörler güncellenecek. Her kod değişikliği → version bump, CHANGELOG entry, template dokümantasyon sync ([VERSION_SYNC_GUIDE](docs/prompts/VERSION_SYNC_GUIDE.md)).

| Faz | Özet |
|-----|------|
| **Faz 1** | Story model → gpt-4o-mini (books route, generate-story API, Create step6). |
| **Faz 2** | DoF/oran net ortam; sayfa 1 focusPoint → balanced; scene v1.3.0; docs/prompts. |
| **Faz 3** | Kapak–sayfa 1 farklılaştırma (image + story); story v1.2.0; docs/prompts. |
| **Test sonrası** | Create Book ile tam kitap; gpt-4o-mini, karakter–ortam dengesi, kapak–sayfa 1 farkı kontrolü; sonuçlar bu README’e işlenir. |

---

## İlerleme ve Denemeler

### Yapılanlar

- [x] ROADMAP 3.5.19 / 3.5.20 bağlamı netleştirildi.
- [x] Mevcut scene/character/image prompt yapısı incelendi.
- [x] Story (books) vs generate-story API model farkı tespit edildi.
- [x] DoF / oran / focusPoint çelişkileri not edildi.
- [x] Soru–cevap (prompt, model, maliyet) araştırıldı.
- [x] Kök neden (prompt > story model > image model) özetlendi.
- [x] Bu README oluşturuldu.
- [x] **Faz 1:** Story model → gpt-4o-mini (books route, generate-story API, Create step6).
- [x] **Faz 2:** DoF/oran net ortam; sayfa 1 focusPoint → balanced; scene v1.3.0; docs/prompts.
- [x] **Faz 3:** Kapak–sayfa 1 farklılaştırma (image + story); story v1.2.0; docs/prompts.

### Planlanan / Yapılacak Denemeler

*(Geliştirme ve testler ilerledikçe buraya kısa notlar eklenecek.)*

| # | Tarih | Deneme | Sonuç / Not |
|---|--------|--------|-------------|
| 1 | 24 Ocak 2026 | focusPoint sayfa 1 → balanced; DoF balanced için deep focus, sharp background (Faz 2) | Tamamlandı. |
| 2 | 24 Ocak 2026 | detailed, sharp background, getCharacterEnvironmentRatio güçlendirme (Faz 2) | Tamamlandı. |
| 3 | 24 Ocak 2026 | Kapak vs sayfa 1 farklı composition/camera (Faz 3) | Tamamlandı. |
| 4 | 24 Ocak 2026 | Story model → gpt-4o-mini (Faz 1) | Tamamlandı. |
| 5 | 24 Ocak 2026 | Karakter oranı 25–35%, max 35%, wider shot (scene v1.4.0) | Tamamlandı. |
| 6 | 24 Ocak 2026 | Kapak poster, epic wide, dramatic lighting, story-based cover (v1.4.0) | Tamamlandı. |

### İlerleme Notları

*(Kısa maddeler halinde güncel gelişmeler buraya eklenecek.)*

- **24 Ocak 2026:** Faz 1–2–3 test (3 sayfa, Arya, educational, kawaii). Karakter–ortam dengesi ve net ortam iyileşti; kapak–sayfa 1 farkı var ama “aşırı” değil. Custom request boş; hikaye yine de detaylı, görsel kalitesi iyi.
- **24 Ocak 2026:** v1.4.0 uygulandı (karakter oranı 25–35%, max 35%, wider shot; kapak poster, epic wide, dramatic lighting, story-based cover). Create Book ile test yapılacak; sonuçlar bu bölüme işlenecek.
- **24 Ocak 2026:** Kapak boş (moderation_blocked, safety_violations=[sexual] false positive) + karakter odaklı çıktı analizi yapıldı. Nedenler: toddler "simple background", "character centered", referans portre, FOREGROUND vurgusu. [KAPAK_BOS_KARAKTER_ODAKLI_ANALIZ.md](./KAPAK_BOS_KARAKTER_ODAKLI_ANALIZ.md) ve ChatGPT test prompt'ları [CHATGPT_IMAGE_TEST_PROMPTS.md](./CHATGPT_IMAGE_TEST_PROMPTS.md) eklendi.
- **24 Ocak 2026:** Analiz güncellendi: (1) Sexual hata → böyle içerik üretmiyoruz; öneri: moderation_blocked için **1 retry**. (2) 9 yaş testi daha iyi, sayfa 2 "tam istediğim gibi"; yaş kısıtları kaldırma önerisi (1 yaş da 9 yaş da aynı görsel kurallar). (3) ChatGPT'de karakter daha az → yaş kuralı yok; sorun bizim kodda. **Sadece analiz; development yok.**

---

## Kapak ve Oran – Sonraki İyileştirme Analizleri

**Tarih:** 24 Ocak 2026  
**Amaç:** Test sonrası geri bildirime göre (1) karakter oranını ~%50’den düşürmek, (2) kapak görselini “tüm kitabı anlatan” özel, göz alıcı bir poster haline getirmek.  
**Durum:** Analiz dokümantasyona alındı. **Uygulama planı uygulandı (Faz 1–2–3).** Test ve sonuç kaydı yapılacak.

---

### 1. Karakter Oranı (~%50 → Daha Az)

**Mevcut:**
- Prompt’ta **"character 30–40%, environment 60–70%"** (`getCharacterEnvironmentRatio` + `getCompositionRules`).
- Çıktılar hâlâ **~%40–50** karakter; model üst sınıra yakın çiziyor.
- Kapakta **focusPoint: 'character'** + “character centered, clear face” + shallow DoF → karakter daha da öne çıkıyor.

**Oranı azaltmak için seçenekler:**

| Seçenek | Ne yapılır | Artı / eksi |
|--------|------------|-------------|
| **A) Oranı sıkılaştır** | "25–35% character, 65–75% environment" veya "character **must NOT exceed 35%** of frame" | Net hedef; model yine üst sınıra çekebilir. |
| **B) "Wider" vurgusu** | "Wider shot", "pull back to show more environment", "character **smaller in frame**" | Kompozisyonu genişletir, oranı dolaylı düşürür. |
| **C) Tek cümle yasağı** | "Character **must not occupy more than half** the frame" | Çok net; %50’yi aşmayı engellemek için uygun. |
| **D) Kapak / iç ayrımı** | İç sayfalar 25–35%; kapak “epic wide” ile 30–35% (ör. Valley referansı gibi) | Kapak özel mantığıyla uyumlu. |

**Öneri (analiz):** A + B + C birlikte kullanılabilir: oran 25–35%, “wider shot / character smaller”, “character not more than 35% (veya half) of frame”. Kapak için ayrı oran (D) isteğe bağlı.

---

### 2. Kapak = Tüm Kitabı Anlatan, Göz Alıcı Özel Görsel

**Referans (örn. Valley of Ancient Courage):**
- İki çocuk kayalıkta, **vadiye / dünyaya** bakıyor; dinazorlar, uçan sürüngenler, puslu vadi.
- Karakterler **~%30–35**, ortam **%65–70**; **epic wide**, **panoramik**.
- Tek kare **tüm macerayı** anlatıyor: keşif, cesaret, “nerede olacak hikaye”.
- Başlık için üstte net alan; **poster / film afişi** hissi.

**Bizde şu an:**
- **Cover scene description** (books route): “A magical book cover… title… theme… main character **prominently in center**… inviting whimsical background… **essence of story**… space for title… vibrant warm colors.”
- **scene.ts COVER bloğu:** “Reference for all pages… Match photos… All characters prominent… Professional, print-ready… Cover composition different from first interior.”
- **Eksikler:**
  - “**Tüm kitabı** özetle” / “**poster for entire book**” vurgusu yok.
  - “**Epic wide / panoramic**”, “**poster-like / movie-poster**” yok.
  - “**Dramatic lighting**” (golden hour, güneş ışınları vb.) yok.
  - Kapak **hikâye içeriğinden** türetilmiyor; sadece **title + theme** var. Lokasyonlar, yolculuk, temel sahneler kullanılmıyor.

**Kapak için yapılabilecekler:**

| Alan | Ne eklenebilir | Amaç |
|------|----------------|------|
| **A) COVER prompt (scene.ts)** | "Cover = **poster for the entire book**; suggest **key locations, theme, and journey** in one image." | Kapak = tek karede tüm hikâye. |
| | "**Epic wide** or **panoramic** composition; character(s) as **guides into the world**, environment shows **the world of the story**." | Valley tarzı “dünyaya bakış”. |
| | "**Eye-catching, poster-like, movie-poster quality**. **Reserve clear space for title at top**." | Göz alıcılık + başlık alanı. |
| | "**Dramatic lighting** (e.g. golden hour, sun rays through clouds) where it fits the theme." | Görsel çekim. |
| **B) Cover scene description (books route)** | Story’den **kısa özet** (lokasyonlar, 2–3 temel an, moral) çıkarıp cover description’a **enjekte** etmek. | Kapak gerçekten “tüm kitabı” anlatsın. |
| **C) Kapak oranı** | Kapak için “**epic wide**; character **max 30–35%** of frame; **environment-dominant**.” | Valley ile uyumlu oran. |
| **D) Kapak focusPoint** | Şu an **character**. Valley örneği **environment ağırlıklı**; “**balanced**” veya “**environment**” denenebilir. | Karakter küçülür, ortam büyür. |

**Özet öneri (analiz):**
- **Prompt (scene.ts):** COVER bloğuna (A) maddelerini eklemek: poster / tüm kitap, epic wide, karakter rehber, ortam = dünya, poster-like, başlık alanı, dramatic lighting.
- **Cover description (route):** (B) Story’den özet çıkarıp “evoke full journey: [lokasyonlar], [anlar]” şeklinde kullanmak.
- **Oran:** (C) Kapak için 25–35% (veya max 35%) + “environment-dominant”; (D) focusPoint değişikliği isteğe bağlı denenecek.

---

### 3. Özet Tablo (Analiz)

| Konu | Mevcut | Yapılabilecek (plan öncesi analiz) |
|------|--------|-------------------------------------|
| **Karakter oranı** | 30–40%; çıktı ~40–50% | 25–35%, “max 35%”, “wider shot”, “character smaller”. |
| **Kapak = tüm kitap** | “Essence of story” var ama genel | “Poster for entire book”, “key locations/journey”, story-based özet. |
| **Kapak görsel çekim** | Yok | “Poster-like”, “movie-poster”, “dramatic lighting”, “space for title”. |
| **Kapak kompozisyon** | Character-centered, hero | “Epic wide / panoramic”, “character as guide”, “environment = world”. |

**Sonraki adım:** Uygulama planı uygulandı (scene v1.4.0, books route story-based cover). Create Book ile test yapılacak; sonuçlar "İlerleme ve Denemeler"e işlenecek.

---

## Sonraki Adımlar

1. **Kapak ve oran – uygulama planı (tamamlandı)**  
   - Karakter oranı (25–35%, max 35%, wider shot) ve kapak özelleştirmesi (poster, epic wide, story-based özet, dramatic lighting) uygulandı (scene v1.4.0, books route).  
   - Create Book ile test yapılacak; sonuçlar "İlerleme ve Denemeler"e işlenecek.

2. **Tamamlananlar (Faz 1–2–3)**  
   - DoF: net ortam; sayfa 1 focusPoint → balanced; kapak–sayfa 1 farklılaştırma.  
   - Story model → gpt-4o-mini.  
   - Test sonuçları “İlerleme ve Denemeler”e işlendi.

3. **Test ve dokümantasyon**  
   - Her deneme “İlerleme ve Denemeler”e işlensin.  
   - Beğenilen ayarlar `scene.ts`, `app/api/books/route.ts` ve `docs/prompts` ile senkron tutulsun.

---

## Referanslar

- **ROADMAP:** `docs/ROADMAP.md` (3.5.19, 3.5.20).
- **Kapak boş + karakter odaklı analiz:** `docs/guides/KAPAK_BOS_KARAKTER_ODAKLI_ANALIZ.md`.
- **ChatGPT görsel test prompt'ları (kapak, sayfa 1):** `docs/guides/CHATGPT_IMAGE_TEST_PROMPTS.md`.
- **Görsel kompozisyon analizi:** `docs/guides/IMAGE_COMPOSITION_AND_DEPTH_ANALYSIS.md`.
- **Scene prompt:** `lib/prompts/image/v1.0.0/scene.ts`.
- **Character prompt:** `lib/prompts/image/v1.0.0/character.ts`.
- **Books route (story model, image batch):** `app/api/books/route.ts`.
- **Generate-images:** `app/api/ai/generate-images/route.ts`.
- **Story base prompt:** `lib/prompts/story/v1.0.0/base.ts`.
- **OpenAI fiyatlandırma:** [platform.openai.com/docs/pricing](https://platform.openai.com/docs/pricing) (güncel fiyatlar için).

---

*Bu doküman, sahne kalitesi ve kapak–ilk sayfa benzerliği iyileştirmeleri süresince güncellenecektir. Tüm analiz, deneme ve ilerleme notları bu README üzerinden takip edilebilir.*
