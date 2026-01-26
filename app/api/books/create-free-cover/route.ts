import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createBook } from "@/lib/db/books"
import { buildCharacterPrompt } from "@/lib/prompts/image/v1.0.0/character"
import { generateFullPagePrompt } from "@/lib/prompts/image/v1.0.0/scene"
import OpenAI from "openai"
import type { CharacterFormData } from "@/lib/draft-storage"
import { saveDraftToLocalStorage } from "@/lib/draft-storage"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * POST /api/books/create-free-cover
 * Create free cover (draft) for authenticated user
 * Only creates cover image, not full book
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

    // Check free cover status
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("free_cover_used")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("[Create Free Cover] Error fetching user:", userError)
      return NextResponse.json(
        { success: false, error: "Failed to fetch user data" },
        { status: 500 }
      )
    }

    if (userData?.free_cover_used) {
      return NextResponse.json(
        { success: false, error: "Free cover credit already used" },
        { status: 400 }
      )
    }

    // Get request body
    const body = await request.json()
    const {
      characterData,
      theme,
      style,
    }: {
      characterData: CharacterFormData
      theme: string
      style: string
    } = body

    if (!characterData || !theme || !style) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create book with draft status (cover only)
    const bookData = {
      user_id: user.id,
      title: `${characterData.name}'s Story`,
      status: "draft" as const,
      total_pages: 1, // Only cover
      generation_metadata: {
        theme,
        style,
        characterData,
        isFreeCover: true,
      },
    }

    const book = await createBook(bookData)

    // Generate cover image
    const characterPrompt = buildCharacterPrompt({
      characterData,
      theme,
      style,
      pageNumber: 1,
      isCover: true,
    })

    const coverImageResponse = await openai.images.generate({
      model: "gpt-image-1.5",
      prompt: characterPrompt,
      size: "1024x1536",
      quality: "low",
      n: 1,
    })

    const coverImageUrl = coverImageResponse.data[0]?.url
    if (!coverImageUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to generate cover image" },
        { status: 500 }
      )
    }

    // Update book with cover image
    const { error: updateError } = await supabase
      .from("books")
      .update({
        cover_image_path: coverImageUrl,
        images_data: [
          {
            pageNumber: 1,
            imageUrl: coverImageUrl,
            isCover: true,
          },
        ],
      })
      .eq("id", book.id)

    if (updateError) {
      console.error("[Create Free Cover] Error updating book:", updateError)
      return NextResponse.json(
        { success: false, error: "Failed to save cover image" },
        { status: 500 }
      )
    }

    // Mark free cover as used
    const { error: updateUserError } = await supabase
      .from("users")
      .update({ free_cover_used: true })
      .eq("id", user.id)

    if (updateUserError) {
      console.error("[Create Free Cover] Error updating user:", updateUserError)
      // Don't fail the request, just log the error
    }

    // Save draft to localStorage and database
    const draftId = saveDraftToLocalStorage({
      coverImage: coverImageUrl,
      characterData,
      theme,
      style,
    })

    // Also save to database
    try {
      await fetch("/api/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draftId,
          coverImage: coverImageUrl,
          characterData,
          theme,
          style,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }),
      })
    } catch (err) {
      console.error("[Create Free Cover] Error saving draft to database:", err)
      // Don't fail the request
    }

    return NextResponse.json({
      success: true,
      bookId: book.id,
      draftId,
      coverImage: coverImageUrl,
    })
  } catch (error) {
    console.error("[Create Free Cover] Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
