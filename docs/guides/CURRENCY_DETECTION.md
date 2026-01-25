# Currency Detection System

## Genel Bakış

Pricing sayfasında kullanıcının bulunduğu bölgeye göre otomatik para birimi tespiti yapılır. Currency toggle butonu kaldırılmıştır.

## Nasıl Çalışır?

### 1. IP-Based Geolocation (Production - Vercel)
- Vercel deployment'ında `X-Vercel-IP-Country` header'ı otomatik olarak sağlanır
- Bu header 2-letter ISO country code içerir (örn: "TR", "US", "NL")
- `lib/currency.ts` içindeki `getUserCurrency()` fonksiyonu bu header'ı kullanır

### 2. Fallback Mekanizmaları
- **Cloudflare Header**: `CF-IPCountry` header'ı kontrol edilir
- **Accept-Language**: Browser dil ayarlarına göre tespit (Türkçe için TRY)
- **Default**: Hiçbiri bulunamazsa USD gösterilir

### 3. Client-Side Detection (Local Development)
- Local development'ta Vercel header'ları yoktur
- `/api/currency` endpoint'i çağrılır
- API route server-side header'ları kontrol eder
- Fallback olarak browser locale kullanılır

## Currency Mapping

```typescript
TR → TRY (₺250)
US → USD ($7.99)
NL, DE, FR, IT, ES, BE, AT, PT, IE, FI, GR, ... → EUR (€7.50)
GB → GBP (£6.50)
Diğer → USD ($7.99) // Default
```

## Kullanım

### Server Component'te:
```typescript
import { headers } from 'next/headers'
import { getUserCurrency, getCurrencyConfig } from '@/lib/currency'

const headersList = await headers()
const currency = getUserCurrency(headersList)
const config = getCurrencyConfig(currency)
```

### Client Component'te:
```typescript
useEffect(() => {
  fetch('/api/currency')
    .then(res => res.json())
    .then(data => {
      setCurrencyConfig(data)
    })
}, [])
```

## Fiyatlandırma

Her currency için fiyatlar `lib/currency.ts` içinde tanımlıdır:

- **USD**: $7.99 (or ₺250-300)
- **TRY**: ₺250 (or $7.99)
- **EUR**: €7.50 (or $7.99)
- **GBP**: £6.50 (or $7.99)

## Yeni Currency Ekleme

1. `COUNTRY_CURRENCY_MAP`'e country code ekle
2. `CURRENCY_CONFIGS`'e currency config ekle
3. Fiyatı güncelle

## Notlar

- Production'da (Vercel) IP-based detection %99 doğrulukla çalışır
- Local development'ta browser locale fallback kullanılır
- Kullanıcı manuel olarak currency değiştiremez (otomatik tespit)
- VPN kullanan kullanıcılar VPN'in bulunduğu ülkenin currency'sini görür
