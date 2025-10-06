import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatrixClient } from 'matrix-js-sdk';
import { MatrixService } from '@/services/MatrixService';
import { ErrorService } from '@/services/ErrorService';
import { toast } from 'sonner';
import { DealCardType } from '@/types/deal/DealCard';
import { MatrixUserService } from '@/services/MatrixUserService';
import { useAuth } from "@/context/AuthProvider";

export function useDealChat() {
  const navigate = useNavigate();
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { user } = useAuth();
  // Create or get existing chat room for a deal
  const getOrCreateDealRoom = useCallback(async (deal: DealCardType): Promise<string | null> => {
    try {
      setIsCreatingRoom(true);
      const client = await MatrixService.initializeClient();

      // First, try to find existing room by checking if we're already in a room with this deal title
      const existingRoom = await findExistingDealRoom(client, deal.title);
      if (existingRoom) {
        // Room exists, just navigate to it
        navigateToDealChat(existingRoom);
        return existingRoom;
      }

      // Create new room for the deal
      const roomId = await createDealRoom(client, deal);
      if (roomId) {
        // Refresh rooms to ensure the new room appears in the list
        // This will trigger a re-render in components using useDirectChats
        try {
          // Force a refresh by triggering a custom event
          window.dispatchEvent(new CustomEvent('matrix-room-created', { detail: { roomId } }));
        } catch (error) {
          console.warn('Failed to dispatch room created event:', error);
        }
        
        navigateToDealChat(roomId);
        toast.success(`Chat room created for "${deal.title}"`);
        return roomId;
      }

      return null;
    } catch (error) {
      ErrorService.logError(error, 'useDealChat.getOrCreateDealRoom');
      toast.error('Failed to create chat room for deal');
      return null;
    } finally {
      setIsCreatingRoom(false);
    }
  }, [navigate]);

  // Find existing room by deal title
  const findExistingDealRoom = useCallback(async (client: MatrixClient, dealTitle: string): Promise<string | null> => {
    try {
      const rooms = client.getRooms();
      
      // Look for room with matching name (deal title)
      for (const room of rooms) {
        if (room.name.includes(dealTitle)) {
          return room.roomId;
        }
      }
      
      return null;
    } catch (error) {
      ErrorService.logError(error, 'useDealChat.findExistingDealRoom');
      return null;
    }
  }, []);

  // Create new Matrix room for the deal
  const createDealRoom = useCallback(async (client: MatrixClient, deal: DealCardType): Promise<string | null> => {
    try {
      // Extract Matrix user IDs from deal members
      const memberUserIds = deal.members
        .map(member => member.id)
        .filter((userId) => userId !== user?.id); // Filter out any undefined/null values

      // Above memberuserIds are the applicationi user ids get matrix user ids 
      // from matrix user table.

      const matrixUsers = await Promise.all(memberUserIds.map(async (userId) => {
        return await MatrixUserService.getMatrixUser(userId);
      }));
      const matrixUserIds = matrixUsers.map((user) => user.matrix_user_id);
      // filter out any undefined/null values
      const filteredMatrixUserIds = matrixUserIds.filter((id) => id !== null && id !== undefined);

      // Create room options
      const roomOptions: any = {
        preset: 'private_chat',
        visibility: 'private',
        name: deal.title,
        topic: '', // Empty topic as requested
        invite: filteredMatrixUserIds,
      };

      // Create the room
      const result = await (client as any).createRoom(roomOptions);
      const roomId = result?.room_id as string;

      if (filteredMatrixUserIds.length !== matrixUserIds.length) {
        toast.error('Failed to create room - some users were not added to the room, add them manually');
        return null;
      }

      if (!roomId) {
        toast.error('Failed to create room - no room ID returned');
        throw new Error('Failed to create room - no room ID returned');
      }

      // Send a welcome message to the room
      try {
        await client.sendTextMessage(roomId, `Chat room created for deal: ${deal.title}`);
      } catch (error) {
        // Don't fail if welcome message fails
        console.warn('Failed to send welcome message:', error);
      }

      return roomId;
    } catch (error) {
      ErrorService.logError(error, 'useDealChat.createDealRoom');
      throw error;
    }
  }, []);

  // Navigate to the deal chat in Messages page
  const navigateToDealChat = useCallback((roomId: string) => {
    // Navigate to Messages page with the specific room selected
    navigate('/messages');
  }, [navigate]);

  // Handle deal chat button click
  const handleDealChatClick = useCallback(async (deal: DealCardType) => {
    await getOrCreateDealRoom(deal);
  }, [getOrCreateDealRoom]);

  return {
    handleDealChatClick,
    isCreatingRoom,
    getOrCreateDealRoom,
  };
} 