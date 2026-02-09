import { NextRequest, NextResponse } from "next/server"
import { generateTts } from "@/lib/tts/generate"

// GET: list voices (unchanged)
const GEMINI_PRO_VOICES = { Achernar: "Natural, storytelling voice" }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      text,
      voiceId: bodyVoice,
      speed: bodySpeed,
      language: bodyLanguage,
      prompt: bodyPrompt,
    } = body

    const result = await generateTts(text, {
      language: bodyLanguage,
      voiceId: bodyVoice,
      speed: bodySpeed,
      prompt: bodyPrompt,
    })

    return NextResponse.json({
      audioUrl: result.audioUrl,
      voiceId: result.voiceId,
      speed: result.speed,
      language: result.languageCode,
      textLength: result.textLength,
      cached: result.cached,
    })
  } catch (error: any) {
    console.error("TTS Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate speech",
        message: error.message || "Unknown error",
      },
      { status: error.message === "Text is required" || error.message?.includes("Text too long") ? 400 : 500 },
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      voices: GEMINI_PRO_VOICES,
      defaultVoice: "Achernar",
      supportedLanguages: ["tr", "en", "de", "fr", "es", "pt", "ru", "zh"],
    })
  } catch (error: any) {
    console.error("TTS Voices Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch voices", message: error.message || "Unknown error" },
      { status: 500 },
    )
  }
}
