import { useState, useEffect } from 'react';
import { DealModel } from '@/types/deal';
import { DealService } from '@/services/deals/DealService';
import { KanbanBoardColumns } from '@/types/KanbanBoard';
import { DealMemberService } from '@/services/deals/DealMemberService';
import { useAuth } from '@/context/AuthProvider';
import { ErrorService } from '@/services/ErrorService';
import { columnKeyToEnum } from '@/Constants';
import camelcaseKeys from 'camelcase-keys';
import { ProfileService } from '@/services/ProfileService';
import { DealCardType } from '@/types/deal/DealCard';
import { useSearch } from '@/context/SearchProvider';
import { createDealLogs } from './utils';
import { LogType } from '@/types/deal/Deal.enums';
import { getSignedProfileImageUrl } from '@/utility/Utility';

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

  const fetchDeals = async (): Promise<DealCardType[]> => {
    try {
      setLoading(true);
      // Gets all deal IDs of which a member is a part of.
      const dealIds = await DealMemberService.getDealIdsOfMember(user?.id);

      if (!dealIds || dealIds.length === 0) {
        return [];
      }

      // Get complete deal data for each deal ID
      const completeDeals = await Promise.all(
        dealIds.map(async (dealId) => {
          try {
            const completeDeal = await DealService.getCompleteDeal(dealId);
            
            // Transform members to Contributor format
            const contributors = await Promise.all(
              completeDeal.members.map(async (member) => {
                try {
                  const memberDetails = await ProfileService.getProfile(member.member_id);
                  if (!memberDetails) return null;
                  return {
                    id: memberDetails.id,
                    name: memberDetails.first_name + ' ' + memberDetails.last_name,
                    email: memberDetails.email,
                    title: memberDetails.title,
                    profilePath: await getSignedProfileImageUrl(memberDetails.profile_path),
                    role: member.role,
                    addedAt: member.added_at,
                    addedBy: member.added_by,
                  };
                } catch (error) {
                  ErrorService.handleApiError(error, "useDashboard.fetchDeals");
                  return null;
                }
              })
            );

            // Filter out any nulls (in case of failed lookups)
            const validContributors = contributors.filter(Boolean);

            // Transform documents to the expected format
            const documentsBySection: { [sectionName: string]: any[] } = {};
            Object.entries(completeDeal.documents).forEach(([sectionName, docs]) => {
              documentsBySection[sectionName] = docs.map((doc) => ({
                id: doc.id,
                dealId: doc.dealId,
                uploadedBy: doc.uploadedBy,
                filePath: doc.filePath,
                mimeType: doc.mimeType,
                fileName: doc.fileName,
                signatureStatus: doc.signatureStatus,
                uploadedAt: doc.uploadedAt,
                sectionName: doc.sectionName,
                formCategory: doc.formCategory,
                itemId: doc.itemId,
              }));
            });

            // Format the deal card data
            const dealCard: DealCardType = {
              ...completeDeal.deal,
              sections: {
                sections: completeDeal.sections.sections || [],
                overview: completeDeal.sections.overview,
                purpose: completeDeal.sections.purpose,
                collateral: completeDeal.sections.collateral,
                financials: completeDeal.sections.financials,
                nextSteps: completeDeal.sections.nextSteps,
              },
              documents: documentsBySection,
              members: validContributors,
            };

            return dealCard;
          } catch (error) {
            ErrorService.handleApiError(error, "useDashboard.fetchDeals");
            return null;
          }
        })
      );

      // Filter out any nulls (in case of failed lookups)
      return completeDeals.filter(Boolean) as DealCardType[];
    } catch (error) {
      ErrorService.handleApiError(error, "useDashboard");
      setApiError('Failed to fetch deals');
      return [];
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