'use client'

import { useBuyerOrders } from '@/hooks/useOrders'
import { formatRupiah, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/utils/format'
import { Package, ChevronRight, Search, Inbox } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/shared/Skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'

export default function OrdersPage() {
  const router = useRouter()
  const [status, setStatus] = useState<string>('all')
  const { data: ordersResult, isLoading, isError, refetch } = useBuyerOrders({ status: status === 'all' ? undefined : status })

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'menunggu_bayar', label: 'Belum Bayar' },
    { id: 'dikonfirmasi', label: 'Diproses' },
    { id: 'dikirim', label: 'Dikirim' },
    { id: 'selesai', label: 'Selesai' },
    { id: 'dibatalkan', label: 'Batal' },
  ]

  const orders = ordersResult?.data || []

  if (isError) return <div className="max-w-4xl mx-auto py-20 px-4"><ErrorState onRetry={() => refetch()} /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 pb-24">
      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-black lowercase tracking-tighter">pesanan <span className="text-primary">saya</span></h1>
          <p className="text-sm text-muted-foreground font-medium">Pantau status pengiriman dan riwayat belanja kamu.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-4 scrollbar-hide border-b border-border/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id)}
              className={cn(
                "h-10 px-6 rounded-none text-xs font-black uppercase tracking-widest transition-all shrink-0",
                status === tab.id 
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-44 bg-background" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Tidak ada pesanan"
              description="Belum ada pesanan dalam kategori ini."
              actionLabel="Mulai Belanja"
              onAction={() => router.push('/cari')}
            />
          ) : (
            orders.map((order) => (
              <Link
                key={order.id}
                href={`/pesanan/${order.id}`}
                className="group block p-5 sm:p-6 bg-card rounded-none border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-sm hover:shadow-primary/5"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-none bg-muted flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Store</span>
                        <span className="text-sm font-bold uppercase truncate max-w-[120px] sm:max-w-none">{order.store?.name}</span>
                      </div>
                    </div>
                    <span className={cn(
                      "px-3 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest border border-current",
                      ORDER_STATUS_COLOR[order.status]
                    )}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>

                  <div className="flex gap-4 sm:gap-6">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-none overflow-hidden bg-muted shrink-0">
                      <Image
                        src={order.product?.primary_photo_url || (order.product as any).primary_photo?.photo_url || (order.product?.photos && order.product.photos.length > 0 ? order.product.photos[0].photo_url : '/placeholder-product.png')}
                        alt={order.product?.name || 'Produk Pesanan'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized={order.product?.primary_photo_url?.startsWith('http') || (order.product as any).primary_photo?.photo_url?.startsWith('http')}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base truncate group-hover:text-primary transition-colors">
                          {order.product?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{order.product?.size} • {order.product?.condition} Condition</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <p className="font-black text-lg tracking-tight">{formatRupiah(order.total)}</p>
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all">
                          Detail <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
