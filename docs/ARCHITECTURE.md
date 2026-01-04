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

### Durum: **Şimdi Oluşturulmalı**

`.env.local` dosyası şu an yok, ama **Faz 1.3'te oluşturulacak**.

#### Neden Şimdi Değil?

- Supabase projesi henüz oluşturulmadı (Faz 1.2)
- API key'ler henüz gerekli değil
- Development server çalışıyor (API key olmadan)

#### Ne Zaman Oluşturulmalı?

**Faz 1.2'den sonra (Supabase kurulumu tamamlandıktan sonra):**
- Supabase URL ve key'ler hazır olacak
- API key'ler eklenebilir
- Environment variables yapılandırılabilir

#### Şimdilik Yapılacaklar

1. ✅ `.env.example` dosyası oluşturuldu (template)
2. ⏳ Faz 1.2'de Supabase kurulumu
3. ⏳ Faz 1.3'te `.env.local` oluşturulacak

---

## 📁 Proje Yapısı

### Mevcut Yapı

```
kidstorybook/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   └── api/                # API Routes (Backend)
│       ├── auth/           # Authentication endpoints
│       ├── characters/     # Character endpoints
│       ├── books/          # Book endpoints
│       └── ai/              # AI endpoints
├── components/             # React Components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Custom components
├── lib/                    # Utility functions
│   ├── utils.ts            # Helper functions
│   ├── supabase.ts         # Supabase client
│   └── ...                 # Other utilities
├── docs/                   # Dokümantasyon
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

| Katman | Teknoloji | Not |
|--------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | SSR, SEO, Performance |
| **UI** | Tailwind CSS + shadcn/ui | Modern, hızlı geliştirme |
| **Backend** | Next.js API Routes | Built-in, serverless |
| **Database** | Supabase (PostgreSQL) | Auth, DB, Storage |
| **AI** | OpenAI, Groq, Gemini | Multiple providers |
| **Ödeme** | Stripe + İyzico | Global + Türkiye |
| **Hosting** | Vercel | Next.js için optimize |
| **Container** | Docker (gelecek) | Local dev, CI/CD |

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

### Şimdilik Yapılacaklar

1. ✅ Monorepo yapısı ile devam et
2. ✅ Next.js API Routes kullan (ayrı backend server'a gerek yok)
3. ⏳ Faz 1.2: Supabase kurulumu
4. ⏳ Faz 1.3: Environment variables
5. ⏳ Gelecekte: Docker desteği

---

**Son Güncelleme:** 4 Ocak 2026

