import { Calendar, Users, DollarSign, Building2, Edit, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import CollaboratorsModal from "./CollaboratorsModal";
import { DealCardType } from "@/types/deal/DealCard";

import { StatusToTitleMap } from "@/types/deal/DealCard";
import { formatCurrency, getStatusInfo } from "@/utility/Utility";

type DealCardProps = {
  deal: DealCardType;
  refProps?: (node: HTMLElement | null) => void;
  styles?: React.CSSProperties;
  listeners?: any;
  attributes?: any;
  onEdit: () => void;
  onView?: () => void;
  hasEditAccess: boolean;
}

export default function DealCard(props: DealCardProps) {
  const { deal, refProps, styles, listeners, attributes, onEdit, onView, hasEditAccess } = props;
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);


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

  // Get status color using utility function
  const statusInfo = getStatusInfo(deal.status);

  // Handle collaborators click
  const handleCollaboratorsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollaboratorsModalOpen(true);
  };

  // Handle edit click
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit();
  };

  // Handle view click
  const handleViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onView) {
      onView();
    }
  };
  return (
    <>
      {/* Main card container with drag and drop attributes */}
      <div 
        className={`block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 space-y-3 group relative ${
          hasEditAccess ? 'dnd-kit-sortable' : 'cursor-default'
        } ${
          isDragging ? 'rotate-2 shadow-xl scale-105' : ''
        } ${!hasEditAccess ? 'opacity-90' : ''}`}
        ref={hasEditAccess ? refProps : undefined}
        style={hasEditAccess ? styles : undefined}
        {...(hasEditAccess ? attributes : {})}
        {...(hasEditAccess ? listeners : {})}
        title={!hasEditAccess ? "You don't have permission to move this deal" : undefined}
        data-touch-action={hasEditAccess ? "none" : "auto"}
      >
        {/* Edit Button - Top Right */}
        <div className="flex justify-end">
          {/* Show edit button only if the role is in editAccessRoles, otherwise show view button at that place. If both, show both. Always visible, not on hover */}
          {hasEditAccess ? (
            <>
              <button
                onClick={handleViewClick}
                className="absolute top-0 right-10 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="View deal"
                data-dnd-kit-disabled-draggable
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={handleEditClick}
                className="absolute top-0 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Edit deal"
                data-dnd-kit-disabled-draggable
              >
                <Edit className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleViewClick}
              className="absolute top-0 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="View deal"
              data-dnd-kit-disabled-draggable
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Header with title and status */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight flex-1 group-hover:text-blue-600 transition-colors">
            {deal.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${statusInfo.color}`}>
            {StatusToTitleMap[deal.status as keyof typeof StatusToTitleMap]}
          </span>
        </div>

        {/* Industry */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Building2 className="h-3 w-3 text-gray-400" />
          <span className="bg-gray-50 px-2 py-1 rounded text-gray-600 font-medium">
            {deal.industry}
          </span>
        </div>

        {/* Requested Amount */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(deal.requestedAmount)}
          </span>
        </div>

        {/* Next Meeting Date */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className="font-medium">
            {formatMeetingDate(deal.nextMeetingDate)}
          </span>
        </div>

        {/* Contributors - Clickable */}
        <div 
          className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 touch-manipulation"
          onClick={handleCollaboratorsClick}
          data-dnd-kit-disabled-draggable
        >
          <Users className="h-3 w-3 text-gray-400" />
          <span className="font-medium">
            {deal.contributors.length} contributor{deal.contributors.length !== 1 ? 's' : ''}
          </span>
          {deal.contributors.length > 0 && (
            <div className="flex -space-x-1 ml-1">
              {deal.contributors.slice(0, 3).map((contributor, index) => (
                <div
                  key={index}
                  className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border border-white"
                  title={contributor.name}
                >
                  {contributor.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {deal.contributors.length > 3 && (
                <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border border-white">
                  +{deal.contributors.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Collaborators Modal */}
      <CollaboratorsModal
        isOpen={isCollaboratorsModalOpen}
        onClose={() => setIsCollaboratorsModalOpen(false)}
        collaborators={deal.contributors}
        title={`Collaborators`}
      />
    </>
  );
}
