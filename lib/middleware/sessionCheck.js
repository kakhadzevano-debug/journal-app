'use client'

import { createClient } from '@/lib/supabase-client'

/**
 * Check if the current session is valid
 * @returns {Promise<{valid: boolean, session: Session | null, expired?: boolean}>}
 */
export async function checkSession() {
  const supabase = createClient()
  
  try {
    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Session check error:', error)
      return { valid: false, session: null }
    }
    
    if (!session) {
      return { valid: false, session: null }
    }
    
    // Check if session is expired
    const expiresAt = session.expires_at
    const now = Math.floor(Date.now() / 1000)
    
    if (expiresAt && expiresAt < now) {
      // Session expired
      return { valid: false, session: null, expired: true }
    }
    
    // Session is valid
    return { valid: true, session }
    
  } catch (error) {
    console.error('Session check failed:', error)
    return { valid: false, session: null }
  }
}

/**
 * Attempt to refresh the current session
 * @returns {Promise<{success: boolean, session: Session | null}>}
 */
export async function refreshSession() {
  const supabase = createClient()
  
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('Session refresh error:', error)
      return { success: false, session: null }
    }
    
    return { success: true, session }
    
  } catch (error) {
    console.error('Session refresh failed:', error)
    return { success: false, session: null }
  }
}

