# Debug ve Feature Flags Sistemi – Analiz

**Tarih:** 29 Ocak 2026  
**Amaç:** Admin olarak ödeme yapmadan kitap oluşturma testi ve ileride admin dashboard gibi özellikleri güvenli şekilde açmak.

---

## Sorun

- Create book akışı ödemeye bağlandığı için **test ortamında** ödeme yapmadan kitap oluşturulamıyor.
- İleride **admin dashboard** gibi sadece yetkili kullanıcıya açık özellikler olacak; bunların tek bir yapı üzerinden yönetilmesi isteniyor.

---

## Önerilen Yapı

### 1. Config katmanı (env + merkezi config)

- **`lib/config.ts`** (veya benzeri) içinde:
  - **DEBUG / development flags:** Sadece `NODE_ENV=development` veya server env `DEBUG_SKIP_PAYMENT` (opsiyonel). Görünürlük DB'deki admin rolü ile.
  - **Feature flags:** Örn. `skipPaymentForCreateBook`, `showAdminDashboard` gibi tek tek bayraklar.
- Production’da bu env’ler **asla** açık olmamalı (Vercel’de tanımlanmaz).

### 2. Kullanıcıya bağlama (admin)

- **users** tablosunda `role` (veya `is_admin`) alanı:
  - Sadece belirli e-posta/ID’ler manuel admin yapılsın.
- Kontrol:
  - **Server:** API route’larda `user.role === 'admin'` (veya `is_admin`) kontrolü.
  - **Client:** Admin sayfaları/linkleri sadece admin kullanıcıya render edilsin; asıl yetki her zaman API’de doğrulansın.

### 3. Birleşik kural (ne zaman “debug” özellik açık?)

- **Create book’u ödeme yapmadan açmak:**
  - `(DEBUG_SKIP_PAYMENT env AÇIK) VEYA (kullanıcı admin)`  
  - Admin ise NODE_ENV/flag fark etmez; hem development hem production’da “Create without payment” ve ilgili debug özellikleri görür ve kullanır.
- **Debug quality butonları (Step 6) ve debug trace / run-up-to:**
  - Sadece **admin** (role=admin). NODE_ENV veya config flag’e bakılmaz; admin her ortamda erişir.
- **Admin dashboard’u göstermek:**
  - `(kullanıcı admin) VE (showAdminDashboard flag açık veya DEBUG)`  
  - Normal kullanıcı hiçbir zaman görmemeli.

### 4. Kısa implementasyon notları

| Konu | Öneri |
|------|--------|
| **Env** | `DEBUG_SKIP_PAYMENT` (sadece server, opsiyonel). Görünürlük DB admin rolü ile. |’ API’de) |
| **Mevcut config** | `lib/config.ts` içindeki `features.dev` genişletilir; `skipPaymentForCreateBook`, `showAdminDashboard` eklenir |
| **Admin** | `users.role` veya `users.is_admin`; migration ile eklenir, ilk admin manuel atanır |
| **API** | Create book route: önce “skip payment” yetkisi (DEBUG veya admin+flag), sonra iş mantığı |
| **UI** | Step 6’da “Ödemesiz oluştur” butonu sadece yetkili kullanıcıda veya DEBUG’da görünsün |
| **Güvenlik** | Production’da DEBUG env’leri kapalı; admin kontrolü mutlaka server-side |

---

## Sonuç

- **Tek yer:** Tüm “özel / test / admin” davranışları **config + role** ile yönetilir.
- **Admin her ortamda:** Skip payment, debug quality paneli ve debug trace/run-up-to özellikleri admin için NODE_ENV veya feature flag’e bağlı değildir; production’da da aynı admin hesabıyla görünür ve kullanılır.
- **Test:** DEBUG_SKIP_PAYMENT env veya admin hesabı ile ödeme yapmadan create book test edilir.
- **İleride:** Admin dashboard ve benzeri özellikler aynı yapıya (flag + admin role) eklenir; kısa ve tutarlı kalır.

Detaylı implementasyon adımları iş açıldığında ROADMAP / implementation dokümanına taşınabilir.
