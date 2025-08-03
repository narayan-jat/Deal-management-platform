import supabase from "@/lib/supabase";
import { ProfileEditFormType } from "@/types/Profile";
import { ErrorService } from "./ErrorService";
import snakecaseKeys from "snakecase-keys";
export class ProfileService {
  /**
   * Fetches a user profile from the "profiles" table using the given user ID.
   * @param userId - The unique ID of the user.
   * @returns The user's profile data or null if not found.
   */
  static async getProfile(userId: string) {
    try {
      // Get User social details from the profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "ProfileService.getProfile");
      throw error;
    }
  }

  /**
   * Updates a user's profile data in the "profiles" table.
   * @param userId - The unique ID of the user.
   * @param profileData - The updated profile data.
   * @returns The updated profile data.
   */
  static async updateProfile(userId: string, profileData: Partial<ProfileEditFormType>) {
    try {
      console.log("userId", userId);
      // convert the data to camelcase
      const snakeCaseProfileData = snakecaseKeys(profileData, { deep: true });
      const { data, error } = await supabase
        .from("profiles")
        .update(snakeCaseProfileData)
        .eq("id", userId)
        .select();

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      ErrorService.logError(error, "ProfileService.updateProfile");
      throw error;
    }
  }

  /**
   * Creates a new profile in the "profiles" table.
   * @param userId - The unique ID of the user.
   * @param profileData - The profile data to create.
   * @returns The created profile data.
   */
  static async createProfile(userId: string, profileData: Partial<ProfileEditFormType>) {
    try {
      // convert the data to snakecase
      const snakeCaseProfileData = snakecaseKeys(profileData, { deep: true });
      const { data, error } = await supabase
        .from("profiles")
        .insert({ id: userId, ...snakeCaseProfileData })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.logError(error, "ProfileService.createProfile");
      throw error;
    }
  }

  /**
   * Deletes a user's profile from the "profiles" table.
   * @param userId - The unique ID of the user.
   */
  static async deleteProfile(userId: string) {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      ErrorService.logError(error, "ProfileService.deleteProfile");
      throw error;
    }
  }
} 