import { useState, useCallback } from 'react';
import { MatrixUserService } from '@/services/MatrixUserService';
import { MatrixUser, MatrixRoom } from '@/types/Matrix';
import { toast } from 'sonner';
import { ErrorService } from '@/services/ErrorService';
import { MatrixService } from '@/services/MatrixService';

export function useDirectChat() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MatrixUser[]>([]);
  const [directChats, setDirectChats] = useState<MatrixRoom[]>([]);
  const [isLoadingDirectChats, setIsLoadingDirectChats] = useState(false);

  /**
   * Search for Matrix users
   */
  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const users = await MatrixUserService.getAllMatrixUsers();  
      
      const matrixUsers = users.map(async (user) => {
        const matrixUser = await MatrixService.getMatrixUserProfile(user.matrix_user_id);
        return matrixUser;
      });

      // Wait for all matrix user profiles to resolve before setting search results
      const resolvedMatrixUsers = await Promise.all(matrixUsers);

      if (resolvedMatrixUsers.length > 0) {
        setSearchResults(resolvedMatrixUsers);
      } else {
        setSearchResults([]);
        toast.info('No Matrix user found to chat with');
      }
    } catch (error) {
      ErrorService.logError(error, 'useDirectChat.searchUsers');
      toast.error('Failed to search for user');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  /**
   * Start a direct chat with a user
   */
  const startDirectChat = useCallback(async (targetUser: MatrixUser): Promise<string | null> => {
    try {
      const roomId = await MatrixService.createRoom({
        name: targetUser.displayName,
        invite: [targetUser.matrixUserId],
      });
      
      // Refresh direct chats list
      await loadDirectChats();
      
      toast.success('Direct chat started');
      return roomId;
    } catch (error) {
      ErrorService.logError(error, 'useDirectChat.startDirectChat');
      toast.error('Failed to start direct chat');
      return null;
    }
  }, []);

  /**
   * Load all direct chats for current user
   */
  const loadDirectChats = useCallback(async () => {
    try {
      setIsLoadingDirectChats(true);
      const chats = await MatrixService.getRooms();
      setDirectChats(chats);
    } catch (error) {
      ErrorService.logError(error, 'useDirectChat.loadDirectChats');
      toast.error('Failed to load direct chats');
    } finally {
      setIsLoadingDirectChats(false);
    }
  }, []);

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    // State
    isSearching,
    searchResults,
    directChats,
    isLoadingDirectChats,
    
    // Actions
    searchUsers,
    startDirectChat,
    loadDirectChats,
    clearSearch,
  };
} 