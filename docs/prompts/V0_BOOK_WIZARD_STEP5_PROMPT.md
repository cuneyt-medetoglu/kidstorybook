# v0.app Prompt: Book Creation Wizard - Step 5 (Custom Requests)

**Component Name:** `BookWizardStep5` veya `CustomRequestsForm`  
**Purpose:** Kitap oluşturma wizard'ının beşinci adımı - Özel istekler formu  
**File Path:** `app/create/step5/page.tsx` veya `components/wizard/Step5CustomRequests.tsx`

---

## 🎯 Component Gereksinimleri

### Genel Yapı
- **Multi-step wizard'ın beşinci adımı** (Step 5 of 6)
- **Progress indicator** üstte (5/6 gösterimi, 83.33% progress bar)
- **Form layout:** Centered, max-width container
- **Navigation:** "Back" butonu (Step 4'e geçiş), "Next" butonu (Step 6'e geçiş)
- **Responsive:** Mobile-first, desktop'ta centered layout
- **Language:** All labels and text in English (localization will be handled later)

### Form Alanları

#### Custom Requests (Özel İstekler)
- **Type:** Textarea (multi-line text input)
- **Label:** "Custom Requests" (bold, large heading)
- **Subtitle:** "Optional - Add any special requests for your story" (small text, gray-600)
- **Required:** ❌ No (Optional field)
- **Placeholder:** "E.g., Include dinosaurs in the story, have them play soccer in the park, add a pet dog named Max..."
- **Character limit:** Maximum 500 characters
- **Character counter:** Display remaining characters (e.g., "245 characters remaining")
- **Helper text:** "Tell us about any specific elements, characters, or scenarios you'd like to include in the story"
- **Validation:**
  - Maximum 500 characters
  - Error message: "Custom requests must not exceed 500 characters"
  - Real-time character count

### Visual Design

#### Color Palette
- **Background:** Gradient (purple-50 via white to pink-50, dark: slate-900)
- **Form container:** White/dark:slate-800 with shadow-2xl, rounded-2xl, backdrop-blur-sm
- **Textarea:** White/dark:slate-800 with border (gray-300/dark:slate-600)
- **Focus state:** Purple-500 ring
- **Buttons:** Gradient (purple-500 to pink-500, dark: purple-400 to pink-400)
- **Text:** Gray-900/dark:slate-50 (headings), Gray-600/dark:slate-400 (body)

#### Typography
- **Heading:** text-3xl font-bold (main title)
- **Subtitle:** text-sm text-gray-600/dark:slate-400
- **Label:** text-base font-semibold
- **Textarea:** text-base
- **Helper text:** text-sm
- **Character counter:** text-xs

#### Spacing
- **Container:** max-w-2xl, mx-auto, px-4, py-8 md:py-12
- **Form card:** rounded-2xl, p-6 md:p-8, shadow-2xl, backdrop-blur-sm
- **Textarea:** min-h-[200px] md:min-h-[250px], p-4
- **Section spacing:** mb-6 (between sections)

### Animations (Framer Motion)

#### Page Entry
- **Container:** fade-in + slide-up (y: 30 → 0, duration: 0.5s, delay: 0.2s)

#### Progress Indicator
- **Progress bar:** width animation (0 → 83.33%, duration: 0.8s, ease-out)
- **Text:** fade-in (duration: 0.5s)

#### Form Elements
- **Header:** fade-in (duration: 0.4s, delay: 0.3s)
- **Textarea container:** fade-in + slide-up (y: 20 → 0, duration: 0.4s, delay: 0.4s)
- **Character counter:** fade-in (duration: 0.3s, delay: 0.5s)
- **Helper text:** fade-in (duration: 0.3s, delay: 0.5s)
- **Navigation buttons:** fade-in (duration: 0.4s, delay: 0.6s)

#### Navigation Buttons
- **Buttons:**
  - Hover: scale(1.02)
  - Tap: scale(0.98)
  - Disabled: opacity-50, cursor-not-allowed

#### Decorative Elements
- **Floating icons:** (desktop only, hidden on mobile)
  - Lightbulb, Sparkles, BookOpen, PenTool icons
  - Floating animation (y: [0, -15, 0], rotate: [0, 5, 0, -5, 0])
  - Infinite loop, duration: 3-4s per icon
  - Opacity: 0.4
  - Positioned absolutely around the form

### Responsive Design

#### Mobile (< 768px)
- **Layout:** Single column, full width
- **Textarea:** Full width, min-height 200px
- **Spacing:** Reduced padding (p-4)
- **Decorative elements:** Hidden
- **Navigation:** Full width buttons, stacked

#### Tablet (768px - 1024px)
- **Layout:** Centered, max-width 2xl
- **Textarea:** Full width, min-height 250px
- **Spacing:** Medium padding (p-6)
- **Decorative elements:** Visible but smaller

#### Desktop (> 1024px)
- **Layout:** Centered, max-width 2xl
- **Textarea:** Full width, min-height 250px
- **Spacing:** Full padding (p-8)
- **Decorative elements:** Fully visible
- **Navigation:** Inline buttons (flex-row, justify-between)

### Form Validation

#### Client-Side (React Hook Form + Zod)
- **Custom Requests:** Optional, maximum 500 characters
- **Error messages:** Display below textarea if validation fails
- **Error styling:** Red border, red text, error icon

#### Validation Schema (Zod)
```typescript
const customRequestsSchema = z.object({
  customRequests: z.string().max(500, {
    message: "Custom requests must not exceed 500 characters"
  }).optional()
})
```

### Navigation

#### Back Button
- **Text:** "Back"
- **Icon:** ArrowLeft (Lucide)
- **Link:** `/create/step4`
- **Style:** Outline button (border-2, border-gray-300)
- **Hover:** Border color change (purple-500), background (purple-50)
- **Animation:** Hover scale(1.02), tap scale(0.98)

#### Next Button
- **Text:** "Next"
- **Icon:** ArrowRight (Lucide)
- **Link:** `/create/step6`
- **Style:** Gradient button (purple-500 to pink-500)
- **Always enabled:** This is an optional field, so Next button is always enabled
- **Animation:** Hover scale(1.02), tap scale(0.98)

### Accessibility

- **ARIA labels:** All interactive elements
- **Keyboard navigation:** Tab order, Enter for new line in textarea
- **Focus states:** Visible focus rings
- **Screen reader:** Descriptive labels for textarea
- **Character counter:** Announced to screen readers when character limit is reached
- **Color contrast:** WCAG AA compliant

### Dark Mode Support

- **Background:** slate-900 (dark mode)
- **Form container:** slate-800 (dark mode)
- **Textarea:** slate-800 (dark mode)
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
Create a multi-step wizard form component for Step 5: Custom Requests.

This is the fifth step (5 of 6) in a book creation wizard for a children's book platform called KidStoryBook.

**Layout:**
- Progress indicator at the top showing "Step 5 of 6" with a progress bar (5/6 filled, 83.33%, purple-pink gradient)
- Centered form container (max-width 2xl) with white background and shadow
- Form title: "Custom Requests" (3xl font-bold)
- Subtitle: "Optional - Add any special requests for your story" (text-sm, gray-600)

**Custom Requests Section:**
- Label: "Custom Requests" (text-base font-semibold)
- Textarea:
  - Multi-line text input
  - Placeholder: "E.g., Include dinosaurs in the story, have them play soccer in the park, add a pet dog named Max..."
  - Minimum height: 200px (mobile), 250px (desktop)
  - Maximum characters: 500
  - Character counter: Display remaining characters (e.g., "245 characters remaining") - bottom right of textarea
  - Helper text: "Tell us about any specific elements, characters, or scenarios you'd like to include in the story" (below textarea, text-sm)
  - Styling:
    - Border: gray-300 (light), slate-600 (dark)
    - Focus: purple-500 ring
    - Background: white (light), slate-800 (dark)
    - Padding: p-4
    - Rounded corners: rounded-lg
    - Resize: vertical (user can resize)
- Validation:
  - Maximum 500 characters
  - Error message: "Custom requests must not exceed 500 characters" (display below textarea)
  - Real-time character count
  - Optional field (no minimum required)

**Navigation:**
- "Back" button at the bottom left (desktop) or full width (mobile)
  - Outline button (border-2, border-gray-300, transparent background)
  - ArrowLeft icon (Lucide) - left side
  - Hover: Border color change (purple-500), background (purple-50)
  - Navigate to Step 4
- "Next" button at the bottom right (desktop) or full width (mobile)
  - Gradient background (purple-500 to pink-500)
  - ArrowRight icon (Lucide) - right side
  - Always enabled (this is an optional field)
  - Navigate to Step 6

**Styling:**
- Color scheme: Purple-500 to Pink-500 gradient for buttons and accents
- Background: Gradient (purple-50 via white to pink-50, dark: slate-900)
- Form container: White/Slate-800 with shadow-2xl, rounded-2xl, backdrop-blur-sm
- Textarea: White/Slate-800 with border (gray-300/slate-600), focus ring (purple-500)
- Text: Gray-900/Slate-50 (headings), Gray-600/Slate-400 (body)
- Character counter: Gray-500/Slate-500 (text-xs)

**Animations (Framer Motion):**
- Page fade-in + slide-up (y: 30 → 0, duration: 0.5s, delay: 0.2s)
- Progress bar: width animation (0 → 83.33%, duration: 0.8s, ease-out)
- Header: fade-in (duration: 0.4s, delay: 0.3s)
- Textarea container: fade-in + slide-up (y: 20 → 0, duration: 0.4s, delay: 0.4s)
- Character counter: fade-in (duration: 0.3s, delay: 0.5s)
- Helper text: fade-in (duration: 0.3s, delay: 0.5s)
- Navigation buttons: fade-in (duration: 0.4s, delay: 0.6s)
- Button hover: scale(1.02)
- Button tap: scale(0.98)
- Decorative floating elements (desktop only): Lightbulb, Sparkles, BookOpen, PenTool icons with floating animation

**Responsive:**
- Mobile: Single column, full width, stacked buttons, decorative elements hidden
- Tablet: Centered container, medium padding, decorative elements visible but smaller
- Desktop: Centered container, inline buttons, decorative elements fully visible

**Technical:**
- Use React Hook Form with Zod validation
- State management: useForm for form handling
- Validation schema: customRequests (optional, max 500 characters)
- Character counter: Real-time calculation (500 - current length)
- Error messages below textarea if validation fails
- Accessibility: aria-labels, keyboard navigation, focus states, character counter announced to screen readers

**Design Match:**
Match the design style from Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, Login Page, Register Page, Step 1, Step 2, Step 3, and Step 4 - modern, engaging, with purple-pink gradient accents, smooth animations, and clean layout.

Make it feel like a natural continuation of the wizard flow from Step 4.

**Important:**
- All labels, descriptions, and text must be in English (no Turkish)
- Use Lucide React icons
- This is an optional field - Next button should always be enabled
- Character counter should update in real-time as user types
- Textarea should be resizable (vertical resize only)
- Helper text and examples should guide users on what to write
- Keep animations smooth but not overwhelming
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
- `@/components/ui/textarea` - Textarea component (if available, otherwise use native textarea)

### State Management
- `useForm` from react-hook-form for form handling
- Character count: Real-time calculation (500 - current length)
- Form state will be passed to next step (Faz 3'te context/store ile yapılacak)

### File Structure
```
app/create/step5/
  └── page.tsx
```

### Textarea Component
- If shadcn/ui textarea component is available, use it
- Otherwise, use native HTML textarea with Tailwind styling
- Ensure proper focus states and accessibility

### Component Structure
```typescript
export default function Step5Page() {
  // Form handling
  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(customRequestsSchema)
  })
  
  const customRequests = watch("customRequests")
  const characterCount = customRequests?.length || 0
  const remainingChars = 500 - characterCount
  
  return (
    <div>
      {/* Progress Indicator */}
      {/* Custom Requests Textarea */}
      {/* Character Counter */}
      {/* Helper Text */}
      {/* Navigation */}
    </div>
  )
}
```

---

## 🎨 Design Inspiration

- **Simple form:** Clean, focused design with single textarea
- **Character counter:** Helpful feedback for users
- **Helper text:** Guides users on what to write
- **Optional field:** Clear indication that this is optional
- **Smooth animations:** Subtle, professional feel

---

## ✅ Checklist

- [ ] Progress indicator (Step 5 of 6, 83.33% progress)
- [ ] Custom requests textarea (optional, max 500 characters)
- [ ] Character counter (real-time, remaining characters)
- [ ] Helper text (guidance on what to write)
- [ ] Form validation (Zod + React Hook Form)
- [ ] Navigation buttons (Back, Next - always enabled)
- [ ] Framer Motion animations (fade-in, slide-up)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Decorative floating elements (desktop only)
- [ ] Accessibility (ARIA labels, keyboard navigation, character counter announced)
- [ ] Help text and support link
- [ ] Error messages and validation feedback
- [ ] All text in English (no Turkish)

---

## 📌 Important Notes

1. **Language:** All labels, descriptions, and text must be in English. Localization will be handled as a separate topic later.
2. **Optional Field:** This is an optional field - users can skip it. Next button should always be enabled.
3. **Character Limit:** Maximum 500 characters. Character counter should update in real-time.
4. **Form State:** Value will be stored in component state for now. In Faz 3, this will be integrated with a global state management solution (Context API or Zustand).
5. **Navigation:** Links are currently placeholder (`/create/step4`, `/create/step6`). In Faz 3, this will be replaced with router.push and state passing.
6. **Validation:** Client-side validation only for MVP. Server-side validation will be added in Faz 3.
7. **Icons:** Use Lucide React icons (Lightbulb, Sparkles, BookOpen, PenTool for decorative elements).
8. **Textarea:** Should be resizable (vertical resize only) for better UX.
9. **Helper Text:** Should provide clear examples of what users can write.
10. **Character Counter:** Should be visually clear and update in real-time. Consider showing warning when approaching limit (e.g., < 50 characters remaining).

---

**Son Güncelleme:** 4 Ocak 2026  
**Durum:** Ready for v0.app generation

