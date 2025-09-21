import { DealOverviewForm, PersonTag, PersonTagType } from '@/types/deal/Deal.sections';
import { InviteService } from '@/services/deals/InviteService';

export interface EmailInviteData {
  email: string;
  role: string;
  dealId: string;
  invitedBy: string;
  permissions?: any;
}

/**
 * Extracts people from overview section and filters out already invited emails
 */
export const prepareEmailInvites = async (
  overviewData: DealOverviewForm,
  dealId: string,
  invitedBy: string
): Promise<EmailInviteData[]> => {
  try {
    // Get already invited emails
    const alreadyInvitedEmails = await InviteService.getAlreadyInvitedEmails(dealId);
    
    // Extract all people from overview section
    const allPeople: PersonTag[] = [
      ...(overviewData.borrowers || []),
      ...(overviewData.lenders || []),
      ...(overviewData.otherParties || [])
    ];
    
    // Filter out people without emails and already invited emails
    const newInvites = allPeople
      .filter(person => person.email && person.email.trim() !== '')
      .filter(person => !alreadyInvitedEmails.includes(person.email))
      .map(person => ({
        email: person.email,
        role: 'COMMENTER', // hardcoded to commenter for now
        dealId,
        invitedBy,
        permissions: null // You can customize this based on role if needed
      }));
    
    return newInvites;
  } catch (error) {
    console.error('Error preparing email invites:', error);
    return [];
  }
};

/**
 * Converts PersonTagType to a readable role string
 */
const getRoleFromPersonTagType = (personTagType: PersonTagType): string => {
  switch (personTagType) {
    case PersonTagType.BORROWERS:
      return 'Borrower';
    case PersonTagType.LENDERS:
      return 'Lender';
    case PersonTagType.OTHER_PARTIES:
      return 'Other Party';
    default:
      return 'Collaborator';
  }
};

/**
 * Sends email invites for people in overview section
 */
export const sendOverviewEmailInvites = async (
  overviewData: DealOverviewForm,
  dealId: string,
  invitedBy: string
): Promise<{success: number, failed: number}> => {
  try {
    const invites = await prepareEmailInvites(overviewData, dealId, invitedBy);
    
    if (invites.length === 0) {
      console.log('No new email invites to send');
      return { success: 0, failed: 0 };
    }
    
    console.log(`Sending ${invites.length} email invites:`, invites);
    
    const result = await InviteService.sendEmailInvites(invites);
    
    // Handle the response from the edge function
    if (result.failed && result.failed.length > 0) {
      console.warn('Some invites failed:', result.failed);
      return {
        success: result.success?.length || 0,
        failed: result.failed?.length || 0
      };
    }
    
    return {
      success: result.data?.length || invites.length,
      failed: 0
    };
  } catch (error) {
    console.error('Error sending email invites:', error);
    return { success: 0, failed: 1 };
  }
};
