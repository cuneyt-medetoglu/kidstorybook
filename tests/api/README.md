# 🧪 API Test Rehberi

**Last Updated:** 10 Ocak 2026  
**Test Framework:** Manual testing + Postman

---

## 📋 Test Senaryoları

### 1. Authentication Tests

**Test Cases:**
- ✅ Valid login returns token
- ✅ Invalid credentials return 401
- ✅ Missing token returns 401
- ✅ Expired token returns 401

**Postman Collection:**
- `Authentication → Get Auth Token (Login)`

---

### 2. Characters API Tests

**Test Cases:**
- ✅ Analyze character photo creates character
- ✅ Get all characters returns user's characters
- ✅ Get character by ID returns correct character
- ✅ Update character updates successfully
- ✅ Delete character removes from database
- ✅ Set default character updates is_default flag
- ❌ Unauthorized access returns 403
- ❌ Invalid character ID returns 404

**Postman Collection:**
- `Characters → Analyze Character Photo`
- `Characters → Get All Characters`
- `Characters → Get Character by ID`
- `Characters → Update Character`
- `Characters → Delete Character`
- `Characters → Set Default Character`

---

### 3. Books API Tests

**Test Cases:**
- ✅ Create book generates story and saves to database
- ✅ Get all books returns user's books with pagination
- ✅ Get book by ID returns correct book
- ✅ Update book updates successfully (favorite, status, etc.)
- ✅ Delete book removes from database
- ✅ View count increments on GET
- ❌ Unauthorized access returns 403
- ❌ Invalid book ID returns 404
- ❌ Wrong ownership returns 403

**Postman Collection:**
- `Books → Create Book (Generate Story)`
- `Books → Get All Books`
- `Books → Get Book by ID`
- `Books → Update Book`
- `Books → Delete Book`

---

### 4. AI Generation API Tests

**Test Cases:**
- ✅ Generate story creates valid story structure
- ✅ Generate images creates images for all pages
- ✅ Story generation uses character description
- ✅ Image generation uses character consistency
- ❌ Invalid character ID returns 404
- ❌ Missing required fields returns 400

**Postman Collection:**
- `AI Generation → Generate Story`
- `AI Generation → Generate Images`

---

### 5. Integration Tests

**Full Book Creation Flow:**
1. ✅ Login → Get token
2. ✅ Analyze photo → Create character
3. ✅ Create book → Generate story
4. ✅ Generate images → Complete book
5. ✅ Get book → Verify completion

**Character Reuse Flow:**
1. ✅ Get existing character
2. ✅ Create new book with same character
3. ✅ Verify character's total_books incremented

---

## 🚀 Test Çalıştırma

### Postman ile Test

1. **Collection'ı İçe Aktar:**
   - `postman/KidStoryBook_API.postman_collection.json`
   - `postman/KidStoryBook_Environment.postman_environment.json`

2. **Environment'ı Aktif Et:**
   - **KidStoryBook - Local Development**

3. **Test Email/Password Ayarla:**
   - Environment variables'da güncelle

4. **Collection Runner ile Çalıştır:**
   - Postman → Collections → KidStoryBook API
   - **Run** butonuna tıkla
   - Tüm request'leri seç
   - **Run KidStoryBook API** butonuna tıkla

### Manuel Test

1. **Development Server'ı Başlat:**
   ```bash
   npm run dev
   ```

2. **Postman'de Request'leri Tek Tek Çalıştır:**
   - Her request'te test script'leri otomatik çalışır
   - Test sonuçları **Test Results** tab'ında görünür

---

## 📊 Test Coverage

| API Category | Endpoints | Tested | Coverage |
|--------------|-----------|--------|----------|
| Authentication | 1 | ✅ | 100% |
| Characters | 6 | ✅ | 100% |
| Books | 5 | ✅ | 100% |
| AI Generation | 2 | ✅ | 100% |
| TTS | 1 | ⏳ | 0% |
| **TOTAL** | **15** | **14** | **93%** |

---

## ⚠️ Known Issues

- TTS API testleri henüz yapılmadı
- Rate limiting testleri henüz yapılmadı
- Concurrent request testleri henüz yapılmadı

---

## 🔗 İlgili Dokümantasyon

- `docs/api/API_DOCUMENTATION.md` - API dokümantasyonu
- `docs/api/POSTMAN_COLLECTION.md` - Postman collection rehberi
- `postman/KidStoryBook_API.postman_collection.json` - Postman collection

---

**Owner:** @api-manager  
**Related:** `docs/api/API_DOCUMENTATION.md`, `.cursor/rules/api-manager.mdc`

