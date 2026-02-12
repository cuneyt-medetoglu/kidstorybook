## 🏗️ FAZ 1: Temel Altyapı
**Öncelik:** 🔴 Kritik

### 1.1 Proje Kurulumu ✅
- [x] **1.1.1** Next.js 14 projesi oluştur (App Router)
- [x] **1.1.2** Tailwind CSS kur ve yapılandır
- [x] **1.1.3** shadcn/ui kur ve tema ayarla
- [x] **1.1.4** ESLint + Prettier ayarla
- [x] **1.1.5** Git repo ve branch stratejisi belirle

### 1.2 Database ve Storage Kurulumu ✅ (Supabase → AWS geçişi tamamlandı)
- [x] **1.2.1** ~~Supabase projesi oluştur~~ → AWS EC2 + PostgreSQL + S3 kuruldu ✅
- [x] **1.2.2** Veritabanı şeması tasarla ve oluştur
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
- [x] **1.2.3** Auth entegrasyonu (email/password + OAuth) - Supabase Auth client kullanılıyor; Faz 5'te alternatif planlanıyor
- [x] **1.2.4** Storage: AWS S3 tek bucket + prefix'ler (photos, books, pdfs, covers) ✅
- [x] **1.2.5** Row Level Security (RLS) kuralları - Migration'da hazır
- [x] **1.2.6** ~~Supabase vs AWS Değerlendirmesi~~ → AWS'ye geçiş kararı verildi ve uygulandı ✅ (Şubat 2026)
  - Analiz: `docs/archive/2026-02/aws-plans/SUPABASE_TO_AWS_ANALYSIS.md`
  - Karar: Tek EC2 (t3.medium) + PostgreSQL + S3; aylık ~35–45 USD
- [x] **1.2.7** Database Backup Sistemi ✅ (Şubat 2026)
  - EC2 PostgreSQL için `scripts/db-backup.sh` (pg_dump → S3, retention 14 gün)
  - Runbook: `docs/guides/DB_BACKUP_RUNBOOK.md` (cron, restore)
  - S3 prefix: `backups/db`
- [x] **1.2.8** ~~Supabase'ı AWS'de açılacak bir makineye migrate etme~~ → AWS altyapı Faz 1–4 tamamlandı ✅ (Şubat 2026)
  - EC2 Ubuntu 24.04, PostgreSQL 16, S3, IAM role, migration'lar uygulandı
  - Rehber: `docs/plans/AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md`
  - Kalan: Auth alternatifi (Faz 5) ve uygulama deploy (Faz 6)

### 1.3 Environment ve Yapılandırma ✅
- [x] **1.3.1** `.env.local` dosyası oluştur - ✅ Kontrol edildi ve optimize edildi
- [x] **1.3.2** Tüm API key'leri ekle (OpenAI, Groq, AWS/DB) - ✅ `.env.example` template hazır
- [x] **1.3.3** Vercel environment variables ayarla - ✅ Dokümante edildi (`docs/guides/ENVIRONMENT_SETUP.md`)
- [x] **1.3.4** Development/Production config ayrımı - ✅ `lib/config.ts` oluşturuldu
- [ ] **1.3.5** Log Yapısı (23 Ocak 2026)
  - Sunucuda çalışırken log yapısı ayarlanmalı
  - Log açılıp kapatılabilmeli gibi
  - Veya bir log yapısı nasıl olması gerekiyor ise o profesyonellikte ve önerilen gibi bir log yapısı olmalı
  - Log seviyeleri (DEBUG, INFO, WARN, ERROR)
  - Log rotation ve retention
  - Production'da log seviyesi kontrolü
  - Structured logging (JSON format)
  - Log aggregation (opsiyonel: Sentry, LogRocket, vb.)

---

