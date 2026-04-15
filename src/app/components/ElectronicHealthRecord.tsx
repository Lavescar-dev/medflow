import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText, Activity, Pill, FlaskConical, Bone,
  History, AlertTriangle, User, Calendar, MapPin,
  Droplet, FileSignature, Stethoscope, ChevronRight,
  Download, Printer, Link, Search, X, Plus, Eye, Edit3,
  Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Heart, Thermometer, Wind, Gauge, TrendingUp, TrendingDown,
  Syringe, FileCheck, ClipboardList, Microscope, Shield,
  Send, RefreshCw, Share2, Trash2, Copy, Filter, SlidersHorizontal,
  Image as ImageIcon, ChevronLeft, Info, Zap, Ban, CircleDot
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';
import { usePatientContext } from '../patientContext';

// ===== TYPES =====
interface Visit {
  id: string;
  date: string;
  dept: string;
  doctor: string;
  diagnosis: string;
  icdCode: string;
  type: 'ayaktan' | 'yatan' | 'acil';
  notes: string;
  procedures: string[];
  status: 'tamamlandi' | 'devam' | 'iptal';
}

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  dept: string;
  type: 'normal' | 'kirmizi' | 'yesil' | 'turuncu' | 'mor';
  status: 'aktif' | 'tamamlandi' | 'iptal';
  eReceteNo: string;
  medulaOnay: boolean;
  items: { name: string; dose: string; freq: string; duration: string; quantity: number }[];
}

interface LabResult {
  id: string;
  date: string;
  orderNo: string;
  panel: string;
  status: 'sonuclandi' | 'bekliyor' | 'iptal';
  doctor: string;
  tests: { name: string; result: string; unit: string; refLow: number; refHigh: number; flag: 'N' | 'H' | 'L' | 'C' }[];
}

interface RadiologyStudy {
  id: string;
  date: string;
  modality: string;
  bodyPart: string;
  description: string;
  doctor: string;
  radiologist: string;
  status: 'raporlandi' | 'bekliyor' | 'cekildi';
  report: string;
  findings: string;
  impression: string;
  hasImages: boolean;
}

interface EpikrizReport {
  id: string;
  admissionDate: string;
  dischargeDate: string;
  dept: string;
  doctor: string;
  diagnosis: string[];
  procedures: string[];
  summary: string;
  dischargeMeds: string[];
  followUp: string;
  status: 'onaylandi' | 'taslak' | 'bekliyor';
}

interface VitalRecord {
  date: string;
  time: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  temp: number;
  spo2: number;
  resp: number;
  nurse: string;
}

interface OrderItem {
  id: string;
  date: string;
  type: 'lab' | 'radyoloji' | 'konsultasyon' | 'ilac' | 'diger';
  description: string;
  doctor: string;
  status: 'aktif' | 'tamamlandi' | 'iptal' | 'bekliyor';
  priority: 'normal' | 'acil' | 'cito';
}

// ===== MOCK DATA =====
const mockVisits: Visit[] = [
  { id: 'V001', date: '05.04.2026', dept: 'Kardiyoloji', doctor: 'Uzm. Dr. Ahmet Karaca', diagnosis: 'Esansiyel (primer) hipertansiyon', icdCode: 'I10', type: 'ayaktan', notes: 'Tansiyon regülasyonu için Co-Diovan dozu ayarlandı. 3 ay sonra kontrol önerildi. EKG normal sinüs ritmi.', procedures: ['EKG', 'Ekokardiyografi'], status: 'tamamlandi' },
  { id: 'V002', date: '12.01.2026', dept: 'Dahiliye', doctor: 'Uzm. Dr. Ayşe Demir', diagnosis: 'Tip 2 diabetes mellitus', icdCode: 'E11', type: 'ayaktan', notes: 'HbA1c: %7.2 - Hedef %7 altı. Glucophage dozu 2x1000mg olarak artırıldı. Diyet önerileri verildi.', procedures: ['Kan tahlili', 'İdrar tetkiki'], status: 'tamamlandi' },
  { id: 'V003', date: '08.11.2025', dept: 'Acil Servis', doctor: 'Dr. Hakan Çelik', diagnosis: 'Akut üst solunum yolu enfeksiyonu', icdCode: 'J06.9', type: 'acil', notes: 'Ateş 38.5°C ile başvuru. Antibiyotik tedavisi başlandı. 3 gün istirahat raporu verildi.', procedures: ['Tam kan sayımı', 'CRP', 'Akciğer grafisi'], status: 'tamamlandi' },
  { id: 'V004', date: '15.08.2025', dept: 'Göz Hastalıkları', doctor: 'Prof. Dr. Elif Yıldız', diagnosis: 'Miyopi', icdCode: 'H52.1', type: 'ayaktan', notes: 'Göz muayenesi yapıldı. Gözlük reçetesi yazıldı. R: -1.75 L: -2.00', procedures: ['Göz dibi muayenesi', 'Otorefraktometre'], status: 'tamamlandi' },
  { id: 'V005', date: '22.06.2025', dept: 'Kardiyoloji', doctor: 'Uzm. Dr. Ahmet Karaca', diagnosis: 'Hipertansiyon kontrolü', icdCode: 'I10', type: 'ayaktan', notes: 'Tansiyon düzensiz. Amlodipine eklendi. ABPM planlandı.', procedures: ['Holter monitorizasyon'], status: 'tamamlandi' },
  { id: 'V006', date: '03.03.2025', dept: 'Ortopedi', doctor: 'Doç. Dr. Murat Aydın', diagnosis: 'Lomber disk hernisi', icdCode: 'M51.1', type: 'yatan', notes: 'L4-L5 disk hernisi. Fizik tedavi önerildi. MR değerlendirmesi yapıldı.', procedures: ['Lomber MR', 'EMG'], status: 'tamamlandi' },
];

const mockPrescriptions: Prescription[] = [
  {
    id: 'RX001', date: '05.04.2026', doctor: 'Uzm. Dr. Ahmet Karaca', dept: 'Kardiyoloji',
    type: 'normal', status: 'aktif', eReceteNo: 'A1B2-C3D4-E5F6', medulaOnay: true,
    items: [
      { name: 'Co-Diovan 80/12.5 mg Film Tablet', dose: '80/12.5 mg', freq: '1x1', duration: '90 gün', quantity: 90 },
      { name: 'Beloc Zok 50 mg Kont.Sal.Film Tablet', dose: '50 mg', freq: '1x1', duration: '90 gün', quantity: 90 },
    ]
  },
  {
    id: 'RX002', date: '12.01.2026', doctor: 'Uzm. Dr. Ayşe Demir', dept: 'Dahiliye',
    type: 'normal', status: 'aktif', eReceteNo: 'G7H8-I9J0-K1L2', medulaOnay: true,
    items: [
      { name: 'Glucophage 1000 mg Film Tablet', dose: '1000 mg', freq: '2x1', duration: '90 gün', quantity: 180 },
      { name: 'Crestor 10 mg Film Tablet', dose: '10 mg', freq: '1x1', duration: '90 gün', quantity: 90 },
    ]
  },
  {
    id: 'RX003', date: '08.11.2025', doctor: 'Dr. Hakan Çelik', dept: 'Acil Servis',
    type: 'kirmizi', status: 'tamamlandi', eReceteNo: 'M3N4-O5P6-Q7R8', medulaOnay: true,
    items: [
      { name: 'Augmentin BID 1000 mg Film Tablet', dose: '1000 mg', freq: '2x1', duration: '7 gün', quantity: 14 },
      { name: 'Parol 500 mg Tablet', dose: '500 mg', freq: '3x1', duration: '5 gün', quantity: 15 },
    ]
  },
  {
    id: 'RX004', date: '22.06.2025', doctor: 'Uzm. Dr. Ahmet Karaca', dept: 'Kardiyoloji',
    type: 'normal', status: 'tamamlandi', eReceteNo: 'S9T0-U1V2-W3X4', medulaOnay: true,
    items: [
      { name: 'Norvasc 5 mg Tablet', dose: '5 mg', freq: '1x1', duration: '30 gün', quantity: 30 },
    ]
  },
];

const mockLabResults: LabResult[] = [
  {
    id: 'L001', date: '05.04.2026', orderNo: 'LAB-2026-04281', panel: 'Biyokimya + Hemogram',
    status: 'sonuclandi', doctor: 'Uzm. Dr. Ahmet Karaca',
    tests: [
      { name: 'Glukoz (Açlık)', result: '132', unit: 'mg/dL', refLow: 74, refHigh: 106, flag: 'H' },
      { name: 'HbA1c', result: '7.2', unit: '%', refLow: 4.0, refHigh: 6.0, flag: 'H' },
      { name: 'Üre (BUN)', result: '38', unit: 'mg/dL', refLow: 17, refHigh: 43, flag: 'N' },
      { name: 'Kreatinin', result: '0.9', unit: 'mg/dL', refLow: 0.7, refHigh: 1.2, flag: 'N' },
      { name: 'ALT (SGPT)', result: '28', unit: 'U/L', refLow: 0, refHigh: 41, flag: 'N' },
      { name: 'AST (SGOT)', result: '24', unit: 'U/L', refLow: 0, refHigh: 40, flag: 'N' },
      { name: 'Total Kolesterol', result: '228', unit: 'mg/dL', refLow: 0, refHigh: 200, flag: 'H' },
      { name: 'LDL Kolesterol', result: '142', unit: 'mg/dL', refLow: 0, refHigh: 130, flag: 'H' },
      { name: 'HDL Kolesterol', result: '42', unit: 'mg/dL', refLow: 40, refHigh: 60, flag: 'N' },
      { name: 'Trigliserit', result: '186', unit: 'mg/dL', refLow: 0, refHigh: 150, flag: 'H' },
      { name: 'Hemoglobin', result: '14.2', unit: 'g/dL', refLow: 13.5, refHigh: 17.5, flag: 'N' },
      { name: 'WBC', result: '7.8', unit: '10³/µL', refLow: 4.5, refHigh: 11.0, flag: 'N' },
      { name: 'PLT', result: '245', unit: '10³/µL', refLow: 150, refHigh: 400, flag: 'N' },
      { name: 'CRP', result: '3.2', unit: 'mg/L', refLow: 0, refHigh: 5, flag: 'N' },
      { name: 'TSH', result: '2.8', unit: 'mIU/L', refLow: 0.27, refHigh: 4.2, flag: 'N' },
    ]
  },
  {
    id: 'L002', date: '12.01.2026', orderNo: 'LAB-2026-01542', panel: 'Diyabet Takip Paneli',
    status: 'sonuclandi', doctor: 'Uzm. Dr. Ayşe Demir',
    tests: [
      { name: 'Glukoz (Açlık)', result: '128', unit: 'mg/dL', refLow: 74, refHigh: 106, flag: 'H' },
      { name: 'HbA1c', result: '7.0', unit: '%', refLow: 4.0, refHigh: 6.0, flag: 'H' },
      { name: 'Kreatinin', result: '0.85', unit: 'mg/dL', refLow: 0.7, refHigh: 1.2, flag: 'N' },
      { name: 'Mikroalbumin (İdrar)', result: '18', unit: 'mg/L', refLow: 0, refHigh: 30, flag: 'N' },
      { name: 'eGFR', result: '92', unit: 'mL/min', refLow: 90, refHigh: 999, flag: 'N' },
    ]
  },
  {
    id: 'L003', date: '08.11.2025', orderNo: 'LAB-2025-11083', panel: 'Acil Hemogram + CRP',
    status: 'sonuclandi', doctor: 'Dr. Hakan Çelik',
    tests: [
      { name: 'WBC', result: '13.2', unit: '10³/µL', refLow: 4.5, refHigh: 11.0, flag: 'H' },
      { name: 'CRP', result: '48', unit: 'mg/L', refLow: 0, refHigh: 5, flag: 'C' },
      { name: 'Hemoglobin', result: '13.8', unit: 'g/dL', refLow: 13.5, refHigh: 17.5, flag: 'N' },
      { name: 'Prokalsitonin', result: '0.12', unit: 'ng/mL', refLow: 0, refHigh: 0.5, flag: 'N' },
    ]
  },
];

const mockRadiology: RadiologyStudy[] = [
  {
    id: 'R001', date: '05.04.2026', modality: 'EKO', bodyPart: 'Kalp', description: 'Transtorasik Ekokardiyografi',
    doctor: 'Uzm. Dr. Ahmet Karaca', radiologist: 'Uzm. Dr. Serkan Aydın', status: 'raporlandi',
    report: 'Sol ventrikül duvar kalınlıkları normal sınırlarda. Ejeksiyon fraksiyonu %60. Kapak yapıları doğal. Perikardiyal efüzyon saptanmadı.',
    findings: 'EF: %60, LV normal boyutlarda, duvar hareketleri doğal, mitral ve aort kapakları normal.',
    impression: 'Normal ekokardiyografik inceleme.', hasImages: true
  },
  {
    id: 'R002', date: '03.03.2025', modality: 'MR', bodyPart: 'Lomber', description: 'Lomber MR (Kontrastsız)',
    doctor: 'Doç. Dr. Murat Aydın', radiologist: 'Prof. Dr. Zeynep Kaya', status: 'raporlandi',
    report: 'L4-L5 seviyesinde posterolateral disk hernisi mevcut. Teka basısı izlenmektedir. L3-L4 seviyesinde bulging disk. Konus medullaris normal seviyede sonlanmakta.',
    findings: 'L4-L5 posterolateral disk hernisi, L3-L4 bulging, spinal kanal daralması yok.',
    impression: 'L4-L5 disk hernisi - Klinik korelasyon önerilir.', hasImages: true
  },
  {
    id: 'R003', date: '08.11.2025', modality: 'CR', bodyPart: 'Toraks', description: 'PA Akciğer Grafisi',
    doctor: 'Dr. Hakan Çelik', radiologist: 'Uzm. Dr. Serkan Aydın', status: 'raporlandi',
    report: 'Akciğer parankiminde aktif infiltrasyon saptanmamıştır. Kardiyotorasik oran normal sınırlarda. Kostofrenik sinüsler açık. Mediastinal yapılar doğal.',
    findings: 'Aktif patoloji saptanmadı.', impression: 'Normal PA akciğer grafisi.', hasImages: true
  },
  {
    id: 'R004', date: '07.04.2026', modality: 'USG', bodyPart: 'Batın', description: 'Tüm Batın Ultrasonografi',
    doctor: 'Uzm. Dr. Ayşe Demir', radiologist: '', status: 'bekliyor',
    report: '', findings: '', impression: '', hasImages: false
  },
];

const mockEpikriz: EpikrizReport[] = [
  {
    id: 'E001', admissionDate: '03.03.2025', dischargeDate: '07.03.2025', dept: 'Ortopedi',
    doctor: 'Doç. Dr. Murat Aydın',
    diagnosis: ['M51.1 - Lomber disk hernisi (L4-L5)', 'M54.5 - Bel ağrısı'],
    procedures: ['Lomber MR', 'EMG', 'Fizik tedavi konsültasyonu'],
    summary: 'Hasta bel ağrısı ve sol bacağa yayılan ağrı şikayetiyle yatırıldı. Lomber MR\'da L4-L5 posterolateral disk hernisi saptandı. Konservatif tedavi uygulandı. Fizik tedavi programı planlandı. Ağrı kontrolü sağlanarak taburcu edildi.',
    dischargeMeds: ['Muscoril 4mg Kapsül 2x1', 'Voltaren 75mg Tablet 2x1 (7 gün)', 'Nörontin 300mg Kapsül 2x1'],
    followUp: '2 hafta sonra ortopedi kontrolü. Fizik tedavi programına başlanması. Ağır kaldırmaktan kaçınılması.',
    status: 'onaylandi'
  },
  {
    id: 'E002', admissionDate: '10.09.2024', dischargeDate: '12.09.2024', dept: 'Kardiyoloji',
    doctor: 'Uzm. Dr. Ahmet Karaca',
    diagnosis: ['I10 - Esansiyel hipertansiyon', 'I51.9 - Hipertansif kalp hastalığı'],
    procedures: ['EKG', 'Ekokardiyografi', 'Holter monitorizasyon', '24 saat ABPM'],
    summary: 'Yüksek tansiyon atağıyla acil servisten yatırıldı. TA: 190/120 mmHg. IV antihipertansif tedavi başlandı. Hedef organ hasarı değerlendirildi. EKO normal. 24 saatlik ABPM ile tansiyon regülasyonu sağlandı.',
    dischargeMeds: ['Co-Diovan 160/12.5 mg 1x1', 'Beloc Zok 50 mg 1x1'],
    followUp: '1 hafta sonra kardiyoloji kontrolü. Tuz kısıtlı diyet. Günlük tansiyon takibi.',
    status: 'onaylandi'
  },
];

const mockVitals: VitalRecord[] = [
  { date: '05.04.2026', time: '09:15', systolic: 138, diastolic: 88, pulse: 76, temp: 36.4, spo2: 97, resp: 16, nurse: 'Hmş. Fatma K.' },
  { date: '05.04.2026', time: '14:30', systolic: 132, diastolic: 84, pulse: 72, temp: 36.5, spo2: 98, resp: 15, nurse: 'Hmş. Aysel T.' },
  { date: '12.01.2026', time: '10:00', systolic: 142, diastolic: 92, pulse: 80, temp: 36.6, spo2: 96, resp: 18, nurse: 'Hmş. Fatma K.' },
  { date: '08.11.2025', time: '22:45', systolic: 128, diastolic: 78, pulse: 92, temp: 38.5, spo2: 95, resp: 22, nurse: 'Hmş. Derya S.' },
  { date: '08.11.2025', time: '08:00', systolic: 124, diastolic: 76, pulse: 88, temp: 37.8, spo2: 96, resp: 20, nurse: 'Hmş. Fatma K.' },
  { date: '03.03.2025', time: '06:00', systolic: 130, diastolic: 82, pulse: 70, temp: 36.3, spo2: 98, resp: 14, nurse: 'Hmş. Aysel T.' },
  { date: '03.03.2025', time: '12:00', systolic: 126, diastolic: 80, pulse: 68, temp: 36.4, spo2: 97, resp: 15, nurse: 'Hmş. Derya S.' },
  { date: '03.03.2025', time: '18:00', systolic: 134, diastolic: 86, pulse: 74, temp: 36.5, spo2: 97, resp: 16, nurse: 'Hmş. Fatma K.' },
];

const mockOrders: OrderItem[] = [
  { id: 'O001', date: '07.04.2026', type: 'lab', description: 'Biyokimya Paneli (Kontrol)', doctor: 'Uzm. Dr. Ayşe Demir', status: 'bekliyor', priority: 'normal' },
  { id: 'O002', date: '07.04.2026', type: 'radyoloji', description: 'Tüm Batın USG', doctor: 'Uzm. Dr. Ayşe Demir', status: 'bekliyor', priority: 'normal' },
  { id: 'O003', date: '05.04.2026', type: 'lab', description: 'Biyokimya + Hemogram', doctor: 'Uzm. Dr. Ahmet Karaca', status: 'tamamlandi', priority: 'normal' },
  { id: 'O004', date: '05.04.2026', type: 'konsultasyon', description: 'Endokrinoloji Konsültasyonu', doctor: 'Uzm. Dr. Ahmet Karaca', status: 'aktif', priority: 'normal' },
];

// ===== HELPER COMPONENTS =====
function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${colors[color] || colors.blue}`}>{children}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    tamamlandi: { label: 'Tamamlandı', color: 'green' },
    sonuclandi: { label: 'Sonuçlandı', color: 'green' },
    raporlandi: { label: 'Raporlandı', color: 'green' },
    onaylandi: { label: 'Onaylandı', color: 'green' },
    aktif: { label: 'Aktif', color: 'blue' },
    devam: { label: 'Devam Ediyor', color: 'amber' },
    bekliyor: { label: 'Bekliyor', color: 'amber' },
    cekildi: { label: 'Çekildi', color: 'cyan' },
    taslak: { label: 'Taslak', color: 'slate' },
    iptal: { label: 'İptal', color: 'red' },
  };
  const s = map[status] || { label: status, color: 'slate' };
  return <Badge color={s.color}>{s.label}</Badge>;
}

function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${wide ? 'max-w-5xl' : 'max-w-3xl'} w-full max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon, color = 'blue', action }: { title: string; icon: any; color?: string; action?: React.ReactNode }) {
  const borderColors: Record<string, string> = { blue: 'border-blue-500', emerald: 'border-emerald-500', amber: 'border-amber-500', red: 'border-red-500', purple: 'border-purple-500' };
  return (
    <div className="flex items-center justify-between">
      <h4 className={`font-bold text-slate-800 flex items-center gap-2 border-l-4 ${borderColors[color] || borderColors.blue} pl-3`}>
        <Icon size={16} className="text-slate-500" /> {title}
      </h4>
      {action}
    </div>
  );
}

// ===== TAB: Klinik Özet =====
function TabKlinikOzet({ onOpenVitals }: { onOpenVitals: () => void }) {
  const bpData = mockVitals.slice().reverse().map(v => ({ name: `${v.date.slice(0,5)} ${v.time}`, sys: v.systolic, dia: v.diastolic, pulse: v.pulse }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Klinik Özet</h3>
        <div className="flex gap-2">
          <button className="text-slate-500 hover:text-blue-600 flex items-center gap-1.5 text-sm font-semibold transition-colors"><Download size={16} /> PDF</button>
          <button className="text-slate-500 hover:text-blue-600 flex items-center gap-1.5 text-sm font-semibold transition-colors"><Printer size={16} /> Yazdır</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Medications */}
        <div className="space-y-4">
          <SectionHeader title="Sürekli Kullanılan İlaçlar" icon={Pill} color="emerald" />
          <ul className="space-y-3">
            {mockPrescriptions.filter(p => p.status === 'aktif').flatMap(p => p.items).map((item, i) => (
              <li key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-start">
                  <strong className="text-sm text-slate-800">{item.name}</strong>
                  <Badge color="green">Aktif Raporlu</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.freq} • {item.duration}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Visits Timeline */}
        <div className="space-y-4">
          <SectionHeader title="Son Başvurular" icon={History} color="blue" />
          <div className="pl-4 border-l-2 border-slate-200 space-y-5 relative mt-2">
            {mockVisits.slice(0, 4).map((visit) => (
              <div key={visit.id} className="relative">
                <div className={`absolute w-3 h-3 rounded-full -left-[23px] top-1.5 border-4 border-white ${visit.type === 'acil' ? 'bg-red-500' : visit.type === 'yatan' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{visit.date}</span>
                  <span className="text-sm font-bold text-slate-700">{visit.dept}</span>
                  <Badge color={visit.type === 'acil' ? 'red' : visit.type === 'yatan' ? 'purple' : 'blue'}>
                    {visit.type === 'acil' ? 'Acil' : visit.type === 'yatan' ? 'Yatan' : 'Ayaktan'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-800 font-medium">{visit.icdCode} - {visit.diagnosis}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Stethoscope size={12} /> {visit.doctor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vital Signs Mini Chart */}
        <div className="space-y-4">
          <SectionHeader title="Tansiyon Trendi" icon={Heart} color="red" action={
            <button onClick={onOpenVitals} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><TrendingUp size={14} /> Detay</button>
          } />
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={bpData}>
                <defs>
                  <linearGradient id="sysFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[60, 160]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Area type="monotone" dataKey="sys" stroke="#ef4444" fill="url(#sysFill)" strokeWidth={2} name="Sistolik" />
                <Line type="monotone" dataKey="dia" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Diastolik" />
                <Line type="monotone" dataKey="pulse" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Nabız" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Orders */}
        <div className="space-y-4">
          <SectionHeader title="Bekleyen İstemler" icon={ClipboardList} color="amber" />
          <div className="space-y-2">
            {mockOrders.filter(o => o.status === 'bekliyor' || o.status === 'aktif').map(order => (
              <div key={order.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{order.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{order.date} • {order.doctor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.status} />
                  {order.priority === 'acil' && <Badge color="red">ACİL</Badge>}
                </div>
              </div>
            ))}
            {mockOrders.filter(o => o.status === 'bekliyor' || o.status === 'aktif').length === 0 && (
              <p className="text-sm text-slate-400 italic">Bekleyen istem bulunmuyor.</p>
            )}
          </div>
        </div>

        {/* Lab Highlights */}
        <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
          <SectionHeader title="Son Laboratuvar Bulguları (Dikkat Çekenler)" icon={FlaskConical} color="amber" />
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-2 px-4 font-semibold text-slate-500 text-xs">Tarih</th>
                  <th className="py-2 px-4 font-semibold text-slate-500 text-xs">Test Adı</th>
                  <th className="py-2 px-4 font-semibold text-slate-500 text-xs text-right">Sonuç</th>
                  <th className="py-2 px-4 font-semibold text-slate-500 text-xs">Referans</th>
                  <th className="py-2 px-4 font-semibold text-slate-500 text-xs">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockLabResults[0].tests.filter(t => t.flag !== 'N').map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-600">{mockLabResults[0].date}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{t.name}</td>
                    <td className={`py-3 px-4 text-right font-bold ${t.flag === 'H' || t.flag === 'C' ? 'text-red-500' : t.flag === 'L' ? 'text-blue-500' : 'text-slate-800'}`}>
                      {t.result} <span className="text-xs ml-1">{t.unit} {t.flag === 'H' ? '↑' : t.flag === 'L' ? '↓' : t.flag === 'C' ? '↑↑' : ''}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">{t.refLow} - {t.refHigh}</td>
                    <td className="py-3 px-4"><Badge color={t.flag === 'C' ? 'red' : t.flag === 'H' ? 'amber' : t.flag === 'L' ? 'blue' : 'green'}>{t.flag === 'H' ? 'Yüksek' : t.flag === 'L' ? 'Düşük' : t.flag === 'C' ? 'Kritik' : 'Normal'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== TAB: Geçmiş Vizitler =====
function TabVizitler() {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = typeFilter === 'all' ? mockVisits : mockVisits.filter(v => v.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Geçmiş Vizitler ({mockVisits.length})</h3>
        <div className="flex gap-2">
          {['all', 'ayaktan', 'yatan', 'acil'].map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={twMerge('px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border',
                typeFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              )}>
              {f === 'all' ? 'Tümü' : f === 'ayaktan' ? 'Ayaktan' : f === 'yatan' ? 'Yatan' : 'Acil'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(visit => (
          <div key={visit.id} onClick={() => setSelectedVisit(visit)}
            className="bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 cursor-pointer transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{visit.date}</span>
                  <span className="text-sm font-bold text-slate-800">{visit.dept}</span>
                  <Badge color={visit.type === 'acil' ? 'red' : visit.type === 'yatan' ? 'purple' : 'blue'}>
                    {visit.type === 'acil' ? 'Acil' : visit.type === 'yatan' ? 'Yatan' : 'Ayaktan'}
                  </Badge>
                  <StatusBadge status={visit.status} />
                </div>
                <p className="text-sm font-medium text-slate-700"><span className="text-slate-400 font-mono mr-1">{visit.icdCode}</span> {visit.diagnosis}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Stethoscope size={12} /> {visit.doctor}</p>
                {visit.procedures.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {visit.procedures.map((p, i) => <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-500">{p}</span>)}
                  </div>
                )}
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors mt-1" />
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedVisit} onClose={() => setSelectedVisit(null)} title={`Vizit Detayı - ${selectedVisit?.dept || ''}`}>
        {selectedVisit && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Tarih</p>
                <p className="text-sm font-bold text-slate-800">{selectedVisit.date}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Hekim</p>
                <p className="text-sm font-bold text-slate-800">{selectedVisit.doctor}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Tanı (ICD-10)</p>
                <p className="text-sm font-bold text-slate-800">{selectedVisit.icdCode} - {selectedVisit.diagnosis}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-xs text-slate-500 mb-1">Başvuru Türü</p>
                <p className="text-sm font-bold text-slate-800 capitalize">{selectedVisit.type}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Vizit Notları</h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{selectedVisit.notes}</p>
            </div>
            {selectedVisit.procedures.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Yapılan İşlemler</h4>
                <div className="flex gap-2 flex-wrap">
                  {selectedVisit.procedures.map((p, i) => <span key={i} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">{p}</span>)}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Printer size={14} /> Yazdır</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Download size={14} /> PDF İndir</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ===== TAB: Reçeteler =====
function TabReceteler() {
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [showNewRx, setShowNewRx] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = statusFilter === 'all' ? mockPrescriptions : mockPrescriptions.filter(p => p.status === statusFilter);

  const typeColors: Record<string, { label: string; color: string }> = {
    normal: { label: 'Normal Reçete', color: 'blue' },
    kirmizi: { label: 'Kırmızı Reçete', color: 'red' },
    yesil: { label: 'Yeşil Reçete', color: 'green' },
    turuncu: { label: 'Turuncu Reçete', color: 'orange' },
    mor: { label: 'Mor Reçete', color: 'purple' },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Reçeteler / İlaç Yönetimi</h3>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 bg-white">
            <option value="all">Tümü</option>
            <option value="aktif">Aktif</option>
            <option value="tamamlandi">Tamamlandı</option>
            <option value="iptal">İptal</option>
          </select>
          <button onClick={() => setShowNewRx(true)}
            className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5">
            <Plus size={14} /> E-Reçete Yaz
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(rx => (
          <div key={rx.id} onClick={() => setSelectedRx(rx)}
            className="bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 cursor-pointer transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{rx.date}</span>
                  <Badge color={typeColors[rx.type].color}>{typeColors[rx.type].label}</Badge>
                  <StatusBadge status={rx.status} />
                  {rx.medulaOnay && <Badge color="green">MEDULA ✓</Badge>}
                </div>
                <p className="text-sm font-medium text-slate-700">{rx.items.map(i => i.name).join(', ')}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Stethoscope size={12} /> {rx.doctor} • {rx.dept}
                  <span className="text-slate-300 mx-1">|</span>
                  <span className="font-mono">e-Reçete: {rx.eReceteNo}</span>
                </p>
              </div>
              <ChevronRight size={18} className="text-slate-300 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Detail Modal */}
      <Modal open={!!selectedRx} onClose={() => setSelectedRx(null)} title="E-Reçete Detayı">
        {selectedRx && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Reçete No:</span> <span className="font-mono font-bold text-slate-800">{selectedRx.eReceteNo}</span></div>
                <div><span className="text-slate-500">Tarih:</span> <span className="font-bold text-slate-800">{selectedRx.date}</span></div>
                <div><span className="text-slate-500">Hekim:</span> <span className="font-bold text-slate-800">{selectedRx.doctor}</span></div>
                <div><span className="text-slate-500">Klinik:</span> <span className="font-bold text-slate-800">{selectedRx.dept}</span></div>
                <div className="flex items-center gap-2"><span className="text-slate-500">Tür:</span> <Badge color={typeColors[selectedRx.type].color}>{typeColors[selectedRx.type].label}</Badge></div>
                <div className="flex items-center gap-2"><span className="text-slate-500">MEDULA:</span> {selectedRx.medulaOnay ? <Badge color="green">Onaylandı ✓</Badge> : <Badge color="red">Onay Bekleniyor</Badge>}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">İlaçlar</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">İlaç Adı</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Doz</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Kullanım</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Süre</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Adet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedRx.items.map((item, i) => (
                      <tr key={i}>
                        <td className="py-3 px-3 font-medium text-slate-800">{item.name}</td>
                        <td className="py-3 px-3 text-slate-600">{item.dose}</td>
                        <td className="py-3 px-3 text-slate-600">{item.freq}</td>
                        <td className="py-3 px-3 text-slate-600">{item.duration}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-800">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Printer size={14} /> Yazdır</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Copy size={14} /> Tekrarla</button>
              {selectedRx.status === 'aktif' && (
                <button className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 flex items-center gap-2"><Ban size={14} /> İptal Et</button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* New Prescription Modal */}
      <Modal open={showNewRx} onClose={() => setShowNewRx(false)} title="Yeni E-Reçete Yaz" wide>
        <NewPrescriptionForm onClose={() => setShowNewRx(false)} />
      </Modal>
    </div>
  );
}

function NewPrescriptionForm({ onClose }: { onClose: () => void }) {
  const [rxType, setRxType] = useState('normal');
  const [items, setItems] = useState([{ name: '', dose: '', freq: '1x1', duration: '7 gün', quantity: 7 }]);
  const [medulaChecking, setMedulaChecking] = useState(false);
  const [medulaResult, setMedulaResult] = useState<null | 'ok' | 'error'>(null);

  const addItem = () => setItems([...items, { name: '', dose: '', freq: '1x1', duration: '7 gün', quantity: 7 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const checkMedula = () => {
    setMedulaChecking(true);
    setMedulaResult(null);
    setTimeout(() => { setMedulaChecking(false); setMedulaResult('ok'); }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Reçete Türü</label>
          <select value={rxType} onChange={e => setRxType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
            <option value="normal">Normal Reçete</option>
            <option value="kirmizi">Kırmızı Reçete</option>
            <option value="yesil">Yeşil Reçete</option>
            <option value="turuncu">Turuncu Reçete</option>
            <option value="mor">Mor Reçete</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Tanı (ICD-10)</label>
          <input type="text" defaultValue="I10 - Esansiyel hipertansiyon" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Provizyon Türü</label>
          <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
            <option>Normal Provizyon</option>
            <option>Acil Provizyon</option>
            <option>İş Kazası</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700">İlaçlar</h4>
          <button onClick={addItem} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus size={14} /> İlaç Ekle</button>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">İlaç #{idx + 1}</span>
              {items.length > 1 && <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <input type="text" placeholder="İlaç adı ara..." value={item.name} onChange={e => { const n = [...items]; n[idx].name = e.target.value; setItems(n); }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              </div>
              <input type="text" placeholder="Doz" value={item.dose} onChange={e => { const n = [...items]; n[idx].dose = e.target.value; setItems(n); }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
              <select value={item.freq} onChange={e => { const n = [...items]; n[idx].freq = e.target.value; setItems(n); }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>1x1</option><option>2x1</option><option>3x1</option><option>4x1</option><option>1x2</option>
              </select>
              <select value={item.duration} onChange={e => { const n = [...items]; n[idx].duration = e.target.value; setItems(n); }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>3 gün</option><option>5 gün</option><option>7 gün</option><option>10 gün</option><option>14 gün</option><option>30 gün</option><option>90 gün</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Allergy Warning */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-red-700">Alerji Uyarısı</p>
          <p className="text-xs text-red-600 mt-1">Hasta Penisilin (Anafilaksi Riski) ve Sülfonamid alerjisi bildirmiştir. İlaç etkileşimlerini kontrol ediniz.</p>
        </div>
      </div>

      {/* MEDULA Check */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-700">MEDULA Provizyon Kontrolü</span>
          </div>
          <button onClick={checkMedula} disabled={medulaChecking}
            className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
            {medulaChecking ? <><RefreshCw size={14} className="animate-spin" /> Sorgulanıyor...</> : <><Send size={14} /> MEDULA Sorgula</>}
          </button>
        </div>
        {medulaResult === 'ok' && (
          <div className="mt-3 bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 size={16} /> MEDULA onayı alındı. Provizyon numarası: PRV-2026-048291
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-slate-100 justify-end">
        <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50">İptal</button>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2"><FileCheck size={14} /> E-Reçete Oluştur</button>
      </div>
    </div>
  );
}

// ===== TAB: Laboratuvar =====
function TabLaboratuvar() {
  const [selectedLab, setSelectedLab] = useState<LabResult | null>(null);
  const [trendTest, setTrendTest] = useState<string | null>(null);

  // trend data for a specific test
  const trendData = useMemo(() => {
    if (!trendTest) return [];
    const data: { date: string; value: number }[] = [];
    mockLabResults.forEach(lr => {
      const t = lr.tests.find(tt => tt.name === trendTest);
      if (t) data.push({ date: lr.date, value: parseFloat(t.result) });
    });
    return data.reverse();
  }, [trendTest]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Laboratuvar Sonuçları</h3>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Plus size={14} /> Yeni Lab İstemi</button>
      </div>

      <div className="space-y-3">
        {mockLabResults.map(lab => (
          <div key={lab.id} onClick={() => setSelectedLab(lab)}
            className="bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 cursor-pointer transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{lab.date}</span>
                  <span className="text-sm font-bold text-slate-800">{lab.panel}</span>
                  <StatusBadge status={lab.status} />
                  {lab.tests.some(t => t.flag === 'C') && <Badge color="red">KRİTİK</Badge>}
                  {lab.tests.some(t => t.flag === 'H' || t.flag === 'L') && !lab.tests.some(t => t.flag === 'C') && <Badge color="amber">ANORMAL</Badge>}
                </div>
                <p className="text-xs text-slate-500"><span className="font-mono">#{lab.orderNo}</span> • {lab.doctor} • {lab.tests.length} test</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {lab.tests.filter(t => t.flag !== 'N').map((t, i) => (
                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded border ${t.flag === 'H' || t.flag === 'C' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {t.name}: {t.result} {t.flag === 'H' ? '↑' : t.flag === 'L' ? '↓' : '↑↑'}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-300 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Lab Detail Modal */}
      <Modal open={!!selectedLab} onClose={() => { setSelectedLab(null); setTrendTest(null); }} title={`Laboratuvar Sonuçları - ${selectedLab?.panel || ''}`} wide>
        {selectedLab && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm">
                <span className="text-slate-500">Tarih:</span> <span className="font-bold text-slate-800">{selectedLab.date}</span>
                <span className="text-slate-300 mx-2">|</span>
                <span className="text-slate-500">İstem No:</span> <span className="font-mono font-bold text-slate-800">{selectedLab.orderNo}</span>
                <span className="text-slate-300 mx-2">|</span>
                <span className="text-slate-500">Hekim:</span> <span className="font-bold text-slate-800">{selectedLab.doctor}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"><Printer size={12} /> Yazdır</button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1"><Download size={12} /> PDF</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Test Adı</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Sonuç</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Birim</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Referans</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Durum</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedLab.tests.map((t, i) => (
                    <tr key={i} className={`hover:bg-slate-50 ${t.flag === 'C' ? 'bg-red-50/50' : t.flag !== 'N' ? 'bg-amber-50/30' : ''}`}>
                      <td className="py-3 px-3 font-medium text-slate-800">{t.name}</td>
                      <td className={`py-3 px-3 text-right font-bold ${t.flag === 'H' || t.flag === 'C' ? 'text-red-600' : t.flag === 'L' ? 'text-blue-600' : 'text-slate-800'}`}>
                        {t.result} {t.flag === 'H' ? '↑' : t.flag === 'L' ? '↓' : t.flag === 'C' ? '↑↑' : ''}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{t.unit}</td>
                      <td className="py-3 px-3 text-slate-500">{t.refLow} - {t.refHigh}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge color={t.flag === 'N' ? 'green' : t.flag === 'C' ? 'red' : 'amber'}>
                          {t.flag === 'N' ? 'Normal' : t.flag === 'H' ? 'Yüksek' : t.flag === 'L' ? 'Düşük' : 'Kritik'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => setTrendTest(trendTest === t.name ? null : t.name)}
                          className={`p-1 rounded hover:bg-blue-100 transition-colors ${trendTest === t.name ? 'bg-blue-100 text-blue-600' : 'text-slate-400'}`}>
                          <TrendingUp size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {trendTest && trendData.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-sm font-bold text-slate-700 mb-3">{trendTest} - Geçmiş Trend</h4>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} name={trendTest} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ===== TAB: Radyoloji (PACS) =====
function TabRadyoloji() {
  const [selectedStudy, setSelectedStudy] = useState<RadiologyStudy | null>(null);

  const modalityColors: Record<string, string> = { MR: 'purple', CR: 'blue', USG: 'cyan', EKO: 'red', BT: 'amber' };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Radyoloji / PACS</h3>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Plus size={14} /> Yeni Radyoloji İstemi</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockRadiology.map(study => (
          <div key={study.id} onClick={() => setSelectedStudy(study)}
            className="bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 cursor-pointer transition-all">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${study.hasImages ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {study.hasImages ? <ImageIcon size={24} /> : <Clock size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge color={modalityColors[study.modality] || 'blue'}>{study.modality}</Badge>
                  <StatusBadge status={study.status} />
                </div>
                <p className="text-sm font-bold text-slate-800 truncate">{study.description}</p>
                <p className="text-xs text-slate-500 mt-1">{study.date} • {study.doctor}</p>
                {study.status === 'raporlandi' && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">{study.impression}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedStudy} onClose={() => setSelectedStudy(null)} title={`Radyoloji Raporu - ${selectedStudy?.description || ''}`} wide>
        {selectedStudy && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-slate-500 block text-xs">Tarih</span><span className="font-bold text-slate-800">{selectedStudy.date}</span></div>
              <div><span className="text-slate-500 block text-xs">Modalite</span><span className="font-bold text-slate-800">{selectedStudy.modality}</span></div>
              <div><span className="text-slate-500 block text-xs">İsteyen Hekim</span><span className="font-bold text-slate-800">{selectedStudy.doctor}</span></div>
              <div><span className="text-slate-500 block text-xs">Raporlayan</span><span className="font-bold text-slate-800">{selectedStudy.radiologist || '-'}</span></div>
            </div>

            {selectedStudy.hasImages && (
              <div className="bg-black rounded-xl p-8 flex items-center justify-center min-h-[200px]">
                <div className="text-center text-slate-400">
                  <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">PACS Görüntüleyici</p>
                  <p className="text-xs mt-1">DICOM görüntüleri için PACS sunucusuna bağlanılıyor...</p>
                  <button className="mt-3 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">PACS Viewer Aç</button>
                </div>
              </div>
            )}

            {selectedStudy.status === 'raporlandi' && (
              <>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Bulgular</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{selectedStudy.findings}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Rapor</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{selectedStudy.report}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-blue-700 mb-1">Sonuç</h4>
                  <p className="text-sm text-blue-600">{selectedStudy.impression}</p>
                </div>
              </>
            )}

            {selectedStudy.status === 'bekliyor' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                <Clock size={32} className="mx-auto mb-2 text-amber-500" />
                <p className="text-sm font-bold text-amber-700">Çekim Bekleniyor</p>
                <p className="text-xs text-amber-600 mt-1">Tetkik henüz gerçekleştirilmemiştir.</p>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Printer size={14} /> Raporu Yazdır</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Download size={14} /> DICOM İndir</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Share2 size={14} /> Paylaş</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ===== TAB: Epikriz =====
function TabEpikriz() {
  const [selectedEpikriz, setSelectedEpikriz] = useState<EpikrizReport | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Epikriz Raporları</h3>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Plus size={14} /> Yeni Epikriz</button>
      </div>

      <div className="space-y-3">
        {mockEpikriz.map(ep => (
          <div key={ep.id} onClick={() => setSelectedEpikriz(ep)}
            className="bg-slate-50 hover:bg-blue-50/50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 cursor-pointer transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{ep.admissionDate} → {ep.dischargeDate}</span>
                  <span className="text-sm font-bold text-slate-800">{ep.dept}</span>
                  <StatusBadge status={ep.status} />
                </div>
                <p className="text-sm text-slate-700">{ep.diagnosis[0]}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Stethoscope size={12} /> {ep.doctor}</p>
              </div>
              <ChevronRight size={18} className="text-slate-300 mt-1" />
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedEpikriz} onClose={() => setSelectedEpikriz(null)} title={`Epikriz - ${selectedEpikriz?.dept || ''}`} wide>
        {selectedEpikriz && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-slate-500 block text-xs">Yatış Tarihi</span><span className="font-bold text-slate-800">{selectedEpikriz.admissionDate}</span></div>
              <div><span className="text-slate-500 block text-xs">Taburcu Tarihi</span><span className="font-bold text-slate-800">{selectedEpikriz.dischargeDate}</span></div>
              <div><span className="text-slate-500 block text-xs">Klinik</span><span className="font-bold text-slate-800">{selectedEpikriz.dept}</span></div>
              <div><span className="text-slate-500 block text-xs">Sorumlu Hekim</span><span className="font-bold text-slate-800">{selectedEpikriz.doctor}</span></div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Tanılar</h4>
              <div className="space-y-1">
                {selectedEpikriz.diagnosis.map((d, i) => (
                  <p key={i} className="text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <span className="font-mono text-slate-400 mr-2">{i + 1}.</span> {d}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Klinik Özet</h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{selectedEpikriz.summary}</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Yapılan İşlemler</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedEpikriz.procedures.map((p, i) => <span key={i} className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100">{p}</span>)}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Taburcu İlaçları</h4>
              <ul className="space-y-1">
                {selectedEpikriz.dischargeMeds.map((m, i) => (
                  <li key={i} className="text-sm text-slate-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 flex items-center gap-2">
                    <Pill size={14} className="text-emerald-500" /> {m}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-amber-700 mb-1">Kontrol / Takip Önerileri</h4>
              <p className="text-sm text-amber-600">{selectedEpikriz.followUp}</p>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Printer size={14} /> Yazdır</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Download size={14} /> PDF</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Send size={14} /> e-Nabız Gönder</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ===== TAB: Vital Bulgular =====
function TabVitaller() {
  const chartData = mockVitals.slice().reverse().map(v => ({
    name: `${v.date.slice(0,5)} ${v.time}`,
    sys: v.systolic, dia: v.diastolic, pulse: v.pulse, temp: v.temp, spo2: v.spo2, resp: v.resp
  }));

  const [chartType, setChartType] = useState<'bp' | 'temp' | 'spo2'>('bp');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Vital Bulgular</h3>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Plus size={14} /> Vital Kaydet</button>
      </div>

      {/* Latest Vitals Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Sistolik', value: `${mockVitals[0].systolic}`, unit: 'mmHg', icon: Heart, color: 'red', flag: mockVitals[0].systolic > 140 },
          { label: 'Diastolik', value: `${mockVitals[0].diastolic}`, unit: 'mmHg', icon: Heart, color: 'blue', flag: mockVitals[0].diastolic > 90 },
          { label: 'Nabız', value: `${mockVitals[0].pulse}`, unit: 'bpm', icon: Activity, color: 'amber', flag: false },
          { label: 'Ateş', value: `${mockVitals[0].temp}`, unit: '°C', icon: Thermometer, color: 'orange', flag: mockVitals[0].temp > 37.5 },
          { label: 'SpO2', value: `${mockVitals[0].spo2}`, unit: '%', icon: Wind, color: 'cyan', flag: mockVitals[0].spo2 < 94 },
          { label: 'Solunum', value: `${mockVitals[0].resp}`, unit: '/dk', icon: Wind, color: 'emerald', flag: false },
        ].map((v, i) => (
          <div key={i} className={`p-3 rounded-xl border ${v.flag ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <v.icon size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500">{v.label}</span>
            </div>
            <p className={`text-xl font-bold ${v.flag ? 'text-red-600' : 'text-slate-800'}`}>{v.value} <span className="text-xs font-normal text-slate-400">{v.unit}</span></p>
          </div>
        ))}
      </div>

      {/* Chart Type Selector */}
      <div className="flex gap-2">
        {[
          { id: 'bp' as const, label: 'Tansiyon / Nabız' },
          { id: 'temp' as const, label: 'Ateş' },
          { id: 'spo2' as const, label: 'SpO2 / Solunum' },
        ].map(c => (
          <button key={c.id} onClick={() => setChartType(c.id)}
            className={twMerge('px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border',
              chartType === c.id ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            )}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bp' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[50, 170]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="sys" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Sistolik" />
              <Line type="monotone" dataKey="dia" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Diastolik" />
              <Line type="monotone" dataKey="pulse" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} name="Nabız" />
            </LineChart>
          ) : chartType === 'temp' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity={0.2} /><stop offset="100%" stopColor="#f97316" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[35, 40]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="temp" stroke="#f97316" fill="url(#tempFill)" strokeWidth={2} name="Ateş (°C)" />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[85, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="spo2" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="SpO2 (%)" />
              <Line type="monotone" dataKey="resp" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} name="Solunum (/dk)" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Vitals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Tarih / Saat</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Sistolik</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Diastolik</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Nabız</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Ateş</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">SpO2</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Solunum</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Kaydeden</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockVitals.map((v, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="py-3 px-3 font-medium text-slate-700">{v.date} {v.time}</td>
                <td className={`py-3 px-3 text-center font-bold ${v.systolic > 140 ? 'text-red-600' : 'text-slate-800'}`}>{v.systolic}</td>
                <td className={`py-3 px-3 text-center font-bold ${v.diastolic > 90 ? 'text-red-600' : 'text-slate-800'}`}>{v.diastolic}</td>
                <td className={`py-3 px-3 text-center ${v.pulse > 100 ? 'text-red-600 font-bold' : 'text-slate-700'}`}>{v.pulse}</td>
                <td className={`py-3 px-3 text-center ${v.temp > 37.5 ? 'text-red-600 font-bold' : 'text-slate-700'}`}>{v.temp}°C</td>
                <td className={`py-3 px-3 text-center ${v.spo2 < 94 ? 'text-red-600 font-bold' : 'text-slate-700'}`}>{v.spo2}%</td>
                <td className="py-3 px-3 text-center text-slate-700">{v.resp}/dk</td>
                <td className="py-3 px-3 text-slate-500">{v.nurse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== TAB: Hemşirelik Gözlemleri =====
function TabHemsirelik() {
  const observations = [
    { date: '05.04.2026 09:30', nurse: 'Hmş. Fatma K.', category: 'Genel Durum', note: 'Hasta bilinci açık, koopere, oryante. Genel durumu iyi. Cilt turgor normal. Ödem yok. Mobilize.' },
    { date: '05.04.2026 14:00', nurse: 'Hmş. Aysel T.', category: 'İlaç Uygulaması', note: 'Co-Diovan 80/12.5 mg 1x1 oral uygulandı. Hasta ilaç sonrası vitalleri stabil.' },
    { date: '03.03.2025 08:00', nurse: 'Hmş. Fatma K.', category: 'Ağrı Değerlendirmesi', note: 'VAS skoru: 6/10 (Bel bölgesi). Ağrı kesici uygulandı. 1 saat sonra VAS: 3/10.' },
    { date: '03.03.2025 12:00', nurse: 'Hmş. Derya S.', category: 'Beslenme', note: 'Oral beslenme tolere ediyor. Diyabetik diyet uygulanıyor. Kan şekeri takibi yapıldı: 142 mg/dL.' },
    { date: '03.03.2025 20:00', nurse: 'Hmş. Fatma K.', category: 'Düşme Riski', note: 'Morse düşme riski skoru: 55 (Orta risk). Yatak kenarları kaldırıldı. Hasta ve yakını bilgilendirildi.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Hemşirelik Gözlemleri</h3>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Plus size={14} /> Yeni Gözlem</button>
      </div>

      <div className="space-y-3">
        {observations.map((obs, i) => (
          <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{obs.date}</span>
              <Badge color="purple">{obs.category}</Badge>
              <span className="text-xs text-slate-500">{obs.nurse}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{obs.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== TAB: Konsültasyonlar =====
function TabKonsultasyon() {
  const consults = [
    { id: 'K001', date: '05.04.2026', from: 'Kardiyoloji', to: 'Endokrinoloji', doctor: 'Uzm. Dr. Ahmet Karaca', reason: 'HbA1c yüksekliği nedeniyle endokrinoloji değerlendirmesi', status: 'bekliyor', response: '' },
    { id: 'K002', date: '03.03.2025', from: 'Ortopedi', to: 'Fizik Tedavi', doctor: 'Doç. Dr. Murat Aydın', reason: 'L4-L5 disk hernisi - FTR programı planlanması', status: 'tamamlandi', response: 'Hasta FTR programına alınmıştır. 15 seans fizik tedavi planlanmıştır. Egzersiz programı verilmiştir.' },
    { id: 'K003', date: '03.03.2025', from: 'Ortopedi', to: 'Nöroloji', doctor: 'Doç. Dr. Murat Aydın', reason: 'Sol alt ekstremite parestezi değerlendirmesi', status: 'tamamlandi', response: 'EMG incelemesinde sol L5 radikülopati bulguları saptanmıştır. Konservatif tedavi önerilmiştir.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Konsültasyonlar</h3>
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Plus size={14} /> Yeni Konsültasyon</button>
      </div>

      <div className="space-y-3">
        {consults.map(c => (
          <div key={c.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{c.date}</span>
              <span className="text-sm font-bold text-slate-800">{c.from} → {c.to}</span>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-sm text-slate-700"><span className="text-slate-500">Sebep:</span> {c.reason}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1"><Stethoscope size={12} /> İsteyen: {c.doctor}</p>
            {c.response && (
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <p className="text-xs font-bold text-emerald-600 mb-1">Konsültasyon Yanıtı:</p>
                <p className="text-sm text-slate-700">{c.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== TAB: Ameliyat Notları =====
function TabAmeliyat() {
  const surgeries = [
    {
      id: 'S001', date: '15.06.2024', dept: 'Genel Cerrahi', surgeon: 'Prof. Dr. Kemal Öztürk',
      anesthesiologist: 'Uzm. Dr. Deniz Aktaş', type: 'Laparoskopik Kolesistektomi',
      anesthesia: 'Genel Anestezi', duration: '45 dk', status: 'tamamlandi',
      notes: 'Laparoskopik kolesistektomi komplikasyonsuz gerçekleştirildi. Calot üçgeni güvenli şekilde diseke edildi. Sistik arter ve sistik kanal kliplendi ve kesildi. Safra kesesi karaciğer yatağından ayrılarak endobag ile çıkarıldı. Hemostaz kontrol edildi. Trokar yerleri kapatıldı.',
      preOp: 'Safra taşı (K80.2)', postOp: 'Komplikasyonsuz postoperatif dönem. Oral beslenme 6 saat sonra başlandı.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800">Ameliyat Notları</h3>
      </div>

      {surgeries.length > 0 ? surgeries.map(s => (
        <div key={s.id} className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">{s.date}</span>
            <span className="text-sm font-bold text-slate-800">{s.type}</span>
            <StatusBadge status={s.status} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-slate-500 text-xs block">Cerrah</span><span className="font-bold text-slate-800">{s.surgeon}</span></div>
            <div><span className="text-slate-500 text-xs block">Anestezist</span><span className="font-bold text-slate-800">{s.anesthesiologist}</span></div>
            <div><span className="text-slate-500 text-xs block">Anestezi Türü</span><span className="font-bold text-slate-800">{s.anesthesia}</span></div>
            <div><span className="text-slate-500 text-xs block">Süre</span><span className="font-bold text-slate-800">{s.duration}</span></div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 mb-1">Preoperatif Tanı</h4>
            <p className="text-sm text-slate-700">{s.preOp}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 mb-1">Ameliyat Notu</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{s.notes}</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 mb-1">Postoperatif Seyir</h4>
            <p className="text-sm text-slate-700">{s.postOp}</p>
          </div>
        </div>
      )) : (
        <div className="text-center py-12 text-slate-400">
          <Syringe size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Ameliyat kaydı bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}

// ===== MAIN COMPONENT =====
export function ElectronicHealthRecord() {
  const { currentPatient } = usePatientContext();
  const [activeTab, setActiveTab] = useState('ozet');
  const [eNabizModal, setENabizModal] = useState(false);
  const [eNabizLoading, setENabizLoading] = useState(false);
  const [eNabizDone, setENabizDone] = useState(false);
  const [searchValue, setSearchValue] = useState('12345678901');
  const [patientFound, setPatientFound] = useState(true);

  const tabs = [
    { id: 'ozet', name: 'Klinik Özet', icon: Activity },
    { id: 'vizitler', name: 'Geçmiş Vizitler', icon: History, count: mockVisits.length },
    { id: 'receteler', name: 'Reçeteler / İlaç', icon: Pill, count: mockPrescriptions.length },
    { id: 'lab', name: 'Laboratuvar', icon: FlaskConical, count: mockLabResults.length },
    { id: 'radyoloji', name: 'Radyoloji (PACS)', icon: Bone, count: mockRadiology.length },
    { id: 'epikriz', name: 'Epikriz Raporları', icon: FileSignature, count: mockEpikriz.length },
    { id: 'vitaller', name: 'Vital Bulgular', icon: Heart, count: mockVitals.length },
    { id: 'hemsirelik', name: 'Hemşirelik Gözlemleri', icon: ClipboardList },
    { id: 'konsultasyon', name: 'Konsültasyonlar', icon: Stethoscope },
    { id: 'ameliyat', name: 'Ameliyat Notları', icon: Syringe },
  ];

  const handleENabiz = () => {
    setENabizModal(true);
    setENabizLoading(true);
    setENabizDone(false);
    setTimeout(() => { setENabizLoading(false); setENabizDone(true); }, 3000);
  };

  const bannerPatient = useMemo(
    () => ({
      fullName: currentPatient?.fullName ?? 'Mehmet Demir',
      tc: currentPatient?.tc ?? '123***789',
      fileNo: currentPatient?.protocolNo ?? '#84920',
      department: currentPatient?.department ?? 'Kardiyoloji',
      doctor: currentPatient?.doctor ?? 'Uzm. Dr. Ahmet Karaca',
      insurance: currentPatient?.insurance ?? 'SGK',
      complaint: currentPatient?.complaint ?? 'Hipertansiyon kontrolü',
      source: currentPatient?.source ?? 'Klinik zaman çizgisi',
    }),
    [currentPatient],
  );

  useEffect(() => {
    if (!currentPatient) {
      return;
    }

    setSearchValue(currentPatient.tc || currentPatient.fullName);
    setPatientFound(true);
  }, [currentPatient]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Hasta TC, Dosya No veya Barkod (Örn: 12345678901)"
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleENabiz} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Link size={16} /> e-Nabız Çek
          </button>
          <button onClick={() => setActiveTab('receteler')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
            E-Reçete Yaz
          </button>
        </div>
      </div>

      {/* Patient Banner */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden text-white flex-none flex flex-col md:flex-row">
        <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center overflow-hidden flex-shrink-0">
              <User size={32} className="text-slate-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{bannerPatient.fullName}</h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-300">
                <span className="font-mono">TC: {bannerPatient.tc}</span>
                <span>•</span>
                <span>Dosya: {bannerPatient.fileNo}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div className="flex items-center gap-2 text-slate-300"><Calendar size={16} className="text-slate-400" /> 12.04.1965 (61 E)</div>
            <div className="flex items-center gap-2 text-slate-300"><Droplet size={16} className="text-red-400" /> A Rh(+)</div>
            <div className="flex items-center gap-2 text-slate-300 col-span-2"><MapPin size={16} className="text-slate-400" /> Kadıköy / İstanbul</div>
          </div>
        </div>

        <div className="p-6 md:w-2/3 bg-slate-900/50 flex flex-col justify-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="cyan">{bannerPatient.department}</Badge>
            <Badge color="purple">{bannerPatient.doctor}</Badge>
            <Badge color="green">{bannerPatient.insurance}</Badge>
            <Badge color="slate">{bannerPatient.source}</Badge>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex-1 min-w-[200px]">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle size={14} /> Alerjiler</h4>
              <p className="text-sm font-medium">Penisilin (Anafilaksi Riski), Sülfonamid</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex-1 min-w-[200px]">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Activity size={14} /> Klinik Odak</h4>
              <p className="text-sm font-medium">{bannerPatient.complaint}</p>
            </div>
          </div>
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex gap-4 bg-slate-800 p-3 rounded-xl border border-slate-700 w-full sm:w-auto">
              <div>
                <p className="text-xs text-slate-400 font-medium">Boy / Kilo</p>
                <p className="text-lg font-bold">178 <span className="text-sm font-normal text-slate-400">cm</span> / 85 <span className="text-sm font-normal text-slate-400">kg</span></p>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div>
                <p className="text-xs text-slate-400 font-medium">VKİ (BMI)</p>
                <p className="text-lg font-bold text-amber-400">26.8 <span className="text-sm font-normal text-slate-400">Hafif Kilolu</span></p>
              </div>
            </div>
            <button onClick={() => setActiveTab('vitaller')} className="text-xs font-semibold text-blue-400 hover:text-blue-300 ml-auto flex items-center gap-1"><History size={14} /> Vital Takip</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Navigation */}
        <div className="w-full lg:w-64 flex-none space-y-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm h-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={twMerge(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left",
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              )}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-blue-600" : "text-slate-400"} />
              <span className="flex-1">{tab.name}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>{tab.count}</span>
              )}
              {activeTab === tab.id && <ChevronRight size={16} className="text-blue-400" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-y-auto">
          {activeTab === 'ozet' && <TabKlinikOzet onOpenVitals={() => setActiveTab('vitaller')} />}
          {activeTab === 'vizitler' && <TabVizitler />}
          {activeTab === 'receteler' && <TabReceteler />}
          {activeTab === 'lab' && <TabLaboratuvar />}
          {activeTab === 'radyoloji' && <TabRadyoloji />}
          {activeTab === 'epikriz' && <TabEpikriz />}
          {activeTab === 'vitaller' && <TabVitaller />}
          {activeTab === 'hemsirelik' && <TabHemsirelik />}
          {activeTab === 'konsultasyon' && <TabKonsultasyon />}
          {activeTab === 'ameliyat' && <TabAmeliyat />}
        </div>
      </div>

      {/* e-Nabız Modal */}
      <Modal open={eNabizModal} onClose={() => setENabizModal(false)} title="e-Nabız Veri Çekme">
        <div className="space-y-6">
          {eNabizLoading ? (
            <div className="text-center py-12">
              <RefreshCw size={40} className="mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-sm font-bold text-slate-800">e-Nabız Sunucusuna Bağlanılıyor...</p>
              <p className="text-xs text-slate-500 mt-2">Hasta verileri Sağlık Bakanlığı e-Nabız sisteminden sorgulanıyor.</p>
              <div className="mt-4 space-y-2 max-w-xs mx-auto text-left">
                {['Kimlik doğrulama...', 'Hasta geçmişi çekiliyor...', 'Reçeteler sorgulanıyor...', 'Laboratuvar verileri alınıyor...'].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <RefreshCw size={12} className="animate-spin text-blue-400" /> {s}
                  </div>
                ))}
              </div>
            </div>
          ) : eNabizDone ? (
            <div className="text-center py-8">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" />
              <p className="text-lg font-bold text-slate-800">e-Nabız Verileri Başarıyla Alındı</p>
              <p className="text-sm text-slate-500 mt-2">Hasta dosyasına entegre edildi.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-xs text-slate-500">Vizit Kaydı</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-emerald-600">8</p>
                  <p className="text-xs text-slate-500">E-Reçete</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-amber-600">15</p>
                  <p className="text-xs text-slate-500">Lab Sonucu</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <p className="text-2xl font-bold text-purple-600">4</p>
                  <p className="text-xs text-slate-500">Radyoloji</p>
                </div>
              </div>
              <button onClick={() => setENabizModal(false)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                Tamam
              </button>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
