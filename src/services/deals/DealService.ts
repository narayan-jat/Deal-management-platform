import supabase from "@/lib/supabase";
import { DealModel, DealMemberModel, DealDocumentModel, UploadDocumentForm } from "@/types/deal";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from 'snakecase-keys';
import { DealDocumentService } from "./DealDocumentService";
import { DealMemberService } from "./DealMemberService";
export class DealService {
  /**
   * Creates a new deal in the "deals" table.
   * @param dealBasicData - The basic data of the deal.
   * @param dealDocuments - The documents of the deal.
   * @param dealMembers - The members of the deal.
   */
  static async createDeal(dealBasicData: Partial<DealModel>, dealDocuments: Partial<DealDocumentModel>[], dealMembers: Partial<DealMemberModel>[]) {
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

      // Now add the documents to the deal documents table.
      await DealDocumentService.createDealDocuments(dealDocuments);

      // Now add the members to the deal members table.
      await DealMemberService.createDealMembers(dealMembers);
    } catch (error) {
      ErrorService.handleApiError(error, "DealsService.createDeal");
      throw error;
    }
  }

  /**
   * Gets a deal from the "deals" table.
   * @param dealId - The ID of the deal to get.
   * @returns The deal.
   */
  static async getDeal(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("id", dealId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealService.getDeal");
      throw error;
    }
  }
}

