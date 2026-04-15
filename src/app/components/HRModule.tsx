import React, { useState } from 'react';
import {
  Users, Search, CheckCircle2, Clock, AlertTriangle, X, ChevronRight,
  Award, Calendar, BarChart2, Plus,
  TrendingUp, BookOpen, Shield, Download, RefreshCw, Star,
  CheckSquare, XSquare, Printer, Send
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import { twMerge } from 'tailwind-merge';

interface Staff {
  id: string; name: string; title: string; dept: string; role: string;
  phone: string; email: string; startDate: string; birthDate: string;
  contractType: 'Kadrolu' | 'Sözleşmeli' | '4/B' | 'Taşeron';
  status: 'Aktif' | 'İzinde' | 'Raporlu' | 'Pasif';
  certifications: { name: string; issuer: string; expiry: string; status: 'Geçerli' | 'Yaklaşıyor' | 'Süresi Dolmuş' }[];
  annualLeave: number; usedLeave: number; sickDays: number;
  specialization: string; registryNo: string; tcNo: string;
  sgkNo: string; bankAccount: string; address: string;
  performance: number; // 0-100
  education: string; manager: string;
}

const mockStaff: Staff[] = [
  {
    id: 'P-001', name: 'Uzm. Dr. Ahmet Kılıç', title: 'Uzman Tabip', dept: 'Dahiliye', role: 'Birim Sorumlusu',
    phone: '0532 111 22 33', email: 'ahmet.kilic@medcore.tr', startDate: '01.03.2018', birthDate: '15.04.1979',
    contractType: 'Kadrolu', status: 'Aktif', annualLeave: 26, usedLeave: 5, sickDays: 0, specialization: 'İç Hastalıkları',
    registryNo: 'DR-2018-001', tcNo: '1234•••••56', sgkNo: '4567890123', bankAccount: 'TR12 •••• •••• 3456',
    address: 'Çankaya, Ankara', performance: 92, education: 'İstanbul Üniversitesi Tıp Fakültesi', manager: 'Prof. Dr. Yılmaz',
    certifications: [
      { name: 'İç Hastalıkları Uzmanlık', issuer: 'TTB', expiry: '—', status: 'Geçerli' },
      { name: 'İleri Yaşam Desteği (ALS)', issuer: 'TKD', expiry: '15.09.2026', status: 'Geçerli' },
      { name: 'Radyasyon Güvenliği', issuer: 'TAEK', expiry: '01.02.2027', status: 'Geçerli' },
    ],
  },
  {
    id: 'P-002', name: 'Op. Dr. Sinan Kaya', title: 'Uzman Tabip', dept: 'Genel Cerrahi', role: 'Hekim',
    phone: '0532 222 33 44', email: 'sinan.kaya@medcore.tr', startDate: '15.06.2019', birthDate: '22.07.1982',
    contractType: 'Kadrolu', status: 'Aktif', annualLeave: 26, usedLeave: 8, sickDays: 2, specialization: 'Genel Cerrahi',
    registryNo: 'DR-2019-003', tcNo: '9876•••••32', sgkNo: '8765432109', bankAccount: 'TR98 •••• •••• 7890',
    address: 'Keçiören, Ankara', performance: 88, education: 'Hacettepe Üniversitesi Tıp Fakültesi', manager: 'Uzm. Dr. Kılıç',
    certifications: [
      { name: 'Genel Cerrahi Uzmanlık', issuer: 'TTB', expiry: '—', status: 'Geçerli' },
      { name: 'Laparoskopik Cerrahi', issuer: 'ESGE', expiry: '01.12.2026', status: 'Geçerli' },
      { name: 'ATLS (Travma)', issuer: 'ACS', expiry: '01.06.2025', status: 'Süresi Dolmuş' },
    ],
  },
  {
    id: 'P-003', name: 'Hmş. Fatma Korkmaz', title: 'Hemşire', dept: 'Dahiliye Servisi', role: 'Sorumlu Hemşire',
    phone: '0533 333 44 55', email: 'fatma.korkmaz@medcore.tr', startDate: '01.09.2015', birthDate: '08.03.1988',
    contractType: 'Kadrolu', status: 'Aktif', annualLeave: 20, usedLeave: 12, sickDays: 3, specialization: 'Dahiliye Hemşireliği',
    registryNo: 'HMS-2015-012', tcNo: '2468•••••80', sgkNo: '1234567890', bankAccount: 'TR34 •••• •••• 5678',
    address: 'Mamak, Ankara', performance: 95, education: 'Gazi Üniversitesi Hemşirelik', manager: 'Uzm. Dr. Kılıç',
    certifications: [
      { name: 'Hemşirelik Lisansı', issuer: 'YÖK', expiry: '—', status: 'Geçerli' },
      { name: 'Temel Yaşam Desteği (BLS)', issuer: 'AHA', expiry: '01.05.2026', status: 'Yaklaşıyor' },
      { name: 'İV Tedavi Sertifikası', issuer: 'THD', expiry: '01.08.2027', status: 'Geçerli' },
    ],
  },
  {
    id: 'P-004', name: 'Dr. Hakan Çelik', title: 'Pratisyen Tabip', dept: 'Acil Servis', role: 'Acil Hekimi',
    phone: '0534 444 55 66', email: 'hakan.celik@medcore.tr', startDate: '01.01.2021', birthDate: '14.11.1991',
    contractType: 'Sözleşmeli', status: 'Aktif', annualLeave: 20, usedLeave: 4, sickDays: 1, specialization: 'Acil Tıp',
    registryNo: 'DR-2021-008', tcNo: '3579•••••14', sgkNo: '5678901234', bankAccount: 'TR56 •••• •••• 1234',
    address: 'Etimesgut, Ankara', performance: 84, education: 'Ankara Üniversitesi Tıp Fakültesi', manager: 'Başhekimlik',
    certifications: [
      { name: 'ATLS (Travma)', issuer: 'ACS', expiry: '01.03.2027', status: 'Geçerli' },
      { name: 'İleri Yaşam Desteği (ALS)', issuer: 'TKD', expiry: '15.04.2026', status: 'Yaklaşıyor' },
      { name: 'ACLS', issuer: 'AHA', expiry: '01.11.2026', status: 'Geçerli' },
    ],
  },
  {
    id: 'P-005', name: 'Ecz. Derya Aktaş', title: 'Eczacı', dept: 'Eczane', role: 'Eczane Sorumlusu',
    phone: '0535 555 66 77', email: 'derya.aktas@medcore.tr', startDate: '15.04.2020', birthDate: '30.06.1985',
    contractType: 'Kadrolu', status: 'İzinde', annualLeave: 20, usedLeave: 15, sickDays: 0, specialization: 'Klinik Eczacılık',
    registryNo: 'ECZ-2020-002', tcNo: '1357•••••90', sgkNo: '2345678901', bankAccount: 'TR78 •••• •••• 9012',
    address: 'Çankaya, Ankara', performance: 90, education: 'Hacettepe Üniversitesi Eczacılık', manager: 'Başhekimlik',
    certifications: [
      { name: 'Eczacılık Diploması', issuer: 'YÖK', expiry: '—', status: 'Geçerli' },
      { name: 'Klinik Eczacılık', issuer: 'TEB', expiry: '01.11.2026', status: 'Geçerli' },
      { name: 'İlaç Bilgi Merkezi Sertifikası', issuer: 'TEB', expiry: '01.03.2025', status: 'Süresi Dolmuş' },
    ],
  },
  {
    id: 'P-006', name: 'Biyomed. Müh. Kemal Tunç', title: 'Biyomedikal Müh.', dept: 'Teknik Hizmetler', role: 'Biyomedikal Sorumlusu',
    phone: '0536 666 77 88', email: 'kemal.tunc@medcore.tr', startDate: '01.07.2022', birthDate: '05.09.1990',
    contractType: 'Sözleşmeli', status: 'Aktif', annualLeave: 14, usedLeave: 6, sickDays: 0, specialization: 'Biyomedikal Mühendisliği',
    registryNo: 'BM-2022-001', tcNo: '7531•••••68', sgkNo: '3456789012', bankAccount: 'TR90 •••• •••• 3456',
    address: 'Altındağ, Ankara', performance: 87, education: 'ODTÜ Biyomedikal Mühendisliği', manager: 'Teknik Direktör',
    certifications: [
      { name: 'Biyomedikal Mühendisliği Diploması', issuer: 'YÖK', expiry: '—', status: 'Geçerli' },
      { name: 'CE İşaretleme ve Tıbbi Cihaz', issuer: 'TÜBİTAK', expiry: '01.06.2026', status: 'Yaklaşıyor' },
    ],
  },
  {
    id: 'P-007', name: 'Hmş. Aysel Toprak', title: 'Hemşire', dept: 'Yoğun Bakım', role: 'YBÜ Hemşiresi',
    phone: '0537 777 88 99', email: 'aysel.toprak@medcore.tr', startDate: '01.02.2017', birthDate: '20.01.1990',
    contractType: 'Kadrolu', status: 'Raporlu', annualLeave: 20, usedLeave: 10, sickDays: 8, specialization: 'Yoğun Bakım Hemşireliği',
    registryNo: 'HMS-2017-005', tcNo: '8642•••••24', sgkNo: '4567890123', bankAccount: 'TR12 •••• •••• 7890',
    address: 'Sincan, Ankara', performance: 78, education: 'Gazi Üniversitesi Hemşirelik', manager: 'Hmş. Korkmaz',
    certifications: [
      { name: 'Hemşirelik Lisansı', issuer: 'YÖK', expiry: '—', status: 'Geçerli' },
      { name: 'Yoğun Bakım Hemşireliği', issuer: 'YOBAHED', expiry: '01.09.2027', status: 'Geçerli' },
      { name: 'BLS + ALS', issuer: 'AHA/TKD', expiry: '01.01.2026', status: 'Süresi Dolmuş' },
    ],
  },
  {
    id: 'P-008', name: 'Radyolog Dr. Mert Özdemir', title: 'Uzman Tabip', dept: 'Radyoloji', role: 'Radyoloji Uzmanı',
    phone: '0538 888 99 00', email: 'mert.ozdemir@medcore.tr', startDate: '01.09.2020', birthDate: '11.07.1984',
    contractType: 'Kadrolu', status: 'Aktif', annualLeave: 26, usedLeave: 3, sickDays: 0, specialization: 'Radyoloji',
    registryNo: 'DR-2020-005', tcNo: '9753•••••46', sgkNo: '5678901234', bankAccount: 'TR34 •••• •••• 5678',
    address: 'Gölbaşı, Ankara', performance: 91, education: 'Ankara Üniversitesi Tıp Fakültesi', manager: 'Başhekimlik',
    certifications: [
      { name: 'Radyoloji Uzmanlık', issuer: 'TTB', expiry: '—', status: 'Geçerli' },
      { name: 'TAEK Radyasyon Güvenliği', issuer: 'TAEK', expiry: '15.08.2026', status: 'Geçerli' },
      { name: 'Girişimsel Radyoloji', issuer: 'TÜRKRAD', expiry: '01.04.2027', status: 'Geçerli' },
    ],
  },
  {
    id: 'P-009', name: 'Sağ. Tek. Nilüfer Çetin', title: 'Sağlık Teknikeri', dept: 'Laboratuvar', role: 'Lab Teknikeri',
    phone: '0539 999 00 11', email: 'nilufer.cetin@medcore.tr', startDate: '05.03.2019', birthDate: '25.08.1994',
    contractType: '4/B', status: 'Aktif', annualLeave: 20, usedLeave: 7, sickDays: 2, specialization: 'Tıbbi Laboratuvar',
    registryNo: 'LB-2019-007', tcNo: '1593•••••57', sgkNo: '6789012345', bankAccount: 'TR56 •••• •••• 3456',
    address: 'Yenimahalle, Ankara', performance: 86, education: 'Gazi Meslek Yüksekokulu', manager: 'Lab Müdürü',
    certifications: [
      { name: 'Tıbbi Lab. Teknikerliği', issuer: 'YÖK', expiry: '—', status: 'Geçerli' },
      { name: 'ISO 15189 Kalite', issuer: 'TÜRKAK', expiry: '01.10.2026', status: 'Geçerli' },
    ],
  },
  {
    id: 'P-010', name: 'Psik. Selin Aydın', title: 'Klinisyen Psikolog', dept: 'Psikiyatri', role: 'Klinisyen',
    phone: '0532 000 11 22', email: 'selin.aydin@medcore.tr', startDate: '10.10.2023', birthDate: '03.05.1993',
    contractType: 'Sözleşmeli', status: 'Aktif', annualLeave: 14, usedLeave: 2, sickDays: 0, specialization: 'Klinik Psikoloji',
    registryNo: 'PSK-2023-001', tcNo: '2604•••••68', sgkNo: '7890123456', bankAccount: 'TR78 •••• •••• 9012',
    address: 'Çankaya, Ankara', performance: 89, education: 'Orta Doğu Teknik Üniversitesi', manager: 'Psikiyatri Başkanı',
    certifications: [
      { name: 'Klinik Psikoloji Lisansı', issuer: 'TPA', expiry: '—', status: 'Geçerli' },
      { name: 'EMDR Terapisi', issuer: 'EMDR-TR', expiry: '01.12.2026', status: 'Geçerli' },
    ],
  },
];

interface LeaveRequest {
  id: string; staffId: string; staffName: string; dept: string;
  type: 'Yıllık' | 'Hastalık' | 'Mazeret' | 'Doğum' | 'Ücretsiz';
  startDate: string; endDate: string; days: number;
  reason: string; status: 'Beklemede' | 'Onaylandı' | 'Reddedildi';
  created: string; approvedBy?: string;
}

const initialLeaves: LeaveRequest[] = [
  { id: 'IZ-001', staffId: 'P-001', staffName: 'Uzm. Dr. Ahmet Kılıç', dept: 'Dahiliye', type: 'Yıllık', startDate: '14.04.2026', endDate: '18.04.2026', days: 5, reason: 'Aile tatili', status: 'Beklemede', created: '07.04.2026' },
  { id: 'IZ-002', staffId: 'P-005', staffName: 'Ecz. Derya Aktaş', dept: 'Eczane', type: 'Yıllık', startDate: '07.04.2026', endDate: '18.04.2026', days: 10, reason: 'Yıllık izin', status: 'Onaylandı', created: '01.04.2026', approvedBy: 'Başhekimlik' },
  { id: 'IZ-003', staffId: 'P-007', staffName: 'Hmş. Aysel Toprak', dept: 'Yoğun Bakım', type: 'Hastalık', startDate: '01.04.2026', endDate: '15.04.2026', days: 15, reason: 'Hekim raporu (SGK e-Rapor: 2026-103456)', status: 'Onaylandı', created: '01.04.2026', approvedBy: 'Birim Sorumlusu' },
  { id: 'IZ-004', staffId: 'P-004', staffName: 'Dr. Hakan Çelik', dept: 'Acil Servis', type: 'Mazeret', startDate: '10.04.2026', endDate: '10.04.2026', days: 1, reason: 'Birinci derece yakın doğum', status: 'Beklemede', created: '07.04.2026' },
  { id: 'IZ-005', staffId: 'P-003', staffName: 'Hmş. Fatma Korkmaz', dept: 'Dahiliye', type: 'Yıllık', startDate: '21.04.2026', endDate: '25.04.2026', days: 5, reason: 'Kişisel sebepler', status: 'Beklemede', created: '06.04.2026' },
  { id: 'IZ-006', staffId: 'P-002', staffName: 'Op. Dr. Sinan Kaya', dept: 'Genel Cerrahi', type: 'Yıllık', startDate: '05.05.2026', endDate: '16.05.2026', days: 10, reason: 'Yurt dışı kongre', status: 'Reddedildi', created: '03.04.2026' },
];

interface Training {
  id: string; title: string; provider: string; date: string; duration: string;
  dept: string | 'Tüm Birimler'; mandatory: boolean; enrolled: number; capacity: number;
  type: 'Sertifika' | 'Orientasyon' | 'Teknik' | 'Güvenlik' | 'Yasal';
  status: 'Planlandı' | 'Devam Ediyor' | 'Tamamlandı';
}

const mockTrainings: Training[] = [
  { id: 'T-001', title: 'Temel Yaşam Desteği (BLS) Yenileme', provider: 'Türk Kardiyoloji Derneği', date: '15.04.2026', duration: '8 saat', dept: 'Tüm Birimler', mandatory: true, enrolled: 12, capacity: 20, type: 'Sertifika', status: 'Planlandı' },
  { id: 'T-002', title: 'El Hijyeni Uyum Eğitimi', provider: 'Enfeksiyon Kontrol Komitesi', date: '10.04.2026', duration: '3 saat', dept: 'Tüm Birimler', mandatory: true, enrolled: 45, capacity: 50, type: 'Güvenlik', status: 'Devam Ediyor' },
  { id: 'T-003', title: 'Tıbbi Atık Yönetimi', provider: 'Çevre Müdürlüğü', date: '22.04.2026', duration: '4 saat', dept: 'Tüm Birimler', mandatory: true, enrolled: 8, capacity: 30, type: 'Yasal', status: 'Planlandı' },
  { id: 'T-004', title: 'Laparoskopik Cerrahi İleri Teknikler', provider: 'ESGE Türkiye', date: '05.05.2026', duration: '3 gün', dept: 'Genel Cerrahi', mandatory: false, enrolled: 3, capacity: 5, type: 'Teknik', status: 'Planlandı' },
  { id: 'T-005', title: 'ISO 15189 Lab. Akreditasyon Hazırlık', provider: 'TÜRKAK', date: '12.04.2026', duration: '2 gün', dept: 'Laboratuvar', mandatory: true, enrolled: 5, capacity: 8, type: 'Sertifika', status: 'Planlandı' },
  { id: 'T-006', title: 'KPS/MHRS Sistem Kullanımı', provider: 'Sağlık Bakanlığı', date: '01.04.2026', duration: '4 saat', dept: 'Tüm Birimler', mandatory: true, enrolled: 50, capacity: 50, type: 'Teknik', status: 'Tamamlandı' },
  { id: 'T-007', title: 'Hasta Güvenliği Kültürü', provider: 'Kalite ve Akreditasyon Birimi', date: '18.04.2026', duration: '5 saat', dept: 'Tüm Birimler', mandatory: true, enrolled: 30, capacity: 50, type: 'Güvenlik', status: 'Planlandı' },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', pink: 'bg-pink-50 text-pink-700 border-pink-100',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-5xl' };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[92vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200 flex-none">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

const statusColor = (s: string) => s === 'Aktif' ? 'green' : s === 'İzinde' ? 'blue' : s === 'Raporlu' ? 'amber' : 'slate';
const certColor = (s: string) => s === 'Geçerli' ? 'green' : s === 'Yaklaşıyor' ? 'amber' : 'red';
const contractColor = (c: string) => c === 'Kadrolu' ? 'blue' : c === 'Sözleşmeli' ? 'purple' : c === '4/B' ? 'cyan' : 'slate';

const tabs = [
  { id: 'personel', label: 'Personel Sicili', icon: Users },
  { id: 'izin', label: 'İzin Yönetimi', icon: Calendar },
  { id: 'egitim', label: 'Eğitim & Sertifika', icon: BookOpen },
  { id: 'performans', label: 'Performans', icon: TrendingUp },
];

export function HRModule() {
  const [activeTab, setActiveTab] = useState<'personel' | 'izin' | 'egitim' | 'performans'>('personel');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [detailTab, setDetailTab] = useState<'ozluk' | 'izinler' | 'sertifikalar' | 'gecmis'>('ozluk');
  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState('Tümü');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [leaves, setLeaves] = useState(initialLeaves);
  const [showNewLeave, setShowNewLeave] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [kpsLoading, setKpsLoading] = useState(false);
  const [kpsResult, setKpsResult] = useState<string | null>(null);

  const depts = ['Tümü', ...Array.from(new Set(mockStaff.map(s => s.dept)))];
  const filtered = mockStaff.filter(s => {
    if (deptFilter !== 'Tümü' && s.dept !== deptFilter) return false;
    if (statusFilter !== 'Tümü' && s.status !== statusFilter) return false;
    if (searchText && !s.name.toLowerCase().includes(searchText.toLowerCase()) && !s.dept.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const expiringCerts = mockStaff.reduce((n, p) => n + p.certifications.filter(c => c.status !== 'Geçerli').length, 0);
  const pendingLeaves = leaves.filter(l => l.status === 'Beklemede').length;

  const handleLeaveAction = (id: string, action: 'Onaylandı' | 'Reddedildi') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action, approvedBy: 'İK Yöneticisi' } : l));
  };

  const handleKpsQuery = () => {
    setKpsLoading(true);
    setKpsResult(null);
    setTimeout(() => {
      setKpsLoading(false);
      setKpsResult(`KPS sorgusu tamamlandı. TC kimlik doğrulandı. Nüfus kaydı güncel. MERNİS adres bilgileri eşleşiyor. Son güncelleme: 07.04.2026 12:00`);
    }, 1500);
  };

  const performanceData = mockStaff.slice(0, 8).map(s => ({ name: s.name.split(' ').slice(-1)[0], score: s.performance, dept: s.dept }));

  return (
    <div className="space-y-5 max-w-[1700px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">İnsan Kaynakları / Personel Yönetimi</h2>
          <p className="text-sm text-slate-500">Personel sicili · Özlük yönetimi · İzin iş akışı · Eğitim planı · Performans değerlendirme</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {pendingLeaves > 0 && <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg"><Calendar size={14} /> {pendingLeaves} İzin Bekliyor</span>}
          {expiringCerts > 0 && <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg"><AlertTriangle size={14} /> {expiringCerts} Sertifika Uyarısı</span>}
          <button onClick={() => setShowAddStaff(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"><Plus size={14} /> Personel Ekle</button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50"><Download size={14} /> Excel</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-none">
        {[
          { label: 'Toplam Personel', value: mockStaff.length, color: 'blue', icon: Users },
          { label: 'Aktif', value: mockStaff.filter(s => s.status === 'Aktif').length, color: 'emerald', icon: CheckCircle2 },
          { label: 'İzin / Rapor', value: mockStaff.filter(s => s.status !== 'Aktif' && s.status !== 'Pasif').length, color: 'amber', icon: Clock },
          { label: 'Sertifika Uyarısı', value: expiringCerts, color: expiringCerts > 0 ? 'red' : 'slate', icon: AlertTriangle },
          { label: 'Bekleyen İzin', value: pendingLeaves, color: pendingLeaves > 0 ? 'amber' : 'slate', icon: Calendar },
        ].map(kpi => (
          <div key={kpi.label} className={`bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm`}>
            <div className={`w-9 h-9 rounded-lg bg-${kpi.color}-100 flex items-center justify-center flex-shrink-0`}>
              <kpi.icon size={18} className={`text-${kpi.color}-600`} />
            </div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase leading-tight">{kpi.label}</p><p className="text-xl font-black text-slate-800">{kpi.value}</p></div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl flex-none">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={twMerge('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center',
              activeTab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
            <t.icon size={14} />{t.label}
            {t.id === 'izin' && pendingLeaves > 0 && <span className="bg-amber-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">{pendingLeaves}</span>}
            {t.id === 'egitim' && expiringCerts > 0 && <span className="bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">{expiringCerts}</span>}
          </button>
        ))}
      </div>

      {/* Tab: Personel Sicili */}
      {activeTab === 'personel' && (
        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap items-center flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-2 text-slate-400" size={15} />
              <input type="text" placeholder="Personel adı veya birim ara..." value={searchText} onChange={e => setSearchText(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-400 w-56" />
            </div>
            <div className="flex gap-1">
              {['Tümü', 'Aktif', 'İzinde', 'Raporlu'].map(f => (
                <button key={f} onClick={() => setStatusFilter(f)} className={twMerge('px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border', statusFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50')}>{f}</button>
              ))}
            </div>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-400">
              {depts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* Staff List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filtered.map(s => (
              <div key={s.id} onClick={() => { setSelectedStaff(s); setDetailTab('ozluk'); }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={twMerge('w-12 h-12 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 border-2 shadow-sm',
                      s.status === 'Aktif' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white border-blue-200' :
                      s.status === 'İzinde' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-emerald-200' :
                      s.status === 'Raporlu' ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-200' :
                      'bg-slate-200 text-slate-500 border-slate-300')}>
                      {s.name.split(' ').filter(n => n.length > 1).slice(-2).map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-bold text-slate-800">{s.name}</span>
                        <Badge color={statusColor(s.status)}>{s.status}</Badge>
                        <Badge color={contractColor(s.contractType)}>{s.contractType}</Badge>
                        {s.certifications.some(c => c.status === 'Süresi Dolmuş') && <Badge color="red">Sertifika Süresi Dolmuş!</Badge>}
                        {s.certifications.some(c => c.status === 'Yaklaşıyor') && <Badge color="amber">Sertifika Yenileme</Badge>}
                      </div>
                      <p className="text-xs text-slate-500">{s.title} • {s.dept} • {s.role}</p>
                      <p className="text-[10px] text-slate-400">Sicil: {s.registryNo} • Başlangıç: {s.startDate} • Uzm: {s.specialization || 'Genel'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-slate-400 mb-1">Yıllık İzin</p>
                      <div className="w-24 bg-slate-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min((s.usedLeave / s.annualLeave) * 100, 100)}%` }}></div>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{s.usedLeave}/{s.annualLeave} gün</p>
                    </div>
                    <div className="text-right hidden lg:block">
                      <p className="text-[10px] text-slate-400 mb-1">Performans</p>
                      <div className="flex items-center gap-1">
                        <Star size={12} className={s.performance >= 90 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                        <span className="text-sm font-black text-slate-800">{s.performance}</span>
                        <span className="text-[10px] text-slate-400">/100</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: İzin Yönetimi */}
      {activeTab === 'izin' && (
        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          <div className="flex items-center justify-between flex-none">
            <div className="flex gap-2">
              {[
                { label: 'Tüm Talepler', count: leaves.length, color: 'slate' },
                { label: 'Beklemede', count: leaves.filter(l => l.status === 'Beklemede').length, color: 'amber' },
                { label: 'Onaylandı', count: leaves.filter(l => l.status === 'Onaylandı').length, color: 'green' },
              ].map(s => (
                <div key={s.label} className={`bg-white rounded-xl border border-slate-200 px-4 py-2 text-center shadow-sm`}>
                  <p className="text-lg font-black text-slate-800">{s.count}</p>
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowNewLeave(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"><Plus size={14} /> Yeni İzin Talebi</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {leaves.map(lv => (
              <div key={lv.id} className={twMerge('bg-white rounded-xl border p-4 shadow-sm', lv.status === 'Beklemede' ? 'border-amber-200' : lv.status === 'Onaylandı' ? 'border-emerald-200' : 'border-red-200')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{lv.id}</span>
                      <Badge color={lv.status === 'Beklemede' ? 'amber' : lv.status === 'Onaylandı' ? 'green' : 'red'}>{lv.status}</Badge>
                      <Badge color={lv.type === 'Yıllık' ? 'blue' : lv.type === 'Hastalık' ? 'red' : lv.type === 'Mazeret' ? 'amber' : 'purple'}>{lv.type} İzin</Badge>
                      <span className="text-[10px] text-slate-400">Talep: {lv.created}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{lv.staffName}</p>
                        <p className="text-xs text-slate-500">{lv.dept}</p>
                      </div>
                      <div className="text-xs">
                        <p className="text-slate-500">Başlangıç: <strong>{lv.startDate}</strong></p>
                        <p className="text-slate-500">Bitiş: <strong>{lv.endDate}</strong></p>
                      </div>
                      <div className="bg-slate-100 rounded-lg px-3 py-2 text-center">
                        <p className="text-xl font-black text-slate-800">{lv.days}</p>
                        <p className="text-[10px] text-slate-500">gün</p>
                      </div>
                    </div>
                    {lv.reason && <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 rounded-lg p-2 border border-slate-100">"{lv.reason}"</p>}
                    {lv.approvedBy && <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle2 size={11} /> Onaylayan: {lv.approvedBy}</p>}
                  </div>
                  {lv.status === 'Beklemede' && (
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={() => handleLeaveAction(lv.id, 'Onaylandı')} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"><CheckSquare size={13} /> Onayla</button>
                      <button onClick={() => handleLeaveAction(lv.id, 'Reddedildi')} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 border border-red-200"><XSquare size={13} /> Reddet</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Eğitim & Sertifika */}
      {activeTab === 'egitim' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Expiring Certs Alert */}
          {expiringCerts > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex-none">
              <h4 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Sertifika Uyarıları ({expiringCerts} adet)</h4>
              <div className="space-y-1.5">
                {mockStaff.flatMap(s => s.certifications.filter(c => c.status !== 'Geçerli').map(c => ({ staff: s.name, dept: s.dept, ...c }))).map((c, i) => (
                  <div key={i} className={twMerge('flex items-center gap-3 text-xs p-2 rounded-lg', c.status === 'Süresi Dolmuş' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800')}>
                    <AlertTriangle size={12} className="flex-shrink-0" />
                    <span className="font-bold">{c.staff}</span>
                    <span>—</span>
                    <span>{c.name}</span>
                    <span className="text-slate-500">({c.dept})</span>
                    <Badge color={c.status === 'Süresi Dolmuş' ? 'red' : 'amber'}>{c.status} {c.expiry !== '—' ? `• ${c.expiry}` : ''}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Training List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><BookOpen size={16} className="text-blue-500" /> Eğitim Planı — Nisan/Mayıs 2026</h4>
            <div className="space-y-2">
              {mockTrainings.map(t => (
                <div key={t.id} className={twMerge('flex items-center gap-4 p-3 rounded-xl border text-xs',
                  t.status === 'Tamamlandı' ? 'bg-emerald-50 border-emerald-200' : t.status === 'Devam Ediyor' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200')}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-slate-800">{t.title}</span>
                      {t.mandatory && <Badge color="red">Zorunlu</Badge>}
                      <Badge color={t.type === 'Sertifika' ? 'blue' : t.type === 'Güvenlik' ? 'amber' : t.type === 'Yasal' ? 'red' : t.type === 'Teknik' ? 'purple' : 'slate'}>{t.type}</Badge>
                      <Badge color={t.status === 'Tamamlandı' ? 'green' : t.status === 'Devam Ediyor' ? 'blue' : 'slate'}>{t.status}</Badge>
                    </div>
                    <p className="text-slate-500">{t.provider} • {t.date} • {t.duration} • {t.dept}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="w-24 bg-slate-200 rounded-full h-1.5 mb-1">
                      <div className={twMerge('h-1.5 rounded-full', t.status === 'Tamamlandı' ? 'bg-emerald-500' : 'bg-blue-500')}
                        style={{ width: `${(t.enrolled / t.capacity) * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] text-slate-500">{t.enrolled}/{t.capacity} katılımcı</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Performans */}
      {activeTab === 'performans' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Personel Performans Skorları (Yıllık Değerlendirme)</h4>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={performanceData} layout="vertical" margin={{ left: 65 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={65} />
                  <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v: any) => [`${v}/100`, 'Performans']} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {performanceData.map((d, i) => (
                      <Cell key={`perf-cell-${i}`} fill={d.score >= 90 ? '#10b981' : d.score >= 80 ? '#3b82f6' : d.score >= 70 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Performans Değerlendirme Kartları</h4>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {mockStaff.slice(0, 8).map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-black flex-shrink-0">
                      {s.name.split(' ').filter(n => n.length > 1).slice(-2).map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.dept}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5">
                        <div className={twMerge('h-1.5 rounded-full', s.performance >= 90 ? 'bg-emerald-500' : s.performance >= 80 ? 'bg-blue-500' : s.performance >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                          style={{ width: `${s.performance}%` }}></div>
                      </div>
                      <span className={twMerge('text-xs font-black', s.performance >= 90 ? 'text-emerald-600' : s.performance >= 80 ? 'text-blue-600' : s.performance >= 70 ? 'text-amber-600' : 'text-red-600')}>{s.performance}</span>
                    </div>
                    <Badge color={s.performance >= 90 ? 'green' : s.performance >= 80 ? 'blue' : s.performance >= 70 ? 'amber' : 'red'}>
                      {s.performance >= 90 ? 'Mükemmel' : s.performance >= 80 ? 'İyi' : s.performance >= 70 ? 'Orta' : 'Gelişmeli'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPI breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Birim Performans Değerlendirme Kriterleri</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'Klinik Yetkinlik', weight: '%30', desc: 'Tıbbi bilgi, beceri, protokol uyumu' },
                { label: 'Hasta Memnuniyeti', weight: '%25', desc: 'Anket sonuçları, şikayet oranı' },
                { label: 'Çalışma Disiplini', weight: '%20', desc: 'Devamlılık, nöbet uyumu, raporlar' },
                { label: 'Eğitim & Gelişim', weight: '%15', desc: 'Sertifika, kongre, yayın' },
                { label: 'Ekip Çalışması', weight: '%10', desc: 'İletişim, liderlik, iş birliği' },
              ].map(k => (
                <div key={k.label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700">{k.label}</span>
                    <Badge color="blue">{k.weight}</Badge>
                  </div>
                  <p className="text-slate-400 text-[10px]">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Staff Detail Modal */}
      <Modal open={!!selectedStaff} onClose={() => setSelectedStaff(null)} title={`Personel Dosyası — ${selectedStaff?.name || ''}`} size="xl">
        {selectedStaff && (
          <div className="space-y-4">
            {/* Profile header */}
            <div className="flex items-start gap-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
                {selectedStaff.name.split(' ').filter(n => n.length > 1).slice(-2).map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-800">{selectedStaff.name}</h3>
                <p className="text-sm text-slate-600">{selectedStaff.title} • {selectedStaff.role}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge color={statusColor(selectedStaff.status)}>{selectedStaff.status}</Badge>
                  <Badge color={contractColor(selectedStaff.contractType)}>{selectedStaff.contractType}</Badge>
                  <Badge color="slate">{selectedStaff.dept}</Badge>
                  <span className="text-[10px] text-slate-400">Sicil: {selectedStaff.registryNo}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={handleKpsQuery} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                  {kpsLoading ? <RefreshCw size={13} className="animate-spin" /> : <Shield size={13} />} KPS Sorgula
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50"><Printer size={13} /> Özlük Belgesi</button>
              </div>
            </div>

            {kpsResult && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" /> {kpsResult}
              </div>
            )}

            {/* Detail tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {[{id:'ozluk',label:'Özlük Bilgileri'},{id:'izinler',label:'İzin Kayıtları'},{id:'sertifikalar',label:'Sertifikalar'},{id:'gecmis',label:'İş Geçmişi'}].map(t => (
                <button key={t.id} onClick={() => setDetailTab(t.id as any)}
                  className={twMerge('flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all', detailTab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>{t.label}</button>
              ))}
            </div>

            {detailTab === 'ozluk' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[
                  { label: 'TC Kimlik No', value: selectedStaff.tcNo },
                  { label: 'Doğum Tarihi', value: selectedStaff.birthDate },
                  { label: 'SGK Sicil No', value: selectedStaff.sgkNo },
                  { label: 'İşe Başlama', value: selectedStaff.startDate },
                  { label: 'Sözleşme Türü', value: selectedStaff.contractType },
                  { label: 'Uzmanlık Alanı', value: selectedStaff.specialization || 'Genel Pratisyen' },
                  { label: 'Eğitim', value: selectedStaff.education },
                  { label: 'Bağlı Olduğu Yönetici', value: selectedStaff.manager },
                  { label: 'Telefon', value: selectedStaff.phone },
                  { label: 'E-posta', value: selectedStaff.email },
                  { label: 'Adres', value: selectedStaff.address },
                  { label: 'IBAN (Maskeli)', value: selectedStaff.bankAccount },
                ].map(f => (
                  <div key={f.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400 mb-0.5">{f.label}</p>
                    <p className="font-bold text-slate-800">{f.value}</p>
                  </div>
                ))}
              </div>
            )}

            {detailTab === 'izinler' && (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center"><p className="text-xl font-black text-blue-700">{selectedStaff.annualLeave - selectedStaff.usedLeave}</p><p className="text-[10px] text-blue-500">Kalan Yıllık İzin (gün)</p></div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center"><p className="text-xl font-black text-amber-700">{selectedStaff.usedLeave}</p><p className="text-[10px] text-amber-500">Kullanılan İzin (gün)</p></div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center"><p className="text-xl font-black text-red-700">{selectedStaff.sickDays}</p><p className="text-[10px] text-red-500">Rapor Günü</p></div>
                </div>
                {leaves.filter(l => l.staffId === selectedStaff.id).map(lv => (
                  <div key={lv.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 text-xs bg-slate-50">
                    <Badge color={lv.status === 'Onaylandı' ? 'green' : lv.status === 'Beklemede' ? 'amber' : 'red'}>{lv.status}</Badge>
                    <span className="font-bold">{lv.type} İzin</span>
                    <span className="text-slate-500">{lv.startDate} — {lv.endDate}</span>
                    <span className="font-bold">{lv.days} gün</span>
                    <span className="text-slate-400 flex-1 italic truncate">"{lv.reason}"</span>
                  </div>
                ))}
                {leaves.filter(l => l.staffId === selectedStaff.id).length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">Bu personel için izin kaydı bulunmuyor.</p>
                )}
              </div>
            )}

            {detailTab === 'sertifikalar' && (
              <div className="space-y-2">
                {selectedStaff.certifications.map((cert, i) => (
                  <div key={i} className={twMerge('flex items-center justify-between p-3 rounded-xl border text-xs',
                    cert.status === 'Geçerli' ? 'bg-white border-slate-200' : cert.status === 'Yaklaşıyor' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200')}>
                    <div className="flex items-center gap-3">
                      <Award size={16} className={cert.status === 'Geçerli' ? 'text-blue-500' : cert.status === 'Yaklaşıyor' ? 'text-amber-500' : 'text-red-500'} />
                      <div>
                        <p className="font-bold text-slate-800">{cert.name}</p>
                        <p className="text-slate-500">Veren: {cert.issuer} • Bitiş: {cert.expiry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge color={certColor(cert.status)}>{cert.status}</Badge>
                      {cert.status !== 'Geçerli' && <button className="text-[10px] px-2 py-1 bg-blue-600 text-white rounded-lg font-bold">Yenile</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {detailTab === 'gecmis' && (
              <div className="space-y-2">
                {[
                  { date: selectedStaff.startDate, event: `${selectedStaff.dept} birimine ${selectedStaff.contractType} olarak atandı`, type: 'atama' },
                  { date: '01.01.2024', event: 'Yıllık performans değerlendirmesi tamamlandı — Puan: ' + selectedStaff.performance + '/100', type: 'performans' },
                  { date: '15.06.2023', event: 'Görev yeri değişikliği: ' + selectedStaff.dept, type: 'gorev' },
                  { date: '01.03.2023', event: 'Sertifika yenileme hatırlatması gönderildi', type: 'bildirim' },
                ].map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                    <div className={twMerge('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', h.type === 'atama' ? 'bg-blue-500' : h.type === 'performans' ? 'bg-emerald-500' : h.type === 'gorev' ? 'bg-amber-500' : 'bg-slate-400')}></div>
                    <div>
                      <p className="font-bold text-slate-800">{h.event}</p>
                      <p className="text-slate-400 mt-0.5">{h.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Add Staff Modal */}
      <Modal open={showAddStaff} onClose={() => setShowAddStaff(false)} title="Yeni Personel Kayıt" size="lg">
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { label: 'Ad Soyad', placeholder: 'Uzm. Dr. Ali Yılmaz', type: 'text' },
            { label: 'TC Kimlik No', placeholder: '12345678901', type: 'text' },
            { label: 'Birim / Departman', placeholder: 'Dahiliye', type: 'text' },
            { label: 'Ünvan / Görev', placeholder: 'Uzman Tabip', type: 'text' },
            { label: 'Telefon', placeholder: '0532 000 00 00', type: 'tel' },
            { label: 'E-posta', placeholder: 'ali.yilmaz@medcore.tr', type: 'email' },
            { label: 'İşe Başlama Tarihi', placeholder: '01.04.2026', type: 'text' },
            { label: 'SGK Sicil No', placeholder: 'Oto-oluşturulacak', type: 'text' },
          ].map(f => (
            <div key={f.label}>
              <label className="font-semibold text-slate-600 block mb-1">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          ))}
          <div><label className="font-semibold text-slate-600 block mb-1">Sözleşme Türü</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400">
              <option>Kadrolu</option><option>Sözleşmeli</option><option>4/B</option><option>Taşeron</option>
            </select></div>
          <div><label className="font-semibold text-slate-600 block mb-1">KPS / MERNİS Sorgulama</label>
            <button className="w-full border border-blue-300 rounded-lg px-3 py-2 bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 flex items-center justify-center gap-2">
              <Shield size={14} /> TC ile KPS Sorgusu Yap
            </button></div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => setShowAddStaff(false)} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">SGK Giriş Bildir & Kaydet</button>
          <button onClick={() => setShowAddStaff(false)} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold">İptal</button>
        </div>
      </Modal>

      {/* New Leave Modal */}
      <Modal open={showNewLeave} onClose={() => setShowNewLeave(false)} title="Yeni İzin Talebi" size="sm">
        <div className="space-y-3 text-xs">
          <div><label className="font-semibold text-slate-600 block mb-1">Personel</label>
            <select className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400">
              {mockStaff.map(s => <option key={s.id}>{s.name} ({s.dept})</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="font-semibold text-slate-600 block mb-1">İzin Türü</label>
              <select className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400">
                <option>Yıllık</option><option>Hastalık</option><option>Mazeret</option><option>Doğum</option><option>Ücretsiz</option>
              </select></div>
            <div><label className="font-semibold text-slate-600 block mb-1">Başlangıç Tarihi</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" /></div>
          </div>
          <div><label className="font-semibold text-slate-600 block mb-1">Bitiş Tarihi</label>
            <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" /></div>
          <div><label className="font-semibold text-slate-600 block mb-1">Açıklama / Gerekçe</label>
            <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 resize-none" placeholder="İzin gerekçesini giriniz..." /></div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setShowNewLeave(false)} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Send size={14} className="inline mr-1" />Talebi Gönder</button>
            <button onClick={() => setShowNewLeave(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold">İptal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
