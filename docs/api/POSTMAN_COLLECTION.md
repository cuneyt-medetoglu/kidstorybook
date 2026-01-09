# 📮 Postman Collection Rehberi

**Last Updated:** 10 Ocak 2026  
**Collection Version:** 1.0.0

---

## 📥 Collection'ı İçe Aktarma

### Adım 1: Postman'i Aç
1. Postman Desktop App veya Web'i aç
2. **Import** butonuna tıkla (sol üst köşe)

### Adım 2: Collection Dosyasını Seç
1. **File** sekmesini seç
2. `postman/KidStoryBook_API.postman_collection.json` dosyasını seç
3. **Import** butonuna tıkla

### Adım 3: Environment Dosyasını İçe Aktar
1. Tekrar **Import** butonuna tıkla
2. `postman/KidStoryBook_Environment.postman_environment.json` dosyasını seç
3. **Import** butonuna tıkla

### Adım 4: Environment'ı Aktif Et
1. Sağ üst köşede **Environments** dropdown'ını aç
2. **KidStoryBook - Local Development** seçeneğini seç

---

## 🔧 Environment Variables

### Gerekli Değişkenler

| Variable | Açıklama | Örnek Değer |
|----------|----------|-------------|
| `base_url` | API base URL | `http://localhost:3001/api` |
| `auth_token` | Authentication token | (Otomatik doldurulur) |
| `character_id` | Test için character ID | (Otomatik doldurulur) |
| `book_id` | Test için book ID | (Otomatik doldurulur) |
| `user_id` | Test için user ID | (Otomatik doldurulur) |
| `test_email` | Test kullanıcı email | `test@example.com` |
| `test_password` | Test kullanıcı şifresi | `testpassword123` |

### Otomatik Doldurma

Collection'daki test script'leri otomatik olarak şu değişkenleri doldurur:
- `auth_token` - Login sonrası
- `character_id` - Character oluşturma sonrası
- `book_id` - Book oluşturma sonrası
- `user_id` - Login sonrası

---

## 🧪 Test Senaryoları

### 1. Full Book Creation Flow

**Sıralama:**
1. **Authentication → Get Auth Token** (Login)
2. **Characters → Analyze Character Photo** (Character oluştur)
3. **Books → Create Book (Generate Story)** (Story oluştur)
4. **AI Generation → Generate Images** (Görseller oluştur)
5. **Books → Get Book by ID** (Sonucu kontrol et)

**Beklenen Sonuç:**
- Character oluşturuldu
- Story generate edildi
- Images generate edildi
- Book tamamlandı

### 2. Character Reuse Flow

**Sıralama:**
1. **Authentication → Get Auth Token**
2. **Characters → Get All Characters** (Mevcut karakterleri listele)
3. **Characters → Get Character by ID** (Bir karakteri seç)
4. **Books → Create Book (Generate Story)** (Yeni kitap oluştur)
5. **Books → Get All Books** (Kitapları listele)

**Beklenen Sonuç:**
- Mevcut karakter kullanıldı
- Yeni kitap oluşturuldu
- Character'ın `total_books` sayısı arttı

### 3. Error Handling Tests

**Test Senaryoları:**
1. **Unauthorized Test:**
   - `auth_token` değişkenini boşalt
   - Herhangi bir endpoint'e istek at
   - Beklenen: `401 Unauthorized`

2. **Not Found Test:**
   - Geçersiz bir `character_id` veya `book_id` kullan
   - Beklenen: `404 Not Found`

3. **Validation Error Test:**
   - Eksik veya geçersiz request body gönder
   - Beklenen: `400 Bad Request` veya `422 Validation Error`

4. **Forbidden Test:**
   - Başka bir kullanıcının character/book ID'sini kullan
   - Beklenen: `403 Forbidden`

---

## 📊 Collection Yapısı

```
KidStoryBook API
├── Authentication
│   └── Get Auth Token (Login)
├── Characters
│   ├── Analyze Character Photo
│   ├── Get All Characters
│   ├── Get Character by ID
│   ├── Update Character
│   ├── Delete Character
│   └── Set Default Character
├── Books
│   ├── Create Book (Generate Story)
│   ├── Get All Books
│   ├── Get Book by ID
│   ├── Update Book
│   └── Delete Book
├── AI Generation
│   ├── Generate Story
│   └── Generate Images
└── TTS
    └── Generate Speech
```

---

## 🔄 Collection'ı Güncelleme

### Yeni Endpoint Eklendiğinde

1. Postman'de collection'ı aç
2. İlgili folder'a yeni request ekle
3. Request detaylarını doldur:
   - Method (GET, POST, PATCH, DELETE)
   - URL ({{base_url}}/path kullan)
   - Headers (Authorization header ekle)
   - Body (varsa)
   - Tests (success/error testleri ekle)
4. Collection'ı export et
5. `postman/KidStoryBook_API.postman_collection.json` dosyasını güncelle

### Otomatik Test Script'leri

Her endpoint için şu test script'lerini ekle:

```javascript
// Success test
pm.test('Status code is 200', function () {
    pm.response.to.have.status(200);
});

pm.test('Response has success property', function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success', true);
});

// Auto-save IDs (if applicable)
if (jsonData.data?.id) {
    pm.environment.set('resource_id', jsonData.data.id);
}
```

---

## 🚀 Hızlı Başlangıç

### 1. Collection'ı İçe Aktar
- `postman/KidStoryBook_API.postman_collection.json`
- `postman/KidStoryBook_Environment.postman_environment.json`

### 2. Environment'ı Aktif Et
- **KidStoryBook - Local Development**

### 3. Test Email/Password Ayarla
- Environment variables'da `test_email` ve `test_password` güncelle

### 4. İlk Request'i Çalıştır
- **Authentication → Get Auth Token**
- Token otomatik olarak `auth_token` değişkenine kaydedilecek

### 5. Diğer Request'leri Test Et
- Artık tüm endpoint'ler çalışır durumda!

---

## 📝 Notlar

- **Development:** `base_url` = `http://localhost:3001/api`
- **Production:** `base_url` = `https://yourdomain.com/api` (gelecekte)
- **Authentication:** Token otomatik olarak header'a eklenir
- **Test Scripts:** Her request'te otomatik testler çalışır
- **Environment Variables:** Otomatik olarak doldurulur (ID'ler, token, vb.)

---

## 🔗 İlgili Dokümantasyon

- `docs/api/API_DOCUMENTATION.md` - Detaylı API dokümantasyonu
- `docs/database/SCHEMA.md` - Database schema
- `docs/strategies/CHARACTER_CONSISTENCY_STRATEGY.md` - Character consistency

---

**Owner:** @api-manager  
**Related:** `docs/api/API_DOCUMENTATION.md`, `.cursor/rules/api-manager.mdc`

