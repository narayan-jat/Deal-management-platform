import { DealStatus } from './Deal.enums';
import { InviteMemberForm } from './Deal.members';
import { UploadDocumentForm } from './Deal.documents';

export type DealFormValues = {
  title: string;
  industry: string;
  createdBy: string;
  organizationId: string;
  requestedAmount: number;
  status: DealStatus;
  startDate: string;
  endDate: string;
  updatedAt: string;
  nextMeetingDate: string;
};

export type AddDealMembersForm = {
  members: InviteMemberForm[]; // from deal.members.ts
};

export type UploadDealDocumentsForm = {
  documents: UploadDocumentForm[]; // from deal.documents.ts
};
