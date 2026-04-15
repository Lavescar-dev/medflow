import React, { useState } from 'react';
import { Users, Stethoscope, Clock, CheckCircle2, Search, Plus, X, AlertTriangle, FileText, Send, ChevronRight, RefreshCw, Eye, Edit3, Save, User, Shield, Timer, Bell, AlertCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Consultation {
  id: string; requestDate: string; requestTime: string;
  patient: string; patientRoom: string; patientAge: string; patientGender: string;
  fromDept: string; fromDoctor: string; toDept: string; toDoctor: string;
  reason: string; urgency: 'Normal' | 'Acil' | 'Cito';
  status: 'Bekliyor' | 'Kabul Edildi' | 'Yanıtlandı' | 'Tamamlandı' | 'Reddedildi' | 'Eskalasyon';
  diagnosis: string; responseNote: string; responseDate: string;
  recommendations: string[];
  requestNote: string;
  slaTarget: number; // minutes
  elapsedMin: number;
  slaBreached: boolean;
  medulaCode: string;
}

const mockConsultations: Consultation[] = [
  {
    id: 'KNS-2026-001', requestDate: '07.04.2026', requestTime: '09:30',
    patient: 'Zeynep Kaya', patientRoom: '302-A', patientAge: '72', patientGender: 'K',
    fromDept: 'Dahiliye', fromDoctor: 'Uzm. Dr. Ahmet K.', toDept: 'Göğüs Hastalıkları', toDoctor: '',
    reason: 'KOAH alevlenmesi - Tedavi optimizasyonu. SpO2 düşük seyrediyor.',
    urgency: 'Acil', status: 'Bekliyor', diagnosis: 'J44.1', responseNote: '', responseDate: '',
    recommendations: [], requestNote: 'SpO2 %88, O2 3L/dk, nebül yeterli yanıt alınamıyor.',
    slaTarget: 60, elapsedMin: 95, slaBreached: true, medulaCode: 'K-520100',
  },
  {
    id: 'KNS-2026-002', requestDate: '07.04.2026', requestTime: '10:00',
    patient: 'Mehmet Demir', patientRoom: '303-B', patientAge: '61', patientGender: 'E',
    fromDept: 'Dahiliye', fromDoctor: 'Uzm. Dr. Ayşe D.', toDept: 'Kardiyoloji', toDoctor: 'Uzm. Dr. Can Y.',
    reason: 'Hipertansif kriz sonrası EKG\'de T dalga inversiyonu. Troponin hafif yüksek.',
    urgency: 'Acil', status: 'Kabul Edildi', diagnosis: 'I16.1', responseNote: '', responseDate: '',
    recommendations: [], requestNote: 'TA: 142/88, EKG: V3-V5 T inversiyonu, Troponin: 0.08.',
    slaTarget: 60, elapsedMin: 35, slaBreached: false, medulaCode: 'K-520100',
  },
  {
    id: 'KNS-2026-003', requestDate: '06.04.2026', requestTime: '14:00',
    patient: 'Hatice Arslan', patientRoom: '304-A', patientAge: '65', patientGender: 'K',
    fromDept: 'Dahiliye', fromDoctor: 'Uzm. Dr. Ahmet K.', toDept: 'Enfeksiyon Hastalıkları', toDoctor: 'Uzm. Dr. Elif S.',
    reason: 'MRSA pnömonisi - Vankomisin düzeyi yüksek. Doz ayarlaması.',
    urgency: 'Normal', status: 'Yanıtlandı', diagnosis: 'J15.2',
    responseNote: 'Vankomisin düzeyi 28 mg/L (hedef 15-20). Doz 1g→750mg/12saat. 48 saat sonra düzey tekrarı.',
    responseDate: '07.04.2026 08:30', recommendations: ['Vankomisin dozu azaltılsın', 'Renal fonksiyon takibi', '48 saat düzey tekrarı'],
    requestNote: 'Vankomisin 4 gün. Son düzey: 28 mg/L. Kreatinin yükselme trendi.',
    slaTarget: 240, elapsedMin: 1110, slaBreached: false, medulaCode: 'K-520200',
  },
  {
    id: 'KNS-2026-004', requestDate: '05.04.2026', requestTime: '11:00',
    patient: 'Fatma Şahin', patientRoom: '303-A', patientAge: '50', patientGender: 'K',
    fromDept: 'Genel Cerrahi', fromDoctor: 'Op. Dr. Sinan K.', toDept: 'Anesteziyoloji', toDoctor: 'Uzm. Dr. Hakan Ç.',
    reason: 'Lap. kolesistektomi - Preop anestezi değerlendirmesi.',
    urgency: 'Normal', status: 'Tamamlandı', diagnosis: 'K80.2',
    responseNote: 'ASA I. Genel anestezi uygun. Alerji yok. Ek risk yok.',
    responseDate: '05.04.2026 14:00', recommendations: ['8 saat açlık', 'Rutin preop tetkik yeterli'],
    requestNote: 'Kronik hastalık yok. İlaç kullanmıyor.',
    slaTarget: 480, elapsedMin: 180, slaBreached: false, medulaCode: 'K-520300',
  },
  {
    id: 'KNS-2026-005', requestDate: '05.04.2026', requestTime: '09:00',
    patient: 'Mustafa Yılmaz', patientRoom: '301-A', patientAge: '58', patientGender: 'E',
    fromDept: 'Ortopedi', fromDoctor: 'Doç. Dr. Murat A.', toDept: 'Fizik Tedavi', toDoctor: 'FTR Uzm. Elif K.',
    reason: 'Post-op L4-L5 disk hernisi - FTR programı planlanması.',
    urgency: 'Normal', status: 'Tamamlandı', diagnosis: 'M51.1',
    responseNote: 'FTR programına alındı. 15 seans planlandı.',
    responseDate: '06.04.2026 10:00', recommendations: ['15 seans FTR', 'Williams egzersizleri', 'Ağır kaldırma yasağı'],
    requestNote: 'Ameliyat sonrası sol bacağa yayılan ağrı. Motor defisit yok.',
    slaTarget: 1440, elapsedMin: 1500, slaBreached: true, medulaCode: 'K-520200',
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

export function ConsultationModule() {
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [showNewConsult, setShowNewConsult] = useState(false);
  const [medulaStatus, setMedulaStatus] = useState<'idle' | 'sending' | 'ok'>('idle');

  const statusColor = (s: string) => s === 'Bekliyor' ? 'amber' : s === 'Kabul Edildi' ? 'blue' : s === 'Yanıtlandı' ? 'cyan' : s === 'Tamamlandı' ? 'green' : s === 'Eskalasyon' ? 'orange' : 'red';
  const urgencyColor = (u: string) => u === 'Cito' ? 'red' : u === 'Acil' ? 'amber' : 'slate';
  const filtered = statusFilter === 'Tümü' ? mockConsultations : mockConsultations.filter(c => c.status === statusFilter);

  const pending = mockConsultations.filter(c => c.status === 'Bekliyor' || c.status === 'Kabul Edildi').length;
  const answered = mockConsultations.filter(c => c.status === 'Yanıtlandı' || c.status === 'Tamamlandı').length;
  const breached = mockConsultations.filter(c => c.slaBreached && c.status !== 'Tamamlandı').length;

  const formatSLA = (min: number) => min >= 1440 ? `${Math.floor(min / 1440)}g ${Math.floor((min % 1440) / 60)}s` : min >= 60 ? `${Math.floor(min / 60)}s ${min % 60}dk` : `${min}dk`;

  const sendMedula = () => { setMedulaStatus('sending'); setTimeout(() => setMedulaStatus('ok'), 1500); };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Konsültasyon Yönetimi</h2>
          <p className="text-sm text-slate-500">SLA takibi, otomatik eskalasyon, MEDULA konsültasyon kodu bildirimi</p>
        </div>
        <button onClick={() => setShowNewConsult(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm">
          <Plus size={16} /> Yeni Konsültasyon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-none">
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><p className="text-[10px] font-bold text-amber-600 uppercase">Bekleyen</p><p className="text-xl font-black text-amber-700 mt-0.5">{pending}</p></div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200"><p className="text-[10px] font-bold text-emerald-600 uppercase">Yanıtlanan</p><p className="text-xl font-black text-emerald-700 mt-0.5">{answered}</p></div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200"><p className="text-[10px] font-bold text-blue-600 uppercase">Toplam</p><p className="text-xl font-black text-blue-700 mt-0.5">{mockConsultations.length}</p></div>
        <div className="bg-red-50 p-3 rounded-xl border border-red-200"><p className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">{breached > 0 && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>} SLA Aşılan</p><p className="text-xl font-black text-red-700 mt-0.5">{breached}</p></div>
        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200"><p className="text-[10px] font-bold text-orange-600 uppercase">Acil/Cito</p><p className="text-xl font-black text-orange-700 mt-0.5">{mockConsultations.filter(c => c.urgency !== 'Normal').length}</p></div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 flex-none flex-wrap">
        {['Tümü', 'Bekliyor', 'Kabul Edildi', 'Yanıtlandı', 'Tamamlandı'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={twMerge('px-2.5 py-1 rounded-lg text-[10px] font-semibold border',
              statusFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            )}>{f}</button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelectedConsult(c)}
            className={twMerge("bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all",
              c.slaBreached && c.status !== 'Tamamlandı' ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
            )}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{c.requestDate} {c.requestTime}</span>
                  <span className="text-xs font-bold text-slate-800">{c.fromDept} → {c.toDept}</span>
                  <Badge color={statusColor(c.status)}>{c.status}</Badge>
                  <Badge color={urgencyColor(c.urgency)}>{c.urgency}</Badge>
                  {c.slaBreached && c.status !== 'Tamamlandı' && <Badge color="red">SLA AŞILDI</Badge>}
                  <span className="text-[9px] font-mono text-slate-400">{c.id}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{c.patient} ({c.patientAge}{c.patientGender}) — {c.patientRoom}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{c.reason}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
                  <span><Stethoscope size={10} className="inline" /> {c.fromDoctor}</span>
                  {c.toDoctor && <span>Yanıtlayan: {c.toDoctor}</span>}
                  <span className={twMerge("flex items-center gap-0.5", c.slaBreached && c.status !== 'Tamamlandı' ? 'text-red-600 font-bold' : '')}>
                    <Timer size={10} /> SLA: {formatSLA(c.elapsedMin)} / {formatSLA(c.slaTarget)}
                  </span>
                  <span className="font-mono text-slate-400">MEDULA: {c.medulaCode}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 mt-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal open={!!selectedConsult} onClose={() => setSelectedConsult(null)} title={`Konsültasyon — ${selectedConsult?.id || ''}`}>
        {selectedConsult && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div><span className="text-slate-500 block">Hasta</span><span className="font-bold text-slate-800">{selectedConsult.patient} ({selectedConsult.patientAge}{selectedConsult.patientGender})</span></div>
                <div><span className="text-slate-500 block">Oda</span><span className="font-bold text-slate-800">{selectedConsult.patientRoom}</span></div>
                <div><span className="text-slate-500 block">Tarih</span><span className="font-bold text-slate-800">{selectedConsult.requestDate} {selectedConsult.requestTime}</span></div>
                <div className="flex items-center gap-1"><Badge color={statusColor(selectedConsult.status)}>{selectedConsult.status}</Badge><Badge color={urgencyColor(selectedConsult.urgency)}>{selectedConsult.urgency}</Badge></div>
              </div>
            </div>

            {/* SLA Tracker */}
            <div className={`rounded-xl p-4 border-2 ${selectedConsult.slaBreached && selectedConsult.status !== 'Tamamlandı' ? 'bg-red-50 border-red-300' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold flex items-center gap-2"><Timer size={16} className={selectedConsult.slaBreached ? 'text-red-500' : 'text-blue-500'} /> SLA Takibi</h4>
                {selectedConsult.slaBreached && selectedConsult.status !== 'Tamamlandı' && (
                  <button className="px-2.5 py-1 bg-orange-500 text-white rounded-lg text-[10px] font-bold hover:bg-orange-600 flex items-center gap-1"><Bell size={10} /> Eskalasyon Gönder</button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-200 rounded-full h-3">
                  <div className={`h-3 rounded-full ${selectedConsult.elapsedMin > selectedConsult.slaTarget ? 'bg-red-500' : selectedConsult.elapsedMin > selectedConsult.slaTarget * 0.8 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min((selectedConsult.elapsedMin / selectedConsult.slaTarget) * 100, 100)}%` }}></div>
                </div>
                <span className="text-xs font-bold">{formatSLA(selectedConsult.elapsedMin)} / {formatSLA(selectedConsult.slaTarget)}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-2">
                {selectedConsult.urgency === 'Cito' ? 'Cito: 30 dk' : selectedConsult.urgency === 'Acil' ? 'Acil: 60 dk' : 'Normal: 4-24 saat'} — {selectedConsult.slaBreached ? 'SLA süresi aşılmıştır. Otomatik eskalasyon tetiklendi.' : 'SLA süresi içinde.'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <p className="text-[10px] font-bold text-blue-600 mb-0.5">İsteyen Birim</p>
                <p className="text-xs font-bold text-blue-800">{selectedConsult.fromDept}</p>
                <p className="text-[10px] text-blue-600">{selectedConsult.fromDoctor}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                <p className="text-[10px] font-bold text-purple-600 mb-0.5">İstenen Birim</p>
                <p className="text-xs font-bold text-purple-800">{selectedConsult.toDept}</p>
                <p className="text-[10px] text-purple-600">{selectedConsult.toDoctor || 'Henüz atanmadı'}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-1.5">Konsültasyon Sebebi</h4>
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedConsult.reason}</p>
            </div>

            {selectedConsult.requestNote && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-1.5">Klinik Bilgi</h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedConsult.requestNote}</p>
              </div>
            )}

            {selectedConsult.responseNote && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-emerald-700">Yanıt</h4>
                  <span className="text-[10px] text-emerald-600">{selectedConsult.responseDate}</span>
                </div>
                <p className="text-xs text-emerald-800">{selectedConsult.responseNote}</p>
              </div>
            )}

            {selectedConsult.recommendations.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-1.5">Öneriler</h4>
                <div className="space-y-1">
                  {selectedConsult.recommendations.map((r, i) => (
                    <div key={i} className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 text-xs text-blue-800 flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-blue-500 flex-shrink-0" /> {r}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEDULA */}
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-800">MEDULA Konsültasyon Kodu: {selectedConsult.medulaCode}</span>
                </div>
                <button onClick={sendMedula} disabled={medulaStatus === 'sending'}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {medulaStatus === 'ok' ? 'Bildirildi' : medulaStatus === 'sending' ? 'Gönderiliyor...' : 'MEDULA Bildir'}
                </button>
              </div>
            </div>

            {(selectedConsult.status === 'Bekliyor' || selectedConsult.status === 'Kabul Edildi') && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-1.5">Yanıt Yaz</h4>
                <textarea rows={3} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs resize-none outline-none focus:ring-2 focus:ring-blue-500" placeholder="Konsültasyon yanıtınızı yazınız..." />
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5"><Send size={12} /> Yanıtla</button>
                  <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50">Kabul Et</button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* New Consultation Modal */}
      <Modal open={showNewConsult} onClose={() => setShowNewConsult(false)} title="Yeni Konsültasyon İstemi">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Hasta</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Hasta adı veya TC ile ara" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Oda / Yatak</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="Ör: 302-A" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">İstenen Branş</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>Kardiyoloji</option><option>Göğüs Hastalıkları</option><option>Nöroloji</option>
                <option>Enfeksiyon Hastalıkları</option><option>Genel Cerrahi</option><option>Ortopedi</option>
                <option>Anesteziyoloji</option><option>Fizik Tedavi</option><option>Psikiyatri</option>
              </select>
            </div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Aciliyet</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                <option>Normal (SLA: 24 saat)</option><option>Acil (SLA: 1 saat)</option><option>Cito (SLA: 30 dk)</option>
              </select>
            </div>
          </div>
          <div><label className="text-xs font-semibold text-slate-600 block mb-1">Konsültasyon Sebebi</label><textarea rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none" placeholder="Detaylı yazınız..." /></div>
          <div><label className="text-xs font-semibold text-slate-600 block mb-1">Klinik Bilgi</label><textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none" placeholder="Vital, tetkik, ilaçlar..." /></div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[10px] text-slate-500">
            <p className="font-bold text-slate-700 mb-1">SLA Politikası:</p>
            <p>• <span className="font-bold text-red-600">Cito:</span> 30 dakika içinde yanıt • <span className="font-bold text-amber-600">Acil:</span> 60 dakika • <span className="font-bold text-slate-600">Normal:</span> 4-24 saat</p>
            <p>• SLA aşıldığında otomatik eskalasyon tetiklenir (Klinik Şef → Başhekim)</p>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button onClick={() => setShowNewConsult(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold">İptal</button>
            <button onClick={() => setShowNewConsult(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Send size={14} /> Konsültasyon İste</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
