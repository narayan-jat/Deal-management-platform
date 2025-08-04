import { useState, useEffect } from 'react';
import { DealModel, DealMemberModel, DealDocumentModel } from '../types/deal/Deal.model';
import { UploadDocumentForm, DealDocument } from '@/types/deal/Deal.documents';
import { DealService } from '@/services/deals/DealService';
import { ErrorService } from '@/services/ErrorService';
import { DealMember, InviteMemberForm } from '@/types/deal/Deal.members';
import camelcaseKeys from 'camelcase-keys';
import { DocumentStorageService } from '@/services/DocumentStorageService';
import { useAuth } from '@/context/AuthProvider';
import { LogType, SignatureStatus } from '@/types/deal/Deal.enums';
import { DealMemberRole } from '@/types/deal/Deal.enums';
import { getDateString } from '@/utility/Utility';
import { DealDocumentService } from '@/services/deals/DealDocumentService';
import { DealMemberService } from '@/services/deals/DealMemberService';
import { createDealLogs } from './utils';
import { useUserProfile } from '@/context/UserProfileProvider';

export const useCreateEditDeal = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();
  const { userProfile } = useUserProfile();

  // Create a new deal
  const handleCreateDeal = async (deal: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]): Promise<DealModel | null> => {
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

        // Upload the documents on the storage.
        const uploadResults = await handleUploadDocuments(camelCaseDeal.id, deal.organizationId, documents);
        // Need to convert the documents and members to the correct format.
        const dealDocuments: Partial<DealDocument>[] = uploadResults.map((result) => ({
          dealId: camelCaseDeal.id,
          uploadedBy: user.id,
          signatureStatus: SignatureStatus.UNSIGNED,
          filePath: result.path,
          fileName: result.fileName,
          mimeType: result.mimeType,
        }));
        
        // Need to convert the members to the correct format.
        const dealMembers: Partial<DealMemberModel>[] = members.map((member) => ({
          dealId: camelCaseDeal.id,
          memberId: member.id, // Grey area
          role: member.role as DealMemberRole,
          addedBy: user.id,
        }));

        // add the documents to the deal documents table.
        if (dealDocuments.length > 0) {
          await DealDocumentService.createDealDocuments(dealDocuments);
        }
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

  const handleUploadDocuments = async (dealId: string, organizationId: string, documents: UploadDocumentForm[]) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return;
    }
    // convert documents to File[]
    const fileDocuments = documents.map((document) => document.file);
    try {
      // get the organization
      const uploadedDocuments = await DocumentStorageService.uploadDocument(dealId, organizationId, fileDocuments);
      return uploadedDocuments;
    } catch (error) {
      setApiError(error.message);
    }
  }

  const handleEditDeal = async (deal: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]): Promise<DealModel | null> => {
    
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
        const uploadResults = await handleUploadDocuments(camelCaseDeal.id, deal.organizationId, documentsToUpload);
        // Need to convert the documents and members to the correct format.
        const dealDocuments: Partial<DealDocument>[] = uploadResults.map((result) => ({
          dealId: camelCaseDeal.id,
          uploadedBy: user.id,
          signatureStatus: SignatureStatus.UNSIGNED,
          filePath: result.path,
          fileName: result.fileName,
          mimeType: result.mimeType,
        }));

        // add the documents to the deal documents table.
        if (dealDocuments.length > 0) {
          const createdDocuments = await DealDocumentService.createDealDocuments(dealDocuments);
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

  const handleDeleteDocument = async (dealId: string, documentId: string, filePath: string) => {
    try {
      // First remove the document from the storage.
      await DocumentStorageService.deleteDocument(filePath);
      // Then remove the document from the deal documents table.
      await DealDocumentService.deleteDealDocument([documentId]);
      // update the deal logs.
      await createDealLogs(user.id, dealId, {
        documents: {
          id: documentId,
          isDeleted: true,
          action: 'document deleted',
        },
      }, LogType.DELETED);
    } catch (error) {
      setApiError(error.message);
    }
  }

  return { loading, apiError, handleCreateDeal, handleEditDeal, handleDeleteDocument };
}

export default useCreateEditDeal;