import supabase from "@/lib/supabase";
import { DealDocumentModel } from "@/types/deal";
import { DealSectionName } from "@/types/deal/Deal.sections";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export class FinancialDocumentService {
  /**
   * Creates documents for financial section
   * @param dealId - The ID of the deal
   * @param formCategory - The form category (HISTORICAL, PROJECTED)
   * @param documents - Array of documents to create
   * @returns The created documents
   */
  static async createFinancialDocuments(
    dealId: string,
    formCategory: 'HISTORICAL' | 'PROJECTED',
    documents: Partial<DealDocumentModel>[]
  ) {
    try {
      const documentsWithSection = documents.map(doc => ({
        ...doc,
        dealId,
        sectionName: DealSectionName.FINANCIALS,
        formCategory
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
      ErrorService.handleApiError(error, "FinancialDocumentService.createFinancialDocuments");
      throw error;
    }
  }

  /**
   * Gets documents for financial section
   * @param dealId - The ID of the deal
   * @param formCategory - Optional form category filter
   * @returns The documents for the financial section
   */
  static async getFinancialDocuments(
    dealId: string,
    formCategory?: 'HISTORICAL' | 'PROJECTED'
  ) {
    try {
      let query = supabase
        .from("deal_documents")
        .select("*")
        .eq("deal_id", dealId)
        .eq("section_name", DealSectionName.FINANCIALS);

      if (formCategory) {
        query = query.eq("form_category", formCategory);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealDocumentModel[];
    } catch (error) {
      ErrorService.handleApiError(error, "FinancialDocumentService.getFinancialDocuments");
      throw error;
    }
  }

  /**
   * Gets all financial documents organized by category
   * @param dealId - The ID of the deal
   * @returns Documents organized by category
   */
  static async getAllFinancialDocumentsByCategory(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_documents")
        .select("*")
        .eq("deal_id", dealId)
        .eq("section_name", DealSectionName.FINANCIALS)
        .order("form_category")
        .order("uploaded_at", { ascending: false });

      if (error) {
        throw error;
      }

      const documents = camelcaseKeys(data, { deep: true }) as DealDocumentModel[];
      
      // Organize documents by category
      const organizedDocuments: {
        HISTORICAL?: DealDocumentModel[];
        PROJECTED?: DealDocumentModel[];
      } = {};
      
      documents.forEach(doc => {
        if (doc.formCategory === 'HISTORICAL' || doc.formCategory === 'PROJECTED') {
          if (!organizedDocuments[doc.formCategory]) {
            organizedDocuments[doc.formCategory] = [];
          }
          organizedDocuments[doc.formCategory]!.push(doc);
        }
      });

      return organizedDocuments;
    } catch (error) {
      ErrorService.handleApiError(error, "FinancialDocumentService.getAllFinancialDocumentsByCategory");
      throw error;
    }
  }

  /**
   * Deletes documents for financial section
   * @param dealId - The ID of the deal
   * @param formCategory - Optional form category filter
   * @returns The deleted documents
   */
  static async deleteFinancialDocuments(
    dealId: string,
    formCategory?: 'HISTORICAL' | 'PROJECTED'
  ) {
    try {
      let query = supabase
        .from("deal_documents")
        .delete()
        .eq("deal_id", dealId)
        .eq("section_name", DealSectionName.FINANCIALS);

      if (formCategory) {
        query = query.eq("form_category", formCategory);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "FinancialDocumentService.deleteFinancialDocuments");
      throw error;
    }
  }

  /**
   * Updates documents for financial section (replaces existing documents)
   * @param dealId - The ID of the deal
   * @param formCategory - The form category
   * @param documents - Array of documents to set
   * @returns The updated documents
   */
  static async updateFinancialDocuments(
    dealId: string,
    formCategory: 'HISTORICAL' | 'PROJECTED',
    documents: Partial<DealDocumentModel>[]
  ) {
    try {
      // First delete existing documents for this category
      await this.deleteFinancialDocuments(dealId, formCategory);

      // Then create new documents
      if (documents.length > 0) {
        return await this.createFinancialDocuments(dealId, formCategory, documents);
      }

      return [];
    } catch (error) {
      ErrorService.handleApiError(error, "FinancialDocumentService.updateFinancialDocuments");
      throw error;
    }
  }
}
