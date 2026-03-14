'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, ShoppingBag, Package, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { count } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const navItems = [
    { href: '/', icon: Home, label: 'Beranda' },
    { href: '/cari', icon: Search, label: 'Cari' },
    { href: '/keranjang', icon: ShoppingBag, label: 'Tas', badge: count() },
    { href: '/pesanan', icon: Package, label: 'Pesanan', auth: true },
    { href: '/profil', icon: User, label: 'Akun', auth: true },
  ]

  // Hide on auth pages
  const hidePaths = ['/login', '/register']
  if (hidePaths.includes(pathname)) return null

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border flex items-center justify-around h-[72px] pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        if (item.auth && !isAuthenticated) return null

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 w-full h-full transition-colors",
              isActive ? "text-black" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            <div className="relative">
              <item.icon className={cn("h-[22px] w-[22px]", isActive && "stroke-[2.5px]")} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2.5 h-4 min-w-[16px] px-1 bg-black text-white text-[8px] flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{item.label}</span>
          </Link>
        )
      })}
      
      {!isAuthenticated && (
        <button
          onClick={() => router.push('/login')}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 w-full h-full transition-colors font-medium",
            pathname === '/login' ? "text-black" : "text-zinc-400"
          )}
        >
          <User className="h-[22px] w-[22px]" />
          <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Masuk</span>
        </button>
      )}
    </nav>
  )
}
