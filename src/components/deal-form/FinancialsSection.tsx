import React from 'react';
import { 
  Calculator, 
  FileText,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DealFinancialsForm } from '@/types/deal/Deal.sections';
import { DocumentUploadButton } from '@/components/builder-dashboard/DocumentUploadButton';
import { populateFinancialsDocuments } from '@/utility/DocumentExtractionUtils';

interface FinancialsSectionProps {
  data: DealFinancialsForm;
  onChange: (data: DealFinancialsForm) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isReadOnly?: boolean;
  dealId?: string;
  organizationId?: string;
  onDocumentUpload?: (documents: any[]) => void;
  onDeleteDocument?: (dealId: string, document: any) => Promise<boolean>;
  documents?: any[];
}

export const FinancialsSection: React.FC<FinancialsSectionProps> = ({
  data,
  onChange,
  isEnabled,
  onToggleEnabled,
  isReadOnly = false,
  dealId,
  organizationId,
  onDocumentUpload,
  onDeleteDocument,
  documents = []
}) => {
  const handleInputChange = (field: keyof DealFinancialsForm, value: string | number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const handleHistoricalDocumentUpload = async (uploadedDocuments: any[]) => {
    // Create standardized document format
    const categorizedDocuments = uploadedDocuments.map(doc => ({
      file: doc,
      formCategory: 'HISTORICAL',
      itemId: undefined
    }));


    // Update the main documents array through the parent component
    if (onDocumentUpload) {
      onDocumentUpload([...documents, ...categorizedDocuments]);
    }

    return categorizedDocuments;
  };

  const handleProjectedDocumentUpload = async (uploadedDocuments: any[]) => {
    // Create standardized document format
    const categorizedDocuments = uploadedDocuments.map(doc => ({
      file: doc,
      formCategory: 'PROJECTED',
      itemId: undefined
    }));


    // Update the main documents array through the parent component
    if (onDocumentUpload) {
      onDocumentUpload([...documents, ...categorizedDocuments]);
    }

    return categorizedDocuments;
  };

  // Populate local documents for better UX (local copy from section documents)
  const dataWithDocuments = populateFinancialsDocuments(data, documents || []);
  
  // Filter documents by category from the main documents array
  const getDocumentsByCategory = (category: string) => {
    const filtered = (documents || []).filter(doc => doc.formCategory === category);
    return filtered;
  };

  const removeDocument = async (document: any) => {
    // Check if this is a saved document (has id and filePath) or a file upload
    if (document.id && document.filePath && onDeleteDocument) {
      if (!dealId) {
        console.error("Deal ID is required for document deletion");
        return;
      }
      // This is a saved document - use the proper deletion method
      const success = await onDeleteDocument(dealId, document);
      if (success && onDocumentUpload) {
        // Remove from local documents array after successful deletion
        onDocumentUpload(documents.filter(doc => doc.id !== document.id));
      }
    } else if (document.file && onDocumentUpload) {
      // This is a file upload that hasn't been saved yet - just remove from array
      onDocumentUpload(documents.filter(doc => doc.file?.file?.name !== document.file?.file?.name));
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Financial Summary</h3>
        </div>
        {!isReadOnly && (
          <Button
            type="button"
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            onClick={onToggleEnabled}
          >
            {isEnabled ? 'Enabled' : 'Enable'}
          </Button>
        )}
      </div>

      {isEnabled && (
        <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-white">
          {/* Sources and Uses of Funds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="sourcesOfFunds" className="text-sm font-medium text-gray-700">
                Sources of Funds
              </Label>
              <Textarea
                id="sourcesOfFunds"
                placeholder="Describe sources of funding..."
                value={data.sourcesOfFunds}
                onChange={(e) => handleInputChange('sourcesOfFunds', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usesOfFunds" className="text-sm font-medium text-gray-700">
                Uses of Funds
              </Label>
              <Textarea
                id="usesOfFunds"
                placeholder="Describe uses of funding..."
                value={data.usesOfFunds}
                onChange={(e) => handleInputChange('usesOfFunds', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Historical and Projected Financials - File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Historical Financials
              </Label>
              <DocumentUploadButton
                dealId={dealId || "new-deal"}
                organizationId={organizationId}
                onUpload={handleHistoricalDocumentUpload}
                onSuccess={(uploadedDocuments) => {
                }}
                className="w-full"
                buttonText="Upload Historical Financials"
                loadingText="Uploading..."
              />
              {/* Show uploaded historical documents */}
              {dataWithDocuments.historicalDocuments && dataWithDocuments.historicalDocuments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Uploaded Historical Documents ({dataWithDocuments.historicalDocuments.length})
                  </p>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {dataWithDocuments.historicalDocuments.map((document: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {document.file?.file?.name || document.fileName}
                          </span>
                        </div>
                        {!isReadOnly && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(document)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Projected Financials
              </Label>
              <DocumentUploadButton
                dealId={dealId || "new-deal"}
                organizationId={organizationId}
                onUpload={handleProjectedDocumentUpload}
                onSuccess={(uploadedDocuments) => {
                }}
                className="w-full"
                buttonText="Upload Projected Financials"
                loadingText="Uploading..."
              />
              {/* Show uploaded projected documents */}
              {dataWithDocuments.projectedDocuments && dataWithDocuments.projectedDocuments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Uploaded Projected Documents ({dataWithDocuments.projectedDocuments.length})
                  </p>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {dataWithDocuments.projectedDocuments.map((document: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {document.file?.file?.name || document.fileName}
                          </span>
                        </div>
                        {!isReadOnly && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(document)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
