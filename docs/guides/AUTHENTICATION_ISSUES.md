# 🔐 Authentication Issues & Workarounds

**Tarih:** 10 Ocak 2026  
**Durum:** 🟡 Geçici Çözümler Uygulandı

---

## ⚠️ Bilinen Sorunlar ve Geçici Çözümler

### 1. Register Sonrası Email Verification Durumu

**Sorun:**
- Register sonrası `signUp` API'si session döndürüyor veya döndürmüyor
- Email verification aktifse session yok, deaktifse session var
- Session yoksa dashboard'a redirect yapılıyor ama dashboard auth kontrolü login'e yönlendiriyor

**Geçici Çözüm:**
- Register sonrası `authData.session` kontrolü yapılıyor
- Session varsa: Dashboard'a yönlendirme (email verification kapalı veya auto-confirmed)
- Session yoksa: `/auth/verify-email` sayfasına yönlendirme (email verification açık)

**Konum:**
- `app/auth/register/page.tsx` - Line 89-125

**Düzgün Çözüm (Faz 3'te):**
- Supabase'de email verification durumunu kontrol et
- Email verification açıksa: Verify-email sayfasına yönlendir
- Email verification kapalıysa: Dashboard'a yönlendir
- Migration 005'te trigger var ama henüz uygulanmadı

---

### 2. public.users Tablosu Boş (Migration Henüz Uygulanmadı)

**Sorun:**
- Migration 005 (`005_fix_user_references.sql`) henüz Supabase'de çalıştırılmadı
- Trigger (`handle_new_user`) henüz aktif değil
- Register sonrası `auth.users`'a kayıt oluyor ama `public.users`'a otomatik kayıt yapılmıyor

**Geçici Çözüm:**
- Register sonrası manuel olarak `public.users`'a kayıt yapılıyor
- `supabase.from('users').update()` ile name güncelleniyor
- Ama trigger olmadan kayıt oluşturulmuyor, sadece güncelleniyor

**Konum:**
- `app/auth/register/page.tsx` - Line 92-114
- Migration: `supabase/migrations/005_fix_user_references.sql` - Line 67-87

**Düzgün Çözüm:**
- Migration 005'i Supabase'de çalıştır
- Trigger otomatik olarak `public.users` kaydı oluşturacak
- Register sayfasındaki manuel update kodunu kaldır (trigger yeterli)

---

### 3. Login Sayfasında Email Verification Kontrolü

**Sorun:**
- Email verification aktifse, kullanıcı login yapamıyor
- Hata mesajı genel: "Invalid email or password"
- Kullanıcı email verification gerektiğini bilmiyor

**Geçici Çözüm:**
- Login sayfasında `authError.message` kontrol ediliyor
- "email not confirmed" veya "Email not confirmed" içeriyorsa özel hata mesajı gösteriliyor
- "Please verify your email address before logging in" mesajı gösteriliyor

**Konum:**
- `app/auth/login/page.tsx` - Line 60-62

**Düzgün Çözüm (Faz 3'te):**
- Email verification durumunu Supabase'den kontrol et
- Verify-email sayfasına "Resend Verification Email" butonu ekle
- Email verification callback'i düzgün handle et

---

### 4. Dashboard Auth Kontrolü - Client-Side Only

**Sorun:**
- Dashboard auth kontrolü sadece client-side yapılıyor (`useEffect`)
- Server-side middleware yok
- Client-side redirect'ten önce sayfa bir an gösteriliyor (flash)

**Geçici Çözüm:**
- `useEffect` ile auth kontrolü yapılıyor
- Loading state gösteriliyor (flash önlemek için)
- Auth yoksa login'e yönlendirme

**Konum:**
- `app/dashboard/page.tsx` - Line 69-87

**Düzgün Çözüm (Faz 3'te):**
- Middleware'de auth kontrolü yap (`middleware.ts`)
- Protected routes için middleware ekle
- Server-side redirect (daha hızlı, flash yok)

---

### 5. Header Auth State - Client-Side Only

**Sorun:**
- Header'daki auth state kontrolü sadece client-side
- Server-side render'da auth bilgisi yok
- Hydration mismatch riski (şimdilik yok ama olabilir)

**Geçici Çözüm:**
- `useEffect` ile auth state kontrol ediliyor
- `onAuthStateChange` listener ekleniyor
- Loading state gösteriliyor

**Konum:**
- `components/layout/Header.tsx` - Line 48-85

**Düzgün Çözüm (Faz 3'te):**
- Server-side auth kontrolü ekle (middleware veya layout)
- Client-side'da sadece UI güncellemesi yap
- Hydration mismatch'i önle

---

### 6. public.users Tablosu - Migration Henüz Uygulanmadı

**Durum:**
- Migration 005 hazır ama henüz Supabase'de çalıştırılmadı
- Trigger çalışmıyor, `public.users` tablosu boş kalıyor
- Register sonrası `public.users` kaydı oluşturulmuyor

**Yapılması Gereken:**
1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/005_fix_user_references.sql` dosyasını aç
3. SQL'i kopyala ve Supabase'e yapıştır
4. RUN butonuna bas
5. Trigger aktif olacak, yeni kayıtlar için `public.users` otomatik oluşturulacak

**Not:** Migration uygulanmadan test etmeye devam edebilirsin ama `public.users` tablosu boş kalacak.

---

## 📋 Yapılacaklar Listesi

### Acil (Test Öncesi)
- [ ] Migration 005'i Supabase'de çalıştır (trigger aktif olsun)
- [ ] Register sonrası `public.users` kaydının oluştuğunu doğrula
- [ ] Email verification durumunu Supabase'de kontrol et (kapalı mı açık mı?)

### Kısa Vadeli (Faz 3)
- [ ] Middleware'de auth kontrolü ekle (server-side protection)
- [ ] Email verification flow'unu düzgün handle et
- [ ] Verify-email sayfasını düzgün implement et
- [ ] Resend verification email fonksiyonu ekle

### Uzun Vadeli (Polish)
- [ ] Server-side auth state yönetimi (hydration mismatch önle)
- [ ] Auth error handling iyileştir (toast notifications)
- [ ] Session refresh mekanizması ekle
- [ ] Remember me özelliği implement et

---

## 🔍 Test Senaryoları

### Senaryo 1: Register → Dashboard (Email Verification Kapalı)
1. Register ol (yeni email)
2. Beklenen: `authData.session` var → Dashboard'a yönlendirme
3. Beklenen: Header'da User Menu görünmeli
4. Beklenen: `public.users` tablosunda kayıt olmalı (migration sonrası)

### Senaryo 2: Register → Verify Email (Email Verification Açık)
1. Register ol (yeni email)
2. Beklenen: `authData.session` yok → Verify-email sayfasına yönlendirme
3. Beklenen: "Check your email" mesajı
4. Beklenen: Email'de verification link'i
5. Link'e tıkla → Email verified → Login ol → Dashboard

### Senaryo 3: Login (Email Verification Açık)
1. Email verification yapılmamış hesap ile login olmaya çalış
2. Beklenen: "Please verify your email address before logging in" mesajı
3. Beklenen: Verify-email sayfasına yönlendirme veya hata mesajı

### Senaryo 4: Dashboard Protection
1. Logout ol
2. `/dashboard` URL'ine direkt git
3. Beklenen: `/auth/login`'e yönlendirme
4. Beklenen: Sayfa flash etmemeli (loading state gösterilmeli)

---

## 📝 Notlar

- Migration 005 uygulanana kadar test edebilirsin ama `public.users` boş kalacak
- Email verification durumu Supabase Dashboard'da kontrol edilmeli
- Şu anki çözümler geçici, Faz 3'te düzgün implementasyon yapılacak
- Bypass yapılan yerler bu dokümantasyonda not edildi, Faz 3'te düzeltilecek

---

**Son Güncelleme:** 10 Ocak 2026  
**Güncelleyen:** @project-manager agent

