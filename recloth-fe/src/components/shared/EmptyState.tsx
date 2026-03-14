'use client'

import { PackageOpen, LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center bg-white border border-zinc-200">
      <div className="mb-8 flex items-center justify-center h-20 w-20 bg-zinc-100 border border-zinc-200">
        <Icon className="h-10 w-10 text-zinc-400" />
      </div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-black">{title}</h3>
      {description && (
        <p className="mt-4 max-w-[300px] text-[10px] leading-relaxed text-zinc-500 font-bold uppercase tracking-widest">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="mt-10 h-14 px-12 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-zinc-800 active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
