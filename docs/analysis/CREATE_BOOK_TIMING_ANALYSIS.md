# Create Book Akışı – Genel Kontrol ve Timing İyileştirmeleri

**Tarih:** Şubat 2026  
**Kaynak:** Terminal log (12 sayfa, 1 karakter, 2 entity, tam akış).

---

## 1. Genel durum – sorun var mı?

**Sonuç: Kritik sorun yok.** Akış başarıyla tamamlanıyor.

| Kontrol | Durum |
|--------|--------|
| Story | 12 sayfa, repair yok, kelime sayısı sadece log (p1=27 … p12=30). |
| Kitap kaydı | DB’ye yazıldı, Supabase/auth hatası yok. |
| Master | 1 karakter + 2 entity (Arı, Su Dökme Kabı) üretildi. |
| Kapak | Edits API, b64_json, S3’e yüklendi. |
| Sayfa görselleri | 12/12 parallel batch, hepsi b64 → S3. |
| TTS | 12 sayfa, 3 batch (5+5+2), hepsi cache’e yazıldı. |
| Tailwind uyarısı | `tailwind.config.ts` ES module uyarısı – bilinen, çalışmayı bozmuyor. |

**Küçük not:** Bazı sayfalarda "photo_character_2" indiriliyor – bu aslında entity master (ör. sulama kabı/arı) referansı. İsimlendirme kafa karıştırabilir; log metni iyileştirilebilir (opsiyonel).

---

## 2. Timing özeti (mevcut)

| Aşama | Süre | Açıklama |
|-------|------|----------|
| Story generation | **89.3s** | Tek LLM çağrısı (gpt-4o-mini). |
| Master illust. | **59.4s** | 1 karakter + 2 entity **sırayla** (for loop). |
| Cover image | **35.5s** | Tek edits çağrısı. |
| Page images | **30.5s** | 12 sayfa **paralel** batch. |
| TTS prewarm | **45.4s** | 3 batch (5+5+2) sıralı, batch içi paralel. |
| Other/overhead | 1.7s | DB, hazırlık. |
| **TOPLAM** | **~262s (~4.4 dk)** | |

---

## 3. İyileştirilebilir alanlar

### 3.1 Entity master’ları paralel üretmek

**Mevcut:** `for (const entity of storyData.supportingEntities) { await generateSupportingEntityMaster(...) }` → sıralı.  
**Öneri:** Tüm entity’leri `Promise.allSettled` ile aynı anda üret. Başarılı olanları `entityMasterIllustrations`’a yaz; biri hata verirse diğerleri etkilenmesin.

**Beklenen kazanç:** 2 entity için ~15–25 saniye (ikinci entity’nin süresi kadar). Master aşaması ~59s → ~40–45s olabilir.

### 3.2 TTS’i pipeline ile örtüştürmek

**Mevcut:** TTS, sayfa görselleri bittikten ve DB güncellendikten **sonra** çalışıyor. Toplam süre = story + masters + cover + pages + TTS.  
**Öneri:** Story bittikten hemen sonra (sayfa metinleri hazır) TTS prewarm’ı **arka planda** başlat; masters + cover + sayfa görselleri aynı anda ilerlesin. Response göndermeden önce TTS’in bitmesini bekle.

**Beklenen kazanç:** TTS ~45s, masters+cover+pages ~125s. TTS bu 125s içinde biter → duvar saati ~45s kısalır. **Toplam ~262s → ~215s** civarı.

### 3.3 Story süresi

89s tek çağrı için makul. Prompt kısaltma veya daha hızlı model (örn. gpt-4o-mini’de zaten kullanılıyor) ile sınırlı kazanç; öncelik düşük.

### 3.4 Kapak / sayfa görselleri

Kapak tek çağrı; sayfa görselleri zaten paralel. Ek paralelizasyon için cover’ı sayfa batch’ine katmak karmaşıklık getirir (cover farklı boyut/prompt); önerilmez.

---

## 4. Önerilen uygulama sırası

1. **Entity master’ları paralel yap** – Kolay, net kazanç, risk düşük.  
2. **TTS’i story sonrası başlat, response’tan önce bekle** – Orta karmaşıklık, büyük kazanç.  
3. (Opsiyonel) Log’da "photo_character_2" yerine "entity master (Arı)" gibi anlamlı isim – okunabilirlik.

Bu doküman, yapılan değişikliklerin gerekçesi ve timing beklentisi için referans olarak kullanılabilir.

---

## 5. Uygulama durumu (Şubat 2026)

| Öneri | Durum | Kod |
|-------|--------|-----|
| 3.1 Entity master’ları paralel | ✅ Yapıldı | `app/api/books/route.ts` – `Promise.allSettled(storyData.supportingEntities.map(...))` |
| 3.2 TTS pipeline ile örtüştürme | ✅ Yapıldı | Story ready sonrası TTS arka planda başlatılıyor; sayfa görselleri + DB update sonrası `await ttsPrewarmPromise`. From-example path için inline TTS fallback. |
| 3.3 Log "photo_character_2" → anlamlı isim | ⏳ Opsiyonel | — |
