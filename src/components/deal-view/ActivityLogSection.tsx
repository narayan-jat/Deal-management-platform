import React from 'react';
import { Activity, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DealLogModel } from '@/types/deal/Deal.model';
import { parseLogData } from '@/utility/LogDataParser';
import { getLogIcon } from '@/utility/LogIconUtils';
import { formatDate } from '@/utility/Utility';

interface ActivityLogSectionProps {
  dealLogs: DealLogModel[];
  isFetchingDealLogs: boolean;
  getMemberName: (memberId: string) => string;
  onViewLogDetails: (log: DealLogModel) => void;
}

export const ActivityLogSection: React.FC<ActivityLogSectionProps> = ({
  dealLogs,
  isFetchingDealLogs,
  getMemberName,
  onViewLogDetails
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>Activity Log</span>
          <Badge variant="secondary" className="ml-2">
            {dealLogs?.length || 0}
          </Badge>
        </h3>
      </div>
      <div className="p-6">
        {isFetchingDealLogs ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading activity log...</p>
          </div>
        ) : dealLogs && dealLogs.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {dealLogs.map((log, index) => (
              <div
                key={log.id || index}
                className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-w-0"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {getLogIcon(log.logType, log.logData)}
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {getMemberName(log.memberId)}
                      </p>
                      <Badge variant="outline" className="text-xs flex-shrink-0 mt-1 sm:mt-0">
                        {log.logType}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-1 break-words">
                      {parseLogData(log.logData)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(log.createdAt)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewLogDetails(log)}
                      className="p-2 h-8 w-8 hover:bg-gray-50 hover:border-gray-300"
                      title="View log details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No activity yet</p>
            <p className="text-sm text-gray-400">Activity log will appear here once actions are performed</p>
          </div>
        )}
      </div>
    </div>
  );
};
