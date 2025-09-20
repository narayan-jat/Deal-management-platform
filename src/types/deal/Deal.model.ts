// =====================================================
// DEAL DATABASE MODELS
// =====================================================

import { DealStatus, DealMemberRole, LogType, SignatureStatus } from './Deal.enums';

export interface DealModel {
  id: string;
  title: string;
  status: DealStatus;
  createdBy: string; // created_by
  industry: string;
  organizationId?: string; // organization_id
  createdAt: string; // created_at
  updatedAt: string; // updated_at
  requestedAmount: number; // requested_amount
  startDate: string; // starte_date
  endDate?: string; // end_date
  nextMeetingDate: string; // next_meeting_date
  notes: string; // notes
  location: string; // location
}

export interface DealMemberModel {
  id: string;
  dealId: string; // deal_id
  memberId: string; // member_id
  addedBy: string; // added_by
  role: DealMemberRole;
  addedAt: string; // added_at
  updatedAt: string; // updated_at
}

export interface DealPermissionModel {
  id: string;
  dealId: string; // deal_id
  memberId: string; // member_id
  canEdit: boolean; // can_edit
  canComment: boolean; // can_comment
  canUploadFiles: boolean; // can_upload_files
  canView: boolean; // can_view
  canMoveDeal: boolean; // can_move_deal
  grantedAt: string; // granted_at
  updatedAt: string; // updated_at
}

export interface DealLogModel {
  id: string;
  dealId: string; // deal_id
  memberId: string; // member_id
  logType: LogType; // log_type
  logData?: any; // log_data
  createdAt: string; // created_at
}

export interface DealCommentModel {
  id: string;
  dealId: string; // deal_id
  memberId: string; // member_id
  comment: string;
  createdAt: string; // created_at
}

export interface DealDocumentModel {
  id: string;
  dealId: string; // deal_id
  uploadedBy: string; // uploaded_by
  filePath: string; // file_path
  mimeType?: string; // mime_type
  fileName: string; // file_name
  uploadedAt: string; // uploaded_at
  signatureStatus: SignatureStatus; // signature_status
  signedAt?: string; // signed_at
  sectionName?: string; // section_name - NEW: identifies which section the document belongs to
  formCategory?: string; // form_category - NEW: sub-categorization within sections
  itemId?: string; // item_id - NEW: links to specific item within section (e.g., collateral item ID)
}