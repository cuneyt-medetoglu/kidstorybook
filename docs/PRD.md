# 📄 Product Requirements Document (PRD)
# KidStoryBook Platform

**Doküman Versiyonu:** 1.3  
**Tarih:** 21 Aralık 2025  
**Son Güncelleme:** 26 Ocak 2026  
**Durum:** TASLAK - FAZ 3 (Güncellendi: Multi-character, TTS, Currency Detection, Cart, Image Edit, 8 Dil Desteği, PDF Generation eklendi)

---

## 1. Executive Summary

### 1.1 Ürün Vizyonu
KidStoryBook, ebeveynlerin çocuklarının fotoğraflarını kullanarak AI destekli, tamamen kişiselleştirilmiş hikaye kitapları oluşturmasını sağlayan bir SaaS platformudur.

### 1.2 Problem Statement
- Ebeveynler çocukları için özel ve anlamlı hediyeler aramakta
- Mevcut çocuk kitapları generic ve kişiselleştirilmemiş
- Özel kitap hazırlatmak pahalı ve zaman alıcı
- Çocuklar kendilerini hikayenin kahramanı olarak görmek istiyor

### 1.3 Çözüm
AI teknolojisi kullanarak, kullanıcı dostu bir arayüz ile dakikalar içinde kişiselleştirilmiş, profesyonel kalitede çocuk hikaye kitapları oluşturmak.

### 1.4 Hedef Kitle
**Primer:**
- 2-10 yaş arası çocuğu olan ebeveynler
- Türkiye ve İngilizce konuşan pazarlar

**Sekonder:**
- Anaokulları ve kreşler (toplu sipariş)
- Büyükanne/büyükbabalar
- Yakın aile dostları (hediye amaçlı)

---

## 2. Ürün Özellikleri ve Gereksinimler

### 2.0 Kullanıcı Yönetimi ve Kimlik Doğrulama
**Öncelik:** 🔴 YÜKSEK (Diğer özellikler için gerekli)

#### 2.0.1 Üyelik Sistemi
**Gereksinimler:**
- [x] Email + şifre ile kayıt ✅
- [x] Email doğrulama ✅
- [x] Şifre sıfırlama ✅
- [x] Profil yönetimi ✅
- [x] Hesap silme ✅

#### 2.0.2 OAuth Entegrasyonları
**Gereksinimler:**
- [x] Google Sign-In ✅
- [ ] Instagram Login - Planlanıyor
- [x] Facebook Login ✅
- [ ] Diğer popüler OAuth sağlayıcıları (isteğe bağlı) - Planlanıyor

**Teknik Notlar:**
- JWT token tabanlı authentication
- Secure session yönetimi
- CSRF protection
- HTTPS zorunlu

#### 2.0.3 Kullanıcı Kitaplığı ✅
**Gereksinimler:**
- [x] Kullanıcılar hesabına girdiğinde tüm kitaplarını görebilmeli ✅
- [x] Grid/Liste görünümü ✅
- [x] Filtreleme (tamamlanan, taslak, favoriler) ✅
- [x] Sıralama (tarih, isim) ✅
- [x] Arama (kitap adına göre) ✅
- [x] Her kitap için aksiyonlar (görüntüle, düzenle, indir, paylaş, sil) ✅
- [x] Hardcopy satın alma (bulk selection) ✅ (25 Ocak 2026)

**Kitap Durumları:**
- Taslak (henüz tamamlanmamış)
- İşleniyor (AI kitap oluşturuyor)
- Tamamlandı (hazır)
- Arşivlendi

### 2.1 Core Features (MVP - Olmazsa Olmaz)

#### 2.1.1 Karakter Oluşturma ve Kişiselleştirme
**Öncelik:** 🔴 YÜKSEK

**Gereksinimler:**
- [x] Çocuk fotoğrafı yükleme (maks 5MB, JPG/PNG) ✅
- [x] Çocuğun adı, yaşı, cinsiyeti girişi ✅
- [x] Saç rengi, göz rengi seçimi (opsiyonel) ✅
- [x] Karakterin fiziksel özellikleri (gözlük, saç stili vb.) ✅
- [x] **5 karaktere kadar** tek hikayede yer alma ✅ (25 Ocak 2026)
- [x] Karakter rolü seçimi (ana karakter, yan karakter) ✅

**Teknik Notlar:**
- Fotoğraf AI tarafından analiz edilecek
- Face detection ve cropping otomatik
- GDPR/KVKK uyumlu fotoğraf saklama

#### 2.1.2 Hikaye Oluşturma
**Öncelik:** 🔴 YÜKSEK

**Gereksinimler:**
- [x] Tema seçimi (macera, peri masalı, eğitici, vb.) ✅
- [x] Alt-tema/konu seçimi (dinozor, uzay, deniz altı, vb.) ✅
- [x] Yaş grubuna uygun hikaye (0-2, 3-5, 6-9 yaş) ✅
- [x] Hikaye uzunluğu: **24 sayfa** (standart) ✅
- [x] Özel istekler alanı (text input) ✅:
  - "Kitapta ayıcık olsun"
  - "Top oynama sahnesi olsun"
  - "Kahramanımız uçak kullansın"
- [x] Dil seçimi (8 dil desteği: TR, EN, DE, FR, ES, ZH, PT, RU) ✅ (24 Ocak 2026)

**Tema Kategorileri (İlk MVP):**
- Macera
- Peri Masalı
- Eğitici (sayılar, harfler, değerler)
- Doğa ve Hayvanlar
- Uzay ve Bilim
- Spor ve Aktiviteler

#### 2.1.3 Görsel Stil Seçimi
**Öncelik:** 🔴 YÜKSEK

**Illustration Styles:**
- [x] Watercolor (Sulu boya) ✅
- [x] 3D Animation (3D animasyon) ✅
- [x] Cartoon (Çizgi film) ✅
- [x] Realistic (Realistik) ✅
- [x] Minimalist ✅
- [x] Vintage Storybook ✅

Kullanıcı hikaye için bir stil seçer.

#### 2.1.4 Font ve Tipografi
**Öncelik:** 🟡 ORTA

**Gereksinimler:**
- [ ] En az 3-5 font seçeneği
- [ ] Çocuk kitaplarına uygun okunabilir fontlar
- [ ] Font önizleme

**Önerilen Fontlar:**
- Comic Sans / Comic Neue
- Quicksand
- Fredoka One
- Bubblegum Sans
- Century Gothic

#### 2.1.5 E-Book Görüntüleyici
**Öncelik:** 🔴 YÜKSEK

**Gereksinimler:**
- [x] Flipbook tarzı sayfa çevirme animasyonu ✅
- [x] Mobil ve desktop uyumlu ✅
- [x] Sol sayfa: Hikaye metni ✅
- [x] Sağ sayfa: AI üretilmiş görsel ✅
- [x] Navigasyon: İleri, geri, sayfa numarası ✅
- [x] Zoom in/out özelliği ✅
- [x] Tam ekran modu ✅
- [x] İndirme butonu (PDF formatında) ✅
- [x] Sesli okuma (TTS - Text-to-Speech) ✅ (25 Ocak 2026)
- [x] Otomatik oynatma modu ✅ (25 Ocak 2026)

**Referans:**
Ekte paylaşılan ekran görüntüsüne göre tasarım yapılacak.

#### 2.1.6 Kitap Başlığı
**Öncelik:** 🟡 ORTA

**Gereksinimler:**
- [ ] Otomatik başlık önerisi (AI tarafından)
- [ ] Kullanıcının manuel başlık girişi
- [ ] Karakter sayısı limiti (50 karakter)

#### 2.1.7 Kişisel Önsöz (Foreword)
**Öncelik:** 🟢 DÜŞÜK (Post-MVP)

**Gereksinimler:**
- [ ] Ebeveynin kişisel mesaj yazabilmesi
- [ ] Kitabın başına eklenmesi
- [ ] Maksimum 200 kelime

#### 2.1.8 Kitap Düzenleme (Edit) Özellikleri
**Öncelik:** 🟡 ORTA

**Metin Düzenleme:**
- [x] Kullanıcılar oluşturdukları kitapların metinlerini düzenleyebilmeli ✅
- [x] Her sayfanın metnini değiştirebilmeli ✅
- [x] Değişiklikler kaydedilmeli ✅
- [x] Versioning sistemi (değişiklik geçmişi) ✅

**Görsel Revize:**
- [x] Her satın alım için **1 adet ücretsiz görsel revize** hakkı ✅
- [x] Kullanıcı beğenmediği bir görseli revize edebilmeli ✅ (17 Ocak 2026 - Image Edit Feature)
- [x] Revize hakkı kullanıldıktan sonra ek revizeler ücretli olmalı ✅
- [x] Revize sayısı kullanıcı hesabında gösterilmeli ✅
- [x] ChatGPT-style mask-based editing sistemi ✅ (17 Ocak 2026)
- [x] Version history ve revert sistemi ✅ (17 Ocak 2026)

**İş Akışı:**
1. Kullanıcı kitabını görüntüler
2. "Düzenle" butonuna tıklar
3. Metin düzenleme modu açılır
4. Her sayfanın metnini düzenleyebilir
5. Görsel revize için "Görseli Yeniden Oluştur" butonu
6. Revize hakkı kontrol edilir (ücretsiz/ücretli)
7. Değişiklikler kaydedilir

---

### 2.2 Pet ve Oyuncak Karakterleri
**Öncelik:** 🟡 ORTA

**Gereksinimler:**
- [x] Evcil hayvan fotoğrafı yükleme ✅ (25 Ocak 2026)
- [x] Oyuncak/peluş fotoğrafı yükleme ✅ (25 Ocak 2026)
- [x] Bu karakterlerin hikayede rol alması ✅ (25 Ocak 2026)
- [x] Karakter kotasından sayılması (5 karakter limiti içinde) ✅ (25 Ocak 2026)
- [x] AI Analysis for Non-Child Characters (Family Members, Pets, Other, Toys) ✅ (25 Ocak 2026)

---

### 2.3 Ödeme ve Fiyatlandırma
**Öncelik:** 🔴 YÜKSEK

#### 2.3.1 Ücretsiz Kapak Hakkı
**Gereksinimler:**
- [x] Her yeni üyeye **1 adet ücretsiz kapak fotoğrafı** hakkı ✅
- [x] Sadece kapak (sayfa 1) - tam kitap değil ✅
- [x] Kullanıcı hesabında "Ücretsiz Kapak Hakkı" gösterilmeli ✅
- [x] Kullanıldıktan sonra "Kullanıldı" olarak işaretlenmeli ✅

**İş Akışı:**
1. Kullanıcı kayıt olur
2. Hesabında "1 Ücretsiz Kapak Hakkı" görünür
3. Kapak oluşturma sayfasında "Ücretsiz Kapak Oluştur" butonu aktif
4. Kapak oluşturulduktan sonra hak kullanıldı olarak işaretlenir
5. Sonraki kapaklar için ödeme gerekir

#### 2.3.2 Sayfa Sayısına Göre Fiyatlandırma

**Plan 1: Temel (10 Sayfa)**
- **Fiyat:** [Belirlenecek] TL/USD
- **İçerik:** 10 sayfa (1 kapak + 9 iç sayfa)
- **Özellikler:**
  - AI hikaye üretimi
  - AI görsel üretimi
  - E-book formatında indirme
  - 1 adet ücretsiz görsel revize

**Plan 2: Standart (15 Sayfa)**
- **Fiyat:** [Belirlenecek] TL/USD
- **İçerik:** 15 sayfa (1 kapak + 14 iç sayfa)
- **Özellikler:**
  - Plan 1'in tüm özellikleri
  - Daha uzun hikaye
  - 2 adet ücretsiz görsel revize

**Plan 3: Premium (20 Sayfa)**
- **Fiyat:** [Belirlenecek] TL/USD
- **İçerik:** 20 sayfa (1 kapak + 19 iç sayfa)
- **Özellikler:**
  - Plan 2'nin tüm özellikleri
  - En uzun hikaye
  - 3 adet ücretsiz görsel revize
  - Öncelikli destek

**Plan 4: Özel (Özel Sayfa Sayısı)**
- **Fiyat:** Sayfa başına [Belirlenecek] TL/USD
- **İçerik:** Kullanıcı belirler (10-30 sayfa arası)
- **Özellikler:**
  - Esnek sayfa sayısı
  - Özel tema seçenekleri
  - Sınırsız görsel revize (veya daha fazla)

**Fiyatlandırma Mantığı:**
- Base fiyat (10 sayfa) + ek sayfa başına artan fiyat
- Örnek: 10 sayfa = 100 TL, 15 sayfa = 140 TL, 20 sayfa = 180 TL
- Paket indirimleri: 3 kitap al %10 indirim, 5 kitap al %15 indirim

**E-Book vs Basılı Kitap:**
- **E-Book:** Daha ucuz (sadece AI maliyeti)
- **Basılı Kitap:** Daha pahalı (AI + baskı + kargo maliyeti)
- Print-on-Demand entegrasyonu (Printful vb.)

#### 2.3.3 Eski Fiyatlandırma Modeli (Referans - Güncellenecek)

**E-Book (Dijital):**
- Tek kitap: **$7.99** (veya ₺250-300 civarı)
- Anında teslimat (2 saat içinde)
- PDF formatı
- Sınırsız indirme

**Basılı Kitap (Hardcover):**
- Tek kitap: **$34.99** (veya ₺1,000-1,200 civarı)
- 3-5 kitap paketi: %10-15 indirim
- 10+ kitap (kurumsal): %20-25 indirim
- A4 format (21x29.7 cm)
- 24 sayfa
- Mat veya parlak kapak seçimi
- 3 hafta içinde teslimat

#### 2.3.4 Ödeme Entegrasyonu
- [ ] Stripe veya İyzico (Türkiye için) - Planlanıyor
- [ ] Kredi kartı, banka kartı - Planlanıyor
- [ ] PayPal (opsiyonel) - Planlanıyor
- [ ] 3D Secure uyumlu - Planlanıyor

#### 2.3.5 Currency Detection Sistemi ✅ (25 Ocak 2026)
**Gereksinimler:**
- [x] IP-based geolocation ile otomatik currency tespiti ✅
- [x] Vercel header desteği (X-Vercel-IP-Country) ✅
- [x] Fallback mekanizmaları (Cloudflare, Accept-Language) ✅
- [x] Currency mapping (TR→TRY, US→USD, EU→EUR, GB→GBP) ✅

#### 2.3.6 Sepet Sistemi ✅ (25 Ocak 2026)
**Gereksinimler:**
- [x] Sepet context (CartContext) ✅
- [x] Sepet API endpoints (GET, POST, DELETE) ✅
- [x] Sepet sayfası (`/cart`) ✅
- [x] My Library'den hardcopy satın alma (bulk selection) ✅
- [x] Rate limiting API (bot koruması) ✅

---

### 2.4 Web Sitesi İçerik ve Sayfalar
**Öncelik:** 🔴 YÜKSEK

#### 2.4.1 Ana Sayfa (Homepage)
**Gereksinimler:**
- [ ] Hero section: Açıklayıcı başlık ve CTA
- [ ] "Nasıl Çalışır?" bölümü (3 adım):
  1. Karakteri kişiselleştir (fotoğraf yükle)
  2. Hikaye oluştur (tema, stil seç)
  3. Kitabını al (e-book + basılı)
- [ ] Örnek kitap görselleri (carousel)
- [ ] Testimonials / Reviews
- [ ] Features özeti
- [ ] Pricing özeti
- [ ] FAQ (sık sorulan sorular)
- [ ] Footer (iletişim, sosyal medya, yasal)

#### 2.4.2 Features Sayfası
**Gereksinimler:**
- [ ] Tüm özelliklerin detaylı açıklamaları
- [ ] Her özellik için ikon veya görsel
- [ ] Referans: https://magicalchildrensbook.com/features

**Özellikler:**
- Çeşitli illustration stilleri
- Macera dolu hikaye temaları
- 5 karaktere kadar
- Pet ve oyuncak karakterleri
- Her yaşa uygun içerik
- Metinleri ve görselleri düzenleyebilme
- Font seçimi
- Kişisel önsöz

#### 2.4.3 Examples (Örnekler) Sayfası
**Gereksinimler:**
- [ ] Hazır örnek kitaplar
- [ ] Her örnek için önizleme (thumbnail)
- [ ] Kitap içeriğini görüntüleme (modal veya ayrı sayfa)
- [ ] Örnek kategorileri (tema bazlı)

#### 2.4.4 Ideas (Fikirler) Sayfası
**Gereksinimler:**
- [ ] Hazır hikaye fikirleri/şablonları
- [ ] Her fikir için:
  - Başlık
  - Açıklama
  - Örnek hikaye snippet'i
  - Örnek kitap başlığı önerileri
  - Kitap görseli
  - FAQ bölümü
- [ ] Referans: https://magicalchildrensbook.com/idea/toes-and-fingers-adventure

#### 2.4.5 Pricing Sayfası ✅ (25 Ocak 2026)
**Gereksinimler:**
- [x] Fiyatlandırma planları ✅
- [x] E-book vs Basılı kitap karşılaştırması ✅
- [x] Paket fiyatları (1, 3, 5, 10+ kitap) ✅
- [x] Özellik karşılaştırma tablosu ✅
- [x] Kurumsal fiyatlandırma bilgisi ✅
- [x] Currency detection entegrasyonu ✅

#### 2.4.6 For Schools (Okullar İçin) Sayfası
**Öncelik:** 🟢 DÜŞÜK (Post-MVP)

**Gereksinimler:**
- [ ] Anaokulları ve kreşler için özel bilgi
- [ ] Toplu sipariş avantajları
- [ ] İletişim formu
- [ ] Örnek sınıf kitapları (AI üretilmiş)
- [ ] Referanslar ve testimonials

#### 2.4.7 Reviews (İncelemeler) Sayfası
**Öncelik:** 🟡 ORTA

**Gereksinimler:**
- [ ] Kullanıcı yorumları
- [ ] Fotoğraf paylaşımı (kullanıcılar kitaplarını paylaşır)
- [ ] Yıldız puanlama
- [ ] Moderasyon sistemi

#### 2.4.8 Help Center / FAQ
**Öncelik:** 🟡 ORTA

**Gereksinimler:**
- [ ] Kategorize edilmiş SSS
- [ ] Arama fonksiyonu
- [ ] İletişim bilgileri
- [ ] "Kitap nasıl oluşturulur?" rehberi

---

### 2.5 Çok Dilli Destek (i18n) ✅ (24 Ocak 2026)
**Öncelik:** 🟡 ORTA

**Gereksinimler:**
- [x] Türkçe (TR) - Öncelik 1 ✅
- [x] İngilizce (EN) - Öncelik 1 ✅
- [x] Almanca (DE) ✅ (24 Ocak 2026)
- [x] Fransızca (FR) ✅ (24 Ocak 2026)
- [x] İspanyolca (ES) ✅ (24 Ocak 2026)
- [x] Çince (ZH) ✅ (24 Ocak 2026)
- [x] Portekizce (PT) ✅ (24 Ocak 2026)
- [x] Rusça (RU) ✅ (24 Ocak 2026)

**Teknik:**
- [x] i18n library (next-intl, react-intl, vb.) ✅
- [ ] URL yapısı: `/tr/`, `/en/` - Planlanıyor
- [ ] Dil değiştirici (language switcher) - Planlanıyor

**Kapsam:**
- Website UI dili - Planlanıyor
- Hikaye dili (AI hikaye ilgili dilde üretilir) ✅ (8 dil desteği eklendi)

**Yeni Özellikler (24 Ocak 2026):**
- ✅ **8 Dil Desteği:** TR, EN, DE, FR, ES, ZH, PT, RU
- ✅ **Dil Karışıklığı Çözümü:** Prompt'lara güçlü dil talimatları eklendi
- ✅ **System Message Güçlendirildi:** API route'larda system message'a dil talimatı eklendi

---

### 2.6 Checkout ve Sipariş Süreci ✅ (25 Ocak 2026)
**Öncelik:** 🔴 YÜKSEK

**E-Book Satın Alma Akışı:**
1. Kullanıcı kitabı oluşturur ✅
2. Önizleme ekranında "Satın Al" butonu ✅
3. Ödeme sayfası (e-book seçeneği) - Planlanıyor
4. Ödeme tamamlanır - Planlanıyor
5. E-book anında e-posta ile gönderilir - Planlanıyor
6. Dashboard'dan indirilebilir ✅

**Basılı Kitap Satın Alma Akışı:** ✅ (25 Ocak 2026)
1. E-book satın alındıktan sonra "Basılı Kitap Sipariş Et" opsiyonu ✅
2. Adres bilgileri girişi - Planlanıyor
3. Kapak seçimi (mat/parlak) - Planlanıyor
4. Miktar seçimi (1, 3, 5, 10+) ✅ (My Library'den bulk selection)
5. Kargo bilgileri - Planlanıyor
6. Ödeme - Planlanıyor
7. Sipariş onayı - Planlanıyor
8. Print-on-Demand servise sipariş gönderimi - Planlanıyor
9. Kargo takibi - Planlanıyor

**Yeni Özellikler (25 Ocak 2026):**
- ✅ **Sepet Sistemi:** CartContext, API endpoints, Cart page (`/cart`)
- ✅ **My Library Hardcopy:** Bulk selection ve sepete ekleme özelliği
- ✅ **Step 6 Email Input:** Unauthenticated users için email input eklendi

---

## 3. Teknik Gereksinimler

### 3.1 AI Gereksinimleri
**Öncelik:** 🔴 YÜKSEK

#### 3.1.1 Hikaye Metni Üretimi
**Production (Aktif):**
- ✅ GPT-4o (OpenAI) - Aktif kullanılan model
- ✅ JSON format çıktısı
- ✅ Yaş grubuna göre özelleştirilmiş prompt'lar
- ✅ 4000 token limit

**Alternatif Modeller (Gelecek):**
- GPT-4 / GPT-4 Turbo (OpenAI)
- Gemini Pro (Google)
- Claude 3 (Anthropic)

#### 3.1.2 Görsel Üretimi
**Production (Aktif):**
- ✅ GPT-image-1.5 (OpenAI) - Aktif kullanılan model
- ✅ 1024x1536 portrait format (kitap sayfaları için optimize)
- ✅ Quality: low (cost/quality balance)
- ✅ Reference image kullanımı (karakter tutarlılığı için)
- ✅ Rate limiting: 4 images per 90 seconds (Tier 1)

**Alternatif Modeller (Gelecek):**
- DALL-E 3 (OpenAI)
- Midjourney (API bekleniyor)
- Stable Diffusion XL
- Leonardo.ai
- Ideogram

#### 3.1.3 Karakter Tutarlılığı
**Production (Aktif):**
- ✅ Reference image kullanımı (GPT-image-1.5 edits API)
- ✅ Detaylı karakter açıklamaları (prompt'larda)
- ✅ Kıyafet tutarlılığı sistemi (hikaye boyunca aynı kıyafet)
- ✅ Anatomik doğruluk kontrolleri (5 parmak, 2 el, vb.)

**Alternatif Yöntemler (Gelecek):**
- Consistent Character özelliği (Midjourney v6)
- LoRA training (Stable Diffusion)
- Seed ve reference image kombinasyonu

#### 3.1.4 Prompt Yönetimi ve Version Control ✅ (15 Ocak 2026)
**Öncelik:** 🔴 YÜKSEK

**Sistem:**
- ✅ Semantic versioning (major.minor.patch)
- ✅ Kod-Dokümantasyon sync mekanizması
- ✅ Changelog yönetimi
- ✅ Version tracking sistemi

**Yapı:**
- `lib/prompts/` - Kod tarafı (TypeScript)
- `docs/prompts/` - Dokümantasyon tarafı (Markdown)
- Her prompt modülünde `VERSION` objesi
- Otomatik sync kontrolü (`lib/prompts/version-sync.ts`)

**Sorumluluk:**
- @project-manager: Version sync ve takip
- @prompt-manager: Prompt geliştirme ve kalite iyileştirme

**Kurallar:**
- Her kod değişikliği → version bump gerektirir
- Her version bump → changelog entry gerektirir
- Kod ve dokümantasyon version'ları sync olmalı

**Dokümantasyon:**
- `docs/prompts/VERSION_SYNC_GUIDE.md` - Sync sistemi rehberi
- `docs/prompts/VERSION_STATUS.md` - Mevcut sync durumu
- `docs/prompts/CHANGELOG.md` - Version geçmişi

#### 3.1.5 Prompt Kalite İyileştirme Süreçleri ✅ (15 Ocak 2026)
**Öncelik:** 🔴 YÜKSEK

**Story Prompt Kalite Özellikleri:**
- ✅ Word count sistemi (yaş gruplarına göre ortalama):
  - 0-2 yaş: 35-45 kelime/sayfa (ortalama 40)
  - 3-5 yaş: 50-70 kelime/sayfa (ortalama 60)
  - 6-9 yaş: 80-100 kelime/sayfa (ortalama 90)
  - 10+ yaş: 110-130 kelime/sayfa (ortalama 120, maksimum 120)
- ✅ Diyalog ve detaylı anlatım direktifleri
- ✅ Writing style requirements (show don't tell, atmospheric description)
- ✅ Page structure template (opening, action, emotion, transition)
- ✅ Tema-uyumlu kıyafet sistemi

**Image Prompt Kalite Özellikleri:**
- ✅ Cinematic composition elements (lighting, depth, camera angle)
- ✅ 3-level environment descriptions (general → detailed → cinematic)
- ✅ Hybrid prompt system (cinematic + descriptive combination)
- ✅ Foreground/Midground/Background layer system
- ✅ Clothing consistency system (same outfit unless story changes it)
- ✅ Anatomical error prevention (100+ negative prompts)
- ✅ Anatomical correctness directives (5 fingers, 2 hands, proper proportions)
- ✅ Facial skin quality controls (blemishes, moles, marks prevention)
- ✅ Logical/pose error prevention (body rotation, orientation consistency)

**Kalite İyileştirme Süreci:**
- ✅ Kullanıcı feedback'leri → Prompt iyileştirmeleri
- ✅ Görsel kalite sorunları → Negative/Positive prompt eklemeleri
- ✅ Mantık hataları → Prompt direktifleri
- ✅ Log sistemi (word count analizi, clothing directive kontrolü)

**Dokümantasyon:**
- `docs/prompts/STORY_PROMPT_TEMPLATE_v1.0.0.md`
- `docs/prompts/IMAGE_PROMPT_TEMPLATE_v1.0.0.md`
- `docs/prompts/CHANGELOG.md`

#### 3.1.6 Prompt Monitoring ve Logging ✅ (15 Ocak 2026)
**Öncelik:** 🟡 ORTA

**Log Sistemleri:**
- ✅ Story generation word count analizi
- ✅ Theme & clothing style kontrolü
- ✅ Image generation clothing directive kontrolü
- ✅ Formal wear warning kontrolü

**Metrikler:**
- Word count per page (yaş grubuna göre)
- Clothing directive presence
- Anatomical error frequency
- Quality feedback tracking

### 3.2 E-Book Teknolojisi ✅
**Öncelik:** 🔴 YÜKSEK

**Gereksinimler:**
- [x] PDF generation ✅ (A4 landscape, double-page spread)
- [x] Flipbook library (turn.js, react-pageflip, vb.) ✅
- [x] Responsive tasarım ✅
- [x] Supabase Storage'a PDF kaydetme ✅
- [x] İndirme linki oluşturma ✅

### 3.3 Performans Gereksinimleri
- [ ] Hikaye üretim süresi: Maks 2-3 dakika
- [ ] Görsel başına üretim: 30-60 saniye
- [ ] Sayfa yüklenme: < 3 saniye
- [ ] Mobil optimize

### 3.4 Güvenlik ve Gizlilik
- [ ] GDPR uyumlu
- [ ] KVKK uyumlu (Türkiye)
- [ ] Çocuk fotoğrafları şifreli saklama
- [ ] Kullanıcı verisi silme hakkı
- [ ] SSL sertifikası
- [ ] Secure payment gateway

---

## 4. Kullanıcı Deneyimi (UX) Gereksinimleri

### 4.1 Responsive Tasarım
- [ ] Mobil (320px+)
- [ ] Tablet (768px+)
- [ ] Desktop (1024px+)
- [ ] Large desktop (1440px+)

### 4.2 Erişilebilirlik
- [ ] WCAG 2.1 Level AA uyumlu
- [ ] Klavye navigasyonu
- [ ] Screen reader uyumlu
- [ ] Alt text'ler

### 4.3 Tasarım Sistemi
- [ ] Modern, çocuk dostu renk paleti
- [ ] Tutarlı typography
- [ ] Icon set
- [ ] Component library

---

## 5. Başarı Metrikleri (KPI)

**MVP Launch Sonrası:**
- Aylık aktif kullanıcı (MAU): 100+
- E-book dönüşüm oranı: %15+
- E-book'tan basılı kitap dönüşüm: %30+
- Müşteri memnuniyeti: 4.5+ / 5
- Net Promoter Score (NPS): 50+

---

## 6. Out of Scope (MVP Dışı)

**Bu özellikler MVP'ye dahil değil:**
- Mobil uygulama (iOS/Android)
- Video hikayeler
- ~~Sesli kitap~~ ✅ **MVP'ye eklendi (25 Ocak 2026)** - TTS (Text-to-Speech) özelliği eklendi
- Kullanıcı yorumları (başlangıçta)
- Affiliate program
- Hediye kartları
- Abonelik modeli
- Hikaye editörü (gelişmiş) - Basit metin düzenleme MVP'de mevcut
- Topluluk özellikleri

---

## 7. Riskler ve Varsayımlar

### 7.1 Riskler
- **AI maliyeti:** Her kitap için AI API çağrıları pahalı olabilir
- **Karakter tutarlılığı:** AI her sayfada aynı karakteri üretmekte zorlanabilir
- **Print quality:** Print-on-demand kalitesi beklentileri karşılamayabilir
- **Yasal:** Çocuk fotoğrafları ile ilgili yasal zorluklar
- **Rekabet:** Benzer ürünler piyasaya girebilir

### 7.2 Varsayımlar
- Ebeveynler AI üretilmiş içerik için ödeme yapmaya razı
- AI teknolojisi yeterince olgun (karakter tutarlılığı)
- Print-on-demand servisleri kaliteli ve hızlı
- Kullanıcılar 2 saat içinde teslimatı kabul edilebilir bulur

---

## 8. Referanslar

- https://magicalchildrensbook.com/
- https://magicalchildrensbook.com/features
- https://magicalchildrensbook.com/idea/toes-and-fingers-adventure

---

**Sonraki Adımlar:**
1. ✅ Teknik araştırma tamamlandı
2. ✅ AI stratejisi belirlendi (GPT-4o + GPT-image-1.5)
3. ✅ Platform kararı verildi (Next.js + Supabase)
4. ✅ MVP özellikleri netleştirildi
5. ✅ Prompt yönetimi sistemi kuruldu (15 Ocak 2026)
6. ✅ Prompt kalite iyileştirme süreçleri implement edildi (15 Ocak 2026)
7. ✅ Multi-character desteği eklendi (5 karaktere kadar) (25 Ocak 2026)
8. ✅ TTS (Text-to-Speech) özelliği eklendi (25 Ocak 2026)
9. ✅ Currency detection sistemi eklendi (25 Ocak 2026)
10. ✅ Sepet sistemi eklendi (25 Ocak 2026)
11. ✅ Pricing sayfası oluşturuldu (25 Ocak 2026)
12. ✅ Image Edit Feature eklendi (17 Ocak 2026)
13. ✅ 8 dil desteği eklendi (24 Ocak 2026)
14. ✅ PDF generation sistemi eklendi
15. ✅ Pet ve oyuncak karakterleri eklendi (25 Ocak 2026)

**Eklenen Özellikler (15 Ocak 2026):**
- Prompt version sync ve takip sistemi
- Semantic versioning sistemi (major.minor.patch)
- Kod-dokümantasyon sync mekanizması
- Prompt kalite iyileştirme özellikleri (word count, cinematic composition, anatomical error prevention)
- Log ve monitoring sistemi

**Eklenen Özellikler (17 Ocak 2026):**
- Image Edit Feature (ChatGPT-style mask-based editing)
- Version history ve revert sistemi
- Parent-only access (Book Settings page)
- Prompt security enhancements

**Eklenen Özellikler (24 Ocak 2026):**
- 8 dil desteği (TR, EN, DE, FR, ES, ZH, PT, RU)
- Dil karışıklığı çözümü (güçlü dil talimatları)
- System message güçlendirildi

**Eklenen Özellikler (25 Ocak 2026):**
- Multi-character desteği (5 karaktere kadar)
- Pet ve oyuncak karakterleri (Family Members, Pets, Other, Toys)
- AI Analysis for Non-Child Characters
- Currency detection sistemi (IP-based geolocation)
- Sepet sistemi (CartContext, API endpoints, Cart page)
- Pricing sayfası (`/pricing`)
- My Library hardcopy satın alma (bulk selection)
- TTS (Text-to-Speech) özelliği
- Rate limiting API (bot koruması)

**Doküman Sahibi:** Proje Ekibi  
**Son Güncelleme:** 26 Ocak 2026

