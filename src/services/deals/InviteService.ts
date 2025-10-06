import supabase from "@/lib/supabase";
import { ErrorService } from "../ErrorService";
import snakecaseKeys from 'snakecase-keys';
import { InviteForm, SharedLinkForm, SharedLink } from "@/types/deal/Deal.invites";
import { DealMemberService } from "./DealMemberService";
import { DealLogService } from "./DealLogService";
import { LogType } from "@/types/deal/Deal.enums";
import { ROUTES } from "@/config/routes";

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
      // May need to change for better security.
      const token = crypto.randomUUID();
      const sharedLinkData = {
        ...sharedLink,
        token,
      };

      // Make the data to use snake_case keys.
      const sharedLinkDataSnakeCase = snakecaseKeys(sharedLinkData as unknown as Record<string, unknown>, { deep: true });

      const { data, error } = await supabase
        .from("shared_links")
        .insert(sharedLinkDataSnakeCase)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const shareableUrl = `${import.meta.env.VITE_APP_URL}${ROUTES.DEAL_LINK_INVITE.replace(':token', data.token)}`;

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
   * Accept a link invite
   * @param userId - The user id of the user accepting the invite
   * @param token - The token of the invite
   * @returns The deal member that was added
   */
  static async acceptLinkInvite(userId: string, token: string){
    try{
      const { data, error } = await supabase.from("shared_links").select("*").eq("token", token).single();

      if (error) {
        throw error;
      }

      // Check if the invite is expired.
      if (data.expires_at) {
        const expiresAt = new Date(data.expires_at);
        if (expiresAt.getTime() < Date.now()) {
          throw new Error("Link invite expired");
        }
      }

      const dealMember = {
        deal_id: data.deal_id,
        member_id: userId,
        role: data.role,
        added_by: data.created_by,
      }
      // add to the deal_members table.
      await DealMemberService.createDealMembers([dealMember]);
      // Now update the expired at to current timestamp.
      await supabase.from("shared_links").update({ expires_at: new Date() }).eq("token", token);
      // Log the deal member added to the deal logs.
      await DealLogService.createDealLog({
        dealId: data.deal_id,
        memberId: userId,
        logType: LogType.UPDATED,
        logData: {
          members: {
            member_id: [userId],
            action: "member added",
          },
        }
      });

      return dealMember;
    }catch(err: any){
      ErrorService.handleApiError(err, "InviteService.acceptLinkInvite");
      throw err;
    }
  }

  /**
   * Accept an email invite
   * @param userId - The user id of the user accepting the invite
   * @param token - The token of the invite
   * @returns The deal member that was added
   */
  static async acceptEmailInvite(userId: string, token: string){
    try{
      // Update the invite status to accep the deal.
      const { data: updatedData, error: updateError } = await supabase.from("invites").update({ status: "ACCEPTED" }).eq("token", token).select("*").single();
      if (updateError) {
        throw updateError;
      }

      const dealMember = {
        deal_id: updatedData.deal_id,
        member_id: userId,
        role: updatedData.role,
      }
      // add to the deal_members table.
      await DealMemberService.createDealMembers([dealMember]);
      // Log the deal member added to the deal logs.
      await DealLogService.createDealLog({
        dealId: updatedData.deal_id,
        memberId: userId,
        logType: LogType.UPDATED,
        logData: {
          members: {
            member_id: [userId],
            action: "member added",
          },
        }
      });

      return dealMember;
    }
    catch(err: any){
      ErrorService.handleApiError(err, "InviteService.acceptEmailInvite");
      throw err;
    }
  }

  /**
   * Check if a link invite is expired.
   * @param token - The token of the link invite
   * @returns True if the invite is expired, false otherwise
   */
  static async checkIfLinkInviteExpired(token: string){
    try{
      const { data, error } = await supabase.from("shared_links").select("*").eq("token", token).single();

      if (error) {
        throw error;
      }

      // Check if the invite is expired.
      // exprires_at can be null, and time stamp can be 0.
      if (data.expires_at) {
        const expiresAt = new Date(data.expires_at);
        if (expiresAt.getTime() < Date.now()) {
          return true;
        }
      }

      return false;
    }
    catch(err: any){
      ErrorService.handleApiError(err, "InviteService.checkIfLinkInviteExpired");
      throw err;
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
        shareableUrl: `${import.meta.env.VITE_APP_URL}${ROUTES.DEAL_LINK_INVITE.replace(':token', link.token)}`
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
   * Get already invited emails for a deal
   */
  static async getAlreadyInvitedEmails(dealId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("invites")
        .select("email")
        .eq("deal_id", dealId)
        .in("status", ["PENDING", "ACCEPTED"]);

      if (error) {
        throw error;
      }

      return data?.map(invite => invite.email) || [];
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.getAlreadyInvitedEmails");
      throw error;
    }
  }

  /**
   * Send email invites using the edge function
   */
  static async sendEmailInvites(invites: Array<{email: string, role: string, dealId: string, invitedBy: string, permissions?: any}>) {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ invites })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email invites');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      ErrorService.handleApiError(error, "InviteService.sendEmailInvites");
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