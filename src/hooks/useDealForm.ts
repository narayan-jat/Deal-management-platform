// =====================================================
// DEAL FORM HOOK
// =====================================================
// Hook for managing deal form state and localStorage
// =====================================================

import { useState, useEffect, useCallback } from 'react';
import { 
  CompleteDealForm, 
  DealSectionName, 
  DealOverviewForm,
  DealPurposeForm,
  DealCollateralForm,
  DealFinancialsForm,
  DealNextStepsForm
} from '@/types/deal/Deal.sections';
import { getSectionFormKey } from '@/utility/SectionMappingUtils';
import { DealModel } from '@/types/deal/Deal.model';
import { 
  createInitialDealForm,
  saveDealFormToStorage,
  loadDealFormFromStorage,
  clearDealFormFromStorage,
  validateCompleteForm,
  toggleSection,
  getEnabledSectionsCount
} from '@/utility/DealFormUtils';
import { DealService } from '@/services/deals/DealService';
import { ErrorService } from '@/services/ErrorService';

interface UseDealFormProps {
  mode: 'create' | 'edit';
  dealId?: string;
  initialDealData?: DealModel;
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
}

export const useDealForm = ({
  mode,
  dealId,
  initialDealData,
  autoSave = true,
  autoSaveInterval = 30000 // 30 seconds
}: UseDealFormProps) => {
  const [formData, setFormData] = useState<CompleteDealForm>(createInitialDealForm());
  
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Load data from localStorage on mount for create mode, or from server for edit mode
  const loadInitialData = async () => {
    if (mode === 'create') {
      const savedData = loadDealFormFromStorage(false);
      if (savedData) {
        setFormData(savedData as CompleteDealForm);
        setIsDirty(true);
        return;
      }
      setFormData(createInitialDealForm() as CompleteDealForm);
      setIsDirty(true);
      return;
    } else if (mode === 'edit' && dealId) {
      try {
        setLoading(true);
        const completeDeal = await DealService.getCompleteDeal(dealId);
        
        console.log('completeDeal', completeDeal);
        // Convert the complete deal data to form format
        const formData = {
          // Basic deal info
          title: completeDeal.deal.title,
          industry: completeDeal.deal.industry || '',
          organizationId: completeDeal.deal.organizationId || '',
          status: completeDeal.deal.status,
          location: completeDeal.deal.location || '',
          notes: completeDeal.deal.notes || '',
          
          // Sections
          overview: completeDeal.sections.overview || createInitialDealForm().overview,
          purpose: completeDeal.sections.purpose || createInitialDealForm().purpose,
          collateral: completeDeal.sections.collateral || createInitialDealForm().collateral,
          financials: completeDeal.sections.financials || createInitialDealForm().financials,
          nextSteps: completeDeal.sections.nextSteps || createInitialDealForm().nextSteps,
          
          // Section enablement - create from sections array
          sectionsEnabled: {
            [DealSectionName.BASIC_INFO]: true,
            [DealSectionName.OVERVIEW]: completeDeal.sections.sections?.find(s => s.sectionName === DealSectionName.OVERVIEW.toLowerCase())?.enabled || false,
            [DealSectionName.PURPOSE]: completeDeal.sections.sections?.find(s => s.sectionName === DealSectionName.PURPOSE.toLowerCase())?.enabled || false,
            [DealSectionName.COLLATERAL]: completeDeal.sections.sections?.find(s => s.sectionName === DealSectionName.COLLATERAL.toLowerCase())?.enabled || false,
            [DealSectionName.FINANCIALS]: completeDeal.sections.sections?.find(s => s.sectionName === DealSectionName.FINANCIALS.toLowerCase())?.enabled || false,
            [DealSectionName.NEXT_STEPS]: completeDeal.sections.sections?.find(s => s.sectionName === DealSectionName.NEXT_STEPS.toLowerCase())?.enabled || true,
          },
          
          // Documents
          documents: {
            [DealSectionName.BASIC_INFO]: completeDeal.documents[DealSectionName.BASIC_INFO] || [],
            [DealSectionName.OVERVIEW]: completeDeal.documents[DealSectionName.OVERVIEW] || [],
            [DealSectionName.PURPOSE]: completeDeal.documents[DealSectionName.PURPOSE] || [],
            [DealSectionName.COLLATERAL]: completeDeal.documents[DealSectionName.COLLATERAL] || [],
            [DealSectionName.FINANCIALS]: completeDeal.documents[DealSectionName.FINANCIALS] || [],
          }
        } as CompleteDealForm;
        
        setFormData(formData as CompleteDealForm);
        setIsDirty(false);
      } catch (error) {
        console.error('Error loading deal data:', error);
        ErrorService.handleApiError(error, "useDealForm.loadInitialData");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [mode, dealId, createInitialDealForm]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || mode === 'edit') return;

    const interval = setInterval(() => {
      if (isDirty) {
        handleAutoSave();
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [isDirty, autoSave, autoSaveInterval, mode]);

  // Auto-save function
  const handleAutoSave = useCallback(async () => {
    if (mode === 'edit') return;
    
    setIsSaving(true);
    try {
      const success = saveDealFormToStorage(formData, true); // Save as draft
      if (success) {
        setLastSaved(new Date());
        setIsDirty(false);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [formData, mode]);

  // Update form data
  const updateFormData = useCallback((updates: Partial<CompleteDealForm>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      setIsDirty(true);
      return newData;
    });
  }, []);

  // Update basic deal info
  const updateBasicInfo = useCallback((updates: Partial<CompleteDealForm>) => {
    updateFormData(updates);
  }, [updateFormData]);


  // Update section data
  const updateSectionData = useCallback((
    sectionName: DealSectionName,
    data: Partial<DealOverviewForm | DealPurposeForm | DealCollateralForm | DealFinancialsForm | DealNextStepsForm>
  ) => {
    const formKey = getSectionFormKey(sectionName);
    updateFormData({
      [formKey]: {
        ...formData[formKey] as object,
        ...data
      }
    });
  }, [formData, updateFormData]);

  // Toggle section enablement
  const toggleSectionEnabled = useCallback((sectionName: DealSectionName) => {
    updateFormData({
      sectionsEnabled: toggleSection(formData.sectionsEnabled, sectionName)
    });
  }, [formData.sectionsEnabled, updateFormData]);

  // Update section documents
  const updateSectionDocuments = useCallback((
    sectionName: DealSectionName,
    documents: any[]
  ) => {
    updateFormData({
      documents: {
        ...formData.documents,
        [sectionName]: documents
      }
    });
  }, [formData.documents, updateFormData]);

  // Save to localStorage
  const saveToStorage = useCallback((isDraft: boolean = false) => {
    const success = saveDealFormToStorage(formData, isDraft);
    if (success) {
      setLastSaved(new Date());
      setIsDirty(false);
    }
    return success;
  }, [formData]);

  // Load from localStorage
  const loadFromStorage = useCallback((isDraft: boolean = false) => {
    const data = loadDealFormFromStorage(isDraft);
    if (data) {
      setFormData(data as CompleteDealForm);
      setIsDirty(true);
      return true;
    }
    return false;
  }, []);

  // Clear localStorage
  const clearStorage = useCallback((isDraft: boolean = false) => {
    const success = clearDealFormFromStorage(isDraft);
    if (success) {
      setIsDirty(false);
      setLastSaved(null);
    }
    return success;
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const validation = validateCompleteForm(formData);
    setErrors(validation.errors);
    return validation;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(createInitialDealForm() as CompleteDealForm);
    setIsDirty(false);
    setLastSaved(null);
    setErrors([]);
  }, []);

  // Get form statistics
  const getFormStats = useCallback(() => {
    const enabledSectionsCount = getEnabledSectionsCount(formData.sectionsEnabled);
    const totalDocuments = Object.values(formData.documents).reduce(
      (total, docs) => total + docs.length, 
      0
    );
    
    return {
      enabledSectionsCount,
      totalDocuments,
      isDirty,
      lastSaved,
      isSaving
    };
  }, [formData, isDirty, lastSaved, isSaving]);

  // Check if section has data
  const hasSectionData = useCallback((sectionName: DealSectionName) => {
    const formKey = getSectionFormKey(sectionName);
    const sectionData = formData[formKey];
    if (!sectionData) return false;
    
    return Object.values(sectionData).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'string') {
        return value.trim() !== '';
      }
      if (typeof value === 'number') {
        return value > 0;
      }
      return value !== null && value !== undefined;
    });
  }, [formData, getSectionFormKey]);

  return {
    // Form data
    formData,
    setFormData,
    
    // State
    isDirty,
    isSaving,
    loading,
    lastSaved,
    errors,
    
    // Actions
    updateFormData,
    updateBasicInfo,
    updateSectionData,
    toggleSectionEnabled,
    updateSectionDocuments,
    
    // Storage
    saveToStorage,
    loadFromStorage,
    clearStorage,
    
    // Validation
    validateForm,
    
    // Utilities
    resetForm,
    getFormStats,
    hasSectionData,
    
    // Auto-save
    handleAutoSave
  };
};
