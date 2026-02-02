/**
 * Merkezi logger – NODE_ENV ve opsiyonel env flag ile kontrol.
 * Development'ta log açık; production'da kapalı (env ile açılabilir).
 *
 * @file lib/logger.ts
 * @see docs/guides/LOGGING_GUIDE.md
 */

const isDev = process.env.NODE_ENV === "development"

/** Client (tarayıcı): NEXT_PUBLIC_ENABLE_LOGGING=true ise production'da da log açık */
const clientLogEnabled =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_ENABLE_LOGGING === "true"

/** Server (API routes, getServerSideProps): DEBUG_LOGGING=true ise production'da da log açık */
const serverLogEnabled =
  typeof window === "undefined" && process.env.DEBUG_LOGGING === "true"

/** Debug/info logları sadece development veya env flag ile göster */
const isLogEnabled = isDev || clientLogEnabled || serverLogEnabled

function noop() {}

const logger = {
  /** Geliştirme / bilgi logları – production'da kapalı (env ile açılabilir) */
  info: isLogEnabled ? (...args: unknown[]) => console.log("[INFO]", ...args) : noop,
  /** Debug logları – production'da kapalı */
  debug: isLogEnabled ? (...args: unknown[]) => console.debug("[DEBUG]", ...args) : noop,
  /** Uyarı – her zaman loglanır (production'da da) */
  warn: (...args: unknown[]) => console.warn("[WARN]", ...args),
  /** Hata – her zaman loglanır (production'da da) */
  error: (...args: unknown[]) => console.error("[ERROR]", ...args),
}

export default logger
