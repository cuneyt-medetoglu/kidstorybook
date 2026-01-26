# Satış ve Sepet Kurgusu - Test Rehberi

**Tarih:** 26 Ocak 2026  
**Durum:** Test Planı  
**İlgili Faz:** Faz 4.4.5 - Satış ve Sepet Kurgusu

---

## 📋 Test Senaryoları

### Phase 1: Ebook Satın Alma Akışı

#### 1.1 Sepet Sistemi Genişletme

**Test 1.1.1: Pricing Sayfasından Ebook Sepete Ekleme**
1. `/pricing` sayfasına git
2. "Buy Ebook" butonuna tıkla
3. **Beklenen:** Toast notification gösterilmeli: "Added to cart"
4. **Beklenen:** Sepet ikonunda item sayısı artmalı
5. `/cart` sayfasına git
6. **Beklenen:** Ebook item görünmeli
7. **Beklenen:** Plan tipi gösterilmeli (10 pages)

**Test 1.1.2: Sepet Sayfasında Ebook Gösterimi**
1. Sepette ebook item olmalı
2. **Beklenen:** Ebook item'ı için farklı görünüm (Download icon)
3. **Beklenen:** Plan tipi gösterilmeli
4. **Beklenen:** Fiyat gösterilmeli
5. **Beklenen:** "Proceed to Checkout" butonu çalışmalı

**Test 1.1.3: CartItem Type Genişletme**
1. Browser console'u aç
2. `localStorage.getItem('kidstorybook_cart')` çalıştır
3. **Beklenen:** Cart item'da `type: "ebook_plan"` olmalı
4. **Beklenen:** `planType: "10"` olmalı
5. **Beklenen:** `bookId` ve `coverImage` opsiyonel olmalı (yoksa undefined)

#### 1.2 Checkout Sayfası

**Test 1.2.1: Checkout Sayfası Erişimi**
1. Sepete ebook ekle
2. `/checkout` sayfasına git
3. **Beklenen:** Checkout sayfası açılmalı
4. **Beklenen:** Sol tarafta sepet özeti, sağ tarafta form olmalı
5. Sepeti boşalt
6. `/checkout` sayfasına git
7. **Beklenen:** Otomatik olarak `/cart` sayfasına yönlendirilmeli

**Test 1.2.2: Checkout Form Validasyonu (Ebook)**
1. Sepete ebook ekle
2. `/checkout` sayfasına git
3. Form'u boş bırak, "Complete Purchase" butonuna tıkla
4. **Beklenen:** Email alanı için hata mesajı gösterilmeli
5. Geçersiz email gir (örn: "test")
6. **Beklenen:** "Please enter a valid email address" hatası
7. Geçerli email gir (örn: "test@example.com")
8. **Beklenen:** Hata kaybolmalı
9. **Beklenen:** Adres alanları görünmemeli (ebook için gerekli değil)

**Test 1.2.3: Checkout Form Validasyonu (Hardcopy)**
1. Sepete hardcopy ekle
2. `/checkout` sayfasına git
3. **Beklenen:** Adres alanları görünmeli (required)
4. Form'u boş bırak, "Complete Purchase" butonuna tıkla
5. **Beklenen:** Tüm required alanlar için hata mesajları
6. Tüm alanları doldur
7. **Beklenen:** Form submit edilebilmeli

**Test 1.2.4: Checkout Form Submit (Mock Payment)**
1. Sepete ebook ekle
2. `/checkout` sayfasına git
3. Form'u doldur ve submit et
4. **Beklenen:** Console'da form data log'lanmalı
5. **Beklenen:** Sepet temizlenmeli
6. **Beklenen:** `/checkout/success?orderId=xxx` sayfasına yönlendirilmeli

**Test 1.2.5: CartSummary Component**
1. Sepete birden fazla item ekle (ebook + hardcopy)
2. `/checkout` sayfasına git
3. **Beklenen:** Tüm item'lar listelenmeli
4. **Beklenen:** Subtotal doğru hesaplanmalı
5. **Beklenen:** Shipping gösterilmeli (hardcopy için "Free", ebook için "N/A")
6. **Beklenen:** Total doğru hesaplanmalı

#### 1.3 Success Sayfası ve Email

**Test 1.3.1: Success Sayfası**
1. Checkout'tan başarılı ödeme simüle et
2. `/checkout/success?orderId=test123` sayfasına git
3. **Beklenen:** "Order Confirmed!" mesajı gösterilmeli
4. **Beklenen:** Order ID gösterilmeli
5. **Beklenen:** "View in My Library" butonu çalışmalı
6. **Beklenen:** Email gönderildi bilgisi gösterilmeli

**Test 1.3.2: Email API (Mock)**
1. Success sayfasında email API çağrısı yapılmalı
2. Browser console'u aç
3. **Beklenen:** Console'da email mock log'u görünmeli
4. **Beklenen:** API response: `{ success: true, message: "Email sent successfully (mock)" }`

---

### Phase 3: Draft Kapak'tan Satın Alma

#### 3.1 Draft Kapak Saklama Sistemi

**Test 3.1.1: Draft Storage Helper (LocalStorage)**
1. Browser console'u aç
2. `localStorage.getItem('kidstorybook_drafts')` çalıştır
3. **Beklenen:** Draft'lar JSON formatında saklanmalı
4. Draft oluştur (free cover veya normal)
5. **Beklenen:** Yeni draft localStorage'a eklenmeli
6. `getAllDraftsFromLocalStorage()` fonksiyonunu test et
7. **Beklenen:** Tüm draft'lar dönmeli

**Test 3.1.2: Draft API Endpoints**
1. Authenticated user olarak login yap
2. `GET /api/drafts` endpoint'ini çağır
3. **Beklenen:** Kullanıcının draft'ları listelenmeli
4. Draft oluştur
5. `POST /api/drafts` endpoint'ini çağır
6. **Beklenen:** Draft database'e kaydedilmeli
7. `GET /api/drafts/[draftId]` endpoint'ini çağır
8. **Beklenen:** Draft detayı dönmeli

**Test 3.1.3: Draft Expiration**
1. Eski bir draft oluştur (expiresAt geçmiş tarih)
2. `getAllDraftsFromLocalStorage()` çağır
3. **Beklenen:** Eski draft'lar filtrelenmeli
4. **Beklenen:** localStorage'dan eski draft'lar temizlenmeli

#### 3.2 Draft Preview ve Erişim

**Test 3.2.1: Draft Preview Sayfası**
1. Draft oluştur (free cover veya normal)
2. `/draft-preview?draftId=xxx` sayfasına git
3. **Beklenen:** Kapak görseli gösterilmeli
4. **Beklenen:** Karakter bilgileri gösterilmeli
5. **Beklenen:** "Buy Full Book" butonu çalışmalı
6. **Beklenen:** "Login to Save" butonu görünmeli (unauthenticated ise)

**Test 3.2.2: Draft Preview - Buy Full Book**
1. Draft preview sayfasında "Buy Full Book" butonuna tıkla
2. **Beklenen:** Plan seçimi modal açılmalı
3. Plan seç (10, 15, 20 sayfa)
4. "Add to Cart" butonuna tıkla
5. **Beklenen:** Ebook plan sepete eklenmeli
6. **Beklenen:** `draftId` cart item'da olmalı
7. **Beklenen:** `characterData` cart item'da olmalı

**Test 3.2.3: My Library Drafts Sekmesi**
1. Authenticated user olarak login yap
2. `/dashboard` sayfasına git
3. "Drafts" sekmesine tıkla
4. **Beklenen:** Database'den draft'lar listelenmeli
5. **Beklenen:** Her draft için "View" ve "Buy Full Book" butonları olmalı
6. "View" butonuna tıkla
7. **Beklenen:** Draft preview sayfasına yönlendirilmeli

**Test 3.2.4: Draft Transfer (LocalStorage → Database)**
1. Unauthenticated user olarak draft oluştur
2. Login yap
3. Dashboard'a git
4. **Beklenen:** LocalStorage'daki draft'lar database'e transfer edilmeli
5. **Beklenen:** LocalStorage'dan draft'lar temizlenmeli
6. **Beklenen:** Draft'lar "Drafts" sekmesinde görünmeli

**Test 3.2.5: Email Link Paylaşımı**
1. Draft preview sayfasında "Share via Email" butonuna tıkla
2. **Beklenen:** Email input modal açılmalı (şu an mock)
3. Email gir ve gönder
4. **Beklenen:** Console'da email mock log'u görünmeli
5. **Beklenen:** Draft preview linki email'de gönderilmeli (mock)

#### 3.3 Wizard State Restore

**Test 3.3.1: Wizard State Restore (Step 1)**
1. Draft oluştur
2. `/create/step1?draftId=xxx` sayfasına git
3. **Beklenen:** Form karakter bilgileri ile dolu olmalı
4. **Beklenen:** Name, age, gender, hairColor, eyeColor restore edilmeli
5. Next'e tıkla
6. **Beklenen:** `/create/step2?draftId=xxx` sayfasına gitmeli

**Test 3.3.2: Wizard State Restore (Step 3)**
1. Draft'tan wizard'a devam et
2. `/create/step3?draftId=xxx` sayfasına git
3. **Beklenen:** Theme, ageGroup, language seçili olmalı
4. Next'e tıkla
5. **Beklenen:** `/create/step4?draftId=xxx` sayfasına gitmeli

**Test 3.3.3: Wizard State Restore (Step 4)**
1. Draft'tan wizard'a devam et
2. `/create/step4?draftId=xxx` sayfasına git
3. **Beklenen:** Illustration style seçili olmalı
4. Next'e tıkla
5. **Beklenen:** `/create/step5?draftId=xxx` sayfasına gitmeli

**Test 3.3.4: Wizard State Restore (Step 2)**
1. Draft'tan wizard'a devam et
2. `/create/step2?draftId=xxx` sayfasına git
3. **Beklenen:** Step 1 data restore edilmeli
4. **Beklenen:** Character photo yüklenmiş olabilir (eğer varsa)

**Test 3.3.5: Wizard State Restore (Step 6)**
1. Draft'tan wizard'a devam et
2. `/create/step6?draftId=xxx` sayfasına git
3. **Beklenen:** Tüm wizard data restore edilmeli
4. **Beklenen:** Character, theme, style bilgileri gösterilmeli

**Test 3.3.6: Draft'tan Checkout Akışı**
1. Draft preview sayfasında "Buy Full Book" → Plan seç → Sepete ekle
2. `/checkout` sayfasına git
3. Form'u doldur ve submit et
4. **Beklenen:** `draftId` query param ile wizard'a yönlendirilmeli
5. **Beklenen:** `/create/step1?draftId=xxx` sayfasına gitmeli
6. **Beklenen:** Wizard state restore edilmeli

---

### Phase 2: Ücretsiz Kapak Sistemi

#### 2.1 Database Schema

**Test 2.1.1: Free Cover Migration**
1. Supabase dashboard'a git
2. `users` table'ı kontrol et
3. **Beklenen:** `free_cover_used` kolonu olmalı (BOOLEAN, DEFAULT FALSE)
4. Yeni user oluştur
5. **Beklenen:** `free_cover_used` = FALSE olmalı

#### 2.2 Free Cover API

**Test 2.2.1: Free Cover Status API**
1. Authenticated user olarak login yap
2. `GET /api/users/free-cover-status` endpoint'ini çağır
3. **Beklenen:** `{ hasFreeCover: true, used: false }` dönmeli (yeni user için)
4. Free cover kullan
5. Tekrar status API'yi çağır
6. **Beklenen:** `{ hasFreeCover: false, used: true }` dönmeli

**Test 2.2.2: Create Free Cover API**
1. Authenticated user olarak login yap
2. Free cover status kontrolü yap (kullanılmamış olmalı)
3. `POST /api/books/create-free-cover` endpoint'ini çağır
4. **Beklenen:** Free cover oluşturulmalı
5. **Beklenen:** Book `draft` status ile kaydedilmeli
6. **Beklenen:** `free_cover_used` = TRUE olmalı
7. **Beklenen:** Response: `{ bookId, draftId, coverImage }`
8. Tekrar free cover oluşturmayı dene
9. **Beklenen:** Hata: "Free cover credit already used"

**Test 2.2.3: Purchase From Draft API**
1. Draft oluştur
2. `POST /api/books/purchase-from-draft` endpoint'ini çağır
3. **Beklenen:** Mock payment başarılı olmalı
4. **Beklenen:** Response: `{ success: true, orderId, draftId, planType, pageCount }`
5. **Not:** Kalan sayfaları generate etme henüz implement edilmedi (TODO)

#### 2.3 UI/UX

**Test 2.3.1: Dashboard Free Cover Badge**
1. Authenticated user olarak login yap (free cover kullanılmamış)
2. `/dashboard` sayfasına git
3. **Beklenen:** "1 Free Cover Available" badge görünmeli
4. Badge'e tıkla
5. **Beklenen:** `/create/step1` sayfasına yönlendirilmeli
6. Free cover kullan
7. Dashboard'a geri dön
8. **Beklenen:** "Free Cover Used" badge görünmeli

**Test 2.3.2: Wizard Free Cover Butonu**
1. Authenticated user olarak login yap (free cover kullanılmamış)
2. `/create/step1` sayfasına git
3. **Beklenen:** "Create Free Cover (Preview Only)" butonu görünmeli
4. Form'u doldur (name, age, gender, hairColor, eyeColor)
5. "Create Free Cover" butonuna tıkla
6. **Beklenen:** Free cover API çağrılmalı
7. **Beklenen:** Kapak oluşturulmalı
8. **Beklenen:** `/draft-preview?draftId=xxx` sayfasına yönlendirilmeli
9. **Beklenen:** Toast: "Free cover created!"

**Test 2.3.3: Wizard Free Cover Butonu (Kullanılmış)**
1. Authenticated user olarak login yap (free cover kullanılmış)
2. `/create/step1` sayfasına git
3. **Beklenen:** "Create Free Cover" butonu görünmemeli

---

## 🔧 Test Araçları

### Browser DevTools
- **Console:** API çağrılarını ve log'ları görmek için
- **Network Tab:** API request/response'ları görmek için
- **Application Tab:** localStorage ve sessionStorage'ı görmek için

### Postman / API Testing
- Tüm API endpoint'leri test edilebilir
- Authentication token ile test edilebilir
- Mock payment test edilebilir

### Manual Testing Checklist
- [ ] Pricing sayfasından ebook sepete ekleme
- [ ] Sepet sayfasında ebook gösterimi
- [ ] Checkout sayfası form validasyonu
- [ ] Checkout form submit (mock payment)
- [ ] Success sayfası
- [ ] Draft oluşturma (free cover)
- [ ] Draft preview sayfası
- [ ] Draft'tan sepete ekleme
- [ ] Draft'tan checkout akışı
- [ ] Wizard state restore (tüm step'ler)
- [ ] My Library Drafts sekmesi
- [ ] Free cover badge ve butonu

---

## 🐛 Bilinen Sorunlar

### Mock Payment
- Şu an tüm ödeme işlemleri mock olarak çalışıyor
- Gerçek ödeme entegrasyonu Faz 4.1 ve 4.2'de yapılacak

### Email Servisi
- Email gönderimi console.log ile mock
- Gerçek email servisi entegrasyonu yapılacak

### Purchase From Draft
- Draft'tan satın alma sonrası kalan sayfaları generate etme henüz implement edilmedi
- Bu özellik daha sonra eklenecek

---

## ✅ Test Sonuçları

Test sonuçlarını buraya ekleyin:

**Test Tarihi:** [Tarih]  
**Test Eden:** [İsim]  
**Sonuç:** [Başarılı/Başarısız]  
**Notlar:** [Varsa notlar]

---

**Son Güncelleme:** 26 Ocak 2026
