import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth/api-auth"
import { pool } from "@/lib/db/pool"
import { getUserById, updateUser } from "@/lib/db/users"
import { createBook, updateBook } from "@/lib/db/books"
import { createDraft } from "@/lib/db/drafts"
import { buildDetailedCharacterPrompt } from "@/lib/prompts/image/character"
import type { CharacterDescription } from "@/lib/prompts/types"
import type { CharacterFormData } from "@/lib/draft-storage"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/** Guest create-free-cover: 5 istek / IP / 24 saat */
const guestIpLimit = 5
const guestIpWindowMs = 24 * 60 * 60 * 1000
const guestIpStore = new Map<string, number[]>()
function pruneGuestIp(ip: string) {
  const now = Date.now()
  const list = (guestIpStore.get(ip) || []).filter((t) => now - t < guestIpWindowMs)
  if (list.length) guestIpStore.set(ip, list)
  else guestIpStore.delete(ip)
  return list
}
function getClientIP(req: NextRequest): string {
  const v = req.headers.get("x-forwarded-for")
  if (v) return v.split(",")[0].trim()
  return req.headers.get("x-real-ip") || "unknown"
}

function formToDescription(c: CharacterFormData | Record<string, unknown>): CharacterDescription {
  const age = Number((c as any).age) || 5
  const gender = String((c as any).gender || "girl").toLowerCase()
  const hairColor = String((c as any).hairColor || "brown")
  const eyeColor = String((c as any).eyeColor || "brown")
  return {
    age,
    gender,
    skinTone: "fair",
    hairColor,
    hairStyle: "straight",
    hairLength: "short",
    eyeColor,
    eyeShape: "round",
    faceShape: "round",
    height: "average",
    build: "normal",
    clothingStyle: "casual",
    clothingColors: ["blue", "red"],
    uniqueFeatures: [],
    typicalExpression: "happy",
    personalityTraits: ["curious", "friendly"],
  }
}

function deriveFromWizard(w: any): { characterData: CharacterFormData; theme: string; style: string } {
  const s1 = w?.step1 || {}
  const characterData: CharacterFormData = {
    name: s1.name || "Child",
    age: Number(s1.age) || 5,
    gender: ((s1.gender || "girl") as string).toLowerCase() as "boy" | "girl",
    hairColor: s1.hairColor || "brown",
    eyeColor: s1.eyeColor || "brown",
  }
  const theme =
    w?.step3?.theme?.id || w?.step3?.theme || (typeof w?.step3?.theme === "string" ? w.step3.theme : "") || "adventure"
  const style =
    w?.step4?.illustrationStyle?.title ||
    w?.step4?.illustrationStyle ||
    (typeof w?.step4?.illustrationStyle === "string" ? w.step4.illustrationStyle : "") ||
    "watercolor"
  return { characterData, theme, style: String(style) }
}

function getBodyFields(body: any): { characterData: CharacterFormData; theme: string; style: string } | null {
  if (body?.wizardData) return deriveFromWizard(body.wizardData)
  if (body?.characterData && body?.theme && body?.style)
    return {
      characterData: body.characterData,
      theme: String(body.theme),
      style: String(body.style),
    }
  return null
}

function generateDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

/**
 * POST /api/books/create-free-cover
 * - Authenticated: users.free_cover_used, books + drafts
 * - Guest: email zorunlu, guest_free_cover_used, IP rate limit, sadece drafts (user_id=null)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    const body = await request.json().catch(() => ({}))
    const fields = getBodyFields(body)

    // --- Guest branch ---
    if (!user) {
      const email = body?.email && String(body.email).trim()
      if (!email) {
        return NextResponse.json(
          { success: false, error: "E-posta adresi gerekli (üyesiz kullanıcılar için)." },
          { status: 400 }
        )
      }
      const ip = getClientIP(request)
      pruneGuestIp(ip)
      const list = guestIpStore.get(ip) || []
      if (list.length >= guestIpLimit) {
        return NextResponse.json(
          { success: false, error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." },
          { status: 429 }
        )
      }
      const used = await pool.query(
        "SELECT id FROM guest_free_cover_used WHERE email = $1 LIMIT 1",
        [email.toLowerCase()]
      )
      if (used.rows.length > 0) {
        return NextResponse.json(
          { success: false, error: "Bu e-posta ile ücretsiz kapak hakkı zaten kullanıldı." },
          { status: 400 }
        )
      }
      if (!fields) {
        return NextResponse.json(
          { success: false, error: "Eksik alan: wizardData veya characterData, theme, style gerekli." },
          { status: 400 }
        )
      }
      const { characterData, theme, style } = fields
      const desc = formToDescription(characterData)
      const scene = `book cover, main character prominently featured`
      const characterPrompt = buildDetailedCharacterPrompt(desc, style, scene)

      const coverRes = await openai.images.generate({
        model: "gpt-image-1.5",
        prompt: characterPrompt,
        size: "1024x1536",
        quality: "low",
        n: 1,
      })
      const coverImageUrl = coverRes.data?.[0]?.url
      if (!coverImageUrl) {
        return NextResponse.json(
          { success: false, error: "Kapak görseli oluşturulamadı." },
          { status: 500 }
        )
      }

      const draftId = generateDraftId()
      const now = new Date()

      await createDraft({
        draft_id: draftId,
        user_id: null,
        user_email: email.toLowerCase(),
        character_ids: (characterData as any)?.characterIds ?? [],
        theme,
        sub_theme: "",
        age_group: "3-5",
        illustration_style: style,
        language: "tr",
        custom_requests: JSON.stringify({ coverImage: coverImageUrl, characterData, email: email.toLowerCase() }),
      })

      await pool.query(
        "INSERT INTO guest_free_cover_used (email, used_at) VALUES ($1, $2)",
        [email.toLowerCase(), now.toISOString()]
      )

      list.push(Date.now())
      guestIpStore.set(ip, list)

      return NextResponse.json({
        success: true,
        draftId,
        coverImage: coverImageUrl,
      })
    }

    // --- Authenticated branch ---
    const userData = await getUserById(user.id)
    if (!userData) {
      return NextResponse.json({ success: false, error: "Kullanıcı verisi alınamadı." }, { status: 500 })
    }
    if (userData.free_cover_used) {
      return NextResponse.json(
        { success: false, error: "Free cover credit already used" },
        { status: 400 }
      )
    }

    if (!fields) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: wizardData or characterData, theme, style" },
        { status: 400 }
      )
    }
    const { characterData, theme, style } = fields

    const desc = formToDescription(characterData)
    const scene = `book cover, main character prominently featured`
    const characterPrompt = buildDetailedCharacterPrompt(desc, style, scene)

    const coverRes = await openai.images.generate({
      model: "gpt-image-1.5",
      prompt: characterPrompt,
      size: "1024x1536",
      quality: "low",
      n: 1,
    })
    const coverImageUrl = coverRes.data?.[0]?.url
    if (!coverImageUrl) {
      return NextResponse.json(
        { success: false, error: "Failed to generate cover image" },
        { status: 500 }
      )
    }

    const { data: book, error: bookErr } = await createBook(user.id, {
      title: `${characterData.name}'s Story`,
      theme,
      illustration_style: style,
      story_data: {},
      total_pages: 1,
      status: "draft",
      generation_metadata: { theme, style, characterData, isFreeCover: true },
    })
    if (bookErr || !book) {
      console.error("[Create Free Cover] createBook error:", bookErr)
      return NextResponse.json({ success: false, error: "Kitap oluşturulamadı." }, { status: 500 })
    }

    await updateBook(book.id, {
      cover_image_url: coverImageUrl,
      images_data: [{ pageNumber: 1, imageUrl: coverImageUrl, isCover: true }],
    })

    await updateUser(user.id, { free_cover_used: true })

    const draftId = generateDraftId()
    await createDraft({
      draft_id: draftId,
      user_id: user.id,
      user_email: user.email,
      character_ids: (characterData as any)?.characterIds ?? [],
      theme,
      sub_theme: "",
      age_group: "3-5",
      illustration_style: style,
      language: "tr",
      custom_requests: JSON.stringify({ coverImage: coverImageUrl, characterData }),
    })

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
