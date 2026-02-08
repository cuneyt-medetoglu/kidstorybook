# A9 – Layout-Safe Character Master: Ne Olacak, Etkiler, Akış Değişikliği

**Tarih:** 8 Şubat 2026  
**Kaynak:** PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md §8.3, §9.4, A9 tanımı  
**Amaç:** “Kocaman karakter” problemini azaltmak; sayfalarda karakterin frame’i doldurmasını önlemek.

---

## 1. Şu an ne var? (Mevcut akış)

### Master üretimi (tek yer: `app/api/books/route.ts` → `generateMasterCharacterIllustration`)

- **Girdi:** Kullanıcının yüklediği karakter fotoğrafı (referans) + karakter açıklaması + stil + (isteğe) hikaye kıyafeti.
- **Prompt (özet):**  
  `[ANATOMY]` + `[STYLE]` + `[EXPRESSION]` + **“Full body, standing, feet visible, neutral pose. Child from head to toe. … Plain neutral background. Match reference photos for face and body.”**
- **Boyut:** `1024x1536` (portrait, kitap sayfasıyla aynı aspect).
- **API:** `/v1/images/edits` (tek referans görsel + prompt).
- **Çıktı:** Bir master görsel URL’i; bu görsel **kapak ve tüm sayfalarda** referans olarak kullanılıyor (image[0] = bu master).

### Sorun (analiz dokümanından)

1. **Master’ın kadrajı:** Master “full body, standing” ile üretiliyor ama **kadrajı ne kadar doldurduğu net değil**. Model genelde karakteri büyük, frame’e yakın çiziyor.
2. **Referans = “nasıl çiz” ipucu:** Sayfa üretirken model, referans görseldeki **kompozisyonu da** (karakter büyük mü, küçük mü) ipucu olarak alıyor. Master’da karakter büyükse, sayfalarda da “aynı yüz/kıyafet” derken karakteri büyük çizme eğilimi artıyor.
3. **“Wide shot” tek başına yeterli değil:** Sayfa prompt’unda “25–30% frame height” desek bile, referans görselde karakter büyükse model onu ön planda tutup sayfada da büyük çizebiliyor.

**Sonuç:** Sayfalarda sık görülen “kocaman karakter” (frame’i doldurma, close-up hissi) kısmen **master referansın kadrajından** kaynaklanıyor.

---

## 2. A9 ile ne yapılacak? (Hedef)

**Tek cümle:** Master üretiminde kadrajı **“karakter 25–30% yükseklik, etrafında çok boşluk”** olacak şekilde prompt + (metin içi) negatiflerle zorlamak; sayfa akışı aynı kalacak, sadece master’ın kendisi değişecek.

### 2.1 Master prompt’a eklenecekler

- **Pozitif (zorunlu):**
  - Karakter **frame yüksekliğinin 25–30%’u** kadar; **wide shot**, **full body visible**.
  - Etrafında **çok negatif alan / boşluk**; karakter küçük, ortada veya üçte birlerde.
  - (İsteğe) “Same aspect as book page (portrait 1024x1536), character small in frame, lots of empty space around.”
- **Negatif (Avoid – API ayrı parametre desteklemiyorsa prompt içinde):**
  - “Avoid: waist-up framing, medium shot, close-up, character too large, portrait crop.”

### 2.2 Master’da değişmeyecekler

- Referans fotoğraf, stil, kıyafet, anatomi, ifade kuralları aynı kalacak.
- Boyut `1024x1536` kalacak.
- API (`/v1/images/edits`), çağrı sayısı ve genel akış (önce master, sonra cover, sonra sayfalar) aynı kalacak.
- Cover ve sayfa prompt’ları **A9’da değiştirilmez**; zaten A1/A7/A8 ile “Characters are SMALL (25–30% of frame height)” ve SHOT PLAN var. Değişen sadece **master görselin içeriği**.

---

## 3. Tam olarak ne işe yarayacak?

1. **Master görsel artık “layout-safe”:**  
   Üretilen master’da çocuk **küçük**, etrafında **bol boşluk** olacak. Referans olarak kullanıldığında model “bu yüzü ve kıyafeti koru” derken, **kompozisyon ipucu** olarak “küçük, geniş kadraj” görmüş olacak.

2. **Sayfalarda “kocaman karakter” azalması beklenir:**  
   Aynı sayfa prompt’ları (SHOT PLAN, 25–30%, wide shot) kullanılmaya devam edecek; fark, referans görselin artık “küçük karakter” örneği vermesi. Bu, modelin sayfada da karakteri daha küçük, ortamla dengeli çizmesine yardım eder.

3. **Kimlik koruma bozulmaz:**  
   Yüz, saç, kıyafet hâlâ referans + prompt ile korunuyor; sadece **kadraj ve ölçek** değişiyor.

4. **Teknik risk:**  
   “Karakter 25–30% yükseklik” master’da bazen modele tam oturmayabilir (ilk denemede çok küçük veya hâlâ büyük çıkabilir). O yüzden A9 sonrası **test önerilir**; gerekirse prompt’taki yüzde veya “lots of empty space” ifadesi ince ayarlanabilir.

---

## 4. Mevcut akış nasıl değişecek?

### 4.1 Değişen (tek adım)

| Adım | Şu an | A9 sonrası |
|------|--------|------------|
| **Master karakter prompt’u** | “Full body, standing, feet visible … Plain neutral background.” (kadraj/ölçek belirtilmiyor) | Aynı metin **artı** “Character small in frame (25–30% of frame height), wide shot, full body visible, lots of empty space around character. Avoid: waist-up framing, medium shot, close-up, character too large, portrait crop.” (veya buna denk tek satır) |

### 4.2 Hiç değişmeyecekler

- **Story → Master sırası:** Aynı.
- **Master sayısı:** Her karakter için 1 master; değişmez.
- **Cover üretimi:** Aynı API, aynı prompt yapısı; referans olarak **yeni (layout-safe) master** kullanılır.
- **Sayfa üretimi:** Aynı API, aynı sayfa prompt’ları; referans olarak **yeni master** kullanılır.
- **Entity master’lar:** Hayvan/obje master’ları A9’dan etkilenmez (sadece insan karakter master’ı değişir).

### 4.3 Kod tarafında yapılan (özet)

- **`lib/prompts/config.ts`:**  
  **Config (configratif):** `masterLayout: { characterScaleMin: 25, characterScaleMax: 30 }`. Testte karakter **çok küçük** kalırsa bu değerleri büyütebilirsin (örn. 30–35).
- **`lib/prompts/image/master.ts`:**  
  `getLayoutSafeMasterDirectives()` config’ten min/max okuyup “Character small in frame (25-30% of frame height), wide shot, full body visible, lots of empty space…” + “Avoid: waist-up framing, …” döndürür.
- **`app/api/books/route.ts`:**  
  `generateMasterCharacterIllustration` içinde `masterPrompt`’a `getLayoutSafeMasterDirectives()` eklenir.
- **Negatif:** “Avoid: …” prompt metninin içinde (API ayrı negatif parametre sunmuyor).

---

## 5. Özet tablo

| Soru | Cevap |
|------|--------|
| **Ne değişecek?** | Sadece **insan karakter master** üretim prompt’u (kadraj: karakter 25–30%, bol boşluk; Avoid: close-up, character too large, vb.). |
| **Ne işe yarar?** | Master “layout-safe” olur; sayfalarda referans kullanılırken “kocaman karakter” riski azalır. |
| **Akış değişir mi?** | Hayır. Sıra ve adımlar aynı; sadece master görselinin **içeriği** (kompozisyon) değişir. |
| **Cover / sayfa prompt’u?** | A9’da değişmez; onlar zaten A1/A7/A8 ile güncellendi. |
| **Risk?** | Master’da ilk denemede ölçek tam istenen gibi olmayabilir; test + gerekirse ince ayar. |
| **Entity master?** | Etkilenmez. |

**A9 uygulandı.** Ölçeği büyütmek için: `lib/prompts/config.ts` → `masterLayout.characterScaleMin` / `characterScaleMax` (örn. 30 ve 35).
