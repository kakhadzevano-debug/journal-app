'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function SyncPrompt({ show, onSync, onDiscard, draftAge, syncing = false }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-3xl"
            style={{
              padding: '32px 24px',
              maxWidth: '480px',
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 16px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                }}
              >
                ✓
              </motion.div>
            </div>
            
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 600, 
              color: '#ffffff',
              marginBottom: '12px',
              textAlign: 'center',
              letterSpacing: '0.3px'
            }}>
              You're back online!
            </h3>
            
            <p style={{ 
              color: '#a8a8b3', 
              textAlign: 'center', 
              marginBottom: '24px',
              fontSize: '16px',
              lineHeight: '1.6',
              letterSpacing: '0.3px'
            }}>
              You have an unsaved journal draft{draftAge ? ` from ${draftAge} ago` : ''}. Would you like to save it now?
            </p>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button
                whileHover={!syncing ? { scale: 1.02 } : {}}
                whileTap={!syncing ? { scale: 0.98 } : {}}
                onClick={onSync}
                disabled={syncing}
                className="flex-1 py-3 rounded-xl font-medium text-white"
                style={{
                  background: syncing
                    ? 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)'
                    : 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
                  border: 'none',
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  boxShadow: syncing ? 'none' : '0 4px 12px rgba(244, 162, 97, 0.25)',
                  opacity: syncing ? 0.7 : 1
                }}
              >
                {syncing ? 'Syncing...' : 'Save Now'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDiscard}
                className="flex-1 py-3 rounded-xl font-medium"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.3px'
                }}
              >
                Discard
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

