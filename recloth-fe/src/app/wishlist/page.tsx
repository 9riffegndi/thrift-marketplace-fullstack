'use client'

import { useWishlist } from '@/hooks/useWishlist'
import { useAuthStore } from '@/lib/store/authStore'
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'

export default function WishlistPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) redirect('/login')

  const { items, isLoading, isError, refetch } = useWishlist()

  if (isError) return <div className="max-w-7xl mx-auto py-20 px-4"><ErrorState onRetry={() => refetch()} /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <h1 className="text-3xl font-black lowercase tracking-tighter mb-10">wishlist <span className="text-primary">saya</span></h1>

      {isLoading && (
        <div className="grid grid-cols-2 gap-px bg-border border border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      )}

      {!isLoading && !items.length && (
        <EmptyState
          title="Wishlist masih kosong"
          description="Simpan produk favoritmu agar mudah ditemukan"
          actionLabel="Jelajahi Produk"
          onAction={() => router.push('/')}
        />
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid grid-cols-2 gap-px bg-border border border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item: { product: import('@/types').Product }) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  )
}
