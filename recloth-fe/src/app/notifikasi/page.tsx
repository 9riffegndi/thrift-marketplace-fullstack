'use client'

import { useNotifications, useUnreadCount } from '@/hooks/useNotifications'
import { useAuthStore } from '@/lib/store/authStore'
import { redirect } from 'next/navigation'
import { formatRelativeTime } from '@/lib/utils/format'
import { Bell, Package, MessageSquare, DollarSign, Star } from 'lucide-react'
import { Skeleton } from '@/components/shared/Skeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorState } from '@/components/shared/ErrorState'

const NOTIF_ICON: Record<string, React.ElementType> = {
  order_new: Package,
  message_new: MessageSquare,
  wallet_credit: DollarSign,
  review_new: Star,
}

export default function NotifikasiPage() {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) redirect('/login')

  const { notifications, isLoading, isError, refetch, markRead, markAllRead } = useNotifications()
  const { data: unreadCount = 0 } = useUnreadCount()

  if (isError) return <div className="max-w-2xl mx-auto py-20 px-4"><ErrorState onRetry={() => refetch()} /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-black lowercase tracking-tighter">notifikasi</h1>
          {unreadCount > 0 && <p className="text-[10px] font-bold uppercase tracking-widest text-black">{unreadCount} belum dibaca</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllRead()} className="text-[10px] font-bold uppercase tracking-widest hover:underline decoration-zinc-300 underline-offset-4">
            Tandai semua dibaca
          </button>
        )}
      </div>

      {isLoading && (
        <div className="space-y-px bg-border border-y border-border">
          {[1,2,3,4,5,6].map(i => (
            <Skeleton key={i} className="h-24 bg-background" />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <EmptyState
          title="Belum ada notifikasi"
          description="Notifikasi akan muncul di sini"
          icon={Bell}
        />
      )}

      <div className="space-y-2">
        {notifications.map(notif => {
          const Icon = NOTIF_ICON[notif.type] || Bell
          return (
            <button
              key={notif.id}
              onClick={() => !notif.is_read && markRead(notif.id)}
              className={`w-full flex gap-3 p-4 rounded-none border transition-all text-left ${
                notif.is_read
                  ? 'border-border bg-card'
                  : 'border-zinc-900 bg-zinc-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 ${
                notif.is_read ? 'bg-muted' : 'bg-zinc-900'
              }`}>
                <Icon className={`h-5 w-5 ${notif.is_read ? 'text-muted-foreground' : 'text-white'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-bold uppercase tracking-tight ${notif.is_read ? '' : 'text-zinc-900'}`}>{notif.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold tracking-widest">{formatRelativeTime(notif.created_at)}</p>
              </div>
              {!notif.is_read && (
                <div className="w-2 h-2 rounded-none bg-zinc-900 mt-1.5 shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
