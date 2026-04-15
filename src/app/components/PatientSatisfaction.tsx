import React, { useState } from 'react';
import {
  Heart, MessageSquareText, Star, ThumbsUp, ThumbsDown,
  TrendingUp, Clock, Mail, Phone,
  ChevronRight, Smile, Frown, Meh, ArrowUpRight, CheckSquare, Filter
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const npsData = [
  { month: 'Eki', score: 62 },
  { month: 'Kas', score: 65 },
  { month: 'Ara', score: 68 },
  { month: 'Oca', score: 71 },
  { month: 'Şub', score: 69 },
  { month: 'Mar', score: 74 },
  { month: 'Nis', score: 76 },
];

const recentFeedback = [
  {
    id: 1, name: 'Ayşe T.', dept: 'Kadın Doğum',
    rating: 5, type: 'Teşekkür', sentiment: 'positive',
    comment: 'Dr. Elif Hanım süreç boyunca çok ilgiliydi, hemşireler de çok güler yüzlüydü. Odalar tertemiz.',
    date: 'Bugün, 10:45', status: 'Cevaplandı'
  },
  {
    id: 2, name: 'Mehmet K.', dept: 'Acil Servis',
    rating: 2, type: 'Şikayet', sentiment: 'negative',
    comment: 'Triyajda çok bekledik, sarı alanda olmamıza rağmen 40 dakika doktor göremedik. Organizasyon zayıf.',
    date: 'Dün, 22:15', status: 'Açık'
  },
  {
    id: 3, name: 'Zeynep Y.', dept: 'Göz Hastalıkları',
    rating: 4, type: 'Öneri', sentiment: 'neutral',
    comment: 'Muayene güzeldi fakat otoparkta yer bulmak imkansız. Vale hizmeti geliştirilmeli.',
    date: '05 Nisan, 14:30', status: 'İnceleniyor'
  },
  {
    id: 4, name: 'Ali C.', dept: 'Ortopedi',
    rating: 5, type: 'Teşekkür', sentiment: 'positive',
    comment: 'Ameliyatım çok başarılı geçti, fizik tedavi süreci de aynı hastanede harika ilerliyor.',
    date: '04 Nisan, 09:10', status: 'Cevaplandı'
  }
];

export function PatientSatisfaction() {
  const [filter, setFilter] = useState('Tümü');

  const filteredFeedback = filter === 'Tümü'
    ? recentFeedback
    : recentFeedback.filter(f => f.type === filter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Hasta Memnuniyeti & CRM</h2>
          <p className="text-sm text-slate-500">NPS (Net Tavsiye Skoru), geri bildirimler ve şikayet yönetimi.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <MessageSquareText size={16} /> Yeni Anket Gönder
          </button>
        </div>
      </div>

      {/* Main KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NPS Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <div>
            <div className="flex justify-between items-start mb-2 relative z-10">
              <h3 className="font-semibold text-slate-600">Net Tavsiye Skoru (NPS)</h3>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={14} /> +2.4
              </span>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-5xl font-bold text-slate-800 tracking-tight">76</span>
              <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 relative z-10">Mükemmel seviye (Sektör ortalaması: 64)</p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between relative z-10">
            <div className="text-center">
              <div className="flex items-center gap-1 text-emerald-600 mb-1"><Smile size={16} /> <span className="text-sm font-semibold">%82</span></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Destekçiler</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-slate-400 mb-1"><Meh size={16} /> <span className="text-sm font-semibold">%12</span></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pasifler</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-red-500 mb-1"><Frown size={16} /> <span className="text-sm font-semibold">%6</span></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Kötüleyenler</div>
            </div>
          </div>
        </div>

        {/* NPS Chart Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800">NPS Trendi (Son 6 Ay)</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-2 py-1.5 text-slate-700 outline-none">
              <option>Tüm Hastane</option>
              <option>Yatan Hasta</option>
              <option>Poliklinik</option>
              <option>Acil</option>
            </select>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={npsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}
                />
                <Area key="nps-area" type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNps)" activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Star size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Ort. Yıldız Puanı</p>
              <div className="text-2xl font-bold text-slate-800">4.6<span className="text-sm text-slate-400 font-medium">/5.0</span></div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Şikayet Dönüş Hızı</p>
              <div className="text-2xl font-bold text-slate-800">2.4<span className="text-sm text-slate-400 font-medium"> saat</span></div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <MessageSquareText size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Açık Şikayetler</p>
              <div className="text-2xl font-bold text-slate-800">14<span className="text-sm font-medium text-red-500 ml-2">Dikkat</span></div>
            </div>
          </div>

          <button className="w-full bg-slate-800 text-white p-4 rounded-2xl shadow-sm hover:bg-slate-700 transition-colors flex items-center justify-between group">
            <div className="text-left">
              <h4 className="font-semibold text-sm">Detaylı CRM Raporu</h4>
              <p className="text-xs text-slate-400 mt-1">Nisan 2026</p>
            </div>
            <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-slate-600 transition-colors">
              <ArrowUpRight size={20} className="text-blue-400" />
            </div>
          </button>
        </div>

        {/* Feedback List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Heart className="text-rose-500" size={18} />
              Son Geri Bildirimler & Yorumlar
            </h3>
            <div className="flex gap-2 items-center">
              <Filter size={14} className="text-slate-400" />
              {['Tümü', 'Teşekkür', 'Şikayet', 'Öneri'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {filteredFeedback.map((item) => (
              <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      {item.sentiment === 'positive' ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><ThumbsUp size={20} /></div>
                      ) : item.sentiment === 'negative' ? (
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center"><ThumbsDown size={20} /></div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center"><MessageSquareText size={20} /></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{item.dept}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12} /> {item.date}</span>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={star <= item.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'}
                          />
                        ))}
                        <span className="text-xs font-medium text-slate-500 ml-2 border-l border-slate-300 pl-2">{item.type}</span>
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">"{item.comment}"</p>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-4">
                    {item.status === 'Açık' && (
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
                        <Phone size={14} /> Ara
                      </button>
                    )}
                    {(item.status === 'Açık' || item.status === 'İnceleniyor') ? (
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                        <Mail size={14} /> E-posta
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 px-3 py-1.5 bg-emerald-50 rounded-lg">
                        <CheckSquare size={14} /> Cevaplandı
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between px-5">
            <span className="text-xs text-slate-500 font-medium">{filteredFeedback.length} / Toplam 124 kayıt</span>
            <div className="flex gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-50"><ChevronRight size={16} className="rotate-180" /></button>
              <button className="p-1 text-slate-400 hover:text-slate-700"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
