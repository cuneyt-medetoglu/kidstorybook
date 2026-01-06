# 🏢 B2B (Business-to-Business) Özellik Analizi

**Tarih:** 4 Ocak 2026  
**Durum:** Post-MVP / Gelecek Özellik  
**Öncelik:** 🟡 Orta-Yüksek (MVP sonrası önemli gelir kaynağı olabilir)

---

## 📋 Genel Bakış

### Fikir Özeti
Sisteme sadece bireysel kullanıcılar değil, kreşler, özel okullar, eğitim kurumları gibi şirketlerin de girip toplu olarak kitap yapabileceği bir B2B (Business-to-Business) yapısı.

### Hedef Kitle
- **Kreşler** (Anaokulları)
- **Özel Okullar** (İlkokul, ortaokul)
- **Eğitim Kurumları**
- **Çocuk Etkinlik Merkezleri**
- **Özel Eğitim Kurumları**
- **Kurumsal Hediyelik Şirketleri** (çocuklara özel hediyeler)

---

## 🎯 Temel Özellikler

### 1. Şirket/Kurum Kayıt Sistemi
**Açıklama:** Şirketler için özel kayıt ve doğrulama sistemi.

**Gereksinimler:**
- Şirket adı, vergi numarası, adres bilgileri
- Yetkili kişi bilgileri (ad, soyad, email, telefon)
- Şirket tipi seçimi (kreş, okul, eğitim kurumu, vb.)
- Şirket doğrulama süreci (manuel onay gerekebilir)
- Şirket logo yükleme

**Database Şeması:**
```sql
-- Yeni tablo: organizations
organizations:
  - id (UUID, primary key)
  - name (string) - Şirket adı
  - tax_number (string, nullable) - Vergi numarası
  - organization_type (string) - 'kindergarten', 'school', 'education_center', 'other'
  - address (text)
  - phone (string)
  - email (string)
  - logo_url (string, nullable)
  - verified (boolean, default false) - Doğrulama durumu
  - created_at (timestamp)
  - updated_at (timestamp)

-- Yeni tablo: organization_members
organization_members:
  - id (UUID, primary key)
  - organization_id (UUID, foreign key → organizations)
  - user_id (UUID, foreign key → users)
  - role (string) - 'admin', 'member', 'viewer'
  - created_at (timestamp)

-- Mevcut users tablosuna ekleme:
users:
  - organization_id (UUID, nullable, foreign key → organizations)
  - account_type (string, default 'individual') - 'individual' | 'organization'
```

### 2. Admin Paneli / Şirket Dashboard'u
**Açıklama:** Şirketlerin oluşturdukları kitapları görüntüleyebileceği, yönetebileceği bir panel.

**Özellikler:**
- Tüm kitapları görüntüleme (grid/list view)
- Kitap durumu takibi (tamamlandı, işleniyor, taslak)
- Toplu işlemler (seçili kitapları silme, indirme, vb.)
- Filtreleme ve arama (çocuk adına göre, tarihe göre)
- İstatistikler (toplam kitap sayısı, tamamlanan, vb.)
- Ebeveyn paylaşım linkleri yönetimi

**UI Bileşenleri:**
- Dashboard ana sayfa (istatistikler, son kitaplar)
- Kitaplık sayfası (tüm kitaplar)
- Kitap detay sayfası
- Ebeveyn paylaşım yönetimi
- Toplu işlem paneli

### 3. Toplu Kitap Oluşturma
**Açıklama:** Şirketlerin birden fazla çocuk için aynı anda kitap oluşturabilmesi.

**İş Akışı:**
1. Şirket admin panelinden "Toplu Kitap Oluştur" butonuna tıklar
2. Excel/CSV dosyası yükler veya manuel olarak çocuk bilgilerini girer
3. Her çocuk için:
   - Ad, yaş, cinsiyet
   - Fotoğraf (toplu yükleme)
   - Tema ve stil seçimi (tüm çocuklar için aynı veya bireysel)
4. Toplu işlem başlatılır
5. Her kitap için ayrı ayrı AI işlemi çalışır (queue sistemi)
6. Tamamlanan kitaplar dashboard'da görünür

**CSV Format Örneği:**
```csv
name,age,gender,hair_color,eye_color,photo_url,theme,style
Arya,5,girl,blonde,blue,https://...,adventure,watercolor
Mehmet,6,boy,brown,brown,https://...,adventure,watercolor
...
```

**Teknik Gereksinimler:**
- Bulk upload API endpoint
- Queue sistemi (uzun işlemler için)
- Progress tracking (kaç kitap tamamlandı)
- Error handling (bir kitap başarısız olursa diğerleri devam etmeli)

### 4. Ebeveynlerle Link Paylaşımı
**Açıklama:** Şirketler oluşturdukları kitapları ebeveynlerle özel link ile paylaşabilmeli.

**Özellikler:**
- Her kitap için benzersiz paylaşım linki oluşturma
- Link süresi ayarlama (süresiz, 30 gün, 90 gün)
- Şifre korumalı paylaşım (opsiyonel)
- Ebeveynler linke tıklayınca:
  - Kitabı görüntüleyebilir (e-book viewer)
  - PDF indirebilir
  - Basılı kitap siparişi verebilir
  - Kendi hesabına ekleyebilir (opsiyonel)

**Database Şeması:**
```sql
-- Yeni tablo: book_shares
book_shares:
  - id (UUID, primary key)
  - book_id (UUID, foreign key → books)
  - organization_id (UUID, foreign key → organizations)
  - share_token (string, unique) - Paylaşım linki token'ı
  - password_hash (string, nullable) - Şifre korumalı ise
  - expires_at (timestamp, nullable) - Link süresi
  - access_count (integer, default 0) - Kaç kez erişildi
  - created_at (timestamp)
```

**URL Formatı:**
```
https://kidstorybook.com/share/{share_token}
```

### 5. Toplu Baskı Yapma
**Açıklama:** Şirketler birden fazla kitabı toplu olarak basılı kitap olarak sipariş edebilmeli.

**Özellikler:**
- Sepete birden fazla kitap ekleme
- Toplu sipariş oluşturma
- Adetlere göre özel fiyatlandırma (10 kitap = %10 indirim, 50 kitap = %20 indirim, vb.)
- Toplu teslimat adresi (şirket adresi)
- Sipariş takibi (toplu sipariş durumu)

**Fiyatlandırma Örneği:**
| Adet | İndirim | Birim Fiyat |
|------|---------|-------------|
| 1-9 | %0 | $15.99 |
| 10-24 | %10 | $14.39 |
| 25-49 | %15 | $13.59 |
| 50-99 | %20 | $12.79 |
| 100+ | %25 | $11.99 |

### 6. Adetlere Göre Özel Fiyatlandırma
**Açıklama:** Şirketler için toplu alımlarda özel fiyatlandırma sistemi.

**Özellikler:**
- Şirket hesabına özel fiyat teklifi oluşturma
- Müzakere edilebilir fiyatlar (büyük şirketler için)
- Yıllık anlaşma seçenekleri
- Kredi limiti (ödeme vadeli olabilir)

**Database Şeması:**
```sql
-- Yeni tablo: organization_pricing
organization_pricing:
  - id (UUID, primary key)
  - organization_id (UUID, foreign key → organizations)
  - min_quantity (integer) - Minimum adet
  - max_quantity (integer, nullable) - Maksimum adet
  - unit_price (decimal) - Birim fiyat
  - discount_percentage (decimal) - İndirim yüzdesi
  - valid_from (timestamp)
  - valid_until (timestamp, nullable)
  - created_at (timestamp)
```

---

## 🏗️ Teknik Mimari

### Yeni API Endpoint'leri

#### Organization API'leri
```
POST   /api/organizations              - Şirket kaydı
GET    /api/organizations/:id          - Şirket bilgileri
PATCH  /api/organizations/:id          - Şirket güncelleme
GET    /api/organizations/:id/books    - Şirketin kitapları
GET    /api/organizations/:id/stats    - İstatistikler
```

#### Bulk Book Creation API'leri
```
POST   /api/organizations/:id/books/bulk     - Toplu kitap oluşturma
GET    /api/organizations/:id/books/bulk/:job_id  - Toplu işlem durumu
POST   /api/organizations/:id/books/bulk/upload-csv  - CSV yükleme
```

#### Book Sharing API'leri
```
POST   /api/books/:id/share           - Paylaşım linki oluştur
GET    /api/share/:token              - Paylaşım linki erişimi
DELETE /api/share/:token              - Paylaşım linki iptal
GET    /api/share/:token/stats        - Paylaşım istatistikleri
```

#### Bulk Order API'leri
```
POST   /api/organizations/:id/orders/bulk  - Toplu sipariş oluştur
GET    /api/organizations/:id/orders/bulk/:id  - Toplu sipariş detayı
```

### Queue Sistemi
**Gereksinim:** Toplu kitap oluşturma için asenkron işlem sistemi.

**Seçenekler:**
1. **Bull Queue (Redis)** - Önerilen
   - Redis tabanlı
   - Job tracking
   - Retry mekanizması
   - Progress tracking

2. **Supabase Realtime + Database Jobs**
   - Supabase tabanlı
   - Daha basit kurulum
   - Daha az özellik

**Öneri:** Bull Queue + Redis (production için daha güvenilir)

### Frontend Sayfaları

#### Yeni Sayfalar
1. `/organizations/register` - Şirket kayıt sayfası
2. `/organizations/dashboard` - Şirket dashboard'u
3. `/organizations/books` - Şirket kitaplığı
4. `/organizations/books/bulk` - Toplu kitap oluşturma
5. `/organizations/orders` - Toplu siparişler
6. `/organizations/settings` - Şirket ayarları
7. `/share/:token` - Paylaşım linki sayfası

---

## 💰 İş Modeli ve Fiyatlandırma

### Bireysel vs Kurumsal Fiyatlandırma

**Bireysel (Mevcut):**
- 10 sayfa: $7.99
- 15 sayfa: $11.99
- 20 sayfa: $15.99

**Kurumsal (Yeni):**
- **Tier 1 (10-24 adet):** %10 indirim
- **Tier 2 (25-49 adet):** %15 indirim
- **Tier 3 (50-99 adet):** %20 indirim
- **Tier 4 (100+ adet):** %25 indirim
- **Özel Anlaşma (500+ adet):** Müzakere edilebilir

### Gelir Potansiyeli
- **Bireysel:** $7.99 - $15.99 per kitap
- **Kurumsal:** $11.99 - $12.79 per kitap (100+ adet)
- **Yıllık Anlaşma:** $10,000 - $50,000+ (büyük okullar için)

---

## 📊 Kullanım Senaryoları

### Senaryo 1: Kreş - Yıl Sonu Hediyesi
1. Kreş admin sisteme girer
2. 30 çocuk için toplu kitap oluşturur
3. Her çocuk için fotoğraf ve bilgileri yükler
4. Tüm kitaplar oluşturulur (queue sistemi ile)
5. Kitapları ebeveynlerle paylaşır (link ile)
6. Ebeveynler isterse basılı kitap siparişi verir
7. Kreş toplu basılı kitap siparişi de verebilir

### Senaryo 2: Özel Okul - Eğitim Materyali
1. Okul admin sisteme girer
2. 100 öğrenci için kitap oluşturur
3. Eğitim teması seçer (tüm kitaplar aynı tema)
4. Toplu sipariş verir (%25 indirim)
5. Kitaplar okula teslim edilir
6. Öğrencilere dağıtılır

### Senaryo 3: Ebeveyn Paylaşımı
1. Şirket kitap oluşturur
2. Ebeveynlere özel link gönderir
3. Ebeveyn linke tıklar
4. Kitabı görüntüler, PDF indirir veya basılı sipariş verir
5. İsterse kendi hesabına ekler

---

## 🔒 Güvenlik ve İzinler

### Rol Yönetimi
- **Organization Admin:** Tüm yetkiler (kitap oluştur, sil, paylaş, sipariş ver)
- **Organization Member:** Kitap oluştur, görüntüle (silme yetkisi yok)
- **Organization Viewer:** Sadece görüntüleme

### Paylaşım Linki Güvenliği
- Token-based authentication
- Şifre korumalı paylaşım (opsiyonel)
- Link süresi sınırlama
- Erişim logları (kim, ne zaman erişti)

### Veri Gizliliği
- Çocuk fotoğrafları güvenli saklanmalı
- GDPR/KVKK uyumluluk
- Ebeveyn onayı gerekebilir (fotoğraf kullanımı için)

---

## 🚀 Uygulama Planı

### Faz 1: Temel Altyapı (Post-MVP)
- [ ] Organization database şeması
- [ ] Şirket kayıt sistemi
- [ ] Temel admin paneli
- [ ] Rol yönetimi

### Faz 2: Toplu İşlemler
- [ ] Toplu kitap oluşturma (CSV upload)
- [ ] Queue sistemi kurulumu
- [ ] Progress tracking
- [ ] Error handling

### Faz 3: Paylaşım Sistemi
- [ ] Paylaşım linki oluşturma
- [ ] Paylaşım sayfası (public)
- [ ] Erişim kontrolü
- [ ] İstatistikler

### Faz 4: Toplu Sipariş
- [ ] Toplu sepet sistemi
- [ ] Adet bazlı fiyatlandırma
- [ ] Toplu sipariş API'leri
- [ ] Sipariş takibi

### Faz 5: Gelişmiş Özellikler
- [ ] Özel fiyat teklifleri
- [ ] Yıllık anlaşma sistemi
- [ ] Kredi limiti
- [ ] Raporlama ve analitik

---

## ⚠️ Riskler ve Zorluklar

### Teknik Zorluklar
1. **Queue Sistemi:** Toplu işlemler için güvenilir queue sistemi gerekli
2. **Performance:** 100+ kitap aynı anda oluşturulurken sistem yükü
3. **Storage:** Çok sayıda fotoğraf ve kitap için storage maliyeti
4. **AI API Costs:** Toplu işlemlerde AI API maliyetleri artacak

### İş Zorlukları
1. **Fiyatlandırma:** Kurumsal müşteriler için özel fiyatlandırma müzakere gerektirebilir
2. **Destek:** Kurumsal müşteriler daha fazla destek bekleyebilir
3. **Ödeme:** Vadeli ödeme, kredi limiti gibi özellikler gerekebilir

### Yasal Zorluklar
1. **Çocuk Verileri:** GDPR/KVKK uyumluluk (çocuk fotoğrafları)
2. **Ebeveyn Onayı:** Fotoğraf kullanımı için ebeveyn onayı gerekebilir
3. **Fatura:** Kurumsal müşteriler için fatura sistemi

---

## 💡 Öneriler

### MVP Sonrası Öncelik
Bu özellik **Post-MVP** olarak planlanmalı çünkü:
1. Bireysel kullanıcılar öncelikli (MVP hedefi)
2. B2B özelliği daha karmaşık (admin panel, toplu işlemler, farklı fiyatlandırma)
3. İş mantığı farklı (şirket hesabı, ebeveyn paylaşımı, vb.)
4. Daha fazla geliştirme süresi gerektirir

### İteratif Yaklaşım
1. **İlk Versiyon:** Basit toplu kitap oluşturma (10-20 çocuk)
2. **İkinci Versiyon:** Paylaşım sistemi
3. **Üçüncü Versiyon:** Toplu sipariş ve özel fiyatlandırma

### Pazarlama Stratejisi
- Kreş ve okullara özel landing page
- Eğitim sektörüne yönelik içerik
- Referral programı (okullar arası)
- Yıllık anlaşma teklifleri

---

## 📚 İlgili Dokümanlar

- **ROADMAP.md** - Ana proje planı
- **PRD.md** - Ürün gereksinimleri
- **FEATURES.md** - Özellik listesi

---

**Son Güncelleme:** 4 Ocak 2026  
**Hazırlayan:** @project-manager agent

