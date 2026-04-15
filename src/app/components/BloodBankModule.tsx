import React, { useState } from 'react';
import {
  Droplet, AlertTriangle, CheckCircle2, Plus, X, Send,
  Printer, Activity, RefreshCw, ChevronRight,
  Thermometer, Zap, Bell
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface BloodRequest {
  id: string; patient: string; tc: string; age: string; gender: string;
  dept: string; room: string; doctor: string; bloodType: string;
  product: string; units: number; urgent: boolean; mtpActive: boolean;
  status: 'İstem Alındı' | 'Crossmatch Bekliyor' | 'Crossmatch Yapılıyor' | 'Uygun Bulundu' | 'Hazırlandı' | 'Teslim Edildi' | 'Transfüzyon Başladı' | 'Tamamlandı' | 'Reddedildi';
  indication: string; hgb: string; plt: string; inr: string;
  crossMatchResult: string; antibodyScreen: string; directCoombs: string;
  irradiated: boolean; leukoreduced: boolean; washed: boolean;
  transfusionReactions: string; rxType: string;
  requestTime: string; requestDate: string;
  bedsideVerified: boolean; verifiedBy: string;
  notes: string; bagNo: string;
}

const bloodStock = [
  { type: 'A Rh(+)', whole: 12, rbc: 8, ffp: 15, plt: 4, cryo: 6, temp: { rbc: '2-6°C', ffp: '-18°C', plt: '20-24°C' } },
  { type: 'A Rh(-)', whole: 3, rbc: 2, ffp: 5, plt: 1, cryo: 2, temp: { rbc: '2-6°C', ffp: '-18°C', plt: '20-24°C' } },
  { type: 'B Rh(+)', whole: 8, rbc: 5, ffp: 10, plt: 3, cryo: 4, temp: { rbc: '2-6°C', ffp: '-18°C', plt: '20-24°C' } },
  { type: 'B Rh(-)', whole: 2, rbc: 1, ffp: 3, plt: 0, cryo: 1, temp: { rbc: '2-6°C', ffp: '-18°C', plt: '20-24°C' } },
  { type: 'AB Rh(+)', whole: 5, rbc: 3, ffp: 8, plt: 2, cryo: 3, temp: { rbc: '2-6°C', ffp: '-18°C', plt: '20-24°C' } },
  { type: 'AB Rh(-)', whole: 1, rbc: 0, ffp: 2, plt: 0, cryo: 0, temp: { rbc: '2-6°C', ffp: '-18°C', plt: '20-24°C' } },
  { type: '0 Rh(+)', whole: 15, rbc: 10, ffp: 18, plt: 5, cryo: 8, temp: { rbc: '2-6°C', ffp: '-18°C', plt: '20-24°C' } },
  { type: '0 Rh(-)', whole: 4, rbc: 2, ffp: 6, plt: 1, cryo: 2, temp: { rbc: '2-6°C', ffp: '-18°C', plt: '20-24°C' } },
];

const mockRequests: BloodRequest[] = [
  {
    id: 'TB-2026-001', patient: 'Zeynep Kaya', tc: '111***222', age: '62', gender: 'K',
    dept: 'Ameliyathane', room: 'Salon 1', doctor: 'Prof. Dr. Can Y.', bloodType: 'A Rh(+)',
    product: 'Eritrosit Süspansiyonu (ES)', units: 2, urgent: true, mtpActive: false,
    status: 'Crossmatch Yapılıyor',
    indication: 'CABG operasyonu — Pre-op hazırlık (intraop kullanım)',
    hgb: '9.2', plt: '245', inr: '1.05', crossMatchResult: '', antibodyScreen: 'Negatif', directCoombs: 'Negatif',
    irradiated: false, leukoreduced: true, washed: false,
    transfusionReactions: '', rxType: '',
    requestTime: '08:00', requestDate: '07.04.2026',
    bedsideVerified: false, verifiedBy: '',
    notes: 'Ameliyathane için hazır bulundurulacak. CMV negatif tercih edilsin.',
    bagNo: ''
  },
  {
    id: 'TB-2026-002', patient: 'Ayşe Koç', tc: '222***333', age: '78', gender: 'K',
    dept: 'Yoğun Bakım', room: 'YBÜ-03', doctor: 'Uzm. Dr. Ahmet K.', bloodType: 'AB Rh(+)',
    product: 'Eritrosit Süspansiyonu (ES)', units: 2, urgent: true, mtpActive: false,
    status: 'Hazırlandı',
    indication: 'Septik şok — Akut anemi (Hgb: 6.8 g/dL). Transfüzyon eşiği aşıldı.',
    hgb: '6.8', plt: '82', inr: '1.8', crossMatchResult: 'Uyumlu (IS/AHG)', antibodyScreen: 'Negatif', directCoombs: 'Negatif',
    irradiated: false, leukoreduced: true, washed: false,
    transfusionReactions: '', rxType: '',
    requestTime: '06:30', requestDate: '07.04.2026',
    bedsideVerified: false, verifiedBy: '',
    notes: 'Acil transfüzyon gerekli. Crossmatch tamamlandı. Bag hazırlandı.',
    bagNo: 'BAG-2026-1028'
  },
  {
    id: 'TB-2026-003', patient: 'Selin Arslan', tc: '333***444', age: '22', gender: 'K',
    dept: 'Acil Servis', room: 'Travma-1', doctor: 'Dr. Hakan Ç.', bloodType: '0 Rh(-)',
    product: 'Eritrosit Süspansiyonu (ES)', units: 4, urgent: true, mtpActive: true,
    status: 'Transfüzyon Başladı',
    indication: 'Masif Kanama Protokolü (MTP) — Trafik kazası, hemorajik şok',
    hgb: '7.5', plt: '110', inr: '1.5', crossMatchResult: 'Acil Uyum (O Rh- verildi)', antibodyScreen: 'Bekliyor', directCoombs: 'Bekliyor',
    irradiated: false, leukoreduced: false, washed: false,
    transfusionReactions: '', rxType: '',
    requestTime: '09:50', requestDate: '07.04.2026',
    bedsideVerified: true, verifiedBy: 'Dr. Hakan Ç.',
    notes: 'MTP Aktive edildi. İlk 4 ünite O Rh(-) acil verildi. ES:TDP:TRS = 1:1:1 protokolü uygulanıyor.',
    bagNo: 'BAG-2026-1031'
  },
  {
    id: 'TB-2026-004', patient: 'Hasan Koç', tc: '444***555', age: '55', gender: 'E',
    dept: 'Hematoloji', room: '5-A', doctor: 'Uzm. Dr. Derya K.', bloodType: '0 Rh(+)',
    product: 'Trombosit Süspansiyonu (Aferez)', units: 1, urgent: false, mtpActive: false,
    status: 'İstem Alındı',
    indication: 'Kemoterapi sonrası trombositopeni (PLT: 12.000/µL). Kanama riski yüksek.',
    hgb: '10.2', plt: '12', inr: '1.2', crossMatchResult: '', antibodyScreen: '', directCoombs: '',
    irradiated: true, leukoreduced: true, washed: false,
    transfusionReactions: '', rxType: '',
    requestTime: '11:00', requestDate: '07.04.2026',
    bedsideVerified: false, verifiedBy: '',
    notes: 'Aferez TRS tercih edilsin. Irradiye + lökosit filtreli ürün gerekli (immünosüpresif hasta).',
    bagNo: ''
  },
  {
    id: 'TB-2026-005', patient: 'Fatma Şahin', tc: '555***666', age: '50', gender: 'K',
    dept: 'Genel Cerrahi', room: '303-A', doctor: 'Op. Dr. Sinan M.', bloodType: 'B Rh(+)',
    product: 'Eritrosit Süspansiyonu (ES)', units: 1, urgent: false, mtpActive: false,
    status: 'Tamamlandı',
    indication: 'Post-op anemi (Hgb: 8.5 g/dL)',
    hgb: '8.5', plt: '268', inr: '1.1', crossMatchResult: 'Uyumlu', antibodyScreen: 'Negatif', directCoombs: 'Negatif',
    irradiated: false, leukoreduced: true, washed: false,
    transfusionReactions: 'Reaksiyon gözlenmedi',
    rxType: '', requestTime: '08:00', requestDate: '06.04.2026',
    bedsideVerified: true, verifiedBy: 'Hem. Ayşe D.',
    notes: 'Transfüzyon komplikasyonsuz tamamlandı. Post-transfüzyon Hgb: 10.1 g/dL.',
    bagNo: 'BAG-2026-1020'
  },
];

const mtpChecklist = [
  { item: 'Hematolog / Kan Bankası bilgilendirildi', checked: true },
  { item: 'ES:TDP:TRS = 1:1:1 protokolü aktive edildi', checked: true },
  { item: 'İlk 4 ünite O Rh(-) ES hazırlandı', checked: true },
  { item: 'Kalsiyum replasmanı planlandı (0.1 mmol/L kan)', checked: false },
  { item: 'Tromboelastografi (TEG/ROTEM) değerlendirmesi', checked: false },
  { item: 'Traneksamik asit verildi (1g IV bolüs)', checked: true },
  { item: 'Fibrinojen düzeyi kontrol edildi', checked: false },
  { item: 'Vücut ısısı takibi (normothermi hedef)', checked: true },
  { item: 'Asidoz düzeltmesi (pH hedef >7.35)', checked: false },
];

const tempMonitorData = [
  { time: '06:00', rbcFridge: 4.2, pltAgit: 22.1, ffpFreezer: -19.5 },
  { time: '07:00', rbcFridge: 4.0, pltAgit: 22.3, ffpFreezer: -19.8 },
  { time: '08:00', rbcFridge: 4.1, pltAgit: 22.0, ffpFreezer: -18.9 },
  { time: '09:00', rbcFridge: 4.3, pltAgit: 22.4, ffpFreezer: -19.2 },
  { time: '10:00', rbcFridge: 4.2, pltAgit: 22.2, ffpFreezer: -19.6 },
  { time: '11:00', rbcFridge: 4.0, pltAgit: 22.5, ffpFreezer: -20.1 },
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

export function BloodBankModule() {
  const [tab, setTab] = useState<'istek' | 'stok' | 'mtp' | 'sicaklik' | 'bilesenler'>('istek');
  const [requests, setRequests] = useState(mockRequests);
  const [selectedReq, setSelectedReq] = useState<BloodRequest | null>(null);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [mtpItems, setMtpItems] = useState(mtpChecklist);

  const statusColor = (s: string) => {
    if (['İstem Alındı', 'Crossmatch Bekliyor'].includes(s)) return 'amber';
    if (s === 'Crossmatch Yapılıyor') return 'blue';
    if (['Uygun Bulundu', 'Hazırlandı'].includes(s)) return 'purple';
    if (['Teslim Edildi', 'Transfüzyon Başladı'].includes(s)) return 'cyan';
    if (s === 'Tamamlandı') return 'green';
    return 'red';
  };

  const activeRequests = requests.filter(r => !['Tamamlandı', 'Reddedildi'].includes(r.status));
  const urgentCount = activeRequests.filter(r => r.urgent).length;
  const mtpActive = requests.filter(r => r.mtpActive).length;
  const totalRBC = bloodStock.reduce((s, b) => s + b.rbc, 0);
  const totalPLT = bloodStock.reduce((s, b) => s + b.plt, 0);

  const handleStatusChange = (id: string, newStatus: BloodRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReq?.id === id) setSelectedReq(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleBedsideVerify = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, bedsideVerified: true, verifiedBy: 'Hem. Aktif Kullanıcı' } : r));
    if (selectedReq?.id === id) setSelectedReq(prev => prev ? { ...prev, bedsideVerified: true } : null);
  };

  const tabs = [
    { id: 'istek' as const, label: 'Kan İstekleri' },
    { id: 'stok' as const, label: 'Stok Durumu' },
    { id: 'mtp' as const, label: `MTP Protokolü${mtpActive > 0 ? ` (${mtpActive})` : ''}` },
    { id: 'sicaklik' as const, label: 'Sıcaklık Takibi' },
    { id: 'bilesenler' as const, label: 'Bileşen Hazırlama' },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kan Bankası & Transfüzyon Merkezi</h2>
          <p className="text-sm text-slate-500">Crossmatch, bileşen hazırlama, MTP protokolü, yatak başı doğrulama, sıcaklık zinciri</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {mtpActive > 0 && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-300 rounded-lg text-xs font-bold text-red-700 animate-pulse" onClick={() => setTab('mtp')}>
              <Zap size={12} /> MTP AKTİF
            </button>
          )}
          <button onClick={() => setShowNewRequest(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 flex items-center gap-2 shadow-sm">
            <Plus size={16} /> Yeni Kan İsteği
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
        <div className="bg-red-50 p-3 rounded-xl border border-red-200"><p className="text-[10px] font-bold text-red-700 uppercase">Aktif İstek</p><p className="text-2xl font-black text-red-600">{activeRequests.length}</p></div>
        <div className={twMerge("p-3 rounded-xl border", urgentCount > 0 ? "bg-red-50 border-red-300 animate-pulse" : "bg-white border-slate-200")}>
          <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1"><AlertTriangle size={12} /> Acil</p>
          <p className="text-2xl font-black text-red-600">{urgentCount}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200"><p className="text-[10px] font-bold text-blue-700 uppercase">Toplam ES</p><p className="text-2xl font-black text-blue-600">{totalRBC} ünite</p></div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><p className="text-[10px] font-bold text-amber-700 uppercase">Toplam TRS</p><p className="text-2xl font-black text-amber-600">{totalPLT} ünite</p></div>
        <div className={twMerge("p-3 rounded-xl border", mtpActive > 0 ? "bg-red-50 border-red-400 animate-pulse" : "bg-emerald-50 border-emerald-200")}>
          <p className="text-[10px] font-bold uppercase flex items-center gap-1"><Zap size={12} className={mtpActive > 0 ? 'text-red-600' : 'text-emerald-600'} /> MTP</p>
          <p className={`text-2xl font-black ${mtpActive > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{mtpActive > 0 ? `${mtpActive} AKTİF` : 'Normal'}</p>
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

      {/* Kan İstekleri */}
      {tab === 'istek' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-auto">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Activity className="text-red-500" size={18} /> Kan İstek Listesi</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {requests.map(r => (
              <div key={r.id} onClick={() => setSelectedReq(r)}
                className={twMerge("p-4 hover:bg-red-50/30 transition-colors cursor-pointer",
                  r.mtpActive ? "bg-red-50/50" : r.urgent && !['Tamamlandı', 'Reddedildi'].includes(r.status) ? "bg-amber-50/20" : "")}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono font-bold text-slate-500">{r.id}</span>
                      <span className="text-sm font-bold text-slate-800">{r.patient}</span>
                      {r.mtpActive && <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded animate-pulse font-black">MTP</span>}
                      {r.urgent && !r.mtpActive && <Badge color="red">ACİL</Badge>}
                      <Badge color={statusColor(r.status)}>{r.status}</Badge>
                      <span className="text-[10px] font-bold text-red-700 border border-red-200 bg-red-50 px-1.5 py-0.5 rounded">{r.bloodType}</span>
                    </div>
                    <p className="text-sm text-slate-600">{r.product} × {r.units} ünite</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-slate-500">Hgb: <strong>{r.hgb} g/dL</strong></span>
                      <span className="text-[10px] text-slate-500">PLT: <strong>{r.plt}×10³</strong></span>
                      <span className="text-[10px] text-slate-500">INR: <strong>{r.inr}</strong></span>
                      {r.irradiated && <Badge color="purple">Irradiye</Badge>}
                      {r.leukoreduced && <Badge color="cyan">Lökosit Filtreli</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{r.dept} ({r.room}) • {r.doctor} • {r.requestDate} {r.requestTime}</p>
                    <p className="text-[10px] text-slate-400 italic">{r.indication}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {r.bedsideVerified && <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">✓ Yatak Doğrulama</span>}
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stok */}
      {tab === 'stok' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-auto p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><Droplet size={18} className="text-red-500" /> Kan Ürünleri Stok Tablosu</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-slate-500 text-xs uppercase">Kan Grubu</th>
                  <th className="text-center py-3 px-4 font-bold text-slate-500 text-xs uppercase">Tam Kan</th>
                  <th className="text-center py-3 px-4 font-bold text-slate-500 text-xs uppercase">ES</th>
                  <th className="text-center py-3 px-4 font-bold text-slate-500 text-xs uppercase">TDP/FFP</th>
                  <th className="text-center py-3 px-4 font-bold text-slate-500 text-xs uppercase">TRS</th>
                  <th className="text-center py-3 px-4 font-bold text-slate-500 text-xs uppercase">Kriyopresipit.</th>
                  <th className="text-left py-3 px-4 font-bold text-slate-500 text-xs uppercase">Saklama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bloodStock.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-black text-slate-800 text-base">
                      <Droplet size={14} className="inline text-red-400 mr-1.5" />{b.type}
                    </td>
                    {[b.whole, b.rbc, b.ffp, b.plt, b.cryo].map((v, j) => (
                      <td key={j} className="py-3 px-4 text-center">
                        <span className={twMerge("text-lg font-black", v === 0 ? "text-red-600" : v <= 2 ? "text-amber-600" : "text-slate-800")}>{v}</span>
                        {v === 0 && <span className="block text-[9px] text-red-500 font-bold">STOK YOK</span>}
                        {v > 0 && v <= 2 && <span className="block text-[9px] text-amber-500 font-bold">KRİTİK</span>}
                      </td>
                    ))}
                    <td className="py-3 px-4">
                      <div className="text-[9px] text-slate-500 space-y-0.5">
                        <div className="flex items-center gap-1"><Thermometer size={9} className="text-blue-400" /> ES: {b.temp.rbc}</div>
                        <div className="flex items-center gap-1"><Thermometer size={9} className="text-purple-400" /> FFP: {b.temp.ffp}</div>
                        <div className="flex items-center gap-1"><Thermometer size={9} className="text-amber-400" /> TRS: {b.temp.plt}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold">
                <tr>
                  <td className="py-3 px-4 text-slate-700 font-black">TOPLAM</td>
                  {[
                    bloodStock.reduce((s, b) => s + b.whole, 0),
                    totalRBC,
                    bloodStock.reduce((s, b) => s + b.ffp, 0),
                    totalPLT,
                    bloodStock.reduce((s, b) => s + b.cryo, 0),
                  ].map((v, j) => (
                    <td key={j} className="py-3 px-4 text-center text-slate-800 text-lg font-black">{v}</td>
                  ))}
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* MTP */}
      {tab === 'mtp' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className={`bg-red-50 border-2 border-red-400 rounded-2xl p-5 ${mtpActive > 0 ? 'animate-pulse' : ''}`}>
            <div className="flex items-center gap-3 mb-3">
              <Zap size={24} className="text-red-600" />
              <div>
                <h3 className="font-black text-red-700 text-lg">Masif Transfüzyon Protokolü (MTP)</h3>
                <p className="text-sm text-red-600">ES:TDP:TRS = 1:1:1 oranı • Traneksamik asit • Kalsiyum replasmanı</p>
              </div>
              {mtpActive > 0 && <span className="ml-auto bg-red-600 text-white px-4 py-2 rounded-xl font-black text-sm animate-pulse">⚡ AKTİF — {mtpActive} Hasta</span>}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-xl p-3 border border-red-200 text-center">
                <p className="text-xs font-bold text-red-700">ES (Eritrosit)</p>
                <p className="text-3xl font-black text-red-600">4</p>
                <p className="text-xs text-slate-500">ünite hazır</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-amber-200 text-center">
                <p className="text-xs font-bold text-amber-700">TDP (Plazma)</p>
                <p className="text-3xl font-black text-amber-600">4</p>
                <p className="text-xs text-slate-500">ünite çözündürülüyor</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-purple-200 text-center">
                <p className="text-xs font-bold text-purple-700">TRS (Trombosit)</p>
                <p className="text-3xl font-black text-purple-600">1</p>
                <p className="text-xs text-slate-500">aferez hazır</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-3">MTP Kontrol Listesi — Selin Arslan (Acil Servis)</h4>
            <div className="space-y-2">
              {mtpItems.map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${item.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <input type="checkbox" checked={item.checked}
                    onChange={() => setMtpItems(prev => prev.map((p, j) => j === i ? { ...p, checked: !p.checked } : p))}
                    className="w-5 h-5 rounded accent-emerald-500 flex-shrink-0" />
                  <span className={`text-sm ${item.checked ? 'text-emerald-700 font-semibold line-through-none' : 'text-slate-700'}`}>{item.item}</span>
                  {item.checked && <CheckCircle2 size={16} className="text-emerald-500 ml-auto flex-shrink-0" />}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 flex items-center gap-2">
                <RefreshCw size={14} /> Yeni MTP Turu Başlat
              </button>
              <button className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm font-semibold hover:bg-slate-700">
                MTP Sonlandır
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sıcaklık */}
      {tab === 'sicaklik' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Thermometer className="text-blue-500" size={18} /> Soğuk Zincir Takibi (Son 6 Saat)</h4>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tempMonitorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[-25, 30]} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line key="rbcFridge" type="monotone" dataKey="rbcFridge" stroke="#3b82f6" name="ES Buzdolabı (°C)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line key="pltAgit" type="monotone" dataKey="pltAgit" stroke="#f59e0b" name="TRS Ajitasyon (°C)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line key="ffpFreezer" type="monotone" dataKey="ffpFreezer" stroke="#8b5cf6" name="FFP Derin Dondurucu (°C)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'ES Buzdolabı', temp: '4.2°C', target: '2–6°C', ok: true, icon: '🔵' },
              { name: 'TRS Ajitasyon Inkübatörü', temp: '22.2°C', target: '20–24°C', ok: true, icon: '🟡' },
              { name: 'FFP Derin Dondurucu', temp: '-19.6°C', target: '≤-18°C', ok: true, icon: '🟣' },
            ].map((d, i) => (
              <div key={i} className={`p-4 rounded-xl border ${d.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{d.icon}</span>
                  <h4 className="font-bold text-slate-700 text-sm">{d.name}</h4>
                </div>
                <p className={`text-3xl font-black ${d.ok ? 'text-emerald-700' : 'text-red-700'}`}>{d.temp}</p>
                <p className="text-xs text-slate-500 mt-1">Hedef: {d.target}</p>
                <p className={`text-xs font-bold mt-1 ${d.ok ? 'text-emerald-600' : 'text-red-600'}`}>{d.ok ? '✓ Normal Aralıkta' : '⚠ ALARM!'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bileşen Hazırlama */}
      {tab === 'bilesenler' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-4">Kan Bileşeni Hazırlama İş Akışı</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  product: 'Eritrosit Süspansiyonu (ES)',
                  steps: ['Tam kandan santrifüj (3000 rpm/10dk)', 'Plazma ayrımı', 'Additive solüsyon ekleme (SAGM)', 'Lökosit filtrasyonu (opsiyonel)', 'Etiketleme & QC', 'Soğuk depo (2-6°C, 42 gün)'],
                  color: 'red'
                },
                {
                  product: 'Taze Donmuş Plazma (TDP/FFP)',
                  steps: ['Santrifüj sonrası plazma fraksiyonu', '6 saat içinde dondurma (-18°C)', 'Çözdürme: 37°C su banyosu (30dk)', 'Çözündükten sonra 4 saat içinde kullanım', 'ABO uyumluluğu zorunlu'],
                  color: 'amber'
                },
                {
                  product: 'Trombosit Süspansiyonu (TRS)',
                  steps: ['Aferez cihazı ile toplama (donor)', 'Lökosit filtrasyonu', 'İrradiasyon (immünosüpresif için)', 'Ajitasyon inkübatör (20-24°C)', '5 gün kullanım süresi', 'ABO uyumu tercih edilir'],
                  color: 'purple'
                },
                {
                  product: 'Kriyopresipitat',
                  steps: ['TDP yavaş çözdürme (+4°C, 12-18 saat)', 'Santrifüj ve süpernatan uzaklaştırma', 'Kalan 10-15mL plazma peleti', '-18°C dondurma (12 ay)', 'Fibrinojen, FVIII, vWF, FXIII içerir'],
                  color: 'blue'
                },
              ].map((p, i) => (
                <div key={i} className={`bg-${p.color}-50 border border-${p.color}-200 rounded-xl p-4`}>
                  <h5 className={`font-bold text-${p.color}-700 mb-3`}>{p.product}</h5>
                  <ol className="space-y-1">
                    {p.steps.map((s, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className={`w-5 h-5 rounded-full bg-${p.color}-200 text-${p.color}-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px]`}>{j + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Request Detail Modal */}
      <Modal open={!!selectedReq} onClose={() => setSelectedReq(null)} title={`Kan İsteği — ${selectedReq?.id || ''}`} size="2xl">
        {selectedReq && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px] uppercase">Hasta</span><span className="font-bold">{selectedReq.patient} ({selectedReq.age} {selectedReq.gender})</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Kan Grubu</span><span className="font-black text-red-600 text-xl">{selectedReq.bloodType}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Ürün / Ünite</span><span className="font-bold">{selectedReq.product} × {selectedReq.units}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Bag No</span><span className="font-mono font-bold">{selectedReq.bagNo || '—'}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Durum</span><Badge color={statusColor(selectedReq.status)}>{selectedReq.status}</Badge></div>
            </div>

            {selectedReq.mtpActive && (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 flex items-center gap-3">
                <Zap size={20} className="text-red-600" />
                <div>
                  <p className="font-black text-red-700">MTP (Masif Transfüzyon Protokolü) AKTİF</p>
                  <p className="text-xs text-red-600">ES:TDP:TRS = 1:1:1 • Traneksamik asit verilmeli</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-center">
                <p className="text-xs text-red-600">Hgb</p>
                <p className="text-xl font-black text-red-700">{selectedReq.hgb} <span className="text-xs font-normal">g/dL</span></p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                <p className="text-xs text-blue-600">PLT</p>
                <p className="text-xl font-black text-blue-700">{selectedReq.plt} <span className="text-xs font-normal">×10³</span></p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                <p className="text-xs text-amber-600">INR</p>
                <p className="text-xl font-black text-amber-700">{selectedReq.inr}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <p className="text-xs text-slate-600">Crossmatch</p>
                <p className="text-sm font-bold text-slate-800 mt-1">{selectedReq.crossMatchResult || 'Bekliyor'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                <p className="text-xs font-bold text-slate-500 mb-1">Antikor Tarama</p>
                <p className="font-bold">{selectedReq.antibodyScreen || 'Bekliyor'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-sm">
                <p className="text-xs font-bold text-slate-500 mb-1">Direkt Coombs</p>
                <p className="font-bold">{selectedReq.directCoombs || 'Bekliyor'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {selectedReq.irradiated && <span className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold">☢ Irradiye Ürün Gerekli</span>}
              {selectedReq.leukoreduced && <span className="bg-cyan-100 text-cyan-700 border border-cyan-200 px-3 py-1.5 rounded-lg text-xs font-bold">🔬 Lökosit Filtreli</span>}
              {selectedReq.washed && <span className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold">💧 Yıkanmış ES</span>}
            </div>

            <div><h4 className="text-sm font-bold text-slate-700 mb-1">Endikasyon</h4><p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedReq.indication}</p></div>
            {selectedReq.notes && <div><h4 className="text-sm font-bold text-slate-700 mb-1">Not</h4><p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedReq.notes}</p></div>}

            {/* Bedside Verification */}
            {['Hazırlandı', 'Teslim Edildi', 'Transfüzyon Başladı'].includes(selectedReq.status) && (
              <div className={`rounded-xl p-4 border ${selectedReq.bedsideVerified ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <h4 className="text-sm font-bold mb-2">🏥 Yatak Başı Doğrulama (Bedside Verification)</h4>
                {selectedReq.bedsideVerified ? (
                  <p className="text-sm text-emerald-700"><CheckCircle2 size={14} className="inline mr-1" />Doğrulandı — {selectedReq.verifiedBy}</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-700">Transfüzyon öncesi hasta kimliği ve bag etiket eşleşmesi yapılmalıdır.</p>
                    <button onClick={() => handleBedsideVerify(selectedReq.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">
                      ✓ Doğrulama Tamamlandı
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedReq.transfusionReactions && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <p className="text-sm font-bold text-emerald-700">Transfüzyon Reaksiyon Takibi</p>
                <p className="text-sm text-emerald-700 mt-0.5">{selectedReq.transfusionReactions}</p>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-100 flex-wrap">
              {selectedReq.status === 'İstem Alındı' && <button onClick={() => handleStatusChange(selectedReq.id, 'Crossmatch Yapılıyor')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Crossmatch Başlat</button>}
              {selectedReq.status === 'Crossmatch Yapılıyor' && <button onClick={() => handleStatusChange(selectedReq.id, 'Hazırlandı')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">Uyumlu — Hazırla</button>}
              {selectedReq.status === 'Hazırlandı' && <button onClick={() => handleStatusChange(selectedReq.id, 'Teslim Edildi')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">Teslim Et</button>}
              {selectedReq.status === 'Teslim Edildi' && <button onClick={() => handleStatusChange(selectedReq.id, 'Transfüzyon Başladı')} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-700">Transfüzyon Başladı</button>}
              {selectedReq.status === 'Transfüzyon Başladı' && <button onClick={() => { handleStatusChange(selectedReq.id, 'Tamamlandı'); setSelectedReq(null); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2"><CheckCircle2 size={14} />Tamamlandı</button>}
              <button className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 flex items-center gap-2"><AlertTriangle size={14} />Reaksiyon Bildir</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} />Yazdır</button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Request Modal */}
      <Modal open={showNewRequest} onClose={() => setShowNewRequest(false)} title="Yeni Kan İsteği Formu">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Hasta</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Hasta adı veya TC" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Birim / Oda</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Örn: Dahiliye 301-A" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Kan Grubu</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">{bloodStock.map((b, i) => <option key={i}>{b.type}</option>)}</select></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Ürün Türü</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>Eritrosit Süspansiyonu (ES)</option>
                <option>Taze Donmuş Plazma (TDP)</option>
                <option>Trombosit Süspansiyonu (TRS)</option>
                <option>Kriyopresipitat</option>
                <option>Tam Kan</option>
              </select></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Ünite</label><input type="number" defaultValue={1} min={1} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Hgb (g/dL)</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="7.5" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">PLT (×10³)</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="45" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">INR</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="1.2" /></div>
          </div>
          <div><label className="text-xs font-semibold text-slate-600 block mb-1">Transfüzyon Endikasyonu</label>
            <textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none" placeholder="Transfüzyon endikasyonunu açıklayınız..." /></div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="w-4 h-4 rounded" /><span>Irradiye ürün gerekli (immünosüpresif hasta)</span></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="w-4 h-4 rounded" /><span>Lökosit filtreli ürün</span></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="w-4 h-4 rounded accent-red-500" /><span className="font-semibold text-red-600">ACİL — Masif Transfüzyon Protokolü Aktive Et</span></label>
          </div>
          <div className="flex gap-2 pt-2 border-t border-slate-100 justify-end">
            <button onClick={() => setShowNewRequest(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold">İptal</button>
            <button onClick={() => setShowNewRequest(false)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 flex items-center gap-2"><Send size={14} />İstek Gönder</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}