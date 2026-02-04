## 🏗️ FAZ 1: Temel Altyapı
**Öncelik:** 🔴 Kritik

### 1.1 Proje Kurulumu ✅
- [x] **1.1.1** Next.js 14 projesi oluştur (App Router)
- [x] **1.1.2** Tailwind CSS kur ve yapılandır
- [x] **1.1.3** shadcn/ui kur ve tema ayarla
- [x] **1.1.4** ESLint + Prettier ayarla
- [x] **1.1.5** Git repo ve branch stratejisi belirle

### 1.2 Supabase Kurulumu ✅
- [x] **1.2.1** Supabase projesi oluştur
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
- [x] **1.2.3** Supabase Auth entegrasyonu (email/password + OAuth) - Client setup tamamlandı
- [x] **1.2.4** Storage bucket'ları oluştur (photos, books, pdfs, covers)
- [x] **1.2.5** Row Level Security (RLS) kuralları - Migration'da hazır
- [ ] **1.2.6** Supabase vs AWS Değerlendirmesi (23 Ocak 2026)
  - Supabase kullanmak yerine AWS'de bir makine açıp mı devam etmeliyiz değerlendirilecek
  - Supabase limitlerine göre hareket edilecek
  - Supabase dashboard anlaşılacak
  - Örnek: Realtime izleme filan var, nedir bakılacak
  - Supabase limitleri analizi (storage, bandwidth, database size, vb.)
  - AWS alternatifi maliyet analizi
  - Migration planı (eğer gerekirse)
- [ ] **1.2.7** Database Backup Sistemi (23 Ocak 2026)
  - Şimdilik Supabase'de olduğumuz için nedir ve nasıl açacağız
  - Supabase backup özellikleri araştırılacak
  - Otomatik backup ayarları
  - Daha sonra AWS'ye geçersek orada da bakılmalı
  - Backup stratejisi ve retention policy
- [ ] **1.2.8** Supabase'ı AWS'de açılacak bir makineye migrate etme | 🔴 DO
  - Supabase (PostgreSQL, Auth, Storage) servislerini AWS'de kurulacak bir makineye taşıma
  - Self-hosted Postgres / alternatif DB, Auth ve Storage çözümleri
  - Migration planı, veri taşıma ve kesinti yönetimi

### 1.3 Environment ve Yapılandırma ✅
- [x] **1.3.1** `.env.local` dosyası oluştur - ✅ Kontrol edildi ve optimize edildi
- [x] **1.3.2** Tüm API key'leri ekle (OpenAI, Groq, Supabase) - ✅ `.env.example` template hazır
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

