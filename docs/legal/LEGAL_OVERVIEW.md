# HeroKidStory — Yasal Dokümanlar: Genel Bakış ve Önceliklendirme

**Oluşturulma:** Nisan 2026  
**Son Güncelleme:** Nisan 2026  
**Durum:** Analiz aşaması — Faz 1 taslak hazırlığı başladı  
**Şirket Tipi:** Şahıs şirketi  
**Yasal Danışman:** Henüz atanmadı ⚠️

---

## İş Modeli: Satış Kapsamı (Global vs Türkiye)

| Ürün | Satış Coğrafyası | Ödeme Altyapısı | Uygulanacak Hukuk |
|------|-----------------|----------------|-------------------|
| **E-book (dijital)** | 🌍 Global (tüm dünya) | Stripe (global) + İyzico (TR) | TR: TKHK + KVKK / AB: GDPR + Consumer Rights Directive / ABD: FTC + COPPA |
| **E-book + Basılı Kitap** | 🇹🇷 Sadece Türkiye | İyzico | TR: TKHK + KVKK + Mesafeli Sözleşmeler Yönetmeliği |

### Bu Ayrımın Yasal Belgelere Etkisi

| Belge | TR Kullanıcılar | Global Kullanıcılar |
|-------|----------------|---------------------|
| **Mesafeli Satış Sözleşmesi** | ✅ Zorunlu (TKHK) | ❌ Gerekli değil (TR hukuku sadece TR tüketicileri kapsar) |
| **Ön Bilgilendirme Formu** | ✅ Zorunlu (TKHK) | ❌ Gerekli değil |
| **Gizlilik Politikası** | ✅ KVKK zorunlu | ✅ GDPR + COPPA zorunlu |
| **Kullanım Koşulları (ToS)** | ✅ Önerilir | ✅ Zorunlu (global koruma) |
| **Çerez Politikası** | ✅ KVKK | ✅ ePrivacy + GDPR |
| **Terms of Sale (İngilizce)** | — | ✅ Global ticari koruma |

> **Sonuç:** MSS + Ön Bilgilendirme Formu sadece Türk kullanıcılara gösterilecek. Ancak global kullanıcılar için İngilizce bir **Terms of Sale / Purchase Terms** sayfası da gerekecek (Faz 2'de).

---

## Neden Bu Belgeler Kritik?

HeroKidStory:
- **Şahıs şirketi olarak TR'de ödeme alıyor** → Mesafeli Sözleşmeler Yönetmeliği zorunlu
- **Global e-book satışı yapıyor** → GDPR + COPPA + İngilizce yasal metinler gerekli
- **Çocuk fotoğraflarını işliyor** → KVKK + GDPR en üst düzey koruma gerektiriyor
- **AI ile içerik üretiyor** → Telif hakkı ve sorumluluk sınırlamaları şart
- **8 dilde hizmet veriyor** → Hem TR hem AB kullanıcıları kapsıyor
- **Çerez banner'ı zaten mevcut** → Politikanın sayfada olması gerekiyor
- **ETBİS kaydı zorunlu** → E-ticaret yapan tüm işletmeler (cezası 79K–396K TL)

---

## Öncelik Sıralaması ve Faz Planı

### 🔴 FAZ 1 — Ödeme Başlamadan ÖNCE Zorunlu (En Yüksek Risk)

| # | Belge | Kapsam | Yasal Dayanak | Analiz | Taslak |
|---|-------|--------|--------------|--------|--------|
| 1 | **Mesafeli Satış Sözleşmesi** | 🇹🇷 TR | TKHK 6502, MSS Yönetmeliği | [Analiz](./01_MESAFELI_SATIS_SOZLESMESI_ANALIZ.md) | [Taslak](./TASLAK_MESAFELI_SATIS_SOZLESMESI.md) |
| 2 | **Ön Bilgilendirme Formu** | 🇹🇷 TR | Aynı yönetmelik Md. 5 | [Analiz](./02_ON_BILGILENDIRME_FORMU_ANALIZ.md) | [Taslak](./TASLAK_ON_BILGILENDIRME_FORMU.md) |
| 3 | **Gizlilik Politikası** | 🌍 Global | KVKK + GDPR + COPPA | [Analiz](./03_GIZLILIK_POLITIKASI_ANALIZ.md) | Hazırlanacak |

### 🟡 FAZ 2 — Site Yayına Girmeden Önce (Yüksek Önem)

| # | Belge | Kapsam | Yasal Dayanak | Analiz |
|---|-------|--------|--------------|--------|
| 4 | **Kullanım Koşulları / ToS** | 🌍 Global | Borçlar Kanunu + AI hukuku | [Analiz](./04_KULLANIM_KOSULLARI_ANALIZ.md) |
| 5 | **Çerez Politikası** | 🌍 Global | ePrivacy + KVKK | [Analiz](./05_CEREZ_POLITIKASI_ANALIZ.md) |
| 6 | **Terms of Sale (EN)** | 🌍 Global | Consumer Rights Directive | Hazırlanacak |

### 🔴 FAZ 1 (Ek) — Resmi Kayıtlar (E-ticaret Başlamadan)

| # | İşlem | Durum | Analiz |
|---|-------|-------|--------|
| 4 | **ETBİS Kaydı** | ⏳ Domain yayına alındıktan sonra (herokidstory.com alındı, henüz live değil) | [→ Analiz](./06_ETBIS_KAYDI_ANALIZ.md) |
| 5 | **VERBİS Kaydı** | ⚠️ Muhtemelen zorunlu (özel nitelikli veri + yurt dışı aktarım) | Avukata danış |

---

## Mevcut Durum Tespiti

### Footer'da Var Olan Linkler (ama sayfalar boş/yok)
```
/privacy   → Gizlilik Politikası
/terms     → Kullanım Koşulları
/cookies   → Çerez Politikası
```

### Eksik Sayfalar ve Eklenmesi Gerekenler
- `/privacy` — Sayfa yok → 🌍 Global (TR + EN)
- `/terms` — Sayfa yok → 🌍 Global (TR + EN)
- `/cookies` — Sayfa yok → 🌍 Global (TR + EN)
- `/mesafeli-satis` — Sayfa yok → 🇹🇷 Sadece TR kullanıcılara
- Ön Bilgilendirme → Checkout modal olarak → 🇹🇷 Sadece TR kullanıcılara

### Mevcut Altyapı (Kullanılabilecekler)
- `CookieConsentBanner.tsx` → Zaten çalışıyor, `/cookies` linkini bekliyor
- `register/page.tsx` → "Kullanım koşullarını kabul ediyorum" checkbox'ı var (kontrol edilmeli)
- Footer → 3 legal link mevcut, mesafeli satış linki eklenecek
- i18n altyapısı → Locale bazlı içerik gösterimi zaten mümkün

---

## HeroKidStory'ye Özel Risk Faktörleri

### 1. Çocuk Verisi (En Yüksek Risk — Global)
- Fotoğraf yükleme: **Çocuğun biyometrik verisi** sayılabilir
- KVKK'da özel nitelikli veri kategorisi → Açık rıza zorunlu
- GDPR'da 16 yaş altı için **ebeveyn onayı** gerekiyor
- COPPA (ABD): 13 yaş altı çocuk verileri için özel prosedürler
- Veri saklama süresi ve silme politikası net belirtilmeli

### 2. AI ile Üretilen İçerik (Global)
- Telif hakkı belirsizliği: AI çıktısının sahibi kim?
- Kullanıcı yüklediği fotoğrafla üretilen içerik → Platform mı, kullanıcı mı?
- Üçüncü kişilere ait fotoğraf yükleme riski
- AB AI Act — çocuk verisi yüzünden yüksek risk kategorisi olabilir

### 3. Dijital Ürün İadesi (Global)
- TR: Mesafeli Sözleşmeler Yönetmeliği Madde 15 istisnası
- AB: Consumer Rights Directive — benzer dijital içerik istisnası
- ABD: Eyalete göre değişir, genel olarak "no refund" politikası kabul edilir

### 4. Basılı Kitap Siparişi (Sadece TR)
- Fiziksel ürün = 14 günlük cayma hakkı (standart)
- Kişiselleştirilmiş ürün istisnası uygulanabilir
- Print-on-Demand tedarikçi ilişkisi (sözleşmeye yansıması)

### 5. Çoklu Para Birimi (Global)
- TRY / USD / EUR / GBP satış yapılıyor
- Her para birimi için fiyat + KDV/VAT açıklaması gerekli
- Kur farkı riskleri sözleşmelere yansıtılmalı

---

## Hazırlık Süreci

```
Adım 1: ✅ Analiz dokümanları oluşturuldu
        ↓
Adım 2: 🔄 MSS + Ön Bilgilendirme taslağı hazırlanıyor (şahıs şirketi bilgileriyle)
        ↓
Adım 3: Taslakları avukata gönder → Nihai metin
        ↓
Adım 4: Gizlilik Politikası taslağı (KVKK + GDPR birlikte)
        ↓
Adım 5: Kullanım Koşulları + Çerez Politikası taslağı
        ↓
Adım 6: ETBİS + VERBİS kayıtları
        ↓
Adım 7: Checkout flow'a onay entegrasyonu
        ↓
Adım 8: Tüm sayfalara TR + EN çeviri
```

---

## Sayfalara Koymak İçin Eksik Listesi

### Frontend — Oluşturulacak Sayfalar

| Sayfa | URL | İçerik | Kapsam | Durum |
|-------|-----|--------|--------|-------|
| Mesafeli Satış Sözleşmesi | `/mesafeli-satis` | `TASLAK_MESAFELI_SATIS_SOZLESMESI.md` → Sayfaya dönüştür | 🇹🇷 TR | ⏳ Sayfa yok |
| Gizlilik Politikası | `/privacy` | Avukat onaylı metin | 🌍 Global | ⏳ Sayfa yok |
| Kullanım Koşulları | `/terms` | Avukat onaylı metin | 🌍 Global | ⏳ Sayfa yok |
| Çerez Politikası | `/cookies` | `05_CEREZ_POLITIKASI_ANALIZ.md` → Metin | 🌍 Global | ⏳ Sayfa yok |
| İade Politikası | `/refund-policy` | `07_IADE_VE_KALITE_POLITIKASI.md` §7 (EN) | 🌍 Global | ⏳ Sayfa yok |
| İade Politikası (TR) | `/iade-politikasi` | `07_IADE_VE_KALITE_POLITIKASI.md` §6 (TR) | 🇹🇷 TR | ⏳ Sayfa yok |

### Checkout Flow — Eklenecekler (TR Locale)

| Bileşen | Açıklama | Durum |
|---------|---------|-------|
| MSS Checkbox | "Mesafeli Satış Sözleşmesi'ni okudum" — linke tıklanabilir | ⏳ Yok |
| ÖBF Modal | Sipariş bilgileriyle dinamik dolan form | ⏳ Yok |
| Dijital Cayma Onayı | E-book için cayma hakkı feragat checkbox'ı | ⏳ Yok |
| Basılı İade Onayı | Kişiselleştirilmiş ürün için onay checkbox'ı | ⏳ Yok |
| Tüm Checkbox Kontrolü | "Ödemeyi Tamamla" butonu tüm onaylar olmadan disabled | ⏳ Yok |

### Footer — Eklenecekler (Yasal Zorunluluk)

| Bilgi | Durum |
|-------|-------|
| Satıcı adı (Cüneyt Medetoğlu — Şahıs İşletmesi) | ⏳ Yok |
| Adres | ⏳ Yok |
| Vergi Dairesi ve VKN | ⏳ Yok |
| ETBİS No ve Bakanlık linki | ⏳ ETBİS kaydından sonra |
| "İade Politikası" linki | ⏳ Yok |

### Database — Eklenecek Alanlar

```sql
-- orders tablosuna eklenecek
contract_accepted_at         TIMESTAMPTZ
contract_version             VARCHAR(20)   -- ör: "1.0"
preliminary_info_accepted_at TIMESTAMPTZ
digital_waiver_accepted      BOOLEAN
contract_sent_at             TIMESTAMPTZ   -- e-posta gönderim zamanı
```

### CookieConsentBanner.tsx — Hızlı Düzeltme

```tsx
// Satır ~95: href="/privacy" → href="/cookies" olarak değiştir
// + localStorage'a timestamp ekle:
localStorage.setItem("cookie-consent-timestamp", new Date().toISOString())
```

---

## Önemli Uyarı

> Bu dokümanlar **analiz ve rehber** amaçlıdır. **Hukuki tavsiye değildir.**  
> Tüm yasal metinler uygulamaya konulmadan önce **lisanslı bir avukat tarafından** gözden geçirilmelidir.  
> Özellikle çocuk verisi işleme ve Türk tüketici hukuku konularında profesyonel destek zorunludur.
