## 🎨 v0.app Prompt Rehberi

v0.app ile UI oluştururken kullanabileceğiniz prompt'lar:

### Ana Sayfa Hero Section
```
Create an animated hero section for a children's personalized storybook website called "KidStoryBook" with playful animations similar to modern children's websites.

Requirements:
- Modern, playful design with soft gradients (purple to pink)
- Large heading: "Create Magical Stories Starring Your Child"
- Subheading about AI-generated personalized books
- Two CTA buttons: "Create Your Book" (primary) and "See Examples"
- Hero image placeholder showing a cute illustrated children's book
- Floating decorative elements (stars, hearts, book icons) with gentle animations
- Framer Motion animations:
  - Fade in on scroll (text elements with stagger effect)
  - Floating decorative elements with gentle bounce and rotate
  - Parallax effect on hero image
  - Button hover: scale(1.05) + color transition
- Smooth transitions (0.3s - 0.6s, ease-in-out)
- Responsive design (mobile-first)
- Use Tailwind CSS, shadcn/ui components, and Framer Motion
- Children-friendly aesthetic with rounded corners
- Typography should be playful but readable (consider fonts like Fredoka, Quicksand)
- Interactive elements that respond to user actions
```

### Kitap Oluşturma Wizard
```
Create an animated multi-step wizard form for creating a personalized children's book with smooth transitions and playful animations.

Steps:
1. Character Info (name, age, gender, hair color, eye color)
2. Photo Upload (drag & drop with preview, AI analysis button)
3. Theme Selection (adventure, fairy tale, etc. with icons and previews)
4. Illustration Style (grid of style options with images)
5. Custom Requests (textarea)
6. Review & Create (summary of all inputs)

Requirements:
- Progress indicator at top showing current step (animated progress bar)
- Previous/Next navigation buttons with smooth transitions
- Form validation with error messages (animated error states)
- Modern card-based design with hover effects
- Framer Motion animations:
  - Slide transitions between steps (slide left/right)
  - Fade in for form fields (stagger effect)
  - Scale animation on step completion
  - Smooth page transitions
- Mobile responsive (stack on mobile, side-by-side on desktop)
- Use shadcn/ui Form, Input, Select, Button, Card components
- Tailwind CSS for styling
- Loading states with animated spinners
- Success animations on step completion
```

### E-book Viewer
```
Create an animated e-book viewer component that looks like an open book with smooth page flip animations.

Requirements:
- Two-page spread view (left page: text, right page: illustration)
- Page flip animation when navigating (using react-pageflip library)
- Navigation controls (prev, next, page number) with smooth transitions
- Fullscreen toggle button with fade animation
- Thumbnail preview strip at bottom (optional, with scroll animation)
- Loading state for images (animated skeleton loaders)
- Mobile-friendly (single page view on mobile, swipe gestures)
- Download PDF button with loading state
- Share button with tooltip animation
- Book-like shadow and styling with 3D effect
- Framer Motion animations:
  - Page turn animation (realistic book flip)
  - Fade in for pages
  - Smooth transitions between pages
  - Hover effects on controls
- Responsive design
- Touch gestures for mobile (swipe left/right)
```

### Kullanıcı Kitaplığı
```
Create a user library/dashboard showing all created books.

Requirements:
- Grid layout of book cards (3 columns desktop, 2 tablet, 1 mobile)
- Each book card shows:
  - Book cover thumbnail
  - Book title
  - Creation date
  - Status badge (completed, processing, draft)
  - Action buttons (view, edit, download, delete)
- Filter tabs (All, Completed, Drafts)
- Search bar
- Sort dropdown (date, name)
- Empty state with CTA to create first book
- Modern card design with hover effects
```

### Fiyatlandırma Sayfası
```
Create a pricing page for a children's storybook service.

Tiers:
1. Basic (10 pages) - $7.99
2. Standard (15 pages) - $11.99 - Most Popular
3. Premium (20 pages) - $15.99

Features per tier:
- AI story generation
- AI illustrations
- E-book download
- Free image revisions (1/2/3)
- Priority support (premium only)

Requirements:
- Three pricing cards in a row
- "Most Popular" badge on Standard
- Feature checkmarks
- CTA button per card
- Toggle for USD/TRY currency (optional)
- FAQ section below
- Clean, trustworthy design
```

### Examples Sayfası (Örnek Kitaplar) 🆕
**Detaylı Prompt:** `docs/guides/EXAMPLES_PAGE_V0_PROMPT.md`

**Kısa Özet:**
```
Create a mobile-first Examples page for a children's personalized storybook website that showcases example books with before/after photo transformations.

Key Features:
- Age filter chips (horizontal scroll on mobile): [All] [0-2] [3-5] [6-9] [10+]
- Responsive grid: 1 column (mobile), 2 (tablet), 3 (desktop), 4 (large)
- Book cards with: cover image, age/theme badges, used photos thumbnails, action buttons
- "Used Photos" modal with before/after comparison
- "View Example" and "Create Your Own" buttons
- Empty state and loading skeleton components

Mobile-first design with touch-friendly interactions.
```

**Tam Prompt:** `docs/guides/EXAMPLES_PAGE_V0_PROMPT.md` dosyasına bakın.

---

