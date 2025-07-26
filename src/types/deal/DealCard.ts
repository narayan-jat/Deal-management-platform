//==========================
// Deal Card
//==========================

import { DealModel } from "./Deal.model";
import { DealDocument } from "./Deal.documents";
import { UploadDocumentForm } from "./Deal.documents";
import { Contributor, InviteMemberForm } from "./Deal.members";

export type DealCardType = DealModel & {
  contributors: Contributor[];
  documents: DealDocument[];
}



export type DealCardForm = Partial<DealCardType> & {
  documents: UploadDocumentForm[];
  members: InviteMemberForm[];
}