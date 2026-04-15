import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Apple,
  Archive,
  BedDouble,
  Bot,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  CreditCard,
  Droplet,
  FileClock,
  FileSearch,
  FileText,
  Fingerprint,
  FlaskConical,
  Focus,
  Heart,
  HeartPulse,
  HelpCircle,
  LayoutDashboard,
  Microscope,
  MonitorSmartphone,
  PieChart,
  Pill,
  Scissors,
  ShieldAlert,
  Stethoscope,
  Users,
  Bone,
} from 'lucide-react';

export interface ModuleDefinition {
  name: string;
  category: string;
  icon: LucideIcon;
  description: string;
  searchTerms: string[];
}

export interface ModuleCategory {
  category: string;
  items: ModuleDefinition[];
}

const createModule = (
  category: string,
  name: string,
  icon: LucideIcon,
  description: string,
  searchTerms: string[],
): ModuleDefinition => ({
  category,
  name,
  icon,
  description,
  searchTerms,
});

export const MODULE_CATEGORIES: ModuleCategory[] = [
  {
    category: 'Yönetim & Dashboard',
    items: [
      createModule('Yönetim & Dashboard', 'İş Zekası (BI Dashboard)', PieChart, 'Operasyonel durum, doluluk, kritik uyarılar ve günlük KPI görünümü.', ['dashboard', 'kpi', 'rapor', 'yoğunluk']),
      createModule('Yönetim & Dashboard', 'İş Zekası ve İleri Raporlama', LayoutDashboard, 'Kurumsal raporlama, kıyaslama ve performans görselleştirmeleri.', ['ileri rapor', 'bi', 'analitik']),
      createModule('Yönetim & Dashboard', 'Kalite ve Risk Yönetim', ShieldAlert, 'Kalite göstergeleri, olay bildirimi ve risk izleme ekranı.', ['kalite', 'risk', 'olay']),
      createModule('Yönetim & Dashboard', 'Hasta Memnuniyeti', Heart, 'Memnuniyet skorları, geri bildirimler ve hizmet değerlendirme modülü.', ['memnuniyet', 'geri bildirim']),
      createModule('Yönetim & Dashboard', 'AI Destekli Modüller', Bot, 'Özetleme, önceliklendirme ve klinik destek senaryoları için AI showcase.', ['ai', 'yapay zeka', 'öneri']),
    ],
  },
  {
    category: 'Hasta Hizmetleri',
    items: [
      createModule('Hasta Hizmetleri', 'Hasta Kayıt ve Kabul', Fingerprint, 'Kimlik doğrulama, provizyon ve hasta kabul sürecinin başlangıç noktası.', ['hasta kayıt', 'kabul', 'provizyon']),
      createModule('Hasta Hizmetleri', 'Randevu Yönetimi', CalendarDays, 'MHRS, online ve banko randevularını takvim ve sıra bazında yönetir.', ['randevu', 'takvim', 'slot']),
      createModule('Hasta Hizmetleri', 'Danışma Modülü', HelpCircle, 'Karşılama, yönlendirme ve bilgi masası operasyonlarını merkezi yönetir.', ['danışma', 'karşılama']),
      createModule('Hasta Hizmetleri', 'Elektronik Hasta Dosyası', FileText, 'Vizit, reçete, laboratuvar, radyoloji ve epikriz için hasta zaman çizgisi.', ['ehr', 'emr', 'epikriz', 'hasta dosyası']),
    ],
  },
  {
    category: 'Klinik & Teşhis',
    items: [
      createModule('Klinik & Teşhis', 'Poliklinik Muayene', Stethoscope, 'Hekim muayene akışı, sıra takibi ve karar destek görünümü.', ['poliklinik', 'muayene', 'hekim']),
      createModule('Klinik & Teşhis', 'Acil Servis Yönetimi', Activity, 'Triaj, kritik hasta takibi ve acil servis iş yükü ekranı.', ['acil', 'triaj', 'ambulans']),
      createModule('Klinik & Teşhis', 'Yatan Hasta / Servis', BedDouble, 'Servis içi yatış, hemşirelik ve taburculuk takibini birleştirir.', ['yatan hasta', 'servis', 'yatış']),
      createModule('Klinik & Teşhis', 'Ameliyathane Yönetimi', Scissors, 'Salon planlama, ekip koordinasyonu ve ameliyat hazırlık yönetimi.', ['ameliyathane', 'operasyon', 'salon']),
      createModule('Klinik & Teşhis', 'Yoğun Bakım Bilgi Sistemi', HeartPulse, 'Yoğun bakım yatak, ventilatör ve kritik hasta paneli.', ['yogun bakım', 'icu', 'ventilatör']),
      createModule('Klinik & Teşhis', 'Hemşirelik Bakım', ClipboardList, 'Hemşire görevleri, bakım planları ve vardiya önceliklendirmesi.', ['hemşire', 'bakım']),
      createModule('Klinik & Teşhis', 'Fizik Tedavi', Stethoscope, 'Seans planı, hasta ilerlemesi ve tedavi egzersiz takibi.', ['ftr', 'fizik tedavi']),
      createModule('Klinik & Teşhis', 'Konsültasyon', Users, 'Bölümler arası konsültasyon istekleri ve SLA izleme.', ['konsültasyon', 'istek']),
      createModule('Klinik & Teşhis', 'Sağlık Kurulu', FileSearch, 'Heyet dosyaları, kurul süreçleri ve karar akışını yönetir.', ['sağlık kurulu', 'heyet']),
    ],
  },
  {
    category: 'Tıbbi Destek',
    items: [
      createModule('Tıbbi Destek', 'Laboratuvar (LIS)', FlaskConical, 'Numune, sonuç ve kritik değer yönetimi için laboratuvar görünümü.', ['laboratuvar', 'lis', 'numune']),
      createModule('Tıbbi Destek', 'Radyoloji (RIS + PACS)', Bone, 'Tetkik, rapor ve görüntü erişimi için radyoloji iş istasyonu.', ['radyoloji', 'ris', 'pacs']),
      createModule('Tıbbi Destek', 'Patoloji & Mikrobiyoloji', Microscope, 'Patoloji vakaları ve mikrobiyoloji sonuç takibi.', ['patoloji', 'mikrobiyoloji']),
      createModule('Tıbbi Destek', 'Kan Bankası', Droplet, 'Kan ürünleri, istek yönetimi ve uygunluk süreçleri.', ['kan bankası', 'transfüzyon']),
      createModule('Tıbbi Destek', 'Eczane ve İlaç', Pill, 'Reçete, ilaç stoğu ve güvenli dağıtım ekranı.', ['eczane', 'ilaç', 'reçete']),
      createModule('Tıbbi Destek', 'Sterilizasyon (MSÜ)', Activity, 'Sterilizasyon çevrimleri ve set takibi.', ['sterilizasyon', 'msü']),
      createModule('Tıbbi Destek', 'Diyet ve İaşe', Apple, 'Beslenme planları ve diyetisyen iş akışı.', ['diyet', 'beslenme']),
      createModule('Tıbbi Destek', 'Enfeksiyon Kontrol', Activity, 'İzolasyon, sürveyans ve hijyen uyum ekranı.', ['enfeksiyon', 'izolasyon', 'hai']),
    ],
  },
  {
    category: 'Finans & İdari',
    items: [
      createModule('Finans & İdari', 'Faturalama ve Gelir', CreditCard, 'MEDULA, fatura ve gelir görünümü.', ['faturalama', 'medula', 'gelir']),
      createModule('Finans & İdari', 'Vezne / Tahsilat', CreditCard, 'Ödeme alma, kasa ve tahsilat akışı.', ['vezne', 'tahsilat']),
      createModule('Finans & İdari', 'Kurumsal Anlaşma', CheckSquare, 'Anlaşmalı kurumlar ve sözleşme yönetimi.', ['anlaşma', 'kurum', 'sözleşme']),
      createModule('Finans & İdari', 'Stok ve Malzeme', Archive, 'Sarf malzeme, depo ve kritik stok görünümü.', ['stok', 'malzeme', 'depo']),
      createModule('Finans & İdari', 'Tıbbi Cihaz Takip', MonitorSmartphone, 'Bakım takvimi ve cihaz yaşam döngüsü yönetimi.', ['cihaz', 'bakım', 'biyomedikal']),
      createModule('Finans & İdari', 'Doküman Yönetim (EBYS)', FileClock, 'Kurumsal doküman, versiyon ve erişim yönetimi.', ['ebys', 'doküman']),
      createModule('Finans & İdari', 'RTLS Konum Takibi', Focus, 'Hasta, ekipman ve personel konum takibi senaryoları.', ['rtls', 'konum', 'lokasyon']),
      createModule('Finans & İdari', 'İnsan Kaynakları', Users, 'Personel, eğitim ve sertifikasyon takibi.', ['ik', 'personel', 'hr']),
      createModule('Finans & İdari', 'Nöbet Yönetimi', CalendarDays, 'Vardiya planlama ve nöbet dağılımı modülü.', ['nöbet', 'vardiya']),
    ],
  },
];

export const MODULES = MODULE_CATEGORIES.flatMap((category) => category.items);

export const DEFAULT_MODULE = 'İş Zekası (BI Dashboard)';

const MODULE_ROUTE_OVERRIDES: Record<string, string> = {
  'İş Zekası (BI Dashboard)': '/dashboard',
  'Randevu Yönetimi': '/appointments',
  'Elektronik Hasta Dosyası': '/ehr',
  'Hasta Kayıt ve Kabul': '/patient-registration',
};

export function getModuleByName(name: string) {
  return MODULES.find((module) => module.name === name);
}

export function getCategoryByModule(name: string) {
  return MODULE_CATEGORIES.find((category) => category.items.some((item) => item.name === name));
}

export function getModuleSlug(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/&/g, ' ve ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getModuleBySlug(slug: string) {
  return MODULES.find((module) => getModuleSlug(module.name) === slug);
}

export function getModulePath(name: string) {
  const module = getModuleByName(name);
  if (!module) {
    return MODULE_ROUTE_OVERRIDES[DEFAULT_MODULE];
  }

  return MODULE_ROUTE_OVERRIDES[module.name] ?? `/${getModuleSlug(module.name)}`;
}

export function getModuleByPath(pathname: string) {
  const normalizedPath =
    pathname.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';

  if (normalizedPath === '/') {
    return undefined;
  }

  const overrideEntry = Object.entries(MODULE_ROUTE_OVERRIDES).find(([, route]) => route === normalizedPath);
  if (overrideEntry) {
    return getModuleByName(overrideEntry[0]);
  }

  return getModuleBySlug(normalizedPath.replace(/^\/+/, ''));
}
