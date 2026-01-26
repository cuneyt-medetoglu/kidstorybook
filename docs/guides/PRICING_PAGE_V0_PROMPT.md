# Pricing Sayfası - v0.app Prompt

**Tarih:** 25 Ocak 2026  
**Durum:** Hazır - v0.app'e yapıştırılabilir  
**Sayfa:** Pricing (Fiyatlandırma)

---

## v0.app Prompt

```
CRITICAL: This is for an EXISTING Next.js 14 project with a well-established design system. You MUST match the existing design patterns, component structure, and styling conventions.

## Existing Design System Reference

### Project Structure
- Framework: Next.js 14 App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Components: shadcn/ui
- Animations: Framer Motion
- Icons: Lucide React
- Font: Inter (from Google Fonts)

### Layout Structure
- Root Layout: `app/layout.tsx` includes:
  - ThemeProvider (dark mode support)
  - CartProvider (shopping cart context)
  - Header component (navigation)
  - Footer component
  - CookieConsentBanner
- Main content: Wrapped in `<main className="min-h-screen">`
- Page route: `/pricing` → `app/pricing/page.tsx`

### Existing Color Palette (MUST MATCH)
- Primary Gradient: `from-purple-500 to-pink-500` (light) / `from-purple-400 to-pink-400` (dark)
- Background Gradient: `from-purple-50 via-pink-50 to-white` (light) / `from-slate-900 via-slate-800 to-slate-950` (dark)
- Card Background: `bg-white` (light) / `bg-slate-900` (dark)
- Text Primary: `text-slate-900` (light) / `text-white` (dark)
- Text Secondary: `text-slate-600` (light) / `text-slate-300` (dark)
- Icon Colors: `text-purple-600` (light) / `text-purple-400` (dark)
- Icon Background: `from-purple-100 to-pink-100` (light) / `from-purple-900/30 to-pink-900/30` (dark)

### Typography Scale (MUST MATCH)
- Hero Title: `text-3xl` mobile, `text-5xl` desktop (bold, gradient)
- Section Title: `text-2xl` mobile, `text-4xl` desktop (bold, gradient)
- Card Title: `text-xl` mobile, `text-2xl` desktop (bold)
- Price: `text-3xl` mobile, `text-5xl` desktop (bold, gradient)
- Body: `text-sm` mobile, `text-base` desktop
- Small: `text-xs`

### Spacing System (MUST MATCH)
- Section Padding: `py-8` mobile, `py-16` or `py-24` desktop
- Card Padding: `p-6` mobile, `p-8` desktop
- Gap Between Cards: `gap-6` mobile, `gap-8` desktop
- Container: `container mx-auto px-4 md:px-6`
- Max Width: `max-w-5xl` for content sections

### Component Patterns (MUST MATCH)
- Cards: `rounded-3xl` for main cards, `rounded-2xl` for info cards
- Shadows: `shadow-xl` for main cards, `shadow-lg` for info cards
- Hover Effects: `hover:shadow-2xl transition-shadow duration-300`
- Buttons: `rounded-xl` for primary, `rounded-lg` for secondary
- Icons: Wrapped in gradient circles with `rounded-2xl` or `rounded-xl`
- Badges: `rounded-full` with appropriate colors

### Animation Patterns (MUST MATCH)
- Framer Motion: `initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`
- Viewport: `viewport={{ once: true }}`
- Transition: `transition={{ duration: 0.5 }}`
- Hover: `whileHover={{ scale: 1.01 }}`
- Stagger: `delay: index * 0.05` for lists

### Responsive Breakpoints (MUST MATCH)
- Mobile: Default (no prefix)
- Tablet/Desktop: `md:` prefix (768px+)
- Large Desktop: `lg:` prefix (1024px+)

### Existing Components to Import (EXACT PATHS)
```typescript
// UI Components (shadcn/ui)
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sections
import { PricingFAQSection } from "@/components/sections/PricingFAQSection"

// Types and Utilities
import type { CurrencyConfig } from "@/lib/currency"

// React and Next.js
import { useState, useEffect } from "react"
import Link from "next/link"

// Icons (Lucide React)
import {
  Check,
  Download,
  Info,
  Shield,
  Award,
  Heart,
  BookOpen,
  Palette,
  FileText,
  Sparkles,
  Paintbrush,
} from "lucide-react"

// Animations
import { motion } from "framer-motion"
```

### Existing Page Structure Reference
- **Homepage** (`app/page.tsx`): Uses sections like Hero, PricingSection, etc.
- **PricingSection** (`components/sections/PricingSection.tsx`): Similar structure but for homepage
  - Uses same gradient backgrounds: `bg-gradient-to-br from-purple-50 via-pink-50 to-white`
  - Same card styles: `rounded-3xl`, `shadow-xl`, `bg-white dark:bg-slate-900`
  - Same animation patterns: `motion.div` with `whileInView`
  - Same decorative elements: blurred circles in background
- **Both pages** use identical design patterns, spacing, and typography

### Reference Implementation
Look at `app/pricing/page.tsx` for the EXACT implementation pattern:
- Section structure with `relative overflow-hidden`
- Decorative background circles with `absolute` positioning
- Container with `container relative mx-auto px-4 md:px-6`
- Motion animations with `initial`, `animate`, `whileInView`
- Grid layout: `grid gap-6 md:grid-cols-[1fr_auto] md:gap-8` for cards
- Max width: `max-w-5xl` for main container, `max-w-[500px]` for cards

### Info Section Pattern (MUST MATCH)
```tsx
<motion.div className="mx-auto mt-4 max-w-[500px] rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:from-purple-900/20 dark:to-pink-900/20 md:mt-6 md:p-6">
  <div className="mb-3 flex flex-col items-center gap-2 md:mb-3 md:flex-row md:gap-3">
    <div className="rounded-full bg-purple-100 p-2.5 dark:bg-purple-900/30 md:p-3">
      <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 md:h-6 md:w-6" />
    </div>
    <h3 className="text-center text-base font-semibold text-slate-900 dark:text-white md:text-lg">
      Convert to hardcover in My Library
    </h3>
  </div>
  <p className="text-center text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
    Order printed books from{" "}
    <span className="whitespace-nowrap">completed E-Books</span>
  </p>
</motion.div>
```

### Component Export Pattern
```typescript
// Must be default export for page
export default function PricingPage() {
  // Component code
}
```

### File Location
- Page file: `app/pricing/page.tsx`
- Must include `"use client"` directive at top (for useState, useEffect)

### Dark Mode Implementation (MUST MATCH)
- Use `dark:` prefix for all dark mode styles
- Background: `dark:from-slate-900 dark:via-slate-800 dark:to-slate-950`
- Cards: `dark:bg-slate-900`
- Text: `dark:text-white`, `dark:text-slate-300`
- Gradients: `dark:from-purple-400 dark:to-pink-400`

---

Create a modern, mobile-first Pricing page for a children's personalized storybook website called "KidStoryBook" that displays E-Book pricing with currency detection and information about hardcover book conversion. The page MUST match the existing design system and component patterns described above.

## Page Structure

### 1. Hero Section
- Background: Gradient from purple-50 via pink-50 to white (dark mode: slate-900 via slate-800 to slate-950)
- Decorative elements: Two blurred circles (purple and pink) positioned absolutely
- Title: "Create Your Perfect Storybook" (large, bold, gradient text: purple-600 to pink-600)
- Subtitle: "Personalized children's books in minutes" (medium gray text)
- Centered layout, spacious padding (py-8 mobile, py-24 desktop)

### 2. E-Book Card (Main Product)
- White card with rounded-3xl, shadow-xl
- Icon container: Download icon in purple-pink gradient circle (rounded-2xl)
- Title: "E-Book" (text-xl mobile, text-2xl desktop, bold)
- Subtitle: "Digital" (text-sm, gray)
- Price: Large gradient text (text-3xl mobile, text-5xl desktop) - DYNAMIC based on currency
- Badge: "12 pages" (purple badge below price)
- Features list: 4 items in 2-column grid
  - "Instant download"
  - "PDF format"
  - "High-quality illustrations"
  - "Personalized story"
  - Each with green checkmark icon
  - Text: text-sm mobile, text-base desktop
- CTA Button: "Start Creating" (full width, purple-pink gradient, rounded-xl)
- Link: /create/step1
- Padding: p-6 mobile, p-8 desktop
- Max width: 500px, centered

### 3. Printed Book Info Card (Compact)
- Gradient background: from-purple-50 to-pink-50 (dark mode: purple-900/20 to pink-900/20)
- Rounded-2xl, shadow-lg
- Icon: BookOpen icon in purple-pink gradient circle
- Title: "Printed Book" (text-xl, bold)
- Subtitle: "Physical" (text-sm, gray)
- Price: $34.99 (text-3xl, gradient text, fixed price)
- Features list: 3 items, single column
  - "Hardcover book"
  - "A4 format"
  - "Free shipping"
  - Each with green checkmark icon
  - Text: text-sm
- Info box: White/60 background, rounded-lg
  - Icon: Info icon (purple)
  - Title: "Available in My Library" (text-xs, bold)
  - Description: "Convert your E-Books to hardcover" (text-xs)
- CTA Button: "View in Library" (outline style, purple border, text-sm)
- Link: /dashboard
- Padding: p-6 (consistent with E-Book card)
- Position: Below E-Book card on mobile, beside on desktop (grid layout)

### 4. Appearance of the Book Section
- Same gradient background as hero section
- White card container (rounded-3xl, shadow-xl, p-8 mobile, p-12 desktop)
- Section title: "Appearance of the Book" (text-2xl mobile, text-4xl desktop, gradient text, centered)
- Two-column layout (grid, gap-8 mobile, gap-12 desktop)
  - Left column: Book illustration placeholder
    - Gradient background circle/rectangle (purple-pink)
    - BookOpen icon (large, purple)
    - Dimensions text below: "A4 Format", "8.27 x 11.69 inches", "(21 x 29.7 cm)"
  - Right column: Quality details
    - Title: "Quality and Details" (text-lg mobile, text-2xl desktop, bold)
    - List of 6 features:
      1. Large A4 Format (8.27 x 11.69 inches)
      2. Durable Hardcover Finish
      3. Premium Color Quality
      4. High-Quality Coated Paper
      5. 12 Pages Full of Magic
      6. Matte or Glossy Cover
    - Each with icon in purple-pink gradient circle
    - Text: text-sm mobile, text-base desktop
    - Spacing: space-y-4

### 5. FAQ Section
- Gradient background (lighter: purple-50/50 via pink-50/50)
- Use PricingFAQSection component (accordion style)
- Common questions about pricing, E-Books, hardcover conversion

### 6. Trust Indicators Section
- White background (dark mode: slate-950)
- Centered layout
- Three trust points with icons:
  - Shield icon: "Secure payment"
  - Award icon: "Money-back guarantee"
  - Heart icon: "Trusted by thousands of parents"
- Payment logos: Visa and Mastercard (grayscale, opacity-50)
- Text: text-sm, gray
- Spacing: gap-6 vertical, gap-2 horizontal

## Design Requirements

### Colors
- Primary gradient: from-purple-500 to-pink-500 (buttons, prices, titles)
- Background gradient: from-purple-50 via-pink-50 to-white
- Dark mode: from-slate-900 via-slate-800 to-slate-950
- Text: slate-900 (light) / white (dark)
- Secondary text: slate-600 / slate-300
- Cards: white / slate-900

### Typography
- Hero title: text-3xl mobile, text-5xl desktop (bold, gradient)
- Section titles: text-2xl mobile, text-4xl desktop (bold, gradient)
- Card titles: text-xl mobile, text-2xl desktop (bold)
- Prices: text-3xl mobile, text-5xl desktop (bold, gradient)
- Body text: text-sm mobile, text-base desktop
- Small text: text-xs

### Spacing
- Section padding: py-8 mobile, py-16 desktop
- Card padding: p-6 mobile, p-8 desktop
- Gap between cards: gap-6 mobile, gap-8 desktop
- Margin bottom: mb-3 to mb-6 (consistent spacing)

### Responsive Breakpoints
- Mobile: < 768px (1 column, compact)
- Tablet: 768px - 1023px (2 columns for grid)
- Desktop: 1024px+ (side-by-side cards, wider layout)

### Animations
- Fade in on scroll (Framer Motion)
- Hover effects on cards (scale 1.01, shadow increase)
- Smooth transitions (0.3s duration)
- Stagger animations for features list

## Technical Requirements

### Currency Detection
- Fetch from /api/currency on mount
- Show loading skeleton while fetching
- Display price dynamically based on currency
- Supported currencies: USD ($7.99), TRY (₺250), EUR (€7.50), GBP (£6.50)
- Default: USD if detection fails

### Components to Use (EXACT IMPORTS)
```typescript
// Required imports
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PricingFAQSection } from "@/components/sections/PricingFAQSection"
import { useState, useEffect } from "react"
import Link from "next/link"
import type { CurrencyConfig } from "@/lib/currency"
import {
  Check,
  Download,
  Info,
  Shield,
  Award,
  Heart,
  BookOpen,
  Palette,
  FileText,
  Sparkles,
  Paintbrush,
} from "lucide-react"
```

### File Structure
- Page file: `app/pricing/page.tsx`
- Must be a default export function component
- Must use "use client" directive (for state and effects)

### Component Structure (ALL IN ONE FILE)
- **Single file component:** All sections in one `PricingPage` component
- **No separate components:** Everything inline in the page file
- **Sections:**
  1. Hero Section (title + subtitle)
  2. E-Book Card (main product)
  3. Printed Book Info Card (compact)
  4. Appearance of the Book Section
  5. FAQ Section (uses PricingFAQSection component)
  6. Trust Indicators Section

### State Management
- useState for currency config
- useEffect for currency detection on mount
- Loading state for currency fetch

### Currency Config Type (ALREADY EXISTS)
```typescript
// Import from @/lib/currency
import type { CurrencyConfig } from "@/lib/currency"

// Default state
const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>({
  currency: "USD",
  symbol: "$",
  price: "$7.99",
})
```

### Container and Layout Pattern (MUST MATCH)
```tsx
<div className="min-h-screen">
  <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white py-8 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 md:py-24">
    {/* Decorative background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-500/10" />
      <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-500/10" />
    </div>
    
    <div className="container relative mx-auto px-4 md:px-6">
      {/* Content here */}
    </div>
  </section>
</div>
```

### Grid Layout for Pricing Cards (MUST MATCH)
```tsx
<div className="mx-auto max-w-5xl">
  <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-8">
    {/* E-Book Card - takes main space */}
    <motion.div className="relative">
      <div className="relative h-full rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-900 md:p-8">
        {/* Card content */}
      </div>
    </motion.div>
    
    {/* Printed Book Info Card - auto width */}
    <motion.div className="relative">
      <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg dark:from-purple-900/20 dark:to-pink-900/20 md:p-6">
        {/* Card content */}
      </div>
    </motion.div>
  </div>
</div>
```

## Key Features

1. **Currency Detection:**
   - Automatic detection based on IP geolocation
   - Fallback to browser locale
   - Loading state with skeleton

2. **Responsive Design:**
   - Mobile-first approach
   - Cards stack on mobile, side-by-side on desktop
   - Consistent spacing and typography

3. **Visual Hierarchy:**
   - E-Book card is primary (larger, more prominent)
   - Printed Book card is secondary (info style)
   - Clear CTA buttons

4. **Accessibility:**
   - Semantic HTML
   - Proper heading hierarchy
   - ARIA labels where needed
   - Keyboard navigation support

5. **Dark Mode:**
   - Full dark mode support
   - Consistent color scheme
   - Proper contrast ratios

## Critical Implementation Details

### Currency Detection Implementation
```typescript
const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>({
  currency: "USD",
  symbol: "$",
  price: "$7.99",
})
const [isLoadingCurrency, setIsLoadingCurrency] = useState(true)

useEffect(() => {
  const fetchCurrency = async () => {
    try {
      const response = await fetch("/api/currency")
      const data = await response.json()
      if (data.success) {
        setCurrencyConfig({
          currency: data.currency,
          symbol: data.symbol,
          price: data.price,
        })
      }
    } catch (error) {
      console.error("[Pricing] Error fetching currency:", error)
    } finally {
      setIsLoadingCurrency(false)
    }
  }
  fetchCurrency()
}, [])
```

### Decorative Background Elements (MUST MATCH)
```tsx
<div className="absolute inset-0 overflow-hidden">
  <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-500/10" />
  <div className="absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-500/10" />
</div>
```

### Grid Layout for Cards (MUST MATCH)
```tsx
<div className="mx-auto max-w-5xl">
  <div className="grid gap-6 md:grid-cols-[1fr_auto] md:gap-8">
    {/* E-Book Card */}
    {/* Printed Book Info Card */}
  </div>
</div>
```

### Loading State for Price (MUST MATCH)
```tsx
{isLoadingCurrency ? (
  <div className="mb-1 h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 md:h-16" />
) : (
  <div className="mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400 md:text-5xl">
    {currencyConfig.price}
  </div>
)}
```

### Features List Pattern (MUST MATCH)
```tsx
<ul className="mb-4 grid grid-cols-2 gap-2 md:mb-6 md:gap-3">
  {features.map((feature, index) => (
    <motion.li
      key={index}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-start gap-1.5"
    >
      <div className="mt-0.5 flex-shrink-0 rounded-full bg-green-100 p-0.5 dark:bg-green-900/30">
        <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400 md:h-4 md:w-4" />
      </div>
      <span className="text-sm text-slate-700 dark:text-slate-300 md:text-base">
        {feature}
      </span>
    </motion.li>
  ))}
</ul>
```

### Button Pattern (MUST MATCH)
```tsx
<Link href="/create/step1">
  <Button
    size="lg"
    className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:from-purple-600 dark:to-pink-600 md:py-6 md:text-lg"
  >
    Start Creating
  </Button>
</Link>
```

## Notes

- E-Book is the primary product (main focus)
- Printed Book info is secondary (informational)
- All prices should be clearly visible
- CTA buttons should be prominent and accessible
- FAQ section uses existing PricingFAQSection component
- Trust indicators build confidence
- Smooth animations enhance UX
- Mobile experience is prioritized
- MUST match existing homepage PricingSection styling
- MUST use same gradient backgrounds throughout the page
- MUST follow exact spacing and typography scale
- MUST implement dark mode for all elements
```

---

## Kullanım Talimatları

1. Bu prompt'u v0.app'e kopyala-yapıştır yap
2. v0.app component'leri oluşturacak
3. Oluşan kodu `app/pricing/page.tsx` dosyasına entegre et
4. Currency detection API'yi bağla (`/api/currency`)
5. PricingFAQSection component'ini import et (`@/components/sections/PricingFAQSection`)
6. Tüm import path'lerini kontrol et (`@/` alias kullanılmalı)
7. Responsive tasarımı kontrol et (mobil, tablet, desktop)
8. Dark mode'u test et
9. Animasyonları optimize et
10. Mevcut `app/pricing/page.tsx` ile karşılaştır ve tutarlılığı kontrol et

---

## Önemli Notlar

- **Currency Detection:** API endpoint `/api/currency` kullanılmalı
- **Existing Component:** `PricingFAQSection` zaten mevcut, import edilmeli
- **Routing:** E-Book CTA → `/create/step1`, Printed Book CTA → `/dashboard`
- **Responsive:** Mobilde kartlar alt alta, desktop'ta yan yana
- **Gradient Background:** Tüm sayfada tutarlı gradient kullanılmalı
- **Import Paths:** Mutlaka `@/` alias kullanılmalı (örn: `@/components/ui/button`)
- **File Location:** `app/pricing/page.tsx` (Next.js 14 App Router)
- **Client Component:** `"use client"` directive gerekli (state ve effects için)
- **Default Export:** Component default export olmalı
- **Type Safety:** TypeScript kullanılmalı, `CurrencyConfig` type import edilmeli
- **Matching Patterns:** Mevcut `app/pricing/page.tsx` ve `components/sections/PricingSection.tsx` ile tam uyumlu olmalı

---

**Son Güncelleme:** 25 Ocak 2026
