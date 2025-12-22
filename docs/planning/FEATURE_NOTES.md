# 📝 Özellik Notları ve İyileştirmeler
# KidStoryBook Platform

**Doküman Versiyonu:** 1.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Aktif Notlar

---

## 🔐 1. Üyelik ve Kimlik Doğrulama Sistemi

### Gereksinimler:
- **Normal Üyelik:** Email + şifre ile kayıt
- **OAuth Entegrasyonları:**
  - Google Sign-In
  - Instagram Login
  - Facebook Login
  - Diğer popüler OAuth sağlayıcıları (isteğe bağlı)
- **Standart Güvenlik:**
  - JWT token tabanlı authentication
  - Email doğrulama
  - Şifre sıfırlama
  - Session yönetimi
  - 2FA (isteğe bağlı, gelecekte)

### Teknik Detaylar:
- **Backend:** JWT authentication middleware
- **Frontend:** OAuth popup/redirect flow
- **Database:** User tablosu + OAuth provider bilgileri
- **Güvenlik:** HTTPS, secure cookies, CSRF protection

### Kullanıcı Deneyimi:
- İlk ziyarette "Giriş Yap" / "Kayıt Ol" seçenekleri
- OAuth butonları: "Google ile Giriş", "Instagram ile Giriş", "Facebook ile Giriş"
- Kayıt sonrası email doğrulama
- Profil sayfası

---

## 🎁 2. Ücretsiz Kapak Fotoğrafı

### Gereksinimler:
- Her yeni üyeye **1 adet ücretsiz kapak fotoğrafı** hakkı
- Sadece kapak (sayfa 1) - tam kitap değil
- Kullanıcı hesabında "Ücretsiz Kapak Hakkı" gösterilmeli
- Kullanıldıktan sonra "Kullanıldı" olarak işaretlenmeli

### İş Akışı:
1. Kullanıcı kayıt olur
2. Hesabında "1 Ücretsiz Kapak Hakkı" görünür
3. Kapak oluşturma sayfasında "Ücretsiz Kapak Oluştur" butonu aktif
4. Kapak oluşturulduktan sonra hak kullanıldı olarak işaretlenir
5. Sonraki kapaklar için ödeme gerekir

### Teknik Detaylar:
- Database: `user_free_cover_used` boolean field
- Backend: Free cover kontrolü middleware
- Frontend: Free cover badge/indicator

---

## 💰 3. Sayfa Sayısına Göre Fiyatlandırma

### Fiyatlandırma Planları:

#### Plan 1: Temel (10 Sayfa)
- **Fiyat:** [Belirlenecek] TL/USD
- **İçerik:** 10 sayfa (1 kapak + 9 iç sayfa)
- **Özellikler:**
  - AI hikaye üretimi
  - AI görsel üretimi
  - E-book formatında indirme
  - 1 adet ücretsiz görsel revize

#### Plan 2: Standart (15 Sayfa)
- **Fiyat:** [Belirlenecek] TL/USD
- **İçerik:** 15 sayfa (1 kapak + 14 iç sayfa)
- **Özellikler:**
  - Plan 1'in tüm özellikleri
  - Daha uzun hikaye
  - 2 adet ücretsiz görsel revize

#### Plan 3: Premium (20 Sayfa)
- **Fiyat:** [Belirlenecek] TL/USD
- **İçerik:** 20 sayfa (1 kapak + 19 iç sayfa)
- **Özellikler:**
  - Plan 2'nin tüm özellikleri
  - En uzun hikaye
  - 3 adet ücretsiz görsel revize
  - Öncelikli destek

#### Plan 4: Özel (Özel Sayfa Sayısı)
- **Fiyat:** Sayfa başına [Belirlenecek] TL/USD
- **İçerik:** Kullanıcı belirler (10-30 sayfa arası)
- **Özellikler:**
  - Esnek sayfa sayısı
  - Özel tema seçenekleri
  - Sınırsız görsel revize (veya daha fazla)

### Fiyatlandırma Mantığı:
- Base fiyat (10 sayfa) + ek sayfa başına artan fiyat
- Örnek: 10 sayfa = 100 TL, 15 sayfa = 140 TL, 20 sayfa = 180 TL
- Paket indirimleri: 3 kitap al %10 indirim, 5 kitap al %15 indirim

### E-book vs Basılı Kitap:
- **E-book:** Daha ucuz (sadece AI maliyeti)
- **Basılı Kitap:** Daha pahalı (AI + baskı + kargo maliyeti)
- Print-on-Demand entegrasyonu (Printful vb.)

---

## ✏️ 4. Kitap Düzenleme (Edit) Özellikleri

### Metin Düzenleme:
- Kullanıcılar oluşturdukları kitapların metinlerini düzenleyebilmeli
- Her sayfanın metnini değiştirebilmeli
- Değişiklikler kaydedilmeli
- Yeni versiyon oluşturulmalı (versioning)

### Görsel Revize:
- Her satın alım için **1 adet ücretsiz görsel revize** hakkı
- Kullanıcı beğenmediği bir görseli revize edebilmeli
- Revize hakkı kullanıldıktan sonra ek revizeler ücretli olmalı
- Revize sayısı kullanıcı hesabında gösterilmeli

### İş Akışı:
1. Kullanıcı kitabını görüntüler
2. "Düzenle" butonuna tıklar
3. Metin düzenleme modu açılır
4. Her sayfanın metnini düzenleyebilir
5. Görsel revize için "Görseli Yeniden Oluştur" butonu
6. Revize hakkı kontrol edilir (ücretsiz/ücretli)
7. Değişiklikler kaydedilir

### Teknik Detaylar:
- **Database:** 
  - `book_versions` tablosu (versioning için)
  - `user_revise_credits` tablosu (revize hakları)
- **Backend:** 
  - Edit endpoint'leri
  - Revize kontrolü middleware
  - Versioning sistemi
- **Frontend:**
  - Inline text editor
  - Görsel revize butonu
  - Revize hakkı göstergesi

---

## 📚 5. Kullanıcı Kitaplığı

### Gereksinimler:
- Kullanıcılar hesabına girdiğinde tüm kitaplarını görebilmeli
- Kitaplar listelenmeli (grid veya liste görünümü)
- Her kitap için:
  - Kapak görseli
  - Kitap adı
  - Oluşturulma tarihi
  - Durum (tamamlandı, taslak, işleniyor)
  - Aksiyonlar (görüntüle, düzenle, indir, paylaş, sil)

### Özellikler:
- **Filtreleme:**
  - Tüm kitaplar
  - Tamamlananlar
  - Taslaklar
  - Favoriler
- **Sıralama:**
  - Tarihe göre (yeni-eski, eski-yeni)
  - Ada göre (A-Z, Z-A)
- **Arama:**
  - Kitap adına göre arama
- **Görünüm:**
  - Grid görünümü (kapak görselleri)
  - Liste görünümü (detaylı bilgi)

### Teknik Detaylar:
- **Database:** `books` tablosu (user_id foreign key)
- **Backend:** 
  - `/api/user/books` endpoint
  - Filtreleme, sıralama, arama
- **Frontend:**
  - Kitaplık sayfası
  - Kitap kartları
  - Filtreleme/sıralama UI

---

## 📊 6. Analytics ve İstatistikler

### Gereksinimler:
- **Web Analytics:** Kimin gelip gittiğini, hangi sayfaların ziyaret edildiğini, kullanıcı davranışlarını takip etmek
- **E-ticaret Analytics:** Satış dönüşüm oranları, hangi sayfadan satın alma yapıldığı, sepet terk oranları
- **Kullanıcı Analizi:** Kullanıcı yolculuğu (user journey), hangi adımda çıkış yapıldığı, en çok kullanılan özellikler
- **Performans Metrikleri:** Sayfa yükleme süreleri, hata oranları, API yanıt süreleri

### Önerilen Çözüm:
- **Google Analytics 4 (GA4):** Ana analytics platformu
  - Trafik kaynakları analizi
  - Kullanıcı demografisi
  - Davranış akışı (behavior flow)
  - Dönüşüm takibi (conversion tracking)
  - Özel event'ler (kitap oluşturma, satın alma, vb.)
- **Google Tag Manager (GTM):** Tag yönetimi için
- **Hotjar veya Microsoft Clarity:** Kullanıcı davranış analizi (heatmaps, session recordings)
- **Custom Dashboard:** Backend'de kendi analytics verilerimiz (kitap oluşturma sayıları, popüler temalar, vb.)

### Teknik Detaylar:
- **Frontend:** GA4 tracking code, event tracking
- **Backend:** Custom analytics endpoint'leri
- **Database:** Analytics verileri için ayrı tablolar (opsiyonel)
- **Dashboard:** Admin panelinde analytics görünümü

### Önemli Metrikler:
- Günlük/haftalık/aylık ziyaretçi sayısı
- Dönüşüm oranı (ziyaretçi → kitap oluşturma → satın alma)
- Ortalama sepet değeri
- En popüler temalar ve stiller
- Kullanıcı çıkış noktaları (exit points)
- Mobil vs Desktop kullanım oranları

---

## 📝 7. Blog Sayfası ve İçerik Yönetimi

### Gereksinimler:
- **Blog Sayfası:** SEO için içerik üretimi ve yayınlama
- **İçerik Konuları:**
  - Çocuklar ile ilgili makaleler (eğitim, gelişim, aktiviteler)
  - Ürünümüz ile ilgili içerikler (kullanım örnekleri, başarı hikayeleri)
  - Ebeveynlik ipuçları
  - Okuma alışkanlığı kazandırma
  - Kişiselleştirilmiş kitapların faydaları
- **SEO Optimizasyonu:** Google aramalarında üst sıralarda çıkmak için
- **İçerik Yönetimi:** Admin panelinden blog yazıları ekleme/düzenleme

### Özellikler:
- **Blog Listesi:** Tüm blog yazılarını listeleme
- **Blog Detay:** Tek bir blog yazısını görüntüleme
- **Kategoriler:** Blog yazılarını kategorilere ayırma
- **Etiketler (Tags):** Blog yazılarını etiketleme
- **Arama:** Blog yazılarında arama yapma
- **Yorumlar (Opsiyonel):** Kullanıcıların yorum yapabilmesi
- **Paylaşım:** Sosyal medyada paylaşma butonları
- **İlgili Yazılar:** Benzer blog yazılarını önerme

### Teknik Detaylar:
- **Backend:** 
  - Blog CRUD endpoint'leri
  - CMS (Content Management System) için admin paneli
  - SEO meta tag'leri yönetimi
- **Frontend:**
  - Blog listesi sayfası
  - Blog detay sayfası
  - SEO-friendly URL yapısı (`/blog/makale-basligi`)
- **Database:** 
  - `blog_posts` tablosu
  - `blog_categories` tablosu
  - `blog_tags` tablosu
- **SEO:**
  - Meta title, description
  - Open Graph tags
  - Structured data (Schema.org)
  - Sitemap.xml

### İçerik Stratejisi:
- Haftada en az 1-2 blog yazısı
- Uzun kuyruk (long-tail) anahtar kelimeler
- İç linkleme (internal linking)
- Görsel optimizasyonu
- Mobil uyumlu içerik

---

## 📱 8. Sosyal Medya Yönetimi

### Gereksinimler:
- **Sosyal Medya Hesapları:** 
  - Instagram (görsel ağırlıklı, kitap örnekleri)
  - Facebook (topluluk oluşturma, reklam)
  - TikTok (kısa videolar, kitap oluşturma süreci)
  - Pinterest (görsel keşif, kitap örnekleri)
  - Twitter/X (güncellemeler, haberler)
- **İçerik Yönetimi:**
  - Düzenli paylaşım takvimi
  - Kitap örnekleri paylaşımı
  - Kullanıcı testimonial'ları
  - Eğitici içerikler
  - Promosyon ve kampanyalar
- **Reklam Yönetimi:**
  - Facebook/Instagram Ads
  - Google Ads
  - Reklam bütçesi yönetimi
  - A/B testleri
  - Dönüşüm takibi

### Özellikler:
- **Sosyal Medya Entegrasyonu:**
  - Web sitesinden direkt paylaşım
  - Otomatik paylaşım (yeni blog yazısı, yeni özellik)
  - Sosyal medya login (OAuth)
- **Paylaşım Araçları:**
  - Kitap paylaşma butonları
  - Referans linkleri
  - Sosyal medya widget'ları
- **Analytics:**
  - Sosyal medya trafiği takibi
  - Hangi platformdan daha fazla ziyaretçi geldiği
  - Paylaşım sayıları

### Teknik Detaylar:
- **Frontend:**
  - Sosyal medya paylaşım butonları
  - Open Graph meta tags (paylaşım önizlemesi için)
  - Sosyal medya login entegrasyonu
- **Backend:**
  - Sosyal medya API entegrasyonları (opsiyonel)
  - Paylaşım tracking
- **Araçlar:**
  - Buffer veya Hootsuite (paylaşım yönetimi)
  - Canva (görsel tasarım)
  - Facebook Business Manager (reklam yönetimi)

### İçerik Stratejisi:
- Günlük/haftalık paylaşım planı
- Kullanıcı içeriği (user-generated content)
- Influencer işbirlikleri
- Hashtag stratejisi
- Reklam kampanyaları (yeni ürün lansmanı, özel günler)

---

## ⚖️ 9. Hukuki Gereklilikler ve Yasal Uyumluluk

### Gereksinimler:
- **Kullanım Şartları (Terms of Service):**
  - Hizmet kullanım koşulları
  - Kullanıcı sorumlulukları
  - Fikri mülkiyet hakları
  - Hizmet kesintileri ve sınırlamalar
  - İptal ve iade politikası
- **Gizlilik Politikası (Privacy Policy):**
  - Toplanan veriler
  - Veri kullanım amaçları
  - Veri paylaşımı
  - Cookie politikası
  - Kullanıcı hakları
- **KVKK (Kişisel Verilerin Korunması Kanunu) Uyumluluğu:**
  - Aydınlatma metni
  - Açık rıza (explicit consent)
  - Veri saklama süreleri
  - Veri silme hakkı
  - Veri güvenliği önlemleri
- **Üyelik Sözleşmesi:**
  - Üyelik koşulları
  - Hesap yönetimi
  - Ödeme koşulları
  - Hesap iptali

### Teknik Detaylar:
- **Sayfalar:**
  - `/terms` - Kullanım Şartları
  - `/privacy` - Gizlilik Politikası
  - `/kvkk` - KVKK Aydınlatma Metni
  - `/membership-agreement` - Üyelik Sözleşmesi
- **Frontend:**
  - Footer'da linkler
  - Kayıt sırasında onay checkbox'ları
  - Cookie banner (GDPR/KVKK için)
- **Backend:**
  - Kullanıcı onay kayıtları
  - Veri silme endpoint'i
  - Veri dışa aktarma endpoint'i (GDPR için)
- **Database:**
  - `user_consents` tablosu (onay kayıtları)
  - Veri saklama süreleri takibi

### Yasal Danışmanlık:
- **Önerilen:** Hukuk danışmanı ile çalışmak
- **Şablonlar:** Termly.io, iubenda gibi servislerden başlangıç şablonları alınabilir
- **Güncelleme:** Yasal değişikliklere göre düzenli güncelleme gerekli

### Önemli Noktalar:
- **Çocuk Verileri:** Özel dikkat gerektirir (COPPA uyumluluğu - ABD için)
- **Fotoğraf Kullanımı:** Kullanıcıların fotoğraf yükleme izni ve kullanım hakları
- **AI İçerik:** AI tarafından üretilen içeriklerin telif hakları
- **Uluslararası:** Farklı ülkeler için farklı yasal gereklilikler (GDPR - AB, KVKK - Türkiye)

---

## 📋 Ek Notlar

### Öncelik Sırası:
1. ✅ Üyelik sistemi (kritik - diğer özellikler için gerekli)
2. ✅ Ücretsiz kapak (marketing - kullanıcı çekmek için)
3. ✅ Fiyatlandırma sistemi (gelir için kritik)
4. ✅ Edit özellikleri (kullanıcı memnuniyeti)
5. ✅ Kitaplık (kullanıcı deneyimi)
6. ✅ Analytics (iş zekası ve optimizasyon için kritik)
7. ✅ Hukuki gereklilikler (yasal zorunluluk - MVP'de olmalı)
8. 🟡 Blog (SEO ve içerik marketing - Post-MVP)
9. 🟡 Sosyal medya yönetimi (satış için kritik ama sürekli içerik gerektirir)

### Gelecek Özellikler (İleride):
- Kitap paylaşma (sosyal medya)
- Favorilere ekleme
- Kitap kategorileri
- Toplu indirme
- PDF export
- Print-on-Demand entegrasyonu
- Referans programı
- Abonelik planları (aylık/yıllık)
- Email marketing (newsletter, kampanyalar)
- A/B testleri (landing page optimizasyonu)

---

**Son Güncelleme:** 21 Aralık 2025

