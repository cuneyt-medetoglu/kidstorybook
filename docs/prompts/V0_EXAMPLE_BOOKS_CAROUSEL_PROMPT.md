# 🎨 v0.app Örnek Kitaplar Carousel Prompt

**Component:** Example Books Carousel  
**Faz:** 2.2.3 (Ana Sayfa)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated example books carousel section for KidStoryBook, a children's personalized storybook website, showing sample books with before/after transformation (photo → book cover).

I've attached the Header, Footer, Hero Section, and How It Works components for KidStoryBook. Create an "Example Books" carousel section that matches this design.

Requirements:

**Structure:**
- Section title: "Example Books" / "Örnek Kitaplar"
- Subtitle: "See how photos become magical stories" / "Fotoğrafların nasıl sihirli hikayelere dönüştüğünü görün"
- Carousel/slider with 3-4 example books
- Navigation: Previous/Next buttons, dots indicator
- Each book card should show:
  - Left side: Used photo (child's photo - placeholder/example)
  - Right side: Book cover (illustrated cover - placeholder/example)
  - Arrow icon (→) between photo and cover
  - Book title
  - Brief description (theme, age group)
  - "View Example" button

**Design:**
- Match the color scheme from Header/Footer/Hero (purple-500, pink-500 gradient)
- Cards: white background, rounded corners, shadow
- Photo preview: rounded corners, border, small size (thumbnail)
- Book cover: rounded corners, shadow, larger size
- Gradient accents on buttons
- Icons: Use Lucide React icons (ArrowRight, ChevronLeft, ChevronRight, Eye, etc.)
- Clean, modern layout
- Child-friendly aesthetic

**Animations (Framer Motion):**
- Section fades in when scrolling into view
- Carousel slides with smooth transition
- Each book card: hover scale(1.02) + shadow increase
- Arrow icon: subtle pulse or float animation
- "View Example" button: hover scale(1.05) + gradient transition
- Navigation buttons: hover scale(1.1) + rotate animation
- Smooth transitions (0.3s - 0.6s, ease-in-out)

**Carousel Features:**
- Auto-play (optional, can be paused on hover)
- Manual navigation (prev/next buttons)
- Dots indicator (showing current slide)
- Touch/swipe support (for mobile)
- Infinite loop (optional)
- Smooth slide transitions

**Responsive Design:**
- Desktop (≥1024px): 3 books visible, carousel
- Tablet (≥768px): 2 books visible, carousel
- Mobile (<768px): 1 book visible, swipeable carousel
- Mobile-first approach
- Touch-friendly tap targets

**Styling:**
- Background: white or light gradient (matching Hero/How It Works sections)
- Cards: white background with shadow, rounded corners
- Photo preview: 120x120px (or similar), rounded, border
- Book cover: 200x280px (or similar book ratio), rounded corners, shadow
- Arrow icon: purple/pink accent color, medium size
- Text: dark gray for readability
- Titles: bold, larger font size
- Descriptions: regular weight, smaller font size
- "View Example" button: gradient (purple to pink), rounded, shadow
- Dark mode support (dark: classes)

**Placeholder Images:**
- Use placeholder images (Unsplash, placeholder.com, or colored divs)
- Photo preview: child portrait placeholder (or gradient div)
- Book cover: illustrated book cover placeholder (or gradient div)
- Note: Real images will be replaced later, use placeholders for now

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- shadcn/ui components (Card, Button, Carousel if available)
- Framer Motion for animations
- TypeScript
- Lucide React icons
- For carousel: Use a carousel library (embla-carousel-react, swiper, or create custom with Framer Motion)

**Visual Hierarchy:**
- Book covers should be prominent (larger, centered)
- Used photos should be clear but smaller (supporting element)
- Arrow should visually connect photo → cover
- "View Example" button should be clear CTA
- Overall section should feel engaging and showcase the transformation

**Example Book Data (Placeholder):**
1. "Emma's Garden Adventure"
   - Photo: Child with blonde hair (placeholder)
   - Cover: Garden illustration with child (placeholder)
   - Theme: Adventure
   - Age: 3-5 years

2. "Lucas and the Dinosaur"
   - Photo: Child with brown hair (placeholder)
   - Cover: Dinosaur illustration with child (placeholder)
   - Theme: Adventure
   - Age: 6-9 years

3. "Sophie's Magical Forest"
   - Photo: Child with red hair (placeholder)
   - Cover: Forest illustration with child (placeholder)
   - Theme: Fairy Tale
   - Age: 3-5 years

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, Hero, and How It Works design, and clearly demonstrates the photo-to-book transformation.
```

---

## Beklenen Özellikler

- ✅ Carousel/slider layout
- ✅ 3-4 örnek kitap kartı
- ✅ Her kart: Fotoğraf (sol) → Kitap Kapağı (sağ)
- ✅ Arrow icon (→) fotoğraf ve kapağı bağlar
- ✅ "View Example" butonu
- ✅ Navigation (prev/next buttons, dots)
- ✅ Framer Motion animasyonları
- ✅ Responsive tasarım (3 → 2 → 1 book visible)
- ✅ Header/Footer/Hero ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ Placeholder görseller (gerçek görseller daha sonra eklenecek)

---

## Notlar

- **Placeholder Görseller:** Şimdilik placeholder görseller kullanılacak (Unsplash, placeholder.com veya gradient divs). Gerçek görseller backend/API kurulduktan sonra eklenecek.
- **Carousel Library:** embla-carousel-react veya swiper kullanılabilir, ya da Framer Motion ile custom carousel yapılabilir.
- **"Used Photos" Gösterimi:** Bu carousel, ROADMAP'teki "Used Photos" gösterimi planının bir parçası (2.2.3 içinde, 2.7.11 detaylı versiyonu).

---

**Son Güncelleme:** 4 Ocak 2026

