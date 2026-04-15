import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import {
  DEFAULT_MODULE,
  getModuleByPath,
  getModuleByName,
  getModulePath,
} from './moduleRegistry';

const RECENT_MODULES_KEY = 'medflow:recent-modules';

function lazyNamed<T extends Record<string, React.ComponentType<any>>>(
  loader: () => Promise<T>,
  exportName: keyof T,
) {
  return lazy(async () => {
    const mod = await loader();
    return { default: mod[exportName] };
  });
}

const MODULE_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'AI Destekli Modüller': lazyNamed(() => import('./components/AIModules'), 'AIModules'),
  'İş Zekası (BI Dashboard)': lazyNamed(() => import('./components/Dashboard'), 'Dashboard'),
  'İş Zekası ve İleri Raporlama': lazyNamed(() => import('./components/AdvancedReporting'), 'AdvancedReporting'),
  'Kalite ve Risk Yönetim': lazyNamed(() => import('./components/QualityRiskManagement'), 'QualityRiskManagement'),
  'Hasta Memnuniyeti': lazyNamed(() => import('./components/PatientSatisfaction'), 'PatientSatisfaction'),
  'Hasta Kayıt ve Kabul': lazyNamed(() => import('./components/PatientRegistration'), 'PatientRegistration'),
  'Randevu Yönetimi': lazyNamed(() => import('./components/AppointmentManagement'), 'AppointmentManagement'),
  'Danışma Modülü': lazyNamed(() => import('./components/InformationDesk'), 'InformationDesk'),
  'Elektronik Hasta Dosyası': lazyNamed(() => import('./components/ElectronicHealthRecord'), 'ElectronicHealthRecord'),
  'Poliklinik Muayene': lazyNamed(() => import('./components/OutpatientClinic'), 'OutpatientClinic'),
  'Yatan Hasta / Servis': lazyNamed(() => import('./components/InpatientWard'), 'InpatientWard'),
  'Acil Servis Yönetimi': lazyNamed(() => import('./components/EmergencyRoom'), 'EmergencyRoom'),
  'Ameliyathane Yönetimi': lazyNamed(() => import('./components/OperatingRoom'), 'OperatingRoom'),
  'Laboratuvar (LIS)': lazyNamed(() => import('./components/LaboratoryLIS'), 'LaboratoryLIS'),
  'Radyoloji (RIS + PACS)': lazyNamed(() => import('./components/RadiologyPACS'), 'RadiologyPACS'),
  'Yoğun Bakım Bilgi Sistemi': lazyNamed(() => import('./components/IntensiveCareUnit'), 'IntensiveCareUnit'),
  'Hemşirelik Bakım': lazyNamed(() => import('./components/NursingCare'), 'NursingCare'),
  'Fizik Tedavi': lazyNamed(() => import('./components/PhysicalTherapy'), 'PhysicalTherapy'),
  'Konsültasyon': lazyNamed(() => import('./components/ConsultationModule'), 'ConsultationModule'),
  'Sağlık Kurulu': lazyNamed(() => import('./components/HealthBoard'), 'HealthBoard'),
  'Eczane ve İlaç': lazyNamed(() => import('./components/PharmacyModule'), 'PharmacyModule'),
  'Kan Bankası': lazyNamed(() => import('./components/BloodBankModule'), 'BloodBankModule'),
  'Patoloji & Mikrobiyoloji': lazyNamed(() => import('./components/PathologyModule'), 'PathologyModule'),
  'Sterilizasyon (MSÜ)': lazyNamed(() => import('./components/SterilizationModule'), 'SterilizationModule'),
  'Diyet ve İaşe': lazyNamed(() => import('./components/DietModule'), 'DietModule'),
  'Enfeksiyon Kontrol': lazyNamed(() => import('./components/InfectionControlModule'), 'InfectionControlModule'),
  'Faturalama ve Gelir': lazyNamed(() => import('./components/BillingModule'), 'BillingModule'),
  'Vezne / Tahsilat': lazyNamed(() => import('./components/CashierModule'), 'CashierModule'),
  'Kurumsal Anlaşma': lazyNamed(() => import('./components/ContractModule'), 'ContractModule'),
  'Stok ve Malzeme': lazyNamed(() => import('./components/InventoryModule'), 'InventoryModule'),
  'Tıbbi Cihaz Takip': lazyNamed(() => import('./components/MedicalDeviceModule'), 'MedicalDeviceModule'),
  'Doküman Yönetim (EBYS)': lazyNamed(() => import('./components/DocumentModule'), 'DocumentModule'),
  'RTLS Konum Takibi': lazyNamed(() => import('./components/RTLSModule'), 'RTLSModule'),
  'İnsan Kaynakları': lazyNamed(() => import('./components/HRModule'), 'HRModule'),
  'Nöbet Yönetimi': lazyNamed(() => import('./components/ShiftModule'), 'ShiftModule'),
};

function readRecentModules() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(RECENT_MODULES_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === 'string' && !!getModuleByName(item));
  } catch {
    return [];
  }
}

function AppLoadingState({ activeModule }: { activeModule: string }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 animate-pulse">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-4 w-40 rounded bg-slate-100" />
        <div className="mt-4 h-8 w-80 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-64 rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="h-4 w-36 rounded bg-slate-100" />
          <div className="mt-5 h-64 rounded-2xl bg-slate-100" />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-28 rounded bg-slate-100" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 rounded-2xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
      <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
        {activeModule} modülü yükleniyor
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const routeModule = useMemo(() => getModuleByPath(location.pathname), [location.pathname]);
  const activeModule = routeModule?.name ?? DEFAULT_MODULE;
  const [recentModules, setRecentModules] = useState<string[]>(() =>
    [DEFAULT_MODULE, ...readRecentModules()].filter((item, index, arr) => arr.indexOf(item) === index).slice(0, 6),
  );

  const handleSelectModule = useCallback((moduleName: string) => {
    if (getModuleByName(moduleName)) {
      navigate(getModulePath(moduleName));
    }
  }, [navigate]);

  useEffect(() => {
    if (!routeModule) {
      navigate(getModulePath(DEFAULT_MODULE), { replace: true });
    }
  }, [navigate, routeModule]);

  useEffect(() => {
    setRecentModules((previous) => {
      const next = [activeModule, ...previous.filter((item) => item !== activeModule)].slice(0, 6);
      window.localStorage.setItem(RECENT_MODULES_KEY, JSON.stringify(next));
      return next;
    });
  }, [activeModule]);

  const ActiveModuleComponent = useMemo(() => MODULE_COMPONENTS[activeModule], [activeModule]);

  const sharedModuleProps =
    activeModule === DEFAULT_MODULE
      ? { onNavigateToModule: handleSelectModule }
      : {};

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeModule={activeModule}
        setActiveModule={handleSelectModule}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          toggleSidebar={() => setSidebarOpen((open) => !open)}
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          recentModules={recentModules}
        />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={<AppLoadingState activeModule={activeModule} />}>
            <ActiveModuleComponent {...sharedModuleProps} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
