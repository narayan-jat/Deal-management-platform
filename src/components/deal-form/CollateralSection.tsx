import React, { useState } from 'react';
import { 
  Building, 
  Plus,
  X,
  FileText,
  Calendar,
  MapPin,
  Percent,
  Briefcase,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CurrencyInput from 'react-currency-input-field';
import { DocumentUploadButton } from '@/components/builder-dashboard/DocumentUploadButton';
import { CustomDatePicker } from '@/components/ui/DatePicker';
import { 
  DealCollateralForm, 
  CollateralItem, 
  PropertyCollateralItem,
  FinancialAssetsCollateralItem,
  CorporateAssetsCollateralItem,
  CollateralType,
  DebtDetails,
  COLLATERAL_TYPE_OPTIONS,
  FINANCIAL_ASSET_SUBTYPE_OPTIONS,
  CORPORATE_ASSET_SUBTYPE_OPTIONS,
  LIEN_POSITION_OPTIONS,
  LIEN_STATUS_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  PROPERTY_CONDITION_OPTIONS
} from '@/types/deal/Deal.sections';
import { populateCollateralItemDocuments } from '@/utility/DocumentExtractionUtils';

interface CollateralSectionProps {
  data: DealCollateralForm;
  onChange: (data: DealCollateralForm) => void;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  isReadOnly?: boolean;
  dealId?: string;
  organizationId?: string;
  documents?: any[];
  onDocumentUpload?: (documents: any[]) => void;
  onDeleteDocument?: (dealId: string, document: any) => Promise<boolean>;
}

export const CollateralSection: React.FC<CollateralSectionProps> = ({
  data,
  onChange,
  isEnabled,
  onToggleEnabled,
  isReadOnly = false,
  dealId,
  organizationId,
  documents = [],
  onDocumentUpload,
  onDeleteDocument
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Populate documents for each collateral item (local copy for UX)
  const itemsWithDocuments = populateCollateralItemDocuments(data.items, documents);
  
  const [newItemType, setNewItemType] = useState<CollateralType>(CollateralType.PROPERTY);

  const createNewCollateralItem = (type: CollateralType): CollateralItem => {
    const baseItem = {
      id: Date.now().toString(),
      hasDebt: false,
      notes: '',
      documents: []
    };

    switch (type) {
      case CollateralType.PROPERTY:
        return {
          ...baseItem,
          collateralType: CollateralType.PROPERTY,
          description: '',
          propertyType: '',
          buildingSize: 0,
          yearBuilt: new Date().getFullYear(),
          occupancy: 0,
          condition: '',
          location: '',
          appraisedValue: 0,
          riskNotes: ''
        } as PropertyCollateralItem;

      case CollateralType.FINANCIAL_ASSETS:
        return {
          ...baseItem,
          collateralType: CollateralType.FINANCIAL_ASSETS,
          assetType: '',
          custodianHolder: '',
          value: 0,
          lienStatus: ''
        } as FinancialAssetsCollateralItem;

      case CollateralType.CORPORATE_ASSETS:
        return {
          ...baseItem,
          collateralType: CollateralType.CORPORATE_ASSETS,
          assetType: '',
          description: '',
          estimatedValue: 0,
          ownership: ''
        } as CorporateAssetsCollateralItem;

      default:
        throw new Error(`Unknown collateral type: ${type}`);
    }
  };

  const addCollateralItem = () => {
    const newItem = createNewCollateralItem(newItemType);
    onChange({
      ...data,
      items: [...data.items, newItem]
    });
    setExpandedItem(newItem.id);
  };

  const updateCollateralItem = (id: string, updates: Partial<CollateralItem>) => {
    const updatedItems = data.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    onChange({
      ...data,
      items: updatedItems as CollateralItem[]
    });
  };

  const removeCollateralItem = (id: string) => {
    const updatedItems = data.items.filter(item => item.id !== id);
    onChange({
      ...data,
      items: updatedItems
    });
    if (expandedItem === id) {
      setExpandedItem(null);
    }
  };

  const updateDebtDetails = (itemId: string, updates: Partial<DebtDetails>) => {
    const updatedItems = data.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          debtDetails: { ...item.debtDetails, ...updates }
        };
      }
      return item;
    });
    onChange({
      ...data,
      items: updatedItems
    });
  };

  const handleItemDocumentUpload = async (itemId: string, uploadedDocuments: any[]) => {
    // Find the collateral item to get its type
    const item = data.items.find(item => item.id === itemId);
    if (!item) return uploadedDocuments;

    // Add the documents to the main documents array with standardized format
    const categorizedDocuments = uploadedDocuments.map(doc => ({
      file: doc,
      formCategory: item.collateralType,
      itemId: itemId
    }));


    // Update the main documents array through the parent component
    if (onDocumentUpload) {
      onDocumentUpload([...documents, ...categorizedDocuments]);
    }


    return categorizedDocuments;
  };


  const removeDocument = async (document: any) => {
    // Check if this is a saved document (has id and filePath) or a file upload
    if (document.id && document.filePath && onDeleteDocument) {
      if (!dealId) {
        console.error("Deal ID is required for document deletion");
        return;
      }
      // This is a saved document - use the proper deletion method
      const success = await onDeleteDocument(dealId, document);
      if (success && onDocumentUpload) {
        // Remove from local documents array after successful deletion
        onDocumentUpload(documents.filter(doc => doc.id !== document.id));
      }
    } else if (document.file && onDocumentUpload) {
      // This is a file upload that hasn't been saved yet - just remove from array
      onDocumentUpload(documents.filter(doc => doc.file?.file?.name !== document.file?.file?.name));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case CollateralType.PROPERTY:
        return <Building className="h-4 w-4 text-gray-500" />;
      case CollateralType.FINANCIAL_ASSETS:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
      case CollateralType.CORPORATE_ASSETS:
        return <Briefcase className="h-4 w-4 text-gray-500" />;
      default:
        return <Building className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    return COLLATERAL_TYPE_OPTIONS.find(opt => opt.value === type)?.label || type;
  };

  const renderDebtDetails = (item: CollateralItem) => {
    if (!item.hasDebt || !item.debtDetails) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Debt Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Lender Name</Label>
            <Input
              value={item.debtDetails.lenderName}
              onChange={(e) => updateDebtDetails(item.id, { lenderName: e.target.value })}
              disabled={isReadOnly}
              placeholder="Enter lender name"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Outstanding Balance</Label>
            <CurrencyInput
              value={item.debtDetails.outstandingBalance}
              onValueChange={(value) => updateDebtDetails(item.id, { outstandingBalance: parseFloat(value || '0') })}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              prefix="$"
              decimalsLimit={2}
              allowDecimals={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Original Loan Amount (Optional)</Label>
            <CurrencyInput
              value={item.debtDetails.originalLoanAmount || 0}
              onValueChange={(value) => updateDebtDetails(item.id, { originalLoanAmount: parseFloat(value || '0') })}
              disabled={isReadOnly}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              prefix="$"
              decimalsLimit={2}
              allowDecimals={true}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Interest Rate (%)</Label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="number"
                value={item.debtDetails.interestRate}
                onChange={(e) => updateDebtDetails(item.id, { interestRate: parseFloat(e.target.value) || 0 })}
                disabled={isReadOnly}
                className="pl-10"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Maturity Date</Label>
            <CustomDatePicker
              value={item.debtDetails.maturityDate}
              onChange={(date) => updateDebtDetails(item.id, { maturityDate: date })}
              placeholder="Select maturity date"
              disabled={isReadOnly}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Lien Position</Label>
            <Select
              value={item.debtDetails.lienPosition}
              onValueChange={(value) => updateDebtDetails(item.id, { lienPosition: value })}
              disabled={isReadOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lien position" />
              </SelectTrigger>
              <SelectContent>
                {LIEN_POSITION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Collateral Secured Against (Optional)</Label>
          <Input
            value={item.debtDetails.collateralSecuredAgainst || ''}
            onChange={(e) => updateDebtDetails(item.id, { collateralSecuredAgainst: e.target.value })}
            disabled={isReadOnly}
            placeholder="Describe what this debt is secured against"
          />
        </div>

      </div>
    );
  };

  const renderPropertyForm = (item: PropertyCollateralItem) => (
    <div className="space-y-4">
      {/* Property Description */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Property Description</Label>
        <Textarea
          value={item.description}
          onChange={(e) => updateCollateralItem(item.id, { description: e.target.value })}
          disabled={isReadOnly}
          placeholder="Describe the property..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Property Type and Building Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Property Type</Label>
          <Select
            value={item.propertyType}
            onValueChange={(value) => updateCollateralItem(item.id, { propertyType: value })}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Building Size (sq ft)</Label>
          <Input
            type="number"
            value={item.buildingSize}
            onChange={(e) => updateCollateralItem(item.id, { buildingSize: parseFloat(e.target.value) || 0 })}
            disabled={isReadOnly}
            placeholder="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Year Built and Occupancy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Year Built/Renovated</Label>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Input
              type="number"
              value={item.yearBuilt}
              onChange={(e) => updateCollateralItem(item.id, { yearBuilt: parseInt(e.target.value) || new Date().getFullYear() })}
              disabled={isReadOnly}
              placeholder="2024"
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Occupancy (%)</Label>
          <Input
            type="number"
            value={item.occupancy}
            onChange={(e) => updateCollateralItem(item.id, { occupancy: parseFloat(e.target.value) || 0 })}
            disabled={isReadOnly}
            placeholder="0"
            min="0"
            max="100"
            step="0.01"
          />
        </div>
      </div>

      {/* Condition and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Condition</Label>
          <Select
            value={item.condition}
            onValueChange={(value) => updateCollateralItem(item.id, { condition: value })}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_CONDITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Location</Label>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Input
              value={item.location}
              onChange={(e) => updateCollateralItem(item.id, { location: e.target.value })}
              disabled={isReadOnly}
              placeholder="Enter location"
            />
          </div>
        </div>
      </div>

      {/* Appraised Value */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Appraised Value</Label>
        <CurrencyInput
          value={item.appraisedValue}
          onValueChange={(value) => updateCollateralItem(item.id, { appraisedValue: parseFloat(value || '0') })}
          disabled={isReadOnly}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
          prefix="$"
          decimalsLimit={2}
          allowDecimals={true}
        />
      </div>

      {/* Risk Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Environmental / Risk Notes</Label>
        <Textarea
          value={item.riskNotes}
          onChange={(e) => updateCollateralItem(item.id, { riskNotes: e.target.value })}
          disabled={isReadOnly}
          placeholder="Add any environmental or risk considerations..."
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );

  const renderFinancialAssetsForm = (item: FinancialAssetsCollateralItem) => (
    <div className="space-y-4">
      {/* Asset Type and Custodian/Holder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Asset Type</Label>
          <Select
            value={item.assetType}
            onValueChange={(value) => updateCollateralItem(item.id, { assetType: value })}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {FINANCIAL_ASSET_SUBTYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Custodian/Holder</Label>
          <Input
            value={item.custodianHolder}
            onChange={(e) => updateCollateralItem(item.id, { custodianHolder: e.target.value })}
            disabled={isReadOnly}
            placeholder="Enter custodian or holder"
          />
        </div>
      </div>

      {/* Value and Lien Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Value</Label>
          <CurrencyInput
            value={item.value}
            onValueChange={(value) => updateCollateralItem(item.id, { value: parseFloat(value || '0') })}
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            prefix="$"
            decimalsLimit={2}
            allowDecimals={true}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Lien Status</Label>
          <Select
            value={item.lienStatus}
            onValueChange={(value) => updateCollateralItem(item.id, { lienStatus: value })}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select lien status" />
            </SelectTrigger>
            <SelectContent>
              {LIEN_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Notes</Label>
        <Textarea
          value={item.notes}
          onChange={(e) => updateCollateralItem(item.id, { notes: e.target.value })}
          disabled={isReadOnly}
          placeholder="Additional notes about this financial asset..."
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );

  const renderCorporateAssetsForm = (item: CorporateAssetsCollateralItem) => (
    <div className="space-y-4">
      {/* Asset Type and Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Asset Type</Label>
          <Select
            value={item.assetType}
            onValueChange={(value) => updateCollateralItem(item.id, { assetType: value })}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select asset type" />
            </SelectTrigger>
            <SelectContent>
              {CORPORATE_ASSET_SUBTYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Description</Label>
          <Input
            value={item.description}
            onChange={(e) => updateCollateralItem(item.id, { description: e.target.value })}
            disabled={isReadOnly}
            placeholder="Describe the asset"
          />
        </div>
      </div>

      {/* Estimated Value and Ownership */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Estimated Value</Label>
          <CurrencyInput
            value={item.estimatedValue}
            onValueChange={(value) => updateCollateralItem(item.id, { estimatedValue: parseFloat(value || '0') })}
            disabled={isReadOnly}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            prefix="$"
            decimalsLimit={2}
            allowDecimals={true}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Ownership</Label>
          <Input
            value={item.ownership}
            onChange={(e) => updateCollateralItem(item.id, { ownership: e.target.value })}
            disabled={isReadOnly}
            placeholder="Enter ownership details"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Notes</Label>
        <Textarea
          value={item.notes}
          onChange={(e) => updateCollateralItem(item.id, { notes: e.target.value })}
          disabled={isReadOnly}
          placeholder="Additional notes about this corporate asset..."
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );

  const renderCollateralItem = (item: CollateralItem) => {
    const isExpanded = expandedItem === item.id;

    return (
      <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon(item.collateralType)}
            <span className="text-sm font-medium text-gray-700">
              {getTypeLabel(item.collateralType)}
            </span>
            {item.collateralType === 'PROPERTY' && (item as PropertyCollateralItem).propertyType && (
              <span className="text-xs text-gray-500">
                - {PROPERTY_TYPE_OPTIONS.find(opt => opt.value === (item as PropertyCollateralItem).propertyType)?.label}
              </span>
            )}
            {item.collateralType === 'FINANCIAL_ASSETS' && (item as FinancialAssetsCollateralItem).assetType && (
              <span className="text-xs text-gray-500">
                - {FINANCIAL_ASSET_SUBTYPE_OPTIONS.find(opt => opt.value === (item as FinancialAssetsCollateralItem).assetType)?.label}
              </span>
            )}
            {item.collateralType === 'CORPORATE_ASSETS' && (item as CorporateAssetsCollateralItem).assetType && (
              <span className="text-xs text-gray-500">
                - {CORPORATE_ASSET_SUBTYPE_OPTIONS.find(opt => opt.value === (item as CorporateAssetsCollateralItem).assetType)?.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpandedItem(isExpanded ? null : item.id)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {!isReadOnly && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCollateralItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* Render specific form based on type */}
            {item.collateralType === 'PROPERTY' && renderPropertyForm(item as PropertyCollateralItem)}
            {item.collateralType === 'FINANCIAL_ASSETS' && renderFinancialAssetsForm(item as FinancialAssetsCollateralItem)}
            {item.collateralType === 'CORPORATE_ASSETS' && renderCorporateAssetsForm(item as CorporateAssetsCollateralItem)}

            {/* Debt Indicator - Common for all types */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`debt-${item.id}`}
                  checked={item.hasDebt}
                  onChange={(e) => {
                    const hasDebt = e.target.checked;
                    updateCollateralItem(item.id, { 
                      hasDebt,
                      debtDetails: hasDebt ? {
                        lenderName: '',
                        outstandingBalance: 0,
                        interestRate: 0,
                        maturityDate: '',
                        lienPosition: 'first'
                      } : undefined
                    });
                  }}
                  disabled={isReadOnly}
                  className="rounded"
                />
                <Label htmlFor={`debt-${item.id}`} className="text-sm font-medium text-gray-700">
                  Does this collateral have existing debt?
                </Label>
              </div>
            </div>

            {/* Debt Details - Common for all types */}
            {renderDebtDetails(item)}

            {/* Document Upload - Common for all types */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Supporting Documents
              </Label>
              {(
                <DocumentUploadButton
                  dealId={dealId}
                  organizationId={organizationId}
                  onUpload={async (uploadedDocuments) => {
                    await handleItemDocumentUpload(item.id, uploadedDocuments);
                    return uploadedDocuments;
                  }}
                  onSuccess={(uploadedDocuments) => {
                  }}
                  className="w-full"
                  buttonText="Upload Documents"
                  loadingText="Uploading..."
                />
              )}
              
              {/* Document List for this item */}
              {item.documents && item.documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Uploaded Files ({item.documents.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {item.documents.map((document: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {document.file?.file?.name || document.fileName}
                            </p>
                          </div>
                        </div>
                        {!isReadOnly && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(document)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Collateral Summary</h3>
        </div>
        {!isReadOnly && (
          <Button
            type="button"
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            onClick={onToggleEnabled}
          >
            {isEnabled ? 'Enabled' : 'Enable'}
          </Button>
        )}
      </div>

      {isEnabled && (
        <div className="space-y-6 p-4 border border-gray-200 rounded-lg bg-white">
          {/* Add Collateral Section */}
          {!isReadOnly && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Add New Collateral</Label>
                  <Select
                    value={newItemType}
                    onValueChange={(value) => setNewItemType(value as CollateralType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select collateral type" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLLATERAL_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCollateralItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Collateral
                </Button>
              </div>
            </div>
          )}

          {/* Collateral Items */}
          {itemsWithDocuments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No collateral items added yet.</p>
              <p className="text-sm">Select a type and click "Add Collateral" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {itemsWithDocuments.map((item) => renderCollateralItem(item))}
            </div>
          )}

        </div>
      )}
    </div>
  );
};