import { useEffect, useRef, useState, useCallback } from 'react';
import { MatrixClient } from 'matrix-js-sdk';
import { MatrixRoom, MatrixUser } from '@/types/Matrix';
import { MatrixService } from '@/services/MatrixService';
import { ErrorService } from '@/services/ErrorService';

export function useDirectChats() {
  const [rooms, setRooms] = useState<MatrixRoom[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const clientRef = useRef<MatrixClient | null>(null);
  const roomHandlerRef = useRef<((room: any) => void) | null>(null);

  const mapSdkRooms = useCallback((client: MatrixClient): MatrixRoom[] => {
    const sdkRooms = client.getRooms();
    const baseUrl = (client as any).baseUrl;
    return sdkRooms.map((room: any) => ({
      roomId: room.roomId,
      name: room.name || 'Unnamed Room',
      normalizedName: room.normalizedName || null,
      topic: (room as any).topic,
      memberCount: room.getJoinedMemberCount(),
      avatarUrl: room.getAvatarUrl(baseUrl, 40, 40, 'crop', true, false),
      unreadMessages: room.getUnreadNotificationCount('total' as any),
    }));
  }, []);

  const refreshRooms = useCallback(async () => {
    try {
      const client = await MatrixService.initializeClient();
      clientRef.current = client;
      setIsLoading(true);
      const mapped = mapSdkRooms(client);
      setRooms(mapped);
    } catch (error) {
      ErrorService.logError(error, 'useDirectChats.refreshRooms');
    } finally {
      setIsLoading(false);
    }
  }, [mapSdkRooms]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const client = await MatrixService.initializeClient();
        clientRef.current = client;
        setIsLoading(true);
        const mapped = mapSdkRooms(client);
        if (!isMounted) return;
        setRooms(mapped);
        setIsLoading(false);

        // Subscribe to Room events (join/create)
        const onRoom = (room: any) => {
          const baseUrl = (client as any).baseUrl;
          const updated: MatrixRoom = {
            roomId: room.roomId,
            name: room.name || 'Unnamed Room',
            normalizedName: room.normalizedName || null,
            topic: (room as any).topic,
            memberCount: room.getJoinedMemberCount(),
            avatarUrl: room.getAvatarUrl(baseUrl, 40, 40, 'crop', true, false),
            unreadMessages: room.getUnreadNotificationCount('total' as any),
          };
          setRooms((prev) => {
            const exists = prev.some((r) => r.roomId === updated.roomId);
            return exists ? prev.map((r) => (r.roomId === updated.roomId ? updated : r)) : [updated, ...prev];
          });
        };
        (client as any).on('Room', onRoom);
        roomHandlerRef.current = onRoom;
      } catch (error) {
        ErrorService.logError(error, 'useDirectChats.load');
        setIsLoading(false);
      }
    };

    load();

    // Listen for custom room created events (from deal chat)
    const handleRoomCreated = () => {
      if (isMounted) {
        refreshRooms();
      }
    };

    window.addEventListener('matrix-room-created', handleRoomCreated);

    return () => {
      isMounted = false;
      window.removeEventListener('matrix-room-created', handleRoomCreated);
      const client = clientRef.current as any;
      if (client && roomHandlerRef.current) {
        try { client.off('Room', roomHandlerRef.current); } catch {}
      }
      roomHandlerRef.current = null;
    };
  }, [mapSdkRooms, refreshRooms]);

  const startDirectChat = useCallback(async (targets: MatrixUser[]): Promise<string | null> => {
    try {
      if (!targets || targets.length === 0) return null;
      const client = await MatrixService.initializeClient();
      clientRef.current = client;

      const invite = targets.map((t) => t.matrixUserId);
      const displayNames = targets.map((t) => t.displayName || t.matrixUserId);
      const name = displayNames.length === 1 ? displayNames[0] : displayNames.slice(0, 3).join(', ');

      const roomOptions: any = {
        preset: 'public_chat',
        visibility: 'public',
        name,
        invite,
      };
      const result = await (client as any).createRoom(roomOptions);
      const roomId = result?.room_id as string;
      // Update rooms state
      await refreshRooms();
      return roomId || null;
    } catch (error) {
      ErrorService.logError(error, 'useDirectChats.startDirectChat');
      return null;
    }
  }, [refreshRooms]);

  return { rooms, isLoading, refreshRooms, startDirectChat };
} 