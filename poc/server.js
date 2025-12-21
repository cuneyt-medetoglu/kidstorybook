const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// AI Clients
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Tema çevirileri
const themeTranslations = {
    tr: {
        adventure: 'Macera',
        fairy_tale: 'Peri Masalı',
        educational: 'Eğitici',
        nature: 'Doğa ve Hayvanlar',
        space: 'Uzay ve Bilim',
        sports: 'Spor ve Aktiviteler'
    },
    en: {
        adventure: 'Adventure',
        fairy_tale: 'Fairy Tale',
        educational: 'Educational',
        nature: 'Nature and Animals',
        space: 'Space and Science',
        sports: 'Sports and Activities'
    }
};

// Illustration style açıklamaları
const styleDescriptions = {
    tr: {
        '3d': '3D Animation - Pixar/DreamWorks tarzı 3D animasyon, çizgi film benzeri ve stilize (fotoğraf gerçekçi DEĞİL), canlı doygun renkler, yuvarlak şekiller, abartılı özellikler, çocuk animasyon filmi estetiği',
        geometric: 'Geometric - Basitleştirilmiş geometrik şekiller, düz renkler, keskin kenarlar, modern ve stilize illustration',
        watercolor: 'Watercolor (sulu boya) - Yumuşak, şeffaf görünüm, görünür fırça darbeleri, karışan kenarlar, pastel renkler, el yapımı hissi',
        gouache: 'Gouache - Opak, canlı renkler, mat bitiş, belirgin fırça darbeleri, zengin ve doygun renkler, illustration tarzı',
        'picture-book': 'Picture-Book - Sıcak, hafif dokulu, davetkar çocuk kitabı illüstrasyonu, yumuşak parıltı, stilize ama net detaylar',
        'block-world': 'Block World - Pixelated veya bloklu estetik, Minecraft benzeri, bloklardan oluşan karakterler ve çevre, illustration tarzı',
        'soft-anime': 'Soft Anime - Büyük, ifadeli gözler, narin özellikler, yumuşak gölgelendirme, pastel renkler, anime tarzı illustration',
        collage: 'Collage - Kesilmiş parçalardan oluşan, farklı katmanlar ve dokular, görünür kenarlar veya gölgeler, canlı renkler, illustration',
        'clay-animation': 'Clay Animation - Kil görünümü, dokulu, hafif pürüzlü, el yapımı görünüm, yumuşak yuvarlak gölgeler, illustration',
        kawaii: 'Kawaii - Abartılı sevimlilik, büyük parıldayan gözler, basitleştirilmiş yuvarlak özellikler, parlak neşeli renkler, illustration',
        'comic-book': 'Comic Book - Cesur çizgiler, nispeten düz renkler, güçlü dramatik gölgeler, çizgi roman tarzı illustration',
        'sticker-art': 'Sticker Art - Temiz çizgiler, parlak yüksek doygun renkler, cilalı grafik görünüm, çıkartma benzeri illustration'
    },
    en: {
        '3d': '3D Animation - Pixar/DreamWorks-style 3D animation, cartoonish and stylized (NOT photorealistic), vibrant saturated colors, rounded shapes, exaggerated features, children\'s animated movie aesthetic',
        geometric: 'Geometric - Simplified geometric shapes, flat colors, sharp distinct edges, modern and stylized illustration style',
        watercolor: 'Watercolor - Soft, translucent appearance, visible brushstrokes, blended edges, muted flowing colors, hand-painted illustration feel',
        gouache: 'Gouache - Opaque, vibrant colors, matte finish, distinct visible brushstrokes, rich saturated colors, illustration style',
        'picture-book': 'Picture-Book - Warm, slightly textured, inviting children\'s picture book illustration, soft glow, stylized but clear details',
        'block-world': 'Block World - Pixelated or blocky aesthetic, Minecraft-like, characters and environment constructed from visible blocks, illustration style',
        'soft-anime': 'Soft Anime - Large expressive eyes, delicate features, soft shading, pastel colors, anime-style illustration',
        collage: 'Collage - Made from cut-out pieces, distinct layers and varied textures, visible edges or shadows, vibrant colors, illustration',
        'clay-animation': 'Clay Animation - Clay-like appearance, textured, slightly lumpy, hand-molded look, soft rounded shadows, illustration',
        kawaii: 'Kawaii - Exaggerated cuteness, large sparkling eyes, simplified rounded features, bright cheerful colors, illustration',
        'comic-book': 'Comic Book - Bold outlines, relatively flat colors, strong dramatic shadows, comic book style illustration',
        'sticker-art': 'Sticker Art - Clean lines, bright highly saturated colors, polished graphic appearance, sticker-like illustration'
    }
};

// Yaş grubu kelime sayıları
const wordCounts = {
    '0-2': { min: 20, max: 30 },
    '3-5': { min: 40, max: 60 },
    '6-9': { min: 60, max: 100 }
};

// Saç ve göz rengi çevirileri (image prompt'lar için İngilizce)
const colorTranslations = {
    'Açık Kumral': 'light blonde',
    'Kumral': 'blonde',
    'Koyu Kumral': 'dark blonde',
    'Siyah': 'black',
    'Kahverengi': 'brown',
    'Kızıl': 'red',
    'Ela': 'hazel',
    'Yeşil': 'green',
    'Mavi': 'blue',
    'Kahverengi': 'brown',
    'Siyah': 'black'
};

// Karakter özelliklerini İngilizce'ye çevir (image prompt için)
function translateCharacterFeaturesForImage(data) {
    let features = '';
    
    // Saç rengi
    if (data.hairColor) {
        const hairColorEn = colorTranslations[data.hairColor] || data.hairColor.toLowerCase();
        features += `${hairColorEn} hair`;
    }
    
    // Göz rengi
    if (data.eyeColor) {
        const eyeColorEn = colorTranslations[data.eyeColor] || data.eyeColor.toLowerCase();
        if (features) features += ', ';
        features += `${eyeColorEn} eyes`;
    }
    
    // Özel özellikler
    if (data.features && data.features.length > 0) {
        const featureTranslations = {
            'gözlüklü': 'wearing glasses',
            'çilli': 'with freckles'
        };
        const translatedFeatures = data.features.map(f => featureTranslations[f] || f).join(', ');
        if (features) features += ', ';
        features += translatedFeatures;
    }
    
    return features || 'standard appearance';
}

// String escape fonksiyonu (JSON için)
function escapeForJson(str) {
    if (!str) return '';
    if (typeof str !== 'string') {
        str = String(str);
    }
    return str
        .replace(/\\/g, '\\\\')  // \ -> \\
        .replace(/"/g, '\\"')     // " -> \"
        .replace(/\n/g, '\\n')    // newline -> \n
        .replace(/\r/g, '\\r')    // carriage return -> \r
        .replace(/\t/g, '\\t');   // tab -> \t
}

// String escape fonksiyonu (Template Literal için - ${} içinde kullanılacak)
function escapeForTemplateLiteral(str) {
    if (!str) return '';
    if (typeof str !== 'string') {
        str = String(str);
    }
    // Önce ters slash'ları escape et, sonra diğerlerini
    // Sıra önemli: önce \ sonra ${ sonra $ sonra `
    return str
        .replace(/\\/g, '\\\\')   // \ -> \\
        .replace(/\$\{/g, '\\${') // ${ -> \${ (template literal başlangıcı - önce bu!)
        .replace(/\$/g, '\\$')    // $ -> \$ (diğer $ karakterleri)
        .replace(/\`/g, '\\`');   // backtick -> \`
}

// Hikaye içeriği oluşturma fonksiyonu
async function createStoryContent(data, aiProvider = 'gpt') {
    const isTurkish = data.language === 'tr';
    const wordCount = wordCounts[data.ageGroup];
    const themeName = themeTranslations[data.language][data.theme];
    const styleDesc = styleDescriptions[data.language][data.illustrationStyle];
    
    // Karakter özellikleri string'i (story text için - dil seçimine göre)
    let characterFeatures = '';
    if (data.hairColor) characterFeatures += `${data.hairColor} saç, `;
    if (data.eyeColor) characterFeatures += `${data.eyeColor} gözler`;
    if (data.features.length > 0) {
        characterFeatures += (characterFeatures ? ', ' : '') + data.features.join(', ');
    }
    
    // Image prompt'lar için İngilizce karakter özellikleri
    const characterFeaturesForImage = translateCharacterFeaturesForImage(data);
    
    // Image prompt'lar için İngilizce tema ve stil
    const themeNameForImage = themeTranslations.en[data.theme] || themeName;
    const styleDescForImage = styleDescriptions.en[data.illustrationStyle] || styleDesc;
    
    // Prompt oluştur - HER ZAMAN İNGİLİZCE (AI daha iyi anlıyor)
    // Story content dilini belirt (Türkçe veya İngilizce)
    const storyLanguage = isTurkish ? 'Turkish' : 'English';
    const storyPrompt = `
You are a professional children's book author. You write personalized children's stories.

# TASK
Create a magical and engaging 10-page children's story.

# CHARACTER INFORMATION
- **Main Character:** ${data.characterName}, ${data.characterAge} years old, ${data.characterGender === 'boy' ? 'boy' : 'girl'}
  - Physical features (for story text): ${characterFeatures || 'standard appearance'}
  - Physical features (for image prompts - MUST be in English): ${characterFeaturesForImage}
  - Photo reference: The child in the uploaded photo

# STORY SETTINGS
- **Theme:** ${themeName} - ${data.subtheme}
- **Age Group:** ${data.ageGroup} years
- **Story Language:** ${storyLanguage} (IMPORTANT: Write the story text in ${storyLanguage}, but keep all instructions and image prompts in English)
- **Special Requests:** ${data.customRequests || 'None'}

# STORY REQUIREMENTS
1. Total length: 10 pages
2. Language complexity: Age-appropriate for ${data.ageGroup} age group
3. Tone: Warm, encouraging, magical, adventurous
4. Structure:
   - **Page 1: BOOK COVER** (CRITICAL: This must be designed as a book cover page)
     * Should include the book title prominently
     * Main character should be featured prominently and attractively
     * Should represent the theme and adventure
     * Should be visually striking and professional
     * Text can be minimal (title + subtitle or brief introduction)
   - Page 2: Introduction and story beginning
   - Pages 3-7: Adventure and challenges
   - Pages 8-9: Resolution and lessons learned
   - Page 10: Happy ending and closing
5. Positive values: Friendship, courage, curiosity, kindness

# FORMAT
Return as JSON:
{
  "title": "Book title in ${storyLanguage}",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page 1 text in ${storyLanguage} - This is the BOOK COVER page. Can be minimal (just title) or include a brief introduction (${wordCount.min}-${wordCount.max} words)",
      "imagePrompt": "BOOK COVER ILLUSTRATION (NOT a book mockup): Professional children's book cover illustration as a FLAT, STANDALONE ILLUSTRATION (NOT a 3D book object, NOT a book on a shelf, NOT a photograph of a physical book). The main character (${data.characterName}), a ${data.characterAge}-year-old ${data.characterGender === 'boy' ? 'boy' : 'girl'} with ${characterFeaturesForImage}, should be prominently featured in the center or foreground. CRITICAL: Match the exact hair length, style, and texture from the uploaded photo - if the photo shows short hair, show short hair; if long, show long; match the exact curl pattern and texture. IMPORTANT: The character should RESEMBLE the child in the photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering. The character should look like a stylized illustration that captures the child's features (hair color, eye color, face shape, etc.) but in the chosen illustration style. It should be clearly an illustration, not a photograph. Include elements representing the theme (${themeNameForImage} - ${data.subtheme}). The book title should be visible in the design (though you'll describe it, not add actual text). Use ${styleDescForImage} style. ${data.illustrationStyle === '3d' ? 'CRITICAL FOR 3D ANIMATION STYLE: This must be cartoonish and stylized like Pixar/DreamWorks animated movies - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, and a playful animated movie aesthetic. The character should look like a 3D animated cartoon character, not a real photograph.' : ''} Make it visually striking, colorful, and appealing to children. The cover should look professional and print-ready. DO NOT create a book mockup or 3D book object - create a flat illustration. CRITICAL: This image description must be entirely in English - no Turkish words allowed."
    },
    {
      "pageNumber": 2,
      "text": "Page 2 text in ${storyLanguage} (${wordCount.min}-${wordCount.max} words) - Story introduction",
      "imagePrompt": "Detailed visual description for this page as an ILLUSTRATION (NOT a photograph). The character (${data.characterName}) has ${characterFeaturesForImage}. CRITICAL: Match the exact hair length, style, and texture from the uploaded photo - if the photo shows short hair, show short hair; if long, show long; match the exact curl pattern and texture. IMPORTANT: The character should RESEMBLE the child in the photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering. The character should look like a stylized illustration that captures the child's features but in the chosen illustration style. It should be clearly an illustration, not a photograph. Theme: ${themeNameForImage} - ${data.subtheme}. Style: ${styleDescForImage}. ${data.illustrationStyle === '3d' ? 'CRITICAL FOR 3D ANIMATION STYLE: This must be cartoonish and stylized like Pixar/DreamWorks animated movies - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, and a playful animated movie aesthetic. The character should look like a 3D animated cartoon character, not a real photograph.' : ''} CRITICAL: This image description must be entirely in English - no Turkish words allowed."
    }
    // ... pages 3-10 follow the same pattern
  ],
  "moral": "The story's main message in ${storyLanguage}"
}

# IMPORTANT NOTES
- **Page 1 is the BOOK COVER**: Must be designed as a professional book cover with the main character prominently featured, theme elements, and the book title visible in the design
- Use the character's name (${data.characterName}) frequently in the story text
- Write story text in ${storyLanguage}, but image prompts must be in English
- Simple and rhythmic language appropriate for ${data.ageGroup} age group
- Page 1 can have minimal text (just title or brief intro), pages 2-10 should have ${wordCount.min}-${wordCount.max} words each
- Make visual descriptions detailed and specify ${styleDescForImage} style (in English)
- Maintain character consistency across all pages
- Make the story age-appropriate and engaging

Now create the story!
`;

    // AI Provider seçimi
    const provider = aiProvider || 'gpt';
    console.log(`🤖 AI Provider: ${provider.toUpperCase()}`);

    try {
        let response;
        
        if (provider === 'groq') {
            // Groq API
            console.log('📡 Groq API çağrısı yapılıyor...');
            response = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: isTurkish 
                            ? 'Sen profesyonel bir çocuk kitabı yazarısın. Her zaman JSON formatında yanıt ver. Sadece JSON döndür, başka açıklama yapma.'
                            : 'You are a professional children\'s book author. Always respond in JSON format. Return only JSON, no other explanation.'
                    },
                    {
                        role: 'user',
                        content: storyPrompt + '\n\nIMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, just pure JSON.'
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.8
            });
        } else {
            // OpenAI GPT API
            console.log('📡 OpenAI GPT API çağrısı yapılıyor...');
            response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional children\'s book author. Always respond in JSON format.'
                    },
                    {
                        role: 'user',
                        content: storyPrompt
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.8
            });
        }

        const storyContent = JSON.parse(response.choices[0].message.content);
        return storyContent;
    } catch (error) {
        console.error(`${provider.toUpperCase()} API Error:`, error);
        
        // Quota hatası için detaylı açıklama
        if (error.status === 429 || error.code === 'insufficient_quota') {
            const errorMsg = isTurkish 
                ? `API Kotası Tükendi (${provider.toUpperCase()})!\n\n` +
                  `Olası nedenler:\n` +
                  `1. OpenAI hesabında kredi yok (ücretsiz tier kullanıyorsanız)\n` +
                  `2. API key yanlış veya geçersiz\n` +
                  `3. Billing ayarları eksik\n\n` +
                  `Çözüm:\n` +
                  `- OpenAI: https://platform.openai.com/account/billing → Kredi ekle\n` +
                  `- Groq: https://console.groq.com/ → API key kontrolü\n` +
                  `- Alternatif: Diğer AI provider'ı deneyin (Groq/OpenAI)`
                : `API Quota Exceeded (${provider.toUpperCase()})!\n\n` +
                  `Possible reasons:\n` +
                  `1. No credits in OpenAI account (if using free tier)\n` +
                  `2. API key is wrong or invalid\n` +
                  `3. Billing settings missing\n\n` +
                  `Solution:\n` +
                  `- OpenAI: https://platform.openai.com/account/billing → Add credits\n` +
                  `- Groq: https://console.groq.com/ → Check API key\n` +
                  `- Alternative: Try other AI provider (Groq/OpenAI)`;
            
            throw new Error(errorMsg);
        }
        
        throw new Error(`Hikaye oluşturulurken hata oluştu (${provider}): ${error.message}`);
    }
}

// Final prompt oluşturma fonksiyonu - HER ZAMAN İNGİLİZCE
function createFinalPrompt(data, storyContent) {
    const isTurkish = data.language === 'tr';
    const storyLanguage = isTurkish ? 'Turkish' : 'English';
    // Image prompt'lar için İngilizce kullan
    const themeNameForImage = themeTranslations.en[data.theme] || themeTranslations[data.language][data.theme];
    const styleDescForImage = styleDescriptions.en[data.illustrationStyle] || styleDescriptions[data.language][data.illustrationStyle];
    const characterFeaturesForImage = translateCharacterFeaturesForImage(data);
    
    // Story content'i escape et (template literal için)
    const escapedTitle = escapeForTemplateLiteral(storyContent.title);
    const escapedMoral = escapeForTemplateLiteral(storyContent.moral);
    const escapedCharacterName = escapeForTemplateLiteral(data.characterName);
    const escapedSubtheme = escapeForTemplateLiteral(data.subtheme);
    
    // Final prompt HER ZAMAN İNGİLİZCE (AI daha iyi anlıyor)
    return `You are a professional children's book author and illustrator. You create personalized children's books.

# TASK
Analyze the child's photo provided below and create PAGE 1 (the book cover) for a children's book where this child is the hero. You will create the remaining pages later, one by one.

# PHOTO ANALYSIS
Please carefully analyze the uploaded child's photo with EXTREME ATTENTION TO DETAIL:
- Estimate the child's age (approximately)
- Determine gender
- **Hair color, length, and style** (CRITICAL: Match the exact hair length, texture, and style from the photo - short, medium, long, curly, straight, wavy, etc.)
- **Eye color** (exact shade)
- **Skin tone** (exact shade)
- **Facial features** (face shape, nose, mouth, cheeks)
- **Special features** (glasses, freckles, dimples, etc.)
- **Clothing** (if visible, exact colors and style)
- **Body proportions** (head size relative to body, etc.)
- **General appearance and characteristic features**

**IMPORTANT:** Pay special attention to hair length and style - this is often where AI makes mistakes. If the child has short hair in the photo, the illustration must show short hair. If long, show long. Match the exact hair texture and style.

Perform this analysis and extract the character description. Use this character description CONSISTENTLY throughout every page of the book.

# BOOK INFORMATION
- **Number of Pages:** 10 pages
- **Story Language:** ${storyLanguage} (IMPORTANT: The story text in the JSON output should be in ${storyLanguage}, but all instructions and image descriptions must be in English)
- **Age Group:** Appropriate for ${data.ageGroup} age group
- **Theme:** ${themeNameForImage} - ${escapedSubtheme}
- **Illustration Style:** ${styleDescForImage}
- **Tone:** Warm, encouraging, magical, adventurous

# STORY CONTENT

**Title:** ${escapedTitle}

**Pages:**

${storyContent.pages.map(page => {
    const escapedText = escapeForTemplateLiteral(page.text);
    const escapedImagePrompt = escapeForTemplateLiteral(page.imagePrompt);
    return `
**Page ${page.pageNumber}:**
- Text: "${escapedText}"
- Image Description: "${escapedImagePrompt}"
`;
}).join('\n')}

**Main Message:** ${escapedMoral}

# VISUAL REQUIREMENTS

Create an illustration for each page:

**SPECIAL NOTE FOR PAGE 1 (BOOK COVER):**
- Page 1 MUST be designed as a professional book cover **ILLUSTRATION** (NOT a book mockup, NOT a 3D book object, NOT a book on a shelf)
- This should be a **FLAT ILLUSTRATION** that can be used as a book cover, not a photograph of a physical book
- The main character (${escapedCharacterName}) should be prominently featured in the center or foreground
- Character physical features: ${characterFeaturesForImage}
- **CRITICAL: Match the exact hair length, style, and texture from the uploaded photo** - if the photo shows short hair, the illustration must show short hair; if long, show long; match the exact curl pattern, texture, and style
- **IMPORTANT: The character should RESEMBLE the child in the photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering. The character should look like a stylized illustration that captures the child's features (hair color, eye color, face shape, etc.) but in the chosen illustration style. It should be clearly an illustration, not a photograph.**
- Include elements representing the theme (${themeNameForImage} - ${escapedSubtheme})
- The book title should be visible in the design (describe where it would be, but don't add actual text)
- Make it visually striking, colorful, and appealing to children
- The cover should look professional and print-ready
- Use ${styleDescForImage} style
${data.illustrationStyle === '3d' ? `- **CRITICAL FOR 3D ANIMATION STYLE:** The illustration must be cartoonish and stylized like Pixar/DreamWorks animated movies - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, and a playful animated movie aesthetic. The character should look like a 3D animated cartoon character from a children's movie, not a real photograph or realistic 3D render.` : ''}
- **DO NOT create a book mockup, 3D book object, or book on a shelf - create a flat, standalone illustration**
- **CRITICAL: All image descriptions must be in English only. Do not use Turkish words in image descriptions.**

**For Pages 2-10 (Interior Pages):**

1. **Character Consistency (VERY IMPORTANT):**
   - The SAME child should appear on every page
   - Features from the photo must be preserved EXACTLY:
     * **Same hair color, length, style, and texture** (CRITICAL: Match the exact hair length from the photo - short, medium, or long. Match the exact texture - straight, wavy, curly, etc.)
     * Same eye color (exact shade)
     * Same skin tone (exact shade)
     * Same facial features (face shape, nose, mouth, cheeks)
     * Same special features (glasses, freckles, dimples, etc.)
     * Same body proportions
   - Only clothing and position can change
   - **Pay special attention to hair length - this is a common mistake. If the photo shows short hair, the illustration must show short hair. If long, show long.**

2. **Illustration Style:**
   - ${styleDescForImage}
   ${data.illustrationStyle === '3d' ? `- **CRITICAL FOR 3D ANIMATION STYLE:** All illustrations must be cartoonish and stylized like Pixar/DreamWorks animated movies - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, and a playful animated movie aesthetic. Characters should look like 3D animated cartoon characters from children's movies, not real photographs or realistic 3D renders.` : ''}

3. **Visual Content:**
   - The illustration must accurately represent the page text
   - The child should be at the center of the illustration
   - The scene should match the story
   - Safe and positive for children

4. **Technical:**
   - High quality, print-ready
   - No text in the image
   - Child-appropriate content
   - Positive and uplifting

# OUTPUT FORMAT

Provide output in the following JSON format:

\`\`\`json
{
  "title": "${escapedTitle}",
  "characterName": "${escapedCharacterName}",
  "characterAge": ${data.characterAge},
  "characterDescription": "Detailed character description extracted from photo",
  "pages": [
${storyContent.pages.map(page => {
    const escapedText = escapeForJson(page.text);
    const escapedImagePrompt = escapeForJson(page.imagePrompt);
    return `    {
      "pageNumber": ${page.pageNumber},
      "text": "${escapedText}",
      "imageDescription": "${escapedImagePrompt}"
    }`;
}).join(',\n')}
  ],
  "moral": "${escapedMoral}"
}
\`\`\`

# IMPORTANT NOTES

1. **Page 1 is the BOOK COVER ILLUSTRATION**: This is critical! Page 1 must be designed as a professional book cover **ILLUSTRATION** (NOT a book mockup, NOT a 3D book object, NOT a book on a shelf). It should be a **FLAT, STANDALONE ILLUSTRATION** that can be used as a book cover. The main character should be prominently featured, theme elements included, and the book title visible in the design.

2. **Character Consistency:** This is the most critical point. The same child should appear on every page. Preserve ALL features from the photo on every page, especially:
   - **Hair length, style, and texture** (match exactly - short, medium, or long; straight, wavy, or curly)
   - Eye color (exact shade)
   - Skin tone (exact shade)
   - Facial features
   - Body proportions

3. **Age Appropriateness:** The story and language should be appropriate for ${data.ageGroup} age group.

4. **Safety:** All content must be safe and positive for children. No scary, violent, or inappropriate content.

5. **Quality:** Each page must be high quality in both text and visuals.

Now analyze the uploaded photo and create PAGE 1 (the book cover) only. You will create the remaining pages later, one by one.`;
}

// Ön prompt hazırlama endpoint'i (AI çağrısı yapmadan)
app.post('/api/prepare-prompt', async (req, res) => {
    try {
        const data = req.body;
        console.log('📥 Ön prompt hazırlama isteği:', JSON.stringify(data, null, 2));
        
        // Validasyon
        if (!data.characterName || !data.characterAge || !data.characterGender) {
            return res.status(400).json({ error: 'Karakter bilgileri eksik' });
        }
        
        if (!data.language || !data.ageGroup || !data.theme || !data.subtheme || !data.illustrationStyle) {
            return res.status(400).json({ error: 'Kitap ayarları eksik' });
        }
        
        // Story prompt'u hazırla (AI'a gönderilecek) - HER ZAMAN İNGİLİZCE
        const isTurkish = data.language === 'tr';
        const storyLanguage = isTurkish ? 'Turkish' : 'English';
        const wordCount = wordCounts[data.ageGroup];
        const themeName = themeTranslations[data.language][data.theme];
        const styleDesc = styleDescriptions[data.language][data.illustrationStyle];
        
        // Story text için karakter özellikleri
        let characterFeatures = '';
        if (data.hairColor) characterFeatures += `${data.hairColor} hair, `;
        if (data.eyeColor) characterFeatures += `${data.eyeColor} eyes`;
        if (data.features.length > 0) {
            characterFeatures += (characterFeatures ? ', ' : '') + data.features.join(', ');
        }
        
        // Image prompt'lar için İngilizce
        const characterFeaturesForImage = translateCharacterFeaturesForImage(data);
        const themeNameForImage = themeTranslations.en[data.theme] || themeName;
        const styleDescForImage = styleDescriptions.en[data.illustrationStyle] || styleDesc;
        
        const storyPrompt = `
You are a professional children's book author. You write personalized children's stories.

# TASK
Create a magical and engaging 10-page children's story.

# CHARACTER INFORMATION
- **Main Character:** ${data.characterName}, ${data.characterAge} years old, ${data.characterGender === 'boy' ? 'boy' : 'girl'}
  - Physical features (for story text): ${characterFeatures || 'standard appearance'}
  - Physical features (for image prompts - MUST be in English): ${characterFeaturesForImage}
  - Photo reference: The child in the uploaded photo

# STORY SETTINGS
- **Theme (for story):** ${themeName} - ${data.subtheme}
- **Theme (for image prompts - MUST be in English):** ${themeNameForImage} - ${data.subtheme}
- **Age Group:** ${data.ageGroup} years
- **Story Language:** ${storyLanguage} (IMPORTANT: Write the story text in ${storyLanguage}, but keep all instructions and image prompts in English)
- **Special Requests:** ${data.customRequests || 'None'}

# STORY REQUIREMENTS
1. Total length: 10 pages
2. Language complexity: Age-appropriate for ${data.ageGroup} age group
3. Tone: Warm, encouraging, magical, adventurous
4. Structure:
   - **Page 1: BOOK COVER** (CRITICAL: This must be designed as a book cover page)
     * Should include the book title prominently
     * Main character should be featured prominently and attractively
     * Should represent the theme and adventure
     * Should be visually striking and professional
     * Text can be minimal (title + subtitle or brief introduction)
   - Page 2: Introduction and story beginning
   - Pages 3-7: Adventure and challenges
   - Pages 8-9: Resolution and lessons learned
   - Page 10: Happy ending and closing
5. Positive values: Friendship, courage, curiosity, kindness

# FORMAT
Return as JSON:
{
  "title": "Book title in ${storyLanguage}",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page 1 text in ${storyLanguage} - This is the BOOK COVER page. Can be minimal (just title) or include a brief introduction (${wordCount.min}-${wordCount.max} words)",
      "imagePrompt": "BOOK COVER ILLUSTRATION (NOT a book mockup): Professional children's book cover illustration as a FLAT, STANDALONE ILLUSTRATION (NOT a 3D book object, NOT a book on a shelf, NOT a photograph of a physical book). The main character (${data.characterName}), a ${data.characterAge}-year-old ${data.characterGender === 'boy' ? 'boy' : 'girl'} with ${characterFeaturesForImage}, should be prominently featured in the center or foreground. CRITICAL: Match the exact hair length, style, and texture from the uploaded photo - if the photo shows short hair, show short hair; if long, show long; match the exact curl pattern and texture. IMPORTANT: The character should RESEMBLE the child in the photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering. The character should look like a stylized illustration that captures the child's features (hair color, eye color, face shape, etc.) but in the chosen illustration style. It should be clearly an illustration, not a photograph. Include elements representing the theme (${themeNameForImage} - ${data.subtheme}). The book title should be visible in the design (though you'll describe it, not add actual text). Use ${styleDescForImage} style. ${data.illustrationStyle === '3d' ? 'CRITICAL FOR 3D ANIMATION STYLE: This must be cartoonish and stylized like Pixar/DreamWorks animated movies - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, and a playful animated movie aesthetic. The character should look like a 3D animated cartoon character, not a real photograph.' : ''} Make it visually striking, colorful, and appealing to children. The cover should look professional and print-ready. DO NOT create a book mockup or 3D book object - create a flat illustration. CRITICAL: This image description must be entirely in English - no Turkish words allowed."
    },
    {
      "pageNumber": 2,
      "text": "Page 2 text in ${storyLanguage} (${wordCount.min}-${wordCount.max} words) - Story introduction",
      "imagePrompt": "Detailed visual description for this page as an ILLUSTRATION (NOT a photograph). The character (${data.characterName}) has ${characterFeaturesForImage}. CRITICAL: Match the exact hair length, style, and texture from the uploaded photo - if the photo shows short hair, show short hair; if long, show long; match the exact curl pattern and texture. IMPORTANT: The character should RESEMBLE the child in the photo but MUST be an ILLUSTRATION, NOT a photorealistic rendering. The character should look like a stylized illustration that captures the child's features but in the chosen illustration style. It should be clearly an illustration, not a photograph. Theme: ${themeNameForImage} - ${data.subtheme}. Style: ${styleDescForImage}. ${data.illustrationStyle === '3d' ? 'CRITICAL FOR 3D ANIMATION STYLE: This must be cartoonish and stylized like Pixar/DreamWorks animated movies - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, and a playful animated movie aesthetic. The character should look like a 3D animated cartoon character, not a real photograph.' : ''} CRITICAL: This image description must be entirely in English - no Turkish words allowed."
    }
    // ... pages 3-10 follow the same pattern
  ],
  "moral": "The story's main message in ${storyLanguage}"
}

# IMPORTANT NOTES
- **Page 1 is the BOOK COVER**: Must be designed as a professional book cover with the main character prominently featured, theme elements, and the book title visible in the design
- Use the character's name (${data.characterName}) frequently in the story text
- Write story text in ${storyLanguage}, but image prompts must be in English
- Simple and rhythmic language appropriate for ${data.ageGroup} age group
- Page 1 can have minimal text (just title or brief intro), pages 2-10 should have ${wordCount.min}-${wordCount.max} words each
- Make visual descriptions detailed and specify ${styleDescForImage} style (in English)
- Maintain character consistency across all pages
- Make the story age-appropriate and engaging

Now create the story!
`;
        
        res.json({
            success: true,
            storyPrompt: storyPrompt,
            instructions: isTurkish 
                ? 'Bu prompt\'u ChatGPT veya Gemini\'ye gönderin. JSON çıktısını alıp aşağıdaki "JSON Çıktısını Ekle" bölümüne yapıştırın.'
                : 'Send this prompt to ChatGPT or Gemini. Get the JSON output and paste it in the "Add JSON Output" section below.'
        });
        
    } catch (error) {
        console.error('❌ Ön prompt hazırlama hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

// JSON çıktısını alıp final prompt oluşturma endpoint'i
app.post('/api/create-final-from-json', async (req, res) => {
    try {
        const { formData, storyJson } = req.body;
        
        if (!formData || !storyJson) {
            return res.status(400).json({ error: 'Form verisi veya JSON eksik' });
        }
        
        // JSON'u parse et
        let storyContent;
        try {
            storyContent = typeof storyJson === 'string' ? JSON.parse(storyJson) : storyJson;
        } catch (parseError) {
            return res.status(400).json({ error: 'Geçersiz JSON formatı: ' + parseError.message });
        }
        
        // Final prompt'u oluştur
        const finalPrompt = createFinalPrompt(formData, storyContent);
        
        res.json({
            success: true,
            finalPrompt: finalPrompt
        });
        
    } catch (error) {
        console.error('❌ Final prompt oluşturma hatası:', error);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint
app.post('/api/create-prompt', async (req, res) => {
    try {
        const data = req.body;
        console.log('📥 Gelen istek:', JSON.stringify(data, null, 2));
        
        // Validasyon
        if (!data.characterName || !data.characterAge || !data.characterGender) {
            console.error('❌ Validasyon hatası: Karakter bilgileri eksik');
            return res.status(400).json({ error: 'Karakter bilgileri eksik' });
        }
        
        if (!data.language || !data.ageGroup || !data.theme || !data.subtheme || !data.illustrationStyle) {
            console.error('❌ Validasyon hatası: Kitap ayarları eksik');
            return res.status(400).json({ error: 'Kitap ayarları eksik' });
        }
        
        // AI Provider seçimi
        const aiProvider = data.aiProvider || 'gpt';
        
        // Hikaye içeriğini oluştur
        console.log('📚 Hikaye içeriği oluşturuluyor...');
        console.log('   - Karakter:', data.characterName, data.characterAge, 'yaş');
        console.log('   - Tema:', data.theme, '-', data.subtheme);
        console.log('   - Dil:', data.language);
        console.log('   - AI Provider:', aiProvider);
        
        const storyContent = await createStoryContent(data, aiProvider);
        console.log('✅ Hikaye içeriği oluşturuldu:', storyContent.title);
        console.log('   - Sayfa sayısı:', storyContent.pages.length);
        
        // Final prompt'u oluştur
        console.log('📝 Final prompt oluşturuluyor...');
        let finalPrompt;
        try {
            finalPrompt = createFinalPrompt(data, storyContent);
            console.log('✅ Final prompt hazır, uzunluk:', finalPrompt.length, 'karakter');
        } catch (promptError) {
            console.error('❌ Final prompt oluşturulurken hata:', promptError);
            console.error('   Stack:', promptError.stack);
            throw new Error('Final prompt oluşturulamadı: ' + promptError.message);
        }
        
        // Response gönder
        res.json({
            success: true,
            storyContent: storyContent,
            finalPrompt: finalPrompt
        });
        
        console.log('✅ Response gönderildi');
        
    } catch (error) {
        console.error('❌ HATA:', error);
        console.error('   Stack:', error.stack);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 POC Server çalışıyor: http://localhost:${port}`);
    console.log(`📝 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Yüklendi' : '❌ Eksik!'}`);
    console.log(`📝 Groq API Key: ${process.env.GROQ_API_KEY ? '✅ Yüklendi' : '❌ Eksik!'}`);
    if (!process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY) {
        console.log(`⚠️  UYARI: En az bir AI provider API key'i gerekli!`);
    }
});
