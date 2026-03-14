'use client'

import { useSwaps, useRespondSwap, useConfirmSwap, useSwapResi } from '@/hooks/useSwap'
import { useAuthStore } from '@/lib/store/authStore'
import { redirect } from 'next/navigation'
import { formatRupiah, formatDate, SWAP_STATUS_LABEL } from '@/lib/utils/format'
import { Skeleton } from '@/components/shared/Skeleton'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { 
  ArrowRightLeft, 
  ChevronRight, 
  Inbox, 
  Package, 
  CheckCircle2, 
  XCircle,
  Clock,
  Truck
} from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function SwapPage() {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) redirect('/login')

  const { data: swaps, isLoading, isError, refetch } = useSwaps()
  const { mutate: respondSwap, isPending: isResponding } = useRespondSwap()
  const { mutate: confirmSwap, isPending: isConfirming } = useConfirmSwap()
  const { mutate: inputResi, isPending: isSavingResi } = useSwapResi()

  const [resiModal, setResiModal] = useState<{ id: number; side: 'buyer' | 'seller' } | null>(null)
  const [resi, setResi] = useState('')

  const handleSaveResi = () => {
    if (!resiModal || !resi) return
    inputResi({ id: resiModal.id, resi, side: resiModal.side }, {
      onSuccess: () => {
        setResiModal(null)
        setResi('')
      }
    })
  }

  if (isError) return <div className="max-w-4xl mx-auto py-20 px-4"><ErrorState onRetry={() => refetch()} /></div>

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-black lowercase tracking-tighter">permintaan <span className="text-primary">swap</span></h1>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Tukarkan barangmu dengan koleksi pre-loved lainnya.</p>
      </div>

      {!swaps || (swaps as any)?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border bg-zinc-50/50">
          <div className="w-20 h-20 rounded-none bg-zinc-100 flex items-center justify-center mx-auto mb-6">
            <ArrowRightLeft className="h-8 w-8 text-zinc-300" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2">Belum ada permintaan swap</p>
          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest">Permintaan barter barang akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-6">
          {swaps?.data.map((swap: any) => {
            const isRequester = swap.requester_product.store_id === user?.store?.id
            const myResi = isRequester ? swap.buyer_resi : swap.seller_resi
            const side = isRequester ? 'buyer' : 'seller'

            return (
              <div key={swap.id} className="border border-border bg-card overflow-hidden transition-all hover:border-zinc-400">
                <div className="p-4 border-b border-border bg-zinc-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-3 w-3 text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{formatDate(swap.created_at)}</span>
                  </div>
                  <div className={cn(
                    "px-3 py-1 text-[9px] font-black uppercase tracking-widest border rounded-none",
                    swap.status === 'diajukan' ? "bg-amber-50 text-amber-600 border-amber-200" :
                    swap.status === 'diterima' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    swap.status === 'selesai' ? "bg-zinc-900 text-white border-zinc-900" :
                    "bg-zinc-100 text-zinc-400 border-zinc-200"
                  )}>
                    {SWAP_STATUS_LABEL[swap.status] || swap.status}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8">
                  <div className="flex-1 flex gap-4 w-full">
                    <div className="relative h-20 w-16 bg-muted shrink-0 shadow-sm">
                      <Image src={swap.requester_product.primary_photo || '/placeholder-product.png'} alt="My Item" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Barang Requester</p>
                      <h3 className="text-xs font-bold uppercase tracking-tight truncate">{swap.requester_product.name}</h3>
                      <PriceDisplay price={swap.requester_product.price} className="text-[10px] mt-1 font-bold" />
                    </div>
                  </div>

                  <div className="bg-zinc-100 p-2 rounded-none">
                    <ArrowRightLeft className="h-4 w-4 text-zinc-400" />
                  </div>

                  <div className="flex-1 flex gap-4 w-full text-right sm:flex-row-reverse">
                    <div className="relative h-20 w-16 bg-muted shrink-0 shadow-sm">
                      <Image src={swap.target_product.primary_photo || '/placeholder-product.png'} alt="Target Item" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Barang Target</p>
                      <h3 className="text-xs font-bold uppercase tracking-tight truncate">{swap.target_product.name}</h3>
                      <PriceDisplay price={swap.target_product.price} className="text-[10px] mt-1 font-bold" />
                    </div>
                  </div>
                </div>

                {swap.status === 'diajukan' && !isRequester && (
                  <div className="p-4 bg-zinc-50 border-t border-border flex gap-4">
                    <button
                      disabled={isResponding}
                      onClick={() => respondSwap({ id: swap.id, status: 'diterima' })}
                      className="flex-1 h-12 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 rounded-none"
                    >
                      {isResponding ? <LoadingSpinner size="sm" /> : <CheckCircle2 className="h-4 w-4" />} Terima Swap
                    </button>
                    <button
                      disabled={isResponding}
                      onClick={() => respondSwap({ id: swap.id, status: 'ditolak' })}
                      className="flex-1 h-12 bg-zinc-200 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-300 transition-all flex items-center justify-center gap-2 rounded-none"
                    >
                      <XCircle className="h-4 w-4" /> Tolak
                    </button>
                  </div>
                )}

                {swap.status === 'diterima' && (
                  <div className="p-4 bg-emerald-50 border-t border-emerald-100 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                           <Truck className="h-4 w-4 text-emerald-600" />
                           <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">
                                {myResi ? `Resi Saya: ${myResi}` : 'Harap segera kirim barang & input resi'}
                           </p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            {!myResi && (
                                <button
                                    onClick={() => setResiModal({ id: swap.id, side })}
                                    className="flex-1 sm:flex-none px-6 h-10 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-700 transition-colors"
                                >
                                    Input Resi
                                </button>
                            )}
                            <button
                                disabled={isConfirming}
                                onClick={() => confirmSwap(swap.id)}
                                className="flex-1 sm:flex-none px-6 h-10 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors flex items-center justify-center gap-2"
                            >
                                {isConfirming && <LoadingSpinner size="sm" />}
                                Konfirmasi Selesai
                            </button>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Resi Modal */}
      {resiModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-none p-8 space-y-8 shadow-2xl">
                <div className="space-y-1">
                    <h2 className="text-xl font-black lowercase tracking-tighter">input <span className="text-primary">resi swap</span></h2>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Masukkan resi pengiriman barang barter</p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest">Nomor Resi</label>
                    <input 
                        value={resi}
                        onChange={(e) => setResi(e.target.value)}
                        placeholder="MISAL: JNAP-12345678"
                        className="w-full h-12 bg-transparent border-b border-black outline-none text-xs font-bold uppercase"
                    />
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setResiModal(null)}
                        className="flex-1 h-12 border border-black text-[10px] font-black uppercase tracking-widest"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleSaveResi}
                        disabled={!resi || isSavingResi}
                        className="flex-1 h-12 bg-black text-white text-[10px] font-black uppercase tracking-widest disabled:bg-zinc-200 flex items-center justify-center gap-2"
                    >
                        {isSavingResi ? <LoadingSpinner size="sm" /> : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
