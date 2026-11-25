// ============================================
// SentinelAI - Detected Threats Table (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import { Bug, ShieldAlert, Zap, Globe, Lock, UserX, AlertTriangle } from 'lucide-react';
import { getThreats } from '../../services/threatsService';

const getIcon = (type) => {
  if (type === 'Malware') return Bug;
  if (type === 'Suspicious Activity') return Zap;
  if (type === 'Known Threat') return Globe;
  if (type === 'Policy Violation') return ShieldAlert;
  return AlertTriangle;
};

const severityStyles = {
  CRITICAL: 'bg-red-500/20 text-red-400 border border-red-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  LOW: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

const statusStyles = {
  detected: 'bg-red-500/20 text-red-400',
  investigating: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-green-500/20 text-green-400',
  blocked: 'bg-purple-500/20 text-purple-400',
};

const statusLabels = {
  detected: 'Detected',
  investigating: 'Investigating',
  resolved: 'Resolved',
  blocked: 'Blocked',
};

const DetectedThreatsTable = ({ onSelectThreat, selectedId }) => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ severity: 'All', search: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.severity !== 'All') params.severity = filters.severity;
        if (filters.search) params.search = filters.search;

        const result = await getThreats(params);
        setThreats(result.data.threats);
      } catch (err) {
        console.error('Failed to fetch threats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  return (
    <div className="bg-sentinel-panel border border-sentinel-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Detected Threats</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">التهديدات المكتشفة</p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading threats...</div>
        </div>
      ) : threats.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sentinel-text-dim text-sm">لا توجد تهديدات</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-sentinel-text-dim border-b border-sentinel-border">
                <th className="pb-3 font-medium w-8">
                  <input type="checkbox" className="rounded bg-sentinel-panel-light border-sentinel-border" />
                </th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Threat Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((threat) => {
                const Icon = getIcon(threat.type);
                const isSelected = selectedId === threat.name;

                return (
                  <tr
                    key={threat.id}
                    onClick={() => onSelectThreat(threat)}
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
                    <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">
                      {threat.detectedAt}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-sentinel-text-dim flex-shrink-0" />
                        <span className="text-sm text-white">{threat.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">
                      {threat.type}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${severityStyles[threat.severity]}`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-sentinel-text-dim font-mono">
                      {threat.source}
                    </td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${statusStyles[threat.status] || 'bg-gray-500/20 text-gray-400'}`}>
                        {statusLabels[threat.status] || threat.status}
                      </span>
                    </td>
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

export default DetectedThreatsTable;