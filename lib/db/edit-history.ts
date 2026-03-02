/**
 * @file Image edit history database operations (PostgreSQL)
 *
 * Actual DB table columns (image_edit_history):
 *   id, book_id, page_number, version, original_image_url, edited_image_url,
 *   mask_image_url, edit_prompt, ai_model, edit_metadata, created_at
 */

import { pool } from './pool'

export interface EditHistory {
  id: string
  book_id: string
  page_number: number
  version: number
  original_image_url: string | null
  edited_image_url: string
  mask_image_url: string | null
  edit_prompt: string | null
  ai_model: string | null
  edit_metadata: any
  created_at: Date
}

export interface InsertEditHistoryInput {
  book_id: string
  page_number: number
  version: number
  original_image_url: string | null
  edited_image_url: string
  mask_image_url?: string | null
  edit_prompt?: string | null
  ai_model?: string | null
  edit_metadata?: any
}

/**
 * Get edit history for a book (ordered by page and version)
 */
export async function getEditHistory(bookId: string): Promise<EditHistory[]> {
  const result = await pool.query(
    `SELECT * FROM get_book_edit_history($1)`,
    [bookId]
  )
  return result.rows
}

/**
 * Insert an edit or regenerate history entry
 */
export async function insertEditHistory(data: InsertEditHistoryInput): Promise<EditHistory> {
  const result = await pool.query(
    `INSERT INTO image_edit_history
       (book_id, page_number, version, original_image_url, edited_image_url,
        mask_image_url, edit_prompt, ai_model, edit_metadata, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
     RETURNING *`,
    [
      data.book_id,
      data.page_number,
      data.version,
      data.original_image_url ?? null,
      data.edited_image_url,
      data.mask_image_url ?? null,
      data.edit_prompt ?? null,
      data.ai_model ?? 'gpt-image-1.5',
      data.edit_metadata ? JSON.stringify(data.edit_metadata) : null,
    ]
  )
  return result.rows[0]
}

/**
 * Get the latest version number for a specific page in a book.
 * Returns 0 if no edits exist yet.
 */
export async function getLatestPageVersion(bookId: string, pageNumber: number): Promise<number> {
  const result = await pool.query(
    `SELECT * FROM get_latest_page_version($1, $2)`,
    [bookId, pageNumber]
  )
  // PostgreSQL scalar function returns a row where column name = function name
  const row = result.rows[0]
  return (row?.get_latest_page_version ?? row?.latest_version ?? 0) as number
}
