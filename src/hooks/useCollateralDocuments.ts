import { useState, useCallback } from 'react';
import { CollateralDocumentService } from '@/services/deals/CollateralDocumentService';
import { DealDocumentModel } from '@/types/deal/Deal.model';
import { CollateralItem } from '@/types/deal/Deal.sections';
import { ErrorService } from '@/services/ErrorService';

interface UseCollateralDocumentsProps {
  dealId: string;
}

export const useCollateralDocuments = ({ dealId }: UseCollateralDocumentsProps) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Create documents for a collateral item
  const createCollateralItemDocuments = useCallback(async (
    collateralItem: CollateralItem,
    documents: Partial<DealDocumentModel>[]
  ) => {
    try {
      setLoading(true);
      const result = await CollateralDocumentService.createCollateralItemDocuments(
        dealId,
        collateralItem,
        documents
      );
      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useCollateralDocuments.createCollateralItemDocuments");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get documents for a collateral item
  const getCollateralItemDocuments = useCallback(async (collateralItemId: string) => {
    try {
      setLoading(true);
      const documents = await CollateralDocumentService.getCollateralItemDocuments(
        dealId,
        collateralItemId
      );
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useCollateralDocuments.getCollateralItemDocuments");
      return [];
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Get all collateral documents organized by item
  const getAllCollateralDocumentsByItem = useCallback(async () => {
    try {
      setLoading(true);
      const documents = await CollateralDocumentService.getAllCollateralDocumentsByItem(dealId);
      return documents;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useCollateralDocuments.getAllCollateralDocumentsByItem");
      return {};
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Update documents for a collateral item
  const updateCollateralItemDocuments = useCallback(async (
    collateralItem: CollateralItem,
    documents: Partial<DealDocumentModel>[]
  ) => {
    try {
      setLoading(true);
      const result = await CollateralDocumentService.updateCollateralItemDocuments(
        dealId,
        collateralItem,
        documents
      );
      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useCollateralDocuments.updateCollateralItemDocuments");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  // Delete documents for a collateral item
  const deleteCollateralItemDocuments = useCallback(async (collateralItemId: string) => {
    try {
      setLoading(true);
      const result = await CollateralDocumentService.deleteCollateralItemDocuments(
        dealId,
        collateralItemId
      );
      return result;
    } catch (error) {
      setApiError(error.message);
      ErrorService.handleApiError(error, "useCollateralDocuments.deleteCollateralItemDocuments");
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
    createCollateralItemDocuments,
    getCollateralItemDocuments,
    getAllCollateralDocumentsByItem,
    updateCollateralItemDocuments,
    deleteCollateralItemDocuments,
    clearError,
  };
};
