import React, { memo, useRef, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Feather from '@react-native-vector-icons/feather';

import { useThemedStyles, useTheme, AppTheme } from '../../../theme';
import { AppText } from '../../../components/AppText';

interface AnimatedErrorRowProps {
  error?: string;
}

export const AnimatedErrorRow = memo<AnimatedErrorRowProps>(({ error }) => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: error ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.back(1.1)),
      useNativeDriver: false,
    }).start();
  }, [error, animValue]);

  const animatedStyle: StyleProp<ViewStyle> = {
    maxHeight: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 24],
    }),
    opacity: animValue.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0, 0, 1],
    }),
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 0],
        }),
      },
    ],
    overflow: 'hidden',
  };

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.errorRow}>
        <Feather name="alert-circle" size={iconSize.xs} color={colors.error} />
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      </View>
    </Animated.View>
  );
});

const createStyles = ({ spacing, colors }: AppTheme) =>
  StyleSheet.create({
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
      gap: spacing.xs,
    },
    errorText: {
      color: colors.error,
    },
  });