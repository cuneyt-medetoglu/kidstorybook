/**
 * Illustration Style Descriptions
 * 
 * Provides detailed style descriptions for image generation prompts
 * Based on POC styleDescriptions structure
 */

export const STYLE_DESCRIPTIONS: Record<string, string> = {
  // 3D Animation (Pixar Style) - Pixar-style 3D animation like Toy Story, Finding Nemo, Inside Out
  '3d_animation': '3D Animation (Pixar Style) - Pixar-style 3D animation (like Toy Story, Finding Nemo, Inside Out), cartoonish and stylized (NOT photorealistic), vibrant saturated colors, rounded shapes, exaggerated features, soft shadows, realistic textures, children\'s animated movie aesthetic, Pixar animation quality',
  '3d': '3D Animation (Pixar Style) - Pixar-style 3D animation (like Toy Story, Finding Nemo, Inside Out), cartoonish and stylized (NOT photorealistic), vibrant saturated colors, rounded shapes, exaggerated features, soft shadows, realistic textures, children\'s animated movie aesthetic, Pixar animation quality',
  
  // Geometric - Flat design, minimalist, angular shapes, vector art style
  'geometric': 'Geometric - Flat design style, minimalist geometric shapes (circles, squares, triangles, polygons), angular sharp edges, flat colors with NO gradients, NO shadows, NO depth, vector art aesthetic, clean lines, modern stylized, grid-based alignment, geometric abstraction, low-poly style elements, illustration',
  
  // Watercolor - Transparent watercolor technique with warm inviting atmosphere
  'watercolor': 'Watercolor - Transparent watercolor technique, visible soft brushstrokes, colors blend and bleed at edges, paper texture visible through paint, luminous glowing finish, wet-on-wet color mixing, soft flowing edges, warm inviting atmosphere, hand-painted illustration feel',
  
  // Block World - Pixelated/blocky aesthetic, Minecraft-like
  'block_world': 'Block World - Pixelated/blocky aesthetic, visible blocks/cubes, Minecraft-like construction, characters and environment built from geometric blocks, sharp edges, limited color palette, isometric or orthographic perspective, illustration style',
  'block-world': 'Block World - Pixelated/blocky aesthetic, visible blocks/cubes, Minecraft-like construction, characters and environment built from geometric blocks, sharp edges, limited color palette, isometric or orthographic perspective, illustration style',
  
  // Collage - Cut-out pieces with visible edges and layers
  'collage': 'Collage - Cut-out pieces with visible rough edges, distinct layers with varied textures, torn edges showing paper texture, mixed media feel, visible shadows between layers, vibrant colors, handcrafted appearance, illustration',
  
  // Clay Animation - Clay-like appearance with hand-molded look
  'clay_animation': 'Clay Animation - Clay-like appearance, visible fingerprints and tool marks, soft organic texture, matte finish, slightly lumpy surfaces, hand-molded look, soft rounded shadows, stop-motion aesthetic, illustration',
  'clay-animation': 'Clay Animation - Clay-like appearance, visible fingerprints and tool marks, soft organic texture, matte finish, slightly lumpy surfaces, hand-molded look, soft rounded shadows, stop-motion aesthetic, illustration',
  
  // Kawaii - Exaggerated cuteness with oversized head and sparkling eyes
  'kawaii': 'Kawaii - Oversized head (1:2 or 1:3 head-to-body ratio), large sparkling eyes with star highlights, tiny dot-like nose, small mouth, soft rounded cheeks, pastel color palette (baby pink, sky blue, mint green, lavender), blush marks on cheeks, decorative hearts/stars/sparkles, exaggerated cuteness, illustration',
  
  // Comic Book - Bold outlines, flat colors, dramatic shadows
  'comic_book': 'Comic Book - Bold thick black outlines around all elements, flat color fills with no gradients, dramatic angular shadows with sharp edges, high contrast between light and dark, halftone dot texture for shadows, simplified graphic style, dynamic poses, comic book style illustration',
  'comic-book': 'Comic Book - Bold thick black outlines around all elements, flat color fills with no gradients, dramatic angular shadows with sharp edges, high contrast between light and dark, halftone dot texture for shadows, simplified graphic style, dynamic poses, comic book style illustration',
  
  // Sticker Art - Clean lines, glossy graphic look
  'sticker_art': 'Sticker Art - Clean bold uniform lines, bright highly saturated colors, glossy graphic look with specular highlights, white border effect (like real sticker), simple cell shading, flat fills with minimal gradients, polished graphic appearance, sticker-like illustration',
  'sticker-art': 'Sticker Art - Clean bold uniform lines, bright highly saturated colors, glossy graphic look with specular highlights, white border effect (like real sticker), simple cell shading, flat fills with minimal gradients, polished graphic appearance, sticker-like illustration',
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
  return 'CRITICAL FOR 3D ANIMATION (PIXAR STYLE): The illustration must be cartoonish and stylized like Pixar animated movies (Toy Story, Finding Nemo, Inside Out) - NOT photorealistic, NOT realistic photography. Use rounded shapes, exaggerated features, bright saturated colors, soft shadows, realistic textures, and a playful animated movie aesthetic. The character should look like a 3D animated cartoon character from a Pixar children\'s movie, not a real photograph or realistic 3D render. Pixar animation quality and visual style.'
}

/**
 * CINEMATIC_PACK – tüm stiller için ortak sinematik kalite (GPT önerisi, 7 Şubat 2026)
 * Stil DNA'sını bozmadan "film tadı" ekler: lighting, color grade, environment depth.
 */
export function getCinematicPack(): string {
  return [
    'cinematic key light with soft fill and rim light',
    'volumetric sun rays where appropriate',
    'atmospheric perspective',
    'warm cinematic color grading',
    'rich contrast',
    'gentle bloom',
    'controlled saturation',
    'high-detail set dressing',
    'layered depth (foreground, midground, background)',
    'natural scale cues',
  ].join(', ')
}

