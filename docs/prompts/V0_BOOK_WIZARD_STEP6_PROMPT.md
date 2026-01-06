# v0.app Prompt: Book Creation Wizard - Step 6 (Preview & Confirmation)

**Component Name:** `BookWizardStep6` veya `PreviewConfirmation`  
**Purpose:** Kitap oluşturma wizard'ının altıncı ve son adımı - Önizleme ve onay  
**File Path:** `app/create/step6/page.tsx` veya `components/wizard/Step6Preview.tsx`

---

## 🎯 Component Gereksinimleri

### Genel Yapı
- **Multi-step wizard'ın altıncı ve son adımı** (Step 6 of 6)
- **Progress indicator** üstte (6/6 gösterimi, 100% progress bar)
- **Form layout:** Centered, max-width container
- **Navigation:** "Back" butonu (Step 5'e geçiş), "Create Book" butonu (ana CTA)
- **Responsive:** Mobile-first, desktop'ta scrollable layout
- **Language:** All labels and text in English (localization will be handled later)

### Preview Sections

#### 1. Character Information Summary
- **Label:** "Character Information" (bold, large heading)
- **Icon:** User icon (Lucide) - optional
- **Content:** Display all information from Step 1:
  - Name: "Name: [value]"
  - Age: "Age: [value] years old"
  - Gender: "Gender: [Boy/Girl]"
  - Hair Color: "Hair Color: [value]"
  - Eye Color: "Eye Color: [value]"
  - Special Features: "Special Features: [list, comma-separated]" (if any)
- **Layout:** Card-based, clean list format
- **Edit link:** "Edit" button/link (to Step 1) - optional, can be icon button

#### 2. Reference Photo Preview
- **Label:** "Reference Photo" (bold, large heading)
- **Icon:** Image icon (Lucide) - optional
- **Content:**
  - Photo preview: Display uploaded photo (if available)
  - Image: Rounded corners, shadow, max-width 300px
  - File info: File name, size (below image)
  - AI Analysis Results (if available): Display as badges (hair length, style, texture, face shape, eye shape, skin tone)
- **Layout:** Card-based, centered photo
- **Edit link:** "Edit" button/link (to Step 2) - optional
- **Note:** If no photo uploaded, show placeholder or "No photo uploaded" message

#### 3. Theme & Age Group Summary
- **Label:** "Theme & Age Group" (bold, large heading)
- **Icon:** Sparkles icon (Lucide) - optional
- **Content:**
  - Theme: Display selected theme with icon and description
  - Age Group: Display selected age group with icon and description
- **Layout:** Card-based, two items side by side (desktop) or stacked (mobile)
- **Edit link:** "Edit" button/link (to Step 3) - optional

#### 4. Illustration Style Summary
- **Label:** "Illustration Style" (bold, large heading)
- **Icon:** Palette icon (Lucide) - optional
- **Content:**
  - Display selected illustration style
  - Show style name, description
  - Optional: Show style preview image (small, thumbnail)
- **Layout:** Card-based
- **Edit link:** "Edit" button/link (to Step 4) - optional

#### 5. Custom Requests Summary
- **Label:** "Custom Requests" (bold, large heading)
- **Icon:** Lightbulb icon (Lucide) - optional
- **Content:**
  - Display custom requests text (if provided)
  - If empty: "No custom requests" (gray text, italic)
- **Layout:** Card-based
- **Edit link:** "Edit" button/link (to Step 5) - optional

### Visual Design

#### Color Palette
- **Background:** Gradient (purple-50 via white to pink-50, dark: slate-900)
- **Summary cards:** White/dark:slate-800 with subtle shadow, rounded-xl
- **Section headers:** Gray-900/dark:slate-50 (bold)
- **Content text:** Gray-700/dark:slate-300
- **Edit links:** Purple-600/dark:purple-400 (underline, hover effect)
- **Buttons:** Gradient (purple-500 to pink-500, dark: purple-400 to pink-400)
- **Success/CTA button:** Large, prominent, gradient

#### Typography
- **Heading:** text-3xl font-bold (main title)
- **Section labels:** text-xl font-semibold
- **Content:** text-base
- **Helper text:** text-sm
- **Edit links:** text-sm

#### Spacing
- **Container:** max-w-4xl, mx-auto, px-4, py-8 md:py-12
- **Summary cards:** rounded-xl, p-6, mb-6
- **Section spacing:** mb-6 (between sections)
- **Content spacing:** mb-4 (within sections)

### Animations (Framer Motion)

#### Page Entry
- **Container:** fade-in + slide-up (y: 30 → 0, duration: 0.5s, delay: 0.2s)

#### Progress Indicator
- **Progress bar:** width animation (0 → 100%, duration: 0.8s, ease-out)
- **Text:** fade-in (duration: 0.5s)

#### Summary Sections
- **Container:** fade-in (duration: 0.4s)
- **Individual sections:** 
  - Stagger animation (delay: index * 0.1s)
  - Fade-in + slide-up (y: 20 → 0, duration: 0.4s)
  - Hover: Subtle scale (1.01) on card

#### Navigation Buttons
- **Container:** fade-in (duration: 0.4s, delay: 0.6s)
- **Buttons:**
  - Hover: scale(1.02)
  - Tap: scale(0.98)
  - "Create Book" button: Pulse animation on hover (optional)

#### Decorative Elements
- **Floating icons:** (desktop only, hidden on mobile)
  - CheckCircle, Sparkles, BookOpen, Star icons
  - Floating animation (y: [0, -15, 0], rotate: [0, 5, 0, -5, 0])
  - Infinite loop, duration: 3-4s per icon
  - Opacity: 0.4
  - Positioned absolutely around the form

### Responsive Design

#### Mobile (< 768px)
- **Layout:** Single column, stacked sections
- **Summary cards:** Full width
- **Photo preview:** Centered, max-width 100%
- **Spacing:** Reduced padding (p-4)
- **Decorative elements:** Hidden
- **Navigation:** Full width buttons, stacked

#### Tablet (768px - 1024px)
- **Layout:** Single column, wider cards
- **Photo preview:** Medium size
- **Spacing:** Medium padding (p-6)
- **Decorative elements:** Visible but smaller

#### Desktop (> 1024px)
- **Layout:** Single column, optimal width
- **Photo preview:** Larger, better visibility
- **Spacing:** Full padding (p-8)
- **Decorative elements:** Fully visible
- **Navigation:** Inline buttons (flex-row, justify-between)

### Navigation

#### Back Button
- **Text:** "Back"
- **Icon:** ArrowLeft (Lucide)
- **Link:** `/create/step5`
- **Style:** Outline button (border-2, border-gray-300)
- **Hover:** Border color change (purple-500), background (purple-50)
- **Animation:** Hover scale(1.02), tap scale(0.98)

#### Create Book Button
- **Text:** "Create Book" (large, prominent)
- **Icon:** Sparkles or Rocket (Lucide) - optional, right side
- **Style:** Large gradient button (purple-500 to pink-500)
- **Size:** Larger than other buttons (py-8, text-lg)
- **Animation:** Hover scale(1.05), pulse effect (optional)
- **Functionality:** Placeholder for now (Faz 3'te backend entegrasyonu)

### Accessibility

- **ARIA labels:** All interactive elements
- **Keyboard navigation:** Tab order, Enter to submit
- **Focus states:** Visible focus rings
- **Screen reader:** Descriptive labels for all sections
- **Color contrast:** WCAG AA compliant

### Dark Mode Support

- **Background:** slate-900 (dark mode)
- **Summary cards:** slate-800 (dark mode)
- **Text:** slate-50 (headings), slate-300 (body) (dark mode)
- **Borders:** slate-700 (dark mode)
- **Gradients:** Adjusted opacity for dark mode
- **Shadows:** Enhanced in dark mode

### Help Text

- **Location:** Below form, centered
- **Text:** "Need help? Contact Support" (link to /help)
- **Style:** Small text, gray-600, link (purple-600, underline)

---

## 🎯 v0.app Prompt (Copy-Paste Ready)

```
Create a multi-step wizard form component for Step 6: Preview & Confirmation.

This is the sixth and final step (6 of 6) in a book creation wizard for a children's book platform called KidStoryBook.

**Layout:**
- Progress indicator at the top showing "Step 6 of 6" with a progress bar (6/6 filled, 100%, purple-pink gradient)
- Centered form container (max-width 4xl) with white background and shadow
- Form title: "Review & Create" (3xl font-bold)
- Subtitle: "Review your selections and create your personalized book" (text-sm, gray-600)

**Preview Sections (in order):**

1. **Character Information Summary:**
   - Label: "Character Information" (xl font-semibold)
   - Icon: User (Lucide) - optional, left of label
   - Content (card-based, rounded-xl, p-6, white/slate-800 background):
     - Name: "Name: [value]" (text-base)
     - Age: "Age: [value] years old"
     - Gender: "Gender: [Boy/Girl]"
     - Hair Color: "Hair Color: [value]"
     - Eye Color: "Eye Color: [value]"
     - Special Features: "Special Features: [list, comma-separated]" (if any, otherwise omit)
   - Edit link: "Edit" (text-sm, purple-600, underline, hover effect) - top right of card, optional
   - Layout: Clean list format, left-aligned

2. **Reference Photo Preview:**
   - Label: "Reference Photo" (xl font-semibold)
   - Icon: Image (Lucide) - optional
   - Content (card-based):
     - Photo preview: Display uploaded photo (if available)
       - Image: Rounded corners (rounded-lg), shadow, max-width 300px, centered
       - File info: File name, size (below image, text-sm, gray-600)
     - AI Analysis Results (if available from Step 2):
       - Display as badges: Hair Length, Hair Style, Hair Texture, Face Shape, Eye Shape, Skin Tone
       - Badge style: Small rounded badges, gradient background, white text
       - Layout: Grid (2 columns), below photo
     - If no photo: "No photo uploaded" (gray text, italic)
   - Edit link: "Edit" (top right of card)
   - Layout: Centered photo, badges below

3. **Theme & Age Group Summary:**
   - Label: "Theme & Age Group" (xl font-semibold)
   - Icon: Sparkles (Lucide) - optional
   - Content (card-based):
     - Two items side by side (desktop) or stacked (mobile):
       - Theme: Display selected theme with icon, name, and description
       - Age Group: Display selected age group with icon, name, and description
     - Each item: Small card with icon (left), title (bold), description (text-sm)
   - Edit link: "Edit" (top right of card)
   - Layout: Grid (2 columns desktop, 1 column mobile)

4. **Illustration Style Summary:**
   - Label: "Illustration Style" (xl font-semibold)
   - Icon: Palette (Lucide) - optional
   - Content (card-based):
     - Display selected illustration style
     - Show style name (bold), description (text-sm)
     - Optional: Show style preview image (small thumbnail, 100x100px, rounded)
   - Edit link: "Edit" (top right of card)
   - Layout: Horizontal layout (icon/image left, text right)

5. **Custom Requests Summary:**
   - Label: "Custom Requests" (xl font-semibold)
   - Icon: Lightbulb (Lucide) - optional
   - Content (card-based):
     - Display custom requests text (if provided)
     - If empty: "No custom requests" (gray text, italic, text-sm)
   - Edit link: "Edit" (top right of card)
   - Layout: Text block

**Summary Card Design:**
- Background: White (light), slate-800 (dark)
- Border: None or subtle border (gray-200/slate-700)
- Padding: p-6
- Rounded corners: rounded-xl
- Shadow: Subtle shadow
- Hover: Slight scale (1.01) on hover
- Edit link: Small, purple-600, underline, positioned top-right

**Navigation:**
- "Back" button at the bottom left (desktop) or full width (mobile)
  - Outline button (border-2, border-gray-300, transparent background)
  - ArrowLeft icon (Lucide) - left side
  - Hover: Border color change (purple-500), background (purple-50)
  - Navigate to Step 5
- "Create Book" button at the bottom right (desktop) or full width (mobile)
  - Large gradient background (purple-500 to pink-500)
  - Sparkles or Rocket icon (Lucide) - right side
  - Text: "Create Book" (text-lg font-bold)
  - Size: Larger (py-8, px-8)
  - Hover: scale(1.05), pulse effect (optional)
  - Disabled state: When form data is incomplete (optional check)
  - Functionality: Placeholder for now (will trigger book creation in Faz 3)

**Styling:**
- Color scheme: Purple-500 to Pink-500 gradient for buttons and accents
- Background: Gradient (purple-50 via white to pink-50, dark: slate-900)
- Form container: White/Slate-800 with shadow-2xl, rounded-2xl, backdrop-blur-sm
- Summary cards: White/Slate-800 with subtle shadow, rounded-xl
- Text: Gray-900/Slate-50 (headings), Gray-700/Slate-300 (body)
- Edit links: Purple-600/Purple-400 (underline, hover effect)

**Animations (Framer Motion):**
- Page fade-in + slide-up (y: 30 → 0, duration: 0.5s, delay: 0.2s)
- Progress bar: width animation (0 → 100%, duration: 0.8s, ease-out)
- Summary sections: Stagger animation (delay: index * 0.1s), fade-in + slide-up
- Card hover: Subtle scale (1.01)
- Button hover: scale(1.02) for Back, scale(1.05) for Create Book
- Button tap: scale(0.98)
- Decorative floating elements (desktop only): CheckCircle, Sparkles, BookOpen, Star icons with floating animation

**Responsive:**
- Mobile: Single column, stacked sections, full width buttons, decorative elements hidden
- Tablet: Single column, wider cards, medium padding, decorative elements visible but smaller
- Desktop: Single column, optimal width, inline buttons, decorative elements fully visible

**Technical:**
- This is a preview/confirmation step - data should be displayed from previous steps
- For MVP: Data can be passed via URL params, localStorage, or context (Faz 3'te proper state management)
- Summary sections should display all collected data from Steps 1-5
- Edit links should navigate back to the respective step
- "Create Book" button is placeholder - will trigger book creation API in Faz 3
- Photo preview: Use next/image if available, otherwise native img tag
- AI Analysis results: Display if available (from Step 2), otherwise omit

**Design Match:**
Match the design style from Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, Login Page, Register Page, Step 1, Step 2, Step 3, Step 4, and Step 5 - modern, engaging, with purple-pink gradient accents, smooth animations, and clean layout.

Make it feel like a natural continuation and completion of the wizard flow from Step 5.

**Important:**
- All labels, descriptions, and text must be in English (no Turkish)
- Use Lucide React icons
- Summary sections should be clear and easy to scan
- Edit links are optional but recommended for better UX
- "Create Book" button should be prominent and inviting
- Keep animations smooth but not overwhelming
- Stagger effects should be subtle (0.1s delay per section)
- Photo preview should maintain aspect ratio
- AI Analysis results should be displayed as badges if available
```

---

## 📝 Implementation Notes

### Dependencies
- `framer-motion` - Animations
- `lucide-react` - Icons
- `next/link` - Navigation
- `next/image` - Image optimization (for photo preview)
- `@/components/ui/button` - Button component
- `@/components/ui/card` - Card component (optional, can be custom)

### State Management
- Data from previous steps: For MVP, can use URL params, localStorage, or context
- In Faz 3, this will be integrated with a global state management solution (Context API or Zustand)
- Form state will be submitted to backend API (Faz 3'te)

### File Structure
```
app/create/step6/
  └── page.tsx
```

### Data Structure
For MVP, data can be collected from:
- Step 1: Character information (name, age, gender, hair color, eye color, special features)
- Step 2: Reference photo (file, preview URL, AI analysis results if available)
- Step 3: Theme and age group
- Step 4: Illustration style
- Step 5: Custom requests

### Component Structure
```typescript
export default function Step6Page() {
  // Get data from previous steps (for MVP: localStorage, URL params, or context)
  // In Faz 3: Use proper state management
  
  const characterData = getCharacterData() // From Step 1
  const photoData = getPhotoData() // From Step 2
  const themeAgeGroup = getThemeAgeGroup() // From Step 3
  const illustrationStyle = getIllustrationStyle() // From Step 4
  const customRequests = getCustomRequests() // From Step 5
  
  const handleCreateBook = () => {
    // Placeholder for now
    // In Faz 3: Submit to backend API
    console.log("Creating book...")
  }
  
  return (
    <div>
      {/* Progress Indicator */}
      {/* Character Information Summary */}
      {/* Reference Photo Preview */}
      {/* Theme & Age Group Summary */}
      {/* Illustration Style Summary */}
      {/* Custom Requests Summary */}
      {/* Navigation */}
    </div>
  )
}
```

---

## 🎨 Design Inspiration

- **Summary cards:** Clean, scannable format
- **Edit links:** Easy way to go back and modify
- **Photo preview:** Visual confirmation
- **Create Book button:** Prominent, inviting CTA
- **Smooth animations:** Professional, polished feel

---

## ✅ Checklist

- [ ] Progress indicator (Step 6 of 6, 100% progress)
- [ ] Character Information Summary (all Step 1 data)
- [ ] Reference Photo Preview (Step 2 photo + AI analysis if available)
- [ ] Theme & Age Group Summary (Step 3 data)
- [ ] Illustration Style Summary (Step 4 data)
- [ ] Custom Requests Summary (Step 5 data)
- [ ] Edit links for each section (optional but recommended)
- [ ] Navigation buttons (Back, Create Book)
- [ ] Framer Motion animations (fade-in, slide-up, stagger)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Decorative floating elements (desktop only)
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Help text and support link
- [ ] All text in English (no Turkish)

---

## 📌 Important Notes

1. **Language:** All labels, descriptions, and text must be in English. Localization will be handled as a separate topic later.
2. **Data Collection:** For MVP, data can be collected from localStorage, URL params, or a simple context. In Faz 3, this will be replaced with proper state management.
3. **Photo Preview:** Use `next/image` component if available for better performance. Otherwise, use native `img` tag.
4. **AI Analysis:** Display AI analysis results from Step 2 if available. If not available, omit that section.
5. **Edit Links:** Edit links are optional but recommended for better UX. They should navigate back to the respective step.
6. **Create Book Button:** This is a placeholder for now. In Faz 3, this will trigger the book creation API.
7. **Validation:** Optional check to ensure all required data is present before allowing book creation.
8. **Icons:** Use Lucide React icons (User, Image, Sparkles, Palette, Lightbulb, CheckCircle, ArrowLeft, Sparkles/Rocket).
9. **Summary Cards:** Should be clear, scannable, and easy to understand at a glance.
10. **Animations:** Keep animations smooth but not overwhelming. Stagger effects should be subtle (0.1s delay per section).

---

**Son Güncelleme:** 4 Ocak 2026  
**Durum:** Ready for v0.app generation

