# Arşiv – Şubat 2026

Bu klasör, AWS geçişi sonrası gerekli olmayan dokümanları içerir. Production ortamı AWS (EC2 PostgreSQL + S3); sıfırdan kurulum için tek referans: **docs/plans/AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md**.

## supabase-legacy/

Eski Supabase ortamına ait rehberler (production artık AWS):

- **SUPABASE_TEST_GUIDE.md** – Supabase bağlantı testi
- **SUPABASE_MIGRATION_GUIDE.md** – Supabase migration uygulama
- **SUPABASE_PDFS_BUCKET_SETUP.md** – PDFs bucket RLS kurulumu

## aws-plans/

AWS geçişi sırasında kullanılan analiz ve detay planları. İçerik master rehberde özetlendi; referans için saklanıyor:

- **SUPABASE_TO_AWS_ANALYSIS.md** – Geçiş analizi, kararlar, maliyet
- **AWS_S3_SINGLE_BUCKET_PLAN.md** – S3 tek bucket adımları (detay)
- **AWS_MIGRATIONS_ORDER.md** – Migration sırası ve atlanacak dosyalar

## Migration / NextAuth (Şubat 2026)

Supabase → AWS + NextAuth geçişi sırasında tutulan raporlar ve build notları:

- **MIGRATION_SESSION_2_SUMMARY.md** – Session 3 ilerleme raporu
- **MIGRATION_STATUS.md** – Migration özeti (tamamlanan adımlar)
- **MIGRATION_BUILD_FIXES.md** – Build hataları ve yapılan düzeltmeler
- **TEMP_CREATE_BOOK_TEST_ANALYSIS.md** – Create book test analizi (uygulama tamamlandı; referans)

## guides-auth/

Auth/schema ile ilgili tek seferlik rehberler (NextAuth geçişi sonrası referans):

- **AUTH_USERS_VS_PUBLIC_USERS.md** – auth.users vs public.users
- **DELETE_AUTH_SCHEMA.md** – auth schema silme (Supabase artığı)
- **RUN_MIGRATION_ON_EC2.md** – EC2'de migration çalıştırma
