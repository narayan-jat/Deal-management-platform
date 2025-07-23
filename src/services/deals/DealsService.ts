import supabase from "@/lib/supabase";
import { DealModel, DealMemberModel, DealDocumentModel } from "@/types/deal";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from 'snakecase-keys';
import { DealDocumentsService } from "./DealDocumentsService";
import { DealMembersService } from "./DealMembersService";

export class DealsService {
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
      await DealDocumentsService.createDealDocuments(dealDocuments);

      // Now add the members to the deal members table.
      await DealMembersService.createDealMembers(dealMembers);
    } catch (error) {
      ErrorService.handleApiError(error, "DealsService.createDeal");
      throw error;
    }
  }
}

