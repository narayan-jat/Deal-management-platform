//==========================
// Deal Card
//==========================

import { DealModel } from "./Deal.model";
import { DealDocument } from "./Deal.documents";
import { Contributor } from "./Deal.members";
import { DealStatus } from "./Deal.enums";
import { DealSectionModel, Rate } from "./Deal.sections";
import { PersonTag } from "./Deal.sections";


export type DealCardType = DealModel & {
  sections: {
    sections: DealSectionModel[];
    overview: any;
    purpose: any;
    collateral: any;
    financials: any;
    nextSteps: any;
  };
  documents: {
    [sectionName: string]: DealDocument[];
  };
  members: Contributor[];
}

export const StatusToTitleMap = {
  [DealStatus.NEW]: "New",
  [DealStatus.IN_PROGRESS]: "In Progress",
  [DealStatus.NEGOTIATION]: "Negotiation",
  [DealStatus.COMPLETED]: "Completed",
  [DealStatus.REJECTED]: "Rejected",
  [DealStatus.DRAFT]: "Draft",
}

export type DealCardContent = {
  title: string;
  status: DealStatus;
  loanRequest?: number;
  industry?: string;
  rate?: Rate;
  ltv?: string;
  nextMeetingDate?: string;
  term?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members: Contributor[];
  borrowers: PersonTag[];
}