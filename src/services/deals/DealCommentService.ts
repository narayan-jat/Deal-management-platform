import supabase from "@/lib/supabase";
import { DealCommentModel } from "@/types/deal/Deal.model";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from "snakecase-keys";
import { DealLogService } from "./DealLogService";
import { LogType } from "@/types/deal/Deal.enums";

/**
 * Service class for managing deal comments.
 */
export class DealCommentService {
  /**
   * Creates a new deal comment in the "deal_comments" table.
   * @param dealComment - The deal comment to create.
   * @returns The created deal comment.
   */
  static async createDealComment(dealComment: Partial<DealCommentModel>) {
    // Make the data to use snake_case keys.
    const dealCommentSnakeCase = snakecaseKeys(dealComment, { deep: true });

    try {
      const { data, error } = await supabase
        .from("deal_comments")
        .insert(dealCommentSnakeCase)
        .select()
        .single();
      if (error) {
        ErrorService.handleApiError(error, "DealCommentService");
        throw error;
      }

      // Create a log entry for the comment
      await DealLogService.createDealLog({
        dealId: dealComment.dealId,
        memberId: dealComment.memberId,
        logType: LogType.COMMENTED,
        logData: {
          comments: {
            comment: dealComment.comment,
            action: "comment added",
          },
        }
      });
      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealCommentService");
      throw error;
    }
  }

  /**
   * Retrieves all deal comments for a given deal ID.
   * @param dealId - The ID of the deal to retrieve comments for.
   * @returns An array of deal comments.
   */
  static async getDealComments(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_comments")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });
      if (error) {
        ErrorService.handleApiError(error, "DealCommentService");
        throw error;
      }
      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealCommentService");
      throw error;
    }
  }

  /**
   * Updates a deal comment in the "deal_comments" table.
   * @param dealComment - The deal comment to update.
   * @returns The updated deal comment.
   */
  static async updateDealComment(dealComment: Partial<DealCommentModel>) {
    // Make the data to use snake_case keys.
    const dealCommentSnakeCase = snakecaseKeys(dealComment, { deep: true });

    try {
      const { data, error } = await supabase
        .from("deal_comments")
        .update(dealCommentSnakeCase)
        .eq("id", dealComment.id)
        .select()
        .single();
      if (error) {
        ErrorService.handleApiError(error, "DealCommentService");
        throw error;
      }

      // Create a log entry for the comment
      await DealLogService.createDealLog({
        dealId: data.deal_id,
        memberId: data.member_id,
        logType: LogType.COMMENTED,
        logData: {
          comments: {
            comment: data.comment,
            action: "comment updated",
          },
        }
      });
      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealCommentService");
      throw error;
    }
  }

  /**
   * Deletes a deal comment from the "deal_comments" table.
   * @param commentId - The ID of the comment to delete.
   * @returns The deleted comment.
   */
  static async deleteDealComment(commentId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_comments")
        .delete()
        .eq("id", commentId)
        .select()
        .single();
      if (error) {
        ErrorService.handleApiError(error, "DealCommentService");
        throw error;
      }

      // Create a log entry for the comment
      await DealLogService.createDealLog({
        dealId: data.deal_id,
        memberId: data.member_id,
        logType: LogType.COMMENTED,
        logData: {
          comments: {
            comment: data.comment,
            action: "comment deleted",
          },
        }
      });
      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealCommentService");
      throw error;
    }
  }
} 