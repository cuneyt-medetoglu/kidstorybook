# Examples Sayfası - v0.app Prompt

**Tarih:** 25 Ocak 2026  
**Durum:** Hazır - v0.app'e yapıştırılabilir  
**Sayfa:** Examples (Örnek Kitaplar)

---

## v0.app Prompt

```
Create a mobile-first Examples page for a children's personalized storybook website called "KidStoryBook" that showcases example books with before/after photo transformations.

## Page Structure

### 1. Header Section
- Page title: "Örnek Kitaplar" (large, bold, playful font)
- Subtitle: "Çocuğunuzun fotoğraflarından nasıl sihirli hikayeler oluşturduğumuzu keşfedin"
- Clean, spacious design with soft gradients (purple to pink)

### 2. Age Filter Chips (Horizontal Scroll on Mobile)
- Filter chips: [All] [0-2 yaş] [3-5 yaş] [6-9 yaş] [10+ yaş]
- Horizontal scrollable on mobile (320px+)
- Selected chip: Different color (purple/pink gradient) with border
- Unselected chips: Gray background, white text
- Smooth transitions on selection
- Use shadcn/ui Badge or custom chip component

### 3. Book Cards Grid (Responsive)
- Mobile (320px-767px): 1 column (full width cards)
- Tablet (768px-1023px): 2 columns
- Desktop (1024px-1439px): 3 columns
- Large Desktop (1440px+): 4 columns
- Gap between cards: 16px mobile, 24px desktop
- Cards stack vertically on mobile

### 4. Book Card Component (Each Card)

**Card Structure:**

**Top Section:**
- Cover image (aspect ratio 3:4, rounded-lg, shadow-md)
- Position: relative container
- Age badge: Top-right corner (e.g., "3-5 yaş") - small badge, purple/pink gradient
- Theme badge: Top-left corner (e.g., "Macera") - small badge, secondary color
- Use Next.js Image component for optimization

**Middle Section:**
- Book title: Bold, 18-20px on mobile, larger on desktop
- Short description: 1-2 lines, gray text (text-gray-600), smaller font (14px)
- Padding: 12px mobile, 16px desktop

**Bottom Section:**
- "Kullanılan Fotoğraflar" label: Small gray text (text-sm text-gray-500)
- Photo thumbnails grid: 2-4 small square thumbnails (40-50px on mobile, 60px on desktop)
- Arrow icon (→) pointing to cover image
- Thumbnails are clickable (opens modal)
- If more than 4 photos, show "+X more" badge

**Action Buttons:**
- "View Example" button: Primary button (purple/pink gradient), full width, rounded-lg
- "Create Your Own" button: Secondary button (outline style), full width, below first button
- Both buttons: Touch-friendly (min 44px height on mobile)
- Icons: Eye icon for "View Example", Plus icon for "Create Your Own"

**Card Styling:**
- White background, rounded-xl, shadow-sm
- Hover effect (desktop only): scale(1.02) + shadow-lg transition
- Padding: 16px mobile, 20px desktop
- Border: 1px solid gray-200

### 5. Used Photos Modal Component
- Full-screen modal on mobile, centered dialog on desktop
- Close button (X) top-right
- Photo display: Large image (full width on mobile, max-width on desktop)
- "Before" (original photo) and "After" (book illustration) comparison
- Swipe navigation on mobile (left/right arrows or swipe gestures)
- Photo counter: "1 / 4" at bottom
- Character name label below photo
- Use shadcn/ui Dialog component

### 6. Empty State Component
- Icon: Book or search icon (large, gray)
- Message: "Bu yaş grubu için henüz örnek yok"
- "Tüm Örnekleri Gör" button (secondary style)
- Centered, spacious design

### 7. Loading Skeleton Component
- 3-4 skeleton cards
- Shimmer effect (animated gradient)
- Same layout as actual cards
- 1 column on mobile, 2 columns on tablet

## Design Requirements

### Colors
- Primary: Purple to pink gradient (bg-gradient-to-r from-purple-500 to-pink-500)
- Secondary: Gray tones (text-gray-600, bg-gray-100)
- Background: White cards on light gray/white page background
- Badges: Purple/pink gradient for age, secondary color for theme

### Typography
- Title: Bold, 18-20px mobile, 24px desktop (playful but readable)
- Description: Regular, 14px mobile, 16px desktop (gray)
- Buttons: Medium weight, 16px
- Use system fonts or consider Fredoka/Quicksand for titles

### Spacing
- Page padding: 16px mobile, 24px tablet, 32px desktop
- Card gap: 16px mobile, 24px desktop
- Section spacing: 32px mobile, 48px desktop

### Animations
- Card hover: scale(1.02) + shadow-lg (desktop only, 0.2s transition)
- Chip selection: Color transition (0.2s)
- Modal open: Fade + scale animation (0.3s)
- Loading shimmer: Continuous gradient animation

### Mobile-First Considerations
- Touch targets: Minimum 44px height for buttons
- Horizontal scroll: Filter chips scroll horizontally on mobile
- Full-width cards: Cards take full width on mobile (no side padding in grid)
- Swipe gestures: Modal photos support swipe navigation
- Stack layout: Everything stacks vertically on mobile

## Technical Requirements

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components (Button, Badge, Dialog, Card)
- Next.js Image component for optimized images
- Framer Motion for animations (optional, can use CSS transitions)
- Responsive design (mobile-first approach)

## Mock Data Structure

```typescript
interface ExampleBook {
  id: string
  title: string
  description: string
  coverImage: string
  ageGroup: '0-2' | '3-5' | '6-9' | '10+'
  theme: string
  usedPhotos: {
    id: string
    originalPhoto: string
    characterName: string
    transformedImage?: string
  }[]
  storyDetails: {
    style: string
    font: string
    characterCount: number
  }
}
```

## Component Structure

Create these components:
1. `ExamplesPage` - Main page component
2. `AgeFilterChips` - Filter chips component
3. `BookCard` - Individual book card component
4. `UsedPhotosModal` - Modal for photo comparison
5. `EmptyState` - Empty state component
6. `LoadingSkeleton` - Loading skeleton component

## Example Usage

The page should work with mock data initially. Each book card should:
- Display cover image, title, description
- Show age and theme badges
- Display used photos thumbnails
- Have "View Example" and "Create Your Own" buttons
- Open modal when photo thumbnails are clicked
- Filter books when age chip is selected

## Notes

- Focus on mobile experience first (320px+)
- Ensure all interactive elements are touch-friendly
- Use semantic HTML for accessibility
- Optimize images with Next.js Image component
- Keep animations smooth but not distracting
- Maintain consistent spacing and typography
```

---

## Kullanım Talimatları

1. Bu prompt'u v0.app'e kopyala-yapıştır yap
2. v0.app component'leri oluşturacak
3. Oluşan kodu `app/examples/` klasörüne entegre et
4. Mock data ile test et
5. Responsive tasarımı kontrol et (mobil, tablet, desktop)

## Sonraki Adımlar

- [ ] v0.app'den kod alındıktan sonra mock data entegrasyonu
- [ ] "View Example" butonu için route hazırlama (gelecek faz)
- [ ] "Create Your Own" butonu için wizard'a yönlendirme
- [ ] API entegrasyonu (gerçek örnek kitaplar)
