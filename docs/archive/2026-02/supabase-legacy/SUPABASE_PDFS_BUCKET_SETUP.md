# PDFs Bucket RLS Policy Kurulum Rehberi

**Tarih:** 17 Ocak 2026  
**Sorun:** `pdfs` bucket'ına PDF yükleme için RLS policy'leri gerekli

---

## 🎯 Amaç

`pdfs` bucket'ına PDF yüklemek için RLS (Row Level Security) policy'lerini eklemek.

---

## ✅ Çözüm 1: Supabase Dashboard - Storage Policies UI (ÖNERİLEN)

Supabase Dashboard'dan Storage Policies bölümünden manuel olarak ekleyin:

### Adımlar:

1. **Supabase Dashboard'a Git**
   - https://app.supabase.com
   - Projeni seç

2. **Storage → Policies**
   - Sol menüden **Storage** → **Policies** seç
   - Veya direkt: **Storage** → **Files** → **pdfs** bucket'ı → **Policies** tab

3. **Yeni Policy Ekle**

   **Policy 1: Upload (INSERT)**
   - **Policy Name:** `Users can upload PDFs to their own folder`
   - **Allowed Operation:** `INSERT`
   - **Target Roles:** `authenticated`
   - **USING expression:** (boş bırak)
   - **WITH CHECK expression:**
     ```sql
     bucket_id = 'pdfs' AND (storage.foldername(name))[1] = auth.uid()::text
     ```

   **Policy 2: Update (UPDATE)**
   - **Policy Name:** `Users can update their own PDFs`
   - **Allowed Operation:** `UPDATE`
   - **Target Roles:** `authenticated`
   - **USING expression:**
     ```sql
     bucket_id = 'pdfs' AND (storage.foldername(name))[1] = auth.uid()::text
     ```
   - **WITH CHECK expression:**
     ```sql
     bucket_id = 'pdfs' AND (storage.foldername(name))[1] = auth.uid()::text
     ```

   **Policy 3: Delete (DELETE)**
   - **Policy Name:** `Users can delete their own PDFs`
   - **Allowed Operation:** `DELETE`
   - **Target Roles:** `authenticated`
   - **USING expression:**
     ```sql
     bucket_id = 'pdfs' AND (storage.foldername(name))[1] = auth.uid()::text
     ```
   - **WITH CHECK expression:** (boş bırak)

   **Policy 4: Public Read (SELECT)**
   - **Policy Name:** `Public read access for PDFs`
   - **Allowed Operation:** `SELECT`
   - **Target Roles:** `public`
   - **USING expression:**
     ```sql
     bucket_id = 'pdfs'
     ```
   - **WITH CHECK expression:** (boş bırak)

4. **Policy'leri Kaydet**
   - Her policy için **Save** butonuna tıkla
   - Tüm policy'ler eklendikten sonra test et

---

## ✅ Çözüm 2: Supabase Dashboard - SQL Editor (Alternatif)

Eğer service_role key'iniz varsa veya owner yetkileriniz varsa:

1. **Supabase Dashboard → SQL Editor**
2. Aşağıdaki SQL'i çalıştır (tek seferde):

```sql
-- Ensure pdfs bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload PDFs to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for PDFs" ON storage.objects;

-- INSERT policy
CREATE POLICY "Users can upload PDFs to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdfs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- UPDATE policy
CREATE POLICY "Users can update their own PDFs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pdfs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE policy
CREATE POLICY "Users can delete their own PDFs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pdfs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- SELECT policy (public read)
CREATE POLICY "Public read access for PDFs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pdfs');
```

**Not:** Eğer "must be owner" hatası alırsanız, **Çözüm 1**'i kullanın.

---

## ✅ Çözüm 3: Supabase CLI (Geliştiriciler için)

```bash
# Supabase CLI ile migration uygula
supabase db push

# Veya direkt SQL çalıştır
supabase db execute -f supabase/migrations/010_add_pdfs_bucket_rls_policy.sql
```

---

## 🧪 Test

Policy'ler eklendikten sonra:

1. Uygulamada PDF generation'ı test et
2. Terminal'de şu log'u gör:
   ```
   [PDF Generation] PDF uploaded successfully: ...
   ```
3. Hata almamalısın

---

## 📋 Policy Açıklamaları

### Path Format
PDF'ler şu formatta saklanır:
```
{user_id}/books/{book_id}/{filename}.pdf
```

Örnek:
```
94ba868e-f93d-4346-80f8-994a251b32c8/books/5cd42f5d-329e-46ef-bcee-455a248acfad/Arya_ve_Karl__Macera_1768602439225.pdf
```

### Policy Mantığı

- **INSERT/UPDATE/DELETE:** Kullanıcı sadece kendi user_id klasörüne erişebilir
  - `(storage.foldername(name))[1]` → İlk klasör (user_id)
  - `auth.uid()::text` → Giriş yapmış kullanıcının ID'si
  - Eşitse → İzin ver

- **SELECT:** Herkese açık (public)
  - Tüm PDF'ler herkese okunabilir
  - URL paylaşımı için gerekli

---

## ❌ Yaygın Hatalar

### Hata 1: "must be owner of relation objects"
**Sebep:** SQL Editor'dan policy oluşturma yetkisi yok  
**Çözüm:** Çözüm 1'i kullan (Storage Policies UI)

### Hata 2: "policy already exists"
**Sebep:** Policy zaten var  
**Çözüm:** Önce DROP POLICY çalıştır, sonra CREATE

### Hata 3: "bucket does not exist"
**Sebep:** `pdfs` bucket'ı yok  
**Çözüm:** Önce bucket'ı oluştur (Storage → Buckets → New bucket)

---

## ✅ Başarı Kontrolü

Policy'ler başarıyla eklendikten sonra:

```sql
-- Policy'leri kontrol et
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%PDF%';
```

4 policy görmelisin:
1. Users can upload PDFs to their own folder
2. Users can update their own PDFs
3. Users can delete their own PDFs
4. Public read access for PDFs

---

**Son Güncelleme:** 17 Ocak 2026
