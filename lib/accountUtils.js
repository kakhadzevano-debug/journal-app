// Utility functions for account type and journal limits

import { createClient } from '@/lib/supabase-client'

const FREE_MONTHLY_LIMIT = 16

/**
 * Get user's account type (free or pro)
 * @returns {Promise<{accountType: string, profile: object|null}>}
 */
export async function getAccountType() {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Get or create user profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      const { data: newProfile, error: insertError } = await supabase
        .from('user_profiles')
        .insert({ user_id: user.id, account_type: 'free' })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      return { accountType: newProfile.account_type || 'free', profile: newProfile }
    }

    if (error) {
      throw error
    }

    return { accountType: profile?.account_type || 'free', profile }
  } catch (error) {
    console.error('Error getting account type:', error)
    // Default to free on error
    return { accountType: 'free', profile: null }
  }
}

/**
 * Get count of journal entries for the current month
 * @returns {Promise<number>}
 */
export async function getCurrentMonthJournalCount() {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    // Get first and last day of current month
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    const { count, error } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', firstDay.toISOString())
      .lte('created_at', lastDay.toISOString())

    if (error) {
      throw error
    }

    return count || 0
  } catch (error) {
    console.error('Error getting journal count:', error)
    return 0
  }
}

/**
 * Check if user can create a new journal entry
 * @param {boolean} isNewEntry - Whether this is a new entry or an update
 * @returns {Promise<{canCreate: boolean, accountType: string, currentCount: number, limit: number, message: string|null}>}
 */
export async function canCreateJournal(isNewEntry = true) {
  try {
    // If updating existing entry, always allow
    if (!isNewEntry) {
      return {
        canCreate: true,
        accountType: 'free',
        currentCount: 0,
        limit: FREE_MONTHLY_LIMIT,
        message: null
      }
    }

    const { accountType } = await getAccountType()

    // Pro users have unlimited journals
    if (accountType === 'pro') {
      return {
        canCreate: true,
        accountType: 'pro',
        currentCount: 0,
        limit: Infinity,
        message: null
      }
    }

    // Free users: check monthly limit
    const currentCount = await getCurrentMonthJournalCount()
    const canCreate = currentCount < FREE_MONTHLY_LIMIT

    let message = null
    if (!canCreate) {
      message = `You've reached your monthly limit of ${FREE_MONTHLY_LIMIT} journals. Upgrade to Pro for unlimited journals.`
    } else if (currentCount >= FREE_MONTHLY_LIMIT - 3) {
      // Warn when close to limit (3 journals remaining)
      const remaining = FREE_MONTHLY_LIMIT - currentCount
      message = `You have ${remaining} journal${remaining === 1 ? '' : 's'} remaining this month.`
    }

    return {
      canCreate,
      accountType: 'free',
      currentCount,
      limit: FREE_MONTHLY_LIMIT,
      message
    }
  } catch (error) {
    console.error('Error checking journal limit:', error)
    // On error, allow creation (fail open)
    return {
      canCreate: true,
      accountType: 'free',
      currentCount: 0,
      limit: FREE_MONTHLY_LIMIT,
      message: null
    }
  }
}

/**
 * Upgrade user account to pro (for future use)
 * @returns {Promise<boolean>}
 */
export async function upgradeToPro() {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert({ user_id: user.id, account_type: 'pro' }, { onConflict: 'user_id' })

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error('Error upgrading to pro:', error)
    return false
  }
}
