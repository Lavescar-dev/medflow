import React, { useState, useEffect } from 'react';
import {
  Microscope, CheckCircle2, Clock, AlertTriangle, FileText, X,
  Send, Printer, ChevronRight, FlaskConical, Timer,
  Beaker, BookOpen, Plus, Eye, Download
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PathologyCase {
  id: string; patient: string; age: string; gender: string;
  requestDept: string; requestDoctor: string; requestDate: string;
  type: 'Cerrahi Patoloji' | 'Sitoloji' | 'Frozen' | 'Biyopsi' | 'Mikrobiyoloji Kültür' | 'ARB' | 'Gram Boyama' | 'İHC Panel';
  specimen: string; site: string;
  status: 'Numune Alındı' | 'Fiksasyon' | 'İşlemde' | 'Bloklama' | 'Kesit' | 'Boyama' | 'Değerlendirmede' | 'Raporlandı' | 'Ekimde' | 'İnkübasyonda' | 'Üreme Var' | 'Sonuçlandı';
  priority: 'Normal' | 'Acil' | 'Frozen';
  pathologist: string; reportDate: string;
  macroscopy: string; microscopy: string; diagnosis: string;
  icd10: string; tnmStage: string; whoGrade: string;
  cultureResult: string; organism: string;
  antibiogram: { antibiotic: string; result: 'S' | 'I' | 'R'; mic: string }[];
  ihcPanel: { marker: string; result: string; interpretation: string }[];
  notes: string;
  grossPhotos: number;
}

const mockCases: PathologyCase[] = [
  {
    id: 'PAT-2026-0421', patient: 'Fatma Şahin', age: '50', gender: 'K',
    requestDept: 'Genel Cerrahi', requestDoctor: 'Op. Dr. Sinan K.', requestDate: '07.04.2026',
    type: 'Cerrahi Patoloji', specimen: 'Safra Kesesi (Lap. Kolesistektomi)', site: 'Safra Kesesi',
    status: 'Boyama', priority: 'Normal', pathologist: '', reportDate: '',
    macroscopy: '7x4x3 cm boyutlarında safra kesesi. Lümen açıldığında 3–8mm çaplı multipl sarımsı taşlar izlendi. Mukoza yeşilimsi, yer yer hiperemik.',
    microscopy: '', diagnosis: '',
    icd10: 'K80.2', tnmStage: '', whoGrade: '',
    cultureResult: '', organism: '',
    antibiogram: [], ihcPanel: [],
    notes: 'Lap. kolesistektomi materyali. Rutin patoloji. H&E + PAS boyama yapılacak.',
    grossPhotos: 3
  },
  {
    id: 'PAT-2026-0422', patient: 'Ali Çelik', age: '55', gender: 'E',
    requestDept: 'Gastroenteroloji', requestDoctor: 'Uzm. Dr. Can S.', requestDate: '05.04.2026',
    type: 'Biyopsi', specimen: 'Mide Antrum Biyopsisi (x4)', site: 'Mide Antrum',
    status: 'Raporlandı', priority: 'Normal', pathologist: 'Uzm. Dr. Patolog Ayşe N.', reportDate: '07.04.2026',
    macroscopy: '4 adet, en büyüğü 3mm çaplı, beyazımsı-pembe doku fragmanları.',
    microscopy: 'Antral tip mide mukozası. Foveolar hiperplazi mevcut. Lamina propriada orta yoğunlukta kronik inflamatuvar hücre infiltrasyonu. Giemsa boyamada H. pylori (+). Metaplazi izlenmedi.',
    diagnosis: 'Kronik aktif gastrit, H. pylori pozitif. İntestinal metaplazi yok.',
    icd10: 'K29.5', tnmStage: '', whoGrade: '',
    cultureResult: '', organism: '',
    antibiogram: [], ihcPanel: [],
    notes: 'H. pylori eradikasyon tedavisi önerilir. Kontrol gastroskopi planlanmalı.',
    grossPhotos: 2
  },
  {
    id: 'PAT-2026-0423', patient: 'Hasan Öztürk', age: '38', gender: 'E',
    requestDept: 'Ortopedi', requestDoctor: 'Doç. Dr. Murat A.', requestDate: '07.04.2026',
    type: 'Frozen', specimen: 'Sol Diz Medial Menisküs', site: 'Diz Menisküs',
    status: 'Raporlandı', priority: 'Frozen', pathologist: 'Uzm. Dr. Patolog Ayşe N.', reportDate: '07.04.2026',
    macroscopy: '2.5x1x0.5 cm boyutlarında beyazımsı-gri fibroz doku.',
    microscopy: 'Fibrokartilagenöz doku. Dejeneratif değişiklikler ve yırtık hattı mevcut. Malignensi saptanmadı.',
    diagnosis: 'Dejeneratif menisküs yırtığı. MALİGNENSİ YOK.',
    icd10: 'M23.2', tnmStage: '', whoGrade: '',
    cultureResult: '', organism: '',
    antibiogram: [], ihcPanel: [],
    notes: 'İntraoperatif frozen. Sonuç ameliyathaneye 22 dakikada bildirildi. Malignensi yok.',
    grossPhotos: 2
  },
  {
    id: 'PAT-2026-0424', patient: 'Emine Yıldız', age: '48', gender: 'K',
    requestDept: 'Genel Cerrahi', requestDoctor: 'Op. Dr. Sinan K.', requestDate: '04.04.2026',
    type: 'İHC Panel', specimen: 'Meme Core Biyopsi (IDC)', site: 'Sol Meme, Üst Dış Kadran',
    status: 'Raporlandı', priority: 'Acil', pathologist: 'Uzm. Dr. Patolog Ayşe N.', reportDate: '06.04.2026',
    macroscopy: '1.2cm çaplı, kirli beyaz-gri renkte sert kıvamlı doku.',
    microscopy: 'İnvaziv duktal karsinom (IDC), Grade 2 (Nottingham). Tübül formasyonu: 3, nükleer pleomorfizm: 2, mitoz: 1. LVI: Yok. DCIS komponenti: var (%10, kribriform patern).',
    diagnosis: 'İnvaziv Duktal Karsinom, Grade 2 (WHO). DCIS (+). LVI (-).',
    icd10: 'C50.4', tnmStage: 'pT2 pN0 M0 (Evre IIA)', whoGrade: 'Grade 2',
    cultureResult: '', organism: '',
    antibiogram: [],
    ihcPanel: [
      { marker: 'ER (Östrojen Reseptörü)', result: 'Pozitif (%90, yoğun)', interpretation: 'Hormonal tedaviye yanıt beklenir (Allred 8/8)' },
      { marker: 'PR (Progesteron Reseptörü)', result: 'Pozitif (%60, orta)', interpretation: 'Allred 6/8' },
      { marker: 'HER2/neu (IHC)', result: '2+ (Eşik değeri)', interpretation: 'FISH gerekli — Amplifikasyon belirsiz' },
      { marker: 'Ki-67 (Proliferasyon İndeksi)', result: '%18', interpretation: 'Orta proliferatif aktivite' },
      { marker: 'p53', result: 'Fokal pozitif (%10)', interpretation: 'Heterogen p53 mutasyonu desteklemiyor' },
      { marker: 'CK5/6', result: 'Negatif', interpretation: 'Bazal-like patern değil' },
    ],
    notes: 'Multidisipliner onkoloji kurulu toplantısına sunulacak. HER2 FISH testi istenmiştir.',
    grossPhotos: 4
  },
  {
    id: 'MIK-2026-0501', patient: 'Hatice Arslan', age: '65', gender: 'K',
    requestDept: 'Dahiliye', requestDoctor: 'Uzm. Dr. Ahmet K.', requestDate: '03.04.2026',
    type: 'Mikrobiyoloji Kültür', specimen: 'Balgam Kültürü', site: 'Solunum Yolu',
    status: 'Üreme Var', priority: 'Acil', pathologist: '', reportDate: '',
    macroscopy: '', microscopy: '', diagnosis: '',
    icd10: 'J18.9', tnmStage: '', whoGrade: '',
    cultureResult: 'Staphylococcus aureus (MRSA) izole edildi. Kolonizasyon >10⁵ CFU/mL.',
    organism: 'MRSA',
    antibiogram: [
      { antibiotic: 'Vankomisin', result: 'S', mic: '≤1 µg/mL' },
      { antibiotic: 'Linezolid', result: 'S', mic: '≤2 µg/mL' },
      { antibiotic: 'Daptomisin', result: 'S', mic: '≤0.5 µg/mL' },
      { antibiotic: 'TMP-SMX', result: 'S', mic: '≤2/38 µg/mL' },
      { antibiotic: 'Oksasilin', result: 'R', mic: '≥4 µg/mL' },
      { antibiotic: 'Ampisilin', result: 'R', mic: '≥0.5 µg/mL' },
      { antibiotic: 'Eritromisin', result: 'R', mic: '≥8 µg/mL' },
      { antibiotic: 'Klindamisin', result: 'I', mic: '1 µg/mL' },
      { antibiotic: 'Siprofloksasin', result: 'R', mic: '≥4 µg/mL' },
      { antibiotic: 'Tetrasiklin', result: 'S', mic: '≤1 µg/mL' },
    ],
    ihcPanel: [],
    notes: 'MRSA izolatı. Enfeksiyon kontrol komitesi bilgilendirildi. Temas izolasyonu uygulanıyor.',
    grossPhotos: 0
  },
  {
    id: 'MIK-2026-0502', patient: 'Ayşe Koç', age: '78', gender: 'K',
    requestDept: 'Yoğun Bakım', requestDoctor: 'Uzm. Dr. Can Y.', requestDate: '05.04.2026',
    type: 'Mikrobiyoloji Kültür', specimen: 'İdrar Kültürü', site: 'Üriner Sistem',
    status: 'Sonuçlandı', priority: 'Normal', pathologist: '', reportDate: '07.04.2026',
    macroscopy: '', microscopy: '', diagnosis: '',
    icd10: 'N39.0', tnmStage: '', whoGrade: '',
    cultureResult: 'E. coli >10⁵ CFU/mL izole edildi. GSBL pozitif.',
    organism: 'E. coli (GSBL+)',
    antibiogram: [
      { antibiotic: 'Meropenem', result: 'S', mic: '≤0.25 µg/mL' },
      { antibiotic: 'İmipenem', result: 'S', mic: '≤1 µg/mL' },
      { antibiotic: 'Ertapenem', result: 'S', mic: '≤0.5 µg/mL' },
      { antibiotic: 'Amikasin', result: 'S', mic: '≤4 µg/mL' },
      { antibiotic: 'Ampisilin', result: 'R', mic: '≥32 µg/mL' },
      { antibiotic: 'Seftriakson', result: 'R', mic: '≥64 µg/mL' },
      { antibiotic: 'Siprofloksasin', result: 'R', mic: '≥4 µg/mL' },
      { antibiotic: 'TMP-SMX', result: 'R', mic: '≥16/304 µg/mL' },
    ],
    ihcPanel: [],
    notes: 'GSBL (+) E. coli. Karbapenem tedavisi önerilir. Foley sonda çıkarılması değerlendirilmeli.',
    grossPhotos: 0
  },
  {
    id: 'MIK-2026-0503', patient: 'Selin Arslan', age: '22', gender: 'K',
    requestDept: 'Acil Servis', requestDoctor: 'Dr. Hakan Ç.', requestDate: '07.04.2026',
    type: 'Mikrobiyoloji Kültür', specimen: 'Kan Kültürü (2 Set)', site: 'Kan',
    status: 'İnkübasyonda', priority: 'Acil', pathologist: '', reportDate: '',
    macroscopy: '', microscopy: '', diagnosis: '',
    icd10: 'A41.9', tnmStage: '', whoGrade: '',
    cultureResult: 'Henüz üreme yok (24 saat). Aerobik + Anaerobik flakondalar inkübasyon devam ediyor.',
    organism: '',
    antibiogram: [], ihcPanel: [],
    notes: 'Travma sonrası sepsis şüphesi. 2x2 set kan kültürü alındı. 48 saat inkübasyonun beklenmesi gerekiyor.',
    grossPhotos: 0
  },
];

const workflowStages = [
  'Numune Alındı', 'Fiksasyon', 'İşlemde', 'Bloklama', 'Kesit', 'Boyama', 'Değerlendirmede', 'Raporlandı'
];

function FrozenTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (running) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };
  const isOver = seconds > 20 * 60;

  return (
    <div className={`p-4 rounded-xl border-2 ${isOver ? 'border-red-400 bg-red-50' : running ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Timer size={18} className={running ? 'text-amber-600' : 'text-slate-400'} />
          <span className="font-bold text-slate-700 text-sm">Frozen Bölüm Sayacı</span>
        </div>
        {running && isOver && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded animate-pulse font-black">⚠ 20 DK SINIRI AŞILDI</span>}
      </div>
      <div className={`text-4xl font-black text-center font-mono py-2 ${isOver ? 'text-red-600' : running ? 'text-amber-600' : 'text-slate-400'}`}>
        {formatTime(seconds)}
      </div>
      <p className="text-[10px] text-center text-slate-500 mb-3">CAP standardı: İntraoperatif frozen ≤20 dakika</p>
      <div className="flex gap-2 justify-center">
        <button onClick={() => setRunning(true)} disabled={running} className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 disabled:opacity-40">▶ Başlat</button>
        <button onClick={() => setRunning(false)} disabled={!running} className="px-3 py-1.5 bg-slate-600 text-white rounded-lg text-xs font-bold hover:bg-slate-700 disabled:opacity-40">⏸ Durdur</button>
        <button onClick={() => { setRunning(false); setSeconds(0); }} className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300">↺ Sıfırla</button>
      </div>
    </div>
  );
}

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', orange: 'bg-orange-50 text-orange-700 border-orange-100'
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children, size = 'xl' }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: string }) {
  if (!open) return null;
  const maxW = size === '2xl' ? 'max-w-6xl' : 'max-w-5xl';
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${maxW} w-full max-h-[92vh] flex flex-col`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

export function PathologyModule() {
  const [selectedCase, setSelectedCase] = useState<PathologyCase | null>(null);
  const [tab, setTab] = useState<'patoloji' | 'sitoloji' | 'frozen' | 'mikrobiyoloji'>('patoloji');

  const patCases = mockCases.filter(c => ['Cerrahi Patoloji', 'Biyopsi', 'İHC Panel'].includes(c.type));
  const frozenCases = mockCases.filter(c => c.type === 'Frozen' || c.priority === 'Frozen');
  const mikCases = mockCases.filter(c => ['Mikrobiyoloji Kültür', 'ARB', 'Gram Boyama'].includes(c.type));

  const typeColor = (t: string) => t === 'Frozen' ? 'red' : t === 'Cerrahi Patoloji' ? 'purple' : t === 'Biyopsi' ? 'blue' : t === 'Sitoloji' ? 'cyan' : t === 'İHC Panel' ? 'orange' : 'amber';
  const statusColor = (s: string) => s === 'Raporlandı' || s === 'Sonuçlandı' ? 'green' : s === 'Üreme Var' ? 'red' : ['İnkübasyonda', 'Ekimde', 'Boyama', 'Kesit'].includes(s) ? 'amber' : s === 'Değerlendirmede' ? 'blue' : 'slate';

  const currentCases = tab === 'patoloji' ? patCases : tab === 'frozen' ? frozenCases : mikCases;

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Patoloji & Mikrobiyoloji Laboratuvarı</h2>
          <p className="text-sm text-slate-500">Cerrahi patoloji, frozen section, IHC panel, kültür-antibiogram (MIC), TNM evreleme</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs font-semibold text-purple-700">
            <Microscope size={12} /> LIS Entegre
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200"><p className="text-[10px] font-bold text-purple-700 uppercase">Cerrahi Patoloji</p><p className="text-2xl font-black text-purple-600">{patCases.length}</p></div>
        <div className="bg-red-50 p-3 rounded-xl border border-red-200"><p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1"><Timer size={12} /> Frozen</p><p className="text-2xl font-black text-red-600">{frozenCases.length}</p></div>
        <div className="bg-orange-50 p-3 rounded-xl border border-orange-200"><p className="text-[10px] font-bold text-orange-700 uppercase">İHC Panel</p><p className="text-2xl font-black text-orange-600">{patCases.filter(c => c.type === 'İHC Panel').length}</p></div>
        <div className={twMerge("p-3 rounded-xl border", mikCases.some(c => c.status === 'Üreme Var') ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200")}><p className="text-[10px] font-bold text-amber-700 uppercase">Mikrobiyoloji</p><p className="text-2xl font-black text-amber-600">{mikCases.length}</p></div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200"><p className="text-[10px] font-bold text-emerald-700 uppercase">Raporlanan</p><p className="text-2xl font-black text-emerald-600">{mockCases.filter(c => ['Raporlandı', 'Sonuçlandı'].includes(c.status)).length}</p></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl flex-none">
        {[
          { id: 'patoloji' as const, label: 'Cerrahi Patoloji & IHC', count: patCases.length },
          { id: 'frozen' as const, label: 'Frozen Section', count: frozenCases.length },
          { id: 'mikrobiyoloji' as const, label: 'Mikrobiyoloji', count: mikCases.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={twMerge("px-4 py-2 text-xs font-semibold rounded-lg transition-colors",
              tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Case List */}
      {tab !== 'frozen' ? (
        <div className="flex-1 overflow-y-auto space-y-3">
          {currentCases.map(c => (
            <div key={c.id} onClick={() => setSelectedCase(c)}
              className={twMerge("bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all",
                c.status === 'Üreme Var' ? 'border-red-300' : c.priority === 'Frozen' ? 'border-red-200' : c.type === 'İHC Panel' ? 'border-orange-200' : 'border-slate-200')}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono text-slate-400">{c.id}</span>
                    <Badge color={typeColor(c.type)}>{c.type}</Badge>
                    <Badge color={statusColor(c.status)}>{c.status}</Badge>
                    {c.priority !== 'Normal' && <Badge color="red">{c.priority}</Badge>}
                    {c.organism && <Badge color="red">{c.organism}</Badge>}
                    {c.tnmStage && <Badge color="purple">{c.tnmStage}</Badge>}
                    {c.type === 'İHC Panel' && <Badge color="orange">IHC {c.ihcPanel.length} marker</Badge>}
                  </div>
                  <p className="text-sm font-bold text-slate-800">{c.patient} ({c.age} {c.gender})</p>
                  <p className="text-xs text-slate-600 mt-0.5">{c.specimen} — {c.site}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{c.requestDept} • {c.requestDoctor} • {c.requestDate}</p>
                  {c.diagnosis && <p className="text-xs text-emerald-700 mt-1 font-semibold bg-emerald-50 px-2 py-1 rounded inline-block">Tanı: {c.diagnosis.substring(0, 80)}...</p>}
                  {c.cultureResult && <p className="text-xs text-red-600 mt-1 font-semibold">{c.cultureResult}</p>}
                  {c.icd10 && <span className="text-[9px] font-mono text-blue-600 mt-0.5 inline-block">ICD-10: {c.icd10}</span>}
                </div>
                <ChevronRight size={16} className="text-slate-300 mt-1 flex-shrink-0" />
              </div>
              {/* Workflow stages for patoloji */}
              {['Cerrahi Patoloji', 'Biyopsi'].includes(c.type) && (
                <div className="mt-3 flex gap-1 overflow-x-auto">
                  {workflowStages.map((stage, i) => {
                    const currentIdx = workflowStages.indexOf(c.status);
                    const stageIdx = i;
                    return (
                      <div key={i} className={`flex-shrink-0 px-2 py-1 rounded text-[9px] font-bold border ${stageIdx < currentIdx ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        stageIdx === currentIdx ? 'bg-blue-100 text-blue-700 border-blue-300' :
                          'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        {stageIdx < currentIdx ? '✓ ' : stageIdx === currentIdx ? '► ' : ''}{stage}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FrozenTimer />
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Timer size={16} className="text-red-500" /> Frozen Section Vakaları</h4>
              {frozenCases.map(c => (
                <div key={c.id} onClick={() => setSelectedCase(c)}
                  className="bg-red-50 border border-red-200 rounded-xl p-3 mb-2 cursor-pointer hover:bg-red-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{c.patient} ({c.age} {c.gender})</p>
                      <p className="text-xs text-slate-600">{c.specimen}</p>
                      <p className="text-xs text-slate-500">{c.requestDoctor} • {c.requestDate}</p>
                    </div>
                    <Badge color={statusColor(c.status)}>{c.status}</Badge>
                  </div>
                  {c.diagnosis && (
                    <div className="mt-2 bg-white rounded-lg border border-emerald-200 p-2">
                      <p className="text-xs font-bold text-emerald-700">Sonuç: {c.diagnosis}</p>
                      <p className="text-[10px] text-slate-500">{c.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 bg-white rounded-xl border border-slate-200 p-5">
            <h4 className="font-bold text-slate-800 mb-3">Frozen Section Standart İş Akışı</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { step: '1', title: 'Numune Alındı', desc: 'Cerrahi materyal alımı, etiketleme', time: '00:00', ok: true },
                { step: '2', title: 'Makroskopi', desc: 'Gross muayene ve kesit alma', time: '03:00', ok: true },
                { step: '3', title: 'Kriyostatlama', desc: '-20°C kryostat ile kesit alımı', time: '08:00', ok: true },
                { step: '4', title: 'Boyama (H&E)', desc: 'Hızlandırılmış H&E boyama', time: '15:00', ok: false },
                { step: '5', title: 'Rapor / Telefon', desc: 'Ameliyathaneye bildirim', time: '20:00', ok: false },
              ].map((s, i) => (
                <div key={i} className={`p-3 rounded-xl border text-center ${s.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-black ${s.ok ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'}`}>{s.step}</div>
                  <p className="text-xs font-bold text-slate-700">{s.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.desc}</p>
                  <p className="text-[10px] font-mono text-amber-600 mt-1">{s.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selectedCase} onClose={() => setSelectedCase(null)} title={`${selectedCase?.type || ''} — ${selectedCase?.id || ''}`} size="2xl">
        {selectedCase && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px] uppercase">Hasta</span><span className="font-bold">{selectedCase.patient} ({selectedCase.age} {selectedCase.gender})</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Numune</span><span className="font-bold">{selectedCase.specimen}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">İsteyen</span><span className="font-bold">{selectedCase.requestDoctor}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">ICD-10</span><span className="font-mono font-bold text-blue-700">{selectedCase.icd10 || '—'}</span></div>
            </div>

            {selectedCase.tnmStage && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-purple-700">TNM Evreleme (AJCC 8. Baskı)</p>
                    <p className="text-xl font-black text-purple-800 mt-1">{selectedCase.tnmStage}</p>
                  </div>
                  {selectedCase.whoGrade && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500">WHO Sınıflaması</p>
                      <p className="font-bold text-purple-700">{selectedCase.whoGrade}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedCase.grossPhotos > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                <Eye size={16} className="text-slate-500" />
                <p className="text-sm text-slate-600">{selectedCase.grossPhotos} brüt fotoğraf kaydedildi — LIMS'te arşivlendi</p>
              </div>
            )}

            {selectedCase.macroscopy && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-1.5">Makroskopik İnceleme</h4>
                <p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">{selectedCase.macroscopy}</p>
              </div>
            )}
            {selectedCase.microscopy && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-1.5">Mikroskopik İnceleme</h4>
                <p className="text-sm bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">{selectedCase.microscopy}</p>
              </div>
            )}
            {selectedCase.diagnosis && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-emerald-700 mb-1">Patolojik Tanı</h4>
                <p className="text-sm text-emerald-800 font-medium">{selectedCase.diagnosis}</p>
                {selectedCase.pathologist && <p className="text-xs text-emerald-600 mt-2">Patolog: {selectedCase.pathologist} — {selectedCase.reportDate}</p>}
              </div>
            )}

            {/* IHC Panel */}
            {selectedCase.ihcPanel.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Beaker size={16} className="text-orange-500" /> İmmünohistokimyasal (IHC) Panel Sonuçları</h4>
                <div className="space-y-2">
                  {selectedCase.ihcPanel.map((m, i) => (
                    <div key={i} className={`p-3 rounded-xl border flex items-center justify-between ${m.result.includes('Pozitif') ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{m.marker}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{m.interpretation}</p>
                      </div>
                      <span className={`text-sm font-black px-3 py-1.5 rounded-lg ${m.result.includes('Pozitif') ? 'bg-blue-600 text-white' : m.result.includes('Eşik') ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white'}`}>
                        {m.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Culture & Antibiogram */}
            {selectedCase.cultureResult && (
              <div className={`border rounded-xl p-4 ${selectedCase.organism ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`text-sm font-bold mb-1 ${selectedCase.organism ? 'text-red-700' : 'text-slate-700'}`}>Kültür Sonucu</h4>
                <p className="text-sm font-medium">{selectedCase.cultureResult}</p>
              </div>
            )}

            {selectedCase.antibiogram.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><FlaskConical size={16} className="text-amber-500" /> Antibiyogram (MIC Değerleri)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedCase.antibiogram.map((a, i) => (
                    <div key={i} className={`p-2.5 rounded-lg border flex items-center justify-between ${a.result === 'S' ? 'bg-emerald-50 border-emerald-200' : a.result === 'I' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                      <span className={`text-sm font-medium ${a.result === 'S' ? 'text-emerald-700' : a.result === 'I' ? 'text-amber-700' : 'text-red-700'}`}>{a.antibiotic}</span>
                      <div className="text-right">
                        <span className={`text-sm font-black px-2 py-0.5 rounded ${a.result === 'S' ? 'bg-emerald-600 text-white' : a.result === 'I' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'}`}>
                          {a.result === 'S' ? '✓ Duyarlı' : a.result === 'I' ? '~ Orta' : '✗ Dirençli'}
                        </span>
                        <p className="text-[9px] font-mono text-slate-400 mt-0.5">MIC: {a.mic}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedCase.notes && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-1">Not / Öneri</p>
                <p className="text-sm text-slate-700">{selectedCase.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-100 flex-wrap">
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} /> Raporu Yazdır</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Send size={14} /> e-Nabız Gönder</button>
              {selectedCase.type === 'İHC Panel' && (
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 flex items-center gap-2"><BookOpen size={14} /> MDT Kuruluna Ekle</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
