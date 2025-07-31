export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  title: string;
  email: string;
  profilePhoto: string;
  bio: string;
  organizationName: string;
  createdAt: string;
}

export type ProfileEditFormType = Partial<ProfileData> & {
  profileUrl?: string;
};