import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  children: React.ReactNode;
};

export default function DroppableColumn({ id, children }: Props) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="space-y-3 min-h-[40px]">
      {children}
    </div>
  );
}
