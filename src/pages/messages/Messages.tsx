import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatList from "@/components/messages/ChatList";
import ChatWindow from "@/components/messages/ChatWindow";
import NewMessageModal from "@/components/messages/NewMessageModal";
import { Button } from "@/components/ui/button";
import { useMessages } from "@/hooks/useMessages";
import { useDirectChats } from "@/hooks/useDirectChats";
import { useMatrix } from "@/hooks/useMatrix";
import { MatrixRoom } from "@/types/Matrix";
import { MatrixRegistrationPopup } from "@/components/messages/MatrixRegistrationPopup";

export default function Messages() {
  const [isNewOpen, setIsNewOpen] = useState(false);
  const location = useLocation();

  // useMessages hook provides all room/message state and actions
  const {
    rooms,
    currentRoomId,
    setCurrentRoomId,
    currentMessages,
    getUnreadCount,
    clearUnread,
    sendMessage,
    getSenderName,
  } = useMessages();

  // Matrix registration and login flow
  const { 
    isMatrixRegistrationPopupOpen, 
    setIsMatrixRegistrationPopupOpen, 
    setMatrixUserId, 
    setMatrixPassword, 
    onRegister 
  } = useMatrix();

  // The activeId is the selected roomId
  const [activeId, setActiveId] = useState<string | null>(null);

  // Handle navigation state from deal cards
  useEffect(() => {
    if (location.state?.selectedRoomId && location.state?.fromDeal) {
      const selectedRoomId = location.state.selectedRoomId;
      
      // Check if the room exists in our rooms list
      const roomExists = rooms.some(room => room.roomId === selectedRoomId);
      
      if (roomExists) {
        // Set both the local activeId and the hook's currentRoomId
        setActiveId(selectedRoomId);
        setCurrentRoomId(selectedRoomId);
        clearUnread(selectedRoomId);
        
        // Clear the navigation state to prevent re-selection on refresh
        window.history.replaceState({}, document.title);
      } else {
        // Room doesn't exist yet, might need to wait for it to load
        // This could happen if the room was just created
        const checkForRoom = setInterval(() => {
          const roomExists = rooms.some(room => room.roomId === selectedRoomId);
          if (roomExists) {
            setActiveId(selectedRoomId);
            setCurrentRoomId(selectedRoomId);
            clearUnread(selectedRoomId);
            window.history.replaceState({}, document.title);
            clearInterval(checkForRoom);
          }
        }, 500);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkForRoom), 10000);
      }
    }
  }, [location.state, rooms, setCurrentRoomId, clearUnread]);

  // When user selects a chat, update both local and hook state
  const handleSelectRoom = (roomId: string) => {
    setActiveId(roomId);
    setCurrentRoomId(roomId);
    clearUnread(roomId);
  };

  // List of rooms to show in the sidebar
  const list: MatrixRoom[] = useMemo(() => rooms, [rooms]);

  // The active room object
  const active = activeId
    ? rooms.find((r) => r.roomId === activeId)
    : null;

  // The messages for the active room
  const activeRoomMessages = activeId === currentRoomId ? currentMessages : [];

  // Send message handler using the hook function
  const handleSendMessage = async (text: string): Promise<boolean> => {
    return await sendMessage(text);
  };

  return (
    <>
      <div className="h-[calc(100vh-64px-48px)] md:h-[calc(100vh-64px-48px)] bg-gray-100 rounded-lg border overflow-hidden flex">
        {/* Left panel - desktop */}
        <ChatList
          items={list}
          activeId={activeId}
          onSelect={handleSelectRoom}
          onOpenNew={() => setIsNewOpen(true)}
          getUnreadCount={getUnreadCount}
        />

        {/* Right panel */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile list when nothing selected */}
          {!active && (
            <div className="md:hidden flex flex-col h-full bg-white">
              <div className="p-3 border-b flex items-center justify-between">
                <h2 className="font-semibold">Messages</h2>
                <Button size="sm" onClick={() => setIsNewOpen(true)}>
                  New Message
                </Button>
              </div>
              <div className="flex-1 overflow-auto">
                <ul className="divide-y">
                  {list.map((chat) => (
                    <li key={chat.roomId}>
                      <button
                        className="w-full flex gap-3 items-start px-3 py-3 hover:bg-accent text-left"
                        onClick={() => handleSelectRoom(chat.roomId)}
                      >
                        <img
                          src={
                            chat.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              chat.name
                            )}`
                          }
                          alt={chat.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{chat.name}</p>
                            {getUnreadCount(chat.roomId) > 0 && (
                              <span className="ml-auto bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                                {getUnreadCount(chat.roomId)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {/* You may want to show last message here if available */}
                            {/* {"No messages yet"} */}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Desktop chat window and mobile when active */}
          {active && (
            <div className="flex-1 flex flex-col min-h-0">
              <ChatWindow
                currentUserId="me"
                title={active.name}
                avatar={active.avatarUrl}
                messages={activeRoomMessages}
                onSend={handleSendMessage}
                onBack={() => setActiveId(null)}
                getSenderName={getSenderName}
              />
            </div>
          )}

          {/* Desktop placeholder when nothing selected */}
          {!active && (
            <div className="hidden md:grid place-items-center h-full">
              <div className="text-center px-6">
                <p className="text-lg font-semibold">
                  Select a conversation to start chatting
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Or create a new message to start a conversation.
                </p>
                <Button className="mt-4" onClick={() => setIsNewOpen(true)}>
                  New Message
                </Button>
              </div>
            </div>
          )}
        </div>

        <NewMessageModal
          isOpen={isNewOpen}
          onOpenChange={setIsNewOpen}
          allowMultiple
        />
      </div>

      {/* Matrix Registration Popup */}
      {isMatrixRegistrationPopupOpen && (
        <MatrixRegistrationPopup
          isOpen={isMatrixRegistrationPopupOpen}
          onClose={() => setIsMatrixRegistrationPopupOpen(false)}
          setMatrixUserId={setMatrixUserId}
          setMatrixPassword={setMatrixPassword}
          onRegister={onRegister}
        />
      )}
    </>
  );
}