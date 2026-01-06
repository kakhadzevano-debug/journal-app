'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { handleError } from '@/lib/errorHandler'

const supabase = createClient()

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        const handled = handleError(error, 'signup')
        // Return user-friendly error
        return { 
          data: null, 
          error: { 
            message: handled.message,
            original: error
          } 
        }
      }
      
      return { data, error: null }
    } catch (error) {
      const handled = handleError(error, 'signup')
      return { 
        data: null, 
        error: { 
          message: handled.message,
          original: error
        } 
      }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        const handled = handleError(error, 'signin')
        // Return user-friendly error
        return { 
          data: null, 
          error: { 
            message: handled.message,
            original: error
          } 
        }
      }
      
      return { data, error: null }
    } catch (error) {
      const handled = handleError(error, 'signin')
      return { 
        data: null, 
        error: { 
          message: handled.message,
          original: error
        } 
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

