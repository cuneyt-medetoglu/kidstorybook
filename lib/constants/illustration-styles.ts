/**
 * Illustration style IDs and display names.
 * Used in book settings and create flow (step4/step6).
 */

export const ILLUSTRATION_STYLE_NAMES: Record<string, string> = {
  "3d_animation": "3D Animation (Pixar Style)",
  comic_book: "Comic Book",
  geometric: "Geometric",
  kawaii: "Kawaii",
  watercolor: "Watercolor",
  clay_animation: "Clay Animation",
  collage: "Collage",
  block_world: "Block World",
  sticker_art: "Sticker Art",
} as const

export function getIllustrationStyleName(styleId: string): string {
  return ILLUSTRATION_STYLE_NAMES[styleId] ?? styleId
}
