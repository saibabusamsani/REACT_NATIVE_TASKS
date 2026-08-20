import React, { useState, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  navyDark: '#0A1322',
  navy: '#12233F',
  navySecondary: '#1B3A6B',
  gold: '#B8862F',
  goldSoft: '#FDF8EC',
  teal: '#0F6E6E',
  danger: '#B3261E',
  dangerSoft: '#FBE7E5',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
};

export default function Login({ navigation }) {
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const otpInputs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleOtpChange = (text, index) => {
    const clean = text.replace(/[^0-9]/g, '');
    const next = [...otp];
    next[index] = clean;
    setOtp(next);
    setError('');
    if (clean && index < 5) otpInputs.current[index + 1]?.focus();
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Enter the full 6-digit code.');
      return;
    }
    // 123456 routes to the Beneficiary app; any other code routes to the Contractor app.
    if (code === '123456') {
      navigation.replace('Beneficiary');
    } else {
      navigation.replace('Contr');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />
      <View style={styles.heroContainer}>
        <View style={styles.crestBadge}>
          <Text style={styles.crestText}>TG</Text>
        </View>
        <Text style={styles.title}>TGHCL Housing Portal</Text>
        <Text style={styles.subtitle}>Telangana Gruha Kalyan Lakshmi</Text>
      </View>

      <View style={styles.contentContainer}>
        {step === 'login' && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.inputLabel}>Registered Mobile Number</Text>
            <View style={styles.inputFieldWrap}>
              <Text style={styles.inputPrefix}>+91</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={10}
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>
            <Text style={styles.helperText}>An OTP will be dispatched for secure verification.</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => setStep('otp')}
            >
              <Text style={styles.primaryButtonText}>Send One-Time Password</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === 'otp' && (
          <View>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <Text style={styles.helperText}>Sent to +91 {mobileNumber}</Text>
            <View style={styles.otpInputGrid}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => (otpInputs.current[i] = ref)}
                  style={styles.otpBox}
                  maxLength={1}
                  keyboardType="numeric"
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, i)}
                  onKeyPress={(e) => handleOtpKeyPress(e, i)}
                />
              ))}
            </View>
            {!!error && <Text style={styles.errorText}>{error}</Text>}
            <Text style={styles.hintText}>
              Tip: enter 123456 for the Beneficiary app, any other code for the Contractor app.
            </Text>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={handleVerify}>
              <Text style={styles.primaryButtonText}>Verify & Proceed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setStep('login'); setOtp(['', '', '', '', '', '']); setError(''); }}>
              <Text style={styles.secondaryButtonText}>Change Phone Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.navyDark },
  heroContainer: { padding: 28, backgroundColor: COLORS.navySecondary },
  crestBadge: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center' },
  crestText: { fontWeight: '800', color: COLORS.navyDark, fontSize: 18 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 14 },
  subtitle: { color: '#AFC0DA', fontSize: 13, marginTop: 4 },
  contentContainer: { flex: 1, padding: 24, backgroundColor: '#F8FAFC', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -12 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: COLORS.textSecondary, textTransform: 'uppercase', marginBottom: 6 },
  inputFieldWrap: { flexDirection: 'row', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.surface, height: 48, alignItems: 'center' },
  inputPrefix: { paddingHorizontal: 14, fontWeight: '700', color: COLORS.textSecondary, borderRightWidth: 1, borderRightColor: COLORS.border },
  textInput: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 16, color: COLORS.textPrimary },
  helperText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  hintText: { fontSize: 11, color: COLORS.textMuted, marginTop: 10, fontStyle: 'italic' },
  errorText: { fontSize: 12, color: COLORS.danger, marginTop: 6, fontWeight: '600' },
  primaryButton: { backgroundColor: COLORS.navySecondary, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryButton: { height: 44, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  secondaryButtonText: { color: COLORS.navySecondary, fontWeight: '700' },
  otpInputGrid: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  otpBox: { width: 44, height: 48, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 8, textAlign: 'center', fontSize: 18, fontWeight: '700', backgroundColor: COLORS.surface },
});