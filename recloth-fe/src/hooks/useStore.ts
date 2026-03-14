'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { storesApi } from '@/lib/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

export function useStoreDashboard() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['store-dashboard'],
    queryFn: () => storesApi.myDashboard().then(r => r.data.data),
    enabled: isAuthenticated,
  })
}

export function useStoreStats() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['store-stats'],
    queryFn: () => storesApi.myStats().then(r => r.data.data),
    enabled: isAuthenticated,
  })
}

export function useCreateStore() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: FormData) => storesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Toko berhasil dibuat! Sekarang kamu bisa mulai berjualan.')
      router.push('/seller')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal membuat toko.')
    },
  })
}

export function useUpdateStore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormData) => storesApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-dashboard'] })
      toast.success('Profil toko berhasil diperbarui.')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui toko.')
    },
  })
}
