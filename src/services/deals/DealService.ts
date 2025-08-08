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
}

