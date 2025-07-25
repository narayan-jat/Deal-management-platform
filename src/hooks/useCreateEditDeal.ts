import { useState, useEffect } from 'react';
import { DealModel, DealMemberModel } from '../types/deal/Deal.model';
import { UploadDocumentForm, DealDocument } from '@/types/deal/Deal.documents';
import { DealService } from '@/services/deals/DealService';
import { ErrorService } from '@/services/ErrorService';
import { InviteMemberForm } from '@/types/deal/Deal.members';
import camelcaseKeys from 'camelcase-keys';
import { DocumentStorageService } from '@/services/DocumentStorageService';
import { useAuth } from '@/context/AuthProvider';
import { SignatureStatus } from '@/types/deal/Deal.enums';
import { getDateString } from '@/utility/Utility';
import { DealDocumentService } from '@/services/deals/DealDocumentService';
import { DealMemberService } from '@/services/deals/DealMemberService';

export const useCreateEditDeal = () => {
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();

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
        // Convert the date fields to correct format if the date is provided. 
        // Send a string in 'YYYY-MM-DD' format. If no date is provided, do not include the field.
        deal.startDate = deal.startDate ? getDateString(new Date(deal.startDate)) : null;
        deal.endDate = deal.endDate ? getDateString(new Date(deal.endDate)) : null;
        deal.nextMeetingDate = deal.nextMeetingDate ? getDateString(new Date(deal.nextMeetingDate)) : null;
        const createdDeal = await DealService.createDeal(deal);
        const camelCaseDeal = camelcaseKeys(createdDeal, { deep: true }) as DealModel;

        // Upload the documents on the storage.
        const uploadResults = await handleUploadDocuments(camelCaseDeal.id, documents);
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
          memberId: member.memberId,
          role: member.role,
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

  const handleUploadDocuments = async (dealId: string, documents: UploadDocumentForm[]) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return;
    }
    // convert documents to File[]
    const fileDocuments = documents.map((document) => document.file);
    try {
      const uploadedDocuments = await DocumentStorageService.uploadDocument(dealId, fileDocuments);
      return uploadedDocuments;
    } catch (error) {
      setApiError(error.message);
    }
  }

  const handleEditDeal = async (dealId: string, deal: Partial<DealModel>) => {
    if (dealId && user?.id) {
        try {
          const deal = await DealService.getDeals([dealId]);
          // Before setting the deal, convert the deal to camelCase.
          const camelCaseDeal = camelcaseKeys(deal[0], { deep: true });
          return camelCaseDeal;
        } catch (error) {
          ErrorService.handleApiError(error, "useCreateEditDeal.fetchDeal");
          setApiError(error.message);
        } finally {
          setLoading(false);
        }
    }
  }

  return { loading, apiError, handleCreateDeal, handleEditDeal };
}

export default useCreateEditDeal;