'use client'

import { useAddress } from '@/hooks/useAddress'
import Link from 'next/link'
import { Skeleton } from '@/components/shared/Skeleton'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, Map } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const LABEL_ICONS = {
  Rumah: Home,
  Kantor: Briefcase,
  Lainnya: Map
}

export default function AddressPage() {
  const { addresses, isLoading, deleteAddress, setPrimary } = useAddress()

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    )
  }

  const handleDelete = (id: number) => {
    if (confirm('Hapus alamat ini?')) {
      deleteAddress.mutate(id)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold uppercase tracking-tight">Daftar Alamat</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Kelola alamat pengiriman pesanan Anda</p>
        </div>
        <Link href="/profil/alamat/baru" className="h-10 px-6 bg-black text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-colors">
          <Plus className="h-3.5 w-3.5" /> Tambah Alamat
        </Link>
      </header>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border flex flex-col items-center gap-4">
            <MapPin className="h-8 w-8 text-zinc-300" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Belum ada alamat tersimpan</p>
          </div>
        ) : (
          addresses.map((addr) => {
            const Icon = (LABEL_ICONS as any)[addr.label] || Map
            return (
              <div 
                key={addr.id} 
                className={cn(
                  "p-6 border transition-all space-y-4",
                  addr.is_primary ? "border-foreground bg-zinc-50/50" : "border-border hover:border-zinc-400"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-white border border-border flex items-center justify-center">
                      <Icon className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.15em]">{addr.label}</h3>
                      {addr.is_primary && (
                        <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-600 mt-1">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Alamat Utama
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDelete(addr.id)}
                      disabled={deleteAddress.isPending}
                      className="p-2 text-zinc-400 hover:text-destructive transition-colors disabled:opacity-50"
                    >
                      {deleteAddress.isPending ? <LoadingSpinner size="sm" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <p className="text-sm font-bold tracking-tight">{addr.recipient_name}</p>
                  <p className="text-[11px] text-zinc-500 font-medium">{addr.phone}</p>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-2">
                    {addr.address}<br />
                    {addr.city}, {addr.province}, {addr.postal_code}
                  </p>
                </div>

                {!addr.is_primary && (
                  <div className="pt-2">
                    <button 
                      onClick={() => setPrimary.mutate(addr.id)}
                      disabled={setPrimary.isPending}
                      className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors disabled:opacity-50"
                    >
                      {setPrimary.isPending ? 'Sedang Memproses...' : 'Jadikan Alamat Utama'}
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
