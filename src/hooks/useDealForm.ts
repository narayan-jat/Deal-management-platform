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
  DealSeniorDebtForm,
  DealNextStepsForm
} from '@/types/deal/Deal.sections';
import { DealModel } from '@/types/deal/Deal.model';
import { 
  createInitialDealForm,
  saveDealFormToStorage,
  loadDealFormFromStorage,
  clearDealFormFromStorage,
  convertDealModelToForm,
  validateCompleteForm,
  toggleSection,
  getEnabledSectionsCount
} from '@/utility/DealFormUtils';

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
  const [formData, setFormData] = useState<CompleteDealForm>(() => {
    if (mode === 'edit' && initialDealData) {
      return {
        ...createInitialDealForm(),
        ...convertDealModelToForm(initialDealData)
      };
    }
    return createInitialDealForm();
  });
  
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Load data from localStorage on mount for create mode
  useEffect(() => {
    if (mode === 'create') {
      const savedData = loadDealFormFromStorage(false);
      if (savedData) {
        setFormData(savedData);
        setIsDirty(true);
      }
    }
  }, [mode]);

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
    data: Partial<DealOverviewForm | DealPurposeForm | DealCollateralForm | DealFinancialsForm | DealSeniorDebtForm | DealNextStepsForm>
  ) => {
    updateFormData({
      [sectionName.toLowerCase()]: {
        ...formData[sectionName.toLowerCase() as keyof CompleteDealForm],
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
      setFormData(data);
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
    setFormData(createInitialDealForm());
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
    const sectionData = formData[sectionName.toLowerCase() as keyof CompleteDealForm];
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
  }, [formData]);

  return {
    // Form data
    formData,
    setFormData,
    
    // State
    isDirty,
    isSaving,
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
