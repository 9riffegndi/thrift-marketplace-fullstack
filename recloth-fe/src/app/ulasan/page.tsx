'use client'

import { Suspense, use, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useOrderDetail } from '@/hooks/useOrders'
import { useCreateReview } from '@/hooks/useReviews'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Star, MessageSquare, ArrowLeft, Camera, Send } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

function UlasanContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const { data: order, isLoading } = useOrderDetail(Number(orderId))
  const { mutate: createReview, isPending } = useCreateReview()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return
    
    createReview({
      orderId: Number(orderId),
      data: { rating, comment }
    }, {
      onSuccess: () => router.push(`/pesanan/${orderId}`)
    })
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
  if (!order) return <div className="min-h-screen flex items-center justify-center">Pesanan tidak ditemukan.</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-12 pb-32">
      <header className="mb-10">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <h1 className="text-3xl font-black lowercase tracking-tighter">beri <span className="text-primary">ulasan</span></h1>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1 italic">Pesanan #{order.id}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Product Info */}
        <div className="flex gap-6 items-center p-4 bg-muted/20 border border-border/50">
          <div className="relative h-20 w-16 bg-muted shrink-0 overflow-hidden">
            <Image src={order.product?.primary_photo || '/placeholder-product.png'} alt={order.product?.name || 'Produk'} fill className="object-cover" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-tight truncate max-w-[200px]">{order.product?.name}</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 italic">{order.store?.name}</p>
          </div>
        </div>

        {/* Rating */}
        <section className="space-y-4 text-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Bagaimana kualitas barangnya?</h2>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-all p-1"
              >
                <Star 
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hoverRating || rating) >= star ? "fill-primary text-primary" : "text-zinc-200"
                  )} 
                />
              </button>
            ))}
          </div>
        </section>

        {/* Comment */}
        <section className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <MessageSquare className="h-3 w-3" /> Ceritakan Pengalamanmu
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Kualitas barang, packing, kecepatan pengiriman, dll..."
            className="w-full h-32 p-4 bg-muted/20 border border-border/50 text-sm outline-none focus:border-primary transition-colors resize-none font-medium italic"
          />
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={rating === 0 || isPending}
          className="w-full h-14 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:bg-zinc-200 disabled:text-zinc-400 transition-all hover:bg-zinc-800"
        >
          {isPending ? <LoadingSpinner size="sm" /> : <Send className="h-4 w-4" />}
          Kirim Ulasan
        </button>
      </form>
    </div>
  )
}

export default function UlasanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <UlasanContent />
    </Suspense>
  )
}
