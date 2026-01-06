'use client'

import { useState, useRef, useEffect } from 'react'
import { useOnlineStatus } from '@/lib/hooks/useOnlineStatus'

// Common voice-to-text error corrections
function fixCommonVoiceErrors(text) {
  const corrections = {
    // Common abbreviations and casual speech
    '\\bu\\b': 'you',
    '\\bur\\b': 'your',
    '\\bure\\b': "you're",
    '\\bcuz\\b': 'because',
    '\\bwanna\\b': 'want to',
    '\\bgonna\\b': 'going to',
    '\\bgotta\\b': 'got to',
    '\\blemme\\b': 'let me',
    '\\bimma\\b': "I'm going to",
    '\\bthru\\b': 'through',
    '\\btho\\b': 'though',
    '\\bprobly\\b': 'probably',
    '\\bdef\\b': 'definitely',
    '\\bdefinately\\b': 'definitely',
    '\\breal\\b': 'really',
    '\\brite\\b': 'right',
    // Common contractions (without apostrophes)
    '\\bdont\\b': "don't",
    '\\bcant\\b': "can't",
    '\\bwont\\b': "won't",
    '\\bisnt\\b': "isn't",
    '\\barent\\b': "aren't",
    '\\bwasnt\\b': "wasn't",
    '\\bwerent\\b': "weren't",
    '\\bhavent\\b': "haven't",
    '\\bhasnt\\b': "hasn't",
    '\\bhadnt\\b': "hadn't",
    '\\bwouldnt\\b': "wouldn't",
    '\\bcouldnt\\b': "couldn't",
    '\\bshouldnt\\b': "shouldn't",
    '\\bdoesnt\\b': "doesn't",
    '\\bdidnt\\b': "didn't",
    '\\bim\\b': "I'm",
    '\\bive\\b': "I've",
    '\\bill\\b': "I'll",
    '\\bid\\b': "I'd",
    '\\bits\\b': "it's",
    '\\bthats\\b': "that's",
    '\\btheres\\b': "there's",
    '\\bheres\\b': "here's",
    '\\bwheres\\b': "where's",
    '\\bwhos\\b': "who's",
    '\\bwhats\\b': "what's",
    '\\bhow\\s+are\\s+you\\b': "how are you",
    // Common word confusions
    '\\bthere\\s+going\\b': "they're going",
    '\\bthere\\s+were\\b': "they were",
    '\\bthere\\s+was\\b': "they were",
    '\\byour\\s+welcome\\b': "you're welcome",
    '\\byour\\s+right\\b': "you're right",
    '\\byour\\s+wrong\\b': "you're wrong",
    '\\byour\\s+here\\b': "you're here",
    '\\byour\\s+there\\b': "you're there",
  }
  
  let corrected = text
  for (const [pattern, replacement] of Object.entries(corrections)) {
    corrected = corrected.replace(new RegExp(pattern, 'gi'), replacement)
  }
  
  return corrected
}

// Enhanced grammar and formatting function with improved punctuation
function addGrammar(text) {
  if (!text || text.trim() === '') return text
  
  // First fix common voice errors
  let formatted = fixCommonVoiceErrors(text.trim())
  
  // Trim and clean up multiple spaces
  formatted = formatted.replace(/\s+/g, ' ')
  
  // Fix common capitalization issues first
  formatted = formatted.replace(/\bi\b/g, 'I')
  formatted = formatted.replace(/\bi'm\b/gi, "I'm")
  formatted = formatted.replace(/\bi'll\b/gi, "I'll")
  formatted = formatted.replace(/\bi've\b/gi, "I've")
  formatted = formatted.replace(/\bi'd\b/gi, "I'd")
  
  // Capitalize first letter
  if (formatted.length > 0 && formatted[0] === formatted[0].toLowerCase()) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }
  
  // ONLY add period at the very end if text doesn't already have punctuation
  // Do NOT add periods anywhere else - let AI handle sentence structure
  if (!/[.!?]$/.test(formatted.trim())) {
    formatted = formatted.trim() + '.'
  }
  
  return formatted.trim()
}

export default function VoiceTextarea({ label, placeholder, value, onChange, enableAICleanup = false }) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState(null)
  const [showTextarea, setShowTextarea] = useState(value && value.trim().length > 0)
  const [isCleaning, setIsCleaning] = useState(false) // Loading state for AI cleanup
  const recognitionRef = useRef(null)
  const valueRef = useRef(value)
  const startingValueRef = useRef(value) // Remember the value when we started
  const manuallyStoppedRef = useRef(false)
  const updateTimeoutRef = useRef(null) // For debouncing updates
  const pendingTextRef = useRef(null) // Store pending text updates
  const apiCleanupTimeoutRef = useRef(null) // For periodic API cleanup while speaking
  const lastCleanedTextRef = useRef('') // Track last text we sent to API
  const pendingApiResponseRef = useRef(null) // Store pending API response
  const textareaRef = useRef(null) // Ref for the textarea element
  
  // Use online status hook to prevent hydration mismatches
  const { isOnline } = useOnlineStatus()
  const [mounted, setMounted] = useState(false)
  
  // Track mount state to ensure consistent rendering
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Keep refs in sync with value prop
  useEffect(() => {
    valueRef.current = value
    // Show textarea if there's text
    if (value && value.trim().length > 0) {
      setShowTextarea(true)
    }
  }, [value])

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto'
      // Set height to scrollHeight (content height)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value, showTextarea])

  useEffect(() => {
    // Check if the browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        setError('Your browser does not support voice recording. Please use Chrome, Edge, or Safari.')
        return
      }

      // Initialize speech recognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true // Keep listening until manually stopped
      recognition.interimResults = true // Show text as you speak (real-time)
      recognition.lang = 'en-US'
      recognition.maxAlternatives = 1 // Only get the best result (improves accuracy)

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        manuallyStoppedRef.current = false
        startingValueRef.current = valueRef.current
      }

      recognition.onresult = (event) => {
        let finalizedText = startingValueRef.current
        let interimText = ''

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalizedText += transcript + ' '
          } else {
            interimText += transcript + ' '
          }
        }

        const lastIndex = event.results.length - 1
        const hasInterim = lastIndex >= 0 && !event.results[lastIndex].isFinal
        let displayText = finalizedText.trim()
        if (hasInterim) {
          displayText += ' ' + event.results[lastIndex][0].transcript
        }
        
        pendingTextRef.current = displayText.trim()
        
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current)
        }
        
        updateTimeoutRef.current = setTimeout(() => {
          if (pendingTextRef.current !== null) {
            onChange(pendingTextRef.current)
            valueRef.current = pendingTextRef.current
            pendingTextRef.current = null
            
            if (enableAICleanup && isListening && valueRef.current.trim().length > 20) {
              const currentText = valueRef.current.trim()
              if (currentText.length - lastCleanedTextRef.current.length >= 10) {
                if (apiCleanupTimeoutRef.current) {
                  clearTimeout(apiCleanupTimeoutRef.current)
                }
                
                apiCleanupTimeoutRef.current = setTimeout(() => {
                  if (isListening && enableAICleanup) {
                    const textToClean = valueRef.current.trim()
                    if (textToClean.length > 0) {
                      setIsCleaning(true)
                      fetch('/api/cleanup-text', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: textToClean }),
                      })
                      .then(response => {
                        if (response.ok) {
                          return response.json()
                        }
                        throw new Error('API request failed')
                      })
                      .then(data => {
                        if (data.cleanedText && isListening) {
                          const currentValue = valueRef.current.trim()
                          if (currentValue.length <= data.cleanedText.length * 1.2) {
                            onChange(data.cleanedText)
                            valueRef.current = data.cleanedText
                            lastCleanedTextRef.current = data.cleanedText
                            pendingApiResponseRef.current = data.cleanedText
                          }
                        }
                        setIsCleaning(false)
                      })
                      .catch(err => {
                        console.error('Error calling AI cleanup:', err)
                        setIsCleaning(false)
                      })
                    }
                  }
                }, 1500)
              }
            }
          }
        }, 300)
      }

      recognition.onerror = (event) => {
        // Don't stop listening on 'no-speech' or 'aborted' errors in continuous mode
        // These can happen automatically and should not stop recording
        if (event.error === 'no-speech') {
          // Just ignore - keep listening (don't log this common, expected error)
          return
        } else if (event.error === 'aborted') {
          // 'aborted' can happen automatically in continuous mode
          // Only treat as manual stop if manuallyStoppedRef is already true
          // Otherwise, let onend handler restart it (don't log this expected error)
          if (!manuallyStoppedRef.current) {
            // This is an automatic abort, let onend restart it
            return
          }
          // This was a manual stop
          setIsListening(false)
        } else if (event.error === 'not-allowed') {
          // User denied microphone permission - this is expected behavior, not an error
          // Only log in development for debugging
          if (process.env.NODE_ENV === 'development') {
            console.warn('Microphone permission denied by user')
          }
          setIsListening(false)
          manuallyStoppedRef.current = true
          setError('Microphone access denied. You can still type your journal entry.')
        } else if (event.error === 'network') {
          // Network error - user is offline
          console.warn('Speech recognition network error - user is offline')
          setIsListening(false)
          manuallyStoppedRef.current = true
          setError('Voice-to-text requires an internet connection. You can still type your journal entry.')
        } else if (event.error === 'service-not-allowed') {
          // Service not allowed - might be offline or service unavailable
          console.warn('Speech recognition service not available')
          setIsListening(false)
          manuallyStoppedRef.current = true
          setError('Voice recognition service unavailable. You can still type your journal entry.')
        } else {
          // For other errors, stop and show error
          console.error('Speech recognition error:', event.error)
          setError('Error with voice recognition. Please try again.')
          setIsListening(false)
          manuallyStoppedRef.current = true
        }
      }

      recognition.onend = () => {
        // Only restart if we're supposed to be listening and user didn't manually stop
        if (!manuallyStoppedRef.current && recognitionRef.current) {
          // Small delay before restarting to ensure clean restart
          setTimeout(() => {
            if (!manuallyStoppedRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start()
              } catch (err) {
                // If already started (InvalidStateError), that's fine - it means it's running
                // Don't log this expected error
                if (err.name !== 'InvalidStateError') {
                  console.log('Recognition restart attempt:', err.message)
                }
              }
            }
          }, 100)
        } else {
          setIsListening(false)
        }
      }

      recognitionRef.current = recognition
    }

            // Cleanup
            return () => {
              // Clear any pending timeouts
              if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current)
                updateTimeoutRef.current = null
              }
              
              if (apiCleanupTimeoutRef.current) {
                clearTimeout(apiCleanupTimeoutRef.current)
                apiCleanupTimeoutRef.current = null
              }
              
              if (recognitionRef.current) {
                manuallyStoppedRef.current = true
                recognitionRef.current.stop()
              }
            }
  }, [onChange])

  const handleMicClick = () => {
    // Show textarea when microphone button is clicked
    if (!showTextarea) {
      setShowTextarea(true)
    }

    // Check if offline - voice recognition requires internet
    // Only check after mount to prevent hydration issues
    if (mounted && !isOnline) {
      setError('Voice-to-text requires an internet connection. You can still type your journal entry.')
      return
    }

    if (!recognitionRef.current) {
      setError('Voice recognition not available.')
      return
    }

    if (isListening) {
      // Manually stop recording
      manuallyStoppedRef.current = true
      
      // Clear any pending timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
        updateTimeoutRef.current = null
      }
      
      // Apply any pending text update immediately
      if (pendingTextRef.current !== null) {
        valueRef.current = pendingTextRef.current
        pendingTextRef.current = null
      }
      
      recognitionRef.current.stop()
      setIsListening(false)
      
      // Clear any pending API cleanup timeout
      if (apiCleanupTimeoutRef.current) {
        clearTimeout(apiCleanupTimeoutRef.current)
        apiCleanupTimeoutRef.current = null
      }
      
      // Apply final grammar formatting or AI cleanup
      const processText = async () => {
        let finalText = valueRef.current.trim()
        if (finalText) {
          if (enableAICleanup) {
            // If we have a pending API response, use it (it's likely more up-to-date)
            if (pendingApiResponseRef.current && pendingApiResponseRef.current.length > 0) {
              // Check if the pending response is still relevant
              const currentText = finalText
              if (currentText.length <= pendingApiResponseRef.current.length * 1.2) {
                finalText = pendingApiResponseRef.current
                pendingApiResponseRef.current = null
              } else {
                // Text has changed significantly, send new request
                setIsCleaning(true)
                try {
                  const response = await fetch('/api/cleanup-text', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: finalText }),
                  })
                  
                  if (response.ok) {
                    const data = await response.json()
                    finalText = data.cleanedText || finalText
                  } else {
                    // If API fails, fall back to basic grammar
                    console.warn('AI cleanup failed, using basic grammar')
                    finalText = addGrammar(finalText)
                  }
                } catch (err) {
                  // If API fails, fall back to basic grammar
                  console.error('Error calling AI cleanup:', err)
                  finalText = addGrammar(finalText)
                } finally {
                  setIsCleaning(false)
                }
              }
            } else {
              // No pending response, send new request
              setIsCleaning(true)
              try {
                const response = await fetch('/api/cleanup-text', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ text: finalText }),
                })
                
                if (response.ok) {
                  const data = await response.json()
                  finalText = data.cleanedText || finalText
                } else {
                  // If API fails, fall back to basic grammar
                  console.warn('AI cleanup failed, using basic grammar')
                  finalText = addGrammar(finalText)
                }
              } catch (err) {
                // If API fails, fall back to basic grammar
                console.error('Error calling AI cleanup:', err)
                finalText = addGrammar(finalText)
              } finally {
                setIsCleaning(false)
              }
            }
          } else {
            // Use basic grammar formatting
            finalText = addGrammar(finalText)
          }
          
          onChange(finalText)
          valueRef.current = finalText
          startingValueRef.current = finalText
          lastCleanedTextRef.current = finalText
        }
      }
      
      // Call the async function
      processText()
    } else {
      // Start recording
      if (recognitionRef.current) {
        manuallyStoppedRef.current = false
        // Remember current value as starting point
        startingValueRef.current = valueRef.current
        try {
          recognitionRef.current.start()
        } catch (err) {
          // If it's already started, that's okay - just update the state
          if (err.name === 'InvalidStateError') {
            // Recognition is already running, just update our state to match
            setIsListening(true)
          } else {
            console.error('Error starting recognition:', err)
            setError('Could not start voice recording. Please try again.')
          }
        }
      }
    }
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <label 
        className="block mb-3" 
        style={{ 
          fontSize: '20px', 
          fontWeight: 300, 
          letterSpacing: '1px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f4a261 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
        }}
      >
        {label}
      </label>
      {!showTextarea ? (
        <button
          onClick={handleMicClick}
          disabled={mounted ? !isOnline : false}
          className="w-full px-6 py-4 rounded-lg transition duration-200 text-white relative flex items-center justify-center gap-3"
          style={{
            background: (mounted && !isOnline)
              ? 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)'
              : 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
            boxShadow: (mounted && !isOnline)
              ? 'none'
              : '0 4px 12px rgba(244, 162, 97, 0.3)',
            border: 'none',
            cursor: (mounted && !isOnline) ? 'not-allowed' : 'pointer',
            opacity: (mounted && !isOnline) ? 0.6 : 1
          }}
          type="button"
          title={(mounted && !isOnline) ? 'Voice-to-text requires an internet connection' : 'Start voice recording'}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
            />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: 500 }}>Start Recording</span>
        </button>
      ) : (
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value)
              // Auto-resize on input
              e.target.style.height = 'auto'
              e.target.style.height = `${e.target.scrollHeight}px`
            }}
            spellCheck={true}
            className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent min-h-[100px] overflow-hidden resize-none"
            style={{ 
              borderColor: 'rgba(255, 255, 255, 0.1)', 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff', 
              fontSize: '16px', 
              lineHeight: '1.6', 
              fontWeight: 400,
              maxHeight: '600px',
              letterSpacing: '0.3px'
            }}
            placeholder={placeholder}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#f4a261'
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(244, 162, 97, 0.2)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          <button
            onClick={handleMicClick}
            disabled={(mounted && !isOnline) && !isListening}
            className="px-4 py-2 rounded-lg transition duration-200 text-white relative"
            style={{
              background: isListening 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #e63946 100%)'
                : (mounted && !isOnline)
                ? 'linear-gradient(135deg, #7a7a7a 0%, #5a5a5a 100%)'
                : 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
              boxShadow: isListening 
                ? '0 0 20px rgba(230, 57, 70, 0.4), 0 0 40px rgba(230, 57, 70, 0.2)'
                : (mounted && !isOnline)
                ? 'none'
                : '0 4px 12px rgba(244, 162, 97, 0.3)',
              animation: isListening ? 'pulse-recording 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
              border: 'none',
              cursor: ((mounted && !isOnline) && !isListening) ? 'not-allowed' : 'pointer',
              opacity: ((mounted && !isOnline) && !isListening) ? 0.6 : 1
            }}
            type="button"
            title={(mounted && !isOnline) && !isListening
              ? 'Voice-to-text requires an internet connection' 
              : isListening 
              ? 'Stop recording' 
              : 'Start voice recording'}
          >
            {isListening ? (
              <>
                <svg 
                  className="w-5 h-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
                <span style={{ fontSize: '16px', fontWeight: 500 }}>Stop Recording</span>
              </>
            ) : (
              <>
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                  />
                </svg>
                <span style={{ fontSize: '16px', fontWeight: 500 }}>Start Recording</span>
              </>
            )}
          </button>
        </div>
      )}
      {error && (
        <p className="mt-2" style={{ color: '#e63946', fontSize: '14px', fontWeight: 400 }}>{error}</p>
      )}
      {isListening && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="rounded-full"
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#e63946',
                  animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
              <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>Recording</p>
            </div>
          </div>
          <p className="mt-3 text-center" style={{ color: '#a8a8b3', fontSize: '12px', fontWeight: 400 }}>You'll see text appear as you speak. Click stop when done.</p>
        </div>
      )}
      {isCleaning && (
        <p className="mt-2 flex items-center gap-2" style={{ color: '#f4a261', fontSize: '14px', fontWeight: 400 }}>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cleaning up...
        </p>
      )}
    </div>
  )
}
