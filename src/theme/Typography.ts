export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
} as const;

export const fontSize = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 40,
} as const;


export const variants = {
  h1: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: lineHeight.xxxl,
  },
  h2: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: lineHeight.xxl,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: lineHeight.lg,
  },
  body: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
    lineHeight: lineHeight.md,
  },
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: lineHeight.sm,
  },
} as const;


export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  variants,
};

export type FontSizeKey = keyof typeof fontSize;
export type FontWeightKey = keyof typeof fontWeight;
export type VariantKey = keyof typeof variants;