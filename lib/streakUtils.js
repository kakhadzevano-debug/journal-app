// Streak tracking utilities for journal app
// Handles streak calculation based on journal creation timestamps

import { createClient } from '@/lib/supabase-client'

/**
 * Get current user ID
 * @returns {Promise<string>} User ID
 */
async function getUserId() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  return user.id
}

/**
 * Compare two timestamps and determine their relationship
 * @param {string|Date} lastCreatedAt - ISO timestamp of last journal creation
 * @param {string|Date} currentTime - ISO timestamp of current journal creation
 * @returns {'same_day'|'consecutive'|'broken'} Relationship between the two dates
 */
export function areConsecutiveDays(lastCreatedAt, currentTime) {
  const lastDate = new Date(lastCreatedAt)
  const currentDate = new Date(currentTime)
  
  // Get calendar dates in local timezone (ignore time)
  const lastDay = lastDate.toLocaleDateString()
  const currentDay = currentDate.toLocaleDateString()
  
  // Same calendar day
  if (lastDay === currentDay) {
    return 'same_day'
  }
  
  // Check if yesterday
  const yesterday = new Date(currentDate)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toLocaleDateString()
  
  if (lastDay === yesterdayString) {
    return 'consecutive'
  }
  
  // Gap of 2+ days
  return 'broken'
}

/**
 * Update user's streak based on new journal creation
 * This function should ONLY be called when a NEW journal is created (not edited/deleted)
 * 
 * Rules:
 * - Same day: Don't change streak (already journaled today)
 * - Yesterday: Increment streak by 1
 * - 2+ days ago: Reset streak to 1
 * - First journal ever: Set streak to 1
 * - Updates longest_streak if current_streak exceeds it
 * 
 * @returns {Promise<{current_streak: number, longest_streak: number, previous_streak: number, day_relationship: string, is_new_record: boolean, streak_increased: boolean, streak_reset: boolean}>} Updated streak values with metadata
 */
export async function updateStreak() {
  try {
    const supabase = createClient()
    // Check if user is authenticated first
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('User not authenticated')
    }
    
    const userId = user.id
    const currentTime = new Date().toISOString()
    
    // Get current streak data
    const { data: streakData, error: fetchError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    // If no streak record exists, create one
    if (fetchError && fetchError.code === 'PGRST116') {
      // No streak record found, create new one
      const newStreakData = {
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_journal_created_at: currentTime,
        updated_at: currentTime
      }
      
      const { data: newData, error: insertError } = await supabase
        .from('streaks')
        .insert(newStreakData)
        .select()
        .single()
      
      if (insertError) {
        // If table doesn't exist, return default values silently
        if (insertError.code === '42P01' || insertError.message?.includes('does not exist') || insertError.message?.includes('relation') || insertError.message?.includes('table')) {
          // Table doesn't exist yet - return default values
          return {
            current_streak: 1,
            longest_streak: 1,
            previous_streak: 0,
            day_relationship: 'first_journal',
            is_new_record: true,
            streak_increased: true,
            streak_reset: false
          }
        }
        // For other errors, log and throw
        if (process.env.NODE_ENV === 'development') {
          console.error('Error inserting streak record:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          })
        }
        throw insertError
      }
      
      return {
        current_streak: newData.current_streak,
        longest_streak: newData.longest_streak,
        previous_streak: 0,
        day_relationship: 'first_journal',
        is_new_record: true,
        streak_increased: true,
        streak_reset: false
      }
    }
    
    if (fetchError) {
      // If table doesn't exist, return default values silently
      if (fetchError.code === '42P01' || fetchError.message?.includes('does not exist') || fetchError.message?.includes('relation') || fetchError.message?.includes('table')) {
        // Table doesn't exist yet - return default values for first journal
        return {
          current_streak: 1,
          longest_streak: 1,
          previous_streak: 0,
          day_relationship: 'first_journal',
          is_new_record: true,
          streak_increased: true,
          streak_reset: false
        }
      }
      // For other errors (like PGRST116 - no record found), let it continue to create one
      if (fetchError.code !== 'PGRST116') {
        // Log other errors
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching streak data:', {
            code: fetchError.code,
            message: fetchError.message,
            details: fetchError.details,
            hint: fetchError.hint
          })
        }
        throw fetchError
      }
    }
    
    // If this is the first journal ever (no last_journal_created_at)
    if (!streakData.last_journal_created_at) {
      const updatedData = {
        current_streak: 1,
        longest_streak: Math.max(1, streakData.longest_streak),
        last_journal_created_at: currentTime,
        updated_at: currentTime
      }
      
      const { data: updated, error: updateError } = await supabase
        .from('streaks')
        .update(updatedData)
        .eq('user_id', userId)
        .select()
        .single()
      
      if (updateError) {
        // If table doesn't exist, return default values silently
        if (updateError.code === '42P01' || updateError.message?.includes('does not exist') || updateError.message?.includes('relation') || updateError.message?.includes('table')) {
          return {
            current_streak: 1,
            longest_streak: 1,
            previous_streak: streakData.current_streak || 0,
            day_relationship: 'first_journal',
            is_new_record: true,
            streak_increased: true,
            streak_reset: false
          }
        }
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating streak record:', {
            code: updateError.code,
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint
          })
        }
        throw updateError
      }
      
      return {
        current_streak: updated.current_streak,
        longest_streak: updated.longest_streak,
        previous_streak: streakData.current_streak || 0,
        day_relationship: 'first_journal',
        is_new_record: true,
        streak_increased: true,
        streak_reset: false
      }
    }
    
    // Compare last journal creation with current time
    const dayRelationship = areConsecutiveDays(
      streakData.last_journal_created_at,
      currentTime
    )
    
    const previousStreak = streakData.current_streak
    const previousLongest = streakData.longest_streak
    let newCurrentStreak = streakData.current_streak
    let newLongestStreak = streakData.longest_streak
    
    switch (dayRelationship) {
      case 'same_day':
        // Already journaled today, don't change streak
        // But update last_journal_created_at to the latest one
        break
        
      case 'consecutive':
        // Journaled yesterday, increment streak
        newCurrentStreak = streakData.current_streak + 1
        newLongestStreak = Math.max(newCurrentStreak, streakData.longest_streak)
        break
        
      case 'broken':
        // Gap of 2+ days, reset streak to 1
        newCurrentStreak = 1
        newLongestStreak = Math.max(1, streakData.longest_streak)
        break
    }
    
    const isNewRecord = newLongestStreak > previousLongest
    const streakIncreased = newCurrentStreak > previousStreak
    const streakReset = dayRelationship === 'broken'
    
    // Update streak record
    const updatedData = {
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      last_journal_created_at: currentTime,
      updated_at: currentTime
    }
    
    const { data: updated, error: updateError } = await supabase
      .from('streaks')
      .update(updatedData)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (updateError) {
      // If table doesn't exist, return default values silently
      if (updateError.code === '42P01' || updateError.message?.includes('does not exist') || updateError.message?.includes('relation') || updateError.message?.includes('table')) {
        return {
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          previous_streak: previousStreak,
          day_relationship: dayRelationship,
          is_new_record: isNewRecord,
          streak_increased: streakIncreased,
          streak_reset: streakReset
        }
      }
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating streak record:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        })
      }
      throw updateError
    }
    
    return {
      current_streak: updated.current_streak,
      longest_streak: updated.longest_streak,
      previous_streak: previousStreak,
      day_relationship: dayRelationship,
      is_new_record: isNewRecord,
      streak_increased: streakIncreased,
      streak_reset: streakReset
    }
  } catch (error) {
    // If table doesn't exist or user not authenticated, return default values silently
    if (error?.code === '42P01' || error?.message?.includes('does not exist') || error?.message?.includes('relation') || error?.message?.includes('table')) {
      // Table doesn't exist yet - return default values
      return {
        current_streak: 1,
        longest_streak: 1,
        previous_streak: 0,
        day_relationship: 'first_journal',
        is_new_record: true,
        streak_increased: true,
        streak_reset: false
      }
    }
    
    if (error?.message?.includes('not authenticated')) {
      // User not authenticated - return default values
      return {
        current_streak: 0,
        longest_streak: 0,
        previous_streak: 0,
        day_relationship: 'same_day',
        is_new_record: false,
        streak_increased: false,
        streak_reset: false
      }
    }
    
    // Log other errors
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating streak:', {
        error,
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint
      })
      
      if (error?.code === '42501') {
        console.error('❌ Permission denied. Check your RLS policies in Supabase.')
      }
    }
    throw error
  }
}

/**
 * Check if streak value is a milestone
 * @param {number} streak - Current streak value
 * @returns {Object|null} Milestone info or null
 */
export function getMilestone(streak) {
  const milestones = [7, 30, 100, 365]
  if (milestones.includes(streak)) {
    const messages = {
      7: { message: "One week strong! 💪", emoji: "💪" },
      30: { message: "One month streak! Amazing! 🎉", emoji: "🎉" },
      100: { message: "100 days! You're incredible! 🏆", emoji: "🏆" },
      365: { message: "One year! Legendary! 🌟", emoji: "🌟" }
    }
    return { ...messages[streak], days: streak }
  }
  return null
}

/**
 * Get current streak data for the authenticated user
 * @returns {Promise<{current_streak: number, longest_streak: number}|null>} Streak data or null if not found
 */
export async function getStreakData() {
  try {
    const supabase = createClient()
    // Check if user is authenticated first
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // User not authenticated - return default values
      return {
        current_streak: 0,
        longest_streak: 0,
        last_journal_created_at: null
      }
    }
    
    const userId = user.id
    
    const { data, error } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, last_journal_created_at')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No streak record found - this is normal for new users
        return {
          current_streak: 0,
          longest_streak: 0,
          last_journal_created_at: null
        }
      }
      
      // If it's a table doesn't exist error, return default values silently
      if (error?.code === '42P01' || error?.message?.includes('does not exist') || error?.message?.includes('relation') || error?.message?.includes('table')) {
        // Silently return default values - table will be created later
        return {
          current_streak: 0,
          longest_streak: 0,
          last_journal_created_at: null
        }
      }
      
      // Log other errors for debugging (but not table missing errors)
      if (process.env.NODE_ENV === 'development') {
        const errorInfo = {
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint
        }
        
        console.error('Supabase error getting streak data:', errorInfo)
        
        if (error?.code === '42501' || error?.message?.includes('permission') || error?.message?.includes('policy')) {
          console.error('❌ Permission denied. Check your RLS policies in Supabase.')
        }
      }
      
      throw error
    }
    
    return {
      current_streak: data?.current_streak || 0,
      longest_streak: data?.longest_streak || 0,
      last_journal_created_at: data?.last_journal_created_at || null
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error getting streak data:', {
        error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      })
    }
    // Return default values on any error
    return {
      current_streak: 0,
      longest_streak: 0,
      last_journal_created_at: null
    }
  }
}

