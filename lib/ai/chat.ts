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

// ============================================================================
// Pricing
// ============================================================================

const CHAT_COST_PER_1M: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o':      { input: 2.50, output: 10.00 },
  'o1-mini':     { input: 1.10, output: 4.40 },
}

function calcChatCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = CHAT_COST_PER_1M[model]
  if (!pricing) return 0
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000
}

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
  const costUsd = calcChatCost(params.model, inputTokens, outputTokens)

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
    responseMeta: {
      finishReason: completion.choices[0]?.finish_reason,
      cachedTokens: (usage as Record<string, unknown>)?.prompt_tokens_details
        ? ((usage as Record<string, unknown>).prompt_tokens_details as Record<string, unknown>)?.cached_tokens
        : undefined,
    },
  })

  return completion
}
