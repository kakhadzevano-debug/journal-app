// Notification utility for daily journal reminders

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported() {
  if (typeof window === 'undefined') return false
  return 'Notification' in window && 'serviceWorker' in navigator
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission() {
  if (!isNotificationSupported()) {
    return 'unsupported'
  }
  return Notification.permission
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    throw new Error('Notifications are not supported in this browser')
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    throw new Error('Notification permission was previously denied. Please enable it in your browser settings.')
  }

  const permission = await Notification.requestPermission()
  
  if (permission !== 'granted') {
    throw new Error('Notification permission was denied')
  }

  return permission
}

/**
 * Schedule a daily notification
 * @param {Object} options - Notification options
 * @param {number} options.hour - Hour of day (0-23)
 * @param {number} options.minute - Minute of hour (0-59)
 * @param {string} options.title - Notification title
 * @param {string} options.body - Notification body text
 * @param {string} options.icon - Icon URL (optional)
 */
export function scheduleDailyNotification({ hour, minute, title, body, icon }) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Cannot schedule notification: supported=', isNotificationSupported(), 'permission=', Notification.permission)
    }
    return null
  }

  // Calculate time until next notification
  const now = new Date()
  const notificationTime = new Date()
  notificationTime.setHours(hour, minute, 0, 0)

  // If the time has passed today, schedule for tomorrow
  if (notificationTime <= now) {
    notificationTime.setDate(notificationTime.getDate() + 1)
  }

  const timeUntilNotification = notificationTime.getTime() - now.getTime()

  // Log scheduling info in development
  if (process.env.NODE_ENV === 'development') {
    const hoursUntil = Math.floor(timeUntilNotification / (1000 * 60 * 60))
    const minutesUntil = Math.floor((timeUntilNotification % (1000 * 60 * 60)) / (1000 * 60))
    console.log(`📅 Notification scheduled for ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} (in ${hoursUntil}h ${minutesUntil}m)`)
  }

  // Schedule the notification
  const timeoutId = setTimeout(() => {
    // Show notification (always show - user expects it at the set time)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔔 Showing scheduled notification')
    }
    showNotification(title, body, icon)
    
    // Schedule the next day's notification (recursive)
    // Use setInterval for more reliable daily scheduling
    const dailyInterval = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    const intervalId = setInterval(() => {
      // Show notification daily (always show)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔔 Showing daily notification')
      }
      showNotification(title, body, icon)
    }, dailyInterval)

    // Store interval ID
    if (typeof window !== 'undefined') {
      if (!window.notificationIntervals) {
        window.notificationIntervals = []
      }
      window.notificationIntervals.push(intervalId)
    }
  }, timeUntilNotification)

  // Store timeout ID for clearing later
  if (typeof window !== 'undefined') {
    if (!window.notificationTimeouts) {
      window.notificationTimeouts = []
    }
    window.notificationTimeouts.push(timeoutId)
  }

  return timeoutId
}

/**
 * Show a notification immediately
 */
export function showNotification(title, body, icon = null) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Cannot show notification: supported=', isNotificationSupported(), 'permission=', Notification.permission)
    }
    return null
  }

  try {
    const options = {
      body,
      icon: icon || '/icon-192x192.png', // Default icon, you can add this later
      badge: '/icon-192x192.png',
      tag: 'journal-reminder',
      requireInteraction: false,
      silent: false
    }

    const notification = new Notification(title, options)

    // Handle notification click - open the app
    notification.onclick = () => {
      window.focus()
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/journal'
      }
      notification.close()
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Notification shown:', title)
    }

    return notification
  } catch (error) {
    console.error('Error showing notification:', error)
    return null
  }
}

/**
 * Clear all scheduled notifications
 */
export function clearAllNotifications() {
  if (typeof window !== 'undefined') {
    if (window.notificationTimeouts) {
      window.notificationTimeouts.forEach(timeoutId => {
        clearTimeout(timeoutId)
      })
      window.notificationTimeouts = []
    }
    if (window.notificationIntervals) {
      window.notificationIntervals.forEach(intervalId => {
        clearInterval(intervalId)
      })
      window.notificationIntervals = []
    }
  }
}

/**
 * Check if user has journaled today
 * This is used to determine if we should send a reminder
 */
export async function hasJournaledToday() {
  try {
    const { getJournalEntryByDate } = await import('@/app/utils/storage')
    const today = new Date().toISOString().split('T')[0]
    const entry = await getJournalEntryByDate(today)
    return !!entry
  } catch (error) {
    // If there's an error, assume they haven't journaled (safer to send reminder)
    return false
  }
}

/**
 * Get user-friendly notification permission message
 */
export function getPermissionMessage(permission) {
  switch (permission) {
    case 'granted':
      return 'Notifications are enabled'
    case 'denied':
      return 'Notifications are blocked. Please enable them in your browser settings.'
    case 'default':
      return 'Click to enable daily journal reminders'
    case 'unsupported':
      return 'Notifications are not supported in this browser'
    default:
      return 'Unknown permission status'
  }
}

