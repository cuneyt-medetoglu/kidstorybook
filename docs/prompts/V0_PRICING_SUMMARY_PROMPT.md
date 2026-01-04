# 🎨 v0.app Fiyatlandırma Özeti Bölümü Prompt

**Component:** Pricing Summary Section  
**Faz:** 2.2.5 (Ana Sayfa)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated pricing summary section for KidStoryBook, a children's personalized storybook website, showing pricing plans for e-books and printed books.

I've attached the Header, Footer, Hero Section, How It Works, Example Books Carousel, and Features Section components for KidStoryBook. Create a "Pricing" section that matches this design.

Requirements:

**Structure:**
- Section title: "Pricing" / "Fiyatlandırma"
- Subtitle: "Choose the perfect option for your child" / "Çocuğunuz için mükemmel seçeneği seçin"
- Two main pricing options side by side (or stacked on mobile):
  1. E-Book (Digital)
  2. Printed Book (Physical)
- Each pricing card should show:
  - Plan name (E-Book / Printed Book)
  - Price (large, prominent)
  - Currency indicator (USD/TRY - can be dynamic)
  - Feature list (checkmarks)
  - CTA button ("Get Started" / "Order Now")
  - Optional: "Most Popular" badge on one option

**Pricing Details:**

**E-Book Plan:**
- Price: $7.99 (or ₺250-300)
- Features:
  - ✅ Instant download (2 hours)
  - ✅ PDF format
  - ✅ Unlimited downloads
  - ✅ High-quality illustrations
  - ✅ Personalized story
  - ✅ Share with family

**Printed Book Plan:**
- Price: $34.99 (or ₺1,000-1,200)
- Features:
  - ✅ Hardcover book
  - ✅ 24 pages
  - ✅ A4 format (21x29.7 cm)
  - ✅ High-quality printing
  - ✅ 3-5 weeks delivery
  - ✅ Free shipping (optional badge)
  - ✅ Includes e-book version

**Design:**
- Match the color scheme from Header/Footer/Hero (purple-500, pink-500 gradient)
- Cards: white background, rounded corners, shadow
- "Most Popular" badge: gradient (purple to pink), on Printed Book option
- Price: large, bold, gradient colored
- Feature checkmarks: green checkmark icons (Lucide React)
- CTA buttons: gradient (purple to pink), rounded, shadow
- Clean, modern layout
- Trustworthy and professional aesthetic

**Animations (Framer Motion):**
- Section fades in when scrolling into view
- Each pricing card animates in with stagger effect (delay between cards)
- Pricing cards: hover scale(1.02) + shadow increase
- "Most Popular" badge: subtle pulse animation (optional)
- CTA buttons: hover scale(1.05) + gradient transition
- Smooth transitions (0.3s - 0.6s, ease-in-out)

**Responsive Design:**
- Desktop (≥1024px): 2 cards side by side
- Tablet (≥768px): 2 cards side by side (smaller)
- Mobile (<768px): Single column, stacked
- Mobile-first approach
- Touch-friendly tap targets

**Styling:**
- Background: white or light gradient (matching other sections)
- Cards: white background with shadow, rounded corners
- Price: large font (text-4xl or text-5xl), gradient colored, bold
- Currency: smaller font, muted color
- Feature list: checkmark icon + text, aligned left
- CTA button: gradient (purple to pink), full width on card, rounded
- "Most Popular" badge: top-right corner, gradient background, white text
- Dark mode support (dark: classes)

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- shadcn/ui components (Card, Button, Badge if available)
- Framer Motion for animations
- TypeScript
- Lucide React icons (Check, Star, etc.)

**Visual Hierarchy:**
- Price should be most prominent (large, colorful)
- Plan name should be clear
- Features should be scannable (checkmarks help)
- CTA button should be clear and prominent
- "Most Popular" badge should stand out
- Overall section should feel trustworthy and value-focused

**Optional Enhancements:**
- Comparison table (optional, can be simple)
- "Save X%" badge if there's a discount
- Currency toggle (USD/TRY) - can be simple text for now
- Trust indicators (secure payment, money-back guarantee icons)

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, Hero, How It Works, Example Books Carousel, and Features Section design, and clearly presents the pricing options in a trustworthy way.
```

---

## Beklenen Özellikler

- ✅ 2 pricing card (E-Book ve Printed Book)
- ✅ Her kart: Plan adı, fiyat, özellik listesi, CTA butonu
- ✅ "Most Popular" badge (Printed Book'da)
- ✅ Framer Motion animasyonları
- ✅ Responsive tasarım (2 → 1 column)
- ✅ Header/Footer/Hero ile uyumlu renk paleti
- ✅ Dark mode desteği

---

## Fiyatlandırma Detayları

**E-Book:**
- $7.99 (veya ₺250-300)
- Anında indirme, PDF, sınırsız indirme

**Printed Book:**
- $34.99 (veya ₺1,000-1,200)
- Hardcover, 24 sayfa, 3-5 hafta teslimat

---

**Son Güncelleme:** 4 Ocak 2026

