'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Search, X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/shared/Skeleton'
import { ErrorState } from '@/components/shared/ErrorState'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const q = searchParams.get('q') || ''
  const cat = searchParams.get('category')
  const cond = searchParams.get('condition')
  const sort = searchParams.get('sort') || 'latest'

  const [inputVal, setInputVal] = useState(q)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputVal !== q) {
        updateParams({ q: inputVal || null })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [inputVal])

  const { data: categories } = useCategories()

  const { data: productsResult, isLoading, isError, refetch } = useProducts({ 
    q: q || undefined, 
    category_id: cat ? Number(cat) : undefined, 
    condition: cond || undefined, 
    sort 
  })

  const updateParams = (newParams: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null) nextParams.delete(key)
      else nextParams.set(key, val)
    })
    router.push(`/cari?${nextParams.toString()}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ q: inputVal || null })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Search Bar - Full Width Minimalist */}
      <section className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center h-16 group">
            <Search className="absolute left-0 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              type="search"
              placeholder="Cari produk, kategori, atau toko..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full h-full pl-8 pr-10 bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted-foreground/60"
            />
            {inputVal && (
              <button 
                type="button"
                onClick={() => { setInputVal(''); updateParams({ q: null }) }}
                className="absolute right-0 h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Filter Horizontal Bar */}
      <section className="bg-muted/30 border-b border-border py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-4 h-9 border border-border bg-background text-[10px] font-bold uppercase tracking-widest shrink-0">
            <SlidersHorizontal className="h-3 w-3" />
            Filter
          </div>

          {/* Category Chips */}
          {categories?.map((c) => (
            <button
              key={c.id}
              onClick={() => updateParams({ category: cat === c.id.toString() ? null : c.id.toString() })}
              className={cn(
                "px-5 h-9 text-[10px] font-bold uppercase tracking-widest border transition-colors shrink-0",
                cat === c.id.toString() ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:border-foreground"
              )}
            >
              {c.name}
            </button>
          ))}

          <div className="w-px h-6 bg-border mx-2" />

          {/* Condition Chips */}
          {['A', 'B', 'C', 'D'].map((c) => (
            <button
              key={c}
              onClick={() => updateParams({ condition: cond === c ? null : c })}
              className={cn(
                "px-5 h-9 text-[10px] font-bold uppercase tracking-widest border transition-colors shrink-0",
                cond === c ? "bg-foreground text-background border-foreground" : "bg-background text-foreground border-border hover:border-foreground"
              )}
            >
              Kondisi {c}
            </button>
          ))}
        </div>
      </section>

      {/* Main Results Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              {q ? `Hasil untuk "${q}"` : 'Jelajahi Produk'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 group relative">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1 hidden sm:block italic">Urut:</span>
            <select
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
              className="bg-transparent text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-primary transition-colors appearance-none pr-5"
            >
              <option value="latest">Terbaru</option>
              <option value="price_low">Harga Terendah</option>
              <option value="price_high">Harga Tertinggi</option>
            </select>
            <ChevronDown className="h-3 w-3 absolute right-0 pointer-events-none text-muted-foreground" />
          </div>
        </div>

        {isError && <div className="mb-8"><ErrorState onRetry={() => refetch()} /></div>}
        <ProductGrid products={productsResult?.data || []} isLoading={isLoading} />
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-16 w-full mb-8" />
        <Skeleton className="h-12 w-full mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="aspect-[3/4]" />)}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
