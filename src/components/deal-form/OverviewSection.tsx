import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Percent, 
  Tag,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentUploadButton } from '@/components/builder-dashboard/DocumentUploadButton';
import { DealOverviewForm, PersonTag, PersonTagType, Rate } from '@/types/deal/Deal.sections';
import { DealStatus } from '@/types/deal/Deal.enums';
import { createPersonTag, createSingleRate, createRangeRate } from '@/utility/DealFormUtils';

interface OverviewSectionProps {
  data: DealOverviewForm;
  onChange: (data: DealOverviewForm) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isReadOnly?: boolean;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  data,
  onChange,
  isEnabled,
  onToggleEnabled,
  isReadOnly = false
}) => {
  const handlePersonTagAdd = (type: PersonTagType) => {
    const newTag = createPersonTag('', '', '', type);
    onChange({
      ...data,
      [type]: [...data[type], newTag]
    });
  };

  const handlePersonTagUpdate = (
    type: PersonTagType,
    index: number,
    field: keyof PersonTag,
    value: string
  ) => {
    const updatedTags = [...data[type]];
    updatedTags[index] = { ...updatedTags[index], [field]: value };
    onChange({
      ...data,
      [type]: updatedTags
    });
  };

  const handlePersonTagRemove = (type: PersonTagType, index: number) => {
    const updatedTags = data[type].filter((_, i) => i !== index);
    onChange({
      ...data,
      [type]: updatedTags
    });
  };

  const handleRateChange = (rateType: 'single' | 'range') => {
    if (rateType === 'single') {
      onChange({
        ...data,
        rate: createSingleRate(0)
      });
    } else {
      onChange({
        ...data,
        rate: createRangeRate(0, 0)
      });
    }
  };

  const handleRateValueChange = (field: keyof Rate, value: number) => {
    onChange({
      ...data,
      rate: {
        ...data.rate,
        [field]: value
      }
    });
  };

  const renderPersonTags = (type: PersonTagType, label: string) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {!isReadOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePersonTagAdd(type)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        )}
      </div>
      
      {data[type].map((tag, index) => (
        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <div className="flex-1 grid grid-cols-3 gap-2">
            <Input
              placeholder="Name"
              value={tag.name}
              onChange={(e) => handlePersonTagUpdate(type, index, 'name', e.target.value)}
              disabled={isReadOnly}
            />
            <Input
              placeholder="Email"
              type="email"
              value={tag.email}
              onChange={(e) => handlePersonTagUpdate(type, index, 'email', e.target.value)}
              disabled={isReadOnly}
            />
            <Input
              placeholder="Role"
              value={tag.role}
              onChange={(e) => handlePersonTagUpdate(type, index, 'role', e.target.value)}
              disabled={isReadOnly}
            />
          </div>
          {!isReadOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handlePersonTagRemove(type, index)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
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
          {/* Person Tags */}
          {renderPersonTags(PersonTagType.SPONSORS, 'Sponsors')}
          {renderPersonTags(PersonTagType.BORROWERS, 'Borrowers')}
          {renderPersonTags(PersonTagType.LENDERS, 'Lenders')}

          {/* Loan Request */}
          <div className="space-y-2">
            <Label htmlFor="loanRequest" className="text-sm font-medium text-gray-700">
              Loan Request Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="loanRequest"
                type="number"
                placeholder="0.00"
                value={data.loanRequest}
                onChange={(e) => onChange({ ...data, loanRequest: parseFloat(e.target.value) || 0 })}
                disabled={isReadOnly}
                className="pl-10"
                step="0.01"
              />
            </div>
          </div>

          {/* Rate */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Rate</Label>
            
            {/* Rate Type Selection */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={data.rate.type === 'single' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRateChange('single')}
                disabled={isReadOnly}
              >
                Single Rate
              </Button>
              <Button
                type="button"
                variant={data.rate.type === 'range' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleRateChange('range')}
                disabled={isReadOnly}
              >
                Rate Range
              </Button>
            </div>

            {/* Rate Input */}
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-gray-500" />
              {data.rate.type === 'single' ? (
                <Input
                  type="number"
                  placeholder="0.00"
                  value={data.rate.value || ''}
                  onChange={(e) => handleRateValueChange('value', parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                  step="0.01"
                  className="flex-1"
                />
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={data.rate.minValue || ''}
                    onChange={(e) => handleRateValueChange('minValue', parseFloat(e.target.value) || 0)}
                    disabled={isReadOnly}
                    step="0.01"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={data.rate.maxValue || ''}
                    onChange={(e) => handleRateValueChange('maxValue', parseFloat(e.target.value) || 0)}
                    disabled={isReadOnly}
                    step="0.01"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </Label>
            <Select
              value={data.status}
              onValueChange={(value) => onChange({ ...data, status: value })}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DealStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
