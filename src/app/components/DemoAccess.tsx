import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Fingerprint,
  Layers3,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import type { DemoAccessDraft, DemoSession } from '../demoAccess';

const launchSteps = [
  'Çalışma alanı ayrılıyor',
  'Klinik veri katmanı eşleniyor',
  'Modül izinleri hazırlanıyor',
  'HBYS paneli açılıyor',
];

const routeSteps = ['Hasta kabul', 'Randevu', 'Elektronik hasta dosyası'];

const roleOptions = [
  'Hastane Yönetimi',
  'Başhekimlik',
  'Operasyon ve Hasta Hizmetleri',
  'Bilgi İşlem / IT',
  'Finans ve İdari İşler',
];

interface DemoAccessProps {
  targetModuleName: string;
  targetContextLabel: string;
  activeSession: DemoSession | null;
  onBack: () => void;
  onContinueActiveSession: () => void;
  onResetSession: () => void;
  onAccessGranted: (draft: DemoAccessDraft) => void;
}

export function DemoAccess({
  targetModuleName,
  targetContextLabel,
  activeSession,
  onBack,
  onContinueActiveSession,
  onResetSession,
  onAccessGranted,
}: DemoAccessProps) {
  const [form, setForm] = useState<DemoAccessDraft>({
    name: activeSession?.name ?? '',
    email: activeSession?.email ?? '',
    role: activeSession?.role ?? roleOptions[0],
    organization: activeSession?.organization ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof DemoAccessDraft, string>>>({});
  const [isLaunching, setIsLaunching] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLaunching) {
      return;
    }

    setProgress(8);
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(interval);
          return 100;
        }

        const next = current + Math.max(6, (100 - current) * 0.18);
        return Math.min(100, Math.round(next));
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [isLaunching]);

  useEffect(() => {
    if (!isLaunching || progress < 100) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onAccessGranted(form);
    }, 260);

    return () => window.clearTimeout(timeout);
  }, [form, isLaunching, onAccessGranted, progress]);

  const currentStep = useMemo(() => {
    const stepIndex = Math.min(launchSteps.length - 1, Math.floor((progress / 100) * launchSteps.length));
    return launchSteps[stepIndex];
  }, [progress]);

  const validate = () => {
    const nextErrors: Partial<Record<keyof DemoAccessDraft, string>> = {};

    if (form.name.trim().length < 3) {
      nextErrors.name = 'Ad soyad gerekli';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Geçerli e-posta gerekli';
    }

    if (form.role.trim().length < 3) {
      nextErrors.role = 'Rol seçimi gerekli';
    }

    if (form.organization.trim().length < 2) {
      nextErrors.organization = 'Kurum alanı gerekli';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLaunching(true);
  };

  if (isLaunching) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1800&q=80"
          alt="Hastane koridorunda hazırlık yapan sağlık ekibi"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.88)_0%,rgba(2,6,23,0.95)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(37,99,235,0.22),transparent_30%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
                Çalışma alanı hazırlanıyor
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                MedFlow oturumu seçilen akışla birlikte açılıyor.
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-300">
                Hedef alan: {targetModuleName}. Klinik bağlam, modül erişimi ve oturum yapısı aynı
                senaryo katmanında hazırlanıyor.
              </p>
            </div>

            <div className="border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.32)] backdrop-blur-md sm:p-8">
              <div className="flex items-center gap-3 text-blue-200">
                <LoaderCircle size={22} className="animate-spin" />
                <span className="text-sm font-semibold">Kurumsal oturum hazırlanıyor</span>
              </div>

              <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500 transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                <span>{currentStep}</span>
                <span>%{progress}</span>
              </div>

              <div className="mt-8 space-y-3">
                {launchSteps.map((step, index) => {
                  const threshold = ((index + 1) / launchSteps.length) * 100;
                  const done = progress >= threshold;

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 border px-4 py-3 ${
                        done
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100'
                          : 'border-white/10 bg-white/4 text-slate-300'
                      }`}
                    >
                      {done ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
                      <span className="text-sm font-medium">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <img
        src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1800&q=80"
        alt="Dijital hastane operasyon yüzeyi"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.95)_0%,rgba(2,6,23,0.88)_40%,rgba(2,6,23,0.64)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(37,99,235,0.24),transparent_30%)]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(360px,0.86fr)] lg:items-center">
          <div className="max-w-xl">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Tanıtıma dön
            </button>

            <p className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-blue-200">
              Kurumsal erişim
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              MedFlow çalışma alanını aç.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Seçilen modül aynı demo oturumunda hazırlanır. Kabul, randevu ve klinik bağlam tek erişim
              katmanında korunur.
            </p>

            <div className="mt-8">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-100/80">
                <span className="medflow-signal-dot h-2 w-2 rounded-full bg-emerald-400" />
                Önerilen rota
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-white">
                {routeSteps.map((step, index) => (
                  <React.Fragment key={step}>
                    {index > 0 && <ArrowRight size={14} className="text-blue-200/70" />}
                    <span>{step}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="mt-10 divide-y divide-white/12 border-y border-white/12">
              {[
                {
                  icon: ShieldCheck,
                  label: 'Tek oturum yapısı',
                  value: 'Hasta bağlamı, modül erişimi ve operasyon görünürlüğü aynı çalışma alanında korunur.',
                },
                {
                  icon: Layers3,
                  label: 'Seçili modül',
                  value: targetModuleName,
                },
                {
                  icon: LockKeyhole,
                  label: 'Hazırlanan alan',
                  value: targetContextLabel,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 py-4">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-blue-100">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.label}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-300">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/12 bg-[linear-gradient(180deg,rgba(15,23,42,0.88)_0%,rgba(15,23,42,0.8)_100%)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.34)] backdrop-blur-md sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-950/30">
                <Activity size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-white">MedFlow HBYS</p>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-blue-100/80">
                  Çalışma alanı erişimi
                </p>
              </div>
            </div>

            {activeSession && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200">
                      Aktif oturum
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{activeSession.name}</p>
                    <p className="mt-1 text-sm text-emerald-100/90">
                      {activeSession.role} • {activeSession.organization}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={onContinueActiveSession}
                      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                      Devam et
                    </button>
                    <button
                      type="button"
                      onClick={onResetSession}
                      className="rounded-lg border border-white/14 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Yeni oturum
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
                    Ad soyad
                  </span>
                  <div className="flex items-center gap-3 border border-white/12 bg-slate-950/45 px-4 py-3.5 transition focus-within:border-blue-400/40 focus-within:bg-slate-950/60">
                    <Fingerprint size={18} className="text-slate-500" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Örnek: Efe Aras"
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                  {errors.name && <span className="mt-2 block text-xs text-rose-300">{errors.name}</span>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
                    Kurumsal e-posta
                  </span>
                  <div className="flex items-center gap-3 border border-white/12 bg-slate-950/45 px-4 py-3.5 transition focus-within:border-blue-400/40 focus-within:bg-slate-950/60">
                    <Mail size={18} className="text-slate-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="ornek@kurum.com"
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                  {errors.email && <span className="mt-2 block text-xs text-rose-300">{errors.email}</span>}
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
                    Rol
                  </span>
                  <select
                    value={form.role}
                    onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                    className="w-full border border-white/12 bg-slate-950/45 px-4 py-3.5 text-sm text-white transition focus:border-blue-400/40 focus:bg-slate-950/60 focus:outline-none"
                  >
                    {roleOptions.map((option) => (
                      <option key={option} value={option} className="bg-slate-950 text-white">
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.role && <span className="mt-2 block text-xs text-rose-300">{errors.role}</span>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
                    Kurum / ekip
                  </span>
                  <div className="flex items-center gap-3 border border-white/12 bg-slate-950/45 px-4 py-3.5 transition focus-within:border-blue-400/40 focus-within:bg-slate-950/60">
                    <Layers3 size={18} className="text-slate-500" />
                    <input
                      type="text"
                      value={form.organization}
                      onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))}
                      placeholder="Örnek: Özel Hastane Grubu"
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                  {errors.organization && (
                    <span className="mt-2 block text-xs text-rose-300">{errors.organization}</span>
                  )}
                </label>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200">Açılacak akış</p>
                <p className="mt-3 text-base font-semibold text-white">{targetModuleName}</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">{targetContextLabel}</p>
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    Çalışma alanını aç
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center justify-center rounded-lg border border-white/14 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Tanıtıma dön
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
