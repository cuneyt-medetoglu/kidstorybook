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
  - `(DEBUG mod AÇIK) VEYA (kullanıcı admin VE skipPaymentForCreateBook flag açık)`  
  - Böylece: Lokal/Vercel preview’da env ile test; production’da sadece admin hesabı (flag açıksa) test edebilir.
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
- **Test:** DEBUG veya admin hesabı ile ödeme yapmadan create book test edilir.
- **İleride:** Admin dashboard ve benzeri özellikler aynı yapıya (flag + admin role) eklenir; kısa ve tutarlı kalır.

Detaylı implementasyon adımları iş açıldığında ROADMAP / implementation dokümanına taşınabilir.
