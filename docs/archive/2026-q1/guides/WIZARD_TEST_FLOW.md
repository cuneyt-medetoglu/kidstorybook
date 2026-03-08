# 🧪 Wizard Test Akışı - Adım Adım Rehber

**Last Updated:** 10 Ocak 2026  
**Test Environment:** http://localhost:3001

---

## 📋 Tam Test Akışı

### Ön Hazırlık

1. **Server'ı Başlat:**
   ```bash
   npm run dev
   ```
   **Beklenen:** `http://localhost:3001` çalışıyor olmalı

2. **Login Ol:**
   - Browser'da `http://localhost:3001` aç
   - Login sayfasına git (`/auth/login`)
   - Supabase'de oluşturduğun test kullanıcısı ile giriş yap

---

## 🎯 Test Senaryosu: Tam Kitap Oluşturma Akışı

### Step 1: Character Information ✅

**URL:** `http://localhost:3001/create/step1`

**Yapılacaklar:**
1. Formu doldur:
   - **Name:** Arya (veya istediğin isim)
   - **Age:** 1 (veya 0-12 arası)
   - **Gender:** Girl (veya Boy)
   - **Hair Color:** Dark Blonde (veya istediğin)
   - **Eye Color:** Hazel (veya istediğin)

2. **"Next" butonuna tıkla**

**Beklenen Sonuç:**
- ✅ Step 2'ye yönlendirilmeli (`/create/step2`)
- ✅ Console'da: `[v0] Step 1 form submitted: {...}`
- ✅ localStorage'da `herokidstory_wizard` kaydedilmeli

**Kontrol:**
```javascript
// Browser Console'da çalıştır:
JSON.parse(localStorage.getItem("herokidstory_wizard"))
// Beklenen: { step1: { name: "Arya", age: 1, ... } }
```

---

### Step 2: Add Characters ✅

**URL:** `http://localhost:3001/create/step2`

**Yapılacaklar:**
1. **Fotoğraf Yükle:**
   - "Choose File" butonuna tıkla
   - Bir çocuk fotoğrafı seç (JPG veya PNG, max 5MB)
   - Fotoğraf yüklendikten sonra preview görünmeli

2. **"Analyze Photo" butonuna tıkla**

**Beklenen Sonuç:**
- ✅ "Analyzing..." durumu gösterilmeli
- ✅ API çağrısı yapılmalı: `POST /api/characters/analyze`
- ✅ Analiz tamamlandıktan sonra sonuçlar gösterilmeli:
  - Hair Length, Hair Style, Hair Texture
  - Face Shape, Eye Shape, Skin Tone
- ✅ Toast bildirimi: "Character Analyzed! Character 'Arya' has been created successfully."
- ✅ localStorage'da `herokidstory_character_id` kaydedilmeli

**Kontrol:**
```javascript
// Browser Console'da çalıştır:
localStorage.getItem("herokidstory_character_id")
// Beklenen: UUID string (örn: "abc123-def456-...")
```

3. **"Next" butonuna tıkla**

**Beklenen Sonuç:**
- ✅ Step 3'e yönlendirilmeli (`/create/step3`)

---

### Step 3: Theme & Age Group

**URL:** `http://localhost:3001/create/step3`

**Yapılacaklar:**
1. Bir tema seç (örn: "Fairy Tale")
2. Bir yaş grubu seç (örn: "6-9 Years")
3. **"Next" butonuna tıkla**

**Beklenen Sonuç:**
- ✅ Step 4'e yönlendirilmeli (`/create/step4`)

---

### Step 4: Illustration Style

**URL:** `http://localhost:3001/create/step4`

**Yapılacaklar:**
1. Bir illüstrasyon stili seç (örn: "Watercolor Dreams")
2. **"Next" butonuna tıkla**

**Beklenen Sonuç:**
- ✅ Step 5'e yönlendirilmeli (`/create/step5`)

---

### Step 5: Custom Requests

**URL:** `http://localhost:3001/create/step5`

**Yapılacaklar:**
1. İsteğe bağlı özel istekler yaz (veya boş bırak)
2. **"Next" butonuna tıkla**

**Beklenen Sonuç:**
- ✅ Step 6'ya yönlendirilmeli (`/create/step6`)

---

### Step 6: Review & Create ✅

**URL:** `http://localhost:3001/create/step6`

**Yapılacaklar:**
1. **Özeti kontrol et:**
   - Character Information (Step 1'den)
   - Character Photos (Step 2'den)
   - Theme & Age Group (Step 3'ten)
   - Illustration Style (Step 4'ten)
   - Custom Requests (Step 5'ten)

2. **"Create Book" butonuna tıkla**

**Beklenen Sonuç:**
- ✅ "Creating Book..." durumu gösterilmeli
- ✅ API çağrısı yapılmalı: `POST /api/books`
- ✅ Request body:
  ```json
  {
    "characterId": "abc123-def456-...",
    "theme": "fairy-tale",
    "illustrationStyle": "watercolor-dreams",
    "customRequests": "...",
    "language": "en"
  }
  ```
- ✅ Toast bildirimi: "Book Created! '...' is being generated. Redirecting to your library..."
- ✅ 2 saniye sonra Dashboard'a yönlendirilmeli (`/dashboard`)
- ✅ localStorage temizlenmeli:
  - `herokidstory_wizard` silinmeli
  - `herokidstory_character_id` silinmeli

**Kontrol:**
```javascript
// Browser Console'da çalıştır:
localStorage.getItem("herokidstory_wizard")
// Beklenen: null

localStorage.getItem("herokidstory_character_id")
// Beklenen: null
```

---

## 🔍 Hata Durumları ve Çözümleri

### Hata 1: "Character Required" (Step 6'da)

**Sebep:** Step 2'de karakter analiz edilmemiş

**Çözüm:**
1. Step 2'ye geri dön (`/create/step2`)
2. Fotoğraf yükle
3. "Analyze Photo" butonuna tıkla
4. Analiz tamamlanana kadar bekle
5. Step 6'ya geri dön ve tekrar dene

---

### Hata 2: "Missing Information" (Step 2'de)

**Sebep:** Step 1 tamamlanmamış

**Çözüm:**
1. Step 1'e geri dön (`/create/step1`)
2. Formu doldur ve "Next"e tıkla
3. Step 2'ye geri dön ve tekrar dene

---

### Hata 3: API Error (Step 2 veya Step 6'da)

**Sebep:** API endpoint'i çalışmıyor veya authentication hatası

**Çözüm:**
1. Browser Console'u aç (F12)
2. Network tab'ını kontrol et
3. Hata mesajını kontrol et:
   - **401 Unauthorized:** Login ol
   - **400 Bad Request:** Request body'yi kontrol et
   - **500 Internal Server Error:** Server log'larını kontrol et

---

## 📊 Test Checklist

### Step 1 ✅
- [ ] Form dolduruldu
- [ ] "Next" butonu çalışıyor
- [ ] Step 2'ye yönlendirildi
- [ ] localStorage'da `herokidstory_wizard` kaydedildi

### Step 2 ✅
- [ ] Fotoğraf yüklendi
- [ ] "Analyze Photo" butonu çalışıyor
- [ ] API çağrısı başarılı (`POST /api/characters/analyze`)
- [ ] Analiz sonuçları gösterildi
- [ ] localStorage'da `herokidstory_character_id` kaydedildi
- [ ] "Next" butonu çalışıyor
- [ ] Step 3'e yönlendirildi

### Step 3-5
- [ ] Her step'te form dolduruldu
- [ ] "Next" butonu çalışıyor
- [ ] Bir sonraki step'e yönlendirildi

### Step 6 ✅
- [ ] Özet doğru gösterildi
- [ ] "Create Book" butonu çalışıyor
- [ ] API çağrısı başarılı (`POST /api/books`)
- [ ] Toast bildirimi gösterildi
- [ ] Dashboard'a yönlendirildi
- [ ] localStorage temizlendi

---

## 🚀 Hızlı Test (Sadece API Testi)

Eğer sadece API'leri test etmek istiyorsan:

### 1. Postman ile Test

**Postman Collection:** `postman/HeroKidStory_API.postman_collection.json`

**Sıra:**
1. **Authentication → Get Auth Token** (Login)
2. **Characters → Analyze Character Photo** (Fotoğraf yükle ve analiz et)
3. **Books → Create Book** (Kitap oluştur)
4. **Books → Get All Books** (Kitapları listele)

**Detaylar:** `docs/guides/API_TESTING_GUIDE.md`

---

## 📝 Notlar

- **localStorage:** Wizard verileri localStorage'da saklanıyor (geçici)
- **Character ID:** Step 2'de oluşturulan karakter ID'si Step 6'da kullanılıyor
- **API Calls:** Step 2 ve Step 6'da API çağrıları yapılıyor
- **Error Handling:** Her adımda hata yönetimi var, toast bildirimleri gösteriliyor

---

**Owner:** @api-manager  
**Related:** `docs/guides/API_TESTING_GUIDE.md`, `docs/api/TESTING_CHECKLIST.md`

