import { ErrorService } from "@/services/ErrorService";
import { MatrixUserService } from "@/services/MatrixUserService";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { MatrixClient } from "matrix-js-sdk";
import { toast } from "sonner";
import { MatrixCreateRoomOptions, MatrixRoom } from "@/types/Matrix";
import { MatrixService } from "@/services/MatrixService";
import { MatrixMessage } from "@/types/Matrix";
import { useDirectChat } from "./useDirectChat";


export function useMessages() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<MatrixRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<MatrixRoom | null>(null);
  const [messages, setMessages] = useState<MatrixMessage[]>([]);
  const [isFetchingRooms, setIsFetchingRooms] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const { directChats, isLoadingDirectChats, startDirectChat, searchUsers, isSearching, searchResults } = useDirectChat();


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsFetchingRooms(true);
        const rooms = await MatrixService.getRooms();
        console.log("rooms", rooms);
        setRooms(rooms);
      } catch (error) {
        ErrorService.logError(error, "useMessages.fetchRooms");
        toast.error("Failed to fetch rooms");
      } finally {
        setIsFetchingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  // add direct chats to the rooms
  useEffect(() => {
    if (directChats) {
      setRooms([...rooms, ...directChats]);
    }
  }, [directChats]);

  const handleCreateRoom = async (roomData: MatrixCreateRoomOptions) => {
    try {
      setIsCreatingRoom(true);
      const roomId = await MatrixService.createRoom(roomData);
      // fetch rooms again
      const rooms = await MatrixService.getRooms();
      console.log("created rooms", rooms);
      setRooms(rooms);
      return roomId;
    } catch (error) {
      ErrorService.logError(error, "useMessages.handleCreateRoom");
      toast.error("Failed to create room");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  return {
    rooms,
    currentRoom,
    messages,
    isFetchingRooms,
    setCurrentRoom,
    setMessages,
    handleCreateRoom,
    isCreatingRoom,
    startDirectChat,
    searchUsers,
    isSearching,
    searchResults,
  };
}