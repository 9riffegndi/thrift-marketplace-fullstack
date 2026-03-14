'use client'

import { cn } from '@/lib/utils'
import { ProductCondition } from '@/types'

interface ConditionBadgeProps {
  condition: ProductCondition
  className?: string
}

const CONDITION_MAP = {
  'A': { label: 'A', class: 'bg-black text-white' },
  'B': { label: 'B', class: 'bg-zinc-800 text-white' },
  'C': { label: 'C', class: 'bg-zinc-500 text-white' },
  'D': { label: 'D', class: 'bg-zinc-200 text-zinc-800' },
}

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  const config = CONDITION_MAP[condition] || CONDITION_MAP['A']

  return (
    <span className={cn(
      "inline-flex items-center px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase tracking-widest",
      config.class,
      className
    )}>
      {config.label}
    </span>
  )
}
