import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Building2, DollarSign, Shield } from 'lucide-react';
import { CollateralItem } from '@/types/deal/Deal.sections';
import { PropertyCollateralRenderer } from './PropertyCollateralRenderer';
import { FinancialAssetsCollateralRenderer } from './FinancialAssetsCollateralRenderer';
import { CorporateAssetsCollateralRenderer } from './CorporateAssetsCollateralRenderer';

interface CollateralItemCardProps {
  item: CollateralItem;
  index: number;
  onDocumentPreview?: (document: any) => void;
  onDocumentDownload?: (document: any) => void;
}

export const CollateralItemCard: React.FC<CollateralItemCardProps> = ({
  item,
  index,
  onDocumentPreview,
  onDocumentDownload
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getCollateralValue = (item: CollateralItem) => {
    switch (item.collateralType) {
      case 'PROPERTY':
        return (item as any).appraisedValue;
      case 'FINANCIAL_ASSETS':
        return (item as any).value;
      case 'CORPORATE_ASSETS':
        return (item as any).estimatedValue;
      default:
        return 0;
    }
  };

  const renderCollateralContent = () => {
    switch (item.collateralType) {
      case 'PROPERTY':
        return (
          <PropertyCollateralRenderer
            item={item as any}
            index={index}
            onDocumentPreview={onDocumentPreview}
            onDocumentDownload={onDocumentDownload}
          />
        );
      case 'FINANCIAL_ASSETS':
        return (
          <FinancialAssetsCollateralRenderer
            item={item as any}
            index={index}
            onDocumentPreview={onDocumentPreview}
            onDocumentDownload={onDocumentDownload}
          />
        );
      case 'CORPORATE_ASSETS':
        return (
          <CorporateAssetsCollateralRenderer
            item={item as any}
            index={index}
            onDocumentPreview={onDocumentPreview}
            onDocumentDownload={onDocumentDownload}
          />
        );
      default:
        return <div>Unknown collateral type</div>;
    }
  };

  const Icon = getCollateralIcon(item.collateralType);
  const typeLabel = getCollateralTypeLabel(item.collateralType);
  const value = getCollateralValue(item);

  return (
    <div className="border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h5 className="font-semibold text-gray-900">{typeLabel}</h5>
            <p className="text-sm text-gray-500">Collateral Item #{index + 1}</p>
            {value > 0 && (
              <p className="text-sm font-medium text-green-600">
                ${value.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            {typeLabel}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200">
          {renderCollateralContent()}
        </div>
      )}
    </div>
  );
};
