import React, { useState } from 'react';
import { 
  Download, Filter, FileText, TrendingUp, Users, 
  Wallet, Calculator, ArrowRight, FileSpreadsheet
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

const departmentMetrics = [
  { id: 1, name: 'Dahiliye', patients: 1450, revenue: 850000, expenses: 320000, waitTime: '15 dk' },
  { id: 2, name: 'Kardiyoloji', patients: 850, revenue: 1250000, expenses: 540000, waitTime: '12 dk' },
  { id: 3, name: 'Ortopedi', patients: 920, revenue: 1100000, expenses: 480000, waitTime: '22 dk' },
  { id: 4, name: 'Kadın Doğum', patients: 1100, revenue: 950000, expenses: 390000, waitTime: '18 dk' },
  { id: 5, name: 'Göz Hastalıkları', patients: 1300, revenue: 780000, expenses: 210000, waitTime: '10 dk' },
  { id: 6, name: 'Nöroloji', patients: 640, revenue: 620000, expenses: 280000, waitTime: '25 dk' },
];

const monthlyRevenue = [
  { month: 'Oca', SGK: 2400000, Ozel: 1800000, Nakit: 800000 },
  { month: 'Şub', SGK: 2600000, Ozel: 1950000, Nakit: 850000 },
  { month: 'Mar', SGK: 2800000, Ozel: 2100000, Nakit: 900000 },
  { month: 'Nis', SGK: 2500000, Ozel: 2000000, Nakit: 950000 },
  { month: 'May', SGK: 2900000, Ozel: 2300000, Nakit: 1100000 },
  { month: 'Haz', SGK: 3100000, Ozel: 2500000, Nakit: 1200000 },
];

export function AdvancedReporting() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">İş Zekası ve İleri Raporlama</h2>
          <p className="text-sm text-slate-500">Mali veriler, bölüm performansları ve gelir/gider analizleri.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={16} /> Filtrele
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors shadow-sm">
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Download size={16} /> Rapor Oluştur
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Toplam Ciro (YTD)", value: "₺32.4M", trend: "+15.2%", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Net Kar Marjı", value: "%28.4", trend: "+2.1%", icon: Calculator, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Toplam Hasta (YTD)", value: "124,530", trend: "+8.4%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { title: "Ort. İşlem Bedeli", value: "₺2,450", trend: "+12.5%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-slate-800">{stat.value}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800 text-lg">Kurum Bazlı Gelir Dağılımı (2026 İlk Yarı)</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-2 py-1.5 text-slate-700 font-medium outline-none">
              <option>Son 6 Ay</option>
              <option>Bu Yıl</option>
              <option>Geçen Yıl</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height={288}>
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis key="xaxis" dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `₺${val/1000000}M`} />
                <RechartsTooltip 
                  key="tooltip"
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend key="legend" wrapperStyle={{ paddingTop: '10px' }} />
                <Bar key="bar-sgk" dataKey="SGK" name="SGK Gelirleri" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar key="bar-ozel" dataKey="Ozel" name="Özel Sigorta" stackId="a" fill="#8b5cf6" />
                <Bar key="bar-nakit" dataKey="Nakit" name="Nakit / Kredi Kartı" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="text-slate-500" size={18} />
              Bölüm Bazlı Karlılık ve Performans
            </h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Bölüm ara..." 
                className="pl-3 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-48"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-white border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5 font-semibold text-slate-500 text-xs uppercase tracking-wider">Poliklinik / Bölüm</th>
                  <th className="py-3 px-5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Aylık Hasta</th>
                  <th className="py-3 px-5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Aylık Gelir</th>
                  <th className="py-3 px-5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Aylık Gider</th>
                  <th className="py-3 px-5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Net Kar</th>
                  <th className="py-3 px-5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-center">Ort. Bekleme</th>
                  <th className="py-3 px-5 font-semibold text-slate-500 text-xs uppercase tracking-wider text-center">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentMetrics.map((dept) => {
                  const profit = dept.revenue - dept.expenses;
                  const profitMargin = (profit / dept.revenue) * 100;
                  
                  return (
                    <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-5 font-medium text-slate-800">{dept.name}</td>
                      <td className="py-3 px-5 text-right text-slate-600">{dept.patients.toLocaleString('tr-TR')}</td>
                      <td className="py-3 px-5 text-right font-medium text-emerald-600">{formatCurrency(dept.revenue)}</td>
                      <td className="py-3 px-5 text-right text-red-500">{formatCurrency(dept.expenses)}</td>
                      <td className="py-3 px-5 text-right">
                        <div className="font-semibold text-slate-800">{formatCurrency(profit)}</div>
                        <div className="text-xs text-slate-500">%{profitMargin.toFixed(1)} Marj</div>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          parseInt(dept.waitTime) > 20 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {dept.waitTime}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <button className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
                          <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}