/**
 * User Registration API
 * 
 * POST /api/auth/register
 * Creates a new user with email/password
 */

import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/db/users'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Create user
    const user = await createUser({
      id: randomUUID(),
      email,
      password_hash,
      name: name || undefined,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('[Register] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
