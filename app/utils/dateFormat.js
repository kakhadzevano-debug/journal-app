// Utility function to format date as "Month Day, Year" (e.g., "January 15, 2024")
export function formatDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString + 'T00:00:00') // Add time to avoid timezone issues
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  
  return `${month} ${day}, ${year}`
}



