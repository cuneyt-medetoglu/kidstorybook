# Custom Theme & Theme Merge Analizi

**Tarih:** 2026-03-01  
**Konu:** Step 3'e Custom tema eklenmesi, 6 temanın 5'e indirilmesi, Custom seçildiğinde Step 5 zorunlu alanı  
**Durum:** Onay Bekliyor (Development başlamadı)  

---

## 1. Mevcut Durum

### 1.1. Step 3 — 6 Tema (Mevcut)

| # | ID | Başlık | Açıklama |
|---|----|---------|----|
| 1 | `adventure` | Adventure | Exciting journeys and thrilling quests |
| 2 | `fairy_tale` | Fairy Tale | Magical stories with princesses and castles |
| 3 | `educational` | Educational | Learning adventures with fun facts |
| 4 | `nature` | Nature & Animals | Wildlife adventures in nature |
| 5 | `space` | Space & Science | Cosmic adventures and discoveries |
| 6 | `sports` | Sports & Activities | Active adventures and team spirit |

### 1.2. Step 5 — Custom Requests (Mevcut)
- **Durum:** Tamamen opsiyonel, max 500 karakter
- **Validation:** `z.string().max(500).optional().or(z.literal(""))`
- **Zorunluluk yok**, herhangi bir şart bağlı değil

---

## 2. Tema Merge Analizi — Hangisi Birleştirilmeli?

### 2.1. Merge Adayları

| Seçenek | Birleştirilen Temalar | Gerekçe | Puan |
|---------|----------------------|---------|------|
| **A** | Educational + Space & Science | Space & Science özünde eğitim/keşif temasıdır. Her ikisi de "öğrenme/discovery" odaklı. | ⭐⭐⭐⭐⭐ |
| B | Adventure + Sports & Activities | Her ikisi de fiziksel/aktif; ancak adventure daha geniş kapsamlı | ⭐⭐⭐ |
| C | Fairy Tale + Adventure | Fantezi-macera örtüşmesi var; ancak fairy tale çok ayrı bir atmosfer | ⭐⭐ |

### 2.2. Önerilen Merge: Educational + Space & Science → **"Learning & Discovery"**

**Gerekçe:**
- Space & Science zaten `getThemeConfig()` içinde "exploration, discovery, wonder, science" olarak tanımlı — bunlar Educational temanın doğal uzantısı
- UI'dan seçen bir kullanıcı için "uzay macerası" ve "eğitici macera" arasındaki fark minimal
- Mevcut backend `getThemeConfig()`'ta `space` anahtarı var, `educational` için fallback `adventure`'a düşüyor (zaten bir sorun vardı)
- Birleştirince her iki kitleyi de kapsar: "Learning adventures with science and cosmic discoveries"

**Yeni Birleşik Tema:**

| ID | Başlık | Açıklama |
|----|---------|---------|
| `educational` | Learning & Discovery | Science, facts, and cosmic adventures |

> **Not:** ID olarak `educational` tutulacak (geriye dönük uyumluluk). Sadece başlık ve açıklama güncellenir. Space ikonları + eğitim elementleri birleştirilir.

### 2.3. Yeni 6 Kart Düzeni (5 Tema + 1 Custom)

| # | ID | Başlık | Değişim |
|---|----|---------|----|
| 1 | `adventure` | Adventure | Değişmedi |
| 2 | `fairy_tale` | Fairy Tale | Değişmedi |
| 3 | `educational` | Learning & Discovery | **Güncellendi** (Space & Science birleşti) |
| 4 | `nature` | Nature & Animals | Değişmedi |
| 5 | `sports` | Sports & Activities | Değişmedi |
| 6 | `custom` | **Custom** | **YENİ** |

---

## 3. Custom Tema — Tasarım Kararları

### 3.1. Custom Tema Davranışı

1. **Step 3'te seçildiğinde:** Normal bir tema gibi seçilir, `id: "custom"` kayıt edilir
2. **Step 4 (İllüstrasyon stili):** Değişiklik yok, tüm stiller custom'la uyumlu
3. **Step 5'e gelindiğinde:**
   - Tema `custom` ise banner göster: "Since you selected Custom theme, please describe your story idea below (required)"
   - `customRequests` alanı **zorunlu** hale gelir (min 10 karakter, max 500 karakter)
   - Label: `"Story Idea (required for Custom theme)"`
4. **Step 5'te ileri gidilmek istendiğinde:**
   - Custom seçili ama alan boş → hata göster, geçme izni verme
5. **Step 6 (Özet):**
   - Tema "Custom" olarak gösterilir
   - Custom request summary'de vurgulanır
6. **API (backend):**
   - `theme === "custom"` ise `customRequests` boş olamaz — validation hatası döner
   - Prompt'ta custom tema için nötr/esnek config kullanılır
   - Kıyafet: `age-appropriate casual clothing` (fallback zaten bu)

### 3.2. Custom Tema İçin Prompt Davranışı

Custom tema seçildiğinde story direction tamamen `customRequests`'ten gelir.  
`buildStorySeedSection()` zaten bunu yapar. Eklenmesi gereken:

```typescript
// getThemeConfig() içine eklenecek
custom: {
  name: 'Custom',
  mood: 'imaginative',
  setting: 'based on the story seed provided by the author',
  commonElements: ['creativity', 'imagination', 'unique adventure'],
  clothingStyle: 'age-appropriate casual clothing suitable for the story setting',
  clothingExamples: {
    correct: ['age-appropriate casual clothing', 'outfit fitting the story'],
    wrong: []
  }
}
```

---

## 4. Etki Analizi — Değişmesi Gereken Dosyalar

### 4.1. Frontend (UI)

| Dosya | Değişiklik | Önem |
|-------|-----------|------|
| `app/create/step3/page.tsx` | Tema array güncelle (merge + custom ekle), Zod enum güncelle | 🔴 Kritik |
| `app/create/step5/page.tsx` | Custom seçiliyse zorunlu validation, banner/info göster | 🔴 Kritik |
| `app/create/step6/page.tsx` | Custom theme summary göster, submit öncesi re-validate | 🟡 Önemli |

### 4.2. Backend (API & Prompts)

| Dosya | Değişiklik | Önem |
|-------|-----------|------|
| `lib/prompts/story/base.ts` — `getThemeConfig()` | `custom` config ekle, `educational` genişlet (space elementleri dahil), `space` tutulsun (geriye dönük uyumluluk) | 🔴 Kritik |
| `app/api/books/route.ts` — `normalizeThemeKey()` | `custom` key geçsin, eski `space` key geriye dönük uyumlu olsun | 🔴 Kritik |
| `app/api/books/route.ts` — `themeClothingForMaster` (2 adet) | `custom` için fallback ekle | 🟡 Önemli |
| `app/api/books/route.ts` — validation | `theme === "custom"` ise `customRequests` zorunlu validation | 🟡 Önemli |

### 4.3. Değişmeyecek Dosyalar

| Dosya | Neden Değişmiyor |
|-------|----------------|
| `lib/db/books.ts` | `theme: string` — tip zaten string, DB şema değişimi yok |
| `lib/db/drafts.ts` | `theme: string` — aynı gerekçe |
| `lib/wizard-state.ts` | `theme: string` — aynı gerekçe |
| `lib/draft-storage.ts` | `theme: string` — aynı gerekçe |
| DB migration | Tema string olarak saklanıyor, yeni değer sadece yeni bir string |

---

## 5. Geriye Dönük Uyumluluk

- Mevcut kitaplarda `theme: "space"` veya `theme: "educational"` kayıtlı olanlar etkilenmez
- `getThemeConfig()`'ta `space` ve `educational` anahtarları korunacak
- `normalizeThemeKey()` eski key'leri de handle edecek
- Step 3 UI'da `space` artık seçilemez (merge edildi) ama mevcut draft'larda `space` seçili kaldıysa step 5'e devam edebilir

---

## 6. Faz Planı

### Faz A: UI Değişiklikleri (Step 3 + Step 5)

**Kapsam:**
1. `app/create/step3/page.tsx`
   - `themes` array: `space` çıkar, `educational` güncelle (başlık + açıklama + icon), `custom` ekle
   - Zod enum: `"space"` çıkar, `"custom"` ekle
   - Custom kartı: özel icon (Wand2 veya Pen), özel renk (gradient), açıklama: "Your own unique story idea"
2. `app/create/step5/page.tsx`
   - Sayfa mount'unda localStorage'dan `step3.theme` oku
   - `isCustomTheme` state türet
   - Zod schema: custom seçiliyse `min(10, "Please describe your story idea")` validation
   - Banner/info card göster: "Custom theme requires a story description"
   - Label güncellemesi: `"Story Idea"` → `"Story Idea (required)"` when custom

### Faz B: Backend Değişiklikleri

**Kapsam:**
1. `lib/prompts/story/base.ts`
   - `getThemeConfig()`: `custom` config ekle, `educational` genişlet
2. `app/api/books/route.ts`
   - `normalizeThemeKey()`: `custom` passthrough
   - `themeClothingForMaster` (2 adet): `custom` için `'age-appropriate casual clothing'` ekle
   - Validation: `theme === "custom" && !customRequests?.trim()` → 400 Bad Request

### Faz C: Step 6 & Polish

**Kapsam:**
1. `app/create/step6/page.tsx`
   - Summary bölümünde custom request'i vurgula (tema "Custom" ise)
   - Submit öncesi client-side kontrol: custom + boş request → Step 5'e yönlendir

---

## 7. Custom Kart Tasarımı (Öneri)

```
┌────────────────────────────────┐
│  🎨 (gradient: pink to purple) │
│                                │
│  Custom                        │
│  Your own unique story idea    │
└────────────────────────────────┘
```

- **Icon:** `Wand2` (lucide-react'te mevcut)
- **Gradient:** `from-fuchsia-500 to-violet-500`
- **Border:** `border-fuchsia-500`
- **Açıklama:** "Your own unique story idea"

---

## 8. Step 5 Custom Banner Tasarımı (Öneri)

```
┌─────────────────────────────────────────────────────┐
│  ✨  Custom Theme Selected                          │
│  Since you chose a custom theme, please describe   │
│  your story idea below. This field is required.    │
└─────────────────────────────────────────────────────┘
```

- Sarı/amber veya mor/purple tonda info banner
- Tema `custom` değilse gizli

---

## 9. API Validation Değişikliği

```typescript
// app/api/books/route.ts — mevcut validation bloğundan sonra eklenecek
if (themeKey === 'custom' && (!customRequests || !customRequests.trim())) {
  return CommonErrors.badRequest(
    'customRequests is required when theme is custom'
  )
}
```

---

## 10. Özet Kontrol Listesi

### Faz A (UI)
- [ ] `step3/page.tsx`: `space` tema çıkar
- [ ] `step3/page.tsx`: `educational` tema güncelle (Learning & Discovery)
- [ ] `step3/page.tsx`: `custom` tema kartı ekle
- [ ] `step3/page.tsx`: Zod enum güncelle
- [ ] `step5/page.tsx`: localStorage'dan theme oku (`isCustomTheme`)
- [ ] `step5/page.tsx`: Conditional Zod validation (custom → min 10)
- [ ] `step5/page.tsx`: Custom banner/info card
- [ ] `step5/page.tsx`: Label değişikliği (required indicator)

### Faz B (Backend)
- [ ] `base.ts` `getThemeConfig()`: `custom` config ekle
- [ ] `base.ts` `getThemeConfig()`: `educational` genişlet
- [ ] `route.ts` `normalizeThemeKey()`: `custom` handle et
- [ ] `route.ts` `themeClothingForMaster` (satır 1111): `custom` ekle
- [ ] `route.ts` `themeClothingForMaster` (satır 1203): `custom` ekle
- [ ] `route.ts`: custom + empty customRequests validation

### Faz C (Polish)
- [ ] `step6/page.tsx`: Custom request summary
- [ ] `step6/page.tsx`: Client-side validation (custom + boş → step5'e yönlendir)

### Dokümantasyon (İş Bitiminde)
- [ ] `docs/ROADMAP.md` güncelle
- [ ] `docs/prompts/STORY_PROMPT_TEMPLATE.md`: custom tema notu ekle
- [ ] `docs/implementation/FAZ{X}_IMPLEMENTATION.md` güncelle

---

*Doküman sahibi: @project-manager*  
*Onay sonrası development başlar*
