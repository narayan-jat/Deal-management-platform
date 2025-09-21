// =====================================================
// DEAL FORM UTILITIES
// =====================================================
// Utilities for managing deal form data and localStorage
// =====================================================

import { 
  CompleteDealForm, 
  DealSectionName, 
  DealOverviewForm,
  DealPurposeForm,
  DealCollateralForm,
  DealFinancialsForm,
  DealNextStepsForm,
  PersonTag,
  PersonTagType,
  Rate
} from '@/types/deal/Deal.sections';
import { DealModel } from '@/types/deal/Deal.model';
import { DealStatus } from '@/types/deal/Deal.enums';

// =====================================================
// LOCAL STORAGE UTILITIES
// =====================================================

const DEAL_FORM_STORAGE_KEY = 'deal_form_data';
const DEAL_DRAFT_STORAGE_KEY = 'deal_draft_data';

/**
 * Saves deal form data to localStorage
 */
export const saveDealFormToStorage = (formData: CompleteDealForm, isDraft: boolean = false) => {
  try {
    const key = isDraft ? DEAL_DRAFT_STORAGE_KEY : DEAL_FORM_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(formData));
    return true;
  } catch (error) {
    console.error('Error saving deal form to localStorage:', error);
    return false;
  }
};

/**
 * Loads deal form data from localStorage
 */
export const loadDealFormFromStorage = (isDraft: boolean = false): CompleteDealForm | null => {
  try {
    const key = isDraft ? DEAL_DRAFT_STORAGE_KEY : DEAL_FORM_STORAGE_KEY;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading deal form from localStorage:', error);
    return null;
  }
};

/**
 * Clears deal form data from localStorage
 */
export const clearDealFormFromStorage = (isDraft: boolean = false) => {
  try {
    const key = isDraft ? DEAL_DRAFT_STORAGE_KEY : DEAL_FORM_STORAGE_KEY;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing deal form from localStorage:', error);
    return false;
  }
};

/**
 * Clears all deal form data from localStorage
 */
export const clearAllDealFormData = () => {
  clearDealFormFromStorage(false);
  clearDealFormFromStorage(true);
};

// =====================================================
// FORM DATA INITIALIZATION
// =====================================================

/**
 * Creates initial empty form data
 */
export const createInitialDealForm = (): CompleteDealForm => {
  return {
  // Basic deal info
  title: '',
  industry: '',
  organizationId: '',
  status: DealStatus.NEW,
  location: '',
  notes: '',
    
    // Sections
    overview: createInitialOverviewForm(),
    purpose: createInitialPurposeForm(),
    collateral: createInitialCollateralForm(),
    financials: createInitialFinancialsForm(),
    nextSteps: createInitialNextStepsForm(),
    
    // Section enablement
    sectionsEnabled: {
      [DealSectionName.BASIC_INFO]: true,
      [DealSectionName.OVERVIEW]: false,
      [DealSectionName.PURPOSE]: false,
      [DealSectionName.COLLATERAL]: false,
      [DealSectionName.FINANCIALS]: false,
      [DealSectionName.NEXT_STEPS]: true,
    },
    
    // Documents for each section
    documents: {
      [DealSectionName.BASIC_INFO]: [],
      [DealSectionName.OVERVIEW]: [],
      [DealSectionName.PURPOSE]: [],
      [DealSectionName.COLLATERAL]: [],
      [DealSectionName.FINANCIALS]: [],
    }
  };
};

/**
 * Creates initial overview form data
 */
export const createInitialOverviewForm = (): DealOverviewForm => {
  return {
    borrowers: [],
    lenders: [],
    otherParties: [],
    loanRequest: 0,
    totalProjectCost: 0,
    rate: { type: 'single', value: 0 },
    ltv: 0,
    dscr: 0
  };
};

/**
 * Creates initial purpose form data
 */
export const createInitialPurposeForm = (): DealPurposeForm => {
  return {
    purpose: '',
    timeline: ''
  };
};

/**
 * Creates initial collateral form data
 */
export const createInitialCollateralForm = (): DealCollateralForm => {
  return {
    items: []
  };
};

/**
 * Creates initial financials form data
 */
export const createInitialFinancialsForm = (): DealFinancialsForm => {
  return {
    sourcesOfFunds: '',
    usesOfFunds: '',
    historicalDocuments: [],
    projectedDocuments: []
  };
};


/**
 * Creates initial next steps form data
 */
export const createInitialNextStepsForm = (): DealNextStepsForm => {
  return {
    expectedCloseDate: '',
    notes: '',
    startDate: '',
    nextMeetingDate: ''
  };
};

// =====================================================
// DATA CONVERSION UTILITIES
// =====================================================

/**
 * Converts DealModel to CompleteDealForm
 */
export const convertDealModelToForm = (deal: DealModel): Partial<CompleteDealForm> => {
  return {
    title: deal.title,
    industry: deal.industry,
    organizationId: deal.organizationId,
    status: deal.status,
    location: deal.location,
    notes: deal.notes
  };
};

/**
 * Converts CompleteDealForm to DealModel (for basic deal data)
 */
export const convertFormToDealModel = (formData: CompleteDealForm): Partial<DealModel> => {
  return {
    title: formData.title,
    industry: formData.industry,
    organizationId: formData.organizationId,
    status: formData.status as DealStatus,
    location: formData.location,
    notes: formData.notes
  };
};

// =====================================================
// DATE UTILITIES
// =====================================================

/**
 * Formats a date string for HTML date input (YYYY-MM-DD format)
 */
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Try to parse and format the date
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Error formatting date:', error);
    return '';
  }
};

/**
 * Formats a date for display (MM/DD/YYYY format)
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  } catch (error) {
    console.warn('Error formatting date for display:', error);
    return '';
  }
};

// =====================================================
// FORM VALIDATION UTILITIES
// =====================================================

/**
 * Validates if a section has required data
 */
export const validateSection = (sectionName: DealSectionName, formData: CompleteDealForm): boolean => {
  switch (sectionName) {
    case DealSectionName.OVERVIEW:
      return formData.overview.borrowers.length > 0 || 
             formData.overview.lenders.length > 0 ||
             formData.overview.otherParties.length > 0;
    
    case DealSectionName.PURPOSE:
      return formData.purpose.purpose.trim() !== '' || 
             formData.purpose.timeline.trim() !== '';
    
    case DealSectionName.COLLATERAL:
      return formData.collateral.items.length > 0;
    
    case DealSectionName.FINANCIALS:
      return formData.financials.sourcesOfFunds.trim() !== '' || 
             formData.financials.usesOfFunds.trim() !== '';
    
    
    case DealSectionName.NEXT_STEPS:
      return formData.nextSteps.startDate.trim() !== '' || 
             formData.nextSteps.expectedCloseDate.trim() !== '' || 
             formData.nextSteps.notes.trim() !== '';
    
    default:
      return false;
  }
};

/**
 * Validates the entire form
 */
export const validateCompleteForm = (formData: CompleteDealForm): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Basic validation
  if (!formData.title.trim()) {
    errors.push('Deal title is required');
  }
  
  if (!formData.industry.trim()) {
    errors.push('Industry is required');
  }
  
  // Check required dates in NextSteps section
  if (!formData.nextSteps.startDate) {
    errors.push('Origination date is required');
  }
  
  // Section validation for enabled sections
  // Disable section validation for now
  // Object.entries(formData.sectionsEnabled).forEach(([sectionName, enabled]) => {
  //   if (enabled && !validateSection(sectionName as DealSectionName, formData)) {
  //     errors.push(`${sectionName} section is enabled but incomplete`);
  //   }
  // });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// =====================================================
// PERSON TAG UTILITIES
// =====================================================

/**
 * Creates a new person tag
 */
export const createPersonTag = (id: string, name: string, email: string, role: PersonTagType): PersonTag => {
  return { id, name, email, role };
};

/**
 * Adds a person tag to a list
 */
export const addPersonTag = (tags: PersonTag[], newTag: PersonTag): PersonTag[] => {
  // Check if person already exists
  const exists = tags.some(tag => tag.id === newTag.id || tag.email === newTag.email);
  if (exists) {
    return tags;
  }
  return [...tags, newTag];
};

/**
 * Removes a person tag from a list
 */
export const removePersonTag = (tags: PersonTag[], tagId: string): PersonTag[] => {
  return tags.filter(tag => tag.id !== tagId);
};

// =====================================================
// RATE UTILITIES
// =====================================================

/**
 * Creates a single rate
 */
export const createSingleRate = (value: number): Rate => {
  return { type: 'single', value };
};

/**
 * Creates a range rate
 */
export const createRangeRate = (minValue: number, maxValue: number): Rate => {
  return { type: 'range', minValue, maxValue };
};

/**
 * Validates a rate
 */
export const validateRate = (rate: Rate): boolean => {
  if (rate.type === 'single') {
    return rate.value !== undefined && rate.value >= 0;
  } else if (rate.type === 'range') {
    return rate.minValue !== undefined && 
           rate.maxValue !== undefined && 
           rate.minValue >= 0 && 
           rate.maxValue >= rate.minValue;
  }
  return false;
};

// =====================================================
// SECTION ENABLEMENT UTILITIES
// =====================================================

/**
 * Toggles section enablement
 */
export const toggleSection = (
  sectionsEnabled: { [key in DealSectionName]: boolean },
  sectionName: DealSectionName
): { [key in DealSectionName]: boolean } => {
  return {
    ...sectionsEnabled,
    [sectionName]: !sectionsEnabled[sectionName]
  };
};

/**
 * Gets enabled sections count
 */
export const getEnabledSectionsCount = (sectionsEnabled: { [key in DealSectionName]: boolean }): number => {
  return Object.values(sectionsEnabled).filter(Boolean).length;
};

/**
 * Gets enabled sections list
 */
export const getEnabledSections = (sectionsEnabled: { [key in DealSectionName]: boolean }): DealSectionName[] => {
  return Object.entries(sectionsEnabled)
    .filter(([_, enabled]) => enabled)
    .map(([sectionName, _]) => sectionName as DealSectionName);
};

/**
 * Formats a date string for database storage, handling empty strings
 */
export const formatDateForDatabase = (dateString: string): string | null => {
  if (!dateString || dateString.trim() === '') {
    return null;
  }
  
  // If it's already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.warn('Error formatting date for database:', error);
    return null;
  }
};
