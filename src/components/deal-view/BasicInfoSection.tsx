import React from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Building2, 
  Clock,
  MessageSquare,
  Tag
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DealCardType } from '@/types/deal/DealCard';
import { cn } from '@/lib/utils';
import { formatCurrency, getStatusInfo, formatDate } from '@/utility/Utility';

interface BasicInfoSectionProps {
  deal: DealCardType;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ deal }) => {
  const statusInfo = getStatusInfo(deal.status);

  return (
    <div className="space-y-6">
      {/* Status and Amount Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Tag className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge className={cn("text-xs font-medium", statusInfo.color)}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Building2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium text-gray-900">{deal.industry}</p>
          </div>
        </div>
      </div>

      {/* Industry and Location Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MapPin className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-gray-900">{deal.location || 'Not specified'}</p>
          </div>
        </div>
      </div>

      {/* Timeline Row */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium text-gray-900">{formatDate(deal.startDate)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium text-gray-900">{formatDate(deal.endDate || '')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Next Meeting</p>
            <p className="font-medium text-gray-900">{formatDate(deal.nextMeetingDate)}</p>
          </div>
        </div>
      </div> */}

      {/* Notes */}
      {deal.notes && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <p className="text-gray-700 whitespace-pre-wrap">{deal.notes}</p>
        </div>
      )}
    </div>
  );
};
