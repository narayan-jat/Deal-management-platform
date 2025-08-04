import supabase from "@/lib/supabase";
import { Organization } from "@/types/organization/Organization.model";
import { ErrorService } from "@/services/ErrorService";
import snakecaseKeys from "snakecase-keys";


export class OrganizationService {

  /**
   * Creates a new organization
   * @param name - The name of the organization
   * @returns The created organization
   */
  static async createOrganization(organization: Partial<Organization>) {
    // Convert to the snake case
    const snakecaseOrganization = snakecaseKeys(organization, { deep: true });
    try {
      const { data, error } = await supabase
        .from("organizations").insert(snakecaseOrganization);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "OrganizationService.createOrganization");
      throw error;
    }
  }

  /**
   * Gets an organization by ID
   * @param id - The ID of the organization
   * @returns The organization
   */

  static async getOrganizationById(id: string) {
    try {
      const { data, error } = await supabase
        .from("organizations").select("*").eq("id", id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "OrganizationService.getOrganizationById");
      throw error;
    }
  }

  /**
   * Gets an organization by code
   * @param code - The code of the organization
   * @returns The organization
   */
  static async getOrganizationByCode(code: string) {
    try {
      const { data, error } = await supabase
        .from("organizations").select("*").eq("code", code);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "OrganizationService.getOrganizationByCode");
      throw error;
    }
  }
  
  /**
   * Updates an organization
   * @param updateData - The data to update the organization with
   * @returns The updated organization
   */
  static async updateOrganization(updateData: Partial<Organization>) {
    // Convert to the snake case
    const snakecaseUpdateData = snakecaseKeys(updateData, { deep: true });
    try {
      const { data, error } = await supabase
        .from("organizations").update(snakecaseUpdateData).eq("id", updateData.id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "OrganizationService.updateOrganization");
      throw error;
    }
  }

  /**
   * Deletes an organization
   * @param id - The ID of the organization
   * @returns The deleted organization
   */
  static async deleteOrganization(id: string) {
    try {
      const { data, error } = await supabase
        .from("organizations").delete().eq("id", id);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "OrganizationService.deleteOrganization");
      throw error;
    }
  }
}