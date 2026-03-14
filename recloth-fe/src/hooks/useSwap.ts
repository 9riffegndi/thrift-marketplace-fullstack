'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { swapApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'

export function useSwaps() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['swaps'],
    queryFn: async () => {
      const res = await swapApi.list()
      return res.data.data
    },
    enabled: isAuthenticated,
  })
}

export function useRequestSwap() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { target_product_id: number; requester_product_id: number }) =>
      swapApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] })
      toast.success('Permintaan tukar barang berhasil diajukan')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mengajukan tukar barang.')
    },
  })
}

export function useRespondSwap() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'diterima' | 'ditolak' }) =>
      swapApi.respond(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] })
      toast.success(`Permintaan swap telah ${variables.status}`)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menanggapi swap.')
    },
  })
}

export function useSwapResi() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, resi, side }: { id: number; resi: string; side: 'buyer' | 'seller' }) =>
      swapApi.inputResi(id, { resi, side }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] })
      toast.success('Nomor resi swap berhasil disimpan')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal simpan resi swap.')
    },
  })
}

export function useConfirmSwap() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => swapApi.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swaps'] })
      toast.success('Swap barang berhasil dikonfirmasi selesai')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal konfirmasi swap.')
    },
  })
}
