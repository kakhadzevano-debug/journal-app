'use client'

import LoadingSpinner from './LoadingSpinner'

export default function LoadingButton({
  children,
  loading = false,
  loadingText = 'Loading...',
  disabled = false,
  onClick,
  className = '',
  style = {},
  ...props
}) {
  return (
    <button
      onClick={onClick || undefined}
      disabled={loading || disabled}
      className={className}
      style={{
        ...style,
        opacity: loading || disabled ? 0.7 : 1,
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
      }}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
