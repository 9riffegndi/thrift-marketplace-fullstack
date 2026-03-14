'use client'

import { useOrderDetail, useInputResi } from '@/hooks/useOrders'
import { formatRupiah, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, formatDate } from '@/lib/utils/format'
import { Package, Truck, User, MapPin, ChevronLeft, CreditCard, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: order, isLoading } = useOrderDetail(Number(id))
  const { mutate: inputResi, isPending: isUpdatingResi } = useInputResi()

  const [isResiModalOpen, setIsResiModalOpen] = useState(false)
  const [resi, setResi] = useState('')
  const [courier, setCourier] = useState('jne')

  const handleUpdateResi = () => {
    if (!resi) return
    inputResi({ id: Number(id), resi, courier_code: courier }, {
      onSuccess: () => setIsResiModalOpen(false)
    })
  }

  if (isLoading || !order) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 h-8 px-3 rounded-none bg-secondary text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-muted transition-colors mb-2">
              <ChevronLeft className="h-3 w-3" /> Kembali
            </button>
            <h1 className="text-3xl font-black lowercase tracking-tighter">kelola <span className="text-primary">pesanan</span></h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">#{order.id} • {formatDate(order.created_at)}</p>
          </div>
          
          <div className={cn(
            "px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-widest border-2",
            ORDER_STATUS_COLOR[order.status as keyof typeof ORDER_STATUS_COLOR]
          )}>
            {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL]}
          </div>
        </div>

        {/* Action Bar */}
        {order.status === 'dikonfirmasi' && (
          <div className="p-6 bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-white/10 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-tight">Siapkan Paket Sekarang</h4>
                <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">Batas waktu kirim dalam 2 hari kerja</p>
              </div>
            </div>
            <button
              onClick={() => setIsResiModalOpen(true)}
              className="w-full sm:w-auto h-12 px-8 bg-primary text-primary-foreground font-black text-xs uppercase tracking-widest hover:bg-white transition-all"
            >
              Input Resi Pengiriman
            </button>
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buyer & Shipping Info */}
          <div className="space-y-8">
             {/* Product Summary */}
            <section className="bg-card rounded-none border border-border p-6 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detail Barang</h3>
                <div className="flex gap-4">
                    <div className="relative h-20 w-16 bg-muted shrink-0 shadow-sm">
                        <Image src={order.product?.primary_photo || '/placeholder-product.png'} alt={order.product?.name || 'Produk'} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-xs font-bold uppercase tracking-tight truncate">{order.product?.name}</h4>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">Size {order.product?.size} • {order.product?.condition} Condition</p>
                        <p className="text-sm font-black mt-2">{formatRupiah(order.subtotal)}</p>
                    </div>
                </div>
            </section>

            <section className="bg-card rounded-none border border-border p-6 space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Alamat Pengiriman</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Penerima</p>
                  <p className="text-xs font-bold uppercase tracking-tight">{order.buyer?.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Telepon</p>
                  <p className="text-xs font-medium italic">{order.buyer?.phone}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Alamat Lengkap</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Gading Serpong, Tangerang, Banten 15810
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Payment & Status */}
          <div className="space-y-8">
             <section className="bg-card rounded-none border border-border p-6 space-y-6">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Detail Pembayaran</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Penjualan</span>
                  <span className="text-lg font-black tracking-tight">{formatRupiah(order.subtotal)}</span>
                </div>
                <div className="pt-4 border-t border-border/50 flex items-center gap-2 text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Escrow {order.escrow_status}</span>
                </div>
                <p className="text-[9px] text-muted-foreground italic leading-relaxed">
                   Dana masih ditahan oleh Recloth. Dana akan cair ke dompetmu setelah pembeli mengonfirmasi terima barang.
                </p>
              </div>
            </section>

            {order.resi && (
                <section className="bg-zinc-50 border border-border p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-zinc-400" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest">Info Pengiriman</h3>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Nomor Resi</p>
                             <p className="text-sm font-bold uppercase tracking-widest">{order.resi}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Ekspedisi</p>
                             <p className="text-xs font-black uppercase tracking-widest">{order.courier_code}</p>
                        </div>
                    </div>
                </section>
            )}
          </div>
        </div>
      </div>

      {/* Resi Modal */}
      {isResiModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-none p-8 space-y-8 shadow-2xl scale-in-center">
                <div className="space-y-1">
                    <h2 className="text-xl font-black lowercase tracking-tighter">input <span className="text-primary">resi</span></h2>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Masukkan data pengiriman produk</p>
                </div>
                
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest">Pilih Kurir</label>
                        <select 
                            value={courier}
                            onChange={(e) => setCourier(e.target.value)}
                            className="w-full h-12 bg-transparent border-b border-black outline-none text-xs font-bold uppercase"
                        >
                            <option value="jne">JNE</option>
                            <option value="tiki">TIKI</option>
                            <option value="pos">POS INDONESIA</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest">Nomor Resi</label>
                        <input 
                            value={resi}
                            onChange={(e) => setResi(e.target.value)}
                            placeholder="MISAL: JNAP-12345678"
                            className="w-full h-12 bg-transparent border-b border-black outline-none text-xs font-bold uppercase placeholder:text-zinc-200"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setIsResiModalOpen(false)}
                        className="flex-1 h-12 border border-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleUpdateResi}
                        disabled={!resi || isUpdatingResi}
                        className="flex-1 h-12 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:bg-zinc-200"
                    >
                        {isUpdatingResi ? 'Saving...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
