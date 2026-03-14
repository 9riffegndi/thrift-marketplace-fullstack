'use client'

import { Product } from '@/types'
import { ProductCard, ProductCardSkeleton } from './ProductCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { ShoppingBag } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {[...Array(6)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Tidak ada produk"
        description="Maaf, kami tidak menemukan produk yang kamu cari saat ini."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {isLoading && [...Array(3)].map((_, i) => (
        <ProductCardSkeleton key={`loading-${i}`} />
      ))}
    </div>
  )
}
