import { InviteMemberForm } from './Deal.members';
import { UploadDocumentForm } from './Deal.documents';
import { CommentForm } from './Deal.comments';

export type AddDealMembersForm = {
  members: InviteMemberForm[]; // from deal.members.ts
};

export type UploadDealDocumentsForm = {
  documents: UploadDocumentForm[]; // from deal.documents.ts
};

export type DealCommentsForm = {
  comments: CommentForm[]; // from deal.comments.ts
};