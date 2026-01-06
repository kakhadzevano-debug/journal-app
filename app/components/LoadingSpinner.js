'use client'

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        animate-spin
        ${className}
      `}
      style={{
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderTopColor: '#f4a261'
      }}
    />
  )
}

