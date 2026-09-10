import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { useTheme, useThemedStyles, AppTheme } from '../theme';
import { AppText } from '../components/AppText';

const SplashScreen = () => {
  const { isLandscape } = useTheme();
  const styles = useThemedStyles(createStyles);

  // Initialized at 1 to seamlessly match the size and opacity of native BootSplash
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, iconSizeValue * 4.5],
  });

  useEffect(() => {
    progressAnim.setValue(0);

    // Fade in title, subtitle, and progress bar smoothly
    Animated.timing(contentFade, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Progress bar looping animation
    const progressLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );

    progressLoop.start();

    return () => {
      progressLoop.stop();
      progressAnim.stopAnimation();
    };
  }, [contentFade, progressAnim]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.mainContent,
          {
            flexDirection: isLandscape ? 'row' : 'column',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoCard,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Animated.Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: contentFade,
            },
          ]}
        >
          <AppText variant="h2" style={styles.titleText}>
            Telangana Housing Corporation Limited
          </AppText>

          <AppText variant="caption" style={styles.subtitleText}>
            Contractor & Field Monitoring App
          </AppText>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

export default SplashScreen;

const iconSizeValue = 40 * 2.5;

const createStyles = ({ spacing, colors, radius, shadow, iconSize }: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainContent: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    logoCard: {
      width: 160,
      height: 160,
      backgroundColor: colors.surface,
      borderRadius: radius.full, // Matches circular shape of the TGHCL emblem
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xs,
      marginBottom: spacing.xl,
      ...shadow.lg,
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    textContainer: {
      alignItems: 'center',
    },
    titleText: {
      color: colors.surface,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    subtitleText: {
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: spacing.xxl,
    },
    progressTrack: {
      width: iconSize.xl * 4.5,
      height: spacing.xs,
      backgroundColor: 'rgba(236, 202, 202, 0.25)',
      borderRadius: radius.full,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: colors.accent,
      borderRadius: radius.full,
    },
  });