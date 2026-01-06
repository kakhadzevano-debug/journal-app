'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase-client'
import { handleError } from '@/lib/errorHandler'

const supabase = createClient()

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidToken, setIsValidToken] = useState(null)
  const checkingTokenRef = useRef(false)

  // Password requirements
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const requirements = {
    length: password.length >= 8,
    mixedCase: hasUppercase && hasLowercase, // Must have both uppercase AND lowercase
    number: /[0-9]/.test(password),
  }

  const allRequirementsMet = Object.values(requirements).every(req => req === true)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0
  const canSubmit = allRequirementsMet && passwordsMatch && !loading

  // Check if we have a valid reset token on mount
  useEffect(() => {
    let mounted = true
    let subscription = null

    const checkToken = async () => {
      if (checkingTokenRef.current) return
      checkingTokenRef.current = true

      // Wait a bit for Supabase to process hash params if they exist
      await new Promise(resolve => setTimeout(resolve, 500))

      if (!mounted) return

      try {
        // Check if we have hash params (Supabase adds these from email link)
        const hashParams = window.location.hash
        const hasHashParams = hashParams && (hashParams.includes('access_token') || hashParams.includes('type=recovery'))
        
        if (hasHashParams) {
          // Has hash params - Supabase will handle them, assume valid
          if (mounted) setIsValidToken(true)
          return
        }

        // Try to get the session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (session) {
          // Has session - valid
          setIsValidToken(true)
        } else {
          // No session and no hash params - invalid/expired
          setIsValidToken(false)
        }
      } catch (err) {
        console.error('Error checking token:', err)
        if (mounted) setIsValidToken(false)
      }
    }

    checkToken()

    // Also listen for auth state changes (Supabase processes hash params)
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === 'PASSWORD_RECOVERY' || session) {
        setIsValidToken(true)
      }
    })
    subscription = data.subscription

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    // Validate requirements
    if (!allRequirementsMet) {
      setError("Password doesn't meet requirements")
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        const handled = handleError(updateError, 'signin')
        
        // Check for specific error messages
        if (updateError.message?.includes('expired') || updateError.message?.includes('invalid') || updateError.message?.includes('token')) {
          setError('This reset link has expired or is invalid. Please request a new one.')
          setIsValidToken(false)
        } else if (
          updateError.message?.toLowerCase().includes('same') ||
          updateError.message?.toLowerCase().includes('unchanged') ||
          updateError.message?.toLowerCase().includes('different') ||
          updateError.message?.toLowerCase().includes('old password') ||
          updateError.message?.toLowerCase().includes('previous password') ||
          updateError.code === 'same_password' ||
          updateError.status === 400 && updateError.message?.toLowerCase().includes('password')
        ) {
          // User tried to use their old password
          setError('You cannot use your old password. Please choose a different password.')
        } else {
          setError(handled.message || 'Failed to reset password. Please try again.')
        }
        setLoading(false)
        return
      }

      // Success
      setSuccess(true)
      setLoading(false)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err) {
      console.error('Error resetting password:', err)
      const handled = handleError(err, 'signin')
      setError(handled.message || 'Connection error. Please try again.')
      setLoading(false)
    }
  }

  // Show invalid token message
  if (isValidToken === false) {
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
                background: 'linear-gradient(135deg, #e63946 0%, #d62828 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px'
              }}
            >
              ⚠️
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
            Link Expired
          </h1>
          
          <p style={{ 
            color: '#a8a8b3', 
            textAlign: 'center', 
            marginBottom: '32px',
            fontSize: '16px',
            lineHeight: '1.6',
            letterSpacing: '0.3px'
          }}>
            This reset link has expired or is invalid. Password reset links expire after 1 hour for security reasons.
          </p>
          
          <Link href="/forgot-password">
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
              Request a new reset link
            </motion.button>
          </Link>
          
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg text-white font-medium"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 500,
                letterSpacing: '0.3px'
              }}
            >
              Back to Login
            </motion.button>
          </Link>
        </motion.div>
      </main>
    )
  }

  // Show loading while checking token
  if (isValidToken === null) {
    return (
      <main 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)',
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-3xl p-8 w-full max-w-md"
        >
          <p style={{ 
            color: '#ffffff', 
            textAlign: 'center', 
            fontSize: '16px',
            letterSpacing: '0.3px'
          }}>
            Loading...
          </p>
        </motion.div>
      </main>
    )
  }

  // Show success message
  if (success) {
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
              ✓
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
            Password Reset Successful!
          </h1>
          
          <p style={{ 
            color: '#a8a8b3', 
            textAlign: 'center', 
            marginBottom: '32px',
            fontSize: '16px',
            lineHeight: '1.6',
            letterSpacing: '0.3px'
          }}>
            Your password has been reset successfully. Redirecting to login...
          </p>
          
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
                boxShadow: '0 4px 12px rgba(244, 162, 97, 0.25)'
              }}
            >
              Go to Login
            </motion.button>
          </Link>
        </motion.div>
      </main>
    )
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
          Create new password
        </h1>
        <p style={{ 
          color: '#a8a8b3', 
          textAlign: 'center', 
          marginBottom: '32px',
          fontSize: '16px',
          letterSpacing: '0.3px'
        }}>
          Enter a new password for your account
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
              New Password
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
                placeholder="New password"
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
                  padding: '4px'
                }}
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
                placeholder="Confirm new password"
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
                  padding: '4px'
                }}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p style={{ color: '#e63946', fontSize: '12px', marginTop: '4px', letterSpacing: '0.3px' }}>
                Passwords don't match
              </p>
            )}
            {confirmPassword.length > 0 && passwordsMatch && (
              <p style={{ color: '#4ade80', fontSize: '12px', marginTop: '4px', letterSpacing: '0.3px' }}>
                ✓ Passwords match
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <p style={{ 
              color: '#a8a8b3', 
              fontSize: '13px', 
              fontWeight: 500,
              marginBottom: '4px',
              letterSpacing: '0.3px'
            }}>
              Password requirements:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: requirements.length ? '#4ade80' : '#a8a8b3', fontSize: '14px' }}>
                {requirements.length ? '✓' : '○'}
              </span>
              <span style={{ color: requirements.length ? '#ffffff' : '#a8a8b3', fontSize: '13px', letterSpacing: '0.3px' }}>
                At least 8 characters
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: requirements.mixedCase ? '#4ade80' : '#a8a8b3', fontSize: '14px' }}>
                {requirements.mixedCase ? '✓' : '○'}
              </span>
              <span style={{ color: requirements.mixedCase ? '#ffffff' : '#a8a8b3', fontSize: '13px', letterSpacing: '0.3px' }}>
                Include uppercase and lowercase
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: requirements.number ? '#4ade80' : '#a8a8b3', fontSize: '14px' }}>
                {requirements.number ? '✓' : '○'}
              </span>
              <span style={{ color: requirements.number ? '#ffffff' : '#a8a8b3', fontSize: '13px', letterSpacing: '0.3px' }}>
                Include at least one number
              </span>
            </div>
            <div style={{ 
              marginTop: '8px', 
              paddingTop: '8px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <span style={{ color: '#f4a261', fontSize: '14px', marginTop: '2px' }}>
                ⚠️
              </span>
              <span style={{ color: '#f4a261', fontSize: '13px', letterSpacing: '0.3px', lineHeight: '1.4' }}>
                Your new password must be different from your current password
              </span>
            </div>
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

          <motion.button
            whileHover={canSubmit ? { scale: 1.02 } : {}}
            whileTap={canSubmit ? { scale: 0.98 } : {}}
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 rounded-lg text-white font-medium"
            style={{
              background: canSubmit 
                ? 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)'
                : 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)',
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.7,
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '0.3px',
              boxShadow: canSubmit ? '0 4px 12px rgba(244, 162, 97, 0.25)' : 'none'
            }}
          >
            {loading ? 'Resetting...' : 'Reset password'}
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
      </motion.div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)',
          padding: '20px'
        }}
      >
        <div className="glass-card rounded-3xl p-8 w-full max-w-md">
          <p style={{ 
            color: '#ffffff', 
            textAlign: 'center', 
            fontSize: '16px',
            letterSpacing: '0.3px'
          }}>
            Loading...
          </p>
        </div>
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

