import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DealCard from "./Dealcard";
import { DealCardType } from "@/types/deal/DealCard";

type Props = {
  isDragging?: boolean;
  deal: DealCardType;
  onEdit: () => void;
};

export default function SortableCardWrapper(props: Props) {
  const { isDragging: externalIsDragging, deal, onEdit } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: internalIsDragging,
  } = useSortable({
    id: deal.id,
  });

  const isDragging = externalIsDragging || internalIsDragging;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? "relative" as const : undefined,
  };

  return (
    <DealCard 
      deal={deal} 
      refProps={setNodeRef}
      styles={style}
      listeners={listeners}
      attributes={attributes}
      onEdit={onEdit}
    />
  );
}
