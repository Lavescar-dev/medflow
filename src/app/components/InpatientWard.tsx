import React, { useState } from 'react';
import {
  BedDouble, User, Activity, FileText, Pill, Stethoscope, Clock,
  ShieldAlert, Search, Filter, MoreHorizontal, UserCheck, X,
  CheckCircle2, Plus, Heart, Thermometer, Wind, AlertTriangle,
  ArrowRight, Edit3, Trash2, Eye, Save, Send, Printer, Download,
  ClipboardList, Syringe, RefreshCw, Calendar, ChevronRight, Shield,
  Calculator, FileSignature, ArrowUpRight, LogOut
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface InPatient {
  id: number; room: string; bed: string; name: string; tc: string; age: string; gender: string;
  doctor: string; nurse: string; status: 'Stabil' | 'Kritik' | 'Post-Op' | 'Taburcu Planlanan' | 'Boş' | 'İzole';
  admitDate: string; dayCount: number; dx: string; icdCode: string; risk: 'Düşük' | 'Orta' | 'Yüksek';
  dietType: string; ivAccess: boolean; o2: boolean; isolation: boolean;
  vitals: { sys: number; dia: number; pulse: number; temp: number; spo2: number; resp: number };
  orders: { time: string; desc: string; type: 'ilac' | 'tetkik' | 'bakim'; done: boolean }[];
  notes: string;
  newsScore: number; medulaYatis: string; epikrizReady: boolean;
  fallRisk: boolean; pressureRisk: boolean; dvtProphylaxis: boolean;
}

const mockPatients: InPatient[] = [
  { id: 1, room: '301', bed: 'A', name: 'Mustafa Yılmaz', tc: '111***222', age: '58', gender: 'E', doctor: 'Uzm. Dr. Ahmet K.', nurse: 'Hmş. Fatma K.', status: 'Stabil', admitDate: '04.04.2026', dayCount: 3, dx: 'Pnömoni', icdCode: 'J18.9', risk: 'Orta', dietType: 'Normal', ivAccess: true, o2: false, isolation: false, vitals: { sys: 128, dia: 82, pulse: 78, temp: 36.8, spo2: 96, resp: 16 }, orders: [
    { time: '08:00', desc: 'Seftriakson 1g IV', type: 'ilac', done: true },
    { time: '12:00', desc: 'Seftriakson 1g IV', type: 'ilac', done: false },
    { time: '10:00', desc: 'Hemogram + CRP kontrolü', type: 'tetkik', done: true },
    { time: '14:00', desc: 'Vital bulgu takibi', type: 'bakim', done: false },
  ], notes: 'Ateş düşme eğiliminde. CRP geriledi. Oral geçiş değerlendirilecek.', newsScore: 2, medulaYatis: 'MYB-2026-040401', epikrizReady: false, fallRisk: false, pressureRisk: false, dvtProphylaxis: true },
  { id: 2, room: '301', bed: 'B', name: 'Ali Çelik', tc: '222***333', age: '45', gender: 'E', doctor: 'Uzm. Dr. Ayşe D.', nurse: 'Hmş. Fatma K.', status: 'Taburcu Planlanan', admitDate: '02.04.2026', dayCount: 5, dx: 'Akut gastroenterit', icdCode: 'K52.9', risk: 'Düşük', dietType: 'Yumuşak', ivAccess: false, o2: false, isolation: false, vitals: { sys: 118, dia: 74, pulse: 72, temp: 36.5, spo2: 98, resp: 14 }, orders: [
    { time: '09:00', desc: 'Taburcu ilaçları hazırla', type: 'ilac', done: false },
    { time: '10:00', desc: 'Epikriz yazımı', type: 'bakim', done: false },
  ], notes: 'Oral alımı iyi. Taburculuk kriterleri karşılanıyor.', newsScore: 0, medulaYatis: 'MYB-2026-040201', epikrizReady: true, fallRisk: false, pressureRisk: false, dvtProphylaxis: false },
  { id: 3, room: '302', bed: 'A', name: 'Zeynep Kaya', tc: '333***444', age: '72', gender: 'K', doctor: 'Uzm. Dr. Ahmet K.', nurse: 'Hmş. Aysel T.', status: 'Kritik', admitDate: '06.04.2026', dayCount: 1, dx: 'KOAH Alevlenme', icdCode: 'J44.1', risk: 'Yüksek', dietType: 'Diyabetik', ivAccess: true, o2: true, isolation: false, vitals: { sys: 148, dia: 92, pulse: 102, temp: 37.4, spo2: 88, resp: 26 }, orders: [
    { time: '06:00', desc: 'Metilprednizolon 40mg IV', type: 'ilac', done: true },
    { time: '08:00', desc: 'Nebül (Salbutamol+İpratropium)', type: 'ilac', done: true },
    { time: '10:00', desc: 'AKG kontrolü', type: 'tetkik', done: false },
    { time: '12:00', desc: 'Nebül (2.doz)', type: 'ilac', done: false },
    { time: '14:00', desc: 'Göğüs Hast. konsültasyonu', type: 'bakim', done: false },
  ], notes: 'SpO2 düşük. O2 3L/dk nazal. YBÜ değerlendirilecek.', newsScore: 8, medulaYatis: 'MYB-2026-040601', epikrizReady: false, fallRisk: true, pressureRisk: true, dvtProphylaxis: true },
  { id: 4, room: '302', bed: 'B', name: '', tc: '', age: '', gender: '', doctor: '', nurse: '', status: 'Boş', admitDate: '', dayCount: 0, dx: '', icdCode: '', risk: 'Düşük', dietType: '', ivAccess: false, o2: false, isolation: false, vitals: { sys: 0, dia: 0, pulse: 0, temp: 0, spo2: 0, resp: 0 }, orders: [], notes: '', newsScore: 0, medulaYatis: '', epikrizReady: false, fallRisk: false, pressureRisk: false, dvtProphylaxis: false },
  { id: 5, room: '303', bed: 'A', name: 'Fatma Şahin', tc: '555***666', age: '50', gender: 'K', doctor: 'Op. Dr. Sinan M.', nurse: 'Hmş. Derya S.', status: 'Post-Op', admitDate: '07.04.2026', dayCount: 0, dx: 'Lap. Kolesistektomi', icdCode: 'K80.2', risk: 'Orta', dietType: 'Aç (Post-Op)', ivAccess: true, o2: false, isolation: false, vitals: { sys: 122, dia: 78, pulse: 82, temp: 36.9, spo2: 97, resp: 16 }, orders: [
    { time: '10:00', desc: 'Diklofenak 75mg IM', type: 'ilac', done: true },
    { time: '12:00', desc: 'Oral sıvı başla', type: 'bakim', done: false },
    { time: '14:00', desc: 'Pansuman kontrolü', type: 'bakim', done: false },
    { time: '16:00', desc: 'Mobilizasyon', type: 'bakim', done: false },
  ], notes: 'Op komplikasyonsuz. VAS: 4/10. Gaz-gaita bekleniyor.', newsScore: 1, medulaYatis: 'MYB-2026-040701', epikrizReady: false, fallRisk: true, pressureRisk: false, dvtProphylaxis: true },
  { id: 6, room: '303', bed: 'B', name: 'Mehmet Demir', tc: '666***777', age: '61', gender: 'E', doctor: 'Uzm. Dr. Ayşe D.', nurse: 'Hmş. Derya S.', status: 'Stabil', admitDate: '05.04.2026', dayCount: 2, dx: 'Hipertansif Kriz', icdCode: 'I16.1', risk: 'Orta', dietType: 'Tuzsuz', ivAccess: true, o2: false, isolation: false, vitals: { sys: 142, dia: 88, pulse: 76, temp: 36.4, spo2: 97, resp: 14 }, orders: [
    { time: '08:00', desc: 'Amlodipin 10mg PO', type: 'ilac', done: true },
    { time: '08:00', desc: 'Co-Diovan 160/12.5mg PO', type: 'ilac', done: true },
    { time: '12:00', desc: 'TA takibi (4 saatte bir)', type: 'bakim', done: false },
  ], notes: 'TA regülasyona giriyor. Hedef <140/90.', newsScore: 1, medulaYatis: 'MYB-2026-040501', epikrizReady: false, fallRisk: false, pressureRisk: false, dvtProphylaxis: false },
  { id: 7, room: '304', bed: 'A', name: 'Hatice Arslan', tc: '777***888', age: '65', gender: 'K', doctor: 'Uzm. Dr. Ahmet K.', nurse: 'Hmş. Aysel T.', status: 'İzole', admitDate: '03.04.2026', dayCount: 4, dx: 'MRSA Pnömonisi', icdCode: 'J15.2', risk: 'Yüksek', dietType: 'Normal', ivAccess: true, o2: true, isolation: true, vitals: { sys: 135, dia: 85, pulse: 88, temp: 37.8, spo2: 93, resp: 20 }, orders: [
    { time: '08:00', desc: 'Vankomisin 1g IV', type: 'ilac', done: true },
    { time: '20:00', desc: 'Vankomisin 1g IV', type: 'ilac', done: false },
    { time: '10:00', desc: 'Vankomisin düzeyi', type: 'tetkik', done: true },
  ], notes: 'İzolasyon devam. Enfeksiyon kontrol bilgilendirildi.', newsScore: 5, medulaYatis: 'MYB-2026-040301', epikrizReady: false, fallRisk: false, pressureRisk: true, dvtProphylaxis: true },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', orange: 'bg-orange-50 text-orange-700 border-orange-100' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${wide ? 'max-w-5xl' : 'max-w-3xl'} w-full max-h-[90vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function NEWSCalc({ vitals }: { vitals: InPatient['vitals'] }) {
  const calcResp = (r: number) => r <= 8 ? 3 : r <= 11 ? 1 : r <= 20 ? 0 : r <= 24 ? 2 : 3;
  const calcSpo2 = (s: number) => s <= 91 ? 3 : s <= 93 ? 2 : s <= 95 ? 1 : 0;
  const calcSys = (s: number) => s <= 90 ? 3 : s <= 100 ? 2 : s <= 110 ? 1 : s <= 219 ? 0 : 3;
  const calcPulse = (p: number) => p <= 40 ? 3 : p <= 50 ? 1 : p <= 90 ? 0 : p <= 110 ? 1 : p <= 130 ? 2 : 3;
  const calcTemp = (t: number) => t <= 35 ? 3 : t <= 36 ? 1 : t <= 38 ? 0 : t <= 39 ? 1 : 2;
  const total = calcResp(vitals.resp) + calcSpo2(vitals.spo2) + calcSys(vitals.sys) + calcPulse(vitals.pulse) + calcTemp(vitals.temp);
  const risk = total >= 7 ? 'Yüksek' : total >= 5 ? 'Orta' : total >= 1 ? 'Düşük' : 'Çok Düşük';
  const riskColor = total >= 7 ? 'text-red-600 bg-red-100' : total >= 5 ? 'text-amber-600 bg-amber-100' : total >= 1 ? 'text-blue-600 bg-blue-100' : 'text-emerald-600 bg-emerald-100';
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${riskColor}`}>NEWS:{total} ({risk})</span>;
}

export function InpatientWard() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<InPatient | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState('genel');
  const [showDischarge, setShowDischarge] = useState(false);
  const [showMedulaYatis, setShowMedulaYatis] = useState(false);
  const [showNEWSCalc, setShowNEWSCalc] = useState(false);
  const [medulaStatus, setMedulaStatus] = useState<'idle' | 'sending' | 'ok'>('idle');
  const [dischargeChecklist, setDischargeChecklist] = useState<Record<string, boolean>>({});

  const statusColor = (s: string) => s === 'Kritik' ? 'red' : s === 'Post-Op' ? 'purple' : s === 'Taburcu Planlanan' ? 'amber' : s === 'İzole' ? 'orange' : s === 'Boş' ? 'slate' : 'blue';
  const riskColor = (r: string) => r === 'Yüksek' ? 'red' : r === 'Orta' ? 'amber' : 'green';
  const occupied = patients.filter(p => p.status !== 'Boş');
  const critical = patients.filter(p => p.status === 'Kritik' || p.newsScore >= 7).length;
  const dischargeReady = patients.filter(p => p.status === 'Taburcu Planlanan').length;

  const toggleOrder = (patientId: number, orderIdx: number) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, orders: p.orders.map((o, i) => i === orderIdx ? { ...o, done: !o.done } : o) } : p));
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => prev ? { ...prev, orders: prev.orders.map((o, i) => i === orderIdx ? { ...o, done: !o.done } : o) } : null);
    }
  };

  const sendMedulaYatis = () => { setMedulaStatus('sending'); setTimeout(() => setMedulaStatus('ok'), 2000); };

  const dischargeItems = [
    'Epikriz tamamlandı', 'Taburcu ilaçları hazırlandı', 'Hasta/yakını bilgilendirildi',
    'Kontrol randevusu verildi', 'Diyet bilgilendirmesi yapıldı', 'Pansuman/bakım eğitimi verildi',
    'MEDULA taburcu bildirimi gönderildi', 'e-Nabız epikriz kaydı yapıldı', 'Hemşire taburcu notu yazıldı',
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Yatan Hasta / Servis Yönetimi</h2>
          <p className="text-sm text-slate-500">NEWS skorlama, MEDULA yatış bildirimi, epikriz, taburcu planı • Dahiliye & Cerrahi Servisi</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowNEWSCalc(true)} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700">
            <Calculator size={14} /> NEWS Hesapla
          </button>
          <button onClick={() => setShowMedulaYatis(true)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">
            <Shield size={14} /> MEDULA Yatış
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-none">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200"><p className="text-[10px] font-bold text-blue-600 uppercase">Dolu / Kapasite</p><p className="text-xl font-black text-blue-700 mt-0.5">{occupied.length}<span className="text-sm font-medium text-blue-400">/{patients.length}</span></p></div>
        <div className="bg-red-50 p-3 rounded-xl border border-red-200"><p className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> Kritik/NEWS≥7</p><p className="text-xl font-black text-red-700 mt-0.5">{critical}</p></div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><p className="text-[10px] font-bold text-amber-600 uppercase">Taburcu Planlanan</p><p className="text-xl font-black text-amber-700 mt-0.5">{dischargeReady}</p></div>
        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200"><p className="text-[10px] font-bold text-orange-600 uppercase">İzolasyon</p><p className="text-xl font-black text-orange-700 mt-0.5">{patients.filter(p => p.isolation).length}</p></div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200"><p className="text-[10px] font-bold text-purple-600 uppercase">Post-Op</p><p className="text-xl font-black text-purple-700 mt-0.5">{patients.filter(p => p.status === 'Post-Op').length}</p></div>
      </div>

      {/* Bed Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {patients.map(p => (
            <div key={p.id} onClick={() => { if (p.status !== 'Boş') { setSelectedPatient(p); setActiveDetailTab('genel'); } }}
              className={twMerge(
                "bg-white rounded-xl border-2 shadow-sm p-4 transition-all",
                p.status === 'Boş' ? 'border-dashed border-slate-300 opacity-50' :
                p.status === 'Kritik' || p.newsScore >= 7 ? 'border-red-300 cursor-pointer hover:shadow-md' :
                p.status === 'İzole' ? 'border-orange-300 cursor-pointer hover:shadow-md' :
                'border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-200'
              )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs px-2 py-1 rounded bg-slate-800 text-white">{p.room}-{p.bed}</span>
                  {p.status !== 'Boş' && <Badge color={statusColor(p.status)}>{p.status}</Badge>}
                  {p.fallRisk && <span className="text-[9px] bg-red-100 text-red-600 px-1 rounded font-bold">Düşme</span>}
                  {p.isolation && <span className="text-[9px] bg-orange-100 text-orange-600 px-1 rounded font-bold">İzole</span>}
                </div>
                {p.status !== 'Boş' && <span className="text-[10px] text-slate-400">{p.dayCount}. gün</span>}
              </div>

              {p.status === 'Boş' ? (
                <p className="text-sm text-slate-400 text-center py-4">Boş Yatak</p>
              ) : (
                <>
                  <h4 className="font-bold text-sm text-slate-800">{p.name} <span className="text-xs font-normal text-slate-500">{p.age}{p.gender}</span></h4>
                  <p className="text-[10px] text-blue-600 font-medium"><span className="font-mono">{p.icdCode}</span> — {p.dx}</p>

                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    {[
                      { label: 'TA', value: `${p.vitals.sys}/${p.vitals.dia}`, flag: p.vitals.sys > 160 || p.vitals.sys < 90 },
                      { label: 'SpO2', value: `${p.vitals.spo2}%`, flag: p.vitals.spo2 < 94 },
                      { label: 'Nb', value: `${p.vitals.pulse}`, flag: p.vitals.pulse > 110 },
                      { label: 'Ateş', value: `${p.vitals.temp}°C`, flag: p.vitals.temp > 38 },
                    ].map((v, i) => (
                      <div key={i} className={`text-center p-1 rounded text-[9px] ${v.flag ? 'bg-red-100 text-red-700 font-bold' : 'bg-slate-50 text-slate-600'}`}>
                        <span className="block text-slate-400">{v.label}</span>{v.value}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <NEWSCalc vitals={p.vitals} />
                    <div className="flex gap-1">
                      {p.ivAccess && <span className="text-[8px] bg-blue-50 text-blue-600 px-1 rounded">IV</span>}
                      {p.o2 && <span className="text-[8px] bg-cyan-50 text-cyan-600 px-1 rounded">O2</span>}
                      {p.dvtProphylaxis && <span className="text-[8px] bg-purple-50 text-purple-600 px-1 rounded">DVT</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span><Stethoscope size={10} className="inline" /> {p.doctor}</span>
                    <span>{p.orders.filter(o => o.done).length}/{p.orders.length} görev</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Patient Detail Modal */}
      <Modal open={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`${selectedPatient?.room}-${selectedPatient?.bed} • ${selectedPatient?.name || ''}`} wide>
        {selectedPatient && (
          <div className="space-y-5">
            {/* Banner */}
            <div className="bg-slate-800 rounded-xl p-4 text-white">
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                    <Badge color={statusColor(selectedPatient.status)}>{selectedPatient.status}</Badge>
                    <Badge color={riskColor(selectedPatient.risk)}>Risk: {selectedPatient.risk}</Badge>
                  </div>
                  <p className="text-xs text-slate-300">{selectedPatient.age}{selectedPatient.gender} • TC: {selectedPatient.tc} • Yatış: {selectedPatient.admitDate} ({selectedPatient.dayCount}. gün)</p>
                  <p className="text-xs text-blue-400 mt-0.5"><span className="font-mono">{selectedPatient.icdCode}</span> — {selectedPatient.dx}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">MEDULA: {selectedPatient.medulaYatis}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'TA', value: `${selectedPatient.vitals.sys}/${selectedPatient.vitals.dia}`, flag: selectedPatient.vitals.sys > 160 || selectedPatient.vitals.sys < 90 },
                    { label: 'SpO2', value: `${selectedPatient.vitals.spo2}%`, flag: selectedPatient.vitals.spo2 < 94 },
                    { label: 'NEWS', value: selectedPatient.newsScore, flag: selectedPatient.newsScore >= 7 },
                    { label: 'Nb', value: selectedPatient.vitals.pulse, flag: selectedPatient.vitals.pulse > 110 },
                    { label: 'Ateş', value: `${selectedPatient.vitals.temp}°C`, flag: selectedPatient.vitals.temp > 38 },
                    { label: 'SS', value: selectedPatient.vitals.resp, flag: selectedPatient.vitals.resp > 22 },
                  ].map((v, i) => (
                    <div key={i} className={`p-1.5 rounded text-center text-xs ${v.flag ? 'bg-red-500/20 border border-red-500/30' : 'bg-slate-700/50'}`}>
                      <p className="text-[9px] text-slate-400">{v.label}</p>
                      <p className={`font-bold ${v.flag ? 'text-red-400' : ''}`}>{v.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Alerts */}
            {(selectedPatient.fallRisk || selectedPatient.pressureRisk || selectedPatient.isolation) && (
              <div className="flex gap-2 flex-wrap">
                {selectedPatient.fallRisk && <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-red-700"><AlertTriangle size={14} /> Düşme Riski</div>}
                {selectedPatient.pressureRisk && <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-amber-700"><AlertTriangle size={14} /> Bası Yarası Riski</div>}
                {selectedPatient.isolation && <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-orange-700"><ShieldAlert size={14} /> İzolasyon — Temas Önlemleri</div>}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'genel', label: 'Genel / Notlar' },
                { id: 'orderlar', label: `Orderlar (${selectedPatient.orders.length})` },
                { id: 'entegrasyon', label: 'MEDULA / Entegrasyon' },
                { id: 'taburcu', label: 'Taburcu / Epikriz' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                  className={twMerge("px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap",
                    activeDetailTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                  )}>{tab.label}</button>
              ))}
            </div>

            {activeDetailTab === 'genel' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 block">Hekim</span><span className="font-bold text-slate-800">{selectedPatient.doctor}</span></div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 block">Hemşire</span><span className="font-bold text-slate-800">{selectedPatient.nurse}</span></div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 block">Diyet</span><span className="font-bold text-slate-800">{selectedPatient.dietType}</span></div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 block">Profilaksi</span><span className="font-bold text-slate-800">{selectedPatient.dvtProphylaxis ? 'DVT Profilaksisi Aktif' : '—'}</span></div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Klinik Notlar</h4>
                  <textarea rows={3} defaultValue={selectedPatient.notes}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}

            {activeDetailTab === 'orderlar' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-700">Günlük Orderlar</h4>
                  <span className="text-xs text-slate-500">{selectedPatient.orders.filter(o => o.done).length}/{selectedPatient.orders.length} tamamlandı</span>
                </div>
                {selectedPatient.orders.sort((a, b) => a.time.localeCompare(b.time)).map((o, idx) => (
                  <div key={idx} className={twMerge("flex items-center gap-3 p-3 rounded-lg border", o.done ? "bg-emerald-50/50 border-emerald-100 opacity-60" : "bg-white border-slate-200")}>
                    <input type="checkbox" checked={o.done} onChange={() => toggleOrder(selectedPatient.id, idx)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                    <span className={twMerge("text-xs font-bold px-2 py-0.5 rounded",
                      o.type === 'ilac' ? 'bg-emerald-100 text-emerald-700' : o.type === 'tetkik' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    )}>{o.time}</span>
                    <span className={twMerge("text-sm flex-1", o.done ? "line-through text-slate-400" : "text-slate-700")}>{o.desc}</span>
                    <Badge color={o.type === 'ilac' ? 'green' : o.type === 'tetkik' ? 'blue' : 'purple'}>
                      {o.type === 'ilac' ? 'İlaç' : o.type === 'tetkik' ? 'Tetkik' : 'Bakım'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {activeDetailTab === 'entegrasyon' && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-blue-600" />
                      <span className="text-sm font-bold text-blue-800">MEDULA Yatış Bildirimi</span>
                    </div>
                    <button onClick={sendMedulaYatis} disabled={medulaStatus === 'sending'}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
                      {medulaStatus === 'sending' ? <><RefreshCw size={12} className="animate-spin" /> Gönderiliyor...</> :
                       medulaStatus === 'ok' ? <><CheckCircle2 size={12} /> Bildirildi</> :
                       <><Send size={12} /> Yatış Bildir</>}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600">Yatış No:</span> <span className="font-bold">{selectedPatient.medulaYatis}</span></div>
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600">Yatış Tarihi:</span> <span className="font-bold">{selectedPatient.admitDate}</span></div>
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600">Tanı (ICD):</span> <span className="font-bold">{selectedPatient.icdCode}</span></div>
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600">Provizyon Tipi:</span> <span className="font-bold">SGK — Yatan Hasta</span></div>
                  </div>
                  {medulaStatus === 'ok' && (
                    <div className="mt-2 bg-emerald-50 text-emerald-700 text-xs p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> MEDULA yatış bildirimi başarılı. SUT kodları aktive edildi.
                    </div>
                  )}
                </div>
                <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={18} className="text-cyan-600" />
                    <span className="text-sm font-bold text-cyan-800">e-Nabız Entegrasyonu</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button className="bg-white p-2 rounded border border-cyan-100 hover:bg-cyan-100 text-left"><span className="text-cyan-600 block">e-Nabız Epikriz</span><span className="font-bold">Gönderilmedi</span></button>
                    <button className="bg-white p-2 rounded border border-cyan-100 hover:bg-cyan-100 text-left"><span className="text-cyan-600 block">e-Reçete</span><span className="font-bold">Aktif</span></button>
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'taburcu' && (
              <div className="space-y-4">
                {/* Epikriz */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><FileSignature size={16} className="text-blue-500" /> Epikriz</h4>
                  <textarea rows={6} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={`HASTA: ${selectedPatient.name} (${selectedPatient.tc})\nYATIŞ TARİHİ: ${selectedPatient.admitDate}\nTANI: ${selectedPatient.icdCode} — ${selectedPatient.dx}\n\nÖZGEÇMİŞ: —\n\nYATIŞ SEBEBİ VE SEYIR:\n${selectedPatient.notes}\n\nTEDAVİ:\n${selectedPatient.orders.map(o => `- ${o.desc}`).join('\n')}\n\nTABURCU TEDAVİ: —\nKONTROL: 1 hafta sonra`} />
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Save size={12} /> Epikriz Kaydet</button>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Printer size={12} /> Yazdır</button>
                    <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Send size={12} /> e-Nabız Gönder</button>
                  </div>
                </div>

                {/* Discharge Checklist */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2"><LogOut size={16} /> Taburculuk Kontrol Listesi</h4>
                  {dischargeItems.map((item, i) => (
                    <label key={i} className="flex items-center gap-2 py-1.5 cursor-pointer border-b border-amber-100 last:border-0">
                      <input type="checkbox" checked={dischargeChecklist[item] || false}
                        onChange={e => setDischargeChecklist({ ...dischargeChecklist, [item]: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded" />
                      <span className="text-xs text-amber-800">{item}</span>
                    </label>
                  ))}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-amber-600">{Object.values(dischargeChecklist).filter(Boolean).length}/{dischargeItems.length} tamamlandı</span>
                    <button disabled={Object.values(dischargeChecklist).filter(Boolean).length < dischargeItems.length}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Taburcu Et
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* NEWS Calculator Modal */}
      <Modal open={showNEWSCalc} onClose={() => setShowNEWSCalc(false)} title="NEWS (National Early Warning Score) Hesaplayıcı">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Yatan hasta erken uyarı skoru — Royal College of Physicians NEWS2 tabanlı</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50"><tr>
                <th className="py-2 px-2 text-left font-semibold text-slate-500">Parametre</th>
                <th className="py-2 px-1 text-center font-bold text-red-600">3</th>
                <th className="py-2 px-1 text-center font-bold text-amber-600">2</th>
                <th className="py-2 px-1 text-center font-bold text-yellow-600">1</th>
                <th className="py-2 px-1 text-center font-bold text-emerald-600">0</th>
                <th className="py-2 px-1 text-center font-bold text-yellow-600">1</th>
                <th className="py-2 px-1 text-center font-bold text-amber-600">2</th>
                <th className="py-2 px-1 text-center font-bold text-red-600">3</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="py-1.5 px-2 font-medium">SS (/dk)</td><td className="text-center">≤8</td><td></td><td className="text-center">9-11</td><td className="text-center">12-20</td><td></td><td className="text-center">21-24</td><td className="text-center">≥25</td></tr>
                <tr><td className="py-1.5 px-2 font-medium">SpO2 (%)</td><td className="text-center">≤91</td><td className="text-center">92-93</td><td className="text-center">94-95</td><td className="text-center">≥96</td><td></td><td></td><td></td></tr>
                <tr><td className="py-1.5 px-2 font-medium">Sistolik TA</td><td className="text-center">≤90</td><td className="text-center">91-100</td><td className="text-center">101-110</td><td className="text-center">111-219</td><td></td><td></td><td className="text-center">≥220</td></tr>
                <tr><td className="py-1.5 px-2 font-medium">Nabız</td><td className="text-center">≤40</td><td></td><td className="text-center">41-50</td><td className="text-center">51-90</td><td className="text-center">91-110</td><td className="text-center">111-130</td><td className="text-center">≥131</td></tr>
                <tr><td className="py-1.5 px-2 font-medium">Ateş (°C)</td><td className="text-center">≤35.0</td><td></td><td className="text-center">35.1-36.0</td><td className="text-center">36.1-38.0</td><td className="text-center">38.1-39.0</td><td className="text-center">≥39.1</td><td></td></tr>
                <tr><td className="py-1.5 px-2 font-medium">GKS</td><td className="text-center">&lt;12</td><td className="text-center">12-13</td><td className="text-center">14</td><td className="text-center">15</td><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-1.5">
            <p><span className="font-bold text-emerald-600">0:</span> Rutin takip (12 saatte bir)</p>
            <p><span className="font-bold text-blue-600">1-4:</span> Düşük risk — 4-6 saatte bir vital</p>
            <p><span className="font-bold text-amber-600">5-6:</span> Orta risk — Saatlik vital, klinik değerlendirme</p>
            <p><span className="font-bold text-red-600">≥7:</span> Yüksek risk — Acil müdahale, YBÜ değerlendirmesi, sürekli monitör</p>
          </div>
        </div>
      </Modal>

      {/* MEDULA Yatış Modal */}
      <Modal open={showMedulaYatis} onClose={() => setShowMedulaYatis(false)} title="MEDULA Yatış Bildirim Formu">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">TC Kimlik No</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="***" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Provizyon Tipi</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"><option>Normal</option><option>Acil</option><option>İş Kazası</option><option>Trafik Kazası</option></select>
            </div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Yatış Tanısı (ICD-10)</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Ör: J18.9" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Klinik / Servis</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"><option>Dahiliye</option><option>Genel Cerrahi</option><option>Ortopedi</option><option>KVC</option><option>Göğüs Hastalıkları</option></select>
            </div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Yatış Tarihi</label><input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" defaultValue="2026-04-07" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Oda / Yatak</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Ör: 301-A" /></div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button onClick={() => setShowMedulaYatis(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold">İptal</button>
            <button onClick={() => setShowMedulaYatis(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Send size={14} /> MEDULA'ya Bildir</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
