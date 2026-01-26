# Step 6: Interactive Timeline Design - v0.app Prompt

**Tarih:** 25 Ocak 2026  
**Durum:** Hazır - v0.app'e yapıştırılabilir  
**Sayfa:** Step 6 - Review & Create  
**Tasarım Yaklaşımı:** Interactive Timeline/Flow Design (NOT Card/Box Based)

---

## ⚠️ CRITICAL REQUIREMENTS

**DO NOT CREATE:**
- ❌ Card-based layouts with boxes/containers
- ❌ Simple horizontal timeline with connecting lines
- ❌ Vertical list with icons in circles
- ❌ Any design that looks like "boxes" or "cards"
- ❌ Gradient-filled rectangular containers
- ❌ Designs similar to "Magical Children's Book"

**MUST CREATE:**
- ✅ Interactive Timeline/Flow Design
- ✅ Modern, unique visual approach
- ✅ Animated progress flow
- ✅ Hover interactions reveal details
- ✅ Clean, minimal, elegant design

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
- Root Layout: `app/layout.tsx` includes ThemeProvider, CartProvider, Header, Footer
- Main content: Wrapped in `<main className="min-h-screen">`
- Page route: `/create/step6` → `app/create/step6/page.tsx`

### Existing Color Palette (MUST MATCH)
- Primary Gradient: `from-purple-500 to-pink-500` (light) / `from-purple-400 to-pink-400` (dark)
- Background Gradient: `from-purple-50 via-white to-pink-50` (light) / `from-slate-900 via-slate-900 to-slate-800` (dark)
- Card Background: `bg-white/80` (light) / `bg-slate-800/80` (dark) with `backdrop-blur-sm`
- Text Primary: `text-gray-900` (light) / `text-slate-50` (dark)
- Text Secondary: `text-gray-600` (light) / `text-slate-400` (dark)
- Border: `border-gray-200` (light) / `border-slate-700` (dark)
- Green Gradient: `from-green-500 to-emerald-500` (free cover button)

### Typography Scale (MUST MATCH)
- Page Title: `text-3xl` (bold)
- Section Title: `text-xl` (semibold)
- Body: `text-sm` mobile, `text-base` desktop
- Small: `text-xs`

### Spacing System (MUST MATCH)
- Container: `max-w-4xl`, centered
- Card Padding: `p-6` mobile, `p-8` desktop
- Section Spacing: `space-y-6`
- Section Padding: `p-6`

### Component Patterns (MUST MATCH)
- Cards: `rounded-xl`, `border`, `shadow`, `hover:scale-[1.01]`, `hover:shadow-lg`
- Buttons: `rounded-xl` for primary, gradient background
- Icons: Wrapped in colored circles or standalone
- Progress Bar: `h-3`, `rounded-full`, gradient fill

### Animation Patterns (MUST MATCH)
- Framer Motion: `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`
- Stagger: `delay: index * 0.1` or `delay: 0.4, 0.6, 0.8`
- Hover: `whileHover={{ scale: 1.02 }}`
- Floating: Custom variants with `y` and `rotate` animations

---

## Design Challenge: Interactive Timeline/Flow Design

Create a modern, unique "Book Creation Process" component using an **Interactive Timeline/Flow Design** approach. This should be visually distinct from typical card/box layouts.

### Design Concept: Interactive Flow Timeline

**Visual Approach:**
- Horizontal flowing timeline (desktop) / Vertical flow (mobile)
- Each step represented as an **interactive node** (not a box/card)
- Animated progress line connecting steps
- Hover reveals detailed description
- Clean, minimal aesthetic with subtle animations

**Step Representation:**
- Each step is a **circular node** with icon inside
- Node has gradient background (purple/pink theme)
- Step number as small badge
- Title appears on hover or below node
- Description appears on hover (tooltip-style) or expands below

**Connecting Flow:**
- Animated gradient line connecting nodes
- Line animates on mount (draw effect)
- Optional: Small animated particles or dots along the line
- Line has gradient: `from-purple-500 via-pink-500 to-purple-500`

**Layout:**
- Desktop: Horizontal flow (left to right)
- Mobile: Vertical flow (top to bottom)
- Steps are evenly spaced
- Container has subtle background (transparent or very light gradient)

---

## Component Structure

### 1. Container
- Background: Transparent or very subtle gradient (`bg-gradient-to-br from-purple-50/30 to-pink-50/30` light / `from-slate-800/30 to-slate-900/30` dark)
- Padding: `p-6` mobile, `p-8` desktop
- Rounded: `rounded-2xl`
- Border: Optional subtle border (`border border-purple-200/50` light / `border-slate-700/50` dark)

### 2. Title Section (Optional - can be minimal)
- Text: "Your Book Creation Journey" or "What Happens Next"
- Style: Gradient text (`bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`)
- Size: `text-lg` mobile, `text-xl` desktop
- Position: Centered above timeline

### 3. Interactive Timeline Flow

#### Step 1: Book Creation
- **Node:** Circular, gradient background (`from-purple-500 to-purple-600`)
- **Icon:** BookOpen (white, centered)
- **Step Number:** Small badge "1" (top-right of node)
- **Title:** "Book Creation" (appears below node or on hover)
- **Description:** "After payment, we immediately create your digital children's book. Available within just 2 hours and you'll receive an email when it's ready!"
  - Description appears on hover as tooltip or expands below
  - Use Framer Motion for smooth reveal

#### Step 2: Edit & Perfect
- **Node:** Circular, gradient background (`from-pink-500 to-rose-500`)
- **Icon:** Pencil (white, centered)
- **Step Number:** Small badge "2" (top-right of node)
- **Title:** "Edit & Perfect" (appears below node or on hover)
- **Description:** "After creation you can easily adjust texts and illustrations until the result is perfect."
  - Description appears on hover as tooltip or expands below

#### Step 3: Share & Print
- **Node:** Circular, gradient background (`from-purple-600 to-pink-600`)
- **Icon:** Gift or Share2 (white, centered)
- **Step Number:** Small badge "3" (top-right of node)
- **Title:** "Share & Print" (appears below node or on hover)
- **Description:** "Happy with it? Share your digital book directly with family and friends or order a beautiful hardcover copy as a lasting memory."
  - Description appears on hover as tooltip or expands below

### 4. Connecting Flow Line
- **Style:** Gradient line (`from-purple-500 via-pink-500 to-purple-500`)
- **Animation:** Draw effect on mount (SVG path animation or width animation)
- **Position:** Between nodes (horizontal) or beside nodes (vertical)
- **Thickness:** `h-1` or `h-0.5` (subtle)
- **Optional:** Animated dots or particles along the line

### 5. Email Input Section (Unauthenticated Users Only)
- **Conditional:** Only show if `!user` (not logged in)
- **Container:** `rounded-xl`, `border-2`, `border-purple-200`, `bg-purple-50/50`
- **Icon:** Mail (purple)
- **Label:** "Email Address" (bold)
- **Description:** "We need your email to send you the cover image and marketing updates."
- **Input:** Full width, email type, placeholder
- **Validation:** Format validation, error message (red text) if invalid

### 6. Action Buttons Section

#### 6.1 Create Free Cover Button (Conditional)
- **Show only if:** `hasFreeCover === true`
- **Style:** Gradient green (`from-green-500 to-emerald-500`)
- **Icon:** Gift
- **Text:** "Create Free Cover"
- **Helper text:** "Use your free cover credit to create just the cover (Page 1)"
- **Full width, rounded-xl**

#### 6.2 Purchase Button (Main Action)
- **Style:** Gradient purple-pink (`from-purple-500 to-pink-500`)
- **Icon:** ShoppingCart
- **Text:** "Pay & Create My Book"
- **Price Display:** Show price below or next to button (e.g., "$7.99" or currency from config)
- **Helper text:** "You'll receive this amount as a discount on the hardcover!"
- **Full width, rounded-xl, shadow-lg**
- **Hover:** Scale 1.05, shadow-xl
- **State:** Disabled if email missing (unauthenticated users)

#### 6.3 Back Button
- **Style:** Outline, ghost variant
- **Icon:** ArrowLeft
- **Text:** "Back"
- **Link:** `/create/step5`
- **Position:** Left side

---

## Design Requirements

### Colors
- Primary gradient: `from-purple-500 to-pink-500` (buttons)
- Green gradient: `from-green-500 to-emerald-500` (free cover button)
- Step 1 node: `from-purple-500 to-purple-600`
- Step 2 node: `from-pink-500 to-rose-500`
- Step 3 node: `from-purple-600 to-pink-600`
- Flow line: `from-purple-500 via-pink-500 to-purple-500`
- Background: `from-purple-50 via-white to-pink-50` (light) / `from-slate-900 via-slate-900 to-slate-800` (dark)

### Typography
- Title: `text-lg` mobile, `text-xl` desktop (bold, gradient)
- Step title: `text-sm` mobile, `text-base` desktop (semibold)
- Description: `text-xs` mobile, `text-sm` desktop (regular)
- Button text: `text-sm` mobile, `text-base` desktop (semibold)

### Spacing
- Container: `max-w-4xl`, `mx-auto`
- Timeline padding: `p-6` mobile, `p-8` desktop
- Node size: `h-16 w-16` mobile, `h-20 w-20` desktop
- Node spacing: `gap-8` mobile, `gap-12` desktop (horizontal) / `space-y-8` (vertical)
- Section spacing: `space-y-6`

### Responsive Breakpoints
- Mobile: < 768px (vertical flow, stacked)
- Tablet: 768px - 1023px (horizontal flow, adjusted spacing)
- Desktop: 1024px+ (horizontal flow, full spacing)

### Animations (REQUIRED - Be Creative!)
- **Container:** Fade in with scale (`initial: { opacity: 0, scale: 0.95 }`)
- **Timeline line:** Draw animation (SVG path or width animation)
- **Nodes:** Stagger animation (delay: 0.2, 0.4, 0.6)
  - Each node: Scale up + fade (`initial: { opacity: 0, scale: 0.5 }`)
  - Icon: Rotate in (`initial: { rotate: -180 }`)
- **Hover effects:**
  - Node: Scale 1.1, glow effect (`shadow-lg shadow-purple-500/50`)
  - Description: Slide up + fade (tooltip or expand)
- **Flow line:** Animated particles or dots (optional, subtle)

### Interactive Features
- **Hover on node:** 
  - Node scales up slightly
  - Description tooltip appears (or expands below)
  - Glow effect around node
- **Click on node (optional):** 
  - Expand description permanently
  - Highlight active step
- **Mobile:** Tap to expand description

---

## Technical Requirements

### State Management
```typescript
// Auth state
const [user, setUser] = useState<any>(null)
const [isLoadingAuth, setIsLoadingAuth] = useState(true)

// Email state (unauthenticated users)
const [email, setEmail] = useState<string>("")
const [emailError, setEmailError] = useState<string>("")

// Free cover state
const [hasFreeCover, setHasFreeCover] = useState(false)
const [isCheckingFreeCover, setIsCheckingFreeCover] = useState(true)

// Currency state
const [currencyConfig, setCurrencyConfig] = useState<{ currency: string; symbol: string; price: string }>({
  currency: "USD",
  symbol: "$",
  price: "$7.99",
})

// Wizard data
const [wizardData, setWizardData] = useState<any>(null)

// Loading states
const [isCreating, setIsCreating] = useState(false)
```

### Email Validation
```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

### Components to Use (EXACT IMPORTS)
```typescript
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import {
  BookOpen,
  Pencil,
  Gift,
  ShoppingCart,
  Mail,
  ArrowLeft,
  Loader2,
} from "lucide-react"
```

### File Location
- Page file: `app/create/step6/page.tsx`
- Must include `"use client"` directive
- Must be default export

### API Integration
- Purchase: Add to cart or redirect to `/cart?plan=ebook`
- Free Cover: POST `/api/books/create-free-cover`
- Email: Included in purchase request

---

## Key Features

1. **Interactive Timeline:**
   - Animated flow line connecting steps
   - Hover reveals descriptions
   - Smooth animations

2. **Email Input:**
   - Only for unauthenticated users
   - Format validation
   - Required for Purchase button

3. **Free Cover Feature:**
   - Conditional button
   - Only if user has free cover available

4. **Purchase Button:**
   - "Pay & Create My Book" text
   - Price display
   - Shopping cart icon

5. **Responsive Design:**
   - Mobile-first approach
   - Vertical flow on mobile
   - Horizontal flow on desktop

6. **Dark Mode:**
   - Full dark mode support
   - Consistent color scheme

---

## Visual Reference (DO NOT COPY)

**Inspiration (but make it unique):**
- Think: Interactive node-based flow
- Think: Animated progress visualization
- Think: Modern, minimal, elegant
- Think: Hover interactions reveal details

**Avoid:**
- Card/box layouts
- Simple lists
- Typical "step" components
- Designs similar to competitors

---

## Notes

- All data comes from localStorage (`kidstorybook_wizard`)
- Email is required for unauthenticated users
- Purchase button disabled if email missing
- Free Cover button only shows if available
- Timeline should be visually engaging but not overwhelming
- Animations enhance UX without being distracting
- Mobile experience is prioritized
- MUST match existing wizard step design patterns
- MUST use same gradient backgrounds and spacing
- MUST implement dark mode for all elements
- MUST be unique and not look like card/box layouts
```

---

## Kullanım Talimatları

1. Bu prompt'u v0.app'e kopyala-yapıştır yap
2. v0.app component'leri oluşturacak
3. Oluşan kodu `app/create/step6/page.tsx` dosyasına entegre et
4. Email validation logic'ini ekle
5. API entegrasyonlarını bağla (`/api/books/create-free-cover`, cart system)
6. localStorage data loading'i kontrol et
7. Auth state kontrolünü ekle
8. Responsive tasarımı kontrol et (mobil, tablet, desktop)
9. Dark mode'u test et
10. Animasyonları optimize et
11. Hover interactions'ı test et

---

## Önemli Notlar

- **Data Source:** localStorage'dan `kidstorybook_wizard` key'i ile data okunur
- **Auth Check:** Supabase `getUser()` ile auth state kontrol edilir
- **Email Required:** Unauthenticated users için email zorunlu
- **Free Cover:** Conditional rendering (hasFreeCover state)
- **Purchase Flow:** Sepete ekleme veya checkout'a yönlendirme
- **Timeline Design:** Interactive, animated, NOT card/box based
- **Import Paths:** Mutlaka `@/` alias kullanılmalı
- **File Location:** `app/create/step6/page.tsx`
- **Client Component:** `"use client"` directive gerekli

---

**Son Güncelleme:** 25 Ocak 2026
