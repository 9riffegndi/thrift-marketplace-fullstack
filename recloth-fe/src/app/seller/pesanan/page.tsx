'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sellerApi } from '@/lib/api'
import Image from 'next/image'
import { formatRupiah, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, formatDate } from '@/lib/utils/format'
import { Truck, ShoppingCart, User, MapPin, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/shared/Skeleton'
import { ErrorState } from '@/components/shared/ErrorState'

export default function SellerOrdersPage() {
  const [status, setStatus] = useState<string>('all')
  const queryClient = useQueryClient()

  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['seller-orders', status],
    queryFn: () => sellerApi.orders({ status: status === 'all' ? undefined : status }).then(r => r.data.data),
  })

  const confirmMutation = useMutation({
    mutationFn: (id: number) => sellerApi.confirmOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders'] })
      toast.success('Pesanan dikonfirmasi!')
    },
  })

  const tabs = [
    { id: 'all', label: 'Semua' },
    { id: 'menunggu_bayar', label: 'Belum Bayar' },
    { id: 'dikonfirmasi', label: 'Perlu Dikirim' },
    { id: 'dikirim', label: 'Dikirim' },
    { id: 'selesai', label: 'Selesai' },
  ]

  if (isError) return <div className="max-w-4xl mx-auto py-20 px-4"><ErrorState onRetry={() => refetch()} /></div>

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">Daftar Pesanan</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">
            {orders?.total || 0} Total Pesanan
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatus(tab.id)}
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors pb-4 -mb-px",
              status === tab.id 
                ? "text-foreground border-b-2 border-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-px bg-border border-y border-border">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-40 bg-background" />)
        ) : orders?.data?.length === 0 ? (
          <div className="bg-background py-20">
            <EmptyState title="Belum ada pesanan" description="Tingkatkan promosi produkmu untuk mendapatkan pesanan pertama!" />
          </div>
        ) : (
          orders?.data?.map((order: any) => (
            <Link 
              key={order.id} 
              href={`/seller/pesanan/${order.id}`}
              className="group block bg-background p-6 space-y-6 border-b border-border/50 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest">Order #{order.id}</h4>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-3 py-1 border text-[10px] font-bold uppercase tracking-widest",
                  ORDER_STATUS_COLOR[order.status as keyof typeof ORDER_STATUS_COLOR]
                )}>
                  {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL]}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex gap-4">
                  <div className="relative h-20 w-20 overflow-hidden bg-muted shrink-0 shadow-sm">
                    <Image
                      src={order.product?.primary_photo || '/placeholder-product.png'}
                      alt={order.product?.name || 'Produk'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black lowercase tracking-tight truncate group-hover:text-primary transition-colors">{order.product?.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-widest">
                      {order.product?.category?.name} • Ukuran {order.product?.size}
                    </p>
                    <p className="text-lg font-black tracking-tight mt-2">{formatRupiah(order.total)}</p>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-border/50" />

                <div className="md:w-64 flex flex-col justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      <User className="h-3 w-3" /> {order.buyer?.name}
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Tangerang, Banten</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Kelola <ChevronLeft className="h-3 w-3 rotate-180" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
