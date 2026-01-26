/**
 * Wizard State Helper
 * Manages wizard state in localStorage and provides restore functionality from drafts
 */

import type { CharacterFormData } from "@/lib/draft-storage"
import { getDraftFromLocalStorage } from "@/lib/draft-storage"

// Wizard state structure
export interface WizardState {
  step1?: CharacterFormData
  step2?: {
    characters: Array<{
      name: string
      age?: number
      gender?: "boy" | "girl"
      photoUrl?: string
      role?: "main" | "supporting"
    }>
  }
  step3?: {
    theme: string
    subTheme?: string
    ageGroup?: string
    language?: string
  }
  step4?: {
    style: string
  }
  step5?: {
    customRequest?: string
    pageCount?: number
  }
}

const WIZARD_STATE_KEY = "kidstorybook_wizard_state"
const WIZARD_DRAFT_ID_KEY = "kidstorybook_wizard_draft_id"

/**
 * Save wizard state to localStorage
 * @param state Wizard state
 */
export function saveWizardState(state: WizardState): void {
  try {
    localStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error("[WizardState] Error saving wizard state:", error)
  }
}

/**
 * Load wizard state from localStorage
 * @returns Wizard state or null
 */
export function loadWizardState(): WizardState | null {
  try {
    const saved = localStorage.getItem(WIZARD_STATE_KEY)
    if (!saved) return null
    return JSON.parse(saved) as WizardState
  } catch (error) {
    console.error("[WizardState] Error loading wizard state:", error)
    return null
  }
}

/**
 * Clear wizard state from localStorage
 */
export function clearWizardState(): void {
  try {
    localStorage.removeItem(WIZARD_STATE_KEY)
    localStorage.removeItem(WIZARD_DRAFT_ID_KEY)
  } catch (error) {
    console.error("[WizardState] Error clearing wizard state:", error)
  }
}

/**
 * Restore wizard state from draft
 * @param draftId Draft ID
 * @returns Wizard state or null
 */
export function restoreWizardFromDraft(draftId: string): WizardState | null {
  try {
    const draft = getDraftFromLocalStorage(draftId)
    if (!draft) {
      // Try to fetch from API if not in localStorage
      return null // Will be handled by component
    }

    // Build wizard state from draft
    const wizardState: WizardState = {
      step1: draft.characterData,
      step3: {
        theme: draft.theme,
        subTheme: draft.subTheme,
      },
      step4: {
        style: draft.style,
      },
    }

    // If draft has wizardState, use it
    if (draft.wizardState) {
      return {
        ...wizardState,
        ...draft.wizardState,
      }
    }

    // Save draft ID for reference
    localStorage.setItem(WIZARD_DRAFT_ID_KEY, draftId)

    return wizardState
  } catch (error) {
    console.error("[WizardState] Error restoring wizard from draft:", error)
    return null
  }
}

/**
 * Get current draft ID from localStorage
 * @returns Draft ID or null
 */
export function getCurrentDraftId(): string | null {
  try {
    return localStorage.getItem(WIZARD_DRAFT_ID_KEY)
  } catch (error) {
    console.error("[WizardState] Error getting draft ID:", error)
    return null
  }
}

/**
 * Update specific step in wizard state
 * @param step Step number (1-5)
 * @param data Step data
 */
export function updateWizardStep(step: 1 | 2 | 3 | 4 | 5, data: any): void {
  try {
    const currentState = loadWizardState() || {}
    const newState: WizardState = {
      ...currentState,
      [`step${step}`]: data,
    }
    saveWizardState(newState)
  } catch (error) {
    console.error("[WizardState] Error updating wizard step:", error)
  }
}
