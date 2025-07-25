import { useState, useEffect } from 'react';
import { DealStatus } from '@/types/deal';
import { DealService } from '@/services/deals/DealService';
import { KanbanBoardColumns } from '@/types/KanbanBoard';
import { DealMemberService } from '@/services/deals/DealMemberService';
import { useAuth } from '@/context/AuthProvider';
import { ErrorService } from '@/services/ErrorService';
import { columnKeyToEnum } from '@/Constants';
import camelcaseKeys from 'camelcase-keys';
import { ProfileService } from '@/services/ProfileService';
import { ProfileStorageService } from '@/services/ProfileStorageService';

const getSignedProfileImageUrl = async (profilePhoto: string) => {
  if (!profilePhoto) return null;
  const signedUrl = await ProfileStorageService.getProfileImageSignedUrl(profilePhoto);
  return signedUrl;
}

export const useKanbanBoard = () => {
  const [initialDeals, setInitialDeals] = useState<KanbanBoardColumns>({
    new: [],
    inProgress: [],
    negotiation: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch the deals when component is mounted
  useEffect(() => {
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
                ErrorService.handleApiError(error, "useKanbanBoard");
                return null;
              }
            })
          );
          // Filter out any nulls (in case of failed lookups)
          deal.contributors = contributors.filter(Boolean);
        }));

        // convert to camelCase
        const camelCaseDeals = camelcaseKeys(deals, { deep: true });
        console.log(camelCaseDeals);
        if (camelCaseDeals && camelCaseDeals.length > 0) {
          const dealCards: KanbanBoardColumns = {
            new: [],
            inProgress: [],
            negotiation: [],
            completed: [],
          };
          
          camelCaseDeals.forEach((deal) => {            
            // Find the correct column for this deal
            const columnKey = Object.keys(columnKeyToEnum).find(
              key => columnKeyToEnum[key as keyof typeof columnKeyToEnum] === deal.status
            );
            
            if (columnKey && dealCards[columnKey as keyof KanbanBoardColumns]) {
              dealCards[columnKey as keyof KanbanBoardColumns].push(deal);
            }
          });
          console.log(dealCards);
          setInitialDeals(dealCards);
        }
      } catch (error) {
        ErrorService.handleApiError(error, "useKanbanBoard");
        setApiError('Failed to fetch deals');
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.id) {
      fetchDeals();
    }
  }, [user?.id]);

  const handleUpdateDeals = (deals: KanbanBoardColumns) => {
    setInitialDeals(deals);
  }

  return { loading, apiError, initialDeals, handleUpdateDeals };
};
