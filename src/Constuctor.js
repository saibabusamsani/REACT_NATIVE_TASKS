import React, { useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Switch,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchCamera } from 'react-native-image-picker';

// --- COLOR PALETTE (from HTML :root tokens) ---
const COLORS = {
  navy: '#12233F',
  navy2: '#1B3A6B',
  navy3: '#2C5090',
  gold: '#B8862F',
  goldSoft: '#F3E7CE',
  teal: '#0F6E6E',
  tealSoft: '#E1F0EF',
  success: '#1E7B34',
  successSoft: '#E5F3E8',
  warning: '#946A11',
  warningSoft: '#FBF0DA',
  danger: '#B3261E',
  dangerSoft: '#FBE7E5',
  bg: '#F5F6F8',
  surface: '#FFFFFF',
  border: '#E1E4EA',
  text: '#171E2B',
  textMuted: '#5B6472',
  textFaint: '#8A93A3',
};

// ==========================================
// DATA — mirrors MILESTONE_TEMPLATE / PROJECTS / BILLS / NOTIFS in the HTML source
// ==========================================
const MILESTONE_TEMPLATE = [
  { name: 'Mile Stone I', desc: 'Detailed structural designs submission with proof checked by the approved institutions.', months: 1, pct: 1 },
  { name: 'Mile Stone II', desc: 'Completion of foundations up to Plinth Beams and Stilt Floor slab.', months: 2, pct: 19 },
  { name: 'Mile Stone III', desc: 'Laying of 6 typical floor slabs and completion of masonry for 4 typical floors.', months: 5, pct: 25 },
  { name: 'Mile Stone IV', desc: 'Completion of all 10 typical roof slabs and masonry 8 typical floors, internal plastering for 6 floors.', months: 8, pct: 25 },
  { name: 'Mile Stone V', desc: 'Completion of masonry for all floors, internal & external plastering and flooring for all floors, terrace tanks, doors and windows fixing, all finishings including internal amenities viz. water supply, sanitary fittings, internal electrical fittings, firefighting fittings, lifts etc., for completion.', months: 12, pct: 30 },
];

function monthsAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - Math.round(n * 30));
  return d;
}
function addMonths(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(n * 30));
  return d;
}
function fmtDate(d) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}
function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN');
}
function fmtDateInput(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}-${mm}-${d.getFullYear()}`;
}
function parseDateInput(str) {
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(str);
  if (!m) return new Date();
  return new Date(parseInt(m[3], 10), parseInt(m[2], 10) - 1, parseInt(m[1], 10));
}
function seededRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ==========================================
// LOCAL STAGE PHOTOS
// Drop your own site photos into ./assets/stages/ with these exact filenames
// (or edit the paths below to point wherever you keep them). One representative
// photo per construction stage is used across all geotag cards for that stage.
// ==========================================
const STAGE_IMAGES = {
  foundation: require('../src/assets/foundation.jpg'),
  plinth: require('../src/assets/plinth.jpg'),
  roof: require('../src/assets/roof.jpg'),
  finishing: require('../src/assets/finishing.jpg'),
  final: require('../src/assets/finishing.jpg'),
  default: require('../src/assets/default.jpg'),
};
function stageKeyFromMilestone(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('found')) return 'foundation';
  if (n.includes('plinth')) return 'plinth';
  if (n.includes('roof')) return 'roof';
  if (n.includes('finish')) return 'finishing';
  if (n.includes('final') || n.includes('completion')) return 'final';
  return 'default';
}

// Deterministic geotagged evidence photos for a bill — same local image per stage,
// each card gets its own simulated GPS lock + timestamp so it still reads as 3 distinct captures.
function geoPhotosForBill(b) {
  const p_ = b.projectId;
  const stageKey = stageKeyFromMilestone(b.milestone);
  const image = STAGE_IMAGES[stageKey] || STAGE_IMAGES.default;
  const base = p_.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + b.id * 7;
  const count = 1;
  const out = [];
  for (let i = 0; i < count; i++) {
    const seed = base + i;
    const lat = (17.3 + seededRand(seed) * 1.4).toFixed(4);
    const lng = (78.2 + seededRand(seed + 50) * 1.6).toFixed(4);
    const hh = 9 + Math.floor(seededRand(seed + 90) * 8);
    const mm = Math.floor(seededRand(seed + 120) * 60);
    out.push({
      source: image,
      lat, lng,
      time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`,
    });
  }
  return out;
}

// agreementDate is derived once at load, same as the HTML's monthsAgo() calls
const RAW_PROJECTS = [
  { id: 'TGHCL-PRJ-000124', ben: 'Ramulu Kondal', benVid: 'TGHCL-BEN-000124', district: 'Warangal', constituency: 'Warangal Rural', location: 'Ward 14', stage: 'Roof', physical: 65, financial: 52, currentLpc: 3, billStatus: 'AE Verification', paymentStatus: 'Pending', agreementDate: monthsAgo(3.5), msCompleted: 2, completed: false },
  { id: 'TGHCL-PRJ-000098', ben: 'Lakshmi Devi', benVid: 'TGHCL-BEN-000098', district: 'Karimnagar', constituency: 'Karimnagar Urban', location: 'Ward 7', stage: 'Finishing', physical: 88, financial: 75, currentLpc: 4, billStatus: 'Submitted', paymentStatus: 'Pending', agreementDate: monthsAgo(6), msCompleted: 3, completed: false },
  { id: 'TGHCL-PRJ-000145', ben: 'Yadagiri Rao', benVid: 'TGHCL-BEN-000145', district: 'Nalgonda', constituency: 'Nalgonda Rural', location: 'Ward 3', stage: 'Foundation', physical: 22, financial: 18, currentLpc: 1, billStatus: 'DE Review', paymentStatus: 'Pending', agreementDate: monthsAgo(1.5), msCompleted: 1, completed: false },
  { id: 'TGHCL-PRJ-000162', ben: 'Saroja Bai', benVid: 'TGHCL-BEN-000162', district: 'Khammam', constituency: 'Khammam Urban', location: 'Ward 9', stage: 'Plinth', physical: 40, financial: 30, currentLpc: 2, billStatus: 'Rejected', paymentStatus: 'Hold', agreementDate: monthsAgo(3), msCompleted: 1, completed: false },
  { id: 'TGHCL-PRJ-000178', ben: 'Chandra Reddy', benVid: 'TGHCL-BEN-000178', district: 'Adilabad', constituency: 'Adilabad Rural', location: 'Ward 5', stage: 'Plinth', physical: 45, financial: 38, currentLpc: 2, billStatus: 'AE Verified', paymentStatus: 'Pending', agreementDate: monthsAgo(1), msCompleted: 1, completed: false },
  { id: 'TGHCL-PRJ-000061', ben: 'Manohar Naik', benVid: 'TGHCL-BEN-000061', district: 'Hyderabad', constituency: 'Hyderabad Central', location: 'Ward 2', stage: 'Final Completion', physical: 100, financial: 100, currentLpc: 6, billStatus: 'Paid', paymentStatus: 'Paid', agreementDate: monthsAgo(13), msCompleted: 5, completed: true },
];

const RAW_BILLS = [
  { id: 1, billNo: 'BILL-2026-0410', projectId: 'TGHCL-PRJ-000124', milestone: 'Plinth', amount: 100000, stage: 'paid', date: '18 May 2026' },
  { id: 2, billNo: 'BILL-2026-0512', projectId: 'TGHCL-PRJ-000124', milestone: 'Roof', amount: 200000, stage: 'ae_verification', date: '10 Aug 2026' },
  { id: 3, billNo: 'BILL-2026-0498', projectId: 'TGHCL-PRJ-000098', milestone: 'Finishing', amount: 100000, stage: 'submitted', date: '15 Aug 2026' },
  { id: 4, billNo: 'BILL-2026-0470', projectId: 'TGHCL-PRJ-000145', milestone: 'Foundation', amount: 10000, stage: 'de_review', date: '02 Aug 2026' },
  { id: 5, billNo: 'BILL-2026-0455', projectId: 'TGHCL-PRJ-000162', milestone: 'Plinth', amount: 100000, stage: 'rejected', date: '28 Jul 2026', rejectReason: 'Photographic evidence insufficient — geotag missing on 2 of 4 images. Resubmit with complete geotagged evidence.' },
  { id: 6, billNo: 'BILL-2026-0501', projectId: 'TGHCL-PRJ-000178', milestone: 'Plinth', amount: 100000, stage: 'ae_verified', date: '09 Aug 2026' },
];

const BILL_STAGE_META = {
  paid: { label: 'Paid', badge: 'success', icon: 'checkmark-circle' },
  ae_verification: { label: 'AE Verification', badge: 'gold', icon: 'time' },
  submitted: { label: 'Submitted', badge: 'neutral', icon: 'paper-plane' },
  de_review: { label: 'DE Review', badge: 'gold', icon: 'time' },
  rejected: { label: 'Rejected', badge: 'danger', icon: 'close-circle' },
  ae_verified: { label: 'AE Verified', badge: 'teal', icon: 'checkmark' },
  draft: { label: 'Draft (Offline)', badge: 'neutral', icon: 'save' },
};

const NOTIFS = [
  { title: 'Bill moved to E review', text: 'Roof bill BILL-2026-0512 (Warangal) has moved to E review after DE recommendation.', time: '1 day ago', read: false, type: 'approved' },
  { title: 'Bill rejected', text: 'BILL-2026-0455 (Khammam, Plinth) was rejected — geotag evidence insufficient.', time: '2 weeks ago', read: false, type: 'rejected' },
  { title: 'Field verification pending', text: 'BILL-2026-0512 (Warangal, Roof) is awaiting AE verification.', time: '3 days ago', read: true, type: 'pending' },
];

// ==========================================
// MILESTONE ENGINE — mirrors getMilestones()/currentMilestone()/refreshDelayFlags()
// ==========================================
function getMilestones(p) {
  const today = new Date();
  return MILESTONE_TEMPLATE.map((m, i) => {
    const due = addMonths(p.agreementDate, m.months);
    let status;
    if (i < p.msCompleted) status = 'completed';
    else if (today > due) status = 'delayed';
    else if (i === p.msCompleted) status = 'in_progress';
    else status = 'upcoming';
    return {
      idx: i,
      name: m.name,
      desc: m.desc,
      pct: m.pct,
      due,
      status,
      overdueDays: status === 'delayed' ? daysBetween(due, today) : 0,
    };
  });
}
function currentMilestone(p) {
  const ms = getMilestones(p);
  return ms.filter((m) => m.status === 'delayed' || m.status === 'in_progress')[0] || ms[ms.length - 1];
}
function isProjectDelayed(p) {
  if (p.completed) return false;
  return getMilestones(p).some((m) => m.status === 'delayed');
}

const STATUS_STYLE = {
  completed: { icon: 'checkmark', bg: COLORS.successSoft, fg: COLORS.success, label: 'Done' },
  delayed: { icon: 'alert', bg: COLORS.dangerSoft, fg: COLORS.danger, label: 'Delayed' },
  in_progress: { icon: 'flash', bg: COLORS.tealSoft, fg: COLORS.teal, label: 'In Progress' },
  upcoming: { icon: 'ellipse-outline', bg: '#EEF1F6', fg: COLORS.textFaint, label: 'Upcoming' },
};

const ROLES = [
  { key: 'contractor', label: 'Contractor', sub: 'Sri Balaji Constructions', icon: 'business' },
  { key: 'ae', label: 'AE — Assistant Engineer', sub: 'Field inspection & verification', icon: 'checkmark-circle-outline' },
  { key: 'de', label: 'DE — Department Engineer', sub: 'Report review & recommendation', icon: 'document-text-outline' },
  { key: 'e', label: 'E — Approving Engineer', sub: 'Final approval & rejection', icon: 'checkbox-outline' },
];
function roleLabel(r) {
  return { contractor: 'Contractor', ae: 'AE — Assistant Engineer', de: 'DE — Department Engineer', e: 'E — Approving Engineer' }[r];
}
const NAV_CONFIG = {
  contractor: [
    { key: 'dashboard', label: 'Dashboard', iconActive: 'grid', iconInactive: 'grid-outline' },
    { key: 'projects', label: 'Projects', iconActive: 'briefcase', iconInactive: 'briefcase-outline' },
    { key: 'bills', label: 'Bills', iconActive: 'receipt', iconInactive: 'receipt-outline' },
    { key: 'more', label: 'More', iconActive: 'ellipsis-horizontal-circle', iconInactive: 'ellipsis-horizontal-circle-outline' },
  ],
  ae: [
    { key: 'dashboard', label: 'Inspections', iconActive: 'checkmark-done-circle', iconInactive: 'checkmark-done-circle-outline' },
    { key: 'projects', label: 'Projects', iconActive: 'briefcase', iconInactive: 'briefcase-outline' },
    { key: 'more', label: 'More', iconActive: 'ellipsis-horizontal-circle', iconInactive: 'ellipsis-horizontal-circle-outline' },
  ],
  de: [
    { key: 'dashboard', label: 'Reports', iconActive: 'receipt', iconInactive: 'receipt-outline' },
    { key: 'more', label: 'More', iconActive: 'ellipsis-horizontal-circle', iconInactive: 'ellipsis-horizontal-circle-outline' },
  ],
  e: [
    { key: 'dashboard', label: 'Approvals', iconActive: 'checkmark-done-circle', iconInactive: 'checkmark-done-circle-outline' },
    { key: 'more', label: 'More', iconActive: 'ellipsis-horizontal-circle', iconInactive: 'ellipsis-horizontal-circle-outline' },
  ],
};

function Badge({ text, tone = 'neutral' }) {
  const map = {
    neutral: { bg: '#EEF1F6', fg: COLORS.textMuted },
    success: { bg: COLORS.successSoft, fg: COLORS.success },
    danger: { bg: COLORS.dangerSoft, fg: COLORS.danger },
    gold: { bg: COLORS.goldSoft, fg: COLORS.gold },
    teal: { bg: COLORS.tealSoft, fg: COLORS.teal },
  };
  const c = map[tone] || map.neutral;
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: c.fg }]} />
      <Text style={[styles.badgeText, { color: c.fg }]}>{text}</Text>
    </View>
  );
}

export default function App({ navigation }) {
  const [role, setRole] = useState(null); // null => show role select
  const [activeTab, setActiveTab] = useState('dashboard');
  const [bills, setBills] = useState(RAW_BILLS);
  const [projects] = useState(RAW_PROJECTS);

  const [projSearch, setProjSearch] = useState('');
  const [projFilter, setProjFilter] = useState('all');

  const [detailProjectId, setDetailProjectId] = useState(null);
  const [msDetail, setMsDetail] = useState(null); // {project, idx}

  const [billSheet, setBillSheet] = useState(false);
  const [billForm, setBillForm] = useState({ projectId: null, msIdx: 0, dateStr: '', no: '', amount: '', remarks: '', delayReason: '' });
  const [projDropdownOpen, setProjDropdownOpen] = useState(false);
  const [msDropdownOpen, setMsDropdownOpen] = useState(false);
  const [billDetail, setBillDetail] = useState(null);

  const [fieldAction, setFieldAction] = useState(null); // {billId, role}
  const [fieldForm, setFieldForm] = useState({ progress: '100', notes: '', recommendation: 'Approve' });

  const [captureSheet, setCaptureSheet] = useState(false);
  const [capState, setCapState] = useState({ projectId: null, msIdx: null, step: 0, gps: false, gpsVal: '', timeVal: '', photoUri: null, capturing: false });
  const [fullImage, setFullImage] = useState(null); // uri/source shown in full-screen viewer

  const [showNotifs, setShowNotifs] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const delayed = useMemo(() => projects.filter(isProjectDelayed), [projects]);
  const activeCount = useMemo(() => projects.filter((p) => !p.completed && !isProjectDelayed(p)).length, [projects]);
  const completedCount = useMemo(() => projects.filter((p) => p.completed).length, [projects]);
  const billsPending = bills.filter((b) => ['submitted', 'ae_verification', 'de_review'].includes(b.stage)).length;
  const billsPaid = bills.filter((b) => b.stage === 'paid').length;

  const projectFor = (id) => projects.find((p) => p.id === id) || projects[0];

  const filteredProjects = useMemo(() => {
    const q = projSearch.toLowerCase();
    return projects.filter((p) => {
      const del = isProjectDelayed(p);
      if (projFilter === 'active' && (p.completed || del)) return false;
      if (projFilter === 'completed' && !p.completed) return false;
      if (projFilter === 'delayed' && !del) return false;
      if (q && !p.id.toLowerCase().includes(q) && !p.ben.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [projects, projSearch, projFilter]);

  // ---------- Bill actions ----------
  const openBillSubmit = (projectId, msIdx) => {
    const defaultProjectId = projectId || (projects.find((p) => !p.completed) || projects[0]).id;
    const p = projectFor(defaultProjectId);
    const idx = msIdx != null ? msIdx : currentMilestone(p).idx;
    setBillForm({ projectId: defaultProjectId, msIdx: idx, dateStr: fmtDateInput(new Date()), no: '', amount: '', remarks: '', delayReason: '' });
    setProjDropdownOpen(false);
    setMsDropdownOpen(false);
    setBillSheet(true);
  };
  const billLateInfo = () => {
    if (!billForm.projectId) return null;
    const p = projectFor(billForm.projectId);
    const ms = getMilestones(p)[billForm.msIdx];
    const billDate = parseDateInput(billForm.dateStr);
    const late = billDate > ms.due;
    return { ms, late, billDate };
  };
  const submitBill = () => {
    const amt = billForm.amount.replace(/\D/g, '');
    if (!amt) return;
    const info = billLateInfo();
    if (info.late && !billForm.delayReason.trim()) return;
    const newId = bills.length + 1;
    setBills([
      ...bills,
      {
        id: newId,
        billNo: billForm.no || 'BILL-2026-0' + (500 + newId),
        projectId: billForm.projectId,
        milestone: info.ms.name.replace('Mile Stone ', 'MS '),
        amount: parseInt(amt, 10),
        stage: isOffline ? 'draft' : 'submitted',
        date: fmtDate(info.billDate),
      },
    ]);
    setBillSheet(false);
  };

  // ---------- Capture flow ----------
  const openCaptureFlow = (projectId, msIdx) => {
    const p = projectFor(projectId);
    const idx = msIdx != null ? msIdx : currentMilestone(p).idx;
    setCapState({ projectId, msIdx: idx, step: 0, gps: false, gpsVal: '', timeVal: '', photoUri: null, capturing: false });
    setCaptureSheet(true);
  };
  const stampLocationAndAdvance = (photoUri) => {
    const finish = (lat, lng) => {
      const d = new Date();
      setCapState((s) => ({
        ...s,
        gps: true,
        step: 2,
        capturing: false,
        photoUri,
        gpsVal: `${lat}° N, ${lng}° E`,
        timeVal: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }));
    };
    // Use the device's real GPS lock when available; fall back to a simulated
    // in-region coordinate if location services are off/denied so the flow
    // never gets stuck.
    if (typeof navigator !== 'undefined' && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(
        (pos) => finish(pos.coords.latitude.toFixed(4), pos.coords.longitude.toFixed(4)),
        () => finish((17.9 + Math.random() * 0.2).toFixed(4), (79.5 + Math.random() * 0.2).toFixed(4)),
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      finish((17.9 + Math.random() * 0.2).toFixed(4), (79.5 + Math.random() * 0.2).toFixed(4));
    }
  };
  const capturePhoto = () => {
    setCapState((s) => ({ ...s, capturing: true }));
    launchCamera(
      { mediaType: 'photo', cameraType: 'back', saveToPhotos: false, quality: 0.8 },
      (response) => {
        if (!response || response.didCancel) {
          setCapState((s) => ({ ...s, capturing: false }));
          return;
        }
        if (response.errorCode) {
          // Camera unavailable/permission denied — surface it instead of silently failing.
          setCapState((s) => ({ ...s, capturing: false }));
          return;
        }
        const uri = response.assets && response.assets[0] && response.assets[0].uri;
        if (!uri) {
          setCapState((s) => ({ ...s, capturing: false }));
          return;
        }
        stampLocationAndAdvance(uri);
      }
    );
  };

  // ---------- Field actions (AE / DE / E) ----------
  const openFieldAction = (billId, forRole) => {
    setFieldForm({ progress: '100', notes: forRole === 'ae' ? 'Work verified against approved drawing. No visible defects.' : forRole === 'de' ? 'AE findings consistent with site records. Recommend approval.' : '', recommendation: 'Approve' });
    setFieldAction({ billId, role: forRole });
  };
  const submitFieldAction = (action) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== fieldAction.billId) return b;
        if (action === 'ae') return { ...b, stage: 'ae_verified' };
        if (action === 'de') return { ...b, stage: 'de_review' };
        if (action === 'e_approve') return { ...b, stage: 'paid' };
        if (action === 'e_reject') return { ...b, stage: 'rejected', rejectReason: fieldForm.notes || 'Rejected by Approving Engineer.' };
        return b;
      })
    );
    setFieldAction(null);
  };

  const navTabs = NAV_CONFIG[role] || NAV_CONFIG.contractor;

  // ---------- Role-specific bill queues ----------
  const toInspect = bills.filter((b) => b.stage === 'submitted');
  const toDeReview = bills.filter((b) => b.stage === 'ae_verified');
  const toApprove = bills.filter((b) => b.stage === 'de_review');


  const renderMilestoneTracker = (p) => {
    const ms = getMilestones(p);
    return ms.map((m) => {
      const st = STATUS_STYLE[m.status];
      const sub =
        m.status === 'delayed'
          ? `${m.overdueDays} days overdue · due ${fmtDate(m.due)}`
          : m.status === 'completed'
          ? `${m.pct}% cum. · completed`
          : `${m.pct}% cum. · due ${fmtDate(m.due)}`;
      return (
        <TouchableOpacity key={m.idx} style={styles.listItem} onPress={() => setMsDetail({ project: p, idx: m.idx })}>
          <View style={[styles.listIcon, { backgroundColor: st.bg }]}>
            <Ionicons name={st.icon} size={17} color={st.fg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>{m.name}</Text>
            <Text style={styles.listSub}>{sub}</Text>
          </View>
          <Badge text={st.label} tone={m.status === 'completed' ? 'success' : m.status === 'delayed' ? 'danger' : m.status === 'in_progress' ? 'teal' : 'neutral'} />
        </TouchableOpacity>
      );
    });
  };

  // ================= SCREENS =================
  const renderContractorDashboard = () => (
    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
      {delayed.length > 0 && (
        <>
          <Text style={styles.sectionLabel}>⚠ Delay Alerts</Text>
          <View style={styles.card}>
            {delayed.map((p) => {
              const m = currentMilestone(p);
              return (
                <TouchableOpacity key={p.id} style={styles.listItem} onPress={() => setDetailProjectId(p.id)}>
                  <View style={[styles.listIcon, { backgroundColor: COLORS.dangerSoft }]}>
                    <Ionicons name="alert-circle" size={17} color={COLORS.danger} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listTitle}>{p.id} — {m.name}</Text>
                    <Text style={styles.listSub}>{m.overdueDays} days overdue · due {fmtDate(m.due)}</Text>
                  </View>
                  <Badge text="Delayed" tone="danger" />
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      <Text style={styles.sectionLabel}>Projects</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Assigned Projects</Text><Text style={styles.kpiVal}>{projects.length}</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Active / On Track</Text><Text style={[styles.kpiVal, { color: COLORS.teal }]}>{activeCount}</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Completed</Text><Text style={[styles.kpiVal, { color: COLORS.success }]}>{completedCount}</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Delayed</Text><Text style={[styles.kpiVal, { color: COLORS.danger }]}>{delayed.length}</Text></View>
      </View>

      <Text style={styles.sectionLabel}>Bills</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Bills Pending</Text><Text style={[styles.kpiVal, { color: COLORS.gold }]}>{billsPending}</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Bills Released</Text><Text style={[styles.kpiVal, { color: COLORS.success }]}>{billsPaid}</Text></View>
      </View>

      <Text style={styles.sectionLabel}>Payments</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Received</Text><Text style={styles.kpiVal}>₹1,00,000</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Pending</Text><Text style={[styles.kpiVal, { color: COLORS.gold }]}>₹4,10,000</Text></View>
      </View>

      <Text style={styles.sectionLabel}>Your Projects</Text>
      <View style={styles.card}>
        {projects.slice(0, 4).map((p) => {
          const m = currentMilestone(p);
          return (
            <TouchableOpacity key={p.id} style={styles.listItem} onPress={() => setDetailProjectId(p.id)}>
              <View style={styles.listIcon}><Ionicons name="business-outline" size={17} color={COLORS.navy2} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{p.id}</Text>
                <Text style={styles.listSub}>{p.completed ? 'Completed' : `${m.name} · ${m.status.replace('_', ' ')}`}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textFaint} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderAeDashboard = () => (
    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionLabel}>Assigned Field Inspections</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Pending Inspection</Text><Text style={[styles.kpiVal, { color: COLORS.gold }]}>{toInspect.length}</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Verified This Month</Text><Text style={[styles.kpiVal, { color: COLORS.success }]}>4</Text></View>
      </View>
      <Text style={styles.sectionLabel}>Pending Inspections</Text>
      <View style={styles.card}>
        {toInspect.length === 0 && <Text style={styles.emptyNote}>No pending inspections.</Text>}
        {toInspect.map((b) => {
          const p = projectFor(b.projectId);
          return (
            <TouchableOpacity key={b.id} style={styles.listItem} onPress={() => openFieldAction(b.id, 'ae')}>
              <View style={[styles.listIcon, { backgroundColor: COLORS.goldSoft }]}><Ionicons name="time-outline" size={17} color={COLORS.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{b.milestone} — {p.location}</Text>
                <Text style={styles.listSub}>{b.billNo} · {p.id}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textFaint} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderDeDashboard = () => (
    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionLabel}>Reports for Review</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Awaiting Review</Text><Text style={[styles.kpiVal, { color: COLORS.gold }]}>{toDeReview.length}</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Reviewed</Text><Text style={[styles.kpiVal, { color: COLORS.success }]}>2</Text></View>
      </View>
      <Text style={styles.sectionLabel}>Pending</Text>
      <View style={styles.card}>
        {toDeReview.length === 0 && <Text style={styles.emptyNote}>No reports pending review.</Text>}
        {toDeReview.map((b) => {
          const p = projectFor(b.projectId);
          return (
            <TouchableOpacity key={b.id} style={styles.listItem} onPress={() => openFieldAction(b.id, 'de')}>
              <View style={[styles.listIcon, { backgroundColor: COLORS.goldSoft }]}><Ionicons name="document-text-outline" size={17} color={COLORS.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{b.milestone} — {p.location}</Text>
                <Text style={styles.listSub}>{b.billNo} · AE verified</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textFaint} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderEDashboard = () => (
    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionLabel}>Awaiting Your Decision</Text>
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Pending Approval</Text><Text style={[styles.kpiVal, { color: COLORS.gold }]}>{toApprove.length}</Text></View>
        <View style={styles.kpiCard}><Text style={styles.kpiLbl}>Approved</Text><Text style={[styles.kpiVal, { color: COLORS.success }]}>6</Text></View>
      </View>
      <Text style={styles.sectionLabel}>Pending Decisions</Text>
      <View style={styles.card}>
        {toApprove.length === 0 && <Text style={styles.emptyNote}>No decisions pending.</Text>}
        {toApprove.map((b) => {
          const p = projectFor(b.projectId);
          return (
            <TouchableOpacity key={b.id} style={styles.listItem} onPress={() => openFieldAction(b.id, 'e')}>
              <View style={[styles.listIcon, { backgroundColor: COLORS.goldSoft }]}><Ionicons name="checkmark-done-outline" size={17} color={COLORS.gold} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{b.milestone} — {p.location}</Text>
                <Text style={styles.listSub}>{b.billNo} · DE recommended</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textFaint} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderDashboard = () => {
    if (role === 'ae') return renderAeDashboard();
    if (role === 'de') return renderDeDashboard();
    if (role === 'e') return renderEDashboard();
    return renderContractorDashboard();
  };
  const renderProjects = () => (
    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
      <View style={styles.searchbar}>
        <TextInput style={styles.searchInput} placeholder="Search by project ID or beneficiary" value={projSearch} onChangeText={setProjSearch} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {['all', 'active', 'completed', 'delayed'].map((f) => (
          <TouchableOpacity key={f} onPress={() => setProjFilter(f)} style={[styles.filterChip, projFilter === f && styles.filterChipActive]}>
            <Text style={[styles.filterChipText, projFilter === f && styles.filterChipTextActive]}>{f[0].toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredProjects.length === 0 && <Text style={styles.emptyNote}>No projects match this filter.</Text>}

      {filteredProjects.map((p) => {
        const del = isProjectDelayed(p);
        const ms = getMilestones(p);
        const doneCount = ms.filter((m) => m.status === 'completed').length;
        const overallPct = Math.round((doneCount / ms.length) * 100);
        const cur = p.completed ? null : currentMilestone(p);
        return (
          <TouchableOpacity key={p.id} style={styles.projCard} onPress={() => setDetailProjectId(p.id)}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.pid}>{p.id}</Text>
                <Text style={styles.bname}>{p.ben}</Text>
                <View style={styles.geoRow}>
                  <Ionicons name="location-outline" size={12} color={COLORS.textFaint} />
                  <Text style={styles.geoText}>{p.district}</Text>
                </View>
              </View>
              <Badge text={p.completed ? 'Completed' : del ? 'Delayed' : 'Active'} tone={p.completed ? 'success' : del ? 'danger' : 'teal'} />
            </View>
            <View style={{ marginTop: 12 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.miniLbl}>{doneCount} of {ms.length} milestones complete</Text>
                <Text style={styles.miniLbl}>{overallPct}%</Text>
              </View>
              <View style={styles.miniTrack}><View style={[styles.miniFill, { width: `${overallPct}%`, backgroundColor: del ? COLORS.danger : COLORS.gold }]} /></View>
            </View>
            <View style={styles.footRow}>
              {cur ? <Badge text={cur.name} tone="gold" /> : <Badge text="All milestones done" tone="success" />}
              <Badge text={p.billStatus} tone="neutral" />
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderBills = () => (
    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
      <View style={[styles.rowBetween, { marginBottom: 4 }]}>
        <Text style={[styles.sectionLabel, { marginTop: 0, marginBottom: 0 }]}>Billing Status</Text>
        <TouchableOpacity style={styles.newBillBtn} onPress={() => openBillSubmit(null)}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.newBillBtnText}>New Bill</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 14 }} />
      {bills.map((b) => {
        const meta = BILL_STAGE_META[b.stage] || { label: b.stage, badge: 'neutral', icon: 'document' };
        return (
          <TouchableOpacity key={b.id} style={styles.card} onPress={() => setBillDetail(b)}>
            <View style={styles.rowBetween}>
              <Text style={styles.pid}>{b.billNo}</Text>
              <Badge text={meta.label} tone={meta.badge} />
            </View>
            <Text style={styles.bname}>{fmtINR(b.amount)}</Text>
            <Text style={styles.geoText}>{b.projectId} • {b.milestone} • {b.date}</Text>
            {b.rejectReason ? <Text style={styles.rejectText}>{b.rejectReason}</Text> : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderMore = () => (
    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{role === 'contractor' ? 'SB' : role.toUpperCase()}</Text></View>
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.bname}>{role === 'contractor' ? 'Sri Balaji Constructions' : roleLabel(role)}</Text>
          <Text style={styles.geoText}>{roleLabel(role)} · +91 91234 56780</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Settings</Text>
      <View style={[styles.card, styles.rowBetween]}>
        <View>
          <Text style={styles.listTitle}>Simulate Offline Mode</Text>
          <Text style={styles.listSub}>New submissions save locally and sync later</Text>
        </View>
        <Switch value={isOffline} onValueChange={setIsOffline} trackColor={{ true: COLORS.navy2 }} />
      </View>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline-outline" size={14} color={COLORS.warning} />
          <Text style={styles.offlineText}>Offline — new bills & evidence will queue for sync.</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Work</Text>
      {role === 'contractor' && (
        <>
          <TouchableOpacity style={styles.menuCard} onPress={() => setActiveTab('projects')}>
            <Ionicons name="briefcase-outline" size={20} color={COLORS.navy2} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.listTitle}>All Projects</Text>
              <Text style={styles.listSub}>Assigned to you</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textFaint} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuCard} onPress={() => setActiveTab('bills')}>
            <Ionicons name="receipt-outline" size={20} color={COLORS.navy2} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.listTitle}>Bills & Payments</Text>
              <Text style={styles.listSub}>Track submission & approval</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textFaint} />
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.sectionLabel}>Account</Text>
      <TouchableOpacity
        style={styles.menuCard}
        onPress={() => {
          setRole(null);
          setActiveTab('dashboard');
        }}
      >
        <Ionicons name="swap-horizontal-outline" size={20} color={COLORS.navy2} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.listTitle}>Switch Role</Text>
          <Text style={styles.listSub}>This account has multiple authorized field roles</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textFaint} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dangerButton}
        onPress={() => {
          if (navigation && navigation.replace) navigation.replace('Login');
        }}
      >
        <Text style={styles.dangerButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ================= ROLE SELECT SCREEN =================
  if (!role) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.roleSafeArea} edges={['top', 'bottom']}>
          <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
          <ScrollView style={styles.roleScroll} contentContainerStyle={{ paddingBottom: 30 }}>
            <Text style={styles.roleHeading}>Select Role</Text>
            <Text style={styles.roleSubheading}>This account has multiple authorized field roles for this prototype.</Text>
            {ROLES.map((r) => (
              <TouchableOpacity key={r.key} style={styles.roleCard} activeOpacity={0.85} onPress={() => { setRole(r.key); setActiveTab('dashboard'); }}>
                <View style={styles.roleIconWrap}><Ionicons name={r.icon} size={20} color={COLORS.teal} /></View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.roleCardTitle}>{r.label}</Text>
                  <Text style={styles.roleCardSub}>{r.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textFaint} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{navTabs.find((t) => t.key === activeTab)?.label || navTabs[0].label}</Text>
            <Text style={styles.headerSub}>{role === 'contractor' ? 'Sri Balaji Constructions' : roleLabel(role)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <TouchableOpacity onPress={() => setShowNotifs(true)} style={{ position: 'relative' }}>
              <Ionicons name="notifications-outline" size={20} color="#fff" />
              {NOTIFS.some((n) => !n.read) && <View style={styles.notifDot} />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { if (navigation && navigation.replace) navigation.replace('Login'); }}>
              <Text style={styles.logoutBtn}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {isOffline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={14} color={COLORS.warning} />
            <Text style={styles.offlineText}>Simulating poor connectivity — submissions will queue for sync.</Text>
          </View>
        )}

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'projects' && renderProjects()}
        {activeTab === 'bills' && renderBills()}
        {activeTab === 'more' && renderMore()}

        <View style={styles.tabBar}>
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => setActiveTab(tab.key)}>
                <Ionicons name={isActive ? tab.iconActive : tab.iconInactive} size={21} color={isActive ? COLORS.navy2 : COLORS.textFaint} />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ===== PROJECT DETAIL MODAL ===== */}
        <Modal visible={!!detailProjectId} animationType="slide" transparent onRequestClose={() => setDetailProjectId(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.sheetHeaderRow}>
                <Text style={styles.sheetTitleTxt}>{detailProjectId}</Text>
                <TouchableOpacity onPress={() => setDetailProjectId(null)}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
              </View>
              {detailProjectId && (() => {
                const p = projectFor(detailProjectId);
                const cur = p.completed ? null : currentMilestone(p);
                const projBills = bills.filter((b) => b.projectId === p.id);
                return (
                  <ScrollView style={{ maxHeight: '85%' }}>
                    <View style={styles.card}>
                      <View style={styles.geoRow}><Ionicons name="location-outline" size={12} color={COLORS.textFaint} /><Text style={styles.geoText}>{p.district} → {p.constituency} → {p.location}</Text></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Beneficiary</Text><Text style={styles.listTitle}>{p.ben} ({p.benVid})</Text></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Current Stage</Text><Badge text={p.stage} tone="teal" /></View>
                      {cur && <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Current Milestone</Text><Badge text={STATUS_STYLE[cur.status].label} tone={cur.status === 'delayed' ? 'danger' : 'teal'} /></View>}
                      {cur && cur.status === 'delayed' && <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Overdue By</Text><Badge text={`${cur.overdueDays} days`} tone="danger" /></View>}
                    </View>

                    <Text style={styles.sectionLabel}>Progress</Text>
                    <View style={styles.card}>
                      <View style={{ marginBottom: 12 }}>
                        <View style={styles.rowBetween}><Text style={styles.miniLbl}>Physical Progress</Text><Text style={styles.miniLbl}>{p.physical}%</Text></View>
                        <View style={styles.miniTrack}><View style={[styles.miniFill, { width: `${p.physical}%`, backgroundColor: COLORS.gold }]} /></View>
                      </View>
                      <View>
                        <View style={styles.rowBetween}><Text style={styles.miniLbl}>Financial Progress</Text><Text style={styles.miniLbl}>{p.financial}%</Text></View>
                        <View style={styles.miniTrack}><View style={[styles.miniFill, { width: `${p.financial}%`, backgroundColor: COLORS.teal }]} /></View>
                      </View>
                    </View>

                    <Text style={styles.sectionLabel}>Milestone Tracker</Text>
                    <View style={styles.card}>{renderMilestoneTracker(p)}</View>

                    <Text style={styles.sectionLabel}>Bills for this Project</Text>
                    <View style={styles.card}>
                      {projBills.length === 0 && <Text style={styles.emptyNote}>No bills submitted yet.</Text>}
                      {projBills.map((b) => {
                        const meta = BILL_STAGE_META[b.stage] || { label: b.stage, badge: 'neutral' };
                        return (
                          <TouchableOpacity key={b.id} style={styles.listItem} onPress={() => setBillDetail(b)}>
                            <View style={styles.listIcon}><Ionicons name="document-text-outline" size={17} color={COLORS.navy2} /></View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.listTitle}>{b.billNo}</Text>
                              <Text style={styles.listSub}>{b.milestone} · {fmtINR(b.amount)}</Text>
                            </View>
                            <Badge text={meta.label} tone={meta.badge} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 16, marginBottom: 20 }}>
                      <TouchableOpacity style={styles.outlineBtn} onPress={() => { setDetailProjectId(null); openCaptureFlow(p.id); }}>
                        <Text style={styles.outlineBtnText}>📷 Capture Evidence</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.primaryBtn} onPress={() => { setDetailProjectId(null); openBillSubmit(p.id); }}>
                        <Text style={styles.primaryBtnText}>Raise Bill</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                );
              })()}
            </View>
          </View>
        </Modal>

        {/* ===== MILESTONE DETAIL MODAL ===== */}
        <Modal visible={!!msDetail} animationType="fade" transparent onRequestClose={() => setMsDetail(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              {msDetail && (() => {
                const m = getMilestones(msDetail.project)[msDetail.idx];
                const st = STATUS_STYLE[m.status];
                return (
                  <View>
                    <View style={styles.sheetHeaderRow}>
                      <Text style={styles.sheetTitleTxt}>{m.name}</Text>
                      <TouchableOpacity onPress={() => setMsDetail(null)}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
                    </View>
                    <Text style={styles.msDesc}>{m.desc}</Text>
                    <View style={[styles.card, { marginTop: 14 }]}>
                      <View style={styles.rowBetween}><Text style={styles.miniLbl}>Status</Text><Badge text={st.label} tone={m.status === 'completed' ? 'success' : m.status === 'delayed' ? 'danger' : m.status === 'in_progress' ? 'teal' : 'neutral'} /></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Cumulative Weight</Text><Text style={styles.listTitle}>{m.pct}%</Text></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Due Date</Text><Text style={styles.listTitle}>{fmtDate(m.due)}</Text></View>
                      {m.status === 'delayed' && <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Overdue By</Text><Text style={[styles.listTitle, { color: COLORS.danger }]}>{m.overdueDays} days</Text></View>}
                    </View>
                    {m.status !== 'completed' && (
                      <TouchableOpacity style={[styles.primaryBtn, { marginTop: 16 }]} onPress={() => { setMsDetail(null); openCaptureFlow(msDetail.project.id, m.idx); }}>
                        <Text style={styles.primaryBtnText}>Capture Evidence for this Milestone</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })()}
            </View>
          </View>
        </Modal>

        {/* ===== BILL SUBMIT MODAL ===== */}
        <Modal visible={billSheet} animationType="slide" transparent onRequestClose={() => setBillSheet(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.sheetHeaderRow}>
                <TouchableOpacity style={styles.closeCircle} onPress={() => setBillSheet(false)}><Ionicons name="close" size={18} color={COLORS.text} /></TouchableOpacity>
                <Text style={styles.sheetTitleTxt}>Submit Bill</Text>
                <View style={{ width: 32 }} />
              </View>
              {billForm.projectId && (() => {
                const info = billLateInfo();
                const p = projectFor(billForm.projectId);
                const allMs = getMilestones(p);
                return (
                  <ScrollView style={{ maxHeight: '85%' }} showsVerticalScrollIndicator={false}>
                    <Text style={styles.fieldLabel}>Project</Text>
                    <TouchableOpacity style={styles.dropdownField} onPress={() => { setProjDropdownOpen((v) => !v); setMsDropdownOpen(false); }}>
                      <Text style={styles.dropdownFieldText}>{billForm.projectId} — {p.ben}</Text>
                      <Ionicons name={projDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                    {projDropdownOpen && (
                      <View style={styles.dropdownList}>
                        {projects.filter((pr) => !pr.completed).map((pr) => (
                          <TouchableOpacity
                            key={pr.id}
                            style={styles.dropdownOption}
                            onPress={() => {
                              const idx = currentMilestone(pr).idx;
                              setBillForm((f) => ({ ...f, projectId: pr.id, msIdx: idx }));
                              setProjDropdownOpen(false);
                            }}
                          >
                            <Text style={styles.dropdownOptionText}>{pr.id} — {pr.ben}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    <Text style={styles.fieldLabel}>Milestone</Text>
                    <TouchableOpacity style={styles.dropdownField} onPress={() => { setMsDropdownOpen((v) => !v); setProjDropdownOpen(false); }}>
                      <Text style={styles.dropdownFieldText}>{info.ms.name} ({info.ms.pct}% cum.)</Text>
                      <Ionicons name={msDropdownOpen ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textMuted} />
                    </TouchableOpacity>
                    {msDropdownOpen && (
                      <View style={styles.dropdownList}>
                        {allMs.map((m) => (
                          <TouchableOpacity key={m.idx} style={styles.dropdownOption} onPress={() => { setBillForm((f) => ({ ...f, msIdx: m.idx })); setMsDropdownOpen(false); }}>
                            <Text style={styles.dropdownOptionText}>{m.name} ({m.pct}% cum.)</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    <Text style={styles.fieldLabel}>Bill Date</Text>
                    <View style={styles.dateFieldWrap}>
                      <TextInput
                        style={styles.dateFieldInput}
                        placeholder="DD-MM-YYYY"
                        value={billForm.dateStr}
                        onChangeText={(v) => setBillForm((f) => ({ ...f, dateStr: v }))}
                      />
                      <Ionicons name="calendar-outline" size={18} color={COLORS.textMuted} />
                    </View>

                    {info.late ? (
                      <View style={styles.warnBox}><Text style={styles.warnBoxText}>⚠ This bill is being raised {daysBetween(info.ms.due, info.billDate)} days after the milestone due date ({fmtDate(info.ms.due)}). It will be flagged as Delayed.</Text></View>
                    ) : (
                      <View style={styles.okBox}><Text style={styles.okBoxText}>✓ On time — milestone due {fmtDate(info.ms.due)}.</Text></View>
                    )}

                    <Text style={styles.fieldLabel}>Bill Number</Text>
                    <TextInput style={styles.input} placeholder="BILL-2026-XXXX" value={billForm.no} onChangeText={(v) => setBillForm((f) => ({ ...f, no: v }))} />

                    <Text style={styles.fieldLabel}>Bill Amount (₹)</Text>
                    <View style={styles.amountFieldWrap}>
                      <Text style={styles.amountPrefix}>₹</Text>
                      <TextInput style={styles.amountFieldInput} placeholder="2,00,000" keyboardType="numeric" value={billForm.amount} onChangeText={(v) => setBillForm((f) => ({ ...f, amount: v }))} />
                    </View>

                    {info.late && (
                      <>
                        <Text style={styles.fieldLabel}>Reason for Delay *</Text>
                        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Explain the cause of delay" value={billForm.delayReason} onChangeText={(v) => setBillForm((f) => ({ ...f, delayReason: v }))} />
                      </>
                    )}

                    <Text style={styles.fieldLabel}>Remarks</Text>
                    <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Work summary and remarks" value={billForm.remarks} onChangeText={(v) => setBillForm((f) => ({ ...f, remarks: v }))} />

                    <Text style={styles.fieldLabel}>Supporting Documents &amp; Stage Photos</Text>
                    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
                      <TouchableOpacity style={styles.attachBtn}><Ionicons name="attach-outline" size={16} color={COLORS.navy2} /><Text style={styles.attachBtnText}>Attach Doc</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.attachBtn}><Ionicons name="camera-outline" size={16} color={COLORS.navy2} /><Text style={styles.attachBtnText}>Link Photos</Text></TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[styles.primaryBtn, { marginTop: 18, marginBottom: 24 }]} onPress={submitBill}>
                      <Text style={styles.primaryBtnText}>Submit Bill</Text>
                    </TouchableOpacity>
                  </ScrollView>
                );
              })()}
            </View>
          </View>

        </Modal>

        {/* ===== BILL DETAIL MODAL ===== */}
        <Modal visible={!!billDetail} animationType="fade" transparent onRequestClose={() => setBillDetail(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              {billDetail && (() => {
                const meta = BILL_STAGE_META[billDetail.stage] || { label: billDetail.stage, badge: 'neutral' };
                const p = projectFor(billDetail.projectId);
                const photos = geoPhotosForBill(billDetail);
                const verified = ['ae_verified', 'paid'].includes(billDetail.stage);
                return (
                  <ScrollView style={{ maxHeight: '90%' }} showsVerticalScrollIndicator={false}>
                    <View style={styles.sheetHeaderRow}>
                      <TouchableOpacity style={styles.closeCircle} onPress={() => setBillDetail(null)}><Ionicons name="close" size={18} color={COLORS.text} /></TouchableOpacity>
                      <Text style={styles.sheetTitleTxt}>{billDetail.billNo}</Text>
                      <View style={{ width: 32 }} />
                    </View>
                    <View style={styles.card}>
                      <View style={styles.rowBetween}><Text style={styles.miniLbl}>Status</Text><Badge text={meta.label} tone={meta.badge} /></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Project</Text><Text style={styles.listTitle}>{billDetail.projectId}</Text></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Milestone</Text><Text style={styles.listTitle}>{billDetail.milestone}</Text></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Amount</Text><Text style={styles.listTitle}>{fmtINR(billDetail.amount)}</Text></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Date</Text><Text style={styles.listTitle}>{billDetail.date}</Text></View>
                    </View>
                    {billDetail.rejectReason && (
                      <View style={[styles.warnBox, { marginTop: 4, marginBottom: 12 }]}><Text style={styles.warnBoxText}>{billDetail.rejectReason}</Text></View>
                    )}

                    <View style={styles.rowBetween}>
                      <Text style={[styles.sectionLabel, { marginTop: 18 }]}>Geotagged Site Evidence</Text>
                      <Badge text={verified ? 'Verified' : 'Pending Review'} tone={verified ? 'success' : 'gold'} />
                    </View>
                    {photos.map((ph, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.geoPhotoCard}
                        activeOpacity={0.9}
                        onPress={() => setFullImage({ ...ph, location: p.location, district: p.district, date: billDetail.date })}
                      >
                        <Image source={ph.source} style={styles.geoPhotoImg} resizeMode="cover" />
                        <View style={styles.geoPhotoOverlay}>
                          <View style={styles.geoPinRow}>
                            <Ionicons name="location" size={12} color="#fff" />
                            <Text style={styles.geoPinText}>{ph.lat}° N, {ph.lng}° E</Text>
                          </View>
                          <Text style={styles.geoTimeText}>{p.location}, {p.district} · {billDetail.date} · {ph.time}</Text>
                        </View>
                        <View style={styles.geoBadgeCorner}>
                          <Ionicons name={verified ? 'checkmark-circle' : 'time'} size={12} color="#fff" />
                        </View>
                        <View style={styles.geoExpandHint}>
                          <Ionicons name="expand-outline" size={14} color="#fff" />
                        </View>
                      </TouchableOpacity>
                    ))}
                    <Text style={styles.hintText}>Photograph captured on-site with device GPS lock and timestamp, matched against the project's registered geofence.</Text>
                    <View style={{ height: 20 }} />
                  </ScrollView>
                );
              })()}
            </View>
          </View>
        </Modal>

        {/* ===== FULL-SCREEN IMAGE VIEWER ===== */}
        <Modal visible={!!fullImage} animationType="fade" transparent onRequestClose={() => setFullImage(null)}>
          <View style={styles.fullImageOverlay}>
            <TouchableOpacity style={styles.fullImageCloseBtn} onPress={() => setFullImage(null)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            {fullImage && (
              <>
                <Image source={fullImage.source} style={styles.fullImage} resizeMode="contain" />
                <View style={styles.fullImageCaption}>
                  <View style={styles.geoPinRow}>
                    <Ionicons name="location" size={13} color="#fff" />
                    <Text style={styles.fullImageCaptionText}>{fullImage.lat}° N, {fullImage.lng}° E</Text>
                  </View>
                  <Text style={styles.fullImageCaptionSub}>{fullImage.location}, {fullImage.district} · {fullImage.date} · {fullImage.time}</Text>
                </View>
              </>
            )}
          </View>
        </Modal>

        {/* ===== CAPTURE EVIDENCE MODAL (stepper) ===== */}
        <Modal visible={captureSheet} animationType="slide" transparent onRequestClose={() => setCaptureSheet(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.sheetHeaderRow}>
                <Text style={styles.sheetTitleTxt}>Submit Evidence</Text>
                <TouchableOpacity onPress={() => setCaptureSheet(false)}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
              </View>

              <View style={styles.stepperTrack}>
                {['Milestone', 'Photo', 'Remarks'].map((label, i) => (
                  <React.Fragment key={label}>
                    <View style={[styles.stepDot, i < capState.step && styles.stepDotDone, i === capState.step && styles.stepDotCurrent]}>
                      <Text style={styles.stepDotText}>{i < capState.step ? '✓' : i + 1}</Text>
                    </View>
                    {i < 2 && <View style={[styles.stepLine, i < capState.step && styles.stepLineDone]} />}
                  </React.Fragment>
                ))}
              </View>

              {capState.step === 0 && capState.projectId && (
                <ScrollView style={{ maxHeight: '75%' }}>
                  <Text style={styles.fieldLabel}>Select Milestone Completed</Text>
                  {getMilestones(projectFor(capState.projectId)).filter((m) => m.status !== 'completed').map((m) => (
                    <TouchableOpacity
                      key={m.idx}
                      style={[styles.selectTile, capState.msIdx === m.idx && styles.selectTileChosen]}
                      onPress={() => setCapState((s) => ({ ...s, msIdx: m.idx, step: 1 }))}
                    >
                      <View>
                        <Text style={styles.listTitle}>{m.name}</Text>
                        <Text style={styles.listSub}>{m.pct}% cum. · due {fmtDate(m.due)}{m.status === 'delayed' ? ' · Delayed' : ''}</Text>
                      </View>
                      <View style={[styles.radioDot, capState.msIdx === m.idx && styles.radioDotChosen]} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {capState.step === 1 && (
                <View>
                  <Text style={styles.fieldLabel}>Take Photo</Text>
                  <TouchableOpacity style={styles.cameraView} activeOpacity={0.85} onPress={capturePhoto} disabled={capState.capturing}>
                    <Ionicons name={capState.capturing ? 'hourglass-outline' : 'camera-outline'} size={48} color="rgba(255,255,255,0.55)" />
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5, fontWeight: '700', marginTop: 10 }}>
                      {capState.capturing ? 'Opening camera…' : 'Tap to open camera'}
                    </Text>
                    <View style={styles.gpsChip}>
                      <Ionicons name="location-outline" size={12} color="#F3C868" />
                      <Text style={styles.gpsChipText}>Location Not Available</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.hintText}>This opens your device's real camera. After you snap the photo, your GPS location will be locked automatically before you can proceed.</Text>
                </View>
              )}

              {capState.step === 2 && (
                <ScrollView>
                  <View style={[styles.cameraView, styles.cameraViewCaptured]}>
                    {capState.photoUri ? (
                      <Image source={{ uri: capState.photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                    ) : null}
                    <View style={styles.capturedOverlay}>
                      <Ionicons name="checkmark-circle" size={36} color="#fff" />
                      <Text style={{ color: '#fff', fontWeight: '700', marginTop: 6 }}>Photo Captured</Text>
                    </View>
                  </View>
                  <View style={styles.card}>
                    <View style={styles.rowBetween}><Text style={styles.miniLbl}>GPS Coordinates</Text><Text style={styles.monoVal}>{capState.gpsVal || '—'}</Text></View>
                    <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Timestamp</Text><Text style={styles.monoVal}>{capState.timeVal || '—'}</Text></View>
                  </View>
                  <Text style={styles.fieldLabel}>Remarks</Text>
                  <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Add site remarks" />
                  <TouchableOpacity
                    style={[styles.primaryBtn, { marginTop: 16, marginBottom: 20 }]}
                    onPress={() => setCapState((s) => ({ ...s, step: 3 }))}
                  >
                    <Text style={styles.primaryBtnText}>Submit Evidence</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}

              {capState.step === 3 && (
                <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                  <View style={styles.verifiedIconWrap}><Ionicons name="checkmark" size={32} color={COLORS.success} /></View>
                  <Text style={[styles.listTitle, { fontSize: 17, marginTop: 12 }]}>Photo Uploaded</Text>
                  <Text style={styles.listSub}>{isOffline ? 'Saved offline — pending sync.' : 'Uploaded successfully — ready to raise the bill for this milestone.'}</Text>
                  <TouchableOpacity
                    style={[styles.primaryBtn, { marginTop: 20, width: '100%' }]}
                    onPress={() => { const pid = capState.projectId, idx = capState.msIdx; setCaptureSheet(false); setTimeout(() => openBillSubmit(pid, idx), 180); }}
                  >
                    <Text style={styles.primaryBtnText}>Proceed to Raise Bill</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.secondaryButton, { width: '100%' }]} onPress={() => setCaptureSheet(false)}>
                    <Text style={styles.secondaryButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* ===== FIELD ACTION MODAL (AE / DE / E) ===== */}
        <Modal visible={!!fieldAction} animationType="slide" transparent onRequestClose={() => setFieldAction(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              {fieldAction && (() => {
                const b = bills.find((x) => x.id === fieldAction.billId);
                if (!b) return null;
                const p = projectFor(b.projectId);
                const title = fieldAction.role === 'ae' ? 'Field Inspection' : fieldAction.role === 'de' ? 'DE Review' : 'E Approval';
                return (
                  <ScrollView style={{ maxHeight: '90%' }}>
                    <View style={styles.sheetHeaderRow}>
                      <Text style={styles.sheetTitleTxt}>{title}</Text>
                      <TouchableOpacity onPress={() => setFieldAction(null)}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
                    </View>

                    <View style={styles.card}>
                      <View style={styles.rowBetween}><Text style={styles.miniLbl}>Project</Text><Text style={styles.listTitle}>{p.id}</Text></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Milestone</Text><Text style={styles.listTitle}>{b.milestone}</Text></View>
                      <View style={[styles.rowBetween, { marginTop: 8 }]}><Text style={styles.miniLbl}>Location</Text><Text style={styles.listTitle}>{p.location}</Text></View>
                    </View>

                    {fieldAction.role === 'ae' && (
                      <>
                        <Text style={styles.sectionLabel}>Contractor Photos</Text>
                        <View style={styles.card}><Text style={styles.hintText}>1 geotagged photograph submitted for this stage. Use Milestones camera capture to add additional site photographs.</Text></View>
                        <Text style={styles.fieldLabel}>Physical Progress Update (%)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={fieldForm.progress} onChangeText={(v) => setFieldForm((f) => ({ ...f, progress: v }))} />
                        <Text style={styles.fieldLabel}>Field Observations</Text>
                        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Site condition, quality observations" value={fieldForm.notes} onChangeText={(v) => setFieldForm((f) => ({ ...f, notes: v }))} />
                        <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8, marginBottom: 20 }]} onPress={() => submitFieldAction('ae')}>
                          <Text style={styles.primaryBtnText}>Submit Field Verification</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {fieldAction.role === 'de' && (
                      <>
                        <Text style={styles.sectionLabel}>AE Field Report</Text>
                        <View style={styles.card}><Text style={styles.hintText}>Inspector: S. Naveen Reddy · Progress: 100% · "Work verified against approved drawing. No visible defects."</Text></View>
                        <Text style={styles.fieldLabel}>DE Recommendation</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                          {['Approve', 'Send Back'].map((opt) => (
                            <TouchableOpacity key={opt} style={[styles.filterChip, { marginRight: 0, flex: 1, alignItems: 'center' }, fieldForm.recommendation === opt && styles.filterChipActive]} onPress={() => setFieldForm((f) => ({ ...f, recommendation: opt }))}>
                              <Text style={[styles.filterChipText, fieldForm.recommendation === opt && styles.filterChipTextActive]}>{opt}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <Text style={styles.fieldLabel}>Notes</Text>
                        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Review notes" value={fieldForm.notes} onChangeText={(v) => setFieldForm((f) => ({ ...f, notes: v }))} />
                        <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8, marginBottom: 20 }]} onPress={() => submitFieldAction('de')}>
                          <Text style={styles.primaryBtnText}>Submit for Approval</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {fieldAction.role === 'e' && (
                      <>
                        <Text style={styles.sectionLabel}>DE Recommendation</Text>
                        <View style={styles.card}><Text style={styles.hintText}>Recommendation: Approve · "AE findings consistent with site records."</Text></View>
                        <Text style={styles.fieldLabel}>Rejection Reason (required if rejecting)</Text>
                        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Required only if you reject this bill" value={fieldForm.notes} onChangeText={(v) => setFieldForm((f) => ({ ...f, notes: v }))} />
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                          <TouchableOpacity
                            style={[styles.outlineBtn, { borderColor: COLORS.danger }]}
                            onPress={() => { if (!fieldForm.notes.trim()) return; submitFieldAction('e_reject'); }}
                          >
                            <Text style={[styles.outlineBtnText, { color: COLORS.danger }]}>Reject</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.primaryBtn} onPress={() => submitFieldAction('e_approve')}>
                            <Text style={styles.primaryBtnText}>Accept</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </ScrollView>
                );
              })()}
            </View>
          </View>
        </Modal>

        {/* ===== NOTIFICATIONS OVERLAY ===== */}
        {showNotifs && (
          <View style={styles.sheet}>
            <View style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitleTxt}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifs(false)}><Text style={styles.closeBtn}>Close</Text></TouchableOpacity>
            </View>
            <ScrollView style={styles.sheetContent}>
              {NOTIFS.map((n, idx) => (
                <View key={idx} style={[styles.card, !n.read && { borderColor: COLORS.navy2, backgroundColor: '#F5F8FC' }]}>
                  <Text style={styles.bname}>{n.title}</Text>
                  <Text style={[styles.geoText, { marginTop: 4 }]}>{n.text}</Text>
                  <Text style={[styles.geoText, { marginTop: 8, color: COLORS.textFaint }]}>{n.time}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ==========================================
// STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  header: { backgroundColor: COLORS.navy, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 10, elevation: 6 },
  headerTitle: { color: '#fff', fontSize: 19, fontWeight: '800' },
  headerSub: { color: '#AFC0DA', fontSize: 12, marginTop: 2 },
  logoutBtn: { color: '#F3C868', fontWeight: '700', fontSize: 13 },
  notifDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.danger, borderWidth: 1.5, borderColor: COLORS.navy },

  offlineBanner: { backgroundColor: COLORS.warningSoft, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 18, paddingVertical: 9 },
  offlineText: { color: COLORS.warning, fontSize: 12, fontWeight: '700' },

  scrollArea: { flex: 1, paddingHorizontal: 16, paddingTop: 14 },
  sectionLabel: { fontSize: 11.5, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', color: COLORS.textFaint, marginBottom: 10, marginTop: 18 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  kpiCard: { flexBasis: '47%', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, shadowColor: '#12233F', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  kpiLbl: { fontSize: 10.5, fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase' },
  kpiVal: { fontFamily: 'monospace', fontSize: 18, fontWeight: '800', color: COLORS.navy, marginTop: 6, letterSpacing: 0.2 },

  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 14, marginBottom: 12, shadowColor: '#12233F', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  listIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.tealSoft, justifyContent: 'center', alignItems: 'center' },
  listTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  listSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  emptyNote: { textAlign: 'center', padding: 24, color: COLORS.textFaint, fontSize: 13 },

  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  badgeDot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  searchbar: { marginBottom: 12 },
  searchInput: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, height: 44, paddingHorizontal: 14, backgroundColor: COLORS.surface, fontSize: 14 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.surface, marginRight: 8 },
  filterChipActive: { backgroundColor: COLORS.navy2, borderColor: COLORS.navy2 },
  filterChipText: { fontSize: 12.5, fontWeight: '700', color: COLORS.textMuted },
  filterChipTextActive: { color: '#fff' },

  projCard: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#12233F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  pid: { fontFamily: 'monospace', fontSize: 12.5, fontWeight: '600', color: COLORS.navy },
  bname: { fontSize: 14.5, fontWeight: '800', color: COLORS.text, marginTop: 3 },
  geoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  geoText: { fontSize: 11.5, color: COLORS.textMuted },
  miniLbl: { fontSize: 10.5, fontWeight: '700', color: COLORS.textMuted },
  miniTrack: { height: 5, backgroundColor: '#EEF1F6', borderRadius: 100, overflow: 'hidden', marginTop: 4 },
  miniFill: { height: '100%', borderRadius: 100 },
  footRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  rejectText: { fontSize: 12, color: COLORS.danger, marginTop: 6 },

  avatar: { width: 50, height: 50, borderRadius: 16, backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#0A1322', fontWeight: '800', fontSize: 18 },
  menuCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  dangerButton: { borderWidth: 1, borderColor: COLORS.danger, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  dangerButtonText: { color: COLORS.danger, fontWeight: '700' },

  tabBar: { flexDirection: 'row', height: 62, backgroundColor: COLORS.surface, borderTopWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textFaint, marginTop: 2 },
  tabLabelActive: { color: COLORS.navy2, fontWeight: '800' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.bg, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18, maxHeight: '90%' },
  sheetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sheetTitleTxt: { fontSize: 17, fontWeight: '800', color: COLORS.navy, textAlign: 'center', flex: 1 },
  closeCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  msDesc: { fontSize: 13, color: COLORS.textMuted, lineHeight: 19 },

  fieldLabel: { fontSize: 11.5, fontWeight: '700', color: COLORS.textMuted, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 4 },
  input: { borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, height: 48, paddingHorizontal: 14, backgroundColor: COLORS.surface, fontSize: 15, marginBottom: 14 },
  textArea: { height: 90, textAlignVertical: 'top', paddingTop: 12 },
  warnBox: { backgroundColor: COLORS.dangerSoft, borderRadius: 10, padding: 12, marginBottom: 14 },
  warnBoxText: { color: COLORS.danger, fontSize: 12 },
  okBox: { backgroundColor: COLORS.successSoft, borderRadius: 10, padding: 12, marginBottom: 14 },
  okBoxText: { color: COLORS.success, fontSize: 12 },
  monoVal: { fontFamily: 'monospace', fontSize: 13, fontWeight: '700', color: COLORS.text },

  primaryBtn: { flex: 1, backgroundColor: COLORS.navy2, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14.5 },
  outlineBtn: { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  outlineBtnText: { color: COLORS.navy2, fontWeight: '700', fontSize: 14 },
  secondaryButton: { height: 44, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  secondaryButtonText: { color: COLORS.navy2, fontWeight: '700' },

  stepperTrack: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  stepDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#EEF1F6', borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  stepDotDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  stepDotCurrent: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  stepDotText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border },
  stepLineDone: { backgroundColor: COLORS.success },

  selectTile: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, marginBottom: 10, backgroundColor: COLORS.surface },
  selectTileChosen: { borderColor: COLORS.navy3, backgroundColor: '#F5F8FC' },
  radioDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border },
  radioDotChosen: { borderColor: COLORS.navy2, backgroundColor: COLORS.navy2 },

  cameraView: { backgroundColor: '#0b1220', borderRadius: 20, height: 260, position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  cameraViewCaptured: { backgroundColor: '#274d61' },
  capturedOverlay: { alignItems: 'center', backgroundColor: 'rgba(10,19,34,0.35)', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14 },
  gpsChip: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 100, paddingHorizontal: 11, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5 },
  gpsChipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  shutter: { position: 'absolute', bottom: 16, width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', borderWidth: 4, borderColor: 'rgba(255,255,255,0.35)' },
  hintText: { fontSize: 11.5, color: COLORS.textFaint },
  verifiedIconWrap: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.successSoft, justifyContent: 'center', alignItems: 'center' },

  sheet: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.bg, padding: 18, paddingTop: 50 },
  sheetContent: { flex: 1 },
  closeBtn: { color: COLORS.navy2, fontWeight: '700' },

  newBillBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.navy2, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, shadowColor: COLORS.navy2, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3 },
  newBillBtnText: { color: '#fff', fontWeight: '700', fontSize: 12.5 },

  roleSafeArea: { flex: 1, backgroundColor: COLORS.bg },
  roleScroll: { flex: 1, paddingHorizontal: 22, paddingTop: 18 },
  roleHeading: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  roleSubheading: { fontSize: 13, color: COLORS.textMuted, marginTop: 8, marginBottom: 26, lineHeight: 19 },
  roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 16, padding: 18, marginBottom: 14, shadowColor: '#12233F', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 3 },
  roleIconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.tealSoft, justifyContent: 'center', alignItems: 'center' },
  roleCardTitle: { fontSize: 15.5, fontWeight: '800', color: COLORS.text },
  roleCardSub: { fontSize: 12.5, color: COLORS.textMuted, marginTop: 3 },

  dropdownField: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, height: 50, paddingHorizontal: 14, backgroundColor: COLORS.surface, marginBottom: 14 },
  dropdownFieldText: { fontSize: 14.5, color: COLORS.navy2, fontWeight: '700', flex: 1, marginRight: 8 },
  dropdownList: { backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, marginTop: -8, marginBottom: 14, overflow: 'hidden' },
  dropdownOption: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dropdownOptionText: { fontSize: 13.5, color: COLORS.text, fontWeight: '600' },

  dateFieldWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, height: 50, paddingHorizontal: 14, backgroundColor: COLORS.surface, marginBottom: 14 },
  dateFieldInput: { flex: 1, fontSize: 15, color: COLORS.text },

  amountFieldWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 12, height: 50, backgroundColor: COLORS.surface, marginBottom: 14, overflow: 'hidden' },
  amountPrefix: { paddingHorizontal: 14, color: COLORS.textMuted, fontWeight: '700', fontSize: 14.5, borderRightWidth: 1.5, borderRightColor: COLORS.border, height: '100%', textAlignVertical: 'center', lineHeight: 47 },
  amountFieldInput: { flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 15, color: COLORS.text },

  attachBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, height: 46, borderRadius: 12 },
  attachBtnText: { color: COLORS.navy2, fontWeight: '700', fontSize: 12.5 },

  geoPhotoCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 12, backgroundColor: '#0b1220', height: 190, position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 2 },
  geoPhotoImg: { width: '100%', height: '100%' },
  geoPhotoOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 10, backgroundColor: 'rgba(10,19,34,0.55)' },
  geoPinRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  geoPinText: { color: '#fff', fontSize: 11.5, fontWeight: '700', fontFamily: 'monospace' },
  geoTimeText: { color: '#D9E2F1', fontSize: 10.5, marginTop: 3 },
  geoBadgeCorner: { position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  geoExpandHint: { position: 'absolute', top: 10, left: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },

  fullImageOverlay: { flex: 1, backgroundColor: 'rgba(4,8,16,0.96)', justifyContent: 'center', alignItems: 'center' },
  fullImageCloseBtn: { position: 'absolute', top: 50, right: 20, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  fullImage: { width: '100%', height: '70%' },
  fullImageCaption: { position: 'absolute', bottom: 50, left: 24, right: 24, alignItems: 'center' },
  fullImageCaptionText: { color: '#fff', fontSize: 13, fontWeight: '700', fontFamily: 'monospace' },
  fullImageCaptionSub: { color: '#D9E2F1', fontSize: 12, marginTop: 5, textAlign: 'center' },
});