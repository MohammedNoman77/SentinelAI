// ============================================
// SentinelAI - Endpoint Details Panel
// لوحة تفاصيل نقطة النهاية
// ============================================

import { useState } from 'react';
import {
  X,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  User,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Search,
  Lock,
} from 'lucide-react';

const EndpointDetailsPanel = ({ endpoint, onClose }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Processes', 'Network', 'Timeline'];

  if (!endpoint) {
    return (
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Monitor className="w-12 h-12 text-sentinel-text-dim mx-auto mb-3" />
          <p className="text-sentinel-text-dim text-sm">
            اختر جهازاً من الجدول لعرض تفاصيله
          </p>
        </div>
      </div>
    );
  }

  const isProtected = endpoint.status === 'Protected';
  const isIsolated = endpoint.status === 'Isolated';
  const isAtRisk = endpoint.status === 'At Risk';

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isProtected ? 'bg-green-500/10' :
            isIsolated ? 'bg-red-500/10' :
            'bg-orange-500/10'
          }`}>
            <Monitor className={`w-5 h-5 ${
              isProtected ? 'text-green-400' :
              isIsolated ? 'text-red-400' :
              'text-orange-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate">
              {endpoint.hostname}
            </h3>
            <p className="text-xs text-sentinel-text-dim font-mono mt-0.5">
              {endpoint.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-4 pb-4 border-b border-sentinel-border">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isProtected ? 'bg-green-500/10 border border-green-500/30' :
          isIsolated ? 'bg-red-500/10 border border-red-500/30' :
          'bg-orange-500/10 border border-orange-500/30'
        }`}>
          {isProtected && <ShieldCheck className="w-4 h-4 text-green-400" />}
          {isIsolated && <Lock className="w-4 h-4 text-red-400" />}
          {isAtRisk && <ShieldAlert className="w-4 h-4 text-orange-400" />}
          <span className={`text-xs font-medium ${
            isProtected ? 'text-green-400' :
            isIsolated ? 'text-red-400' :
            'text-orange-400'
          }`}>
            {endpoint.status}
          </span>
          <span className="text-[10px] text-sentinel-text-dim ml-auto">
            Agent v{endpoint.agentVersion}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-sentinel-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-2 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab
                ? 'text-cyan-400 border-cyan-400'
                : 'text-sentinel-text-dim border-transparent hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Overview' && (
          <div className="space-y-2.5">
            <DetailRow icon={Cpu} label="Operating System" value={endpoint.os} />
            <DetailRow icon={Wifi} label="IP Address" value={endpoint.ip} />
            <DetailRow icon={User} label="Primary User" value={endpoint.user} />
            <DetailRow icon={Calendar} label="Last Seen" value={endpoint.lastSeen} />
            <DetailRow
              icon={ShieldAlert}
              label="Active Threats"
              value={String(endpoint.threats)}
              valueClass={endpoint.threats > 0 ? 'text-red-400' : 'text-green-400'}
            />
            <DetailRow icon={HardDrive} label="Disk Usage" value="256 GB / 512 GB" />
            <DetailRow icon={Activity} label="CPU Usage" value="32%" />
            <DetailRow icon={Shield} label="Firewall" value="Enabled" valueClass="text-green-400" />
            <DetailRow icon={Shield} label="Antivirus" value="Active" valueClass="text-green-400" />
          </div>
        )}

        {activeTab === 'Processes' && (
          <div className="space-y-2">
            {[
              { name: 'powershell.exe', pid: 4821, cpu: '12%', memory: '84 MB', risk: 'High' },
              { name: 'svchost.exe', pid: 1204, cpu: '2%', memory: '45 MB', risk: 'Low' },
              { name: 'chrome.exe', pid: 8321, cpu: '8%', memory: '512 MB', risk: 'Low' },
              { name: 'explorer.exe', pid: 2048, cpu: '1%', memory: '120 MB', risk: 'Low' },
              { name: 'cmd.exe', pid: 9042, cpu: '3%', memory: '12 MB', risk: 'Medium' },
            ].map((proc, i) => (
              <div key={i} className="p-3 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white font-mono">{proc.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    proc.risk === 'High' ? 'bg-red-500/20 text-red-400' :
                    proc.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {proc.risk}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-sentinel-text-dim font-mono">
                  <span>PID: {proc.pid}</span>
                  <span>CPU: {proc.cpu}</span>
                  <span>MEM: {proc.memory}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Network' && (
          <div className="space-y-2">
            {[
              { remote: '185.199.110.3', port: 443, status: 'Blocked', bytes: '2.4 MB' },
              { remote: '8.8.8.8', port: 53, status: 'Allowed', bytes: '128 KB' },
              { remote: '52.186.120.4', port: 8080, status: 'Suspicious', bytes: '12 MB' },
              { remote: '10.0.0.5', port: 5432, status: 'Allowed', bytes: '456 KB' },
            ].map((conn, i) => (
              <div key={i} className="p-3 rounded-lg bg-sentinel-panel-light/40 border border-sentinel-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white font-mono">{conn.remote}:{conn.port}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    conn.status === 'Blocked' ? 'bg-red-500/20 text-red-400' :
                    conn.status === 'Suspicious' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {conn.status}
                  </span>
                </div>
                <p className="text-[10px] text-sentinel-text-dim font-mono">Data: {conn.bytes}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Timeline' && (
          <div className="space-y-3">
            {[
              { time: '10:14 AM', event: 'Malware detected', color: 'bg-red-500' },
              { time: '09:47 AM', event: 'Suspicious process started', color: 'bg-orange-500' },
              { time: '08:32 AM', event: 'User logged in', color: 'bg-blue-500' },
              { time: '07:15 AM', event: 'Agent updated to v4.2.1', color: 'bg-green-500' },
              { time: '06:00 AM', event: 'System scan completed', color: 'bg-cyan-500' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  {i < 4 && <div className="w-px flex-1 bg-sentinel-border my-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white">{item.event}</span>
                    <span className="text-[10px] text-sentinel-text-dim font-mono">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-sentinel-border">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors">
          <Search className="w-3.5 h-3.5" />
          Investigate
        </button>
        {isIsolated ? (
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" />
            Restore
          </button>
        ) : (
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors">
            <Lock className="w-3.5 h-3.5" />
            Isolate
          </button>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, value, valueClass = 'text-white' }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-sentinel-text-dim" />
      <span className="text-xs text-sentinel-text-dim">{label}</span>
    </div>
    <span className={`text-xs font-mono ${valueClass}`}>{value}</span>
  </div>
);

export default EndpointDetailsPanel;