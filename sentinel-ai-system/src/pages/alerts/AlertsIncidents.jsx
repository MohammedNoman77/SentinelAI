// ============================================
// SentinelAI - Alerts & Incidents Page (Real Data)
// ============================================

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import IncidentsTable from '../../components/tables/IncidentsTable';
import IncidentDetailsPanel from '../../components/common/IncidentDetailsPanel';
import { getIncidentStats } from '../../services/incidentsService';
import { AlertTriangle, Target, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const AlertsIncidents = () => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getIncidentStats();
        setStats(result.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Incidents',
      value: stats.total.toString(),
      change: '+18%',
      icon: AlertTriangle,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Critical',
      value: stats.critical.toString(),
      change: '+33%',
      icon: Target,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      title: 'High',
      value: stats.high.toString(),
      change: '+12%',
      icon: TrendingUp,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      title: 'In Progress',
      value: stats.inProgress.toString(),
      change: '+25%',
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Resolved',
      value: stats.resolved.toString(),
      change: '+40%',
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
  ];

  return (
    <DashboardLayout
      title="Alerts & Incidents"
      subtitle="Detect, prioritize, and manage security incidents."
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-sentinel-panel border border-sentinel-border rounded-xl p-4 hover:border-cyan-400/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-sentinel-text-dim">{stat.title}</p>
                <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-[10px] text-green-400">
                ↑ {stat.change}{' '}
                <span className="text-sentinel-text-dim">vs. last 7 days</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <IncidentsTable
            onSelectIncident={setSelectedIncident}
            selectedId={selectedIncident?.id}
          />
        </div>
        <div>
          <IncidentDetailsPanel
            incident={selectedIncident}
            onClose={() => setSelectedIncident(null)}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AlertsIncidents;