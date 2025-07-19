export class ErrorService {
  /**
   * Log error with context
   */
  static logError(error: any, context: string): void {
    console.error(`[${context}] Error:`, error);
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error?.message) {
      // Handle common Supabase errors
      if (error.message.includes('duplicate key')) {
        return 'This record already exists.';
      }
      if (error.message.includes('foreign key')) {
        return 'This operation cannot be completed due to related data.';
      }
      if (error.message.includes('permission denied')) {
        return 'You do not have permission to perform this action.';
      }
      if (error.message.includes('network')) {
        return 'Network error. Please check your connection and try again.';
      }
      
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Handle API errors consistently
   */
  static handleApiError(error: any, context: string): string {
    this.logError(error, context);
    return this.getUserFriendlyMessage(error);
  }
} 