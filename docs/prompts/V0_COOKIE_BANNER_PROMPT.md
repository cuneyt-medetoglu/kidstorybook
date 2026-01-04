# 🎨 v0.app Cookie Banner Prompt

**Component:** Cookie Banner  
**Faz:** 2.2.8 (Ana Sayfa)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated cookie consent banner for KidStoryBook, a children's personalized storybook website, that is GDPR/KVKK compliant.

I've attached the Header, Footer, Hero Section, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, and FAQ Section components for KidStoryBook. Create a cookie banner that matches this design.

Requirements:

**Structure:**
- Cookie consent banner (bottom fixed or top banner style)
- Banner should show:
  - Cookie consent message/description
  - Cookie categories (Essential, Analytics, Marketing - optional, can be simplified)
  - Action buttons: "Accept All", "Decline", "Customize" (or "Settings")
  - Link to Privacy Policy
  - Close/Dismiss button (optional, only after user action)

**Cookie Banner Content:**

**Message:**
- Main text: "We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. By clicking 'Accept All', you consent to our use of cookies."
- Alternative (shorter): "We use cookies to improve your experience. You can choose which cookies to accept."
- Link: "Learn more" → Privacy Policy page

**Cookie Categories (Optional - can be simplified for MVP):**
1. **Essential Cookies** (Always active, cannot be disabled)
   - Required for the website to function
   - Session management, security
2. **Analytics Cookies** (Optional)
   - Help us understand how visitors use the site
   - Google Analytics, etc.
3. **Marketing Cookies** (Optional)
   - Used to deliver relevant ads
   - Tracking, remarketing

**Design:**
- Match the color scheme from Header/Footer/Hero (purple-500, pink-500 gradient)
- Banner style:
  - Bottom fixed (recommended) or top banner
  - Full width or centered with max-width
  - Background: white or light gradient with border/shadow
  - Rounded corners (top corners if bottom fixed)
- Text: Clear, readable, not too small
- Buttons:
  - "Accept All": Gradient (purple to pink), prominent
  - "Decline": Outline or secondary style
  - "Customize" / "Settings": Text button or outline
- Link: Underlined, purple/pink color
- Close button: X icon, subtle, top-right corner (only show after user action)
- Clean, professional, trustworthy aesthetic

**Animations (Framer Motion):**
- Banner slides in from bottom (if bottom fixed) or top (if top banner)
- Fade-in animation (0.3s - 0.5s)
- Slide-up/down animation (smooth, 0.3s - 0.5s)
- Button hover effects (scale, shadow)
- Exit animation (slide down/up when dismissed)

**Responsive Design:**
- Desktop: Full width bottom banner or centered max-width banner
- Tablet: Full width or centered
- Mobile: Full width, stacked buttons if needed
- Mobile-first approach
- Touch-friendly tap targets (minimum 44x44px)

**Styling:**
- Background: White or light gradient (subtle)
- Border: Top border (if bottom fixed) or bottom border (if top banner), subtle color
- Shadow: Subtle shadow for depth
- Padding: Comfortable spacing (p-4 to p-6)
- Text: Readable font size (text-sm to text-base)
- Buttons: Clear hierarchy (primary: Accept, secondary: Decline, tertiary: Customize)
- Link: Underlined, hover effect
- Dark mode support (dark: classes)

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- Framer Motion for animations
- TypeScript
- Lucide React icons (Cookie, X, Settings, etc.)
- localStorage for storing user preferences

**Cookie Consent Logic (Simple MVP):**
- Store user preference in localStorage
- Key: "cookie-consent"
- Values: "accepted", "declined", "custom" (with categories)
- Show banner only if no preference stored
- Hide banner after user action (accept/decline)
- Remember preference for future visits

**Accessibility:**
- Clear, readable text
- Sufficient color contrast
- Keyboard accessible (Tab, Enter/Space for buttons)
- Screen reader friendly (aria-labels, aria-expanded for customize panel)
- Focus indicators

**Optional Features:**
- "Customize" panel (expandable, shows cookie categories with toggles)
- Cookie details (what cookies are used, why)
- Duration indicators (session, persistent)
- Third-party cookie information
- Cookie policy link

**MVP Simplification:**
For MVP, you can simplify to:
- Simple banner with message
- Two buttons: "Accept All" and "Decline"
- Link to Privacy Policy
- Store preference in localStorage
- Hide banner after action
- No "Customize" panel (can be added later)

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, and FAQ Section design, and effectively communicates cookie usage in a clear, trustworthy way while being GDPR/KVKK compliant.
```

---

## Beklenen Özellikler

- ✅ Cookie consent banner (bottom fixed önerilen)
- ✅ Cookie consent message (kısa ve açıklayıcı)
- ✅ Action buttons: "Accept All", "Decline", "Customize" (optional)
- ✅ Privacy Policy link
- ✅ Framer Motion animasyonları (slide-in, fade-in, exit)
- ✅ localStorage ile kullanıcı tercihi saklama
- ✅ Responsive tasarım
- ✅ Header/Footer/Hero ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ GDPR/KVKK uyumlu

---

## MVP Simplification

**Basit versiyon için:**
- Cookie mesajı
- İki buton: "Accept All" ve "Decline"
- Privacy Policy link
- localStorage'da tercih saklama
- Banner'ı gizleme (kullanıcı tercih yaptıktan sonra)
- "Customize" paneli yok (sonra eklenebilir)

**Gelişmiş versiyon için (ileride):**
- Cookie kategorileri (Essential, Analytics, Marketing)
- "Customize" paneli (expandable)
- Cookie detayları
- Süre göstergeleri

---

## Yerleşim

**Önerilen konum:** Bottom fixed (sayfanın altında, fixed position)

**Alternatif konumlar:**
- Top banner (header altı)
- Center modal (overlay)

---

## Teknik Notlar

- localStorage key: `"cookie-consent"`
- Values: `"accepted"`, `"declined"`, `"custom"`
- Banner sadece tercih yoksa gösterilir
- Kullanıcı tercih yaptıktan sonra banner gizlenir
- Tercih gelecek ziyaretler için hatırlanır
- Client-side component (useState, useEffect)

---

**Son Güncelleme:** 4 Ocak 2026

