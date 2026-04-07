/**
 * @file Admin panel için DB sorguları
 */

import { pool } from './pool'
import { parseCostUsd } from '@/lib/utils/cost-usd'

export interface OrderStats {
  totalPaidOrders: number
  ordersToday: number
  ordersThisWeek: number
  ordersThisMonth: number
  revenueTry: number
  revenueUsd: number
  iyzicoOrders: number
  stripeOrders: number
  failedLast24h: number
}

export interface AdminStats {
  totalUsers: number
  totalBooks: number
  totalCompletedBooks: number
  totalGeneratingBooks: number
  totalFailedBooks: number
  recentBooks: RecentBook[]
  recentUsers: RecentUser[]
  orderStats: OrderStats
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
  /** SUM(ai_requests.cost_usd) for this book; 0 if none */
  ai_cost_usd_total: number
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
              u.id as user_id, u.name as user_name, u.email as user_email,
              COALESCE(ar.ai_cost_usd_total, 0)::float AS ai_cost_usd_total
       FROM books b
       LEFT JOIN users u ON b.user_id = u.id
       LEFT JOIN (
         SELECT book_id, SUM(cost_usd) AS ai_cost_usd_total
         FROM ai_requests
         WHERE book_id IS NOT NULL
         GROUP BY book_id
       ) ar ON ar.book_id = b.id
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
    books: booksResult.rows.map((r) => ({
      ...r,
      ai_cost_usd_total: parseCostUsd(r.ai_cost_usd_total),
    })),
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
  pdf_path: string | null
  view_count: number
}

export async function getAdminBookById(bookId: string): Promise<AdminBookDetail | null> {
  const result = await pool.query<AdminBookDetail>(
    `SELECT b.*,
            u.name as user_name, u.email as user_email,
            COALESCE(ar.ai_cost_usd_total, 0)::float AS ai_cost_usd_total
     FROM books b
     LEFT JOIN users u ON b.user_id = u.id
     LEFT JOIN (
       SELECT book_id, SUM(cost_usd) AS ai_cost_usd_total
       FROM ai_requests
       WHERE book_id IS NOT NULL
       GROUP BY book_id
     ) ar ON ar.book_id = b.id
     WHERE b.id = $1`,
    [bookId]
  )
  const row = result.rows[0]
  if (!row) return null
  return {
    ...row,
    ai_cost_usd_total: parseCostUsd(row.ai_cost_usd_total),
  }
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
    orderStatsResult,
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
    pool.query<{
      total_paid: string
      orders_today: string
      orders_week: string
      orders_month: string
      revenue_try: string
      revenue_usd: string
      iyzico_count: string
      stripe_count: string
      failed_24h: string
    }>(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'paid')                                          AS total_paid,
        COUNT(*) FILTER (WHERE status = 'paid' AND created_at >= NOW() - INTERVAL '24 hours')  AS orders_today,
        COUNT(*) FILTER (WHERE status = 'paid' AND created_at >= NOW() - INTERVAL '7 days')    AS orders_week,
        COUNT(*) FILTER (WHERE status = 'paid' AND created_at >= NOW() - INTERVAL '30 days')   AS orders_month,
        COALESCE(SUM(total_amount) FILTER (WHERE status = 'paid' AND order_currency = 'TRY'), 0) AS revenue_try,
        COALESCE(SUM(total_amount) FILTER (WHERE status = 'paid' AND order_currency != 'TRY'), 0) AS revenue_usd,
        COUNT(*) FILTER (WHERE payment_provider = 'iyzico' AND status = 'paid')          AS iyzico_count,
        COUNT(*) FILTER (WHERE payment_provider = 'stripe'  AND status = 'paid')          AS stripe_count,
        COUNT(*) FILTER (WHERE status = 'failed' AND created_at >= NOW() - INTERVAL '24 hours') AS failed_24h
      FROM orders
    `),
  ])

  const bookStatusMap = Object.fromEntries(
    bookCountResult.rows.map(r => [r.status, parseInt(r.count)])
  )

  const os = orderStatsResult.rows[0]

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
    orderStats: {
      totalPaidOrders: parseInt(os.total_paid),
      ordersToday: parseInt(os.orders_today),
      ordersThisWeek: parseInt(os.orders_week),
      ordersThisMonth: parseInt(os.orders_month),
      revenueTry: parseFloat(os.revenue_try),
      revenueUsd: parseFloat(os.revenue_usd),
      iyzicoOrders: parseInt(os.iyzico_count),
      stripeOrders: parseInt(os.stripe_count),
      failedLast24h: parseInt(os.failed_24h),
    },
  }
}
