import React from 'react';
import { 
  Calendar, 
  FileText,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DealNextStepsForm } from '@/types/deal/Deal.sections';
import { DocumentUploadButton } from '@/components/builder-dashboard/DocumentUploadButton';

interface NextStepsSectionProps {
  data: DealNextStepsForm;
  onChange: (data: DealNextStepsForm) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isReadOnly?: boolean;
  dealId?: string;
  organizationId?: string;
}

export const NextStepsSection: React.FC<NextStepsSectionProps> = ({
  data,
  onChange,
  isEnabled,
  onToggleEnabled,
  isReadOnly = false,
  dealId,
  organizationId,
}) => {
  const handleInputChange = (field: keyof DealNextStepsForm, value: string) => {
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
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Next Steps</h3>
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
          {/* Deal Timeline */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Deal Timeline</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input
                    id="startDate"
                    type="date"
                    value={data.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    disabled={isReadOnly}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Next Meeting Date */}
              <div className="space-y-2">
                <Label htmlFor="nextMeetingDate" className="text-sm font-medium text-gray-700">
                  Next Meeting <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input
                    id="nextMeetingDate"
                    type="date"
                    value={data.nextMeetingDate}
                    onChange={(e) => handleInputChange('nextMeetingDate', e.target.value)}
                    disabled={isReadOnly}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Expected Close Date */}
              <div className="space-y-2">
                <Label htmlFor="expectedCloseDate" className="text-sm font-medium text-gray-700">
                  Expected Close Date
                </Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={data.expectedCloseDate}
                    onChange={(e) => handleInputChange('expectedCloseDate', e.target.value)}
                    disabled={isReadOnly}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes for Lender Requirements */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notes for Lender Requirements
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about lender requirements or next steps..."
              value={data.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={isReadOnly}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
