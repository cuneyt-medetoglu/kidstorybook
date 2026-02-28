# Hikaye Kalitesi: Sorun Analizi ve İyileştirme Seçenekleri

**Tarih:** 14 Şubat 2026  
**Tetikleyici:** Adventure temalı 1 karakter (Arya) kitabında customRequests olarak sahne açıklaması verildi; çıkan hikaye kalitesiz bulundu.

---

## 1. Mevcut Akış: Ne Giriyor, Ne Çıkıyor?

### LLM'ye gönderilen input'lar

| Input | Mevcut değer (örnek kitap) |
|-------|--------------------------|
| `theme` | `adventure` |
| `characterName` | `Arya` |
| `characterAge` | (girilen yaş) |
| `language` | `tr` |
| `illustrationStyle` | (seçilen stil) |
| `customRequests` | 4 cümlelik sahne tasviri (bahçe, yonca, çakıl taşı, sulama kabı) |
| `pageCount` | 12 |

### `customRequests` prompt'ta nasıl kullanılıyor?

```
# STORY REQUIREMENTS
...
- Special Requests: <customRequests metni buraya düz yapıştırılıyor>
```

**Problem:** `customRequests` sadece `- Special Requests:` etiketi altında düz metin olarak LLM'ye gönderiliyor. LLM bu metni bir "istek" mi, "özet" mi, "ilham" mı yoksa "birebir metin" mi olarak yorumlayacağını bilmiyor. Direktif yok.

---

## 2. Kök Neden: Hikayeyi Ne Kötü Yapıyor?

### 2.1 customRequests nasıl işleniyor?

Verilen metin (4 cümle, sahne tasviri) "Special Requests" olarak geçiyor. LLM bunu:
- Bazen hikayeye **birebir başlangıç sahnesi** olarak yapıştırıyor (zayıf entegrasyon)
- Bazen sadece **1 sayfada** kullanıp gerisini kendi kafasına göre dolduruyor
- Metni **ilham** olarak değil **görev listesi** olarak algılayabiliyor → mekanik hikaye

### 2.2 Hikaye yapısı direktifleri zayıf

- `# STORY STRUCTURE` bölümünde arc (başlangıç–gelişme–sonuç) yazıyor ama çok genel.
- customRequests bir "opening scene" ise bunun hangi sayfada, nasıl kullanılacağı belirsiz.
- LLM 12 sayfayı doldurmak için "ne hakkında yazayım?" sorusunu customRequests'ten çözemiyor.

### 2.3 "Adventure" teması çok geniş

`adventure` temasında LLM'ye verilen direktif: *"Use setting, mood, educational focus that fit the theme."* Bu çok muğlak; tema, ortam, çatışma ve çözüm önceden şekillendirici değil.

### 2.4 customRequests → hikaye fikri değil, görsel metin

Verilen customRequests aslında bir **kapak sahne açıklaması** gibi yazılmış (görsel, tasviri yüksek). Story generation için **ne hakkında** hikaye yazılacağını, **çatışma/zorluğun ne** olduğunu, **çözümün ne** olduğunu söylemiyor. LLM bu eksikleri kendi dolduruyor → tutarsız, mekanik sonuç.

---

## 3. Çözüm Seçenekleri

### Seçenek A — customRequests direktifini güçlendirmek (Kolay, Hızlı)

**Ne yapılır:** Prompt'ta `Special Requests` satırı yerine daha açık bir direktif:

```
# STORY IDEA (from creator)
The following is the core story idea provided by the book creator. 
Use it as the BACKBONE of the story — expand it into a full ${n}-page narrative 
with a clear beginning, challenge, and resolution. 
Do NOT copy it word for word; use it as a creative seed.

"${customRequests}"
```

**Beklenti:** LLM customRequests'i bir "tohum" olarak görür, üzerine inşa eder.  
**Kazanç:** Minimal kod değişikliği, hemen denenebilir.  
**Risk:** LLM yine de zayıf genişletebilir; model kalitesine bağlı.

---

### Seçenek B — customRequests formatını şekillendirmek (Orta)

**Ne yapılır:** Kullanıcıdan serbest metin yerine **yapılandırılmış hikaye fikri** almak:

```
Hikaye konusu: Arya bahçede gizli bir hazine arar
Tema/atmosfer: Merak, küçük maceracı hissi
Zorluk/engel: Çit aşılamaz görünüyor, sulama kabı yolu tıkıyor
Çözüm: Çakıl taşlarıyla örülü gizli yolu keşfediyor
```

Veya şu formatta zorunlu alanlar:
- `storyIdea` (ana fikir, 1 cümle)
- `challenge` (karşılaşılan zorluk)
- `resolution` (nasıl çözülüyor)

**Beklenti:** LLM çok daha odaklı hikaye yazar.  
**Kazanç:** Hikaye her zaman arc'a sahip olur.  
**Risk:** UX değişikliği gerektirir (kullanıcıdan farklı input alınacak).

---

### ~~Seçenek C — Hazır hikaye şablonları / blueprint'ler~~ (Elenen)

**Neden elendi:** Hep aynı tarz hikaye çıkar; çeşitlilik kaybolur. E seçeneği (iki aşamalı üretim) aynı kaliteyi daha esnek şekilde sağlıyor.

---

### Seçenek D — Daha güçlü model kullanmak (Kolay ama maliyetli)

**Mevcut:** `gpt-4o-mini` (hız + maliyet odaklı).  
**Öneri:** Story generation için `gpt-4o` veya `o3-mini` deneyin.

**Beklenti:** Aynı prompt ile çok daha akıcı, anlamlı, arc'ı olan hikaye.  
**Kazanç:** Hızlı A/B test yapılabilir.  
**Risk:** 12 sayfalık story çağrısı `gpt-4o` ile ~89s → daha uzun + daha pahalı (~5–8x).

---

### Seçenek E — İki aşamalı hikaye üretimi (Yüksek kalite, Yüksek karmaşıklık)

**Ne yapılır:**
1. **Adım 1 – Outline:** customRequests + karakter + tema → LLM kısa outline üretir (başlık, 12 sayfa başlık+tek cümle özet).  
2. **Adım 2 – Expand:** Outline'ı kullanan ikinci LLM çağrısı tam metni yazar.

**Beklenti:** Her sayfa outline'dan besleniyor → tutarlı arc, anlamlı geçişler.  
**Kazanç:** Kalite çok artar; outline adımı ucuz.  
**Risk:** Toplam süreye +20–30s ekler; kod karmaşıklığı artar.

---

## 4. E Seçeneği Diğerlerini Kapsıyor mu?

| Seçenek | E ile ilişki |
|---------|----------------|
| **A** (customRequests direktifi) | **Evet.** Outline aşamasında customRequests zaten "hikaye tohumu" olarak kullanılır; güçlü direktif outline prompt'una eklenir → E yapınca A da uygulanmış olur. |
| **B** (yapılandırılmış input) | **Kısmen.** E'nin outline çıktısı zaten yapılandırılmış (sayfa başlık + tek cümle). İstersen B'deki idea/challenge/resolution alanlarını outline prompt'una ekleyebilirsin; E ile uyumlu. |
| **C** (blueprint) | Elendi; E ile değiştirildi. |
| **D** (model seçimi) | **Hayır – ayrı.** Hangi model kullanılacağı E'den bağımsız. Outline ve expand aşamalarında gpt-4o-mini, gpt-4o veya debug'da seçilen model kullanılabilir. |

**Sonuç:** E'yi uyguladığında A mantıken dahil olur; B istersen E'ye entegre edilir; D (model) ayrı bir konfigürasyon/debug özelliği olarak kalır.

---

## 5. Model Karşılaştırması (Araştırma Özeti)

**Kaynaklar:** Creative writing benchmark'ları, OpenAI dokümanları, karşılaştırma siteleri (2024–2025).

### gpt-4o vs gpt-4o-mini — Yaratıcı yazım

| | gpt-4o-mini | gpt-4o |
|--|-------------|--------|
| **Yaratıcı yazım kalitesi** | "Kabul edilebilir ama derinlikten yoksun"; yaratıcı işlerde öne çıkmıyor. | Yaratıcı yazımda belirgin şekilde daha iyi; daha doğal, akıcı, okunabilir. |
| **Maliyet / hız** | Ucuz, hızlı. | Daha pahalı (~5–8x), daha yavaş. |
| **Ne zaman kullanılır** | Rutin, maliyet odaklı işler. | Kalite ve derinlik ön planda olduğunda. |

**OpenAI (Kasım 2024):** gpt-4o güncellemesiyle yaratıcı yazım iyileştirildi — "more natural, engaging, tailored writing; relevance & readability."

**Pratik çıkarım:** Hikaye üretimi için gpt-4o kalite farkı yaratır; mini ile "çok fark göremiyorum" hissi benchmark'larla uyumlu (mini yeterli derinlik vermiyor). Farkı görmek için: aynı prompt ile 1–2 kitap mini, 1–2 kitap gpt-4o üretip metni karşılaştırmak iyi olur. **Debug modda model seçimi** bu A/B testi ve ileride production model seçimi için gerekli.

---

## 6. Model Stratejisi (Karar)

| Kullanım | Model | Açıklama |
|----------|--------|----------|
| **Varsayılan (tüm kullanıcılar)** | `gpt-4o-mini` | Maliyet ve hız; aynı kalsın. |
| **Example book oluşturma** | Dropdown'dan seçilen model | Artık gpt-4o zorlanmıyor; admin Step 6'da seçtiği model (varsayılan gpt-4o-mini) kullanılır. |
| **Debug (admin)** | Seçilebilir | Admin/debug modda tek dropdown: Create without payment, Example book ve Sadece Hikaye testi aynı modeli kullanır (gpt-4o-mini, gpt-4o, o1-mini). |

**API kuralı:** `storyModel` sadece admin veya debug yetkisi olan kullanıcı tarafından gönderilebilir; gönderilmezse varsayılan `gpt-4o-mini`. Example book da aynı kurala tabidir (artık sunucu tarafında gpt-4o zorlanmaz). İzin verilen modeller whitelist ile sınırlı (gpt-4o-mini, gpt-4o, o1-mini).

---

## 7. Fazlı Plan

### Faz 1 — Odak: Example sayfası + Debug model (şimdilik)

| # | İş | Durum |
|---|-----|--------|
| 1.1 | **Debug modda story model seçimi** | ✅ Yapıldı. API: `storyModel` sadece admin/debug kabul; whitelist (gpt-4o-mini, gpt-4o, o1-mini). Tek dropdown: Create without payment, Example book ve Sadece Hikaye testi aynı modeli kullanır. |
| 1.2 | **Example sayfası UI** | ✅ Yapıldı. Step 6'da "Story model" dropdown; varsayılan gpt-4o-mini. Example book artık dropdown'dan seçilen modeli kullanır (gpt-4o zorlaması kaldırıldı). |
| 1.3 | **Example sayfasını güzel tamamlamak** | ✅ Yapıldı. (a) `customRequests` → `# STORY SEED` direktifi ile prompt’ta backbone olarak kullanılır (v2.5.0). (b) Step 5 label/placeholder/helper text → hikaye fikri yönlendirmesi. (c) Examples page: `yaş` → `yrs` dil tutarlılığı. |

**Çıktı:** Example kitaplar 4o ile üretilir; normal kullanıcılar mini ile devam eder; admin isterse debug’da 4o seçerek test eder.

---

### ~~Faz 2 — İki aşamalı hikaye (E) + Önizleme~~ (Yapılmayacak)

**Karar:** İki aşama (outline + expand) maliyeti ikiye katlar; tek çağrı + iyi prompt + gpt-4o seçimi yeterli.

| # | İş | Durum |
|---|-----|--------|
| 2.1 | E – Outline | ❌ Yapılmayacak (2x maliyet) |
| 2.2 | E – Expand | ❌ Yapılmayacak |
| 2.3 | Hikaye önizleme | ❌ Yapılmayacak |

---

### Faz 3 — B (opsiyonel) tek çağrıda prompt güçlendirme

| # | İş | Durum |
|---|-----|--------|
| 3.1 | **STORY SEED’de challenge + resolution direktifi** | ✅ Faz 1.3 ile gerçekleşti. ‘STORY SEED’ bölümü LLM’den açıkça “clear beginning, middle, and end” ister; customRequests’ten bir arc kurmasını zorlar (v2.5.0). |
**Neden B faydalı:** Arc’ın net olması için çatışma ve çözümün açıkça tanımlanması kaliteyi artırıyor. E’nin outline’ı zaten yapılandırılmış; B’yi "outline’da challenge/resolution iste" şeklinde eklemek UX’i değiştirmez, sadece prompt’u güçlendirir.

---

## 8. Debug’da Önerilen Modeller (Whitelist)

| Model ID | Kullanım |
|----------|----------|
| `gpt-4o-mini` | Varsayılan; hızlı, ucuz. |
| `gpt-4o` | Yaratıcı yazım kalitesi; example book ve A/B test. |
| `o1-mini` | Reasoning odaklı; daha tutarlı arc denemek için (OpenAI dokümanına göre mevcut ise). |

Whitelist dışı model isteği reddedilir veya varsayılana düşer. Yeni model eklenecekse kodda tek yerden güncellenir.

---

## 9. Faz 1 Test Rehberi (1.1 + 1.2)

**Gereksinim:** Admin kullanıcı veya `DEBUG_SKIP_PAYMENT=true` (geliştirme ortamında "Create without payment" butonu görünür).

### Test 1 — Debug model dropdown
1. Admin ile giriş yap veya debug ortamında ol.
2. Create wizard → Step 6’ya kadar git (karakter, tema, stil, sayfa sayısı seçili olsun).
3. "Create without payment (Debug)" bölümünde **Story model** dropdown’ını gör: gpt-4o-mini, gpt-4o, o1-mini.
4. Dropdown’dan **gpt-4o** seç.
5. "Create without payment (gpt-4o)" butonuna tıkla.
6. **Beklenen:** Kitap oluşmaya başlar; terminalde `[Create Book] 🔧 Story model override: gpt-4o` ve `STORY REQUEST sent (model: gpt-4o` log’ları çıkar.

### Test 2 — Example book dropdown’dan seçilen model
1. Step 6’da Story model dropdown’dan istediğin modeli seç (örn. gpt-4o).
2. "Create example book (gpt-4o)" butonuna tıkla.
3. **Beklenen:** Backend seçilen modeli kullanır; terminalde Story model override görünür. Varsayılan gpt-4o-mini kullanılır.

### Test 3 — Normal kullanıcı (model override yok)
1. Admin olmayan bir hesapla giriş yap (veya API’ye doğrudan `storyModel: gpt-4o` gönderip yetkisiz kullanıcı simüle et).
2. **Beklenen:** API `storyModel` override’ı kabul etmez; story her zaman **gpt-4o-mini** ile üretilir. (Step 6’da normal kullanıcı "Create without payment" görmez.)

### Kısa kontrol listesi
- [ ] Dropdown sadece admin/debug bölümünde görünüyor.
- [ ] gpt-4o seçip Create without payment → log’da model gpt-4o.
- [ ] Example book: dropdown’dan gpt-4o seçip Create example book → log’da gpt-4o; varsayılan ile gpt-4o-mini.
- [ ] Sadece Hikaye testi: dropdown’dan seçilen model kullanılır (panelde Model: X yukarıdaki seçim yazar).
- [ ] Varsayılan (mini) ile oluşturma → log’da gpt-4o-mini, override log’u yok.

---

## 10. Mevcut customRequests problemi — somut örnek

**Verilen:**
> "Arya ventures into the swaying clover, her eyes bright with wonder as she seeks a hidden treasure. To a small explorer, the garden fence is a wooden mountain and the watering can is a shiny silver cave. 'I found it!' she cheers, discovering a secret path lined with smooth, round pebbles. With a brave step, Arya follows the winding trail to see where her backyard journey leads next."

**Bu metin LLM'ye ne söylüyor?**
- ✅ Ortam: bahçe, yonca, çit, sulama kabı, çakıl taşı yolu  
- ✅ Karakter duygusu: merak, heyecan  
- ❌ 12 sayfalık arc nereye gidecek? (belli değil)  
- ❌ Asıl çatışma/zorluk ne? (belli değil)  
- ❌ Sonuç/çözüm ne? (belli değil)  
- ❌ "hazine" ne? (mecazi mi, gerçek mi?)

LLM bu boşlukları rastgele dolduruyor → tutarsız, mekanik hikaye.

**Seçenek A ile düzeltilmiş direktif:**
```
Use the following as the story seed — expand into a full adventure with a clear 
beginning, challenge, and satisfying resolution. Do not copy word for word.

"[aynı metin]"
```

**Beklenen fark:** LLM metni "görev" değil "ilham" olarak yorumlar; kendi arc'ını inşa eder.
