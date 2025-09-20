import supabase from "@/lib/supabase";
import { DealDocumentModel } from "@/types/deal";
import { DealSectionName, CollateralItem } from "@/types/deal/Deal.sections";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export class CollateralDocumentService {
  /**
   * Creates documents for a specific collateral item
   * @param dealId - The ID of the deal
   * @param collateralItem - The collateral item
   * @param documents - Array of documents to create
   * @returns The created documents
   */
  static async createCollateralItemDocuments(
    dealId: string,
    collateralItem: CollateralItem,
    documents: Partial<DealDocumentModel>[]
  ) {
    try {
      const formCategory = this.getFormCategoryFromCollateralType(collateralItem.type);
      
      const documentsWithSection = documents.map(doc => ({
        ...doc,
        dealId,
        sectionName: DealSectionName.COLLATERAL,
        formCategory,
        itemId: collateralItem.id
      }));

      const documentsSnakeCase = documentsWithSection.map(document => 
        snakecaseKeys(document, { deep: true })
      );

      const { data, error } = await supabase
        .from("deal_documents")
        .insert(documentsSnakeCase)
        .select();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealDocumentModel[];
    } catch (error) {
      ErrorService.handleApiError(error, "CollateralDocumentService.createCollateralItemDocuments");
      throw error;
    }
  }

  /**
   * Gets documents for a specific collateral item
   * @param dealId - The ID of the deal
   * @param collateralItemId - The ID of the collateral item
   * @returns The documents for the collateral item
   */
  static async getCollateralItemDocuments(dealId: string, collateralItemId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_documents")
        .select("*")
        .eq("deal_id", dealId)
        .eq("section_name", DealSectionName.COLLATERAL)
        .eq("item_id", collateralItemId);

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealDocumentModel[];
    } catch (error) {
      ErrorService.handleApiError(error, "CollateralDocumentService.getCollateralItemDocuments");
      throw error;
    }
  }

  /**
   * Deletes documents for a specific collateral item
   * @param dealId - The ID of the deal
   * @param collateralItemId - The ID of the collateral item
   * @returns The deleted documents
   */
  static async deleteCollateralItemDocuments(dealId: string, collateralItemId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_documents")
        .delete()
        .eq("deal_id", dealId)
        .eq("section_name", DealSectionName.COLLATERAL)
        .eq("item_id", collateralItemId);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "CollateralDocumentService.deleteCollateralItemDocuments");
      throw error;
    }
  }

  /**
   * Gets all collateral documents organized by item
   * @param dealId - The ID of the deal
   * @returns Documents organized by collateral item
   */
  static async getAllCollateralDocumentsByItem(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_documents")
        .select("*")
        .eq("deal_id", dealId)
        .eq("section_name", DealSectionName.COLLATERAL)
        .order("item_id")
        .order("uploaded_at", { ascending: false });

      if (error) {
        throw error;
      }

      const documents = camelcaseKeys(data, { deep: true }) as DealDocumentModel[];
      
      // Organize documents by item ID
      const organizedDocuments: { [itemId: string]: DealDocumentModel[] } = {};
      
      documents.forEach(doc => {
        if (doc.itemId) {
          if (!organizedDocuments[doc.itemId]) {
            organizedDocuments[doc.itemId] = [];
          }
          organizedDocuments[doc.itemId].push(doc);
        }
      });

      return organizedDocuments;
    } catch (error) {
      ErrorService.handleApiError(error, "CollateralDocumentService.getAllCollateralDocumentsByItem");
      throw error;
    }
  }

  /**
   * Updates documents for a collateral item (replaces existing documents)
   * @param dealId - The ID of the deal
   * @param collateralItem - The collateral item
   * @param documents - Array of documents to set
   * @returns The updated documents
   */
  static async updateCollateralItemDocuments(
    dealId: string,
    collateralItem: CollateralItem,
    documents: Partial<DealDocumentModel>[]
  ) {
    try {
      // First delete existing documents for this item
      await this.deleteCollateralItemDocuments(dealId, collateralItem.id);

      // Then create new documents
      if (documents.length > 0) {
        return await this.createCollateralItemDocuments(dealId, collateralItem, documents);
      }

      return [];
    } catch (error) {
      ErrorService.handleApiError(error, "CollateralDocumentService.updateCollateralItemDocuments");
      throw error;
    }
  }

  /**
   * Helper method to get form category from collateral type
   * @param collateralType - The collateral type
   * @returns The form category string
   */
  private static getFormCategoryFromCollateralType(collateralType: string): string {
    switch (collateralType) {
      case 'PROPERTY':
        return 'PROPERTY';
      case 'FINANCIAL_ASSETS':
        return 'FINANCIAL_ASSETS';
      case 'CORPORATE_ASSETS':
        return 'CORPORATE_ASSETS';
      default:
        return 'UNKNOWN';
    }
  }
}
