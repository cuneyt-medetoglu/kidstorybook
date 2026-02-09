/**
 * GET /api/tts/settings/can-edit
 * Returns whether the current user can edit global TTS settings (admin only).
 */

import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth/api-auth'
import { getUserRole } from '@/lib/db/users'

export async function GET() {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ canEdit: false })
  }
  const role = await getUserRole(user.id)
  return NextResponse.json({ canEdit: role === 'admin' })
}
