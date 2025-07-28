import supabase from "@/lib/supabase";
import { OrganizationMember } from "@/types/organization/Organization.model";
import { ErrorService } from "@/services/ErrorService";
import snakecaseKeys from "snakecase-keys";

export class OrganizationMemberService {

  /**
   * Creates a new organization member
   * @param organizationMember - The organization member to create
   * @returns The created organization member
   */
  static async createOrgMember(organizationMember: Partial<OrganizationMember>) {
    // Convert to the snake case
    const snakecaseOrganizationMember = snakecaseKeys(organizationMember, { deep: true });
    try {
      const { data, error } = await supabase.from("organization_members").insert(snakecaseOrganizationMember);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "OrganizationMemberService.createOrgMember");
      throw error;
    }
  }

  /**
   * Gets all members by organization ID
   * @param organizationId - The ID of the organization
   * @returns The members of the organization
   */
  static async getMembersByOrgId(organizationId: string) {
    try {
      const { data, error } = await supabase.from("organization_members").select("*").eq("organization_id", organizationId);
      return { data, error };
    } catch (error) {
      ErrorService.logError(error, "OrganizationMemberService.getMembersByOrgId");
      throw error;
    }
  }

  /**
   * Gets all organizations by member ID
   * @param memberId - The ID of the member
   * @returns The organizations of the member
   */
  static async getOrgMembersByMemberId(memberId: string) {
    try {
      const { data, error } = await supabase.from("organization_members").select("*").eq("member_id", memberId);
      
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "OrganizationMemberService.getOrgMembersByMemberId");
      throw error;
    }
  }

  /**
   * Gets all members by organization ID
   * @param organizationId - The ID of the organization
   * @returns The members of the organization
   */
  static async getOrgMemberByOrgId(organizationId: string) {
    try {
      const { data, error } = await supabase.from("organization_members").select("*").eq("organization_id", organizationId);
      
      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "OrganizationMemberService.getOrgMemberByOrgId");
      throw error;
    }
  }
}