import supabase from "@/lib/supabase";
import { DealMemberModel } from "@/types/deal";
import snakecaseKeys from 'snakecase-keys';
import { ErrorService } from "../ErrorService";

export class DealMemberService {
  /**
   * Creates a new deal member in the "deal_members" table.
   * @param dealMember - The deal member to create.
   * @returns The created deal member.
   */
  static async createDealMembers(dealMember: Partial<DealMemberModel>[]) {
    try {
      // Make the data to use snake_case keys.
      const dealMembersSnakeCase = dealMember.map(member => snakecaseKeys(member, { deep: true }));
      const dealId = dealMembersSnakeCase[0].deal_id;
      // Check if the people are already in the deal members table.
      const existingDealMembers = await this.getDealMembers(dealId);

      // Filter out the members which are not member of the deal.
      const newDealMembers = dealMembersSnakeCase.filter(member => !existingDealMembers.some(existingMember => existingMember.member_id === member.member_id));

      // Add the new deal members to the deal members table.
      const { data, error } = await supabase
        .from("deal_members")
        .insert(newDealMembers)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealMembersService.createDealMember");
      throw error;
    }
  }

  /**
   * Gets all deal members from the "deal_members" table.
   * @param dealId - The ID of the deal to get the members for.
   * @returns The deal members.
   */
  static async getDealMembers(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_members")
        .select("*")
        .eq("deal_id", dealId);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealMembersService.getDealMembers");
      throw error;
    }
  }
}