/**
 * Regenerate Page Image API
 *
 * POST /api/ai/regenerate-image
 * Seçilen sayfanın görselini baştan üretir. Create-book'taki sayfa üretim
 * pipeline'ıyla birebir aynı mantığı kullanır:
 *   1. generation_metadata'dan master illüstrasyonları al
 *   2. Aynı prompt builder'ı (generateFullPagePrompt) kullan
 *   3. Master varsa → /v1/images/edits (image[] ile)
 *   4. Master yoksa  → /v1/images/generations
 *   5. S3'e yükle, image_edit_history'ye kaydet, story_data + quota güncelle
 */

import { NextRequest } from "next/server"
import { requireUser } from "@/lib/auth/api-auth"
import { getBookById, updateBook } from "@/lib/db/books"
import { getCharacterById } from "@/lib/db/characters"
import { getLatestPageVersion, insertEditHistory, getEditHistory } from "@/lib/db/edit-history"
import { uploadFile, getPublicUrl, getObjectBufferFromUrl } from "@/lib/storage/s3"
import { buildCharacterPrompt, buildMultipleCharactersPrompt } from "@/lib/prompts/image/character"
import {
  generateFullPagePrompt,
  detectRiskySceneElements,
  getSafeSceneAlternative,
  type SceneDiversityAnalysis,
} from "@/lib/prompts/image/scene"
import { imageEditWithLog, imageGenerateWithLog } from "@/lib/ai/images"
import { successResponse, errorResponse, handleAPIError } from "@/lib/api/response"

const IMAGE_MODEL = "gpt-image-1.5"
const IMAGE_SIZE = "1024x1536"
const IMAGE_QUALITY = "low"

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser()
    const body = await request.json()
    const { bookId, pageNumber, userPrompt } = body || {}

    // ── 1. Validasyon ──────────────────────────────────────────────────────
    if (!bookId || !pageNumber) {
      return errorResponse("Missing required fields: bookId, pageNumber", undefined, 400)
    }
    if (pageNumber < 1) {
      return errorResponse("Invalid pageNumber: must be >= 1", undefined, 400)
    }

    // ── 2. Kitap + yetki ───────────────────────────────────────────────────
    const { data: book, error: bookError } = await getBookById(bookId)
    if (bookError || !book) {
      return errorResponse("Book not found", undefined, 404)
    }
    if (book.user_id !== user.id) {
      return errorResponse("Unauthorized", undefined, 403)
    }

    // ── 3. Quota ───────────────────────────────────────────────────────────
    const quotaUsed = book.edit_quota_used ?? 0
    const quotaLimit = book.edit_quota_limit ?? 3
    if (quotaUsed >= quotaLimit) {
      return errorResponse(
        `Image change quota exceeded. You have used all ${quotaLimit} changes for this book.`,
        undefined,
        429
      )
    }

    // ── 4. Sayfa ───────────────────────────────────────────────────────────
    if (!book.story_data?.pages?.length) {
      return errorResponse("Book has no story data", undefined, 400)
    }
    const pageIndex = pageNumber - 1
    if (pageIndex < 0 || pageIndex >= book.story_data.pages.length) {
      return errorResponse(
        `Invalid page number: ${pageNumber}. Book has ${book.story_data.pages.length} pages.`,
        undefined,
        400
      )
    }
    const page = book.story_data.pages[pageIndex] as {
      pageNumber?: number
      text?: string
      imagePrompt?: string
      sceneDescription?: string
      sceneContext?: string
      characterIds?: string[]
      characterExpressions?: Record<string, string>
      shotPlan?: { shotType?: string; lens?: string; cameraAngle?: string; placement?: string; timeOfDay?: string; mood?: string }
      imageUrl?: string
    }

    // ── 5. Karakterler ─────────────────────────────────────────────────────
    const characterIds: string[] =
      book.story_data?.metadata?.characterIds ||
      (book.character_id ? [book.character_id] : [])
    if (characterIds.length === 0) {
      return errorResponse("Book has no character data", undefined, 400)
    }
    const characters = (
      await Promise.all(characterIds.map((id) => getCharacterById(id).then((r) => r.data)))
    ).filter(Boolean) as Awaited<ReturnType<typeof getCharacterById>>["data"][]
    if (characters.length === 0) {
      return errorResponse("Could not load characters for this book", undefined, 400)
    }

    // ── 6. Temel meta ──────────────────────────────────────────────────────
    const themeKey = (book.theme || "adventure").toLowerCase().replace(/\s+/g, "_")
    const ageGroup = book.story_data?.metadata?.ageGroup || book.age_group || "preschool"
    const illustrationStyle = book.illustration_style || "watercolor"
    const totalPages = book.story_data.pages.length

    // Master illüstrasyonlar (create-book ile aynı kaynak)
    const masterIllustrations = (
      book.generation_metadata?.masterIllustrations || {}
    ) as Record<string, string>

    // ── 7. Sahne tanımı ────────────────────────────────────────────────────
    // userPrompt doluysa orijinal sahneye ek olarak eklenir (yoksa orijinal kullanılır)
    const baseScene =
      page.imagePrompt || page.sceneDescription || page.text || ""
    const sceneDescription =
      userPrompt?.trim()
        ? baseScene.trim()
          ? `${baseScene.trim()}. ${userPrompt.trim()}`
          : userPrompt.trim()
        : baseScene

    const characterActionRaw =
      page.sceneContext?.trim() ||
      page.sceneDescription?.trim() ||
      page.imagePrompt?.trim() ||
      page.text?.trim() ||
      ""
    const riskAnalysis = detectRiskySceneElements(sceneDescription, characterActionRaw)
    const characterAction = riskAnalysis.hasRisk
      ? getSafeSceneAlternative(characterActionRaw)
      : characterActionRaw

    const mood =
      themeKey === "adventure"
        ? "exciting"
        : themeKey === "fantasy"
          ? "mysterious"
          : themeKey === "space"
            ? "inspiring"
            : themeKey === "sports"
              ? "exciting"
              : "happy"

    // ── 8. Sayfa bazlı karakter listesi ────────────────────────────────────
    const pageCharacters: string[] = page.characterIds?.length
      ? page.characterIds
      : characterIds

    const characterExpressions: Record<string, string> = {}
    const pageCharExprs = page.characterExpressions || {}
    pageCharacters.forEach((charId) => {
      const expr = pageCharExprs[charId]?.trim()
      if (expr) characterExpressions[charId] = expr
    })

    const pageShotPlan = page.shotPlan
    const hasValidShotPlan =
      pageShotPlan && typeof pageShotPlan === "object" && !Array.isArray(pageShotPlan)

    const sceneInput = {
      pageNumber,
      sceneDescription,
      theme: themeKey,
      mood,
      characterAction: characterAction || "",
      focusPoint: "balanced" as const,
      ...(Object.keys(characterExpressions).length > 0 && { characterExpressions }),
      ...(hasValidShotPlan && { shotPlan: pageShotPlan }),
    }

    // ── 9. Karakter prompt (create-book ile aynı) ──────────────────────────
    const mainChar = characters.find((c) => c.id === pageCharacters[0]) || characters[0]
    const pageAdditionalCharacters = pageCharacters
      .slice(1)
      .map((charId) => {
        const c = characters.find((x) => x.id === charId)
        if (!c) return null
        return {
          type: c.character_type || { group: "Child", value: "Child", displayName: c.name },
          description: c.description,
        }
      })
      .filter(Boolean) as { type: any; description: any }[]

    const characterPrompt =
      pageAdditionalCharacters.length > 0
        ? buildMultipleCharactersPrompt(mainChar.description, pageAdditionalCharacters, true)
        : buildCharacterPrompt(mainChar.description, true, true)

    // ── 10. Full prompt (create-book ile aynı parametreler) ─────────────────
    // Kapak ayrı; story_data.pages = sadece iç sayfalar. Page 1 = ilk iç sayfa → isCover: false
    const previousScenes: SceneDiversityAnalysis[] = []
    const fullPrompt = generateFullPagePrompt(
      characterPrompt,
      sceneInput,
      illustrationStyle,
      ageGroup,
      pageAdditionalCharacters.length,
      false,  // isCover: kapak bu API'de yok, tüm sayfalar iç sayfa
      false,  // useCoverReference: master kullanıldığı için false
      previousScenes,
      totalPages,
      pageCharacters.map((id) => ({
        id,
        name: characters.find((c) => c.id === id)?.name || "Character",
      }))
    )

    // ── 11. Referans görseller (create-book sırasıyla) ────────────────────
    // A10: Önce master'lar, yoksa reference_photo_url
    const pageMasterUrls = pageCharacters
      .map((id) => masterIllustrations[id])
      .filter((url): url is string => Boolean(url))

    const referenceImageUrls =
      pageMasterUrls.length > 0
        ? pageMasterUrls
        : characters
            .filter((c) => pageCharacters.includes(c.id))
            .map((c) => c.reference_photo_url)
            .filter((url): url is string => Boolean(url))

    // ── 12. Referans blob'larını indir ─────────────────────────────────────
    // Önce kendi S3'ümüzden credential ile oku (403 önlenir); değilse fetch (data: veya harici URL)
    const imageBlobs: Array<{ blob: Blob; filename: string }> = []

    for (let i = 0; i < referenceImageUrls.length; i++) {
      const refUrl = referenceImageUrls[i]
      const isMaster = pageMasterUrls.includes(refUrl)
      const charId = pageCharacters[i] || `unknown_${i}`
      const charName = characters.find((c) => c.id === charId)?.name || `char_${i + 1}`
      const label = isMaster ? `master_${charName}` : `photo_${charName}`

      try {
        const fromS3 = await getObjectBufferFromUrl(refUrl)
        if (fromS3) {
          imageBlobs.push({
            blob: new Blob([fromS3.buffer], { type: fromS3.contentType }),
            filename: `${label}.png`,
          })
          continue
        }
        if (refUrl.startsWith("data:")) {
          const base64Data = refUrl.split(",")[1]
          const binaryData = Buffer.from(base64Data, "base64")
          imageBlobs.push({ blob: new Blob([binaryData], { type: "image/png" }), filename: `${label}.png` })
        } else {
          const imageRes = await fetch(refUrl)
          if (!imageRes.ok) throw new Error(`HTTP ${imageRes.status}`)
          const buffer = await imageRes.arrayBuffer()
          imageBlobs.push({ blob: new Blob([buffer], { type: "image/png" }), filename: `${label}.png` })
        }
      } catch (err) {
        console.error(`[Regenerate Image] Failed to fetch reference ${label}:`, err)
      }
    }

    // ── 13. OpenAI API çağrısı ────────────────────────────────────────────
    let imageUrl: string | null = null
    let imageB64: string | null = null

    if (imageBlobs.length > 0) {
      // Edits API — create-book ile aynı FormData yapısı
      const formData = new FormData()
      formData.append("model", IMAGE_MODEL)
      formData.append("prompt", fullPrompt)
      formData.append("size", IMAGE_SIZE)
      formData.append("quality", IMAGE_QUALITY)
      formData.append("input_fidelity", "high")
      imageBlobs.forEach(({ blob, filename }) => {
        formData.append("image[]", blob, filename)
      })

      const result = await imageEditWithLog(formData, {
        userId: user.id,
        bookId,
        operationType: "image_regenerate",
        pageIndex: pageNumber,
        model: IMAGE_MODEL,
        quality: IMAGE_QUALITY,
        size: IMAGE_SIZE,
        refImageCount: imageBlobs.length,
      })

      imageUrl = result.data?.[0]?.url || null
      imageB64 = result.data?.[0]?.b64_json || null
    } else {
      // Fallback: referans görsel yok → generations API
      console.warn("[Regenerate Image] No reference images available, using /v1/images/generations")
      const result = await imageGenerateWithLog(
        { model: IMAGE_MODEL, prompt: fullPrompt, n: 1, size: IMAGE_SIZE, quality: IMAGE_QUALITY },
        {
          userId: user.id,
          bookId,
          operationType: "image_regenerate",
          pageIndex: pageNumber,
          model: IMAGE_MODEL,
          quality: IMAGE_QUALITY,
          size: IMAGE_SIZE,
        }
      )
      imageUrl = result.data?.[0]?.url || null
      imageB64 = result.data?.[0]?.b64_json || null
    }

    if (!imageUrl && !imageB64) {
      return errorResponse("Image generation failed: no image returned from OpenAI", undefined, 500)
    }

    // ── 14. S3'e yükle ─────────────────────────────────────────────────────
    const buffer = imageB64
      ? Buffer.from(imageB64, "base64")
      : Buffer.from(await (await fetch(imageUrl!)).arrayBuffer())

    const latestVersion = await getLatestPageVersion(bookId, pageNumber)
    const nextVersion = latestVersion + 1
    const fileName = `${user.id}/books/${bookId}/edits/page_${pageNumber}_v${nextVersion}_regen_${Date.now()}.png`
    const s3Key = await uploadFile("books", fileName, buffer, "image/png")
    const newImageUrl = getPublicUrl(s3Key)

    // ── 15. History kaydı ──────────────────────────────────────────────────
    const editPromptForHistory =
      (userPrompt?.trim() || sceneDescription || fullPrompt || "[Regenerate page]").trim() ||
      "[Regenerate page]"
    await insertEditHistory({
      book_id: bookId,
      page_number: pageNumber,
      version: nextVersion,
      original_image_url: page.imageUrl || null,
      edited_image_url: newImageUrl,
      edit_prompt: editPromptForHistory,
      ai_model: IMAGE_MODEL,
      edit_metadata: { mode: "regenerate", refCount: imageBlobs.length },
    })

    // ── 16. Book güncelle (imageUrl + quota) ───────────────────────────────
    const updatedPages = [...book.story_data.pages]
    updatedPages[pageIndex] = { ...updatedPages[pageIndex], imageUrl: newImageUrl }

    await updateBook(bookId, {
      story_data: { ...book.story_data, pages: updatedPages },
      edit_quota_used: quotaUsed + 1,
    })

    // ── 17. Yanıt ──────────────────────────────────────────────────────────
    const historyData = await getEditHistory(bookId)
    const history = (historyData || [])
      .filter((h) => h.page_number === pageNumber)
      .map((h) => ({
        version: h.version,
        imageUrl: h.edited_image_url,
        editPrompt: h.edit_prompt,
        createdAt: h.created_at,
      }))

    return successResponse(
      {
        editedImageUrl: newImageUrl,
        version: nextVersion,
        quotaRemaining: quotaLimit - (quotaUsed + 1),
        history,
      },
      "Page image regenerated successfully"
    )
  } catch (err) {
    console.error("[Regenerate Image] Error:", err)
    return handleAPIError(err)
  }
}
