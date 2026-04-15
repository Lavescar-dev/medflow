import React, { useState } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, FileSearch, 
  Activity, Clock, User, Info, FileText
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const incidents = [
  { id: 'OLB-260407-1', type: 'İlaç Hatası', risk: 'Yüksek', status: 'Açık', desc: 'Acil serviste yanlış doz (Clexane 6000 yerine 4000) uygulaması.', reporter: 'Hem. A. Yılmaz', date: '07 Nis 2026, 09:15' },
  { id: 'OLB-260406-3', type: 'Hasta Düşmesi', risk: 'Orta', status: 'İnceleniyor', desc: 'Yatan hasta (YBÜ-2) banyoda kayarak düştü, kalça travması şüphesi.', reporter: 'Hem. B. Demir', date: '06 Nis 2026, 22:30' },
  { id: 'OLB-260405-2', type: 'Kan Transfüzyon', risk: 'Kritik', status: 'Kapatıldı', desc: 'Dahiliye servisinde yanlış etiketli kan torbası fark edilerek durduruldu.', reporter: 'Dr. M. Kaya', date: '05 Nis 2026, 14:20' },
  { id: 'OLB-260404-1', type: 'Kesici Alet Yarl.', risk: 'Düşük', status: 'Kapatıldı', desc: 'Ameliyathane 4, bistüri ucu ile parmak kesisi (yüzeyel).', reporter: 'Tek. C. Şahin', date: '04 Nis 2026, 11:45' },
];

const audits = [
  { name: 'SKS İç Denetimi (Yarı Yıl)', dept: 'Tüm Hastane', date: '15 Mayıs 2026', status: 'Planlandı', progress: 0 },
  { name: 'JCI Akreditasyon Ön Değerlendirme', dept: 'Klinik Hizmetler', date: '02 Haziran 2026', status: 'Hazırlık Aşamasında', progress: 45 },
  { name: 'Enfeksiyon Kontrol Ziyareti', dept: 'Yenidoğan YBÜ', date: '10 Nisan 2026', status: 'Gecikmeli', progress: 90 },
];

export function QualityRiskManagement() {
  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Kritik': return 'bg-red-100 text-red-700 border-red-200';
      case 'Yüksek': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Orta': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Düşük': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kalite ve Risk Yönetimi</h2>
          <p className="text-sm text-slate-500">Olay bildirimleri (İKS), JCI/SKS uyumluluğu ve risk analizleri.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            <AlertTriangle size={16} /> Yeni Olay Bildirimi (Kırmızı Kod)
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Açık Olay Bildirimi" value="12" desc="Son 30 günde çözülmemiş" icon={AlertTriangle} color="red" />
        <KpiCard title="SKS Uyum Skoru" value="%94.2" desc="Hedef: %95.0" icon={CheckCircle2} color="emerald" />
        <KpiCard title="JCI Hazırlık" value="%82" desc="Eksik indikatör: 14" icon={Activity} color="blue" />
        <KpiCard title="Yaklaşan Denetim" value="3" desc="Önümüzdeki 60 gün içinde" icon={FileSearch} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Reports Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={18} />
              Son Olay Bildirimleri (İstenmeyen Olaylar)
            </h3>
            <div className="flex gap-2">
              <select className="bg-white border border-slate-200 rounded-lg text-sm px-2 py-1.5 text-slate-700 outline-none">
                <option>Tümü</option>
                <option>Açık</option>
                <option>İnceleniyor</option>
              </select>
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 font-mono">{inc.id}</span>
                    <h4 className="font-semibold text-slate-800 text-sm">{inc.type}</h4>
                    <span className={twMerge("px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider", getRiskColor(inc.risk))}>
                      {inc.risk} RİSK
                    </span>
                    <span className={twMerge(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      inc.status === 'Açık' ? 'bg-red-50 text-red-600' : 
                      inc.status === 'İnceleniyor' ? 'bg-amber-50 text-amber-600' : 
                      'bg-emerald-50 text-emerald-600'
                    )}>
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{inc.desc}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1"><User size={14} /> {inc.reporter}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {inc.date}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4">
                  <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors w-full sm:w-auto text-center">
                    Kök Neden Analizi (RCA)
                  </button>
                  <button className="text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 transition-colors w-full sm:w-auto text-center">
                    Detay
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Tüm Bildirimleri Görüntüle (24)</button>
          </div>
        </div>

        {/* Audits & Accreditation */}
        <div className="flex flex-col gap-6">
          {/* Audits Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <FileSearch className="text-blue-500" size={18} />
                Denetim Takvimi
              </h3>
            </div>
            <div className="p-5 space-y-6">
              {audits.map((audit, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm text-slate-800 leading-tight">{audit.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{audit.dept} • {audit.date}</p>
                    </div>
                    <span className={twMerge(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded",
                      audit.status === 'Gecikmeli' ? 'bg-red-100 text-red-700' :
                      audit.status === 'Planlandı' ? 'bg-slate-100 text-slate-600' :
                      'bg-blue-100 text-blue-700'
                    )}>
                      {audit.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={twMerge("h-1.5 rounded-full", audit.status === 'Gecikmeli' ? 'bg-red-500' : 'bg-blue-500')} 
                      style={{ width: `${audit.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Quick Links / Risk Matrix Visual Mockup */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
              <Activity size={120} className="-mr-4 -mt-4" />
            </div>
            <h3 className="font-semibold text-lg mb-2 relative z-10">Kurumsal Risk Matrisi</h3>
            <p className="text-slate-300 text-sm mb-4 relative z-10">
              Klinik ve idari birimlerin tanımlanmış risk faktörleri güncellendi (Nisan 2026).
            </p>
            <div className="grid grid-cols-2 gap-2 relative z-10">
              <button className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg p-3 text-left transition-colors flex flex-col justify-between h-20 group">
                <FileText className="text-blue-400 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-xs font-medium">Matrisi İncele</span>
              </button>
              <button className="bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg p-3 text-left transition-colors flex flex-col justify-between h-20 group">
                <Info className="text-emerald-400 group-hover:scale-110 transition-transform" size={20} />
                <span className="text-xs font-medium">İndikatörler</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, desc, icon: Icon, color }: { title: string, value: string, desc: string, icon: any, color: 'red' | 'emerald' | 'blue' | 'amber' }) {
  const colorMap = {
    red: 'bg-red-50 text-red-600 border-red-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100'
  };

  const iconColor = {
    red: 'text-red-500',
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    amber: 'text-amber-500'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
      <div className={twMerge("p-3 rounded-xl border", colorMap[color])}>
        <Icon size={24} className={iconColor[color]} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        <p className="text-xs text-slate-400 mt-1">{desc}</p>
      </div>
    </div>
  );
}
