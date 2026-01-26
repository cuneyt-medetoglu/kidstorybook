# 📊 Satış ve Sepet Kurgusu - Strateji Analizi

**Doküman Versiyonu:** 1.0  
**Tarih:** 26 Ocak 2026  
**Durum:** Analiz - Karar Bekliyor  
**İlgili Faz:** Faz 4.4.5 - Satış ve Sepet Kurgusu

---

## 📋 Özet

Bu doküman, **4.4.5 Satış ve Sepet Kurgusu** işinin detaylı analizini ve çözüm önerilerini içermektedir. Mevcut durumda hardcopy satın alma akışı kısmen tamamlanmış, ancak **ebook satın alma akışı** ve **ücretsiz kapak (draft) sistemi** henüz implement edilmemiştir.

### Ana Sorunlar

1. **Üye Olmadan Draft Kapak Yapma Sorunu:** Kullanıcı üye olmadan ücretsiz kapak oluşturabilmeli, ancak bu kapakları nerede göreceği belirsiz (My Library'ye erişim için login gerekli).

2. **Ebook Satın Alma Akışı Eksik:** Hardcopy satın alma akışı mevcut, ancak ebook satın alma akışı (pricing sayfasından sepete ekleme, checkout, ödeme) henüz yok.

3. **Ücretsiz Kapak (Free Cover) Sistemi Yok:** Draft status ile sadece kapak oluşturma ve satın alma sonrası kalan sayfaları generate etme sistemi henüz implement edilmemiş.

### Çözüm Önerileri

1. **Draft Kapak için Geçici Session/LocalStorage Sistemi:** Üye olmayan kullanıcılar için localStorage veya session-based draft kapak görüntüleme sistemi.

2. **Ebook Satın Alma Akışı:** Pricing sayfasından sepete ekleme, checkout sayfası, ödeme entegrasyonu (Stripe/İyzico).

3. **Free Cover Workflow:** Ücretsiz kapak oluşturma → Draft status → Satın alma → Kalan sayfalar generate.

---

## 1. Mevcut Durum Analizi

### 1.1 Tamamlanan Özellikler ✅

#### Hardcopy Satın Alma Akışı (Kısmen Tamamlandı)
- ✅ My Library'de hardcopy butonu (sadece completed ebook'lar için)
- ✅ Toplu seçim ve sepete ekleme (checkbox'lar, bulk actions bar)
- ✅ Sepet sistemi (CartContext, localStorage)
- ✅ Sepet sayfası (`/cart`)
- ✅ `POST /api/cart` - Sepete ürün ekleme (hardcopy)
- ✅ Backend kontrolü: API'de hardcopy eklenirken ebook kontrolü
- ✅ UI/UX: Dashboard'da kitap kartında "Add to Cart (Hardcopy)" butonu

#### Sepet Sistemi Altyapısı
- ✅ CartContext (React Context API)
- ✅ localStorage ile sepet verisi saklama
- ✅ Cart API endpoints (GET, POST, DELETE)
- ✅ Sepet sayfası UI (`/cart`)

### 1.2 Eksik Özellikler ❌

#### Ebook Satın Alma Akışı
- ❌ Pricing sayfasından sepete ebook ekleme
- ❌ Checkout sayfası (`/checkout`)
- ❌ Ödeme entegrasyonu (Stripe/İyzico)
- ❌ Ebook satın alma sonrası email gönderimi
- ❌ Ebook indirme linki oluşturma

#### Ücretsiz Kapak (Free Cover) Sistemi
- ❌ Ücretsiz kapak oluşturma akışı
- ❌ Draft status yönetimi (sadece kapak için)
- ❌ Satın alma sonrası kalan sayfalar generate etme
- ❌ Üye olmayan kullanıcılar için draft kapak görüntüleme

#### Checkout ve Ödeme
- ❌ Checkout sayfası (`/checkout`)
- ❌ Adres bilgileri formu
- ❌ Ödeme yöntemi seçimi
- ❌ Stripe/İyzico entegrasyonu
- ❌ Sipariş onayı ve email gönderimi

---

## 2. Problem Analizi ve Çözüm Önerileri

### 2.1 Problem 1: Üye Olmadan Draft Kapak Yapma ve Görüntüleme

#### Problem Tanımı
Kullanıcı üye olmadan ücretsiz kapak oluşturabilmeli, ancak:
- My Library'ye erişim için login gerekli
- Üye olmayan kullanıcı oluşturduğu draft kapağı nerede görecek?
- Draft kapak nasıl saklanacak? (Database'de user_id yok)

#### Çözüm Önerileri

##### Çözüm 1: LocalStorage + Session-Based Draft System (Önerilen) ⭐

**Yaklaşım:**
- Üye olmayan kullanıcılar için localStorage'da draft kapak bilgileri saklanır
- Draft kapak oluşturulduğunda geçici bir "Draft Preview" sayfası gösterilir
- Kullanıcıya "Login to Save" veya "Continue as Guest" seçenekleri sunulur

**Akış:**
1. Kullanıcı üye olmadan wizard'ı tamamlar (sadece kapak için)
2. Kapak oluşturulur ve localStorage'a kaydedilir
3. Draft preview sayfası gösterilir (`/draft-preview?draftId=xxx`)
4. Kullanıcıya iki seçenek sunulur:
   - **"Login to Save"** → Login/Register → Draft kapak My Library'ye taşınır
   - **"Continue as Guest"** → Draft kapak localStorage'da kalır, email ile link gönderilir

**Avantajlar:**
- ✅ Kullanıcı üye olmadan deneyim yaşayabilir
- ✅ Conversion rate artar (ücretsiz deneme)
- ✅ Email ile draft link paylaşımı mümkün
- ✅ Login sonrası draft'ı My Library'ye taşıma kolay

**Dezavantajlar:**
- ⚠️ localStorage sınırlı (5-10MB)
- ⚠️ Farklı cihazlarda erişim sorunu
- ⚠️ Browser temizlenirse draft kaybolur

**Teknik Detaylar:**
```typescript
// localStorage structure
{
  "draft_covers": [
    {
      "draftId": "draft_1234567890",
      "coverImage": "https://...",
      "characterData": {...},
      "createdAt": "2026-01-26T10:00:00Z",
      "expiresAt": "2026-02-26T10:00:00Z" // 30 gün
    }
  ]
}

// Draft Preview Page
/draft-preview?draftId=draft_1234567890
```

##### Çözüm 2: Email-Based Draft System

**Yaklaşım:**
- Kullanıcıdan email istenir (üye olmadan)
- Draft kapak email ile gönderilir
- Email'deki link ile draft'a erişim sağlanır

**Akış:**
1. Kullanıcı wizard'ı tamamlar (sadece kapak için)
2. Email input ekranı gösterilir
3. Email'e draft link gönderilir
4. Link ile draft preview sayfasına erişilir

**Avantajlar:**
- ✅ Cross-device erişim
- ✅ Email marketing fırsatı
- ✅ Draft kaybolmaz

**Dezavantajlar:**
- ⚠️ Email doğrulama gerekli
- ⚠️ Spam riski
- ⚠️ Email girişi conversion'ı düşürebilir

##### Çözüm 3: Anonymous User System

**Yaklaşım:**
- Geçici anonymous user oluşturulur (session-based)
- Draft kapak database'de anonymous user'a kaydedilir
- Login sonrası anonymous user'ın draft'ları gerçek user'a transfer edilir

**Avantajlar:**
- ✅ Database'de saklama (güvenli)
- ✅ Cross-device erişim (session token ile)
- ✅ Login sonrası otomatik transfer

**Dezavantajlar:**
- ⚠️ Database'de anonymous user'lar birikir
- ⚠️ Cleanup mekanizması gerekli
- ⚠️ Daha karmaşık implementasyon

#### Önerilen Çözüm: Hybrid Approach (Çözüm 1 + Çözüm 2)

**Kombine Yaklaşım:**
1. **İlk Adım:** LocalStorage + Draft Preview sayfası (hızlı, conversion odaklı)
2. **İkinci Adım:** Email ile draft link paylaşımı (opsiyonel, cross-device erişim)
3. **Üçüncü Adım:** Login sonrası draft'ı My Library'ye taşıma

**Akış:**
```
Wizard (Kapak) → Draft Preview → [LocalStorage] → [Email Link (Opsiyonel)] → Login → My Library
```

---

### 2.2 Problem 2: Ebook Satın Alma Akışı

#### Problem Tanımı
Hardcopy satın alma akışı mevcut, ancak ebook satın alma akışı eksik:
- Pricing sayfasından sepete ebook ekleme yok
- Checkout sayfası yok
- Ödeme entegrasyonu yok
- Ebook satın alma sonrası email gönderimi yok

#### Çözüm Önerileri

##### Ebook Satın Alma Akışı Tasarımı

**Akış 1: Pricing Sayfasından Direkt Satın Alma (Önerilen) ⭐**

```
Pricing Page → [Select Plan] → Checkout → Payment → Success → Email + My Library
```

**Adımlar:**
1. **Pricing Sayfası (`/pricing`):**
   - Kullanıcı plan seçer (10, 15, 20 sayfa)
   - "Buy Ebook" butonuna tıklar
   - Sepete eklenir veya direkt checkout'a yönlendirilir

2. **Checkout Sayfası (`/checkout`):**
   - Sepet özeti (ebook plan, fiyat)
   - Kullanıcı bilgileri (email, isim - login değilse)
   - Ödeme yöntemi seçimi
   - "Complete Purchase" butonu

3. **Ödeme İşlemi:**
   - Stripe/İyzico entegrasyonu
   - Payment intent oluşturma
   - 3D Secure doğrulama
   - Ödeme onayı

4. **Success Sayfası (`/checkout/success`):**
   - Sipariş onayı
   - Email gönderimi (ebook download link)
   - My Library'ye yönlendirme

**Akış 2: Draft Kapak'tan Satın Alma**

```
Draft Preview → [Buy Full Book] → Checkout → Payment → Generate Remaining Pages → Success
```

**Adımlar:**
1. Kullanıcı draft kapağı görüntüler
2. "Buy Full Book" butonuna tıklar
3. Plan seçimi (10, 15, 20 sayfa)
4. Checkout → Payment
5. Ödeme sonrası kalan sayfalar generate edilir
6. Kitap tamamlanır, My Library'ye eklenir

##### Sepet Sistemi Genişletme

**Mevcut Sepet Sistemi:**
- Sadece hardcopy item'ları destekliyor
- `type: "hardcopy"` sabit

**Genişletilmiş Sepet Sistemi:**
```typescript
interface CartItem {
  id: string
  type: "hardcopy" | "ebook" | "ebook_plan" // Yeni: ebook ve plan desteği
  bookId?: string // Hardcopy için mevcut kitap ID
  planType?: "10" | "15" | "20" | "custom" // Ebook plan tipi
  bookTitle: string
  coverImage?: string
  price: number
  quantity: number
  // Ebook için ek alanlar
  draftId?: string // Draft kapak'tan satın alma için
  characterData?: CharacterData // Draft'tan karakter bilgileri
}
```

##### Checkout Sayfası Tasarımı

**Sayfa Yapısı:**
```
/checkout
├── Cart Summary (Left Side)
│   ├── Items list
│   ├── Subtotal
│   ├── Shipping (hardcopy için)
│   └── Total
├── Checkout Form (Right Side)
│   ├── Customer Info (email, name)
│   ├── Shipping Address (hardcopy için)
│   ├── Payment Method
│   └── Complete Purchase Button
└── Success Redirect
    └── /checkout/success?orderId=xxx
```

**Form Alanları:**
- **Ebook için:**
  - Email (login değilse)
  - İsim (opsiyonel)
  - Ödeme yöntemi

- **Hardcopy için:**
  - Email
  - İsim
  - Adres (şehir, ilçe, sokak, posta kodu)
  - Telefon
  - Ödeme yöntemi

##### Ödeme Entegrasyonu

**Stripe (Uluslararası):**
- Stripe Checkout Session
- Payment Intent API
- 3D Secure desteği
- Webhook ile sipariş onayı

**İyzico (Türkiye):**
- İyzico Payment API
- 3D Secure desteği
- Callback ile sipariş onayı

**Currency Detection:**
- Mevcut currency detection sistemi kullanılır
- TR → İyzico, Diğer → Stripe

---

### 2.3 Problem 3: Ücretsiz Kapak (Free Cover) Sistemi

#### Problem Tanımı
PRD'de belirtilen "ücretsiz kapak hakkı" sistemi henüz implement edilmemiş:
- Her yeni üyeye 1 adet ücretsiz kapak hakkı
- Sadece kapak (sayfa 1) - tam kitap değil
- Draft status ile saklama
- Satın alma sonrası kalan sayfalar generate

#### Kritik Özellik: Aynı Yerden Devam Edebilme ⭐
**Problem:** Kullanıcı draft kapak oluşturduktan sonra, daha sonra geri döndüğünde aynı draft kapağı bulabilmeli ve o draft'tan satın alma yapabilmeli.

**Çözüm:** Draft kapak saklama ve erişim sistemi:
- Draft kapak localStorage'da veya database'de saklanır
- Draft preview sayfası (`/draft-preview?draftId=xxx`)
- Draft kapak listesi (üye olmayan kullanıcılar için localStorage, üye olanlar için My Library'de "Drafts" sekmesi)
- Wizard state restore (draft'tan satın alma yapılırken wizard'ın aynı yerinden devam)

#### Çözüm Önerileri

##### Free Cover Workflow

**Akış:**
```
New User → [1 Free Cover Credit] → Wizard (Kapak Only) → Draft Status → Preview → [Buy Full Book] → Generate Remaining Pages
```

**Database Schema:**
```sql
-- users table'a eklenmeli
ALTER TABLE users ADD COLUMN free_cover_used BOOLEAN DEFAULT FALSE;

-- books table'da draft status zaten var
-- status: 'draft' (sadece kapak), 'generating', 'completed'
```

**API Endpoints:**
```typescript
// Free cover hakkı kontrolü
GET /api/users/free-cover-status
Response: { hasFreeCover: boolean, used: boolean }

// Free cover oluşturma
POST /api/books/create-free-cover
Body: { characterData, theme, style, ... }
Response: { bookId, draftId, coverImage }

// Draft'tan full book satın alma
POST /api/books/purchase-from-draft
Body: { draftId, planType: "10" | "15" | "20" }
Response: { orderId, bookId }
```

**UI/UX:**
1. **Dashboard'da Free Cover Badge:**
   - "1 Free Cover Available" badge gösterilir
   - Kullanıldıktan sonra "Free Cover Used" gösterilir

2. **Wizard'da Free Cover Seçeneği:**
   - Step 1'de "Create Free Cover" butonu
   - Sadece kapak oluşturulur (tam kitap değil)
   - Draft status ile kaydedilir

3. **Draft Preview Sayfası:**
   - Kapak önizlemesi
   - "Buy Full Book" butonu
   - Plan seçimi (10, 15, 20 sayfa)
   - Checkout'a yönlendirme

---

## 3. Teknik Implementasyon Planı

### 3.1 Phase 1: Ebook Satın Alma Akışı (Öncelik: Yüksek) 🔴

#### 3.1.1 Sepet Sistemi Genişletme
- [ ] CartItem type'ına `ebook` ve `ebook_plan` ekleme
- [ ] CartContext'e ebook ekleme fonksiyonu
- [ ] Pricing sayfasından sepete ebook ekleme
- [ ] Sepet sayfasında ebook item'ları gösterimi

**Dosyalar:**
- `contexts/CartContext.tsx` - Type genişletme
- `app/pricing/page.tsx` - Ebook sepete ekleme
- `app/cart/page.tsx` - Ebook item gösterimi

#### 3.1.2 Checkout Sayfası
- [ ] Checkout sayfası oluşturma (`/checkout`)
- [ ] Form alanları (email, name, address)
- [ ] Sepet özeti gösterimi
- [ ] Payment method seçimi
- [ ] Form validasyonu

**Dosyalar:**
- `app/checkout/page.tsx` - Checkout sayfası
- `components/checkout/CheckoutForm.tsx` - Form component
- `components/checkout/CartSummary.tsx` - Sepet özeti

#### 3.1.3 Ödeme Entegrasyonu (Sonraki Faz)
**Not:** Stripe ve İyzico entegrasyonu roadmap'te mevcut (Faz 4.1 ve 4.2). Şu an için analiz seviyesinde kalınacak, implementasyon daha sonra yapılacak.

- [ ] Stripe entegrasyonu (uluslararası) - Faz 4.1
- [ ] İyzico entegrasyonu (Türkiye) - Faz 4.2
- [ ] Currency detection ile otomatik seçim
- [ ] Payment intent oluşturma
- [ ] Webhook/callback işleme

**İlgili Fazlar:**
- Faz 4.1: Stripe Entegrasyonu
- Faz 4.2: İyzico Entegrasyonu (Türkiye)

#### 3.1.4 Success Sayfası ve Email
- [ ] Success sayfası (`/checkout/success`)
- [ ] Email gönderimi (ebook download link)
- [ ] My Library'ye yönlendirme

**Dosyalar:**
- `app/checkout/success/page.tsx` - Success sayfası
- `app/api/email/send-ebook/route.ts` - Email API

### 3.2 Phase 2: Ücretsiz Kapak (Free Cover) Sistemi (Öncelik: Orta) 🟡

#### 3.2.1 Database Schema
- [ ] `users` table'a `free_cover_used` kolonu ekleme
- [ ] Migration oluşturma

**Dosyalar:**
- `supabase/migrations/XXX_add_free_cover.sql`

#### 3.2.2 Free Cover API
- [ ] Free cover hakkı kontrolü API
- [ ] Free cover oluşturma API
- [ ] Draft'tan full book satın alma API

**Dosyalar:**
- `app/api/users/free-cover-status/route.ts`
- `app/api/books/create-free-cover/route.ts`
- `app/api/books/purchase-from-draft/route.ts`

#### 3.2.3 UI/UX
- [ ] Dashboard'da free cover badge
- [ ] Wizard'da free cover seçeneği
- [ ] Draft preview sayfası
- [ ] "Buy Full Book" butonu
- [ ] Draft kapak listesi (My Library'de "Drafts" sekmesi)
- [ ] Wizard state restore (draft'tan satın alma yapılırken)

**Dosyalar:**
- `app/dashboard/page.tsx` - Free cover badge, Drafts sekmesi
- `app/create/step1/page.tsx` - Free cover butonu
- `app/draft-preview/page.tsx` - Draft preview sayfası

### 3.3 Phase 3: Draft Kapak'tan Satın Alma - Aynı Yerden Devam Edebilme (Öncelik: Yüksek) 🔴

**Kritik Özellik:** Kullanıcı draft kapak oluşturduktan sonra, daha sonra geri döndüğünde aynı draft kapağı bulabilmeli ve o draft'tan satın alma yapabilmeli.

#### 3.3.1 Draft Kapak Saklama Sistemi
- [ ] LocalStorage draft yönetimi (üye olmayan kullanıcılar için)
- [ ] Database draft saklama (üye olan kullanıcılar için)
- [ ] Draft ID sistemi (`draft_${timestamp}_${random}`)
- [ ] Draft expiration (30 gün localStorage için)
- [ ] Login sonrası draft transfer (localStorage → database)

**Dosyalar:**
- `lib/draft-storage.ts` - Draft saklama helper (localStorage + API)
- `app/api/drafts/route.ts` - Draft API endpoints

#### 3.3.2 Draft Preview ve Erişim
- [ ] Draft preview sayfası (`/draft-preview?draftId=xxx`)
- [ ] Draft kapak listesi (üye olmayan kullanıcılar için localStorage, üye olanlar için My Library'de "Drafts" sekmesi)
- [ ] Email ile draft link paylaşımı (opsiyonel, cross-device erişim için)
- [ ] "Buy Full Book" butonu ve akışı

**Dosyalar:**
- `app/draft-preview/page.tsx` - Draft preview sayfası
- `app/dashboard/page.tsx` - My Library'de "Drafts" sekmesi
- `app/api/draft/share/route.ts` - Email link API

#### 3.3.3 Wizard State Restore
- [ ] Draft'tan satın alma yapılırken wizard'ın aynı yerinden devam
- [ ] Karakter bilgileri, tema, stil vb. korunmalı
- [ ] Wizard state restore mekanizması

**Dosyalar:**
- `app/create/` - Wizard state restore logic
- `lib/wizard-state.ts` - Wizard state yönetimi

---

## 4. Karar Noktaları ve Öneriler

### 4.1 Ne Zaman Para İstenecek?

#### Seçenek 1: Draft Kapak'tan Sonra (Önerilen) ⭐
- Kullanıcı ücretsiz kapak oluşturur
- Kapak önizlemesini görür
- "Buy Full Book" butonuna tıklar
- Plan seçer ve ödeme yapar
- Kalan sayfalar generate edilir

**Avantajlar:**
- ✅ Conversion rate yüksek (kullanıcı ürünü görmüş)
- ✅ Ücretsiz deneme (free cover) ile güven oluşur
- ✅ Düşük risk (kullanıcı sadece kapak için para vermiyor)

#### Seçenek 2: Wizard Başında
- Kullanıcı wizard'a başlar
- Plan seçer ve ödeme yapar
- Tüm kitap generate edilir

**Avantajlar:**
- ✅ Daha basit akış
- ✅ Ödeme garantisi

**Dezavantajlar:**
- ⚠️ Conversion rate düşük (kullanıcı ürünü görmeden para veriyor)
- ⚠️ Yüksek risk (kullanıcı beğenmezse iade sorunu)

#### Seçenek 3: Wizard Sonunda (Generate Öncesi)
- Kullanıcı wizard'ı tamamlar
- Önizleme ekranında "Generate & Purchase" butonu
- Ödeme yapar, kitap generate edilir

**Avantajlar:**
- ✅ Kullanıcı tüm seçimleri yapmış
- ✅ Orta seviye conversion

**Dezavantajlar:**
- ⚠️ Generate öncesi ödeme (risk)

**Öneri: Seçenek 1 (Draft Kapak'tan Sonra)** - En yüksek conversion rate ve kullanıcı memnuniyeti için.

### 4.2 Ebook vs Hardcopy Satış Stratejisi

#### Mevcut Durum
- Hardcopy satın alma: Sadece completed ebook'lar için
- Ebook satın alma: Yok

#### Önerilen Strateji
1. **Ebook Önce:** Kullanıcı önce ebook satın alır
2. **Hardcopy Sonra:** Ebook'u beğenirse hardcopy satın alabilir

**Akış:**
```
Wizard → Draft Cover (Free) → Buy Ebook → Generate → My Library → Buy Hardcopy (Optional)
```

**Avantajlar:**
- ✅ Düşük giriş fiyatı (ebook)
- ✅ Hardcopy için ek gelir
- ✅ Kullanıcı ürünü görmeden hardcopy satın almıyor

---

## 5. İş Kuralları ve Validasyonlar

### 5.1 Ebook Satın Alma Kuralları
- ✅ Kullanıcı login olmadan da ebook satın alabilir (email ile)
- ✅ Ebook satın alma sonrası otomatik account oluşturulur (email ile)
- ✅ Ebook indirme linki email ile gönderilir
- ✅ Ebook sınırsız indirme (My Library'den)

### 5.2 Hardcopy Satın Alma Kuralları
- ✅ Hardcopy satın alma için ebook gerekli (mevcut kural)
- ✅ Sadece completed ebook'lar için hardcopy satın alınabilir
- ✅ Hardcopy fiyatı ebook fiyatından bağımsız

### 5.3 Free Cover Kuralları
- ✅ Her yeni üyeye 1 adet ücretsiz kapak hakkı
- ✅ Ücretsiz kapak sadece 1 kez kullanılabilir
- ✅ Free cover kullanıldıktan sonra draft status ile saklanır
- ✅ Draft'tan full book satın alma yapılabilir

---

## 6. Riskler ve Çözümler

### 6.1 Risk: LocalStorage Draft Kaybı
**Sorun:** Browser temizlenirse draft kaybolur  
**Çözüm:** Email ile draft link paylaşımı (opsiyonel)

### 6.2 Risk: Ödeme Başarısız, Generate Başladı
**Sorun:** Ödeme başarısız olursa generate iptal edilmeli  
**Çözüm:** Webhook ile ödeme onayı sonrası generate başlatılır

### 6.3 Risk: Draft Kapak'tan Satın Alma Sonrası Generate Başarısız
**Sorun:** Generate sırasında hata olursa  
**Çözüm:** Retry mekanizması, kullanıcıya bilgilendirme, iade politikası

---

## 7. Sonuç ve Öneriler

### 7.1 Öncelik Sırası

1. **Phase 1: Ebook Satın Alma Akışı** (🔴 Yüksek Öncelik)
   - Sepet sistemi genişletme
   - Checkout sayfası
   - Success sayfası ve email
   - **Not:** Ödeme entegrasyonu (Stripe/İyzico) daha sonra yapılacak (Faz 4.1 ve 4.2)

2. **Phase 3: Draft Kapak'tan Satın Alma - Aynı Yerden Devam Edebilme** (🔴 Yüksek Öncelik - Kritik)
   - Draft kapak saklama sistemi
   - Draft preview sayfası
   - Draft kapak listesi
   - Wizard state restore
   - Email link paylaşımı (opsiyonel)

3. **Phase 2: Ücretsiz Kapak Sistemi** (🟡 Orta Öncelik)
   - Database schema
   - Free cover API
   - UI/UX

### 7.2 Önerilen İmplementasyon Sırası

**Not:** Şu an için analiz seviyesinde kalınacak, development'a başlanmayacak.

1. **Phase 1: Ebook Satın Alma Akışı** (Checkout sayfası, sepet genişletme - ödeme entegrasyonu hariç)
2. **Phase 3: Draft Kapak'tan Satın Alma - Aynı Yerden Devam Edebilme** (Kritik özellik)
3. **Phase 2: Ücretsiz Kapak Sistemi**
4. **Ödeme Entegrasyonu:** Daha sonra (Faz 4.1 ve 4.2 - Stripe/İyzico)

### 7.3 Başarı Metrikleri

- **Ebook Conversion Rate:** %15+ (pricing sayfası ziyaretçilerinden)
- **Draft to Purchase Rate:** %30+ (draft kapak'tan satın alma)
- **Free Cover Usage:** %50+ (yeni üyelerin free cover kullanımı)
- **Hardcopy Upsell Rate:** %30+ (ebook alanlardan hardcopy satın alma)

---

## 8. İlgili Dokümantasyon

- `docs/PRD.md` - Ürün gereksinimleri (Section 2.3: Ödeme ve Fiyatlandırma)
- `docs/ROADMAP.md` - Faz 4.4.5: Satış ve Sepet Kurgusu
- `docs/ROADMAP.md` - Faz 4.4.9: Ürün Satın Alma Akışı
- `contexts/CartContext.tsx` - Mevcut sepet sistemi
- `app/cart/page.tsx` - Sepet sayfası

---

**Doküman Sahibi:** Proje Ekibi  
**Son Güncelleme:** 26 Ocak 2026  
**Durum:** Analiz Tamamlandı - Karar Bekliyor
