import { useState } from 'react';
import { Lock, Unlock, MapPin, Search, Filter, Truck } from 'lucide-react';
import { trucks } from '../data/mockData';
import TruckModal from './TruckModal';

const statusConfig = {
  IN_TRANSIT: { label: 'กำลังวิ่ง', dot: 'bg-cyan-400', text: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
  ALERT: { label: 'แจ้งเตือน', dot: 'bg-red-400 pulse-critical', text: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-400' },
  DELIVERED: { label: 'ส่งแล้ว', dot: 'bg-green-400', text: 'text-green-400', badge: 'bg-green-500/10 border-green-500/20 text-green-400' },
};

export default function TruckFleet() {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = trucks.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.plate.toLowerCase().includes(search.toLowerCase()) ||
      t.driver.toLowerCase().includes(search.toLowerCase()) ||
      t.route.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100">กองรถบรรทุก</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ติดตามรถขนส่งน้ำมัน {trucks.length} คัน · คลิกแถวเพื่อดูรายละเอียด
          </p>
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'IN_TRANSIT', 'ALERT', 'DELIVERED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all ${
                filterStatus === s
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s === 'ALL' ? 'ทั้งหมด' : s}
              <span className="ml-1.5 text-slate-600">
                ({s === 'ALL' ? trucks.length : trucks.filter((t) => t.status === s).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="ค้นหา รถ, คนขับ, เส้นทาง..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/50">
                {['ID', 'ทะเบียน / คนขับ', 'เส้นทาง', 'สถานะ', 'e-Seal', 'ปริมาณ', 'ETA', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-slate-500 uppercase tracking-widest font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((truck, idx) => {
                const s = statusConfig[truck.status];
                const volumeLoss = truck.loadedVolume - truck.currentVolume;
                const pct = ((volumeLoss / truck.loadedVolume) * 100).toFixed(1);
                const isAnomaly = parseFloat(pct) > 0.5;
                return (
                  <tr
                    key={truck.id}
                    onClick={() => setSelectedTruck(truck)}
                    className={`border-b border-slate-800 cursor-pointer transition-colors hover:bg-slate-700/40 group
                      ${truck.status === 'ALERT' ? 'bg-red-500/3' : ''}
                      ${idx % 2 === 0 ? 'bg-slate-800/20' : ''}`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={`status-dot flex-shrink-0 ${s.dot}`} />
                        <span className={`text-[11px] font-bold font-mono ${s.text}`}>{truck.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-slate-200 font-mono">{truck.plate}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{truck.driver}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px] text-slate-300 max-w-[180px] truncate">{truck.route}</div>
                      <div className="text-[9px] text-slate-600 mt-0.5 font-mono">{truck.fuelType}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${s.badge}`}>
                        {truck.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className={`flex items-center gap-1.5 ${truck.eSeal === 'UNLOCKED' ? 'text-red-400' : 'text-green-400'}`}>
                        {truck.eSeal === 'LOCKED'
                          ? <Lock size={13} />
                          : <Unlock size={13} className="pulse-critical" />
                        }
                        <span className="text-[10px] font-mono">{truck.eSeal}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px] font-mono text-slate-300">
                        {truck.currentVolume.toLocaleString()} L
                      </div>
                      <div className={`text-[9px] font-mono ${isAnomaly ? 'text-red-400' : 'text-slate-500'}`}>
                        {isAnomaly ? `▼ ${pct}% !!` : `▼ ${pct}%`}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[11px] font-mono text-slate-400">{truck.eta}</div>
                      <div className="text-[9px] text-slate-600 font-mono">{truck.gps.speed > 0 ? `${truck.gps.speed} km/h` : 'จอด'}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-[10px] text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        ดูรายละเอียด →
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-sm">
              ไม่พบข้อมูลที่ค้นหา
            </div>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-xl">
        <div className="flex items-center gap-2">
          <Truck size={12} className="text-slate-500" />
          <span className="text-[10px] text-slate-500">แสดง {filtered.length} / {trucks.length} คัน</span>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-[10px] text-slate-500">
            ปริมาณรวม: <span className="text-cyan-400 font-mono">{trucks.reduce((s, t) => s + t.currentVolume, 0).toLocaleString()} L</span>
          </div>
          <div className="text-[10px] text-slate-500">
            ขาดหายรวม: <span className="text-red-400 font-mono">
              {trucks.reduce((s, t) => s + (t.loadedVolume - t.currentVolume), 0).toLocaleString()} L
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedTruck && (
        <TruckModal truck={selectedTruck} onClose={() => setSelectedTruck(null)} />
      )}
    </div>
  );
}
