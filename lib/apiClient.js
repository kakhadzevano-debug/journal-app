'use client'

/**
 * Enhanced fetch wrapper that handles 401 errors (session expired)
 * Redirects to login with proper messaging
 */
export async function apiClient(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    if (response.status === 401) {
      // Unauthorized - session expired
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sessionExpired', 'true')
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
        window.location.href = '/login'
      }
      throw new Error('Session expired. Please log in again.')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'API request failed')
    }
    
    return await response.json()
    
  } catch (error) {
    // Re-throw the error to let the caller handle it
    throw error
  }
}

