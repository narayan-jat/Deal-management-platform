import { DealDocumentModel, DealMemberModel, DealModel } from "@/types/deal/Deal.model";
import { DealLogService } from "@/services/deals/DealLogService";
import { ErrorService } from "@/services/ErrorService";
import { LogType } from "@/types/deal/Deal.enums";

export const updateDealLogs = async (userId: string, dealId: string, logMetaData: any) => {
  try {
    // For the deal only track changes to the following fields:
    // - status, nextMeetingDate, title, requested amount, enddate and startdate.

    // For deal documents track the ids of new documents uploaded or older documents which are deleted.
    // For members track the ids of new members added with their role and the id of the member who added them.
    await DealLogService.createDealLog({
      dealId: dealId,
      memberId: userId,
      logType: LogType.UPDATED,
      logData: logMetaData,
    });
  } catch (error) {
    ErrorService.handleApiError(error, "useCreateEditDeal");
    throw error;
  }
}
