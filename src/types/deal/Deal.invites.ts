import { DealMemberRole } from "./Deal.enums";
import { ProfileData } from "@/types/Profile";

export enum InviteStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

export interface Invite {
  id: string;
  dealId: string;
  email: string;
  role: DealMemberRole;
  status: InviteStatus;
  invitedBy: string;
  permissions?: {
    canEdit?: boolean;
    canComment?: boolean;
    canView?: boolean;
    canUploadFiles?: boolean;
    canMoveDeal?: boolean;
  };
  createdAt: string;
}

export type InviteForm = Partial<Invite>;

export interface SharedLink {
  id: string;
  dealId: string;
  token: string;
  expiresAt?: string;
  role: DealMemberRole;
  permissions?: {
    canEdit?: boolean;
    canComment?: boolean;
    canView?: boolean;
    canUploadFiles?: boolean;
    canMoveDeal?: boolean;
  };
  createdBy: string;
  createdAt: string;
  shareableUrl: string;
}

export type SharedLinkForm = Partial<SharedLink>;

export type UserSearchResult = Partial<ProfileData>;

export type InviteType = 'link' | 'email';