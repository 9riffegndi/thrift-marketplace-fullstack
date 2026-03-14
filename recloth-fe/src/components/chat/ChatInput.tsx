"use client";

import { useState } from "react";

export default function ChatInput({ onSend }: { onSend: (value: string) => void }) {
  const [text, setText] = useState("");

  return (
    <form
      className="flex gap-4 p-2 items-center"
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
      }}
    >
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="flex-1 h-14 bg-zinc-100 border-none outline-none px-6 text-[11px] font-bold uppercase tracking-widest placeholder:text-zinc-400 focus:bg-white focus:ring-1 focus:ring-black transition-all"
        placeholder="TULIS PESAN ANDA..."
      />
      <button 
        type="submit" 
        className="h-14 px-8 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-zinc-800 active:scale-[0.95]"
      >
        Kirim
      </button>
    </form>
  );
}
