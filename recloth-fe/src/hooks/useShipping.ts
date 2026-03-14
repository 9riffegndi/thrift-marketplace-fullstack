'use client'

import { useMutation } from '@tanstack/react-query'
import { shippingApi } from '@/lib/api'
import { toast } from 'sonner'

export function useShippingCost() {
  return useMutation({
    mutationFn: (data: { product_id: number; destination_city_id: string; courier: string }) =>
      shippingApi.cost(data),
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mendapatkan ongkos kirim.')
    },
  })
}
