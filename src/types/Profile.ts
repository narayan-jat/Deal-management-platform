import DealCard from "@/components/builder-dashboard/Dealcard";

export interface ProfileData {
  id: string;
  fullName: string;
  title: string;
  email: string;
  profilePhoto: string;
  bio: string;
  organizationTag: string;
  createdAt: string;
}

export type ProfileEditFormType = Partial<ProfileData> & {
  profileUrl?: string;
};