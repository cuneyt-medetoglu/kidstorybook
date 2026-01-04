# 🎨 v0.app "Nasıl Çalışır?" Bölümü Prompt

**Component:** How It Works Section (3 Steps)  
**Faz:** 2.2.2 (Ana Sayfa)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated "How It Works" section for KidStoryBook, a children's personalized storybook website, with 3 steps showing the process.

I've attached the Header, Footer, and Hero Section components for KidStoryBook. Create a "How It Works" section that matches this design.

Requirements:

**Structure:**
- Section title: "How It Works" / "Nasıl Çalışır?"
- 3 steps in a row (desktop) or stacked (mobile)
- Each step should have:
  - Step number (1, 2, 3) - large, gradient colored
  - Icon (related to the step)
  - Title/Heading
  - Description (short, clear explanation)
  - Optional: Small illustration or icon decoration

**3 Steps:**
1. **Step 1: Personalize Character**
   - Icon: User/Upload/Photo icon
   - Title: "Personalize Your Character" / "Karakteri Kişiselleştir"
   - Description: "Upload your child's photo and add their details (name, age, appearance)"
   - Visual: Photo upload illustration or icon

2. **Step 2: Create Story**
   - Icon: Book/Magic/Wand icon
   - Title: "Create Your Story" / "Hikaye Oluştur"
   - Description: "Choose a theme and illustration style. AI generates a personalized story"
   - Visual: Book/magic illustration or icon

3. **Step 3: Get Your Book**
   - Icon: Download/Gift/Book icon
   - Title: "Get Your Book" / "Kitabını Al"
   - Description: "Receive your e-book instantly or order a printed hardcover version"
   - Visual: Book/download illustration or icon

**Design:**
- Match the color scheme from Header/Footer/Hero (purple-500, pink-500 gradient)
- Cards for each step (white background, rounded corners, shadow)
- Gradient accents on step numbers
- Icons: Use Lucide React icons (User, BookOpen, Gift, Upload, Sparkles, etc.)
- Clean, modern layout
- Child-friendly aesthetic

**Animations (Framer Motion):**
- Section fades in when scrolling into view
- Each step animates in with stagger effect (delay between steps)
- Step cards: hover scale(1.02) + shadow increase
- Icons: gentle float animation (optional)
- Step numbers: gradient animation or pulse effect (optional)
- Smooth transitions (0.3s - 0.6s, ease-in-out)

**Responsive Design:**
- Desktop (≥768px): 3 steps in a row
- Tablet (≥640px): 2 steps per row, 3rd centered
- Mobile (<640px): Single column, stacked
- Mobile-first approach
- Touch-friendly tap targets

**Styling:**
- Background: white or light gradient (matching Hero section)
- Cards: white background with shadow, rounded corners
- Step numbers: large, gradient (purple to pink), bold
- Icons: purple/pink accent color, medium size
- Text: dark gray for readability
- Titles: bold, larger font size
- Descriptions: regular weight, smaller font size
- Dark mode support (dark: classes)

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- shadcn/ui components (Card, Button if needed)
- Framer Motion for animations
- TypeScript
- Lucide React icons

**Visual Hierarchy:**
- Step numbers should be prominent (large, colorful)
- Icons should be clear and recognizable
- Text should be readable and well-spaced
- Cards should have clear boundaries
- Overall section should feel playful but professional

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, and Hero Section design, and clearly explains the 3-step process to parents.
```

---

## Beklenen Özellikler

- ✅ 3 adımlı layout
- ✅ Her adım için icon, başlık, açıklama
- ✅ Step numbers (1, 2, 3) - gradient colored
- ✅ Card-based design
- ✅ Framer Motion animasyonları (stagger, hover)
- ✅ Responsive tasarım (3 → 2 → 1 column)
- ✅ Header/Footer/Hero ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ Accessibility özellikleri

---

**Son Güncelleme:** 4 Ocak 2026

