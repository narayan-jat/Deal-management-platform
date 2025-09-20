import React from 'react';
import { FileText, Calendar, Clock, Target } from 'lucide-react';
import { formatDate } from '@/utility/Utility';

interface NextStepsSectionProps {
  nextStepsData: any;
  deal: any;
  onDocumentPreview: (document: any) => void;
  onDocumentDownload: (document: any) => void;
}

export const NextStepsSection: React.FC<NextStepsSectionProps> = ({ 
  nextStepsData, 
  deal,
  onDocumentPreview,
  onDocumentDownload
}) => {
  if (!nextStepsData) {
    return <div className="text-center py-8 text-gray-500">No next steps data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Timeline Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Origination Date</p>
            <p className="font-medium text-gray-900">{formatDate(nextStepsData.startDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Next Milestone Date</p>
            <p className="font-medium text-gray-900">{formatDate(nextStepsData.nextMeetingDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
          <div className="p-2 bg-green-100 rounded-lg">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Target Close Date</p>
            <p className="font-medium text-gray-900">{formatDate(nextStepsData.expectedCloseDate)}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {nextStepsData.notes && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Notes</h4>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {nextStepsData.notes}
            </p>
          </div>
        </div>
      )}

      {/* Documents for this section */}
      {deal.documents && deal.documents.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Documents</span>
          </h4>
          <div className="space-y-3">
            {deal.documents.map((document: any, index: number) => (
              <div
                key={document.id || index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div 
                  className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => onDocumentPreview(document)}
                >
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {document.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {document.mimeType} • {new Date(document.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
