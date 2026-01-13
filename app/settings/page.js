'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '../providers/AuthProvider'
import { getJournalEntries } from '../utils/storage'
import { createClient } from '@/lib/supabase-client'
import StreakToast from '../components/StreakToast'
import { useNotifications } from '../hooks/useNotifications'
import { AuthGuard } from '../components/AuthGuard'
import LoadingButton from '../components/LoadingButton'
import { getAccountType, getCurrentMonthJournalCount, upgradeToPro } from '@/lib/accountUtils'

function SettingsPageContent() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [downloading, setDownloading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  
  // Notification settings
  const {
    permission,
    enabled,
    hour,
    minute,
    loading: notificationsLoading,
    isSupported,
    permissionMessage,
    requestPermission,
    toggleNotifications,
    updateNotificationTime
  } = useNotifications()
  
  const [localHour, setLocalHour] = useState(hour)
  const [localMinute, setLocalMinute] = useState(minute)
  const [savingTime, setSavingTime] = useState(false)
  const [accountType, setAccountType] = useState('free')
  const [journalCount, setJournalCount] = useState(0)
  const [loadingAccountInfo, setLoadingAccountInfo] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  // Sync local state with hook state
  useEffect(() => {
    setLocalHour(hour)
    setLocalMinute(minute)
  }, [hour, minute])

  // Load account information
  useEffect(() => {
    const loadAccountInfo = async () => {
      try {
        const { accountType: type } = await getAccountType()
        const count = await getCurrentMonthJournalCount()
        setAccountType(type)
        setJournalCount(count)
      } catch (error) {
        console.error('Error loading account info:', error)
      } finally {
        setLoadingAccountInfo(false)
      }
    }
    loadAccountInfo()
  }, [])

  // Handle upgrade to Pro
  const handleUpgradeToPro = async () => {
    if (accountType === 'pro') {
      setToast({
        show: true,
        message: 'You already have a Pro account!',
        type: 'success'
      })
      return
    }

    // For now, just upgrade directly (later you can add payment processing)
    if (window.confirm('Upgrade to Pro? This will give you unlimited journals. (Payment integration coming soon)')) {
      setUpgrading(true)
      try {
        const success = await upgradeToPro()
        if (success) {
          setAccountType('pro')
          setToast({
            show: true,
            message: '🎉 Successfully upgraded to Pro! You now have unlimited journals.',
            type: 'success'
          })
          // Reload account info to get updated count
          const count = await getCurrentMonthJournalCount()
          setJournalCount(count)
        } else {
          setToast({
            show: true,
            message: 'Failed to upgrade. Please try again.',
            type: 'error'
          })
        }
      } catch (error) {
        console.error('Error upgrading to Pro:', error)
        setToast({
          show: true,
          message: 'Failed to upgrade. Please try again.',
          type: 'error'
        })
      } finally {
        setUpgrading(false)
      }
    }
  }
  
  // Check if time has been changed
  const hasTimeChanged = localHour !== hour || localMinute !== minute

  // Note: AuthGuard handles authentication checks now

  const handleDownloadData = async () => {
    try {
      setDownloading(true)
      
      // Get all journal entries
      const entries = await getJournalEntries()
      
      // Get streak data
      const { getStreakData } = await import('@/lib/streakUtils')
      const streakData = await getStreakData()
      
      // Prepare export data - filter out any empty/null entries and format nicely
      const formattedEntries = entries
        .filter(entry => entry && entry.id && entry.date) // Remove empty objects
        .map(entry => ({
          id: entry.id,
          date: entry.date,
          rating: entry.rating ?? null,
          liked: entry.liked || null,
          didntLike: entry.didntLike || null,
          otherThoughts: entry.otherThoughts || null,
          tomorrowPlans: entry.tomorrowPlans || null,
          createdAt: entry.createdAt || null,
          updatedAt: entry.updatedAt || null
        }))
        .sort((a, b) => {
          // Sort by date (newest first), then by createdAt if dates are equal
          if (a.date !== b.date) {
            return b.date.localeCompare(a.date)
          }
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return bTime - aTime
        })
      
      // Prepare export data with better structure
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          exportDateFormatted: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          userEmail: user?.email || 'unknown',
          totalJournals: formattedEntries.length
        },
        streak: {
          currentStreak: streakData?.current_streak || 0,
          longestStreak: streakData?.longest_streak || 0,
          lastJournalCreatedAt: streakData?.last_journal_created_at || null
        },
        journals: formattedEntries
      }
      
      // Create JSON file with nice formatting (2-space indent)
      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      // Download file with better name
      const link = document.createElement('a')
      link.href = url
      const dateStr = new Date().toISOString().split('T')[0]
      link.download = `journal-export-${dateStr}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setToast({
        show: true,
        message: '✅ Your data has been downloaded successfully!',
        type: 'success'
      })
    } catch (error) {
      console.error('Error downloading data:', error)
      setToast({
        show: true,
        message: '❌ Failed to download data. Please try again.',
        type: 'error'
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setToast({
        show: true,
        message: 'Please enter your password to confirm',
        type: 'error'
      })
      return
    }

    try {
      setDeleting(true)

      // Call the API route to delete the account
      // This will handle password verification and complete account deletion
      let response
      try {
        response = await fetch('/api/delete-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: deletePassword
          })
        })
      } catch (fetchError) {
        console.error('❌ Network error during fetch:', fetchError)
        setToast({
          show: true,
          message: '❌ Network error. Please check your connection and try again.',
          type: 'error'
        })
        setDeleting(false)
        return
      }

      // Log response details for debugging
      console.log('📡 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      // Read response as text first (can only read once)
      let responseText
      try {
        responseText = await response.text()
        console.log('📄 Raw response text:', responseText)
      } catch (textError) {
        console.error('❌ Failed to read response text:', textError)
        setToast({
          show: true,
          message: `❌ Server error (${response.status}). Could not read response.`,
          type: 'error'
        })
        setDeleting(false)
        return
      }
      
      // Check if response is OK before trying to parse JSON
      let data = {}
      const contentType = response.headers.get('content-type')
      console.log('📋 Content-Type:', contentType)
      
      if (contentType && contentType.includes('application/json')) {
        try {
          if (responseText && responseText.trim()) {
            data = JSON.parse(responseText)
            console.log('✅ Parsed JSON data:', data)
          } else {
            console.warn('⚠️ Empty response text, using empty data object')
            data = {}
          }
        } catch (parseError) {
          console.error('❌ Failed to parse JSON response:', parseError)
          console.error('Response text that failed to parse:', responseText)
          setToast({
            show: true,
            message: `❌ Server error (${response.status}). Invalid JSON response. Check console for details.`,
            type: 'error'
          })
          setDeleting(false)
          return
        }
      } else {
        // Response is not JSON
        console.error('❌ Non-JSON response:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          text: responseText
        })
        setToast({
          show: true,
          message: `❌ Server error (${response.status}): ${responseText || response.statusText}`,
          type: 'error'
        })
        setDeleting(false)
        return
      }

      if (!response.ok) {
        // API returned an error
        console.log('❌ Response not OK. Status:', response.status)
        console.log('❌ Error data object:', data)
        console.log('❌ Error data keys:', Object.keys(data))
        console.log('❌ Full response text:', responseText)
        
        // Build error message from available data
        let errorMessage = `❌ Failed to delete account (${response.status})`
        
        // Try to get error message from various possible fields
        const errorText = data?.error || data?.message || data?.details || responseText || response.statusText
        
        // Provide more specific error messages
        if (data?.code === 'MISSING_SERVICE_KEY') {
          errorMessage = '❌ Account deletion is not configured. Missing service role key. Please add SUPABASE_SERVICE_ROLE_KEY to .env.local'
          console.log('❌ Service role key is missing. See SETUP_SERVICE_ROLE_KEY.md for instructions.')
        } else if (data?.code === 'DELETE_FAILED' || data?.code === 'SERVER_ERROR') {
          errorMessage = `❌ Account deletion failed: ${errorText || 'Unknown error'}. Check server console for details.`
          console.log('❌ Delete failed:', data)
        } else if (response.status === 401) {
          if (errorText?.includes('password') || errorText?.includes('Incorrect')) {
            errorMessage = '❌ Incorrect password. Please try again.'
          } else {
            errorMessage = '❌ Authentication failed. Please log in again.'
          }
        } else if (response.status === 500) {
          // Show error details if available
          if (errorText && errorText !== '{}' && errorText.length > 0) {
            errorMessage = `❌ Server error: ${errorText}`
          } else {
            errorMessage = `❌ Server error (500). Most likely missing SUPABASE_SERVICE_ROLE_KEY in .env.local. Check server console.`
          }
        } else {
          // For other status codes, use the error text if available
          if (errorText && errorText !== '{}' && errorText.length > 0) {
            errorMessage = `❌ Error: ${errorText}`
          }
        }
        
        // Log full error for debugging - use console.log to avoid Next.js error overlay
        console.log('❌ Account deletion error - Full details:')
        console.log('  Status:', response?.status)
        console.log('  Status Text:', response?.statusText)
        console.log('  Response OK:', response?.ok)
        console.log('  Content Type:', contentType)
        console.log('  Response Text:', responseText)
        console.log('  Data Object:', JSON.stringify(data, null, 2))
        console.log('  Data Keys:', Object.keys(data || {}))
        if (data?.code) console.log('  Data Code:', data.code)
        if (data?.error) console.log('  Data Error:', data.error)
        if (data?.message) console.log('  Data Message:', data.message)
        if (data?.details) console.log('  Data Details:', data.details)
        console.log('  Data Is Empty:', !data || Object.keys(data).length === 0)
        
        setToast({
          show: true,
          message: errorMessage,
          type: 'error'
        })
        setDeleting(false)
        return
      }

      // Account successfully deleted
      // Sign out user (clear local session)
      await signOut()

      // Show goodbye message
      setToast({
        show: true,
        message: '👋 Your account and all data have been permanently deleted. Goodbye!',
        type: 'success'
      })

      // Redirect to login page after delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (error) {
      console.error('Error deleting account:', error)
      setToast({
        show: true,
        message: '❌ Failed to delete account. Please check your connection and try again.',
        type: 'error'
      })
      setDeleting(false)
    }
  }

  const handleToastClose = () => {
    setToast({ show: false, message: '', type: 'success' })
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main 
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)'
        }}
      >
        <div style={{ color: '#ffffff' }}>Loading...</div>
      </main>
    )
  }

  // Note: AuthGuard handles authentication checks now
  // Don't render content if not authenticated (AuthGuard handles this)
  if (!user) {
    return null
  }

  return (
    <>
      <StreakToast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type}
        onClose={handleToastClose}
      />
      <main 
        className="min-h-screen flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)',
          padding: '24px 20px',
          paddingBottom: '100px'
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl mx-auto"
          style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-12 h-12 rounded-full glass-card"
                style={{
                  cursor: 'pointer',
                  border: 'none'
                }}
                aria-label="Go back"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            </Link>
            
            <h1 style={{ 
              color: '#ffffff', 
              fontSize: '32px', 
              fontWeight: 600, 
              letterSpacing: '0.3px' 
            }}>
              Settings
            </h1>
            
            <div className="w-12 h-12"></div>
          </div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="glass-card rounded-3xl"
            style={{
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}
          >
            {/* Account Information Section */}
            <div>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '12px',
                letterSpacing: '0.3px'
              }}>
                Account Information
              </h2>
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{
                      color: '#a8a8b3',
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px',
                      display: 'block'
                    }}>
                      Email Address
                    </label>
                    <div style={{
                      color: '#ffffff',
                      fontSize: '16px',
                      fontWeight: 500,
                      letterSpacing: '0.3px'
                    }}>
                      {user?.email || 'Not available'}
                    </div>
                  </div>
                  {user?.user_metadata?.full_name && (
                    <div>
                      <label style={{
                        color: '#a8a8b3',
                        fontSize: '12px',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '4px',
                        display: 'block'
                      }}>
                        Name
                      </label>
                      <div style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 500,
                        letterSpacing: '0.3px'
                      }}>
                        {user.user_metadata.full_name}
                      </div>
                    </div>
                  )}
                  <div>
                    <label style={{
                      color: '#a8a8b3',
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px',
                      display: 'block'
                    }}>
                      Account Created
                    </label>
                    <div style={{
                      color: '#a8a8b3',
                      fontSize: '14px',
                      letterSpacing: '0.3px'
                    }}>
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Not available'}
                    </div>
                  </div>
                  <div>
                    <label style={{
                      color: '#a8a8b3',
                      fontSize: '12px',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px',
                      display: 'block'
                    }}>
                      Account Type
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          color: accountType === 'pro' ? '#f4a261' : '#ffffff',
                          fontSize: '16px',
                          fontWeight: 600,
                          letterSpacing: '0.3px',
                          textTransform: 'capitalize'
                        }}>
                          {loadingAccountInfo ? 'Loading...' : accountType === 'pro' ? '⭐ Pro' : 'Free'}
                        </div>
                        {accountType === 'free' && !loadingAccountInfo && (
                          <div style={{
                            color: '#a8a8b3',
                            fontSize: '12px',
                            letterSpacing: '0.3px'
                          }}>
                            ({journalCount}/16 this month)
                          </div>
                        )}
                      </div>
                      {accountType === 'free' && !loadingAccountInfo && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleUpgradeToPro}
                          disabled={upgrading}
                          style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '0.3px',
                            cursor: upgrading ? 'not-allowed' : 'pointer',
                            opacity: upgrading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            maxWidth: '300px'
                          }}
                        >
                          {upgrading ? (
                            <>
                              <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderTop: '2px solid #ffffff',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                              }} />
                              Upgrading...
                            </>
                          ) : (
                            <>
                              ⭐ Upgrade to Pro
                            </>
                          )}
                        </motion.button>
                      )}
                      {accountType === 'pro' && (
                        <div style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'rgba(244, 162, 97, 0.1)',
                          border: '1px solid rgba(244, 162, 97, 0.3)',
                          color: '#f4a261',
                          fontSize: '13px',
                          letterSpacing: '0.3px'
                        }}>
                          ✨ You have unlimited journals!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              background: 'rgba(255, 255, 255, 0.1)',
              margin: '8px 0'
            }}></div>

            {/* Download Data Section */}
            <div>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '12px',
                letterSpacing: '0.3px'
              }}>
                Download My Data
              </h2>
              <p style={{ 
                color: '#a8a8b3', 
                fontSize: '14px', 
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                Export all your journal entries, ratings, and streak data as a JSON file.
              </p>
              <LoadingButton
                loading={downloading}
                loadingText="Preparing download..."
                onClick={handleDownloadData}
                disabled={downloading}
                className="w-full text-white rounded-2xl"
                style={{
                  height: '56px',
                  background: downloading 
                    ? 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)'
                    : 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                  boxShadow: downloading 
                    ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                    : '0 4px 12px rgba(244, 162, 97, 0.3)',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  border: 'none'
                }}
              >
                📥 Download My Data
              </LoadingButton>
            </div>

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              background: 'rgba(255, 255, 255, 0.1)',
              margin: '8px 0'
            }}></div>

            {/* Notification Settings Section */}
            <div>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '12px',
                letterSpacing: '0.3px'
              }}>
                Daily Reminders
              </h2>
              <p style={{ 
                color: '#a8a8b3', 
                fontSize: '14px', 
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                Get daily notifications to remind you to journal and keep your streak going.
              </p>

              {/* Show unsupported message if notifications aren't supported */}
              {!isSupported && (
                <div style={{
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <p style={{ 
                    color: '#ffffff', 
                    fontSize: '14px',
                    margin: 0,
                    textAlign: 'center'
                  }}>
                    ⚠️ Notifications are not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari to enable daily reminders.
                  </p>
                </div>
              )}

                {/* Only show notification controls if notifications are supported */}
                {isSupported && (
                  <>
                    {/* Permission Status */}
                    <div style={{
                      background: permission === 'granted' 
                        ? 'rgba(76, 175, 80, 0.1)' 
                        : 'rgba(255, 193, 7, 0.1)',
                      border: `1px solid ${permission === 'granted' 
                        ? 'rgba(76, 175, 80, 0.3)' 
                        : 'rgba(255, 193, 7, 0.3)'}`,
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '20px'
                    }}>
                      <p style={{ 
                        color: '#ffffff', 
                        fontSize: '14px',
                        margin: 0,
                        textAlign: 'center'
                      }}>
                        {permissionMessage}
                      </p>
                    </div>

                    {/* Request Permission Button */}
                    {permission !== 'granted' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={async () => {
                          try {
                            await requestPermission()
                            setToast({
                              show: true,
                              message: '✅ Notification permission granted!',
                              type: 'success'
                            })
                          } catch (error) {
                            setToast({
                              show: true,
                              message: error.message || 'Failed to enable notifications',
                              type: 'error'
                            })
                          }
                        }}
                        disabled={notificationsLoading || !isSupported}
                        className="w-full text-white rounded-xl"
                        style={{
                          height: '48px',
                          background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                          fontSize: '16px',
                          fontWeight: 500,
                          letterSpacing: '0.3px',
                          border: 'none',
                          cursor: (notificationsLoading || !isSupported) ? 'not-allowed' : 'pointer',
                          opacity: (notificationsLoading || !isSupported) ? 0.7 : 1,
                          marginBottom: '20px'
                        }}
                      >
                        {notificationsLoading ? 'Requesting...' : 'Enable Notifications'}
                      </motion.button>
                    )}

                    {/* Toggle Notifications */}
                    {permission === 'granted' && (
                  <>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px'
                    }}>
                      <div>
                        <p style={{ 
                          color: '#ffffff', 
                          fontSize: '16px',
                          fontWeight: 500,
                          margin: 0,
                          marginBottom: '4px'
                        }}>
                          Daily Reminders
                        </p>
                        <p style={{ 
                          color: '#a8a8b3', 
                          fontSize: '12px',
                          margin: 0
                        }}>
                          {enabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          try {
                            await toggleNotifications(!enabled)
                            setToast({
                              show: true,
                              message: !enabled 
                                ? '✅ Daily reminders enabled!' 
                                : '🔕 Daily reminders disabled',
                              type: 'success'
                            })
                          } catch (error) {
                            let errorMessage = 'Failed to update notification settings'
                            
                            // Provide specific error message if table doesn't exist
                            if (error?.code === 'TABLE_NOT_FOUND' || error?.message?.includes('table not found')) {
                              errorMessage = '⚠️ Please run the SQL setup from supabase_notifications_setup.sql first'
                            } else if (error?.message) {
                              errorMessage = error.message
                            }
                            
                            setToast({
                              show: true,
                              message: errorMessage,
                              type: 'error'
                            })
                          }
                        }}
                        disabled={notificationsLoading}
                        style={{
                          width: '56px',
                          height: '32px',
                          borderRadius: '16px',
                          background: enabled 
                            ? 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)'
                            : 'rgba(255, 255, 255, 0.2)',
                          border: 'none',
                          cursor: notificationsLoading ? 'not-allowed' : 'pointer',
                          position: 'relative',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <motion.div
                          animate={{
                            x: enabled ? 24 : 2
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            position: 'absolute',
                            top: '2px',
                            left: '2px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                          }}
                        />
                      </motion.button>
                    </div>

                    {/* Time Selection */}
                    {enabled && (
                      <div>
                        <label style={{ 
                          color: '#ffffff', 
                          fontSize: '14px', 
                          fontWeight: 500,
                          marginBottom: '12px',
                          display: 'block',
                          letterSpacing: '0.3px'
                        }}>
                          Reminder Time
                        </label>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={localHour}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0
                              setLocalHour(Math.max(0, Math.min(23, val)))
                            }}
                            className="glass-card rounded-xl"
                            style={{
                              width: '80px',
                              height: '48px',
                              padding: '0 16px',
                              fontSize: '18px',
                              color: '#ffffff',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: hasTimeChanged 
                                ? '1px solid rgba(244, 162, 97, 0.5)' 
                                : '1px solid rgba(255, 255, 255, 0.1)',
                              outline: 'none',
                              textAlign: 'center',
                              fontWeight: 600
                            }}
                          />
                          <span style={{ 
                            color: '#ffffff', 
                            fontSize: '18px',
                            fontWeight: 600
                          }}>
                            :
                          </span>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={localMinute}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0
                              setLocalMinute(Math.max(0, Math.min(59, val)))
                            }}
                            className="glass-card rounded-xl"
                            style={{
                              width: '80px',
                              height: '48px',
                              padding: '0 16px',
                              fontSize: '18px',
                              color: '#ffffff',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: hasTimeChanged 
                                ? '1px solid rgba(244, 162, 97, 0.5)' 
                                : '1px solid rgba(255, 255, 255, 0.1)',
                              outline: 'none',
                              textAlign: 'center',
                              fontWeight: 600
                            }}
                          />
                          <span style={{ 
                            color: '#a8a8b3', 
                            fontSize: '14px',
                            marginLeft: '8px'
                          }}>
                            {localHour >= 12 ? 'PM' : 'AM'}
                          </span>
                        </div>
                        
                        {/* Save Time Button - only show when time has changed */}
                        {hasTimeChanged && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ marginTop: '12px' }}
                          >
                            <LoadingButton
                              loading={savingTime}
                              loadingText="Saving..."
                              onClick={async () => {
                                try {
                                  setSavingTime(true)
                                  await updateNotificationTime(localHour, localMinute)
                                  setToast({
                                    show: true,
                                    message: `✅ Reminder time set to ${localHour.toString().padStart(2, '0')}:${localMinute.toString().padStart(2, '0')} ${localHour >= 12 ? 'PM' : 'AM'}`,
                                    type: 'success'
                                  })
                                } catch (error) {
                                  let errorMessage = 'Failed to save reminder time'
                                  
                                  if (error?.code === 'TABLE_NOT_FOUND' || error?.message?.includes('table not found')) {
                                    errorMessage = '⚠️ Please run the SQL setup from supabase_notifications_setup.sql first'
                                  } else if (error?.message) {
                                    errorMessage = error.message
                                  }
                                  
                                  setToast({
                                    show: true,
                                    message: errorMessage,
                                    type: 'error'
                                  })
                                } finally {
                                  setSavingTime(false)
                                }
                              }}
                              className="w-full text-white rounded-xl"
                              style={{
                                height: '48px',
                                background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                                fontSize: '16px',
                                fontWeight: 500,
                                letterSpacing: '0.3px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)'
                              }}
                            >
                              Save Time
                            </LoadingButton>
                          </motion.div>
                        )}
                        
                        {/* Show current saved time or preview */}
                        <p style={{ 
                          color: hasTimeChanged ? '#f4a261' : '#a8a8b3', 
                          fontSize: '12px',
                          margin: hasTimeChanged ? '8px 0 0 0' : '12px 0 0 0'
                        }}>
                          {hasTimeChanged 
                            ? `New time: ${localHour.toString().padStart(2, '0')}:${localMinute.toString().padStart(2, '0')} ${localHour >= 12 ? 'PM' : 'AM'} (click Save to confirm)`
                            : `You'll receive a reminder at ${localHour.toString().padStart(2, '0')}:${localMinute.toString().padStart(2, '0')} ${localHour >= 12 ? 'PM' : 'AM'} daily`
                          }
                        </p>
                        {enabled && permission === 'granted' && (
                          <p style={{ 
                            color: '#a8a8b3', 
                            fontSize: '11px',
                            margin: '8px 0 0 0',
                            fontStyle: 'italic'
                          }}>
                            ⚠️ Notifications only work when your browser is open
                          </p>
                        )}
                      </div>
                    )}
                  </>
                    )}
                </>
              )}
              </div>

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              background: 'rgba(255, 255, 255, 0.1)',
              margin: '8px 0'
            }}></div>

            {/* Sign Out Section */}
            <div>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '12px',
                letterSpacing: '0.3px'
              }}>
                Sign Out
              </h2>
              <p style={{ 
                color: '#a8a8b3', 
                fontSize: '14px', 
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                Sign out of your account. You can sign back in anytime.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={signOut}
                className="w-full text-white rounded-2xl"
                style={{
                  height: '56px',
                  background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                  boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Sign Out
              </motion.button>
            </div>

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              background: 'rgba(255, 255, 255, 0.1)',
              margin: '8px 0'
            }}></div>

            {/* Legal Section */}
            <div>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '12px',
                letterSpacing: '0.3px'
              }}>
                Legal
              </h2>
              <p style={{ 
                color: '#a8a8b3', 
                fontSize: '14px', 
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                Review our privacy policy and terms of service.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link href="/privacy">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-white rounded-xl glass-card"
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(20px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Privacy Policy
                  </motion.button>
                </Link>
                <Link href="/terms">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-white rounded-xl glass-card"
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(20px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Terms of Service
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div style={{ 
              height: '1px', 
              background: 'rgba(255, 255, 255, 0.1)',
              margin: '8px 0'
            }}></div>

            {/* Delete Account Section */}
            <div>
              <h2 style={{ 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 600, 
                marginBottom: '12px',
                letterSpacing: '0.3px'
              }}>
                Delete My Account
              </h2>
              <p style={{ 
                color: '#a8a8b3', 
                fontSize: '14px', 
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                    setShowDeleteConfirm(true)
                  }
                }}
                className="w-full text-white rounded-2xl"
                style={{
                  height: '56px',
                  background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                  boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🗑️ Delete My Account
              </motion.button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block',
                      color: '#ffffff', 
                      fontSize: '14px', 
                      fontWeight: 500,
                      marginBottom: '8px',
                      letterSpacing: '0.3px'
                    }}>
                      Enter your password to confirm:
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showDeletePassword ? 'text' : 'password'}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Your password"
                        className="glass-card rounded-xl"
                        style={{
                          width: '100%',
                          height: '48px',
                          padding: '0 48px 0 16px',
                          fontSize: '16px',
                          color: '#ffffff',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          outline: 'none',
                          letterSpacing: '0.3px'
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleDeleteAccount()
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
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
                        title={showDeletePassword ? 'Hide password' : 'Show password'}
                      >
                        {showDeletePassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeletePassword('')
                      }}
                      className="flex-1 text-white rounded-xl glass-card"
                      style={{
                        height: '48px',
                        fontSize: '16px',
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                        border: 'none',
                        cursor: 'pointer',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)'
                      }}
                    >
                      Cancel
                    </motion.button>
                    <LoadingButton
                      loading={deleting}
                      loadingText="Deleting account..."
                      onClick={handleDeleteAccount}
                      disabled={deleting || !deletePassword}
                      className="flex-1 text-white rounded-xl"
                      style={{
                        height: '48px',
                        background: deleting 
                          ? 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)'
                          : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                        boxShadow: '0 4px 12px rgba(230, 57, 70, 0.3)',
                        fontSize: '16px',
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                        border: 'none'
                      }}
                    >
                      Confirm Delete
                    </LoadingButton>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </>
  )
}

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsPageContent />
    </AuthGuard>
  )
}

