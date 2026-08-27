import React, { useMemo, ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';
import { GradientKey } from '../theme/colors';

type ButtonSize = 'sm' | 'md' | 'lg';

type SizeConfig = {
  paddingVerticalKey: 'xs' | 'sm' | 'md';
  paddingHorizontalKey: 'sm' | 'lg' | 'xl';
  fontSizeKey: 'sm' | 'lg' | 'xl';
  iconGapKey: 'xs' | 'sm';
};

const SIZE_CONFIG: Record<ButtonSize, SizeConfig> = {
  sm: { paddingVerticalKey: 'xs', paddingHorizontalKey: 'sm', fontSizeKey: 'sm', iconGapKey: 'xs' },
  md: { paddingVerticalKey: 'sm', paddingHorizontalKey: 'lg', fontSizeKey: 'lg', iconGapKey: 'xs' },
  lg: { paddingVerticalKey: 'md', paddingHorizontalKey: 'xl', fontSizeKey: 'xl', iconGapKey: 'sm' },
};

interface Props {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  gradient?: GradientKey;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  gradient = 'primary',
  size = 'md',
  disabled,
  loading = false,
  loadingText,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: Props) {
  const { colors, gradients, spacing, radius, typography, isLandscape, isTablet } = useTheme();
  const isDisabled = disabled || loading;

  const styles = useMemo(() => {
    const cfg = SIZE_CONFIG[size];
    return StyleSheet.create({
      btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing[cfg.paddingVerticalKey],
        paddingHorizontal: spacing[cfg.paddingHorizontalKey],
        borderRadius: radius.md,
        maxWidth: isTablet ? 360 : isLandscape ? 280 : undefined,
        alignSelf: isLandscape || isTablet ? 'center' : 'flex-start',
      },
      text: {
        color: colors.white,
        fontSize: typography.fontSize[cfg.fontSizeKey],
        fontWeight: '600',
      },
      iconLeft: {
        marginRight: spacing[cfg.iconGapKey],
      },
      iconRight: {
        marginLeft: spacing[cfg.iconGapKey],
      },
      loadingText: {
        marginLeft: spacing[cfg.iconGapKey],
      },
      disabled: {
        opacity: 0.5,
      },
    });
  }, [colors, spacing, radius, typography, size, isLandscape, isTablet]);

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.85}>
      <LinearGradient
        colors={gradients[gradient] as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.btn, isDisabled && styles.disabled, style]}
      >
        {loading ? (
          <>
            <ActivityIndicator color={colors.white} />
            {loadingText && (
              <Text style={[styles.text, styles.loadingText, textStyle]}>{loadingText}</Text>
            )}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
            <Text style={[styles.text, textStyle]}>{title}</Text>
            {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}