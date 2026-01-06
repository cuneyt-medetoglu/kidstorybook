# v0.app Prompt: Book Creation Wizard - Step 1 (Character Information Form)

**Component Name:** `BookWizardStep1` veya `CharacterInfoForm`  
**Purpose:** Kitap oluşturma wizard'ının ilk adımı - Karakter bilgileri formu  
**File Path:** `app/create/step1/page.tsx` veya `components/wizard/Step1CharacterInfo.tsx`

---

## 🎯 Component Gereksinimleri

### Genel Yapı
- **Multi-step wizard'ın ilk adımı** (Step 1 of 6)
- **Progress indicator** üstte (1/6 gösterimi)
- **Form layout:** Centered, max-width container
- **Navigation:** "Next" butonu (Step 2'ye geçiş), "Back" butonu yok (ilk adım)
- **Responsive:** Mobile-first, desktop'ta daha geniş layout

### Form Alanları

#### 1. Çocuğun Adı (Name)
- **Type:** Text input
- **Label:** "Child's Name" / "Çocuğun Adı"
- **Placeholder:** "Enter child's name" / "Çocuğun adını girin"
- **Required:** ✅ Yes
- **Validation:** 
  - Minimum 2 karakter
  - Maximum 50 karakter
  - Sadece harf ve boşluk (özel karakterler sınırlı)
- **Icon:** User icon (Lucide) - sol tarafta
- **Error message:** "Name must be at least 2 characters"

#### 2. Yaş (Age)
- **Type:** Number input
- **Label:** "Age" / "Yaş"
- **Placeholder:** "Enter age" / "Yaş girin"
- **Required:** ✅ Yes
- **Validation:**
  - Minimum: 0
  - Maximum: 12
  - Integer only
- **Icon:** Calendar icon veya Heart icon (Lucide) - sol tarafta
- **Error message:** "Age must be between 0 and 12"
- **Helper text:** "Age range: 0-12 years" (optional)

#### 3. Cinsiyet (Gender)
- **Type:** Radio button group
- **Label:** "Gender" / "Cinsiyet"
- **Required:** ✅ Yes
- **Options:**
  - "Boy" / "Erkek" (radio button)
  - "Girl" / "Kız" (radio button)
- **Layout:** Horizontal (yan yana) - desktop, Vertical (alt alta) - mobile
- **Styling:** Custom radio buttons (gradient border when selected)
- **Error message:** "Please select a gender"

#### 4. Saç Rengi (Hair Color)
- **Type:** Dropdown/Select
- **Label:** "Hair Color" / "Saç Rengi"
- **Required:** ✅ Yes
- **Options:**
  - "Light Blonde" / "Açık Kumral"
  - "Blonde" / "Kumral"
  - "Dark Blonde" / "Koyu Kumral"
  - "Black" / "Siyah"
  - "Brown" / "Kahverengi"
  - "Red" / "Kızıl"
- **Placeholder:** "Select hair color" / "Saç rengi seçin"
- **Icon:** Scissors icon veya User icon (Lucide) - sol tarafta
- **Error message:** "Please select a hair color"

#### 5. Göz Rengi (Eye Color)
- **Type:** Dropdown/Select
- **Label:** "Eye Color" / "Göz Rengi"
- **Required:** ✅ Yes
- **Options:**
  - "Blue" / "Mavi"
  - "Green" / "Yeşil"
  - "Brown" / "Kahverengi"
  - "Black" / "Siyah"
  - "Hazel" / "Ela"
- **Placeholder:** "Select eye color" / "Göz rengi seçin"
- **Icon:** Eye icon (Lucide) - sol tarafta
- **Error message:** "Please select an eye color"

#### 6. Özel Özellikler (Special Features)
- **Type:** Checkbox group (multiple selection)
- **Label:** "Special Features" / "Özel Özellikler"
- **Required:** ❌ No (optional)
- **Options:**
  - "Glasses" / "Gözlüklü" (checkbox)
  - "Freckles" / "Çilli" (checkbox)
  - "Dimples" / "Gamzeli" (checkbox)
  - "Braces" / "Diş Teli" (checkbox) - optional
  - "Curly Hair" / "Kıvırcık Saç" (checkbox) - optional
  - "Long Hair" / "Uzun Saç" (checkbox) - optional
- **Layout:** Grid layout (2 columns desktop, 1 column mobile)
- **Styling:** Custom checkboxes (gradient border when checked)
- **Helper text:** "Select any special features (optional)" (optional)

### Progress Indicator
- **Position:** Top of the form
- **Style:** Horizontal progress bar veya step indicators
- **Current step:** Step 1 of 6 (highlighted)
- **Visual:** 
  - Progress bar: 1/6 filled (purple-pink gradient)
  - Step dots: 6 dots, first one active
- **Text:** "Step 1 of 6" / "Adım 1 / 6"

### Navigation Buttons
- **Next Button:**
  - Text: "Next" / "İleri"
  - Position: Bottom right (desktop), full width (mobile)
  - Style: Gradient background (purple to pink)
  - Disabled state: When form is invalid
  - Loading state: (Faz 3'te backend entegrasyonu için)
  - Icon: ArrowRight (Lucide) - sağ tarafta
- **Back Button:**
  - ❌ Yok (ilk adım olduğu için)

### Form Validation
- **Real-time validation:** onChange mode
- **Error messages:** Below each field
- **Submit prevention:** Disable "Next" button when form is invalid
- **Validation library:** Zod (schema-based)
- **Form library:** React Hook Form

---

## 🎨 Design Requirements

### Color Scheme
- **Primary gradient:** Purple-500 to Pink-500 (from-purple-500 to-pink-500)
- **Background:** White (light mode), Slate-900 (dark mode)
- **Form container:** White/Slate-800 with shadow
- **Input borders:** Gray-300 (light), Slate-600 (dark)
- **Focus state:** Purple-500 ring
- **Error state:** Red-500 border and text

### Typography
- **Form title:** "Character Information" / "Karakter Bilgileri" - 2xl font-bold
- **Section labels:** sm font-semibold
- **Helper text:** xs text-gray-500
- **Error messages:** sm text-red-500

### Layout
- **Container:** max-w-2xl mx-auto (centered)
- **Form padding:** p-6 to p-8
- **Field spacing:** space-y-5 or space-y-6
- **Grid layout:** Special features checkboxes (grid-cols-2)

### Animations (Framer Motion)
- **Page entrance:** Fade-in (0.5s)
- **Form slide-in:** From bottom (0.5s)
- **Field animations:** Stagger effect (delay per field)
- **Button hover:** Scale (1.02)
- **Button tap:** Scale (0.98)
- **Error message:** Slide-in from top

### Icons (Lucide React)
- User (name field)
- Calendar or Heart (age field)
- Scissors or User (hair color)
- Eye (eye color)
- Check (checkboxes)
- ArrowRight (Next button)

---

## 📱 Responsive Design

### Mobile (< 768px)
- **Layout:** Single column, full width
- **Form padding:** p-4
- **Radio buttons:** Vertical stack
- **Checkboxes:** Single column
- **Buttons:** Full width, stacked
- **Progress indicator:** Simplified (dots only)

### Desktop (≥ 768px)
- **Layout:** Centered, max-width container
- **Form padding:** p-8
- **Radio buttons:** Horizontal (side by side)
- **Checkboxes:** 2 columns grid
- **Buttons:** Auto width, inline
- **Progress indicator:** Full progress bar + step numbers

---

## 🌓 Dark Mode Support

- **Background:** dark:bg-slate-900
- **Form container:** dark:bg-slate-800
- **Text:** dark:text-slate-50, dark:text-slate-300
- **Input borders:** dark:border-slate-600
- **Focus rings:** dark:ring-purple-400
- **Error states:** dark:text-red-400

---

## 🔧 Technical Requirements

### Dependencies
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Zod resolver
- `zod` - Schema validation
- `framer-motion` - Animations
- `lucide-react` - Icons
- `@/components/ui/*` - shadcn/ui components (Input, Label, Button, RadioGroup, Select, Checkbox)

### Component Structure
```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
// ... other imports

// Zod schema
const characterInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  age: z.number().min(0).max(12),
  gender: z.enum(["boy", "girl"]),
  hairColor: z.string().min(1, "Please select a hair color"),
  eyeColor: z.string().min(1, "Please select an eye color"),
  specialFeatures: z.array(z.string()).optional(),
})

type CharacterInfoFormData = z.infer<typeof characterInfoSchema>

export default function BookWizardStep1() {
  // Form handling
  // Progress indicator
  // Navigation
  // Animations
}
```

### State Management
- **Form state:** React Hook Form
- **Step navigation:** URL params veya state (Faz 3'te backend entegrasyonu)
- **Progress:** Calculated (current step / total steps)

---

## ✨ Special Features

### Decorative Elements (Optional)
- **Floating icons:** Star, Heart, Sparkles (desktop only, subtle)
- **Background pattern:** Subtle gradient or pattern
- **Illustration:** Small character illustration (optional, right side on desktop)

### User Experience
- **Auto-focus:** First field (name) on page load
- **Keyboard navigation:** Tab order logical
- **Accessibility:** 
  - aria-labels for all inputs
  - aria-invalid for error states
  - aria-describedby for error messages
- **Loading states:** (Faz 3'te backend için)
- **Success feedback:** (Faz 3'te backend için)

---

## 🎯 v0.app Prompt (Copy-Paste Ready)

```
Create a multi-step wizard form component for Step 1: Character Information Form.

This is the first step (1 of 6) in a book creation wizard for a children's book platform called KidStoryBook.

**Layout:**
- Progress indicator at the top showing "Step 1 of 6" with a progress bar (1/6 filled, purple-pink gradient)
- Centered form container (max-width 2xl) with white background and shadow
- Form title: "Character Information" / "Karakter Bilgileri" (2xl font-bold)

**Form Fields (in order):**
1. **Name Input:**
   - Label: "Child's Name" / "Çocuğun Adı"
   - Placeholder: "Enter child's name"
   - Type: text
   - Required, min 2 characters
   - User icon (Lucide) on the left
   - Error message below if invalid

2. **Age Input:**
   - Label: "Age" / "Yaş"
   - Placeholder: "Enter age (0-12)"
   - Type: number
   - Required, min 0, max 12
   - Calendar/Heart icon (Lucide) on the left
   - Error message below if invalid

3. **Gender Radio Group:**
   - Label: "Gender" / "Cinsiyet"
   - Options: "Boy" / "Erkek" and "Girl" / "Kız"
   - Horizontal layout (side by side on desktop, stacked on mobile)
   - Custom radio buttons with gradient border when selected
   - Required
   - Error message below if not selected

4. **Hair Color Dropdown:**
   - Label: "Hair Color" / "Saç Rengi"
   - Placeholder: "Select hair color"
   - Options: Light Blonde, Blonde, Dark Blonde, Black, Brown, Red
   - Required
   - Scissors/User icon (Lucide) on the left
   - Error message below if not selected

5. **Eye Color Dropdown:**
   - Label: "Eye Color" / "Göz Rengi"
   - Placeholder: "Select eye color"
   - Options: Blue, Green, Brown, Black, Hazel
   - Required
   - Eye icon (Lucide) on the left
   - Error message below if not selected

6. **Special Features Checkboxes:**
   - Label: "Special Features" / "Özel Özellikler" (optional)
   - Options: Glasses, Freckles, Dimples, Braces, Curly Hair, Long Hair
   - Grid layout (2 columns desktop, 1 column mobile)
   - Custom checkboxes with gradient border when checked
   - Optional field

**Navigation:**
- "Next" button at the bottom right (desktop) or full width (mobile)
- Gradient background (purple-500 to pink-500)
- ArrowRight icon (Lucide) on the right
- Disabled when form is invalid
- No "Back" button (this is step 1)

**Styling:**
- Color scheme: Purple-500 to Pink-500 gradient for buttons and accents
- Background: White (light mode), Slate-900 (dark mode)
- Form container: White/Slate-800 with shadow and rounded corners
- Input borders: Gray-300 (light), Slate-600 (dark)
- Focus state: Purple-500 ring
- Error state: Red-500 border and text

**Animations (Framer Motion):**
- Page fade-in (0.5s)
- Form slide-in from bottom (0.5s)
- Field stagger animations (delay per field)
- Button hover: scale(1.02)
- Button tap: scale(0.98)
- Error message slide-in from top

**Responsive:**
- Mobile: Single column, full width, stacked buttons
- Desktop: Centered container, horizontal radio buttons, 2-column checkbox grid

**Technical:**
- Use React Hook Form with Zod validation
- Real-time validation (onChange mode)
- Error messages below each field
- Accessibility: aria-labels, aria-invalid, aria-describedby

**Design Match:**
Match the design style from Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, Login Page, and Register Page - modern, engaging, with purple-pink gradient accents, smooth animations, and clean layout.

Make it feel like a natural continuation of the user journey from the homepage to creating their personalized book.
```

---

## 📝 Notes

- **Backend Integration:** Form submission ve step navigation Faz 3'te yapılacak
- **Data Persistence:** Form data localStorage'da saklanabilir (Faz 3'te backend'e kaydedilecek)
- **Multi-language:** Şimdilik TR/EN, gelecekte genişletilebilir
- **Validation:** Client-side validation şimdilik yeterli, server-side Faz 3'te

---

**Son Güncelleme:** 4 Ocak 2026

