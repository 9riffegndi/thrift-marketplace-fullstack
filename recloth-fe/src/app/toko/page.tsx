'use client'

import { useQuery } from '@tanstack/react-query'
import { storesApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { redirect } from 'next/navigation'
import { formatRupiah } from '@/lib/utils/format'
import Link from 'next/link'
import { Package, ShoppingBag, Star, Users, TrendingUp, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/shared/Skeleton'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'

export default function TokoPage() {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) redirect('/login')

  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['store-stats'],
    queryFn: () => storesApi.myStats().then(r => r.data.data),
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        <div className="h-14 w-1/3 bg-zinc-100 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}
        </div>
      </div>
    )
  }

  if (isError) return <ErrorState onRetry={() => refetch()} />

  if (!stats) {
    return (
      <EmptyState
        title="Belum Punya Toko"
        description="Setup toko kamu dan mulai berjualan!"
        actionLabel="Setup Toko"
        onAction={() => redirect('/toko/setup')}
      />
    )
  }

  const statCards = [
    { label: 'Total Produk', value: (stats as any)?.products_count ?? 0, icon: Package },
    { label: 'Total Terjual', value: stats.total_sales, icon: ShoppingBag },
    { label: 'Rating Toko', value: stats.rating.toFixed(1), icon: Star },
    { label: 'Status Toko', value: stats.status === 'active' ? 'Aktif' : 'Nonaktif', icon: TrendingUp },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-tight">{stats.name}</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1 italic">{stats.city}, {stats.province}</p>
        </div>
        <Link href={`/toko/${stats.slug}`} className="text-[10px] font-bold uppercase tracking-widest border-b border-foreground pb-0.5 hover:text-muted-foreground transition-colors">
          Lihat Toko Publik
        </Link>
      </div>

      {/* Stats Cards - Grid style like H&M */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
        {statCards.map(card => (
          <div key={card.label} className="bg-background p-6 space-y-3 group hover:bg-muted/30 transition-colors">
            <div className="text-muted-foreground group-hover:text-foreground transition-colors">
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{card.label}</p>
              <p className="text-2xl font-bold mt-1 tracking-tight">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: '/seller/produk/baru', label: 'Tambah Produk', icon: Plus, primary: true },
          { href: '/seller/pesanan', label: 'Kelola Pesanan', icon: ShoppingBag, primary: false },
          { href: '/seller/keuangan', label: 'Saldo & Withdraw', icon: TrendingUp, primary: false },
        ].map(action => (
          <Link 
            key={action.href} 
            href={action.href}
            className={cn(
              "flex items-center gap-3 p-6 h-16 font-bold text-[10px] uppercase tracking-widest transition-colors",
              action.primary ? "bg-primary text-primary-foreground hover:bg-zinc-800" : "border border-border hover:bg-muted"
            )}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
