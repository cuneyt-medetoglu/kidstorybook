# Kelime Sayısı (Short Pages) ve Repair Adımı – Analiz

**Tarih:** Şubat 2026  
**Bağlam:** Create Book akışında "Short pages" uyarısı ve ardından çalışan "repair" (ikinci LLM çağrısı). Kullanıcı talebi: ilk istekte doğru gelsin; repair gereksiz tekrar isteğe yol açıyor.

---

## 1. Mevcut durum

### Prompt’ta kelime talebi (ilk istek)

| Yer | İçerik |
|-----|--------|
| **STORY REQUIREMENTS** | `Target words per page: 30-45 (…)` + `CRITICAL: Each page's "text" must be at least 30 words for this age group. Do not leave pages with only a few words.` |
| **WRITING STYLE** | `Each page: ~30-45 words. Include dialogue, sensory details…` |
| **OUTPUT FORMAT** | `"text": "Page text (~30-45 words, dialogue + descriptions)"` |
| **VERIFICATION CHECKLIST** | Kelime sayısı maddesi **yok**. |

Yani minimum kelime sayısı zaten **açıkça** söyleniyor (en az X kelime, hedef aralık 30–45). Buna rağmen model sıklıkla **altında** sayfa döndürüyor (ör. 26, 27, 22 kelime).

### Repair adımı (route.ts, Sıra 17)

- Hikaye cevabı alındıktan sonra her sayfanın kelime sayısı hesaplanıyor.
- `wordMin` altında kalan sayfalar "Short pages" diye loglanıyor.
- Bu sayfalar için **ikinci bir GPT çağrısı** (repair): "Sadece şu sayfa numaralarının metnini en az X kelimeye çıkar, aynı olay/ton/dil."
- Dönen metinler `storyData.pages` üzerine yazılıyor.

**Sonuç:** İlk istekte hedef karşılansa repair hiç çalışmaz. Karşılanmazsa ek maliyet + gecikme + bazen tekrarlı/doğal olmayan genişletme.

---

## 2. Sorunun özeti

- **İlk istekte anlatılması gereken şey zaten anlatılıyor** (CRITICAL + hedef aralık). Model buna uymuyor.
- **Repair** bu yüzden "telafi" olarak devreye giriyor; ancak:
  - Ek API çağrısı (maliyet, süre),
  - Kullanıcıda "sorun var mı?" hissi (Short pages / Repair logları),
  - İkinci model cevabı bazen tonda/akışta küçük farklılık yaratabiliyor.

Tercih: **İlk istekte doğru gelmeli; repair ya kaldırılmalı ya da sadece güvenlik ağı olarak (nadiren) kullanılmalı.**

---

## 3. Seçenekler

| Seçenek | Açıklama | Artı | Eksi |
|--------|----------|------|------|
| **A) Repair’i kaldır + prompt’u güçlendir** | Repair kodunu sil; VERIFICATION CHECKLIST’e "Each page text: at least X words" ekle; STORY REQUIREMENTS’teki cümleyi biraz daha net/vurgulu yap. | Tek LLM çağrısı, sade akış, maliyet/latency azalır. | Nadiren yine kısa sayfa çıkabilir (kabul edilebilir). |
| **B) Sadece repair’i kaldır** | Prompt aynen kalsın, sadece repair blokunu kaldır. Kısa sayfa kalırsa kalsın, uyarı log’u isteğe bırakılabilir. | En basit değişiklik. | Prompt tarafında ek vurgu yok; kısa sayfa sıklığı değişmeyebilir. |
| **C) Repair’i güvenlik ağı yap (koşullu)** | Repair sadece "çok sayıda sayfa kısa" olduğunda çalışsın (örn. 6+ sayfa veya toplam sayfanın yarısı). Veya env ile `ENABLE_WORD_COUNT_REPAIR=false` ile kapatılsın. | Nadir durumda yine düzeltme şansı. | Karmaşıklık, iki farklı davranış (açık/kapalı). |
| **D) Prompt’u güçlendir, repair kapalı (env)** | VERIFICATION’a kelime maddesi ekle; STORY REQUIREMENTS’i netleştir. Repair’i varsayılan kapalı yap (env ile açılabilsin). | İlk istek öncelikli; gerektiğinde güvenlik ağı açılabilir. | Kodda repair kodu durur, dokümantasyon gerekir. |

---

## 4. Öneri

**Seçenek A:** Repair’i **tamamen kaldırmak** + **prompt’u güçlendirmek**.

Gerekçe:

1. **İlk istekte anlat:** Zaten "at least X words" var; VERIFICATION CHECKLIST’e aynı kuralı eklemek modelin son kontrolü sırasında bir kez daha görmesini sağlar. "Her sayfa en az X kelime" ifadesi iki yerde (STORY REQUIREMENTS + VERIFICATION) net geçmeli.
2. **Repair gereksiz tekrar:** Ek çağrı maliyet/gecikme ve kullanıcıda belirsizlik yaratıyor. AI’dan ilk seferde doğru istemek daha temiz.
3. **Kabul edilebilir risk:** Bir sayfa 28–29 kelime olsa bile (hedef 30) okunabilirlik bozulmaz; özellikle toddler/preschool için bu fark minimal.

**Yapılacaklar (uygulama):**

1. **Prompt (base.ts)**  
   - **VERIFICATION CHECKLIST:** Yaş grubuna göre `wordMin` kullanarak şu madde eklenir:  
     `Each page "text" must have at least [wordMin] words (age group: [ageGroup]). Count words before returning.`  
   - **STORY REQUIREMENTS:** Mevcut CRITICAL cümlesi aynen kalabilir veya "Count words per page; if under [wordMin], expand that page's text before returning." gibi kısa bir talimat eklenebilir (isteğe bağlı).

2. **route.ts**  
   - Kelime sayısı kontrolü **sadece log** için kalabilir (istatistik / debug):  
     `Word count (min X): p1=26, p2=30, ...`  
   - **Repair bloku tamamen kaldırılır:** `shortPages` dolu olsa bile ikinci LLM çağrısı yapılmaz; `storyData` olduğu gibi kullanılır.

3. **Dokümantasyon**  
   - `PROMPT_LENGTH_AND_REPETITION_ANALYSIS.md` içinde Sıra 17 satırı güncellenir: "Kelime sayısı kontrolü yalnızca log amaçlı; repair kaldırıldı. Prompt (VERIFICATION + STORY REQUIREMENTS) ile ilk cevapta hedefleniyor."

---

## 5. Alternatif: Repair’i sadece "güvenlik" için tutmak

Eğer "hiç kaldırmayalım, ama normalde çalışmasın" denirse:

- **Env:** `ENABLE_WORD_COUNT_REPAIR=false` (varsayılan). `true` yapıldığında mevcut repair davranışı çalışır.
- **Prompt yine güçlendirilir;** böylece repair’in tetiklenmesi nadirleşir.

Bu durumda kodda repair kalır, dokümanda "opsiyonel güvenlik ağı" diye belirtilir.

---

## 6. Kısa sonuç

| Soru | Cevap |
|------|--------|
| Repair kaldırılmalı mı? | **Öneri: Evet.** İlk istekte kural net anlatılsın; ek LLM çağrısı kaldırılsın. |
| Güvenlik için dursun ama kullanılmasın? | İstenirse env ile **opsiyonel** yapılabilir; varsayılan kapalı. |
| İlk istekte doğru gelmesi için? | **VERIFICATION CHECKLIST**’e "each page text at least X words" maddesi eklenmeli; STORY REQUIREMENTS zaten var, tekrarla vurgu artar. |

Bu doküman, karar ve uygulama referansı için kullanılabilir.
