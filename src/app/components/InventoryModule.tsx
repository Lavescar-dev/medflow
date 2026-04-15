import React, { useState } from 'react';
import { Archive, Search, CheckCircle2, Clock, AlertTriangle, X, Plus, ChevronRight, Package, Truck, ArrowDownUp, BarChart3, Filter, Eye, Edit3 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface StockItem {
  id: string; name: string; code: string; category: string; unit: string;
  currentStock: number; minStock: number; maxStock: number;
  location: string; supplier: string; unitCost: number;
  lastOrder: string; expiryDate: string; lot: string;
  status: 'Yeterli' | 'Düşük' | 'Kritik' | 'Stok Yok';
  utsTracked: boolean;
}

interface StockMovement {
  id: string; date: string; type: 'Giriş' | 'Çıkış' | 'Transfer' | 'İade' | 'Sayım Farkı';
  item: string; quantity: number; from: string; to: string; user: string; document: string;
}

const mockStock: StockItem[] = [
  { id: 'M-001', name: 'Cerrahi Eldiven (Steril) - M', code: 'MLZ-CE-M', category: 'Sarf Malzeme', unit: 'Çift', currentStock: 2500, minStock: 500, maxStock: 5000, location: 'Ana Depo A-3', supplier: 'Medline Tr.', unitCost: 4.50, lastOrder: '01.04.2026', expiryDate: '12.2028', lot: 'LOT-2026-A', status: 'Yeterli', utsTracked: false },
  { id: 'M-002', name: 'IV Kanül 20G (Pembe)', code: 'MLZ-IV-20', category: 'Sarf Malzeme', unit: 'Adet', currentStock: 180, minStock: 200, maxStock: 1000, location: 'Ana Depo B-1', supplier: 'BD Medical', unitCost: 3.20, lastOrder: '28.03.2026', expiryDate: '06.2028', lot: 'LOT-BD-2025', status: 'Düşük', utsTracked: true },
  { id: 'M-003', name: 'Foley Sonda 16F (2 Yollu)', code: 'MLZ-FS-16', category: 'Sarf Malzeme', unit: 'Adet', currentStock: 45, minStock: 50, maxStock: 200, location: 'Ana Depo B-2', supplier: 'Bıçakçılar', unitCost: 18.00, lastOrder: '15.03.2026', expiryDate: '03.2028', lot: 'LOT-BIC-2025', status: 'Düşük', utsTracked: true },
  { id: 'M-004', name: 'ECG Elektrodu (Yetişkin)', code: 'MLZ-ECG-Y', category: 'Sarf Malzeme', unit: 'Adet', currentStock: 3200, minStock: 1000, maxStock: 5000, location: 'Ana Depo C-1', supplier: 'Ambu', unitCost: 0.85, lastOrder: '20.03.2026', expiryDate: '09.2028', lot: 'LOT-AMB-2026', status: 'Yeterli', utsTracked: false },
  { id: 'M-005', name: 'Enjektör 10mL (Luer Lock)', code: 'MLZ-ENJ-10', category: 'Sarf Malzeme', unit: 'Adet', currentStock: 8, minStock: 500, maxStock: 3000, location: 'Ana Depo A-1', supplier: 'BD Medical', unitCost: 0.65, lastOrder: '05.04.2026', expiryDate: '12.2028', lot: 'LOT-BD-2026', status: 'Kritik', utsTracked: false },
  { id: 'M-006', name: 'Diz Protezi (Total - Çimentolu)', code: 'IMP-DZ-TC', category: 'İmplant', unit: 'Set', currentStock: 3, minStock: 2, maxStock: 10, location: 'İmplant Deposu', supplier: 'Zimmer Biomet', unitCost: 12500.00, lastOrder: '10.03.2026', expiryDate: '—', lot: 'IMP-ZB-2026-01', status: 'Yeterli', utsTracked: true },
  { id: 'M-007', name: 'Laparoskopi Trokar 10mm', code: 'MLZ-LAP-T10', category: 'Ameliyathane', unit: 'Adet', currentStock: 12, minStock: 10, maxStock: 50, location: 'Ameliyathane Deposu', supplier: 'Medtronic', unitCost: 185.00, lastOrder: '25.03.2026', expiryDate: '05.2028', lot: 'LOT-MDT-2025', status: 'Yeterli', utsTracked: true },
  { id: 'M-008', name: 'N95 Maske (FFP2)', code: 'MLZ-N95', category: 'KKE', unit: 'Adet', currentStock: 0, minStock: 200, maxStock: 2000, location: 'Ana Depo D-1', supplier: 'Moldex', unitCost: 8.50, lastOrder: '01.03.2026', expiryDate: '01.2029', lot: 'LOT-MDX-2026', status: 'Stok Yok', utsTracked: false },
];

const mockMovements: StockMovement[] = [
  { id: 'HRK-001', date: '07.04.2026 08:00', type: 'Çıkış', item: 'Cerrahi Eldiven (Steril) - M', quantity: 50, from: 'Ana Depo', to: 'Ameliyathane', user: 'Depocu Ali K.', document: 'ÇF-2026-0421' },
  { id: 'HRK-002', date: '07.04.2026 09:15', type: 'Çıkış', item: 'IV Kanül 20G', quantity: 20, from: 'Ana Depo', to: 'Acil Servis', user: 'Depocu Ali K.', document: 'ÇF-2026-0422' },
  { id: 'HRK-003', date: '07.04.2026 10:00', type: 'Giriş', item: 'Enjektör 10mL', quantity: 2000, from: 'BD Medical', to: 'Ana Depo', user: 'Depocu Ali K.', document: 'GF-2026-0198' },
  { id: 'HRK-004', date: '06.04.2026 14:00', type: 'Transfer', item: 'Foley Sonda 16F', quantity: 10, from: 'Ana Depo', to: 'Yoğun Bakım', user: 'Depocu Ali K.', document: 'TF-2026-0085' },
  { id: 'HRK-005', date: '06.04.2026 16:00', type: 'İade', item: 'ECG Elektrodu', quantity: 50, from: 'Dahiliye', to: 'Ana Depo', user: 'Hmş. Fatma K.', document: 'İF-2026-0012' },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

export function InventoryModule() {
  const [tab, setTab] = useState<'stok' | 'hareket'>('stok');
  const [searchText, setSearchText] = useState('');

  const filteredStock = mockStock.filter(s => !searchText || s.name.toLowerCase().includes(searchText.toLowerCase()) || s.code.toLowerCase().includes(searchText.toLowerCase()));
  const statusColor = (s: string) => s === 'Yeterli' ? 'green' : s === 'Düşük' ? 'amber' : s === 'Kritik' ? 'red' : 'red';
  const moveColor = (t: string) => t === 'Giriş' ? 'green' : t === 'Çıkış' ? 'red' : t === 'Transfer' ? 'blue' : t === 'İade' ? 'amber' : 'purple';
  const criticalCount = mockStock.filter(s => s.status === 'Kritik' || s.status === 'Stok Yok').length;
  const totalValue = mockStock.reduce((s, i) => s + i.currentStock * i.unitCost, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Stok ve Malzeme Yönetimi</h2>
          <p className="text-sm text-slate-500">Depo yönetimi, UTS takip, sipariş, hareket kayıtları</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('stok')} className={twMerge("px-4 py-2 rounded-lg text-sm font-semibold border", tab === 'stok' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-slate-600 border-slate-200")}>Stok Listesi</button>
          <button onClick={() => setTab('hareket')} className={twMerge("px-4 py-2 rounded-lg text-sm font-semibold border", tab === 'hareket' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-slate-600 border-slate-200")}>Hareketler</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-none">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200"><p className="text-xs font-bold text-blue-700 uppercase">Toplam Kalem</p><p className="text-2xl font-black text-blue-600">{mockStock.length}</p></div>
        <div className={twMerge("p-4 rounded-xl border", criticalCount > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200")}><p className="text-xs font-bold text-red-700 uppercase flex items-center gap-1"><AlertTriangle size={14} /> Kritik / Yok</p><p className="text-2xl font-black text-red-600">{criticalCount}</p></div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200"><p className="text-xs font-bold text-amber-700 uppercase">UTS Takipli</p><p className="text-2xl font-black text-amber-600">{mockStock.filter(s => s.utsTracked).length}</p></div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200"><p className="text-xs font-bold text-emerald-700 uppercase">Stok Değeri</p><p className="text-2xl font-black text-emerald-600">{totalValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} <span className="text-sm">TL</span></p></div>
      </div>

      {tab === 'stok' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-2 text-slate-400" size={16} />
              <input type="text" placeholder="Malzeme adı / kodu..." value={searchText} onChange={e => setSearchText(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500">Malzeme / Kod</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Mevcut</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Min / Maks</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Birim Fiyat</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Konum</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500">Durum</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStock.map(s => (
                  <tr key={s.id} className={twMerge("hover:bg-slate-50", s.status === 'Kritik' || s.status === 'Stok Yok' ? 'bg-red-50/30' : '')}>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-400 font-mono">{s.code} • {s.category} {s.utsTracked && '• UTS'}</p>
                    </td>
                    <td className="py-3 px-4 text-center"><span className={twMerge("text-lg font-bold", s.currentStock <= s.minStock ? "text-red-600" : "text-slate-800")}>{s.currentStock}</span><span className="text-xs text-slate-400 ml-1">{s.unit}</span></td>
                    <td className="py-3 px-4 text-center text-xs text-slate-500">{s.minStock} / {s.maxStock}</td>
                    <td className="py-3 px-4 text-center text-xs text-slate-600">{s.unitCost.toFixed(2)} TL</td>
                    <td className="py-3 px-4 text-center text-xs text-slate-500">{s.location}</td>
                    <td className="py-3 px-4 text-center"><Badge color={statusColor(s.status)}>{s.status}</Badge></td>
                    <td className="py-3 px-4 text-right">
                      {s.currentStock <= s.minStock && <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">Sipariş</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'hareket' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex-none"><h3 className="font-semibold text-slate-800 flex items-center gap-2"><ArrowDownUp className="text-blue-500" size={18} /> Stok Hareketleri</h3></div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {mockMovements.map(m => (
              <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-400">{m.date}</span>
                    <Badge color={moveColor(m.type)}>{m.type}</Badge>
                    <span className="text-xs font-mono text-slate-400">{m.document}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">{m.item}</p>
                  <p className="text-xs text-slate-500">{m.from} → {m.to} • {m.user}</p>
                </div>
                <span className={twMerge("text-lg font-black", m.type === 'Giriş' || m.type === 'İade' ? "text-emerald-600" : "text-red-600")}>
                  {m.type === 'Giriş' || m.type === 'İade' ? '+' : '-'}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
