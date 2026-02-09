/**
 * Global TTS settings (single row). Admin edits; used as defaults for /api/tts/generate.
 */

import { pool } from './pool'

export interface TtsSettingsRow {
  id: number
  voice_name: string
  prompt: string
  language_code: string
  model_name: string
  speaking_rate: number
  updated_at: Date
}

const ROW_ID = 1

export async function getTtsSettings(): Promise<TtsSettingsRow | null> {
  const result = await pool.query(
    'SELECT id, voice_name, prompt, language_code, model_name, speaking_rate, updated_at FROM tts_settings WHERE id = $1',
    [ROW_ID]
  )
  return result.rows[0] || null
}

export interface UpdateTtsSettingsInput {
  voice_name?: string
  prompt?: string
  language_code?: string
  model_name?: string
  speaking_rate?: number
}

export async function updateTtsSettings(input: UpdateTtsSettingsInput): Promise<TtsSettingsRow | null> {
  const updates: string[] = []
  const values: unknown[] = []
  let i = 1
  if (input.voice_name !== undefined) {
    updates.push(`voice_name = $${i++}`)
    values.push(input.voice_name)
  }
  if (input.prompt !== undefined) {
    updates.push(`prompt = $${i++}`)
    values.push(input.prompt)
  }
  if (input.language_code !== undefined) {
    updates.push(`language_code = $${i++}`)
    values.push(input.language_code)
  }
  if (input.model_name !== undefined) {
    updates.push(`model_name = $${i++}`)
    values.push(input.model_name)
  }
  if (input.speaking_rate !== undefined) {
    updates.push(`speaking_rate = $${i++}`)
    values.push(Number(input.speaking_rate))
  }
  if (updates.length === 0) return getTtsSettings()
  updates.push(`updated_at = NOW()`)
  values.push(ROW_ID)
  const result = await pool.query(
    `UPDATE tts_settings SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, voice_name, prompt, language_code, model_name, speaking_rate, updated_at`,
    values
  )
  return result.rows[0] || null
}
