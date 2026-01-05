# 🎨 v0.app Forgot Password Page Prompt

**Component:** Forgot Password Page  
**Faz:** 2.3.3 (Auth Sayfaları)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated forgot password/reset password page for KidStoryBook, a children's personalized storybook website, with email input and password reset flow.

I've attached the Header, Footer, Hero Section, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, Login Page, and Register Page components for KidStoryBook. Create a forgot password page that matches this design, similar to the Login/Register Pages but focused on password reset.

Requirements:

**Structure:**
- Forgot password page layout (centered form, full-page design)
- Page should include:
  - Page title: "Forgot Password?" or "Reset Your Password"
  - Subtitle: "Enter your email address and we'll send you a link to reset your password"
  - Email input field
  - "Send Reset Link" button (primary, gradient)
  - "Back to Sign In" link (to login page)
  - Success message (after email sent, optional for MVP)
  - Decorative elements (optional: book icons, stars, sparkles)

**Forgot Password Form Fields:**
- **Email Input:**
  - Label: "Email"
  - Placeholder: "your@email.com"
  - Type: email
  - Required validation
  - Error message display
  - Icon: Mail (Lucide)

**Action Buttons:**
- **Send Reset Link Button:**
  - Text: "Send Reset Link" or "Reset Password"
  - Gradient background (purple to pink)
  - Full width (on mobile), auto width (on desktop)
  - Loading state (spinner when submitting)
  - Disabled state (when form is invalid)
  - Hover effect (scale, shadow)
- **Back to Sign In Link:**
  - Text: "Back to Sign In" or "Remember your password? Sign in"
  - Link to: /auth/login
  - Underlined, purple/pink color
  - Hover effect

**Design:**
- Match the color scheme from Header/Footer/Hero/Login/Register Pages (purple-500, pink-500 gradient)
- Layout: Centered form (max-width 400px, centered on page)
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
  - Clear hierarchy (primary: Send Reset Link)
  - Hover effects (scale, shadow)
- Links:
  - Underlined or colored text
  - Hover effect (color change)
- Decorative elements (optional):
  - Floating book icons
  - Stars or sparkles
  - Gradient blobs (background)
- Clean, professional, trustworthy aesthetic
- Similar to Login/Register Pages but simpler (single input field)

**Animations (Framer Motion):**
- Page fade-in animation (0.3s - 0.5s)
- Form slide-in from bottom (0.3s - 0.5s)
- Input focus animation (border color change, ring effect)
- Button hover effects (scale, shadow)
- Error message slide-in (when validation fails)
- Loading spinner animation (when submitting)
- Success message fade-in (after email sent, optional)
- Decorative elements (floating, subtle movement)

**Responsive Design:**
- Desktop: Centered form
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
- Lucide React icons (Mail, ArrowLeft, etc.)
- React Hook Form (for form handling)
- Zod (for validation)
- shadcn/ui components (Input, Button, Label)

**Form Validation:**
- Email: Valid email format required
- Error messages: Display below the field
- Real-time validation (on blur or onChange)
- Submit button disabled until form is valid

**Accessibility:**
- Clear, readable text
- Sufficient color contrast
- Keyboard accessible (Tab, Enter/Space for buttons)
- Screen reader friendly (aria-labels, aria-invalid, aria-describedby)
- Focus indicators
- Error messages associated with input (aria-describedby)

**Optional Features:**
- Success message after email sent (toast notification or inline message)
- "Check your email" message with instructions
- Resend email button (if email not received)
- Redirect to login page (after successful email send)

**MVP Simplification:**
For MVP, you can simplify to:
- Email input form
- "Send Reset Link" button
- "Back to Sign In" link
- Basic validation (email format)
- Success message (inline, after email sent)
- No resend functionality (can be added later)

**Special Note:**
- This is a simple page with just one input field (email)
- Focus on clarity and ease of use
- Make it reassuring (users might be frustrated if they forgot their password)
- Success message should be clear and helpful

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, Login Page, and Register Page design, and effectively guides users to reset their password.
```

---

## Beklenen Özellikler

- ✅ Forgot password form (email only)
- ✅ "Send Reset Link" button (gradient, primary)
- ✅ "Back to Sign In" link
- ✅ Form validation (email format)
- ✅ Error message display
- ✅ Loading state (spinner when submitting)
- ✅ Success message (after email sent, optional)
- ✅ Framer Motion animasyonları (fade-in, slide-in, hover effects)
- ✅ Responsive tasarım
- ✅ Header/Footer/Hero/Login/Register Pages ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ Accessibility (keyboard navigation, screen reader support)

---

## MVP Simplification

**Basit versiyon için:**
- Email input form
- "Send Reset Link" button
- "Back to Sign In" link
- Basic validation (email format)
- Success message (inline, after email sent)
- No resend functionality (can be added later)

**Gelişmiş versiyon için (ileride):**
- Resend email button
- "Check your email" message with detailed instructions
- Redirect to login page (after successful email send)
- Toast notification

---

## Yerleşim

**Önerilen konum:** `/auth/forgot-password` veya `/auth/reset-password`

**Layout:**
- Centered form (max-width 400px, centered on page)
- Simple, focused design (single input field)

---

## Teknik Notlar

- Form handling: React Hook Form
- Validation: Zod schema (forgotPasswordSchema)
- Icons: Lucide React (Mail, ArrowLeft, etc.)
- Components: shadcn/ui (Input, Button, Label)
- Animations: Framer Motion
- Client-side component (useState, useForm, etc.)
- Backend integration: Faz 3'te yapılacak (API routes)
- Success state: After email sent, show success message

---

**Son Güncelleme:** 4 Ocak 2026

