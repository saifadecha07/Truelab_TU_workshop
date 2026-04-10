import { X, MapPin, User, Phone, Lock, Unlock, Thermometer, Fuel, Navigation, Clock, AlertTriangle } from 'lucide-react';

const statusConfig = {
  IN_TRANSIT: { label: 'กำลังวิ่ง', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  ALERT: { label: 'แจ้งเตือน', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  DELIVERED: { label: 'ส่งแล้ว', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
};

const sealConfig = {
  LOCKED: { color: 'text-green-400', icon: Lock, label: 'ล็อคอยู่' },
  UNLOCKED: { color: 'text-red-400', icon: Unlock, label: 'เปิดแล้ว — ผิดปกติ!' },
};

export default function TruckModal({ truck, onClose }) {
  if (!truck) return null;

  const status = statusConfig[truck.status];
  const seal = sealConfig[truck.eSeal];
  const SealIcon = seal.icon;
  const volumeLoss = truck.loadedVolume - truck.currentVolume;
  const volumeLossPct = ((volumeLoss / truck.loadedVolume) * 100).toFixed(2);
  const isAnomaly = parseFloat(volumeLossPct) > 0.5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center">
              <span className="text-xs font-bold text-cyan-400">{truck.id}</span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">{truck.plate}</div>
              <div className="text-[10px] text-slate-500 font-mono">{truck.route}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border font-mono ${status.color}`}>
              {truck.status}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors">
              <X size={16} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            {/* Driver Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">ข้อมูลคนขับ</div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <User size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-200">{truck.driver}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-400 font-mono">{truck.driverPhone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Fuel size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-400">{truck.fuelType}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Thermometer size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-400">{truck.temperature}°C</span>
                </div>
              </div>
            </div>

            {/* Route Info */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">เส้นทาง</div>
              <div className="space-y-2.5">
                <div>
                  <div className="text-[9px] text-slate-600 mb-0.5">ต้นทาง</div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-cyan-400 flex-shrink-0" />
                    <span className="text-[11px] text-slate-300">{truck.origin}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-600 mb-0.5">ปลายทาง</div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-green-400 flex-shrink-0" />
                    <span className="text-[11px] text-slate-300">{truck.destination}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-400 font-mono">
                    {truck.departure} → {truck.eta}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Navigation size={14} className="text-slate-500" />
                  <span className="text-xs text-slate-400 font-mono">
                    {truck.gps.speed} km/h · {truck.gps.lastUpdate}
                  </span>
                </div>
              </div>
            </div>

            {/* e-Seal Status */}
            <div className={`bg-slate-800/50 border rounded-xl p-4 ${truck.eSeal === 'UNLOCKED' ? 'border-red-500/40' : 'border-slate-700'}`}>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">e-Seal Status</div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${truck.eSeal === 'UNLOCKED' ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
                  <SealIcon size={20} className={seal.color} />
                </div>
                <div>
                  <div className={`text-sm font-bold ${seal.color}`}>{truck.eSeal}</div>
                  <div className={`text-[10px] ${seal.color} opacity-70`}>{seal.label}</div>
                </div>
              </div>
              <div className="mt-3 text-[10px] text-slate-500 font-mono">
                Seal ID: {truck.sealId}
              </div>
              {truck.eSeal === 'UNLOCKED' && (
                <div className="mt-2 flex items-center gap-1.5 px-2 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
                  <AlertTriangle size={10} className="text-red-400" />
                  <span className="text-[9px] text-red-400">ต้องรายงานต่อเจ้าหน้าที่ทันที</span>
                </div>
              )}
            </div>

            {/* Volume Reconciliation */}
            <div className={`bg-slate-800/50 border rounded-xl p-4 ${isAnomaly ? 'border-red-500/40' : 'border-slate-700'}`}>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Volume Reconciliation</div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">บรรจุ (Origin)</span>
                  <span className="text-cyan-400 font-mono">{truck.loadedVolume.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">ปัจจุบัน</span>
                  <span className={`font-mono ${isAnomaly ? 'text-red-400' : 'text-green-400'}`}>
                    {truck.currentVolume.toLocaleString()} L
                  </span>
                </div>
                <div className={`flex justify-between text-xs pt-2 border-t ${isAnomaly ? 'border-red-500/20' : 'border-slate-700'}`}>
                  <span className="text-slate-500">Δ ขาดหาย</span>
                  <span className={`font-mono font-bold ${isAnomaly ? 'text-red-400' : 'text-green-400'}`}>
                    {volumeLoss.toLocaleString()} L ({volumeLossPct}%)
                  </span>
                </div>
              </div>
              {isAnomaly && (
                <div className="mt-2 flex items-center gap-1.5 px-2 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
                  <AlertTriangle size={10} className="text-red-400 pulse-critical" />
                  <span className="text-[9px] text-red-400 font-bold">เกินเกณฑ์ 0.5% — ต้องสอบสวน</span>
                </div>
              )}
            </div>
          </div>

          {/* Compartments */}
          <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">ถังบรรจุ (Compartments)</div>
            <div className="grid grid-cols-3 gap-3">
              {truck.compartments.map((c) => {
                const fill = (c.loaded / c.capacity) * 100;
                return (
                  <div key={c.id} className="text-center">
                    <div className="text-[9px] text-slate-500 mb-1.5">ถัง {c.id}</div>
                    <div className="relative h-16 bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600 to-cyan-400/60 transition-all"
                        style={{ height: `${fill}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white drop-shadow">{fill.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1 font-mono">
                      {c.loaded.toLocaleString()}/{c.capacity.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GPS */}
          <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">GPS Position</div>
            <div className="flex items-center gap-4">
              <div className="font-mono text-xs text-slate-300">
                {truck.gps.lat.toFixed(4)}°N, {truck.gps.lng.toFixed(4)}°E
              </div>
              <div className="text-[10px] text-slate-500">
                อัพเดต: {truck.gps.lastUpdate}
              </div>
              <div className={`ml-auto text-[10px] font-mono ${truck.gps.speed > 0 ? 'text-cyan-400' : 'text-yellow-400'}`}>
                {truck.gps.speed > 0 ? `${truck.gps.speed} km/h` : 'จอดอยู่'}
              </div>
            </div>
            {/* Fake map placeholder */}
            <div className="mt-3 h-24 bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
              <div className="relative flex flex-col items-center gap-1">
                <MapPin size={20} className="text-red-400" />
                <span className="text-[9px] text-slate-500 font-mono">
                  {truck.gps.lat.toFixed(4)}, {truck.gps.lng.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
