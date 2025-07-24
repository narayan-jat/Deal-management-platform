import React, { useEffect, useState } from "react";
import { colors } from "@/config/theme";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { v4 as uuidv4 } from "uuid";
import CreateEditDealCard from "./CreateEditDealCard";
import SortableCardWrapper from "./SortableCardWrapper";
import DroppableColumn from "./DroppableColumn";
import { useKanbanBoard } from "@/hooks/useKanbanBoard";
import useCreateEditDeal from "@/hooks/useCreateEditDeal";
import { DealModel } from "@/types/deal/Deal.model";
import { DealStatus } from "@/types/deal/Deal.enums";
import { KanbanBoardColumns } from "@/types/KanbanBoard";

const columnNames = {
  new: "New",
  inProgress: "In Progress",
  negotiation: "Negotiation",
  completed: "Completed",
};

// column key to enum map.
const columnKeyToEnum = {
  new: DealStatus.NEW,
  inProgress: DealStatus.IN_PROGRESS,
  negotiation: DealStatus.NEGOTIATION,
  completed: DealStatus.COMPLETED,
};

export default function KanbanBoard() {
  const { initialDeals } = useKanbanBoard();
  const [initialBaseFormData, setInitialBaseFormData] = useState<Partial<DealModel>>({});
  const [deals, setDeals] = useState(initialDeals);
  const { handleCreateDeal, loading: createDealLoading, apiError: createDealError } = useCreateEditDeal(null);
  const [isCreateEditFormOpen, setIsCreateEditFormOpen] = useState<boolean>(false);
  const [columnSelected, setColumnSelected] = useState<string>("new");
  const sensors = useSensors(useSensor(PointerSensor));

  const findColumn = (id: string) => {
    return Object.keys(deals).find((key) =>
      deals[key as keyof typeof deals].some((item) => item.id === id)
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
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
  
    setDeals({
      ...deals,
      [sourceColumn]: updatedSource,
      [targetColumn]: updatedTarget,
    });
  };
  

  const handleAddDeal = (
    columnKey: string,
    deal: {
      company: string;
      type: string;
      amount: string;
      contact: string;
      status: string;
    }
  ) => {
    const newDeal = { id: uuidv4(), ...deal };
    setDeals((prev) => ({
      ...prev,
      [columnKey]: [...prev[columnKey as keyof typeof deals], newDeal],
    }));
  };

  return (
    <>
      <DndContext collisionDetection={closestCenter} sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {Object.entries(deals).map(([key, cards]) => (
            <div key={key} className="bg-gray-50 rounded-xl border p-3 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">
                {columnNames[key as keyof typeof columnNames]}
              </h3>

              <DroppableColumn id={key}>
                <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {cards.map((card) => (
                    <SortableCardWrapper key={card.id} {...card} />
                  ))}
                </SortableContext>
                {cards.length === 0 && (
                  <div className="text-sm italic text-gray-400">No deals</div>
                )}
              </DroppableColumn>

              <button
                onClick={() => {
                  setColumnSelected(key);
                  setIsCreateEditFormOpen(true);
                  
                }}
                className="mt-4 w-full text-sm text-teal-700 border border-teal-600 hover:bg-teal-50 py-1.5 rounded"
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
          mode="create"
          initialBaseFormData={{
            ...initialBaseFormData,
            status: columnKeyToEnum[columnSelected as keyof typeof columnKeyToEnum],
          }}
          onSubmit={handleCreateDeal}
        />
      )}
    </>
  );
}
