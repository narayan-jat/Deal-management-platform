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
  static async createDealMembers(dealMembers: Partial<DealMemberModel>[]) {
    try {
      // Make the data to use snake_case keys.
      const dealMembersSnakeCase = dealMembers.map(member => snakecaseKeys(member, { deep: true }));
      const dealId = dealMembersSnakeCase[0].deal_id;
      // Check if the people are already in the deal members table.
      const existingDealMembers = await this.getDealMembers(dealId);

      // Filter out the members which are not member of the deal.
      const newDealMembers = dealMembersSnakeCase.filter(member => !existingDealMembers.some(existingMember => existingMember.member_id === member.member_id));

      // Add the new deal members to the deal members table.
      const { data, error } = await supabase
        .from("deal_members")
        .insert(newDealMembers)
        .select();

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

  /**
   * Gets all deal IDs of which a member is a part of.
   * @param memberId - The ID of the member to get the deal IDs for.
   * @returns The deal IDs.
   */
  static async getDealIdsOfMember(memberId: string): Promise<string[] | null> {
    try {
      const { data, error } = await supabase
        .from("deal_members")
        .select("deal_id")
        .eq("member_id", memberId);

      if (error) {
        throw error;
      }

      return data.map((deal) => deal.deal_id);
    } catch (error) {
      ErrorService.handleApiError(error, "DealMembersService.getDealIdsOfMember");
      throw error;
    }
  }

  /**
   * Removes a deal member from the "deal_members" table.
   * @param dealId - The ID of the deal.
   * @param memberId - The ID of the member to remove.
   * @returns The removed deal member.
   */
  static async removeDealMember(dealId: string, memberId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_members")
        .delete()
        .eq("deal_id", dealId)
        .eq("member_id", memberId)
        .select();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealMembersService.removeDealMember");
      throw error;
    }
  }
}