import React, { useState } from 'react';
import {
  Users, User, FileText, Pill, FlaskConical, Stethoscope,
  Activity, Clock, CheckCircle2, ChevronRight, Search,
  Plus, Edit3, Printer, Save, FileSignature, X, AlertTriangle,
  Send, RefreshCw, Trash2, Eye, Heart, Thermometer, Wind,
  ClipboardList, Download, Copy, Ban, Shield, Droplet, Calendar
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Types
interface WaitingPatient {
  id: number; name: string; tc: string; age: string; gender: string;
  time: string; status: 'İçeride' | 'Bekliyor' | 'Kayıtta' | 'Gecikti' | 'Tamamlandı';
  type: 'Randevulu' | 'Ayaktan'; complaint: string; bloodType: string;
  allergies: string[]; chronic: string[];
}

interface Diagnosis {
  code: string; name: string; type: 'Ana Tanı' | 'Ek Tanı';
}

interface OrderItem {
  id: string; type: 'lab' | 'radyoloji' | 'konsultasyon';
  description: string; priority: 'normal' | 'acil';
}

interface MedItem {
  name: string; dose: string; freq: string; duration: string; note: string;
}

// Mock Data
const mockPatients: WaitingPatient[] = [
  { id: 1, name: 'Ayşe Yılmaz', tc: '123***456', age: '41', gender: 'K', time: '10:15', status: 'İçeride', type: 'Randevulu', complaint: 'Baş ağrısı, halsizlik', bloodType: 'A Rh(+)', allergies: ['Penisilin'], chronic: ['Hipertansiyon'] },
  { id: 2, name: 'Mehmet Demir', tc: '234***567', age: '61', gender: 'E', time: '10:30', status: 'Bekliyor', type: 'Randevulu', complaint: 'Tansiyon kontrolü', bloodType: 'A Rh(+)', allergies: ['Penisilin', 'Sülfonamid'], chronic: ['HT', 'DM Tip 2'] },
  { id: 3, name: 'Zeynep Kaya', tc: '345***678', age: '28', gender: 'K', time: '10:45', status: 'Kayıtta', type: 'Randevulu', complaint: 'Boğaz ağrısı', bloodType: 'O Rh(+)', allergies: [], chronic: [] },
  { id: 4, name: 'Ali Çelik', tc: '456***789', age: '55', gender: 'E', time: '10:50', status: 'Bekliyor', type: 'Ayaktan', complaint: 'Karın ağrısı', bloodType: 'B Rh(-)', allergies: ['İbuprofen'], chronic: ['Ülser'] },
  { id: 5, name: 'Fatma Şahin', tc: '567***890', age: '72', gender: 'K', time: '11:00', status: 'Gecikti', type: 'Randevulu', complaint: 'Nefes darlığı', bloodType: 'AB Rh(+)', allergies: [], chronic: ['KOAH', 'KKY'] },
  { id: 6, name: 'Hasan Öztürk', tc: '678***901', age: '38', gender: 'E', time: '11:15', status: 'Bekliyor', type: 'Randevulu', complaint: 'Sırt ağrısı', bloodType: '0 Rh(+)', allergies: [], chronic: [] },
  { id: 7, name: 'Elif Arslan', tc: '789***012', age: '45', gender: 'K', time: '11:30', status: 'Bekliyor', type: 'Ayaktan', complaint: 'Baş dönmesi', bloodType: 'A Rh(-)', allergies: ['Aspirin'], chronic: ['Vertigo'] },
  { id: 8, name: 'Emre Yıldız', tc: '890***123', age: '19', gender: 'E', time: '09:30', status: 'Tamamlandı', type: 'Randevulu', complaint: 'Cilt döküntüsü', bloodType: 'B Rh(+)', allergies: [], chronic: [] },
];

const icdSuggestions = [
  { code: 'I10', name: 'Esansiyel (primer) hipertansiyon' },
  { code: 'E11', name: 'Tip 2 diabetes mellitus' },
  { code: 'J06.9', name: 'Akut üst solunum yolu enfeksiyonu, tanımlanmamış' },
  { code: 'R51', name: 'Baş ağrısı' },
  { code: 'R53', name: 'Halsizlik ve yorgunluk' },
  { code: 'K29.7', name: 'Gastrit, tanımlanmamış' },
  { code: 'M54.5', name: 'Bel ağrısı' },
  { code: 'J02.9', name: 'Akut farenjit, tanımlanmamış' },
  { code: 'R42', name: 'Baş dönmesi ve sersemlik' },
  { code: 'N39.0', name: 'İdrar yolu enfeksiyonu' },
];

const labPanels = [
  'Hemogram (Tam Kan Sayımı)', 'Biyokimya Paneli', 'Karaciğer Fonksiyon Testleri',
  'Böbrek Fonksiyon Testleri', 'Tiroit Fonksiyon Testleri', 'Lipid Profili',
  'HbA1c', 'CRP', 'Sedimentasyon', 'Tam İdrar Tahlili (TİT)', 'Prokalsitonin',
  'D-Dimer', 'Troponin', 'BNP / NT-proBNP', 'Koagülasyon Paneli (PT, aPTT, INR)',
];

const radyolojiTetkik = [
  'PA Akciğer Grafisi', 'Direkt Batın Grafisi', 'Tüm Batın USG', 'Tiroit USG',
  'Beyin MR', 'Lomber MR', 'Servikal MR', 'Toraks BT', 'Batın BT',
  'Ekokardiyografi', 'EKG', 'Holter Monitorizasyon', 'ABPM (24 saat TA)',
];

// Badge helper
function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200',
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

export function OutpatientClinic() {
  const [activeTab, setActiveTab] = useState('anamnez');
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<WaitingPatient>(mockPatients[0]);
  const [searchQueue, setSearchQueue] = useState('');

  // Anamnez state
  const [complaint, setComplaint] = useState('Baş ağrısı, halsizlik ve ara ara çarpıntı şikayeti ile başvurdu. Şikayetleri 3 gündür devam ediyor.');
  const [physExam, setPhysExam] = useState('TA: 150/95 mmHg, Nb: 88/dk, Ateş: 36.7°C, SpO2: %97\nSolunum sesleri doğal, raller/ronküs yok. Batın rahat, defans/rebound yok. Periferik ödem saptanmadı. Nörolojik muayene doğal.');
  const [historyNote, setHistoryNote] = useState('Özgeçmiş: Hipertansiyon (5 yıl). Soygeçmiş: Anne DM, Baba MI.');

  // Vitals state
  const [vitals, setVitals] = useState({ sys: '150', dia: '95', pulse: '88', temp: '36.7', spo2: '97', resp: '16', weight: '72', height: '165' });

  // Diagnosis state
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([
    { code: 'I10', name: 'Esansiyel (primer) hipertansiyon', type: 'Ana Tanı' },
    { code: 'R51', name: 'Baş ağrısı', type: 'Ek Tanı' },
  ]);
  const [icdSearch, setIcdSearch] = useState('');
  const [showIcdResults, setShowIcdResults] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'O1', type: 'lab', description: 'Hemogram (Tam Kan Sayımı)', priority: 'normal' },
    { id: 'O2', type: 'lab', description: 'Biyokimya Paneli', priority: 'normal' },
  ]);
  const [showLabPanel, setShowLabPanel] = useState(false);
  const [showRadPanel, setShowRadPanel] = useState(false);

  // Prescription state
  const [meds, setMeds] = useState<MedItem[]>([
    { name: 'Co-Diovan 80/12.5 mg Film Tablet', dose: '80/12.5 mg', freq: '1x1', duration: '30 gün', note: 'Sabah aç karnına' },
  ]);
  const [showMedSearch, setShowMedSearch] = useState(false);
  const [medulaStatus, setMedulaStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');

  // Rapor state
  const [reportType, setReportType] = useState('istirahat');
  const [reportDays, setReportDays] = useState('3');

  // Exam complete modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Select patient from queue
  const handleSelectPatient = (p: WaitingPatient) => {
    setSelectedPatient(p);
    if (p.status === 'Bekliyor' || p.status === 'Gecikti') {
      setPatients(prev => prev.map(pp => pp.id === p.id ? { ...pp, status: 'İçeride' as const } : pp.id === selectedPatient.id && pp.status === 'İçeride' ? { ...pp, status: 'Bekliyor' as const } : pp));
    }
  };

  // Call next patient
  const handleCallNext = () => {
    const next = patients.find(p => p.status === 'Bekliyor');
    if (next) handleSelectPatient(next);
  };

  // Complete exam
  const handleCompleteExam = () => {
    setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, status: 'Tamamlandı' as const } : p));
    setShowCompleteModal(false);
    const next = patients.find(p => p.status === 'Bekliyor');
    if (next) handleSelectPatient(next);
  };

  // Add diagnosis
  const handleAddDiagnosis = (icd: { code: string; name: string }) => {
    if (!diagnoses.find(d => d.code === icd.code)) {
      setDiagnoses([...diagnoses, { ...icd, type: diagnoses.length === 0 ? 'Ana Tanı' : 'Ek Tanı' }]);
    }
    setIcdSearch('');
    setShowIcdResults(false);
  };

  // Add order
  const addOrder = (type: 'lab' | 'radyoloji', desc: string) => {
    setOrders([...orders, { id: `O${Date.now()}`, type, description: desc, priority: 'normal' }]);
  };

  // MEDULA check
  const checkMedula = () => {
    setMedulaStatus('checking');
    setTimeout(() => setMedulaStatus('ok'), 2000);
  };

  const filteredQueue = searchQueue ? patients.filter(p => p.name.toLowerCase().includes(searchQueue.toLowerCase())) : patients;
  const waiting = patients.filter(p => p.status === 'Bekliyor').length;
  const completed = patients.filter(p => p.status === 'Tamamlandı').length;

  const filteredIcd = icdSearch.length >= 2 ? icdSuggestions.filter(i => i.name.toLowerCase().includes(icdSearch.toLowerCase()) || i.code.toLowerCase().includes(icdSearch.toLowerCase())) : [];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Poliklinik Muayene</h2>
          <p className="text-sm text-slate-500">Dahiliye Polikliniği - Uzm. Dr. Ahmet Karaca • 07 Nisan 2026 • <span className="font-semibold text-blue-600">{waiting} Bekleyen</span> / {completed} Tamamlanan</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCallNext} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
            <Users size={16} /> Sıradaki Hastayı Çağır
          </button>
          <button onClick={() => setShowCompleteModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
            <CheckCircle2 size={16} /> Muayeneyi Bitir
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Sidebar - Queue */}
        <div className="w-full lg:w-80 flex-none bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Users className="text-blue-500" size={18} /> Hasta Listesi
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-200/50 px-2 py-1 rounded">{waiting} Bekleyen</span>
          </div>

          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
              <input type="text" placeholder="Hasta ara..." value={searchQueue} onChange={e => setSearchQueue(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {filteredQueue.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={twMerge(
                    "w-full text-left p-3 hover:bg-blue-50 transition-colors flex items-center justify-between group",
                    selectedPatient.id === patient.id ? "bg-blue-50/50 border-l-4 border-blue-500" : "border-l-4 border-transparent",
                    patient.status === 'Tamamlandı' && "opacity-50"
                  )}
                >
                  <div className="min-w-0">
                    <h4 className={twMerge("font-semibold text-sm truncate", selectedPatient.id === patient.id ? "text-blue-700" : "text-slate-800")}>{patient.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={10} /> {patient.time}</span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[10px] font-medium text-slate-500">{patient.type}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{patient.complaint}</p>
                  </div>
                  <span className={twMerge(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2",
                    patient.status === 'İçeride' ? 'bg-blue-100 text-blue-700' :
                    patient.status === 'Bekliyor' ? 'bg-amber-100 text-amber-700' :
                    patient.status === 'Kayıtta' ? 'bg-slate-100 text-slate-600' :
                    patient.status === 'Tamamlandı' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-red-100 text-red-700'
                  )}>{patient.status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Active Patient */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-w-0">
          {/* Patient Banner */}
          <div className="bg-slate-800 p-4 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-3 flex-none">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 flex-shrink-0">
                <User size={24} className="text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedPatient.name} <span className="text-sm font-normal text-slate-400 ml-2">{selectedPatient.age} {selectedPatient.gender}</span></h3>
                <div className="text-sm text-slate-300 mt-0.5 flex items-center gap-3 flex-wrap">
                  <span className="font-mono bg-slate-700/50 px-1.5 rounded text-xs">TC: {selectedPatient.tc}</span>
                  <span className="flex items-center gap-1 text-xs"><Droplet size={12} className="text-red-400" /> {selectedPatient.bloodType}</span>
                  {selectedPatient.allergies.length > 0 && (
                    <span className="text-red-400 text-xs font-semibold flex items-center gap-1"><AlertTriangle size={12} /> Alerji: {selectedPatient.allergies.join(', ')}</span>
                  )}
                  {selectedPatient.chronic.length > 0 && (
                    <span className="text-amber-400 text-xs flex items-center gap-1"><Activity size={12} /> {selectedPatient.chronic.join(', ')}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold border border-slate-600 flex items-center gap-1.5">
                <FileText size={14} /> EHR
              </button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold border border-slate-600 flex items-center gap-1.5">
                <Calendar size={14} /> Geçmiş (4)
              </button>
            </div>
          </div>

          {/* Vitals Quick Bar */}
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border-b border-slate-200 overflow-x-auto flex-none">
            <span className="text-xs font-bold text-slate-500 flex-shrink-0">VİTAL:</span>
            {[
              { label: 'TA', value: `${vitals.sys}/${vitals.dia}`, unit: 'mmHg', flag: parseInt(vitals.sys) > 140 },
              { label: 'Nb', value: vitals.pulse, unit: 'bpm', flag: false },
              { label: 'Ateş', value: vitals.temp, unit: '°C', flag: parseFloat(vitals.temp) > 37.5 },
              { label: 'SpO2', value: vitals.spo2, unit: '%', flag: parseInt(vitals.spo2) < 94 },
              { label: 'SS', value: vitals.resp, unit: '/dk', flag: false },
              { label: 'Kilo', value: vitals.weight, unit: 'kg', flag: false },
            ].map((v, i) => (
              <div key={i} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${v.flag ? 'bg-red-100 text-red-700' : 'bg-white text-slate-700 border border-slate-200'}`}>
                <span className="text-slate-400">{v.label}:</span>
                <span className={v.flag ? 'text-red-700' : ''}>{v.value}</span>
                <span className="text-slate-400">{v.unit}</span>
              </div>
            ))}
          </div>

          {/* Exam Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 flex-none px-2 pt-2 gap-1 overflow-x-auto">
            {[
              { id: 'anamnez', name: 'Anamnez & Muayene', icon: Edit3 },
              { id: 'istekler', name: 'Tetkik İstemleri', icon: FlaskConical },
              { id: 'tani', name: 'Teşhis (ICD-10)', icon: Stethoscope },
              { id: 'recete', name: 'E-Reçete', icon: Pill },
              { id: 'rapor', name: 'Rapor / Sevk', icon: FileSignature },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-t border-x whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-white text-blue-600 border-slate-200 -mb-px"
                    : "bg-transparent text-slate-500 border-transparent hover:bg-slate-100"
                )}>
                <tab.icon size={16} /> {tab.name}
                {tab.id === 'istekler' && orders.length > 0 && <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded">{orders.length}</span>}
                {tab.id === 'tani' && diagnoses.length > 0 && <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded">{diagnoses.length}</span>}
                {tab.id === 'recete' && meds.length > 0 && <span className="bg-purple-100 text-purple-600 text-[10px] font-bold px-1.5 py-0.5 rounded">{meds.length}</span>}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            {/* ===== ANAMNEZ TAB ===== */}
            {activeTab === 'anamnez' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Şikayet ve Öykü</label>
                  <textarea rows={3} value={complaint} onChange={e => setComplaint(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none transition-all"
                    placeholder="Hastanın ana şikayetini, öyküsünü ve süresini giriniz..." />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Özgeçmiş / Soygeçmiş</label>
                  <textarea rows={2} value={historyNote} onChange={e => setHistoryNote(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-slate-700">Vital Bulgular</label>
                    <span className="text-xs text-slate-400">Son ölçüm: Bugün 10:15</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { key: 'sys', label: 'Sistolik (mmHg)', icon: Heart },
                      { key: 'dia', label: 'Diastolik (mmHg)', icon: Heart },
                      { key: 'pulse', label: 'Nabız (bpm)', icon: Activity },
                      { key: 'temp', label: 'Ateş (°C)', icon: Thermometer },
                      { key: 'spo2', label: 'SpO2 (%)', icon: Wind },
                      { key: 'resp', label: 'Solunum (/dk)', icon: Wind },
                      { key: 'weight', label: 'Kilo (kg)', icon: User },
                      { key: 'height', label: 'Boy (cm)', icon: User },
                    ].map(v => (
                      <div key={v.key}>
                        <label className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 mb-1"><v.icon size={10} /> {v.label}</label>
                        <input type="text" value={vitals[v.key as keyof typeof vitals]} onChange={e => setVitals({ ...vitals, [v.key]: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fizik Muayene Bulguları</label>
                  <textarea rows={4} value={physExam} onChange={e => setPhysExam(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none resize-none" />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {['Baş-Boyun Normal', 'KVS Normal', 'Solunum Normal', 'GİS Normal', 'GÜS Normal', 'Nörolojik Normal', 'Kas-İskelet Normal'].map(t => (
                      <button key={t} onClick={() => setPhysExam(prev => prev + '\n' + t + '.')}
                        className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-100 hover:bg-blue-100 font-semibold">{t}</button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm">
                    <Save size={16} /> Kaydet
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50">
                    <Copy size={16} /> Şablon Yükle
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50">
                    <ClipboardList size={16} /> Önceki Notları Kopyala
                  </button>
                </div>
              </div>
            )}

            {/* ===== ORDERS TAB ===== */}
            {activeTab === 'istekler' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex gap-3">
                  <button onClick={() => setShowLabPanel(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                    <FlaskConical size={16} /> Laboratuvar İstemi
                  </button>
                  <button onClick={() => setShowRadPanel(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">
                    <Activity size={16} /> Radyoloji İstemi
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700">
                    <Stethoscope size={16} /> Konsültasyon İste
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-3 border-b border-slate-200 bg-slate-100/50 flex justify-between items-center">
                      <h4 className="font-semibold text-slate-700 text-sm">Mevcut İstemler ({orders.length})</h4>
                      <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Send size={12} /> Tümünü Gönder</button>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {orders.map(o => (
                        <div key={o.id} className="p-3 flex items-center justify-between bg-white">
                          <div className="flex items-center gap-3">
                            <Badge color={o.type === 'lab' ? 'blue' : o.type === 'radyoloji' ? 'purple' : 'amber'}>
                              {o.type === 'lab' ? 'LAB' : o.type === 'radyoloji' ? 'RAD' : 'KONS'}
                            </Badge>
                            <span className="text-sm font-medium text-slate-700">{o.description}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select value={o.priority} onChange={e => setOrders(prev => prev.map(oo => oo.id === o.id ? { ...oo, priority: e.target.value as any } : oo))}
                              className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-600">
                              <option value="normal">Normal</option>
                              <option value="acil">Acil</option>
                            </select>
                            <button onClick={() => setOrders(prev => prev.filter(oo => oo.id !== o.id))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <FlaskConical size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Henüz istem eklenmedi.</p>
                  </div>
                )}

                {/* Lab Panel Modal */}
                <Modal open={showLabPanel} onClose={() => setShowLabPanel(false)} title="Laboratuvar Tetkik İstemi">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">İstemek istediğiniz testleri seçin:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {labPanels.map(panel => (
                        <button key={panel} onClick={() => { addOrder('lab', panel); }}
                          className={twMerge("text-left p-3 rounded-lg border text-sm font-medium transition-colors",
                            orders.find(o => o.description === panel)
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200"
                          )}>
                          {orders.find(o => o.description === panel) && <CheckCircle2 size={14} className="inline mr-2 text-blue-500" />}
                          {panel}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button onClick={() => setShowLabPanel(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">Tamam</button>
                    </div>
                  </div>
                </Modal>

                {/* Radiology Panel Modal */}
                <Modal open={showRadPanel} onClose={() => setShowRadPanel(false)} title="Radyoloji Tetkik İstemi">
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">İstemek istediğiniz görüntülemeyi seçin:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {radyolojiTetkik.map(t => (
                        <button key={t} onClick={() => { addOrder('radyoloji', t); }}
                          className={twMerge("text-left p-3 rounded-lg border text-sm font-medium transition-colors",
                            orders.find(o => o.description === t)
                              ? "bg-purple-50 border-purple-200 text-purple-700"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-200"
                          )}>
                          {orders.find(o => o.description === t) && <CheckCircle2 size={14} className="inline mr-2 text-purple-500" />}
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button onClick={() => setShowRadPanel(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700">Tamam</button>
                    </div>
                  </div>
                </Modal>
              </div>
            )}

            {/* ===== DIAGNOSIS TAB ===== */}
            {activeTab === 'tani' && (
              <div className="space-y-6 max-w-4xl">
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">ICD-10 Teşhis Ara</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="text" value={icdSearch}
                      onChange={e => { setIcdSearch(e.target.value); setShowIcdResults(e.target.value.length >= 2); }}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                      placeholder="Hastalık adı veya ICD kodu yazın (Örn: I10, baş ağrısı...)" />
                  </div>
                  {showIcdResults && filteredIcd.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredIcd.map(icd => (
                        <button key={icd.code} onClick={() => handleAddDiagnosis(icd)}
                          className="w-full text-left p-3 hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-slate-100 last:border-0">
                          <span className="font-mono font-bold text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{icd.code}</span>
                          <span className="text-sm text-slate-700">{icd.name}</span>
                          {diagnoses.find(d => d.code === icd.code) && <CheckCircle2 size={14} className="ml-auto text-emerald-500" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-3 border-b border-slate-200 bg-slate-100/50">
                    <h4 className="font-semibold text-slate-700 text-sm">Eklenen Tanılar ({diagnoses.length})</h4>
                  </div>
                  {diagnoses.length > 0 ? (
                    <div className="divide-y divide-slate-200">
                      {diagnoses.map((d, i) => (
                        <div key={d.code} className="p-3 flex items-center justify-between bg-white">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded font-mono text-sm">{d.code}</span>
                            <span className="text-sm font-medium text-slate-700">{d.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <select value={d.type} onChange={e => setDiagnoses(prev => prev.map((dd, ii) => ii === i ? { ...dd, type: e.target.value as any } : dd))}
                              className="text-xs border-slate-200 rounded p-1 outline-none bg-slate-50 text-slate-600">
                              <option>Ana Tanı</option>
                              <option>Ek Tanı</option>
                            </select>
                            <button onClick={() => setDiagnoses(prev => prev.filter((_, ii) => ii !== i))} className="text-red-500 hover:text-red-700 text-sm font-semibold">Sil</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-slate-400">Henüz tanı eklenmedi.</div>
                  )}
                </div>
              </div>
            )}

            {/* ===== E-REÇETE TAB ===== */}
            {activeTab === 'recete' && (
              <div className="space-y-6 max-w-4xl">
                {/* Allergy Warning */}
                {selectedPatient.allergies.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Alerji Uyarısı</p>
                      <p className="text-xs text-red-600 mt-1">Hasta <strong>{selectedPatient.allergies.join(', ')}</strong> alerjisi bildirmiştir.</p>
                    </div>
                  </div>
                )}

                {/* Meds List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">İlaçlar ({meds.length})</h4>
                    <button onClick={() => setMeds([...meds, { name: '', dose: '', freq: '1x1', duration: '7 gün', note: '' }])}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"><Plus size={14} /> İlaç Ekle</button>
                  </div>
                  {meds.map((med, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">İlaç #{idx + 1}</span>
                        {meds.length > 0 && <button onClick={() => setMeds(prev => prev.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="md:col-span-2">
                          <input type="text" placeholder="İlaç adı..." value={med.name} onChange={e => { const n = [...meds]; n[idx].name = e.target.value; setMeds(n); }}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                        </div>
                        <input type="text" placeholder="Doz" value={med.dose} onChange={e => { const n = [...meds]; n[idx].dose = e.target.value; setMeds(n); }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                        <select value={med.freq} onChange={e => { const n = [...meds]; n[idx].freq = e.target.value; setMeds(n); }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                          <option>1x1</option><option>2x1</option><option>3x1</option><option>4x1</option>
                        </select>
                        <select value={med.duration} onChange={e => { const n = [...meds]; n[idx].duration = e.target.value; setMeds(n); }}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                          <option>3 gün</option><option>5 gün</option><option>7 gün</option><option>10 gün</option><option>14 gün</option><option>30 gün</option><option>90 gün</option>
                        </select>
                      </div>
                      <input type="text" placeholder="Kullanım notu (ör: Aç karnına, yemekle birlikte)" value={med.note} onChange={e => { const n = [...meds]; n[idx].note = e.target.value; setMeds(n); }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white" />
                    </div>
                  ))}
                </div>

                {/* MEDULA */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-blue-500" />
                      <span className="text-sm font-bold text-slate-700">MEDULA Provizyon</span>
                    </div>
                    <button onClick={checkMedula} disabled={medulaStatus === 'checking'}
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
                      {medulaStatus === 'checking' ? <><RefreshCw size={14} className="animate-spin" /> Sorgulanıyor...</> : <><Send size={14} /> MEDULA Sorgula</>}
                    </button>
                  </div>
                  {medulaStatus === 'ok' && (
                    <div className="mt-3 bg-emerald-50 text-emerald-700 text-sm p-3 rounded-lg border border-emerald-200 flex items-center gap-2">
                      <CheckCircle2 size={16} /> MEDULA onayı alındı. Provizyon: PRV-2026-048291
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2">
                    <FileSignature size={16} /> E-Reçete Oluştur
                  </button>
                  <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
                    <Printer size={16} /> Yazdır
                  </button>
                </div>
              </div>
            )}

            {/* ===== RAPOR TAB ===== */}
            {activeTab === 'rapor' && (
              <div className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Rapor Türü</label>
                    <select value={reportType} onChange={e => setReportType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                      <option value="istirahat">İstirahat Raporu</option>
                      <option value="sevk">Sevk Belgesi</option>
                      <option value="saglikKurulu">Sağlık Kurulu Sevki</option>
                      <option value="ilaçRaporu">İlaç Kullanım Raporu</option>
                      <option value="ozurlu">Engelli Sağlık Kurulu Sevki</option>
                      <option value="epikriz">Poliklinik Epikriz</option>
                    </select>
                  </div>
                  {reportType === 'istirahat' && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-2">İstirahat Süresi (Gün)</label>
                      <input type="number" value={reportDays} onChange={e => setReportDays(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" min="1" max="10" />
                    </div>
                  )}
                </div>

                {reportType === 'istirahat' && (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-800">İstirahat Raporu Önizleme</h4>
                    <div className="bg-white p-4 rounded-lg border border-slate-200 text-sm space-y-2">
                      <p><strong>Hasta:</strong> {selectedPatient.name} ({selectedPatient.tc})</p>
                      <p><strong>Tanı:</strong> {diagnoses.map(d => `${d.code} - ${d.name}`).join('; ') || 'Tanı girilmedi'}</p>
                      <p><strong>İstirahat Süresi:</strong> {reportDays} gün (07.04.2026 - {String(7 + parseInt(reportDays || '0')).padStart(2, '0')}.04.2026)</p>
                      <p><strong>Hekim:</strong> Uzm. Dr. Ahmet Karaca - Dahiliye</p>
                    </div>
                  </div>
                )}

                {reportType === 'sevk' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Sevk Edilecek Branş</label>
                      <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                        <option>Kardiyoloji</option><option>Nöroloji</option><option>Göz Hastalıkları</option>
                        <option>KBB</option><option>Ortopedi</option><option>Üroloji</option>
                        <option>Genel Cerrahi</option><option>Göğüs Hastalıkları</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Sevk Gerekçesi</label>
                      <textarea rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none resize-none" placeholder="Sevk sebebini yazınız..." />
                    </div>
                  </div>
                )}

                {reportType === 'epikriz' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Poliklinik Epikriz Notu</label>
                      <textarea rows={6} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none resize-none"
                        defaultValue={`Hasta ${selectedPatient.complaint} şikayetiyle başvurdu.\n\nFizik Muayene:\n${physExam}\n\nTanı: ${diagnoses.map(d => d.code + ' - ' + d.name).join(', ')}\n\nTedavi planı uygulandı. Kontrol randevusu verildi.`} />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2">
                    <FileSignature size={16} /> Rapor Oluştur
                  </button>
                  <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
                    <Printer size={16} /> Yazdır
                  </button>
                  <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
                    <Send size={16} /> e-Nabız Gönder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Exam Modal */}
      <Modal open={showCompleteModal} onClose={() => setShowCompleteModal(false)} title="Muayeneyi Tamamla">
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-sm">
            <p><strong>Hasta:</strong> {selectedPatient.name}</p>
            <p><strong>Tanı:</strong> {diagnoses.map(d => `${d.code} - ${d.name}`).join('; ') || '—'}</p>
            <p><strong>İstem:</strong> {orders.length} adet</p>
            <p><strong>İlaç:</strong> {meds.length} adet</p>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-700">Onay Kontrol Listesi</p>
              <ul className="text-xs text-amber-600 mt-1 space-y-1">
                <li>• Tanı girildi mi? {diagnoses.length > 0 ? '✓' : '✗'}</li>
                <li>• E-Reçete gönderildi mi? {medulaStatus === 'ok' ? '✓' : '—'}</li>
                <li>• Tetkik istemleri gönderildi mi? {orders.length > 0 ? '✓' : '—'}</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button onClick={() => setShowCompleteModal(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50">İptal</button>
            <button onClick={handleCompleteExam} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={14} /> Muayeneyi Tamamla
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
