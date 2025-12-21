# 📄 Product Requirements Document (PRD)
# KidStoryBook Platform

**Doküman Versiyonu:** 1.1  
**Tarih:** 21 Aralık 2025  
**Son Güncelleme:** 21 Aralık 2025  
**Durum:** TASLAK - FAZ 1 (Güncellendi: Üyelik, Fiyatlandırma, Edit, Kitaplık eklendi)

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
- [ ] Email + şifre ile kayıt
- [ ] Email doğrulama
- [ ] Şifre sıfırlama
- [ ] Profil yönetimi
- [ ] Hesap silme

#### 2.0.2 OAuth Entegrasyonları
**Gereksinimler:**
- [ ] Google Sign-In
- [ ] Instagram Login
- [ ] Facebook Login
- [ ] Diğer popüler OAuth sağlayıcıları (isteğe bağlı)

**Teknik Notlar:**
- JWT token tabanlı authentication
- Secure session yönetimi
- CSRF protection
- HTTPS zorunlu

#### 2.0.3 Kullanıcı Kitaplığı
**Gereksinimler:**
- [ ] Kullanıcılar hesabına girdiğinde tüm kitaplarını görebilmeli
- [ ] Grid/Liste görünümü
- [ ] Filtreleme (tamamlanan, taslak, favoriler)
- [ ] Sıralama (tarih, isim)
- [ ] Arama (kitap adına göre)
- [ ] Her kitap için aksiyonlar (görüntüle, düzenle, indir, paylaş, sil)

**Kitap Durumları:**
- Taslak (henüz tamamlanmamış)
- İşleniyor (AI kitap oluşturuyor)
- Tamamlandı (hazır)
- Arşivlendi

### 2.1 Core Features (MVP - Olmazsa Olmaz)

#### 2.1.1 Karakter Oluşturma ve Kişiselleştirme
**Öncelik:** 🔴 YÜKSEK

**Gereksinimler:**
- [ ] Çocuk fotoğrafı yükleme (maks 5MB, JPG/PNG)
- [ ] Çocuğun adı, yaşı, cinsiyeti girişi
- [ ] Saç rengi, göz rengi seçimi (opsiyonel)
- [ ] Karakterin fiziksel özellikleri (gözlük, saç stili vb.)
- [ ] **5 karaktere kadar** tek hikayede yer alma
- [ ] Karakter rolü seçimi (ana karakter, yan karakter)

**Teknik Notlar:**
- Fotoğraf AI tarafından analiz edilecek
- Face detection ve cropping otomatik
- GDPR/KVKK uyumlu fotoğraf saklama

#### 2.1.2 Hikaye Oluşturma
**Öncelik:** 🔴 YÜKSEK

**Gereksinimler:**
- [ ] Tema seçimi (macera, peri masalı, eğitici, vb.)
- [ ] Alt-tema/konu seçimi (dinozor, uzay, deniz altı, vb.)
- [ ] Yaş grubuna uygun hikaye (0-2, 3-5, 6-9 yaş)
- [ ] Hikaye uzunluğu: **24 sayfa** (standart)
- [ ] Özel istekler alanı (text input):
  - "Kitapta ayıcık olsun"
  - "Top oynama sahnesi olsun"
  - "Kahramanımız uçak kullansın"
- [ ] Dil seçimi (TR, EN + gelecekte diğer diller)

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
- [ ] Watercolor (Sulu boya)
- [ ] 3D Animation (3D animasyon)
- [ ] Cartoon (Çizgi film)
- [ ] Realistic (Realistik)
- [ ] Minimalist
- [ ] Vintage Storybook

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
- [ ] Flipbook tarzı sayfa çevirme animasyonu
- [ ] Mobil ve desktop uyumlu
- [ ] Sol sayfa: Hikaye metni
- [ ] Sağ sayfa: AI üretilmiş görsel
- [ ] Navigasyon: İleri, geri, sayfa numarası
- [ ] Zoom in/out özelliği
- [ ] Tam ekran modu
- [ ] İndirme butonu (PDF formatında)

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
- [ ] Kullanıcılar oluşturdukları kitapların metinlerini düzenleyebilmeli
- [ ] Her sayfanın metnini değiştirebilmeli
- [ ] Değişiklikler kaydedilmeli
- [ ] Versioning sistemi (değişiklik geçmişi)

**Görsel Revize:**
- [ ] Her satın alım için **1 adet ücretsiz görsel revize** hakkı
- [ ] Kullanıcı beğenmediği bir görseli revize edebilmeli
- [ ] Revize hakkı kullanıldıktan sonra ek revizeler ücretli olmalı
- [ ] Revize sayısı kullanıcı hesabında gösterilmeli

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
- [ ] Evcil hayvan fotoğrafı yükleme
- [ ] Oyuncak/peluş fotoğrafı yükleme
- [ ] Bu karakterlerin hikayede rol alması
- [ ] Karakter kotasından sayılması (5 karakter limiti içinde)

---

### 2.3 Ödeme ve Fiyatlandırma
**Öncelik:** 🔴 YÜKSEK

#### 2.3.1 Ücretsiz Kapak Hakkı
**Gereksinimler:**
- [ ] Her yeni üyeye **1 adet ücretsiz kapak fotoğrafı** hakkı
- [ ] Sadece kapak (sayfa 1) - tam kitap değil
- [ ] Kullanıcı hesabında "Ücretsiz Kapak Hakkı" gösterilmeli
- [ ] Kullanıldıktan sonra "Kullanıldı" olarak işaretlenmeli

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
- [ ] Stripe veya İyzico (Türkiye için)
- [ ] Kredi kartı, banka kartı
- [ ] PayPal (opsiyonel)
- [ ] 3D Secure uyumlu

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

#### 2.4.5 Pricing Sayfası
**Gereksinimler:**
- [ ] Fiyatlandırma planları
- [ ] E-book vs Basılı kitap karşılaştırması
- [ ] Paket fiyatları (1, 3, 5, 10+ kitap)
- [ ] Özellik karşılaştırma tablosu
- [ ] Kurumsal fiyatlandırma bilgisi

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

### 2.5 Çok Dilli Destek (i18n)
**Öncelik:** 🟡 ORTA

**Gereksinimler:**
- [ ] Türkçe (TR) - Öncelik 1
- [ ] İngilizce (EN) - Öncelik 1
- [ ] Almanca (DE) - Gelecek
- [ ] Fransızca (FR) - Gelecek
- [ ] İspanyolca (ES) - Gelecek

**Teknik:**
- [ ] i18n library (next-intl, react-intl, vb.)
- [ ] URL yapısı: `/tr/`, `/en/`
- [ ] Dil değiştirici (language switcher)

**Kapsam:**
- Website UI dili
- Hikaye dili (AI hikaye ilgili dilde üretilir)

---

### 2.6 Checkout ve Sipariş Süreci
**Öncelik:** 🔴 YÜKSEK

**E-Book Satın Alma Akışı:**
1. Kullanıcı kitabı oluşturur
2. Önizleme ekranında "Satın Al" butonu
3. Ödeme sayfası (e-book seçeneği)
4. Ödeme tamamlanır
5. E-book anında e-posta ile gönderilir
6. Dashboard'dan indirilebilir

**Basılı Kitap Satın Alma Akışı:**
1. E-book satın alındıktan sonra "Basılı Kitap Sipariş Et" opsiyonu
2. Adres bilgileri girişi
3. Kapak seçimi (mat/parlak)
4. Miktar seçimi (1, 3, 5, 10+)
5. Kargo bilgileri
6. Ödeme
7. Sipariş onayı
8. Print-on-Demand servise sipariş gönderimi
9. Kargo takibi

---

## 3. Teknik Gereksinimler

### 3.1 AI Gereksinimleri
**Öncelik:** 🔴 YÜKSEK

**Hikaye Metni Üretimi:**
- GPT-4 / GPT-4 Turbo (OpenAI)
- Gemini Pro (Google)
- Claude 3 (Anthropic)

**Görsel Üretimi:**
- DALL-E 3 (OpenAI)
- Midjourney (API bekleniyor)
- Stable Diffusion XL
- Leonardo.ai
- Ideogram

**Karakter Tutarlılığı:**
- Consistent Character özelliği (Midjourney v6)
- LoRA training (Stable Diffusion)
- Seed ve reference image kullanımı

### 3.2 E-Book Teknolojisi
**Öncelik:** 🔴 YÜKSEK

**Gereksinimler:**
- [ ] PDF generation
- [ ] Flipbook library (turn.js, react-pageflip, vb.)
- [ ] Responsive tasarım

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
- Sesli kitap
- Kullanıcı yorumları (başlangıçta)
- Affiliate program
- Hediye kartları
- Abonelik modeli
- Hikaye editörü (gelişmiş)
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
1. Teknik araştırma tamamlanacak
2. AI stratejisi belirlenecek
3. Platform kararı verilecek (Shopify vs Custom)
4. MVP özellikleri netleştirilecek

**Doküman Sahibi:** Proje Ekibi  
**Son Güncelleme:** 21 Aralık 2025

