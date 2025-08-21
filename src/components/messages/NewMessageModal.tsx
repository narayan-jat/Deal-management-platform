import React, { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MatrixUser } from "@/types/Matrix";
import { useDirectChat } from "@/hooks/useDirectChat";
import { useDirectChats } from "@/hooks/useDirectChats";
import DotLoader from "@/components/ui/loader";

type NewMessageModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allowMultiple?: boolean;
};

export default function NewMessageModal({
  isOpen,
  onOpenChange,
  allowMultiple = true,
}: NewMessageModalProps) {
  const {
    query,
    selected,
    highlightIndex,
    isSearching,
    availableUsers,
    canStart,
    addUser,
    removeUser,
    handleKeyDown,
    updateQuery,
    resetState,
    setHighlight,
  } = useDirectChat();

  const { startDirectChat } = useDirectChats();

  // Reset state on open/close
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const handleUserAdd = (user: MatrixUser) => {
    addUser(user, allowMultiple);
  };

  const handleKeyDownWrapper = (e: React.KeyboardEvent<HTMLInputElement>) => {
    handleKeyDown(e, allowMultiple);
  };

  const startChat = async () => {
    if (!canStart) return;
    // Pass array of users
    await startDirectChat(selected);
    onOpenChange(false);
    resetState();
  };

  const handleClose = () => {
    onOpenChange(false);
    resetState();
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
              onChange={(e) => updateQuery(e.target.value)}
              onKeyDown={handleKeyDownWrapper}
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
            query.length > 0 && (
              availableUsers.length > 0 ? (
                <div className="max-h-56 overflow-auto rounded-md border">
                  {availableUsers.map((user, idx) => (
                    <button
                      key={user.matrixUserId}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-accent",
                        idx === highlightIndex && "bg-accent"
                      )}
                      onMouseEnter={() => setHighlight(idx)}
                      onClick={() => handleUserAdd(user)}
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
              ) : (
                <div className="max-h-56 overflow-auto rounded-md border p-4 text-center text-muted-foreground">
                  No users found matching "{query}"
                </div>
              )
            )
          )}
        </div>

        <div className="px-5 py-4 border-t flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => handleClose()}>Cancel</Button>
          <Button onClick={startChat} disabled={!canStart}>Start Chat</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 