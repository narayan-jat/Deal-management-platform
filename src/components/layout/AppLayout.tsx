import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppBar from './AppBar';
import Sidebar from './Sidebar';
import CreateEditDealCard from '../builder-dashboard/CreateEditDealCard';
import { useCreateDeal } from '@/context/CreateDealProvider';
import { useCreateEditDeal } from '@/hooks/useCreateEditDeal';
import { DealStatus } from '@/types/deal/Deal.enums';
import { columnKeyToEnum } from '@/Constants';
import { DealModel } from '@/types/deal/Deal.model';
import { InviteMemberForm } from '@/types/deal/Deal.members';
import { UploadDocumentForm } from '@/types/deal/Deal.documents';

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isCreateDealModalOpen, closeCreateDealModal, selectedColumn, triggerRefresh } = useCreateDeal();
  const { handleCreateDeal, handleDeleteDocument } = useCreateEditDeal();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Desktop: close mobile sidebar, handle collapsed state
        setIsSidebarOpen(false);
      } else {
        // Mobile: ensure sidebar is closed by default
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuClick = () => {
    if (window.innerWidth >= 1024) {
      // Desktop: toggle collapsed state
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      // Mobile: toggle sidebar visibility
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleOnSubmit = async (deal: DealModel, documents: UploadDocumentForm[], members: InviteMemberForm[]) => {
    const createdDeal = await handleCreateDeal(deal, documents, members);
    if (createdDeal) {
      closeCreateDealModal();
      // Trigger refresh to update the dashboard data
      triggerRefresh();
    }
    return createdDeal;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* AppBar - Full width, always on top */}
      <AppBar 
        onMenuClick={handleMenuClick}
        isSidebarOpen={isSidebarOpen}
      />
      
      {/* Main content area with sidebar and content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarOpen(false)}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Create Deal Modal */}
      {isCreateDealModalOpen && (
        <CreateEditDealCard
          isOpen={isCreateDealModalOpen}
          onClose={closeCreateDealModal}
          mode="create"
          initialBaseFormData={{
            status: columnKeyToEnum[selectedColumn as keyof typeof columnKeyToEnum],
            documents: [],
            members: []
          }}
          onSubmit={handleOnSubmit}
          handleDeleteDocument={handleDeleteDocument}
        />
      )}
    </div>
  );
} 