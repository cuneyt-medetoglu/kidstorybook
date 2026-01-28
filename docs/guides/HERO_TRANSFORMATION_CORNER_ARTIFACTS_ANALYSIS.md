# Hero "Your Child, The Hero" – Köşe Beyazlığı / İz Analizi

**Tarih:** 27 Ocak 2026  
**Bölüm:** `HeroBookTransformation` – Real Photo ve Story Character kartları  
**Belirti:** Her iki kartın da **alt sol ve alt sağ köşelerinde** hilal/ark formunda, açık (beyaz/gri) ince izler.

---

## 0. Özet (Analiz Öncesi)

| Madde | Durum |
|-------|--------|
| **Geri alınan denemeler** | `overflow-clip`, container `bg-white`, `Image` + `rounded-xl`, footer opak + `rounded-b-xl` — **hepsi geri alındı.** Mevcut kod bu denemeleri içermiyor. |
| **Köşe izi** | Hâlâ var: alt iki köşede, görsel–footer birleşimine yakın, hilal/ark formunda açık iz. |
| **“Daha kötü”** | Yapılan köşe denemeleri geri alındı; eğer “daha kötü” navigation dot’larla ilgiliyse ayrıca geri alınabilir. |

**Öneri:** Önce **köşe izini** anlamak için yapısal bir deney (5.1: footer’ı dışarı al). İz devam ederse kaynak `img` + `overflow` + `rounded` kırpması; kaybolursa footer–görsel birleşimi veya yarı saydam footer.

---

## 1. Mevcut Yapı (Kısa)

```
Kart (overflow-hidden rounded-2xl, p-2, ring, bg-white/dark:bg-slate-800)
├── Label (Real Photo / Story Character)
├── İç frame (rounded-xl, overflow-hidden)
│   ├── [Real: bg-gradient gray | Character: absolute gradient div]
│   ├── Next/Image (fill, object-cover)
│   └── Footer (absolute bottom-0 left-0 right-0, bg-white/95, dark:bg-slate-800/95)
│       └── "Arya, Age 1" | "Magical Castle" + icon
└── Köşe süs (star/sparkles)
```

- **İç frame:** `rounded-xl` (12px), `overflow-hidden`. Görsel + footer bu div’in içinde.
- **Footer:** `absolute bottom-0 left-0 right-0`, dikdörtgen (üst kenar düz, yanlar düz, **altta yuvarlak yok**).
- **Görsel:** `position: absolute; inset: 0`, `object-fit: cover`.

**Mevcut kod doğrulama (geri alınmış denemeler yok):**

| Özellik | Şu an | Denemede vardı (geri alındı) |
|---------|-------|------------------------------|
| İç frame | `overflow-hidden rounded-xl` | `overflow-clip` |
| İç frame arka plan | Real: gradient; Character: absolute gradient | Container `bg-white` / `dark:bg-slate-800` |
| `Image` | `object-cover` only | `rounded-xl` + `object-center` |
| Footer | `bg-white/95`, `rounded-b-*` yok | `rounded-b-xl`, opak `bg-white` |

---

## 2. İzlerin Konumu

- **Yer:** Alt iki köşe; “beyazlık” veya “iz” **iç frame’in beyaz/açık kısımlarına** yakın, köşe eğrisini takip eden ince hilal/ark.
- **Footer alanında** (metin bandının olduğu bölge) değil; **görsel alanının alt köşelerinde**, footer’a bitişik bölge.

**Kabaca konum (iç frame, yandan):**

```
    ┌─────────────────────────┐
    │                         │
    │      Görsel (Image)     │
    │     object-cover        │
    │                         │
    │  ◐ iz          iz ◑     │  ← Hilal: container rounded-xl eğrisi ile
    ├─────────────────────────┤     footer dik kenarının birleştiği bölge
    │  Footer (bg-white/95)   │
    │  "Arya, Age 1" / tema  │
    └─────────────────────────┘
```

---

## 3. Olası Nedenler

### A) Footer – container köşe uyumsuzluğu

- Container `rounded-xl` → alt köşeler eğri.
- Footer dikdörtgen, `rounded-b-*` yok → alt köşelerde footer 90° biter, container eğrisiyle tam örtüşmeyebilir.
- **Sonuç:** Eğri ile footer köşesi arasında ince boşluk → arkadaki katman (görsel, gradient veya container arka planı) sızıntı = açık hilal.

**Not:** Footer’a `rounded-b-xl` eklendiği denemede iz sürdü; tek başına yeterli olmadı.

---

### B) `overflow-hidden` + `border-radius` ile kırpma ve antialiasing

- `overflow-hidden` + `rounded-xl` ile tarayıcı, içeriği eğri bir maskeye göre kırpar.
- Kırpma sınırındaki pikseller **antialiasing** ile çizilir; bazen:
  - Kırpılan katmanın (ör. `img`) rengi ile
  - Arkadaki katmanın (container `bg`, gradient) rengi karışır.
- **Sonuç:** Özellikle açık arka plan (gray-100/200, gradient) veya görseldeki açık bölgeler, köşe antialiasing’inde “açık hilal” olarak görünebilir.

---

### C) Next.js `Image` (`fill` + `object-cover`) ve köşe pikselleri

- `fill` → `inset: 0` ile kutu doldurulur; `object-fit: cover` ile görsel ölçeklenir ve kırpılır.
- `img` fiziksel olarak **dikdörtgen**; köşe eğrisi yalnızca üst div’in `overflow` + `border-radius` kırpmasıyla oluşuyor.
- Bazı DPI/zoom/GPU’larda:
  - `img` raster’ı ile kırpma sınırı **sub-pixel** düzeyde tam çakışmayabilir,
  - veya köşe pikselleri yanlış katmanla blend edilir.
- **Sonuç:** 1px civarı “boşluk” veya açık renk = köşede ince iz.

---

### D) Yarı saydam footer (`bg-white/95`)

- Footer %95 opak; %5 arkadaki görsel/gradient görünür.
- Köşede, footer’ın **kenarı** (düz veya `rounded-b-*`) ile görsel alanının eğrisi **birleşince**, bu blend bölgesi ince bir “açık hilal” gibi algılanabilir.
- Özellikle görselin o bölgede açık renk (gökyüzü, kumaş, ışık) olması bunu güçlendirir.

---

### E) İç frame arka planı

- **Real Photo:** `bg-gradient-to-br from-gray-100 to-gray-200` (açık).
- **Character:** `absolute inset-0` gradient (renkli).
- Kırpma/antialiasing sınırında “görünen” renk bu arka planlar olabilir → açık gri/beyaz iz (özellikle Real Photo’da).

**Hipotez vs deney (hangi çözüm neyi ayırt eder):**

| Çözüm | İz kaybolursa → | İz sürerse → |
|-------|------------------|--------------|
| **5.1** Footer’ı dışarı al | A (footer–container uyumsuzluğu) veya D (yarı saydam footer) olası | B/C/E: `img` + `overflow` + `rounded` veya arka plan kırpma/antialiasing |
| **5.2** Sadece `Image`’e `rounded-xl` | C (Next/Image köşe) veya B kısmen | Kesin değil |
| **5.6** Sadece footer opak (`bg-white`) | D (yarı saydam footer) olası | A/B/C/E |

---

## 4. Denenen ve Geri Alınan Değişiklikler

| Deneme | Yapılan | Sonuç |
|--------|---------|--------|
| 1 | Footer’a `rounded-b-xl` | İz sürdü. |
| 2 | `overflow-clip`, container `bg-white` / `dark:bg-slate-800`, `Image`’e `rounded-xl` + `object-center`, footer opacity kaldırıp solid `bg-white` | Görsel olarak kötüleşti; köşe izi yine görüldü. Tümü geri alındı. |

---

## 5. Henüz Denenmeyen / Değerlendirilebilecek Çözümler

### 5.1 Footer’ı görsel container’ının dışına almak

- **Yapı:** İç frame’de **sadece** gradient + `Image`; footer **kardeş** bir blok olarak altta, kartın `p-2` alanında.
- **Mantık:** Köşe, “görsel + overflow-hidden + rounded-xl” ile **sadece görsel** kısımda kalır; footer–görsel birleşim noktası kalkar.
- **Eğer iz sürerse:** Kaynak büyük ihtimalle img + overflow-hidden + rounded-xl kırpması (B/C).
- **Eğer iz kaybolursa:** Büyük ihtimalle footer–container birleşimi veya yarı saydam footer (A/D).

---

### 5.2 Sadece `img`’e `rounded-xl`

- Container’da `overflow-hidden` + `rounded-xl` kalsın; **ek olarak** `Image`’e `className` ile `rounded-xl` ver.
- **Mantık:** Köşe hem dış kırpmayla hem img’in kendi `border-radius` çizimiyle çizilir; antialiasing davranışı değişebilir.
- **Risk:** Çift rounded bazen iki eğri arasında ince çizgi/artefakt da yapabilir; denenmeli.

---

### 5.3 `clip-path` ile kırpma

- `overflow-hidden` + `border-radius` yerine (veya ek olarak)  
  `clip-path: inset(0 round 12px)` gibi bir `clip-path` kullan.
- **Mantık:** Kırpma modeli farklı; köşe antialiasing’i değişebilir.
- **Dikkat:** `clip-path` tüm tarayıcılarda aynı davranmayabilir; cross-browser kontrol gerekir.

---

### 5.4 Inset box-shadow ile köşeyi yumuşatmak / maskelemek

- Görsel container’a çok ince `box-shadow: inset` (örn. 0 0 0 1px `rgba(0,0,0,0.06)` veya `rgba(255,255,255,0.1)`).
- **Mantık:** Köşe bölgesi hafif koyulaşır/açılır; ince açık iz görsel olarak kamufle edilebilir.
- **Risk:** Tüm köşe/kenarı etkiler; istenmeyen “çerçeve” hissi verebilir.

---

### 5.5 `will-change: transform` veya `transform: translateZ(0)`

- Görsel container veya `Image` wrapper’a uygula.
- **Mantık:** Yeni kompozisyon katmanı; GPU’da çizim ve köşe rasterizasyonu farklı olabilir.
- **Risk:** Performans; yalnızca bu bileşende ve gerekirse denenebilir.

---

### 5.6 Footer’ı opak yapıp rengi container ile eşitlemek (minimal)

- **Sadece** footer: `bg-white/95` → `bg-white`, `dark:bg-slate-800/95` → `dark:bg-slate-800`.
- Container arka planına **dokunmadan** (gradient kalsın); **sadece** footer opak ve kartla uyumlu.
- **Mantık:** Köşede kalan ince bant, footer ile aynı tonda olursa iz silikleşebilir. Önceki denemede container bg da değiştiği için bu **yalnızca** footer ile denenmedi.

---

## 6. Önerilen Sıra

1. **Footer’ı dışarı al (5.1):** En yapısal değişiklik; footer–görsel birleşimini kaldırır. İz devam ederse sorun büyük ihtimalle img + overflow-hidden + rounded.
2. **Sadece `img`’e `rounded-xl` (5.2):** Küçük değişiklik; hızlı test.
3. **Footer opak + renk uyumu (5.6):** Sadece footer className; container’a dokunmadan.
4. **`clip-path` (5.3):** Özellikle B/C şüphesi güçlenirse.
5. **Inset shadow (5.4):** Görsel son çare; ince çerçeve kabul edilebilirse.

---

## 7. Repro Ortamı

- Hangi tarayıcı, işletim sistemi, DPI, sayfa zoom’unda belirgin?
- Farklı temalarda (açık/koyu) fark var mı?

Bu bilgiler, B/C (kırpma/antialiasing) ile A/D (footer/birleşim) ayrımını netleştirir.

---

**İlgili dosya:** `components/sections/HeroBookTransformation.tsx`
