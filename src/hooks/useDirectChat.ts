import { useState, useCallback } from 'react';
import { MatrixUserService } from '@/services/MatrixUserService';
import { MatrixUser } from '@/types/Matrix';
import { toast } from 'sonner';
import { ErrorService } from '@/services/ErrorService';
import { MatrixService } from '@/services/MatrixService';

export function useDirectChat() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MatrixUser[]>([]);

  // State for user selection and navigation
  const [selected, setSelected] = useState<MatrixUser[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(0);
  const [query, setQuery] = useState("");

  // Filter out already-selected users
  const availableUsers = searchResults.filter(
    (u) => !selected.some((s) => s.matrixUserId === u.matrixUserId)
  );

  const canStart = selected.length > 0;

  // Add a user to the selected list
  const addUser = (user: MatrixUser, allowMultiple: boolean = true) => {
    if (!allowMultiple && selected.length >= 1) {
      setSelected([user]);
    } else {
      setSelected((prev) => [...prev, user]);
    }
    setQuery("");
    setHighlightIndex(0);
  };

  // Remove a user from the selected list
  const removeUser = (userId: string) => {
    setSelected((prev) => prev.filter((u) => u.matrixUserId !== userId));
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, allowMultiple: boolean = true) => {
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
        addUser(availableUsers[highlightIndex], allowMultiple);
      }
    }
  };

  // Update query and trigger search
  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.length > 0) {
      searchUsers(newQuery);
    } else {
      // Clear search results when query is empty
      setSearchResults([]);
      setHighlightIndex(0);
    }
  };

  // Reset all state
  const resetState = () => {
    setQuery("");
    setSelected([]);
    setHighlightIndex(0);
    setSearchResults([]);
    setIsSearching(false);
  };

  // Set highlight index (for mouse hover)
  const setHighlight = (index: number) => {
    setHighlightIndex(index);
  };

  // Search for Matrix users
  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const users = await MatrixUserService.getAllMatchingMatrixUsers(query);
      const matrixUsers = users.map(async (user) => {
        const matrixUser = await MatrixService.getMatrixUserProfile(user.matrix_user_id);
        return matrixUser;
      });

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

  return {
    // State
    isSearching,
    searchResults,
    selected,
    highlightIndex,
    query,
    availableUsers,
    canStart,

    // Actions
    searchUsers,
    addUser,
    removeUser,
    handleKeyDown,
    updateQuery,
    resetState,
    setHighlight,
  };
} 