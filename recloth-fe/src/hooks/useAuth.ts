'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, profileApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setAuth, logout: storeLogout, setUser } = useAuthStore()

  // Query: Get current user
  const me = useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const res = await authApi.me()
      return res.data.data.user
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('recloth_token'),
  })

  // Mutation: Login
  const loginMutation = useMutation({
    mutationFn: (data: any) => authApi.login(data.email, data.password),
    onSuccess: (res) => {
      setAuth(res.data.data.user, res.data.data.token)
      queryClient.setQueryData(['auth-me'], res.data.data.user)
      toast.success('Selamat datang kembali, ' + res.data.data.user.name + '!')
      router.push('/')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal login. Periksa kembali email dan password Anda.')
    },
  })

  // Mutation: Register
  const registerMutation = useMutation({
    mutationFn: (data: any) => authApi.register(data),
    onSuccess: (res) => {
      setAuth(res.data.data.user, res.data.data.token)
      queryClient.setQueryData(['auth-me'], res.data.data.user)
      toast.success('Akun berhasil dibuat!')
      router.push('/')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal registrasi.')
    },
  })

  // Mutation: Logout
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      storeLogout()
      queryClient.clear()
      router.push('/login')
      toast.success('Berhasil keluar')
    },
  })

  // Mutation: Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: FormData) => profileApi.update(data),
    onSuccess: (res) => {
      setUser(res.data.data)
      queryClient.setQueryData(['auth-me'], res.data.data)
      toast.success('Profil berhasil diperbarui!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil.')
    },
  })

  // Mutation: Change Password
  const changePasswordMutation = useMutation({
    mutationFn: (data: any) => profileApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password berhasil diubah!')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mengubah password.')
    },
  })

  return {
    user: me.data,
    me,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending || updateProfileMutation.isPending || changePasswordMutation.isPending,
  }
}
