// Theme Configuration
export const colors = {
  primary: '#004646',      // Teal
  secondary: '#C8B273',    // Tarnished Gold
  white: '#FFFFFF',        // Whitespace
  black: '#000000',        // Text
  // Additional color variations
  primaryLight: '#006666',
  primaryDark: '#003333',
  secondaryLight: '#D4C285',
  secondaryDark: '#A69051',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
} as const;

export const fonts = {
  primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  // Font weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  }
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
} as const;

export const borderRadius = {
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

// CSS Variables for global use
export const cssVariables = {
  '--color-primary': colors.primary,
  '--color-secondary': colors.secondary,
  '--color-white': colors.white,
  '--color-black': colors.black,
  '--font-primary': fonts.primary,
} as const; 