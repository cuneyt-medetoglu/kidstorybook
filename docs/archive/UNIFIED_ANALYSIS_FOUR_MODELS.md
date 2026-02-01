# Dört Model Analizi — Birleşik Rapor

**Tarih:** 31 Ocak 2026  
**Kaynaklar:** Auto (Visual Deep Dive), Gemini (Quality & Consistency), GPT-5.2 (Faz 2.7 Plan), Opus (Scene & Clothing Analysis)  
**Konu:** Görsel tutarlılık, hikaye kalitesi, 404/UX ve Examples/Create Your Own

---

## Özet Akış

```
[Kullanıcı Testi: 3 sayfa kitap]
         │
         ├─► Kıyafet tutarsızlığı (Master ≠ iç sayfalar)
         ├─► Sahne tekrarı (aynı eylem/sahne)
         └─► 404 / boş sayfa (kitap sonrası yönlendirme)
         │
         ▼
[4 Model Analizi] ──► Ortak kök nedenler + model bazlı farklı vurgular
         │
         ▼
[Uygulama] Master Outfit → Story/Image prompt sync → Sahne kuralları → Redirect fix (✅ Opus)
```

---

## Özet Tablo

| Konu | Auto | Gemini | GPT-5.2 | Opus | Ortak? |
|------|------|--------|---------|------|--------|
| **Kıyafet kök neden** | Master kıyafet story'ye taşınmıyor | Story rastgele clothing; image zorlamıyor | — | Story farklı clothing; Image API ignore edebiliyor | ✅ Evet |
| **Kıyafet çözüm** | defaultClothing + prompt enjeksiyon | baseClothing + "Anchor"; jenerikte override | — | Tek kıyafet zorunluluğu; CLOTHING_LOCK başa | ✅ Benzer |
| **Sahne kök neden** | gpt-4o-mini + prompt'ta action kuralı yok | Narrative arc / Beat Sheet yok | — | sceneDescription benzer; prompt çok uzun (~8.5k) | ✅ Evet |
| **Sahne çözüm** | gpt-4o; Sahne Akışı (Sayfa 1–2–3 kuralı) | Beat Sheet (Setup/Exploration/Interaction/Resolution) | — | Prompt kısalt; validateSceneDiversity; two-pass | Kısmen |
| **404 kök neden** | Supabase replica + cache | searchParams / latency / RLS | — | — | ✅ Evet |
| **404 çözüm** | refresh param + retry | Redirect + library query düzelt | — | **router → /books/[id]/view** (✅ yapıldı) | ✅ Opus kod değişikliği |
| **Examples / CYY** | — | — | is_example, Create example book, Create your own | — | Sadece GPT-5.2 |
| **Prompt uzunluğu** | — | — | — | 8500→4000–5000; direktifleri sadeleştir | Sadece Opus (fazda, sorun varsa) |
| ~~Character DNA / LoRA~~ | — | — | — | — | **Çıkarıldı** (gerek yok) |

---

## 1. Ortak Yönler (Tüm / Çoğu Model)

### 1.1 Kıyafet Tutarlılığı — Kök Neden

- **Master/referans görseldeki kıyafet**, hikaye üretim aşamasına **bilinçli olarak taşınmıyor**.
- **Story generation (LLM)** her sayfa için `clothing` alanını ayrı ayrı dolduruyor; tutarlılık kuralı yok → “yürüyüş kıyafeti”, “rahat tişört” gibi farklı ifadeler.
- **Image API** metin prompt’undaki kıyafeti referans görsele tercih edebiliyor veya görmezden gelebiliyor; sonuç “rainbow wardrobe”.

**Ortak çözüm yönü:**  
Master’da kıyafeti analiz et → tek bir alanda sakla (`defaultClothing` / `baseClothing`) → hem story hem image prompt’unda bu değeri **zorunlu** kullan.

---

### 1.2 Sahne / Hikaye Tekdüzeliği — Kök Neden

- **Hikaye prompt’u** sahne çeşitliliğini (eylem, mekan, açı) **zorlamıyor**.
- Kısa hikayelerde (3–5 sayfa) aynı eylem tekrarlanıyor (örn. “zıplıyor”).
- **Opus ek bulgu:** `sceneDescription` alanları birbirine çok benzer; image prompt ~8500 karakter ve çok uzun → araştırma “lost in the middle” / attention dilution’ı doğruluyor; gerekirse prompt kısaltma **faza alınacak**.

**Ortak çözüm yönü:**  
Story prompt’a **sahne akışı / beat** kuralları ekle (Sayfa 1: keşif, Sayfa 2: etkileşim, Sayfa 3: sonuç vb.); “önceki sayfanın aynı eylemini tekrarlama” gibi negatif kural. **Mekan çeşitliliği** (en az 3 alt mekan) vurgusu dahil.

---

### 1.3 404 / Yönlendirme Sorunu

- Kitap oluşturma API’si **200** dönüyor ama kullanıcı `/library?book=UUID` ile **404 veya boş** sayfa görüyor.
- **Ortak nedenler:** Supabase read replica gecikmesi, client-side cache veya library sayfasının `book` parametresini doğru kullanmaması.

**Opus’un kod değişikliği (uygulanmış):**  
Yönlendirmeyi **library** yerine doğrudan kitap görüntüleyiciye yapmak:

- **Eski:** `router.push(bookId ? '/library?book=${bookId}' : …)`  
- **Yeni:** `router.push(bookId ? '/books/${bookId}/view' : '/dashboard')`

Böylece yeni oluşturulan kitap için **tek kaynak** `/books/[id]/view` olur; library listesinin henüz güncellenmemiş olması 404’e yol açmaz. Bu değişiklik **çözüm olarak kabul edildi** (Opus dokümanında “404 DÜZELTILDI ✅”).

---

## 2. Model Bazlı Farklı Vurgular

### 2.1 Auto (Visual Consistency Deep Dive)

- **Mimari kopukluk** vurgusu: Kıyafet bilgisi pipeline’da story’ye aktarılmıyor.
- ~~**Model seçimi:** gpt-4o önerisi~~ → **Çıkarıldı:** Çocuk hikayesi için gpt-4o / gpt-4o-mini farkı beklenmiyor; maliyet artışı yapılmayacak.
- **404:** `refresh=true` parametresi + library’de cache’siz/gecikmeli fetch önerisi (Opus ise redirect’i değiştirerek çözdü).

---

### 2.2 Gemini (Quality & Consistency Analysis)

- **“Anchor Clothing” (çapa kıyafet):** Story’de “kıyafeti değiştirme” kuralı + image tarafında **jenerik** kıyafet gelirse (`casual clothes`, “rahat kıyafet” vb.) otomatik olarak Master’ın `baseClothing` ile **override** (2.3 — ayrı açıklama: plana dahil edilmeden önce anlaşılacak).
- **“Scene Beat”:** 12 sayfayı 4 aşamaya yay (Setup → Exploration → Interaction → Resolution); **mekan çeşitliliği** vurgusu (en az 3 alt mekan) — **plana dahil**.
- **404:** Olası nedenler olarak `searchParams` okuma, latency ve RLS ayrı ayrı sayılıyor.

---

### 2.3 GPT-5.2 (Faz 2.7 — Examples & Create Your Own)

- **Konu farkı:** Görsel tutarlılık analizi değil; **Examples sayfası** ve **Create Your Own** özellik planı.
- **İçerik:**  
  - Gerçek örnek kitaplar: mock kaldır, `is_example=true` API, admin “Create example book”.  
  - Create your own: örnek kitaptan `story_data` + sayfa promptları alınır; aynı karakter sayısı kadar karakter yüklenir; aynı hikaye, kullanıcının karakterleriyle yeniden üretilir.  
  - Dokümantasyon ve prompt sync zorunlu.
- **Birleşik raporda yeri:** Ürün roadmap’i; görsel/hikaye kalite çalışmaları tamamlandıkça Examples ve CYY bu kalite kurallarından faydalanacak.

---

### 2.4 Opus (Scene Repetition & Clothing Consistency)

- **404:** Redirect’i `/books/[id]/view` yaparak **düzeltti** (kod değişikliği ektedir).
- **Prompt uzunluğu:** Image prompt’u 8500’den 4000–5000 karaktere indir; tekrarlayan direktifleri kaldır, en kritikleri başa al. Araştırma: “lost in the middle” / attention dilution doğrulandı → **sorun gözlemlenirse** development fazında kısaltma yapılacak.
- **Kıyafet:** Story’de “CRITICAL - CLOTHING CONSISTENCY”, tüm sayfalarda aynı `clothing`; image’da kıyafet direktifi **en başta** (CLOTHING_LOCK mantığı).
- **Sahne:** Story sonrası **validateSceneDiversity**; gerekirse two-pass (story → validation → image).
- ~~**Uzun vade:** Character DNA, LoRA, alternatif API’ler~~ → **Çıkarıldı** (gerek yok).

---

## 3. Teknik Özet ve Öncelik (Yorum Sonrası Güncel)

| Öncelik | Konu | Önerilen aksiyon | Kaynak |
|--------|------|-------------------|--------|
| P0 | Kıyafet (1.1) | Master’da kıyafet analizi → `defaultClothing` sakla; story + image prompt’ta zorunlu kullan | Ortak karar |
| P0 | Sahne (1.2) | Story prompt’a sahne akışı / beat + mekan çeşitliliği (en az 3 alt mekan) + “aynı eylemi tekrarlama” yasağı | Ortak karar |
| P0 | 404 (1.3) | Kitap sonrası yönlendirme: `/books/[id]/view` — **yapıldı** ✅ | Opus |
| ~~P1 Model~~ | — | ~~gpt-4o~~ **Çıkarıldı** (çocuk hikayesi; maliyet artışı yok) | — |
| P1 | Mekan çeşitliliği (2.2) | Beat Sheet + en az 3 alt mekan zorunluluğu | Gemini |
| P1 | Prompt uzunluğu | Sorun gözlemlenirse: image prompt kısalt, kritik direktifleri başa al (fazda) | Opus + araştırma |
| — | 2.3 Image override | Jenerik clothing gelirse `baseClothing` ile override — **açıklama sonrası karar** (aşağıda) | Gemini |
| P2 | Validation | Story sonrası sahne çeşitliliği kontrolü (validateSceneDiversity) | Opus |
| P2 | Examples / CYY | Faz 2.7 planı (is_example, Create your own, doc sync) | GPT-5.2 |

### 2.3 “Image override” ne demek? (Plana dahil edilmedi — önce anlaşılacak)

**Gemini’nin önerisi:** Story bazen kurala rağmen jenerik kıyafet döndürüyor (“rahat kıyafet”, “casual clothes”). Image prompt’a bu jenerik metin giderse model yine farklı çizebilir. **Override** = Story’den gelen `clothing` metni jenerikse (ör. sadece “rahat kıyafet” / “casual”), bu değeri **kullanma**; yerine Master’ın saklanan `baseClothing` değerini image prompt’a yaz. Böylece “son savunma hattı”: story hata yapsa bile görsel tarafı doğru kıyafeti alır. İstersen bu mantığı Faz 1 (kıyafet) ile birlikte veya hemen sonra plana ekleyebiliriz.

---

## 4. Opus Kod Değişikliği (Referans)

**Dosya:** `app/create/step6/page.tsx`  

**Değişiklik:** Kitap oluşturma başarılı olduktan sonra kullanıcıyı artık `/library?book=...` ile değil, doğrudan kitap görüntüleyiciye yönlendir.

```ts
// Eski (404 riski):
router.push(bookId ? `/library?book=${bookId}` : "/dashboard")

// Yeni (Opus — uygulanmış):
router.push(bookId ? `/books/${bookId}/view` : "/dashboard")
```

Böylece kitap ID’si ile doğrudan `/books/[id]/view` açılır; library listesinin gecikmeli güncellenmesi 404’e sebep olmaz.

---

## 5. Doküman Kaynakları

| Model | Dosya | Konu |
|-------|--------|------|
| Auto | `docs/analysis/VISUAL_CONSISTENCY_AND_STORY_QUALITY_DEEP_DIVE.md` | Görsel tutarlılık, hikaye kalitesi, 404 |
| Gemini | `docs/reports/QUALITY_AND_CONSISTENCY_ANALYSIS.md` | Anchor clothing, Scene Beat, UX |
| GPT-5.2 | `cti/docs/implementation/FAZ2_7_EXAMPLES_REAL_BOOKS_AND_CREATE_YOUR_OWN_PLAN.md` | Examples, Create your own |
| Opus | `docs/analysis/SCENE_REPETITION_AND_CLOTHING_CONSISTENCY_ANALYSIS.md` | Sahne/kıyafet kök neden, 404 redirect fix |

Bu birleşik rapor, dört analizin ortak sonuçlarını tek yerde toplar, model bazlı farkları işaret eder ve uygulama önceliğini netleştirir.

**Geliştirme planı (fazlar):** `docs/implementation/CONSISTENCY_AND_QUALITY_ACTION_PHASES.md`
