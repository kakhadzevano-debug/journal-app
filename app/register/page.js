'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../providers/AuthProvider'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const { signUp, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    const { data, error } = await signUp(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else if (data) {
      // Check if email verification is required
      // Supabase returns user but no session if email verification is needed
      if (data.user && !data.session) {
        // Email verification required - show message
        setShowEmailVerification(true)
        setLoading(false)
      } else if (data.session) {
        // Already verified or no verification needed - redirect to home
        router.push('/')
        router.refresh()
      } else {
        // Fallback: show email verification message
        setShowEmailVerification(true)
        setLoading(false)
      }
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
        {showEmailVerification ? (
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
                  background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
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
              We've sent a confirmation email to:
            </p>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: '#f4a261', 
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
              Please click the confirmation link in the email to verify your account. 
              You can then sign in to start journaling.
            </p>
            
            <div style={{ 
              background: 'rgba(244, 162, 97, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid rgba(244, 162, 97, 0.3)'
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
                Go to Sign In
              </motion.button>
            </Link>
            
            <p style={{ 
              color: '#a8a8b3', 
              textAlign: 'center', 
              fontSize: '12px',
              letterSpacing: '0.3px'
            }}>
              Didn't receive the email?{' '}
              <button
                onClick={() => setShowEmailVerification(false)}
                style={{ 
                  color: '#f4a261', 
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '12px'
                }}
              >
                Try again
              </button>
            </p>
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
              Create Account
            </h1>
            <p style={{ 
              color: '#a8a8b3', 
              textAlign: 'center', 
              marginBottom: '32px',
              fontSize: '16px',
              letterSpacing: '0.3px'
            }}>
              Start your journaling journey
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

          <div>
            <label style={{ 
              color: '#ffffff', 
              fontSize: '14px', 
              marginBottom: '8px',
              display: 'block',
              fontWeight: 500,
              letterSpacing: '0.3px'
            }}>
              Password
            </label>
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

          <div>
            <label style={{ 
              color: '#ffffff', 
              fontSize: '14px', 
              marginBottom: '8px',
              display: 'block',
              fontWeight: 500,
              letterSpacing: '0.3px'
            }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#e63946', fontSize: '14px', letterSpacing: '0.3px' }}>{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-medium"
            style={{
              background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '0.3px',
              boxShadow: '0 4px 12px rgba(244, 162, 97, 0.25)'
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p style={{ 
          color: '#a8a8b3', 
          textAlign: 'center', 
          marginTop: '24px',
          fontSize: '14px',
          letterSpacing: '0.3px'
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#f4a261', fontWeight: 500 }}>
            Sign in
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
          By signing up, you agree to our{' '}
          <Link href="/terms" style={{ color: '#f4a261', fontWeight: 500, textDecoration: 'underline' }}>
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#f4a261', fontWeight: 500, textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
        </p>
          </>
        )}
      </motion.div>
    </main>
  )
}


