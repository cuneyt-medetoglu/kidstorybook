# 🗄️ Supabase Kurulum Rehberi

Bu rehber, KidStoryBook projesi için Supabase kurulumunu adım adım açıklar.

---

## 📦 1. Supabase Projesi Oluştur

### 1.1 Supabase'e Kayıt Ol
1. [https://supabase.com](https://supabase.com) adresine git
2. "Start your project" butonuna tıkla
3. GitHub ile giriş yap (önerilen)

### 1.2 Yeni Proje Oluştur
1. Dashboard'da "New Project" butonuna tıkla
2. Proje bilgilerini gir:
   - **Name:** kidstorybook (veya istediğin isim)
   - **Database Password:** Güçlü bir şifre oluştur (kaydet!)
   - **Region:** Europe West (Amsterdam) - Türkiye'ye yakın
   - **Pricing Plan:** Free plan (başlangıç için yeterli)
3. "Create new project" butonuna tıkla
4. Proje oluşturulana kadar bekle (~2 dakika)

---

## 🔑 2. API Key'leri Al

### 2.1 Project Settings
1. Sol menüden ⚙️ **Settings** > **API** sekmesine git
2. Şu bilgileri kopyala:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (GİZLİ TUT!)

### 2.2 .env.local Oluştur
Proje root'unda `.env.local` dosyası oluştur:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

**⚠️ ÖNEMLİ:** `.env.local` dosyası `.gitignore`'da olmalı (zaten eklendi).

---

## 🗄️ 3. Veritabanı Şeması Oluştur

### 3.1 SQL Editor'ü Aç
1. Sol menüden 🔧 **SQL Editor** sekmesine git
2. "New query" butonuna tıkla

### 3.2 Migration SQL'ini Çalıştır
1. `supabase/migrations/00001_initial_schema.sql` dosyasını aç
2. Tüm içeriği kopyala
3. SQL Editor'e yapıştır
4. ▶️ "Run" butonuna tıkla
5. ✅ "Success. No rows returned" mesajı görmelisin

### 3.3 Tabloları Kontrol Et
1. Sol menüden 📊 **Table Editor** sekmesine git
2. Şu tabloları görmüş olmalısın:
   - ✅ users
   - ✅ oauth_accounts
   - ✅ characters
   - ✅ books
   - ✅ orders
   - ✅ payments

---

## 🔐 4. Authentication Ayarları

### 4.1 Auth Providers Aktifleştir
1. Sol menüden 🔑 **Authentication** > **Providers** sekmesine git
2. Şu provider'ları aktifleştir:
   - ✅ **Email** (zaten aktif)
   - ✅ **Google** (OAuth)
   - ✅ **Facebook** (OAuth) - opsiyonel
   - ✅ **Instagram** (OAuth) - opsiyonel

### 4.2 Google OAuth Kurulumu
1. [Google Cloud Console](https://console.cloud.google.com) > **APIs & Services** > **Credentials**
2. "Create Credentials" > "OAuth 2.0 Client ID" seç
3. **Authorized redirect URIs** ekle:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
4. Client ID ve Client Secret'ı kopyala
5. Supabase'de Google Provider ayarlarına yapıştır
6. ✅ Save

### 4.3 Email Templates (Opsiyonel)
1. **Authentication** > **Email Templates**
2. Confirmation, Reset Password, Magic Link template'lerini özelleştir

---

## 📁 5. Storage Bucket'ları Oluştur

### 5.1 Storage Sayfasına Git
1. Sol menüden 🗂️ **Storage** sekmesine git

### 5.2 Bucket'ları Oluştur
Şu bucket'ları oluştur (her biri için aynı adımları tekrarla):

#### 📸 photos (Referans fotoğrafları)
- **Name:** photos
- **Public:** ❌ Private
- **File size limit:** 5 MB
- **Allowed MIME types:** image/jpeg, image/png, image/webp

#### 📚 books (Kitap görselleri)
- **Name:** books
- **Public:** ✅ Public
- **File size limit:** 10 MB
- **Allowed MIME types:** image/jpeg, image/png, image/webp

#### 📄 pdfs (PDF dosyaları)
- **Name:** pdfs
- **Public:** ❌ Private
- **File size limit:** 50 MB
- **Allowed MIME types:** application/pdf

#### 🎨 covers (Kapak görselleri)
- **Name:** covers
- **Public:** ✅ Public
- **File size limit:** 10 MB
- **Allowed MIME types:** image/jpeg, image/png, image/webp

### 5.3 Bucket Policies
Her bucket için policy ayarla (RLS):

**photos bucket policy:**
```sql
-- Users can only access their own photos
CREATE POLICY "Users can access own photos"
ON storage.objects FOR ALL
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## ✅ 6. Kurulum Tamamlandı!

### Test Et
1. Development server'ı başlat:
   ```bash
   npm run dev
   ```
2. Browser'da aç: http://localhost:3001
3. Console'da hata olmamalı

### Supabase'i Test Et
```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Test query
const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1)

console.log('Supabase connection:', data ? 'OK' : 'Failed')
```

---

## 📊 Sonraki Adımlar

1. ✅ Supabase kuruldu
2. ⏳ **Faz 1.3:** Environment variables ayarla
3. ⏳ **Faz 2:** Frontend geliştirme başlat
4. ⏳ **Faz 3:** Backend API'ları ekle

---

## 🐛 Sorun Giderme

### Hata: "Invalid API key"
- `.env.local` dosyasında key'leri kontrol et
- Dev server'ı yeniden başlat (`Ctrl+C` sonra `npm run dev`)

### Hata: "Database connection failed"
- Supabase projesi aktif mi kontrol et
- Project URL doğru mu?

### Hata: "Row Level Security policy"
- RLS politikalarını doğru kurduğundan emin ol
- SQL Editor'de policy'leri kontrol et

---

**Yardım:** Sorun yaşarsan [Supabase Docs](https://supabase.com/docs) veya Cursor AI'ya sorabilirsin.

