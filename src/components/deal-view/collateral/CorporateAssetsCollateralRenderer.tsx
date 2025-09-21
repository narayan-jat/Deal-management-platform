import React from 'react';
import { Shield, Building2, Users, FileText } from 'lucide-react';
import { formatCurrency } from '@/utility/Utility';
import { CorporateAssetsCollateralItem, DebtDetails } from '@/types/deal/Deal.sections';

interface CorporateAssetsCollateralRendererProps {
  item: CorporateAssetsCollateralItem;
  index: number;
  onDocumentPreview?: (document: any) => void;
  onDocumentDownload?: (document: any) => void;
}

export const CorporateAssetsCollateralRenderer: React.FC<CorporateAssetsCollateralRendererProps> = ({
  item,
  index,
  onDocumentPreview,
  onDocumentDownload
}) => {
  const renderDebtDetails = (debtDetails: DebtDetails) => (
    <div className="pt-4 border-t border-gray-200">
      <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
        <FileText className="w-4 h-4" />
        <span>Debt Details</span>
      </h6>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {debtDetails.lenderName && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Lender</p>
            <p className="text-sm text-gray-600">{debtDetails.lenderName}</p>
          </div>
        )}
        {debtDetails.outstandingBalance && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Outstanding Balance</p>
            <p className="text-sm text-gray-600">{formatCurrency(debtDetails.outstandingBalance)}</p>
          </div>
        )}
        {debtDetails.interestRate && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Interest Rate</p>
            <p className="text-sm text-gray-600">{debtDetails.interestRate}%</p>
          </div>
        )}
        {debtDetails.maturityDate && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Maturity Date</p>
            <p className="text-sm text-gray-600">{new Date(debtDetails.maturityDate).toLocaleDateString()}</p>
          </div>
        )}
        {debtDetails.lienPosition && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Lien Position</p>
            <p className="text-sm text-gray-600">{debtDetails.lienPosition}</p>
          </div>
        )}
        {debtDetails.collateralSecuredAgainst && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Collateral Secured Against</p>
            <p className="text-sm text-gray-600">{debtDetails.collateralSecuredAgainst}</p>
          </div>
        )}
        {debtDetails.notes && (
          <div className="col-span-full">
            <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border whitespace-pre-wrap">{debtDetails.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Estimated Value */}
      {item.estimatedValue && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Estimated Value</p>
          <p className="text-lg font-semibold text-green-600">
            {formatCurrency(item.estimatedValue)}
          </p>
        </div>
      )}

      {/* Description */}
      {item.description && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
            {item.description}
          </p>
        </div>
      )}

      {/* Asset Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {item.assetType && (
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Asset Type</p>
              <p className="text-sm text-gray-600">{item.assetType}</p>
            </div>
          </div>
        )}
        
        {item.ownership && (
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">Ownership</p>
              <p className="text-sm text-gray-600">{item.ownership}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {item.notes && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border whitespace-pre-wrap">{item.notes}</p>
        </div>
      )}

      {/* Debt Details */}
      {item.hasDebt && item.debtDetails && renderDebtDetails(item.debtDetails)}

      {/* Documents */}
      {item.documents && item.documents.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h6 className="text-sm font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Documents</span>
          </h6>
          <div className="space-y-2">
            {item.documents.map((document: any, docIndex: number) => (
              <div
                key={document.id || docIndex}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
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
