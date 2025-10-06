import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MatrixMessage } from "@/types/Matrix";

type ChatWindowProps = {
  currentUserId: string;
  title: string;
  avatar?: string;
  messages: MatrixMessage[];
  onSend: (text: string) => Promise<boolean>;
  onBack?: () => void; // mobile back
  getSenderName: (senderId: string) => Promise<string>;
};

type MessageGroup = {
  senderId: string;
  senderName: string;
  timestamp: number;
  messages: MatrixMessage[];
};

export default function ChatWindow({ currentUserId, title, avatar, messages, onSend, onBack, getSenderName }: ChatWindowProps) {
  const [text, setText] = React.useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [senderNamesCache, setSenderNamesCache] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Group messages based on sender, time gap, and date changes
  const messageGroups = useMemo(() => {
    if (messages.length === 0) return [];

    const groups: MessageGroup[] = [];
    let currentGroup: MessageGroup | null = null;

    messages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp);
      const isNewDay = index === 0 || 
        new Date(messages[index - 1].timestamp).toDateString() !== messageDate.toDateString();

      // Check if we need to start a new group
      const shouldStartNewGroup = 
        !currentGroup ||
        currentGroup.senderId !== message.sender ||
        isNewDay ||
        (index > 0 && 
         Math.abs(message.timestamp - messages[index - 1].timestamp) >= 60000); // 1 minute = 60000ms

      if (shouldStartNewGroup) {
        // Close previous group if exists
        if (currentGroup) {
          groups.push(currentGroup);
        }

        // Start new group
        currentGroup = {
          senderId: message.sender,
          senderName: message.sender === currentUserId ? 'You' : message.sender,
          timestamp: message.timestamp,
          messages: [message]
        };
      } else {
        // Add to current group
        currentGroup!.messages.push(message);
      }
    });

    // Add the last group
    if (currentGroup) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages, currentUserId]);

  // Resolve sender names for all groups
  useEffect(() => {
    const resolveNames = async () => {
      const newCache = new Map(senderNamesCache);
      let hasChanges = false;

      for (const group of messageGroups) {
        if (group.senderId === currentUserId) continue; // Skip current user
        
        if (!newCache.has(group.senderId)) {
          try {
            const name = await getSenderName(group.senderId);
            newCache.set(group.senderId, name);
            hasChanges = true;
          } catch (error) {
            // Fallback to sender ID
            newCache.set(group.senderId, group.senderId);
            hasChanges = true;
          }
        }
      }

      if (hasChanges) {
        setSenderNamesCache(newCache);
      }
    };

    resolveNames();
  }, [messageGroups, getSenderName, currentUserId, senderNamesCache]);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim().length === 0 || isSending) return;
      handleSend();
    }
  };

  const handleSend = async () => {
    if (text.trim().length === 0 || isSending) return;
    
    setIsSending(true);
    const success = await onSend(text.trim());
    if (success) {
      setText("");
    }
    setIsSending(false);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Render messages with proper grouping and date dividers
  const renderMessages = () => {
    if (messageGroups.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          <p className="text-sm">No messages yet</p>
          <p className="text-xs mt-1">Start the conversation!</p>
        </div>
      );
    }

    const elements: React.ReactNode[] = [];
    let lastDate: string | null = null;

    messageGroups.forEach((group, groupIdx) => {
      const groupDate = formatDate(group.timestamp);
      
      // Add date separator if date changed
      if (groupDate !== lastDate) {
        elements.push(
          <div key={`date-${groupDate}-${groupIdx}`} className="flex items-center justify-center py-2">
            <div className="bg-gray-200 rounded-full px-3 py-1">
              <span className="text-xs text-gray-600 font-medium">{groupDate}</span>
            </div>
          </div>
        );
        lastDate = groupDate;
      }
      
      // Get resolved sender name
      const displayName = group.senderId === currentUserId 
        ? 'You' 
        : (senderNamesCache.get(group.senderId) || group.senderId);
      
      // Add message group
      elements.push(
        <div key={`group-${groupIdx}`} className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              {getInitials(displayName)}
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 min-w-0">
            {/* Sender name and timestamp for the group */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-gray-900">
                {displayName}
              </span>
              <span className="text-xs text-gray-900">
                {formatTime(group.timestamp)}
              </span>
            </div>
            
            {/* Message content */}
            <div className="space-y-1">
              {group.messages.map((msg, msgIdx) => (
                <div key={msg.eventId} className="text-sm text-gray-900 leading-relaxed">
                  {msg.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    });
    
    return elements;
  };

  return (
    <section className="flex-1 flex flex-col bg-white h-full">
      {/* Header - Fixed */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 h-14 border-b bg-white">
        <button className="md:hidden p-2 -ml-2" onClick={onBack} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <img
            src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}`}
            alt={title}
            className="h-8 w-8 rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold leading-tight">{title}</h3>
        </div>
      </header>

      {/* Messages Area - Scrollable */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 space-y-4 min-h-0"
      >
        {renderMessages()}
      </div>

      {/* Input Area - Fixed */}
      <footer className="flex-shrink-0 border-t bg-white p-4">
        <div className="flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 h-11"
            disabled={isSending}
          />
          <Button 
            onClick={handleSend}
            className="h-11 px-4" 
            aria-label="Send"
            disabled={!text.trim() || isSending}
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </footer>
    </section>
  );
} 