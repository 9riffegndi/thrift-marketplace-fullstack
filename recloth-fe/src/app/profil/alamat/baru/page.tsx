'use client'

import { useAddress } from '@/hooks/useAddress'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { MapPin, Loader2, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const addressSchema = z.object({
  label: z.string().min(1, 'Label wajib diisi (Rumah/Kantor/Lainnya)'),
  recipient_name: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  phone: z.string().min(10, 'Nomor HP minimal 10 karakter'),
  province: z.string().min(1, 'Provinsi wajib diisi'),
  city: z.string().min(1, 'Kota wajib diisi'),
  district: z.string().min(1, 'Kecamatan wajib diisi'),
  postal_code: z.string().min(5, 'Kode pos minimal 5 karakter'),
  address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  is_primary: z.boolean().optional().default(false),
})

export default function NewAddressPage() {
  const router = useRouter()
  const { createAddress } = useAddress()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Rumah',
      is_primary: false,
    }
  })

  const onSubmit = async (data: any) => {
    createAddress.mutate(data, {
      onSuccess: () => {
        router.push('/profil/alamat')
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 pb-24 space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <h1 className="text-xl font-bold uppercase tracking-tight">Tambah Alamat Baru</h1>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Masukkan detail alamat pengiriman Anda</p>
        </div>
        <Link href="/profil/alamat" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1">
          <X className="h-3 w-3" /> Batal & Kembali
        </Link>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Label Alamat (Contoh: Rumah, Kantor)</label>
              <input
                {...register('label')}
                placeholder="Misal: Rumah"
                className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
                required
              />
              {errors.label && (
                <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{errors.label.message as string}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Nama Penerima</label>
            <input
              {...register('recipient_name')}
              placeholder="Joko Susilo"
              className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
              required
            />
            {errors.recipient_name && (
              <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{errors.recipient_name.message as string}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Nomor Telepon Penerima</label>
            <input
              {...register('phone')}
              placeholder="08123456789"
              className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
              required
            />
            {errors.phone && (
              <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{errors.phone.message as string}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Provinsi</label>
            <input
              {...register('province')}
              placeholder="Jawa Barat"
              className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
              required
            />
            {errors.province && (
              <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{errors.province.message as string}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Kota/Kabupaten</label>
            <input
              {...register('city')}
              placeholder="Bandung"
              className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
              required
            />
            {errors.city && (
              <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{errors.city.message as string}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Kecamatan</label>
            <input
              {...register('district')}
              placeholder="Coblong"
              className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
              required
            />
            {errors.district && (
              <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{errors.district.message as string}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Kode Pos</label>
            <input
              {...register('postal_code')}
              placeholder="40135"
              className="w-full h-12 px-4 border border-border text-sm outline-none focus:border-foreground transition-colors"
              required
            />
            {errors.postal_code && (
              <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{errors.postal_code.message as string}</p>
            )}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Alamat Lengkap</label>
            <textarea
              {...register('address')}
              placeholder="Jl. Ganesha No. 10, RT 01 RW 01..."
              className="w-full min-h-[100px] p-4 border border-border text-sm outline-none focus:border-foreground transition-colors resize-none"
              required
            />
            {errors.address && (
              <p className="text-[10px] text-destructive font-medium mt-1 ml-0.5">{errors.address.message as string}</p>
            )}
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <input
              {...register('is_primary')}
              type="checkbox"
              id="is_primary"
              className="h-4 w-4 bg-white border border-border rounded-none checked:bg-black transition-colors"
            />
            <label htmlFor="is_primary" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground cursor-pointer select-none">Jadikan Alamat Utama</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={createAddress.isPending}
          className="w-full h-14 bg-black text-white font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors disabled:bg-muted disabled:text-muted-foreground"
        >
          {createAddress.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              <Save className="h-4 w-4" /> Simpan Alamat
            </>
          )}
        </button>
      </form>
    </div>
  )
}
