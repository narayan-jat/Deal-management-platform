import { useState, useCallback } from 'react';
import { DealSectionsService } from '@/services/deals/DealSectionsService';
import { DealDocumentService } from '@/services/deals/DealDocumentService';
import { CollateralDocumentService } from '@/services/deals/CollateralDocumentService';
import { FinancialDocumentService } from '@/services/deals/FinancialDocumentService';
import { 
  DealSectionName, 
  CompleteDealForm,
  DealOverviewForm,
  DealPurposeForm,
  DealCollateralForm,
  DealFinancialsForm,
  DealNextStepsForm,
  CollateralItem
} from '@/types/deal/Deal.sections';
import { ErrorService } from '@/services/ErrorService';

interface UseDealSectionsProps {
  dealId?: string;
  mode: 'create' | 'edit';
}

export const useDealSections = ({ dealId, mode }: UseDealSectionsProps) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load complete deal data
  const loadCompleteDeal = useCallback(async (dealId: string) => {
    try {
      setLoading(true);
      const result = await DealSectionsService.getCompleteDeal(dealId);
      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.loadCompleteDeal");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save complete deal data
  const saveCompleteDeal = useCallback(async (dealFormData: CompleteDealForm) => {
    if (!dealId) {
      setApiError("Deal ID is required for saving");
      return null;
    }

    try {
      setLoading(true);
      
      // Update deal sections
      await DealSectionsService.createOrUpdateDealSections(dealId, dealFormData.sectionsEnabled);

      // Update section data
      const sectionsData: any = {};
      if (dealFormData.overview) sectionsData.overview = dealFormData.overview;
      if (dealFormData.purpose) sectionsData.purpose = dealFormData.purpose;
      if (dealFormData.collateral) sectionsData.collateral = dealFormData.collateral;
      if (dealFormData.financials) sectionsData.financials = dealFormData.financials;
      if (dealFormData.nextSteps) sectionsData.nextSteps = dealFormData.nextSteps;

      const result = await DealSectionsService.createOrUpdateAllDealSections(
        dealId, 
        dealFormData.sectionsEnabled, 
        sectionsData
      );

      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.saveCompleteDeal");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Update individual section
  const updateSection = useCallback(async (
    sectionName: DealSectionName,
    sectionData: DealOverviewForm | DealPurposeForm | DealCollateralForm | DealFinancialsForm | DealNextStepsForm
  ) => {
    if (!dealId) {
      setApiError("Deal ID is required for updating section");
      return null;
    }

    try {
      setLoading(true);
      
      let result;
      switch (sectionName) {
        case DealSectionName.OVERVIEW:
          result = await DealSectionsService.createOrUpdateDealOverview(dealId, sectionData as DealOverviewForm);
          break;
        case DealSectionName.PURPOSE:
          result = await DealSectionsService.createOrUpdateDealPurpose(dealId, sectionData as DealPurposeForm);
          break;
        case DealSectionName.COLLATERAL:
          result = await DealSectionsService.createOrUpdateDealCollateral(dealId, sectionData as DealCollateralForm);
          break;
        case DealSectionName.FINANCIALS:
          result = await DealSectionsService.createOrUpdateDealFinancials(dealId, sectionData as DealFinancialsForm);
          break;
        case DealSectionName.NEXT_STEPS:
          result = await DealSectionsService.createOrUpdateDealNextSteps(dealId, sectionData as DealNextStepsForm);
          break;
        default:
          throw new Error(`Unknown section: ${sectionName}`);
      }

      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.updateSection");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get section data
  const getSection = useCallback(async (sectionName: DealSectionName) => {
    if (!dealId) {
      setApiError("Deal ID is required for getting section");
      return null;
    }

    try {
      setLoading(true);
      
      let result;
      switch (sectionName) {
        case DealSectionName.OVERVIEW:
          result = await DealSectionsService.getDealOverview(dealId);
          break;
        case DealSectionName.PURPOSE:
          result = await DealSectionsService.getDealPurpose(dealId);
          break;
        case DealSectionName.COLLATERAL:
          result = await DealSectionsService.getDealCollateral(dealId);
          break;
        case DealSectionName.FINANCIALS:
          result = await DealSectionsService.getDealFinancials(dealId);
          break;
        case DealSectionName.NEXT_STEPS:
          result = await DealSectionsService.getDealNextSteps(dealId);
          break;
        default:
          throw new Error(`Unknown section: ${sectionName}`);
      }

      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.getSection");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get all sections
  const getAllSections = useCallback(async () => {
    if (!dealId) {
      setApiError("Deal ID is required for getting sections");
      return null;
    }

    try {
      setLoading(true);
      const result = await DealSectionsService.getAllDealSections(dealId);
      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.getAllSections");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get section documents
  const getSectionDocuments = useCallback(async (
    sectionName: DealSectionName,
    formCategory?: string,
    itemId?: string
  ) => {
    if (!dealId) {
      setApiError("Deal ID is required for getting documents");
      return [];
    }

    try {
      setLoading(true);
      const documents = await DealDocumentService.getSectionDocuments(
        dealId,
        sectionName,
        formCategory,
        itemId
      );
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.getSectionDocuments");
      return [];
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get collateral item documents
  const getCollateralItemDocuments = useCallback(async (collateralItemId: string) => {
    if (!dealId) {
      setApiError("Deal ID is required for getting collateral documents");
      return [];
    }

    try {
      setLoading(true);
      const documents = await CollateralDocumentService.getCollateralItemDocuments(
        dealId,
        collateralItemId
      );
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.getCollateralItemDocuments");
      return [];
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get financial documents by category
  const getFinancialDocuments = useCallback(async (formCategory?: 'HISTORICAL' | 'PROJECTED') => {
    if (!dealId) {
      setApiError("Deal ID is required for getting financial documents");
      return [];
    }

    try {
      setLoading(true);
      const documents = await FinancialDocumentService.getFinancialDocuments(
        dealId,
        formCategory
      );
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.getFinancialDocuments");
      return [];
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get all documents organized by section
  const getAllDocumentsBySection = useCallback(async () => {
    if (!dealId) {
      setApiError("Deal ID is required for getting documents");
      return {};
    }

    try {
      setLoading(true);
      const documents = await DealDocumentService.getAllDealDocumentsBySection(dealId);
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDealSections.getAllDocumentsBySection");
      return {};
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Clear API error
  const clearError = useCallback(() => {
    setApiError(null);
  }, []);

  return {
    loading,
    apiError,
    // Main operations
    loadCompleteDeal,
    saveCompleteDeal,
    updateSection,
    getSection,
    getAllSections,
    // Document operations
    getSectionDocuments,
    getCollateralItemDocuments,
    getFinancialDocuments,
    getAllDocumentsBySection,
    // Utilities
    clearError,
  };
};
