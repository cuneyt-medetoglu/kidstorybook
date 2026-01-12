# 📚 Prompt Templates Documentation

**KidStoryBook Platform - Prompt Management**

Bu klasör, KidStoryBook platformunun AI prompt template'lerini içerir.

---

## 📁 Dosya Yapısı

```
docs/prompts/
├── README.md (bu dosya)
├── CHANGELOG.md - Versiyon geçmişi ve değişiklikler
├── IMAGE_PROMPT_TEMPLATE_v1.0.0.md - Görsel üretimi prompt template
└── STORY_PROMPT_TEMPLATE_v1.0.0.md - Hikaye üretimi prompt template
```

---

## 🎯 Aktif Template'ler

### Image Generation (v1.0.0)
- **Dosya:** `IMAGE_PROMPT_TEMPLATE_v1.0.0.md`
- **Kullanım:** GPT-image modelleri için görsel üretimi
- **Özellikler:** Karakter tutarlılığı, detaylı talimatlar, stil açıklamaları
- **Durum:** ✅ Dokümante edildi, kod entegrasyonu bekleniyor

### Story Generation (v1.0.0)
- **Dosya:** `STORY_PROMPT_TEMPLATE_v1.0.0.md`
- **Kullanım:** GPT modelleri için hikaye üretimi
- **Özellikler:** Yaş grubuna uygun dil, tema varyasyonları, eğitici değerler
- **Durum:** ✅ Dokümante edildi, kod entegrasyonu bekleniyor

---

## 🔄 Versiyonlama

Template'ler semantic versioning (v1.0.0) kullanır:
- **Major (v1, v2, v3...):** Büyük değişiklikler, breaking changes
- **Minor (v1.1, v1.2...):** Küçük iyileştirmeler, yeni özellikler
- **Patch (v1.0.1, v1.0.2...):** Bug düzeltmeleri, typo düzeltmeleri

Detaylı versiyon geçmişi için: `CHANGELOG.md`

---

## 📝 Kullanım

Bu template'ler şu anda **dokümantasyon** olarak kullanılıyor. Kod entegrasyonu için `lib/prompts/` klasöründeki fonksiyonların template'lere göre güncellenmesi gerekiyor.

### Mevcut Durum
- ✅ Template'ler dokümante edildi
- ✅ Bug düzeltildi (generateFullPagePrompt çağrısı)
- ⏳ Kod entegrasyonu bekleniyor (template'lerdeki detaylı yapı henüz koda eklenmedi)

### Sonraki Adımlar
1. Template'lerdeki detaylı prompt yapısını `lib/prompts/` klasörüne entegre et
2. Test et ve feedback topla
3. v1.1.0 için iyileştirmeler

---

## 🔗 İlgili Dosyalar

- `lib/prompts/image/v1.0.0/scene.ts` - Mevcut görsel prompt oluşturma kodu
- `lib/prompts/story/v1.0.0/base.ts` - Mevcut hikaye prompt oluşturma kodu
- `poc/server.js` - POC implementasyonu (referans)
- `docs/reports/IMAGE_QUALITY_ANALYSIS.md` - Kalite analizi raporu

---

**Son Güncelleme:** 15 Ocak 2026  
**Yöneten:** @prompt-manager agent

