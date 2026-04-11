# ETBİS Kaydı — Analiz ve Başvuru Rehberi

**Öncelik:** 🔴 FAZ 1 — En Yüksek (E-ticaret başlamadan zorunlu)  
**Kapsam:** 🇹🇷 Türkiye'de e-ticaret yapan tüm işletmeler  
**Yasal Dayanak:** 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun, ETBİS Yönetmeliği  
**Ceza Riski:** 79.230 TL – 396.150 TL (2025-2026 güncel tutar)

---

## 1. ETBİS Nedir?

**ETBİS (Elektronik Ticaret Bilgi Sistemi)**, T.C. Ticaret Bakanlığı tarafından yönetilen, Türkiye'de e-ticaret yapan tüm işletmelerin kayıtlı olması gereken resmi bilgi sistemidir.

ETBİS, e-ticaret ekosistemini izlemek, şeffaflık sağlamak ve tüketiciyi korumak amacıyla kurulmuştur.

---

## 2. HeroKidStory ETBİS'e Kayıt Olmak Zorunda Mı?

**Kısa cevap: EVET — Zorunlu.**

### Neden Zorunlu?

HeroKidStory şu özelliklere sahip:

| Kriter | HeroKidStory | ETBİS Zorunluluğu |
|--------|-------------|-------------------|
| Kendi e-ticaret sitesi var | ✅ herokidstory.com | ✅ Zorunlu |
| İnternet üzerinden satış yapıyor | ✅ | ✅ Zorunlu |
| Faaliyet kodu 479114 | ✅ (vergi levhasında) | ✅ Zorunlu |
| Şahıs şirketi | ✅ | ✅ Muafiyet yok |

**Vergi levhasındaki faaliyet kodu zaten doğru:** `479114 — Radyo, TV, Posta Yoluyla veya İnternet Üzerinden Yapılan Perakende Ticaret` — bu ETBİS için en uygun koddur.

### Muafiyet Var Mı?

Sadece pazaryerlerinde (Trendyol, Hepsiburada) satış yapıp **kendi sitesi olmayan** işletmeler için muafiyet söz konusu olabilir. HeroKidStory kendi sitesi üzerinden satış yaptığı için **muafiyet yok.**

---

## 3. Kayıt Yapmamanın Riskleri

| Yaptırım | Miktar / Açıklama |
|----------|------------------|
| İdari para cezası (1. ihlal) | **79.230 TL** |
| İdari para cezası (tekrar ihlal) | **396.150 TL** |
| Cezanın her yıl artması | TÜFE + ÜFE ortalaması ile güncelleniyor |
| Bakanlık denetimi | E-ticaret siteleri periyodik olarak kontrol ediliyor |
| Ödeme sağlayıcısı (İyzico) | Uyumsuz siteler bildirilebilir |

---

## 4. ETBİS Kaydı İçin Gerekenler

### 4.1 Ön Koşullar (Bunlar Zaten Var ✅)

- [x] Vergi mükellefi olmak (İşe başlama: 02.03.2026 ✅)
- [x] Vergi Kimlik Numarası: 6130979062 ✅
- [x] e-Devlet şifresi veya e-İmza

### 4.2 Başvuruda Kullanılacak Bilgiler

| Alan | Değer |
|------|-------|
| Mükellefiyet Türü | Gerçek Kişi (Şahıs) |
| Ad Soyad | Cüneyt Medetoğlu |
| Vergi Kimlik No | 6130979062 |
| Vergi Dairesi | Tunceli Vergi Dairesi |
| Adres | Atatürk Mah. Merkez İsimsiz91 Sk. Dema İnş B Blok No: 4/1 İç Kapı No: 3 Merkez / Tunceli |
| Telefon | +90 542 520 92 52 |
| E-posta | info@herokidstory.com |
| Site URL | https://herokidstory.com |
| Faaliyet Kodu | 479114 |
| Hizmet Türü | Elektronik hizmet satışı (dijital ürün) + Fiziksel ürün (basılı kitap) |

---

## 5. Başvuru Adımları

### Adım 1: e-Devlet veya e-İmza ile Giriş
- URL: [https://etbis.eticaret.gov.tr](https://etbis.eticaret.gov.tr)
- TC Kimlik No + e-Devlet şifresi ile giriş yapılır

### Adım 2: "Yeni Kayıt" Oluştur

Formda doldurulacak bilgiler:
```
Mükellefiyet Türü    : Gerçek Kişi
Ad / Soyad          : Cüneyt Medetoğlu
VKN                 : 6130979062
Faaliyet Kodu       : 479114
Hizmet Kanalı       : Web Sitesi
Hizmet Adresi (URL) : https://herokidstory.com
İletişim E-posta    : info@herokidstory.com
```

### Adım 3: Alan Adı Doğrulama
Sistem, başvurduğun alan adının (herokidstory.com) sana ait olduğunu doğrulamak isteyebilir. Bunun için:
- Siteye özel bir meta tag eklenmesi veya
- DNS TXT kaydı yapılması istenebilir

### Adım 4: Onay
Başvuru genellikle **birkaç iş günü** içinde onaylanır. Onay sonrası ETBİS No alırsın.

### Adım 5: Siteye ETBİS Bilgisi Ekleme
Kanun gereği site footer'ına ETBİS numarası ve Ticaret Bakanlığı logosu/linki eklenmeli:

```html
<!-- Footer'a eklenecek -->
<p>
  ETBİS No: [ETBİS_NO] | 
  <a href="https://www.eticaret.gov.tr" target="_blank">
    T.C. Ticaret Bakanlığı
  </a>
</p>
```

---

## 6. ETBİS Kaydından Sonra Yapılması Gerekenler

### 6.1 Yıllık Bildirim Yükümlülüğü
ETBİS'e kayıt olduktan sonra her yıl faaliyet bilgilerini güncelleme yükümlülüğü var:
- Yıllık net işlem hacmi
- İşlem adedi
- Hizmet sağlanan kişi sayısı

Bu bilgiler bir sonraki yılın Şubat ayına kadar sisteme girilmeli.

### 6.2 Sitede Zorunlu Bilgiler
6563 sayılı Kanun Madde 3 gereği e-ticaret sitesinde görünür şekilde bulunması zorunlu:

| Bilgi | Mevcut Durum | Yapılacak İşlem |
|-------|-------------|----------------|
| Şirket adı / satıcı adı | Yok | Footer'a ekle |
| İletişim bilgileri (tel + e-posta) | Yok (footer'da sadece linkler) | Footer'a ekle |
| Açık adres | Yok | Footer'a veya /contact'a ekle |
| Vergi dairesi ve no | Yok | Footer'a ekle |
| ETBİS numarası | Yok (henüz alınmadı) | Kayıt sonrası ekle |

---

## 7. Yazılımsal Gereksinimler (Footer Güncellemesi)

Mevcut `Footer.tsx`'e eklenecek bilgiler:

```tsx
{/* Legal & Company Info - Yasal Zorunluluk */}
<div className="text-xs text-gray-500 dark:text-slate-500 text-center mt-4">
  <p>Cüneyt Medetoğlu — Şahıs İşletmesi</p>
  <p>Atatürk Mah. Merkez İsimsiz91 Sk. Dema İnş B Blok No: 4/1 İç Kapı No: 3 Merkez / Tunceli</p>
  <p>Tel: +90 542 520 92 52 | E-posta: info@herokidstory.com</p>
  <p>Vergi Dairesi: Tunceli | VKN: 6130979062</p>
  <p>ETBİS No: [ETBİS_NO_BURAYA] | 
    <a href="https://www.eticaret.gov.tr" target="_blank">T.C. Ticaret Bakanlığı</a>
  </p>
</div>
```

Bu bilgilerin i18n anahtarlarını eklemek yerine, yasal bilgiler her dilde aynı kalacağından sabit metin olarak yazılabilir.

---

## 8. Zaman Çizelgesi

```
Şu an (Nisan 2026)
  │
  ├─▶ ETBİS başvurusu yap (1 gün iş, kendin yapabilirsin)
  │     → etbis.eticaret.gov.tr
  │
  ├─▶ Onay bekleme süresi (2–5 iş günü)
  │
  ├─▶ ETBİS No alındı → Footer'a ekle
  │
  ├─▶ MSS + ÖBF avukata gönder (paralel yürüt)
  │
  └─▶ Ödeme sistemi aktive et
```

---

## 9. Sık Sorulan Sorular

**S: Yurt dışına satış yapıyorum, ETBİS gerekli mi?**  
C: Evet. ETBİS, Türkiye'de faaliyet gösteren (Türk vergi mükellefi olan) işletmeler için zorunludur. Müşterinin nerede olduğu önemli değil.

**S: Şahıs şirketi olarak ETBİS'e kayıt olabilir miyim?**  
C: Evet, şahıs işletmeleri de ETBİS'e kayıt olmak zorundadır ve kayıt olabilir.

**S: Siteye ETBİS numarasını koymam zorunlu mu?**  
C: Evet, 6563 sayılı Kanun kapsamında zorunludur.

**S: Her yıl yenilemek gerekiyor mu?**  
C: Yenileme değil, yıllık faaliyet bildirimi gerekiyor. Şubat ayına kadar yapılmalı.

**S: Faaliyet kodum 479114 e-ticaret için doğru mu?**  
C: Evet, tam olarak internet üzerinden perakende ticaret kodu. ETBİS için idealdir.

---

## 10. Özet: Aksiyon Planı

- [ ] **[Öncelik 1]** etbis.eticaret.gov.tr'ye gir, başvuruyu yap (e-Devlet şifresi ile)
- [ ] ETBİS onayını bekle (2–5 iş günü)
- [ ] ETBİS No'yu `Footer.tsx`'e ekle
- [ ] Footer'a yasal bilgileri (şirket adı, adres, VKN) ekle
- [ ] `LEGAL_OVERVIEW.md`'yi ETBİS No ile güncelle

---

> **Not:** ETBİS kaydı tamamen ücretsizdir ve genellikle e-Devlet şifresi ile kendin yapabilirsin. Herhangi bir avukat veya danışman gerektirmez.
