'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase-client'
import { handleError } from '@/lib/errorHandler'

const RESET_COOLDOWN_MS = 60 * 60 * 1000 // 1 hour in milliseconds
const RESET_COOLDOWN_KEY = 'password_reset_last_request'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  // Check for existing cooldown on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastRequest = localStorage.getItem(RESET_COOLDOWN_KEY)
      if (lastRequest) {
        const lastRequestTime = parseInt(lastRequest, 10)
        const now = Date.now()
        const timeSinceLastRequest = now - lastRequestTime
        const remainingCooldown = RESET_COOLDOWN_MS - timeSinceLastRequest
        
        if (remainingCooldown > 0) {
          setCooldownSeconds(Math.ceil(remainingCooldown / 1000))
        } else {
          // Cooldown expired, clear it
          localStorage.removeItem(RESET_COOLDOWN_KEY)
          setCooldownSeconds(0)
        }
      }
    }
  }, [])

  // Update cooldown countdown every second
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (cooldownSeconds === 0 && typeof window !== 'undefined') {
      // Cooldown expired, clear localStorage
      localStorage.removeItem(RESET_COOLDOWN_KEY)
    }
  }, [cooldownSeconds])

  // Handle countdown for redirect
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (success && countdown === 0) {
      router.push('/login')
    }
  }, [success, countdown, router])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Format cooldown time as human-readable string
  const formatCooldownTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      if (remainingSeconds === 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`
      }
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`
    } else {
      const hours = Math.floor(seconds / 3600)
      const remainingMinutes = Math.floor((seconds % 3600) / 60)
      if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Check if in cooldown period
    if (cooldownSeconds > 0) {
      setError(`Please wait ${formatCooldownTime(cooldownSeconds)} before requesting another reset link.`)
      return
    }

    // Validate email format
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        // Handle specific error types
        const handled = handleError(resetError, 'signin')
        
        // Check for specific Supabase error messages
        if (resetError.message?.includes('rate limit') || resetError.message?.includes('too many')) {
          setError('Too many requests. Please wait a moment and try again.')
          // Set cooldown on server-side rate limit
          if (typeof window !== 'undefined') {
            localStorage.setItem(RESET_COOLDOWN_KEY, Date.now().toString())
            setCooldownSeconds(Math.ceil(RESET_COOLDOWN_MS / 1000))
          }
        } else if (resetError.message?.includes('not found') || resetError.message?.includes('no user')) {
          // Don't reveal if email exists for security, but show generic message
          // Actually, Supabase doesn't reveal this, so show success anyway
          setError('Connection error. Please try again.')
        } else {
          setError(handled.message)
        }
        setLoading(false)
        return
      }

      // Success - store timestamp and show success message
      if (typeof window !== 'undefined') {
        localStorage.setItem(RESET_COOLDOWN_KEY, Date.now().toString())
        setCooldownSeconds(Math.ceil(RESET_COOLDOWN_MS / 1000))
      }
      setSuccess(true)
      setLoading(false)
      setCountdown(5)
    } catch (err) {
      console.error('Error sending reset email:', err)
      const handled = handleError(err, 'signin')
      setError(handled.message || 'Connection error. Please try again.')
      setLoading(false)
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
        {success ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px'
                }}
              >
                ✉️
              </motion.div>
            </div>
            
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 600, 
              color: '#ffffff',
              marginBottom: '16px',
              textAlign: 'center',
              letterSpacing: '0.3px'
            }}>
              Check Your Email
            </h1>
            
            <p style={{ 
              color: '#a8a8b3', 
              textAlign: 'center', 
              marginBottom: '24px',
              fontSize: '16px',
              lineHeight: '1.6',
              letterSpacing: '0.3px'
            }}>
              We sent a password reset link to:
            </p>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: '#4ade80', 
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '0.3px',
                margin: 0
              }}>
                {email}
              </p>
            </div>
            
            <p style={{ 
              color: '#a8a8b3', 
              textAlign: 'center', 
              marginBottom: '32px',
              fontSize: '14px',
              lineHeight: '1.6',
              letterSpacing: '0.3px'
            }}>
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            
            <div style={{ 
              background: 'rgba(74, 222, 128, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid rgba(74, 222, 128, 0.3)'
            }}>
              <p style={{ 
                color: '#ffffff', 
                fontSize: '13px',
                lineHeight: '1.6',
                letterSpacing: '0.3px',
                margin: 0,
                textAlign: 'center'
              }}>
                💡 <strong>Tip:</strong> Check your spam folder if you don't see the email.
              </p>
            </div>
            
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg text-white font-medium"
                style={{
                  background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  boxShadow: '0 4px 12px rgba(244, 162, 97, 0.25)',
                  marginBottom: '16px'
                }}
              >
                Back to Login
              </motion.button>
            </Link>
            
            {countdown > 0 && (
              <p style={{ 
                color: '#a8a8b3', 
                textAlign: 'center', 
                fontSize: '12px',
                letterSpacing: '0.3px'
              }}>
                Redirecting to login in {countdown}...
              </p>
            )}
          </>
        ) : (
          <>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 600, 
              color: '#ffffff',
              marginBottom: '8px',
              textAlign: 'center',
              letterSpacing: '0.3px'
            }}>
              Reset your password
            </h1>
            <p style={{ 
              color: '#a8a8b3', 
              textAlign: 'center', 
              marginBottom: '32px',
              fontSize: '16px',
              letterSpacing: '0.3px'
            }}>
              Enter your email and we'll send you a reset link
            </p>

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

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ color: '#e63946', fontSize: '14px', letterSpacing: '0.3px' }}
                >
                  {error}
                </motion.p>
              )}

              {cooldownSeconds > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: '8px'
                  }}
                >
                  <p style={{ 
                    color: '#fbbf24', 
                    fontSize: '14px', 
                    letterSpacing: '0.3px',
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    ⏱️ Please wait {formatCooldownTime(cooldownSeconds)} before requesting another reset link.
                  </p>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: cooldownSeconds > 0 || loading ? 1 : 1.02 }}
                whileTap={{ scale: cooldownSeconds > 0 || loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading || cooldownSeconds > 0}
                className="w-full py-3 rounded-lg text-white font-medium"
                style={{
                  background: cooldownSeconds > 0 || loading
                    ? 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)'
                    : 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                  border: 'none',
                  cursor: cooldownSeconds > 0 || loading ? 'not-allowed' : 'pointer',
                  opacity: cooldownSeconds > 0 || loading ? 0.7 : 1,
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  boxShadow: cooldownSeconds > 0 || loading
                    ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                    : '0 4px 12px rgba(244, 162, 97, 0.25)'
                }}
              >
                {loading ? 'Sending...' : cooldownSeconds > 0 ? `Wait ${formatCooldownTime(cooldownSeconds)}` : 'Send reset link'}
              </motion.button>
            </form>

            <p style={{ 
              color: '#a8a8b3', 
              textAlign: 'center', 
              marginTop: '24px',
              fontSize: '14px',
              letterSpacing: '0.3px'
            }}>
              Remember your password?{' '}
              <Link href="/login" style={{ color: '#f4a261', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </main>
  )
}

