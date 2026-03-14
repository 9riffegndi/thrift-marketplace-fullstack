'use client'

import { useMutation } from '@tanstack/react-query'
import { reportsApi } from '@/lib/api'
import { toast } from 'sonner'

export function useReport() {
  return useMutation({
    mutationFn: (data: { reported_user_id: number; reason: string; description?: string }) =>
      reportsApi.create(data),
    onSuccess: () => {
      toast.success('Laporan berhasil dikirim dan akan segera ditinjau')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mengirim laporan.')
    },
  })
}
