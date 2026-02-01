# 🔍 Görsel ve Hikaye Kalite Analizi (Critical Fix)

**Tarih:** 31 Ocak 2026  
**Durum:** Kritik İyileştirme Gerekiyor  
**Konu:** Kıyafet Tutarlılığı, Hikaye Kurgusu ve UX Hataları

---

## 1. Problem Analizi

### 1.1. Kıyafet Tutarlılığı Sorunu (Clothing Consistency)
**Gözlem:** Master karakterin kıyafeti (veya referans fotodaki kıyafet) kapakta kullanılıyor, ancak iç sayfalarda karakter sürekli farklı renk ve tipte kıyafetlerle beliriyor.
**Teknik Neden:**
- Şu anki yapıda `generateFullPagePrompt`, kıyafet bilgisini öncelikli olarak `story_data` içindeki `clothing` alanından alıyor.
- Story Generation (LLM), hikayeyi yazarken karakterin kıyafetini tutarlı tutma konusunda başarısız. Her sayfa için rastgele veya genel tanımlar ("casual clothes") üretiyor.
- Image Generation prompt'u, Master Karakterin analiz edilen kıyafetini (Reference Photo analysis) *yeterince güçlü* bir şekilde zorlamıyor (enforce etmiyor).

**Çözüm Stratejisi: "Anchor Clothing" (Çapa Kıyafet)**
1.  Karakter analizi (`generateCharacterAnalysisPrompt`) sırasında, karakterin üzerindeki kıyafet detaylıca analiz edilip `baseClothing` olarak saklanmalı.
2.  Story Generation prompt'una, "Eğer hikaye akışı gerektirmiyorsa (kostüm partisi, uyku vakti vb.), karakterin kıyafetini ASLA değiştirme" kuralı eklenmeli.
3.  **Kritik Müdahale:** Image Prompt oluşturulurken (`scene.ts`), hikayeden gelen kıyafet bilgisi eğer jenerikse ("casual clothes" vb.), otomatik olarak Master Karakterin `baseClothing` tanımı ile ezilmeli (override).

### 1.2. Hikaye ve Sahne Tekdüzeliği (Repetitive Scenes)
**Gözlem:** Kullanıcı kısa bir prompt ("Topu buldu, tavşanla oynadı") girdiğinde, 12 sayfa boyunca aynı sahne (tavşanla zıplama) tekrar ediyor.
**Teknik Neden:**
- Story Prompt, kısa girdiyi 12 sayfaya yayarken "Narrative Arc" (Hikaye Yayı) oluşturamıyor.
- Her sayfa için görsel prompt üretilirken, sahne değişimi (mekan, açı, aksiyon) zorlanmıyor.

**Çözüm Stratejisi: "Scene Beat" (Sahne Vuruşları)**
1.  **Story Prompt Revizyonu:** Prompt'a "Beat Sheet" mantığı eklenecek.
    - Sayfa 1-2: Setup (Giriş)
    - Sayfa 3-5: Exploration (Keşif)
    - Sayfa 6-9: Interaction/Play (Etkileşim - Farklı aktiviteler zorunlu)
    - Sayfa 10-12: Resolution (Sonuç)
2.  **Mekan Çeşitliliği:** Hikaye prompt'u, en az 3 farklı alt mekan (sub-location) kullanımını zorunlu kılacak (örn: Çayır -> Orman Girişi -> Dere Kenarı -> Ağaç Ev).

### 1.3. UX Hatası (404 / Library Redirect)
**Gözlem:** Kitap oluşturulduktan sonra `/library?book=UUID` adresine gidiyor ancak 404 veriyor veya boş kalıyor.
**Olası Neden:**
- `app/library/page.tsx` sayfası `searchParams`'ı doğru okumuyor olabilir.
- Kitap oluşturma bitmeden redirect gerçekleşiyor olabilir (Latency issue).
- RLS (Row Level Security) politikaları yeni oluşturulan kitabı okumaya izin vermiyor olabilir (Admin vs User rol karmaşası).

---

## 2. Uygulama Planı (To-Do)

### Faz 3.1: Kıyafet Tutarlılığı (Acil)
- [ ] **Character Analysis Güncellemesi:** `lib/prompts/image/character.ts` içinde `clothingStyle` analizini güçlendir. Bunu `defaultClothing` olarak sakla.
- [ ] **Scene Prompt Revizyonu:** `lib/prompts/image/scene.ts` içinde `generateFullPagePrompt` fonksiyonunu güncelle. Eğer hikayede özel bir kostüm (space suit, pajamas) yoksa, `defaultClothing`'i prompt'a *zorla*.
- [ ] **Story Prompt Revizyonu:** `lib/prompts/story/base.ts` içine "Keep clothing consistent unless specified" kuralını sertleştir.

### Faz 3.2: Hikaye Kurgusu (Acil)
- [ ] **Beat Sheet Entegrasyonu:** Story prompt'unu "12 sayfa yaz" yerine "Bu 4 aşamayı 12 sayfaya yay" şeklinde değiştir.
- [ ] **Aksiyon Çeşitliliği:** Prompt'a "Her sayfada karakter farklı bir eylem yapmalı (koşma, tırmanma, inceleme, oturma)" kuralı ekle.

### Faz 3.3: UX Fix
- [ ] `app/create/step6/page.tsx` redirect mantığını kontrol et.
- [ ] `app/library/page.tsx`'in query parametrelerini işleme mantığını düzelt.

---

## 3. Beklenen Sonuç
Bu düzeltmeler yapıldığında:
1.  Karakter kapakta ne giyiyorsa (veya referans fotoda), tüm kitapta (özel bir durum yoksa) aynısını giyecek.
2.  Kısa prompt girilse bile hikaye "Giriş -> Gelişme -> Sonuç" akışına sahip olacak ve sahneler görsel olarak çeşitlenecek.
3.  Kullanıcı kitap oluşturduktan sonra kütüphanesinde kitabını hatasız görecek.
