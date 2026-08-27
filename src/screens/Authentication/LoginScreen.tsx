import { View, ScrollView, StyleSheet, TextInput } from 'react-native';
import React, { useState, useRef } from 'react';
import { useTheme, useThemedStyles, AppTheme } from '../../theme';
import { AppText } from '../../components/AppText';
import Button from '../../components/Button';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const LoginScreen = () => {
  const { colors, spacing, isLandscape } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const phoneInputRef = useRef<TextInput>(null);

  const handleSendOTP = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to OTP screen
    }, 1500);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.contentWrapper}>

        {/* Header */}
        <View style={styles.header}>
          <AppText variant="h1" style={styles.title}>Secure Login</AppText>
          <AppText variant="body" style={styles.subtitle}>Sign in to your account to continue</AppText>
        </View>

        {/* Form */}
        <View style={styles.form}>

          <AppText variant="body" style={styles.label}>Mobile Number</AppText>

          <View style={[
            styles.inputContainer,
            { borderColor: isFocused ? colors.primary : colors.border }
          ]}>
            <Ionicons
              name="call-outline"
              size={spacing.md + 4} // 20pt equivalent, pulled from spacing scale
              color={isFocused ? colors.primary : colors.textLight}
            />
            <TextInput
              ref={phoneInputRef}
              style={styles.input}
              placeholder="+91 Enter your number"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={15}
              editable={!loading}
            />
          </View>

          <Button
            title="Send OTP"
            onPress={handleSendOTP}
            loading={loading}
            loadingText="Sending..."
            size={isLandscape ? 'sm' : 'md'}
            style={styles.button}
          />

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <AppText variant="caption" style={styles.legalText}>
            By continuing, you agree to our{'\n'}
            <AppText variant="caption" style={styles.legalLink}>Terms of Service</AppText>
            {' '}and{' '}
            <AppText variant="caption" style={styles.legalLink}>Privacy Policy</AppText>
          </AppText>
        </View>

      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const createStyles = ({ spacing, colors, isLandscape, typography, radius }: AppTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flexGrow: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
      justifyContent: 'center',
    },
    contentWrapper: {
      maxWidth: isLandscape ? 500 : undefined,
      alignSelf: 'center',
      width: '100%',
      gap: spacing.xl,
    },
    header: {
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.fontSize.xxxl,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.fontSize.md,
      color: colors.textLight,
      textAlign: 'center',
      lineHeight: typography.lineHeight.lg,
    },
    form: {
      gap: spacing.lg,
      paddingHorizontal: isLandscape ? spacing.xl : 0,
    },
    label: {
      fontSize: typography.fontSize.md,
      fontWeight: '500',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
      height: spacing.xxl,
      gap: spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: typography.fontSize.md,
      fontFamily: typography.fontFamily.regular,
      color: colors.text,
      paddingVertical: 0,
    },
    button: {
      marginTop: spacing.md,
    },
    footer: {
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    legalText: {
      color: colors.textLight,
      lineHeight: typography.lineHeight.md,
      textAlign: 'center',
      fontSize: typography.fontSize.sm,
    },
    legalLink: {
      color: colors.primary,
      fontWeight: '600',
    },
  });