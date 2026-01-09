# KidStoryBook POC - Kullanım Kılavuzu

## Kurulum

1. **Bağımlılıkları yükle:**
```bash
cd poc
npm install
```

2. **Environment variable oluştur:**
`.env` dosyası oluştur ve OpenAI API key'ini ekle:
```
OPENAI_API_KEY=your-api-key-here
```

3. **Sunucuyu başlat:**
```bash
npm start
```

4. **Tarayıcıda aç:**
```
http://localhost:3005
```

**Not:** Portu değiştirmek istersen, `.env` dosyasına `PORT=3005` (veya istediğin port numarası) ekleyebilirsin.

## Kullanım

1. Formu doldur:
   - Karakter bilgileri (ad, yaş, cinsiyet, vb.)
   - Kitap ayarları (dil, tema, style, vb.)

2. "Kitap İçeriğini Oluştur" butonuna tıkla

3. GPT-4o API'ye gider ve kitap içeriğini oluşturur

4. Final prompt hazırlanır ve gösterilir

5. Final prompt'u kopyala

6. ChatGPT veya Gemini'ye git:
   - Prompt'u yapıştır
   - Çocuk fotoğrafını ekle
   - Gönder

7. AI'ın çıktısını değerlendir ve feedback ver

## Notlar

- API key backend'de saklanıyor (güvenli)
- GPT-4o API çağrısı backend'de yapılıyor
- Final prompt frontend'de gösteriliyor
- Fotoğraf yükleme yok (ChatGPT/Gemini'ye manuel gönderilecek)

