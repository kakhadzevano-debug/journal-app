'use client'

import { useState, useRef, useEffect, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import VoiceTextarea from '../components/VoiceTextarea'
import { formatDate } from '../utils/dateFormat'
import SuccessAnimation from '../components/SuccessAnimation'
import StreakToast from '../components/StreakToast'
import ConfettiAnimation from '../components/ConfettiAnimation'
import OfflineBanner from '../components/OfflineBanner'
import SyncPrompt from '../components/SyncPrompt'
import LoadingButton from '../components/LoadingButton'
import ConfirmationDialog from '../components/ConfirmationDialog'
import { saveJournalEntry, getJournalEntryById, deleteJournalEntry, getJournalEntryByDate } from '../utils/storage'
import { getMilestone } from '@/lib/streakUtils'
import { validateJournalEntry, sanitizeText, validateRating } from '@/lib/validation'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'
import { draftManager } from '@/lib/draftManager'
import { AuthGuard } from '../components/AuthGuard'

// Helper function to get today's date in local timezone (YYYY-MM-DD format)
function getTodayLocalDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function JournalPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [date, setDate] = useState(getTodayLocalDate())
  const dateInputRef = useRef(null)
  const [rating, setRating] = useState(5.0)
  const [liked, setLiked] = useState('')
  const [didntLike, setDidntLike] = useState('')
  const [otherThoughts, setOtherThoughts] = useState('')
  const [tomorrowPlans, setTomorrowPlans] = useState('')
  const [editingLabel, setEditingLabel] = useState(null) // Track which label is being edited
  const [sectionLabels, setSectionLabels] = useState({
    liked: "Section 1",
    didntLike: "Section 2",
    otherThoughts: "Section 3",
    tomorrowPlans: "Section 4"
  })
  const [visibleSections, setVisibleSections] = useState({
    liked: false,
    didntLike: false,
    otherThoughts: false,
    tomorrowPlans: false
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState(null)
  const [existingEntryForDate, setExistingEntryForDate] = useState(null)
  const [streakToast, setStreakToast] = useState({ show: false, message: '', type: 'success' })
  const [showConfetti, setShowConfetti] = useState(false)
  const [lastSaveResult, setLastSaveResult] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showSyncPrompt, setShowSyncPrompt] = useState(false)
  const [draftAge, setDraftAge] = useState(null)
  const [mounted, setMounted] = useState(false)
  const autoSaveTimeoutRef = useRef(null)
  const hasLoadedDraftRef = useRef(false)
  
  // Online status
  const { isOnline, wasOffline, setWasOffline } = useOnlineStatus()
  const enableAICleanup = isOnline // Disable AI cleanup when offline

  // Track mount state to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Character count limits
  const MAX_CHARS = 10000

  // Load draft on page load (only once, not when editing)
  useEffect(() => {
    if (hasLoadedDraftRef.current) return
    
    const entryId = searchParams.get('id')
    const isEdit = searchParams.get('edit') === 'true'
    
    // Don't load draft if editing an existing entry
    if (entryId && isEdit) {
      hasLoadedDraftRef.current = true
      return
    }
    
    // Check for existing draft
    if (draftManager.hasDraft()) {
      const draft = draftManager.loadDraft()
      if (draft) {
        const age = draftManager.getDraftAge()
        const ageText = age !== null 
          ? age < 1 ? 'just now' 
            : age === 1 ? '1 hour ago'
            : `${age} hours ago`
          : null
        
        const restore = window.confirm(
          `You have an unsaved journal from ${ageText || new Date(draft.savedAt).toLocaleString()}. Do you want to continue writing it?`
        )
        
        if (restore) {
          setDate(draft.date || date)
          setRating(draft.rating || 5.0)
          setLiked(draft.liked || '')
          setDidntLike(draft.didntLike || '')
          setOtherThoughts(draft.otherThoughts || '')
          setTomorrowPlans(draft.tomorrowPlans || '')
          // Keep all sections hidden - user must manually add sections to see content
          setVisibleSections({
            liked: false,
            didntLike: false,
            otherThoughts: false,
            tomorrowPlans: false
          })
        } else {
          draftManager.clearDraft()
          // Reset date to today when discarding draft and starting fresh
          setDate(getTodayLocalDate())
        }
      }
    } else {
      // No draft - ensure date is set to today for new journal
      setDate(getTodayLocalDate())
    }
    
    hasLoadedDraftRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load existing entry (for editing)
  useEffect(() => {
    const loadEntry = async () => {
      const entryId = searchParams.get('id')
      const isEdit = searchParams.get('edit') === 'true'
      
      if (entryId && isEdit) {
        const existingEntry = await getJournalEntryById(entryId)
        if (existingEntry) {
          setEditingEntryId(entryId)
          setDate(existingEntry.date)
          setRating(existingEntry.rating)
          setLiked(existingEntry.liked || '')
          setDidntLike(existingEntry.didntLike || '')
          setOtherThoughts(existingEntry.otherThoughts || '')
          setTomorrowPlans(existingEntry.tomorrowPlans || '')
          setExistingEntryForDate(existingEntry)
          // Keep all sections hidden - user must manually add sections to see content
          setVisibleSections({
            liked: false,
            didntLike: false,
            otherThoughts: false,
            tomorrowPlans: false
          })
          // Clear any draft when editing existing entry
          draftManager.clearDraft()
        }
      } else {
        const existing = await getJournalEntryByDate(date)
        setExistingEntryForDate(existing)
        if (existing) {
          // Load content and show sections that have content (same logic for all sections)
          setRating(existing.rating || 5.0)
          setLiked(existing.liked || '')
          setDidntLike(existing.didntLike || '')
          setOtherThoughts(existing.otherThoughts || '')
          setTomorrowPlans(existing.tomorrowPlans || '')
          // Keep all sections hidden - user must manually add sections to see content
          setVisibleSections({
            liked: false,
            didntLike: false,
            otherThoughts: false,
            tomorrowPlans: false
          })
        } else {
          // No existing entry - reset to empty state
          setRating(5.0)
          setLiked('')
          setDidntLike('')
          setOtherThoughts('')
          setTomorrowPlans('')
          setVisibleSections({
            liked: false,
            didntLike: false,
            otherThoughts: false,
            tomorrowPlans: false
          })
        }
      }
    }
    
    loadEntry()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, date])

  // Auto-save draft when offline and user is typing
  const saveDraft = useCallback(() => {
    // Don't save draft if editing existing entry
    if (editingEntryId) return
    
    // Only save if there's content
    const hasContent = rating !== 5.0 || liked.trim() || didntLike.trim() || otherThoughts.trim() || tomorrowPlans.trim()
    if (!hasContent) return
    
    const draft = {
      date,
      rating,
      liked,
      didntLike,
      otherThoughts,
      tomorrowPlans,
    }
    
    draftManager.saveDraft(draft)
  }, [date, rating, liked, didntLike, otherThoughts, tomorrowPlans, editingEntryId])

  // Auto-save draft when offline (debounced)
  useEffect(() => {
    if (!isOnline && !editingEntryId) {
      // Clear any existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      
      // Save draft 2 seconds after user stops typing
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveDraft()
      }, 2000)
      
      return () => {
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current)
        }
      }
    }
  }, [isOnline, date, rating, liked, didntLike, otherThoughts, tomorrowPlans, saveDraft, editingEntryId])

  // Show sync prompt when coming back online with a draft
  useEffect(() => {
    if (isOnline && wasOffline && draftManager.hasDraft() && !editingEntryId) {
      const age = draftManager.getDraftAge()
      const ageText = age !== null 
        ? age < 1 ? 'just now' 
          : age === 1 ? '1 hour ago'
          : `${age} hours ago`
        : null
      setDraftAge(ageText)
      setShowSyncPrompt(true)
    }
  }, [isOnline, wasOffline, editingEntryId])

  const handleEndJournaling = async () => {
    // Validate and sanitize input data
    const sanitizedEntry = {
      date,
      rating: validateRating(rating),
      liked: sanitizeText(liked),
      didntLike: sanitizeText(didntLike),
      otherThoughts: sanitizeText(otherThoughts),
      tomorrowPlans: sanitizeText(tomorrowPlans),
      createdAt: new Date().toISOString()
    }
    
    // Validate entry
    const validation = validateJournalEntry(sanitizedEntry)
    if (!validation.valid) {
      setSaveError({
        message: validation.errors[0] || 'Please check your input and try again',
        canRetry: false
      })
      return
    }
    
    // Check if offline
    if (!isOnline) {
      // Save as draft
      const draft = {
        date,
        rating,
        liked,
        didntLike,
        otherThoughts,
        tomorrowPlans,
      }
      draftManager.saveDraft(draft)
      
      setStreakToast({
        show: true,
        message: 'You are offline. Your journal has been saved as a draft and will sync when you reconnect.',
        type: 'same_day'
      })
      return
    }
    
    setSaving(true)
    setSaveError(null)
    
    try {
      // Save journal entry (returns streak result if new entry)
      const saveResult = await saveJournalEntry(sanitizedEntry, editingEntryId)
      setLastSaveResult(saveResult) // Store for navigation
      
      // Clear draft after successful save
      draftManager.clearDraft()
      
      // Show streak feedback if this was a new entry
      if (saveResult.isNewEntry && saveResult.streakResult) {
        const streakResult = saveResult.streakResult
        
        // Check for milestone
        const milestone = getMilestone(streakResult.current_streak)
        if (milestone) {
          setShowConfetti(true)
          setStreakToast({
            show: true,
            message: milestone.message,
            type: 'milestone'
          })
        } else if (streakResult.is_new_record) {
          setShowConfetti(true)
          setStreakToast({
            show: true,
            message: `🎉 New personal record! ${streakResult.current_streak} days!`,
            type: 'record'
          })
        } else if (streakResult.streak_reset) {
          setStreakToast({
            show: true,
            message: `Streak reset. Starting fresh at 1 day! 💪`,
            type: 'reset'
          })
        } else if (streakResult.day_relationship === 'same_day') {
          setStreakToast({
            show: true,
            message: `Already journaled today! Current streak: ${streakResult.current_streak} ${streakResult.current_streak === 1 ? 'day' : 'days'}`,
            type: 'same_day'
          })
        } else if (streakResult.streak_increased) {
          setStreakToast({
            show: true,
            message: `🔥 ${streakResult.current_streak} ${streakResult.current_streak === 1 ? 'day' : 'days'} streak! Keep it going!`,
            type: 'success'
          })
        }
      }
      
      setShowSuccess(true)
      setSaving(false)
    } catch (error) {
      console.error('Error saving entry:', error)
      
      // Check if it's a network error
      const isNetworkError = error.message?.includes('network') || 
                            error.message?.includes('fetch') || 
                            error.message?.includes('connection') ||
                            error.message?.includes('No internet')
      
      if (isNetworkError) {
        // Save as draft on network error
        const draft = {
          date,
          rating,
          liked,
          didntLike,
          otherThoughts,
          tomorrowPlans,
        }
        draftManager.saveDraft(draft)
        
        setSaveError({
          message: 'Connection lost. Your journal has been saved as a draft and will sync when you reconnect.',
          canRetry: true
        })
      } else {
        setSaveError({
          message: error.message || 'Failed to save entry. Please try again.',
          canRetry: error.canRetry !== false
        })
      }
      setSaving(false)
    }
  }

  // Handle sync when coming back online
  const handleSyncNow = async () => {
    setShowSyncPrompt(false)
    setSaving(true)
    setSaveError(null)
    
    // Wait a moment for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Verify we're actually online before attempting sync
    if (!navigator.onLine) {
      setSaving(false)
      setSaveError({
        message: 'Still offline. Please check your connection and try again.',
        canRetry: true
      })
      setShowSyncPrompt(true) // Show prompt again
      return
    }
    
    try {
      // Load draft data into form (it's already loaded, just trigger save)
      await handleEndJournaling()
      setWasOffline(false)
    } catch (error) {
      console.error('Sync error:', error)
      setSaving(false)
      
      // If sync fails, keep the draft and show error
      setSaveError({
        message: 'Failed to sync. Your draft is still saved. Please try again.',
        canRetry: true
      })
      
      // Show sync prompt again if it's a network error
      const isNetworkError = error.message?.includes('network') || 
                            error.message?.includes('fetch') || 
                            error.message?.includes('connection') ||
                            error.message?.includes('Failed to fetch')
      
      if (isNetworkError) {
        setShowSyncPrompt(true)
      }
    }
  }

  const handleDiscardDraft = () => {
    draftManager.clearDraft()
    setShowSyncPrompt(false)
    setWasOffline(false)
  }

  const handleRetrySave = () => {
    setSaveError(null)
    handleEndJournaling()
  }

  const handleSuccessComplete = () => {
    // Navigate home after animation
    // Pass streak result if available so home page can show updated streak
    const streakResult = lastSaveResult?.streakResult
    if (streakResult?.current_streak) {
      router.push(`/?streak=${streakResult.current_streak}`)
    } else {
      router.push('/')
    }
  }

  const handleToastClose = () => {
    setStreakToast({ show: false, message: '', type: 'success' })
  }

  const handleConfettiComplete = () => {
    setShowConfetti(false)
  }

  const [deletingSection, setDeletingSection] = useState(null) // Track which section is being deleted
  const [activeRecordingSection, setActiveRecordingSection] = useState(null) // Track which section is currently recording
  
  const handleDeleteSection = (sectionKey) => {
    // Prevent deletion of section 1 (liked section)
    if (sectionKey === 'liked') {
      return
    }
    
    // Count visible sections
    const visibleCount = Object.values(visibleSections).filter(v => v).length
    
    // Don't allow deleting if only one section is visible
    if (visibleCount <= 1) {
      return
    }
    
    // Check if section has content
    let hasContent = false
    switch(sectionKey) {
      case 'liked':
        hasContent = liked.trim().length > 0
        break
      case 'didntLike':
        hasContent = didntLike.trim().length > 0
        break
      case 'otherThoughts':
        hasContent = otherThoughts.trim().length > 0
        break
      case 'tomorrowPlans':
        hasContent = tomorrowPlans.trim().length > 0
        break
    }
    
    // If section has content, show confirmation dialog
    if (hasContent) {
      setDeletingSection(sectionKey)
      return
    }
    
    // If no content, delete immediately
    confirmDeleteSection(sectionKey)
  }
  
  const confirmDeleteSection = (sectionKey) => {
    // Hide the section and clear its content
    setVisibleSections(prev => ({ ...prev, [sectionKey]: false }))
    
    // Clear the section's content
    switch(sectionKey) {
      case 'liked':
        setLiked('')
        break
      case 'didntLike':
        setDidntLike('')
        break
      case 'otherThoughts':
        setOtherThoughts('')
        break
      case 'tomorrowPlans':
        setTomorrowPlans('')
        break
    }
    
    setDeletingSection(null)
  }

  const handleAddSection = () => {
    // Reveal sections in order: liked (Section 1), didntLike (Section 2), otherThoughts (Section 3), tomorrowPlans (Section 4)
    if (!visibleSections.liked) {
      setVisibleSections(prev => ({ ...prev, liked: true }))
    } else if (!visibleSections.didntLike) {
      setVisibleSections(prev => ({ ...prev, didntLike: true }))
    } else if (!visibleSections.otherThoughts) {
      setVisibleSections(prev => ({ ...prev, otherThoughts: true }))
    } else if (!visibleSections.tomorrowPlans) {
      setVisibleSections(prev => ({ ...prev, tomorrowPlans: true }))
    }
  }
  
  // Show "Add Section" button when there are fewer than 4 sections visible
  const hasHiddenSections = Object.values(visibleSections).filter(v => v).length < 4

  const handleRecordingStart = (sectionKey) => {
    // Stop any other active recording by setting activeRecordingSection
    // This will cause other sections' stopRecording prop to become true
    setActiveRecordingSection(sectionKey)
  }

  const handleRecordingStop = (sectionKey) => {
    if (activeRecordingSection === sectionKey) {
      setActiveRecordingSection(null)
    }
  }

  const handleDelete = async () => {
    const entryToDelete = editingEntryId || existingEntryForDate?.id
    
    if (entryToDelete) {
      if (window.confirm(`Are you sure you want to delete this journal entry from ${formatDate(date)}? This action cannot be undone.`)) {
        try {
          setDeleting(true)
          await deleteJournalEntry(entryToDelete)
          setEditingEntryId(null)
          setExistingEntryForDate(null)
          setRating(5.0)
          setLiked('')
          setDidntLike('')
          setOtherThoughts('')
          setTomorrowPlans('')
          router.push('/')
        } catch (error) {
          console.error('Error deleting entry:', error)
          alert('Failed to delete entry. Please try again.')
          setDeleting(false)
        }
      }
    } else {
      if (window.confirm('Are you sure you want to clear all fields? This will delete any unsaved content.')) {
        setDate(getTodayLocalDate()) // Reset date to today
        setRating(5.0)
        setLiked('')
        setDidntLike('')
        setOtherThoughts('')
        setTomorrowPlans('')
        setExistingEntryForDate(null) // Clear any existing entry reference
      }
    }
  }

  return (
    <>
      {/* Only render OfflineBanner after mount to prevent hydration mismatch */}
      {mounted && <OfflineBanner show={!isOnline} />}
      {deletingSection && (
        <ConfirmationDialog
          show={true}
          title="Delete Section"
          message="Are you sure you want to delete this section? All content will be lost."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => confirmDeleteSection(deletingSection)}
          onCancel={() => setDeletingSection(null)}
          confirmColor="#e63946"
        />
      )}
      <SyncPrompt 
        show={showSyncPrompt}
        onSync={handleSyncNow}
        onDiscard={handleDiscardDraft}
        draftAge={draftAge}
        syncing={saving}
      />
      <SuccessAnimation show={showSuccess} onComplete={handleSuccessComplete} />
      <StreakToast 
        show={streakToast.show} 
        message={streakToast.message} 
        type={streakToast.type}
        onClose={handleToastClose}
      />
      <ConfettiAnimation show={showConfetti} onComplete={handleConfettiComplete} />
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
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link 
              href="/"
              className="flex items-center justify-center w-12 h-12 rounded-full glass-card transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="glass-card rounded-full" style={{ padding: '10px 20px', cursor: 'pointer' }}>
              <button
                type="button"
                onClick={() => {
                  if (dateInputRef.current) {
                    dateInputRef.current.showPicker?.() || dateInputRef.current.click()
                  }
                }}
                style={{ color: '#ffffff', fontSize: '16px', fontWeight: 500, letterSpacing: '0.3px' }}
              >
                {formatDate(date)}
              </button>
              <input 
                ref={dateInputRef}
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="absolute inset-0 opacity-0 pointer-events-none"
              />
            </div>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 400, 
              color: '#a8a8b3',
              letterSpacing: '0.3px'
            }}>
              Select date
            </span>
          </motion.div>
          
          {/* Online/Offline Indicator */}
          <div className="flex items-center gap-2" style={{ minWidth: '48px', justifyContent: 'flex-end' }}>
            {isOnline ? (
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 8px rgba(74, 222, 128, 0.5)'
                  }}
                />
                <span style={{ 
                  fontSize: '11px', 
                  color: '#4ade80',
                  fontWeight: 500,
                  letterSpacing: '0.3px'
                }}>
                  Online
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#f59e0b'
                  }}
                />
                <span style={{ 
                  fontSize: '11px', 
                  color: '#f59e0b',
                  fontWeight: 500,
                  letterSpacing: '0.3px'
                }}>
                  Offline
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rating Section */}
          <div>
            <label className="block" style={{ color: '#ffffff', marginBottom: '20px', fontSize: '20px', fontWeight: 500, letterSpacing: '0.3px' }}>
              Today's satisfaction
            </label>
            <div className="flex items-center" style={{ gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: 600, color: '#f4a261' }}>
                {rating.toFixed(1)}
              </span>
              <span style={{ fontSize: '16px', color: '#a8a8b3', fontWeight: 400 }}>/ 10</span>
            </div>
            <div className="relative" style={{ padding: '16px 12px' }}>
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={Math.max(1, Math.min(10, rating))}
                onChange={(e) => {
                  const newRating = parseFloat(e.target.value)
                  setRating(Math.max(1, Math.min(10, newRating)))
                }}
                className="rating-slider"
                style={{
                  background: `linear-gradient(to right, #f4a261 0%, #f4a261 ${((rating - 1) * 100) / 9}%, rgba(255, 255, 255, 0.1) ${((rating - 1) * 100) / 9}%, rgba(255, 255, 255, 0.1) 100%)`
                }}
              />
              <div className="flex justify-between mt-2 px-1" style={{ color: '#a8a8b3', fontSize: '12px', fontWeight: 400 }}>
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Journal Entry Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            {visibleSections.liked && (
            <div className="glass-card rounded-2xl p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {editingLabel === 'liked' ? (
                  <input
                    type="text"
                    value={sectionLabels.liked}
                    onChange={(e) => setSectionLabels({ ...sectionLabels, liked: e.target.value })}
                    onBlur={() => setEditingLabel(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingLabel(null)
                      }
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '20px',
                      fontWeight: 300,
                      letterSpacing: '1px',
                      outline: 'none'
                    }}
                  />
                ) : (
                  <>
                    <label 
                      onClick={() => setEditingLabel('liked')}
                      style={{ 
                        fontSize: '20px', 
                        fontWeight: 300, 
                        letterSpacing: '1px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      {sectionLabels.liked}
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingLabel('liked')}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: 0
                      }}
                      type="button"
                    >
                      ✎
                    </motion.button>
                    {/* Delete button hidden for section 1 (liked section) - it cannot be deleted */}
                  </>
                )}
              </div>
              <VoiceTextarea
                label={sectionLabels.liked}
                placeholder="Share something positive that happened..."
                value={liked}
                onChange={setLiked}
                enableAICleanup={enableAICleanup}
                showLabel={false}
                noWrapper={true}
                sectionKey="liked"
                onRecordingStart={handleRecordingStart}
                onRecordingStop={handleRecordingStop}
                stopRecording={activeRecordingSection !== null && activeRecordingSection !== 'liked'}
              />
              {liked.length > 0 && (
                <p style={{ 
                  color: liked.length > MAX_CHARS ? '#e63946' : '#a8a8b3', 
                  fontSize: '12px', 
                  marginTop: '8px',
                  textAlign: 'right'
                }}>
                  {liked.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                </p>
              )}
            </div>
            )}

            {visibleSections.didntLike && (
            <div className="glass-card rounded-2xl p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {editingLabel === 'didntLike' ? (
                  <input
                    type="text"
                    value={sectionLabels.didntLike}
                    onChange={(e) => setSectionLabels({ ...sectionLabels, didntLike: e.target.value })}
                    onBlur={() => setEditingLabel(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingLabel(null)
                      }
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '20px',
                      fontWeight: 300,
                      letterSpacing: '1px',
                      outline: 'none'
                    }}
                  />
                ) : (
                  <>
                    <label 
                      onClick={() => setEditingLabel('didntLike')}
                      style={{ 
                        fontSize: '20px', 
                        fontWeight: 300, 
                        letterSpacing: '1px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      {sectionLabels.didntLike}
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingLabel('didntLike')}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: 0
                      }}
                      type="button"
                    >
                      ✎
                    </motion.button>
                    {Object.values(visibleSections).filter(v => v).length > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteSection('didntLike')}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(230, 57, 70, 0.2)',
                          border: '1px solid rgba(230, 57, 70, 0.4)',
                          color: '#e63946',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: 0,
                          fontWeight: 'bold'
                        }}
                        type="button"
                      >
                        ×
                      </motion.button>
                    )}
                  </>
                )}
              </div>
              <VoiceTextarea
                label={sectionLabels.didntLike}
                placeholder="Reflect on any difficulties or obstacles..."
                value={didntLike}
                onChange={setDidntLike}
                enableAICleanup={enableAICleanup}
                showLabel={false}
                noWrapper={true}
                sectionKey="didntLike"
                onRecordingStart={handleRecordingStart}
                onRecordingStop={handleRecordingStop}
                stopRecording={activeRecordingSection !== null && activeRecordingSection !== 'didntLike'}
              />
              {didntLike.length > 0 && (
                <p style={{ 
                  color: didntLike.length > MAX_CHARS ? '#e63946' : '#a8a8b3', 
                  fontSize: '12px', 
                  marginTop: '8px',
                  textAlign: 'right'
                }}>
                  {didntLike.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                </p>
              )}
            </div>
            )}

            {visibleSections.otherThoughts && (
            <div className="glass-card rounded-2xl p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {editingLabel === 'otherThoughts' ? (
                  <input
                    type="text"
                    value={sectionLabels.otherThoughts}
                    onChange={(e) => setSectionLabels({ ...sectionLabels, otherThoughts: e.target.value })}
                    onBlur={() => setEditingLabel(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingLabel(null)
                      }
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '20px',
                      fontWeight: 300,
                      letterSpacing: '1px',
                      outline: 'none'
                    }}
                  />
                ) : (
                  <>
                    <label 
                      onClick={() => setEditingLabel('otherThoughts')}
                      style={{ 
                        fontSize: '20px', 
                        fontWeight: 300, 
                        letterSpacing: '1px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      {sectionLabels.otherThoughts}
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingLabel('otherThoughts')}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: 0
                      }}
                      type="button"
                    >
                      ✎
                    </motion.button>
                    {Object.values(visibleSections).filter(v => v).length > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteSection('otherThoughts')}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(230, 57, 70, 0.2)',
                          border: '1px solid rgba(230, 57, 70, 0.4)',
                          color: '#e63946',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: 0,
                          fontWeight: 'bold'
                        }}
                        type="button"
                      >
                        ×
                      </motion.button>
                    )}
                  </>
                )}
              </div>
              <VoiceTextarea
                label={sectionLabels.otherThoughts}
                placeholder="Any other thoughts you'd like to capture..."
                value={otherThoughts}
                onChange={setOtherThoughts}
                enableAICleanup={enableAICleanup}
                showLabel={false}
                noWrapper={true}
                sectionKey="otherThoughts"
                onRecordingStart={handleRecordingStart}
                onRecordingStop={handleRecordingStop}
                stopRecording={activeRecordingSection !== null && activeRecordingSection !== 'otherThoughts'}
              />
              {otherThoughts.length > 0 && (
                <p style={{ 
                  color: otherThoughts.length > MAX_CHARS ? '#e63946' : '#a8a8b3', 
                  fontSize: '12px', 
                  marginTop: '8px',
                  textAlign: 'right'
                }}>
                  {otherThoughts.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                </p>
              )}
            </div>
            )}

            {visibleSections.tomorrowPlans && (
            <div className="glass-card rounded-2xl p-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {editingLabel === 'tomorrowPlans' ? (
                  <input
                    type="text"
                    value={sectionLabels.tomorrowPlans}
                    onChange={(e) => setSectionLabels({ ...sectionLabels, tomorrowPlans: e.target.value })}
                    onBlur={() => setEditingLabel(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingLabel(null)
                      }
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '20px',
                      fontWeight: 300,
                      letterSpacing: '1px',
                      outline: 'none'
                    }}
                  />
                ) : (
                  <>
                    <label 
                      onClick={() => setEditingLabel('tomorrowPlans')}
                      style={{ 
                        fontSize: '20px', 
                        fontWeight: 300, 
                        letterSpacing: '1px',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      {sectionLabels.tomorrowPlans}
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingLabel('tomorrowPlans')}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px',
                        padding: 0
                      }}
                      type="button"
                    >
                      ✎
                    </motion.button>
                    {Object.values(visibleSections).filter(v => v).length > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteSection('tomorrowPlans')}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(230, 57, 70, 0.2)',
                          border: '1px solid rgba(230, 57, 70, 0.4)',
                          color: '#e63946',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: 0,
                          fontWeight: 'bold'
                        }}
                        type="button"
                      >
                        ×
                      </motion.button>
                    )}
                  </>
                )}
              </div>
              <VoiceTextarea
                label={sectionLabels.tomorrowPlans}
                placeholder="What are you looking forward to or planning for tomorrow?"
                value={tomorrowPlans}
                onChange={setTomorrowPlans}
                enableAICleanup={enableAICleanup}
                showLabel={false}
                noWrapper={true}
                sectionKey="tomorrowPlans"
                onRecordingStart={handleRecordingStart}
                onRecordingStop={handleRecordingStop}
                stopRecording={activeRecordingSection !== null && activeRecordingSection !== 'tomorrowPlans'}
              />
              {tomorrowPlans.length > 0 && (
                <p style={{ 
                  color: tomorrowPlans.length > MAX_CHARS ? '#e63946' : '#a8a8b3', 
                  fontSize: '12px', 
                  marginTop: '8px',
                  textAlign: 'right'
                }}>
                  {tomorrowPlans.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
                </p>
              )}
            </div>
            )}
            
            {/* Add Section Button */}
            {hasHiddenSections && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddSection}
                className="glass-card rounded-2xl p-4 w-full flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 400,
                  letterSpacing: '0.3px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                type="button"
              >
                <span style={{ fontSize: '20px' }}>+</span>
                <span>Add Section</span>
              </motion.button>
            )}
          </div>

        {/* Bottom Buttons */}
          <div style={{ paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Show delete button if editing, or if there's existing content to clear */}
            {(editingEntryId || existingEntryForDate || liked || didntLike || otherThoughts || tomorrowPlans) && (
              <LoadingButton
                loading={deleting}
                loadingText="Deleting..."
                onClick={handleDelete}
                disabled={deleting || saving}
                className="w-full text-white rounded-2xl"
                style={{
                  height: '56px',
                  background: deleting
                    ? 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)'
                    : 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
                  boxShadow: deleting
                    ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                    : '0 4px 12px rgba(230, 57, 70, 0.3)',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  border: 'none'
                }}
              >
                {editingEntryId || existingEntryForDate ? 'Delete Entry' : 'Clear All'}
              </LoadingButton>
            )}
            
            {/* Error Message */}
            {saveError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl"
                style={{
                  padding: '16px',
                  background: 'rgba(230, 57, 70, 0.1)',
                  border: '1px solid rgba(230, 57, 70, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: saveError.canRetry ? '12px' : '0' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#e63946', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p style={{ 
                    color: '#ffffff', 
                    fontSize: '16px', 
                    fontWeight: 500,
                    margin: 0,
                    flex: 1
                  }}>
                    {saveError.message}
                  </p>
                </div>
                {saveError.canRetry && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRetrySave}
                    className="w-full text-white rounded-xl"
                    style={{
                      height: '40px',
                      background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '12px'
                    }}
                  >
                    Retry
                  </motion.button>
                )}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEndJournaling}
              disabled={saving}
              className="w-full text-white rounded-2xl"
              style={{
                height: '64px',
                background: saving
                  ? 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)'
                  : 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                boxShadow: saving
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : '0 4px 12px rgba(244, 162, 97, 0.3)',
                fontSize: '18px',
                fontWeight: 500,
                letterSpacing: '0.3px',
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'Saving...' : 'Save & Finish'}
            </motion.button>
          </div>
      </motion.div>
    </main>
    </>
  )
}

export default function JournalPage() {
  return (
    <Suspense fallback={
      <main 
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)'
        }}
      >
        <div style={{ color: '#ffffff' }}>Loading...</div>
      </main>
    }>
      <JournalPageContent />
    </Suspense>
  )
}
 