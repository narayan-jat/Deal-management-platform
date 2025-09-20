import { useState, useCallback } from 'react';
import { FinancialDocumentService } from '@/services/deals/FinancialDocumentService';
import { DealDocumentModel } from '@/types/deal/Deal.model';
import { ErrorService } from '@/services/ErrorService';

interface UseFinancialDocumentsProps {
  dealId: string;
}

export const useFinancialDocuments = ({ dealId }: UseFinancialDocumentsProps) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Create financial documents
  const createFinancialDocuments = useCallback(async (
    formCategory: 'HISTORICAL' | 'PROJECTED',
    documents: Partial<DealDocumentModel>[]
  ) => {
    try {
      setLoading(true);
      const result = await FinancialDocumentService.createFinancialDocuments(
        dealId,
        formCategory,
        documents
      );
      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useFinancialDocuments.createFinancialDocuments");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get financial documents
  const getFinancialDocuments = useCallback(async (formCategory?: 'HISTORICAL' | 'PROJECTED') => {
    try {
      setLoading(true);
      const documents = await FinancialDocumentService.getFinancialDocuments(
        dealId,
        formCategory
      );
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useFinancialDocuments.getFinancialDocuments");
      return [];
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get all financial documents organized by category
  const getAllFinancialDocumentsByCategory = useCallback(async () => {
    try {
      setLoading(true);
      const documents = await FinancialDocumentService.getAllFinancialDocumentsByCategory(dealId);
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useFinancialDocuments.getAllFinancialDocumentsByCategory");
      return {};
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Update financial documents
  const updateFinancialDocuments = useCallback(async (
    formCategory: 'HISTORICAL' | 'PROJECTED',
    documents: Partial<DealDocumentModel>[]
  ) => {
    try {
      setLoading(true);
      const result = await FinancialDocumentService.updateFinancialDocuments(
        dealId,
        formCategory,
        documents
      );
      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useFinancialDocuments.updateFinancialDocuments");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Delete financial documents
  const deleteFinancialDocuments = useCallback(async (formCategory?: 'HISTORICAL' | 'PROJECTED') => {
    try {
      setLoading(true);
      const result = await FinancialDocumentService.deleteFinancialDocuments(
        dealId,
        formCategory
      );
      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useFinancialDocuments.deleteFinancialDocuments");
      return false;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Clear API error
  const clearError = useCallback(() => {
    setApiError(null);
  }, []);

  return {
    loading,
    apiError,
    createFinancialDocuments,
    getFinancialDocuments,
    getAllFinancialDocumentsByCategory,
    updateFinancialDocuments,
    deleteFinancialDocuments,
    clearError,
  };
};
