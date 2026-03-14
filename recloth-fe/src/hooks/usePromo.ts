'use client'

import { useMutation } from '@tanstack/react-query'
import { promoApi } from '@/lib/api'
import { toast } from 'sonner'

export function useCheckPromo() {
  return useMutation({
    mutationFn: (data: { code: string; subtotal: number }) =>
      promoApi.check(data.code, data.subtotal),
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Kode promo tidak valid atau sudah kadaluarsa.')
    },
  })
}
