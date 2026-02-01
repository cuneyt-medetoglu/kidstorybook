# 🔍 Görsel Tutarlılık ve Hikaye Kalitesi - Derinlemesine Analiz

**Tarih:** 31 Ocak 2026  
**Konu:** Karakter kıyafetlerinin her sayfada değişmesi, hikaye sahnelerinin tekrar etmesi ve 404 hatası.  
**Öncelik:** Kritik (Critical)

---

## 1. Yönetici Özeti (Executive Summary)

Yapılan testler ve kod incelemesi sonucunda, projenin başından beri tam aşılamayan tutarlılık sorununun **"Mimari Kopukluk"** kaynaklı olduğu tespit edilmiştir.

1.  **Kıyafet Sorunu:** Master Karakter oluşturulurken kıyafet analiz ediliyor ancak bu bilgi hikaye oluşturma aşamasına (Story Generation) taşınmıyor. Hikaye motoru (LLM), her sayfa için rastgele "rahat kıyafetler" tanımı uyduruyor. Görüntü motoru ise metin prompt'una uyarak (text adherence) referans fotoğraftaki kıyafeti eziyor.
2.  **Sahne Tekdüzeliği:** Hikaye prompt'u, sahne çeşitliliğini (action progression) zorlamakta yetersiz kalıyor. Özellikle kısa hikayelerde (3-5 sayfa) model, aynı eylemi (zıplama, koşma) farklı açılardan anlatmak yerine eylemi tekrarlıyor. Ayrıca `gpt-4o-mini` kullanımı yaratıcılığı kısıtlıyor.
3.  **404 Hatası:** Veritabanı yazma işlemi ile okuma işlemi arasındaki milisaniyelik gecikme (latency) ve frontend cache mekanizması nedeniyle, kullanıcı kütüphaneye düştüğünde kitap henüz listelenmemiş oluyor.

---

## 2. Sorun Analizi ve Teknik Kök Nedenler

### Sorun A: Kıyafet Tutarlılığı (Rainbow Wardrobe Effect)

**Gözlem:**
- Master Fotoğraf: Mor çiçekli kazak.
- Kapak: Mor çiçekli kazak (Doğru - çünkü prompt "Match reference photo exactly" diyor).
- Sayfa 1: Mavi tişört, kırmızı şort.
- Sayfa 2: Yeşil tişört, kot pantolon.
- Sayfa 3: Mavi tişört, kot pantolon.

**Teknik Kök Neden:**
Mevcut kod yapısında (`lib/prompts/image/v1.8.0/character.ts` ve `app/api/books/route.ts`), Master Karakter oluşturulurken `excludeClothing: true` parametresi kullanılıyor veya kullanılmasa bile, hikaye oluşturulurken (`generateStoryPrompt`) karakterin **orijinal kıyafeti** prompt'a input olarak verilmiyor.

Story API, `clothing` alanını doldururken şunları yapıyor:
```typescript
// LLM'in uydurduğu:
Page 1 clothing: "yürüyüş kıyafetleri" -> Model: "Hımm, mavi tişört olsun."
Page 2 clothing: "rahat pantolon ve tişört" -> Model: "Yeşil olsun."
```

Image API ise şuna bakıyor:
- **Referans Görsel:** Mor kazaklı çocuk.
- **Text Prompt:** "Arya, **yeşil bir tişört** giymiş."
- **Sonuç:** GPT-Image modeli, "Kullanıcı metinde yeşil tişört istedi, referanstaki yüzü alayım ama tişörtü yeşil yapayım" diyor.

**Çözüm Stratejisi:**
Master oluşturulurken kıyafet analizi **saklanmalı** ve hikaye oluşturulurken "Default Outfit" olarak LLM'e zorlanmalıdır.

---

### Sorun B: Hikaye ve Sahne Tekdüzeliği (Repetitive Storytelling)

**Gözlem:**
Prompt: *"A big glowing ball appears... meets a rabbit... play together."*
- Sayfa 1: Arya topa koşuyor.
- Sayfa 2: Arya ve tavşan zıplıyor.
- Sayfa 3: Arya ve tavşan zıplıyor.

**Teknik Kök Neden:**
1.  **Model:** `gpt-4o-mini` maliyet odaklı olduğu için karmaşık hikaye kurgularında (narrative arc) zayıf kalıyor. Bağlamı (context) koruyor ama "yeni bir şey ekleme" konusunda tembel davranıyor.
2.  **Prompt Yapısı:** `lib/prompts/story/v1.4.0/base.ts` içinde, her sayfanın diğerinden **eylem (action)** olarak farklı olması gerektiğini belirten sert kurallar (hard constraints) eksik.
3.  **Görsel Çeviri:** Hikaye metni "oynuyorlar" dediğinde, Image Prompt "zıplıyorlar" olarak çeviriyor ve bu her sayfada tekrarlanıyor.

---

### Sorun C: Kitap Oluştu Sonrası 404 Hatası

**Gözlem:**
Loglarda `POST /api/books 200` (Başarılı) görünüyor ama yönlendirilen `/library?book=UUID` sayfası 404 veriyor veya boş geliyor.

**Teknik Kök Neden:**
Next.js ve Supabase arasındaki asenkron yapı.
1.  API: `insert book` -> `commit` -> `return 200`.
2.  Frontend: `router.push('/library')`.
3.  Library Page: `useEffect` -> `fetchBooks`.
4.  **Sorun:** Supabase'in "Read Replica"sı henüz yeni veriyi görmemiş olabilir VEYA Next.js client-side router cache eski veriyi gösteriyor olabilir.

---

## 3. Çözüm Planı (Action Plan)

Bu sorunları çözmek için aşağıdaki adımları sırasıyla uygulayacağız.

### Adım 1: Kıyafet Tutarlılığını Sağlama (The "Master Outfit" Fix)

1.  **Veritabanı/Analiz Güncellemesi:**
    *   Step 1'de (veya Master analizinde) karakterin üzerindeki kıyafeti detaylı analiz et (örn. "Purple knitted sweater with small flower patterns").
    *   Bu veriyi `character_analysis` içinde `defaultClothing` olarak sakla.

2.  **Hikaye Prompt'una Enjeksiyon:**
    *   `generateStoryPrompt` fonksiyonuna `defaultClothing` parametresi ekle.
    *   Prompt içine şu kuralı ekle: *"Karakterin kıyafeti: [DEFAULT_OUTFIT]. Hikaye akışı (örneğin pijama partisi, yüzme, astronot kostümü) gerektirmediği sürece HER SAYFADA bu kıyafeti kullan. Asla rastgele kıyafet uydurma."*

3.  **Image Prompt Entegrasyonu:**
    *   Story JSON çıktısında `clothing` alanı artık "Purple knitted sweater..." olarak gelecek.
    *   Image Prompt, "wearing [CLOTHING]" dediğinde, referans fotoğrafla metin prompt'u eşleşecek (%100 tutarlılık).

### Adım 2: Hikaye Kalitesini Yükseltme

1.  **Model Yükseltmesi:**
    *   Hikaye üretimi (`generate-story` ve `create-book`) için `gpt-4o-mini` yerine tekrar **`gpt-4o`** modeline geçilmeli. Hikaye metni (token sayısı) az olduğu için maliyet etkisi düşük, kalite etkisi çok yüksektir.

2.  **Prompt Mühendisliği (Sequence Enforcement):**
    *   Hikaye prompt'una "Sahne Akışı" kuralı ekle:
        *   Sayfa 1: Keşif / Başlangıç (Durum).
        *   Sayfa 2: Etkileşim / Olay (Eylem).
        *   Sayfa 3: Sonuç / Duygu (Tepki).
    *   Negatif Prompt (Text): *"Önceki sayfadaki eylemin aynısını tekrar etme."*

### Adım 3: 404 Hatasını Giderme

1.  **Redirect Güncellemesi:**
    *   `router.push('/library?book=UUID')` yerine `router.push('/library?book=UUID&refresh=true')`.
2.  **Library Fetching:**
    *   Kütüphane sayfasında `refresh` parametresi varsa, Supabase sorgusunu cache'siz yap veya 1 saniye gecikmeli (retry) çalıştır.

---

## 4. Özet

Bu plan, **"rastgelelik"** faktörünü ortadan kaldırıp **"kontrollü üretim"** yapısına geçmeyi hedefler. Kıyafetin referans fotoğraftan alınıp tüm pipeline (boru hattı) boyunca taşınması, tutarlılığı garanti edecek tek yöntemdir.
