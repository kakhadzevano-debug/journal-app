'use client'

import { useSessionRefresh } from '@/lib/hooks/useSessionRefresh'

export function SessionRefreshWrapper({ children }) {
  useSessionRefresh() // Automatically refreshes session on user activity
  
  return <>{children}</>
}

