import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MatrixUser } from "@/types/Matrix";
import { useDirectChat } from "@/hooks/useDirectChat";
import DotLoader from "@/components/ui/loader";

type NewMessageModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allowMultiple?: boolean;
  onStartChat: (selectedUsers: MatrixUser[]) => void;
};

export default function NewMessageModal({
  isOpen,
  onOpenChange,
  allowMultiple = true,
  onStartChat,
}: NewMessageModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MatrixUser[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);
  const { searchUsers, isSearching, searchResults } = useDirectChat();
  // Reset state on open/close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelected([]);
      setHighlightIndex(0);
    }
  }, [isOpen]);

  // search users when query changes
  useEffect(() => {
    if (query.length > 0) {
      searchUsers(query);
    }
  }, [query]);

  const availableUsers = useMemo(() => {
    return searchResults.filter(
      (u) => !selected.some((s) => s.matrixUserId === u.matrixUserId) && (query.length === 0 || u.displayName.toLowerCase().includes(query.toLowerCase()))
    );
  }, [selected, query]);

  const canStart = selected.length > 0;

  const addUser = (user: MatrixUser) => {
    if (!allowMultiple && selected.length >= 1) {
      setSelected([user]);
      return;
    }
    setSelected((prev) => [...prev, user]);
    setQuery("");
    setHighlightIndex(0);
  };

  const removeUser = (userId: string) => {
    setSelected((prev) => prev.filter((u) => u.matrixUserId !== userId));
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Backspace" && query.length === 0 && selected.length > 0) {
      e.preventDefault();
      setSelected((prev) => prev.slice(0, prev.length - 1));
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, availableUsers.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (availableUsers[highlightIndex]) {
        addUser(availableUsers[highlightIndex]);
      }
    }
  };

  const startChat = () => {
    if (!canStart) return;
    onStartChat(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden">
        <div className="border-b px-5 py-4">
          <h3 className="text-base font-semibold">New Message</h3>
          <p className="text-sm text-muted-foreground mt-1">Search users and add recipients to start a conversation.</p>
        </div>

        <div className="px-5 pt-4 pb-3 space-y-3">
          {/* Tags row */}
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {selected.map((user) => (
                <span
                  key={user.matrixUserId}
                  className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-xs"
                >
                  {user.displayName}
                  <button
                    type="button"
                    className="ml-1 rounded hover:bg-black/10 p-0.5"
                    onClick={() => removeUser(user.matrixUserId)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search bar row */}
          <div className="flex items-center gap-2 rounded-md border border-input bg-background p-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a name..."
              className="border-0 shadow-none focus:ring-0 px-0"
            />
          </div>

          {/* available users show loader if searching in place of available users */}
          {isSearching ? (
            <div className="max-h-56 overflow-auto rounded-md border">
              <div className="flex items-center justify-center h-full">
                <DotLoader />
              </div>
            </div>
          ) : (
            availableUsers.length > 0 && (
              <div className="max-h-56 overflow-auto rounded-md border">
                {availableUsers.map((user, idx) => (
                  <button
                    key={user.matrixUserId}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent",
                      idx === highlightIndex && "bg-accent"
                    )}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    onClick={() => addUser(user)}
                    type="button"
                  >
                    <img
                      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}`}
                      alt={user.displayName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium">{user.displayName}</span>
                  </button>
                ))}
              </div>
            )
          )}
        </div>

        <div className="px-5 py-4 border-t flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={startChat} disabled={!canStart}>Start Chat</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 