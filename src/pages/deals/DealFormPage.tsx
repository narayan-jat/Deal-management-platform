import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDealForm } from '@/hooks/useDealForm';
import { DealSectionName, CompleteDealForm } from '@/types/deal/Deal.sections';
import { getSectionFormKey } from '@/utility/SectionMappingUtils';
import { DealStatus } from '@/types/deal/Deal.enums';
import { useCreateEditDeal } from '@/hooks/useCreateEditDeal';
import { DealSectionsService } from '@/services/deals/DealSectionsService';
import { toast } from 'sonner';

// Import section components
import { BasicInfoSection } from '@/components/deal-form/BasicInfoSection';
import { OverviewSection } from '@/components/deal-form/OverviewSection';
import { PurposeSection } from '@/components/deal-form/PurposeSection';
import { CollateralSection } from '@/components/deal-form/CollateralSection';
import { FinancialsSection } from '@/components/deal-form/FinancialsSection';
import { NextStepsSection } from '@/components/deal-form/NextStepsSection';

interface DealFormPageProps {
  mode: 'create' | 'edit';
}

export const DealFormPage: React.FC<DealFormPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { dealId } = useParams<{ dealId: string }>();
  const [activeTab, setActiveTab] = useState<DealSectionName>(DealSectionName.BASIC_INFO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileSections, setShowMobileSections] = useState(false);

  const {
    formData,
    updateBasicInfo,
    updateSectionData,
    toggleSectionEnabled,
    updateSectionDocuments,
    validateForm,
    saveToStorage,
    clearStorage,
    getFormStats,
    hasSectionData,
    isDirty,
    lastSaved,
    isSaving
  } = useDealForm({
    mode,
    dealId,
    autoSave: mode === 'create'
  });

  const { handleCreateDeal, handleEditDeal } = useCreateEditDeal();

  // Validation function for required fields
  const validateRequiredFields = () => {
    const errors: string[] = [];
    
    // Basic Info required fields
    if (!formData.title.trim()) {
      errors.push('Title is required');
    }
    if (!formData.industry.trim()) {
      errors.push('Industry is required');
    }
    if (!formData.status.trim()) {
      errors.push('Status is required');
    }
    
    // Next Steps required fields
    if (!formData.nextSteps.startDate.trim()) {
      errors.push('Origination Date is required');
    }
    
    return errors;
  };

  // Load existing deal data for edit mode
  useEffect(() => {
    if (mode === 'edit' && dealId) {
      loadDealData(dealId);
    }
  }, [mode, dealId]);

  const loadDealData = async (dealId: string) => {
    try {
      const sectionsData = await DealSectionsService.getAllDealSections(dealId);
      // Update form data with loaded sections
      // This would need to be implemented based on the actual data structure
    } catch (error) {
      console.error('Error loading deal data:', error);
      toast.error('Failed to load deal data');
    }
  };

  const handleSaveDraft = async () => {
    const success = saveToStorage(true);
    if (success) {
      toast.success('Draft saved successfully');
    } else {
      toast.error('Failed to save draft');
    }
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    // Validate required fields first
    const validationErrors = validateRequiredFields();
    if (validationErrors.length > 0 && !isDraft) {
      toast.error(`Please fill the required fields first: ${validationErrors.join(', ')}`);
      return;
    }

    const validation = validateForm();
    if (!validation.isValid && !isDraft) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await handleCreateDeal(formData);
        clearStorage();
        toast.success('Deal created successfully');
        // navigate('/deals');
      } else {
        await handleEditDeal(dealId!, formData);
        toast.success('Deal updated successfully');
        // navigate('/deals');
      }
    } catch (error) {
      console.error('Error submitting deal:', error);
      toast.error('Failed to submit deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sections = [
    { id: DealSectionName.OVERVIEW, label: 'Overview', icon: '👥' },
    { id: DealSectionName.PURPOSE, label: 'Purpose', icon: '📋' },
    { id: DealSectionName.COLLATERAL, label: 'Collateral', icon: '🏢' },
    { id: DealSectionName.FINANCIALS, label: 'Financials', icon: '💰' },
    { id: DealSectionName.NEXT_STEPS, label: 'Next Steps', icon: '📅' }
  ];

  const stats = getFormStats();


  const renderSection = () => {
    if (activeTab === DealSectionName.BASIC_INFO) {
      return null; // Basic info is handled in the main render
    }

    const sectionData = formData[getSectionFormKey(activeTab)];
    console.log('sectionData', sectionData);
    console.log("formData", formData);
    const isEnabled = formData.sectionsEnabled[activeTab];
    console.log('type of isEnabled', typeof isEnabled);
    console.log('isEnabled', isEnabled);

    const documents = formData.documents[activeTab];

    switch (activeTab) {
      case DealSectionName.OVERVIEW:
        return (
          <OverviewSection
            data={formData.overview}
            onChange={(data) => updateSectionData(DealSectionName.OVERVIEW, data)}
            isEnabled={isEnabled}
            onToggleEnabled={() => toggleSectionEnabled(DealSectionName.OVERVIEW)}
            // isReadOnly={mode === 'edit'}
          />
        );
      case DealSectionName.PURPOSE:
        return (
          <PurposeSection
            data={formData.purpose}
            onChange={(data) => updateSectionData(DealSectionName.PURPOSE, data)}
            isEnabled={isEnabled}
            onToggleEnabled={() => toggleSectionEnabled(DealSectionName.PURPOSE)}
            // isReadOnly={mode === 'edit'}
            dealId={dealId}
            organizationId={formData.organizationId}
            onDocumentUpload={(docs) => updateSectionDocuments(DealSectionName.PURPOSE, docs)}
            documents={documents}
          />
        );
      case DealSectionName.COLLATERAL:
        return (
          <CollateralSection
            data={formData.collateral}
            onChange={(data) => updateSectionData(DealSectionName.COLLATERAL, data)}
            isEnabled={isEnabled}
            onToggleEnabled={() => toggleSectionEnabled(DealSectionName.COLLATERAL)}
            // isReadOnly={mode === 'edit'}
            dealId={dealId}
            organizationId={formData.organizationId}
            documents={documents}
            onDocumentUpload={(docs) => updateSectionDocuments(DealSectionName.COLLATERAL, docs)}
          />
        );
      case DealSectionName.FINANCIALS:
        return (
          <FinancialsSection
            data={formData.financials}
            onChange={(data) => updateSectionData(DealSectionName.FINANCIALS, data)}
            isEnabled={isEnabled}
            onToggleEnabled={() => toggleSectionEnabled(DealSectionName.FINANCIALS)}
            // isReadOnly={mode === 'edit'}
            dealId={dealId}
            organizationId={formData.organizationId}
            onDocumentUpload={(docs) => updateSectionDocuments(DealSectionName.FINANCIALS, docs)}
            documents={documents}
          />
        );
      case DealSectionName.NEXT_STEPS:
        return (
          <NextStepsSection
            data={formData.nextSteps}
            onChange={(data) => updateSectionData(DealSectionName.NEXT_STEPS, data)}
            isEnabled={isEnabled}
            onToggleEnabled={() => toggleSectionEnabled(DealSectionName.NEXT_STEPS)}
            // isReadOnly={mode === 'edit'}
            dealId={dealId}
            organizationId={formData.organizationId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {mode === 'create' ? 'Create New Deal' : 'Edit Deal'}
                </h1>
                {lastSaved && (
                  <p className="text-sm text-gray-500 hidden sm:block">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Desktop only - unsaved changes info */}
              <div className="hidden md:flex items-center gap-2">
                {isDirty && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Unsaved changes
                  </Badge>
                )}
                {isSaving && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Save className="h-3 w-3 mr-1" />
                    Saving...
                  </Badge>
                )}
              </div>
              
              {/* Mobile only - saving indicator */}
              <div className="md:hidden">
                {isSaving && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Save className="h-3 w-3 mr-1" />
                    Saving...
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs - Always at top */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {/* Basic Info Tab */}
            <button
              onClick={() => setActiveTab(DealSectionName.BASIC_INFO)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === DealSectionName.BASIC_INFO
                  ? 'bg-blue-100 text-blue-900 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="hidden sm:inline">Basic Info</span>
              <span className="sm:hidden">Basic</span>
            </button>

            {/* Section Tabs */}
            {sections.map((section) => {
              const isEnabled = formData.sectionsEnabled[section.id];
              const hasData = hasSectionData(section.id);
              const isActive = activeTab === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="hidden sm:inline">{section.label}</span>
                  <span className="sm:hidden">{section.label.split(' ')[0]}</span>
                  {hasData && (
                    <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                      {formData.documents[section.id]?.length || 0}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm">
            {activeTab === DealSectionName.BASIC_INFO ? (
              <BasicInfoSection
                data={{
                  title: formData.title,
                  industry: formData.industry,
                  organizationId: formData.organizationId,
                  location: formData.location,
                  notes: formData.notes,
                  status: formData.status
                }}
                onChange={updateBasicInfo}
                // isReadOnly={mode === 'edit'}
              />
            ) : (
              renderSection()
            )}
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Footer */}
          <div className="hidden md:flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {stats.enabledSectionsCount} sections enabled • {stats.totalDocuments} documents
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              {mode === 'create' && (
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  Save as Draft
                </Button>
              )}
              
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Deal' : 'Update Deal'}
              </Button>
            </div>
          </div>

          {/* Mobile Footer - Only 3 buttons */}
          <div className="md:hidden flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            
            {mode === 'create' && (
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="flex-1"
              >
                Save Draft
              </Button>
            )}
            
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
