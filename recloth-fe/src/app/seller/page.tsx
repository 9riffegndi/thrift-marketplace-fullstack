'use client'

import { useStoreDashboard } from '@/hooks/useStore'
import { formatRupiah } from '@/lib/utils/format'
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowUpRight, 
  Clock,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { cn } from '@/lib/utils'
import type { StoreStats } from '@/types'

export default function SellerDashboardPage() {
  const { data: stats, isLoading } = useStoreDashboard()
  const s = stats as StoreStats

  if (isLoading) return <div className="p-8"><LoadingSpinner /></div>

  const cards = [
    { 
      label: 'Total Penjualan (GMV)', 
      value: formatRupiah(s?.gmv || 0), 
      icon: TrendingUp,
      desc: 'Total omzet kotor toko kamu',
      color: 'bg-emerald-50 text-emerald-600'
    },
    { 
      label: 'Pesanan Selesai', 
      value: s?.total_orders || 0, 
      icon: ShoppingBag,
      desc: 'Transaksi yang berhasil terkirim',
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      label: 'Produk Aktif', 
      value: s?.active_products || 0, 
      icon: Package,
      desc: 'Barang yang tayang di katalog',
      color: 'bg-orange-50 text-orange-600'
    },
    { 
      label: 'Followers Toko', 
      value: s?.followers_count || 0, 
      icon: Users,
      desc: 'Pelanggan setia tokomu',
      color: 'bg-purple-50 text-purple-600'
    },
  ]

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black lowercase tracking-tighter">seller <span className="text-primary">dashboard</span></h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Ikhtisar performa bisnis kamu hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-none overflow-hidden">
        {cards.map((card, i) => (
          <div key={i} className="bg-background p-8 space-y-4">
            <div className={cn("h-10 w-10 flex items-center justify-center rounded-none", card.color)}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{card.label}</p>
              <h3 className="text-2xl font-black tracking-tighter">{card.value}</h3>
              <p className="text-[9px] font-medium text-zinc-500 mt-2 italic">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shortcut Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Aksi Cepat</h2>
            <div className="grid grid-cols-1 gap-3">
                <Link href="/seller/produk/baru" className="flex items-center justify-between p-6 bg-zinc-900 text-white group hover:bg-black transition-colors">
                    <div className="flex items-center gap-4">
                        <Plus className="h-5 w-5 text-primary" />
                        <span className="text-xs font-black uppercase tracking-widest">Upload Produk Baru</span>
                    </div>
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
                <Link href="/seller/pesanan" className="flex items-center justify-between p-6 bg-zinc-50 border border-border group hover:border-black transition-colors">
                    <div className="flex items-center gap-4">
                        <Clock className="h-5 w-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Pesanan Perlu Dikirim</span>
                    </div>
                    <span className="bg-primary text-primary-foreground text-[10px] font-black px-2 py-0.5">2</span>
                </Link>
            </div>
        </div>

        {/* Latest Activity / Tips */}
        <div className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Tips Penjualan</h2>
            <div className="p-8 border border-zinc-100 bg-zinc-50/50 space-y-4 font-medium italic">
                <p className="text-xs text-zinc-700 leading-relaxed">
                    "Produk dengan foto berlatar belakang polos dan pencahayaan alami memiliki kemungkinan laku 3x lebih cepat."
                </p>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
                    Baca Panduan Seller <ArrowUpRight className="h-3 w-3" />
                </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

function Plus(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
    )
}
