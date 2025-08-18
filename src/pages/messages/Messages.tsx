import React from "react";
import ChatList from "@/components/messages/ChatList";
import ChatWindow, { ChatMessage } from "@/components/messages/ChatWindow";
import NewMessageModal from "@/components/messages/NewMessageModal";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { MatrixRoom, MatrixMessage, MatrixUser } from "@/types/Matrix";


export default function Messages() {
  const [isNewOpen, setIsNewOpen] = React.useState(false);
  const { rooms, currentRoom, messages, isFetchingRooms, isCreatingRoom, handleCreateRoom, setCurrentRoom, setMessages } = useMessages();
  const [activeId, setActiveId] = React.useState<string | null>("c1");

  const list: MatrixRoom[] = React.useMemo(
    () => rooms.sort((a, b) => (a.roomId === activeId ? -1 : 0)),
    [rooms, activeId]
  );

  const active = activeId ? rooms.find((r) => r.roomId === activeId) : null;

  const handleSend = (text: string) => {
    if (!activeId) return;
    setMessages((prev) => {
      const now = Date.now();
      const next = { ...prev };
      const conv = next[activeId];
      const newMsg: ChatMessage = { id: `m${now}`, senderId: "me", text, timestamp: now };
      conv.messages = [...conv.messages, newMsg];
      conv.meta.lastMessage = text;
      conv.meta.lastTimestamp = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return next;
    });
  };

  const handleStartChat = (selectedUsers: MatrixUser[]) => {
    const title = selectedUsers.map((u) => u.displayName).join(", ");
    const avatar = selectedUsers.length === 1 ? selectedUsers[0].avatarUrl : undefined;
    const id = `c${Date.now()}`;
  };

  return (
    <>
    <div className="h-[calc(100vh-64px-48px)] md:h-[calc(100vh-64px-48px)] bg-gray-100 rounded-lg border overflow-hidden flex">
      {/* Left panel - desktop */}
      <ChatList
        items={list}
        activeId={activeId}
        onSelect={setActiveId}
        onOpenNew={() => setIsNewOpen(true)}
      />

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile list when nothing selected */}
        {!active && (
          <div className="md:hidden flex flex-col h-full bg-white">
            <div className="p-3 border-b flex items-center justify-between">
              <h2 className="font-semibold">Messages</h2>
              <Button size="sm" onClick={() => setIsNewOpen(true)}>New Message</Button>
            </div>
            <div className="flex-1 overflow-auto">
              <ul className="divide-y">
                {list.map((chat) => (
                  <li key={chat.roomId}>
                    <button
                      className="w-full flex gap-3 items-start px-3 py-3 hover:bg-accent text-left"
                      onClick={() => setActiveId(chat.roomId)}
                    >
                      <img
                        src={chat.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}`}
                        alt={chat.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{chat.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage || ""}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Desktop chat window and mobile when active
        {active && (
          <ChatWindow
            currentUserId="me"
            title={active.name}
            avatar={active.avatarUrl}
            messages={messages}
            onSend={handleSend}
            onBack={() => setActiveId(null)}
          />
        )} */}

        {/* Desktop placeholder when nothing selected */}
        {!active && (
          <div className="hidden md:grid place-items-center h-full">
            <div className="text-center px-6">
              <p className="text-lg font-semibold">Select a conversation to start chatting</p>
              <p className="text-sm text-muted-foreground mt-1">Or create a new message to start a conversation.</p>
              <Button className="mt-4" onClick={() => setIsNewOpen(true)}>New Message</Button>
            </div>
          </div>
        )}
      </div>

      <NewMessageModal
        isOpen={isNewOpen}
        onOpenChange={setIsNewOpen}
        allowMultiple
        onStartChat={handleStartChat}
      />
    </div>
    </>
  );
} 