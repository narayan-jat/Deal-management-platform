import React, { createContext, useContext, useState, useCallback } from 'react';
import { DealCardType } from '@/types/deal/DealCard';
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchActive: boolean;
  setIsSearchActive: (active: boolean) => void;
  filteredDeals: DealCardType[];
  setAllDeals: (deals: DealCardType[]) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [allDeals, setAllDeals] = useState<DealCardType[]>([]);

  const filteredDeals = useCallback(() => {
    if (!searchQuery.trim()) {
      return allDeals;
    }

    const query = searchQuery.toLowerCase().trim();
    
    return allDeals.filter((deal) => {
      // Search by title
      if (deal.title.toLowerCase().includes(query)) {
        return true;
      }
      
      // Search by industry
      if (deal.industry.toLowerCase().includes(query)) {
        return true;
      }
      
      // search by contributors
      if (deal.members.some((member) => member.name.toLowerCase().includes(query))) {
        return true;
      }

      return false;
    });
  }, [searchQuery, allDeals]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearchActive(false);
  }, []);

  const value: SearchContextType = {
    searchQuery,
    setSearchQuery,
    isSearchActive,
    setIsSearchActive,
    filteredDeals: filteredDeals(),
    setAllDeals,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 