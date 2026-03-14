'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useInfiniteProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useBanners, useSystemConfig } from '@/hooks/useDiscovery'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/shared/Skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { SlidersHorizontal, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function HomePage() {
  const [category, setCategory] = useState<number | null>(null)
  const [sort, setSort] = useState('latest')

  const { data: categories } = useCategories()
  const { data: banners, isLoading: bannersLoading } = useBanners()
  const { data: configs } = useSystemConfig()
  
  const { 
    data: productsData, 
    isLoading, 
    isError, 
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteProducts({ 
    category_id: category || undefined, 
    sort,
    per_page: 9 // Using 9 for 3-column layout symmetry
  })

  const products = productsData?.pages.flatMap(page => page.data) || []
  const totalProducts = productsData?.pages[0]?.total || 0

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <ErrorState onRetry={() => refetch()} />
      </div>
    )
  }

  const scrollToCatalog = () => {
    document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative h-[480px] md:h-[640px] bg-zinc-100 overflow-hidden">
        {bannersLoading ? (
          <div className="absolute inset-0">
            <Skeleton className="w-full h-full" />
          </div>
        ) : banners && banners.length > 0 ? (
          <>
            <Image
              src={banners[0].image_url}
              alt={banners[0].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl md:text-7xl font-bold text-white uppercase tracking-tighter drop-shadow-md">
                  {banners[0].title}
                </h1>
                <p className="text-sm md:text-lg text-white font-medium uppercase tracking-[0.2em] drop-shadow-md">
                  Koleksi Pre-loved Pilihan Untuk Gayamu
                </p>
                <div className="pt-6">
                  <button 
                    onClick={scrollToCatalog}
                    className="h-12 px-10 bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-100 transition-colors shadow-sm flex items-center justify-center gap-2 mx-auto"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Belanja Sekarang
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white border-b border-zinc-200">
             <div className="text-center space-y-6">
                <h1 className="text-5xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none">Recloth.</h1>
                <p className="text-[10px] text-zinc-400 uppercase tracking-[0.4em] font-black">Curated Second Hand Fashion</p>
                <div className="pt-8">
                  <button 
                    onClick={scrollToCatalog}
                    className="h-14 px-12 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98]"
                  >
                    Lihat Katalog
                  </button>
                </div>
             </div>
          </div>
        )}
      </section>
      {/* Category Pills Section */}
      <section className="sticky top-20 z-30 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
          <button
            onClick={() => {
              setCategory(null)
            }}
            className={cn(
              "whitespace-nowrap px-6 h-9 text-xs font-bold uppercase tracking-widest border transition-colors",
              category === null 
                ? "bg-foreground text-background border-foreground" 
                : "bg-background text-foreground border-border hover:border-foreground"
            )}
          >
            Semua
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id)
              }}
              className={cn(
                "whitespace-nowrap px-8 h-10 text-[10px] font-black uppercase tracking-[0.2em] border transition-all",
                category === cat.id 
                  ? "bg-black text-white border-black" 
                  : "bg-white text-zinc-400 border-zinc-200 hover:border-black hover:text-black"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main id="katalog" className="max-w-7xl mx-auto w-full px-4 py-12 flex-1">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              {category ? categories?.find(c => c.id === category)?.name : 'Semua Katalog'}
            </h2>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1.5 font-bold">
              {totalProducts} Produk Ditemukan
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 border-b border-transparent hover:border-black cursor-pointer transition-all pb-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filter
            </div>
            
            <select 
              value={sort}
              onChange={(e) => {
                setSort(e.target.value)
              }}
              className="bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.2em] outline-none cursor-pointer text-zinc-500 hover:text-black transition-colors"
            >
              <option value="latest">Terbaru</option>
              <option value="price_low">Harga: Rendah ke Tinggi</option>
              <option value="price_high">Harga: Tinggi ke Rendah</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} isLoading={isLoading || isFetchingNextPage} />

        {/* Load More */}
        {hasNextPage && (
          <div className="flex justify-center pt-16">
            <button 
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="h-14 px-16 bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Memuat...' : 'Muat Lebih Banyak'}
            </button>
          </div>
        )}
      </main>

    </div>
  )
}
