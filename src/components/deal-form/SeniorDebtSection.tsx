import React from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Percent,
  Calendar,
  FileText,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DealSeniorDebtForm } from '@/types/deal/Deal.sections';
import { RECOURSE_OPTIONS } from '@/types/deal/Deal.sections';
import { DocumentUploadButton } from '@/components/builder-dashboard/DocumentUploadButton';

interface SeniorDebtSectionProps {
  data: DealSeniorDebtForm;
  onChange: (data: DealSeniorDebtForm) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isReadOnly?: boolean;
  dealId?: string;
  organizationId?: string;
  onDocumentUpload?: (documents: any[]) => void;
  documents?: any[];
}

export const SeniorDebtSection: React.FC<SeniorDebtSectionProps> = ({
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
  const handleInputChange = (field: keyof DealSeniorDebtForm, value: string | number) => {
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
          <CreditCard className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Senior Debt</h3>
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
          {/* Amount and Interest Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={data.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  className="pl-10"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate" className="text-sm font-medium text-gray-700">
                Interest Rate (%)
              </Label>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-gray-500" />
                <Input
                  id="interestRate"
                  type="number"
                  placeholder="0.00"
                  value={data.interestRate}
                  onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Term and Amortization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="term" className="text-sm font-medium text-gray-700">
                Term
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  id="term"
                  placeholder="e.g., 5 years, 10 years"
                  value={data.term}
                  onChange={(e) => handleInputChange('term', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amortization" className="text-sm font-medium text-gray-700">
                Amortization
              </Label>
              <Input
                id="amortization"
                placeholder="e.g., 25 years, 30 years"
                value={data.amortization}
                onChange={(e) => handleInputChange('amortization', e.target.value)}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Recourse */}
          <div className="space-y-2">
            <Label htmlFor="recourse" className="text-sm font-medium text-gray-700">
              Recourse
            </Label>
            <Select
              value={data.recourse}
              onValueChange={(value) => handleInputChange('recourse', value)}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recourse type" />
              </SelectTrigger>
              <SelectContent>
                {RECOURSE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prepayment Penalty */}
          <div className="space-y-2">
            <Label htmlFor="prepaymentPenalty" className="text-sm font-medium text-gray-700">
              Prepayment Penalty
            </Label>
            <Textarea
              id="prepaymentPenalty"
              placeholder="Describe prepayment penalty terms..."
              value={data.prepaymentPenalty}
              onChange={(e) => handleInputChange('prepaymentPenalty', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Fees */}
          <div className="space-y-2">
            <Label htmlFor="fees" className="text-sm font-medium text-gray-700">
              Fees (Origination, Exit, Broker, etc.)
            </Label>
            <Textarea
              id="fees"
              placeholder="List all applicable fees..."
              value={data.fees}
              onChange={(e) => handleInputChange('fees', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Document Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Supporting Documents
            </Label>
            {!isReadOnly && dealId && organizationId && (
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
                  console.log('Senior debt documents uploaded:', uploadedDocuments);
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
