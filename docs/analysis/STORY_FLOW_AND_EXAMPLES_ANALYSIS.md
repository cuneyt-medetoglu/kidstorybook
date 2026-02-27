# Hikaye Akışı ve Examples İçin Akış – Analiz

**Tarih:** 2026  
**Amaç:** Akış zayıflığının nedenini netleştirmek; custom request’in rolü ve Step 6 Debug akışını kısa özetlemek. **Sadece analiz; kod yok.**

---

## 1. Şu anki akış

| Adım | Ne oluyor |
|------|------------|
| **story-ideas-helper.html** | Kategori + yaş + karakterler → GPT/Gemini → **TITLE + EXAMPLE STORY** (max 450 karakter). |
| **Step 5 – Custom Request** | Bu metin (veya benzeri) **Custom Request** alanına yapıştırılıyor. |
| **Sistemin story-generation’ı** | Custom request + tema + karakter vb. ile **tam hikayeyi** (sayfa sayfa) üretiyor. |

**Önemli:** Custom request = hikaye için **ana fikir / özet istek**. Akışı (başlangıç–gelişme–sonuç) kurmak **story-generation’ın işi**; custom request sadece girdi.

---

## 2. Sorun: “Akış” neden zayıf?

**Referans (PDF – kamp günü):** Güne başlama → gelişmeler → sonunda yatıp uyuma. Sayfalar birbirini tamamlıyor, net **başlangıç–gelişme–sonuç**.

**Bizde:** Sayfalar bazen birbirini tamamlamıyor; hikaye bir sonuca bağlanmıyor.

**Neden (tek yön):** Custom request’i “yapı ekleyerek” çözmüyoruz; custom request zaten sadece fikir/özet. Asıl kontrol edilmesi gereken **story-generation prompt’unun** akışı zorunlu kılıp kılmadığı.

---

## 2.B Story-generation’da durum

**Kod tarafı (`lib/prompts/story/base.ts`):**

- **Custom request kullanımı:** Sadece `# STORY REQUIREMENTS` içinde `Special Requests: ${customRequests || 'None'}` olarak geçiyor. Yani serbest metin; “bunu ana fikir al, buna göre tam hikaye kur” gibi bir talimat yok, sadece “özel istekler” alanı.
- **Yapı:** `# STORY STRUCTURE` bölümünde: kapak ayrı, tam N sayfa, her sayfa ayrı sahne, sayfa 1 kapaktan farklı, “Vary locations and time of day across pages so the story feels like a **progression**.” İfade var ama **“ilk sayfalar giriş, ortalar gelişme, son sayfa net kapanış”** gibi zorunlu bir kural yok.
- **Güvenlik kuralları:** “Happy or hopeful ending”, “Hopeless or sad endings” avoid — yani sonun mutlu/umutlu olması var, ama **anlatısal yay** (setup → development → resolution) açıkça istenmiyor.

**Sonuç:** Story-generation şu an custom request’i “özel istek” olarak alıyor; hikayenin **mutlaka** başlangıç–gelişme–sonuç ile ilerlemesi prompt’ta net ve zorunlu değil. Akışı iyileştirmek için yapılacak şey: **story-generation prompt’una** “Hikaye tek bir anlatı yayı izlemeli: giriş (ilk sayfalar), gelişme (orta sayfalar), net bir kapanış (son sayfa/lar)” gibi kurallar eklemek; custom request formatını değiştirmek değil.

---

## 3. Custom request formatı

**Değişiklik yok.** Custom request = **hikaye fikri / özet istekler**. Start–Middle–End veya beat özeti burada olmayacak; akışı story-generation kuracak. Helper’ın ürettiği kısa EXAMPLE STORY (veya benzeri) bu rol için yeterli; formatı olduğu gibi bırakıyoruz.

---

## 4. Examples sayfası + Step 6 Debug: İstenen akış

**Hedef:** Examples için harika hikayeler. Önce **hikayeyi görüp** gerekirse düzenlemek, “OK” deyince **akışın devam etmesi** ve **hikaye kitabının oluşturulması**.

**Adımlar:**

1. **Hikayeyi önce sadece metin olarak üret**  
   Custom request (helper’dan veya elle) Step 5’e girilir. Step 6 Debug’ta **“Sadece Hikaye”** çalıştırılır → tam sayfa metinleri gelir.

2. **Görüntüle / düzenle**  
   Hikayeyi okursun; istersen metni değiştirir, tekrar üretirsin.

3. **Hazırsa “OK”**  
   Akış devam eder: bu hikaye metni kullanılarak **görsel üretimi + kitap oluşturma** tetiklenir. Yani boşuna görsel üretmeden önce hikaye onaylanmış olur.

**Mevcut / eksik:** Debug’ta “1. Sadece Hikaye” zaten var. Eksik olan: bu hikayeyi “sabit” kabul edip **sadece bu metinden** kitap/görsel oluşturan ayrı adım (şu an Create book deyince hikaye baştan da üretiliyor).

---

## 5. Kısa özet

| Konu | Durum / Karar |
|------|----------------|
| **Custom request** | Sadece hikaye fikri / özet istek. Akışı orada çözmüyoruz; format değişikliği yok. |
| **Akış neden zayıf?** | Story-generation prompt’unda “giriş–gelişme–sonuç” zorunluluğu açık değil; sadece “progression” ve “happy ending” var. |
| **Ne yapılacak?** | Story-generation prompt’una anlatı yayı (başlangıç–gelişme–net kapanış) kuralları eklenmeli. |
| **Examples + Debug** | Önce hikayeyi gör → gerekirse düzenle → OK deyince akış devam etsin, kitap oluşturulsun. Debug’a “bu hikayeden kitap oluştur” aşaması eklenmeli. |

Bu doküman üzerinde anlaşılan çerçeve; sonraki adım story-generation prompt’unun güncellenmesi ve Debug akışına “bu hikayeden oluştur” eklenmesi.

---

## 6. Yapılanlar (implementasyon)

| Tarih | Yapılan |
|-------|--------|
| Şubat 2026 | **Story-generation prompt:** `lib/prompts/story/base.ts` → `buildStoryStructureSection` içine **Narrative arc (CRITICAL)** kuralı eklendi: ilk 1–2 sayfa giriş, orta sayfalar gelişme, son 1–2 sayfa net kapanış; son sayfa rastgele durmamalı. |
| Şubat 2026 | **API:** `POST /api/books` isteğine opsiyonel **`story_data`** eklendi. Gönderilip geçerli `pages[]` varsa hikaye üretimi atlanır, bu veri kullanılır (masters + kapak + sayfa görselleri aynı akışla devam eder). |
| Şubat 2026 | **Debug panel:** "1. Sadece Hikaye" sonrası **"Bu hikayeden kitap oluştur"** butonu eklendi; tıklanınca mevcut `storyData` ile `POST /api/books` çağrılır, hikaye tekrar üretilmez. |
