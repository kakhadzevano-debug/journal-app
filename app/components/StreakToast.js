'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StreakToast({ show, message, type = 'success', onClose }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) {
          setTimeout(onClose, 300) // Wait for animation to complete
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  if (!show && !isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'milestone':
        return '🎉'
      case 'record':
        return '🌟'
      case 'reset':
        return '💪'
      case 'same_day':
        return '✅'
      default:
        return '🔥'
    }
  }

  const getColor = () => {
    switch (type) {
      case 'milestone':
        return 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)'
      case 'record':
        return 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)'
      case 'reset':
        return 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)'
      case 'same_day':
        return 'linear-gradient(135deg, #7A9A8C 0%, #5a7a6c 100%)'
      default:
        return 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
          style={{ maxWidth: '90%', width: '400px' }}
        >
          <div
            className="glass-card rounded-2xl px-6 py-4 flex items-center gap-3"
            style={{
              background: getColor(),
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <span style={{ fontSize: '28px' }}>{getIcon()}</span>
            <p
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#ffffff',
                letterSpacing: '0.3px',
                margin: 0,
                flex: 1
              }}
            >
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

