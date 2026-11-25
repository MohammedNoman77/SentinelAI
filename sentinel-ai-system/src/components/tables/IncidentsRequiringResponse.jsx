// ============================================
// SentinelAI - Incidents Requiring Response (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { Bug, Lock, Database, Zap, UserX, FileText, Globe, AlertTriangle } from 'lucide-react';
import { getIncidentsForResponse } from '../../services/responseService';

const getIcon = (type) => {
  if (!type) return AlertTriangle;
  if (type.includes('Malware') || type.includes('Trojan')) return Bug;
  if (type.includes('Access') || type.includes('Login')) return UserX;
  if (type.includes('Data')) return Database;
  if (type.includes('Execution') || type.includes('PowerShell')) return Zap;
  if (type.includes('Phishing')) return Globe;
  if (type.includes('Policy')) return FileText;
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
};

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  INVESTIGATING: 'Investigating',
  CONTAINMENT: 'Containment',
  RESOLVED: 'Resolved',
};

const IncidentsRequiringResponse = ({ onSelectIncident, selectedId }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getIncidentsForResponse();
        setIncidents(result.data.incidents);
      } catch (err) {
        console.error('Failed to fetch incidents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Incidents Requiring Response</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            الحوادث التي تحتاج إلى استجابة
          </p>
        </div>
        <select className="bg-sentinel-panel-light border border-sentinel-border rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 outline-none">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
        </select>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading incidents...</div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sentinel-text-dim text-sm">لا توجد حوادث</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-sentinel-text-dim border-b border-sentinel-border">
                <th className="pb-3 font-medium w-8">
                  <input type="checkbox" className="rounded bg-sentinel-panel-light border-sentinel-border" />
                </th>
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Detected At</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => {
                const Icon = getIcon(incident.type);
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
                    <td className="py-3 text-xs text-sentinel-text-dim font-mono whitespace-nowrap">{incident.id}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-sentinel-text-dim flex-shrink-0" />
                        <span className="text-sm text-white">{incident.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-sentinel-text-dim">{incident.type}</td>
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
                    <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">{incident.detectedAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncidentsRequiringResponse;