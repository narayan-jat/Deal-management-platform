import { ROUTES } from "./routes";

export interface NavigationItem {
  title: string;
  path?: string; // For router navigation
  scrollTarget?: string; // For smooth scrolling
  type: 'scroll' | 'route' | 'external';
}

export interface NavigationConfig {
  mainNav: NavigationItem[];
  authNav: NavigationItem[];
}

export const homeNavigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: "Home",
      scrollTarget: "hero",
      type: "scroll"
    },
    {
      title: "How It Works",
      scrollTarget: "how-it-works",
      type: "scroll"
    },
    {
      title: "Features",
      scrollTarget: "features",
      type: "scroll"
    },
    {
      title: "Contact",
      scrollTarget: "contact",
      type: "scroll"
    }
  ],
  authNav: [
    {
      title: "Sign in",
      path: ROUTES.SIGNIN, 
      type: "route"
    },
    {
      title: "Sign Up",
      path: ROUTES.SIGNUP,
      type: "route"
    }
  ]
};

export const OtherExternalPageNavigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: "Home",
      path: "/",
      type: "route"
    },
    {
      title: "How It Works",
      path: "/",
      type: "route"
    },
    {
      title: "Features",
      path: "/",
      type: "route"
    },
    {
      title: "Contact",
      path: "/",
      type: "route"
    }
  ],
  authNav: [
    {
      title: "Sign in",
      path: ROUTES.SIGNIN, 
      type: "route"
    },
    {
      title: "Sign Up",
      path: ROUTES.SIGNUP,
      type: "route"
    }
  ]
}; 