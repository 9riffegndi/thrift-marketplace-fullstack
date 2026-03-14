'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cartApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { CartItem } from '@/types'

export function useCart() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await cartApi.list()
      return res.data.data
    },
    enabled: isAuthenticated,
    retry: false,
  })

  const addMutation = useMutation({
    mutationFn: (productId: number) => cartApi.add(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Berhasil ditambahkan ke keranjang')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menambahkan ke keranjang')
    },
  })

  const removeMutation = useMutation({
    mutationFn: (productId: number) => cartApi.remove(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Dihapus dari keranjang')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus dari keranjang')
    },
  })

  return {
    items: data ?? [],
    isLoading,
    isError,
    addItem: addMutation.mutate,
    removeItem: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
