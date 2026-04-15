import React, { useState } from 'react';
import { CreditCard, Search, CheckCircle2, Clock, X, Plus, ChevronRight, Printer, DollarSign, Banknote, Wallet, Receipt, User, ArrowDownUp } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Transaction {
  id: string; patient: string; tc: string; date: string; time: string;
  type: 'Tahsilat' | 'İade' | 'Depozito' | 'Katılım Payı';
  method: 'Nakit' | 'Kredi Kartı' | 'Havale/EFT' | 'Çok Kartlı';
  amount: number; description: string; invoiceNo: string;
  cashier: string; status: 'Tamamlandı' | 'Bekliyor' | 'İptal';
  receiptNo: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TH-001', patient: 'Ayşe Yılmaz', tc: '123***456', date: '07.04.2026', time: '10:25', type: 'Katılım Payı', method: 'Nakit', amount: 10.00, description: 'Poliklinik muayene katılım payı', invoiceNo: 'FTR-2026-04821', cashier: 'Veznedar Elif K.', status: 'Tamamlandı', receiptNo: 'MKZ-2026-08421' },
  { id: 'TH-002', patient: 'Hasan Öztürk', tc: '678***901', date: '07.04.2026', time: '11:15', type: 'Depozito', method: 'Kredi Kartı', amount: 2000.00, description: 'Ameliyat öncesi depozito (Özel Sigorta fark)', invoiceNo: '', cashier: 'Veznedar Elif K.', status: 'Tamamlandı', receiptNo: 'MKZ-2026-08422' },
  { id: 'TH-003', patient: 'Mehmet Demir', tc: '234***567', date: '07.04.2026', time: '09:45', type: 'Tahsilat', method: 'Kredi Kartı', amount: 190.75, description: 'Acil servis fatura tahsilatı', invoiceNo: 'FTR-2026-04815', cashier: 'Veznedar Elif K.', status: 'Tamamlandı', receiptNo: 'MKZ-2026-08420' },
  { id: 'TH-004', patient: 'Ali Çelik', tc: '456***789', date: '07.04.2026', time: '12:00', type: 'Tahsilat', method: 'Nakit', amount: 350.00, description: 'Ücretli hasta — MR çekimi', invoiceNo: 'FTR-2026-04825', cashier: 'Veznedar Elif K.', status: 'Bekliyor', receiptNo: '' },
  { id: 'TH-005', patient: 'Fatma Şahin', tc: '567***890', date: '07.04.2026', time: '08:30', type: 'Katılım Payı', method: 'Nakit', amount: 10.00, description: 'İlaç katılım payı', invoiceNo: 'FTR-2026-04822', cashier: 'Veznedar Elif K.', status: 'Tamamlandı', receiptNo: 'MKZ-2026-08419' },
  { id: 'TH-006', patient: 'Zehra Koç', tc: '789***012', date: '06.04.2026', time: '15:30', type: 'İade', method: 'Havale/EFT', amount: -500.00, description: 'Fazla yatırılan depozito iadesi', invoiceNo: '', cashier: 'Veznedar Elif K.', status: 'Tamamlandı', receiptNo: 'MKZ-2026-08415' },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function CashierModule() {
  const [transactions] = useState(mockTransactions);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showNewPayment, setShowNewPayment] = useState(false);

  const todayTotal = transactions.filter(t => t.status === 'Tamamlandı' && t.amount > 0 && t.date === '07.04.2026').reduce((s, t) => s + t.amount, 0);
  const todayCash = transactions.filter(t => t.method === 'Nakit' && t.status === 'Tamamlandı' && t.amount > 0 && t.date === '07.04.2026').reduce((s, t) => s + t.amount, 0);
  const todayCard = transactions.filter(t => t.method === 'Kredi Kartı' && t.status === 'Tamamlandı' && t.amount > 0 && t.date === '07.04.2026').reduce((s, t) => s + t.amount, 0);
  const pendingCount = transactions.filter(t => t.status === 'Bekliyor').length;

  const typeColor = (t: string) => t === 'Tahsilat' ? 'green' : t === 'İade' ? 'red' : t === 'Depozito' ? 'purple' : 'amber';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Vezne / Tahsilat</h2>
          <p className="text-sm text-slate-500">Nakit ve kart tahsilat, katılım payı, depozito, iade işlemleri • Veznedar: Elif K.</p>
        </div>
        <button onClick={() => setShowNewPayment(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-sm">
          <Plus size={16} /> Yeni Tahsilat
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-none">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200"><p className="text-xs font-bold text-emerald-700 uppercase">Günlük Toplam</p><p className="text-2xl font-black text-emerald-600">{todayTotal.toLocaleString('tr-TR')} <span className="text-sm">TL</span></p></div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200"><p className="text-xs font-bold text-blue-700 uppercase flex items-center gap-1"><Banknote size={14} /> Nakit</p><p className="text-2xl font-black text-blue-600">{todayCash.toLocaleString('tr-TR')} <span className="text-sm">TL</span></p></div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200"><p className="text-xs font-bold text-purple-700 uppercase flex items-center gap-1"><CreditCard size={14} /> Kart</p><p className="text-2xl font-black text-purple-600">{todayCard.toLocaleString('tr-TR')} <span className="text-sm">TL</span></p></div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200"><p className="text-xs font-bold text-amber-700 uppercase">Bekleyen</p><p className="text-2xl font-black text-amber-600">{pendingCount}</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center gap-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2"><Receipt className="text-blue-500" size={18} /> İşlem Geçmişi</h3>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2 text-slate-400" size={16} />
            <input type="text" placeholder="Hasta / Makbuz No..." className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {transactions.map(tx => (
            <div key={tx.id} onClick={() => setSelectedTx(tx)} className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-slate-400">{tx.date} {tx.time}</span>
                  <span className="text-sm font-bold text-slate-800">{tx.patient}</span>
                  <Badge color={typeColor(tx.type)}>{tx.type}</Badge>
                  <Badge color={tx.method === 'Nakit' ? 'green' : tx.method === 'Kredi Kartı' ? 'purple' : 'blue'}>{tx.method}</Badge>
                  <Badge color={tx.status === 'Tamamlandı' ? 'green' : tx.status === 'Bekliyor' ? 'amber' : 'red'}>{tx.status}</Badge>
                </div>
                <p className="text-xs text-slate-500">{tx.description}</p>
              </div>
              <div className="text-right ml-4">
                <p className={twMerge("text-lg font-black", tx.amount < 0 ? "text-red-600" : "text-emerald-600")}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('tr-TR')} TL</p>
                {tx.receiptNo && <p className="text-[10px] text-slate-400 font-mono">{tx.receiptNo}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!selectedTx} onClose={() => setSelectedTx(null)} title={`Tahsilat Detay — ${selectedTx?.id || ''}`}>
        {selectedTx && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500 block text-xs">Hasta</span><span className="font-bold">{selectedTx.patient} (TC: {selectedTx.tc})</span></div>
              <div><span className="text-slate-500 block text-xs">Tarih / Saat</span><span className="font-bold">{selectedTx.date} {selectedTx.time}</span></div>
              <div><span className="text-slate-500 block text-xs">İşlem Türü</span><Badge color={typeColor(selectedTx.type)}>{selectedTx.type}</Badge></div>
              <div><span className="text-slate-500 block text-xs">Ödeme Yöntemi</span><span className="font-bold">{selectedTx.method}</span></div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 text-center">
              <p className="text-xs text-emerald-600">Tutar</p>
              <p className={twMerge("text-3xl font-black", selectedTx.amount < 0 ? "text-red-600" : "text-emerald-700")}>{selectedTx.amount > 0 ? '+' : ''}{selectedTx.amount.toLocaleString('tr-TR')} TL</p>
            </div>
            <div className="text-sm"><span className="text-slate-500">Açıklama:</span> <span className="font-medium">{selectedTx.description}</span></div>
            {selectedTx.invoiceNo && <div className="text-sm"><span className="text-slate-500">Fatura No:</span> <span className="font-mono font-bold">{selectedTx.invoiceNo}</span></div>}
            {selectedTx.receiptNo && <div className="text-sm"><span className="text-slate-500">Makbuz No:</span> <span className="font-mono font-bold">{selectedTx.receiptNo}</span></div>}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} /> Makbuz Yazdır</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showNewPayment} onClose={() => setShowNewPayment(false)} title="Yeni Tahsilat">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Hasta</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="TC veya Hasta Adı ile ara" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">İşlem Türü</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"><option>Tahsilat</option><option>Katılım Payı</option><option>Depozito</option><option>İade</option></select></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Tutar (TL)</label><input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="0.00" /></div>
            <div><label className="text-xs font-semibold text-slate-600 block mb-1">Ödeme Yöntemi</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"><option>Nakit</option><option>Kredi Kartı</option><option>Havale/EFT</option></select></div>
          </div>
          <div><label className="text-xs font-semibold text-slate-600 block mb-1">Açıklama</label><input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" placeholder="İşlem açıklaması" /></div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setShowNewPayment(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold">İptal</button>
            <button onClick={() => setShowNewPayment(false)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 flex items-center gap-2"><CheckCircle2 size={14} /> Tahsil Et</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
