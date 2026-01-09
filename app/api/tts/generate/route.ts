import { NextRequest, NextResponse } from "next/server"
import { TextToSpeechClient } from "@google-cloud/text-to-speech"

// Initialize Google Cloud TTS client
// Note: Credentials can be provided via:
// 1. GOOGLE_APPLICATION_CREDENTIALS env var (path to JSON key file) - Local development
// 2. Service Account JSON as environment variable - Production (Vercel)
// 3. Default credentials from GCP - If running on GCP
let client: TextToSpeechClient | null = null

function getTTSClient(): TextToSpeechClient {
  if (client) return client

  // Try to initialize with credentials
  try {
    // Option 1: Service Account JSON from environment variable (Vercel)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
      client = new TextToSpeechClient({
        projectId: credentials.project_id,
        credentials,
      })
      return client
    }

    // Option 2: Key file path (Local development)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      client = new TextToSpeechClient({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      })
      return client
    }

    // Option 3: Default credentials (GCP environment)
    client = new TextToSpeechClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    })
    return client
  } catch (error) {
    console.error("Failed to initialize Google Cloud TTS client:", error)
    throw new Error("Google Cloud TTS client initialization failed")
  }
}

// Available voices for storytelling (child-friendly)
const STORYTELLER_VOICES = {
  // English (EN-US) - Standard voices (4M free/month)
  "en-US-Standard-C": "Female, warm and friendly",
  "en-US-Standard-D": "Male, warm and friendly",
  "en-US-Standard-E": "Female, child-friendly",
  "en-US-Standard-F": "Female, warm and gentle",
  // English (EN-US) - WaveNet voices (1M free/month)
  "en-US-Wavenet-C": "Female, natural storytelling",
  "en-US-Wavenet-D": "Male, natural storytelling",
  "en-US-Wavenet-E": "Female, child-friendly",
  "en-US-Wavenet-F": "Female, warm and gentle",
  // Turkish (TR-TR) - Standard voices (4M free/month)
  "tr-TR-Standard-A": "Female, warm",
  "tr-TR-Standard-B": "Male, warm",
  "tr-TR-Standard-C": "Female, warm",
  "tr-TR-Standard-D": "Male, warm",
  "tr-TR-Standard-E": "Female, warm",
  // Turkish (TR-TR) - WaveNet voices (1M free/month)
  "tr-TR-Wavenet-A": "Female, natural storytelling",
  "tr-TR-Wavenet-B": "Male, natural storytelling",
  "tr-TR-Wavenet-C": "Female, natural storytelling",
  "tr-TR-Wavenet-D": "Male, natural storytelling",
  "tr-TR-Wavenet-E": "Female, natural storytelling",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, voiceId = "en-US-Standard-E", speed = 1.0 } = body

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 5000 characters." },
        { status: 400 },
      )
    }

    // Validate voiceId
    if (!Object.keys(STORYTELLER_VOICES).includes(voiceId)) {
      return NextResponse.json(
        { error: `Invalid voiceId. Available: ${Object.keys(STORYTELLER_VOICES).join(", ")}` },
        { status: 400 },
      )
    }

    // Validate speed (0.25 to 4.0)
    const validSpeed = Math.max(0.25, Math.min(4.0, speed))

    // Get TTS client
    const ttsClient = getTTSClient()

    // Request TTS
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: voiceId.split("-").slice(0, 2).join("-"), // e.g., "en-US" or "tr-TR"
        name: voiceId,
        ssmlGender: 
          voiceId.includes("A") || voiceId.includes("C") || voiceId.includes("E") || voiceId.includes("F")
            ? "FEMALE"
            : "MALE",
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: validSpeed,
        pitch: 0, // Neutral pitch (can be adjusted: -20 to +20)
        volumeGainDb: 0, // Neutral volume (can be adjusted: -96 to +16)
      },
    })

    if (!response.audioContent) {
      return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 })
    }

    // Convert audio content to base64
    const audioBase64 = Buffer.from(response.audioContent).toString("base64")
    const audioDataUrl = `data:audio/mp3;base64,${audioBase64}`

    return NextResponse.json({
      audioUrl: audioDataUrl,
      voiceId,
      speed: validSpeed,
      textLength: text.length,
    })
  } catch (error: any) {
    console.error("TTS Error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate speech",
        message: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

// GET endpoint to list available voices
export async function GET() {
  try {
    return NextResponse.json({
      voices: STORYTELLER_VOICES,
      defaultVoice: "en-US-Standard-E",
    })
  } catch (error: any) {
    console.error("TTS Voices Error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch voices",
        message: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

