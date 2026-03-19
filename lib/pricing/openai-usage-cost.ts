/**
 * Maliyet: OpenAI yanıtındaki `usage` (token) + openai.com/api/pricing fiyatları.
 * API çoğu uçta USD döndürmez; faturalama bu token sayıları üzerinden yapılır.
 *
 * Güncelleme: OpenAI fiyat sayfası değişince aşağıdaki sabitleri güncelle.
 */

/** GPT-4o mini — https://openai.com/api/pricing */
const GPT_4O_MINI = {
  inputPer1M: 0.15,
  cachedInputPer1M: 0.075,
  outputPer1M: 0.6,
}

/** GPT-4o */
const GPT_4O = {
  inputPer1M: 2.5,
  cachedInputPer1M: 1.25,
  outputPer1M: 10.0,
}

/** o1-mini */
const O1_MINI = {
  inputPer1M: 1.1,
  cachedInputPer1M: 0.55,
  outputPer1M: 4.4,
}

function textModelRates(model: string): {
  inputPer1M: number
  cachedInputPer1M: number
  outputPer1M: number
} | null {
  const m = model.toLowerCase()
  if (m.includes('gpt-4o-mini')) return GPT_4O_MINI
  if (m.includes('gpt-4o') && !m.includes('mini')) return GPT_4O
  if (m.includes('o1-mini')) return O1_MINI
  return null
}

/** `chat.completions.create` yanıtındaki `usage` ile uyumlu alanlar */
export type ChatCompletionUsageLike = {
  prompt_tokens?: number
  completion_tokens?: number
  prompt_tokens_details?: { cached_tokens?: number }
} | null | undefined

/**
 * Chat Completions: `completion.usage` üzerinden tahmini USD (resmi token fiyatları).
 */
export function chatCostUsdFromUsage(model: string, usage: ChatCompletionUsageLike): number {
  if (!usage) return 0
  const rates = textModelRates(model)
  if (!rates) return 0

  const prompt = usage.prompt_tokens ?? 0
  const completion = usage.completion_tokens ?? 0
  const cached = usage.prompt_tokens_details?.cached_tokens ?? 0
  const uncachedPrompt = Math.max(0, prompt - cached)

  return (
    (uncachedPrompt * rates.inputPer1M +
      cached * rates.cachedInputPer1M +
      completion * rates.outputPer1M) /
    1_000_000
  )
}

/** Images API `usage` (gpt-image modelleri) — platform.openai.com/docs/api-reference/images */
export interface OpenAIImageUsage {
  input_tokens?: number
  output_tokens?: number
  total_tokens?: number
  input_tokens_details?: { image_tokens?: number; text_tokens?: number }
  output_tokens_details?: { image_tokens?: number; text_tokens?: number }
}

/**
 * GPT-image-1.5 token fiyatları — Image Generation API bölümü (Text / Image modality)
 * https://openai.com/api/pricing
 */
const GPT_IMAGE_15 = {
  text: { inPer1M: 5.0, outPer1M: 10.0 },
  image: { inPer1M: 8.0, outPer1M: 32.0 },
}

const GPT_IMAGE_1 = {
  text: { inPer1M: 5.0, outPer1M: 10.0 },
  image: { inPer1M: 10.0, outPer1M: 40.0 },
}

const GPT_IMAGE_1_MINI = {
  text: { inPer1M: 2.0, outPer1M: 4.0 },
  image: { inPer1M: 2.5, outPer1M: 8.0 },
}

function imageModelRates(model: string) {
  const m = model.toLowerCase()
  if (m.includes('gpt-image-1.5')) return GPT_IMAGE_15
  if (m.includes('gpt-image-1-mini')) return GPT_IMAGE_1_MINI
  if (m.includes('gpt-image-1')) return GPT_IMAGE_1
  return null
}

/**
 * Images generations/edits JSON `usage` alanından tahmini USD.
 * `usage` yoksa 0 (tahmini görsel başına fiyat kullanılmaz).
 */
export function imageCostUsdFromUsage(
  model: string,
  usage: OpenAIImageUsage | null | undefined,
  opts?: { kind: 'edit' | 'generate' }
): number {
  if (!usage) return 0
  const rates = imageModelRates(model)
  if (!rates) return 0

  const kind = opts?.kind ?? 'edit'
  let textIn = usage.input_tokens_details?.text_tokens ?? 0
  let imageIn = usage.input_tokens_details?.image_tokens ?? 0
  let textOut = usage.output_tokens_details?.text_tokens ?? 0
  let imageOut = usage.output_tokens_details?.image_tokens ?? 0

  const inTotal = usage.input_tokens ?? 0
  const outTotal = usage.output_tokens ?? 0

  if (textIn === 0 && imageIn === 0 && inTotal > 0) {
    if (kind === 'generate') {
      textIn = inTotal
    } else {
      imageIn = inTotal
    }
  }
  if (textOut === 0 && imageOut === 0 && outTotal > 0) {
    imageOut = outTotal
  }

  const textCost =
    (textIn / 1_000_000) * rates.text.inPer1M + (textOut / 1_000_000) * rates.text.outPer1M
  const imageCost =
    (imageIn / 1_000_000) * rates.image.inPer1M + (imageOut / 1_000_000) * rates.image.outPer1M

  return textCost + imageCost
}
