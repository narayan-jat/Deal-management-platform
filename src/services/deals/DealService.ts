import supabase from "@/lib/supabase";
import { DealModel, DealMemberModel } from "@/types/deal";
import { DealSectionName, CompleteDealForm } from "@/types/deal/Deal.sections";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import { DealDocumentService } from "./DealDocumentService";
import { DealMemberService } from "./DealMemberService";
import { DealSectionsService } from "./DealSectionsService";
export class DealService {
  /**
   * Creates a new deal in the "deals" table.
   * @param dealBasicData - The basic data of the deal.
   * @param dealDocuments - The documents of the deal.
   * @param dealMembers - The members of the deal.
   */
  static async createDeal(dealBasicData: Partial<DealModel>) {
    try {
      // Make the dealbasicdata to use snake_case keys.
      const dealBasicDataSnakeCase = snakecaseKeys(dealBasicData, { deep: true });

      // First create the deal
      // Since the organization is the cosmetic only not checking if the 
      // user is part of the organization in which the deal is created.
      const { data: dealData, error: dealError } = await supabase
        .from("deals")
        .insert(dealBasicDataSnakeCase)
        .select()
        .single();

      if (dealError) {
        throw dealError;
      }
      return dealData;
    } catch (error) {
      ErrorService.handleApiError(error, "DealsService.createDeal");
      throw error;
    }
  }

  /**
   * Gets a deal from the "deals" table.
   * @param dealIds - The IDs of the deals to get.
   * @returns The deals.
   */
  static async getDeals(dealIds: string[]) {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .in("id", dealIds);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.getDeal");
      throw error;
    }
  }

  /**
   * Gets all deals for a user (created by the user).
   * @param userId - The ID of the user.
   * @returns The deals.
   */
  static async getAllDealsForUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.getAllDealsForUser");
      throw error;
    }
  }

  /**
   * Updates a deal in the "deals" table.
   * @param deal - The deal to update.
   * @returns The updated deal.
   */
  static async updateDeal(deal: Partial<DealModel>) {
    try {
      // convert the deal to snake_case keys. 
      const dealSnakeCase = snakecaseKeys(deal, { deep: true });
      const { data, error } = await supabase
        .from("deals")
        .update(dealSnakeCase)
        .eq("id", deal.id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      // Later I need to consider adding this deal update to deal log table.
      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.updateDeal");
      throw error;
    }

  }

  /**
   * Deletes a deal from the "deals" table.
   * @param dealId - The ID of the deal to delete.
   * @returns The deleted deal.
   */
  static async deleteDeal(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deals")
        .delete()
        .eq("id", dealId);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.deleteDeal");
      throw error;
    }
  }

  // =====================================================
  // COMPREHENSIVE DEAL MANAGEMENT WITH SECTIONS
  // =====================================================

  /**
   * Creates a complete deal with all sections and documents
   * @param dealFormData - Complete deal form data including all sections
   * @param dealMembers - Array of deal members
   * @returns The created deal with all sections
   */
  static async createCompleteDeal(
    dealFormData: CompleteDealForm,
    dealMembers: Partial<DealMemberModel>[] = []
  ) {
    try {
      // Extract basic deal data
      const basicDealData: Partial<DealModel> = {
        title: dealFormData.title,
        industry: dealFormData.industry,
        organizationId: dealFormData.organizationId,
        status: dealFormData.status as any, // Type assertion for enum
        location: dealFormData.location,
        notes: dealFormData.notes,
        createdBy: dealFormData.createdBy
      };

      // Create the basic deal
      const dealData = await this.createDeal(basicDealData);
      const dealId = dealData.id;

      // Create deal sections
      await DealSectionsService.createOrUpdateDealSections(dealId, dealFormData.sectionsEnabled);

      // Create section data
      const sectionsData: any = {};
      if (dealFormData.overview) sectionsData.overview = dealFormData.overview;
      if (dealFormData.purpose) sectionsData.purpose = dealFormData.purpose;
      if (dealFormData.collateral) sectionsData.collateral = dealFormData.collateral;
      if (dealFormData.financials) sectionsData.financials = dealFormData.financials;
      if (dealFormData.nextSteps) sectionsData.nextSteps = dealFormData.nextSteps;

      await DealSectionsService.createOrUpdateAllDealSections(dealId, dealFormData.sectionsEnabled, sectionsData);

      // Create documents for each section
      for (const [sectionName, documents] of Object.entries(dealFormData.documents)) {
        if (documents && documents.length > 0) {
          await DealDocumentService.createSectionDocuments(
            dealId,
            sectionName as DealSectionName,
            documents
          );
        }
      }

      return {
        deal: dealData,
        sections: await DealSectionsService.getAllDealSections(dealId),
        documents: await DealDocumentService.getAllDealDocumentsBySection(dealId)
      };
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.createCompleteDeal");
      throw error;
    }
  }

  /**
   * Updates a complete deal with all sections and documents
   * @param dealId - The ID of the deal to update
   * @param dealFormData - Complete deal form data including all sections
   * @param dealMembers - Array of deal members (optional)
   * @returns The updated deal with all sections
   */
  static async updateCompleteDeal(
    dealId: string,
    dealFormData: CompleteDealForm,
    dealMembers?: Partial<DealMemberModel>[]
  ) {
    try {
      // Extract basic deal data
      const basicDealData: Partial<DealModel> = {
        id: dealId,
        title: dealFormData.title,
        industry: dealFormData.industry,
        organizationId: dealFormData.organizationId,
        status: dealFormData.status as any, // Type assertion for enum
        location: dealFormData.location,
        notes: dealFormData.notes
      };

      // Update the basic deal
      await this.updateDeal(basicDealData);

      // Update deal sections
      await DealSectionsService.createOrUpdateDealSections(dealId, dealFormData.sectionsEnabled);

      // Update section data
      const sectionsData: any = {};
      if (dealFormData.overview) sectionsData.overview = dealFormData.overview;
      if (dealFormData.purpose) sectionsData.purpose = dealFormData.purpose;
      if (dealFormData.collateral) sectionsData.collateral = dealFormData.collateral;
      if (dealFormData.financials) sectionsData.financials = dealFormData.financials;
      if (dealFormData.nextSteps) sectionsData.nextSteps = dealFormData.nextSteps;

      await DealSectionsService.createOrUpdateAllDealSections(dealId, dealFormData.sectionsEnabled, sectionsData);

      // Update documents for each section
      for (const [sectionName, documents] of Object.entries(dealFormData.documents)) {
        // Delete existing documents for this section
        await DealDocumentService.deleteSectionDocuments(dealId, sectionName as DealSectionName);
        
        // Create new documents if any
        if (documents && documents.length > 0) {
          await DealDocumentService.createSectionDocuments(
            dealId,
            sectionName as DealSectionName,
            documents
          );
        }
      }

      return {
        deal: basicDealData,
        sections: await DealSectionsService.getAllDealSections(dealId),
        documents: await DealDocumentService.getAllDealDocumentsBySection(dealId)
      };
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.updateCompleteDeal");
      throw error;
    }
  }

  /**
   * Gets a complete deal with all sections and documents
   * @param dealId - The ID of the deal to get
   * @returns Complete deal data with sections and documents
   */
  static async getCompleteDeal(dealId: string) {
    try {
      // Get basic deal data
      const { data: dealData, error: dealError } = await supabase
        .from("deals")
        .select("*")
        .eq("id", dealId)
        .single();

      if (dealError) {
        throw dealError;
      }

      const deal = camelcaseKeys(dealData, { deep: true }) as DealModel;

      // Get all sections
      const sections = await DealSectionsService.getAllDealSections(dealId);

      // Get all documents organized by section
      const documents = await DealDocumentService.getAllDealDocumentsBySection(dealId);

      // Get deal members
      const members = await DealMemberService.getDealMembers(dealId);

      return {
        deal,
        sections,
        documents,
        members
      };
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.getCompleteDeal");
      throw error;
    }
  }

  /**
   * Deletes a complete deal with all its sections and documents
   * @param dealId - The ID of the deal to delete
   * @returns Success status
   */
  static async deleteCompleteDeal(dealId: string) {
    try {
      // Delete all documents first
      await DealDocumentService.deleteDealDocument([]); // This will be handled by CASCADE

      // Delete all sections
      await DealSectionsService.deleteAllDealSections(dealId);

      // Delete all members
      // Do not delete the members as it is not a part of the deal.
      // await DealMemberService.deleteDealMembers(dealId);

      // Finally delete the deal
      await this.deleteDeal(dealId);

      return { success: true };
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.deleteCompleteDeal");
      throw error;
    }
  }
}

