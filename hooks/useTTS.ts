"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface TTSOptions {
  voiceId?: string
  speed?: number
  volume?: number
  language?: string // PRD language code (tr, en, de, fr, es, pt, ru, zh)
}

interface UseTTSReturn {
  isPlaying: boolean
  isPaused: boolean
  isLoading: boolean
  error: string | null
  currentWordIndex: number
  play: (text: string, options?: TTSOptions) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  setVolume: (volume: number) => void
  setSpeed: (speed: number) => void
  onEnded: (callback: () => void) => void
}

export function useTTS(): UseTTSReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [currentText, setCurrentText] = useState<string>("")
  const [words, setWords] = useState<string[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentOptionsRef = useRef<TTSOptions>({})
  const onEndedCallbackRef = useRef<(() => void) | null>(null)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    const handleEnded = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentWordIndex(-1)
      // Call the onEnded callback if it exists
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current()
      }
    }
    audioRef.current.addEventListener("ended", handleEnded)
    audioRef.current.addEventListener("error", (e) => {
      setError("Audio playback error")
      setIsPlaying(false)
      setIsPaused(false)
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded)
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const play = useCallback(async (text: string, options: TTSOptions = {}) => {
    try {
      setIsLoading(true)
      setError(null)
      setCurrentText(text)
      setWords(text.split(/\s+/))

      const { voiceId = "Achernar", speed = 1.0, volume = 1.0, language = "en" } = options
      currentOptionsRef.current = { voiceId, speed, volume, language }

      // Call TTS API
      const response = await fetch("/api/tts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          voiceId,
          speed,
          language,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate speech")
      }

      const data = await response.json()

      if (!data?.audioUrl || typeof data.audioUrl !== "string") {
        throw new Error("API did not return a valid audio URL")
      }

      if (!audioRef.current) {
        throw new Error("Audio element not initialized")
      }

      // Set volume/rate first; then set source and wait for load (fixes playback / CORS visibility)
      const el = audioRef.current
      el.volume = Math.max(0, Math.min(1, volume))
      el.playbackRate = speed

      await new Promise<void>((resolve, reject) => {
        let settled = false
        const settle = (fn: () => void) => {
          if (settled) return
          settled = true
          clearTimeout(tid)
          el.removeEventListener("canplaythrough", onCanPlay)
          el.removeEventListener("error", onError)
          fn()
        }
        const onCanPlay = () => settle(() => resolve())
        const onError = () => settle(() => reject(new Error("Ses yüklenemedi. Ağ veya CORS hatası olabilir.")))
        el.addEventListener("canplaythrough", onCanPlay, { once: true })
        el.addEventListener("error", onError, { once: true })
        const tid = setTimeout(() => {
          if (!settled) settle(() => reject(new Error("Ses yükleme zaman aşımı.")))
        }, 15000)
        el.src = data.audioUrl
        el.load()
      })

      // Play audio
      await audioRef.current.play()

      setIsPlaying(true)
      setIsPaused(false)
      setCurrentWordIndex(0)

      // Simulate word highlighting (simple approach)
      // In a more advanced implementation, we could use Web Speech API's word timing
      const wordCount = words.length
      const duration = audioRef.current.duration || 0
      const interval = duration / wordCount

      let wordIndex = 0
      const highlightInterval = setInterval(() => {
        if (wordIndex < wordCount && audioRef.current && !audioRef.current.paused) {
          setCurrentWordIndex(wordIndex)
          wordIndex++
        } else {
          clearInterval(highlightInterval)
        }
      }, interval * 1000)

      // Cleanup interval when audio ends
      audioRef.current.addEventListener("ended", () => {
        clearInterval(highlightInterval)
      })
    } catch (err: any) {
      setError(err.message || "Failed to play audio")
      setIsPlaying(false)
      setIsPaused(false)
    } finally {
      setIsLoading(false)
    }
  }, [words.length])

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPaused(true)
    }
  }, [isPlaying])

  const resume = useCallback(() => {
    if (audioRef.current && isPaused) {
      audioRef.current.play()
      setIsPaused(false)
    }
  }, [isPaused])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentWordIndex(-1)
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    const validVolume = Math.max(0, Math.min(1, volume))
    if (audioRef.current) {
      audioRef.current.volume = validVolume
    }
    currentOptionsRef.current.volume = validVolume
  }, [])

  const setSpeed = useCallback((speed: number) => {
    const validSpeed = Math.max(0.25, Math.min(4.0, speed))
    if (audioRef.current) {
      audioRef.current.playbackRate = validSpeed
    }
    currentOptionsRef.current.speed = validSpeed
  }, [])

  const onEnded = useCallback((callback: () => void) => {
    onEndedCallbackRef.current = callback
  }, [])

  return {
    isPlaying,
    isPaused,
    isLoading,
    error,
    currentWordIndex,
    play,
    pause,
    resume,
    stop,
    setVolume,
    setSpeed,
    onEnded,
  }
}

