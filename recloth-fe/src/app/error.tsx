'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
      <div className="w-16 h-16 bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black lowercase tracking-tighter">Oops! ada masalah.</h2>
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest max-w-xs mx-auto">
          Terjadi kesalahan sistem saat memproses halaman ini.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="h-12 px-8 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Coba Lagi
      </button>
    </div>
  )
}
