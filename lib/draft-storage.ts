/**
 * Draft Storage Helper
 * Manages draft cover storage in localStorage and provides API for database sync
 */

// Character form data type (from wizard step1)
export interface CharacterFormData {
  name: string
  age: number
  gender: "boy" | "girl"
  hairColor: string
  eyeColor: string
  /** Optional; present when syncing from wizard (multiple characters) */
  characterIds?: string[]
  /** Optional; from step3 */
  ageGroup?: string
}

// Draft data structure
export interface DraftData {
  draftId: string
  coverImage: string
  characterData: CharacterFormData
  theme: string
  subTheme?: string
  style: string
  createdAt: string
  expiresAt: string
  // Optional: Additional wizard state
  wizardState?: {
    step1?: CharacterFormData
    step2?: any // Character photos
    step3?: { theme: string; subTheme?: string; ageGroup?: string; language?: string }
    step4?: { style: string }
    step5?: { customRequest?: string }
  }
}

const DRAFT_STORAGE_KEY = "kidstorybook_drafts"
const DRAFT_EXPIRY_DAYS = 30

/**
 * Generate a unique draft ID
 */
function generateDraftId(): string {
  return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Save draft to localStorage
 * @param draft Draft data (draftId will be generated if not provided)
 * @returns Draft ID
 */
export function saveDraftToLocalStorage(draft: Omit<DraftData, "draftId" | "createdAt" | "expiresAt">): string {
  try {
    const draftId = generateDraftId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + DRAFT_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    const draftData: DraftData = {
      ...draft,
      draftId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    }

    // Get existing drafts
    const existingDrafts = getAllDraftsFromLocalStorage()

    // Add new draft
    const updatedDrafts = [...existingDrafts, draftData]

    // Save to localStorage
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedDrafts))

    return draftId
  } catch (error) {
    console.error("[DraftStorage] Error saving draft:", error)
    throw error
  }
}

/**
 * Get draft from localStorage by ID
 * @param draftId Draft ID
 * @returns Draft data or null if not found/expired
 */
export function getDraftFromLocalStorage(draftId: string): DraftData | null {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!saved) return null

    const drafts: DraftData[] = JSON.parse(saved)
    const draft = drafts.find((d) => d.draftId === draftId)

    if (!draft) return null

    // Check if expired
    const expiresAt = new Date(draft.expiresAt)
    if (expiresAt < new Date()) {
      // Draft expired, remove it
      deleteDraftFromLocalStorage(draftId)
      return null
    }

    return draft
  } catch (error) {
    console.error("[DraftStorage] Error getting draft:", error)
    return null
  }
}

/**
 * Get all drafts from localStorage
 * @returns Array of draft data (non-expired)
 */
export function getAllDraftsFromLocalStorage(): DraftData[] {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!saved) return []

    const drafts: DraftData[] = JSON.parse(saved)
    const now = new Date()

    // Filter out expired drafts
    const validDrafts = drafts.filter((draft) => {
      const expiresAt = new Date(draft.expiresAt)
      return expiresAt >= now
    })

    // If some drafts were expired, update localStorage
    if (validDrafts.length !== drafts.length) {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(validDrafts))
    }

    return validDrafts
  } catch (error) {
    console.error("[DraftStorage] Error getting all drafts:", error)
    return []
  }
}

/**
 * Delete draft from localStorage
 * @param draftId Draft ID
 */
export function deleteDraftFromLocalStorage(draftId: string): void {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!saved) return

    const drafts: DraftData[] = JSON.parse(saved)
    const updatedDrafts = drafts.filter((d) => d.draftId !== draftId)

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedDrafts))
  } catch (error) {
    console.error("[DraftStorage] Error deleting draft:", error)
  }
}

/**
 * Clean expired drafts from localStorage
 * @returns Number of drafts removed
 */
export function cleanExpiredDrafts(): number {
  try {
    const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!saved) return 0

    const drafts: DraftData[] = JSON.parse(saved)
    const now = new Date()

    const validDrafts = drafts.filter((draft) => {
      const expiresAt = new Date(draft.expiresAt)
      return expiresAt >= now
    })

    const removedCount = drafts.length - validDrafts.length

    if (removedCount > 0) {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(validDrafts))
    }

    return removedCount
  } catch (error) {
    console.error("[DraftStorage] Error cleaning expired drafts:", error)
    return 0
  }
}

/**
 * Transfer draft from localStorage to database (via API)
 * @param draftId Draft ID
 * @returns Success status
 */
export async function transferDraftToDatabase(draftId: string): Promise<boolean> {
  try {
    const draft = getDraftFromLocalStorage(draftId)
    if (!draft) {
      console.error("[DraftStorage] Draft not found:", draftId)
      return false
    }

    // Call API to save draft to database
    const response = await fetch("/api/drafts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draft),
    })

    if (!response.ok) {
      console.error("[DraftStorage] Failed to transfer draft:", response.statusText)
      return false
    }

    // Draft transferred successfully, remove from localStorage
    deleteDraftFromLocalStorage(draftId)

    return true
  } catch (error) {
    console.error("[DraftStorage] Error transferring draft:", error)
    return false
  }
}
