import supabase from "@/lib/supabase";
import { DealLogModel } from "@/types/deal/Deal.model";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from "snakecase-keys";
/**
 * Service class for managing deal logs.
 */
export class DealLogService {
  /**
   * Creates a new deal log in the "deal_logs" table.
   * @param dealLog - The deal log to create.
   * @returns The created deal log.
   */
  static async createDealLog(dealLog: Partial<DealLogModel>) {
    // Make the data to use snake_case keys.
    const dealLogSnakeCase = snakecaseKeys(dealLog, { deep: true });

    try {
      const { data, error } = await supabase
        .from("deal_logs")
        .insert(dealLogSnakeCase)
        .select()
        .single();
      if (error) {
        ErrorService.handleApiError(error, "DealLogService");
        throw error;
      }
      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealLogService");
      throw error;
    }
  }

  /**
   * Retrieves all deal logs for a given deal ID.
   * @param dealId - The ID of the deal to retrieve logs for.
   * @returns An array of deal logs.
   */
  static async getDealLogs(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("deal_logs")
        .select("*")
        .eq("deal_id", dealId);
      if (error) {
        ErrorService.handleApiError(error, "DealLogService");
        throw error;
      }
      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "DealLogService");
      throw error;
    }
  }
}