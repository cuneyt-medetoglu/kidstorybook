# 📚 KidStoryBook

AI destekli kişiselleştirilmiş çocuk hikaye kitapları oluşturma platformu.

## 📖 Proje Hakkında

KidStoryBook, çocukların kendi fotoğraflarıyla kişiselleştirilmiş AI destekli hikaye kitapları oluşturmasını sağlayan bir web platformudur. Ebeveynler çocuklarının özel hikayelerini yaratabilir, dijital olarak inceleyebilir, PDF indirebilir ve basılı kitap siparişi verebilir.

## ✨ Özellikler

- 🎨 **AI Destekli Hikaye** – GPT-4o ile özgün hikayeler
- 🖼️ **Kişiselleştirilmiş Görseller** – GPT-image / DALL-E ile çocuk fotoğrafından karakter oluşturma
- 👧👦 **Çoklu Karakter** – Birden fazla çocuk karakteri tek kitapta
- 🔊 **TTS (Seslendirme)** – Google Cloud TTS ile hikaye seslendirme
- 💱 **Para Birimi Tespiti** – Bölgeye göre fiyat ve ödeme (TRY, USD, EUR)
- 🛒 **Sepet ve Ödeme** – Stripe / İyzico entegrasyonu
- 📖 **Dijital Kitap** – Flipbook tarzı görüntüleme, PDF indirme
- 🌍 **Çok Dilli** – Türkçe, İngilizce ve diğer diller (8 dil desteği)

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+
- npm veya yarn
- API anahtarları: OpenAI, (opsiyonel) Groq, Google Cloud TTS, Stripe/İyzico

### Kurulum

```bash
git clone https://github.com/cuneyt-medetoglu/kidstorybook.git
cd kidstorybook

npm install
cp .env.example .env
# .env dosyasını düzenleyin; gerekli API key'leri ekleyin (bkz. docs/guides/ENVIRONMENT_SETUP.md)

npm run dev
```

Tarayıcıda **http://localhost:3001** adresini açın.

### Veritabanı bağlantısı (Local / Production)

- **Local (kendi bilgisayarında prod DB’ye bağlanmak):**  
  Önce SSH tüneli aç (bir terminalde açık kalsın):  
  `ssh -i kidstorybook-key.pem -L 5432:localhost:5432 ubuntu@EC2_IP`  
  .env’de: `DATABASE_URL=postgresql://kidstorybook:SIFRE@localhost:5432/kidstorybook`  
  Sonra `npm run dev`. DBeaver’da da aynı tüneli kullanıp Host: localhost, Port: 5432 yapabilirsin.

- **Production (EC2’de çalışan uygulama):**  
  .env’de: `DATABASE_URL=postgresql://kidstorybook:SIFRE@localhost:5432/kidstorybook`  
  (Uygulama EC2’de olduğu için DB aynı makinede, localhost kullanılır.)

### Dokümantasyon Yapısı

| Ne arıyorsunuz? | Dosya |
|-----------------|--------|
| Tüm dokümanların listesi | [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) |
| Hangi doküman nerede, güncel mi? | [docs/DOCUMENTATION_MAP.md](docs/DOCUMENTATION_MAP.md) |
| Proje planı ve iş listesi | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Ürün gereksinimleri | [docs/PRD.md](docs/PRD.md) |
| Özellik listesi ve öncelikler | [docs/FEATURES.md](docs/FEATURES.md) |
| Mimari ve teknik yapı | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Ortam değişkenleri kurulumu | [docs/guides/ENVIRONMENT_SETUP.md](docs/guides/ENVIRONMENT_SETUP.md) |

## 🛠️ Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, PostgreSQL (AWS), S3, NextAuth |
| **Veritabanı** | PostgreSQL (AWS) |
| **AI – Metin** | OpenAI GPT-4o, (opsiyonel) Groq, Claude, Gemini |
| **AI – Görsel** | OpenAI GPT-image / DALL-E, (opsiyonel) Imagen, Stable Diffusion |
| **TTS** | Google Cloud Text-to-Speech |
| **Ödeme** | Stripe, İyzico |
| **Hosting** | Vercel |

## 📁 Proje Yapısı

```
kidstorybook/
├── app/                 # Next.js App Router (sayfalar, API routes)
├── components/          # React bileşenleri (ui, layout, sections)
├── lib/                 # Yardımcılar, DB, prompt'lar, PDF, TTS
├── hooks/               # React hooks
├── contexts/            # React context (örn. Cart)
├── public/              # Statik dosyalar (görseller, test-images)
├── scripts/             # Yardımcı script’ler (roadmap CSV, hero transformation)
├── docs/                # Dokümantasyon (ROADMAP, PRD, guides, roadmap/, technical/)
├── migrations/          # PostgreSQL migration'ları (AWS)
└── .cursor/             # Cursor AI kuralları
```

## 📚 Dokümantasyon

Detaylı dokümantasyon için [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) kullanın. Özet linkler:

- [Doküman haritası](docs/DOCUMENTATION_MAP.md) – Hangi dosya nerede, güncel mi?
- [Yol haritası](docs/ROADMAP.md) – Fazlar ve iş listesi
- [PRD](docs/PRD.md) – Ürün gereksinimleri
- [Özellikler](docs/FEATURES.md) – Özellik listesi ve önceliklendirme
- [Mimari](docs/ARCHITECTURE.md) – Proje yapısı ve API özeti
- [Rehberler](docs/guides/) – Kurulum, API test, PDF, TTS, vb.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Yeni özellik eklendi'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel bir projedir. Tüm hakları saklıdır.

---

**Not:** Proje aktif geliştirme aşamasındadır. MVP lansmanı için çalışmalar devam etmektedir. Son tamamlanan özellikler için [docs/COMPLETED_FEATURES.md](docs/COMPLETED_FEATURES.md) dosyasına bakın.
