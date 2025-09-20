import supabase from "@/lib/supabase";
import { DealDocumentModel } from "@/types/deal";
import { DealSectionName } from "@/types/deal/Deal.sections";
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import { ErrorService } from "../ErrorService";

export class DealDocumentService {
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
        .select();

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

  /**
   * Updates deal documents in the "deal_documents" table.
   * @param dealDocuments - The deal documents to update.
   * @returns The updated deal documents.
   */
  static async updateDealDocuments(dealDocuments: Partial<DealDocumentModel>[]) {
    try {
      // This update is not useful unless we give feature to update a 
      // uploaded document currently. this feature is not there.
      // User can delete a document and the upload new one.
      const dealDocumentsSnakeCase = dealDocuments.map(document => snakecaseKeys(document, { deep: true }));
      const { data, error } = await supabase
        .from("deal_documents")
        .update(dealDocumentsSnakeCase)
        .eq("id", dealDocuments[0].id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealDocumentsService.updateDealDocuments");
      throw error;
    }
  }

  /**
   * Deletes deal documents from the "deal_documents" table.
   * @param dealDocumentIds - The IDs of the deal documents to delete.
   * @returns The deleted deal documents.
   */
  static async deleteDealDocument(dealDocumentIds: string[]) {
    try {
      const { data, error } = await supabase
        .from("deal_documents")
        .delete()
        .in("id", dealDocumentIds);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealDocumentsService.deleteDealDocument");
      throw error;
    }
  }

  // =====================================================
  // SECTION-BASED DOCUMENT MANAGEMENT
  // =====================================================

  /**
   * Creates documents for a specific section
   * @param dealId - The ID of the deal
   * @param sectionName - The section name (OVERVIEW, PURPOSE, COLLATERAL, etc.)
   * @param formCategory - Optional category within the section (PROPERTY, FINANCIAL_ASSETS, etc.)
   * @param itemId - Optional item ID for specific items within sections
   * @param documents - Array of documents to create
   * @returns The created documents
   */
  static async createSectionDocuments(
    dealId: string,
    sectionName: DealSectionName,
    documents: Partial<DealDocumentModel>[],
    formCategory?: string,
    itemId?: string
  ) {
    try {
      const documentsWithSection = documents.map(doc => ({
        ...doc,
        dealId,
        sectionName,
        formCategory,
        itemId
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
      ErrorService.handleApiError(error, "DealDocumentService.createSectionDocuments");
      throw error;
    }
  }

  /**
   * Gets documents for a specific section
   * @param dealId - The ID of the deal
   * @param sectionName - The section name
   * @param formCategory - Optional category filter
   * @param itemId - Optional item ID filter
   * @returns The documents for the section
   */
  static async getSectionDocuments(
    dealId: string,
    sectionName: DealSectionName,
    formCategory?: string,
    itemId?: string
  ) {
    try {
      let query = supabase
        .from("deal_documents")
        .select("*")
        .eq("deal_id", dealId)
        .eq("section_name", sectionName);

      if (formCategory) {
        query = query.eq("form_category", formCategory);
      }

      if (itemId) {
        query = query.eq("item_id", itemId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealDocumentModel[];
    } catch (error) {
      ErrorService.handleApiError(error, "DealDocumentService.getSectionDocuments");
      throw error;
    }
  }

  /**
   * Gets all documents for a deal organized by section
   * @param dealId - The ID of the deal
   * @returns Documents organized by section
   */
  static async getAllDealDocumentsBySection(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_documents")
        .select("*")
        .eq("deal_id", dealId)
        .order("section_name")
        .order("form_category")
        .order("uploaded_at", { ascending: false });

      if (error) {
        throw error;
      }

      const documents = camelcaseKeys(data, { deep: true }) as DealDocumentModel[];
      
      // Organize documents by section
      const organizedDocuments: { [key in DealSectionName]?: DealDocumentModel[] } = {};
      
      documents.forEach(doc => {
        if (doc.sectionName) {
          if (!organizedDocuments[doc.sectionName as DealSectionName]) {
            organizedDocuments[doc.sectionName as DealSectionName] = [];
          }
          organizedDocuments[doc.sectionName as DealSectionName]!.push(doc);
        }
      });

      return organizedDocuments;
    } catch (error) {
      ErrorService.handleApiError(error, "DealDocumentService.getAllDealDocumentsBySection");
      throw error;
    }
  }

  /**
   * Deletes documents for a specific section
   * @param dealId - The ID of the deal
   * @param sectionName - The section name
   * @param formCategory - Optional category filter
   * @param itemId - Optional item ID filter
   * @returns The deleted documents
   */
  static async deleteSectionDocuments(
    dealId: string,
    sectionName: DealSectionName,
    formCategory?: string,
    itemId?: string
  ) {
    try {
      let query = supabase
        .from("deal_documents")
        .delete()
        .eq("deal_id", dealId)
        .eq("section_name", sectionName);

      if (formCategory) {
        query = query.eq("form_category", formCategory);
      }

      if (itemId) {
        query = query.eq("item_id", itemId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealDocumentService.deleteSectionDocuments");
      throw error;
    }
  }

  /**
   * Updates document section information
   * @param documentId - The ID of the document to update
   * @param sectionName - New section name
   * @param formCategory - New form category
   * @param itemId - New item ID
   * @returns The updated document
   */
  static async updateDocumentSection(
    documentId: string,
    sectionName: DealSectionName,
    formCategory?: string,
    itemId?: string
  ) {
    try {
      const updateData = {
        section_name: sectionName,
        form_category: formCategory,
        item_id: itemId
      };

      const { data, error } = await supabase
        .from("deal_documents")
        .update(updateData)
        .eq("id", documentId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return camelcaseKeys(data, { deep: true }) as DealDocumentModel;
    } catch (error) {
      ErrorService.handleApiError(error, "DealDocumentService.updateDocumentSection");
      throw error;
    }
  }
}