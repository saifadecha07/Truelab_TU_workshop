import { useState } from 'react';
import {
  ShieldAlert, AlertTriangle, Info, CheckCircle2, Clock, Filter,
  Truck, Ship, Gauge, Bell, X, Eye,
} from 'lucide-react';
import { alerts as initialAlerts } from '../data/mockData';

const severityConfig = {
  CRITICAL: {
    label: 'วิกฤต', icon: ShieldAlert, textColor: 'text-red-400',
    bgColor: 'bg-red-500/5', borderColor: 'border-red-500/20', borderLeft: 'border-l-red-500',
    badgeColor: 'bg-red-500/10 border-red-500/20 text-red-400',
    dotColor: 'bg-red-400 pulse-critical',
  },
  WARNING: {
    label: 'เฝ้าระวัง', icon: AlertTriangle, textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/5', borderColor: 'border-yellow-500/20', borderLeft: 'border-l-yellow-500',
    badgeColor: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    dotColor: 'bg-yellow-400',
  },
  INFO: {
    label: 'ข้อมูล', icon: Info, textColor: 'text-blue-400',
    bgColor: 'bg-blue-500/5', borderColor: 'border-blue-500/20', borderLeft: 'border-l-blue-500',
    badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    dotColor: 'bg-blue-400',
  },
};

const typeConfig = {
  E_SEAL_BREACH: 'e-Seal ถูกเปิด',
  VOLUME_DISCREPANCY: 'ปริมาณผิดปกติ',
  GEOFENCE_BREACH: 'ออกนอกเส้นทาง',
  PRESSURE_DROP: 'ความดันต่ำ',
  AIS_BLACKOUT: 'AIS ขาดหาย',
  SPEED_ANOMALY: 'ความเร็วผิดปกติ',
};

const entityIcon = { TRUCK: Truck, VESSEL: Ship, PIPELINE: Gauge };

export default function AlertCenter() {
  const [alertList, setAlertList] = useState(initialAlerts);
  const [filter, setFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  const acknowledge = (id) => {
    setAlertList((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const acknowledgeAll = () => {
    setAlertList((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  };

  const filtered = alertList.filter((a) => {
    if (filter === 'UNACK') return !a.acknowledged;
    if (filter === 'ALL') return true;
    return a.severity === filter;
  });

  const unackCount = alertList.filter((a) => !a.acknowledged).length;
  const criticalCount = alertList.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged).length;
  const warningCount = alertList.filter((a) => a.severity === 'WARNING' && !a.acknowledged).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-100">ศูนย์แจ้งเตือน</h1>
          <p className="text-xs text-slate-500 mt-0.5">Alert Center — ติดตามความผิดปกติในระบบทั้งหมด</p>
        </div>
        <div className="flex items-center gap-2">
          {unackCount > 0 && (
            <button
              onClick={acknowledgeAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-slate-300 transition-colors"
            >
              <CheckCircle2 size={11} />
              รับทราบทั้งหมด ({unackCount})
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'ค้างรับทราบ', value: unackCount, color: 'border-slate-700 text-slate-200', sub: 'รายการ' },
          { label: 'วิกฤต', value: criticalCount, color: criticalCount > 0 ? 'border-red-500/30 text-red-400' : 'border-slate-700 text-slate-400', sub: 'CRITICAL' },
          { label: 'เฝ้าระวัง', value: warningCount, color: warningCount > 0 ? 'border-yellow-500/30 text-yellow-400' : 'border-slate-700 text-slate-400', sub: 'WARNING' },
          { label: 'ทั้งหมดวันนี้', value: alertList.length, color: 'border-slate-700 text-slate-200', sub: 'รายการ' },
        ].map((s) => (
          <div key={s.label} className={`bg-slate-800/60 border ${s.color} rounded-xl p-4`}>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">{s.label}</div>
            <div className={`text-3xl font-bold mt-1 leading-none ${s.color.includes('text-') ? s.color.split(' ').find(c => c.startsWith('text-')) : 'text-slate-200'}`}>
              {s.value}
            </div>
            <div className="text-[9px] text-slate-600 mt-1 font-mono">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: 'ALL', label: 'ทั้งหมด', count: alertList.length },
          { key: 'UNACK', label: 'ยังไม่รับทราบ', count: unackCount },
          { key: 'CRITICAL', label: 'CRITICAL', count: alertList.filter(a => a.severity === 'CRITICAL').length },
          { key: 'WARNING', label: 'WARNING', count: alertList.filter(a => a.severity === 'WARNING').length },
          { key: 'INFO', label: 'INFO', count: alertList.filter(a => a.severity === 'INFO').length },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all ${
              filter === f.key
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
            <span className="text-slate-600">({f.count})</span>
          </button>
        ))}
      </div>

      {/* Alert Feed */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <CheckCircle2 size={32} className="text-green-500 mx-auto mb-3" />
            <div className="text-sm text-slate-400">ไม่มีการแจ้งเตือนที่ค้างอยู่</div>
          </div>
        )}

        {filtered.map((alert) => {
          const s = severityConfig[alert.severity];
          const SeverityIcon = s.icon;
          const EntityIcon = entityIcon[alert.entityType] || Bell;
          const isExpanded = expandedId === alert.id;

          return (
            <div
              key={alert.id}
              className={`border-l-4 ${s.borderLeft} ${s.borderColor} border border-l-4 rounded-xl overflow-hidden transition-all ${
                alert.acknowledged ? 'opacity-50' : ''
              } ${s.bgColor}`}
            >
              {/* Alert Header */}
              <div className="flex items-start gap-3 px-4 py-3">
                {/* Severity Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${
                  alert.severity === 'CRITICAL' ? 'bg-red-500/10' :
                  alert.severity === 'WARNING' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                }`}>
                  <SeverityIcon size={16} className={s.textColor} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${s.badgeColor}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[9px] font-mono text-slate-600 px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800">
                      {typeConfig[alert.type] || alert.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <EntityIcon size={9} className="text-slate-600" />
                      <span className="text-[9px] text-slate-500 font-mono">{alert.entityId}</span>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold mt-1 leading-tight ${s.textColor}`}>
                    {alert.title}
                  </div>
                  {isExpanded && (
                    <div className="text-[11px] text-slate-400 mt-1.5 leading-relaxed pr-4">
                      {alert.message}
                    </div>
                  )}
                </div>

                {/* Right Side */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock size={9} />
                      {alert.timestamp}
                    </div>
                    {alert.acknowledged && (
                      <div className="text-[9px] text-green-500 mt-0.5 flex items-center gap-1 justify-end">
                        <CheckCircle2 size={8} />
                        รับทราบแล้ว
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                    title="ดูรายละเอียด"
                  >
                    <Eye size={13} className="text-slate-500" />
                  </button>

                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledge(alert.id)}
                      className="p-1.5 rounded-lg hover:bg-green-500/20 transition-colors group"
                      title="รับทราบ"
                    >
                      <CheckCircle2 size={13} className="text-slate-500 group-hover:text-green-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && !alert.acknowledged && (
                <div className="px-4 pb-3 flex items-center gap-2 border-t border-slate-800/50 pt-2.5">
                  <button
                    onClick={() => acknowledge(alert.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-green-400 transition-colors"
                  >
                    <CheckCircle2 size={11} />
                    รับทราบแจ้งเตือนนี้
                  </button>
                  <span className="text-[9px] text-slate-600">·</span>
                  <span className="text-[9px] text-slate-600">Alert ID: {alert.id}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="text-center text-[10px] text-slate-600 font-mono py-2">
          แสดง {filtered.length} รายการ · อัพเดต: {new Date().toLocaleTimeString('th-TH')}
        </div>
      )}
    </div>
  );
}
