import { Text, TextProps } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import type { VariantKey } from '../theme';

interface Props extends TextProps {
  variant?: VariantKey;
  color?: string;
}

export function AppText({ variant = 'body', color, style, ...props }: Props) {
  const { typography, colors } = useTheme();
  return (
    <Text
      style={[typography.variants[variant], { color: color ?? colors.text }, style]}
      {...props}
    />
  );
}