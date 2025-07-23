import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DealCard from "./Dealcard";

type Props = {
  id: string;
  title: string;
  contributors: string;
  amount: string;
  status: string;
  industry: string;
  dateOfNextMeeting: string;
};

export default function SortableCardWrapper(props: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? "relative" as const : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard {...props} />
    </div>
  );
}
