/**
 * @file OpenAI Chat Completions wrapper with automatic request logging.
 *
 * Usage:
 *   import { chatWithLog } from '@/lib/ai/chat'
 *
 *   const completion = await chatWithLog(openai, params, {
 *     userId: user.id,
 *     bookId: book.id,
 *     operationType: 'story_generation',
 *     promptVersion: 'v2.5.0',
 *   })
 *
 * Logging is fire-and-forget. A logging failure never throws or blocks the caller.
 */

import type OpenAI from 'openai'
import { insertAIRequest, type AIOperationType } from '@/lib/db/ai-requests'
import { chatCostUsdFromUsage } from '@/lib/pricing/openai-usage-cost'

// ============================================================================
// Context
// ============================================================================

export interface ChatLogContext {
  userId: string
  bookId?: string | null
  characterId?: string | null
  operationType: AIOperationType
  promptVersion?: string | null
  requestMeta?: Record<string, unknown>
}

// ============================================================================
// Wrapper
// ============================================================================

/**
 * Wraps `openai.chat.completions.create()` and logs the request to `ai_requests`.
 * Returns the original OpenAI response unchanged.
 */
export async function chatWithLog(
  openai: OpenAI,
  params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  ctx: ChatLogContext
): Promise<OpenAI.Chat.ChatCompletion> {
  const startedAt = Date.now()
  let completion: OpenAI.Chat.ChatCompletion
  let status: 'success' | 'error' = 'success'
  let errorMessage: string | null = null

  try {
    completion = await openai.chat.completions.create(params)
  } catch (err) {
    status = 'error'
    errorMessage = err instanceof Error ? err.message : String(err)
    const durationMs = Date.now() - startedAt

    void insertAIRequest({
      userId: ctx.userId,
      bookId: ctx.bookId,
      characterId: ctx.characterId,
      operationType: ctx.operationType,
      provider: 'openai',
      model: params.model,
      promptVersion: ctx.promptVersion,
      status: 'error',
      errorMessage,
      durationMs,
      requestMeta: ctx.requestMeta,
    })

    throw err
  }

  const durationMs = Date.now() - startedAt
  const usage = completion.usage
  const inputTokens = usage?.prompt_tokens ?? 0
  const outputTokens = usage?.completion_tokens ?? 0
  const costUsd = chatCostUsdFromUsage(params.model, usage)

  void insertAIRequest({
    userId: ctx.userId,
    bookId: ctx.bookId,
    characterId: ctx.characterId,
    operationType: ctx.operationType,
    provider: 'openai',
    model: params.model,
    promptVersion: ctx.promptVersion,
    status,
    errorMessage,
    inputTokens,
    outputTokens,
    costUsd,
    durationMs,
    requestMeta: ctx.requestMeta,
    responseMeta: { usage, finishReason: completion.choices[0]?.finish_reason },
  })

  return completion
}
