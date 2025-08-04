import { UserProfileData } from "./UserProfile";

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  title: string;
  email: string;
  profilePath: string;
  bio: string;
  createdAt: string;
}

export type ProfileEditFormType = Partial<UserProfileData> & {
  profileUrl?: string;
};