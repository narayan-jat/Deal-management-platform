# Deal Services Documentation

This document describes the updated deal services that support the new multi-section deal structure with enhanced document management.

## Service Overview

### Core Services

#### 1. DealService
**Purpose**: Main service for comprehensive deal management with sections and documents.

**Key Methods**:
- `createCompleteDeal(dealFormData, dealMembers)` - Creates a complete deal with all sections
- `updateCompleteDeal(dealId, dealFormData, dealMembers)` - Updates a complete deal
- `getCompleteDeal(dealId)` - Gets a complete deal with all sections and documents
- `deleteCompleteDeal(dealId)` - Deletes a complete deal and all related data

**Usage Example**:
```typescript
import { DealService } from '@/services';

// Create a complete deal
const result = await DealService.createCompleteDeal(dealFormData, dealMembers);
console.log(result.deal, result.sections, result.documents);
```

#### 2. DealSectionsService
**Purpose**: Manages individual deal sections (Overview, Purpose, Collateral, Financials, Next Steps).

**Key Methods**:
- `createOrUpdateDealSections(dealId, sectionsEnabled)` - Updates section enablement
- `createOrUpdateAllDealSections(dealId, sectionsEnabled, sectionsData)` - Updates all sections
- `getAllDealSections(dealId)` - Gets all sections for a deal
- `deleteAllDealSections(dealId)` - Deletes all sections for a deal

**Section-Specific Methods**:
- `createOrUpdateDealOverview(dealId, overviewData)`
- `createOrUpdateDealPurpose(dealId, purposeData)`
- `createOrUpdateDealCollateral(dealId, collateralData)`
- `createOrUpdateDealFinancials(dealId, financialsData)`
- `createOrUpdateDealNextSteps(dealId, nextStepsData)`

#### 3. DealDocumentService
**Purpose**: Enhanced document management with section-based organization.

**Key Methods**:
- `createSectionDocuments(dealId, sectionName, documents, formCategory?, itemId?)` - Creates documents for a section
- `getSectionDocuments(dealId, sectionName, formCategory?, itemId?)` - Gets documents for a section
- `getAllDealDocumentsBySection(dealId)` - Gets all documents organized by section
- `deleteSectionDocuments(dealId, sectionName, formCategory?, itemId?)` - Deletes section documents
- `updateDocumentSection(documentId, sectionName, formCategory?, itemId?)` - Updates document section info

**Legacy Methods** (still supported):
- `createDealDocuments(documents)` - Creates documents (legacy)
- `getDealDocuments(dealId)` - Gets all documents for a deal (legacy)
- `updateDealDocuments(documents)` - Updates documents (legacy)
- `deleteDealDocument(documentIds)` - Deletes documents by ID (legacy)

### Specialized Document Services

#### 4. CollateralDocumentService
**Purpose**: Specialized service for managing collateral item documents.

**Key Methods**:
- `createCollateralItemDocuments(dealId, collateralItem, documents)` - Creates documents for a collateral item
- `getCollateralItemDocuments(dealId, collateralItemId)` - Gets documents for a collateral item
- `deleteCollateralItemDocuments(dealId, collateralItemId)` - Deletes documents for a collateral item
- `getAllCollateralDocumentsByItem(dealId)` - Gets all collateral documents organized by item
- `updateCollateralItemDocuments(dealId, collateralItem, documents)` - Updates documents for a collateral item

**Usage Example**:
```typescript
import { CollateralDocumentService } from '@/services';

// Create documents for a property collateral item
const documents = await CollateralDocumentService.createCollateralItemDocuments(
  dealId, 
  propertyCollateralItem, 
  uploadedDocuments
);
```

#### 5. FinancialDocumentService
**Purpose**: Specialized service for managing financial documents.

**Key Methods**:
- `createFinancialDocuments(dealId, formCategory, documents)` - Creates financial documents
- `getFinancialDocuments(dealId, formCategory?)` - Gets financial documents
- `getAllFinancialDocumentsByCategory(dealId)` - Gets all financial documents organized by category
- `deleteFinancialDocuments(dealId, formCategory?)` - Deletes financial documents
- `updateFinancialDocuments(dealId, formCategory, documents)` - Updates financial documents

**Usage Example**:
```typescript
import { FinancialDocumentService } from '@/services';

// Create historical financial documents
const documents = await FinancialDocumentService.createFinancialDocuments(
  dealId, 
  'HISTORICAL', 
  historicalFinancials
);
```

## Document Organization Structure

### Section-Based Organization
Documents are organized by:
- **section_name**: OVERVIEW, PURPOSE, COLLATERAL, FINANCIALS, NEXT_STEPS
- **form_category**: Sub-categorization within sections
- **item_id**: Links to specific items within sections

### Form Categories by Section

#### COLLATERAL Section
- `PROPERTY` - Property collateral documents
- `FINANCIAL_ASSETS` - Financial assets documents
- `CORPORATE_ASSETS` - Corporate assets documents

#### FINANCIALS Section
- `HISTORICAL` - Historical financial documents
- `PROJECTED` - Projected financial documents

#### Other Sections
- No specific form categories (documents are general to the section)

## Data Models

### Updated DealDocumentModel
```typescript
interface DealDocumentModel {
  id: string;
  dealId: string;
  uploadedBy: string;
  filePath: string;
  mimeType?: string;
  fileName: string;
  uploadedAt: string;
  signatureStatus: SignatureStatus;
  signedAt?: string;
  sectionName?: string; // NEW: Section identifier
  formCategory?: string; // NEW: Form category
  itemId?: string; // NEW: Item identifier
}
```

### CompleteDealForm
```typescript
interface CompleteDealForm {
  // Basic deal info
  title: string;
  industry: string;
  organizationId: string;
  status: string;
  location: string;
  notes: string;
  
  // Sections
  overview: DealOverviewForm;
  purpose: DealPurposeForm;
  collateral: DealCollateralForm;
  financials: DealFinancialsForm;
  nextSteps: DealNextStepsForm;
  
  // Section enablement
  sectionsEnabled: {
    [DealSectionName.BASIC_INFO]: boolean;
    [DealSectionName.OVERVIEW]: boolean;
    [DealSectionName.PURPOSE]: boolean;
    [DealSectionName.COLLATERAL]: boolean;
    [DealSectionName.FINANCIALS]: boolean;
    [DealSectionName.NEXT_STEPS]: boolean;
  };
  
  // Documents for each section
  documents: {
    [DealSectionName.PURPOSE]: any[];
    [DealSectionName.COLLATERAL]: any[];
    [DealSectionName.FINANCIALS]: any[];
  };
}
```

## Best Practices

### 1. Use Appropriate Service
- Use `DealService` for complete deal operations
- Use `DealSectionsService` for individual section management
- Use specialized document services for specific document types

### 2. Document Organization
- Always specify `sectionName` when creating documents
- Use `formCategory` for sub-categorization within sections
- Use `itemId` for linking documents to specific items (e.g., collateral items)

### 3. Error Handling
- All services use `ErrorService.handleApiError()` for consistent error handling
- Services throw errors that should be caught by calling code

### 4. Data Transformation
- Services automatically handle snake_case ↔ camelCase conversion
- Use `snakecaseKeys()` for outgoing data
- Use `camelcaseKeys()` for incoming data

### 5. Transaction Management
- Use `createCompleteDeal()` and `updateCompleteDeal()` for atomic operations
- Individual section operations are not atomic - use with caution

## Migration Notes

### Backward Compatibility
- Legacy methods in `DealDocumentService` are still supported
- Existing code using old methods will continue to work
- New code should use section-based methods

### Database Changes
- New columns added to `deal_documents` table
- New tables created for deal sections
- Existing data remains intact

### Performance Considerations
- Use specific queries with filters for better performance
- Indexes are created for `section_name`, `form_category`, and `item_id`
- Consider pagination for large document sets
