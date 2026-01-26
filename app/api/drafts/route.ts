import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { DraftData } from "@/lib/draft-storage"

/**
 * GET /api/drafts
 * Get user's drafts (authenticated users only)
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

    // Get user's drafts from database
    const { data: drafts, error } = await supabase
      .from("drafts")
      .select("*")
      .eq("user_id", user.id)
      .gte("expires_at", new Date().toISOString()) // Only non-expired drafts
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Drafts API] Error fetching drafts:", error)
      return NextResponse.json(
        { success: false, error: "Failed to fetch drafts" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      drafts: drafts || [],
    })
  } catch (error) {
    console.error("[Drafts API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/drafts
 * Save draft to database (authenticated users only)
 */
export async function POST(request: NextRequest) {
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

    const body: DraftData = await request.json()

    // Validate required fields
    if (!body.draftId || !body.coverImage || !body.characterData) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if draft already exists
    const { data: existingDraft } = await supabase
      .from("drafts")
      .select("id")
      .eq("draft_id", body.draftId)
      .single()

    if (existingDraft) {
      // Update existing draft
      const { data, error } = await supabase
        .from("drafts")
        .update({
          cover_image: body.coverImage,
          character_data: body.characterData,
          theme: body.theme,
          sub_theme: body.subTheme,
          style: body.style,
          expires_at: body.expiresAt,
        })
        .eq("draft_id", body.draftId)
        .select()
        .single()

      if (error) {
        console.error("[Drafts API] Error updating draft:", error)
        return NextResponse.json(
          { success: false, error: "Failed to update draft" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        draft: data,
      })
    }

    // Create new draft
    const { data, error } = await supabase
      .from("drafts")
      .insert({
        user_id: user.id,
        draft_id: body.draftId,
        cover_image: body.coverImage,
        character_data: body.characterData,
        theme: body.theme,
        sub_theme: body.subTheme,
        style: body.style,
        created_at: body.createdAt,
        expires_at: body.expiresAt,
      })
      .select()
      .single()

    if (error) {
      console.error("[Drafts API] Error creating draft:", error)
      return NextResponse.json(
        { success: false, error: "Failed to create draft" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      draft: data,
    })
  } catch (error) {
    console.error("[Drafts API] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
