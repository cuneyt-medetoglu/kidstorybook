# 📚 KidStoryBook

AI destekli kişiselleştirilmiş çocuk hikaye kitapları oluşturma platformu.

## 📖 Proje Hakkında

KidStoryBook, çocukların kendi fotoğraflarıyla kişiselleştirilmiş AI destekli hikaye kitapları oluşturmasını sağlayan bir web platformudur. Ebeveynler çocuklarının özel hikayelerini yaratabilir, önce dijital olarak inceleyebilir, sonra basılı kitap olarak sipariş verebilir.

## ✨ Özellikler

- 🎨 **AI Destekli Hikaye Oluşturma** - GPT-4o ile özgün hikayeler
- 🖼️ **Kişiselleştirilmiş Görseller** - DALL-E 3 ile çocuğun fotoğrafından karakter oluşturma
- 📖 **Dijital Kitap Görüntüleme** - Flipbook tarzı interaktif kitap deneyimi
- 📦 **Basılı Kitap Siparişi** - Fiziksel kitap siparişi ve teslimat
- 🌍 **Çok Dilli Destek** - Türkçe ve İngilizce (daha fazla dil eklenecek)
- 💳 **Güvenli Ödeme** - Stripe ve İyzico entegrasyonu

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- API Keys (OpenAI, Groq, vb.)

### Kurulum

```bash
# Repository'yi klonla
git clone https://github.com/yourusername/kidstorybook.git
cd kidstorybook

# Bağımlılıkları yükle
npm install

# Environment variables oluştur
cp .env.example .env
# .env dosyasını düzenle ve API key'lerini ekle

# Development server'ı başlat
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🛠️ Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, Supabase |
| **Database** | PostgreSQL (Supabase) |
| **AI - Metin** | OpenAI GPT-4o, Gemini Pro, Groq, Claude |
| **AI - Görsel** | DALL-E 3, Gemini Imagen 3, Stable Diffusion, Grok |
| **Ödeme** | Stripe, İyzico |
| **Hosting** | Vercel |
| **Storage** | Supabase Storage |

## 📁 Proje Yapısı

```
kidstorybook/
├── docs/              # Dokümantasyon
│   ├── DOCUMENTATION.md  # Dokümantasyon indeksi
│   ├── ROADMAP.md       # Proje yol haritası
│   ├── PRD.md          # Ürün gereksinimleri
│   └── ...
├── poc/               # Proof of Concept (çalışan demo)
├── src/               # Kaynak kod (oluşturulacak)
└── .cursor/           # Cursor AI kuralları
```

## 📚 Dokümantasyon

Detaylı dokümantasyon için [`docs/DOCUMENTATION.md`](docs/DOCUMENTATION.md) dosyasına bakın.

- [Proje Yol Haritası](docs/ROADMAP.md)
- [Ürün Gereksinimleri](docs/PRD.md)
- [Özellik Listesi](docs/FEATURES.md)
- [AI Stratejisi](docs/ai/AI_STRATEGY.md)
- [Teknik Dokümantasyon](docs/technical/)

## 🧪 POC (Proof of Concept)

Proje şu anda POC aşamasında. Çalışan demo için:

```bash
cd poc
npm install
npm start
```

POC hakkında daha fazla bilgi için [`poc/README.md`](poc/README.md) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Yeni özellik eklendi'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

## 📞 İletişim

- **Hedef Kitle:** Ebeveynler, anaokulları, kreşler
- **Diller:** Türkçe, İngilizce (daha fazla dil eklenecek)

---

**Not:** Bu proje aktif geliştirme aşamasındadır. MVP lansmanı için çalışmalar devam etmektedir.
