// =====================================================
// DEAL FORM CONSTANTS
// =====================================================
// Centralized constants for all dropdown values and options
// =====================================================

// Collateral Types
export enum CollateralType {
  PROPERTY = 'PROPERTY',
  FINANCIAL_ASSETS = 'FINANCIAL_ASSETS',
  CORPORATE_ASSETS = 'CORPORATE_ASSETS'
}

// Financial Document Types
export enum FinancialFormCategory {
  HISTORICAL = 'HISTORICAL',
  PROJECTED = 'PROJECTED'
}

// Financial Asset Subtypes
export enum FinancialAssetSubtype {
  CASH = 'CASH',
  MARKETABLE_SECURITIES = 'MARKETABLE_SECURITIES',
  RECEIVABLES = 'RECEIVABLES',
  INVENTORY = 'INVENTORY'
}

// Corporate Asset Subtypes
export enum CorporateAssetSubtype {
  EQUIPMENT_MACHINERY = 'EQUIPMENT_MACHINERY',
  VEHICLES = 'VEHICLES',
  EQUITY_PLEDGES = 'EQUITY_PLEDGES',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
  GUARANTEES = 'GUARANTEES',
  SPECIALIZED_ASSETS = 'SPECIALIZED_ASSETS'
}

// Lien Positions
export enum LienPosition {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  OTHER = 'OTHER'
}

// Lien Status
export enum LienStatus {
  UNENCUMBERED = 'UNENCUMBERED',
  FIRST_LIEN = 'FIRST_LIEN',
  SECOND_LIEN = 'SECOND_LIEN',
  OTHER = 'OTHER'
}

// Property Types
export enum PropertyType {
  OFFICE = 'OFFICE',
  MULTIFAMILY = 'MULTIFAMILY',
  RETAIL = 'RETAIL',
  INDUSTRIAL = 'INDUSTRIAL',
  HOSPITALITY = 'HOSPITALITY',
  MIXED_USE = 'MIXED_USE',
  LAND = 'LAND',
  OTHER = 'OTHER'
}

// Property Conditions
export enum PropertyCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  NEEDS_RENOVATION = 'NEEDS_RENOVATION'
}

// Timeline Options
export enum TimelineOption {
  ONE_TO_THREE_MONTHS = 'ONE_TO_THREE_MONTHS',
  THREE_TO_SIX_MONTHS = 'THREE_TO_SIX_MONTHS',
  SIX_TO_TWELVE_MONTHS = 'SIX_TO_TWELVE_MONTHS',
  ONE_TO_TWO_YEARS = 'ONE_TO_TWO_YEARS',
  TWO_TO_FIVE_YEARS = 'TWO_TO_FIVE_YEARS',
  FIVE_PLUS_YEARS = 'FIVE_PLUS_YEARS'
}

// Recourse Options
export enum RecourseType {
  FULL = 'FULL',
  LIMITED = 'LIMITED',
  NON_RECOURSE = 'NON_RECOURSE'
}

// =====================================================
// DROPDOWN OPTIONS
// =====================================================

// Collateral Type Options
export const COLLATERAL_TYPE_OPTIONS = [
  { value: CollateralType.PROPERTY, label: 'Property' },
  { value: CollateralType.FINANCIAL_ASSETS, label: 'Financial Assets' },
  { value: CollateralType.CORPORATE_ASSETS, label: 'Corporate & Other Assets' }
];

// Financial Asset Subtype Options
export const FINANCIAL_ASSET_SUBTYPE_OPTIONS = [
  { value: FinancialAssetSubtype.CASH, label: 'Cash' },
  { value: FinancialAssetSubtype.MARKETABLE_SECURITIES, label: 'Marketable Securities' },
  { value: FinancialAssetSubtype.RECEIVABLES, label: 'Receivables' },
  { value: FinancialAssetSubtype.INVENTORY, label: 'Inventory' }
];

// Corporate Asset Subtype Options
export const CORPORATE_ASSET_SUBTYPE_OPTIONS = [
  { value: CorporateAssetSubtype.EQUIPMENT_MACHINERY, label: 'Equipment/Machinery' },
  { value: CorporateAssetSubtype.VEHICLES, label: 'Vehicles' },
  { value: CorporateAssetSubtype.EQUITY_PLEDGES, label: 'Equity Pledges' },
  { value: CorporateAssetSubtype.INTELLECTUAL_PROPERTY, label: 'Intellectual Property' },
  { value: CorporateAssetSubtype.GUARANTEES, label: 'Guarantees' },
  { value: CorporateAssetSubtype.SPECIALIZED_ASSETS, label: 'Specialized Assets' }
];

// Lien Position Options
export const LIEN_POSITION_OPTIONS = [
  { value: LienPosition.FIRST, label: 'First' },
  { value: LienPosition.SECOND, label: 'Second' },
  { value: LienPosition.OTHER, label: 'Other' }
];

// Lien Status Options
export const LIEN_STATUS_OPTIONS = [
  { value: LienStatus.UNENCUMBERED, label: 'Unencumbered' },
  { value: LienStatus.FIRST_LIEN, label: 'First Lien' },
  { value: LienStatus.SECOND_LIEN, label: 'Second Lien' },
  { value: LienStatus.OTHER, label: 'Other' }
];

// Property Type Options
export const PROPERTY_TYPE_OPTIONS = [
  { value: PropertyType.OFFICE, label: 'Office' },
  { value: PropertyType.MULTIFAMILY, label: 'Multifamily' },
  { value: PropertyType.RETAIL, label: 'Retail' },
  { value: PropertyType.INDUSTRIAL, label: 'Industrial' },
  { value: PropertyType.HOSPITALITY, label: 'Hospitality' },
  { value: PropertyType.MIXED_USE, label: 'Mixed Use' },
  { value: PropertyType.LAND, label: 'Land' },
  { value: PropertyType.OTHER, label: 'Other' }
];

// Property Condition Options
export const PROPERTY_CONDITION_OPTIONS = [
  { value: PropertyCondition.EXCELLENT, label: 'Excellent' },
  { value: PropertyCondition.GOOD, label: 'Good' },
  { value: PropertyCondition.FAIR, label: 'Fair' },
  { value: PropertyCondition.POOR, label: 'Poor' },
  { value: PropertyCondition.NEEDS_RENOVATION, label: 'Needs Renovation' }
];

// Timeline Options
export const TIMELINE_OPTIONS = [
  { value: TimelineOption.ONE_TO_THREE_MONTHS, label: '1-3 Months' },
  { value: TimelineOption.THREE_TO_SIX_MONTHS, label: '3-6 Months' },
  { value: TimelineOption.SIX_TO_TWELVE_MONTHS, label: '6-12 Months' },
  { value: TimelineOption.ONE_TO_TWO_YEARS, label: '1-2 Years' },
  { value: TimelineOption.TWO_TO_FIVE_YEARS, label: '2-5 Years' },
  { value: TimelineOption.FIVE_PLUS_YEARS, label: '5+ Years' }
];

// Recourse Options
export const RECOURSE_OPTIONS = [
  { value: RecourseType.FULL, label: 'Full Recourse' },
  { value: RecourseType.LIMITED, label: 'Limited Recourse' },
  { value: RecourseType.NON_RECOURSE, label: 'Non-Recourse' }
];
