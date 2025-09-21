import React from 'react';
import { 
  DollarSign, 
  Building2, 
  Tag,
  TrendingUp,
  Users
} from 'lucide-react';
import { formatCurrency } from '@/utility/Utility';

interface OverviewSectionProps {
  overviewData: any;
  deal: any;
  onDocumentPreview: (document: any) => void;
  onDocumentDownload: (document: any) => void;
  documents: any[];
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ 
  overviewData, 
  deal,
  onDocumentPreview,
  onDocumentDownload,
  documents = []
}) => {
  if (!overviewData) {
    return <div className="text-center py-8 text-gray-500">No overview data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Loan Request Amount</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(overviewData.loanRequest || 0)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Project Cost</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(overviewData.totalProjectCost || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">LTV</p>
              <p className="text-xl font-bold text-gray-900">
                {overviewData.ltv || 0}%
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">DSCR</p>
              <p className="text-xl font-bold text-gray-900">
                {overviewData.dscr || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Parties</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Borrowers</h5>
            <div className="space-y-2">
              {overviewData.borrowers?.length > 0 ? (
                overviewData.borrowers.map((borrower: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium text-gray-900">{borrower.name}</p>
                    <p className="text-xs text-gray-500">{borrower.email}</p>
                    {borrower.role && (
                      <p className="text-xs text-blue-600 mt-1">{borrower.role}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No borrowers listed</p>
              )}
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Lenders</h5>
            <div className="space-y-2">
              {overviewData.lenders?.length > 0 ? (
                overviewData.lenders.map((lender: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium text-gray-900">{lender.name}</p>
                    <p className="text-xs text-gray-500">{lender.email}</p>
                    {lender.role && (
                      <p className="text-xs text-blue-600 mt-1">{lender.role}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No lenders listed</p>
              )}
            </div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Other Parties</h5>
            <div className="space-y-2">
              {overviewData.otherParties?.length > 0 ? (
                overviewData.otherParties.map((party: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm font-medium text-gray-900">{party.name}</p>
                    <p className="text-xs text-gray-500">{party.email}</p>
                    {party.role && (
                      <p className="text-xs text-blue-600 mt-1">{party.role}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No other parties listed</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documents for this section */}
      {documents && documents.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Documents</h4>
          <div className="space-y-3">
            {documents.map((document: any, index: number) => (
              <div
                key={document.id || index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div 
                  className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => onDocumentPreview(document)}
                >
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <Building2 className="w-4 h-4 text-blue-600" />
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
                    <Building2 className="w-4 h-4" />
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
