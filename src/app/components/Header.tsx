import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  HeartPulse,
  Info,
  Menu,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { MODULES, getModuleByName } from '../moduleRegistry';
import { usePatientContext } from '../patientContext';

interface HeaderProps {
  toggleSidebar: () => void;
  activeModule: string;
  onSelectModule: (module: string) => void;
  recentModules: string[];
}

interface Notification {
  id: number;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
  module: string;
  targetModule: string;
}

const mockNotifications: Notification[] = [
  { id: 1, type: 'critical', title: 'PANİK DEĞER', message: 'Mehmet Demir — Kreatinin: 2.8, K: 5.8 mEq/L. Klinisyen bilgilendirilmeli.', time: '2 dk önce', read: false, module: 'Laboratuvar', targetModule: 'Laboratuvar (LIS)' },
  { id: 2, type: 'critical', title: 'Acil Kan İsteği', message: 'Ameliyathane Salon 1 — CABG operasyonu için 2Ü ES A Rh(+) acil istek.', time: '5 dk önce', read: false, module: 'Kan Bankası', targetModule: 'Kan Bankası' },
  { id: 3, type: 'warning', title: 'Stok Kritik', message: 'Parasetamol 10mg/mL 100mL — Mevcut: 8 (Min: 30). Acil sipariş gerekli.', time: '15 dk önce', read: false, module: 'Eczane', targetModule: 'Eczane ve İlaç' },
  { id: 4, type: 'warning', title: 'Cihaz Bakım Yaklaşıyor', message: 'USG (GE LOGIQ E10s) — Bakım tarihi: 20.04.2026. Randevu alınmalı.', time: '30 dk önce', read: false, module: 'Tıbbi Cihaz', targetModule: 'Tıbbi Cihaz Takip' },
  { id: 5, type: 'warning', title: 'İlaç Etkileşimi', message: 'Mehmet Demir — Ceftriaxone + Kalsiyum IV: Presipitasyon riski.', time: '35 dk önce', read: true, module: 'Eczane', targetModule: 'Eczane ve İlaç' },
  { id: 6, type: 'info', title: 'MEDULA Provizyon', message: 'Fatma Şahin — Fatura MEDULA\'ya gönderildi.', time: '45 dk önce', read: true, module: 'Faturalama', targetModule: 'Faturalama ve Gelir' },
  { id: 7, type: 'success', title: 'Sterilizasyon Tamamlandı', message: 'Otoklav 1 — Çevrim C-2026-0407-001 başarılı. BI: Negatif.', time: '1 saat önce', read: true, module: 'Sterilizasyon', targetModule: 'Sterilizasyon (MSÜ)' },
  { id: 8, type: 'warning', title: 'Triaj Bekleme Aşımı', message: 'Acil Servis — Sarı alan ortalama bekleme 42 dk (hedef: <30 dk).', time: '1 saat önce', read: true, module: 'Acil Servis', targetModule: 'Acil Servis Yönetimi' },
  { id: 9, type: 'info', title: 'Yeni Konsültasyon', message: 'İbrahim Kara — Nöroloji konsültasyonu istendi (SVO şüphesi).', time: '2 saat önce', read: true, module: 'Konsültasyon', targetModule: 'Konsültasyon' },
  { id: 10, type: 'critical', title: 'MRSA İzolat', message: 'Hatice Arslan — Balgam kültüründe MRSA izole edildi. Temas izolasyonu başlatıldı.', time: '3 saat önce', read: true, module: 'Enfeksiyon Kontrol', targetModule: 'Enfeksiyon Kontrol' },
  { id: 11, type: 'info', title: 'Sözleşme Uyarısı', message: 'ABC Teknoloji A.Ş. sözleşmesi 31 Mayıs\'ta sona erecek. Yenileme gerekli.', time: '4 saat önce', read: true, module: 'Kurumsal Anlaşma', targetModule: 'Kurumsal Anlaşma' },
  { id: 12, type: 'success', title: 'Rapor Onaylandı', message: 'Zeynep Kaya — USG Tüm Batın raporu onaylandı ve teslim edildi.', time: '5 saat önce', read: true, module: 'Radyoloji', targetModule: 'Radyoloji (RIS + PACS)' },
];

const typeConfig: Record<Notification['type'], { icon: React.ReactNode; border: string }> = {
  critical: { icon: <HeartPulse size={16} className="text-red-500" />, border: 'border-l-red-500' },
  warning: { icon: <AlertTriangle size={16} className="text-amber-500" />, border: 'border-l-amber-500' },
  info: { icon: <Info size={16} className="text-blue-500" />, border: 'border-l-blue-500' },
  success: { icon: <CheckCircle2 size={16} className="text-emerald-500" />, border: 'border-l-emerald-500' },
};

export function Header({ toggleSidebar, activeModule, onSelectModule, recentModules }: HeaderProps) {
  const { currentPatient, clearCurrentPatient } = usePatientContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const searchResults = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR');

    if (!normalizedQuery) {
      return recentModules
        .map((moduleName) => getModuleByName(moduleName))
        .filter((module): module is NonNullable<typeof module> => !!module);
    }

    return MODULES.filter((module) => {
      const haystack = [module.name, module.category, module.description, ...module.searchTerms]
        .join(' ')
        .toLocaleLowerCase('tr-TR');
      return haystack.includes(normalizedQuery);
    }).slice(0, 10);
  }, [query, recentModules]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setShowNavigator(true);
      }

      if (event.key === 'Escape') {
        setShowNavigator(false);
      }

      if (event.key === 'Enter' && showNavigator && searchResults[0]) {
        event.preventDefault();
        handleSelectModule(searchResults[0].name);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchResults, showNavigator]);

  useEffect(() => {
    if (!showNavigator) {
      setQuery('');
      return;
    }

    window.setTimeout(() => {
      commandInputRef.current?.focus();
    }, 10);
  }, [showNavigator]);

  const markAllRead = () => setNotifications((previous) => previous.map((notification) => ({ ...notification, read: true })));

  const handleSelectModule = (moduleName: string) => {
    onSelectModule(moduleName);
    setShowNavigator(false);
    setQuery('');
  };

  const handleNotificationClick = (notificationId: number, targetModule: string) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification,
      ),
    );
    onSelectModule(targetModule);
    setShowNotifications(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 flex-none items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm/50 lg:px-8">
        <div className="flex flex-1 items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="rounded-lg p-2 -ml-2 text-slate-500 transition-colors hover:bg-slate-100 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="hidden items-center text-sm font-medium text-slate-500 sm:flex">
            <span>MedCore Plus</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-semibold text-slate-800">{activeModule}</span>
          </div>
        </div>

        <div className="flex flex-none items-center gap-2 lg:gap-4">
          {currentPatient && (
            <div className="hidden items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-left shadow-sm xl:flex">
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                <HeartPulse size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-600">
                  Aktif Hasta Bağlamı
                </div>
                <div className="max-w-[180px] truncate text-xs font-semibold text-slate-800">
                  {currentPatient.fullName}
                </div>
                <div className="max-w-[180px] truncate text-[11px] text-slate-500">
                  {currentPatient.department ?? currentPatient.source ?? 'Klinik akış bağlı'}
                </div>
              </div>
              <button
                type="button"
                onClick={clearCurrentPatient}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
                title="Hasta bağlamını temizle"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowNavigator(true)}
            className="relative hidden h-10 w-64 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 transition hover:border-blue-200 hover:bg-white hover:text-slate-700 md:flex lg:w-96"
          >
            <Search size={16} className="text-slate-400" />
            <span className="ml-3 truncate">Modül, işlem veya klinik alan ara...</span>
            <span className="ml-auto inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium uppercase text-slate-400">
              <span className="text-xs">⌘</span>K
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowNavigator(true)}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
          >
            <Search size={20} />
          </button>

          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setShowNotifications((open) => !open)}
              className="group relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100"
            >
              <Bell size={20} className="transition-colors group-hover:text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-white bg-red-500 text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 flex max-h-[520px] w-96 flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex flex-none items-center justify-between border-b border-slate-100 p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">Operasyon Bildirimleri</h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[11px] font-semibold text-blue-600 hover:underline">
                        Tümünü okundu yap
                      </button>
                    )}
                    <button onClick={() => setShowNotifications(false)} className="rounded p-1 hover:bg-slate-100">
                      <X size={16} className="text-slate-400" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id, notification.targetModule)}
                      className={twMerge(
                        'cursor-pointer border-b border-l-4 border-slate-50 p-3 transition-colors hover:bg-slate-50',
                        typeConfig[notification.type].border,
                        !notification.read && 'bg-blue-50/30',
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex-shrink-0">{typeConfig[notification.type].icon}</div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{notification.title}</span>
                            {!notification.read && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />}
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600">{notification.message}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{notification.time}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] font-semibold text-blue-500">{notification.module}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex-none border-t border-slate-100 p-3 text-center">
                  <button className="text-xs font-semibold text-blue-600 hover:underline">
                    Tüm Bildirimleri Görüntüle
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <Settings size={20} />
          </button>

          <div className="flex cursor-pointer items-center gap-2 rounded-lg border-l border-slate-200 p-1.5 pl-2 transition-colors hover:bg-slate-50">
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop"
              alt="Doctor profile"
              className="h-8 w-8 rounded-full border border-slate-200 bg-slate-100 object-cover"
            />
            <ChevronDown size={16} className="hidden text-slate-400 sm:block" />
          </div>
        </div>
      </header>

      {showNavigator && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/25 px-4 pt-24 backdrop-blur-[2px]">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                  ref={commandInputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Modül, ekip, işlem ya da klinik alan ara..."
                  className="h-full w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
                />
                <button onClick={() => setShowNavigator(false)} className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {!query && recentModules.length > 0 && (
                <div className="px-2 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Son kullanılan modüller
                </div>
              )}

              <div className="space-y-1">
                {searchResults.map((module) => (
                  <button
                    key={module.name}
                    onClick={() => handleSelectModule(module.name)}
                    className={twMerge(
                      'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition',
                      module.name === activeModule
                        ? 'bg-blue-50 ring-1 ring-blue-200'
                        : 'hover:bg-slate-50',
                    )}
                  >
                    <div className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm">
                      <module.icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-slate-800">{module.name}</span>
                        {module.name === activeModule && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{module.description}</p>
                      <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        {module.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {searchResults.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center">
                  <Search size={18} className="text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-700">Sonuç bulunamadı</p>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    Modül adını, klinik alanı veya örnek bir iş akışını deneyin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
