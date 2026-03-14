"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import { MessageSquare, Send } from "lucide-react";
import ConversationList from "@/components/chat/ConversationList";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/shared/Skeleton";
import { useConversations, useConversationMessages, useSendMessage, useGetOrCreateConversation } from "@/hooks/useChat";
import { useAuthStore } from "@/lib/store/authStore";
import api from "@/lib/api";
import { echo } from "@/lib/echo";

type Message = { id: number; text: string; mine: boolean; time: string; status: 'sending' | 'sent' | 'read' | 'failed' };

export default function ChatPage() {
  const { user } = useAuthStore();
  const conversationsQuery = useConversations();
  const [activeId, setActiveId] = useState<number | null>(null);
  const selectedConversationId = activeId ?? (conversationsQuery.data?.[0]?.id ?? null);
  const messagesQuery = useConversationMessages(selectedConversationId);
  const { mutateAsync: sendMessage } = useSendMessage();
  const { mutateAsync: getOrCreate } = useGetOrCreateConversation();
  const searchParams = useSearchParams();
  const withUserId = searchParams.get('with');
  const withStoreId = searchParams.get('with_store');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationsQuery.isLoading) return;

    if (withUserId) {
      const existing = conversationsQuery.data?.find(c => 
        c.store?.user_id === Number(withUserId) || c.buyer_id === Number(withUserId)
      );
      if (existing) setActiveId(existing.id);
    }

    if (withStoreId) {
      const existing = conversationsQuery.data?.find(c => c.store_id === Number(withStoreId));
      if (existing) {
        setActiveId(existing.id);
      } else {
        getOrCreate(Number(withStoreId)).then(res => {
          if (res?.id) setActiveId(res.id);
        });
      }
    }
  }, [withUserId, withStoreId, conversationsQuery.data, conversationsQuery.isLoading]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesQuery.data]);

  useEffect(() => {
    if (!selectedConversationId || !echo) return;

    const channel = echo.private(`conversation.${selectedConversationId}`);
    channel.listen('MessageSent', () => {
      messagesQuery.refetch();
    });

    return () => {
      channel.stopListening('MessageSent');
    };
  }, [selectedConversationId, messagesQuery]);

  const conversationRows = useMemo(
    () =>
      (conversationsQuery.data ?? []).map((row) => ({
        id: row.id,
        title: row.store?.name ?? row.buyer?.name ?? `Conversation ${row.id}`,
      })),
    [conversationsQuery.data],
  );

  const activeMessages: Message[] = useMemo(
    () =>
      [...(messagesQuery.data ?? [])].map((row: any) => ({
        id: row.id,
        text: row.message,
        mine: row.sender_id === user?.id || row.user_id === user?.id || row.is_optimistic,
        time: new Date(row.created_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        status: (row.is_optimistic ? 'sending' : (row.read_at ? 'read' : 'sent')) as any,
      })),
    [messagesQuery.data, user?.id],
  );

  if (conversationsQuery.isError) return <ErrorState message="Gagal memuat conversation." onRetry={() => conversationsQuery.refetch()} />;

  if (conversationsQuery.isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-[280px_1fr]">
        <div className="space-y-px bg-border border border-border">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
        <div className="border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <div className="space-y-3">
             <Skeleton className="h-12 w-2/3" />
             <Skeleton className="h-12 w-1/2 self-end" />
             <Skeleton className="h-12 w-3/4" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="grid gap-0 md:grid-cols-[320px_1fr] h-[75vh] md:h-[80vh] border border-border bg-background overflow-hidden shadow-2xl">
        {/* Left Sidebar: List */}
        <div className="border-r border-border flex flex-col bg-muted/10 h-full overflow-hidden">
          <div className="p-6 border-b border-border bg-background/50 backdrop-blur-md">
            <h1 className="text-xl font-black uppercase tracking-tighter">Pesan</h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 italic">Percakapan Aktif</p>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <ConversationList conversations={conversationRows} activeId={selectedConversationId} onSelect={setActiveId} />
          </div>
        </div>
  
        {/* Right Area: Conversation */}
        <section className="flex flex-col bg-background h-full overflow-hidden relative">
          {selectedConversationId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 px-6 border-b border-border bg-background/50 backdrop-blur-md flex items-center justify-between z-10">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-tight">
                    {conversationRows.find(c => c.id === selectedConversationId)?.title || 'Chat'}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1 italic">Online</span>
                  </div>
                </div>
              </div>

              {/* Messages Canvas */}
              <div 
                ref={scrollRef} 
                className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 bg-zinc-50/50"
              >
                {activeMessages.length > 0 ? (
                  activeMessages.map((message) => (
                    <ChatBubble 
                      key={message.id} 
                      mine={message.mine} 
                      message={message.text} 
                      time={message.time} 
                      status={message.status} 
                    />
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30 grayscale">
                    <MessageSquare className="h-12 w-12 mb-4 text-zinc-300" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Kirim pesan pertama Anda</p>
                  </div>
                )}
              </div>
  
              {/* Input Area */}
              <div className="p-4 md:p-6 bg-background border-t border-border mt-auto">
                <ChatInput
                  onSend={async (value) => {
                    await sendMessage({ conversationId: selectedConversationId, message: value });
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-zinc-50/30">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                 <MessageSquare className="h-10 w-10 text-zinc-300" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Mulai Percakapan</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] max-w-[240px]">
                Pilih salah satu kontak di menu kiri untuk mulai bertanya atau bernegosiasi.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
