'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect online/offline status
 * @returns {{ isOnline: boolean, wasOffline: boolean }}
 */
export function useOnlineStatus() {
  // Always start with true (online) to match server-side rendering
  // This prevents hydration mismatches - both server and client render the same initial state
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Keep wasOffline true if user was offline, so we can trigger sync
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
    }

    // Set initial state only after mount (client-side)
    // This ensures server and client render the same HTML initially
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Reset wasOffline when user comes back online (after sync is handled)
  useEffect(() => {
    if (isOnline && wasOffline) {
      // Keep wasOffline true until explicitly reset
      // This allows components to detect when user just came back online
    }
  }, [isOnline, wasOffline])

  return { isOnline, wasOffline, setWasOffline }
}

