import React from 'react';
import { 
  FileText, 
  MapPin,
} from 'lucide-react';
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
import { DealStatus } from '@/types/deal/Deal.enums';
import { INDUSTRY_OPTIONS } from '@/Constants';

interface BasicInfoSectionProps {
  data: {
    title: string;
    industry: string;
    organizationId: string;
    location: string;
    notes: string;
    status: string;
  };
  onChange: (data: any) => void;
  isReadOnly?: boolean;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  data,
  onChange,
  isReadOnly = false
}) => {
  const handleInputChange = (field: string, value: string | number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
      </div>

      <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-white">
        {/* Deal Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter deal title"
            value={data.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            disabled={isReadOnly}
            required
            className="w-full"
          />
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.industry}
            onValueChange={(value) => handleInputChange('industry', value)}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium text-gray-700">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.status}
            onValueChange={(value) => handleInputChange('status', value)}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DealStatus).map((status) => {
                let displayStatus = status.replace('_', ' ').toLowerCase();
                displayStatus = displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);
                if (status === 'NEGOTIATION') {
                  displayStatus = 'In Negotiation';
                }
                return (
                  <SelectItem key={status} value={status}>
                    {displayStatus}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>


        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="location"
              type="text"
              placeholder="Enter location"
              value={data.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={isReadOnly}
              className="pl-10"
            />
          </div>
        </div>


        {/* Highlights */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
            Highlights
          </Label>
          <Textarea
            id="notes"
            placeholder="Add key takeaways"
            value={data.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            disabled={isReadOnly}
            rows={4}
            className="w-full resize-none"
          />
        </div>
      </div>
    </div>
  );
};
