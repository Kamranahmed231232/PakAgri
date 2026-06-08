'use client'

import { Wheat } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

export default function LoadingSpinner({ size = 'md', text, fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }

  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full border-4 border-pakagri-cream-dark animate-spin`}
          style={{ borderTopColor: '#c9a227' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Wheat className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-5 h-5' : 'w-8 h-8'} text-pakagri-primary`} />
        </div>
      </div>
      {text && <p className="text-pakagri-earth animate-pulse">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-pakagri-cream/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return content
}
