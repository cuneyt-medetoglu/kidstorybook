## 🔌 KidStoryBook API Documentation

**Last Updated:** 10 Ocak 2026  
**Base URL:** `https://yourdomain.com/api` (or `http://localhost:3001/api` for development)  
**Authentication:** Supabase JWT (passed via cookies or Authorization header)

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Characters API](#characters-api)
3. [AI Generation API](#ai-generation-api)
4. [Books API](#books-api)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication

All API endpoints require authentication via Supabase.

**Authentication Methods:**
1. **Session Cookie** (default for web app)
2. **Authorization Header:** `Authorization: Bearer <jwt_token>`

**Unauthorized Response:**
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Please login to continue",
  "statusCode": 401
}
```

---

## 🎭 Characters API

### 1. Analyze Character Photo

**Endpoint:** `POST /api/characters/analyze`

**Description:** Analyzes a reference photo and creates a master character description.

**Request Body:**
```json
{
  "photoUrl": "https://example.com/photo.jpg", // OR photoBase64
  "photoBase64": "base64_encoded_image_string",
  "name": "Arya",
  "age": 5,
  "gender": "girl",
  "additionalDetails": "Loves purple colors"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "character": {
    "id": "uuid",
    "name": "Arya",
    "age": 5,
    "gender": "girl",
    "description": { /* Detailed character features */ },
    "confidence": 0.92
  },
  "message": "Character analyzed successfully"
}
```

**Cost:** ~$0.01-0.02 per analysis (OpenAI Vision API)

---

### 2. List User's Characters

**Endpoint:** `GET /api/characters`

**Success Response (200):**
```json
{
  "success": true,
  "characters": [
    {
      "id": "uuid",
      "name": "Arya",
      "age": 5,
      "gender": "girl",
      "description": { /* Full description */ },
      "is_default": true,
      "total_books": 3,
      "used_in_books": ["book-id-1", "book-id-2"],
      "created_at": "2026-01-10T10:00:00Z"
    }
  ]
}
```

---

### 3. Get Character Details

**Endpoint:** `GET /api/characters/:id`

**Success Response (200):**
```json
{
  "success": true,
  "character": {
    "id": "uuid",
    "name": "Arya",
    "description": { /* Full description */ },
    /* ... all fields */
  }
}
```

---

### 4. Update Character

**Endpoint:** `PATCH /api/characters/:id`

**Request Body:**
```json
{
  "name": "Arya Updated",
  "age": 6,
  "description": { /* Updated description */ },
  "isDefault": true
}
```

---

### 5. Delete Character

**Endpoint:** `DELETE /api/characters/:id`

**Note:** Cannot delete if character is used in books.

---

### 6. Set Default Character

**Endpoint:** `POST /api/characters/:id/set-default`

---

## 🤖 AI Generation API

### 1. Generate Story

**Endpoint:** `POST /api/ai/generate-story`

**Description:** Generates a complete children's story with image prompts.

**Request Body:**
```json
{
  "characterId": "uuid",
  "theme": "adventure",
  "illustrationStyle": "watercolor",
  "customRequests": "Include a friendly dog character",
  "language": "en"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "storyId": "uuid",
    "title": "Arya's Magical Adventure",
    "pages": [
      {
        "pageNumber": 1,
        "text": "Once upon a time...",
        "imagePrompt": "Watercolor illustration of Arya...",
        "sceneDescription": "Arya standing in a magical forest"
      }
      // ... more pages
    ],
    "metadata": {
      "ageGroup": "preschool",
      "theme": "adventure",
      "totalPages": 10,
      "readingTime": 20,
      "educationalThemes": ["courage", "friendship"]
    },
    "character": {
      "id": "uuid",
      "name": "Arya"
    },
    "generationTime": 5234,
    "tokensUsed": 2847
  },
  "message": "Story generated successfully",
  "metadata": {
    "cost": "~$0.0142",
    "characterUsage": 4
  }
}
```

**Generation Time:** 5-15 seconds  
**Cost:** ~$0.01-0.03 per story (GPT-4o)

---

### 2. Generate Images

**Endpoint:** `POST /api/ai/generate-images`

**Description:** Generates all illustrations for a book using DALL-E 3.

**Request Body:**
```json
{
  "bookId": "uuid",
  "startPage": 1,
  "endPage": 10
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookId": "uuid",
    "title": "Arya's Magical Adventure",
    "imagesGenerated": 10,
    "totalPages": 10,
    "images": [
      {
        "pageNumber": 1,
        "imageUrl": "https://storage.supabase.co/...",
        "storagePath": "book-id/page-1.png",
        "prompt": "Watercolor illustration...",
        "revisedPrompt": "DALL-E's revised prompt"
      }
      // ... more images
    ],
    "generationTime": 95432,
    "totalCost": 0.40
  },
  "message": "All images generated successfully",
  "metadata": {
    "status": "completed",
    "cost": "$0.40",
    "averageTimePerImage": "9.5s"
  }
}
```

**Generation Time:** ~10s per image (100s for 10 pages)  
**Cost:** $0.04 per image (DALL-E 3 standard)

---

### 3. Get Generation Status

**Endpoint:** `GET /api/ai/generate-images?bookId=uuid`

**Description:** Check image generation progress (for long-running generations).

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookId": "uuid",
    "status": "generating",
    "imagesGenerated": 5,
    "totalPages": 10,
    "progress": 50
  }
}
```

---

## 📚 Books API

### Coming Soon
- `GET /api/books` - List user's books
- `GET /api/books/:id` - Get book details
- `PATCH /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `POST /api/books/:id/favorite` - Toggle favorite

---

## ⚠️ Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error description",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized (wrong user) |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `VALIDATION_ERROR` | 422 | Validation failed |
| `RATE_LIMIT` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service down |

---

## 🚦 Rate Limiting

**Coming Soon**

Current limits (planned):
- **Character Analysis:** 10 per hour
- **Story Generation:** 5 per hour
- **Image Generation:** 3 per hour

---

## 💰 Cost Breakdown

| Operation | Cost | Time |
|-----------|------|------|
| Character Analysis | $0.01-0.02 | 2-3s |
| Story Generation | $0.01-0.03 | 5-15s |
| Image Generation (per image) | $0.04 | ~10s |
| **Full Book (10 pages)** | **~$0.45** | **~2 minutes** |

**Reusing Characters saves ~$0.02 per book!**

---

## 📊 Usage Examples

### Frontend: Create Full Book

```typescript
// 1. Analyze photo (first time only)
const character = await fetch('/api/characters/analyze', {
  method: 'POST',
  body: JSON.stringify({
    photoUrl: userPhoto,
    name: 'Arya',
    age: 5,
    gender: 'girl'
  })
}).then(r => r.json())

// 2. Generate story
const story = await fetch('/api/ai/generate-story', {
  method: 'POST',
  body: JSON.stringify({
    characterId: character.character.id,
    theme: 'adventure',
    illustrationStyle: 'watercolor',
    language: 'en'
  })
}).then(r => r.json())

// 3. Generate images
const images = await fetch('/api/ai/generate-images', {
  method: 'POST',
  body: JSON.stringify({
    bookId: story.data.storyId
  })
}).then(r => r.json())

// 4. Done! Book ready at /books/[storyId]/view
```

---

**Owner:** @project-manager  
**Related:** `docs/database/SCHEMA.md`, `docs/strategies/CHARACTER_CONSISTENCY_STRATEGY.md`

