//==========================
// Deal Card
//==========================

import { DealModel } from "./Deal.model";
import { DealDocument } from "./Deal.documents";
import { UploadDocumentForm } from "./Deal.documents";
import { Contributor, InviteMemberForm } from "./Deal.members";
import { DealStatus } from "./Deal.enums";


export type DealCardType = DealModel & {
  contributors: Contributor[];
  documents: DealDocument[];
}

export const StatusToTitleMap = {
  [DealStatus.NEW]: "New",
  [DealStatus.IN_PROGRESS]: "In Progress",
  [DealStatus.NEGOTIATION]: "Negotiation",
  [DealStatus.COMPLETED]: "Completed",
  [DealStatus.REJECTED]: "Rejected",
  [DealStatus.DRAFT]: "Draft",
}

export type DealCardForm = Partial<DealCardType> & {
  documents: UploadDocumentForm[];
  members: InviteMemberForm[];
}