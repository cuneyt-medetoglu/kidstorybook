/**
 * Gemini TTS: Google Cloud fiyatlandırması token bazlı; REST yanıtında USD yok.
 * Kaynak: cloud.google.com/text-to-speech/pricing (Gemini-TTS)
 *
 * - Girdi: metin token’ı (yaklaşık: karakter/4, Latince metin için yaygın sezgisel)
 * - Çıktı: 25 ses token’ı / saniye ses; süre MP3 boyutundan kabaca tahmin
 */

const GEMINI_FLASH_TTS = {
  inputPer1M: 0.5,
  outputPer1M: 10.0,
}

const GEMINI_PRO_TTS = {
  inputPer1M: 1.0,
  outputPer1M: 20.0,
}

const AUDIO_TOKENS_PER_SECOND = 25
/** Konuşma MP3 için kabaca bayt/saniye (tahmini süre; fatura ses uzunluğuna göre) */
const BYTES_PER_SECOND_ESTIMATE = 12_000

function ratesForModel(modelName: string) {
  return modelName.toLowerCase().includes('flash') ? GEMINI_FLASH_TTS : GEMINI_PRO_TTS
}

/**
 * Tahmini USD: resmi $/1M token oranları + API’den gelmeyen süre için buffer boyutu.
 */
export function geminiTtsCostUsdEstimate(
  modelName: string,
  text: string,
  audioBuffer: Buffer
): number {
  const r = ratesForModel(modelName)
  const inputTokens = Math.max(1, Math.round(text.length / 4))
  const audioSeconds = Math.max(0.05, audioBuffer.length / BYTES_PER_SECOND_ESTIMATE)
  const outputTokens = audioSeconds * AUDIO_TOKENS_PER_SECOND

  return (
    (inputTokens / 1_000_000) * r.inputPer1M + (outputTokens / 1_000_000) * r.outputPer1M
  )
}
