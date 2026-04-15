import React, { useState } from 'react';
import { Stethoscope, User, Clock, CheckCircle2, Search, Plus, X, Calendar, Activity, FileText, ClipboardList, ChevronRight, Save, Printer, Edit3, Eye, AlertTriangle, Calculator, Shield, Send, RefreshCw } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface FTRPatient {
  id: number; name: string; age: string; gender: string; tc: string;
  referringDoctor: string; referringDept: string; diagnosis: string; icdCode: string;
  program: string; totalSessions: number; completedSessions: number;
  startDate: string; status: 'Aktif' | 'Tamamlandı' | 'Bekliyor' | 'Askıda';
  therapist: string; sessionTime: string;
  modalities: string[]; exercises: { name: string; sets: string; reps: string; notes: string }[];
  progress: string; limitations: string;
  barthelIndex: number; fimScore: number;
  sixMWT: { baseline: number; current: number };
  medulaSessions: number; medulaApproved: number;
}

const mockPatients: FTRPatient[] = [
  {
    id: 1, name: 'Mustafa Yılmaz', age: '58', gender: 'E', tc: '111***222',
    referringDoctor: 'Doç. Dr. Murat Aydın', referringDept: 'Ortopedi',
    diagnosis: 'L4-L5 Disk Hernisi (Post-op)', icdCode: 'M51.1',
    program: 'Lomber Rehabilitasyon', totalSessions: 15, completedSessions: 8,
    startDate: '20.03.2026', status: 'Aktif', therapist: 'FTR Uzm. Elif K.', sessionTime: '09:00',
    modalities: ['TENS (20dk)', 'Ultrason (10dk)', 'Hotpack (15dk)', 'Traksiyon (15dk)'],
    exercises: [
      { name: 'Williams Fleksiyon Egzersizleri', sets: '3', reps: '10', notes: 'Ağrı sınırında' },
      { name: 'Pelvik Tilt', sets: '3', reps: '15', notes: '' },
      { name: 'Hamstring Germe', sets: '3', reps: '30sn', notes: 'Her iki taraf' },
      { name: 'Core Stabilizasyon', sets: '2', reps: '10', notes: 'İzometrik' },
    ],
    progress: 'VAS: 6→3. ROM artıyor. Yürüme mesafesi 200m→500m.',
    limitations: 'Ağır kaldırma yasağı. 5 kg üzeri yük kaldırmayacak.',
    barthelIndex: 85, fimScore: 110,
    sixMWT: { baseline: 200, current: 500 },
    medulaSessions: 8, medulaApproved: 15,
  },
  {
    id: 2, name: 'Zeynep Kaya', age: '72', gender: 'K', tc: '222***333',
    referringDoctor: 'Uzm. Dr. Ahmet K.', referringDept: 'Göğüs Hastalıkları',
    diagnosis: 'KOAH - Pulmoner Rehabilitasyon', icdCode: 'J44.1',
    program: 'Pulmoner Rehabilitasyon', totalSessions: 20, completedSessions: 3,
    startDate: '01.04.2026', status: 'Aktif', therapist: 'FTR Uzm. Mehmet A.', sessionTime: '10:30',
    modalities: ['Solunum egzersizleri (20dk)', 'İnsentif spirometre'],
    exercises: [
      { name: 'Diyafragmatik Solunum', sets: '3', reps: '10', notes: 'Yatarak ve oturarak' },
      { name: 'Büzük Dudak Solunumu', sets: '3', reps: '10', notes: '' },
      { name: 'ÜE Ergometresi', sets: '1', reps: '10dk', notes: 'Düşük yoğunluk' },
      { name: 'Yürüme Eğitimi', sets: '1', reps: '6dk', notes: '6DYT protokolü' },
    ],
    progress: '6DYT: 180m → 220m. Dispne Borg skoru azalıyor.',
    limitations: 'SpO2 < %88 olursa egzersizi kes.',
    barthelIndex: 70, fimScore: 95,
    sixMWT: { baseline: 180, current: 220 },
    medulaSessions: 3, medulaApproved: 20,
  },
  {
    id: 3, name: 'Ayşe Yılmaz', age: '41', gender: 'K', tc: '333***444',
    referringDoctor: 'Uzm. Dr. Ayşe D.', referringDept: 'Nöroloji',
    diagnosis: 'İskemik SVO - Sol Hemiparezi', icdCode: 'I63.9',
    program: 'Nörolojik Rehabilitasyon', totalSessions: 30, completedSessions: 12,
    startDate: '01.03.2026', status: 'Aktif', therapist: 'FTR Uzm. Elif K.', sessionTime: '11:00',
    modalities: ['Elektrik stimülasyonu (FES)', 'Bobath yaklaşımı'],
    exercises: [
      { name: 'Omuz ROM Egzersizleri', sets: '3', reps: '10', notes: 'Pasif/aktif asistif' },
      { name: 'El Kavrama Egzersizleri', sets: '3', reps: '15', notes: 'Hamur / top ile' },
      { name: 'Oturma Dengesi', sets: '3', reps: '5dk', notes: 'Statik ve dinamik' },
      { name: 'Transfer Eğitimi', sets: '-', reps: '5', notes: 'Yataktan TS\'ye' },
      { name: 'Yürüme Eğitimi', sets: '1', reps: '10dk', notes: 'Walker ile' },
    ],
    progress: 'Sol ÜE motor güç: 2→3. Oturma dengesi iyileşiyor.',
    limitations: 'Omuz sublüksasyonu riski. Askı kullanılacak.',
    barthelIndex: 45, fimScore: 72,
    sixMWT: { baseline: 0, current: 50 },
    medulaSessions: 12, medulaApproved: 30,
  },
  {
    id: 4, name: 'Ali Çelik', age: '55', gender: 'E', tc: '444***555',
    referringDoctor: 'Op. Dr. Sinan K.', referringDept: 'Ortopedi',
    diagnosis: 'Total Diz Protezi (Sol) Post-op', icdCode: 'Z96.65',
    program: 'Diz Protezi Rehabilitasyon', totalSessions: 20, completedSessions: 20,
    startDate: '15.02.2026', status: 'Tamamlandı', therapist: 'FTR Uzm. Mehmet A.', sessionTime: '14:00',
    modalities: ['Kriyoterapi', 'CPM cihazı'],
    exercises: [
      { name: 'Diz Fleksiyon/Ekstansiyon', sets: '3', reps: '15', notes: '' },
      { name: 'Kuadriseps İzometrik', sets: '3', reps: '10', notes: '' },
      { name: 'SLR', sets: '3', reps: '10', notes: '' },
      { name: 'Merdiven Eğitimi', sets: '1', reps: '2 kat', notes: '' },
    ],
    progress: 'ROM: 0-110°. Bağımsız yürüme. Merdiven inip çıkma OK.',
    limitations: 'Çapraz bacak / derin çömelme yasak.',
    barthelIndex: 95, fimScore: 120,
    sixMWT: { baseline: 300, current: 450 },
    medulaSessions: 20, medulaApproved: 20,
  },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function PhysicalTherapy() {
  const [selectedPatient, setSelectedPatient] = useState<FTRPatient | null>(null);
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [activeDetailTab, setActiveDetailTab] = useState('program');
  const [showBarthel, setShowBarthel] = useState(false);
  const [medulaStatus, setMedulaStatus] = useState<'idle' | 'sending' | 'ok'>('idle');

  // Barthel Calculator
  const [barthelItems, setBarthelItems] = useState<Record<string, number>>({
    beslenme: 10, banyo: 5, bakım: 5, giyinme: 10, bagirsak: 10,
    mesane: 10, tuvalet: 10, transfer: 15, mobilite: 15, merdiven: 10
  });
  const barthelTotal = Object.values(barthelItems).reduce((s, v) => s + v, 0);

  const filtered = statusFilter === 'Tümü' ? mockPatients : mockPatients.filter(p => p.status === statusFilter);
  const statusColor = (s: string) => s === 'Aktif' ? 'blue' : s === 'Tamamlandı' ? 'green' : s === 'Bekliyor' ? 'amber' : 'slate';

  const sendMedulaSession = () => { setMedulaStatus('sending'); setTimeout(() => setMedulaStatus('ok'), 1800); };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Fizik Tedavi ve Rehabilitasyon</h2>
          <p className="text-sm text-slate-500">FIM/Barthel indeks, 6DYT takibi, MEDULA FTR seans bildirimi</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBarthel(true)} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700"><Calculator size={14} /> Barthel</button>
          <div className="flex gap-1">
            {['Tümü', 'Aktif', 'Tamamlandı', 'Bekliyor'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                className={twMerge('px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border',
                  statusFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                )}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(p => (
            <div key={p.id} onClick={() => { setSelectedPatient(p); setActiveDetailTab('program'); }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-sm text-slate-800">{p.name}</h4>
                    <Badge color={statusColor(p.status)}>{p.status}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500"><span className="font-mono">{p.icdCode}</span> — {p.diagnosis}</p>
                  <p className="text-[10px] text-slate-500">Sevk: {p.referringDoctor} ({p.referringDept})</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>{p.program}</span>
                  <span className="font-bold">{p.completedSessions}/{p.totalSessions} seans</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${p.status === 'Tamamlandı' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${(p.completedSessions / p.totalSessions) * 100}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 mb-2">
                <div className="text-center p-1 rounded bg-slate-50 border border-slate-200 text-[9px]"><span className="block text-slate-400">Barthel</span><span className="font-bold">{p.barthelIndex}/100</span></div>
                <div className="text-center p-1 rounded bg-slate-50 border border-slate-200 text-[9px]"><span className="block text-slate-400">FIM</span><span className="font-bold">{p.fimScore}/126</span></div>
                <div className="text-center p-1 rounded bg-slate-50 border border-slate-200 text-[9px]"><span className="block text-slate-400">6DYT</span><span className="font-bold">{p.sixMWT.current}m</span></div>
                <div className="text-center p-1 rounded bg-slate-50 border border-slate-200 text-[9px]"><span className="block text-slate-400">MEDULA</span><span className="font-bold">{p.medulaSessions}/{p.medulaApproved}</span></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><Stethoscope size={10} /> {p.therapist}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {p.sessionTime}</span>
              </div>

              <div className="flex gap-1 mt-1.5 flex-wrap">
                {p.modalities.map((m, i) => <span key={i} className="text-[8px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-100">{m}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`FTR — ${selectedPatient?.name || ''}`}>
        {selectedPatient && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div><span className="text-slate-500 block">Tanı</span><span className="font-bold text-slate-800">{selectedPatient.icdCode} — {selectedPatient.diagnosis}</span></div>
              <div><span className="text-slate-500 block">Sevk Eden</span><span className="font-bold text-slate-800">{selectedPatient.referringDoctor}</span></div>
              <div><span className="text-slate-500 block">Terapist</span><span className="font-bold text-slate-800">{selectedPatient.therapist}</span></div>
              <div><span className="text-slate-500 block">Başlangıç</span><span className="font-bold text-slate-800">{selectedPatient.startDate}</span></div>
            </div>

            {/* Functional Scores */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                <p className="text-[10px] text-blue-600 uppercase font-bold">Barthel</p>
                <p className="text-2xl font-black text-blue-700">{selectedPatient.barthelIndex}<span className="text-xs font-normal text-blue-400">/100</span></p>
                <p className="text-[9px] text-blue-500">{selectedPatient.barthelIndex >= 80 ? 'Hafif bağımlı' : selectedPatient.barthelIndex >= 60 ? 'Orta bağımlı' : 'Ağır bağımlı'}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center">
                <p className="text-[10px] text-purple-600 uppercase font-bold">FIM</p>
                <p className="text-2xl font-black text-purple-700">{selectedPatient.fimScore}<span className="text-xs font-normal text-purple-400">/126</span></p>
                <p className="text-[9px] text-purple-500">{selectedPatient.fimScore >= 108 ? 'Bağımsız' : selectedPatient.fimScore >= 72 ? 'Modifiye bağımsız' : 'Bağımlı'}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                <p className="text-[10px] text-emerald-600 uppercase font-bold">6DYT</p>
                <p className="text-2xl font-black text-emerald-700">{selectedPatient.sixMWT.current}<span className="text-xs font-normal text-emerald-400">m</span></p>
                <p className="text-[9px] text-emerald-500">Başlangıç: {selectedPatient.sixMWT.baseline}m ({selectedPatient.sixMWT.current > selectedPatient.sixMWT.baseline ? '+' : ''}{selectedPatient.sixMWT.current - selectedPatient.sixMWT.baseline}m)</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-xl border border-cyan-200 text-center">
                <p className="text-[10px] text-cyan-600 uppercase font-bold">MEDULA Seans</p>
                <p className="text-2xl font-black text-cyan-700">{selectedPatient.medulaSessions}<span className="text-xs font-normal text-cyan-400">/{selectedPatient.medulaApproved}</span></p>
                <p className="text-[9px] text-cyan-500">Bildirilen / Onaylanan</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200">
              {[
                { id: 'program', label: 'Egzersiz Programı' },
                { id: 'ilerleme', label: 'İlerleme' },
                { id: 'medula', label: 'MEDULA FTR' },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveDetailTab(tab.id)}
                  className={twMerge("px-3 py-2 text-xs font-semibold border-b-2 whitespace-nowrap",
                    activeDetailTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500"
                  )}>{tab.label}</button>
              ))}
            </div>

            {activeDetailTab === 'program' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Modaliteler</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedPatient.modalities.map((m, i) => <span key={i} className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-100">{m}</span>)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Egzersiz Programı</h4>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50"><tr>
                      <th className="text-left py-2 px-3 font-semibold text-slate-500">Egzersiz</th>
                      <th className="text-center py-2 px-3 font-semibold text-slate-500">Set</th>
                      <th className="text-center py-2 px-3 font-semibold text-slate-500">Tekrar</th>
                      <th className="text-left py-2 px-3 font-semibold text-slate-500">Not</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPatient.exercises.map((ex, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium text-slate-800">{ex.name}</td>
                          <td className="py-2 px-3 text-center text-slate-600">{ex.sets}</td>
                          <td className="py-2 px-3 text-center text-slate-600">{ex.reps}</td>
                          <td className="py-2 px-3 text-slate-500">{ex.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-700">Seans İlerlemesi</h4>
                  <span className="text-sm font-bold text-blue-600">{selectedPatient.completedSessions}/{selectedPatient.totalSessions}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div className="h-3 rounded-full bg-blue-500" style={{ width: `${(selectedPatient.completedSessions / selectedPatient.totalSessions) * 100}%` }}></div>
                </div>
              </div>
            )}

            {activeDetailTab === 'ilerleme' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">İlerleme Notu</h4>
                  <p className="text-sm text-slate-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200 leading-relaxed">{selectedPatient.progress}</p>
                </div>
                {selectedPatient.limitations && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-700">Kısıtlamalar</p>
                      <p className="text-xs text-amber-600 mt-0.5">{selectedPatient.limitations}</p>
                    </div>
                  </div>
                )}
                {selectedPatient.sixMWT.baseline > 0 && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 mb-2">6 Dakika Yürüme Testi (6DYT) Takibi</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500">Başlangıç</p>
                        <p className="text-xl font-black text-slate-600">{selectedPatient.sixMWT.baseline}m</p>
                      </div>
                      <div className="flex-1 bg-slate-200 rounded-full h-2 relative">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((selectedPatient.sixMWT.current / 600) * 100, 100)}%` }}></div>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-500">Güncel</p>
                        <p className="text-xl font-black text-emerald-600">{selectedPatient.sixMWT.current}m</p>
                      </div>
                      <div className="text-center bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
                        <p className="text-[10px] text-emerald-600">Değişim</p>
                        <p className="text-lg font-black text-emerald-700">+{selectedPatient.sixMWT.current - selectedPatient.sixMWT.baseline}m</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeDetailTab === 'medula' && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-blue-600" />
                      <span className="text-sm font-bold text-blue-800">MEDULA FTR Seans Bildirimi</span>
                    </div>
                    <button onClick={sendMedulaSession} disabled={medulaStatus === 'sending'}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5">
                      {medulaStatus === 'sending' ? <><RefreshCw size={12} className="animate-spin" /> Gönderiliyor...</> :
                       medulaStatus === 'ok' ? <><CheckCircle2 size={12} /> Gönderildi</> :
                       <><Send size={12} /> Seans Bildir</>}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600 block">Onaylanan Seans</span><span className="font-bold">{selectedPatient.medulaApproved}</span></div>
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600 block">Bildirilen Seans</span><span className="font-bold">{selectedPatient.medulaSessions}</span></div>
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600 block">Kalan</span><span className="font-bold">{selectedPatient.medulaApproved - selectedPatient.medulaSessions}</span></div>
                    <div className="bg-white p-2 rounded border border-blue-100"><span className="text-blue-600 block">ICD-10</span><span className="font-bold">{selectedPatient.icdCode}</span></div>
                  </div>
                  {medulaStatus === 'ok' && (
                    <div className="mt-2 bg-emerald-50 text-emerald-700 text-xs p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> MEDULA FTR seans bildirimi başarılı. SUT faturalama kodu aktive edildi.
                    </div>
                  )}
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-700 mb-2">MEDULA FTR Rapor Gereksinimleri</h4>
                  <div className="space-y-1 text-slate-600">
                    <p>• 10 seans sonrası ara değerlendirme raporu zorunludur</p>
                    <p>• Seans uzatma için FTR uzman hekim raporu gereklidir</p>
                    <p>• Her seans en az 30 dakika olmalıdır (SUT kriteri)</p>
                    <p>• Aynı gün birden fazla seans bildirilemez (SUT 2.4.4.K-1)</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Save size={12} /> Seans Kaydet</button>
              <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Printer size={12} /> Rapor Yazdır</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Barthel Calculator */}
      <Modal open={showBarthel} onClose={() => setShowBarthel(false)} title="Barthel Günlük Yaşam Aktiviteleri İndeksi">
        <div className="space-y-3">
          <p className="text-xs text-slate-500">Mahoney & Barthel (1965) — Günlük yaşam aktivitelerinde bağımsızlık düzeyi</p>
          {[
            { key: 'beslenme', label: 'Beslenme', options: [{ v: 0, l: 'Bağımlı' }, { v: 5, l: 'Yardımlı' }, { v: 10, l: 'Bağımsız' }] },
            { key: 'banyo', label: 'Banyo', options: [{ v: 0, l: 'Bağımlı' }, { v: 5, l: 'Bağımsız' }] },
            { key: 'bakım', label: 'Kişisel Bakım', options: [{ v: 0, l: 'Bağımlı' }, { v: 5, l: 'Bağımsız' }] },
            { key: 'giyinme', label: 'Giyinme', options: [{ v: 0, l: 'Bağımlı' }, { v: 5, l: 'Yardımlı' }, { v: 10, l: 'Bağımsız' }] },
            { key: 'bagirsak', label: 'Bağırsak Kontrolü', options: [{ v: 0, l: 'İnkontinan' }, { v: 5, l: 'Ara sıra' }, { v: 10, l: 'Kontinent' }] },
            { key: 'mesane', label: 'Mesane Kontrolü', options: [{ v: 0, l: 'İnkontinan' }, { v: 5, l: 'Ara sıra' }, { v: 10, l: 'Kontinent' }] },
            { key: 'tuvalet', label: 'Tuvalet Kullanımı', options: [{ v: 0, l: 'Bağımlı' }, { v: 5, l: 'Yardımlı' }, { v: 10, l: 'Bağımsız' }] },
            { key: 'transfer', label: 'Transfer (Yatak-Sandalye)', options: [{ v: 0, l: 'Yapamaz' }, { v: 5, l: 'Çok yardımlı' }, { v: 10, l: 'Az yardımlı' }, { v: 15, l: 'Bağımsız' }] },
            { key: 'mobilite', label: 'Mobilite (Düz zeminde)', options: [{ v: 0, l: 'İmmobil' }, { v: 5, l: 'TS bağımsız' }, { v: 10, l: 'Yardımlı yürür' }, { v: 15, l: 'Bağımsız' }] },
            { key: 'merdiven', label: 'Merdiven', options: [{ v: 0, l: 'Yapamaz' }, { v: 5, l: 'Yardımlı' }, { v: 10, l: 'Bağımsız' }] },
          ].map(item => (
            <div key={item.key} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-700 w-40 flex-shrink-0">{item.label}</span>
              <div className="flex gap-1 flex-1 flex-wrap">
                {item.options.map(o => (
                  <button key={o.v} onClick={() => setBarthelItems({ ...barthelItems, [item.key]: o.v })}
                    className={twMerge("px-2 py-1 rounded text-[10px] font-semibold border",
                      barthelItems[item.key] === o.v ? "bg-purple-500 text-white border-purple-600" : "bg-white text-slate-600 border-slate-200"
                    )}>{o.l} ({o.v})</button>
                ))}
              </div>
            </div>
          ))}
          <div className={`text-center p-4 rounded-xl border-2 ${barthelTotal >= 80 ? 'bg-emerald-50 border-emerald-300' : barthelTotal >= 60 ? 'bg-amber-50 border-amber-300' : 'bg-red-50 border-red-300'}`}>
            <p className="text-xs text-slate-500 uppercase">Barthel İndeksi</p>
            <p className="text-4xl font-black mt-1">{barthelTotal}<span className="text-sm font-normal text-slate-400">/100</span></p>
            <p className="text-sm font-bold mt-1">
              {barthelTotal === 100 ? 'Tam bağımsız' : barthelTotal >= 80 ? 'Hafif bağımlı' : barthelTotal >= 60 ? 'Orta bağımlı' : barthelTotal >= 40 ? 'Ağır bağımlı' : 'Tam bağımlı'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
