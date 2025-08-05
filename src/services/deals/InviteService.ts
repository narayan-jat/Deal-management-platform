import supabase from "@/lib/supabase";
import { DealMemberRole } from "@/types/deal/Deal.enums";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from 'snakecase-keys';
import { InviteForm, SharedLinkForm, SharedLink, UserSearchResult } from "@/types/deal/Deal.invites";


export class InviteService {

  /**
   * Create invites for users
   * @param invites - The invites to create
   * @returns The created invites
   */
  static async createInvites(invites: InviteForm[]) {
    try {
      const invitesSnakeCase = invites.map(invite => snakecaseKeys(invite as unknown as Record<string, unknown>, { deep: true }));
      
      const { data, error } = await supabase
        .from("invites")
        .insert(invitesSnakeCase)
        .select();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.createInvites");
      throw error;
    }
  }

  /**
   * Search for users by name, email.
   * @param query - The query to search for
   * @returns The users that match the query
   */
  static async searchUsers(query: string){
    try {
      let queryBuilder = supabase
        .from("profiles")
        .select("*")
        .or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(10);

      const { data, error } = await queryBuilder;

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.searchUsers");
      throw error;
    }
  }

  /**
   * Create a shareable link for a deal
   * @param sharedLink - The shared link to create
   * @returns The created shared link
   */
  static async createSharedLink(sharedLink: SharedLinkForm): Promise<SharedLink> {
    try {
      const token = this.generateToken();
      const sharedLinkData = {
        ...sharedLink,
        token,
        permissions: sharedLink.permissions || { allowEditing: false, allowCommenting: true }
      };

      const { data, error } = await supabase
        .from("shared_links")
        .insert(snakecaseKeys(sharedLinkData as unknown as Record<string, unknown>, { deep: true }))
        .select()
        .single();

      if (error) {
        throw error;
      }

      const shareableUrl = `${window.location.origin}/deal/shared/${data.token}`;

      return {
        ...data,
        shareableUrl
      };
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.createSharedLink");
      throw error;
    }
  }

  /**
   * Get all shared links for a deal
   */
  static async getSharedLinks(dealId: string): Promise<SharedLink[]> {
    try {
      const { data, error } = await supabase
        .from("shared_links")
        .select("*")
        .eq("deal_id", dealId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data?.map(link => ({
        ...link,
        shareableUrl: `${window.location.origin}/deal/shared/${link.token}`
      })) || [];
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.getSharedLinks");
      throw error;
    }
  }

  /**
   * Revoke a shared link
   */
  static async revokeSharedLink(linkId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("shared_links")
        .delete()
        .eq("id", linkId);

      if (error) {
        throw error;
      }
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.revokeSharedLink");
      throw error;
    }
  }

  /**
   * Get pending invites for a deal
   */
  static async getPendingInvites(dealId: string) {
    try {
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .eq("deal_id", dealId)
        .eq("status", "PENDING")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.getPendingInvites");
      throw error;
    }
  }

  /**
   * Cancel a pending invite
   */
  static async cancelInvite(inviteId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("invites")
        .delete()
        .eq("id", inviteId);

      if (error) {
        throw error;
      }
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.cancelInvite");
      throw error;
    }
  }

  /**
   * Generate a secure token for shared links
   */
  private static generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
} 