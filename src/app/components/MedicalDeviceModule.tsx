import React, { useState } from 'react';
import { MonitorSmartphone, Search, CheckCircle2, Clock, AlertTriangle, X, ChevronRight, Calendar, Wrench, Shield, MapPin, Eye } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MedicalDevice {
  id: string; name: string; brand: string; model: string; serialNo: string;
  category: string; dept: string; location: string;
  purchaseDate: string; warrantyEnd: string; expectedLife: number;
  lastMaintenance: string; nextMaintenance: string; lastCalibration: string; nextCalibration: string;
  status: 'Aktif' | 'Bakımda' | 'Arızalı' | 'Depo' | 'Hurda';
  riskClass: 'I' | 'IIa' | 'IIb' | 'III';
  udiCode: string; responsible: string;
  maintenanceHistory: { date: string; type: string; technician: string; notes: string; cost: number }[];
}

const mockDevices: MedicalDevice[] = [
  { id: 'CZ-001', name: 'Mekanik Ventilatör', brand: 'Dräger', model: 'Evita V500', serialNo: 'SN-DRG-2022-001', category: 'Solunum Cihazları', dept: 'Yoğun Bakım', location: 'YBÜ Yatak 1', purchaseDate: '15.06.2022', warrantyEnd: '15.06.2025', expectedLife: 10, lastMaintenance: '15.01.2026', nextMaintenance: '15.04.2026', lastCalibration: '10.01.2026', nextCalibration: '10.07.2026', status: 'Aktif', riskClass: 'IIb', udiCode: 'UDI-DRG-V500-001', responsible: 'Biyomed. Müh. Kemal T.', maintenanceHistory: [
    { date: '15.01.2026', type: 'Periyodik Bakım', technician: 'Biyomed. Müh. Kemal T.', notes: 'Filtre değişimi, sensör kalibrasyonu, test geçti.', cost: 1200 },
    { date: '15.07.2025', type: 'Periyodik Bakım', technician: 'Biyomed. Müh. Kemal T.', notes: 'Rutin bakım. Flow sensörü değiştirildi.', cost: 2800 },
  ]},
  { id: 'CZ-002', name: 'Hasta Monitörü', brand: 'Philips', model: 'IntelliVue MX800', serialNo: 'SN-PHL-2023-015', category: 'Monitörizasyon', dept: 'Ameliyathane', location: 'Salon 1', purchaseDate: '01.03.2023', warrantyEnd: '01.03.2026', expectedLife: 8, lastMaintenance: '01.02.2026', nextMaintenance: '01.05.2026', lastCalibration: '01.02.2026', nextCalibration: '01.08.2026', status: 'Aktif', riskClass: 'IIa', udiCode: 'UDI-PHL-MX800-015', responsible: 'Biyomed. Müh. Kemal T.', maintenanceHistory: [
    { date: '01.02.2026', type: 'Periyodik Bakım', technician: 'Biyomed. Müh. Kemal T.', notes: 'SpO2 probu ve EKG kablosu yenilendi.', cost: 850 },
  ]},
  { id: 'CZ-003', name: 'Defibrilatör', brand: 'ZOLL', model: 'R Series Plus', serialNo: 'SN-ZOL-2021-003', category: 'Acil Ekipman', dept: 'Acil Servis', location: 'Resüsitasyon Odası', purchaseDate: '10.09.2021', warrantyEnd: '10.09.2024', expectedLife: 10, lastMaintenance: '10.03.2026', nextMaintenance: '10.06.2026', lastCalibration: '10.03.2026', nextCalibration: '10.06.2026', status: 'Aktif', riskClass: 'III', udiCode: 'UDI-ZOL-RS-003', responsible: 'Biyomed. Müh. Kemal T.', maintenanceHistory: [
    { date: '10.03.2026', type: 'Periyodik Bakım + Kalibrasyon', technician: 'ZOLL Yetkili Servis', notes: 'Batarya kapasitesi %92. Şarj edildi. Enerji kalibrasyonu yapıldı.', cost: 500 },
  ]},
  { id: 'CZ-004', name: 'Ultrason Cihazı', brand: 'GE', model: 'LOGIQ E10s', serialNo: 'SN-GE-2024-008', category: 'Görüntüleme', dept: 'Radyoloji', location: 'USG Odası 1', purchaseDate: '20.01.2024', warrantyEnd: '20.01.2027', expectedLife: 8, lastMaintenance: '20.10.2025', nextMaintenance: '20.04.2026', lastCalibration: '20.10.2025', nextCalibration: '20.04.2026', status: 'Bakımda', riskClass: 'IIa', udiCode: 'UDI-GE-E10-008', responsible: 'Biyomed. Müh. Kemal T.', maintenanceHistory: [
    { date: '07.04.2026', type: 'Arıza Bakım', technician: 'GE Yetkili Servis', notes: 'Konveks prob arızası. Prob değişimi yapılacak. Yedek parça bekleniyor.', cost: 8500 },
  ]},
  { id: 'CZ-005', name: 'Anestezi Cihazı', brand: 'Dräger', model: 'Perseus A500', serialNo: 'SN-DRG-2020-002', category: 'Anestezi', dept: 'Ameliyathane', location: 'Salon 2', purchaseDate: '05.05.2020', warrantyEnd: '05.05.2023', expectedLife: 12, lastMaintenance: '05.02.2026', nextMaintenance: '05.05.2026', lastCalibration: '05.02.2026', nextCalibration: '05.08.2026', status: 'Aktif', riskClass: 'IIb', udiCode: 'UDI-DRG-PA500-002', responsible: 'Biyomed. Müh. Kemal T.', maintenanceHistory: [] },
  { id: 'CZ-006', name: 'İnfüzyon Pompası', brand: 'B. Braun', model: 'Infusomat Space', serialNo: 'SN-BB-2023-042', category: 'İnfüzyon', dept: 'Dahiliye Servisi', location: 'Oda 302', purchaseDate: '15.08.2023', warrantyEnd: '15.08.2026', expectedLife: 7, lastMaintenance: '15.12.2025', nextMaintenance: '15.06.2026', lastCalibration: '15.12.2025', nextCalibration: '15.06.2026', status: 'Aktif', riskClass: 'IIb', udiCode: 'UDI-BB-ISP-042', responsible: 'Biyomed. Müh. Kemal T.', maintenanceHistory: [] },
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

export function MedicalDeviceModule() {
  const [selectedDevice, setSelectedDevice] = useState<MedicalDevice | null>(null);
  const [searchText, setSearchText] = useState('');

  const filtered = mockDevices.filter(d => !searchText || d.name.toLowerCase().includes(searchText.toLowerCase()) || d.dept.toLowerCase().includes(searchText.toLowerCase()));
  const statusColor = (s: string) => s === 'Aktif' ? 'green' : s === 'Bakımda' ? 'amber' : s === 'Arızalı' ? 'red' : s === 'Depo' ? 'slate' : 'red';
  const riskColor = (r: string) => r === 'III' ? 'red' : r === 'IIb' ? 'amber' : r === 'IIa' ? 'blue' : 'green';
  const needsMaintenance = mockDevices.filter(d => d.nextMaintenance <= '15.04.2026').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tıbbi Cihaz Takip Sistemi</h2>
          <p className="text-sm text-slate-500">Cihaz envanteri, bakım/kalibrasyon planlaması, UDI takip, risk sınıflandırması</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-none">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200"><p className="text-xs font-bold text-blue-700 uppercase">Toplam Cihaz</p><p className="text-2xl font-black text-blue-600">{mockDevices.length}</p></div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200"><p className="text-xs font-bold text-emerald-700 uppercase">Aktif</p><p className="text-2xl font-black text-emerald-600">{mockDevices.filter(d => d.status === 'Aktif').length}</p></div>
        <div className={twMerge("p-4 rounded-xl border", needsMaintenance > 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}><p className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1"><Wrench size={14} /> Bakım Yaklaşan</p><p className="text-2xl font-black text-amber-600">{needsMaintenance}</p></div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200"><p className="text-xs font-bold text-red-700 uppercase">Arızalı / Bakımda</p><p className="text-2xl font-black text-red-600">{mockDevices.filter(d => d.status === 'Arızalı' || d.status === 'Bakımda').length}</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex-none flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-2 text-slate-400" size={16} />
            <input type="text" placeholder="Cihaz / Birim ara..." value={searchText} onChange={e => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.map(d => (
            <div key={d.id} onClick={() => setSelectedDevice(d)} className={twMerge("p-4 hover:bg-slate-50 cursor-pointer transition-colors",
              d.status === 'Bakımda' || d.status === 'Arızalı' ? 'bg-amber-50/20' : ''
            )}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">{d.name}</span>
                    <Badge color={statusColor(d.status)}>{d.status}</Badge>
                    <Badge color={riskColor(d.riskClass)}>Sınıf {d.riskClass}</Badge>
                  </div>
                  <p className="text-xs text-slate-600">{d.brand} {d.model} • SN: {d.serialNo}</p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2"><MapPin size={12} /> {d.dept} — {d.location}</p>
                  <div className="flex gap-3 mt-1 text-[10px] text-slate-400">
                    <span>Bakım: {d.nextMaintenance}</span>
                    <span>Kalibrasyon: {d.nextCalibration}</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!selectedDevice} onClose={() => setSelectedDevice(null)} title={`Cihaz Detay — ${selectedDevice?.name || ''}`}>
        {selectedDevice && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div><span className="text-slate-500 block text-xs">Marka / Model</span><span className="font-bold">{selectedDevice.brand} {selectedDevice.model}</span></div>
              <div><span className="text-slate-500 block text-xs">Seri No</span><span className="font-mono font-bold">{selectedDevice.serialNo}</span></div>
              <div><span className="text-slate-500 block text-xs">UDI</span><span className="font-mono text-xs">{selectedDevice.udiCode}</span></div>
              <div><span className="text-slate-500 block text-xs">Birim / Konum</span><span className="font-bold">{selectedDevice.dept} — {selectedDevice.location}</span></div>
              <div><span className="text-slate-500 block text-xs">Alım / Garanti</span><span className="font-bold">{selectedDevice.purchaseDate} / {selectedDevice.warrantyEnd}</span></div>
              <div><span className="text-slate-500 block text-xs">Risk Sınıfı</span><Badge color={riskColor(selectedDevice.riskClass)}>Sınıf {selectedDevice.riskClass}</Badge></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border bg-blue-50 border-blue-200 text-center"><p className="text-xs text-blue-600">Son Bakım</p><p className="text-sm font-bold text-blue-800">{selectedDevice.lastMaintenance}</p></div>
              <div className={`p-3 rounded-xl border text-center ${selectedDevice.nextMaintenance <= '15.04.2026' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}><p className="text-xs text-slate-600">Sonraki Bakım</p><p className={`text-sm font-bold ${selectedDevice.nextMaintenance <= '15.04.2026' ? 'text-amber-700' : 'text-slate-800'}`}>{selectedDevice.nextMaintenance}</p></div>
              <div className="p-3 rounded-xl border bg-purple-50 border-purple-200 text-center"><p className="text-xs text-purple-600">Son Kalibrasyon</p><p className="text-sm font-bold text-purple-800">{selectedDevice.lastCalibration}</p></div>
              <div className="p-3 rounded-xl border bg-slate-50 border-slate-200 text-center"><p className="text-xs text-slate-600">Sonraki Kalibrasyon</p><p className="text-sm font-bold text-slate-800">{selectedDevice.nextCalibration}</p></div>
            </div>

            {selectedDevice.maintenanceHistory.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Bakım Geçmişi</h4>
                <div className="space-y-2">
                  {selectedDevice.maintenanceHistory.map((m, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="flex justify-between mb-1"><span className="text-xs font-bold text-slate-800">{m.date} — {m.type}</span><span className="text-xs text-emerald-600 font-bold">{m.cost.toLocaleString('tr-TR')} TL</span></div>
                      <p className="text-xs text-slate-600">{m.notes}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Teknisyen: {m.technician}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-slate-600"><span className="text-slate-500">Sorumlu:</span> <strong>{selectedDevice.responsible}</strong></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
