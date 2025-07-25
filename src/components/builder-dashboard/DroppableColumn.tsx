import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  children: React.ReactNode;
  isOver?: boolean;
  isActive?: boolean;
};

export default function DroppableColumn({ id, children, isOver = false, isActive = false }: Props) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef} 
      className={`space-y-3 min-h-[40px] transition-all duration-200 ${
        isOver && isActive 
          ? 'bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-2' 
          : ''
      }`}
    >
      {children}
    </div>
  );
}
