import { useState } from 'react';
import { DealModel } from '../types/deal/Deal.model';
import { CompleteDealForm, DealSectionName } from '@/types/deal/Deal.sections';
import { DealService } from '@/services/deals/DealService';
import { ErrorService } from '@/services/ErrorService';
import { useAuth } from '@/context/AuthProvider';
import { LogType } from '@/types/deal/Deal.enums';
import { useDocumentUpload } from './useDocumentUpload';
import { createDealLogs } from './utils';
import { useUserProfile } from '@/context/UserProfileProvider';
import { extractDocumentsFromFormData, removeDocumentsFromNestedObjects, groupDocumentsBySection } from '@/utility/DocumentExtractionUtils';
import { useNavigate } from 'react-router-dom';
import { sendOverviewEmailInvites } from '@/utility/EmailInviteUtils';
import { toast } from 'sonner';

export const useCreateEditDeal = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();
  const { userProfile } = useUserProfile();
  const { createDealDocuments, updateDealDocuments, handleDeleteDocument: deleteDocument } = useDocumentUpload();
  const navigate = useNavigate();
  // Create a new deal with complete form data
  const handleCreateDeal = async (dealFormData: CompleteDealForm): Promise<DealModel | null> => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return null;
    }
    
    if (!userProfile?.primaryOrganization?.organization?.id) {
      setApiError("User organization not found");
      return null;
    }

    try {
      setLoading(true);
      // Add the createdBy field to the deal.
      dealFormData.createdBy = user.id;
      // Add the organizationId field to the deal.
      dealFormData.organizationId = userProfile?.primaryOrganization.organization.id;
      
      // Extract all documents from nested sections
      const extractedDocuments = extractDocumentsFromFormData(dealFormData);
      
      // Remove documents from nested objects to avoid duplication
      const dealFormDataWithoutDocs = removeDocumentsFromNestedObjects(dealFormData);
      dealFormDataWithoutDocs.documents = {};
      
      // Remove local document arrays from collateral items and financials for database push
      if (dealFormDataWithoutDocs.collateral?.items) {
        dealFormDataWithoutDocs.collateral.items = dealFormDataWithoutDocs.collateral.items.map((item: any) => {
          const { documents, ...itemWithoutDocs } = item;
          return itemWithoutDocs;
        });
      }
      
      if (dealFormDataWithoutDocs.financials) {
        const { historicalDocuments, projectedDocuments, ...financialsWithoutDocs } = dealFormDataWithoutDocs.financials;
        dealFormDataWithoutDocs.financials = financialsWithoutDocs;
      }
      
      // Create the deal first
      const result = await DealService.createCompleteDeal(dealFormDataWithoutDocs);
      
      // Now upload documents if any exist
      if (extractedDocuments.length > 0) {
        const organizationId = dealFormData.organizationId;
        
        // Group documents by section for processing
        const documentsBySection = groupDocumentsBySection(extractedDocuments);
        
        for (const [sectionName, sectionDocuments] of Object.entries(documentsBySection)) {
          if (sectionDocuments.length > 0) {
            // Process each document individually since they may have different form categories and item IDs
            for (const extractedDoc of sectionDocuments) {
              const documents = [extractedDoc.document];
              const formCategory = extractedDoc.formCategory;
              const itemId = extractedDoc.itemId;
              
              await createDealDocuments(
                result.deal.id, 
                documents, 
                organizationId, 
                sectionName as DealSectionName,
                formCategory,
                itemId
              );
            }
          }
        }
      }
      
      // Create deal logs for the creation
      await createDealLogs(user.id, result.deal.id, {
        deal: {
          title: result.deal.title,
          status: result.deal.status,
          action: 'deal created',
        },
      }, LogType.CREATED);
      
      // Send email invites to people in overview section
      try {
        const inviteResult = await sendOverviewEmailInvites(
          dealFormData.overview,
          result.deal.id,
          user.id
        );
        
        if (inviteResult.success > 0) {
        }
        if (inviteResult.failed > 0) {
          toast.error(`Failed to send ${inviteResult.failed} email invites`);
          console.warn(`Failed to send ${inviteResult.failed} email invites`);
        }
      } catch (error) {
        console.error('Error sending email invites:', error);
        // Don't fail the deal creation if email invites fail
      }
      
      navigate(`/deals/${result.deal.id}`);
      return result.deal;
    } catch (error) {
      console.error('Error creating deal:', error);
      setApiError(error.message);
      ErrorService.handleApiError(error, "useCreateEditDeal.handleCreateDeal");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Edit a deal with complete form data
  const handleEditDeal = async (dealId: string, dealFormData: CompleteDealForm): Promise<DealModel | null> => {
    if (!dealId) {
      console.error('Deal ID is missing for edit operation');
      setApiError('Deal ID is required for editing');
      return null;
    }

    if (!user?.id) {
      console.error('User not authenticated for edit operation');
      setApiError('User not authenticated');
      return null;
    }
    
    try {
      setLoading(true);
      
      // Extract all documents from nested sections
      const extractedDocuments = extractDocumentsFromFormData(dealFormData);
      
      // Remove documents from nested objects to avoid duplication
      const dealFormDataWithoutDocs = removeDocumentsFromNestedObjects(dealFormData);
      dealFormDataWithoutDocs.documents = {};
      
      // Remove local document arrays from collateral items and financials for database push
      if (dealFormDataWithoutDocs.collateral?.items) {
        dealFormDataWithoutDocs.collateral.items = dealFormDataWithoutDocs.collateral.items.map((item: any) => {
          const { documents, ...itemWithoutDocs } = item;
          return itemWithoutDocs;
        });
      }
      
      if (dealFormDataWithoutDocs.financials) {
        const { historicalDocuments, projectedDocuments, ...financialsWithoutDocs } = dealFormDataWithoutDocs.financials;
        dealFormDataWithoutDocs.financials = financialsWithoutDocs;
      }
      
      // Use the new comprehensive deal update service
      const result = await DealService.updateCompleteDeal(dealId, dealFormDataWithoutDocs);
      
      // Upload the documents on the storage.
      // filter out those documents which are already uploaded. this means
      // having a filePath.
      // Now upload documents if any exist
      if (extractedDocuments.length > 0) {
        const organizationId = userProfile?.primaryOrganization.organization.id;
        
        // Group documents by section for processing
        const documentsBySection = groupDocumentsBySection(extractedDocuments);
        
        for (const [sectionName, sectionDocuments] of Object.entries(documentsBySection)) {
          if (sectionDocuments.length > 0) {
            // Process each document individually since they may have different form categories and item IDs
            for (const extractedDoc of sectionDocuments) {
              const documents = [extractedDoc.document];
              const formCategory = extractedDoc.formCategory;
              const itemId = extractedDoc.itemId;
              
              await updateDealDocuments(
                dealId, 
                documents, 
                organizationId, 
                sectionName as DealSectionName,
                formCategory,
                itemId
              );
            }
          }
        }
      }
      // Create deal logs for the update
      await createDealLogs(user.id, dealId, {
        deal: {
          title: result.deal.title,
          status: result.deal.status,
          action: 'deal updated',
        },
      }, LogType.UPDATED);
      
      // Send email invites to new people in overview section
      try {
        const inviteResult = await sendOverviewEmailInvites(
          dealFormData.overview,
          dealId,
          user.id
        );
        
        if (inviteResult.success > 0) {
        }
        if (inviteResult.failed > 0) {
          toast.error(`Failed to send ${inviteResult.failed} email invites`);
          console.warn(`Failed to send ${inviteResult.failed} email invites`);
        }
      } catch (error) {
        console.error('Error sending email invites:', error);
        // Don't fail the deal update if email invites fail
      }
      
      navigate(`/deals/${dealId}`);
      return result.deal as DealModel;
    } catch (error) {
      console.error('Error updating deal:', error);
      setApiError(error.message);
      ErrorService.handleApiError(error, "useCreateEditDeal.handleEditDeal");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { 
    loading, 
    apiError, 
    // New methods for comprehensive deal management
    handleCreateDeal, 
    handleEditDeal,
    // Document management
    handleDeleteDocument: deleteDocument
  };
}

export default useCreateEditDeal;