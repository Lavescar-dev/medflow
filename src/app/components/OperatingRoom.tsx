import React, { useState } from 'react';
import {
  Stethoscope, Clock, ShieldAlert, CheckCircle2, User, FileText, Activity,
  AlertTriangle, X, Plus, Edit3, Printer, Save, Search, Eye, Heart,
  ClipboardList, Syringe, RefreshCw, Calendar, ChevronRight, Timer,
  Play, Pause, Square, FileSignature, Shield, Thermometer, Package,
  Send, Clipboard, Hash
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Surgery {
  id: number; room: string; scheduledTime: string; estimatedDuration: string;
  patient: string; age: string; gender: string; tc: string; bloodType: string;
  procedure: string; procedureCode: string; surgeon: string; assistant: string;
  anesthesiologist: string; anesthesiaType: string; scrubNurse: string;
  status: 'Planlandı' | 'Pre-Op' | 'Anestezi' | 'Devam Ediyor' | 'Kapanış' | 'PACU' | 'Tamamlandı' | 'İptal';
  risk: 'ASA I' | 'ASA II' | 'ASA III' | 'ASA IV';
  allergies: string[]; consentSigned: boolean; siteMarked: boolean;
  whoChecklist: {
    signIn: { item: string; done: boolean }[];
    timeOut: { item: string; done: boolean }[];
    signOut: { item: string; done: boolean }[];
  };
  notes: string; startTime: string; endTime: string; elapsedMin: number;
  instrumentCount: { initial: number; final: number; matched: boolean };
  spongeCount: { initial: number; final: number; matched: boolean };
  specimen: { type: string; sent: boolean; pathNo: string };
  medulaSUT: string;
}

const whoSignIn = [
  'Hasta kimliği doğrulandı (isim + TC + bileklik)',
  'Cerrahi bölge işaretlendi ve doğrulandı',
  'Anestezi güvenlik kontrolü tamamlandı',
  'Pulse oksimetre takıldı ve çalışıyor',
  'Bilinen alerji var mı? → Ekip bilgilendirildi',
  'Zor havayolu / aspirasyon riski değerlendirildi',
  'Kan kaybı riski (>500ml): Kan ürünü hazır',
  'Onam formu imzalı ve dosyada mevcut',
];
const whoTimeOut = [
  'Tüm ekip üyeleri kendini tanıttı (isim + rol)',
  'Hasta adı, prosedür ve cerrahi taraf doğrulandı',
  'Antibiyotik profilaksisi son 60 dk içinde verildi',
  'Kritik olaylar tartışıldı — Cerrah: Kritik adımlar?',
  'Kritik olaylar — Anestezi: Hasta spesifik endişeler?',
  'Kritik olaylar — Hemşire: Sterilite, ekipman hazır?',
  'Görüntüleme sonuçları salonda mevcut',
  'DVT profilaksisi uygulandı (mekanik/farmakolojik)',
];
const whoSignOut = [
  'Prosedür adı kaydedildi',
  'Alet sayımı doğrulandı (eşleşiyor)',
  'Sponç/kompres sayımı doğrulandı (eşleşiyor)',
  'Patoloji spesimeni etiketlendi ve gönderildi',
  'Ekipman sorunu kaydedildi (varsa)',
  'Post-op bakım planı cerrah tarafından açıklandı',
  'PACU / YBÜ takip planı belirlendi',
  'Ameliyat notu dikte edildi / yazıldı',
];

const mockSurgeries: Surgery[] = [
  {
    id: 1, room: 'Salon 1', scheduledTime: '08:30', estimatedDuration: '3 saat',
    patient: 'Zeynep Kaya', age: '62', gender: 'K', tc: '111***222', bloodType: 'A Rh(+)',
    procedure: 'Koroner Arter Bypass Greft (CABG x3)', procedureCode: '36.11',
    surgeon: 'Prof. Dr. Can Yılmaz', assistant: 'Op. Dr. Murat B.', anesthesiologist: 'Uzm. Dr. Hakan Çelik',
    anesthesiaType: 'Genel (Endotrakeal)', scrubNurse: 'Hmş. Seda A.',
    status: 'Devam Ediyor', risk: 'ASA III', allergies: ['Latex'], consentSigned: true, siteMarked: true,
    whoChecklist: {
      signIn: whoSignIn.map(item => ({ item, done: true })),
      timeOut: whoTimeOut.map(item => ({ item, done: true })),
      signOut: whoSignOut.map((item, i) => ({ item, done: i < 2 })),
    },
    notes: 'LAD, Cx ve RCA bypass. EF: %45. IABP yerleştirildi. Kardiyopulmoner bypass devam.',
    startTime: '09:15', endTime: '', elapsedMin: 135,
    instrumentCount: { initial: 48, final: 0, matched: false },
    spongeCount: { initial: 20, final: 0, matched: false },
    specimen: { type: '', sent: false, pathNo: '' },
    medulaSUT: 'P604080',
  },
  {
    id: 2, room: 'Salon 1', scheduledTime: '13:00', estimatedDuration: '2 saat',
    patient: 'Mehmet Demir', age: '55', gender: 'E', tc: '222***333', bloodType: 'B Rh(+)',
    procedure: 'Apandektomi (Laparoskopik)', procedureCode: '47.01',
    surgeon: 'Op. Dr. Sinan Kaya', assistant: 'Dr. Elif T.', anesthesiologist: 'Uzm. Dr. Hakan Çelik',
    anesthesiaType: 'Genel Anestezi', scrubNurse: 'Hmş. Derya S.',
    status: 'Pre-Op', risk: 'ASA II', allergies: ['Penisilin'], consentSigned: true, siteMarked: false,
    whoChecklist: {
      signIn: whoSignIn.map((item, i) => ({ item, done: i < 4 })),
      timeOut: whoTimeOut.map(item => ({ item, done: false })),
      signOut: whoSignOut.map(item => ({ item, done: false })),
    },
    notes: 'Akut apandisit. WBC: 15.000. USG: 12mm.', startTime: '', endTime: '', elapsedMin: 0,
    instrumentCount: { initial: 0, final: 0, matched: false },
    spongeCount: { initial: 0, final: 0, matched: false },
    specimen: { type: 'Appendiks vermiformis', sent: false, pathNo: '' },
    medulaSUT: 'P604520',
  },
  {
    id: 3, room: 'Salon 2', scheduledTime: '08:00', estimatedDuration: '45 dk',
    patient: 'Ali Çelik', age: '70', gender: 'E', tc: '333***444', bloodType: 'O Rh(+)',
    procedure: 'Katarakt (Fakoemülsifikasyon) - Sol Göz', procedureCode: '13.41',
    surgeon: 'Op. Dr. Elif Sarı', assistant: '', anesthesiologist: 'Lokal',
    anesthesiaType: 'Topikal + Retrobulber', scrubNurse: 'Hmş. Ayşe K.',
    status: 'PACU', risk: 'ASA II', allergies: [], consentSigned: true, siteMarked: true,
    whoChecklist: {
      signIn: whoSignIn.map(item => ({ item, done: true })),
      timeOut: whoTimeOut.map(item => ({ item, done: true })),
      signOut: whoSignOut.map(item => ({ item, done: true })),
    },
    notes: 'Komplikasyonsuz. IOL implante. GİB normal.', startTime: '08:15', endTime: '08:55', elapsedMin: 40,
    instrumentCount: { initial: 22, final: 22, matched: true },
    spongeCount: { initial: 8, final: 8, matched: true },
    specimen: { type: '', sent: false, pathNo: '' },
    medulaSUT: 'P602450',
  },
  {
    id: 4, room: 'Salon 2', scheduledTime: '10:00', estimatedDuration: '1.5 saat',
    patient: 'Fatma Şahin', age: '50', gender: 'K', tc: '444***555', bloodType: 'AB Rh(+)',
    procedure: 'Laparoskopik Kolesistektomi', procedureCode: '51.23',
    surgeon: 'Op. Dr. Sinan Kaya', assistant: 'Dr. Elif T.', anesthesiologist: 'Uzm. Dr. Ayşe B.',
    anesthesiaType: 'Genel Anestezi', scrubNurse: 'Hmş. Seda A.',
    status: 'Tamamlandı', risk: 'ASA I', allergies: [], consentSigned: true, siteMarked: true,
    whoChecklist: {
      signIn: whoSignIn.map(item => ({ item, done: true })),
      timeOut: whoTimeOut.map(item => ({ item, done: true })),
      signOut: whoSignOut.map(item => ({ item, done: true })),
    },
    notes: 'Calot üçgeni diseke. Hemostaz tamam.', startTime: '10:20', endTime: '11:35', elapsedMin: 75,
    instrumentCount: { initial: 34, final: 34, matched: true },
    spongeCount: { initial: 12, final: 12, matched: true },
    specimen: { type: 'Safra kesesi', sent: true, pathNo: 'PAT-2026-00891' },
    medulaSUT: 'P604480',
  },
  {
    id: 5, room: 'Salon 3', scheduledTime: '09:00', estimatedDuration: '2 saat',
    patient: 'Hasan Öztürk', age: '38', gender: 'E', tc: '555***666', bloodType: 'A Rh(-)',
    procedure: 'Artroskopik Menisküs Tamiri (Sol Diz)', procedureCode: '80.6',
    surgeon: 'Doç. Dr. Murat Aydın', assistant: 'Dr. Can S.', anesthesiologist: 'Uzm. Dr. Ayşe B.',
    anesthesiaType: 'Spinal Anestezi', scrubNurse: 'Hmş. Derya S.',
    status: 'Anestezi', risk: 'ASA I', allergies: [], consentSigned: true, siteMarked: true,
    whoChecklist: {
      signIn: whoSignIn.map(item => ({ item, done: true })),
      timeOut: whoTimeOut.map((item, i) => ({ item, done: i < 3 })),
      signOut: whoSignOut.map(item => ({ item, done: false })),
    },
    notes: 'Sol diz medial menisküs. MR doğrulanmış. Spinal uygulandı, motor blok bekleniyor.',
    startTime: '', endTime: '', elapsedMin: 0,
    instrumentCount: { initial: 28, final: 0, matched: false },
    spongeCount: { initial: 10, final: 0, matched: false },
    specimen: { type: '', sent: false, pathNo: '' },
    medulaSUT: 'P603210',
  },
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

export function OperatingRoom() {
  const [surgeries, setSurgeries] = useState(mockSurgeries);
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);
  const [roomFilter, setRoomFilter] = useState('Tümü');
  const [activeDetailTab, setActiveDetailTab] = useState('who');

  const statusColor = (s: string) => {
    const map: Record<string, string> = { 'Planlandı': 'slate', 'Pre-Op': 'amber', 'Anestezi': 'cyan', 'Devam Ediyor': 'blue', 'Kapanış': 'purple', 'PACU': 'orange', 'Tamamlandı': 'green', 'İptal': 'red' };
    return map[s] || 'slate';
  };

  const ongoing = surgeries.filter(s => ['Devam Ediyor', 'Anestezi', 'Kapanış'].includes(s.status)).length;
  const preOp = surgeries.filter(s => s.status === 'Pre-Op' || s.status === 'Planlandı').length;
  const completed = surgeries.filter(s => s.status === 'Tamamlandı' || s.status === 'PACU').length;
  const rooms = [...new Set(surgeries.map(s => s.room))];
  const filtered = roomFilter === 'Tümü' ? surgeries : surgeries.filter(s => s.room === roomFilter);

  const toggleWHO = (surgeryId: number, phase: 'signIn' | 'timeOut' | 'signOut', idx: number) => {
    setSurgeries(prev => prev.map(s => s.id === surgeryId ? {
      ...s, whoChecklist: {
        ...s.whoChecklist,
        [phase]: s.whoChecklist[phase].map((c, i) => i === idx ? { ...c, done: !c.done } : c)
      }
    } : s));
    if (selectedSurgery?.id === surgeryId) {
      setSelectedSurgery(prev => prev ? {
        ...prev, whoChecklist: {
          ...prev.whoChecklist,
          [phase]: prev.whoChecklist[phase].map((c, i) => i === idx ? { ...c, done: !c.done } : c)
        }
      } : null);
    }
  };

  const getWHOProgress = (s: Surgery) => {
    const all = [...s.whoChecklist.signIn, ...s.whoChecklist.timeOut, ...s.whoChecklist.signOut];
    return { done: all.filter(c => c.done).length, total: all.length };
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Ameliyathane Yönetimi</h2>
          <p className="text-sm text-slate-500">WHO Cerrahi Güvenlik (3 Faz), alet/sponç sayımı, spesimen takibi, SUT kodlama</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"><Calendar size={14} /> Haftalık Plan</button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"><Plus size={14} /> Yeni Ameliyat</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-none">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <p className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Devam Eden</p>
          <p className="text-2xl font-black text-blue-700 mt-0.5">{ongoing}</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><p className="text-[10px] font-bold text-amber-600 uppercase">Pre-Op / Planlanan</p><p className="text-2xl font-black text-amber-700 mt-0.5">{preOp}</p></div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200"><p className="text-[10px] font-bold text-emerald-600 uppercase">Tamamlanan</p><p className="text-2xl font-black text-emerald-700 mt-0.5">{completed}</p></div>
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-white"><p className="text-[10px] font-bold text-slate-400 uppercase">Aktif Salon</p><p className="text-2xl font-black mt-0.5">{rooms.length}</p></div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 flex-none">
        {['Tümü', ...rooms].map(r => (
          <button key={r} onClick={() => setRoomFilter(r)}
            className={twMerge('px-2.5 py-1 rounded-lg text-[10px] font-semibold border',
              roomFilter === r ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            )}>{r}</button>
        ))}
      </div>

      {/* Surgery Cards */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filtered.map(s => {
          const wp = getWHOProgress(s);
          return (
            <div key={s.id} onClick={() => { setSelectedSurgery(s); setActiveDetailTab('who'); }}
              className={twMerge(
                "bg-white rounded-xl border shadow-sm p-4 flex flex-col md:flex-row gap-4 group transition-all hover:shadow-md cursor-pointer",
                s.status === 'Devam Ediyor' ? 'border-blue-300 shadow-blue-100' : 'border-slate-200 hover:border-blue-200'
              )}>
              <div className="w-full md:w-40 flex-none text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 pr-3">
                <div className="font-black text-lg text-slate-800">{s.room}</div>
                <div className="text-xs font-semibold text-slate-500 flex items-center justify-center md:justify-start gap-1"><Clock size={12} /> {s.scheduledTime}</div>
                <div className="text-[10px] text-slate-400">~{s.estimatedDuration}</div>
                {s.status === 'Devam Ediyor' && (
                  <div className="mt-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center justify-center gap-1 animate-pulse">
                    <Timer size={10} /> {Math.floor(s.elapsedMin / 60)}s {s.elapsedMin % 60}dk
                  </div>
                )}
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-bold text-sm text-slate-800">{s.patient}</h4>
                  <span className="text-[10px] text-slate-400">{s.age}{s.gender}</span>
                  <Badge color={statusColor(s.status)}>{s.status}</Badge>
                  <Badge color={s.risk.includes('III') || s.risk.includes('IV') ? 'red' : s.risk.includes('II') ? 'amber' : 'green'}>{s.risk}</Badge>
                  {s.allergies.length > 0 && <Badge color="red">Alerji: {s.allergies.join(', ')}</Badge>}
                </div>
                <p className="text-xs font-semibold text-blue-600">{s.procedure}</p>
                <p className="text-[9px] text-slate-400 font-mono">SUT: {s.medulaSUT} • Kod: {s.procedureCode}</p>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-500">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{s.surgeon}</span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{s.anesthesiologist}</span>
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{s.scrubNurse}</span>
                </div>

                {/* WHO Progress Mini */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] text-slate-400">WHO:</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${wp.done === wp.total ? 'bg-emerald-500' : 'bg-blue-500'}`}
                      style={{ width: `${(wp.done / wp.total) * 100}%` }}></div>
                  </div>
                  <span className="text-[9px] text-slate-400">{wp.done}/{wp.total}</span>
                  {s.instrumentCount.matched && <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1 rounded">Alet OK</span>}
                  {s.spongeCount.matched && <span className="text-[8px] bg-emerald-100 text-emerald-600 px-1 rounded">Sponç OK</span>}
                  {s.specimen.sent && <span className="text-[8px] bg-purple-100 text-purple-600 px-1 rounded">Spesimen</span>}
                </div>
              </div>

              <div className="w-full md:w-32 flex-none flex flex-col items-center md:items-end gap-1.5">
                {s.consentSigned ? <span className="text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Onam OK</span> : <span className="text-[10px] text-red-600 flex items-center gap-1"><AlertTriangle size={12} /> Onam Eksik</span>}
                {s.startTime && <span className="text-[10px] text-slate-500">Baş: {s.startTime}</span>}
                {s.endTime && <span className="text-[10px] text-slate-500">Bitiş: {s.endTime}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedSurgery} onClose={() => setSelectedSurgery(null)} title={`Ameliyat — ${selectedSurgery?.room || ''} • ${selectedSurgery?.patient || ''}`} wide>
        {selectedSurgery && (
          <div className="space-y-5">
            {/* Banner */}
            <div className="bg-slate-800 rounded-xl p-4 text-white">
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{selectedSurgery.patient}</h3>
                    <Badge color={statusColor(selectedSurgery.status)}>{selectedSurgery.status}</Badge>
                    <Badge color={selectedSurgery.risk.includes('III') ? 'red' : 'amber'}>{selectedSurgery.risk}</Badge>
                  </div>
                  <p className="text-xs text-slate-300">{selectedSurgery.age}{selectedSurgery.gender} • TC: {selectedSurgery.tc} • Kan: {selectedSurgery.bloodType}</p>
                  <p className="text-sm text-blue-400 mt-1">{selectedSurgery.procedure}</p>
                  <p className="text-[10px] text-slate-400 font-mono">SUT: {selectedSurgery.medulaSUT} • Prosedür: {selectedSurgery.procedureCode}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 h-fit">
                  {[
                    { label: 'Salon', value: selectedSurgery.room },
                    { label: 'Planlanan', value: selectedSurgery.scheduledTime },
                    { label: 'Başlangıç', value: selectedSurgery.startTime || '—' },
                    { label: 'Bitiş', value: selectedSurgery.endTime || '—' },
                  ].map((v, i) => (
                    <div key={i} className="bg-slate-700/50 p-2 rounded text-center text-xs"><span className="text-slate-400 block">{v.label}</span><span className="font-bold">{v.value}</span></div>
                  ))}
                </div>
              </div>
            </div>

            {selectedSurgery.allergies.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                <span className="text-xs font-bold text-red-700">Alerji: {selectedSurgery.allergies.join(', ')}</span>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
              {[
                { id: 'who', label: 'WHO Güvenlik (3 Faz)' },
                { id: 'ekip', label: 'Cerrahi Ekip' },
                { id: 'sayim', label: 'Alet/Sponç Sayımı' },
                { id: 'notlar', label: 'Ameliyat Notu' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                  className={twMerge("px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap",
                    activeDetailTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                  )}>{tab.label}</button>
              ))}
            </div>

            {activeDetailTab === 'who' && (
              <div className="space-y-4">
                {(['signIn', 'timeOut', 'signOut'] as const).map(phase => {
                  const phaseLabel = phase === 'signIn' ? 'SIGN IN (Anestezi Öncesi)' : phase === 'timeOut' ? 'TIME OUT (Kesi Öncesi)' : 'SIGN OUT (Kapanış Öncesi)';
                  const phaseColor = phase === 'signIn' ? 'amber' : phase === 'timeOut' ? 'blue' : 'emerald';
                  const items = selectedSurgery.whoChecklist[phase];
                  const allDone = items.every(c => c.done);
                  return (
                    <div key={phase} className={`rounded-xl border-2 overflow-hidden ${allDone ? `border-${phaseColor === 'amber' ? 'amber' : phaseColor === 'blue' ? 'blue' : 'emerald'}-300` : 'border-slate-200'}`}>
                      <div className={`px-4 py-2 flex items-center justify-between ${allDone ? `bg-${phaseColor === 'amber' ? 'amber' : phaseColor === 'blue' ? 'blue' : 'emerald'}-50` : 'bg-slate-50'}`}>
                        <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Shield size={16} className={allDone ? 'text-emerald-500' : 'text-slate-400'} />
                          {phaseLabel}
                        </h4>
                        <span className="text-xs font-bold">{items.filter(c => c.done).length}/{items.length}</span>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {items.map((c, i) => (
                          <div key={i} className={twMerge("flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-slate-50",
                            c.done ? "bg-emerald-50/50" : ""
                          )} onClick={() => toggleWHO(selectedSurgery.id, phase, i)}>
                            <input type="checkbox" checked={c.done} readOnly className="w-4 h-4 accent-emerald-500" />
                            <span className={twMerge("text-xs", c.done ? "text-emerald-700" : "text-slate-700")}>{c.item}</span>
                            {c.done && <CheckCircle2 size={12} className="ml-auto text-emerald-500" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeDetailTab === 'ekip' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { role: 'Cerrah', name: selectedSurgery.surgeon },
                  { role: 'Asistan', name: selectedSurgery.assistant || '—' },
                  { role: 'Anestezist', name: selectedSurgery.anesthesiologist },
                  { role: 'Ameliyat Hmş.', name: selectedSurgery.scrubNurse },
                ].map((t, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 uppercase">{t.role}</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{t.name}</p>
                  </div>
                ))}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                  <p className="text-[10px] text-slate-500 uppercase">Anestezi Tipi</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedSurgery.anesthesiaType}</p>
                </div>
              </div>
            )}

            {activeDetailTab === 'sayim' && (
              <div className="space-y-4">
                {/* Instrument Count */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2"><Package size={16} /> Cerrahi Alet Sayımı</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-blue-100 text-center">
                      <p className="text-[10px] text-blue-600 uppercase">Başlangıç</p>
                      <p className="text-2xl font-black text-blue-700">{selectedSurgery.instrumentCount.initial || '—'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-100 text-center">
                      <p className="text-[10px] text-blue-600 uppercase">Bitiş</p>
                      <p className="text-2xl font-black text-blue-700">{selectedSurgery.instrumentCount.final || '—'}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${selectedSurgery.instrumentCount.matched ? 'bg-emerald-100 border border-emerald-200' : 'bg-slate-100 border border-slate-200'}`}>
                      <p className="text-[10px] uppercase">{selectedSurgery.instrumentCount.matched ? 'EŞLEŞİYOR' : 'BEKLENİYOR'}</p>
                      {selectedSurgery.instrumentCount.matched ? <CheckCircle2 size={24} className="mx-auto mt-1 text-emerald-500" /> : <Clock size={24} className="mx-auto mt-1 text-slate-400" />}
                    </div>
                  </div>
                </div>

                {/* Sponge Count */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-sm font-bold text-purple-700 mb-3 flex items-center gap-2"><Hash size={16} /> Sponç / Kompres Sayımı</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-purple-100 text-center">
                      <p className="text-[10px] text-purple-600 uppercase">Başlangıç</p>
                      <p className="text-2xl font-black text-purple-700">{selectedSurgery.spongeCount.initial || '—'}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-purple-100 text-center">
                      <p className="text-[10px] text-purple-600 uppercase">Bitiş</p>
                      <p className="text-2xl font-black text-purple-700">{selectedSurgery.spongeCount.final || '—'}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${selectedSurgery.spongeCount.matched ? 'bg-emerald-100 border border-emerald-200' : 'bg-slate-100 border border-slate-200'}`}>
                      <p className="text-[10px] uppercase">{selectedSurgery.spongeCount.matched ? 'EŞLEŞİYOR' : 'BEKLENİYOR'}</p>
                      {selectedSurgery.spongeCount.matched ? <CheckCircle2 size={24} className="mx-auto mt-1 text-emerald-500" /> : <Clock size={24} className="mx-auto mt-1 text-slate-400" />}
                    </div>
                  </div>
                  {!selectedSurgery.spongeCount.matched && selectedSurgery.spongeCount.initial > 0 && (
                    <div className="mt-2 bg-red-50 text-red-700 text-xs p-2 rounded-lg border border-red-200 flex items-center gap-1.5">
                      <AlertTriangle size={14} /> Sayım eşleşmeden ameliyat kapatılamaz! Röntgen kontrolü gerekebilir.
                    </div>
                  )}
                </div>

                {/* Specimen */}
                {selectedSurgery.specimen.type && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <h4 className="text-sm font-bold text-amber-700 mb-3 flex items-center gap-2"><Clipboard size={16} /> Patoloji Spesimeni</h4>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-2 rounded border border-amber-100"><span className="text-amber-600 block">Materyal</span><span className="font-bold">{selectedSurgery.specimen.type}</span></div>
                      <div className="bg-white p-2 rounded border border-amber-100"><span className="text-amber-600 block">Patoloji No</span><span className="font-bold">{selectedSurgery.specimen.pathNo || 'Henüz atanmadı'}</span></div>
                      <div className={`p-2 rounded text-center ${selectedSurgery.specimen.sent ? 'bg-emerald-100 border border-emerald-200' : 'bg-white border border-amber-100'}`}>
                        <span className="block">{selectedSurgery.specimen.sent ? 'Gönderildi' : 'Gönderilmedi'}</span>
                        {selectedSurgery.specimen.sent ? <CheckCircle2 size={16} className="mx-auto mt-1 text-emerald-500" /> : <button className="mt-1 px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-bold">Gönder</button>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeDetailTab === 'notlar' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Ameliyat Notu</h4>
                  <textarea rows={6} defaultValue={selectedSurgery.notes}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Save size={14} /> Notu Kaydet</button>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Printer size={14} /> Yazdır</button>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Send size={14} /> MEDULA SUT Bildir</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4 border-t border-slate-100">
              <button className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 flex items-center justify-center gap-1.5"><Activity size={14} /> Monitör</button>
              <button className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold hover:bg-purple-100 flex items-center justify-center gap-1.5"><FileSignature size={14} /> Op. Notu</button>
              <button className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold hover:bg-amber-100 flex items-center justify-center gap-1.5"><FileText size={14} /> Onam</button>
              <button className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 flex items-center justify-center gap-1.5"><CheckCircle2 size={14} /> PACU</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
