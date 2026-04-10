import { useState } from 'react';
import {
  LayoutDashboard, Truck, Ship, Gauge, Bell, ShieldAlert,
  Activity, ChevronRight, Fuel, Menu, X, Radio,
} from 'lucide-react';
import { alerts } from '../data/mockData';

const navItems = [
  { id: 'overview', label: 'ภาพรวมระบบ', sublabel: 'Overview', icon: LayoutDashboard },
  { id: 'pipeline', label: 'ระบบท่อ', sublabel: 'Pipeline Monitor', icon: Gauge },
  { id: 'trucks', label: 'กองรถบรรทุก', sublabel: 'Truck Fleet', icon: Truck },
  { id: 'vessels', label: 'เรือขนส่ง (AIS)', sublabel: 'Vessel Tracking', icon: Ship },
  { id: 'alerts', label: 'ศูนย์แจ้งเตือน', sublabel: 'Alert Center', icon: ShieldAlert },
];

const statusColors = {
  CRITICAL: 'text-red-400',
  WARNING: 'text-yellow-400',
  INFO: 'text-blue-400',
};

export default function Layout({ activeTab, setActiveTab, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alertPanelOpen, setAlertPanelOpen] = useState(false);

  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
  const criticalCount = unacknowledgedAlerts.filter((a) => a.severity === 'CRITICAL').length;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-900 bg-grid">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 flex flex-col bg-slate-950 border-r border-slate-800 transition-all duration-300 overflow-hidden`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800 min-h-[64px]">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center glow-cyan">
            <Fuel size={16} className="text-cyan-400" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-cyan-400 tracking-widest leading-none">NFCTS</div>
              <div className="text-[9px] text-slate-500 tracking-wider leading-none mt-0.5">FUEL COMPLIANCE</div>
            </div>
          )}
        </div>

        {/* System Status */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <Radio size={10} className="text-green-400 blink" />
              <span className="text-green-400">SYSTEM ONLINE</span>
            </div>
            <div className="text-[10px] text-slate-600 mt-1 font-mono">
              10 เม.ย. 2569 — {timeStr}
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map(({ id, label, sublabel, icon: Icon }) => {
            const isActive = activeTab === id;
            const badgeCount = id === 'alerts' ? unacknowledgedAlerts.length : 0;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                  }`}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  <Icon size={18} />
                </div>
                {sidebarOpen && (
                  <>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className={`text-xs font-medium leading-none ${isActive ? 'text-cyan-400' : ''}`}>{label}</div>
                      <div className="text-[9px] text-slate-600 mt-0.5 leading-none">{sublabel}</div>
                    </div>
                    {badgeCount > 0 && (
                      <span className="flex-shrink-0 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                        {badgeCount}
                      </span>
                    )}
                    {isActive && <ChevronRight size={12} className="flex-shrink-0 text-cyan-500" />}
                  </>
                )}
                {!sidebarOpen && badgeCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-[8px] font-bold flex items-center justify-center text-white">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-t border-slate-800">
            <div className="text-[9px] text-slate-700 text-center">
              กรมสรรพสามิต — กระทรวงการคลัง
            </div>
            <div className="text-[9px] text-slate-700 text-center">
              EXCISE DEPT. • v2.4.1-PROD
            </div>
          </div>
        )}
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-slate-950/80 border-b border-slate-800 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <div className="text-sm font-semibold text-slate-200 leading-none">
                {navItems.find((n) => n.id === activeTab)?.label}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {navItems.find((n) => n.id === activeTab)?.sublabel}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <Activity size={12} className="text-green-400 blink" />
              <span className="text-[10px] text-green-400 font-mono">LIVE</span>
            </div>

            {/* Alert Bell */}
            <button
              onClick={() => setAlertPanelOpen(!alertPanelOpen)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <Bell size={18} className={criticalCount > 0 ? 'text-red-400 pulse-critical' : 'text-slate-400'} />
              {unacknowledgedAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                  {unacknowledgedAlerts.length}
                </span>
              )}
            </button>

            {/* User */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <span className="text-[10px] text-cyan-400 font-bold">AD</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-[11px] text-slate-300 font-medium leading-none">Admin</div>
                <div className="text-[9px] text-slate-600 mt-0.5">กรมสรรพสามิต</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          {children}
        </main>
      </div>

      {/* Alert Dropdown Panel */}
      {alertPanelOpen && (
        <div className="absolute top-14 right-6 z-50 w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-red-400" />
              <span className="text-xs font-semibold text-slate-200">การแจ้งเตือนล่าสุด</span>
            </div>
            <button onClick={() => setAlertPanelOpen(false)}>
              <X size={14} className="text-slate-400 hover:text-slate-200" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.filter((a) => !a.acknowledged).map((alert) => (
              <div
                key={alert.id}
                className={`px-4 py-3 border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer
                  ${alert.severity === 'CRITICAL' ? 'border-l-2 border-l-red-500' : 'border-l-2 border-l-yellow-500'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className={`text-[10px] font-bold ${statusColors[alert.severity]}`}>
                      [{alert.severity}] {alert.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                      {alert.message}
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono flex-shrink-0">{alert.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
