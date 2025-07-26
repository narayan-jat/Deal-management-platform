import { DealStatus } from "./types/deal";
import { DealMemberRole } from "./types/deal/Deal.enums";
// Industry Options
export const INDUSTRY_OPTIONS = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Education', label: 'Education' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Consulting', label: 'Consulting' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Other', label: 'Other' }
] as const;

export const columnKeyToEnum = {
  new: DealStatus.NEW,
  inProgress: DealStatus.IN_PROGRESS,
  negotiation: DealStatus.NEGOTIATION,
  completed: DealStatus.COMPLETED,
};

export const editAccessRoles = [
  DealMemberRole.OWNER,
  DealMemberRole.EDITOR,
  DealMemberRole.ADMIN,
];