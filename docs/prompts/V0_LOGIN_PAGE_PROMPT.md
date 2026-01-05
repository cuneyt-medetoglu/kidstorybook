# 🎨 v0.app Login Page Prompt

**Component:** Login Page  
**Faz:** 2.3.1 (Auth Sayfaları)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated login page for KidStoryBook, a children's personalized storybook website, with email/password authentication and OAuth options.

I've attached the Header, Footer, Hero Section, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, and Cookie Banner components for KidStoryBook. Create a login page that matches this design.

Requirements:

**Structure:**
- Login page layout (centered form, full-page or split-screen design)
- Page should include:
  - Page title: "Welcome Back" or "Sign In"
  - Subtitle: "Sign in to continue creating magical stories"
  - Email input field
  - Password input field (with show/hide toggle)
  - "Remember me" checkbox
  - "Forgot password?" link
  - "Sign In" button (primary, gradient)
  - Divider: "Or continue with"
  - OAuth buttons: Google, Facebook, Instagram (optional)
  - "Don't have an account? Sign up" link (to register page)
  - Decorative elements (optional: book icons, stars, sparkles)

**Login Form Fields:**
- **Email Input:**
  - Label: "Email"
  - Placeholder: "your@email.com"
  - Type: email
  - Required validation
  - Error message display
  - Icon: Mail (Lucide)
- **Password Input:**
  - Label: "Password"
  - Placeholder: "Enter your password"
  - Type: password (with show/hide toggle)
  - Required validation
  - Error message display
  - Icon: Lock (Lucide)
  - Show/Hide toggle button (Eye/EyeOff icon)
- **Remember Me Checkbox:**
  - Label: "Remember me"
  - Checkbox component
  - Optional (not required)
- **Forgot Password Link:**
  - Text: "Forgot password?"
  - Link to: /auth/forgot-password
  - Underlined, purple/pink color
  - Hover effect

**Action Buttons:**
- **Sign In Button:**
  - Text: "Sign In"
  - Gradient background (purple to pink)
  - Full width (on mobile), auto width (on desktop)
  - Loading state (spinner when submitting)
  - Disabled state (when form is invalid)
  - Hover effect (scale, shadow)
- **OAuth Buttons:**
  - Google: "Continue with Google" (Google icon, white background, border)
  - Facebook: "Continue with Facebook" (Facebook icon, blue background)
  - Instagram: "Continue with Instagram" (Instagram icon, gradient background) - optional
  - Full width (on mobile), auto width (on desktop)
  - Hover effect (scale, shadow)

**Design:**
- Match the color scheme from Header/Footer/Hero (purple-500, pink-500 gradient)
- Layout options:
  - **Option 1:** Centered form (max-width 400px, centered on page)
  - **Option 2:** Split-screen (form left, decorative image/illustration right)
- Background: White or light gradient with subtle pattern
- Form container:
  - White background (or card with shadow)
  - Rounded corners (rounded-xl or rounded-2xl)
  - Padding (p-6 to p-8)
  - Border (subtle, optional)
  - Shadow (subtle, for depth)
- Input fields:
  - Rounded corners (rounded-lg)
  - Border (1-2px, gray-300)
  - Focus state: border color change (purple/pink), ring effect
  - Error state: red border, error message below
  - Icon inside input (left side)
- Buttons:
  - Rounded corners (rounded-lg or rounded-full)
  - Clear hierarchy (primary: Sign In, secondary: OAuth)
  - Hover effects (scale, shadow)
- Links:
  - Underlined or colored text
  - Hover effect (color change)
- Decorative elements (optional):
  - Floating book icons
  - Stars or sparkles
  - Gradient blobs (background)
- Clean, professional, trustworthy aesthetic

**Animations (Framer Motion):**
- Page fade-in animation (0.3s - 0.5s)
- Form slide-in from bottom (0.3s - 0.5s)
- Input focus animation (border color change, ring effect)
- Button hover effects (scale, shadow)
- OAuth button hover effects (scale, shadow)
- Error message slide-in (when validation fails)
- Loading spinner animation (when submitting)
- Decorative elements (floating, subtle movement)

**Responsive Design:**
- Desktop: Centered form or split-screen
- Tablet: Centered form, full width (max-width 500px)
- Mobile: Full width, stacked layout, padding (p-4)
- Mobile-first approach
- Touch-friendly tap targets (minimum 44x44px)
- Input fields: Full width on mobile

**Styling:**
- Background: White or light gradient (subtle)
- Form container: White card with shadow
- Text: Readable font size (text-sm to text-base)
- Labels: Bold or semibold
- Inputs: Comfortable padding (p-3 to p-4)
- Buttons: Clear hierarchy, sufficient padding
- Links: Underlined or colored, hover effect
- Dark mode support (dark: classes)

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- Framer Motion for animations
- TypeScript
- Lucide React icons (Mail, Lock, Eye, EyeOff, etc.)
- React Hook Form (for form handling)
- Zod (for validation)
- shadcn/ui components (Input, Button, Checkbox, Label)

**Form Validation:**
- Email: Valid email format required
- Password: Minimum 6 characters (or as per requirements)
- Error messages: Display below each field
- Real-time validation (on blur or onChange)
- Submit button disabled until form is valid

**Accessibility:**
- Clear, readable text
- Sufficient color contrast
- Keyboard accessible (Tab, Enter/Space for buttons)
- Screen reader friendly (aria-labels, aria-invalid, aria-describedby)
- Focus indicators
- Error messages associated with inputs (aria-describedby)

**Optional Features:**
- Success message after login (toast notification)
- Redirect to previous page (if user was redirected to login)
- "Remember me" functionality (localStorage or cookie)
- Password strength indicator (if needed)
- Social login icons (Google, Facebook, Instagram logos)

**MVP Simplification:**
For MVP, you can simplify to:
- Email + Password form
- "Sign In" button
- "Forgot password?" link
- "Don't have an account? Sign up" link
- Basic OAuth buttons (Google, Facebook) - styling only, functionality comes later
- No "Remember me" checkbox (optional)
- Basic validation (email format, password required)

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, and Cookie Banner design, and effectively guides users to sign in to their account.
```

---

## Beklenen Özellikler

- ✅ Login form (email + password)
- ✅ Password show/hide toggle
- ✅ "Remember me" checkbox (optional)
- ✅ "Forgot password?" link
- ✅ "Sign In" button (gradient, primary)
- ✅ OAuth buttons (Google, Facebook, Instagram - optional)
- ✅ "Don't have an account? Sign up" link
- ✅ Form validation (email format, password required)
- ✅ Error message display
- ✅ Loading state (spinner when submitting)
- ✅ Framer Motion animasyonları (fade-in, slide-in, hover effects)
- ✅ Responsive tasarım
- ✅ Header/Footer/Hero ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ Accessibility (keyboard navigation, screen reader support)

---

## MVP Simplification

**Basit versiyon için:**
- Email + Password form
- "Sign In" button
- "Forgot password?" link
- "Don't have an account? Sign up" link
- OAuth buttons (styling only, functionality comes later in Faz 3)
- Basic validation
- No "Remember me" checkbox (optional)

**Gelişmiş versiyon için (ileride):**
- "Remember me" checkbox
- Password strength indicator
- Social login icons
- Success toast notification
- Redirect to previous page

---

## Yerleşim

**Önerilen konum:** `/auth/login` veya `/login`

**Layout:**
- Option 1: Centered form (max-width 400px, centered on page)
- Option 2: Split-screen (form left, decorative image/illustration right)

---

## Teknik Notlar

- Form handling: React Hook Form
- Validation: Zod
- Icons: Lucide React (Mail, Lock, Eye, EyeOff, etc.)
- Components: shadcn/ui (Input, Button, Checkbox, Label)
- Animations: Framer Motion
- Client-side component (useState, useForm, etc.)
- Backend integration: Faz 3'te yapılacak (API routes)

---

**Son Güncelleme:** 4 Ocak 2026

