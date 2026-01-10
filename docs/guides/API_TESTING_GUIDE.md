# 🧪 API Test Rehberi - Hızlı Başlangıç

**Last Updated:** 10 Ocak 2026  
**Test Environment:** http://localhost:3001

---

## 📋 Sorular ve Cevaplar

### 1. Backend ve Frontend Aynı Yerde mi Çalışıyor?

**✅ Evet!**

- **Next.js 14 App Router** kullanıyoruz
- Backend ve frontend **aynı yerde** çalışıyor
- `npm run dev` → `http://localhost:3001` (hem frontend hem backend)
- Backend API'ler: `app/api/` klasöründe
- Frontend: `app/` klasöründe

### 2. `npm run dev` Yeterli mi?

**✅ Evet!**

```bash
npm run dev
```

Bu komut:
- ✅ Frontend'i başlatır (`app/` klasörü)
- ✅ Backend API'lerini başlatır (`app/api/` klasörü)
- ✅ Port 3001'de çalışır
- ✅ Hot reload desteği

**Beklenen çıktı:**
```
  ▲ Next.js 14.2.35
  - Local:        http://localhost:3001
  - ready started server on 0.0.0.0:3001
```

### 3. Postman'deki base_url Ne Olmalı?

**✅ Doğru ayarlanmış!**

- **Base URL:** `http://localhost:3001/api`
- **Postman Collection'da:** `{{base_url}}` variable'ı kullanılıyor
- **Environment'da:** `base_url = http://localhost:3001/api` ✅

**Değiştirmene gerek yok!** Zaten doğru ayarlanmış.

### 4. Hangi Collection'lar Şuan Test Edilebilir?

#### ✅ Tam Hazır ve Test Edilebilir

**Books API (5 endpoint) - ✅ TAM HAZIR:**
- ✅ `POST /api/books` - Create book (story generation)
- ✅ `GET /api/books` - Get all books
- ✅ `GET /api/books/:id` - Get book details
- ✅ `PATCH /api/books/:id` - Update book
- ✅ `DELETE /api/books/:id` - Delete book

**Authentication (1 endpoint) - ✅ TAM HAZIR:**
- ✅ `POST /api/auth/test-login` - Test login (development only)

#### ⚠️ Güncelleniyor (Şimdilik Browser'dan Test Edilebilir)

**Characters API (6 endpoint) - ⚠️ GÜNCELLENİYOR:**
- ⚠️ `POST /api/characters/analyze` - Analyze photo
- ⚠️ `GET /api/characters` - Get all characters
- ⚠️ `GET /api/characters/:id` - Get character details
- ⚠️ `PATCH /api/characters/:id` - Update character
- ⚠️ `DELETE /api/characters/:id` - Delete character
- ⚠️ `POST /api/characters/:id/set-default` - Set default

**AI Generation API (2 endpoint) - ⚠️ GÜNCELLENİYOR:**
- ⚠️ `POST /api/ai/generate-story` - Generate story
- ⚠️ `POST /api/ai/generate-images` - Generate images

**TTS API (1 endpoint) - ⚠️ GÜNCELLENİYOR:**
- ⚠️ `POST /api/tts/generate` - Generate speech

**Not:** ⚠️ işaretli endpoint'ler henüz Bearer token desteği eklenmedi. Şimdilik browser'dan (cookie-based) test edilebilir, Postman'de Bearer token ile çalışmayabilir.

---

## 🚀 Test Sırası (Önerilen)

### 1. İlk Kurulum

**Adım 1: Server'ı Başlat**

```bash
npm run dev
```

**Beklenen çıktı:**
```
  ▲ Next.js 14.2.35
  - Local:        http://localhost:3001
```

**Adım 2: Test Kullanıcısı Oluştur (İlk Sefer)**

**Supabase Dashboard'dan:**
1. Supabase Dashboard → Authentication → Users
2. **Add user** → Email/Password
3. Email: `test@example.com` (veya istediğin email)
4. Password: `testpassword123` (veya istediğin şifre)
5. ✅ User oluşturuldu

**Adım 3: Postman Setup**

1. **Collection İçe Aktar:**
   - `postman/KidStoryBook_API.postman_collection.json` ✅
   - `postman/KidStoryBook_Environment.postman_environment.json` ✅

2. **Environment Aktif Et:**
   - Sağ üst köşe → **KidStoryBook - Local Development** ✅

3. **Environment Variables Ayarla:**
   - `base_url` → `http://localhost:3001/api` ✅ (Zaten doğru)
   - `test_email` → Supabase'de oluşturduğun email (örn: `test@example.com`)
   - `test_password` → Supabase'de oluşturduğun şifre (örn: `testpassword123`)

---

### 2. Authentication Test (İlk Adım - Zorunlu)

**Endpoint:** `POST /api/auth/test-login`

**Postman'de:**
1. **Authentication → Get Auth Token (Test Login)**
2. **Send** butonuna tıkla
3. ✅ **Beklenen:** 200 OK, token alındı

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com"
    },
    "session": {
      "access_token": "eyJhbGc...",
      "refresh_token": "...",
      "expires_at": 1234567890
    }
  },
  "message": "Login successful"
}
```

**Otomatik İşlemler:**
- ✅ Token otomatik olarak `auth_token` environment variable'ına kaydedilir
- ✅ `user_id` otomatik kaydedilir
- ✅ Sonraki request'lerde token otomatik kullanılır

---

### 3. Books API Testleri (Tam Hazır ✅)

**Sıra:** Books API'leri tam hazır, test edebilirsin!

#### 3.1 Create Book (Story Generation)

**Endpoint:** `POST /api/books`

**Postman'de:**
- **Books → Create Book (Generate Story)**

**Request Body:**
```json
{
  "characterId": "{{character_id}}",
  "theme": "adventure",
  "illustrationStyle": "watercolor",
  "customRequests": "Make it exciting",
  "language": "en"
}
```

**⚠️ NOT:** `character_id` gerekli! Şimdilik:
- Environment variable'a manuel ekle, VEYA
- Browser'dan character oluştur, ID'yi kopyala

**Beklenen Sonuç:**
- ✅ 200 OK
- ✅ Story generate edildi
- ✅ Book database'e kaydedildi
- ✅ `book_id` otomatik kaydedilir
- ⏳ **Süre:** ~5-15 saniye (GPT-4o)

#### 3.2 Get All Books

**Endpoint:** `GET /api/books`

**Postman'de:**
- **Books → Get All Books**

**Query Parameters (Opsiyonel):**
- `status=completed` - Sadece tamamlanan kitaplar
- `limit=10` - Sayfa başına 10 kitap
- `offset=0` - İlk 10 kitap

**Beklenen Sonuç:**
- ✅ 200 OK
- ✅ Books array döner

#### 3.3 Get Book by ID

**Endpoint:** `GET /api/books/:id`

**Postman'de:**
- **Books → Get Book by ID**

**Beklenen Sonuç:**
- ✅ 200 OK
- ✅ Book detayları döner
- ✅ View count otomatik artar

#### 3.4 Update Book

**Endpoint:** `PATCH /api/books/:id`

**Postman'de:**
- **Books → Update Book**

**Request Body (Tüm alanlar opsiyonel):**
```json
{
  "title": "New Title",
  "is_favorite": true,
  "status": "completed"
}
```

**Beklenen Sonuç:**
- ✅ 200 OK
- ✅ Updated book döner

#### 3.5 Delete Book

**Endpoint:** `DELETE /api/books/:id`

**Postman'de:**
- **Books → Delete Book**

**Beklenen Sonuç:**
- ✅ 200 OK
- ✅ Book silindi

---

### 4. Characters API Testleri (Güncelleniyor ⚠️)

**Not:** Characters API'leri henüz Bearer token desteği eklenmedi. Şimdilik browser'dan test edilebilir.

**Planlanan Güncellemeler:**
- ⏳ Bearer token desteği eklenecek
- ⏳ Postman'de test edilebilir hale gelecek

---

### 5. AI Generation API Testleri (Güncelleniyor ⚠️)

**Not:** AI Generation API'leri henüz Bearer token desteği eklenmedi. Şimdilik browser'dan test edilebilir.

**Planlanan Güncellemeler:**
- ⏳ Bearer token desteği eklenecek
- ⏳ Postman'de test edilebilir hale gelecek

---

## 📊 Test Senaryoları

### Senaryo 1: Books API Full Test (Tam Hazır ✅)

**Sıralama:**
1. ✅ **Authentication → Get Auth Token** (Login)
2. ✅ **Books → Create Book** (Character ID gerekli - manuel ekle)
3. ✅ **Books → Get All Books** (Kitapları listele)
4. ✅ **Books → Get Book by ID** (Detayları görüntüle)
5. ✅ **Books → Update Book** (Favorite, status güncelle)
6. ✅ **Books → Delete Book** (Sil)

**Beklenen Sonuç:**
- ✅ Token alındı
- ✅ Book oluşturuldu
- ✅ Books listelendi
- ✅ Book detayları görüntülendi
- ✅ Book güncellendi
- ✅ Book silindi

### Senaryo 2: Full Book Creation Flow (Kısmen Hazır ⚠️)

**Sıralama:**
1. ✅ **Authentication → Get Auth Token** (Login)
2. ⚠️ **Characters → Analyze Character Photo** (Browser'dan - henüz Bearer token yok)
3. ✅ **Books → Create Book** (Story generate et)
4. ⚠️ **AI Generation → Generate Images** (Browser'dan - henüz Bearer token yok)
5. ✅ **Books → Get Book by ID** (Sonucu kontrol et)

**Beklenen Sonuç:**
- ✅ Token alındı
- ⚠️ Character oluşturuldu (browser'dan)
- ✅ Story generate edildi
- ⚠️ Images generate edildi (browser'dan)
- ✅ Book tamamlandı

---

## ⚠️ Önemli Notlar

### Authentication

**Bearer Token (Postman):**
- ✅ Test login endpoint'i: `/api/auth/test-login` (development only)
- ✅ Token otomatik kaydedilir (`auth_token` variable)
- ✅ Header'da otomatik eklenir (`Authorization: Bearer {{auth_token}}`)

**Session Cookie (Browser):**
- ✅ Browser'dan gelen request'lerde otomatik çalışır
- ✅ Supabase session cookie'leri kullanılır

### Test Edilebilir Endpoint'ler

**Şu an tam test edilebilir:**
- ✅ Authentication (test-login) - 1 endpoint
- ✅ Books API - 5 endpoint

**Toplam:** 6 endpoint tam hazır ✅

**Güncelleniyor (şimdilik browser'dan test edilebilir):**
- ⚠️ Characters API - 6 endpoint
- ⚠️ AI Generation API - 2 endpoint
- ⚠️ TTS API - 1 endpoint

**Toplam:** 9 endpoint güncellenecek ⚠️

---

## 🚀 Şimdi Ne Yapmalısın?

### 1. Server'ı Başlat

```bash
npm run dev
```

### 2. Test Kullanıcısı Oluştur

**Supabase Dashboard'dan:**
- Authentication → Users → Add user
- Email/Password ile kullanıcı oluştur

### 3. Postman Setup

- Collection'ı içe aktar ✅ (Zaten hazır)
- Environment'ı aktif et ✅ (Zaten hazır)
- `test_email` ve `test_password` ayarla

### 4. Test Login

**Postman'de:**
- **Authentication → Get Auth Token (Test Login)**
- Send → Token alındı ✅

### 5. Books API'lerini Test Et

**Sırayla:**
1. ✅ **Books → Create Book** (Character ID gerekli - şimdilik manuel ekle)
2. ✅ **Books → Get All Books**
3. ✅ **Books → Get Book by ID**
4. ✅ **Books → Update Book**
5. ✅ **Books → Delete Book**

---

## 📝 Sonraki Adımlar

1. ✅ Books API testleri tamamlandı
2. ⏳ Characters API'lerine Bearer token desteği eklenecek
3. ⏳ AI Generation API'lerine Bearer token desteği eklenecek
4. ⏳ TTS API'ye Bearer token desteği eklenecek
5. ⏳ Frontend entegrasyonu

---

**Owner:** @api-manager  
**Related:** `docs/api/API_DOCUMENTATION.md`, `docs/api/POSTMAN_COLLECTION.md`, `docs/api/TESTING_CHECKLIST.md`
