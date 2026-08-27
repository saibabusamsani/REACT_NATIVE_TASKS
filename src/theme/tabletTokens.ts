import { spacing } from './spacing';
import { radius } from './radius';
import { iconSize } from './spacing'; 

export const tabletSpacing: Record<keyof typeof spacing, number> = { xs: 6, sm: 12, md: 20, lg: 28, xl: 40, xxl: 56 };
export const tabletRadius: Record<keyof typeof radius, number> = { sm: 6, md: 10, lg: 16, xl: 24, full: 999 };
export const tabletIconSize: Record<keyof typeof iconSize, number> = { xs: 16, sm: 18, md: 22, lg: 28, xl: 36 };