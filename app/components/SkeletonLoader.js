'use client'

export default function SkeletonLoader({ className = '', variant = 'card', count = 1 }) {
  const variants = {
    card: (
      <div 
        className={`rounded-2xl animate-pulse ${className}`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="p-6 space-y-4">
          <div 
            className="h-4 rounded w-1/4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <div 
            className="h-3 rounded w-3/4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <div 
            className="h-3 rounded w-1/2"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
        </div>
      </div>
    ),
    text: (
      <div 
        className={`h-4 rounded animate-pulse ${className}`}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      />
    ),
    streak: (
      <div 
        className={`rounded-2xl animate-pulse ${className}`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '24px',
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="h-16 w-16 rounded-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <div className="flex-1 space-y-2">
            <div 
              className="h-8 rounded w-1/3"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
            <div 
              className="h-4 rounded w-1/2"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            />
          </div>
        </div>
      </div>
    ),
    journalCard: (
      <div 
        className={`rounded-xl animate-pulse ${className}`}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
        }}
      >
        <div className="space-y-3">
          <div 
            className="h-5 rounded w-1/4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <div 
            className="h-4 rounded w-1/3"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <div 
            className="h-3 rounded w-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <div 
            className="h-3 rounded w-3/4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
        </div>
      </div>
    ),
  }

  const skeleton = variants[variant] || variants.card

  if (count > 1) {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{skeleton}</div>
        ))}
      </div>
    )
  }

  return skeleton
}

