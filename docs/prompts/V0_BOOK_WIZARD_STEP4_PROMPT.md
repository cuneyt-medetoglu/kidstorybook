# v0.app Prompt: Book Creation Wizard - Step 4 (Illustration Style Selection)

**Component Name:** `BookWizardStep4` veya `IllustrationStyleSelection`  
**Purpose:** Kitap oluşturma wizard'ının dördüncü adımı - Illustration style seçimi  
**File Path:** `app/create/step4/page.tsx` veya `components/wizard/Step4IllustrationStyle.tsx`

---

## 🎯 Component Gereksinimleri

### Genel Yapı
- **Multi-step wizard'ın dördüncü adımı** (Step 4 of 6)
- **Progress indicator** üstte (4/6 gösterimi, 66.67% progress bar)
- **Form layout:** Centered, max-width container
- **Navigation:** "Back" butonu (Step 3'e geçiş), "Next" butonu (Step 5'e geçiş)
- **Responsive:** Mobile-first, desktop'ta grid layout
- **Language:** All labels and text in English (localization will be handled later)

### Form Alanları

#### Illustration Style Seçimi
- **Type:** Card-based selection with preview images (grid layout)
- **Label:** "Choose Illustration Style" (bold, large heading)
- **Required:** ✅ Yes
- **Layout:** 
  - Desktop: 3 columns grid (4 rows)
  - Tablet: 2 columns grid (6 rows)
  - Mobile: 2 columns grid (6 rows) - compact view
- **Options:** (Her biri bir card olacak, preview image ile)

1. **3D Animation**
   - Preview: Placeholder image (can be added later)
   - Description: "Pixar/DreamWorks-style 3D animation, cartoonish and stylized, vibrant saturated colors"
   - Icon: Box, Cube, veya Shapes (Lucide) - optional, as overlay on image
   - Color: Orange/Amber gradient

2. **Geometric**
   - Preview: Placeholder image
   - Description: "Simplified geometric shapes, flat colors, sharp distinct edges, modern and stylized"
   - Icon: Hexagon, Square, veya Triangle (Lucide)
   - Color: Blue/Cyan gradient

3. **Watercolor**
   - Preview: Placeholder image
   - Description: "Soft, translucent appearance, visible brushstrokes, blended edges, muted flowing colors"
   - Icon: Palette, Paintbrush, veya Droplet (Lucide)
   - Color: Purple/Pink gradient

4. **Gouache**
   - Preview: Placeholder image
   - Description: "Opaque, vibrant colors, matte finish, distinct visible brushstrokes, rich saturated colors"
   - Icon: Paintbrush, Palette, veya Brush (Lucide)
   - Color: Red/Rose gradient

5. **Picture-Book**
   - Preview: Placeholder image
   - Description: "Warm, slightly textured, inviting children's picture book illustration, soft glow, stylized but clear details"
   - Icon: BookOpen, Book, veya BookMarked (Lucide)
   - Color: Yellow/Amber gradient

6. **Block World**
   - Preview: Placeholder image
   - Description: "Pixelated or blocky aesthetic, Minecraft-like, characters and environment constructed from visible blocks"
   - Icon: Box, Grid, veya Blocks (Lucide)
   - Color: Green/Emerald gradient

7. **Soft Anime**
   - Preview: Placeholder image
   - Description: "Large expressive eyes, delicate features, soft shading, pastel colors, anime-style illustration"
   - Icon: Sparkles, Star, veya Heart (Lucide)
   - Color: Pink/Rose gradient

8. **Collage**
   - Preview: Placeholder image
   - Description: "Made from cut-out pieces, distinct layers and varied textures, visible edges or shadows, vibrant colors"
   - Icon: Layers, Scissors, veya Copy (Lucide)
   - Color: Indigo/Violet gradient

9. **Clay Animation**
   - Preview: Placeholder image
   - Description: "Clay appearance, textured, slightly rough, hand-crafted look, soft rounded shadows"
   - Icon: Circle, Dot, veya CircleDot (Lucide)
   - Color: Brown/Amber gradient

10. **Kawaii**
    - Preview: Placeholder image
    - Description: "Exaggerated cuteness, large sparkling eyes, simplified round features, bright cheerful colors"
    - Icon: Heart, Smile, veya Sparkles (Lucide)
    - Color: Pink/Rose gradient

11. **Comic Book**
    - Preview: Placeholder image
    - Description: "Bold lines, relatively flat colors, strong dramatic shadows, comic book style illustration"
    - Icon: Zap, Flash, veya Activity (Lucide)
    - Color: Red/Orange gradient

12. **Sticker Art**
    - Preview: Placeholder image
    - Description: "Clean lines, bright high-saturation colors, glossy graphic look, sticker-like illustration"
    - Icon: StickyNote, Tag, veya Label (Lucide)
    - Color: Cyan/Blue gradient

- **Card Design:**
  - Preview image: Top section (aspect ratio 16:9 or 4:3), rounded-t-xl
  - Image overlay: Optional icon badge (top-right corner, small, semi-transparent background)
  - Content section: Below image (padding p-4)
  - Title: Bold, text-base
  - Description: Small text (text-sm), gray-600/dark:slate-400, 2-3 lines max (truncate with ellipsis if needed)
  - Hover effect: Scale (1.05), shadow increase, image brightness increase
  - Selected state: Border (gradient, 3px), background (subtle gradient overlay on image), checkmark badge (top-left corner)
  - Unselected state: Border (gray-200, 2px), background (white/dark:slate-800)
  - Animation: Fade-in + slide-up (stagger effect per card)

- **Validation:**
  - At least one style must be selected
  - Error message: "Please select an illustration style"

### Visual Design

#### Color Palette
- **Background:** Gradient (purple-50 via white to pink-50, dark: slate-900)
- **Cards:** White/dark:slate-800 with subtle shadow
- **Selected cards:** Gradient border (style-specific color), checkmark badge
- **Preview images:** Rounded corners, aspect ratio maintained
- **Buttons:** Gradient (purple-500 to pink-500, dark: purple-400 to pink-400)
- **Text:** Gray-900/dark:slate-50 (headings), Gray-600/dark:slate-400 (body)

#### Typography
- **Heading:** text-3xl font-bold (main title)
- **Section labels:** text-xl font-semibold
- **Card titles:** text-base font-bold
- **Descriptions:** text-sm (2-3 lines, line-clamp-3)
- **Helper text:** text-xs

#### Spacing
- **Container:** max-w-6xl, mx-auto, px-4, py-8 md:py-12
- **Form card:** rounded-2xl, p-6 md:p-8, shadow-2xl, backdrop-blur-sm
- **Card grid gap:** gap-4 md:gap-6
- **Card padding:** p-0 (image + content section)

### Animations (Framer Motion)

#### Page Entry
- **Container:** fade-in + slide-up (y: 30 → 0, duration: 0.5s, delay: 0.2s)

#### Progress Indicator
- **Progress bar:** width animation (0 → 66.67%, duration: 0.8s, ease-out)
- **Text:** fade-in (duration: 0.5s)

#### Style Cards
- **Container:** fade-in (duration: 0.4s)
- **Individual cards:** 
  - Stagger animation (delay: index * 0.05s) - faster than theme cards due to more items
  - Fade-in + slide-up (y: 20 → 0, duration: 0.4s)
  - Hover: scale(1.05), shadow increase, image brightness increase (filter: brightness(1.1))
  - Tap: scale(0.98)
  - Selected: border animation (color transition, 0.3s), checkmark badge scale animation
  - Image hover: Slight scale (1.02) on image only

#### Navigation Buttons
- **Container:** fade-in (duration: 0.4s, delay: 0.5s)
- **Buttons:**
  - Hover: scale(1.02)
  - Tap: scale(0.98)
  - Disabled: opacity-50, cursor-not-allowed

#### Decorative Elements
- **Floating icons:** (desktop only, hidden on mobile)
  - Palette, Brush, Sparkles, BookOpen icons
  - Floating animation (y: [0, -15, 0], rotate: [0, 5, 0, -5, 0])
  - Infinite loop, duration: 3-4s per icon
  - Opacity: 0.4
  - Positioned absolutely around the form

### Responsive Design

#### Mobile (< 768px)
- **Layout:** 2 columns grid (compact view)
- **Cards:** Full width within grid
- **Preview images:** Smaller (aspect ratio maintained)
- **Spacing:** Reduced padding (p-4)
- **Decorative elements:** Hidden
- **Navigation:** Full width buttons, stacked

#### Tablet (768px - 1024px)
- **Layout:** 2 columns grid
- **Cards:** Responsive width
- **Preview images:** Medium size
- **Spacing:** Medium padding (p-6)
- **Decorative elements:** Visible but smaller

#### Desktop (> 1024px)
- **Layout:** 3 columns grid
- **Cards:** Optimal width
- **Preview images:** Larger, better visibility
- **Spacing:** Full padding (p-8)
- **Decorative elements:** Fully visible
- **Navigation:** Inline buttons (flex-row, justify-between)

### Form Validation

#### Client-Side (React Hook Form + Zod)
- **Illustration Style:** Required, must be one of the 12 options
- **Error messages:** Display below section if validation fails
- **Error styling:** Red border, red text, error icon

#### Validation Schema (Zod)
```typescript
const illustrationStyleSchema = z.object({
  illustrationStyle: z.enum([
    "3d",
    "geometric",
    "watercolor",
    "gouache",
    "picture-book",
    "block-world",
    "soft-anime",
    "collage",
    "clay-animation",
    "kawaii",
    "comic-book",
    "sticker-art"
  ], {
    required_error: "Please select an illustration style"
  })
})
```

### Navigation

#### Back Button
- **Text:** "Back"
- **Icon:** ArrowLeft (Lucide)
- **Link:** `/create/step3`
- **Style:** Outline button (border-2, border-gray-300)
- **Hover:** Border color change (purple-500), background (purple-50)
- **Animation:** Hover scale(1.02), tap scale(0.98)

#### Next Button
- **Text:** "Next"
- **Icon:** ArrowRight (Lucide)
- **Link:** `/create/step5`
- **Style:** Gradient button (purple-500 to pink-500)
- **Disabled:** When illustration style not selected
- **Animation:** Hover scale(1.02), tap scale(0.98)

### Accessibility

- **ARIA labels:** All interactive elements
- **Keyboard navigation:** Tab order, Enter to select
- **Focus states:** Visible focus rings
- **Screen reader:** Descriptive labels for all cards (title + description)
- **Color contrast:** WCAG AA compliant
- **Image alt text:** Descriptive alt text for preview images

### Dark Mode Support

- **Background:** slate-900 (dark mode)
- **Cards:** slate-800 (dark mode)
- **Text:** slate-50 (headings), slate-400 (body) (dark mode)
- **Borders:** slate-700 (dark mode)
- **Gradients:** Adjusted opacity for dark mode
- **Shadows:** Enhanced in dark mode
- **Images:** Slightly dimmed in dark mode (opacity-90)

### Help Text

- **Location:** Below form, centered
- **Text:** "Need help? Contact Support" (link to /help)
- **Style:** Small text, gray-600, link (purple-600, underline)

---

## 🎯 v0.app Prompt (Copy-Paste Ready)

```
Create a multi-step wizard form component for Step 4: Illustration Style Selection.

This is the fourth step (4 of 6) in a book creation wizard for a children's book platform called KidStoryBook.

**Layout:**
- Progress indicator at the top showing "Step 4 of 6" with a progress bar (4/6 filled, 66.67%, purple-pink gradient)
- Centered form container (max-width 6xl) with white background and shadow
- Form title: "Choose Illustration Style" (3xl font-bold)

**Illustration Style Selection Section:**
- Label: "Choose Illustration Style" (xl font-semibold)
- Grid layout: 3 columns desktop, 2 columns tablet, 2 columns mobile (compact)
- 12 illustration style cards (each clickable, card-based selection with preview images):

1. **3D Animation:**
   - Preview image: Placeholder (aspect ratio 16:9 or 4:3, rounded-t-xl)
   - Title: "3D Animation" (text-base font-bold)
   - Description: "Pixar/DreamWorks-style 3D animation, cartoonish and stylized, vibrant saturated colors" (text-sm, 2-3 lines)
   - Optional icon badge: Box or Cube (top-right corner, small, semi-transparent)
   - Color: Orange/Amber gradient border when selected

2. **Geometric:**
   - Preview image: Placeholder
   - Title: "Geometric"
   - Description: "Simplified geometric shapes, flat colors, sharp distinct edges, modern and stylized"
   - Icon: Hexagon or Square
   - Color: Blue/Cyan gradient

3. **Watercolor:**
   - Preview image: Placeholder
   - Title: "Watercolor"
   - Description: "Soft, translucent appearance, visible brushstrokes, blended edges, muted flowing colors"
   - Icon: Palette or Paintbrush
   - Color: Purple/Pink gradient

4. **Gouache:**
   - Preview image: Placeholder
   - Title: "Gouache"
   - Description: "Opaque, vibrant colors, matte finish, distinct visible brushstrokes, rich saturated colors"
   - Icon: Paintbrush or Brush
   - Color: Red/Rose gradient

5. **Picture-Book:**
   - Preview image: Placeholder
   - Title: "Picture-Book"
   - Description: "Warm, slightly textured, inviting children's picture book illustration, soft glow, stylized but clear details"
   - Icon: BookOpen or Book
   - Color: Yellow/Amber gradient

6. **Block World:**
   - Preview image: Placeholder
   - Title: "Block World"
   - Description: "Pixelated or blocky aesthetic, Minecraft-like, characters and environment constructed from visible blocks"
   - Icon: Box or Grid
   - Color: Green/Emerald gradient

7. **Soft Anime:**
   - Preview image: Placeholder
   - Title: "Soft Anime"
   - Description: "Large expressive eyes, delicate features, soft shading, pastel colors, anime-style illustration"
   - Icon: Sparkles or Star
   - Color: Pink/Rose gradient

8. **Collage:**
   - Preview image: Placeholder
   - Title: "Collage"
   - Description: "Made from cut-out pieces, distinct layers and varied textures, visible edges or shadows, vibrant colors"
   - Icon: Layers or Scissors
   - Color: Indigo/Violet gradient

9. **Clay Animation:**
   - Preview image: Placeholder
   - Title: "Clay Animation"
   - Description: "Clay appearance, textured, slightly rough, hand-crafted look, soft rounded shadows"
   - Icon: Circle or Dot
   - Color: Brown/Amber gradient

10. **Kawaii:**
    - Preview image: Placeholder
    - Title: "Kawaii"
    - Description: "Exaggerated cuteness, large sparkling eyes, simplified round features, bright cheerful colors"
    - Icon: Heart or Smile
    - Color: Pink/Rose gradient

11. **Comic Book:**
    - Preview image: Placeholder
    - Title: "Comic Book"
    - Description: "Bold lines, relatively flat colors, strong dramatic shadows, comic book style illustration"
    - Icon: Zap or Flash
    - Color: Red/Orange gradient

12. **Sticker Art:**
    - Preview image: Placeholder
    - Title: "Sticker Art"
    - Description: "Clean lines, bright high-saturation colors, glossy graphic look, sticker-like illustration"
    - Icon: StickyNote or Tag
    - Color: Cyan/Blue gradient

**Card Design:**
- Preview image: Top section (aspect ratio 16:9 or 4:3), rounded-t-xl, object-cover
- Image overlay: Optional icon badge (top-right corner, small circle, semi-transparent white background, icon inside)
- Content section: Below image (padding p-4)
- Title: Bold, text-base
- Description: Small text (text-sm), gray-600/dark:slate-400, 2-3 lines max (line-clamp-3)
- Hover: scale(1.05), shadow increase, image brightness increase (brightness-110)
- Selected state: Gradient border (3px, style-specific color), checkmark badge (top-left corner, white circle with check icon)
- Unselected state: Border (gray-200, 2px), background (white/dark:slate-800)
- Animation: Fade-in + slide-up (stagger effect, delay: index * 0.05s)

**Validation:**
- Illustration style: Required, must select one
- Error message: "Please select an illustration style" (display below section)

**Navigation:**
- "Back" button at the bottom left (desktop) or full width (mobile)
  - Outline button (border-2, border-gray-300, transparent background)
  - ArrowLeft icon (Lucide) - left side
  - Hover: Border color change (purple-500), background (purple-50)
  - Navigate to Step 3
- "Next" button at the bottom right (desktop) or full width (mobile)
  - Gradient background (purple-500 to pink-500)
  - ArrowRight icon (Lucide) - right side
  - Disabled: When illustration style not selected
  - Navigate to Step 5

**Styling:**
- Color scheme: Purple-500 to Pink-500 gradient for buttons and accents
- Background: Gradient (purple-50 via white to pink-50, dark: slate-900)
- Form container: White/Slate-800 with shadow-2xl, rounded-2xl, backdrop-blur-sm
- Cards: White/Slate-800 with subtle shadow
- Selected cards: Gradient border (style-specific color), checkmark badge
- Preview images: Rounded corners, aspect ratio maintained, object-cover
- Text: Gray-900/Slate-50 (headings), Gray-600/Slate-400 (body)

**Animations (Framer Motion):**
- Page fade-in + slide-up (y: 30 → 0, duration: 0.5s, delay: 0.2s)
- Progress bar: width animation (0 → 66.67%, duration: 0.8s, ease-out)
- Style cards: Stagger animation (delay: index * 0.05s), fade-in + slide-up
- Card hover: scale(1.05), shadow increase, image brightness increase
- Card tap: scale(0.98)
- Selected state: Border color transition (0.3s), checkmark badge scale animation
- Button hover: scale(1.02)
- Button tap: scale(0.98)
- Decorative floating elements (desktop only): Palette, Brush, Sparkles, BookOpen icons with floating animation

**Responsive:**
- Mobile: 2 columns grid (compact view), full width buttons, stacked, decorative elements hidden
- Tablet: 2 columns grid, medium padding, decorative elements visible but smaller
- Desktop: 3 columns grid, inline buttons, decorative elements fully visible

**Technical:**
- Use React Hook Form with Zod validation
- State management: useState for selected style, useForm for form handling
- Validation schema: illustrationStyle (enum: 12 options)
- Error messages below section if validation fails
- Accessibility: aria-labels, keyboard navigation, focus states, image alt text

**Design Match:**
Match the design style from Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, Pricing Section, Campaign Banners, FAQ Section, Cookie Banner, Login Page, Register Page, Step 1, Step 2, and Step 3 - modern, engaging, with purple-pink gradient accents, smooth animations, and clean layout.

Make it feel like a natural continuation of the wizard flow from Step 3.

**Important:**
- All labels, descriptions, and text must be in English (no Turkish)
- Use Lucide React icons
- Preview images are placeholders for MVP (can be replaced with real images later)
- Each style should have a unique gradient color scheme for visual distinction
- Keep animations smooth but not overwhelming
- Stagger effects should be subtle (0.05s delay per card due to 12 items)
- Image aspect ratio must be maintained (16:9 or 4:3)
- Description text should be truncated to 2-3 lines (line-clamp-3)
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
- `next/image` - Image optimization (for preview images)
- `@/components/ui/button` - Button component

### State Management
- `useState` for selected illustration style
- `useForm` from react-hook-form for form handling
- Form state will be passed to next step (Faz 3'te context/store ile yapılacak)

### File Structure
```
app/create/step4/
  └── page.tsx
```

### Preview Images
- For MVP: Placeholder images (can use `next/image` with placeholder="blur" or a placeholder service)
- Future: Real preview images for each style (can be added in Faz 3 or later)
- Image optimization: Use `next/image` component for better performance

### Component Structure
```typescript
export default function Step4Page() {
  // State
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null)
  
  // Form handling
  const { setValue, formState: { errors }, watch } = useForm({
    resolver: zodResolver(illustrationStyleSchema)
  })
  
  // Illustration style options
  const styles = [
    { value: "3d", label: "3D Animation", description: "...", icon: Box, gradient: "from-orange-500 to-amber-500", previewImage: "/placeholder-3d.jpg" },
    // ... 11 more styles
  ]
  
  return (
    <div>
      {/* Progress Indicator */}
      {/* Illustration Style Selection */}
      {/* Navigation */}
    </div>
  )
}
```

---

## 🎨 Design Inspiration

- **Card-based selection with images:** Similar to theme/style selectors in design tools
- **Preview images:** Visual representation of each style
- **Gradient borders:** Modern, playful aesthetic
- **Stagger animations:** Smooth, professional feel
- **Hover effects:** Interactive, engaging

---

## ✅ Checklist

- [ ] Progress indicator (Step 4 of 6, 66.67% progress)
- [ ] Illustration style selection (12 cards, grid layout with preview images)
- [ ] Preview images (placeholder for MVP)
- [ ] Form validation (Zod + React Hook Form)
- [ ] Navigation buttons (Back, Next)
- [ ] Framer Motion animations (fade-in, slide-up, stagger, hover, tap)
- [ ] Responsive design (mobile: 2 columns, tablet: 2 columns, desktop: 3 columns)
- [ ] Dark mode support
- [ ] Decorative floating elements (desktop only)
- [ ] Accessibility (ARIA labels, keyboard navigation, image alt text)
- [ ] Help text and support link
- [ ] Error messages and validation feedback
- [ ] All text in English (no Turkish)

---

## 📌 Important Notes

1. **Language:** All labels, descriptions, and text must be in English. Localization will be handled as a separate topic later.
2. **Preview Images:** Placeholder images are used for MVP. Real preview images can be added in Faz 3 or later.
3. **Form State:** Selected value will be stored in component state for now. In Faz 3, this will be integrated with a global state management solution (Context API or Zustand).
4. **Navigation:** Links are currently placeholder (`/create/step3`, `/create/step5`). In Faz 3, this will be replaced with router.push and state passing.
5. **Validation:** Client-side validation only for MVP. Server-side validation will be added in Faz 3.
6. **Icons:** Use Lucide React icons. Choose appropriate icons for each style (optional, as overlay on preview image).
7. **Gradients:** Each style should have a unique gradient color scheme for visual distinction.
8. **Animations:** Keep animations smooth but not overwhelming. Stagger effects should be faster (0.05s delay per card) due to 12 items.
9. **Image Optimization:** Use `next/image` component for preview images to ensure optimal performance.
10. **Description Truncation:** Descriptions should be limited to 2-3 lines using `line-clamp-3` to maintain consistent card heights.

---

**Son Güncelleme:** 4 Ocak 2026  
**Durum:** Ready for v0.app generation

