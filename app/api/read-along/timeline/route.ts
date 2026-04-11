import { NextRequest, NextResponse } from "next/server"
import { generateTimeline } from "@/lib/read-along/timeline"
import type { TimelineStrategy } from "@/lib/read-along/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, audioUrl, language, pageNumber, strategy, chunkSize } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 })
    }
    if (!audioUrl || typeof audioUrl !== "string") {
      return NextResponse.json({ error: "audioUrl is required" }, { status: 400 })
    }

    const result = await generateTimeline({
      text: text.trim(),
      audioUrl,
      language: language || "en",
      pageNumber: typeof pageNumber === "number" ? pageNumber : 1,
      strategy: (strategy as TimelineStrategy) || undefined,
      chunkSize: typeof chunkSize === "number" ? chunkSize : 3,
    })

    return NextResponse.json({
      timeline: result.timeline,
      strategy: result.strategy,
      cached: result.cached,
    })
  } catch (err) {
    console.error("[API read-along/timeline]", err)
    const message = err instanceof Error ? err.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
