'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getJournalEntries } from '../utils/storage'
import { formatDate } from '../utils/dateFormat'
import { AuthGuard } from '../components/AuthGuard'
import SkeletonLoader from '../components/SkeletonLoader'
import LoadingButton from '../components/LoadingButton'

const ENTRIES_PER_PAGE = 20

function HistoryPageContent() {
  const router = useRouter()
  const [entries, setEntries] = useState([])
  const [searchDate, setSearchDate] = useState('')
  const [selectedEntry, setSelectedEntry] = useState(null)
  const dateInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [totalEntries, setTotalEntries] = useState(0)

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true)
        setOffset(0)
        const result = await getJournalEntries({ limit: ENTRIES_PER_PAGE, offset: 0 })
        
        if (result.entries) {
          // Pagination mode
          setEntries(result.entries)
          setHasMore(result.hasMore || false)
          setTotalEntries(result.total || 0)
        } else {
          // Fallback: array mode (shouldn't happen with limit)
          setEntries(result)
          setHasMore(false)
          setTotalEntries(Array.isArray(result) ? result.length : 0)
        }
      } catch (error) {
        console.error('Error loading entries:', error)
        setEntries([])
        setHasMore(false)
        setTotalEntries(0)
      } finally {
        setLoading(false)
      }
    }
    
    loadEntries()
  }, [])

  // Load more entries
  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const newOffset = offset + ENTRIES_PER_PAGE
      const result = await getJournalEntries({ limit: ENTRIES_PER_PAGE, offset: newOffset })
      
      if (result.entries) {
        setEntries(prev => [...prev, ...result.entries])
        setHasMore(result.hasMore || false)
        setOffset(newOffset)
      }
    } catch (error) {
      console.error('Error loading more entries:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  // Filter entries by search date if provided
  // Note: Search doesn't use pagination - shows all matching results
  const filteredEntries = searchDate
    ? entries.filter(entry => entry.date === searchDate)
    : entries

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry)
  }

  const handleEdit = (entry) => {
    // Navigate to journal page with entry data using ID
    router.push(`/journal?id=${entry.id}&edit=true`)
  }

  const handleBackToList = () => {
    setSelectedEntry(null)
  }
  return (
    <main 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 100%)',
        padding: '24px 20px'
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '32px'
        }}
      >
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ color: '#ffffff', fontSize: '32px', fontWeight: 600, letterSpacing: '0.3px', marginBottom: '8px' }}>
              Your Journals
            </h1>
            {!loading && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                style={{ 
                  color: '#a8a8b3', 
                  fontSize: '16px', 
                  fontWeight: 400, 
                  letterSpacing: '0.3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '28px',
                  height: '28px',
                  padding: '0 8px',
                  background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                  borderRadius: '14px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(244, 162, 97, 0.3)'
                }}>
                  {totalEntries}
                </span>
                <span>{totalEntries === 1 ? 'entry' : 'entries'}</span>
              </motion.p>
            )}
          </div>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card rounded-full px-6 py-3"
              style={{ 
                fontSize: '16px', 
                fontWeight: 500,
                color: '#ffffff',
                letterSpacing: '0.3px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Back to Home
            </motion.button>
          </Link>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card rounded-2xl"
          style={{ padding: '24px' }}
        >
          <div className="flex items-center" style={{ gap: '16px' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#a8a8b3' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  if (dateInputRef.current) {
                    dateInputRef.current.showPicker?.() || dateInputRef.current.click()
                  }
                }}
                className="w-full text-left border-none outline-none bg-transparent"
                style={{ color: searchDate ? '#ffffff' : '#a8a8b3', fontSize: '16px', fontWeight: 400, letterSpacing: '0.3px' }}
              >
                {searchDate ? formatDate(searchDate) : 'Search by date...'}
              </button>
              <input 
                ref={dateInputRef}
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
              />
            </div>
            {searchDate && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchDate('')}
                className="px-3 py-1 rounded-lg"
                style={{ color: '#f4a261', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Clear
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card rounded-3xl"
          style={{
            padding: '32px 24px'
          }}
        >
          {selectedEntry ? (
            /* Entry Detail View */
            <div>
              {/* Back Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToList}
                className="flex items-center gap-2 mb-6"
                style={{ color: '#f4a261', fontSize: '16px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.3px' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Journals
              </motion.button>

              {/* Entry Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                      color: 'white',
                      fontSize: '28px',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)'
                    }}
                  >
                    {selectedEntry.rating.toFixed(1)}
                  </div>
                  <div>
                    <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: 500, letterSpacing: '0.3px' }}>
                      {formatDate(selectedEntry.date)}
                    </h2>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEdit(selectedEntry)}
                  className="px-6 py-3 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.3px'
                  }}
                >
                  Edit Entry
                </motion.button>
              </div>

              {/* Entry Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {selectedEntry.liked && (
                  <div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 300, 
                      marginBottom: '12px', 
                      letterSpacing: '1px',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
                    }}>
                      Today's strengths:
                    </h3>
                    <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 400, lineHeight: '1.6', whiteSpace: 'pre-wrap', letterSpacing: '0.3px' }}>
                      {selectedEntry.liked}
                    </p>
                  </div>
                )}

                {selectedEntry.didntLike && (
                  <div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 300, 
                      marginBottom: '12px', 
                      letterSpacing: '1px',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
                    }}>
                      Today's weaknesses:
                    </h3>
                    <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 400, lineHeight: '1.6', whiteSpace: 'pre-wrap', letterSpacing: '0.3px' }}>
                      {selectedEntry.didntLike}
                    </p>
                  </div>
                )}

                {selectedEntry.otherThoughts && (
                  <div>
                    <h3 style={{ color: '#a8a8b3', fontSize: '16px', fontWeight: 500, marginBottom: '12px', letterSpacing: '0.3px' }}>
                      Today's events and thoughts:
                    </h3>
                    <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 400, lineHeight: '1.6', whiteSpace: 'pre-wrap', letterSpacing: '0.3px' }}>
                      {selectedEntry.otherThoughts}
                    </p>
                  </div>
                )}

                {selectedEntry.tomorrowPlans && (
                  <div>
                    <h3 style={{ color: '#a8a8b3', fontSize: '16px', fontWeight: 500, marginBottom: '12px', letterSpacing: '0.3px' }}>
                      Tomorrow's intentions:
                    </h3>
                    <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 400, lineHeight: '1.6', whiteSpace: 'pre-wrap', letterSpacing: '0.3px' }}>
                      {selectedEntry.tomorrowPlans}
                    </p>
                  </div>
                )}

                {!selectedEntry.liked && !selectedEntry.didntLike && !selectedEntry.otherThoughts && !selectedEntry.tomorrowPlans && (
                  <p style={{ color: '#a8a8b3', fontSize: '16px', fontStyle: 'italic', letterSpacing: '0.3px' }}>
                    No content for this entry
                  </p>
                )}
              </div>
            </div>
          ) : loading ? (
            /* Loading State */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <SkeletonLoader variant="journalCard" count={3} />
            </div>
          ) : filteredEntries.length === 0 ? (
            /* Empty State */
            <div className="text-center" style={{ padding: '96px 0' }}>
              <div className="text-6xl" style={{ marginBottom: '24px' }}>📔</div>
              <p style={{ color: '#ffffff', fontSize: '24px', fontWeight: 500, marginBottom: '12px', letterSpacing: '0.3px' }}>
                {searchDate ? 'No entry found for this date' : 'Start your first journal entry'}
              </p>
              <p style={{ color: '#a8a8b3', fontSize: '16px', fontWeight: 400, marginBottom: '48px', letterSpacing: '0.3px' }}>
                {searchDate ? 'Try selecting a different date' : 'Your reflections will appear here once you begin journaling'}
              </p>
              <Link href="/journal">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-block text-white rounded-2xl"
                  style={{
                    padding: '16px 48px',
                    background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                    boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)',
                    fontSize: '18px',
                    fontWeight: 500,
                    border: 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.3px'
                  }}
                >
                  {searchDate ? 'Create Entry for This Date' : 'Create Your First Entry'}
                </motion.button>
              </Link>
            </div>
          ) : (
            /* Journal Entries List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id || entry.createdAt || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card rounded-2xl p-6"
                  style={{
                    cursor: 'pointer'
                  }}
                  onClick={() => handleEntryClick(entry)}
                >
                  {/* Entry Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="flex items-center justify-center rounded-full"
                        style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)'
                        }}
                      >
                        {entry.rating.toFixed(1)}
                      </div>
                      <div>
                        <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 500, letterSpacing: '0.3px' }}>
                          {formatDate(entry.date)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Entry Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {entry.liked && (
                      <div>
                        <p style={{ 
                          fontSize: '16px', 
                          fontWeight: 300, 
                          marginBottom: '4px', 
                          letterSpacing: '1px',
                          background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
                        }}>
                          Today's strengths:
                        </p>
                        <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 400, lineHeight: '1.5', letterSpacing: '0.3px' }}>
                          {entry.liked.length > 100 ? `${entry.liked.substring(0, 100)}...` : entry.liked}
                        </p>
                      </div>
                    )}
                    {entry.didntLike && (
                      <div>
                        <p style={{ 
                          fontSize: '16px', 
                          fontWeight: 300, 
                          marginBottom: '4px', 
                          letterSpacing: '1px',
                          background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
                        }}>
                          Today's weaknesses:
                        </p>
                        <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: 400, lineHeight: '1.5', letterSpacing: '0.3px' }}>
                          {entry.didntLike.length > 100 ? `${entry.didntLike.substring(0, 100)}...` : entry.didntLike}
                        </p>
                      </div>
                    )}
                    {!entry.liked && !entry.didntLike && (
                      <p style={{ color: '#a8a8b3', fontSize: '16px', fontStyle: 'italic', letterSpacing: '0.3px' }}>
                        No content for this entry
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Load More Button - only show if not searching and has more entries */}
              {!searchDate && hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center mt-6"
                >
                  <LoadingButton
                    loading={loadingMore}
                    loadingText="Loading more..."
                    onClick={handleLoadMore}
                    className="px-8 py-4 rounded-2xl text-white font-medium"
                    style={{
                      background: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                      boxShadow: '0 4px 12px rgba(244, 162, 97, 0.3)'
                    }}
                  >
                    Load More
                  </LoadingButton>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </main>
  )
}

export default function HistoryPage() {
  return (
    <AuthGuard>
      <HistoryPageContent />
    </AuthGuard>
  )
}
