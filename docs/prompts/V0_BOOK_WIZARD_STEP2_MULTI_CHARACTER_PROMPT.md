# v0.app Prompt: Book Creation Wizard - Step 2 (Multi-Character Photo Upload)

**Component Name:** `BookWizardStep2MultiCharacter` veya `MultiCharacterPhotoUpload`  
**Purpose:** Kitap oluşturma wizard'ının ikinci adımı - Çoklu karakter referans görsel yükleme (3 karaktere kadar)  
**File Path:** `app/create/step2/page.tsx` veya `components/wizard/Step2MultiCharacterUpload.tsx`  
**Tarih:** 4 Ocak 2026  
**Özellik:** Ücretsiz (MVP'de dahil)

---

## 🎯 Component Gereksinimleri

### Genel Yapı
- **Multi-step wizard'ın ikinci adımı** (Step 2 of 6)
- **Progress indicator** üstte (2/6 gösterimi, 33.33% progress bar)
- **Form layout:** Centered, max-width container
- **Navigation:** "Next" butonu (Step 3'e geçiş), "Back" butonu (Step 1'e dönüş)
- **Responsive:** Mobile-first, desktop'ta daha geniş layout

### Multi-Character Upload Section

#### 1. Character List Container
- **Layout:** Vertical stack of character cards
- **Minimum:** 1 karakter (varsayılan)
- **Maximum:** 3 karakter
- **Spacing:** Her karakter kartı arasında gap-4

#### 2. Character Card (Her karakter için)
- **Layout:** Card-based design (rounded-lg, shadow, border)
- **Structure:**
  - **Header:** 
    - Karakter numarası badge (Character 1, Character 2, Character 3)
    - Karakter tipi dropdown (Çocuk, Köpek, Kedi, Tavşan, Ayıcık, vb.) - varsayılan: "Çocuk"
    - Silme butonu (X icon, sadece 2+ karakter varsa görünür)
  - **Body:**
    - Upload area (drag & drop + file picker)
    - Photo preview (yüklendikten sonra)
    - AI Analysis butonu ve sonuçları
  - **Footer:**
    - File info (filename, size)
    - Remove photo butonu (opsiyonel)

#### 3. Upload Area (Her karakter için)
- **Type:** Drag & drop zone + file picker button
- **Layout:** Medium drop zone (min-height 200px on desktop, 180px on mobile)
- **Visual:**
  - Dashed border (purple-300, dark: purple-700)
  - Background: purple-50 (light), purple-900/20 (dark)
  - Hover state: border becomes solid, background slightly darker
  - Active/drag-over state: border becomes purple-500, background purple-100
- **Content:**
  - Upload icon (Lucide) - center
  - Title: "Upload [Character Type] Photo" (örn: "Upload Child Photo", "Upload Dog Photo")
  - Subtitle: "or click to browse"
  - File requirements: "JPG, PNG up to 5MB"
  - File picker button: "Choose File"
- **Functionality:**
  - Drag & drop support
  - Click to open file picker
  - File validation (format, size)
  - Error messages for invalid files

#### 4. Photo Preview (Her karakter için)
- **Display:** After successful upload
- **Layout:** Centered, max-width 300px, rounded corners
- **Features:**
  - Image preview (rounded-lg, shadow)
  - "Remove" button (top-right corner, X icon)
  - Image info: File name, size (below image)
- **Animation:** Fade-in + scale (0.9 to 1.0)

#### 5. AI Analysis Section (Her karakter için)
- **Card with gradient border** (purple-pink gradient)
- **Content:**
  - "Analyze Photo" butonu (Brain icon, gradient button)
  - Loading state (animated spinner)
  - Analysis results (saç uzunluğu, stili, yüz şekli, vb.) - grid layout
- **Functionality:**
  - Her karakter için ayrı AI analiz
  - Analiz sonuçları karakter kartında gösterilir

#### 6. Add Character Button
- **Position:** En altta, karakter listesinden sonra
- **Visibility:** Sadece 3'ten az karakter varsa görünür
- **Design:**
  - Outlined button (border, transparent background)
  - Icon: Plus icon (Lucide)
  - Text: "Add Character" / "Add Another Character"
  - Disabled state: 3 karakter varsa (gri, disabled)
- **Functionality:**
  - Yeni karakter kartı ekler
  - Otomatik olarak "Character [N]" numarası verir
  - Varsayılan tip: "Çocuk"

#### 7. Character Type Dropdown
- **Options:**
  - Çocuk (Child)
  - Köpek (Dog)
  - Kedi (Cat)
  - Tavşan (Rabbit)
  - Ayıcık (Teddy Bear)
  - Diğer (Other) - text input ile özel tip
- **Position:** Her karakter kartının header'ında
- **Default:** "Çocuk"

#### 8. Character Removal
- **Button:** X icon, karakter kartının header'ında (sağ üst)
- **Visibility:** Sadece 2+ karakter varsa görünür (ilk karakter silinemez)
- **Confirmation:** Silme onayı (opsiyonel, basit alert veya toast)
- **Functionality:**
  - Karakter kartını kaldırır
  - Karakter numaralarını yeniden düzenler (1, 2, 3)

### Validation
- **Minimum 1 karakter:** En az 1 karakter fotoğrafı yüklenmeli
- **Maximum 3 karakter:** En fazla 3 karakter eklenebilir
- **File validation:** Her fotoğraf için ayrı ayrı (format, size)
- **Character type:** Her karakter için tip seçilmeli

### State Management
- **Characters array:** Her karakter için:
  - id (unique identifier)
  - type (Çocuk, Köpek, vb.)
  - photo (File object)
  - previewUrl (string)
  - analysisResult (object, nullable)
  - isAnalyzing (boolean)

### Animations (Framer Motion)
- **Character card add:** Fade-in + slide-up
- **Character card remove:** Fade-out + slide-down
- **Photo upload:** Fade-in + scale
- **AI analysis:** Loading spinner, results fade-in
- **Smooth transitions:** 0.3s - 0.6s, ease-in-out

### Responsive Design
- **Mobile:** 
  - Tek sütun, karakter kartları alt alta
  - Upload area daha küçük (min-height 180px)
  - Butonlar full-width
- **Desktop:**
  - Karakter kartları daha geniş
  - Upload area daha büyük (min-height 200px)
  - Butonlar inline

---

## 📝 v0.app Prompt (Kopyala-Yapıştır)

```
Create a multi-character photo upload component for a children's book creation wizard (Step 2 of 6).

**Layout:**
- Progress indicator at top: "Step 2 of 6" with progress bar (33.33% filled, purple-pink gradient)
- Centered container (max-width 2xl) with white background and shadow
- Title: "Add Characters" / "Upload Character Photos" (2xl font-bold)

**Multi-Character System:**
1. **Character Cards (Vertical Stack):**
   - Minimum 1 character (default), maximum 3 characters
   - Each card has:
     - Header: Character number badge (Character 1, 2, 3) + Character type dropdown (Child, Dog, Cat, Rabbit, Teddy Bear, Other) + Remove button (X icon, only visible if 2+ characters)
     - Body: Upload area (drag & drop + file picker) OR Photo preview (if uploaded)
     - Footer: File info (filename, size) + AI Analysis button

2. **Upload Area (Per Character):**
   - Medium drop zone (min-height 200px desktop, 180px mobile)
   - Dashed border (purple-300, dark: purple-700)
   - Background: purple-50 (light), purple-900/20 (dark)
   - Hover: border solid, background darker
   - Active/drag-over: border purple-500, background purple-100
   - Content:
     - Upload icon (Lucide) - center
     - Title: "Upload [Character Type] Photo" (dynamic based on type)
     - Subtitle: "or click to browse"
     - File requirements: "JPG, PNG up to 5MB"
     - "Choose File" button (centered, gradient)

3. **Photo Preview (Per Character):**
   - After upload: Centered image (max-width 300px, rounded-lg, shadow)
   - "Remove" button (top-right, X icon)
   - File info below image (filename, size)

4. **AI Analysis (Per Character):**
   - Card with gradient border (purple-pink)
   - "Analyze Photo" button (Brain icon, gradient button)
   - Loading state: Animated spinner
   - Results: Grid layout showing analysis (hair length, style, face shape, etc.)

5. **Add Character Button:**
   - Position: Below character list
   - Visibility: Only if less than 3 characters
   - Design: Outlined button with Plus icon
   - Text: "Add Character" / "Add Another Character"
   - Disabled: If 3 characters (gray, disabled)

6. **Character Type Dropdown:**
   - Options: Child, Dog, Cat, Rabbit, Teddy Bear, Other
   - Position: Header of each character card
   - Default: "Child"

7. **Remove Character:**
   - X button in header (only visible if 2+ characters)
   - First character cannot be removed
   - Confirmation: Simple alert or toast

**Functionality:**
- Drag & drop support for each character
- File validation (JPG/PNG, max 5MB per file)
- Each character can have separate AI analysis
- Character type affects upload label text
- State management: Array of characters with id, type, photo, previewUrl, analysisResult

**Animations (Framer Motion):**
- Character card add: Fade-in + slide-up
- Character card remove: Fade-out + slide-down
- Photo upload: Fade-in + scale (0.9 to 1.0)
- AI analysis: Loading spinner, results fade-in
- Smooth transitions (0.3s - 0.6s, ease-in-out)

**Validation:**
- Minimum 1 character required
- Maximum 3 characters
- Each photo must be valid (format, size)
- Character type must be selected

**Responsive:**
- Mobile: Single column, cards stacked, buttons full-width
- Desktop: Wider cards, inline buttons

**Navigation:**
- "Back" button (Step 1)
- "Next" button (Step 3) - disabled if no photos uploaded

**Styling:**
- Use Tailwind CSS
- Use shadcn/ui components (Card, Button, Input, Select, Badge)
- Purple-pink gradient theme (purple-500, pink-500)
- Dark mode support
- Children-friendly aesthetic (rounded corners, soft colors)
```

---

## 🔄 Mevcut Kod ile Entegrasyon

### State Yapısı
```typescript
type Character = {
  id: string
  type: 'child' | 'dog' | 'cat' | 'rabbit' | 'teddy-bear' | 'other'
  customType?: string // if type is 'other'
  photo: File | null
  previewUrl: string | null
  analysisResult: AnalysisResult | null
  isAnalyzing: boolean
}

type AnalysisResult = {
  hairLength?: string
  hairStyle?: string
  hairTexture?: string
  faceShape?: string
  eyeShape?: string
  skinTone?: string
  // ... other analysis fields
}
```

### Form Data Yapısı
Wizard'ın sonunda (Step 6), tüm karakterler bir array olarak gönderilmeli:
```typescript
{
  characters: [
    {
      id: 'char-1',
      type: 'child',
      name: 'Arya', // Step 1'den gelecek (ilk karakter için)
      age: 5,
      gender: 'girl',
      // ... other Step 1 fields
      photo: File,
      analysisResult: {...}
    },
    {
      id: 'char-2',
      type: 'dog',
      photo: File,
      analysisResult: {...}
    }
  ]
}
```

### Step 1 Entegrasyonu
- Step 1'deki form sadece **ilk karakter** (Character 1) için olacak
- Step 2'de eklenen diğer karakterler için sadece fotoğraf yeterli (isim, yaş, vb. gerekmez, sadece tip seçimi)

### Step 6 Entegrasyonu
- Step 6'da tüm karakterlerin preview'ı gösterilmeli
- Her karakter için ayrı preview card
- Character type badge ile gösterim

---

## ✅ Tamamlanma Kriterleri

- [ ] v0.app'den component alındı
- [ ] Projeye entegre edildi (`app/create/step2/page.tsx`)
- [ ] State management çalışıyor (characters array)
- [ ] File upload çalışıyor (her karakter için)
- [ ] Photo preview çalışıyor
- [ ] Add Character butonu çalışıyor (max 3)
- [ ] Remove Character butonu çalışıyor (min 1)
- [ ] Character type dropdown çalışıyor
- [ ] Validation çalışıyor (min 1, max 3, file format/size)
- [ ] AI Analysis butonu çalışıyor (her karakter için ayrı)
- [ ] Responsive tasarım çalışıyor
- [ ] Dark mode çalışıyor
- [ ] Animations çalışıyor (Framer Motion)
- [ ] Step 1 ile entegrasyon (ilk karakter bilgileri)
- [ ] Step 6 ile entegrasyon (tüm karakterler preview)
- [ ] Form data wizard context'e kaydediliyor

---

**Not:** Bu component mevcut Step 2 component'ini tamamen değiştirecek veya genişletecek. v0.app'den aldıktan sonra mevcut kod ile merge etmek gerekebilir.

