# 📊 Prompt Version Sync Status

**Son Kontrol:** 24 Ocak 2026 (Scene v1.4.0 Character Ratio & Cover Poster)  
**Sorumlu:** @project-manager

---

## 🔄 Sync Durumu

| Module | Code Version | Doc Version | Status | Last Code Update | Last Doc Update |
|--------|-------------|-------------|--------|------------------|-----------------|
| Story | v1.2.0 | v1.0.4 | ✅ Synced | 2026-01-24 | 2026-01-24 |
| Image | v1.4.0 | v1.0.9 | ✅ Synced | 2026-01-24 | 2026-01-24 |

---

## 📝 Son Değişiklikler

### Story Prompts (v1.1.0) - 25 Ocak 2026
- ✅ Story quality enhancements - example text, show-don't-tell, sensory details, pacing control
- ✅ getExampleText() function added - age-group specific examples with dialogue and sensory details
- ✅ Enhanced "show, don't tell" examples - detailed BAD and GOOD examples
- ✅ Enhanced sensory details emphasis - visual, auditory, tactile, olfactory, gustatory
- ✅ Enhanced pacing control - strong hook early, shorter scenes, predictable patterns
- ✅ Enhanced illustration guidelines - sensory details visualization
- ✅ Word count doubled for all age groups (user request) - toddler 70-90, preschool 100-140, etc.
- ✅ Safety & age-appropriate actions section added - avoid risky phrases, prefer safe alternatives
- ✅ Character usage requirements strengthened - all characters must appear, family members minimum pages
- ✅ Character distribution requirements - equal character distribution across pages

**Kod:** `lib/prompts/story/v1.0.0/base.ts`  
**Dokümantasyon:** `STORY_PROMPT_TEMPLATE_v1.0.0.md`  
**Changelog:** `CHANGELOG.md`

### Story Prompts (v1.2.0) - 24 Ocak 2026
- ✅ Page 1 vs Cover rule - first interior page must differ from cover (VISUAL DIVERSITY ## 7)
- ✅ Checklist: "Page 1 only: Scene/composition/camera DIFFERENT from cover"
- ✅ JSON imagePrompt/sceneDescription: "Page 1 only: MUST be DIFFERENT from cover" vurgusu

**Kod:** `lib/prompts/story/v1.0.0/base.ts`  
**Dokümantasyon:** `STORY_PROMPT_TEMPLATE_v1.0.0.md`  
**Changelog:** `CHANGELOG.md`

### Image Prompts (v1.4.0) - 24 Ocak 2026
- ✅ Character ratio 25–35%, max 35%, wider shot, character smaller (getCharacterEnvironmentRatio, getCompositionRules)
- ✅ Cover: poster for entire book, epic wide, dramatic lighting, character max 30–35%, environment-dominant
- ✅ Cover scene description: story-based summary (extractSceneElements, evoke full journey) when storyData exists

**Kod:** `lib/prompts/image/v1.0.0/scene.ts`, `app/api/books/route.ts`  
**Dokümantasyon:** `IMAGE_PROMPT_TEMPLATE_v1.0.0.md`  
**Changelog:** `CHANGELOG.md`

### Image Prompts (v1.3.0) - 24 Ocak 2026
- ✅ Sharp environment & DoF - balanced/environment: deep focus, background sharp and detailed; no blur
- ✅ getDepthOfFieldDirectives() - character: subtle atmospheric haze, environment readable; balanced: deep focus, all planes sharp
- ✅ generateLayeredComposition() - midground/near background sharp; distant fade into soft mist; no "background softly out-of-focus"
- ✅ getCharacterEnvironmentRatio() - "environment sharp and detailed, not blurred" added
- ✅ focusPoint: sayfa 1 → balanced (books route); cover stays character

**Kod:** `lib/prompts/image/v1.0.0/scene.ts`  
**Dokümantasyon:** `IMAGE_PROMPT_TEMPLATE_v1.0.0.md`  
**Changelog:** `CHANGELOG.md`

### Image Prompts (v1.2.0) - 25 Ocak 2026
- ✅ Composition & depth improvements - depth of field, atmospheric perspective, camera angles, character-environment ratio
- ✅ getDepthOfFieldDirectives() added - camera parameters, focus planes, bokeh effects
- ✅ getAtmosphericPerspectiveDirectives() added - color desaturation, contrast reduction, haze
- ✅ getCameraAngleDirectives() added - perspective diversity, child's viewpoint
- ✅ getCharacterEnvironmentRatio() added - 30-40% character, 60-70% environment balance
- ✅ Enhanced getCinematicElements() - specific lighting techniques (golden hour, backlighting, god rays)
- ✅ Enhanced generateLayeredComposition() - depth of field and atmospheric perspective
- ✅ Enhanced getCompositionRules() - camera angle variety and character-environment ratio
- ✅ Enhanced getLightingDescription() - specific lighting techniques, color temperatures, atmospheric particles
- ✅ Enhanced getEnvironmentDescription() - background details, sky, distant elements
- ✅ Enhanced generateFullPagePrompt() - new directives integrated, prompt structure reorganized

**Kod:** `lib/prompts/image/v1.0.0/scene.ts`  
**Dokümantasyon:** `IMAGE_PROMPT_TEMPLATE_v1.0.0.md`  
**Changelog:** `CHANGELOG.md`

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

### Image Prompts (v1.1.0) - 18 Ocak 2026
- ✅ Major optimization - style directives simplified, cinematic elements compressed, environment templates reduced
- ✅ Total ~70% reduction in prompt length while maintaining quality

**Kod:** `lib/prompts/image/v1.0.0/scene.ts`  
**Dokümantasyon:** `IMAGE_PROMPT_TEMPLATE_v1.0.0.md`  
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
