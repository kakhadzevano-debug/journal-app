'use client'

import { useState, useEffect, useRef } from 'react'

export default function AnimatedCounter({ value, duration = 400 }) {
  const [displayValue, setDisplayValue] = useState(value) // Initialize with value to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false)
  const animationFrameRef = useRef(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      setDisplayValue(value)
      return
    }
    
    if (value === displayValue) return

    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const startValue = displayValue
    const endValue = value
    const startTime = Date.now()

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Ease-out function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut)
      
      setDisplayValue(currentValue)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
        animationFrameRef.current = null
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [value, duration, isMounted]) // Removed displayValue from dependencies to prevent infinite loop

  // Return value directly to match server render
  return <>{displayValue}</>
}

