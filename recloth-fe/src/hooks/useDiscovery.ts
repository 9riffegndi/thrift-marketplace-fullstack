'use client'

import { useQuery } from '@tanstack/react-query'
import { discoveryApi } from '@/lib/api'

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: () => discoveryApi.banners().then(r => r.data.data),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

export function useSystemConfig() {
  return useQuery({
    queryKey: ['system-configs'],
    queryFn: () => discoveryApi.configs().then(r => r.data.data),
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}
