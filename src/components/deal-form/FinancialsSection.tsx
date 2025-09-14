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
  const handleInputChange = (field: keyof DealFinancialsForm, value: string | number) => {
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

          {/* Historical and Projected Financials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="historicalFinancials" className="text-sm font-medium text-gray-700">
                Historical Financials
              </Label>
              <Textarea
                id="historicalFinancials"
                placeholder="Describe historical financial performance..."
                value={data.historicalFinancials}
                onChange={(e) => handleInputChange('historicalFinancials', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectedFinancials" className="text-sm font-medium text-gray-700">
                Projected Financials
              </Label>
              <Textarea
                id="projectedFinancials"
                placeholder="Describe projected financial performance..."
                value={data.projectedFinancials}
                onChange={(e) => handleInputChange('projectedFinancials', e.target.value)}
                disabled={isReadOnly}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Exit Strategy */}
          <div className="space-y-2">
            <Label htmlFor="exitStrategy" className="text-sm font-medium text-gray-700">
              Exit Strategy
            </Label>
            <Textarea
              id="exitStrategy"
              placeholder="Describe the exit strategy..."
              value={data.exitStrategy}
              onChange={(e) => handleInputChange('exitStrategy', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* LTV and DSCR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ltv" className="text-sm font-medium text-gray-700">
                Loan-to-Value (LTV) %
              </Label>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-gray-500" />
                <Input
                  id="ltv"
                  type="number"
                  placeholder="0.00"
                  value={data.ltv}
                  onChange={(e) => handleInputChange('ltv', parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dscr" className="text-sm font-medium text-gray-700">
                Debt Service Coverage Ratio (DSCR)
              </Label>
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-gray-500" />
                <Input
                  id="dscr"
                  type="number"
                  placeholder="0.00"
                  value={data.dscr}
                  onChange={(e) => handleInputChange('dscr', parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Supporting Documents
            </Label>
            {(
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
                  console.log('Financials documents uploaded:', uploadedDocuments);
                }}
                className="w-full"
                buttonText="Upload Documents"
                loadingText="Uploading..."
              />
            )}
            
            {/* Document List */}
            {documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Uploaded Files ({documents.length})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {documents.map((document, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {document.file?.name || document.fileName}
                          </p>
                        </div>
                      </div>
                      {!isReadOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
