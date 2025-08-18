import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MatrixRoom } from "@/types/Matrix";

type ChatListProps = {
  items: MatrixRoom[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  onOpenNew: () => void;
};

export default function ChatList({ items, activeId, onSelect, onOpenNew }: ChatListProps) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-[320px] lg:w-[360px] border-r bg-white">
      <div className="p-3 border-b flex items-center justify-between">
        <h2 className="font-semibold">Messages</h2>
        <Button size="sm" onClick={onOpenNew}>New Message</Button>
      </div>

      <div className="flex-1 overflow-auto">
        {items.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No conversations yet.</div>
        ) : (
          <ul className="divide-y">
            {items.map((chat) => (
              <li key={chat.roomId}>
                <button
                  className={cn(
                    "w-full flex gap-3 items-start px-3 py-3 hover:bg-accent text-left",
                    activeId === chat.roomId && "bg-accent"
                  )}
                  onClick={() => onSelect(chat.roomId)}
                >
                  <img
                    src={chat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}`}
                    alt={chat.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{chat.name}</p>
                      {chat.unreadMessages ? (
                        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] h-5 px-2">
                          {chat.unreadMessages}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage || ""}
                    </p>
                    {chat.lastMessageDate && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">{chat.lastMessageDate.toLocaleString()}</p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
} 