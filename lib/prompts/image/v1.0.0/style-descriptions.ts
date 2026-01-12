/**
 * Illustration Style Descriptions
 * 
 * Provides detailed style descriptions for image generation prompts
 * Based on POC styleDescriptions structure
 */

export const STYLE_DESCRIPTIONS: Record<string, string> = {
  '3d_animation': '3D Animation - Pixar/DreamWorks-style 3D animation, cartoonish and stylized (NOT photorealistic), vibrant saturated colors, rounded shapes, exaggerated features, children\'s animated movie aesthetic',
  '3d': '3D Animation - Pixar/DreamWorks-style 3D animation, cartoonish and stylized (NOT photorealistic), vibrant saturated colors, rounded shapes, exaggerated features, children\'s animated movie aesthetic',
  'geometric': 'Geometric - Simplified geometric shapes, flat colors, sharp distinct edges, modern and stylized illustration style',
  'watercolor': 'Watercolor - Soft, translucent appearance, visible brushstrokes, blended edges, muted flowing colors, hand-painted illustration feel',
  'gouache': 'Gouache - Opaque, vibrant colors, matte finish, distinct visible brushstrokes, rich saturated colors, illustration style',
  'picture_book': 'Picture-Book - Warm, slightly textured, inviting children\'s picture book illustration, soft glow, stylized but clear details',
  'picture-book': 'Picture-Book - Warm, slightly textured, inviting children\'s picture book illustration, soft glow, stylized but clear details',
  'block_world': 'Block World - Pixelated or blocky aesthetic, Minecraft-like, characters and environment constructed from visible blocks, illustration style',
  'block-world': 'Block World - Pixelated or blocky aesthetic, Minecraft-like, characters and environment constructed from visible blocks, illustration style',
  'soft_anime': 'Soft Anime - Large expressive eyes, delicate features, soft shading, pastel colors, anime-style illustration',
  'soft-anime': 'Soft Anime - Large expressive eyes, delicate features, soft shading, pastel colors, anime-style illustration',
  'collage': 'Collage - Made from cut-out pieces, distinct layers and varied textures, visible edges or shadows, vibrant colors, illustration',
  'clay_animation': 'Clay Animation - Clay-like appearance, textured, slightly lumpy, hand-molded look, soft rounded shadows, illustration',
  'clay-animation': 'Clay Animation - Clay-like appearance, textured, slightly lumpy, hand-molded look, soft rounded shadows, illustration',
  'kawaii': 'Kawaii - Exaggerated cuteness, large sparkling eyes, simplified rounded features, bright cheerful colors, illustration',
  'comic_book': 'Comic Book - Bold outlines, relatively flat colors, strong dramatic shadows, comic book style illustration',
  'comic-book': 'Comic Book - Bold outlines, relatively flat colors, strong dramatic shadows, comic book style illustration',
  'sticker_art': 'Sticker Art - Clean lines, bright highly saturated colors, polished graphic appearance, sticker-like illustration',
  'sticker-art': 'Sticker Art - Clean lines, bright highly saturated colors, polished graphic appearance, sticker-like illustration',
}

/**
 * Get style description for a given style key
 */
export function getStyleDescription(styleKey: string): string {
  // Normalize style key (handle variations like '3d_animation', '3d', etc.)
  const normalizedKey = styleKey.toLowerCase().replace(/[-\s]/g, '_')
  
  // Try exact match first
  if (STYLE_DESCRIPTIONS[normalizedKey]) {
    return STYLE_DESCRIPTIONS[normalizedKey]
  }
  
  // Try with underscore variations
  const underscoreKey = styleKey.replace(/[-\s]/g, '_').toLowerCase()
  if (STYLE_DESCRIPTIONS[underscoreKey]) {
    return STYLE_DESCRIPTIONS[underscoreKey]
  }
  
  // Fallback to original style key
  return styleKey
}

/**
 * Check if style is 3D Animation style
 */
export function is3DAnimationStyle(styleKey: string): boolean {
  const normalizedKey = styleKey.toLowerCase().replace(/[-\s]/g, '_')
  return normalizedKey === '3d_animation' || normalizedKey === '3d'
}

/**
 * Get 3D Animation special notes (if applicable)
 */
export function get3DAnimationNotes(): string {
  return 'CRITICAL FOR 3D ANIMATION STYLE: The illustration must be cartoonish and stylized like Pixar/DreamWorks animated movies - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, and a playful animated movie aesthetic. The character should look like a 3D animated cartoon character from a children\'s movie, not a real photograph or realistic 3D render.'
}

