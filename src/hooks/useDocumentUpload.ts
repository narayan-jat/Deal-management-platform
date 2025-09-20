import { useState } from 'react';
import { UploadDocumentForm, DealDocument } from '@/types/deal/Deal.documents';
import { DocumentStorageService } from '@/services/DocumentStorageService';
import { DealDocumentService } from '@/services/deals/DealDocumentService';
import { CollateralDocumentService } from '@/services/deals/CollateralDocumentService';
import { FinancialDocumentService } from '@/services/deals/FinancialDocumentService';
import { DealSectionName, CollateralItem } from '@/types/deal/Deal.sections';
import { useAuth } from '@/context/AuthProvider';
import { SignatureStatus } from '@/types/deal/Deal.enums';
import { createDealLogs } from './utils';
import { LogType } from '@/types/deal/Deal.enums';
import { ErrorService } from '@/services/ErrorService';

export const useDocumentUpload = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { user } = useAuth();

  // Upload documents to storage
  const handleUploadDocuments = async (dealId: string, organizationId: string, documents: UploadDocumentForm[]) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return;
    }
    
    // convert documents to File[]
    const fileDocuments = documents.map((document) => document.file);
    try {
      // get the organization
      const uploadedDocuments = await DocumentStorageService.uploadDocument(dealId, organizationId, fileDocuments);
      return uploadedDocuments;
    } catch (error) {
      setApiError(error.message);
      throw error;
    }
  };

  // Create deal documents in the database
  const createDealDocuments = async (dealId: string, documents: UploadDocumentForm[], organizationId: string, sectionName: DealSectionName = DealSectionName.PURPOSE, formCategory?: string, itemId?: string) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return [];
    }

    try {
      setLoading(true);
      
      // Upload the documents on the storage
      const uploadResults = await handleUploadDocuments(dealId, organizationId, documents);
      
      // Convert the documents to the correct format
      const dealDocuments: Partial<DealDocument>[] = uploadResults.map((result) => ({
        dealId,
        uploadedBy: user.id,
        signatureStatus: SignatureStatus.UNSIGNED,
        filePath: result.path,
        fileName: result.fileName,
        mimeType: result.mimeType,
        sectionName: sectionName,
        formCategory: formCategory,
        itemId: itemId,
      }));

      // Add the documents to the deal documents table
      if (dealDocuments.length > 0) {
        const createdDocuments = await DealDocumentService.createDealDocuments(dealDocuments);
        return createdDocuments;
      }
      
      return [];
    } catch (error) {
      setApiError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update deal documents (for edit operations)
  const updateDealDocuments = async (dealId: string, documents: UploadDocumentForm[], organizationId: string) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return [];
    }

    try {
      setLoading(true);
      
      // Filter out those documents which are already uploaded (having a filePath)
      const documentsToUpload = documents.filter((document) => !document.filePath);
      
      if (documentsToUpload.length > 0) {
        const uploadResults = await handleUploadDocuments(dealId, organizationId, documentsToUpload);
        
        // Convert the documents to the correct format
        const dealDocuments: Partial<DealDocument>[] = uploadResults.map((result) => ({
          dealId,
          uploadedBy: user.id,
          signatureStatus: SignatureStatus.UNSIGNED,
          filePath: result.path,
          fileName: result.fileName,
          mimeType: result.mimeType,
        }));

        // Add the documents to the deal documents table
        if (dealDocuments.length > 0) {
          const createdDocuments = await DealDocumentService.createDealDocuments(dealDocuments);
          
          // Create deal logs for document uploads
          const createdDocumentsMetaData = createdDocuments.map((document) => ({
            id: document.id,
            isUploaded: true,
            action: 'document uploaded',
          }));
          
          await createDealLogs(user.id, dealId, {
            documents: { documents: createdDocumentsMetaData, action: 'document uploaded' },
          }, LogType.UPDATED);
          
          return createdDocuments;
        }
      }
      
      return [];
    } catch (error) {
      setApiError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a document
  const handleDeleteDocument = async (dealId: string, documentId: string, filePath: string) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      
      // First remove the document from the storage
      await DocumentStorageService.deleteDocument(filePath);
      
      // Then remove the document from the deal documents table
      await DealDocumentService.deleteDealDocument([documentId]);
      
      // Update the deal logs
      await createDealLogs(user.id, dealId, {
        documents: {
          id: documentId,
          isDeleted: true,
          action: 'document deleted',
        },
      }, LogType.DELETED);
      
      return true;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDocumentUpload.handleDeleteDocument");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get deal documents
  const getDealDocuments = async (dealId: string) => {
    try {
      setLoading(true);
      const dealDocuments = await DealDocumentService.getDealDocuments(dealId);
      return dealDocuments;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDocumentUpload.getDealDocuments");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SECTION-BASED DOCUMENT MANAGEMENT
  // =====================================================

  // Create documents for a specific section
  const createSectionDocuments = async (
    dealId: string,
    sectionName: DealSectionName,
    documents: UploadDocumentForm[],
    formCategory?: string,
    itemId?: string
  ) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return [];
    }

    try {
      setLoading(true);
      
      // Upload the documents to storage
      const uploadResults = await handleUploadDocuments(dealId, '', documents);
      
      // Convert the documents to the correct format
      const dealDocuments: Partial<DealDocument>[] = uploadResults.map((result) => ({
        dealId,
        uploadedBy: user.id,
        signatureStatus: SignatureStatus.UNSIGNED,
        filePath: result.path,
        fileName: result.fileName,
        mimeType: result.mimeType,
      }));

      // Create section documents
      if (dealDocuments.length > 0) {
        const createdDocuments = await DealDocumentService.createSectionDocuments(
          dealId,
          sectionName,
          dealDocuments,
          formCategory,
          itemId
        );
        
        // Create deal logs for document uploads
        const createdDocumentsMetaData = createdDocuments.map((document) => ({
          id: document.id,
          isUploaded: true,
          action: 'document uploaded',
          section: sectionName,
        }));
        
        await createDealLogs(user.id, dealId, {
          documents: { documents: createdDocumentsMetaData, action: 'document uploaded' },
        }, LogType.UPDATED);
        
        return createdDocuments;
      }
      
      return [];
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDocumentUpload.createSectionDocuments");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create documents for collateral items
  const createCollateralItemDocuments = async (
    dealId: string,
    collateralItem: CollateralItem,
    documents: UploadDocumentForm[]
  ) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return [];
    }

    try {
      setLoading(true);
      
      // Upload the documents to storage
      const uploadResults = await handleUploadDocuments(dealId, '', documents);
      
      // Convert the documents to the correct format
      const dealDocuments: Partial<DealDocument>[] = uploadResults.map((result) => ({
        dealId,
        uploadedBy: user.id,
        signatureStatus: SignatureStatus.UNSIGNED,
        filePath: result.path,
        fileName: result.fileName,
        mimeType: result.mimeType,
      }));

      // Create collateral item documents
      if (dealDocuments.length > 0) {
        const createdDocuments = await CollateralDocumentService.createCollateralItemDocuments(
          dealId,
          collateralItem,
          dealDocuments
        );
        
        return createdDocuments;
      }
      
      return [];
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDocumentUpload.createCollateralItemDocuments");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create financial documents
  const createFinancialDocuments = async (
    dealId: string,
    formCategory: 'HISTORICAL' | 'PROJECTED',
    documents: UploadDocumentForm[]
  ) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return [];
    }

    try {
      setLoading(true);
      
      // Upload the documents to storage
      const uploadResults = await handleUploadDocuments(dealId, '', documents);
      
      // Convert the documents to the correct format
      const dealDocuments: Partial<DealDocument>[] = uploadResults.map((result) => ({
        dealId,
        uploadedBy: user.id,
        signatureStatus: SignatureStatus.UNSIGNED,
        filePath: result.path,
        fileName: result.fileName,
        mimeType: result.mimeType,
      }));

      // Create financial documents
      if (dealDocuments.length > 0) {
        const createdDocuments = await FinancialDocumentService.createFinancialDocuments(
          dealId,
          formCategory,
          dealDocuments
        );
        
        return createdDocuments;
      }
      
      return [];
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDocumentUpload.createFinancialDocuments");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get documents for a specific section
  const getSectionDocuments = async (
    dealId: string,
    sectionName: DealSectionName,
    formCategory?: string,
    itemId?: string
  ) => {
    try {
      setLoading(true);
      const documents = await DealDocumentService.getSectionDocuments(
        dealId,
        sectionName,
        formCategory,
        itemId
      );
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDocumentUpload.getSectionDocuments");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get all documents organized by section
  const getAllDealDocumentsBySection = async (dealId: string) => {
    try {
      setLoading(true);
      const documents = await DealDocumentService.getAllDealDocumentsBySection(dealId);
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDocumentUpload.getAllDealDocumentsBySection");
      return {};
    } finally {
      setLoading(false);
    }
  };

  // Delete section documents
  const deleteSectionDocuments = async (
    dealId: string,
    sectionName: DealSectionName,
    formCategory?: string,
    itemId?: string
  ) => {
    if (!user?.id) {
      setApiError("User not authenticated");
      return false;
    }

    try {
      setLoading(true);
      
      await DealDocumentService.deleteSectionDocuments(
        dealId,
        sectionName,
        formCategory,
        itemId
      );
      
      return true;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useDocumentUpload.deleteSectionDocuments");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear API error
  const clearError = () => {
    setApiError(null);
  };

  return {
    loading,
    apiError,
    // Legacy methods
    handleUploadDocuments,
    createDealDocuments,
    updateDealDocuments,
    handleDeleteDocument,
    getDealDocuments,
    // New section-based methods
    createSectionDocuments,
    createCollateralItemDocuments,
    createFinancialDocuments,
    getSectionDocuments,
    getAllDealDocumentsBySection,
    deleteSectionDocuments,
    clearError,
  };
};
