'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { checkSession, refreshSession } from '@/lib/middleware/sessionCheck'

export function AuthGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const validateSession = async () => {
      const result = await checkSession()
      
      if (!result.valid) {
        // Session invalid or expired
        if (result.expired) {
          // Try to refresh the session first
          const refreshResult = await refreshSession()
          
          if (refreshResult.success) {
            // Refresh successful - continue
            setIsAuthenticated(true)
            setIsChecking(false)
            return
          }
        }
        
        // Session invalid and can't refresh - redirect to login
        // Save current page to return to after login
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirectAfterLogin', pathname)
          sessionStorage.setItem('sessionExpired', 'true')
        }
        
        router.push('/login')
        return
      }
      
      // Session is valid
      setIsAuthenticated(true)
      setIsChecking(false)
    }

    validateSession()
    
    // Check session every 5 minutes
    const intervalId = setInterval(validateSession, 5 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [router, pathname])

  // Show loading state while checking
  if (isChecking) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)'
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{
              borderColor: '#f4a261',
              borderTopColor: 'transparent'
            }}
          />
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>Loading...</p>
        </div>
      </div>
    )
  }

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Otherwise, don't render anything (redirecting to login)
  return null
}

