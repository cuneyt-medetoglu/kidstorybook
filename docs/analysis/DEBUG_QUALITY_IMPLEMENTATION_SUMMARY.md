# Debug Kalite Butonları – Uygulama Özeti

**Tarih:** 7 Şubat 2026

## ✅ Tamamlananlar

### 1. Backend

#### Config
- `lib/config.ts` → `showDebugQualityButtons` feature flag eklendi
- `.env` → `SHOW_DEBUG_QUALITY_BUTTONS=true` parametresi eklendi

#### API Endpoints
- `GET /api/debug/quality/can-show` → Admin + feature flag kontrolü
- `POST /api/debug/quality/generate-masters` → Masters debug (şu an snapshot; gerçek generation eklenebilir)

### 2. Frontend

#### Bileşenler
- `components/debug/DebugModal.tsx` → Request/Response modal (JSON viewer, copy, önizleme)
- `components/debug/DebugQualityPanel.tsx` → 4 debug bloğu (Hikaye, Masters, Kapak, Sayfa X)

#### Entegrasyon
- `app/create/step6/page.tsx` → Debug paneli admin'e gösteriliyor

#### Package
- `@uiw/react-json-view` kuruldu

## 🎯 Özellikler

### Aktif (Test edilebilir)
1. **Sadece Hikaye**: Mevcut `/api/ai/generate-story` ile test edilebilir
2. **Masters (karakter + entity)**: `POST /api/books` ile `debugRunUpTo: 'masters'`. Gerçek akış: hikaye → karakter masters → entity masters (hayvan/nesne); kitap kaydedilmez. Prompt/kalite iyileştirmesi için çıktılar modal’da incelenebilir

### Aktif (7 Şubat 2026 – debug run-up-to cover)
3. **Kapak (gerçek akış)**: `POST /api/books` ile `debugRunUpTo: 'cover'`. Backend hikaye → masters → kapak çalıştırır, kitap kaydetmez (silinir), response’ta `coverUrl` + debug bilgisi döner. Step 6 debug panelinde "3. Kapak (gerçek akış)" butonu ile test edilir.

### Yakında (UI'da disabled)
4. **Sadece Sayfa X**: Endpoint eklendikten sonra aktif edilecek

## 🚀 Kullanım

### Gereksinimler
1. `.env` → `SHOW_DEBUG_QUALITY_BUTTONS=true`
2. DB'de kullanıcı `role = 'admin'`

### Nasıl Test Edilir
1. Step 6'ya git (ödeme/kitap oluşturma sayfası)
2. "Debug Kalite Paneli (Admin)" kartını aç
3. İstediğin test butonuna tıkla
4. Request/Response modal'ı otomatik açılır
5. JSON'u incele, kopyala veya görsel önizlemesini gör

## 📋 Mevcut Akışa Etkisi

- ✅ Mevcut akışlarda hiçbir değişiklik yok
- ✅ Sadece admin kullanıcılar debug panelini görür
- ✅ Feature flag ile açılıp kapatılabilir
- ✅ Normal kullanıcılar etkilenmez

## 📋 Debug Trace (tek create-book’ta tüm adımlar)

**Tarih:** 7 Şubat 2026

- **İhtiyaç:** Create book’a basınca nereye ne istek gidip ne response geldiğini **baştan sona** raw görmek (örn. “3 sayfa istedim 10 geldi” gibi hataları debug etmek).
- **Çözüm:** `POST /api/books` body’de `debugTrace: true` (admin + showDebugQualityButtons). Backend her adımda request/response’u toplar; response’ta `debugTrace: [{ step, request, response }, ...]` döner.
- **Sıra:** 1) story, 2) master_character_*, 3) entity_master_*, 4) cover, 5) page_1, page_2, …
- **Frontend:** Step 6’da “Create without payment” üzerinde checkbox: “Tüm adımların request/response'ını topla (debug trace)”. İşaretleyip create edince kitap oluşur, sonra **Trace viewer** modal açılır; her adım açılır/kapanır bloklarda raw request + response gösterilir. Kapatınca dashboard’a yönlendirilir.
- **Dosyalar:** `app/api/books/route.ts` (debugTrace toplama), `components/debug/TraceViewerModal.tsx`, Step 6 (checkbox + modal).

## 🔄 Sıradaki Adımlar (Opsiyonel)

1. **Sayfa X (debug run-up-to page)**: İsteğe bağlı `debugRunUpTo: 'page'` + `pageNumber` ile tek sayfa üretimi (create-book’ta aynı mantık)

## ❓ Sık Sorulanlar (Request / Sayfa sayısı)

### 1) Karakter saç/göz rengi request’te nerede? Hikayeye ekleniyor mu, master’da mı?

- **API’ye giden body’de yok:** `apiRequest` sadece `characterId`, `theme`, `illustrationStyle`, `language` vb. içerir. Karakter görünümü backend’de `characterId` ile DB’den çekilir.
- **AI’a giden prompt’ta var:** `aiRequest.userMessage` içinde **PHYSICAL APPEARANCE** bloğu var: skin tone, hair (color/style), eyes, face shape. Bu blok `lib/prompts/story/base.ts` → `referencePhotoAnalysis` (character.description) ile doldurulur. Yani hikaye metninde saç/göz rengi yazmıyoruz (DO NOT DESCRIBE VISUAL DETAILS) ama **görsel tutarlılığı** için modele “bu karakter böyle çizilsin” bilgisi veriliyor.
- **Master illüstrasyonda:** Karakter master’ı oluşturulurken hem **referans foto** (yüz/vücut) hem de metin prompt kullanılıyor; görünüm karakter kaydından (description) geliyor. Sayfa görselleri de master + sahne prompt’u ile üretiliyor. Özet: saç/göz bilgisi hikaye JSON’una eklenmiyor, **hikaye prompt’unda** (userMessage) ve **master/sayfa görsel üretiminde** kullanılıyor.

### 2) Step 5’te 3 yazdım ama 10 sayfa geldi / varsayılan 12 olmalı

- **Sebep:** `POST /api/ai/generate-story` body’sinde **pageCount** yoktu; prompt’taki varsayılan (o tarihte 10) kullanılıyordu. Debug panel “Sadece Hikaye” de step5’teki sayfa sayısını göndermiyordu.
- **Yapılan düzeltmeler:**
  - `api/ai/generate-story`: İstekte **pageCount** (2–20) kabul ediliyor; `generateStoryPrompt(..., pageCount)` ile prompt’a iletilir.
  - Debug panel “Sadece Hikaye”: `wizardData.step5.pageCount` artık request body’ye ekleniyor.
  - Varsayılan sayfa: `lib/prompts/story/base.ts` → `getPageCount()` içinde **varsayılan 12** yapıldı. Override yoksa 12 sayfa istenir.
- Step 5’te 3 yazıp “Sadece Hikaye” veya tam kitap oluşturduğunda artık 3 sayfa isteği AI’a gidecek.

## 📄 Orijinal Plan (Özet)

Debug kalite butonları şu plana göre hayata geçirildi: (1) Sadece hikaye — generate-story; (2) Sadece masters — create-book `debugRunUpTo: 'masters'`; (3) Sadece kapak — `debugRunUpTo: 'cover'`; (4) Sadece sayfa X — yakında. Request/response modal ile JSON + önizleme; admin + feature flag. Detaylı orijinal plan metni artık bu özette birleştirildi.

## 📝 Notlar

- Debug modal JSON viewer ile collapse/expand destekliyor
- Request ve Response ayrı sekmelerde gösteriliyor
- Görsel URL'ler otomatik önizleniyor
- Hata durumunda da aynı modal açılıyor
- Clipboard'a kopyalama özelliği var
