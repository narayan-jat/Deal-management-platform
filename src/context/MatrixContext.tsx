import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { MatrixService } from '@/services/MatrixService';
import { MatrixRoom, MatrixMessage, MatrixLoginCredentials } from '@/types/Matrix';

interface MatrixState {
  isLoggedIn: boolean;
  currentUserId: string | null;
  rooms: MatrixRoom[];
  messages: Record<string, MatrixMessage[]>;
  isLoading: boolean;
  error: string | null;
}

type MatrixAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOGGED_IN'; payload: { userId: string; rooms: MatrixRoom[] } }
  | { type: 'SET_LOGGED_OUT' }
  | { type: 'SET_ROOMS'; payload: MatrixRoom[] }
  | { type: 'ADD_MESSAGE'; payload: { roomId: string; message: MatrixMessage } }
  | { type: 'SET_MESSAGES'; payload: { roomId: string; messages: MatrixMessage[] } }
  | { type: 'ADD_ROOM'; payload: MatrixRoom };

const initialState: MatrixState = {
  isLoggedIn: false,
  currentUserId: null,
  rooms: [],
  messages: {},
  isLoading: false,
  error: null,
};

function matrixReducer(state: MatrixState, action: MatrixAction): MatrixState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: true,
        currentUserId: action.payload.userId,
        rooms: action.payload.rooms,
        isLoading: false,
        error: null,
      };
    case 'SET_LOGGED_OUT':
      return {
        ...state,
        isLoggedIn: false,
        currentUserId: null,
        rooms: [],
        messages: {},
        error: null,
      };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: [
            ...(state.messages[action.payload.roomId] || []),
            action.payload.message,
          ],
        },
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.roomId]: action.payload.messages,
        },
      };
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
      };
    default:
      return state;
  }
}

interface MatrixContextType {
  state: MatrixState;
  login: (credentials: MatrixLoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  createRoom: (name: string, topic?: string) => Promise<string>;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  loadMessages: (roomId: string) => Promise<void>;
  loadRooms: () => Promise<void>;
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export function MatrixProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(matrixReducer, initialState);

  const login = async (credentials: MatrixLoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { userId } = await MatrixService.login(credentials);
      const rooms = await MatrixService.getRooms();

      dispatch({ type: 'SET_LOGGED_IN', payload: { userId, rooms } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await MatrixService.logout();
      dispatch({ type: 'SET_LOGGED_OUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const createRoom = async (name: string, topic?: string): Promise<string> => {
    try {
      const roomId = await MatrixService.createRoom({ name, topic });
      const newRoom: MatrixRoom = {
        roomId,
        name,
        topic,
        memberCount: 1,
      };
      dispatch({ type: 'ADD_ROOM', payload: newRoom });
      return roomId;
    } catch (error) {
      throw error;
    }
  };

  const sendMessage = async (roomId: string, content: string) => {
    try {
      await MatrixService.sendMessage({ roomId, content });
      // Message will be added via event listener
    } catch (error) {
      throw error;
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      const messages = await MatrixService.getMessages(roomId);
      dispatch({ type: 'SET_MESSAGES', payload: { roomId, messages } });
    } catch (error) {
      throw error;
    }
  };

  const loadRooms = async () => {
    try {
      const rooms = await MatrixService.getRooms();
      dispatch({ type: 'SET_ROOMS', payload: rooms });
    } catch (error) {
      throw error;
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    if (MatrixService.isLoggedIn()) {
      const userId = MatrixService.getCurrentUserId();
      if (userId) {
        loadRooms().then(() => {
          dispatch({ type: 'SET_LOGGED_IN', payload: { userId, rooms: state.rooms } });
        });
      }
    }
  }, []);

  const value: MatrixContextType = {
    state,
    login,
    logout,
    createRoom,
    sendMessage,
    loadMessages,
    loadRooms,
  };

  return <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>;
}

export function useMatrix() {
  const context = useContext(MatrixContext);
  if (context === undefined) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
} 