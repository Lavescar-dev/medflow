import React, { useState } from 'react';
import {
  Activity, AlertTriangle, AlertCircle, Clock, User, Search, Plus, Filter,
  HeartPulse, Stethoscope, ArrowRight, X, CheckCircle2, FileText, Pill,
  Send, Edit3, Trash2, BedDouble, RefreshCw, Phone, Syringe, Heart,
  Thermometer, Wind, MapPin, ChevronRight, Eye, Save, ArrowUpRight,
  Shield, Calculator, Clipboard, Timer, Radio, Zap
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface ERPatient {
  id: number; name: string; tc: string; age: string; gender: string;
  triage: 'Kırmızı' | 'Sarı' | 'Yeşil' | 'Siyah';
  complaint: string; arrivalTime: string; waitMin: number;
  doctor: string; area: string; status: 'Muayenede' | 'Bekliyor' | 'Tedavide' | 'Gözlemde' | 'Sevk' | 'Taburcu';
  vitals: { sys: number; dia: number; pulse: number; temp: number; spo2: number; gcs: number; resp: number };
  notes: string; arrivalType: '112' | 'Kendi' | 'Nakil';
  orders: string[]; diagnosis: string;
  newsScore: number; esiLevel: number;
  ekatId: string; medulaProvision: string;
}

const mockPatients: ERPatient[] = [
  { id: 1, name: 'Ahmet Yılmaz', tc: '111***222', age: '45', gender: 'E', triage: 'Kırmızı', complaint: 'Göğüs ağrısı, dispne, terleme', arrivalTime: '10:05', waitMin: 10, doctor: 'Dr. Hakan Çelik', area: 'Resüsitasyon', status: 'Tedavide', vitals: { sys: 180, dia: 110, pulse: 112, temp: 36.8, spo2: 91, gcs: 15, resp: 24 }, notes: 'Akut koroner sendrom şüphesi. EKG: ST elevasyonu V1-V4.', arrivalType: '112', orders: ['Troponin', 'EKG', 'PA AC Grafisi', 'D-Dimer'], diagnosis: 'I21.0 - Akut anterior MI', newsScore: 9, esiLevel: 1, ekatId: 'EKAT-2026-04071005', medulaProvision: 'PRV-ACL-001' },
  { id: 2, name: 'Selin Arslan', tc: '222***333', age: '22', gender: 'K', triage: 'Sarı', complaint: 'Trafik kazası, karın ağrısı', arrivalTime: '09:50', waitMin: 25, doctor: 'Dr. Zeynep Yıldız', area: 'Travma Odası', status: 'Tedavide', vitals: { sys: 100, dia: 65, pulse: 108, temp: 36.5, spo2: 96, gcs: 15, resp: 20 }, notes: 'Araç içi kaza. Batın USG: Serbest sıvı (+).', arrivalType: '112', orders: ['Hemogram', 'Cross-Match', 'Batın BT', 'Pelvis grafisi'], diagnosis: 'S36.1 - Dalak yaralanması', newsScore: 6, esiLevel: 2, ekatId: 'EKAT-2026-04070950', medulaProvision: 'PRV-ACL-002' },
  { id: 3, name: 'İbrahim Kara', tc: '333***444', age: '68', gender: 'E', triage: 'Sarı', complaint: 'Şuur bulanıklığı, sol güçsüzlük', arrivalTime: '09:40', waitMin: 35, doctor: 'Dr. Hakan Çelik', area: 'Sarı Alan 1', status: 'Muayenede', vitals: { sys: 195, dia: 105, pulse: 88, temp: 37.0, spo2: 95, gcs: 12, resp: 16 }, notes: 'SVO? Semptom ~2 saat. Nöroloji acil konsültasyon.', arrivalType: 'Kendi', orders: ['Beyin BT (acil)', 'Hemogram', 'Koagülasyon'], diagnosis: '', newsScore: 7, esiLevel: 2, ekatId: 'EKAT-2026-04070940', medulaProvision: '' },
  { id: 4, name: 'Deniz Aydın', tc: '444***555', age: '12', gender: 'E', triage: 'Yeşil', complaint: 'Ateş (39°C), kusma, ishal', arrivalTime: '09:30', waitMin: 45, doctor: '', area: 'Yeşil Alan (Çocuk)', status: 'Bekliyor', vitals: { sys: 100, dia: 60, pulse: 120, temp: 39.1, spo2: 97, gcs: 15, resp: 22 }, notes: '', arrivalType: 'Kendi', orders: [], diagnosis: '', newsScore: 4, esiLevel: 4, ekatId: 'EKAT-2026-04070930', medulaProvision: '' },
  { id: 5, name: 'Melek Demir', tc: '555***666', age: '35', gender: 'K', triage: 'Yeşil', complaint: 'Boğaz ağrısı, öksürük, ateş', arrivalTime: '09:15', waitMin: 60, doctor: 'Dr. Ali Rıza', area: 'Yeşil Alan 2', status: 'Muayenede', vitals: { sys: 120, dia: 75, pulse: 82, temp: 37.8, spo2: 98, gcs: 15, resp: 16 }, notes: 'Farenjit. Antibiyotik başlandı.', arrivalType: 'Kendi', orders: ['Hemogram', 'CRP'], diagnosis: 'J02.9 - Akut farenjit', newsScore: 1, esiLevel: 4, ekatId: 'EKAT-2026-04070915', medulaProvision: 'PRV-ACL-005' },
  { id: 6, name: 'Hüseyin Öztürk', tc: '666***777', age: '55', gender: 'E', triage: 'Sarı', complaint: 'Ani şiddetli baş ağrısı', arrivalTime: '10:20', waitMin: 5, doctor: '', area: 'Sarı Alan 2', status: 'Bekliyor', vitals: { sys: 170, dia: 100, pulse: 92, temp: 36.6, spo2: 97, gcs: 15, resp: 18 }, notes: '', arrivalType: 'Kendi', orders: [], diagnosis: '', newsScore: 4, esiLevel: 2, ekatId: 'EKAT-2026-04071020', medulaProvision: '' },
  { id: 7, name: 'Ayşe Koç', tc: '777***888', age: '78', gender: 'K', triage: 'Sarı', complaint: 'Nefes darlığı, bilateral ödem', arrivalTime: '08:30', waitMin: 100, doctor: 'Dr. Zeynep Yıldız', area: 'Gözlem', status: 'Gözlemde', vitals: { sys: 155, dia: 90, pulse: 96, temp: 36.4, spo2: 89, gcs: 15, resp: 26 }, notes: 'KKY alevlenme. IV furosemid. O2 tedavisi.', arrivalType: 'Kendi', orders: ['Hemogram', 'BNP', 'PA AC', 'EKG'], diagnosis: 'I50.0 - KKY', newsScore: 8, esiLevel: 2, ekatId: 'EKAT-2026-04070830', medulaProvision: 'PRV-ACL-007' },
  { id: 8, name: 'Oğuz Can', tc: '888***999', age: '29', gender: 'E', triage: 'Yeşil', complaint: 'El parmak kesisi', arrivalTime: '08:00', waitMin: 120, doctor: 'Dr. Ali Rıza', area: 'Müdahale', status: 'Taburcu', vitals: { sys: 120, dia: 80, pulse: 72, temp: 36.5, spo2: 99, gcs: 15, resp: 14 }, notes: 'Sütür atıldı. TAT yapıldı.', arrivalType: 'Kendi', orders: [], diagnosis: 'S61.0 - Parmak açık yarası', newsScore: 0, esiLevel: 5, ekatId: 'EKAT-2026-04070800', medulaProvision: 'PRV-ACL-008' },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', orange: 'bg-orange-50 text-orange-700 border-orange-100',
  };
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

// NEWS (National Early Warning Score) Calculator
function NEWSCalculator({ vitals, onClose }: { vitals: ERPatient['vitals']; onClose: () => void }) {
  const calcResp = (r: number) => r <= 8 ? 3 : r <= 11 ? 1 : r <= 20 ? 0 : r <= 24 ? 2 : 3;
  const calcSpo2 = (s: number) => s <= 91 ? 3 : s <= 93 ? 2 : s <= 95 ? 1 : 0;
  const calcSys = (s: number) => s <= 90 ? 3 : s <= 100 ? 2 : s <= 110 ? 1 : s <= 219 ? 0 : 3;
  const calcPulse = (p: number) => p <= 40 ? 3 : p <= 50 ? 1 : p <= 90 ? 0 : p <= 110 ? 1 : p <= 130 ? 2 : 3;
  const calcTemp = (t: number) => t <= 35 ? 3 : t <= 36 ? 1 : t <= 38 ? 0 : t <= 39 ? 1 : 2;
  const calcGCS = (g: number) => g === 15 ? 0 : g >= 14 ? 1 : g >= 12 ? 2 : 3;

  const scores = [
    { param: 'Solunum Hızı', value: vitals.resp, score: calcResp(vitals.resp) },
    { param: 'SpO2', value: `${vitals.spo2}%`, score: calcSpo2(vitals.spo2) },
    { param: 'Sistolik TA', value: vitals.sys, score: calcSys(vitals.sys) },
    { param: 'Nabız', value: vitals.pulse, score: calcPulse(vitals.pulse) },
    { param: 'Ateş', value: `${vitals.temp}°C`, score: calcTemp(vitals.temp) },
    { param: 'GKS', value: vitals.gcs, score: calcGCS(vitals.gcs) },
  ];
  const total = scores.reduce((s, x) => s + x.score, 0);
  const risk = total >= 7 ? 'Yüksek' : total >= 5 ? 'Orta-Yüksek' : total >= 1 ? 'Düşük' : 'Çok Düşük';
  const riskColor = total >= 7 ? 'red' : total >= 5 ? 'amber' : total >= 1 ? 'blue' : 'green';
  const action = total >= 7 ? 'Acil tıbbi müdahale. Yoğun bakım değerlendirmesi. Saatlik vital takibi.' : total >= 5 ? 'Acil klinik değerlendirme. En az saatlik vital takibi.' : total >= 1 ? '4-6 saatte bir vital takibi.' : 'Rutin takip yeterli.';

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr>
            <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Parametre</th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Değer</th>
            <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Skor</th>
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {scores.map(s => (
              <tr key={s.param}>
                <td className="py-2 px-3 font-medium text-slate-700">{s.param}</td>
                <td className="py-2 px-3 text-center text-slate-600">{s.value}</td>
                <td className="py-2 px-3 text-center">
                  <span className={`px-2 py-0.5 rounded font-bold text-xs ${s.score >= 3 ? 'bg-red-100 text-red-700' : s.score >= 2 ? 'bg-amber-100 text-amber-700' : s.score >= 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>{s.score}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={`p-4 rounded-xl border-2 text-center ${riskColor === 'red' ? 'bg-red-50 border-red-300' : riskColor === 'amber' ? 'bg-amber-50 border-amber-300' : riskColor === 'blue' ? 'bg-blue-50 border-blue-300' : 'bg-emerald-50 border-emerald-300'}`}>
        <p className="text-xs text-slate-500 uppercase tracking-wider">NEWS Toplam Skor</p>
        <p className="text-4xl font-black mt-1">{total}</p>
        <p className={`text-sm font-bold mt-1 ${riskColor === 'red' ? 'text-red-700' : riskColor === 'amber' ? 'text-amber-700' : riskColor === 'blue' ? 'text-blue-700' : 'text-emerald-700'}`}>Risk: {risk}</p>
        <p className="text-xs text-slate-500 mt-2">{action}</p>
      </div>
      <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Kapat</button>
    </div>
  );
}

export function EmergencyRoom() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<ERPatient | null>(null);
  const [areaFilter, setAreaFilter] = useState('Tümü');
  const [searchText, setSearchText] = useState('');
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [showBlueCode, setShowBlueCode] = useState(false);
  const [blueCodeActive, setBlueCodeActive] = useState(false);
  const [showNEWS, setShowNEWS] = useState(false);
  const [showTriageCalc, setShowTriageCalc] = useState(false);
  const [showEKAT, setShowEKAT] = useState(false);
  const [showMassCasualty, setShowMassCasualty] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('klinik');
  const [ekatStatus, setEkatStatus] = useState<'idle' | 'sending' | 'ok'>('idle');
  const [medulaStatus, setMedulaStatus] = useState<'idle' | 'checking' | 'ok'>('idle');

  // New patient form
  const [newTriage, setNewTriage] = useState<'Kırmızı' | 'Sarı' | 'Yeşil'>('Sarı');
  const [newName, setNewName] = useState('');
  const [newComplaint, setNewComplaint] = useState('');
  const [newArrival, setNewArrival] = useState<'112' | 'Kendi' | 'Nakil'>('Kendi');

  // ESI Triage calc state
  const [esiQ1, setEsiQ1] = useState(false); // Life threatening?
  const [esiQ2, setEsiQ2] = useState(false); // High risk?
  const [esiResources, setEsiResources] = useState(2);
  const [esiVitalsOK, setEsiVitalsOK] = useState(true);

  const filtered = patients.filter(p => {
    if (areaFilter !== 'Tümü') {
      if (areaFilter === 'Kırmızı' && p.triage !== 'Kırmızı') return false;
      if (areaFilter === 'Sarı' && p.triage !== 'Sarı') return false;
      if (areaFilter === 'Yeşil' && p.triage !== 'Yeşil') return false;
      if (areaFilter === 'Gözlem' && p.status !== 'Gözlemde') return false;
    }
    if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const redCount = patients.filter(p => p.triage === 'Kırmızı' && p.status !== 'Taburcu').length;
  const yellowCount = patients.filter(p => p.triage === 'Sarı' && p.status !== 'Taburcu').length;
  const greenCount = patients.filter(p => p.triage === 'Yeşil' && p.status !== 'Taburcu').length;
  const avgWait = patients.filter(p => p.status !== 'Taburcu').length > 0 ?
    Math.round(patients.filter(p => p.status !== 'Taburcu').reduce((s, p) => s + p.waitMin, 0) / patients.filter(p => p.status !== 'Taburcu').length) : 0;

  const handleBlueCode = () => { setBlueCodeActive(true); setShowBlueCode(true); };
  const handleStatusChange = (id: number, newStatus: ERPatient['status']) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    if (selectedPatient?.id === id) setSelectedPatient(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleAddPatient = () => {
    if (!newName) return;
    const newP: ERPatient = {
      id: Date.now(), name: newName, tc: '000***000', age: '—', gender: '—',
      triage: newTriage, complaint: newComplaint, arrivalTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      waitMin: 0, doctor: '', area: newTriage === 'Kırmızı' ? 'Resüsitasyon' : newTriage === 'Sarı' ? 'Sarı Alan' : 'Yeşil Alan',
      status: 'Bekliyor', vitals: { sys: 0, dia: 0, pulse: 0, temp: 0, spo2: 0, gcs: 15, resp: 16 },
      notes: '', arrivalType: newArrival, orders: [], diagnosis: '', newsScore: 0, esiLevel: newTriage === 'Kırmızı' ? 1 : newTriage === 'Sarı' ? 3 : 4,
      ekatId: `EKAT-${Date.now()}`, medulaProvision: ''
    };
    setPatients([newP, ...patients]);
    setShowNewPatient(false);
    setNewName(''); setNewComplaint('');
  };

  const sendEKAT = () => { setEkatStatus('sending'); setTimeout(() => setEkatStatus('ok'), 2000); };
  const checkMedula = () => { setMedulaStatus('checking'); setTimeout(() => setMedulaStatus('ok'), 1800); };

  const calcESI = (): number => {
    if (esiQ1) return 1;
    if (esiQ2) return 2;
    if (esiResources >= 2) return esiVitalsOK ? 3 : 2;
    if (esiResources === 1) return 4;
    return 5;
  };

  const triageColor = (t: string) => t === 'Kırmızı' ? 'red' : t === 'Sarı' ? 'amber' : t === 'Yeşil' ? 'green' : 'slate';
  const statusColor = (s: string) => s === 'Tedavide' ? 'blue' : s === 'Muayenede' ? 'cyan' : s === 'Bekliyor' ? 'amber' : s === 'Gözlemde' ? 'purple' : s === 'Sevk' ? 'red' : 'green';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Blue Code Alert */}
      {blueCodeActive && (
        <div className="bg-red-600 text-white p-3 rounded-xl flex items-center justify-between animate-pulse flex-none">
          <div className="flex items-center gap-3">
            <HeartPulse size={24} className="animate-bounce" />
            <div>
              <p className="font-bold">MAVİ KOD AKTİF — Resüsitasyon Ekibi Çağrıldı</p>
              <p className="text-xs opacity-80">Konum: Acil Servis Resüsitasyon Odası • {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <button onClick={() => setBlueCodeActive(false)} className="px-4 py-1.5 bg-white text-red-600 rounded-lg text-sm font-bold hover:bg-red-50">Kodu Kapat</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Acil Servis & Triyaj Yönetimi</h2>
          <p className="text-sm text-slate-500">EKAT entegre, NEWS/ESI skorlama, MEDULA provizyon • Nöbetçi: Dr. Hakan Çelik</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowMassCasualty(true)} className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 text-white rounded-lg text-xs font-semibold hover:bg-orange-700">
            <Radio size={14} /> KBRN / Afet
          </button>
          <button onClick={handleBlueCode} className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 shadow-sm shadow-red-200">
            <HeartPulse size={14} /> Mavi Kod
          </button>
          <button onClick={() => setShowTriageCalc(true)} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700">
            <Calculator size={14} /> ESI Triyaj
          </button>
          <button onClick={() => setShowNewPatient(true)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">
            <Plus size={14} /> Hızlı Kayıt
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-none">
        {[
          { label: 'Kırmızı', count: redCount, sub: 'Resüsitasyon', color: 'bg-red-50 border-red-200', textColor: 'text-red-600', ping: true },
          { label: 'Sarı', count: yellowCount, sub: 'Acil müdahale', color: 'bg-amber-50 border-amber-200', textColor: 'text-amber-600', ping: false },
          { label: 'Yeşil', count: greenCount, sub: 'Ayaktan', color: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-600', ping: false },
          { label: 'Gözlem', count: patients.filter(p => p.status === 'Gözlemde').length, sub: '12 yatak', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-600', ping: false },
          { label: 'Ort. Bekleme', count: `${avgWait}dk`, sub: `${patients.filter(p => p.status !== 'Taburcu').length} hasta`, color: 'bg-slate-100 border-slate-200', textColor: 'text-slate-700', ping: false },
          { label: 'EKAT Bildirimi', count: patients.filter(p => p.ekatId).length, sub: 'Gönderilen', color: 'bg-cyan-50 border-cyan-200', textColor: 'text-cyan-600', ping: false },
        ].map((s, i) => (
          <div key={i} className={`p-3 rounded-xl border shadow-sm ${s.color}`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1 ${s.textColor}`}>
              {s.ping && <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></span>}
              {s.label}
            </p>
            <div className={`text-xl font-black ${s.textColor}`}>{s.count}</div>
            <p className={`text-[10px] mt-0.5 opacity-60 ${s.textColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Board */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50 flex-none">
          <div className="flex gap-2 items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm"><Activity className="text-blue-500" size={16} /> Aktif Vakalar</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1.5 text-slate-400" size={14} />
              <input type="text" placeholder="Hasta ara..." value={searchText} onChange={e => setSearchText(e.target.value)}
                className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 w-44" />
            </div>
          </div>
          <div className="flex gap-1.5">
            {['Tümü', 'Kırmızı', 'Sarı', 'Yeşil', 'Gözlem'].map(f => (
              <button key={f} onClick={() => setAreaFilter(f)}
                className={twMerge('px-2.5 py-1 rounded-lg text-[10px] font-semibold border',
                  areaFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                )}>{f}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-bold text-slate-500 text-[10px] uppercase w-24">Triyaj/ESI</th>
                <th className="py-2.5 px-3 font-bold text-slate-500 text-[10px] uppercase">Hasta</th>
                <th className="py-2.5 px-3 font-bold text-slate-500 text-[10px] uppercase">Şikayet</th>
                <th className="py-2.5 px-3 font-bold text-slate-500 text-[10px] uppercase">Vital/NEWS</th>
                <th className="py-2.5 px-3 font-bold text-slate-500 text-[10px] uppercase">Süre / EKAT</th>
                <th className="py-2.5 px-3 font-bold text-slate-500 text-[10px] uppercase">Durum</th>
                <th className="py-2.5 px-3 font-bold text-slate-500 text-[10px] uppercase">Hekim</th>
                <th className="py-2.5 px-3 font-bold text-slate-500 text-[10px] uppercase text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => (
                <tr key={p.id} className={twMerge(
                  "transition-colors hover:bg-slate-50 cursor-pointer group",
                  p.triage === 'Kırmızı' && p.status !== 'Taburcu' ? "bg-red-50/30" : "",
                  p.status === 'Taburcu' ? "opacity-40" : ""
                )} onClick={() => { setSelectedPatient(p); setActiveDetailTab('klinik'); }}>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-1">
                      <span className={twMerge(
                        "px-2 py-1 text-[10px] font-black rounded border flex items-center justify-center gap-1 w-fit shadow-sm",
                        p.triage === 'Kırmızı' ? "bg-red-500 text-white border-red-600" :
                        p.triage === 'Sarı' ? "bg-amber-400 text-amber-900 border-amber-500" :
                        "bg-emerald-500 text-white border-emerald-600"
                      )}>
                        {p.triage === 'Kırmızı' && <AlertTriangle size={10} />}
                        {p.triage}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">ESI-{p.esiLevel}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-800 text-xs">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.age} {p.gender} • {p.arrivalType === '112' ? '🚑 112' : p.arrivalType}</div>
                  </td>
                  <td className="py-2.5 px-3 max-w-[180px]">
                    <p className="text-xs text-slate-700 truncate">{p.complaint}</p>
                    {p.diagnosis && <p className="text-[9px] text-blue-600 font-mono mt-0.5">{p.diagnosis}</p>}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-0.5 text-[9px]">
                      <span className={p.vitals.sys > 160 || p.vitals.sys < 90 ? 'text-red-600 font-bold' : 'text-slate-600'}>TA:{p.vitals.sys}/{p.vitals.dia}</span>
                      <span className={p.vitals.spo2 < 94 ? 'text-red-600 font-bold' : 'text-slate-600'}>SpO2:{p.vitals.spo2}% Nb:{p.vitals.pulse}</span>
                      <span className={`font-bold px-1 rounded ${p.newsScore >= 7 ? 'bg-red-100 text-red-700' : p.newsScore >= 5 ? 'bg-amber-100 text-amber-700' : 'text-slate-500'}`}>NEWS:{p.newsScore}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className={twMerge("text-[10px] font-bold flex items-center gap-0.5", p.waitMin > 30 && p.status === 'Bekliyor' ? "text-red-600" : "text-slate-700")}>
                      <Clock size={10} /> {p.arrivalTime} ({p.waitMin}dk)
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono mt-0.5">{p.ekatId}</div>
                  </td>
                  <td className="py-2.5 px-3"><Badge color={statusColor(p.status)}>{p.status}</Badge></td>
                  <td className="py-2.5 px-3">
                    <span className={twMerge("text-[10px] font-semibold", !p.doctor ? "text-amber-600" : "text-slate-700")}>{p.doctor || 'Atanmadı'}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><ChevronRight size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detail Modal */}
      <Modal open={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`Acil Hasta — ${selectedPatient?.name || ''}`} wide>
        {selectedPatient && (
          <div className="space-y-5">
            {/* Banner */}
            <div className="bg-slate-800 rounded-xl p-4 text-white flex flex-col md:flex-row justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                  <span className={twMerge("px-2 py-0.5 text-[10px] font-black rounded",
                    selectedPatient.triage === 'Kırmızı' ? "bg-red-500" : selectedPatient.triage === 'Sarı' ? "bg-amber-400 text-amber-900" : "bg-emerald-500"
                  )}>{selectedPatient.triage} (ESI-{selectedPatient.esiLevel})</span>
                  <Badge color={statusColor(selectedPatient.status)}>{selectedPatient.status}</Badge>
                </div>
                <p className="text-xs text-slate-300">{selectedPatient.age} {selectedPatient.gender} • TC: {selectedPatient.tc} • {selectedPatient.arrivalType} • {selectedPatient.arrivalTime}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">EKAT: {selectedPatient.ekatId} {selectedPatient.medulaProvision && `• MEDULA: ${selectedPatient.medulaProvision}`}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'TA', value: `${selectedPatient.vitals.sys}/${selectedPatient.vitals.dia}`, flag: selectedPatient.vitals.sys > 160 || selectedPatient.vitals.sys < 90 },
                  { label: 'SpO2', value: `${selectedPatient.vitals.spo2}%`, flag: selectedPatient.vitals.spo2 < 94 },
                  { label: 'NEWS', value: selectedPatient.newsScore, flag: selectedPatient.newsScore >= 7 },
                  { label: 'Nabız', value: selectedPatient.vitals.pulse, flag: selectedPatient.vitals.pulse > 110 },
                  { label: 'GKS', value: `${selectedPatient.vitals.gcs}/15`, flag: selectedPatient.vitals.gcs < 15 },
                  { label: 'Ateş', value: `${selectedPatient.vitals.temp}°C`, flag: selectedPatient.vitals.temp > 38 },
                ].map((v, i) => (
                  <div key={i} className={`p-1.5 rounded text-center text-xs ${v.flag ? 'bg-red-500/20 border border-red-500/30' : 'bg-slate-700/50'}`}>
                    <p className="text-[9px] text-slate-400">{v.label}</p>
                    <p className={`font-bold ${v.flag ? 'text-red-400' : ''}`}>{v.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'klinik', label: 'Klinik Notlar' },
                { id: 'news', label: 'NEWS Skoru' },
                { id: 'entegrasyon', label: 'EKAT / MEDULA' },
                { id: 'istemler', label: 'İstemler' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                  className={twMerge("px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap",
                    activeDetailTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                  )}>{tab.label}</button>
              ))}
            </div>

            {activeDetailTab === 'klinik' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Klinik Notlar & Tedavi</h4>
                  <textarea rows={3} defaultValue={selectedPatient.notes}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                {selectedPatient.diagnosis && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs font-bold text-blue-600 mb-0.5">Tanı (ICD-10)</p>
                    <p className="text-sm font-medium text-blue-800">{selectedPatient.diagnosis}</p>
                  </div>
                )}
                {selectedPatient.orders.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 mb-2">İstemler</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedPatient.orders.map((o, i) => (
                        <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100">{o}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeDetailTab === 'news' && (
              <NEWSCalculator vitals={selectedPatient.vitals} onClose={() => setActiveDetailTab('klinik')} />
            )}

            {activeDetailTab === 'entegrasyon' && (
              <div className="space-y-4">
                {/* EKAT */}
                <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-cyan-600" />
                      <span className="text-sm font-bold text-cyan-800">EKAT (Elektronik Kayıt ve Takip)</span>
                    </div>
                    <button onClick={sendEKAT} disabled={ekatStatus === 'sending'}
                      className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-1.5">
                      {ekatStatus === 'sending' ? <><RefreshCw size={12} className="animate-spin" /> Gönderiliyor...</> :
                       ekatStatus === 'ok' ? <><CheckCircle2 size={12} /> Gönderildi</> :
                       <><Send size={12} /> EKAT Bildir</>}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-cyan-100"><span className="text-cyan-600">EKAT No:</span> <span className="font-bold">{selectedPatient.ekatId}</span></div>
                    <div className="bg-white p-2 rounded border border-cyan-100"><span className="text-cyan-600">Triyaj:</span> <span className="font-bold">{selectedPatient.triage} (ESI-{selectedPatient.esiLevel})</span></div>
                    <div className="bg-white p-2 rounded border border-cyan-100"><span className="text-cyan-600">Geliş:</span> <span className="font-bold">{selectedPatient.arrivalTime} ({selectedPatient.arrivalType})</span></div>
                    <div className="bg-white p-2 rounded border border-cyan-100"><span className="text-cyan-600">Durum:</span> <span className="font-bold">{selectedPatient.status}</span></div>
                  </div>
                  {ekatStatus === 'ok' && (
                    <div className="mt-2 bg-emerald-50 text-emerald-700 text-xs p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> EKAT bildirimi başarıyla SB sunucusuna iletildi. Yanıt: 200-OK
                    </div>
                  )}
                </div>

                {/* MEDULA Provizyon */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-blue-600" />
                      <span className="text-sm font-bold text-blue-800">MEDULA Acil Provizyon</span>
                    </div>
                    <button onClick={checkMedula} disabled={medulaStatus === 'checking'}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
                      {medulaStatus === 'checking' ? <><RefreshCw size={12} className="animate-spin" /> Sorgulanıyor...</> :
                       medulaStatus === 'ok' ? <><CheckCircle2 size={12} /> Onaylandı</> :
                       <><Send size={12} /> Provizyon Sorgula</>}
                    </button>
                  </div>
                  {medulaStatus === 'ok' && (
                    <div className="bg-emerald-50 text-emerald-700 text-xs p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> MEDULA acil provizyon onayı alındı. Provizyon No: PRV-ACL-{Date.now().toString().slice(-6)}. SUT fatura kodu aktif.
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600">Provizyon Tipi:</span> <span className="font-bold">Acil Hasta</span></div>
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600">Kurum:</span> <span className="font-bold">SGK (Genel Sağlık Sigortası)</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'istemler' && (
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {['Hemogram', 'Biyokimya', 'Troponin', 'D-Dimer', 'CRP', 'Koagülasyon', 'Cross-Match', 'AKG', 'TİT'].map(t => (
                    <button key={t} onClick={() => {
                      if (!selectedPatient.orders.includes(t)) {
                        const updated = { ...selectedPatient, orders: [...selectedPatient.orders, t] };
                        setSelectedPatient(updated);
                        setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
                      }
                    }} className={twMerge("text-xs px-2.5 py-1.5 rounded-lg border font-semibold",
                      selectedPatient.orders.includes(t) ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50"
                    )}>{selectedPatient.orders.includes(t) && <CheckCircle2 size={10} className="inline mr-1" />}{t}</button>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['EKG', 'PA AC Grafisi', 'Beyin BT', 'Batın BT', 'Batın USG', 'Toraks BT', 'Ekokardiyografi'].map(t => (
                    <button key={t} onClick={() => {
                      if (!selectedPatient.orders.includes(t)) {
                        const updated = { ...selectedPatient, orders: [...selectedPatient.orders, t] };
                        setSelectedPatient(updated);
                        setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
                      }
                    }} className={twMerge("text-xs px-2.5 py-1.5 rounded-lg border font-semibold",
                      selectedPatient.orders.includes(t) ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-white text-slate-600 border-slate-200 hover:bg-purple-50"
                    )}>{selectedPatient.orders.includes(t) && <CheckCircle2 size={10} className="inline mr-1" />}{t}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4 border-t border-slate-100">
              <button onClick={() => handleStatusChange(selectedPatient.id, 'Tedavide')} className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 flex items-center justify-center gap-1.5"><Syringe size={14} /> Tedavi</button>
              <button onClick={() => handleStatusChange(selectedPatient.id, 'Gözlemde')} className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 flex items-center justify-center gap-1.5"><Eye size={14} /> Gözlem</button>
              <button onClick={() => handleStatusChange(selectedPatient.id, 'Sevk')} className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold hover:bg-amber-100 flex items-center justify-center gap-1.5"><ArrowUpRight size={14} /> Yatış/Sevk</button>
              <button onClick={() => { handleStatusChange(selectedPatient.id, 'Taburcu'); setSelectedPatient(null); }} className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5"><CheckCircle2 size={14} /> Taburcu</button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Patient Modal */}
      <Modal open={showNewPatient} onClose={() => setShowNewPatient(false)} title="Hızlı Hasta Kaydı (Acil)">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Hasta Adı</label>
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ad Soyad" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Geliş Şekli</label>
              <select value={newArrival} onChange={e => setNewArrival(e.target.value as any)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option value="Kendi">Kendi Geldi</option><option value="112">112 Ambulans</option><option value="Nakil">Nakil</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Şikayet</label>
            <textarea rows={2} value={newComplaint} onChange={e => setNewComplaint(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none" placeholder="Ana şikayet..." />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">Triyaj Rengi</label>
            <div className="flex gap-3">
              {(['Kırmızı', 'Sarı', 'Yeşil'] as const).map(t => (
                <button key={t} onClick={() => setNewTriage(t)}
                  className={twMerge('flex-1 py-3 rounded-xl text-sm font-bold border-2',
                    newTriage === t ? (t === 'Kırmızı' ? 'bg-red-500 text-white border-red-600' : t === 'Sarı' ? 'bg-amber-400 text-amber-900 border-amber-500' : 'bg-emerald-500 text-white border-emerald-600')
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  )}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setShowNewPatient(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold">İptal</button>
            <button onClick={handleAddPatient} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Plus size={14} /> Kaydet & EKAT Bildir</button>
          </div>
        </div>
      </Modal>

      {/* ESI Triage Calculator Modal */}
      <Modal open={showTriageCalc} onClose={() => setShowTriageCalc(false)} title="ESI (Emergency Severity Index) Triyaj Hesaplayıcı">
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-xs text-purple-600 mb-3 font-semibold">Algoritmik karar destek sistemi — 5 seviyeli acil triyaj</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-purple-100 cursor-pointer">
                <input type="checkbox" checked={esiQ1} onChange={e => setEsiQ1(e.target.checked)} className="w-4 h-4 accent-red-500" />
                <div>
                  <p className="text-sm font-bold text-red-700">A: Yaşamı tehdit eden durum mu?</p>
                  <p className="text-[10px] text-slate-500">Entübasyon, CPR, IV ilaç, STEMİ, şok, bilinç kaybı</p>
                </div>
              </label>
              <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-purple-100 cursor-pointer">
                <input type="checkbox" checked={esiQ2} onChange={e => setEsiQ2(e.target.checked)} className="w-4 h-4 accent-amber-500" />
                <div>
                  <p className="text-sm font-bold text-amber-700">B: Yüksek riskli durum mu?</p>
                  <p className="text-[10px] text-slate-500">Konfüzyon, letarji, oryantasyon bozukluğu, şiddetli ağrı (VAS 8-10)</p>
                </div>
              </label>
              <div className="bg-white p-3 rounded-lg border border-purple-100">
                <p className="text-sm font-bold text-slate-700 mb-2">C: Beklenen kaynak sayısı</p>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setEsiResources(r)}
                      className={twMerge("w-10 h-10 rounded-lg text-sm font-bold border-2",
                        esiResources === r ? "bg-purple-500 text-white border-purple-600" : "bg-white text-slate-600 border-slate-200"
                      )}>{r}</button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Lab, görüntüleme, IV sıvı, prosedür, konsültasyon vb.</p>
              </div>
              <label className="flex items-center gap-3 bg-white p-3 rounded-lg border border-purple-100 cursor-pointer">
                <input type="checkbox" checked={esiVitalsOK} onChange={e => setEsiVitalsOK(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
                <div>
                  <p className="text-sm font-bold text-slate-700">D: Vital bulgular normal sınırlarda mı?</p>
                  <p className="text-[10px] text-slate-500">TA, Nabız, SpO2, Solunum hızı normal aralıkta</p>
                </div>
              </label>
            </div>
          </div>
          <div className={`text-center p-6 rounded-xl border-2 ${
            calcESI() === 1 ? 'bg-red-100 border-red-400' : calcESI() === 2 ? 'bg-orange-100 border-orange-400' : calcESI() === 3 ? 'bg-amber-100 border-amber-400' : calcESI() === 4 ? 'bg-emerald-100 border-emerald-400' : 'bg-blue-100 border-blue-400'
          }`}>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Hesaplanan ESI Seviyesi</p>
            <p className="text-5xl font-black mt-2">ESI-{calcESI()}</p>
            <p className="text-sm font-bold mt-2">
              {calcESI() === 1 ? 'Resüsitasyon — Anında müdahale' : calcESI() === 2 ? 'Acil — Yüksek risk, hemen değerlendirme' : calcESI() === 3 ? 'Acil — Çok kaynak, 30dk içinde' : calcESI() === 4 ? 'Yarı-Acil — 1 kaynak' : 'Acil Olmayan — Kaynak gerekmez'}
            </p>
          </div>
        </div>
      </Modal>

      {/* Mass Casualty Protocol Modal */}
      <Modal open={showMassCasualty} onClose={() => setShowMassCasualty(false)} title="KBRN / Toplu Yaralanma / Afet Protokolü">
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Radio size={20} className="text-orange-600" />
              <span className="text-sm font-bold text-orange-800">Toplu Yaralanma Aktivasyon Durumu</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['Seviye 1 - Uyarı (5-10 hasta)', 'Seviye 2 - Kısmi Aktive (10-20 hasta)', 'Seviye 3 - Tam Aktive (20+ hasta)', 'KBRN Protokolü'].map((level, i) => (
                <button key={level} className={twMerge("p-3 rounded-lg border text-xs font-semibold text-left",
                  i < 3 ? "bg-white border-orange-200 hover:bg-orange-100 text-orange-700" : "bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                )}>
                  {level}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-700 mb-2">START Triyaj Protokolü (Simple Triage and Rapid Treatment)</h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Siyah (Exitus)', color: 'bg-slate-800 text-white' },
                { label: 'Kırmızı (Acil)', color: 'bg-red-500 text-white' },
                { label: 'Sarı (Geciktirilebilir)', color: 'bg-amber-400 text-amber-900' },
                { label: 'Yeşil (Hafif)', color: 'bg-emerald-500 text-white' },
              ].map(t => (
                <div key={t.label} className={`${t.color} p-3 rounded-lg text-xs font-bold`}>{t.label}</div>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-600 space-y-1">
              <p>1. Yürüyebiliyor mu? → Evet: <span className="font-bold text-emerald-600">YEŞİL</span></p>
              <p>2. Solunum var mı? → Hayır + Pozisyon sonrası yok: <span className="font-bold text-slate-700">SİYAH</span></p>
              <p>3. SS &gt;30 veya kapiller dolum &gt;2sn? → <span className="font-bold text-red-600">KIRMIZI</span></p>
              <p>4. Basit komutları yerine getiremiyor mu? → <span className="font-bold text-red-600">KIRMIZI</span></p>
              <p>5. Diğer: <span className="font-bold text-amber-600">SARI</span></p>
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <h4 className="text-sm font-bold text-red-700 mb-2">Olay Komuta Sistemi (ICS) Kontrol Listesi</h4>
            {['Komutan atandı', 'Triyaj alanı belirlendi', 'Dekontaminasyon bölgesi hazır', 'Servis taburcu planı aktif', 'Kan bankası uyarıldı', 'Ambulans koordinasyonu sağlandı', 'Basın sözcüsü belirlendi', 'İl SAKOM bilgilendirildi'].map((item, i) => (
              <label key={i} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-red-500 rounded" />
                <span className="text-xs text-red-800">{item}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>

      {/* Blue Code Modal */}
      <Modal open={showBlueCode} onClose={() => setShowBlueCode(false)} title="MAVİ KOD — Kardiyak Arrest Protokolü">
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <HeartPulse size={48} className="mx-auto mb-3 text-red-500 animate-bounce" />
            <p className="text-lg font-bold text-red-700">Resüsitasyon Ekibi Çağrıldı</p>
            <p className="text-sm text-red-600 mt-1">Anestezi, Kardiyoloji, Hemşirelik ekipleri bilgilendirildi</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-700 mb-2">CPR (AHA 2025) Kontrol Listesi</h4>
            {['Olay yerini güvenli hale getir', 'Bilinç kontrolü — Hastayı sar/uyar', 'Yardım iste — Mavi Kod bildir', 'Nabız kontrolü (karotis, max 10 sn)', 'CPR başla — 30:2 (100-120/dk, 5-6cm)', 'Defibrilatör hazırla — AED/Manuel', 'IV/IO erişim sağla', 'Adrenalin 1mg IV (3-5 dk arayla)', 'Ritim analizi (VF/VT → Defib, PEA/Asistol → CPR)', 'Geri dönüşüm sağlandı — ROSC'].map((step, i) => (
              <label key={i} className="flex items-center gap-2 py-1.5 cursor-pointer border-b border-slate-100 last:border-0">
                <input type="checkbox" className="w-4 h-4 accent-red-500 rounded" />
                <span className="text-xs text-slate-700"><span className="font-bold text-red-600 mr-1">{i + 1}.</span>{step}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={() => { setShowBlueCode(false); setBlueCodeActive(false); }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Kodu Sonlandır</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
