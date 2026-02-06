# AWS EC2’de migration sırası (Supabase → düz PostgreSQL)

**Amaç:** `supabase/migrations` dosyalarını EC2’deki PostgreSQL’e uygulamak. Supabase’e özel (storage, auth) olanlar atlanır; `auth.users` referansı için minimal stub oluşturulur.

---

## 1. EC2’de migration dosyalarını kullan

- Projeyi EC2’de clone’la veya `supabase/migrations` klasörünü `scp` ile kopyala.
- Örnek (laptop’tan):  
  `scp -i kidstorybook-key.pem -r supabase/migrations ubuntu@18.184.150.1:~/migrations`

---

## 2. Çalıştırılacak migration’lar (sırayla)

Aşağıdakileri **kidstorybook** kullanıcısı ve **kidstorybook** veritabanı ile çalıştır (EC2’de):

```bash
cd ~/migrations   # veya migrations klasörünün yolu

export PGPASSWORD='KidStoryBook_Pg_8kL3mN9pQr2'

psql -h localhost -U kidstorybook -d kidstorybook -f 00001_initial_schema.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 001_create_characters_table.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 002_update_books_table.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 003_create_books_table.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 007_add_pdf_columns.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 009_add_character_type.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 011_add_image_edit_feature.sql
```

---

## 3. auth şeması ve stub (012’den önce)

`012_create_drafts_table.sql` ve bazı RLS’ler `auth.users` ve `auth.uid()` kullanıyor. Önce stub’ları oluştur:

```bash
psql -h localhost -U kidstorybook -d kidstorybook << 'EOF'
CREATE SCHEMA IF NOT EXISTS auth;
CREATE TABLE IF NOT EXISTS auth.users (id UUID PRIMARY KEY);
-- auth.uid() RLS’lerde kullanılıyor; stub (uygulama ileride session ile set edebilir)
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
  SELECT NULL::UUID;
$$ LANGUAGE sql STABLE;
EOF
```

---

## 4. Kalan migration’lar

```bash
psql -h localhost -U kidstorybook -d kidstorybook -f 012_create_drafts_table.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 013_add_free_cover_to_users.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 014_guest_free_cover_used.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 015_add_user_role.sql
psql -h localhost -U kidstorybook -d kidstorybook -f 016_add_is_example_to_books.sql
```

---

## 5. RLS’i kapat (opsiyonel)

Uygulama tarafında (Clerk/Auth0 vb.) yetki kontrolü yapacaksan, DB’de RLS’i kapatabilirsin; böylece `kidstorybook` kullanıcısı tüm tablolara erişir:

```bash
psql -h localhost -U kidstorybook -d kidstorybook << 'EOF'
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.books DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts DISABLE ROW LEVEL SECURITY;
EOF
```

---

## Atlanacak migration’lar (Supabase’e özel)

| Dosya | Neden atlanıyor |
|-------|------------------|
| 004_create_storage_buckets.sql | storage.buckets (S3 kullanılacak) |
| 005_fix_user_references.sql | auth.users’a geçiş (biz public.users ile kalıyoruz) |
| 006_storage_rls_policy.sql | storage.objects |
| 008_add_pdf_mime_type.sql | storage.buckets |
| 008_create_tts_cache_bucket.sql | storage.buckets |
| 010_add_pdfs_bucket_rls_policy.sql | storage.objects |

---

## Hata alırsan

- **“relation auth.users does not exist”** → Önce “3. auth şeması ve stub” adımını çalıştır.
- **“function auth.uid() does not exist”** → Aynı stub bloğunda `auth.uid()` fonksiyonunu da oluşturduğundan emin ol.
- **“permission denied for schema auth”** → `auth` şemasını ve tabloyu `postgres` süper kullanıcı ile oluştur:  
  `sudo -u postgres psql -d kidstorybook -c "CREATE SCHEMA IF NOT EXISTS auth; CREATE TABLE IF NOT EXISTS auth.users (id UUID PRIMARY KEY);"`  
  Sonra `auth.uid()` fonksiyonunu yine postgres veya schema owner ile oluştur.
