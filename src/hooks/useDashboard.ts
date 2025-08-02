import { useState, useEffect } from 'react';
import { DealModel, DealStatus } from '@/types/deal';
import { DealService } from '@/services/deals/DealService';
import { KanbanBoardColumns } from '@/types/KanbanBoard';
import { DealMemberService } from '@/services/deals/DealMemberService';
import { useAuth } from '@/context/AuthProvider';
import { ErrorService } from '@/services/ErrorService';
import { columnKeyToEnum } from '@/Constants';
import camelcaseKeys from 'camelcase-keys';
import { ProfileService } from '@/services/ProfileService';
import { ProfileStorageService } from '@/services/ProfileStorageService';
import { DealDocumentService } from '@/services/deals/DealDocumentService';
import { DealCardType } from '@/types/deal/DealCard';
import { useSearch } from '@/context/SearchProvider';
import { createDealLogs } from './utils';
import { LogType } from '@/types/deal/Deal.enums';

/**
 * Get the signed URL for the profile image.
 * @param profilePhoto - The profile photo to get the signed URL for.
 * @returns The signed URL for the profile image.
 */
export const getSignedProfileImageUrl = async (profilePhoto: string) => {
  if (!profilePhoto) return null;
  const signedUrl = await ProfileStorageService.getProfileImageSignedUrl(profilePhoto);
  return signedUrl;
}

export const useDashboard = () => {
  const [initialDeals, setInitialDeals] = useState<KanbanBoardColumns>({
    new: [],
    inProgress: [],
    negotiation: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();
  const { setAllDeals } = useSearch();

  const fetchDeals = async () => {
    try {
      setLoading(true);
      // Gets all deal IDs of which a member is a part of.
      const dealIds = await DealMemberService.getDealIdsOfMember(user?.id);

      // Get the deals from the deal IDs.
      const deals = await DealService.getDeals(dealIds);

      // Get the members of the deals to show on the card.
      await Promise.all(deals.map(async (deal) => {
        const dealMembers = await DealMemberService.getDealMembers(deal.id);
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
                profilePhoto: await getSignedProfileImageUrl(memberDetails.profile_photo),
                role: member.role,
              };
            } catch (error) {
              ErrorService.handleApiError(error, "useDashboard");
              return null;
            }
          })
        );
        // Filter out any nulls (in case of failed lookups)
        deal.contributors = contributors.filter(Boolean);
      }));

      // Get the documents of the deals to show on the card.
      await Promise.all(deals.map(async (deal) => {
        const dealDocuments = await DealDocumentService.getDealDocuments(deal.id);
        deal.documents = dealDocuments.map((document) => ({
          id: document.id,
          fileName: document.file_name,
          filePath: document.file_path,
          mimeType: document.mime_type,
          signatureStatus: document.signature_status,
          uploadedAt: document.uploaded_at,
          uploadedBy: document.uploaded_by,
        }));
      }));

      // convert to camelCase
      const camelCaseDeals = camelcaseKeys(deals, { deep: true });
      return camelCaseDeals;
    } catch (error) {
      ErrorService.handleApiError(error, "useDashboard");
      setApiError('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch the deals when component is mounted
  useEffect(() => {

    if (user?.id) {
      handleConvertToKanbanBoardColumns();
    }
  }, [user?.id]);

  const handleUpdateDeals = (deals: KanbanBoardColumns | null) => {
    if (deals) {
      setInitialDeals(deals);
    } else {
      handleConvertToKanbanBoardColumns();
    }
  }

  const handleConvertToKanbanBoardColumns = async () => {
    try {
      const deals: DealCardType[] = await fetchDeals();
      const dealCards: KanbanBoardColumns = {
        new: [],
        inProgress: [],
        negotiation: [],
        completed: [],
      };

      if (deals && deals.length > 0) {
        deals.forEach((deal) => {
          // Find the correct column for this deal
          const columnKey = Object.keys(columnKeyToEnum).find(
            key => columnKeyToEnum[key as keyof typeof columnKeyToEnum] === deal.status
          );

          if (columnKey && dealCards[columnKey as keyof KanbanBoardColumns]) {
            dealCards[columnKey as keyof KanbanBoardColumns].push(deal);
          }
        });
      }

      // Update search context with all deals
      setAllDeals(deals || []);

      setInitialDeals(dealCards);
    } catch (error) {
      ErrorService.handleApiError(error, "useDashboard");
      setApiError('Failed to convert to kanban board columns');
      // Set empty state on error
      setInitialDeals({
        new: [],
        inProgress: [],
        negotiation: [],
        completed: [],
      });
      setAllDeals([]);
    }
  }

  const handleUpdateDealStatus = async (dealId: string, status: keyof typeof columnKeyToEnum, oldStatus: keyof typeof columnKeyToEnum) => {
    try {
      const updatedDeal = await DealService.updateDeal({ id: dealId, status: columnKeyToEnum[status], updatedAt: new Date().toISOString() });
      const camelCaseDeal = camelcaseKeys(updatedDeal, { deep: true }) as DealModel;
      // update the deal logs.
      await createDealLogs(user.id, camelCaseDeal.id, {
        deal: {
          status: status,
          oldStatus: oldStatus,
          action: 'status changed',
        },
      }, LogType.UPDATED);
      return updatedDeal;
    } catch (error) {
      ErrorService.handleApiError(error, "useDashboard");
      setApiError('Failed to update deal status');
    }
  }

  return { loading, apiError, initialDeals, handleUpdateDeals, fetchDeals, handleConvertToKanbanBoardColumns, handleUpdateDealStatus };
}; 