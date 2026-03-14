'use client'

import { useQuery } from '@tanstack/react-query'
import { storesApi, productsApi } from '@/lib/api'
import { ProductGrid } from '@/components/product/ProductGrid'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { Store, MapPin, ShoppingBag, Users, Star, ArrowLeft } from 'lucide-react'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ReportModal } from '@/components/shared/ReportModal'
import { Skeleton } from '@/components/shared/Skeleton'

export default function StorePublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [perPage, setPerPage] = useState(12)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const { data: store, isLoading: isStoreLoading, isError: isStoreError } = useQuery({
    queryKey: ['store', slug],
    queryFn: () => storesApi.get(slug).then(r => r.data.data),
  })

  const { data: productsResult, isLoading: isProductsLoading } = useQuery({
    queryKey: ['store-products', store?.id, perPage],
    queryFn: () => productsApi.list({ store_id: store?.id, per_page: perPage }).then(r => r.data.data),
    enabled: !!store?.id,
  })

  if (isStoreLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <section className="bg-muted/30 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center space-y-8">
            <Skeleton className="h-32 w-32" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="flex gap-8">
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
              <Skeleton className="h-12 w-20" />
            </div>
          </div>
        </section>
        <main className="max-w-7xl mx-auto px-4 py-16">
          <Skeleton className="h-10 w-48 mb-12" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="aspect-[3/4]" />)}
          </div>
        </main>
      </div>
    )
  }

  if (isStoreError || !store) return <div className="min-h-screen flex items-center justify-center"><ErrorState message="Toko tidak ditemukan." /></div>

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Store Header Section */}
      <section className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center space-y-8">
          <button 
            onClick={() => router.back()}
            className="self-start text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </button>

          <div className="relative group">
            <div className="h-24 w-24 md:h-32 md:w-32 bg-background border border-border overflow-hidden flex items-center justify-center">
              {store.photo ? (
                <Image src={store.photo} alt={store.name} fill className="object-cover" />
              ) : (
                <Store className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
          </div>

          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter">{store.name}</h1>
            <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] italic">
              {store.city}, {store.province}
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
              {store.description || 'Selamat datang di toko kami. Kami menyediakan koleksi pre-loved terbaik dengan kualitas terjamin.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 md:gap-16 pt-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Terjual</p>
              <p className="font-bold text-lg tracking-tight">{store.total_sales}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Rating</p>
              <div className="flex items-center justify-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-black" />
                <p className="font-bold text-lg tracking-tight">{(Number(store.rating) || 0).toFixed(1)}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Followers</p>
              <p className="font-bold text-lg tracking-tight">{store.followers_count || 0}</p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
             <button className="h-12 px-10 bg-black text-white font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                Ikuti Toko
             </button>
             <button 
               onClick={() => router.push(`/chat?with=${store.user_id}`)}
               className="h-12 px-10 border border-black bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-50 transition-colors"
             >
                Chat Penjual
             </button>
             <button 
               onClick={() => setIsReportModalOpen(true)}
               className="h-12 px-6 border border-zinc-200 text-zinc-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500 hover:border-red-200 transition-all"
             >
                Laporkan
             </button>
          </div>
        </div>
      </section>

      {store.user_id && (
        <ReportModal 
          reportedUserId={store.user_id} 
          isOpen={isReportModalOpen} 
          onClose={() => setIsReportModalOpen(false)} 
        />
      )}

      {/* Store Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12 border-b border-border pb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" /> Katalog Produk
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">
            Total {productsResult?.total || 0} Produk
          </p>
        </div>

        <ProductGrid products={productsResult?.data || []} isLoading={isProductsLoading && !productsResult} />

        {/* Load More */}
        {productsResult && productsResult.data.length < productsResult.total && (
          <div className="flex justify-center pt-16">
            <button 
              onClick={() => setPerPage(prev => prev + 12)}
              disabled={isProductsLoading}
              className="h-12 px-12 border border-foreground text-foreground font-bold text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
            >
              {isProductsLoading ? 'Memuat...' : 'Muat Lebih Banyak'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
