import { Calendar, Users, DollarSign, Building2, Edit } from "lucide-react";
import { useState } from "react";
import CollaboratorsModal from "./CollaboratorsModal";
import { DealCardType } from "@/types/deal/DealCard";

type DealCardProps = {
  deal: DealCardType;
  refProps?: (node: HTMLElement | null) => void;
  styles?: React.CSSProperties;
  listeners?: any;
  attributes?: any;
  onEdit: () => void;
}

export default function DealCard(props: DealCardProps) {
  const { deal, refProps, styles, listeners, attributes, onEdit } = props;
  const [isCollaboratorsModalOpen, setIsCollaboratorsModalOpen] = useState(false);

  // Format the requested amount as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'negotiation':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
    console.log("Edit deal");
    onEdit();
  };

  return (
    <>
      <div className="block bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 space-y-3 cursor-pointer group relative">
        {/* Edit Button - Top Right in separate row */}
        <div className="flex justify-end">
          <button
            onClick={handleEditClick}
            className="absolute top-0 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Edit deal"
            data-dnd-kit-disabled-draggable
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>

        {/* apply sortable card logic here*/}
        <div 
          className="flex flex-col gap-2"
          ref={refProps}
          style={styles}
          {...attributes}
          {...listeners}
        >
          {/* Header with title and status - full width */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-semibold text-gray-900 leading-tight flex-1 group-hover:text-blue-600 transition-colors">
              {deal.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${getStatusColor(deal.status)}`}>
              {deal.status}
            </span>
          </div>
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
