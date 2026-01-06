'use client'

import { useEffect, useRef } from 'react'
import { refreshSession } from '@/lib/middleware/sessionCheck'

export function useSessionRefresh() {
  const lastRefreshRef = useRef(Date.now())
  const REFRESH_INTERVAL = 30 * 60 * 1000 // 30 minutes

  useEffect(() => {
    const handleActivity = async () => {
      const now = Date.now()
      const timeSinceLastRefresh = now - lastRefreshRef.current

      // If more than 30 minutes since last refresh, refresh session
      if (timeSinceLastRefresh > REFRESH_INTERVAL) {
        const result = await refreshSession()
        
        if (result.success) {
          lastRefreshRef.current = now
          if (process.env.NODE_ENV === 'development') {
            console.log('Session refreshed due to user activity')
          }
        }
      }
    }

    // Listen for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [])
}

