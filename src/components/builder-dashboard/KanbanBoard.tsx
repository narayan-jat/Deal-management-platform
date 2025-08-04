import React, { useState, useEffect } from "react";
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
import "./KanbanBoard.css";
import SortableCardWrapper from "./SortableCardWrapper";
import DroppableColumn from "./DroppableColumn";
import { KanbanBoardColumns } from "@/types/KanbanBoard";
import { DealCardType } from "@/types/deal/DealCard";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/utility/Utility";
import { useCreateDeal } from "@/context/CreateDealProvider";


const columnNames = {
  new: "New",
  inProgress: "In Progress",
  negotiation: "Negotiation",
  completed: "Completed",
};

interface KanbanBoardProps {
  deals: KanbanBoardColumns;
  activeId: string | null;
  overId: string | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onEdit: (dealId: string) => void;
  onView: (deal: DealCardType) => void;
}

export default function KanbanBoard({
  deals,
  activeId,
  overId,
  onDragStart,
  onDragOver,
  onDragEnd,
  onEdit,
  onView
}: KanbanBoardProps) {
  const [dropPosition, setDropPosition] = useState<{ columnId: string; index: number } | null>(null);
  const { setSelectedColumn, openCreateDealModal } = useCreateDeal();

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

  const handleDragOver = (event: DragOverEvent) => {
    onDragOver(event);

    const { active, over } = event;
    if (!over) {
      setDropPosition(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find which column we're over
    const columnId = Object.keys(deals).find(key =>
      deals[key].some(card => card.id === overId) || overId === key
    );

    if (columnId) {
      const columnCards = deals[columnId];
      const overCardIndex = columnCards.findIndex(card => card.id === overId);

      if (overCardIndex !== -1) {
        // We're over a card, determine position
        setDropPosition({ columnId, index: overCardIndex });
      } else {
        // We're over the column itself, put at the end
        setDropPosition({ columnId, index: columnCards.length });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    onDragEnd(event);
    setDropPosition(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    onDragStart(event);
    setDropPosition(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 p-2 sm:p-4 lg:p-6">
        {Object.entries(deals).map(([key, cards]) => (
          <DroppableColumn
            id={key}
            isOver={overId === key}
            isActive={activeId !== null}
          >
            <div
              key={key}
              className={`bg-gray-50 rounded-2xl border p-4 shadow-sm transition-all duration-200 ${overId === key && activeId !== null
                ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50'
                : ''
                }`}
            >
              <h3 className="text-lg font-semibold mb-4">
                {columnNames[key as keyof typeof columnNames]}
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  {cards.length} deals-<DollarSign className="inline-block h-3 w-3" /> {formatCurrency(cards.reduce((acc, card) => acc + card.requestedAmount, 0))}
                </span>
              </h3>
              {/* <DroppableColumn
              id={key}
              isOver={overId === key}
              isActive={activeId !== null}
            > */}
              <SortableContext items={cards.map((c: DealCardType) => c.id)} strategy={verticalListSortingStrategy}>
                {(() => {
                  const itemIds = cards.map((c: DealCardType) => c.id);
                  return cards.map((card: DealCardType, index: number) => (
                    <React.Fragment key={card.id}>
                      {/* Show drop indicator at the top if this is the first card and we're dropping at index 0 */}
                      {dropPosition?.columnId === key && dropPosition.index === 0 && index === 0 && (
                        <div className="text-sm italic text-blue-600 text-center py-3 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 mb-4">
                          Drop here
                        </div>
                      )}

                      <SortableCardWrapper
                        deal={card}
                        isDragging={activeId === card.id}
                        onEdit={() => onEdit(card.id)}
                        onView={() => onView(card)}
                      />

                      {/* Show drop indicator after this card if we're dropping at this position */}
                      {dropPosition?.columnId === key && dropPosition.index === index + 1 && (
                        <div className="text-sm italic text-blue-600 text-center py-3 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50 my-4">
                          Drop here
                        </div>
                      )}
                    </React.Fragment>
                  ));
                })()}
              </SortableContext>

              {/* Show drop indicator at the end if column is empty or we're dropping at the end
              {dropPosition?.columnId === key && dropPosition.index === cards.length && cards.length > 0 && (
                <div className="text-sm italic text-blue-600 text-center py-2 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 mt-3">
                  Drop here
                </div>
              )} */}

              {/* Empty state - only show when no deals and not being dragged over */}
              {cards.length === 0 && overId !== key && (
                <div className="text-sm italic text-gray-400 text-center py-10">
                  No deals in this column
                </div>
              )}

              {/* Show drop indicator when column is empty and being dragged over */}
              {cards.length === 0 && overId === key && activeId !== null && (
                <div className="text-sm italic text-blue-600 text-center py-6 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50">
                  Drop here
                </div>
              )}
              {/* </DroppableColumn> */}

              <button
                onClick={() => {
                  setSelectedColumn(key);
                  openCreateDealModal();
                }}
                className="mt-6 w-full text-sm text-teal-700 border border-teal-600 hover:bg-teal-50 py-3 rounded-xl transition-all duration-200 ease-out hover:scale-[1.02] font-medium shadow-sm"
              >
                + Add Deal
              </button>
            </div>
          </DroppableColumn>
        ))}
      </div>

    </DndContext>
  );
}
