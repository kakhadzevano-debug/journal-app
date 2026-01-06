'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../providers/AuthProvider'
import { motion } from 'framer-motion'
import LoadingButton from '../components/LoadingButton'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showExpiredMessage, setShowExpiredMessage] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Check if user was redirected due to expired session
    if (typeof window !== 'undefined') {
      const sessionExpired = sessionStorage.getItem('sessionExpired')
      
      if (sessionExpired === 'true') {
        setShowExpiredMessage(true)
        // Clear the flag
        sessionStorage.removeItem('sessionExpired')
      }
    }
  }, [])

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      router.push('/')
      router.refresh()
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Login successful
      // Clear session storage
      if (typeof window !== 'undefined') {
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/'
        sessionStorage.removeItem('redirectAfterLogin')
        router.push(redirectTo)
      } else {
        router.push('/')
      }
      router.refresh()
    }
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)',
        padding: '20px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 w-full max-w-md"
      >
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 600, 
          color: '#ffffff',
          marginBottom: '8px',
          textAlign: 'center',
          letterSpacing: '0.3px'
        }}>
          Welcome Back
        </h1>
        <p style={{ 
          color: '#a8a8b3', 
          textAlign: 'center', 
          marginBottom: '32px',
          fontSize: '16px',
          letterSpacing: '0.3px'
        }}>
          Sign in to your journal
        </p>

        {/* Session expired banner */}
        {showExpiredMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-lg"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.5)'
            }}
          >
            <p style={{ color: '#fbbf24', fontSize: '14px', letterSpacing: '0.3px' }} className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your session has expired. Please log in again to continue.
            </p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ 
              color: '#ffffff', 
              fontSize: '14px', 
              marginBottom: '8px',
              display: 'block',
              fontWeight: 500,
              letterSpacing: '0.3px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '16px',
                letterSpacing: '0.3px'
              }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ 
                color: '#ffffff', 
                fontSize: '14px', 
                display: 'block',
                fontWeight: 500,
                letterSpacing: '0.3px'
              }}>
                Password
              </label>
              <Link 
                href="/forgot-password"
                style={{ 
                  color: '#a8a8b3', 
                  fontSize: '13px', 
                  fontWeight: 400,
                  textDecoration: 'none',
                  letterSpacing: '0.3px'
                }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg pr-12"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '16px',
                  letterSpacing: '0.3px'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#a8a8b3',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#e63946', fontSize: '14px', letterSpacing: '0.3px' }}>{error}</p>
          )}

          <motion.div
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{ width: '100%' }}
          >
            <LoadingButton
              type="submit"
              loading={loading}
              loadingText="Logging in..."
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium"
              style={{
                background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                border: 'none',
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '0.3px',
                boxShadow: '0 4px 12px rgba(244, 162, 97, 0.25)',
                width: '100%'
              }}
            >
              Sign In
            </LoadingButton>
          </motion.div>
        </form>

        <p style={{ 
          color: '#a8a8b3', 
          textAlign: 'center', 
          marginTop: '24px',
          fontSize: '14px',
          letterSpacing: '0.3px'
        }}>
          Don't have an account?{' '}
          <Link href="/register" style={{ color: '#f4a261', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>

        <p style={{ 
          color: '#a8a8b3', 
          textAlign: 'center', 
          marginTop: '16px',
          fontSize: '12px',
          letterSpacing: '0.3px',
          lineHeight: '1.6'
        }}>
          By signing in, you agree to our{' '}
          <Link href="/terms" style={{ color: '#f4a261', fontWeight: 500, textDecoration: 'underline' }}>
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#f4a261', fontWeight: 500, textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </main>
  )
}


