import React from 'react';
import { 
  Calculator, 
  DollarSign, 
  Percent,
  FileText,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DealFinancialsForm } from '@/types/deal/Deal.sections';
import { DocumentUploadButton } from '@/components/builder-dashboard/DocumentUploadButton';

interface FinancialsSectionProps {
  data: DealFinancialsForm;
  onChange: (data: DealFinancialsForm) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isReadOnly?: boolean;
  dealId?: string;
  organizationId?: string;
  onDocumentUpload?: (documents: any[]) => void;
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
  documents = []
}) => {
  console.log(' financials data', data);
  const handleInputChange = (field: keyof DealFinancialsForm, value: string | number) => {
    console.log('financials value', value);
    console.log('financials field', field);
    onChange({
      ...data,
      [field]: value
    });
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
                dealId={dealId}
                organizationId={organizationId}
                onUpload={async (uploadedDocuments) => {
                  if (onDocumentUpload) {
                    onDocumentUpload([...documents, ...uploadedDocuments]);
                  }
                  return uploadedDocuments;
                }}
                onSuccess={(uploadedDocuments) => {
                  console.log('Historical financials uploaded:', uploadedDocuments);
                }}
                className="w-full"
                buttonText="Upload Historical Financials"
                loadingText="Uploading..."
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Projected Financials
              </Label>
              <DocumentUploadButton
                dealId={dealId}
                organizationId={organizationId}
                onUpload={async (uploadedDocuments) => {
                  if (onDocumentUpload) {
                    onDocumentUpload([...documents, ...uploadedDocuments]);
                  }
                  return uploadedDocuments;
                }}
                onSuccess={(uploadedDocuments) => {
                  console.log('Projected financials uploaded:', uploadedDocuments);
                }}
                className="w-full"
                buttonText="Upload Projected Financials"
                loadingText="Uploading..."
              />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
