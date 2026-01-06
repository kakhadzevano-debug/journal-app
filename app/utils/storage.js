// Utility functions for storing and retrieving journal entries using Supabase

import { createClient } from '@/lib/supabase-client'
import { updateStreak, getStreakData } from '@/lib/streakUtils'
import { handleError, isOnline, waitForOnline } from '@/lib/errorHandler'
import { validateJournalEntry, sanitizeText, validateRating, MAX_TEXT_LENGTH, MIN_RATING, MAX_RATING } from '@/lib/validation'

const supabase = createClient()

// Get current user ID
async function getUserId() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw error
    }
    
    if (!user) {
      const authError = new Error('User not authenticated')
      authError.code = 'AUTH_REQUIRED'
      throw authError
    }
    
    return user.id
  } catch (error) {
    const handled = handleError(error, 'auth')
    const userError = new Error(handled.message)
    userError.code = 'AUTH_REQUIRED'
    throw userError
  }
}

export async function saveJournalEntry(entry, entryId = null, retryCount = 0) {
  const maxRetries = 2
  
  try {
    // Check network connection - wait a bit if just came online
    if (!isOnline()) {
      // If we just came online, wait a moment and check again
      if (retryCount === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (!isOnline()) {
          const error = new Error('No internet connection')
          const handled = handleError(error, 'save')
          throw new Error(handled.message)
        }
      } else {
        const error = new Error('No internet connection')
        const handled = handleError(error, 'save')
        throw new Error(handled.message)
      }
    }

    const userId = await getUserId()
    
    // Server-side validation
    const validation = validateJournalEntry(entry)
    if (!validation.valid) {
      const validationError = new Error(validation.errors[0] || 'Invalid journal entry data')
      validationError.code = 'VALIDATION_ERROR'
      throw validationError
    }
    
    // Sanitize and validate all inputs
    const sanitizedEntry = {
      ...entry,
      rating: validateRating(entry.rating),
      liked: sanitizeText(entry.liked),
      didntLike: sanitizeText(entry.didntLike),
      otherThoughts: sanitizeText(entry.otherThoughts),
      tomorrowPlans: sanitizeText(entry.tomorrowPlans)
    }
    
    // Validate date
    if (!sanitizedEntry.date || isNaN(new Date(sanitizedEntry.date).getTime())) {
      throw new Error('Invalid date')
    }
    
    // Generate a unique ID for new entries, or use provided ID for updates
    if (!entryId && !sanitizedEntry.id) {
      sanitizedEntry.id = crypto.randomUUID()
    } else if (entryId) {
      sanitizedEntry.id = entryId
    }

    // Check if we're updating an existing entry
    const { data: existingEntry, error: checkError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', sanitizedEntry.id)
      .eq('user_id', userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    const isNewEntry = !existingEntry

    // If updating an existing entry, preserve the original createdAt
    if (existingEntry && existingEntry.created_at) {
      sanitizedEntry.created_at = existingEntry.created_at
    } else if (!sanitizedEntry.created_at) {
      sanitizedEntry.created_at = new Date().toISOString()
    }

    // Prepare entry data (use sanitized values)
    const entryData = {
      id: sanitizedEntry.id,
      user_id: userId,
      date: sanitizedEntry.date,
      rating: sanitizedEntry.rating || null,
      liked: sanitizedEntry.liked || null,
      didnt_like: sanitizedEntry.didntLike || null,
      other_thoughts: sanitizedEntry.otherThoughts || null,
      tomorrow_plans: sanitizedEntry.tomorrowPlans || null,
      created_at: sanitizedEntry.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Upsert (insert or update)
    const { data, error } = await supabase
      .from('journal_entries')
      .upsert(entryData, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update streak ONLY for new entries (not edits)
    // Edits and deletes don't affect streak
    let streakResult = null
    if (isNewEntry) {
      try {
        streakResult = await updateStreak()
      } catch (streakError) {
        // Log streak error but don't fail the save operation
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating streak:', streakError)
        }
      }
    }

    return { id: data.id, streakResult, isNewEntry }
  } catch (error) {
    const handled = handleError(error, 'save')
    
    // Retry logic for network/database errors
    if (handled.canRetry && retryCount < maxRetries) {
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
      
      // Wait for online if offline
      if (!isOnline()) {
        await waitForOnline()
      }
      
      return saveJournalEntry(entry, entryId, retryCount + 1)
    }
    
    // Throw user-friendly error
    const userError = new Error(handled.message)
    userError.canRetry = handled.canRetry
    userError.technical = handled.technical
    throw userError
  }
}

export async function getJournalEntries(options = {}) {
  try {
    // Check network connection
    if (!isOnline()) {
      const error = new Error('No internet connection')
      const handled = handleError(error, 'load')
      throw new Error(handled.message)
    }

    const userId = await getUserId()
    const { limit, offset = 0 } = options

    // Build query - use count only if pagination is requested
    let query = supabase
      .from('journal_entries')
      .select('*', limit ? { count: 'exact' } : {})
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    // Add pagination if specified
    if (limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Transform database format to app format
    const transformedData = (data || []).map(entry => ({
      id: entry.id,
      date: entry.date,
      rating: entry.rating,
      liked: entry.liked,
      didntLike: entry.didnt_like,
      otherThoughts: entry.other_thoughts,
      tomorrowPlans: entry.tomorrow_plans,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
    }))

    // Return data with pagination info if limit is specified
    if (limit !== undefined) {
      return {
        entries: transformedData,
        hasMore: count !== null && count > offset + transformedData.length,
        total: count
      }
    }

    // Return array for backwards compatibility (no pagination)
    return transformedData
  } catch (error) {
    const handled = handleError(error, 'load')
    
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting journal entries:', {
        userMessage: handled.message,
        technical: handled.technical
      })
    }
    
    // Return appropriate format based on options
    return options.limit !== undefined ? { entries: [], hasMore: false, total: 0 } : []
  }
}

export async function getJournalEntryByDate(date) {
  try {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No entry found
        return null
      }
      throw error
    }

    if (!data) return null

    // Transform database format to app format
    return {
      id: data.id,
      date: data.date,
      rating: data.rating,
      liked: data.liked,
      didntLike: data.didnt_like,
      otherThoughts: data.other_thoughts,
      tomorrowPlans: data.tomorrow_plans,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting journal entry by date:', error)
    }
    return null
  }
}

export async function getJournalEntriesByDate(date) {
  try {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // Transform database format to app format
    return (data || []).map(entry => ({
      id: entry.id,
      date: entry.date,
      rating: entry.rating,
      liked: entry.liked,
      didntLike: entry.didnt_like,
      otherThoughts: entry.other_thoughts,
      tomorrowPlans: entry.tomorrow_plans,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
    }))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting journal entries by date:', error)
    }
    return []
  }
}

export async function getJournalEntryById(id) {
  try {
    const userId = await getUserId()

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    if (!data) return null

    // Transform database format to app format
    return {
      id: data.id,
      date: data.date,
      rating: data.rating,
      liked: data.liked,
      didntLike: data.didnt_like,
      otherThoughts: data.other_thoughts,
      tomorrowPlans: data.tomorrow_plans,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting journal entry by id:', error)
    }
    return null
  }
}

export async function deleteJournalEntry(id) {
  try {
    const userId = await getUserId()

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting journal entry:', error)
    }
    return false
  }
}

/**
 * Get current streak for the authenticated user
 * Uses the streaks table for accurate tracking
 * @returns {Promise<number>} Current streak count
 */
export async function getStreak() {
  try {
    const streakData = await getStreakData()
    return streakData?.current_streak || 0
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting streak:', error)
    }
    return 0
  }
}
