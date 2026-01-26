import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/users/free-cover-status
 * Get user's free cover status (authenticated users only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient(request)

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's free cover status from database
    const { data: userData, error } = await supabase
      .from("users")
      .select("free_cover_used")
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("[Free Cover Status API] Error fetching user:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch user data" },
        { status: 500 }
      )
    }

    const hasFreeCover = !userData?.free_cover_used
    const used = userData?.free_cover_used || false

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
