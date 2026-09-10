import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';
import { AppTheme, useTheme, useThemedStyles } from '../../../theme';
import { useLoginForm } from '../hooks/useLoginForm';
import { ScreenHeader } from '../components/ScreenHeader';
import { AppText } from '../../../components/AppText';
import { FormInput } from '../components/FormInput';
import Button from '../../../components/Button';


const LoginScreen = () => {
  const styles = useThemedStyles(createStyles);
  const { colors, iconSize } = useTheme();

  const {
    formState,
    isLoading,
    updateField,
    togglePasswordVisibility,
    submitForm,
  } = useLoginForm();

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
            <ScreenHeader />

            <View style={styles.formCard}>
              <View style={styles.formHandle} />

              <AppText variant="h2" style={styles.welcomeText}>
                Welcome back
              </AppText>
              <AppText variant="body" style={styles.welcomeSubtext}>
                Sign in with your registered mobile number
              </AppText>

              {/* Mobile Number Field */}
              <FormInput
                label="MOBILE NUMBER"
                iconName="phone"
                prefix="+91"
                placeholder="9123456780"
                keyboardType="number-pad"
                maxLength={10}
                value={formState.values.username}
                onChangeText={(val) => updateField('username', val)}
                error={formState.errors.username}
                editable={!isLoading}
              />

              {/* Password Field */}
              <FormInput
                label="PASSWORD"
                iconName="lock"
                placeholder="Enter your password"
                secureTextEntry={!formState.showPassword}
                trailingIcon={formState.showPassword ? 'eye-off' : 'eye'}
                onTrailingIconPress={togglePasswordVisibility}
                value={formState.values.password}
                onChangeText={(val) => updateField('password', val)}
                error={formState.errors.password}
                editable={!isLoading}
              />

              <AppText variant="body" style={styles.forgotText}>
                Forgot Password?
              </AppText>

              <Button
                title="Send OTP & Sign In"
                onPress={submitForm}
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

const createStyles = ({ spacing, colors, radius, shadow, isLandscape, isTablet }: AppTheme) =>
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