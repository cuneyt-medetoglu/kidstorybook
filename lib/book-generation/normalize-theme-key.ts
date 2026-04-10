/**
 * Tema alanından pipeline / görsel üretimi için normalize anahtar.
 * create book route ile aynı kurallar — tek kaynak.
 */
export function normalizeThemeKey(theme: string): string {
  const t = (theme || '').toString().trim().toLowerCase()
  if (!t) return t
  if (t === 'sports&activities' || t === 'sports_activities' || t === 'sports-activities')
    return 'sports'
  return t
}
