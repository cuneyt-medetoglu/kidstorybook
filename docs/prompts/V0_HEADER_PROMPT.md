# 🎨 v0.app Header Component Prompt

**Component:** Header (Navigation Bar)  
**Faz:** 2.1.1  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated header/navigation bar component for KidStoryBook, a children's personalized storybook website, with playful animations similar to modern children's websites like justimagine.online.

Requirements:

**Structure:**
- Logo on the left (text-based: "KidStoryBook" with playful font)
- Navigation links in center (Home, Examples, Pricing, About)
- Right side: Country/Currency selector, Shopping cart icon, "Create a children's book" button
- Mobile: Hamburger menu that slides in from right

**Features:**
- Country/Currency selector dropdown (shows flag + currency: TR 🇹🇷 / USD 🇺🇸)
- Shopping cart icon with badge (shows item count when > 0)
- "Create a children's book" primary CTA button (gradient: purple to pink)
- Mobile hamburger menu with slide-in animation

**Animations (Framer Motion):**
- Header appears with fade-in on page load
- Navigation links: hover effect with scale(1.05) + color transition
- Shopping cart icon: bounce animation when item count changes
- "Create a children's book" button: hover scale(1.05) + gradient shift
- Mobile menu: slide in from right with backdrop blur
- Sticky header: smooth scroll behavior (stays at top when scrolling down)

**Styling:**
- Background: white with subtle shadow on scroll
- Rounded corners on mobile menu
- Children-friendly colors (soft purple/pink accents)
- Playful but professional typography
- Responsive design (mobile-first)

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- shadcn/ui components (Button, Dropdown, Sheet for mobile menu)
- Framer Motion for animations
- TypeScript

**Mobile Behavior:**
- Hamburger icon on mobile (< 768px)
- Full-screen slide-in menu
- Backdrop blur effect
- Close button with animation

**Interactive Elements:**
- All buttons and links have hover states
- Active page indicator on navigation links
- Smooth transitions (0.3s ease-in-out)
- Loading states for cart icon

Make it modern, playful, and engaging for parents creating books for their children.
```

---

## Beklenen Çıktı

- Header component (TypeScript)
- Mobile menu component
- Responsive design
- Framer Motion animations
- shadcn/ui components kullanımı

---

## Entegrasyon Notları

- Component `components/layout/Header.tsx` olarak kaydedilecek
- Mobile menu `components/layout/MobileMenu.tsx` olarak ayrı component olabilir
- Framer Motion import'ları kontrol edilecek
- shadcn/ui Sheet component mobile menu için kullanılacak

---

**Son Güncelleme:** 4 Ocak 2026

