// ============================================
// SentinelAI - Threat Details Panel
// لوحة تفاصيل التهديد مع MITRE ATT&CK
// ============================================

import { useState } from 'react';
import {
  X,
  Bug,
  Search,
  ShieldCheck,
  MoreHorizontal,
  Monitor,
  User,
  Calendar,
  FileText,
  Copy,
  Globe,
  ShieldAlert,
  Layers,
} from 'lucide-react';

const ThreatDetailsPanel = ({ threat, onClose }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Technical Details', 'Affected Entities', 'Mitigation'];

  if (!threat) {
    return (
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-sentinel-text-dim mx-auto mb-3" />
          <p className="text-sentinel-text-dim text-sm">
            اختر تهديداً من الجدول لعرض تفاصيله
          </p>
        </div>
      </div>
    );
  }

  // بيانات MITRE ATT&CK (تجريبية)
  const mitreInfo = {
    technique: 'T1059',
    name: 'Command and Scripting Interpreter',
  };

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <Bug className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white truncate">
                {threat.name}
              </h3>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${
                threat.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''
              }`}>
                {threat.severity}
              </span>
            </div>
            <p className="text-xs text-sentinel-text-dim mt-0.5">
              {threat.type} detected
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

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'Overview' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-sentinel-text-dim uppercase tracking-wider mb-2">
                Description
              </h4>
              <p className="text-sm text-sentinel-text-dim leading-relaxed">
                {threat.name} detected on endpoint {threat.source}. The file
                attempts to establish an outbound connection to a known malicious
                IP address.
              </p>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-sentinel-border">
              <DetailRow icon={ShieldAlert} label="Threat Type" value={threat.type} />
              <DetailRow
                icon={Layers}
                label="Severity"
                value={threat.severity}
                valueClass={
                  threat.severity === 'Critical'
                    ? 'text-red-400'
                    : threat.severity === 'High'
                    ? 'text-orange-400'
                    : 'text-yellow-400'
                }
              />
              <DetailRow
                icon={ShieldCheck}
                label="Status"
                value={threat.status}
                valueClass="text-red-400"
              />
              <DetailRow
                icon={Calendar}
                label="Detected At"
                value={threat.time}
              />
              <DetailRow
                icon={Monitor}
                label="Source"
                value={threat.source}
              />
              <DetailRow
                icon={Globe}
                label="Malicious IP"
                value="185.199.110.3"
                copyable
              />
              <DetailRow
                icon={FileText}
                label="File Hash"
                value="3f2a6b...e9c4d1"
                copyable
              />
              <DetailRow
                icon={User}
                label="Affected User"
                value="ahmed.s"
              />
              <DetailRow
                icon={Layers}
                label="MITRE ATT&CK"
                value={`${mitreInfo.technique} - ${mitreInfo.name}`}
              />
            </div>
          </div>
        )}

        {activeTab === 'Technical Details' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border">
              <p className="text-xs text-sentinel-text-dim mb-1">File Path</p>
              <p className="text-xs text-white font-mono break-all">
                C:\Users\ahmed.s\AppData\Local\Temp\svchost.exe
              </p>
            </div>
            <div className="p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border">
              <p className="text-xs text-sentinel-text-dim mb-1">Process Command</p>
              <p className="text-xs text-white font-mono break-all">
                powershell.exe -enc JABzAD0A...
              </p>
            </div>
            <div className="p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border">
              <p className="text-xs text-sentinel-text-dim mb-1">Registry Key</p>
              <p className="text-xs text-white font-mono break-all">
                HKCU\Software\Microsoft\Windows\CurrentVersion\Run
              </p>
            </div>
          </div>
        )}

        {activeTab === 'Affected Entities' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-white">WS-1042</span>
              </div>
              <span className="text-[10px] text-sentinel-text-dim">Device</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white">ahmed.s</span>
              </div>
              <span className="text-[10px] text-sentinel-text-dim">User</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-400" />
                <span className="text-xs text-white font-mono">185.199.110.3</span>
              </div>
              <span className="text-[10px] text-sentinel-text-dim">IP</span>
            </div>
          </div>
        )}

        {activeTab === 'Mitigation' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sentinel-text-dim uppercase tracking-wider mb-2">
              Recommended Actions
            </h4>
            {[
              'Isolate affected endpoint WS-1042',
              'Add IP 185.199.110.3 to blocklist',
              'Terminate malicious process',
              'Quarantine infected file',
              'Scan for similar activity across network',
            ].map((action, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border"
              >
                <span className="text-xs text-white">{action}</span>
                <button className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-medium hover:bg-cyan-500/30 transition-colors">
                  Run
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-sentinel-border">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors">
          <Search className="w-3.5 h-3.5" />
          View in Investigation
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors">
          <ShieldAlert className="w-3.5 h-3.5" />
          Add to Blocklist
        </button>
        <button className="p-2 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// مكون مساعد
// ============================================
const DetailRow = ({ icon: Icon, label, value, copyable, valueClass = 'text-white' }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-sentinel-text-dim" />
      <span className="text-xs text-sentinel-text-dim">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs font-mono ${valueClass}`}>{value}</span>
      {copyable && (
        <button className="text-sentinel-text-dim hover:text-cyan-400 transition-colors">
          <Copy className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
);

export default ThreatDetailsPanel;