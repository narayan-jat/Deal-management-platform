import { DealSectionName, CollateralItem, CollateralType } from '@/types/deal/Deal.sections';
import { UploadDocumentForm } from '@/types/deal/Deal.documents';
import { FinancialFormCategory } from '@/constants/DealFormConstants';

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
          const documentData = doc.file ? doc : { file: doc };
          extractedDocuments.push({
            document: documentData,
            sectionName: sectionName as DealSectionName,
            formCategory: doc.form_category || '',
            itemId: doc.itemId || undefined,
          });
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
 */
export const populateCollateralItemDocuments = (collateralItems: CollateralItem[], sectionDocuments: any[]): CollateralItem[] => {
  return collateralItems.map(item => {
    // Filter documents for this specific collateral item
    const itemDocuments = sectionDocuments.filter(doc =>
      doc.formCategory === item.collateralType && doc.itemId === item.id
    );
    
    return {
      ...item,
      documents: itemDocuments
    };
  });
};
