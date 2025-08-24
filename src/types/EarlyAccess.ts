export interface EarlyAccessModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  accountType: EarlyAccessAccountType;
  createdAt: string;
}

export type EarlyAccessAccountType = "LENDER" | "BORROWER" | "BROKER" | "OTHER";

export const EarlyAccessAccountTypeLabels: Record<EarlyAccessAccountType, string> = {
  LENDER: "Lender",
  BORROWER: "Borrower",
  BROKER: "Broker",
  OTHER: "Other",
};
