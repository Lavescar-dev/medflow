import React from 'react';
import { 
  Users, Activity, CreditCard, BedDouble, ArrowUpRight, ArrowDownRight,
  Stethoscope, Clock, ShieldAlert, BadgeInfo
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const patientTrendData = [
  { name: 'Pzt', poliklinik: 400, acil: 120, yatan: 80 },
  { name: 'Sal', poliklinik: 430, acil: 140, yatan: 85 },
  { name: 'Çar', poliklinik: 450, acil: 110, yatan: 90 },
  { name: 'Per', poliklinik: 380, acil: 130, yatan: 82 },
  { name: 'Cum', poliklinik: 410, acil: 150, yatan: 88 },
  { name: 'Cmt', poliklinik: 200, acil: 180, yatan: 95 },
  { name: 'Paz', poliklinik: 150, acil: 190, yatan: 95 },
];

const departmentLoadData = [
  { name: 'Dahiliye', value: 400, color: '#3b82f6' },
  { name: 'Ortopedi', value: 300, color: '#8b5cf6' },
  { name: 'Göz', value: 300, color: '#f59e0b' },
  { name: 'Kardiyoloji', value: 200, color: '#ef4444' },
  { name: 'KBB', value: 278, color: '#10b981' },
];

const urgentTasks = [
  { id: 1, type: 'critical', msg: 'Yoğun Bakım (YBÜ-3) Ventilatör arızası uyarısı.', time: '10 dk önce', icon: Activity, targetModule: 'Yoğun Bakım Bilgi Sistemi' },
  { id: 2, type: 'warning', msg: 'Eczane: Clexane 4000 Anti-Xa stok seviyesi kritik.', time: '45 dk önce', icon: ShieldAlert, targetModule: 'Eczane ve İlaç' },
  { id: 3, type: 'info', msg: '2 Nolu Ameliyathane sterilizasyon süreci tamamlandı.', time: '1 saat önce', icon: BadgeInfo, targetModule: 'Sterilizasyon (MSÜ)' },
  { id: 4, type: 'warning', msg: 'Acil Servis Triaj: Bekleme süresi 45 dk aşıldı.', time: '2 saat önce', icon: Clock, targetModule: 'Acil Servis Yönetimi' },
];

interface DashboardProps {
  onNavigateToModule?: (moduleName: string) => void;
}

const quickActions = [
  { title: 'Randevu Akışını Aç', subtitle: 'MHRS ve gün içi bekleme görünümü', targetModule: 'Randevu Yönetimi', tone: 'blue' },
  { title: 'EHR İncele', subtitle: 'Hasta dosyası ve klinik zaman çizgisi', targetModule: 'Elektronik Hasta Dosyası', tone: 'emerald' },
  { title: 'LIS Kritik Sonuçlar', subtitle: 'Laboratuvar bekleyen ve panik değerler', targetModule: 'Laboratuvar (LIS)', tone: 'amber' },
  { title: 'Gelir Paneli', subtitle: 'Provizyon ve faturalama operasyonu', targetModule: 'Faturalama ve Gelir', tone: 'purple' },
];

export function Dashboard({ onNavigateToModule }: DashboardProps) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section with date picker / filters mockup */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Hastane Genel Durumu</h2>
          <p className="text-sm text-slate-500">Günlük operasyonel özet ve gerçek zamanlı metrikler.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-white border border-slate-300 rounded-lg text-sm px-3 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-slate-50 transition-colors">
            <option>Bugün (7 Nisan 2026)</option>
            <option>Dün</option>
            <option>Bu Hafta</option>
            <option>Bu Ay</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => onNavigateToModule?.('İş Zekası ve İleri Raporlama')}
          >
            Rapor Al
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.title}
            type="button"
            onClick={() => onNavigateToModule?.(action.targetModule)}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${
              action.tone === 'blue' ? 'bg-blue-50 text-blue-700' :
              action.tone === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
              action.tone === 'amber' ? 'bg-amber-50 text-amber-700' :
              'bg-purple-50 text-purple-700'
            }`}>
              Hızlı Geçiş
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-800">{action.title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">{action.subtitle}</p>
          </button>
        ))}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Günlük Poliklinik" 
          value="1,248" 
          trend="+12%" 
          trendUp={true} 
          icon={<Users className="text-blue-600" size={24} />} 
          bgColor="bg-blue-50"
        />
        <MetricCard 
          title="Acil Servis Girişi" 
          value="312" 
          trend="+5%" 
          trendUp={true} 
          icon={<Activity className="text-red-600" size={24} />} 
          bgColor="bg-red-50"
        />
        <MetricCard 
          title="Yatak Doluluk Oranı" 
          value="%82.4" 
          trend="-2.1%" 
          trendUp={false} 
          icon={<BedDouble className="text-amber-600" size={24} />} 
          bgColor="bg-amber-50"
        />
        <MetricCard 
          title="Tahmini Günlük Ciro" 
          value="₺1.4M" 
          trend="+8%" 
          trendUp={true} 
          icon={<CreditCard className="text-emerald-600" size={24} />} 
          bgColor="bg-emerald-50"
        />
      </div>

      {/* HBYS KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Ort. Yatış Süresi', value: '4.2 gün', target: '<5', ok: true },
          { label: 'Mortalite Hızı', value: '‰2.1', target: '<‰3', ok: true },
          { label: 'Yeniden Yatış (30g)', value: '%3.8', target: '<%5', ok: true },
          { label: 'HAİ Oranı', value: '‰3.2', target: '<‰5', ok: true },
          { label: 'El Hijyeni Uyumu', value: '%79', target: '>%80', ok: false },
          { label: 'Ameliyathane Kullanım', value: '%74', target: '>%70', ok: true },
        ].map((kpi, i) => (
          <div key={i} className={`bg-white p-3 rounded-xl border shadow-sm text-center ${kpi.ok ? 'border-slate-200' : 'border-amber-300 bg-amber-50/30'}`}>
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{kpi.label}</p>
            <p className={`text-lg font-black ${kpi.ok ? 'text-slate-800' : 'text-amber-700'}`}>{kpi.value}</p>
            <p className="text-[9px] text-slate-400">Hedef: {kpi.target}</p>
          </div>
        ))}
      </div>

      {/* Bed Occupancy by Department */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <BedDouble className="text-amber-500" size={18} /> Servis Bazlı Yatak Doluluk
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { dept: 'Dahiliye', total: 24, occupied: 21, pct: 88, color: 'blue' },
            { dept: 'Cerrahi', total: 20, occupied: 14, pct: 70, color: 'emerald' },
            { dept: 'Ortopedi', total: 16, occupied: 12, pct: 75, color: 'purple' },
            { dept: 'KVC', total: 8, occupied: 7, pct: 88, color: 'red' },
            { dept: 'Göğüs', total: 12, occupied: 8, pct: 67, color: 'cyan' },
            { dept: 'Yoğun Bakım', total: 6, occupied: 5, pct: 83, color: 'red' },
            { dept: 'Pediatri', total: 10, occupied: 4, pct: 40, color: 'amber' },
          ].map((s, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
              <p className="text-xs font-bold text-slate-700 mb-2">{s.dept}</p>
              <div className="relative w-14 h-14 mx-auto mb-2">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                    stroke={s.pct >= 85 ? '#ef4444' : s.pct >= 70 ? '#f59e0b' : '#10b981'}
                    strokeWidth="3" strokeDasharray={`${s.pct}, 100`} strokeLinecap="round" />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${s.pct >= 85 ? 'text-red-600' : 'text-slate-700'}`}>%{s.pct}</span>
              </div>
              <p className="text-[10px] text-slate-500">{s.occupied}/{s.total} yatak</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800 text-lg">Haftalık Hasta Trafiği</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">7 Günlük</span>
          </div>
          <div className="h-72 w-full flex-1">
            <ResponsiveContainer width="100%" height={288}>
              <AreaChart data={patientTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs key="defs">
                  <linearGradient id="colorPol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAcil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                />
                <Legend key="legend" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area key="area-pol" type="monotone" name="Poliklinik" dataKey="poliklinik" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPol)" />
                <Area key="area-acil" type="monotone" name="Acil" dataKey="acil" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAcil)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-slate-800 text-lg">Bölüm Yoğunlukları</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">Poliklinik randevu dağılımı (Bugün)</p>
          <div className="h-64 w-full flex-1 relative">
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  key="pie"
                  data={departmentLoadData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {departmentLoadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">1.4K</span>
              <span className="text-xs font-medium text-slate-500">Randevu</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {departmentLoadData.slice(0, 4).map(dept => (
              <div key={dept.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                <span className="truncate">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Alerts & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={18} />
              Kritik Uyarılar & RTLS
            </h3>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800">Tümünü Gör</button>
          </div>
          <div className="divide-y divide-slate-100">
            {urgentTasks.map(task => (
              <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group cursor-pointer">
                <div className={`p-2 rounded-full mt-0.5 ${
                  task.type === 'critical' ? 'bg-red-100 text-red-600' : 
                  task.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                  'bg-blue-100 text-blue-600'
                }`}>
                  <task.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 line-clamp-2">{task.msg}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock size={12} /> {task.time}
                  </p>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigateToModule?.(task.targetModule);
                  }}
                >
                  İncele
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Stethoscope className="text-blue-500" size={18} />
              Bekleyen Konsültasyon & Kurul
            </h3>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-800">Tümünü Gör</button>
          </div>
          <div className="p-0 overflow-auto flex-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Hasta (TC)</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">İsteyen Bölüm</th>
                  <th className="py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wider">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {[
                  { name: 'Ayşe K. (123***789)', dept: 'Kardiyoloji', status: 'Bekliyor', priority: 'high' },
                  { name: 'Mehmet Y. (456***123)', dept: 'Nöroloji', status: 'İşlemde', priority: 'normal' },
                  { name: 'Fatma Ş. (789***456)', dept: 'Onkoloji', status: 'Bekliyor', priority: 'high' },
                  { name: 'Ali D. (321***654)', dept: 'Ortopedi', status: 'Tamamlandı', priority: 'low' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{row.name.split(' ')[0]} {row.name.split(' ')[1]}</div>
                      <div className="text-xs text-slate-400">{row.name.split(' ')[2]}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{row.dept}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        row.status === 'Bekliyor' ? 'bg-amber-100 text-amber-700' :
                        row.status === 'İşlemde' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendUp, icon, bgColor }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-50 transition-transform group-hover:scale-110 ${bgColor}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full ${
          trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {trendUp ? <ArrowUpRight size={14} strokeWidth={2.5} /> : <ArrowDownRight size={14} strokeWidth={2.5} />}
          {trend}
        </div>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-slate-500 font-medium text-sm mb-1">{title}</h4>
        <div className="text-3xl font-bold text-slate-800 tracking-tight">{value}</div>
      </div>
    </div>
  );
}
