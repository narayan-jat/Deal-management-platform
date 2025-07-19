import supabase from "@/lib/supabase";
import { ProfileData } from "@/types/Profile";
import { ErrorService } from "./ErrorService";

export class ProfileService {
  /**
   * Fetches a user profile from the "profiles" table using the given user ID.
   * @param userId - The unique ID of the user.
   * @returns The user's profile data or null if not found.
   */
  static async getProfile(userId: string): Promise<ProfileData | null> {
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
  static async updateProfile(userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId)
        .select()
        .single();

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
  static async createProfile(userId: string, profileData: Partial<ProfileData>): Promise<ProfileData> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({ id: userId, ...profileData })
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
  static async deleteProfile(userId: string): Promise<void> {
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