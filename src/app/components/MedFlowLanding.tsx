import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  FileClock,
  Fingerprint,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import { DEFAULT_MODULE, MODULE_CATEGORIES } from '../moduleRegistry';

const heroSignals: Array<{
  icon: LucideIcon;
  label: string;
  value: string;
}> = [
  {
    icon: ShieldCheck,
    label: 'Tek hasta bağlamı',
    value: 'Kabul, randevu ve klinik karar aynı kayıt çizgisinde korunur.',
  },
  {
    icon: Microscope,
    label: 'Teşhis uyumu',
    value: 'LIS, RIS, PACS ve elektronik hasta dosyası aynı veri omurgasına bağlı kalır.',
  },
  {
    icon: CreditCard,
    label: 'Yönetim görünürlüğü',
    value: 'Gelir, stok ve kalite sinyalleri operasyonla aynı düzlemde izlenir.',
  },
];

const operatingModel: Array<{
  icon: LucideIcon;
  title: string;
  body: string;
}> = [
  {
    icon: Fingerprint,
    title: 'Hasta kabulden taburculuğa tek akış',
    body: 'Kimlik doğrulama, provizyon, randevu, muayene, tetkik ve hasta dosyası aynı operasyon hattında ilerler.',
  },
  {
    icon: Stethoscope,
    title: 'Klinik ekipler aynı tempoda kalır',
    body: 'Poliklinik, servis, acil, ameliyathane, hemşirelik ve yoğun bakım aynı çalışma mantığı içinde açılır.',
  },
  {
    icon: Microscope,
    title: 'Teşhis yüzeyleri merkezden kopmaz',
    body: 'Laboratuvar, radyoloji, patoloji ve kan bankası sonuçları klinik karara eşzamanlı bağlanır.',
  },
  {
    icon: CreditCard,
    title: 'Finans ve idari katman geriden gelmez',
    body: 'Faturalama, tahsilat, stok, cihaz, doküman ve kalite operasyonel kararla aynı ürün içinde kalır.',
  },
];

const heroWorkflow = [
  {
    step: '01',
    title: 'Hasta kayıt',
    detail: 'Kimlik, provizyon ve kabul ilk temas anında netleşir.',
  },
  {
    step: '02',
    title: 'Randevu yönetimi',
    detail: 'Slot, kuyruk ve gün içi yoğunluk tek plan içinde görünür olur.',
  },
  {
    step: '03',
    title: 'Elektronik hasta dosyası',
    detail: 'Muayene, tetkik ve reçete tek klinik zaman çizgisinde kalır.',
  },
];

const scenarioSteps = [
  {
    step: '01',
    module: 'Hasta Kayıt ve Kabul',
    title: 'Kimlik, kurum ve kabul akışı ilk bankoda netleşir.',
    body: 'Hasta ilk girişte doğrulanır, ödeme ve kurum bilgisi bağlanır, klinik kayıt dağılmadan başlar.',
  },
  {
    step: '02',
    module: 'Randevu Yönetimi',
    title: 'Banko, online ve MHRS kaynakları tek sıra mantığında akar.',
    body: 'Slot planı, bekleme süresi ve gün içi yoğunluk aynı operasyon ekranında takip edilir.',
  },
  {
    step: '03',
    module: 'Elektronik Hasta Dosyası',
    title: 'Hekim kararı, tetkik ve reçete tek hasta zaman çizgisinde kalır.',
    body: 'Muayene, laboratuvar, radyoloji ve epikriz bağlamı aynı klinik yüzeyde korunur.',
  },
];

const quickEntries: Array<{
  label: string;
  module: string;
  icon: LucideIcon;
  detail: string;
}> = [
  {
    label: 'Yönetim paneli',
    module: 'İş Zekası (BI Dashboard)',
    icon: Activity,
    detail: 'Günlük KPI, doluluk ve kritik operasyon sinyalleri',
  },
  {
    label: 'Hasta kayıt',
    module: 'Hasta Kayıt ve Kabul',
    icon: Fingerprint,
    detail: 'Kimlik, provizyon ve kabul akışının başlangıcı',
  },
  {
    label: 'Randevu yönetimi',
    module: 'Randevu Yönetimi',
    icon: CalendarDays,
    detail: 'Slot, kuyruk ve gün içi yoğunluk takibi',
  },
  {
    label: 'Elektronik hasta dosyası',
    module: 'Elektronik Hasta Dosyası',
    icon: HeartPulse,
    detail: 'Klinik zaman çizgisi, reçete ve tetkik bağlamı',
  },
];

interface MedFlowLandingProps {
  onOpenAccess: (moduleName: string) => void;
}

export function MedFlowLanding({ onOpenAccess }: MedFlowLandingProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative isolate min-h-[92svh] overflow-hidden bg-slate-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1800&q=80"
          alt="Hastane operasyon merkezinde birlikte çalışan sağlık ekibi"
          className="medflow-hero-pan absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.94)_0%,rgba(2,6,23,0.8)_38%,rgba(2,6,23,0.32)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(37,99,235,0.28),transparent_30%),radial-gradient(circle_at_78%_78%,rgba(16,185,129,0.16),transparent_28%)]" />

        <div className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <button
              type="button"
              onClick={() => onOpenAccess(DEFAULT_MODULE)}
              className="flex items-center gap-3 text-left text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-950/30">
                <Activity size={20} className="stroke-[2.5]" />
              </span>
              <span>
                <span className="block text-lg font-bold tracking-tight">MedFlow HBYS</span>
                <span className="block text-xs font-medium uppercase tracking-[0.24em] text-blue-100/80">
                  Clinic Workspace
                </span>
              </span>
            </button>

            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                onClick={() => onOpenAccess('Hasta Kayıt ve Kabul')}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                  Önerilen Rota
              </button>
              <button
                type="button"
                onClick={() => onOpenAccess(DEFAULT_MODULE)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                  Yönetim Paneli
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl items-end px-6 pb-14 pt-28">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.72fr)] lg:items-end">
            <div className="max-w-3xl">
              <p className="medflow-fade-up inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.28em] text-blue-100/85">
                <span className="medflow-signal-dot h-2 w-2 rounded-full bg-emerald-400" />
                Hastane Bilgi Yönetim Sistemi
              </p>
              <h1 className="medflow-fade-up medflow-delay-1 mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Hasta kabul, randevu ve klinik karar aynı operasyon omurgasında ilerler.
              </h1>
              <p className="medflow-fade-up medflow-delay-2 mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
                MedFlow HBYS; hasta hizmetleri, hekim akışı, teşhis yüzeyleri ve yönetsel kontrolü tek
                çalışma alanında toplar.
              </p>

              <div className="medflow-fade-up medflow-delay-3 mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onOpenAccess('Hasta Kayıt ve Kabul')}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  Önerilen Rotayı Aç
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAccess(DEFAULT_MODULE)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
                >
                  Yönetim Panelini Gör
                </button>
              </div>
            </div>

            <div className="medflow-fade-up medflow-delay-4 grid gap-4">
              {heroSignals.map((item) => (
                <div key={item.label} className="border-t border-white/18 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-blue-100">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/12 bg-slate-950/52 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-100/78">
              Önerilen demo rotası
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {heroWorkflow.map((item) => (
                <div key={item.step} className="border-t border-white/12 pt-4 md:border-t-0 md:border-l md:border-white/12 md:pl-4 md:first:border-l-0 md:first:pl-0">
                  <div className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-200">
                    {item.step}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="urun" className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.95fr)]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Ürün omurgası</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Operasyon, karar ve gelir akışı aynı ürün mantığında ilerler.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Yönetim ekibi günlük görünürlüğü kaybetmez; klinik ekip hasta bağlamını kaybetmez; idari
              ekip gelir ve kaynak bilgisini ayrı araçlara bölmez.
            </p>

            <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {operatingModel.map((item) => (
                <div key={item.title} className="grid gap-4 py-5 sm:grid-cols-[auto_1fr] sm:items-start">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200">
            {MODULE_CATEGORIES.map((category) => (
              <div key={category.category} className="border-b border-slate-200 py-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-semibold text-slate-900">{category.category}</h3>
                  <span className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
                    {category.items.length} modül
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {category.items.slice(0, 4).map((item) => item.name).join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="akislar" className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1400&q=80"
              alt="Hastane bankosu ve klinik yönlendirme alanı"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.2)_46%,rgba(15,23,42,0.86)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-100">
                Önerilen portfolyo senaryosu
              </p>
              <h2 className="mt-3 max-w-md text-2xl font-black tracking-tight sm:text-3xl">
                Hasta Kabul - Randevu - EHR çizgisi ürünün derinliğini en hızlı gösterir.
              </h2>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Ana senaryo</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              İlk bakışta ürünün ciddiyetini gösteren akışı burada sabitliyoruz.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Bu rota, hasta hizmetleriyle klinik kararı tek bağlamda gösterir. Portfolyoda en hızlı güven
              oluşturan çekirdek yüzey burası.
            </p>

            <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {scenarioSteps.map((step) => (
                <article key={step.step} className="py-5">
                  <div className="grid gap-4 sm:grid-cols-[56px_1fr]">
                    <div className="text-lg font-black tracking-tight text-blue-600">{step.step}</div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                        {step.module}
                      </p>
                      <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{step.title}</h3>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{step.body}</p>
                      <button
                        type="button"
                        onClick={() => onOpenAccess(step.module)}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                      >
                        Bu adımdan aç
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="giris" className="bg-slate-950 py-16 text-white lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">Çalışma alanı girişi</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              İster yönetim panelinden başla, ister klinik akıştan gir.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Tüm modüller aynı oturum mantığında açılır. Kabul, randevu ve elektronik hasta dosyası aynı
              klinik omurgada kalır.
            </p>

            <div className="mt-8 space-y-3">
              {[
                { icon: Users, label: 'Hasta hizmetleri', value: 'Kabul, danışma, randevu ve dosya' },
                { icon: BedDouble, label: 'Klinik katman', value: 'Poliklinik, servis, ameliyathane ve YBÜ' },
                { icon: FileClock, label: 'İdari kontrol', value: 'Fatura, stok, sözleşme, kalite ve EBYS' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 border-t border-white/10 py-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-200">
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

          <div className="grid gap-3 sm:grid-cols-2">
            {quickEntries.map((entry) => (
              <button
                key={entry.label}
                type="button"
                onClick={() => onOpenAccess(entry.module)}
                className="group border border-white/12 bg-white/6 p-4 text-left transition hover:border-blue-300/40 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/16 text-blue-200">
                    <entry.icon size={20} />
                  </div>
                  <ArrowRight
                    size={18}
                    className="mt-1 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-blue-200"
                  />
                </div>
                <div className="mt-8 text-sm font-semibold text-white">{entry.label}</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{entry.detail}</p>
              </button>
            ))}

            <button
              type="button"
              onClick={() => onOpenAccess('Hasta Kayıt ve Kabul')}
              className="sm:col-span-2 flex items-center justify-between gap-4 border border-blue-400/40 bg-blue-600 px-5 py-4 text-left text-white transition hover:bg-blue-500"
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 size={18} />
                  Önerilen demo rotasını başlat
                </div>
                <p className="mt-2 text-sm leading-6 text-blue-50">
                  Hasta kabulden başla, randevu ve elektronik hasta dosyasıyla aynı bağlamda ilerle.
                </p>
              </div>
              <ArrowRight size={20} className="shrink-0" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
