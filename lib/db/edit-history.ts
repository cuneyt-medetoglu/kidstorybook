/**
 * @file Image edit history database operations (PostgreSQL)
 */

import { pool } from './pool'

export interface EditHistory {
  id: string
  book_id: string
  page_number: number
  version_number: number
  previous_image_url: string | null
  new_image_url: string
  edit_prompt: string | null
  mask_image_url: string | null
  edited_by: string
  created_at: Date
}

/**
 * Get edit history for a book
 */
export async function getEditHistory(bookId: string): Promise<EditHistory[]> {
  const result = await pool.query(
    `SELECT * FROM get_book_edit_history($1)`,
    [bookId]
  )
  return result.rows
}

/**
 * Insert edit history entry
 */
export async function insertEditHistory(data: Omit<EditHistory, 'id' | 'created_at'>): Promise<EditHistory> {
  const result = await pool.query(
    `INSERT INTO image_edit_history (book_id, page_number, version_number, previous_image_url, new_image_url, edit_prompt, mask_image_url, edited_by, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     RETURNING *`,
    [
      data.book_id,
      data.page_number,
      data.version_number,
      data.previous_image_url,
      data.new_image_url,
      data.edit_prompt,
      data.mask_image_url,
      data.edited_by,
    ]
  )
  return result.rows[0]
}

/**
 * Get latest page version number
 */
export async function getLatestPageVersion(bookId: string, pageNumber: number): Promise<number> {
  const result = await pool.query(
    `SELECT * FROM get_latest_page_version($1, $2)`,
    [bookId, pageNumber]
  )
  return result.rows[0]?.latest_version || 0
}
