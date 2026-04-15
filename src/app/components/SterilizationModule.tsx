import React, { useState } from 'react';
import {
  ScanLine, CheckCircle2, AlertTriangle, X, Plus, ChevronRight, RefreshCw,
  Package, Printer, Clock, Zap,
  Activity, FileText, Download
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SterilizationCycle {
  id: string; cycleNo: string; machine: string; program: string;
  startTime: string; endTime: string; date: string;
  status: 'Yükleme' | 'Çalışıyor' | 'Tamamlandı' | 'Başarısız' | 'Bekliyor';
  operator: string; items: { name: string; dept: string; quantity: number; barcode: string }[];
  biIndicator: 'Negatif' | 'Pozitif' | 'Bekliyor' | 'Uygulanmadı';
  chemIndicator: 'Uygun' | 'Uygunsuz' | 'Bekliyor' | 'Uygulanmadı';
  bowieDick: 'Geçti' | 'Kaldı' | 'Uygulanmadı';
  temp: string; pressure: string; duration: string;
  method: 'Buhar (Otoklav)' | 'EO (Etilen Oksit)' | 'Plazma (H₂O₂)' | 'Kuru Isı';
  notes: string; cycleLogUrl: string;
}

interface InstrumentSet {
  id: string; name: string; dept: string; contents: string;
  barcode: string; lastSterilized: string; nextDue: string;
  status: 'Steril' | 'Kullanımda' | 'Kirli' | 'Sterilizasyonda' | 'Bakımda' | 'Ret';
  cycleCount: number; maxCycles: number;
  currentStage: 'Depo' | 'Dağıtım' | 'Kullanım' | 'Kirli Oda' | 'Ön Temizleme' | 'Yıkama' | 'Paketleme' | 'Sterilizasyon' | 'Karantina';
}

const mockCycles: SterilizationCycle[] = [
  {
    id: 'SC-001', cycleNo: 'C-20260407-001', machine: 'Otoklav 1 (Tuttnauer 5075 ELV)', program: '134°C / 5dk — Prion Programı',
    startTime: '07:30', endTime: '08:15', date: '07.04.2026', status: 'Tamamlandı',
    operator: 'Tek. Ayşe K.', method: 'Buhar (Otoklav)',
    items: [
      { name: 'Genel Cerrahi Set A', dept: 'Ameliyathane', quantity: 1, barcode: 'GCS-A-001' },
      { name: 'Genel Cerrahi Set B', dept: 'Ameliyathane', quantity: 1, barcode: 'GCS-B-002' },
      { name: 'Laparoskopi Set', dept: 'Ameliyathane', quantity: 1, barcode: 'LAP-001' },
    ],
    biIndicator: 'Negatif', chemIndicator: 'Uygun', bowieDick: 'Geçti',
    temp: '134.2°C', pressure: '2.12 bar', duration: '5 dk 18 sn',
    notes: 'Sabah ilk çevrim. BD testi geçti. Tüm parametreler normal.', cycleLogUrl: '#'
  },
  {
    id: 'SC-002', cycleNo: 'C-20260407-002', machine: 'Otoklav 2 (Getinge HS66 RAS)', program: '134°C / 18dk — Standart Program',
    startTime: '08:30', endTime: '', date: '07.04.2026', status: 'Çalışıyor',
    operator: 'Tek. Mehmet D.', method: 'Buhar (Otoklav)',
    items: [
      { name: 'Ortopedi Set (Diz)', dept: 'Ameliyathane', quantity: 1, barcode: 'ORT-DZ-001' },
      { name: 'Artroskopi Aletleri', dept: 'Ameliyathane', quantity: 1, barcode: 'ART-001' },
    ],
    biIndicator: 'Bekliyor', chemIndicator: 'Bekliyor', bowieDick: 'Uygulanmadı',
    temp: '134.0°C', pressure: '2.10 bar', duration: '18 dk',
    notes: 'Sterilizasyon aktif. Parametre takibi devam ediyor.', cycleLogUrl: '#'
  },
  {
    id: 'SC-003', cycleNo: 'C-20260407-003', machine: 'STERRAD 100S (ASP — Plazma)', program: 'H₂O₂ Plazma 55°C / 72 dk',
    startTime: '06:00', endTime: '07:15', date: '07.04.2026', status: 'Tamamlandı',
    operator: 'Tek. Ayşe K.', method: 'Plazma (H₂O₂)',
    items: [
      { name: 'Göz Mikrocerrahi Set', dept: 'Göz Kliniği', quantity: 2, barcode: 'GOZ-MC-001' },
      { name: 'Gastroskop (Esnek)', dept: 'Endoskopi', quantity: 1, barcode: 'END-GS-001' },
    ],
    biIndicator: 'Negatif', chemIndicator: 'Uygun', bowieDick: 'Uygulanmadı',
    temp: '55°C', pressure: '—', duration: '72 dk',
    notes: 'Isıya hassas malzeme — H₂O₂ Plazma ile sterilize edildi. Kâğıt/keten paketleme KULLANILMAZ.', cycleLogUrl: '#'
  },
  {
    id: 'SC-004', cycleNo: 'C-20260406-008', machine: 'Otoklav 1 (Tuttnauer 5075 ELV)', program: '134°C / 18dk — Standart Program',
    startTime: '16:00', endTime: '16:45', date: '06.04.2026', status: 'Başarısız',
    operator: 'Tek. Mehmet D.', method: 'Buhar (Otoklav)',
    items: [
      { name: 'Kardiyovasküler Set (KVC)', dept: 'KVC Ameliyathanesi', quantity: 1, barcode: 'KVC-001' },
    ],
    biIndicator: 'Pozitif', chemIndicator: 'Uygunsuz', bowieDick: 'Uygulanmadı',
    temp: '131.2°C', pressure: '1.82 bar', duration: '18 dk',
    notes: '⚠ BAŞARISIZ: BI pozitif, sıcaklık 134°C altında kaldı (131.2°C). KVC Set karantinaya alındı. Teknik servis çağrıldı. Kök neden analizi yapılacak.', cycleLogUrl: '#'
  },
  {
    id: 'SC-005', cycleNo: 'C-20260407-004', machine: 'EO Sterilizatör (3M Steri-Vac 5XL)', program: 'EO 55°C / 2.5 saat + Havalandırma 12 saat',
    startTime: '04:00', endTime: '18:30', date: '07.04.2026', status: 'Bekliyor',
    operator: 'Tek. Ayşe K.', method: 'EO (Etilen Oksit)',
    items: [
      { name: 'Laparoskopik Kamera Sistemi', dept: 'Ameliyathane', quantity: 1, barcode: 'CAM-001' },
    ],
    biIndicator: 'Bekliyor', chemIndicator: 'Bekliyor', bowieDick: 'Uygulanmadı',
    temp: '55°C', pressure: 'EO Gaz', duration: '2.5 saat + 12h havalandırma',
    notes: 'EO ile sterilizasyon tamamlandı, zorunlu havalandırma süreci devam ediyor. Havalandırma bitince serbest bırakılacak.', cycleLogUrl: '#'
  },
];

const mockSets: InstrumentSet[] = [
  { id: 'IS-001', name: 'Genel Cerrahi Set A', dept: 'Ameliyathane', contents: 'Bistüri sapı, forseps, penset, makaslar, ekartörler (28 parça)', barcode: 'GCS-A-001', lastSterilized: '07.04.2026 08:15', nextDue: '07.04.2026 20:15', status: 'Steril', cycleCount: 245, maxCycles: 500, currentStage: 'Depo' },
  { id: 'IS-002', name: 'Ortopedi Set (Diz)', dept: 'Ameliyathane', contents: 'Osteotomlar, keski, çekiç, retraktörler (35 parça)', barcode: 'ORT-DZ-001', lastSterilized: '', nextDue: '', status: 'Sterilizasyonda', cycleCount: 180, maxCycles: 400, currentStage: 'Sterilizasyon' },
  { id: 'IS-003', name: 'Laparoskopi Set', dept: 'Ameliyathane', contents: 'Trokar (5/10/12mm), grasper, disektör, kamera başlığı, insüflatör (12 parça)', barcode: 'LAP-001', lastSterilized: '07.04.2026 08:15', nextDue: '07.04.2026 20:15', status: 'Kullanımda', cycleCount: 320, maxCycles: 600, currentStage: 'Kullanım' },
  { id: 'IS-004', name: 'Göz Mikrocerrahi Set', dept: 'Göz Kliniği', contents: 'Mikro forseps, iris makası, kapsüloreksis forseps, irrigasyon kanülü (18 parça)', barcode: 'GOZ-MC-001', lastSterilized: '07.04.2026 07:15', nextDue: '08.04.2026 07:15', status: 'Steril', cycleCount: 150, maxCycles: 300, currentStage: 'Dağıtım' },
  { id: 'IS-005', name: 'Kardiyovasküler Set (KVC)', dept: 'KVC Ameliyathanesi', contents: 'Vasküler klemp, disektör, retraktör, needle holder (42 parça)', barcode: 'KVC-001', lastSterilized: '', nextDue: '', status: 'Ret', cycleCount: 95, maxCycles: 400, currentStage: 'Karantina' },
  { id: 'IS-006', name: 'Doğumhane Set', dept: 'Doğumhane', contents: 'Forseps, makas, iğne tutucu (12 parça)', barcode: 'DOG-001', lastSterilized: '07.04.2026 06:00', nextDue: '07.04.2026 18:00', status: 'Kullanımda', cycleCount: 410, maxCycles: 500, currentStage: 'Kullanım' },
];

const spd6Stages = [
  { id: 1, name: 'Ön Temizleme', icon: '🚿', desc: 'Kirli oda, akan su ile artık uzaklaştırma', time: '5 dk', requirement: 'Kuru kan ve organik madde uzaklaştırılmalı' },
  { id: 2, name: 'Yıkama / Dezenfeksiyon', icon: '🧺', desc: 'Otomatik yıkama makinası 90°C/1 dk A0 değeri', time: '20 dk', requirement: 'A0 ≥ 600 (termal dezenfeksiyon)' },
  { id: 3, name: 'İnceleme & Paketleme', icon: '🔍', desc: 'Hasar kontrolü, sayım, CSSD paketi', time: '10 dk', requirement: 'Tüm parçalar mevcut, hasar yok' },
  { id: 4, name: 'Sterilizasyon', icon: '♨️', desc: 'Otoklav / Plazma / EO ile sterilizasyon', time: 'Programa göre', requirement: 'BI negatif, CI uygun' },
  { id: 5, name: 'Karantina / Soğuma', icon: '❄️', desc: '30 dk soğuma, BI sonucu bekleme', time: '30 dk + 24-48h BI', requirement: 'BI negatif onayı' },
  { id: 6, name: 'Dağıtım', icon: '📦', desc: 'FIFO prensibi ile depo ve dağıtım', time: 'Talebe göre', requirement: 'Barkod taraması, imza' },
];

const qualityMetrics = [
  { week: 'H1', successRate: 98.2, batchCount: 42, failCount: 1 },
  { week: 'H2', successRate: 100, batchCount: 38, failCount: 0 },
  { week: 'H3', successRate: 96.8, batchCount: 44, failCount: 2 },
  { week: 'H4', successRate: 99.1, batchCount: 45, failCount: 1 },
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

export function SterilizationModule() {
  const [tab, setTab] = useState<'cevrim' | 'alet' | 'akis' | 'kalite' | 'gericagirma'>('cevrim');
  const [selectedCycle, setSelectedCycle] = useState<SterilizationCycle | null>(null);
  const [selectedSet, setSelectedSet] = useState<InstrumentSet | null>(null);

  const statusColor = (s: string) => s === 'Tamamlandı' ? 'green' : s === 'Çalışıyor' ? 'blue' : s === 'Başarısız' ? 'red' : s === 'Bekliyor' ? 'amber' : 'slate';
  const setStatusColor = (s: string) => s === 'Steril' ? 'green' : s === 'Kullanımda' ? 'blue' : s === 'Sterilizasyonda' ? 'amber' : s === 'Kirli' ? 'red' : s === 'Ret' ? 'red' : 'slate';

  const failedCount = mockCycles.filter(c => c.status === 'Başarısız').length;
  const runningCount = mockCycles.filter(c => c.status === 'Çalışıyor').length;
  const completedCount = mockCycles.filter(c => c.status === 'Tamamlandı').length;
  const sterileSetCount = mockSets.filter(s => s.status === 'Steril').length;

  const tabs = [
    { id: 'cevrim' as const, label: 'Çevrim Takibi' },
    { id: 'alet' as const, label: 'Alet Setleri' },
    { id: 'akis' as const, label: 'SPD İş Akışı' },
    { id: 'kalite' as const, label: 'Kalite Göstergeleri' },
    { id: 'gericagirma' as const, label: `Geri Çağırma${failedCount > 0 ? ` (${failedCount})` : ''}` },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Merkezi Sterilizasyon Ünitesi (MSÜ / CSSD)</h2>
          <p className="text-sm text-slate-500">ISO 17665 / EN 13060 uyumlu • BI/CI/BD indikatör takibi • 6 aşamalı SPD iş akışı • Geri çağırma yönetimi</p>
        </div>
        <div className="flex items-center gap-2">
          {failedCount > 0 && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-300 rounded-lg text-xs font-bold text-red-700 animate-pulse" onClick={() => setTab('gericagirma')}>
              <AlertTriangle size={12} /> {failedCount} Başarısız Çevrim
            </button>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
            <ScanLine size={12} /> Barkod Takip Aktif
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 shadow-sm">
          <p className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1"><RefreshCw size={12} />Çalışan</p>
          <p className="text-2xl font-black text-blue-600">{runningCount}</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-700 uppercase">Tamamlanan</p>
          <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
        </div>
        <div className={twMerge("p-3 rounded-xl border shadow-sm", failedCount > 0 ? "bg-red-50 border-red-300 animate-pulse" : "bg-white border-slate-200")}>
          <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1"><AlertTriangle size={12} />Başarısız</p>
          <p className="text-2xl font-black text-red-600">{failedCount}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 shadow-sm">
          <p className="text-[10px] font-bold text-purple-700 uppercase">Steril Set</p>
          <p className="text-2xl font-black text-purple-600">{sterileSetCount}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-sm">
          <p className="text-[10px] font-bold text-amber-700 uppercase">Karantinadaki</p>
          <p className="text-2xl font-black text-amber-600">{mockSets.filter(s => s.status === 'Ret').length}</p>
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

      {/* Çevrim Takibi */}
      {tab === 'cevrim' && (
        <div className="flex-1 overflow-y-auto space-y-3">
          {mockCycles.map(c => (
            <div key={c.id} onClick={() => setSelectedCycle(c)}
              className={twMerge("bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all",
                c.status === 'Başarısız' ? 'border-red-400 bg-red-50/20' : c.status === 'Çalışıyor' ? 'border-blue-400' : 'border-slate-200')}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono text-slate-400">{c.cycleNo}</span>
                    <Badge color={statusColor(c.status)}>{c.status}</Badge>
                    {c.status === 'Çalışıyor' && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>}
                    {c.biIndicator === 'Pozitif' && <Badge color="red">BI Pozitif ⚠</Badge>}
                    <Badge color={c.method.includes('Buhar') ? 'blue' : c.method.includes('Plazma') ? 'purple' : c.method.includes('EO') ? 'amber' : 'slate'}>
                      {c.method.split(' ')[0]}
                    </Badge>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{c.machine}</p>
                  <p className="text-xs text-slate-600">{c.program} • {c.date} {c.startTime} → {c.endTime || '...'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Operatör: {c.operator}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {c.items.map((item, i) => (
                      <span key={i} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{item.name} ({item.dept})</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 ml-4">
                  <div className="flex gap-1">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${c.biIndicator === 'Negatif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : c.biIndicator === 'Pozitif' ? 'bg-red-100 text-red-700 border-red-300 animate-pulse' : c.biIndicator === 'Uygulanmadı' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      BI: {c.biIndicator}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${c.chemIndicator === 'Uygun' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : c.chemIndicator === 'Uygunsuz' ? 'bg-red-100 text-red-700 border-red-300' : c.chemIndicator === 'Uygulanmadı' ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      CI: {c.chemIndicator}
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <div>{c.temp} / {c.pressure}</div>
                    <div>{c.duration}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alet Setleri */}
      {tab === 'alet' && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSets.map(s => (
              <div key={s.id} onClick={() => setSelectedSet(s)}
                className={twMerge("bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all",
                  s.status === 'Ret' ? 'border-red-300 bg-red-50/20' : s.status === 'Steril' ? 'border-emerald-200' : 'border-slate-200')}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-800">{s.name}</h4>
                    <Badge color={setStatusColor(s.status)}>{s.status}</Badge>
                    {s.status === 'Ret' && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded font-black animate-pulse">KARANTİNA</span>}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">{s.barcode}</span>
                </div>
                <p className="text-xs text-slate-500">{s.contents}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-500">{s.dept}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-20 bg-slate-200 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${s.cycleCount / s.maxCycles > 0.8 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${(s.cycleCount / s.maxCycles) * 100}%` }} />
                    </div>
                    <span className={`text-[10px] font-bold ${s.cycleCount / s.maxCycles > 0.8 ? 'text-red-600' : 'text-slate-500'}`}>{s.cycleCount}/{s.maxCycles}</span>
                  </div>
                </div>
                {/* Stage indicator */}
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[9px] text-slate-500">SPD Aşaması:</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.currentStage === 'Sterilizasyon' ? 'bg-blue-100 text-blue-700' : s.currentStage === 'Karantina' ? 'bg-red-100 text-red-700' : s.currentStage === 'Depo' || s.currentStage === 'Dağıtım' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {s.currentStage}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Son steril: {s.lastSterilized || '—'}</span>
                  <span>Geçerlilik: {s.nextDue || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPD İş Akışı */}
      {tab === 'akis' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-5 text-center">MSÜ / CSSD 6 Aşamalı Sterilizasyon Süreci (ISO 17665 / EN ISO 11607)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {spd6Stages.map((stage, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <div className="text-3xl mb-2">{stage.icon}</div>
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center mb-2">{stage.id}</div>
                  <p className="text-xs font-bold text-slate-800 mb-1">{stage.name}</p>
                  <p className="text-[10px] text-slate-500 mb-1">{stage.desc}</p>
                  <p className="text-[9px] text-blue-600 font-semibold">⏱ {stage.time}</p>
                  <p className="text-[9px] text-emerald-600 mt-0.5">✓ {stage.requirement}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h4 className="font-bold text-slate-800 mb-3">Sterilizasyon Yöntemi Seçimi</h4>
              <div className="space-y-2">
                {[
                  { method: 'Buhar (Otoklav) 134°C', suitable: 'Metal aletler, tekstil, cam', notSuitable: 'Isıya/neme hassas', color: 'blue' },
                  { method: 'H₂O₂ Plazma (STERRAD)', suitable: 'Laparoskopik, endoskopik, optikler', notSuitable: 'Selulosik materyaller', color: 'purple' },
                  { method: 'EO (Etilen Oksit)', suitable: 'Plastik, elektronik, tek kullanımlık', notSuitable: 'Acil durumlar (çok uzun)', color: 'amber' },
                  { method: 'Kuru Isı (180°C)', suitable: 'Cam, yağlı materyaller, tozlar', notSuitable: 'Plastik, kumaş', color: 'orange' },
                ].map((m, i) => (
                  <div key={i} className={`p-3 rounded-xl border bg-${m.color}-50 border-${m.color}-200`}>
                    <p className={`text-xs font-bold text-${m.color}-700 mb-1`}>{m.method}</p>
                    <p className="text-[10px] text-emerald-700">✓ Uygun: {m.suitable}</p>
                    <p className="text-[10px] text-red-600">✗ Uygunsuz: {m.notSuitable}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h4 className="font-bold text-slate-800 mb-3">Bakım ve Kalibrasyon Takvimi</h4>
              <div className="space-y-2">
                {[
                  { machine: 'Otoklav 1 (Tuttnauer)', task: 'Kapak contası değişimi', due: '15.04.2026', status: 'Yaklaşan', color: 'amber' },
                  { machine: 'Otoklav 2 (Getinge)', task: 'Yıllık validasyon', due: '30.04.2026', status: 'Planlandı', color: 'blue' },
                  { machine: 'STERRAD 100S', task: 'H₂O₂ kaset değişimi', due: '10.04.2026', status: 'Yaklaşan', color: 'amber' },
                  { machine: 'EO Sterilizatör', task: 'Gaz sızıntı testi', due: '20.04.2026', status: 'Planlandı', color: 'blue' },
                  { machine: 'Yıkama Makinası', task: 'A0 değeri doğrulama', due: '07.04.2026', status: 'Bugün', color: 'red' },
                ].map((item, i) => (
                  <div key={i} className={`p-2.5 rounded-lg border flex items-center justify-between bg-${item.color}-50 border-${item.color}-200`}>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{item.machine}</p>
                      <p className="text-[10px] text-slate-500">{item.task}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold text-${item.color}-700`}>{item.due}</p>
                      <Badge color={item.color === 'red' ? 'red' : item.color === 'amber' ? 'amber' : 'blue'}>{item.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kalite Göstergeleri */}
      {tab === 'kalite' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-4">Haftalık Çevrim Başarı Oranı</h4>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[90, 101]} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, 'Başarı Oranı']} />
                  <Bar dataKey="successRate" fill="#10b981" name="Başarı Oranı (%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Başarı Oranı (Aylık)', value: '98.5%', target: '≥ 98%', ok: true },
              { label: 'BI Pozitif Oranı', value: '0.8%', target: '< 1%', ok: true },
              { label: 'Geri Çağırma', value: '1 set', target: '0 hedef', ok: false },
              { label: 'BD Test Başarısı', value: '100%', target: '100%', ok: true },
            ].map((m, i) => (
              <div key={i} className={`p-4 rounded-xl border text-center ${m.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className={`text-2xl font-black mt-1 ${m.ok ? 'text-emerald-700' : 'text-red-700'}`}>{m.value}</p>
                <p className="text-[10px] text-slate-400">Hedef: {m.target}</p>
                <p className={`text-[10px] font-bold mt-1 ${m.ok ? 'text-emerald-600' : 'text-red-600'}`}>{m.ok ? '✓ Hedef Sağlandı' : '⚠ İyileştirme Gerekli'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Geri Çağırma */}
      {tab === 'gericagirma' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h3 className="font-black text-red-700 text-lg">Sterilizasyon Başarısız — Geri Çağırma Prosedürü</h3>
                <p className="text-sm text-red-600 mt-1">Başarısız çevrimdeki TÜM materyaller hızla geri toplanmalı, tekrar sterilize edilmeli. Kullanılan materyaller için olay bildirimi zorunludur.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-3">Başarısız Çevrim: C-20260406-008 — Kardiyovasküler Set (KVC)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Başarısız Neden', value: 'BI Pozitif + Temp Düşük (131.2°C)', color: 'red' },
                { label: 'Etkilenen Set', value: 'KVC-001 — Kardiyovasküler Set', color: 'red' },
                { label: 'Son Kullanım', value: 'Kullanılmadı (Karantinada)', color: 'green' },
                { label: 'Kök Neden', value: 'Otoklav Isı Sensörü Arızası', color: 'amber' },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl border bg-${item.color}-50 border-${item.color}-200`}>
                  <p className="text-[10px] text-slate-500">{item.label}</p>
                  <p className={`text-xs font-bold text-${item.color}-700 mt-0.5`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 mb-2">Geri Çağırma Kontrol Listesi:</p>
              {[
                { item: 'Etkilenen materyal tespit edildi ve karantinaya alındı', done: true },
                { item: 'Ameliyathane ve ilgili klinisyenler bilgilendirildi', done: true },
                { item: 'Yetkili yöneticiye (MSÜ Sorumlusu) bildirim yapıldı', done: true },
                { item: 'Tekrar sterilizasyon planlandı', done: true },
                { item: 'Kök neden analizi tamamlandı', done: false },
                { item: 'Düzeltici faaliyet (CAPA) başlatıldı', done: false },
                { item: 'Olay raporu düzenlendi (SABİM / Kalite)', done: false },
                { item: 'Teknik servis ile otoklav onarımı gerçekleştirildi', done: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${item.done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <span className={`text-lg ${item.done ? 'text-emerald-500' : 'text-slate-300'}`}>{item.done ? '✓' : '○'}</span>
                  <span className={`text-sm ${item.done ? 'text-emerald-700 font-medium' : 'text-slate-600'}`}>{item.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cycle Detail Modal */}
      <Modal open={!!selectedCycle} onClose={() => setSelectedCycle(null)} title={`Sterilizasyon Çevrimi — ${selectedCycle?.cycleNo || ''}`} size="2xl">
        {selectedCycle && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px] uppercase">Makine</span><span className="font-bold">{selectedCycle.machine}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Yöntem</span><span className="font-bold">{selectedCycle.method}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Program</span><span className="font-bold">{selectedCycle.program}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Operatör</span><span className="font-bold">{selectedCycle.operator}</span></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Biyolojik İndikatör (BI)', value: selectedCycle.biIndicator, ok: selectedCycle.biIndicator === 'Negatif' || selectedCycle.biIndicator === 'Uygulanmadı' },
                { label: 'Kimyasal İndikatör (CI)', value: selectedCycle.chemIndicator, ok: selectedCycle.chemIndicator === 'Uygun' || selectedCycle.chemIndicator === 'Uygulanmadı' },
                { label: 'Bowie-Dick Testi', value: selectedCycle.bowieDick, ok: selectedCycle.bowieDick === 'Geçti' || selectedCycle.bowieDick === 'Uygulanmadı' },
                { label: 'Sıcaklık / Basınç', value: `${selectedCycle.temp} / ${selectedCycle.pressure}`, ok: selectedCycle.status !== 'Başarısız' },
              ].map((ind, i) => (
                <div key={i} className={`p-3 rounded-xl border text-center ${ind.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-300'}`}>
                  <p className="text-[10px] text-slate-500">{ind.label}</p>
                  <p className={`text-sm font-black mt-1 ${ind.ok ? 'text-emerald-700' : 'text-red-700 animate-pulse'}`}>{ind.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Sterilize Edilen Materyaller ({selectedCycle.items.length} set)</h4>
              <div className="space-y-2">
                {selectedCycle.items.map((item, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-slate-800">{item.name}</span>
                      <span className="text-xs text-slate-500 ml-2">({item.dept})</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{item.barcode}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedCycle.notes && (
              <div className={`p-3 rounded-xl border ${selectedCycle.status === 'Başarısız' ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-sm text-slate-700">{selectedCycle.notes}</p>
              </div>
            )}

            {selectedCycle.status === 'Başarısız' && (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 animate-pulse" />
                <div>
                  <p className="text-sm font-black text-red-700">ÇEVRİM BAŞARISIZ — Geri Çağırma Prosedürü Başlatılmalı</p>
                  <p className="text-xs text-red-600 mt-1">Bu çevrimdeki tüm materyaller karantinaya alınmalı, tekrar sterilize edilmeden kullanılmamalıdır.</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} />Çevrim Kaydı Yazdır</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Download size={14} />PDF İndir</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Set Detail Modal */}
      <Modal open={!!selectedSet} onClose={() => setSelectedSet(null)} title={`Alet Seti — ${selectedSet?.name || ''}`}>
        {selectedSet && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px]">Barkod</span><span className="font-mono font-bold">{selectedSet.barcode}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Birim</span><span className="font-bold">{selectedSet.dept}</span></div>
              <div><span className="text-slate-500 block text-[10px]">Durum</span><Badge color={setStatusColor(selectedSet.status)}>{selectedSet.status}</Badge></div>
              <div><span className="text-slate-500 block text-[10px]">SPD Aşaması</span><span className="font-bold">{selectedSet.currentStage}</span></div>
            </div>
            <div><p className="text-xs font-bold text-slate-500 mb-1">İçerik</p><p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedSet.contents}</p></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Çevrim Sayısı</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xl font-black text-slate-800">{selectedSet.cycleCount}</p>
                  <p className="text-xs text-slate-500">/ {selectedSet.maxCycles} max</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div className={`h-2 rounded-full ${selectedSet.cycleCount / selectedSet.maxCycles > 0.8 ? 'bg-red-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(selectedSet.cycleCount / selectedSet.maxCycles) * 100}%` }} />
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Son Sterilizasyon</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedSet.lastSterilized || '—'}</p>
                <p className="text-xs text-slate-500 mt-1">Geçerlilik</p>
                <p className="text-sm font-bold text-slate-800">{selectedSet.nextDue || '—'}</p>
              </div>
            </div>
            {selectedSet.status === 'Ret' && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-700">Karantinadaki Set — Kullanıma Verilemez</p>
                  <p className="text-xs text-red-600 mt-1">Sterilizasyon başarısız. Tekrar sterilize edilecek. Kök neden analizi tamamlanmadan kullanım yasak.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
