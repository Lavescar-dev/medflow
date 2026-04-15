import React, { useState } from 'react';
import { Bot, BrainCircuit, Sparkles, Activity, FileText, CalendarClock, Scan, ChevronDown, ChevronUp, Zap, Server, Users } from 'lucide-react';

export function AIModules() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const modules = [
    {
      title: 'Klinik Karar Destek Sistemi (CDS)',
      description: 'Hasta geçmişi ve laboratuvar sonuçlarını analiz ederek olası tanılar ve ilaç/alerji etkileşimleri konusunda uyarır.',
      icon: <BrainCircuit className="h-6 w-6 text-blue-500" />,
      metrics: '98% Doğruluk',
      status: 'Aktif',
      statusColor: 'bg-green-100 text-green-700',
      details: {
        latency: '45ms ortalama',
        uptime: '%99.99',
        activeUsers: '142 Hekim',
        lastUpdate: '2 saat önce'
      }
    },
    {
      title: 'Tıbbi Görüntü Analizi',
      description: 'Röntgen, MR ve BT görüntülerini analiz ederek anormallikleri işaretler ve radyologların iş yükünü hafifletir.',
      icon: <Scan className="h-6 w-6 text-purple-500" />,
      metrics: '1245 Tarama/Gün',
      status: 'Aktif',
      statusColor: 'bg-green-100 text-green-700',
      details: {
        latency: '2.3s / tarama',
        uptime: '%99.95',
        activeUsers: '24 Radyolog',
        lastUpdate: '10 dk önce'
      }
    },
    {
      title: 'Otomatik Tıbbi Sekreter (Scribe)',
      description: 'Doktor ve hasta arasındaki iletişimi dinleyerek otomatik EMR formatında anamnez ve bulguları metne döker.',
      icon: <FileText className="h-6 w-6 text-orange-500" />,
      metrics: 'Ort. 4dk Tasarruf',
      status: 'Aktif',
      statusColor: 'bg-green-100 text-green-700',
      details: {
        latency: 'Gerçek zamanlı (<100ms)',
        uptime: '%99.9',
        activeUsers: '86 Hekim',
        lastUpdate: '5 dk önce'
      }
    },
    {
      title: 'Akıllı Randevu ve Kaynak Optimizasyonu',
      description: 'No-show ihtimallerini tahmin eder, yatak doluluk oranlarını öngörerek kapasite planlaması yapar.',
      icon: <CalendarClock className="h-6 w-6 text-teal-500" />,
      metrics: '15% Verimlilik Artışı',
      status: 'Beta',
      statusColor: 'bg-yellow-100 text-yellow-700',
      details: {
        latency: 'Günlük Batch İşlem',
        uptime: '%99.0',
        activeUsers: '12 Yönetici',
        lastUpdate: 'Dün 23:30'
      }
    }
  ];

  const toggleExpand = (idx: number) => {
    setExpandedId(expandedId === idx ? null : idx);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Bot className="h-7 w-7 text-indigo-600" />
            AI Destekli Modüller
          </h2>
          <p className="text-sm text-slate-500">Yapay zeka tabanlı teşhis, operasyon ve analiz asistanları.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold">Tüm Sistemler Çevrimiçi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 items-start">
        {modules.map((mod, idx) => {
          const isExpanded = expandedId === idx;
          return (
            <div key={idx} className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden ${isExpanded ? 'ring-2 ring-indigo-500/20 border-indigo-300' : 'border-slate-200'}`}>
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-lg transition-colors group-hover:bg-indigo-50">
                    {mod.icon}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${mod.statusColor}`}>
                    {mod.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">{mod.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {mod.description}
                </p>
              </div>
              
              <div className="px-6 pb-6">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Özet Metrik</span>
                    <span className="text-sm font-semibold text-slate-700">{mod.metrics}</span>
                  </div>
                  <button 
                    onClick={() => toggleExpand(idx)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors outline-none"
                  >
                    {isExpanded ? 'Gizle' : 'Detaylar'}
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="bg-slate-50 border-t border-slate-100 p-6 animate-in slide-in-from-top-2 fade-in duration-200">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-400" />
                    Sistem Performans Detayları
                  </h4>
                  <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-100 rounded-md mt-0.5">
                        <Zap className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">Gecikme (Latency)</p>
                        <p className="text-sm font-medium text-slate-700">{mod.details.latency}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 rounded-md mt-0.5">
                        <Server className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">Uptime</p>
                        <p className="text-sm font-medium text-slate-700">{mod.details.uptime}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-md mt-0.5">
                        <Users className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">Aktif Kullanım</p>
                        <p className="text-sm font-medium text-slate-700">{mod.details.activeUsers}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-100 rounded-md mt-0.5">
                        <Activity className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">Son Senkronizasyon</p>
                        <p className="text-sm font-medium text-slate-700">{mod.details.lastUpdate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
