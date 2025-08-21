import { ErrorService } from "@/services/ErrorService";
import { MatrixUserService } from "@/services/MatrixUserService";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { MatrixClient } from "matrix-js-sdk";
import { toast } from "sonner";
import { MatrixCreateRoomOptions, MatrixRoom, MatrixMessage } from "@/types/Matrix";
import { MatrixService } from "@/services/MatrixService";
import { useDirectChats } from "./useDirectChats";

// Responsible for messages per room
// - On load, fetch all messages for all rooms and store them in a Map<roomId, messages[]>
// - Subscribe to Room.timeline for new messages
// - Get unread counts from Matrix API
export function useMessages() {
  const { user } = useAuth();
  const { rooms } = useDirectChats();
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [roomMessagesMap, setRoomMessagesMap] = useState<Map<string, MatrixMessage[]>>(new Map());
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [senderNames, setSenderNames] = useState<Map<string, string>>(new Map());
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map());
  const clientRef = useRef<MatrixClient | null>(null);
  const timelineHandlerRef = useRef<((...args: any[]) => void) | null>(null);

  // Derive current room from id
  const currentRoom: MatrixRoom | null = useMemo(() => {
    if (!currentRoomId) return null;
    return rooms.find((r) => r.roomId === currentRoomId) || null;
  }, [rooms, currentRoomId]);

  // Get sender display name
  const getSenderName = useCallback(async (senderId: string): Promise<string> => {
    // Check if we already have the name cached
    if (senderNames.has(senderId)) {
      return senderNames.get(senderId)!;
    }

    try {
      // Try to get from Matrix profile
      const profile = await MatrixService.getMatrixUserProfile(senderId);
      const displayName = profile.displayName || senderId;
      
      // Cache the name
      setSenderNames(prev => new Map(prev).set(senderId, displayName));
      return displayName;
    } catch (error) {
      // Fallback to sender ID if profile fetch fails
      return senderId;
    }
  }, [senderNames]);

  // Get unread count for a room from Matrix API
  const getUnreadCount = useCallback((roomId: string): number => {
    return unreadCounts.get(roomId) || 0;
  }, [unreadCounts]);

  // Clear unread count for a room (mark as read)
  const clearUnread = useCallback(async (roomId: string) => {
    try {
      const client = await MatrixService.initializeClient();
      const room = client.getRoom(roomId);
      if (room) {
        // Mark room as read by setting the read receipt
        // Use the client's method to mark room as read
        await (client as any).setRoomReadMarkers(roomId, room.getLiveTimeline().getEvents().slice(-1)[0]?.getId() || null);
        // Update local unread count
        setUnreadCounts(prev => {
          const next = new Map(prev);
          next.set(roomId, 0);
          return next;
        });
      }
    } catch (error) {
      ErrorService.logError(error, 'useMessages.clearUnread');
    }
  }, []);

  // Fetch unread counts for all rooms
  const fetchUnreadCounts = useCallback(async (client: MatrixClient) => {
    try {
      const newUnreadCounts = new Map<string, number>();
      
      for (const room of client.getRooms()) {
        const unreadCount = room.getUnreadNotificationCount('total' as any);
        newUnreadCounts.set(room.roomId, unreadCount);
      }
      
      setUnreadCounts(newUnreadCounts);
    } catch (error) {
      ErrorService.logError(error, 'useMessages.fetchUnreadCounts');
    }
  }, []);

  // Fetch messages for all rooms on load/rooms change
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const client = await MatrixService.initializeClient();
        clientRef.current = client;
        if (!rooms || rooms.length === 0) return;

        setIsLoadingMessages(true);
        const newMap = new Map<string, MatrixMessage[]>();
        const results = await Promise.all(
          rooms.map(async (room) => {
            try {
              // Lightweight fetch (uses live timeline)
              const roomMessages = await (async () => {
                const r = client.getRoom(room.roomId);
                if (!r) return [] as MatrixMessage[];
                const events = r.getLiveTimeline().getEvents().slice(-50);
                
                // Use a Set to track unique eventIds and prevent duplicates
                const seenEventIds = new Set<string>();
                const uniqueMessages: MatrixMessage[] = [];
                
                events
                  .filter((e: any) => e.getType?.() === 'm.room.message')
                  .forEach((e: any) => {
                    const eventId = e.getId?.() || `${Date.now()}-${Math.random()}`;
                    
                    // Only add if we haven't seen this eventId before
                    if (!seenEventIds.has(eventId)) {
                      seenEventIds.add(eventId);
                      const content = e.getContent?.() || {};
                      uniqueMessages.push({
                        eventId,
                        roomId: e.getRoomId?.() || room.roomId,
                        sender: e.getSender?.() || '',
                        content: content.body || '',
                        timestamp: e.getTs?.() || Date.now(),
                        type: (content.msgtype as any) || 'm.text',
                      } as MatrixMessage);
                    }
                  });
                
                return uniqueMessages;
              })();
              return { roomId: room.roomId, messages: roomMessages };
            } catch (error) {
              return { roomId: room.roomId, messages: [] as MatrixMessage[] };
            }
          })
        );
        
        if (!isMounted) return;
        
        results.forEach(({ roomId, messages }) => newMap.set(roomId, messages));
        setRoomMessagesMap(newMap);
        
        // Fetch unread counts from Matrix API
        await fetchUnreadCounts(client);
        
        setIsLoadingMessages(false);
      } catch (error) {
        if (!isMounted) return;
        ErrorService.logError(error, 'useMessages.load');
        setIsLoadingMessages(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [rooms, fetchUnreadCounts]);

  // Subscribe to new messages
  useEffect(() => {
    let isMounted = true;

    const subscribe = async () => {
      try {
        const client = await MatrixService.initializeClient();
        clientRef.current = client;

        const onTimeline = async (event: any, room: any) => {
          if (event.getType?.() !== 'm.room.message') return;
          
          const content = event.getContent?.() || {};
          const message: MatrixMessage = {
            eventId: event.getId?.() || `${Date.now()}`,
            roomId: room?.roomId || event.getRoomId?.() || '',
            sender: event.getSender?.() || '',
            content: content.body || '',
            timestamp: event.getTs?.() || Date.now(),
            type: (content.msgtype as any) || 'm.text',
          };

          setRoomMessagesMap((prev) => {
            const next = new Map(prev);
            const existingMessages = next.get(message.roomId) || [];
            
            // Check if message with this eventId already exists
            const messageExists = existingMessages.some(existing => existing.eventId === message.eventId);
            
            if (!messageExists) {
              // Only add if message doesn't already exist
              next.set(message.roomId, [...existingMessages, message]);
            }
            
            return next;
          });

          // Update unread count from Matrix API for the room that received the message
          try {
            const room = client.getRoom(message.roomId);
            if (room) {
              const unreadCount = room.getUnreadNotificationCount('total' as any);
              setUnreadCounts(prev => {
                const next = new Map(prev);
                next.set(message.roomId, unreadCount);
                return next;
              });
            }
          } catch (error) {
            ErrorService.logError(error, 'useMessages.updateUnreadCount');
          }
        };

        client.on('Room.timeline' as any, onTimeline);
        timelineHandlerRef.current = onTimeline;
      } catch (error) {
        if (!isMounted) return;
        ErrorService.logError(error, 'useMessages.subscribe');
      }
    };

    subscribe();

    return () => {
      isMounted = false;
      const client = clientRef.current as any;
      if (client && timelineHandlerRef.current) {
        try { client.off('Room.timeline', timelineHandlerRef.current); } catch {}
      }
      timelineHandlerRef.current = null;
    };
  }, [currentRoomId]);

  // Send message function
  const sendMessage = useCallback(async (text: string) => {
    if (!currentRoomId || !text.trim()) return false;
    
    try {
      const client = await MatrixService.initializeClient();
      await client.sendTextMessage(currentRoomId, text);
      return true;
    } catch (error) {
      ErrorService.logError(error, 'useMessages.sendMessage');
      toast.error('Failed to send message');
      return false;
    }
  }, [currentRoomId]);

  const currentMessages = useMemo(() => {
    if (!currentRoomId) return [] as MatrixMessage[];
    return roomMessagesMap.get(currentRoomId) || [];
  }, [roomMessagesMap, currentRoomId]);

  return {
    rooms,
    currentRoom,
    currentRoomId,
    setCurrentRoomId,
    roomMessagesMap,
    currentMessages,
    isLoadingMessages,
    getUnreadCount,
    clearUnread,
    sendMessage,
    getSenderName,
  };
}