# Örnek Kitap Sayfası – Gerçek Olmayan Çocuk Görselleri

**Amaç:** [magicalchildrensbook.com/ideas](https://magicalchildrensbook.com/ideas) benzeri bir "Ideas / Example book" sayfası için, AI'ın 12 sayfalık hikayeyi güzel üretebilmesine **fikir** verecek örnek kitaplar oluşturmak.  
**Kaynak:** Bu örnekler [story-ideas-helper.html](/public/story-ideas-helper.html) ile üretilecek (kategori, yaş, karakterler → TITLE + EXAMPLE STORY).

**İhtiyaç:** Her fikir kartında **yaş grubuna uygun**, **gerçek çocuk fotoğrafı gibi görünen** (fotogerçekçi) bir görsel. Bu görseller **gerçek bir kişiye ait olmamalı** veya **ticari kullanımı serbest** olmalı (telif sorunu olmasın).  
**Akış:** Görselleri aşağıdaki **ücretsiz sitelerden** indirip seçiyorsun; sonra bunları mevcut pipeline ile illüstrasyona dönüştürüyorsun.

---

## Neden "gerçek olmayan" veya lisanslı görsel?

| Sebep | Açıklama |
|-------|----------|
| **Gizlilik / consent** | Gerçek çocuk fotoğrafları için ebeveyn izni, KVKD/COPPA vb. yükümlülükler. |
| **Telif** | Ticari kullanım için lisans veya "free for commercial use" gerekir. |
| **Tutarlılık** | Örnek kitaplar "kendi çocuğunu yükleyeceği" akışı tanıtıyor; placeholder görseller uygun lisanslı olmalı. |

**Hedef:** Gerçek çocuk fotoğrafı gibi görünen, **ücretsiz indirilebilen** veya **ticari kullanımı açık** görseller. Sen bakıp seçeceksin; sonra illüstrasyona çevireceksin.

---

## Web sitesinde kullanım – dikkat (emin olmak için)

**Bu doküman hukuki tavsiye değildir.** Web sitende (ticari veya kişisel) kullanmadan önce şunları kendin doğrula:

1. **Lisans:** Her sitenin **güncel lisans / terms of use** sayfasını oku. "Free" bazen sadece kişisel kullanım içindir; **ticari kullanım** (reklam, ürün satışı, web sitesi) için ayrıca izin gerekebilir.
2. **Çocuk fotoğrafları – model release:** Sitede "commercial use" yazsa bile, **gerçek bir çocuğun yüzü** fotoğrafta ise birçok ülkede **model release** (ve çocuklar için ebeveyn izni) gerekebilir. Pexels/Unsplash/Pixabay gibi siteler çoğu fotoğraf için "model release yok" veya "release bilgisi yok" der; bu durumda ticari web sitende kullanmak **riskli** olabilir.
3. **Ne yapmalı?**  
   - Sadece **açıkça "model released" / "release on file"** işaretli görselleri seçmek, veya  
   - Görseli **illüstrasyona çevirdikten** sonra kullanmak (dönüştürülmüş görsel genelde “gerçek kişi” sayılmaz; yine de kullanım koşullarını kontrol et), veya  
   - Şüphen varsa **avukat veya hukuk danışmanı** ile netleştirmek.

**Özet:** "Ücretsiz indirdim" tek başına web sitende kullanmanın uygun olduğunu **garanti etmez**. Lisans + (çocuk yüzü varsa) model release bilgisini her siteden kontrol et; emin değilsen illüstrasyona çevirip kullanmak veya hukuki görüş almak daha güvenli.

---

## Ücretsiz (free) siteler – görsel indir

Aşağıdaki siteler **ücretsiz** stok fotoğraf sunar. İndirmeden ve **web sitende kullanmadan** önce her sitede **lisans / commercial use** ve (çocuk portresi ise) **model release** açıklamasını oku.

| Site | URL | Arama önerisi | Not |
|------|-----|----------------|------|
| **Pexels** | [pexels.com](https://www.pexels.com) | "child portrait", "toddler", "baby face", "kid portrait" | Ücretsiz, ticari kullanım genelde serbest. Lisans sayfasını kontrol et. |
| **Unsplash** | [unsplash.com](https://unsplash.com) | "child portrait", "toddler portrait", "baby" | Ücretsiz. Model release bilgisi varsa oku. |
| **Pixabay** | [pixabay.com](https://pixabay.com) | "child", "toddler", "baby portrait", "kid" | Ücretsiz; atıf zorunlu değil; "modify/adapt" serbest. [Lisans özeti](https://pixabay.com/service/license-summary/): standalone satış yasak, tanınabilir kişi içerikte ek dikkat; üçüncü kişi izni gerekip gerekmediğini kontrol etmek kullanıcı sorumluluğunda. |
| **Reshot** | [reshot.com](https://www.reshot.com) | "child", "toddler", "baby" | Ücretsiz grafik ve fotoğraf; lisansı kontrol et. |
| **Burst (Shopify)** | [burst.shopify.com](https://burst.shopify.com) | "child", "kids", "portrait" | Ücretsiz e-ticaret odaklı stok; ticari kullanım uygun. |
| **StockSnap** | [stocksnap.io](https://stocksnap.io) | "child portrait", "toddler", "baby" | CC0 / free to use; kaynak belirtme gereksiz olabilir, sayfaya bak. |
| **Freepik** | [freepik.com](https://www.freepik.com) | "child portrait", "baby photo", "toddler" | Ücretsiz seçenekler var; bazen attribution gerekir, lisansı oku. |
| **Kaboompics** | [kaboompics.com](https://kaboompics.com) | "child", "kid", "baby" | Ücretsiz; kişisel ve ticari kullanım. |

**Pratik:** Önce **Pexels** ve **Pixabay** dene (çoğu görsel ticari kullanıma açık). Yaş gruplarına göre (0-1, 1-2, 2-3, 3-5, 5-7, 7+) arama yap; beğendiğin görselleri indirip `public/example-book-portraits/` klasörüne kaydet.

---

## Kayıt klasörü ve isimlendirme

- **Klasör:** `public/example-book-portraits/`  
  Detay: [public/example-book-portraits/README.md](/public/example-book-portraits/README.md)
- **İsimlendirme (isteğe bağlı):** `{yas}_{cinsiyet}_{kisa_aciklama}.jpg`  
  Örnek: `3-5_girl_portrait.jpg`, `1-2_boy_toddler.jpg`

Sen bakıp seçeceğin için dosya adını kendi sistemine göre verebilirsin; sadece aynı klasöre koyman yeterli.

---

## Nasıl kullanacaksın?

1. **Görsel seç:** Yukarıdaki ücretsiz sitelerden 0-1, 1-2, 2-3, 3-5, 5-7, 7+ yaş gruplarına uygun portreleri indir; `public/example-book-portraits/` içine kaydet.  
2. **Illüstrasyona çevir:** Bu fotoğrafları mevcut pipeline ile illüstrasyona dönüştür; örnek kitap kartlarında illüstrasyon halini kullan.  
3. **Story Ideas Helper:** [story-ideas-helper.html](/public/story-ideas-helper.html) ile TITLE + EXAMPLE STORY al; her fikir kartında ilgili yaş grubu görselini göster.  
4. **Lisans:** Kullandığın her görselin kaynağını ve lisansını not et (hangi siteden, commercial use açık mı).

---

## Kısa checklist

- [ ] 6 yaş grubu (0-1, 1-2, 2-3, 3-5, 5-7, 7+) için ücretsiz sitelerden görsel seçildi  
- [ ] Görseller `public/example-book-portraits/` klasörüne kaydedildi  
- [ ] Ticari kullanım / lisans kontrol edildi  
- [ ] Bu fotoğraflar illüstrasyona dönüştürülecek (pipeline ile)  
- [ ] Story-ideas-helper çıktıları (TITLE + EXAMPLE STORY) ile eşleştirildi  

İlgili dokümanlar: [DOCUMENTATION_MAP.md](/docs/DOCUMENTATION_MAP.md), [EXAMPLE_BOOKS_CUSTOM_REQUESTS.md](/docs/strategies/EXAMPLE_BOOKS_CUSTOM_REQUESTS.md).
