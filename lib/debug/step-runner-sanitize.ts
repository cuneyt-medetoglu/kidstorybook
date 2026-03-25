/**
 * Step-runner debug çıktıları: tam metin ve yapı korunur; yalnızca log'u şişiren
 * base64 ve görsel URL'leri (ve data: URL) kısa notlarla değiştirilir.
 */

export interface StepRunnerTraceEntry {
  step: string
  request: unknown
  response: unknown
}

function looksLikeBase64Chunk(s: string): boolean {
  if (s.length < 256) return false
  if (s.length % 4 !== 0 && s.length % 4 !== 1) return false
  return /^[A-Za-z0-9+/=\r\n]+$/.test(s.slice(0, Math.min(s.length, 500)))
}

function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s.trim())
}

/**
 * multipart/form-data → prompt vb. tam string; dosyalar yalnızca meta (içerik yok).
 */
export function formDataToDebugRecord(fd: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of fd.entries()) {
    if (typeof value === 'string') {
      const cur = out[key]
      if (cur === undefined) out[key] = value
      else if (Array.isArray(cur)) (cur as unknown[]).push(value)
      else out[key] = [cur, value]
    } else {
      const fileSummary = {
        _type: 'file',
        name: value.name,
        size: value.size,
        mime: value.type,
      }
      const cur = out[key]
      if (cur === undefined) out[key] = fileSummary
      else if (Array.isArray(cur)) (cur as unknown[]).push(fileSummary)
      else out[key] = [cur, fileSummary]
    }
  }
  return out
}

/**
 * Step-runner JSON çıktısı için derin sanitize: uzun metin kesilmez;
 * base64, data: URL ve http(s) görsel URL'leri not ile değiştirilir.
 */
export function sanitizeForStepRunnerDebug(value: unknown, keyHint?: string): unknown {
  if (value === null || value === undefined) return value
  if (typeof value === 'boolean' || typeof value === 'number') return value

  if (typeof value === 'string') {
    if (value.startsWith('data:') && value.includes('base64')) {
      return { _omitted: 'data_url_with_base64', lengthChars: value.length }
    }
    if (keyHint === 'b64_json' || (keyHint?.toLowerCase().includes('b64') && value.length > 64)) {
      return { _omitted: 'b64_json', lengthChars: value.length }
    }
    if (looksLikeBase64Chunk(value)) {
      return { _omitted: 'probable_base64_string', lengthChars: value.length }
    }
    const k = keyHint?.toLowerCase() || ''
    if (
      (k === 'url' || k.endsWith('_url') || k === 'imageurl' || k === 'audio_url') &&
      isHttpUrl(value)
    ) {
      return { _omitted: 'http_url', lengthChars: value.length, hint: 'URL logda gösterilmez (okunabilirlik)' }
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item, i) => sanitizeForStepRunnerDebug(item, keyHint))
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj)) {
      const lower = k.toLowerCase()
      if (lower === 'b64_json') {
        out[k] =
          typeof v === 'string'
            ? { _omitted: 'b64_json', lengthChars: v.length }
            : sanitizeForStepRunnerDebug(v, k)
        continue
      }
      if (lower === 'url' && typeof v === 'string' && isHttpUrl(v)) {
        out[k] = { _omitted: 'url', lengthChars: v.length, hint: 'Görsel URL logda gösterilmez' }
        continue
      }
      out[k] = sanitizeForStepRunnerDebug(v, k)
    }
    return out
  }

  return value
}

export function sanitizeDebugTraceEntries(entries: StepRunnerTraceEntry[] | null | undefined): StepRunnerTraceEntry[] {
  if (!entries?.length) return []
  return entries.map((e) => ({
    step: e.step,
    request: sanitizeForStepRunnerDebug(e.request) as unknown,
    response: sanitizeForStepRunnerDebug(e.response) as unknown,
  }))
}

/** OpenAI SDK / serileştirilebilir nesneleri düz JSON'a çevirir */
export function toPlainJson(value: unknown): unknown {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return { _error: 'serialize_failed', preview: String(value).slice(0, 200) }
  }
}
