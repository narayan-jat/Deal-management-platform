import React, { useEffect, useMemo, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MatrixMessage } from "@/types/Matrix";
export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: number; // epoch ms
};

type ChatWindowProps = {
  currentUserId: string;
  title: string;
  avatar?: string;
  messages: MatrixMessage[];
  onSend: (text: string) => void;
  onBack?: () => void; // mobile back
};

export default function ChatWindow({ currentUserId, title, avatar, messages, onSend, onBack }: ChatWindowProps) {
  const [text, setText] = React.useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const groups = useMemo(() => {
    const by: Array<{ senderId: string; items: ChatMessage[] }> = [];
    for (const m of messages) {
      const last = by[by.length - 1];
      if (!last || last.senderId !== m.senderId) by.push({ senderId: m.senderId, items: [m] });
      else last.items.push(m);
    }
    return by;
  }, [messages]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim().length === 0) return;
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <section className="flex-1 flex flex-col bg-white">
      <header className="flex items-center gap-3 px-4 h-14 border-b">
        <button className="md:hidden p-2 -ml-2" onClick={onBack} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img
          src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}`}
          alt={title}
          className="h-8 w-8 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-auto bg-gray-50 px-4 py-4">
        {groups.map((group, idx) => {
          const isMe = group.senderId === currentUserId;
          return (
            <div key={idx} className={cn("mb-4 flex", isMe ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[75%] space-y-1", isMe ? "items-end text-right" : "items-start text-left")}>
                {group.items.map((msg) => (
                  <div key={msg.id} className={cn("inline-block rounded-2xl px-3 py-2 text-sm", isMe ? "bg-primary text-primary-foreground" : "bg-white border")}> 
                    <p>{msg.text}</p>
                    <p className={cn("mt-1 text-[10px] opacity-70", isMe ? "text-primary-foreground" : "text-muted-foreground")}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="border-t p-3">
        <div className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="h-11"
          />
          <Button onClick={() => { if (text.trim()) { onSend(text.trim()); setText(""); } }} className="h-11" aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </section>
  );
} 