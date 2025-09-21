import React from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Building2, 
  Clock,
  MessageSquare,
  Tag,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DealCardType } from '@/types/deal/DealCard';
import { cn } from '@/lib/utils';
import { formatCurrency, getStatusInfo, formatDate } from '@/utility/Utility';

interface BasicInfoSectionProps {
  deal: DealCardType;
  onDocumentPreview?: (document: any) => void;
  onDocumentDownload?: (document: any) => void;
  documents?: any[];
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  deal, 
  onDocumentPreview, 
  onDocumentDownload, 
  documents = [] 
}) => {
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

      {/* Documents for this section */}
      {documents && documents.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </h4>
          <div className="space-y-3">
            {documents.map((document: any, index: number) => (
              <div
                key={document.id || index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div 
                  className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => onDocumentPreview?.(document)}
                >
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {document.fileName || document.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {document.mimeType} • {new Date(document.uploadedAt || document.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {onDocumentDownload && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDocumentDownload(document);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Download document"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
