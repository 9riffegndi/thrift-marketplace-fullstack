'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '@/lib/api'
import { useAuthStore } from '@/lib/store/authStore'
import { toast } from 'sonner'
import type { Conversation, Message } from '@/types'

export function useConversations() {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await chatApi.conversations()
      return res.data.data
    },
    enabled: isAuthenticated,
  })
}

export function useConversationMessages(conversationId: number | null) {
  const { isAuthenticated } = useAuthStore()
  return useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return []
      const res = await chatApi.messages(conversationId)
      return res.data.data.data
    },
    enabled: !!conversationId && isAuthenticated,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ conversationId, message }: { conversationId: number; message: string }) =>
      chatApi.send(conversationId, message),
    onMutate: async (newMessage) => {
      await queryClient.cancelQueries({ queryKey: ['conversation-messages', newMessage.conversationId] })
      const previousMessages = queryClient.getQueryData(['conversation-messages', newMessage.conversationId])
      
      queryClient.setQueryData(['conversation-messages', newMessage.conversationId], (old: any) => [
        ...(old || []),
        {
          id: Date.now(),
          conversation_id: newMessage.conversationId,
          user_id: -1, // Temporary
          message: newMessage.message,
          created_at: new Date().toISOString(),
          is_optimistic: true
        }
      ])
      
      return { previousMessages }
    },
    onError: (err: any, newMessage, context) => {
      queryClient.setQueryData(['conversation-messages', newMessage.conversationId], context?.previousMessages)
      toast.error(err.response?.data?.message || 'Gagal mengirim pesan.')
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['conversation-messages', variables.conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}

export function useGetOrCreateConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (storeId: number) => {
      const res = await chatApi.getOrCreate(storeId)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
