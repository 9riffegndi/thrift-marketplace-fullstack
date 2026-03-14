'use client'

import { formatRupiah } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  className?: string
}

export function PriceDisplay({ price, originalPrice, className }: PriceDisplayProps) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-1.5", className)}>
      <span className="text-sm font-medium text-foreground">
        {formatRupiah(price || 0)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-xs text-muted-foreground line-through">
          {formatRupiah(originalPrice)}
        </span>
      )}
    </div>
  )
}
