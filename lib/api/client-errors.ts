/**
 * Client-side API Error Message Helper
 *
 * Maps API error codes (returned in `code` field of APIError responses)
 * to `errors.*` translation keys.
 *
 * Usage:
 *   const t = useTranslations("errors")
 *   const message = getApiErrorMessage(result.code, t, result.error)
 */

/** Map of API error codes → errors.* translation keys */
const ERROR_CODE_TO_KEY: Record<string, string> = {
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "notFound",
  BAD_REQUEST: "badRequest",
  VALIDATION_ERROR: "validation",
  INTERNAL_ERROR: "server",
  SERVICE_UNAVAILABLE: "unavailable",
  RATE_LIMIT: "rateLimit",
}

/**
 * Returns a translated error message for the given API error code.
 * Falls back to `fallback` (if provided), then to `errors.unexpected`.
 */
export function getApiErrorMessage(
  code: string | undefined,
  t: (key: string) => string,
  fallback?: string
): string {
  if (code && ERROR_CODE_TO_KEY[code]) {
    return t(ERROR_CODE_TO_KEY[code])
  }
  return fallback ?? t("unexpected")
}

/**
 * Returns a translated error message from an API error response object.
 * Prefers the error code for translation, falls back to raw `error` string.
 */
export function getApiResponseError(
  response: { code?: string; error?: string } | null | undefined,
  t: (key: string) => string
): string {
  if (!response) return t("unexpected")
  return getApiErrorMessage(response.code, t, response.error)
}
