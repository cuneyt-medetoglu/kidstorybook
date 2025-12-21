# 🧪 POC (Proof of Concept) Planı
# KidStoryBook Platform

**Doküman Versiyonu:** 1.0  
**Tarih:** 21 Aralık 2025  
**Durum:** Planlama

---

## POC Hedefi

**Amaç:** AI ile 10 sayfalık bir çocuk kitabı oluşturarak sistemin çalışabilirliğini kanıtlamak.

**Kritik Test Noktaları:**
1. ✅ Çocuk fotoğrafından karakter oluşturma
2. ✅ Karakter tutarlılığı (her sayfada aynı çocuk görünmeli)
3. ✅ Hikaye metni üretimi (yaş grubuna uygun)
4. ✅ Görsel üretimi (illustration style'a uygun)
5. ✅ Prompt template'lerinin çalışması

---

## POC Akışı

### Adım 1: Kullanıcı Girişleri (Manuel veya Script ile)

```
1. Çocuk fotoğrafı yükle
2. Karakter bilgileri:
   - İsim: "Elif"
   - Yaş: 5
   - Cinsiyet: Kız
   - Saç rengi: Kahverengi
   - Göz rengi: Yeşil
   - Özellikler: Gözlüklü
3. Tema seç: "Macera - Dinozorlar"
4. Yaş grubu: 3-5 yaş
5. Illustration Style: "Watercolor"
6. Dil: Türkçe
7. Özel istekler: "Parkta dinozor yumurtası bulsunlar"
```

### Adım 2: Prompt Template'lerini Oluştur

**2.1 Görsel Prompt Template** → `prompts/PROMPT_IMAGE.md` dokümanından
- Kullanıcı girişlerinden karakter bilgilerini al
- Illustration style'a göre prompt oluştur
- **Not:** Çocuk fotoğrafı analizi AI tarafından yapılacak (GPT-4 Vision veya Gemini Vision)

**2.2 Kitap İçeriği Prompt Template** → `prompts/PROMPT_STORY.md` dokümanından
- Karakter bilgileri
- Tema ve yaş grubu
- Özel istekler
- 10 sayfalık hikaye prompt'u

### Adım 3: AI'a İki Ayrı Prompt Gönder

**3.1 Kitap İçeriği Prompt**
- AI: GPT-4o (veya GPT-4 Turbo)
- 10 sayfalık hikaye metni üret
- Her sayfa için görsel açıklaması (image prompt) dahil
- Çıktı: JSON formatında hikaye + her sayfa için image prompt

**3.2 Görsel Prompt Oluşturma**
- Hikaye çıktısından her sayfa için image prompt al
- Illustration style bilgisi ekle
- Karakter bilgileri ekle
- → Her sayfa için hazır görsel prompt'u

### Adım 4: İki Prompt'u Birleştir

**Script ile:**
- Kitap içeriği çıktısı (metin + image prompt'lar)
- Görsel prompt'ları (style + karakter bilgileri ile zenginleştirilmiş)
- → **Final Prompt** oluştur (`prompts/PROMPT_FINAL.md`)

### Adım 5: Final Prompt + Çocuk Fotoğrafı → AI

**Tek bir AI çağrısı ile:**
- Final prompt + çocuk fotoğrafı (GPT-4 Vision veya Gemini Vision)
- AI: Fotoğrafı analiz eder, karakteri tanır, tüm sayfaları oluşturur
- Çıktı: 10 sayfalık kitap (metin + görsel)
- **Not:** Görsel analizi AI yapacak, biz sadece fotoğrafı göndereceğiz

---

## POC Çıktıları

### 1. Prompt Template Dokümanları
- [ ] `prompts/PROMPT_IMAGE.md` - Görsel üretimi için prompt template
- [ ] `prompts/PROMPT_STORY.md` - Hikaye içeriği için prompt template
- [ ] `prompts/PROMPT_FINAL.md` - Birleştirilmiş final prompt template

### 2. Script
- [ ] `poc-script.js` veya `poc-script.py`
- Kullanıcı girişlerini alır
- Prompt template'lerini doldurur
- AI API'lerine gönderir
- Sonuçları birleştirir

### 3. Örnek Kitap
- [ ] 10 sayfa metin
- [ ] 10 sayfa görsel (veya 5 çift sayfa)
- [ ] Karakter tutarlılığı test sonucu
- [ ] Kalite değerlendirmesi

---

## POC Başarı Kriterleri

### Minimum Başarı:
- ✅ 10 sayfalık kitap oluşturuldu
- ✅ Her sayfada metin var
- ✅ Her sayfada görsel var
- ✅ Karakter ismi hikayede geçiyor

### İdeal Başarı:
- ✅ Karakter her sayfada %70+ benzer görünüyor
- ✅ Hikaye yaş grubuna uygun
- ✅ Illustration style tutarlı
- ✅ Metin ve görsel uyumlu
- ✅ Özel istekler hikayede var

---

## POC Sonrası Değerlendirme

### Test Edilecekler:
1. **Karakter Tutarlılığı:** Her sayfada aynı çocuk görünüyor mu?
2. **Hikaye Kalitesi:** Yaş grubuna uygun mu? Akıcı mı?
3. **Görsel Kalitesi:** Illustration style doğru mu? Çocuklar için uygun mu?
4. **Prompt Etkinliği:** Prompt'lar yeterince detaylı mı?
5. **Maliyet:** Her kitap için ne kadar maliyet?

### İyileştirme Noktaları:
- Prompt template'lerde eksikler
- Karakter tutarlılığı için ek teknikler
- Hikaye kalitesi için prompt iyileştirmeleri
- Maliyet optimizasyonu

---

## Sonraki Adımlar

POC tamamlandıktan sonra:
1. Sonuçları dokümante et
2. İyileştirmeleri belirle
3. FAZ 2 planını güncelle
4. MVP geliştirmeye başla

---

**Son Güncelleme:** 21 Aralık 2025

