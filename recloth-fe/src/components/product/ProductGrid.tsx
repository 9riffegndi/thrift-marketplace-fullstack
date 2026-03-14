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
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-border border border-border">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-background">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Tidak ada produk"
        description="Maaf, kami tidak menemukan produk yang kamu cari saat ini."
      />
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-px bg-border border border-border">
      {products.map((product) => (
        <div key={product.id} className="bg-background">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
