import React from 'react';
import { View } from 'react-native';
import Feather from '@react-native-vector-icons/feather';
import { AppText } from '../components/AppText';
import { AppTheme } from './ThemeProvider';

const TOAST_CONFIG = {
  error: { icon: 'x-circle', accent: 'error' as const },
  success: { icon: 'check-circle', accent: 'success' as const },
  warning: { icon: 'alert-triangle', accent: 'warning' as const },
};

export const buildToastConfig = (theme: AppTheme) => {
  const { colors, spacing, radius, shadow } = theme;

  const renderToast = (type: keyof typeof TOAST_CONFIG) => (props: any) => {
    const { icon, accent } = TOAST_CONFIG[type];
    const accentColor = colors[accent];

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background,
          borderRadius: radius.lg,
          paddingVertical: spacing.sm + 2,
          paddingHorizontal: spacing.sm + 2,
          marginHorizontal: spacing.md,
          width: '92%',
          borderWidth: 1,
          borderColor: colors.border,
          ...shadow.lg,
        }}
      >
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: radius.full,
            backgroundColor: `${accentColor}1A`, // ~10% opacity tint of accent
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name={icon as any} size={18} color={accentColor} />
        </View>

        <View style={{ marginLeft: spacing.sm, flex: 1 }}>
          <AppText variant="subtitle" color={colors.text} numberOfLines={1}>
            {props.text1}
          </AppText>
          {!!props.text2 && (
            <AppText
              variant="caption"
              color={colors.textLight}
              style={{ marginTop: 1 }}
              numberOfLines={2}
            >
              {props.text2}
            </AppText>
          )}
        </View>
        <View
          style={{
            width: 4,
            height: '60%',
            borderRadius: radius.full,
            backgroundColor: accentColor,
            marginLeft: spacing.xs,
          }}
        />
      </View>
    );
  };

  return {
    error: renderToast('error'),
    success: renderToast('success'),
    warning: renderToast('warning'),
  };
};