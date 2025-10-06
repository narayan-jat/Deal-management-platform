import { DealSectionName, CollateralItem } from '@/types/deal/Deal.sections';
import { UploadDocumentForm } from '@/types/deal/Deal.documents';

export interface ExtractedDocument {
  document: UploadDocumentForm;
  sectionName: DealSectionName;
  formCategory?: string;
  itemId?: string;
}

/**
 * Extracts all documents from nested sections and returns them with proper categorization
 */
export const extractDocumentsFromFormData = (formData: any): ExtractedDocument[] => {
  const extractedDocuments: ExtractedDocument[] = [];
  console.log('Extracting documents from form data:', formData);

  // Extract documents from top-level sections
  if (formData.documents) {
    Object.entries(formData.documents).forEach(([sectionName, documents]) => {
      if (Array.isArray(documents)) {
        console.log(`Found ${documents.length} documents in section ${sectionName}`);
        documents.forEach((doc: any) => {
          // Handle both old format (UploadDocumentForm) and new format (with form_category, itemId)
          const documentData = doc.file ? doc : null;
          if (documentData) {
            extractedDocuments.push({
              document: documentData.file,
              sectionName: sectionName as DealSectionName,
              formCategory: doc.formCategory || '',
              itemId: doc.itemId || undefined,
            });
          }
        });
      }
    });
  }

  // Note: Collateral documents are now handled through the main documents array
  // with proper form_category and itemId structure

  // Note: Financials documents are now handled through the main documents array
  // with proper form_category structure (HISTORICAL, PROJECTED)

  console.log(`Total extracted documents: ${extractedDocuments.length}`);
  return extractedDocuments;
};

/**
 * Removes documents from nested objects to avoid duplication
 */
export const removeDocumentsFromNestedObjects = (formData: any): any => {
  const cleanedData = { ...formData };

  // Note: Documents are now handled through the main documents array
  // No need to remove from nested structures as they're standardized

  return cleanedData;
};

/**
 * Groups extracted documents by section for easier processing
 */
export const groupDocumentsBySection = (extractedDocuments: ExtractedDocument[]): { [key: string]: ExtractedDocument[] } => {
  return extractedDocuments.reduce((groups, doc) => {
    const sectionKey = doc.sectionName;
    if (!groups[sectionKey]) {
      groups[sectionKey] = [];
    }
    groups[sectionKey].push(doc);
    return groups;
  }, {} as { [key: string]: ExtractedDocument[] });
};

/**
 * Populates documents for collateral items from the main documents array
 * This creates a local copy for better UX while keeping the main section documents as source of truth
 */
export const populateCollateralItemDocuments = (collateralItems: CollateralItem[], sectionDocuments: any[]): CollateralItem[] => {
  return collateralItems.map(item => {
    // Filter documents for this specific collateral item
    const itemDocuments = sectionDocuments.filter(doc =>
      doc.formCategory === item.collateralType && doc.itemId === item.id
    );
    
    return {
      ...item,
      documents: itemDocuments // Local copy for UX
    };
  });
};

/**
 * Populates documents for financials categories from the main documents array
 */
export const populateFinancialsDocuments = (financialsData: any, sectionDocuments: any[]): any => {
  return {
    ...financialsData,
    historicalDocuments: sectionDocuments.filter(doc => doc.formCategory === 'HISTORICAL'),
    projectedDocuments: sectionDocuments.filter(doc => doc.formCategory === 'PROJECTED')
  };
};
