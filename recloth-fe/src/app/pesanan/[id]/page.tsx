'use client'

import { useOrderDetail, useConfirmOrder } from '@/hooks/useOrders'
import { formatRupiah, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, formatDate } from '@/lib/utils/format'
import { Package, Truck, CreditCard, ChevronLeft, MapPin, ExternalLink, ShieldCheck, Star, Store, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ReportModal } from '@/components/shared/ReportModal'
import { Skeleton } from '@/components/shared/Skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: order, isLoading, isError, refetch } = useOrderDetail(Number(id))
  const { mutate: confirmOrder, isPending: confirming } = useConfirmOrder()
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  const handleConfirm = () => {
    if (!confirm('Konfirmasi terima barang? Dana akan diteruskan ke penjual.')) return
    confirmOrder(Number(id))
  }

  if (isError) return <div className="max-w-4xl mx-auto py-20 px-4"><ErrorState onRetry={() => refetch()} /></div>

  if (isLoading || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-14 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-24">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/pesanan" className="inline-flex items-center gap-1.5 h-8 px-3 rounded-none bg-secondary text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-muted transition-colors mb-2">
              <ChevronLeft className="h-3 w-3" /> Kembali
            </Link>
            <h1 className="text-3xl font-black lowercase tracking-tighter">detail <span className="text-primary">pesanan</span></h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">#{order.id} • {formatDate(order.created_at)}</p>
          </div>
          
          <div className={cn(
            "px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-widest border-2",
            ORDER_STATUS_COLOR[order.status]
          )}>
            {ORDER_STATUS_LABEL[order.status]}
          </div>

          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 flex items-center gap-2 transition-colors sm:self-end"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Laporkan
          </button>
        </div>

        {/* Status Alert for Buyer Actions */}
        {order.status === 'dikirim' && (
          <div className="p-6 rounded-none bg-zinc-900 border border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex gap-4 text-white">
              <div className="h-10 w-10 rounded-none bg-white/20 flex items-center justify-center shrink-0">
                <Truck className="h-5 w-5 text-zinc-100" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-50 uppercase tracking-tight">Barang Sedang Dikirim</h4>
                <p className="text-xs text-zinc-300 mt-1 font-medium italic">Resi: {order.resi || 'Diproses'}</p>
              </div>
            </div>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full sm:w-auto h-12 px-8 rounded-none bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {confirming ? <LoadingSpinner size="sm" /> : 'Konfirmasi Terima'}
            </button>
          </div>
        )}

        {/* Product Card */}
        <div className="bg-card rounded-none border border-border/50 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start">
            <div className="relative h-40 w-40 sm:h-48 sm:w-48 rounded-none overflow-hidden bg-muted shrink-0 shadow-sm">
               <Image
                src={order.product?.primary_photo_url || (order.product as any).primary_photo?.photo_url || (order.product?.photos && order.product.photos.length > 0 ? order.product.photos[0].photo_url : '/placeholder-product.png')}
                alt={order.product?.name || 'Produk Pesanan'}
                fill
                className="object-cover"
                unoptimized={order.product?.primary_photo_url?.startsWith('http') || (order.product as any).primary_photo?.photo_url?.startsWith('http')}
              />
            </div>
            <div className="flex-1 flex flex-col min-w-0 py-2">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-primary">
                <Store className="h-3 w-3" />
                <span>{order.store?.name}</span>
              </div>
              <h2 className="text-2xl font-black lowercase tracking-tight mb-2 line-clamp-2 leading-none">
                {order.product?.name}
              </h2>
              <div className="flex gap-4 text-xs font-medium text-muted-foreground mb-6">
                <span>Ukuran: {order.product?.size}</span>
                <span>•</span>
                <span>Kondisi: {order.product?.condition}</span>
              </div>
              
              <div className="mt-auto grid grid-cols-2 gap-4 border-t border-border/50 pt-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Harga Barang</p>
                  <p className="text-lg font-black tracking-tight">{formatRupiah(order.subtotal)}</p>
                </div>
                {order.status === 'selesai' && (
                  <Link 
                    href={`/ulasan?order_id=${order.id}`}
                    className="h-10 px-4 rounded-none border border-primary text-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all ml-auto self-end"
                  >
                    <Star className="h-3.5 w-3.5" /> Beri Ulasan
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping */}
          <div className="p-6 rounded-none bg-muted/20 border border-border/50 space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-widest">Info Pengiriman</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Penerima</p>
                <p className="text-sm font-bold uppercase tracking-tight">{order.buyer?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Alamat</p>
                <p className="text-xs text-muted-foreground leading-relaxed italic">{order.buyer?.phone}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">Gading Serpong, Tangerang, Banten 15810</p>
              </div>
              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Kurir</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold uppercase tracking-widest">{order.courier_code || 'JNE'}</span>
                  <span className="text-xs text-muted-foreground tracking-tight font-medium">({order.courier_service || 'Reguler'})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="p-6 rounded-none bg-muted/20 border border-border/50 space-y-6">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-widest">Info Pembayaran</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium uppercase tracking-widest">Metode Balanja</span>
                <span className="font-black uppercase tracking-widest">{order.payment?.method || 'GOPAY'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium uppercase tracking-widest">Status Dana</span>
                <div className="flex items-center gap-1 text-emerald-600 font-black uppercase tracking-widest">
                  <ShieldCheck className="h-3 w-3" />
                  Escrow {order.escrow_status}
                </div>
              </div>
              <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatRupiah(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <span>Ongkos Kirim</span>
                  <span>{formatRupiah(order.ongkir)}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-xs font-black uppercase tracking-widest">Total Bayar</span>
                  <span className="text-xl font-black tracking-tight text-primary">{formatRupiah(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Context (Optional) */}
        {order.resi && (
          <div className="flex justify-center">
            <button 
              onClick={() => window.open(`https://www.cekresi.com/?noresi=${order.resi}`, '_blank')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              Lihat Riwayat Perjalanan <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {order.store?.user_id && (
        <ReportModal 
          reportedUserId={order.store.user_id} 
          isOpen={isReportModalOpen} 
          onClose={() => setIsReportModalOpen(false)} 
        />
      )}
    </div>
  )
}

