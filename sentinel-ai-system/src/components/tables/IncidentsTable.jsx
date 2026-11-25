// ============================================
// SentinelAI - Incidents Table (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, FileText, Zap, Bug, Lock, UserX, Database, Mail } from 'lucide-react';
import { getIncidents } from '../../services/incidentsService';

// أيقونة حسب نوع الحادثة
const getIcon = (threatType) => {
  if (!threatType) return AlertTriangle;
  if (threatType.includes('Malware') || threatType.includes('Trojan')) return Bug;
  if (threatType.includes('Login') || threatType.includes('Access')) return UserX;
  if (threatType.includes('Data')) return Database;
  if (threatType.includes('Phishing')) return Mail;
  if (threatType.includes('PowerShell') || threatType.includes('Process')) return Zap;
  if (threatType.includes('Policy')) return Shield;
  return AlertTriangle;
};

const severityStyles = {
  CRITICAL: 'bg-red-500/20 text-red-400 border border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  LOW: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

const statusStyles = {
  OPEN: 'bg-blue-500/20 text-blue-400',
  IN_PROGRESS: 'bg-purple-500/20 text-purple-400',
  INVESTIGATING: 'bg-yellow-500/20 text-yellow-400',
  CONTAINMENT: 'bg-orange-500/20 text-orange-400',
  RESOLVED: 'bg-green-500/20 text-green-400',
  CLOSED: 'bg-gray-500/20 text-gray-400',
};

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  INVESTIGATING: 'Investigating',
  CONTAINMENT: 'Containment',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const IncidentsTable = ({ onSelectIncident, selectedId }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Incidents');
  const [filters, setFilters] = useState({
    status: 'All',
    severity: 'All',
    search: '',
  });
  const [pagination, setPagination] = useState({ total: 0 });

  const tabs = ['All Incidents', 'My Incidents', 'Unassigned'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.status !== 'All') params.status = filters.status;
        if (filters.severity !== 'All') params.severity = filters.severity;
        if (filters.search) params.search = filters.search;

        const result = await getIncidents(params);
        setIncidents(result.data.incidents);
        setPagination(result.data.pagination);
      } catch (err) {
        console.error('Failed to fetch incidents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

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

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
        >
          <option value="All">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <input
          type="text"
          placeholder="Search incidents..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-cyan-400 outline-none flex-1 max-w-xs"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading incidents...</div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sentinel-text-dim text-sm">لا توجد حوادث مطابقة</p>
        </div>
      ) : (
        <>
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
                {incidents.map((incident) => {
                  const Icon = getIcon(incident.threatType);
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
                          {statusLabels[incident.status] || incident.status}
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
              Showing <span className="text-white font-medium">1-{incidents.length}</span> of{' '}
              <span className="text-white font-medium">{pagination.total}</span> incidents
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentsTable;