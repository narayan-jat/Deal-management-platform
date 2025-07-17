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

export const navigationConfig: NavigationConfig = {
  mainNav: [
    {
      title: "Home",
      scrollTarget: "hero",
      type: "scroll"
    },
    {
      title: "Features",
      scrollTarget: "features",
      type: "scroll"
    },
    {
      title: "How It Works",
      scrollTarget: "how-it-works",
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
      path: "/login",
      type: "route"
    },
    {
      title: "Sign Up",
      path: "/signup",
      type: "route"
    }
  ]
}; 