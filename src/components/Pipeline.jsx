import { Gauge, Thermometer, Activity, AlertTriangle, ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { pipelineNodes } from '../data/mockData';

const GaugeBar = ({ value, min, max, status, unit }) => {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const isWarning = status === 'WARNING';
  const isNormal = status === 'NORMAL';

  return (
    <div>
      <div className="flex justify-between text-[9px] mb-1.5">
        <span className="text-slate-600 font-mono">{min} {unit}</span>
        <span className={`font-bold font-mono ${isWarning ? 'text-yellow-400' : 'text-green-400'}`}>
          {value} {unit}
        </span>
        <span className="text-slate-600 font-mono">{max} {unit}</span>
      </div>
      <div className="h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
        {/* Danger zone markers */}
        <div className="absolute inset-0 flex">
          <div className="h-full bg-red-900/30" style={{ width: '10%' }} />
          <div className="h-full flex-1" />
          <div className="h-full bg-red-900/30" style={{ width: '10%' }} />
        </div>
        {/* Fill */}
        <div
          className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
            isWarning ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
          }`}
          style={{ width: `${pct}%` }}
        />
        {/* Normal range indicator */}
        <div className="absolute top-0 bottom-0 border-l border-dashed border-white/20" style={{ left: '10%' }} />
        <div className="absolute top-0 bottom-0 border-r border-dashed border-white/20" style={{ right: '10%' }} />
      </div>
      <div className="flex justify-between text-[8px] mt-0.5 text-slate-700">
        <span>MIN</span>
        <span>NORMAL RANGE</span>
        <span>MAX</span>
      </div>
    </div>
  );
};

export default function Pipeline() {
  const totalFlow = pipelineNodes.reduce((s, n) => s + n.flowRate, 0);
  const warnings = pipelineNodes.filter((n) => n.status === 'WARNING').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100">Pipeline Monitor</h1>
          <p className="text-xs text-slate-500 mt-0.5">ระบบท่อส่งน้ำมัน — สีชัง → แหลมฉบัง</p>
        </div>
        <div className="flex items-center gap-3">
          {warnings > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle size={12} className="text-yellow-400" />
              <span className="text-[10px] text-yellow-400 font-mono">{warnings} WARNING</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
            <Activity size={12} className="text-green-400 blink" />
            <span className="text-[10px] text-green-400 font-mono">PIPELINE ONLINE</span>
          </div>
        </div>
      </div>

      {/* Pipeline Diagram */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-6">Schematic Diagram</div>
        <div className="flex items-center justify-between relative">
          {pipelineNodes.map((node, idx) => (
            <div key={node.id} className="flex items-center flex-1">
              {/* Node */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center
                  ${node.status === 'WARNING'
                    ? 'bg-yellow-500/10 border-yellow-500/40 glow-yellow'
                    : 'bg-cyan-500/10 border-cyan-500/30 glow-cyan'
                  }`}
                >
                  <Gauge size={28} className={node.status === 'WARNING' ? 'text-yellow-400' : 'text-cyan-400'} />
                </div>
                <div className="text-center">
                  <div className={`text-[10px] font-bold font-mono ${node.status === 'WARNING' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                    {node.id}
                  </div>
                  <div className="text-[9px] text-slate-500 max-w-[100px] text-center leading-tight mt-0.5">
                    {node.name.split('(')[0].trim()}
                  </div>
                  <div className="text-[9px] text-slate-600">{node.location}</div>
                </div>
                <div className={`text-[9px] px-2 py-0.5 rounded-full border font-mono ${
                  node.status === 'WARNING'
                    ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                    : 'text-green-400 bg-green-500/10 border-green-500/20'
                }`}>
                  {node.status}
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-bold text-slate-200 font-mono">{node.pressure} PSI</div>
                  <div className="text-[10px] text-slate-400 font-mono">{node.flowRate.toLocaleString()} L/hr</div>
                </div>
              </div>

              {/* Connector pipe */}
              {idx < pipelineNodes.length - 1 && (
                <div className="flex-1 flex items-center justify-center px-4 relative">
                  <div className="w-full h-2 bg-gradient-to-r from-cyan-800 to-cyan-700 rounded-full relative overflow-hidden border-t border-b border-cyan-600/30">
                    {/* Flow animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse" />
                  </div>
                  <div className="absolute -top-5 text-[9px] text-slate-500 font-mono text-center whitespace-nowrap">
                    ~45 km
                  </div>
                  <ArrowRight size={12} className="absolute text-cyan-500 bg-slate-800 rounded-full p-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Flow Stats */}
        <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
          <div className="text-[10px] text-slate-500">
            อัตราการไหลรวม: <span className="text-cyan-400 font-mono font-bold">{totalFlow.toLocaleString()} L/hr</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Pipeline Length: <span className="text-slate-300 font-mono">~90 km</span>
          </div>
          <div className="text-[10px] text-slate-500">
            ประสิทธิภาพ: <span className="text-green-400 font-mono">{((pipelineNodes[2].flowRate / pipelineNodes[0].flowRate) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Node Detail Cards */}
      <div className="grid grid-cols-3 gap-4">
        {pipelineNodes.map((node) => (
          <div
            key={node.id}
            className={`bg-slate-800/60 border rounded-xl p-5 space-y-4 ${
              node.status === 'WARNING' ? 'border-yellow-500/30' : 'border-slate-700'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] text-slate-500 font-mono">{node.id}</div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5 leading-tight">{node.name}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">{node.location}</div>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full border font-mono flex-shrink-0 ${
                node.status === 'WARNING'
                  ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                  : 'text-green-400 bg-green-500/10 border-green-500/20'
              }`}>
                {node.status}
              </span>
            </div>

            {/* Pressure */}
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">ความดัน (Pressure)</div>
              <GaugeBar
                value={node.pressure}
                min={node.pressureMin}
                max={node.pressureMax}
                status={node.status}
                unit="PSI"
              />
            </div>

            {/* Flow Rate */}
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">อัตราการไหล (Flow Rate)</div>
              <GaugeBar
                value={node.flowRate}
                min={node.flowMin}
                max={node.flowMax}
                status="NORMAL"
                unit="L/hr"
              />
            </div>

            {/* Metadata */}
            <div className="pt-3 border-t border-slate-700 grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] text-slate-600">อุณหภูมิ</div>
                <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1 mt-0.5">
                  <Thermometer size={10} className="text-orange-400" />
                  {node.temperature}°C
                </div>
              </div>
              <div>
                <div className="text-[9px] text-slate-600">Uptime</div>
                <div className="text-[11px] text-green-400 font-mono mt-0.5">{node.uptime}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-600">อัพเดต</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{node.lastUpdate}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-600">ประเภทน้ำมัน</div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{node.fuelType}</div>
              </div>
            </div>

            {node.status === 'WARNING' && (
              <div className="flex items-start gap-2 px-2.5 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <AlertTriangle size={11} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-[9px] text-yellow-400 leading-relaxed">
                  ความดันต่ำใกล้ขีดจำกัด — ตรวจสอบวาล์ว V-14 และสั่งเปิดใบงาน WO-2024-088
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
