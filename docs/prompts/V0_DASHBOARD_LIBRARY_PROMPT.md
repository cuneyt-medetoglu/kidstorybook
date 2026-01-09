# v0.app Prompt - User Library Dashboard

## Prompt (Kopyala ve v0.app'e yapıştır)

```
Create a modern user library dashboard for a children's storybook creation platform.

Page title: "My Library"

Requirements:

**Header Section:**
- Page title "My Library" with book count badge
- Filter tabs: All Books, Completed, In Progress, Drafts
- Search bar (with search icon, placeholder: "Search your books...")
- View toggle buttons (Grid view / List view) - Grid default
- Sort dropdown: Date (Newest), Date (Oldest), Title (A-Z), Title (Z-A)
- "Create New Book" button (gradient purple-to-pink, prominent)

**Book Cards (Grid View - 3 columns desktop, 2 tablet, 1 mobile):**
Each card shows:
- Book cover image (aspect ratio 3:4)
- Book title (max 2 lines, truncate with ...)
- Character name subtitle
- Creation date (e.g., "Created Jan 5, 2026")
- Status badge:
  - "Completed" (green)
  - "In Progress" (yellow/orange)
  - "Draft" (gray)
- Action buttons row:
  - "Read" button (primary, gradient)
  - "Edit" button (ghost)
  - "Download" icon button
  - "Share" icon button
  - "Delete" icon button (red on hover)
- Hover effect: Lift card with shadow

**Empty State:**
- Illustration/icon (book with sparkles)
- Heading: "No books yet"
- Subtitle: "Create your first magical storybook!"
- "Create New Book" button

**Features:**
- Loading skeletons for cards while fetching
- Smooth animations on card hover (scale up, shadow)
- Filter tabs with active indicator (underline, color change)
- Responsive grid (CSS Grid or Flexbox)
- Modern card design with rounded corners, subtle shadows
- Framer Motion animations:
  - Stagger animation for cards appearing
  - Fade in/out for filters
  - Smooth layout transitions
- Use shadcn/ui: Card, Badge, Button, Input, Dropdown, Tabs components
- Tailwind CSS styling
- English text only
- Color scheme: Purple and pink gradients for primary actions, clean neutral background

**Mock Data (3 books):**
1. "Arya's Adventure" - Character: Arya - Status: Completed - Date: Jan 5, 2026
2. "Emma's Space Journey" - Character: Emma - Status: In Progress - Date: Jan 8, 2026
3. "Oliver's Magic Forest" - Character: Oliver - Status: Draft - Date: Jan 10, 2026

Use placeholder images for book covers (e.g., from unsplash or placeholder services).
```

## Kullanım Talimatları

1. v0.app'i aç: https://v0.dev
2. Yukarıdaki prompt'u kopyala (``` işaretleri arasındaki tüm metni)
3. v0.app'e yapıştır ve "Generate" butonuna bas
4. Oluşan kodu indir
5. Projeye entegre et

## Entegrasyon Adımları

1. `app/dashboard/page.tsx` oluştur
2. v0.app'den gelen kodu entegre et
3. Mock data'yı kullan (şimdilik)
4. Faz 3'te API'ye bağla

## Notlar

- Şimdilik statik mock data kullanacağız
- Backend API entegrasyonu Faz 3'te yapılacak
- Filtreleme ve sıralama frontend'de çalışacak (mock data üzerinde)

