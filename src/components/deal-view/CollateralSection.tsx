import React from 'react';
import { FileText, Shield } from 'lucide-react';
import { CollateralItemCard } from './collateral';

interface CollateralSectionProps {
  collateralData: any;
  deal: any;
  onDocumentPreview: (document: any) => void;
  onDocumentDownload: (document: any) => void;
  documents?: any[];
}

export const CollateralSection: React.FC<CollateralSectionProps> = ({ 
  collateralData, 
  deal,
  onDocumentPreview,
  onDocumentDownload,
  documents = []
}) => {
  if (!collateralData || !collateralData.items || collateralData.items.length === 0) {
    return <div className="text-center py-8 text-gray-500">No collateral data available</div>;
  }

  // Collect all documents from all collateral items
  const allCollateralDocuments = documents;

  console.log(collateralData);
  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <Shield className="w-5 h-5" />
        <span>Collateral Items</span>
      </h4>
      
      <div className="space-y-4">
        {collateralData.items.map((item: any, index: number) => (
          <CollateralItemCard
            key={item.id || index}
            item={item}
            index={index}
            onDocumentPreview={onDocumentPreview}
            onDocumentDownload={onDocumentDownload}
          />
        ))}
      </div>

      {/* Documents for all collaterals */}
      {allCollateralDocuments.length > 0 && (
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Collateral Documents</span>
          </h4>
          <div className="space-y-3">
            {allCollateralDocuments.map((document: any, index: number) => (
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
                      {document.fileName || document.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {document.mimeType} • {new Date(document.uploadedAt || document.createdAt).toLocaleDateString()}
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
