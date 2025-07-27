import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViewDeal from '@/components/builder-dashboard/ViewDeal';
import CreateEditDealCard from '@/components/builder-dashboard/CreateEditDealCard';
import { DealCardType } from '@/types/deal/DealCard';
import { DealModel } from '@/types/deal/Deal.model';
import { UploadDocumentForm } from '@/types/deal/Deal.documents';
import { InviteMemberForm } from '@/types/deal/Deal.members';
import { useCreateEditDeal } from '@/hooks/useCreateEditDeal';
import { DealService } from '@/services/deals/DealService';
import { DealMemberService } from '@/services/deals/DealMemberService';
import { DealDocumentService } from '@/services/deals/DealDocumentService';
import { ProfileService } from '@/services/ProfileService';
import { ProfileStorageService } from '@/services/ProfileStorageService';
import { ErrorService } from '@/services/ErrorService';
import { toast } from 'sonner';
import DotLoader from '@/components/ui/loader';

export default function ViewDealPage() {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<DealCardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { handleEditDeal, handleDeleteDocument } = useCreateEditDeal();

  useEffect(() => {
    if (dealId) {
      // Try to get deal data from sessionStorage first
      const storedDealData = sessionStorage.getItem('viewDealData');
      if (storedDealData) {
        try {
          const dealData = JSON.parse(storedDealData);
          // Verify it's the correct deal
          if (dealData.id === dealId) {
            setDeal(dealData);
            setLoading(false);
            // Clear the stored data
            // sessionStorage.removeItem('viewDealData');
            return;
          }
        } catch (error) {
          console.error('Error parsing stored deal data:', error);
        }
      }
      
      // If no stored data or wrong deal, fetch from API
      fetchDealDetails();
    }
  }, [dealId]);

  const fetchDealDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch the deal using getDeals with a single ID
      const dealsData = await DealService.getDeals([dealId!]);
      const dealData = dealsData[0]; // Get the first (and only) deal
      
      if (!dealData) {
        throw new Error('Deal not found');
      }
      
      // Fetch deal members
      const dealMembers = await DealMemberService.getDealMembers(dealId!);
      const contributors = await Promise.all(
        dealMembers.map(async (member) => {
          try {
            const memberDetails = await ProfileService.getProfile(member.member_id);
            if (!memberDetails) return null;
            return {
              id: memberDetails.id,
              name: memberDetails.full_name,
              email: memberDetails.email,
              title: memberDetails.title,
              profilePhoto: await ProfileStorageService.getProfileImageSignedUrl(memberDetails.profile_photo),
              role: member.role,
            };
          } catch (error) {
            ErrorService.handleApiError(error, "ViewDealPage");
            return null;
          }
        })
      );

      // Fetch deal documents
      const dealDocuments = await DealDocumentService.getDealDocuments(dealId!);
      const documents = dealDocuments.map((document) => ({
        id: document.id,
        fileName: document.file_name,
        filePath: document.file_path,
        mimeType: document.mime_type,
        signatureStatus: document.signature_status,
        uploadedAt: document.uploaded_at,
        uploadedBy: document.uploaded_by,
      }));

      // Combine all data
      const completeDeal: DealCardType = {
        ...dealData,
        contributors: contributors.filter(Boolean),
        documents: documents,
      };

      setDeal(completeDeal);
    } catch (error) {
      ErrorService.handleApiError(error, "ViewDealPage");
      toast.error('Failed to load deal details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleClose = () => {
    navigate('/dashboard');
  };

  const handleEditSubmit = async (dealData: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]): Promise<DealModel | null> => {
    try {
      const updatedDeal = await handleEditDeal(dealData, documents, members);
      if (updatedDeal) {
        toast.success('Deal updated successfully');
        setIsEditModalOpen(false);
        // Refresh the deal data
        await fetchDealDetails();
      }
      return updatedDeal;
    } catch (error) {
      console.error('Error updating deal:', error);
      toast.error('Failed to update deal');
      return null;
    }
  };

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
      <ViewDeal 
        deal={deal} 
        onEdit={handleEdit} 
        onClose={handleClose}
      />
      
      {isEditModalOpen && (
        <CreateEditDealCard
          handleDeleteDocument={handleDeleteDocument}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
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