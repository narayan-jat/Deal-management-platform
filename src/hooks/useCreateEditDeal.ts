import { useState, useEffect } from 'react';
import { DealModel, DealMemberModel } from '../types/deal/Deal.model';
import { UploadDocumentForm } from '@/types/deal/Deal.documents';
import { CompleteDealForm, DealSectionName } from '@/types/deal/Deal.sections';
import { DealService } from '@/services/deals/DealService';
import { ErrorService } from '@/services/ErrorService';
import { DealMember, InviteMemberForm } from '@/types/deal/Deal.members';
import camelcaseKeys from 'camelcase-keys';
import { useAuth } from '@/context/AuthProvider';
import { LogType } from '@/types/deal/Deal.enums';
import { DealMemberRole } from '@/types/deal/Deal.enums';
import { getDateString } from '@/utility/Utility';
import { DealMemberService } from '@/services/deals/DealMemberService';
import { useDocumentUpload } from './useDocumentUpload';
import { createDealLogs } from './utils';
import { useUserProfile } from '@/context/UserProfileProvider';

export const useCreateEditDeal = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();
  const { userProfile } = useUserProfile();
  const { createDealDocuments, updateDealDocuments, handleDeleteDocument: deleteDocument } = useDocumentUpload();

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
      // Convert the date fields to correct format if the date is provided. 
      // Send a string in 'YYYY-MM-DD' format. If no date is provided, do not include the field.
      // Use the new comprehensive deal creation service
      const result = await DealService.createCompleteDeal(dealFormData);
      
      // Create deal logs for the creation
      await createDealLogs(user.id, result.deal.id, {
        deal: {
          title: result.deal.title,
          status: result.deal.status,
          action: 'deal created',
        },
      }, LogType.CREATED);
      
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

  // Legacy method for backward compatibility
  const handleCreateDealLegacy = async (deal: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]): Promise<DealModel | null> => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return null;
    }
    try {
      setLoading(true);
      try {
        // Add the createdBy field to the deal.
        deal.createdBy = user.id;
        // Add the organizationId field to the deal.
        deal.organizationId = userProfile?.primaryOrganization.organization.id;
        // Convert the date fields to correct format if the date is provided. 
        // Send a string in 'YYYY-MM-DD' format. If no date is provided, do not include the field.
        deal.startDate = deal.startDate ? getDateString(new Date(deal.startDate)) : null;
        deal.endDate = deal.endDate ? getDateString(new Date(deal.endDate)) : null;
        deal.nextMeetingDate = deal.nextMeetingDate ? getDateString(new Date(deal.nextMeetingDate)) : null;
        // remove the id field from the deal.
        delete deal.id;
        const createdDeal = await DealService.createDeal(deal);
        const camelCaseDeal = camelcaseKeys(createdDeal, { deep: true }) as DealModel;

        // Upload the documents on the storage and create deal documents.
        if (documents.length > 0) {
          await createDealDocuments(camelCaseDeal.id, documents, deal.organizationId);
        }
        
        // Need to convert the members to the correct format.
        const dealMembers: Partial<DealMemberModel>[] = members.map((member) => ({
          dealId: camelCaseDeal.id,
          memberId: member.id, // Grey area
          role: member.role as DealMemberRole,
          addedBy: user.id,
        }));
        // add the members to the deal members table.
        if (dealMembers.length > 0) {
          await DealMemberService.createDealMembers(dealMembers);
        }
        // return the created deal.
        return camelCaseDeal;
      } catch (error) {
        setApiError(error.message);
      }
    } catch (error) {
      setApiError(error.message);
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
      
      // Use the new comprehensive deal update service
      const result = await DealService.updateCompleteDeal(dealId, dealFormData);
      
      // Create deal logs for the update
      await createDealLogs(user.id, dealId, {
        deal: {
          title: result.deal.title,
          status: result.deal.status,
          action: 'deal updated',
        },
      }, LogType.UPDATED);
      
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

  // Legacy method for backward compatibility
  const handleEditDealLegacy = async (deal: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]): Promise<DealModel | null> => {
    
    if (!deal.id) {
      console.error('Deal ID is missing for edit operation');
      setApiError('Deal ID is required for editing');
      return null;
    }

    if (!user?.id) {
      console.error('User not authenticated for edit operation');
      setApiError('User not authenticated');
      return null;
    }
    
    const logMetaData = {}
    try {
      setLoading(true);
      
      // Add the updatedAt field to the deal.
      deal.updatedAt = new Date().toISOString();
      // Add the organizationId field to the deal.
      deal.organizationId = userProfile?.primaryOrganization.organization.id;
      // Convert the date fields to correct format if the date is provided. 
      // Send a string in 'YYYY-MM-DD' format. If no date is provided, do not include the field.
      deal.startDate = deal.startDate ? getDateString(new Date(deal.startDate)) : null;
      deal.endDate = deal.endDate ? getDateString(new Date(deal.endDate)) : null;
      deal.nextMeetingDate = deal.nextMeetingDate ? getDateString(new Date(deal.nextMeetingDate)) : null;
      
      const updatedDeal = await DealService.updateDeal(deal);

      // Convert to camelCase for consistency
      const camelCaseDeal = camelcaseKeys(updatedDeal, { deep: true }) as DealModel;

      // Upload the documents on the storage.
      // filter out those documents which are already uploaded. this means
      // having a filePath.
      const documentsToUpload = documents.filter((document) => !document.filePath);
      if (documentsToUpload.length > 0) {
        const createdDocuments = await updateDealDocuments(camelCaseDeal.id, documentsToUpload, deal.organizationId);
        if (createdDocuments.length > 0) {
          const createdDocumentsMetaData = createdDocuments.map((document) => ({
            id: document.id,
            isUploaded: true,
            action: 'document uploaded',
          }));
          logMetaData['documents'] = {documents:createdDocumentsMetaData, action: 'document uploaded'};
        }
      }

      // will add the members later.
      // update the deal logs.
      logMetaData['deal'] = {
        status: camelCaseDeal.status,
        nextMeetingDate: camelCaseDeal.nextMeetingDate,
        title: camelCaseDeal.title,
        requestedAmount: camelCaseDeal.requestedAmount,
        endDate: camelCaseDeal.endDate,
        startDate: camelCaseDeal.startDate,
        action: 'deal updated',
      };
      await createDealLogs(user.id, camelCaseDeal.id, logMetaData, LogType.UPDATED);
      
      return camelCaseDeal;
    } catch (error) {
      console.error('Error updating deal:', error);
      setApiError(error.message);
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
    // Legacy methods for backward compatibility
    handleCreateDealLegacy, 
    handleEditDealLegacy,
    // Document management
    handleDeleteDocument: deleteDocument
  };
}

export default useCreateEditDeal;