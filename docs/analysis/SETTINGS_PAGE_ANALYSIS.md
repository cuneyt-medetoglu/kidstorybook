# Hesabım / Ayarlar — Analiz ve Kararlar

**Tarih:** 11 Nisan 2026  
**Durum:** Canlı — `app-settings` yalnızca **Çocuk Modu** (tercih DB’de; uygulama davranışı henüz yok).

---

## Özet

- Tek sayfa: `/dashboard/settings` + `?section=`.
- Header **"Ayarlar"** → `?section=app-settings`; **"Siparişlerim"** → `orders`.
- Sayfa başlığı **"Hesabım"**.
- `users.preferences` JSONB şu an yalnızca **`{ "kidMode": boolean }`** (eski alanlar `033` migration ile temizlenir).
- **Billing** mock; Stripe sonrası.
- Para birimi override yok.

---

## 1. Kararlar

| # | Karar |
|---|-------|
| 1 | Tek dashboard settings + sidebar. |
| 2 | **"Ayarlar"** (`app-settings`): şimdilik sadece çocuk modu tercihi; davranış sonraya bırakıldı. |
| 3 | **Billing** dokunulmadı. |
| 4 | Para birimi tercihi yok. |
| 5 | Tercihler DB — `users.preferences`. |

---

## 2. Section'lar

| `section` | Sidebar |
|-----------|---------|
| `profile` | Profil |
| `account` | Hesap Ayarları |
| `orders` | Siparişlerim |
| `free-cover` | Ücretsiz Kapak |
| `notifications` | Bildirimler |
| `app-settings` | Ayarlar |
| `billing` | Faturalama |

---

## 3. "Ayarlar" — Şu anki içerik

| Alan | Durum |
|------|--------|
| **Çocuk Modu** | Toggle + kayıt; UI’da “henüz uygulama genelinde etkin değil” notu. Davranış (menü sadeleştirme vb.) **ileride**. |

---

## 4. Veri modeli

```json
{ "kidMode": false }
```

- **032:** `preferences` kolonu.  
- **033:** Eski `ebook` / `wizardDefaults` / `ui` anahtarlarını kaldırıp yalnızca `kidMode` bırakır.

**API:** `GET` / `PATCH /api/user/preferences` — PATCH gövdesinde yalnızca `kidMode` (boolean) kabul edilir.  
**Tipler:** `lib/types/user-preferences.ts` · **DB:** `lib/db/user-preferences.ts`

---

## 5. Dosya özeti

| Dosya | Rol |
|-------|-----|
| `migrations/032_user_preferences.sql` | Kolon |
| `migrations/033_user_preferences_kid_mode_only.sql` | Legacy JSON temizliği |
| `lib/types/user-preferences.ts` | `UserPreferences` = `{ kidMode }` |
| `lib/db/user-preferences.ts` | GET / güncelleme (tam yazım `{ kidMode }`) |
| `app/api/user/preferences/route.ts` | Auth + PATCH doğrulama |
| `dashboard/settings/page.tsx` | Ayarlar UI |
| `Header.tsx` | `?section=app-settings` |

**DB:** `psql $DATABASE_URL -f migrations/033_user_preferences_kid_mode_only.sql` (032 zaten uygulandıysa)

---

## 6. Sidebar sırası

```
Profil → Hesap Ayarları → Siparişlerim → Ücretsiz Kapak → Bildirimler → Ayarlar → Faturalama
```
