import { ProfileData } from './Profile';
import { Organization, OrganizationMember } from './organization/Organization.model';

export interface UserProfileData extends ProfileData {
  // Extended profile information
  organizations?: UserOrganization[];
  primaryOrganization?: UserOrganization;
}

export interface UserOrganization {
  organization: Organization;
  membership: OrganizationMember;
}

export interface UserProfileContextType {
  userProfile: UserProfileData | null;
  loading: boolean;
  error: string | null;
  refreshUserProfile: () => void;
}

export interface UserProfileState {
  userProfile: UserProfileData | null;
  loading: boolean;
  error: string | null;
} 