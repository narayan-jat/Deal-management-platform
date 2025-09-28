import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DealCardContent, DealCardType } from '@/types/deal/DealCard';
import { DealMemberRole } from '@/types/deal/Deal.enums';
import { useDealChat } from '@/hooks/useDealChat';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/context/AuthProvider';
import { TIMELINE_OPTIONS } from '@/types/deal/Deal.sections';

type UseDealCardProps = {
  deal: DealCardType;
  onEdit: () => void;
  onView?: () => void;
  hasEditAccess: boolean;
  onInviteCollaborators?: (emails: string[], role: DealMemberRole) => void;
  styles?: React.CSSProperties;
};

export const useDealCard = ({
  deal,
  onEdit,
  onView,
  hasEditAccess,
  onInviteCollaborators,
  styles,
}: UseDealCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleDealChatClick } = useDealChat();
  const [dealContent, setDealContent] = useState<DealCardContent | null>(null);

  // Modal states
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isBorrowersModalOpen, setIsBorrowersModalOpen] = useState(false);
  // Refs for click handling
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  // Check if card is being dragged based on styles
  const isDragging = styles?.opacity === 0.8;

  // Format the next meeting date
  const formatMeetingDate = (dateString: string) => {
    if (!dateString) return 'No meeting scheduled';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return 'Meeting overdue';
      } else if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Tomorrow';
      } else if (diffDays <= 7) {
        return `In ${diffDays} days`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch {
      return 'Invalid date';
    }
  };

  const createDealContent = () => {
    const dealContent: DealCardContent = {
      title: deal.title,
      status: deal.status,
      members: deal.members || [],
      industry: deal.industry,
      createdBy: deal.createdBy,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt,
      loanRequest: deal.sections?.overview?.loanRequest || 0,
      rate: deal.sections?.overview?.rate,
      ltv: deal.sections?.overview?.ltv?.toString() || '0',
      nextMeetingDate: deal.sections?.nextSteps?.nextMeetingDate || '',
      term: '',
      borrowers: deal.sections?.overview?.borrowers || [],
    }
    // term is the timeline of the purpose section
    if(deal.sections?.purpose?.timeline) {
      // get the timeline label from the TIMELINE_OPTIONS
      const timelineLabel = TIMELINE_OPTIONS.find(opt => opt.value === deal.sections?.purpose?.timeline)?.label;
      dealContent.term = timelineLabel;
    }

    return dealContent;

  };

  useEffect(() => {
    setDealContent(createDealContent());
  }, [deal]);

  // Handle collaborators click
  const handleCollaboratorsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollaboratorsModalOpen(true);
  };

  // Handle borrowers click
  const handleBorrowersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBorrowersModalOpen(true);
  };

  // Handle invite collaborators click
  const handleInviteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasEditAccess) {
      toast.error("You don't have permission to invite collaborators");
      return;
    }
    setIsInviteModalOpen(true);
  };

  // Handle invite collaborators submit
  const handleInviteCollaborators = (emails: string[], role: DealMemberRole) => {
    if (onInviteCollaborators) {
      onInviteCollaborators(emails, role);
      toast.success(`Invited ${emails.length} collaborator${emails.length !== 1 ? 's' : ''} to the deal`);
    } else {
      toast.error("Invite functionality not available");
    }
  };

  // Handle collaborator removed
  const handleCollaboratorRemoved = (contributorId: string) => {
    // reload the window is the only option.
    window.location.reload();
  };

  // Handle view click
  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onView) {
      onView();
    }
  };

  // Handle card click (single click to open deal view)
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      // Set timeout for single click
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          // Single click - open deal view
          if (onView) {
            onView();
          } else {
            // Navigate to deal view if onView is not provided
            navigate(ROUTES.VIEW_DEAL.replace(':dealId', deal.id));
          }
        }
        clickCountRef.current = 0;
      }, 300); // 300ms delay to detect double click
    } else if (clickCountRef.current === 2) {
      // Double click - clear single click timeout and handle double click
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      
      // Double click - enable drag and drop mode
      // This could trigger a visual indicator or enable drag mode
      console.log('Double click detected - drag mode enabled');
      // You can add logic here to enable drag mode or show visual feedback
      
      clickCountRef.current = 0;
    }
  };

  // Handle card double click
  const handleCardDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear any pending single click
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    
    // Double click - enable drag and drop mode
    console.log('Double click detected - drag mode enabled');
    // You can add logic here to enable drag mode or show visual feedback
  };

  // Handle edit click
  const handleEditClick = () => {
    navigate(ROUTES.EDIT_DEAL.replace(':dealId', deal.id));
  };

  // Handle chat click
  const handleChatClick = () => {
    handleDealChatClick(deal);
  };

  // Modal handlers
  const closeCollaboratorsModal = () => setIsCollaboratorsModalOpen(false);
  const closeInviteModal = () => setIsInviteModalOpen(false);

  // Close borrowers modal
  const closeBorrowersModal = () => {
    setIsBorrowersModalOpen(false);
  };

  return {
    // State
    isCollaboratorsModalOpen,
    isInviteModalOpen,
    isBorrowersModalOpen,
    isDragging,
    dealContent,
    // Handlers
    handleCollaboratorsClick,
    handleBorrowersClick,
    handleInviteClick,
    handleInviteCollaborators,
    handleCollaboratorRemoved,
    handleViewClick,
    handleCardClick,
    handleCardDoubleClick,
    handleEditClick,
    handleChatClick,
    closeCollaboratorsModal,
    closeBorrowersModal,
    closeInviteModal,
    formatMeetingDate,
    createDealContent,
  };
};

