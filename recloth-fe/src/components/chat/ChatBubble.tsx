import { Check, CheckCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatBubble({
  mine,
  message,
  time,
  status = 'sent',
}: {
  mine: boolean;
  message: string;
  time: string;
  status?: 'sending' | 'sent' | 'read' | 'failed';
}) {
  return (
    <div className={cn("flex w-full mb-1", mine ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[85%] md:max-w-[75%] px-5 py-4 relative border",
        mine 
          ? "bg-black text-white border-black" 
          : "bg-white text-black border-zinc-200"
      )}>
        <p className="text-[11px] leading-relaxed font-black uppercase tracking-tight">{message}</p>
        <div className={cn(
          "flex items-center gap-1.5 mt-1 justify-end",
          mine ? "text-background/50" : "text-muted-foreground/60"
        )}>
          <span className="text-[9px] font-medium uppercase tracking-tighter">{time}</span>
          {mine && (
            <div className="flex items-center">
              {status === 'sending' && <Clock className="h-2.5 w-2.5 animate-pulse" />}
              {status === 'sent' && <Check className="h-2.5 w-2.5" />}
              {status === 'read' && <CheckCheck className="h-2.5 w-2.5 text-blue-400" />}
              {status === 'failed' && <span className="text-red-500 text-[10px] font-bold">!</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
