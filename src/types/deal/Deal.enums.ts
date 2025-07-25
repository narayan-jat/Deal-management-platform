// =====================================================
// DEAL ENUMS
// =====================================================
// All enums for roles, status, and other constants
// =====================================================

// Deal Status Enum
export enum DealStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  NEGOTIATION = 'NEGOTIATION',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

// Deal Member Role Enum
export enum DealMemberRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
  ADMIN = 'ADMIN',
  COMMENTER = 'COMMENTER'
}

// Log Type Enum
export enum LogType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  COMMENTED = 'COMMENTED'
}

// Signature Status Enum
export enum SignatureStatus {
  UNSIGNED = 'UNSIGNED',
  SIGNED = 'SIGNED',
  PARTIALLY_SIGNED = 'PARTIALLY_SIGNED',
  REJECTED = 'REJECTED'
}

// Permission Types
export enum PermissionType {
  CAN_EDIT = 'can_edit',
  CAN_COMMENT = 'can_comment',
  CAN_UPLOAD_FILES = 'can_upload_files',
  CAN_VIEW = 'can_view',
  CAN_MOVE_DEAL = 'can_move_deal'
} 