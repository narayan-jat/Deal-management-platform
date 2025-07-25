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
}

