import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import {
  TrendingUp, Truck, Ship, Gauge, ShieldAlert, AlertTriangle,
  CheckCircle2, Activity, ArrowRight,
} from 'lucide-react';
import { trucks, vessels, alerts, pipelineNodes, volumeChartData } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const discrepancy = payload[0]?.value - (payload[1]?.value ?? 0);
    const pct = payload[0]?.value ? ((discrepancy / payload[0].value) * 100).toFixed(2) : 0;
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-xs font-mono shadow-xl">
        <p className="text-slate-300 font-bold mb-2">{label}</p>
        <p className="text-cyan-400">Origin: {payload[0]?.value?.toLocaleString()} L</p>
        <p className="text-green-400">Destination: {payload[1]?.value?.toLocaleString()} L</p>
        <div className={`mt-2 pt-2 border-t border-slate-700 ${Math.abs(discrepancy) > 125 ? 'text-red-400' : 'text-green-400'}`}>
          Δ Discrepancy: {discrepancy.toLocaleString()} L ({pct}%)
        </div>
      </div>
    );
  }
  return null;
};

const KpiCard = ({ icon: Icon, label, value, sub, color, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-slate-800/60 border ${color} rounded-xl p-4 relative overflow-hidden cursor-pointer hover:bg-slate-800 transition-all duration-200 group`}
  >
    <div className="flex items-start justify-between">
      <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</div>
        <div className="text-2xl font-bold text-slate-100 mt-1 leading-none">{value}</div>
        {sub && <div className="text-[10px] text-slate-500 mt-1">{sub}</div>}
      </div>
      <div className={`p-2.5 rounded-lg bg-slate-700/50 group-hover:scale-110 transition-transform`}>
        <Icon size={20} className="text-slate-300" />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30" />
  </div>
);

export default function Overview({ setActiveTab }) {
  const alertCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged).length;
  const activeTrips = trucks.filter((t) => t.status === 'IN_TRANSIT').length;
  const alertTrucks = trucks.filter((t) => t.status === 'ALERT').length;
  const totalVolume = trucks.reduce((s, t) => s + t.loadedVolume, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100">ภาพรวมระบบติดตาม</h1>
          <p className="text-xs text-slate-500 mt-0.5">National Fuel Compliance & Tracking System — 10 เม.ย. 2569</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
          <Activity size={12} className="text-green-400 blink" />
          <span className="text-[10px] text-green-400 font-mono">OPERATIONAL</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={TrendingUp}
          label="ปริมาณขนส่งวันนี้"
          value={`${(totalVolume / 1000).toFixed(0)}K L`}
          sub="จาก 6 เส้นทาง"
          color="border-slate-700 hover:border-cyan-500/40"
          onClick={() => setActiveTab('trucks')}
        />
        <KpiCard
          icon={Truck}
          label="รถกำลังวิ่ง"
          value={`${activeTrips} / ${trucks.length}`}
          sub={`${alertTrucks} คันมีการแจ้งเตือน`}
          color={alertTrucks > 0 ? 'border-red-500/30 hover:border-red-500/60' : 'border-slate-700'}
          onClick={() => setActiveTab('trucks')}
        />
        <KpiCard
          icon={ShieldAlert}
          label="การแจ้งเตือน (ค้าง)"
          value={`${alertCount}`}
          sub={`${criticalCount} วิกฤต / ${alertCount - criticalCount} เฝ้าระวัง`}
          color={criticalCount > 0 ? 'border-red-500/40 hover:border-red-500/60' : 'border-yellow-500/30'}
          onClick={() => setActiveTab('alerts')}
        />
        <KpiCard
          icon={Gauge}
          label="Pipeline Flow"
          value="12,480"
          sub="L/hr — ทุกสถานีปกติ"
          color="border-slate-700 hover:border-cyan-500/40"
          onClick={() => setActiveTab('pipeline')}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Volume Reconciliation Chart */}
        <div className="xl:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Volume Reconciliation</h2>
              <p className="text-[10px] text-slate-500">Origin vs Destination — ตรวจสอบปริมาณน้ำมัน (ลิตร)</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={10} className="text-red-400" />
              <span className="text-[9px] text-red-400 font-mono">1 ผิดปกติ</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={volumeChartData} barCategoryGap="30%" barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="short"
                tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#94a3b8', paddingTop: 8 }}
              />
              <Bar dataKey="origin" name="Origin (บรรจุ)" fill="#06b6d4" radius={[3, 3, 0, 0]}>
                {volumeChartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.discrepancy > 500 ? '#f87171' : '#06b6d4'}
                  />
                ))}
              </Bar>
              <Bar dataKey="destination" name="Destination (รับ)" fill="#22c55e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-600">
            <AlertTriangle size={9} className="text-red-400" />
            แถบสีแดง = ปริมาณขาดหายเกิน 0.5% (เกณฑ์กรมสรรพสามิต)
          </div>
        </div>

        {/* Alert Summary */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">การแจ้งเตือนล่าสุด</h2>
            <button
              onClick={() => setActiveTab('alerts')}
              className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300"
            >
              ดูทั้งหมด <ArrowRight size={10} />
            </button>
          </div>
          <div className="space-y-2">
            {alerts.filter((a) => !a.acknowledged).slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg border
                  ${alert.severity === 'CRITICAL'
                    ? 'bg-red-500/5 border-red-500/20'
                    : alert.severity === 'WARNING'
                    ? 'bg-yellow-500/5 border-yellow-500/20'
                    : 'bg-blue-500/5 border-blue-500/20'
                  }`}
              >
                <div className={`mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                  alert.severity === 'CRITICAL' ? 'bg-red-400 pulse-critical' :
                  alert.severity === 'WARNING' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-semibold leading-tight truncate ${
                    alert.severity === 'CRITICAL' ? 'text-red-400' :
                    alert.severity === 'WARNING' ? 'text-yellow-400' : 'text-blue-400'
                  }`}>
                    {alert.title}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5 font-mono">{alert.entityId} · {alert.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Fleet Status Summary */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Fleet Status</div>
            <div className="space-y-2">
              {[
                { label: 'IN_TRANSIT', count: trucks.filter((t) => t.status === 'IN_TRANSIT').length, color: 'text-cyan-400', dot: 'bg-cyan-400' },
                { label: 'ALERT', count: trucks.filter((t) => t.status === 'ALERT').length, color: 'text-red-400', dot: 'bg-red-400 pulse-critical' },
                { label: 'DELIVERED', count: trucks.filter((t) => t.status === 'DELIVERED').length, color: 'text-green-400', dot: 'bg-green-400' },
              ].map(({ label, count, color, dot }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`status-dot ${dot}`} />
                    <span className={`text-[10px] font-mono ${color}`}>{label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{count} คัน</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vessel Status */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">Vessel Status</div>
            <div className="space-y-2">
              {vessels.map((v) => (
                <div key={v.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`status-dot ${v.status === 'ALERT' ? 'bg-red-400 pulse-critical' : v.status === 'APPROACHING' ? 'bg-yellow-400' : 'bg-cyan-400'}`} />
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{v.name.split(' ').slice(-1)[0]}</span>
                  </div>
                  <span className={`text-[9px] font-mono ${v.status === 'ALERT' ? 'text-red-400' : v.status === 'APPROACHING' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Quick View */}
      <div className="grid grid-cols-3 gap-4">
        {pipelineNodes.map((node) => (
          <div
            key={node.id}
            className={`bg-slate-800/60 border rounded-xl p-4 ${
              node.status === 'WARNING' ? 'border-yellow-500/30' : 'border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-slate-500 font-mono">{node.id}</div>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                node.status === 'WARNING'
                  ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                  : 'text-green-400 bg-green-500/10 border-green-500/20'
              }`}>
                {node.status}
              </span>
            </div>
            <div className="text-xs font-medium text-slate-300 leading-tight mb-3">{node.name}</div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="text-slate-500">Pressure</span>
                  <span className={node.status === 'WARNING' ? 'text-yellow-400' : 'text-slate-300'}>
                    {node.pressure} PSI
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${node.status === 'WARNING' ? 'bg-yellow-400' : 'bg-cyan-400'}`}
                    style={{ width: `${((node.pressure - node.pressureMin) / (node.pressureMax - node.pressureMin)) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[9px] mb-1">
                  <span className="text-slate-500">Flow Rate</span>
                  <span className="text-slate-300">{node.flowRate.toLocaleString()} L/hr</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: `${((node.flowRate - node.flowMin) / (node.flowMax - node.flowMin)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
