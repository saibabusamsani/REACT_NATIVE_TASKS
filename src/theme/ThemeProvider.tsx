import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { typography } from './Typography';
import { spacing, iconSize } from './spacing';
import { radius } from './radius';
import { colors, darkColors, gradients, darkGradients, GradientKey } from './colors';
import { shadow } from './shadow';                                        
import { scaleRecord, getScaleFns } from './scaling';
import { tabletSpacing, tabletRadius, tabletIconSize } from './tabletTokens';

type ThemeMode = 'light' | 'dark';
type ThemeColors = Record<keyof typeof colors, string>;
type ThemeGradients = Record<GradientKey, readonly string[]>;

interface ThemeContextValue {
  colors: ThemeColors;
  gradients: ThemeGradients;
  typography: typeof typography;
  spacing: Record<keyof typeof spacing, number>;
  radius: Record<keyof typeof radius, number>;
  iconSize: Record<keyof typeof iconSize, number>;
  shadow: typeof shadow;                                                 
  rawSpacing: typeof spacing;
  rawRadius: typeof radius;
  rawIconSize: typeof iconSize;
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
  scale: (size: number) => number;
  moderateScale: (size: number, factor?: number) => number;
  mode: ThemeMode;
  toggle: () => void;
}

export type AppTheme = ThemeContextValue;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const { width, height } = useWindowDimensions();
  const [mode, setMode] = useState<ThemeMode>(system === 'dark' ? 'dark' : 'light');

  const value = useMemo<ThemeContextValue>(() => {
    const { isLandscape, isTablet, scale, moderateScale } = getScaleFns(width, height);

    return {
      colors: mode === 'dark' ? darkColors : colors,
      gradients: mode === 'dark' ? darkGradients : gradients,
      typography,
      spacing: isTablet ? tabletSpacing : scaleRecord(spacing, moderateScale),
      radius: isTablet ? tabletRadius : scaleRecord(radius, moderateScale),
      iconSize: isTablet ? tabletIconSize : scaleRecord(iconSize, moderateScale),
      shadow,                                                            
      rawSpacing: spacing,
      rawRadius: radius,
      rawIconSize: iconSize,
      width,
      height,
      isLandscape,
      isTablet,
      scale,
      moderateScale,
      mode,
      toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    };
  }, [mode, width, height]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}