# 📋 Logging Rehberi (FAZ 8)

**Tarih:** 2 Şubat 2026  
**Amaç:** Merkezi logger ile logları yönetmek; development'ta açık, production'da kapalı (opsiyonel env ile açılabilir).

---

## 1. Logger kullanımı

```ts
import logger from "@/lib/logger"

logger.info("Bilgi mesajı")           // Sadece development veya env açıksa
logger.debug("Debug detayı")          // Aynı koşul
logger.warn("Uyarı")                   // Her zaman (production dahil)
logger.error("Hata", error)           // Her zaman (production dahil)
```

- **info / debug:** Sadece `NODE_ENV === 'development'` veya aşağıdaki env flag’ler açıksa çıkar.
- **warn / error:** Her ortamda çıkar (production’da da hata takibi için).

---

## 2. Env değişkenleri

| Değişken | Nerede geçerli | Açıklama |
|----------|----------------|----------|
| **NODE_ENV** | Next.js tarafından set edilir | `development` → log açık, `production` → log kapalı (varsayılan). |
| **NEXT_PUBLIC_ENABLE_LOGGING** | Tarayıcı (client) | `true` ise production’da da client logları (info/debug) açılır. |
| **DEBUG_LOGGING** | Sunucu (API routes, SSR) | `true` ise production’da da server logları açılır. |

**Varsayılan davranış:** Development’ta log açık; production’da kapalı. Production’da geçici debug için `.env.local` veya Vercel env’e sadece gerekince ekleyin.

---

## 3. .env.local’a ne eklenir? (Opsiyonel)

**Normalde eklemen gerekmez.** Sadece production’da log görmek istersen:

- **Client (tarayıcı) logları için:**  
  `NEXT_PUBLIC_ENABLE_LOGGING=true`
- **Server (API) logları için:**  
  `DEBUG_LOGGING=true`

Ekledikten sonra deploy’da bu değişkenleri kapatmayı unutma (güvenlik ve gürültü için).

---

## 4. Mevcut console.log geçişi

Kodda hâlâ `console.log` / `console.warn` / `console.error` kullanımları var. Yeni kodda `logger` kullanın; mevcut kullanımlar kademeli olarak `logger.info` / `logger.warn` / `logger.error` ile değiştirilebilir. Detay: `CLEANUP_PLAN.md` FAZ 8.

---

## 5. Referanslar

- Logger: `lib/logger.ts`
- Env örneği: `.env.example` (Logging bölümü)
- Kod standardı: `docs/guides/CODE_COMMENT_STANDARDS.md`
