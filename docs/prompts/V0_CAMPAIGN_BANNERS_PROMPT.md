# 🎨 v0.app Kampanya Banner'ları Prompt

**Component:** Campaign Banners Section  
**Faz:** 2.2.7 (Ana Sayfa)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create animated campaign banners section for KidStoryBook, a children's personalized storybook website, showing promotional offers like free shipping and discounts.

I've attached the Header, Footer, Hero Section, How It Works, Example Books Carousel, Features Section, Pricing Section, and FAQ Section components for KidStoryBook. Create campaign banners that match this design.

Requirements:

**Structure:**
- Multiple campaign banners (can be scrollable carousel or static rows)
- Each banner should show:
  - Promotional text (e.g., "Free Shipping on All Orders", "10% Off First Order")
  - Icon or emoji (optional, for visual appeal)
  - CTA button or link (optional, e.g., "Shop Now", "Learn More")
  - Close/dismiss button (optional, for non-critical banners)

**Suggested Campaign Banners:**

1. **Free Shipping Banner:**
   - Text: "Free Shipping on All Printed Books" / "Tüm Basılı Kitaplarda Ücretsiz Kargo"
   - Icon: Truck or Shipping icon
   - CTA: "Order Now" or link to pricing
   - Style: Prominent, eye-catching

2. **Discount Banner:**
   - Text: "10% Off Your First Order" / "İlk Siparişinizde %10 İndirim"
   - Icon: Tag or Percent icon
   - CTA: "Get Started" or link to create book
   - Style: Gradient background, attention-grabbing

3. **Limited Time Offer:**
   - Text: "Limited Time: Get E-Book + Printed Book Bundle" / "Sınırlı Süre: E-Kitap + Basılı Kitap Paketi"
   - Icon: Clock or Gift icon
   - CTA: "View Offer" or link to pricing
   - Style: Urgent, time-sensitive feel

**Design Options:**

**Option 1: Top Banner (Sticky or Static)**
- Single banner at the top of the page (below header, above hero)
- Full width, horizontal layout
- Can be dismissible (with close button)
- Auto-hide after scroll (optional)

**Option 2: Carousel Banners**
- Multiple banners in a carousel/slider
- Auto-rotate every 5-7 seconds
- Navigation dots or arrows (optional)
- Can be placed below hero section or above footer

**Option 3: Multiple Static Banners**
- 2-3 banners stacked vertically or in a grid
- Each banner different campaign
- Can be placed strategically (after pricing section, before FAQ)
- All visible at once

**Recommended:** Option 2 (Carousel Banners) - placed after Pricing Section, before FAQ Section

**Design:**
- Match the color scheme from Header/Footer/Hero (purple-500, pink-500 gradient)
- Banner backgrounds: 
  - Free Shipping: Light purple/pink gradient
  - Discount: Vibrant purple to pink gradient
  - Limited Time: Gradient with accent color (orange/yellow optional)
- Text: Bold, clear, readable
- Icons: Lucide React icons, colorful, prominent
- CTA buttons: Gradient (purple to pink), rounded, shadow
- Close button: Subtle, top-right corner
- Clean, modern layout
- Not too intrusive, but attention-grabbing

**Animations (Framer Motion):**
- Banner fade-in on scroll (if placed mid-page)
- Carousel slide transitions (if carousel)
- CTA button hover (scale + shadow)
- Close button hover (rotate or scale)
- Auto-rotate animation (if carousel, every 5-7 seconds)
- Smooth transitions (0.3s - 0.5s, ease-in-out)

**Responsive Design:**
- Desktop: Full width, horizontal layout
- Tablet: Full width, slightly reduced padding
- Mobile: Full width, stacked content if needed, touch-friendly
- Mobile-first approach
- Touch-friendly tap targets

**Styling:**
- Background: Gradient (matching site theme) or solid color with gradient accent
- Text: White or dark (depending on background), bold, clear
- Padding: Comfortable spacing (p-4 to p-6)
- Border radius: Rounded corners (rounded-lg or rounded-xl)
- Shadow: Subtle shadow for depth
- Icons: Colorful, size h-5 to h-6
- CTA buttons: Gradient, rounded-full or rounded-lg, shadow
- Close button: Icon only, subtle, hover effect
- Dark mode support (dark: classes)

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- Framer Motion for animations
- TypeScript
- Lucide React icons (Truck, Tag, Clock, Gift, X, etc.)

**Visual Hierarchy:**
- Campaign message should be most prominent (largest text)
- Icon helps grab attention
- CTA button should be clear and accessible
- Close button should be subtle but visible
- Overall banner should feel promotional but not spammy

**Accessibility:**
- Clear, readable text
- Sufficient color contrast
- Keyboard accessible (Tab, Enter/Space for CTA)
- Screen reader friendly (aria-labels)

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, and FAQ Section design, and effectively communicates promotional offers without being intrusive.
```

---

## Beklenen Özellikler

- ✅ Campaign banners (carousel veya static)
- ✅ 2-3 banner önerisi (Free Shipping, Discount, Limited Time)
- ✅ Her banner: Promotional text, icon, CTA button (optional), close button (optional)
- ✅ Framer Motion animasyonları (fade-in, carousel transitions, hover)
- ✅ Responsive tasarım
- ✅ Header/Footer/Hero ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ Auto-rotate (carousel ise)

---

## Banner Önerileri

**1. Free Shipping Banner:**
- "Free Shipping on All Printed Books"
- Truck icon
- CTA: "Order Now"

**2. Discount Banner:**
- "10% Off Your First Order"
- Tag/Percent icon
- CTA: "Get Started"

**3. Limited Time Offer:**
- "Limited Time: E-Book + Printed Book Bundle"
- Clock/Gift icon
- CTA: "View Offer"

---

## Yerleşim Önerisi

**Önerilen Konum:** Pricing Section'dan sonra, FAQ Section'dan önce (carousel banner olarak)

**Alternatif Konumlar:**
- Top banner (header altı, hero üstü)
- Multiple static banners (pricing sonrası)
- Footer üstü (son şans banner'ı)

---

**Son Güncelleme:** 4 Ocak 2026

