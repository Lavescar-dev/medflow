import React, { useState } from 'react';
import {
  Apple, CheckCircle2, AlertTriangle, X, Save, Printer,
  Calculator, Clock, ChevronRight, Send
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatientDiet {
  id: number; name: string; room: string; bed: string; age: string; gender: string;
  weight: number; height: number; bmi: number;
  diagnosis: string; doctor: string; dietType: string; dietCode: string;
  allergies: string[]; intolerances: string[];
  texture: string; fluid: string; restrictions: string[];
  calories: number; protein: string;
  mealPlan: { meal: string; time: string; items: string[]; delivered: boolean; notes: string }[];
  enteralFeeding: boolean; enteralFormula: string; enteralRate: string; enteralRoute: string; residualCheck: boolean;
  parenteralNutrition: boolean; tpnComponents: string;
  nrsScore: number; nrsRisk: string;
  mustScore: number;
  npoStatus: boolean; npoReason: string; npoSince: string; feedingResume: string;
  notes: string; status: 'Aktif' | 'NPO' | 'Taburcu';
  consultationDate: string;
}

const mockPatients: PatientDiet[] = [
  {
    id: 1, name: 'Mustafa Yılmaz', room: '301', bed: 'A', age: '58', gender: 'E',
    weight: 82, height: 175, bmi: 26.8,
    diagnosis: 'Pnömoni (CAP)', doctor: 'Uzm. Dr. Ahmet K.', dietType: 'Normal Diyet', dietCode: 'D-01',
    allergies: [], intolerances: [], texture: 'Normal', fluid: 'Serbest',
    restrictions: [], calories: 2000, protein: '75g',
    mealPlan: [
      { meal: 'Kahvaltı', time: '07:30', items: ['Beyaz peynir 60g', 'Domates/salatalık', 'Zeytin 5 adet', 'Bal 1 porsiyon', 'Ekmek 2 dilim', 'Çay'], delivered: true, notes: '' },
      { meal: 'Öğle', time: '12:00', items: ['Mercimek çorbası', 'Fırın tavuk 150g', 'Bulgur pilavı', 'Yoğurt 150g', 'Meyve'], delivered: false, notes: '' },
      { meal: 'Akşam', time: '18:00', items: ['Sebze çorbası', 'Kıymalı ispanak', 'Makarna', 'Cacık'], delivered: false, notes: '' },
    ],
    enteralFeeding: false, enteralFormula: '', enteralRate: '', enteralRoute: '', residualCheck: false,
    parenteralNutrition: false, tpnComponents: '',
    nrsScore: 1, nrsRisk: 'Düşük Risk', mustScore: 0,
    npoStatus: false, npoReason: '', npoSince: '', feedingResume: '',
    notes: '', status: 'Aktif', consultationDate: '06.04.2026'
  },
  {
    id: 2, name: 'Zeynep Kaya', room: '302', bed: 'A', age: '72', gender: 'K',
    weight: 65, height: 160, bmi: 25.4,
    diagnosis: 'KOAH Alevlenme + DM Tip 2', doctor: 'Uzm. Dr. Ahmet K.', dietType: 'Diyabetik Diyet', dietCode: 'D-04',
    allergies: ['Fıstık'], intolerances: ['Laktoz'],
    texture: 'Yumuşak', fluid: 'Kısıtlı (1500mL/gün)',
    restrictions: ['Şeker', 'Tuz kısıtlı (<5g/gün)', 'Laktoz içeren ürünler', 'Yüksek glisemik besinler'],
    calories: 1800, protein: '72g',
    mealPlan: [
      { meal: 'Kahvaltı', time: '07:30', items: ['Laktozsuz peynir', 'Haşlanmış yumurta', 'Tam buğday ekmek 1 dilim', 'Domates', 'Bitki çayı (şekersiz)'], delivered: true, notes: 'Şekersiz' },
      { meal: 'Ara Öğün', time: '10:00', items: ['Tam buğday bisküvi 3 adet', 'Laktozsuz süt 150mL'], delivered: true, notes: '' },
      { meal: 'Öğle', time: '12:00', items: ['Tuzsuz tarhana çorbası', 'Izgara levrek 150g', 'Sebzeli bulgur', 'Yeşil salata'], delivered: false, notes: 'Tuz eklenmeyecek' },
      { meal: 'Ara Öğün', time: '15:00', items: ['1 adet elma veya armut'], delivered: false, notes: '' },
      { meal: 'Akşam', time: '18:00', items: ['Mercimek çorbası (tuzsuz)', 'Etli fasulye (az yağlı)', 'Laktozsuz yoğurt 100g'], delivered: false, notes: '' },
    ],
    enteralFeeding: false, enteralFormula: '', enteralRate: '', enteralRoute: '', residualCheck: false,
    parenteralNutrition: false, tpnComponents: '',
    nrsScore: 3, nrsRisk: 'Orta Risk', mustScore: 1,
    npoStatus: false, npoReason: '', npoSince: '', feedingResume: '',
    notes: 'DM + laktoz intoleransı. Sıvı kısıtlaması var (KKY önceki öyküsü). Diyetisyen takibinde.',
    status: 'Aktif', consultationDate: '05.04.2026'
  },
  {
    id: 3, name: 'Fatma Şahin', room: '303', bed: 'A', age: '50', gender: 'K',
    weight: 72, height: 163, bmi: 27.1,
    diagnosis: 'Post-op Lap. Kolesistektomi (Gün 1)', doctor: 'Op. Dr. Sinan M.', dietType: 'Post-op Diyet (Safra)', dietCode: 'D-08',
    allergies: [], intolerances: [], texture: 'Berrak Sıvı → Yumuşak',
    fluid: 'Serbest',
    restrictions: ['Yağlı yiyecekler', 'Kızartmalar', 'Baharatlı yemek', 'Gazlı içecekler', 'Çay/kahve (ilk 3 gün)'],
    calories: 1500, protein: '60g',
    mealPlan: [
      { meal: 'Kahvaltı', time: '07:30', items: ['Su', 'Açık çay', 'Beyaz ekmek kırıntısı çorbası'], delivered: false, notes: 'Berrak sıvı ile başla' },
      { meal: 'Öğle', time: '12:00', items: ['Pirinç suyu çorbası', 'Patates püresi'], delivered: false, notes: 'Tolere ederse yumuşağa geç' },
      { meal: 'Akşam', time: '18:00', items: ['Tavuk suyu çorba', 'Muhallebi (az yağlı)'], delivered: false, notes: '' },
    ],
    enteralFeeding: false, enteralFormula: '', enteralRate: '', enteralRoute: '', residualCheck: false,
    parenteralNutrition: false, tpnComponents: '',
    nrsScore: 2, nrsRisk: 'Düşük Risk', mustScore: 0,
    npoStatus: false, npoReason: '', npoSince: '', feedingResume: '',
    notes: 'Post-op ilk gün. Berrak sıvıdan başlanıyor. Tolere ederse kademeli ilerleme planlanıyor.',
    status: 'Aktif', consultationDate: '07.04.2026'
  },
  {
    id: 4, name: 'Ayşe Koç', room: 'YBÜ', bed: '03', age: '78', gender: 'K',
    weight: 58, height: 155, bmi: 24.1,
    diagnosis: 'Sepsis + AKİ + ARDS', doctor: 'Uzm. Dr. Can Y.', dietType: 'Enteral Beslenme (NG)', dietCode: 'D-EN',
    allergies: [], intolerances: [],
    texture: 'Enteral (NG Sonda)', fluid: 'IV + Enteral kısıtlı',
    restrictions: [], calories: 1400, protein: '70g',
    mealPlan: [],
    enteralFeeding: true, enteralFormula: 'Fresubin Energy Fibre 1.5 kcal/mL (Fresenius Kabi)',
    enteralRate: '50 mL/saat — 18 saatlik infüzyon (hedef: 900 kcal)', enteralRoute: 'Nazogastrik (NG) Sonda', residualCheck: true,
    parenteralNutrition: false, tpnComponents: '',
    nrsScore: 5, nrsRisk: 'Yüksek Risk', mustScore: 3,
    npoStatus: false, npoReason: '', npoSince: '', feedingResume: '',
    notes: 'Oral beslenme tolere edilemiyor. NG sonda ile enteral besleniyor. 4 saatte bir rezidü kontrolü. Rezidü >200mL ise hızı yavaşlat veya kes.',
    status: 'Aktif', consultationDate: '05.04.2026'
  },
  {
    id: 5, name: 'Hasan Öztürk', room: '305', bed: 'B', age: '38', gender: 'E',
    weight: 90, height: 180, bmi: 27.8,
    diagnosis: 'Sol Diz Artroskopi (Pre-op)', doctor: 'Doç. Dr. Murat A.', dietType: 'NPO (Aç)', dietCode: 'NPO',
    allergies: [], intolerances: [],
    texture: 'NPO', fluid: 'NPO',
    restrictions: [], calories: 0, protein: '0g',
    mealPlan: [],
    enteralFeeding: false, enteralFormula: '', enteralRate: '', enteralRoute: '', residualCheck: false,
    parenteralNutrition: false, tpnComponents: '',
    nrsScore: 0, nrsRisk: 'Risk Yok', mustScore: 0,
    npoStatus: true, npoReason: 'Artroskopi operasyonu (11:00)', npoSince: '07.04.2026 00:00', feedingResume: 'Op. sonrası 4. saatte berrak sıvıya başlanacak',
    notes: 'Ameliyat öncesi açlık. Gece 00:00 itibaren NPO. IV hidrasyon devam ediyor.',
    status: 'NPO', consultationDate: ''
  },
];

// Interactive NRS-2002 Calculator
function NRS2002Calculator({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'preheck' | 'main' | 'result'>('preheck');
  const [preCheck, setPreCheck] = useState({ bmi: false, weightLoss: false, poorIntake: false, severeIll: false });
  const [scores, setScores] = useState({ nutritionImpairment: 0, diseaseSeverity: 0, ageBonus: 0 });
  const [age, setAge] = useState('');

  const total = scores.nutritionImpairment + scores.diseaseSeverity + scores.ageBonus;

  const preCheckPositive = Object.values(preCheck).some(v => v);

  return (
    <div className="space-y-4">
      {step === 'preheck' && (
        <div>
          <h4 className="font-bold text-slate-800 mb-3">Ön Tarama (Eğer EVET ise ana taramaya geç)</h4>
          <div className="space-y-2">
            {[
              { key: 'bmi', label: 'BMI < 20.5 kg/m²?' },
              { key: 'weightLoss', label: 'Son 3 ayda kilo kaybı var mı?' },
              { key: 'poorIntake', label: 'Son haftada besin alımı azaldı mı?' },
              { key: 'severeIll', label: 'Hasta ciddi şekilde hasta mı?' },
            ].map(q => (
              <label key={q.key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <input type="checkbox" checked={preCheck[q.key as keyof typeof preCheck]}
                  onChange={e => setPreCheck(prev => ({ ...prev, [q.key]: e.target.checked }))}
                  className="w-5 h-5 rounded accent-blue-500" />
                <span className="text-sm text-slate-700">{q.label}</span>
              </label>
            ))}
          </div>
          <button onClick={() => setStep(preCheckPositive ? 'main' : 'result')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 w-full">
            {preCheckPositive ? 'Ana Taramaya Geç' : 'Skoru Hesapla (Risk Yok)'}
          </button>
        </div>
      )}

      {step === 'main' && (
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Beslenme Durumu Bozukluğu (0-3)</h4>
            <div className="space-y-2">
              {[
                { val: 0, label: '0 — Bozukluk yok: Normal beslenme durumu' },
                { val: 1, label: '1 — Hafif: Son 3 ayda %5 kilo kaybı veya besin alımı normalin %50-75\'i' },
                { val: 2, label: '2 — Orta: Son 2 ayda %5 kilo kaybı veya besin alımı normalin %25-50\'si' },
                { val: 3, label: '3 — Ağır: BMI<18.5 + kötü genel durum veya son 1 haftada %5 kilo kaybı' },
              ].map(o => (
                <label key={o.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${scores.nutritionImpairment === o.val ? 'bg-blue-50 border-blue-400' : 'bg-slate-50 border-slate-200 hover:bg-blue-50/50'}`}>
                  <input type="radio" name="nutrition" checked={scores.nutritionImpairment === o.val}
                    onChange={() => setScores(prev => ({ ...prev, nutritionImpairment: o.val }))}
                    className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-slate-700">{o.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Hastalık Şiddeti (0-3)</h4>
            <div className="space-y-2">
              {[
                { val: 0, label: '0 — Yok: Normal beslenme ihtiyacı' },
                { val: 1, label: '1 — Hafif: Kalça kırığı, kronik hastalık alevlenmesi, hemodiyaliz, diyabet, onkoloji' },
                { val: 2, label: '2 — Orta: Majör abdominal cerrahi, inme, ciddi pnömoni, hematolojik malignite' },
                { val: 3, label: '3 — Ağır: Kafa travması, kemik iliği transplantasyonu, YBÜ hastası (APACHE>10)' },
              ].map(o => (
                <label key={o.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${scores.diseaseSeverity === o.val ? 'bg-purple-50 border-purple-400' : 'bg-slate-50 border-slate-200 hover:bg-purple-50/50'}`}>
                  <input type="radio" name="disease" checked={scores.diseaseSeverity === o.val}
                    onChange={() => setScores(prev => ({ ...prev, diseaseSeverity: o.val }))}
                    className="w-4 h-4 accent-purple-500" />
                  <span className="text-sm text-slate-700">{o.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Yaş ≥ 70 mi?</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-amber-500"
                onChange={e => setScores(prev => ({ ...prev, ageBonus: e.target.checked ? 1 : 0 }))} />
              <span className="text-sm text-slate-600">Evet (+1 puan)</span>
            </label>
          </div>
          <button onClick={() => setStep('result')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 w-full">Skoru Hesapla</button>
        </div>
      )}

      {step === 'result' && (
        <div className="space-y-4">
          <div className={`p-6 rounded-2xl border-2 text-center ${total >= 3 ? 'bg-red-50 border-red-400' : total > 0 ? 'bg-amber-50 border-amber-400' : 'bg-emerald-50 border-emerald-400'}`}>
            <p className="text-sm font-bold text-slate-600 mb-2">NRS-2002 Toplam Skoru</p>
            <p className={`text-6xl font-black ${total >= 3 ? 'text-red-700' : total > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>{total}</p>
            <p className={`text-lg font-bold mt-2 ${total >= 3 ? 'text-red-700' : total > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {total >= 3 ? '⚠ BESLENME RİSKİ VAR — Müdahale Gerekli' : total > 0 ? 'Orta Risk — Takip Gerekli' : '✓ Risk Yok — Haftalık Tekrar'}
            </p>
          </div>
          {total >= 3 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-bold text-red-700 mb-2">Önerilen Müdahaleler:</p>
              <ul className="space-y-1 text-xs text-red-600">
                <li>• Diyetisyen konsültasyonu (24 saat içinde)</li>
                <li>• Beslenme hedefi: {'>'}20 kcal/kg/gün + 1.2–1.5g protein/kg</li>
                <li>• Oral beslenme yetersizse enteral beslenme başlanmalı</li>
                <li>• Günlük ağırlık ve beslenme takibi</li>
                <li>• 7-14 günde bir NRS tekrarı</li>
              </ul>
            </div>
          )}
          <button onClick={() => setStep('preheck')} className="px-4 py-2 bg-slate-600 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 w-full">Yeni Hesaplama</button>
        </div>
      )}
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
  const maxW = size === '2xl' ? 'max-w-6xl' : 'max-w-4xl';
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

export function DietModule() {
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<PatientDiet | null>(null);
  const [tab, setTab] = useState<'hastalar' | 'nrs' | 'npo' | 'mutfak' | 'enteral'>('hastalar');
  const [showNRS, setShowNRS] = useState(false);

  const active = patients.filter(p => p.status === 'Aktif');
  const highRisk = patients.filter(p => p.nrsScore >= 3).length;
  const enteral = patients.filter(p => p.enteralFeeding).length;
  const npoCount = patients.filter(p => p.npoStatus).length;
  const totalMeals = active.reduce((s, p) => s + p.mealPlan.length, 0);
  const deliveredMeals = active.reduce((s, p) => s + p.mealPlan.filter(m => m.delivered).length, 0);

  const toggleMealDelivery = (patientId: number, mealIdx: number) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const newPlan = p.mealPlan.map((m, i) => i === mealIdx ? { ...m, delivered: !m.delivered } : m);
      return { ...p, mealPlan: newPlan };
    }));
    if (selectedPatient?.id === patientId) {
      setSelectedPatient(prev => {
        if (!prev) return null;
        const newPlan = prev.mealPlan.map((m, i) => i === mealIdx ? { ...m, delivered: !m.delivered } : m);
        return { ...prev, mealPlan: newPlan };
      });
    }
  };

  const tabs = [
    { id: 'hastalar' as const, label: 'Hasta Diyetleri' },
    { id: 'nrs' as const, label: 'NRS-2002 Tarama' },
    { id: 'npo' as const, label: `NPO Yönetimi${npoCount > 0 ? ` (${npoCount})` : ''}` },
    { id: 'mutfak' as const, label: 'Mutfak İstekleri' },
    { id: 'enteral' as const, label: 'Enteral/Parenteral' },
  ];

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Diyet ve İaşe Yönetimi</h2>
          <p className="text-sm text-slate-500">NRS-2002 tarama, diyet planlaması, enteral/parenteral beslenme, NPO yönetimi, mutfak dağıtım takibi</p>
        </div>
        <button onClick={() => setShowNRS(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shadow-sm">
          <Calculator size={16} /> NRS-2002 Hesapla
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-none">
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200"><p className="text-[10px] font-bold text-emerald-700 uppercase">Aktif Diyet</p><p className="text-2xl font-black text-emerald-600">{active.length}</p></div>
        <div className={twMerge("p-3 rounded-xl border", highRisk > 0 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200")}>
          <p className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1"><AlertTriangle size={12} />Malnütrisyon Riski</p>
          <p className="text-2xl font-black text-red-600">{highRisk}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-xl border border-purple-200"><p className="text-[10px] font-bold text-purple-700 uppercase">Enteral Beslenme</p><p className="text-2xl font-black text-purple-600">{enteral}</p></div>
        <div className={twMerge("p-3 rounded-xl border", npoCount > 0 ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200")}>
          <p className="text-[10px] font-bold text-amber-700 uppercase">NPO Hasta</p>
          <p className="text-2xl font-black text-amber-600">{npoCount}</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
          <p className="text-[10px] font-bold text-blue-700 uppercase">Öğün Teslimat</p>
          <p className="text-2xl font-black text-blue-600">{deliveredMeals}/{totalMeals}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl flex-none overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={twMerge("px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors",
              tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Hasta Diyetleri */}
      {tab === 'hastalar' && (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map(p => (
              <div key={p.id} onClick={() => setSelectedPatient(p)}
                className={twMerge("bg-white rounded-xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all",
                  p.nrsScore >= 3 ? 'border-red-200' : p.npoStatus ? 'border-amber-300' : p.enteralFeeding ? 'border-purple-200' : 'border-slate-200',
                  p.status === 'Taburcu' && 'opacity-50')}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-sm px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">{p.room}-{p.bed}</span>
                    <h4 className="font-bold text-slate-800">{p.name}</h4>
                    <Badge color={p.npoStatus ? 'amber' : p.status === 'Aktif' ? 'green' : 'slate'}>{p.npoStatus ? 'NPO' : p.status}</Badge>
                    {p.nrsScore >= 3 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-black">MAL. RİSKİ</span>}
                  </div>
                  <Badge color={p.enteralFeeding ? 'purple' : p.npoStatus ? 'amber' : 'blue'}>{p.npoStatus ? 'NPO' : p.dietType}</Badge>
                </div>
                <p className="text-xs text-slate-500">{p.diagnosis} • {p.doctor}</p>

                <div className="grid grid-cols-5 gap-1.5 mt-3">
                  {[
                    { label: 'Kalori', value: p.calories > 0 ? `${p.calories}` : 'NPO' },
                    { label: 'Protein', value: p.protein || '—' },
                    { label: 'BMI', value: p.bmi.toString() },
                    { label: 'NRS-2002', value: p.nrsScore.toString(), alert: p.nrsScore >= 3 },
                    { label: 'MUST', value: p.mustScore.toString(), alert: p.mustScore >= 2 },
                  ].map((kpi, i) => (
                    <div key={i} className={`text-center p-1.5 rounded text-[9px] ${kpi.alert ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200'}`}>
                      <span className="text-slate-400 block">{kpi.label}</span>
                      <span className={`font-black ${kpi.alert ? 'text-red-600' : 'text-slate-700'}`}>{kpi.value}</span>
                    </div>
                  ))}
                </div>

                {(p.allergies.length > 0 || p.restrictions.length > 0) && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {p.allergies.map((a, i) => <Badge key={i} color="red">Alerji: {a}</Badge>)}
                    {p.restrictions.slice(0, 2).map((r, i) => <Badge key={i} color="amber">{r}</Badge>)}
                    {p.restrictions.length > 2 && <Badge color="slate">+{p.restrictions.length - 2}</Badge>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NRS Tarama */}
      {tab === 'nrs' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-4">NRS-2002 Tarama Sonuçları — Aktif Hastalar</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Hasta</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">NRS-2002</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">MUST</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">BMI</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Risk</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Müdahale</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Son Danışma</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.room}-{p.bed} • {p.diagnosis}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xl font-black ${p.nrsScore >= 3 ? 'text-red-600' : p.nrsScore >= 1 ? 'text-amber-600' : 'text-emerald-600'}`}>{p.nrsScore}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xl font-black ${p.mustScore >= 2 ? 'text-red-600' : p.mustScore >= 1 ? 'text-amber-600' : 'text-emerald-600'}`}>{p.mustScore}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-700">{p.bmi}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge color={p.nrsScore >= 3 ? 'red' : p.nrsScore >= 1 ? 'amber' : 'green'}>{p.nrsRisk}</Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">{p.nrsScore >= 3 ? 'Diyetisyen danışması + beslenme desteği' : p.nrsScore >= 1 ? 'Haftalık tekrar tarama' : 'Rutin tarama (1 haftada bir)'}</td>
                      <td className="py-3 px-4 text-xs text-slate-500">{p.consultationDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* NPO */}
      {tab === 'npo' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          {patients.filter(p => p.npoStatus).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-500">Şu anda NPO hastası bulunmuyor.</p>
            </div>
          ) : (
            patients.filter(p => p.npoStatus).map(p => (
              <div key={p.id} className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-black text-amber-800 text-lg">{p.name} — Oda {p.room}-{p.bed}</h4>
                    <p className="text-sm text-amber-700">{p.diagnosis} • {p.doctor}</p>
                  </div>
                  <span className="bg-amber-500 text-white px-3 py-1.5 rounded-xl font-black text-sm">NPO AKTİF</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-amber-200">
                    <p className="text-xs text-amber-600 font-bold">NPO Nedeni</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{p.npoReason}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-amber-200">
                    <p className="text-xs text-amber-600 font-bold">NPO Başlangıcı</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{p.npoSince}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-amber-200">
                    <p className="text-xs text-amber-600 font-bold">Beslenme Yeniden Başlangıcı</p>
                    <p className="text-sm font-medium text-slate-800 mt-1">{p.feedingResume}</p>
                  </div>
                </div>
                <p className="text-xs text-amber-700 mt-3 bg-amber-100 p-2 rounded-lg border border-amber-200">{p.notes}</p>
              </div>
            ))
          )}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-3">NPO Öncesi Açlık Süreleri (ESRA Kılavuzu)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { item: 'Berrak sıvılar', time: '2 saat', note: 'Su, meyve suyu, çay' },
                { item: 'Mama / Süt', time: '4 saat', note: 'Bebek ve çocuklar için' },
                { item: 'Hafif katı', time: '6 saat', note: 'Tost, bisküvi' },
                { item: 'Tam yemek / Yağlı', time: '8 saat', note: 'Normal öğün, kızartma' },
              ].map((r, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-700">{r.item}</p>
                  <p className="text-3xl font-black text-amber-600 my-1">{r.time}</p>
                  <p className="text-[10px] text-slate-500">{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mutfak */}
      {tab === 'mutfak' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Apple className="text-emerald-500" size={18} />Günlük Öğün Dağıtım Listesi — 07.04.2026</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Oda/Yatak</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Hasta</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Diyet Kodu</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Kahvaltı</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Öğle</th>
                    <th className="text-center py-2.5 px-4 text-xs font-semibold text-slate-500">Akşam</th>
                    <th className="text-left py-2.5 px-4 text-xs font-semibold text-slate-500">Özel Not</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.filter(p => !p.npoStatus && !p.enteralFeeding).map(p => {
                    const breakfast = p.mealPlan.find(m => m.meal === 'Kahvaltı');
                    const lunch = p.mealPlan.find(m => m.meal === 'Öğle');
                    const dinner = p.mealPlan.find(m => m.meal === 'Akşam');
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-700">{p.room}-{p.bed}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{p.name}</td>
                        <td className="py-3 px-4"><Badge color="blue">{p.dietCode}</Badge></td>
                        {[breakfast, lunch, dinner].map((meal, idx) => (
                          <td key={idx} className="py-3 px-4 text-center">
                            {meal ? (
                              <button onClick={() => {
                                const mealIdx = p.mealPlan.findIndex(m => m.meal === meal.meal);
                                toggleMealDelivery(p.id, mealIdx);
                              }}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto transition-colors ${meal.delivered ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300 hover:border-emerald-400'}`}>
                                {meal.delivered && <CheckCircle2 size={16} className="text-white" />}
                              </button>
                            ) : <span className="text-slate-300">—</span>}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-xs text-slate-500">
                          {p.allergies.length > 0 ? <span className="text-red-600">⚠ Alerji: {p.allergies.join(', ')}</span> : p.restrictions.length > 0 ? p.restrictions[0] : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Enteral/Parenteral */}
      {tab === 'enteral' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          {patients.filter(p => p.enteralFeeding || p.parenteralNutrition).map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-purple-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-800">{p.name} — {p.room}-{p.bed}</h4>
                  <p className="text-xs text-slate-500">{p.diagnosis}</p>
                </div>
                <Badge color="purple">{p.enteralFeeding ? 'Enteral Beslenme' : 'Total Parenteral Nütrisyon'}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                  <p className="text-[10px] text-purple-600 font-bold uppercase">Formül</p>
                  <p className="text-xs font-bold text-purple-800 mt-1">{p.enteralFormula}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                  <p className="text-[10px] text-purple-600 font-bold uppercase">Hız / Program</p>
                  <p className="text-xs font-bold text-purple-800 mt-1">{p.enteralRate}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                  <p className="text-[10px] text-purple-600 font-bold uppercase">Yol</p>
                  <p className="text-xs font-bold text-purple-800 mt-1">{p.enteralRoute}</p>
                </div>
                <div className={`p-3 rounded-xl border ${p.residualCheck ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Rezidü Kontrolü</p>
                  <p className={`text-xs font-bold mt-1 ${p.residualCheck ? 'text-amber-700' : 'text-slate-500'}`}>{p.residualCheck ? '4 saatte bir kontrol' : 'Gerekmiyor'}</p>
                </div>
              </div>
              {p.notes && <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{p.notes}</p>}
            </div>
          ))}
          {/* TPN Calculator Reference */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h4 className="font-bold text-slate-800 mb-3">Total Parenteral Nütrisyon (TPN) Referans Değerleri</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                { nutrient: 'Toplam Enerji', normal: '25-30 kcal/kg/gün', ybü: '20-25 kcal/kg/gün', note: 'Kritik hastalarda hipokalori' },
                { nutrient: 'Protein', normal: '1.0-1.5 g/kg/gün', ybü: '1.2-2.0 g/kg/gün', note: 'Yüksek katabolizmada artır' },
                { nutrient: 'Lipid', normal: '1.0-1.5 g/kg/gün', ybü: '<1.5 g/kg/gün', note: 'Maks. 2.5 g/kg/gün' },
                { nutrient: 'Glukoz', normal: '2-4 g/kg/gün', ybü: '3-4 g/kg/gün', note: 'Hedef: 140-180 mg/dL' },
              ].map((r, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700">{r.nutrient}</p>
                  <p className="text-[10px] text-slate-600 mt-1">Normal: {r.normal}</p>
                  <p className="text-[10px] text-blue-600">YBÜ: {r.ybü}</p>
                  <p className="text-[10px] text-slate-400 italic mt-0.5">{r.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      <Modal open={!!selectedPatient} onClose={() => setSelectedPatient(null)} title={`Diyet Planı — ${selectedPatient?.name || ''}`} size="2xl">
        {selectedPatient && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div><span className="text-slate-500 block text-[10px] uppercase">Diyet</span><span className="font-bold">{selectedPatient.dietType} ({selectedPatient.dietCode})</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Kalori / Protein</span><span className="font-bold">{selectedPatient.calories} kcal / {selectedPatient.protein}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Ağırlık / Boy / BMI</span><span className="font-bold">{selectedPatient.weight}kg / {selectedPatient.height}cm / {selectedPatient.bmi}</span></div>
              <div><span className="text-slate-500 block text-[10px] uppercase">Doku / Sıvı</span><span className="font-bold">{selectedPatient.texture} / {selectedPatient.fluid}</span></div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">NRS-2002</span>
                <span className={`font-black text-lg ${selectedPatient.nrsScore >= 3 ? 'text-red-600' : selectedPatient.nrsScore >= 1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {selectedPatient.nrsScore} <span className="text-xs font-normal">({selectedPatient.nrsRisk})</span>
                </span>
              </div>
            </div>

            {selectedPatient.allergies.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                <p className="text-sm text-red-700"><strong>Alerji:</strong> {selectedPatient.allergies.join(', ')}</p>
              </div>
            )}

            {selectedPatient.restrictions.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-700 mb-2">Diyet Kısıtlamaları</p>
                <div className="flex gap-1 flex-wrap">{selectedPatient.restrictions.map((r, i) => <Badge key={i} color="amber">{r}</Badge>)}</div>
              </div>
            )}

            {selectedPatient.npoStatus && (
              <div className="bg-amber-100 border-2 border-amber-400 rounded-xl p-4">
                <p className="font-black text-amber-800">NPO — Oral Beslenme Yasak</p>
                <p className="text-sm text-amber-700 mt-1">Neden: {selectedPatient.npoReason}</p>
                <p className="text-xs text-amber-600 mt-0.5">NPO'dan bu yana: {selectedPatient.npoSince}</p>
                <p className="text-xs text-emerald-600 mt-0.5">Beslenme yeniden başlangıcı: {selectedPatient.feedingResume}</p>
              </div>
            )}

            {selectedPatient.enteralFeeding && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-purple-700 mb-2">Enteral Beslenme Protokolü</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-[10px] text-purple-600">Formül</p><p className="font-bold text-purple-800">{selectedPatient.enteralFormula}</p></div>
                  <div><p className="text-[10px] text-purple-600">Hız / Program</p><p className="font-bold text-purple-800">{selectedPatient.enteralRate}</p></div>
                  <div><p className="text-[10px] text-purple-600">Uygulama Yolu</p><p className="font-bold text-purple-800">{selectedPatient.enteralRoute}</p></div>
                  <div><p className="text-[10px] text-purple-600">Rezidü Kontrolü</p><p className="font-bold text-purple-800">{selectedPatient.residualCheck ? '✓ 4 saatte bir' : 'Gerekmiyor'}</p></div>
                </div>
              </div>
            )}

            {selectedPatient.mealPlan.length > 0 && !selectedPatient.npoStatus && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">Günlük Öğün Planı — Teslim Takibi</h4>
                <div className="space-y-2">
                  {selectedPatient.mealPlan.map((meal, i) => (
                    <div key={i} className={twMerge("p-3 rounded-lg border flex items-start gap-3", meal.delivered ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200")}>
                      <button onClick={() => toggleMealDelivery(selectedPatient.id, i)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${meal.delivered ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300 hover:border-emerald-400'}`}>
                        {meal.delivered && <CheckCircle2 size={14} className="text-white" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">{meal.meal}</span>
                          <span className="text-xs text-slate-400">{meal.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{meal.items.join(', ')}</p>
                        {meal.notes && <p className="text-[10px] text-amber-600 mt-0.5 italic">{meal.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedPatient.notes && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-1">Diyetisyen Notu</p>
                <p className="text-sm text-slate-700">{selectedPatient.notes}</p>
              </div>
            )}

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"><Save size={14} />Diyet Planını Güncelle</button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 flex items-center gap-2"><Printer size={14} />Yazdır</button>
            </div>
          </div>
        )}
      </Modal>

      {/* NRS Modal */}
      <Modal open={showNRS} onClose={() => setShowNRS(false)} title="NRS-2002 Beslenme Tarama Aracı">
        <NRS2002Calculator onClose={() => setShowNRS(false)} />
      </Modal>
    </div>
  );
}
