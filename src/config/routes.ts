// Route constants for better maintainability
export const ROUTES = {
  // Public routes
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  DEALS: '/deals',
  VIEW_DEAL: '/deals/:dealId',
  MESSAGES: '/dashboard/messages',
  NOTIFICATIONS: '/dashboard/notifications',
  PROFILE: '/profile',
  DEAL_LINK_INVITE: '/deals/shared/:token',
} as const;

// Route groups for easier management
export const PUBLIC_ROUTES = {
  HOME: ROUTES.HOME,
  SIGNIN: ROUTES.SIGNIN,
  SIGNUP: ROUTES.SIGNUP,
  DEAL_LINK_INVITE: ROUTES.DEAL_LINK_INVITE,
} as const;

export const PROTECTED_ROUTES = {
  DASHBOARD: ROUTES.DASHBOARD,
  DEALS: ROUTES.DEALS,
  VIEW_DEAL: ROUTES.VIEW_DEAL,
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
    title: 'Deal Invite',
    description: 'Accept a deal invite',
    requiresAuth: false,
  },
  [ROUTES.PROFILE]: {
    title: 'Profile',
    description: 'Manage your profile',
    requiresAuth: true,
  }
} as const; 