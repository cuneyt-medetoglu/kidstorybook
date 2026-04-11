# Mesafeli Satış Sözleşmesi — Analiz ve Hazırlık Rehberi

**Öncelik:** 🔴 FAZ 1 — En Yüksek (Ödeme başlamadan zorunlu)  
**Kapsam:** 🇹🇷 Sadece Türkiye'deki tüketiciler (Türk tüketici hukuku)  
**Bağlantılı Belgeler:** [Ön Bilgilendirme Formu Analizi](./02_ON_BILGILENDIRME_FORMU_ANALIZ.md) | [MSS Taslağı](./TASLAK_MESAFELI_SATIS_SOZLESMESI.md)  
**Yasal Dayanak:** 6502 sayılı TKHK, Mesafeli Sözleşmeler Yönetmeliği (27.11.2014 tarih, 29188 sayılı RG)  
**Şirket Tipi:** Şahıs şirketi

> **NOT:** MSS sadece Türkiye'deki tüketicilere uygulanır. Global e-book satışları için ayrıca İngilizce **Terms of Sale** gerekecektir (Faz 2). Basılı kitap zaten sadece TR'de satılıyor.

---

## 1. Bu Nedir ve Neden Zorunlu?

Mesafeli Satış Sözleşmesi (MSS), fiziksel olarak bir arada bulunmaksızın (internet üzerinden) gerçekleştirilen satışlarda **Türk hukuku tarafından zorunlu tutulan** bir sözleşme türüdür.

### Yasal Yükümlülük
- **6502 sayılı Tüketicinin Korunması Hakkında Kanun (TKHK)** — Madde 48
- **Mesafeli Sözleşmeler Yönetmeliği** — Madde 4, 5, 6, 7, 8

### Bu olmadan ne olur?
- Tüketici sözleşmeyi geçersiz sayabilir
- BTMK (Ticaret Bakanlığı) denetiminde idari para cezası
- Tüketici mahkemesi kararlarında platform aleyhine sonuç
- Ödeme sağlayıcısı (İyzico) entegrasyon gerekliliklerinde sorun çıkabilir

---

## 2. Mesafeli Satış Sözleşmesinde ZORUNLU Olan Maddeler

Yönetmelik Madde 5 gereği sözleşmede bulunması gereken bilgiler:

### 2.1 Satıcı Bilgileri
- [ ] Şirket unvanı (tüzel kişi ise)
- [ ] Ad, soyad (şahıs ise)
- [ ] Açık adres (tebligat adresi)
- [ ] Telefon numarası
- [ ] E-posta adresi
- [ ] Varsa MERSİS numarası

> **HeroKidStory için:** Şahıs şirketi olarak ad-soyad, adres, vergi dairesi/no ve varsa MERSİS no yazılacak. Şahıs işletmelerinde TC kimlik no aynı zamanda vergi no olarak kullanılır.

### 2.2 Ürün/Hizmet Bilgileri
- [ ] Ürünün/hizmetin temel nitelikleri
- [ ] Toplam fiyat (vergiler dahil)
- [ ] Ödeme bilgileri
- [ ] Teslimat bilgileri (dijital ürün için: indirme yöntemi, süre)

### 2.3 Cayma Hakkı Bilgileri
- [ ] Cayma hakkının var olup olmadığı
- [ ] Varsa süresi (14 gün)
- [ ] Cayma formunun nasıl kullanılacağı
- [ ] **Cayma hakkının olmadığı durumlarda açık beyan**

### 2.4 Sözleşmenin Süresi ve Uzatılması
- [ ] Abonelik ise: Otomatik uzatma bilgisi
- [ ] İptal koşulları

---

## 3. HeroKidStory'ye Özel Durumlar

### 3.1 Dijital Ürün İstisnası (KRİTİK)
**Yönetmelik Madde 15/1-ğ:** Tüketicinin onayıyla ifaya başlanan ve cayma hakkı kullanılamayacağına dair bilgilendirme yapılan **dijital içeriklerde cayma hakkı ortadan kalkar.**

E-book için uygulama:
```
Kullanıcı ödeme ekranında şunu onaylamalı:
"Dijital içeriğin (e-kitap) teslim sürecinin başlatılmasına 
onay veriyorum ve bu durumda 14 günlük cayma hakkımın 
ortadan kalkacağını kabul ediyorum."
```
Bu onay checkbox olarak checkout flow'a eklenmeli ve loglanmalı.

### 3.2 Kişiselleştirilmiş Ürün İstisnası
**Yönetmelik Madde 15/1-c:** Tüketicinin istekleri veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan mallar için cayma hakkı kullanılamaz.

Basılı kitap için bu istisna geçerli olabilir. Ancak:
- Sözleşmede açıkça belirtilmesi şart
- Avukat teyidi önerilir

### 3.3 Ürün Kategorileri ve Farklı Koşullar

| Ürün | Kategori | Cayma Hakkı | Notlar |
|------|---------|-------------|--------|
| E-book (dijital indirme) | Dijital içerik | ❌ Yok (onay sonrası) | Checkbox zorunlu |
| Basılı kitap | Fiziksel + kişiselleştirilmiş | ❌ Yok / Tartışmalı | Avukat kararı |
| Kredi/Paket satışı | Hizmet | Kısmen | Kullanılmayan kreditler? |
| Abonelik (varsa) | Sürekli hizmet | ✅ 14 gün | Otomatik uzatma bildirimi şart |

### 3.4 Fiyatlandırma: Çoklu Para Birimi
Sözleşmede belirtilmesi gerekenler:
- Satış para birimi (ödeme anındaki TRY, USD, EUR, GBP)
- Kur farkından doğabilecek farklılıklar
- KDV dahil/hariç net belirtim

---

## 4. Sözleşmenin Yapısı / Taslak İçerik Planı

```
MADDE 1 — TARAFLAR
  - Satıcı bilgileri
  - Alıcı bilgileri (ödeme formundan otomatik doldurulur)

MADDE 2 — KONU
  - Sipariş edilen ürün/hizmetin tanımı
  - Miktar, fiyat (KDV dahil), ödeme yöntemi

MADDE 3 — ÖDEME KOŞULLARI
  - Kullanılan ödeme altyapısı (İyzico)
  - 3D Secure bilgisi
  - Taksit seçenekleri (varsa)

MADDE 4 — TESLİMAT
  - E-book: Ödeme sonrası anında, dashboard üzerinden
  - Basılı: Tahmini üretim + kargo süresi

MADDE 5 — CAYMA HAKKI
  - Dijital ürünler için istisna ve onay metni
  - Kişiselleştirilmiş ürünler için istisna
  - Cayma formunu kullanma yöntemi (varsa)

MADDE 6 — GİZLİLİK VE KİŞİSEL VERİLER
  - KVKK kapsamında veri işleme (Gizlilik Politikası'na atıf)

MADDE 7 — UYUŞMAZLIK ÇÖZÜMÜ
  - Tüketici hakem heyeti
  - Tüketici mahkemeleri
  - Arabuluculuk (varsa)

MADDE 8 — GENEL HÜKÜMLER
  - Yürürlük tarihi
  - Değişiklik hakları
  - Geçerli hukuk: Türkiye Cumhuriyeti Hukuku
```

---

## 5. Sözleşmenin Teslim Şekli

Yönetmelik gereği sözleşme **kalıcı veri saklayıcısı** üzerinden tüketiciye iletilmeli:

### Zorunlu Olan:
- [ ] Ödeme tamamlandıktan sonra **e-posta ile PDF** gönderilmesi
- [ ] Dashboard'da **"Sözleşmemi İndir"** butonu
- [ ] Sözleşmenin tüketiciye iletildiğinin sisteme kaydedilmesi (log)

### Checkout Flow Entegrasyonu:
```
Checkout Ekranı:
  [✓] Mesafeli Satış Sözleşmesi'ni okudum ve kabul ediyorum  ← tıklanabilir link
  [✓] Ön Bilgilendirme Formu'nu okudum                      ← tıklanabilir link
  [✓] Dijital içerik için cayma hakkımın olmadığını anlıyorum (e-book için)
  
  → [Ödemeyi Tamamla] butonu bu 3 checkbox doldurulmadan aktif olmaz
```

---

## 6. Teknik Gereksinimler (Implementation)

### Database
```
orders tablosuna eklenecek alanlar:
- contract_accepted_at: timestamp
- contract_version: string (sözleşme versiyonu)
- preliminary_info_accepted_at: timestamp
- digital_waiver_accepted: boolean (e-book için)
- contract_sent_at: timestamp (e-posta gönderim zamanı)
```

### API
- `POST /api/payment/iyzico/initialize` → Checkbox onaylarını kaydet
- Ödeme tamamlanınca sözleşme PDF'ini e-posta ile gönder (Resend/email servis)

### Sayfa
- URL: `/mesafeli-satis-sozlesmesi`
- Dil: Türkçe zorunlu, İngilizce de eklenebilir
- Footer'a link eklenmeli

---

## 7. Sık Yapılan Hatalar

| Hata | Sonucu | Nasıl Önlenir |
|------|--------|---------------|
| Sözleşme yok ama ödeme alınıyor | İdari ceza, iptal riski | Faz 1'de mutlaka hazırla |
| Cayma hakkı istisnası onaylatılmıyor | Dijital ürün iade edilmek zorunda | Checkout'a checkbox ekle |
| E-posta ile iletilmiyor | Yükümlülük ihlali | Otomatik e-posta entegre et |
| Sözleşme versiyonlanmıyor | Değişiklik sonrası belirsizlik | `contract_version` alanı ekle |
| Sadece TR | Yabancı kullanıcı riski | EN çeviri de hazırla |

---

## 8. Sonraki Adımlar

- [ ] Şirket kuruluş/tescil bilgilerini hazırla
- [ ] Türk tüketici hukuku uzmanı avukat bul
- [ ] Bu analizi avukata vererek taslak sözleşme hazırlat
- [ ] Checkout flow'a checkbox entegrasyonu planla → [Payment Roadmap](../payment/PAYMENT_ROADMAP.md)
- [ ] E-posta gönderim sistemi (Resend) entegrasyonu planla

---

> **Uyarı:** Bu analiz, avukatlık hizmeti değildir. Nihai metin mutlaka lisanslı bir avukat tarafından hazırlanmalı ve onaylanmalıdır.
