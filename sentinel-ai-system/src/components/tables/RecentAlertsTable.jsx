// ============================================
// SentinelAI - Recent Alerts Table
// ============================================

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { getRecentAlerts } from '../../services/dashboardService';

const severityStyles = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LOW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const statusStyles = {
  Open: 'bg-blue-500/20 text-blue-400',
  'In Progress': 'bg-purple-500/20 text-purple-400',
  Resolved: 'bg-green-500/20 text-green-400',
  Closed: 'bg-gray-500/20 text-gray-400',
};

const RecentAlertsTable = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRecentAlerts();
        setAlerts(result.data.alerts);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
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
          <h3 className="text-lg font-bold text-white">Recent Alerts & Incidents</h3>
          <p className="text-xs text-sentinel-text-dim mt-1">
            أحدث التنبيهات والحوادث الأمنية
          </p>
        </div>
        <button className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-cyan-400 text-sm">Loading...</div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-sentinel-text-dim text-sm">لا توجد تنبيهات</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-sentinel-text-dim border-b border-sentinel-border">
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Title</th>
                <th className="pb-3 font-medium">Severity</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, i) => (
                <tr
                  key={i}
                  className="border-b border-sentinel-border/50 hover:bg-sentinel-panel-light/50 transition-colors"
                >
                  <td className="py-3 text-xs text-sentinel-text-dim whitespace-nowrap">
                    {alert.time}
                  </td>
                  <td className="py-3 text-sm text-white pr-4">{alert.title}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded border ${
                        severityStyles[alert.severity] || 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded ${
                        statusStyles[alert.status] || 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentAlertsTable;