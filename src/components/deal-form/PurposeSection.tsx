import React from 'react';
import { FileText, Calendar, Upload } from 'lucide-react';
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
import { DealPurposeForm, TIMELINE_OPTIONS } from '@/types/deal/Deal.sections';
import { DocumentUploadButton } from '@/components/builder-dashboard/DocumentUploadButton';

interface PurposeSectionProps {
  data: DealPurposeForm;
  onChange: (data: DealPurposeForm) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isReadOnly?: boolean;
  dealId?: string;
  organizationId?: string;
  onDocumentUpload?: (documents: any[]) => void;
  onDeleteDocument?: (dealId: string, document: any) => Promise<boolean>;
  documents?: any[];
}

export const PurposeSection: React.FC<PurposeSectionProps> = ({
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
  const handleInputChange = (field: keyof DealPurposeForm, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const removeDocument = async (document: any) => {
    // Check if this is a saved document (has id and filePath) or a file upload
    if (document.id && document.filePath && onDeleteDocument) {
      // This is a saved document - use the proper deletion method
      if (!dealId) {
        console.error("Deal ID is required for document deletion");
        return;
      }
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
          <FileText className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Deal Purpose</h3>
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
          {/* Purpose Description */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="purpose"
              placeholder="Describe the purpose of this deal..."
              value={data.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              disabled={isReadOnly}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline" className="text-sm font-medium text-gray-700">
              Timeline
            </Label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select
                value={data.timeline}
                onValueChange={(value) => handleInputChange('timeline', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  {TIMELINE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  // fomat the uploaded documents to file, 
                  const formattedDocuments = uploadedDocuments.map(doc => ({
                    file: doc,
                    formCategory: null,
                    itemId: undefined
                  }));
                  if (onDocumentUpload) {
                    onDocumentUpload([...documents, ...formattedDocuments]);
                  }
                  return uploadedDocuments;
                }}
                onSuccess={(uploadedDocuments) => {
                  console.log('Purpose documents uploaded:', uploadedDocuments);
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
                            {document.file?.file?.name || document.fileName}
                          </p>
                        </div>
                      </div>
                      {!isReadOnly && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeDocument(document)}
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
