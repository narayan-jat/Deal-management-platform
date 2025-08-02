// =====================================================
// LOG DATA PARSER UTILITY
// =====================================================

/**
 * Parses log data and returns a descriptive keyword based on the action performed
 * @param logData - The JSON data from the log entry
 * @returns A descriptive keyword for the log action
 */
export function parseLogData(logData: any): string {
  if (!logData || typeof logData !== 'object') {
    return 'Unknown action';
  }

  // Check for document-related actions
  if (logData.documents && logData.documents?.action) {
    if (logData.documents?.action.includes('deleted')) {
      return 'Document deleted';
    }
    if (logData.documents?.action.includes('uploaded')) {
      return 'Document uploaded';
    }
    if (logData.documents?.action.includes('downloaded')) {
      return 'Document downloaded';
    }
    if (logData.documents?.action.includes('signed')) {
      return 'Document signed';
    }
    if (logData.documents?.action.includes('viewed')) {
      return 'Document viewed';
    }
    return 'Document action';
  }

  // Check for member-related actions
  if (logData.members && logData.members?.action) {
    if (logData.members?.action.includes('added')) {
      return 'Member added';
    }
    if (logData.members?.action.includes('removed')) {
      return 'Member removed';
    }
    if (logData.members?.action.includes('role changed')) {
      return 'Role changed';
    }
    return 'Member action';
  }

  // Check for deal status changes
  if (logData.deal && logData.deal?.action) {
    if (logData.deal?.action.includes('status changed')) {
      return 'Status changed';
    }
    if (logData.deal?.action.includes('deal updated')) {
      return 'Deal updated';
    }
  }

  // Check for comment actions
  if (logData.comments && logData.comments?.action) {
    if (logData.comments?.action.includes('added')) {
      return 'Comment added';
    }
    if (logData.comments?.action.includes('edited')) {
      return 'Comment edited';
    }
    if (logData.comments?.action.includes('deleted')) {
      return 'Comment deleted';
    }
    return 'Comment action';
  }


  // Check for permission changes
  if (logData.permissions && logData.permissions?.action) {
    if (logData.permissions?.action.includes('updated')) {
      return 'Permissions updated';
    }
  }

  return 'Action performed';
} 