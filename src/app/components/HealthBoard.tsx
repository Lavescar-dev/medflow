import React, { useState } from 'react';
import { FileSearch, User, Stethoscope, Clock, CheckCircle2, Search, Plus, X, AlertTriangle, FileText, Send, ChevronRight, Calendar, Printer, Download, Users, Edit3, Save, ClipboardList, Shield, Calculator, RefreshCw } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface BoardCase {
  id: string; applicationDate: string; patient: string; tc: string; age: string; gender: string;
  type: 'İlaç Raporu' | 'Engelli Raporu' | 'Ehliyet Raporu' | 'Silah Raporu' | 'Maluliyet' | 'Çalışabilir Raporu' | 'İşe Giriş';
  status: 'Başvuruldu' | 'Muayene Planlandı' | 'Kurul Toplandı' | 'Rapor Hazırlandı' | 'Onaylandı' | 'Reddedildi';
  boardDate: string; boardMembers: { name: string; dept: string; signature: boolean; vote: 'olumlu' | 'olumsuz' | 'bekliyor' }[];
  diagnoses: string[]; decision: string; reportNo: string;
  examinations: { dept: string; doctor: string; result: string; date: string }[];
  notes: string;
  disabilityPercent: number;
  medulaReportId: string;
  eNabizSent: boolean;
}

const mockCases: BoardCase[] = [
  {
    id: 'SK-2026-0142', applicationDate: '01.04.2026', patient: 'Mehmet Demir', tc: '123***789', age: '61', gender: 'E',
    type: 'İlaç Raporu', status: 'Onaylandı', boardDate: '05.04.2026',
    boardMembers: [
      { name: 'Uzm. Dr. Ahmet K.', dept: 'Dahiliye', signature: true, vote: 'olumlu' },
      { name: 'Uzm. Dr. Ayşe D.', dept: 'Endokrinoloji', signature: true, vote: 'olumlu' },
      { name: 'Uzm. Dr. Can Y.', dept: 'Kardiyoloji', signature: true, vote: 'olumlu' },
    ],
    diagnoses: ['I10 - Esansiyel hipertansiyon', 'E11 - Tip 2 diabetes mellitus', 'E78.5 - Hiperlipidemi'],
    decision: '1 yıl süreli kronik ilaç kullanım raporu düzenlendi.',
    reportNo: 'SIR-2026-00892',
    examinations: [
      { dept: 'Dahiliye', doctor: 'Uzm. Dr. Ahmet K.', result: 'HT + DM doğrulandı.', date: '02.04.2026' },
      { dept: 'Kardiyoloji', doctor: 'Uzm. Dr. Can Y.', result: 'EKG normal. EF %60.', date: '03.04.2026' },
      { dept: 'Endokrinoloji', doctor: 'Uzm. Dr. Ayşe D.', result: 'HbA1c: %7.2. Metformin yeterli.', date: '03.04.2026' },
    ],
    notes: '3 branş muayenesi tamamlandı.', disabilityPercent: 0, medulaReportId: 'MRB-2026-0142', eNabizSent: true,
  },
  {
    id: 'SK-2026-0143', applicationDate: '03.04.2026', patient: 'Ayşe Yılmaz', tc: '234***890', age: '41', gender: 'K',
    type: 'Engelli Raporu', status: 'Muayene Planlandı', boardDate: '',
    boardMembers: [
      { name: 'Uzm. Dr. Zeynep Y.', dept: 'Nöroloji', signature: false, vote: 'bekliyor' },
      { name: 'Uzm. Dr. Elif S.', dept: 'Göz', signature: false, vote: 'bekliyor' },
      { name: 'FTR Uzm. Elif K.', dept: 'FTR', signature: false, vote: 'bekliyor' },
      { name: 'Uzm. Dr. Ahmet K.', dept: 'Dahiliye', signature: false, vote: 'bekliyor' },
    ],
    diagnoses: ['I63.9 - İskemik SVO', 'G81.1 - Spastik hemipleji'],
    decision: '', reportNo: '',
    examinations: [
      { dept: 'Nöroloji', doctor: 'Uzm. Dr. Zeynep Y.', result: '', date: '08.04.2026 (Planlı)' },
      { dept: 'Göz', doctor: '', result: '', date: 'Planlanacak' },
      { dept: 'FTR', doctor: 'FTR Uzm. Elif K.', result: '', date: 'Planlanacak' },
      { dept: 'Dahiliye', doctor: '', result: '', date: 'Planlanacak' },
    ],
    notes: 'Sol hemiparezi. Engelli raporu başvurusu.', disabilityPercent: 0, medulaReportId: '', eNabizSent: false,
  },
  {
    id: 'SK-2026-0140', applicationDate: '28.03.2026', patient: 'Ali Çelik', tc: '345***901', age: '55', gender: 'E',
    type: 'Ehliyet Raporu', status: 'Onaylandı', boardDate: '02.04.2026',
    boardMembers: [
      { name: 'Uzm. Dr. Ahmet K.', dept: 'Dahiliye', signature: true, vote: 'olumlu' },
      { name: 'Uzm. Dr. Elif S.', dept: 'Göz', signature: true, vote: 'olumlu' },
      { name: 'Dr. Ali R.', dept: 'KBB', signature: true, vote: 'olumlu' },
      { name: 'Uzm. Dr. Zeynep Y.', dept: 'Nöroloji', signature: true, vote: 'olumlu' },
    ],
    diagnoses: [],
    decision: 'B sınıfı ehliyet uygun. Sağlık engeli yok.',
    reportNo: 'EHL-2026-00341',
    examinations: [
      { dept: 'Dahiliye', doctor: 'Uzm. Dr. Ahmet K.', result: 'Engel yok.', date: '28.03.2026' },
      { dept: 'Göz', doctor: 'Uzm. Dr. Elif S.', result: 'Görme yeterli. Renk körlüğü yok.', date: '28.03.2026' },
      { dept: 'KBB', doctor: 'Dr. Ali R.', result: 'İşitme normal.', date: '29.03.2026' },
      { dept: 'Nöroloji', doctor: 'Uzm. Dr. Zeynep Y.', result: 'Nörolojik muayene doğal.', date: '29.03.2026' },
    ],
    notes: 'B sınıfı ehliyet.', disabilityPercent: 0, medulaReportId: 'MRB-2026-0140', eNabizSent: true,
  },
  {
    id: 'SK-2026-0144', applicationDate: '05.04.2026', patient: 'Hasan Öztürk', tc: '456***012', age: '38', gender: 'E',
    type: 'İşe Giriş', status: 'Rapor Hazırlandı', boardDate: '07.04.2026',
    boardMembers: [
      { name: 'Uzm. Dr. Ahmet K.', dept: 'Dahiliye', signature: true, vote: 'olumlu' },
      { name: 'Uzm. Dr. Elif S.', dept: 'Göz', signature: true, vote: 'olumlu' },
    ],
    diagnoses: [],
    decision: 'Çalışmasına engel yoktur.',
    reportNo: 'IGR-2026-00128',
    examinations: [
      { dept: 'Dahiliye', doctor: 'Uzm. Dr. Ahmet K.', result: 'Genel durum iyi.', date: '06.04.2026' },
      { dept: 'Göz', doctor: 'Uzm. Dr. Elif S.', result: 'Görme normal.', date: '06.04.2026' },
    ],
    notes: 'İşe giriş raporu.', disabilityPercent: 0, medulaReportId: 'MRB-2026-0144', eNabizSent: false,
  },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100' };
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

export function HealthBoard() {
  const [selectedCase, setSelectedCase] = useState<BoardCase | null>(null);
  const [typeFilter, setTypeFilter] = useState('Tümü');
  const [showDisabilityCalc, setShowDisabilityCalc] = useState(false);
  const [showNewApplication, setShowNewApplication] = useState(false);
  const [medulaStatus, setMedulaStatus] = useState<'idle' | 'sending' | 'ok'>('idle');
  const [eNabizStatus, setENabizStatus] = useState<'idle' | 'sending' | 'ok'>('idle');

  // Balthazard disability calculator
  const [disabilityRates, setDisabilityRates] = useState<number[]>([40, 20]);

  const statusColor = (s: string) => s === 'Başvuruldu' ? 'slate' : s === 'Muayene Planlandı' ? 'amber' : s === 'Kurul Toplandı' ? 'blue' : s === 'Rapor Hazırlandı' ? 'cyan' : s === 'Onaylandı' ? 'green' : 'red';
  const typeColor = (t: string) => t === 'İlaç Raporu' ? 'green' : t === 'Engelli Raporu' ? 'purple' : t === 'Ehliyet Raporu' ? 'blue' : t === 'Silah Raporu' ? 'red' : t === 'İşe Giriş' ? 'cyan' : 'amber';
  const filtered = typeFilter === 'Tümü' ? mockCases : mockCases.filter(c => c.type === typeFilter);

  // Balthazard formula: A + B*(100-A)/100
  const calcBalthazard = (rates: number[]): number => {
    if (rates.length === 0) return 0;
    let total = rates[0];
    for (let i = 1; i < rates.length; i++) {
      total = total + rates[i] * (100 - total) / 100;
    }
    return Math.round(total);
  };

  const sendMedula = () => { setMedulaStatus('sending'); setTimeout(() => setMedulaStatus('ok'), 1800); };
  const sendENabiz = () => { setENabizStatus('sending'); setTimeout(() => setENabizStatus('ok'), 1500); };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Sağlık Kurulu</h2>
          <p className="text-sm text-slate-500">Engelli oranı hesaplama (Balthazard), MEDULA rapor bildirimi, e-Nabız entegrasyonu</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDisabilityCalc(true)} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700"><Calculator size={14} /> Balthazard</button>
          <button onClick={() => setShowNewApplication(true)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"><Plus size={14} /> Yeni Başvuru</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-none">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200"><p className="text-[10px] font-bold text-blue-600 uppercase">Toplam</p><p className="text-xl font-black text-blue-700 mt-0.5">{mockCases.length}</p></div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><p className="text-[10px] font-bold text-amber-600 uppercase">Devam Eden</p><p className="text-xl font-black text-amber-700 mt-0.5">{mockCases.filter(c => !['Onaylandı', 'Reddedildi'].includes(c.status)).length}</p></div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200"><p className="text-[10px] font-bold text-emerald-600 uppercase">Onaylanan</p><p className="text-xl font-black text-emerald-700 mt-0.5">{mockCases.filter(c => c.status === 'Onaylandı').length}</p></div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200"><p className="text-[10px] font-bold text-purple-600 uppercase">Sonraki Kurul</p><p className="text-lg font-black text-purple-700 mt-0.5">09.04.2026</p></div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 flex-none flex-wrap">
        {['Tümü', 'İlaç Raporu', 'Engelli Raporu', 'Ehliyet Raporu', 'İşe Giriş'].map(f => (
          <button key={f} onClick={() => setTypeFilter(f)}
            className={twMerge('px-2.5 py-1 rounded-lg text-[10px] font-semibold border',
              typeFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            )}>{f}</button>
        ))}
      </div>

      {/* Case List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelectedCase(c)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className="text-[9px] font-mono text-slate-400">{c.id}</span>
                  <Badge color={typeColor(c.type)}>{c.type}</Badge>
                  <Badge color={statusColor(c.status)}>{c.status}</Badge>
                  <span className="text-[10px] text-slate-500">{c.applicationDate}</span>
                  {c.eNabizSent && <span className="text-[8px] bg-cyan-100 text-cyan-600 px-1 rounded font-bold">e-Nabız</span>}
                </div>
                <p className="text-xs font-bold text-slate-800">{c.patient} <span className="font-normal text-slate-500">{c.age}{c.gender} • TC: {c.tc}</span></p>
                {c.diagnoses.length > 0 && <p className="text-[10px] text-slate-500 mt-0.5">{c.diagnoses.join('; ')}</p>}
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500">
                  <span><Users size={10} className="inline" /> {c.boardMembers.length} üye</span>
                  <span>{c.boardMembers.filter(m => m.signature).length}/{c.boardMembers.length} imza</span>
                  <span>{c.boardMembers.filter(m => m.vote === 'olumlu').length} olumlu oy</span>
                  {c.reportNo && <span className="font-mono text-emerald-600">{c.reportNo}</span>}
                  {c.medulaReportId && <span className="font-mono text-blue-500">MEDULA: {c.medulaReportId}</span>}
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedCase} onClose={() => setSelectedCase(null)} title={`Sağlık Kurulu — ${selectedCase?.id || ''}`}>
        {selectedCase && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div><span className="text-slate-500 block">Hasta</span><span className="font-bold text-slate-800">{selectedCase.patient}</span></div>
              <div><span className="text-slate-500 block">Rapor Türü</span><Badge color={typeColor(selectedCase.type)}>{selectedCase.type}</Badge></div>
              <div><span className="text-slate-500 block">Başvuru</span><span className="font-bold text-slate-800">{selectedCase.applicationDate}</span></div>
              <div><span className="text-slate-500 block">Kurul</span><span className="font-bold text-slate-800">{selectedCase.boardDate || 'Planlanacak'}</span></div>
            </div>

            {selectedCase.diagnoses.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-1.5">Tanılar</h4>
                <div className="space-y-1">{selectedCase.diagnoses.map((d, i) => <p key={i} className="text-xs bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">{d}</p>)}</div>
              </div>
            )}

            {/* Examinations */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-1.5">Branş Muayeneleri</h4>
              <table className="w-full text-xs">
                <thead className="bg-slate-50"><tr>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500">Branş</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500">Hekim</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500">Tarih</th>
                  <th className="text-left py-2 px-3 font-semibold text-slate-500">Sonuç</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedCase.examinations.map((e, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-800">{e.dept}</td>
                      <td className="py-2 px-3 text-slate-600">{e.doctor || '—'}</td>
                      <td className="py-2 px-3 text-slate-600">{e.date}</td>
                      <td className="py-2 px-3 text-slate-600">{e.result || <span className="text-amber-500 italic">Bekliyor</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Board Members & Voting */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-1.5">Kurul Üyeleri — İmza & Oylama</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedCase.boardMembers.map((m, i) => (
                  <div key={i} className={twMerge("flex items-center justify-between p-3 rounded-lg border", m.signature ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200")}>
                    <div>
                      <p className="text-xs font-medium text-slate-800">{m.name}</p>
                      <p className="text-[10px] text-slate-500">{m.dept}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${m.vote === 'olumlu' ? 'bg-emerald-100 text-emerald-700' : m.vote === 'olumsuz' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
                        {m.vote === 'olumlu' ? 'Olumlu' : m.vote === 'olumsuz' ? 'Olumsuz' : 'Bekliyor'}
                      </span>
                      {m.signature ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Clock size={16} className="text-slate-300" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedCase.decision && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-emerald-700 mb-1 flex items-center gap-2"><Shield size={16} /> Kurul Kararı</h4>
                <p className="text-xs text-emerald-800">{selectedCase.decision}</p>
                {selectedCase.reportNo && <p className="text-[10px] font-mono text-emerald-600 mt-1">Rapor No: {selectedCase.reportNo}</p>}
                {selectedCase.disabilityPercent > 0 && <p className="text-sm font-bold text-emerald-700 mt-1">Engelli Oranı: %{selectedCase.disabilityPercent}</p>}
              </div>
            )}

            {/* Integrations */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5"><Shield size={14} /> MEDULA</span>
                  <button onClick={sendMedula} disabled={medulaStatus === 'sending'}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-700 disabled:opacity-50">
                    {medulaStatus === 'ok' ? 'Gönderildi' : medulaStatus === 'sending' ? 'Gönderiliyor...' : 'Rapor Bildir'}
                  </button>
                </div>
                <p className="text-[10px] text-blue-600">{selectedCase.medulaReportId || 'Henüz bildirilmedi'}</p>
                {medulaStatus === 'ok' && <p className="text-[9px] text-emerald-600 mt-1">MEDULA rapor bildirimi başarılı.</p>}
              </div>
              <div className="bg-cyan-50 rounded-xl p-3 border border-cyan-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-cyan-800 flex items-center gap-1.5"><Shield size={14} /> e-Nabız</span>
                  <button onClick={sendENabiz} disabled={eNabizStatus === 'sending'}
                    className="px-2 py-1 bg-cyan-600 text-white rounded text-[10px] font-semibold hover:bg-cyan-700 disabled:opacity-50">
                    {eNabizStatus === 'ok' ? 'Gönderildi' : eNabizStatus === 'sending' ? 'Gönderiliyor...' : 'e-Nabız Gönder'}
                  </button>
                </div>
                <p className="text-[10px] text-cyan-600">{selectedCase.eNabizSent ? 'Kaydedildi' : 'Gönderilmedi'}</p>
                {eNabizStatus === 'ok' && <p className="text-[9px] text-emerald-600 mt-1">e-Nabız rapor kaydı başarılı.</p>}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Printer size={12} /> Rapor Yazdır</button>
              <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Download size={12} /> PDF İndir</button>
              <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Send size={12} /> e-Nabız</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Balthazard Disability Calculator */}
      <Modal open={showDisabilityCalc} onClose={() => setShowDisabilityCalc(false)} title="Balthazard Formülü — Engelli Oranı Hesaplayıcı">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Birden fazla organ/sistem engeli olduğunda bileşik engel oranı Balthazard formülü ile hesaplanır. Engelli Sağlık Kurulu Yönetmeliği (Ek-4) gereği uygulanır.</p>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-purple-700">Engel Oranları</h4>
              <button onClick={() => setDisabilityRates([...disabilityRates, 10])} className="text-[10px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"><Plus size={12} /> Engel Ekle</button>
            </div>
            {disabilityRates.map((rate, i) => (
              <div key={i} className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-purple-600 w-16">Engel {i + 1}:</span>
                <input type="number" value={rate} min={0} max={100}
                  onChange={e => { const n = [...disabilityRates]; n[i] = parseInt(e.target.value) || 0; setDisabilityRates(n); }}
                  className="w-24 px-3 py-1.5 border border-purple-300 rounded-lg text-sm text-center" />
                <span className="text-xs text-slate-500">%</span>
                {disabilityRates.length > 1 && (
                  <button onClick={() => setDisabilityRates(disabilityRates.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 text-xs">Sil</button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600">
            <p className="font-bold text-slate-700 mb-1">Formül: A + B×(100-A)/100</p>
            <p>İlk değer: %{disabilityRates[0] || 0}</p>
            {disabilityRates.slice(1).map((r, i) => (
              <p key={i}>+%{r} birleşim: {disabilityRates.slice(0, i + 1).reduce((a, b) => a + b * (100 - a) / 100, disabilityRates[0])} → {Math.round(disabilityRates.slice(0, i + 2).reduce((a, b, j) => j === 0 ? b : a + b * (100 - a) / 100, 0))}%</p>
            ))}
          </div>

          <div className={`text-center p-5 rounded-xl border-2 ${calcBalthazard(disabilityRates) >= 60 ? 'bg-red-50 border-red-300' : calcBalthazard(disabilityRates) >= 40 ? 'bg-amber-50 border-amber-300' : 'bg-blue-50 border-blue-300'}`}>
            <p className="text-xs text-slate-500 uppercase">Bileşik Engel Oranı (Balthazard)</p>
            <p className="text-5xl font-black mt-1">%{calcBalthazard(disabilityRates)}</p>
            <p className="text-sm font-bold mt-1">
              {calcBalthazard(disabilityRates) >= 80 ? 'Tam bakıma muhtaç' : calcBalthazard(disabilityRates) >= 60 ? 'Ağır engelli' : calcBalthazard(disabilityRates) >= 40 ? 'Orta derece engelli' : 'Hafif engelli'}
            </p>
          </div>
        </div>
      </Modal>

      {/* New Application */}
      <Modal open={showNewApplication} onClose={() => setShowNewApplication(false)} title="Yeni Sağlık Kurulu Başvurusu">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Hasta</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Ad Soyad veya TC" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Rapor Türü</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>İlaç Raporu</option><option>Engelli Raporu</option><option>Ehliyet Raporu</option>
                <option>Silah Raporu</option><option>Maluliyet</option><option>Çalışabilir Raporu</option><option>İşe Giriş</option>
              </select>
            </div>
          </div>
          <div><label className="text-xs font-semibold text-slate-600 block mb-1">Tanılar (ICD-10)</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Ör: I10, E11..." /></div>
          <div><label className="text-xs font-semibold text-slate-600 block mb-1">Not</label><textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none" placeholder="Ek bilgi..." /></div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[10px] text-slate-500">
            <p className="font-bold text-slate-700 mb-1">Gerekli Branş Muayeneleri (rapor türüne göre):</p>
            <p>İlaç Raporu: İlgili branş + en az 2 ek branş • Engelli: Tüm ilgili branşlar + FTR</p>
            <p>Ehliyet: Dahiliye + Göz + KBB + Nöroloji • Silah: Dahiliye + Göz + Psikiyatri</p>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button onClick={() => setShowNewApplication(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold">İptal</button>
            <button onClick={() => setShowNewApplication(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Plus size={14} /> Başvuru Oluştur</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}