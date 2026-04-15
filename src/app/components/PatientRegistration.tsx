import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  UserPlus, Search, ShieldCheck, Fingerprint,
  Phone, MapPin, FileText, Activity, AlertTriangle,
  ScanFace, ChevronRight, ChevronLeft, Check, Printer,
  CreditCard, Calendar, Clipboard,
  User, Heart, Stethoscope, Bed, Clock, Info,
  BadgeCheck, Eye, Download, QrCode,
  CheckCircle2, AlertCircle, Loader2, Ban,
  BriefcaseMedical, Hash, PhoneCall, Mail, Home, Globe,
  UserCheck, Shield, FileCheck, Siren, ArrowRight, Zap
} from 'lucide-react';
import { getModulePath } from '../moduleRegistry';
import { usePatientContext } from '../patientContext';

// ───────── Types ─────────
interface PatientData {
  tc: string;
  ad: string;
  soyad: string;
  dogumTarihi: string;
  yas: number;
  cinsiyet: string;
  babaAdi: string;
  anneAdi: string;
  uyruk: string;
  kanGrubu: string;
  medeniHal: string;
  dogumYeri: string;
  // contact
  cepTel: string;
  evTel: string;
  eposta: string;
  adres: string;
  ilce: string;
  il: string;
  postaKodu: string;
  // emergency
  yakinAdi: string;
  yakinTel: string;
  yakinYakinlik: string;
  // medical
  kronikHastalik: string[];
  alerji: string;
  engellilik: string;
  organBagisi: boolean;
  // insurance
  kurumTipi: string;
  sigortaSirketi: string;
  poliçeNo: string;
  sgkTescilNo: string;
  // admission
  gelisSekli: string;
  kabulTuru: string;
  bolum: string;
  hekim: string;
  randevuNo: string;
  sikayet: string;
  oncelik: string;
  // bed
  servis: string;
  oda: string;
  yatak: string;
}

type WizardStep = 0 | 1 | 2 | 3 | 4;
type KPSStatus = 'idle' | 'loading' | 'success' | 'error';
type MEDULAStatus = 'idle' | 'loading' | 'success' | 'error' | 'noRecord';

const STEPS = [
  { label: 'Kimlik Doğrulama', icon: Fingerprint },
  { label: 'Kişisel & İletişim', icon: User },
  { label: 'Sigorta & Kurum', icon: Shield },
  { label: 'Kabul & Yönlendirme', icon: Stethoscope },
  { label: 'Onay & Fiş', icon: FileCheck },
];

const MOCK_PATIENTS: Record<string, Partial<PatientData>> = {
  '12345678901': {
    ad: 'Ayşe', soyad: 'Yılmaz', dogumTarihi: '12.04.1985', yas: 40,
    cinsiyet: 'Kadın', babaAdi: 'Mehmet', anneAdi: 'Fatma',
    uyruk: 'T.C.', dogumYeri: 'İstanbul', medeniHal: 'Evli',
    cepTel: '5551234567', eposta: 'ayse.yilmaz@email.com',
    adres: 'Atatürk Mah. Cumhuriyet Cad. No:42 D:5', ilce: 'Kadıköy', il: 'İstanbul', postaKodu: '34710',
    yakinAdi: 'Ahmet Yılmaz', yakinTel: '5559876543', yakinYakinlik: 'Eş',
    kronikHastalik: ['Hipertansiyon', 'Tip 2 Diyabet'],
    alerji: 'Penisilin', engellilik: 'Yok', organBagisi: true,
    sgkTescilNo: 'SGK-2024-00142387',
  },
  '98765432109': {
    ad: 'Mehmet', soyad: 'Demir', dogumTarihi: '05.09.1972', yas: 53,
    cinsiyet: 'Erkek', babaAdi: 'İbrahim', anneAdi: 'Hatice',
    uyruk: 'T.C.', dogumYeri: 'Ankara', medeniHal: 'Evli',
    cepTel: '5329876543', eposta: 'mehmet.demir@mail.com',
    adres: 'Çankaya Mah. Atatürk Bulvarı No:12 D:3', ilce: 'Çankaya', il: 'Ankara', postaKodu: '06430',
    yakinAdi: 'Zeynep Demir', yakinTel: '5321234567', yakinYakinlik: 'Eş',
    kronikHastalik: ['Koroner Arter Hastalığı'],
    alerji: 'Aspirin', engellilik: 'Yok', organBagisi: false,
    sgkTescilNo: 'SGK-2024-00089214',
  },
};

const BOLUMLER: Record<string, string[]> = {
  'İç Hastalıkları (Dahiliye)': ['Prof. Dr. Kemal Arslan', 'Doç. Dr. Selin Çetin', 'Uzm. Dr. Tarık Yıldız'],
  'Kardiyoloji': ['Prof. Dr. Ahmet Kaya', 'Uzm. Dr. Burcu Şahin', 'Uzm. Dr. Murat Öz'],
  'Ortopedi ve Travmatoloji': ['Prof. Dr. Serkan Güler', 'Uzm. Dr. Leyla Ateş'],
  'Göz Hastalıkları': ['Doç. Dr. Neslihan Korkmaz', 'Uzm. Dr. Emre Doğan'],
  'Kulak Burun Boğaz': ['Uzm. Dr. Canan Yılmaz', 'Uzm. Dr. Hakan Şimşek'],
  'Nöroloji': ['Prof. Dr. İbrahim Tekin', 'Uzm. Dr. Aylin Erdoğan'],
  'Genel Cerrahi': ['Prof. Dr. Mustafa Avcı', 'Uzm. Dr. Deniz Karaca'],
  'Kadın Hastalıkları ve Doğum': ['Prof. Dr. Gülşen Polat', 'Uzm. Dr. Merve Yüksel'],
  'Çocuk Sağlığı ve Hastalıkları': ['Prof. Dr. Can Özdemir', 'Uzm. Dr. Elif Tan'],
  'Psikiyatri': ['Doç. Dr. Süleyman Kılıç', 'Uzm. Dr. Pınar Aksoy'],
  'Üroloji': ['Prof. Dr. Haluk Çelikbaş', 'Uzm. Dr. Cem Yalçın'],
  'Dermatoloji': ['Doç. Dr. Eda Sönmez', 'Uzm. Dr. Barış Koç'],
  'Acil Tıp': ['Uzm. Dr. Sinan Bozkurt', 'Uzm. Dr. Funda Kara', 'Uzm. Dr. Okan Çınar'],
};

const SERVISLER = [
  { ad: 'Dahiliye Servisi (3. Kat)', odalar: ['301', '302', '303', '304', '305'] },
  { ad: 'Kardiyoloji Servisi (4. Kat)', odalar: ['401', '402', '403'] },
  { ad: 'Cerrahi Servis (5. Kat)', odalar: ['501', '502', '503', '504'] },
  { ad: 'Yoğun Bakım Ünitesi', odalar: ['YBÜ-1', 'YBÜ-2'] },
  { ad: 'Günübirlik Servis (2. Kat)', odalar: ['G01', 'G02', 'G03'] },
];

const RECENT_PATIENTS = [
  { id: 'P24-0142', ad: 'Mehmet Demir', tc: '123***789', bolum: 'Kardiyoloji', saat: '10:45', tip: 'SGK', durum: 'Tamamlandı', protokol: 'PRO-2024-08812' },
  { id: 'P24-0141', ad: 'Fatma Şahin', tc: '456***123', bolum: 'Dahiliye', saat: '10:32', tip: 'ÖSS', durum: 'Tamamlandı', protokol: 'PRO-2024-08811' },
  { id: 'P24-0140', ad: 'Ali Yılmaz', tc: '789***456', bolum: 'Göz', saat: '10:15', tip: 'Ücretli', durum: 'Vezne Bekliyor', protokol: 'PRO-2024-08810' },
  { id: 'P24-0139', ad: 'Zeynep Kaya', tc: '321***654', bolum: 'Ortopedi', saat: '09:50', tip: 'SGK', durum: 'Tamamlandı', protokol: 'PRO-2024-08809' },
  { id: 'P24-0138', ad: 'Hasan Çelik', tc: '654***321', bolum: 'Acil', saat: '09:40', tip: 'SGK', durum: 'Tedavide', protokol: 'PRO-2024-08808' },
  { id: 'P24-0137', ad: 'Ayşe Yıldız', tc: '987***123', bolum: 'KBB', saat: '09:15', tip: 'TSS', durum: 'Tamamlandı', protokol: 'PRO-2024-08807' },
  { id: 'P24-0136', ad: 'Kadir Öztürk', tc: '147***369', bolum: 'Nöroloji', saat: '08:55', tip: 'SGK', durum: 'Tamamlandı', protokol: 'PRO-2024-08806' },
];

// ───────── Helpers ─────────
function genProtokol() {
  return `PRO-2025-${String(Math.floor(8813 + Math.random() * 100)).padStart(5, '0')}`;
}
function genHastaId() {
  return `P25-0${Math.floor(143 + Math.random() * 10)}`;
}

const twc = (...cls: (string | boolean | undefined)[]) => cls.filter(Boolean).join(' ');

// ───────── Sub-components ─────────
function StepIndicator({ current, steps }: { current: WizardStep; steps: typeof STEPS }) {
  return (
    <div className="flex items-center w-full px-4 py-5">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div className={twc(
                'w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 text-sm',
                done ? 'bg-emerald-500 border-emerald-500 text-white' :
                  active ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200' :
                    'bg-white border-slate-200 text-slate-400'
              )}>
                {done ? <Check size={16} /> : <Icon size={15} />}
              </div>
              <span className={twc(
                'text-[10px] font-semibold text-center leading-tight hidden sm:block',
                active ? 'text-blue-600' : done ? 'text-emerald-600' : 'text-slate-400'
              )}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={twc(
                'flex-1 h-0.5 mx-1 transition-all duration-300',
                done ? 'bg-emerald-400' : 'bg-slate-200'
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const map: Record<string, string> = {
    'Tamamlandı': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Vezne Bekliyor': 'bg-amber-50 text-amber-700 border-amber-200',
    'Tedavide': 'bg-blue-50 text-blue-700 border-blue-200',
    'Provizyon Bekliyor': 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={twc('text-[10px] font-bold px-2 py-0.5 rounded border', map[status] || 'bg-slate-50 text-slate-600 border-slate-200')}>
      {label}
    </span>
  );
}

function FormField({ label, required, children, col2 }: { label: string; required?: boolean; children: React.ReactNode; col2?: boolean }) {
  return (
    <div className={col2 ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
const roInputCls = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium outline-none";
const selectCls = "w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none";

// ───────── Main Component ─────────
export function PatientRegistration() {
  const navigate = useNavigate();
  const { setCurrentPatient } = usePatientContext();
  const [step, setStep] = useState<WizardStep>(0);
  const [kpsStatus, setKpsStatus] = useState<KPSStatus>('idle');
  const [medulaStatus, setMedulaStatus] = useState<MEDULAStatus>('idle');
  const [mhrsStatus, setMhrsStatus] = useState<'idle' | 'loading' | 'found' | 'notFound'>('idle');
  const [tcInput, setTcInput] = useState('');
  const [searchMode, setSearchMode] = useState<'tc' | 'passport'>('tc');
  const [protokolNo] = useState(genProtokol);
  const [hastaId] = useState(genHastaId);
  const [completed, setCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [selectedRecent, setSelectedRecent] = useState<typeof RECENT_PATIENTS[0] | null>(null);
  const [showPrint, setShowPrint] = useState(false);
  const [kvkkOnay, setKvkkOnay] = useState(false);
  const [aydinlatmaOnay, setAydinlatmaOnay] = useState(false);
  const [organOnay, setOrganOnay] = useState(false);

  const [patient, setPatient] = useState<PatientData>({
    tc: '', ad: '', soyad: '', dogumTarihi: '', yas: 0,
    cinsiyet: '', babaAdi: '', anneAdi: '', uyruk: '', kanGrubu: 'A Rh(+)',
    medeniHal: 'Bekar', dogumYeri: '',
    cepTel: '', evTel: '', eposta: '', adres: '', ilce: '', il: '', postaKodu: '',
    yakinAdi: '', yakinTel: '', yakinYakinlik: 'Eş',
    kronikHastalik: [], alerji: '', engellilik: 'Yok', organBagisi: false,
    kurumTipi: 'SGK', sigortaSirketi: '', poliçeNo: '', sgkTescilNo: '',
    gelisSekli: 'Ayaktan Başvuru (Poliklinik)', kabulTuru: 'Ayaktan',
    bolum: '', hekim: '', randevuNo: '', sikayet: '', oncelik: 'Normal',
    servis: '', oda: '', yatak: '',
  });

  const upd = useCallback((key: keyof PatientData, value: unknown) =>
    setPatient(p => ({ ...p, [key]: value })), []);

  // ── Step 0: KPS Sorgulama ──
  const handleKPSSorgu = () => {
    if (tcInput.length < 5) return;
    setKpsStatus('loading');
    setTimeout(() => {
      const mock = MOCK_PATIENTS[tcInput];
      if (mock) {
        setPatient(p => ({ ...p, tc: tcInput, ...mock }));
        setKpsStatus('success');
      } else {
        setPatient(p => ({ ...p, tc: tcInput }));
        setKpsStatus('error');
      }
    }, 1800);
  };

  const handleMERNIS = () => {
    upd('adres', 'Bağcılar Mah. 15 Temmuz Bulvarı No:8 D:12');
    upd('ilce', 'Bağcılar');
    upd('il', 'İstanbul');
    upd('postaKodu', '34200');
  };

  const handleMEDULA = () => {
    setMedulaStatus('loading');
    setTimeout(() => {
      if (patient.kurumTipi === 'SGK') setMedulaStatus('success');
      else setMedulaStatus('noRecord');
    }, 2000);
  };

  const handleMHRS = () => {
    setMhrsStatus('loading');
    setTimeout(() => {
      setMhrsStatus('found');
      upd('randevuNo', 'MHRS-20250407-' + Math.floor(10000 + Math.random() * 90000));
    }, 1400);
  };

  const handleComplete = () => {
    setCurrentPatient({
      id: hastaId,
      fullName: `${patient.ad} ${patient.soyad}`.trim(),
      tc: patient.tc,
      phone: patient.cepTel,
      department: patient.bolum,
      doctor: patient.hekim,
      insurance: patient.kurumTipi,
      complaint: patient.sikayet,
      source: `Kayıt • ${protokolNo}`,
      protocolNo: protokolNo,
    });
    setCompleted(true);
    setShowPrint(true);
  };

  const resetAll = () => {
    setStep(0); setKpsStatus('idle'); setMedulaStatus('idle'); setMhrsStatus('idle');
    setTcInput(''); setCompleted(false); setShowPrint(false);
    setKvkkOnay(false); setAydinlatmaOnay(false); setOrganOnay(false);
    setPatient({
      tc: '', ad: '', soyad: '', dogumTarihi: '', yas: 0,
      cinsiyet: '', babaAdi: '', anneAdi: '', uyruk: '', kanGrubu: 'A Rh(+)',
      medeniHal: 'Bekar', dogumYeri: '',
      cepTel: '', evTel: '', eposta: '', adres: '', ilce: '', il: '', postaKodu: '',
      yakinAdi: '', yakinTel: '', yakinYakinlik: 'Eş',
      kronikHastalik: [], alerji: '', engellilik: 'Yok', organBagisi: false,
      kurumTipi: 'SGK', sigortaSirketi: '', poliçeNo: '', sgkTescilNo: '',
      gelisSekli: 'Ayaktan Başvuru (Poliklinik)', kabulTuru: 'Ayaktan',
      bolum: '', hekim: '', randevuNo: '', sikayet: '', oncelik: 'Normal',
      servis: '', oda: '', yatak: '',
    });
  };

  const openPatientRecord = () => {
    navigate(getModulePath('Elektronik Hasta Dosyası'));
  };

  const canNext: Record<WizardStep, boolean> = {
    0: kpsStatus === 'success' || kpsStatus === 'error',
    1: !!(patient.ad && patient.soyad && patient.cepTel),
    2: !!(patient.kurumTipi),
    3: !!(patient.bolum && patient.sikayet),
    4: kvkkOnay && aydinlatmaOnay,
  };

  const selectedServis = SERVISLER.find(s => s.ad === patient.servis);

  // ── Print Modal ──
  if (showPrint) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Hasta Kayıt Tamamlandı</h2>
            <p className="text-sm text-slate-500">Protokol numarası oluşturuldu. Fiş ve barkod yazdırılabilir.</p>
          </div>
          <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
            <UserPlus size={16} /> Yeni Hasta Kaydı
          </button>
        </div>

        {/* Success card */}
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-500 p-5 text-white flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <div className="font-bold text-lg">{patient.ad} {patient.soyad} — Kayıt Başarılı</div>
              <div className="text-emerald-100 text-sm">Kayıt {new Date().toLocaleString('tr-TR')} tarihinde tamamlandı.</div>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Protokol Kartı */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Protokol No', value: protokolNo, icon: Hash, color: 'text-blue-600' },
                  { label: 'Hasta ID', value: hastaId, icon: UserCheck, color: 'text-purple-600' },
                  { label: 'TC Kimlik', value: patient.tc.replace(/(\d{3})\d{5}(\d{3})/, '$1*****$2'), icon: Fingerprint, color: 'text-slate-600' },
                  { label: 'Sigorta', value: patient.kurumTipi, icon: Shield, color: 'text-emerald-600' },
                  { label: 'Kabul Türü', value: patient.kabulTuru, icon: BriefcaseMedical, color: 'text-amber-600' },
                  { label: 'Bölüm', value: patient.bolum || '—', icon: Stethoscope, color: 'text-rose-600' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className={twc('flex items-center gap-1.5 text-xs font-semibold mb-1', item.color)}>
                      <item.icon size={12} /> {item.label}
                    </div>
                    <div className="text-sm font-bold text-slate-800 truncate">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Randevu/Hekim */}
              {patient.hekim && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center gap-3">
                  <Stethoscope size={20} className="text-blue-500 shrink-0" />
                  <div>
                    <div className="text-xs text-blue-500 font-semibold">Atanan Hekim</div>
                    <div className="text-sm font-bold text-blue-900">{patient.hekim}</div>
                    {patient.randevuNo && <div className="text-xs text-blue-600 mt-0.5">MHRS: {patient.randevuNo}</div>}
                  </div>
                </div>
              )}

              {/* Yatış bilgisi */}
              {patient.kabulTuru === 'Yatış' && patient.yatak && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-center gap-3">
                  <Bed size={20} className="text-amber-500 shrink-0" />
                  <div>
                    <div className="text-xs text-amber-600 font-semibold">Yatak Ataması</div>
                    <div className="text-sm font-bold text-amber-900">{patient.servis} — Oda: {patient.oda} / Yatak: {patient.yatak}</div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: 'Kayıt Fişi Yazdır', icon: Printer, color: 'bg-slate-800 text-white hover:bg-slate-700' },
                  { label: 'Barkod Etiketi', icon: QrCode, color: 'bg-blue-600 text-white hover:bg-blue-700' },
                  { label: 'Hasta Kolu Etiketi', icon: FileText, color: 'bg-purple-600 text-white hover:bg-purple-700' },
                  { label: 'Aydınlatma Formu', icon: Download, color: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50' },
                ].map((btn, i) => (
                  <button key={i} className={twc('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors', btn.color)}>
                    <btn.icon size={15} /> {btn.label}
                  </button>
                ))}
                <button
                  onClick={openPatientRecord}
                  className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                >
                  <ArrowRight size={15} /> E-Hasta Dosyasını Aç
                </button>
              </div>
            </div>

            {/* QR Mock */}
            <div className="flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-xl border border-slate-200 p-5">
              <div className="w-32 h-32 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="grid grid-cols-6 gap-0.5 p-2 w-full h-full">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={twc('rounded-sm', (i * 7 + i % 5) % 3 === 0 ? 'bg-slate-800' : 'bg-white')} />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-700">{protokolNo}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{patient.ad} {patient.soyad}</div>
                <div className="text-[10px] text-slate-400">{new Date().toLocaleDateString('tr-TR')}</div>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Printer size={12} /> Etiketi Yazdır
              </button>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><ArrowRight size={16} className="text-blue-500" /> Sonraki Adımlar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Vezneye Yönlendir', desc: patient.kurumTipi === 'Ücretli' ? 'Muayene ücreti tahsilatı yapılacak' : 'Katkı payı ve fark ücreti kontrolü', icon: CreditCard, color: 'border-amber-200 bg-amber-50', iconColor: 'text-amber-500' },
              { title: 'Poliklinik Sırası', desc: `${patient.bolum} — ${patient.hekim || 'İlk Müsait Hekim'}`, icon: Clipboard, color: 'border-blue-200 bg-blue-50', iconColor: 'text-blue-500' },
              { title: 'Hasta Yönlendirme', desc: patient.kabulTuru === 'Yatış' ? `${patient.servis}` : '2. Katta Polikliniğe', icon: MapPin, color: 'border-emerald-200 bg-emerald-50', iconColor: 'text-emerald-500' },
            ].map((item, i) => (
              <div key={i} className={twc('rounded-xl border p-4 flex gap-3', item.color)}>
                <item.icon size={20} className={twc('shrink-0 mt-0.5', item.iconColor)} />
                <div>
                  <div className="text-sm font-bold text-slate-800">{item.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <UserPlus className="text-blue-600" size={24} /> Hasta Kayıt ve Kabul
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">KPS · MERNIS · MEDULA · MHRS entegrasyon simülasyonu — Protokol No: <span className="font-mono font-semibold text-slate-700">{protokolNo}</span></p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab(activeTab === 'form' ? 'history' : 'form')}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Search size={15} /> Kayıt Ara
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors shadow-sm">
            <ScanFace size={15} /> Biyometrik
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors shadow-sm">
            <Siren size={15} /> Acil Kabul
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Wizard Panel ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Step bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <StepIndicator current={step} steps={STEPS} />
          </div>

          {/* ━━━ Step 0: Kimlik Doğrulama ━━━ */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Fingerprint className="text-blue-500" size={18} /> Kimlik Doğrulama
                </h3>
                <div className="flex items-center gap-2">
                  {kpsStatus === 'success' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck size={13} /> KPS Doğrulandı
                    </span>
                  )}
                  {kpsStatus === 'error' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <AlertCircle size={13} /> Kayıt Bulunamadı
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 space-y-5">
                {/* Mode toggle */}
                <div className="flex bg-slate-100 rounded-lg p-0.5 w-fit">
                  {(['tc', 'passport'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setSearchMode(mode)}
                      className={twc(
                        'px-4 py-1.5 rounded-md text-sm font-semibold transition-all',
                        searchMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      )}
                    >
                      {mode === 'tc' ? '🇹🇷 TC Kimlik' : '🌐 Pasaport / Yabancı Uyruklu'}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={17} />
                    <input
                      type="text"
                      value={tcInput}
                      onChange={e => setTcInput(e.target.value.replace(searchMode === 'tc' ? /\D/g : /[^a-zA-Z0-9]/g, '').slice(0, searchMode === 'tc' ? 11 : 20))}
                      placeholder={searchMode === 'tc' ? 'TC Kimlik Numarası (11 hane)' : 'Pasaport Numarası'}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {tcInput.length > 0 && searchMode === 'tc' && (
                      <div className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">{tcInput.length}/11</div>
                    )}
                  </div>
                  <button
                    onClick={handleKPSSorgu}
                    disabled={kpsStatus === 'loading' || (searchMode === 'tc' && tcInput.length < 11) || (searchMode === 'passport' && tcInput.length < 6)}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                  >
                    {kpsStatus === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    {kpsStatus === 'loading' ? 'Sorgulanıyor...' : 'KPS Sorgula'}
                  </button>
                </div>

                {/* Demo hint */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 flex items-start gap-2">
                  <Info size={15} className="text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700">
                    <span className="font-semibold">Demo TC:</span> <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono cursor-pointer hover:bg-blue-200" onClick={() => setTcInput('12345678901')}>12345678901</code> (Ayşe Yılmaz) veya <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono cursor-pointer hover:bg-blue-200" onClick={() => setTcInput('98765432109')}>98765432109</code> (Mehmet Demir) — veya herhangi 11 haneli numara girerek manuel devam edin.
                  </div>
                </div>

                {/* KPS Result */}
                {(kpsStatus === 'success' || kpsStatus === 'error') && (
                  <div className={twc(
                    'rounded-xl border p-4',
                    kpsStatus === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                  )}>
                    {kpsStatus === 'success' ? (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <BadgeCheck size={18} className="text-emerald-600" />
                          <span className="font-semibold text-emerald-800 text-sm">Kimlik Doğrulandı — KPS Yanıtı</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {[
                            { label: 'Ad Soyad', value: `${patient.ad} ${patient.soyad}` },
                            { label: 'Doğum Tarihi', value: `${patient.dogumTarihi} (${patient.yas} yaş)` },
                            { label: 'Cinsiyet', value: patient.cinsiyet },
                            { label: 'Baba / Anne', value: `${patient.babaAdi} / ${patient.anneAdi}` },
                            { label: 'Uyruk', value: patient.uyruk },
                            { label: 'Doğum Yeri', value: patient.dogumYeri },
                          ].map((f, i) => (
                            <div key={i} className="bg-white/70 rounded-lg p-2.5">
                              <div className="text-[10px] text-emerald-600 font-semibold uppercase">{f.label}</div>
                              <div className="text-sm font-bold text-slate-800 mt-0.5">{f.value}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className="text-amber-600" />
                        <div>
                          <div className="font-semibold text-amber-800 text-sm">TC kaydı bulunamadı — Manuel Giriş Modu</div>
                          <div className="text-xs text-amber-700 mt-0.5">Yabancı uyruklu veya sistem dışı kayıt olabilir. Devam ederek manuel bilgi girişi yapabilirsiniz.</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ━━━ Step 1: Kişisel & İletişim ━━━ */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Kişisel Bilgiler */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <User className="text-blue-500" size={18} /> Demografik Bilgiler
                    {kpsStatus === 'success' && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 font-semibold">KPS'den Dolduruldu</span>}
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField label="Ad" required>
                    <input type="text" value={patient.ad} onChange={e => upd('ad', e.target.value)} className={inputCls} readOnly={kpsStatus === 'success'} style={kpsStatus === 'success' ? { background: '#f8fafc' } : {}} />
                  </FormField>
                  <FormField label="Soyad" required>
                    <input type="text" value={patient.soyad} onChange={e => upd('soyad', e.target.value)} className={inputCls} readOnly={kpsStatus === 'success'} style={kpsStatus === 'success' ? { background: '#f8fafc' } : {}} />
                  </FormField>
                  <FormField label="Doğum Tarihi" required>
                    <input type="text" value={patient.dogumTarihi} onChange={e => upd('dogumTarihi', e.target.value)} placeholder="GG.AA.YYYY" className={kpsStatus === 'success' ? roInputCls : inputCls} readOnly={kpsStatus === 'success'} />
                  </FormField>
                  <FormField label="Cinsiyet" required>
                    <select value={patient.cinsiyet} onChange={e => upd('cinsiyet', e.target.value)} className={selectCls} disabled={kpsStatus === 'success'}>
                      <option value="">Seçiniz</option>
                      <option>Erkek</option><option>Kadın</option><option>Belirtilmemiş</option>
                    </select>
                  </FormField>
                  <FormField label="Medeni Hal">
                    <select value={patient.medeniHal} onChange={e => upd('medeniHal', e.target.value)} className={selectCls}>
                      <option>Bekar</option><option>Evli</option><option>Dul</option><option>Boşanmış</option>
                    </select>
                  </FormField>
                  <FormField label="Kan Grubu">
                    <select value={patient.kanGrubu} onChange={e => upd('kanGrubu', e.target.value)} className={selectCls}>
                      {['A Rh(+)', 'A Rh(-)', 'B Rh(+)', 'B Rh(-)', '0 Rh(+)', '0 Rh(-)', 'AB Rh(+)', 'AB Rh(-)'].map(k => <option key={k}>{k}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Baba Adı">
                    <input type="text" value={patient.babaAdi} onChange={e => upd('babaAdi', e.target.value)} className={kpsStatus === 'success' ? roInputCls : inputCls} readOnly={kpsStatus === 'success'} />
                  </FormField>
                  <FormField label="Anne Adı">
                    <input type="text" value={patient.anneAdi} onChange={e => upd('anneAdi', e.target.value)} className={kpsStatus === 'success' ? roInputCls : inputCls} readOnly={kpsStatus === 'success'} />
                  </FormField>
                  <FormField label="Uyruk">
                    <input type="text" value={patient.uyruk} onChange={e => upd('uyruk', e.target.value)} className={inputCls} />
                  </FormField>
                </div>
              </div>

              {/* İletişim */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Phone className="text-emerald-500" size={18} /> İletişim Bilgileri
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Cep Telefonu" required>
                    <div className="flex">
                      <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-sm text-slate-600 font-mono">+90</span>
                      <input type="tel" value={patient.cepTel} onChange={e => upd('cepTel', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="5XX XXX XXXX" className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-r-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                    </div>
                  </FormField>
                  <FormField label="Ev Telefonu">
                    <div className="flex">
                      <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-sm text-slate-600 font-mono">+90</span>
                      <input type="tel" value={patient.evTel} onChange={e => upd('evTel', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="2XX XXX XXXX" className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-r-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                    </div>
                  </FormField>
                  <FormField label="E-posta" col2>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-slate-400" size={15} />
                      <input type="email" value={patient.eposta} onChange={e => upd('eposta', e.target.value)} placeholder="ornek@mail.com" className={`${inputCls} pl-9`} />
                    </div>
                  </FormField>
                  <FormField label="İkametgah Adresi" col2>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Home className="absolute left-3 top-2.5 text-slate-400" size={15} />
                        <input type="text" value={patient.adres} onChange={e => upd('adres', e.target.value)} placeholder="Mahalle, Cadde/Sokak, No, Daire" className={`${inputCls} pl-9`} />
                      </div>
                      <button onClick={handleMERNIS} className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors whitespace-nowrap">
                        MERNIS'ten Çek
                      </button>
                    </div>
                  </FormField>
                  <FormField label="İlçe">
                    <input type="text" value={patient.ilce} onChange={e => upd('ilce', e.target.value)} placeholder="İlçe" className={inputCls} />
                  </FormField>
                  <FormField label="İl">
                    <input type="text" value={patient.il} onChange={e => upd('il', e.target.value)} placeholder="İl" className={inputCls} />
                  </FormField>
                </div>
              </div>

              {/* Acil İletişim */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <PhoneCall className="text-rose-500" size={18} /> Acil İletişim Kişisi
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Ad Soyad">
                    <input type="text" value={patient.yakinAdi} onChange={e => upd('yakinAdi', e.target.value)} placeholder="Yakın adı" className={inputCls} />
                  </FormField>
                  <FormField label="Yakınlık Derecesi">
                    <select value={patient.yakinYakinlik} onChange={e => upd('yakinYakinlik', e.target.value)} className={selectCls}>
                      {['Eş', 'Anne', 'Baba', 'Kardeş', 'Çocuk', 'Arkadaş', 'Diğer'].map(k => <option key={k}>{k}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Telefon">
                    <input type="tel" value={patient.yakinTel} onChange={e => upd('yakinTel', e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="05XX XXX XXXX" className={`${inputCls} font-mono`} />
                  </FormField>
                </div>
              </div>

              {/* Tıbbi Ön Bilgi */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Heart className="text-rose-500" size={18} /> Tıbbi Ön Bilgi & Beyan
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kronik Hastalık(lar)</label>
                    <div className="flex flex-wrap gap-2">
                      {['Hipertansiyon', 'Tip 2 Diyabet', 'Astım/KOAH', 'Koroner Arter', 'Böbrek Hastalığı', 'Tiroid Hastalığı', 'Epilepsi', 'Kanser'].map(h => (
                        <button
                          key={h}
                          onClick={() => upd('kronikHastalik', patient.kronikHastalik.includes(h) ? patient.kronikHastalik.filter(k => k !== h) : [...patient.kronikHastalik, h])}
                          className={twc(
                            'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                            patient.kronikHastalik.includes(h)
                              ? 'bg-rose-100 text-rose-700 border-rose-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          )}
                        >
                          {patient.kronikHastalik.includes(h) ? '✓ ' : '+ '}{h}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Bilinen Alerji">
                      <input type="text" value={patient.alerji} onChange={e => upd('alerji', e.target.value)} placeholder="İlaç, besin, madde alerjileri..." className={inputCls} />
                    </FormField>
                    <FormField label="Engellilik Durumu">
                      <select value={patient.engellilik} onChange={e => upd('engellilik', e.target.value)} className={selectCls}>
                        {['Yok', '%40 ve altı', '%41-%59', '%60-%79', '%80 ve üzeri'].map(k => <option key={k}>{k}</option>)}
                      </select>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ━━━ Step 2: Sigorta & Kurum ━━━ */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Shield className="text-blue-500" size={18} /> Sigorta & Ödeme Tipi
                  </h3>
                </div>
                <div className="p-5 space-y-5">
                  {/* Kurum seçim kartları */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kurum / Ödeme Tipi <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { val: 'SGK', label: 'SGK', sub: 'Çalışan / Emekli', color: 'blue', icon: Shield },
                        { val: 'ÖSS', label: 'Özel Sigorta', sub: 'ÖSS / Grup', color: 'purple', icon: BriefcaseMedical },
                        { val: 'TSS', label: 'Tamamlayıcı', sub: 'TSS', color: 'emerald', icon: ShieldCheck },
                        { val: 'Ücretli', label: 'Ücretli', sub: 'Nakit / Kart', color: 'amber', icon: CreditCard },
                        { val: 'Yeşil Kart', label: 'Yeşil Kart', sub: 'Sosyal Yardım', color: 'green', icon: FileText },
                        { val: 'Yabancı Uyruklu', label: 'Yabancı', sub: 'Turist / Dış', color: 'rose', icon: Globe },
                      ].map(opt => {
                        const active = patient.kurumTipi === opt.val;
                        const colorMap: Record<string, string> = {
                          blue: 'border-blue-300 bg-blue-50 text-blue-800',
                          purple: 'border-purple-300 bg-purple-50 text-purple-800',
                          emerald: 'border-emerald-300 bg-emerald-50 text-emerald-800',
                          amber: 'border-amber-300 bg-amber-50 text-amber-800',
                          green: 'border-green-300 bg-green-50 text-green-800',
                          rose: 'border-rose-300 bg-rose-50 text-rose-800',
                        };
                        return (
                          <button
                            key={opt.val}
                            onClick={() => { upd('kurumTipi', opt.val); setMedulaStatus('idle'); }}
                            className={twc(
                              'rounded-xl border-2 p-3 text-left transition-all',
                              active ? colorMap[opt.color] : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            )}
                          >
                            <opt.icon size={18} className="mb-1" />
                            <div className="text-sm font-bold">{opt.label}</div>
                            <div className="text-[10px] opacity-70">{opt.sub}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SGK */}
                  {patient.kurumTipi === 'SGK' && (
                    <div className="space-y-4 border-t border-slate-100 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="SGK Tescil / TC No">
                          <input type="text" value={patient.sgkTescilNo} onChange={e => upd('sgkTescilNo', e.target.value)} placeholder="SGK-XXXX-XXXXXXXX" className={`${inputCls} font-mono`} />
                        </FormField>
                        <FormField label="SGK Hizmet Kolu">
                          <select className={selectCls}>
                            <option>4/a (SSK - İş Kanunu)</option>
                            <option>4/b (Bağ-Kur)</option>
                            <option>4/c (Emekli Sandığı - Devlet)</option>
                            <option>Emekli (Yaşlılık)</option>
                          </select>
                        </FormField>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleMEDULA}
                          disabled={medulaStatus === 'loading'}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-60"
                        >
                          {medulaStatus === 'loading' ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                          {medulaStatus === 'loading' ? 'MEDULA Sorgulanıyor...' : 'MEDULA Müstehaklık Sorgula'}
                        </button>
                        {medulaStatus === 'success' && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <CheckCircle2 size={16} className="text-emerald-600" />
                            <span className="text-sm font-semibold text-emerald-700">Müstehaklık Onaylandı</span>
                            <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">%30 Katkı Payı</span>
                          </div>
                        )}
                        {medulaStatus === 'noRecord' && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-lg">
                            <Ban size={16} className="text-rose-600" />
                            <span className="text-sm font-semibold text-rose-700">Müstehaklık Bulunamadı</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ÖSS / TSS */}
                  {(patient.kurumTipi === 'ÖSS' || patient.kurumTipi === 'TSS') && (
                    <div className="space-y-4 border-t border-slate-100 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Sigorta Şirketi" required>
                          <select value={patient.sigortaSirketi} onChange={e => upd('sigortaSirketi', e.target.value)} className={selectCls}>
                            <option value="">Seçiniz...</option>
                            {['Axa Sigorta', 'Allianz', 'Generali Sigorta', 'Mapfre Sigorta', 'Türk Sigorta', 'Güneş Sigorta', 'Aksigorta', 'Ergo Sigorta'].map(s => <option key={s}>{s}</option>)}
                          </select>
                        </FormField>
                        <FormField label="Poliçe Numarası">
                          <input type="text" value={patient.poliçeNo} onChange={e => upd('poliçeNo', e.target.value)} placeholder="POL-XXXX-XXXXXXX" className={`${inputCls} font-mono`} />
                        </FormField>
                      </div>
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-sm">
                        <ShieldCheck size={15} /> Provizyon Al
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sevk / Referral */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="text-amber-500" size={18} /> Sevk / Ön Onay Bilgisi
                  </h3>
                </div>
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Sevk Durumu">
                    <select className={selectCls}>
                      <option>Sevksiz (Direkt Başvuru)</option>
                      <option>Birinci Basamak Sevkli</option>
                      <option>İkinci Basamak Sevkli</option>
                      <option>Acil (Sevk Aranmaz)</option>
                    </select>
                  </FormField>
                  <FormField label="Sevk Yapan Kurum">
                    <input type="text" placeholder="Aile Sağlığı Merkezi adı..." className={inputCls} />
                  </FormField>
                </div>
              </div>
            </div>
          )}

          {/* ━━━ Step 3: Kabul & Yönlendirme ━━━ */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Kabul Türü */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <BriefcaseMedical className="text-blue-500" size={18} /> Kabul Türü & Geliş Şekli
                  </h3>
                </div>
                <div className="p-5 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kabul Türü <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { val: 'Ayaktan', label: 'Ayaktan', icon: Activity, color: 'blue', desc: 'Poliklinik' },
                        { val: 'Yatış', label: 'Yatış Kabulü', icon: Bed, color: 'purple', desc: 'Servis/Klinik' },
                        { val: 'Acil', label: 'Acil', icon: Siren, color: 'rose', desc: 'Acil Servis' },
                        { val: 'Günübirlik', label: 'Günübirlik', icon: Clock, color: 'amber', desc: 'Ameliyat / İşlem' },
                      ].map(opt => {
                        const active = patient.kabulTuru === opt.val;
                        const colorMap: Record<string, string> = {
                          blue: 'border-blue-300 bg-blue-50 text-blue-800',
                          purple: 'border-purple-300 bg-purple-50 text-purple-800',
                          rose: 'border-rose-300 bg-rose-50 text-rose-800',
                          amber: 'border-amber-300 bg-amber-50 text-amber-800',
                        };
                        return (
                          <button
                            key={opt.val}
                            onClick={() => upd('kabulTuru', opt.val)}
                            className={twc(
                              'rounded-xl border-2 p-3 text-left transition-all',
                              active ? colorMap[opt.color] : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            )}
                          >
                            <opt.icon size={18} className="mb-1" />
                            <div className="text-sm font-bold">{opt.label}</div>
                            <div className="text-[10px] opacity-70">{opt.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Geliş Şekli" required>
                      <select value={patient.gelisSekli} onChange={e => upd('gelisSekli', e.target.value)} className={selectCls}>
                        <option>Ayaktan Başvuru (Poliklinik)</option>
                        <option>Acil Başvuru (Ambulans)</option>
                        <option>Acil Başvuru (Kendi Geldi)</option>
                        <option>Sevkli Gelen</option>
                        <option>Yurt Dışından Gelen</option>
                        <option>Adli Vaka</option>
                        <option>İş Kazası</option>
                      </select>
                    </FormField>
                    <FormField label="Öncelik / Triaj">
                      <select value={patient.oncelik} onChange={e => upd('oncelik', e.target.value)} className={selectCls}>
                        <option value="Normal">Normal (Yeşil)</option>
                        <option value="Acil">Acil (Sarı)</option>
                        <option value="Çok Acil">Çok Acil (Turuncu)</option>
                        <option value="Resüsitasyon">Resüsitasyon (Kırmızı)</option>
                        <option value="Ölü">Ölü (Siyah)</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Bölüm & Hekim */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Stethoscope className="text-emerald-500" size={18} /> Bölüm & Hekim Seçimi
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Gidilecek Bölüm / Poliklinik" required>
                      <select value={patient.bolum} onChange={e => { upd('bolum', e.target.value); upd('hekim', ''); }} className={selectCls}>
                        <option value="">Seçiniz...</option>
                        {Object.keys(BOLUMLER).map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Hekim Seçimi">
                      <select value={patient.hekim} onChange={e => upd('hekim', e.target.value)} className={selectCls} disabled={!patient.bolum}>
                        <option value="">(Farketmez) İlk Müsait Hekim</option>
                        {patient.bolum && BOLUMLER[patient.bolum]?.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </FormField>
                  </div>

                  {/* MHRS */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleMHRS}
                      disabled={mhrsStatus === 'loading'}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      {mhrsStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={14} />}
                      {mhrsStatus === 'loading' ? 'MHRS Sorgulanıyor...' : 'MHRS Randevu Bağla'}
                    </button>
                    {mhrsStatus === 'found' && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <CheckCircle2 size={15} className="text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">Randevu: {patient.randevuNo}</span>
                      </div>
                    )}
                    {mhrsStatus === 'notFound' && (
                      <span className="text-xs text-slate-500">Aktif randevu bulunamadı.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Şikayet */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="text-amber-500" size={18} /> Başvuru Şikayeti
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <FormField label="Başvuru Şikayeti (Anamnez Özeti)" required>
                    <textarea
                      value={patient.sikayet}
                      onChange={e => upd('sikayet', e.target.value)}
                      rows={3}
                      placeholder="Hastanın kendisinin ifade ettiği şikayet ve süresi..."
                      className={`${inputCls} resize-none`}
                    />
                  </FormField>
                  <div className="flex flex-wrap gap-2">
                    {['Göğüs ağrısı', 'Nefes darlığı', 'Baş ağrısı', 'Karın ağrısı', 'Bulantı / Kusma', 'Ateş', 'Öksürük', 'Halsizlik', 'Kontrol amaçlı'].map(s => (
                      <button key={s} onClick={() => upd('sikayet', patient.sikayet ? `${patient.sikayet}, ${s}` : s)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors">
                        + {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Yatış ise yatak seçimi */}
              {patient.kabulTuru === 'Yatış' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Bed className="text-purple-500" size={18} /> Yatak / Servis Ataması
                    </h3>
                  </div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Servis / Klinik" required>
                      <select value={patient.servis} onChange={e => { upd('servis', e.target.value); upd('oda', ''); upd('yatak', ''); }} className={selectCls}>
                        <option value="">Seçiniz...</option>
                        {SERVISLER.map(s => <option key={s.ad} value={s.ad}>{s.ad}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Oda No">
                      <select value={patient.oda} onChange={e => { upd('oda', e.target.value); upd('yatak', ''); }} className={selectCls} disabled={!patient.servis}>
                        <option value="">Seçiniz...</option>
                        {selectedServis?.odalar.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Yatak No">
                      <select value={patient.yatak} onChange={e => upd('yatak', e.target.value)} className={selectCls} disabled={!patient.oda}>
                        <option value="">Seçiniz...</option>
                        {patient.oda && ['A', 'B', 'C', 'D'].map(y => <option key={y} value={y}>{patient.oda}-{y}</option>)}
                      </select>
                    </FormField>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ━━━ Step 4: Onay & İzinler ━━━ */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Özet */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Eye className="text-blue-500" size={18} /> Kayıt Özeti & Doğrulama
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: 'Ad Soyad', value: `${patient.ad} ${patient.soyad}` },
                      { label: 'TC Kimlik', value: patient.tc.replace(/(\d{3})\d{5}(\d{3})/, '$1*****$2') },
                      { label: 'Doğum Tarihi', value: patient.dogumTarihi },
                      { label: 'Cep Telefonu', value: patient.cepTel ? `+90 ${patient.cepTel}` : '—' },
                      { label: 'Sigorta', value: patient.kurumTipi },
                      { label: 'Kabul Türü', value: patient.kabulTuru },
                      { label: 'Bölüm', value: patient.bolum || '—' },
                      { label: 'Hekim', value: patient.hekim || 'İlk Müsait' },
                      { label: 'Öncelik', value: patient.oncelik },
                    ].map((f, i) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">{f.label}</div>
                        <div className="text-sm font-bold text-slate-800 mt-0.5 truncate">{f.value}</div>
                      </div>
                    ))}
                  </div>

                  {patient.kronikHastalik.length > 0 && (
                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 flex items-start gap-2">
                      <AlertTriangle size={15} className="text-rose-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-rose-700">
                        <span className="font-bold">Kronik Hastalıklar:</span> {patient.kronikHastalik.join(', ')}
                        {patient.alerji && <> · <span className="font-bold">Alerji:</span> {patient.alerji}</>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Formlar & Onaylar */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileCheck className="text-emerald-500" size={18} /> Zorunlu Formlar & Onaylar
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  {[
                    {
                      key: 'kvkk', checked: kvkkOnay, set: setKvkkOnay,
                      label: 'KVKK Aydınlatma Metni',
                      desc: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerimin işlenmesine onay veriyorum.',
                      required: true,
                    },
                    {
                      key: 'aydinlatma', checked: aydinlatmaOnay, set: setAydinlatmaOnay,
                      label: 'Hastane Hasta Hakları Formu',
                      desc: 'Hasta hakları, tedavi süreci ve hizmet koşulları hakkında bilgilendirildiğimi beyan ederim.',
                      required: true,
                    },
                    {
                      key: 'organ', checked: organOnay, set: setOrganOnay,
                      label: 'Organ ve Doku Bağışı Beyanı',
                      desc: 'Organ bağışçısı olmayı kabul ediyorum (isteğe bağlı).',
                      required: false,
                    },
                  ].map(form => (
                    <div
                      key={form.key}
                      className={twc(
                        'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                        form.checked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 hover:bg-slate-50'
                      )}
                      onClick={() => form.set(!form.checked)}
                    >
                      <div className={twc(
                        'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                        form.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                      )}>
                        {form.checked && <Check size={12} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          {form.label}
                          {form.required && <span className="text-red-500 text-xs">*</span>}
                          {!form.required && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">İsteğe Bağlı</span>}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{form.desc}</div>
                      </div>
                      <button
                        onClick={e => e.stopPropagation()}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap flex items-center gap-1"
                      >
                        <Eye size={12} /> Görüntüle
                      </button>
                    </div>
                  ))}

                  {(!kvkkOnay || !aydinlatmaOnay) && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <AlertTriangle size={14} />
                      Kayıt tamamlayabilmek için zorunlu formların onaylanması gerekir.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1) as WizardStep)}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={17} /> Geri
            </button>
            <div className="text-xs text-slate-500 font-medium">Adım {step + 1} / {STEPS.length}</div>
            {step < 4 ? (
              <button
                onClick={() => setStep(s => Math.min(4, s + 1) as WizardStep)}
                disabled={!canNext[step]}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Devam <ChevronRight size={17} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!canNext[4]}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FileCheck size={17} /> Kaydı Tamamla & Fiş Yazdır
              </button>
            )}
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Bugün Kayıt', value: '142', icon: UserPlus, color: 'text-blue-600 bg-blue-50' },
              { label: 'Yatış Bekleyen', value: '7', icon: Bed, color: 'text-purple-600 bg-purple-50' },
              { label: 'Acil', value: '14', icon: Siren, color: 'text-rose-600 bg-rose-50' },
              { label: 'Onay Bekleyen', value: '3', icon: Clock, color: 'text-amber-600 bg-amber-50' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
                <div className={twc('w-9 h-9 rounded-lg flex items-center justify-center', s.color)}>
                  <s.icon size={18} />
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800 leading-none">{s.value}</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Records */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
                <Clock className="text-slate-400" size={16} /> Son Kayıtlar
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Bugün</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {RECENT_PATIENTS.map((p, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRecent(selectedRecent?.id === p.id ? null : p)}
                  className={twc(
                    'p-3 cursor-pointer transition-all',
                    selectedRecent?.id === p.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-semibold text-sm text-slate-800">{p.ad}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{p.saat}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500">{p.tc}</span>
                    <span className={twc(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded',
                      p.tip === 'SGK' ? 'bg-blue-50 text-blue-600' :
                        p.tip === 'ÖSS' ? 'bg-purple-50 text-purple-600' :
                          p.tip === 'TSS' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-amber-50 text-amber-600'
                    )}>{p.tip}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">{p.bolum}</span>
                    <StatusBadge status={p.durum} label={p.durum} />
                  </div>
                  {selectedRecent?.id === p.id && (
                    <div className="mt-2 pt-2 border-t border-blue-100 space-y-1">
                      <div className="text-[10px] text-blue-700 font-mono">{p.protokol}</div>
                      <div className="flex gap-1.5">
                        <button className="flex-1 py-1 bg-blue-100 text-blue-700 rounded text-[10px] font-bold hover:bg-blue-200 flex items-center justify-center gap-1">
                          <Eye size={9} /> Görüntüle
                        </button>
                        <button className="flex-1 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold hover:bg-slate-200 flex items-center justify-center gap-1">
                          <Printer size={9} /> Yazdır
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100">
              <button className="w-full py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
                Tüm Kayıtları Gör
              </button>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-4">
            <h3 className="font-semibold text-amber-800 flex items-center gap-2 text-sm mb-3">
              <AlertTriangle size={15} /> Bekleyen İşlemler
            </h3>
            <div className="space-y-2">
              {[
                { ad: 'Mustafa K.', tip: 'Ücretli', islem: 'Tahsilat', color: 'bg-amber-200 text-amber-800' },
                { ad: 'Elif S.', tip: 'ÖSS', islem: 'Provizyon', color: 'bg-purple-200 text-purple-800' },
                { ad: 'Hüseyin T.', tip: 'SGK', islem: 'MEDULA', color: 'bg-blue-200 text-blue-800' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-white/70 px-3 py-2 rounded-lg border border-amber-100">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{item.ad}</div>
                    <div className="text-[10px] text-slate-500">{item.tip}</div>
                  </div>
                  <button className={twc('text-[10px] font-bold px-2.5 py-1 rounded transition-colors hover:opacity-80', item.color)}>
                    {item.islem}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
