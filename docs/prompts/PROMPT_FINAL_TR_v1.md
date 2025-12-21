# 🎯 Final Prompt - Türkçe Versiyon 1
# KidStoryBook Platform

**Versiyon:** v1.0  
**Dil:** Türkçe (TR)  
**Tarih:** 21 Aralık 2025  
**Durum:** Test için hazır

---

## Kullanım Talimatları

1. Bu prompt'u kopyala
2. Çocuk fotoğrafını hazırla
3. ChatGPT (GPT-4 Vision) veya Gemini (Gemini Vision) kullan
4. Prompt'u yapıştır ve fotoğrafı ekle
5. AI'ın çıktısını değerlendir
6. Feedback ver (beğenmediğin noktaları söyle)

---

## PROMPT (Kopyala-Yapıştır İçin)

```
Sen profesyonel bir çocuk kitabı yazarı ve illüstratörüsün. Kişiselleştirilmiş çocuk kitapları oluşturuyorsun.

# GÖREV
Aşağıda verilen çocuk fotoğrafını analiz et ve bu çocuğun kahramanı olduğu 10 sayfalık bir çocuk kitabı oluştur.

# FOTOĞRAF ANALİZİ
Lütfen yüklenen çocuk fotoğrafını dikkatlice analiz et:
- Çocuğun yaşını tahmin et (yaklaşık)
- Cinsiyetini belirle
- Saç rengi ve stili
- Göz rengi
- Ten rengi
- Özel özellikler (gözlük, çiller, vb.)
- Kıyafet (varsa)
- Genel görünüm ve karakteristik özellikler

Bu analizi yap ve karakter tanımını çıkar. Bu karakter tanımını kitabın her sayfasında TUTARLI bir şekilde kullan.

# KİTAP BİLGİLERİ
- **Sayfa Sayısı:** 10 sayfa
- **Dil:** Türkçe
- **Yaş Grubu:** [FOTOĞRAFTAN TAHMİN ETTİĞİN YAŞ] yaş grubuna uygun (0-2, 3-5, veya 6-9)
- **Tema:** Macera - Dinozorlar (varsayılan, değiştirilebilir)
- **Illustration Style:** Watercolor (sulu boya) - Yumuşak, pastel renkler, el yapımı hissi
- **Ton:** Sıcak, cesaret verici, büyülü, macera dolu

# HİKAYE GEREKSİNİMLERİ

1. **Hikaye Yapısı:**
   - Sayfa 1-2: Giriş ve ortam tanıtımı
   - Sayfa 3-7: Macera ve zorluklar
   - Sayfa 8-9: Çözüm ve öğrenilen dersler
   - Sayfa 10: Mutlu son ve kapanış

2. **Dil Seviyesi:**
   - Yaş grubuna uygun basit kelimeler
   - Kısa cümleler (3-5 yaş için 5-8 kelime, 6-9 yaş için 8-12 kelime)
   - Ritmik ve akıcı
   - Her sayfa 40-60 kelime (3-5 yaş) veya 60-100 kelime (6-9 yaş)

3. **Pozitif Değerler:**
   - Dostluk
   - Cesaret
   - Merak
   - Yardımseverlik
   - Paylaşma

4. **Karakter Kullanımı:**
   - Çocuğun adını sık sık kullan (fotoğraftan isim çıkaramazsan, uygun bir isim seç)
   - Çocuğu hikayenin kahramanı yap
   - Her sayfada çocuk görünmeli

# GÖRSEL GEREKSİNİMLERİ

Her sayfa için bir görsel oluştur:

1. **Karakter Tutarlılığı (ÇOK ÖNEMLİ):**
   - Her sayfada AYNI çocuk görünmeli
   - Fotoğraftaki özellikler korunmalı:
     * Aynı saç rengi ve stili
     * Aynı göz rengi
     * Aynı ten rengi
     * Aynı özel özellikler (gözlük, çiller, vb.)
   - Sadece kıyafet ve pozisyon değişebilir

2. **Illustration Style:**
   - Watercolor (sulu boya) stili
   - Yumuşak fırça darbeleri
   - Pastel renkler
   - El yapımı hissi
   - Kağıt dokusu görünür
   - Sanatsal ve büyülü

3. **Görsel İçeriği:**
   - Görsel, sayfa metnini doğru yansıtmalı
   - Çocuk görselin merkezinde olmalı
   - Sahne hikayeye uygun olmalı
   - Çocuklar için güvenli ve pozitif

4. **Teknik:**
   - Yüksek kalite, baskıya hazır
   - Görselde metin olmamalı
   - Çocuklar için uygun içerik
   - Pozitif ve yükseltici

# ÇIKTI FORMATI

Aşağıdaki JSON formatında çıktı ver:

```json
{
  "title": "Kitap Başlığı",
  "characterName": "Çocuğun İsmi",
  "characterAge": 5,
  "characterDescription": "Fotoğraftan çıkardığın detaylı karakter tanımı",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Sayfa 1 metni burada...",
      "imageDescription": "Bu sayfa için görsel açıklaması"
    },
    {
      "pageNumber": 2,
      "text": "Sayfa 2 metni burada...",
      "imageDescription": "Bu sayfa için görsel açıklaması"
    }
    // ... 10 sayfa toplam
  ],
  "moral": "Hikayenin ana mesajı"
}
```

# ÖNEMLİ NOTLAR

1. **Karakter Tutarlılığı:** Bu en kritik nokta. Her sayfada aynı çocuk görünmeli. Fotoğraftaki özellikleri her sayfada koru.

2. **Yaş Uygunluğu:** Hikaye ve dil, fotoğraftan tahmin ettiğin yaş grubuna uygun olmalı.

3. **Güvenlik:** Tüm içerik çocuklar için güvenli ve pozitif olmalı. Korkutucu, şiddet içeren veya uygunsuz içerik olmamalı.

4. **Kalite:** Her sayfa hem metin hem görsel açısından yüksek kaliteli olmalı.

Şimdi yüklenen fotoğrafı analiz et ve 10 sayfalık kitabı oluştur!
```

---

## Versiyon Notları

**v1.0 (21 Aralık 2025):**
- İlk versiyon
- Temel talimatlar
- Karakter tutarlılığı vurgusu
- Watercolor style varsayılan
- Macera - Dinozorlar teması varsayılan

---

## Test Sonuçları

**Test 1:** [Henüz test edilmedi]
- Tarih: -
- Sonuç: -
- Feedback: -

---

**Sonraki Versiyon İçin Notlar:**
- [Feedback sonrası eklenecek]

