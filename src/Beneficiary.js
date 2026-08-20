import React, { useState, useRef, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
  Easing,
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context"

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ==========================================
// DESIGN SYSTEM TOKENS
// ==========================================
const COLORS = {
  navyDark: '#0A1322',
  navy: '#12233F',
  navySecondary: '#1B3A6B',
  navyAccent: '#2C5090',
  gold: '#B8862F',
  goldSoft: '#FDF8EC',
  teal: '#0F6E6E',
  tealSoft: '#EBF6F6',
  success: '#166534',
  successSoft: '#DCFCE7',
  warning: '#9A3412',
  warningSoft: '#FFEDD5',
  danger: '#991B1B',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
};

// ==========================================
// MOCK DATA
// ==========================================
const INITIAL_LPC_STAGES = [
  { n: 1, amount: '₹10,000', stage: 'Foundation', status: 'done', date: '03 Mar 2026', eligibility: 'Met', verification: 'Verified', approval: 'Approved', payment: 'Paid', receipt: 'TGHCL-TXN-88231' },
  { n: 2, amount: '₹1,00,000', stage: 'Plinth', status: 'done', date: '04 Jun 2026', eligibility: 'Met', verification: 'Verified', approval: 'Approved', payment: 'Paid', receipt: 'TGHCL-TXN-88474' },
  { n: 3, amount: '₹2,00,000', stage: 'Roof', status: 'current', date: 'Verification Pending', eligibility: 'Met', verification: 'AE Verification Pending', approval: 'Pending', payment: 'Due', receipt: null },
  { n: 4, amount: '₹1,00,000', stage: 'Finishing', status: 'upcoming', date: 'Scheduled', eligibility: 'Not yet', verification: '—', approval: '—', payment: 'Upcoming', receipt: null },
  { n: 5, amount: '₹2,00,000', stage: 'Final Completion', status: 'upcoming', date: 'Scheduled', eligibility: 'Not yet', verification: '—', approval: '—', payment: 'Upcoming', receipt: null },
  { n: 6, amount: 'TBC', stage: 'Amount to be configured', status: 'tbc', date: 'Pending', eligibility: 'Not yet', verification: '—', approval: '—', payment: 'Upcoming', receipt: null },
];

const DOCUMENTS_LIST = [
  { id: '1', name: 'Aadhaar Card', type: 'Identity Document', status: 'Verified', date: '10 Jan 2026' },
  { id: '2', name: 'Ration Card', type: 'Address Document', status: 'Verified', date: '10 Jan 2026' },
  { id: '3', name: 'Income Certificate', type: 'Income Document', status: 'Verified', date: '14 Jan 2026' },
  { id: '4', name: 'Allotment Letter', type: 'Allotment Document', status: 'Verified', date: '02 Feb 2026' },
  { id: '5', name: 'Bank Passbook Copy', type: 'Bank Document', status: 'Pending', date: '—' },
];

const PHOTOS_LIST = [
  { stage: 'Foundation', date: '27 Mar 2026', time: '4:02 PM', loc: 'Warangal Rural, Ward 14', verifiedBy: 'AE — S. Naveen Reddy' },
  { stage: 'Plinth', date: '18 May 2026', time: '11:20 AM', loc: 'Warangal Rural, Ward 14', verifiedBy: 'AE — S. Naveen Reddy' },
  { stage: 'Roof', date: '14 Aug 2026', time: '3:10 PM', loc: 'Warangal Rural, Ward 14', verifiedBy: 'Pending AE review' },
];

const NOTIFS_LIST = [
  { type: 'payment', title: 'LPC 3 verification pending', text: 'Roof stage photos submitted by contractor; awaiting AE field verification.', time: '2 days ago', read: false },
  { type: 'progress', title: 'Roof casting completed', text: 'Physical progress updated to 65% following site inspection.', time: '6 days ago', read: false },
  { type: 'milestone', title: 'LPC 2 payment released', text: '₹1,00,000 released for Plinth milestone.', time: '04 Jun 2026', read: true },
  { type: 'payment', title: 'Payment successful', text: 'LPC 2 installment of ₹1,00,000 received.', time: '04 Jun 2026', read: true },
  { type: 'announce', title: 'TGHCL Announcement', text: 'Scheme documentation window extended till 30 Sep 2026.', time: '1 week ago', read: true },
];

const TABS = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'house', label: 'My House', icon: '🏗️' },
  { key: 'progress', label: 'Progress', icon: '📊' },
  { key: 'payments', label: 'Payments', icon: '💳' },
  { key: 'more', label: 'More', icon: '⚙️' },
];

// ==========================================
// REUSABLE ANIMATED UI COMPONENTS
// ==========================================

// Animated Progress Bar
const AnimatedProgressBar = ({ progress, color = COLORS.gold }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.barTrack}>
      <Animated.View style={[styles.barFill, { width: widthInterpolated, backgroundColor: color }]} />
    </View>
  );
};

// Custom Badge
const Badge = ({ text, type = 'neutral' }) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'success':
        return { bg: COLORS.successSoft, text: COLORS.success };
      case 'warning':
        return { bg: COLORS.warningSoft, text: COLORS.warning };
      case 'teal':
        return { bg: COLORS.tealSoft, text: COLORS.teal };
      default:
        return { bg: COLORS.border, text: COLORS.textSecondary };
    }
  };

  const style = getBadgeStyle();
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: style.text }]} />
      <Text style={[styles.badgeText, { color: style.text }]}>{text}</Text>
    </View>
  );
};

// Animated Custom Tab Bar
const AnimatedTabBar = ({ activeTab, onTabPress }) => {
  const activeIndex = TABS.findIndex((t) => t.key === activeTab);
  const tabWidth = SCREEN_WIDTH / TABS.length;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      friction: 8,
      tension: 68,
    }).start();
  }, [activeIndex]);

  return (
    <View style={styles.tabbarContainer}>
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            width: tabWidth - 16,
            transform: [{ translateX }],
          },
        ]}
      />
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => onTabPress(tab.key)}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function Beneficiary({ navigation }) {
  // Navigation & Authentication States
  // Authentication now happens on the shared Login screen; this screen is only
  // reached after a successful login, so it starts authenticated.
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authStep, setAuthStep] = useState('login'); // 'login' | 'otp' | 'vid'
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [activeTab, setActiveTab] = useState('home');
  const [currentSubScreen, setCurrentSubScreen] = useState(null); // 'documents' | 'notifications'

  // Payment State Machine
  const [isPayModalVisible, setPayModalVisible] = useState(false);
  const [payStep, setPayStep] = useState('review'); // 'review' | 'processing' | 'success'
  const [lpcStages, setLpcStages] = useState(INITIAL_LPC_STAGES);

  // Tab Cross-Fade Animation Reference
  const screenFadeAnim = useRef(new Animated.Value(1)).current;

  const handleTabSwitch = (tabKey) => {
    if (tabKey === activeTab && !currentSubScreen) return;
    setCurrentSubScreen(null);

    Animated.sequence([
      Animated.timing(screenFadeAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(tabKey);
  };

  const handleConfirmPayment = () => {
    setPayStep('processing');
    setTimeout(() => {
      setPayStep('success');
      setLpcStages((prev) =>
        prev.map((item) => (item.n === 3 ? { ...item, status: 'done', date: 'Just now' } : item))
      );
    }, 1800);
  };

  // --- AUTHENTICATION SCREEN ---
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.authSafeArea} edges={["top","bottom"]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navyDark} />
        <View style={styles.authHeroContainer}>
          <View style={styles.authCrestBadge}>
            <Text style={styles.authCrestText}>TG</Text>
          </View>
          <Text style={styles.authTitle}>TGHCL Beneficiary</Text>
          <Text style={styles.authSubtitle}>Telangana Gruha Kalyan Lakshmi — Housing Portal</Text>
        </View>

        <View style={styles.authContentContainer}>
          {authStep === 'login' && (
            <View>
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
                onPress={() => setAuthStep('otp')}
              >
                <Text style={styles.primaryButtonText}>Send One-Time Password</Text>
              </TouchableOpacity>
            </View>
          )}

          {authStep === 'otp' && (
            <View>
              <Text style={styles.inputLabel}>Verification Code</Text>
              <Text style={styles.helperText}>Sent to +91 {mobileNumber}</Text>
              <View style={styles.otpInputGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <TextInput key={i} style={styles.otpBox} maxLength={1} keyboardType="numeric" />
                ))}
              </View>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={() => setAuthStep('vid')}
              >
                <Text style={styles.primaryButtonText}>Verify & Proceed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setAuthStep('login')}>
                <Text style={styles.secondaryButtonText}>Change Phone Number</Text>
              </TouchableOpacity>
            </View>
          )}

          {authStep === 'vid' && (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.verifiedIconWrap}>
                <Text style={{ fontSize: 28 }}>✓</Text>
              </View>
              <Text style={styles.cardHeaderTitle}>Identity Verified</Text>
              <Text style={styles.helperText}>Authenticated via Secure Virtual ID</Text>

              <View style={[styles.card, { width: '100%', marginVertical: 20 }]}>
                <Text style={styles.inputLabel}>Virtual ID</Text>
                <Text style={styles.monoValue}>TGHCL-BEN-000124</Text>
                <View style={styles.divider} />
                <Text style={styles.inputLabel}>Beneficiary Name</Text>
                <Text style={styles.cardHeaderTitle}>Ramulu Kondal</Text>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, { width: '100%' }]}
                activeOpacity={0.85}
                onPress={() => setIsAuthenticated(true)}
              >
                <Text style={styles.primaryButtonText}>Enter Housing Dashboard</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // --- SUB-SCREEN RENDERING ---
  if (currentSubScreen === 'documents') {
    return (
      <SafeAreaView style={styles.appSafeArea} edges={["top","bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setCurrentSubScreen(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>My Documents</Text>
        </View>
        <ScrollView style={styles.contentArea}>
          {DOCUMENTS_LIST.map((doc) => (
            <View key={doc.id} style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.cardHeaderTitle}>{doc.name}</Text>
                  <Text style={styles.helperText}>{doc.type} • {doc.date}</Text>
                </View>
                <Badge text={doc.status} type={doc.status === 'Verified' ? 'success' : 'warning'} />
              </View>
              <View style={styles.cardActionRow}>
                <TouchableOpacity
                  style={styles.cardOutlineBtn}
                  onPress={() => {}}
                >
                  <Text style={styles.cardOutlineBtnText}>{doc.status === 'Verified' ? 'View Document' : 'Upload Document'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentSubScreen === 'notifications') {
    return (
      <SafeAreaView style={styles.appSafeArea} edges={["top","bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setCurrentSubScreen(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>System Notifications</Text>
        </View>
        <ScrollView style={styles.contentArea}>
          {NOTIFS_LIST.map((item, idx) => (
            <View key={idx} style={[styles.card, !item.read && { borderColor: COLORS.navyAccent, backgroundColor: '#F7FAFE' }]}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardHeaderTitle}>{item.title}</Text>
                <Badge
                  text={item.type === 'payment' ? 'Financial' : item.type === 'progress' ? 'Update' : item.type === 'milestone' ? 'Milestone' : 'Notice'}
                  type={item.type === 'payment' ? 'teal' : item.type === 'progress' ? 'warning' : 'neutral'}
                />
              </View>
              <Text style={[styles.helperText, { marginTop: 4 }]}>{item.text}</Text>
              <Text style={[styles.helperText, { marginTop: 8, color: COLORS.textMuted }]}>{item.time}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentSubScreen === 'photos') {
    return (
      <SafeAreaView style={styles.appSafeArea} edges={["top","bottom"]}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setCurrentSubScreen(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Site Photos</Text>
        </View>
        <ScrollView style={styles.contentArea}>
          {PHOTOS_LIST.map((p, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardHeaderTitle}>{p.stage} Stage</Text>
                <Badge text={p.verifiedBy.startsWith('Pending') ? 'Pending' : 'Verified'} type={p.verifiedBy.startsWith('Pending') ? 'warning' : 'success'} />
              </View>
              <Text style={[styles.helperText, { marginTop: 4 }]}>{p.loc}</Text>
              <Text style={[styles.helperText, { marginTop: 4 }]}>{p.date} • {p.time}</Text>
              <Text style={[styles.helperText, { marginTop: 8, color: COLORS.navyAccent, fontWeight: '600' }]}>{p.verifiedBy}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- MAIN TAB SHELL ---
  return (
    <SafeAreaView style={styles.appSafeArea} edges={["top","bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* TOP BAR */}
      <View style={styles.topbarHeader}>
        <View>
          <Text style={styles.topbarGreeting}>Namaste, Ramulu</Text>
          <Text style={styles.topbarSub}>ID: TGHCL-BEN-000124</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentSubScreen('notifications')}>
          <Text style={{ fontSize: 16 }}>🔔</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* ANIMATED MAIN SCREEN CONTENT */}
      <Animated.View style={[styles.contentArea, { opacity: screenFadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <>
              <View style={styles.heroCard}>
                <View style={styles.rowBetween}>
                  <Text style={styles.heroEyebrow}>Housing Project</Text>
                  <View style={styles.heroChip}>
                    <Text style={styles.heroChipText}>Roof Stage</Text>
                  </View>
                </View>
                <Text style={styles.heroTitle}>TGHCL-PRJ-000124</Text>
                <Text style={styles.heroMetaText}>Location: Warangal Rural, Ward 14</Text>

                <View style={{ marginTop: 16 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.heroProgressText}>Physical Completion</Text>
                    <Text style={styles.heroProgressVal}>65%</Text>
                  </View>
                  <AnimatedProgressBar progress={65} color={COLORS.gold} />
                </View>

                <View style={{ marginTop: 12 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.heroProgressText}>Financial Disbursement</Text>
                    <Text style={styles.heroProgressVal}>52%</Text>
                  </View>
                  <AnimatedProgressBar progress={52} color={COLORS.teal} />
                </View>
              </View>

              <Text style={styles.sectionTitle}>Financial Breakdown</Text>
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Total Sanctioned</Text>
                  <Text style={styles.kpiValue}>₹6,10,000</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Released</Text>
                  <Text style={[styles.kpiValue, { color: COLORS.teal }]}>₹1,10,000</Text>
                </View>
              </View>

              <View style={[styles.card, styles.rowBetween, { marginTop: 12 }]}>
                <View>
                  <Text style={styles.inputLabel}>Next Installment Due</Text>
                  <Text style={styles.cardHeaderTitle}>LPC 3 — ₹2,00,000</Text>
                </View>
                <Badge text="Verification Due" type="warning" />
              </View>
            </>
          )}

          {/* TAB 2: MY HOUSE */}
          {activeTab === 'house' && (
            <>
              <Text style={styles.sectionTitle}>Stage Milestone Tracker (6 LPCs)</Text>
              <View style={styles.card}>
                {lpcStages.map((item) => (
                  <View key={item.n} style={styles.lpcTimelineNode}>
                    <View
                      style={[
                        styles.lpcStatusDot,
                        item.status === 'done' && styles.lpcStatusDotDone,
                        item.status === 'current' && styles.lpcStatusDotCurrent,
                      ]}
                    >
                      <Text style={{ color: item.status === 'upcoming' ? COLORS.textMuted : '#fff', fontWeight: 'bold' }}>
                        {item.status === 'done' ? '✓' : item.n}
                      </Text>
                    </View>
                    <View style={styles.lpcContentBox}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.cardHeaderTitle}>LPC {item.n}: {item.stage}</Text>
                        <Text style={styles.monoValue}>{item.amount}</Text>
                      </View>
                      <View style={[styles.rowBetween, { marginTop: 6 }]}>
                        <Text style={styles.helperText}>{item.date}</Text>
                        <Badge
                          text={item.status === 'done' ? 'Disbursed' : item.status === 'current' ? 'Under Review' : 'Upcoming'}
                          type={item.status === 'done' ? 'success' : item.status === 'current' ? 'warning' : 'neutral'}
                        />
                      </View>
                      {item.status !== 'upcoming' && item.status !== 'tbc' && (
                        <Text style={[styles.helperText, { marginTop: 4 }]}>
                          Verification: {item.verification} · Approval: {item.approval}
                        </Text>
                      )}
                      {item.receipt && (
                        <Text style={[styles.helperText, { marginTop: 2, color: COLORS.navyAccent, fontWeight: '600' }]}>
                          Receipt: {item.receipt}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* TAB 3: PROGRESS */}
          {activeTab === 'progress' && (
            <>
              <View style={[styles.card, { alignItems: 'center', paddingVertical: 24 }]}>
                <Text style={styles.inputLabel}>Physical Work Progress</Text>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.navy, marginVertical: 4 }}>65%</Text>
                <Text style={styles.helperText}>Verified via Geotagged Site Inspections</Text>
              </View>

              <View style={[styles.card, { alignItems: 'center', paddingVertical: 24, marginTop: 12 }]}>
                <Text style={styles.inputLabel}>Financial Disbursed Progress</Text>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.teal, marginVertical: 4 }}>52%</Text>
                <Text style={styles.helperText}>Total Released Funds Utilized</Text>
              </View>
            </>
          )}

          {/* TAB 4: PAYMENTS */}
          {activeTab === 'payments' && (
            <>
              <View style={styles.paymentHeroCard}>
                <Text style={{ color: COLORS.goldSoft, fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 }}>
                  PENDING INSTALLMENT
                </Text>
                <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 6 }}>
                  LPC 3 — ₹2,00,000
                </Text>
                <Text style={{ color: COLORS.goldSoft, fontSize: 12 }}>Stage: Roof Construction</Text>
                
                <TouchableOpacity style={styles.goldButton} activeOpacity={0.85} onPress={() => {
                  setPayStep('review');
                  setPayModalVisible(true);
                }}>
                  <Text style={styles.goldButtonText}>Process Installment</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>Disbursement Receipts</Text>
              {lpcStages.filter(x => x.status === 'done').map((item) => (
                <View key={item.n} style={[styles.card, styles.rowBetween]}>
                  <View>
                    <Text style={styles.cardHeaderTitle}>LPC {item.n} ({item.stage})</Text>
                    <Text style={styles.helperText}>Paid on {item.date}</Text>
                  </View>
                  <Text style={styles.monoValue}>{item.amount}</Text>
                </View>
              ))}
            </>
          )}

          {/* TAB 5: MORE / PROFILE */}
          {activeTab === 'more' && (
            <>
              <View style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>RK</Text>
                </View>
                <View style={{ marginLeft: 14 }}>
                  <Text style={styles.cardHeaderTitle}>Ramulu Kondal</Text>
                  <Text style={styles.helperText}>+91 98765 43210</Text>
                  <Text style={[styles.helperText, { color: COLORS.navyAccent, fontWeight: '600' }]}>
                    ID: TGHCL-BEN-000124
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity style={styles.menuCard} onPress={() => setCurrentSubScreen('documents')}>
                <Text style={styles.menuCardIcon}>📄</Text>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardHeaderTitle}>My Documents</Text>
                  <Text style={styles.helperText}>View and manage allotment records</Text>
                </View>
                <Text style={{ color: COLORS.textMuted }}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuCard} onPress={() => setCurrentSubScreen('photos')}>
                <Text style={styles.menuCardIcon}>📷</Text>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardHeaderTitle}>Site Photos</Text>
                  <Text style={styles.helperText}>Geotagged construction progress photos</Text>
                </View>
                <Text style={{ color: COLORS.textMuted }}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.dangerButton} onPress={() => {
                setIsAuthenticated(false);
                if (navigation && navigation.replace) navigation.replace('Login');
              }}>
                <Text style={styles.dangerButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </Animated.View>

      {/* BOTTOM ANIMATED NAVIGATION BAR */}
      <AnimatedTabBar activeTab={activeTab} onTabPress={handleTabSwitch} />

      {/* MODAL: PAYMENT GATEWAY */}
      <Modal visible={isPayModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.cardHeaderTitle}>LPC Installment Checkout</Text>
              <TouchableOpacity onPress={() => setPayModalVisible(false)}>
                <Text style={{ fontSize: 18, color: COLORS.textMuted }}>✕</Text>
              </TouchableOpacity>
            </View>

            {payStep === 'review' && (
              <View style={{ paddingVertical: 12 }}>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, textAlign: 'center' }}>Amount to Disburse</Text>
                <Text style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.navy, textAlign: 'center', marginVertical: 8 }}>
                  ₹2,00,000
                </Text>
                <View style={styles.card}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.helperText}>Milestone</Text>
                    <Text style={styles.cardHeaderTitle}>Roof Stage</Text>
                  </View>
                  <View style={[styles.rowBetween, { marginTop: 8 }]}>
                    <Text style={styles.helperText}>Beneficiary</Text>
                    <Text style={styles.cardHeaderTitle}>Ramulu Kondal</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmPayment}>
                  <Text style={styles.primaryButtonText}>Authorize & Confirm</Text>
                </TouchableOpacity>
              </View>
            )}

            {payStep === 'processing' && (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.navySecondary} />
                <Text style={{ marginTop: 16, fontWeight: 'bold', color: COLORS.navy }}>Processing Transaction...</Text>
                <Text style={styles.helperText}>Communicating with Escrow Gateway</Text>
              </View>
            )}

            {payStep === 'success' && (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <View style={styles.verifiedIconWrap}>
                  <Text style={{ fontSize: 28 }}>✓</Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLORS.navy, marginTop: 12 }}>
                  Payment Transferred
                </Text>
                <Text style={styles.helperText}>Receipt ID: TGHCL-TXN-90143</Text>
                <TouchableOpacity style={[styles.primaryButton, { width: '100%', marginTop: 20 }]} onPress={() => setPayModalVisible(false)}>
                  <Text style={styles.primaryButtonText}>Return to Dashboard</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==========================================
// STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  authSafeArea: { flex: 1, backgroundColor: COLORS.navyDark },
  appSafeArea: { flex: 1, backgroundColor: COLORS.bg },
  authHeroContainer: { padding: 28, backgroundColor: COLORS.navySecondary },
  authCrestBadge: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center' },
  authCrestText: { fontWeight: '800', color: COLORS.navyDark, fontSize: 18 },
  authTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 14 },
  authSubtitle: { color: '#AFC0DA', fontSize: 13, marginTop: 4 },
  authContentContainer: { flex: 1, padding: 24, backgroundColor: COLORS.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -12 },
  
  topbarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: COLORS.bg },
  topbarGreeting: { fontSize: 18, fontWeight: '800', color: COLORS.navy },
  topbarSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  iconButton: { width: 38, height: 38, borderRadius: 10, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, position: 'relative' },
  notificationDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger },
  
  contentArea: { flex: 1, paddingHorizontal: 20 },
  subHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  subHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.navy },
  backButton: { marginRight: 14 },
  backButtonText: { color: COLORS.navyAccent, fontWeight: '700', fontSize: 15 },

  card: { backgroundColor: COLORS.surface, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, marginBottom: 12 },
  cardHeaderTitle: { fontSize: 14, fontWeight: '700', color: COLORS.navy },
  cardActionRow: { flexDirection: 'row', marginTop: 12 },
  cardOutlineBtn: { flex: 1, height: 36, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardOutlineBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.navySecondary },

  heroCard: { backgroundColor: COLORS.navy, borderRadius: 18, padding: 20, marginBottom: 16 },
  heroEyebrow: { color: COLORS.goldSoft, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  heroTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 4 },
  heroChip: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  heroChipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  heroMetaText: { color: '#AFC0DA', fontSize: 12, marginTop: 4 },
  heroProgressText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  heroProgressVal: { color: COLORS.goldSoft, fontSize: 12, fontWeight: '700' },

  barTrack: { height: 7, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, marginTop: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  sectionTitle: { fontSize: 12, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginVertical: 12 },
  kpiGrid: { flexDirection: 'row', gap: 12 },
  kpiCard: { flex: 1, backgroundColor: COLORS.surface, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  kpiLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '700', textTransform: 'uppercase' },
  kpiValue: { fontSize: 18, fontWeight: '800', color: COLORS.navy, marginTop: 4 },

  inputLabel: { fontSize: 11, fontWeight: '800', color: COLORS.textSecondary, textTransform: 'uppercase', marginBottom: 6 },
  inputFieldWrap: { flexDirection: 'row', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 10, backgroundColor: COLORS.surface, height: 48, alignItems: 'center' },
  inputPrefix: { paddingHorizontal: 14, fontWeight: '700', color: COLORS.textSecondary, borderRightWidth: 1, borderRightColor: COLORS.border },
  textInput: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 16, color: COLORS.textPrimary },
  helperText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },

  primaryButton: { backgroundColor: COLORS.navySecondary, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryButton: { height: 44, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  secondaryButtonText: { color: COLORS.navyAccent, fontWeight: '700' },
  goldButton: { backgroundColor: COLORS.gold, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  goldButtonText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  dangerButton: { borderWidth: 1, borderColor: COLORS.danger, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  dangerButtonText: { color: COLORS.danger, fontWeight: '700' },

  otpInputGrid: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  otpBox: { width: 44, height: 48, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 8, textAlign: 'center', fontSize: 18, fontWeight: '700', backgroundColor: COLORS.surface },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  tabbarContainer: { flexDirection: 'row', height: 62, backgroundColor: COLORS.surface, borderTopWidth: 1, borderColor: COLORS.border, paddingHorizontal: 8, alignItems: 'center', position: 'relative' },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  tabIcon: { fontSize: 18, opacity: 0.6 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textMuted, marginTop: 2 },
  tabLabelActive: { color: COLORS.navySecondary, fontWeight: '800' },
  activeIndicator: { position: 'absolute', height: 44, backgroundColor: COLORS.tealSoft, borderRadius: 12, top: 9, left: 8 },

  lpcTimelineNode: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  lpcStatusDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  lpcStatusDotDone: { backgroundColor: COLORS.success },
  lpcStatusDotCurrent: { backgroundColor: COLORS.gold },
  lpcContentBox: { flex: 1, marginLeft: 12, paddingBottom: 4 },

  paymentHeroCard: { backgroundColor: COLORS.navyDark, borderRadius: 18, padding: 20, marginBottom: 16 },
  verifiedIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.successSoft, justifyContent: 'center', alignItems: 'center' },
  
  profileAvatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center' },
  profileAvatarText: { color: COLORS.navyDark, fontWeight: '800', fontSize: 18 },
  menuCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  menuCardIcon: { fontSize: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheetContainer: { backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monoValue: { fontSize: 14, fontWeight: '700', color: COLORS.navyDark },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
});