import { cn } from '@/lib/utils';

type Conversation = { id: number; title: string; unread?: number };

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="bg-background h-full">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            "flex w-full items-center justify-between border-b border-border px-6 py-5 text-left transition-all group",
            activeId === conv.id ? "bg-black text-white" : "bg-white hover:bg-zinc-50"
          )}
          type="button"
        >
          <div className="flex flex-col gap-0.5">
            <span className={cn("text-[11px] font-black uppercase tracking-tight", activeId === conv.id ? "text-white" : "text-black")}>
              {conv.title}
            </span>
            <span className={cn("text-[9px] font-bold uppercase tracking-widest", activeId === conv.id ? "text-zinc-400" : "text-zinc-400")}>
              Percakapan Terakhir
            </span>
          </div>
          {conv.unread ? (
            <span className={cn("h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-black", activeId === conv.id ? "bg-white text-black" : "bg-black text-white")}>
              {conv.unread}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
