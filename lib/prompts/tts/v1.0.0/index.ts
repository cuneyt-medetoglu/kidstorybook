/**
 * TTS Prompts - Version 1.0.0
 * Text-to-Speech prompts for all supported languages
 */

import { TURKISH_TTS_PROMPT } from './tr'
import { ENGLISH_TTS_PROMPT } from './en'
import { GERMAN_TTS_PROMPT } from './de'
import { FRENCH_TTS_PROMPT } from './fr'
import { SPANISH_TTS_PROMPT } from './es'
import { PORTUGUESE_TTS_PROMPT } from './pt'
import { RUSSIAN_TTS_PROMPT } from './ru'
import { CHINESE_TTS_PROMPT } from './zh'

/**
 * Language code mapping: PRD language codes → Gemini TTS language codes
 */
export const LANGUAGE_CODE_MAPPING: Record<string, string> = {
  'tr': 'tr-TR',
  'en': 'en-US',
  'de': 'de-DE',
  'fr': 'fr-FR',
  'es': 'es-ES',
  'pt': 'pt-BR',
  'ru': 'ru-RU',
  'zh': 'cmn-CN',
}

/**
 * TTS prompts for all supported languages
 */
const TTS_PROMPTS: Record<string, string> = {
  'tr': TURKISH_TTS_PROMPT,
  'en': ENGLISH_TTS_PROMPT,
  'de': GERMAN_TTS_PROMPT,
  'fr': FRENCH_TTS_PROMPT,
  'es': SPANISH_TTS_PROMPT,
  'pt': PORTUGUESE_TTS_PROMPT,
  'ru': RUSSIAN_TTS_PROMPT,
  'zh': CHINESE_TTS_PROMPT,
}

/**
 * Get Gemini TTS language code from PRD language code
 * @param prdLanguageCode - PRD language code (e.g., 'tr', 'en')
 * @returns Gemini TTS language code (e.g., 'tr-TR', 'en-US')
 */
export function getLanguageCode(prdLanguageCode: string): string {
  return LANGUAGE_CODE_MAPPING[prdLanguageCode] || 'en-US'
}

/**
 * Get TTS prompt for a specific language
 * @param prdLanguageCode - PRD language code (e.g., 'tr', 'en')
 * @returns TTS prompt string
 */
export function getPromptForLanguage(prdLanguageCode: string): string {
  return TTS_PROMPTS[prdLanguageCode] || ENGLISH_TTS_PROMPT
}

/**
 * Get all supported PRD language codes
 */
export function getSupportedLanguages(): string[] {
  return Object.keys(LANGUAGE_CODE_MAPPING)
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(prdLanguageCode: string): boolean {
  return prdLanguageCode in LANGUAGE_CODE_MAPPING
}
