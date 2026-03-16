/**
 * @file Admin panel için DB sorguları
 */

import { pool } from './pool'

export interface AdminStats {
  totalUsers: number
  totalBooks: number
  totalCompletedBooks: number
  totalGeneratingBooks: number
  totalFailedBooks: number
  recentBooks: RecentBook[]
  recentUsers: RecentUser[]
}

export interface RecentBook {
  id: string
  title: string
  status: string
  theme: string
  created_at: Date
  user_name: string | null
  user_email: string
}

export interface RecentUser {
  id: string
  name: string | null
  email: string
  created_at: Date
  book_count: number
}

// ============================================================================
// Book list
// ============================================================================

export interface AdminBookRow {
  id: string
  title: string
  status: string
  theme: string
  language: string
  age_group: string | null
  illustration_style: string
  total_pages: number
  cover_image_url: string | null
  created_at: Date
  completed_at: Date | null
  is_example: boolean
  user_id: string
  user_name: string | null
  user_email: string
}

export interface AdminBooksResult {
  books: AdminBookRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminBooksFilter {
  search?: string
  status?: string
  theme?: string
  language?: string
  page?: number
  pageSize?: number
}

export async function getAdminBooks(filter: AdminBooksFilter = {}): Promise<AdminBooksResult> {
  const { search, status, theme, language, page = 1, pageSize = 20 } = filter
  const offset = (page - 1) * pageSize

  const conditions: string[] = ['b.is_example IS NOT TRUE']
  const values: unknown[] = []
  let idx = 1

  if (search) {
    conditions.push(
      `(b.title ILIKE $${idx} OR u.email ILIKE $${idx} OR b.id::text ILIKE $${idx})`
    )
    values.push(`%${search}%`)
    idx++
  }
  if (status) {
    conditions.push(`b.status = $${idx}`)
    values.push(status)
    idx++
  }
  if (theme) {
    conditions.push(`b.theme = $${idx}`)
    values.push(theme)
    idx++
  }
  if (language) {
    conditions.push(`b.language = $${idx}`)
    values.push(language)
    idx++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const [booksResult, countResult] = await Promise.all([
    pool.query<AdminBookRow>(
      `SELECT b.id, b.title, b.status, b.theme, b.language, b.age_group,
              b.illustration_style, b.total_pages, b.cover_image_url,
              b.created_at, b.completed_at, b.is_example,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM books b
       LEFT JOIN users u ON b.user_id = u.id
       ${where}
       ORDER BY b.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, pageSize, offset]
    ),
    pool.query<{ count: string }>(
      `SELECT COUNT(*) as count
       FROM books b
       LEFT JOIN users u ON b.user_id = u.id
       ${where}`,
      values
    ),
  ])

  const total = parseInt(countResult.rows[0].count)
  return {
    books: booksResult.rows,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// ============================================================================
// Single book for admin detail
// ============================================================================

export interface AdminBookDetail extends AdminBookRow {
  story_data: any
  images_data: any[]
  generation_metadata: any
  edit_quota_used: number
  edit_quota_limit: number | null
  pdf_url: string | null
  view_count: number
}

export async function getAdminBookById(bookId: string): Promise<AdminBookDetail | null> {
  const result = await pool.query<AdminBookDetail>(
    `SELECT b.*,
            u.name as user_name, u.email as user_email
     FROM books b
     LEFT JOIN users u ON b.user_id = u.id
     WHERE b.id = $1`,
    [bookId]
  )
  return result.rows[0] || null
}

// ============================================================================
// User list
// ============================================================================

export interface AdminUserRow {
  id: string
  name: string | null
  email: string
  role: string | null
  free_cover_used: boolean
  created_at: Date
  updated_at: Date
  book_count: number
  completed_book_count: number
}

export interface AdminUsersResult {
  users: AdminUserRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminUsersFilter {
  search?: string
  role?: string
  page?: number
  pageSize?: number
}

export async function getAdminUsers(filter: AdminUsersFilter = {}): Promise<AdminUsersResult> {
  const { search, role, page = 1, pageSize = 20 } = filter
  const offset = (page - 1) * pageSize

  const conditions: string[] = []
  const values: unknown[] = []
  let idx = 1

  if (search) {
    conditions.push(`(u.name ILIKE $${idx} OR u.email ILIKE $${idx} OR u.id::text ILIKE $${idx})`)
    values.push(`%${search}%`)
    idx++
  }
  if (role) {
    conditions.push(`u.role = $${idx}`)
    values.push(role)
    idx++
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const [usersResult, countResult] = await Promise.all([
    pool.query<AdminUserRow>(
      `SELECT u.id, u.name, u.email, u.role, u.free_cover_used, u.created_at, u.updated_at,
              COUNT(b.id) FILTER (WHERE b.is_example IS NOT TRUE) as book_count,
              COUNT(b.id) FILTER (WHERE b.status = 'completed' AND b.is_example IS NOT TRUE) as completed_book_count
       FROM users u
       LEFT JOIN books b ON b.user_id = u.id
       ${where}
       GROUP BY u.id, u.name, u.email, u.role, u.free_cover_used, u.created_at, u.updated_at
       ORDER BY u.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...values, pageSize, offset]
    ),
    pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM users u ${where}`,
      values
    ),
  ])

  const total = parseInt(countResult.rows[0].count)
  return {
    users: usersResult.rows.map(r => ({
      ...r,
      book_count: parseInt(r.book_count as unknown as string),
      completed_book_count: parseInt(r.completed_book_count as unknown as string),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

export interface AdminUserDetail extends AdminUserRow {
  recentBooks: {
    id: string
    title: string
    status: string
    theme: string
    created_at: Date
    cover_image_url: string | null
  }[]
}

export async function getAdminUserById(userId: string): Promise<AdminUserDetail | null> {
  const [userResult, booksResult] = await Promise.all([
    pool.query<AdminUserRow>(
      `SELECT u.id, u.name, u.email, u.role, u.free_cover_used, u.created_at, u.updated_at,
              COUNT(b.id) FILTER (WHERE b.is_example IS NOT TRUE) as book_count,
              COUNT(b.id) FILTER (WHERE b.status = 'completed' AND b.is_example IS NOT TRUE) as completed_book_count
       FROM users u
       LEFT JOIN books b ON b.user_id = u.id
       WHERE u.id = $1
       GROUP BY u.id, u.name, u.email, u.role, u.free_cover_used, u.created_at, u.updated_at`,
      [userId]
    ),
    pool.query(
      `SELECT id, title, status, theme, created_at, cover_image_url
       FROM books
       WHERE user_id = $1 AND is_example IS NOT TRUE
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    ),
  ])

  if (!userResult.rows[0]) return null

  const user = userResult.rows[0]
  return {
    ...user,
    book_count: parseInt(user.book_count as unknown as string),
    completed_book_count: parseInt(user.completed_book_count as unknown as string),
    recentBooks: booksResult.rows,
  }
}

// ============================================================================
// Stats
// ============================================================================

export async function getAdminStats(): Promise<AdminStats> {
  const [
    userCountResult,
    bookCountResult,
    recentBooksResult,
    recentUsersResult,
  ] = await Promise.all([
    pool.query<{ count: string }>('SELECT COUNT(*) as count FROM users'),
    pool.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) as count FROM books GROUP BY status`
    ),
    pool.query<RecentBook>(
      `SELECT b.id, b.title, b.status, b.theme, b.created_at,
              u.name as user_name, u.email as user_email
       FROM books b
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.is_example IS NOT TRUE
       ORDER BY b.created_at DESC
       LIMIT 8`
    ),
    pool.query<{ id: string; name: string | null; email: string; created_at: Date; book_count: string }>(
      `SELECT u.id, u.name, u.email, u.created_at,
              COUNT(b.id) as book_count
       FROM users u
       LEFT JOIN books b ON b.user_id = u.id AND b.is_example IS NOT TRUE
       GROUP BY u.id, u.name, u.email, u.created_at
       ORDER BY u.created_at DESC
       LIMIT 8`
    ),
  ])

  const bookStatusMap = Object.fromEntries(
    bookCountResult.rows.map(r => [r.status, parseInt(r.count)])
  )

  return {
    totalUsers: parseInt(userCountResult.rows[0].count),
    totalBooks: Object.values(bookStatusMap).reduce((a, b) => a + b, 0),
    totalCompletedBooks: bookStatusMap['completed'] ?? 0,
    totalGeneratingBooks: bookStatusMap['generating'] ?? 0,
    totalFailedBooks: bookStatusMap['failed'] ?? 0,
    recentBooks: recentBooksResult.rows,
    recentUsers: recentUsersResult.rows.map(r => ({
      ...r,
      book_count: parseInt(r.book_count as unknown as string),
    })),
  }
}
