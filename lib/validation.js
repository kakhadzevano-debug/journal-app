// Data validation utilities

const MAX_TEXT_LENGTH = 10000
const MIN_RATING = 1
const MAX_RATING = 10

/**
 * Validate journal entry data
 * @param {Object} entry - Journal entry object
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateJournalEntry(entry) {
  const errors = []

  // Validate rating
  if (entry.rating !== null && entry.rating !== undefined) {
    const rating = typeof entry.rating === 'string' ? parseFloat(entry.rating) : entry.rating
    if (isNaN(rating) || rating < MIN_RATING || rating > MAX_RATING) {
      errors.push(`Rating must be between ${MIN_RATING} and ${MAX_RATING}`)
    }
  }

  // Validate date
  if (!entry.date) {
    errors.push('Date is required')
  } else {
    const date = new Date(entry.date)
    if (isNaN(date.getTime())) {
      errors.push('Invalid date selected')
    }
    // Allow dates from 1900 to 2100 (reasonable range)
    const minDate = new Date('1900-01-01')
    const maxDate = new Date('2100-12-31')
    if (date < minDate || date > maxDate) {
      errors.push('Date must be between 1900 and 2100')
    }
  }

  // Validate text fields length
  const textFields = [
    { name: 'liked', value: entry.liked },
    { name: 'didntLike', value: entry.didntLike },
    { name: 'otherThoughts', value: entry.otherThoughts },
    { name: 'tomorrowPlans', value: entry.tomorrowPlans }
  ]

  textFields.forEach(field => {
    if (field.value && typeof field.value === 'string' && field.value.length > MAX_TEXT_LENGTH) {
      errors.push(`${field.name} is too long (max ${MAX_TEXT_LENGTH.toLocaleString()} characters)`)
    }
  })

  // Check if at least one field has content (optional - you might want to require some content)
  const hasContent = textFields.some(field => field.value && field.value.trim().length > 0) || entry.rating !== null
  if (!hasContent) {
    errors.push('Please fill in at least one field')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize text input
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  // Trim whitespace
  let sanitized = text.trim()
  
  // Remove null bytes and other control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
  
  // Limit length
  if (sanitized.length > MAX_TEXT_LENGTH) {
    sanitized = sanitized.substring(0, MAX_TEXT_LENGTH)
  }
  
  return sanitized
}

/**
 * Validate and sanitize rating
 * @param {number|string} rating - Rating value
 * @returns {number|null} - Validated rating or null
 */
export function validateRating(rating) {
  if (rating === null || rating === undefined || rating === '') {
    return null
  }
  
  const numRating = typeof rating === 'string' ? parseFloat(rating) : rating
  
  if (isNaN(numRating)) {
    return null
  }
  
  // Clamp to valid range
  if (numRating < MIN_RATING) {
    return MIN_RATING
  }
  if (numRating > MAX_RATING) {
    return MAX_RATING
  }
  
  return Math.round(numRating * 10) / 10 // Round to 1 decimal place
}

/**
 * Validate date string
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid date
 */
export function validateDate(dateString) {
  if (!dateString) {
    return false
  }
  
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

export { MAX_TEXT_LENGTH, MIN_RATING, MAX_RATING }

