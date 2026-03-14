'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateProduct, useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Camera, X, Plus, ArrowLeft, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  category_id: z.number().min(1, 'Pilih kategori produk'),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
  weight: z.number().min(1, 'Berat minimal 1 gram'),
  condition: z.string().min(1, 'Pilih kondisi barang'),
  size: z.string().min(1, 'Input ukuran barang'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
})

type ProductFormValues = z.infer<typeof productSchema>

export default function NewProductPage() {
  const router = useRouter()
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const { data: categories } = useCategories()
  const { mutate: createProduct, isPending } = useCreateProduct()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      condition: 'A',
      weight: 100,
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages].slice(0, 5))
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const onSubmit = (data: ProductFormValues) => {
    if (images.length === 0) {
      return alert('Minimal upload 1 foto produk')
    }

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    
    images.forEach((img, i) => {
      formData.append('photos[]', img.file)
      if (i === 0) formData.append('primary_photo_index', '0')
    })

    createProduct(formData, {
      onSuccess: () => router.push('/seller/produk')
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black lowercase tracking-tighter">upload <span className="text-primary">produk</span></h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Pastikan data barang akurat dan transparan.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        {/* Images Selection */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Foto Produk (Maks 5)</h2>
            <span className="text-[10px] font-medium text-zinc-400 italic">Disarankan aspek rasio 3:4</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[3/4] bg-muted group">
                <Image src={img.preview} alt={`Preview ${i + 1}`} fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black text-white text-[8px] font-black uppercase tracking-widest text-center py-1">
                    UTAMA
                  </div>
                )}
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="relative aspect-[3/4] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-zinc-50 transition-all">
                <Plus className="h-6 w-6 text-zinc-300" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-2">Tambah</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </section>

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10">
          {/* Name */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Nama Produk</label>
            <input 
              {...register('name')}
              placeholder="CONTOH: VINTAGE LEATHER JACKET 90S"
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold uppercase tracking-tight placeholder:text-zinc-200"
            />
            {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Kategori</label>
            <select 
              {...register('category_id', { valueAsNumber: true })}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold"
            >
              <option value="">Pilih Kategori</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.category_id.message}</p>}
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Kondisi</label>
            <select 
              {...register('condition')}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold"
            >
              <option value="A">Grade A (New/Like New)</option>
              <option value="B">Grade B (Good/Minimal Signs)</option>
              <option value="C">Grade C (Standard/Used)</option>
              <option value="D">Grade D (Minus/Defect)</option>
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Harga (RP)</label>
            <input 
              type="number"
              {...register('price', { valueAsNumber: true })}
              placeholder="0"
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold"
            />
            {errors.price && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.price.message}</p>}
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Size</label>
            <input 
              {...register('size')}
              placeholder="S, M, L, XL, atau UKURAN CM"
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold uppercase"
            />
            {errors.size && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.size.message}</p>}
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Berat (GRAM)</label>
            <input 
              type="number"
              {...register('weight', { valueAsNumber: true })}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold"
            />
            {errors.weight && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.weight.message}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Deskripsi Produk</label>
            <textarea 
              {...register('description')}
              placeholder="Jelaskan detail barang, defect jika ada, dan catatan lainnya..."
              className="w-full h-40 p-4 bg-zinc-50 border border-border outline-none focus:border-black transition-colors text-sm font-medium leading-relaxed resize-none italic"
            />
            {errors.description && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.description.message}</p>}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-6 bg-zinc-900 text-white space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-zinc-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Penting</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed italic">
            Barang yang sudah di-publish akan tayang di katalog utama. Harap jujur dalam penilaian grade barang agar tidak terjadi komplain/refund.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-16 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-colors hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          {isPending ? <LoadingSpinner size="sm" /> : 'Hubungkan ke Katalog'}
        </button>
      </form>
    </div>
  )
}
