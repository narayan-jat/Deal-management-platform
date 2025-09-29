import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import KanbanBoard from "@/components/builder-dashboard/KanbanBoard";
import { useDashboard } from "@/hooks/useDashboard";
import { DealCardType } from "@/types/deal/DealCard";
import DotLoader from "@/components/ui/loader";
import { ROUTES } from "@/config/routes";
import { useSearch } from "@/context/SearchProvider";
import { useCreateDeal } from "@/context/CreateDealProvider";
import { columnKeyToEnum } from "@/Constants";
const columnNames = {
  new: "New",
  inProgress: "In Progress",
  negotiation: "Negotiation",
  completed: "Completed",
};

export default function Dashboard() {
  const { initialDeals: originalDeals, loading, apiError: getDealsError, handleUpdateDeals, handleUpdateDealStatus } = useDashboard();
  const { filteredDeals, searchQuery, clearSearch } = useSearch();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setRefreshCallback } = useCreateDeal();
  const [dragTimeout, setDragTimeout] = useState<NodeJS.Timeout | null>(null);
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragTimeout) {
        clearTimeout(dragTimeout);
      }
    };
  }, [dragTimeout]);

  useEffect(() => {
    setRefreshCallback(() => handleUpdateDeals);
  }, []);

  // Use filtered deals when search is active, otherwise use original deals
  const deals = searchQuery.trim() ? 
    Object.keys(originalDeals).reduce((acc, key) => {
      acc[key as keyof typeof originalDeals] = originalDeals[key as keyof typeof originalDeals].filter(deal =>
        filteredDeals.some(filteredDeal => filteredDeal.id === deal.id)
      );
      return acc;
    }, {} as typeof originalDeals) : 
    originalDeals;

  const findColumn = (id: string) => {
    return Object.keys(deals).find((key) =>
      deals[key as keyof typeof deals].some((item) => item.id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    
    // Clear any existing timeout
    if (dragTimeout) {
      clearTimeout(dragTimeout);
    }
    
    // Set a timeout to reset drag state if not completed within 5 seconds
    const timeout = setTimeout(() => {
      setActiveId(null);
      setOverId(null);
    }, 5000); // 5 seconds
    
    setDragTimeout(timeout);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string || null);
  };


  const handleViewDeal = (deal: DealCardType) => {
    // Store the deal data temporarily so ViewDealPage can access it
    sessionStorage.setItem('viewDealData', JSON.stringify(deal));
    navigate(`${ROUTES.DEALS}/${deal.id}`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Clear the drag timeout
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      setDragTimeout(null);
    }
    
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const sourceColumn = findColumn(active.id as string);
    const overId = over.id as string;

    // If dropped over another card, find the column it's in
    const targetColumn =
      deals[overId as keyof typeof deals] !== undefined
        ? overId // it's a column
        : findColumn(overId as string); // it's a card — find its column

    if (!sourceColumn || !targetColumn || sourceColumn === targetColumn) {
      return;
    }

    const sourceItems = [...deals[sourceColumn]];
    const draggedItem = sourceItems.find((item) => item.id === active.id);
    if (!draggedItem) {
      return;
    }

    const updatedSource = sourceItems.filter((item) => item.id !== active.id);
    const updatedTarget = [...deals[targetColumn as keyof typeof deals], {...draggedItem, status: columnKeyToEnum[targetColumn as keyof typeof columnKeyToEnum]}];

    // also update the deal status for the dragged item in kanban board.
    // Update the deals
    handleUpdateDeals({
      ...deals,
      [sourceColumn]: updatedSource,
      [targetColumn]: updatedTarget,
    });

    // Update the deal status
    handleUpdateDealStatus(draggedItem.id, targetColumn as keyof typeof columnNames, sourceColumn as keyof typeof columnNames);

    // Show success toast
    toast.success(
      `Moved "${draggedItem.title}" from ${columnNames[sourceColumn as keyof typeof columnNames]} to ${columnNames[targetColumn as keyof typeof columnNames]}`,
      {
        duration: 3000,
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <DotLoader />
      </div>
    );
  }

  return (
    <div className="lg:p-6">
      <h1 className="text-2xl font-bold mb-4">GoDex Deal Pipeline</h1>
      
      {/* Search Results Indicator */}
      {searchQuery.trim() && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 mb-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">
                Search results for "{searchQuery}"
              </span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} found
              </span>
            </div>
            <button
              onClick={clearSearch}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      <KanbanBoard
        deals={deals}
        activeId={activeId}
        overId={overId}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onEdit={(dealId: string) => {
          navigate(`${ROUTES.EDIT_DEAL.replace(':dealId', dealId)}`);
        }}
        onView={handleViewDeal}
        onMemberDeleted={() => {
          // Individual deal refresh is handled by the DealCard component
          // This callback can be used for any additional cleanup if needed
        }}
      />

    </div>
  );
}