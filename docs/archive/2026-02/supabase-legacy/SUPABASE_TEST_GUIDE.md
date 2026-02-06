# 🧪 Supabase Test Rehberi

Bu dosya Supabase kurulumunu test etmek için kullanılır.

---

## Test Sayfası

Test sayfası oluşturuldu: **http://localhost:3001/test-supabase**

### Test Edilen Özellikler

1. **Connection (Bağlantı)**
   - Supabase'e bağlantı var mı?
   - API key'ler doğru mu?

2. **Database Schema (Veritabanı Şeması)**
   - Tüm tablolar oluşturuldu mu?
   - Tables: users, oauth_accounts, characters, books, orders, payments

3. **Storage Buckets**
   - Tüm bucket'lar oluşturuldu mu?
   - Buckets: photos, books, pdfs, covers

4. **Authentication (Kimlik Doğrulama)**
   - Auth yapılandırması çalışıyor mu?
   - Session yönetimi aktif mi?

---

## Test Nasıl Çalıştırılır?

### 1. Development Server'ı Başlat
```bash
npm run dev
```

### 2. Test Sayfasını Aç
Browser'da aç: http://localhost:3001/test-supabase

### 3. Sonuçları Kontrol Et
- ✅ Yeşil: Başarılı
- ⚠️ Sarı: Uyarı (bazı özellikler eksik)
- ❌ Kırmızı: Hata

---

## Beklenen Sonuçlar

### Başarılı Kurulum
```
✅ Connection: Connected
✅ Database Schema: All tables exist
✅ Storage Buckets: All buckets exist
✅ Authentication: Auth configured (no session)
```

### Hata Durumları

#### Connection Failed
**Sorun:** API key'ler yanlış veya eksik
**Çözüm:**
- `.env.local` dosyasını kontrol et
- `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` doğru mu?
- Dev server'ı yeniden başlat

#### Database Schema Error
**Sorun:** Tablolar oluşturulmamış
**Çözüm:**
- Supabase Dashboard > SQL Editor'ü aç
- `supabase/migrations/00001_initial_schema.sql` dosyasını çalıştır

#### Storage Buckets Missing
**Sorun:** Test sayfası bucket'ları görmüyor

**Önemli Not:**
- Eğer bucket'lar **Supabase Dashboard'da görünüyorsa**, kurulum başarılıdır ✅
- Test sayfasındaki uyarı normal olabilir çünkü:
  - `listBuckets()` fonksiyonu service_role key gerektirebilir
  - Anon key ile private bucket'lara erişilemeyebilir
  - Bu bir sorun değil, bucket'lar çalışıyor demektir

**Kontrol:**
1. Supabase Dashboard > Storage > Files > Buckets
2. 4 bucket görünmeli: photos, books, pdfs, covers
3. Eğer görünüyorsa → ✅ Kurulum başarılı

**Çözüm (Eğer gerçekten bucket'lar yoksa):**
- Supabase Dashboard > Storage'ı aç
- 4 bucket oluştur: photos, books, pdfs, covers

---

## Manuel Test Sorguları

### Test 1: Database Connection
```sql
SELECT COUNT(*) FROM users;
```
**Beklenen:** 0 (tablo boş ama çalışıyor)

### Test 2: Table Structure
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```
**Beklenen:** users, oauth_accounts, characters, books, orders, payments

### Test 3: Indexes
```sql
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
```
**Beklenen:** Index'ler görünmeli

### Test 4: RLS Policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```
**Beklenen:** Her tablo için policy'ler görünmeli

---

## Detaylı Kontrol Listesi

### ✅ 1. Connection
- [ ] Supabase'e bağlanabiliyor mu?
- [ ] `.env.local` dosyası doğru mu?
- [ ] API key'ler aktif mi?

### ✅ 2. Database
- [ ] users tablosu var mı?
- [ ] oauth_accounts tablosu var mı?
- [ ] characters tablosu var mı?
- [ ] books tablosu var mı?
- [ ] orders tablosu var mı?
- [ ] payments tablosu var mı?
- [ ] Index'ler çalışıyor mu?
- [ ] Trigger'lar (updated_at) çalışıyor mu?

### ✅ 3. Storage
- [ ] photos bucket var mı?
- [ ] books bucket var mı?
- [ ] pdfs bucket var mı?
- [ ] covers bucket var mı?
- [ ] Bucket ayarları doğru mu? (public/private, file size, MIME types)

### ✅ 4. Authentication
- [ ] Auth yapılandırması çalışıyor mu?
- [ ] Email provider aktif mi?
- [ ] OAuth provider'ları hazır mı? (Google, Facebook)

### ✅ 5. RLS (Row Level Security)
- [ ] RLS tüm tablolarda aktif mi?
- [ ] Policy'ler oluşturuldu mu?
- [ ] Policy'ler çalışıyor mu?

---

## Sorun Giderme

### Hata: "Invalid API key"
1. `.env.local` dosyasını kontrol et
2. Supabase Dashboard > Settings > API'den key'leri kontrol et
3. Dev server'ı yeniden başlat (`Ctrl+C` sonra `npm run dev`)

### Hata: "Table does not exist"
1. Supabase Dashboard > SQL Editor'ü aç
2. Migration SQL'ini çalıştır
3. Table Editor'den tabloları kontrol et

### Hata: "Storage bucket not found"
1. Supabase Dashboard > Storage'ı aç
2. Bucket'ları oluştur
3. Ayarları kontrol et

---

## Sonraki Adımlar

Test başarılı olduktan sonra:
1. ✅ Faz 1.2 tamamlandı
2. ⏳ Faz 1.3: Environment ve yapılandırma
3. ⏳ Faz 2: Frontend geliştirme

---

**Son Güncelleme:** 4 Ocak 2026

