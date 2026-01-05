# 🎨 v0.app Register Page Prompt

**Component:** Register Page  
**Faz:** 2.3.2 (Auth Sayfaları)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated register/signup page for KidStoryBook, a children's personalized storybook website, with email/password registration and OAuth options.

I've attached the Header, Footer, Hero Section, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, and Login Page components for KidStoryBook. Create a register page that matches this design, similar to the Login Page but with registration-specific fields.

Requirements:

**Structure:**
- Register page layout (centered form, full-page or split-screen design)
- Page should include:
  - Page title: "Create Your Account" or "Sign Up"
  - Subtitle: "Start creating magical stories for your child"
  - Name input field (first name, optional last name)
  - Email input field
  - Password input field (with show/hide toggle)
  - Confirm Password input field (with show/hide toggle)
  - Terms & Conditions checkbox (required)
  - Privacy Policy checkbox (required)
  - "Create Account" button (primary, gradient)
  - Divider: "Or continue with"
  - OAuth buttons: Google, Facebook, Instagram (optional)
  - "Already have an account? Sign in" link (to login page)
  - Decorative elements (optional: book icons, stars, sparkles)

**Register Form Fields:**
- **Name Input:**
  - Label: "Full Name" or "Name"
  - Placeholder: "John Doe"
  - Type: text
  - Required validation
  - Error message display
  - Icon: User (Lucide)
- **Email Input:**
  - Label: "Email"
  - Placeholder: "your@email.com"
  - Type: email
  - Required validation
  - Error message display
  - Icon: Mail (Lucide)
- **Password Input:**
  - Label: "Password"
  - Placeholder: "Create a password"
  - Type: password (with show/hide toggle)
  - Required validation
  - Minimum 6 characters (or as per requirements)
  - Password strength indicator (optional, can be simplified for MVP)
  - Error message display
  - Icon: Lock (Lucide)
  - Show/Hide toggle button (Eye/EyeOff icon)
- **Confirm Password Input:**
  - Label: "Confirm Password"
  - Placeholder: "Confirm your password"
  - Type: password (with show/hide toggle)
  - Required validation
  - Must match password field
  - Error message display
  - Icon: Lock (Lucide)
  - Show/Hide toggle button (Eye/EyeOff icon)
- **Terms & Conditions Checkbox:**
  - Label: "I agree to the Terms & Conditions" (with link to /terms)
  - Checkbox component
  - Required (must be checked to submit)
  - Link to Terms & Conditions page
- **Privacy Policy Checkbox:**
  - Label: "I agree to the Privacy Policy" (with link to /privacy)
  - Checkbox component
  - Required (must be checked to submit)
  - Link to Privacy Policy page

**Action Buttons:**
- **Create Account Button:**
  - Text: "Create Account" or "Sign Up"
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
- Match the color scheme from Header/Footer/Hero/Login Page (purple-500, pink-500 gradient)
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
  - Clear hierarchy (primary: Create Account, secondary: OAuth)
  - Hover effects (scale, shadow)
- Links:
  - Underlined or colored text
  - Hover effect (color change)
- Decorative elements (optional):
  - Floating book icons
  - Stars or sparkles
  - Gradient blobs (background)
- Clean, professional, trustworthy aesthetic
- Similar to Login Page but with registration-specific fields

**Animations (Framer Motion):**
- Page fade-in animation (0.3s - 0.5s)
- Form slide-in from bottom (0.3s - 0.5s)
- Input focus animation (border color change, ring effect)
- Button hover effects (scale, shadow)
- OAuth button hover effects (scale, shadow)
- Error message slide-in (when validation fails)
- Loading spinner animation (when submitting)
- Decorative elements (floating, subtle movement)
- Stagger animation for form fields (sequential appearance)

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
- Lucide React icons (User, Mail, Lock, Eye, EyeOff, etc.)
- React Hook Form (for form handling)
- Zod (for validation)
- shadcn/ui components (Input, Button, Checkbox, Label)

**Form Validation:**
- Name: Required, minimum 2 characters
- Email: Valid email format required
- Password: Minimum 6 characters (or as per requirements)
- Confirm Password: Must match password field
- Terms & Conditions: Must be checked
- Privacy Policy: Must be checked
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
- Success message after registration (toast notification)
- Password strength indicator (weak, medium, strong)
- Email verification message (after registration)
- Redirect to login page (after successful registration)
- Social login icons (Google, Facebook, Instagram logos)

**MVP Simplification:**
For MVP, you can simplify to:
- Name + Email + Password + Confirm Password form
- Terms & Conditions checkbox (required)
- Privacy Policy checkbox (required)
- "Create Account" button
- "Already have an account? Sign in" link
- Basic OAuth buttons (Google, Facebook) - styling only, functionality comes later
- Basic validation (name required, email format, password match)
- No password strength indicator (optional)

**Special Note:**
- This is a registration page, so emphasize the "free cover" benefit if applicable
- Can add a small note: "Get 1 free book cover when you sign up!" (optional)
- Make it welcoming and encouraging for new users

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, and Login Page design, and effectively guides users to create their account and start creating magical stories.
```

---

## Beklenen Özellikler

- ✅ Register form (name + email + password + confirm password)
- ✅ Password show/hide toggle (both fields)
- ✅ Confirm password validation (must match)
- ✅ Terms & Conditions checkbox (required, with link)
- ✅ Privacy Policy checkbox (required, with link)
- ✅ "Create Account" button (gradient, primary)
- ✅ OAuth buttons (Google, Facebook, Instagram - optional)
- ✅ "Already have an account? Sign in" link
- ✅ Form validation (name, email, password match)
- ✅ Error message display
- ✅ Loading state (spinner when submitting)
- ✅ Framer Motion animasyonları (fade-in, slide-in, stagger, hover effects)
- ✅ Responsive tasarım
- ✅ Header/Footer/Hero/Login Page ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ Accessibility (keyboard navigation, screen reader support)

---

## MVP Simplification

**Basit versiyon için:**
- Name + Email + Password + Confirm Password form
- Terms & Conditions checkbox (required)
- Privacy Policy checkbox (required)
- "Create Account" button
- "Already have an account? Sign in" link
- OAuth buttons (styling only, functionality comes later in Faz 3)
- Basic validation
- No password strength indicator (optional)

**Gelişmiş versiyon için (ileride):**
- Password strength indicator
- Email verification message
- Success toast notification
- Redirect to login page
- Social login icons

---

## Yerleşim

**Önerilen konum:** `/auth/register` veya `/register`

**Layout:**
- Option 1: Centered form (max-width 400px, centered on page)
- Option 2: Split-screen (form left, decorative image/illustration right)

---

## Teknik Notlar

- Form handling: React Hook Form
- Validation: Zod schema (registerSchema)
- Icons: Lucide React (User, Mail, Lock, Eye, EyeOff, etc.)
- Components: shadcn/ui (Input, Button, Checkbox, Label)
- Animations: Framer Motion
- Client-side component (useState, useForm, etc.)
- Backend integration: Faz 3'te yapılacak (API routes)
- Password match validation: Zod `.refine()` method

---

**Son Güncelleme:** 4 Ocak 2026

