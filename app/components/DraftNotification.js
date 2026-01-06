'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function DraftNotification({ show, onDismiss, draftAge }) {
  const router = useRouter()

  const handleGoToJournal = () => {
    router.push('/journal')
    if (onDismiss) onDismiss()
  }

  const handleDismiss = () => {
    if (onDismiss) onDismiss()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-40"
          style={{
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            padding: '16px 20px',
            boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)'
          }}
        >
          <div className="flex items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 flex-1">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p style={{ 
                  color: '#ffffff', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  letterSpacing: '0.3px',
                  marginBottom: '2px'
                }}>
                  You have an unsaved journal draft{draftAge ? ` from ${draftAge}` : ''}
                </p>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '12px', 
                  letterSpacing: '0.3px' 
                }}>
                  Click below to continue writing and save it
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoToJournal}
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  cursor: 'pointer'
                }}
              >
                Continue Writing
              </motion.button>
              <button
                onClick={handleDismiss}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Dismiss"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


