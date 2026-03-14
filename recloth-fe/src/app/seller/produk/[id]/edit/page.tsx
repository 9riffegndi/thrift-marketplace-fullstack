'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useProductDetail, useUpdateProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { ErrorState } from '@/components/shared/ErrorState'
import { ArrowLeft, Save, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'

const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  category_id: z.number().min(1, 'Pilih kategori produk'),
  price: z.number().min(1000, 'Harga minimal Rp 1.000'),
  weight: z.number().min(1, 'Berat minimal 1 gram'),
  condition: z.string().min(1, 'Pilih kondisi barang'),
  size: z.string().min(1, 'Input ukuran barang'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  status: z.enum(['active', 'inactive', 'sold']),
})

type ProductFormValues = z.infer<typeof productSchema>

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const { data: productData, isLoading: isProductLoading, isError } = useProductDetail(id)
  const product = productData
  const { data: categories } = useCategories()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    if (product) {
      setValue('name', product.name || '')
      setValue('category_id', product.category_id || 0)
      setValue('price', Number(product.price) || 0)
      setValue('weight', product.weight || 0)
      setValue('condition', product.condition || 'A')
      setValue('size', product.size || '')
      setValue('description', product.description || '')
      setValue('status', (product.status as any) || 'active')
    }
  }, [product, setValue])

  const onSubmit = (data: ProductFormValues) => {
    // Controller expects x-www-form-urlencoded or multipart for PUT via POST workaround
    // But since we are not uploading new files here (photos are current), we can just send basic fields.
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    updateProduct({ id: Number(id), data: formData }, {
      onSuccess: () => router.push('/seller/produk')
    })
  }

  if (isProductLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
  if (isError || !product) return <div className="min-h-screen flex items-center justify-center"><ErrorState message="Produk tidak ditemukan." /></div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="h-10 w-10 flex items-center justify-center hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-black lowercase tracking-tighter">edit <span className="text-primary">produk</span></h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Update detail barang kamu.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-10">
          {/* Name */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Nama Produk</label>
            <input 
              {...register('name')}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold uppercase tracking-tight"
            />
            {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.name.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status Produk</label>
            <select 
              {...register('status')}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold"
            >
              <option value="active">Aktif (Dijual)</option>
              <option value="inactive">Nonaktif</option>
              <option value="sold">Terjual</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Kategori</label>
            <select 
              {...register('category_id', { valueAsNumber: true })}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold"
            >
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Harga (RP)</label>
            <input 
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold"
            />
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Size</label>
            <input 
              {...register('size')}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold uppercase"
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Berat (GRAM)</label>
            <input 
              type="number"
              {...register('weight', { valueAsNumber: true })}
              className="w-full h-12 bg-transparent border-b border-zinc-200 outline-none focus:border-black transition-colors text-sm font-bold"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Deskripsi Produk</label>
            <textarea 
              {...register('description')}
              className="w-full h-40 p-4 bg-zinc-50 border border-border outline-none focus:border-black transition-colors text-sm font-medium leading-relaxed resize-none italic"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full h-16 bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-colors hover:bg-zinc-800 disabled:bg-zinc-200"
        >
          {isUpdating ? <LoadingSpinner size="sm" /> : <><Save className="h-4 w-4" /> Simpan Perubahan</>}
        </button>
      </form>
    </div>
  )
}
