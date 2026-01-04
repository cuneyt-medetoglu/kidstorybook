# 🎨 v0.app Renk Güncelleme Prompt

**Component:** Header Renk Güncellemesi  
**Faz:** 2.1.1 (Header iyileştirmesi)  
**Tarih:** 4 Ocak 2026

---

## Renk Paleti Önerisi

### Light Mode Renkleri

**Primary Gradient:**
- From: `#8B5CF6` (Soft Purple)
- To: `#EC4899` (Warm Pink)

**Accent Colors:**
- Purple: `#A78BFA` (Light Purple)
- Pink: `#F472B6` (Light Pink)
- Orange: `#FB923C` (Warm Orange - kitaplar için)
- Blue: `#60A5FA` (Sky Blue - çocuk dostu)

**Background:**
- Main: `#FFFFFF` (White)
- Secondary: `#F9FAFB` (Very Light Gray)
- Card: `#FFFFFF` (White with shadow)

**Text:**
- Primary: `#1F2937` (Dark Gray)
- Secondary: `#6B7280` (Medium Gray)
- Muted: `#9CA3AF` (Light Gray)

**Borders:**
- Default: `#E5E7EB` (Light Gray)
- Hover: `#D1D5DB` (Medium Gray)

### Dark Mode Renkleri

**Primary Gradient:**
- From: `#A78BFA` (Lighter Purple for dark mode)
- To: `#F472B6` (Lighter Pink for dark mode)

**Accent Colors:**
- Purple: `#C4B5FD` (Light Purple)
- Pink: `#F9A8D4` (Light Pink)
- Orange: `#FDBA74` (Lighter Orange)
- Blue: `#93C5FD` (Lighter Blue)

**Background:**
- Main: `#0F172A` (Dark Slate)
- Secondary: `#1E293B` (Darker Slate)
- Card: `#1E293B` (Dark Slate with shadow)

**Text:**
- Primary: `#F1F5F9` (Light Gray)
- Secondary: `#CBD5E1` (Medium Light Gray)
- Muted: `#94A3B8` (Medium Gray)

**Borders:**
- Default: `#334155` (Dark Gray)
- Hover: `#475569` (Medium Dark Gray)

---

## Prompt (v0.app'e yapıştırılacak)

```
Update the color scheme of the KidStoryBook header component to be more child-friendly and book-themed, with proper dark mode and light mode support.

Current Colors to Replace:
- primary-purple → New purple color
- primary-pink → New pink color
- accent-coral → New accent color (book-themed)

New Color Palette:

**Light Mode:**
- Primary Gradient: from-purple-500 (#8B5CF6) to-pink-500 (#EC4899)
- Accent Purple: purple-400 (#A78BFA)
- Accent Pink: pink-400 (#F472B6)
- Book Orange: orange-400 (#FB923C) - for book-themed elements
- Sky Blue: blue-400 (#60A5FA) - for child-friendly accents
- Background: white (#FFFFFF)
- Text: gray-800 (#1F2937)
- Borders: gray-200 (#E5E7EB)

**Dark Mode:**
- Primary Gradient: from-purple-400 (#A78BFA) to-pink-400 (#F472B6)
- Accent Purple: purple-300 (#C4B5FD)
- Accent Pink: pink-300 (#F9A8D4)
- Book Orange: orange-300 (#FDBA74)
- Sky Blue: blue-300 (#93C5FD)
- Background: slate-900 (#0F172A)
- Text: slate-100 (#F1F5F9)
- Borders: slate-700 (#334155)

**Requirements:**
- Use Tailwind CSS color classes (purple-500, pink-500, etc.)
- Support dark mode using `dark:` prefix
- Gradient buttons should work in both modes
- Shopping cart badge should use book-themed orange in light mode, lighter orange in dark mode
- All text should be readable in both modes
- Hover states should work in both modes

**Example:**
- Logo gradient: `bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400`
- CTA button: `bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400`
- Cart badge: `bg-orange-400 dark:bg-orange-300`

Update all color references in the header component to use this new palette with dark mode support.
```

---

## Tailwind Config Güncellemesi

Renkleri `tailwind.config.ts`'e de ekleyeceğiz:

```typescript
colors: {
  // ... existing colors
  'book-orange': {
    DEFAULT: '#FB923C',
    light: '#FDBA74',
  },
  'book-purple': {
    DEFAULT: '#8B5CF6',
    light: '#A78BFA',
  },
  'book-pink': {
    DEFAULT: '#EC4899',
    light: '#F472B6',
  },
}
```

---

**Son Güncelleme:** 4 Ocak 2026

