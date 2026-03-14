'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Search, ShoppingBag, User, Bell, MessageSquare, Menu, X, Heart } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/lib/store/cartStore'
import { cn } from '@/lib/utils'
import { useUnreadCount } from '@/hooks/useNotifications'

export function Navbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { me, logout } = useAuth()
  const { count } = useCartStore()
  const { data: unreadCount = 0 } = useUnreadCount()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const user = me.data
  const isAuthenticated = !!user

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300 bg-white border-b border-zinc-200 h-20",
      isScrolled && "h-16 shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        
        {/* Left: Desktop Nav */}
        {/* <div className="hidden lg:flex items-center gap-8 flex-1">
          {['Wanita', 'Pria', 'Anak', 'Aksesoris', 'Sale'].map((item) => (
            <Link 
              key={item}
              href={`/cari?category=${item.toLowerCase() === 'sale' ? 'sale' : item.toLowerCase()}`}
              className={cn(
                "text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-black relative py-1",
                pathname === `/cari` && searchParams.get('category') === item.toLowerCase() ? "text-black border-b-2 border-black" : "text-zinc-400"
              )}
            >
              {item}
            </Link>
          ))}
        </div> */}

        {/* Center: Logo */}
        <Link href="/" className="flex items-center gap-3 group px-4">
          <div className="h-9 w-9 bg-black flex items-center justify-center transition-transform group-hover:rotate-6">
            <span className="text-white font-black text-xl italic leading-none">R</span>
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase hidden sm:block leading-none text-black">Recloth</span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1">
          <div className="hidden md:flex items-center bg-zinc-100 px-4 h-12 w-56 focus-within:ring-2 focus-within:ring-black transition-all">
            <Search className="h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="CARI SESUATU..." 
              className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest px-3 w-full text-black placeholder:text-zinc-400"
            />
          </div>

          <Link href="/cari" className="md:hidden h-10 w-10 flex items-center justify-center text-black hover:text-zinc-600">
            <Search className="h-5 w-5" />
          </Link>

          {isAuthenticated && (
            <div className="flex items-center">
              <Link href="/notifikasi" className="relative h-12 w-12 flex items-center justify-center group text-zinc-400 hover:text-black transition-colors">
                <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
                {unreadCount > 0 && (
                  <span className="absolute top-3 right-3 h-2 w-2 bg-red-600 rounded-full" />
                )}
              </Link>
              <Link href="/chat" className="h-12 w-12 flex items-center justify-center group text-zinc-400 hover:text-black transition-colors">
                <MessageSquare className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
            </div>
          )}

          <Link href="/keranjang" className="relative h-12 w-12 flex items-center justify-center group text-zinc-400 hover:text-black transition-colors">
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
            {count() > 0 && (
              <span className="absolute top-2.5 right-1.5 h-4 min-w-[16px] px-1 bg-black text-[8px] text-white flex items-center justify-center font-black">
                {count()}
              </span>
            )}
          </Link>

          <div className="h-8 w-px bg-zinc-200 mx-2 hidden sm:block" />

          {isAuthenticated ? (
            <Link href="/profil" className="flex items-center gap-3 pl-2 group">
              <div className="hidden sm:flex flex-col items-end gap-0">
                <span className="text-[10px] font-black uppercase tracking-tight leading-none text-black group-hover:text-zinc-600 transition-colors">{user?.name}</span>
                <span className="text-[8px] font-black text-zinc-400 mt-1 uppercase tracking-widest">Akun Saya</span>
              </div>
              <div className="h-10 w-10 overflow-hidden bg-zinc-100 flex items-center justify-center border border-zinc-200 group-hover:border-black transition-colors">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="object-cover h-full w-full" />
                ) : (
                  <User className="h-5 w-5 text-zinc-400 group-hover:text-black" />
                )}
              </div>
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="h-12 px-8 bg-black text-white text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Masuk
            </Link>
          )}

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden h-10 w-10 flex items-center justify-center text-black hover:text-zinc-600 ml-2"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-0 bg-white z-[100] animate-in fade-in duration-300">
          <div className="h-20 border-b flex items-center justify-between px-4">
            <span className="font-black text-xl uppercase tracking-tighter">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)}><X className="h-6 w-6" /></button>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 gap-4">
              {['Toko', 'Kategori', 'Populer', 'Swap', 'Wishlist', 'Pesanan Saya'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-2xl font-black uppercase tracking-tighter text-black hover:text-zinc-600 transition-colors border-b border-zinc-100 pb-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
            
            {isAuthenticated && (
              <button 
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full h-16 bg-zinc-100 text-red-600 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-colors hover:bg-red-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
