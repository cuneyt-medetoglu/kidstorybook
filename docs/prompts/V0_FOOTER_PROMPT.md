# 🎨 v0.app Footer Component Prompt

**Component:** Footer  
**Faz:** 2.1.1 (Layout ve Navigasyon)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated footer component for KidStoryBook, a children's personalized storybook website, with playful animations and child-friendly design.

Requirements:

**Structure:**
- Top section: Main footer content (4 columns on desktop, stacked on mobile)
  - Column 1: Company info (Logo, tagline, social media links)
  - Column 2: Quick Links (Home, Examples, Pricing, About)
  - Column 3: Support (Help Center, Contact, FAQ, Terms)
  - Column 4: Newsletter signup (email input + subscribe button)
- Bottom section: Copyright, legal links (Privacy Policy, Terms of Service, Cookie Policy)
- Divider line between sections

**Features:**
- Social media icons (Facebook, Instagram, Twitter/X, YouTube) with hover animations
- Newsletter signup form (email input + subscribe button)
- Quick links to important pages
- Legal links (Privacy, Terms, Cookies)
- Copyright text with current year

**Animations (Framer Motion):**
- Footer fades in when scrolling into view
- Social media icons: scale(1.1) on hover + color transition
- Newsletter input: focus animation (border color change)
- Subscribe button: hover scale(1.05) + gradient shift
- Links: hover underline animation (from left to right)
- Stagger animation for columns (each appears with slight delay)

**Styling:**
- Background: gradient from white to light purple/pink (subtle)
- Text: dark gray for readability
- Links: purple/pink accent color on hover
- Social icons: purple/pink gradient on hover
- Newsletter button: gradient (purple to pink) matching header CTA
- Rounded corners on newsletter input
- Shadow for depth (subtle)

**Responsive Design:**
- Desktop (≥768px): 4 columns layout
- Tablet (≥640px): 2 columns layout
- Mobile (<640px): Single column, stacked
- Mobile-first approach
- Touch-friendly tap targets (min 44px height)

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- shadcn/ui components (Button, Input)
- Framer Motion for animations
- TypeScript
- Lucide React icons (for social media)

**Interactive Elements:**
- All links have hover states
- Newsletter form (email validation, submit handler placeholder)
- Social media links (external links, open in new tab)
- Smooth scroll to top button (optional, floating)

**Color Scheme:**
- Match header colors (purple/pink gradient)
- Light mode: white background, dark text
- Dark mode: dark slate background, light text
- Use same color palette as header component

**Accessibility:**
- Proper semantic HTML (footer, nav, section)
- ARIA labels for social media links
- Keyboard navigation support
- Focus states visible

Make it modern, playful, and visually appealing - something that matches the header design and maintains the child-friendly theme throughout the website.
```

---

## Beklenen Özellikler

- ✅ 4 sütunlu layout (desktop)
- ✅ Responsive tasarım (mobile-first)
- ✅ Social media icons
- ✅ Newsletter signup form
- ✅ Framer Motion animasyonları
- ✅ Header ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ Accessibility özellikleri

---

**Son Güncelleme:** 4 Ocak 2026

