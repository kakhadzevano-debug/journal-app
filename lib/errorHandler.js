// Error handling utility for user-friendly error messages

/**
 * Converts technical errors into user-friendly messages
 * @param {Error} error - The error object
 * @param {string} context - Context where error occurred (e.g., 'save', 'load', 'delete')
 * @returns {Object} - { message: string, canRetry: boolean, technical: string }
 */
export function handleError(error, context = 'operation') {
  // Log technical error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, {
      error,
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      name: error?.name
    })
  }

  const technicalError = error?.message || 'Unknown error'
  let userMessage = 'Something went wrong. Please try again.'
  let canRetry = true

  // Network errors
  if (
    error?.message?.includes('network') ||
    error?.message?.includes('fetch') ||
    error?.message?.includes('timeout') ||
    error?.code === 'ECONNREFUSED' ||
    error?.code === 'ETIMEDOUT'
  ) {
    userMessage = 'No internet connection. Please check your connection and try again.'
    canRetry = true
  }

  // Database connection errors
  else if (
    error?.message?.includes('connection') ||
    error?.message?.includes('database') ||
    error?.code === 'PGRST301' ||
    error?.code === 'PGRST302'
  ) {
    userMessage = 'Couldn\'t connect to the database. Please try again in a moment.'
    canRetry = true
  }

  // Authentication errors
  else if (
    error?.message?.includes('auth') ||
    error?.message?.includes('session') ||
    error?.message?.includes('token') ||
    error?.message?.includes('User not authenticated') ||
    error?.code === 'PGRST301'
  ) {
    userMessage = 'Your session has expired. Please sign in again.'
    canRetry = false
  }

  // Permission errors (RLS)
  else if (
    error?.code === '42501' ||
    error?.message?.includes('permission') ||
    error?.message?.includes('policy') ||
    error?.message?.includes('Row Level Security')
  ) {
    userMessage = 'You don\'t have permission to perform this action.'
    canRetry = false
  }

  // Not found errors
  else if (
    error?.code === 'PGRST116' ||
    error?.message?.includes('not found') ||
    error?.message?.includes('does not exist')
  ) {
    userMessage = context === 'load' 
      ? 'No entries found.' 
      : 'The item you\'re looking for doesn\'t exist.'
    canRetry = false
  }

  // Validation errors
  else if (
    error?.code === '23505' || // Unique violation
    error?.message?.includes('duplicate') ||
    error?.message?.includes('already exists')
  ) {
    userMessage = 'This entry already exists.'
    canRetry = false
  }

  // Rate limiting
  else if (
    error?.code === 'PGRST301' ||
    error?.message?.includes('rate limit') ||
    error?.message?.includes('too many requests')
  ) {
    userMessage = 'Too many requests. Please wait a moment and try again.'
    canRetry = true
  }

  // Context-specific messages
  else {
    switch (context) {
      case 'save':
        userMessage = 'Couldn\'t save your journal entry. Please try again.'
        break
      case 'load':
        userMessage = 'Couldn\'t load your journal entries. Please try again.'
        break
      case 'delete':
        userMessage = 'Couldn\'t delete the entry. Please try again.'
        break
      case 'signin':
        userMessage = 'Login failed. Please check your email and password.'
        break
      case 'signup':
        userMessage = 'Couldn\'t create your account. Please try again.'
        break
      case 'microphone':
        userMessage = 'Microphone access denied. You can still type your journal entry.'
        canRetry = false
        break
      default:
        userMessage = 'Something went wrong. Please try again.'
    }
  }

  return {
    message: userMessage,
    canRetry,
    technical: technicalError
  }
}

/**
 * Checks if device is online
 * @returns {boolean}
 */
export function isOnline() {
  if (typeof window === 'undefined') return true
  return navigator.onLine
}

/**
 * Waits for network to come back online
 * @returns {Promise<void>}
 */
export function waitForOnline() {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve()
      return
    }

    const handleOnline = () => {
      window.removeEventListener('online', handleOnline)
      resolve()
    }

    window.addEventListener('online', handleOnline)
  })
}


