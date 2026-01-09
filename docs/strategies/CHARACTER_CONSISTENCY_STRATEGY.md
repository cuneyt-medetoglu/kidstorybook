# 🎨 Character Consistency Strategy

**Created:** 10 Ocak 2026  
**Status:** ✅ Active  
**Owner:** @prompt-manager

---

## 🎯 Problem Statement

Kullanıcı bir çocuğun fotoğrafını yükleyip birden fazla kitap oluşturduğunda:
- ❌ Her kitapta farklı karakter görünümü (tutarsızlık)
- ❌ Her seferinde yeni analiz (maliyet)
- ❌ Kullanıcı her defasında fotoğraf yüklemek zorunda (UX)

**Hedef:** Aynı karakterin tüm kitaplarda tutarlı görünmesi.

---

## 🔑 Core Concept: Master Character

### 1. Fotoğraf Yükleme (İlk Kez)
```
User uploads photo
      ↓
AI analyzes photo (OpenAI Vision API)
      ↓
Creates detailed "Master Character Description"
      ↓
Saves to database (characters table)
      ↓
User's character library
```

### 2. İlk Kitap Oluşturma
```
User creates Book 1
      ↓
Uses Master Character
      ↓
Generates story with character
      ↓
Generates images (DALL-E 3) with Master Character description
      ↓
Character looks same in all pages
```

### 3. İkinci Kitap Oluşturma
```
User creates Book 2
      ↓
Selects existing Master Character (OR creates new one)
      ↓
Uses SAME Master Character description
      ↓
Generates images with EXTRA consistency emphasis
      ↓
Character looks EXACTLY like in Book 1
```

---

## 📊 Database Schema

### Characters Table
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Basic Info
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(20) NOT NULL,
  
  -- Reference Photo
  reference_photo_url TEXT,
  reference_photo_analysis JSONB, -- Raw AI analysis
  
  -- Master Description (THE MOST IMPORTANT)
  description JSONB NOT NULL, -- Detailed character description
  
  -- Metadata
  is_default BOOLEAN DEFAULT FALSE, -- User's primary character
  used_in_books TEXT[] DEFAULT '{}', -- Array of book IDs
  total_books INTEGER DEFAULT 0,
  
  -- Version Control
  version INTEGER DEFAULT 1,
  previous_versions JSONB, -- History of changes
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_user_default UNIQUE (user_id, is_default) WHERE is_default = TRUE
);

-- Index for quick lookup
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_default ON characters(user_id, is_default) WHERE is_default = TRUE;
```

### Character Description JSON Structure
```typescript
{
  "version": "1.0.0",
  "characterId": "char_xxx",
  "name": "Arya",
  "age": 5,
  "gender": "girl",
  
  "physicalFeatures": {
    "faceShape": "round",
    "skinTone": "light tan",
    "eyeColor": "dark brown",
    "eyeShape": "almond-shaped",
    "eyebrowStyle": "naturally arched",
    "nose": "small button nose",
    "mouth": "small with full lips",
    "cheeks": "rosy with dimples when smiling"
  },
  
  "hair": {
    "color": "dark brown",
    "style": "straight",
    "length": "shoulder-length",
    "texture": "thick and silky",
    "hasBangs": true,
    "bangsStyle": "side-swept"
  },
  
  "body": {
    "heightForAge": "average",
    "build": "slim",
    "posture": "confident and energetic"
  },
  
  "uniqueFeatures": [
    "small dimples when smiling",
    "freckles on nose",
    "always wears colorful hair clips"
  ],
  
  "expression": {
    "typical": "cheerful and curious",
    "personality": "adventurous, kind, playful"
  },
  
  "clothingStyle": {
    "style": "casual and comfortable",
    "colors": ["purple", "pink", "turquoise"],
    "commonItems": ["t-shirts with patterns", "comfortable pants", "sneakers"]
  },
  
  "illustrationNotes": "Always draw with the same round face shape, dark brown shoulder-length hair, and cheerful expression. Her dimples should show when she smiles. Keep clothing colorful but practical for adventures.",
  
  "confidence": 0.92,
  "analyzedFrom": "reference_photo_url"
}
```

---

## 🔄 User Flow

### Scenario 1: New User, First Book

```
1. User signs up
2. Goes to "Create Book" wizard
3. Step 1: Character Information
   └─ Enters: Name, Age, Gender
4. Step 2: Upload Photo
   └─ Uploads child's photo
   └─ [BACKEND] Photo analyzed (OpenAI Vision)
   └─ [BACKEND] Master Character created in DB
   └─ [FRONTEND] Shows preview: "We've created Arya's character profile!"
5. Continues with theme, style, etc.
6. Book generated using Master Character
7. User sees: "Arya's character has been saved for future books!"
```

### Scenario 2: Existing User, Second Book

```
1. User goes to "Create Book" wizard
2. Step 1: Select Character
   ├─ Option A: Use existing character (Arya) ✅ RECOMMENDED
   └─ Option B: Create new character
3. User selects "Arya" (existing)
4. System loads Master Character from DB
5. Book generated with SAME character
6. Character in Book 2 looks EXACTLY like Book 1
```

### Scenario 3: Multiple Children

```
User has 2 children:
├─ Character 1: "Arya" (5 years old) - 3 books
└─ Character 2: "Emir" (7 years old) - 2 books

When creating new book:
├─ "Which character?"
├─ ○ Arya (Used in 3 books)
├─ ○ Emir (Used in 2 books)
└─ ○ Create new character
```

---

## 🎨 Image Generation Strategy

### For First Book (Pages 1-12)

```typescript
// Page 1
const prompt = `
${illustrationStyle} illustration of ${masterCharacter.description.detailed},
${scene.description},
${lighting}, ${mood}, ${ageAppropriateRules},
professional children's book illustration,
high quality, detailed character, consistent design
`

// Pages 2-12: SAME character description
// Character description never changes within a book
```

### For Second Book (Pages 1-12)

```typescript
// Extra emphasis on consistency
const prompt = `
${illustrationStyle} illustration of ${masterCharacter.description.detailed},
IMPORTANT: Same character as in previous book,
consistent with prior ${previousBookCount} books,
identical character appearance,
${scene.description},
${lighting}, ${mood}, ${ageAppropriateRules},
professional children's book illustration
`

// Optional: Include reference images from Book 1
// DALL-E 3 supports image references for consistency
```

---

## 🔧 Implementation

### API Endpoints

#### 1. Character Analysis
```
POST /api/characters/analyze
Input: { photoUrl, name, age, gender, additionalDetails }
Output: { characterId, description, confidence }
```

#### 2. Character Library
```
GET /api/characters
Output: [ { id, name, age, description, usedInBooks, isDefault } ]
```

#### 3. Character Detail
```
GET /api/characters/:id
Output: { full character details }
```

#### 4. Update Character
```
PATCH /api/characters/:id
Input: { updates }
Output: { updated character, new version created }
```

#### 5. Set Default Character
```
POST /api/characters/:id/set-default
```

---

## 💡 Advanced Features

### 1. Character Evolution (Future)
```
User: "Arya is now 7 years old"
System: 
  - Creates Character v2
  - Keeps v1 for existing books
  - New books use v2
```

### 2. Character Comparison (Future)
```
Show side-by-side:
├─ Reference photo
├─ Book 1, Page 1
├─ Book 2, Page 1
└─ Book 3, Page 1
Status: ✅ Consistent / ⚠️ Needs adjustment
```

### 3. Character Export (Future)
```
Download character card:
├─ All details
├─ Sample images
└─ Prompt template
```

### 4. Family Characters (Future)
```
Link characters as family:
├─ Arya (daughter)
├─ Emir (son)
└─ Generate books with multiple family members
```

---

## 📈 Success Metrics

### Consistency Score
```
For each book:
1. User rates character consistency (1-5 ⭐)
2. Compare facial features across pages (AI)
3. Calculate consistency score

Goal: >4.5⭐ average consistency rating
```

### User Satisfaction
```
Survey question: 
"Did the character look the same across all your books?"
Goal: >90% say "Yes, perfectly consistent"
```

### Cost Optimization
```
First book: 1x photo analysis + N images
Second book: 0x photo analysis + N images
Savings: ~$0.20 per book (Vision API cost)
```

---

## 🚨 Edge Cases

### 1. Character Changes Over Time
```
Problem: Child grows up, looks different
Solution: 
  - Prompt user to update after 1 year
  - Create Character v2
  - Keep v1 for old books
```

### 2. Photo Quality Issues
```
Problem: Blurry or unclear photo
Solution:
  - Show confidence score
  - If <0.7, suggest better photo
  - Allow manual adjustments
```

### 3. Multiple Characters in One Book
```
Problem: User wants friend/sibling in story
Solution: (Phase 2)
  - Support secondary characters
  - Each with own Master Character
  - Combine in prompts
```

---

## 📝 Next Steps

- [x] Character analysis prompt (v1.0.0)
- [x] Character consistency strategy documented
- [ ] Implement characters table in Supabase
- [ ] Create character analysis API
- [ ] Build character library UI
- [ ] Test consistency across multiple books
- [ ] Collect user feedback

---

**Owner:** @prompt-manager  
**Stakeholders:** @project-manager, @architecture-manager  
**Last Updated:** 10 Ocak 2026

