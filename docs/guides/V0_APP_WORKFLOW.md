# 🎨 v0.app Çalışma Akışı Rehberi

**Tarih:** 4 Ocak 2026  
**Durum:** Aktif

---

## 📋 Genel Bakış

Bu rehber, KidStoryBook projesinde v0.app ile UI geliştirme sürecini açıklar.

---

## 🔄 Çalışma Akışı

### 1. Prompt Hazırlama
- **Agent (@project-manager):** ROADMAP.md'den ilgili prompt'u alır/günceller
- **Animasyonlar:** Framer Motion animasyonları prompt'a eklenir
- **Referanslar:** justimagine.online gibi referans siteler belirtilir
- **Detaylar:** Tüm gereksinimler prompt'a eklenir

### 2. v0.app'te Tasarım Oluşturma
- **Kullanıcı:** Prompt'u v0.app'e yapıştırır
- **v0.app:** Tasarımı oluşturur
- **Kullanıcı:** Tasarımı inceler, beğenmezse "Regenerate" eder
- **Kullanıcı:** Beğenirse kodu kopyalar

### 3. Kod Entegrasyonu
- **Kullanıcı:** Kodu agent'a verir
- **Agent:** Kodu projeye entegre eder:
  - Import path'lerini düzeltir
  - Component'leri doğru klasörlere yerleştirir
  - Eksik dependency'leri ekler (Framer Motion, vb.)
  - TypeScript hatalarını düzeltir
  - Stil uyumluluğunu kontrol eder

### 4. Test ve İyileştirme
- **Agent:** Component'i test eder
- **Kullanıcı:** Browser'da test eder
- **Gerekirse:** Prompt güncellenir ve tekrar denemeler yapılır

---

## 📝 Prompt Formatı

Her prompt şu yapıda olacak:

```
Create [COMPONENT_NAME] for KidStoryBook with playful animations:

Requirements:
- [Functional requirements]
- Framer Motion animations:
  - [Animation details]
- [Styling requirements]
- [Responsive design]
- Use [Technologies]
```

---

## 🎯 Sıralama

### Faz 2.1: Layout ve Navigasyon
1. **Header Component**
   - Logo, navigation links
   - Ülke/para birimi seçici
   - Sepet ikonu
   - "Create a children's book" butonu
   - Mobile menu (hamburger)

2. **Footer Component**
   - Links, social media
   - Copyright

### Faz 2.2: Ana Sayfa
1. **Hero Section**
2. **Nasıl Çalışır Bölümü**
3. **Örnek Kitaplar Carousel**
4. **Özellikler Bölümü**
5. **Fiyatlandırma Özeti**
6. **FAQ Bölümü**
7. **Kampanya Banner'ları**
8. **Cookie Banner**

### Faz 2.3: Auth Sayfaları
1. **Login Page**
2. **Register Page**
3. **Password Reset**
4. **OAuth Buttons**

### Faz 2.4: Kitap Oluşturma Wizard
1. **Multi-step Wizard** (tüm adımlarla)

### Faz 2.5: E-book Viewer
1. **Book Viewer Component**

### Faz 2.6: Dashboard
1. **Kitaplık Sayfası**
2. **Kitap Kartı Component**
3. **Filtreleme ve Sıralama**

### Faz 2.7: Statik Sayfalar
1. **Features Page**
2. **Pricing Page**
3. **About Page**
4. **Contact Page**
5. **Legal Pages**

---

## 🛠️ Teknolojiler

- **UI Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **E-book Viewer:** react-pageflip

---

## 📦 Dependency'ler

Faz 2'de eklenecek paketler:

```bash
npm install framer-motion
npm install react-hook-form @hookform/resolvers zod
npm install react-pageflip
npm install next-intl  # i18n için
```

---

## ✅ Kontrol Listesi

Her component için:
- [ ] Prompt hazırlandı
- [ ] v0.app'te tasarım oluşturuldu
- [ ] Kod kopyalandı
- [ ] Agent'a verildi
- [ ] Projeye entegre edildi
- [ ] Test edildi
- [ ] Dokümante edildi

---

## 🎨 Tasarım Prensipleri

1. **Çocuk Dostu:** Rounded corners, soft colors, playful typography
2. **Animasyonlu:** Smooth transitions, hover effects, scroll animations
3. **Responsive:** Mobile-first approach
4. **Erişilebilir:** Keyboard navigation, screen reader support
5. **Performanslı:** Optimized animations, lazy loading

---

**Son Güncelleme:** 4 Ocak 2026

