# 👶 Karakter Oluşturma Akışı
# KidStoryBook Platform

**Doküman Versiyonu:** 1.1  
**Tarih:** 4 Ocak 2026 | **Güncelleme:** 2026-03-01 (OpenAI Vision kaldırıldı)

---

## ⚠️ Güncel Davranış (2026-03-01)

Karakter oluşturma artık **OpenAI Vision kullanmıyor**. Tüm karakter tipleri (Child, Family Members, Pets) aynı pipeline ile oluşturulur: **form verisi** (name, age, gender, hairColor, eyeColor) + **referans fotoğraf**. Referans fotoğraf doğrudan görsel üretiminde (master illüstrasyon, kapak, sayfalar) kullanılır. Detay: `docs/analysis/VISION_ANALYSIS_NECESSITY.md`.

---

## 📋 Genel Bakış

Karakter oluşturma, kullanıcı girdileri ve AI analizi birleştirilerek yapılır. Bu yaklaşım, karakter tutarlılığını maksimize eder.

---

## 🔄 İş Akışı

### Adım 1: Kullanıcı Girdileri

Kullanıcı manuel olarak şu bilgileri girer:

1. **Çocuğun Adı** (text input)
   - Örnek: "Elif"

2. **Yaş** (number input, 0-12)
   - Örnek: 5

3. **Cinsiyet** (radio button)
   - Seçenekler: "Erkek" / "Kız"

4. **Saç Rengi** (dropdown)
   - Seçenekler: Açık Kumral, Kumral, Koyu Kumral, Siyah, Kahverengi, Kızıl

5. **Göz Rengi** (dropdown)
   - Seçenekler: Mavi, Yeşil, Kahverengi, Siyah, Ela

6. **Özel Özellikler** (checkbox - çoklu seçim)
   - Seçenekler: gözlüklü, çilli, dimples, vb.

### Adım 2: Referans Görsel Yükleme

Kullanıcı çocuğun fotoğrafını yükler:

1. **Fotoğraf Yükleme**
   - Drag & drop veya file picker
   - Format: JPG, PNG
   - Maksimum boyut: 5MB

2. **Fotoğraf Önizleme**
   - Yüklenen fotoğrafı göster
   - Kırpma/crop seçeneği (opsiyonel)

3. **"Fotoğrafı Analiz Et" Butonu**
   - Kullanıcı butona tıklar
   - AI fotoğrafı analiz eder

### Adım 3: Karakter Açıklaması (Form + Referans Görsel)

**Güncel (2026-03-01):** AI fotoğraf analizi (Vision) kullanılmıyor. Açıklama yalnızca kullanıcı girdilerinden (Adım 1) ve yaşa göre varsayılanlardan oluşturulur. Referans görsel, görsel üretiminde doğrudan kullanılır.

~~Eski davranış (referans): AI (GPT-4 Vision) fotoğrafı analiz ederdi.~~

### Adım 4: Birleştirilmiş Karakter Tanımı

Kullanıcı girdileri + AI analizi birleştirilir:

```typescript
interface CharacterDescription {
  // Kullanıcı Girdileri
  name: "Elif";
  age: 5;
  gender: "girl";
  hairColor: "Kahverengi";  // Kullanıcı seçimi
  eyeColor: "Yeşil";        // Kullanıcı seçimi
  features: ["gözlüklü"];   // Kullanıcı seçimi
  
  // AI Analizi (Fotoğraftan)
  aiAnalysis: {
    hairLength: "long";      // AI analizi - KRİTİK
    hairStyle: "curly";      // AI analizi - KRİTİK
    hairTexture: "fine, soft curls";
    faceShape: "round";
    eyeShape: "almond";
    skinTone: "light";
    bodyProportions: "typical for 5-year-old";
  };
  
  // Birleştirilmiş Tanım (Prompt için)
  fullDescription: "5-year-old girl named Elif with long brown curly hair (fine, soft curls), green eyes, wearing round glasses, round face, almond-shaped eyes, light skin tone, typical body proportions for a 5-year-old";
}
```

### Adım 5: Karakter Tanımı Kullanımı

Birleştirilmiş karakter tanımı şu şekillerde kullanılır:

1. **Hikaye Üretimi:**
   - Karakter adı, yaş, cinsiyet hikayede kullanılır
   - Fiziksel özellikler hikaye metninde geçer

2. **Görsel Üretimi:**
   - Referans görsel + birleştirilmiş tanım kullanılır
   - Her görselde aynı karakter tanımı kullanılır
   - **Saç uzunluğu ve stili her görselde aynı olmalı**

---

## 🎯 Kritik Noktalar

### Saç Uzunluğu ve Stili
- **En önemli detay:** Saç uzunluğu ve stili
- AI'ın en çok hata yaptığı nokta
- Fotoğraftan kesin analiz edilmeli
- Her görsel prompt'unda aynı bilgi kullanılmalı

### Kullanıcı Girdileri vs AI Analizi
- Kullanıcı girdileri: Genel bilgiler (saç rengi, göz rengi)
- AI analizi: Detaylı bilgiler (saç uzunluğu, stili, dokusu)
- İkisi birleştirilerek en doğru tanım oluşturulur

### Referans Görsel
- Her karakter için 1 referans görsel
- Supabase Storage'da saklanır
- Görsel üretiminde kullanılır (reference image olarak)

---

## 📊 Database Şeması

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  
  -- Kullanıcı Girdileri
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('boy', 'girl')),
  hair_color VARCHAR(50),
  eye_color VARCHAR(50),
  features TEXT[],
  
  -- Referans Görsel
  reference_photo_url TEXT NOT NULL,
  
  -- AI Analiz Sonuçları
  ai_analysis JSONB NOT NULL,
  
  -- Birleştirilmiş Tanım
  full_description TEXT NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 API Endpoints

### 1. Fotoğraf Yükleme
```
POST /api/characters/upload-photo
Content-Type: multipart/form-data

Body:
- photo: File (JPG/PNG, max 5MB)

Response:
{
  "success": true,
  "photoUrl": "https://storage.supabase.co/...",
  "message": "Fotoğraf yüklendi"
}
```

### 2. Fotoğraf Analizi
```
POST /api/characters/analyze-photo
Content-Type: application/json

Body:
{
  "photoUrl": "https://storage.supabase.co/...",
  "userInputs": {
    "name": "Elif",
    "age": 5,
    "gender": "girl",
    "hairColor": "Kahverengi",
    "eyeColor": "Yeşil",
    "features": ["gözlüklü"]
  }
}

Response:
{
  "success": true,
  "aiAnalysis": {
    "hairLength": "long",
    "hairStyle": "curly",
    "hairTexture": "fine, soft curls",
    "faceShape": "round",
    "eyeShape": "almond",
    "skinTone": "light",
    "bodyProportions": "typical for 5-year-old"
  },
  "fullDescription": "5-year-old girl named Elif with long brown curly hair...",
  "verified": {
    "hairColor": true,  // Kullanıcı girdisi doğru mu?
    "eyeColor": true
  }
}
```

### 3. Karakter Oluşturma
```
POST /api/characters
Content-Type: application/json

Body:
{
  "name": "Elif",
  "age": 5,
  "gender": "girl",
  "hairColor": "Kahverengi",
  "eyeColor": "Yeşil",
  "features": ["gözlüklü"],
  "referencePhotoUrl": "https://storage.supabase.co/...",
  "aiAnalysis": { ... },
  "fullDescription": "..."
}

Response:
{
  "success": true,
  "character": {
    "id": "uuid",
    ...
  }
}
```

---

## 🎨 UI/UX Notları

### Wizard Adımları
1. **Step 1:** Karakter bilgileri formu (kullanıcı girdileri)
2. **Step 2:** Referans görsel yükleme
   - Fotoğraf yükle
   - "Analiz Et" butonu
   - Analiz sonuçları gösterimi (saç uzunluğu, stili, vb.)
3. **Step 3:** Önizleme ve onay
   - Birleştirilmiş karakter tanımı özeti
   - Referans görsel önizleme

### Analiz Sonuçları Gösterimi
- Saç uzunluğu: "Uzun saç" badge
- Saç stili: "Kıvırcık saç" badge
- Diğer detaylar: Liste halinde göster
- Kullanıcı girdileri doğrulama: "✓ Saç rengi doğru" / "⚠ Göz rengi farklı olabilir"

---

## 📝 Prompt Örneği

### Görsel Üretimi İçin Prompt

```
Create a children's book illustration:

Character: ${fullDescription}
Reference photo: ${referencePhotoUrl}

CRITICAL DETAILS (must match exactly):
- Hair length: ${aiAnalysis.hairLength} (${aiAnalysis.hairTexture})
- Hair style: ${aiAnalysis.hairStyle}
- Eye color: ${eyeColor}
- Face shape: ${aiAnalysis.faceShape}
- Skin tone: ${aiAnalysis.skinTone}

The character must look EXACTLY like the reference photo, especially:
- Same hair length (${aiAnalysis.hairLength})
- Same hair style (${aiAnalysis.hairStyle})
- Same facial features

Style: ${illustrationStyle}
```

---

**Son Güncelleme:** 4 Ocak 2026

