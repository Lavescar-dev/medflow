import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, MapPin, Phone, User,
  Users, Info, Clock, AlertCircle, CalendarDays, Key,
  Bed, Stethoscope, ChevronRight, X, Plus,
  Save, CheckCircle2, XCircle, Shield,
  AlertTriangle, Bell, Printer, Eye,
  MessageSquare, Package, UserCheck, UserPlus,
  Filter, LogOut, PhoneCall,
  Navigation, Zap, Activity
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────
type Ward = 'Dahiliye' | 'Kardiyoloji' | 'Nöroloji' | 'Ortopedi' | 'Kadın Doğum' | 'Pediatri' | 'Genel Cerrahi' | 'Göğüs Hastalıkları';
type PatientStatus = 'Yatıyor' | 'Ameliyatta' | 'YBÜ' | 'Taburcu Sürecinde';
type ComplaintCategory = 'Personel Davranışı' | 'Temizlik' | 'Bekleme Süresi' | 'Yiyecek/İçecek' | 'Teknik Arıza' | 'Diğer';
type LostStatus = 'Aranıyor' | 'Bulundu' | 'Teslim Edildi';

interface InPatient {
  id: number;
  name: string;
  tc: string;
  age: number;
  ward: Ward;
  block: string;
  floor: number;
  room: string;
  bed: number;
  doctor: string;
  admissionDate: string;
  status: PatientStatus;
  companion: string | null;
  companionPhone: string | null;
  insurance: string;
  notes: string;
  phone: string;
}

interface Visitor {
  id: number;
  patientId: number;
  visitorName: string;
  tc: string;
  phone: string;
  relation: string;
  entryTime: string;
  exitTime: string | null;
  cardNo: string;
  date: string;
  active: boolean;
}

interface Companion {
  id: number;
  patientId: number;
  patientName: string;
  name: string;
  tc: string;
  phone: string;
  relation: string;
  startDate: string;
  meals: boolean;
  active: boolean;
  room: string;
}

interface Complaint {
  id: number;
  trackNo: string;
  category: ComplaintCategory;
  description: string;
  patientName: string;
  phone: string;
  priority: 'Acil' | 'Normal' | 'Düşük';
  status: 'Açık' | 'İnceleniyor' | 'Kapatıldı';
  date: string;
}

interface LostItem {
  id: number;
  trackNo: string;
  type: string;
  description: string;
  location: string;
  date: string;
  ownerName: string;
  ownerPhone: string;
  status: LostStatus;
  foundBy?: string;
}

// ─── Mock Data ────────────────────────────────────────────
const INPATIENTS: InPatient[] = [
  { id: 1, name: 'Mehmet Yılmaz', tc: '123***789', age: 58, ward: 'Dahiliye', block: 'B', floor: 3, room: '304', bed: 2, doctor: 'Uzm. Dr. Ahmet Kaya', admissionDate: '03.04.2026', status: 'Yatıyor', companion: 'Selin Yılmaz', companionPhone: '05551234567', insurance: 'SGK', notes: 'Diabet takibi. Ziyaret kısıtlaması yok.', phone: '05329876543' },
  { id: 2, name: 'Fatma Demir', tc: '456***321', age: 71, ward: 'Kardiyoloji', block: 'A', floor: 2, room: '212', bed: 1, doctor: 'Prof. Dr. Serhan Öz', admissionDate: '05.04.2026', status: 'Yatıyor', companion: null, companionPhone: null, insurance: 'SGK', notes: 'Kalp ritim bozukluğu. Gürültülü ziyaret önerilmez.', phone: '05421112222' },
  { id: 3, name: 'Ali Çelik', tc: '789***654', age: 45, ward: 'Nöroloji', block: 'C', floor: 3, room: '315', bed: 1, doctor: 'Prof. Dr. İbrahim Tekin', admissionDate: '01.04.2026', status: 'Yatıyor', companion: 'Hasan Çelik', companionPhone: '05361239988', insurance: 'ÖSS', notes: 'Serebral iskemi. Sakin ortam gerekli.', phone: '05501113333' },
  { id: 4, name: 'Zeynep Kara', tc: '321***987', age: 32, ward: 'Kadın Doğum', block: 'D', floor: 4, room: '401', bed: 1, doctor: 'Doç. Dr. Neslihan Korkmaz', admissionDate: '07.04.2026', status: 'Yatıyor', companion: 'Ahmet Kara', companionPhone: '05451237890', insurance: 'SGK', notes: 'Normal vajinal doğum sonrası. Bebek ile birlikte.', phone: '05323214567' },
  { id: 5, name: 'Hüseyin Arslan', tc: '654***123', age: 67, ward: 'Genel Cerrahi', block: 'B', floor: 2, room: '218', bed: 3, doctor: 'Op. Dr. Serkan Güler', admissionDate: '06.04.2026', status: 'Ameliyatta', companion: 'Muazzez Arslan', companionPhone: '05551119090', insurance: 'TSS', notes: 'Kolesistektomi operasyonu devam ediyor.', phone: '05321234567' },
  { id: 6, name: 'Elif Şahin', tc: '987***456', age: 8, ward: 'Pediatri', block: 'D', floor: 4, room: '435', bed: 2, doctor: 'Uzm. Dr. Büşra Kılıç', admissionDate: '06.04.2026', status: 'Yatıyor', companion: 'Gül Şahin (Anne)', companionPhone: '05421230000', insurance: 'SGK', notes: 'RSV bronşiolit. Anne refakatçi.', phone: '05361230000' },
  { id: 7, name: 'Rıza Topçu', tc: '111***222', age: 74, ward: 'Göğüs Hastalıkları', block: 'B', floor: 2, room: '231', bed: 1, doctor: 'Doç. Dr. Selin Çetin', admissionDate: '02.04.2026', status: 'Yatıyor', companion: null, companionPhone: null, insurance: 'SGK', notes: 'KOAH alevlenme. Oksijen desteği var.', phone: '05501234500' },
  { id: 8, name: 'Canan Yıldız', tc: '333***444', age: 52, ward: 'Ortopedi', block: 'C', floor: 3, room: '322', bed: 2, doctor: 'Prof. Dr. Serkan Güler', admissionDate: '04.04.2026', status: 'Taburcu Sürecinde', companion: 'Turgut Yıldız', companionPhone: '05551230001', insurance: 'ÖSS', notes: 'Diz protezi. Taburcu hazırlığı yapılıyor.', phone: '05329870001' },
  { id: 9, name: 'Süleyman Koç', tc: '555***666', age: 61, ward: 'Kardiyoloji', block: 'A', floor: 2, room: '205', bed: 2, doctor: 'Uzm. Dr. Burcu Şahin', admissionDate: '07.04.2026', status: 'YBÜ', companion: null, companionPhone: null, insurance: 'SGK', notes: 'Akut MI sonrası KYBü takip. Ziyaret yasak.', phone: '' },
  { id: 10, name: 'Hatice Güneş', tc: '777***888', age: 39, ward: 'Dahiliye', block: 'B', floor: 3, room: '309', bed: 1, doctor: 'Doç. Dr. Selin Çetin', admissionDate: '05.04.2026', status: 'Yatıyor', companion: null, companionPhone: null, insurance: 'Ücretli', notes: 'Anemi. Kan transfüzyonu yapıldı.', phone: '05421238888' },
];

const INITIAL_VISITORS: Visitor[] = [
  { id: 1, patientId: 1, visitorName: 'Kemal Yılmaz', tc: '100***200', phone: '05551110001', relation: 'Oğlu', entryTime: '13:15', exitTime: null, cardNo: 'ZK-2026-0041', date: '07.04.2026', active: true },
  { id: 2, patientId: 3, visitorName: 'Ayşe Çelik', tc: '200***300', phone: '05421110002', relation: 'Eşi', entryTime: '13:20', exitTime: null, cardNo: 'ZK-2026-0042', date: '07.04.2026', active: true },
  { id: 3, patientId: 6, visitorName: 'Musa Şahin', tc: '300***400', phone: '05321110003', relation: 'Babası', entryTime: '13:05', exitTime: '14:30', cardNo: 'ZK-2026-0040', date: '07.04.2026', active: false },
];

const INITIAL_COMPANIONS: Companion[] = [
  { id: 1, patientId: 1, patientName: 'Mehmet Yılmaz', name: 'Selin Yılmaz', tc: '400***500', phone: '05551234567', relation: 'Kızı', startDate: '03.04.2026', meals: true, active: true, room: 'B3-304' },
  { id: 2, patientId: 3, patientName: 'Ali Çelik', name: 'Hasan Çelik', tc: '500***600', phone: '05361239988', relation: 'Kardeşi', startDate: '01.04.2026', meals: false, active: true, room: 'C3-315' },
  { id: 3, patientId: 4, patientName: 'Zeynep Kara', name: 'Ahmet Kara', tc: '600***700', phone: '05451237890', relation: 'Eşi', startDate: '07.04.2026', meals: true, active: true, room: 'D4-401' },
  { id: 4, patientId: 5, patientName: 'Hüseyin Arslan', name: 'Muazzez Arslan', tc: '700***800', phone: '05551119090', relation: 'Eşi', startDate: '06.04.2026', meals: true, active: true, room: 'B2-218' },
  { id: 5, patientId: 6, patientName: 'Elif Şahin', name: 'Gül Şahin', tc: '800***900', phone: '05421230000', relation: 'Annesi', startDate: '06.04.2026', meals: true, active: true, room: 'D4-435' },
];

const INITIAL_COMPLAINTS: Complaint[] = [
  { id: 1, trackNo: 'ŞÖ-2026-0089', category: 'Bekleme Süresi', description: 'Acil serviste 3 saat bekledim, kimse ilgilenmedi.', patientName: 'Servet Öztürk', phone: '05551110011', priority: 'Acil', status: 'İnceleniyor', date: '06.04.2026' },
  { id: 2, trackNo: 'ŞÖ-2026-0088', category: 'Temizlik', description: 'B Blok 3. kat koridoru temizlenmemiş.', patientName: 'Halide Kaya', phone: '05321110022', priority: 'Normal', status: 'Açık', date: '07.04.2026' },
  { id: 3, trackNo: 'ŞÖ-2026-0087', category: 'Personel Davranışı', description: 'Hemşire sert davrandı, sorularımı yanıtlamadı.', patientName: 'Zeki Karabıyık', phone: '05421110033', priority: 'Normal', status: 'Kapatıldı', date: '05.04.2026' },
];

const INITIAL_LOST: LostItem[] = [
  { id: 1, trackNo: 'KE-2026-0012', type: 'Cüzdan', description: 'Siyah deri cüzdan, içinde kimlik ve kredi kartı var.', location: 'Zemin Kat Poliklinik Koridoru', date: '06.04.2026', ownerName: 'Tuncay Boran', ownerPhone: '05551119988', status: 'Aranıyor' },
  { id: 2, trackNo: 'KE-2026-0011', type: 'Cep Telefonu', description: 'Samsung Galaxy mavi kılıflı.', location: 'Radyoloji Bekleme Salonu', date: '05.04.2026', ownerName: 'Bilinmiyor', ownerPhone: '', status: 'Bulundu', foundBy: 'Güvenlik Birimi' },
];

const DUTY_STAFF = [
  { role: 'Acil Servis Sorumlusu', name: 'Dr. Hakan Çelik', ext: '1120', dept: 'Acil' },
  { role: 'Dahiliye İcapçı', name: 'Uzm. Dr. Burak Yılmaz', ext: '2210', dept: 'Dahiliye' },
  { role: 'Genel Cerrahi İcapçı', name: 'Op. Dr. Sinan Kaya', ext: '2320', dept: 'Cerrahi' },
  { role: 'Çocuk İcapçı', name: 'Uzm. Dr. Elif Şahin', ext: '2415', dept: 'Pediatri' },
  { role: 'Anestezi Nöbetçi', name: 'Uzm. Dr. Canan Demir', ext: '2510', dept: 'Anestezi' },
  { role: 'Kardiyoloji İcapçı', name: 'Uzm. Dr. Mert Özkan', ext: '2220', dept: 'Kardiyoloji' },
  { role: 'Süpervizör Hemşire', name: 'Hem. Sevgi Aslan', ext: '1200', dept: 'Hemşirelik' },
  { role: 'Gece Amiri (İdari)', name: 'Kemal Öztürk', ext: '1001', dept: 'İdari' },
];

const FLOOR_PLAN = [
  { title: 'Zemin Kat (Z)', areas: ['Poliklinikler', 'Acil Servis', 'Radyoloji', 'Kan Alma'], color: 'blue' },
  { title: '1. Kat', areas: ['Ameliyathane', 'Genel YBÜ', 'KVC Ünitesi'], color: 'purple' },
  { title: '2. Kat', areas: ['Dahiliye Servisi', 'Göğüs Hastalıkları', 'Kardiyoloji'], color: 'emerald' },
  { title: '3. Kat', areas: ['Ortopedi', 'Nöroloji', 'Beyin Cerrahi'], color: 'amber' },
  { title: '4. Kat', areas: ['Kadın Doğum', 'Yenidoğan YBÜ', 'Pediatri'], color: 'rose' },
  { title: '5. Kat', areas: ['VIP Odalar', 'Başhekimlik', 'İdari Birimler'], color: 'slate' },
  { title: '-1. Kat', areas: ['Laboratuvar', 'Eczane', 'Kafeterya', 'Mescit'], color: 'teal' },
  { title: '-2. Kat', areas: ['Otopark', 'Morg', 'MSÜ', 'Çamaşırhane'], color: 'slate' },
];

const PHONE_BOOK = [
  { dept: 'Acil Servis Banko', ext: '1120' },
  { dept: 'Mavi Kod (Kardiyak)', ext: '2222' },
  { dept: 'Pembe Kod (Çocuk)', ext: '3333' },
  { dept: 'Beyaz Kod (Güvenlik)', ext: '1111' },
  { dept: 'Kan Merkezi', ext: '1450' },
  { dept: 'Başhekimlik Sekreterliği', ext: '1001' },
  { dept: 'Hasta Hakları Birimi', ext: '1099' },
  { dept: 'Eczane (Ana)', ext: '1600' },
  { dept: 'Laboratuvar Sonuç', ext: '1700' },
  { dept: 'Klinik Mühendislik', ext: '1800' },
  { dept: 'Sosyal Hizmetler', ext: '1090' },
  { dept: 'Psikiyatri Acil', ext: '2600' },
];

// ─── Helpers ─────────────────────────────────────────────
function genCardNo() { return `ZK-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`; }
function genTrackNo(prefix: string) { return `${prefix}-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`; }
function now() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function statusBadge(s: PatientStatus) {
  switch (s) {
    case 'Yatıyor': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Ameliyatta': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'YBÜ': return 'bg-red-100 text-red-700 border-red-200';
    case 'Taburcu Sürecinde': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

const wardColors: Record<string, string> = {
  'Dahiliye': 'bg-blue-100 text-blue-700',
  'Kardiyoloji': 'bg-rose-100 text-rose-700',
  'Nöroloji': 'bg-purple-100 text-purple-700',
  'Ortopedi': 'bg-amber-100 text-amber-700',
  'Kadın Doğum': 'bg-pink-100 text-pink-700',
  'Pediatri': 'bg-teal-100 text-teal-700',
  'Genel Cerrahi': 'bg-orange-100 text-orange-700',
  'Göğüs Hastalıkları': 'bg-cyan-100 text-cyan-700',
};

// ─── Patient Detail Panel ─────────────────────────────────
function PatientDetailModal({ patient, onClose, onAddVisitor, onAddCompanion }: {
  patient: InPatient;
  onClose: () => void;
  onAddVisitor: (p: InPatient) => void;
  onAddCompanion: (p: InPatient) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={`p-5 border-b flex items-center justify-between ${patient.status === 'YBÜ' ? 'bg-red-50 border-red-100' : patient.status === 'Ameliyatta' ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-100'}`}>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{patient.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono text-slate-500">{patient.tc}</span>
              <span className="text-xs text-slate-500">{patient.age} yaş</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge(patient.status)}`}>{patient.status}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Location */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Bed size={22} /></div>
            <div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Konum</div>
              <div className="font-bold text-slate-800 text-base">{patient.block} Blok, {patient.floor}. Kat — Oda {patient.room}, Yatak {patient.bed}</div>
              <div className={`text-xs font-semibold mt-1 inline-block px-2 py-0.5 rounded ${wardColors[patient.ward] || 'bg-slate-100 text-slate-700'}`}>{patient.ward} Servisi</div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Sorumlu Hekim', value: patient.doctor, icon: Stethoscope },
              { label: 'Yatış Tarihi', value: patient.admissionDate, icon: CalendarDays },
              { label: 'Sigorta Tipi', value: patient.insurance, icon: Shield },
              { label: 'Telefon', value: patient.phone || '—', icon: Phone },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase mb-1"><f.icon size={10} /> {f.label}</div>
                <div className="text-sm font-semibold text-slate-800 truncate">{f.value}</div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {patient.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 font-medium">{patient.notes}</p>
            </div>
          )}

          {/* Companion */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-slate-500" />
              <div>
                <div className="text-xs font-semibold text-slate-500">Refakatçi</div>
                {patient.companion ? (
                  <div className="text-sm font-bold text-slate-800">{patient.companion} <span className="text-xs font-normal text-slate-500">({patient.companionPhone})</span></div>
                ) : (
                  <div className="text-sm text-slate-400 italic">Refakatçi yok</div>
                )}
              </div>
            </div>
          </div>

          {/* YBÜ warning */}
          {(patient.status === 'YBÜ') && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2">
              <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-800 font-semibold">Bu hasta Yoğun Bakım Ünitesi'nde. Ziyaret yasaktır. Bilgi için hekim onayı gereklidir.</p>
            </div>
          )}
        </div>

        <div className="px-5 pb-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {patient.status !== 'YBÜ' && (
            <button
              onClick={() => { onAddVisitor(patient); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={13} /> Ziyaretçi Kaydı
            </button>
          )}
          {!patient.companion && patient.status !== 'YBÜ' && (
            <button
              onClick={() => { onAddCompanion(patient); onClose(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <UserPlus size={13} /> Refakatçi Tanımla
            </button>
          )}
          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
            <Printer size={13} /> Ziyaret Fişi
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Visitor Modal ────────────────────────────────────────
function VisitorModal({ patient, onClose, onSave }: { patient: InPatient; onClose: () => void; onSave: (v: Visitor) => void }) {
  const [form, setForm] = useState({ visitorName: '', tc: '', phone: '', relation: 'Eşi' });
  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.visitorName) return;
    const v: Visitor = {
      id: Date.now(), patientId: patient.id,
      visitorName: form.visitorName, tc: form.tc ? `${form.tc.slice(0, 3)}***${form.tc.slice(-3)}` : '???***???',
      phone: form.phone, relation: form.relation,
      entryTime: now(), exitTime: null,
      cardNo: genCardNo(), date: '07.04.2026', active: true,
    };
    onSave(v);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Key size={16} className="text-blue-500" /> Ziyaretçi Kartı Düzenle</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 text-sm font-medium text-blue-800 flex items-center gap-2">
            <Bed size={14} /> {patient.name} — {patient.block}{patient.floor}-{patient.room} / Yatak {patient.bed}
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Ziyaretçi Adı Soyadı <span className="text-red-500">*</span></label>
              <input value={form.visitorName} onChange={e => upd('visitorName', e.target.value)} placeholder="Ad Soyad" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">TC Kimlik</label>
                <input value={form.tc} onChange={e => upd('tc', e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="TC No" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Telefon</label>
                <input value={form.phone} onChange={e => upd('phone', e.target.value)} placeholder="05XX..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Hasta ile İlişkisi</label>
              <select value={form.relation} onChange={e => upd('relation', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {['Eşi', 'Annesi', 'Babası', 'Oğlu', 'Kızı', 'Kardeşi', 'Yakını', 'Arkadaşı', 'Diğer'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info size={13} className="text-slate-400 mt-0.5 shrink-0" />
            Ziyaret saatleri: 13:00–15:00 / 19:00–21:00. Kart giriş anında verilecektir. Yoğun bakım hastaları için ziyaret yasaktır.
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50">İptal</button>
          <button onClick={handleSave} disabled={!form.visitorName} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm">
            <Save size={14} /> Kartı Düzenle & Yazdır
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Companion Modal ──────────────────────────────────────
function CompanionModal({ patient, onClose, onSave }: { patient: InPatient; onClose: () => void; onSave: (c: Companion) => void }) {
  const [form, setForm] = useState({ name: '', tc: '', phone: '', relation: 'Eşi', meals: false });
  const upd = (k: string, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name) return;
    const c: Companion = {
      id: Date.now(), patientId: patient.id, patientName: patient.name,
      name: form.name, tc: form.tc ? `${form.tc.slice(0, 3)}***${form.tc.slice(-3)}` : '???***???',
      phone: form.phone, relation: form.relation as string,
      startDate: '07.04.2026', meals: form.meals, active: true,
      room: `${patient.block}${patient.floor}-${patient.room}`,
    };
    onSave(c);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 bg-emerald-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><UserPlus size={16} className="text-emerald-500" /> Refakatçi Kaydı</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-sm font-medium text-emerald-800 flex items-center gap-2">
            <Bed size={14} /> {patient.name} — {patient.block}{patient.floor}-{patient.room}
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Refakatçi Adı Soyadı <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Ad Soyad" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">TC Kimlik <span className="text-red-500">*</span></label>
                <input value={form.tc} onChange={e => upd('tc', e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="TC No" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Telefon</label>
                <input value={form.phone} onChange={e => upd('phone', e.target.value)} placeholder="05XX..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Hasta ile İlişkisi</label>
              <select value={form.relation} onChange={e => upd('relation', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                {['Eşi', 'Annesi', 'Babası', 'Oğlu', 'Kızı', 'Kardeşi', 'Yakını', 'Diğer'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={form.meals} onChange={e => upd('meals', e.target.checked)} className="w-4 h-4 accent-emerald-600" />
              <div>
                <div className="text-sm font-semibold text-slate-800">Yemek Hizmeti</div>
                <div className="text-xs text-slate-500">Refakatçiye hastane yemeği verilsin</div>
              </div>
            </label>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50">İptal</button>
          <button onClick={handleSave} disabled={!form.name || !form.tc} className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm">
            <Save size={14} /> Refakatçi Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Complaint Modal ──────────────────────────────────────
function ComplaintModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Complaint) => void }) {
  const [form, setForm] = useState({ category: 'Bekleme Süresi' as ComplaintCategory, description: '', patientName: '', phone: '', priority: 'Normal' as 'Acil' | 'Normal' | 'Düşük' });
  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 bg-red-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><MessageSquare size={16} className="text-red-500" /> Şikayet / Öneri Bildir</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Adınız</label>
              <input value={form.patientName} onChange={e => upd('patientName', e.target.value)} placeholder="Ad Soyad" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Telefon</label>
              <input value={form.phone} onChange={e => upd('phone', e.target.value)} placeholder="05XX..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
            <select value={form.category} onChange={e => upd('category', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400">
              {['Personel Davranışı', 'Temizlik', 'Bekleme Süresi', 'Yiyecek/İçecek', 'Teknik Arıza', 'Diğer'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Öncelik</label>
            <div className="flex gap-2">
              {(['Acil', 'Normal', 'Düşük'] as const).map(p => (
                <button key={p} onClick={() => upd('priority', p)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${form.priority === p
                    ? p === 'Acil' ? 'bg-red-500 text-white border-red-500' : p === 'Normal' ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-500 text-white border-slate-500'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                >{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Açıklama <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={4} placeholder="Yaşanan sorunu detaylıca açıklayınız..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-400 resize-none" />
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50">İptal</button>
          <button
            onClick={() => { onSave({ id: Date.now(), trackNo: genTrackNo('ŞÖ'), ...form, status: 'Açık', date: '07.04.2026' } as Complaint); onClose(); }}
            disabled={!form.description}
            className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <Save size={14} /> Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lost & Found Modal ───────────────────────────────────
function LostItemModal({ onClose, onSave }: { onClose: () => void; onSave: (l: LostItem) => void }) {
  const [form, setForm] = useState({ type: 'Cüzdan', description: '', location: '', ownerName: '', ownerPhone: '' });
  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 bg-amber-50/50 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Package size={16} className="text-amber-500" /> Kayıp Eşya Kaydı</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Eşya Tipi</label>
              <select value={form.type} onChange={e => upd('type', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400">
                {['Cüzdan', 'Cep Telefonu', 'Çanta', 'Anahtarlık', 'Gözlük', 'Takı', 'Giysi', 'Diğer'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kayıp Yeri</label>
              <input value={form.location} onChange={e => upd('location', e.target.value)} placeholder="Bölüm/kat..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Açıklama</label>
            <textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={2} placeholder="Renk, marka, içindekiler..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Başvuran</label>
              <input value={form.ownerName} onChange={e => upd('ownerName', e.target.value)} placeholder="Ad Soyad" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Telefon</label>
              <input value={form.ownerPhone} onChange={e => upd('ownerPhone', e.target.value)} placeholder="05XX..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold">İptal</button>
          <button
            onClick={() => { onSave({ id: Date.now(), trackNo: genTrackNo('KE'), ...form, date: '07.04.2026', status: 'Aranıyor' } as LostItem); onClose(); }}
            className="px-5 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 flex items-center gap-1.5 shadow-sm"
          >
            <Save size={14} /> Kaydı Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────
type Tab = 'hasta' | 'ziyaretci' | 'refakatci' | 'sikayet' | 'kayip' | 'genel';

export function InformationDesk() {
  const [activeTab, setActiveTab] = useState<Tab>('hasta');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<InPatient | null>(null);
  const [visitorPatient, setVisitorPatient] = useState<InPatient | null>(null);
  const [companionPatient, setCompanionPatient] = useState<InPatient | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [wardFilter, setWardFilter] = useState<string>('Tümü');
  const [statusFilter, setStatusFilter] = useState<string>('Tümü');

  const [visitors, setVisitors] = useState<Visitor[]>(INITIAL_VISITORS);
  const [companions, setCompanions] = useState<Companion[]>(INITIAL_COMPANIONS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [lostItems, setLostItems] = useState<LostItem[]>(INITIAL_LOST);

  const [calledStaff, setCalledStaff] = useState<Set<number>>(new Set());

  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Patient search results
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const l = searchQuery.toLowerCase();
    return INPATIENTS.filter(p =>
      p.name.toLowerCase().includes(l) ||
      p.tc.includes(l) ||
      p.ward.toLowerCase().includes(l) ||
      p.room.includes(l) ||
      p.doctor.toLowerCase().includes(l)
    );
  }, [searchQuery]);

  // Filtered inpatients for table
  const filteredPatients = useMemo(() => {
    return INPATIENTS.filter(p =>
      (wardFilter === 'Tümü' || p.ward === wardFilter) &&
      (statusFilter === 'Tümü' || p.status === statusFilter)
    );
  }, [wardFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => ({
    total: INPATIENTS.length,
    yatiyor: INPATIENTS.filter(p => p.status === 'Yatıyor').length,
    ameliyat: INPATIENTS.filter(p => p.status === 'Ameliyatta').length,
    ybu: INPATIENTS.filter(p => p.status === 'YBÜ').length,
    taburcu: INPATIENTS.filter(p => p.status === 'Taburcu Sürecinde').length,
    activeVisitors: visitors.filter(v => v.active).length,
    activeCompanions: companions.filter(c => c.active).length,
  }), [visitors, companions]);

  const TABS: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'hasta', label: 'Yatan Hasta Sorgulama', icon: Bed, badge: stats.total },
    { id: 'ziyaretci', label: 'Ziyaretçi Yönetimi', icon: Users, badge: stats.activeVisitors },
    { id: 'refakatci', label: 'Refakatçi Yönetimi', icon: UserCheck, badge: stats.activeCompanions },
    { id: 'sikayet', label: 'Şikayet & Öneri', icon: MessageSquare, badge: complaints.filter(c => c.status !== 'Kapatıldı').length },
    { id: 'kayip', label: 'Kayıp Eşya', icon: Package, badge: lostItems.filter(l => l.status === 'Aranıyor').length },
    { id: 'genel', label: 'Genel Bilgiler', icon: Info },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">

      {/* Modals */}
      {selectedPatient && (
        <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)}
          onAddVisitor={p => { setSelectedPatient(null); setVisitorPatient(p); }}
          onAddCompanion={p => { setSelectedPatient(null); setCompanionPatient(p); }} />
      )}
      {visitorPatient && (
        <VisitorModal patient={visitorPatient} onClose={() => setVisitorPatient(null)}
          onSave={v => { setVisitors(prev => [v, ...prev]); setVisitorPatient(null); setActiveTab('ziyaretci'); }} />
      )}
      {companionPatient && (
        <CompanionModal patient={companionPatient} onClose={() => setCompanionPatient(null)}
          onSave={c => { setCompanions(prev => [c, ...prev]); setCompanionPatient(null); setActiveTab('refakatci'); }} />
      )}
      {showComplaintModal && (
        <ComplaintModal onClose={() => setShowComplaintModal(false)}
          onSave={c => setComplaints(prev => [c, ...prev])} />
      )}
      {showLostModal && (
        <LostItemModal onClose={() => setShowLostModal(false)}
          onSave={l => setLostItems(prev => [l, ...prev])} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Danışma Modülü</h2>
          <p className="text-sm text-slate-500">Yatan hasta sorgulama, ziyaretçi & refakatçi yönetimi, şikayet ve genel bilgi.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setShowComplaintModal(true); }} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition-colors">
            <MessageSquare size={15} className="text-red-500" /> Şikayet Bil.
          </button>
          <button onClick={() => { setShowLostModal(true); }} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 shadow-sm transition-colors">
            <Package size={15} className="text-amber-500" /> Kayıp Eşya
          </button>
          <button onClick={() => setVisitorPatient(INPATIENTS[0])} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors">
            <Key size={15} /> Ziyaretçi Kartı
          </button>
        </div>
      </div>

      {/* Global Search */}
      <div ref={searchRef} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative z-20 flex-none">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-blue-500" size={22} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Hasta adı, TC, servis, oda numarası veya hekim ara..."
            className="w-full pl-12 pr-28 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1.5 text-slate-400 hover:text-slate-600 mr-1"><X size={16} /></button>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm">Bul</button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {searchFocused && searchQuery.length >= 2 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-30 mx-4">
            {searchResults.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">Sonuç bulunamadı.</div>
            ) : (
              <>
                <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{searchResults.length} Hasta Bulundu</span>
                  <span className="text-xs text-slate-400">Tümünü görmek için servise göre filtreleyin</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {searchResults.map(p => (
                    <button key={p.id} onClick={() => { setSelectedPatient(p); setSearchFocused(false); setSearchQuery(''); }}
                      className="w-full text-left p-4 hover:bg-blue-50 transition-colors flex items-start gap-4">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mt-0.5 shrink-0"><User size={18} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-800">{p.name}</h4>
                          <span className="text-xs font-mono text-slate-400">{p.tc}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge(p.status)}`}>{p.status}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${wardColors[p.ward] || ''}`}>{p.ward}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={11} /> {p.block} Blok, {p.floor}. Kat — Oda {p.room} / Yatak {p.bed}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{p.doctor}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 mt-2 shrink-0" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 flex-none">
        {[
          { label: 'Toplam Yatan', value: stats.total, color: 'bg-slate-800 text-white', icon: Bed },
          { label: 'Serviste', value: stats.yatiyor, color: 'bg-emerald-50 text-emerald-800 border border-emerald-200', icon: Activity },
          { label: 'Ameliyatta', value: stats.ameliyat, color: 'bg-purple-50 text-purple-800 border border-purple-200', icon: Zap },
          { label: 'YBÜ', value: stats.ybu, color: 'bg-red-50 text-red-800 border border-red-200', icon: AlertTriangle },
          { label: 'Taburcu Süreci', value: stats.taburcu, color: 'bg-amber-50 text-amber-800 border border-amber-200', icon: LogOut },
          { label: 'Aktif Ziyaretçi', value: stats.activeVisitors, color: 'bg-blue-50 text-blue-800 border border-blue-200', icon: Users },
          { label: 'Aktif Refakatçi', value: stats.activeCompanions, color: 'bg-teal-50 text-teal-800 border border-teal-200', icon: UserCheck },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-3 flex items-center gap-3 ${s.color}`}>
            <s.icon size={18} className="shrink-0 opacity-70" />
            <div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-[10px] font-semibold opacity-70 leading-tight">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl flex-none flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <tab.icon size={13} />
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-300 text-slate-600'}`}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-auto">

        {/* ── Tab: Yatan Hasta ── */}
        {activeTab === 'hasta' && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 flex flex-wrap gap-3 items-center">
              <Filter size={16} className="text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Servis:</span>
              <select value={wardFilter} onChange={e => setWardFilter(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Tümü">Tüm Servisler</option>
                {Object.keys(wardColors).map(w => <option key={w}>{w}</option>)}
              </select>
              <span className="text-xs font-semibold text-slate-500">Durum:</span>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
                {['Tümü', 'Yatıyor', 'Ameliyatta', 'YBÜ', 'Taburcu Sürecinde'].map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="text-xs text-slate-400 ml-auto">{filteredPatients.length} hasta listeleniyor</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Hasta</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Servis / Konum</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Sorumlu Hekim</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Yatış Tarihi</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Durum</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Refakatçi</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedPatient(p)}>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{p.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{p.tc} · {p.age} yaş</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${wardColors[p.ward] || 'bg-slate-100 text-slate-700'}`}>{p.ward}</span>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin size={10} /> {p.block} Blok {p.floor}.Kat — Oda <strong className="text-slate-700">{p.room}</strong> / Yatak {p.bed}
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="text-xs font-medium text-slate-700">{p.doctor}</div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="text-xs text-slate-600">{p.admissionDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${statusBadge(p.status)}`}>{p.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        {p.companion ? (
                          <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                            <UserCheck size={12} className="text-emerald-500" /> {p.companion.split(' ')[0]}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <button onClick={() => setSelectedPatient(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detay"><Eye size={14} /></button>
                          {p.status !== 'YBÜ' && (
                            <button onClick={() => setVisitorPatient(p)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Ziyaretçi Kartı"><Key size={14} /></button>
                          )}
                          {!p.companion && p.status !== 'YBÜ' && (
                            <button onClick={() => setCompanionPatient(p)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Refakatçi Ekle"><UserPlus size={14} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Ziyaretçi ── */}
        {activeTab === 'ziyaretci' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Users size={16} className="text-blue-500" /> Bugünkü Ziyaretçi Kayıtları (07.04.2026)</h3>
              <button onClick={() => setVisitorPatient(INPATIENTS[0])} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors">
                <Plus size={15} /> Yeni Ziyaretçi Kaydı
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Kart No</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Ziyaretçi</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Ziyaret Ettiği Hasta</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Giriş</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Çıkış</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Durum</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitors.map(v => {
                    const patient = INPATIENTS.find(p => p.id === v.patientId);
                    return (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-blue-600 font-semibold">{v.cardNo}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{v.visitorName}</div>
                          <div className="text-xs text-slate-400">{v.tc} · {v.relation} · {v.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          {patient ? (
                            <div>
                              <div className="font-medium text-slate-800 text-sm">{patient.name}</div>
                              <div className="text-xs text-slate-500">{patient.block}{patient.floor}-{patient.room} / {patient.ward}</div>
                            </div>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-slate-700">{v.entryTime}</td>
                        <td className="py-3 px-4 font-mono text-sm text-slate-500">{v.exitTime || <span className="text-emerald-600 font-semibold">İçeride</span>}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${v.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {v.active ? 'Aktif' : 'Çıktı'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {v.active && (
                            <button
                              onClick={() => setVisitors(prev => prev.map(x => x.id === v.id ? { ...x, active: false, exitTime: now() } : x))}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors ml-auto"
                            >
                              <LogOut size={12} /> Çıkış
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Refakatçi ── */}
        {activeTab === 'refakatci' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><UserCheck size={16} className="text-emerald-500" /> Aktif Refakatçi Listesi</h3>
              <button onClick={() => setCompanionPatient(INPATIENTS[0])} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-sm transition-colors">
                <UserPlus size={15} /> Yeni Refakatçi Kaydı
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Refakatçi</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">İlişkisi</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Hasta / Oda</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Başlangıç</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Yemek</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Durum</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companions.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{c.name}</div>
                        <div className="text-xs text-slate-400 font-mono">{c.tc} · {c.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-slate-600">{c.relation}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 text-sm">{c.patientName}</div>
                        <div className="text-xs text-slate-500">{c.room}</div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-xs text-slate-600">{c.startDate}</td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${c.meals ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {c.meals ? 'Var' : 'Yok'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${c.active ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {c.active ? 'Aktif' : 'Sonlandı'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {c.active && (
                          <button
                            onClick={() => setCompanions(prev => prev.map(x => x.id === c.id ? { ...x, active: false } : x))}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors ml-auto"
                          >
                            <XCircle size={12} /> Sonlandır
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Şikayet ── */}
        {activeTab === 'sikayet' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><MessageSquare size={16} className="text-red-500" /> Şikayet & Öneri Takip</h3>
              <button onClick={() => setShowComplaintModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 shadow-sm transition-colors">
                <Plus size={15} /> Yeni Şikayet Bildir
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Takip No</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Kategori</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Açıklama</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Başvuran</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Öncelik</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Durum</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-red-600 font-semibold">{c.trackNo}</td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-700">{c.category}</td>
                      <td className="py-3 px-4 text-xs text-slate-600 max-w-[200px] truncate">{c.description}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="text-xs font-medium text-slate-700">{c.patientName}</div>
                        <div className="text-xs text-slate-400">{c.phone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${c.priority === 'Acil' ? 'bg-red-100 text-red-700' : c.priority === 'Normal' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{c.priority}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${c.status === 'Kapatıldı' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : c.status === 'İnceleniyor' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>{c.status}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          {c.status === 'Açık' && (
                            <button onClick={() => setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: 'İnceleniyor' } : x))}
                              className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-semibold hover:bg-blue-100 transition-colors">İncele</button>
                          )}
                          {c.status === 'İnceleniyor' && (
                            <button onClick={() => setComplaints(prev => prev.map(x => x.id === c.id ? { ...x, status: 'Kapatıldı' } : x))}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold hover:bg-emerald-100 transition-colors">Kapat</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Kayıp Eşya ── */}
        {activeTab === 'kayip' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Package size={16} className="text-amber-500" /> Kayıp Eşya Kayıtları</h3>
              <button onClick={() => setShowLostModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 shadow-sm transition-colors">
                <Plus size={15} /> Yeni Kayıp Kaydı
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Takip No</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Eşya</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Kayıp Yeri</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Başvuran</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Tarih</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Durum</th>
                    <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lostItems.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs text-amber-600 font-semibold">{l.trackNo}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{l.type}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[140px]">{l.description}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">{l.location}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="text-xs font-medium text-slate-700">{l.ownerName || 'Bilinmiyor'}</div>
                        <div className="text-xs text-slate-400">{l.ownerPhone || '—'}</div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">{l.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${l.status === 'Teslim Edildi' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : l.status === 'Bulundu' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>{l.status}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1">
                          {l.status === 'Aranıyor' && (
                            <button onClick={() => setLostItems(prev => prev.map(x => x.id === l.id ? { ...x, status: 'Bulundu', foundBy: 'Güvenlik' } : x))}
                              className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-semibold hover:bg-blue-100">Bulundu</button>
                          )}
                          {l.status === 'Bulundu' && (
                            <button onClick={() => setLostItems(prev => prev.map(x => x.id === l.id ? { ...x, status: 'Teslim Edildi' } : x))}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold hover:bg-emerald-100">Teslim Et</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab: Genel Bilgiler ── */}
        {activeTab === 'genel' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Visit Hours */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl border border-blue-400 shadow-sm text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-20 -mr-4 -mt-4"><Clock size={100} /></div>
                <h3 className="font-bold text-lg mb-4 relative z-10 flex items-center gap-2"><Clock size={20} /> Ziyaret Saatleri</h3>
                <div className="space-y-3 relative z-10">
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Gündüz</p>
                    <p className="text-xl font-bold">13:00 - 15:00</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm border border-white/10">
                    <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Akşam</p>
                    <p className="text-xl font-bold">19:00 - 21:00</p>
                  </div>
                  <p className="text-xs text-blue-100 mt-2 bg-blue-800/40 p-2 rounded flex items-start gap-1.5">
                    <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    YBÜ ziyaretleri 14:00–14:30 arası hekim izniyle yapılmaktadır.
                  </p>
                </div>
              </div>

              {/* Phone Book */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                  <Phone className="text-emerald-500" size={20} /> Dahili Numaralar
                </h3>
                <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 text-sm max-h-56">
                  {PHONE_BOOK.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                      <span className="font-medium text-slate-700 text-xs">{item.dept}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-xs">{item.ext}</span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-blue-600"><PhoneCall size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floor Plan */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sm:col-span-2">
                <h3 className="font-bold text-lg mb-4 text-slate-800 flex items-center gap-2">
                  <Navigation className="text-rose-500" size={20} /> Kat Planı & Yerleşim
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {FLOOR_PLAN.map((floor, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-sm">{floor.title}</h4>
                      <div className="mt-1.5 space-y-0.5">
                        {floor.areas.map((a, j) => (
                          <p key={j} className="text-[10px] text-slate-500 flex items-center gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-slate-400 shrink-0" /> {a}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: On Duty */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-amber-50/50 flex justify-between items-center">
                  <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                    <Bell className="text-amber-500" size={18} /> Bugün Nöbetçiler (7 Nisan)
                  </h3>
                  <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded font-semibold">Nöbet: 17:00</span>
                </div>
                <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
                  <CalendarDays className="text-amber-600 shrink-0" size={18} />
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm">İcapçı Hekim & Nöbet Listesi</h4>
                    <p className="text-xs text-amber-700 mt-0.5">Saat 17:00 itibarıyla nöbet devri yapılacaktır.</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="divide-y divide-slate-100">
                    {DUTY_STAFF.map((person, i) => (
                      <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{person.role}</p>
                            <h4 className="font-bold text-slate-800 text-sm truncate">{person.name}</h4>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">Dahili: {person.ext}</p>
                          </div>
                          <button
                            onClick={() => setCalledStaff(prev => new Set([...prev, i]))}
                            className={`p-1.5 rounded-lg transition-colors shrink-0 ${calledStaff.has(i) ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 hover:bg-blue-50'}`}
                            title={calledStaff.has(i) ? 'Çağrı yapıldı' : 'Ara'}
                          >
                            {calledStaff.has(i) ? <CheckCircle2 size={16} /> : <Phone size={14} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visitor Pass Quick Action */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-700 rounded-lg"><Key size={20} className="text-emerald-400" /></div>
                  <div>
                    <h4 className="font-semibold text-sm">Ziyaretçi Kartı Ver</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Refakatçi giriş izni</p>
                  </div>
                </div>
                <button onClick={() => setVisitorPatient(INPATIENTS[0])} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors">İşlem</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
