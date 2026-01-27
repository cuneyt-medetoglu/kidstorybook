# Step 6: PAY Gizleme + Üyesiz Ücretsiz Kapak (Email + IP) – Geliştirme Spec

## Başlangıç Özeti

| Karar | Açıklama |
|-------|----------|
| **1. Üye olmadan satın alma yok** | `!user` iken "Pay & Create My Book" butonu **gösterilmez**. Ödeme = giriş/kayıt zorunlu. My Library tutarlı çalışır. |
| **2. Üyesiz 1 ücretsiz kapak** | Üyesiz kullanıcı "Create Free Cover" görür; email zorunlu. **Email** ile 1 kere, **IP** ile çoklu deneme sınırı. |

**Kapsam:** Step 6 UI, `create-free-cover` ve `free-cover-status` API’leri, yeni `guest_free_cover_used` tablosu, IP rate limit.

---

## 1) Üye Olmadan Satın Alma Olmasın

### Hedef

- Üyesiz (`!user`) kullanıcıya **"Pay & Create My Book"** hiç gösterilmez.
- Ödemek isteyen: giriş/kayıt → Step 6’ya dönüp Pay ile devam eder.

### Yapılacaklar

| # | Yer | Değişiklik |
|---|-----|------------|
| 1.1 | `app/create/step6/page.tsx` | "Pay & Create My Book" bloğunu `{user && ( ... )}` ile sarmala; `!user` iken render etme. |
| 1.2 | Aynı | Üyesiz + ücretsiz kapak yoksa: "Üye ol veya giriş yap, ücretsiz kapağını kullan veya kitabı satın al" gibi kısa CTA (opsiyonel). |

### Mevcut Durum

- Pay butonu: `disabled={!user && !validateEmail(email)}` — hâlâ **görünüyor**.
- Email alanı: `!user` iken zaten var; ücretsiz kapak ve (ileride) "giriş yap" CTA için kullanılacak.

---

## 2) Üyesiz Ücretsiz Kapak: Email + IP ile Sınırlama

### Hedef

- Üyesiz: **"1 Free Cover" / "Create Free Cover"** görsün (email zorunlu).
- **1 kere:** Aynı **email** ile ikinci deneme engellensin.
- **Çoklu deneme:** Aynı **IP**’den aşırı istek (farklı emaillerle deneme) engellensin.

### 2.1 Email: 1 Ücretsiz Kapak / Email

- Yeni tablo: `guest_free_cover_used`
  - `id` (uuid, PK)
  - `email` (text, UNIQUE, NOT NULL)
  - `used_at` (timestamptz)
  - Index: `email`
- `POST /api/books/create-free-cover`:
  - `user` yoksa → body’de `email` zorunlu.
  - `SELECT 1 FROM guest_free_cover_used WHERE email = $1` → varsa `400` / `{ success: false, error: "Bu e-posta ile ücretsiz kapak hakkı zaten kullanıldı." }`.
  - Yoksa: kapak oluştur, `INSERT INTO guest_free_cover_used (email, used_at)`, response + (opsiyonel) email ile link.

### 2.2 IP: Çoklu Deneme Sınırı

- Aynı IP’den `create-free-cover` (sadece guest: `!user`) için:
  - **Öneri:** En fazla **5 istek / IP / 24 saat** (başarılı+başarısız birlikte) veya **3 başarılı / IP / 24 saat**.
- Uygulama:
  - Redis / veritabanı / mevcut rate-limit middleware ile `X-Forwarded-For` veya `x-real-ip` + `create-free-cover` path’i.
  - Aşımda: `429` + `{ success: false, error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." }`.
- Not: Ortak IP (aile/ofis) için 3–5/gün makul; asıl 1 hak sınırı email ile.

### 2.3 API Akışı (create-free-cover, guest)

1. `user` var mı?
   - **Evet:** Mevcut mantık (`users.free_cover_used`); değişiklik yok.
2. **Hayır (guest):**
   - Body’de `email` yok → `400`.
   - Rate limit (IP) aşımı → `429`.
   - `guest_free_cover_used`’da `email` var → `400` ("zaten kullanıldı").
   - Geçtiyse: kapak üret, `guest_free_cover_used`’a ekle, `user_id = null` draft; response’ta `draftId` / link. (İsteğe bağlı: kapak linki email.)

### 2.4 free-cover-status (üyesiz)

- **Seçenek A (önerilen):** Ayrı endpoint yok. Üyesizde `hasFreeCover` benzeri davranış:
  - "Create Free Cover" her zaman gösterilir (email dolu olmalı).
  - Tıklayınca API "zaten kullanıldı" dönerse → toast + aynı session’da butonu devre dışı / mesaj.
- **Seçenek B:** `GET /api/guests/free-cover-status?email=...` → `{ hasFreeCover: boolean }`. Email enumeration riski; gerekirse rate limit.

### 2.5 Step 6 UI (üyesiz + ücretsiz kapak)

- `hasFreeCover`:
  - **Üyeli:** Mevcut `GET /api/users/free-cover-status` (değişmez).
  - **Üyesiz:** `guest_free_cover_used`’a göre ön-kontrol yok (Seçenek A). Varsay: "1 ücretsiz hak var"; API reddederse mesaj.
- "1 Free Cover" badge: Üyesizde de göster (email girilmişse anlamlı; yoksa "Create Free Cover" disabled + "Email girin").
- "Create Free Cover" butonu:
  - `!user` iken: `disabled={!email \|\| !validateEmail(email)}`; `onClick`’te body’de `email` gönder.
- `handleCreateFreeCover`: Body’ye `email: user ? user.email : email` ekle; API `!user` + `email` ile guest dalına girsin.

### 2.6 create-free-cover Body (guest)

- Mevcut API: `characterData`, `theme`, `style` bekliyor; frontend `wizardData` gönderiyor. Guest için de `wizardData` + `email` yeterli; API içinde `wizardData`’dan `characterData`, `theme`, `style` türetilmeli (mevcut uyumsuzluk varsa düzelt).

---

## 3) Veritabanı

### Migration: `guest_free_cover_used`

```sql
CREATE TABLE IF NOT EXISTS guest_free_cover_used (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  used_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_free_cover_used_email ON guest_free_cover_used(email);

COMMENT ON TABLE guest_free_cover_used IS 'Üyesiz kullanıcıların 1 ücretsiz kapak hakkı kullanımı (email bazlı).';
```

- `ip_hash` / `ip`: İlk etapta atlanabilir; rate limit ayrı (Redis/API) tutulur.

---

## 4) Özet Yapılacaklar

| # | Bileşen | İş |
|---|---------|-----|
| 1 | Step 6 | Pay butonunu `{user && (...)}` ile göster; `!user` ise gizle. |
| 2 | Step 6 | Üyesizde `hasFreeCover`: "1 hak var" varsay; "Create Free Cover" göster, `email` zorunlu, `handleCreateFreeCover`’a `email` ver. |
| 3 | create-free-cover API | `!user` dalı: `email` zorunlu, `guest_free_cover_used` kontrolü, INSERT, `user_id=null` draft. |
| 4 | create-free-cover API | Guest için IP rate limit (örn. 5/24h veya 3 başarılı/24h). |
| 5 | DB | `guest_free_cover_used` tablosu migration. |
| 6 | create-free-cover API | `wizardData` → `characterData`/`theme`/`style` dönüşümü (guest için de). |

---

## 5) Opsiyonel / Sonra

- `GET /api/guests/free-cover-status?email=...` (butonu önceden kapatmak için).
- Email’e kapak linki gönderme (şu an response’taki `draftId` yeterli olabilir).
- Geçici email (disposable) blocklist.
- `guest_free_cover_used` için saklama süresi ve gizlilik notu.
