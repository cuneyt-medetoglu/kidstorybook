# 🏷️ Faz 7 — İndirim / Promo Kodu Sistemi

**Bağlı Roadmap:** [PAYMENT_ROADMAP.md](PAYMENT_ROADMAP.md)  
**Durum:** ⬜ Planlama — Implementasyon başlanmadı  
**Ön koşul:** Faz 1 ✅ (iyzico aktif, orders/order_items tabloları mevcut)  
**Tahmini süre:** 2-3 gün  
**Öncelik:** Orta — lansman öncesi veya lansman sonrasında eklenebilir

---

## 🎯 Bu Fazın Amacı

Kullanıcıların checkout sırasında **indirim kodu** girebilmesi ve siparişe otomatik indirim uygulanması:

- Admin panelden kod oluşturma (yüzde / sabit tutar / ücretsiz ürün)
- Kullanıcı checkout'ta kodu girer, anlık doğrulama yapılır
- Kodun kullanım limiti, geçerlilik tarihi, belirli ürünlere kısıtlama
- Tek kullanımlık veya çok kullanımlık
- Admin raporlama: kaç kez kullanıldı, toplam indirim tutarı

---

## 1. Veritabanı Şeması

### 1.1 `promo_codes` tablosu

```sql
CREATE TABLE promo_codes (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Kullanıcının gireceği kod (ör. "HEROKID20")
  code           TEXT NOT NULL UNIQUE,

  -- İndirim türü
  discount_type  TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed', 'free_product')),
  -- percent: yüzde indirim (0-100)
  -- fixed:   sabit tutar indirim (TRY cinsinden veya order currency)
  -- free_product: belirli ürün ücretsiz (gelecekte)
  discount_value NUMERIC(10,2) NOT NULL DEFAULT 0,

  -- Para birimi kısıtlaması (NULL = tüm para birimleri)
  currency       TEXT,

  -- Kullanım limiti (NULL = sınırsız)
  max_uses       INTEGER,
  used_count     INTEGER NOT NULL DEFAULT 0,

  -- Tek kullanıcı başına limit (NULL = sınırsız)
  max_uses_per_user INTEGER DEFAULT 1,

  -- Geçerlilik tarihleri (NULL = süresiz)
  valid_from     TIMESTAMPTZ,
  valid_until    TIMESTAMPTZ,

  -- Minimum sipariş tutarı (NULL = kısıtlama yok)
  min_order_amount NUMERIC(10,2),

  -- Belirli ürün türüne kısıtlama (NULL = tüm ürünler)
  -- Örn: '["ebook"]' veya '["hardcopy","bundle"]'
  applicable_to  JSONB,

  -- Aktif/pasif
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,

  -- Admin notları
  description    TEXT,

  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX promo_codes_code_idx ON promo_codes (LOWER(code));
```

### 1.2 `promo_code_usages` tablosu

```sql
-- Hangi kullanıcı hangi kodu hangi siparişte kullandı
CREATE TABLE promo_code_usages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id),
  user_id       UUID NOT NULL REFERENCES public.users(id),
  order_id      UUID NOT NULL REFERENCES orders(id),
  discount_amount NUMERIC(10,2) NOT NULL,
  used_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (promo_code_id, order_id)  -- aynı siparişte iki kez kullanılamaz
);
```

### 1.3 `orders` tablosuna eklenecek sütunlar

```sql
-- Zaten var: promo_code TEXT, promo_code_id UUID
-- Faz 7'de promo_code_id foreign key olarak bağlanacak:
ALTER TABLE orders
  ADD CONSTRAINT orders_promo_code_id_fkey
  FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id);
```

---

## 2. Kullanıcı Akışı — Nereye Girer?

### 2.1 Seçenek A: Step 6 (Özet + Ödeme butonu öncesi) — Önerilir

Step 6 sayfasında, "Ödeme Yap" butonunun üstünde bir input alanı:

```
┌─────────────────────────────────────────┐
│ Promo Kodu                              │
│ ┌────────────────────────┐ ┌──────────┐ │
│ │ HEROKID20              │ │ Uygula   │ │
│ └────────────────────────┘ └──────────┘ │
│  ✅ "%20 indirim uygulandı! -₺59.80"    │
└─────────────────────────────────────────┘
```

**Avantaj:** Kullanıcı fiyatı görmeden önce kodu girer, kasaya gitmeden fiyatı görür.

### 2.2 Seçenek B: IyzicoPaymentFlow (Adres girişi sonrası)

Fatura adresi formundan sonra, "Ödemeye Geç" butonundan önce:

**Avantaj:** Ödeme sağlayıcısına geçmeden hemen önce son kontrol.

### 2.3 Önerimiz

**Seçenek A (Step 6)** daha iyi UX sağlar. Kullanıcı fiyatı gerçek zamanlı görür.

---

## 3. Doğrulama API

### 3.1 POST /api/promo/validate

```typescript
// Gövde: { code: string, currency: string, items: CartItem[], userId: string }
// Yanıt başarı: { valid: true, discountType, discountValue, discountAmount, finalAmount }
// Yanıt hata:  { valid: false, error: 'not_found' | 'expired' | 'limit_reached' | 'min_order' | ... }
```

**Doğrulama adımları:**
1. Kod var mı? (ILIKE ile büyük/küçük harf duyarsız)
2. `is_active = true` mi?
3. `valid_from` / `valid_until` aralığında mı?
4. `max_uses` aşıldı mı?
5. Bu kullanıcı bu kodu daha önce kullandı mı? (`max_uses_per_user`)
6. `min_order_amount` sağlanıyor mu?
7. `applicable_to` kısıtlaması uygun mu?
8. İndirim tutarını hesapla

---

## 4. Ödeme Akışıyla Entegrasyon

### 4.1 Sipariş oluşturulurken

`createOrder()` çağrısında:
```typescript
{
  ...diğer alanlar,
  promoCode:     'HEROKID20',
  promoCodeId:   'uuid-of-promo-code',
  subtotal:      299,
  discountAmount: 59.80,
  totalAmount:   239.20,
}
```

### 4.2 Checkout form başlatılırken

iyzico'ya gönderilen `price` ve `paidPrice` değerleri indirimi yansıtmalı.  
`paidPrice = totalAmount (indirimli)`.

### 4.3 Kod kullanımını kaydet (post-payment)

`handlePaymentSuccess()` içinde, sipariş `paid` olduktan sonra:
```typescript
await recordPromoCodeUsage({
  promoCodeId: order.promo_code_id,
  userId:      order.user_id,
  orderId:     order.id,
  discountAmount: order.discount_amount,
})
// promo_codes.used_count++
```

---

## 5. Admin Paneli

### 5.1 URL Yapısı

```
/admin/promo-codes          — Kod listesi
/admin/promo-codes/new      — Yeni kod oluştur
/admin/promo-codes/[id]     — Detay + düzenleme
```

### 5.2 Listede gösterilecekler

| Sütun | Açıklama |
|-------|----------|
| Kod | `HEROKID20` |
| Tür | Yüzde / Sabit |
| Değer | %20 veya ₺50 |
| Kullanım | 47 / 100 |
| Geçerlilik | 01.04–30.04 |
| Durum | Aktif / Pasif / Süresi Doldu |
| İşlem | Düzenle / Sil |

### 5.3 Yeni Kod Formu

```
Kod:                [ HEROKID20        ]  (otomatik büyük harf)
Açıklama:           [ Lansman kampanyası ]
İndirim Türü:       [○ Yüzde  ○ Sabit tutar]
İndirim Değeri:     [ 20  ] %
Max Kullanım:       [ 100 ]  (boş = sınırsız)
Kişi Başı Max:      [ 1   ]
Geçerlilik:         [ 01.04.2026 ] – [ 30.04.2026 ]
Min Sipariş:        [ 0   ] ₺
Ürün Kısıtı:        [☑ E-Book  ☐ Basılı  ☐ Bundle]
Durum:              [☑ Aktif]
```

### 5.4 API Endpoint'leri (Admin)

```
GET    /api/admin/promo-codes           — Liste
POST   /api/admin/promo-codes           — Yeni kod
GET    /api/admin/promo-codes/[id]      — Detay
PATCH  /api/admin/promo-codes/[id]      — Güncelle (aktif/pasif, değer)
DELETE /api/admin/promo-codes/[id]      — Sil (kullanımı olmayan kodlar için)
GET    /api/admin/promo-codes/[id]/usages — Kullanım geçmişi
```

---

## 6. Yapılacaklar Kontrol Listesi

### Veritabanı
- [ ] `031_promo_codes.sql` migrasyonu yaz ve çalıştır
- [ ] `promo_codes` ve `promo_code_usages` tabloları
- [ ] `orders.promo_code_id` FK ekle

### Backend
- [ ] `lib/db/promo-codes.ts` — CRUD + doğrulama fonksiyonları
- [ ] `POST /api/promo/validate` — kullanıcı tarafı doğrulama
- [ ] `POST /api/admin/promo-codes` — admin CRUD
- [ ] `GET/PATCH/DELETE /api/admin/promo-codes/[id]`
- [ ] `handlePaymentSuccess()` içine `recordPromoCodeUsage()` ekle

### Frontend
- [ ] Step 6 sayfasına promo kodu input alanı ekle
- [ ] Anlık doğrulama (debounce + loading state)
- [ ] İndirimli fiyat gösterimi (subtotal / discount / total ayrımı)
- [ ] Cart store'a `promoCode` ve `discountAmount` state'i ekle

### Admin
- [ ] `/admin/promo-codes` liste sayfası
- [ ] `/admin/promo-codes/new` form sayfası
- [ ] `/admin/promo-codes/[id]` detay + düzenleme
- [ ] Admin sidebar'a link ekle

---

## 7. Gelecek Genişlemeler

- **Referral kodu:** Kullanıcı kendi kodunu paylaşır, kullanımda indirim kazanır.
- **Ücretsiz ürün kodu:** Belirli bir ürünü %100 indirimle verir (ör. tanıtım kopyası).
- **Otomatik kampanya:** Sepette belirli koşul sağlanınca kod gerekmeksizin indirim (ör. "3+ kitap → %10").
- **Çoklu kod:** Birden fazla kod aynı siparişe uygulanabilir (karmaşık — ileride).

---

## ⏭️ Sonraki Faz

→ [FAZ6_TEST_VE_CANLIYA_ALIS.md](FAZ6_TEST_VE_CANLIYA_ALIS.md) — Test ve canlıya alış
