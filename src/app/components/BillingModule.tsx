import React, { useState } from 'react';
import {
  CreditCard, Search, CheckCircle2, Clock, AlertTriangle, X, Plus, ChevronRight,
  Send, Printer, Download, FileText, Eye, Edit3, RefreshCw, Shield, User, Filter,
  TrendingUp, DollarSign, BarChart3
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Invoice {
  id: string; patient: string; tc: string; age: string; gender: string;
  dept: string; doctor: string; date: string;
  type: 'Poliklinik' | 'Yatan Hasta' | 'Acil' | 'Ameliyat' | 'Günübirlik';
  payer: 'SGK' | 'Özel Sigorta' | 'Ücretli' | 'Kurumsal';
  payerDetail: string;
  status: 'Taslak' | 'MEDULA Gönderildi' | 'Onaylandı' | 'Kısmi Ret' | 'Ret' | 'Tahsil Edildi' | 'İtiraz';
  medulaNo: string; sutCode: string;
  items: { code: string; description: string; quantity: number; unitPrice: number; total: number; medulaStatus: 'Onay' | 'Ret' | 'Bekliyor' }[];
  totalAmount: number; approvedAmount: number; patientShare: number;
  notes: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'FTR-2026-04821', patient: 'Ayşe Yılmaz', tc: '123***456', age: '41', gender: 'K',
    dept: 'Dahiliye', doctor: 'Uzm. Dr. Ahmet K.', date: '07.04.2026',
    type: 'Poliklinik', payer: 'SGK', payerDetail: 'SGK - Genel Sağlık Sigortası',
    status: 'Onaylandı', medulaNo: 'MDL-2026-982341', sutCode: 'P520010',
    items: [
      { code: 'P520010', description: 'Dahiliye Muayene', quantity: 1, unitPrice: 85.50, total: 85.50, medulaStatus: 'Onay' },
      { code: 'P800310', description: 'Hemogram (Tam Kan Sayımı)', quantity: 1, unitPrice: 18.75, total: 18.75, medulaStatus: 'Onay' },
      { code: 'P800430', description: 'Biyokimya Paneli (12 parametre)', quantity: 1, unitPrice: 42.00, total: 42.00, medulaStatus: 'Onay' },
    ],
    totalAmount: 146.25, approvedAmount: 146.25, patientShare: 0, notes: ''
  },
  {
    id: 'FTR-2026-04822', patient: 'Fatma Şahin', tc: '567***890', age: '50', gender: 'K',
    dept: 'Genel Cerrahi', doctor: 'Op. Dr. Sinan K.', date: '07.04.2026',
    type: 'Ameliyat', payer: 'SGK', payerDetail: 'SGK - GSS',
    status: 'MEDULA Gönderildi', medulaNo: 'MDL-2026-982345', sutCode: 'P614580',
    items: [
      { code: 'P614580', description: 'Laparoskopik Kolesistektomi', quantity: 1, unitPrice: 1850.00, total: 1850.00, medulaStatus: 'Bekliyor' },
      { code: 'P530020', description: 'Genel Anestezi', quantity: 1, unitPrice: 450.00, total: 450.00, medulaStatus: 'Bekliyor' },
      { code: 'P520010', description: 'Cerrahi Muayene', quantity: 1, unitPrice: 85.50, total: 85.50, medulaStatus: 'Bekliyor' },
      { code: 'M-YATIS', description: 'Yatış Ücreti (2 gün)', quantity: 2, unitPrice: 185.00, total: 370.00, medulaStatus: 'Bekliyor' },
      { code: 'P800310', description: 'Hemogram + Koagülasyon', quantity: 1, unitPrice: 35.50, total: 35.50, medulaStatus: 'Bekliyor' },
    ],
    totalAmount: 2791.00, approvedAmount: 0, patientShare: 0, notes: 'Ameliyat faturası MEDULA onayı bekleniyor.'
  },
  {
    id: 'FTR-2026-04818', patient: 'Zeynep Kaya', tc: '345***678', age: '72', gender: 'K',
    dept: 'Dahiliye', doctor: 'Uzm. Dr. Ahmet K.', date: '06.04.2026',
    type: 'Yatan Hasta', payer: 'SGK', payerDetail: 'SGK - Emekli',
    status: 'Kısmi Ret', medulaNo: 'MDL-2026-982320', sutCode: '',
    items: [
      { code: 'M-YATIS', description: 'Yatış Ücreti (2 gün)', quantity: 2, unitPrice: 185.00, total: 370.00, medulaStatus: 'Onay' },
      { code: 'P520010', description: 'Dahiliye Muayene', quantity: 1, unitPrice: 85.50, total: 85.50, medulaStatus: 'Onay' },
      { code: 'P800740', description: 'Tiroit Fonksiyon Testleri', quantity: 1, unitPrice: 65.00, total: 65.00, medulaStatus: 'Ret' },
      { code: 'P800310', description: 'Hemogram', quantity: 1, unitPrice: 18.75, total: 18.75, medulaStatus: 'Onay' },
      { code: 'P800430', description: 'CRP', quantity: 1, unitPrice: 15.00, total: 15.00, medulaStatus: 'Onay' },
      { code: 'P700890', description: 'Nebülizasyon (3 seans)', quantity: 3, unitPrice: 12.50, total: 37.50, medulaStatus: 'Onay' },
    ],
    totalAmount: 591.75, approvedAmount: 526.75, patientShare: 0,
    notes: 'TFT istemi ret: KOAH tanısı ile uyumsuz bulundu. İtiraz edilecek.'
  },
  {
    id: 'FTR-2026-04823', patient: 'Hasan Öztürk', tc: '678***901', age: '38', gender: 'E',
    dept: 'Ortopedi', doctor: 'Doç. Dr. Murat A.', date: '07.04.2026',
    type: 'Ameliyat', payer: 'Özel Sigorta', payerDetail: 'Allianz Sağlık Sigortası',
    status: 'Taslak', medulaNo: '', sutCode: '',
    items: [
      { code: 'P616120', description: 'Artroskopik Menisküs Tamiri', quantity: 1, unitPrice: 2200.00, total: 2200.00, medulaStatus: 'Bekliyor' },
      { code: 'P530040', description: 'Spinal Anestezi', quantity: 1, unitPrice: 350.00, total: 350.00, medulaStatus: 'Bekliyor' },
      { code: 'M-YATIS', description: 'Yatış (1 gün)', quantity: 1, unitPrice: 185.00, total: 185.00, medulaStatus: 'Bekliyor' },
    ],
    totalAmount: 2735.00, approvedAmount: 0, patientShare: 0,
    notes: 'Özel sigorta provizyon alınacak.'
  },
  {
    id: 'FTR-2026-04815', patient: 'Mehmet Demir', tc: '234***567', age: '61', gender: 'E',
    dept: 'Acil Servis', doctor: 'Dr. Hakan Ç.', date: '07.04.2026',
    type: 'Acil', payer: 'SGK', payerDetail: 'SGK - GSS',
    status: 'Tahsil Edildi', medulaNo: 'MDL-2026-982350', sutCode: '',
    items: [
      { code: 'P521020', description: 'Acil Muayene', quantity: 1, unitPrice: 95.00, total: 95.00, medulaStatus: 'Onay' },
      { code: 'P800310', description: 'Hemogram', quantity: 1, unitPrice: 18.75, total: 18.75, medulaStatus: 'Onay' },
      { code: 'P800430', description: 'Biyokimya (Acil Panel)', quantity: 1, unitPrice: 52.00, total: 52.00, medulaStatus: 'Onay' },
      { code: 'P700050', description: 'IV Sıvı Tedavisi', quantity: 1, unitPrice: 25.00, total: 25.00, medulaStatus: 'Onay' },
    ],
    totalAmount: 190.75, approvedAmount: 190.75, patientShare: 0, notes: ''
  },
];

const revenueData = [
  { name: 'Ocak', SGK: 285000, Ozel: 125000, Ucretli: 45000 },
  { name: 'Şubat', SGK: 310000, Ozel: 140000, Ucretli: 52000 },
  { name: 'Mart', SGK: 298000, Ozel: 155000, Ucretli: 48000 },
  { name: 'Nisan', SGK: 145000, Ozel: 72000, Ucretli: 22000 },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', orange: 'bg-orange-50 text-orange-700 border-orange-100' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function BillingModule() {
  const [invoices] = useState(mockInvoices);
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);
  const [tab, setTab] = useState<'faturalar' | 'gelir'>('faturalar');
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [searchText, setSearchText] = useState('');

  const filtered = invoices.filter(i => {
    if (statusFilter !== 'Tümü' && i.status !== statusFilter) return false;
    if (searchText && !i.patient.toLowerCase().includes(searchText.toLowerCase()) && !i.id.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const statusColor = (s: string) => s === 'Taslak' ? 'slate' : s === 'MEDULA Gönderildi' ? 'blue' : s === 'Onaylandı' ? 'green' : s === 'Kısmi Ret' ? 'orange' : s === 'Ret' ? 'red' : s === 'Tahsil Edildi' ? 'green' : 'amber';
  const totalRevenue = invoices.reduce((s, i) => s + i.approvedAmount, 0);
  const pendingAmount = invoices.filter(i => !['Tahsil Edildi', 'Ret'].includes(i.status)).reduce((s, i) => s + i.totalAmount, 0);
  const rejectedItems = invoices.reduce((s, i) => s + i.items.filter(it => it.medulaStatus === 'Ret').length, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Faturalama ve Gelir Yönetimi</h2>
          <p className="text-sm text-slate-500">MEDULA faturalama, SUT kodlama, gelir takibi, SGK/Sigorta provizyon</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('faturalar')} className={twMerge("px-4 py-2 rounded-lg text-sm font-semibold border", tab === 'faturalar' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-slate-600 border-slate-200")}>Faturalar</button>
          <button onClick={() => setTab('gelir')} className={twMerge("px-4 py-2 rounded-lg text-sm font-semibold border", tab === 'gelir' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-slate-600 border-slate-200")}>Gelir Analizi</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-none">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200"><p className="text-xs font-bold text-emerald-700 uppercase">Onaylanan Gelir</p><p className="text-2xl font-black text-emerald-600">{totalRevenue.toLocaleString('tr-TR')} <span className="text-sm">TL</span></p></div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200"><p className="text-xs font-bold text-amber-700 uppercase">Bekleyen</p><p className="text-2xl font-black text-amber-600">{pendingAmount.toLocaleString('tr-TR')} <span className="text-sm">TL</span></p></div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200"><p className="text-xs font-bold text-blue-700 uppercase">Fatura Sayısı</p><p className="text-2xl font-black text-blue-600">{invoices.length}</p></div>
        <div className={twMerge("p-4 rounded-xl border", rejectedItems > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200")}><p className="text-xs font-bold text-red-700 uppercase">Ret Edilen Kalem</p><p className="text-2xl font-black text-red-600">{rejectedItems}</p></div>
      </div>

      {tab === 'faturalar' && (
        <>
          <div className="flex gap-2 flex-none flex-wrap items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2 text-slate-400" size={16} />
              <input type="text" placeholder="Hasta / Fatura No..." value={searchText} onChange={e => setSearchText(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-52" />
            </div>
            {['Tümü', 'Taslak', 'MEDULA Gönderildi', 'Onaylandı', 'Kısmi Ret', 'Tahsil Edildi'].map(f => (
              <button key={f} onClick={() => setStatusFilter(f)} className={twMerge('px-3 py-1.5 rounded-lg text-xs font-semibold border', statusFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200')}>{f}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {filtered.map(inv => (
              <div key={inv.id} onClick={() => setSelectedInv(inv)}
                className={twMerge("bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all",
                  inv.status === 'Kısmi Ret' || inv.status === 'Ret' ? 'border-red-200' : ''
                )}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{inv.id}</span>
                      <Badge color={statusColor(inv.status)}>{inv.status}</Badge>
                      <Badge color={inv.payer === 'SGK' ? 'blue' : inv.payer === 'Özel Sigorta' ? 'purple' : inv.payer === 'Ücretli' ? 'amber' : 'cyan'}>{inv.payer}</Badge>
                      <Badge color="slate">{inv.type}</Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{inv.patient} ({inv.age} {inv.gender})</p>
                    <p className="text-xs text-slate-500">{inv.dept} • {inv.doctor} • {inv.date}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{inv.items.length} kalem • {inv.items.map(i => i.description).slice(0, 2).join(', ')}{inv.items.length > 2 ? '...' : ''}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-lg font-black text-slate-800">{inv.totalAmount.toLocaleString('tr-TR')} <span className="text-xs font-normal">TL</span></p>
                    {inv.approvedAmount > 0 && inv.approvedAmount !== inv.totalAmount && (
                      <p className="text-xs text-emerald-600 font-bold">Onay: {inv.approvedAmount.toLocaleString('tr-TR')} TL</p>
                    )}
                    <ChevronRight size={16} className="text-slate-300 ml-auto mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'gelir' && (
        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Aylık Gelir Dağılımı (2026)</h4>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: number) => `${v.toLocaleString('tr-TR')} TL`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="SGK" fill="#3b82f6" name="SGK" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Ozel" fill="#8b5cf6" name="Özel Sigorta" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Ucretli" fill="#f59e0b" name="Ücretli" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <Modal open={!!selectedInv} onClose={() => setSelectedInv(null)} title={`Fatura Detay — ${selectedInv?.id || ''}`}>
        {selectedInv && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-slate-500 block text-xs">Hasta</span><span className="font-bold">{selectedInv.patient} ({selectedInv.age} {selectedInv.gender})</span></div>
              <div><span className="text-slate-500 block text-xs">Ödeme</span><span className="font-bold">{selectedInv.payerDetail}</span></div>
              <div><span className="text-slate-500 block text-xs">MEDULA No</span><span className="font-mono font-bold">{selectedInv.medulaNo || '—'}</span></div>
              <div><Badge color={statusColor(selectedInv.status)}>{selectedInv.status}</Badge></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50"><tr>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">SUT Kodu</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500">Açıklama</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">Adet</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Birim Fiyat</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500">Tutar</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500">MEDULA</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInv.items.map((item, i) => (
                    <tr key={i} className={item.medulaStatus === 'Ret' ? 'bg-red-50/50' : ''}>
                      <td className="py-3 px-3 font-mono text-xs text-slate-600">{item.code}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{item.description}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-slate-600">{item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-800">{item.total.toFixed(2)}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge color={item.medulaStatus === 'Onay' ? 'green' : item.medulaStatus === 'Ret' ? 'red' : 'amber'}>{item.medulaStatus}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr><td colSpan={4} className="py-3 px-3 text-right font-bold text-slate-700">TOPLAM</td><td className="py-3 px-3 text-right font-black text-slate-800 text-lg">{selectedInv.totalAmount.toFixed(2)} TL</td><td></td></tr>
                  {selectedInv.approvedAmount > 0 && <tr><td colSpan={4} className="py-2 px-3 text-right font-bold text-emerald-700">ONAYLANAN</td><td className="py-2 px-3 text-right font-bold text-emerald-600">{selectedInv.approvedAmount.toFixed(2)} TL</td><td></td></tr>}
                </tfoot>
              </table>
            </div>

            {selectedInv.notes && <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><p className="text-sm text-slate-700">{selectedInv.notes}</p></div>}

            <div className="flex gap-3 pt-4 border-t border-slate-100 flex-wrap">
              {selectedInv.status === 'Taslak' && <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Send size={14} /> MEDULA'ya Gönder</button>}
              {selectedInv.status === 'Kısmi Ret' && <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 flex items-center gap-2"><RefreshCw size={14} /> İtiraz Et</button>}
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} /> Yazdır</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Download size={14} /> PDF</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
