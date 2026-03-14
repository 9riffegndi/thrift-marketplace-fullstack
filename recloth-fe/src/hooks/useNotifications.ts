'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { Notification, PaginatedData } from '@/types'
import { useEffect } from 'react'
import { echo } from '@/lib/echo'

export function useNotifications() {
  const queryClient = useQueryClient()
  const { isAuthenticated, user } = useAuthStore()

  // Real-time listener
  useEffect(() => {
    if (isAuthenticated && user && echo) {
      const el = echo as any
      const channel = el.private(`App.Models.User.${user.id}`)
      
      channel.notification(() => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
        queryClient.invalidateQueries({ queryKey: ['unread-count'] })
        toast.info('Ada notifikasi baru!')
      })

      return () => {
        el.leave(`App.Models.User.${user.id}`)
      }
    }
  }, [isAuthenticated, user?.id, queryClient])

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await notificationsApi.list()
      return res.data.data
    },
    enabled: isAuthenticated,
  })

  const markRead = useMutation({
    mutationFn: (id: number) => notificationsApi.read(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    },
  })

  const markAllRead = useMutation({
    mutationFn: () => notificationsApi.readAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
      toast.success('Semua notifikasi ditandai sudah dibaca')
    },
  })

  return {
    notifications: query.data?.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    markRead: markRead.mutate,
    markAllRead: markAllRead.mutate,
    refetch: query.refetch,
  }
}

export function useUnreadCount() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const res = await notificationsApi.unreadCount()
      return res.data.data.unread_count
    },
    enabled: isAuthenticated,
  })
}
