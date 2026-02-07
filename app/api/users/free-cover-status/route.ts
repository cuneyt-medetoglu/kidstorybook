import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/auth/api-auth"
import { getUserById } from "@/lib/db/users"

export const dynamic = 'force-dynamic'

/**
 * GET /api/users/free-cover-status
 * Get user's free cover status (authenticated users only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireUser()

    // Get user's free cover status from database
    const userData = await getUserById(user.id)

    if (!userData) {
      console.error("[Free Cover Status API] User not found")
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    const hasFreeCover = !userData.free_cover_used
    const used = userData.free_cover_used || false

    return NextResponse.json({
      success: true,
      hasFreeCover,
      used,
    })
  } catch (error) {
    console.error("[Free Cover Status API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
