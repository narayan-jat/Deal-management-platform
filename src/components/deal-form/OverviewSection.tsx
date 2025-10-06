import React from 'react';
import { 
  Users, 
  Percent, 
  Plus,
  X,
  Calculator,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CurrencyInput from 'react-currency-input-field';
import { DealOverviewForm, PersonTag, PersonTagType, Rate } from '@/types/deal/Deal.sections';
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
    const newTag = createPersonTag(Date.now().toString(), '', '', type);
    
    const fieldName = type === PersonTagType.BORROWERS ? 'borrowers' :
                     type === PersonTagType.LENDERS ? 'lenders' :
                     'otherParties';
    
    onChange({
      ...data,
      [fieldName]: [...data[fieldName], newTag]
    });
  };

  const handlePersonTagUpdate = (
    type: PersonTagType,
    index: number,
    field: keyof PersonTag,
    value: string
  ) => {
    const fieldName = type === PersonTagType.BORROWERS ? 'borrowers' :
                     type === PersonTagType.LENDERS ? 'lenders' :
                     'otherParties';
    
    const updatedTags = [...data[fieldName]];
    updatedTags[index] = { ...updatedTags[index], [field]: value };
    onChange({
      ...data,
      [fieldName]: updatedTags
    });
  };

  const handlePersonTagRemove = (type: PersonTagType, index: number) => {
    const fieldName = type === PersonTagType.BORROWERS ? 'borrowers' :
                     type === PersonTagType.LENDERS ? 'lenders' :
                     'otherParties';
    
    const updatedTags = data[fieldName].filter((_, i) => i !== index);
    onChange({
      ...data,
      [fieldName]: updatedTags
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
      
      {(() => {
        const fieldName = type === PersonTagType.BORROWERS ? 'borrowers' :
                         type === PersonTagType.LENDERS ? 'lenders' :
                         'otherParties';
        return data[fieldName].map((tag, index) => (
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
        ));
      })()}
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
          {renderPersonTags(PersonTagType.BORROWERS, 'Borrowers')}
          {renderPersonTags(PersonTagType.LENDERS, 'Lenders')}
          {renderPersonTags(PersonTagType.OTHER_PARTIES, 'Other Parties')}

          {/* Loan Request */}
          <div className="space-y-2">
            <Label htmlFor="loanRequest" className="text-sm font-medium text-gray-700">
              Loan Request Amount
            </Label>
            <CurrencyInput
              id="loanRequest"
              value={data.loanRequest}
              onValueChange={(value) => onChange({ ...data, loanRequest: parseFloat(value || '0') })}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              prefix="$"
              decimalsLimit={2}
              allowDecimals={true}
            />
          </div>

          {/* Total Project Cost */}
          <div className="space-y-2">
            <Label htmlFor="totalProjectCost" className="text-sm font-medium text-gray-700">
              Total Project Cost
            </Label>
            <CurrencyInput
              id="totalProjectCost"
              value={data.totalProjectCost}
              onValueChange={(value) => onChange({ ...data, totalProjectCost: parseFloat(value || '0') })}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              prefix="$"
              decimalsLimit={2}
              allowDecimals={true}
            />
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
                  onChange={(e) => onChange({ ...data, ltv: parseFloat(e.target.value) || 0 })}
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
                  onChange={(e) => onChange({ ...data, dscr: parseFloat(e.target.value) || 0 })}
                  disabled={isReadOnly}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
