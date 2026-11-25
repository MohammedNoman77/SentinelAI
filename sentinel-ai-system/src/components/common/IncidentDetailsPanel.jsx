// ============================================
// SentinelAI - Incident Details Panel (RBAC)
// لوحة تفاصيل الحادث الجانبية
// UC-04-02: Investigate Incident
// ============================================

import { useState } from 'react';
import {
  X,
  Bug,
  Search,
  Zap,
  MoreHorizontal,
  Monitor,
  User,
  Calendar,
  FileText,
  Copy,
  Globe,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const IncidentDetailsPanel = ({ incident, onClose }) => {
  const { canExecuteResponse } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Timeline', 'Related Events', 'Response', 'Comments'];

  if (!incident) {
    return (
      <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-sentinel-text-dim mx-auto mb-3" />
          <p className="text-sentinel-text-dim text-sm">
            اختر حادثة من الجدول لعرض تفاصيلها
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <Bug className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate">
              {incident.title}
            </h3>
            <p className="text-xs text-sentinel-text-dim font-mono mt-0.5">
              {incident.id}
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

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-sentinel-border">
        <div>
          <p className="text-[10px] text-sentinel-text-dim mb-1">Severity</p>
          <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded bg-red-500/20 text-red-400 border border-red-500/30">
            {incident.severity}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-sentinel-text-dim mb-1">Status</p>
          <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded bg-purple-500/20 text-purple-400">
            {incident.status}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-sentinel-text-dim mb-1">Source</p>
          <div className="flex items-center gap-1">
            <Monitor className="w-3 h-3 text-sentinel-text-dim" />
            <span className="text-xs text-white">{incident.source}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-sentinel-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-3 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
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
                {incident.description ||
                  `${incident.title}. The file attempted to establish an outbound connection to a known malicious IP address.`}
              </p>
            </div>

            <div className="space-y-2.5">
              <DetailRow icon={Monitor} label="Affected Device" value={incident.affectedDevice || '—'} />
              <DetailRow icon={User} label="Affected User" value={incident.affectedUser || '—'} />
              <DetailRow
                icon={Calendar}
                label="Detected At"
                value={`${incident.date}, ${incident.time}`}
              />
              <DetailRow
                icon={FileText}
                label="File Hash"
                value={incident.fileHash || '—'}
                copyable
              />
              <DetailRow
                icon={Globe}
                label="Malicious IP"
                value={incident.maliciousIp || '—'}
                copyable
              />
              <DetailRow
                icon={ShieldAlert}
                label="Threat Type"
                value={incident.threatType || '—'}
                valueClass="text-red-400"
              />
            </div>
          </div>
        )}

        {activeTab === 'Timeline' && (
          <div className="space-y-4">
            <TimelineItem
              time="10:14:22"
              title="Malware detected"
              description="Trojan.Win32 identified on endpoint WS-1042"
              color="bg-red-500"
            />
            <TimelineItem
              time="10:14:35"
              title="File quarantined"
              description="Suspicious file moved to quarantine"
              color="bg-yellow-500"
            />
            <TimelineItem
              time="10:15:02"
              title="Connection attempt blocked"
              description="Outbound connection to 185.199.110.3 blocked"
              color="bg-green-500"
            />
            <TimelineItem
              time="10:15:45"
              title="Alert generated"
              description="Incident created automatically"
              color="bg-cyan-500"
            />
          </div>
        )}

        {activeTab === 'Related Events' && (
          <div className="space-y-2">
            <p className="text-xs text-sentinel-text-dim mb-3">
              الأحداث المرتبطة بهذه الحادثة
            </p>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white font-medium">
                    Event #{i}
                  </span>
                  <span className="text-[10px] text-sentinel-text-dim">
                    10:1{i}:00 AM
                  </span>
                </div>
                <p className="text-[10px] text-sentinel-text-dim">
                  Related security event detected
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Response' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sentinel-text-dim uppercase tracking-wider mb-2">
              Recommended Actions
            </h4>
            {[
              'Isolate affected endpoint',
              'Block malicious IP (185.199.110.3)',
              'Terminate malicious process',
              'Reset user credentials',
            ].map((action, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-sentinel-panel-light/50 border border-sentinel-border"
              >
                <span className="text-xs text-white">{action}</span>

                {canExecuteResponse ? (
                  <button className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-medium hover:bg-cyan-500/30 transition-colors">
                    Run
                  </button>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 rounded bg-sentinel-panel-light text-sentinel-text-dim text-[10px] font-medium">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Comments' && (
          <div className="text-center py-8">
            <p className="text-xs text-sentinel-text-dim">
              لا توجد تعليقات حتى الآن
            </p>
          </div>
        )}
      </div>

      {/* Actions Footer - مع RBAC */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-sentinel-border">
        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors">
          <Search className="w-3.5 h-3.5" />
          Investigate
        </button>

        {canExecuteResponse ? (
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-medium hover:bg-orange-500/30 transition-colors">
            <Zap className="w-3.5 h-3.5" />
            Respond
          </button>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-sentinel-panel-light text-sentinel-text-dim text-xs font-medium cursor-not-allowed opacity-60"
            title="يتطلب دور Incident Responder"
          >
            <Lock className="w-3.5 h-3.5" />
            Respond (Locked)
          </button>
        )}

        <button className="p-2 rounded-lg text-sentinel-text-dim hover:text-white hover:bg-sentinel-panel-light transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// Helper Components
// ============================================
const DetailRow = ({ icon: Icon, label, value, copyable, valueClass = 'text-white' }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-sentinel-text-dim" />
      <span className="text-xs text-sentinel-text-dim">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs font-mono ${valueClass}`}>{value}</span>
      {copyable && value && value !== '—' && (
        <button className="text-sentinel-text-dim hover:text-cyan-400 transition-colors">
          <Copy className="w-3 h-3" />
        </button>
      )}
    </div>
  </div>
);

const TimelineItem = ({ time, title, description, color }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center pt-1">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <div className="w-px flex-1 bg-sentinel-border mt-1" />
    </div>
    <div className="flex-1 pb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-white">{title}</span>
        <span className="text-[10px] text-sentinel-text-dim">{time}</span>
      </div>
      <p className="text-[11px] text-sentinel-text-dim">{description}</p>
    </div>
  </div>
);

export default IncidentDetailsPanel;