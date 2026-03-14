'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateStore, useUpdateStore } from '@/hooks/useStore'
import { useQuery } from '@tanstack/react-query'
import { storesApi } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Camera, Store, MapPin, Truck, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const storeSchema = z.object({
  name: z.string().min(3, 'Nama toko minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  city: z.string().min(1, 'Pilih kota asal pengiriman'),
  province: z.string().min(1, 'Pilih provinsi'),
  address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  couriers: z.array(z.string()).min(1, 'Pilih minimal 1 kurir'),
})

type StoreFormValues = z.infer<typeof storeSchema>

export default function StoreSetupPage() {
  const router = useRouter()
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null)
  
  const { data: currentStore, isLoading: isStoreLoading } = useQuery({
    queryKey: ['my-store-setup'],
    queryFn: () => storesApi.myStats().then(r => r.data.data),
    retry: false,
  })

  const { mutate: createStore, isPending: isCreating } = useCreateStore()
  const { mutate: updateStore, isPending: isUpdating } = useUpdateStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      couriers: ['jne'],
    }
  })

  const selectedCouriers = watch('couriers') || []

  useEffect(() => {
    if (currentStore) {
      setValue('name', currentStore.name || '')
      setValue('description', currentStore.description || '')
      setValue('city', currentStore.city || '')
      setValue('province', currentStore.province || '')
      setValue('address', currentStore.address || '')
      if (currentStore.couriers) {
        setValue('couriers', currentStore.couriers.map((c: any) => c.courier_code))
      }
    }
  }, [currentStore, setValue])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto({
        file,
        preview: URL.createObjectURL(file)
      })
    }
  }

  const toggleCourier = (code: string) => {
    const current = [...selectedCouriers]
    if (current.includes(code)) {
      if (current.length > 1) {
        setValue('couriers', current.filter(c => c !== code))
      }
    } else {
      setValue('couriers', [...current, code])
    }
  }

  const onSubmit = (data: StoreFormValues) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'couriers') {
        (value as string[]).forEach(v => formData.append('couriers[]', v))
      } else {
        formData.append(key, String(value))
      }
    })
    
    if (photo) {
      formData.append('photo', photo.file)
    }

    if (currentStore) {
      updateStore(formData, { onSuccess: () => router.push('/toko') })
    } else {
      createStore(formData)
    }
  }

  if (isStoreLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>

  const isEdit = !!currentStore

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black lowercase tracking-tighter">
            {isEdit ? 'pengaturan' : 'buka'} <span className="text-primary">toko</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Bangun identitas brand pre-loved kamu sendiri.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Photo Upload */}
        <section className="flex flex-col items-center gap-6 py-8 border-y border-border">
          <div className="relative h-32 w-32 bg-muted overflow-hidden border border-border group">
            {photo?.preview || currentStore?.photo ? (
              <Image 
                src={photo?.preview || currentStore?.photo || '/placeholder-store.png'} 
                alt="Store Logo" 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Store className="h-10 w-10 text-zinc-300" />
              </div>
            )}
            <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="h-6 w-6 mb-1" />
              <span className="text-[8px] font-black uppercase tracking-widest">Ubah Foto</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest">Logo Toko</h3>
            <p className="text-[9px] text-zinc-400 italic">Disarankan ukuran 500x500px</p>
          </div>
        </section>

        {/* Basic Info */}
        <div className="space-y-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Nama Toko</label>
            <input 
              {...register('name')}
              placeholder="MISAL: RECLOTH ARCHIVE"
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold uppercase tracking-tight placeholder:text-zinc-200"
            />
            {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.name.message}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Deskripsi / Bio Toko</label>
            <textarea 
              {...register('description')}
              placeholder="Ceritakan tentang koleksi yang kamu jual..."
              className="w-full h-32 p-4 bg-zinc-50 border border-border outline-none focus:border-black transition-colors text-sm font-medium leading-relaxed resize-none italic"
            />
            {errors.description && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.description.message}</p>}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="space-y-10 border-t border-border pt-10">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Lokasi & Pengiriman
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Provinsi</label>
               <input 
                 {...register('province')}
                 placeholder="JAWA BARAT"
                 className="w-full h-10 bg-transparent border-b border-zinc-200 outline-none text-xs font-bold uppercase"
               />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Kota/Kota Madya</label>
               <input 
                 {...register('city')}
                 placeholder="BANDUNG"
                 className="w-full h-10 bg-transparent border-b border-zinc-200 outline-none text-xs font-bold uppercase"
               />
            </div>
            <div className="md:col-span-2 space-y-2">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Alamat Lengkap Toko</label>
               <textarea 
                 {...register('address')}
                 className="w-full h-24 p-3 bg-zinc-50 border border-border outline-none text-xs font-medium"
               />
               {errors.address && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.address.message}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
              <Truck className="h-3 w-3" /> Kurir yang Didukung
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['jne', 'jnt', 'sicepat', 'pos', 'ninja'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCourier(c)}
                  className={cn(
                    "h-10 text-[9px] font-black uppercase tracking-widest border transition-colors",
                    selectedCouriers.includes(c) ? "bg-black text-white border-black" : "bg-white text-zinc-400 border-zinc-200 hover:border-black"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            {errors.couriers && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.couriers.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating || isUpdating}
          className="w-full h-16 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-colors hover:bg-zinc-800 disabled:bg-zinc-200"
        >
          {isCreating || isUpdating ? <LoadingSpinner size="sm" /> : isEdit ? 'Simpan Perubahan' : 'Publish Toko'}
        </button>
      </form>
    </div>
  )
}
