import React, { useState } from 'react';
import {
  Search, MonitorPlay, FileSignature, CheckCircle2, Clock,
  AlertTriangle, X, Send, Printer, Download, Mic, Maximize2,
  ZoomIn, RotateCw, Contrast, Wifi, Activity, Radio,
  Bell, ChevronRight, Plus, Layers
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface RadiologyStudy {
  id: string; accessionNo: string; patient: string; tc: string; age: string; gender: string;
  requestDept: string; requestDoctor: string; requestDate: string; requestTime: string;
  modality: 'CR' | 'CT' | 'MR' | 'US' | 'NM' | 'XA' | 'MG' | 'DX' | 'PET';
  description: string; bodyPart: string;
  status: 'Çekim Bekliyor' | 'Çekim Yapıldı' | 'Rapor Yazılıyor' | 'Rapor Bekliyor' | 'Onaylandı' | 'Teslim Edildi';
  priority: 'Normal' | 'Acil' | 'Cito';
  radiologist: string; technician: string;
  findings: string; impression: string;
  contrast: boolean; contrastAllergy: boolean; gfr: number | null;
  sedation: boolean;
  sliceCount: number; dicomSize: string;
  reportedAt: string;
  dlp: number | null; ctdivol: number | null;
  icd10: string; sutCode: string;
  criticalFinding: boolean; criticalNotified: boolean;
  criticalNotifyTime: string;
}

const mockStudies: RadiologyStudy[] = [
  {
    id: 'R-001', accessionNo: 'ACC-001', patient: 'Mehmet Demir', tc: '234***567', age: '61', gender: 'E',
    requestDept: 'Nöroloji', requestDoctor: 'Uzm. Dr. Zeynep Y.', requestDate: '07.04.2026', requestTime: '10:15',
    modality: 'MR', description: 'MR — Beyin (Kontrastlı + Kontrastsız)', bodyPart: 'Beyin',
    status: 'Rapor Bekliyor', priority: 'Acil', radiologist: '', technician: 'Tek. Ayşe S.',
    findings: '', impression: '', contrast: true, contrastAllergy: false, gfr: 72,
    sedation: false, sliceCount: 320, dicomSize: '245 MB', reportedAt: '',
    dlp: null, ctdivol: null, icd10: 'G40.9', sutCode: 'R505010', criticalFinding: false, criticalNotified: false, criticalNotifyTime: ''
  },
  {
    id: 'R-002', accessionNo: 'ACC-002', patient: 'Ayşe Yılmaz', tc: '123***456', age: '41', gender: 'K',
    requestDept: 'Göğüs Hastalıkları', requestDoctor: 'Uzm. Dr. Ahmet K.', requestDate: '07.04.2026', requestTime: '09:30',
    modality: 'CT', description: 'BT — Toraks (Kontrastlı)', bodyPart: 'Toraks',
    status: 'Rapor Yazılıyor', priority: 'Normal', radiologist: 'Uzm. Dr. Radyol. Kemal T.', technician: 'Tek. Murat B.',
    findings: 'Her iki akciğer parankiminde buzlu cam dansiteleri ve konsolidasyon alanları mevcut. Sol alt lob posterobazal segmentte belirgin. Bilateral minimal plevral efüzyon. Mediastinal lenfadenopati izlenmedi.',
    impression: 'Bilateral pnömoni ile uyumlu bulgular. Sol alt lob konsolidasyonu. Minimal bilateral plevral efüzyon. Klinik korelasyon önerilir.',
    contrast: true, contrastAllergy: false, gfr: 88, sedation: false, sliceCount: 580, dicomSize: '412 MB', reportedAt: '',
    dlp: 485, ctdivol: 8.2, icd10: 'J18.9', sutCode: 'R405020', criticalFinding: false, criticalNotified: false, criticalNotifyTime: ''
  },
  {
    id: 'R-003', accessionNo: 'ACC-003', patient: 'İbrahim Kara', tc: '333***444', age: '68', gender: 'E',
    requestDept: 'Acil Servis', requestDoctor: 'Dr. Hakan Ç.', requestDate: '07.04.2026', requestTime: '09:40',
    modality: 'CT', description: 'BT — Beyin (Kontrastsız, Acil)', bodyPart: 'Beyin',
    status: 'Onaylandı', priority: 'Cito', radiologist: 'Uzm. Dr. Radyol. Kemal T.', technician: 'Tek. Ayşe S.',
    findings: 'Sol MCA sulama alanında hipodansite izlendi. Sulkus silinmesi ve lokal şişlik mevcut. Orta hat yapıları 3mm sağa devie. Kanama bulgusu izlenmedi. Posterior fossa doğal.',
    impression: 'Sol MCA infarktı ile uyumlu erken iskemik değişiklikler. Hemorajik dönüşüm yok. Nöroloji konsültasyonu ve tromboliz değerlendirmesi önerilir.',
    contrast: false, contrastAllergy: false, gfr: null, sedation: false, sliceCount: 64, dicomSize: '85 MB', reportedAt: '07.04.2026 10:15',
    dlp: 892, ctdivol: 52.4, icd10: 'I63.3', sutCode: 'R405010', criticalFinding: true, criticalNotified: true, criticalNotifyTime: '10:17'
  },
  {
    id: 'R-004', accessionNo: 'ACC-004', patient: 'Zeynep Kaya', tc: '345***678', age: '72', gender: 'K',
    requestDept: 'Genel Cerrahi', requestDoctor: 'Op. Dr. Sinan K.', requestDate: '06.04.2026', requestTime: '14:00',
    modality: 'US', description: 'USG — Tüm Batın', bodyPart: 'Abdomen',
    status: 'Onaylandı', priority: 'Normal', radiologist: 'Uzm. Dr. Radyol. Kemal T.', technician: 'Tek. Ayşe S.',
    findings: 'Karaciğer normal boyut ve ekojenite. Safra kesesi lümeni temiz, duvar kalınlığı normal. İntra/ekstrahepatik safra yolları dilate değil. Pankreas normal. Dalak normal. Her iki böbrek normal. Asit yok.',
    impression: 'Batın USG normal sınırlarda. Patolojik bulgu saptanmadı.',
    contrast: false, contrastAllergy: false, gfr: null, sedation: false, sliceCount: 48, dicomSize: '32 MB', reportedAt: '06.04.2026 15:30',
    dlp: null, ctdivol: null, icd10: 'K80.2', sutCode: 'R505030', criticalFinding: false, criticalNotified: false, criticalNotifyTime: ''
  },
  {
    id: 'R-005', accessionNo: 'ACC-005', patient: 'Ali Çelik', tc: '456***789', age: '55', gender: 'E',
    requestDept: 'Dahiliye', requestDoctor: 'Uzm. Dr. Ahmet K.', requestDate: '07.04.2026', requestTime: '10:45',
    modality: 'CR', description: 'Röntgen — PA Akciğer', bodyPart: 'Akciğer',
    status: 'Çekim Bekliyor', priority: 'Normal', radiologist: '', technician: '',
    findings: '', impression: '', contrast: false, contrastAllergy: false, gfr: null,
    sedation: false, sliceCount: 1, dicomSize: '—', reportedAt: '',
    dlp: null, ctdivol: null, icd10: 'J18.9', sutCode: 'R305010', criticalFinding: false, criticalNotified: false, criticalNotifyTime: ''
  },
  {
    id: 'R-006', accessionNo: 'ACC-006', patient: 'Hasan Öztürk', tc: '678***901', age: '38', gender: 'E',
    requestDept: 'Ortopedi', requestDoctor: 'Doç. Dr. Murat A.', requestDate: '07.04.2026', requestTime: '11:00',
    modality: 'MR', description: 'MR — Sol Diz (3 Tesla)', bodyPart: 'Diz',
    status: 'Çekim Yapıldı', priority: 'Normal', radiologist: '', technician: 'Tek. Murat B.',
    findings: '', impression: '', contrast: false, contrastAllergy: false, gfr: null,
    sedation: false, sliceCount: 180, dicomSize: '156 MB', reportedAt: '',
    dlp: null, ctdivol: null, icd10: 'M23.2', sutCode: 'R505050', criticalFinding: false, criticalNotified: false, criticalNotifyTime: ''
  },
  {
    id: 'R-007', accessionNo: 'ACC-007', patient: 'Selin Arslan', tc: '777***888', age: '22', gender: 'K',
    requestDept: 'Genel Cerrahi', requestDoctor: 'Op. Dr. Sinan K.', requestDate: '07.04.2026', requestTime: '08:30',
    modality: 'CT', description: 'BT — Batın & Pelvis (Kontrastlı)', bodyPart: 'Abdomen+Pelvis',
    status: 'Onaylandı', priority: 'Acil', radiologist: 'Uzm. Dr. Radyol. Kemal T.', technician: 'Tek. Ayşe S.',
    findings: 'Apendiks proksimalden perfore görünümde. Perisekal yağ planlarında infiltrasyon ve serbest hava odacıkları mevcut. Pelvis içinde minimal serbest sıvı. Mezenterik lenfadenopati (+).',
    impression: 'Perfore apandisit ile uyumlu bulgular. Acil cerrahi konsültasyon önerilir.',
    contrast: true, contrastAllergy: false, gfr: 95, sedation: false, sliceCount: 620, dicomSize: '520 MB', reportedAt: '07.04.2026 09:00',
    dlp: 612, ctdivol: 9.8, icd10: 'K35.2', sutCode: 'R405020', criticalFinding: true, criticalNotified: true, criticalNotifyTime: '09:02'
  },
];

const doseData = [
  { modality: 'CR', studies: 45, avgDLP: null, avgDose: 0.02 },
  { modality: 'CT Beyin', studies: 28, avgDLP: 892, avgDose: 1.8 },
  { modality: 'CT Toraks', studies: 22, avgDLP: 485, avgDose: 6.5 },
  { modality: 'CT Batın', studies: 18, avgDLP: 612, avgDose: 9.8 },
  { modality: 'MR', studies: 35, avgDLP: null, avgDose: 0 },
  { modality: 'USG', studies: 52, avgDLP: null, avgDose: 0 },
];

const workloadData = [
  { hour: '07', cr: 2, ct: 1, mr: 0, us: 1 },
  { hour: '08', cr: 5, ct: 3, mr: 2, us: 3 },
  { hour: '09', cr: 8, ct: 5, mr: 3, us: 6 },
  { hour: '10', cr: 6, ct: 4, mr: 3, us: 5 },
  { hour: '11', cr: 4, ct: 3, mr: 2, us: 4 },
  { hour: '12', cr: 3, ct: 2, mr: 1, us: 3 },
];

const modalityLabel: Record<string, { label: string; color: string }> = {
  CR: { label: 'X-RAY', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  CT: { label: 'BT', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  MR: { label: 'MR', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  US: { label: 'USG', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  NM: { label: 'NÜK', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  XA: { label: 'ANJ', color: 'bg-red-50 text-red-700 border-red-200' },
  MG: { label: 'MAM', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  DX: { label: 'DX', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  PET: { label: 'PET-CT', color: 'bg-orange-50 text-orange-700 border-orange-200' },
};

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

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

export function RadiologyPACS() {
  const [studies, setStudies] = useState(mockStudies);
  const [selectedStudy, setSelectedStudy] = useState<RadiologyStudy | null>(null);
  const [showPACS, setShowPACS] = useState(false);
  const [showCritical, setShowCritical] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('worklist');
  const [findingsDraft, setFindingsDraft] = useState('');
  const [impressionDraft, setImpressionDraft] = useState('');

  const filtered = studies.filter(s => {
    if (statusFilter === 'Rapor Bekleyen' && !['Rapor Bekliyor', 'Rapor Yazılıyor'].includes(s.status)) return false;
    if (statusFilter === 'Çekim Bekleyen' && s.status !== 'Çekim Bekliyor') return false;
    if (statusFilter === 'Onaylanan' && !['Onaylandı', 'Teslim Edildi'].includes(s.status)) return false;
    if (statusFilter === 'Kritik' && !s.criticalFinding) return false;
    if (searchText && !s.patient.toLowerCase().includes(searchText.toLowerCase()) && !s.accessionNo.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const reportPending = studies.filter(s => ['Rapor Bekliyor', 'Rapor Yazılıyor'].includes(s.status)).length;
  const shootPending = studies.filter(s => s.status === 'Çekim Bekliyor').length;
  const urgentCount = studies.filter(s => s.priority !== 'Normal' && !['Onaylandı', 'Teslim Edildi'].includes(s.status)).length;
  const criticalCount = studies.filter(s => s.criticalFinding && !s.criticalNotified).length;
  const completedToday = studies.filter(s => ['Onaylandı', 'Teslim Edildi'].includes(s.status)).length;

  const statusColor = (s: string) => s === 'Çekim Bekliyor' ? 'slate' : s === 'Çekim Yapıldı' ? 'amber' : s === 'Rapor Yazılıyor' ? 'cyan' : s === 'Rapor Bekliyor' ? 'amber' : 'green';

  const handleApproveReport = (id: string) => {
    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setStudies(prev => prev.map(s => s.id === id ? {
      ...s, status: 'Onaylandı' as const, reportedAt: now,
      findings: findingsDraft || s.findings,
      impression: impressionDraft || s.impression,
    } : s));
    setSelectedStudy(null);
    setFindingsDraft('');
    setImpressionDraft('');
  };

  const handleNotifyCritical = (id: string) => {
    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setStudies(prev => prev.map(s => s.id === id ? { ...s, criticalNotified: true, criticalNotifyTime: now } : s));
  };

  const tabs = [
    { id: 'worklist', label: 'Radyoloji Worklist' },
    { id: 'pacs', label: 'PACS / DICOM Viewer' },
    { id: 'dose', label: 'Radyasyon Dozu' },
    { id: 'workload', label: 'İş Yükü Analizi' },
    { id: 'critical', label: `Kritik Bulgular${criticalCount > 0 ? ` (${criticalCount})` : ''}` },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Radyoloji Bilgi Sistemi (RIS) & PACS</h2>
          <p className="text-sm text-slate-500">DICOM 3.0 / HL7 entegrasyonu • Sesli dikte & yapılandırılmış rapor • Radyasyon dozu takibi • Kritik bulgu bildirimi</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
            <Wifi size={12} /> PACS Bağlı
          </div>
          {criticalCount > 0 && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-300 rounded-lg text-xs font-bold text-red-700 animate-pulse" onClick={() => setActiveTab('critical')}>
              <AlertTriangle size={12} /> {criticalCount} Kritik Bildirim
            </button>
          )}
          <button onClick={() => setShowPACS(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 shadow-sm">
            <MonitorPlay size={16} /> PACS Viewer
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-[10px] font-bold text-amber-700 uppercase flex items-center gap-1"><FileSignature size={12} /> Rapor Bekliyor</p>
          <p className="text-2xl font-black text-amber-600">{reportPending}</p>
        </div>
        <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1"><Clock size={12} /> Çekim Bekliyor</p>
          <p className="text-2xl font-black text-slate-700">{shootPending}</p>
        </div>
        <div className={twMerge("p-3 rounded-xl border shadow-sm", urgentCount > 0 ? "bg-red-50 border-red-200" : "bg-white border-slate-200")}>
          <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1"><AlertTriangle size={12} /> Acil İnceleme</p>
          <p className="text-2xl font-black text-red-600">{urgentCount}</p>
        </div>
        <div className={twMerge("p-3 rounded-xl border shadow-sm", criticalCount > 0 ? "bg-red-50 border-red-300 animate-pulse" : "bg-white border-slate-200")}>
          <p className="text-[10px] font-bold text-red-800 uppercase flex items-center gap-1"><Bell size={12} /> Kritik Bulgu</p>
          <p className="text-2xl font-black text-red-700">{criticalCount}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-700 uppercase">Tamamlanan</p>
          <p className="text-2xl font-black text-emerald-600">{completedToday}</p>
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

      {activeTab === 'worklist' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50/50 flex-none">
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-2 text-slate-400" size={14} />
                <input type="text" placeholder="Hasta, Acc.No..." value={searchText} onChange={e => setSearchText(e.target.value)}
                  className="pl-8 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500 w-48 shadow-sm" />
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {['Tümü', 'Rapor Bekleyen', 'Çekim Bekleyen', 'Onaylanan', 'Kritik'].map(f => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  className={twMerge('px-3 py-1.5 rounded-lg text-[10px] font-semibold border',
                    statusFilter === f ? (f === 'Kritik' ? 'bg-red-500 text-white border-red-500' : 'bg-purple-50 text-purple-700 border-purple-200') : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  )}>{f}</button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase w-24">Acc. No</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Tarih / Saat</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Hasta & İstek</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">İnceleme</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Mod.</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Doz</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase">Durum</th>
                  <th className="py-2.5 px-4 font-bold text-slate-500 text-[10px] uppercase text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(s => (
                  <tr key={s.id} onClick={() => setSelectedStudy(s)}
                    className={twMerge("transition-colors hover:bg-slate-50 cursor-pointer",
                      s.criticalFinding && !s.criticalNotified ? "bg-red-50/50" :
                        s.priority !== 'Normal' && !['Onaylandı', 'Teslim Edildi'].includes(s.status) ? "bg-amber-50/30" : "")}>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 text-xs">{s.accessionNo}</td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-bold text-slate-700">{s.requestDate}</div>
                      <div className="text-[10px] text-slate-400">{s.requestTime}</div>
                      {s.priority !== 'Normal' && <Badge color="red">{s.priority}</Badge>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        {s.patient}
                        {s.criticalFinding && <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-black animate-pulse">KRİTİK</span>}
                      </div>
                      <div className="text-[10px] text-slate-500">{s.requestDept} • {s.requestDoctor}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-700 text-xs">{s.description}</div>
                      <div className="text-[10px] text-slate-400">{s.bodyPart} {s.contrast ? '(Kontrastlı)' : ''}</div>
                      {s.icd10 && <span className="text-[9px] font-mono text-blue-600">ICD: {s.icd10}</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-[10px] font-black rounded border ${modalityLabel[s.modality]?.color || ''}`}>
                        {modalityLabel[s.modality]?.label || s.modality}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[10px] text-slate-500">
                      {s.dlp ? <><span className="font-mono">{s.dlp}</span> mGy·cm</> : s.modality === 'MR' || s.modality === 'US' ? 'Yok' : '—'}
                    </td>
                    <td className="py-3 px-4"><Badge color={statusColor(s.status)}>{s.status}</Badge></td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {['Rapor Bekliyor', 'Rapor Yazılıyor'].includes(s.status) && (
                          <button onClick={e => { e.stopPropagation(); setFindingsDraft(s.findings); setImpressionDraft(s.impression); setSelectedStudy(s); }}
                            className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 shadow-sm flex items-center gap-1">
                            <FileSignature size={11} /> Rapor Yaz
                          </button>
                        )}
                        {s.criticalFinding && !s.criticalNotified && (
                          <button onClick={e => { e.stopPropagation(); handleNotifyCritical(s.id); }}
                            className="px-2.5 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700 flex items-center gap-1">
                            <Bell size={11} /> Bildir
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pacs' && (
        <div className="flex-1 overflow-y-auto">
          <div className="bg-slate-950 rounded-2xl p-6 h-full min-h-96 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MonitorPlay size={24} className="text-blue-400" />
                <div>
                  <h3 className="font-bold text-white">OHIF / Cornerstone DICOM Viewer (Simülasyon)</h3>
                  <p className="text-xs text-slate-400">DICOM 3.0 • WADO-RS • DICOMweb protokolü</p>
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { icon: ZoomIn, label: 'Yakınlaştır' },
                  { icon: Contrast, label: 'W/L Pencere' },
                  { icon: RotateCw, label: 'Döndür' },
                  { icon: Maximize2, label: 'MPR' },
                  { icon: Layers, label: '3D MIP' },
                ].map((tool, i) => (
                  <button key={i} className="flex flex-col items-center p-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-slate-700" title={tool.label}>
                    <tool.icon size={16} className="mb-0.5" />
                    <span className="text-[9px]">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 flex-1">
              <div className="w-32 bg-slate-900 rounded-xl p-3 space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Seri Listesi</p>
                {['Seri 1 (Ax T2)', 'Seri 2 (Ax FLAIR)', 'Seri 3 (Cor T1)', 'Seri 4 (Sag DWI)', 'Seri 5 (+Kontrast)'].map((s, i) => (
                  <button key={i} className={`w-full text-left px-2 py-1.5 rounded text-[10px] ${i === 0 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>{s}</button>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-2">
                {['Aksiyel', 'Koronal', 'Sagital', 'MPR 3D'].map((view, i) => (
                  <div key={i} className="bg-slate-900 rounded-xl flex items-center justify-center relative group cursor-pointer hover:bg-slate-800 transition-colors">
                    <div className="text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-slate-700 flex items-center justify-center">
                        <Radio size={24} className="text-slate-500" />
                      </div>
                      <p className="text-slate-500 text-[10px]">{view} Plan</p>
                      <p className="text-slate-600 text-[9px] mt-1">Gerçek DICOM görüntü</p>
                    </div>
                    <div className="absolute top-2 left-2 text-[9px] text-slate-500 font-mono">{view.slice(0, 3).toUpperCase()}</div>
                  </div>
                ))}
              </div>
              <div className="w-40 bg-slate-900 rounded-xl p-3 space-y-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Ölçüm Araçları</p>
                {['📏 Uzunluk', '⭕ ROI Alan', '📐 Açı', '🔲 Annotasyon', '🌡️ HU Ölçümü', '📊 Histogram'].map((tool, i) => (
                  <button key={i} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-slate-400 hover:bg-slate-800">{tool}</button>
                ))}
                <div className="border-t border-slate-700 pt-2">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Sunum</p>
                  <button className="w-full text-left px-2 py-1.5 rounded text-[10px] text-slate-400 hover:bg-slate-800">📤 Teleradyoloji</button>
                  <button className="w-full text-left px-2 py-1.5 rounded text-[10px] text-slate-400 hover:bg-slate-800">💾 CD/DVD Export</button>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-slate-600">
              <span>DICOM 3.0 • Gantry: —° • kVp: — • mAs: —</span>
              <span>Kesit: 1/320 • Kalınlık: 3mm • FOV: 230mm</span>
              <span>WW: 80 WL: 40 (Beyin Penceresi)</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dose' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h4 className="font-bold text-slate-800 mb-4">Modalite Bazında Ortalama Radyasyon Dozu (DLP mGy·cm)</h4>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doseData.filter(d => d.avgDLP)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="modality" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="avgDLP" fill="#8b5cf6" name="Ort. DLP (mGy·cm)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h4 className="font-bold text-slate-800 mb-3">Radyasyon Dozu Referans Seviyeleri (DRL)</h4>
              <table className="w-full text-xs">
                <thead><tr className="bg-slate-50"><th className="text-left py-2 px-3 font-semibold">İnceleme</th><th className="text-center py-2 px-3 font-semibold">Ort. DLP</th><th className="text-center py-2 px-3 font-semibold">DRL</th><th className="text-center py-2 px-3 font-semibold">Durum</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { name: 'BT Beyin', dlp: 892, drl: 950, unit: 'mGy·cm' },
                    { name: 'BT Toraks', dlp: 485, drl: 650, unit: 'mGy·cm' },
                    { name: 'BT Batın', dlp: 612, drl: 780, unit: 'mGy·cm' },
                    { name: 'PA Akciğer', dlp: null, drl: 0.2, unit: 'mGy' },
                  ].map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium">{r.name}</td>
                      <td className="py-2 px-3 text-center font-mono">{r.dlp || '—'}</td>
                      <td className="py-2 px-3 text-center font-mono">{r.drl}</td>
                      <td className="py-2 px-3 text-center">
                        {r.dlp ? (
                          r.dlp <= r.drl ?
                            <span className="text-emerald-600 font-bold text-[10px]">✓ DRL Altında</span> :
                            <span className="text-red-600 font-bold text-[10px]">⚠ DRL Üstünde</span>
                        ) : <span className="text-slate-400 text-[10px]">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 bg-blue-50 p-3 rounded-xl border border-blue-200">
                <p className="text-xs text-blue-700"><strong>Kontrast Madde Protokolü:</strong> GFR &lt; 30 ise kontrastlı BT kontrendike. 30–60 arası nefroloji konsültasyonu gerekli. Metformin en az 48 saat önceden kesilmeli.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'workload' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-4">Saatlik İş Yükü Dağılımı (07:00–12:00)</h4>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickFormatter={h => `${h}:00`} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="cr" fill="#3b82f6" name="X-Ray" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="ct" fill="#8b5cf6" name="BT" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="mr" fill="#06b6d4" name="MR" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="us" fill="#10b981" name="USG" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Bugün Toplam', value: '54', sub: 'Tetkik', color: 'blue' },
              { label: 'Raporlama TAT', value: '47dk', sub: 'Ort. Rapor Süresi', color: 'purple' },
              { label: 'Acil TAT', value: '22dk', sub: 'Cito / Acil', color: 'red' },
              { label: 'Teleradyoloji', value: '3', sub: 'Dışarıya Gönderilen', color: 'amber' },
            ].map((k, i) => (
              <div key={i} className={`bg-${k.color}-50 p-4 rounded-xl border border-${k.color}-200`}>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{k.label}</p>
                <p className={`text-2xl font-black text-${k.color}-600 mt-1`}>{k.value}</p>
                <p className="text-[10px] text-slate-500">{k.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'critical' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">Kritik Bulgu Bildirimi Kuralı</p>
              <p className="text-xs text-red-600 mt-1">ACR (Amerikan Radyoloji Koleji) kılavuzuna göre kritik bulgular onaydan itibaren <strong>1 saat</strong> içinde ilgili klinisyene bildirilmeli ve kayıt altına alınmalıdır.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Kritik Bulgular Listesi</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {studies.filter(s => s.criticalFinding).map(s => (
                <div key={s.id} className={`p-4 ${!s.criticalNotified ? 'bg-red-50/30' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-slate-500">{s.accessionNo}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-black rounded border ${modalityLabel[s.modality]?.color || ''}`}>{modalityLabel[s.modality]?.label}</span>
                        {!s.criticalNotified ? (
                          <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded animate-pulse font-black">BİLDİRİM BEKLİYOR</span>
                        ) : (
                          <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded font-black">✓ Bildirildi ({s.criticalNotifyTime})</span>
                        )}
                      </div>
                      <p className="font-bold text-slate-800">{s.patient} ({s.age} {s.gender}) — {s.requestDept}</p>
                      <p className="text-xs text-slate-600 mt-0.5">{s.description}</p>
                      <p className="text-xs text-red-700 font-semibold mt-1 bg-red-50 p-2 rounded-lg border border-red-100">{s.impression}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Radyolog: {s.radiologist} • {s.reportedAt}</p>
                    </div>
                    {!s.criticalNotified && (
                      <button onClick={() => handleNotifyCritical(s.id)}
                        className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 flex items-center gap-1.5">
                        <Bell size={14} /> Klinisyeni Bildir
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Study Detail Modal */}
      <Modal open={!!selectedStudy} onClose={() => setSelectedStudy(null)} title={`Radyoloji İnceleme — ${selectedStudy?.accessionNo || ''}`} size="2xl">
        {selectedStudy && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px] uppercase">Hasta</span><span className="font-bold">{selectedStudy.patient} ({selectedStudy.age} {selectedStudy.gender})</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">İnceleme</span><span className="font-bold">{selectedStudy.description}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Modalite / Kesit</span><span className="font-bold">{modalityLabel[selectedStudy.modality]?.label} • {selectedStudy.sliceCount} kesit ({selectedStudy.dicomSize})</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">ICD-10 / SUT</span><span className="font-mono font-bold">{selectedStudy.icd10} / {selectedStudy.sutCode}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">GFR</span><span className={`font-bold ${selectedStudy.gfr && selectedStudy.gfr < 30 ? 'text-red-600' : 'text-slate-800'}`}>{selectedStudy.gfr ? `${selectedStudy.gfr} mL/dk` : '—'}</span></div>
            </div>

            {selectedStudy.contrast && selectedStudy.gfr && selectedStudy.gfr < 60 && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center gap-3">
                <AlertTriangle size={16} className="text-amber-600" />
                <p className="text-sm text-amber-700"><strong>Kontrast Uyarısı:</strong> GFR {selectedStudy.gfr} mL/dk — Nefroloji konsültasyonu gerekebilir. Hidrasyon protokolü uygulandı mı?</p>
              </div>
            )}

            {/* PACS Viewer Sim */}
            <div className="bg-slate-950 rounded-xl p-2 relative h-56 flex items-center justify-center group cursor-pointer" onClick={() => setShowPACS(true)}>
              <div className="text-center">
                <MonitorPlay size={40} className="text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">DICOM Görüntü — PACS Viewer'da Aç</p>
                <p className="text-slate-500 text-xs mt-1">{selectedStudy.description} • {selectedStudy.sliceCount} kesit • {selectedStudy.dicomSize}</p>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {[{ icon: ZoomIn, label: 'Zoom' }, { icon: Contrast, label: 'W/L' }, { icon: RotateCw, label: 'Döndür' }, { icon: Maximize2, label: 'MPR' }].map((tool, i) => (
                  <button key={i} className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-slate-700" title={tool.label}>
                    <tool.icon size={14} />
                  </button>
                ))}
              </div>
              {selectedStudy.dlp && (
                <div className="absolute top-2 right-2 text-[9px] text-slate-500 font-mono">DLP: {selectedStudy.dlp} mGy·cm | CTDIvol: {selectedStudy.ctdivol} mGy</div>
              )}
            </div>

            {/* Report */}
            {['Rapor Bekliyor', 'Rapor Yazılıyor'].includes(selectedStudy.status) ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-700">Radyoloji Raporu</h4>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold border border-purple-200 flex items-center gap-1.5 hover:bg-purple-100">
                      <Mic size={13} /> Sesli Dikte
                    </button>
                    <select className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-600">
                      <option>Rapor Şablonu Seç...</option>
                      <option>BT Toraks Standart</option>
                      <option>MR Beyin Standart</option>
                      <option>USG Batın Standart</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Bulgular (Findings)</label>
                  <textarea rows={4} value={findingsDraft || selectedStudy.findings} onChange={e => setFindingsDraft(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-purple-500" placeholder="Görüntüleme bulgularını detaylı olarak yazınız..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">İzlenim / Sonuç (Impression)</label>
                  <textarea rows={2} value={impressionDraft || selectedStudy.impression} onChange={e => setImpressionDraft(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-purple-500" placeholder="Radyolojik izlenim ve tanısal sonucu yazınız..." />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="critical" className="w-4 h-4 accent-red-500 rounded" />
                  <label htmlFor="critical" className="text-sm font-semibold text-red-600">Kritik Bulgu — Klinisyen derhal bilgilendirilmeli</label>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleApproveReport(selectedStudy.id)}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Raporu Onayla (Dijital İmza)
                  </button>
                  <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
                    <Printer size={15} /> Yazdır
                  </button>
                </div>
              </div>
            ) : selectedStudy.findings && (
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1.5">Bulgular</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{selectedStudy.findings}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-1.5">İzlenim / Sonuç</h4>
                  <p className="text-sm text-slate-700 bg-blue-50 p-4 rounded-xl border border-blue-100 leading-relaxed font-medium">{selectedStudy.impression}</p>
                </div>
                {selectedStudy.criticalFinding && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
                    <p className="text-sm font-bold text-red-700">⚠ Kritik Bulgu</p>
                    {selectedStudy.criticalNotified ? <span className="text-emerald-600 text-xs font-bold">✓ Bildirildi ({selectedStudy.criticalNotifyTime})</span> : (
                      <button onClick={() => handleNotifyCritical(selectedStudy.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold">Bildir</button>
                    )}
                  </div>
                )}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>Radyolog: <strong>{selectedStudy.radiologist}</strong></span>
                  <span>Tarih: <strong>{selectedStudy.reportedAt}</strong></span>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} /> Yazdır</button>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Download size={14} /> PDF / e-Nabız</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* PACS Viewer Full Modal */}
      <Modal open={showPACS} onClose={() => setShowPACS(false)} title="PACS DICOM Viewer — Tam Ekran" size="2xl">
        <div className="bg-slate-950 rounded-xl p-4 h-96 flex items-center justify-center">
          <div className="text-center">
            <MonitorPlay size={64} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">DICOM Viewer Simülasyonu</p>
            <p className="text-slate-500 text-xs mt-1">Gerçek ortamda OHIF Viewer / Cornerstone.js entegrasyonu aktif olur</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
