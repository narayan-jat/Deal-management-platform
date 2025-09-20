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
    refreshDeal
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
        dealLogs={dealLogs}
        isFetchingDealLogs={isFetchingDealLogs}
        deal={deal} 
        onEdit={handleEdit} 
        onClose={handleClose}
        onRefreshDeal={refreshDeal}
      />
      
      {isEditModalOpen && (
        <CreateEditDealCard
          handleDeleteDocument={handleDeleteDocument}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          mode="edit"
          initialBaseFormData={{
            ...deal,
            documents: deal.documents.map(doc => ({ file: null, ...doc })),
            members: deal.contributors.map(contributor => ({
              id: contributor.id,
              email: contributor.email,
              role: contributor.role
            }))
          }}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  );
} 