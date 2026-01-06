# v0.app Prompt: Book Creation Wizard - Step 2 (Reference Photo Upload)

**Component Name:** `BookWizardStep2` veya `ReferencePhotoUpload`  
**Purpose:** Kitap oluşturma wizard'ının ikinci adımı - Referans görsel yükleme (çocuk fotoğrafı)  
**File Path:** `app/create/step2/page.tsx` veya `components/wizard/Step2PhotoUpload.tsx`

---

## 🎯 Component Gereksinimleri

### Genel Yapı
- **Multi-step wizard'ın ikinci adımı** (Step 2 of 6)
- **Progress indicator** üstte (2/6 gösterimi, 33.33% progress bar)
- **Form layout:** Centered, max-width container
- **Navigation:** "Next" butonu (Step 3'e geçiş), "Back" butonu (Step 1'e dönüş)
- **Responsive:** Mobile-first, desktop'ta daha geniş layout

### Photo Upload Section

#### 1. Upload Area
- **Type:** Drag & drop zone + file picker button
- **Layout:** Large drop zone (min-height 300px on desktop, 250px on mobile)
- **Visual:**
  - Dashed border (purple-300, dark: purple-700)
  - Background: purple-50 (light), purple-900/20 (dark)
  - Hover state: border becomes solid, background slightly darker
  - Active/drag-over state: border becomes purple-500, background purple-100
- **Content:**
  - Large icon: Upload icon veya Image icon (Lucide) - center
  - Title: "Upload Reference Photo" / "Drag & drop your photo here"
  - Subtitle: "or click to browse"
  - File requirements text: "JPG, PNG up to 5MB"
  - File picker button: "Choose File" (centered, gradient button)
- **Functionality:**
  - Drag & drop support
  - Click to open file picker
  - File validation (format, size)
  - Error messages for invalid files

#### 2. Photo Preview
- **Display:** After successful upload
- **Layout:** Centered, max-width 400px, rounded corners
- **Features:**
  - Image preview (rounded-lg, shadow)
  - "Remove" button (top-right corner, X icon)
  - Image info: File name, size (below image)
- **Crop Option (Optional):**
  - "Crop Photo" button (optional, can be simplified for MVP)
  - Crop modal/overlay (Faz 3'te detaylı implement edilebilir)

#### 3. AI Analysis Section
- **Position:** Below photo preview (when photo is uploaded)
- **Layout:** Card with gradient border
- **Content:**
  - Title: "Analyze Photo with AI"
  - Description: "Get detailed character analysis including hair length, style, facial features, and more"
  - "Analyze Photo" button:
    - Gradient background (purple to pink)
    - Loading state (spinner, "Analyzing..." text)
    - Disabled state (when no photo uploaded)
    - Icon: Sparkles veya Brain (Lucide)
- **Analysis Results (After Analysis):**
  - Success state: CheckCircle icon
  - Results display:
    - Hair length: "Long" / "Medium" / "Short" (badge)
    - Hair style: "Curly" / "Straight" / "Wavy" / "Braided" (badge)
    - Hair texture: "Fine" / "Thick" (badge)
    - Face shape: "Round" / "Oval" / "Square" (badge)
    - Eye shape: "Almond" / "Round" / "Hooded" (badge)
    - Skin tone: "Light" / "Medium" / "Dark" (badge)
    - Additional details: List format
  - "Re-analyze" button (optional, if analysis fails)

### Progress Indicator
- **Position:** Top of the form
- **Style:** Horizontal progress bar veya step indicators
- **Current step:** Step 2 of 6 (highlighted)
- **Visual:** 
  - Progress bar: 2/6 filled (33.33%, purple-pink gradient)
  - Step dots: 6 dots, first two active
- **Text:** "Step 2 of 6" / "Reference Photo"

### Navigation Buttons
- **Back Button:**
  - Text: "Back"
  - Position: Bottom left (desktop), full width (mobile)
  - Style: Outline button (border, transparent background)
  - Icon: ArrowLeft (Lucide) - sol tarafta
  - Action: Navigate to Step 1
- **Next Button:**
  - Text: "Next"
  - Position: Bottom right (desktop), full width (mobile)
  - Style: Gradient background (purple to pink)
  - Disabled state: When no photo uploaded or analysis not completed (optional)
  - Icon: ArrowRight (Lucide) - sağ tarafta
  - Action: Navigate to Step 3

### Form Validation
- **File format:** JPG, PNG only
- **File size:** Maximum 5MB
- **Error messages:**
  - "Invalid file format. Please upload JPG or PNG"
  - "File size exceeds 5MB. Please choose a smaller file"
  - "Failed to upload. Please try again"
- **Success feedback:** Photo preview shown, upload success message

---

## 🎨 Design Requirements

### Color Scheme
- **Primary gradient:** Purple-500 to Pink-500 (from-purple-500 to-pink-500)
- **Background:** White (light mode), Slate-900 (dark mode)
- **Upload zone:** Purple-50 (light), Purple-900/20 (dark)
- **Border:** Purple-300 (light), Purple-700 (dark)
- **Hover/Active:** Purple-500 border, Purple-100 background

### Typography
- **Form title:** "Reference Photo" / "Upload Your Child's Photo" - 2xl font-bold
- **Section labels:** sm font-semibold
- **Helper text:** xs text-gray-500
- **Error messages:** sm text-red-500

### Layout
- **Container:** max-w-2xl mx-auto (centered)
- **Form padding:** p-6 to p-8
- **Upload zone:** min-h-[300px] (desktop), min-h-[250px] (mobile)
- **Photo preview:** max-w-400px, centered

### Animations (Framer Motion)
- **Page entrance:** Fade-in (0.5s)
- **Form slide-in:** From bottom (0.5s)
- **Upload zone hover:** Scale (1.02), border color change
- **Photo preview:** Fade-in + scale (0.9 to 1.0)
- **Analysis results:** Stagger animation (delay per badge)
- **Button hover:** Scale (1.02)
- **Button tap:** Scale (0.98)

### Icons (Lucide React)
- Upload (upload zone)
- Image (upload zone alternative)
- X (remove photo)
- Sparkles or Brain (AI analysis)
- CheckCircle (analysis success)
- ArrowLeft (Back button)
- ArrowRight (Next button)

---

## 📱 Responsive Design

### Mobile (< 768px)
- **Layout:** Single column, full width
- **Form padding:** p-4
- **Upload zone:** min-h-[250px]
- **Buttons:** Full width, stacked vertically
- **Photo preview:** Full width (with max-width constraint)

### Desktop (≥ 768px)
- **Layout:** Centered, max-width container
- **Form padding:** p-8
- **Upload zone:** min-h-[300px]
- **Buttons:** Auto width, inline (Back left, Next right)
- **Photo preview:** max-w-400px, centered

---

## 🌓 Dark Mode Support

- **Background:** dark:bg-slate-900
- **Form container:** dark:bg-slate-800
- **Upload zone:** dark:bg-purple-900/20
- **Text:** dark:text-slate-50, dark:text-slate-300
- **Borders:** dark:border-purple-700
- **Focus rings:** dark:ring-purple-400

---

## 🔧 Technical Requirements

### Dependencies
- `react-hook-form` - Form handling (optional, for file state)
- `framer-motion` - Animations
- `lucide-react` - Icons
- `@/components/ui/*` - shadcn/ui components (Button, Label)
- File handling: Native HTML5 File API

### Component Structure
```tsx
"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
// ... other imports

export default function BookWizardStep2() {
  const [photo, setPhoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // File upload handling
  // Drag & drop handling
  // File validation
  // Photo preview
  // AI analysis (placeholder, Faz 3'te backend)
  // Navigation
  // Animations
}
```

### State Management
- **Photo file:** `useState<File | null>`
- **Preview URL:** `useState<string | null>` (URL.createObjectURL)
- **Analysis state:** `useState<boolean>` (isAnalyzing)
- **Analysis results:** `useState<AnalysisResults | null>`
- **Errors:** `useState<string | null>`

### File Validation
```typescript
const validateFile = (file: File): string | null => {
  // Format check
  const validFormats = ['image/jpeg', 'image/jpg', 'image/png']
  if (!validFormats.includes(file.type)) {
    return "Invalid file format. Please upload JPG or PNG"
  }
  
  // Size check (5MB = 5 * 1024 * 1024 bytes)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return "File size exceeds 5MB. Please choose a smaller file"
  }
  
  return null
}
```

---

## ✨ Special Features

### Drag & Drop
- **Visual feedback:** Border color change, background change
- **Drop handling:** Prevent default, validate file, show preview
- **Drag over state:** Visual indicator (border becomes solid, background darker)

### Photo Preview
- **Image display:** Rounded corners, shadow, centered
- **Remove button:** Top-right corner, X icon, hover effect
- **File info:** File name, size (formatted: "2.5 MB")

### AI Analysis (UI Only - Faz 3'te Backend)
- **Button state:** Disabled when no photo, loading when analyzing
- **Simulated analysis:** 2-3 second delay, then show results
- **Results display:** Badges for each detected feature
- **Error handling:** "Analysis failed. Please try again" message

### User Experience
- **Auto-focus:** Upload zone on page load (optional)
- **Keyboard navigation:** Tab order logical
- **Accessibility:** 
  - aria-labels for upload zone
  - aria-describedby for error messages
  - Keyboard support for file picker
- **Loading states:** Spinner during analysis
- **Success feedback:** Analysis results animation

---

## 🎯 v0.app Prompt (Copy-Paste Ready)

```
Create a multi-step wizard form component for Step 2: Reference Photo Upload.

This is the second step (2 of 6) in a book creation wizard for a children's book platform called KidStoryBook.

**Layout:**
- Progress indicator at the top showing "Step 2 of 6" with a progress bar (2/6 filled, 33.33%, purple-pink gradient)
- Centered form container (max-width 2xl) with white background and shadow
- Form title: "Reference Photo" / "Upload Your Child's Photo" (2xl font-bold)

**Upload Section:**
1. **Drag & Drop Zone:**
   - Large drop zone (min-height 300px desktop, 250px mobile)
   - Dashed border (purple-300, dark: purple-700)
   - Background: purple-50 (light), purple-900/20 (dark)
   - Hover state: border becomes solid, background slightly darker
   - Active/drag-over state: border becomes purple-500, background purple-100
   - Content:
     - Large Upload icon (Lucide) - center
     - Title: "Upload Reference Photo" / "Drag & drop your photo here"
     - Subtitle: "or click to browse"
     - File requirements: "JPG, PNG up to 5MB"
     - "Choose File" button (centered, gradient button)
   - Functionality:
     - Drag & drop support
     - Click to open file picker
     - File validation (format: JPG/PNG, size: max 5MB)
     - Error messages for invalid files

2. **Photo Preview (After Upload):**
   - Display: Centered, max-width 400px, rounded corners, shadow
   - Features:
     - Image preview (rounded-lg)
     - "Remove" button (top-right corner, X icon)
     - File info: File name, size (below image, formatted: "2.5 MB")
   - Animation: Fade-in + scale (0.9 to 1.0)

3. **AI Analysis Section (Below Preview):**
   - Card with gradient border
   - Title: "Analyze Photo with AI"
   - Description: "Get detailed character analysis including hair length, style, facial features, and more"
   - "Analyze Photo" button:
     - Gradient background (purple to pink)
     - Loading state (spinner, "Analyzing..." text)
     - Disabled state (when no photo uploaded)
     - Sparkles or Brain icon (Lucide)
   - Analysis Results (After Analysis - Simulated for now):
     - Success state: CheckCircle icon
     - Results display as badges:
       - Hair length: "Long" / "Medium" / "Short" (badge)
       - Hair style: "Curly" / "Straight" / "Wavy" / "Braided" (badge)
       - Hair texture: "Fine" / "Thick" (badge)
       - Face shape: "Round" / "Oval" / "Square" (badge)
       - Eye shape: "Almond" / "Round" / "Hooded" (badge)
       - Skin tone: "Light" / "Medium" / "Dark" (badge)
     - Stagger animation for badges (delay per badge)
     - "Re-analyze" button (optional, if analysis fails)

**Navigation:**
- "Back" button at the bottom left (desktop) or full width (mobile)
  - Outline button (border, transparent background)
  - ArrowLeft icon (Lucide) - left side
  - Navigate to Step 1
- "Next" button at the bottom right (desktop) or full width (mobile)
  - Gradient background (purple to pink)
  - ArrowRight icon (Lucide) - right side
  - Disabled state: When no photo uploaded (optional: or analysis not completed)
  - Navigate to Step 3

**File Validation:**
- Format: JPG, PNG only
- Size: Maximum 5MB
- Error messages:
  - "Invalid file format. Please upload JPG or PNG"
  - "File size exceeds 5MB. Please choose a smaller file"
  - "Failed to upload. Please try again"
- Success feedback: Photo preview shown

**Styling:**
- Color scheme: Purple-500 to Pink-500 gradient for buttons and accents
- Background: White (light mode), Slate-900 (dark mode)
- Form container: White/Slate-800 with shadow and rounded corners
- Upload zone: Purple-50 (light), Purple-900/20 (dark)
- Borders: Purple-300 (light), Purple-700 (dark)
- Hover/Active: Purple-500 border, Purple-100 background

**Animations (Framer Motion):**
- Page fade-in (0.5s)
- Form slide-in from bottom (0.5s)
- Upload zone hover: scale(1.02), border color change
- Photo preview: fade-in + scale (0.9 to 1.0)
- Analysis results: stagger animation (delay per badge)
- Button hover: scale(1.02)
- Button tap: scale(0.98)

**Responsive:**
- Mobile: Single column, full width, stacked buttons, min-height 250px upload zone
- Desktop: Centered container, inline buttons (Back left, Next right), min-height 300px upload zone

**Technical:**
- Use native HTML5 File API for file handling
- Drag & drop support with visual feedback
- File validation (format, size)
- Photo preview using URL.createObjectURL
- AI analysis button (placeholder - Faz 3'te backend entegrasyonu)
- Simulated analysis results (2-3 second delay, then show badges)

**Design Match:**
Match the design style from Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, Login Page, Register Page, and Step 1 - modern, engaging, with purple-pink gradient accents, smooth animations, and clean layout.

Make it feel like a natural continuation of the wizard flow from Step 1.
```

---

## 📝 Notes

- **Backend Integration:** File upload ve AI analysis Faz 3'te yapılacak
- **File Storage:** Şimdilik client-side preview, Faz 3'te Supabase Storage'a yüklenecek
- **Crop Feature:** Opsiyonel, MVP'de basit tutulabilir, Faz 3'te detaylı implement edilebilir
- **AI Analysis:** Şimdilik simulated (2-3 second delay), Faz 3'te gerçek AI entegrasyonu
- **Validation:** Client-side validation şimdilik yeterli, server-side Faz 3'te

---

**Son Güncelleme:** 4 Ocak 2026

