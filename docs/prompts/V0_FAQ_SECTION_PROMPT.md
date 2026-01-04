# 🎨 v0.app FAQ Bölümü Prompt

**Component:** FAQ Section  
**Faz:** 2.2.6 (Ana Sayfa)  
**Tarih:** 4 Ocak 2026

---

## Prompt (v0.app'e yapıştırılacak)

```
Create an animated FAQ (Frequently Asked Questions) section for KidStoryBook, a children's personalized storybook website, with expandable/collapsible questions and answers.

I've attached the Header, Footer, Hero Section, How It Works, Example Books Carousel, Features Section, and Pricing Section components for KidStoryBook. Create a "FAQ" section that matches this design.

Requirements:

**Structure:**
- Section title: "Frequently Asked Questions" / "FAQ"
- Subtitle: "Everything you need to know" / "Merak ettiğiniz her şey"
- Accordion/Collapsible FAQ items (expandable questions)
- Each FAQ item should show:
  - Question (clickable, expandable)
  - Answer (hidden by default, expands on click)
  - Icon (chevron down/up, rotates on expand)

**FAQ Questions (suggested list - can be adjusted):**

1. "How does it work?"
   Answer: "It's simple! Upload your child's photo, choose a theme and style, and our AI creates a personalized storybook. You can download it as an e-book or order a printed hardcover version."

2. "How long does it take to create a book?"
   Answer: "E-books are ready within 2 hours. Printed books take 3-5 weeks for printing and delivery."

3. "Can I customize the story?"
   Answer: "Yes! You can choose from various themes (adventure, fairy tale, science fiction, etc.) and select your child's age group. The AI tailors the story accordingly."

4. "What age groups are supported?"
   Answer: "Our books are designed for children aged 0-2, 3-5, 6-9, and 10+ years. The content and complexity are adjusted based on the selected age group."

5. "Can I use multiple photos?"
   Answer: "Yes, you can upload up to 5 character photos per book. These can include your child, family members, pets, or toys."

6. "What formats are available?"
   Answer: "E-books are available as PDF files for instant download. Printed books come as hardcover, A4 format (21x29.7 cm) with high-quality printing."

7. "Is my child's photo secure?"
   Answer: "Absolutely! We use secure encryption and follow strict privacy policies. Your photos are used solely for creating your personalized book and are not shared with third parties."

8. "Can I get a refund?"
   Answer: "Yes, we offer a money-back guarantee. If you're not satisfied with your e-book, contact us within 30 days for a full refund."

9. "Do you ship internationally?"
   Answer: "Yes! We ship printed books to over 26 countries worldwide. Shipping times vary by location (typically 3-5 weeks)."

10. "Can I order multiple copies?"
    Answer: "Yes! You can order multiple copies of the same book. We offer discounts for orders of 3 or more books."

**Design:**
- Match the color scheme from Header/Footer/Hero (purple-500, pink-500 gradient)
- Accordion items: white/light background, rounded corners, border, shadow
- Active/expanded item: subtle background color change or border highlight
- Question text: bold, larger font, clickable (cursor pointer)
- Answer text: smaller font, muted color, smooth expand/collapse
- Chevron icon: rotates 180° when expanded
- Clean, organized layout
- Trustworthy and professional aesthetic

**Animations (Framer Motion):**
- Section fades in when scrolling into view
- FAQ items animate in with stagger effect (delay between items)
- Expand/collapse animation: smooth height transition (0.3s - 0.5s)
- Chevron icon rotation: smooth 180° rotation on expand/collapse
- Answer text: fade-in animation when expanded
- Hover effect on question (optional: subtle background change)

**Responsive Design:**
- Desktop: 2 columns (optional, or single column)
- Tablet: 1 column
- Mobile: 1 column, full width
- Mobile-first approach
- Touch-friendly tap targets (questions should be easy to tap on mobile)

**Styling:**
- Background: white or light gradient (matching other sections)
- Accordion container: max-width centered, padding
- Each FAQ item: 
  - Border (1-2px, subtle color)
  - Rounded corners (md or lg)
  - Padding (p-4 to p-6)
  - Margin between items
  - Shadow on hover (optional)
- Question: 
  - Font: bold, text-lg or text-xl
  - Color: dark (foreground color)
  - Icon: chevron down/up (right side, rotates)
  - Flexbox layout: question text + icon
- Answer:
  - Font: text-base or text-sm
  - Color: muted (muted-foreground)
  - Padding-top when expanded
  - Line height: comfortable reading
- Dark mode support (dark: classes)

**Technologies:**
- Next.js 14 App Router
- Tailwind CSS
- shadcn/ui components (Accordion if available, or custom implementation)
- Framer Motion for animations
- TypeScript
- Lucide React icons (ChevronDown, HelpCircle, etc.)

**Visual Hierarchy:**
- Section title should be clear and prominent
- Questions should be scannable (list format, clear spacing)
- Expanded answers should be readable (good line height, spacing)
- Chevron icons help indicate expand/collapse state
- Overall section should feel organized and easy to navigate

**Accordion Behavior:**
- Single item expands at a time (optional - can be "allow multiple" if preferred)
- Clicking an expanded item collapses it
- Smooth transitions (no jarring movements)
- Keyboard accessible (Tab, Enter/Space to expand/collapse)

Make it modern, engaging, and visually appealing - something that matches the Header, Footer, Hero, How It Works, Example Books Carousel, Features Section, and Pricing Section design, and clearly presents FAQ items in an organized, easy-to-navigate way.
```

---

## Beklenen Özellikler

- ✅ Accordion/Collapsible FAQ items (expandable questions)
- ✅ 8-10 FAQ soruları (yukarıdaki listeden seçilebilir veya özelleştirilebilir)
- ✅ Her FAQ item: Soru (tıklanabilir) + Cevap (genişleyen) + Chevron icon (dönen)
- ✅ Framer Motion animasyonları (fade-in, stagger, expand/collapse, icon rotation)
- ✅ Responsive tasarım (2 columns desktop optional, 1 column mobile)
- ✅ Header/Footer/Hero ile uyumlu renk paleti
- ✅ Dark mode desteği
- ✅ Smooth expand/collapse transitions

---

## FAQ Soruları Önerisi

Yukarıdaki prompt'ta 10 soru önerildi. v0.app'den gelen kodda bu soruları özelleştirebilir veya ekleyebilirsiniz.

**Öncelikli Sorular (MVP için yeterli):**
1. How does it work?
2. How long does it take?
3. Can I customize the story?
4. What age groups are supported?
5. What formats are available?
6. Is my child's photo secure?
7. Can I get a refund?
8. Do you ship internationally?

---

## Teknik Notlar

- shadcn/ui'da Accordion component'i varsa kullanılabilir
- Yoksa custom accordion implementation gerekir (Framer Motion ile)
- State management: Her FAQ item için açık/kapalı durumu (useState)
- Keyboard accessibility: Tab, Enter/Space desteği

---

**Son Güncelleme:** 4 Ocak 2026

