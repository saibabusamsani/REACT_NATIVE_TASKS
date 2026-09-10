import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Feather from '@react-native-vector-icons/feather';
import { AppTheme, useThemedStyles } from '../../theme';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../../components/AppText';
import Button from '../../components/Button';
import { LoginPayload } from '../../types/auth.type';
import { useLoginEmployeeMutation } from '../../api/rtk/auth.api';
import { validateMobileNumber, validatePassword } from '../../utils/loginValidators';

type FieldName = keyof LoginPayload;
type FieldErrors = Partial<Record<FieldName, string>>;

// --- Smooth Dropdown Error Row Component ---
interface AnimatedErrorRowProps {
  error?: string;
  iconSize: number;
  colors: any;
  styles: any;
}

const AnimatedErrorRow: React.FC<AnimatedErrorRowProps> = ({ error, iconSize, colors, styles }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: error ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.back(1.2)), 
      useNativeDriver: false, 
    }).start();
  }, [error]);

  const heightInterpolate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24],
  });

  const opacityInterpolate = animValue.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1],
  });

  const translateYInterpolate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  return (
    <Animated.View
      style={{
        maxHeight: heightInterpolate,
        opacity: opacityInterpolate,
        transform: [{ translateY: translateYInterpolate }],
        overflow: 'hidden',
      }}
    >
      <View style={styles.errorRow}>
        <Feather name="alert-circle" size={iconSize} color={colors.error} />
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      </View>
    </Animated.View>
  );
};

// --- Smooth Dropdown Banner Component ---
interface AnimatedBannerProps {
  error?: string;
  iconSize: number;
  colors: any;
  styles: any;
}

const AnimatedBanner: React.FC<AnimatedBannerProps> = ({ error, iconSize, colors, styles }) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: error ? 1 : 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [error]);

  const heightInterpolate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 48],
  });

  const opacityInterpolate = animValue.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0, 1],
  });

  const translateYInterpolate = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-12, 0],
  });

  return (
    <Animated.View
      style={{
        maxHeight: heightInterpolate,
        opacity: opacityInterpolate,
        marginBottom: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 12],
        }),
        transform: [{ translateY: translateYInterpolate }],
        overflow: 'hidden',
      }}
    >
      <View style={styles.formErrorBanner}>
        <Feather name="alert-triangle" size={iconSize} color={colors.error} />
        <AppText variant="caption" style={styles.formErrorText}>
          {error}
        </AppText>
      </View>
    </Animated.View>
  );
};

// --- Main LoginScreen Component ---
const LoginScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, gradients, iconSize, isLandscape } = useTheme();
  const [login, { isLoading }] = useLoginEmployeeMutation();

  const [form, setForm] = useState<LoginPayload>({ username: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const onChangeField = (field: FieldName, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async () => {
    setFormError(undefined);

    const nextErrors: FieldErrors = {
      username: validateMobileNumber(form.username),
      password: validatePassword(form.password),
    };

    setErrors(nextErrors);
    if (nextErrors.username || nextErrors.password) return;

    try {
      await login(form).unwrap();
    } catch (err: any) {
      setFormError(err?.data?.message || err?.message || 'Unable to sign in. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flexOne}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <LinearGradient
              colors={gradients.primary as unknown as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.header}
            >
              <View style={styles.headerGlow} pointerEvents="none" />

              <View style={styles.brandRow}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <View style={styles.tgBadge}>
                  <AppText variant="h2" style={styles.tgText}>TG</AppText>
                </View>
              </View>

              <AppText variant="h1" style={styles.headerText}>TGHCL Contractor</AppText>
              <AppText variant="body" style={styles.headerSubtext}>
                Field App for on-site construction work
              </AppText>
            </LinearGradient>

            {/* Form */}
            <View style={styles.formCard}>
              <View style={styles.formHandle} />

              <AppText variant="h2" style={styles.welcomeText}>Welcome back</AppText>
              <AppText variant="body" style={styles.welcomeSubtext}>
                Sign in with your registered mobile number
              </AppText>

              {/* Animated Form Error Banner */}
              <AnimatedBanner
                error={formError}
                iconSize={iconSize.sm}
                colors={colors}
                styles={styles}
              />

              {/* Mobile Number Field */}
              <AppText variant="caption" style={styles.label}>MOBILE NUMBER</AppText>
              <View style={[styles.inputRow, errors.username && styles.inputRowError]}>
                <Feather name="phone" size={iconSize.sm} color={colors.textLight} style={styles.leadingIcon} />
                <AppText variant="body" style={styles.prefix}>+91</AppText>
                <View style={styles.divider} />
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={form.username}
                  onChangeText={(value) => onChangeField('username', value)}
                  placeholder="9123456780"
                  placeholderTextColor={colors.textLight}
                  maxLength={10}
                  editable={!isLoading}
                />
              </View>
              {/* Animated Field Error */}
              <AnimatedErrorRow
                error={errors.username}
                iconSize={iconSize.xs}
                colors={colors}
                styles={styles}
              />

              {/* Password Field */}
              <AppText variant="caption" style={styles.label}>PASSWORD</AppText>
              <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
                <Feather name="lock" size={iconSize.sm} color={colors.textLight} style={styles.leadingIcon} />
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={(value) => onChangeField('password', value)}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  editable={!isLoading}
                />
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={iconSize.sm}
                  color={colors.textLight}
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.trailingIcon}
                />
              </View>
              {/* Animated Field Error */}
              <AnimatedErrorRow
                error={errors.password}
                iconSize={iconSize.xs}
                colors={colors}
                styles={styles}
              />

              <AppText variant="body" style={styles.forgotText}>Forgot Password?</AppText>

              <Button
                title="Send OTP & Sign In"
                onPress={handleLogin}
                size="lg"
                loading={isLoading}
                loadingText="Signing in..."
                style={styles.signInBtn}
              />

              <View style={styles.footerRow}>
                <Feather name="shield" size={iconSize.xs} color={colors.textLight} />
                <AppText variant="caption" style={styles.footerText}>
                  Secure role-based access · Sri Balaji Constructions
                </AppText>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const createStyles = ({ spacing, colors, radius, typography, shadow, isLandscape, isTablet }: AppTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    flexOne: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      flexDirection: isLandscape ? 'row' : 'column',
    },

    // Header
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

    // Form card
    formCard: {
      flex: isLandscape ? (isTablet ? 6 : 5) : undefined,
      backgroundColor: colors.surface,
      marginTop: isLandscape ? 0 : -spacing.xl,
      marginHorizontal: isLandscape ? 0 : spacing.md,
      borderRadius: radius.xl,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
      alignSelf: isLandscape ? 'center' : undefined,
      width: isLandscape ? '100%' : undefined,
      maxWidth: isTablet || isLandscape ? 440 : undefined,
      justifyContent: isLandscape ? 'center' : undefined,
      ...shadow.lg,
    },
    formHandle: {
      alignSelf: 'center',
      width: spacing.xl,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      marginBottom: spacing.md,
      opacity: isLandscape ? 0 : 1,
    },
    welcomeText: {
      color: colors.text,
    },
    welcomeSubtext: {
      color: colors.textLight,
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    formErrorBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.error,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      gap: spacing.sm,
    },
    formErrorText: {
      color: colors.error,
      flex: 1,
    },
    label: {
      color: colors.textLight,
      marginBottom: spacing.xs,
      marginTop: spacing.md,
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
    },
    input: {
      flex: 1,
      paddingVertical: spacing.md,
      fontSize: typography.fontSize.lg,
      color: colors.text,
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xs,
      gap: spacing.xs,
    },
    errorText: {
      color: colors.error,
    },
    forgotText: {
      color: colors.primary,
      fontWeight: '600',
      textAlign: 'right',
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
    },
    signInBtn: {
      alignSelf: 'stretch',
      justifyContent: 'center',
      ...shadow.md,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
      gap: spacing.xs,
    },
    footerText: {
      color: colors.textLight,
      textAlign: 'center',
    },
  });