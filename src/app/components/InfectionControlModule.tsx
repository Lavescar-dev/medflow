import React, { useState } from 'react';
import {
  Activity, CheckCircle2, AlertTriangle, X, Plus, ChevronRight, Shield,
  Send, Printer, ShieldAlert, Clock,
  AlertCircle, Bell, Beaker
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, ReferenceLine
} from 'recharts';

interface InfectionCase {
  id: string; patient: string; age: string; gender: string;
  room: string; dept: string; doctor: string;
  organism: string; type: string; site: string;
  isolationType: 'Temas' | 'Damlacık' | 'Hava Yolu' | 'Yok';
  status: 'Aktif' | 'Tedavide' | 'İyileşti' | 'Takipte';
  detectionDate: string; source: string;
  isHAI: boolean; haiType: string;
  antibiotic: string; susceptibility: string;
  notes: string; riskScore: number;
  bundleCompliance: boolean;
}

interface HandHygieneAudit {
  id: string; dept: string; date: string; observer: string;
  totalObs: number; compliant: number; rate: number;
  moment1: number; moment2: number; moment3: number; moment4: number; moment5: number;
}

interface BundleAssessment {
  patientId: string; patient: string; room: string; dept: string;
  bundleType: 'VAP' | 'CAUTI' | 'CLABSI';
  items: { criterion: string; compliant: boolean; lastChecked: string }[];
  lastAssessment: string; compliance: number;
}

const mockCases: InfectionCase[] = [
  {
    id: 'ENF-001', patient: 'Hatice Arslan', age: '65', gender: 'K', room: '304-A', dept: 'Dahiliye', doctor: 'Uzm. Dr. Ahmet K.',
    organism: 'MRSA', type: 'Çoklu Dirençli Organizma (ÇDO)', site: 'Solunum Yolu (Ventilatör İlişkili Pnömoni)',
    isolationType: 'Temas', status: 'Tedavide', detectionDate: '03.04.2026', source: 'Balgam kültürü',
    isHAI: true, haiType: 'VİP (Ventilatör İlişkili Pnömoni)',
    antibiotic: 'Vankomisin 1g 2x1 IV (hedef AUC/MIC ≥400)', susceptibility: 'Vankomisin: S (MIC 0.5), Linezolid: S',
    notes: 'Temas izolasyonu aktif. Tek kişilik oda. El hijyeni uyumu takip ediliyor. Enfeksiyon kontrol hemşiresi günlük ziyaret yapıyor.',
    riskScore: 8, bundleCompliance: true
  },
  {
    id: 'ENF-002', patient: 'Ayşe Koç', age: '78', gender: 'K', room: 'YBÜ-03', dept: 'Yoğun Bakım', doctor: 'Uzm. Dr. Can Y.',
    organism: 'E. coli (GSBL+)', type: 'GSBL Üretici Gram Negatif', site: 'İdrar Yolu (Kateter İlişkili ÜSE)',
    isolationType: 'Temas', status: 'Tedavide', detectionDate: '05.04.2026', source: 'İdrar kültürü',
    isHAI: true, haiType: 'KAÜSİ (Kateter İlişkili Üriner Sistem Enfeksiyonu)',
    antibiotic: 'Meropenem 1g 3x1 IV', susceptibility: 'Meropenem: S, Amikasin: S, Seftriakson: R, Siprofloksasin: R',
    notes: 'Foley sonda çıkarılması değerlendirilecek. 48 saatte kontrol kültür alındı.',
    riskScore: 9, bundleCompliance: false
  },
  {
    id: 'ENF-003', patient: 'Selin Arslan', age: '22', gender: 'K', room: 'Acil-Travma', dept: 'Acil Servis', doctor: 'Dr. Hakan Ç.',
    organism: 'Bilinmiyor (Kültür Bekliyor)', type: 'Sepsis Şüphesi', site: 'Kan',
    isolationType: 'Yok', status: 'Takipte', detectionDate: '07.04.2026', source: '2 set kan kültürü (bekliyor)',
    isHAI: false, haiType: '',
    antibiotic: 'Piperasilin-Tazobaktam 4.5g 3x1 IV (ampirik)', susceptibility: 'Bekliyor',
    notes: 'Travma sonrası sepsis. 2×2 set kan kültürü alındı. Kültür sonuçları bekleniyor.',
    riskScore: 7, bundleCompliance: false
  },
  {
    id: 'ENF-004', patient: 'Mehmet Demir', age: '61', gender: 'E', room: '303-B', dept: 'Dahiliye', doctor: 'Uzm. Dr. Ayşe D.',
    organism: 'Yok (PCR Bekliyor)', type: 'COVID-19 Şüphesi', site: 'Solunum',
    isolationType: 'Damlacık', status: 'Takipte', detectionDate: '07.04.2026', source: 'Nazofaringeal sürüntü — PCR bekliyor',
    isHAI: false, haiType: '',
    antibiotic: 'Destekleyici tedavi (oksijen + antipiretik)', susceptibility: '',
    notes: 'Ateş + öksürük. PCR alındı. Damlacık izolasyonu başlatıldı. Ziyaretçi kısıtlaması.',
    riskScore: 5, bundleCompliance: false
  },
  {
    id: 'ENF-005', patient: 'Mustafa Yılmaz', age: '58', gender: 'E', room: '301-A', dept: 'Dahiliye', doctor: 'Uzm. Dr. Ahmet K.',
    organism: 'S. pneumoniae', type: 'Toplum Kökenli Pnömoni', site: 'Alt Solunum Yolu',
    isolationType: 'Yok', status: 'İyileşti', detectionDate: '04.04.2026', source: 'Gram boyama + Kültür',
    isHAI: false, haiType: '',
    antibiotic: 'Seftriakson 1g 2x1 IV (6. gün)', susceptibility: 'Penisilin: S, Seftriakson: S',
    notes: 'CRP geriledi (250→45). Oral geçiş planlanıyor. Taburculuk yakın.',
    riskScore: 3, bundleCompliance: true
  },
];

const mockAudits: HandHygieneAudit[] = [
  { id: 'HH-001', dept: 'Yoğun Bakım', date: '07.04.2026', observer: 'Enf. Hmş. Seda T.', totalObs: 25, compliant: 22, rate: 88, moment1: 92, moment2: 85, moment3: 88, moment4: 90, moment5: 86 },
  { id: 'HH-002', dept: 'Dahiliye Servisi', date: '07.04.2026', observer: 'Enf. Hmş. Seda T.', totalObs: 30, compliant: 21, rate: 70, moment1: 75, moment2: 68, moment3: 72, moment4: 68, moment5: 67 },
  { id: 'HH-003', dept: 'Ameliyathane', date: '06.04.2026', observer: 'Enf. Hmş. Seda T.', totalObs: 20, compliant: 19, rate: 95, moment1: 95, moment2: 95, moment3: 95, moment4: 96, moment5: 94 },
  { id: 'HH-004', dept: 'Acil Servis', date: '06.04.2026', observer: 'Enf. Hmş. Seda T.', totalObs: 35, compliant: 22, rate: 63, moment1: 70, moment2: 58, moment3: 65, moment4: 60, moment5: 62 },
  { id: 'HH-005', dept: 'Genel Cerrahi', date: '05.04.2026', observer: 'Enf. Hmş. Seda T.', totalObs: 22, compliant: 18, rate: 82, moment1: 85, moment2: 78, moment3: 84, moment4: 82, moment5: 80 },
];

const bundles: BundleAssessment[] = [
  {
    patientId: 'ENF-001', patient: 'Hatice Arslan', room: '304-A', dept: 'Dahiliye',
    bundleType: 'VAP',
    items: [
      { criterion: '30-45° yatak başı yükseltme', compliant: true, lastChecked: '07.04.2026 08:00' },
      { criterion: 'Günlük ağız bakımı (klorheksidin)', compliant: true, lastChecked: '07.04.2026 06:00' },
      { criterion: 'Subglottik sekresyon aspirasyonu', compliant: true, lastChecked: '07.04.2026 07:00' },
      { criterion: 'Günlük sedasyon tatili değerlendirmesi', compliant: false, lastChecked: '07.04.2026 09:00' },
      { criterion: 'Ekstübasyon hazırlığı değerlendirmesi', compliant: false, lastChecked: '07.04.2026 09:00' },
    ],
    lastAssessment: '07.04.2026 09:00', compliance: 60
  },
  {
    patientId: 'ENF-002', patient: 'Ayşe Koç', room: 'YBÜ-03', dept: 'Yoğun Bakım',
    bundleType: 'CAUTI',
    items: [
      { criterion: 'Kateter endikasyonunun günlük gözden geçirilmesi', compliant: false, lastChecked: '07.04.2026 08:00' },
      { criterion: 'Kapalı drenaj sistemi bütünlüğü', compliant: true, lastChecked: '07.04.2026 06:00' },
      { criterion: 'Kateter idrar torbasının mesane altında tutulması', compliant: true, lastChecked: '07.04.2026 06:00' },
      { criterion: 'Periüretal bakım (günlük)', compliant: true, lastChecked: '07.04.2026 07:00' },
      { criterion: 'El hijyeni kateter bakımı sırasında', compliant: false, lastChecked: '07.04.2026 08:00' },
    ],
    lastAssessment: '07.04.2026 08:00', compliance: 60
  },
];

const haiChartData = [
  { name: 'Ocak', VIP: 2, KAUSI: 3, KDE: 1, CAE: 1 },
  { name: 'Şubat', VIP: 1, KAUSI: 2, KDE: 2, CAE: 0 },
  { name: 'Mart', VIP: 3, KAUSI: 2, KDE: 1, CAE: 2 },
  { name: 'Nisan', VIP: 1, KAUSI: 1, KDE: 0, CAE: 0 },
];

const haiRateData = [
  { month: 'Oca', rate: 3.5, target: 5.0 },
  { month: 'Şub', rate: 2.8, target: 5.0 },
  { month: 'Mar', rate: 4.2, target: 5.0 },
  { month: 'Nis', rate: 3.2, target: 5.0 },
];

const organismPie = [
  { name: 'MRSA', value: 4 },
  { name: 'GSBL E.coli', value: 6 },
  { name: 'Acinetobacter', value: 3 },
  { name: 'Klebsiella (KPC)', value: 2 },
  { name: 'Diğer', value: 5 },
];
const COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#94a3b8'];

const environmentalSurveillance = [
  { location: 'YBÜ Hasta Yatağı (YBÜ-01)', surface: 'Yatak Koruyucu', organism: 'Yok üreme', date: '06.04.2026', ok: true },
  { location: 'YBÜ Ventilatör Yüzeyi', surface: 'Temas yüzeyi', organism: 'Acinetobacter spp.', date: '06.04.2026', ok: false },
  { location: 'Ameliyathane Zemin', surface: 'Zemin kültürü', organism: 'Yok üreme', date: '05.04.2026', ok: true },
  { location: 'Dahiliye Hemşire İstasyonu', surface: 'Klavye/Mouse', organism: 'MRSA (+)', date: '07.04.2026', ok: false },
  { location: 'Ameliyathane Hava Örneği', surface: 'Settle plate', organism: 'Yok üreme (< 35 CFU/m³)', date: '05.04.2026', ok: true },
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
  const maxW = size === '2xl' ? 'max-w-6xl' : 'max-w-4xl';
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

export function InfectionControlModule() {
  const [tab, setTab] = useState<'vakalar' | 'surveyans' | 'hijyen' | 'bundle' | 'antibiyotik' | 'cevre'>('vakalar');
  const [selectedCase, setSelectedCase] = useState<InfectionCase | null>(null);
  const [bundles_, setBundles] = useState(bundles);

  const activeCases = mockCases.filter(c => c.status !== 'İyileşti');
  const haiCases = mockCases.filter(c => c.isHAI);
  const isolatedCount = mockCases.filter(c => c.isolationType !== 'Yok' && c.status !== 'İyileşti').length;
  const avgHH = Math.round(mockAudits.reduce((s, a) => s + a.rate, 0) / mockAudits.length);
  const lowCompliance = mockAudits.filter(a => a.rate < 75).length;
  const nonCompliantBundles = bundles_.filter(b => b.compliance < 100).length;

  const statusColor = (s: string) => s === 'Aktif' || s === 'Tedavide' ? 'red' : s === 'Takipte' ? 'amber' : 'green';
  const isoColor = (i: string) => i === 'Temas' ? 'amber' : i === 'Damlacık' ? 'blue' : i === 'Hava Yolu' ? 'red' : 'slate';

  const toggleBundle = (bIdx: number, itemIdx: number) => {
    setBundles(prev => prev.map((b, bi) => {
      if (bi !== bIdx) return b;
      const newItems = b.items.map((item, ii) => ii === itemIdx ? { ...item, compliant: !item.compliant } : item);
      const compliance = Math.round((newItems.filter(i => i.compliant).length / newItems.length) * 100);
      return { ...b, items: newItems, compliance };
    }));
  };

  const tabs = [
    { id: 'vakalar' as const, label: 'Enfeksiyon Vakaları' },
    { id: 'surveyans' as const, label: 'HAİ Sürveyans' },
    { id: 'hijyen' as const, label: `El Hijyeni${lowCompliance > 0 ? ` (${lowCompliance} Düşük)` : ''}` },
    { id: 'bundle' as const, label: `Bundle Uyumu${nonCompliantBundles > 0 ? ` (${nonCompliantBundles})` : ''}` },
    { id: 'antibiyotik' as const, label: 'Antibiyotik Yönetimi' },
    { id: 'cevre' as const, label: 'Çevre Sürveyansı' },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Enfeksiyon Kontrol Komitesi (EKK)</h2>
          <p className="text-sm text-slate-500">HAİ sürveyans, bundle uyumu, el hijyeni denetimi, çevre sürveyansı, antibiyotik yönetimi</p>
        </div>
        <div className="flex items-center gap-2">
          {isolatedCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-xs font-bold text-amber-700">
              <Shield size={12} /> {isolatedCount} İzolasyon Aktif
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
        <div className="bg-red-50 p-3 rounded-xl border border-red-200 shadow-sm">
          <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1"><ShieldAlert size={12} />Aktif Enfeksiyon</p>
          <p className="text-2xl font-black text-red-600">{activeCases.length}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-[10px] font-bold text-amber-700 uppercase">İzolasyon</p>
          <p className="text-2xl font-black text-amber-600">{isolatedCount}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-[10px] font-bold text-purple-700 uppercase">HAİ (Bu Ay)</p>
          <p className="text-2xl font-black text-purple-600">{haiCases.length}</p>
        </div>
        <div className={twMerge("p-3 rounded-xl border shadow-sm", avgHH < 80 ? "bg-red-50 border-red-200" : avgHH < 90 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200")}>
          <p className="text-[10px] font-bold text-slate-600 uppercase">El Hijyeni Uyumu</p>
          <p className={`text-2xl font-black ${avgHH < 80 ? 'text-red-600' : avgHH < 90 ? 'text-amber-600' : 'text-emerald-600'}`}>%{avgHH}</p>
        </div>
        <div className={twMerge("p-3 rounded-xl border shadow-sm", nonCompliantBundles > 0 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200")}>
          <p className="text-[10px] font-bold text-slate-600 uppercase">Bundle Uyumsuz</p>
          <p className={`text-2xl font-black ${nonCompliantBundles > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{nonCompliantBundles}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl flex-none overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={twMerge("px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors",
              tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Vakalar */}
      {tab === 'vakalar' && (
        <div className="flex-1 overflow-y-auto space-y-3">
          {mockCases.map(c => (
            <div key={c.id} onClick={() => setSelectedCase(c)}
              className={twMerge("bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all",
                c.status !== 'İyileşti' && c.isolationType !== 'Yok' ? 'border-amber-300' : 'border-slate-200')}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-400">{c.id}</span>
                    <Badge color={statusColor(c.status)}>{c.status}</Badge>
                    {c.organism && <Badge color="red">{c.organism}</Badge>}
                    {c.isolationType !== 'Yok' && <Badge color={isoColor(c.isolationType)}>İzolasyon: {c.isolationType}</Badge>}
                    {c.isHAI && <Badge color="purple">HAİ — {c.haiType}</Badge>}
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="text-[9px] text-slate-500">Risk:</div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black ${c.riskScore >= 7 ? 'bg-red-500 text-white' : c.riskScore >= 4 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>{c.riskScore}</div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{c.patient} ({c.age} {c.gender}) — {c.room}</p>
                  <p className="text-xs text-slate-600">{c.site} • {c.type}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.dept} • {c.doctor} • Tespit: {c.detectionDate}</p>
                  <p className="text-xs text-emerald-700 mt-0.5 bg-emerald-50 px-2 py-0.5 rounded inline-block">{c.antibiotic}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 mt-1 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sürveyans */}
      {tab === 'surveyans' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h4 className="font-bold text-slate-800 mb-3">HAİ Aylık Trend (2026)</h4>
              <div style={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={haiChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="VIP" fill="#ef4444" name="VİP" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="KAUSI" fill="#f59e0b" name="KAÜSİ" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="KDE" fill="#8b5cf6" name="KDEİ" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="CAE" fill="#06b6d4" name="CAE" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h4 className="font-bold text-slate-800 mb-3">İzole Organizmalar Dağılımı</h4>
              <div style={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={organismPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                      {organismPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h4 className="font-bold text-slate-800 mb-3">VİP Hızı Trendi (1000 ventilatör günü başına)</h4>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={haiRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <ReferenceLine y={5.0} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Hedef <5.0', fill: '#ef4444', fontSize: 10 }} />
                  <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5, fill: '#3b82f6' }} name="VİP Hızı" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'VİP Hızı', value: '3.2', target: '< 5.0 /1000 vent. günü', unit: '', ok: true },
              { label: 'KAÜSİ Hızı', value: '2.8', target: '< 4.0 /1000 kateter günü', unit: '', ok: true },
              { label: 'KDEİ Hızı', value: '1.5', target: '< 2.0 /1000 kateter günü', unit: '', ok: true },
            ].map((r, i) => (
              <div key={i} className={`p-4 rounded-xl border text-center ${r.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-xs text-slate-500">{r.label}</p>
                <p className={`text-3xl font-black mt-1 ${r.ok ? 'text-emerald-700' : 'text-red-700'}`}>{r.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Hedef: {r.target}</p>
                <p className={`text-[10px] font-bold mt-1 ${r.ok ? 'text-emerald-600' : 'text-red-600'}`}>{r.ok ? '✓ Hedef Altında' : '⚠ Hedef Üstünde'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* El Hijyeni */}
      {tab === 'hijyen' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Shield size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-700">WHO — El Hijyeninin 5 Anı</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { no: '1', name: 'Hastaya temas öncesi', color: 'bg-blue-100 text-blue-700' },
                  { no: '2', name: 'Aseptik işlem öncesi', color: 'bg-purple-100 text-purple-700' },
                  { no: '3', name: 'Kan/VKS temasından sonra', color: 'bg-red-100 text-red-700' },
                  { no: '4', name: 'Hastaya temas sonrası', color: 'bg-amber-100 text-amber-700' },
                  { no: '5', name: 'Hasta çevresine temas sonrası', color: 'bg-emerald-100 text-emerald-700' },
                ].map((m, i) => (
                  <span key={i} className={`${m.color} text-[10px] font-bold px-2.5 py-1 rounded-lg border border-current/20`}>
                    {m.no}. {m.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800">El Hijyeni Uyum Denetimleri (5 Moment Bazında)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Birim</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Tarih</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Gözlem</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Genel %</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-blue-600">M1%</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-purple-600">M2%</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-red-600">M3%</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-amber-600">M4%</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-emerald-600">M5%</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Gözlemci</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockAudits.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{a.dept}</td>
                      <td className="py-3 px-4 text-center text-xs text-slate-500">{a.date}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{a.compliant}/{a.totalObs}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-sm font-black ${a.rate >= 80 ? 'text-emerald-600' : a.rate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>%{a.rate}</span>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1"><div className={`h-1.5 rounded-full ${a.rate >= 80 ? 'bg-emerald-500' : a.rate >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${a.rate}%` }}></div></div>
                      </td>
                      {[a.moment1, a.moment2, a.moment3, a.moment4, a.moment5].map((m, j) => (
                        <td key={j} className={`py-3 px-4 text-center text-xs font-bold ${m >= 80 ? 'text-emerald-600' : m >= 60 ? 'text-amber-600' : 'text-red-600'}`}>%{m}</td>
                      ))}
                      <td className="py-3 px-4 text-xs text-slate-500">{a.observer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bundle */}
      {tab === 'bundle' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">Bakım demet (bundle) değerlendirmeleri günlük yapılmalıdır. Tüm kriterlerin uyumlu olması HAİ riskini anlamlı ölçüde düşürmektedir.</p>
          </div>
          {bundles_.map((bundle, bIdx) => (
            <div key={bIdx} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-800">{bundle.patient} — {bundle.room} ({bundle.dept})</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge color={bundle.bundleType === 'VAP' ? 'red' : bundle.bundleType === 'CAUTI' ? 'amber' : 'blue'}>
                      {bundle.bundleType === 'VAP' ? 'VİP Bakım Demeti' : bundle.bundleType === 'CAUTI' ? 'KAÜSİ Bakım Demeti' : 'KDEİ Bakım Demeti'}
                    </Badge>
                    <span className="text-xs text-slate-500">Son değerlendirme: {bundle.lastAssessment}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-black ${bundle.compliance < 80 ? 'text-red-600' : bundle.compliance < 100 ? 'text-amber-600' : 'text-emerald-600'}`}>%{bundle.compliance}</p>
                  <p className="text-[10px] text-slate-400">Uyum Oranı</p>
                </div>
              </div>
              <div className="space-y-2">
                {bundle.items.map((item, iIdx) => (
                  <div key={iIdx} className={`flex items-center gap-3 p-3 rounded-xl border ${item.compliant ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <input type="checkbox" checked={item.compliant}
                      onChange={() => toggleBundle(bIdx, iIdx)}
                      className="w-5 h-5 rounded accent-emerald-500 flex-shrink-0" />
                    <div className="flex-1">
                      <span className={`text-sm ${item.compliant ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}`}>{item.criterion}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 flex-shrink-0">{item.lastChecked}</span>
                    {item.compliant ? <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" /> : <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Antibiyotik Yönetimi */}
      {tab === 'antibiyotik' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h4 className="font-bold text-slate-800 mb-3">DDD (Defined Daily Dose) Analizi</h4>
              <div className="space-y-3">
                {[
                  { drug: 'Meropenem', ddd: 3.2, benchmark: 2.0, flag: true },
                  { drug: 'Vankomisin', ddd: 2.8, benchmark: 3.0, flag: false },
                  { drug: 'Piperasilin-Tazobaktam', ddd: 5.1, benchmark: 4.5, flag: true },
                  { drug: 'Seftriakson', ddd: 8.4, benchmark: 10.0, flag: false },
                  { drug: 'Siprofloksasin', ddd: 4.2, benchmark: 5.0, flag: false },
                ].map((d, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${d.flag ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{d.drug}</p>
                      <p className="text-[10px] text-slate-500">Kıyaslama: {d.benchmark} DDD/100 yatak günü</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black ${d.flag ? 'text-amber-700' : 'text-emerald-700'}`}>{d.ddd}</p>
                      <p className="text-[9px] text-slate-400">DDD/100 yatak günü</p>
                      {d.flag && <p className="text-[9px] text-amber-600 font-bold">⚠ Kıyaslama üstünde</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h4 className="font-bold text-slate-800 mb-3">Antibiyotik Yönetim Programı (ABS) Hedefleri</h4>
              <div className="space-y-3">
                {[
                  { goal: 'Ampirik antibiyotik başlangıcında kültür alım oranı', current: '92%', target: '≥95%', ok: false },
                  { goal: 'Kültür sonucuna göre deeskalasyon oranı', current: '68%', target: '≥70%', ok: false },
                  { goal: 'IV→PO dönüşüm değerlendirmesi', current: '78%', target: '≥80%', ok: false },
                  { goal: 'Antibiyotik süre uyumu (≤7 gün)', current: '84%', target: '≥85%', ok: false },
                  { goal: 'Karbapenem kısıtlaması uyumu', current: '95%', target: '≥90%', ok: true },
                ].map((g, i) => (
                  <div key={i} className={`p-3 rounded-xl border flex items-start justify-between ${g.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-xs text-slate-700 flex-1">{g.goal}</p>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className={`font-black text-sm ${g.ok ? 'text-emerald-700' : 'text-amber-700'}`}>{g.current}</p>
                      <p className="text-[9px] text-slate-400">Hedef: {g.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Çevre Sürveyansı */}
      {tab === 'cevre' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Beaker className="text-purple-500" size={18} />Çevre Kültür Sonuçları</h3>
              <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 flex items-center gap-1.5"><Plus size={12} />Yeni Kültür Ekle</button>
            </div>
            <div className="divide-y divide-slate-100">
              {environmentalSurveillance.map((s, i) => (
                <div key={i} className={`p-4 flex items-center justify-between ${!s.ok ? 'bg-red-50/30' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-slate-800">{s.location}</p>
                      {!s.ok && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black">ÜREME VAR</span>}
                    </div>
                    <p className="text-xs text-slate-500">{s.surface} • {s.date}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`text-sm font-bold ${s.ok ? 'text-emerald-700' : 'text-red-700'}`}>{s.organism}</p>
                    {!s.ok && <button className="mt-1 px-2 py-0.5 bg-red-600 text-white rounded text-[9px] font-bold">Aksiyon Al</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-3">Çevre Sürveyans Takvimi</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { area: 'YBÜ Yüzey Kültürleri', frequency: 'Haftalık', lastDone: '07.04.2026', next: '14.04.2026' },
                { area: 'Ameliyathane Hava Örnekleri', frequency: '2 Haftada bir', lastDone: '05.04.2026', next: '19.04.2026' },
                { area: 'Su Örneği (Legionella)', frequency: 'Aylık', lastDone: '01.04.2026', next: '01.05.2026' },
                { area: 'Hemşire İstasyonu Yüzey', frequency: 'Haftalık', lastDone: '07.04.2026', next: '14.04.2026' },
                { area: 'Diyaliz Su Analizi', frequency: 'Aylık', lastDone: '01.04.2026', next: '01.05.2026' },
                { area: 'İzolasyon Odaları', frequency: 'Taburculuk sonrası', lastDone: '05.04.2026', next: 'Talep üzerine' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="font-bold text-slate-700">{s.area}</p>
                  <p className="text-slate-500 mt-1">Sıklık: <strong>{s.frequency}</strong></p>
                  <p className="text-slate-500">Son: <strong>{s.lastDone}</strong></p>
                  <p className="text-blue-600">Sonraki: <strong>{s.next}</strong></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Case Detail Modal */}
      <Modal open={!!selectedCase} onClose={() => setSelectedCase(null)} title={`Enfeksiyon Vakası — ${selectedCase?.id || ''}`} size="2xl">
        {selectedCase && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px] uppercase">Hasta</span><span className="font-bold">{selectedCase.patient} ({selectedCase.age} {selectedCase.gender})</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Oda / Birim</span><span className="font-bold">{selectedCase.room} — {selectedCase.dept}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Organizma</span><span className="font-bold text-red-600">{selectedCase.organism || 'Bekliyor'}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Tespit Tarihi</span><span className="font-bold">{selectedCase.detectionDate}</span></div>
            </div>

            {selectedCase.isolationType !== 'Yok' && (
              <div className={twMerge("border-2 rounded-xl p-4 flex items-start gap-3",
                selectedCase.isolationType === 'Temas' ? 'bg-amber-50 border-amber-300' :
                  selectedCase.isolationType === 'Damlacık' ? 'bg-blue-50 border-blue-300' : 'bg-red-50 border-red-300')}>
                <Shield size={24} className={selectedCase.isolationType === 'Temas' ? 'text-amber-500' : selectedCase.isolationType === 'Damlacık' ? 'text-blue-500' : 'text-red-500'} />
                <div>
                  <p className="font-black text-slate-800">{selectedCase.isolationType} İzolasyonu Uygulanıyor</p>
                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    {selectedCase.isolationType === 'Temas' && [
                      'Önlük ve eldiven zorunlu (odaya giriş öncesi)',
                      'Hasta bakım ekipmanları diğer hastalarla paylaşılmayacak',
                      'Odadan çıkışta el hijyeni zorunlu',
                      'Ziyaretçi kısıtlaması uygulanacak',
                    ].map((rule, i) => <p key={i}>• {rule}</p>)}
                    {selectedCase.isolationType === 'Damlacık' && [
                      'Hasta odasına giriş öncesi cerrahi maske zorunlu',
                      'Hasta transferi sırasında maske takılacak',
                      '1 metre mesafe korunmalı',
                    ].map((rule, i) => <p key={i}>• {rule}</p>)}
                  </div>
                </div>
              </div>
            )}

            {selectedCase.isHAI && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                <p className="text-sm font-bold text-purple-700">Sağlık Bakım İlişkili Enfeksiyon (HAİ)</p>
                <p className="text-xs text-purple-600 mt-0.5">Tip: {selectedCase.haiType}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div><h4 className="text-sm font-bold text-slate-700 mb-1">Enfeksiyon Bölgesi / Türü</h4><p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedCase.site} — {selectedCase.type}</p></div>
              <div><h4 className="text-sm font-bold text-slate-700 mb-1">Kültür / Kaynak</h4><p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedCase.source}</p></div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-1">Antibiyotik Tedavisi</h4>
              <p className="text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-800 font-medium">{selectedCase.antibiotic}</p>
            </div>

            {selectedCase.susceptibility && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-1">Duyarlılık Özeti</h4>
                <p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedCase.susceptibility}</p>
              </div>
            )}

            {selectedCase.notes && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-1">Enfeksiyon Kontrol Notu</p>
                <p className="text-sm text-slate-700">{selectedCase.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} />Vaka Raporu</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Send size={14} />Epidemiyoloji Bildir</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
