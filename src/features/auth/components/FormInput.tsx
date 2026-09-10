import React, { memo } from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { useThemedStyles, useTheme, AppTheme } from '../../../theme';
import { AppText } from '../../../components/AppText';
import { AnimatedErrorRow } from './AnimatedErrorRow';

interface FormInputProps extends TextInputProps {
  label: string;
  iconName: string;
  error?: string;
  prefix?: string;
  trailingIcon?: string;
  onTrailingIconPress?: () => void;
}

export const FormInput = memo<FormInputProps>(({
  label,
  iconName,
  error,
  prefix,
  trailingIcon,
  onTrailingIconPress,
  ...textInputProps
}) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>

      <View style={[styles.inputRow, Boolean(error) && styles.inputRowError]}>
        <Feather
          name={iconName as any}
          size={iconSize.sm}
          color={colors.textLight}
          style={styles.leadingIcon}
        />

        {prefix && (
          <>
            <AppText variant="body" style={styles.prefix}>
              {prefix}
            </AppText>
            <View style={styles.divider} />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textLight}
          {...textInputProps}
        />

        {trailingIcon && (
          <Feather
            name={trailingIcon as any}
            size={iconSize.sm}
            color={colors.textLight}
            onPress={onTrailingIconPress}
            style={styles.trailingIcon}
          />
        )}
      </View>

      <AnimatedErrorRow error={error} />
    </View>
  );
});

const createStyles = ({ spacing, colors, radius, typography }: AppTheme) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.md,
    },
    label: {
      color: colors.textLight,
      marginBottom: spacing.xs,
      letterSpacing: 0.5,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: radius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
    },
    inputRowError: {
      borderColor: colors.error,
    },
    leadingIcon: {
      marginRight: spacing.sm,
    },
    trailingIcon: {
      paddingLeft: spacing.sm,
    },
    divider: {
      width: 1,
      height: spacing.lg,
      backgroundColor: colors.border,
      marginRight: spacing.sm,
    },
    prefix: {
      color: colors.text,
      fontWeight: '600',
      marginRight:spacing.sm
    },
    input: {
      flex: 1,
      paddingVertical: spacing.md,
      fontSize: typography.fontSize.lg,
      color: colors.text,
    },
  });