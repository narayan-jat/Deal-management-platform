// =====================================================
// DEAL SECTIONS TYPES
// =====================================================
// All types for deal sections based on the database schema
// =====================================================

// Deal Section Name Enum
export enum DealSectionName {
  BASIC_INFO = 'BASIC_INFO',
  OVERVIEW = 'OVERVIEW',
  PURPOSE = 'PURPOSE',
  COLLATERAL = 'COLLATERAL',
  FINANCIALS = 'FINANCIALS',
  SENIOR_DEBT = 'SENIOR_DEBT',
  NEXT_STEPS = 'NEXT_STEPS'
}

// Person Tag Type for tagging people in different roles
export interface PersonTag {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Rate Type - can be a single number or range
export interface Rate {
  type: 'single' | 'range';
  value?: number;
  minValue?: number;
  maxValue?: number;
}

// Deal Section Model
export interface DealSectionModel {
  id: string;
  dealId: string;
  sectionName: DealSectionName;
  enabled: boolean;
  createdAt: string;
}

// Overview Section Model
export interface DealOverviewModel {
  id: string;
  dealId: string;
  sponsors: PersonTag[];
  borrowers: PersonTag[];
  lenders: PersonTag[];
  loanRequest: number;
  rate: Rate;
  status: string;
  createdAt: string;
}

// Deal Purpose Model
export interface DealPurposeModel {
  id: string;
  dealId: string;
  purpose: string;
  timeline: string;
  createdAt: string;
}

// Deal Collateral Model
export interface DealCollateralModel {
  id: string;
  dealId: string;
  propertyDescription: string;
  propertyType: string;
  buildingSize: number;
  yearBuilt: number;
  occupancy: number;
  condition: string;
  location: string;
  appraisedValue: number;
  riskNotes: string;
  createdAt: string;
}

// Deal Financials Model
export interface DealFinancialsModel {
  id: string;
  dealId: string;
  sourcesOfFunds: string;
  usesOfFunds: string;
  historicalFinancials: string;
  projectedFinancials: string;
  exitStrategy: string;
  ltv: number; // Loan-to-Value
  dscr: number; // Debt Service Coverage Ratio
  createdAt: string;
}

// Deal Senior Debt Model
export interface DealSeniorDebtModel {
  id: string;
  dealId: string;
  amount: number;
  interestRate: number;
  term: string;
  amortization: string;
  recourse: string;
  prepaymentPenalty: string;
  fees: string;
  createdAt: string;
}

// Deal Next Steps Model
export interface DealNextStepsModel {
  id: string;
  dealId: string;
  expectedCloseDate: string;
  notes: string;
  createdAt: string;
}

// Form Data Types for each section
export interface DealOverviewForm {
  sponsors: PersonTag[];
  borrowers: PersonTag[];
  lenders: PersonTag[];
  loanRequest: number;
  rate: Rate;
  status: string;
}

export interface DealPurposeForm {
  purpose: string;
  timeline: string;
}

export interface DealCollateralForm {
  propertyDescription: string;
  propertyType: string;
  buildingSize: number;
  yearBuilt: number;
  occupancy: number;
  condition: string;
  location: string;
  appraisedValue: number;
  riskNotes: string;
}

export interface DealFinancialsForm {
  sourcesOfFunds: string;
  usesOfFunds: string;
  historicalFinancials: string;
  projectedFinancials: string;
  exitStrategy: string;
  ltv: number;
  dscr: number;
}

export interface DealSeniorDebtForm {
  amount: number;
  interestRate: number;
  term: string;
  amortization: string;
  recourse: string;
  prepaymentPenalty: string;
  fees: string;
}

export interface DealNextStepsForm {
  startDate: string;
  nextMeetingDate: string;
  expectedCloseDate: string;
  notes: string;
}

// Complete Deal Form Data
export interface CompleteDealForm {
  // Basic deal info (existing)
  title: string;
  industry: string;
  organizationId: string;
  requestedAmount: number;
  status: string;
  startDate: string;
  endDate: string;
  nextMeetingDate: string;
  location: string;
  notes: string;
  
  // Sections
  overview: DealOverviewForm;
  purpose: DealPurposeForm;
  collateral: DealCollateralForm;
  financials: DealFinancialsForm;
  seniorDebt: DealSeniorDebtForm;
  nextSteps: DealNextStepsForm;
  
  // Section enablement
  sectionsEnabled: {
    [DealSectionName.OVERVIEW]: boolean;
    [DealSectionName.PURPOSE]: boolean;
    [DealSectionName.COLLATERAL]: boolean;
    [DealSectionName.FINANCIALS]: boolean;
    [DealSectionName.SENIOR_DEBT]: boolean;
    [DealSectionName.NEXT_STEPS]: boolean;
  };
  
  // Documents for each section
  documents: {
    [DealSectionName.OVERVIEW]: any[];
    [DealSectionName.PURPOSE]: any[];
    [DealSectionName.COLLATERAL]: any[];
    [DealSectionName.FINANCIALS]: any[];
    [DealSectionName.SENIOR_DEBT]: any[];
    [DealSectionName.NEXT_STEPS]: any[];
  };
}

// Property Type Options
export const PROPERTY_TYPE_OPTIONS = [
  { value: 'office', label: 'Office' },
  { value: 'multifamily', label: 'Multifamily' },
  { value: 'retail', label: 'Retail' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'mixed_use', label: 'Mixed Use' },
  { value: 'land', label: 'Land' },
  { value: 'other', label: 'Other' }
];

// Recourse Options
export const RECOURSE_OPTIONS = [
  { value: 'full', label: 'Full Recourse' },
  { value: 'limited', label: 'Limited Recourse' },
  { value: 'non_recourse', label: 'Non-Recourse' }
];

// Condition Options
export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
  { value: 'needs_renovation', label: 'Needs Renovation' }
];

// Timeline Options
export const TIMELINE_OPTIONS = [
  { value: '1-3_months', label: '1-3 Months' },
  { value: '3-6_months', label: '3-6 Months' },
  { value: '6-12_months', label: '6-12 Months' },
  { value: '1-2_years', label: '1-2 Years' },
  { value: '2-5_years', label: '2-5 Years' },
  { value: '5+_years', label: '5+ Years' }
];
