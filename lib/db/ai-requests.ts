/**
 * @file AI request logging — database helpers.
 * Stores every AI API call for cost tracking and error analysis.
 */

import { pool } from './pool'

// ============================================================================
// Types
// ============================================================================

export type AIOperationType =
  | 'story_generation'
  | 'image_cover'
  | 'image_page'
  | 'image_master'
  | 'image_entity'
  | 'image_edit'
  | 'character_analysis'
  | 'tts'

export type AIProvider = 'openai' | 'google'
export type AIRequestStatus = 'success' | 'error' | 'partial'

export interface InsertAIRequestParams {
  userId: string
  bookId?: string | null
  characterId?: string | null
  operationType: AIOperationType
  provider?: AIProvider
  model: string
  promptVersion?: string | null
  pageIndex?: number | null
  status: AIRequestStatus
  errorMessage?: string | null
  inputTokens?: number | null
  outputTokens?: number | null
  imageCount?: number | null
  charCount?: number | null
  costUsd?: number | null
  durationMs?: number | null
  requestMeta?: Record<string, unknown> | null
  responseMeta?: Record<string, unknown> | null
}

// ============================================================================
// Insert
// ============================================================================

/**
 * Inserts one AI request log record.
 * Never throws — errors are swallowed so logging never blocks the main flow.
 */
export async function insertAIRequest(params: InsertAIRequestParams): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO ai_requests (
        user_id, book_id, character_id,
        operation_type, provider, model, prompt_version, page_index,
        status, error_message,
        input_tokens, output_tokens, image_count, char_count, cost_usd,
        duration_ms, request_meta, response_meta
      ) VALUES (
        $1, $2, $3,
        $4, $5, $6, $7, $8,
        $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, $18
      )`,
      [
        params.userId,
        params.bookId ?? null,
        params.characterId ?? null,
        params.operationType,
        params.provider ?? 'openai',
        params.model,
        params.promptVersion ?? null,
        params.pageIndex ?? null,
        params.status,
        params.errorMessage ?? null,
        params.inputTokens ?? null,
        params.outputTokens ?? null,
        params.imageCount ?? 1,
        params.charCount ?? null,
        params.costUsd ?? null,
        params.durationMs ?? null,
        params.requestMeta ? JSON.stringify(params.requestMeta) : null,
        params.responseMeta ? JSON.stringify(params.responseMeta) : null,
      ]
    )
  } catch (err) {
    console.warn('[ai-requests] Failed to log AI request:', err)
  }
}

// ============================================================================
// Queries (admin / reporting)
// ============================================================================

export interface AICostSummary {
  operationType: AIOperationType
  totalRequests: number
  successCount: number
  errorCount: number
  totalCostUsd: number
  avgDurationMs: number
}

/** Daily cost summary grouped by operation type. */
export async function getAICostSummary(
  fromDate: Date,
  toDate: Date
): Promise<AICostSummary[]> {
  const result = await pool.query(
    `SELECT
       operation_type                          AS "operationType",
       COUNT(*)::int                           AS "totalRequests",
       COUNT(*) FILTER (WHERE status = 'success')::int AS "successCount",
       COUNT(*) FILTER (WHERE status = 'error')::int   AS "errorCount",
       COALESCE(SUM(cost_usd), 0)::float       AS "totalCostUsd",
       COALESCE(AVG(duration_ms), 0)::int      AS "avgDurationMs"
     FROM ai_requests
     WHERE created_at >= $1 AND created_at <= $2
     GROUP BY operation_type
     ORDER BY "totalCostUsd" DESC`,
    [fromDate, toDate]
  )
  return result.rows
}

/** Per-user cost summary (top spenders). */
export async function getAICostByUser(
  fromDate: Date,
  toDate: Date,
  limit = 50
): Promise<Array<{ userId: string; totalCostUsd: number; totalRequests: number }>> {
  const result = await pool.query(
    `SELECT
       user_id::text          AS "userId",
       COALESCE(SUM(cost_usd), 0)::float AS "totalCostUsd",
       COUNT(*)::int          AS "totalRequests"
     FROM ai_requests
     WHERE created_at >= $1 AND created_at <= $2
     GROUP BY user_id
     ORDER BY "totalCostUsd" DESC
     LIMIT $3`,
    [fromDate, toDate, limit]
  )
  return result.rows
}

/** All AI requests for a single book with totals. */
export async function getAIRequestsByBook(bookId: string): Promise<{
  rows: Array<{
    operationType: AIOperationType
    model: string
    status: AIRequestStatus
    costUsd: number | null
    durationMs: number | null
    pageIndex: number | null
    createdAt: Date
  }>
  totalCostUsd: number
}> {
  const result = await pool.query(
    `SELECT
       operation_type  AS "operationType",
       model,
       status,
       cost_usd        AS "costUsd",
       duration_ms     AS "durationMs",
       page_index      AS "pageIndex",
       created_at      AS "createdAt"
     FROM ai_requests
     WHERE book_id = $1
     ORDER BY created_at ASC`,
    [bookId]
  )
  const totalCostUsd = result.rows.reduce(
    (sum: number, r: { costUsd: number | null }) => sum + (r.costUsd ?? 0),
    0
  )
  return { rows: result.rows, totalCostUsd }
}
