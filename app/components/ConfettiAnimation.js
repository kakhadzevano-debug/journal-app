'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ConfettiAnimation({ show, onComplete }) {
  const [isVisible, setIsVisible] = useState(false)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Generate random particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        color: ['#f4a261', '#e76f51', '#ffd700', '#ff8c00', '#ff6b6b', '#4ecdc4'][
          Math.floor(Math.random() * 6)
        ]
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onComplete) onComplete()
      }, 2000)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            rotate: 0,
            scale: 0.8
          }}
          animate={{
            y: '110%',
            rotate: particle.rotation + 360,
            scale: [0.8, 1, 0.8],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut'
          }}
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            backgroundColor: particle.color,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${particle.color}`
          }}
        />
      ))}
    </div>
  )
}

