/**
 * PostgreSQL NUMERIC / node-pg often yields strings. Summing with `+` must use numbers.
 */
export function parseCostUsd(value: unknown): number {
  if (value == null || value === '') return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const n = parseFloat(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}
