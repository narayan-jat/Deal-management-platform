import { DealMemberRole } from '@/types/deal/Deal.enums';
import { Contributor } from '@/types/deal/Deal.members';
import { editAccessRoles } from '@/Constants';

/**
 * Utility functions for deal role-based access control
 */

/**
 * Check if a user can edit a deal based on their role
 * @param userId - The current user's ID
 * @param contributors - Array of deal contributors with their roles
 * @returns boolean indicating if the user can edit
 */
export const canUserEditDeal = (userId: string, contributors: Contributor[]): boolean => {
  const userContributor = contributors.find(contributor => contributor.id === userId);
  
  console.log('userContributor', userContributor);
  if (!userContributor) {
    return false;
  }

  // Only OWNER, EDITOR, and ADMIN can edit deals
  return editAccessRoles.includes(userContributor.role as DealMemberRole);
};

/**
 * Check if a user can comment on a deal based on their role
 * @param userId - The current user's ID
 * @param contributors - Array of deal contributors with their roles
 * @returns boolean indicating if the user can comment
 */
export const canUserCommentOnDeal = (userId: string, contributors: Contributor[]): boolean => {
  const userContributor = contributors.find(contributor => contributor.id === userId);
  
  if (!userContributor) {
    return false;
  }

  // VIEWER role cannot comment, all other roles can comment
  return userContributor.role !== DealMemberRole.VIEWER;
};

/**
 * Get the current user's role in a deal
 * @param userId - The current user's ID
 * @param contributors - Array of deal contributors with their roles
 * @returns the user's role or null if not found
 */
export const getUserRoleInDeal = (userId: string, contributors: Contributor[]): DealMemberRole | null => {
  const userContributor = contributors.find(contributor => contributor.id === userId);
  return userContributor ? (userContributor.role as DealMemberRole) : null;
};
