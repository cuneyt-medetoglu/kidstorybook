/**
 * @file User database operations (PostgreSQL)
 */

import { pool } from './pool'

export interface User {
  id: string
  email: string
  password_hash?: string | null
  name?: string | null
  avatar_url?: string | null
  free_cover_used: boolean
  role?: string
  created_at: Date
  updated_at: Date
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  )
  return result.rows[0] || null
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0] || null
}

/**
 * Create new user
 */
export async function createUser(data: {
  id: string
  email: string
  password_hash?: string
  name?: string
  avatar_url?: string
}): Promise<User> {
  const result = await pool.query(
    `INSERT INTO users (id, email, password_hash, name, avatar_url, free_cover_used, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())
     RETURNING *`,
    [data.id, data.email, data.password_hash || null, data.name || null, data.avatar_url || null]
  )
  return result.rows[0]
}

/**
 * Update user
 */
export async function updateUser(userId: string, data: Partial<User>): Promise<User | null> {
  const fields: string[] = []
  const values: any[] = []
  let paramCount = 1

  if (data.name !== undefined) {
    fields.push(`name = $${paramCount++}`)
    values.push(data.name)
  }
  if (data.avatar_url !== undefined) {
    fields.push(`avatar_url = $${paramCount++}`)
    values.push(data.avatar_url)
  }
  if (data.free_cover_used !== undefined) {
    fields.push(`free_cover_used = $${paramCount++}`)
    values.push(data.free_cover_used)
  }
  if (data.role !== undefined) {
    fields.push(`role = $${paramCount++}`)
    values.push(data.role)
  }

  if (fields.length === 0) {
    return getUserById(userId)
  }

  fields.push(`updated_at = NOW()`)
  values.push(userId)

  const result = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
    values
  )
  return result.rows[0] || null
}

/**
 * Get user role
 */
export async function getUserRole(userId: string): Promise<string | null> {
  const result = await pool.query(
    'SELECT role FROM users WHERE id = $1',
    [userId]
  )
  return result.rows[0]?.role || null
}
