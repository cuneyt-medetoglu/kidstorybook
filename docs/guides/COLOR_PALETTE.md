# 🎨 KidStoryBook Renk Paleti

**Tarih:** 4 Ocak 2026  
**Durum:** Aktif

---

## 📋 Genel Bakış

KidStoryBook için çocuklara ve kitaplara uygun, dark/light mode destekli renk paleti.

---

## 🌞 Light Mode Renkleri

### Primary Colors
- **Purple:** `#8B5CF6` (purple-500)
- **Pink:** `#EC4899` (pink-500)
- **Gradient:** `from-purple-500 to-pink-500`

### Accent Colors
- **Light Purple:** `#A78BFA` (purple-400)
- **Light Pink:** `#F472B6` (pink-400)
- **Book Orange:** `#FB923C` (orange-400) - Kitaplar için
- **Sky Blue:** `#60A5FA` (blue-400) - Çocuk dostu

### Background
- **Main:** `#FFFFFF` (white)
- **Secondary:** `#F9FAFB` (gray-50)
- **Card:** `#FFFFFF` (white with shadow)

### Text
- **Primary:** `#1F2937` (gray-800)
- **Secondary:** `#6B7280` (gray-500)
- **Muted:** `#9CA3AF` (gray-400)

### Borders
- **Default:** `#E5E7EB` (gray-200)
- **Hover:** `#D1D5DB` (gray-300)

---

## 🌙 Dark Mode Renkleri

### Primary Colors
- **Purple:** `#A78BFA` (purple-400) - Daha açık
- **Pink:** `#F472B6` (pink-400) - Daha açık
- **Gradient:** `from-purple-400 to-pink-400`

### Accent Colors
- **Light Purple:** `#C4B5FD` (purple-300)
- **Light Pink:** `#F9A8D4` (pink-300)
- **Book Orange:** `#FDBA74` (orange-300) - Daha açık
- **Sky Blue:** `#93C5FD` (blue-300) - Daha açık

### Background
- **Main:** `#0F172A` (slate-900)
- **Secondary:** `#1E293B` (slate-800)
- **Card:** `#1E293B` (slate-800 with shadow)

### Text
- **Primary:** `#F1F5F9` (slate-100)
- **Secondary:** `#CBD5E1` (slate-300)
- **Muted:** `#94A3B8` (slate-400)

### Borders
- **Default:** `#334155` (slate-700)
- **Hover:** `#475569` (slate-600)

---

## 🎯 Kullanım Örnekleri

### Gradient Buttons
```tsx
// Light mode
className="bg-gradient-to-r from-purple-500 to-pink-500"

// Dark mode
className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400"
```

### Text Colors
```tsx
// Light mode
className="text-gray-800"

// Dark mode
className="text-gray-800 dark:text-slate-100"
```

### Backgrounds
```tsx
// Light mode
className="bg-white"

// Dark mode
className="bg-white dark:bg-slate-900"
```

### Borders
```tsx
// Light mode
className="border-gray-200"

// Dark mode
className="border-gray-200 dark:border-slate-700"
```

---

## 📦 Tailwind Config

Renkler `tailwind.config.ts`'de tanımlı (shadcn/ui varsayılan renkleri). Dark mode için `dark:` prefix kullanılır.

---

## 🎨 Renk Seçimi Mantığı

### Neden Bu Renkler?

1. **Purple-Pink Gradient:**
   - Çocuklara çekici
   - Sıcak ve davetkar
   - Modern ve profesyonel

2. **Book Orange:**
   - Kitapları temsil eder
   - Sepet badge için dikkat çekici
   - Çocuk dostu

3. **Sky Blue:**
   - Çocuklara uygun
   - Güven veren
   - Accent olarak kullanılabilir

4. **Dark Mode:**
   - Daha açık tonlar (okunabilirlik için)
   - Göz yormayan
   - Modern standart

---

## 🔄 Gelecek Güncellemeler

- Kullanıcı geri bildirimlerine göre renkler güncellenebilir
- A/B test ile renk performansı ölçülebilir
- Mevsimsel tema değişiklikleri (opsiyonel)

---

**Son Güncelleme:** 4 Ocak 2026

