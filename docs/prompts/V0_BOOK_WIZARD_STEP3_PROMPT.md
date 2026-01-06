# v0.app Prompt: Book Creation Wizard - Step 3 (Theme & Age Group Selection)

**Component Name:** `BookWizardStep3` veya `ThemeAgeGroupSelection`  
**Purpose:** Kitap oluşturma wizard'ının üçüncü adımı - Tema ve yaş grubu seçimi  
**File Path:** `app/create/step3/page.tsx` veya `components/wizard/Step3ThemeAgeGroup.tsx`

---

## 🎯 Component Gereksinimleri

### Genel Yapı
- **Multi-step wizard'ın üçüncü adımı** (Step 3 of 6)
- **Progress indicator** üstte (3/6 gösterimi, 50% progress bar)
- **Form layout:** Centered, max-width container
- **Navigation:** "Back" butonu (Step 2'ye geçiş), "Next" butonu (Step 4'e geçiş)
- **Responsive:** Mobile-first, desktop'ta grid layout
- **Language:** All labels and text in English (localization will be handled later)

### Form Alanları

#### 1. Tema Seçimi (Theme Selection)
- **Type:** Card-based selection (grid layout)
- **Label:** "Choose a Theme" (bold, large heading)
- **Required:** ✅ Yes
- **Layout:** 
  - Desktop: 3 columns grid (2 rows)
  - Tablet: 2 columns grid (3 rows)
  - Mobile: 1 column (stacked)
- **Options:** (Her biri bir card olacak)
  1. **Adventure** (Macera)
     - Icon: Mountain, Compass, veya MapPin (Lucide)
     - Color: Orange/Amber gradient
     - Description: "Exciting journeys and thrilling quests"
     - Preview image: Placeholder (optional, can be added later)
  2. **Fairy Tale** (Peri Masalı)
     - Icon: Sparkles, Wand2, veya Crown (Lucide)
     - Color: Purple/Pink gradient
     - Description: "Magical stories with princesses and castles"
     - Preview image: Placeholder
  3. **Educational** (Eğitici)
     - Icon: BookOpen, GraduationCap, veya Lightbulb (Lucide)
     - Color: Blue/Cyan gradient
     - Description: "Learning adventures with fun facts"
     - Preview image: Placeholder
  4. **Nature & Animals** (Doğa ve Hayvanlar)
     - Icon: Trees, Leaf, veya Rabbit (Lucide)
     - Color: Green/Emerald gradient
     - Description: "Wildlife adventures in nature"
     - Preview image: Placeholder
  5. **Space & Science** (Uzay ve Bilim)
     - Icon: Rocket, Star, veya Atom (Lucide)
     - Color: Indigo/Violet gradient
     - Description: "Cosmic adventures and discoveries"
     - Preview image: Placeholder
  6. **Sports & Activities** (Spor ve Aktiviteler)
     - Icon: Trophy, Activity, veya Target (Lucide)
     - Color: Red/Rose gradient
     - Description: "Active adventures and team spirit"
     - Preview image: Placeholder

- **Card Design:**
  - Hover effect: Scale (1.05), shadow increase
  - Selected state: Border (gradient, 3px), background (subtle gradient overlay)
  - Unselected state: Border (gray-200, 2px), background (white/dark:slate-800)
  - Icon: Large (h-12 w-12), centered at top
  - Title: Bold, text-lg
  - Description: Small text, gray-600/dark:slate-400
  - Animation: Fade-in + slide-up (stagger effect per card)

- **Validation:**
  - At least one theme must be selected
  - Error message: "Please select a theme"

#### 2. Yaş Grubu Seçimi (Age Group Selection)
- **Type:** Card-based selection (horizontal layout on desktop, vertical on mobile)
- **Label:** "Select Age Group" (bold, large heading)
- **Required:** ✅ Yes
- **Layout:**
  - Desktop: 3 cards in a row
  - Mobile: Stacked vertically
- **Options:** (Her biri bir card olacak)
  1. **0-2 Years** (0-2 Yaş)
     - Icon: Baby, Heart, veya Sparkles (Lucide)
     - Color: Pink/Rose gradient
     - Description: "Simple words, bright colors, basic concepts"
     - Features: "Very short sentences, repetitive patterns"
  2. **3-5 Years** (3-5 Yaş)
     - Icon: Smile, Star, veya BookOpen (Lucide)
     - Color: Yellow/Amber gradient
     - Description: "Simple stories, easy vocabulary"
     - Features: "5-8 word sentences, playful language"
  3. **6-9 Years** (6-9 Yaş)
     - Icon: GraduationCap, Rocket, veya Target (Lucide)
     - Color: Blue/Cyan gradient
     - Description: "More complex stories, richer vocabulary"
     - Features: "8-12 word sentences, engaging plots"

- **Card Design:**
  - Similar to theme cards but smaller
  - Hover effect: Scale (1.05), shadow increase
  - Selected state: Border (gradient, 3px), background (subtle gradient overlay)
  - Unselected state: Border (gray-200, 2px), background (white/dark:slate-800)
  - Icon: Medium (h-10 w-10), centered at top
  - Title: Bold, text-base
  - Description: Small text, gray-600/dark:slate-400
  - Features: Extra small text, gray-500/dark:slate-500 (italic)
  - Animation: Fade-in + slide-up (stagger effect per card)

- **Validation:**
  - At least one age group must be selected
  - Error message: "Please select an age group"

### Visual Design

#### Color Palette
- **Background:** Gradient (purple-50 via white to pink-50, dark: slate-900)
- **Cards:** White/dark:slate-800 with subtle shadow
- **Selected cards:** Gradient border (theme-specific color)
- **Buttons:** Gradient (purple-500 to pink-500, dark: purple-400 to pink-400)
- **Text:** Gray-900/dark:slate-50 (headings), Gray-600/dark:slate-400 (body)

#### Typography
- **Heading:** text-3xl font-bold (main title)
- **Section labels:** text-xl font-semibold
- **Card titles:** text-lg font-bold
- **Descriptions:** text-sm
- **Helper text:** text-xs

#### Spacing
- **Container:** max-w-4xl, mx-auto, px-4, py-8 md:py-12
- **Form card:** rounded-2xl, p-6 md:p-8, shadow-2xl, backdrop-blur-sm
- **Section spacing:** mb-8 (between sections)
- **Card grid gap:** gap-4 md:gap-6
- **Card padding:** p-6

### Animations (Framer Motion)

#### Page Entry
- **Container:** fade-in + slide-up (y: 30 → 0, duration: 0.5s, delay: 0.2s)

#### Progress Indicator
- **Progress bar:** width animation (0 → 50%, duration: 0.8s, ease-out)
- **Text:** fade-in (duration: 0.5s)

#### Theme Cards
- **Container:** fade-in (duration: 0.4s)
- **Individual cards:** 
  - Stagger animation (delay: index * 0.1s)
  - Fade-in + slide-up (y: 20 → 0, duration: 0.4s)
  - Hover: scale(1.05), shadow increase
  - Tap: scale(0.98)
  - Selected: border animation (color transition, 0.3s)

#### Age Group Cards
- **Container:** fade-in (duration: 0.4s, delay: 0.2s)
- **Individual cards:**
  - Stagger animation (delay: 0.3s + index * 0.1s)
  - Fade-in + slide-up (y: 20 → 0, duration: 0.4s)
  - Hover: scale(1.05), shadow increase
  - Tap: scale(0.98)
  - Selected: border animation (color transition, 0.3s)

#### Navigation Buttons
- **Container:** fade-in (duration: 0.4s, delay: 0.5s)
- **Buttons:**
  - Hover: scale(1.02)
  - Tap: scale(0.98)
  - Disabled: opacity-50, cursor-not-allowed

#### Decorative Elements
- **Floating icons:** (desktop only, hidden on mobile)
  - Star, Heart, Sparkles, BookOpen icons
  - Floating animation (y: [0, -15, 0], rotate: [0, 5, 0, -5, 0])
  - Infinite loop, duration: 3-4s per icon
  - Opacity: 0.4
  - Positioned absolutely around the form

### Responsive Design

#### Mobile (< 768px)
- **Layout:** Single column (stacked)
- **Cards:** Full width
- **Theme cards:** 1 column
- **Age group cards:** Stacked vertically
- **Spacing:** Reduced padding (p-4)
- **Decorative elements:** Hidden
- **Navigation:** Full width buttons, stacked

#### Tablet (768px - 1024px)
- **Layout:** 2 columns for theme cards, 3 columns for age group cards
- **Cards:** Responsive width
- **Spacing:** Medium padding (p-6)
- **Decorative elements:** Visible but smaller

#### Desktop (> 1024px)
- **Layout:** 3 columns for theme cards, 3 columns for age group cards
- **Cards:** Optimal width
- **Spacing:** Full padding (p-8)
- **Decorative elements:** Fully visible
- **Navigation:** Inline buttons (flex-row, justify-between)

### Form Validation

#### Client-Side (React Hook Form + Zod)
- **Theme:** Required, must be one of the 6 options
- **Age Group:** Required, must be one of the 3 options
- **Error messages:** Display below each section if validation fails
- **Error styling:** Red border, red text, error icon

#### Validation Schema (Zod)
```typescript
const themeAgeGroupSchema = z.object({
  theme: z.enum([
    "adventure",
    "fairy_tale",
    "educational",
    "nature",
    "space",
    "sports"
  ], {
    required_error: "Please select a theme"
  }),
  ageGroup: z.enum(["0-2", "3-5", "6-9"], {
    required_error: "Please select an age group"
  })
})
```

### Navigation

#### Back Button
- **Text:** "Back"
- **Icon:** ArrowLeft (Lucide)
- **Link:** `/create/step2`
- **Style:** Outline button (border-2, border-gray-300)
- **Hover:** Border color change (purple-500), background (purple-50)
- **Animation:** Hover scale(1.02), tap scale(0.98)

#### Next Button
- **Text:** "Next"
- **Icon:** ArrowRight (Lucide)
- **Link:** `/create/step4`
- **Style:** Gradient button (purple-500 to pink-500)
- **Disabled:** When theme or age group not selected
- **Animation:** Hover scale(1.02), tap scale(0.98)

### Accessibility

- **ARIA labels:** All interactive elements
- **Keyboard navigation:** Tab order, Enter to select
- **Focus states:** Visible focus rings
- **Screen reader:** Descriptive labels for all cards
- **Color contrast:** WCAG AA compliant

### Dark Mode Support

- **Background:** slate-900 (dark mode)
- **Cards:** slate-800 (dark mode)
- **Text:** slate-50 (headings), slate-400 (body) (dark mode)
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
Create a multi-step wizard form component for Step 3: Theme & Age Group Selection.

This is the third step (3 of 6) in a book creation wizard for a children's book platform called KidStoryBook.

**Layout:**
- Progress indicator at the top showing "Step 3 of 6" with a progress bar (3/6 filled, 50%, purple-pink gradient)
- Centered form container (max-width 4xl) with white background and shadow
- Form title: "Choose Theme & Age Group" (3xl font-bold)

**Theme Selection Section:**
- Label: "Choose a Theme" (xl font-semibold)
- Grid layout: 3 columns desktop, 2 columns tablet, 1 column mobile
- 6 theme cards (each clickable, card-based selection):

1. **Adventure:**
   - Icon: Mountain or Compass (Lucide, large h-12 w-12)
   - Color: Orange/Amber gradient border when selected
   - Title: "Adventure" (text-lg font-bold)
   - Description: "Exciting journeys and thrilling quests" (text-sm, gray-600)
   - Unselected: Gray-200 border (2px), white background
   - Selected: Orange/Amber gradient border (3px), subtle gradient overlay

2. **Fairy Tale:**
   - Icon: Sparkles or Wand2 (Lucide)
   - Color: Purple/Pink gradient border when selected
   - Title: "Fairy Tale"
   - Description: "Magical stories with princesses and castles"

3. **Educational:**
   - Icon: BookOpen or GraduationCap (Lucide)
   - Color: Blue/Cyan gradient border when selected
   - Title: "Educational"
   - Description: "Learning adventures with fun facts"

4. **Nature & Animals:**
   - Icon: Trees or Leaf (Lucide)
   - Color: Green/Emerald gradient border when selected
   - Title: "Nature & Animals"
   - Description: "Wildlife adventures in nature"

5. **Space & Science:**
   - Icon: Rocket or Star (Lucide)
   - Color: Indigo/Violet gradient border when selected
   - Title: "Space & Science"
   - Description: "Cosmic adventures and discoveries"

6. **Sports & Activities:**
   - Icon: Trophy or Activity (Lucide)
   - Color: Red/Rose gradient border when selected
   - Title: "Sports & Activities"
   - Description: "Active adventures and team spirit"

**Card Design (Theme Cards):**
- Hover: scale(1.05), shadow increase
- Tap: scale(0.98)
- Selected: Gradient border (3px), subtle gradient background overlay
- Unselected: Gray-200 border (2px), white/dark:slate-800 background
- Icon: Large (h-12 w-12), centered at top
- Padding: p-6
- Rounded corners: rounded-xl
- Stagger animation: fade-in + slide-up (delay: index * 0.1s)

**Age Group Selection Section:**
- Label: "Select Age Group" (xl font-semibold)
- Layout: 3 cards in a row (desktop), stacked vertically (mobile)
- 3 age group cards (each clickable, card-based selection):

1. **0-2 Years:**
   - Icon: Baby or Heart (Lucide, medium h-10 w-10)
   - Color: Pink/Rose gradient border when selected
   - Title: "0-2 Years" (text-base font-bold)
   - Description: "Simple words, bright colors, basic concepts" (text-sm)
   - Features: "Very short sentences, repetitive patterns" (text-xs italic, gray-500)

2. **3-5 Years:**
   - Icon: Smile or Star (Lucide)
   - Color: Yellow/Amber gradient border when selected
   - Title: "3-5 Years"
   - Description: "Simple stories, easy vocabulary"
   - Features: "5-8 word sentences, playful language"

3. **6-9 Years:**
   - Icon: GraduationCap or Rocket (Lucide)
   - Color: Blue/Cyan gradient border when selected
   - Title: "6-9 Years"
   - Description: "More complex stories, richer vocabulary"
   - Features: "8-12 word sentences, engaging plots"

**Card Design (Age Group Cards):**
- Similar to theme cards but smaller
- Hover: scale(1.05), shadow increase
- Tap: scale(0.98)
- Selected: Gradient border (3px), subtle gradient background overlay
- Unselected: Gray-200 border (2px), white/dark:slate-800 background
- Icon: Medium (h-10 w-10), centered at top
- Padding: p-6
- Stagger animation: fade-in + slide-up (delay: 0.3s + index * 0.1s)

**Validation:**
- Theme: Required, must select one
- Age Group: Required, must select one
- Error messages: Display below each section if not selected
- Error styling: Red border, red text, error icon

**Navigation:**
- "Back" button at the bottom left (desktop) or full width (mobile)
  - Outline button (border-2, border-gray-300, transparent background)
  - ArrowLeft icon (Lucide) - left side
  - Hover: Border color change (purple-500), background (purple-50)
  - Navigate to Step 2
- "Next" button at the bottom right (desktop) or full width (mobile)
  - Gradient background (purple-500 to pink-500)
  - ArrowRight icon (Lucide) - right side
  - Disabled: When theme or age group not selected
  - Navigate to Step 4

**Styling:**
- Color scheme: Purple-500 to Pink-500 gradient for buttons and accents
- Background: Gradient (purple-50 via white to pink-50, dark: slate-900)
- Form container: White/Slate-800 with shadow-2xl, rounded-2xl, backdrop-blur-sm
- Cards: White/Slate-800 with subtle shadow
- Selected cards: Gradient border (theme-specific color), subtle gradient overlay
- Text: Gray-900/Slate-50 (headings), Gray-600/Slate-400 (body)

**Animations (Framer Motion):**
- Page fade-in + slide-up (y: 30 → 0, duration: 0.5s, delay: 0.2s)
- Progress bar: width animation (0 → 50%, duration: 0.8s, ease-out)
- Theme cards: Stagger animation (delay: index * 0.1s), fade-in + slide-up
- Age group cards: Stagger animation (delay: 0.3s + index * 0.1s), fade-in + slide-up
- Card hover: scale(1.05), shadow increase
- Card tap: scale(0.98)
- Selected state: Border color transition (0.3s)
- Button hover: scale(1.02)
- Button tap: scale(0.98)
- Decorative floating elements (desktop only): Star, Heart, Sparkles, BookOpen icons with floating animation (y: [0, -15, 0], rotate: [0, 5, 0, -5, 0], infinite loop)

**Responsive:**
- Mobile: Single column, full width cards, stacked buttons, decorative elements hidden
- Tablet: 2 columns for theme cards, 3 columns for age group cards
- Desktop: 3 columns for theme cards, 3 columns for age group cards, inline buttons, decorative elements visible

**Technical:**
- Use React Hook Form with Zod validation
- State management: useState for selected theme and age group
- Validation schema: theme (enum: adventure, fairy_tale, educational, nature, space, sports), ageGroup (enum: "0-2", "3-5", "6-9")
- Error messages below each section if validation fails
- Accessibility: aria-labels, keyboard navigation, focus states

**Design Match:**
Match the design style from Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, Login Page, Register Page, Step 1, and Step 2 - modern, engaging, with purple-pink gradient accents, smooth animations, and clean layout.

Make it feel like a natural continuation of the wizard flow from Step 2.

**Important:**
- All labels, descriptions, and text must be in English (no Turkish)
- Use Lucide React icons
- Each theme should have a unique gradient color scheme
- Keep animations smooth but not overwhelming
- Stagger effects should be subtle (0.1s delay per card)
```

---

## 📝 Implementation Notes

### Dependencies
- `framer-motion` - Animations
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Zod resolver
- `zod` - Validation schema
- `lucide-react` - Icons
- `next/link` - Navigation
- `@/components/ui/button` - Button component
- `@/components/ui/card` - Card component (optional, can be custom)

### State Management
- `useState` for selected theme and age group
- `useForm` from react-hook-form for form handling
- Form state will be passed to next step (Faz 3'te context/store ile yapılacak)

### File Structure
```
app/create/step3/
  └── page.tsx
```

### Component Structure
```typescript
export default function Step3Page() {
  // State
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null)
  
  // Form handling
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(themeAgeGroupSchema)
  })
  
  // Theme options
  const themes = [
    { value: "adventure", label: "Adventure", icon: Mountain, ... },
    // ...
  ]
  
  // Age group options
  const ageGroups = [
    { value: "0-2", label: "0-2 Years", icon: Baby, ... },
    // ...
  ]
  
  return (
    <div>
      {/* Progress Indicator */}
      {/* Theme Selection */}
      {/* Age Group Selection */}
      {/* Navigation */}
    </div>
  )
}
```

---

## 🎨 Design Inspiration

- **Card-based selection:** Similar to pricing cards or feature selection
- **Gradient borders:** Modern, playful aesthetic
- **Icon-based themes:** Visual hierarchy, easy to understand
- **Stagger animations:** Smooth, professional feel
- **Hover effects:** Interactive, engaging

---

## ✅ Checklist

- [ ] Progress indicator (Step 3 of 6, 50% progress)
- [ ] Theme selection (6 cards, grid layout)
- [ ] Age group selection (3 cards, horizontal/vertical layout)
- [ ] Form validation (Zod + React Hook Form)
- [ ] Navigation buttons (Back, Next)
- [ ] Framer Motion animations (fade-in, slide-up, stagger, hover, tap)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Decorative floating elements (desktop only)
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Help text and support link
- [ ] Error messages and validation feedback
- [ ] All text in English (no Turkish)

---

## 📌 Important Notes

1. **Language:** All labels, descriptions, and text must be in English. Localization will be handled as a separate topic later.
2. **Placeholder Images:** Theme preview images are optional for MVP. Can be added later.
3. **Form State:** Selected values will be stored in component state for now. In Faz 3, this will be integrated with a global state management solution (Context API or Zustand).
4. **Navigation:** Links are currently placeholder (`/create/step2`, `/create/step4`). In Faz 3, this will be replaced with router.push and state passing.
5. **Validation:** Client-side validation only for MVP. Server-side validation will be added in Faz 3.
6. **Icons:** Use Lucide React icons. Choose appropriate icons for each theme and age group.
7. **Gradients:** Each theme should have a unique gradient color scheme for visual distinction.
8. **Animations:** Keep animations smooth but not overwhelming. Stagger effects should be subtle (0.1s delay per card).

---

**Son Güncelleme:** 4 Ocak 2026  
**Durum:** Ready for v0.app generation

