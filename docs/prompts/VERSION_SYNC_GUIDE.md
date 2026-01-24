# 🔄 Prompt Version Sync ve Takip Sistemi

**KidStoryBook Platform - Version Management**

Bu doküman, `lib/prompts/` (kod) ve `docs/prompts/` (dokümantasyon) arasındaki version sync ve takip sistemini açıklar.

---

## 📋 Sorumluluk

**@project-manager** bu sistemin tam sorumlusudur:
- Version sync kontrolü
- Changelog güncellemeleri
- Dokümantasyon-kod senkronizasyonu
- Semantic versioning takibi

---

## 🎯 Sistem Yapısı

### 1. Kod Tarafı (`lib/prompts/`)

Her prompt modülünde `VERSION` objesi bulunur:

```typescript
export const VERSION: PromptVersion = {
  version: '1.0.0',           // Semantic version (major.minor.patch)
  releaseDate: new Date('2026-01-10'),
  status: 'active',
  changelog: [
    'Initial release',
    'Feature X added',
    'Bug Y fixed',
  ],
  author: '@prompt-manager',
}
```

**Dosyalar:**
- `lib/prompts/story/v1.0.0/base.ts` - Story generation
- `lib/prompts/image/v1.0.0/scene.ts` - Scene generation
- `lib/prompts/image/v1.0.0/negative.ts` - Negative prompts
- `lib/prompts/image/v1.0.0/character.ts` - Character prompts

### 2. Dokümantasyon Tarafı (`docs/prompts/`)

**Dosyalar:**
- `STORY_PROMPT_TEMPLATE_v1.0.0.md` - Story template dokümantasyonu
- `IMAGE_PROMPT_TEMPLATE_v1.0.0.md` - Image template dokümantasyonu
- `CHANGELOG.md` - Tüm versiyon geçmişi

---

## 🔄 Sync Kuralları

### Zorunlu Sync Noktaları

1. **Her kod değişikliğinde:**
   - Version numarası güncellenmeli (semantic versioning)
   - Changelog'a entry eklenmeli
   - Dokümantasyon güncellenmeli

2. **Version bump kuralları:**
   - **Major (v1.0.0 → v2.0.0):** Breaking changes, büyük refactoring
   - **Minor (v1.0.0 → v1.1.0):** Yeni özellikler, iyileştirmeler
   - **Patch (v1.0.0 → v1.0.1):** Bug fixes, typo düzeltmeleri

3. **Dokümantasyon güncelleme:**
   - Template dosyalarındaki version numarası kod ile eşleşmeli
   - CHANGELOG.md'ye yeni entry eklenmeli
   - README.md'deki aktif versiyonlar güncellenmeli

---

## 🛠️ Kullanım

### Version Sync Kontrolü

```typescript
import { checkSyncStatus } from '@/lib/prompts/version-sync'

const statuses = checkSyncStatus()
statuses.forEach(status => {
  console.log(`${status.module}: ${status.isSynced ? '✅ Synced' : '❌ Out of sync'}`)
  if (!status.isSynced) {
    console.log(`  Code: ${status.codeVersion}, Doc: ${status.docVersion}`)
  }
})
```

### Yeni Version Oluşturma

1. **Kodda version güncelle:**
   ```typescript
   export const VERSION: PromptVersion = {
     version: '1.0.1', // Bump version
     releaseDate: new Date('2026-01-15'),
     changelog: [
       ...previousChangelog,
       'Fixed bug X', // Yeni entry
     ],
   }
   ```

2. **Dokümantasyonu güncelle:**
   - Template dosyasındaki version numarasını güncelle
   - CHANGELOG.md'ye entry ekle
   - README.md'deki aktif versiyonları güncelle

3. **Sync kontrolü yap:**
   ```bash
   # Run sync check
   npm run prompt:sync-check
   ```

---

## 📊 Version Takip Tablosu

| Module | Code Version | Doc Version | Status | Last Update |
|--------|-------------|-------------|--------|-------------|
| Story | v1.4.0 | v1.0.4 | ✅ Synced | 2026-01-24 |
| Image | v1.7.0 | v1.0.10 | ✅ Synced | 2026-01-24 |
| Character | v1.2.0 | - | ✅ Synced | 2026-01-24 |

---

## ⚠️ Önemli Notlar

1. **Her değişiklik version bump gerektirir:**
   - Küçük bir typo düzeltmesi bile → patch bump
   - Yeni özellik → minor bump
   - Breaking change → major bump

2. **Changelog zorunludur:**
   - Her version bump'ta changelog'a entry eklenmeli
   - Kod ve dokümantasyon changelog'ları sync olmalı

3. **Dokümantasyon güncellemesi zorunludur:**
   - Kod değiştiğinde dokümantasyon da güncellenmeli
   - Template dosyalarındaki version numaraları kod ile eşleşmeli

---

## 🔍 Sync Kontrol Checklist

@project-manager her değişiklikten sonra kontrol etmeli:

- [ ] Kod version numarası güncellendi mi?
- [ ] Changelog'a entry eklendi mi?
- [ ] Dokümantasyon version numarası güncellendi mi?
- [ ] CHANGELOG.md güncellendi mi?
- [ ] README.md'deki aktif versiyonlar güncellendi mi?
- [ ] Sync kontrolü yapıldı mı?

---

**Son Güncelleme:** 24 Ocak 2026 (Image v1.7.0 - Image API Refactor)  
**Sorumlu:** @project-manager
