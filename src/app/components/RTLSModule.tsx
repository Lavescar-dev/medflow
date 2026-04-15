import React, { useState, useEffect, useRef } from 'react';
import {
  Focus, Search, AlertTriangle, X, MapPin, User, BedDouble,
  MonitorSmartphone, Activity, Wifi, Battery, BatteryLow,
  BarChart2, Bell, Eye, CheckCircle2, Clock, Thermometer,
  Radio, Layers, Shield,
  WifiOff, Volume2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { twMerge } from 'tailwind-merge';

// ─── Types ──────────────────────────────────────────────────────────────
interface FloorRoom {
  id: string; label: string; x: number; y: number; w: number; h: number;
  fill: string; border: string; textColor: string; floor: string;
  dept?: string;
}
interface TrackedAsset {
  id: string; name: string; type: 'Cihaz' | 'Personel' | 'Hasta' | 'Tekerlekli Sandalye' | 'Yatak';
  tag: string; battery: number; lastSeen: string;
  currentZone: string; currentFloor: string; dept: string;
  status: 'Aktif' | 'Alarm' | 'Düşük Pil' | 'Çevrimdışı';
  notes: string; temp?: number; x?: number; y?: number;
}
interface Alarm {
  id: string; assetId: string; assetName: string; type: 'Coğrafi Alan' | 'Düşük Pil' | 'Çevrimdışı' | 'Hız' | 'SOS';
  msg: string; zone: string; time: string; severity: 'critical' | 'warning' | 'info';
  ack: boolean;
}

// ─── Floor Plan Definitions ──────────────────────────────────────────────
const SVG_W = 580; const SVG_H = 380;

const floorRooms: Record<string, FloorRoom[]> = {
  'Zemin Kat': [
    { id: 'acil', label: 'Acil Servis', x: 8, y: 8, w: 190, h: 145, fill: '#fef2f2', border: '#fca5a5', textColor: '#dc2626', floor: 'Zemin Kat', dept: 'Acil' },
    { id: 'resus', label: 'Resüsitasyon', x: 8, y: 162, w: 95, h: 75, fill: '#ffe4e6', border: '#fda4af', textColor: '#e11d48', floor: 'Zemin Kat', dept: 'Acil' },
    { id: 'triaj', label: 'Triaj', x: 112, y: 162, w: 86, h: 75, fill: '#fff7ed', border: '#fdba74', textColor: '#ea580c', floor: 'Zemin Kat', dept: 'Acil' },
    { id: 'radyo', label: 'Radyoloji', x: 208, y: 8, w: 140, h: 95, fill: '#eff6ff', border: '#93c5fd', textColor: '#2563eb', floor: 'Zemin Kat', dept: 'Radyoloji' },
    { id: 'lab', label: 'Laboratuvar', x: 208, y: 112, w: 140, h: 75, fill: '#fffbeb', border: '#fcd34d', textColor: '#d97706', floor: 'Zemin Kat', dept: 'Lab' },
    { id: 'poli', label: 'Poliklinik 1-3', x: 358, y: 8, w: 130, h: 95, fill: '#f5f3ff', border: '#a78bfa', textColor: '#7c3aed', floor: 'Zemin Kat', dept: 'Poliklinik' },
    { id: 'eczane', label: 'Eczane', x: 358, y: 112, w: 130, h: 75, fill: '#f0fdf4', border: '#86efac', textColor: '#16a34a', floor: 'Zemin Kat', dept: 'Eczane' },
    { id: 'bekleme', label: 'Bekleme\nSalonu', x: 498, y: 8, w: 74, h: 229, fill: '#f8fafc', border: '#cbd5e1', textColor: '#64748b', floor: 'Zemin Kat' },
    { id: 'koridor0', label: 'Koridor', x: 8, y: 246, w: 564, h: 28, fill: '#f1f5f9', border: '#e2e8f0', textColor: '#94a3b8', floor: 'Zemin Kat' },
    { id: 'steril', label: 'Sterilizasyon', x: 8, y: 282, w: 140, h: 88, fill: '#fdf4ff', border: '#e879f9', textColor: '#a21caf', floor: 'Zemin Kat' },
    { id: 'admin', label: 'İdari Ofis', x: 156, y: 282, w: 150, h: 88, fill: '#ecfdf5', border: '#6ee7b7', textColor: '#059669', floor: 'Zemin Kat' },
    { id: 'kafeterya', label: 'Kafeterya', x: 314, y: 282, w: 130, h: 88, fill: '#fff7ed', border: '#fed7aa', textColor: '#c2410c', floor: 'Zemin Kat' },
    { id: 'depo0', label: 'Teknik/Depo', x: 452, y: 282, w: 120, h: 88, fill: '#f8fafc', border: '#e2e8f0', textColor: '#94a3b8', floor: 'Zemin Kat' },
  ],
  '1. Kat': [
    { id: 'am1', label: 'Ameliyathane 1-2', x: 8, y: 8, w: 220, h: 165, fill: '#fffbeb', border: '#fcd34d', textColor: '#b45309', floor: '1. Kat', dept: 'Ameliyathane' },
    { id: 'am3', label: 'Ameliyathane 3-4', x: 236, y: 8, w: 190, h: 165, fill: '#fff7ed', border: '#fdba74', textColor: '#c2410c', floor: '1. Kat', dept: 'Ameliyathane' },
    { id: 'amkor', label: 'Ameliyat Koridoru', x: 434, y: 8, w: 138, h: 165, fill: '#f8fafc', border: '#e2e8f0', textColor: '#94a3b8', floor: '1. Kat' },
    { id: 'koridor1', label: 'Koridor', x: 8, y: 182, w: 564, h: 28, fill: '#f1f5f9', border: '#e2e8f0', textColor: '#94a3b8', floor: '1. Kat' },
    { id: 'anestezi', label: 'Anestezi & Hazırlık', x: 8, y: 218, w: 190, h: 90, fill: '#eff6ff', border: '#93c5fd', textColor: '#2563eb', floor: '1. Kat' },
    { id: 'malzeme', label: 'Steril Malzeme', x: 206, y: 218, w: 160, h: 90, fill: '#f0fdf4', border: '#86efac', textColor: '#16a34a', floor: '1. Kat' },
    { id: 'dogum', label: 'Doğumhane', x: 374, y: 218, w: 198, h: 90, fill: '#fdf4ff', border: '#e879f9', textColor: '#a21caf', floor: '1. Kat' },
    { id: 'resting', label: 'Personel Dinlenme', x: 8, y: 316, w: 564, h: 56, fill: '#f0fdf4', border: '#bbf7d0', textColor: '#15803d', floor: '1. Kat' },
  ],
  '2. Kat': [
    { id: 'ybu', label: 'Yoğun Bakım Ünitesi (YBÜ)', x: 8, y: 8, w: 330, h: 175, fill: '#fef2f2', border: '#fca5a5', textColor: '#dc2626', floor: '2. Kat', dept: 'YBÜ' },
    { id: 'ybuizlem', label: 'YBÜ İzlem & Kontrol', x: 346, y: 8, w: 226, h: 175, fill: '#ffe4e6', border: '#fda4af', textColor: '#e11d48', floor: '2. Kat', dept: 'YBÜ' },
    { id: 'koridor2', label: 'Koridor', x: 8, y: 192, w: 564, h: 28, fill: '#f1f5f9', border: '#e2e8f0', textColor: '#94a3b8', floor: '2. Kat' },
    { id: 'kardio', label: 'Kardiyoloji Servisi', x: 8, y: 228, w: 200, h: 140, fill: '#f5f3ff', border: '#a78bfa', textColor: '#7c3aed', floor: '2. Kat' },
    { id: 'noro', label: 'Nöroloji Servisi', x: 216, y: 228, w: 180, h: 140, fill: '#eff6ff', border: '#93c5fd', textColor: '#2563eb', floor: '2. Kat' },
    { id: 'genel2', label: 'Genel Servis', x: 404, y: 228, w: 168, h: 140, fill: '#f0fdf4', border: '#86efac', textColor: '#16a34a', floor: '2. Kat' },
  ],
  '3. Kat': [
    { id: 'dah', label: 'Dahiliye Servisi (Oda 301-308)', x: 8, y: 8, w: 290, h: 155, fill: '#eff6ff', border: '#93c5fd', textColor: '#2563eb', floor: '3. Kat', dept: 'Dahiliye' },
    { id: 'cer', label: 'Cerrahi Servisi (Oda 309-316)', x: 306, y: 8, w: 266, h: 155, fill: '#fff7ed', border: '#fdba74', textColor: '#ea580c', floor: '3. Kat', dept: 'Cerrahi' },
    { id: 'koridor3', label: 'Koridor', x: 8, y: 172, w: 564, h: 28, fill: '#f1f5f9', border: '#e2e8f0', textColor: '#94a3b8', floor: '3. Kat' },
    { id: 'ilac3', label: 'İlaç Odası', x: 8, y: 208, w: 155, h: 85, fill: '#f0fdf4', border: '#86efac', textColor: '#16a34a', floor: '3. Kat' },
    { id: 'hemsis3', label: 'Hemşire İstasyonu', x: 171, y: 208, w: 155, h: 85, fill: '#fdf4ff', border: '#e879f9', textColor: '#a21caf', floor: '3. Kat' },
    { id: 'depo3', label: 'Servis Deposu', x: 334, y: 208, w: 130, h: 85, fill: '#f8fafc', border: '#e2e8f0', textColor: '#94a3b8', floor: '3. Kat' },
    { id: 'ziyaret3', label: 'Ziyaretçi Bekleme', x: 472, y: 208, w: 100, h: 85, fill: '#fffbeb', border: '#fcd34d', textColor: '#d97706', floor: '3. Kat' },
    { id: 'temizlik', label: 'Temizlik/Malzeme', x: 8, y: 301, w: 564, h: 67, fill: '#f8fafc', border: '#e2e8f0', textColor: '#94a3b8', floor: '3. Kat' },
  ],
};

// Zone → room mapping (zone name → { roomId, floor })
const zoneToRoom: Record<string, { roomId: string; floor: string }> = {
  'Yoğun Bakım - Yatak 1': { roomId: 'ybu', floor: '2. Kat' },
  'Yoğun Bakım - Yatak 2': { roomId: 'ybu', floor: '2. Kat' },
  'YBÜ İzlem': { roomId: 'ybuizlem', floor: '2. Kat' },
  'Dahiliye Servisi - Oda 302': { roomId: 'dah', floor: '3. Kat' },
  'Dahiliye Servisi - Koridor': { roomId: 'koridor3', floor: '3. Kat' },
  'Dahiliye Servisi - İlaç Odası': { roomId: 'ilac3', floor: '3. Kat' },
  'Acil Servis - Resüsitasyon': { roomId: 'resus', floor: 'Zemin Kat' },
  'Acil Servis - Triaj': { roomId: 'triaj', floor: 'Zemin Kat' },
  'Acil Servis Bekleme': { roomId: 'acil', floor: 'Zemin Kat' },
  'Ameliyathane Koridoru': { roomId: 'amkor', floor: '1. Kat' },
  'Ameliyathane 1': { roomId: 'am1', floor: '1. Kat' },
  'Ameliyathane 3': { roomId: 'am3', floor: '1. Kat' },
  'Radyoloji Bekleme': { roomId: 'radyo', floor: 'Zemin Kat' },
  'Radyoloji - MR Odası': { roomId: 'radyo', floor: 'Zemin Kat' },
  'Poliklinik Muayene 3': { roomId: 'poli', floor: 'Zemin Kat' },
  'Eczane': { roomId: 'eczane', floor: 'Zemin Kat' },
  'Laboratuvar': { roomId: 'lab', floor: 'Zemin Kat' },
  'Son konum: Dahiliye Servisi': { roomId: 'dah', floor: '3. Kat' },
  'Hemşire İstasyonu': { roomId: 'hemsis3', floor: '3. Kat' },
  'Kardiyoloji Servisi': { roomId: 'kardio', floor: '2. Kat' },
  'Kafeterya': { roomId: 'kafeterya', floor: 'Zemin Kat' },
  'Doğumhane': { roomId: 'dogum', floor: '1. Kat' },
  'Koridor (2. Kat)': { roomId: 'koridor2', floor: '2. Kat' },
  'Anestezi Hazırlık': { roomId: 'anestezi', floor: '1. Kat' },
  'Cerrahi Servis - Oda 310': { roomId: 'cer', floor: '3. Kat' },
};

// ─── Mock Data ───────────────────────────────────────────────────────────
const initialAssets: TrackedAsset[] = [
  { id: 'TAG-001', name: 'Mekanik Ventilatör (Dräger V500)', type: 'Cihaz', tag: 'BLE-A001', battery: 85, lastSeen: '07.04.2026 12:05', currentZone: 'Yoğun Bakım - Yatak 1', currentFloor: '2. Kat', dept: 'YBÜ', status: 'Aktif', notes: '', temp: 22.4 },
  { id: 'TAG-002', name: 'İnfüzyon Pompası (B.Braun #42)', type: 'Cihaz', tag: 'BLE-A042', battery: 92, lastSeen: '07.04.2026 12:05', currentZone: 'Dahiliye Servisi - Oda 302', currentFloor: '3. Kat', dept: 'Dahiliye', status: 'Aktif', notes: '', temp: 21.8 },
  { id: 'TAG-003', name: 'Defibrilatör (ZOLL R Series)', type: 'Cihaz', tag: 'BLE-A003', battery: 45, lastSeen: '07.04.2026 11:58', currentZone: 'Acil Servis - Resüsitasyon', currentFloor: 'Zemin Kat', dept: 'Acil', status: 'Aktif', notes: 'Şarj edilmeli', temp: 23.1 },
  { id: 'TAG-004', name: 'Portable USG (GE Vscan)', type: 'Cihaz', tag: 'BLE-A050', battery: 12, lastSeen: '07.04.2026 10:30', currentZone: 'Ameliyathane Koridoru', currentFloor: '1. Kat', dept: 'Cerrahi', status: 'Düşük Pil', notes: 'Pil seviyesi kritik! Şarj edilmeli.', temp: 20.5 },
  { id: 'TAG-005', name: 'Tekerlekli Sandalye #12', type: 'Tekerlekli Sandalye', tag: 'BLE-W012', battery: 78, lastSeen: '07.04.2026 12:05', currentZone: 'Radyoloji Bekleme', currentFloor: 'Zemin Kat', dept: 'Genel', status: 'Aktif', notes: '' },
  { id: 'TAG-006', name: 'Hasta Yatağı #28', type: 'Yatak', tag: 'BLE-B028', battery: 65, lastSeen: '07.04.2026 12:05', currentZone: 'Dahiliye Servisi - Koridor', currentFloor: '3. Kat', dept: 'Dahiliye', status: 'Aktif', notes: 'Boş yatak, temizlenmiş' },
  { id: 'TAG-007', name: 'Uzm. Dr. Ahmet Kılıç', type: 'Personel', tag: 'BLE-P001', battery: 55, lastSeen: '07.04.2026 12:05', currentZone: 'Poliklinik Muayene 3', currentFloor: 'Zemin Kat', dept: 'Dahiliye', status: 'Aktif', notes: '' },
  { id: 'TAG-008', name: 'Hmş. Fatma Korkmaz', type: 'Personel', tag: 'BLE-P015', battery: 70, lastSeen: '07.04.2026 12:05', currentZone: 'Dahiliye Servisi - İlaç Odası', currentFloor: '3. Kat', dept: 'Dahiliye', status: 'Aktif', notes: '' },
  { id: 'TAG-009', name: 'Hasta: Zeynep Kaya (Kaçma Riski)', type: 'Hasta', tag: 'BLE-H003', battery: 80, lastSeen: '07.04.2026 12:05', currentZone: 'Dahiliye Servisi - Oda 302', currentFloor: '3. Kat', dept: 'Dahiliye', status: 'Alarm', notes: 'Demans hastası. Bölge alarmı aktif! İzin verilen alan: Dahiliye Servisi' },
  { id: 'TAG-010', name: 'EKG Cihazı (Schiller AT-102)', type: 'Cihaz', tag: 'BLE-A060', battery: 0, lastSeen: '06.04.2026 18:00', currentZone: 'Son konum: Dahiliye Servisi', currentFloor: '3. Kat', dept: 'Dahiliye', status: 'Çevrimdışı', notes: 'Sinyal yok. Pil bitik veya kapsama dışı.' },
  { id: 'TAG-011', name: 'Anestezia Cihazı (Dräger Fabius)', type: 'Cihaz', tag: 'BLE-A010', battery: 99, lastSeen: '07.04.2026 12:05', currentZone: 'Ameliyathane 1', currentFloor: '1. Kat', dept: 'Ameliyathane', status: 'Aktif', notes: '', temp: 19.8 },
  { id: 'TAG-012', name: 'Op. Dr. Sinan Kaya', type: 'Personel', tag: 'BLE-P002', battery: 85, lastSeen: '07.04.2026 12:05', currentZone: 'Ameliyathane 1', currentFloor: '1. Kat', dept: 'Genel Cerrahi', status: 'Aktif', notes: '' },
  { id: 'TAG-013', name: 'Hasta Yatağı #15 (Elektrikli)', type: 'Yatak', tag: 'BLE-B015', battery: 90, lastSeen: '07.04.2026 12:05', currentZone: 'Yoğun Bakım - Yatak 2', currentFloor: '2. Kat', dept: 'YBÜ', status: 'Aktif', notes: 'Hasta: Ali Vural (Postop)' },
  { id: 'TAG-014', name: 'Hasta: Mehmet Öztürk (Düşme Riski)', type: 'Hasta', tag: 'BLE-H007', battery: 60, lastSeen: '07.04.2026 12:05', currentZone: 'Kardiyoloji Servisi', currentFloor: '2. Kat', dept: 'Kardiyoloji', status: 'Aktif', notes: 'Düşme riski — yatağa bağlı. Hareket alarmı aktif.' },
  { id: 'TAG-015', name: 'Taşınabilir Röntgen (Siemens)', type: 'Cihaz', tag: 'BLE-A025', battery: 38, lastSeen: '07.04.2026 11:45', currentZone: 'Koridor (2. Kat)', currentFloor: '2. Kat', dept: 'Radyoloji', status: 'Aktif', notes: '', temp: 21.0 },
  { id: 'TAG-016', name: 'Hmş. Aysel Toprak', type: 'Personel', tag: 'BLE-P007', battery: 44, lastSeen: '07.04.2026 08:00', currentZone: 'Son konum: Dahiliye Servisi', currentFloor: '3. Kat', dept: 'Yoğun Bakım', status: 'Çevrimdışı', notes: 'Raporda. Tag\'i bırakmış olabilir.' },
  { id: 'TAG-017', name: 'Tekerlekli Sandalye #08', type: 'Tekerlekli Sandalye', tag: 'BLE-W008', battery: 55, lastSeen: '07.04.2026 12:05', currentZone: 'Radyoloji - MR Odası', currentFloor: 'Zemin Kat', dept: 'Radyoloji', status: 'Aktif', notes: '' },
  { id: 'TAG-018', name: 'İnfüzyon Pompası (BBraun #18)', type: 'Cihaz', tag: 'BLE-A018', battery: 76, lastSeen: '07.04.2026 12:05', currentZone: 'YBÜ İzlem', currentFloor: '2. Kat', dept: 'YBÜ', status: 'Aktif', notes: '', temp: 22.0 },
  { id: 'TAG-019', name: 'Hasta: Ayşe Demir (Yenidoğan)', type: 'Hasta', tag: 'BLE-H012', battery: 88, lastSeen: '07.04.2026 12:05', currentZone: 'Doğumhane', currentFloor: '1. Kat', dept: 'Doğum', status: 'Aktif', notes: 'Bebek koçan alarmı aktif. İzin verilen alan: Doğumhane' },
  { id: 'TAG-020', name: 'Anestezi Pompası #5', type: 'Cihaz', tag: 'BLE-A031', battery: 8, lastSeen: '07.04.2026 11:30', currentZone: 'Anestezi Hazırlık', currentFloor: '1. Kat', dept: 'Ameliyathane', status: 'Düşük Pil', notes: 'Kritik pil seviyesi!', temp: 20.1 },
];

const initialAlarms: Alarm[] = [
  { id: 'AL-001', assetId: 'TAG-009', assetName: 'Hasta: Zeynep Kaya', type: 'Coğrafi Alan', msg: 'Hasta izin verilen bölge dışına çıktı! Koridor alarmı tetiklendi.', zone: 'Dahiliye Servisi - Koridor', time: '07.04.2026 11:52', severity: 'critical', ack: false },
  { id: 'AL-002', assetId: 'TAG-004', assetName: 'Portable USG (GE Vscan)', type: 'Düşük Pil', msg: 'Pil seviyesi %12\'ye düştü. Acil şarj gerekli.', zone: 'Ameliyathane Koridoru', time: '07.04.2026 10:30', severity: 'warning', ack: false },
  { id: 'AL-003', assetId: 'TAG-020', assetName: 'Anestezi Pompası #5', type: 'Düşük Pil', msg: 'Pil seviyesi %8. 30 dakika içinde kapanabilir.', zone: 'Anestezi Hazırlık', time: '07.04.2026 11:30', severity: 'critical', ack: false },
  { id: 'AL-004', assetId: 'TAG-010', assetName: 'EKG Cihazı (Schiller AT-102)', type: 'Çevrimdışı', msg: 'Cihaz 18 saattir sinyal vermiyor. Fiziksel kontrol gerekli.', zone: 'Son konum: Dahiliye Servisi', time: '06.04.2026 18:00', severity: 'warning', ack: true },
  { id: 'AL-005', assetId: 'TAG-019', assetName: 'Hasta: Ayşe Demir (Yenidoğan)', type: 'Coğrafi Alan', msg: 'Bebek etiketi doğumhane dışında hareket tespit edildi!', zone: 'Doğumhane - Kapı', time: '07.04.2026 09:15', severity: 'critical', ack: true },
];

// ─── Helper Functions ────────────────────────────────────────────────────
function getRoomById(rooms: FloorRoom[], id: string) {
  return rooms.find(r => r.id === id);
}

function getAssetDotPos(asset: TrackedAsset, floorRoomList: FloorRoom[], jitterSeed: number) {
  const mapping = zoneToRoom[asset.currentZone];
  if (!mapping) return { x: -50, y: -50, visible: false };
  if (mapping.floor !== asset.currentFloor) return { x: -50, y: -50, visible: false };
  const room = getRoomById(floorRoomList, mapping.roomId);
  if (!room) return { x: -50, y: -50, visible: false };
  const jitterX = ((jitterSeed * 37 + 13) % 60) - 30;
  const jitterY = ((jitterSeed * 53 + 7) % 40) - 20;
  return {
    x: room.x + room.w / 2 + jitterX,
    y: room.y + room.h / 2 + jitterY,
    visible: true,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────
function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const c: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100', green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-red-50 text-red-700 border-red-100', amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100', slate: 'bg-slate-100 text-slate-600 border-slate-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100', pink: 'bg-pink-50 text-pink-700 border-pink-100',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c[color] || c.blue}`}>{children}</span>;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X size={16} /></button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const typeColor = (t: string) => t === 'Cihaz' ? 'blue' : t === 'Personel' ? 'purple' : t === 'Hasta' ? 'red' : t === 'Tekerlekli Sandalye' ? 'cyan' : 'amber';
const statusColor = (s: string) => s === 'Aktif' ? 'green' : s === 'Alarm' ? 'red' : s === 'D��şük Pil' ? 'amber' : 'slate';
const typeIcon = (t: string) => t === 'Personel' ? <User size={16} /> : t === 'Hasta' ? <Activity size={16} /> : t === 'Yatak' ? <BedDouble size={16} /> : <MonitorSmartphone size={16} />;

const DOT_COLORS: Record<string, string> = {
  Cihaz: '#3b82f6', Personel: '#8b5cf6', Hasta: '#ef4444',
  'Tekerlekli Sandalye': '#06b6d4', Yatak: '#f59e0b',
};

const tabs = [
  { id: 'harita', label: 'Harita Görünümü', icon: Layers },
  { id: 'varlik', label: 'Varlık Listesi', icon: Focus },
  { id: 'alarm', label: 'Alarm Merkezi', icon: Bell },
  { id: 'analiz', label: 'Analiz', icon: BarChart2 },
];

// ─── Main Component ──────────────────────────────────────────────────────
export function RTLSModule() {
  const [activeTab, setActiveTab] = useState<'harita' | 'varlik' | 'alarm' | 'analiz'>('harita');
  const [selectedFloor, setSelectedFloor] = useState('Zemin Kat');
  const [assets, setAssets] = useState(initialAssets);
  const [alarms, setAlarms] = useState(initialAlarms);
  const [selectedAsset, setSelectedAsset] = useState<TrackedAsset | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tümü');
  const [simRunning, setSimRunning] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const tickRef = useRef(0);

  // Realistic zone movement simulation
  const zonesByFloor: Record<string, string[]> = {
    'Zemin Kat': ['Acil Servis - Resüsitasyon', 'Acil Servis - Triaj', 'Acil Servis Bekleme', 'Radyoloji Bekleme', 'Radyoloji - MR Odası', 'Poliklinik Muayene 3', 'Eczane', 'Laboratuvar'],
    '1. Kat': ['Ameliyathane Koridoru', 'Ameliyathane 1', 'Ameliyathane 3', 'Anestezi Hazırlık', 'Doğumhane'],
    '2. Kat': ['Yoğun Bakım - Yatak 1', 'Yoğun Bakım - Yatak 2', 'YBÜ İzlem', 'Kardiyoloji Servisi', 'Koridor (2. Kat)'],
    '3. Kat': ['Dahiliye Servisi - Oda 302', 'Dahiliye Servisi - Koridor', 'Dahiliye Servisi - İlaç Odası', 'Hemşire İstasyonu', 'Cerrahi Servis - Oda 310'],
  };

  useEffect(() => {
    if (!simRunning) return;
    const interval = setInterval(() => {
      tickRef.current++;
      setAssets(prev => {
        const updated = [...prev];
        // Move 1-2 active assets randomly
        const movable = updated.filter(a => a.status === 'Aktif' && a.type !== 'Hasta');
        const numMove = Math.random() > 0.5 ? 2 : 1;
        for (let i = 0; i < numMove; i++) {
          const idx = Math.floor(Math.random() * movable.length);
          const asset = movable[idx];
          const zones = zonesByFloor[asset.currentFloor];
          if (zones && zones.length > 0) {
            const newZone = zones[Math.floor(Math.random() * zones.length)];
            const assetIdx = updated.findIndex(a => a.id === asset.id);
            if (assetIdx !== -1) {
              updated[assetIdx] = {
                ...updated[assetIdx],
                currentZone: newZone,
                lastSeen: '07.04.2026 ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                battery: Math.max(0, updated[assetIdx].battery - Math.floor(Math.random() * 2)),
              };
            }
          }
        }
        return updated;
      });
      setLastUpdate(new Date());
    }, 4000);
    return () => clearInterval(interval);
  }, [simRunning]);

  const handleAckAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, ack: true } : a));
  };

  const filteredAssets = assets.filter(a => {
    if (typeFilter !== 'Tümü' && a.type !== typeFilter) return false;
    if (searchText && !a.name.toLowerCase().includes(searchText.toLowerCase()) && !a.currentZone.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const floors = Object.keys(floorRooms);
  const currentRooms = floorRooms[selectedFloor] || [];
  const assetsOnFloor = assets.filter(a => a.currentFloor === selectedFloor && a.status !== 'Çevrimdışı');
  const activeAlarms = alarms.filter(a => !a.ack);

  const totalActive = assets.filter(a => a.status === 'Aktif').length;
  const lowBattery = assets.filter(a => a.battery > 0 && a.battery < 20).length;
  const offline = assets.filter(a => a.status === 'Çevrimdışı').length;
  const alarming = assets.filter(a => a.status === 'Alarm').length;

  const zoneData = Object.keys(zonesByFloor).flatMap(floor =>
    [{ floor, patients: assets.filter(a => a.type === 'Hasta' && a.currentFloor === floor).length,
      staff: assets.filter(a => a.type === 'Personel' && a.currentFloor === floor).length,
      devices: assets.filter(a => a.type === 'Cihaz' && a.currentFloor === floor).length }]
  );

  const jitterSeeds: Record<string, number> = {};
  assets.forEach((a, i) => { jitterSeeds[a.id] = i * 7 + 3; });

  return (
    <div className="space-y-5 max-w-[1700px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">RTLS Gerçek Zamanlı Konum Takibi</h2>
          <p className="text-sm text-slate-500">BLE/UWB tabanlı varlık takibi · Personel & hasta konumu · Cihaz yönetimi · Coğrafi alan alarmları</p>
        </div>
        <div className="flex items-center gap-2">
          {activeAlarms.length > 0 && (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs font-bold text-red-700 animate-pulse">
              <Bell size={13} /> {activeAlarms.length} Aktif Alarm
            </span>
          )}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
            <Radio size={12} className={simRunning ? 'text-emerald-500 animate-pulse' : 'text-slate-300'} />
            {simRunning ? `Canlı • ${lastUpdate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Durduruldu'}
          </div>
          <button onClick={() => setSimRunning(v => !v)} className={twMerge('px-3 py-1.5 rounded-lg text-xs font-bold border', simRunning ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')}>
            {simRunning ? 'Durdur' : 'Başlat'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-none">
        {[
          { label: 'Toplam Varlık', value: assets.length, color: 'blue', icon: Focus },
          { label: 'Aktif Tag', value: totalActive, color: 'emerald', icon: Wifi },
          { label: 'Düşük Pil (<20%)', value: lowBattery, color: lowBattery > 0 ? 'amber' : 'slate', icon: BatteryLow },
          { label: 'Çevrimdışı', value: offline, color: offline > 0 ? 'slate' : 'slate', icon: WifiOff },
          { label: 'Alarm', value: alarming + activeAlarms.length, color: (alarming + activeAlarms.length) > 0 ? 'red' : 'slate', icon: Bell },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
            <div className={`w-9 h-9 rounded-lg bg-${kpi.color}-100 flex items-center justify-center flex-shrink-0`}>
              <kpi.icon size={18} className={`text-${kpi.color}-600`} />
            </div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase leading-tight">{kpi.label}</p><p className="text-xl font-black text-slate-800">{kpi.value}</p></div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl flex-none">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id as any)}
            className={twMerge('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center',
              activeTab === t.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
            <t.icon size={14} />{t.label}
            {t.id === 'alarm' && activeAlarms.length > 0 && <span className="bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">{activeAlarms.length}</span>}
          </button>
        ))}
      </div>

      {/* Tab: Harita */}
      {activeTab === 'harita' && (
        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          {/* Floor selector */}
          <div className="flex items-center gap-2 flex-none flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Kat Seç:</span>
            {floors.map(f => (
              <button key={f} onClick={() => setSelectedFloor(f)} className={twMerge('px-3 py-1.5 rounded-lg text-xs font-bold border transition-all', selectedFloor === f ? 'bg-blue-600 text-white border-blue-700 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50')}>
                {f} <span className="ml-1 opacity-70">({assetsOnFloor.filter(a => a.currentFloor === f).length})</span>
              </button>
            ))}
            <div className="ml-auto flex items-center gap-3 text-[10px]">
              {Object.entries(DOT_COLORS).map(([type, color]) => (
                <span key={type} className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>{type}</span>
              ))}
            </div>
          </div>

          {/* Floor plan SVG */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700">
              {selectedFloor} — {assetsOnFloor.length} varlık takip ediliyor
            </div>
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full h-full"
              style={{ maxHeight: '100%' }}
            >
              {/* Background */}
              <rect width={SVG_W} height={SVG_H} fill="#f8fafc" rx="8" />

              {/* Rooms */}
              {currentRooms.map(room => (
                <g key={room.id} onMouseEnter={() => setHoveredRoom(room.id)} onMouseLeave={() => setHoveredRoom(null)}>
                  <rect
                    x={room.x} y={room.y} width={room.w} height={room.h}
                    rx="6" fill={hoveredRoom === room.id ? room.fill.replace('f2', 'e8').replace('50', '30') : room.fill}
                    stroke={room.border} strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  <text
                    x={room.x + room.w / 2}
                    y={room.y + room.h / 2 - 4}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={room.textColor} fontSize="9" fontWeight="700"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {room.label.split('\n').map((line, i) => (
                      <tspan key={i} x={room.x + room.w / 2} dy={i === 0 ? 0 : 12}>{line}</tspan>
                    ))}
                  </text>
                </g>
              ))}

              {/* Asset dots */}
              {assetsOnFloor.map((asset) => {
                const pos = getAssetDotPos(asset, currentRooms, jitterSeeds[asset.id] || 0);
                if (!pos.visible) return null;
                const color = asset.status === 'Alarm' ? '#ef4444' : asset.status === 'Düşük Pil' ? '#f59e0b' : DOT_COLORS[asset.type] || '#64748b';
                const isSelected = selectedAsset?.id === asset.id;
                return (
                  <g key={asset.id} onClick={() => setSelectedAsset(asset)} style={{ cursor: 'pointer' }}>
                    {/* Pulse ring for alarms */}
                    {(asset.status === 'Alarm') && (
                      <>
                        <circle cx={pos.x} cy={pos.y} r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.4">
                          <animate attributeName="r" from="8" to="20" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}
                    {/* Selection ring */}
                    {isSelected && <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="#3b82f6" strokeWidth="2.5" />}
                    {/* Main dot */}
                    <circle cx={pos.x} cy={pos.y} r="7" fill={color} stroke="white" strokeWidth="1.5"
                      style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }} />
                    {/* Dot indicator for low battery */}
                    {asset.status === 'Düşük Pil' && (
                      <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7" fontWeight="900">!</text>
                    )}
                    {/* Label */}
                    <text x={pos.x} y={pos.y + 13} textAnchor="middle" fill="#1e293b" fontSize="7" fontWeight="600" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                      {asset.name.split(' ').slice(-1)[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected asset detail */}
          {selectedAsset && (
            <div className={twMerge('bg-white rounded-xl border p-4 shadow-md flex-none flex items-start gap-4',
              selectedAsset.status === 'Alarm' ? 'border-red-300 bg-red-50' : selectedAsset.status === 'Düşük Pil' ? 'border-amber-300 bg-amber-50' : 'border-blue-200')}>
              <div className={twMerge('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', selectedAsset.type === 'Cihaz' ? 'bg-blue-100 text-blue-600' : selectedAsset.type === 'Personel' ? 'bg-purple-100 text-purple-600' : selectedAsset.type === 'Hasta' ? 'bg-red-100 text-red-600' : 'bg-cyan-100 text-cyan-600')}>
                {typeIcon(selectedAsset.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-bold text-slate-800">{selectedAsset.name}</span>
                  <Badge color={typeColor(selectedAsset.type)}>{selectedAsset.type}</Badge>
                  <Badge color={statusColor(selectedAsset.status)}>{selectedAsset.status}</Badge>
                </div>
                <p className="text-xs text-slate-600 flex items-center gap-1"><MapPin size={11} /> {selectedAsset.currentZone} — {selectedAsset.currentFloor}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Tag: {selectedAsset.tag} • Son: {selectedAsset.lastSeen}</p>
                {selectedAsset.notes && <p className="text-[10px] text-red-600 mt-1 font-medium">{selectedAsset.notes}</p>}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {selectedAsset.temp && (
                  <div className="text-center"><Thermometer size={14} className="text-orange-400 mx-auto" /><p className="text-xs font-bold">{selectedAsset.temp}°C</p></div>
                )}
                <div className="text-center">
                  <div className="w-16 bg-slate-200 rounded-full h-2 mb-1">
                    <div className={twMerge('h-2 rounded-full', selectedAsset.battery > 50 ? 'bg-emerald-500' : selectedAsset.battery > 20 ? 'bg-amber-500' : 'bg-red-500')}
                      style={{ width: `${selectedAsset.battery}%` }}></div>
                  </div>
                  <span className="text-xs font-bold">{selectedAsset.battery}%</span>
                </div>
                <button onClick={() => setSelectedAsset(null)} className="p-1 hover:bg-slate-200 rounded"><X size={14} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Varlık Listesi */}
      {activeTab === 'varlik' && (
        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap items-center flex-none">
            <div className="relative">
              <Search className="absolute left-3 top-2 text-slate-400" size={14} />
              <input type="text" placeholder="Varlık veya bölge ara..." value={searchText} onChange={e => setSearchText(e.target.value)}
                className="pl-8 pr-4 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-400 w-52" />
            </div>
            {['Tümü', 'Cihaz', 'Personel', 'Hasta', 'Yatak', 'Tekerlekli Sandalye'].map(f => (
              <button key={f} onClick={() => setTypeFilter(f)} className={twMerge('px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border', typeFilter === f ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50')}>{f}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredAssets.map(a => (
              <div key={a.id} onClick={() => { setSelectedAsset(a); setActiveTab('harita'); setSelectedFloor(a.currentFloor); }}
                className={twMerge('bg-white rounded-xl border shadow-sm p-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all',
                  a.status === 'Çevrimdışı' ? 'opacity-60 border-slate-200' : a.status === 'Düşük Pil' ? 'border-amber-200 bg-amber-50/30' : a.status === 'Alarm' ? 'border-red-300 bg-red-50/30' : 'border-slate-200')}>
                <div className={twMerge('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', a.type === 'Cihaz' ? 'bg-blue-100 text-blue-600' : a.type === 'Personel' ? 'bg-purple-100 text-purple-600' : a.type === 'Hasta' ? 'bg-red-100 text-red-600' : 'bg-cyan-100 text-cyan-600')}>
                  {typeIcon(a.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="text-xs font-bold text-slate-800 truncate">{a.name}</span>
                    <Badge color={typeColor(a.type)}>{a.type}</Badge>
                    <Badge color={statusColor(a.status)}>{a.status}</Badge>
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1"><MapPin size={10} /> {a.currentZone} — {a.currentFloor}</p>
                  <p className="text-[10px] text-slate-400">Tag: {a.tag} • Son: {a.lastSeen}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className="w-14 bg-slate-200 rounded-full h-1.5">
                      <div className={twMerge('h-1.5 rounded-full', a.battery > 50 ? 'bg-emerald-500' : a.battery > 20 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${a.battery}%` }}></div>
                    </div>
                    <span className={twMerge('text-[11px] font-bold', a.battery > 50 ? 'text-emerald-600' : a.battery > 20 ? 'text-amber-600' : 'text-red-600')}>{a.battery}%</span>
                  </div>
                  {a.temp && <p className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-end gap-0.5"><Thermometer size={10} />{a.temp}°C</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Alarm Merkezi */}
      {activeTab === 'alarm' && (
        <div className="flex-1 overflow-hidden flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-none">
            <div className="flex gap-2">
              {[
                { label: 'Aktif Alarmlar', count: activeAlarms.length, color: 'red' },
                { label: 'Onaylandı', count: alarms.filter(a => a.ack).length, color: 'slate' },
                { label: 'Kritik', count: alarms.filter(a => a.severity === 'critical').length, color: 'amber' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-center shadow-sm">
                  <p className="text-xl font-black text-slate-800">{s.count}</p>
                  <p className="text-[10px] text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {activeAlarms.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-xs text-red-700 flex-none animate-pulse">
              <Volume2 size={14} className="flex-shrink-0" /> <strong>{activeAlarms.length} aktif alarm</strong> — Acil müdahale gerektirebilir!
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-2">
            {alarms.map(al => (
              <div key={al.id} className={twMerge('bg-white rounded-xl border p-4 shadow-sm',
                al.ack ? 'opacity-60 border-slate-200' : al.severity === 'critical' ? 'border-red-300 bg-red-50/50' : 'border-amber-300 bg-amber-50/50')}>
                <div className="flex items-start gap-3">
                  <div className={twMerge('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                    al.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600')}>
                    {al.type === 'Coğrafi Alan' ? <Shield size={16} /> : al.type === 'Düşük Pil' ? <BatteryLow size={16} /> : al.type === 'Çevrimdışı' ? <WifiOff size={16} /> : <AlertTriangle size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-slate-400">{al.id}</span>
                      <Badge color={al.severity === 'critical' ? 'red' : 'amber'}>{al.type}</Badge>
                      <Badge color={al.severity === 'critical' ? 'red' : 'amber'}>{al.severity === 'critical' ? 'KRİTİK' : 'UYARI'}</Badge>
                      {al.ack && <Badge color="green">Onaylandı</Badge>}
                    </div>
                    <p className="text-sm font-bold text-slate-800">{al.assetName}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{al.msg}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={10} />{al.zone}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5"><Clock size={10} />{al.time}</span>
                    </div>
                  </div>
                  {!al.ack && (
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button onClick={() => handleAckAlarm(al.id)} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700"><CheckCircle2 size={12} /> Onayla</button>
                      <button onClick={() => { setActiveTab('harita'); setSelectedFloor(assets.find(a => a.id === al.assetId)?.currentFloor || 'Zemin Kat'); setSelectedAsset(assets.find(a => a.id === al.assetId) || null); }} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100 border border-blue-200"><Eye size={12} /> Haritada Gör</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Analiz */}
      {activeTab === 'analiz' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Kat Bazlı Varlık Dağılımı</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={zoneData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="floor" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Legend iconType="circle" iconSize={10} />
                  <Bar dataKey="patients" name="Hasta" fill="#ef4444" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="staff" name="Personel" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="devices" name="Cihaz" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h4 className="text-sm font-bold text-slate-700 mb-4">Varlık Türü Dağılımı</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={Object.entries(DOT_COLORS).map(([type, color]) => ({ name: type, value: assets.filter(a => a.type === type).length, color }))}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value"
                    label={({ name, value }) => `${value}`}
                  >
                    {Object.entries(DOT_COLORS).map(([type, color]) => <Cell key={`pie-cell-${type}`} fill={color} />)}
                  </Pie>
                  <Tooltip formatter={(v: any, n: any) => [v + ' adet', n]} />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Battery status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Battery size={16} className="text-emerald-500" /> Varlık Pil Durumu — Kritik ve Düşük Pil Uyarısı</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {assets.filter(a => a.battery >= 0).sort((a, b) => a.battery - b.battery).slice(0, 12).map(a => (
                <div key={a.id} className="flex items-center gap-3 text-xs">
                  <span className="w-40 truncate font-medium text-slate-700">{a.name.split('(')[0].trim()}</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div className={twMerge('h-2 rounded-full transition-all', a.battery > 50 ? 'bg-emerald-500' : a.battery > 20 ? 'bg-amber-500' : 'bg-red-500')}
                      style={{ width: `${a.battery}%` }}></div>
                  </div>
                  <span className={twMerge('w-8 text-right font-bold', a.battery > 50 ? 'text-emerald-600' : a.battery > 20 ? 'text-amber-600' : 'text-red-600')}>{a.battery}%</span>
                  {a.battery < 20 && <Badge color={a.battery === 0 ? 'slate' : 'red'}>{a.battery === 0 ? 'Çevrimdışı' : 'Kritik'}</Badge>}
                </div>
              ))}
            </div>
          </div>

          {/* Zone activity */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-700 mb-3">Bölge Aktivite Özeti</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {Object.entries(zonesByFloor).map(([floor, zones]) => (
                <div key={floor} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="font-bold text-slate-700 mb-2">{floor}</p>
                  <div className="space-y-1">
                    <p className="text-slate-500">🔴 Hasta: <strong>{assets.filter(a => a.type === 'Hasta' && a.currentFloor === floor).length}</strong></p>
                    <p className="text-slate-500">🟣 Personel: <strong>{assets.filter(a => a.type === 'Personel' && a.currentFloor === floor).length}</strong></p>
                    <p className="text-slate-500">🔵 Cihaz: <strong>{assets.filter(a => a.type === 'Cihaz' && a.currentFloor === floor).length}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
