# 📦 Supabase Migrations

**Last Updated:** 10 Ocak 2026

---

## 📋 Migration Dosyaları

### Sıralama (ÖNEMLİ!)

Migration dosyalarını **sırayla** çalıştır:

1. ✅ `001_create_characters_table.sql` - Characters table ve helper functions
2. ⚠️ `002_update_books_table.sql` - Books table'a character_id ekler (books varsa)
3. ✅ `003_create_books_table.sql` - Books table ve helper functions
4. ✅ `004_create_storage_buckets.sql` - Storage buckets ve policies

### ⚠️ Önemli Not

**Migration 002** books table'ı günceller. Eğer books table henüz yoksa:
- Önce **003**'ü çalıştır (books table oluşturur)
- Sonra **002**'yi çalıştır (character_id ekler)

**VEYA**

Books table zaten varsa:
- Önce **002**'yi çalıştır
- Sonra **003**'ü çalıştır

---

## 🚀 Uygulama Yöntemleri

### Yöntem 1: Supabase Dashboard (Önerilen)

1. [Supabase Dashboard](https://app.supabase.com) → SQL Editor
2. Her migration dosyasını sırayla aç
3. İçeriği kopyala-yapıştır
4. **Run** butonuna tıkla

**Detaylı rehber:** `docs/guides/SUPABASE_MIGRATION_GUIDE.md`

### Yöntem 2: Supabase CLI

```bash
# Login
supabase login

# Link project
supabase link --project-ref fapkpidgcqmtmhxgzdom

# Apply migrations
supabase db push
```

---

## ✅ Migration Kontrolü

Her migration sonrası şu sorguları çalıştır:

```sql
-- Tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Functions
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public';

-- Storage buckets
SELECT name FROM storage.buckets;
```

---

## 📊 Migration İçerikleri

### 001 - Characters Table
- ✅ Characters table
- ✅ Indexes (user_id, default, created_at, total_books)
- ✅ RLS policies
- ✅ Triggers (updated_at, single default, book count)
- ✅ Helper functions

### 002 - Update Books Table
- ✅ character_id foreign key
- ✅ Trigger: Auto-update used_in_books array
- ✅ Helper function: get_books_by_character

### 003 - Create Books Table
- ✅ Books table
- ✅ Indexes (user_id, character_id, status, created_at)
- ✅ RLS policies
- ✅ Triggers (updated_at, completed_at)
- ✅ Helper functions

### 004 - Storage Buckets
- ✅ book-images bucket (public, 10MB)
- ✅ reference-photos bucket (private, 5MB)
- ✅ Storage policies
- ✅ Helper function: cleanup_orphaned_book_images

### 010 - PDFs Bucket RLS Policy
- ✅ pdfs bucket RLS policies (public read, authenticated write)
- ✅ User folder-based access control
- ✅ Created: 2026-01-17
- **Purpose:** Allow PDF uploads to pdfs bucket (50 MB limit)

---

**Project Reference:** `fapkpidgcqmtmhxgzdom`  
**Related:** `docs/guides/SUPABASE_MIGRATION_GUIDE.md`

