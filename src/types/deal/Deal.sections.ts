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
  NEXT_STEPS = 'NEXT_STEPS'
}

// Person Tag Type for tagging people in different roles
export enum PersonTagType {
  BORROWERS = 'borrowers',
  LENDERS = 'lenders',
  OTHER_PARTIES = 'other_parties'
}
export interface PersonTag {
  id: string;
  name: string;
  email: string;
  role: PersonTagType;
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
  borrowers: PersonTag[];
  lenders: PersonTag[];
  otherParties: PersonTag[];
  loanRequest: number;
  totalProjectCost: number;
  rate: Rate;
  ltv: number;
  dscr: number;
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

// Deal Collateral Model - stores individual collateral items
export interface DealCollateralModel {
  id: string;
  dealId: string;
  collateralType: string; // PROPERTY, FINANCIAL_ASSETS, CORPORATE_ASSETS
  collateralData: any; // JSON field storing the specific collateral item data
  createdAt: string;
}


// Deal Financials Model
export interface DealFinancialsModel {
  id: string;
  dealId: string;
  sourcesOfFunds: string;
  usesOfFunds: string;
  createdAt: string;
}

// Note: DealSeniorDebtModel removed as Senior Debt section was removed

// Deal Next Steps Model
export interface DealNextStepsModel {
  id: string;
  dealId: string;
  expectedCloseDate: string;
  notes: string;
  startDate: string;
  nextMeetingDate: string;
  createdAt: string;
}

// Form Data Types for each section
export interface DealOverviewForm {
  borrowers: PersonTag[];
  lenders: PersonTag[];
  otherParties: PersonTag[];
  loanRequest: number;
  totalProjectCost: number;
  rate: Rate;
  ltv: number;
  dscr: number;
}

export interface DealPurposeForm {
  purpose: string;
  timeline: string;
}

// Re-export constants from centralized file
export {
  CollateralType,
  FinancialAssetSubtype,
  CorporateAssetSubtype,
  LienPosition,
  LienStatus,
  PropertyType,
  PropertyCondition,
  TimelineOption,
  RecourseType,
  COLLATERAL_TYPE_OPTIONS,
  FINANCIAL_ASSET_SUBTYPE_OPTIONS,
  CORPORATE_ASSET_SUBTYPE_OPTIONS,
  LIEN_POSITION_OPTIONS,
  LIEN_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_CONDITION_OPTIONS,
  TIMELINE_OPTIONS,
  RECOURSE_OPTIONS
} from '@/constants/DealFormConstants';
import { CollateralType } from '@/constants/DealFormConstants';
// Debt Details
export interface DebtDetails {
  lenderName: string;
  outstandingBalance: number;
  originalLoanAmount?: number;
  interestRate: number;
  maturityDate: string;
  lienPosition: string;
  collateralSecuredAgainst?: string;
  notes?: string;
}

// Property Collateral Item
export interface PropertyCollateralItem {
  id: string;
  collateralType: CollateralType.PROPERTY;
  description: string;
  propertyType: string;
  buildingSize: number;
  yearBuilt: number;
  occupancy: number;
  condition: string;
  location: string;
  appraisedValue: number;
  riskNotes: string;
  hasDebt: boolean;
  debtDetails?: DebtDetails;
  notes?: string;
  documents: any[];
}

// Financial Assets Collateral Item
export interface FinancialAssetsCollateralItem {
  id: string;
  collateralType: CollateralType.FINANCIAL_ASSETS;
  assetType: string; // Cash, Marketable Securities, Receivables, Inventory
  custodianHolder: string;
  value: number;
  lienStatus: string;
  notes: string;
  hasDebt: boolean;
  debtDetails?: DebtDetails;
  documents: any[];
}

// Corporate Assets Collateral Item
export interface CorporateAssetsCollateralItem {
  id: string;
  collateralType: CollateralType.CORPORATE_ASSETS;
  assetType: string; // Equipment/Machinery, Vehicles, Equity Pledges, etc.
  description: string;
  estimatedValue: number;
  ownership: string;
  notes: string;
  hasDebt: boolean;
  debtDetails?: DebtDetails;
  documents: any[];
}

// Union type for all collateral items
export type CollateralItem = PropertyCollateralItem | FinancialAssetsCollateralItem | CorporateAssetsCollateralItem;

export interface DealCollateralForm {
  items: CollateralItem[];
}

export interface DealFinancialsForm {
  sourcesOfFunds: string;
  usesOfFunds: string;
  historicalDocuments: any[];
  projectedDocuments: any[];
}

// Note: DealSeniorDebtForm removed as Senior Debt section was removed

export interface DealNextStepsForm {
  expectedCloseDate: string;
  notes: string;
  startDate: string;
  nextMeetingDate: string;
}

// Complete Deal Form Data
export interface CompleteDealForm {
  // Basic deal info (existing)
  title: string;
  industry: string;
  organizationId: string;
  status: string;
  location: string;
  notes: string;
  createdBy?: string;
  // Sections
  overview: DealOverviewForm;
  purpose: DealPurposeForm;
  collateral: DealCollateralForm;
  financials: DealFinancialsForm;
  nextSteps: DealNextStepsForm;
  
  // Section enablement
  sectionsEnabled: {
    [DealSectionName.BASIC_INFO]: boolean;
    [DealSectionName.OVERVIEW]: boolean;
    [DealSectionName.PURPOSE]: boolean;
    [DealSectionName.COLLATERAL]: boolean;
    [DealSectionName.FINANCIALS]: boolean;
    [DealSectionName.NEXT_STEPS]: boolean;
  };
  
  // Documents for each section
  documents: {
    [DealSectionName.BASIC_INFO]: any[];
    [DealSectionName.OVERVIEW]: any[];
    [DealSectionName.PURPOSE]: any[];
    [DealSectionName.COLLATERAL]: any[];
    [DealSectionName.FINANCIALS]: any[];
  };
}

