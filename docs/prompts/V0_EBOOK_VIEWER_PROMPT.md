# v0.app Prompt: E-book Viewer Component

**Component Name:** `EbookViewer` veya `BookReader`  
**Purpose:** KidStoryBook için e-book görüntüleme ve okuma component'i  
**File Path:** `app/books/[id]/view/page.tsx` veya `components/ebook/EbookViewer.tsx`  
**Faz:** 2.5.1 - Temel Görüntüleme ve Navigasyon  
**Durum:** ⭐ KRİTİK - En önemli bölüm

---

## 🎯 Component Gereksinimleri

### Genel Yapı
- **Full-page component:** Tüm ekranı kaplayan viewer
- **Responsive:** Desktop, tablet, mobile uyumlu
- **Orientation aware:** Portrait ve landscape mode desteği
- **Performance:** 60fps animasyonlar, hızlı sayfa geçişleri
- **Accessibility:** WCAG 2.1 AA uyumlu

### Layout Modes

#### Portrait Mode (Dikey - Varsayılan)
- **Layout:** Tek sayfa gösterimi
- **Structure:**
  ```
  ┌─────────────────────┐
  │      Header         │ ← Progress, fullscreen, settings
  ├─────────────────────┤
  │                     │
  │    Page Content     │ ← Tek sayfa (image + text)
  │                     │
  ├─────────────────────┤
  │     Controls        │ ← Prev, Play, Next, TTS
  └─────────────────────┘
  ```

#### Landscape Mode (Yatay)
- **Layout:** Çift sayfa gösterimi
- **Structure:**
  ```
  ┌─────────────────────────────────────┐
  │              Header                 │
  ├──────────────────┬──────────────────┤
  │                  │                  │
  │   Left Page      │   Right Page     │
  │    [Image]       │     [Text]       │
  │                  │                  │
  ├──────────────────┴──────────────────┤
  │            Controls                 │
  └─────────────────────────────────────┘
  ```
- **Önemli:** Bir taraf görsel, bir taraf yazı olmalı
- **Auto-detect:** Ekran yatay çevrildiğinde otomatik layout değişmeli

### Header Section
- **Progress Indicator:**
  - Text: "Page 3 of 10" (current/total)
  - Progress bar: Gradient (purple-500 to pink-500)
  - Percentage: "30%"
- **Fullscreen Button:**
  - Icon: Maximize/Minimize (Lucide)
  - Toggle fullscreen mode
- **Settings Button:**
  - Icon: Settings (Lucide)
  - Dropdown menu:
    - Voice selection (TTS)
    - Speed control
    - Animation style
    - Theme (light/dark)
- **Close/Back Button:**
  - Icon: X veya ArrowLeft (Lucide)
  - Navigate back to library

### Page Content Area
- **Image Display:**
  - High-quality image rendering
  - Aspect ratio preserved
  - Lazy loading for performance
  - Zoom support (pinch on mobile, mouse wheel on desktop)
- **Text Display:**
  - Readable font (Inter veya çocuk dostu font)
  - Font size: 16px-24px (user adjustable)
  - Line height: 1.6-1.8
  - Text alignment: Left (LTR) veya Center (story style)
- **Page Number:**
  - Bottom corner: "3" (subtle, small)
- **Loading State:**
  - Skeleton screen while loading
  - Blur placeholder for images

### Controls (Bottom Bar)
- **Previous Button:**
  - Icon: ArrowLeft (Lucide)
  - Disabled on first page
  - Tooltip: "Previous page"
- **Play/Pause Button:**
  - Icon: Play/Pause (Lucide)
  - Toggle TTS playback
  - Visual state: Playing/Stopped
  - Tooltip: "Play audio" / "Pause audio"
- **Next Button:**
  - Icon: ArrowRight (Lucide)
  - Disabled on last page
  - Tooltip: "Next page"
- **Page Thumbnails Button:**
  - Icon: Grid (Lucide)
  - Opens thumbnail grid modal
  - Tooltip: "View all pages"
- **Bookmark Button:**
  - Icon: Bookmark (Lucide)
  - Toggle bookmark on current page
  - Visual state: Bookmarked/Not bookmarked
  - Tooltip: "Bookmark this page"
- **Share Button:**
  - Icon: Share2 (Lucide)
  - Opens share menu
  - Tooltip: "Share book"

### Navigation Methods
1. **Button Click:** Previous/Next buttons
2. **Keyboard:** Arrow keys (left/right), Space (next), Backspace (prev)
3. **Touch Swipe:** Swipe left (next), swipe right (prev)
4. **Mouse/Trackpad:** Click on left/right edges of page
5. **Page Thumbnails:** Click on thumbnail to jump to page

### Animations

#### Page Turn Animation (User Selectable)
1. **Flip (Default):**
   - Realistic page flip effect
   - 3D perspective
   - Shadow and depth
   - Duration: 500-600ms

2. **Slide:**
   - Slide left/right
   - Smooth transition
   - Duration: 400ms

3. **Fade:**
   - Fade out/in
   - Simple transition
   - Duration: 300ms

4. **Curl (Advanced):**
   - Page curl effect
   - Advanced animation
   - Duration: 600ms

**Animation Settings:**
- User can select animation style in settings
- Reduced motion option (accessibility)
- Smooth 60fps animations

### Responsive Breakpoints
- **Mobile (< 768px):**
  - Portrait: Single page
  - Landscape: Single page (zoomed) veya double page
  - Touch gestures enabled
  - Bottom controls (full width)
- **Tablet (768px - 1024px):**
  - Portrait: Single page
  - Landscape: Double page
  - Touch gestures enabled
  - Bottom controls
- **Desktop (> 1024px):**
  - Portrait: Single page (centered, max-width)
  - Landscape: Double page
  - Mouse/keyboard navigation
  - Side controls (optional)

### Dark Mode Support
- **Background:** slate-900 (dark), white (light)
- **Text:** slate-50 (dark), gray-900 (light)
- **Controls:** slate-800 (dark), gray-100 (light)
- **Borders:** slate-700 (dark), gray-200 (light)

### Accessibility
- **Keyboard Navigation:** Full support (Tab, Arrow keys, Space, Enter, Esc)
- **ARIA Labels:** All interactive elements
- **Screen Reader:** Semantic HTML, proper headings
- **Focus Indicators:** Visible focus rings
- **Color Contrast:** WCAG AA compliant (4.5:1 minimum)
- **Font Size:** User adjustable (16px-24px)
- **Reduced Motion:** Respect prefers-reduced-motion

---

## 🎯 v0.app Prompt (Copy-Paste Ready)

```
Create a beautiful, interactive e-book viewer component for KidStoryBook, a children's personalized storybook platform.

This is the MOST IMPORTANT component of the entire application - users will spend most of their time here reading their personalized books.

**Layout Structure:**

1. **Header (Top Bar):**
   - Left: Progress indicator ("Page 3 of 10" + progress bar, gradient purple-500 to pink-500)
   - Center: Book title (optional, subtle)
   - Right: Fullscreen button, Settings dropdown, Close/Back button
   - Background: white/slate-800 (dark mode), subtle shadow
   - Height: 60px (desktop), 56px (mobile)
   - Sticky: Fixed at top

2. **Page Content Area (Main):**
   - **Portrait Mode (Default):**
     - Single page display (centered)
     - Image on top, text below (or image + text combined)
     - Max-width: 800px (desktop), full-width (mobile)
     - Padding: 20px (desktop), 16px (mobile)
   
   - **Landscape Mode:**
     - Double page display (side by side)
     - Left page: Image (full height)
     - Right page: Text (full height)
     - Split: 50/50 or 40/60 (image/text)
     - Gap: 20px between pages
   
   - **Auto-detect orientation:** Use window.matchMedia or resize observer to detect screen orientation and switch layout automatically

3. **Controls (Bottom Bar):**
   - Previous button (ArrowLeft icon, disabled on first page)
   - Play/Pause button (Play/Pause icon, toggle TTS)
   - Next button (ArrowRight icon, disabled on last page)
   - Page thumbnails button (Grid icon)
   - Bookmark button (Bookmark icon, toggle state)
   - Share button (Share2 icon)
   - Background: white/slate-800 (dark mode), subtle shadow
   - Height: 80px (desktop), 72px (mobile)
   - Sticky: Fixed at bottom
   - Icons: Lucide React icons

**Page Turn Animations (User Selectable):**

1. **Flip (Default):**
   - Realistic 3D page flip effect
   - Perspective transform
   - Shadow and depth
   - Duration: 500-600ms
   - Easing: ease-in-out

2. **Slide:**
   - Slide left/right transition
   - Smooth movement
   - Duration: 400ms

3. **Fade:**
   - Fade out/in transition
   - Simple opacity change
   - Duration: 300ms

**Navigation Methods:**
- Button clicks (Previous/Next)
- Keyboard shortcuts (Arrow keys, Space, Backspace)
- Touch swipe gestures (left/right)
- Mouse click on page edges (desktop)
- Page thumbnail grid (jump to any page)

**Responsive Design:**
- Mobile (< 768px): Single page, touch gestures, bottom controls
- Tablet (768px - 1024px): Portrait single, landscape double page
- Desktop (> 1024px): Portrait centered, landscape double page

**Styling:**
- Color scheme: Purple-500 to Pink-500 gradient (matches KidStoryBook brand)
- Background: Gradient (purple-50 via white to pink-50, dark: slate-900)
- Text: Gray-900/Slate-50 (headings), Gray-700/Slate-300 (body)
- Buttons: Gradient (purple-500 to pink-500) or outline style
- Shadows: Subtle, modern
- Border radius: rounded-lg, rounded-xl

**Animations (Framer Motion):**
- Page turn: Smooth transitions (flip, slide, fade)
- Button hover: scale(1.05)
- Button tap: scale(0.95)
- Loading: Skeleton screens, blur placeholders
- Page content: fade-in on load

**Accessibility:**
- Keyboard navigation: Full support
- ARIA labels: All interactive elements
- Focus indicators: Visible focus rings
- Screen reader: Semantic HTML
- Color contrast: WCAG AA compliant
- Reduced motion: Respect prefers-reduced-motion

**Technical Requirements:**
- Use Next.js 14 App Router
- TypeScript
- Framer Motion for animations
- Lucide React for icons
- Responsive images (next/image)
- Client component ("use client")
- Mock data for now (Faz 3'te API entegrasyonu)

**Mock Data Structure:**
```typescript
const book = {
  id: "book-123",
  title: "Arya's Adventure",
  pages: [
    {
      pageNumber: 1,
      imageUrl: "/placeholder-book-page-1.jpg",
      text: "Once upon a time, there was a little girl named Arya..."
    },
    {
      pageNumber: 2,
      imageUrl: "/placeholder-book-page-2.jpg",
      text: "Arya loved to explore the magical forest..."
    },
    // ... more pages
  ],
  totalPages: 10,
  currentPage: 1
}
```

**Important Notes:**
- This is the most critical component - it must be perfect
- Smooth animations are essential (60fps target)
- Mobile experience is crucial (many users will read on phones)
- Landscape mode with split view (image/text) is a key feature
- User should be able to select animation style
- All navigation methods should work seamlessly
- Performance is critical - lazy load images, optimize animations

**Design Match:**
Match the design style from Header, Footer, Hero, Wizard steps - modern, engaging, with purple-pink gradient accents, smooth animations, and clean layout.

Make it feel like a premium, polished reading experience that children and parents will love.
```

---

## 📝 Implementation Notes

### Dependencies
- `framer-motion` - Animations
- `lucide-react` - Icons
- `next/image` - Image optimization
- `react-use` - Hooks (useMedia, useFullscreen, vb.)
- `@/components/ui/button` - Button component
- `@/components/ui/dropdown-menu` - Settings dropdown

### State Management
- Current page: `useState`
- Animation style: `useState` (flip, slide, fade)
- Fullscreen mode: `useFullscreen` hook
- Orientation: `useMedia` hook
- Bookmark state: `useState` (array of bookmarked pages)

### File Structure
```
app/books/[id]/view/
  └── page.tsx
```

### Component Structure
```typescript
export default function EbookViewerPage({ params }: { params: { id: string } }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [animationStyle, setAnimationStyle] = useState<'flip' | 'slide' | 'fade'>('flip')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [bookmarks, setBookmarks] = useState<number[]>([])
  
  // Mock data - Faz 3'te API'den gelecek
  const book = getBookData(params.id)
  
  const handleNextPage = () => {
    if (currentPage < book.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  // ... more handlers
  
  return (
    <div>
      {/* Header */}
      {/* Page Content */}
      {/* Controls */}
    </div>
  )
}
```

---

## 🎨 Design Inspiration

- **Realistic book feel:** 3D page flip effect
- **Smooth transitions:** 60fps animations
- **Clean interface:** Minimal, focused on content
- **Mobile-first:** Touch-friendly controls
- **Premium feel:** Polished, professional

---

## ✅ Checklist

- [ ] Header with progress indicator
- [ ] Fullscreen button
- [ ] Settings dropdown
- [ ] Close/Back button
- [ ] Portrait mode (single page)
- [ ] Landscape mode (double page - image/text split)
- [ ] Auto orientation detection
- [ ] Page turn animations (flip, slide, fade)
- [ ] Previous/Next buttons
- [ ] Play/Pause button (TTS placeholder)
- [ ] Page thumbnails button
- [ ] Bookmark button
- [ ] Share button
- [ ] Keyboard navigation
- [ ] Touch swipe gestures
- [ ] Loading states
- [ ] Dark mode support
- [ ] Accessibility (ARIA, keyboard, screen reader)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Smooth 60fps animations

---

## 📌 Important Notes

1. **Critical Component:** This is the most important part of the app
2. **Performance:** 60fps animations, lazy loading, optimize everything
3. **Mobile:** Many users will read on phones - mobile experience is crucial
4. **Landscape Mode:** Split view (image/text) is a key differentiator
5. **Animations:** Smooth, polished, user-selectable
6. **Accessibility:** WCAG 2.1 AA compliant
7. **Iteration:** May need multiple v0.app versions to get it perfect

---

**Son Güncelleme:** 4 Ocak 2026  
**Durum:** Ready for v0.app generation

