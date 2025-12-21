# 🧪 POC (Proof of Concept) Planı
# KidStoryBook Platform

**Doküman Versiyonu:** 3.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Planlama - Final

---

## POC Hedefi

**Amaç:** AI ile 10 sayfalık bir çocuk kitabı oluşturarak prompt'ların çalışabilirliğini kanıtlamak ve iteratif olarak iyileştirmek.

**Kritik Test Noktaları:**
1. ✅ Prompt'un fotoğraf analizi talimatları
2. ✅ Karakter tutarlılığı (her sayfada aynı çocuk görünmeli)
3. ✅ Hikaye metni üretimi (yaş grubuna uygun)
4. ✅ Görsel üretimi (illustration style'a uygun)
5. ✅ Prompt'un TR ve EN versiyonları

---

## POC Akışı (Basitleştirilmiş)

### Adım 1: Prompt Hazırlama (Ben)

**Ben hazırlayacağım:**
- Final prompt (TR versiyonu)
- Final prompt (EN versiyonu)
- Version sistemi (v1, v2, v3...)
- Her versiyon için changelog

**Prompt içeriği:**
- Kitap içeriği talimatları
- Fotoğraf analizi talimatları
- Karakter tutarlılığı talimatları
- Illustration style talimatları
- Çıktı formatı talimatları

---

### Adım 2: Prompt + Fotoğraf → AI (Sen)

**Sen yapacaksın:**
1. Benim hazırladığım prompt'u al (TR veya EN)
2. Çocuk fotoğrafını hazırla
3. Prompt + fotoğrafı AI'a gönder:
   - ChatGPT (GPT-4 Vision) veya
   - Gemini (Gemini Vision)
4. AI'ın çıktısını al (10 sayfalık kitap)

**Not:** Script yok, manuel olarak ChatGPT/Gemini'ye göndereceksin.

---

### Adım 3: Değerlendirme ve İyileştirme (Birlikte)

**Sen değerlendireceksin:**
- Kitap kalitesi nasıl?
- Karakter tutarlılığı var mı?
- Hikaye yaş grubuna uygun mu?
- Görseller doğru mu?
- Eksik/yanlış ne var?

**Birlikte iyileştireceğiz:**
- Beğenmediğin noktaları söyle
- Prompt'ta ne değişmeli tartışalım
- Yeni versiyon hazırlayalım (v2, v3...)
- Tekrar test edelim

**İteratif süreç:**
```
v1 → Test → Feedback → v2 → Test → Feedback → v3 → ...
```

---

## Prompt Versiyonlama Sistemi

### Versiyon Formatı

**Dosya adları:**
- `PROMPT_FINAL_TR_v1.md` - Türkçe v1
- `PROMPT_FINAL_EN_v1.md` - İngilizce v1
- `PROMPT_FINAL_TR_v2.md` - Türkçe v2
- `PROMPT_FINAL_EN_v2.md` - İngilizce v2

**Changelog:**
- Her versiyon için değişiklik notları
- Ne değişti, neden değişti
- Test sonuçları

---

## POC Çıktıları

### 1. Prompt Template'leri
- [x] `prompts/PROMPT_FINAL_TR_v1.md` - Türkçe final prompt v1
- [x] `prompts/PROMPT_FINAL_EN_v1.md` - İngilizce final prompt v1
- [ ] `prompts/PROMPT_FINAL_TR_v2.md` - Türkçe final prompt v2 (feedback sonrası)
- [ ] `prompts/PROMPT_FINAL_EN_v2.md` - İngilizce final prompt v2 (feedback sonrası)

### 2. Changelog
- [ ] `prompts/CHANGELOG.md` - Tüm versiyon değişiklikleri

### 3. Test Sonuçları
- [ ] Test 1 sonuçları ve feedback
- [ ] Test 2 sonuçları ve feedback
- [ ] ...

### 4. Örnek Kitap
- [ ] v1 ile oluşturulmuş 10 sayfalık kitap
- [ ] v2 ile oluşturulmuş 10 sayfalık kitap (varsa)
- [ ] Karşılaştırma ve değerlendirme

---

## POC Başarı Kriterleri

### Minimum Başarı:
- ✅ Prompt çalışıyor (AI kitap oluşturuyor)
- ✅ 10 sayfalık kitap oluşturuldu
- ✅ Her sayfada metin var
- ✅ Her sayfada görsel var
- ✅ AI fotoğrafı analiz edip karakteri tanıdı

### İdeal Başarı:
- ✅ Karakter her sayfada %70+ benzer görünüyor
- ✅ Hikaye yaş grubuna uygun
- ✅ Illustration style tutarlı
- ✅ Metin ve görsel uyumlu
- ✅ Özel istekler hikayede var
- ✅ Prompt TR ve EN versiyonları çalışıyor

---

## Test Senaryoları

### Senaryo 1: Temel Test
- **Dil:** Türkçe
- **Yaş:** 5 yaş
- **Tema:** Macera - Dinozorlar
- **Style:** Watercolor
- **Fotoğraf:** 1 çocuk fotoğrafı

### Senaryo 2: İngilizce Test
- **Dil:** İngilizce
- **Yaş:** 5 yaş
- **Tema:** Adventure - Space
- **Style:** 3D Animation
- **Fotoğraf:** 1 çocuk fotoğrafı

### Senaryo 3: Farklı Yaş Grubu
- **Dil:** Türkçe
- **Yaş:** 3 yaş (daha basit)
- **Tema:** Eğitici - Sayılar
- **Style:** Cartoon
- **Fotoğraf:** 1 çocuk fotoğrafı

---

## Feedback Formatı

**Test sonrası feedback için:**
```
Test Tarihi: [TARIH]
Prompt Versiyonu: v1 (TR)
Test Senaryosu: [SENARYO]

Değerlendirme:
- Karakter Tutarlılığı: [1-5] - [YORUM]
- Hikaye Kalitesi: [1-5] - [YORUM]
- Görsel Kalitesi: [1-5] - [YORUM]
- Genel Memnuniyet: [1-5] - [YORUM]

İyileştirme Önerileri:
- [ÖNERİ 1]
- [ÖNERİ 2]
- [ÖNERİ 3]
```

---

## Sonraki Adımlar

1. ✅ Prompt'ları hazırla (TR + EN v1)
2. ⏳ Sen test et (ChatGPT/Gemini'ye gönder)
3. ⏳ Feedback ver
4. ⏳ Prompt'u iyileştir (v2)
5. ⏳ Tekrar test et
6. ⏳ İteratif olarak iyileştir

---

**Son Güncelleme:** 21 Aralık 2025  
**Not:** Script yok, manuel test. Prompt'ları ChatGPT/Gemini'ye kopyala-yapıştır yaparak test edeceksin.
