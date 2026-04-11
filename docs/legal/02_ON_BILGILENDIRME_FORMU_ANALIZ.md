# Ön Bilgilendirme Formu — Analiz ve Hazırlık Rehberi

**Öncelik:** 🔴 FAZ 1 — En Yüksek (Mesafeli Satış Sözleşmesi ile birlikte zorunlu)  
**Kapsam:** 🇹🇷 Sadece Türkiye'deki tüketiciler  
**Bağlantılı Belgeler:** [MSS Analizi](./01_MESAFELI_SATIS_SOZLESMESI_ANALIZ.md) | [ÖBF Taslağı](./TASLAK_ON_BILGILENDIRME_FORMU.md)  
**Yasal Dayanak:** Mesafeli Sözleşmeler Yönetmeliği (2014), Madde 5 ve 6

> **NOT:** Bu form sadece Türk kullanıcılara gösterilecek. Checkout'ta kullanıcının locale'ine göre `tr` ise göster, diğer dillerde gösterme. Global kullanıcılar için İngilizce Terms of Sale yeterli olacaktır (Faz 2).

---

## 1. Ön Bilgilendirme Formu Nedir?

Mesafeli Satış Sözleşmesi'nden **farklı** ve **ondan önce** gösterilmesi zorunlu olan bir belgedir.

### Temel Fark

| | Ön Bilgilendirme Formu | Mesafeli Satış Sözleşmesi |
|-|----------------------|--------------------------|
| **Amaç** | Tüketiciyi önceden bilgilendirmek | Taraflar arasında bağlayıcı sözleşme |
| **Ne zaman?** | Sipariş onayından ÖNCE | Sipariş onayı ile birlikte / sonra |
| **Nerede?** | Ödeme sayfasında (okunabilir, kayıt altına alınabilir) | Onay sonrası e-posta ile kalıcı olarak |
| **Bağlayıcılık** | Bilgilendirme amaçlı | Hukuki sözleşme |

### Neden Ayrı Bir Belge?
Yönetmelik Madde 5: Satıcı, **sözleşme kurulmadan önce** tüketiciye belirli bilgileri vermek zorundadır. Bu bilgilendirme yapılmadan sözleşme kurulamaz, ödeme alınamaz.

---

## 2. Formda Bulunması Gereken Zorunlu Bilgiler

**Yönetmelik Madde 5** gereği ön bilgilendirme formunda yer alması gerekenler:

### 2.1 Satıcı Kimlik Bilgileri
- [ ] Şirket/kişi adı
- [ ] Adres
- [ ] Telefon ve e-posta
- [ ] Varsa vergi numarası / MERSİS numarası

### 2.2 Ürün/Hizmet Bilgileri
- [ ] Satın alınan ürünün veya hizmetin temel özellikleri
- [ ] Toplam fiyat (tüm vergi ve masraflar dahil)
- [ ] Varsa teslimat bedeli (basılı kitap için kargo ücreti)

### 2.3 Ödeme ve Teslimat
- [ ] Ödeme yöntemi
- [ ] Teslimat süresi ve yöntemi
  - E-book: "Ödeme onayı sonrası anında hesabınıza eklenir"
  - Basılı: "X–Y iş günü içinde kargoya verilir"

### 2.4 Cayma Hakkı (En Kritik Kısım)
- [ ] Cayma hakkının varlığı (14 gün — fiziksel ürünler)
- [ ] Cayma hakkının kullanım şartları
- [ ] **Cayma hakkının OLMАDIĞI durumlar için açık bildirim**
- [ ] Cayma hakkı varsa kullanım formu / iletişim bilgisi

### 2.5 Şikayet ve Uyuşmazlık
- [ ] Tüketici hakem heyetine başvuru bilgisi
- [ ] Tüketici mahkemeleri bilgisi
- [ ] Şikayet iletişim bilgisi

---

## 3. HeroKidStory İçin Form Tasarımı

### 3.1 Sipariş Bazlı Dinamik Form

Ön bilgilendirme formu, **her siparişe özel** bilgileri içermelidir. Bunu statik bir sayfa olarak değil, checkout'ta dinamik olarak göstermek en doğrusu.

```
Örnek: Kullanıcı "Orman Macerası" e-book satın alırken form şunu göstermeli:

ÜRÜN BİLGİSİ
─────────────────────────────────────────────────
Ürün Adı    : Orman Macerası — Kişisel E-Kitap (24 sayfa)
Ürün Türü   : Dijital İndirilebilir İçerik
Fiyat       : 149,90 TL (KDV dahil)
Teslimat    : Ödeme onayı sonrası hesabınızda anında hazır

CAYMA HAKKI
─────────────────────────────────────────────────
⚠️ Bu sipariş dijital içerik içerdiğinden ve siz teslimatın
hemen başlamasına onay verdiğinizden, Mesafeli Sözleşmeler 
Yönetmeliği Madde 15/1-ğ kapsamında CAYMA HAKKINI 
KULLANAMAZSINIZ.
```

### 3.2 UI Önerisi: Checkout Akışı

```
[Sipariş Özeti]
   ↓
[Ödeme Bilgileri Girişi]
   ↓
[Ön Bilgilendirme Formu — Modal veya Accordion]
   ↓  
   ☑ Ön Bilgilendirme Formu'nu okudum ve anladım    ← ZORUNLU
   ☑ Mesafeli Satış Sözleşmesi'ni okudum ve kabul ettim  ← ZORUNLU
   ☑ Dijital içerik için cayma hakkımın olmadığını kabul ediyorum ← e-book için ZORUNLU
   ↓
[Ödemeyi Tamamla] ← Yukarıdaki checkbox'lar doldurulmadan disabled
```

---

## 4. Sayfasının Statik mi Dinamik mi Olması Gerektiği?

### Seçenek A: Checkout İçinde Modal/Panel (Önerilen)
- Her sipariş için özgün bilgileri gösterir
- Yasal olarak daha güçlü (kişiye özel bilgilendirme)
- Kullanıcı deneyimi daha iyi (ayrı sekme açmıyor)

### Seçenek B: Statik Sayfa (`/on-bilgilendirme`)
- Genel bilgilendirme içerir
- Dinamik ürün detayları eksik olur
- Daha az yasal güvence

### Öneri
**İkisini birlikte kullan:**
- Checkout'ta dinamik modal: Siparişe özel bilgiler
- `/on-bilgilendirme` statik sayfası: Genel bilgiler + footer linki

---

## 5. Kayıt Altına Alma Zorunluluğu

Yönetmelik gereği satıcı, ön bilgilendirme yapıldığını **ispatlayabilmelidir.**

### Teknik Gereksinimler

```typescript
// orders tablosunda tutulması gerekenler:
{
  preliminary_info_shown_at: Date,      // Formun gösterildiği an
  preliminary_info_accepted_at: Date,   // Kullanıcının onay verdiği an
  preliminary_info_version: string,     // Form versiyonu
  preliminary_info_content_hash: string // Form içeriğinin hash'i (değişmezlik kanıtı)
}
```

### E-posta ile Gönderim
- Ön bilgilendirme formu içeriği, sipariş onay e-postasına **PDF eki** olarak eklenmeli
- Veya e-postanın gövdesinde tablo formatında yer almalı

---

## 6. Örnek Senaryo: E-Book Satın Alımı

```
SENARYO: Kullanıcı 149 TL'lik e-book satın alıyor

1. Kullanıcı "Satın Al" butonuna tıklar
2. Sistem checkout ekranını açar
3. Ödeme bilgileri girilir
4. [ÖN BİLGİLENDİRME PANEL AÇILIR]:
   ─────────────────────────────────
   HeroKidStory — Ön Bilgilendirme Formu
   
   SATICI: [Şirket Adı], [Adres], [İletişim]
   
   ÜRÜN: Kişisel E-Kitap — "Orman Macerası"
   FİYAT: 149,90 TL (KDV %20 dahil: 24,98 TL)
   TESLİMAT: Anında dijital erişim
   
   CAYMA HAKKI YOKTUR — Bu ürün dijital içeriktir...
   ─────────────────────────────────
   ☑ Okudum, anladım
   
5. Kullanıcı checkbox'ı işaretler
6. "Ödemeyi Tamamla" aktif olur
7. Ödeme tamamlanır
8. Sipariş onay e-postası gönderilir (ön bilgilendirme içeriği dahil)
```

---

## 7. Sık Yapılan Hatalar

| Hata | Sonucu |
|------|--------|
| Form gösterilmiyor, direkt ödeme alınıyor | Sözleşme hukuken kurulmamış sayılabilir |
| Statik sayfa var ama kullanıcıdan onay alınmıyor | İspat edilemez |
| Formda cayma hakkı istisnası belirtilmiyor | Dijital ürün iade taleplerine karşı savunmasız |
| Kayıt tutulmuyor (log/timestamp) | Uyuşmazlıkta kanıt sorunu |
| Sadece Türkçe, İngilizce yok | Yabancı kullanıcı şikayeti riski |

---

## 8. Diğer Ülkeler İçin Not

HeroKidStory TR dışında da satış yapıyorsa:

| Pazar | Gereklilik |
|-------|-----------|
| **AB (GDPR kapsamı)** | Consumer Rights Directive (2011/83/EU) — benzer ön bilgilendirme zorunluluğu |
| **ABD** | Eyalete göre değişir; FTC kuralları geçerli |
| **Diğer** | Yerel hukuka göre değerlendir |

Öneri: Şimdilik TR odaklı hazırla, AB uyumunu sonraki fazda ekle.

---

## 9. Sonraki Adımlar

- [ ] Şirket bilgilerini tamamla
- [ ] Avukat ile formun içeriğini hazırla (MSS ile aynı avukat)
- [ ] Checkout flow'a dinamik modal tasarla
- [ ] `orders` tablosuna kayıt alanları ekle
- [ ] Sipariş onay e-postasına form içeriğini ekle

---

> **Uyarı:** Bu analiz, avukatlık hizmeti değildir. Nihai metin mutlaka lisanslı bir avukat tarafından hazırlanmalı ve onaylanmalıdır.
