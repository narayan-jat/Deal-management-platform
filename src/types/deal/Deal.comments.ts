// Deal comments form types

export type Comment = {
  id: string;
  dealId: string;
  comment: string;
  createdAt: string;
  memberId: string;
};

export type CommentForm = {
  comment: string;
  createdAt: string;
  memberId: string;
};