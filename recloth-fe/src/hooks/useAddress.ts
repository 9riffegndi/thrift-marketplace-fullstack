'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addressApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { AddressInput } from '@/lib/validations'

export function useAddress() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()

  const query = useQuery({
    queryKey: ['addresses'],
    queryFn: () => addressApi.list().then(r => r.data.data),
    enabled: isAuthenticated,
    retry: false,
  })

  const createMutation = useMutation({
    mutationFn: (data: AddressInput) => addressApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Alamat ditambahkan')
    },
    onError: () => toast.error('Gagal menambahkan alamat'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AddressInput> }) => addressApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Alamat diperbarui')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => addressApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      toast.success('Alamat dihapus')
    },
  })

  const setPrimaryMutation = useMutation({
    mutationFn: (id: number) => addressApi.setPrimary(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  })

  return {
    addresses: query.data ?? [],
    isLoading: query.isLoading,
    createAddress: createMutation,
    updateAddress: updateMutation,
    deleteAddress: deleteMutation,
    setPrimary: setPrimaryMutation,
  }
}
