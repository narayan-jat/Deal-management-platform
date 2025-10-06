import { DealLogService } from "@/services/deals/DealLogService";
import { ErrorService } from "@/services/ErrorService";
import { LogType } from "@/types/deal/Deal.enums";
import { OrganizationService } from "@/services/organization/OrganizationService";
import { InviteType } from "@/types/deal/Deal.invites";

export const createDealLogs = async (userId: string, dealId: string, logMetaData: any, logType: LogType) => {
  try {
    // For the deal only track changes to the following fields:
    // - status, nextMeetingDate, title, requested amount, enddate and startdate.

    // For deal documents track the ids of new documents uploaded or older documents which are deleted.
    // For members track the ids of new members added with their role and the id of the member who added them.
    await DealLogService.createDealLog({
      dealId: dealId,
      memberId: userId,
      logType: logType,
      logData: logMetaData,
    });
  } catch (error) {
    ErrorService.handleApiError(error, "useCreateEditDeal");
    throw error;
  }
}

export const getUniqueOrgCode = async () => {
  // Generate a random code of 6 characters. The code should be alphanumeric and unique.
  // If ever the app stuck in an infinite loop, it means that the code is not unique.
  // Fix here. But chances are very low.
  try {
    const code = Math.random().toString(36).substring(2, 8);
    const organization = await OrganizationService.getOrganizationByCode(code);
    if (organization && organization.length > 0) {
      return getUniqueOrgCode();
    }
    return code;
  } catch (error) {
    ErrorService.handleApiError(error, "getUniqueOrgCode");
    throw error;
  }
}

// Utility function to check for pending invites
export const checkPendingInvite = () => {
  const linkToken = localStorage.getItem('pending_link_invite_token');
  const emailToken = localStorage.getItem('pending_email_invite_token');
  
  if (linkToken) {
    return { type: 'link' as const, token: linkToken };
  }
  if (emailToken) {
    return { type: 'email' as const, token: emailToken };
  }
  return null;
};

// Utility function to clear pending invites
export const clearPendingInvite = (type?: InviteType) => {
  if (type) {
    localStorage.removeItem(`pending_${type}_invite_token`);
  } else {
    localStorage.removeItem('pending_link_invite_token');
    localStorage.removeItem('pending_email_invite_token');
  }
};