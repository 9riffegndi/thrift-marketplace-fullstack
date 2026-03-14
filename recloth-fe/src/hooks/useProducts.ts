'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { get, post, patch, del } from '@/lib/api'
import { toast } from 'sonner'
import type { Product, PaginatedData, ApiResponse } from '@/types'

export interface ProductFilters {
  q?: string
  category_id?: number
  condition?: string
  min_price?: number
  max_price?: number
  city?: string
  sort?: string
  page?: number
  per_page?: number
  status?: string
  [key: string]: any
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const res = await get<PaginatedData<Product>>('/products', filters)
      return res.data.data
    },
  })
}

export function useInfiniteProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['products-infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await get<PaginatedData<Product>>('/products', { ...filters, page: pageParam })
      return res.data.data
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useProductDetail(slugOrId: string | number) {
  return useQuery({
    queryKey: ['product', slugOrId],
    queryFn: async () => {
      try {
        const res = await get<{ product: Product }>(`/products/${slugOrId}`)
        return res.data.data.product
      } catch (err: any) {
        if (err?.response?.status === 404 && typeof slugOrId === 'string') {
          const match = slugOrId.match(/(\d+)$/)
          if (match) {
            const res = await get<{ product: Product }>(`/products/${match[1]}`)
            return res.data.data.product
          }
        }
        throw err
      }
    },
    enabled: !!slugOrId,
  })
}

export function useMyProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['my-products', filters],
    queryFn: async () => {
      const res = await get<PaginatedData<Product>>('/stores/my/products', filters)
      return res.data.data
    },
  })
}

export const useSellerProducts = useMyProducts

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => post<Product>('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
      toast.success('Produk berhasil ditambahkan!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menambahkan produk.')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      post<Product>(`/products/${id}?_method=PUT`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
      toast.success('Produk berhasil diperbarui')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui produk.')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => del<null>(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
      toast.success('Produk berhasil dihapus')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus produk.')
    },
  })
}

export function useToggleProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => patch<Product>(`/products/${id}/toggle`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      queryClient.invalidateQueries({ queryKey: ['my-products'] })
      toast.success('Status produk berhasil diubah')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mengubah status produk.')
    },
  })
}
