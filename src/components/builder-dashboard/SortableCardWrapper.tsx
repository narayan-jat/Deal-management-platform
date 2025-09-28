import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DealCard from "./Dealcard";
import { DealCardType } from "@/types/deal/DealCard";
import { useAuth } from "@/context/AuthProvider";
import { DealMemberRole } from "@/types/deal/Deal.enums";
import { editAccessRoles } from "@/Constants";
import { useState, useEffect } from "react";

type Props = {
  isDragging?: boolean;
  deal: DealCardType;
  onEdit: () => void;
  onView?: () => void;
};

export default function SortableCardWrapper(props: Props) {
  const { isDragging: externalIsDragging, deal, onEdit, onView } = props;
  const [role, setRole] = useState<DealMemberRole | null>(null);
  const { user } = useAuth();

  // Check if user has edit access
  const hasEditAccess = editAccessRoles.includes(role);

  useEffect(() => {
    if (deal.members) {
      const member = deal.members.find((contributor) => contributor.id === user?.id);
      setRole(member?.role as DealMemberRole || null);
    }
  }, [deal.members, user?.id]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: internalIsDragging,
  } = useSortable({
    id: deal.id,
    disabled: !hasEditAccess, // Disable sorting if user doesn't have edit access
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
      onView={onView}
      hasEditAccess={hasEditAccess}
    />
  );
}
