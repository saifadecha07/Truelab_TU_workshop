import { Ship, MapPin, Clock, Activity, AlertTriangle, Anchor, Navigation2, Radio } from 'lucide-react';
import { vessels } from '../data/mockData';

const statusConfig = {
  EN_ROUTE: { label: 'กำลังเดินทาง', color: 'text-cyan-400', badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400', dot: 'bg-cyan-400' },
  APPROACHING: { label: 'ใกล้ถึงท่า', color: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400', dot: 'bg-yellow-400' },
  ALERT: { label: 'แจ้งเตือนวิกฤต', color: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20 text-red-400', dot: 'bg-red-400 pulse-critical' },
};

const VolumeBar = ({ current, declared, label }) => {
  const pct = Math.min(100, (current / declared) * 100);
  const diff = current - declared;
  const isOver = diff > 0;
  const anomaly = Math.abs(diff / declared) * 100 > 0.5;
  return (
    <div>
      <div className="flex justify-between text-[9px] mb-1">
        <span className="text-slate-500">{label}</span>
        <span className={`font-mono font-bold ${anomaly ? 'text-red-400' : 'text-green-400'}`}>
          {current.toLocaleString()} / {declared.toLocaleString()} L
          {diff !== 0 && <span className="ml-1">({isOver ? '+' : ''}{diff.toLocaleString()})</span>}
        </span>
      </div>
      <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
        <div
          className={`h-full rounded-full ${anomaly ? 'bg-red-400' : 'bg-cyan-400'} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default function Vessel() {
  const alertVessels = vessels.filter((v) => v.status === 'ALERT').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100">Vessel Tracking (AIS)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ติดตามเรือขนส่งน้ำมัน {vessels.length} ลำ ผ่านระบบ AIS (Automatic Identification System)
          </p>
        </div>
        <div className="flex items-center gap-3">
          {alertVessels > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertTriangle size={12} className="text-red-400 pulse-critical" />
              <span className="text-[10px] text-red-400 font-mono">{alertVessels} AIS BLACKOUT</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg">
            <Radio size={12} className="text-cyan-400 blink" />
            <span className="text-[10px] text-cyan-400 font-mono">AIS RECEIVING</span>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-700 flex items-center gap-2">
          <Navigation2 size={12} className="text-cyan-400" />
          <span className="text-[10px] text-slate-400">Maritime Tracking Chart — Gulf of Thailand / Andaman Sea</span>
          <span className="ml-auto text-[9px] text-slate-600 font-mono">PROJECTION: MERCATOR</span>
        </div>
        <div
          className="relative h-52 overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, #0c2a4a 0%, #0a1628 50%, #060e1a 100%)',
            backgroundImage: 'radial-gradient(ellipse at 30% 40%, #0c2a4a 0%, #0a1628 50%, #060e1a 100%), repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(6,182,212,0.03) 30px, rgba(6,182,212,0.03) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(6,182,212,0.03) 30px, rgba(6,182,212,0.03) 31px)',
          }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />

          {/* Coastline hint */}
          <div className="absolute bottom-0 right-0 w-1/3 h-3/4 bg-gradient-to-tl from-slate-700/40 to-transparent rounded-tl-3xl border-t border-l border-slate-600/20" />
          <div className="absolute top-0 left-0 w-1/4 h-1/2 bg-gradient-to-br from-slate-700/30 to-transparent rounded-br-3xl border-r border-b border-slate-600/20" />

          {/* Vessel markers */}
          {vessels.map((v, i) => {
            const positions = [
              { x: '25%', y: '45%' },
              { x: '55%', y: '65%' },
              { x: '18%', y: '70%' },
            ];
            const pos = positions[i];
            const s = statusConfig[v.status];
            return (
              <div key={v.id} className="absolute" style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}>
                <div className={`relative`}>
                  {v.status === 'ALERT' ? (
                    <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center pulse-critical">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                    </div>
                  ) : (
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${v.status === 'APPROACHING' ? 'bg-yellow-500/30 border border-yellow-400/50' : 'bg-cyan-500/20 border border-cyan-400/40'}`}>
                      <Ship size={9} className={v.status === 'APPROACHING' ? 'text-yellow-400' : 'text-cyan-400'} />
                    </div>
                  )}
                  <div className="absolute left-5 top-0 whitespace-nowrap bg-slate-900/90 border border-slate-700 rounded px-1.5 py-0.5">
                    <div className="text-[8px] font-mono font-bold text-slate-200">{v.id}</div>
                    <div className={`text-[7px] ${s.color}`}>{v.status}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700">
            {['EN_ROUTE', 'APPROACHING', 'ALERT'].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[s].dot}`} />
                <span className="text-[8px] text-slate-500">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vessel Cards */}
      <div className="grid grid-cols-3 gap-4">
        {vessels.map((vessel) => {
          const s = statusConfig[vessel.status];
          const diff = vessel.ullageVolume - vessel.declaredVolume;
          const diffPct = Math.abs((diff / vessel.declaredVolume) * 100).toFixed(2);
          const anomaly = parseFloat(diffPct) > 0.5;
          const aisStale = vessel.status === 'ALERT';
          return (
            <div
              key={vessel.id}
              className={`bg-slate-800/60 border rounded-xl overflow-hidden ${
                vessel.status === 'ALERT'
                  ? 'border-red-500/40'
                  : vessel.status === 'APPROACHING'
                  ? 'border-yellow-500/30'
                  : 'border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className={`px-4 py-3 border-b ${vessel.status === 'ALERT' ? 'border-red-500/20 bg-red-500/5' : 'border-slate-700 bg-slate-900/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      vessel.status === 'ALERT' ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-700 border border-slate-600'
                    }`}>
                      <Ship size={18} className={s.color} />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-200 leading-tight">{vessel.name}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{vessel.flag} · IMO {vessel.imo}</div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border flex-shrink-0 ${s.badge}`}>
                    {vessel.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <div className="text-slate-600 mb-0.5">ต้นทาง</div>
                    <div className="text-slate-300">{vessel.origin}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-0.5">ปลายทาง</div>
                    <div className="text-slate-300">{vessel.destination}</div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-0.5">ETA</div>
                    <div className={`font-mono ${vessel.status === 'APPROACHING' ? 'text-yellow-400' : 'text-slate-300'}`}>
                      {vessel.eta}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600 mb-0.5">ประเภทเรือ</div>
                    <div className="text-slate-300">{vessel.type}</div>
                  </div>
                </div>

                {/* AIS Status */}
                <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                  aisStale ? 'bg-red-500/10 border border-red-500/20' : 'bg-slate-900/50 border border-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <Radio size={11} className={aisStale ? 'text-red-400' : 'text-green-400 blink'} />
                    <span className={`text-[10px] font-mono ${aisStale ? 'text-red-400' : 'text-green-400'}`}>
                      {aisStale ? 'AIS BLACKOUT' : 'AIS ACTIVE'}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{vessel.lastAIS}</span>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-4 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <Navigation2 size={11} className="text-slate-500" />
                    <span className="text-slate-300 font-mono">
                      {vessel.speed > 0 ? `${vessel.speed} kts` : 'หยุด'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={11} className="text-slate-500" />
                    <span className="text-slate-400 font-mono text-[9px]">{vessel.position}</span>
                  </div>
                </div>

                {/* Volume */}
                <VolumeBar
                  current={vessel.ullageVolume}
                  declared={vessel.declaredVolume}
                  label="Ullage vs B/L"
                />

                {/* Cargo */}
                <div className="text-[9px] text-slate-500">
                  <span className="text-slate-600">Cargo: </span>
                  <span className="text-cyan-400 font-mono">{vessel.fuelType}</span>
                  <span className="mx-2 text-slate-700">·</span>
                  <span className="text-slate-600">Draught: </span>
                  <span className="text-slate-400 font-mono">{vessel.draught}</span>
                </div>

                {vessel.status === 'ALERT' && (
                  <div className="flex items-start gap-2 px-2.5 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    <AlertTriangle size={10} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-[9px] text-red-400 leading-relaxed">
                      ไม่ได้รับสัญญาณ AIS นานกว่า 2.5 ชม. — ส่งเรือตรวจการณ์สืบสวน
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
