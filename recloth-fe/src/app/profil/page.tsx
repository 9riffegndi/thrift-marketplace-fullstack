'use client'

import { useAuthStore } from '@/lib/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { User, Package, Heart, Wallet, MapPin, Settings, LogOut, ChevronRight, Store, Star, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/shared/Skeleton'

export default function ProfilePage() {
  const { user, me, logout } = useAuth()

  const menuItems = [
    { label: 'Pesanan Saya', icon: Package, href: '/pesanan', color: 'text-zinc-900 bg-zinc-100' },
    { label: 'Daftar Keinginan', icon: Heart, href: '/wishlist', color: 'text-zinc-900 bg-zinc-100' },
    { label: 'Dompet Recloth', icon: Wallet, href: '/dompet', color: 'text-zinc-900 bg-zinc-100' },
    { label: 'Daftar Alamat', icon: MapPin, href: '/profil/alamat', color: 'text-zinc-900 bg-zinc-100' },
    { label: 'Dashboard Toko', icon: Store, href: '/toko', color: 'text-zinc-900 bg-zinc-100' },
    { label: 'Pengaturan Akun', icon: Settings, href: '/pengaturan', color: 'text-zinc-900 bg-zinc-100' },
  ]

  if (me.isLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-12">
        <div className="flex flex-col items-center gap-6">
          <Skeleton className="h-28 w-28" />
          <div className="space-y-3 w-48">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        </div>
        <div className="space-y-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 pb-24 space-y-10 bg-white">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="relative">
          <div className="h-32 w-32 rounded-none border-2 border-black shadow-none overflow-hidden bg-zinc-100 flex items-center justify-center">
            {user?.avatar ? (
              <Image src={user.avatar} alt={user.name || 'User Avatar'} width={112} height={112} className="object-cover w-full h-full" />
            ) : (
              <User className="h-12 w-12 text-black/10" />
            )}
          </div>
          <div className="absolute bottom-1 right-1 h-8 w-8 rounded-none bg-white shadow-lg border border-border flex items-center justify-center text-primary group cursor-pointer hover:bg-primary hover:text-white transition-all">
             <Settings className="h-4 w-4" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-4xl font-black lowercase tracking-tighter text-black">{user?.name}</h1>
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-[0.2em]">{user?.email} • {user?.phone || 'NO PHONE'}</p>
        </div>

        <div className="flex items-center gap-8 pt-2">
           <div className="flex flex-col items-center">
              <span className="text-lg font-black tracking-tight">{user?.following_count || 0}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mengikuti</span>
           </div>
           <div className="h-8 w-px bg-border" />
           <div className="flex flex-col items-center">
              <span className="text-lg font-black tracking-tight">{user?.store?.followers_count || user?.followers_count || 0}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pengikut</span>
           </div>
           <div className="h-8 w-px bg-border" />
           <div className="flex flex-col items-center">
              <span className="text-lg font-black tracking-tight">{user?.store?.rating || '0.0'}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">Rating <Star className="h-2.5 w-2.5 fill-current text-yellow-400" /></span>
           </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4 mb-4">Pengaturan & Aktivitas</h3>
        <div className="bg-card rounded-none border border-border/50 overflow-hidden shadow-sm">
          {menuItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors group",
                i !== menuItems.length - 1 && "border-b border-border/50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-none flex items-center justify-center transition-all group-hover:bg-black group-hover:text-white", item.color.replace('zinc-100', 'zinc-100 border border-zinc-200'))}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold tracking-tight text-foreground/80 group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-4">
        <button
          onClick={() => logout()}
          className="w-full h-14 rounded-none bg-muted text-destructive font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Keluar Akun
        </button>
        <button className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <Share2 className="h-3 w-3" /> Bagikan Profil
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground font-black uppercase tracking-widest pt-8">
        Recloth v0.1.0 • Fashion for Future
      </p>
    </div>
  )
}
