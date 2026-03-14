'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { walletApi, withdrawalApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { Wallet, WalletTransaction, Withdrawal } from '@/types'

export function useWallet() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await walletApi.get()
      return res.data.data
    },
    enabled: isAuthenticated,
  })
}

export function useWalletTransactions() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const res = await walletApi.transactions()
      return res.data.data.data
    },
    enabled: isAuthenticated,
  })
}

export function useWithdraw() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Withdrawal>) => withdrawalApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      toast.success('Permintaan penarikan saldo berhasil diajukan')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mengajukan penarikan.')
    },
  })
}

export function useWithdrawals() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const res = await withdrawalApi.list()
      return res.data.data
    },
    enabled: isAuthenticated,
  })
}

export function useTopUp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (amount: number) => walletApi.topup(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] })
      toast.success('Top up saldo berhasil')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal melakukan top up.')
    },
  })
}
