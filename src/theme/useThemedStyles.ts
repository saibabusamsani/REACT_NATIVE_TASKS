import { useMemo } from 'react';
import { useTheme, AppTheme } from './ThemeProvider';

export function useThemedStyles<T>(factory: (theme: AppTheme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme]);
}