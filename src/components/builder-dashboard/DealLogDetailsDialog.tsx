import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DealLogModel } from '@/types/deal/Deal.model';
import { formatDate } from '@/utility/Utility';
import { parseLogData } from '@/utility/LogDataParser';
import { getLogIcon } from '@/utility/LogIconUtils';

interface DealLogDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLog: DealLogModel | null;
  getMemberName: (memberId: string) => string;
}

export default function DealLogDetailsDialog({
  isOpen,
  onClose,
  selectedLog,
  getMemberName
}: DealLogDetailsDialogProps) {
  // Helper function to format log data for display
  const formatLogDataForDisplay = (logData: any): string => {
    if (!logData || typeof logData !== 'object') {
      return 'No additional data available';
    }

    try {
      return JSON.stringify(logData, null, 2);
    } catch (error) {
      return 'Unable to format log data';
    }
  };

  if (!selectedLog) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-hidden p-0 sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[60vw]">
        <div className="flex items-center p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              {getLogIcon(selectedLog.logType, selectedLog.logData)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Log Details</h3>
              <p className="text-xs sm:text-sm text-gray-500 truncate">{parseLogData(selectedLog.logData)}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(90vh-80px)] overflow-y-auto">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">Member</h4>
              <p className="text-xs sm:text-sm text-gray-700 break-words">{getMemberName(selectedLog.memberId)}</p>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">Log Type</h4>
              <Badge variant="outline" className="text-xs">
                {selectedLog.logType}
              </Badge>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">Created At</h4>
              <p className="text-xs sm:text-sm text-gray-700">{formatDate(selectedLog.createdAt)}</p>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1 sm:mb-2">Log ID</h4>
              <p className="text-xs sm:text-sm text-gray-700 font-mono break-all">{selectedLog.id}</p>
            </div>
          </div>

          <Separator />

          {/* Action Description */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Action Description</h4>
            <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg break-words">
              {parseLogData(selectedLog.logData)}
            </p>
          </div>

          {/* Raw Log Data */}
          <div>
            <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Raw Log Data</h4>
            <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs whitespace-pre-wrap break-words">
                {formatLogDataForDisplay(selectedLog.logData)}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 