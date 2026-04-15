import React, { useState, useEffect } from 'react';
import {
  FlaskConical, Search, CheckCircle2, AlertTriangle, Clock, FileText,
  Printer, Send, Download, Eye, BarChart3, Beaker, RefreshCw,
  Activity, ShieldAlert, TrendingUp, TrendingDown, X,
  Package, Wifi, Settings, Bell, Plus
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Legend
} from 'recharts';

interface LabTest {
  id: string; barcode: string; patient: string; tc: string; age: string; gender: string;
  requestDept: string; requestDoctor: string; requestTime: string;
  panel: string; tests: { name: string; result: string; unit: string; refLow: number; refHigh: number; flag: '' | 'H' | 'L' | 'C' | 'P'; prevResult?: string; deltaFlag?: boolean }[];
  status: 'Numune Kabul' | 'Çalışılıyor' | 'Onay Bekliyor' | 'Onaylandı' | 'Tamamlandı' | 'Ret';
  sampleType: string; priority: 'Normal' | 'Acil' | 'Cito';
  panic: boolean; hemolyzed: boolean; lipemic: boolean; icteric: boolean;
  analyzer: string; runTime: string;
  approvedBy: string; approvedAt: string;
  notes: string; tatTarget: number; tatActual: number;
  sampleAcceptTime: string; labNo: string;
  sutCode: string; medulaSync: boolean;
}

const mockTests: LabTest[] = [
  {
    id: 'L-20260407-001', barcode: '2026040700001', labNo: 'LAB-001', patient: 'Ayşe Yılmaz', tc: '123***456', age: '41', gender: 'K',
    requestDept: 'Dahiliye', requestDoctor: 'Uzm. Dr. Ahmet K.', requestTime: '09:15',
    panel: 'Hemogram', sampleType: 'EDTA Kan', priority: 'Normal', panic: false, hemolyzed: false, lipemic: false, icteric: false,
    analyzer: 'Sysmex XN-1000', runTime: '09:45', approvedBy: '', approvedAt: '',
    status: 'Onay Bekliyor', tatTarget: 60, tatActual: 45, sampleAcceptTime: '09:20',
    sutCode: 'A050010', medulaSync: true,
    tests: [
      { name: 'WBC', result: '11.2', unit: '10³/µL', refLow: 4.0, refHigh: 10.0, flag: 'H', prevResult: '9.8', deltaFlag: false },
      { name: 'RBC', result: '4.5', unit: '10⁶/µL', refLow: 3.8, refHigh: 5.1, flag: '', prevResult: '4.4' },
      { name: 'Hgb', result: '12.8', unit: 'g/dL', refLow: 12.0, refHigh: 16.0, flag: '', prevResult: '13.1' },
      { name: 'Hct', result: '38.5', unit: '%', refLow: 36.0, refHigh: 46.0, flag: '', prevResult: '39.2' },
      { name: 'PLT', result: '245', unit: '10³/µL', refLow: 150, refHigh: 400, flag: '' },
      { name: 'MCV', result: '85.6', unit: 'fL', refLow: 80.0, refHigh: 100.0, flag: '' },
      { name: 'Nötrofil', result: '72', unit: '%', refLow: 40, refHigh: 70, flag: 'H', prevResult: '65' },
      { name: 'Lenfosit', result: '18', unit: '%', refLow: 20, refHigh: 40, flag: 'L', prevResult: '24' },
    ],
    notes: ''
  },
  {
    id: 'L-20260407-002', barcode: '2026040700002', labNo: 'LAB-002', patient: 'Mehmet Demir', tc: '234***567', age: '61', gender: 'E',
    requestDept: 'Acil Servis', requestDoctor: 'Dr. Hakan Ç.', requestTime: '09:30',
    panel: 'Biyokimya Acil Paneli', sampleType: 'Serum (Biyokimya)', priority: 'Acil', panic: true, hemolyzed: false, lipemic: false, icteric: false,
    analyzer: 'Beckman AU5800', runTime: '10:00', approvedBy: '', approvedAt: '',
    status: 'Onay Bekliyor', tatTarget: 30, tatActual: 35, sampleAcceptTime: '09:35',
    sutCode: 'A050020', medulaSync: true,
    tests: [
      { name: 'Glukoz', result: '245', unit: 'mg/dL', refLow: 70, refHigh: 100, flag: 'H', prevResult: '198', deltaFlag: true },
      { name: 'Üre (BUN)', result: '52', unit: 'mg/dL', refLow: 17, refHigh: 43, flag: 'H', prevResult: '38' },
      { name: 'Kreatinin', result: '2.8', unit: 'mg/dL', refLow: 0.7, refHigh: 1.3, flag: 'P', prevResult: '1.2', deltaFlag: true },
      { name: 'AST', result: '28', unit: 'U/L', refLow: 0, refHigh: 40, flag: '' },
      { name: 'ALT', result: '32', unit: 'U/L', refLow: 0, refHigh: 41, flag: '' },
      { name: 'Na', result: '138', unit: 'mEq/L', refLow: 136, refHigh: 145, flag: '' },
      { name: 'K', result: '5.8', unit: 'mEq/L', refLow: 3.5, refHigh: 5.1, flag: 'P', prevResult: '4.9', deltaFlag: true },
      { name: 'CRP', result: '85', unit: 'mg/L', refLow: 0, refHigh: 5, flag: 'C' },
    ],
    notes: 'PANİK DEĞER: Kreatinin 2.8 (↑1.6), K 5.8 — Klinisyen bilgilendirilecek!'
  },
  {
    id: 'L-20260407-003', barcode: '2026040700003', labNo: 'LAB-003', patient: 'Zeynep Kaya', tc: '345***678', age: '72', gender: 'K',
    requestDept: 'Yatan Hasta 302-A', requestDoctor: 'Uzm. Dr. Ahmet K.', requestTime: '08:00',
    panel: 'Tiroit Fonksiyon', sampleType: 'Serum (Hormon)', priority: 'Normal', panic: false, hemolyzed: false, lipemic: false, icteric: false,
    analyzer: 'Roche Cobas e801', runTime: '', approvedBy: '', approvedAt: '',
    status: 'Çalışılıyor', tatTarget: 120, tatActual: 70, sampleAcceptTime: '08:10',
    sutCode: 'A053010', medulaSync: true,
    tests: [
      { name: 'TSH', result: '8.5', unit: 'mIU/L', refLow: 0.27, refHigh: 4.2, flag: 'H' },
      { name: 'Serbest T4', result: '0.7', unit: 'ng/dL', refLow: 0.93, refHigh: 1.7, flag: 'L' },
      { name: 'Serbest T3', result: '2.1', unit: 'pg/mL', refLow: 2.0, refHigh: 4.4, flag: '' },
    ],
    notes: ''
  },
  {
    id: 'L-20260407-004', barcode: '2026040700004', labNo: 'LAB-004', patient: 'Ali Çelik', tc: '456***789', age: '55', gender: 'E',
    requestDept: 'Üroloji', requestDoctor: 'Uzm. Dr. Can S.', requestTime: '09:00',
    panel: 'Tam İdrar Tahlili (TİT)', sampleType: 'İdrar (Spot)', priority: 'Normal', panic: false, hemolyzed: false, lipemic: false, icteric: false,
    analyzer: 'Siemens Clinitek Novus', runTime: '', approvedBy: '', approvedAt: '',
    status: 'Numune Kabul', tatTarget: 60, tatActual: 20, sampleAcceptTime: '09:05',
    sutCode: 'A060010', medulaSync: false,
    tests: [
      { name: 'pH', result: '6.0', unit: '', refLow: 4.5, refHigh: 8.0, flag: '' },
      { name: 'Dansite', result: '1.025', unit: '', refLow: 1.005, refHigh: 1.030, flag: '' },
      { name: 'Protein', result: '(+)', unit: '', refLow: 0, refHigh: 0, flag: 'H' },
      { name: 'Eritrosit', result: '15-20', unit: '/HPF', refLow: 0, refHigh: 3, flag: 'H' },
      { name: 'Lökosit', result: '25-30', unit: '/HPF', refLow: 0, refHigh: 5, flag: 'H' },
    ],
    notes: ''
  },
  {
    id: 'L-20260407-005', barcode: '2026040700005', labNo: 'LAB-005', patient: 'Fatma Şahin', tc: '567***890', age: '50', gender: 'K',
    requestDept: 'Genel Cerrahi', requestDoctor: 'Op. Dr. Sinan K.', requestTime: '07:30',
    panel: 'Pre-op Panel (Hemogram + Koag)', sampleType: 'EDTA + Sitrat', priority: 'Normal', panic: false, hemolyzed: false, lipemic: false, icteric: false,
    analyzer: 'Sysmex XN-1000 / Stago STA-R', runTime: '08:15', approvedBy: 'Uzm. Dr. Biyokim. Elif D.', approvedAt: '08:45',
    status: 'Tamamlandı', tatTarget: 90, tatActual: 75, sampleAcceptTime: '07:35',
    sutCode: 'A050010', medulaSync: true,
    tests: [
      { name: 'WBC', result: '7.8', unit: '10³/µL', refLow: 4.0, refHigh: 10.0, flag: '' },
      { name: 'Hgb', result: '13.2', unit: 'g/dL', refLow: 12.0, refHigh: 16.0, flag: '' },
      { name: 'PLT', result: '268', unit: '10³/µL', refLow: 150, refHigh: 400, flag: '' },
      { name: 'PT', result: '12.5', unit: 'sn', refLow: 11.0, refHigh: 13.5, flag: '' },
      { name: 'INR', result: '1.05', unit: '', refLow: 0.8, refHigh: 1.2, flag: '' },
      { name: 'aPTT', result: '28', unit: 'sn', refLow: 25, refHigh: 36, flag: '' },
    ],
    notes: 'Pre-op panel. Koagülasyon normal. Ameliyata uygun.'
  },
  {
    id: 'L-20260407-006', barcode: '2026040700006', labNo: 'LAB-006', patient: 'Ayşe Koç', tc: '789***012', age: '78', gender: 'K',
    requestDept: 'Yoğun Bakım', requestDoctor: 'Uzm. Dr. Can Y.', requestTime: '06:00',
    panel: 'AKG (Arter Kan Gazı)', sampleType: 'Arteriyel Kan', priority: 'Cito', panic: true, hemolyzed: false, lipemic: false, icteric: false,
    analyzer: 'Radiometer ABL90 FLEX', runTime: '06:10', approvedBy: 'Otomatik Onay (AKG)', approvedAt: '06:10',
    status: 'Tamamlandı', tatTarget: 15, tatActual: 10, sampleAcceptTime: '06:02',
    sutCode: 'A090010', medulaSync: true,
    tests: [
      { name: 'pH', result: '7.28', unit: '', refLow: 7.35, refHigh: 7.45, flag: 'P' },
      { name: 'pCO2', result: '52', unit: 'mmHg', refLow: 35, refHigh: 45, flag: 'H' },
      { name: 'pO2', result: '58', unit: 'mmHg', refLow: 80, refHigh: 100, flag: 'P' },
      { name: 'HCO3', result: '24', unit: 'mEq/L', refLow: 22, refHigh: 26, flag: '' },
      { name: 'Laktat', result: '5.2', unit: 'mmol/L', refLow: 0.5, refHigh: 2.0, flag: 'P' },
      { name: 'BE', result: '-3.5', unit: 'mEq/L', refLow: -2, refHigh: 2, flag: 'L' },
      { name: 'SpO2', result: '88', unit: '%', refLow: 95, refHigh: 100, flag: 'P' },
    ],
    notes: 'PANİK: pH 7.28, pO2 58, Laktat 5.2. Klinisyen telefon ile bilgilendirildi (06:12).'
  },
];

const analyzerStatus = [
  { name: 'Sysmex XN-1000', type: 'Hematoloji', status: 'Çevrimiçi', pendingCount: 3, lastCalib: '07.04.2026 06:00', qcStatus: 'Geçti', uptime: '99.2' },
  { name: 'Beckman AU5800', type: 'Biyokimya', status: 'Çevrimiçi', pendingCount: 5, lastCalib: '07.04.2026 05:30', qcStatus: 'Geçti', uptime: '98.7' },
  { name: 'Roche Cobas e801', type: 'Hormon/İmmün', status: 'Çevrimiçi', pendingCount: 2, lastCalib: '07.04.2026 05:45', qcStatus: 'Geçti', uptime: '97.5' },
  { name: 'Stago STA-R Max', type: 'Koagülasyon', status: 'Çevrimiçi', pendingCount: 1, lastCalib: '07.04.2026 06:00', qcStatus: 'Geçti', uptime: '99.8' },
  { name: 'Radiometer ABL90', type: 'Kan Gazı', status: 'Çevrimiçi', pendingCount: 0, lastCalib: '07.04.2026 05:00', qcStatus: 'Geçti', uptime: '99.9' },
  { name: 'Siemens Clinitek', type: 'İdrar', status: 'Kalibrasyon', pendingCount: 0, lastCalib: '07.04.2026 07:15', qcStatus: 'Bekliyor', uptime: '96.3' },
];

const qcData = [
  { run: '1', L1: 4.85, L2: 7.42, target1: 4.9, target2: 7.5, sd1: 0.15, sd2: 0.22 },
  { run: '2', L1: 4.92, L2: 7.38, target1: 4.9, target2: 7.5 },
  { run: '3', L1: 4.78, L2: 7.55, target1: 4.9, target2: 7.5 },
  { run: '4', L1: 5.05, L2: 7.62, target1: 4.9, target2: 7.5 },
  { run: '5', L1: 4.88, L2: 7.45, target1: 4.9, target2: 7.5 },
  { run: '6', L1: 4.95, L2: 7.48, target1: 4.9, target2: 7.5 },
  { run: '7', L1: 4.82, L2: 7.32, target1: 4.9, target2: 7.5 },
  { run: '8', L1: 4.90, L2: 7.50, target1: 4.9, target2: 7.5 },
];

const tatData = [
  { panel: 'Hemogram', target: 60, actual: 42 },
  { panel: 'Biyokimya', target: 60, actual: 55 },
  { panel: 'Koagülasyon', target: 90, actual: 72 },
  { panel: 'AKG', target: 15, actual: 10 },
  { panel: 'Hormon', target: 120, actual: 98 },
  { panel: 'İdrar TİT', target: 60, actual: 38 },
];

const panicLog = [
  { time: '06:12', test: 'AKG — pH 7.28, pO2 58', patient: 'Ayşe Koç (YBÜ-03)', notifiedBy: 'Uzm. Bio. Elif D.', notifiedDoctor: 'Uzm. Dr. Can Y.', method: 'Telefon', ack: true },
  { time: '10:05', test: 'K 5.8, Kreatinin 2.8', patient: 'Mehmet Demir (Acil)', notifiedBy: 'Uzm. Bio. Elif D.', notifiedDoctor: 'Dr. Hakan Ç.', method: 'Telefon', ack: false },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', orange: 'bg-orange-50 text-orange-700 border-orange-100'
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children, size = 'xl' }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: string }) {
  if (!open) return null;
  const maxW = size === '2xl' ? 'max-w-6xl' : size === 'xl' ? 'max-w-5xl' : 'max-w-3xl';
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${maxW} w-full max-h-[92vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function TatBar({ target, actual }: { target: number; actual: number }) {
  const pct = Math.min((actual / target) * 100, 100);
  const color = actual <= target * 0.8 ? 'bg-emerald-500' : actual <= target ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="w-24">
      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between mt-0.5">
        <span className={`text-[9px] font-bold ${actual > target ? 'text-red-600' : 'text-emerald-600'}`}>{actual}dk</span>
        <span className="text-[9px] text-slate-400">/{target}dk</span>
      </div>
    </div>
  );
}

export function LaboratoryLIS() {
  const [tests, setTests] = useState(mockTests);
  const [activeTab, setActiveTab] = useState('worklist');
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [searchText, setSearchText] = useState('');
  const [worklistFilter, setWorklistFilter] = useState('tumu');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [panikLog, setPanikLog] = useState(panicLog);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const pendingApproval = tests.filter(t => t.status === 'Onay Bekliyor').length;
  const panicCount = tests.filter(t => t.panic && t.status !== 'Tamamlandı').length;
  const workingCount = tests.filter(t => t.status === 'Çalışılıyor' || t.status === 'Numune Kabul').length;
  const completedCount = tests.filter(t => t.status === 'Tamamlandı').length;
  const tatOverdue = tests.filter(t => t.tatActual > t.tatTarget && !['Tamamlandı'].includes(t.status)).length;

  const filtered = tests.filter(t => {
    if (worklistFilter === 'onay' && t.status !== 'Onay Bekliyor') return false;
    if (worklistFilter === 'panik' && !t.panic) return false;
    if (worklistFilter === 'calisan' && t.status !== 'Çalışılıyor' && t.status !== 'Numune Kabul') return false;
    if (worklistFilter === 'tamamlanan' && t.status !== 'Tamamlandı') return false;
    if (searchText && !t.patient.toLowerCase().includes(searchText.toLowerCase()) && !t.barcode.includes(searchText) && !t.labNo.includes(searchText)) return false;
    return true;
  });

  const handleApprove = (id: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'Tamamlandı' as const, approvedBy: 'Uzm. Dr. Biyokim. Elif D.', approvedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) } : t));
    setSelectedTest(null);
  };

  const handleSampleAccept = () => {
    if (!scannedBarcode.trim()) return;
    const found = tests.find(t => t.barcode.includes(scannedBarcode) || t.labNo.includes(scannedBarcode));
    if (found && found.status === 'Numune Kabul') {
      setTests(prev => prev.map(t => t.id === found.id ? { ...t, status: 'Çalışılıyor' as const } : t));
    }
    setScannedBarcode('');
    setShowBarcodeModal(false);
  };

  const handlePanikAck = (idx: number) => {
    setPanikLog(prev => prev.map((p, i) => i === idx ? { ...p, ack: true } : p));
  };

  const statusColor = (s: string) => s === 'Onay Bekliyor' ? 'blue' : s === 'Çalışılıyor' ? 'amber' : s === 'Numune Kabul' ? 'slate' : s === 'Tamamlandı' ? 'green' : s === 'Ret' ? 'red' : 'purple';
  const flagColor = (f: string) => f === 'H' ? 'text-red-600' : f === 'L' ? 'text-blue-600' : f === 'C' ? 'text-amber-600' : f === 'P' ? 'text-red-800 font-black' : '';

  const tabs = [
    { id: 'worklist', label: 'Test İş Listesi' },
    { id: 'numune', label: 'Numune Kabul' },
    { id: 'analizor', label: 'Analizör Durumu' },
    { id: 'qc', label: 'İç Kalite Kontrol' },
    { id: 'tat', label: 'TAT Analizi' },
    { id: 'panik', label: `Panik Yönetimi${panicCount > 0 ? ` (${panicCount})` : ''}` },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Laboratuvar Bilgi Sistemi (LIS)</h2>
          <p className="text-sm text-slate-500">HL7/ASTM cihaz entegrasyonu • MEDULA SUT kodlama • Panik değer yönetimi • İç kalite kontrol</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
            <Wifi size={12} /> HL7 Bağlı
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-700">
            <ShieldAlert size={12} /> MEDULA Aktif
          </div>
          <button onClick={() => setShowBarcodeModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm">
            <Package size={16} /> Numune Kabul
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-[10px] font-bold text-blue-700 uppercase">Onay Bekliyor</p>
          <div className="text-2xl font-black text-blue-600">{pendingApproval}</div>
        </div>
        <div className={twMerge("p-3 rounded-xl border shadow-sm", panicCount > 0 ? "bg-red-50 border-red-300 animate-pulse" : "bg-white border-slate-200")}>
          <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1"><AlertTriangle size={12} /> PANİK Değer</p>
          <div className="text-2xl font-black text-red-600">{panicCount}</div>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1"><Clock size={12} /> Çalışılan/Kabul</p>
          <div className="text-2xl font-black text-amber-600">{workingCount}</div>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-700 uppercase">Tamamlanan</p>
          <div className="text-2xl font-black text-emerald-600">{completedCount}</div>
        </div>
        <div className={twMerge("p-3 rounded-xl border shadow-sm", tatOverdue > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-slate-200")}>
          <p className="text-[10px] font-bold text-orange-700 uppercase flex items-center gap-1"><Clock size={12} /> TAT Aşıldı</p>
          <div className="text-2xl font-black text-orange-600">{tatOverdue}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl flex-none overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={twMerge("px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors",
              activeTab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'worklist' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 flex-none">
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-2 text-slate-400" size={14} />
                <input type="text" placeholder="Barkod, Hasta, Lab No..." value={searchText} onChange={e => setSearchText(e.target.value)}
                  className="pl-8 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 w-52 shadow-sm" />
              </div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg gap-0.5">
              {[
                { id: 'tumu', label: 'Tümü', count: tests.length },
                { id: 'onay', label: 'Onay Bek.', count: pendingApproval },
                { id: 'panik', label: 'Panik', count: panicCount },
                { id: 'calisan', label: 'Çalışılan', count: workingCount },
                { id: 'tamamlanan', label: 'Tamam', count: completedCount },
              ].map(tab => (
                <button key={tab.id} onClick={() => setWorklistFilter(tab.id)}
                  className={twMerge("px-2.5 py-1.5 text-[10px] font-bold rounded-md transition-colors",
                    worklistFilter === tab.id ? (tab.id === 'panik' ? 'bg-red-500 text-white' : tab.id === 'onay' ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 shadow-sm') : (tab.id === 'panik' ? 'text-red-500' : 'text-slate-500'))}>
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase w-28">Lab No / Barkod</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Hasta</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Panel / Numune</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Analizör</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">TAT</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Durum</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(test => (
                  <tr key={test.id} onClick={() => setSelectedTest(test)}
                    className={twMerge("transition-colors hover:bg-slate-50 cursor-pointer",
                      test.panic ? "bg-red-50/40" : "",
                      test.status === 'Tamamlandı' ? "opacity-60" : "")}>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-600 text-xs">{test.labNo}</span>
                      <div className="text-[9px] text-slate-400 font-mono">{test.barcode.slice(-8)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5 flex-wrap">
                        {test.patient}
                        {test.panic && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded animate-pulse font-black">PANİK</span>}
                        {test.priority !== 'Normal' && <Badge color="red">{test.priority}</Badge>}
                        {test.tests.some(t => t.deltaFlag) && <Badge color="orange">Δ Delta</Badge>}
                      </div>
                      <div className="text-[10px] text-slate-500">{test.requestDept} • {test.requestDoctor} • {test.requestTime}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700 text-sm">{test.panel}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        {test.sampleType}
                        {test.hemolyzed && <span className="text-red-500 font-bold">HEMOLİZ</span>}
                        {test.lipemic && <span className="text-amber-500 font-bold">LİPEMİK</span>}
                        {test.icteric && <span className="text-yellow-600 font-bold">İKTERİK</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-slate-600">{test.analyzer || '—'}</div>
                      {test.runTime && <div className="text-[10px] text-slate-400">Çalışma: {test.runTime}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <TatBar target={test.tatTarget} actual={test.tatActual} />
                    </td>
                    <td className="py-3 px-4">
                      <Badge color={statusColor(test.status)}>{test.status}</Badge>
                      {test.medulaSync && <div className="text-[9px] text-emerald-600 mt-0.5 font-semibold">MEDULA ✓</div>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {test.status === 'Onay Bekliyor' ? (
                        <button onClick={e => { e.stopPropagation(); setSelectedTest(test); }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 shadow-sm">Sonuç & Onayla</button>
                      ) : (
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={14} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'numune' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Package className="text-blue-500" size={20} /> Numune Kabul ve Barkod Okutma</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-600 mb-2">Barkod Okut / Numune Kabul</p>
                  <div className="flex gap-2">
                    <input type="text" value={barcodeInput} onChange={e => setBarcodeInput(e.target.value)}
                      placeholder="Barkod numarası veya LAB No girin..."
                      className="flex-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={e => { if (e.key === 'Enter') { setScannedBarcode(barcodeInput); setBarcodeInput(''); setShowBarcodeModal(true); } }}
                    />
                    <button onClick={() => { setScannedBarcode(barcodeInput); setBarcodeInput(''); setShowBarcodeModal(true); }}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Kabul</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-600">Numune Kabul Bekleyen İstekler</p>
                  {tests.filter(t => t.status === 'Numune Kabul').map(t => (
                    <div key={t.id} className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{t.patient} — {t.panel}</p>
                        <p className="text-[10px] text-slate-500">{t.labNo} • {t.barcode.slice(-8)} • {t.requestDept}</p>
                      </div>
                      <button onClick={() => setTests(prev => prev.map(tt => tt.id === t.id ? { ...tt, status: 'Çalışılıyor' as const } : tt))}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">Kabul Et</button>
                    </div>
                  ))}
                  {tests.filter(t => t.status === 'Numune Kabul').length === 0 && (
                    <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <CheckCircle2 size={24} className="mx-auto mb-1 text-emerald-400" />
                      <p className="text-xs">Tüm numuneler kabul edildi</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-600">Numune Red Kriterleri (ISO 15189)</p>
                {[
                  { reason: 'Hemolizli Numune', icon: '🔴', action: 'Yeni numune alınması talep edilir' },
                  { reason: 'Koagüle EDTA Tüp', icon: '⚫', action: 'Yeni numune — hematokrit değerlendirilemez' },
                  { reason: 'Yetersiz Hacim', icon: '🟡', action: 'Yetersiz numune formu doldurulur' },
                  { reason: 'Yanlış Tüp', icon: '⚪', action: 'Doğru tüp türü ile yeni istek' },
                  { reason: 'Etiket Uyumsuzluğu', icon: '🟠', action: 'Hasta kimliği yeniden doğrulanır' },
                  { reason: 'SKT Geçmiş Tüp', icon: '🟤', action: 'Tüp değiştirilir, yeni kabul' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-lg">{r.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{r.reason}</p>
                      <p className="text-[10px] text-slate-500">{r.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analizor' && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyzerStatus.map((a, i) => (
              <div key={i} className={twMerge("bg-white rounded-xl border shadow-sm p-4",
                a.status === 'Kalibrasyon' ? 'border-amber-300' : a.status === 'Hata' ? 'border-red-300' : 'border-slate-200')}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-slate-800">{a.name}</h4>
                    <p className="text-xs text-slate-500">{a.type}</p>
                  </div>
                  <div className={twMerge("flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold",
                    a.status === 'Çevrimiçi' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      a.status === 'Kalibrasyon' ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' :
                        'bg-red-50 text-red-700 border border-red-200')}>
                    {a.status === 'Çevrimiçi' ? <Wifi size={12} /> : <Settings size={12} />}
                    {a.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-50 p-2 rounded-lg"><span className="text-slate-500 block">Bekleyen Test</span><span className="font-bold text-slate-800">{a.pendingCount}</span></div>
                  <div className="bg-slate-50 p-2 rounded-lg"><span className="text-slate-500 block">Son Kalibrasyon</span><span className="font-bold text-slate-800">{a.lastCalib}</span></div>
                  <div className={`p-2 rounded-lg ${a.qcStatus === 'Geçti' ? 'bg-emerald-50' : 'bg-amber-50'}`}><span className="text-slate-500 block">QC Durumu</span><span className={`font-bold ${a.qcStatus === 'Geçti' ? 'text-emerald-700' : 'text-amber-700'}`}>{a.qcStatus}</span></div>
                  <div className="bg-slate-50 p-2 rounded-lg"><span className="text-slate-500 block">Uptime</span><span className="font-bold text-slate-800">%{a.uptime}</span></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 py-1.5 text-[10px] font-semibold bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600">Kalibrasyon</button>
                  <button className="flex-1 py-1.5 text-[10px] font-semibold bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600">QC Çalıştır</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'qc' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Levey-Jennings Grafiği — Biyokimya QC (Glukoz Kontrol 1 & 2)</h3>
              <div className="flex gap-2 text-[10px] font-semibold">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200">Kontrol-1 (4.9 mmol/L)</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">Kontrol-2 (7.5 mmol/L)</span>
              </div>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={qcData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="run" tick={{ fontSize: 11 }} label={{ value: 'Çalışma', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[4.5, 8.0]} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <ReferenceLine y={4.9} stroke="#3b82f6" strokeDasharray="4 4" strokeWidth={1} />
                  <ReferenceLine y={5.2} stroke="#ef4444" strokeDasharray="2 2" strokeWidth={1} label={{ value: '+2SD', fontSize: 9, fill: '#ef4444' }} />
                  <ReferenceLine y={4.6} stroke="#ef4444" strokeDasharray="2 2" strokeWidth={1} label={{ value: '-2SD', fontSize: 9, fill: '#ef4444' }} />
                  <ReferenceLine y={7.5} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1} />
                  <Line type="monotone" dataKey="L1" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} name="Kontrol-1" />
                  <Line type="monotone" dataKey="L2" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} name="Kontrol-2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { rule: 'Westgard 1₂s', status: 'Geçti', desc: 'Tek değer ±2SD içinde' },
                { rule: 'Westgard 1₃s', status: 'Geçti', desc: 'Tek değer ±3SD dışında değil' },
                { rule: 'Westgard 2₂s', status: 'Geçti', desc: 'Ardışık 2 değer aynı yönde ±2SD' },
              ].map((r, i) => (
                <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-emerald-700">{r.rule}</p>
                  <p className="text-emerald-600 font-black text-sm mt-0.5">✓ {r.status}</p>
                  <p className="text-[9px] text-emerald-600 mt-0.5">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tat' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 mb-4">TAT (Sonuç Süreleri) — Panel Bazında Performans (dakika)</h3>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tatData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="panel" type="category" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="target" fill="#e2e8f0" name="Hedef TAT (dk)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="actual" fill="#3b82f6" name="Gerçekleşen TAT (dk)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {tatData.map((t, i) => (
                <div key={i} className={`p-3 rounded-xl border ${t.actual <= t.target ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-xs font-bold text-slate-700">{t.panel}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-lg font-black ${t.actual <= t.target ? 'text-emerald-700' : 'text-red-700'}`}>{t.actual} dk</span>
                    <span className="text-[10px] text-slate-500">Hedef: {t.target} dk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'panik' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-red-50/50 flex items-center gap-2">
              <Bell className="text-red-500" size={18} />
              <h3 className="font-bold text-slate-800">Panik Değer Bildirim Kaydı</h3>
              <span className="text-xs text-slate-500 ml-2">CAP/CLSI EP23 uyumlu — Bildirilen her panik değer kayıt altına alınmalıdır</span>
            </div>
            <div className="divide-y divide-slate-100">
              {panikLog.map((p, i) => (
                <div key={i} className={`p-4 ${!p.ack ? 'bg-red-50/30' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold font-mono text-slate-500">{p.time}</span>
                        {!p.ack && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded animate-pulse font-black">ONAY BEKLİYOR</span>}
                        {p.ack && <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded font-black">ONAYLANDI ✓</span>}
                      </div>
                      <p className="text-sm font-bold text-slate-800">{p.patient}</p>
                      <p className="text-xs text-red-600 font-semibold mt-0.5">PANİK: {p.test}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Bildiren: {p.notifiedBy} → {p.notifiedDoctor} ({p.method})</p>
                    </div>
                    {!p.ack && (
                      <button onClick={() => handlePanikAck(i)}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">
                        Hekim Onayladı
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-3">Laboratuvar Panik Değer Sınırları</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-2 px-4 text-xs font-semibold text-slate-500">Test</th>
                    <th className="text-center py-2 px-4 text-xs font-semibold text-slate-500">Düşük Panik</th>
                    <th className="text-center py-2 px-4 text-xs font-semibold text-slate-500">Yüksek Panik</th>
                    <th className="text-center py-2 px-4 text-xs font-semibold text-slate-500">Birim</th>
                    <th className="text-center py-2 px-4 text-xs font-semibold text-slate-500">Bildirim Süresi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'Glukoz', low: '< 50', high: '> 450', unit: 'mg/dL', time: '30 dk' },
                    { name: 'Potasyum', low: '< 2.8', high: '> 6.2', unit: 'mEq/L', time: '15 dk' },
                    { name: 'Kreatinin', low: '—', high: '> 7.0', unit: 'mg/dL', time: '30 dk' },
                    { name: 'pH (AKG)', low: '< 7.2', high: '> 7.6', unit: '', time: '15 dk' },
                    { name: 'pO2 (AKG)', low: '< 40', high: '—', unit: 'mmHg', time: '15 dk' },
                    { name: 'Hgb', low: '< 6.0', high: '> 20.0', unit: 'g/dL', time: '30 dk' },
                    { name: 'PLT', low: '< 20.000', high: '> 1.000.000', unit: '/µL', time: '30 dk' },
                    { name: 'INR', low: '—', high: '> 5.0', unit: '', time: '30 dk' },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-4 font-medium text-slate-800">{r.name}</td>
                      <td className="py-2 px-4 text-center text-blue-600 font-semibold">{r.low}</td>
                      <td className="py-2 px-4 text-center text-red-600 font-semibold">{r.high}</td>
                      <td className="py-2 px-4 text-center text-slate-500">{r.unit}</td>
                      <td className="py-2 px-4 text-center"><Badge color="amber">{r.time}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Result Detail Modal */}
      <Modal open={!!selectedTest} onClose={() => setSelectedTest(null)} title={`Test Sonuçları — ${selectedTest?.panel || ''}`} size="2xl">
        {selectedTest && (
          <div className="space-y-5">
            {/* Patient */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px] uppercase">Hasta</span><span className="font-bold text-slate-800">{selectedTest.patient} ({selectedTest.age} {selectedTest.gender})</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Lab No</span><span className="font-mono font-bold text-slate-800">{selectedTest.labNo}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Barkod</span><span className="font-mono font-bold text-slate-800">{selectedTest.barcode}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">SUT Kodu</span><span className="font-mono font-bold text-slate-800">{selectedTest.sutCode}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">MEDULA</span>{selectedTest.medulaSync ? <span className="text-emerald-600 font-bold text-xs">✓ Senkronize</span> : <span className="text-amber-600 font-bold text-xs">Bekliyor</span>}</div>
            </div>

            {selectedTest.panic && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-red-700">⚠ PANİK DEĞER TESPİT EDİLDİ — Klinisyen derhal bilgilendirilmeli</p>
                  <p className="text-xs text-red-600 mt-1">{selectedTest.notes}</p>
                </div>
              </div>
            )}

            {selectedTest.tests.some(t => t.deltaFlag) && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-3">
                <TrendingUp size={16} className="text-orange-500" />
                <p className="text-sm text-orange-700"><strong>Delta Kontrol Uyarısı:</strong> Bazı parametreler önceki sonuca göre anlamlı değişim gösterdi. Klinik değerlendirme önerilir.</p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Parametre</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Sonuç</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Önceki</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Birim</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Referans</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedTest.tests.map((t, i) => (
                    <tr key={i} className={twMerge("hover:bg-slate-50",
                      t.flag === 'P' ? 'bg-red-50' : t.flag === 'C' ? 'bg-amber-50/50' : t.deltaFlag ? 'bg-orange-50/30' : '')}>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {t.name}
                        {t.deltaFlag && <span className="ml-1.5 text-[9px] text-orange-600 font-bold">Δ</span>}
                      </td>
                      <td className={twMerge("py-2.5 px-3 text-center font-bold", flagColor(t.flag) || 'text-slate-800')}>{t.result}</td>
                      <td className="py-2.5 px-3 text-center text-slate-400 text-xs">
                        {t.prevResult ? (
                          <span className="flex items-center justify-center gap-1">
                            {t.prevResult}
                            {parseFloat(t.result) > parseFloat(t.prevResult || '0') ? <TrendingUp size={10} className="text-red-400" /> : <TrendingDown size={10} className="text-blue-400" />}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-500 text-xs">{t.unit}</td>
                      <td className="py-2.5 px-3 text-center text-slate-400 text-xs">{t.refLow > 0 || t.refHigh < 900 ? `${t.refLow} – ${t.refHigh}` : '—'}</td>
                      <td className="py-2.5 px-3 text-center">
                        {t.flag && (
                          <span className={twMerge("text-xs font-black px-2 py-0.5 rounded",
                            t.flag === 'H' ? 'bg-red-100 text-red-700' : t.flag === 'L' ? 'bg-blue-100 text-blue-700' :
                              t.flag === 'C' ? 'bg-amber-100 text-amber-700' : 'bg-red-200 text-red-800 animate-pulse')}>
                            {t.flag === 'H' ? '▲ Yüksek' : t.flag === 'L' ? '▼ Düşük' : t.flag === 'C' ? '⚠ Kritik' : '🔴 PANİK'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
              <span>Analizör: <strong>{selectedTest.analyzer}</strong></span>
              <span>TAT: <strong className={selectedTest.tatActual > selectedTest.tatTarget ? 'text-red-600' : 'text-emerald-600'}>{selectedTest.tatActual} dk</strong> (Hedef: {selectedTest.tatTarget} dk)</span>
              {selectedTest.approvedBy && <span>Onaylayan: <strong>{selectedTest.approvedBy}</strong> ({selectedTest.approvedAt})</span>}
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100 flex-wrap">
              {selectedTest.status === 'Onay Bekliyor' && (
                <button onClick={() => handleApprove(selectedTest.id)}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Sonuçları Onayla (Dijital İmza)
                </button>
              )}
              <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
                <Printer size={16} /> Yazdır
              </button>
              <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
                <Send size={16} /> e-Nabız / MEDULA Gönder
              </button>
              {selectedTest.panic && selectedTest.status !== 'Tamamlandı' && (
                <button className="px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 flex items-center gap-2">
                  <Bell size={16} /> Panik Bildirim Kaydı
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Barcode Accept Modal */}
      <Modal open={showBarcodeModal} onClose={() => setShowBarcodeModal(false)} title="Numune Kabul" size="lg">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input type="text" value={scannedBarcode} onChange={e => setScannedBarcode(e.target.value)}
              placeholder="Barkod / Lab No..."
              className="flex-1 px-3 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={handleSampleAccept} className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">Kabul Et</button>
          </div>
          <p className="text-xs text-slate-500">Numune kabul edildiğinde durum otomatik olarak "Çalışılıyor" olarak güncellenecektir.</p>
        </div>
      </Modal>
    </div>
  );
}
