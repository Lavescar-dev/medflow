import React, { useState } from 'react';
import {
  Pill, Search, AlertTriangle, CheckCircle2, Package, ShieldAlert,
  X, Plus, Send, Printer, FileText, Shield,
  Lock, BookOpen, Beaker, Activity, ChevronRight
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Prescription {
  id: string; patient: string; tc: string; age: string; gender: string;
  dept: string; room: string; doctor: string; type: 'Yatan' | 'Ayaktan' | 'Acil';
  status: 'Bekliyor' | 'Hazırlanıyor' | 'Hazır' | 'Teslim Edildi' | 'İptal';
  priority: 'Normal' | 'Acil' | 'Cito';
  time: string; date: string;
  items: { name: string; dose: string; freq: string; route: string; duration: string; stock: number; interaction: boolean; interactionNote: string; atcCode: string }[];
  medulaNo: string; sutCode: string; pharmacist: string; notes: string;
  clinicalPharmNote: string;
}

interface StockItem {
  id: string; name: string; atcCode: string; form: string;
  currentStock: number; minStock: number; maxStock: number;
  expiryDate: string; lot: string; supplier: string;
  status: 'Yeterli' | 'Düşük' | 'Kritik' | 'Stok Yok';
  narcotic: boolean; coldChain: boolean; highAlert: boolean;
  unitDose: boolean;
}

interface NarcoticEntry {
  id: string; date: string; time: string; drug: string; dose: string;
  patient: string; doctor: string; nurse: string; witness: string;
  action: 'Çıkış' | 'İade' | 'İmha' | 'Giriş'; remaining: number;
  verified: boolean;
}

const mockPrescriptions: Prescription[] = [
  {
    id: 'RX-2026-0481', patient: 'Zeynep Kaya', tc: '345***678', age: '72', gender: 'K',
    dept: 'Dahiliye', room: '302-A', doctor: 'Uzm. Dr. Ahmet K.', type: 'Yatan',
    status: 'Hazırlanıyor', priority: 'Acil', time: '09:45', date: '07.04.2026',
    items: [
      { name: 'Metilprednizolon 40mg Flakon', dose: '40mg', freq: '1x1', route: 'IV', duration: '5 gün', stock: 32, interaction: false, interactionNote: '', atcCode: 'H02AB04' },
      { name: 'Salbutamol 2.5mg/2.5mL Nebül', dose: '2.5mg', freq: '3x1', route: 'Nebülizasyon', duration: '7 gün', stock: 85, interaction: false, interactionNote: '', atcCode: 'R03AC02' },
      { name: 'İpratropium Bromür 0.5mg Nebül', dose: '0.5mg', freq: '3x1', route: 'Nebülizasyon', duration: '7 gün', stock: 42, interaction: false, interactionNote: '', atcCode: 'R03BB01' },
    ],
    medulaNo: 'PRV-2026-048291', sutCode: 'SUT-002-041', pharmacist: '', notes: 'KOAH alevlenme tedavisi',
    clinicalPharmNote: ''
  },
  {
    id: 'RX-2026-0482', patient: 'Mehmet Demir', tc: '234***567', age: '61', gender: 'E',
    dept: 'Acil Servis', room: 'Acil', doctor: 'Dr. Hakan Ç.', type: 'Acil',
    status: 'Bekliyor', priority: 'Cito', time: '10:30', date: '07.04.2026',
    items: [
      { name: 'Ceftriaxone 1g Flakon', dose: '1g', freq: '2x1', route: 'IV', duration: '7 gün', stock: 12, interaction: true, interactionNote: 'Kalsiyum içeren IV solüsyonlarla eş zamanlı verilmemeli (presipitasyon riski). Geriatrik hastalarda dikkat.', atcCode: 'J01DD04' },
      { name: 'Parasetamol 10mg/mL 100mL', dose: '1g', freq: '3x1 PRN', route: 'IV', duration: '—', stock: 8, interaction: false, interactionNote: '', atcCode: 'N02BE01' },
      { name: 'İnsülin Glarjin 100IU/mL', dose: '20 IU', freq: '1x1 (gece)', route: 'SC', duration: 'Sürekli', stock: 25, interaction: false, interactionNote: '', atcCode: 'A10AE04' },
    ],
    medulaNo: '', sutCode: '', pharmacist: '', notes: 'K 5.8 — KCl içeren sıvılardan KAÇIN! Sepsis tablosu.',
    clinicalPharmNote: 'Böbrek fonksiyonları bozuk (Cr:2.8). Ceftriaxone dozu ayarı gerekmez, ancak renal takip şart. İnsülin dozu titrasyon gerektirebilir.'
  },
  {
    id: 'RX-2026-0483', patient: 'Fatma Şahin', tc: '567***890', age: '50', gender: 'K',
    dept: 'Genel Cerrahi', room: '303-A', doctor: 'Op. Dr. Sinan M.', type: 'Yatan',
    status: 'Hazır', priority: 'Normal', time: '10:50', date: '07.04.2026',
    items: [
      { name: 'Tramadol 50mg/mL Ampul', dose: '50mg', freq: 'PRN (maks 4x1)', route: 'IV/IM', duration: '3 gün', stock: 45, interaction: false, interactionNote: '', atcCode: 'N02AX02' },
      { name: 'Metoklopramid 10mg Ampul', dose: '10mg', freq: '3x1', route: 'IV', duration: '2 gün', stock: 60, interaction: false, interactionNote: '', atcCode: 'A03FA01' },
      { name: 'Enoksaparin 40mg/0.4mL', dose: '40mg', freq: '1x1', route: 'SC', duration: 'Taburculuğa kadar', stock: 30, interaction: false, interactionNote: '', atcCode: 'B01AB05' },
    ],
    medulaNo: 'PRV-2026-048295', sutCode: 'SUT-002-018', pharmacist: 'Ecz. Derya A.', notes: 'Post-op kolesistektomi. Ağrı + bulantı + DVT profilaksisi.',
    clinicalPharmNote: ''
  },
  {
    id: 'RX-2026-0484', patient: 'Ayşe Yılmaz', tc: '123***456', age: '41', gender: 'K',
    dept: 'Dahiliye', room: 'Poliklinik', doctor: 'Uzm. Dr. Ahmet K.', type: 'Ayaktan',
    status: 'Teslim Edildi', priority: 'Normal', time: '10:15', date: '07.04.2026',
    items: [
      { name: 'Valsartan/Hidroklorotiazid 80/12.5mg', dose: '80/12.5mg', freq: '1x1', route: 'PO', duration: '30 gün', stock: 120, interaction: false, interactionNote: '', atcCode: 'C09DA03' },
    ],
    medulaNo: 'PRV-2026-048290', sutCode: 'SUT-002-009', pharmacist: 'Ecz. Derya A.', notes: 'e-Reçete. MEDULA onaylı. Kapak 2.',
    clinicalPharmNote: ''
  },
];

const mockStock: StockItem[] = [
  { id: 'S1', name: 'Ceftriaxone 1g Flakon', atcCode: 'J01DD04', form: 'Flakon', currentStock: 12, minStock: 20, maxStock: 100, expiryDate: '09.2027', lot: 'LOT-2025-A1', supplier: 'Roche', status: 'Kritik', narcotic: false, coldChain: false, highAlert: false, unitDose: false },
  { id: 'S2', name: 'Parasetamol IV 10mg/mL 100mL', atcCode: 'N02BE01', form: 'IV Flakon', currentStock: 8, minStock: 30, maxStock: 150, expiryDate: '06.2027', lot: 'LOT-2025-B3', supplier: 'Fresenius Kabi', status: 'Kritik', narcotic: false, coldChain: false, highAlert: false, unitDose: true },
  { id: 'S3', name: 'Normal Salin %0.9 1000mL', atcCode: 'B05BB01', form: 'IV Solüsyon', currentStock: 45, minStock: 50, maxStock: 200, expiryDate: '12.2027', lot: 'LOT-2026-C1', supplier: 'Polifarma', status: 'Düşük', narcotic: false, coldChain: false, highAlert: false, unitDose: false },
  { id: 'S4', name: 'Heparin 5000 IU/mL Ampul', atcCode: 'B01AB01', form: 'Ampul', currentStock: 35, minStock: 25, maxStock: 80, expiryDate: '03.2027', lot: 'LOT-2025-D2', supplier: 'Vem İlaç', status: 'Yeterli', narcotic: false, coldChain: true, highAlert: true, unitDose: false },
  { id: 'S5', name: 'Morfin 10mg/mL Ampul', atcCode: 'N02AA01', form: 'Ampul', currentStock: 18, minStock: 10, maxStock: 50, expiryDate: '01.2027', lot: 'LOT-2025-N1', supplier: 'Galen', status: 'Yeterli', narcotic: true, coldChain: false, highAlert: true, unitDose: false },
  { id: 'S6', name: 'Fentanil 50mcg/mL 10mL', atcCode: 'N01AH01', form: 'Ampul', currentStock: 22, minStock: 15, maxStock: 60, expiryDate: '08.2027', lot: 'LOT-2025-N2', supplier: 'Janssen', status: 'Yeterli', narcotic: true, coldChain: false, highAlert: true, unitDose: false },
  { id: 'S7', name: 'Noradrenalin 4mg/4mL Ampul', atcCode: 'C01CA03', form: 'Ampul', currentStock: 5, minStock: 10, maxStock: 40, expiryDate: '11.2026', lot: 'LOT-2025-E1', supplier: 'Adeka', status: 'Kritik', narcotic: false, coldChain: true, highAlert: true, unitDose: false },
  { id: 'S8', name: 'İnsülin Glarjin 100IU/mL', atcCode: 'A10AE04', form: 'Kalem', currentStock: 25, minStock: 20, maxStock: 60, expiryDate: '05.2027', lot: 'LOT-2026-I1', supplier: 'Sanofi', status: 'Yeterli', narcotic: false, coldChain: true, highAlert: true, unitDose: false },
  { id: 'S9', name: 'Potasyum Klorür %15 10mL', atcCode: 'B05XA01', form: 'Ampul', currentStock: 30, minStock: 20, maxStock: 60, expiryDate: '06.2027', lot: 'LOT-2026-K1', supplier: 'Eczacıbaşı', status: 'Yeterli', narcotic: false, coldChain: false, highAlert: true, unitDose: false },
  { id: 'S10', name: 'Meropenem 1g Flakon', atcCode: 'J01DH02', form: 'Flakon', currentStock: 18, minStock: 15, maxStock: 60, expiryDate: '04.2027', lot: 'LOT-2025-M1', supplier: 'AstraZeneca', status: 'Yeterli', narcotic: false, coldChain: false, highAlert: false, unitDose: false },
];

const narcoticLog: NarcoticEntry[] = [
  { id: 'NRC-001', date: '07.04.2026', time: '08:15', drug: 'Morfin 10mg Ampul', dose: '5mg IV', patient: 'Fatma Şahin (303-A)', doctor: 'Op. Dr. Sinan M.', nurse: 'Hem. Ayşe K.', witness: 'Hem. Fatma D.', action: 'Çıkış', remaining: 17, verified: true },
  { id: 'NRC-002', date: '07.04.2026', time: '10:00', drug: 'Fentanil 50mcg/mL', dose: '100mcg IV', patient: 'Ayşe Koç (YBÜ-03)', doctor: 'Uzm. Dr. Can Y.', nurse: 'Hem. Meryem T.', witness: 'Hem. Selin K.', action: 'Çıkış', remaining: 21, verified: true },
  { id: 'NRC-003', date: '07.04.2026', time: '11:30', drug: 'Morfin 10mg Ampul', dose: '2mg IM', patient: 'Mustafa Yılmaz (301-A)', doctor: 'Uzm. Dr. Ahmet K.', nurse: 'Hem. Ayşe K.', witness: 'Hem. Fatma D.', action: 'Çıkış', remaining: 16, verified: false },
];

const abstewardshipData = [
  { dept: 'Dahiliye', Carbapenem: 2, Glikopeptit: 1, Geniş_Spektrum: 5 },
  { dept: 'Yoğun Bakım', Carbapenem: 4, Glikopeptit: 3, Geniş_Spektrum: 2 },
  { dept: 'Cerrahi', Carbapenem: 1, Glikopeptit: 0, Geniş_Spektrum: 4 },
  { dept: 'Acil', Carbapenem: 1, Glikopeptit: 1, Geniş_Spektrum: 6 },
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

export function PharmacyModule() {
  const [tab, setTab] = useState<'recete' | 'stok' | 'narkotik' | 'stewardship' | 'iv'>('recete');
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [narcoticEntries, setNarcoticEntries] = useState(narcoticLog);

  const filtered = prescriptions.filter(p => !searchQ || p.patient.toLowerCase().includes(searchQ.toLowerCase()) || p.id.toLowerCase().includes(searchQ.toLowerCase()));
  const filteredStock = mockStock.filter(s => !stockSearch || s.name.toLowerCase().includes(stockSearch.toLowerCase()));

  const handleStatusChange = (id: string, newStatus: Prescription['status']) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: newStatus, pharmacist: newStatus === 'Hazır' || newStatus === 'Teslim Edildi' ? 'Ecz. Derya A.' : p.pharmacist } : p));
    if (selectedRx?.id === id) setSelectedRx(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const statusColor = (s: string) => s === 'Bekliyor' ? 'amber' : s === 'Hazırlanıyor' ? 'blue' : s === 'Hazır' ? 'purple' : s === 'Teslim Edildi' ? 'green' : 'red';
  const stockStatusColor = (s: string) => s === 'Yeterli' ? 'green' : s === 'Düşük' ? 'amber' : 'red';

  const waiting = prescriptions.filter(p => p.status === 'Bekliyor').length;
  const preparing = prescriptions.filter(p => p.status === 'Hazırlanıyor').length;
  const ready = prescriptions.filter(p => p.status === 'Hazır').length;
  const criticalStock = mockStock.filter(s => s.status === 'Kritik' || s.status === 'Stok Yok').length;
  const hasInteraction = prescriptions.some(p => p.items.some(i => i.interaction) && !['Teslim Edildi', 'İptal'].includes(p.status));
  const unverifiedNarcotic = narcoticEntries.filter(n => !n.verified).length;

  const tabs = [
    { id: 'recete' as const, label: 'Reçeteler' },
    { id: 'stok' as const, label: 'İlaç Stok' },
    { id: 'narkotik' as const, label: `Narkotik Kayıt${unverifiedNarcotic > 0 ? ` (${unverifiedNarcotic})` : ''}` },
    { id: 'stewardship' as const, label: 'Antibiyotik Yönetimi' },
    { id: 'iv' as const, label: 'IV Hazırlık Odası' },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Eczane ve İlaç Yönetimi</h2>
          <p className="text-sm text-slate-500">Reçete karşılama, ilaç etkileşim kontrolü, narkotik kayıt, antibiyotik yönetimi, IV hazırlık</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-700">
            <Shield size={12} /> MEDULA Aktif
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><p className="text-[10px] font-bold text-amber-700 uppercase">Bekliyor</p><p className="text-2xl font-black text-amber-600">{waiting}</p></div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200"><p className="text-[10px] font-bold text-blue-700 uppercase">Hazırlanıyor</p><p className="text-2xl font-black text-blue-600">{preparing}</p></div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200"><p className="text-[10px] font-bold text-purple-700 uppercase">Hazır</p><p className="text-2xl font-black text-purple-600">{ready}</p></div>
        <div className={twMerge("p-3 rounded-xl border", criticalStock > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200")}>
          <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1"><AlertTriangle size={12} />Kritik Stok</p>
          <p className="text-2xl font-black text-red-600">{criticalStock}</p>
        </div>
        <div className={twMerge("p-3 rounded-xl border", hasInteraction ? "bg-orange-50 border-orange-200 animate-pulse" : "bg-slate-50 border-slate-200")}>
          <p className="text-[10px] font-bold text-orange-700 uppercase flex items-center gap-1"><ShieldAlert size={12} />Etkileşim</p>
          <p className="text-2xl font-black text-orange-600">{hasInteraction ? '⚠' : '—'}</p>
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

      {/* Reçeteler */}
      {tab === 'recete' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50 flex-none">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2 text-slate-400" size={14} />
              <input type="text" placeholder="Hasta / Reçete No..." value={searchQ} onChange={e => setSearchQ(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filtered.map(rx => (
              <div key={rx.id} onClick={() => setSelectedRx(rx)}
                className={twMerge("p-4 hover:bg-blue-50/50 cursor-pointer transition-colors",
                  rx.priority !== 'Normal' && rx.status !== 'Teslim Edildi' ? "bg-red-50/20" : "")}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{rx.id}</span>
                      <span className="text-sm font-bold text-slate-800">{rx.patient}</span>
                      <Badge color={rx.type === 'Acil' ? 'red' : rx.type === 'Yatan' ? 'blue' : 'slate'}>{rx.type}</Badge>
                      {rx.priority !== 'Normal' && <Badge color="red">{rx.priority}</Badge>}
                      {rx.items.some(i => i.interaction) && <Badge color="orange">⚠ ETKİLEŞİM</Badge>}
                      <Badge color={statusColor(rx.status)}>{rx.status}</Badge>
                      {rx.medulaNo && <Badge color="green">MEDULA ✓</Badge>}
                    </div>
                    <p className="text-xs text-slate-600">{rx.items.map(i => i.name).join(' • ')}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{rx.dept} {rx.room ? `(${rx.room})` : ''} • {rx.doctor} • {rx.time}</p>
                    {rx.clinicalPharmNote && <p className="text-[10px] text-blue-600 mt-0.5 italic">🔔 Klinisyen Ecz. Notu: {rx.clinicalPharmNote.substring(0, 80)}...</p>}
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stok */}
      {tab === 'stok' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50 flex-none">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Package className="text-blue-500" size={16} />İlaç Stok Durumu</h3>
            <div className="relative">
              <Search className="absolute left-3 top-2 text-slate-400" size={14} />
              <input type="text" placeholder="İlaç ara..." value={stockSearch} onChange={e => setStockSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 w-48" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">İlaç / ATC Kodu</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Mevcut</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Min/Maks</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">SKT</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Özellikler</th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Durum</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-slate-500">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStock.map(s => (
                  <tr key={s.id} className={twMerge("hover:bg-slate-50", s.status === 'Kritik' || s.status === 'Stok Yok' ? 'bg-red-50/30' : '')}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {s.highAlert && <span title="Yüksek Uyarı İlaç" className="text-red-500 text-lg">⚠</span>}
                        <div>
                          <p className="font-medium text-slate-800">{s.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{s.atcCode} • {s.form} • Lot: {s.lot}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xl font-black ${s.currentStock <= s.minStock ? 'text-red-600' : 'text-slate-800'}`}>{s.currentStock}</span>
                      <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
                        <div className={`h-1 rounded-full ${s.currentStock <= s.minStock ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min((s.currentStock / s.maxStock) * 100, 100)}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-slate-500">{s.minStock} / {s.maxStock}</td>
                    <td className="py-3 px-4 text-center text-xs text-slate-500">{s.expiryDate}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {s.narcotic && <Badge color="red">Narkotik</Badge>}
                        {s.coldChain && <Badge color="cyan">Soğuk Zincir</Badge>}
                        {s.highAlert && <Badge color="orange">Yüksek Uyarı</Badge>}
                        {s.unitDose && <Badge color="purple">Birim Doz</Badge>}
                        {!s.narcotic && !s.coldChain && !s.highAlert && <span className="text-xs text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center"><Badge color={stockStatusColor(s.status)}>{s.status}</Badge></td>
                    <td className="py-3 px-4 text-right">
                      {s.currentStock <= s.minStock && (
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">Sipariş Ver</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Narkotik */}
      {tab === 'narkotik' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <Lock size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">Narkotik ve Psikotrop Madde Kayıt Defteri (KKM Yönetmeliği)</p>
              <p className="text-xs text-red-600 mt-1">Her çıkış/giriş 2 imza (eczacı + hemşire/doktor) ile belgelenmeli. Kayıplar Sağlık Bakanlığı'na bildirilmeli. Fiziksel sayım günlük yapılmalıdır.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Lock className="text-red-500" size={18} />Narkotik Hareket Kayıtları</h3>
              <button className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 flex items-center gap-1.5"><Plus size={12} />Yeni Kayıt</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Tarih/Saat</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">İlaç</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Hasta</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Uygulayan / Tanık</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">İşlem</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Kalan</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Doğrulama</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {narcoticEntries.map(n => (
                    <tr key={n.id} className={!n.verified ? 'bg-amber-50/50' : ''}>
                      <td className="py-3 px-4 font-mono text-xs"><div>{n.date}</div><div className="text-slate-500">{n.time}</div></td>
                      <td className="py-3 px-4"><p className="font-medium text-slate-800">{n.drug}</p><p className="text-xs text-slate-500">{n.dose}</p></td>
                      <td className="py-3 px-4 text-sm text-slate-700">{n.patient}</td>
                      <td className="py-3 px-4"><p className="text-xs text-slate-700">{n.nurse}</p><p className="text-[10px] text-slate-500">Tanık: {n.witness}</p></td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${n.action === 'Çıkış' ? 'bg-red-100 text-red-700' : n.action === 'Giriş' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{n.action}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-black text-slate-700">{n.remaining}</td>
                      <td className="py-3 px-4 text-center">
                        {n.verified ? (
                          <span className="text-emerald-600 font-bold text-xs">✓ Doğrulandı</span>
                        ) : (
                          <button onClick={() => setNarcoticEntries(prev => prev.map((e, i) => e.id === n.id ? { ...e, verified: true } : e))}
                            className="px-2 py-1 bg-amber-500 text-white rounded text-xs font-bold hover:bg-amber-600">İmzala</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Narkotik Dolap */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-3">Narkotik Dolap Sayımı (Son Kontrol: 07.04.2026 06:00)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { drug: 'Morfin 10mg Ampul', system: 16, physical: 16, ok: true },
                { drug: 'Fentanil 50mcg Ampul', system: 21, physical: 21, ok: true },
                { drug: 'Petidin 50mg/mL', system: 8, physical: 8, ok: true },
                { drug: 'Midazolam 15mg/3mL', system: 12, physical: 12, ok: true },
                { drug: 'Ketamin 500mg/10mL', system: 5, physical: 4, ok: false },
                { drug: 'Diazepam 10mg Ampul', system: 20, physical: 20, ok: true },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-xl border ${item.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-300'}`}>
                  <p className="text-xs font-bold text-slate-700">{item.drug}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500">Sistem</p>
                      <p className="font-black text-slate-800">{item.system}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500">Fiziksel</p>
                      <p className={`font-black ${item.ok ? 'text-emerald-700' : 'text-red-700'}`}>{item.physical}</p>
                    </div>
                    <span className={`text-lg ${item.ok ? 'text-emerald-500' : 'text-red-500'}`}>{item.ok ? '✓' : '⚠'}</span>
                  </div>
                  {!item.ok && <p className="text-[10px] text-red-600 font-bold mt-1">UYUMSUZLUK! Kayıp bildirim gerekli</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Antibiyotik Yönetimi */}
      {tab === 'stewardship' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-4">Antibiyotik Kullanımı — Birim Bazında (Son 7 Gün)</h4>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={abstewardshipData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="Carbapenem" fill="#ef4444" name="Karbapenem" radius={[2, 2, 0, 0]} key="carbapenem" />
                  <Bar dataKey="Glikopeptit" fill="#8b5cf6" name="Glikopeptit" radius={[2, 2, 0, 0]} key="glikopeptit" />
                  <Bar dataKey="Geniş_Spektrum" fill="#f59e0b" name="Geniş Spektrum" radius={[2, 2, 0, 0]} key="genis_spektrum" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-3">Antibiyotik Yönetim Danışma İstekleri</h4>
            <div className="space-y-3">
              {[
                { patient: 'Hatice Arslan (304-A)', drug: 'Vankomisin', reason: 'MRSA — Doz optimizasyonu (AUC/MIC tabanlı)', status: 'Onaylandı', pharmacist: 'Klinik Ecz. Can S.' },
                { patient: 'Ayşe Koç (YBÜ-03)', drug: 'Meropenem', reason: 'GSBL E.coli — Doz ve süre danışmanlığı', status: 'Onaylandı', pharmacist: 'Klinik Ecz. Can S.' },
                { patient: 'Mehmet Demir (Acil)', drug: 'Ceftriaxone → Upgrade?', reason: 'Sepsis — Eskalasyon değerlendirmesi', status: 'Bekliyor', pharmacist: '' },
              ].map((r, i) => (
                <div key={i} className={`p-3 rounded-xl border flex items-start justify-between ${r.status === 'Bekliyor' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{r.patient}</p>
                    <p className="text-xs text-slate-600">İlaç: <strong>{r.drug}</strong></p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.reason}</p>
                    {r.pharmacist && <p className="text-[10px] text-emerald-600">Yanıtlayan: {r.pharmacist}</p>}
                  </div>
                  <Badge color={r.status === 'Onaylandı' ? 'green' : 'amber'}>{r.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* IV Hazırlık */}
      {tab === 'iv' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Beaker className="text-blue-500" size={18} />IV Hazırlık Odası — Günlük İş Listesi</h4>
            <div className="space-y-3">
              {[
                { drug: 'Vankomisin 1g IV İnfüzyon', patient: 'Hatice Arslan', dept: '304-A', dilution: '200mL %0.9 NaCl', rate: '60 dk infüzyon', stability: '24 saat +4°C', prep: 'Ecz. Derya A.', status: 'Hazır', time: '07:30' },
                { drug: 'Meropenem 1g IV İnfüzyon', patient: 'Ayşe Koç', dept: 'YBÜ-03', dilution: '50mL %0.9 NaCl', rate: '30 dk infüzyon', stability: '6 saat oda ısısı', prep: 'Ecz. Derya A.', status: 'Hazır', time: '09:00' },
                { drug: 'Piperasilin-Tazobaktam 4.5g', patient: 'Selin Arslan', dept: 'Acil', dilution: '100mL %0.9 NaCl', rate: '30 dk infüzyon', stability: '12 saat oda ısısı', prep: '', status: 'Bekliyor', time: '10:45' },
                { drug: 'TPN (Total Parenteral Nütrisyon)', patient: 'Ayşe Koç', dept: 'YBÜ-03', dilution: 'Özel formülasyon (1500mL)', rate: '62.5 mL/saat', stability: '24 saat (kapalı)', prep: '', status: 'Hazırlanıyor', time: '11:00' },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-start justify-between ${item.status === 'Bekliyor' ? 'bg-amber-50 border-amber-200' : item.status === 'Hazırlanıyor' ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-800">{item.drug}</p>
                      <Badge color={item.status === 'Hazır' ? 'green' : item.status === 'Hazırlanıyor' ? 'blue' : 'amber'}>{item.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-600">{item.patient} — {item.dept} • {item.time}</p>
                    <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] text-slate-500">
                      <span>Dilüsyon: <strong>{item.dilution}</strong></span>
                      <span>Hız: <strong>{item.rate}</strong></span>
                      <span>Stabilite: <strong>{item.stability}</strong></span>
                    </div>
                    {item.prep && <p className="text-[10px] text-emerald-600 mt-1">Hazırlayan: {item.prep}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prescription Detail Modal */}
      <Modal open={!!selectedRx} onClose={() => setSelectedRx(null)} title={`Reçete Detayı — ${selectedRx?.id || ''}`} size="2xl">
        {selectedRx && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px] uppercase">Hasta</span><span className="font-bold">{selectedRx.patient} ({selectedRx.age} {selectedRx.gender})</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Birim / Oda</span><span className="font-bold">{selectedRx.dept} {selectedRx.room && `(${selectedRx.room})`}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Hekim</span><span className="font-bold">{selectedRx.doctor}</span></div>
              <div className="flex items-center gap-2">
                <Badge color={statusColor(selectedRx.status)}>{selectedRx.status}</Badge>
                {selectedRx.medulaNo && <Badge color="green">MEDULA ✓</Badge>}
              </div>
            </div>

            {selectedRx.items.some(i => i.interaction) && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                <ShieldAlert size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-orange-700">İlaç Etkileşimi Uyarısı</p>
                  {selectedRx.items.filter(i => i.interaction).map((item, idx) => (
                    <p key={idx} className="text-xs text-orange-600 mt-1">• <strong>{item.name}:</strong> {item.interactionNote}</p>
                  ))}
                </div>
              </div>
            )}

            {selectedRx.clinicalPharmNote && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
                <BookOpen size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-700">Klinik Eczacı Notu</p>
                  <p className="text-xs text-blue-600 mt-0.5">{selectedRx.clinicalPharmNote}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">İlaç Listesi</h4>
              <div className="space-y-2">
                {selectedRx.items.map((item, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${item.interaction ? 'bg-orange-50 border-orange-200' : item.stock <= 15 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <Pill size={16} className={item.interaction ? 'text-orange-500' : 'text-blue-500'} />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.dose} • {item.freq} • {item.route} • {item.duration}</p>
                        <span className="text-[9px] font-mono text-slate-400">ATC: {item.atcCode}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${item.stock <= 15 ? 'text-red-600' : 'text-slate-500'}`}>Stok: {item.stock}</p>
                      {item.interaction && <p className="text-[10px] text-orange-600 font-bold">⚠ Etkileşim</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedRx.notes && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-1">Hekim Notu</p>
                <p className="text-sm text-slate-700">{selectedRx.notes}</p>
              </div>
            )}

            {selectedRx.medulaNo && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-emerald-500" />
                  <p className="text-sm text-emerald-700">MEDULA Provizyon: <strong>{selectedRx.medulaNo}</strong></p>
                </div>
                {selectedRx.sutCode && <span className="text-xs font-mono text-emerald-600">SUT: {selectedRx.sutCode}</span>}
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-100 flex-wrap">
              {selectedRx.status === 'Bekliyor' && (
                <button onClick={() => handleStatusChange(selectedRx.id, 'Hazırlanıyor')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Pill size={14} />Hazırlamaya Başla</button>
              )}
              {selectedRx.status === 'Hazırlanıyor' && (
                <button onClick={() => handleStatusChange(selectedRx.id, 'Hazır')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 flex items-center gap-2"><CheckCircle2 size={14} />Hazırlandı</button>
              )}
              {selectedRx.status === 'Hazır' && (
                <button onClick={() => { handleStatusChange(selectedRx.id, 'Teslim Edildi'); setSelectedRx(null); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2"><Send size={14} />Teslim Et</button>
              )}
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} />Yazdır</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}