import supabase from "@/lib/supabase";
import { ProfileEditFormType } from "@/types/Profile";
import { ErrorService } from "./ErrorService";
import snakecaseKeys from "snakecase-keys";
import { MatrixUserModel } from "@/types/Matrix";
import { MatrixService } from "./MatrixService";

// =====================================================
// MATRIX USER SERVICE
// =====================================================

const formatUserId = (userId: string) => {
  if(userId && !userId.includes('@')) {
    return `@${userId}:${MatrixService.homeserverDomain}`;
  }
  return userId;
}

export class MatrixUserService {
  /**
   * Fetches a matrix user from the "matrix_users" table using the given user ID.
   * @param userId - The unique ID of the user.
   * @returns The matrix user data or null if not found.
   */
  static async getMatrixUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from("matrix_users")
        .select("*")
        .eq("user_id", userId)
        .single();
        
    if (error) {
      throw error;
    }

      return data;
    } catch (error) {
      ErrorService.logError(error, "MatrixUserService.getMatrixUser");
      throw error;
    }
  }

    /**
   * Fetches all matrix users from the "matrix_users" table.
   * @returns The matrix user data or null if not found.
   */ 
    static async getAllMatchingMatrixUsers(query: string) {
      try {
        const { data, error } = await supabase
          .from("matrix_users")
          .select("*")
          .ilike("matrix_user_id", `%${query}%`);
          
      if (error) {
        throw error;
      }
  
        return data;
      } catch (error) {
        ErrorService.logError(error, "MatrixUserService.getAllMatchingMatrixUsers");
        throw error;
      }
    }

  /**
   * Creates a matrix user in the "matrix_users" table.
   * @param userId - The unique ID of the user.
   * @param matrixUserId - The unique ID of the matrix user.
   * @param matrixAccessToken - The access token for the matrix user.
   * @param matrixRefreshToken - The refresh token for the matrix user.
   */
  static async createMatrixUser(matrixUser: Partial<MatrixUserModel>) {
    try {
      // convert the matrixUser to snakecase
      const snakeCaseMatrixUser = snakecaseKeys(matrixUser);
      // Need to remove this later. if we host our own homeserver.
      const formattedUserId = formatUserId(snakeCaseMatrixUser.matrix_user_id);
      const { data, error } = await supabase
        .from("matrix_users")
        .insert({
          ...snakeCaseMatrixUser,
          matrix_user_id: formattedUserId,
        })
        .select();

    if (error) {
      throw error;
    }

      return data;
    } catch (error) {
      ErrorService.logError(error, "MatrixUserService.createMatrixUser");
      throw error;
    }
  }

  /**
   * Updates a matrix user in the "matrix_users" table.
   * @param matrixUserId - The unique ID of the matrix user.
   * @param matrixUser - The matrix user data to update.
   */
  static async updateMatrixUser(matrixUserId: string, matrixUser: Partial<MatrixUserModel>) {
    try {
      // convert the matrixUser to snakecase
      const snakeCaseMatrixUser = snakecaseKeys(matrixUser);
      const { data, error } = await supabase
        .from("matrix_users")
        .update(snakeCaseMatrixUser)
        .eq("id", matrixUserId)
        .select();

    if (error) {
      throw error;
    }

      return data;
    } catch (error) {
      ErrorService.logError(error, "MatrixUserService.updateMatrixUser");
      throw error;
    }
  }
}