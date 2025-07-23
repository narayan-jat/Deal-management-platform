import supabase from "@/lib/supabase";
import { DealDocumentModel } from "@/types/deal";
import snakecaseKeys from 'snakecase-keys';
import { ErrorService } from "../ErrorService";

export class DealDocumentsService {
  /**
   * Creates a new deal document in the "deal_documents" table.
   * @param dealDocument - The deal document to create.
   * @returns The created deal document.
   */
  static async createDealDocuments(dealDocuments: Partial<DealDocumentModel>[]) {
    try {
      // Make the data to use snake_case keys.
      const dealDocumentsSnakeCase = dealDocuments.map(document => snakecaseKeys(document, { deep: true }));
      const { data, error } = await supabase
        .from("deal_documents")
        .insert(dealDocumentsSnakeCase)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealDocumentsService.createDealDocument");
      throw error;
    }
  }

  /**
   * Gets all deal documents from the "deal_documents" table.
   * @param dealId - The ID of the deal to get the documents for.
   * @returns The deal documents.
   */
  static async getDealDocuments(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_documents")
        .select("*")
        .eq("deal_id", dealId);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealDocumentsService.getDealDocuments");
      throw error;
    }
  }
}