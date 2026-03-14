'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '@/lib/api'
import { toast } from 'sonner'

export function useCreateReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: { rating: number; comment?: string } }) =>
      reviewsApi.store(orderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] })
      queryClient.invalidateQueries({ queryKey: ['orders-buyer'] })
      toast.success('Gokil! Ulasan kamu sudah masuk.')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Waduh, gagal kirim ulasan nih.')
    },
  })
}

export function useReplyReview() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: { comment: string } }) =>
      reviewsApi.reply(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders-seller'] })
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success('Produk yang bagus memang layak dapet respon!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal balas ulasan.')
    },
  })
}
