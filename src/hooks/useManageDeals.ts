import { useState, useEffect } from 'react';
import { DealCardType } from '@/types/deal/DealCard';
import { DealStatus } from '@/types/deal/Deal.enums';
import { DealService } from '@/services/deals/DealService';
import { DealMemberService } from '@/services/deals/DealMemberService';
import { DealDocumentService } from '@/services/deals/DealDocumentService';
import { ProfileService } from '@/services/ProfileService';
import { ErrorService } from '@/services/ErrorService';
import { useAuth } from '@/context/AuthProvider';
import { useUserProfile } from '@/context/UserProfileProvider';
import camelcaseKeys from 'camelcase-keys';
import { getSignedProfileImageUrl } from '@/utility/Utility';

export const useManageDeals = () => {
  const [draftDeals, setDraftDeals] = useState<DealCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { userProfile } = useUserProfile();

  const fetchDraftDeals = async () => {
    if (!user?.id) {
      setError('User not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all deals for the user
      const deals = await DealService.getAllDealsForUser(user.id);
      
      // Filter for draft deals only
      const draftDealsData = deals.filter(deal => deal.status === DealStatus.DRAFT);

      // Enrich deals with member and document information
      const enrichedDeals = await Promise.all(
        draftDealsData.map(async (deal) => {
          try {
            // Get deal members
            const dealMembers = await DealMemberService.getDealMembers(deal.id);
            const contributors = await Promise.all(
              dealMembers.map(async (member) => {
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
                  };
                } catch (error) {
                  ErrorService.handleApiError(error, "useManageDeals");
                  return null;
                }
              })
            );

            // Get deal documents
            const dealDocuments = await DealDocumentService.getDealDocuments(deal.id);
            const documents = dealDocuments.map((document) => ({
              id: document.id,
              fileName: document.file_name,
              filePath: document.file_path,
              mimeType: document.mime_type,
              signatureStatus: document.signature_status,
              uploadedAt: document.uploaded_at,
              uploadedBy: document.uploaded_by,
            }));

            // Return enriched deal
            return {
              ...deal,
              contributors: contributors.filter(Boolean),
              documents,
            };
          } catch (error) {
            ErrorService.handleApiError(error, "useManageDeals");
            return null;
          }
        })
      );

      // Filter out null values and convert to camelCase
      const validDeals = enrichedDeals.filter(Boolean);
      const camelCaseDeals = camelcaseKeys(validDeals, { deep: true }) as DealCardType[];
      
      setDraftDeals(camelCaseDeals);
    } catch (error) {
      console.error('Error fetching draft deals:', error);
      setError('Failed to load draft deals');
      ErrorService.handleApiError(error, "useManageDeals");
    } finally {
      setLoading(false);
    }
  };

  const refreshDeals = () => {
    fetchDraftDeals();
  };

  useEffect(() => {
    fetchDraftDeals();
  }, [user?.id]);

  return {
    draftDeals,
    loading,
    error,
    refreshDeals,
  };
}; 