# 📋 Migration Sırası Rehberi

**Tarih:** 10 Ocak 2026  
**Durum:** ✅ Aktif

---

## 🎯 Migration Sırası (KRİTİK!)

Migration dosyalarını **mutlaka bu sırayla** çalıştır:

### Sıralama

```
1. ✅ 00001_initial_schema.sql      (Initial schema - mevcut)
2. ✅ 001_create_characters_table.sql (Characters table enhance) - **Uygulandı**
3. ✅ 002_update_books_table.sql    (Books table + trigger) - **Uygulandı**
4. ✅ 003_create_books_table.sql     (Books table enhance) - **Uygulandı**
5. ✅ 004_create_storage_buckets.sql (Storage buckets policies) - **Uygulandı (10 Ocak 2026)**
```

### ⚠️ ÖNEMLİ NOT: Migration 002 ve 003

**Migration 002:**
- `character_id` column'u ekler (zaten initial schema'da var, sorun yok)
- Index'leri ekler (IF NOT EXISTS - güvenli)
- **Trigger ekler** (`update_character_books_array`) - KRİTİK!
- Helper function ekler (`get_books_by_character`) - ÖNEMLİ!

**Migration 003:**
- Books table'ı enhance eder (yeni column'lar ekler)
- Index'leri ekler (character_id index'leri de var)
- Helper functions ekler

**Sıralama:**
- ✅ **Önce 002 çalıştır** (trigger ve function ekler)
- ✅ **Sonra 003 çalıştır** (table'ı enhance eder)

**VEYA**

- ✅ **Önce 003 çalıştır** (table'ı enhance eder)
- ✅ **Sonra 002 çalıştır** (trigger ve function ekler - conflict olmaz, IF NOT EXISTS kullanıyor)

**Her iki sırada da çalışır, ama 002 → 003 daha mantıklı!**

---

## 📊 Her Migration'ın Yaptığı İşler

### Migration 001: Characters Table
- ✅ Characters table'ı enhance eder (yeni column'lar)
- ✅ Index'leri ekler (`IF NOT EXISTS`)
- ✅ RLS policies ekler/günceller
- ✅ Triggers ekler (updated_at, single default, book count)
- ✅ Helper functions ekler (`get_default_character`, `get_character_stats`)

### Migration 002: Update Books Table
- ✅ `character_id` column kontrolü (zaten var, sorun yok)
- ✅ Index'leri ekler (`IF NOT EXISTS` - güvenli)
- ✅ **Trigger ekler** (`update_character_books_array`) - KRİTİK!
  - Book oluşturulduğunda character'ın `used_in_books` array'ini günceller
  - Book silindiğinde array'den çıkarır
  - Book güncellendiğinde array'i sync eder
- ✅ Helper function ekler (`get_books_by_character`)

### Migration 003: Create Books Table
- ✅ Books table'ı enhance eder (yeni column'lar ekler)
  - `story_data`, `total_pages`, `images_data`, `is_favorite`, vb.
- ✅ Index'leri ekler (`IF NOT EXISTS`)
  - `idx_books_user_id`, `idx_books_character_id`, `idx_books_status`, vb.
- ✅ RLS policies ekler/günceller
- ✅ Triggers ekler (updated_at, completed_at)
- ✅ Helper functions ekler (`get_user_book_stats`, `get_book_with_character`, `increment_book_views`)

### Migration 004: Storage Buckets
- ✅ `book-images` bucket (public, 10MB)
- ✅ `reference-photos` bucket (private, 5MB)
- ✅ Storage policies ekler (users can only access their own)
- ✅ Helper function ekler (`cleanup_orphaned_book_images`)

---

## ✅ Şu Anki Durumun

- ✅ Migration 001: **Çalıştırıldı** (Characters table enhance) - 10 Ocak 2026
- ✅ Migration 002: **Çalıştırıldı** (Books table trigger, helper function) - 10 Ocak 2026
- ✅ Migration 003: **Çalıştırıldı** (Books table enhance) - 10 Ocak 2026
- ✅ Migration 004: **Çalıştırıldı** (Storage buckets policies) - 10 Ocak 2026

**✅ TÜM MİGRATION'LAR TAMAMLANDI!**

---

## 🚀 Şimdi Ne Yapmalısın?

### ✅ Adım 1: Migration 002 - TAMAMLANDI

**Uygulandı:** 10 Ocak 2026

**Eklenen özellikler:**
- ✅ `update_character_books_array()` trigger function
- ✅ `trigger_update_character_books` trigger (books table'da)
- ✅ `get_books_by_character()` helper function

**Doğrulandı:** ✅ Trigger ve function'lar başarıyla oluşturuldu

### ⏳ Adım 2: Migration 004 - SIRADA

**Not:** Storage bucket'ları zaten mevcut (book-images, reference-photos)
- Migration 004 sadece **storage policies** ve **helper function** ekleyecek

1. SQL Editor'da **New query** ile yeni sorgu oluştur
2. `supabase/migrations/004_create_storage_buckets.sql` dosyasını aç
3. Tüm içeriği kopyala-yapıştır
4. Run butonuna tıkla
5. ✅ "Success" mesajını bekle

**Eklenen özellikler:**
- ✅ Storage policies (RLS for storage.objects)
- ✅ Helper function (`cleanup_orphaned_book_images`)

**Beklenen sonuç:**
```
Success. No rows returned
```

### ✅ Adım 3: Doğrulama (Migration 002)

**Uygulandı:** 10 Ocak 2026

SQL Editor'da şu sorguları çalıştır:

```sql
-- Trigger kontrolü
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'books';

-- Function kontrolü
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE '%character%' OR routine_name LIKE '%book%')
ORDER BY routine_name;

-- Storage buckets kontrolü
SELECT name, public, file_size_limit
FROM storage.buckets;
```

**Doğrulandı (10 Ocak 2026):**
- ✅ `trigger_update_character_books` trigger var
- ✅ `update_character_books_array` function var
- ✅ `get_books_by_character` function var
- ✅ `book-images` bucket var (public, 10MB)
- ✅ `reference-photos` bucket var (private, 50MB)

**Not:** Storage bucket'ları zaten mevcut, Migration 004 sadece policies ekleyecek.

### ⏳ Adım 4: Migration 004 Doğrulama (Sırada)

Migration 004 çalıştırıldıktan sonra:

SQL Editor'da şu sorguları çalıştır:

```sql
-- Storage policies kontrolü
SELECT policyname, bucket_id, cmd
FROM storage.policies
WHERE bucket_id IN ('book-images', 'reference-photos');

-- Helper function kontrolü
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'cleanup_orphaned_book_images';
```

**Beklenen sonuçlar:**
- ✅ `book-images` için 4 policy (SELECT, INSERT, UPDATE, DELETE)
- ✅ `reference-photos` için 4 policy (SELECT, INSERT, UPDATE, DELETE)
- ✅ `cleanup_orphaned_book_images` function var

---

## 🎉 Tamamlandı!

Tüm migration'lar başarıyla uygulandıktan sonra:

1. ✅ Database schema hazır
2. ✅ Character consistency sistemi aktif
3. ✅ Trigger'lar çalışıyor (otomatik sync)
4. ✅ Storage buckets hazır
5. ✅ Helper functions mevcut

**Sonraki Adımlar:**
- API testleri yap
- Frontend entegrasyonuna başla
- End-to-end test yap

---

**Owner:** @database-manager  
**Related:** `docs/guides/SUPABASE_MIGRATION_GUIDE.md`, `docs/database/SCHEMA.md`

