export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  profilePhoto: string;
  bio: string;
  organizationTag: string;
  createdAt: string;
}

export type ProfileEditFormType = Partial<ProfileData> & {
  profileUrl?: string;
};