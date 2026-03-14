'use client'

import { useProductDetail } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { useWishlist, useIsWishlisted } from '@/hooks/useWishlist'
import { formatRupiah } from '@/lib/utils/format'
import { ConditionBadge } from '@/components/shared/ConditionBadge'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { ErrorState } from '@/components/shared/ErrorState'
import { ShoppingBag, MessageSquare, Heart, Share2, MapPin, Store, ShieldCheck, Tag, ArrowLeft, ChevronRight, Zap } from 'lucide-react'
import { Skeleton } from '@/components/shared/Skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { use, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [activePhoto, setActivePhoto] = useState(0)

  const { data: product, isLoading: isProductLoading, isError, error, refetch } = useProductDetail(slug)
  const { addItem, isAdding } = useCart()
  const { addToWishlist, removeFromWishlist } = useWishlist()
  const { data: isWishlisted } = useIsWishlisted(product?.id || 0)

  const handleAddToCart = async () => {
    if (!product) return
    addItem(product.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Cek produk keren ini di Recloth: ${product?.name}`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link produk disalin ke clipboard')
    }
  }

  const isLoading = isProductLoading

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 md:gap-px bg-border">
        <div className="md:col-span-7 bg-background">
          <Skeleton className="aspect-square" />
        </div>
        <div className="md:col-span-5 bg-background p-6 lg:p-12 space-y-12">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <ErrorState 
          message={!product ? "Produk tidak ditemukan atau sudah dihapus." : "Gagal memuat detail produk."} 
          onRetry={() => refetch()}
        />
        {isError && (
          <p className="text-[10px] text-zinc-400 mt-4 uppercase tracking-widest">
            Detail: {(error as any)?.response?.data?.message || (error as any)?.message || 'Koneksi bermasalah'}
          </p>
        )}
      </div>
    )
  }

  const photos = product.photos || []

  return (
    <div className="max-w-7xl mx-auto pb-32 sm:pb-16 min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 border-b border-border h-12 flex items-center px-4">
        <button onClick={() => router.back()} className="h-8 w-8 flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="flex-1 text-center text-[10px] font-bold uppercase tracking-widest truncate px-4">
          {product.name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-px bg-border pt-12 sm:pt-0">
        {/* Photo Gallery - 60% */}
        <div className="md:col-span-7 bg-background">
          <div className="relative aspect-square">
            <Image
              src={photos[activePhoto]?.photo_url || product.primary_photo || '/placeholder-product.png'}
              alt={product.name || 'Produk Recloth'}
              fill
              className="object-cover"
              priority
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <ConditionBadge condition={product.condition} />
              {product.status === 'sold' && (
                <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-px bg-border border-b border-border no-scrollbar overflow-x-auto">
              {photos.map((p: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={cn(
                    "relative h-24 w-24 bg-background shrink-0 transition-opacity",
                    activePhoto === i ? "opacity-100 ring-2 ring-foreground ring-inset" : "opacity-50 hover:opacity-100"
                  )}
                >
                  <Image 
                    src={p.photo_url} 
                    alt={`${product.name} - Foto ${i + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column - 40% */}
        <div className="md:col-span-5 bg-background p-6 lg:p-12 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 flex items-center gap-2">
                <Tag className="h-3 w-3" /> {product.category?.name}
              </span>
              <div className="flex gap-5 text-zinc-400">
                <button 
                  onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                  className={cn("transition-colors hover:text-black", isWishlisted && "text-red-500 fill-red-500")}
                >
                  <Heart className={cn("h-4.5 w-4.5", isWishlisted && "fill-current")} />
                </button>
                <button className="hover:text-black transition-colors" onClick={handleShare}>
                  <Share2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-[1.1]">
                {product.name}
              </h1>
              <PriceDisplay price={Number(product.price) || 0} className="text-xl font-bold" />
            </div>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-12 py-10 border-y border-border">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 italic">Kondisi</p>
              <p className="text-[11px] font-black uppercase tracking-widest">{CONDITION_LABEL[product.condition as keyof typeof CONDITION_LABEL] || '-'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 italic">Ukuran</p>
              <p className="text-[11px] font-black uppercase tracking-widest">{product.size || 'All Size'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 italic">Estimasi Berat</p>
              <p className="text-[11px] font-black uppercase tracking-widest">{product.weight || 0}g</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 italic">Lokasi Pengiriman</p>
              <p className="text-[11px] font-black uppercase tracking-widest truncate">{product.store?.city || 'Indonesia'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Info Produk</h3>
            <p className="text-[13px] text-zinc-800 leading-relaxed whitespace-pre-line font-medium">
              {product.description || 'Tidak ada deskripsi produk.'}
            </p>
          </div>

          {product.store?.id ? (
            <Link href={`/toko/${product.store.id}`} className="group block py-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                    <Store className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-tight group-hover:underline">{product.store.name}</h4>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-semibold uppercase tracking-wider">
                      Rating {product.store.rating || '4.8'} • {product.store.city || 'Indonesia'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ) : (
            <div className="py-6 border-t border-border opacity-50 grayscale">
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Informasi toko tidak tersedia</p>
            </div>
          )}

          {/* Buy Buttons - Desktop */}
          <div className="hidden sm:grid grid-cols-1 gap-3 pt-4 sticky bottom-8">
            <button
              onClick={() => router.push(`/checkout/${product.id}`)}
              className="group flex h-14 w-full items-center justify-center gap-3 bg-black font-black text-[10px] uppercase tracking-[0.3em] text-white transition-all hover:bg-zinc-800 shadow-none active:scale-[0.98]"
            >
              <Zap className="h-4 w-4 fill-white" /> Beli Sekarang
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button 
                disabled={isAdding || product.status === 'sold'}
                onClick={handleAddToCart}
                className="flex h-14 w-full items-center justify-center gap-2 border-2 border-black bg-white text-black font-black text-[10px] uppercase tracking-[0.25em] transition-all hover:bg-zinc-50 active:scale-[0.98] disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" /> 
                {isAdding ? '...' : 'Keranjang'}
              </button>
              <button 
                onClick={() => router.push(`/chat?with_store=${product.store?.id}`)}
                className="flex h-14 w-full items-center justify-center gap-2 border-2 border-black bg-white text-black font-black text-[10px] uppercase tracking-[0.25em] transition-all hover:bg-zinc-50 active:scale-[0.98]"
              >
                <MessageSquare className="h-4 w-4" /> Chat
              </button>
            </div>
            <button
              onClick={() => router.push(`/swap/ajukan/${product.id}`)}
              className="flex h-14 w-full items-center justify-center gap-2 bg-zinc-100 text-zinc-900 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-[0.98]"
            >
              Ajukan Tukar (Swap)
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions - Mobile Only */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-background border-t border-border p-4 sm:hidden">
        <div className="flex gap-2">
          <button 
            onClick={() => router.push(`/chat?with_store=${product.store?.id}`)}
            className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-black bg-white transition-colors hover:bg-muted"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button
            onClick={() => router.push(`/swap/ajukan/${product.id}`)}
            className="flex-1 h-14 border-2 border-black bg-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center transition-colors"
          >
            Swap
          </button>
          <button
            onClick={() => router.push(`/checkout/${product.id}`)}
            className="flex-1 h-14 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-[0.95]"
          >
            <Zap className="h-4 w-4" /> Beli
          </button>
        </div>
      </div>
    </div>
  )
}

const CONDITION_LABEL = {
  'A': 'Baru/Sangat Baik',
  'B': 'Baik/Satu-dua Lecet',
  'C': 'Cukup/Pernah Pakai',
  'D': 'Ada Minus'
}
