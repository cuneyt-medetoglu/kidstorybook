/**
 * @file Draft database operations (PostgreSQL)
 */

import { pool } from './pool'

export interface Draft {
  id: string
  draft_id: string
  user_id: string | null
  user_email?: string | null
  character_ids: string[]
  theme: string
  sub_theme: string
  age_group: string
  illustration_style: string
  language: string
  custom_requests?: string | null
  created_at: Date
  updated_at: Date
}

/**
 * Get draft by draft_id
 */
export async function getDraftById(draftId: string): Promise<Draft | null> {
  const result = await pool.query(
    'SELECT * FROM drafts WHERE draft_id = $1',
    [draftId]
  )
  return result.rows[0] || null
}

/**
 * Get user's drafts
 */
export async function getUserDrafts(userId: string): Promise<Draft[]> {
  const result = await pool.query(
    'SELECT * FROM drafts WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )
  return result.rows
}

/**
 * Create draft
 */
export async function createDraft(data: Omit<Draft, 'id' | 'created_at' | 'updated_at'>): Promise<Draft> {
  const result = await pool.query(
    `INSERT INTO drafts (draft_id, user_id, user_email, character_ids, theme, sub_theme, age_group, illustration_style, language, custom_requests, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
     RETURNING *`,
    [
      data.draft_id,
      data.user_id,
      data.user_email || null,
      data.character_ids,
      data.theme,
      data.sub_theme,
      data.age_group,
      data.illustration_style,
      data.language,
      data.custom_requests || null,
    ]
  )
  return result.rows[0]
}

/**
 * Update draft
 */
export async function updateDraft(draftId: string, data: Partial<Draft>): Promise<Draft | null> {
  const fields: string[] = []
  const values: any[] = []
  let paramCount = 1

  if (data.character_ids !== undefined) {
    fields.push(`character_ids = $${paramCount++}`)
    values.push(data.character_ids)
  }
  if (data.theme !== undefined) {
    fields.push(`theme = $${paramCount++}`)
    values.push(data.theme)
  }
  if (data.sub_theme !== undefined) {
    fields.push(`sub_theme = $${paramCount++}`)
    values.push(data.sub_theme)
  }
  if (data.age_group !== undefined) {
    fields.push(`age_group = $${paramCount++}`)
    values.push(data.age_group)
  }
  if (data.illustration_style !== undefined) {
    fields.push(`illustration_style = $${paramCount++}`)
    values.push(data.illustration_style)
  }
  if (data.language !== undefined) {
    fields.push(`language = $${paramCount++}`)
    values.push(data.language)
  }
  if (data.custom_requests !== undefined) {
    fields.push(`custom_requests = $${paramCount++}`)
    values.push(data.custom_requests)
  }

  if (fields.length === 0) {
    return getDraftById(draftId)
  }

  fields.push(`updated_at = NOW()`)
  values.push(draftId)

  const result = await pool.query(
    `UPDATE drafts SET ${fields.join(', ')} WHERE draft_id = $${paramCount} RETURNING *`,
    values
  )
  return result.rows[0] || null
}
