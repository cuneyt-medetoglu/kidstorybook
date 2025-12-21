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

## 📋 Ek Notlar

### Öncelik Sırası:
1. ✅ Üyelik sistemi (kritik - diğer özellikler için gerekli)
2. ✅ Ücretsiz kapak (marketing - kullanıcı çekmek için)
3. ✅ Fiyatlandırma sistemi (gelir için kritik)
4. ✅ Edit özellikleri (kullanıcı memnuniyeti)
5. ✅ Kitaplık (kullanıcı deneyimi)

### Gelecek Özellikler (İleride):
- Kitap paylaşma (sosyal medya)
- Favorilere ekleme
- Kitap kategorileri
- Toplu indirme
- PDF export
- Print-on-Demand entegrasyonu
- Referans programı
- Abonelik planları (aylık/yıllık)

---

**Son Güncelleme:** 21 Aralık 2025

