import supabase from "@/lib/supabase";
import { ErrorService } from "./ErrorService";
import snakecaseKeys from "snakecase-keys";
import { NotificationModel } from "@/types/Notification";
// =====================================================
// NOTIFICATION SERVICE
// =====================================================


export class NotificationService {
  /**
   * Fetches all notifications for a user from the "notifications" table.
   * @param userId - The unique ID of the user.
   * @returns Array of notifications for the user.
   */
  static async getNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
    if (error) {
      throw error;
    }
    
    return data || [];
    } catch (error) {
      ErrorService.logError(error, "NotificationService.getNotifications");
      throw error;
    }
  }

  /**
   * Fetches unread notifications for a user from the "notifications" table.
   * @param userId - The unique ID of the user.
   * @returns Array of unread notifications for the user.
   */
  static async getUnreadNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .eq("read", false)
        .order("created_at", { ascending: false });
        
    if (error) {
      throw error;
    }
    
    return data || [];
    } catch (error) {
      ErrorService.logError(error, "NotificationService.getUnreadNotifications");
      throw error;
    }
  }

  /**
   * Creates a notification in the "notifications" table.
   * @param notification - The notification data to create.
   */
  static async createNotification(notification: Partial<NotificationModel>) {
    try {
      // convert the notification to snakecase
      const snakeCaseNotification = snakecaseKeys(notification);
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          ...snakeCaseNotification,
        })
        .select();

    if (error) {
      throw error;
    }

      return data;
    } catch (error) {
      ErrorService.logError(error, "NotificationService.createNotification");
      throw error;
    }
  }

  /**
   * Updates a notification in the "notifications" table.
   * @param notificationId - The unique ID of the notification.
   * @param notification - The notification data to update.
   */
  static async updateNotification(notificationId: string, notification: Partial<NotificationModel>) {
    try {
      // convert the notification to snakecase
      const snakeCaseNotification = snakecaseKeys(notification);
      const { data, error } = await supabase
        .from("notifications")
        .update(snakeCaseNotification)
        .eq("id", notificationId)
        .select();

    if (error) {
      throw error;
    }

      return data;
    } catch (error) {
      ErrorService.logError(error, "NotificationService.updateNotification");
      throw error;
    }
  }

  /**
   * Marks a notification as read.
   * @param notificationId - The unique ID of the notification.
   */
  static async markAsRead(notificationId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)
        .select();

    if (error) {
      throw error;
    }

      return data;
    } catch (error) {
      ErrorService.logError(error, "NotificationService.markAsRead");
      throw error;
    }
  }

  /**
   * Marks all notifications for a user as read.
   * @param userId - The unique ID of the user.
   */
  static async markAllAsRead(userId: string) {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false)
        .select();

    if (error) {
      throw error;
    }

      return data;
    } catch (error) {
      ErrorService.logError(error, "NotificationService.markAllAsRead");
      throw error;
    }
  }
}