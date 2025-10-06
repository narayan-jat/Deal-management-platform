//==========================
// Deal View Types
//==========================

import { DealDocument } from "./Deal.documents";
import { DealSectionModel } from "./Deal.sections";
import { Contributor } from "./Deal.members";

// Complete deal view data structure
export interface DealViewType {
  // Basic deal information
  id: string;
  title: string;
  industry: string;
  organizationId: string;
  status: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;

  // Deal sections data
  sections: {
    sections: DealSectionModel[];
    overview: any;
    purpose: any;
    collateral: any;
    financials: any;
    nextSteps: any;
  };

  // Documents organized by section
  documents: { [sectionName: string]: DealDocument[] };

  // Deal members (contributors)
  members: Contributor[];
}
