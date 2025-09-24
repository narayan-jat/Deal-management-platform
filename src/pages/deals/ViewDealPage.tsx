import React from 'react';
import { useNavigate } from 'react-router-dom';
import ViewDealTabs from '@/components/builder-dashboard/ViewDealTabs';
import CreateEditDealCard from '@/components/builder-dashboard/CreateEditDealCard';
import DotLoader from '@/components/ui/loader';
import { useViewDealPage } from '@/hooks/useViewDealPage';

export default function ViewDealPage() {
  const navigate = useNavigate();
  const { 
    deal, 
    loading, 
    isEditModalOpen, 
    handleEdit, 
    handleClose, 
    handleDeleteDocument, 
    handleEditSubmit, 
    handleCloseEditModal, 
    dealLogs, 
    isFetchingDealLogs,
    refreshDeal,
    members,
    membersLoading,
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
  } = useViewDealPage();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <DotLoader />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Deal Not Found</h2>
          <p className="text-gray-500 mb-4">The deal you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <>
      <ViewDealTabs
        deal={deal} 
        onEdit={handleEdit} 
        onClose={handleClose}
        dealLogs={dealLogs}
        isFetchingDealLogs={isFetchingDealLogs}
        onRefreshDeal={refreshDeal}
        sectionsData={sectionsData}
        loadingSections={loadingSections}
        sectionsEnabled={sectionsEnabled}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        getAvailableTabs={getAvailableTabs}
        documentsBySection={documentsBySection}
        loadingDocuments={loadingDocuments}
        loadDocumentsBySection={loadDocumentsBySection}
        handleDocumentDownload={async (document: any) => {
          await handleDocumentDownload(document.id, document.fileName);
        }}
        handleDocumentPreview={async (document: any) => {
          await handleDocumentPreview(document.id);
        }}
        updateDealDocuments={updateDealDocuments}
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
        handleCommentInputChange={handleCommentInputChange}
        handleMemberSelect={handleMemberSelect}
        handleMentionKeyDown={handleMentionKeyDown}
        handleUpdateCommentLocalWithMembers={handleUpdateCommentLocalWithMembers as any}
        handleCancelEdit={handleCancelEdit}
        handleEditComment={handleEditComment as any}
        setEditingCommentText={setEditingCommentText}
        handleSubmitCommentWithMembers={handleSubmitCommentWithMembers as any}
        getFilteredMembers={getFilteredMembers as any}
        getMemberName={getMemberName}
        selectedLog={selectedLog}
        isLogDialogOpen={isLogDialogOpen}
        handleViewLogDetails={handleViewLogDetails}
        handleCloseLogDialog={handleCloseLogDialog}
      />
      
      {isEditModalOpen && (
        <CreateEditDealCard
          handleDeleteDocument={handleDeleteDocument}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          mode="edit"
          initialBaseFormData={{
            ...deal,
            status: deal.status as any, // Type assertion for compatibility
            documents: deal.documents ? Object.values(deal.documents).flat().map(doc => ({ file: null, ...doc })) : [],
            members: deal.members.map(member => ({
              id: member.id,
              email: member.email,
              role: member.role
            }))
          } as any}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
} 