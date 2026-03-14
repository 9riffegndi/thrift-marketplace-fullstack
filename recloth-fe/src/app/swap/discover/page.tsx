'use client'

import { useProducts } from '@/hooks/useProducts'
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { ArrowRightLeft, Filter, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'

export default function SwapDiscoverPage() {
  const [search, setSearch] = useState('')
  const { data: productsResult, isLoading, isError, error, refetch } = useProducts({ 
    q: search,
    // Note: Assuming there's a way to filter products that are "swap-ready" 
    // Usually sellers tag their products. For now we show all active products 
    // with a "Swap Catalog" branding.
  })

  const products = productsResult?.data || []

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32">
      {/* Hero Section */}
      <div className="relative bg-zinc-900 overflow-hidden mb-12 group">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="relative p-12 sm:p-20 flex flex-col items-center text-center space-y-6">
          <div className="h-16 w-16 bg-white flex items-center justify-center mb-2 shadow-2xl transition-transform group-hover:scale-110 duration-500">
            <ArrowRightLeft className="h-8 w-8 text-black" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black lowercase tracking-tighter text-white">
              katalog <span className="text-zinc-400">swap</span>
            </h1>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 max-w-md mx-auto leading-relaxed">
              Tukarkan koleksimu dengan barang impian tanpa biaya tambahan.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-black transition-colors" />
          <input 
            type="text"
            placeholder="CARI BARANG SWAP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-zinc-50 border border-border outline-none focus:border-black text-[10px] font-bold uppercase tracking-widest transition-all"
          />
        </div>
        <button className="h-14 px-8 border border-border flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-px bg-border border border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState message={(error as any)?.message || 'Gagal memuat katalog swap'} />
      ) : products.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-border bg-zinc-50/50">
           <Sparkles className="h-10 w-10 text-zinc-200 mx-auto mb-4" />
           <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tidak ada barang swap ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-border border border-border sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
