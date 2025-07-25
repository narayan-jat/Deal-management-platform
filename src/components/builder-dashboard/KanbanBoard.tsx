import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
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

const columnNames = {
  new: "New",
  inProgress: "In Progress",
  negotiation: "Negotiation",
  completed: "Completed",
};

export default function KanbanBoard() {
  const { initialDeals: deals, loading, apiError: getDealsError, handleUpdateDeals } = useKanbanBoard();
  const [dealId, setDealId] = useState<string | null>(null);
  const { handleCreateDeal, handleEditDeal, apiError: createDealError } = useCreateEditDeal();
  const [isCreateEditFormOpen, setIsCreateEditFormOpen] = useState<boolean>(false);
  const [columnSelected, setColumnSelected] = useState<string>("new");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const sensors = useSensors(useSensor(PointerSensor));

  const findColumn = (id: string) => {
    return Object.keys(deals).find((key) =>
      deals[key as keyof typeof deals].some((item) => item.id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string || null);
  };

  const handleCreatedEditForm = (dealId: string | null) => {
    if (dealId) {
      // Get the deal from deal who's id is dealId
      const deal = Object.values(deals)
        .flat()
        .find((deal) => deal.id === dealId);
      if (deal) {
        return deal;
      }
    }
    else {
      return {
        status: columnKeyToEnum[columnSelected as keyof typeof columnKeyToEnum]
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const sourceColumn = findColumn(active.id as string);
    const overId = over.id as string;

    // If dropped over another card, find the column it's in
    const targetColumn =
      deals[overId as keyof typeof deals] !== undefined
        ? overId // it's a column
        : findColumn(overId as string); // it's a card — find its column

    if (!sourceColumn || !targetColumn || sourceColumn === targetColumn) return;

    const sourceItems = [...deals[sourceColumn]];
    const draggedItem = sourceItems.find((item) => item.id === active.id);
    if (!draggedItem) return;

    const updatedSource = sourceItems.filter((item) => item.id !== active.id);
    const updatedTarget = [...deals[targetColumn as keyof typeof deals], draggedItem];

    handleUpdateDeals({
      ...deals,
      [sourceColumn]: updatedSource,
      [targetColumn]: updatedTarget,
    });

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
                  ({cards.length})
                </span>
              </h3>

              <DroppableColumn
                id={key}
                isOver={overId === key}
                isActive={activeId !== null}
              >
                <SortableContext items={cards.map((c: DealCardType) => c.id)} strategy={verticalListSortingStrategy}>
                  {cards.map((card: DealCardType) => (
                    <SortableCardWrapper
                      key={card.id}
                      deal={card}
                      isDragging={activeId === card.id}
                      onEdit={() => {
                        setDealId(card.id);
                        setMode("edit");
                        setIsCreateEditFormOpen(true);
                      }}
                    />
                  ))}
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
          onSubmit={handleCreateDeal}
        />
      )}
    </>
  );
}
