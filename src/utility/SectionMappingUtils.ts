import { DealSectionName } from '@/types/deal/Deal.sections';

/**
 * Maps DealSectionName enum values to their corresponding form data keys
 * This ensures consistency between section names and form data structure
 */
export const getSectionFormKey = (sectionName: DealSectionName): string => {
  switch (sectionName) {
    case DealSectionName.OVERVIEW:
      return 'overview';
    case DealSectionName.PURPOSE:
      return 'purpose';
    case DealSectionName.COLLATERAL:
      return 'collateral';
    case DealSectionName.FINANCIALS:
      return 'financials';
    case DealSectionName.NEXT_STEPS:
      return 'nextSteps';
    default:
      throw new Error(`Unknown section name: ${sectionName}`);
  }
};

/**
 * Maps form data keys back to DealSectionName enum values
 * Useful for reverse lookups
 */
export const getSectionNameFromFormKey = (formKey: string): DealSectionName => {
  switch (formKey) {
    case 'overview':
      return DealSectionName.OVERVIEW;
    case 'purpose':
      return DealSectionName.PURPOSE;
    case 'collateral':
      return DealSectionName.COLLATERAL;
    case 'financials':
      return DealSectionName.FINANCIALS;
    case 'nextSteps':
      return DealSectionName.NEXT_STEPS;
    default:
      throw new Error(`Unknown form key: ${formKey}`);
  }
};

/**
 * Gets all available section form keys
 */
export const getAllSectionFormKeys = (): string[] => {
  return [
    'overview',
    'purpose', 
    'collateral',
    'financials',
    'nextSteps'
  ];
};

/**
 * Validates if a section name is valid
 */
export const isValidSectionName = (sectionName: string): sectionName is DealSectionName => {
  return Object.values(DealSectionName).includes(sectionName as DealSectionName);
};

/**
 * Validates if a form key is valid
 */
export const isValidFormKey = (formKey: string): boolean => {
  return getAllSectionFormKeys().includes(formKey);
};
