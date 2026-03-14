'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { Order, PaginatedData } from '@/types'

export function useBuyerOrders(params?: Record<string, unknown>) {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['orders-buyer', params],
    queryFn: async () => {
      const res = await ordersApi.list(params)
      return res.data.data
    },
    enabled: isAuthenticated,
  })
}

export function useSellerOrders(params?: Record<string, unknown>) {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['orders-seller', params],
    queryFn: async () => {
      const res = await ordersApi.sellerList(params)
      return res.data.data
    },
    enabled: isAuthenticated,
  })
}

export function useOrderDetail(id: number) {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await ordersApi.get(id)
      return res.data.data
    },
    enabled: !!id && isAuthenticated,
  })
}

export function useCheckout() {
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => ordersApi.checkout(data),
    onSuccess: (res) => {
      if (res.data.data.payment_url) {
        window.location.href = res.data.data.payment_url
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal melakukan checkout.')
    },
  })
}

export function useInputResi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, resi, courier_code }: { id: number; resi: string; courier_code: string }) =>
      ordersApi.inputResi(id, { resi, courier_code }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['orders-seller'] })
      toast.success('Nomor resi berhasil diupdate')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal update resi.')
    },
  })
}

export function useTrackOrder(id: number) {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['order-tracking', id],
    queryFn: async () => {
      const res = await ordersApi.tracking(id)
      return res.data.data
    },
    enabled: !!id && isAuthenticated,
  })
}

export function useConfirmOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ordersApi.confirm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders-buyer'] })
      toast.success('Pesanan berhasil dikonfirmasi selesai')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal konfirmasi pesanan.')
    },
  })
}
