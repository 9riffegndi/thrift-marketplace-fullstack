'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Terdapat kendala sistem', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-6 flex items-center justify-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h3 className="text-sm font-medium text-foreground">Kendala Koneksi</h3>
      <p className="mt-2 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
        {message}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-8 h-10 px-8 border border-border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors hover:bg-muted"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Coba Lagi
        </button>
      )}
    </div>
  )
}
