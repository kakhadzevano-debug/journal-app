'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function OfflineBanner({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}
        >
          <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#ffffff' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500, letterSpacing: '0.3px' }}>
              You're offline
            </span>
            <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px', letterSpacing: '0.3px' }}>
              - Your work is being saved locally
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


