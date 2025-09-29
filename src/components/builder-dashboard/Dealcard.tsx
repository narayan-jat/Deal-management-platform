import {
  Calendar,
  Users,
  DollarSign,
  Building2,
  Edit,
  Eye,
  UserPlus,
  MessageCircle,
} from "lucide-react";
import CollaboratorsModal from "./CollaboratorsModal";
import AddCollaboratorsModal from "./AddCollaboratorsModal";
import { DealCardType } from "@/types/deal/DealCard";
import { DealMemberRole } from "@/types/deal/Deal.enums";
import { StatusToTitleMap } from "@/types/deal/DealCard";
import { formatCurrency, getStatusInfo } from "@/utility/Utility";
import { useDealCard } from "@/hooks/useDealCard";
import PersonTagsModal from "./PersontagsModal";
import { PersonTagType } from "@/types/deal/Deal.sections";

type DealCardProps = {
  deal: DealCardType;
  refProps?: (node: HTMLElement | null) => void;
  styles?: React.CSSProperties;
  listeners?: any;
  attributes?: any;
  onEdit: () => void;
  onView?: () => void;
  hasEditAccess: boolean;
  onInviteCollaborators?: (emails: string[], role: DealMemberRole) => void;
  onMemberDeleted?: () => void;
  user?: any;
};

export default function DealCard(props: DealCardProps) {
  const {
    deal,
    refProps,
    styles,
    listeners,
    attributes,
    onEdit,
    onView,
    hasEditAccess,
    onInviteCollaborators,
    onMemberDeleted: onMemberDeletedProp,
    user,
  } = props;

  // Use the custom hook for all logic
  const {
    isCollaboratorsModalOpen,
    isInviteModalOpen,
    isBorrowersModalOpen,
    isDragging,
    dealContent,
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
    closeInviteModal,
    formatMeetingDate,
    createDealContent,
    closeBorrowersModal,
    refreshDealContent,
  } = useDealCard({
    deal,
    onEdit,
    onView,
    hasEditAccess,
    onInviteCollaborators,
    styles,
  });

  // Handle member deletion and refresh
  const handleMemberDeleted = async () => {
    // Refresh the deal content to get updated members
    await refreshDealContent();
    // Also call the parent callback if provided (for any additional cleanup)
    if (onMemberDeletedProp) {
      onMemberDeletedProp();
    }
  };

  // Get status color using utility function
  const statusInfo = getStatusInfo(deal.status);

  return (
    <>
      {/* Main card container with drag and drop attributes */}
      <div
        className={`block bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-out p-4 space-y-3 group relative my-3 ${
          hasEditAccess ? "dnd-kit-sortable" : "cursor-default"
        } ${isDragging ? "rotate-2 shadow-xl scale-105" : ""} ${
          !hasEditAccess ? "opacity-90" : ""
        }`}
        ref={hasEditAccess ? refProps : undefined}
        style={hasEditAccess ? styles : undefined}
        {...(hasEditAccess ? attributes : {})}
        {...(hasEditAccess ? listeners : {})}
        title={
          !hasEditAccess
            ? "You don't have permission to move this deal"
            : undefined
        }
        data-touch-action={hasEditAccess ? "none" : "auto"}
        onClick={handleCardClick}
        onDoubleClick={handleCardDoubleClick}
      >
        {/* Edit Button - Top Right */}
        <div className="flex justify-end">
          {/* Show edit button only if the role is in editAccessRoles, otherwise show view button at that place. If both, show both. Always visible, not on hover */}
          {hasEditAccess ? (
            <>
              <button
                onClick={handleChatClick}
                className="absolute top-0  p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                style={{ right: "4.2rem" }}
                title="Chat"
                data-dnd-kit-disabled-draggable
              >
                <MessageCircle className="h-4 w-4" />
              </button>
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
            <>
              <button
                onClick={handleChatClick}
                className="absolute top-0 right-10 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Chat"
                data-dnd-kit-disabled-draggable
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                onClick={handleViewClick}
                className="absolute top-0 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="View deal"
                data-dnd-kit-disabled-draggable
              >
                <Eye className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Header with title and status */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight flex-1 group-hover:text-blue-600 transition-colors duration-200">
            {dealContent?.title}
          </h3>
          <span
            className={`text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0 ${statusInfo.color} shadow-sm`}
          >
            {
              StatusToTitleMap[
                dealContent?.status as keyof typeof StatusToTitleMap
              ]
            }
          </span>
        </div>

        {/* Industry */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Building2 className="h-3 w-3 text-gray-400" />
          <span className="bg-gray-50 px-3 py-1.5 rounded-lg text-gray-600 font-medium border border-gray-100">
            {dealContent?.industry}
          </span>
        </div>

        {/* term */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="text-gray-400 font-medium">Term:</span>
          <span className="font-medium">
            {dealContent?.term || "Not specified"}
          </span>
        </div>

        {/* rate */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="text-gray-400 font-medium">Rate:</span>
          <span className="font-medium">
            {dealContent?.rate?.value || 0} %
            {dealContent?.rate?.type && ` (${dealContent?.rate?.type})`}
          </span>
        </div>

        {/* ltv */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="text-gray-400 font-medium">LTV:</span>
          <span className="font-medium">{dealContent?.ltv || 0} %</span>
        </div>

        {/* loan request */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="text-gray-400 font-medium">Loan Request:</span>
          <span className="font-medium">
            {formatCurrency(dealContent?.loanRequest || 0)}
          </span>
        </div>

        {/* next step */}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="text-gray-400 font-medium">Next Step:</span>
          <span className="font-medium">
            {formatMeetingDate(dealContent?.nextMeetingDate || "")}
          </span>
        </div>

        {/* Contributors Row - Clickable with Invite Button */}
        <div className="flex items-center justify-between gap-2">
          {/* Contributors Info - Clickable */}
          <div
            className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all duration-200 ease-out hover:scale-[1.02] touch-manipulation flex-1 min-w-0"
            onClick={handleCollaboratorsClick}
            data-dnd-kit-disabled-draggable
          >
            <Users className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="font-medium truncate">
              {dealContent?.members.length} contributor
              {dealContent?.members.length !== 1 ? "s" : ""}
            </span>
            {dealContent?.members.length > 0 && (
              <div className="flex -space-x-1.5 ml-2 flex-shrink-0">
                {dealContent?.members.slice(0, 3).map((contributor, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
                    title={contributor.name}
                  >
                    {contributor.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {dealContent?.members.length > 3 && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white shadow-sm">
                    +{dealContent?.members.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Invite Button */}
          {hasEditAccess && (
            <button
              onClick={handleInviteClick}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 ease-out hover:scale-105 flex-shrink-0"
              title="Invite collaborators"
              data-dnd-kit-disabled-draggable
            >
              <UserPlus className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Borrowers Row - Clickable with Invite Button */}
        <div className="flex items-center justify-between gap-2">
          {/* Borrowers Info - Clickable */}
          <div
            className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all duration-200 ease-out hover:scale-[1.02] touch-manipulation flex-1 min-w-0"
              onClick={handleBorrowersClick}
            data-dnd-kit-disabled-draggable
          >
            <Users className="h-3 w-3 text-gray-400 flex-shrink-0" />
            <span className="font-medium truncate">
              {dealContent?.borrowers.length} borrower
              {dealContent?.borrowers.length !== 1 ? "s" : ""}
            </span>
            {dealContent?.borrowers.length > 0 && (
              <div className="flex -space-x-1.5 ml-2 flex-shrink-0">
                {dealContent?.borrowers.slice(0, 3).map((borrower, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm"
                    title={borrower.name}
                  >
                    {borrower.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {dealContent?.borrowers.length > 3 && (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white shadow-sm">
                    +{dealContent?.borrowers.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collaborators Modal */}
      <CollaboratorsModal
        isOpen={isCollaboratorsModalOpen}
        onClose={closeCollaboratorsModal}
        collaborators={dealContent?.members || []}
        title={`Collaborators`}
        dealId={deal.id}
        onMemberDeleted={handleMemberDeleted}
        hasEditAccess={hasEditAccess}
        user={user}
      />

      {/* Borrowers Modal */}
      <PersonTagsModal
        isOpen={isBorrowersModalOpen}
        onClose={closeBorrowersModal}
        personTags={dealContent?.borrowers || []}
        type={PersonTagType.BORROWERS}
        title={`Borrowers`}
      />

      {/* Invite Collaborators Modal */}
      <AddCollaboratorsModal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        dealId={deal.id}
      />
    </>
  );
}
