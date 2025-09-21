import React from "react";
import { Edit, ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DealCardType } from "@/types/deal/DealCard";
import { cn } from "@/lib/utils";
import { DealLogModel } from "@/types/deal/Deal.model";
import DealLogDetailsDialog from "./DealLogDetailsDialog";
import { DocumentUploadButton } from "./DocumentUploadButton";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { DealSectionName } from "@/types/deal/Deal.sections";
import { useDealView } from "@/hooks/useDealView";

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
  deal: DealCardType;
  onEdit: () => void;
  onClose?: () => void;
  dealLogs: DealLogModel[];
  isFetchingDealLogs: boolean;
  onRefreshDeal?: () => void;
}

export default function ViewDealTabs({
  deal,
  onEdit,
  onClose,
  dealLogs,
  isFetchingDealLogs,
  onRefreshDeal,
}: ViewDealTabsProps) {
  const navigate = useNavigate();

  // Use the custom hook for all deal view logic
  const {
    selectedLog,
    isLogDialogOpen,
    activeTab,
    sectionsData,
    loadingSections,
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
    setActiveTab,
    handleViewLogDetails,
    handleCloseLogDialog,
    handleDocumentDownload,
    handleDocumentPreview,
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
    getAvailableTabs,
    updateDealDocuments,
    loadDocumentsBySection,
    documentsBySection,
    loadingDocuments,
  } = useDealView(deal);

  console.log('documentsBySection', documentsBySection);
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
            deal={deal} 
            onDocumentPreview={handleDocumentPreview}
            onDocumentDownload={handleDocumentDownload}
            documents={documentsBySection['BASIC_INFO'] || []}
          />
        );
      case DealSectionName.OVERVIEW:
        return (
          <OverviewSection
            overviewData={sectionsData.overview}
            deal={deal}
            onDocumentPreview={handleDocumentPreview}
            onDocumentDownload={handleDocumentDownload}
            documents={documentsBySection['OVERVIEW'] || []}
          />
        );
      case DealSectionName.PURPOSE:
        return (
          <PurposeSection
            purposeData={sectionsData.purpose}
            deal={deal}
            onDocumentPreview={handleDocumentPreview}
            onDocumentDownload={handleDocumentDownload}
            documents={documentsBySection['PURPOSE'] || []}
          />
        );
      case DealSectionName.COLLATERAL:
        return (
          <CollateralSection
            collateralData={sectionsData.collateral}
            deal={deal}
            onDocumentPreview={handleDocumentPreview}
            onDocumentDownload={handleDocumentDownload}
            documents={documentsBySection['COLLATERAL'] || []}
          />
        );
      case DealSectionName.FINANCIALS:
        return (
          <FinancialsSection
            financialsData={sectionsData.financials}
            deal={deal}
            onDocumentPreview={handleDocumentPreview}
            onDocumentDownload={handleDocumentDownload}
            documents={documentsBySection['FINANCIALS'] || []}
          />
        );
      case DealSectionName.NEXT_STEPS:
        return (
          <NextStepsSection
            nextStepsData={sectionsData.nextSteps}
            deal={deal}
            onDocumentPreview={handleDocumentPreview}
            onDocumentDownload={handleDocumentDownload}
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

              {/* Edit Deal Button */}
              <Button
                onClick={() =>
                  navigate(ROUTES.EDIT_DEAL.replace(":dealId", deal.id))
                }
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Deal</span>
              </Button>
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
              handleCommentInputChange={handleCommentInputChange}
              handleMentionKeyDown={handleMentionKeyDown}
              handleMemberSelect={handleMemberSelect}
              handleSubmitCommentWithMembers={handleSubmitCommentWithMembers}
              handleUpdateCommentLocalWithMembers={
                handleUpdateCommentLocalWithMembers
              }
              handleCancelEdit={handleCancelEdit}
              handleEditComment={handleEditComment}
              getFilteredMembers={getFilteredMembers}
              deal={deal}
            />

            {/* Activity Log Section */}
            <ActivityLogSection
              dealLogs={dealLogs}
              isFetchingDealLogs={isFetchingDealLogs}
              getMemberName={getMemberName}
              onViewLogDetails={handleViewLogDetails}
            />
          </div>

          {/* Right Column - Collaborators */}
          <div className="space-y-6">
            <CollaboratorsSection contributors={deal.contributors || []} />
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
