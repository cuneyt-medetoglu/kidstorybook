# 🏗️ KidStoryBook - Mimari Kararlar ve Yapı

**Tarih:** 4 Ocak 2026  
**Durum:** Aktif Geliştirme

---

## 📦 Monorepo vs Ayrı Repo Kararı

### Mevcut Durum: **Monorepo (Tek Repo)**

Proje şu anda **tek bir repository** içinde hem frontend hem backend kodlarını barındırıyor:

```
kidstorybook/
├── app/              # Next.js App Router (Frontend)
├── components/        # React Components
├── lib/              # Utility functions
├── api/              # Next.js API Routes (Backend)
├── docs/             # Dokümantasyon
└── poc/              # Proof of Concept
```

### Neden Monorepo?

#### ✅ Avantajlar
1. **Hızlı Geliştirme:** Frontend ve backend aynı repo'da, değişiklikler senkronize
2. **Kod Paylaşımı:** TypeScript type'ları, utility fonksiyonları paylaşılabilir
3. **Tek Deploy:** Vercel'de tek bir deploy ile hem frontend hem API routes deploy edilir
4. **Basit Yapı:** Küçük ekip için daha basit yönetim
5. **Next.js API Routes:** Next.js'in built-in API routes kullanılıyor (ayrı backend server'a gerek yok)
6. **Maliyet:** Tek bir hosting (Vercel) yeterli

#### ⚠️ Dezavantajlar
1. **Ölçeklenebilirlik:** Büyüdükçe repo karmaşıklaşabilir
2. **Bağımsız Deploy:** Frontend ve backend ayrı deploy edilemez (şu an sorun değil)
3. **Ekip Büyümesi:** Farklı ekipler çalışırsa conflict riski artar

### Alternatif: Ayrı Repo Yapısı

Eğer ayrı repo yapısı tercih edilirse:

```
kidstorybook-frontend/   # Next.js Frontend
kidstorybook-backend/    # Node.js/Express Backend (veya başka)
kidstorybook-api/        # API Server
```

#### Ne Zaman Ayrı Repo'ya Geçilmeli?

1. **Ekip büyüdüğünde** (5+ developer)
2. **Backend kompleksleştiğinde** (microservices, queue systems)
3. **Farklı deployment stratejileri gerektiğinde**
4. **Backend başka bir teknoloji stack'e geçildiğinde** (Go, Python, vb.)

### 🎯 Öneri: **Şimdilik Monorepo, Gelecekte Değerlendir**

**MVP için monorepo yeterli ve doğru seçim çünkü:**
- ✅ Next.js API Routes ile backend zaten Next.js içinde
- ✅ Tek bir deployment (Vercel) yeterli
- ✅ Hızlı geliştirme ve test
- ✅ Kod paylaşımı kolay

**Gelecekte ayrı repo'ya geçiş yapılabilir:**
- Backend bağımsız bir service olarak çalıştırılmak istenirse
- Farklı teknolojiler kullanılmak istenirse
- Ekip büyürse ve farklı deployment stratejileri gerektiğinde

---

## 🐳 Docker Desteği

### Durum: **Gelecekte Eklenecek**

Docker desteği şu an yok, ama planlanıyor:

#### Docker Kullanım Senaryoları

1. **Local Development**
   - Supabase local instance
   - Database migrations
   - Consistent development environment

2. **CI/CD Pipeline**
   - Automated testing
   - Build process
   - Deployment

3. **Production Deployment** (Opsiyonel)
   - Vercel yerine kendi server'ında çalıştırma
   - Container orchestration (Kubernetes, Docker Swarm)

#### Eklenecek Dosyalar

- `Dockerfile` - Production image
- `docker-compose.yml` - Local development
- `.dockerignore` - Docker build optimization

**Tahmini Ekleme Zamanı:** Faz 1.3 veya Faz 5 (Polish ve Lansman)

---

## 🔐 Environment Variables

### Durum: **✅ Oluşturuldu (Faz 1.2)**

`.env.local` dosyası **Faz 1.2'de oluşturuldu** (Supabase kurulumu sırasında).

#### Oluşturulma Zamanı

**Faz 1.2'de (Supabase kurulumu):**
- ✅ Supabase URL ve key'ler eklendi
- ✅ `.env.local` dosyası oluşturuldu
- ✅ `.env.example` template hazır
- ✅ `.gitignore`'da (güvenlik)

#### İçerik

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# OpenAI (gelecekte)
OPENAI_API_KEY=your_openai_api_key

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development
```

#### Güvenlik

- ✅ `.env.local` `.gitignore`'da
- ✅ `.env.example` template olarak commit edilebilir
- ✅ API key'ler asla commit edilmemeli
- ✅ Production'da Vercel environment variables kullanılacak

---

## 📁 Proje Yapısı

### Mevcut Yapı (Faz 1.2 Sonrası)

```
kidstorybook/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── test-supabase/     # Supabase test sayfası
│   └── api/                # API Routes (Backend)
│       └── test/           # Test endpoints
│           └── storage/     # Storage test endpoint
├── components/             # React Components
│   └── ui/                 # shadcn/ui components
│       └── button.tsx      # Button component
├── lib/                    # Utility functions
│   ├── utils.ts            # Helper functions (cn)
│   └── supabase/           # Supabase clients
│       ├── client.ts       # Browser client
│       ├── server.ts       # Server client
│       └── middleware.ts   # Middleware client (auth refresh)
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migrations
│   │   └── 00001_initial_schema.sql
│   └── README.md           # Supabase setup guide
├── middleware.ts           # Next.js middleware (Supabase auth)
├── docs/                   # Dokümantasyon
│   ├── implementation/     # Faz bazlı implementasyon takibi
│   ├── checklists/         # Kontrol listeleri
│   ├── guides/             # Rehberler
│   ├── reports/            # Raporlar
│   └── strategies/         # Strateji dokümanları
├── poc/                    # Proof of Concept
└── public/                 # Static files
```

### Gelecekteki Yapı (Büyüdükçe)

```
kidstorybook/
├── app/                    # Frontend
├── components/            # UI Components
├── lib/                    # Shared utilities
├── api/                    # API Routes (Backend)
├── types/                  # TypeScript types
├── hooks/                  # React hooks
├── stores/                 # State management (Zustand/Redux)
├── tests/                  # Test files
└── ...
```

---

## 🚀 Deployment Stratejisi

### Şu An: **Vercel (Monorepo)**

- Frontend ve API routes birlikte deploy edilir
- Tek bir Vercel projesi
- Automatic deployments (Git push → Deploy)

### Gelecekte (Ayrı Repo'ya Geçilirse)

- **Frontend:** Vercel
- **Backend:** Railway, Render, AWS, Azure, vb.
- **Database:** Supabase (zaten ayrı)

---

## 📊 Teknoloji Stack Özeti

| Katman | Teknoloji | Versiyon | Not |
|--------|-----------|----------|-----|
| **Frontend** | Next.js 14 (App Router) | 14.2.35 | SSR, SEO, Performance |
| **UI Framework** | Tailwind CSS | 3.4.19 | Utility-first CSS |
| **UI Components** | shadcn/ui | Latest | Radix UI + Tailwind |
| **Backend** | Next.js API Routes | Built-in | Serverless functions |
| **Database** | Supabase (PostgreSQL) | Latest | Auth, DB, Storage |
| **Supabase Client** | @supabase/ssr | 0.8.0 | SSR support |
| **Supabase JS** | @supabase/supabase-js | 2.89.0 | Core client |
| **TypeScript** | TypeScript | 5.9.3 | Type safety |
| **React** | React | 18.3.1 | UI library |
| **AI** | OpenAI, Groq, Gemini | TBD | Multiple providers |
| **Ödeme** | Stripe + İyzico | TBD | Global + Türkiye |
| **Hosting** | Vercel | TBD | Next.js için optimize |
| **Container** | Docker | Gelecek | Local dev, CI/CD |
| **Theme** | next-themes | Faz 2.1.3 | Dark/Light mode support |

---

## ✅ Sonuç ve Öneriler

### Şu An İçin Doğru Olan: **Monorepo**

1. ✅ MVP için yeterli
2. ✅ Hızlı geliştirme
3. ✅ Basit yönetim
4. ✅ Tek deployment

### Gelecekte Değerlendirilecekler

1. ⏳ Docker desteği (Faz 1.3 veya Faz 5)
2. ⏳ Ayrı repo'ya geçiş (eğer gerekiyorsa)
3. ⏳ Microservices mimarisi (çok büyürse)

### Tamamlananlar (Faz 1.2)

1. ✅ Monorepo yapısı ile devam ediliyor
2. ✅ Next.js API Routes kullanılıyor (ayrı backend server yok)
3. ✅ Faz 1.2: Supabase kurulumu tamamlandı
   - Database schema oluşturuldu
   - Supabase client setup (browser, server, middleware)
   - Storage buckets oluşturuldu
   - RLS policies tanımlandı
4. ✅ Environment variables oluşturuldu (`.env.local`)
5. ✅ Test infrastructure oluşturuldu (`/test-supabase`)

### Tamamlananlar (Faz 1.3)

1. ✅ Faz 1.3: Environment ve yapılandırma tamamlandı
   - `.env.local` kontrolü ve optimizasyonu
   - `next.config.js` Supabase için optimize edildi
   - `lib/config.ts` oluşturuldu (development/production ayrımı)
   - Image domains eklendi ve optimize edildi
   - Environment setup rehberi oluşturuldu

### Sıradakiler

1. ⏳ Faz 2: Frontend geliştirme
2. ⏳ Gelecekte: Docker desteği
3. ⏳ Gelecekte: AWS S3 storage geçişi (Supabase limitine yaklaşıldığında)

---

---

## 💾 Storage Stratejisi

### Mevcut Durum: **Supabase Storage**

**Faz 1.2'de oluşturuldu:**
- ✅ **photos** bucket (Private, 10MB, image/*) - Kullanıcı fotoğrafları
- ✅ **books** bucket (Public, 50MB, image/*) - Kitap görselleri
- ✅ **pdfs** bucket (Public, 50MB, application/pdf) - PDF dosyaları
- ✅ **covers** bucket (Public, 10MB, image/*) - Kapak görselleri

### Gelecek: **AWS S3 Geçiş Planı**

**Neden Geçiş Gerekli?**
- Supabase Storage limiti: 500MB (free tier)
- Büyük görseller ve PDF'ler için yetersiz olabilir
- Maliyet optimizasyonu

**Geçiş Zamanı:**
- Database dolmaya yakın (500MB limitine yaklaşıldığında)
- Şu an Supabase Storage kullanılıyor

**Hibrit Mimari (Geçiş Sonrası):**
- **Supabase:** Database (metadata) + Auth
- **AWS S3:** Storage (görseller, PDF'ler)
- **URL'ler:** Supabase DB'de saklanır (S3 URL'leri)

**Geçiş Planı:**
1. AWS S3 bucket oluştur
2. IAM policy ayarla
3. S3 upload utility'leri yaz
4. Mevcut kodları migrate et
5. Mevcut dosyaları S3'e taşı
6. Test et ve production'a al

---

## 🧪 Test Infrastructure

### Mevcut Test Araçları

**Faz 1.2'de oluşturuldu:**
- ✅ `/test-supabase` - Supabase connection test sayfası
  - Connection test
  - Database schema test
  - Storage buckets test
  - Authentication test
- ✅ `app/api/test/storage` - Storage API test endpoint

**Kullanım:**
- Development sırasında Supabase bağlantısını test etmek için
- Storage bucket'larının doğru oluşturulduğunu kontrol etmek için
- Database schema'nın doğru olduğunu doğrulamak için

---

## 📜 Mimari Değişiklik Geçmişi

### 4 Ocak 2026 - Faz 1.2 Tamamlandı
**Ne değişti:**
- Supabase kurulumu tamamlandı
- Database schema oluşturuldu (6 tablo)
- Supabase client setup yapıldı (browser, server, middleware)
- Storage buckets oluşturuldu (4 bucket)
- Environment variables oluşturuldu (`.env.local`)
- Test infrastructure eklendi

**Neden:**
- Backend altyapısının hazır olması gerekiyordu
- Authentication ve database ihtiyacı vardı
- Storage için Supabase kullanıldı (gelecekte S3'e geçilebilir)

**Alternatifler:**
- Ayrı PostgreSQL database (Supabase yerine)
- AWS S3 (storage için, şimdilik Supabase yeterli)
- Firebase (Supabase yerine)

**Karar:**
- Supabase seçildi çünkü: Auth + DB + Storage hepsi bir arada, kolay kurulum, ücretsiz tier yeterli

### 4 Ocak 2026 - Dark/Light Mode Kararı ✅
**Ne değişti:**
- Dark mode ve Light mode desteği eklendi (Faz 2.1.3)
- Renk paleti dark/light mode uyumlu olacak şekilde tasarlandı
- next-themes kullanılacak (theme provider)

**Neden:**
- Kullanıcı tercihi (bazı kullanıcılar dark mode tercih eder)
- Modern web standartı
- Göz yormayan deneyim (özellikle akşam saatlerinde)

**Alternatifler:**
- Custom theme provider (daha fazla kontrol)
- CSS variables only (daha basit ama daha az özellik)

**Karar:**
- next-themes seçildi çünkü: Next.js ile mükemmel entegrasyon, sistem tercihini otomatik algılar, kolay kullanım

### 4 Ocak 2026 - Faz 1.3 Tamamlandı ✅
**Ne değişti:**
- `lib/config.ts` oluşturuldu (environment-based configuration)
- `next.config.js` optimize edildi (image domains, production optimizations)
- Development/Production config ayrımı yapıldı
- Environment setup rehberi oluşturuldu (`docs/guides/ENVIRONMENT_SETUP.md`)
- Configuration validation eklendi

**Neden:**
- Environment variable'ların merkezi yönetimi gerekiyordu
- Development ve production arasında farklı ayarlar olacak
- Image optimization için Next.js config'i optimize edilmeliydi
- Vercel deployment için hazırlık yapılmalıydı

**Alternatifler:**
- Her yerde `process.env` kullanmak (merkezi yönetim yok)
- Config dosyası olmadan (validation yok)

**Karar:**
- `lib/config.ts` ile merkezi configuration yönetimi
- Type-safe configuration
- Otomatik validation (production'da hata verir)

---

**Son Güncelleme:** 4 Ocak 2026

