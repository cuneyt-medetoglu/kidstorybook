/**
 * Kullanıcı bazlı global TTS tercihleri (localStorage).
 * Parent Settings'ten ve BookViewer'dan kullanılır.
 */

const STORAGE_KEY = "kidstorybook_tts_prefs"

export interface TtsPrefs {
  ttsSpeed: number
  volume: number
}

const DEFAULTS: TtsPrefs = {
  ttsSpeed: 1.0,
  volume: 1,
}

export function getTtsPrefs(): TtsPrefs {
  if (typeof window === "undefined") return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<TtsPrefs>
    return {
      ttsSpeed: typeof parsed.ttsSpeed === "number" ? Math.max(0.5, Math.min(2, parsed.ttsSpeed)) : DEFAULTS.ttsSpeed,
      volume: typeof parsed.volume === "number" ? Math.max(0, Math.min(1, parsed.volume)) : DEFAULTS.volume,
    }
  } catch {
    return DEFAULTS
  }
}

export function setTtsPrefs(partial: Partial<TtsPrefs>): void {
  if (typeof window === "undefined") return
  const current = getTtsPrefs()
  const next: TtsPrefs = {
    ttsSpeed: typeof partial.ttsSpeed === "number" ? Math.max(0.5, Math.min(2, partial.ttsSpeed)) : current.ttsSpeed,
    volume: typeof partial.volume === "number" ? Math.max(0, Math.min(1, partial.volume)) : current.volume,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}
