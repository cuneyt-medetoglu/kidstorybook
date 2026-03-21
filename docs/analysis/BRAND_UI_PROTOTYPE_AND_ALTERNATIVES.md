# Marka alanı (logo + wordmark) — Prototip yöntemi ve alternatifler

**Tarih:** 21 Mart 2026  
**Durum:** **Uygulandı** — “Karar özeti” `BrandWordmark` + Header/Footer/mobil drawer’da. Geçici statik HTML önizleme dosyası repo’dan kaldırıldı.

---

### Karar özeti (onaylı)

| Konu | Karar |
|------|--------|
| **Header / Footer / mobil menü wordmark** | **`/brand.png` kullanılmaz.** Üç parça **metin**: `Hero` · `Kid` · `Story` (birleşik okunuş “HeroKidStory”). Yanında **`/logo.png`** (ikon) kalabilir. |
| **Renkler** | **`brand.png` dosyasındaki wordmark ile aynı tonlar** hedeflenir (ölçülen örnek: **Hero + Story** `#29b5a8`, **Kid** `#1ba8e0`). Uygulamada önce **yalnızca bu marka metnine** bu hex’ler (veya `brand.png` ile piksel eşleştirme sonrası ince ayar); tüm site `primary` / `brand-2` token’ları **otomatik değişmez** (istisna ayrı karar). |
| **`public/brand.png`** | **Saklanır** — Open Graph / Twitter görseli, paylaşım ve pazarlama için ([lib/metadata.ts](../../lib/metadata.ts) vb.). UI shell’de wordmark görseli olarak **kullanılmaz**. |

**Eski not:** Aşağıdaki bölümler (prototip HTML, tartışma eksenleri) tarihsel / isteğe bağlı süreç içindir; **ürün kararı** yukarıdaki tablodur.

---

## 1. Bağlam

- v0.app ile istenen sonuç tutarlı alınamadı (sandbox, keşif döngüsü, asset algısı).
- İstenen: marka alanında **daha güçlü bir UI**; önce prototip / tartışma, sonra uygulama.
- **Yön (kararla uyumlu):** Shell’de **ikon (`/logo.png`) + üç parçalı metin wordmark**; renkler `brand.png` ile aynı tonlar (üstteki tablo). **`/brand.png`** yalnızca OG / paylaşım vb. için kalır.

---

## 2. Bu repoda (Cursor) neler yapılabilir?

| Ne | Açıklama |
|----|----------|
| **Statik HTML prototip** | `public/` altında tek veya birkaç HTML dosyası: gerçek `logo.png` / `brand.png` yollarıyla (`/logo.png`, `/brand.png`) tarayıcıda açılır; Next çalışırken `localhost` üzerinden görüntülenir. |
| **Birden fazla varyant** | Aynı dosyada **A / B / C** bölümleri veya `brand-preview-a.html`, `brand-preview-b.html` gibi ayrı sayfalar. |
| **Tasarım kararı** | Sen ekranda karşılaştırırsın; hangi blok (düzen, boşluk, çerçeve, hover) hoşuna giderse **onu** React’e taşırız. |
| **Uygulama entegrasyonu** | Onay sonrası: `components/brand/` veya doğrudan `Header.tsx` / `Footer.tsx` — `next/image`, `@/i18n/navigation` Link, dark mode, mevcut token’lar (`primary`, `brand-2`). |

**Yapamayacağım şeyler (net):** Gerçek “Figma” dosyası export etmek; tarayıcı dışı tasarım aracı. Ama HTML + CSS ile **görsel karar** vermene yetecek prototip üretebilirim.

---

## 3. Önerilen yöntem: “Ana sayfa kopyası gibi” HTML

**Fikir:** Üretim koduna dokunmadan, **yalnızca üst şerit + marka bloğu** (ve isteğe bağlı açık renk / koyu arka plan örneği) içeren hafif bir sayfa.

- **Artıları:** Hızlı, geri alması kolay, PR’da tek seferde “sadece preview dosyası” olarak görünür; v0 bağımlılığı yok.  
- **Eksileri:** i18n, `next-intl`, gerçek Header’daki tüm nav bu HTML’de olmayabilir — ama **marka alanı odaklı** olduğu için bu genelde kabul edilebilir.

**Örnek dosya adları (gelecekte benzer süreç için):**

- `public/` altında tek sayfa veya `public/brand-previews/index.html` gibi hafif bir indeks — üretim kodundan ayrı tutulur; karar sonrası silinebilir.

---

## 4. Alternatif tasarım eksenleri (tartışma için)

Aşağıdakilerden hangilerinin öncelikli olduğunu sen netleştirirsin; prototipte bunlara göre 2–3 farklı blok üretilir:

1. **Kompozisyon:** Sadece yan yana mı, hafif “pill” / kart içinde mi, ince ayırıcı çizgi mi?  
2. **Boyut:** Header’da marka ne kadar “yüksek” hissedilsin (yükseklik hedefi)?  
3. **Dark mode:** Aynı blok koyu zeminde de örneklenmeli mi?  
4. **Footer:** Header ile aynı kilit mi, yoksa sadece `brand.png` (daha küçük) mü?

---

## 5. Süreç (onay akışı)

1. **Bu dokümanda** yöntem ve eksenler netleşir (yorum / düzenleme).  
2. Sen **“prototip HTML’i üret”** dersen → `public/` altına statik önizleme(ler) eklenir (Next’e dokunmadan veya minimal).  
3. Tarayıcıda bakıp **bir varyant seçersin** (veya “şu blok + şu spacing” birleşimi).  
4. **Onay:** Seçilen tasarım `Header` / `Footer` (ve mobil drawer) ile **gerçek bileşenlere** aktarılır.  
5. İsteğe bağlı: Preview HTML dosyası silinir veya `docs/` notu ile arşivlenir.

---

## 6. Sonuç

Bu yöntem **mantıklı ve düşük riskli**: önce görsel karar, sonra uygulama. v0’a göre **kontrol sende** ve repo ile **aynı asset yolları** kullanılır.

**Senden beklenen (kısa):**  
- Bu akış uygun mu?  
- Prototipte kaç alternatif (2 mi 3 mü)?  
- Tek dosyada mı, ayrı HTML’ler mi tercih edersin?

Onaydan sonra bir sonraki adım: statik HTML prototip üretimi (bu dosyada veya PR açıklamasında hangi dosyaların eklendiği belirtilir).

---

## 7. Wordmark: `brand.png` mi, metin mi? (senin soruna yanıt)

### Mantıklı mı “görsel wordmark” kullanmamak?

**Evet, header/footer için metin kullanmak mantıklı olabilir:**

| Metin (3 span) | Görsel (`brand.png`) |
|----------------|----------------------|
| Her çözünürlükte keskin, ölçekleme kolay | Küçük ekranda `max-width` / `object-contain` ile ince ayar gerekir |
| Daha hafif (ekstra büyük PNG isteği yok) | Tek dosyada tüm stil; ama dosya boyutu ve retina |
| Marka adı ekran okuyucu / arama için net | Alt metin tek satırda “HeroKidStory” |

**`public/brand.png` yine “doğru” dosya:** Paylaşım önizlemesi, e-posta, belki PDF / basılı — yani **görsel kilit** olarak projede kalmalı. Sorun “yanlış dosya” değil; **nerede hangi medyayı kullandığımız** kararı.

### Referanstaki renkler vs şu anki site token’ları

Referans görseldeki yaklaşık tonlar (ölçümlenmiş örnek):

- **Hero + Story:** ~`#29b5a8` (daha açık / canlı bir teal)
- **Kid:** ~`#1ba8e0` (gökyüzü mavisi)

Projede [LOGO_BRIEF_AND_PROMPTS.md](./LOGO_BRIEF_AND_PROMPTS.md) / design token tarafında sık geçen:

- Teal **`#14b8a6`**, cyan **`#06b6d4`**

Yani **aynı aile, farklı ton.** “Referans görseldeki gibi” dersen uygulamada iki yol:

1. **Sadece wordmark span’larına** sabit hex (ör. Tailwind `text-[#29b5a8]` / `text-[#1ba8e0]`) — **tüm site paletini değiştirmez**, risk düşük.  
2. **`globals.css` / token’ları** bu yeni teal–maviye çekmek — **butonlar, linkler, gradient’ler** de etkilenir; bilinçli karar gerekir.

**Öneri (analiz aşaması):** Önce (1); marka metni referansa yakınsın. Tüm ürün rengi değişsin istenirse (2) ayrı tartışılır.

### Dark mode

Referans **siyah zemin** üzerinde; header’da çoğunlukla **açık veya slate** zemin var. Aynı hex’ler dark arka planda yeterli kontrast vermeyebilir; uygulama aşamasında **`dark:`** ile bir tık daha açık ton veya mevcut `primary` / `brand-2` ile hizalama düşünülür.

### Özet cümle

**Onaylandı:** Header / footer / mobil menüde wordmark **metin** + renkler **`brand.png` ile aynı ton** (Hero/Story `#29b5a8`, Kid `#1ba8e0` — gerekirse görsele göre ± ince ayar). **`brand.png`** yalnızca OG / paylaşım vb.; shell UI’da **kullanılmaz**.

**Sonraki adım (kod):** `Header.tsx`, `Footer.tsx` (ve mobil drawer) içinde mevcut gradient tek kelime veya `brand` görseli varsa **üç span + belirtilen hex** ile değiştirilir; dark mode için `dark:` varyantı kontrol edilir.
