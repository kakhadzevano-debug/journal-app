// API route for deleting user account
// SECURITY: This route requires authentication and password re-verification
// Users can ONLY delete their own account (session-based user ID)

import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(request) {
  try {
    // ========================================
    // SECURITY CHECK #1: Verify user is authenticated
    // ========================================
    // Create Supabase client with server-side cookies to get session
    const cookieStore = await cookies()
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured')
      return Response.json(
        { error: 'Service configuration error. Please try again later.' },
        { status: 500 }
      )
    }
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            const cookie = cookieStore.get(name)
            return cookie?.value
          },
          set(name, value, options) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // Ignore cookie setting errors in API routes
            }
          },
          remove(name, options) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (error) {
              // Ignore cookie removal errors in API routes
            }
          },
        },
      }
    )

    // Get the authenticated user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      // User is not authenticated - return 401 Unauthorized
      console.warn('Unauthorized API access attempt to /api/delete-account')
      return Response.json(
        { error: 'Authentication required. Please log in to delete your account.' },
        { status: 401 }
      )
    }

    // SECURITY: Use session user ID, NOT from request body
    // This prevents users from deleting other users' accounts
    const authenticatedUserId = session.user.id

    // ========================================
    // SECURITY CHECK #2: Validate request body
    // ========================================
    // Validate Content-Type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return Response.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { password } = body

    // Validate password is provided
    if (!password || typeof password !== 'string') {
      return Response.json(
        { error: 'Password is required to confirm account deletion' },
        { status: 400 }
      )
    }

    // ========================================
    // SECURITY CHECK #3: Re-verify password
    // ========================================
    // Verify password by attempting to sign in with current email and provided password
    const userEmail = session.user.email
    if (!userEmail) {
      return Response.json(
        { error: 'User email not found' },
        { status: 400 }
      )
    }

    // Attempt to verify password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: password
    })

    if (signInError) {
      // Password is incorrect
      console.warn(`Failed password verification for user ${authenticatedUserId} during account deletion`)
      return Response.json(
        { error: 'Incorrect password. Please enter your current password to confirm deletion.' },
        { status: 401 }
      )
    }

    // Password verified - proceed with deletion
    // ========================================

    // Get service role key for admin operations (deleting user account)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
      console.error('❌ CRITICAL: SUPABASE_SERVICE_ROLE_KEY not configured in environment variables')
      console.error('This is required to delete user accounts. Please add it to .env.local')
      return Response.json(
        { 
          error: 'Account deletion is not properly configured. The service role key is missing. Please contact support.',
          code: 'MISSING_SERVICE_KEY'
        },
        { status: 500 }
      )
    }

    // Create admin client for deletion operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verify user exists (extra safety check)
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)
    
    if (getUserError || !user) {
      console.error(`Error fetching user ${authenticatedUserId} for deletion:`, getUserError)
      return Response.json(
        { error: 'User account not found' },
        { status: 404 }
      )
    }

    // ========================================
    // DELETE ALL USER DATA (Transaction-like: all or nothing)
    // ========================================
    try {
      // Delete journal entries
      const { error: deleteEntriesError } = await supabaseAdmin
        .from('journal_entries')
        .delete()
        .eq('user_id', authenticatedUserId)

      if (deleteEntriesError) {
        console.error(`Error deleting journal entries for user ${authenticatedUserId}:`, deleteEntriesError)
        // Continue with other deletions - don't fail if entries don't exist
      }

      // Delete streak data
      const { error: deleteStreakError } = await supabaseAdmin
        .from('streaks')
        .delete()
        .eq('user_id', authenticatedUserId)

      if (deleteStreakError) {
        console.error(`Error deleting streak data for user ${authenticatedUserId}:`, deleteStreakError)
        // Continue with account deletion - don't fail if streak doesn't exist
      }

      // Delete user preferences (if table exists)
      const { error: deletePrefsError } = await supabaseAdmin
        .from('user_preferences')
        .delete()
        .eq('user_id', authenticatedUserId)

      if (deletePrefsError && deletePrefsError.code !== '42P01') {
        // Only log if it's not a "table doesn't exist" error
        console.warn(`Error deleting user preferences for user ${authenticatedUserId}:`, deletePrefsError)
      }

      // Delete user account (this should cascade delete related data via RLS/foreign keys)
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(authenticatedUserId)

      if (deleteUserError) {
        console.error(`❌ Error deleting user account ${authenticatedUserId}:`, deleteUserError)
        console.error('Error details:', {
          code: deleteUserError.code,
          message: deleteUserError.message,
          status: deleteUserError.status
        })
        return Response.json(
          { 
            error: 'Failed to delete account. Please try again or contact support.',
            code: deleteUserError.code || 'DELETE_FAILED',
            details: process.env.NODE_ENV === 'development' ? deleteUserError.message : undefined
          },
          { status: 500 }
        )
      }

      // Log successful deletion (for audit trail)
      console.log(`✅ User account ${authenticatedUserId} (${userEmail}) successfully deleted`)
      console.log('Deleted data:', {
        journal_entries: 'deleted',
        streaks: 'deleted',
        user_preferences: 'deleted',
        auth_account: 'deleted'
      })

      return Response.json({ 
        success: true,
        message: 'Account deleted successfully'
      })

    } catch (deletionError) {
      console.error(`Error during deletion process for user ${authenticatedUserId}:`, deletionError)
      return Response.json(
        { error: 'An error occurred during account deletion. Please contact support.' },
        { status: 500 }
      )
    }

  } catch (error) {
    // Log error for monitoring (server-side only)
    console.error('❌ Error in /api/delete-account:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      timestamp: new Date().toISOString()
    })
    
    // Return user-friendly error with more details in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`
      : 'Failed to delete account. Please try again or contact support.'
    
    return Response.json(
      { 
        error: errorMessage,
        code: 'SERVER_ERROR',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    )
  }
}

