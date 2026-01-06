'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../providers/AuthProvider'
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  scheduleDailyNotification,
  clearAllNotifications,
  getPermissionMessage
} from '@/lib/notifications'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

// Default notification time (9:00 AM)
const DEFAULT_HOUR = 9
const DEFAULT_MINUTE = 0

export function useNotifications() {
  const { user } = useAuth()
  const [permission, setPermission] = useState('default')
  const [enabled, setEnabled] = useState(false)
  const [hour, setHour] = useState(DEFAULT_HOUR)
  const [minute, setMinute] = useState(DEFAULT_MINUTE)
  const [loading, setLoading] = useState(true)

  // Load notification preferences from database
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadPreferences = async () => {
      try {
        // Check browser permission
        const browserPermission = getNotificationPermission()
        setPermission(browserPermission)

        // Load user preferences from database
        let preferencesData = null
        try {
          const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', user.id)
            .single()

          // PGRST116 = no rows found (table might not exist or no preferences set)
          if (error) {
            // Check if table doesn't exist (expected if SQL not run yet)
            const isTableNotFound = 
              error.code === '42P01' || 
              error.code === 'PGRST301' ||
              error.message?.includes('does not exist') || 
              error.message?.includes('relation') ||
              error.message?.includes('table') ||
              error.details?.includes('does not exist')
            
            if (error.code === 'PGRST116') {
              // No preferences found - use defaults
              // This is fine, user hasn't set preferences yet
              // Don't log this - it's expected
            } else if (isTableNotFound) {
              // Table doesn't exist - user needs to run SQL setup
              // Only log as warning in development, not as error
              if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ user_preferences table does not exist. Please run the SQL from supabase_notifications_setup.sql')
              }
              // Use defaults - don't throw error
            } else {
              // Other unexpected error - log in development only
              if (process.env.NODE_ENV === 'development') {
                const errorInfo = {
                  code: error?.code,
                  message: error?.message,
                  details: error?.details,
                  hint: error?.hint,
                  name: error?.name
                }
                // Only log if we have actual error info
                if (errorInfo.code || errorInfo.message) {
                  console.error('Error loading notification preferences:', errorInfo)
                }
              }
            }
          } else if (data) {
            preferencesData = data
            setEnabled(data.notifications_enabled || false)
            setHour(data.notification_hour || DEFAULT_HOUR)
            setMinute(data.notification_minute || DEFAULT_MINUTE)
          }
        } catch (err) {
          // Handle any unexpected errors gracefully
          // Only log if it's a real error with information
          if (process.env.NODE_ENV === 'development' && (err?.message || err?.code || err?.toString() !== '[object Object]')) {
            console.error('Unexpected error loading notification preferences:', {
              message: err?.message,
              code: err?.code,
              name: err?.name,
              stack: err?.stack
            })
          }
        }

        // If permission is granted and notifications are enabled, schedule them
        if (browserPermission === 'granted' && (preferencesData?.notifications_enabled || false)) {
          scheduleNotifications(preferencesData?.notification_hour || DEFAULT_HOUR, preferencesData?.notification_minute || DEFAULT_MINUTE)
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [user])

  // Schedule notifications
  const scheduleNotifications = useCallback((notificationHour, notificationMinute) => {
    // Clear any existing notifications first
    clearAllNotifications()
    
    // Schedule the new notification
    const timeoutId = scheduleDailyNotification({
      hour: notificationHour,
      minute: notificationMinute,
      title: '📔 Time to Journal!',
      body: 'Don\'t forget to write in your journal today. Keep your streak going! 🔥'
    })
    
    if (process.env.NODE_ENV === 'development') {
      if (timeoutId) {
        console.log(`✅ Notifications scheduled for ${notificationHour}:${notificationMinute.toString().padStart(2, '0')}`)
      } else {
        console.warn('⚠️ Failed to schedule notification - check permission and support')
      }
    }
    
    return timeoutId
  }, [])

  // Request permission
  const requestPermission = useCallback(async () => {
    try {
      setLoading(true)
      const newPermission = await requestNotificationPermission()
      setPermission(newPermission)
      
      if (newPermission === 'granted' && enabled) {
        scheduleNotifications(hour, minute)
      }
      
      return newPermission
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [enabled, hour, minute, scheduleNotifications])

  // Toggle notifications
  const toggleNotifications = useCallback(async (newEnabled) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      
      // If enabling, check permission first
      if (newEnabled && permission !== 'granted') {
        try {
          await requestPermission()
        } catch (permError) {
          // If permission request fails, throw a user-friendly error
          throw new Error(permError.message || 'Failed to request notification permission')
        }
      }

      // Update database
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notifications_enabled: newEnabled,
          notification_hour: hour,
          notification_minute: minute,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        // Log full error details
        if (process.env.NODE_ENV === 'development') {
          console.error('Supabase error toggling notifications:', {
            error,
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            name: error.name
          })
        }
        
        // If table doesn't exist, provide helpful error
        // Check multiple ways Supabase might indicate table doesn't exist
        const isTableNotFound = 
          error.code === '42P01' || 
          error.code === 'PGRST301' ||
          error.message?.includes('does not exist') || 
          error.message?.includes('Could not find the table') ||
          error.message?.includes('relation') ||
          error.message?.includes('table') ||
          error.message?.includes('schema cache') ||
          error.details?.includes('does not exist') ||
          error.details?.includes('Could not find the table') ||
          error.hint?.includes('table') ||
          (error.message && error.message.toLowerCase().includes('user_preferences'))
        
        if (isTableNotFound) {
          const tableError = new Error('Notification preferences table not found. Please run the SQL setup from supabase_notifications_setup.sql')
          tableError.code = 'TABLE_NOT_FOUND'
          // Don't log this as an error - it's expected if SQL hasn't been run
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️', tableError.message)
          }
          throw tableError
        }
        
        // For other errors, create a user-friendly message
        const userError = new Error(error.message || 'Failed to save notification preferences')
        userError.code = error.code
        throw userError
      }

      setEnabled(newEnabled)

      // Schedule or clear notifications
      if (newEnabled && permission === 'granted') {
        scheduleNotifications(hour, minute)
      } else {
        clearAllNotifications()
      }
    } catch (error) {
      // Don't log TABLE_NOT_FOUND errors as errors - they're expected
      if (error?.code === 'TABLE_NOT_FOUND') {
        // Just re-throw - the UI will show the toast message
        throw error
      }
      
      // Provide detailed error information for unexpected errors
      if (process.env.NODE_ENV === 'development') {
        console.error('Error toggling notifications:', {
          error,
          errorType: typeof error,
          errorConstructor: error?.constructor?.name,
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          stack: error?.stack,
          name: error?.name
        })
      }
      
      // Re-throw with proper error structure
      if (error instanceof Error) {
        throw error
      } else {
        // If error is not an Error object, wrap it
        const wrappedError = new Error(error?.message || 'Unknown error occurred')
        wrappedError.code = error?.code
        throw wrappedError
      }
    } finally {
      setLoading(false)
    }
  }, [user, permission, hour, minute, requestPermission, scheduleNotifications])

  // Update notification time
  const updateNotificationTime = useCallback(async (newHour, newMinute) => {
    if (!user) return

    try {
      setLoading(true)
      
      // Update database
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notifications_enabled: enabled,
          notification_hour: newHour,
          notification_minute: newMinute,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (error) {
        // If table doesn't exist, provide helpful error
        if (error.code === '42P01' || error.message?.includes('does not exist') || error.message?.includes('relation')) {
          throw new Error('Notification preferences table not found. Please run the SQL setup from supabase_notifications_setup.sql')
        }
        throw error
      }

      setHour(newHour)
      setMinute(newMinute)

      // Reschedule notifications if enabled
      if (enabled && permission === 'granted') {
        scheduleNotifications(newHour, newMinute)
      }
    } catch (error) {
      // Provide detailed error information
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating notification time:', {
          error,
          code: error?.code,
          message: error?.message,
          details: error?.details,
          hint: error?.hint
        })
      }
      
      // Check if table doesn't exist
      if (error?.code === '42P01' || error?.message?.includes('does not exist') || error?.message?.includes('relation')) {
        const tableError = new Error('Notification preferences table not found. Please run the SQL setup from supabase_notifications_setup.sql')
        tableError.code = 'TABLE_NOT_FOUND'
        throw tableError
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [user, enabled, permission, scheduleNotifications])

  return {
    permission,
    enabled,
    hour,
    minute,
    loading,
    isSupported: isNotificationSupported(),
    permissionMessage: getPermissionMessage(permission),
    requestPermission,
    toggleNotifications,
    updateNotificationTime
  }
}

