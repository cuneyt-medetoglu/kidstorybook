# 🚀 Supabase Migration Rehberi

**Tarih:** 10 Ocak 2026  
**Durum:** ✅ Hazır

---

## 📋 İçindekiler

1. [Yöntem 1: Supabase Dashboard (Kolay)](#yöntem-1-supabase-dashboard-kolay)
2. [Yöntem 2: Supabase CLI (Profesyonel)](#yöntem-2-supabase-cli-profesyonel)
3. [Migration Dosyaları](#migration-dosyaları)
4. [Doğrulama](#doğrulama)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 Yöntem 1: Supabase Dashboard (Kolay - Önerilen)

### Adım 1: Supabase Dashboard'a Git

1. [Supabase Dashboard](https://app.supabase.com) aç
2. Projene tıkla (Project ID: `fapkpidgcqmtmhxgzdom`)

### Adım 2: SQL Editor'ı Aç

1. Sol menüden **SQL Editor** seç
2. **New query** butonuna tıkla

### Adım 3: Migration Dosyalarını Sırayla Çalıştır

**⚠️ ÖNEMLİ:** Dosyaları sırayla çalıştır! (001 → 002 → 003 → 004)

#### Migration 001: Characters Table

1. `supabase/migrations/001_create_characters_table.sql` dosyasını aç
2. Tüm içeriği kopyala
3. SQL Editor'a yapıştır
4. **Run** butonuna tıkla (veya `Ctrl+Enter`)
5. ✅ "Success" mesajını bekle

**Beklenen sonuç:**
```
Success. No rows returned
```

#### Migration 002: Update Books Table

1. SQL Editor'da **New query** ile yeni sorgu oluştur
2. `supabase/migrations/002_update_books_table.sql` dosyasını aç
3. Tüm içeriği kopyala ve yapıştır
4. **Run** butonuna tıkla
5. ✅ "Success" mesajını bekle

**Not:** Eğer `books` table henüz yoksa hata verebilir. Bu normal, Migration 003'te oluşturulacak.

#### Migration 003: Create Books Table

1. SQL Editor'da **New query** ile yeni sorgu oluştur
2. `supabase/migrations/003_create_books_table.sql` dosyasını aç
3. Tüm içeriği kopyala ve yapıştır
4. **Run** butonuna tıkla
5. ✅ "Success" mesajını bekle

**Beklenen sonuç:**
```
Success. No rows returned
```

#### Migration 004: Create Storage Buckets

1. SQL Editor'da **New query** ile yeni sorgu oluştur
2. `supabase/migrations/004_create_storage_buckets.sql` dosyasını aç
3. Tüm içeriği kopyala ve yapıştır
4. **Run** butonuna tıkla
5. ✅ "Success" mesajını bekle

**Beklenen sonuç:**
```
Success. No rows returned
```

### Adım 4: Storage Bucket'ları Kontrol Et

1. Sol menüden **Storage** seç
2. Şu bucket'ları görmeli:
   - ✅ `book-images` (Public)
   - ✅ `reference-photos` (Private)

---

## 🛠️ Yöntem 2: Supabase CLI (Profesyonel)

### Ön Koşullar

Supabase CLI kurulu olmalı:
```bash
npm install -g supabase
```

### Adım 1: Supabase CLI'ı Bağla

```bash
# Proje root'unda
supabase login

# Proje bağlantısı
supabase link --project-ref fapkpidgcqmtmhxgzdom
```

**Project Reference ID:** `fapkpidgcqmtmhxgzdom`

### Adım 2: Migration'ları Uygula

```bash
# Tüm migration'ları uygula
supabase db push

# VEYA tek tek
supabase migration up
```

### Adım 3: Migration Durumunu Kontrol Et

```bash
# Migration history
supabase migration list

# Remote durumu
supabase db remote commit
```

---

## 📁 Migration Dosyaları

### Migration Sırası

```
supabase/migrations/
├── 001_create_characters_table.sql    ✅ 1. sırada
├── 002_update_books_table.sql         ✅ 2. sırada (books table varsa)
├── 003_create_books_table.sql         ✅ 3. sırada
└── 004_create_storage_buckets.sql     ✅ 4. sırada
```

### Migration İçerikleri

#### 001 - Characters Table
- Characters table oluşturur
- Indexes (user_id, default, created_at, total_books)
- RLS policies (users can only see their own)
- Triggers (updated_at, single default, book count)
- Helper functions (get_default_character, get_character_stats)

#### 002 - Update Books Table
- Books table'a `character_id` foreign key ekler
- Trigger: Auto-update character's `used_in_books` array
- Helper function: `get_books_by_character`

**⚠️ Not:** Eğer `books` table henüz yoksa, önce 003'ü çalıştır, sonra 002'yi.

#### 003 - Create Books Table
- Books table oluşturur (eğer yoksa)
- Indexes (user_id, character_id, status, created_at)
- RLS policies (users can only see their own)
- Triggers (updated_at, completed_at)
- Helper functions (get_user_book_stats, get_book_with_character, increment_book_views)

#### 004 - Storage Buckets
- `book-images` bucket (public, 10MB limit)
- `reference-photos` bucket (private, 5MB limit)
- Storage policies (users can only access their own)
- Helper function: `cleanup_orphaned_book_images`

---

## ✅ Doğrulama

### 1. Tables Kontrolü

SQL Editor'da şu sorguyu çalıştır:

```sql
-- Tüm table'ları listele
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Beklenen tablolar:**
- ✅ `characters`
- ✅ `books`

### 2. Indexes Kontrolü

```sql
-- Characters indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'characters';

-- Books indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'books';
```

### 3. RLS Policies Kontrolü

```sql
-- Characters policies
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'characters';

-- Books policies
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'books';
```

### 4. Triggers Kontrolü

```sql
-- Characters triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'characters';

-- Books triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'books';
```

### 5. Functions Kontrolü

```sql
-- Helper functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%character%' OR routine_name LIKE '%book%'
ORDER BY routine_name;
```

**Beklenen functions:**
- ✅ `get_default_character`
- ✅ `get_character_stats`
- ✅ `get_user_book_stats`
- ✅ `get_book_with_character`
- ✅ `increment_book_views`
- ✅ `get_books_by_character`
- ✅ `update_character_books_array`

### 6. Storage Buckets Kontrolü

Supabase Dashboard → **Storage** → Buckets

**Beklenen buckets:**
- ✅ `book-images` (Public)
- ✅ `reference-photos` (Private)

### 7. Test Query

```sql
-- Test: Helper function
SELECT * FROM get_default_character('user-id-here');

-- Test: Character oluştur (dummy)
INSERT INTO characters (user_id, name, age, gender, description)
VALUES (
  auth.uid(),
  'Test Character',
  5,
  'girl',
  '{"version": "1.0.0", "name": "Test"}'::jsonb
);

-- Test: Character'ı getir
SELECT * FROM characters WHERE user_id = auth.uid();

-- Test: Character'ı sil (cleanup)
DELETE FROM characters WHERE name = 'Test Character';
```

---

## ⚠️ Troubleshooting

### Hata 1: "relation idx_characters_user_id already exists" ✅ DÜZELTİLDİ

**Sorun:** Migration 001 çalıştırıldı ama index zaten var (initial_schema.sql'den).

**Çözüm:** ✅ **DÜZELTİLDİ!** Migration artık `CREATE INDEX IF NOT EXISTS` kullanıyor. Ayrıca:
- ✅ Policies `DROP POLICY IF EXISTS` ile temizleniyor
- ✅ Triggers `DROP TRIGGER IF EXISTS` ile temizleniyor
- ✅ Column'lar `DO $$` block ile güvenli şekilde ekleniyor

**Yapılan Düzeltmeler (10 Ocak 2026):**
- Migration 001 artık mevcut table'ı enhance ediyor (drop etmeden)
- Yeni column'lar sadece yoksa ekleniyor
- Index'ler `IF NOT EXISTS` ile oluşturuluyor
- Policies ve triggers güvenli şekilde yeniden oluşturuluyor

### Hata 2: "relation 'books' does not exist"

**Sorun:** Migration 002 çalıştırıldı ama books table yok.

**Çözüm:**
1. Önce Migration 003'ü çalıştır (books table oluşturur)
2. Sonra Migration 002'yi tekrar çalıştır

### Hata 3: "column is_favorite does not exist"

**Sorun:** Migration 003 çalıştırıldı ama `is_favorite` column'u henüz oluşturulmadan index oluşturulmaya çalışılıyor.

**Çözüm:** ✅ **DÜZELTİLDİ!** Migration artık:
- ✅ Önce column'ları ekliyor (DO block içinde)
- ✅ Sonra index'leri oluşturuyor (DO block içinde column kontrolü ile)
- ✅ Function'lar column'lar eklendikten sonra oluşturuluyor

**Yapılan Düzeltmeler (10 Ocak 2026):**
- `is_favorite` column'u DO block içinde eklendi
- Index oluşturma DO block içinde column kontrolü ile yapılıyor
- Function'lar column'lar eklendikten sonra oluşturuluyor

### Hata 4: "permission denied for schema public"

**Sorun:** RLS policies veya permissions yanlış.

**Çözüm:**
1. Supabase Dashboard → **Database** → **Roles**
2. `authenticated` ve `anon` role'lerini kontrol et
3. Gerekirse SQL Editor'dan permissions ekle:

```sql
-- Grants
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

### Hata 3: "bucket already exists"

**Sorun:** Storage bucket zaten var.

**Çözüm:** 
Migration'da `ON CONFLICT (id) DO NOTHING` var, bu normal. Devam edebilirsin.

### Hata 4: "function already exists"

**Sorun:** Helper function zaten var.

**Çözüm:**
1. Eski function'ı sil:

```sql
DROP FUNCTION IF EXISTS function_name;
```

2. Migration'ı tekrar çalıştır

**VEYA**

Migration dosyasına `CREATE OR REPLACE FUNCTION` kullan (zaten var).

### Hata 7: "trigger already exists"

**Sorun:** Trigger zaten var.

**Çözüm:**
Migration'da `DROP TRIGGER IF EXISTS` var, bu normal. Devam edebilirsin.

---

## 🔄 Migration Rollback (Geri Alma)

### Dikkat: Rollback Data Kaybettirebilir!

**⚠️ UYARI:** Rollback yapmak, tüm verileri silebilir!

### Manual Rollback (Gerekirse)

```sql
-- 1. Storage buckets'ı sil
DELETE FROM storage.buckets WHERE id IN ('book-images', 'reference-photos');

-- 2. Books table'ı sil
DROP TABLE IF EXISTS books CASCADE;

-- 3. Characters table'ı sil
DROP TABLE IF EXISTS characters CASCADE;

-- 4. Functions'ları sil
DROP FUNCTION IF EXISTS get_default_character;
DROP FUNCTION IF EXISTS get_character_stats;
DROP FUNCTION IF EXISTS get_user_book_stats;
DROP FUNCTION IF EXISTS get_book_with_character;
DROP FUNCTION IF EXISTS increment_book_views;
DROP FUNCTION IF EXISTS get_books_by_character;
DROP FUNCTION IF EXISTS update_character_books_array;
DROP FUNCTION IF EXISTS cleanup_orphaned_book_images;
-- ... diğer functions
```

**✅ Güvenli Yöntem:** Yeni bir Supabase projesi oluştur ve migration'ları orada test et.

---

## 📊 Migration Sonrası Checklist

- [ ] Characters table oluşturuldu mu?
- [ ] Books table oluşturuldu mu?
- [ ] Indexes doğru mu?
- [ ] RLS policies aktif mi?
- [ ] Triggers çalışıyor mu?
- [ ] Helper functions var mı?
- [ ] Storage buckets oluşturuldu mu?
- [ ] Storage policies aktif mi?
- [ ] Test query başarılı mı?

---

## 🎉 Tamamlandı!

Migration'lar başarıyla uygulandıktan sonra:

1. ✅ API'ler çalışmaya hazır
2. ✅ Database schema hazır
3. ✅ Storage buckets hazır
4. ✅ Character consistency sistemi aktif

**Sonraki Adımlar:**
- API testleri yap
- Frontend entegrasyonuna başla
- End-to-end test yap

---

## 📝 Notlar

- **Production:** Migration'ları production'a uygulamadan önce mutlaka test et!
- **Backup:** Önemli veriler varsa, migration öncesi backup al!
- **Verification:** Her migration sonrası doğrulama yap!

---

**Owner:** @project-manager  
**Related:** `docs/database/SCHEMA.md`, `docs/implementation/FAZ3_IMPLEMENTATION.md`

