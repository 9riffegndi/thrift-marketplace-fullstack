'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProductDetail, useMyProducts } from '@/hooks/useProducts'
import { useRequestSwap } from '@/hooks/useSwap'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { ErrorState } from '@/components/shared/ErrorState'
import { Skeleton } from '@/components/shared/Skeleton'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ArrowRightLeft, ChevronRight, Package, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function SwapAjukanPage({ params }: { params: Promise<{ targetId: string }> }) {
  const { targetId } = use(params)
  const router = useRouter()
  const [selectedMyProductId, setSelectedMyProductId] = useState<number | null>(null)

  const { data: targetProduct, isLoading: isLoadingTarget, isError: isErrorTarget, refetch: refetchTarget } = useProductDetail(targetId)
  const { data: myProductsResult, isLoading: isLoadingMyProducts, isError: isErrorMy, refetch: refetchMy } = useMyProducts({ status: 'active' })
  const { mutate: requestSwap, isPending } = useRequestSwap()

  const myProducts = myProductsResult?.data || []

  const handleSubmit = () => {
    if (!selectedMyProductId) return
    requestSwap({
      target_product_id: Number(targetId),
      requester_product_id: selectedMyProductId
    }, {
      onSuccess: () => router.push('/swap')
    })
  }

  if (isErrorTarget || isErrorMy) return <div className="max-w-2xl mx-auto py-20 px-4"><ErrorState onRetry={() => { refetchTarget(); refetchMy(); }} /></div>

  if (isLoadingTarget || isLoadingMyProducts) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-12">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-32 mx-auto" />
          {[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    )
  }

  if (!targetProduct) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-xl font-bold">Produk tidak ditemukan</h1>
        <button onClick={() => router.back()} className="mt-6 text-sm underline">Kembali</button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-32">
      <div className="space-y-2 mb-10">
        <h1 className="text-3xl font-black lowercase tracking-tighter">ajukan <span className="text-primary">swap</span></h1>
        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Pilih barang kamu untuk ditukarkan</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Target Product (Locked) */}
        <div className="border border-border p-4 bg-zinc-50">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">Barang yang ingin kamu ambil</p>
          <div className="flex gap-4">
            <div className="relative h-20 w-16 bg-muted shrink-0 shadow-sm">
              <Image src={targetProduct.photos?.[0]?.photo_url || targetProduct.primary_photo || '/placeholder-product.png'} alt={targetProduct.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-tight">{targetProduct.name}</h3>
              <PriceDisplay price={targetProduct.price} className="text-[10px] mt-1 font-bold" />
              <p className="text-[9px] text-zinc-500 mt-2 uppercase font-bold">{targetProduct.store?.name}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRightLeft className="h-6 w-6 text-zinc-300" />
        </div>

        {/* My Products Selection */}
        <div className="space-y-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Pilih barang milikmu</p>
          
          {myProducts.length === 0 ? (
            <div className="border border-dashed border-border p-8 text-center bg-zinc-50">
              <Package className="h-8 w-8 text-zinc-300 mx-auto mb-3" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Kamu belum punya produk aktif</p>
              <button 
                onClick={() => router.push('/seller/produk/tambah')}
                className="mt-4 text-[10px] font-bold uppercase tracking-widest underline"
              >
                Upload Produk Sekarang
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {myProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedMyProductId(product.id)}
                  className={cn(
                    "flex items-center gap-4 p-3 border text-left transition-all",
                    selectedMyProductId === product.id 
                      ? "border-black bg-zinc-50 ring-1 ring-black" 
                      : "border-border hover:border-zinc-400"
                  )}
                >
                  <div className="relative h-16 w-12 bg-muted shrink-0">
                    <Image src={product.photos?.[0]?.photo_url || product.primary_photo || '/placeholder-product.png'} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold uppercase tracking-tight truncate">{product.name}</h4>
                    <PriceDisplay price={product.price} className="text-[10px] font-bold" />
                  </div>
                  {selectedMyProductId === product.id && <ChevronRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          disabled={!selectedMyProductId || isPending}
          onClick={handleSubmit}
          className="w-full h-14 bg-black text-white text-[11px] font-black uppercase tracking-[0.25em] disabled:bg-zinc-200 disabled:text-zinc-400 transition-all hover:bg-zinc-800 flex items-center justify-center gap-2"
        >
          {isPending ? <LoadingSpinner size="sm" /> : 'Kirim Permintaan Swap'}
        </button>
      </div>
    </div>
  )
}
