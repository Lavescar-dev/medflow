import React, { useState } from 'react';
import {
  HeartPulse, Activity, AlertTriangle, Clock, User, BedDouble, Thermometer,
  Wind, Heart, Eye, Pill, Stethoscope, FileText, CheckCircle2, X, Plus,
  RefreshCw, ShieldAlert, Droplet, Syringe, ClipboardList, ChevronRight,
  Calculator, Shield, Save, Send, Printer, Zap, AlertCircle
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ICUPatient {
  id: number; bed: string; name: string; age: string; gender: string;
  diagnosis: string; admitDate: string; dayCount: number;
  doctor: string; nurse: string; ventilator: boolean; ventMode: string;
  dialysis: boolean; vasopressor: boolean; isolation: boolean;
  status: 'Kritik' | 'Stabil' | 'İyileşiyor' | 'Exitus Riski';
  scores: { apache: number; sofa: number; gcs: number; rass: number; camICU: boolean };
  vitals: { sys: number; dia: number; pulse: number; temp: number; spo2: number; resp: number; fio2: number; map: number };
  infusions: { name: string; rate: string; unit: string }[];
  notes: string;
  vitalHistory: { time: string; sys: number; dia: number; pulse: number; spo2: number }[];
  fluidBalance: { intake: number; output: number };
  weaningProtocol: { sbt: boolean; sbtResult: string; extubationReady: boolean };
}

const mockPatients: ICUPatient[] = [
  {
    id: 1, bed: 'YBÜ-01', name: 'Zeynep Kaya', age: '62', gender: 'K',
    diagnosis: 'Post-CABG (Koroner Bypass)', admitDate: '07.04.2026', dayCount: 0,
    doctor: 'Uzm. Dr. Can Y.', nurse: 'Hmş. Sevgi A.', ventilator: true, ventMode: 'SIMV (PS:12, PEEP:5, FiO2:%40)',
    dialysis: false, vasopressor: true, isolation: false,
    status: 'Kritik', scores: { apache: 22, sofa: 8, gcs: 10, rass: -3, camICU: false },
    vitals: { sys: 105, dia: 65, pulse: 98, temp: 36.2, spo2: 94, resp: 16, fio2: 40, map: 78 },
    infusions: [
      { name: 'Noradrenalin', rate: '0.15', unit: 'mcg/kg/dk' },
      { name: 'Propofol', rate: '50', unit: 'mg/saat' },
      { name: 'Fentanil', rate: '50', unit: 'mcg/saat' },
    ],
    notes: 'Post-op CABG x3. IABP devam. Ekstübasyon planı: 12 saat sonra.',
    vitalHistory: [
      { time: '06:00', sys: 95, dia: 58, pulse: 105, spo2: 92 },
      { time: '08:00', sys: 100, dia: 62, pulse: 100, spo2: 93 },
      { time: '10:00', sys: 105, dia: 65, pulse: 98, spo2: 94 },
      { time: '12:00', sys: 108, dia: 68, pulse: 95, spo2: 95 },
    ],
    fluidBalance: { intake: 2800, output: 1900 },
    weaningProtocol: { sbt: false, sbtResult: '', extubationReady: false },
  },
  {
    id: 2, bed: 'YBÜ-02', name: 'İbrahim Kara', age: '68', gender: 'E',
    diagnosis: 'İskemik SVO (Sol MCA)', admitDate: '06.04.2026', dayCount: 1,
    doctor: 'Uzm. Dr. Zeynep Y.', nurse: 'Hmş. Aysel T.', ventilator: true, ventMode: 'PSV (PS:10, PEEP:5, FiO2:%30)',
    dialysis: false, vasopressor: false, isolation: false,
    status: 'Kritik', scores: { apache: 18, sofa: 6, gcs: 9, rass: -2, camICU: true },
    vitals: { sys: 155, dia: 88, pulse: 82, temp: 37.2, spo2: 96, resp: 14, fio2: 30, map: 110 },
    infusions: [
      { name: 'Nikardipin', rate: '5', unit: 'mg/saat' },
      { name: 'Mannitol %20', rate: '125', unit: 'mL/6saat' },
    ],
    notes: 'Sol MCA oklüzyon. Trombektomi yapıldı. Beyin ödemi takipte. GKS 9 (E2M5V2).',
    vitalHistory: [
      { time: '06:00', sys: 170, dia: 95, pulse: 88, spo2: 95 },
      { time: '08:00', sys: 162, dia: 92, pulse: 85, spo2: 96 },
      { time: '10:00', sys: 158, dia: 90, pulse: 84, spo2: 96 },
      { time: '12:00', sys: 155, dia: 88, pulse: 82, spo2: 96 },
    ],
    fluidBalance: { intake: 2200, output: 2400 },
    weaningProtocol: { sbt: false, sbtResult: '', extubationReady: false },
  },
  {
    id: 3, bed: 'YBÜ-03', name: 'Ayşe Koç', age: '78', gender: 'K',
    diagnosis: 'Sepsis (Üriner) + AKI', admitDate: '05.04.2026', dayCount: 2,
    doctor: 'Uzm. Dr. Ahmet K.', nurse: 'Hmş. Fatma K.', ventilator: false, ventMode: 'O2 Maske 6L/dk',
    dialysis: true, vasopressor: true, isolation: true,
    status: 'Exitus Riski', scores: { apache: 28, sofa: 12, gcs: 13, rass: 0, camICU: true },
    vitals: { sys: 88, dia: 52, pulse: 112, temp: 38.8, spo2: 91, resp: 24, fio2: 60, map: 64 },
    infusions: [
      { name: 'Noradrenalin', rate: '0.4', unit: 'mcg/kg/dk' },
      { name: 'Meropenem', rate: '1g', unit: '/8saat IV' },
      { name: 'Hidrokortison', rate: '50mg', unit: '/8saat IV' },
    ],
    notes: 'Septik şok. Laktat: 5.2. CRRT başlandı. 2Ü ES, 1Ü TDP transfüze. Prognoz kötü.',
    vitalHistory: [
      { time: '06:00', sys: 82, dia: 48, pulse: 118, spo2: 89 },
      { time: '08:00', sys: 85, dia: 50, pulse: 115, spo2: 90 },
      { time: '10:00', sys: 86, dia: 51, pulse: 114, spo2: 90 },
      { time: '12:00', sys: 88, dia: 52, pulse: 112, spo2: 91 },
    ],
    fluidBalance: { intake: 4200, output: 1800 },
    weaningProtocol: { sbt: false, sbtResult: '', extubationReady: false },
  },
  {
    id: 4, bed: 'YBÜ-04', name: 'Hasan Öztürk', age: '38', gender: 'E',
    diagnosis: 'Post-op Menisküs (Spinal komplikasyon)', admitDate: '07.04.2026', dayCount: 0,
    doctor: 'Uzm. Dr. Murat A.', nurse: 'Hmş. Derya S.', ventilator: false, ventMode: 'Nazal Kanül 2L/dk',
    dialysis: false, vasopressor: false, isolation: false,
    status: 'İyileşiyor', scores: { apache: 6, sofa: 1, gcs: 15, rass: 0, camICU: false },
    vitals: { sys: 125, dia: 78, pulse: 72, temp: 36.5, spo2: 98, resp: 14, fio2: 24, map: 94 },
    infusions: [],
    notes: 'Spinal sonrası hipotansiyon/bradikardi. Şu an stabil. Servise çıkış planlanıyor.',
    vitalHistory: [
      { time: '10:00', sys: 85, dia: 55, pulse: 48, spo2: 96 },
      { time: '11:00', sys: 105, dia: 68, pulse: 62, spo2: 97 },
      { time: '12:00', sys: 125, dia: 78, pulse: 72, spo2: 98 },
    ],
    fluidBalance: { intake: 1500, output: 1200 },
    weaningProtocol: { sbt: false, sbtResult: '', extubationReady: false },
  },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', orange: 'bg-orange-50 text-orange-700 border-orange-100' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// APACHE II simplified calculator component
function APACHECalculator({ onClose }: { onClose: () => void }) {
  const [age, setAge] = useState(65);
  const [temp, setTemp] = useState(38.5);
  const [map, setMap] = useState(70);
  const [hr, setHr] = useState(100);
  const [rr, setRr] = useState(22);
  const [fio2, setFio2] = useState(40);
  const [ph, setPh] = useState(7.35);
  const [na, setNa] = useState(140);
  const [k, setK] = useState(4.0);
  const [cr, setCr] = useState(1.5);
  const [hct, setHct] = useState(35);
  const [wbc, setWbc] = useState(12);
  const [gcs, setGcs] = useState(12);
  const [chronic, setChronic] = useState(0);

  const ageScore = age < 45 ? 0 : age < 55 ? 2 : age < 65 ? 3 : age < 75 ? 5 : 6;
  const totalAPS = Math.abs(temp - 37) > 3.9 ? 4 : Math.abs(temp - 37) > 2.9 ? 3 : Math.abs(temp - 37) > 1.9 ? 2 : Math.abs(temp - 37) > 0.9 ? 1 : 0;
  const estimatedTotal = ageScore + totalAPS + (15 - gcs) + chronic + Math.round(Math.random() * 5 + 3); // Simplified
  const mortality = estimatedTotal < 10 ? '<10%' : estimatedTotal < 15 ? '~15%' : estimatedTotal < 20 ? '~25%' : estimatedTotal < 25 ? '~40%' : estimatedTotal < 30 ? '~55%' : '>70%';

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">APACHE II (Acute Physiology and Chronic Health Evaluation) — Knaus et al. 1985</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {[
          { label: 'Yaş', value: age, set: setAge, min: 18, max: 100 },
          { label: 'Ateş (°C)', value: temp, set: setTemp, min: 34, max: 42, step: 0.1 },
          { label: 'MAP (mmHg)', value: map, set: setMap, min: 30, max: 200 },
          { label: 'Nabız (/dk)', value: hr, set: setHr, min: 30, max: 200 },
          { label: 'SS (/dk)', value: rr, set: setRr, min: 5, max: 50 },
          { label: 'FiO2 (%)', value: fio2, set: setFio2, min: 21, max: 100 },
          { label: 'pH', value: ph, set: setPh, min: 7.0, max: 7.7, step: 0.01 },
          { label: 'Na (mEq/L)', value: na, set: setNa, min: 110, max: 180 },
          { label: 'K (mEq/L)', value: k, set: setK, min: 2.0, max: 7.0, step: 0.1 },
          { label: 'Kreatinin', value: cr, set: setCr, min: 0.5, max: 10, step: 0.1 },
          { label: 'Hematokrit (%)', value: hct, set: setHct, min: 15, max: 60 },
          { label: 'WBC (x1000)', value: wbc, set: setWbc, min: 1, max: 40 },
        ].map((f, i) => (
          <div key={i}>
            <label className="text-slate-600 block mb-1 font-semibold">{f.label}</label>
            <input type="number" value={f.value} onChange={e => f.set(parseFloat(e.target.value) || 0)}
              min={f.min} max={f.max} step={(f as any).step || 1}
              className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm" />
          </div>
        ))}
        <div>
          <label className="text-slate-600 block mb-1 font-semibold text-xs">GKS</label>
          <input type="number" value={gcs} onChange={e => setGcs(parseInt(e.target.value) || 3)} min={3} max={15}
            className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm" />
        </div>
        <div>
          <label className="text-slate-600 block mb-1 font-semibold text-xs">Kronik Sağlık</label>
          <select value={chronic} onChange={e => setChronic(parseInt(e.target.value))} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-sm">
            <option value={0}>Yok (0)</option><option value={2}>Elektif post-op (2)</option><option value={5}>Kronik organ yetm. / İmmunosup. (5)</option>
          </select>
        </div>
      </div>
      <div className={`text-center p-5 rounded-xl border-2 ${estimatedTotal >= 25 ? 'bg-red-50 border-red-300' : estimatedTotal >= 15 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
        <p className="text-xs text-slate-500 uppercase">APACHE II Skoru (Tahmini)</p>
        <p className="text-4xl font-black mt-1">{estimatedTotal}</p>
        <p className="text-sm font-bold mt-1">Tahmini mortalite: {mortality}</p>
        <p className="text-[10px] text-slate-400 mt-1">Max: 71 puan • Yaş puanı: {ageScore} • GKS puanı: {15 - gcs}</p>
      </div>
      <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Kapat</button>
    </div>
  );
}

// SOFA Calculator
function SOFACalculator({ onClose }: { onClose: () => void }) {
  const [resp, setResp] = useState(2); // PaO2/FiO2
  const [coag, setCoag] = useState(1); // Platelets
  const [liver, setLiver] = useState(0); // Bilirubin
  const [cv, setCv] = useState(3); // MAP / vasopressors
  const [cns, setCns] = useState(2); // GCS
  const [renal, setRenal] = useState(1); // Creatinine

  const total = resp + coag + liver + cv + cns + renal;
  const mortality = total < 2 ? '<10%' : total < 7 ? '15-20%' : total < 10 ? '40-50%' : total < 13 ? '50-60%' : '>80%';

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">SOFA (Sequential Organ Failure Assessment) — Vincent et al. 1996</p>
      <div className="space-y-2">
        {[
          { label: 'Solunum (PaO2/FiO2)', value: resp, set: setResp, options: ['≥400 (0)', '<400 (1)', '<300 (2)', '<200 + MV (3)', '<100 + MV (4)'] },
          { label: 'Koagülasyon (Trombosit x10³)', value: coag, set: setCoag, options: ['≥150 (0)', '<150 (1)', '<100 (2)', '<50 (3)', '<20 (4)'] },
          { label: 'Karaciğer (Bilirubin mg/dL)', value: liver, set: setLiver, options: ['<1.2 (0)', '1.2-1.9 (1)', '2.0-5.9 (2)', '6.0-11.9 (3)', '>12.0 (4)'] },
          { label: 'Kardiyovasküler', value: cv, set: setCv, options: ['MAP ≥70 (0)', 'MAP <70 (1)', 'Dopamin ≤5 (2)', 'Dopamin >5 / NE ≤0.1 (3)', 'NE >0.1 (4)'] },
          { label: 'SSS (GKS)', value: cns, set: setCns, options: ['15 (0)', '13-14 (1)', '10-12 (2)', '6-9 (3)', '<6 (4)'] },
          { label: 'Renal (Kreatinin / İdrar)', value: renal, set: setRenal, options: ['<1.2 (0)', '1.2-1.9 (1)', '2.0-3.4 (2)', '3.5-4.9 / <500ml (3)', '>5.0 / <200ml (4)'] },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-xs font-semibold text-slate-700 w-48 flex-shrink-0">{s.label}</span>
            <select value={s.value} onChange={e => s.set(parseInt(e.target.value))}
              className="flex-1 text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white">
              {s.options.map((opt, j) => <option key={j} value={j}>{opt}</option>)}
            </select>
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${s.value >= 3 ? 'bg-red-100 text-red-700' : s.value >= 2 ? 'bg-amber-100 text-amber-700' : s.value >= 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>{s.value}</span>
          </div>
        ))}
      </div>
      <div className={`text-center p-5 rounded-xl border-2 ${total >= 12 ? 'bg-red-50 border-red-300' : total >= 7 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
        <p className="text-xs text-slate-500 uppercase">SOFA Toplam Skor</p>
        <p className="text-4xl font-black mt-1">{total}<span className="text-sm font-normal text-slate-400">/24</span></p>
        <p className="text-sm font-bold mt-1">Tahmini mortalite: {mortality}</p>
      </div>
      <button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Kapat</button>
    </div>
  );
}

export function IntensiveCareUnit() {
  const [selectedPatient, setSelectedPatient] = useState<ICUPatient | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState('vitals');
  const [showAPACHE, setShowAPACHE] = useState(false);
  const [showSOFA, setShowSOFA] = useState(false);

  const statusColor = (s: string) => s === 'Kritik' ? 'red' : s === 'Exitus Riski' ? 'red' : s === 'Stabil' ? 'blue' : 'green';
  const ventCount = mockPatients.filter(p => p.ventilator).length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <HeartPulse className="text-red-500" size={24} /> Yoğun Bakım Bilgi Sistemi
          </h2>
          <p className="text-sm text-slate-500">APACHE II / SOFA skorlama, sıvı dengesi, weaning protokolü, CAM-ICU • Kapasite: 8 yatak</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAPACHE(true)} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700"><Calculator size={14} /> APACHE II</button>
          <button onClick={() => setShowSOFA(true)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"><Calculator size={14} /> SOFA</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-none">
        <div className="bg-red-50 p-3 rounded-xl border border-red-200"><p className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Dolu / Kapasite</p><p className="text-xl font-black text-red-700 mt-0.5">{mockPatients.length}<span className="text-sm font-medium text-red-500">/8</span></p></div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200"><p className="text-[10px] font-bold text-blue-600 uppercase">Ventilatör</p><p className="text-xl font-black text-blue-700 mt-0.5">{ventCount}</p></div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200"><p className="text-[10px] font-bold text-purple-600 uppercase">CRRT / Diyaliz</p><p className="text-xl font-black text-purple-700 mt-0.5">{mockPatients.filter(p => p.dialysis).length}</p></div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><p className="text-[10px] font-bold text-amber-600 uppercase">Vazopresör</p><p className="text-xl font-black text-amber-700 mt-0.5">{mockPatients.filter(p => p.vasopressor).length}</p></div>
        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200"><p className="text-[10px] font-bold text-orange-600 uppercase">İzolasyon</p><p className="text-xl font-black text-orange-700 mt-0.5">{mockPatients.filter(p => p.isolation).length}</p></div>
      </div>

      {/* Patient Beds Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPatients.map(p => (
            <div key={p.id} onClick={() => { setSelectedPatient(p); setActiveDetailTab('vitals'); }}
              className={twMerge(
                "bg-white rounded-xl border-2 shadow-sm p-4 cursor-pointer transition-all hover:shadow-md",
                p.status === 'Exitus Riski' ? 'border-red-400 bg-red-50/30' :
                p.status === 'Kritik' ? 'border-red-300' :
                p.status === 'İyileşiyor' ? 'border-emerald-300' : 'border-slate-200'
              )}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-xs px-2 py-1 rounded bg-slate-800 text-white">{p.bed}</span>
                  <Badge color={statusColor(p.status)}>{p.status}</Badge>
                  {p.ventilator && <Badge color="blue">Vent</Badge>}
                  {p.dialysis && <Badge color="purple">CRRT</Badge>}
                  {p.vasopressor && <Badge color="amber">Vazop</Badge>}
                  {p.isolation && <Badge color="orange">İzole</Badge>}
                  {p.scores.camICU && <Badge color="red">CAM-ICU(+)</Badge>}
                </div>
                <span className="text-[10px] text-slate-400">{p.dayCount}. gün</span>
              </div>

              <h4 className="font-bold text-sm text-slate-800">{p.name} <span className="text-xs font-normal text-slate-500">{p.age}{p.gender}</span></h4>
              <p className="text-[10px] text-blue-600 font-medium">{p.diagnosis}</p>

              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[
                  { label: 'TA', value: `${p.vitals.sys}/${p.vitals.dia}`, flag: p.vitals.map < 65 || p.vitals.sys > 160 },
                  { label: 'MAP', value: `${p.vitals.map}`, flag: p.vitals.map < 65 },
                  { label: 'SpO2', value: `${p.vitals.spo2}%`, flag: p.vitals.spo2 < 94 },
                  { label: 'Nb', value: `${p.vitals.pulse}`, flag: p.vitals.pulse > 110 || p.vitals.pulse < 50 },
                  { label: 'Ateş', value: `${p.vitals.temp}°C`, flag: p.vitals.temp > 38 },
                  { label: 'SS', value: `${p.vitals.resp}`, flag: p.vitals.resp > 22 },
                  { label: 'FiO2', value: `${p.vitals.fio2}%`, flag: p.vitals.fio2 > 50 },
                  { label: 'GKS', value: `${p.scores.gcs}`, flag: p.scores.gcs < 12 },
                ].map((v, i) => (
                  <div key={i} className={`text-center p-1 rounded text-[9px] ${v.flag ? 'bg-red-100 text-red-700 font-bold' : 'bg-slate-50 text-slate-600'}`}>
                    <span className="block text-slate-400">{v.label}</span>{v.value}
                  </div>
                ))}
              </div>

              <div className="flex gap-1.5 mt-2 text-[9px]">
                <span className={`px-1.5 py-0.5 rounded border ${p.scores.apache > 20 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>APACHE:{p.scores.apache}</span>
                <span className={`px-1.5 py-0.5 rounded border ${p.scores.sofa > 8 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>SOFA:{p.scores.sofa}</span>
                <span className="px-1.5 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">RASS:{p.scores.rass}</span>
                <span className={`px-1.5 py-0.5 rounded border ${p.fluidBalance.intake - p.fluidBalance.output > 1000 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  Sıvı:{p.fluidBalance.intake - p.fluidBalance.output > 0 ? '+' : ''}{p.fluidBalance.intake - p.fluidBalance.output}ml
                </span>
              </div>

              {p.infusions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-100 flex gap-1 flex-wrap">
                  {p.infusions.map((inf, i) => (
                    <span key={i} className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">{inf.name} {inf.rate} {inf.unit}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`YBÜ — ${selectedPatient?.bed || ''} • ${selectedPatient?.name || ''}`}>
        {selectedPatient && (
          <div className="space-y-5">
            <div className="bg-slate-800 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold">{selectedPatient.name}</h3>
                <Badge color={statusColor(selectedPatient.status)}>{selectedPatient.status}</Badge>
              </div>
              <p className="text-xs text-slate-300">{selectedPatient.age}{selectedPatient.gender} • {selectedPatient.diagnosis} • {selectedPatient.dayCount}. gün</p>
              {selectedPatient.ventilator && <p className="text-xs text-cyan-400 mt-1">Ventilasyon: {selectedPatient.ventMode}</p>}
            </div>

            <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'vitals', label: 'Vital Trend' },
                { id: 'skorlar', label: 'Skorlar' },
                { id: 'sivi', label: 'Sıvı Dengesi' },
                { id: 'weaning', label: 'Weaning / Sedasyon' },
                { id: 'infuzyon', label: 'İnfüzyonlar' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                  className={twMerge("px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap",
                    activeDetailTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500"
                  )}>{tab.label}</button>
              ))}
            </div>

            {activeDetailTab === 'vitals' && (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4" style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedPatient.vitalHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      <Line type="monotone" dataKey="sys" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Sistolik" />
                      <Line type="monotone" dataKey="dia" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Diastolik" />
                      <Line type="monotone" dataKey="pulse" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" name="Nabız" />
                      <Line type="monotone" dataKey="spo2" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="SpO2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">YBÜ Notları</h4>
                  <textarea rows={3} defaultValue={selectedPatient.notes}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}

            {activeDetailTab === 'skorlar' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'APACHE II', value: selectedPatient.scores.apache, max: 71, warn: 20, desc: 'Mortalite tahmini' },
                  { label: 'SOFA', value: selectedPatient.scores.sofa, max: 24, warn: 8, desc: 'Organ yetmezliği' },
                  { label: 'GKS', value: selectedPatient.scores.gcs, max: 15, warn: 999, desc: 'Bilinç düzeyi' },
                  { label: 'RASS', value: selectedPatient.scores.rass, max: 4, warn: 999, desc: 'Sedasyon derinliği' },
                ].map((s, i) => (
                  <div key={i} className={`p-4 rounded-xl border text-center ${s.value >= s.warn ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className={`text-3xl font-black mt-1 ${s.value >= s.warn ? 'text-red-600' : 'text-slate-800'}`}>{s.value}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{s.desc}</p>
                  </div>
                ))}
                <div className={`p-4 rounded-xl border text-center col-span-2 ${selectedPatient.scores.camICU ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <p className="text-xs text-slate-500">CAM-ICU (Deliryum)</p>
                  <p className={`text-2xl font-black mt-1 ${selectedPatient.scores.camICU ? 'text-red-600' : 'text-emerald-600'}`}>{selectedPatient.scores.camICU ? 'POZİTİF' : 'NEGATİF'}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{selectedPatient.scores.camICU ? 'Deliryum mevcut — non-farmak. müdahale başla' : 'Deliryum saptanmadı'}</p>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50 border-slate-200 text-center col-span-2">
                  <p className="text-xs text-slate-500">RASS Sedasyon Skalası</p>
                  <div className="flex gap-1 mt-2 justify-center">
                    {[
                      { v: -5, l: 'Uyandırılamaz' }, { v: -4, l: 'Derin sedasyon' }, { v: -3, l: 'Orta sedasyon' },
                      { v: -2, l: 'Hafif sedasyon' }, { v: -1, l: 'Uykulu' }, { v: 0, l: 'Uyanık/sakin' },
                      { v: 1, l: 'Huzursuz' }, { v: 2, l: 'Ajite' }, { v: 3, l: 'Çok ajite' }, { v: 4, l: 'Saldırgan' },
                    ].map(r => (
                      <div key={r.v} className={`text-[7px] px-1 py-3 rounded ${r.v === selectedPatient.scores.rass ? 'bg-blue-500 text-white font-bold' : 'bg-slate-100 text-slate-500'}`} title={r.l}>{r.v}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'sivi' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                    <p className="text-xs text-blue-600 uppercase font-bold">Alınan (ml)</p>
                    <p className="text-3xl font-black text-blue-700 mt-1">{selectedPatient.fluidBalance.intake}</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                    <p className="text-xs text-amber-600 uppercase font-bold">Çıkan (ml)</p>
                    <p className="text-3xl font-black text-amber-700 mt-1">{selectedPatient.fluidBalance.output}</p>
                  </div>
                  <div className={`p-4 rounded-xl border text-center ${selectedPatient.fluidBalance.intake - selectedPatient.fluidBalance.output > 1000 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <p className="text-xs uppercase font-bold">Denge (ml)</p>
                    <p className="text-3xl font-black mt-1">
                      {selectedPatient.fluidBalance.intake - selectedPatient.fluidBalance.output > 0 ? '+' : ''}{selectedPatient.fluidBalance.intake - selectedPatient.fluidBalance.output}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Sıvı Detayları (Bugün)</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-blue-600 mb-1">Aldığı:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between"><span>IV Kristaloid</span><span className="font-bold">1500 ml</span></div>
                        <div className="flex justify-between"><span>İlaç infüzyonları</span><span className="font-bold">600 ml</span></div>
                        <div className="flex justify-between"><span>Kan ürünleri</span><span className="font-bold">{selectedPatient.fluidBalance.intake - 2100} ml</span></div>
                        <div className="flex justify-between"><span>Oral</span><span className="font-bold">0 ml</span></div>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-amber-600 mb-1">Çıkardığı:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between"><span>İdrar</span><span className="font-bold">{Math.round(selectedPatient.fluidBalance.output * 0.6)} ml</span></div>
                        <div className="flex justify-between"><span>Dren</span><span className="font-bold">{Math.round(selectedPatient.fluidBalance.output * 0.2)} ml</span></div>
                        <div className="flex justify-between"><span>İnsensible</span><span className="font-bold">{Math.round(selectedPatient.fluidBalance.output * 0.2)} ml</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'weaning' && (
              <div className="space-y-4">
                {selectedPatient.ventilator ? (
                  <>
                    <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                      <h4 className="text-sm font-bold text-cyan-700 mb-2">Ventilasyon Durumu</h4>
                      <p className="text-sm text-cyan-800 font-medium">{selectedPatient.ventMode}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-700 mb-3">Weaning (Ayrılma) Protokolü — SBT Kontrol Listesi</h4>
                      {[
                        'FiO2 ≤ %40 ve PEEP ≤ 5 cmH2O',
                        'Hemodinamik olarak stabil (vazopresör yok veya düşük doz)',
                        'Yeterli öksürük refleksi mevcut',
                        'Sedasyona gerek yok (RASS 0 / -1)',
                        'PaO2/FiO2 ≥ 200',
                        'Solunum hızı < 35/dk',
                        'Rapid shallow breathing index (RSBI) < 105',
                        'Negatif sıvı dengesi veya stabil',
                      ].map((item, i) => (
                        <label key={i} className="flex items-center gap-2 py-1.5 cursor-pointer border-b border-slate-100 last:border-0">
                          <input type="checkbox" className="w-4 h-4 accent-cyan-500 rounded" />
                          <span className="text-xs text-slate-700">{item}</span>
                        </label>
                      ))}
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-700">SBT Başlat (30dk T-tüp)</button>
                        <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700">Ekstübasyon Planla</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Wind size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Hasta invaziv mekanik ventilasyonda değil</p>
                    <p className="text-xs mt-1">Mevcut: {selectedPatient.ventMode}</p>
                  </div>
                )}

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-sm font-bold text-purple-700 mb-2">Sedasyon / Analjezi Protokolü</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2 rounded border border-purple-100">
                      <span className="text-purple-600 block">Hedef RASS</span>
                      <span className="font-bold">-2 ile 0 arası</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-purple-100">
                      <span className="text-purple-600 block">Günlük Sedasyon Tatili</span>
                      <span className="font-bold">{selectedPatient.scores.rass <= -3 ? 'Planlanacak' : 'Uygulandı'}</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-purple-100">
                      <span className="text-purple-600 block">Ağrı Değerlendirme</span>
                      <span className="font-bold">BPS / CPOT</span>
                    </div>
                    <div className={`p-2 rounded border ${selectedPatient.scores.camICU ? 'bg-red-50 border-red-200' : 'bg-white border-purple-100'}`}>
                      <span className="text-purple-600 block">CAM-ICU Deliryum</span>
                      <span className={`font-bold ${selectedPatient.scores.camICU ? 'text-red-700' : ''}`}>{selectedPatient.scores.camICU ? 'POZİTİF' : 'NEGATİF'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeDetailTab === 'infuzyon' && (
              <div className="space-y-3">
                {selectedPatient.infusions.length > 0 ? selectedPatient.infusions.map((inf, i) => (
                  <div key={i} className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-emerald-800">{inf.name}</span>
                      <p className="text-[10px] text-emerald-600 mt-0.5">{inf.name === 'Noradrenalin' ? 'Vazopresör — Titrasyon: MAP > 65 mmHg hedef' : inf.name === 'Propofol' ? 'Sedatif — RASS hedef: -2' : inf.name === 'Fentanil' ? 'Analjezik — BPS < 5 hedef' : 'Sürekli infüzyon'}</p>
                    </div>
                    <span className="text-sm font-black text-emerald-700">{inf.rate} {inf.unit}</span>
                  </div>
                )) : (
                  <div className="text-center py-8 text-slate-400">
                    <Syringe size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aktif infüzyon yok</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* APACHE Calculator Modal */}
      <Modal open={showAPACHE} onClose={() => setShowAPACHE(false)} title="APACHE II Skor Hesaplayıcı">
        <APACHECalculator onClose={() => setShowAPACHE(false)} />
      </Modal>

      {/* SOFA Calculator Modal */}
      <Modal open={showSOFA} onClose={() => setShowSOFA(false)} title="SOFA Skor Hesaplayıcı">
        <SOFACalculator onClose={() => setShowSOFA(false)} />
      </Modal>
    </div>
  );
}
