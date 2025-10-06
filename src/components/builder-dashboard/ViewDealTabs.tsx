import React from "react";
import { Edit, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DealViewType } from "@/types/deal/DealView";
import { cn } from "@/lib/utils";
import { DealLogModel } from "@/types/deal/Deal.model";
import DealLogDetailsDialog from "./DealLogDetailsDialog";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { DealSectionName } from "@/types/deal/Deal.sections";
import { useAuth } from "@/context/AuthProvider";
import { canUserEditDeal } from "@/utility/DealRoleUtils";

// Import section components
import { BasicInfoSection } from "@/components/deal-view/BasicInfoSection";
import { OverviewSection } from "@/components/deal-view/OverviewSection";
import { PurposeSection } from "@/components/deal-view/PurposeSection";
import { CollateralSection } from "@/components/deal-view/CollateralSection";
import { FinancialsSection } from "@/components/deal-view/FinancialsSection";
import { NextStepsSection } from "@/components/deal-view/NextStepsSection";
import { CommentsSection } from "@/components/deal-view/CommentsSection";
import { ActivityLogSection } from "@/components/deal-view/ActivityLogSection";
import { CollaboratorsSection } from "@/components/deal-view/CollaboratorsSection";
import { formatDate } from "@/utility/Utility";
import { Separator } from "@radix-ui/react-select";

interface ViewDealTabsProps {
  deal: DealViewType;
  onEdit: () => void;
  onClose?: () => void;
  dealLogs: DealLogModel[];
  isFetchingDealLogs: boolean;
  onRefreshDeal?: () => void;
  
  // Sections
  sectionsData: any;
  loadingSections: boolean;
  sectionsEnabled: { [key in DealSectionName | 'BASIC_INFO']: boolean };
  activeTab: DealSectionName | 'BASIC_INFO';
  setActiveTab: (tab: DealSectionName | 'BASIC_INFO') => void;
  getAvailableTabs: () => Array<{ key: string; label: string }>;
  
  // Documents
  documentsBySection: { [key: string]: any[] };
  loadingDocuments: boolean;
  loadDocumentsBySection: () => Promise<void>;
  handleDocumentDownload: (document: any) => Promise<void>;
  handleDocumentPreview: (document: any) => Promise<void>;
  updateDealDocuments: (dealId: string, documents: any[], organizationId: string, sectionName: string) => Promise<any[]>;
  
  // Comments
  dealComments: any[];
  isFetchingDealComments: boolean;
  newComment: string;
  isSubmittingComment: boolean;
  editingCommentId: string | null;
  editingCommentText: string;
  isMentionDropdownOpen: boolean;
  mentionQuery: string;
  selectedMentionIndex: number;
  commentInputRef: React.RefObject<HTMLTextAreaElement>;
  handleCommentInputChange: (value: string) => void;
  handleMemberSelect: (member: any) => void;
  handleMentionKeyDown: (e: React.KeyboardEvent) => void;
  handleUpdateCommentLocalWithMembers: () => void;
  handleCancelEdit: () => void;
  handleEditComment: (commentId: string, text: string) => void;
  setEditingCommentText: (text: string) => void;
  handleSubmitCommentWithMembers: () => Promise<void>;
  getFilteredMembers: (members: any[], query: string) => any[];
  getMemberName: (memberId: string) => string;
  
  // Logs
  selectedLog: DealLogModel | null;
  isLogDialogOpen: boolean;
  handleViewLogDetails: (log: DealLogModel) => void;
  handleCloseLogDialog: () => void;
}

export default function ViewDealTabs({
  deal,
  onEdit,
  onClose,
  dealLogs,
  isFetchingDealLogs,
  onRefreshDeal,
  sectionsData,
  loadingSections,
  sectionsEnabled,
  activeTab,
  setActiveTab,
  getAvailableTabs,
  documentsBySection,
  loadingDocuments,
  loadDocumentsBySection,
  handleDocumentDownload,
  handleDocumentPreview,
  updateDealDocuments,
  dealComments,
  isFetchingDealComments,
  newComment,
  isSubmittingComment,
  editingCommentId,
  editingCommentText,
  isMentionDropdownOpen,
  mentionQuery,
  selectedMentionIndex,
  commentInputRef,
  handleCommentInputChange,
  handleMemberSelect,
  handleMentionKeyDown,
  handleUpdateCommentLocalWithMembers,
  handleCancelEdit,
  handleEditComment,
  setEditingCommentText,
  handleSubmitCommentWithMembers,
  getFilteredMembers,
  getMemberName,
  selectedLog,
  isLogDialogOpen,
  handleViewLogDetails,
  handleCloseLogDialog,
}: ViewDealTabsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if current user can edit the deal
  const canEdit = user ? canUserEditDeal(user.id, deal.members || []) : false;
  
  // Render section content
  const renderSectionContent = () => {
    if (loadingSections) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading section data...</span>
        </div>
      );
    }

    if (!sectionsData) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No section data available</p>
        </div>
      );
    }

    switch (activeTab) {
      case "BASIC_INFO":
        return (
          <BasicInfoSection 
            deal={deal as any} 
            onDocumentPreview={(document: any) => handleDocumentPreview(document)}
            onDocumentDownload={(document: any) => handleDocumentDownload(document)}
            documents={documentsBySection['BASIC_INFO'] || []}
          />
        );
      case DealSectionName.OVERVIEW:
        return (
          <OverviewSection
            overviewData={sectionsData.overview}
            deal={deal as any}
            onDocumentPreview={(document: any) => handleDocumentPreview(document)}
            onDocumentDownload={(document: any) => handleDocumentDownload(document)}
            documents={documentsBySection['OVERVIEW'] || []}
          />
        );
      case DealSectionName.PURPOSE:
        return (
          <PurposeSection
            purposeData={sectionsData.purpose}
            deal={deal as any}
            onDocumentPreview={(document: any) => handleDocumentPreview(document)}
            onDocumentDownload={(document: any) => handleDocumentDownload(document)}
            documents={documentsBySection['PURPOSE'] || []}
          />
        );
      case DealSectionName.COLLATERAL:
        return (
          <CollateralSection
            collateralData={sectionsData.collateral}
            deal={deal as any}
            onDocumentPreview={(document: any) => handleDocumentPreview(document)}
            onDocumentDownload={(document: any) => handleDocumentDownload(document)}
            documents={documentsBySection['COLLATERAL'] || []}
          />
        );
      case DealSectionName.FINANCIALS:
        return (
          <FinancialsSection
            financialsData={sectionsData.financials}
            deal={deal as any}
            onDocumentPreview={(document: any) => handleDocumentPreview(document)}
            onDocumentDownload={(document: any) => handleDocumentDownload(document)}
            documents={documentsBySection['FINANCIALS'] || []}
          />
        );
      case DealSectionName.NEXT_STEPS:
        return (
          <NextStepsSection
            nextStepsData={sectionsData.nextSteps}
            deal={deal as any}
            onDocumentPreview={(document: any) => handleDocumentPreview(document)}
            onDocumentDownload={(document: any) => handleDocumentDownload(document)}
            documents={documentsBySection['NEXT_STEPS'] || []}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  // Get available tabs
  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {deal.title}
                </h1>
                <p className="text-sm text-gray-500">Deal Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Document Upload Button */}
              {canEdit && (
              <DocumentUploadButton
                dealId={deal.id}
                organizationId={deal.organizationId}
                onUpload={async (documents) => {
                  // Documents uploaded from deal view go to BASIC_INFO section
                  return await updateDealDocuments(
                    deal.id,
                    documents,
                    deal.organizationId || "",
                    DealSectionName.BASIC_INFO
                  );
                }}
                onSuccess={() => {
                  // Refresh documents after upload
                  loadDocumentsBySection();
                  if (onRefreshDeal) {
                    onRefreshDeal();
                  }
                }}
                variant="outline"
                size="default"
                buttonText="Upload Documents"
                loadingText="Uploading..."
              />
              )}

              {/* Edit Deal Button - Only show if user can edit */}
              {canEdit && (
                <Button
                  onClick={() =>
                    navigate(ROUTES.EDIT_DEAL.replace(":dealId", deal.id))
                  }
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Deal</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Deal Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Tabs */}
            {availableTabs.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Deal Sections</h3>
                </div>
                <div className="p-6">
                  {/* Tab Navigation */}
                  <div className="flex space-x-1 mb-6 overflow-x-auto">
                    {availableTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() =>
                          setActiveTab(
                            tab.key as DealSectionName | "BASIC_INFO"
                          )
                        }
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                          activeTab === tab.key
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[400px]">{renderSectionContent()}</div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <CommentsSection
              dealComments={dealComments}
              isFetchingDealComments={isFetchingDealComments}
              newComment={newComment}
              isSubmittingComment={isSubmittingComment}
              editingCommentId={editingCommentId}
              editingCommentText={editingCommentText}
              isMentionDropdownOpen={isMentionDropdownOpen}
              mentionQuery={mentionQuery}
              selectedMentionIndex={selectedMentionIndex}
              commentInputRef={commentInputRef}
              getMemberName={getMemberName}
              handleCommentInputChange={(e: React.ChangeEvent<HTMLTextAreaElement>, isEditing: boolean) => {
                handleCommentInputChange(e.target.value);
              }}
              handleMentionKeyDown={handleMentionKeyDown}
              handleMemberSelect={handleMemberSelect}
              handleSubmitCommentWithMembers={handleSubmitCommentWithMembers}
              handleUpdateCommentLocalWithMembers={handleUpdateCommentLocalWithMembers}
              handleCancelEdit={handleCancelEdit}
              handleEditComment={handleEditComment as any}
              getFilteredMembers={getFilteredMembers as any}
              deal={deal as DealViewType}
            />

            {/* Activity Log Section */}
            <ActivityLogSection
              dealLogs={dealLogs}
              isFetchingDealLogs={isFetchingDealLogs}
              getMemberName={getMemberName}
              onViewLogDetails={handleViewLogDetails}
            />
          </div>

          {/* Right Column - Members */}
          <div className="space-y-6">
            <CollaboratorsSection 
              contributors={deal.members || []} 
            />
            {/* Deal Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Deal Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(deal.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(deal.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Details Dialog */}
      <DealLogDetailsDialog
        isOpen={isLogDialogOpen}
        onClose={handleCloseLogDialog}
        selectedLog={selectedLog}
        getMemberName={getMemberName}
      />
    </div>
  );
}
