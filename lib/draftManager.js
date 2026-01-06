/**
 * Draft Manager - Handles saving and loading journal drafts to localStorage
 * This prevents data loss when users go offline
 */

const DRAFT_KEY = 'journal_draft'
const MAX_DRAFT_AGE_DAYS = 7 // Drafts older than 7 days are considered stale

/**
 * Save draft to localStorage
 * @param {Object} draft - Draft object with journal entry data
 * @returns {boolean} - True if saved successfully
 */
export const draftManager = {
  saveDraft: (draft) => {
    try {
      const draftWithTimestamp = {
        ...draft,
        savedAt: new Date().toISOString(),
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftWithTimestamp))
      return true
    } catch (error) {
      console.error('Failed to save draft:', error)
      
      // Check if localStorage is full
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn('localStorage is full. Cannot save draft.')
        return false
      }
      
      return false
    }
  },

  /**
   * Load draft from localStorage
   * @returns {Object|null} - Draft object or null if no draft exists
   */
  loadDraft: () => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      if (!draft) return null

      const parsedDraft = JSON.parse(draft)
      
      // Check if draft is too old
      const savedAt = new Date(parsedDraft.savedAt)
      const now = new Date()
      const daysDiff = (now - savedAt) / (1000 * 60 * 60 * 24)
      
      if (daysDiff > MAX_DRAFT_AGE_DAYS) {
        // Draft is stale, clear it
        localStorage.removeItem(DRAFT_KEY)
        return null
      }
      
      return parsedDraft
    } catch (error) {
      console.error('Failed to load draft:', error)
      return null
    }
  },

  /**
   * Clear draft after successful save
   * @returns {boolean} - True if cleared successfully
   */
  clearDraft: () => {
    try {
      localStorage.removeItem(DRAFT_KEY)
      return true
    } catch (error) {
      console.error('Failed to clear draft:', error)
      return false
    }
  },

  /**
   * Check if draft exists
   * @returns {boolean} - True if draft exists
   */
  hasDraft: () => {
    try {
      return localStorage.getItem(DRAFT_KEY) !== null
    } catch (error) {
      console.error('Failed to check draft:', error)
      return false
    }
  },

  /**
   * Get draft age in hours
   * @returns {number|null} - Age in hours or null if no draft
   */
  getDraftAge: () => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY)
      if (!draft) return null

      const parsedDraft = JSON.parse(draft)
      const savedAt = new Date(parsedDraft.savedAt)
      const now = new Date()
      const hoursDiff = (now - savedAt) / (1000 * 60 * 60)
      
      return Math.round(hoursDiff)
    } catch (error) {
      console.error('Failed to get draft age:', error)
      return null
    }
  },
}


