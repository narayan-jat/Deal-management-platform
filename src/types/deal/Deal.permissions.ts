import { DealMemberRole } from "./Deal.enums";

export type DealPermission = {
  dealId: string; // deal_id
  memberId: string; // member_id
  canEdit: boolean; // can_edit
  canComment: boolean; // can_comment
  canUploadFiles: boolean; // can_upload_files
  canView: boolean; // can_view
  canMoveDeal: boolean; // can_move_deal
  grantedAt: string; // granted_at
  updatedAt: string; // updated_at
};

// Optional: merged with role
export type DealAccess = DealPermission & {
  role: DealMemberRole;
};
