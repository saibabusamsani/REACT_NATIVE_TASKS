import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- COLOR PALETTE ---
const COLORS = {
  navy: '#12233F',
  navy2: '#1B3A6B',
  gold: '#B8862F',
  goldSoft: '#F3E7CE',
  teal: '#0F6E6E',
  tealSoft: '#E1F0EF',
  success: '#1E7B34',
  successSoft: '#E5F3E8',
  danger: '#B3261E',
  dangerSoft: '#FBE7E5',
  bg: '#F5F6F8',
  surface: '#FFFFFF',
  border: '#E1E4EA',
  text: '#171E2B',
  textMuted: '#5B6472',
  textFaint: '#8A93A3',
};

// --- MOCK DATA ---
const INITIAL_PROJECTS = [
  { id: 'TGHCL-PRJ-000124', ben: 'Ramulu Kondal', benVid: 'TGHCL-BEN-000124', district: 'Warangal', constituency: 'Warangal Rural', location: 'Ward 14', stage: 'Roof', physical: 65, financial: 52, currentLpc: 3, billStatus: 'AE Verification', paymentStatus: 'Pending', delayed: false, completed: false },
  { id: 'TGHCL-PRJ-000098', ben: 'Lakshmi Devi', benVid: 'TGHCL-BEN-000098', district: 'Karimnagar', constituency: 'Karimnagar Urban', location: 'Ward 7', stage: 'Finishing', physical: 88, financial: 75, currentLpc: 4, billStatus: 'Submitted', paymentStatus: 'Pending', delayed: false, completed: false },
  { id: 'TGHCL-PRJ-000145', ben: 'Yadagiri Rao', benVid: 'TGHCL-BEN-000145', district: 'Nalgonda', constituency: 'Nalgonda Rural', location: 'Ward 3', stage: 'Foundation', physical: 22, financial: 18, currentLpc: 1, billStatus: 'DE Review', paymentStatus: 'Pending', delayed: false, completed: false },
  { id: 'TGHCL-PRJ-000162', ben: 'Saroja Bai', benVid: 'TGHCL-BEN-000162', district: 'Khammam', constituency: 'Khammam Urban', location: 'Ward 9', stage: 'Plinth', physical: 40, financial: 30, currentLpc: 2, billStatus: 'Rejected', paymentStatus: 'Hold', delayed: true, completed: false },
  { id: 'TGHCL-PRJ-000178', ben: 'Chandra Reddy', benVid: 'TGHCL-BEN-000178', district: 'Adilabad', constituency: 'Adilabad Rural', location: 'Ward 5', stage: 'Plinth', physical: 45, financial: 38, currentLpc: 2, billStatus: 'AE Verified', paymentStatus: 'Pending', delayed: false, completed: false },
  { id: 'TGHCL-PRJ-000061', ben: 'Manohar Naik', benVid: 'TGHCL-BEN-000061', district: 'Hyderabad', constituency: 'Hyderabad Central', location: 'Ward 2', stage: 'Final Completion', physical: 100, financial: 100, currentLpc: 6, billStatus: 'Paid', paymentStatus: 'Paid', delayed: false, completed: true },
];

const INITIAL_BILLS = [
  { id: '1', billNo: 'BILL-2026-0410', projectId: 'TGHCL-PRJ-000124', milestone: 'Plinth', amount: 100000, stage: 'paid', date: '18 May 2026' },
  { id: '2', billNo: 'BILL-2026-0512', projectId: 'TGHCL-PRJ-000124', milestone: 'Roof', amount: 200000, stage: 'ae_verification', date: '10 Aug 2026' },
  { id: '3', billNo: 'BILL-2026-0498', projectId: 'TGHCL-PRJ-000098', milestone: 'Finishing', amount: 100000, stage: 'submitted', date: '15 Aug 2026' },
  { id: '4', billNo: 'BILL-2026-0470', projectId: 'TGHCL-PRJ-000145', milestone: 'Foundation', amount: 10000, stage: 'de_review', date: '02 Aug 2026' },
  { id: '5', billNo: 'BILL-2026-0455', projectId: 'TGHCL-PRJ-000162', milestone: 'Plinth', amount: 100000, stage: 'rejected', date: '28 Jul 2026', rejectReason: 'Photographic evidence insufficient — geotag missing on 2 of 4 images. Resubmit with complete geotagged evidence.' },
  { id: '6', billNo: 'BILL-2026-0501', projectId: 'TGHCL-PRJ-000178', milestone: 'Plinth', amount: 100000, stage: 'ae_verified', date: '09 Aug 2026' },
];

const BILL_STAGE_LABELS = {
  paid: 'Paid',
  ae_verification: 'AE Verification',
  submitted: 'Submitted',
  de_review: 'DE Review',
  rejected: 'Rejected',
  ae_verified: 'AE Verified',
};

const NOTIFS = [
  { title: 'Bill moved to E review', text: 'Roof bill BILL-2026-0512 (Warangal) has moved to E review after DE recommendation.', time: '1 day ago', read: false, type: 'approved' },
  { title: 'Bill rejected', text: 'BILL-2026-0455 (Khammam, Plinth) was rejected — geotag evidence insufficient.', time: '2 weeks ago', read: false, type: 'rejected' },
  { title: 'Field verification pending', text: 'BILL-2026-0512 (Warangal, Roof) is awaiting AE verification.', time: '3 days ago', read: true, type: 'pending' },
];

const TABS = [
  { key: 'dashboard', label: 'Dashboard', iconActive: 'grid', iconInactive: 'grid-outline' },
  { key: 'projects', label: 'Projects', iconActive: 'briefcase', iconInactive: 'briefcase-outline' },
  { key: 'bills', label: 'Bills', iconActive: 'receipt', iconInactive: 'receipt-outline' },
];

export default function App({ navigation }) {
  // Navigation & Auth State
  // Authentication now happens on the shared Login screen; this screen is only
  // reached after a successful login, so it starts authenticated.
  const [authState, setAuthState] = useState('authenticated'); // 'login' | 'otp' | 'authenticated'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobile, setMobile] = useState('9123456780');

  // OTP State & Focus Refs
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);

  // Data & Bottom Sheet States
  const [projects] = useState(INITIAL_PROJECTS);
  const [bills] = useState(INITIAL_BILLS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSheet, setActiveSheet] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  // Animations
  const sheetAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [authState, activeTab]);

  // Handle OTP Inputs
  const handleOtpChange = (text, index) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanText;
    setOtp(newOtp);

    if (cleanText && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  // Sheet Animations
  const openSheet = (project) => {
    setSelectedProject(project);
    setActiveSheet(true);
    Animated.spring(sheetAnim, {
      toValue: 0,
      friction: 8,
      tension: 45,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setActiveSheet(false));
  };

  // --- INTERNAL VIEWS ---
  const renderAuth = () => {
    if (authState === 'login') {
      return (
        <View style={styles.authBody}>
          <View style={styles.authHero}>
            <Text style={styles.heroTitle}>TGHCL Contractor</Text>
            <Text style={styles.heroSub}>Field App — Direct Access</Text>
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setAuthState('otp')}>
              <Text style={styles.primaryBtnText}>Get OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.authBody}>
        <View style={styles.authHero}>
          <Text style={styles.heroTitle}>Verify OTP</Text>
          <Text style={styles.heroSub}>Sent to +91 {mobile}</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => (otpInputs.current[idx] = ref)}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(val) => handleOtpChange(val, idx)}
                onKeyPress={(e) => handleOtpKeyPress(e, idx)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setAuthState('authenticated')}>
            <Text style={styles.primaryBtnText}>Verify & Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDashboard = () => (
    <ScrollView style={styles.scrollArea}>
      <Text style={styles.sectionLabel}>Projects Summary</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLbl}>Total Assigned</Text>
          <Text style={styles.kpiVal}>{projects.length}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLbl}>Active Works</Text>
          <Text style={[styles.kpiVal, { color: COLORS.teal }]}>3</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Current Work Items</Text>
      {projects.map((p) => (
        <TouchableOpacity key={p.id} style={styles.card} onPress={() => openSheet(p)}>
          <View style={styles.rowBetween}>
            <Text style={styles.pid}>{p.id}</Text>
            <View style={[styles.badge, p.delayed ? styles.badgeDanger : styles.badgeTeal]}>
              <Text style={styles.badgeText}>{p.delayed ? 'Delayed' : 'Active'}</Text>
            </View>
          </View>
          <Text style={styles.bName}>{p.ben}</Text>
          <Text style={styles.subText}>{p.district} • {p.location} • Stage: {p.stage}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderProjects = () => (
    <ScrollView style={styles.scrollArea}>
      <Text style={styles.sectionLabel}>All Projects</Text>
      {projects.map((p) => (
        <TouchableOpacity key={p.id} style={styles.card} onPress={() => openSheet(p)}>
          <View style={styles.rowBetween}>
            <Text style={styles.pid}>{p.id}</Text>
            <Text style={styles.subText}>{p.district}</Text>
          </View>
          <Text style={styles.bName}>{p.ben}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Progress</Text>
              <Text style={[styles.label, { color: COLORS.navy }]}>{p.physical}%</Text>
            </View>
            <View style={styles.trackBar}>
              <View style={[styles.fillBar, { width: `${p.physical}%` }]} />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderBills = () => (
    <ScrollView style={styles.scrollArea}>
      <Text style={styles.sectionLabel}>Billing Status</Text>
      {bills.map((b) => (
        <View key={b.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.pid}>{b.billNo}</Text>
            <View style={[styles.badge, b.stage === 'paid' ? styles.badgeSuccess : b.stage === 'rejected' ? styles.badgeDanger : styles.badgeGold]}>
              <Text style={styles.badgeText}>{(BILL_STAGE_LABELS[b.stage] || b.stage).toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.bName}>₹{b.amount.toLocaleString('en-IN')}</Text>
          <Text style={styles.subText}>{b.projectId} • {b.milestone} • {b.date}</Text>
          {b.rejectReason ? (
            <Text style={[styles.subText, { color: COLORS.danger, marginTop: 6 }]}>{b.rejectReason}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

        {authState !== 'authenticated' ? (
          renderAuth()
        ) : (
          <Animated.View style={[styles.mainShell, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>TGHCL Workspace</Text>
                <Text style={styles.headerSub}>Sri Balaji Constructions</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <TouchableOpacity onPress={() => setShowNotifs(true)} style={{ position: 'relative' }}>
                  <Ionicons name="notifications-outline" size={20} color="#fff" />
                  {NOTIFS.some((n) => !n.read) && <View style={styles.notifDot} />}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setAuthState('login');
                  if (navigation && navigation.replace) navigation.replace('Login');
                }}>
                  <Text style={styles.logoutBtn}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Views */}
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'bills' && renderBills()}

            {/* Bottom Tabs */}
            <View style={styles.tabBar}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={styles.tabItem}
                    onPress={() => setActiveTab(tab.key)}
                  >
                    <Ionicons
                      name={isActive ? tab.iconActive : tab.iconInactive}
                      size={22}
                      color={isActive ? COLORS.navy2 : COLORS.textFaint}
                    />
                    <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Modal Overlay Sheet */}
        {activeSheet && (
          <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{selectedProject?.ben}</Text>
              <TouchableOpacity onPress={closeSheet}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.sheetContent}>
              <Text style={styles.label}>Project ID</Text>
              <Text style={styles.pid}>{selectedProject?.id}</Text>
              <Text style={[styles.label, { marginTop: 12 }]}>District & Ward</Text>
              <Text style={styles.bName}>
                {selectedProject?.district} • {selectedProject?.location}
              </Text>
              <TouchableOpacity style={[styles.primaryBtn, { marginTop: 24 }]} onPress={closeSheet}>
                <Text style={styles.primaryBtnText}>Confirm Inspection</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        {/* Notifications Overlay */}
        {showNotifs && (
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifs(false)}>
                <Text style={styles.closeBtn}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.sheetContent}>
              {NOTIFS.map((n, idx) => (
                <View key={idx} style={[styles.card, !n.read && { borderColor: COLORS.navy2, backgroundColor: '#F5F8FC' }]}>
                  <Text style={styles.bName}>{n.title}</Text>
                  <Text style={[styles.subText, { marginTop: 4 }]}>{n.text}</Text>
                  <Text style={[styles.subText, { marginTop: 8, color: COLORS.textFaint }]}>{n.time}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  mainShell: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  authBody: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  authHero: {
    backgroundColor: COLORS.navy,
    padding: 24,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  heroSub: {
    fontSize: 13,
    color: COLORS.textFaint,
    marginTop: 4,
  },
  formContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.navy,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  headerSub: {
    fontSize: 11,
    color: COLORS.textFaint,
  },
  logoutBtn: {
    color: COLORS.goldSoft,
    fontWeight: '700',
    fontSize: 13,
  },
  scrollArea: {
    flex: 1,
    padding: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textFaint,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
    color: COLORS.text,
  },
  primaryBtn: {
    height: 48,
    backgroundColor: COLORS.navy2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 44,
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
  },
  kpiLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  kpiVal: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.navy,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pid: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.navy,
  },
  bName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  subText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  trackBar: {
    height: 6,
    backgroundColor: COLORS.bg,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  fillBar: {
    height: '100%',
    backgroundColor: COLORS.gold,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  badgeTeal: { backgroundColor: COLORS.tealSoft },
  badgeGold: { backgroundColor: COLORS.goldSoft },
  badgeSuccess: { backgroundColor: COLORS.successSoft },
  badgeDanger: { backgroundColor: COLORS.dangerSoft },
  notifDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger, borderWidth: 1.5, borderColor: COLORS.navy },
  badgeText: { fontSize: 10, fontWeight: '700' },
  tabBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textFaint,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.navy2,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.6,
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  sheetContent: {
    padding: 16,
  },
  closeBtn: {
    color: COLORS.danger,
    fontWeight: '700',
  },
});