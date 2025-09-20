import React from 'react';
import { FileText, Shield, Building2, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utility/Utility';

interface CollateralSectionProps {
  collateralData: any;
  deal: any;
  onDocumentPreview: (document: any) => void;
  onDocumentDownload: (document: any) => void;
}

export const CollateralSection: React.FC<CollateralSectionProps> = ({ 
  collateralData, 
  deal,
  onDocumentPreview,
  onDocumentDownload
}) => {
  if (!collateralData || !collateralData.items || collateralData.items.length === 0) {
    return <div className="text-center py-8 text-gray-500">No collateral data available</div>;
  }

  const getCollateralIcon = (type: string) => {
    switch (type) {
      case 'PROPERTY':
        return Building2;
      case 'FINANCIAL_ASSETS':
        return DollarSign;
      case 'CORPORATE_ASSETS':
        return Shield;
      default:
        return Shield;
    }
  };

  const getCollateralTypeLabel = (type: string) => {
    switch (type) {
      case 'PROPERTY':
        return 'Property';
      case 'FINANCIAL_ASSETS':
        return 'Financial Assets';
      case 'CORPORATE_ASSETS':
        return 'Corporate Assets';
      default:
        return type;
    }
  };

  console.log(collateralData);
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <Shield className="w-5 h-5" />
        <span>Collateral Items</span>
      </h4>
      
      <div className="space-y-4">
        {collateralData.items.map((item: any, index: number) => {
          const Icon = getCollateralIcon(item.collateralType);
          const typeLabel = getCollateralTypeLabel(item.collateralType);
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">{typeLabel}</h5>
                    <p className="text-sm text-gray-500">Collateral Item #{index + 1}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {typeLabel}
                </span>
              </div>
              
              <div className="space-y-3">
                {item.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                      {item.description}
                    </p>
                  </div>
                )}
                
                {/* Show value based on collateral type */}
                {item.collateralType === 'PROPERTY' && item.appraisedValue && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Appraised Value</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(item.appraisedValue)}
                    </p>
                  </div>
                )}
                {item.collateralType === 'FINANCIAL_ASSETS' && item.value && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Value</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(item.value)}
                    </p>
                  </div>
                )}
                {item.collateralType === 'CORPORATE_ASSETS' && item.estimatedValue && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Estimated Value</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(item.estimatedValue)}
                    </p>
                  </div>
                )}
                
                {/* Property specific fields */}
                {item.collateralType === 'PROPERTY' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.propertyType && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Property Type</p>
                        <p className="text-sm text-gray-600">{item.propertyType}</p>
                      </div>
                    )}
                    {item.location && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
                        <p className="text-sm text-gray-600">{item.location}</p>
                      </div>
                    )}
                    {item.buildingSize && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Building Size</p>
                        <p className="text-sm text-gray-600">{item.buildingSize} sq ft</p>
                      </div>
                    )}
                    {item.yearBuilt && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Year Built</p>
                        <p className="text-sm text-gray-600">{item.yearBuilt}</p>
                      </div>
                    )}
                    {item.occupancy && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Occupancy</p>
                        <p className="text-sm text-gray-600">{item.occupancy}%</p>
                      </div>
                    )}
                    {item.condition && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Condition</p>
                        <p className="text-sm text-gray-600">{item.condition}</p>
                      </div>
                    )}
                    {item.riskNotes && (
                      <div className="col-span-full">
                        <p className="text-sm font-medium text-gray-700 mb-1">Risk Notes</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border whitespace-pre-wrap">{item.riskNotes}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Financial Assets specific fields */}
                {item.collateralType === 'FINANCIAL_ASSETS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.assetType && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Asset Type</p>
                        <p className="text-sm text-gray-600">{item.assetType}</p>
                      </div>
                    )}
                    {item.custodianHolder && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Custodian/Holder</p>
                        <p className="text-sm text-gray-600">{item.custodianHolder}</p>
                      </div>
                    )}
                    {item.lienStatus && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Lien Status</p>
                        <p className="text-sm text-gray-600">{item.lienStatus}</p>
                      </div>
                    )}
                    {item.notes && (
                      <div className="col-span-full">
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border whitespace-pre-wrap">{item.notes}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Corporate Assets specific fields */}
                {item.collateralType === 'CORPORATE_ASSETS' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.assetType && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Asset Type</p>
                        <p className="text-sm text-gray-600">{item.assetType}</p>
                      </div>
                    )}
                    {item.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    )}
                    {item.ownership && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Ownership</p>
                        <p className="text-sm text-gray-600">{item.ownership}</p>
                      </div>
                    )}
                    {item.notes && (
                      <div className="col-span-full">
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded border whitespace-pre-wrap">{item.notes}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Debt Details */}
                {item.debtDetails && item.debtDetails.hasDebt && (
                  <div className="pt-4 border-t border-gray-200">
                    <h6 className="text-sm font-semibold text-gray-900 mb-3">Debt Details</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item.debtDetails.lenderName && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Lender</p>
                          <p className="text-sm text-gray-600">{item.debtDetails.lenderName}</p>
                        </div>
                      )}
                      {item.debtDetails.outstandingBalance && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Outstanding Balance</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.debtDetails.outstandingBalance)}</p>
                        </div>
                      )}
                      {item.debtDetails.interestRate && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Interest Rate</p>
                          <p className="text-sm text-gray-600">{item.debtDetails.interestRate}%</p>
                        </div>
                      )}
                      {item.debtDetails.maturityDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Maturity Date</p>
                          <p className="text-sm text-gray-600">{new Date(item.debtDetails.maturityDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
