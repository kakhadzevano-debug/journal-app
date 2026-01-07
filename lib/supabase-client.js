'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      // During build or if env vars missing, provide placeholder values to prevent crashes
      const placeholderUrl = 'https://placeholder.supabase.co'
      const placeholderKey = 'placeholder-key'
      
      if (typeof window !== 'undefined') {
        console.warn('Supabase environment variables not configured. Using placeholder values.')
      }
      
      return createBrowserClient(placeholderUrl, placeholderKey)
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    // Fallback to prevent app crash
    console.error('Error creating Supabase client:', error)
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }
}

