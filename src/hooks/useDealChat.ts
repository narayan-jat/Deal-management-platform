import { useState, useCallback } from 'react';
import { MatrixDealService, DealRoomOptions, DealMember } from '@/services/MatrixDealService';
import { MatrixRoom } from '@/types/Matrix';
import { toast } from 'sonner';
import { ErrorService } from '@/services/ErrorService';

export function useDealChat() {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [dealRooms, setDealRooms] = useState<MatrixRoom[]>([]);
  const [isLoadingDealRooms, setIsLoadingDealRooms] = useState(false);

  /**
   * Create a new deal room
   */
  const createDealRoom = useCallback(async (options: DealRoomOptions): Promise<string | null> => {
    try {
      setIsCreatingRoom(true);
      
      // Validate required fields
      if (!options.dealTitle.trim()) {
        toast.error('Deal title is required');
        return null;
      }

      if (!options.members || options.members.length === 0) {
        toast.error('At least one member is required');
        return null;
      }

      // Filter members who have Matrix accounts
      const matrixMembers = options.members.filter(member => member.matrixUserId);
      
      if (matrixMembers.length === 0) {
        toast.error('No members have Matrix accounts');
        return null;
      }

      const roomId = await MatrixDealService.createDealRoom(options);
      
      // Refresh deal rooms list
      await loadDealRooms();
      
      toast.success(`Deal room "${options.dealTitle}" created successfully`);
      return roomId;
    } catch (error) {
      ErrorService.logError(error, 'useDealChat.createDealRoom');
      toast.error('Failed to create deal room');
      return null;
    } finally {
      setIsCreatingRoom(false);
    }
  }, []);

  /**
   * Load all deal rooms for current user
   */
  const loadDealRooms = useCallback(async () => {
    try {
      setIsLoadingDealRooms(true);
      const rooms = await MatrixDealService.getDealRooms();
      setDealRooms(rooms);
    } catch (error) {
      ErrorService.logError(error, 'useDealChat.loadDealRooms');
      toast.error('Failed to load deal rooms');
    } finally {
      setIsLoadingDealRooms(false);
    }
  }, []);

  /**
   * Update a deal room
   */
  const updateDealRoom = useCallback(async (
    roomId: string, 
    dealTitle: string, 
    dealDescription?: string
  ): Promise<void> => {
    try {
      await MatrixDealService.updateDealRoom(roomId, dealTitle, dealDescription);
      
      // Refresh deal rooms list
      await loadDealRooms();
      
      toast.success('Deal room updated successfully');
    } catch (error) {
      ErrorService.logError(error, 'useDealChat.updateDealRoom');
      toast.error('Failed to update deal room');
    }
  }, [loadDealRooms]);

  /**
   * Add new members to an existing deal room
   */
  const addMembersToDealRoom = useCallback(async (
    roomId: string, 
    newMembers: DealMember[]
  ): Promise<void> => {
    try {
      await MatrixDealService.addDealMembersToRoom(roomId, newMembers);
      
      // Refresh deal rooms list
      await loadDealRooms();
      
      toast.success('Members added to deal room successfully');
    } catch (error) {
      ErrorService.logError(error, 'useDealChat.addMembersToDealRoom');
      toast.error('Failed to add members to deal room');
    }
  }, [loadDealRooms]);

  /**
   * Remove a member from a deal room
   */
  const removeMemberFromDealRoom = useCallback(async (
    roomId: string, 
    matrixUserId: string
  ): Promise<void> => {
    try {
      await MatrixDealService.removeDealMember(roomId, matrixUserId);
      
      // Refresh deal rooms list
      await loadDealRooms();
      
      toast.success('Member removed from deal room successfully');
    } catch (error) {
      ErrorService.logError(error, 'useDealChat.removeMemberFromDealRoom');
      toast.error('Failed to remove member from deal room');
    }
  }, [loadDealRooms]);

  /**
   * Get deal room by ID
   */
  const getDealRoomById = useCallback((roomId: string): MatrixRoom | undefined => {
    return dealRooms.find(room => room.roomId === roomId);
  }, [dealRooms]);

  return {
    // State
    isCreatingRoom,
    dealRooms,
    isLoadingDealRooms,
    
    // Actions
    createDealRoom,
    loadDealRooms,
    updateDealRoom,
    addMembersToDealRoom,
    removeMemberFromDealRoom,
    getDealRoomById,
  };
} 