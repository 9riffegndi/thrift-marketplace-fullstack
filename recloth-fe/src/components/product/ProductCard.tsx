'use client'

import { Product } from '@/types'
import { useWishlist, useIsWishlisted } from '@/hooks/useWishlist'
import { Heart, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist } = useWishlist()
  const { data: isInWishlist } = useIsWishlisted(product.id)
  const [imgError, setImgError] = useState(false)

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  const primaryPhoto = product.photos?.find(p => p.is_primary)?.photo_url || product.primary_photo || '/placeholder-product.png'

  return (
    <div className={cn("group relative flex flex-col bg-background transition-colors", className)}>
      <Link href={`/produk/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
          <Image
            src={imgError ? '/placeholder-product.png' : primaryPhoto}
            alt={product.name || 'Produk Recloth'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          
          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.status === 'sold' && (
              <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-widest shadow-sm">
                Terjual
              </span>
            )}
            <ConditionBadge condition={product.condition} className="shadow-sm" />
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              "absolute top-3 right-3 h-10 w-10 flex items-center justify-center bg-white rounded-none opacity-0 group-hover:opacity-100 transition-all z-10",
              isInWishlist ? "text-primary opacity-100" : "text-zinc-400 hover:text-black"
            )}
            aria-label="Add to wishlist"
          >
            <Heart className={cn("h-5 w-5", isInWishlist && "fill-current")} />
          </button>
        </div>

        {/* Info Container */}
        <div className="pt-4 pb-2 flex flex-col flex-1 min-h-[90px]">
          <h3 className="text-[11px] font-black uppercase tracking-[0.1em] text-black h-9 leading-[1.3] group-hover:underline underline-offset-4 decoration-border">
            {product.name}
          </h3>
          
          <div className="mt-1 flex items-baseline gap-2">
            <PriceDisplay price={product.price} className="text-sm font-black text-black" />
          </div>
          
          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-zinc-500 uppercase tracking-widest font-black">
            <span className="truncate">{product.store?.name}</span>
            <span className="text-zinc-300">•</span>
            <span className="truncate">{product.store?.city || 'INDONESIA'}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[3/4] bg-zinc-100" />
      <div className="pt-4 space-y-3">
        <div className="h-3 bg-zinc-100 w-3/4" />
        <div className="h-4 bg-zinc-100 w-1/2" />
        <div className="h-2 bg-zinc-100 w-2/3 mt-2" />
      </div>
    </div>
  )
}
