'use client'

import { useEffect, useState } from 'react'

export default function SuccessAnimation({ show, onComplete }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onComplete) onComplete()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!isVisible) return null

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      style={{
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="bg-white rounded-full p-6 shadow-2xl"
        style={{
          animation: 'success-check 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 20px 60px rgba(107, 144, 128, 0.3)'
        }}
      >
        <svg 
          className="w-12 h-12"
          style={{ color: '#7A9A8C' }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={3} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
    </div>
  )
}



