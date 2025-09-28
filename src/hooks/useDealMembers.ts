import { useState } from 'react';
import { DealMemberService } from '@/services/deals/DealMemberService';
import { ProfileService } from '@/services/ProfileService';
import { getSignedProfileImageUrl } from '@/utility/Utility';
import { ErrorService } from '@/services/ErrorService';
import { Contributor } from '@/types/deal/Deal.members';

export const useDealMembers = (dealId: string) => {
  const [members, setMembers] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch deal members with profile information
  const fetchDealMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get deal members with profile information
      const dealMembers = await DealMemberService.getDealMembers(dealId);
      
      // Transform the data to include profile information
      const membersWithProfiles = await Promise.all(
        dealMembers.map(async (member) => {
          try {
            // Get profile information for each member
            const profile = await ProfileService.getProfile(member.member_id);
            if (!profile) return null;
            
            return {
              id: profile.id,
              name: `${profile.first_name} ${profile.last_name}`,
              email: profile.email,
              title: profile.title,
              profilePath: await getSignedProfileImageUrl(profile.profile_path),
              role: member.role,
              addedAt: member.added_at,
              addedBy: member.added_by,
            };
          } catch (error) {
            ErrorService.handleApiError(error, "useDealMembers.fetchDealMembers");
            return null;
          }
        })
      );
      
      const validMembers = membersWithProfiles.filter(Boolean) as Contributor[];
      setMembers(validMembers);
      return validMembers;
    } catch (error) {
      ErrorService.handleApiError(error, "useDealMembers.fetchDealMembers");
      setError('Failed to fetch deal members');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Delete a member from the deal
  const deleteMember = async (member: Contributor) => {
    try {
      setLoading(true);
      setError(null);

      // Remove member from database
      await DealMemberService.removeDealMember(dealId, member.id);

      // Update local state by removing the member
      setMembers(prevMembers => 
        prevMembers.filter(m => m.id !== member.id)
      );

      return true;
    } catch (error) {
      ErrorService.handleApiError(error, "useDealMembers.deleteMember");
      setError('Failed to delete member');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    members,
    loading,
    error,
    fetchDealMembers,
    deleteMember,
  };
};
