import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useThemedStyles, AppTheme } from '../theme';
import { AppText } from './AppText';
import Button from './Button';
import { ErrorStateType, ERROR_STATES } from '../constants/errorStates';

type Props = {
  type: ErrorStateType;
  onRetry?: () => void;
  retryLabel?: string;
  retryLoading?: boolean;
};

const ErrorState: React.FC<Props> = ({
  type,
  onRetry,
  retryLabel = 'Try Again',
  retryLoading = false,
}) => {
  const styles = useThemedStyles(createStyles);
  const config = ERROR_STATES[type];

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    scale.setValue(0.85);

    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -8,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [type]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.iconWrap, { opacity: fade, transform: [{ scale }, { translateY: bounce }] }]}
      >
      <Ionicons name={config.icon as any} size={64} color={styles.iconColor.color} />
      </Animated.View>

      <Animated.View style={{ opacity: fade }}>
        <AppText variant="h2" color={styles.title.color} style={styles.title}>
          {config.title}
        </AppText>
      </Animated.View>

      <Animated.View style={{ opacity: fade }}>
        <AppText variant="body" color={styles.subtitle.color} style={styles.subtitle}>
          {config.subtitle}
        </AppText>
      </Animated.View>

      {onRetry && (
        <Animated.View style={[styles.buttonWrap, { opacity: fade }]}>
          <Button
            title={retryLabel}
            onPress={onRetry}
            loading={retryLoading}
            size="md"
            gradient="primary"
          />
        </Animated.View>
      )}
    </View>
  );
};

const createStyles = ({ spacing, colors, radius, shadow }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.background,
    },
    iconWrap: {
      width: spacing.xxl * 2,
      height: spacing.xxl * 2,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      ...shadow.sm,
    },
    iconColor: {
      color: colors.textLight,
    },
    title: {
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      color: colors.textLight,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
    buttonWrap: {
      marginTop: spacing.lg,
    },
  });

export default ErrorState;