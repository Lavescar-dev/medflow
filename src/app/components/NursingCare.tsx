import React, { useState } from 'react';
import { ClipboardList, User, Pill, Heart, Activity, Clock, CheckCircle2, AlertTriangle, Search, Plus, X, Edit3, Eye, Thermometer, Wind, BedDouble, Droplet, ShieldAlert, FileText, Save, Calculator, Send, Printer, ArrowRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface NursingTask {
  id: string; time: string; patient: string; room: string; type: 'ilac' | 'bakim' | 'vital' | 'pansusman' | 'beslenme' | 'egitim';
  description: string; priority: 'normal' | 'acil' | 'zamanli'; done: boolean; nurse: string;
}

interface PatientAssessment {
  id: number; name: string; room: string; bed: string;
  morseScore: number; morseRisk: string; bradenScore: number; bradenRisk: string;
  glasgowScore: number; painScore: number; fallRisk: boolean; pressureRisk: boolean;
  nursingDx: string[]; careGoals: string[];
  status: 'Aktif' | 'Taburcu Planlanan';
  intakeOutput: { intake: number; output: number };
}

const mockTasks: NursingTask[] = [
  { id: 'T1', time: '08:00', patient: 'Mustafa Yılmaz', room: '301-A', type: 'ilac', description: 'Seftriakson 1g IV uygulama', priority: 'zamanli', done: true, nurse: 'Hmş. Fatma K.' },
  { id: 'T2', time: '08:00', patient: 'Zeynep Kaya', room: '302-A', type: 'ilac', description: 'Nebül (Salbutamol+İpratropium) uygulama', priority: 'zamanli', done: true, nurse: 'Hmş. Aysel T.' },
  { id: 'T3', time: '09:00', patient: 'Tüm Servis', room: 'Genel', type: 'vital', description: 'Vital bulgu turu (tüm hastalar)', priority: 'normal', done: true, nurse: 'Hmş. Fatma K.' },
  { id: 'T4', time: '10:00', patient: 'Zeynep Kaya', room: '302-A', type: 'vital', description: 'AKG kontrolü için kan alınması', priority: 'acil', done: false, nurse: 'Hmş. Aysel T.' },
  { id: 'T5', time: '10:00', patient: 'Mustafa Yılmaz', room: '301-A', type: 'bakim', description: 'Hemogram+CRP kontrolü için kan alınması', priority: 'normal', done: true, nurse: 'Hmş. Fatma K.' },
  { id: 'T6', time: '12:00', patient: 'Mustafa Yılmaz', room: '301-A', type: 'ilac', description: 'Seftriakson 1g IV uygulama (2. doz)', priority: 'zamanli', done: false, nurse: 'Hmş. Fatma K.' },
  { id: 'T7', time: '12:00', patient: 'Fatma Şahin', room: '303-A', type: 'beslenme', description: 'Oral sıvı başlatılması (Post-op)', priority: 'normal', done: false, nurse: 'Hmş. Derya S.' },
  { id: 'T8', time: '14:00', patient: 'Fatma Şahin', room: '303-A', type: 'pansusman', description: 'Pansuman değişimi (Lap. kesi yerleri)', priority: 'normal', done: false, nurse: 'Hmş. Derya S.' },
  { id: 'T9', time: '14:00', patient: 'Zeynep Kaya', room: '302-A', type: 'bakim', description: 'Göğüs Hast. konsültasyon takip', priority: 'normal', done: false, nurse: 'Hmş. Aysel T.' },
  { id: 'T10', time: '14:00', patient: 'Tüm Servis', room: 'Genel', type: 'vital', description: 'Vital bulgu turu (2. tur)', priority: 'normal', done: false, nurse: 'Hmş. Fatma K.' },
  { id: 'T11', time: '16:00', patient: 'Fatma Şahin', room: '303-A', type: 'bakim', description: 'Mobilizasyon başlatılması', priority: 'normal', done: false, nurse: 'Hmş. Derya S.' },
  { id: 'T12', time: '16:00', patient: 'Mehmet Demir', room: '303-B', type: 'vital', description: 'TA takibi (4 saatte bir)', priority: 'zamanli', done: false, nurse: 'Hmş. Derya S.' },
  { id: 'T13', time: '08:30', patient: 'Ali Çelik', room: '301-B', type: 'egitim', description: 'Taburculuk eğitimi (diyet, ilaç)', priority: 'normal', done: false, nurse: 'Hmş. Fatma K.' },
];

const mockAssessments: PatientAssessment[] = [
  { id: 1, name: 'Mustafa Yılmaz', room: '301', bed: 'A', morseScore: 35, morseRisk: 'Düşük', bradenScore: 18, bradenRisk: 'Risk Yok', glasgowScore: 15, painScore: 2, fallRisk: false, pressureRisk: false, nursingDx: ['Enfeksiyon riski (IV kateter)', 'Aktivite intoleransı'], careGoals: ['Enfeksiyon belirtileri izlenecek', 'Mobilizasyon artırılacak'], status: 'Aktif', intakeOutput: { intake: 2200, output: 1800 } },
  { id: 2, name: 'Zeynep Kaya', room: '302', bed: 'A', morseScore: 65, morseRisk: 'Yüksek', bradenScore: 14, bradenRisk: 'Orta Risk', glasgowScore: 15, painScore: 3, fallRisk: true, pressureRisk: true, nursingDx: ['Gaz değişiminde bozulma', 'Düşme riski', 'Cilt bütünlüğünde bozulma riski'], careGoals: ['SpO2 > %92 hedef', 'Yatak kenarları yukarı', 'Pozisyon değişimi /2 saat'], status: 'Aktif', intakeOutput: { intake: 1800, output: 2100 } },
  { id: 3, name: 'Fatma Şahin', room: '303', bed: 'A', morseScore: 55, morseRisk: 'Orta', bradenScore: 16, bradenRisk: 'Düşük Risk', glasgowScore: 15, painScore: 4, fallRisk: true, pressureRisk: false, nursingDx: ['Akut ağrı (cerrahi)', 'Beslenme değişikliği riski'], careGoals: ['VAS < 4 hedef', 'Oral alım tolere edilecek', 'Erken mobilizasyon'], status: 'Aktif', intakeOutput: { intake: 1500, output: 1200 } },
  { id: 4, name: 'Mehmet Demir', room: '303', bed: 'B', morseScore: 45, morseRisk: 'Orta', bradenScore: 17, bradenRisk: 'Düşük Risk', glasgowScore: 15, painScore: 1, fallRisk: false, pressureRisk: false, nursingDx: ['Bilgi eksikliği (HT yönetimi)'], careGoals: ['TA <140/90 hedef', 'Hasta eğitimi'], status: 'Aktif', intakeOutput: { intake: 2000, output: 1900 } },
  { id: 5, name: 'Ali Çelik', room: '301', bed: 'B', morseScore: 20, morseRisk: 'Düşük', bradenScore: 20, bradenRisk: 'Risk Yok', glasgowScore: 15, painScore: 0, fallRisk: false, pressureRisk: false, nursingDx: ['Bilgi eksikliği (taburculuk)'], careGoals: ['Taburculuk eğitimi tamamlanacak'], status: 'Taburcu Planlanan', intakeOutput: { intake: 1800, output: 1700 } },
];

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = { blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100', red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100', purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200', cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', orange: 'bg-orange-50 text-orange-700 border-orange-100' };
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

export function NursingCare() {
  const [tasks, setTasks] = useState(mockTasks);
  const [activeView, setActiveView] = useState<'gorevler' | 'degerlendirme' | 'teslim'>('gorevler');
  const [selectedAssessment, setSelectedAssessment] = useState<PatientAssessment | null>(null);
  const [nurseFilter, setNurseFilter] = useState('Tümü');
  const [showGlasgow, setShowGlasgow] = useState(false);
  const [showMorse, setShowMorse] = useState(false);

  // Glasgow Calculator
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  // Morse Calculator
  const [morseHistory, setMorseHistory] = useState(false);
  const [morseSecondary, setMorseSecondary] = useState(false);
  const [morseAmbulatory, setMorseAmbulatory] = useState(0);
  const [morseIV, setMorseIV] = useState(false);
  const [morseGait, setMorseGait] = useState(0);
  const [morseMental, setMorseMental] = useState(0);

  const toggleTask = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.done).length;
  const pendingUrgent = tasks.filter(t => !t.done && t.priority === 'acil').length;
  const nurses = [...new Set(tasks.map(t => t.nurse))];
  const filteredTasks = nurseFilter === 'Tümü' ? tasks : tasks.filter(t => t.nurse === nurseFilter);

  const typeIcon = (t: string) => t === 'ilac' ? '💊' : t === 'vital' ? '❤️' : t === 'pansusman' ? '🩹' : t === 'beslenme' ? '🍽️' : t === 'egitim' ? '📚' : '📋';
  const typeColor = (t: string) => t === 'ilac' ? 'green' : t === 'vital' ? 'red' : t === 'pansusman' ? 'purple' : t === 'beslenme' ? 'amber' : t === 'egitim' ? 'cyan' : 'blue';

  const morseTotal = (morseHistory ? 25 : 0) + (morseSecondary ? 15 : 0) + morseAmbulatory + (morseIV ? 20 : 0) + morseGait + morseMental;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Hemşirelik Bakım Modülü</h2>
          <p className="text-sm text-slate-500">Görev takibi, GKS/Morse/Braden skorlama, aldığı-çıkardığı, teslim formu</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowGlasgow(true)} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700"><Calculator size={14} /> GKS</button>
          <button onClick={() => setShowMorse(true)} className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700"><Calculator size={14} /> Morse</button>
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setActiveView('gorevler')} className={twMerge("px-3 py-1.5 rounded text-xs font-semibold", activeView === 'gorevler' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500')}>Görevler</button>
            <button onClick={() => setActiveView('degerlendirme')} className={twMerge("px-3 py-1.5 rounded text-xs font-semibold", activeView === 'degerlendirme' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500')}>Değerlendirme</button>
            <button onClick={() => setActiveView('teslim')} className={twMerge("px-3 py-1.5 rounded text-xs font-semibold", activeView === 'teslim' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500')}>Teslim Formu</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-none">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200"><p className="text-[10px] font-bold text-blue-600 uppercase">Toplam Görev</p><p className="text-xl font-black text-blue-700 mt-0.5">{totalTasks}</p></div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200"><p className="text-[10px] font-bold text-emerald-600 uppercase">Tamamlanan</p><p className="text-xl font-black text-emerald-700 mt-0.5">{doneTasks}</p></div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200"><p className="text-[10px] font-bold text-amber-600 uppercase">Bekleyen</p><p className="text-xl font-black text-amber-700 mt-0.5">{totalTasks - doneTasks}</p></div>
        <div className="bg-red-50 p-3 rounded-xl border border-red-200"><p className="text-[10px] font-bold text-red-600 uppercase">Acil Bekleyen</p><p className="text-xl font-black text-red-700 mt-0.5">{pendingUrgent}</p></div>
      </div>

      {activeView === 'gorevler' && (
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-0">
          <div className="p-3 border-b border-slate-100 flex justify-between items-center flex-none bg-slate-50/50">
            <div className="flex gap-2 items-center">
              <h3 className="font-semibold text-slate-800 text-sm">Günlük Görev Listesi</h3>
              <select value={nurseFilter} onChange={e => setNurseFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600">
                <option value="Tümü">Tüm Hemşireler</option>
                {nurses.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(doneTasks / totalTasks) * 100}%` }}></div></div>
              <span className="text-xs font-semibold text-slate-500">{Math.round((doneTasks / totalTasks) * 100)}%</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredTasks.sort((a, b) => a.time.localeCompare(b.time)).map(task => (
              <div key={task.id} className={twMerge("flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors",
                task.done && "opacity-50", !task.done && task.priority === 'acil' && "bg-red-50/50"
              )}>
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="w-4 h-4 rounded accent-emerald-500 cursor-pointer flex-shrink-0" />
                <div className="w-14 flex-shrink-0">
                  <span className={twMerge("text-[10px] font-bold px-1.5 py-0.5 rounded",
                    task.done ? 'bg-slate-100 text-slate-400' : task.priority === 'acil' ? 'bg-red-100 text-red-700' : task.priority === 'zamanli' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  )}>{task.time}</span>
                </div>
                <span className="text-sm flex-shrink-0">{typeIcon(task.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className={twMerge("text-xs font-medium", task.done ? "line-through text-slate-400" : "text-slate-800")}>{task.description}</p>
                  <p className="text-[10px] text-slate-500">{task.room} — {task.patient}</p>
                </div>
                <Badge color={typeColor(task.type)}>{task.type === 'ilac' ? 'İlaç' : task.type === 'vital' ? 'Vital' : task.type === 'pansusman' ? 'Pansuman' : task.type === 'beslenme' ? 'Beslenme' : task.type === 'egitim' ? 'Eğitim' : 'Bakım'}</Badge>
                <span className="text-[9px] text-slate-400 flex-shrink-0 hidden md:block">{task.nurse}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'degerlendirme' && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAssessments.map(a => (
              <div key={a.id} onClick={() => setSelectedAssessment(a)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">{a.room}-{a.bed}</span>
                    <h4 className="font-bold text-sm text-slate-800">{a.name}</h4>
                  </div>
                  <Badge color={a.status === 'Aktif' ? 'blue' : 'amber'}>{a.status}</Badge>
                </div>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {[
                    { label: 'Morse', value: a.morseScore, risk: a.morseRisk, warn: a.morseScore >= 45 },
                    { label: 'Braden', value: a.bradenScore, risk: a.bradenRisk, warn: a.bradenScore <= 15 },
                    { label: 'GKS', value: a.glasgowScore, risk: `${a.glasgowScore}/15`, warn: a.glasgowScore < 15 },
                    { label: 'VAS', value: a.painScore, risk: `${a.painScore}/10`, warn: a.painScore >= 4 },
                    { label: 'Sıvı', value: `${a.intakeOutput.intake - a.intakeOutput.output > 0 ? '+' : ''}${a.intakeOutput.intake - a.intakeOutput.output}`, risk: 'ml', warn: Math.abs(a.intakeOutput.intake - a.intakeOutput.output) > 500 },
                  ].map((s, i) => (
                    <div key={i} className={`text-center p-1.5 rounded border text-[9px] ${s.warn ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                      <span className="block text-slate-400">{s.label}</span>
                      <span className={`font-bold ${s.warn ? 'text-red-600' : 'text-slate-700'}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {a.nursingDx.map((dx, i) => <span key={i} className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">{dx}</span>)}
                </div>
                {(a.fallRisk || a.pressureRisk) && (
                  <div className="flex gap-1.5 mt-1.5">
                    {a.fallRisk && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">Düşme Riski</span>}
                    {a.pressureRisk && <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-bold">Bası Yarası Riski</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'teslim' && (
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ArrowRight size={20} className="text-blue-500" /> Hemşire Teslim Formu (SBAR)</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Save size={12} /> Kaydet</button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Printer size={12} /> Yazdır</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
              <div><label className="text-slate-600 block mb-1 font-semibold">Teslim Eden</label><input className="w-full px-3 py-2 border border-slate-300 rounded-lg" defaultValue="Hmş. Fatma Kılıç" /></div>
              <div><label className="text-slate-600 block mb-1 font-semibold">Teslim Alan</label><input className="w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Hemşire adı" /></div>
              <div><label className="text-slate-600 block mb-1 font-semibold">Nöbet</label><select className="w-full px-3 py-2 border border-slate-300 rounded-lg"><option>Sabah → Akşam</option><option>Akşam → Gece</option><option>Gece → Sabah</option></select></div>
              <div><label className="text-slate-600 block mb-1 font-semibold">Tarih/Saat</label><input className="w-full px-3 py-2 border border-slate-300 rounded-lg" defaultValue="07.04.2026 16:00" /></div>
            </div>

            <div className="space-y-3">
              {mockAssessments.filter(a => a.status === 'Aktif').map(a => (
                <div key={a.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-xs px-2 py-1 rounded bg-slate-800 text-white">{a.room}-{a.bed}</span>
                    <h4 className="font-bold text-sm text-slate-800">{a.name}</h4>
                    {a.fallRisk && <Badge color="red">Düşme</Badge>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">S — Durum (Situation)</label>
                      <textarea rows={2} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs resize-none" placeholder="Hastanın mevcut durumu..." />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">B — Özgeçmiş (Background)</label>
                      <textarea rows={2} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs resize-none" defaultValue={a.nursingDx.join(', ')} />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">A — Değerlendirme (Assessment)</label>
                      <textarea rows={2} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs resize-none" defaultValue={`Morse:${a.morseScore} Braden:${a.bradenScore} VAS:${a.painScore}`} />
                    </div>
                    <div>
                      <label className="text-slate-500 font-semibold block mb-1">R — Öneri (Recommendation)</label>
                      <textarea rows={2} className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs resize-none" defaultValue={a.careGoals.join('; ')} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assessment Detail Modal */}
      <Modal open={!!selectedAssessment} onClose={() => setSelectedAssessment(null)} title={`Hemşirelik Değerlendirmesi — ${selectedAssessment?.name || ''}`}>
        {selectedAssessment && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Morse Düşme', value: selectedAssessment.morseScore, sub: selectedAssessment.morseRisk, warn: selectedAssessment.morseScore >= 45 },
                { label: 'Braden Bası', value: selectedAssessment.bradenScore, sub: selectedAssessment.bradenRisk, warn: selectedAssessment.bradenScore <= 15 },
                { label: 'Glasgow (GKS)', value: selectedAssessment.glasgowScore, sub: `${selectedAssessment.glasgowScore}/15`, warn: selectedAssessment.glasgowScore < 15 },
                { label: 'Ağrı (VAS)', value: selectedAssessment.painScore, sub: `${selectedAssessment.painScore}/10`, warn: selectedAssessment.painScore >= 4 },
                { label: 'Sıvı Dengesi', value: `${selectedAssessment.intakeOutput.intake - selectedAssessment.intakeOutput.output > 0 ? '+' : ''}${selectedAssessment.intakeOutput.intake - selectedAssessment.intakeOutput.output}`, sub: 'ml', warn: Math.abs(selectedAssessment.intakeOutput.intake - selectedAssessment.intakeOutput.output) > 500 },
              ].map((s, i) => (
                <div key={i} className={`p-3 rounded-xl border text-center ${s.warn ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                  <p className={`text-2xl font-black mt-0.5 ${s.warn ? 'text-red-600' : 'text-slate-800'}`}>{s.value}</p>
                  <p className="text-[10px] text-slate-400">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* I/O Detail */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                <p className="text-[10px] text-blue-600 uppercase font-bold">Aldığı</p>
                <p className="text-xl font-black text-blue-700">{selectedAssessment.intakeOutput.intake} ml</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                <p className="text-[10px] text-amber-600 uppercase font-bold">Çıkardığı</p>
                <p className="text-xl font-black text-amber-700">{selectedAssessment.intakeOutput.output} ml</p>
              </div>
              <div className={`p-3 rounded-xl border text-center ${Math.abs(selectedAssessment.intakeOutput.intake - selectedAssessment.intakeOutput.output) > 500 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <p className="text-[10px] uppercase font-bold">Denge</p>
                <p className="text-xl font-black">{selectedAssessment.intakeOutput.intake - selectedAssessment.intakeOutput.output > 0 ? '+' : ''}{selectedAssessment.intakeOutput.intake - selectedAssessment.intakeOutput.output} ml</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Hemşirelik Tanıları (NANDA)</h4>
              <div className="space-y-1.5">
                {selectedAssessment.nursingDx.map((dx, i) => (
                  <div key={i} className="bg-blue-50 p-2.5 rounded-lg border border-blue-200 text-xs text-blue-800 font-medium">{i + 1}. {dx}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2">Bakım Hedefleri (NOC)</h4>
              <div className="space-y-1.5">
                {selectedAssessment.careGoals.map((g, i) => (
                  <div key={i} className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" /> {g}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"><Save size={12} /> Güncelle</button>
              <button className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"><Printer size={12} /> Bakım Planı Yazdır</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Glasgow Calculator */}
      <Modal open={showGlasgow} onClose={() => setShowGlasgow(false)} title="Glasgow Koma Skalası (GKS) Hesaplayıcı">
        <div className="space-y-4">
          {[
            { label: 'Göz Açma (E)', value: gcsEye, set: setGcsEye, options: [
              { v: 1, l: 'Açma yok' }, { v: 2, l: 'Ağrıya' }, { v: 3, l: 'Sesli uyarana' }, { v: 4, l: 'Spontan' }
            ]},
            { label: 'Sözel Yanıt (V)', value: gcsVerbal, set: setGcsVerbal, options: [
              { v: 1, l: 'Yanıt yok' }, { v: 2, l: 'Anlamsız sesler' }, { v: 3, l: 'Uygunsuz sözcükler' }, { v: 4, l: 'Konfüze konuşma' }, { v: 5, l: 'Oryante' }
            ]},
            { label: 'Motor Yanıt (M)', value: gcsMotor, set: setGcsMotor, options: [
              { v: 1, l: 'Yanıt yok' }, { v: 2, l: 'Ekstansör yanıt' }, { v: 3, l: 'Fleksör yanıt' }, { v: 4, l: 'Çekme' }, { v: 5, l: 'Lokalize etme' }, { v: 6, l: 'Emirlere uyma' }
            ]},
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-xs font-bold text-slate-700 mb-2">{s.label}</p>
              <div className="flex gap-1.5 flex-wrap">
                {s.options.map(o => (
                  <button key={o.v} onClick={() => s.set(o.v)}
                    className={twMerge("px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border",
                      s.value === o.v ? "bg-blue-500 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:bg-blue-50"
                    )}>{o.v} — {o.l}</button>
                ))}
              </div>
            </div>
          ))}
          <div className={`text-center p-5 rounded-xl border-2 ${gcsEye + gcsVerbal + gcsMotor <= 8 ? 'bg-red-50 border-red-300' : gcsEye + gcsVerbal + gcsMotor <= 12 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
            <p className="text-xs text-slate-500 uppercase">GKS = E{gcsEye} + V{gcsVerbal} + M{gcsMotor}</p>
            <p className="text-5xl font-black mt-1">{gcsEye + gcsVerbal + gcsMotor}<span className="text-lg font-normal text-slate-400">/15</span></p>
            <p className="text-sm font-bold mt-1">{gcsEye + gcsVerbal + gcsMotor <= 8 ? 'Ağır koma — Entübasyon değerlendir' : gcsEye + gcsVerbal + gcsMotor <= 12 ? 'Orta bilinç bozukluğu' : gcsEye + gcsVerbal + gcsMotor <= 14 ? 'Hafif bilinç bozukluğu' : 'Normal'}</p>
          </div>
        </div>
      </Modal>

      {/* Morse Fall Scale Calculator */}
      <Modal open={showMorse} onClose={() => setShowMorse(false)} title="Morse Düşme Riski Ölçeği">
        <div className="space-y-3">
          {[
            { label: 'Son 3 ayda düşme öyküsü', checked: morseHistory, set: setMorseHistory, score: 25, type: 'check' as const },
            { label: 'İkincil tanı (≥2 tanı)', checked: morseSecondary, set: setMorseSecondary, score: 15, type: 'check' as const },
          ].map((item, i) => (
            <label key={i} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={item.checked} onChange={e => (item.set as (v: boolean) => void)(e.target.checked)} className="w-4 h-4 accent-amber-500" />
                <span className="text-xs text-slate-700">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-amber-600">{item.checked ? item.score : 0} puan</span>
            </label>
          ))}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-700 block mb-1.5">Yürüme yardımcısı</span>
            <div className="flex gap-1.5">
              {[{ v: 0, l: 'Yok / Yatak istirahati / Hmş' }, { v: 15, l: 'Koltuk değneği / Baston' }, { v: 30, l: 'Mobilyaya tutunma' }].map(o => (
                <button key={o.v} onClick={() => setMorseAmbulatory(o.v)}
                  className={twMerge("flex-1 px-2 py-1.5 rounded text-[10px] font-semibold border", morseAmbulatory === o.v ? "bg-amber-500 text-white border-amber-600" : "bg-white text-slate-600 border-slate-200")}>{o.l} ({o.v})</button>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={morseIV} onChange={e => setMorseIV(e.target.checked)} className="w-4 h-4 accent-amber-500" />
              <span className="text-xs text-slate-700">IV tedavi / Heparin kilit</span>
            </div>
            <span className="text-xs font-bold text-amber-600">{morseIV ? 20 : 0} puan</span>
          </label>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-700 block mb-1.5">Yürüyüş</span>
            <div className="flex gap-1.5">
              {[{ v: 0, l: 'Normal / İstirahat' }, { v: 10, l: 'Zayıf' }, { v: 20, l: 'Bozuk / Yardımlı' }].map(o => (
                <button key={o.v} onClick={() => setMorseGait(o.v)}
                  className={twMerge("flex-1 px-2 py-1.5 rounded text-[10px] font-semibold border", morseGait === o.v ? "bg-amber-500 text-white border-amber-600" : "bg-white text-slate-600 border-slate-200")}>{o.l} ({o.v})</button>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-700 block mb-1.5">Mental durum</span>
            <div className="flex gap-1.5">
              {[{ v: 0, l: 'Kendi sınırlarını bilir' }, { v: 15, l: 'Sınırlarını bilmez / Unutur' }].map(o => (
                <button key={o.v} onClick={() => setMorseMental(o.v)}
                  className={twMerge("flex-1 px-2 py-1.5 rounded text-[10px] font-semibold border", morseMental === o.v ? "bg-amber-500 text-white border-amber-600" : "bg-white text-slate-600 border-slate-200")}>{o.l} ({o.v})</button>
              ))}
            </div>
          </div>
          <div className={`text-center p-4 rounded-xl border-2 ${morseTotal >= 45 ? 'bg-red-50 border-red-300' : morseTotal >= 25 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'}`}>
            <p className="text-xs text-slate-500 uppercase">Morse Düşme Risk Skoru</p>
            <p className="text-4xl font-black mt-1">{morseTotal}</p>
            <p className="text-sm font-bold mt-1">{morseTotal >= 45 ? 'Yüksek Risk — Düşme önlemleri uygula' : morseTotal >= 25 ? 'Orta Risk — Standart önlemler' : 'Düşük Risk'}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
