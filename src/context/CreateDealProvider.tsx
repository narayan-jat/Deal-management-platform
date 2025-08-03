import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DealStatus } from '@/types/deal/Deal.enums';

interface CreateDealContextType {
  isCreateDealModalOpen: boolean;
  openCreateDealModal: () => void;
  closeCreateDealModal: () => void;
  selectedColumn: string;
  setSelectedColumn: (column: string) => void;
  setRefreshCallback: (callback: () => void) => void;
  triggerRefresh: () => void;
}

const CreateDealContext = createContext<CreateDealContextType | undefined>(undefined);

interface CreateDealProviderProps {
  children: ReactNode;
}

export function CreateDealProvider({ children }: CreateDealProviderProps) {
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("new");
  const [refreshCallback, setRefreshCallback] = useState<(() => void) | null>(null);

  const openCreateDealModal = () => {
    setIsCreateDealModalOpen(true);
  };

  const closeCreateDealModal = () => {
    setIsCreateDealModalOpen(false);
  };

  const triggerRefresh = () => {
    if (refreshCallback) {
      refreshCallback();
    }
  };

  const value = {
    isCreateDealModalOpen,
    openCreateDealModal,
    closeCreateDealModal,
    selectedColumn,
    setSelectedColumn,
    setRefreshCallback,
    triggerRefresh,
  };

  return (
    <CreateDealContext.Provider value={value}>
      {children}
    </CreateDealContext.Provider>
  );
}

export function useCreateDeal() {
  const context = useContext(CreateDealContext);
  if (context === undefined) {
    throw new Error('useCreateDeal must be used within a CreateDealProvider');
  }
  return context;
} 