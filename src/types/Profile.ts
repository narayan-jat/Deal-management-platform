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
  matrix_user_id?: string; // Matrix user ID for chat functionality
}

export type ProfileEditFormType = Partial<UserProfileData> & {
  profileUrl?: string;
};