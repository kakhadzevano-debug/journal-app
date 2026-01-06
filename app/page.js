'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import AnimatedCounter from './components/AnimatedCounter'
import DraftNotification from './components/DraftNotification'
import { useAuth } from './providers/AuthProvider'
import { getStreakData } from '@/lib/streakUtils'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'
import { draftManager } from '@/lib/draftManager'
import { AuthGuard } from './components/AuthGuard'

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, signOut } = useAuth()
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 })
  const [loading, setLoading] = useState(true)
  const [shouldPulse, setShouldPulse] = useState(false)
  const [showDraftNotification, setShowDraftNotification] = useState(false)
  const [draftAge, setDraftAge] = useState(null)
  
  // Online status
  const { isOnline, wasOffline, setWasOffline } = useOnlineStatus()

  useEffect(() => {
    if (user) {
      loadStreak()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Check for drafts when coming back online - show immediately
  useEffect(() => {
    if (isOnline && wasOffline && user) {
      // Check immediately when coming back online
      if (draftManager.hasDraft()) {
        const age = draftManager.getDraftAge()
        const ageText = age !== null 
          ? age < 1 ? 'just now' 
            : age === 1 ? '1 hour ago'
            : `${age} hours ago`
          : null
        setDraftAge(ageText)
        setShowDraftNotification(true)
      }
    }
  }, [isOnline, wasOffline, user])

  // Check for drafts on initial load (if already online and not coming back from offline)
  useEffect(() => {
    if (isOnline && user && !wasOffline && draftManager.hasDraft()) {
      const age = draftManager.getDraftAge()
      const ageText = age !== null 
        ? age < 1 ? 'just now' 
          : age === 1 ? '1 hour ago'
          : `${age} hours ago`
        : null
      setDraftAge(ageText)
      setShowDraftNotification(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOnline, wasOffline])

  const handleDismissDraftNotification = () => {
    setShowDraftNotification(false)
    setWasOffline(false)
  }

  // Check for streak in URL (from journal save)
  useEffect(() => {
    const streakParam = searchParams.get('streak')
    if (streakParam && user) {
      const streakNum = parseInt(streakParam, 10)
      if (!isNaN(streakNum) && streakNum > 0) {
        setStreakData(prev => ({ ...prev, current: streakNum }))
        setShouldPulse(true)
        setTimeout(() => setShouldPulse(false), 600)
        // Clean up URL without causing re-render
        const newUrl = window.location.pathname
        window.history.replaceState({}, '', newUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const loadStreak = async () => {
    try {
      setLoading(true)
      const data = await getStreakData()
      if (data) {
        setStreakData({
          current: data.current_streak || 0,
          longest: data.longest_streak || 0
        })
      }
    } catch (error) {
      console.error('Error loading streak:', error)
      setStreakData({ current: 0, longest: 0 })
    } finally {
      setLoading(false)
    }
  }

  const handleRecordClick = () => {
    router.push('/journal')
  }

  return (
    <main 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)'
      }}
    >
      <DraftNotification 
        show={showDraftNotification}
        onDismiss={handleDismissDraftNotification}
        draftAge={draftAge}
      />
      {/* Top Section with Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-6 pb-6"
        style={{ paddingTop: showDraftNotification ? '100px' : '48px' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <motion.h1
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ 
                fontSize: '48px', 
                fontWeight: 300, 
                color: '#ffffff',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
              }}
            >
              Simply Journal
            </motion.h1>
          </div>
          
          {/* Streak Badge, History Link, and Auth */}
          <div className="flex items-center gap-3">
            {user && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex flex-col items-center gap-1"
              >
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: '#a8a8b3',
                  letterSpacing: '0.3px'
                }}>
                  Streak
                </span>
                <motion.div
                  animate={shouldPulse ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="glass-card rounded-full flex items-center gap-2 px-4 py-2 relative"
                  style={{
                    minWidth: '80px',
                    justifyContent: 'center'
                  }}
                >
                  <motion.span
                    animate={streakData.current > 0 ? {
                      y: [0, -3, 0],
                      scale: streakData.current >= 7 ? [1, 1.1, 1] : 1
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    style={{ 
                      fontSize: streakData.current >= 7 ? '24px' : '20px',
                      filter: streakData.current === 0 ? 'grayscale(100%)' : 'none',
                      opacity: streakData.current === 0 ? 0.5 : 1
                    }}
                  >
                    🔥
                  </motion.span>
                  {loading ? (
                    <span style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#a8a8b3' 
                    }}>
                      ...
                    </span>
                  ) : (
                    <span style={{ 
                      fontSize: '18px', 
                      fontWeight: 600,
                      background: streakData.current > 0 
                        ? 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)'
                        : 'transparent',
                      WebkitBackgroundClip: streakData.current > 0 ? 'text' : 'unset',
                      WebkitTextFillColor: streakData.current > 0 ? 'transparent' : '#a8a8b3',
                      backgroundClip: streakData.current > 0 ? 'text' : 'unset',
                      textShadow: streakData.current >= 7 
                        ? '0 0 10px rgba(244, 162, 97, 0.5)' 
                        : 'none'
                    }}>
                      <AnimatedCounter value={streakData.current} duration={400} />
                    </span>
                  )}
                  {streakData.current > 0 && (
                    <span style={{ 
                      fontSize: '10px', 
                      color: '#a8a8b3',
                      marginLeft: '4px'
                    }}>
                      {streakData.current === 1 ? 'day' : 'days'}
                    </span>
                  )}
                </motion.div>
                {!loading && streakData.longest > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ 
                      fontSize: '10px', 
                      fontWeight: 400, 
                      color: '#a8a8b3',
                      letterSpacing: '0.2px',
                      marginTop: '-4px'
                    }}
                  >
                    Longest: {streakData.longest} {streakData.longest === 1 ? 'day' : 'days'}
                  </motion.span>
                )}
                {!loading && streakData.current === 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ 
                      fontSize: '10px', 
                      fontWeight: 400, 
                      color: '#a8a8b3',
                      letterSpacing: '0.2px',
                      marginTop: '-4px',
                      textAlign: 'center',
                      maxWidth: '100px'
                    }}
                  >
                    Start your streak today!
                  </motion.span>
                )}
              </motion.div>
            )}
            
            {!user && (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card rounded-full flex items-center gap-2 px-4 py-2"
                  style={{ 
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent'
                  }}
                >
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    color: '#f4a261',
                    letterSpacing: '0.3px'
                  }}>
                    Sign In
                  </span>
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Recording Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-1 flex flex-col items-center justify-center px-6 mb-6"
        style={{ marginTop: '80px' }}
      >
        {/* Record Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecordClick}
            className="rounded-full flex items-center justify-center relative"
            style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
              boxShadow: '0 0 20px rgba(244, 162, 97, 0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <svg 
              className="w-12 h-12" 
              fill="white" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
              />
            </svg>
          </motion.button>
        </div>

        {/* Instruction Text */}
        <motion.p
          className="text-center mt-4"
          style={{ 
            fontSize: '14px', 
            fontWeight: 400, 
            color: '#a8a8b3',
            letterSpacing: '0.3px',
            opacity: 0.6
          }}
        >
          Tap to start recording
        </motion.p>
      </motion.div>

      {/* Settings Button - Bottom Left */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          className="fixed bottom-6 left-6 z-10"
        >
          <Link href="/settings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card rounded-full flex items-center gap-2 px-4 py-3 shadow-lg"
              style={{ 
                cursor: 'pointer',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="#f4a261" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                color: '#ffffff',
                letterSpacing: '0.3px'
              }}>
                Settings
              </span>
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* History Button - Bottom Right */}
      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 15 }}
          className="fixed bottom-6 right-6 z-10"
        >
          <Link href="/history">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card rounded-full flex items-center gap-2 px-4 py-3 shadow-lg"
              style={{ 
                cursor: 'pointer',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="#f4a261" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                color: '#ffffff',
                letterSpacing: '0.3px'
              }}>
                History
              </span>
            </motion.button>
          </Link>
        </motion.div>
      )}
    </main>
  )
}

export default function Home() {
  return (
    <AuthGuard>
      <Suspense fallback={
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
      }>
        <HomeContent />
      </Suspense>
    </AuthGuard>
  )
}
