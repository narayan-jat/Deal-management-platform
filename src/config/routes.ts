// Route constants for better maintainability
export const ROUTES = {
  // Public routes
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  CHANGE_PASSWORD: '/change-password',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  DEALS: '/deals',
  VIEW_DEAL: '/deals/:dealId',
  CREATE_DEAL: '/deals/create/new',
  EDIT_DEAL: '/deals/edit/:dealId',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  DEAL_LINK_INVITE: '/deals/deal-link-invite/:token',
  DEAL_EMAIL_INVITE: '/deals/deal-email-invite/:token',
  ACCOUNT_CHANGE_PASSWORD: '/account/change-password',
} as const;

// Route groups for easier management
export const PUBLIC_ROUTES = {
  HOME: ROUTES.HOME,
  SIGNIN: ROUTES.SIGNIN,
  SIGNUP: ROUTES.SIGNUP,
  RESET_PASSWORD: ROUTES.RESET_PASSWORD,
  CHANGE_PASSWORD: ROUTES.CHANGE_PASSWORD,
  DEAL_LINK_INVITE: ROUTES.DEAL_LINK_INVITE,
  DEAL_EMAIL_INVITE: ROUTES.DEAL_EMAIL_INVITE,
} as const;

export const PROTECTED_ROUTES = {
  DASHBOARD: ROUTES.DASHBOARD,
  DEALS: ROUTES.DEALS,
  VIEW_DEAL: ROUTES.VIEW_DEAL,
  CREATE_DEAL: ROUTES.CREATE_DEAL,
  EDIT_DEAL: ROUTES.EDIT_DEAL,
  MESSAGES: ROUTES.MESSAGES,
  NOTIFICATIONS: ROUTES.NOTIFICATIONS,
  PROFILE: ROUTES.PROFILE,
} as const;

// Route metadata for navigation and breadcrumbs
export const ROUTE_METADATA = {
  [ROUTES.HOME]: {
    title: 'Home',
    description: 'GoDex - Deal Management Platform',
    requiresAuth: false,
  },
  [ROUTES.SIGNIN]: {
    title: 'Sign In',
    description: 'Sign in to your GoDex account',
    requiresAuth: false,
  },
  [ROUTES.SIGNUP]: {
    title: 'Sign Up',
    description: 'Create your GoDex account',
    requiresAuth: false,
  },
  [ROUTES.RESET_PASSWORD]: {
    title: 'Reset Password',
    description: 'Reset your GoDex account password',
    requiresAuth: false,
  },
  [ROUTES.CHANGE_PASSWORD]: {
    title: 'Change Password',
    description: 'Set your new password',
    requiresAuth: false, // This can be accessed via email link without being logged in
  },
  [ROUTES.ACCOUNT_CHANGE_PASSWORD]: {
    title: 'Change Password',
    description: 'Change your account password',
    requiresAuth: true,
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    description: 'Your GoDex dashboard',
    requiresAuth: true,
  },
  [ROUTES.DEALS]: {
    title: 'Deals',
    description: 'Manage your deals',
    requiresAuth: true,
  },
  [ROUTES.VIEW_DEAL]: {
    title: 'Deal Details',
    description: 'View details for a specific deal',
    requiresAuth: true,
  },
  [ROUTES.CREATE_DEAL]: {
    title: 'Create Deal',
    description: 'Create a new deal',
    requiresAuth: true,
  },
  [ROUTES.EDIT_DEAL]: {
    title: 'Edit Deal',
    description: 'Edit an existing deal',
    requiresAuth: true,
  },
  [ROUTES.MESSAGES]: {
    title: 'Messages',
    description: 'View your messages',
    requiresAuth: true,
  },
  [ROUTES.NOTIFICATIONS]: {
    title: 'Notifications',
    description: 'View your notifications',
    requiresAuth: true,
  },
  [ROUTES.DEAL_LINK_INVITE]: {
    title: 'Deal Link Invite',
    description: 'Accept a deal link invite',
    requiresAuth: false,
  },
  [ROUTES.DEAL_EMAIL_INVITE]: {
    title: 'Deal Email Invite',
    description: 'Accept a deal email invite',
    requiresAuth: false,
  },
  [ROUTES.PROFILE]: {
    title: 'Profile',
    description: 'Manage your profile',
    requiresAuth: true,
  }
} as const; 