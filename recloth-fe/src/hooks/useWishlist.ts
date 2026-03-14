'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { wishlistApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { Product, PaginatedData } from '@/types'

export function useWishlist() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  const query = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await wishlistApi.list()
      return res.data.data
    },
    enabled: isAuthenticated,
  })

  const addMutation = useMutation({
    mutationFn: (productId: number) => wishlistApi.add(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist-check', productId] })
      toast.success('Produk ditambahkan ke wishlist')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menambahkan ke wishlist')
    },
  })

  const removeMutation = useMutation({
    mutationFn: (productId: number) => wishlistApi.remove(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist-check', productId] })
      toast.success('Produk dihapus dari wishlist')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus dari wishlist')
    },
  })

  return {
    items: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}

export function useIsWishlisted(productId: number) {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['wishlist-check', productId],
    queryFn: async () => {
      const res = await wishlistApi.check(productId)
      return res.data.data.in_wishlist
    },
    enabled: !!productId && isAuthenticated,
  })
}
