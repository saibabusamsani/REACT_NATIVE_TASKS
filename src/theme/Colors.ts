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

export const gradients = {
  primary: ['#4A90E2', '#357ABD'],
  success: ['#66BB6A', '#43A047'],
  error: ['#EF5350', '#E53935'],
} as const;

export type ColorKey = keyof typeof colors;
export type GradientKey = keyof typeof gradients;