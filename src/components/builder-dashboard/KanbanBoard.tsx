import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "sonner";
import "./KanbanBoard.css";
import CreateEditDealCard from "./CreateEditDealCard";
import SortableCardWrapper from "./SortableCardWrapper";
import DroppableColumn from "./DroppableColumn";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import useCreateEditDeal from "@/hooks/useCreateEditDeal";
import { DealModel } from "@/types/deal/Deal.model";
import { columnKeyToEnum } from "@/Constants";
import { DealCardType } from "@/types/deal/DealCard";
import DotLoader from "../ui/loader";
import { DealStatus } from "@/types/deal/Deal.enums";
import { UploadDocumentForm } from "@/types/deal/Deal.documents";
import { InviteMemberForm } from "@/types/deal/Deal.members";
import { DollarSign, Lock } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { useSearch } from "@/context/SearchProvider";

const columnNames = {
  new: "New",
  inProgress: "In Progress",
  negotiation: "Negotiation",
  completed: "Completed",
};

export default function KanbanBoard() {
  const { initialDeals: originalDeals, loading, apiError: getDealsError, handleUpdateDeals, handleUpdateDealStatus } = useKanbanBoard();
  const { filteredDeals, searchQuery, clearSearch } = useSearch();
  const [dealId, setDealId] = useState<string | null>(null);
  const { handleCreateDeal, handleEditDeal, apiError: createDealError} = useCreateEditDeal();
  const [isCreateEditFormOpen, setIsCreateEditFormOpen] = useState<boolean>(false);
  const [columnSelected, setColumnSelected] = useState<string>("new");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const navigate = useNavigate();
  const [dragTimeout, setDragTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragTimeout) {
        clearTimeout(dragTimeout);
      }
    };
  }, [dragTimeout]);

  // Use filtered deals when search is active, otherwise use original deals
  const deals = searchQuery.trim() ? 
    Object.keys(originalDeals).reduce((acc, key) => {
      acc[key as keyof typeof originalDeals] = originalDeals[key as keyof typeof originalDeals].filter(deal =>
        filteredDeals.some(filteredDeal => filteredDeal.id === deal.id)
      );
      return acc;
    }, {} as typeof originalDeals) : 
    originalDeals;

  // Configure sensors with proper activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start dragging
      },
    }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // Reduced delay for better mobile responsiveness
        tolerance: 8, // Increased tolerance for touch movement
      },
    })
  );

  const findColumn = (id: string) => {
    return Object.keys(deals).find((key) =>
      deals[key as keyof typeof deals].some((item) => item.id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag start:', event.active.id);
    setActiveId(event.active.id as string);
    
    // Clear any existing timeout
    if (dragTimeout) {
      clearTimeout(dragTimeout);
    }
    
    // Set a timeout to reset drag state if not completed within 10 seconds
    const timeout = setTimeout(() => {
      console.log('Drag timeout - resetting state');
      setActiveId(null);
      setOverId(null);
    }, 5000); // 5 seconds
    
    setDragTimeout(timeout);
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log('Drag over:', event.over?.id);
    setOverId(event.over?.id as string || null);
  };

  const handleCreatedEditForm = (dealId: string | null) => {
    if (dealId) {
      // Get the deal from deal who's id is dealId
      const deal = Object.values(deals)
        .flat()
        .find((deal) => deal.id === dealId);
      if (deal) {
        return {
          ...deal,
          members: deal.contributors || []
        }
      }
    }
    else {
      console.log('Creating new deal with status:', columnKeyToEnum[columnSelected as keyof typeof columnKeyToEnum]);
      return {
        status: columnKeyToEnum[columnSelected as keyof typeof columnKeyToEnum],
        documents: [],
        members: []
      }
    }
  };

  const handleOnSubmit = async (deal: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]) => {
    if (mode === "create") {
      const createdDeal = await handleCreateDeal(deal, documents, members);
      if (createdDeal) {
        handleUpdateDeals(null);
      }
      return createdDeal;
    } else {
      const updatedDeal = await handleEditDeal(deal, documents, members);
      if (updatedDeal) {
        handleUpdateDeals(null);
      }
      return updatedDeal;
    }
  }

  const handleViewDeal = (deal: DealCardType) => {
    // Store the deal data temporarily so ViewDealPage can access it
    sessionStorage.setItem('viewDealData', JSON.stringify(deal));
    navigate(`${ROUTES.DEALS}/${deal.id}`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag end:', event.active.id, '->', event.over?.id);
    const { active, over } = event;
    
    // Clear the drag timeout
    if (dragTimeout) {
      clearTimeout(dragTimeout);
      setDragTimeout(null);
    }
    
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) {
      console.log('No valid drop target or same item');
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
      console.log('Invalid column mapping:', { sourceColumn, targetColumn });
      return;
    }

    const sourceItems = [...deals[sourceColumn]];
    const draggedItem = sourceItems.find((item) => item.id === active.id);
    if (!draggedItem) {
      console.log('Dragged item not found');
      return;
    }

    const updatedSource = sourceItems.filter((item) => item.id !== active.id);
    const updatedTarget = [...deals[targetColumn as keyof typeof deals], {...draggedItem, status: columnKeyToEnum[targetColumn as keyof typeof columnKeyToEnum]}];

    console.log('Updating deals:', { sourceColumn, targetColumn, draggedItem: draggedItem.title });

    // also update the deal status for the dragged item in kanban board.
    // Update the deals
    handleUpdateDeals({
      ...deals,
      [sourceColumn]: updatedSource,
      [targetColumn]: updatedTarget,
    });

    // Update the deal status
    handleUpdateDealStatus(draggedItem.id, targetColumn as keyof typeof columnNames);

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
    <>
      {/* Search Results Indicator */}
      {searchQuery.trim() && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
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
              onClick={() => {
                clearSearch();
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      <DndContext
        collisionDetection={closestCenter}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 p-1 sm:p-2 lg:p-6">
          {Object.entries(deals).map(([key, cards]) => (
            <div
              key={key}
              className={`bg-gray-50 rounded-xl border p-3 shadow-sm transition-all duration-200 ${overId === key && activeId !== null
                  ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50'
                  : ''
                }`}
            >
              <h3 className="text-lg font-semibold mb-3">
                {columnNames[key as keyof typeof columnNames]}
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  {cards.length} deals-<DollarSign className="inline-block h-3 w-3" /> {(cards.reduce((acc, card) => acc + card.requestedAmount, 0)).toFixed(2)}
                </span>
              </h3>
              <DroppableColumn
                id={key}
                isOver={overId === key}
                isActive={activeId !== null}
              >
                <SortableContext items={cards.map((c: DealCardType) => c.id)} strategy={verticalListSortingStrategy}>
                  {(() => {
                    const itemIds = cards.map((c: DealCardType) => c.id);
                    console.log(`SortableContext for ${key}:`, itemIds);
                    return cards.map((card: DealCardType) => (
                      <SortableCardWrapper
                        key={card.id}
                        deal={card}
                        isDragging={activeId === card.id}
                        onEdit={() => {
                          setDealId(card.id);
                          setMode("edit");
                          setIsCreateEditFormOpen(true);
                        }}
                        onView={() => handleViewDeal(card)}
                      />
                    ));
                  })()}
                </SortableContext>
                {cards.length === 0 && (
                  <div className="text-sm italic text-gray-400 text-center py-8">
                    {overId === key && activeId !== null
                      ? 'Drop here'
                      : 'No deals in this column'
                    }
                  </div>
                )}
              </DroppableColumn>

              <button
                onClick={() => {
                  setColumnSelected(key);
                  setMode("create");
                  setIsCreateEditFormOpen(true);
                  setDealId(null);
                }}
                className="mt-4 w-full text-sm text-teal-700 border border-teal-600 hover:bg-teal-50 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                + Add Deal
              </button>
            </div>
          ))}
        </div>
      </DndContext>

      {isCreateEditFormOpen && (
        <CreateEditDealCard
          isOpen={isCreateEditFormOpen}
          onClose={() => setIsCreateEditFormOpen(false)}
          mode={mode}
          initialBaseFormData={handleCreatedEditForm(dealId)}
          onSubmit={handleOnSubmit}
        />
      )}
    </>
  );
}
