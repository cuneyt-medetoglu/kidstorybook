# ✅ API Test Checklist

**Last Updated:** 10 Ocak 2026  
**Test Environment:** http://localhost:3001

---

## 🚀 Hızlı Başlangıç

### Adım 1: Server'ı Başlat

```bash
npm run dev
```

**Beklenen çıktı:**
```
  ▲ Next.js 14.2.35
  - Local:        http://localhost:3001
```

### Adım 2: Postman Setup

1. **Collection İçe Aktar:**
   - `postman/KidStoryBook_API.postman_collection.json`
   - `postman/KidStoryBook_Environment.postman_environment.json`

2. **Environment Aktif Et:**
   - Sağ üst köşe → **KidStoryBook - Local Development**

3. **Environment Variables Ayarla:**
   - `base_url` → `http://localhost:3001/api` ✅ (Zaten doğru)
   - `test_email` → Supabase'de oluşturduğun test kullanıcı email
   - `test_password` → Supabase'de oluşturduğun test kullanıcı şifresi

---

## 🧪 Test Edilebilir Endpoint'ler

### ✅ Hazır ve Test Edilebilir

| Endpoint | Method | Durum | Not |
|----------|--------|-------|-----|
| `/api/auth/test-login` | POST | ✅ | Development only |
| `/api/characters` | GET | ✅ | Bearer token gerekli |
| `/api/characters` | POST | ✅ | Bearer token gerekli |
| `/api/characters/:id` | GET | ⚠️ | **Güncelleniyor** (cookie-based, Bearer token desteklenecek) |
| `/api/characters/:id` | PATCH | ⚠️ | **Güncelleniyor** |
| `/api/characters/:id` | DELETE | ⚠️ | **Güncelleniyor** |
| `/api/characters/:id/set-default` | POST | ⚠️ | **Güncelleniyor** |
| `/api/characters/analyze` | POST | ⚠️ | **Güncelleniyor** |
| `/api/books` | POST | ✅ | Bearer token gerekli |
| `/api/books` | GET | ✅ | Bearer token gerekli |
| `/api/books/:id` | GET | ✅ | Bearer token gerekli |
| `/api/books/:id` | PATCH | ✅ | Bearer token gerekli |
| `/api/books/:id` | DELETE | ✅ | Bearer token gerekli |
| `/api/ai/generate-story` | POST | ⚠️ | **Güncelleniyor** |
| `/api/ai/generate-images` | POST | ⚠️ | **Güncelleniyor** |
| `/api/tts/generate` | POST | ⚠️ | **Güncelleniyor** |

**Not:** ⚠️ işaretli endpoint'ler henüz Bearer token desteği eklenmedi, sadece cookie-based çalışıyor. Şimdilik test edilebilir ama Postman'de Bearer token ile çalışmayabilir.

---

## 📋 Test Sırası (Önerilen)

### 1. Authentication (İlk Adım - Zorunlu)

**Endpoint:** `POST /api/auth/test-login`

**Postman:**
- **Authentication → Get Auth Token (Test Login)**

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "testpassword123"
}
```

**Test Senaryoları:**
- ✅ Valid credentials → 200 OK, token alındı
- ✅ Invalid credentials → 401 Unauthorized
- ✅ Missing email → 400 Bad Request
- ✅ Missing password → 400 Bad Request

**Beklenen Sonuç:**
- Token otomatik olarak `auth_token` environment variable'ına kaydedilir
- `user_id` otomatik kaydedilir

---

### 2. Books API Testleri (Hazır ✅)

**Endpoint'ler:**
- ✅ `POST /api/books` - Create book (story generation)
- ✅ `GET /api/books` - Get all books
- ✅ `GET /api/books/:id` - Get book details
- ✅ `PATCH /api/books/:id` - Update book
- ✅ `DELETE /api/books/:id` - Delete book

**Test Senaryoları:**
- ✅ Create book with valid character → 200 OK
- ✅ Get all books → 200 OK, books array
- ✅ Get book by ID → 200 OK, book data
- ✅ Update book (favorite) → 200 OK, updated book
- ✅ Delete book → 200 OK, deleted

**Postman Collection:**
- `Books → Create Book (Generate Story)`
- `Books → Get All Books`
- `Books → Get Book by ID`
- `Books → Update Book`
- `Books → Delete Book`

---

### 3. Characters API Testleri (Güncelleniyor ⚠️)

**Endpoint'ler:**
- ⚠️ `POST /api/characters/analyze` - Analyze photo
- ✅ `GET /api/characters` - Get all characters (cookie-based çalışıyor)
- ⚠️ `GET /api/characters/:id` - Get character details
- ⚠️ `PATCH /api/characters/:id` - Update character
- ⚠️ `DELETE /api/characters/:id` - Delete character
- ⚠️ `POST /api/characters/:id/set-default` - Set default

**Not:** Characters API'leri henüz Bearer token desteği eklenmedi. Şimdilik browser'dan test edilebilir, Postman'de cookie-based çalışır (Supabase session cookie'leri).

---

### 4. AI Generation API Testleri (Güncelleniyor ⚠️)

**Endpoint'ler:**
- ⚠️ `POST /api/ai/generate-story` - Generate story
- ⚠️ `POST /api/ai/generate-images` - Generate images

**Not:** AI API'leri henüz Bearer token desteği eklenmedi. Şimdilik browser'dan test edilebilir.

---

## 🔄 Tam Test Senaryosu (Books API - Hazır ✅)

### Senaryo 1: Full Book Creation Flow

**Adımlar:**
1. ✅ **Authentication → Get Auth Token** (Login)
2. ⚠️ **Characters → Analyze Character Photo** (Karakter oluştur - henüz Bearer token desteği yok)
3. ✅ **Books → Create Book** (Story generate et)
4. ⚠️ **AI Generation → Generate Images** (Görseller oluştur - henüz Bearer token desteği yok)
5. ✅ **Books → Get Book by ID** (Sonucu kontrol et)

**Beklenen Sonuç:**
- Token alındı ✅
- Character oluşturuldu (browser'dan) ⚠️
- Story generate edildi ✅
- Images generate edildi (browser'dan) ⚠️
- Book tamamlandı ✅

---

## ⚠️ Önemli Notlar

### Backend ve Frontend
- ✅ **Aynı yerde çalışıyor** (Next.js App Router)
- ✅ **`npm run dev` yeterli** (hem frontend hem backend)
- ✅ **Port: 3001** (`package.json` → `"dev": "next dev -p 3001"`)

### Base URL
- ✅ **Postman'de:** `http://localhost:3001/api` (Doğru)
- ✅ **Collection'da:** `{{base_url}}` variable'ı kullanılıyor

### Authentication
- ✅ **Test Login Endpoint:** `/api/auth/test-login` (Development only)
- ✅ **Bearer Token:** Postman'de `Authorization: Bearer {{auth_token}}` header'ı otomatik eklenir
- ⚠️ **Characters API'leri:** Henüz Bearer token desteği yok, cookie-based çalışıyor
- ✅ **Books API'leri:** Bearer token desteği eklendi ✅

### Test Edilebilir Endpoint'ler
**Şu an tam test edilebilir:**
- ✅ Authentication (test-login)
- ✅ Books API (5 endpoint - tam hazır)

**Güncelleniyor (şimdilik browser'dan test edilebilir):**
- ⚠️ Characters API (6 endpoint - Bearer token desteği eklenecek)
- ⚠️ AI Generation API (2 endpoint - Bearer token desteği eklenecek)
- ⚠️ TTS API (1 endpoint - Bearer token desteği eklenecek)

---

## 🚀 Şimdi Ne Yapmalısın?

### Adım 1: Server'ı Başlat

```bash
npm run dev
```

### Adım 2: Test Kullanıcısı Oluştur

**Supabase Dashboard'dan:**
1. Supabase Dashboard → Authentication → Users
2. **Add user** → Email/Password
3. Email: `test@example.com` (veya istediğin email)
4. Password: `testpassword123` (veya istediğin şifre)
5. User oluşturuldu ✅

### Adım 3: Postman Setup

1. Collection'ı içe aktar ✅ (Zaten hazır)
2. Environment'ı aktif et ✅ (Zaten hazır)
3. Environment variables'ı güncelle:
   - `test_email` → Supabase'de oluşturduğun email
   - `test_password` → Supabase'de oluşturduğun şifre

### Adım 4: Test Login

**Postman'de:**
1. **Authentication → Get Auth Token (Test Login)**
2. **Send** butonuna tıkla
3. ✅ **Beklenen:** 200 OK, token alındı

### Adım 5: Books API'lerini Test Et

**Sırayla:**
1. ✅ **Books → Create Book** (Character ID gerekli - şimdilik manuel ekle)
2. ✅ **Books → Get All Books**
3. ✅ **Books → Get Book by ID**
4. ✅ **Books → Update Book**
5. ✅ **Books → Delete Book**

---

## 📝 Sonraki Adımlar

1. ✅ Books API'leri test edildi
2. ⏳ Characters API'lerine Bearer token desteği eklenecek
3. ⏳ AI Generation API'lerine Bearer token desteği eklenecek
4. ⏳ TTS API'ye Bearer token desteği eklenecek
5. ⏳ Frontend entegrasyonu

---

**Owner:** @api-manager  
**Related:** `docs/api/API_DOCUMENTATION.md`, `docs/api/POSTMAN_COLLECTION.md`, `docs/guides/API_TESTING_GUIDE.md`

