//==========================
// Deal Card
//==========================

import { DealModel } from "./Deal.model";

export type DealCardType = DealModel & {
  contributors: Contributor[];
}

export type Contributor = {
  id: string;
  name: string;
  email: string;
  title: string;
  profilePhoto: string;
  role: string;
}