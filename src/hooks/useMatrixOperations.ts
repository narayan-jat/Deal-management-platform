import { useCallback } from 'react';
import { useMatrix } from '@/context/MatrixContext';
import { MatrixRoom, MatrixMessage } from '@/types/Matrix';

export function useMatrixOperations() {
  const { state, createRoom, sendMessage, loadMessages, loadRooms } = useMatrix();

  const createNewRoom = useCallback(async (
    name: string, 
    topic?: string, 
    isPublic: boolean = false
  ): Promise<MatrixRoom> => {
    try {
      const roomId = await createRoom(name, topic);
      
      const newRoom: MatrixRoom = {
        roomId,
        name,
        topic,
        memberCount: 1,
        isPublic,
      };
      
      return newRoom;
    } catch (error) {
      throw new Error(`Failed to create room: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [createRoom]);

  const sendTextMessage = useCallback(async (
    roomId: string, 
    content: string
  ): Promise<void> => {
    if (!content.trim()) {
      throw new Error('Message cannot be empty');
    }
    
    try {
      await sendMessage(roomId, content.trim());
    } catch (error) {
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [sendMessage]);

  const refreshRoomMessages = useCallback(async (roomId: string): Promise<MatrixMessage[]> => {
    try {
      await loadMessages(roomId);
      return state.messages[roomId] || [];
    } catch (error) {
      throw new Error(`Failed to load messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [loadMessages, state.messages]);

  const refreshRooms = useCallback(async (): Promise<MatrixRoom[]> => {
    try {
      await loadRooms();
      return state.rooms;
    } catch (error) {
      throw new Error(`Failed to load rooms: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [loadRooms, state.rooms]);

  const getRoomById = useCallback((roomId: string): MatrixRoom | undefined => {
    return state.rooms.find(room => room.roomId === roomId);
  }, [state.rooms]);

  const getRoomMessages = useCallback((roomId: string): MatrixMessage[] => {
    return state.messages[roomId] || [];
  }, [state.messages]);

  const isUserInRoom = useCallback((roomId: string): boolean => {
    return state.rooms.some(room => room.roomId === roomId);
  }, [state.rooms]);

  const getUnreadMessageCount = useCallback((roomId: string): number => {
    // This is a simplified implementation
    // In a real app, you'd track read/unread status
    const messages = state.messages[roomId] || [];
    return messages.length;
  }, [state.messages]);

  const searchRooms = useCallback((query: string): MatrixRoom[] => {
    if (!query.trim()) return state.rooms;
    
    const lowercaseQuery = query.toLowerCase();
    return state.rooms.filter(room => 
      room.name.toLowerCase().includes(lowercaseQuery) ||
      (room.topic && room.topic.toLowerCase().includes(lowercaseQuery))
    );
  }, [state.rooms]);

  const searchMessages = useCallback((query: string, roomId?: string): MatrixMessage[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    const messagesToSearch = roomId 
      ? state.messages[roomId] || []
      : Object.values(state.messages).flat();
    
    return messagesToSearch.filter(message =>
      message.content.toLowerCase().includes(lowercaseQuery) ||
      message.sender.toLowerCase().includes(lowercaseQuery)
    );
  }, [state.messages]);

  return {
    // State
    rooms: state.rooms,
    messages: state.messages,
    isLoggedIn: state.isLoggedIn,
    currentUserId: state.currentUserId,
    isLoading: state.isLoading,
    error: state.error,
    
    // Operations
    createNewRoom,
    sendTextMessage,
    refreshRoomMessages,
    refreshRooms,
    
    // Getters
    getRoomById,
    getRoomMessages,
    isUserInRoom,
    getUnreadMessageCount,
    
    // Search
    searchRooms,
    searchMessages,
  };
} 