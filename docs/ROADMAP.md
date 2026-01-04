# 🗺️ KidStoryBook - Proje Yol Haritası ve İş Listesi

**Doküman Versiyonu:** 1.0  
**Tarih:** 4 Ocak 2026  
**Durum:** AKTİF - Sürekli Güncelleniyor

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Faz 1: Temel Altyapı](#faz-1-temel-altyapı)
3. [Faz 2: Frontend Geliştirme](#faz-2-frontend-geliştirme)
4. [Faz 3: Backend ve AI Entegrasyonu](#faz-3-backend-ve-ai-entegrasyonu)
5. [Faz 4: E-ticaret ve Ödeme](#faz-4-e-ticaret-ve-ödeme)
6. [Faz 5: Polish ve Lansman](#faz-5-polish-ve-lansman)
7. [v0.app Prompt Rehberi](#v0app-prompt-rehberi)
8. [Notlar ve Fikirler](#notlar-ve-fikirler)

---

## 🎯 Genel Bakış

### Mevcut Durum ✅
- POC tamamlandı (10 sayfalık kitap prompt sistemi çalışıyor)
- AI stratejisi ve prompt template'leri hazır
- Teknik stack kararı verildi: **Next.js + Tailwind + shadcn/ui + Supabase**
- API key'ler hazır (OpenAI, Groq)

### Hedef
MVP lansmanı: Çalışan bir ürün

### Teknoloji Stack'i (Kesinleşmiş)

| Katman | Teknoloji | Neden |
|--------|-----------|-------|
| **Frontend** | Next.js 14 (App Router) | SEO, performans, SSR |
| **UI Framework** | Tailwind CSS + shadcn/ui | Hızlı geliştirme, modern görünüm |
| **UI Builder** | v0.app | Prompt ile hızlı UI oluşturma |
| **Backend** | Next.js API Routes + Supabase | Basit, hızlı, serverless |
| **Database** | Supabase (PostgreSQL) | Auth, DB, Storage hepsi bir arada |
| **AI - Metin** | Henüz karar verilmedi | GPT-4o, Gemini Pro, Groq, Claude (tümü hazır olacak) |
| **AI - Görsel** | Henüz karar verilmedi | DALL-E 3, Gemini Banana (Imagen 3), Stable Diffusion, Grok (tümü hazır olacak) |
| **Ödeme** | Stripe + İyzico | Global + Türkiye |
| **E-book Viewer** | react-pageflip | Flipbook görünümü |
| **PDF** | jsPDF / PDFKit | PDF generation |
| **Hosting** | Vercel | Next.js için optimize |
| **Storage** | Supabase Storage / Cloudinary | Görseller, PDF'ler |

---

## 🏗️ FAZ 1: Temel Altyapı
**Öncelik:** 🔴 Kritik

### 1.1 Proje Kurulumu
- [ ] **1.1.1** Next.js 14 projesi oluştur (App Router)
- [ ] **1.1.2** Tailwind CSS kur ve yapılandır
- [ ] **1.1.3** shadcn/ui kur ve tema ayarla
- [ ] **1.1.4** ESLint + Prettier ayarla
- [ ] **1.1.5** Git repo ve branch stratejisi belirle

### 1.2 Supabase Kurulumu
- [ ] **1.2.1** Supabase projesi oluştur
- [ ] **1.2.2** Veritabanı şeması tasarla ve oluştur
  - users (kullanıcılar)
    - id (UUID, primary key)
    - email (string, unique)
    - password_hash (string, nullable - OAuth için)
    - name (string)
    - avatar_url (string, nullable)
    - free_cover_used (boolean, default false) - Ücretsiz kapak hakkı
    - created_at (timestamp)
    - updated_at (timestamp)
  - oauth_accounts (OAuth hesapları)
    - id (UUID, primary key)
    - user_id (UUID, foreign key → users)
    - provider (string: 'google', 'facebook', 'instagram')
    - provider_account_id (string)
    - access_token (string, nullable)
    - refresh_token (string, nullable)
    - expires_at (timestamp, nullable)
    - created_at (timestamp)
  - characters (karakterler)
    - id (UUID, primary key)
    - user_id (UUID, foreign key → users)
    - name (string) - Çocuğun adı
    - age (integer) - Yaş
    - gender (string: 'boy' | 'girl') - Cinsiyet
    - hair_color (string) - Kullanıcı girdisi: saç rengi
    - eye_color (string) - Kullanıcı girdisi: göz rengi
    - features (text[]) - Kullanıcı girdisi: özel özellikler (gözlüklü, çilli, vb.)
    - reference_photo_url (string) - Referans görsel URL (Supabase Storage)
    - ai_analysis (jsonb) - AI analiz sonuçları:
      - hair_length (string: 'short' | 'medium' | 'long')
      - hair_style (string: 'straight' | 'wavy' | 'curly' | 'braided' | 'ponytail')
      - hair_texture (string)
      - face_shape (string)
      - eye_shape (string)
      - skin_tone (string)
      - body_proportions (string)
      - clothing (string, nullable)
    - full_description (text) - Birleştirilmiş karakter tanımı (prompt için)
    - created_at (timestamp)
    - updated_at (timestamp)
  - books (kitaplar)
  - orders (siparişler)
  - payments (ödemeler)
- [ ] **1.2.3** Supabase Auth entegrasyonu (email/password + OAuth)
- [ ] **1.2.4** Storage bucket'ları oluştur (photos, books, pdfs, covers)
- [ ] **1.2.5** Row Level Security (RLS) kuralları

### 1.3 Environment ve Yapılandırma
- [ ] **1.3.1** `.env.local` dosyası oluştur
- [ ] **1.3.2** Tüm API key'leri ekle (OpenAI, Groq, Supabase)
- [ ] **1.3.3** Vercel environment variables ayarla
- [ ] **1.3.4** Development/Production config ayrımı

---

## 🎨 FAZ 2: Frontend Geliştirme
**Öncelik:** 🔴 Kritik

### 2.1 Layout ve Navigasyon
- [ ] **2.1.1** Ana layout component (header, footer, nav)
- [ ] **2.1.2** Responsive tasarım (mobile-first)
- [ ] **2.1.3** Tema sistemi (renk paleti, typography)
- [ ] **2.1.4** Loading states ve error boundaries
- [ ] **2.1.5** Header'da ülke/para birimi seçici
- [ ] **2.1.6** Header'da sepet ikonu (shopping bag)
- [ ] **2.1.7** "Create a children's book" butonu header'da

### 2.2 Ana Sayfa (Homepage)
- [ ] **2.2.1** Hero section (başlık, CTA, görsel)
- [ ] **2.2.2** "Nasıl Çalışır?" bölümü (3 adım)
- [ ] **2.2.3** Örnek kitaplar carousel
- [ ] **2.2.4** Özellikler özeti
- [ ] **2.2.5** Fiyatlandırma özeti
- [ ] **2.2.6** FAQ bölümü
- [ ] **2.2.7** Kampanya banner'ları (free shipping, indirimler)
- [ ] **2.2.8** Cookie banner (GDPR/KVKK uyumluluk)

### 2.3 Auth Sayfaları
- [ ] **2.3.1** Giriş sayfası (email/şifre)
- [ ] **2.3.2** Kayıt sayfası
- [ ] **2.3.3** Şifre sıfırlama
- [ ] **2.3.4** Google OAuth butonu ve entegrasyonu
- [ ] **2.3.5** Facebook OAuth butonu ve entegrasyonu
- [ ] **2.3.6** Instagram OAuth butonu ve entegrasyonu (opsiyonel)
- [ ] **2.3.7** Email doğrulama sayfası
- [ ] **2.3.8** OAuth callback sayfaları

### 2.4 Kitap Oluşturma Wizard
- [ ] **2.4.1** Step 1: Karakter bilgileri formu
  - [ ] Çocuğun adı (text input)
  - [ ] Yaş (number input, 0-12)
  - [ ] Cinsiyet (radio: Erkek/Kız)
  - [ ] Saç rengi (dropdown: Açık Kumral, Kumral, Koyu Kumral, Siyah, Kahverengi, Kızıl)
  - [ ] Göz rengi (dropdown: Mavi, Yeşil, Kahverengi, Siyah, Ela)
  - [ ] Özel özellikler (checkbox: gözlüklü, çilli, dimples, vb.)
- [ ] **2.4.2** Step 2: Referans görsel yükleme (çocuk fotoğrafı)
  - [ ] Drag & drop veya file picker
  - [ ] Fotoğraf önizleme
  - [ ] Fotoğraf kırpma/crop (opsiyonel)
  - [ ] Maksimum dosya boyutu kontrolü (5MB)
  - [ ] Format kontrolü (JPG, PNG)
  - [ ] AI analiz butonu (fotoğrafı analiz et)
  - [ ] Analiz sonuçları gösterimi (saç uzunluğu, stili, vb.)
- [ ] **2.4.3** Step 3: Tema ve yaş grubu seçimi (0-2, 3-5, 6-9, 10+)
- [ ] **2.4.4** Step 4: Illustration style seçimi (görsel önizleme)
- [ ] **2.4.5** Step 5: Özel istekler
- [ ] **2.4.6** Step 6: Önizleme ve onay
  - [ ] Karakter tanımı özeti (kullanıcı girdileri + AI analizi)
  - [ ] Referans görsel önizleme
- [ ] **2.4.7** Progress indicator
- [ ] **2.4.8** Form validasyonu (Zod + React Hook Form)
- [ ] **2.4.9** Ücretsiz kapak hakkı kontrolü ve gösterimi
- [ ] **2.4.10** "Ücretsiz Kapak Oluştur" butonu (hakkı varsa)

### 2.5 E-book Viewer
- [ ] **2.5.1** react-pageflip entegrasyonu
- [ ] **2.5.2** Flipbook animasyonu
- [ ] **2.5.3** Navigasyon (ileri, geri, sayfa atlama)
- [ ] **2.5.4** Tam ekran modu
- [ ] **2.5.5** Mobil swipe desteği
- [ ] **2.5.6** Loading states

### 2.6 Kullanıcı Dashboard
- [ ] **2.6.1** Kitaplık sayfası (tüm kitaplar grid)
- [ ] **2.6.2** Kitap kartı component
- [ ] **2.6.3** Filtreleme ve sıralama
- [ ] **2.6.4** Sipariş geçmişi
- [ ] **2.6.5** Profil ayarları
- [ ] **2.6.6** Ücretsiz kapak hakkı göstergesi (kullanıldı/kullanılmadı)

### 2.7 Statik Sayfalar
- [ ] **2.7.1** Özellikler (Features) sayfası
- [ ] **2.7.2** Fiyatlandırma sayfası
- [ ] **2.7.3** Hakkımızda sayfası
- [ ] **2.7.4** İletişim sayfası
- [ ] **2.7.5** Gizlilik Politikası
- [ ] **2.7.6** Kullanım Şartları
- [ ] **2.7.7** KVKK Aydınlatma Metni
- [ ] **2.7.8** Examples sayfası (tüm örnek kitaplar, "View Example" butonları)
- [ ] **2.7.9** Ideas sayfası (hikaye fikirleri ve şablonları)
- [ ] **2.7.10** Tema kartları görsel gösterimi (her tema için thumbnail)
- [ ] **2.7.11** "Used Photos" gösterimi (örneklerde hangi fotoğraflar kullanılmış)
- [ ] **2.7.12** "View All Examples" ve "View All Themes" linkleri

### 2.8 Çok Dilli Destek (i18n)
- [ ] **2.8.1** next-intl kurulumu
- [ ] **2.8.2** TR çevirileri
- [ ] **2.8.3** EN çevirileri
- [ ] **2.8.4** Dil değiştirici component

---

## ⚙️ FAZ 3: Backend ve AI Entegrasyonu
**Öncelik:** 🔴 Kritik

### 3.1 API Routes Kurulumu
- [ ] **3.1.1** API klasör yapısı oluştur
- [ ] **3.1.2** Middleware (auth, rate limiting, error handling)
- [ ] **3.1.3** API response formatı standardize et

### 3.2 Kullanıcı API'leri
- [ ] **3.2.1** `POST /api/auth/register` - Kayıt (ücretsiz kapak hakkı ver)
- [ ] **3.2.2** `POST /api/auth/login` - Giriş
- [ ] **3.2.3** `POST /api/auth/logout` - Çıkış
- [ ] **3.2.4** `GET /api/users/me` - Kullanıcı bilgileri (ücretsiz kapak hakkı dahil)
- [ ] **3.2.5** `PATCH /api/users/me` - Profil güncelleme
- [ ] **3.2.6** `GET /api/auth/google` - Google OAuth callback
- [ ] **3.2.7** `GET /api/auth/facebook` - Facebook OAuth callback
- [ ] **3.2.8** `GET /api/auth/instagram` - Instagram OAuth callback (opsiyonel)

### 3.3 Karakter API'leri
- [ ] **3.3.1** `POST /api/characters` - Karakter oluştur (kullanıcı girdileri + referans görsel)
- [ ] **3.3.2** `POST /api/characters/upload-photo` - Referans görsel yükle (çocuk fotoğrafı)
- [ ] **3.3.3** `POST /api/characters/analyze-photo` - Fotoğraf analiz et (AI ile detaylı analiz)
  - [ ] Kullanıcı girdilerini doğrula
  - [ ] Saç uzunluğu, stili, dokusu analiz et
  - [ ] Yüz şekli, göz şekli analiz et
  - [ ] Ten rengi, vücut oranları analiz et
  - [ ] Birleştirilmiş karakter tanımı oluştur
- [ ] **3.3.4** `GET /api/characters` - Kullanıcının karakterleri

### 3.4 Kitap API'leri
- [ ] **3.4.1** `POST /api/books` - Yeni kitap başlat
- [ ] **3.4.2** `GET /api/books` - Kullanıcının kitapları
- [ ] **3.4.3** `GET /api/books/:id` - Kitap detay
- [ ] **3.4.4** `PATCH /api/books/:id` - Kitap güncelle
- [ ] **3.4.5** `DELETE /api/books/:id` - Kitap sil

### 3.5 AI Entegrasyonu (Henüz Karar Verilmedi - Tüm Seçenekler Hazır Olacak)
- [ ] **3.5.1** AI Provider abstraction layer (tüm provider'ları destekle)
- [ ] **3.5.2** `POST /api/ai/generate-story` - Hikaye üret
  - [ ] OpenAI GPT-4o entegrasyonu
  - [ ] Google Gemini Pro entegrasyonu
  - [ ] Groq (Llama) entegrasyonu
  - [ ] Claude entegrasyonu (opsiyonel)
- [ ] **3.5.3** `POST /api/ai/generate-image` - Görsel üret (kapak için)
  - [ ] DALL-E 3 entegrasyonu (OpenAI)
  - [ ] Gemini Banana (Imagen 3) entegrasyonu (Google)
  - [ ] Stable Diffusion entegrasyonu (Replicate)
  - [ ] Referans görsel + karakter tanımı kullanarak tutarlı görsel üret
- [ ] **3.5.4** `POST /api/ai/generate-cover` - Ücretsiz kapak oluştur (hakkı kontrol et)
- [ ] **3.5.5** `POST /api/ai/analyze-photo` - Fotoğraf analiz (referans görsel + kullanıcı girdileri)
  - [ ] GPT-4 Vision entegrasyonu (OpenAI)
  - [ ] Gemini Vision entegrasyonu (Google)
  - [ ] Kullanıcı girdilerini doğrula (saç rengi, göz rengi, vb.)
  - [ ] Detaylı analiz: saç uzunluğu, stili, dokusu, yüz şekli, göz şekli, ten rengi
  - [ ] Birleştirilmiş karakter tanımı oluştur (kullanıcı girdileri + AI analizi)
- [ ] **3.5.6** POC'tan prompt template'leri taşı
- [ ] **3.5.7** Queue sistemi (uzun işlemler için)
- [ ] **3.5.8** Retry ve hata yönetimi
- [ ] **3.5.9** AI provider seçimi için config sistemi

### 3.6 PDF Generation
- [ ] **3.6.1** `POST /api/books/:id/generate-pdf` - PDF oluştur
- [ ] **3.6.2** PDF template tasarımı
- [ ] **3.6.3** Supabase Storage'a kaydet
- [ ] **3.6.4** İndirme linki oluştur

### 3.7 Webhook'lar
- [ ] **3.7.1** Stripe webhook handler
- [ ] **3.7.2** İyzico webhook handler

---

## 💳 FAZ 4: E-ticaret ve Ödeme
**Öncelik:** 🔴 Kritik

### 4.1 Stripe Entegrasyonu
- [ ] **4.1.1** Stripe hesabı oluştur ve yapılandır
- [ ] **4.1.2** Stripe SDK kurulumu
- [ ] **4.1.3** Ürünler ve fiyatlar oluştur
- [ ] **4.1.4** Checkout session oluşturma
- [ ] **4.1.5** Payment intent flow
- [ ] **4.1.6** Webhook'ları dinle
- [ ] **4.1.7** Test modu ile test et

### 4.2 İyzico Entegrasyonu (Türkiye)
- [ ] **4.2.1** İyzico hesabı oluştur
- [ ] **4.2.2** İyzico SDK kurulumu
- [ ] **4.2.3** Ödeme formu entegrasyonu
- [ ] **4.2.4** 3D Secure desteği
- [ ] **4.2.5** Callback ve webhook'lar
- [ ] **4.2.6** Test modu ile test et

### 4.3 Sipariş Yönetimi
- [ ] **4.3.1** Checkout sayfası
- [ ] **4.3.2** Sipariş özeti component
- [ ] **4.3.3** Ödeme başarılı sayfası
- [ ] **4.3.4** Sipariş durumu takibi
- [ ] **4.3.5** Email bildirimleri

### 4.4 Fiyatlandırma Sistemi
- [ ] **4.4.1** Sayfa sayısına göre fiyatlandırma (10/15/20 sayfa)
- [ ] **4.4.2** E-book vs Basılı kitap fiyatları
- [ ] **4.4.3** İndirim kodu sistemi (gelecekte)
- [ ] **4.4.4** Ücretsiz kapak hakkı takibi

---

## 🚀 FAZ 5: Polish ve Lansman
**Öncelik:** 🟡 Önemli

### 5.1 SEO Optimizasyonu
- [ ] **5.1.1** Meta tags ve Open Graph
- [ ] **5.1.2** Sitemap.xml
- [ ] **5.1.3** robots.txt
- [ ] **5.1.4** Structured data (JSON-LD)
- [ ] **5.1.5** Performance optimizasyonu (Lighthouse)

### 5.2 Analytics
- [ ] **5.2.1** Google Analytics 4 kurulumu
- [ ] **5.2.2** Event tracking (kitap oluşturma, satın alma)
- [ ] **5.2.3** Conversion tracking
- [ ] **5.2.4** Custom dashboard (opsiyonel)

### 5.3 Güvenlik
- [ ] **5.3.1** HTTPS sertifikası (Vercel otomatik)
- [ ] **5.3.2** Rate limiting
- [ ] **5.3.3** Input validasyonu
- [ ] **5.3.4** CSRF protection
- [ ] **5.3.5** GDPR/KVKK uyumluluk kontrolü

### 5.4 Test
- [ ] **5.4.1** Manuel test (tüm akışlar)
- [ ] **5.4.2** Mobil test
- [ ] **5.4.3** Cross-browser test
- [ ] **5.4.4** Ödeme testleri (sandbox)

### 5.5 Deployment
- [ ] **5.5.1** Vercel production deployment
- [ ] **5.5.2** Domain bağlantısı
- [ ] **5.5.3** SSL sertifikası
- [ ] **5.5.4** Monitoring kurulumu
- [ ] **5.5.5** Error tracking (Sentry)

### 5.6 Lansman Hazırlıkları
- [ ] **5.6.1** Örnek kitaplar oluştur (demo)
- [ ] **5.6.2** Sosyal medya hesapları
- [ ] **5.6.3** Landing page son kontrolü
- [ ] **5.6.4** Beta kullanıcılar ile test

---

## 🎨 v0.app Prompt Rehberi

v0.app ile UI oluştururken kullanabileceğiniz prompt'lar:

### Ana Sayfa Hero Section
```
Create a hero section for a children's personalized storybook website called "KidStoryBook". 

Requirements:
- Modern, playful design with soft gradients (purple to pink)
- Large heading: "Create Magical Stories Starring Your Child"
- Subheading about AI-generated personalized books
- Two CTA buttons: "Create Your Book" (primary) and "See Examples"
- Hero image placeholder showing a cute illustrated children's book
- Floating decorative elements (stars, hearts, book icons)
- Responsive design
- Use Tailwind CSS and shadcn/ui components
- Children-friendly aesthetic with rounded corners
- Typography should be playful but readable (consider fonts like Fredoka, Quicksand)
```

### Kitap Oluşturma Wizard
```
Create a multi-step wizard form for creating a personalized children's book.

Steps:
1. Character Info (name, age, gender)
2. Photo Upload (drag & drop with preview)
3. Theme Selection (adventure, fairy tale, etc. with icons)
4. Illustration Style (grid of style options with images)
5. Custom Requests (textarea)
6. Review & Create

Requirements:
- Progress indicator at top showing current step
- Previous/Next navigation buttons
- Form validation with error messages
- Modern card-based design
- Animations between steps
- Mobile responsive
- Use shadcn/ui Form, Input, Select, Button components
- Tailwind CSS for styling
```

### E-book Viewer
```
Create an e-book viewer component that looks like an open book.

Requirements:
- Two-page spread view (left page: text, right page: illustration)
- Page flip animation when navigating
- Navigation controls (prev, next, page number)
- Fullscreen toggle button
- Thumbnail preview strip at bottom (optional)
- Loading state for images
- Mobile-friendly (single page view on mobile)
- Download PDF button
- Share button
- Book-like shadow and styling
```

### Kullanıcı Kitaplığı
```
Create a user library/dashboard showing all created books.

Requirements:
- Grid layout of book cards (3 columns desktop, 2 tablet, 1 mobile)
- Each book card shows:
  - Book cover thumbnail
  - Book title
  - Creation date
  - Status badge (completed, processing, draft)
  - Action buttons (view, edit, download, delete)
- Filter tabs (All, Completed, Drafts)
- Search bar
- Sort dropdown (date, name)
- Empty state with CTA to create first book
- Modern card design with hover effects
```

### Fiyatlandırma Sayfası
```
Create a pricing page for a children's storybook service.

Tiers:
1. Basic (10 pages) - $7.99
2. Standard (15 pages) - $11.99 - Most Popular
3. Premium (20 pages) - $15.99

Features per tier:
- AI story generation
- AI illustrations
- E-book download
- Free image revisions (1/2/3)
- Priority support (premium only)

Requirements:
- Three pricing cards in a row
- "Most Popular" badge on Standard
- Feature checkmarks
- CTA button per card
- Toggle for USD/TRY currency (optional)
- FAQ section below
- Clean, trustworthy design
```

---

## 📝 Notlar ve Fikirler

### Bekleyen Kararlar
- [ ] Domain adı belirlenmedi
- [ ] Fiyatlar netleştirilmedi (TL/USD)
- [ ] Basılı kitap (Print-on-Demand) MVP'ye dahil mi?
- [ ] **AI Tool Seçimi:** Hikaye üretimi için hangi AI? (GPT-4o, Gemini, Groq, Claude)
- [ ] **AI Tool Seçimi:** Görsel üretimi için hangi AI? (DALL-E 3, Midjourney, Stable Diffusion, Leonardo, Ideogram)
- [x] **UI Builder:** v0.app seçildi ✅

### Gelecek Özellikler (Post-MVP)
- [ ] Multi-karakter desteği (5 karaktere kadar)
- [ ] Pet ve oyuncak karakterleri
- [ ] Görsel yeniden oluşturma (revize)
- [ ] Sesli kitap (text-to-speech)
- [ ] Video hikayeler
- [ ] Mobil uygulama
- [ ] Abonelik modeli
- [ ] Referral programı
- [ ] Blog sayfası

### Referans Siteden (magicalchildrensbook.com) Eksik Özellikler

#### MVP'ye Eklenmeli (Önemli)
- [ ] **Cookie Banner** - GDPR/KVKK uyumluluk için cookie onayı
- [ ] **Ülke/Para Birimi Seçici** - Header'da ülke ve para birimi değiştirme
- [ ] **Sepet İkonu** - Header'da sepet göstergesi (shopping bag)
- [ ] **10+ Yaş Kategorisi** - Şu an sadece 0-2, 3-5, 6-9 var, 10+ eklenmeli
- [ ] **Kampanya Banner'ları** - "Free shipping when you buy 2+ books", "50% off 3rd book" gibi
- [ ] **"View Example" Butonları** - Örnek kitapları görüntüleme butonları
- [ ] **"Used Photos" Gösterimi** - Örneklerde hangi fotoğrafların kullanıldığını gösterme
- [ ] **Tema Kartları Görsel Gösterimi** - Her tema için görsel thumbnail
- [ ] **"View All Examples" Linki** - Tüm örnekleri görüntüleme
- [ ] **"View All Themes" Linki** - Tüm temaları görüntüleme
- [ ] **"Show More Reviews" Butonu** - Reviews bölümünde daha fazla göster

#### Post-MVP (Gelecekte)
- [ ] **25 Dil Desteği** - Şu an sadece TR/EN, gelecekte 25 dil
- [ ] **Çoklu Para Birimi** - USD, EUR, GBP, TRY, vb. otomatik dönüşüm
- [ ] **26 Ülkeye Kargo** - Basılı kitap için geniş kargo ağı
- [ ] **Erişilebilirlik Özellikleri** - Screen reader, keyboard navigation, vb.
- [ ] **Reviews/Testimonials Sayfası** - Detaylı kullanıcı yorumları sayfası

### Teknik Notlar
- POC'taki prompt template'leri production'a taşınacak
- Karakter tutarlılığı için reference image + detaylı prompt yaklaşımı
- İlk aşamada %50 otomatik, %50 manuel kontrol (kalite için)

### v0.app vs bolt.new Karşılaştırması

#### v0.app (Vercel)
**Avantajlar:**
- ✅ Vercel tarafından yapılmış (Next.js ile mükemmel entegrasyon)
- ✅ Ücretsiz tier mevcut
- ✅ GitHub entegrasyonu (kod direkt repo'ya push edilebilir)
- ✅ Vercel deployment (tek tıkla deploy)
- ✅ shadcn/ui componentleri ile çalışıyor
- ✅ Modern, güçlü prompt sistemi
- ✅ Design mode (görsel düzenleme)

**Dezavantajlar:**
- ⚠️ Premium hesap gerekebilir (yoğun kullanım için)
- ⚠️ Rate limiting (ücretsiz tier'de)

**Fiyatlandırma:**
- Ücretsiz: Sınırlı kullanım
- Pro: $20/ay (daha fazla kullanım)

#### bolt.new
**Avantajlar:**
- ✅ Ücretsiz (şu an)
- ✅ Hızlı prototipleme
- ✅ Modern UI
- ✅ Kolay kullanım

**Dezavantajlar:**
- ⚠️ Henüz yeni, ekosistem tam gelişmemiş
- ⚠️ GitHub entegrasyonu sınırlı olabilir
- ⚠️ Vercel entegrasyonu yok

**Fiyatlandırma:**
- Ücretsiz (şu an)

#### Öneri
**v0.app önerilir çünkü:**
- ✅ Vercel ekosistemi (Next.js + Vercel deployment)
- ✅ GitHub entegrasyonu (kod direkt repo'ya gider)
- ✅ shadcn/ui desteği (projede kullanıyoruz)
- ✅ Production-ready çıktılar
- ✅ Design mode ile fine-tuning

**Not:** İlk başta ücretsiz tier ile başla, gerekirse Pro'ya geç.

### Ücretsiz Kapak Hakkı Sistemi

#### Özellik Detayları
- **Her yeni üyeye 1 adet ücretsiz kapak hakkı verilir**
- **Sadece kapak (sayfa 1) - tam kitap değil**
- **Database'de takip:** `users.free_cover_used` (boolean)
- **Kullanıldığında:** `true` olarak işaretlenir
- **UI'da gösterim:** Dashboard'da "1 Ücretsiz Kapak Hakkı" badge'i
- **Wizard'da:** "Ücretsiz Kapak Oluştur" butonu (hakkı varsa aktif)

#### İş Akışı
1. Kullanıcı kayıt olur → `free_cover_used = false`
2. Dashboard'da "1 Ücretsiz Kapak Hakkı" görünür
3. Kitap oluşturma wizard'ında "Ücretsiz Kapak Oluştur" butonu aktif
4. Kullanıcı kapak oluşturur → API çağrısı yapılır
5. Backend kontrol eder: `free_cover_used === false`?
6. Kapak oluşturulur → `free_cover_used = true` yapılır
7. Sonraki kapaklar için ödeme gerekir

#### API Endpoint
```
POST /api/ai/generate-cover
Body: {
  characterName: string,
  characterAge: number,
  characterGender: string,
  theme: string,
  illustrationStyle: string,
  photo: File
}
Response: {
  success: boolean,
  coverUrl: string,
  freeCoverUsed: true
}
```

### Teknoloji Seçim Açıklamaları

#### Next.js 14 Neden?
- **Stabil ve Olgun:** Next.js 14 (App Router) production-ready, geniş topluluk desteği var
- **Next.js 15/16:** Henüz çok yeni, breaking changes olabilir, ekosistem henüz tam adapte olmamış
- **App Router:** Modern, performanslı, SEO dostu
- **Vercel Entegrasyonu:** Next.js'in yaratıcısı Vercel, mükemmel entegrasyon
- **Not:** İleride Next.js 15/16'ya geçiş kolay (aynı framework)

#### Supabase Neden Firebase Değil?
- **PostgreSQL:** İlişkisel veritabanı, e-commerce için ideal (Firebase NoSQL)
- **SQL Sorguları:** Karmaşık sorgular için SQL daha güçlü
- **Açık Kaynak:** Vendor lock-in riski daha düşük
- **Fiyatlandırma:** Supabase daha şeffaf ve uygun fiyatlı
- **Real-time:** Her ikisi de real-time desteği var
- **Auth:** Her ikisi de güçlü auth sistemi
- **Storage:** Her ikisi de dosya depolama sunuyor
- **Not:** Firebase de kullanılabilir, ama Supabase projemiz için daha uygun

### Yararlı Linkler
- [magicalchildrensbook.com](https://magicalchildrensbook.com/) - Referans site
- [v0.app](https://v0.app/) - UI builder
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Supabase](https://supabase.com/) - Backend

---

## 📊 İlerleme Takibi

| Faz | Durum | Tamamlanan | Toplam | Yüzde |
|-----|-------|------------|--------|-------|
| Faz 1 | 🟡 Bekliyor | 0 | 14 | 0% |
| Faz 2 | 🟡 Bekliyor | 0 | 60 | 0% |
| Faz 3 | 🟡 Bekliyor | 0 | 38 | 0% |
| Faz 4 | 🟡 Bekliyor | 0 | 18 | 0% |
| Faz 5 | 🟡 Bekliyor | 0 | 22 | 0% |
| **TOPLAM** | **🟡** | **0** | **152** | **0%** |

---

**Son Güncelleme:** 4 Ocak 2026  
**Güncelleyen:** @project-manager agent

> 💡 **İpucu:** Bu dosyayı güncel tutun! Her iş tamamlandığında `[ ]` işaretini `[x]` olarak değiştirin ve ilerleme tablosunu güncelleyin.

