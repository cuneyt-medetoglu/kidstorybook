import { VERSION as STORY_PROMPT_VERSION_INFO } from '@/lib/prompts/story/base'

/**
 * Story generation (Chat Completions) — tek yerden story varsayılanları.
 * Uzun JSON (12 sayfa + sceneMap + imagePrompt) için kesilme riskini azaltır.
 *
 * OpenAI dokümantasyonunda `max_tokens` yerine `max_completion_tokens`
 * önerildiği için bu değer o alanla kullanılmalıdır.
 */
export const ALLOWED_STORY_MODELS = [
  'gpt-4o-mini',
  'gpt-4.1-mini',
  'gpt-4.1',
  'gpt-4o',
  'o1-mini',
] as const

export type AllowedStoryModel = typeof ALLOWED_STORY_MODELS[number]

export const DEFAULT_STORY_MODEL: AllowedStoryModel = 'gpt-4.1'

/**
 * gpt-4.1-mini için güvenli üst sınır; başka model seçilirse limit farklı olabilir.
 */
export const STORY_GENERATION_MAX_OUTPUT_TOKENS = 30_000

/**
 * Request log ve DB metadata tarafında gerçek prompt sürümünü tek kaynaktan kullan.
 */
export const STORY_GENERATION_PROMPT_VERSION = STORY_PROMPT_VERSION_INFO.version
