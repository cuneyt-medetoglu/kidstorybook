import { NextRequest, NextResponse } from "next/server"
import { TextToSpeechClient } from "@google-cloud/text-to-speech"
import crypto from "crypto"
import { getLanguageCode, getPromptForLanguage } from "@/lib/prompts/tts/v1.0.0"
import { uploadFile, getPublicUrl, fileExists } from "@/lib/storage/s3"

const TTS_CACHE_PREFIX = "tts-cache"

// Initialize Google Cloud TTS client
let client: TextToSpeechClient | null = null

function getTTSClient(): TextToSpeechClient {
  if (client) return client

  try {
    // Option 1: Service Account JSON (Vercel/Production)
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

// Gemini Pro TTS voices (Achernar is default)
const GEMINI_PRO_VOICES = {
  "Achernar": "Natural, storytelling voice",
  // Add more Gemini Pro voices here as needed
}

/**
 * Generate cache hash from text, voice, speed, and prompt
 */
function generateCacheHash(text: string, voiceId: string, speed: number, prompt: string): string {
  const content = `${text}|${voiceId}|${speed}|${prompt}`
  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Check if audio exists in cache (S3)
 */
async function getCachedAudio(hash: string): Promise<string | null> {
  try {
    const key = `${TTS_CACHE_PREFIX}/${hash}.mp3`
    const exists = await fileExists(key)
    if (!exists) return null
    return getPublicUrl(key)
  } catch (error) {
    console.error('[TTS Cache] Error checking cache:', error)
    return null
  }
}

/**
 * Save audio to cache (S3)
 */
async function saveCachedAudio(hash: string, audioBuffer: Buffer): Promise<string | null> {
  try {
    const fileName = `${hash}.mp3`
    const key = await uploadFile(TTS_CACHE_PREFIX, fileName, audioBuffer, 'audio/mpeg')
    return getPublicUrl(key)
  } catch (error) {
    console.error('[TTS Cache] Error saving to cache:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      text, 
      voiceId = "Achernar", 
      speed = 1.0,
      language = "en" // PRD language code (tr, en, de, fr, es, pt, ru, zh)
    } = body

    // Validation
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 5000 characters." },
        { status: 400 },
      )
    }

    // Validate language and get language code + prompt
    const languageCode = getLanguageCode(language)
    const prompt = getPromptForLanguage(language)

    // Validate speed (0.25 to 4.0)
    const validSpeed = Math.max(0.25, Math.min(4.0, speed))

    // Generate cache hash
    const cacheHash = generateCacheHash(text, voiceId, validSpeed, prompt)

    // Check cache first
    const cachedUrl = await getCachedAudio(cacheHash)
    if (cachedUrl) {
      console.log('[TTS] Cache hit:', cacheHash.substring(0, 8))
      return NextResponse.json({
        audioUrl: cachedUrl,
        voiceId,
        speed: validSpeed,
        language: languageCode,
        textLength: text.length,
        cached: true,
      })
    }

    console.log('[TTS] Cache miss, generating audio:', cacheHash.substring(0, 8))

    // Get TTS client
    const ttsClient = getTTSClient()

    // Request TTS with Gemini Pro model
    const [response] = await ttsClient.synthesizeSpeech({
      input: { 
        text,
        // Note: Prompt is used for cache hash, but Gemini Pro TTS API doesn't support prompt field directly
        // The prompt guidance is handled by the voice model itself
      },
      voice: {
        languageCode,
        name: voiceId,
        modelName: "gemini-2.5-pro-tts", // Required for Gemini Pro TTS voices
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: validSpeed,
        pitch: 0,
        volumeGainDb: 0,
      },
    })

    if (!response.audioContent) {
      return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 })
    }

    // Convert audio content to buffer
    const audioBuffer = Buffer.from(response.audioContent)

    // Save to cache (non-blocking, errors are logged but don't fail request)
    const savedCacheUrl = await saveCachedAudio(cacheHash, audioBuffer)

    // Return audio (either from cache URL or as data URL)
    if (savedCacheUrl) {
      console.log('[TTS] Audio cached successfully:', cacheHash.substring(0, 8))
      return NextResponse.json({
        audioUrl: savedCacheUrl,
        voiceId,
        speed: validSpeed,
        language: languageCode,
        textLength: text.length,
        cached: false,
      })
    } else {
      // Fallback to data URL if cache fails
      console.log('[TTS] Cache save failed, returning data URL')
      const audioBase64 = audioBuffer.toString("base64")
      const audioDataUrl = `data:audio/mp3;base64,${audioBase64}`
      
      return NextResponse.json({
        audioUrl: audioDataUrl,
        voiceId,
        speed: validSpeed,
        language: languageCode,
        textLength: text.length,
        cached: false,
      })
    }
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
      voices: GEMINI_PRO_VOICES,
      defaultVoice: "Achernar",
      supportedLanguages: ["tr", "en", "de", "fr", "es", "pt", "ru", "zh"],
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
