// ============================================
// SentinelAI - Incidents Table
// جدول الحوادث الأمنية
// UC-01-04: Manage Security Incident
// ============================================

import { useState } from 'react';
import { AlertTriangle, Shield, FileText, Zap, Bug, Lock, UserX, Database, Mail } from 'lucide-react';

const incidentsData = [
  {
    id: 'INC-2026-1042',
    title: 'Suspicious login from new location',
    severity: 'High',
    status: 'Open',
    source: 'Azure AD',
    date: 'Sep 20, 2026',
    time: '10:14 AM',
    icon: UserX,
  },
  {
    id: 'INC-2026-1041',
    title: 'Malware detected on endpoint',
    severity: 'Critical',
    status: 'In Progress',
    source: 'EDR',
    date: 'Sep 20, 2026',
    time: '09:47 AM',
    icon: Bug,
  },
  {
    id: 'INC-2026-1040',
    title: 'Unusual data access pattern',
    severity: 'Medium',
    status: 'Open',
    source: 'Data Gateway',
    date: 'Sep 20, 2026',
    time: '08:32 AM',
    icon: Database,
  },
  {
    id: 'INC-2026-1039',
    title: 'Multiple failed login attempts',
    severity: 'High',
    status: 'Investigating',
    source: 'Firewall',
    date: 'Sep 20, 2026',
    time: '07:21 AM',
    icon: Lock,
  },
  {
    id: 'INC-2026-1038',
    title: 'Suspicious process execution',
    severity: 'Medium',
    status: 'Resolved',
    source: 'EDR',
    date: 'Sep 20, 2026',
    time: '06:55 AM',
    icon: Zap,
  },
  {
    id: 'INC-2026-1037',
    title: 'Possible phishing activity',
    severity: 'High',
    status: 'Open',
    source: 'Email Security',
    date: 'Sep 20, 2026',
    time: '05:18 AM',
    icon: Mail,
  },
  {
    id: 'INC-2026-1036',
    title: 'Policy violation: USB device',
    severity: 'Low',
    status: 'Closed',
    source: 'DLP',
    date: 'Sep 20, 2026',
    time: '03:44 AM',
    icon: Shield,
  },
  {
    id: 'INC-2026-1035',
    title: 'Data exfiltration attempt',
    severity: 'Critical',
    status: 'In Progress',
    source: 'Proxy',
    date: 'Sep 19, 2026',
    time: '11:20 PM',
    icon: FileText,
  },
  {
    id: 'INC-2026-1034',
    title: 'C2 connection detected',
    severity: 'High',
    status: 'Open',
    source: 'NDR',
    date: 'Sep 19, 2026',
    time: '09:16 PM',
    icon: AlertTriangle,
  },
  {
    id: 'INC-2026-1033',
    title: 'Unusual privilege escalation',
    severity: 'Medium',
    status: 'Investigating',
    source: 'Identity',
    date: 'Sep 19, 2026',
    time: '08:03 PM',
    icon: UserX,
  },
];

const severityStyles = {
  Critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

const statusStyles = {
  Open: 'bg-blue-500/20 text-blue-400',
  'In Progress': 'bg-purple-500/20 text-purple-400',
  Investigating: 'bg-yellow-500/20 text-yellow-400',
  Resolved: 'bg-green-500/20 text-green-400',
  Closed: 'bg-gray-500/20 text-gray-400',
};

const IncidentsTable = ({ onSelectIncident, selectedId }) => {
  const [activeTab, setActiveTab] = useState('All Incidents');

  const tabs = ['All Incidents', 'My Incidents', 'Unassigned'];

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Incidents</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">الحوادث الأمنية</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium transition-all">
          + Create Incident
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-sentinel-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-cyan-400 border-cyan-400'
                : 'text-sentinel-text-dim border-transparent hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 mb-4">
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>Last 7 days</option>
          <option>Last 24 hours</option>
          <option>Last 30 days</option>
        </select>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>All Statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-sentinel-text-dim border-b border-sentinel-border">
              <th className="pb-3 font-medium w-8">
                <input type="checkbox" className="rounded bg-sentinel-panel-light border-sentinel-border" />
              </th>
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Title</th>
              <th className="pb-3 font-medium">Severity</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Source</th>
              <th className="pb-3 font-medium">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {incidentsData.map((incident) => {
              const Icon = incident.icon;
              const isSelected = selectedId === incident.id;

              return (
                <tr
                  key={incident.id}
                  onClick={() => onSelectIncident(incident)}
                  className={`border-b border-sentinel-border/50 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400'
                      : 'hover:bg-sentinel-panel-light/50'
                  }`}
                >
                  <td className="py-3">
                    <input
                      type="checkbox"
                      className="rounded bg-sentinel-panel-light border-sentinel-border"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="py-3 text-xs text-sentinel-text-dim font-mono whitespace-nowrap">
                    {incident.id}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-sentinel-text-dim flex-shrink-0" />
                      <span className="text-sm text-white">{incident.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${severityStyles[incident.severity]}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${statusStyles[incident.status]}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-sentinel-text-dim">{incident.source}</td>
                  <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">
                    <div>{incident.date}</div>
                    <div className="text-[10px]">{incident.time}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-sentinel-border">
        <p className="text-xs text-sentinel-text-dim">
          Showing <span className="text-white font-medium">1-10</span> of{' '}
          <span className="text-white font-medium">342</span> incidents
        </p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded text-sentinel-text-dim hover:bg-sentinel-panel-light text-xs">
            ‹
          </button>
          <button className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 text-xs font-medium">1</button>
          <button className="w-8 h-8 rounded text-sentinel-text-dim hover:bg-sentinel-panel-light text-xs">2</button>
          <button className="w-8 h-8 rounded text-sentinel-text-dim hover:bg-sentinel-panel-light text-xs">3</button>
          <button className="w-8 h-8 rounded text-sentinel-text-dim hover:bg-sentinel-panel-light text-xs">4</button>
          <button className="w-8 h-8 rounded text-sentinel-text-dim hover:bg-sentinel-panel-light text-xs">
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentsTable;