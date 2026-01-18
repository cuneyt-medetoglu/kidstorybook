# 📊 Prompt Version Sync Status

**Son Kontrol:** 16 Ocak 2026  
**Sorumlu:** @project-manager

---

## 🔄 Sync Durumu

| Module | Code Version | Doc Version | Status | Last Code Update | Last Doc Update |
|--------|-------------|-------------|--------|------------------|-----------------|
| Story | v1.0.3 | v1.0.3 | ✅ Synced | 2026-01-18 | 2026-01-18 |
| Image | v1.0.5 | v1.0.5 | ✅ Synced | 2026-01-16 | 2026-01-16 |

---

## 📝 Son Değişiklikler

### Story Prompts (v1.0.3) - 18 Ocak 2026
- ✅ Character mapping per page - story generation returns characterIds for each page
- ✅ CHARACTER MAPPING section added to prompt
- ✅ characterIds field required in StoryPage type
- ✅ Validation added for characterIds in story response
- ✅ Text-based character detection replaced with structured characterIds
- ✅ Multiple characters support with detailed appearance descriptions
- ✅ Character name usage emphasized (not generic terms)
- ✅ Age, hair color, eye color, special features for all character types

**Kod:** `lib/prompts/story/v1.0.0/base.ts`  
**Dokümantasyon:** `STORY_PROMPT_TEMPLATE_v1.0.0.md`  
**Changelog:** `CHANGELOG.md`

### Image Prompts (v1.0.5) - 16 Ocak 2026
- ✅ Multiple reference images support (all characters' reference images sent)
- ✅ CRITICAL INSTRUCTION for multiple characters with reference images
- ✅ Enhanced family member descriptions (age, hair, eye color, features)
- ✅ Individual character emphasis (eye color preservation, specific person not generic)

**Kod:** `lib/prompts/image/v1.0.0/character.ts`  
**Dokümantasyon:** `IMAGE_PROMPT_TEMPLATE_v1.0.0.md`  
**Changelog:** `CHANGELOG.md`

---

## ⚠️ Sync Kontrol Checklist

Her değişiklikten sonra kontrol edilmeli:

- [x] Kod version numarası güncellendi
- [x] Changelog'a entry eklendi
- [x] Dokümantasyon version numarası güncellendi
- [x] CHANGELOG.md güncellendi
- [x] README.md'deki aktif versiyonlar güncellendi
- [x] Sync kontrolü yapıldı

---

**Not:** Bu dosya her version değişikliğinde güncellenmelidir.
