# 🔐 Environment Variables Kurulum Rehberi

**Tarih:** 4 Ocak 2026  
**Durum:** ✅ Hazır

---

## 📋 İçindekiler

1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Gerekli Environment Variables](#gerekli-environment-variables)
3. [Opsiyonel Environment Variables](#opsiyonel-environment-variables)
4. [Vercel Deployment](#vercel-deployment)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Hızlı Başlangıç

### 1. `.env.local` Dosyası Oluştur

Proje root'unda `.env.local` dosyası oluştur:

```bash
cp .env.example .env.local
```

### 2. Gerekli Değişkenleri Doldur

`.env.local` dosyasını aç ve şu değişkenleri doldur:

```bash
# Supabase (ZORUNLU)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

### 3. Development Server'ı Başlat

```bash
npm run dev
```

---

## ✅ Gerekli Environment Variables

### Supabase (ZORUNLU)

```bash
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# Supabase Anon/Public Key (browser'da kullanılır)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Supabase Service Role Key (server-side, GİZLİ!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

**Nereden Alınır:**
1. [Supabase Dashboard](https://app.supabase.com) → Projeniz
2. ⚙️ **Settings** > **API**
3. **Project URL** ve **anon/public key** kopyala
4. **service_role key** kopyala (⚠️ GİZLİ TUT!)

### Next.js

```bash
# Application URL (development için localhost)
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Environment (development/production)
NODE_ENV=development
```

---

## 🔧 Opsiyonel Environment Variables

### AI Providers

#### OpenAI

```bash
OPENAI_API_KEY=sk-proj-...
```

**Kullanım:**
- GPT-4o: Hikaye içeriği üretimi
- DALL-E 3: Görsel üretimi
- GPT-4 Vision: Fotoğraf analizi

**Nereden Alınır:**
- [OpenAI Platform](https://platform.openai.com/api-keys)

#### Groq

```bash
GROQ_API_KEY=gsk_...
```

**Kullanım:**
- Hızlı hikaye içeriği üretimi (OpenAI alternatifi)

**Nereden Alınır:**
- [Groq Console](https://console.groq.com/keys)

#### Google AI

```bash
GOOGLE_AI_API_KEY=...
```

**Kullanım:**
- Gemini Pro: Hikaye içeriği üretimi

**Nereden Alınır:**
- [Google AI Studio](https://makersuite.google.com/app/apikey)

### Payment Providers

#### Stripe

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Nereden Alınır:**
- [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

#### İyzico (Türkiye)

```bash
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
```

**Nereden Alınır:**
- [İyzico Panel](https://merchant.iyzipay.com/)

---

## 🚀 Vercel Deployment

### 1. Vercel Projesi Oluştur

1. [Vercel Dashboard](https://vercel.com/dashboard) → **New Project**
2. GitHub repository'yi bağla
3. **Deploy** butonuna tıkla

### 2. Environment Variables Ekle

Vercel Dashboard'da:
1. Projeniz → **Settings** → **Environment Variables**
2. Her environment variable'ı ekle:

**Production:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
OPENAI_API_KEY=sk-proj-...
# ... diğer key'ler
```

**Preview (staging):**
- Production ile aynı (veya test key'leri)

**Development:**
- Local development için `.env.local` kullanılır

### 3. Redeploy

Environment variable'ları ekledikten sonra:
1. **Deployments** sekmesine git
2. Son deployment'ın yanındaki **⋯** → **Redeploy**

---

## 🔍 Configuration Validation

Proje başlatıldığında `lib/config.ts` otomatik olarak configuration'ı validate eder.

### Development

Eksik environment variable'lar için uyarı verir (hata vermez).

### Production

Eksik zorunlu environment variable'lar için hata verir ve uygulama başlamaz.

### Manuel Validation

```typescript
import { validateConfig } from '@/lib/config'

// Validate configuration
const isValid = validateConfig()
if (!isValid) {
  console.error('Configuration is invalid')
}
```

---

## 🐛 Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is required" Hatası

**Çözüm:**
1. `.env.local` dosyasının proje root'unda olduğundan emin ol
2. `NEXT_PUBLIC_SUPABASE_URL` değişkeninin doğru olduğunu kontrol et
3. Development server'ı yeniden başlat: `npm run dev`

### Environment Variables Çalışmıyor

**Çözüm:**
1. `.env.local` dosyası `.gitignore`'da olmalı (zaten var)
2. `NEXT_PUBLIC_*` prefix'i olan değişkenler browser'da kullanılabilir
3. Prefix olmayan değişkenler sadece server-side'da kullanılabilir
4. Development server'ı yeniden başlat

### Vercel'de Environment Variables Çalışmıyor

**Çözüm:**
1. Vercel Dashboard'da environment variable'ları kontrol et
2. Doğru environment'ı seçtiğinden emin ol (Production/Preview/Development)
3. Redeploy yap
4. Vercel logs'u kontrol et: **Deployments** → **View Function Logs**

### Image Optimization Hatası

**Çözüm:**
1. `next.config.js`'de image domain'lerinin doğru olduğunu kontrol et
2. Supabase Storage URL'lerinin `**.supabase.co` pattern'ine uyduğundan emin
3. `NEXT_PUBLIC_SUPABASE_URL` doğru mu kontrol et

---

## 📝 Notlar

### Güvenlik

- ⚠️ **ASLA** `.env.local` dosyasını commit etme
- ⚠️ **ASLA** `SUPABASE_SERVICE_ROLE_KEY` veya `STRIPE_SECRET_KEY` gibi secret key'leri client-side'da kullanma
- ✅ `NEXT_PUBLIC_*` prefix'i olan değişkenler browser'da kullanılabilir (public)
- ✅ Prefix olmayan değişkenler sadece server-side'da kullanılabilir (private)

### Best Practices

1. **Development:** `.env.local` kullan
2. **Production:** Vercel Environment Variables kullan
3. **Template:** `.env.example` dosyasını güncel tut
4. **Validation:** `lib/config.ts` ile otomatik validation

---

## 📚 İlgili Dosyalar

- `lib/config.ts` - Configuration dosyası
- `.env.example` - Environment variables template
- `next.config.js` - Next.js configuration
- `docs/ARCHITECTURE.md` - Mimari dokümantasyon

---

**Son Güncelleme:** 4 Ocak 2026

