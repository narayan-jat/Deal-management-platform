import { useState, useEffect } from 'react';
import { DealModel, DealMemberModel } from '../types/deal/Deal.model';
import { UploadDocumentForm, DealDocument } from '@/types/deal/Deal.documents';
import { DealService } from '@/services/deals/DealService';
import { ErrorService } from '@/services/ErrorService';
import { InviteMemberForm } from '@/types/deal/Deal.members';
import snakecaseKeys from 'snakecase-keys';
import { DocumentStorageService } from '@/services/DocumentStorageService';
import { useAuth } from '@/context/AuthProvider';
import { SignatureStatus } from '@/types/deal/Deal.enums';


export const useCreateEditDeal = (dealId: string) => {
  const [deal, setDeal] = useState<Partial<DealModel>[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();


  // If the dealId is provided, then we are editing a deal. fetch the deal.
  useEffect(() => {
    if (dealId && user?.id) {
      const fetchDeal = async () => {
        try {
          setLoading(true);
          const deal = await DealService.getDeal(dealId);
          // Before setting the deal, convert the deal to camelCase.
          const camelCaseDeal = snakecaseKeys(deal, { deep: true });
          setDeal(camelCaseDeal);
        } catch (error) {
          ErrorService.handleApiError(error, "useCreateEditDeal.fetchDeal");
          setApiError(error.message);
        } finally {
          setLoading(false);
        }
      }
      fetchDeal();
    }
  }, [dealId]);

  // Create a new deal.

  const handleCreateDeal = async (deal: Partial<DealModel>, documents: UploadDocumentForm[], members: InviteMemberForm[]) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return;
    }
    try {
      setLoading(true);
      // Need to convert the documents and members to the correct format.
      const uploadResults = await handleUploadDocuments(dealId, documents);
      const dealDocuments: Partial<DealDocument>[] = uploadResults.map((result) => ({
        dealId: dealId,
        uploadedBy: user.id,
        signatureStatus: SignatureStatus.UNSIGNED,
        filePath: result.path,
        fileName: result.fileName,
        mimeType: result.mimeType,
      }));

      // Need to convert the members to the correct format.
      const dealMembers: Partial<DealMemberModel>[] = members.map((member) => ({
        dealId: dealId,
        memberId: member.memberId,
        role: member.role,
        addedBy: user.id,
      }));
      try {
        await DealService.createDeal(deal, dealDocuments, dealMembers);
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
  return { deal, loading, apiError, handleCreateDeal };
}

export default useCreateEditDeal;