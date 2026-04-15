import React, { useState } from 'react';
import { FileClock, Search, CheckCircle2, Clock, X, ChevronRight, FileText, Eye, Download, Plus, Edit3, User, Calendar, FolderOpen, Tag, Lock, Upload } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface Document {
  id: string; title: string; docNo: string; category: string; type: string;
  version: string; status: 'Yürürlükte' | 'Taslak' | 'Revizyon' | 'İptal' | 'Arşiv';
  createdBy: string; createdDate: string; approvedBy: string; approvedDate: string;
  revisionDate: string; dept: string; accessLevel: 'Genel' | 'Gizli' | 'Çok Gizli';
  description: string; tags: string[];
  revisionHistory: { version: string; date: string; author: string; changes: string }[];
}

const mockDocuments: Document[] = [
  { id: 'DOC-001', title: 'Hasta Hakları Yönergesi', docNo: 'HH-YNR-001', category: 'Yönerge', type: 'Hasta Hizmetleri', version: 'v3.2', status: 'Yürürlükte', createdBy: 'Başhekim Dr. Mehmet Y.', createdDate: '01.01.2024', approvedBy: 'Hastane Müdürü', approvedDate: '15.01.2024', revisionDate: '15.01.2026', dept: 'Genel', accessLevel: 'Genel', description: 'Hasta hakları, sorumlulukları ve şikayet mekanizması.', tags: ['hasta hakları', 'yönerge', 'JCI'], revisionHistory: [
    { version: 'v3.2', date: '15.01.2024', author: 'Dr. Mehmet Y.', changes: 'KVKK uyumlu güncelleme' },
    { version: 'v3.1', date: '15.01.2023', author: 'Dr. Mehmet Y.', changes: 'JCI standartlarına uyum' },
  ]},
  { id: 'DOC-002', title: 'Enfeksiyon Kontrol Prosedürü', docNo: 'ENF-PRS-001', category: 'Prosedür', type: 'Enfeksiyon Kontrol', version: 'v5.0', status: 'Yürürlükte', createdBy: 'Enf. Hmş. Seda T.', createdDate: '01.03.2025', approvedBy: 'Enfeksiyon Kontrol Komitesi', approvedDate: '15.03.2025', revisionDate: '15.03.2027', dept: 'Tüm Birimler', accessLevel: 'Genel', description: 'El hijyeni, izolasyon, dezenfeksiyon prosedürleri.', tags: ['enfeksiyon', 'izolasyon', 'el hijyeni'], revisionHistory: [] },
  { id: 'DOC-003', title: 'Mavi Kod Prosedürü', docNo: 'ACL-PRS-001', category: 'Prosedür', type: 'Acil Durum', version: 'v2.1', status: 'Yürürlükte', createdBy: 'Dr. Hakan Ç.', createdDate: '10.06.2025', approvedBy: 'Başhekim', approvedDate: '20.06.2025', revisionDate: '20.06.2027', dept: 'Tüm Birimler', accessLevel: 'Genel', description: 'Kardiyak arrest durumunda uygulanacak prosedür.', tags: ['mavi kod', 'acil', 'CPR'], revisionHistory: [] },
  { id: 'DOC-004', title: 'İlaç Güvenliği Talimatı', docNo: 'ECZ-TLM-001', category: 'Talimat', type: 'Eczane', version: 'v4.0', status: 'Revizyon', createdBy: 'Ecz. Derya A.', createdDate: '01.01.2025', approvedBy: '', approvedDate: '', revisionDate: '01.01.2027', dept: 'Eczane + Klinik', accessLevel: 'Genel', description: 'Yüksek riskli ilaçlar, HAİ ilaçları, etkileşim kontrol.', tags: ['ilaç güvenliği', 'HAİ ilaçlar'], revisionHistory: [] },
  { id: 'DOC-005', title: 'Ameliyathane Güvenli Cerrahi Kontrol Listesi', docNo: 'AMH-CHK-001', category: 'Kontrol Listesi', type: 'Ameliyathane', version: 'v2.0', status: 'Yürürlükte', createdBy: 'Op. Dr. Sinan K.', createdDate: '01.09.2025', approvedBy: 'Cerrahi Birimler Koordinatörü', approvedDate: '15.09.2025', revisionDate: '15.09.2027', dept: 'Ameliyathane', accessLevel: 'Genel', description: 'WHO güvenli cerrahi kontrol listesi.', tags: ['WHO', 'güvenli cerrahi', 'checklist'], revisionHistory: [] },
  { id: 'DOC-006', title: 'KVKK Veri İşleme Politikası', docNo: 'BLG-POL-001', category: 'Politika', type: 'Bilgi Güvenliği', version: 'v1.2', status: 'Yürürlükte', createdBy: 'Bilgi Güvenliği Sorumlusu', createdDate: '01.06.2024', approvedBy: 'Hastane Yönetim Kurulu', approvedDate: '15.06.2024', revisionDate: '15.06.2026', dept: 'Tüm Birimler', accessLevel: 'Gizli', description: 'Kişisel verilerin korunması ve işlenmesi politikası.', tags: ['KVKK', 'gizlilik', 'veri koruma'], revisionHistory: [] },
  { id: 'DOC-007', title: 'Narkotik İlaç Takip Prosedürü', docNo: 'ECZ-PRS-002', category: 'Prosedür', type: 'Eczane', version: 'v3.0', status: 'Yürürlükte', createdBy: 'Ecz. Derya A.', createdDate: '01.02.2025', approvedBy: 'Başhekim', approvedDate: '10.02.2025', revisionDate: '10.02.2027', dept: 'Eczane + Klinik', accessLevel: 'Gizli', description: 'Narkotik ve psikotrop ilaçların stok, dağıtım ve imha prosedürü.', tags: ['narkotik', 'kontrol', 'takip'], revisionHistory: [] },
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

export function DocumentModule() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchText, setSearchText] = useState('');
  const [catFilter, setCatFilter] = useState('Tümü');

  const categories = [...new Set(mockDocuments.map(d => d.category))];
  const filtered = mockDocuments.filter(d => {
    if (catFilter !== 'Tümü' && d.category !== catFilter) return false;
    if (searchText && !d.title.toLowerCase().includes(searchText.toLowerCase()) && !d.docNo.toLowerCase().includes(searchText.toLowerCase()) && !d.tags.some(t => t.includes(searchText.toLowerCase()))) return false;
    return true;
  });

  const statusColor = (s: string) => s === 'Yürürlükte' ? 'green' : s === 'Taslak' ? 'slate' : s === 'Revizyon' ? 'amber' : s === 'İptal' ? 'red' : 'purple';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Doküman Yönetim Sistemi (EBYS)</h2>
          <p className="text-sm text-slate-500">Prosedürler, talimatlar, politikalar, kontrol listeleri, revizyon takibi</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus size={16} /> Yeni Doküman</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-none">
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200"><p className="text-xs font-bold text-emerald-700 uppercase">Yürürlükte</p><p className="text-2xl font-black text-emerald-600">{mockDocuments.filter(d => d.status === 'Yürürlükte').length}</p></div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200"><p className="text-xs font-bold text-amber-700 uppercase">Revizyonda</p><p className="text-2xl font-black text-amber-600">{mockDocuments.filter(d => d.status === 'Revizyon').length}</p></div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200"><p className="text-xs font-bold text-blue-700 uppercase">Toplam</p><p className="text-2xl font-black text-blue-600">{mockDocuments.length}</p></div>
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200"><p className="text-xs font-bold text-purple-700 uppercase flex items-center gap-1"><Lock size={14} /> Gizli</p><p className="text-2xl font-black text-purple-600">{mockDocuments.filter(d => d.accessLevel !== 'Genel').length}</p></div>
      </div>

      <div className="flex gap-2 flex-none flex-wrap items-center">
        <div className="relative">
          <Search className="absolute left-3 top-2 text-slate-400" size={16} />
          <input type="text" placeholder="Doküman ara..." value={searchText} onChange={e => setSearchText(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-52" />
        </div>
        {['Tümü', ...categories].map(f => (
          <button key={f} onClick={() => setCatFilter(f)} className={twMerge('px-3 py-1.5 rounded-lg text-xs font-semibold border', catFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200')}>{f}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filtered.map(d => (
          <div key={d.id} onClick={() => setSelectedDoc(d)} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <FileText size={16} className="text-blue-500" />
                  <h4 className="text-sm font-bold text-slate-800">{d.title}</h4>
                  <Badge color={statusColor(d.status)}>{d.status}</Badge>
                  <Badge color="slate">{d.category}</Badge>
                  <span className="text-[10px] text-slate-400 font-mono">{d.docNo} {d.version}</span>
                  {d.accessLevel !== 'Genel' && <Badge color="purple"><Lock size={8} className="inline" /> {d.accessLevel}</Badge>}
                </div>
                <p className="text-xs text-slate-500">{d.description}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {d.tags.map((t, i) => <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">{t}</span>)}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Oluşturan: {d.createdBy} • Birim: {d.dept} • Revizyon: {d.revisionDate}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 mt-1" />
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedDoc} onClose={() => setSelectedDoc(null)} title={`Doküman — ${selectedDoc?.docNo || ''}`}>
        {selectedDoc && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><span className="text-slate-500 block text-xs">Doküman No / Versiyon</span><span className="font-mono font-bold">{selectedDoc.docNo} {selectedDoc.version}</span></div>
              <div><span className="text-slate-500 block text-xs">Kategori</span><span className="font-bold">{selectedDoc.category} — {selectedDoc.type}</span></div>
              <div><span className="text-slate-500 block text-xs">Durum</span><Badge color={statusColor(selectedDoc.status)}>{selectedDoc.status}</Badge></div>
              <div><span className="text-slate-500 block text-xs">Oluşturan</span><span className="font-bold">{selectedDoc.createdBy}</span></div>
              <div><span className="text-slate-500 block text-xs">Onaylayan</span><span className="font-bold">{selectedDoc.approvedBy || '—'}</span></div>
              <div><span className="text-slate-500 block text-xs">Sonraki Revizyon</span><span className="font-bold">{selectedDoc.revisionDate}</span></div>
            </div>

            <div><h4 className="text-sm font-bold text-slate-700 mb-1">Açıklama</h4><p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{selectedDoc.description}</p></div>

            {selectedDoc.revisionHistory.length > 0 && (
              <div><h4 className="text-sm font-bold text-slate-700 mb-2">Revizyon Geçmişi</h4>
                <div className="space-y-2">{selectedDoc.revisionHistory.map((r, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between">
                    <div><span className="text-xs font-bold text-slate-800">{r.version}</span> — <span className="text-xs text-slate-500">{r.date}</span><p className="text-xs text-slate-600 mt-0.5">{r.changes}</p></div>
                    <span className="text-xs text-slate-400">{r.author}</span>
                  </div>
                ))}</div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Download size={14} /> PDF İndir</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Edit3 size={14} /> Revize Et</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
