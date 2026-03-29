/**
 * OpenAI model sabitleri — tek kaynak (C1)
 *
 * Tüm model adlarını buradan import et. Hardcoded string kullanma.
 *
 * Chat Completions ve Images API ayrı ürünlerdir; isimlendirme farklıdır:
 *   Chat → gpt-4.1-mini, gpt-4o vb.
 *   Images → gpt-image-1.5, gpt-image-1 vb.
 */

// ---------------------------------------------------------------------------
// Story / Chat modelleri — story-generation-config tek kaynak olmaya devam eder;
// buradan re-export edilir, tüketiciler sadece bu dosyadan import eder.
// ---------------------------------------------------------------------------
/**
 * Chat model **mantıksal adı** (örn. `gpt-4.1-mini`). API yanıtında OpenAI genelde
 * tam sürüm kimliği döner (örn. `gpt-4.1-mini-2025-04-14`) — bu bir hata değil;
 * aynı modelin anlık snapshot’ıdır. “En yeni” tarih kullanıcı kodunda seçilmez;
 * OpenAI hangi sürümü route ediyorsa response.model’de görünür.
 */
export {
  ALLOWED_STORY_MODELS,
  DEFAULT_STORY_MODEL,
  STORY_GENERATION_MAX_OUTPUT_TOKENS,
  STORY_GENERATION_PROMPT_VERSION,
  type AllowedStoryModel,
} from './story-generation-config'

// ---------------------------------------------------------------------------
// Vision / Description modeli
// Görev: from-example kapak sahnesi açıklaması, hafif image-to-text işleri.
// ---------------------------------------------------------------------------
export const DEFAULT_VISION_MODEL = 'gpt-4o-mini' as const

// ---------------------------------------------------------------------------
// Karakter analiz modeli
// Görev: fiziksel özellik çıkarımı, yüksek kalite vision analizi.
// ---------------------------------------------------------------------------
export const DEFAULT_CHARACTER_ANALYSIS_MODEL = 'gpt-4o' as const

// ---------------------------------------------------------------------------
// Images API — görsel piksel üretimi
// gpt-image-1.5: sayfa + master + entity + kapak (Books pipeline)
// gpt-image-1:   bağımsız kapak düzenleme endpoint'i (daha esnek edit API)
// ---------------------------------------------------------------------------
export const DEFAULT_IMAGE_MODEL = 'gpt-image-1.5' as const
export const DEFAULT_COVER_EDIT_MODEL = 'gpt-image-1' as const

// Varsayılan boyut ve kalite — portrait kitap formatı
export const DEFAULT_IMAGE_SIZE = '1024x1536' as const
export const DEFAULT_IMAGE_QUALITY = 'low' as const
