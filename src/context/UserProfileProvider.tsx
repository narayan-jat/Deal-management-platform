import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { UserProfileContextType, UserProfileData, UserOrganization } from '@/types/UserProfile';
import { ProfileService } from '@/services/ProfileService';
import { OrganizationMemberService } from '@/services/organization/OrganizationMemberService';
import { OrganizationService } from '@/services/organization/OrganizationService';
import { ErrorService } from '@/services/ErrorService';
import camelcaseKeys from 'camelcase-keys';
const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!user?.id) {
      setUserProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the profile basic details.
      const profile = await ProfileService.getProfile(user.id);
      // Get the organization memberships.
      const organizationMemberships = await OrganizationMemberService.getOrgMembersByMemberId(user.id);
      // Get the organization details.
      const organizations = await Promise.all(organizationMemberships.map(async (membership) => {
        const organization = await OrganizationService.getOrganizationById(membership.organization_id);
        return organization;
      }));

      // Convert the organizations to camel case.
      const camelCaseOrganizations = organizations.map(org => camelcaseKeys(org, { deep: true }));
      // Convert the organization memberships to camel case.
      const camelCaseOrganizationMemberships = organizationMemberships.map(membership => camelcaseKeys(membership, { deep: true }));
      // Convert profile to camel case.
      const camelCaseProfile = camelcaseKeys(profile, { deep: true });
      // consider first organization as primary organization for now.
      const userOrganizations: UserOrganization[] = camelCaseOrganizations.map((org: any, idx: number) => ({
        organization: org[0],
        membership: camelCaseOrganizationMemberships[idx]
      }));
      // Create the user profile data.
      const userProfile: UserProfileData = {
        ...camelCaseProfile,
        organizations: userOrganizations,
        primaryOrganization: userOrganizations[0],
      };
      setUserProfile(userProfile);
    } catch (err) {
      ErrorService.logError(err, 'UserProfileProvider.fetchUserProfile');
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile data
  useEffect(() => {
    fetchUserProfile();
  }, [user?.id]);

  const refreshUserProfile = () => {
    fetchUserProfile();
  };
  
  const value: UserProfileContextType = {
    userProfile,
    loading,
    error,
    refreshUserProfile,
  };

  return (
    <UserProfileContext.Provider value={{ ...value, refreshUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
} 