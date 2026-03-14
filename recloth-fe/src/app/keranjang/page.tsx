'use client'

import { useCart } from '@/hooks/useCart'
import { formatRupiah } from '@/lib/utils/format'
import { Trash2, ShoppingBag, ArrowRight, Info, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function CartPage() {
  const { items = [], isLoading, removeItem: removeFromCart } = useCart()

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen space-y-12">
        <Skeleton className="h-10 w-48" />
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1 w-full space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
          </div>
          <aside className="w-full lg:w-[380px] space-y-8">
            <Skeleton className="h-96" />
          </aside>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
        <EmptyState
          icon={ShoppingBag}
          title="Keranjang Belanja Kosong"
          description="Kamu belum menambahkan produk apapun ke dalam keranjang belanjamu."
          actionLabel="Mulai Belanja"
          onAction={() => window.location.href = '/'}
        />
      </div>
    )
  }

  const subtotal = items.reduce((acc, item) => acc + item.product.price, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-white">
      <h1 className="text-2xl font-black uppercase tracking-[0.25em] mb-12 border-b-2 border-black pb-8">
        Tas Belanja <span className="text-zinc-400 ml-4">({items.length})</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Items List */}
        <div className="flex-1 w-full space-y-px bg-border border border-border">
          {items.map((item) => (
            <div key={item.id} className="relative flex gap-6 p-6 bg-background group">
              <div className="relative h-32 w-24 bg-muted shrink-0 overflow-hidden">
                <Image
                  src={item.product.primary_photo_url || (item.product as any).primary_photo?.photo_url || (item.product.photos && item.product.photos.length > 0 ? item.product.photos[0].photo_url : '/placeholder-product.png')}
                  alt={item.product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link href={`/produk/${item.product.slug}`} className="text-sm font-bold uppercase tracking-tight hover:underline">
                      {item.product.name}
                    </Link>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {item.product.store?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Ukuran</p>
                    <p className="text-[10px] font-bold uppercase">{item.product.size}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Harga</p>
                    <p className="text-sm font-bold uppercase">{formatRupiah(item.product.price)}</p>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex justify-end">
                   <Link 
                    href={`/checkout/${item.product.id}`}
                    className="inline-flex items-center gap-2 h-14 px-10 bg-black text-white text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:bg-zinc-800 active:scale-[0.98]"
                  >
                    Beli Sekarang
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-8 bg-zinc-100 border-t border-zinc-200 flex items-start gap-5">
             <Info className="h-5 w-5 text-black shrink-0 mt-0.5" />
             <p className="text-[10px] text-zinc-600 leading-relaxed font-black uppercase tracking-widest">
               Karena setiap barang adalah preloved (stok cuma 1), kamu harus melakukan checkout per item untuk mempermudah proses swap/pembayaran yang berbeda seller.
             </p>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full lg:w-[380px] lg:sticky lg:top-32 space-y-10 h-fit">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Ringkasan Belanja</h2>
          
          <div className="space-y-5">
            <div className="flex justify-between text-[11px] font-medium uppercase tracking-wide">
              <span className="text-zinc-500">Subtotal Produk</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-medium uppercase tracking-wide">
              <span className="text-zinc-500">Biaya Layanan</span>
              <span>{formatRupiah(0)}</span>
            </div>
            <div className="border-t border-border pt-6 flex justify-between items-baseline">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total</span>
              <span className="text-2xl font-bold tracking-tighter">{formatRupiah(subtotal)}</span>
            </div>
          </div>

          <div className="space-y-4">
             <button className="w-full h-14 bg-black text-white font-black text-[10px] uppercase tracking-[0.25em] transition-all hover:bg-zinc-800 shadow-none active:scale-[0.98] rounded-none">
               Selesaikan Pembayaran
             </button>
             <Link 
               href="/"
               className="flex items-center justify-center w-full h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-900 hover:text-black transition-all"
             >
               Kembali Berbelanja
             </Link>
          </div>

          <div className="pt-10 border-t border-border space-y-5">
            <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Metode Pembayaran Aman</h4>
            <div className="flex gap-5 opacity-40 grayscale">
              <div className="h-5 w-10 bg-zinc-200" />
              <div className="h-5 w-10 bg-zinc-200" />
              <div className="h-5 w-10 bg-zinc-200" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
