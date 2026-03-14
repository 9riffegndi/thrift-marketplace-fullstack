'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProductDetail } from '@/hooks/useProducts'
import { useAddress } from '@/hooks/useAddress'
import { useShippingCost } from '@/hooks/useShipping'
import { useCheckout } from '@/hooks/useOrders'
import { useCheckPromo } from '@/hooks/usePromo'
import { useWallet } from '@/hooks/useWallet'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import {
  MapPin,
  Truck,
  Tag,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
  Plus,
  Wallet
} from 'lucide-react'
import { Skeleton } from '@/components/shared/Skeleton'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function CheckoutPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params)
  const router = useRouter()

  // States
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [selectedCourier, setSelectedCourier] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  const [shippingPrice, setShippingPrice] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('va_bca')

  // Hooks
  const { data: product, isLoading: isProductLoading } = useProductDetail(productId)
  const { addresses, isLoading: isAddressLoading } = useAddress()
  const { mutate: getShippingCost, isPending: isShippingLoading, data: shippingResults } = useShippingCost()
  const { mutate: checkout, isPending: isCheckingOut } = useCheckout()
  const { mutate: checkPromo, isPending: isCheckingPromo } = useCheckPromo()
  const { data: walletData } = useWallet()

  // Find selected objects
  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.is_primary)

  // Set initial address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const primary = addresses.find(a => a.is_primary)
      if (primary) setSelectedAddressId(primary.id)
      else setSelectedAddressId(addresses[0].id)
    }
  }, [addresses, selectedAddressId])

  // Shipping Calculation
  useEffect(() => {
    if (selectedAddress && product?.id && selectedCourier) {
      getShippingCost({
        product_id: product.id,
        destination_city_id: selectedAddress.city,
        courier: selectedCourier
      })
    }
  }, [selectedAddress, product, selectedCourier, getShippingCost])

  // Price Calculation
  const productPrice = Number(product?.price || 0)
  const discount = Number(appliedPromo?.discount || 0)
  const platformFee = 2500
  const total = productPrice + Number(shippingPrice) + platformFee - discount

  const handleApplyPromo = () => {
    if (!promoCode) return
    checkPromo({ code: promoCode, subtotal: Number(productPrice) }, {
      onSuccess: (res) => {
        setAppliedPromo({ code: promoCode, discount: res.data.data.discount })
        toast.success('Promo berhasil digunakan!')
      }
    })
  }

  const handleCheckout = () => {
    if (!selectedAddressId) return toast.error('Pilih alamat pengiriman terlebih dahulu')
    if (!selectedCourier) return toast.error('Pilih kurir pengiriman')
    if (!selectedService) return toast.error('Pilih layanan pengiriman')
    if (isShippingLoading) return

    checkout({
      product_id: Number(productId),
      address_id: selectedAddressId,
      courier_code: selectedCourier,
      courier_service: selectedService,
      ongkir: shippingPrice,
      payment_method: paymentMethod,
      promo_code: appliedPromo?.code
    }, {
      onSuccess: (res) => {
        if (!res.data.data.payment_url) {
          toast.success('Pemesanan berhasil!')
          router.push('/pesanan')
        }
      }
    })
  }

  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b border-border flex items-center px-4">
          <Skeleton className="h-5 w-5 mr-4" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
        <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-12">
            <Skeleton className="h-32" />
            <Skeleton className="h-40" />
            <Skeleton className="h-48" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-96" />
          </div>
        </main>
      </div>
    )
  }

  if (!product) return <div className="min-h-screen flex items-center justify-center"><ErrorState message="Produk tidak ditemukan" /></div>

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border h-16 flex items-center px-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-muted transition-colors rounded-none">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center text-[11px] font-bold uppercase tracking-[0.2em] mr-8">
          Selesaikan Pesanan
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-12">

          {/* Shipping Address */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Alamat Pengiriman</h2>
              <Link href="/profil/alamat" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                <Plus className="h-3 w-3" /> Tambah
              </Link>
            </div>

            {addresses.length > 0 ? (
              <div className="border border-zinc-200 p-6 space-y-4 rounded-none bg-white">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-zinc-400 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-bold uppercase tracking-tight">
                      {selectedAddress?.recipient_name} <span className="text-zinc-400 font-medium">({selectedAddress?.label})</span>
                    </p>
                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                      {selectedAddress?.phone}<br />
                      {selectedAddress?.address}, {selectedAddress?.city}, {selectedAddress?.province}, {selectedAddress?.postal_code}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push('/profil/alamat')}
                    className="p-2 hover:bg-muted rounded-none"
                  >
                    <ChevronRight className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => router.push('/profil/alamat')}
                className="w-full border border-dashed border-border p-8 flex flex-col items-center gap-3 text-zinc-400 hover:text-foreground hover:border-foreground transition-all rounded-none"
              >
                <MapPin className="h-6 w-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Belum ada alamat, tambah sekarang</span>
              </button>
            )}
          </section>

          {/* Product Summary */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Produk Dipesan</h2>
            <div className="flex gap-6 items-center py-6 border-y border-zinc-200 rounded-none bg-white">
              <div className="relative h-24 w-20 bg-muted shrink-0 overflow-hidden rounded-none">
                <Image
                  src={product.primary_photo_url || (product as any).primary_photo?.photo_url || (product.photos && product.photos.length > 0 ? product.photos[0].photo_url : '/placeholder-product.png')}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-black uppercase tracking-tight truncate">{product.name}</h3>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1 italic">{product.store?.name}</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="text-[9px] font-black py-1 px-3 bg-zinc-100 uppercase border border-zinc-200">Size {product.size}</div>
                  <PriceDisplay price={product.price} className="text-sm font-black text-black" />
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Method */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Metode Pengiriman</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border border border-border">
              {['jne', 'tiki', 'pos'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCourier(c)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 bg-background gap-2 transition-all rounded-none",
                    selectedCourier === c ? "ring-1 ring-foreground z-10" : "hover:bg-muted/50"
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{c}</span>
                  {selectedCourier === c && <CheckCircle2 className="h-3 w-3 text-foreground" />}
                </button>
              ))}
            </div>

            {isShippingLoading && <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400"><LoadingSpinner size="sm" /> Menghitung ongkir...</div>}

            {!isShippingLoading && shippingResults?.data?.data && (
              <div className="space-y-px bg-zinc-200 border border-zinc-200 rounded-none">
                {shippingResults.data.data.map((service: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (service.cost && service.cost.length > 0) {
                        setShippingPrice(service.cost[0].value)
                        setSelectedService(service.service)
                      } else {
                        toast.error('Gagal mengambil harga untuk layanan ini.')
                      }
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-4 bg-background transition-colors text-left rounded-none",
                      selectedService === service.service ? "bg-muted" : "hover:bg-muted/30"
                    )}
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-tight">{service.service}</p>
                      <p className="text-[9px] text-zinc-400 font-medium uppercase tracking-wider">{service.description}</p>
                      <p className="text-[9px] text-zinc-500 mt-0.5">Estimasi {service.cost?.[0]?.etd || '-'} hari</p>
                    </div>
                    <PriceDisplay price={service.cost?.[0]?.value || 0} className="text-[11px] font-bold" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Promo */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Kode Promo</h2>
            <div className="flex gap-px bg-border border border-border rounded-none">
              <div className="flex-1 bg-background flex items-center px-4 gap-3">
                <Tag className="h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="MASUKKAN KODE PROMO"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full  h-12 border-none outline-none text-[10px] font-bold uppercase tracking-widest placeholder:text-zinc-300"
                />
              </div>
              <button
                onClick={handleApplyPromo}
                disabled={isCheckingPromo || !promoCode}
                className="h-12 px-10 text-[10px] font-black uppercase tracking-[0.25em] bg-black text-white hover:bg-zinc-800 transition-all rounded-none disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {isCheckingPromo ? <LoadingSpinner size="sm" /> : 'Gunakan'}
              </button>
            </div>
            {appliedPromo && (
              <div className="flex items-center justify-between py-2 px-4 bg-emerald-50 border border-emerald-100 rounded-none">
                <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">Berhasil: {appliedPromo.code}</p>
                <button onClick={() => setAppliedPromo(null)} className="text-[10px] font-bold uppercase text-zinc-400 hover:text-black rounded-none">Hapus</button>
              </div>
            )}
          </section>

          {/* Payment Method */}
          <section className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Metode Pembayaran</h2>
            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={cn(
                  "w-full flex  items-center justify-between p-6 border transition-all rounded-none",
                  paymentMethod === 'wallet' ? "border-foreground " : "border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-tight">Dompet Recloth</p>
                    <div className="text-[10px] text-zinc-400 font-medium uppercase mt-0.5">
                      Saldo: <PriceDisplay price={walletData?.balance || 0} />
                    </div>
                  </div>
                </div>
                {paymentMethod === 'wallet' && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </button>

              <button
                onClick={() => setPaymentMethod('va_bca')}
                className={cn(
                  "w-full flex items-center justify-between p-6 border transition-all rounded-none",
                  paymentMethod === 'va_bca' ? "border-foreground" : "border-border hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-100 rounded-full">
                    <CreditCard className="h-5 w-5 text-zinc-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold uppercase tracking-tight">Virtual Account / Others</p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase mt-0.5">Transfer Bank, QRIS, dll via Midtrans</p>
                  </div>
                </div>
                {paymentMethod === 'va_bca' && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </button>
            </div>
            {paymentMethod === 'wallet' && Number(walletData?.balance || 0) < total && (
              <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-100 rounded-none text-red-600">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Saldo dompet tidak mencukupi untuk pesanan ini.</p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28  border border-border p-8 space-y-8 rounded-none">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Ringkasan Belanja</h2>

            <div className="space-y-5">
              <div className="flex justify-between text-[11px] font-medium uppercase tracking-wide">
                <span className="text-zinc-500">Harga Produk</span>
                <PriceDisplay price={productPrice} />
              </div>
              <div className="flex justify-between text-[11px] font-medium uppercase tracking-wide">
                <span className="text-zinc-500">Biaya Pengiriman</span>
                <PriceDisplay price={shippingPrice} />
              </div>
              <div className="flex justify-between text-[11px] font-medium uppercase tracking-wide">
                <span className="text-zinc-500">Biaya Layanan</span>
                <PriceDisplay price={platformFee} />
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide text-emerald-600">
                  <span>Potongan Promo</span>
                  <span>-{formatRupiah(discount)}</span>
                </div>
              )}

              <div className="border-t-2 border-black pt-8 flex justify-between items-baseline">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Tagihan</span>
                <PriceDisplay price={total} className="text-3xl font-black tracking-tighter text-black" />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-100 rounded-none">
                <AlertCircle className="h-4 w-4 text-zinc-400 mt-0.5" />
                <p className="text-[9px] text-zinc-500 leading-relaxed font-medium">
                  Pastikan alamat dan pilihan kurir sudah benar. Setelah pembayaran dikonfirmasi, seller akan segera mengirimkan paket dalam 1-2 hari kerja.
                </p>
              </div>

              <button
                disabled={isCheckingOut || !selectedAddressId || !selectedCourier || (paymentMethod === 'wallet' && Number(walletData?.balance || 0) < total)}
                onClick={handleCheckout}
                className="w-full h-14 bg-black text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-zinc-800 shadow-none active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 rounded-none"
              >
                {isCheckingOut ? <LoadingSpinner size="sm" /> : <CreditCard className="h-4 w-4" />}
                Lanjut ke Pembayaran
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
