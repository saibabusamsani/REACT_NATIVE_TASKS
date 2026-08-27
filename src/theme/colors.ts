export const colors = {
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  secondary: '#6B6B6B',

  background: '#FFFFFF',
  surface: '#F7F8FA',

  text: '#1A1A1A',
  textLight: '#6B6B6B',
  textInverse: '#FFFFFF',

  border: '#E0E0E0',

  success: '#43A047',
  error: '#E53935',
  warning: '#FB8C00',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const darkColors: Record<keyof typeof colors, string> = {
  primary: '#5B9EE8',
  primaryDark: '#4A90E2',
  secondary: '#9B9B9B',

  background: '#121212',
  surface: '#1E1E1E',

  text: '#F5F5F5',
  textLight: '#9B9B9B',
  textInverse: '#1A1A1A',

  border: '#2E2E2E',

  success: '#66BB6A',
  error: '#EF5350',
  warning: '#FFA726',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const gradients = {
  primary: ['#4A90E2', '#357ABD'],
  success: ['#66BB6A', '#43A047'],
  error: ['#EF5350', '#E53935'],
} as const;

export const darkGradients: Record<keyof typeof gradients, readonly string[]> = {
  primary: ['#5B9EE8', '#4A90E2'],
  success: ['#81C784', '#66BB6A'],
  error: ['#FF8A80', '#EF5350'],
};

export type ColorKey = keyof typeof colors;
export type GradientKey = keyof typeof gradients;