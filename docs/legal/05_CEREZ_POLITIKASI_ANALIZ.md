# Çerez Politikası (Cookie Policy) — Analiz ve Hazırlık Rehberi

**Öncelik:** 🟡 FAZ 2 — Yüksek Önem (Banner zaten var ama sayfası yok)  
**Kapsam:** 🌍 Global — AB ePrivacy Direktifi tüm AB kullanıcılarını kapsıyor  
**Yasal Dayanak:** AB ePrivacy Direktifi (2002/58/EC), KVKK, GDPR Recital 30  
**Sayfa URL:** `/cookies`  
**Footer'da Linki:** Zaten mevcut  
**İlgili Bileşen:** `components/layout/CookieConsentBanner.tsx` (zaten implement edilmiş)  
**Dil:** TR + EN

---

## 1. Mevcut Durum Analizi

### Ne Var?
- `CookieConsentBanner.tsx`: Tam işlevsel — Kabul/Reddet/Özelleştir butonları
- 3 kategori tanımlı: Zorunlu, Analitik, Pazarlama
- `localStorage`'a tercih kaydediliyor
- Footer'da `/cookies` linki var

### Ne Yok?
- `/cookies` sayfası yok → Link tıklandığında 404 alıyorsun
- Hangi çerezlerin kullanıldığına dair liste yok
- Çerezleri hangi 3. tarafların koyduğu belli değil

---

## 2. Çerez Politikası Neden Gerekli?

### Yasal Zorunluluk
- **AB ePrivacy Direktifi:** Analitik ve pazarlama çerezleri için önceden onay zorunlu
- **GDPR:** Çerez onayı, geçerli bir rıza sayılabilmek için "açık, özgür, bilinçli ve spesifik" olmalı
- **KVKK:** Çerez verileri kişisel veri sayılır, aydınlatma zorunlu

### Pratik Sebepler
- Google Analytics, Meta Pixel gibi araçlar kurulum rehberlerinde politika sayfasını zorunlu kılıyor
- App store (gelecekte mobil uygulama varsa) politika linki ister
- Reklam ağları (ileride) politika olmadan çalışmaz

---

## 3. HeroKidStory'de Kullanılan/Kullanılabilecek Çerezler

### 3.1 Zorunlu Çerezler (Her zaman aktif — kullanıcı kapatamaz)

| Çerez Adı | Kaynak | Süre | Amaç |
|-----------|--------|------|-------|
| `next-auth.session-token` | NextAuth.js | Session | Kullanıcı oturumu |
| `next-auth.csrf-token` | NextAuth.js | Session | Güvenlik |
| `cookie-consent` | HeroKidStory | 1 yıl | Çerez tercihi kaydı |
| `cookie-preferences` | HeroKidStory | 1 yıl | Detaylı çerez tercihleri |
| `NEXT_LOCALE` | Next.js i18n | 1 yıl | Dil tercihi |

### 3.2 Analitik Çerezler (Onay gerekli)

| Çerez Adı | Kaynak | Süre | Amaç |
|-----------|--------|------|-------|
| `_ga` | Google Analytics | 2 yıl | Kullanıcı tanımlama |
| `_ga_*` | Google Analytics | 2 yıl | Session takibi |
| `_gid` | Google Analytics | 24 saat | Kullanıcı tanımlama |
| Vercel Analytics | Vercel | Session | Sayfa performansı |

> **Not:** Şu an analytics var mı? `package.json`'da kontrol edilmeli. Yoksa bu bölüm "Şu an kullanmıyoruz" şeklinde yazılabilir.

### 3.3 Pazarlama Çerezleri (Onay gerekli)

| Çerez Adı | Kaynak | Süre | Amaç |
|-----------|--------|------|-------|
| `_fbp` | Meta/Facebook | 3 ay | Reklam hedefleme |
| `fr` | Meta/Facebook | 3 ay | Reklam gösterim |

> **Not:** Facebook OAuth mevcut. Bu OAuth akışı pazarlama çerezi koymaz ama Facebook SDK yükleniyorsa koyabilir. Kontrol edilmeli.

---

## 4. Mevcut CookieConsentBanner ile Uyum Analizi

### Güçlü Yanlar ✅
```
Banner yapısı:
- 3 kategori ayrımı var (Zorunlu/Analitik/Pazarlama)
- Zorunlu çerezler kapatılamıyor (toggle disabled)
- Tercihler localStorage'a kaydediliyor
- Sadece bir kez gösteriliyor (tekrar gelince göstermiyor)
```

### Eksik/Düzeltilmesi Gerekenler ⚠️
```
1. Çerez politikası sayfasına link var (/privacy'ye yönlendiriyor)
   → /cookies sayfasına yönlendirmeli

2. Onay ID'si / timestamp kaydedilmiyor
   → GDPR için onayın ne zaman verildiği kayıt altına alınmalı
   
3. Onayın backend'e kaydedilmiyor
   → Şu an sadece localStorage → Server-side kanıt yok
   
4. "Decline" butonuna basılınca analytics/marketing devre dışı bırakılıyor mu?
   → Kod kontrolü gerekli (sadece localStorage'a "declined" yazıyor, 
      ama Google Analytics scripti hâlâ yüklenebilir)
```

---

## 5. Politikanın Yapısı / Taslak İçerik Planı

```
1. GİRİŞ
   - Çerez nedir? (kısa açıklama)
   - Bu politikanın kapsamı
   - Son güncelleme tarihi

2. KULLANDIĞIMIZ ÇEREZ TÜRLERİ
   - Zorunlu çerezler (tablo ile)
   - Analitik çerezler (tablo ile)
   - Pazarlama çerezleri (tablo ile)

3. ÜÇÜNCÜ TARAF ÇEREZLER
   - Google Analytics → Google Gizlilik Politikası linki
   - Meta/Facebook → Meta Gizlilik Politikası linki
   - NextAuth → Açıklama

4. ÇEREZ TERCİHLERİNİZİ YÖNETME
   - Banner üzerinden yönetim
   - Tarayıcı ayarlarından çerez silme
   - Opt-out linkleri (Google Analytics opt-out vb.)

5. GİZLİLİK POLİTİKASI İLE BAĞLANTI
   - Kişisel veri işleme için → /privacy

6. DEĞİŞİKLİKLER
   - Güncelleme bildirimi

7. İLETİŞİM
```

---

## 6. Teknik Gereksinimler

### 6.1 Onay Kaydı İyileştirmesi

Şu anki `localStorage` yaklaşımı yeterli değil. GDPR için önerilecek iyileştirme:

```typescript
// localStorage'a ek olarak:
{
  "cookie-consent": "accepted",
  "cookie-consent-timestamp": "2026-04-11T10:30:00Z",
  "cookie-consent-version": "1.0",
  "cookie-preferences": {...}
}
```

İleride ödeme/kayıt olan kullanıcılar için backend'e de kayıt eklenebilir.

### 6.2 Conditional Script Loading

En iyi uygulama — analitik scriptleri sadece onay verilince yükle:

```tsx
// app/[locale]/(public)/layout.tsx içinde:
useEffect(() => {
  const consent = localStorage.getItem('cookie-consent')
  const prefs = JSON.parse(localStorage.getItem('cookie-preferences') || '{}')
  
  if (consent && prefs.analytics) {
    // Google Analytics scriptini yükle
  }
  if (consent && prefs.marketing) {
    // Meta Pixel scriptini yükle
  }
}, [])
```

### 6.3 Sayfa Gereksinimleri
- URL: `/cookies`
- Basit ve anlaşılır dil
- Her çerez için tablo: Ad | Kaynak | Süre | Amaç
- "Tercihlerimi Güncelle" butonu → Banner'ı yeniden açar
- TR + EN

---

## 7. Çerez Onayı için GDPR Geçerlilik Kriterleri

GDPR'da rıza geçerli sayılmak için şu kriterleri karşılamalı:

| Kriter | Mevcut Banner | Durum |
|--------|--------------|-------|
| **Özgür (freely given)** | Reddetmek mümkün | ✅ |
| **Spesifik** | Kategori bazlı | ✅ |
| **Bilinçli (informed)** | Kısa açıklama var | ⚠️ Politika sayfası henüz yok |
| **Belirsizliğe yer yok** | Aktif onay (checkbox yok, buton var) | ✅ |
| **Geri çekilebilir** | Şu an yok | ❌ Eklenebilir |
| **Cookie wall yok** | Reddedince de siteye girebiliyor | ✅ |

**Eksik:** "Tercihlerimi Değiştir" linki eklenebilir (footer veya settings sayfasında).

---

## 8. Şu An Yapılabilecek Hızlı Düzeltmeler

Çerez politikası sayfası hazır olmadan da şu iyileştirmeler yapılabilir:

1. **Banner'daki link'i düzelt:** `/privacy` yerine `/cookies` yönlendir
   - `CookieConsentBanner.tsx` satır 95: `href="/privacy"` → `href="/cookies"` yap
   - Fakat önce `/cookies` sayfasını oluştur

2. **Timestamp ekle:** `localStorage.setItem("cookie-consent-timestamp", new Date().toISOString())`

3. **Settings'e "Çerez Tercihlerini Yönet" linki:** Dashboard'daki settings sayfasına ekle

---

## 9. Maliyet Tasarrufu: Template Kullanımı

Çerez politikası, diğer belgeler gibi platform-spesifik değildir. Template tabanlı çözümler kullanılabilir:

| Araç | Ücret | Avantaj | Dezavantaj |
|------|-------|---------|-----------|
| **iubenda** | ~90€/yıl | Otomatik çerez tarama, GDPR + KVKK | Türkçe sınırlı |
| **Termly** | ~99$/yıl | Kapsamlı, tarayıcı bazlı çerez tarama | KVKK odağı az |
| **Manuel + Avukat** | 500–1.500 ₺ | Tam kontrol | Çerez listesi manuel |
| **CookieYes** | Freemium | Banner + policy | Sınırlı özelleştirme |

**Öneri:** Başlangıçta avukat review'lu template + CookieConsentBanner'ı geliştir.

---

## 10. Sonraki Adımlar

- [ ] Aktif çerezlerin tam listesini çıkar (browser DevTools ile)
- [ ] Analytics araçlarının kullanılıp kullanılmadığını teyit et
- [ ] `/cookies` sayfasını oluştur
- [ ] `CookieConsentBanner.tsx`'teki `/privacy` linkini `/cookies` yap
- [ ] Timestamp kaydını localStorage'a ekle
- [ ] Conditional script loading uygula (analitik scriptler)
- [ ] Settings sayfasına "Çerez tercihlerini yönet" butonu ekle

---

> **Not:** Bu belgeler arasında en teknik olanı. Yasal metin kısa tutulabilir ama tablo formatındaki çerez listesi eksiksiz olmalıdır. Tarayıcı DevTools ile site inspect edilerek tüm çerezler listelenmeli, sonra tabloya eklenmeli.
