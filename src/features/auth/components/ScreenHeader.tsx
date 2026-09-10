import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useThemedStyles, useTheme, AppTheme } from '../../../theme';
import { AppText } from '../../../components/AppText';

export const ScreenHeader = memo(() => {
  const styles = useThemedStyles(createStyles);
  const { gradients } = useTheme();

  return (
    <LinearGradient
      colors={gradients.primary as unknown as string[]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerGlow} pointerEvents="none" />

      <View style={styles.brandRow}>
        <Image source={require('../../../assets/logo.png')} style={styles.logo} />
        <View style={styles.tgBadge}>
          <AppText variant="h2" style={styles.tgText}>
            TG
          </AppText>
        </View>
      </View>

      <AppText variant="h1" style={styles.headerText}>
        TGHCL Contractor
      </AppText>
      <AppText variant="body" style={styles.headerSubtext}>
        Field App for on-site construction work
      </AppText>
    </LinearGradient>
  );
});

const createStyles = ({ spacing, colors, radius, shadow, isLandscape, isTablet }: AppTheme) =>
  StyleSheet.create({
    header: {
      flex: isLandscape ? (isTablet ? 5 : 4) : undefined,
      minHeight: isLandscape ? undefined : 240,
      paddingTop: spacing.xxl,
      paddingHorizontal: spacing.xl,
      paddingBottom: isLandscape ? spacing.xl : spacing.xxl + spacing.xl,
      justifyContent: isLandscape ? 'center' : 'flex-end',
      borderBottomLeftRadius: isLandscape ? 0 : radius.xl,
      borderBottomRightRadius: radius.xl,
      borderTopRightRadius: isLandscape ? radius.xl : 0,
      overflow: 'hidden',
    },
    headerGlow: {
      position: 'absolute',
      top: -80,
      right: -60,
      width: 220,
      height: 220,
      borderRadius: radius.full,
      backgroundColor: colors.white,
      opacity: 0.06,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    logo: {
      width: spacing.xxl + spacing.md,
      height: spacing.xxl + spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.white,
      marginRight: spacing.sm,
      ...shadow.md,
    },
    tgBadge: {
      width: spacing.xxl + spacing.md,
      height: spacing.xxl + spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.accent,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadow.md,
    },
    tgText: {
      color: colors.white,
      fontWeight: '700',
    },
    headerText: {
      color: colors.textInverse,
    },
    headerSubtext: {
      color: colors.textInverse,
      opacity: 0.8,
      marginTop: spacing.xs,
      maxWidth: isLandscape ? '80%' : '90%',
    },
  });