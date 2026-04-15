import React, { useState } from 'react';
import { CheckSquare, Search, CheckCircle2, Clock, X, ChevronRight, FileText, AlertTriangle, Shield, User, Calendar, Building2, Plus, Eye } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Contract {
  id: string; institution: string; type: 'Özel Sigorta' | 'Kamu Kurumu' | 'Şirket' | 'Üniversite' | 'Belediye';
  startDate: string; endDate: string; status: 'Aktif' | 'Süresi Dolacak' | 'Sona Erdi' | 'Askıda';
  contactPerson: string; phone: string; email: string;
  discountRate: number; paymentTermDays: number;
  coveredServices: string[]; exclusions: string[];
  monthlyVolume: number; totalRevenue: number;
  notes: string;
}

const mockContracts: Contract[] = [
  { id: 'ANL-001', institution: 'Allianz Sigorta A.Ş.', type: 'Özel Sigorta', startDate: '01.01.2026', endDate: '31.12.2026', status: 'Aktif', contactPerson: 'Ahmet Yıldırım', phone: '0212 555 1234', email: 'ahmet@allianz.com.tr', discountRate: 15, paymentTermDays: 30, coveredServices: ['Poliklinik', 'Yatış', 'Ameliyat', 'Laboratuvar', 'Radyoloji', 'Acil'], exclusions: ['Estetik cerrahi', 'Check-up paketleri'], monthlyVolume: 85, totalRevenue: 245000, notes: 'Yıllık yenileme anlaşması. Provizyon sistemi entegre.' },
  { id: 'ANL-002', institution: 'Axa Sigorta', type: 'Özel Sigorta', startDate: '01.03.2026', endDate: '28.02.2027', status: 'Aktif', contactPerson: 'Elif Demir', phone: '0212 444 5678', email: 'elif@axa.com.tr', discountRate: 12, paymentTermDays: 45, coveredServices: ['Poliklinik', 'Yatış', 'Ameliyat', 'Laboratuvar', 'Radyoloji'], exclusions: ['Diş tedavisi', 'Estetik'], monthlyVolume: 62, totalRevenue: 180000, notes: '' },
  { id: 'ANL-003', institution: 'Türkiye Petrolleri A.O.', type: 'Kamu Kurumu', startDate: '01.01.2026', endDate: '31.12.2026', status: 'Aktif', contactPerson: 'Mehmet Kaya', phone: '0312 555 9876', email: 'mkaya@tp.gov.tr', discountRate: 8, paymentTermDays: 60, coveredServices: ['Poliklinik', 'Yatış', 'Ameliyat', 'Laboratuvar', 'Radyoloji', 'FTR', 'Check-up'], exclusions: [], monthlyVolume: 120, totalRevenue: 320000, notes: 'Çalışanlar ve 1. derece yakınları dahil. Yıllık check-up programı mevcut.' },
  { id: 'ANL-004', institution: 'ABC Teknoloji A.Ş.', type: 'Şirket', startDate: '01.06.2025', endDate: '31.05.2026', status: 'Süresi Dolacak', contactPerson: 'Selin Arslan', phone: '0216 333 4567', email: 'selin@abc.com', discountRate: 10, paymentTermDays: 30, coveredServices: ['Poliklinik', 'Laboratuvar', 'Radyoloji'], exclusions: ['Yatış', 'Ameliyat'], monthlyVolume: 35, totalRevenue: 78000, notes: 'Sözleşme 31 Mayıs\'ta sona erecek. Yenileme görüşmeleri başlatılmalı.' },
  { id: 'ANL-005', institution: 'İstanbul Üniversitesi', type: 'Üniversite', startDate: '01.09.2025', endDate: '31.08.2026', status: 'Aktif', contactPerson: 'Prof. Dr. Kemal T.', phone: '0212 440 0000', email: 'kemal@iu.edu.tr', discountRate: 20, paymentTermDays: 90, coveredServices: ['Poliklinik', 'Yatış', 'Laboratuvar', 'Radyoloji'], exclusions: ['Ameliyat (özel onay gerekli)'], monthlyVolume: 45, totalRevenue: 95000, notes: 'Akademik personel ve öğrenciler. Ameliyat için ayrı onay gerekli.' },
  { id: 'ANL-006', institution: 'XYZ Sigorta', type: 'Özel Sigorta', startDate: '01.01.2025', endDate: '31.12.2025', status: 'Sona Erdi', contactPerson: 'Can Demir', phone: '0212 777 8888', email: 'can@xyz.com', discountRate: 10, paymentTermDays: 30, coveredServices: ['Poliklinik', 'Laboratuvar'], exclusions: [], monthlyVolume: 0, totalRevenue: 45000, notes: 'Sözleşme yenilenmedi.' },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function ContractModule() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [statusFilter, setStatusFilter] = useState('Tümü');

  const filtered = statusFilter === 'Tümü' ? mockContracts : mockContracts.filter(c => c.status === statusFilter);
  const statusColor = (s: string) => s === 'Aktif' ? 'green' : s === 'Süresi Dolacak' ? 'amber' : s === 'Sona Erdi' ? 'red' : 'slate';
  const typeColor = (t: string) => t === 'Özel Sigorta' ? 'purple' : t === 'Kamu Kurumu' ? 'blue' : t === 'Şirket' ? 'cyan' : t === 'Üniversite' ? 'amber' : 'green';
  const activeCount = mockContracts.filter(c => c.status === 'Aktif').length;
  const expiringCount = mockContracts.filter(c => c.status === 'Süresi Dolacak').length;
  const totalMonthly = mockContracts.filter(c => c.status === 'Aktif').reduce((s, c) => s + c.monthlyVolume, 0);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kurumsal Anlaşmalar</h2>
          <p className="text-sm text-slate-500">Sigorta şirketleri, kamu kurumları, özel şirket ve üniversite protokolleri</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus size={16} /> Yeni Anlaşma</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-none">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200"><p className="text-xs font-bold text-emerald-700 uppercase">Aktif Anlaşma</p><p className="text-2xl font-black text-emerald-600">{activeCount}</p></div>
        <div className={twMerge("p-4 rounded-xl border", expiringCount > 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}><p className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1"><AlertTriangle size={14} /> Süresi Dolacak</p><p className="text-2xl font-black text-amber-600">{expiringCount}</p></div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200"><p className="text-xs font-bold text-blue-700 uppercase">Aylık Hasta Hacmi</p><p className="text-2xl font-black text-blue-600">{totalMonthly}</p></div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200"><p className="text-xs font-bold text-purple-700 uppercase">Toplam Gelir (Aktif)</p><p className="text-2xl font-black text-purple-600">{mockContracts.filter(c => c.status === 'Aktif').reduce((s, c) => s + c.totalRevenue, 0).toLocaleString('tr-TR')} <span className="text-sm">TL</span></p></div>
      </div>

      <div className="flex gap-2 flex-none flex-wrap">
        {['Tümü', 'Aktif', 'Süresi Dolacak', 'Sona Erdi'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} className={twMerge('px-3 py-1.5 rounded-lg text-xs font-semibold border', statusFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200')}>{f}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelectedContract(c)}
            className={twMerge("bg-white rounded-xl border shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all",
              c.status === 'Süresi Dolacak' ? 'border-amber-300' : 'border-slate-200')}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Building2 size={16} className="text-slate-400" />
                  <h4 className="text-sm font-bold text-slate-800">{c.institution}</h4>
                  <Badge color={typeColor(c.type)}>{c.type}</Badge>
                  <Badge color={statusColor(c.status)}>{c.status}</Badge>
                </div>
                <p className="text-xs text-slate-500">{c.startDate} — {c.endDate} • İskonto: %{c.discountRate} • Vade: {c.paymentTermDays} gün</p>
                <div className="flex gap-1 mt-2 flex-wrap">{c.coveredServices.map((s, i) => <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{s}</span>)}</div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm font-bold text-slate-800">{c.monthlyVolume} <span className="text-xs font-normal text-slate-400">hasta/ay</span></p>
                <p className="text-xs text-emerald-600 font-bold">{c.totalRevenue.toLocaleString('tr-TR')} TL</p>
                <ChevronRight size={16} className="text-slate-300 ml-auto mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedContract} onClose={() => setSelectedContract(null)} title={`Anlaşma Detayı — ${selectedContract?.institution || ''}`}>
        {selectedContract && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div><span className="text-slate-500 block text-xs">Kurum</span><span className="font-bold">{selectedContract.institution}</span></div>
              <div><span className="text-slate-500 block text-xs">Tür</span><Badge color={typeColor(selectedContract.type)}>{selectedContract.type}</Badge></div>
              <div><span className="text-slate-500 block text-xs">Durum</span><Badge color={statusColor(selectedContract.status)}>{selectedContract.status}</Badge></div>
              <div><span className="text-slate-500 block text-xs">Süre</span><span className="font-bold">{selectedContract.startDate} — {selectedContract.endDate}</span></div>
              <div><span className="text-slate-500 block text-xs">İskonto</span><span className="font-bold text-blue-600">%{selectedContract.discountRate}</span></div>
              <div><span className="text-slate-500 block text-xs">Ödeme Vadesi</span><span className="font-bold">{selectedContract.paymentTermDays} gün</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><h4 className="text-sm font-bold text-slate-700 mb-2">İletişim</h4><div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm space-y-1"><p>{selectedContract.contactPerson}</p><p className="text-slate-500">{selectedContract.phone}</p><p className="text-slate-500">{selectedContract.email}</p></div></div>
              <div><h4 className="text-sm font-bold text-slate-700 mb-2">Performans</h4><div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-sm space-y-1"><p>Aylık Hacim: <strong>{selectedContract.monthlyVolume} hasta</strong></p><p>Toplam Ciro: <strong>{selectedContract.totalRevenue.toLocaleString('tr-TR')} TL</strong></p></div></div>
            </div>
            <div><h4 className="text-sm font-bold text-slate-700 mb-2">Kapsanan Hizmetler</h4><div className="flex gap-2 flex-wrap">{selectedContract.coveredServices.map((s, i) => <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100">{s}</span>)}</div></div>
            {selectedContract.exclusions.length > 0 && <div><h4 className="text-sm font-bold text-slate-700 mb-2">Kapsam Dışı</h4><div className="flex gap-2 flex-wrap">{selectedContract.exclusions.map((e, i) => <span key={i} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-lg border border-red-100">{e}</span>)}</div></div>}
            {selectedContract.notes && <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><p className="text-sm text-slate-700">{selectedContract.notes}</p></div>}
          </div>
        )}
      </Modal>
    </div>
  );
}
