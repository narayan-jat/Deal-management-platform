import React from 'react';
import { 
  Building, 
  MapPin, 
  DollarSign, 
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
import { DealCollateralForm } from '@/types/deal/Deal.sections';
import { PROPERTY_TYPE_OPTIONS, CONDITION_OPTIONS } from '@/types/deal/Deal.sections';
import { DocumentUploadButton } from '@/components/builder-dashboard/DocumentUploadButton';

interface CollateralSectionProps {
  data: DealCollateralForm;
  onChange: (data: DealCollateralForm) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isReadOnly?: boolean;
  dealId?: string;
  organizationId?: string;
  onDocumentUpload?: (documents: any[]) => void;
  documents?: any[];
}

export const CollateralSection: React.FC<CollateralSectionProps> = ({
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
  const handleInputChange = (field: keyof DealCollateralForm, value: string | number) => {
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
          <Building className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Collateral Summary</h3>
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
          {/* Property Description */}
          <div className="space-y-2">
            <Label htmlFor="propertyDescription" className="text-sm font-medium text-gray-700">
              Property Description
            </Label>
            <Textarea
              id="propertyDescription"
              placeholder="Describe the property..."
              value={data.propertyDescription}
              onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
              disabled={isReadOnly}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Property Type and Building Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-sm font-medium text-gray-700">
                Property Type
              </Label>
              <Select
                value={data.propertyType}
                onValueChange={(value) => handleInputChange('propertyType', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buildingSize" className="text-sm font-medium text-gray-700">
                Building Size (sq ft)
              </Label>
              <Input
                id="buildingSize"
                type="number"
                placeholder="0"
                value={data.buildingSize}
                onChange={(e) => handleInputChange('buildingSize', parseFloat(e.target.value) || 0)}
                disabled={isReadOnly}
                step="0.01"
              />
            </div>
          </div>

          {/* Year Built and Occupancy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearBuilt" className="text-sm font-medium text-gray-700">
                Year Built/Renovated
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input
                  id="yearBuilt"
                  type="number"
                  placeholder="2024"
                  value={data.yearBuilt}
                  onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value) || new Date().getFullYear())}
                  disabled={isReadOnly}
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupancy" className="text-sm font-medium text-gray-700">
                Occupancy (%)
              </Label>
              <Input
                id="occupancy"
                type="number"
                placeholder="0"
                value={data.occupancy}
                onChange={(e) => handleInputChange('occupancy', parseFloat(e.target.value) || 0)}
                disabled={isReadOnly}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>

          {/* Condition and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
                Condition
              </Label>
              <Select
                value={data.condition}
                onValueChange={(value) => handleInputChange('condition', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Input
                  id="location"
                  placeholder="Enter location"
                  value={data.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Appraised Value */}
          <div className="space-y-2">
            <Label htmlFor="appraisedValue" className="text-sm font-medium text-gray-700">
              Appraised Value
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="appraisedValue"
                type="number"
                placeholder="0.00"
                value={data.appraisedValue}
                onChange={(e) => handleInputChange('appraisedValue', parseFloat(e.target.value) || 0)}
                disabled={isReadOnly}
                className="pl-10"
                step="0.01"
              />
            </div>
          </div>

          {/* Environmental/Risk Notes */}
          <div className="space-y-2">
            <Label htmlFor="riskNotes" className="text-sm font-medium text-gray-700">
              Environmental / Risk Notes
            </Label>
            <Textarea
              id="riskNotes"
              placeholder="Add any environmental or risk considerations..."
              value={data.riskNotes}
              onChange={(e) => handleInputChange('riskNotes', e.target.value)}
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
                  console.log('Collateral documents uploaded:', uploadedDocuments);
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
