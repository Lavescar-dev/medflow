import React, { useState, useCallback } from 'react';
import {
  CalendarDays, Clock, Users, X, ChevronLeft, ChevronRight,
  Plus, AlertTriangle, CheckCircle2, ArrowLeftRight, BarChart2,
  Bell, Shield, Download, FileText,
  Edit3, Info, Zap, CheckSquare, XSquare, UserCheck, Coffee
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { twMerge } from 'tailwind-merge';

type ShiftCode = 'G' | 'A' | 'N' | 'İ' | 'R' | 'T' | '—';

const shiftLegend: Record<ShiftCode, { label: string; color: string; bg: string; hours: number }> = {
  G: { label: 'Gündüz (08-16)', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200', hours: 8 },
  A: { label: 'Akşam (16-24)', color: 'text-amber-700', bg: 'bg-amber-100 border-amber-200', hours: 8 },
  N: { label: 'Gece (00-08)', color: 'text-purple-700', bg: 'bg-purple-100 border-purple-200', hours: 8 },
  İ: { label: 'Yıllık İzin', color: 'text-emerald-700', bg: 'bg-emerald-100 border-emerald-200', hours: 0 },
  R: { label: 'Hastalık Raporu', color: 'text-red-700', bg: 'bg-red-100 border-red-200', hours: 0 },
  T: { label: 'Takas Yapıldı', color: 'text-pink-700', bg: 'bg-pink-100 border-pink-200', hours: 8 },
  '—': { label: 'Dinlenme/Off', color: 'text-slate-400', bg: 'bg-slate-50 border-slate-200', hours: 0 },
};

const daysInApril = Array.from({ length: 30 }, (_, i) => i + 1);
const dayNames = ['Çar','Per','Cum','Cmt','Paz','Pzt','Sal','Çar','Per','Cum','Cmt','Paz','Pzt','Sal','Çar','Per','Cum','Cmt','Paz','Pzt','Sal','Çar','Per','Cum','Cmt','Paz','Pzt','Sal','Çar','Per'];
const isWeekend = (d: number) => { const n = dayNames[d - 1]; return n === 'Cmt' || n === 'Paz'; };
const isToday = (d: number) => d === 7;

interface ShiftEntry {
  id: string; staff: string; role: string; dept: string; avatar: string;
  shifts: Record<number, ShiftCode>;
}

const initialShifts: ShiftEntry[] = [
  { id: 's1', staff: 'Dr. Hakan Çelik', role: 'Acil Hekimi', dept: 'Acil Servis', avatar: 'HC',
    shifts: {1:'G',2:'G',3:'—',4:'N',5:'N',6:'—',7:'G',8:'A',9:'—',10:'N',11:'N',12:'—',13:'G',14:'G',15:'—',16:'A',17:'N',18:'—',19:'—',20:'G',21:'G',22:'—',23:'N',24:'A',25:'—',26:'G',27:'G',28:'—',29:'N',30:'—'} },
  { id: 's2', staff: 'Dr. Zeynep Yıldız', role: 'Acil Hekimi', dept: 'Acil Servis', avatar: 'ZY',
    shifts: {1:'A',2:'—',3:'N',4:'G',5:'—',6:'A',7:'N',8:'—',9:'G',10:'G',11:'—',12:'A',13:'N',14:'—',15:'G',16:'G',17:'—',18:'N',19:'A',20:'—',21:'N',22:'A',23:'—',24:'G',25:'G',26:'—',27:'A',28:'N',29:'—',30:'G'} },
  { id: 's3', staff: 'Dr. Sinan Kaya', role: 'Genel Cerrahi Uzm.', dept: 'Genel Cerrahi', avatar: 'SK',
    shifts: {1:'G',2:'G',3:'G',4:'G',5:'G',6:'—',7:'—',8:'G',9:'G',10:'N',11:'N',12:'—',13:'G',14:'G',15:'G',16:'G',17:'G',18:'—',19:'—',20:'G',21:'G',22:'G',23:'G',24:'G',25:'—',26:'—',27:'G',28:'G',29:'G',30:'G'} },
  { id: 's4', staff: 'Hmş. Fatma Korkmaz', role: 'Sorumlu Hemşire', dept: 'Dahiliye', avatar: 'FK',
    shifts: {1:'G',2:'G',3:'G',4:'G',5:'G',6:'—',7:'—',8:'G',9:'G',10:'G',11:'G',12:'G',13:'—',14:'—',15:'G',16:'G',17:'G',18:'G',19:'G',20:'—',21:'—',22:'G',23:'G',24:'G',25:'G',26:'G',27:'—',28:'—',29:'G',30:'G'} },
  { id: 's5', staff: 'Hmş. Aysel Toprak', role: 'YBÜ Hemşiresi', dept: 'Yoğun Bakım', avatar: 'AT',
    shifts: {1:'N',2:'N',3:'—',4:'G',5:'A',6:'—',7:'R',8:'R',9:'R',10:'R',11:'R',12:'R',13:'R',14:'R',15:'—',16:'G',17:'G',18:'—',19:'N',20:'N',21:'—',22:'G',23:'A',24:'—',25:'N',26:'N',27:'—',28:'G',29:'A',30:'—'} },
  { id: 's6', staff: 'Hmş. Sevgi Arslan', role: 'YBÜ Hemşiresi', dept: 'Yoğun Bakım', avatar: 'SA',
    shifts: {1:'G',2:'A',3:'—',4:'N',5:'N',6:'—',7:'G',8:'G',9:'—',10:'A',11:'N',12:'—',13:'G',14:'A',15:'—',16:'N',17:'N',18:'—',19:'G',20:'G',21:'—',22:'A',23:'N',24:'—',25:'G',26:'A',27:'—',28:'N',29:'N',30:'—'} },
  { id: 's7', staff: 'Hmş. Derya Sarı', role: 'Cerrahi Hemşiresi', dept: 'Genel Cerrahi', avatar: 'DS',
    shifts: {1:'G',2:'G',3:'G',4:'G',5:'G',6:'—',7:'—',8:'G',9:'G',10:'G',11:'G',12:'İ',13:'İ',14:'İ',15:'İ',16:'İ',17:'—',18:'—',19:'G',20:'G',21:'G',22:'G',23:'G',24:'—',25:'—',26:'G',27:'G',28:'G',29:'G',30:'G'} },
  { id: 's8', staff: 'Dr. Mehmet Yılmaz', role: 'Dahiliye Uzmanı', dept: 'Dahiliye', avatar: 'MY',
    shifts: {1:'G',2:'G',3:'—',4:'G',5:'G',6:'—',7:'—',8:'G',9:'G',10:'—',11:'G',12:'G',13:'—',14:'—',15:'G',16:'G',17:'—',18:'G',19:'G',20:'—',21:'—',22:'G',23:'G',24:'—',25:'G',26:'G',27:'—',28:'—',29:'G',30:'G'} },
  { id: 's9', staff: 'Hmş. Elif Demir', role: 'Poliklinik Hemşiresi', dept: 'Poliklinik', avatar: 'ED',
    shifts: {1:'G',2:'G',3:'G',4:'G',5:'G',6:'—',7:'—',8:'G',9:'G',10:'G',11:'G',12:'G',13:'—',14:'—',15:'G',16:'G',17:'G',18:'G',19:'G',20:'—',21:'—',22:'G',23:'G',24:'G',25:'G',26:'G',27:'—',28:'—',29:'G',30:'G'} },
  { id: 's10', staff: 'Ecz. Derya Aktaş', role: 'Eczane Sorumlusu', dept: 'Eczane', avatar: 'DA',
    shifts: {1:'G',2:'G',3:'G',4:'G',5:'G',6:'—',7:'—',8:'G',9:'G',10:'G',11:'G',12:'G',13:'—',14:'—',15:'İ',16:'İ',17:'İ',18:'İ',19:'İ',20:'—',21:'—',22:'G',23:'G',24:'G',25:'G',26:'G',27:'—',28:'—',29:'G',30:'G'} },
];

interface SwapRequest {
  id: string; from: string; to: string; fromDay: number; toDay: number;
  fromShift: ShiftCode; toShift: ShiftCode; reason: string; dept: string;
  status: 'Beklemede' | 'Onaylandı' | 'Reddedildi'; created: string;
}

const initialSwaps: SwapRequest[] = [
  { id: 'SR-001', from: 'Hmş. Aysel Toprak', to: 'Hmş. Sevgi Arslan', fromDay: 19, toDay: 22, fromShift: 'N', toShift: 'G', reason: 'Doktor randevusu nedeniyle gece vardiyasını değiştirmek istiyorum.', dept: 'Yoğun Bakım', status: 'Beklemede', created: '05.04.2026' },
  { id: 'SR-002', from: 'Dr. Hakan Çelik', to: 'Dr. Zeynep Yıldız', fromDay: 29, toDay: 30, fromShift: 'N', toShift: 'G', reason: 'Aile etkinliği nedeniyle takas talep ediyorum.', dept: 'Acil Servis', status: 'Beklemede', created: '06.04.2026' },
  { id: 'SR-003', from: 'Hmş. Derya Sarı', to: 'Hmş. Fatma Korkmaz', fromDay: 8, toDay: 10, fromShift: 'G', toShift: 'G', reason: 'Eğitim semineri katılımı.', dept: 'Genel Cerrahi', status: 'Onaylandı', created: '01.04.2026' },
  { id: 'SR-004', from: 'Hmş. Elif Demir', to: 'Hmş. Aysel Toprak', fromDay: 15, toDay: 16, fromShift: 'G', toShift: 'N', reason: 'Kişisel sebepler.', dept: 'Poliklinik', status: 'Reddedildi', created: '02.04.2026' },
  { id: 'SR-005', from: 'Dr. Mehmet Yılmaz', to: 'Dr. Hakan Çelik', fromDay: 25, toDay: 26, fromShift: 'G', toShift: 'A', reason: 'Kongre katılımı.', dept: 'Dahiliye', status: 'Beklemede', created: '07.04.2026' },
];

function calcStats(entry: ShiftEntry) {
  let g = 0, a = 0, n = 0, izin = 0, rapor = 0, off = 0, hours = 0;
  Object.values(entry.shifts).forEach(s => {
    if (s === 'G') { g++; hours += 8; }
    else if (s === 'A') { a++; hours += 8; }
    else if (s === 'N') { n++; hours += 8; }
    else if (s === 'İ') izin++;
    else if (s === 'R') rapor++;
    else if (s === 'T') { hours += 8; }
    else off++;
  });
  return { g, a, n, izin, rapor, off, hours };
}

function detectConflicts(shifts: ShiftEntry[]) {
  const alerts: { staff: string; msg: string; severity: 'error' | 'warning' | 'info' }[] = [];
  shifts.forEach(s => {
    let consNights = 0;
    for (let d = 1; d <= 30; d++) {
      if (s.shifts[d] === 'N') { consNights++; if (consNights >= 4) { alerts.push({ staff: s.staff, msg: `${d - consNights + 1}-${d}. günler: ${consNights} ardışık gece nöbeti (Max 3 — 4857 İş Kanunu)`, severity: 'error' }); break; } }
      else consNights = 0;
    }
    for (let d = 1; d < 30; d++) {
      if (s.shifts[d] === 'N' && s.shifts[d + 1] === 'G') {
        alerts.push({ staff: s.staff, msg: `${d}→${d + 1}. gün: Gece→Gündüz ardı��ık vardiya — 11 saat dinlenme ihlali`, severity: 'error' });
      }
    }
    const { hours } = calcStats(s);
    if (hours > 200) alerts.push({ staff: s.staff, msg: `Aylık ${hours} saat çalışma — Fazla mesai eşiği (200s) aşıldı`, severity: 'warning' });
    const raporDays = Object.entries(s.shifts).filter(([d, v]) => v === 'R' && isWeekend(Number(d))).length;
    if (raporDays > 0) alerts.push({ staff: s.staff, msg: `Hafta sonu hastalık raporu mevcut (${raporDays} gün) — SGK kontrolü gerekli`, severity: 'info' });
  });
  return alerts;
}

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-100',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-5xl' };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200 flex-none">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

const tabs = [
  { id: 'cizelge', label: 'Nöbet Çizelgesi', icon: CalendarDays },
  { id: 'takas', label: 'Takas Talepleri', icon: ArrowLeftRight },
  { id: 'analiz', label: 'Vardiya Analizi', icon: BarChart2 },
  { id: 'uyarilar', label: 'Uyarılar & Kurallar', icon: Shield },
];

export function ShiftModule() {
  const [activeTab, setActiveTab] = useState<'cizelge' | 'takas' | 'analiz' | 'uyarilar'>('cizelge');
  const [shifts, setShifts] = useState(initialShifts);
  const [swaps, setSwaps] = useState(initialSwaps);
  const [deptFilter, setDeptFilter] = useState('Tümü');
  const [editCell, setEditCell] = useState<{ staffId: string; day: number } | null>(null);
  const [editShift, setEditShift] = useState<ShiftCode>('G');
  const [showNewSwap, setShowNewSwap] = useState(false);
  const [published, setPublished] = useState(false);

  const depts = ['Tümü', ...Array.from(new Set(shifts.map(s => s.dept)))];
  const filtered = deptFilter === 'Tümü' ? shifts : shifts.filter(s => s.dept === deptFilter);
  const conflicts = detectConflicts(shifts);
  const pendingSwaps = swaps.filter(s => s.status === 'Beklemede').length;

  const handleCellClick = (staffId: string, day: number, current: ShiftCode) => {
    setEditCell({ staffId, day });
    setEditShift(current);
  };

  const handleSaveEdit = () => {
    if (!editCell) return;
    setShifts(prev => prev.map(s =>
      s.id === editCell.staffId ? { ...s, shifts: { ...s.shifts, [editCell.day]: editShift } } : s
    ));
    setEditCell(null);
  };

  const handleSwapAction = (id: string, action: 'Onaylandı' | 'Reddedildi') => {
    setSwaps(prev => prev.map(s => s.id === id ? { ...s, status: action } : s));
  };

  const hoursData = shifts.map(s => ({ name: s.staff.split(' ').slice(-1)[0], hours: calcStats(s).hours, dept: s.dept }));
  const pieData = [
    { name: 'Gündüz (G)', value: shifts.reduce((a, s) => a + calcStats(s).g, 0), color: '#3b82f6' },
    { name: 'Akşam (A)', value: shifts.reduce((a, s) => a + calcStats(s).a, 0), color: '#f59e0b' },
    { name: 'Gece (N)', value: shifts.reduce((a, s) => a + calcStats(s).n, 0), color: '#8b5cf6' },
    { name: 'İzin (İ)', value: shifts.reduce((a, s) => a + calcStats(s).izin, 0), color: '#10b981' },
    { name: 'Rapor (R)', value: shifts.reduce((a, s) => a + calcStats(s).rapor, 0), color: '#ef4444' },
  ];

  const totalStats = {
    errors: conflicts.filter(c => c.severity === 'error').length,
    warnings: conflicts.filter(c => c.severity === 'warning').length,
    infos: conflicts.filter(c => c.severity === 'info').length,
  };

  const staffForEdit = editCell ? shifts.find(s => s.id === editCell.staffId) : null;

  const coverageToday = [
    { dept: 'Acil Servis', staff: filtered.filter(s => s.dept === 'Acil Servis' && ['G','A','N'].includes(s.shifts[7] || '—')).map(s => s.staff.split(' ').slice(-1)[0]).join(', ') || '—', ok: filtered.some(s => s.dept === 'Acil Servis' && ['G','A','N'].includes(s.shifts[7] || '—')) },
    { dept: 'Yoğun Bakım', staff: filtered.filter(s => s.dept === 'Yoğun Bakım' && ['G','A','N'].includes(s.shifts[7] || '—')).map(s => s.staff.split(' ').slice(-1)[0]).join(', ') || '—', ok: filtered.some(s => s.dept === 'Yoğun Bakım' && ['G','A','N'].includes(s.shifts[7] || '—')) },
    { dept: 'Dahiliye', staff: filtered.filter(s => s.dept === 'Dahiliye' && ['G','A','N'].includes(s.shifts[7] || '—')).map(s => s.staff.split(' ').slice(-1)[0]).join(', ') || '—', ok: filtered.some(s => s.dept === 'Dahiliye' && ['G','A','N'].includes(s.shifts[7] || '—')) },
    { dept: 'Genel Cerrahi', staff: filtered.filter(s => s.dept === 'Genel Cerrahi' && ['G','A','N'].includes(s.shifts[7] || '—')).map(s => s.staff.split(' ').slice(-1)[0]).join(', ') || '—', ok: filtered.some(s => s.dept === 'Genel Cerrahi' && ['G','A','N'].includes(s.shifts[7] || '—')) },
  ];

  return (
    <div className="space-y-5 max-w-[1700px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Nöbet Yönetimi</h2>
          <p className="text-sm text-slate-500">Aylık nöbet çizelgesi · Vardiya planlama · Takas yönetimi · Çakışma denetimi</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {totalStats.errors > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
              <AlertTriangle size={14} /> {totalStats.errors} Kural İhlali
            </span>
          )}
          {pendingSwaps > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              <Bell size={14} /> {pendingSwaps} Takas Bekliyor
            </span>
          )}
          <button onClick={() => setPublished(v => !v)} className={twMerge('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all', published ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700')}>
            {published ? <><CheckCircle2 size={14} /> Yayınlandı</> : <><Zap size={14} /> Çizelgeyi Yayınla</>}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border bg-white text-slate-600 border-slate-200 hover:bg-slate-50">
            <Download size={14} /> Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-none">
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><Users size={18} className="text-blue-600" /></div>
          <div><p className="text-[10px] font-bold text-slate-500 uppercase">Toplam Personel</p><p className="text-xl font-black text-slate-800">{shifts.length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0"><UserCheck size={18} className="text-emerald-600" /></div>
          <div><p className="text-[10px] font-bold text-slate-500 uppercase">Bugün Aktif</p><p className="text-xl font-black text-slate-800">{shifts.filter(s => ['G','A','N','T'].includes(s.shifts[7] || '—')).length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0"><Coffee size={18} className="text-amber-600" /></div>
          <div><p className="text-[10px] font-bold text-slate-500 uppercase">İzin / Rapor</p><p className="text-xl font-black text-slate-800">{shifts.filter(s => ['İ','R'].includes(s.shifts[7] || '—')).length}</p></div>
        </div>
        <div className={twMerge('rounded-xl border p-3 flex items-center gap-3 shadow-sm', totalStats.errors > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200')}>
          <div className={twMerge('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', totalStats.errors > 0 ? 'bg-red-100' : 'bg-slate-100')}>
            <Shield size={18} className={totalStats.errors > 0 ? 'text-red-600' : 'text-slate-400'} />
          </div>
          <div><p className="text-[10px] font-bold text-slate-500 uppercase">Kural İhlali</p><p className={twMerge('text-xl font-black', totalStats.errors > 0 ? 'text-red-700' : 'text-slate-800')}>{totalStats.errors}</p></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl flex-none">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={twMerge('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center',
              activeTab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
            <t.icon size={14} />{t.label}
            {t.id === 'takas' && pendingSwaps > 0 && <span className="bg-amber-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">{pendingSwaps}</span>}
            {t.id === 'uyarilar' && totalStats.errors > 0 && <span className="bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">{totalStats.errors}</span>}
          </button>
        ))}
      </div>

      {/* Tab: Nöbet Çizelgesi */}
      {activeTab === 'cizelge' && (
        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          {/* Month Nav + Dept Filter */}
          <div className="flex items-center gap-3 flex-wrap flex-none">
            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200"><ChevronLeft size={16} className="text-slate-500" /></button>
              <span className="text-sm font-bold text-slate-800 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">Nisan 2026</span>
              <button className="p-1.5 hover:bg-slate-100 rounded-lg border border-slate-200"><ChevronRight size={16} className="text-slate-500" /></button>
            </div>
            <div className="flex gap-1 flex-wrap">
              {depts.map(f => (
                <button key={f} onClick={() => setDeptFilter(f)} className={twMerge('px-2.5 py-1 rounded-lg text-[11px] font-semibold border', deptFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50')}>{f}</button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-1.5 flex-wrap flex-none">
            {Object.entries(shiftLegend).map(([k, v]) => (
              <span key={k} className={`text-[10px] font-bold px-2 py-0.5 rounded border ${v.bg} ${v.color}`}>{k} — {v.label}</span>
            ))}
          </div>

          {/* Calendar Table */}
          <div className="flex-1 overflow-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-xs border-collapse" style={{ minWidth: '1100px' }}>
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left py-2 px-3 font-semibold text-slate-600 sticky left-0 bg-slate-50 z-20 min-w-[200px] border-r border-slate-200">Personel</th>
                  {daysInApril.map(d => (
                    <th key={d} className={twMerge('text-center py-2 px-0.5 min-w-[30px]', isToday(d) ? 'bg-blue-100' : isWeekend(d) ? 'bg-red-50/60' : '')}>
                      <div className={twMerge('text-[9px] leading-none mb-0.5', isWeekend(d) ? 'text-red-400' : 'text-slate-400')}>{dayNames[d - 1]}</div>
                      <div className={twMerge('font-bold', isToday(d) ? 'text-blue-600' : isWeekend(d) ? 'text-red-500' : 'text-slate-700')}>{d}</div>
                    </th>
                  ))}
                  <th className="text-center py-2 px-2 text-slate-500 min-w-[48px]">N.Saat</th>
                  <th className="text-center py-2 px-2 text-slate-500 min-w-[36px]">Gündüz</th>
                  <th className="text-center py-2 px-2 text-slate-500 min-w-[36px]">Gece</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(s => {
                  const stats = calcStats(s);
                  const hasConflict = conflicts.some(c => c.staff === s.staff && c.severity === 'error');
                  return (
                    <tr key={s.id} className={twMerge('hover:bg-slate-50/50 group', hasConflict ? 'bg-red-50/30' : '')}>
                      <td className="py-2 px-3 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">{s.avatar}</div>
                          <div>
                            <p className="font-bold text-slate-800 text-[11px] leading-tight">{s.staff}</p>
                            <p className="text-[9px] text-slate-400">{s.role}</p>
                          </div>
                          {hasConflict && <AlertTriangle size={12} className="text-red-500 flex-shrink-0" />}
                        </div>
                      </td>
                      {daysInApril.map(d => {
                        const shift = s.shifts[d] || '—';
                        const cfg = shiftLegend[shift] || shiftLegend['—'];
                        const isConflictDay = conflicts.some(c => c.staff === s.staff && c.severity === 'error');
                        return (
                          <td key={d} className={twMerge('text-center py-1 px-0', isToday(d) ? 'bg-blue-50/40' : isWeekend(d) ? 'bg-red-50/20' : '')}>
                            <button onClick={() => handleCellClick(s.id, d, shift)}
                              className={twMerge('inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-black border transition-all hover:scale-110 hover:shadow-sm cursor-pointer', cfg.bg, cfg.color)}>
                              {shift}
                            </button>
                          </td>
                        );
                      })}
                      <td className="text-center py-2 px-2 font-bold text-slate-700 text-[11px]">{stats.hours}s</td>
                      <td className="text-center py-2 px-2 font-bold text-blue-600 text-[11px]">{stats.g}</td>
                      <td className="text-center py-2 px-2 font-bold text-purple-600 text-[11px]">{stats.n}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Today Coverage */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-none">
            <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5"><Clock size={13} className="text-blue-500" /> Bugün (7 Nisan Salı) — Birim Kapsama Durumu</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {coverageToday.map((c, i) => (
                <div key={i} className={twMerge('p-2.5 rounded-lg border text-xs', c.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200')}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-[11px]">{c.dept}</span>
                    {c.ok ? <CheckCircle2 size={13} className="text-emerald-500" /> : <AlertTriangle size={13} className="text-red-500" />}
                  </div>
                  <p className="text-[10px] text-slate-600 truncate">{c.ok ? c.staff : 'Eksik Personel!'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Takas Talepleri */}
      {activeTab === 'takas' && (
        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          <div className="flex items-center justify-between flex-none">
            <p className="text-sm text-slate-600">Personel tarafından iletilen vardiya takas talepleri. Onay/red işlemleri birim sorumlusuna bildirim gönderir.</p>
            <button onClick={() => setShowNewSwap(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
              <Plus size={14} /> Yeni Takas Talebi
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 flex-none">
            {[
              { label: 'Beklemede', count: swaps.filter(s => s.status === 'Beklemede').length, color: 'amber' },
              { label: 'Onaylandı', count: swaps.filter(s => s.status === 'Onaylandı').length, color: 'green' },
              { label: 'Reddedildi', count: swaps.filter(s => s.status === 'Reddedildi').length, color: 'red' },
            ].map(s => (
              <div key={s.label} className={`bg-${s.color === 'amber' ? 'amber' : s.color === 'green' ? 'emerald' : 'red'}-50 border border-${s.color === 'amber' ? 'amber' : s.color === 'green' ? 'emerald' : 'red'}-200 rounded-xl p-3 text-center`}>
                <p className="text-xl font-black text-slate-800">{s.count}</p>
                <p className="text-[11px] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {swaps.map(sw => (
              <div key={sw.id} className={twMerge('bg-white rounded-xl border p-4 shadow-sm', sw.status === 'Beklemede' ? 'border-amber-200' : sw.status === 'Onaylandı' ? 'border-emerald-200' : 'border-red-200')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{sw.id}</span>
                      <Badge color={sw.status === 'Beklemede' ? 'amber' : sw.status === 'Onaylandı' ? 'green' : 'red'}>{sw.status}</Badge>
                      <Badge color="slate">{sw.dept}</Badge>
                      <span className="text-[10px] text-slate-400">• {sw.created}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 mb-0.5">Talep Eden</p>
                        <p className="text-xs font-bold text-slate-800">{sw.from}</p>
                        <div className="flex items-center justify-center gap-1 mt-0.5">
                          <span className="text-[10px] text-slate-400">{sw.fromDay}. gün</span>
                          <span className={twMerge('text-[10px] font-black px-1.5 rounded border', shiftLegend[sw.fromShift].bg, shiftLegend[sw.fromShift].color)}>{sw.fromShift}</span>
                        </div>
                      </div>
                      <ArrowLeftRight size={16} className="text-slate-300 flex-shrink-0" />
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 mb-0.5">Takas Yapılacak</p>
                        <p className="text-xs font-bold text-slate-800">{sw.to}</p>
                        <div className="flex items-center justify-center gap-1 mt-0.5">
                          <span className="text-[10px] text-slate-400">{sw.toDay}. gün</span>
                          <span className={twMerge('text-[10px] font-black px-1.5 rounded border', shiftLegend[sw.toShift].bg, shiftLegend[sw.toShift].color)}>{sw.toShift}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-100 italic">"{sw.reason}"</p>
                  </div>
                  {sw.status === 'Beklemede' && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={() => handleSwapAction(sw.id, 'Onaylandı')} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">
                        <CheckSquare size={13} /> Onayla
                      </button>
                      <button onClick={() => handleSwapAction(sw.id, 'Reddedildi')} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 border border-red-200">
                        <XSquare size={13} /> Reddet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Vardiya Analizi */}
      {activeTab === 'analiz' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Personel Bazlı Çalışma Saatleri (Nisan 2026)</h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={hoursData} layout="vertical" margin={{ left: 60, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={60} />
                  <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v: any) => [`${v} saat`, 'Çalışma']} />
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                    {hoursData.map((d, i) => (
                      <Cell key={`hours-cell-${i}`} fill={d.hours > 200 ? '#ef4444' : d.hours > 176 ? '#f59e0b' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[10px] text-slate-400 text-center mt-2">Kırmızı: Fazla mesai (&gt;200s) · Sarı: Yüksek yük (&gt;176s)</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Vardiya Türü Dağılımı (Nisan 2026)</h4>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData.filter(p => p.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${value}`}>
                    {pieData.map((d) => <Cell key={`pie-cell-${d.name}`} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any, n: any) => [v + ' vardiya', n]} />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Staff stats table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm overflow-x-auto">
            <h4 className="text-sm font-bold text-slate-700 mb-4">Personel Nöbet Özeti — Nisan 2026</h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  {['Personel', 'Birim', 'Gündüz', 'Akşam', 'Gece', 'İzin', 'Rapor', 'Off', 'Toplam Saat', 'Durum'].map(h => (
                    <th key={h} className="py-2 px-2 font-semibold text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {shifts.map(s => {
                  const stats = calcStats(s);
                  const hasErr = conflicts.some(c => c.staff === s.staff && c.severity === 'error');
                  return (
                    <tr key={s.id} className={twMerge('hover:bg-slate-50', hasErr ? 'bg-red-50/30' : '')}>
                      <td className="py-2 px-2 font-bold text-slate-800 whitespace-nowrap">{s.staff}</td>
                      <td className="py-2 px-2 text-slate-500">{s.dept}</td>
                      <td className="py-2 px-2 font-bold text-blue-600">{stats.g}</td>
                      <td className="py-2 px-2 font-bold text-amber-600">{stats.a}</td>
                      <td className="py-2 px-2 font-bold text-purple-600">{stats.n}</td>
                      <td className="py-2 px-2 font-bold text-emerald-600">{stats.izin}</td>
                      <td className="py-2 px-2 font-bold text-red-600">{stats.rapor}</td>
                      <td className="py-2 px-2 text-slate-400">{stats.off}</td>
                      <td className="py-2 px-2 font-black text-slate-800">{stats.hours}s</td>
                      <td className="py-2 px-2">{hasErr ? <Badge color="red">İhlal Var</Badge> : stats.hours > 200 ? <Badge color="amber">Fazla Mesai</Badge> : <Badge color="green">Normal</Badge>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Uyarılar & Kurallar */}
      {activeTab === 'uyarilar' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Active conflicts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /> Nöbet Çizelgesi Uyarıları</h4>
            {conflicts.length === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm"><CheckCircle2 size={16} /> Aktif uyarı bulunmuyor. Çizelge kurallara uygun.</div>
            ) : (
              <div className="space-y-2">
                {conflicts.map((c, i) => (
                  <div key={i} className={twMerge('flex items-start gap-3 p-3 rounded-xl border text-xs',
                    c.severity === 'error' ? 'bg-red-50 border-red-200' : c.severity === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200')}>
                    {c.severity === 'error' ? <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" /> : c.severity === 'warning' ? <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" /> : <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />}
                    <div>
                      <p className="font-bold text-slate-800">{c.staff}</p>
                      <p className="text-slate-600 mt-0.5">{c.msg}</p>
                    </div>
                    <Badge color={c.severity === 'error' ? 'red' : c.severity === 'warning' ? 'amber' : 'blue'} >{c.severity === 'error' ? 'KRİTİK' : c.severity === 'warning' ? 'UYARI' : 'BİLGİ'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rules checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Shield size={16} className="text-blue-500" /> Nöbet Kuralları Kontrol Listesi</h4>
            <div className="space-y-2 text-xs">
              {[
                { rule: '4857 İş Kanunu — Günlük max 11 saat çalışma süresi', ref: 'Md.63', ok: true },
                { rule: 'Hemşirelik Yönetmeliği — Gece vardiyası sonrası min 11 saat dinlenme', ref: 'Yönetmelik', ok: conflicts.filter(c => c.msg.includes('Gece→Gündüz')).length === 0 },
                { rule: 'Ardışık gece nöbeti — Max 3 gece (Sağlık Bakanlığı genelgesi)', ref: '2022/12', ok: conflicts.filter(c => c.msg.includes('ardışık gece')).length === 0 },
                { rule: 'Aylık max çalışma süresi — 225 saat (Fazla mesai dahil)', ref: 'İş K.Md.41', ok: shifts.every(s => calcStats(s).hours <= 225) },
                { rule: 'Haftalık dinlenme — 7 günde en az 24 saat kesintisiz', ref: 'İş K.Md.46', ok: true },
                { rule: 'Hamile/emziren personel — Gece vardiyasına alınamaz', ref: 'İş K.Md.72', ok: true },
                { rule: 'Yıllık izin — İzin kütüğüne işlenmesi zorunlu', ref: 'İş K.Md.56', ok: true },
                { rule: 'Rapor günleri — SGK\'ya e-Rapor bildirimi', ref: 'SGK Yön.', ok: true },
                { rule: 'Takas onayları — Birim sorumlusu onayı ile geçerli', ref: 'Kurum Yön.', ok: swaps.every(s => s.status !== 'Beklemede') },
                { rule: 'Nöbet listesi — Aybaşından en az 7 gün önce yayınlanmalı', ref: 'SB Genelge', ok: published },
              ].map((r, i) => (
                <div key={i} className={twMerge('flex items-start gap-3 p-3 rounded-xl border', r.ok ? 'bg-white border-slate-200' : 'bg-amber-50 border-amber-200')}>
                  {r.ok ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />}
                  <span className="flex-1 text-slate-700">{r.rule}</span>
                  <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{r.ref}</span>
                  <Badge color={r.ok ? 'green' : 'amber'}>{r.ok ? 'Uygun' : 'Kontrol Et'}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      <Modal open={!!editCell} onClose={() => setEditCell(null)} title={`Vardiya Düzenle — ${staffForEdit?.staff || ''} — ${editCell?.day}. Gün`} size="sm">
        {editCell && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
              <p><strong>Personel:</strong> {staffForEdit?.staff}</p>
              <p><strong>Birim:</strong> {staffForEdit?.dept}</p>
              <p><strong>Tarih:</strong> {editCell.day} Nisan 2026 ({dayNames[editCell.day - 1]})</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">Yeni Vardiya Seç:</p>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(shiftLegend) as ShiftCode[]).map(k => (
                  <button key={k} onClick={() => setEditShift(k)}
                    className={twMerge('p-3 rounded-xl border text-center transition-all', shiftLegend[k].bg, shiftLegend[k].color,
                      editShift === k ? 'ring-2 ring-offset-1 ring-blue-400 scale-105 shadow-md' : 'hover:scale-105')}>
                    <p className="text-base font-black">{k}</p>
                    <p className="text-[10px] leading-tight mt-0.5">{shiftLegend[k].label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={handleSaveEdit} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
                <Edit3 size={14} /> Kaydet
              </button>
              <button onClick={() => setEditCell(null)} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200">İptal</button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Swap Modal */}
      <Modal open={showNewSwap} onClose={() => setShowNewSwap(false)} title="Yeni Takas Talebi Oluştur" size="sm">
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Talep Eden</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-400">
                {shifts.map(s => <option key={s.id}>{s.staff}</option>)}
              </select></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Takas Yapılacak Personel</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-400">
                {shifts.map(s => <option key={s.id}>{s.staff}</option>)}
              </select></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Talep Günü</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-400">
                {daysInApril.map(d => <option key={d}>{d} Nisan 2026</option>)}
              </select></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Değiştirilecek Gün</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-400">
                {daysInApril.map(d => <option key={d}>{d} Nisan 2026</option>)}
              </select></div>
          </div>
          <div><label className="text-xs font-semibold text-slate-600 block mb-1">Açıklama / Gerekçe</label>
            <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-400 resize-none" placeholder="Takas gerekçesini kısaca belirtin..." /></div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowNewSwap(false)} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">Talebi Gönder</button>
            <button onClick={() => setShowNewSwap(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold">İptal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}