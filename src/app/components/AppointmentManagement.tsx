import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  CalendarDays, Clock, User, Stethoscope, Search,
  Filter, MoreVertical, Plus,
  ChevronLeft, ChevronRight, Activity,
  Phone, RefreshCw, Bell, X, Save, AlertTriangle,
  FileText, Loader2,
  Shield, MessageSquare, Printer, Eye,
  Ban, RotateCcw, CheckCircle2, XCircle, UserCheck,
  Hash, Zap, PhoneCall
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { getModulePath } from '../moduleRegistry';
import { type SharedPatient, usePatientContext } from '../patientContext';

// ─── Types ───────────────────────────────────────────────
type AptStatus = 'Tamamlandı' | 'Onaylandı' | 'Bekliyor' | 'İptal' | 'Boş' | 'Geldi' | 'Muayenede';
type AptSource = 'MHRS' | 'Online' | 'Banko' | 'Çağrı Mrk.' | '-';

interface Appointment {
  id: number;
  dateKey: string;
  time: string;
  patient: string;
  tc: string;
  phone: string;
  dept: string;
  doctor: string;
  status: AptStatus;
  source: AptSource;
  notes: string;
  insurance: string;
  complaint: string;
  queueNo?: number;
  duration: number; // dk
}

interface QueueItem {
  id: number;
  aptId: number;
  name: string;
  time: string;
  wait: number; // dakika
  status: 'Sırada' | 'Gecikti' | 'Çağrıldı' | 'Muayenede' | 'Kayıtta';
}

function createPatientContextFromAppointment(appointment: Appointment): SharedPatient | null {
  if (appointment.patient === '-' || appointment.status === 'Boş') {
    return null;
  }

  return {
    id: `apt-${appointment.id}`,
    fullName: appointment.patient,
    tc: appointment.tc,
    phone: appointment.phone,
    department: appointment.dept,
    doctor: appointment.doctor,
    insurance: appointment.insurance,
    complaint: appointment.complaint,
    source: `Randevu • ${appointment.time}`,
  };
}

// ─── Helpers ─────────────────────────────────────────────
const twc = (...cls: (string | boolean | undefined)[]) => cls.filter(Boolean).join(' ');

const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const MONTHS_TR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function formatDateTR(d: Date) {
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}, ${DAYS_TR[d.getDay()]}`;
}
function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}

// ─── Static Data ──────────────────────────────────────────
const DEPARTMENTS: Record<string, string[]> = {
  'Dahiliye': ['Uzm. Dr. Ahmet Kaya', 'Doç. Dr. Selin Çetin'],
  'Kardiyoloji': ['Prof. Dr. Serhan Öz', 'Uzm. Dr. Burcu Şahin'],
  'KBB': ['Uzm. Dr. Canan Yılmaz', 'Uzm. Dr. Hakan Şimşek'],
  'Nöroloji': ['Prof. Dr. İbrahim Tekin', 'Uzm. Dr. Aylin Erdoğan'],
  'Göz Hastalıkları': ['Doç. Dr. Neslihan Korkmaz', 'Uzm. Dr. Emre Doğan'],
  'Ortopedi': ['Prof. Dr. Serkan Güler', 'Uzm. Dr. Leyla Ateş'],
};

const ALL_TIME_SLOTS = [
  '08:00', '08:15', '08:30', '08:45',
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45',
  '15:00', '15:15', '15:30', '15:45',
];

const MOCK_PATIENTS: Record<string, { patient: string; phone: string; insurance: string }> = {
  '12345678901': { patient: 'Ayşe Yılmaz', phone: '05551234567', insurance: 'SGK' },
  '98765432109': { patient: 'Mehmet Demir', phone: '05329876543', insurance: 'SGK' },
  '11111111111': { patient: 'Fatma Şahin', phone: '05421234567', insurance: 'ÖSS' },
  '22222222222': { patient: 'Ali Çelik', phone: '05361234567', insurance: 'TSS' },
  '33333333333': { patient: 'Zeynep Kaya', phone: '05501234567', insurance: 'SGK' },
  '44444444444': { patient: 'Hasan Öztürk', phone: '05451234567', insurance: 'Ücretli' },
};

const BASE_DATE = new Date(2026, 3, 7); // April 7, 2026

let nextId = 100;

function mkApt(
  dateOffset: number, time: string, patient: string, tc: string,
  phone: string, dept: string, doctor: string,
  status: AptStatus, source: AptSource,
  insurance = 'SGK', complaint = 'Kontrol amaçlı', notes = ''
): Appointment {
  const d = addDays(BASE_DATE, dateOffset);
  return {
    id: nextId++,
    dateKey: dateKey(d),
    time, patient, tc, phone, dept, doctor,
    status, source, notes, insurance, complaint,
    queueNo: status === 'Bekliyor' || status === 'Onaylandı' || status === 'Geldi' ? Math.floor(Math.random() * 30) + 1 : undefined,
    duration: 15,
  };
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  // Today - Dahiliye - Dr. Ahmet Kaya
  mkApt(0, '08:00', 'Ayşe Yılmaz', '123***789', '05551234567', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Tamamlandı', 'MHRS', 'SGK', 'Baş ağrısı'),
  mkApt(0, '08:15', 'Mehmet Demir', '456***123', '05329876543', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Tamamlandı', 'Online', 'SGK', 'Ateş, halsizlik'),
  mkApt(0, '08:30', 'Fatma Şahin', '789***456', '05421234567', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Tamamlandı', 'MHRS', 'ÖSS', 'Karın ağrısı'),
  mkApt(0, '08:45', 'Ali Çelik', '321***654', '05361234567', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Muayenede', 'Banko', 'SGK', 'Göğüs ağrısı'),
  mkApt(0, '09:00', 'Zeynep Kaya', '654***321', '05501234567', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Geldi', 'MHRS', 'SGK', 'Nefes darlığı'),
  mkApt(0, '09:15', 'Hasan Öztürk', '987***654', '05451234567', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Bekliyor', 'MHRS', 'TSS', 'Kontrol'),
  mkApt(0, '09:30', '-', '-', '-', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Boş', '-'),
  mkApt(0, '09:45', 'Can Yılmaz', '147***258', '05551239988', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Onaylandı', 'Çağrı Mrk.', 'SGK', 'Şeker takibi'),
  mkApt(0, '10:00', 'Deniz Arslan', '369***147', '05323214567', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Bekliyor', 'MHRS', 'SGK', 'Tansiyon kontrolü'),
  mkApt(0, '10:15', '-', '-', '-', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Boş', '-'),
  mkApt(0, '10:30', 'Selin Demirtaş', '258***369', '05421237890', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'İptal', 'MHRS', 'ÖSS', 'Rutin check-up'),
  mkApt(0, '10:45', 'Murat Polat', '741***852', '05321230987', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Onaylandı', 'Online', 'SGK', 'Bel ağrısı'),
  mkApt(0, '11:00', '-', '-', '-', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Boş', '-'),
  mkApt(0, '11:15', 'Ece Kara', '852***963', '05501237654', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Bekliyor', 'Banko', 'Ücretli', 'Yorgunluk'),
  mkApt(0, '13:00', '-', '-', '-', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Boş', '-'),
  mkApt(0, '13:15', 'Orhan Şen', '963***741', '05421231234', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Bekliyor', 'MHRS', 'SGK', 'İlaç yenileme'),
  mkApt(0, '13:30', '-', '-', '-', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Boş', '-'),
  mkApt(0, '13:45', '-', '-', '-', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Boş', '-'),
  mkApt(0, '14:00', 'Lale Aydın', '159***357', '05323219876', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Onaylandı', 'MHRS', 'SGK', 'Kontrol'),
  mkApt(0, '14:15', '-', '-', '-', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Boş', '-'),
  // Today - Kardiyoloji
  mkApt(0, '09:00', 'Yusuf Kılıç', '111***222', '05551110000', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Tamamlandı', 'MHRS', 'SGK', 'EKG kontrolü'),
  mkApt(0, '09:15', 'Gülay Tekin', '333***444', '05421110000', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Tamamlandı', 'Online', 'ÖSS', 'Çarpıntı'),
  mkApt(0, '09:30', 'Serkan Bozkurt', '555***666', '05361110000', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Muayenede', 'MHRS', 'SGK', 'Göğüs ağrısı'),
  mkApt(0, '09:45', 'Pınar Yıldız', '777***888', '05501110000', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Geldi', 'Banko', 'TSS', 'Efor testi'),
  mkApt(0, '10:00', 'Tayfun Aras', '999***000', '05451110000', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Bekliyor', 'MHRS', 'SGK', 'Kontrol'),
  mkApt(0, '10:15', '-', '-', '-', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Boş', '-'),
  mkApt(0, '10:30', 'Bahar Güneş', '112***334', '05321110000', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Onaylandı', 'MHRS', 'SGK', 'Holter takibi'),
  // Today - KBB
  mkApt(0, '09:00', 'Emre Doğan', '221***443', '05551112222', 'KBB', 'Uzm. Dr. Canan Yılmaz', 'Tamamlandı', 'MHRS', 'SGK', 'Boğaz ağrısı'),
  mkApt(0, '09:15', 'Sibel Aktaş', '443***221', '05421112222', 'KBB', 'Uzm. Dr. Canan Yılmaz', 'Tamamlandı', 'Banko', 'ÖSS', 'İşitme kaybı'),
  mkApt(0, '09:30', 'Kenan Eroğlu', '665***443', '05361112222', 'KBB', 'Uzm. Dr. Canan Yılmaz', 'Muayenede', 'MHRS', 'SGK', 'Sinüzit'),
  mkApt(0, '09:45', 'Tuba Çakır', '887***665', '05501112222', 'KBB', 'Uzm. Dr. Canan Yılmaz', 'Geldi', 'Online', 'SGK', 'Burun tıkanıklığı'),
  mkApt(0, '10:00', '-', '-', '-', 'KBB', 'Uzm. Dr. Canan Yılmaz', 'Boş', '-'),
  mkApt(0, '10:15', 'Volkan Erdoğan', '009***887', '05451112222', 'KBB', 'Uzm. Dr. Canan Yılmaz', 'Bekliyor', 'Çağrı Mrk.', 'Ücretli', 'Rinit'),
  // Tomorrow
  mkApt(1, '09:00', 'Hülya Kara', '121***212', '05551113333', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Onaylandı', 'MHRS', 'SGK', 'Şeker kontrolü'),
  mkApt(1, '09:15', 'Burak Yılmaz', '212***121', '05421113333', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Onaylandı', 'Online', 'ÖSS', 'Kontrol'),
  mkApt(1, '09:30', '-', '-', '-', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Boş', '-'),
  mkApt(1, '09:45', 'Nurcan Demir', '343***434', '05361113333', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Onaylandı', 'MHRS', 'SGK', 'EKG'),
  mkApt(1, '10:00', 'Ertuğrul Bey', '434***343', '05501113333', 'Kardiyoloji', 'Prof. Dr. Serhan Öz', 'Bekliyor', 'Banko', 'TSS', 'Kalp ritmi'),
  // Day after tomorrow
  mkApt(2, '09:00', 'İrem Koç', '565***656', '05551114444', 'Dahiliye', 'Uzm. Dr. Ahmet Kaya', 'Onaylandı', 'MHRS', 'SGK', 'Kontrol'),
  mkApt(2, '09:15', 'Gökhan Avcı', '656***565', '05421114444', 'KBB', 'Uzm. Dr. Canan Yılmaz', 'Onaylandı', 'Online', 'SGK', 'Baş ağrısı'),
];

const INITIAL_QUEUE: QueueItem[] = [
  { id: 1, aptId: 0, name: 'Ali Çelik', time: '08:45', wait: 45, status: 'Muayenede' },
  { id: 2, aptId: 0, name: 'Zeynep Kaya', time: '09:00', wait: 18, status: 'Geldi' },
  { id: 3, aptId: 0, name: 'Can Yılmaz', time: '09:45', wait: 5, status: 'Kayıtta' },
  { id: 4, aptId: 0, name: 'Deniz Arslan', time: '10:00', wait: 0, status: 'Sırada' },
];

// ─── Status Config ────────────────────────────────────────
function getStatusColor(status: string) {
  switch (status) {
    case 'Tamamlandı': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Onaylandı': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Bekliyor': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'İptal': return 'bg-red-100 text-red-700 border-red-200';
    case 'Boş': return 'bg-slate-100 text-slate-500 border-slate-200 border-dashed';
    case 'Geldi': return 'bg-teal-100 text-teal-700 border-teal-200';
    case 'Muayenede': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

// ─── New Appointment Modal ────────────────────────────────
interface NewAptModalProps {
  onClose: () => void;
  onSave: (apt: Omit<Appointment, 'id'>) => void;
  initialDate: Date;
  initialTime?: string;
  initialDept?: string;
  initialDoctor?: string;
}

function NewAptModal({ onClose, onSave, initialDate, initialTime = '', initialDept = '', initialDoctor = '' }: NewAptModalProps) {
  const [tcInput, setTcInput] = useState('');
  const [lookupStatus, setLookupStatus] = useState<'idle' | 'loading' | 'found' | 'notfound'>('idle');
  const [form, setForm] = useState({
    patient: '', phone: '', insurance: 'SGK', complaint: '', notes: '',
    dept: initialDept || 'Dahiliye', doctor: initialDoctor || 'Uzm. Dr. Ahmet Kaya',
    source: 'Banko' as AptSource, time: initialTime || '09:00',
    date: initialDate,
  });

  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleLookup = () => {
    if (tcInput.length < 5) return;
    setLookupStatus('loading');
    setTimeout(() => {
      const mock = MOCK_PATIENTS[tcInput];
      if (mock) {
        setForm(p => ({ ...p, patient: mock.patient, phone: mock.phone, insurance: mock.insurance }));
        setLookupStatus('found');
      } else {
        setLookupStatus('notfound');
      }
    }, 1200);
  };

  const availableDoctors = DEPARTMENTS[form.dept] || [];

  const handleSave = () => {
    if (!form.patient || !form.dept || !form.doctor) return;
    onSave({
      dateKey: dateKey(form.date),
      time: form.time,
      patient: form.patient,
      tc: tcInput ? `${tcInput.slice(0, 3)}***${tcInput.slice(-3)}` : '???***???',
      phone: form.phone,
      dept: form.dept,
      doctor: form.doctor,
      status: 'Onaylandı',
      source: form.source,
      notes: form.notes,
      insurance: form.insurance,
      complaint: form.complaint,
      duration: 15,
      queueNo: Math.floor(Math.random() * 40) + 1,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Plus size={18} className="text-blue-500" /> Yeni Randevu Oluştur
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* TC Lookup */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">TC Kimlik / Hasta Arama</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <User className="absolute left-3 top-2.5 text-slate-400" size={15} />
                <input
                  type="text"
                  value={tcInput}
                  onChange={e => { setTcInput(e.target.value.replace(/\D/g, '').slice(0, 11)); setLookupStatus('idle'); }}
                  placeholder="TC Kimlik Numarası"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <button
                onClick={handleLookup}
                disabled={tcInput.length < 5 || lookupStatus === 'loading'}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 disabled:opacity-50 flex items-center gap-1.5"
              >
                {lookupStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                {lookupStatus === 'loading' ? 'Aranıyor...' : 'Sorgula'}
              </button>
            </div>
            {lookupStatus === 'found' && (
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                <CheckCircle2 size={13} /> Hasta bulundu: <strong>{form.patient}</strong>
              </div>
            )}
            {lookupStatus === 'notfound' && (
              <div className="mt-2 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <AlertTriangle size={13} /> Kayıt bulunamadı — manuel giriniz.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Ad Soyad <span className="text-red-500">*</span></label>
              <input type="text" value={form.patient} onChange={e => upd('patient', e.target.value)} placeholder="Hasta adı..." className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Telefon</label>
              <div className="flex">
                <span className="px-2 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-xs text-slate-600">+90</span>
                <input type="tel" value={form.phone} onChange={e => upd('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="5XX..." className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-r-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Poliklinik <span className="text-red-500">*</span></label>
              <select value={form.dept} onChange={e => { upd('dept', e.target.value); upd('doctor', DEPARTMENTS[e.target.value]?.[0] || ''); }} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">
                {Object.keys(DEPARTMENTS).map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Hekim <span className="text-red-500">*</span></label>
              <select value={form.doctor} onChange={e => upd('doctor', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">
                {availableDoctors.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Randevu Saati <span className="text-red-500">*</span></label>
              <select value={form.time} onChange={e => upd('time', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">
                {ALL_TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kaynak / Kanal</label>
              <select value={form.source} onChange={e => upd('source', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">
                {(['Banko', 'MHRS', 'Online', 'Çağrı Mrk.'] as AptSource[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Sigorta Tipi</label>
              <select value={form.insurance} onChange={e => upd('insurance', e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none">
                {['SGK', 'ÖSS', 'TSS', 'Ücretli', 'Yeşil Kart'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Başvuru Şikayeti</label>
              <input type="text" value={form.complaint} onChange={e => upd('complaint', e.target.value)} placeholder="Kontrol, ağrı, şikayet..." className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Not</label>
            <textarea value={form.notes} onChange={e => upd('notes', e.target.value)} rows={2} placeholder="Randevu notları..." className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">İptal</button>
          <button
            onClick={handleSave}
            disabled={!form.patient || !form.dept}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={15} /> Randevuyu Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Appointment Detail Modal ─────────────────────────────
interface AptDetailModalProps {
  apt: Appointment;
  onClose: () => void;
  onStatusChange: (id: number, status: AptStatus) => void;
  onAddNote: (id: number, note: string) => void;
  onOpenPatientRecord: (appointment: Appointment) => void;
}

function AptDetailModal({ apt, onClose, onStatusChange, onAddNote, onOpenPatientRecord }: AptDetailModalProps) {
  const [noteInput, setNoteInput] = useState(apt.notes || '');
  const [smsSent, setSmsSent] = useState(false);

  const statuses: { val: AptStatus; label: string; color: string }[] = [
    { val: 'Onaylandı', label: 'Onayla', color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' },
    { val: 'Geldi', label: 'Geldi', color: 'bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200' },
    { val: 'Muayenede', label: 'Muayenede', color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200' },
    { val: 'Tamamlandı', label: 'Tamamlandı', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200' },
    { val: 'İptal', label: 'İptal Et', color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={twc('p-5 border-b border-slate-100 flex items-center justify-between', apt.status === 'Muayenede' ? 'bg-purple-50' : apt.status === 'Tamamlandı' ? 'bg-emerald-50' : 'bg-slate-50/50')}>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{apt.patient}</h3>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
              <span className="font-mono">{apt.tc}</span>
              <span>{apt.time}</span>
              <span className={twc('px-2 py-0.5 rounded border text-[10px] font-bold', getStatusColor(apt.status))}>{apt.status}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Poliklinik', value: apt.dept, icon: Stethoscope },
              { label: 'Hekim', value: apt.doctor, icon: User },
              { label: 'Sigorta', value: apt.insurance, icon: Shield },
              { label: 'Kaynak', value: apt.source, icon: Hash },
              { label: 'Telefon', value: apt.phone || '—', icon: Phone },
              { label: 'Şikayet', value: apt.complaint || '—', icon: FileText },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase mb-1">
                  <f.icon size={10} /> {f.label}
                </div>
                <div className="text-sm font-semibold text-slate-800 truncate">{f.value}</div>
              </div>
            ))}
          </div>

          {/* Durum değiştir */}
          {apt.status !== 'İptal' && apt.status !== 'Tamamlandı' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Durum Güncelle</label>
              <div className="flex flex-wrap gap-2">
                {statuses.filter(s => s.val !== apt.status).map(s => (
                  <button
                    key={s.val}
                    onClick={() => { onStatusChange(apt.id, s.val); onClose(); }}
                    className={twc('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all', s.color)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Not */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Randevu Notu</label>
            <div className="flex gap-2">
              <textarea
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                rows={2}
                placeholder="Not ekle..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
              <button
                onClick={() => { onAddNote(apt.id, noteInput); }}
                className="px-3 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 self-stretch flex items-center justify-center"
              >
                <Save size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
              <Printer size={13} /> Fiş Yazdır
            </button>
            <button
              onClick={() => {
                onOpenPatientRecord(apt);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <Eye size={13} /> E-Hasta Dosyası
            </button>
            <button
              onClick={() => setSmsSent(true)}
              className={twc(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border',
                smsSent ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              )}
            >
              {smsSent ? <CheckCircle2 size={13} /> : <MessageSquare size={13} />}
              {smsSent ? 'SMS Gönderildi' : 'SMS Hatırlatma'}
            </button>
            <button
              onClick={() => { onStatusChange(apt.id, 'İptal'); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors ml-auto"
            >
              <Ban size={13} /> İptal Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Search Modal ─────────────────────────────────────────
function SearchModal({ appointments, onClose, onSelect }: { appointments: Appointment[]; onClose: () => void; onSelect: (a: Appointment) => void }) {
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const l = q.toLowerCase();
    return appointments.filter(a =>
      a.status !== 'Boş' &&
      (a.patient.toLowerCase().includes(l) || a.tc.includes(l) || a.doctor.toLowerCase().includes(l) || a.dept.toLowerCase().includes(l))
    ).slice(0, 12);
  }, [q, appointments]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 flex items-center gap-3 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Hasta adı, TC, hekim veya poliklinik..."
            className="flex-1 text-sm text-slate-800 outline-none placeholder-slate-400"
          />
          <button onClick={onClose}><X size={18} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        {results.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {results.map(a => (
              <button key={a.id} onClick={() => { onSelect(a); onClose(); }} className="w-full p-3 text-left hover:bg-slate-50 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-sm text-slate-800">{a.patient}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{a.dept} — {a.doctor} — {a.time}</div>
                </div>
                <span className={twc('px-2 py-0.5 rounded border text-[10px] font-bold shrink-0', getStatusColor(a.status))}>{a.status}</span>
              </button>
            ))}
          </div>
        ) : q.length > 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">Sonuç bulunamadı.</div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">Aramak için yazmaya başlayın...</div>
        )}
      </div>
    </div>
  );
}

// ─── Weekly View ──────────────────────────────────────────
function WeeklyView({ startDate, appointments, selectedDept, selectedDoctor, onDayClick }: {
  startDate: Date;
  appointments: Appointment[];
  selectedDept: string;
  selectedDoctor: string;
  onDayClick: (d: Date) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const filtered = appointments.filter(a =>
    (selectedDept === 'Tümü' || a.dept === selectedDept) &&
    (selectedDoctor === 'Tümü' || a.doctor === selectedDoctor)
  );

  const countByDay = (d: Date, status?: AptStatus) => {
    const k = dateKey(d);
    return filtered.filter(a => a.dateKey === k && a.status !== 'Boş' && (status ? a.status === status : true)).length;
  };

  const statusDot: Record<AptStatus, string> = {
    'Tamamlandı': 'bg-emerald-400', 'Onaylandı': 'bg-blue-400',
    'Bekliyor': 'bg-amber-400', 'İptal': 'bg-red-400',
    'Boş': 'bg-slate-200', 'Geldi': 'bg-teal-400', 'Muayenede': 'bg-purple-400',
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const isToday = dateKey(d) === dateKey(BASE_DATE);
          const dayApts = filtered.filter(a => a.dateKey === dateKey(d) && a.status !== 'Boş');
          return (
            <button
              key={i}
              onClick={() => onDayClick(d)}
              className={twc(
                'rounded-xl border p-3 text-left transition-all hover:shadow-md',
                isToday ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
              )}
            >
              <div className={twc('text-xs font-semibold mb-0.5', isToday ? 'text-blue-600' : 'text-slate-500')}>
                {DAYS_TR[d.getDay()].slice(0, 3)}
              </div>
              <div className={twc('text-xl font-bold mb-2', isToday ? 'text-blue-700' : 'text-slate-800')}>
                {d.getDate()}
              </div>
              <div className="text-xs font-bold text-slate-600 mb-2">{countByDay(d)} randevu</div>
              <div className="flex flex-wrap gap-1">
                {dayApts.slice(0, 8).map((a, j) => (
                  <div key={j} className={twc('w-2 h-2 rounded-full', statusDot[a.status])} title={`${a.time} ${a.patient}`} />
                ))}
                {dayApts.length > 8 && <span className="text-[9px] text-slate-400">+{dayApts.length - 8}</span>}
              </div>
              {countByDay(d, 'İptal') > 0 && (
                <div className="mt-1 text-[9px] text-red-500">{countByDay(d, 'İptal')} iptal</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
export function AppointmentManagement() {
  const navigate = useNavigate();
  const { setCurrentPatient } = usePatientContext();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [currentDate, setCurrentDate] = useState(new Date(BASE_DATE));
  const [selectedDept, setSelectedDept] = useState('Tümü');
  const [selectedDoctor, setSelectedDoctor] = useState('Tümü');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE);

  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetail, setShowDetail] = useState<Appointment | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [actionMenu, setActionMenu] = useState<number | null>(null);
  const [newSlotTime, setNewSlotTime] = useState('');

  const [mhrsStatus, setMhrsStatus] = useState<'idle' | 'loading'>('idle');
  const [lastSync, setLastSync] = useState('10:45');

  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Close action menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target as Node)) {
        setActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const curDateKey = dateKey(currentDate);

  // Filtered appointments for current view
  const filteredApts = useMemo(() => {
    return appointments.filter(a =>
      a.dateKey === curDateKey &&
      (selectedDept === 'Tümü' || a.dept === selectedDept) &&
      (selectedDoctor === 'Tümü' || a.doctor === selectedDoctor)
    );
  }, [appointments, curDateKey, selectedDept, selectedDoctor]);

  // Build slot-based list for the table
  const slotList = useMemo(() => {
    const aptMap: Record<string, Appointment> = {};
    filteredApts.forEach(a => { aptMap[a.time] = a; });
    return ALL_TIME_SLOTS.map(time => aptMap[time] || {
      id: -1, dateKey: curDateKey, time,
      patient: '-', tc: '-', phone: '-',
      dept: selectedDept === 'Tümü' ? 'Dahiliye' : selectedDept,
      doctor: selectedDoctor === 'Tümü' ? 'Uzm. Dr. Ahmet Kaya' : selectedDoctor,
      status: 'Boş' as AptStatus, source: '-' as AptSource,
      notes: '', insurance: '-', complaint: '-', duration: 15,
    });
  }, [filteredApts, curDateKey, selectedDept, selectedDoctor]);

  // Stats
  const stats = useMemo(() => {
    const real = filteredApts.filter(a => a.status !== 'Boş');
    return {
      toplam: real.length,
      tamamlanan: real.filter(a => a.status === 'Tamamlandı').length,
      bekleyen: real.filter(a => a.status === 'Bekliyor' || a.status === 'Onaylandı' || a.status === 'Geldi').length,
      iptal: real.filter(a => a.status === 'İptal').length,
      muayenede: real.filter(a => a.status === 'Muayenede').length,
    };
  }, [filteredApts]);

  // Actions
  const changeStatus = (id: number, status: AptStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (status === 'Tamamlandı' || status === 'Muayenede') {
      setQueue(prev => prev.map(q => q.aptId === id ? { ...q, status: status === 'Muayenede' ? 'Muayenede' : 'Muayenede' } : q));
    }
  };

  const addNote = (id: number, note: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, notes: note } : a));
  };

  const addAppointment = (apt: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = { ...apt, id: nextId++ };
    setAppointments(prev => {
      const filtered2 = prev.filter(a => !(a.dateKey === apt.dateKey && a.time === apt.time && a.dept === apt.dept && a.doctor === apt.doctor));
      return [...filtered2, newApt];
    });
    setShowNewModal(false);
    setNewSlotTime('');
  };

  const openPatientRecord = (appointment: Appointment) => {
    const sharedPatient = createPatientContextFromAppointment(appointment);
    if (!sharedPatient) {
      return;
    }

    setCurrentPatient(sharedPatient);
    navigate(getModulePath('Elektronik Hasta Dosyası'));
  };

  const callPatient = (item: QueueItem) => {
    setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'Çağrıldı' } : q));
    changeStatus(item.aptId, 'Muayenede');
  };

  const handleMHRSSync = () => {
    setMhrsStatus('loading');
    setTimeout(() => {
      const now = new Date();
      setLastSync(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setMhrsStatus('idle');
    }, 2000);
  };

  // Available doctors for selected dept
  const availableDoctors = selectedDept !== 'Tümü' ? DEPARTMENTS[selectedDept] || [] : [];

  // Active doctor label
  const activeDoctor = selectedDoctor !== 'Tümü' ? selectedDoctor : (selectedDept !== 'Tümü' ? DEPARTMENTS[selectedDept]?.[0] || 'Tüm Hekimler' : 'Tüm Hekimler');
  const activeDept = selectedDept !== 'Tümü' ? selectedDept : 'Tüm Poliklinikler';

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Modals */}
      {showNewModal && (
        <NewAptModal
          onClose={() => { setShowNewModal(false); setNewSlotTime(''); }}
          onSave={addAppointment}
          initialDate={currentDate}
          initialTime={newSlotTime}
          initialDept={selectedDept !== 'Tümü' ? selectedDept : ''}
          initialDoctor={selectedDoctor !== 'Tümü' ? selectedDoctor : ''}
        />
      )}
      {showDetail && (
        <AptDetailModal
          apt={showDetail}
          onClose={() => setShowDetail(null)}
          onStatusChange={changeStatus}
          onAddNote={addNote}
          onOpenPatientRecord={openPatientRecord}
        />
      )}
      {showSearch && (
        <SearchModal
          appointments={appointments}
          onClose={() => setShowSearch(false)}
          onSelect={a => { setShowDetail(a); }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Randevu Yönetimi</h2>
          <p className="text-sm text-slate-500">Poliklinik randevuları, MHRS entegrasyonu ve takvim yönetimi.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Search size={16} /> Randevu Ara
          </button>
          <button
            onClick={() => { setNewSlotTime(''); setShowNewModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> Yeni Randevu (Manuel)
          </button>
        </div>
      </div>

      {/* Filters & Calendar Nav */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 flex-none">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              className={twMerge("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors", view === 'day' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800")}
              onClick={() => setView('day')}
            >
              Günlük
            </button>
            <button
              className={twMerge("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors", view === 'week' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800")}
              onClick={() => setView('week')}
            >
              Haftalık
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(d => addDays(d, view === 'week' ? -7 : -1))}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            ><ChevronLeft size={20} /></button>
            <div className="flex items-center gap-2 font-semibold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 min-w-[200px] justify-center">
              <CalendarDays size={16} className="text-blue-500" />
              <span>{view === 'week'
                ? `${currentDate.getDate()} – ${addDays(currentDate, 6).getDate()} ${MONTHS_TR[currentDate.getMonth()]}`
                : formatDateTR(currentDate)
              }</span>
            </div>
            <button
              onClick={() => setCurrentDate(d => addDays(d, view === 'week' ? 7 : 1))}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
            ><ChevronRight size={20} /></button>
            {dateKey(currentDate) !== dateKey(BASE_DATE) && (
              <button
                onClick={() => setCurrentDate(new Date(BASE_DATE))}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Bugün
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={e => { setSelectedDept(e.target.value); setSelectedDoctor('Tümü'); }}
            className="w-full md:w-48 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Tümü">Tüm Poliklinikler</option>
            {Object.keys(DEPARTMENTS).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={selectedDept === 'Tümü'}
          >
            <option value="Tümü">Tüm Hekimler</option>
            {availableDoctors.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">

        {/* Left Sidebar */}
        <div className="flex flex-col gap-4 flex-none lg:flex-1 overflow-hidden">
          {/* Summary Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="text-blue-500" size={18} />
              Günlük Özet
            </h3>
            <div className="text-xs text-slate-500 -mt-2 truncate">{activeDept} — {activeDoctor.split(' ').slice(-2).join(' ')}</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Toplam Randevu</p>
                <div className="text-2xl font-bold text-slate-800">{stats.toplam}</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-600 font-medium mb-1">Gelen / Tamamlanan</p>
                <div className="text-2xl font-bold text-emerald-700">{stats.tamamlanan}</div>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-600 font-medium mb-1">Bekleyen (Kuyruk)</p>
                <div className="text-2xl font-bold text-amber-700">{stats.bekleyen}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                <p className="text-xs text-red-600 font-medium mb-1">İptal / Gelmeyen</p>
                <div className="text-2xl font-bold text-red-700">{stats.iptal}</div>
              </div>
            </div>
            {stats.muayenede > 0 && (
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-xs font-semibold text-purple-700">{stats.muayenede} hasta şu an muayenede</span>
              </div>
            )}

            {/* MHRS Sync Status */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Clock size={12} /> Son MHRS Senkronu: {lastSync}
              </span>
              <button
                onClick={handleMHRSSync}
                disabled={mhrsStatus === 'loading'}
                className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-60"
              >
                {mhrsStatus === 'loading' ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                {mhrsStatus === 'loading' ? 'Eşitleniyor...' : 'Şimdi Eşitle'}
              </button>
            </div>
          </div>

          {/* Live Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[300px] overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <User className="text-slate-500" size={18} /> Bekleyen Hasta Kuyruğu
              </h3>
              <button
                onClick={() => { setNewSlotTime(''); setShowNewModal(true); }}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-0">
              <div className="divide-y divide-slate-100">
                {queue.map((q) => (
                  <div key={q.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-slate-800">{q.name}</h4>
                        <p className="text-xs text-slate-500">Randevu: {q.time}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={twMerge(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          q.status === 'Gecikti' ? 'bg-red-100 text-red-700' :
                            q.status === 'Sırada' ? 'bg-amber-100 text-amber-700' :
                              q.status === 'Çağrıldı' ? 'bg-purple-100 text-purple-700' :
                                q.status === 'Muayenede' ? 'bg-purple-100 text-purple-700' :
                                  'bg-blue-100 text-blue-700'
                        )}>{q.status}</span>
                        {q.wait > 0 && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-0.5"><Clock size={10} /> Bekleme: {q.wait} dk</p>
                        )}
                      </div>
                    </div>
                    {(q.status === 'Sırada' || q.status === 'Gecikti') && (
                      <button
                        onClick={() => callPatient(q)}
                        className="mt-2 w-full py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <PhoneCall size={10} /> Hastayı Çağır
                      </button>
                    )}
                    {q.status === 'Çağrıldı' && (
                      <div className="mt-1.5 text-[10px] text-purple-600 font-semibold flex items-center gap-1">
                        <Bell size={10} className="animate-pulse" /> Çağrı yapıldı, bekleniyor...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[calc(100vh-14rem)] min-h-[500px]">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Stethoscope className="text-blue-500" size={18} />
              {activeDept} — {activeDoctor}
            </h3>
            <div className="flex gap-2 items-center">
              <span className={twc(
                'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border',
                mhrsStatus === 'loading'
                  ? 'bg-amber-50 text-amber-600 border-amber-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              )}>
                {mhrsStatus === 'loading' ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
                {mhrsStatus === 'loading' ? 'MHRS Eşitleniyor' : 'MHRS Açık'}
              </span>
            </div>
          </div>

          {view === 'week' ? (
            <WeeklyView
              startDate={currentDate}
              appointments={appointments}
              selectedDept={selectedDept}
              selectedDoctor={selectedDoctor}
              onDayClick={d => { setCurrentDate(d); setView('day'); }}
            />
          ) : (
            <div className="flex-1 overflow-y-auto p-0 relative">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider w-24">Saat</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Hasta (TC)</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Şikayet / Not</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Kaynak</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Durum</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {slotList.map((apt) => (
                    <tr
                      key={apt.id === -1 ? `empty-${apt.time}` : apt.id}
                      className={twMerge(
                        "transition-colors",
                        apt.status === 'Boş' ? "hover:bg-blue-50/50 cursor-pointer" : "hover:bg-slate-50 cursor-pointer",
                        apt.status === 'Muayenede' ? 'bg-purple-50/40' : ''
                      )}
                      onClick={() => {
                        if (apt.status === 'Boş') { setNewSlotTime(apt.time); setShowNewModal(true); }
                        else if (apt.id !== -1) setShowDetail(apt as Appointment);
                      }}
                    >
                      <td className="py-3 px-4">
                        <div className={twc(
                          'font-bold w-fit px-2 py-1 rounded text-sm',
                          apt.status === 'Muayenede' ? 'bg-purple-100 text-purple-700' :
                            apt.status === 'Boş' ? 'bg-slate-50 text-slate-400 group-hover:text-blue-600' :
                              'bg-slate-100 text-slate-700'
                        )}>{apt.time}</div>
                      </td>
                      <td className="py-3 px-4">
                        {apt.status === 'Boş' ? (
                          <div className="text-slate-400 font-medium italic text-xs flex items-center gap-1 opacity-60 hover:opacity-100">
                            <Plus size={13} className="text-blue-500" /> Bu saate randevu ver
                          </div>
                        ) : (
                          <div>
                            <div className="font-semibold text-slate-800">{apt.patient}</div>
                            <div className="text-xs text-slate-400 font-mono">{apt.tc}</div>
                            {apt.phone && apt.phone !== '-' && (
                              <div className="text-[10px] text-slate-400 flex items-center gap-0.5 mt-0.5">
                                <Phone size={9} /> {apt.phone}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        {apt.status !== 'Boş' && (
                          <div>
                            <div className="text-xs text-slate-600 truncate max-w-[140px]">{apt.complaint || '—'}</div>
                            {apt.notes && (
                              <div className="text-[10px] text-blue-500 flex items-center gap-0.5 mt-0.5">
                                <FileText size={9} /> Not var
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {apt.status !== 'Boş' && (
                          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {apt.source}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={twMerge("px-2.5 py-1 text-xs font-semibold rounded-md border", getStatusColor(apt.status))}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        {apt.status !== 'Boş' && apt.id !== -1 && (
                          <div className="relative inline-block" ref={actionMenu === apt.id ? actionMenuRef : undefined}>
                            <button
                              onClick={() => setActionMenu(actionMenu === apt.id ? null : apt.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {actionMenu === apt.id && (
                              <div className="absolute right-0 top-8 bg-white rounded-xl border border-slate-200 shadow-xl z-30 min-w-[170px] py-1 overflow-hidden">
                                <button
                                  onClick={() => { setShowDetail(apt as Appointment); setActionMenu(null); }}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                  <Eye size={13} /> Detay & Düzenle
                                </button>
                                {apt.status !== 'Tamamlandı' && apt.status !== 'İptal' && (
                                  <>
                                    {apt.status !== 'Geldi' && (
                                      <button onClick={() => { changeStatus(apt.id, 'Geldi'); setActionMenu(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50">
                                        <UserCheck size={13} /> Geldi İşaretle
                                      </button>
                                    )}
                                    {apt.status !== 'Muayenede' && (
                                      <button onClick={() => { changeStatus(apt.id, 'Muayenede'); setActionMenu(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50">
                                        <Stethoscope size={13} /> Muayeneye Al
                                      </button>
                                    )}
                                    <button onClick={() => { changeStatus(apt.id, 'Tamamlandı'); setActionMenu(null); }} className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                                      <CheckCircle2 size={13} /> Tamamlandı
                                    </button>
                                  </>
                                )}
                                <button className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                  <MessageSquare size={13} /> SMS Gönder
                                </button>
                                <button className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                  <RotateCcw size={13} /> Randevu Ertele
                                </button>
                                <div className="border-t border-slate-100 mt-1 pt-1">
                                  <button
                                    onClick={() => { changeStatus(apt.id, 'İptal'); setActionMenu(null); }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                  >
                                    <XCircle size={13} /> İptal Et
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
